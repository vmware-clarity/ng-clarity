/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import {
  ClrComponentContext,
  ClrContextEngineService,
  ClrContextPreset,
  clrContextPreset,
  ClrContextTrackerService,
  ClrMutationEngineService,
  ClrMutationOperation,
} from '@clr/angular/ai';
import { Subscription } from 'rxjs';

interface DemoHost {
  name: string;
  cluster: string;
  status: string;
}

/** A node in the live context that the mutation engine could write to. */
interface WritableTarget {
  ref: string;
  type: string;
  label: string;
}

const EMBEDDED_CHAT_PAGE = `
  <html>
    <body style="font-family: sans-serif; margin: 12px">
      <p style="margin-top: 0">
        I am a plain, non-Angular page inside an iframe (imagine a chat surface). I know nothing about the
        application hosting me, but I can ask it for context over postMessage:
      </p>
      <button id="ask" style="padding: 6px 12px">Request host page context</button>
      <pre id="out" style="background: #f4f4f4; padding: 8px; white-space: pre-wrap"></pre>
      <script>
        // What a hand-written client must do: an unguessable request id, an answer
        // accepted only from the window that was asked and only from its origin, and a
        // request addressed to that origin rather than broadcast.
        var hostOrigin = window.location.origin;
        var requestId = crypto.randomUUID();
        window.addEventListener('message', function (event) {
          var message = event.data;
          if (event.source !== window.parent || event.origin !== hostOrigin) {
            return;
          }
          if (
            message &&
            message.protocol === 'ui-context/v1' &&
            message.kind === 'context-response' &&
            message.requestId === requestId
          ) {
            document.getElementById('out').textContent = JSON.stringify(message.context, null, 2);
          }
        });
        document.getElementById('ask').addEventListener('click', function () {
          requestId = crypto.randomUUID();
          parent.postMessage(
            { protocol: 'ui-context/v1', kind: 'context-request', requestId: requestId, options: { maxComponents: 30 } },
            hostOrigin
          );
        });
      </script>
    </body>
  </html>
`;

/**
 * The third-party plugin is the same static asset served from a different origin: the
 * host name is swapped to another name for this machine, which the browser treats as a
 * different origin. Which alternate name actually answers depends on what the dev server
 * listens on — `localhost` may resolve to `::1` while `127.0.0.1` refuses — so the
 * candidates are probed and the first one that responds is used.
 *
 * This only ever works on a developer's own machine, where the demo is one of these
 * names and another is a second origin for the same server. It is therefore never
 * attempted from a deployed copy of this demo: a page on a public origin that requests a
 * loopback address makes the browser ask the reader for permission to reach other
 * services on their device, which is an alarming question to answer on someone else's
 * behalf, and nothing here would be found anyway.
 */
const ALTERNATE_HOSTS = ['127.0.0.1', '[::1]', 'localhost'];

/** Whether this page is itself served from a loopback name, i.e. from a dev server. */
function servedFromLoopback(): boolean {
  const host = new URL(document.baseURI).hostname;
  return ALTERNATE_HOSTS.includes(host) || host === '::1' || /^127\./.test(host);
}

function alternateOrigins(): URL[] {
  const current = new URL('assets/plugins/billing.html', document.baseURI);
  return ALTERNATE_HOSTS.filter(host => host !== current.hostname).map(host => {
    const url = new URL(current.href);
    url.hostname = host;
    return url;
  });
}

/** Whether a server answers at all at this URL; an opaque cross-origin response is enough. */
async function reachable(href: string): Promise<boolean> {
  try {
    await fetch(href, { mode: 'no-cors', cache: 'no-store' });
    return true;
  } catch {
    return false;
  }
}

@Component({
  selector: 'clr-contextual-demo',
  styleUrls: ['./contextual.demo.scss'],
  templateUrl: './contextual.demo.html',
  standalone: false,
})
export class ContextualDemo implements OnInit, OnDestroy {
  hosts: DemoHost[] = [
    { name: 'esx-prod-01', cluster: 'alpha', status: 'Connected' },
    { name: 'esx-prod-02', cluster: 'alpha', status: 'Connected' },
    { name: 'esx-prod-03', cluster: 'beta', status: 'Maintenance' },
    { name: 'esx-edge-01', cluster: 'edge', status: 'Disconnected' },
  ];
  selectedHosts: DemoHost[] = [];
  alertVisible = true;
  addHostOpen = false;
  newHostName = '';
  snapshotJson = '';
  snapshotBytes = 0;
  snapshotCount = 0;
  snapshotTruncated = false;
  snapshotFocus: string | null = null;
  profile: ClrContextPreset = 'full';
  embeddedPage: SafeHtml;
  thirdPartyPluginUrl: SafeResourceUrl | null = null;
  thirdPartyOrigin = '';
  thirdPartyProbed = false;
  readonly servedLocally = servedFromLoopback();
  writableTargets: WritableTarget[] = [];
  targetRef = '';
  proposedValue = '';
  routePath = '';
  mutationResult = '';

  form = new FormGroup({
    name: new FormControl(),
    age: new FormControl(),
    password: new FormControl(),
    description: new FormControl(),
    selectedOption: new FormControl(),
    selectedOptionCombobox: new FormControl(),
    datalist: new FormControl(),
    option1: new FormControl(),
    date: new FormControl(),
    radio: new FormControl(),
    toggle: new FormControl(),
    files: new FormControl(),
    range: new FormControl(50),
  });

  private trackingSubscription: Subscription | null = null;

  constructor(
    private contextEngine: ClrContextEngineService,
    private contextTracker: ClrContextTrackerService,
    private mutationEngine: ClrMutationEngineService,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.embeddedPage = sanitizer.bypassSecurityTrustHtml(EMBEDDED_CHAT_PAGE);
  }

  ngOnInit(): void {
    // Answer context requests from the embedded frames below, and let browser-driving
    // agents query the page through window.clrContext(). The third-party plugin's origin
    // is added once it is known (see resolveThirdPartyPlugin).
    this.contextEngine.enableFrameBridge();
    this.contextEngine.enableGlobalAccess();
    this.resolveThirdPartyPlugin();
    // The panel on the right updates by itself: the tracker watches the DOM and emits
    // whenever the page context changes. The panel is marked data-clr-context-ignore,
    // so its own re-renders neither re-trigger tracking nor appear in the context.
    this.trackingSubscription = this.contextTracker.context$.subscribe(snapshot => {
      this.snapshotCount++;
      this.snapshotTruncated = snapshot.truncated === true;
      this.snapshotFocus = snapshot.focus ?? null;
      this.snapshotBytes = JSON.stringify(snapshot).length;
      this.snapshotJson = JSON.stringify(snapshot, null, 2);
      this.writableTargets = writableTargets(snapshot.components);
      if (!this.writableTargets.some(target => target.ref === this.targetRef)) {
        this.targetRef = this.writableTargets[0]?.ref ?? '';
      }
    });
    this.setProfile(this.profile);
  }

  /**
   * Restarts tracking with a preset. This page is deliberately busy — nav, a datagrid, a
   * long form, three plugin frames — so it needs more than the default budget; the panel
   * says so when it still runs out.
   */
  setValue(): void {
    const description = this.writableTargets.find(target => target.ref === this.targetRef)?.label ?? '';
    this.applyOperation({
      operation: 'setValue',
      ref: this.targetRef,
      description,
      value: proposal(this.proposedValue),
    });
  }

  clearValue(): void {
    const description = this.writableTargets.find(target => target.ref === this.targetRef)?.label ?? '';
    this.applyOperation({ operation: 'clear', ref: this.targetRef, description });
  }

  navigate(): void {
    this.applyOperation({ operation: 'navigate', path: this.routePath.trim() });
  }

  setProfile(profile: ClrContextPreset): void {
    this.profile = profile;
    this.contextTracker.start({ snapshot: clrContextPreset(profile, { maxComponents: 500 }) });
  }

  ngOnDestroy(): void {
    // The tracker is a singleton the app-shell inspector shares; only this page's use of it ends here.
    this.trackingSubscription?.unsubscribe();
    this.contextEngine.disableFrameBridge();
    this.contextEngine.disableGlobalAccess();
  }

  refreshNow(): void {
    this.contextTracker.refresh();
  }

  /**
   * What an agent's client does: hand the engine the operations and show what came
   * back. The report's snapshot and change are left out here, since the live panel on
   * the right already shows the page as it is now.
   */
  private applyOperation(operation: ClrMutationOperation): void {
    this.mutationResult = 'Applying…';
    this.mutationEngine.apply([operation]).then(report => {
      this.mutationResult = JSON.stringify(report.results, null, 2);
      this.changeDetectorRef.markForCheck();
    });
  }

  private async resolveThirdPartyPlugin(): Promise<void> {
    if (!this.servedLocally) {
      // Nothing is asked of the network away from a dev machine; see ALTERNATE_HOSTS.
      this.thirdPartyProbed = true;
      return;
    }
    for (const candidate of alternateOrigins()) {
      if (await reachable(candidate.href)) {
        this.thirdPartyOrigin = candidate.origin;
        this.thirdPartyPluginUrl = this.sanitizer.bypassSecurityTrustResourceUrl(candidate.href);
        // The bridge serves only origins it is told about: name the plugin's.
        this.contextEngine.enableFrameBridge({ allowedOrigins: [window.location.origin, candidate.origin] });
        break;
      }
    }
    this.thirdPartyProbed = true;
    this.changeDetectorRef.markForCheck();
  }
}

/** Every node carrying a ref, in document order, with what the agent would call it. */
function writableTargets(nodes: ClrComponentContext[]): WritableTarget[] {
  return nodes.flatMap(node => [
    ...(node.ref ? [{ ref: node.ref, type: node.type, label: node.label ?? '' }] : []),
    ...writableTargets(node.children ?? []),
  ]);
}

/** A typed value where the text is JSON — an array, a boolean, a number — and the text otherwise. */
function proposal(text: string): unknown {
  const trimmed = text.trim();
  if (/^(\[|true$|false$|null$|-?\d+(\.\d+)?$)/.test(trimmed)) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return text;
    }
  }
  return text;
}

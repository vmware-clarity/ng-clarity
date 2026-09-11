/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { ClrFormLayout } from '@clr/angular';
import {
  clrContextPreset,
  ClrContextPreset,
  ClrContextTrackerService,
  ClrContextualEngineService,
} from '@clr/angular/ai';
import { Subscription } from 'rxjs';

interface DemoHost {
  name: string;
  cluster: string;
  status: string;
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
        window.addEventListener('message', function (event) {
          var message = event.data;
          if (message && message.protocol === 'ui-context/v1' && message.kind === 'context-response') {
            var context = message.context;
            document.getElementById('out').textContent = JSON.stringify(
              context,
              null,
              2
            );
          }
        });
        document.getElementById('ask').addEventListener('click', function () {
          parent.postMessage(
            { protocol: 'ui-context/v1', kind: 'context-request', requestId: 'chat-demo', options: { maxComponents: 30 } },
            '*'
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
 */
const ALTERNATE_HOSTS = ['127.0.0.1', '[::1]', 'localhost'];

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

  _isDisabled = false;
  _isSuccess = false;
  _isError = false;

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

  @Input() clrLayout = ClrFormLayout.HORIZONTAL;
  @Input() isFullWidth = false;
  @Input() isReadonly = false;

  private trackingSubscription: Subscription | null = null;

  constructor(
    private contextEngine: ClrContextualEngineService,
    private contextTracker: ClrContextTrackerService,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.embeddedPage = sanitizer.bypassSecurityTrustHtml(EMBEDDED_CHAT_PAGE);
  }

  @Input()
  get isDisabled() {
    return this._isDisabled;
  }
  set isDisabled(value: boolean) {
    this._isDisabled = value;
    this.setControlsState();
  }

  @Input()
  get isError() {
    return this._isError;
  }
  set isError(value: boolean) {
    this._isError = value;
    this.setControlsState();
  }

  @Input()
  get isSuccess() {
    return this._isSuccess;
  }
  set isSuccess(value: boolean) {
    this._isSuccess = value;
    this.setControlsState();
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
    });
    this.setProfile(this.profile);
  }

  /**
   * Restarts tracking with a preset. This page is deliberately busy — nav, a datagrid, a
   * long form, three plugin frames — so it needs more than the default budget; the panel
   * says so when it still runs out.
   */
  setProfile(profile: ClrContextPreset): void {
    this.profile = profile;
    this.contextTracker.start({ snapshot: clrContextPreset(profile, { maxComponents: 500 }) });
  }

  ngOnDestroy(): void {
    this.trackingSubscription?.unsubscribe();
    this.contextTracker.stop();
    this.contextEngine.disableFrameBridge();
    this.contextEngine.disableGlobalAccess();
  }

  refreshNow(): void {
    this.contextTracker.refresh();
  }

  setControlsState() {
    this.form.enable();
    Object.keys(this.form.controls).forEach(control => {
      if (this._isDisabled) {
        this.form.get(control)?.disable();
      } else {
        if (this._isError && !this._isSuccess) {
          this.form.get(control).setErrors({ required: true });
          this.form.get(control).markAsTouched();
          this.form.get(control).markAsDirty();
        } else if (this._isSuccess) {
          this.form.get(control).setErrors(null);
          this.form.get(control).markAsTouched();
        }
      }
    });
    this.form.updateValueAndValidity();
    this.changeDetectorRef.detectChanges();
  }

  private async resolveThirdPartyPlugin(): Promise<void> {
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

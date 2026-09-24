/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { ClarityModule } from '@clr/angular';
import { ClrContextEngineService, ClrContextModule } from '@clr/angular/ai';

import { ContextLivePanelComponent } from '../live-panel/live-panel.component';

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
  selector: 'clr-contextual-frames-demo',
  standalone: true,
  imports: [ClarityModule, ClrContextModule, ContextLivePanelComponent],
  templateUrl: './frames.demo.html',
  styleUrls: ['./frames.demo.scss'],
})
export class ContextualFramesDemo implements OnInit, OnDestroy {
  embeddedPage: SafeHtml;
  thirdPartyPluginUrl: SafeResourceUrl | null = null;
  thirdPartyOrigin = '';
  thirdPartyProbed = false;
  readonly servedLocally = servedFromLoopback();

  constructor(
    private contextEngine: ClrContextEngineService,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.embeddedPage = sanitizer.bypassSecurityTrustHtml(EMBEDDED_CHAT_PAGE);
  }

  ngOnInit(): void {
    // Answer context requests from the embedded frames below. The third-party plugin's
    // origin is added once it is known (see resolveThirdPartyPlugin).
    this.contextEngine.enableFrameBridge();
    this.resolveThirdPartyPlugin();
  }

  ngOnDestroy(): void {
    this.contextEngine.disableFrameBridge();
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

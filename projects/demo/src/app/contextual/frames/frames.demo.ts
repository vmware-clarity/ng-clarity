/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { ClarityModule } from '@clr/angular';
import { ClrContext, ClrContextEngineService } from '@clr/angular/ai';

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
        // A hand-written client: unguessable id, answers only from the asked window and origin.
        // This srcdoc page shares the host's origin, but location.origin is "null", so read it from the window.
        var hostOrigin = window.origin;
        // randomUUID() needs a secure context, and the demo may be served over plain HTTP.
        function newRequestId() {
          if (typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
          }
          return Array.from(crypto.getRandomValues(new Uint8Array(16)), function (byte) {
            return byte.toString(16).padStart(2, '0');
          }).join('');
        }
        var requestId = newRequestId();
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
          requestId = newRequestId();
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
 * The third-party plugin is the same asset served from another loopback name, i.e. another origin.
 * Only tried from a dev server: on a public origin the browser would ask the reader for local network access.
 */
const ALTERNATE_HOSTS = ['127.0.0.1', '[::1]', 'localhost'];

function servedFromLoopback(): boolean {
  const host = new URL(document.baseURI).hostname;
  return ALTERNATE_HOSTS.includes(host) || /^127\./.test(host);
}

function alternateOrigins(): URL[] {
  const current = new URL('assets/plugins/billing.html', document.baseURI);
  return ALTERNATE_HOSTS.filter(host => host !== current.hostname).map(host => {
    const url = new URL(current.href);
    url.hostname = host;
    return url;
  });
}

async function reachable(href: string): Promise<boolean> {
  try {
    await fetch(href, { mode: 'no-cors', cache: 'no-store' });
    return true;
  } catch {
    return false;
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'clr-contextual-frames-demo',
  standalone: true,
  imports: [ClarityModule, ClrContext, ContextLivePanelComponent],
  templateUrl: './frames.demo.html',
  styleUrls: ['./frames.demo.scss'],
})
export class ContextualFramesDemo implements OnInit, OnDestroy {
  embeddedPage: SafeHtml;
  thirdPartyPluginUrl: SafeResourceUrl | null = null;
  thirdPartyOrigin = '';
  thirdPartyProbed = false;
  readonly servedLocally = servedFromLoopback();

  private destroyed = false;

  constructor(
    private contextEngine: ClrContextEngineService,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.embeddedPage = sanitizer.bypassSecurityTrustHtml(EMBEDDED_CHAT_PAGE);
  }

  ngOnInit(): void {
    this.contextEngine.enableFrameBridge();
    this.resolveThirdPartyPlugin();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.contextEngine.disableFrameBridge();
  }

  private async resolveThirdPartyPlugin(): Promise<void> {
    if (!this.servedLocally) {
      this.thirdPartyProbed = true;
      return;
    }
    for (const candidate of alternateOrigins()) {
      const found = await reachable(candidate.href);
      // The page may have been left while the probe waited; don't open a bridge that outlives it.
      if (this.destroyed) {
        return;
      }
      if (found) {
        this.thirdPartyOrigin = candidate.origin;
        this.thirdPartyPluginUrl = this.sanitizer.bypassSecurityTrustResourceUrl(candidate.href);
        this.contextEngine.enableFrameBridge({ allowedOrigins: [window.location.origin, candidate.origin] });
        break;
      }
    }
    this.thirdPartyProbed = true;
    this.changeDetectorRef.markForCheck();
  }
}

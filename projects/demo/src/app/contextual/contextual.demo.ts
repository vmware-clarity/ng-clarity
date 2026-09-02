/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ClrContextTrackerService, ClrContextualEngineService } from '@clr/ai';
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
              {
                title: context.title,
                route: context.route && context.route.path,
                regions: context.regions,
                componentsOnPage: context.components.map(function (component) {
                  return component.type;
                }),
              },
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
  embeddedPage: SafeHtml;

  private trackingSubscription: Subscription | null = null;

  constructor(
    private contextEngine: ClrContextualEngineService,
    private contextTracker: ClrContextTrackerService,
    sanitizer: DomSanitizer
  ) {
    this.embeddedPage = sanitizer.bypassSecurityTrustHtml(EMBEDDED_CHAT_PAGE);
  }

  ngOnInit(): void {
    // Answer context requests from the embedded iframe below, and let browser-driving
    // agents query the page through window.clrContext().
    this.contextEngine.enableFrameBridge();
    this.contextEngine.enableGlobalAccess();
    // The panel on the right updates by itself: the tracker watches the DOM and emits
    // whenever the page context changes. The panel is marked data-clr-context-ignore,
    // so its own re-renders neither re-trigger tracking nor appear in the context.
    this.trackingSubscription = this.contextTracker.context$.subscribe(snapshot => {
      this.snapshotCount++;
      this.snapshotBytes = JSON.stringify(snapshot).length;
      this.snapshotJson = JSON.stringify(snapshot, null, 2);
    });
    this.contextTracker.start();
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
}

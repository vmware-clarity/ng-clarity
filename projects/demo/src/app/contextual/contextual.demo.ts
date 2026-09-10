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
import { ClrContextTrackerService, ClrContextualEngineService } from '@clr/angular/ai';
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
 * host name is swapped between `localhost` and `127.0.0.1`, which the browser treats as
 * two origins. Anywhere else the swap still yields a different origin, though the page
 * may not load there — the point is that the host cannot read it either way.
 */
function thirdPartyPluginUrl(): URL {
  const url = new URL('assets/plugins/billing.html', document.baseURI);
  url.hostname = url.hostname === 'localhost' ? '127.0.0.1' : 'localhost';
  return url;
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
  embeddedPage: SafeHtml;
  thirdPartyPluginUrl: SafeResourceUrl;
  thirdPartyOrigin: string;

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
    sanitizer: DomSanitizer
  ) {
    this.embeddedPage = sanitizer.bypassSecurityTrustHtml(EMBEDDED_CHAT_PAGE);
    const thirdParty = thirdPartyPluginUrl();
    this.thirdPartyOrigin = thirdParty.origin;
    this.thirdPartyPluginUrl = sanitizer.bypassSecurityTrustResourceUrl(thirdParty.href);
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
    // Answer context requests from the embedded frames below — including the third-party
    // plugin on its other origin, which has to be named — and let browser-driving agents
    // query the page through window.clrContext().
    this.contextEngine.enableFrameBridge({ allowedOrigins: [window.location.origin, this.thirdPartyOrigin] });
    this.contextEngine.enableGlobalAccess();
    // The panel on the right updates by itself: the tracker watches the DOM and emits
    // whenever the page context changes. The panel is marked data-clr-context-ignore,
    // so its own re-renders neither re-trigger tracking nor appear in the context.
    this.trackingSubscription = this.contextTracker.context$.subscribe(snapshot => {
      this.snapshotCount++;
      this.snapshotTruncated = snapshot.truncated === true;
      this.snapshotBytes = JSON.stringify(snapshot).length;
      this.snapshotJson = JSON.stringify(snapshot, null, 2);
    });
    // This page is deliberately busy — nav, a datagrid, a long form, three plugin frames —
    // so it needs more than the default budget; the panel says so when it still runs out.
    this.contextTracker.start({ snapshot: { maxComponents: 500 } });
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
}

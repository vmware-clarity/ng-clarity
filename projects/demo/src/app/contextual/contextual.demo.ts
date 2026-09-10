/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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

/** A plugin page as a shell would embed it: plain HTML, its own form, table and actions. */
const INVENTORY_PLUGIN_PAGE = `
  <html>
    <head><title>Inventory plugin</title></head>
    <body style="font-family: sans-serif; margin: 12px; font-size: 13px">
      <h1 style="font-size: 16px; margin-top: 0">Inventory</h1>
      <p>Rendered by a plugin in its own frame. The host application has no knowledge of this markup.</p>
      <form>
        <p>
          <label for="vm-name">VM name</label>
          <input id="vm-name" name="vmName" placeholder="web-01" required />
        </p>
        <p>
          <label for="vm-size">Size</label>
          <select id="vm-size" name="size">
            <option value="s">Small (2 vCPU)</option>
            <option value="m" selected>Medium (4 vCPU)</option>
            <option value="l">Large (8 vCPU)</option>
          </select>
        </p>
        <p>
          <input id="vm-backup" name="backup" type="checkbox" checked />
          <label for="vm-backup">Nightly backup</label>
        </p>
        <button type="button">Create VM</button>
      </form>
      <table style="margin-top: 12px; border-collapse: collapse" border="1" cellpadding="4">
        <caption>Virtual machines</caption>
        <thead><tr><th>Name</th><th>State</th><th>CPU</th></tr></thead>
        <tbody>
          <tr><td>web-01</td><td>Running</td><td>34%</td></tr>
          <tr><td>db-01</td><td>Running</td><td>71%</td></tr>
          <tr><td>batch-02</td><td>Stopped</td><td>0%</td></tr>
        </tbody>
      </table>
    </body>
  </html>
`;

const MONITORING_WIDGET_PAGE = `
  <html>
    <head><title>Alerts widget</title></head>
    <body style="font-family: sans-serif; margin: 8px; font-size: 13px">
      <div role="alert">Disk usage on db-01 above 90%</div>
      <button type="button">Acknowledge</button>
    </body>
  </html>
`;

/** A plugin that itself embeds a frame: frames inside frames are walked the same way. */
const MONITORING_PLUGIN_PAGE = `
  <html>
    <head><title>Monitoring plugin</title></head>
    <body style="font-family: sans-serif; margin: 12px; font-size: 13px">
      <h1 style="font-size: 16px; margin-top: 0">Monitoring</h1>
      <p>Cluster health: <strong>degraded</strong>. The alerts widget below is a second frame nested inside this one.</p>
      <iframe title="Alerts widget" style="width: 100%; height: 6rem" srcdoc="${attributeEscape(MONITORING_WIDGET_PAGE)}"></iframe>
      <p><a href="/demo/datagrid">Open the full datagrid</a></p>
    </body>
  </html>
`;

/** Loaded in a sandbox without allow-same-origin, so it behaves like a cross-origin plugin. */
const THIRD_PARTY_PLUGIN_PAGE = `
  <html>
    <head><title>Billing widget</title></head>
    <body style="font-family: sans-serif; margin: 12px; font-size: 13px">
      <h1 style="font-size: 16px; margin-top: 0">Billing (third party)</h1>
      <p>This frame has an opaque origin. The host can see that a frame is here, but nothing inside it.</p>
      <button type="button">Pay invoice</button>
    </body>
  </html>
`;

function attributeEscape(html: string): string {
  return html.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
  inventoryPluginPage: SafeHtml;
  monitoringPluginPage: SafeHtml;
  thirdPartyPluginPage: SafeHtml;

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
    this.inventoryPluginPage = sanitizer.bypassSecurityTrustHtml(INVENTORY_PLUGIN_PAGE);
    this.monitoringPluginPage = sanitizer.bypassSecurityTrustHtml(MONITORING_PLUGIN_PAGE);
    this.thirdPartyPluginPage = sanitizer.bypassSecurityTrustHtml(THIRD_PARTY_PLUGIN_PAGE);
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
    // Answer context requests from the embedded iframe below, and let browser-driving
    // agents query the page through window.clrContext().
    this.contextEngine.enableFrameBridge();
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

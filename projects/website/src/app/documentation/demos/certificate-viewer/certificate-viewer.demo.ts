/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppfxCertificateViewerModule } from '@clr/addons/certificate-viewer';
import { ClarityModule } from '@clr/angular';

import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { ClarityDocComponent } from '../clarity-doc';
import googleCerts from './certs/google-certs.json';

const BasicCertHtml = require('!raw-loader!./ng/basic-cert.html').default;
const BasicCertTs = require('!raw-loader!./ng/basic-cert.ts').default;

export type DemoMode =
  | 'fill-parent'
  | 'fixed-height'
  | 'heading-level-1'
  | 'heading-level-7'
  | 'modal'
  | 'details-pane';

export interface HostEntry {
  name: string;
  hostname: string;
  certs: string[];
}

@Component({
  selector: 'app-certificate-viewer-demo',
  templateUrl: './certificate-viewer.demo.html',
  styleUrls: ['./certificate-viewer.demo.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    AppfxCertificateViewerModule,
    CodeSnippetComponent,
    DocTabComponent,
    DocTabsComponent,
    StackblitzExampleComponent,
  ],
})
export class CertificateViewerDemoComponent extends ClarityDocComponent {
  readonly googleChainPems: string[] = googleCerts;
  readonly basicCertHtml = BasicCertHtml;
  readonly basicCertTs = BasicCertTs;

  activeMode: DemoMode = 'fill-parent';
  modalOpen = false;

  readonly hosts: HostEntry[] = [
    { name: 'Important Host', hostname: 'important.host.eng.vmware.com', certs: googleCerts },
    { name: 'Secondary Host', hostname: 'secondary.host.eng.vmware.com', certs: googleCerts },
  ];

  selected: HostEntry[] = [];

  readonly modes: { id: DemoMode; label: string }[] = [
    { id: 'fill-parent', label: 'Fill Parent' },
    { id: 'fixed-height', label: 'Fixed Height' },
    { id: 'heading-level-1', label: 'Heading Level 1' },
    { id: 'heading-level-7', label: 'Heading Level 7' },
    { id: 'modal', label: 'Modal' },
    { id: 'details-pane', label: 'Details Pane' },
  ];

  constructor() {
    super('certificate-viewer');
  }

  setMode(mode: DemoMode): void {
    this.activeMode = mode;
    this.selected = [];
    this.modalOpen = false;
  }

  openModal(): void {
    this.modalOpen = true;
  }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppfxCertificateViewerModule } from '@clr/addons/certificate-viewer';
import { ClarityModule } from '@clr/angular';

import googleCerts from './google-certs.json';

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
  selector: 'clr-certificate-viewer-demo',
  templateUrl: './certificate-viewer.demo.html',
  styleUrls: ['./certificate-viewer.demo.scss'],
  standalone: true,
  imports: [CommonModule, ClarityModule, AppfxCertificateViewerModule],
})
export class CertificateViewerDemoComponent {
  readonly googleChainPems: string[] = googleCerts;

  activeMode: DemoMode = 'fill-parent';
  modalOpen = false;
  selected: HostEntry[] = [];

  readonly hosts: HostEntry[] = [
    { name: 'Important Host', hostname: 'important.host.eng.vmware.com', certs: googleCerts },
    { name: 'Secondary Host', hostname: 'secondary.host.eng.vmware.com', certs: googleCerts },
  ];

  readonly modes: { id: DemoMode; label: string }[] = [
    { id: 'fill-parent', label: 'Fill Parent' },
    { id: 'fixed-height', label: 'Fixed Height' },
    { id: 'heading-level-1', label: 'Heading Level 1' },
    { id: 'heading-level-7', label: 'Heading Level 7' },
    { id: 'modal', label: 'Modal' },
    { id: 'details-pane', label: 'Details Pane' },
  ];

  setMode(mode: DemoMode): void {
    this.activeMode = mode;
    this.selected = [];
    this.modalOpen = false;
  }

  openModal(): void {
    this.modalOpen = true;
  }
}

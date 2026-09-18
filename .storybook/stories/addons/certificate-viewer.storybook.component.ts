/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AppfxCertificateViewerModule } from '@clr/addons/certificate-viewer';

import googleCerts from '../../../projects/website/src/app/documentation/demos/certificate-viewer/certs/google-certs.json';

@Component({
  selector: 'clr-cert-viewer-story-wrapper',
  standalone: true,
  imports: [CommonModule, AppfxCertificateViewerModule],
  template: `
    <div style="height: 500px; display: flex; flex-direction: column">
      <appfx-certificate-viewer
        [pemEncodedCertificatesChain]="pemChain"
        [topHeadingLevel]="topHeadingLevel"
        style="flex: 1 1 auto; overflow: auto"
      ></appfx-certificate-viewer>
    </div>
  `,
})
export class CertViewerStoryWrapperComponent {
  @Input() pemChain: string[] = googleCerts;
  @Input() topHeadingLevel = 5;
}

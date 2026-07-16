/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { AppfxCertificateViewerModule } from '@clr/addons/certificate-viewer';

// Replace with your actual PEM-encoded certificate chain
const EXAMPLE_CHAIN = [
  '-----BEGIN CERTIFICATE-----\n... leaf cert ...\n-----END CERTIFICATE-----',
  '-----BEGIN CERTIFICATE-----\n... root cert ...\n-----END CERTIFICATE-----',
];

@Component({
  selector: 'clr-basic-cert-demo',
  standalone: true,
  imports: [AppfxCertificateViewerModule],
  templateUrl: 'basic-cert.html',
})
export class BasicCertDemoComponent {
  pemEncodedCertificatesChain = EXAMPLE_CHAIN;
}

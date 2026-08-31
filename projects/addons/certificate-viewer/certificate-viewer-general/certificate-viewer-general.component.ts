/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, TemplateRef } from '@angular/core';
import { DateTimeFormatOptions } from '@clr/addons/translate';

import { KnownOids } from '../certificate.constants';
import { dateTimeFormat } from '../certificate.util';
import { Certificate } from '../models/certificate.model';
import { TopHeadingLevel } from '../models/heading-level.model';

/**
 * The general section of the certificate viewer.
 *
 * This section contains the leaf certificate's:
 * 1. Subject (Issuer To) and Issuer (Issuer By) common RDNs:
 *   - Common Name
 *   - Organization
 *   - Organization Unit
 * 2. Validity period
 * 3. Fingerprints (SHA-1 and SHA-256)
 */
@Component({
  selector: 'appfx-certificate-viewer-general',
  standalone: false,
  templateUrl: 'certificate-viewer-general.component.html',
  styleUrls: ['certificate-viewer-general.component.scss'],
})
export class CertificateViewerGeneralComponent {
  readonly KnownOids = KnownOids;
  readonly dateTimeFormat: DateTimeFormatOptions = dateTimeFormat;

  @Input() certificate?: Certificate;
  @Input() topHeadingLevel: TopHeadingLevel = 5;
  @Input() headingTemplate: TemplateRef<unknown>;
}

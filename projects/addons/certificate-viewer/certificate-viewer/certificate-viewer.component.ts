/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { appfxMissingTranslationToken, AppfxTranslateService, appfxTranslationsToken } from '@clr/addons/translate';

import { translations } from '../certificate-viewer.l10n';
import { KnownOids } from '../certificate.constants';
import { arrayElementsEqual, missingTranslation } from '../certificate.util';
import { CertificateChain } from '../models/certificate-chain.model';
import { TopHeadingLevel } from '../models/heading-level.model';

/**
 * Displays detailed information about a X.509 certificate chain.
 *
 * The component renders information for a PEM encoded certificate chain in two separate sections.
 * 1. The former is the general tab which contains common information for the leaf certificate
 *    like validity, subject, issuer and fingerprints.
 * 2. The latter is the details tab contains the whole certificate chain with each individual
 *    certificate's fields and their corresponding values. The most common fields are presented
 *    in a localized human readable format. The rest of the fields are presented as PKI object
 *    identifiers (OIDs) and their values are rendered as a formatted hex string.
 *
 * @example <caption>A certificate chain</caption>
 * ```html
 * <appfx-certificate-viewer [pemEncodedCertificatesChain]="pemEncodedCertificatesChain">
 * </appfx-certificate-viewer>
 * ```
 */
@Component({
  selector: 'appfx-certificate-viewer',
  standalone: false,
  templateUrl: 'certificate-viewer.component.html',
  styleUrls: ['certificate-viewer.component.scss'],
  providers: [
    AppfxTranslateService,
    { provide: appfxMissingTranslationToken, useValue: missingTranslation },
    { provide: appfxTranslationsToken, useValue: translations },
  ],
})
export class CertificateViewerComponent implements OnChanges {
  readonly KnownOids = KnownOids;

  /**
   * Accepts a certificate chain where each certificate is PEM encoded.
   * The first element is the leaf certificate and the last element is the root certificate.
   * This order is described in the TLS 1.2 RFC section 7.4.2.
   */
  @Input() pemEncodedCertificatesChain: string[];

  /**
   * The top heading level for this component.
   * All nested headings are incremented automatically. Use to satisfy WCAG heading hierarchy.
   */
  @Input() topHeadingLevel: TopHeadingLevel = 5;

  certificateChain?: CertificateChain;
  parseError?: string;
  loading = false;

  private certificateChainPromise?: Promise<CertificateChain>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pemEncodedCertificatesChain']) {
      const change = changes['pemEncodedCertificatesChain'];
      const current = change.currentValue;
      const previous = change.previousValue;

      if (
        !change.isFirstChange() &&
        (!Array.isArray(current) || (Array.isArray(previous) && arrayElementsEqual(current, previous)))
      ) {
        return;
      }

      this.parseCertificateChain();
    }
  }

  private parseCertificateChain(): void {
    this.loading = true;
    this.certificateChain = undefined;
    this.parseError = undefined;

    const promise = CertificateChain.fromPemEncodedCertificatesChain(this.pemEncodedCertificatesChain);
    this.certificateChainPromise = promise;
    promise
      .then(result => {
        if (this.certificateChainPromise === promise) {
          this.certificateChain = result;
        }
      })
      .catch((err: unknown) => {
        if (this.certificateChainPromise === promise) {
          this.parseError = err instanceof Error ? err.message : String(err);
        }
      })
      .finally(() => {
        if (this.certificateChainPromise === promise) {
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }
}

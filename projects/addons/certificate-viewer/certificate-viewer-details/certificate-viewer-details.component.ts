/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';

import { CertificateChain } from '../models/certificate-chain.model';
import { CertificateField } from '../models/certificate-field.model';
import { Certificate } from '../models/certificate.model';
import { TopHeadingLevel } from '../models/heading-level.model';

/**
 * The details section of the certificate viewer.
 *
 * This section allows for exploring the provided certificate chain. It's comprised of a certificate chain tree,
 * a selected certificate fields tree and a selected field value.
 *
 * - The certificate chain tree is a linear tree that represents the certificate chain hierarchy.
 *   Selecting a node in this tree populates the fields tree with their respective values.
 * - The fields tree is an explorer for all of the selected certificate fields. The most commonly used fields are
 *   localized and their values are converted to a human-readable format.
 * - The field value is a monospace area that contains the value of the selected field from the fields tree.
 */
@Component({
  selector: 'appfx-certificate-viewer-details',
  standalone: false,
  templateUrl: 'certificate-viewer-details.component.html',
  styleUrls: ['certificate-viewer-details.component.scss'],
})
export class CertificateViewerDetailsComponent implements OnChanges {
  @Input() certificateChain?: CertificateChain;
  @Input() topHeadingLevel: TopHeadingLevel = 5;
  @Input() headingTemplate: TemplateRef<unknown>;

  selectedCertificate?: Certificate;
  selectedCertificateField?: CertificateField;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.certificateChain) {
      const currentValue = changes.certificateChain.currentValue as CertificateChain | undefined;
      this.selectCertificate(currentValue?.leafCertificate);
    }
  }

  selectCertificate(certificate?: Certificate) {
    if (this.selectedCertificate !== certificate) {
      this.selectedCertificateField = undefined;
    }
    this.selectedCertificate = certificate;
  }

  selectCertificateField(certificateField?: CertificateField) {
    this.selectedCertificateField = certificateField;
  }

  isSelected(certificate?: Certificate): boolean {
    return certificate === this.selectedCertificate;
  }

  isSelectedField(certificateField?: CertificateField): boolean {
    return certificateField === this.selectedCertificateField;
  }

  getNextCertificate = (certificate?: Certificate): Certificate[] => {
    const next = this.certificateChain?.nextCertificateInChain(certificate);
    return next ? [next] : [];
  };

  getFieldsChildren = (certificateField?: CertificateField): CertificateField[] => {
    return certificateField?.children ?? [];
  };
}

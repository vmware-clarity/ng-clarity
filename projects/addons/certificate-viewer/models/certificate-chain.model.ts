/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable @typescript-eslint/member-ordering */
import { Certificate } from './certificate.model';

/**
 * Contains a certificate chain and provides convenient methods for accessing the common certificates of interest.
 *
 * This is linear model which is meant to be displayed in a tree structure and thus contains methods for interacting with Clarity's tree.
 */
export class CertificateChain {
  /**
   * Used to resolve the next certificate in the chain beginning with the root certificate.
   */
  private readonly nextCertificateMap: Map<Certificate, Certificate | undefined>;

  /**
   * @param chain The parsed certificate chain.
   */
  private constructor(readonly chain: Certificate[]) {
    this.nextCertificateMap = new Map(
      chain
        .slice()
        .reverse()
        .map((cert, index, arr) => [cert, arr[index + 1]])
    );
  }

  /**
   * Create a new CertificateChainModel from a PEM encoded certificate chain.
   *
   * @param pemEncodedCertificates The certificate chain where each certificate is a PEM encoded string.
   *                               It begins with the leaf certificate as the first element and ends with the root certificate.
   */
  static async fromPemEncodedCertificatesChain(pemEncodedCertificates: string[]): Promise<CertificateChain> {
    // The certificates order must be preserved but they don't need to be parsed synchronously relative to each other.
    const chain = await Promise.all(pemEncodedCertificates.map(Certificate.fromPemEncodedCertificate));

    return new CertificateChain(chain);
  }

  /**
   * Retrieve the root certificate in the chain.
   */
  get rootCertificate(): Certificate | undefined {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Retrieve the leaf certificate in the chain.
   */
  get leafCertificate(): Certificate | undefined {
    return this.chain[0];
  }

  /**
   * Resolve the next certificate in the chain beginning with the root certificate.
   *
   * This method is used by the certificate details tree which begins with the root certificate in the chain.
   *
   * Confusion may arise here since the RFC-5246 certificate chain array begins with the leaf certificate and ends with the root certificate
   * but the tree renders it in reverse order which is more intuitive to the user.
   */
  nextCertificateInChain(certificate?: Certificate): Certificate | undefined {
    return certificate && this.nextCertificateMap.get(certificate);
  }
}

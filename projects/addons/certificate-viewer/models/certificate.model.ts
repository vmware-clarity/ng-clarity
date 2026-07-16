/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { fromBER } from 'asn1js';
import { ECPublicKey, Certificate as PkijsCertificate, RSAPublicKey } from 'pkijs';

import { AlgorithmName, KnownOids } from '../certificate.constants';
import {
  computeCertificateHash,
  formatHexString,
  pemToBerBuffer,
  pkijsAttributeAndValuesToMap,
} from '../certificate.util';
import { CertificateField } from './certificate-field.model';
import { Line, TranslatableValue, Value } from './partial-translate.model';

/**
 * Contains the Relative Distinguished Names of the subject and issuer in a given certificate.
 *
 * This structure is to be used in the general section of the certificate viewer and thus doesn't need to contain all of the RDNs.
 * Instead we're only interested in the `common name`, `organization` and `organization unit` values.
 */
export class RelativeDistinguishedNamesModel {
  constructor(
    readonly commonName: string,
    readonly organization: string,
    readonly organizationalUnit: string
  ) {}

  /**
   * Create the RDNs model from an OID to value map.
   */
  static fromMap(map: Map<string, string>): RelativeDistinguishedNamesModel {
    return new RelativeDistinguishedNamesModel(
      map.get(KnownOids.CommonName) || '',
      map.get(KnownOids.Organization) || '',
      map.get(KnownOids.OrganizationalUnit) || ''
    );
  }
}

/**
 * Contains the certificate fingerprints.
 */
export interface Fingerprints {
  sha1: string;
  sha256: string;
}

/**
 * The certificate model used by the certificate viewer.
 *
 * Contains all the information necessary for presenting the certificate to the user. This includes:
 * - The SHA1 and SHA256 fingerprints.
 * - The subject and issuer RDNs.
 * - The common certificate fields which are parsed and localized while the rest are presented as OIDs with hex values.
 * - The raw pkijs model.
 */
export class Certificate {
  /**
   * The root of the parsed certificate fields tree.
   *
   * Meant to be rendered with a tree component.
   */
  readonly rootField: CertificateField;

  /**
   * The certificate issuer RDNs.
   */
  readonly issuer: RelativeDistinguishedNamesModel;

  /**
   * The certificate subject RDNs.
   */
  readonly subject: RelativeDistinguishedNamesModel;

  /**
   * @param certificate The pkijs Certificate model.
   * @param fingerprints The SHA-1 and SHA-256 fingerprints of the certificate.
   */
  private constructor(
    readonly certificate: PkijsCertificate,
    readonly fingerprints: Fingerprints
  ) {
    this.issuer = Certificate.issuerRdns(certificate);
    this.subject = Certificate.subjectRdns(certificate);

    this.rootField = this.buildFieldsTree();
  }

  /**
   * Create a new CertificateModel form a PEM encoded certificate.
   *
   * The asn1js and pkijs libraries are used in combination to parse the PEM encoded certificate.
   */
  static async fromPemEncodedCertificate(certificatePem: string): Promise<Certificate> {
    const berFormat = pemToBerBuffer(certificatePem);
    const fingerprints = await Certificate.computeFingerprints(berFormat);

    const asn1 = fromBER(berFormat);

    const certificate = new PkijsCertificate({ schema: asn1.result });

    return new Certificate(certificate, fingerprints);
  }

  /**
   * Computes the SHA1 and SHA256 fingerprints
   */
  private static async computeFingerprints(berEncodedCert: ArrayBuffer): Promise<Fingerprints> {
    return Promise.all([
      computeCertificateHash(AlgorithmName.sha1, berEncodedCert),
      computeCertificateHash(AlgorithmName.sha256, berEncodedCert),
    ]).then(([sha1, sha256]) => ({ sha1, sha256 }));
  }

  private static issuerRdns(certificate: PkijsCertificate): RelativeDistinguishedNamesModel {
    const map = pkijsAttributeAndValuesToMap(certificate.issuer.typesAndValues);
    return RelativeDistinguishedNamesModel.fromMap(map);
  }

  private static subjectRdns(certificate: PkijsCertificate): RelativeDistinguishedNamesModel {
    const map = pkijsAttributeAndValuesToMap(certificate.subject.typesAndValues);
    return RelativeDistinguishedNamesModel.fromMap(map);
  }

  private buildFieldsTree(): CertificateField {
    const children = [
      this.fieldVersion(),
      this.fieldValidity(),
      this.fieldSerialNumber(),
      this.fieldIssuer(),
      this.fieldSubject(),
      this.fieldSignatureAlgorithm(),
      this.fieldSignatureValue(),
      this.fieldFingerprints(),
      this.fieldSubjectPublicKeyInfo(),
    ];
    const extensions = this.extensions();
    if (extensions) {
      children.push(extensions);
    }
    return CertificateField.untranslatedNameWithChildren(this.subject.commonName, children);
  }

  private fieldVersion(): CertificateField {
    return CertificateField.withValue(
      'version',
      new TranslatableValue('version-format', {
        version: this.certificate.version + 1,
      })
    );
  }

  private fieldValidity(): CertificateField {
    const notBefore = CertificateField.withValue('not-before', this.certificate.notBefore.value);
    const notAfter = CertificateField.withValue('not-after', this.certificate.notAfter.value);

    return CertificateField.withChildren('validity', [notBefore, notAfter]);
  }

  private fieldSerialNumber(): CertificateField {
    return CertificateField.withValue(
      'serial-number',
      formatHexString(this.certificate.serialNumber.toString('hex').slice(4), true)
    );
  }

  private fieldIssuer(): CertificateField {
    const lines = this.certificate.issuer.typesAndValues.map(typeAndValue => {
      return Line.fromPair(
        Value.fromTranslatableKey(typeAndValue.type),
        new Value(typeAndValue.value.valueBlock.value),
        ' = '
      );
    });

    return CertificateField.withLines('issuer', lines);
  }

  private fieldSubject(): CertificateField {
    const lines = this.certificate.subject.typesAndValues.map(typeAndValue => {
      return Line.fromPair(
        Value.fromTranslatableKey(typeAndValue.type),
        new Value(typeAndValue.value.valueBlock.value),
        ' = '
      );
    });

    return CertificateField.withLines('subject', lines);
  }

  private fieldSignatureAlgorithm(): CertificateField {
    return CertificateField.withValue(
      'certificate-signature-algorithm',
      new TranslatableValue(this.certificate.signatureAlgorithm.algorithmId)
    );
  }

  private fieldSignatureValue(): CertificateField {
    return CertificateField.withValue(
      'certificate-signature-value',
      formatHexString(this.certificate.signatureValue.toString('hex').slice(10))
    );
  }

  private fieldFingerprints(): CertificateField {
    const sha1Fp = CertificateField.withValue('sha-1-fingerprint', this.fingerprints.sha1);
    const sha256Fp = CertificateField.withValue('sha-256-fingerprint', this.fingerprints.sha256);

    return CertificateField.withChildren('fingerprints', [sha1Fp, sha256Fp]);
  }

  private fieldSubjectPublicKeyInfo(): CertificateField {
    const subjPubKeyAlg = CertificateField.withValue(
      'subject-public-key-algorithm',
      new TranslatableValue(this.certificate.subjectPublicKeyInfo.algorithm.algorithmId)
    );
    const subjPubKey = CertificateField.withLines('subjects-public-key', this.subfieldSubjectPublicKeyValue());

    return CertificateField.withChildren('subject-public-key-info', [subjPubKeyAlg, subjPubKey]);
  }

  private subfieldSubjectPublicKeyValue(): Line[] {
    const parsedPubKey = this.certificate.subjectPublicKeyInfo.parsedKey;

    if (parsedPubKey instanceof RSAPublicKey) {
      const modulusView = parsedPubKey.modulus.valueBlock.valueHexView;
      const modulusBitLength =
        modulusView[0] === 0x00
          ? (parsedPubKey.modulus.valueBlock.valueHexView.byteLength - 1) * 8
          : parsedPubKey.modulus.valueBlock.valueHexView.byteLength * 8;

      // RSA public key consists of modulus and exponent.
      return [
        Line.fromTranslatableKey('modulus-bits', {
          bits: modulusBitLength.toString(),
        }),
        Line.fromHex(parsedPubKey.modulus.toString('hex').slice(8)),
        Line.fromTranslatableKey('public-exponent'),
        Line.fromHex(parsedPubKey.publicExponent.toString('hex').slice(4)),
      ];
    } else if (parsedPubKey instanceof ECPublicKey) {
      return [
        Line.fromTranslatableKey('named-curve', {
          curve: parsedPubKey.namedCurve,
        }),
        Line.fromHex(parsedPubKey.toString('hex')),
      ];
    } else {
      return [];
    }
  }

  private extensions(): CertificateField | undefined {
    if (!this.certificate.extensions) {
      return undefined;
    }

    return CertificateField.withChildren(
      'extensions',
      this.certificate.extensions.map(extension => CertificateField.fromExtension(extension))
    );
  }
}

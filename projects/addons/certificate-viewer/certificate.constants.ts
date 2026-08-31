/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AppfxLocale } from '@clr/addons/translate';

import { translations } from './certificate-viewer.l10n';

/**
 * The algorithm names passed to {@link crypto.subtle.digest} by the certificate viewer.
 */
export const enum AlgorithmName {
  sha1 = 'SHA-1',
  sha256 = 'SHA-256',
}

/**
 * Know PKI Object Identifiers.
 *
 * This is not a complete set of OIDs but only the ones that are used throughout the certificate viewer so that they can be referred easily.
 */
export enum KnownOids {
  CommonName = '2.5.4.3',
  Organization = '2.5.4.10',
  OrganizationalUnit = '2.5.4.11',
  KeyUsage = '2.5.29.15',
  ExtendedKeyUsage = '2.5.29.37',
  BasicCertificateConstraints = '2.5.29.19',
  ExtensionSubjectKeyId = '2.5.29.14',
  ExtensionAuthorityKeyId = '2.5.29.35',
  AuthorityInformationAccess = '1.3.6.1.5.5.7.1.1',
  SubjectAltName = '2.5.29.17',
  CertificatePolicies = '2.5.29.32',
  CrlDistributionPoints = '2.5.29.31',
}

type LocaleKeysArray = Readonly<Array<keyof (typeof translations)[AppfxLocale.En]>>;

/**
 * NOTE: The order of this array matters.
 * The generic name type is a numeric index which corresponds to a name in this array.
 *
 * From RFC-5280
 * GeneralName ::= Choice {
 *     otherName                       [0]     OtherName,
 *     rfc822Name                      [1]     IA5String,
 *     dNSName                         [2]     IA5String,
 *     x400Address                     [3]     ORAddress,
 *     directoryName                   [4]     value,
 *     ediPartyName                    [5]     EDIPartyName,
 *     uniformResourceIdentifier       [6]     IA5String,
 *     iPAddress                       [7]     OCTET STRING,
 *     registeredID                    [8]     OBJECT IDENTIFIER
 * }
 */
export const generalNamesTypeToLocaleKey: LocaleKeysArray = [
  'general-name-other-name',
  'general-name-rfc822-name',
  'general-name-dns-name',
  'general-name-x400-address',
  'general-name-directory-name',
  'general-name-edi-party-name',
  'general-name-uri',
  'general-name-ip-address',
  'general-name-registered-id',
];

/**
 * NOTE: The order of this array matters.
 * The indices of the values in the array correspond to their bit place.
 *
 * From RFC-5280
 * KeyUsage ::= BIT STRING {
 *         digitalSignature        (0),
 *         nonRepudiation          (1), -- recent editions of X.509 have
 *                                      -- renamed this bit to contentCommitment
 *         keyEncipherment         (2),
 *         dataEncipherment        (3),
 *         keyAgreement            (4),
 *         keyCertSign             (5),
 *         cRLSign                 (6),
 *         encipherOnly            (7),
 *         decipherOnly            (8) }
 *
 * Rules:
 * Client-KeyUsage: !({encipherOnly} && {decipherOnly})
 * Server-KeyUsage: !({encipherOnly} && {decipherOnly})
 * CA-KeyUsage: !({encipherOnly} && {decipherOnly}) && {keyCertSign}
 */
export const keyUsageBitIndexToLocaleKey: LocaleKeysArray = [
  'key-usage-digitalSignature',
  'key-usage-nonRepudiation',
  'key-usage-keyEncipherment',
  'key-usage-dataEncipherment',
  'key-usage-keyAgreement',
  'key-usage-keyCertSign',
  'key-usage-cRLSign',
  'key-usage-encipherOnly',
  'key-usage-decipherOnly',
];

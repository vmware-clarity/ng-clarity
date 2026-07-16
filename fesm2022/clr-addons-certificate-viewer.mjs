import * as i3 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Pipe, Input, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import * as i1 from '@clr/addons/translate';
import { HourFormat, DateTimeKind, defaultMissingTranslationHandler, AppfxTranslateService, appfxMissingTranslationToken, appfxTranslationsToken, AppfxTranslateModule } from '@clr/addons/translate';
import * as i1$1 from '@clr/angular';
import { ClarityIcons, angleIcon, ClrAlertModule, ClrSpinnerModule, ClrTabsModule, ClrTreeViewModule } from '@clr/angular';
import { fromBER } from 'asn1js';
import { RelativeDistinguishedNames, Certificate as Certificate$1, RSAPublicKey, ECPublicKey } from 'pkijs';
import * as i2 from '@clr/angular/utils';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const translations = {
    en: {
        loading: 'Loading',
        'issued-to': 'Issued To',
        'issued-by': 'Issued By',
        'issued-on': 'Issued On',
        'expires-on': 'Expires On',
        'validity-period': 'Validity Period',
        fingerprints: 'Fingerprints',
        'sha-256-fingerprint': 'SHA-256 Fingerprint',
        'sha-1-fingerprint': 'SHA-1 Fingerprint',
        title: 'Certificate viewer: {{title}}',
        general: 'General',
        details: 'Details',
        'not-part-of-certificate': '<Not part of certificate>',
        'certificate-hierarchy': 'Certificate Hierarchy',
        'certificate-fields': 'Certificate Fields',
        'field-value': 'Field Value',
        version: 'Version',
        'version-format': 'Version {{version}}',
        validity: 'Validity',
        'not-before': 'Not Before',
        'not-after': 'Not After',
        'serial-number': 'Serial Number',
        issuer: 'Issuer',
        subject: 'Subject',
        'certificate-signature-algorithm': 'Certificate Signature Algorithm',
        'certificate-signature-value': 'Certificate Signature Value',
        'subject-public-key-info': 'Subject Public Key Info',
        'subject-public-key-algorithm': 'Subject Public Key Algorithm',
        'subjects-public-key': "Subject's Public Key",
        'modulus-bits': 'Modulus ({{bits}} bits):',
        'public-exponent': 'Public Exponent:',
        'named-curve': 'Named Curve: {{curve}}',
        extensions: 'Extensions',
        critical: 'Critical',
        'not-critical': 'Not critical',
        signing: 'Signing',
        'certificate-signer': 'Certificate Signer',
        'clr-signer': 'CRL Signer',
        'is-not-cert-authority': 'Is not a Certification Authority',
        'is-cert-authority': 'Is a Certification Authority',
        'max-number-intermediate-CAs': 'Maximum number of intermediate CAs: {{maxNumber}}',
        unlimited: 'unlimited',
        'key-id': 'Key ID: {{id}}',
        'general-name-other-name': 'Other Name',
        'general-name-rfc822-name': 'RFC822 Name',
        'general-name-dns-name': 'DNS Name',
        'general-name-x400-address': 'X400 Address',
        'general-name-directory-name': 'Directory Name',
        'general-name-edi-party-name': 'EDI Party Name',
        'general-name-uri': 'URI',
        'general-name-ip-address': 'IP Address',
        'general-name-registered-id': 'Registered ID',
        'key-usage-digitalSignature': 'Signing',
        'key-usage-nonRepudiation': 'Non Repudiation',
        'key-usage-keyEncipherment': 'Key Encipherment',
        'key-usage-dataEncipherment': 'Data Encipherment',
        'key-usage-keyAgreement': 'Key Agreement',
        'key-usage-keyCertSign': 'Certificate Signer',
        'key-usage-cRLSign': 'CRL Signer',
        'key-usage-encipherOnly': 'Encipher Only',
        'key-usage-decipherOnly': 'Decipher Only',
        'crl-issuer': 'CRL Issuer:',
        reasons: 'Reasons:',
        // X.500 Attributes 2.5.4.* with their relative distinguished names (RDNs)
        '2.5.4.3': 'Common Name (CN)',
        '2.5.4.4': 'Surname (SN)',
        '2.5.4.5': 'Serial Number (SERIALNUMBER)',
        '2.5.4.6': 'Country Name (C)',
        '2.5.4.7': 'Locality Name (L)',
        '2.5.4.8': 'State or Province Name (ST)',
        '2.5.4.9': 'Street Address (STREET)',
        '2.5.4.10': 'Organization Name (O)',
        '2.5.4.11': 'Organizational Unit (OU)',
        '2.5.4.12': 'Title (T)',
        '2.5.4.43': 'Initials (I)',
        '2.5.4.42': 'Given Name (GN)',
        '2.5.4.44': 'Generation Qualifier',
        '2.5.4.46': 'Distinguished Name Qualifier (DN Qualifier)',
        // Certificate Extension 2.5.29.*
        '2.5.29.9': 'Subject Directory Attributes',
        '2.5.29.14': 'Certificate Subject Key ID',
        '2.5.29.15': 'Certificate Key Usage',
        '2.5.29.16': 'Private Key Usage',
        '2.5.29.17': 'Certificate Subject Alternative Name',
        '2.5.29.18': 'Certificate Issuer Alternative Name',
        '2.5.29.19': 'Certificate Basic Constraints',
        '2.5.29.20': 'CRL Number',
        '2.5.29.21': 'Reason Code',
        '2.5.29.23': 'Hold Instruction Code',
        '2.5.29.24': 'Invalidity Date',
        '2.5.29.27': 'Delta CRL Indicator',
        '2.5.29.28': 'Issuing Distribution Point',
        '2.5.29.29': 'Certificate Issuer',
        '2.5.29.30': 'Name Constraints',
        '2.5.29.31': 'CRL Distribution Points',
        '2.5.29.32': 'Certificate Policies',
        '2.5.29.32.0': 'Any policy',
        '2.5.29.33': 'Policy Mappings',
        '2.5.29.35': 'Certificate Authority Key ID',
        '2.5.29.36': 'Policy Constraints',
        '2.5.29.37': 'Extended Key Usage',
        '2.5.29.37.0': 'Any extended key usage',
        '2.5.29.46': 'Freshest CRL',
        '2.5.29.54': 'Inhibit Any Policy',
        // PKIX 1.3.6.1.5.5.7.*
        '1.3.6.1.5.5.7.1.1': 'Authority Information Access',
        '1.3.6.1.5.5.7.1.11': 'Subject Information Access',
        '1.3.6.1.5.5.7.2.1': 'Certificate Practice Statement Pointer',
        '1.3.6.1.5.5.7.3.1': 'TLS WWW Server Authentication',
        '1.3.6.1.5.5.7.3.2': 'TLS WWW Client Authentication',
        '1.3.6.1.5.5.7.3.3': 'Signing of Downloadable Executable Code',
        '1.3.6.1.5.5.7.3.4': 'Email Protection',
        '1.3.6.1.5.5.7.3.5': 'IPSEC End System Certificate',
        '1.3.6.1.5.5.7.3.6': 'IPSEC Tunnel Certificate',
        '1.3.6.1.5.5.7.3.7': 'IPSEC User Certificate',
        '1.3.6.1.5.5.7.3.8': 'PKIX key purpose Time Stamping',
        '1.3.6.1.5.5.7.3.9': 'Signing OCSP Responses',
        '1.3.6.1.5.5.7.48.1': 'Online Certificate Status Protocol (OCSP)',
        '1.3.6.1.5.5.7.48.1.1': 'OCSP Basic Response',
        '1.3.6.1.5.5.7.48.1.2': 'OCSP Nonce Extension',
        '1.3.6.1.5.5.7.48.1.3': 'Certificate Revocation List (CRL) reference',
        '1.3.6.1.5.5.7.48.1.4': 'Response types understood by an OCSP client',
        '1.3.6.1.5.5.7.48.1.5': 'OCSP No Check Extension',
        '1.3.6.1.5.5.7.48.1.6': 'OCSP Archive Cutoff Extension',
        '1.3.6.1.5.5.7.48.1.7': 'OCSP Service Locator Extension',
        '1.3.6.1.5.5.7.48.1.8': 'Client Indication Of Preferred Signature Algorithms',
        '1.3.6.1.5.5.7.48.2': 'Certificate Authority Issuers',
        '1.3.6.1.5.5.7.48.3': 'Time Stamping',
        '1.3.6.1.5.5.7.48.5': 'Certificate Authority (CA) Repository',
        // -- NIST --
        // AES 2.16.840.1.101.3.4.1.*
        '2.16.840.1.101.3.4.1': 'Advanced Encryption Standard (AES)',
        '2.16.840.1.101.3.4.1.1': 'AES-128 ECB',
        '2.16.840.1.101.3.4.1.2': 'AES-128 CBC',
        '2.16.840.1.101.3.4.1.3': 'AES-128 OFB',
        '2.16.840.1.101.3.4.1.4': 'AES-128 CFB',
        '2.16.840.1.101.3.4.1.5': 'AES-128 KW',
        '2.16.840.1.101.3.4.1.6': 'AES-128 GCM',
        '2.16.840.1.101.3.4.1.8': 'AES-128 KWP',
        '2.16.840.1.101.3.4.1.21': 'AES-192 ECB',
        '2.16.840.1.101.3.4.1.22': 'AES-192 CBC',
        '2.16.840.1.101.3.4.1.23': 'AES-192 OFB',
        '2.16.840.1.101.3.4.1.24': 'AES-192 CFB',
        '2.16.840.1.101.3.4.1.25': 'AES-192 KW',
        '2.16.840.1.101.3.4.1.26': 'AES-192 GCM',
        '2.16.840.1.101.3.4.1.28': 'AES-192 KWP',
        '2.16.840.1.101.3.4.1.41': 'AES-256 ECB',
        '2.16.840.1.101.3.4.1.42': 'AES-256 CBC',
        '2.16.840.1.101.3.4.1.43': 'AES-256 OFB',
        '2.16.840.1.101.3.4.1.44': 'AES-256 CFB',
        '2.16.840.1.101.3.4.1.45': 'AES-256 KW',
        '2.16.840.1.101.3.4.1.46': 'AES-256 GCM',
        '2.16.840.1.101.3.4.1.48': 'AES-256 KWP',
        // Secure Hash Algorithms 2.16.840.1.101.3.4.2.*
        '2.16.840.1.101.3.4.2': 'Secure Hash Algorithms',
        '2.16.840.1.101.3.4.2.1': 'SHA-256',
        '2.16.840.1.101.3.4.2.2': 'SHA-384',
        '2.16.840.1.101.3.4.2.3': 'SHA-512',
        '2.16.840.1.101.3.4.2.4': 'SHA-224',
        '2.16.840.1.101.3.4.2.5': 'SHA-512/224',
        '2.16.840.1.101.3.4.2.6': 'SHA-512/256',
        '2.16.840.1.101.3.4.2.7': 'SHA3-224',
        '2.16.840.1.101.3.4.2.8': 'SHA3-256',
        '2.16.840.1.101.3.4.2.9': 'SHA3-384',
        '2.16.840.1.101.3.4.2.10': 'SHA3-512',
        '2.16.840.1.101.3.4.2.11': 'SHAKE-128',
        '2.16.840.1.101.3.4.2.12': 'SHAKE-256',
        '2.16.840.1.101.3.4.2.13': 'HMAC-SHA3-224',
        '2.16.840.1.101.3.4.2.14': 'HMAC-SHA3-256',
        '2.16.840.1.101.3.4.2.15': 'HMAC-SHA3-384',
        '2.16.840.1.101.3.4.2.16': 'HMAC-SHA3-512',
        '2.16.840.1.101.3.4.2.17': 'SHAKE-128 with parameter ShakeOutputLen',
        '2.16.840.1.101.3.4.2.18': 'SHAKE-256 with parameter ShakeOutputLen',
        // Signature Algorithms 2.16.840.1.101.3.4.3.*
        '2.16.840.1.101.3.4.3': 'Signature Algorithms',
        '2.16.840.1.101.3.4.3.1': 'SHA-224 With DSA',
        '2.16.840.1.101.3.4.3.2': 'SHA-256 With DSA',
        '2.16.840.1.101.3.4.3.3': 'SHA-384 With DSA',
        '2.16.840.1.101.3.4.3.4': 'SHA-512 With DSA',
        '2.16.840.1.101.3.4.3.5': 'SHA3-224 With DSA',
        '2.16.840.1.101.3.4.3.6': 'SHA3-256 With DSA',
        '2.16.840.1.101.3.4.3.7': 'SHA3-384 With DSA',
        '2.16.840.1.101.3.4.3.8': 'SHA3-512 With DSA',
        '2.16.840.1.101.3.4.3.9': 'SHA3-224 With ECDSA',
        '2.16.840.1.101.3.4.3.10': 'SHA3-256 With ECDSA',
        '2.16.840.1.101.3.4.3.11': 'SHA3-384 With ECDSA',
        '2.16.840.1.101.3.4.3.12': 'SHA3-512 With ECDSA',
        '2.16.840.1.101.3.4.3.13': 'SHA3-224 With RSA',
        '2.16.840.1.101.3.4.3.14': 'SHA3-256 With RSA',
        '2.16.840.1.101.3.4.3.15': 'SHA3-384 With RSA',
        '2.16.840.1.101.3.4.3.16': 'SHA3-512 With RSA',
        // RSA Security
        // PKCS1 1.2.840.113549.1.1.*
        '1.2.840.113549.1.1': 'Public-Key Cryptography Standards (PKCS) #1',
        '1.2.840.113549.1.1.1': 'PKCS #1 RSAES-PKCS1-v1_5 encryption scheme',
        '1.2.840.113549.1.1.2': 'PKCS #1 MD2 With RSA Encryption',
        '1.2.840.113549.1.1.4': 'PKCS #1 MD5 With RSA Encryption',
        '1.2.840.113549.1.1.5': 'PKCS #1 SHA1 With RSA Encryption',
        '1.2.840.113549.1.1.7': 'PKCS #1 RSA OAEP Encryption Set',
        '1.2.840.113549.1.1.8': 'PKCS #1 RSA With MGF1',
        '1.2.840.113549.1.1.9': 'PKCS #1 RSA PSpecified',
        '1.2.840.113549.1.1.10': 'PKCS #1 RSASSA-PSS',
        '1.2.840.113549.1.1.11': 'PKCS #1 SHA-256 With RSA Encryption',
        '1.2.840.113549.1.1.12': 'PKCS #1 SHA-384 With RSA Encryption',
        '1.2.840.113549.1.1.13': 'PKCS #1 SHA-512 With RSA Encryption',
        '1.2.840.113549.1.1.14': 'PKCS #1 SHA-224 With RSA Encryption',
        '1.2.840.113549.1.1.15': 'PKCS #1 SHA-512/224 With RSA Encryption',
        '1.2.840.113549.1.1.16': 'PKCS #1 SHA-512/256 With RSA Encryption',
        // PKCS3 1.2.840.113549.1.3.*
        '1.2.840.113549.1.3': 'Public-Key Cryptography Standards (PKCS) #3: Diffie-Hellman Key-Agreement Standard',
        '1.2.840.113549.1.3.1': 'PKCS #3 Diffie-Hellman (DH) key agreement',
        // PKCS5 1.2.840.113549.1.5.*
        '1.2.840.113549.1.5': 'PKCS #5 Public-Key Cryptography Standards (PKCS) #5',
        '1.2.840.113549.1.5.3': 'PKCS #5 PBE With MD5 And DES',
        '1.2.840.113549.1.5.6': 'PKCS #5 PBE With MD5 And RC2',
        '1.2.840.113549.1.5.10': 'PKCS #5 PBE With SHA1 And DES',
        '1.2.840.113549.1.5.11': 'PKCS #5 PBE With SHA1 And RC2',
        '1.2.840.113549.1.5.12': 'PKCS #5 Password-Based Key Derivation Function 2 (PBKDF2)',
        '1.2.840.113549.1.5.13': 'PKCS #5 Password-Based Encryption Scheme 2 (PBES2)',
        // PKCS7 1.2.840.113549.1.7.*
        '1.2.840.113549.1.7': 'Public-Key Cryptography Standards (PKCS) #7',
        '1.2.840.113549.1.7.1': 'PKCS #7 Data',
        '1.2.840.113549.1.7.2': 'PKCS #7 Signed Data',
        '1.2.840.113549.1.7.3': 'PKCS #7 Enveloped Data',
        '1.2.840.113549.1.7.4': 'PKCS #7 Signed And Enveloped Data',
        '1.2.840.113549.1.7.5': 'PKCS #7 Digested Data',
        '1.2.840.113549.1.7.6': 'PKCS #7 Encrypted Data',
        // PKCS9 1.2.840.113549.1.9.*
        '1.2.840.113549.1.9': 'Public-Key Cryptography Standards (PKCS) #9',
        '1.2.840.113549.1.9.1': 'PKCS #9 Email Address',
        '1.2.840.113549.1.9.2': 'PKCS #9 Unstructured Name',
        '1.2.840.113549.1.9.3': 'PKCS #9 Content Type',
        '1.2.840.113549.1.9.4': 'PKCS #9 Message Digest',
        '1.2.840.113549.1.9.5': 'PKCS #9 Signing Time',
        '1.2.840.113549.1.9.6': 'PKCS #9 Counter Signature',
        '1.2.840.113549.1.9.7': 'PKCS #9 Challenge Password',
        '1.2.840.113549.1.9.8': 'PKCS #9 Unstructured Address',
        '1.2.840.113549.1.9.9': 'PKCS #9 Extended Certificate Attributes',
        '1.2.840.113549.1.9.10': 'PKCS #9 Issuer And Serial Number',
        '1.2.840.113549.1.9.14': 'PKCS #9 Extension Request',
        '1.2.840.113549.1.9.15': 'PKCS #9 SMIME Capability',
        '1.2.840.113549.1.9.16.1.4': 'PKCS #9 Time Stamp Token Info',
        '1.2.840.113549.1.9.16.2.12': 'PKCS #9 Signing Certificate',
        '1.2.840.113549.1.9.16.2.14': 'PKCS #9 Signature Timestamp Token',
        '1.2.840.113549.1.9.16.3.18': 'PKCS #9 AEAD_CHACHA20_POLY1305 Authenticated Encryption With Associated Data (AEAD) algorithm',
        '1.2.840.113549.1.9.20': 'PKCS #9 Friendly Name',
        '1.2.840.113549.1.9.21': 'PKCS #9 Local Key Id',
        '1.2.840.113549.1.9.22.1': 'PKCS #9 x509Certificate (for PKCS #12)',
        '1.2.840.113549.1.9.52': 'PKCS #9 CMS Algorithm Protection',
        // PKCS12 1.2.840.113549.1.12.*
        '1.2.840.113549.1.12': 'Public-Key Cryptography Standards (PKCS) #12',
        '1.2.840.113549.1.12.1.1': 'PKCS #12 SHA1-PBE With RC4-128',
        '1.2.840.113549.1.12.1.2': 'PKCS #12 SHA1-PBE With RC4-40',
        '1.2.840.113549.1.12.1.3': 'PKCS #12 SHA1-PBE With DES-EDE',
        '1.2.840.113549.1.12.1.5': 'PKCS #12 SHA1-PBE With RC2-128',
        '1.2.840.113549.1.12.1.6': 'PKCS #12 SHA1-PBE With RC2-40',
        '1.2.840.113549.1.12.10.1.1': 'PKCS #12 PKCS #8 Shrouded Key Bag',
        '1.2.840.113549.1.12.10.1.3': 'PKCS #12 Certificate Bag',
        '1.2.840.113549.1.12.10.1.4': 'PKCS #12 Certificate Revocation List (CRL) bag',
        '1.2.840.113549.1.12.10.1.5': 'PKCS #12 Secret Bag',
        '1.2.840.113549.1.12.10.1.6': 'PKCS #12 Safe Contents Bag',
        // Digest Algorithms 1.2.840.113549.2.*
        '1.2.840.113549.2': 'Digest Algorithms',
        '1.2.840.113549.2.2': 'Message Digest #2 (MD2)',
        '1.2.840.113549.2.5': 'Message Digest #5 (MD5)',
        '1.2.840.113549.2.7': 'HMAC-SHA-1',
        '1.2.840.113549.2.8': 'HMAC-SHA-224',
        '1.2.840.113549.2.9': 'HMAC-SHA-256',
        '1.2.840.113549.2.10': 'HMAC-SHA-384',
        '1.2.840.113549.2.11': 'HMAC-SHA-512',
        '1.2.840.113549.2.12': 'HMAC-SHA-512/224',
        '1.2.840.113549.2.13': 'HMAC-SHA-512/256',
        // Encryption Algorithms 1.2.840.113549.3.*
        '1.2.840.113549.3': 'Encryption Algorithms',
        '1.2.840.113549.3.2': 'RC2-CBC',
        '1.2.840.113549.3.4': 'RC4-CBC',
        '1.2.840.113549.3.7': 'DES-EDE3-CBC',
        '1.2.840.113549.3.9': 'RC5-CBC',
        // -- ANSI --
        // X9 1.2.840.10040.4.*
        '1.2.840.10040.4.1': 'Dsa Subject Public Key',
        '1.2.840.10040.4.3': 'DSA With SHA-1',
        // X9.62 1.2.840.10045.*
        '1.2.840.10045.2.1': 'Elliptic Curve Public Key Cryptography',
        '1.2.840.10045.3.0.5': 'TNB 191 V1',
        '1.2.840.10045.3.0.6': 'TNB 191 V2',
        '1.2.840.10045.3.0.7': 'TNB 191 V3',
        '1.2.840.10045.3.0.11': 'TNB 239 V1',
        '1.2.840.10045.3.0.12': 'TNB 239 V2',
        '1.2.840.10045.3.0.13': 'TNB 239 V3',
        '1.2.840.10045.3.0.18': 'TNB 359 V1',
        '1.2.840.10045.3.0.20': 'TNB 431 R1',
        '1.2.840.10045.3.1.1': 'Elliptic curve domain "secp192r1" listed in "SEC 2" recommended elliptic curve domain',
        '1.2.840.10045.3.1.2': 'Prime 192 V2',
        '1.2.840.10045.3.1.3': 'Prime 192 V3',
        '1.2.840.10045.3.1.4': 'Prime 239 V1',
        '1.2.840.10045.3.1.5': 'Prime 239 V2',
        '1.2.840.10045.3.1.6': 'Prime 239 V3',
        '1.2.840.10045.3.1.7': 'NIST P-256',
        '1.2.840.10045.4.1': 'ANSI X9.62 ECDSA With SHA-1',
        '1.2.840.10045.4.3.1': 'ECDSA WithSHA-224 signature values',
        '1.2.840.10045.4.3.2': 'DSA With SHA-256',
        '1.2.840.10045.4.3.3': 'DSA With SHA-384',
        '1.2.840.10045.4.3.4': 'DSA With SHA-512',
        '1.2.840.10045.4.3': 'ANSI X9.62 ECDSA With SHA2',
        // X9.42 1.2.840.10046.2.*
        '1.2.840.10046.2.1': 'Ephemeral-Static Diffie-Hellman (DH) key agreement algorithm',
        // Teletrust 1.3.36.*
        '1.3.36.3.3.2.8.1.1.1': 'Brainpool P160r1 domain parameter set',
        '1.3.36.3.3.2.8.1.1.3': 'Brainpool P192r1 domain parameter set',
        '1.3.36.3.3.2.8.1.1.5': 'Brainpool P224r1 domain parameter set',
        '1.3.36.3.3.2.8.1.1.7': 'Brainpool P256r1 domain parameter set',
        '1.3.36.3.3.2.8.1.1.9': 'Brainpool P320r1 domain parameter set',
        '1.3.36.3.3.2.8.1.1.11': 'Brainpool P384r1 domain parameter set',
        '1.3.36.3.3.2.8.1.1.13': 'Brainpool P512r1 domain parameter set',
        // Certicom 1.3.132.*
        '1.3.132.0.1': '"SEC 2" recommended elliptic curve domain "sect163k1"',
        '1.3.132.0.2': '"SEC 2" recommended elliptic curve domain "sect163r1"',
        '1.3.132.0.3': '"SEC 2" recommended elliptic curve domain "sect239k1"',
        '1.3.132.0.4': '"SEC 2" recommended elliptic curve domain "sect113r1"',
        '1.3.132.0.5': '"SEC 2" recommended elliptic curve domain "sect113r2"',
        '1.3.132.0.6': '"SEC 2" recommended elliptic curve domain "secp112r1"',
        '1.3.132.0.7': '"SEC 2" recommended elliptic curve domain "secp112r2"',
        '1.3.132.0.8': '"SEC 2" recommended elliptic curve domain "secp160r1"',
        '1.3.132.0.9': '"SEC 2" recommended elliptic curve domain "secp160k1"',
        '1.3.132.0.10': '"SEC 2" recommended elliptic curve domain "ansip256k1"',
        '1.3.132.0.15': '"SEC 2" recommended elliptic curve domain "sect163r2"',
        '1.3.132.0.16': '"SEC 2" recommended elliptic curve domain "sect283k1"',
        '1.3.132.0.17': '"SEC 2" recommended elliptic curve domain "sect283r1"',
        '1.3.132.0.22': '"SEC 2" recommended elliptic curve domain "sect131r1"',
        '1.3.132.0.23': '"SEC 2" recommended elliptic curve domain "sect131r2"',
        '1.3.132.0.24': '"SEC 2" recommended elliptic curve domain "sect193r1"',
        '1.3.132.0.25': '"SEC 2" recommended elliptic curve domain "sect193r2"',
        '1.3.132.0.26': '"SEC 2" recommended elliptic curve domain "sect233k1"',
        '1.3.132.0.27': '"SEC 2" recommended elliptic curve domain "sect233r1"',
        '1.3.132.0.28': '"SEC 2" recommended elliptic curve domain "secp128r1"',
        '1.3.132.0.29': '"SEC 2" recommended elliptic curve domain "secp128r2"',
        '1.3.132.0.30': '"SEC 2" recommended elliptic curve domain "secp160r2"',
        '1.3.132.0.31': '"SEC 2" recommended elliptic curve domain "secp192k1"',
        '1.3.132.0.32': '"SEC 2" recommended elliptic curve domain "secp224k1"',
        '1.3.132.0.33': '"SEC 2" recommended elliptic curve domain "secp224r1"',
        '1.3.132.0.34': 'National Institute of Standards and Technology (NIST) 384-bit elliptic curve',
        '1.3.132.0.35': 'National Institute of Standards and Technology (NIST) 512-bit elliptic curve',
        '1.3.132.0.36': '"SEC 2" recommended elliptic curve domain "sect409k1"',
        '1.3.132.0.37': '"SEC 2" recommended elliptic curve domain "sect409r1"',
        '1.3.132.0.38': '"SEC 2" recommended elliptic curve domain "sect571k1"',
        '1.3.132.0.39': '"SEC 2" recommended elliptic curve domain "sect571r1"',
        '1.3.132.1.12': 'Elliptic Curve Diffie-Hellman (ECDH) algorithm',
        // OIW secsig 1.3.14.3.*
        '1.3.14.3.2.7': 'Single-key Data Encryption Standard (DES) in Cipher Block Chaining (CBC) mode with padding operation',
        '1.3.14.3.2.12': 'Digital Signature Algorithm (DSA)',
        '1.3.14.3.2.13': 'Security Digital Signature Algorithm (DSA) that uses the Secure Hash Algorithm (SHA) to hash the message contents',
        '1.3.14.3.2.15': 'Rivest, Shamir and Adleman (RSA) algorithm coupled with the Secure Hash Algorithm (SHA) (Oddball using ISO/IEC 9796-2 padding rules)',
        '1.3.14.3.2.17': 'Voice encryption using Data Encryption Standard (DES) (168-bit) algorithm coupled with the Encrypt-Decrypt-Encrypt (EDE) multiple encryption mode of operation',
        '1.3.14.3.2.26': 'Secure Hash Algorithm, revision 1 (SHA-1)',
        '1.3.14.3.2.27': 'Digital Signature Algorithm (DSA) that uses the Secure Hash Algorithm 1 (SHA1) producing a 320-bit signature',
        '1.3.14.3.2.29': 'Rivest, Shamir and Adleman (RSA) algorithm that uses the Secure Hash Algorithm 1 (SHA1) (obsolete)',
        // Thawte 1.3.101.*
        '1.3.101.110': 'Curve25519 (or X25519) algorithm used with the Diffie-Hellman operation',
        '1.3.101.111': 'Curve448 (or X448) algorithm used with the Diffie-Hellman operation',
        '1.3.101.112': 'Edwards-curve Digital Signature Algorithm (EdDSA) Ed25519',
        '1.3.101.113': 'Edwards-curve Digital Signature Algorithm (EdDSA) Ed448',
        // University College London (UCL) 0.9.2342.19200300.*
        '0.9.2342.19200300.100.1.1': 'User ID (UID)',
        '0.9.2342.19200300.100.1.25': 'Domain component (DC)',
        // Netscape 2.16.840.1.113730.*
        '2.16.840.1.113730.1.1': 'Netscape Certificate Type',
        '2.16.840.1.113730.2.5': 'Certificate Sequence',
        '2.16.840.1.113730.4.1': 'Netscape Server Gated Crypto (SGC)',
    },
    es: {
        loading: 'Loading',
        'issued-to': 'Emitido para',
        'issued-by': 'Emitido por',
        'issued-on': 'Emitido el',
        'expires-on': 'Caduca el',
        'validity-period': 'Período de validez',
        fingerprints: 'Huellas',
        'sha-256-fingerprint': 'Huella digital SHA-256',
        'sha-1-fingerprint': 'Huella digital SHA-1',
        title: 'Visor de certificados: {{title}}',
        general: 'General',
        details: 'Detalles',
        'not-part-of-certificate': '<Not part of certificate>',
        'certificate-hierarchy': 'Jerarquía de certificados',
        'certificate-fields': 'Campos de certificados',
        'field-value': 'Valor de campo',
        version: 'Versión',
        'version-format': 'Versión {{version}}',
        validity: 'Validez',
        'not-before': 'No antes',
        'not-after': 'No después',
        'serial-number': 'Número de serie',
        issuer: 'Emisor',
        subject: 'Sujeto',
        'certificate-signature-algorithm': 'Algoritmo de firma de certificado',
        'certificate-signature-value': 'Valor de firma de certificado',
        'subject-public-key-info': 'Información de clave pública del sujeto',
        'subject-public-key-algorithm': 'Algoritmo de clave pública del sujeto',
        'subjects-public-key': 'Clave pública del sujeto',
        'modulus-bits': 'Módulo ({{bits}} bits):',
        'public-exponent': 'Exponente público:',
        'named-curve': 'Curva con nombre: {{curve}}',
        extensions: 'Extensiones',
        critical: 'Crítico',
        'not-critical': 'No crítico',
        signing: 'Firma',
        'certificate-signer': 'Firmante de certificado',
        'clr-signer': 'Firmante de CRL',
        'is-not-cert-authority': 'No es una entidad de certificación',
        'is-cert-authority': 'Es una entidad de certificación',
        'max-number-intermediate-CAs': 'Número máximo de CA intermedias: {{maxNumber}}',
        unlimited: 'ilimitado',
        'key-id': 'Identificador de clave: {{id}}',
        'general-name-other-name': 'Otro nombre',
        'general-name-rfc822-name': 'Nombre RFC822',
        'general-name-dns-name': 'Nombre de DNS',
        'general-name-x400-address': 'Dirección X400',
        'general-name-directory-name': 'Nombre del directorio',
        'general-name-edi-party-name': 'Nombre de entidad EDI',
        'general-name-uri': 'URI',
        'general-name-ip-address': 'Dirección IP',
        'general-name-registered-id': 'ID registrado',
        'key-usage-digitalSignature': 'Firma',
        'key-usage-nonRepudiation': 'No repudio',
        'key-usage-keyEncipherment': 'Cifrado de claves',
        'key-usage-dataEncipherment': 'Cifrado de datos',
        'key-usage-keyAgreement': 'Acuerdo de clave',
        'key-usage-keyCertSign': 'Firmante de certificado',
        'key-usage-cRLSign': 'Firmante de CRL',
        'key-usage-encipherOnly': 'Solo cifrar',
        'key-usage-decipherOnly': 'Solo descifrar',
        'crl-issuer': 'Emisor de CRL:',
        reasons: 'Motivos:',
        // X.500 Attributes 2.5.4.* with their relative distinguished names (RDNs)
        '2.5.4.3': 'Nombre común (CN)',
        '2.5.4.4': 'Apellido (SN)',
        '2.5.4.5': 'Número de serie (SERIALNUMBER)',
        '2.5.4.6': 'Nombre de país (C)',
        '2.5.4.7': 'Nombre de la localidad (L)',
        '2.5.4.8': 'Nombre de estado o provincia (ST)',
        '2.5.4.9': 'Dirección postal (STREET)',
        '2.5.4.10': 'Nombre de organización (O)',
        '2.5.4.11': 'Unidad organizativa (OU)',
        '2.5.4.12': 'Cargo (T)',
        '2.5.4.43': 'Iniciales (I)',
        '2.5.4.42': 'Nombre propio (GN)',
        '2.5.4.44': 'Calificador de generación',
        '2.5.4.46': 'Calificador de nombre distintivo (calificador de DN)',
        // Certificate Extension 2.5.29.*
        '2.5.29.9': 'Atributos de directorio de sujeto',
        '2.5.29.14': 'Identificador de clave de sujeto de certificado',
        '2.5.29.15': 'Uso de clave de certificado',
        '2.5.29.16': 'Uso de clave privada',
        '2.5.29.17': 'Nombre alternativo del sujeto del certificado',
        '2.5.29.18': 'Nombre alternativo del emisor del certificado',
        '2.5.29.19': 'Restricciones básicas del certificado',
        '2.5.29.20': 'Número de CRL',
        '2.5.29.21': 'Código de razón',
        '2.5.29.23': 'Retener código de instrucción',
        '2.5.29.24': 'Fecha de expiración',
        '2.5.29.27': 'Indicador de CRL de delta',
        '2.5.29.28': 'Emisión de punto de distribución',
        '2.5.29.29': 'Emisor del certificado',
        '2.5.29.30': 'Restricciones de nombre',
        '2.5.29.31': 'Puntos de distribución de CRL',
        '2.5.29.32': 'Directivas del certificado',
        '2.5.29.32.0': 'Cualquier directiva',
        '2.5.29.33': 'Asignaciones de directivas',
        '2.5.29.35': 'Identificador de clave de entidad de certificación',
        '2.5.29.36': 'Restricciones de directivas',
        '2.5.29.37': 'Uso extendido de la clave',
        '2.5.29.37.0': 'Cualquier uso extendido de la clave',
        '2.5.29.46': 'CRL más reciente',
        '2.5.29.54': 'Inhibir cualquier directiva',
        // PKIX 1.3.6.1.5.5.7.*
        '1.3.6.1.5.5.7.1.1': 'Acceso a información de entidad',
        '1.3.6.1.5.5.7.1.11': 'Acceso a información de sujeto',
        '1.3.6.1.5.5.7.2.1': 'Puntero de declaración de práctica de certificado',
        '1.3.6.1.5.5.7.3.1': 'Autenticación del servidor WWW de TLS',
        '1.3.6.1.5.5.7.3.2': 'Autenticación de cliente WWW de TLS',
        '1.3.6.1.5.5.7.3.3': 'Firma del código ejecutable descargable',
        '1.3.6.1.5.5.7.3.4': 'Protección de correo electrónico',
        '1.3.6.1.5.5.7.3.5': 'Certificado del sistema final de IPSEC',
        '1.3.6.1.5.5.7.3.6': 'Certificado de túnel de IPSEC',
        '1.3.6.1.5.5.7.3.7': 'Certificado de usuario de IPSEC',
        '1.3.6.1.5.5.7.3.8': 'Marca de tiempo para propósito de clave PKIX',
        '1.3.6.1.5.5.7.3.9': 'Firma de respuestas de OCSP',
        '1.3.6.1.5.5.7.48.1': 'Protocolo de estado de certificados en línea (OCSP)',
        '1.3.6.1.5.5.7.48.1.1': 'Respuesta básica de OCSP',
        '1.3.6.1.5.5.7.48.1.2': 'Extensión de Nonce de OCSP',
        '1.3.6.1.5.5.7.48.1.3': 'Referencia de lista de revocación de certificados (CRL)',
        '1.3.6.1.5.5.7.48.1.4': 'Tipos de respuesta entendidos por un cliente OCSP',
        '1.3.6.1.5.5.7.48.1.5': 'Extensión sin comprobación de OCSP',
        '1.3.6.1.5.5.7.48.1.6': 'Extensión de límite de archivo de OCSP',
        '1.3.6.1.5.5.7.48.1.7': 'Extensión del localizador de servicios OCSP',
        '1.3.6.1.5.5.7.48.1.8': 'Indicación del cliente de algoritmos de firma preferidos',
        '1.3.6.1.5.5.7.48.2': 'Emisores de entidad de certificación',
        '1.3.6.1.5.5.7.48.3': 'Marca de tiempo',
        '1.3.6.1.5.5.7.48.5': 'Repositorio de entidad de certificación (CA)',
        // -- NIST --
        // AES 2.16.840.1.101.3.4.1.*
        '2.16.840.1.101.3.4.1': 'Estándar de cifrado avanzado (AES)',
        '2.16.840.1.101.3.4.1.1': 'AES-128 ECB',
        '2.16.840.1.101.3.4.1.2': 'AES-128 CBC',
        '2.16.840.1.101.3.4.1.3': 'AES-128 OFB',
        '2.16.840.1.101.3.4.1.4': 'AES-128 CFB',
        '2.16.840.1.101.3.4.1.5': 'AES-128 KW',
        '2.16.840.1.101.3.4.1.6': 'AES-128 GCM',
        '2.16.840.1.101.3.4.1.8': 'AES-128 KWP',
        '2.16.840.1.101.3.4.1.21': 'AES-192 ECB',
        '2.16.840.1.101.3.4.1.22': 'AES-192 CBC',
        '2.16.840.1.101.3.4.1.23': 'AES-192 OFB',
        '2.16.840.1.101.3.4.1.24': 'AES-192 CFB',
        '2.16.840.1.101.3.4.1.25': 'AES-192 KW',
        '2.16.840.1.101.3.4.1.26': 'AES-192 GCM',
        '2.16.840.1.101.3.4.1.28': 'AES-192 KWP',
        '2.16.840.1.101.3.4.1.41': 'AES-256 ECB',
        '2.16.840.1.101.3.4.1.42': 'AES-256 CBC',
        '2.16.840.1.101.3.4.1.43': 'AES-256 OFB',
        '2.16.840.1.101.3.4.1.44': 'AES-256 CFB',
        '2.16.840.1.101.3.4.1.45': 'AES-256 KW',
        '2.16.840.1.101.3.4.1.46': 'AES-256 GCM',
        '2.16.840.1.101.3.4.1.48': 'AES-256 KWP',
        // Secure Hash Algorithms 2.16.840.1.101.3.4.2.*
        '2.16.840.1.101.3.4.2': 'Algoritmos hash seguros',
        '2.16.840.1.101.3.4.2.1': 'SHA-256',
        '2.16.840.1.101.3.4.2.2': 'SHA-384',
        '2.16.840.1.101.3.4.2.3': 'SHA-512',
        '2.16.840.1.101.3.4.2.4': 'SHA-224',
        '2.16.840.1.101.3.4.2.5': 'SHA-512/224',
        '2.16.840.1.101.3.4.2.6': 'SHA-512/256',
        '2.16.840.1.101.3.4.2.7': 'SHA3-224',
        '2.16.840.1.101.3.4.2.8': 'SHA3-256',
        '2.16.840.1.101.3.4.2.9': 'SHA3-384',
        '2.16.840.1.101.3.4.2.10': 'SHA3-512',
        '2.16.840.1.101.3.4.2.11': 'SHAKE-128',
        '2.16.840.1.101.3.4.2.12': 'SHAKE-256',
        '2.16.840.1.101.3.4.2.13': 'HMAC-SHA3-224',
        '2.16.840.1.101.3.4.2.14': 'HMAC-SHA3-256',
        '2.16.840.1.101.3.4.2.15': 'HMAC-SHA3-384',
        '2.16.840.1.101.3.4.2.16': 'HMAC-SHA3-512',
        '2.16.840.1.101.3.4.2.17': 'SHAKE-128 con el parámetro ShakeOutputLen',
        '2.16.840.1.101.3.4.2.18': 'SHAKE-256 con el parámetro ShakeOutputLen',
        // Signature Algorithms 2.16.840.1.101.3.4.3.*
        '2.16.840.1.101.3.4.3': 'Algoritmos de firma',
        '2.16.840.1.101.3.4.3.1': 'SHA-224 con DSA',
        '2.16.840.1.101.3.4.3.2': 'SHA-256 con DSA',
        '2.16.840.1.101.3.4.3.3': 'SHA-384 con DSA',
        '2.16.840.1.101.3.4.3.4': 'SHA-512 con DSA',
        '2.16.840.1.101.3.4.3.5': 'SHA3-224 con DSA',
        '2.16.840.1.101.3.4.3.6': 'SHA3-256 con DSA',
        '2.16.840.1.101.3.4.3.7': 'SHA3-384 con DSA',
        '2.16.840.1.101.3.4.3.8': 'SHA3-512 con DSA',
        '2.16.840.1.101.3.4.3.9': 'SHA3-224 con ECDSA',
        '2.16.840.1.101.3.4.3.10': 'SHA3-256 con ECDSA',
        '2.16.840.1.101.3.4.3.11': 'SHA3-384 con ECDSA',
        '2.16.840.1.101.3.4.3.12': 'SHA3-512 con ECDSA',
        '2.16.840.1.101.3.4.3.13': 'SHA3-224 con RSA',
        '2.16.840.1.101.3.4.3.14': 'SHA3-256 con RSA',
        '2.16.840.1.101.3.4.3.15': 'SHA3-384 con RSA',
        '2.16.840.1.101.3.4.3.16': 'SHA3-512 con RSA',
        // RSA Security
        // PKCS1 1.2.840.113549.1.1.*
        '1.2.840.113549.1.1': 'Estándares de criptografía de clave pública (PKCS) #1',
        '1.2.840.113549.1.1.1': 'Esquema de cifrado RSAES-PKCS1-v1_5 en PKCS #1',
        '1.2.840.113549.1.1.2': 'MD2 con cifrado RSA en PKCS #1',
        '1.2.840.113549.1.1.4': 'MD5 con cifrado RSA en PKCS #1',
        '1.2.840.113549.1.1.5': 'SHA1 con cifrado RSA en PKCS #1',
        '1.2.840.113549.1.1.7': 'Conjunto de cifrado de RSA OAEP en PKCS #1',
        '1.2.840.113549.1.1.8': 'RSA con MGF1 en PKCS #1',
        '1.2.840.113549.1.1.9': 'RSA PSpecified en PKCS #1',
        '1.2.840.113549.1.1.10': 'RSASSA-PSS en PKCS #1',
        '1.2.840.113549.1.1.11': 'SHA-256 con cifrado RSA en PKCS #1',
        '1.2.840.113549.1.1.12': 'SHA-384 con cifrado RSA en PKCS #1',
        '1.2.840.113549.1.1.13': 'SHA-512 con cifrado RSA en PKCS #1',
        '1.2.840.113549.1.1.14': 'SHA-224 con cifrado RSA en PKCS #1',
        '1.2.840.113549.1.1.15': 'SHA-512/224 con cifrado RSA en PKCS #1',
        '1.2.840.113549.1.1.16': 'SHA-512/256 con cifrado RSA en PKCS #1',
        // PKCS3 1.2.840.113549.1.3.*
        '1.2.840.113549.1.3': 'Estándares de criptografía de clave pública (PKCS) #3: estándar Diffie-Hellman Key-Agreement',
        '1.2.840.113549.1.3.1': 'Acuerdo de clave de Diffie-Hellman (DH) en PKCS #3',
        // PKCS5 1.2.840.113549.1.5.*
        '1.2.840.113549.1.5': 'Estándares de criptografía de clave pública (PKCS) #5 en PKCS #5',
        '1.2.840.113549.1.5.3': 'PBE con MD5 y DES en PKCS #5',
        '1.2.840.113549.1.5.6': 'PBE con MD5 y RC2 en PKCS #5',
        '1.2.840.113549.1.5.10': 'PBE con SHA1 y DES en PKCS #5',
        '1.2.840.113549.1.5.11': 'PBE con SHA1 y RC2 en PKCS #5',
        '1.2.840.113549.1.5.12': 'Función de derivación de clave basada en contraseña 2 (PBKDF2) en PKCS #5',
        '1.2.840.113549.1.5.13': 'Esquema de cifrado basado en contraseña 2 (PBES2) en PKCS #5',
        // PKCS7 1.2.840.113549.1.7.*
        '1.2.840.113549.1.7': 'Estándares de criptografía de clave pública (PKCS) #7',
        '1.2.840.113549.1.7.1': 'Datos en PKCS #7',
        '1.2.840.113549.1.7.2': 'Datos firmados en PKCS #7',
        '1.2.840.113549.1.7.3': 'Datos encapsulados en PKCS #7',
        '1.2.840.113549.1.7.4': 'Datos firmados y encapsulados en PKCS #7',
        '1.2.840.113549.1.7.5': 'Datos resumidos en PKCS #7',
        '1.2.840.113549.1.7.6': 'Datos cifrados en PKCS #7',
        // PKCS9 1.2.840.113549.1.9.*
        '1.2.840.113549.1.9': 'Estándares de criptografía de clave pública (PKCS) #9',
        '1.2.840.113549.1.9.1': 'Dirección de correo electrónico en PKCS #9',
        '1.2.840.113549.1.9.2': 'Nombre no estructurado en PKCS #9',
        '1.2.840.113549.1.9.3': 'Tipo de contenido en PKCS #9',
        '1.2.840.113549.1.9.4': 'Resumen de mensaje en PKCS #9',
        '1.2.840.113549.1.9.5': 'Hora de firma en PKCS #9',
        '1.2.840.113549.1.9.6': 'Contrafirma en PKCS #9',
        '1.2.840.113549.1.9.7': 'Contraseña de desafío en PKCS #9',
        '1.2.840.113549.1.9.8': 'Dirección no estructurada en PKCS #9',
        '1.2.840.113549.1.9.9': 'Atributos de certificado extendidos en PKCS #9',
        '1.2.840.113549.1.9.10': 'Emisor y número de serie en PKCS #9',
        '1.2.840.113549.1.9.14': 'Solicitud de extensión en PKCS #9',
        '1.2.840.113549.1.9.15': 'Capacidad de SMIME en PKCS #9',
        '1.2.840.113549.1.9.16.1.4': 'Información del token de marca de tiempo en PKCS #9',
        '1.2.840.113549.1.9.16.2.12': 'Certificado de firma en PKCS #9',
        '1.2.840.113549.1.9.16.2.14': 'Token de marca de tiempo de firma en PKCS #9',
        '1.2.840.113549.1.9.16.3.18': 'Algoritmo de cifrado autenticado con datos asociados (AEAD) AEAD_CHACHA20_POLY1305 en PKCS #9',
        '1.2.840.113549.1.9.20': 'Nombre descriptivo en PKCS #9',
        '1.2.840.113549.1.9.21': 'Identificador de clave local en PKCS #9',
        '1.2.840.113549.1.9.22.1': 'Certificado x509 (para PKCS #12) en PKCS #9',
        '1.2.840.113549.1.9.52': 'Protección de algoritmo de CMS en PKCS #9',
        // PKCS12 1.2.840.113549.1.12.*
        '1.2.840.113549.1.12': 'Estándares de criptografía de clave pública (PKCS) #12',
        '1.2.840.113549.1.12.1.1': 'SHA1-PBE con RC4-128 en PKCS #12',
        '1.2.840.113549.1.12.1.2': 'SHA1-PBE con RC4-40 en PKCS #12',
        '1.2.840.113549.1.12.1.3': 'SHA1-PBE con DES-EDE en PKCS #12',
        '1.2.840.113549.1.12.1.5': 'SHA1-PBE con RC2-128 en PKCS #12',
        '1.2.840.113549.1.12.1.6': 'SHA1-PBE con RC2-40 en PKCS #12',
        '1.2.840.113549.1.12.10.1.1': 'Contenedor de clave encubierta PKCS #8 en PKCS #12',
        '1.2.840.113549.1.12.10.1.3': 'Contenedor de certificado en PKCS #12',
        '1.2.840.113549.1.12.10.1.4': 'Contenedor de lista de revocación de certificados (CRL) en PKCS #12',
        '1.2.840.113549.1.12.10.1.5': 'Contenedor secreto en PKCS #12',
        '1.2.840.113549.1.12.10.1.6': 'Contenedor de contenido seguro en PKCS #12',
        // Digest Algorithms 1.2.840.113549.2.*
        '1.2.840.113549.2': 'Algoritmos de resumen',
        '1.2.840.113549.2.2': 'Resumen del mensaje #2 (MD2)',
        '1.2.840.113549.2.5': 'Resumen del mensaje #5 (MD5)',
        '1.2.840.113549.2.7': 'HMAC-SHA-1',
        '1.2.840.113549.2.8': 'HMAC-SHA-224',
        '1.2.840.113549.2.9': 'HMAC-SHA-256',
        '1.2.840.113549.2.10': 'HMAC-SHA-384',
        '1.2.840.113549.2.11': 'HMAC-SHA-512',
        '1.2.840.113549.2.12': 'HMAC-SHA-512/224',
        '1.2.840.113549.2.13': 'HMAC-SHA-512/256',
        // Encryption Algorithms 1.2.840.113549.3.*
        '1.2.840.113549.3': 'Algoritmos de cifrado',
        '1.2.840.113549.3.2': 'RC2-CBC',
        '1.2.840.113549.3.4': 'RC4-CBC',
        '1.2.840.113549.3.7': 'DES-EDE3-CBC',
        '1.2.840.113549.3.9': 'RC5-CBC',
        // -- ANSI --
        // X9 1.2.840.10040.4.*
        '1.2.840.10040.4.1': 'Clave pública de sujeto con DSA',
        '1.2.840.10040.4.3': 'DSA con SHA-1',
        // X9.62 1.2.840.10045.*
        '1.2.840.10045.2.1': 'Cifrado de clave pública con curvas elípticas',
        '1.2.840.10045.3.0.5': 'TNB 191 V1',
        '1.2.840.10045.3.0.6': 'TNB 191 V2',
        '1.2.840.10045.3.0.7': 'TNB 191 V3',
        '1.2.840.10045.3.0.11': 'TNB 239 V1',
        '1.2.840.10045.3.0.12': 'TNB 239 V2',
        '1.2.840.10045.3.0.13': 'TNB 239 V3',
        '1.2.840.10045.3.0.18': 'TNB 359 V1',
        '1.2.840.10045.3.0.20': 'TNB 431 R1',
        '1.2.840.10045.3.1.1': 'Dominio de curva elíptica "secp192r1" incluido en el dominio de curvas elípticas recomendadas de "SEC 2"',
        '1.2.840.10045.3.1.2': 'Primo 192 V2',
        '1.2.840.10045.3.1.3': 'Primo 192 V3',
        '1.2.840.10045.3.1.4': 'Primo 239 V1',
        '1.2.840.10045.3.1.5': 'Primo 239 V2',
        '1.2.840.10045.3.1.6': 'Primo 239 V3',
        '1.2.840.10045.3.1.7': 'NIST P-256',
        '1.2.840.10045.4.1': 'ANSI X9.62 ECDSA con SHA-1',
        '1.2.840.10045.4.3.1': 'Valores de firma ECDSA con SHA-224',
        '1.2.840.10045.4.3.2': 'DSA con SHA-256',
        '1.2.840.10045.4.3.3': 'DSA con SHA-384',
        '1.2.840.10045.4.3.4': 'DSA con SHA-512',
        '1.2.840.10045.4.3': 'ANSI X9.62 ECDSA con SHA2',
        // X9.42 1.2.840.10046.2.*
        '1.2.840.10046.2.1': 'Algoritmo de acuerdo de claves Diffie-Hellman (DH) efímero-estático',
        // Teletrust 1.3.36.*
        '1.3.36.3.3.2.8.1.1.1': 'Conjunto de parámetros de dominio P160r1 de Brainpool',
        '1.3.36.3.3.2.8.1.1.3': 'Conjunto de parámetros de dominio P192r1 de Brainpool',
        '1.3.36.3.3.2.8.1.1.5': 'Conjunto de parámetros de dominio P224r1 de Brainpool',
        '1.3.36.3.3.2.8.1.1.7': 'Conjunto de parámetros de dominio P256r1 de Brainpool',
        '1.3.36.3.3.2.8.1.1.9': 'Conjunto de parámetros de dominio P320r1 de Brainpool',
        '1.3.36.3.3.2.8.1.1.11': 'Conjunto de parámetros de dominio P384r1 de Brainpool',
        '1.3.36.3.3.2.8.1.1.13': 'Conjunto de parámetros de dominio P512r1 de Brainpool',
        // Certicom 1.3.132.*
        '1.3.132.0.1': 'Dominio de curva elíptica "sect163k1" recomendada por "SEC 2"',
        '1.3.132.0.2': 'Dominio de curva elíptica "sect163r1" recomendada por "SEC 2"',
        '1.3.132.0.3': 'Dominio de curva elíptica "sect239k1" recomendada por "SEC 2"',
        '1.3.132.0.4': 'Dominio de curva elíptica "sect113r1" recomendada por "SEC 2"',
        '1.3.132.0.5': 'Dominio de curva elíptica "sect113r2" recomendada por "SEC 2"',
        '1.3.132.0.6': 'Dominio de curva elíptica "secp112r1" recomendada por "SEC 2"',
        '1.3.132.0.7': 'Dominio de curva elíptica "secp112r2" recomendada por "SEC 2"',
        '1.3.132.0.8': 'Dominio de curva elíptica "secp160r1" recomendada por "SEC 2"',
        '1.3.132.0.9': 'Dominio de curva elíptica "secp160k1" recomendada por "SEC 2"',
        '1.3.132.0.10': 'Dominio de curva elíptica "ansip256k1" recomendada por "SEC 2"',
        '1.3.132.0.15': 'Dominio de curva elíptica "sect163r2" recomendada por "SEC 2"',
        '1.3.132.0.16': 'Dominio de curva elíptica "sect283k1" recomendada por "SEC 2"',
        '1.3.132.0.17': 'Dominio de curva elíptica "sect283r1" recomendada por "SEC 2"',
        '1.3.132.0.22': 'Dominio de curva elíptica "sect131r1" recomendada por "SEC 2"',
        '1.3.132.0.23': 'Dominio de curva elíptica "sect131r2" recomendada por "SEC 2"',
        '1.3.132.0.24': 'Dominio de curva elíptica "sect193r1" recomendada por "SEC 2"',
        '1.3.132.0.25': 'Dominio de curva elíptica "sect193r2" recomendada por "SEC 2"',
        '1.3.132.0.26': 'Dominio de curva elíptica "sect233k1" recomendada por "SEC 2"',
        '1.3.132.0.27': 'Dominio de curva elíptica "sect233r1" recomendada por "SEC 2"',
        '1.3.132.0.28': 'Dominio de curva elíptica "secp128r1" recomendada por "SEC 2"',
        '1.3.132.0.29': 'Dominio de curva elíptica "secp128r2" recomendada por "SEC 2"',
        '1.3.132.0.30': 'Dominio de curva elíptica "secp160r2" recomendada por "SEC 2"',
        '1.3.132.0.31': 'Dominio de curva elíptica "secp192k1" recomendada por "SEC 2"',
        '1.3.132.0.32': 'Dominio de curva elíptica "secp224k1" recomendada por "SEC 2"',
        '1.3.132.0.33': 'Dominio de curva elíptica "secp224r1" recomendada por "SEC 2"',
        '1.3.132.0.34': 'Curva elíptica de 384 bits del National Institute of Standards and Technology (NIST)',
        '1.3.132.0.35': 'Curva elíptica de 512 bits del National Institute of Standards and Technology (NIST)',
        '1.3.132.0.36': 'Dominio de curva elíptica "sect409k1" recomendada por "SEC 2"',
        '1.3.132.0.37': 'Dominio de curva elíptica "sect409r1" recomendada por "SEC 2"',
        '1.3.132.0.38': 'Dominio de curva elíptica "sect571k1" recomendada por "SEC 2"',
        '1.3.132.0.39': 'Dominio de curva elíptica "sect571r1" recomendada por "SEC 2"',
        '1.3.132.1.12': 'Algoritmo de curva elíptica Diffie-Hellman (ECDH)',
        // OIW secsig 1.3.14.3.*
        '1.3.14.3.2.7': 'Estándar de cifrado de datos (DES) de clave única en modo de cadena de bloques de cifrado (CBC) con operación de relleno',
        '1.3.14.3.2.12': 'Algoritmo de firma digital (DSA)',
        '1.3.14.3.2.13': 'Algoritmo de firma digital (DSA) de seguridad que utiliza el algoritmo de hash seguro (SHA) para cifrar el contenido del mensaje',
        '1.3.14.3.2.15': 'Algoritmo RSA (Rivest, Shamir y Adleman) junto con el algoritmo de hash seguro (SHA) (método inusual que usa reglas de relleno ISO/IEC 9796-2)',
        '1.3.14.3.2.17': 'Cifrado de voz mediante el algoritmo estándar de cifrado de datos (DES) (168 bits) junto con el modo de operación de cifrado múltiple Encrypt-Encrypt-Encrypt (EDE)',
        '1.3.14.3.2.26': 'Algoritmo hash seguro, revisión 1 (SHA-1)',
        '1.3.14.3.2.27': 'Algoritmo de firma digital (DSA) que utiliza el algoritmo de hash seguro 1 (SHA1) que produce una firma de 320 bits',
        '1.3.14.3.2.29': 'Algoritmo de RSA (Rivest, Shamir y Adleman) que utiliza el algoritmo de hash seguro 1 (SHA1) (obsoleto)',
        // Thawte 1.3.101.*
        '1.3.101.110': 'Algoritmo Curve25519 (o X25519) utilizado con la operación Diffie-Hellman',
        '1.3.101.111': 'Algoritmo Curve448 (o X448) utilizado con la operación Diffie-Hellman',
        '1.3.101.112': 'Algoritmo de firma digital de curva Edwards (EdDSA) Ed25519',
        '1.3.101.113': 'Algoritmo de firma digital de curva Edwards (EdDSA) Ed448',
        // University College London (UCL) 0.9.2342.19200300.*
        '0.9.2342.19200300.100.1.1': 'Identificador de usuario (UID)',
        '0.9.2342.19200300.100.1.25': 'Componente de dominio (DC)',
        // Netscape 2.16.840.1.113730.*
        '2.16.840.1.113730.1.1': 'Tipo de certificado de Netscape',
        '2.16.840.1.113730.2.5': 'Secuencia de certificado',
        '2.16.840.1.113730.4.1': 'Cifrado con puerta de seguridad de servidor (SGC) de Netscape',
    },
    fr: {
        loading: 'Loading',
        'issued-to': 'Émis pour',
        'issued-by': 'Émis par',
        'issued-on': 'Émis le',
        'expires-on': 'Expire le',
        'validity-period': 'Période de validit',
        fingerprints: 'Empreintes digitales',
        'sha-256-fingerprint': 'Empreinte digitale SHA-256',
        'sha-1-fingerprint': 'Empreinte digitale SHA-1',
        title: 'Visionneuse de certificat : {{title}}',
        general: 'Général',
        details: 'Détails',
        'not-part-of-certificate': '<Not part of certificate>',
        'certificate-hierarchy': 'Hiérarchie des certificats',
        'certificate-fields': 'Champs de certificat',
        'field-value': 'Valeur du champ',
        version: 'Version',
        'version-format': 'Version {{version}}',
        validity: 'Validité',
        'not-before': 'Pas avant',
        'not-after': 'Pas après',
        'serial-number': 'Numéro de série',
        issuer: 'Émetteur',
        subject: 'Objet',
        'certificate-signature-algorithm': 'Algorithme de signature de certificat',
        'certificate-signature-value': 'Valeur de signature de certificat',
        'subject-public-key-info': "Infos de la clé publique de l'objet",
        'subject-public-key-algorithm': "Algorithme de la clé publique de l'objet",
        'subjects-public-key': "Clé publique de l'objet",
        'modulus-bits': 'Module ({{bits}} bits) :',
        'public-exponent': 'Exposant public :',
        'named-curve': 'Courbe nommée : {{curve}}',
        extensions: 'Extensions',
        critical: 'Critique',
        'not-critical': 'Non critique',
        signing: 'Signature',
        'certificate-signer': 'Signataire du certificat',
        'clr-signer': 'Signataire de la CRL',
        'is-not-cert-authority': "N'est pas une autorité de certification",
        'is-cert-authority': 'Est une autorité de certification',
        'max-number-intermediate-CAs': 'Nombre maximal de CA intermédiaires : {{maxNumber}}',
        unlimited: 'illimité',
        'key-id': 'ID de clé : {{id}}',
        'general-name-other-name': 'Autre nom',
        'general-name-rfc822-name': 'Nom de RFC822',
        'general-name-dns-name': 'Nom DNS',
        'general-name-x400-address': 'Adresse X400',
        'general-name-directory-name': "Nom de l'annuaire",
        'general-name-edi-party-name': 'Nom de partie EDI',
        'general-name-uri': 'URI',
        'general-name-ip-address': 'Adresse IP',
        'general-name-registered-id': 'ID enregistré',
        'key-usage-digitalSignature': 'Signature',
        'key-usage-nonRepudiation': 'Non-répudiation',
        'key-usage-keyEncipherment': 'Chiffrement de clé',
        'key-usage-dataEncipherment': 'Chiffrement des données',
        'key-usage-keyAgreement': 'Accord de clé',
        'key-usage-keyCertSign': 'Signataire du certificat',
        'key-usage-cRLSign': 'Signataire de la CRL',
        'key-usage-encipherOnly': 'Chiffrement uniquement',
        'key-usage-decipherOnly': 'Déchiffrement uniquement',
        'crl-issuer': 'Émetteur de la CRL :',
        reasons: 'Motifs :',
        // X.500 Attributes 2.5.4.* with their relative distinguished names (RDNs)
        '2.5.4.3': 'Nom commun (CN)',
        '2.5.4.4': 'Nom (SN)',
        '2.5.4.5': 'Numéro de série (SERIALNUMBER)',
        '2.5.4.6': 'Nom de pays (C)',
        '2.5.4.7': 'Nom de la localité (L)',
        '2.5.4.8': "Nom de l'état ou de la province (ST)",
        '2.5.4.9': 'Adresse (STREET)',
        '2.5.4.10': "Nom de l'organisation (O)",
        '2.5.4.11': "Unité d'organisation (OU)",
        '2.5.4.12': 'Titre (T)',
        '2.5.4.43': 'Initiales (I)',
        '2.5.4.42': 'Nom donné (GN)',
        '2.5.4.44': 'Qualificateur de génération',
        '2.5.4.46': 'Qualificateur de nom unique (qualificateur de DN)',
        // Certificate Extension 2.5.29.*
        '2.5.29.9': "Attributs de l'annuaire de sujet",
        '2.5.29.14': 'ID de la clé de sujet de certificat',
        '2.5.29.15': 'Utilisation de la clé de certificat',
        '2.5.29.16': 'Utilisation de la clé privée',
        '2.5.29.17': 'Autre nom du sujet du certificat',
        '2.5.29.18': "Autre nom de l'abonnement du certificat",
        '2.5.29.19': 'Contraintes de base du certificat',
        '2.5.29.20': 'Numéro de CRL',
        '2.5.29.21': "Code d'explication de l'erreur",
        '2.5.29.23': "Bloquer le code d'instruction",
        '2.5.29.24': "Date d'invalidité",
        '2.5.29.27': 'Indicateur de CRL delta',
        '2.5.29.28': 'Émission du point de distribution',
        '2.5.29.29': 'Émetteur du certificat',
        '2.5.29.30': 'Contraintes de nom',
        '2.5.29.31': 'Points de distribution CRL',
        '2.5.29.32': 'Stratégies de certificat',
        '2.5.29.32.0': "N'importe quelle stratégie",
        '2.5.29.33': 'Mappages de stratégies',
        '2.5.29.35': "ID de la clé de l'autorité de certificat",
        '2.5.29.36': 'Contraintes de stratégie',
        '2.5.29.37': 'Utilisation prolongée de la clé',
        '2.5.29.37.0': 'Utilisation de la clé étendue',
        '2.5.29.46': 'CRL la plus récente',
        '2.5.29.54': 'Interdire toute stratégie',
        // PKIX 1.3.6.1.5.5.7.*
        '1.3.6.1.5.5.7.1.1': "Accès aux informations de l'autorité",
        '1.3.6.1.5.5.7.1.11': 'Accès aux informations sur le sujet',
        '1.3.6.1.5.5.7.2.1': 'Pointeur de relevé pratique de certificat',
        '1.3.6.1.5.5.7.3.1': 'Authentification du serveur WWW TLS',
        '1.3.6.1.5.5.7.3.2': 'Authentification client WWW TLS',
        '1.3.6.1.5.5.7.3.3': 'Signature du code exécutable téléchargeable',
        '1.3.6.1.5.5.7.3.4': 'Protection des e-mails',
        '1.3.6.1.5.5.7.3.5': 'Certificat de système de fin IPsec',
        '1.3.6.1.5.5.7.3.6': 'Certificat de tunnel IPSEC',
        '1.3.6.1.5.5.7.3.7': "Certificat d'utilisateur IPSEC",
        '1.3.6.1.5.5.7.3.8': "Horodatage de l'objectif de clé PKIX",
        '1.3.6.1.5.5.7.3.9': 'Signature des réponses OCSP',
        '1.3.6.1.5.5.7.48.1': 'Online Certificate Status Protocol (OCSP)',
        '1.3.6.1.5.5.7.48.1.1': 'Réponse de base OCSP',
        '1.3.6.1.5.5.7.48.1.2': 'Extension de nonce OCSP',
        '1.3.6.1.5.5.7.48.1.3': 'Référence de la liste de révocation des certificats (CRL)',
        '1.3.6.1.5.5.7.48.1.4': 'Types de réponse compris par un client OCSP',
        '1.3.6.1.5.5.7.48.1.5': 'Extension sans vérification OCSP',
        '1.3.6.1.5.5.7.48.1.6': "Extension de seuil d'archive OCSP",
        '1.3.6.1.5.5.7.48.1.7': 'Extension de localisateur de service OCSP',
        '1.3.6.1.5.5.7.48.1.8': 'Indication du client des algorithmes de signature préférés',
        '1.3.6.1.5.5.7.48.2': "Émetteurs de l'autorité de certification",
        '1.3.6.1.5.5.7.48.3': 'Horodatage',
        '1.3.6.1.5.5.7.48.5': "Référentiel d'autorité de certification (CA)",
        // -- NIST --
        // AES 2.16.840.1.101.3.4.1.*
        '2.16.840.1.101.3.4.1': 'Advanced Encryption Standard (AES)',
        '2.16.840.1.101.3.4.1.1': 'AES-128 ECB',
        '2.16.840.1.101.3.4.1.2': 'AES-128 CBC',
        '2.16.840.1.101.3.4.1.3': 'AES-128 OFB',
        '2.16.840.1.101.3.4.1.4': 'AES-128 CFB',
        '2.16.840.1.101.3.4.1.5': 'AES-128 KW',
        '2.16.840.1.101.3.4.1.6': 'AES-128 GCM',
        '2.16.840.1.101.3.4.1.8': 'AES-128 KWP',
        '2.16.840.1.101.3.4.1.21': 'AES-192 ECB',
        '2.16.840.1.101.3.4.1.22': 'AES-192 CBC',
        '2.16.840.1.101.3.4.1.23': 'AES-192 OFB',
        '2.16.840.1.101.3.4.1.24': 'AES-192 CFB',
        '2.16.840.1.101.3.4.1.25': 'AES-192 KW',
        '2.16.840.1.101.3.4.1.26': 'AES-192 GCM',
        '2.16.840.1.101.3.4.1.28': 'AES-192 KWP',
        '2.16.840.1.101.3.4.1.41': 'AES-256 ECB',
        '2.16.840.1.101.3.4.1.42': 'AES-256 CBC',
        '2.16.840.1.101.3.4.1.43': 'AES-256 OFB',
        '2.16.840.1.101.3.4.1.44': 'AES-256 CFB',
        '2.16.840.1.101.3.4.1.45': 'AES-256 KW',
        '2.16.840.1.101.3.4.1.46': 'AES-256 GCM',
        '2.16.840.1.101.3.4.1.48': 'AES-256 KWP',
        // Secure Hash Algorithms 2.16.840.1.101.3.4.2.*
        '2.16.840.1.101.3.4.2': 'Algorithmes de hachage sécurisés',
        '2.16.840.1.101.3.4.2.1': 'SHA-256',
        '2.16.840.1.101.3.4.2.2': 'SHA-384',
        '2.16.840.1.101.3.4.2.3': 'SHA-512',
        '2.16.840.1.101.3.4.2.4': 'SHA-224',
        '2.16.840.1.101.3.4.2.5': 'SHA-512/224',
        '2.16.840.1.101.3.4.2.6': 'SHA-512/256',
        '2.16.840.1.101.3.4.2.7': 'SHA3-224',
        '2.16.840.1.101.3.4.2.8': 'SHA3-256',
        '2.16.840.1.101.3.4.2.9': 'SHA3-384',
        '2.16.840.1.101.3.4.2.10': 'SHA3-512',
        '2.16.840.1.101.3.4.2.11': 'SHAKE-128',
        '2.16.840.1.101.3.4.2.12': 'SHAKE-256',
        '2.16.840.1.101.3.4.2.13': 'HMAC-SHA3-224',
        '2.16.840.1.101.3.4.2.14': 'HMAC-SHA3-256',
        '2.16.840.1.101.3.4.2.15': 'HMAC-SHA3-384',
        '2.16.840.1.101.3.4.2.16': 'HMAC-SHA3-512',
        '2.16.840.1.101.3.4.2.17': 'SHAKE-128 avec le paramètre ShakeOutputLen',
        '2.16.840.1.101.3.4.2.18': 'SHAKE-256 avec le paramètre ShakeOutputLen',
        // Signature Algorithms 2.16.840.1.101.3.4.3.*
        '2.16.840.1.101.3.4.3': 'Algorithmes de signature',
        '2.16.840.1.101.3.4.3.1': 'SHA-224 avec DSA',
        '2.16.840.1.101.3.4.3.2': 'SHA-256 avec DSA',
        '2.16.840.1.101.3.4.3.3': 'SHA-384 avec DSA',
        '2.16.840.1.101.3.4.3.4': 'SHA-512 avec DSA',
        '2.16.840.1.101.3.4.3.5': 'SHA3-224 avec DSA',
        '2.16.840.1.101.3.4.3.6': 'SHA3-256 avec DSA',
        '2.16.840.1.101.3.4.3.7': 'SHA3-384 avec DSA',
        '2.16.840.1.101.3.4.3.8': 'SHA3-512 avec DSA',
        '2.16.840.1.101.3.4.3.9': 'SHA3-224 avec ECDSA',
        '2.16.840.1.101.3.4.3.10': 'SHA3-256 avec ECDSA',
        '2.16.840.1.101.3.4.3.11': 'SHA3-384 avec ECDSA',
        '2.16.840.1.101.3.4.3.12': 'SHA3-512 avec ECDSA',
        '2.16.840.1.101.3.4.3.13': 'SHA3-224 avec RSA',
        '2.16.840.1.101.3.4.3.14': 'SHA3-256 avec RSA',
        '2.16.840.1.101.3.4.3.15': 'SHA3-384 avec RSA',
        '2.16.840.1.101.3.4.3.16': 'SHA3-512 avec RSA',
        // RSA Security
        // PKCS1 1.2.840.113549.1.1.*
        '1.2.840.113549.1.1': 'Public-Key Cryptography Standards (PKCS) #1',
        '1.2.840.113549.1.1.1': 'PKCS #1 - Schéma de chiffrement RSAES-PKCS1-v1_5',
        '1.2.840.113549.1.1.2': 'PKCS #1 - MD2 avec chiffrement RSA',
        '1.2.840.113549.1.1.4': 'PKCS #1 - MD5 avec chiffrement RSA',
        '1.2.840.113549.1.1.5': 'PKCS #1 - SHA1 avec chiffrement RSA',
        '1.2.840.113549.1.1.7': 'PKCS #1 - Ensemble de chiffrement RSA OAEP',
        '1.2.840.113549.1.1.8': 'RSA PKCS #1 avec MGF1',
        '1.2.840.113549.1.1.9': 'PKCS #1 - RSA PSpecified',
        '1.2.840.113549.1.1.10': 'PKCS #1 RSASSA-PSS',
        '1.2.840.113549.1.1.11': 'PKCS #1 - SHA-256 avec chiffrement RSA',
        '1.2.840.113549.1.1.12': 'PKCS #1 - SHA-384 avec chiffrement RSA',
        '1.2.840.113549.1.1.13': 'PKCS #1 - SHA-512 avec chiffrement RSA',
        '1.2.840.113549.1.1.14': 'PKCS #1 - SHA-224 avec chiffrement RSA',
        '1.2.840.113549.1.1.15': 'PKCS #1 - SHA-512/224 avec chiffrement RSA',
        '1.2.840.113549.1.1.16': 'PKCS #1 - SHA-512/256 avec chiffrement RSA',
        // PKCS3 1.2.840.113549.1.3.*
        '1.2.840.113549.1.3': "Public-Key Cryptography Standards (PKCS) #3: norme d'accord de clé Diffie-Hellman",
        '1.2.840.113549.1.3.1': 'PKCS #3 - Accord de clé Diffie-Hellman (DH)',
        // PKCS5 1.2.840.113549.1.5.*
        '1.2.840.113549.1.5': 'PKCS #5 - Public-Key Cryptography Standards (PKCS) #5',
        '1.2.840.113549.1.5.3': 'PKCS #5 PBE avec MD5 et DES',
        '1.2.840.113549.1.5.6': 'PKCS #5 PBE avec MD5 et RC2',
        '1.2.840.113549.1.5.10': 'PKCS #5 PBE avec SHA1 et DES',
        '1.2.840.113549.1.5.11': 'PKCS #5 PBE avec SHA1 et RC2',
        '1.2.840.113549.1.5.12': 'PKCS #5 - Password-Based Key Derivation Function 2 (PBKDF2)',
        '1.2.840.113549.1.5.13': 'PKCS #5 - Password-Based Encryption Scheme 2 (PBES2)',
        // PKCS7 1.2.840.113549.1.7.*
        '1.2.840.113549.1.7': 'Public-Key Cryptography Standards (PKCS) #7',
        '1.2.840.113549.1.7.1': 'Données PKCS #7',
        '1.2.840.113549.1.7.2': 'Données signées PKCS #7',
        '1.2.840.113549.1.7.3': 'PKCS #7 - Données en enveloppe',
        '1.2.840.113549.1.7.4': 'Données signées et enveloppes PKCS #7',
        '1.2.840.113549.1.7.5': 'Données condensées de PKCS #7',
        '1.2.840.113549.1.7.6': 'Données chiffrées de PKCS #7',
        // PKCS9 1.2.840.113549.1.9.*
        '1.2.840.113549.1.9': 'Public-Key Cryptography Standards (PKCS) #9',
        '1.2.840.113549.1.9.1': 'Adresse e-mail PKCS #9',
        '1.2.840.113549.1.9.2': 'Nom non structuré de PKCS #9',
        '1.2.840.113549.1.9.3': 'Type de contenu PKCS #9',
        '1.2.840.113549.1.9.4': 'PKCS #9 - Résumé de message',
        '1.2.840.113549.1.9.5': 'Heure de signature PKCS #9',
        '1.2.840.113549.1.9.6': 'Signature du compteur PKCS #9',
        '1.2.840.113549.1.9.7': 'PKCS #9 - Mot de passe du défi',
        '1.2.840.113549.1.9.8': 'Adresse non structurée de PKCS #9',
        '1.2.840.113549.1.9.9': 'Attributs de certificat étendus PKCS #9',
        '1.2.840.113549.1.9.10': 'PKCS #9 - Émetteur et numéro de série',
        '1.2.840.113549.1.9.14': "PKCS #9 - Demande d'extension",
        '1.2.840.113549.1.9.15': 'PKCS #9 - Capacité SMIME',
        '1.2.840.113549.1.9.16.1.4': "PKCS #9 - Informations sur le jeton d'horodatage",
        '1.2.840.113549.1.9.16.2.12': 'Certificat de signature PKCS #9',
        '1.2.840.113549.1.9.16.2.14': "Jeton d'horodatage de signature PKCS #9",
        '1.2.840.113549.1.9.16.3.18': 'PKCS #9 - AEAD_CHACHA20_POLY1305 - Algorithme Authenticated Encryption With Associated Data (AEAD)',
        '1.2.840.113549.1.9.20': 'PKCS #9 - Nom convivial',
        '1.2.840.113549.1.9.21': 'PKCS #9 - ID de clé locale',
        '1.2.840.113549.1.9.22.1': 'PKCS #9 x509Certificate (pour PKCS #12)',
        '1.2.840.113549.1.9.52': "Protection de l'algorithme CMS PKCS #9",
        // PKCS12 1.2.840.113549.1.12.*
        '1.2.840.113549.1.12': 'Public-Key Cryptography Standards (PKCS) #12',
        '1.2.840.113549.1.12.1.1': 'PKCS #12 SHA1-PBE avec RC4-128',
        '1.2.840.113549.1.12.1.2': 'PKCS #12 SHA1-PBE avec RC4-40',
        '1.2.840.113549.1.12.1.3': 'PKCS #12 SHA1-PBE avec DES-EDE',
        '1.2.840.113549.1.12.1.5': 'PKCS #12 SHA1-PBE avec RC2-128',
        '1.2.840.113549.1.12.1.6': 'PKCS #12 SHA1-PBE avec RC2-40',
        '1.2.840.113549.1.12.10.1.1': 'PKCS #12 - PKCS #8 - Conteneur de clés dissimulé',
        '1.2.840.113549.1.12.10.1.3': 'Sac de certificat PKCS #12',
        '1.2.840.113549.1.12.10.1.4': 'PKCS #12 - Conteneur de liste de révocation des certificats (CRL)',
        '1.2.840.113549.1.12.10.1.5': 'PKCS #12 - Conteneur de secret',
        '1.2.840.113549.1.12.10.1.6': 'PKCS #12 - Conteneur de contenu sécurisé',
        // Digest Algorithms 1.2.840.113549.2.*
        '1.2.840.113549.2': 'Algorithmes Digest',
        '1.2.840.113549.2.2': 'Message Digest #2 (MD2)',
        '1.2.840.113549.2.5': 'Message Digest #5 (MD5)',
        '1.2.840.113549.2.7': 'HMAC-SHA-1',
        '1.2.840.113549.2.8': 'HMAC-SHA-224',
        '1.2.840.113549.2.9': 'HMAC-SHA-256',
        '1.2.840.113549.2.10': 'HMAC-SHA-384',
        '1.2.840.113549.2.11': 'HMAC-SHA-512',
        '1.2.840.113549.2.12': 'HMAC-SHA-512/224',
        '1.2.840.113549.2.13': 'HMAC-SHA-512/256',
        // Encryption Algorithms 1.2.840.113549.3.*
        '1.2.840.113549.3': 'Algorithmes de chiffrement',
        '1.2.840.113549.3.2': 'RC2-CBC',
        '1.2.840.113549.3.4': 'RC4-CBC',
        '1.2.840.113549.3.7': 'DES-EDE3-CBC',
        '1.2.840.113549.3.9': 'RC5-CBC',
        // -- ANSI --
        // X9 1.2.840.10040.4.*
        '1.2.840.10040.4.1': "Clé publique de l'objet DSA",
        '1.2.840.10040.4.3': 'DSA avec SHA-1',
        // X9.62 1.2.840.10045.*
        '1.2.840.10045.2.1': 'Chiffrement de clé publique de courbe elliptique',
        '1.2.840.10045.3.0.5': 'TNB 191 V1',
        '1.2.840.10045.3.0.6': 'TNB 191 V2',
        '1.2.840.10045.3.0.7': 'TNB 191 V3',
        '1.2.840.10045.3.0.11': 'TNB 239 V1',
        '1.2.840.10045.3.0.12': 'TNB 239 V2',
        '1.2.840.10045.3.0.13': 'TNB 239 V3',
        '1.2.840.10045.3.0.18': 'TNB 359 V1',
        '1.2.840.10045.3.0.20': 'TNB 431 R1',
        '1.2.840.10045.3.1.1': 'Domaine de courbe elliptique « secp192r1 » répertorié dans la liste des domaines de courbe elliptique recommandés par « SEC 2 »',
        '1.2.840.10045.3.1.2': 'Prime 192 V2',
        '1.2.840.10045.3.1.3': 'Prime 192 V3',
        '1.2.840.10045.3.1.4': 'Prime 239 V1',
        '1.2.840.10045.3.1.5': 'Prime 239 V2',
        '1.2.840.10045.3.1.6': 'Prime 239 V3',
        '1.2.840.10045.3.1.7': 'NIST P-256',
        '1.2.840.10045.4.1': 'ANSI X9.62 ECDSA With SHA-1',
        '1.2.840.10045.4.3.1': 'Valeurs de signature ECDSA WithSHA-224',
        '1.2.840.10045.4.3.2': 'DSA avec SHA-256',
        '1.2.840.10045.4.3.3': 'DSA avec SHA-384',
        '1.2.840.10045.4.3.4': 'DSA avec SHA-512',
        '1.2.840.10045.4.3': 'ANSI X9.62 ECDSA avec SHA2',
        // X9.42 1.2.840.10046.2.*
        '1.2.840.10046.2.1': "Algorithme d'association de clé Diffie-Hellman (DH) éphémère statique",
        // Teletrust 1.3.36.*
        '1.3.36.3.3.2.8.1.1.1': 'Ensemble de paramètres de domaine Brainpool P160r1',
        '1.3.36.3.3.2.8.1.1.3': 'Ensemble de paramètres de domaine Brainpool P192r1',
        '1.3.36.3.3.2.8.1.1.5': 'Ensemble de paramètres de domaine Brainpool P224r1',
        '1.3.36.3.3.2.8.1.1.7': 'Ensemble de paramètres de domaine Brainpool P256r1',
        '1.3.36.3.3.2.8.1.1.9': 'Ensemble de paramètres de domaine Brainpool P320r1',
        '1.3.36.3.3.2.8.1.1.11': 'Ensemble de paramètres de domaine Brainpool P384r1',
        '1.3.36.3.3.2.8.1.1.13': 'Ensemble de paramètres de domaine Brainpool P512r1',
        // Certicom 1.3.132.*
        '1.3.132.0.1': 'Domaine de courbe elliptique recommandé par « SEC 2 » « sect163k1 »',
        '1.3.132.0.2': 'Domaine de courbe elliptique recommandé par « SEC 2 » « sect163r1 »',
        '1.3.132.0.3': 'Domaine de courbe elliptique recommandé par « SEC 2 » « sect239k1 »',
        '1.3.132.0.4': 'Domaine de courbe elliptique recommandé par « SEC 2 » « sect113r1 »',
        '1.3.132.0.5': 'Domaine de courbe elliptique recommandé par « SEC 2 » « sect113r2 »',
        '1.3.132.0.6': 'Domaine de courbe elliptique recommandé par « SEC 2 » « secp112r1 »',
        '1.3.132.0.7': 'Domaine de courbe elliptique recommandé par « SEC 2 » « secp112r2 »',
        '1.3.132.0.8': 'Domaine de courbe elliptique recommandé par « SEC 2 » « secp160r1 »',
        '1.3.132.0.9': 'Domaine de courbe elliptique recommandé par « SEC 2 » « secp160k1 »',
        '1.3.132.0.10': 'Domaine de courbe elliptique recommandé par « SEC 2 » « ansip256k1 »',
        '1.3.132.0.15': 'Domaine de courbe elliptique recommandé par « SEC 2 » « sect163r2 »',
        '1.3.132.0.16': 'Domaine de courbe elliptique recommandé par « SEC 2 » « sect283k1 »',
        '1.3.132.0.17': 'Domaine de courbe elliptique recommandé par « SEC 2 »« sect283r1 »',
        '1.3.132.0.22': 'Domaine de courbe elliptique recommandé par « SEC 2 » « sect131r1 »',
        '1.3.132.0.23': 'Domaine de courbe elliptique recommandé par « SEC 2 » « sect131r2 »',
        '1.3.132.0.24': 'Domaine de courbe elliptique recommandé par « SEC 2 » « sect193r1 »',
        '1.3.132.0.25': 'Domaine de courbe elliptique recommandé par « SEC 2 » « sect193r2 »',
        '1.3.132.0.26': 'Domaine de courbe elliptique recommandé par « SEC 2 » « sect233k1 »',
        '1.3.132.0.27': 'Domaine de courbe elliptique recommandé par « SEC 2 » « sect233r1 »',
        '1.3.132.0.28': 'Domaine de courbe elliptique recommandé par « SEC 2 » « secp128r1 »',
        '1.3.132.0.29': 'Domaine de courbe elliptique recommandé par « SEC 2 » « secp128r2 »',
        '1.3.132.0.30': 'Domaine de courbe elliptique recommandé par « SEC 2 » « secp160r2 »',
        '1.3.132.0.31': 'Domaine de courbe elliptique recommandé par « SEC 2 » « secp192k1 »',
        '1.3.132.0.32': 'Domaine de courbe elliptique recommandé par « SEC 2 » « secp224k1 »',
        '1.3.132.0.33': 'Domaine de courbe elliptique recommandé par « SEC 2 » « secp224r1 »',
        '1.3.132.0.34': 'Courbe elliptique 384 bits de NIST (National Institute of Standards and Technology)',
        '1.3.132.0.35': 'Courbe elliptique 512 bits de NIST (National Institute of Standards and Technology)',
        '1.3.132.0.36': 'Domaine de courbe elliptique recommandé par « SEC 2 » « sect409k1 »',
        '1.3.132.0.37': 'Domaine de courbe elliptique recommandé par « SEC 2 » « sect409r1 »',
        '1.3.132.0.38': 'Domaine de courbe elliptique recommandé par « SEC 2 » « sect571k1 »',
        '1.3.132.0.39': 'Domaine de courbe elliptique recommandé par « SEC 2 » « sect571r1 »',
        '1.3.132.1.12': 'Algorithme ECDH (Elliptic Curve Diffie-Hellman)',
        // OIW secsig 1.3.14.3.*
        '1.3.14.3.2.7': 'Norme Data Encryption Standard (DES) de clé unique en mode CBC (Cipher Block Chaining) avec opération de remplissage',
        '1.3.14.3.2.12': 'Algorithme de signature numérique (DSA)',
        '1.3.14.3.2.13': "Algorithme de sécurité DSA (Digital Signature Algorithm) qui utilise l'algorithme SHA (Secure Hash Algorithm) pour hachage le contenu du message",
        '1.3.14.3.2.15': "Algorithme RSA (Rivest, Shamir et Adleman) couplé à l'algorithme SHA (Seucre Hash Algorithm) (Oddball utilisant les règles de remplissage ISO/IEC 9796-2)",
        '1.3.14.3.2.17': "Chiffrement vocal à l'aide de l'algorithme DES (Data Encryption Standard) (168 bits) couplé au mode d'opération de chiffrement multiple EDE (Encrypt-Decrypt-Encrypt)",
        '1.3.14.3.2.26': 'Secure Hash Algorithm, révision 1 (SHA-1)',
        '1.3.14.3.2.27': "Algorithme DSA (Digital Signature Algorithm) qui utilise l'algorithme SHA1 (Secure Hash Algorithm 1) produisant une signature 320 bits",
        '1.3.14.3.2.29': "Algorithme RSA (Rivest, Shaman et Adman) qui utilise l'algorithme SHA1 (Secure Hash Algorithm 1) (obsolète)",
        // Thawte 1.3.101.*
        '1.3.101.110': "Algorithme Curve25519 (ou X25519) utilisé avec l'opération Diffie-Hellman",
        '1.3.101.111': "Algorithme Curve448 (ou X448) utilisé avec l'opération Diffie-Hellman",
        '1.3.101.112': 'Edwards-curve Digital Signature Algorithm (EdDSA) Ed25519',
        '1.3.101.113': 'Edwards-curve Digital Signature Algorithm (EdDSA) Ed448',
        // University College London (UCL) 0.9.2342.19200300.*
        '0.9.2342.19200300.100.1.1': "ID d'utilisateur (UID)",
        '0.9.2342.19200300.100.1.25': 'Composant de domaine (DC)',
        // Netscape 2.16.840.1.113730.*
        '2.16.840.1.113730.1.1': 'Type de certificat de Netscape',
        '2.16.840.1.113730.2.5': 'Séquence de certificats',
        '2.16.840.1.113730.4.1': 'Netscape Server Gated Crypto (SGC)',
    },
    ja: {
        loading: 'Loading',
        'issued-to': '発行先',
        'issued-by': '発行元',
        'issued-on': '発行日',
        'expires-on': '有効期限',
        'validity-period': '有効期間',
        fingerprints: 'フィンガープリント',
        'sha-256-fingerprint': 'SHA-256 フィンガープリント',
        'sha-1-fingerprint': 'SHA-1 フィンガープリント',
        title: '証明書ビューア: {{title}}',
        general: '全般',
        details: '詳細',
        'not-part-of-certificate': '<Not part of certificate>',
        'certificate-hierarchy': '証明書の階層',
        'certificate-fields': '証明書フィールド',
        'field-value': 'フィールド値',
        version: 'バージョン',
        'version-format': 'バージョン {{version}}',
        validity: '有効期間',
        'not-before': '次より後',
        'not-after': '次より前',
        'serial-number': 'シリアル番号',
        issuer: '発行者',
        subject: '件名',
        'certificate-signature-algorithm': '証明書署名アルゴリズム',
        'certificate-signature-value': '証明書署名値',
        'subject-public-key-info': 'サブジェクトのパブリック キーの情報',
        'subject-public-key-algorithm': 'サブジェクトのパブリック キーのアルゴリズム',
        'subjects-public-key': 'サブジェクトのパブリック キー',
        'modulus-bits': 'モジュラス ({{bits}} ビット):',
        'public-exponent': '公開指数:',
        'named-curve': '名前付き曲線: {{curve}}',
        extensions: '拡張機能',
        critical: '重大',
        'not-critical': '重大ではない',
        signing: '署名',
        'certificate-signer': '証明書署名者',
        'clr-signer': 'CRL 署名者',
        'is-not-cert-authority': '認証局ではない',
        'is-cert-authority': '認証局である',
        'max-number-intermediate-CAs': '中間 CA の最大数: {{maxNumber}}',
        unlimited: '制限なし',
        'key-id': 'キー ID: {{id}}',
        'general-name-other-name': '他の名称',
        'general-name-rfc822-name': 'RFC822 名',
        'general-name-dns-name': 'DNS 名',
        'general-name-x400-address': 'X400 アドレス',
        'general-name-directory-name': 'ディレクトリ名',
        'general-name-edi-party-name': 'EDI パーティ名',
        'general-name-uri': 'URI',
        'general-name-ip-address': 'IP アドレス',
        'general-name-registered-id': '登録 ID',
        'key-usage-digitalSignature': '署名',
        'key-usage-nonRepudiation': '否認防止',
        'key-usage-keyEncipherment': 'キー暗号化',
        'key-usage-dataEncipherment': 'データ暗号化',
        'key-usage-keyAgreement': 'キー共有',
        'key-usage-keyCertSign': '証明書署名者',
        'key-usage-cRLSign': 'CRL 署名者',
        'key-usage-encipherOnly': '暗号化のみ',
        'key-usage-decipherOnly': '解読のみ',
        'crl-issuer': 'CRL 発行者:',
        reasons: '理由:',
        // X.500 Attributes 2.5.4.* with their relative distinguished names (RDNs)
        '2.5.4.3': '共通名 (CN)',
        '2.5.4.4': '姓 (SN)',
        '2.5.4.5': 'シリアル番号 (SERIALNUMBER)',
        '2.5.4.6': '国名 (C)',
        '2.5.4.7': 'ローカリティ名 (L)',
        '2.5.4.8': '都道府県名 (ST)',
        '2.5.4.9': '住所 (STREET)',
        '2.5.4.10': '組織名 (O)',
        '2.5.4.11': '組織単位 (OU)',
        '2.5.4.12': '敬称 (T)',
        '2.5.4.43': 'イニシャル (I)',
        '2.5.4.42': '名 (GN)',
        '2.5.4.44': '世代修飾子',
        '2.5.4.46': '識別名修飾子 (DN 修飾子)',
        // Certificate Extension 2.5.29.*
        '2.5.29.9': 'サブジェクト ディレクトリ属性',
        '2.5.29.14': '証明書のサブジェクト キー ID',
        '2.5.29.15': '証明書キー使用法',
        '2.5.29.16': 'プライベート キー使用法',
        '2.5.29.17': '証明書のサブジェクト代替名',
        '2.5.29.18': '証明書発行者の代替名',
        '2.5.29.19': '証明書の基本制約',
        '2.5.29.20': 'CRL 番号',
        '2.5.29.21': '理由コード',
        '2.5.29.23': '命令コードを保持',
        '2.5.29.24': '無効日',
        '2.5.29.27': 'デルタ CRL インジケータ',
        '2.5.29.28': '発行配布ポイント',
        '2.5.29.29': '証明書発行者',
        '2.5.29.30': '名前の制約',
        '2.5.29.31': 'CRL 配布ポイント',
        '2.5.29.32': '証明書ポリシー',
        '2.5.29.32.0': 'すべてのポリシー',
        '2.5.29.33': 'ポリシー マッピング',
        '2.5.29.35': '認証局キー ID',
        '2.5.29.36': 'ポリシーの制約',
        '2.5.29.37': '拡張キー使用率',
        '2.5.29.37.0': 'すべての拡張キー使用法',
        '2.5.29.46': 'Freshest CRL',
        '2.5.29.54': 'すべてのポリシーの禁止',
        // PKIX 1.3.6.1.5.5.7.*
        '1.3.6.1.5.5.7.1.1': '認証局情報アクセス',
        '1.3.6.1.5.5.7.1.11': 'サブジェクト情報アクセス',
        '1.3.6.1.5.5.7.2.1': '認証業務規定の指針',
        '1.3.6.1.5.5.7.3.1': 'TLS WWW サーバ認証',
        '1.3.6.1.5.5.7.3.2': 'TLS WWW クライアント認証',
        '1.3.6.1.5.5.7.3.3': 'ダウンロード可能な実行可能コードの署名',
        '1.3.6.1.5.5.7.3.4': 'E メール保護',
        '1.3.6.1.5.5.7.3.5': 'IPSEC エンド システム証明書',
        '1.3.6.1.5.5.7.3.6': 'IPSEC トンネル証明書',
        '1.3.6.1.5.5.7.3.7': 'IPSEC ユーザー証明書',
        '1.3.6.1.5.5.7.3.8': 'PKIX キーの目的のタイムスタンプ生成',
        '1.3.6.1.5.5.7.3.9': 'OCSP 応答の署名',
        '1.3.6.1.5.5.7.48.1': 'Online Certificate Status Protocol (OCSP)',
        '1.3.6.1.5.5.7.48.1.1': 'OCSP 基本応答',
        '1.3.6.1.5.5.7.48.1.2': 'OCSP ノンス拡張機能',
        '1.3.6.1.5.5.7.48.1.3': '証明書失効リスト (CRL) 参照',
        '1.3.6.1.5.5.7.48.1.4': 'OCSP クライアントによって認識される応答タイプ',
        '1.3.6.1.5.5.7.48.1.5': 'OCSP チェック不要拡張機能',
        '1.3.6.1.5.5.7.48.1.6': 'OCSP アーカイブ切り捨て拡張機能',
        '1.3.6.1.5.5.7.48.1.7': 'OCSP サービス ロケーター拡張機能',
        '1.3.6.1.5.5.7.48.1.8': '優先署名アルゴリズムのクライアント表示',
        '1.3.6.1.5.5.7.48.2': '認証局発行者',
        '1.3.6.1.5.5.7.48.3': 'タイムスタンプ生成',
        '1.3.6.1.5.5.7.48.5': '認証局 (CA) リポジトリ',
        // -- NIST --
        // AES 2.16.840.1.101.3.4.1.*
        '2.16.840.1.101.3.4.1': 'Advanced Encryption Standard (AES)',
        '2.16.840.1.101.3.4.1.1': 'AES-128 ECB',
        '2.16.840.1.101.3.4.1.2': 'AES-128 CBC',
        '2.16.840.1.101.3.4.1.3': 'AES-128 OFB',
        '2.16.840.1.101.3.4.1.4': 'AES-128 CFB',
        '2.16.840.1.101.3.4.1.5': 'AES-128 KW',
        '2.16.840.1.101.3.4.1.6': 'AES-128 GCM',
        '2.16.840.1.101.3.4.1.8': 'AES-128 KWP',
        '2.16.840.1.101.3.4.1.21': 'AES-192 ECB',
        '2.16.840.1.101.3.4.1.22': 'AES-192 CBC',
        '2.16.840.1.101.3.4.1.23': 'AES-192 OFB',
        '2.16.840.1.101.3.4.1.24': 'AES-192 CFB',
        '2.16.840.1.101.3.4.1.25': 'AES-192 KW',
        '2.16.840.1.101.3.4.1.26': 'AES-192 GCM',
        '2.16.840.1.101.3.4.1.28': 'AES-192 KWP',
        '2.16.840.1.101.3.4.1.41': 'AES-256 ECB',
        '2.16.840.1.101.3.4.1.42': 'AES-256 CBC',
        '2.16.840.1.101.3.4.1.43': 'AES-256 OFB',
        '2.16.840.1.101.3.4.1.44': 'AES-256 CFB',
        '2.16.840.1.101.3.4.1.45': 'AES-256 KW',
        '2.16.840.1.101.3.4.1.46': 'AES-256 GCM',
        '2.16.840.1.101.3.4.1.48': 'AES-256 KWP',
        // Secure Hash Algorithms 2.16.840.1.101.3.4.2.*
        '2.16.840.1.101.3.4.2': 'Secure Hash Algorithm',
        '2.16.840.1.101.3.4.2.1': 'SHA-256',
        '2.16.840.1.101.3.4.2.2': 'SHA-384',
        '2.16.840.1.101.3.4.2.3': 'SHA-512',
        '2.16.840.1.101.3.4.2.4': 'SHA-224',
        '2.16.840.1.101.3.4.2.5': 'SHA-512/224',
        '2.16.840.1.101.3.4.2.6': 'SHA-512/256',
        '2.16.840.1.101.3.4.2.7': 'SHA3-224',
        '2.16.840.1.101.3.4.2.8': 'SHA3-256',
        '2.16.840.1.101.3.4.2.9': 'SHA3-384',
        '2.16.840.1.101.3.4.2.10': 'SHA3-512',
        '2.16.840.1.101.3.4.2.11': 'SHAKE-128',
        '2.16.840.1.101.3.4.2.12': 'SHAKE-256',
        '2.16.840.1.101.3.4.2.13': 'HMAC-SHA3-224',
        '2.16.840.1.101.3.4.2.14': 'HMAC-SHA3-256',
        '2.16.840.1.101.3.4.2.15': 'HMAC-SHA3-384',
        '2.16.840.1.101.3.4.2.16': 'HMAC-SHA3-512',
        '2.16.840.1.101.3.4.2.17': 'SHAKE-128 (ShakeOutputLen パラメータを指定)',
        '2.16.840.1.101.3.4.2.18': 'SHAKE-256 (ShakeOutputLen パラメータを指定)',
        // Signature Algorithms 2.16.840.1.101.3.4.3.*
        '2.16.840.1.101.3.4.3': '署名アルゴリズム',
        '2.16.840.1.101.3.4.3.1': 'SHA-224 と DSA',
        '2.16.840.1.101.3.4.3.2': 'SHA-256 と DSA',
        '2.16.840.1.101.3.4.3.3': 'SHA-384 と DSA',
        '2.16.840.1.101.3.4.3.4': 'SHA-512 と DSA',
        '2.16.840.1.101.3.4.3.5': 'SHA3-224 と DSA',
        '2.16.840.1.101.3.4.3.6': 'SHA3-256 と DSA',
        '2.16.840.1.101.3.4.3.7': 'SHA3-384 と DSA',
        '2.16.840.1.101.3.4.3.8': 'SHA3-512 と DSA',
        '2.16.840.1.101.3.4.3.9': 'SHA3-224 と ECDSA',
        '2.16.840.1.101.3.4.3.10': 'SHA3-256 と ECDSA',
        '2.16.840.1.101.3.4.3.11': 'SHA3-384 と ECDSA',
        '2.16.840.1.101.3.4.3.12': 'SHA3-512 と ECDSA',
        '2.16.840.1.101.3.4.3.13': 'SHA3-224 と RSA',
        '2.16.840.1.101.3.4.3.14': 'SHA3-256 と RSA',
        '2.16.840.1.101.3.4.3.15': 'SHA3-384 と RSA',
        '2.16.840.1.101.3.4.3.16': 'SHA3-512 と RSA',
        // RSA Security
        // PKCS1 1.2.840.113549.1.1.*
        '1.2.840.113549.1.1': 'Public-Key Cryptography Standards (PKCS) #1',
        '1.2.840.113549.1.1.1': 'PKCS #1 RSAES-PKCS1-v1_5 暗号化スキーム',
        '1.2.840.113549.1.1.2': 'PKCS #1 MD2 と RSA 暗号化',
        '1.2.840.113549.1.1.4': 'PKCS #1 MD5 と RSA 暗号化',
        '1.2.840.113549.1.1.5': 'PKCS #1 SHA1 と RSA 暗号化',
        '1.2.840.113549.1.1.7': 'PKCS #1 RSA OAEP 暗号化セット',
        '1.2.840.113549.1.1.8': 'PKCS #1 RSA と MGF1',
        '1.2.840.113549.1.1.9': 'PKCS #1 RSA P 指定',
        '1.2.840.113549.1.1.10': 'PKCS #1 RSASSA-PSS',
        '1.2.840.113549.1.1.11': 'PKCS #1 SHA-256 と RSA 暗号化',
        '1.2.840.113549.1.1.12': 'PKCS #1 SHA-384 と RSA 暗号化',
        '1.2.840.113549.1.1.13': 'PKCS #1 SHA-512 と RSA 暗号化',
        '1.2.840.113549.1.1.14': 'PKCS #1 SHA-224 と RSA 暗号化',
        '1.2.840.113549.1.1.15': 'PKCS #1 SHA-512/224 と RSA 暗号化',
        '1.2.840.113549.1.1.16': 'PKCS #1 SHA-512/256 と RSA 暗号化',
        // PKCS3 1.2.840.113549.1.3.*
        '1.2.840.113549.1.3': 'Public-Key Cryptography Standards (PKCS) #3: Diffie-Hellman Key-Agreement Standard',
        '1.2.840.113549.1.3.1': 'PKCS #3 Diffie-Hellman (DH) キー共有',
        // PKCS5 1.2.840.113549.1.5.*
        '1.2.840.113549.1.5': 'PKCS #5 Public-Key Cryptography Standards (PKCS) #5',
        '1.2.840.113549.1.5.3': 'PKCS #5 PBE と MD5、DES',
        '1.2.840.113549.1.5.6': 'PKCS #5 PBE と MD5、RC2',
        '1.2.840.113549.1.5.10': 'PKCS #5 PBE と SHA1、DES',
        '1.2.840.113549.1.5.11': 'PKCS #5 PBE と SHA1、RC2',
        '1.2.840.113549.1.5.12': 'PKCS #5 Password-Based Key Derivation Function 2 (PBKDF2)',
        '1.2.840.113549.1.5.13': 'PKCS #5 Password-Based Encryption Scheme 2 (PBES2)',
        // PKCS7 1.2.840.113549.1.7.*
        '1.2.840.113549.1.7': 'Public-Key Cryptography Standards (PKCS) #7',
        '1.2.840.113549.1.7.1': 'PKCS #7 データ',
        '1.2.840.113549.1.7.2': 'PKCS #7 署名済みデータ',
        '1.2.840.113549.1.7.3': 'PKCS #7 エンベロープ データ',
        '1.2.840.113549.1.7.4': 'PKCS #7 署名済みデータとエンベロープ データ',
        '1.2.840.113549.1.7.5': 'PKCS #7 ダイジェスト データ',
        '1.2.840.113549.1.7.6': 'PKCS #7 暗号化されたデータ',
        // PKCS9 1.2.840.113549.1.9.*
        '1.2.840.113549.1.9': 'Public-Key Cryptography Standards (PKCS) #9',
        '1.2.840.113549.1.9.1': 'PKCS #9 メール アドレス',
        '1.2.840.113549.1.9.2': 'PKCS #9 非構造化名',
        '1.2.840.113549.1.9.3': 'PKCS #9 コンテンツ タイプ',
        '1.2.840.113549.1.9.4': 'PKCS #9 メッセージ ダイジェスト',
        '1.2.840.113549.1.9.5': 'PKCS #9 署名時刻',
        '1.2.840.113549.1.9.6': 'PKCS #9 カウンタ署名',
        '1.2.840.113549.1.9.7': 'PKCS #9 チャレンジ パスワード',
        '1.2.840.113549.1.9.8': 'PKCS #9 非構造化アドレス',
        '1.2.840.113549.1.9.9': 'PKCS #9 拡張証明書属性',
        '1.2.840.113549.1.9.10': 'PKCS #9 発行者とシリアル番号',
        '1.2.840.113549.1.9.14': 'PKCS #9 拡張要求',
        '1.2.840.113549.1.9.15': 'PKCS #9 SMIME 機能',
        '1.2.840.113549.1.9.16.1.4': 'PKCS #9 タイムスタンプ トークン情報',
        '1.2.840.113549.1.9.16.2.12': 'PKCS #9 署名証明書',
        '1.2.840.113549.1.9.16.2.14': 'PKCS #9 署名タイムスタンプ トークン',
        '1.2.840.113549.1.9.16.3.18': 'PKCS #9 AEAD_CHACHA20_POLY1305 Authenticated Encryption With Associated Data (AEAD) アルゴリズム',
        '1.2.840.113549.1.9.20': 'PKCS #9 フレンドリ名',
        '1.2.840.113549.1.9.21': 'PKCS #9 ローカル キー ID',
        '1.2.840.113549.1.9.22.1': 'PKCS #9 x509 証明書 (PKCS #12 の場合)',
        '1.2.840.113549.1.9.52': 'PKCS #9 CMS アルゴリズム保護',
        // PKCS12 1.2.840.113549.1.12.*
        '1.2.840.113549.1.12': 'Public-Key Cryptography Standards (PKCS) #12',
        '1.2.840.113549.1.12.1.1': 'PKCS #12 SHA1-PBE と RC4-128',
        '1.2.840.113549.1.12.1.2': 'PKCS #12 SHA1-PBE と RC4-40',
        '1.2.840.113549.1.12.1.3': 'PKCS #12 SHA1-PBE と DES-EDE',
        '1.2.840.113549.1.12.1.5': 'PKCS #12 SHA1-PBE と RC2-128',
        '1.2.840.113549.1.12.1.6': 'PKCS #12 SHA1-PBE と RC2-40',
        '1.2.840.113549.1.12.10.1.1': 'PKCS #12 PKCS #8 シュラウド キー バッグ',
        '1.2.840.113549.1.12.10.1.3': 'PKCS #12 証明書バッグ',
        '1.2.840.113549.1.12.10.1.4': 'PKCS #12 証明書失効リスト (CRL) バッグ',
        '1.2.840.113549.1.12.10.1.5': 'PKCS #12 シークレット バッグ',
        '1.2.840.113549.1.12.10.1.6': 'PKCS #12 セーフ コンテンツ バッグ',
        // Digest Algorithms 1.2.840.113549.2.*
        '1.2.840.113549.2': 'ダイジェスト アルゴリズム',
        '1.2.840.113549.2.2': 'メッセージ ダイジェスト #2 (MD2)',
        '1.2.840.113549.2.5': 'メッセージ ダイジェスト #5 (MD5)',
        '1.2.840.113549.2.7': 'HMAC-SHA-1',
        '1.2.840.113549.2.8': 'HMAC-SHA-224',
        '1.2.840.113549.2.9': 'HMAC-SHA-256',
        '1.2.840.113549.2.10': 'HMAC-SHA-384',
        '1.2.840.113549.2.11': 'HMAC-SHA-512',
        '1.2.840.113549.2.12': 'HMAC-SHA-512/224',
        '1.2.840.113549.2.13': 'HMAC-SHA-512/256',
        // Encryption Algorithms 1.2.840.113549.3.*
        '1.2.840.113549.3': '暗号化アルゴリズム',
        '1.2.840.113549.3.2': 'RC2-CBC',
        '1.2.840.113549.3.4': 'RC4-CBC',
        '1.2.840.113549.3.7': 'DES-EDE3-CBC',
        '1.2.840.113549.3.9': 'RC5-CBC',
        // -- ANSI --
        // X9 1.2.840.10040.4.*
        '1.2.840.10040.4.1': 'DSA サブジェクトのパブリック キー',
        '1.2.840.10040.4.3': 'DSA と SHA-1',
        // X9.62 1.2.840.10045.*
        '1.2.840.10045.2.1': '楕円曲線パブリック キー暗号化',
        '1.2.840.10045.3.0.5': 'TNB 191 V1',
        '1.2.840.10045.3.0.6': 'TNB 191 V2',
        '1.2.840.10045.3.0.7': 'TNB 191 V3',
        '1.2.840.10045.3.0.11': 'TNB 239 V1',
        '1.2.840.10045.3.0.12': 'TNB 239 V2',
        '1.2.840.10045.3.0.13': 'TNB 239 V3',
        '1.2.840.10045.3.0.18': 'TNB 359 V1',
        '1.2.840.10045.3.0.20': 'TNB 431 R1',
        '1.2.840.10045.3.1.1': '「SEC 2」推奨の楕円曲線ドメインにリストされた楕円曲線ドメイン「secp192r1」',
        '1.2.840.10045.3.1.2': 'Prime 192 V2',
        '1.2.840.10045.3.1.3': 'Prime 192 V3',
        '1.2.840.10045.3.1.4': 'Prime 239 V1',
        '1.2.840.10045.3.1.5': 'Prime 239 V2',
        '1.2.840.10045.3.1.6': 'Prime 239 V3',
        '1.2.840.10045.3.1.7': 'NIST P-256',
        '1.2.840.10045.4.1': 'ANSI X9.62 ECDSA と SHA-1',
        '1.2.840.10045.4.3.1': 'ECDSA と SHA-224 署名値',
        '1.2.840.10045.4.3.2': 'DSA と SHA-256',
        '1.2.840.10045.4.3.3': 'DSA と SHA-384',
        '1.2.840.10045.4.3.4': 'DSA と SHA-512',
        '1.2.840.10045.4.3': 'ANSI X9.62 ECDSA と SHA2',
        // X9.42 1.2.840.10046.2.*
        '1.2.840.10046.2.1': 'Ephemeral-Static Diffie-Hellman (DH) キー共有アルゴリズム',
        // Teletrust 1.3.36.*
        '1.3.36.3.3.2.8.1.1.1': 'Brainpool P160r1 ドメイン パラメータ セット',
        '1.3.36.3.3.2.8.1.1.3': 'Brainpool P192r1 ドメイン パラメータ セット',
        '1.3.36.3.3.2.8.1.1.5': 'Brainpool P224r1 ドメイン パラメータ セット',
        '1.3.36.3.3.2.8.1.1.7': 'Brainpool P256r1 ドメイン パラメータ セット',
        '1.3.36.3.3.2.8.1.1.9': 'Brainpool P320r1 ドメイン パラメータ セット',
        '1.3.36.3.3.2.8.1.1.11': 'Brainpool P384r1 ドメイン パラメータ セット',
        '1.3.36.3.3.2.8.1.1.13': 'Brainpool P512r1 ドメイン パラメータ セット',
        // Certicom 1.3.132.*
        '1.3.132.0.1': '「SEC 2」推奨の楕円曲線ドメイン「sect163k1」',
        '1.3.132.0.2': '「SEC 2」推奨の楕円曲線ドメイン「sect163r1」',
        '1.3.132.0.3': '「SEC 2」推奨の楕円曲線ドメイン「sect239k1」',
        '1.3.132.0.4': '「SEC 2」推奨の楕円曲線ドメイン「sect113r1」',
        '1.3.132.0.5': '「SEC 2」推奨の楕円曲線ドメイン「sect113r2」',
        '1.3.132.0.6': '「SEC 2」推奨の楕円曲線ドメイン「secp112r1」',
        '1.3.132.0.7': '「SEC 2」推奨の楕円曲線ドメイン「secp112r2」',
        '1.3.132.0.8': '「SEC 2」推奨の楕円曲線ドメイン「secp160r1」',
        '1.3.132.0.9': '「SEC 2」推奨の楕円曲線ドメイン「secp160k1」',
        '1.3.132.0.10': '「SEC 2」推奨の楕円曲線ドメイン「ansip256k1」',
        '1.3.132.0.15': '「SEC 2」推奨の楕円曲線ドメイン「sect163r2」',
        '1.3.132.0.16': '「SEC 2」推奨の楕円曲線ドメイン「sect283k1」',
        '1.3.132.0.17': '「SEC 2」推奨の楕円曲線ドメイン「sect283r1」',
        '1.3.132.0.22': '「SEC 2」推奨の楕円曲線ドメイン「sect131r1」',
        '1.3.132.0.23': '「SEC 2」推奨の楕円曲線ドメイン「sect131r2」',
        '1.3.132.0.24': '「SEC 2」推奨の楕円曲線ドメイン「sect193r1」',
        '1.3.132.0.25': '「SEC 2」推奨の楕円曲線ドメイン「sect193r2」',
        '1.3.132.0.26': '「SEC 2」推奨の楕円曲線ドメイン「sect233k1」',
        '1.3.132.0.27': '「SEC 2」推奨の楕円曲線ドメイン「sect233r1」',
        '1.3.132.0.28': '「SEC 2」推奨の楕円曲線ドメイン「secp128r1」',
        '1.3.132.0.29': '「SEC 2」推奨の楕円曲線ドメイン「secp128r2」',
        '1.3.132.0.30': '「SEC 2」推奨の楕円曲線ドメイン「secp160r2」',
        '1.3.132.0.31': '「SEC 2」推奨の楕円曲線ドメイン「secp192k1」',
        '1.3.132.0.32': '「SEC 2」推奨の楕円曲線ドメイン「secp224k1」',
        '1.3.132.0.33': '「SEC 2」推奨の楕円曲線ドメイン「secp224r1」',
        '1.3.132.0.34': '米国国立標準技術研究所 (NIST) 384 ビット楕円曲線',
        '1.3.132.0.35': '米国国立標準技術研究所 (NIST) 512 ビット楕円曲線',
        '1.3.132.0.36': '「SEC 2」推奨の楕円曲線ドメイン「sect409k1」',
        '1.3.132.0.37': '「SEC 2」推奨の楕円曲線ドメイン「sect409r1」',
        '1.3.132.0.38': '「SEC 2」推奨の楕円曲線ドメイン「sect571k1」',
        '1.3.132.0.39': '「SEC 2」推奨の楕円曲線ドメイン「sect571r1」',
        '1.3.132.1.12': '楕円曲線 Diffie-Hellman (ECDH) アルゴリズム',
        // OIW secsig 1.3.14.3.*
        '1.3.14.3.2.7': 'パディング処理を使用する Cipher Block Chaining (CBC) モードのシングルキー データ暗号化標準 (DES)',
        '1.3.14.3.2.12': 'デジタル署名アルゴリズム (DSA)',
        '1.3.14.3.2.13': 'Secure Hash Algorithm (SHA) を使用してメッセージのコンテンツをハッシュ化するセキュリティ デジタル署名アルゴリズム (DSA)',
        '1.3.14.3.2.15': 'Rivest, Shamir and Adleman (RSA) アルゴリズムと Secure Hash Algorithm (SHA) の組み合わせ (ISO/IEC 9796-2 パディング ルールを使用する Oddball)',
        '1.3.14.3.2.17': 'データ暗号化標準 (DES) (168 ビット) アルゴリズムを使用する音声暗号化と Encrypt-Decrypt-Encrypt (EDE) マルチ暗号化操作モードの組み合わせ',
        '1.3.14.3.2.26': 'Secure Hash Algorithm、リビジョン 1 (SHA-1)',
        '1.3.14.3.2.27': '320 ビット署名を生成する Secure Hash Algorithm 1 (SHA1) を使用するデジタル署名アルゴリズム (DSA)',
        '1.3.14.3.2.29': 'Secure Hash Algorithm 1 (SHA1) を使用する Rivest, Shamir and Adleman (RSA) アルゴリズム (廃止)',
        // Thawte 1.3.101.*
        '1.3.101.110': 'Diffie-Hellman 操作で使用される Curve25519 (または X25519) アルゴリズム',
        '1.3.101.111': 'Diffie-Hellman 操作で使用される Curve448 (または X448) アルゴリズム',
        '1.3.101.112': 'エドワーズ曲線デジタル署名アルゴリズム (EdDSA) Ed25519',
        '1.3.101.113': 'エドワーズ曲線デジタル署名アルゴリズム (EdDSA) Ed448',
        // University College London (UCL) 0.9.2342.19200300.*
        '0.9.2342.19200300.100.1.1': 'ユーザー ID (UID)',
        '0.9.2342.19200300.100.1.25': 'ドメイン コンポーネント (DC)',
        // Netscape 2.16.840.1.113730.*
        '2.16.840.1.113730.1.1': 'Netscape 証明書タイプ',
        '2.16.840.1.113730.2.5': '証明書シーケンス',
        '2.16.840.1.113730.4.1': 'Netscape Server Gated Crypto (SGC)',
    },
};

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Know PKI Object Identifiers.
 *
 * This is not a complete set of OIDs but only the ones that are used throughout the certificate viewer so that they can be referred easily.
 */
var KnownOids;
(function (KnownOids) {
    KnownOids["CommonName"] = "2.5.4.3";
    KnownOids["Organization"] = "2.5.4.10";
    KnownOids["OrganizationalUnit"] = "2.5.4.11";
    KnownOids["KeyUsage"] = "2.5.29.15";
    KnownOids["ExtendedKeyUsage"] = "2.5.29.37";
    KnownOids["BasicCertificateConstraints"] = "2.5.29.19";
    KnownOids["ExtensionSubjectKeyId"] = "2.5.29.14";
    KnownOids["ExtensionAuthorityKeyId"] = "2.5.29.35";
    KnownOids["AuthorityInformationAccess"] = "1.3.6.1.5.5.7.1.1";
    KnownOids["SubjectAltName"] = "2.5.29.17";
    KnownOids["CertificatePolicies"] = "2.5.29.32";
    KnownOids["CrlDistributionPoints"] = "2.5.29.31";
})(KnownOids || (KnownOids = {}));
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
const generalNamesTypeToLocaleKey = [
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
const keyUsageBitIndexToLocaleKey = [
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

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const pemHeaderRegex = /(-----(BEGIN|END) CERTIFICATE-----|[\n\r])/g;
const whitespaceRegex = new RegExp('\\s+', 'g');
const oidRegex = /^(\d+\.)*\d+$/;
const dateTimeFormat = {
    dateTimeKind: DateTimeKind.LongDateTime,
    hourFormat: HourFormat.Hour24,
};
function missingTranslation(translations, locale, key) {
    // Handles unknown OIDs.
    if (oidRegex.test(key)) {
        return formatOid(key);
    }
    // Fallback for unknown key that is not an OID.
    return defaultMissingTranslationHandler(translations, locale, key);
}
function formatOid(oid) {
    return 'OID.' + oid;
}
function formatHexByte(byte) {
    return byte.toString(16).toUpperCase().padStart(2, '0');
}
function formatHexArray(bytes, bytesPerLine = 16) {
    const lines = [];
    for (let i = 0; i < bytes.length; i += bytesPerLine) {
        lines.push(bytes.slice(i, i + bytesPerLine).join(' '));
    }
    return lines.join('\n');
}
function formatHexString(hexString, onSingleLine = false, bytesPerLine = 16) {
    if (hexString.length % 2 === 1) {
        console.warn('Trying to format hex string that is not in hex format. Returning the input string.');
        return hexString;
    }
    const bytes = hexString.toUpperCase().match(/.{2}/g) || [];
    if (onSingleLine) {
        return bytes.join(' ');
    }
    return formatHexArray(bytes, bytesPerLine);
}
function formatHexBuffer(hexBuffer, onSingleLine = false, bytesPerLine = 16) {
    const bytes = Array.from(new Uint8Array(hexBuffer)).map(formatHexByte);
    if (onSingleLine) {
        return bytes.join(' ');
    }
    return formatHexArray(bytes, bytesPerLine);
}
function pemToBerBuffer(pem) {
    const base64Encoded = pem.replace(pemHeaderRegex, '').replace(whitespaceRegex, '');
    // Now that we have decoded the cert it's now in DER-encoding
    const derFormat = atob(base64Encoded);
    // And massage the cert into a BER encoded one
    return Uint8Array.from(derFormat.split(''), c => c.charCodeAt(0)).buffer;
}
async function computeCertificateHash(algo, buffer) {
    const hashBuffer = await crypto.subtle.digest(algo, buffer);
    return formatHexBuffer(hashBuffer);
}
function pkijsAttributeAndValuesToMap(typesAndValues) {
    return new Map(typesAndValues.map(({ type, value: { valueBlock: { value }, }, }) => [type, value]));
}
/**
 * Shallow array equals based on their item references.
 *
 * Implemented here to avoid depending on an external helper library for a couple of functions.
 */
function arrayElementsEqual(left, right) {
    if (left === right) {
        return true;
    }
    if (left.length !== right.length) {
        return false;
    }
    return left.every((element, index) => element === right[index]);
}
/**
 * Filter and map combined over string characters.
 *
 * Implemented here to avoid depending on an external helper library for a couple of functions.
 */
function filterMapOverString(str, callback) {
    const result = [];
    for (let index = 0; index < str.length; index++) {
        const value = callback(str.charAt(index), index, str);
        if (value !== null && value !== undefined) {
            result.push(value);
        }
    }
    return result;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * A translatable value that can be used as part of the certificate field value.
 *
 * This allows for flexible translation on parts of the field value after being parsed.
 */
class TranslatableValue {
    constructor(key, args) {
        this.key = key;
        this.args = args;
    }
    /**
     * Translate the stored translation key and interpolation arguments.
     */
    translate(translateService) {
        if (!this.args) {
            return translateService.translate(this.key);
        }
        const args = Object.fromEntries(Object.entries(this.args).map(([key, value]) => [
            key,
            value instanceof TranslatableValue ? value.translate(translateService) : value,
        ]));
        return translateService.translate(this.key, args);
    }
}
/**
 * Value wrapper that unifies the nonhomogeneous value types that are part of a single line and handles translation.
 */
class Value {
    constructor(value) {
        this.value = value;
    }
    /**
     * Translate the wrapped value.
     */
    translate(translateService, dateTimeService) {
        if (this.value instanceof TranslatableValue) {
            return this.value.translate(translateService);
        }
        if (this.value instanceof Date) {
            return dateTimeService.format(this.value, dateTimeFormat);
        }
        return this.value?.toString() || '';
    }
    /**
     * Create a new Translatable Value from translation key and interpolation arguments.
     *
     * This is a helper constructor to simplify common usage.
     */
    static fromTranslatableKey(key, args) {
        return new Value(new TranslatableValue(key, args));
    }
}
/**
 * A line in the certificate field value area.
 *
 * Every line is made up of Values which can wrap either raw values or Translatable structures.
 */
class Line {
    constructor(values) {
        this.values = values;
    }
    /**
     * Translate and merge the separate values that make up the line.
     */
    translate(translateService, dateTimeService) {
        return this.values.map(value => value.translate(translateService, dateTimeService)).join('');
    }
    /**
     * Create a new Line from a key-value pair with a given separator.
     *
     * This is a helper constructor to simplify common usage.
     */
    static fromPair(key, value, separator) {
        return new Line([key, new Value(separator), value]);
    }
    /**
     * Create a new Line from an unformatted hex string.
     *
     * Formats the hex string before creating the Line.
     *
     * This is a helper constructor to simplify common usage.
     *
     * @param hex The unformatted hex string that contains an even number of [a-fA-F0-9] characters.
     */
    static fromHex(hex) {
        return new Line([new Value(formatHexString(hex))]);
    }
    /**
     * Create a new Line from a translatable key and interpolation arguments.
     *
     * This is a helper constructor to simplify common usage.
     * It's meant to be used if the line contains a single Translatable Value.
     */
    static fromTranslatableKey(value, args) {
        return new Line([Value.fromTranslatableKey(value, args)]);
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * A parsed certificate field to be displayed in the certificate fields tree and the value area.
 */
class CertificateField {
    constructor(name, children = [], lines) {
        this.name = name;
        this.children = children;
        this.lines = lines;
    }
    /**
     * Translates the filed name.
     */
    translateName(translateService) {
        return this.name instanceof TranslatableValue ? this.name.translate(translateService) : this.name;
    }
    /**
     * Translates the filed value.
     */
    translateValue(translateService, dateTimeService) {
        return this.lines?.map(value => value.translate(translateService, dateTimeService)).join('\n') ?? '';
    }
    /**
     * Create a new CertificateField that has an untranslated valued for its name and children.
     *
     * A certificate field with children is not expected to have a value.
     *
     * This is a helper constructor to simplify common usage.
     */
    static untranslatedNameWithChildren(name, children) {
        return new CertificateField(name, children);
    }
    /**
     * Create a new CertificateField that has a translatable key for its name and children.
     *
     * A certificate field with children is not expected to have a value.
     *
     * This is a helper constructor to simplify common usage.
     */
    static withChildren(translatableKey, children) {
        return new CertificateField(new TranslatableValue(translatableKey), children);
    }
    /**
     * Create a new CertificateField that has a translatable key for its name and a single value.
     *
     * A certificate field with a value is not expected to have children.
     *
     * This is a helper constructor to simplify common usage.
     */
    static withValue(translatableKey, value) {
        return new CertificateField(new TranslatableValue(translatableKey), [], [new Line([new Value(value)])]);
    }
    /**
     * Create a new CertificateField that has a translatable key for its name and a multi-lined value.
     *
     * A certificate field with a value is not expected to have children.
     *
     * This is a helper constructor to simplify common usage.
     */
    static withLines(translatableKey, lines) {
        return new CertificateField(new TranslatableValue(translatableKey), [], lines);
    }
    /**
     * Create a new CertificateField from pkijs's Certificate Extension structure.
     *
     * This helper constructor simplifies certificate extension parsing by covering the common extensions.
     */
    static fromExtension(extension) {
        switch (extension.extnID) {
            case KnownOids.KeyUsage: {
                return this.extensionKeyUsage(extension);
            }
            case KnownOids.ExtendedKeyUsage: {
                return this.extensionExtendedKeyUsage(extension);
            }
            case KnownOids.BasicCertificateConstraints: {
                return this.extensionBasicCertificateConstraints(extension);
            }
            case KnownOids.ExtensionSubjectKeyId: {
                return this.extensionKeyId(extension, 4);
            }
            case KnownOids.ExtensionAuthorityKeyId: {
                return this.extensionKeyId(extension, 6);
            }
            case KnownOids.AuthorityInformationAccess: {
                return this.extensionAuthorityInfoAccess(extension);
            }
            case KnownOids.SubjectAltName: {
                const altName = extension.parsedValue;
                return this.fromExtensionWithLines(extension, this.parseGeneralNames(altName.altNames));
            }
            case KnownOids.CertificatePolicies: {
                return this.extensionCertificatePolicies(extension);
            }
            case KnownOids.CrlDistributionPoints: {
                return this.extensionClrDistributionPoints(extension);
            }
        }
        return this.fromExtensionWithLines(extension, [Line.fromHex(extension.extnValue.toString('hex'))]);
    }
    static extensionKeyUsage(extension) {
        const value = extension.parsedValue.valueBlock;
        const bits = value.valueHexView.reduce((acc, byte) => acc + byte.toString(2), '').slice(0, -value.unusedBits);
        const lines = filterMapOverString(bits, (bit, index) => (bit === '1' ? index : undefined)).map(index => Line.fromTranslatableKey(keyUsageBitIndexToLocaleKey[index]));
        return this.fromExtensionWithLines(extension, lines);
    }
    static extensionExtendedKeyUsage(extension) {
        const keyUsage = extension.parsedValue;
        return this.fromExtensionWithLines(extension, keyUsage.keyPurposes.map(purpose => Line.fromPair(Value.fromTranslatableKey(purpose), new Value(`(${formatOid(purpose)})`), ' ')));
    }
    static extensionBasicCertificateConstraints(extension) {
        const basicConstraints = extension.parsedValue;
        const lines = [Line.fromTranslatableKey(basicConstraints.cA ? 'is-cert-authority' : 'is-not-cert-authority')];
        if (basicConstraints.cA) {
            lines.push(Line.fromTranslatableKey('max-number-intermediate-CAs', {
                maxNumber: 
                // eslint-disable-next-line eqeqeq
                basicConstraints.pathLenConstraint == null
                    ? new TranslatableValue('unlimited')
                    : basicConstraints.pathLenConstraint.toString(),
            }));
        }
        return this.fromExtensionWithLines(extension, lines);
    }
    static extensionKeyId(extension, removeFirstNumberOfBytes) {
        const hex = extension.extnValue.toString('hex').slice(removeFirstNumberOfBytes * 2);
        return this.fromExtensionWithLines(extension, [
            Line.fromTranslatableKey('key-id', {
                id: formatHexString(hex),
            }),
        ]);
    }
    static extensionAuthorityInfoAccess(extension) {
        const infoAccess = extension.parsedValue;
        const value = infoAccess.accessDescriptions.map(description => {
            return new Line([
                Value.fromTranslatableKey(description.accessMethod),
                new Value(': '),
                ...this.translatableGeneralName(description.accessLocation, ': '),
            ]);
        });
        return this.fromExtensionWithLines(extension, value);
    }
    static extensionCertificatePolicies(extension) {
        const policies = extension.parsedValue;
        const value = policies.certificatePolicies.flatMap(policy => {
            return [
                Line.fromTranslatableKey(policy.policyIdentifier),
                ...(policy.policyQualifiers?.map(qualifier => {
                    return Line.fromPair(Value.fromTranslatableKey(qualifier.policyQualifierId), new Value(qualifier.qualifier.toString()), ': ');
                }) ?? []),
            ];
        });
        return this.fromExtensionWithLines(extension, value);
    }
    static extensionClrDistributionPoints(extension) {
        const crlDistPoints = extension.parsedValue;
        const value = crlDistPoints.distributionPoints.reduce((result, crlDistPoint) => {
            if (crlDistPoint.distributionPoint) {
                if (crlDistPoint.distributionPoint instanceof RelativeDistinguishedNames) {
                    const points = crlDistPoint.distributionPoint.typesAndValues.map(typeAndValue => {
                        return Line.fromPair(new Value(typeAndValue.type), new Value(typeAndValue.value.toString()), ': ');
                    });
                    result.push(...points);
                }
                else {
                    result.push(...this.parseGeneralNames(crlDistPoint.distributionPoint));
                }
            }
            if (crlDistPoint.cRLIssuer) {
                result.push(Line.fromTranslatableKey('clr-issuer'), ...this.parseGeneralNames(crlDistPoint.cRLIssuer));
            }
            if (crlDistPoint.reasons) {
                result.push(Line.fromTranslatableKey('reasons'), new Line([new Value(crlDistPoint.reasons.toString('ascii'))]));
            }
            return result;
        }, []);
        return this.fromExtensionWithLines(extension, value);
    }
    static fromExtensionWithLines(extension, lines) {
        const critical = new Line([Value.fromTranslatableKey(extension.critical ? 'critical' : 'not-critical')]);
        return this.withLines(extension.extnID, [critical, ...lines]);
    }
    static parseGeneralNames(generalNames) {
        return generalNames.map(generalName => {
            return new Line(this.translatableGeneralName(generalName, ': '));
        });
    }
    static translatableGeneralName(generalName, separator) {
        return [
            Value.fromTranslatableKey(generalNamesTypeToLocaleKey[generalName.type]),
            new Value(separator),
            new Value(generalName.value.toString()),
        ];
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Contains the Relative Distinguished Names of the subject and issuer in a given certificate.
 *
 * This structure is to be used in the general section of the certificate viewer and thus doesn't need to contain all of the RDNs.
 * Instead we're only interested in the `common name`, `organization` and `organization unit` values.
 */
class RelativeDistinguishedNamesModel {
    constructor(commonName, organization, organizationalUnit) {
        this.commonName = commonName;
        this.organization = organization;
        this.organizationalUnit = organizationalUnit;
    }
    /**
     * Create the RDNs model from an OID to value map.
     */
    static fromMap(map) {
        return new RelativeDistinguishedNamesModel(map.get(KnownOids.CommonName) || '', map.get(KnownOids.Organization) || '', map.get(KnownOids.OrganizationalUnit) || '');
    }
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
class Certificate {
    /**
     * @param certificate The pkijs Certificate model.
     * @param fingerprints The SHA-1 and SHA-256 fingerprints of the certificate.
     */
    constructor(certificate, fingerprints) {
        this.certificate = certificate;
        this.fingerprints = fingerprints;
        this.issuer = Certificate.issuerRdns(certificate);
        this.subject = Certificate.subjectRdns(certificate);
        this.rootField = this.buildFieldsTree();
    }
    /**
     * Create a new CertificateModel form a PEM encoded certificate.
     *
     * The asn1js and pkijs libraries are used in combination to parse the PEM encoded certificate.
     */
    static async fromPemEncodedCertificate(certificatePem) {
        const berFormat = pemToBerBuffer(certificatePem);
        const fingerprints = await Certificate.computeFingerprints(berFormat);
        const asn1 = fromBER(berFormat);
        const certificate = new Certificate$1({ schema: asn1.result });
        return new Certificate(certificate, fingerprints);
    }
    /**
     * Computes the SHA1 and SHA256 fingerprints
     */
    static async computeFingerprints(berEncodedCert) {
        return Promise.all([
            computeCertificateHash("SHA-1" /* AlgorithmName.sha1 */, berEncodedCert),
            computeCertificateHash("SHA-256" /* AlgorithmName.sha256 */, berEncodedCert),
        ]).then(([sha1, sha256]) => ({ sha1, sha256 }));
    }
    static issuerRdns(certificate) {
        const map = pkijsAttributeAndValuesToMap(certificate.issuer.typesAndValues);
        return RelativeDistinguishedNamesModel.fromMap(map);
    }
    static subjectRdns(certificate) {
        const map = pkijsAttributeAndValuesToMap(certificate.subject.typesAndValues);
        return RelativeDistinguishedNamesModel.fromMap(map);
    }
    buildFieldsTree() {
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
    fieldVersion() {
        return CertificateField.withValue('version', new TranslatableValue('version-format', {
            version: this.certificate.version + 1,
        }));
    }
    fieldValidity() {
        const notBefore = CertificateField.withValue('not-before', this.certificate.notBefore.value);
        const notAfter = CertificateField.withValue('not-after', this.certificate.notAfter.value);
        return CertificateField.withChildren('validity', [notBefore, notAfter]);
    }
    fieldSerialNumber() {
        return CertificateField.withValue('serial-number', formatHexString(this.certificate.serialNumber.toString('hex').slice(4), true));
    }
    fieldIssuer() {
        const lines = this.certificate.issuer.typesAndValues.map(typeAndValue => {
            return Line.fromPair(Value.fromTranslatableKey(typeAndValue.type), new Value(typeAndValue.value.valueBlock.value), ' = ');
        });
        return CertificateField.withLines('issuer', lines);
    }
    fieldSubject() {
        const lines = this.certificate.subject.typesAndValues.map(typeAndValue => {
            return Line.fromPair(Value.fromTranslatableKey(typeAndValue.type), new Value(typeAndValue.value.valueBlock.value), ' = ');
        });
        return CertificateField.withLines('subject', lines);
    }
    fieldSignatureAlgorithm() {
        return CertificateField.withValue('certificate-signature-algorithm', new TranslatableValue(this.certificate.signatureAlgorithm.algorithmId));
    }
    fieldSignatureValue() {
        return CertificateField.withValue('certificate-signature-value', formatHexString(this.certificate.signatureValue.toString('hex').slice(10)));
    }
    fieldFingerprints() {
        const sha1Fp = CertificateField.withValue('sha-1-fingerprint', this.fingerprints.sha1);
        const sha256Fp = CertificateField.withValue('sha-256-fingerprint', this.fingerprints.sha256);
        return CertificateField.withChildren('fingerprints', [sha1Fp, sha256Fp]);
    }
    fieldSubjectPublicKeyInfo() {
        const subjPubKeyAlg = CertificateField.withValue('subject-public-key-algorithm', new TranslatableValue(this.certificate.subjectPublicKeyInfo.algorithm.algorithmId));
        const subjPubKey = CertificateField.withLines('subjects-public-key', this.subfieldSubjectPublicKeyValue());
        return CertificateField.withChildren('subject-public-key-info', [subjPubKeyAlg, subjPubKey]);
    }
    subfieldSubjectPublicKeyValue() {
        const parsedPubKey = this.certificate.subjectPublicKeyInfo.parsedKey;
        if (parsedPubKey instanceof RSAPublicKey) {
            const modulusView = parsedPubKey.modulus.valueBlock.valueHexView;
            const modulusBitLength = modulusView[0] === 0x00
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
        }
        else if (parsedPubKey instanceof ECPublicKey) {
            return [
                Line.fromTranslatableKey('named-curve', {
                    curve: parsedPubKey.namedCurve,
                }),
                Line.fromHex(parsedPubKey.toString('hex')),
            ];
        }
        else {
            return [];
        }
    }
    extensions() {
        if (!this.certificate.extensions) {
            return undefined;
        }
        return CertificateField.withChildren('extensions', this.certificate.extensions.map(extension => CertificateField.fromExtension(extension)));
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/* eslint-disable @typescript-eslint/member-ordering */
/**
 * Contains a certificate chain and provides convenient methods for accessing the common certificates of interest.
 *
 * This is linear model which is meant to be displayed in a tree structure and thus contains methods for interacting with Clarity's tree.
 */
class CertificateChain {
    /**
     * @param chain The parsed certificate chain.
     */
    constructor(chain) {
        this.chain = chain;
        this.nextCertificateMap = new Map(chain
            .slice()
            .reverse()
            .map((cert, index, arr) => [cert, arr[index + 1]]));
    }
    /**
     * Create a new CertificateChainModel from a PEM encoded certificate chain.
     *
     * @param pemEncodedCertificates The certificate chain where each certificate is a PEM encoded string.
     *                               It begins with the leaf certificate as the first element and ends with the root certificate.
     */
    static async fromPemEncodedCertificatesChain(pemEncodedCertificates) {
        // The certificates order must be preserved but they don't need to be parsed synchronously relative to each other.
        const chain = await Promise.all(pemEncodedCertificates.map(Certificate.fromPemEncodedCertificate));
        return new CertificateChain(chain);
    }
    /**
     * Retrieve the root certificate in the chain.
     */
    get rootCertificate() {
        return this.chain[this.chain.length - 1];
    }
    /**
     * Retrieve the leaf certificate in the chain.
     */
    get leafCertificate() {
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
    nextCertificateInChain(certificate) {
        return certificate && this.nextCertificateMap.get(certificate);
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class CertificateViewerTranslateFieldPipe {
    constructor(appfxTranslateService, dateTimeService) {
        this.appfxTranslateService = appfxTranslateService;
        this.dateTimeService = dateTimeService;
    }
    transform(field, prop) {
        if (!field) {
            return '';
        }
        switch (prop) {
            case 'name': {
                return field.translateName(this.appfxTranslateService);
            }
            case 'value': {
                return field.translateValue(this.appfxTranslateService, this.dateTimeService);
            }
            default: {
                throw new Error('Invalid certificate field property');
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: CertificateViewerTranslateFieldPipe, deps: [{ token: i1.AppfxTranslateService }, { token: i1.DateTimeService }], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: CertificateViewerTranslateFieldPipe, isStandalone: false, name: "translateField", pure: false }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: CertificateViewerTranslateFieldPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'translateField',
                    standalone: false,
                    pure: false,
                }]
        }], ctorParameters: () => [{ type: i1.AppfxTranslateService }, { type: i1.DateTimeService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
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
class CertificateViewerDetailsComponent {
    constructor() {
        this.topHeadingLevel = 5;
        this.getNextCertificate = (certificate) => {
            const next = this.certificateChain?.nextCertificateInChain(certificate);
            return next ? [next] : [];
        };
        this.getFieldsChildren = (certificateField) => {
            return certificateField?.children ?? [];
        };
    }
    ngOnChanges(changes) {
        if (changes.certificateChain) {
            const currentValue = changes.certificateChain.currentValue;
            this.selectCertificate(currentValue?.leafCertificate);
        }
    }
    selectCertificate(certificate) {
        if (this.selectedCertificate !== certificate) {
            this.selectedCertificateField = undefined;
        }
        this.selectedCertificate = certificate;
    }
    selectCertificateField(certificateField) {
        this.selectedCertificateField = certificateField;
    }
    isSelected(certificate) {
        return certificate === this.selectedCertificate;
    }
    isSelectedField(certificateField) {
        return certificateField === this.selectedCertificateField;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: CertificateViewerDetailsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: CertificateViewerDetailsComponent, isStandalone: false, selector: "appfx-certificate-viewer-details", inputs: { certificateChain: "certificateChain", topHeadingLevel: "topHeadingLevel", headingTemplate: "headingTemplate" }, usesOnChanges: true, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<section class=\"certificate-chain\">\n  <ng-container\n    *ngTemplateOutlet=\"\n      headingTemplate;\n      context: {\n        level: topHeadingLevel + 1,\n        textContent: 'certificate-hierarchy' | translate,\n        class: 'certificate-viewer-details-subtitle',\n      }\n    \"\n  >\n  </ng-container>\n\n  <clr-tree class=\"content\">\n    <clr-tree-node\n      *clrRecursiveFor=\"let certificate of certificateChain?.rootCertificate; getChildren: getNextCertificate\"\n      [clrExpanded]=\"true\"\n    >\n      <button\n        class=\"clr-treenode-link\"\n        [class.active]=\"isSelected(certificate)\"\n        (click)=\"selectCertificate(certificate)\"\n        tabindex=\"-1\"\n      >\n        {{ certificate?.subject.commonName }}\n      </button>\n    </clr-tree-node>\n  </clr-tree>\n</section>\n\n<section class=\"fields\">\n  <ng-container\n    *ngTemplateOutlet=\"\n      headingTemplate;\n      context: {\n        level: topHeadingLevel + 1,\n        textContent: 'certificate-fields' | translate,\n        class: 'certificate-viewer-details-subtitle',\n      }\n    \"\n  >\n  </ng-container>\n\n  <clr-tree class=\"content\">\n    <clr-tree-node\n      *clrRecursiveFor=\"let field of this.selectedCertificate?.rootField; getChildren: getFieldsChildren\"\n      [clrExpanded]=\"true\"\n    >\n      <button\n        class=\"clr-treenode-link\"\n        [class.active]=\"isSelectedField(field)\"\n        (click)=\"selectCertificateField(field)\"\n        tabindex=\"-1\"\n      >\n        {{ field | translateField: 'name' }}\n      </button>\n    </clr-tree-node>\n  </clr-tree>\n</section>\n\n<section class=\"value\">\n  <ng-container\n    *ngTemplateOutlet=\"\n      headingTemplate;\n      context: {\n        level: topHeadingLevel + 1,\n        textContent: 'field-value' | translate,\n        class: 'certificate-viewer-details-subtitle',\n      }\n    \"\n  >\n  </ng-container>\n\n  <pre class=\"content\">{{ selectedCertificateField | translateField: 'value' }}</pre>\n</section>\n", styles: ["pre{flex:1 1 0;margin:0;padding:0 .4rem;overflow:auto}clr-tree{flex:1 1 0;border-color:var(--cds-alias-object-border-color, #ccc);border-width:var(--cds-alias-object-border-width, .05rem);border-radius:var(--cds-alias-object-border-radius, .15rem);border-style:solid;padding:0 .5rem;overflow:auto}:host>section{flex:0 1 auto;margin-top:1.2rem}:host>section.certificate-chain{flex:1 1 0}:host>section.certificate-chain>.content{min-height:3.5rem}:host>section.fields{flex:2 1 0}:host>section.fields>.content{min-height:7rem}:host>section.value{flex:1 1 0}:host>section.value>.content{min-height:3.5rem}\n"], dependencies: [{ kind: "component", type: i1$1.ClrTree, selector: "clr-tree", inputs: ["clrLazy"] }, { kind: "component", type: i1$1.ClrTreeNode, selector: "clr-tree-node", inputs: ["clrExpandable", "clrDisabled", "clrSelected", "clrExpanded", "clrForTypeAhead"], outputs: ["clrSelectedChange", "clrExpandedChange"] }, { kind: "directive", type: i1$1.ClrRecursiveForOf, selector: "[clrRecursiveFor][clrRecursiveForOf]", inputs: ["clrRecursiveForOf", "clrRecursiveForGetChildren"] }, { kind: "directive", type: i1$1.ClrTreeNodeLink, selector: ".clr-treenode-link" }, { kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }, { kind: "pipe", type: CertificateViewerTranslateFieldPipe, name: "translateField" }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: CertificateViewerDetailsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-certificate-viewer-details', standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<section class=\"certificate-chain\">\n  <ng-container\n    *ngTemplateOutlet=\"\n      headingTemplate;\n      context: {\n        level: topHeadingLevel + 1,\n        textContent: 'certificate-hierarchy' | translate,\n        class: 'certificate-viewer-details-subtitle',\n      }\n    \"\n  >\n  </ng-container>\n\n  <clr-tree class=\"content\">\n    <clr-tree-node\n      *clrRecursiveFor=\"let certificate of certificateChain?.rootCertificate; getChildren: getNextCertificate\"\n      [clrExpanded]=\"true\"\n    >\n      <button\n        class=\"clr-treenode-link\"\n        [class.active]=\"isSelected(certificate)\"\n        (click)=\"selectCertificate(certificate)\"\n        tabindex=\"-1\"\n      >\n        {{ certificate?.subject.commonName }}\n      </button>\n    </clr-tree-node>\n  </clr-tree>\n</section>\n\n<section class=\"fields\">\n  <ng-container\n    *ngTemplateOutlet=\"\n      headingTemplate;\n      context: {\n        level: topHeadingLevel + 1,\n        textContent: 'certificate-fields' | translate,\n        class: 'certificate-viewer-details-subtitle',\n      }\n    \"\n  >\n  </ng-container>\n\n  <clr-tree class=\"content\">\n    <clr-tree-node\n      *clrRecursiveFor=\"let field of this.selectedCertificate?.rootField; getChildren: getFieldsChildren\"\n      [clrExpanded]=\"true\"\n    >\n      <button\n        class=\"clr-treenode-link\"\n        [class.active]=\"isSelectedField(field)\"\n        (click)=\"selectCertificateField(field)\"\n        tabindex=\"-1\"\n      >\n        {{ field | translateField: 'name' }}\n      </button>\n    </clr-tree-node>\n  </clr-tree>\n</section>\n\n<section class=\"value\">\n  <ng-container\n    *ngTemplateOutlet=\"\n      headingTemplate;\n      context: {\n        level: topHeadingLevel + 1,\n        textContent: 'field-value' | translate,\n        class: 'certificate-viewer-details-subtitle',\n      }\n    \"\n  >\n  </ng-container>\n\n  <pre class=\"content\">{{ selectedCertificateField | translateField: 'value' }}</pre>\n</section>\n", styles: ["pre{flex:1 1 0;margin:0;padding:0 .4rem;overflow:auto}clr-tree{flex:1 1 0;border-color:var(--cds-alias-object-border-color, #ccc);border-width:var(--cds-alias-object-border-width, .05rem);border-radius:var(--cds-alias-object-border-radius, .15rem);border-style:solid;padding:0 .5rem;overflow:auto}:host>section{flex:0 1 auto;margin-top:1.2rem}:host>section.certificate-chain{flex:1 1 0}:host>section.certificate-chain>.content{min-height:3.5rem}:host>section.fields{flex:2 1 0}:host>section.fields>.content{min-height:7rem}:host>section.value{flex:1 1 0}:host>section.value>.content{min-height:3.5rem}\n"] }]
        }], propDecorators: { certificateChain: [{
                type: Input
            }], topHeadingLevel: [{
                type: Input
            }], headingTemplate: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
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
class CertificateViewerGeneralComponent {
    constructor() {
        this.KnownOids = KnownOids;
        this.dateTimeFormat = dateTimeFormat;
        this.topHeadingLevel = 5;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: CertificateViewerGeneralComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: CertificateViewerGeneralComponent, isStandalone: false, selector: "appfx-certificate-viewer-general", inputs: { certificate: "certificate", topHeadingLevel: "topHeadingLevel", headingTemplate: "headingTemplate" }, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<section>\n  <ng-container\n    *ngTemplateOutlet=\"\n      headingTemplate;\n      context: {\n        level: topHeadingLevel + 1,\n        textContent: 'issued-to' | translate,\n        class: 'certificate-viewer-general-subtitle',\n      }\n    \"\n  >\n  </ng-container>\n\n  <ng-container\n    *ngTemplateOutlet=\"relativeDistinguishedNames; context: { certificate: certificate?.subject }\"\n  ></ng-container>\n</section>\n\n<section>\n  <ng-container\n    *ngTemplateOutlet=\"\n      headingTemplate;\n      context: {\n        level: topHeadingLevel + 1,\n        textContent: 'issued-by' | translate,\n        class: 'certificate-viewer-general-subtitle',\n      }\n    \"\n  >\n  </ng-container>\n\n  <ng-container\n    *ngTemplateOutlet=\"relativeDistinguishedNames; context: { certificate: certificate?.issuer }\"\n  ></ng-container>\n</section>\n\n<section>\n  <ng-container\n    *ngTemplateOutlet=\"\n      headingTemplate;\n      context: {\n        level: topHeadingLevel + 1,\n        textContent: 'validity-period' | translate,\n        class: 'certificate-viewer-general-subtitle',\n      }\n    \"\n  >\n  </ng-container>\n\n  <dl class=\"key-value\">\n    <dt>{{ 'issued-on' | translate }}</dt>\n    <dd id=\"issue-date\">\n      {{ certificate?.certificate?.notBefore?.value | dateTime: dateTimeFormat }}\n    </dd>\n  </dl>\n  <dl class=\"key-value\">\n    <dt>{{ 'expires-on' | translate }}</dt>\n    <dd id=\"expiry-date\">\n      {{ certificate?.certificate?.notAfter?.value | dateTime: dateTimeFormat }}\n    </dd>\n  </dl>\n</section>\n\n<section class=\"fingerprints\">\n  <ng-container\n    *ngTemplateOutlet=\"\n      headingTemplate;\n      context: {\n        level: topHeadingLevel + 1,\n        textContent: 'fingerprints' | translate,\n        class: 'certificate-viewer-general-subtitle',\n      }\n    \"\n  >\n  </ng-container>\n\n  <dl class=\"key-value\">\n    <dt>{{ 'sha-256-fingerprint' | translate }}</dt>\n    <dd class=\"pre-wrap\">{{ certificate?.fingerprints?.sha256 }}</dd>\n  </dl>\n  <dl class=\"key-value\">\n    <dt>{{ 'sha-1-fingerprint' | translate }}</dt>\n    <dd class=\"pre-wrap\">{{ certificate?.fingerprints?.sha1 }}</dd>\n  </dl>\n</section>\n\n<ng-template #relativeDistinguishedNames let-certificate=\"certificate\">\n  <dl class=\"key-value\">\n    <dt>{{ KnownOids.CommonName | translate }}</dt>\n    <dd id=\"issued-cn\">\n      {{ certificate?.commonName || ('not-part-of-certificate' | translate) }}\n    </dd>\n  </dl>\n  <dl class=\"key-value\">\n    <dt>{{ KnownOids.Organization | translate }}</dt>\n    <dd id=\"issued-o\">\n      {{ certificate?.organization || ('not-part-of-certificate' | translate) }}\n    </dd>\n  </dl>\n  <dl class=\"key-value\">\n    <dt>{{ KnownOids.OrganizationalUnit | translate }}</dt>\n    <dd id=\"issued-ou\">\n      {{ certificate?.organizationalUnit || ('not-part-of-certificate' | translate) }}\n    </dd>\n  </dl>\n</ng-template>\n", styles: [":host>section{flex:0 1 auto;margin-top:1.2rem}:host>section.fingerprints .key-value+.key-value{margin-top:.6rem}.key-value{display:flex;margin:0}.key-value>*:first-child{flex:0 0 12rem}.key-value>*:last-child{flex:1 1 auto}.pre-wrap{white-space:pre-wrap}\n"], dependencies: [{ kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "pipe", type: i1.DateTimePipe, name: "dateTime" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: CertificateViewerGeneralComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-certificate-viewer-general', standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<section>\n  <ng-container\n    *ngTemplateOutlet=\"\n      headingTemplate;\n      context: {\n        level: topHeadingLevel + 1,\n        textContent: 'issued-to' | translate,\n        class: 'certificate-viewer-general-subtitle',\n      }\n    \"\n  >\n  </ng-container>\n\n  <ng-container\n    *ngTemplateOutlet=\"relativeDistinguishedNames; context: { certificate: certificate?.subject }\"\n  ></ng-container>\n</section>\n\n<section>\n  <ng-container\n    *ngTemplateOutlet=\"\n      headingTemplate;\n      context: {\n        level: topHeadingLevel + 1,\n        textContent: 'issued-by' | translate,\n        class: 'certificate-viewer-general-subtitle',\n      }\n    \"\n  >\n  </ng-container>\n\n  <ng-container\n    *ngTemplateOutlet=\"relativeDistinguishedNames; context: { certificate: certificate?.issuer }\"\n  ></ng-container>\n</section>\n\n<section>\n  <ng-container\n    *ngTemplateOutlet=\"\n      headingTemplate;\n      context: {\n        level: topHeadingLevel + 1,\n        textContent: 'validity-period' | translate,\n        class: 'certificate-viewer-general-subtitle',\n      }\n    \"\n  >\n  </ng-container>\n\n  <dl class=\"key-value\">\n    <dt>{{ 'issued-on' | translate }}</dt>\n    <dd id=\"issue-date\">\n      {{ certificate?.certificate?.notBefore?.value | dateTime: dateTimeFormat }}\n    </dd>\n  </dl>\n  <dl class=\"key-value\">\n    <dt>{{ 'expires-on' | translate }}</dt>\n    <dd id=\"expiry-date\">\n      {{ certificate?.certificate?.notAfter?.value | dateTime: dateTimeFormat }}\n    </dd>\n  </dl>\n</section>\n\n<section class=\"fingerprints\">\n  <ng-container\n    *ngTemplateOutlet=\"\n      headingTemplate;\n      context: {\n        level: topHeadingLevel + 1,\n        textContent: 'fingerprints' | translate,\n        class: 'certificate-viewer-general-subtitle',\n      }\n    \"\n  >\n  </ng-container>\n\n  <dl class=\"key-value\">\n    <dt>{{ 'sha-256-fingerprint' | translate }}</dt>\n    <dd class=\"pre-wrap\">{{ certificate?.fingerprints?.sha256 }}</dd>\n  </dl>\n  <dl class=\"key-value\">\n    <dt>{{ 'sha-1-fingerprint' | translate }}</dt>\n    <dd class=\"pre-wrap\">{{ certificate?.fingerprints?.sha1 }}</dd>\n  </dl>\n</section>\n\n<ng-template #relativeDistinguishedNames let-certificate=\"certificate\">\n  <dl class=\"key-value\">\n    <dt>{{ KnownOids.CommonName | translate }}</dt>\n    <dd id=\"issued-cn\">\n      {{ certificate?.commonName || ('not-part-of-certificate' | translate) }}\n    </dd>\n  </dl>\n  <dl class=\"key-value\">\n    <dt>{{ KnownOids.Organization | translate }}</dt>\n    <dd id=\"issued-o\">\n      {{ certificate?.organization || ('not-part-of-certificate' | translate) }}\n    </dd>\n  </dl>\n  <dl class=\"key-value\">\n    <dt>{{ KnownOids.OrganizationalUnit | translate }}</dt>\n    <dd id=\"issued-ou\">\n      {{ certificate?.organizationalUnit || ('not-part-of-certificate' | translate) }}\n    </dd>\n  </dl>\n</ng-template>\n", styles: [":host>section{flex:0 1 auto;margin-top:1.2rem}:host>section.fingerprints .key-value+.key-value{margin-top:.6rem}.key-value{display:flex;margin:0}.key-value>*:first-child{flex:0 0 12rem}.key-value>*:last-child{flex:1 1 auto}.pre-wrap{white-space:pre-wrap}\n"] }]
        }], propDecorators: { certificate: [{
                type: Input
            }], topHeadingLevel: [{
                type: Input
            }], headingTemplate: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
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
class CertificateViewerComponent {
    constructor(cdr) {
        this.cdr = cdr;
        this.KnownOids = KnownOids;
        /**
         * The top heading level for this component.
         * All nested headings are incremented automatically. Use to satisfy WCAG heading hierarchy.
         */
        this.topHeadingLevel = 5;
        this.loading = false;
    }
    ngOnChanges(changes) {
        if (changes['pemEncodedCertificatesChain']) {
            const change = changes['pemEncodedCertificatesChain'];
            const current = change.currentValue;
            const previous = change.previousValue;
            if (!change.isFirstChange() &&
                (!Array.isArray(current) || (Array.isArray(previous) && arrayElementsEqual(current, previous)))) {
                return;
            }
            this.parseCertificateChain();
        }
    }
    parseCertificateChain() {
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
            .catch((err) => {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: CertificateViewerComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: CertificateViewerComponent, isStandalone: false, selector: "appfx-certificate-viewer", inputs: { pemEncodedCertificatesChain: "pemEncodedCertificatesChain", topHeadingLevel: "topHeadingLevel" }, providers: [
            AppfxTranslateService,
            { provide: appfxMissingTranslationToken, useValue: missingTranslation },
            { provide: appfxTranslationsToken, useValue: translations },
        ], usesOnChanges: true, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-spinner *ngIf=\"loading; else loaded\">{{ 'loading' | translate }}</clr-spinner>\n<ng-template #loaded>\n  <clr-alert *ngIf=\"parseError\" clrAlertType=\"danger\" [clrAlertClosable]=\"false\">\n    <clr-alert-item\n      ><span class=\"alert-text\">{{ parseError }}</span></clr-alert-item\n    >\n  </clr-alert>\n  <ng-container\n    *ngTemplateOutlet=\"\n      heading;\n      context: {\n        level: topHeadingLevel,\n        textContent:\n          'title'\n          | translate\n            : {\n                title: certificateChain?.leafCertificate?.subject?.commonName,\n              },\n        class: 'certificate-viewer-title',\n      }\n    \"\n  >\n  </ng-container>\n\n  <clr-tabs>\n    <clr-tab>\n      <button clrTabLink>{{ 'general' | translate }}</button>\n      <clr-tab-content *clrIfActive>\n        <appfx-certificate-viewer-general\n          [certificate]=\"certificateChain?.leafCertificate\"\n          [topHeadingLevel]=\"topHeadingLevel\"\n          [headingTemplate]=\"heading\"\n        >\n        </appfx-certificate-viewer-general>\n      </clr-tab-content>\n    </clr-tab>\n\n    <clr-tab>\n      <button clrTabLink>{{ 'details' | translate }}</button>\n      <clr-tab-content *clrIfActive>\n        <appfx-certificate-viewer-details\n          [certificateChain]=\"certificateChain\"\n          [topHeadingLevel]=\"topHeadingLevel\"\n          [headingTemplate]=\"heading\"\n        >\n        </appfx-certificate-viewer-details>\n      </clr-tab-content>\n    </clr-tab>\n  </clr-tabs>\n</ng-template>\n\n<ng-template #heading let-level=\"level\" let-textContent=\"textContent\" let-class=\"class\">\n  <ng-container [ngSwitch]=\"level\">\n    <h1 *ngSwitchCase=\"1\" [ngClass]=\"class\">{{ textContent }}</h1>\n    <h2 *ngSwitchCase=\"2\" [ngClass]=\"class\">{{ textContent }}</h2>\n    <h3 *ngSwitchCase=\"3\" [ngClass]=\"class\">{{ textContent }}</h3>\n    <h4 *ngSwitchCase=\"4\" [ngClass]=\"class\">{{ textContent }}</h4>\n    <h5 *ngSwitchCase=\"5\" [ngClass]=\"class\">{{ textContent }}</h5>\n    <h6 *ngSwitchCase=\"6\" [ngClass]=\"class\">{{ textContent }}</h6>\n    <div *ngSwitchDefault role=\"heading\" [attr.aria-level]=\"level\" [ngClass]=\"class\">{{ textContent }}</div>\n  </ng-container>\n</ng-template>\n", styles: [":host{display:flex;flex-direction:column}h1,h2,h3,h4,h5,h6,[role=heading]{margin-top:0}h1.certificate-viewer-title,h2.certificate-viewer-title,h3.certificate-viewer-title,h4.certificate-viewer-title,h5.certificate-viewer-title,h6.certificate-viewer-title,[role=heading].certificate-viewer-title{color:var(--clr-h5-color);font-weight:var(--clr-h5-font-weight);font-size:var(--clr-h5-font-size);line-height:var(--clr-h5-line-height);letter-spacing:var(--clr-h5-letter-spacing)}h1.certificate-viewer-general-subtitle,h2.certificate-viewer-general-subtitle,h3.certificate-viewer-general-subtitle,h4.certificate-viewer-general-subtitle,h5.certificate-viewer-general-subtitle,h6.certificate-viewer-general-subtitle,[role=heading].certificate-viewer-general-subtitle{color:var(--clr-h6-color);font-weight:var(--clr-h6-font-weight);font-size:var(--clr-h6-font-size);line-height:var(--clr-h6-line-height);letter-spacing:var(--clr-h6-letter-spacing)}h1.certificate-viewer-details-subtitle,h2.certificate-viewer-details-subtitle,h3.certificate-viewer-details-subtitle,h4.certificate-viewer-details-subtitle,h5.certificate-viewer-details-subtitle,h6.certificate-viewer-details-subtitle,[role=heading].certificate-viewer-details-subtitle{margin-bottom:.5rem;color:var(--clr-h5-color);font-weight:var(--clr-h5-font-weight);font-size:var(--clr-h5-font-size);line-height:var(--clr-h5-line-height);letter-spacing:var(--clr-h5-letter-spacing)}clr-tabs{display:flex;flex-direction:column;flex:1 1 auto}clr-tabs ::ng-deep section{display:flex;flex-direction:column;flex:1 1 auto}appfx-certificate-viewer-general,appfx-certificate-viewer-details{display:flex;flex-direction:column;flex:1 1 auto}\n"], dependencies: [{ kind: "component", type: i1$1.ClrAlert, selector: "clr-alert", inputs: ["clrAlertSizeSmall", "clrAlertClosable", "clrAlertAppLevel", "clrCloseButtonAriaLabel", "clrAlertLightweight", "clrAlertType", "clrAlertIcon", "clrAlertClosed"], outputs: ["clrAlertClosedChange"] }, { kind: "component", type: i1$1.ClrAlertItem, selector: "clr-alert-item" }, { kind: "directive", type: i1$1.ClrAlertText, selector: ".alert-text" }, { kind: "component", type: i1$1.ClrSpinner, selector: "clr-spinner", inputs: ["clrInline", "clrInverse", "clrSmall", "clrMedium"] }, { kind: "component", type: i1$1.ClrTabContent, selector: "clr-tab-content", inputs: ["id"] }, { kind: "component", type: i1$1.ClrTab, selector: "clr-tab" }, { kind: "component", type: i1$1.ClrTabs, selector: "clr-tabs", inputs: ["clrLayout"] }, { kind: "directive", type: i1$1.ClrTabLink, selector: "[clrTabLink]", inputs: ["id", "clrTabLinkInOverflow"] }, { kind: "directive", type: i1$1.TabsWillyWonka, selector: "clr-tabs" }, { kind: "directive", type: i1$1.ActiveOompaLoompa, selector: "[clrTabLink], clr-tab-content" }, { kind: "directive", type: i2.ClrIfActive, selector: "[clrIfActive]", inputs: ["clrIfActive"], outputs: ["clrIfActiveChange"] }, { kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i3.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i3.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: i3.NgSwitchDefault, selector: "[ngSwitchDefault]" }, { kind: "component", type: CertificateViewerDetailsComponent, selector: "appfx-certificate-viewer-details", inputs: ["certificateChain", "topHeadingLevel", "headingTemplate"] }, { kind: "component", type: CertificateViewerGeneralComponent, selector: "appfx-certificate-viewer-general", inputs: ["certificate", "topHeadingLevel", "headingTemplate"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: CertificateViewerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-certificate-viewer', standalone: false, providers: [
                        AppfxTranslateService,
                        { provide: appfxMissingTranslationToken, useValue: missingTranslation },
                        { provide: appfxTranslationsToken, useValue: translations },
                    ], template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-spinner *ngIf=\"loading; else loaded\">{{ 'loading' | translate }}</clr-spinner>\n<ng-template #loaded>\n  <clr-alert *ngIf=\"parseError\" clrAlertType=\"danger\" [clrAlertClosable]=\"false\">\n    <clr-alert-item\n      ><span class=\"alert-text\">{{ parseError }}</span></clr-alert-item\n    >\n  </clr-alert>\n  <ng-container\n    *ngTemplateOutlet=\"\n      heading;\n      context: {\n        level: topHeadingLevel,\n        textContent:\n          'title'\n          | translate\n            : {\n                title: certificateChain?.leafCertificate?.subject?.commonName,\n              },\n        class: 'certificate-viewer-title',\n      }\n    \"\n  >\n  </ng-container>\n\n  <clr-tabs>\n    <clr-tab>\n      <button clrTabLink>{{ 'general' | translate }}</button>\n      <clr-tab-content *clrIfActive>\n        <appfx-certificate-viewer-general\n          [certificate]=\"certificateChain?.leafCertificate\"\n          [topHeadingLevel]=\"topHeadingLevel\"\n          [headingTemplate]=\"heading\"\n        >\n        </appfx-certificate-viewer-general>\n      </clr-tab-content>\n    </clr-tab>\n\n    <clr-tab>\n      <button clrTabLink>{{ 'details' | translate }}</button>\n      <clr-tab-content *clrIfActive>\n        <appfx-certificate-viewer-details\n          [certificateChain]=\"certificateChain\"\n          [topHeadingLevel]=\"topHeadingLevel\"\n          [headingTemplate]=\"heading\"\n        >\n        </appfx-certificate-viewer-details>\n      </clr-tab-content>\n    </clr-tab>\n  </clr-tabs>\n</ng-template>\n\n<ng-template #heading let-level=\"level\" let-textContent=\"textContent\" let-class=\"class\">\n  <ng-container [ngSwitch]=\"level\">\n    <h1 *ngSwitchCase=\"1\" [ngClass]=\"class\">{{ textContent }}</h1>\n    <h2 *ngSwitchCase=\"2\" [ngClass]=\"class\">{{ textContent }}</h2>\n    <h3 *ngSwitchCase=\"3\" [ngClass]=\"class\">{{ textContent }}</h3>\n    <h4 *ngSwitchCase=\"4\" [ngClass]=\"class\">{{ textContent }}</h4>\n    <h5 *ngSwitchCase=\"5\" [ngClass]=\"class\">{{ textContent }}</h5>\n    <h6 *ngSwitchCase=\"6\" [ngClass]=\"class\">{{ textContent }}</h6>\n    <div *ngSwitchDefault role=\"heading\" [attr.aria-level]=\"level\" [ngClass]=\"class\">{{ textContent }}</div>\n  </ng-container>\n</ng-template>\n", styles: [":host{display:flex;flex-direction:column}h1,h2,h3,h4,h5,h6,[role=heading]{margin-top:0}h1.certificate-viewer-title,h2.certificate-viewer-title,h3.certificate-viewer-title,h4.certificate-viewer-title,h5.certificate-viewer-title,h6.certificate-viewer-title,[role=heading].certificate-viewer-title{color:var(--clr-h5-color);font-weight:var(--clr-h5-font-weight);font-size:var(--clr-h5-font-size);line-height:var(--clr-h5-line-height);letter-spacing:var(--clr-h5-letter-spacing)}h1.certificate-viewer-general-subtitle,h2.certificate-viewer-general-subtitle,h3.certificate-viewer-general-subtitle,h4.certificate-viewer-general-subtitle,h5.certificate-viewer-general-subtitle,h6.certificate-viewer-general-subtitle,[role=heading].certificate-viewer-general-subtitle{color:var(--clr-h6-color);font-weight:var(--clr-h6-font-weight);font-size:var(--clr-h6-font-size);line-height:var(--clr-h6-line-height);letter-spacing:var(--clr-h6-letter-spacing)}h1.certificate-viewer-details-subtitle,h2.certificate-viewer-details-subtitle,h3.certificate-viewer-details-subtitle,h4.certificate-viewer-details-subtitle,h5.certificate-viewer-details-subtitle,h6.certificate-viewer-details-subtitle,[role=heading].certificate-viewer-details-subtitle{margin-bottom:.5rem;color:var(--clr-h5-color);font-weight:var(--clr-h5-font-weight);font-size:var(--clr-h5-font-size);line-height:var(--clr-h5-line-height);letter-spacing:var(--clr-h5-letter-spacing)}clr-tabs{display:flex;flex-direction:column;flex:1 1 auto}clr-tabs ::ng-deep section{display:flex;flex-direction:column;flex:1 1 auto}appfx-certificate-viewer-general,appfx-certificate-viewer-details{display:flex;flex-direction:column;flex:1 1 auto}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { pemEncodedCertificatesChain: [{
                type: Input
            }], topHeadingLevel: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class AppfxCertificateViewerModule {
    constructor() {
        ClarityIcons.addIcons(angleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxCertificateViewerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: AppfxCertificateViewerModule, declarations: [CertificateViewerComponent,
            CertificateViewerDetailsComponent,
            CertificateViewerGeneralComponent,
            CertificateViewerTranslateFieldPipe], imports: [AppfxTranslateModule,
            ClrAlertModule,
            ClrSpinnerModule,
            ClrTabsModule,
            ClrTreeViewModule,
            CommonModule,
            RouterModule], exports: [CertificateViewerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxCertificateViewerModule, imports: [AppfxTranslateModule,
            ClrAlertModule,
            ClrSpinnerModule,
            ClrTabsModule,
            ClrTreeViewModule,
            CommonModule,
            RouterModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxCertificateViewerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        AppfxTranslateModule,
                        ClrAlertModule,
                        ClrSpinnerModule,
                        ClrTabsModule,
                        ClrTreeViewModule,
                        CommonModule,
                        RouterModule,
                    ],
                    declarations: [
                        CertificateViewerComponent,
                        CertificateViewerDetailsComponent,
                        CertificateViewerGeneralComponent,
                        CertificateViewerTranslateFieldPipe,
                    ],
                    exports: [CertificateViewerComponent],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AppfxCertificateViewerModule, CertificateViewerComponent, AppfxCertificateViewerModule as CertificateViewerModule };
//# sourceMappingURL=clr-addons-certificate-viewer.mjs.map

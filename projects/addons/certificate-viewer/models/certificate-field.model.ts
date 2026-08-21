/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable @typescript-eslint/member-ordering */

import { AppfxTranslateService, DateTimeService } from '@clr/addons/translate';
import { BitString } from 'asn1js';
import {
  AltName,
  BasicConstraints,
  CertificatePolicies,
  CRLDistributionPoints,
  Extension,
  ExtKeyUsage,
  GeneralName,
  InfoAccess,
  RelativeDistinguishedNames,
} from 'pkijs';

import { generalNamesTypeToLocaleKey, keyUsageBitIndexToLocaleKey, KnownOids } from '../certificate.constants';
import { filterMapOverString, formatHexString, formatOid } from '../certificate.util';
import { Line, TranslatableValue, Value, ValueType } from './partial-translate.model';

/**
 * A parsed certificate field to be displayed in the certificate fields tree and the value area.
 */
export class CertificateField {
  constructor(
    readonly name: TranslatableValue | string,
    readonly children: CertificateField[] = [],
    readonly lines?: Line[]
  ) {}

  /**
   * Translates the filed name.
   */
  translateName(translateService: AppfxTranslateService): string {
    return this.name instanceof TranslatableValue ? this.name.translate(translateService) : this.name;
  }

  /**
   * Translates the filed value.
   */
  translateValue(translateService: AppfxTranslateService, dateTimeService: DateTimeService): string {
    return this.lines?.map(value => value.translate(translateService, dateTimeService)).join('\n') ?? '';
  }

  /**
   * Create a new CertificateField that has an untranslated valued for its name and children.
   *
   * A certificate field with children is not expected to have a value.
   *
   * This is a helper constructor to simplify common usage.
   */
  static untranslatedNameWithChildren(name: string, children: CertificateField[]): CertificateField {
    return new CertificateField(name, children);
  }

  /**
   * Create a new CertificateField that has a translatable key for its name and children.
   *
   * A certificate field with children is not expected to have a value.
   *
   * This is a helper constructor to simplify common usage.
   */
  static withChildren(translatableKey: string, children: CertificateField[]): CertificateField {
    return new CertificateField(new TranslatableValue(translatableKey), children);
  }

  /**
   * Create a new CertificateField that has a translatable key for its name and a single value.
   *
   * A certificate field with a value is not expected to have children.
   *
   * This is a helper constructor to simplify common usage.
   */
  static withValue(translatableKey: string, value: ValueType): CertificateField {
    return new CertificateField(new TranslatableValue(translatableKey), [], [new Line([new Value(value)])]);
  }

  /**
   * Create a new CertificateField that has a translatable key for its name and a multi-lined value.
   *
   * A certificate field with a value is not expected to have children.
   *
   * This is a helper constructor to simplify common usage.
   */
  static withLines(translatableKey: string, lines: Line[]): CertificateField {
    return new CertificateField(new TranslatableValue(translatableKey), [], lines);
  }

  /**
   * Create a new CertificateField from pkijs's Certificate Extension structure.
   *
   * This helper constructor simplifies certificate extension parsing by covering the common extensions.
   */
  static fromExtension(extension: Extension): CertificateField {
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
        const altName: AltName = extension.parsedValue;
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

  private static extensionKeyUsage(extension: Extension): CertificateField {
    const value = (extension.parsedValue as BitString).valueBlock;
    const bits = value.valueHexView.reduce((acc, byte) => acc + byte.toString(2), '').slice(0, -value.unusedBits);

    const lines = filterMapOverString(bits, (bit, index) => (bit === '1' ? index : undefined)).map(index =>
      Line.fromTranslatableKey(keyUsageBitIndexToLocaleKey[index])
    );

    return this.fromExtensionWithLines(extension, lines);
  }

  private static extensionExtendedKeyUsage(extension: Extension): CertificateField {
    const keyUsage = extension.parsedValue as ExtKeyUsage;
    return this.fromExtensionWithLines(
      extension,
      keyUsage.keyPurposes.map(purpose =>
        Line.fromPair(Value.fromTranslatableKey(purpose), new Value(`(${formatOid(purpose)})`), ' ')
      )
    );
  }

  private static extensionBasicCertificateConstraints(extension: Extension): CertificateField {
    const basicConstraints: BasicConstraints = extension.parsedValue;
    const lines = [Line.fromTranslatableKey(basicConstraints.cA ? 'is-cert-authority' : 'is-not-cert-authority')];
    if (basicConstraints.cA) {
      lines.push(
        Line.fromTranslatableKey('max-number-intermediate-CAs', {
          maxNumber:
            // eslint-disable-next-line eqeqeq
            basicConstraints.pathLenConstraint == null
              ? new TranslatableValue('unlimited')
              : basicConstraints.pathLenConstraint.toString(),
        })
      );
    }
    return this.fromExtensionWithLines(extension, lines);
  }

  private static extensionKeyId(extension: Extension, removeFirstNumberOfBytes: number): CertificateField {
    const hex = extension.extnValue.toString('hex').slice(removeFirstNumberOfBytes * 2);

    return this.fromExtensionWithLines(extension, [
      Line.fromTranslatableKey('key-id', {
        id: formatHexString(hex),
      }),
    ]);
  }

  private static extensionAuthorityInfoAccess(extension: Extension): CertificateField {
    const infoAccess: InfoAccess = extension.parsedValue;
    const value = infoAccess.accessDescriptions.map(description => {
      return new Line([
        Value.fromTranslatableKey(description.accessMethod),
        new Value(': '),
        ...this.translatableGeneralName(description.accessLocation, ': '),
      ]);
    });
    return this.fromExtensionWithLines(extension, value);
  }

  private static extensionCertificatePolicies(extension: Extension): CertificateField {
    const policies: CertificatePolicies = extension.parsedValue;
    const value = policies.certificatePolicies.flatMap(policy => {
      return [
        Line.fromTranslatableKey(policy.policyIdentifier),
        ...(policy.policyQualifiers?.map(qualifier => {
          return Line.fromPair(
            Value.fromTranslatableKey(qualifier.policyQualifierId),
            new Value(qualifier.qualifier.toString()),
            ': '
          );
        }) ?? []),
      ];
    });

    return this.fromExtensionWithLines(extension, value);
  }

  private static extensionClrDistributionPoints(extension: Extension): CertificateField {
    const crlDistPoints: CRLDistributionPoints = extension.parsedValue;
    const value = crlDistPoints.distributionPoints.reduce((result, crlDistPoint) => {
      if (crlDistPoint.distributionPoint) {
        if (crlDistPoint.distributionPoint instanceof RelativeDistinguishedNames) {
          const points = crlDistPoint.distributionPoint.typesAndValues.map(typeAndValue => {
            return Line.fromPair(new Value(typeAndValue.type), new Value(typeAndValue.value.toString()), ': ');
          });
          result.push(...points);
        } else {
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
    }, [] as Line[]);

    return this.fromExtensionWithLines(extension, value);
  }

  private static fromExtensionWithLines(extension: Extension, lines: Line[]): CertificateField {
    const critical = new Line([Value.fromTranslatableKey(extension.critical ? 'critical' : 'not-critical')]);
    return this.withLines(extension.extnID, [critical, ...lines]);
  }

  private static parseGeneralNames(generalNames: GeneralName[]): Line[] {
    return generalNames.map(generalName => {
      return new Line(this.translatableGeneralName(generalName, ': '));
    });
  }

  private static translatableGeneralName(generalName: GeneralName, separator: string): Value[] {
    return [
      Value.fromTranslatableKey(generalNamesTypeToLocaleKey[generalName.type]),
      new Value(separator),
      new Value(generalName.value.toString()),
    ];
  }
}

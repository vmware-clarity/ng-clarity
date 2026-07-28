/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AppfxLocale,
  AppfxTranslations,
  DateTimeFormatOptions,
  DateTimeKind,
  defaultMissingTranslationHandler,
  HourFormat,
} from '@clr/addons/translate';
import { AttributeTypeAndValue } from 'pkijs';

import { AlgorithmName } from './certificate.constants';

const pemHeaderRegex = /(-----(BEGIN|END) CERTIFICATE-----|[\n\r])/g;
const whitespaceRegex = new RegExp('\\s+', 'g');
const oidRegex = /^(\d+\.)*\d+$/;

export const dateTimeFormat: DateTimeFormatOptions = {
  dateTimeKind: DateTimeKind.LongDateTime,
  hourFormat: HourFormat.Hour24,
};

export function missingTranslation(translations: AppfxTranslations, locale: AppfxLocale, key: string): string {
  // Handles unknown OIDs.
  if (oidRegex.test(key)) {
    return formatOid(key);
  }

  // Fallback for unknown key that is not an OID.
  return defaultMissingTranslationHandler(translations, locale, key);
}

export function formatOid(oid: string): string {
  return 'OID.' + oid;
}

function formatHexByte(byte: number): string {
  return byte.toString(16).toUpperCase().padStart(2, '0');
}

function formatHexArray(bytes: string[], bytesPerLine = 16): string {
  const lines = [];
  for (let i = 0; i < bytes.length; i += bytesPerLine) {
    lines.push(bytes.slice(i, i + bytesPerLine).join(' '));
  }

  return lines.join('\n');
}

export function formatHexString(hexString: string, onSingleLine = false, bytesPerLine = 16): string {
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

export function formatHexBuffer(hexBuffer: ArrayBuffer, onSingleLine = false, bytesPerLine = 16): string {
  const bytes = Array.from(new Uint8Array(hexBuffer)).map(formatHexByte);

  if (onSingleLine) {
    return bytes.join(' ');
  }

  return formatHexArray(bytes, bytesPerLine);
}

export function pemToBerBuffer(pem: string): ArrayBuffer {
  const base64Encoded = pem.replace(pemHeaderRegex, '').replace(whitespaceRegex, '');

  // Now that we have decoded the cert it's now in DER-encoding
  const derFormat = atob(base64Encoded);
  // And massage the cert into a BER encoded one
  return Uint8Array.from(derFormat.split(''), c => c.charCodeAt(0)).buffer as ArrayBuffer;
}

export async function computeCertificateHash(algo: AlgorithmName, buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(algo, buffer);
  return formatHexBuffer(hashBuffer);
}

export function pkijsAttributeAndValuesToMap(typesAndValues: AttributeTypeAndValue[]): Map<string, string> {
  return new Map(
    typesAndValues.map(
      ({
        type,
        value: {
          valueBlock: { value },
        },
      }) => [type, value]
    )
  );
}

/**
 * Shallow array equals based on their item references.
 *
 * Implemented here to avoid depending on an external helper library for a couple of functions.
 */
export function arrayElementsEqual<T>(left: T[], right: T[]): boolean {
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
export function filterMapOverString<U>(
  str: string,
  callback: (element: string, index: number, arr: string) => NonNullable<U> | null | undefined
): NonNullable<U>[] {
  const result = [];
  for (let index = 0; index < str.length; index++) {
    const value = callback(str.charAt(index), index, str);
    if (value !== null && value !== undefined) {
      result.push(value);
    }
  }
  return result;
}

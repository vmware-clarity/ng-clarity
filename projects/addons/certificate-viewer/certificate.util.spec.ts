/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AppfxLocale, AppfxTranslations } from '@clr/addons/translate';
import { AttributeTypeAndValue } from 'pkijs';

import { AlgorithmName } from './certificate.constants';
import {
  arrayElementsEqual,
  computeCertificateHash,
  filterMapOverString,
  formatHexBuffer,
  formatHexString,
  formatOid,
  missingTranslation,
  pemToBerBuffer,
  pkijsAttributeAndValuesToMap,
} from './certificate.util';

describe('certificate.util.ts', () => {
  it('formatOid should format OID properly', () => {
    const oid = '1.2.3.4';
    expect(formatOid(oid)).toBe('OID.1.2.3.4');
  });

  it('formatHexBuffer should format ArrayBuffer to hex string', () => {
    const buffer = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]).buffer;
    expect(formatHexBuffer(buffer, true)).toBe('48 65 6C 6C 6F');
  });

  it('formatHexString should format hex string correctly if hex is valid', () => {
    const validHexString = '48656C6C6F';
    expect(formatHexString(validHexString)).toBe('48 65 6C 6C 6F');
  });

  it('formatHexString should not format hex string if hex is not valid', () => {
    const nonHexString = 'ZYX';
    expect(formatHexString(nonHexString)).toBe(nonHexString);
  });

  it('pemToBerBuffer should convert PEM to ArrayBuffer', () => {
    const pem = '-----BEGIN CERTIFICATE-----\nABC\n  DEF';
    const berBuffer = pemToBerBuffer(pem);
    expect(berBuffer).toBeDefined();
  });

  it('arrayElementsEqual should check equality of two arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    const arr3 = [1, 2, 4];
    const arr4 = [1, 2, 4, 5];

    expect(arrayElementsEqual(arr1, arr1)).toBe(true);
    expect(arrayElementsEqual(arr1, arr2)).toBe(true);
    expect(arrayElementsEqual(arr1, arr3)).toBe(false);
    expect(arrayElementsEqual(arr1, arr4)).toBe(false);
  });

  it('filterMapOverString should filter and map over string characters', () => {
    const str = 'Hello World';
    const filteredMapped = filterMapOverString(str, (char, index) => {
      if (index % 2 === 0) {
        return char.toUpperCase();
      }

      return undefined;
    });
    expect(filteredMapped).toEqual(['H', 'L', 'O', 'W', 'R', 'D']);
  });

  it('computeCertificateHash should compute hash asynchronously', async () => {
    const buffer = new ArrayBuffer(8);

    const hash = await computeCertificateHash(AlgorithmName.sha256, buffer);

    expect(hash).toEqual(
      'AF 55 70 F5 A1 81 0B 7A F7 8C AF 4B C7 0A 66 0F\n' + '0D F5 1E 42 BA F9 1D 4D E5 B2 32 8D E0 E8 3D FC'
    );
  });

  it('pkijsAttributeAndValuesToMap should convert AttributeTypeAndValue array to a Map', () => {
    const attributeArray = [
      { type: 'type1', value: { valueBlock: { value: 'value1' } } },
      { type: 'type2', value: { valueBlock: { value: 'value2' } } },
    ] as unknown as AttributeTypeAndValue[];
    const attributeMap = pkijsAttributeAndValuesToMap(attributeArray);

    expect(attributeMap.size).toBe(2);
    expect(attributeMap.get('type1')).toBe('value1');
    expect(attributeMap.get('type2')).toBe('value2');
  });

  it('missingTranslation should handle unknown OIDs', () => {
    const oidKey = '1.2.3.4';
    expect(missingTranslation({} as unknown as AppfxTranslations, 'en_US' as AppfxLocale, oidKey)).toBe(
      formatOid(oidKey)
    );
  });

  it('missingTranslation should handle known OIDs', () => {
    const nonOidKey = 'someNonOidKey';

    expect(missingTranslation({} as unknown as AppfxTranslations, 'en_US' as AppfxLocale, nonOidKey)).toBe(nonOidKey);
  });
});

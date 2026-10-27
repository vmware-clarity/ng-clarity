/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrIpAddressFilterValidator } from './ip-address-filter-validator';
import { IpAddressFilterOperator } from './ip-address-operators';
import { IpAddressFilterValidationError as IpCode } from './ip-address-validation-error.enum';
import { ClrAdvancedFilterValidationError as Code } from '../enums/advanced-filter-validation-error.enum';
import { ClrAdvancedFilterValidator } from '../validators/advanced-filter-validator';

describe('ClrIpAddressFilterValidator (internal, parked)', () => {
  const validator = new ClrIpAddressFilterValidator();

  it('extends the base validator', () => {
    expect(validator).toEqual(jasmine.any(ClrAdvancedFilterValidator));
  });

  /**
   * Whether two texts are the same address: a range from one to the other is valid both ways.
   */
  const sameAddress = (a: string, b: string) =>
    validator.validateIpAddress('between', [a, b]) === null && validator.validateIpAddress('between', [b, a]) === null;

  describe('parsing', () => {
    it('accepts IPv4 addresses', () => {
      ['0.0.0.0', '10.0.0.1', '255.255.255.255'].forEach(text =>
        expect(validator.isIpAddress(text)).withContext(text).toBeTrue()
      );
    });

    it('rejects malformed IPv4 addresses', () => {
      [
        '10.0.0',
        '10.0.0.0.1',
        '256.0.0.1',
        '10.0.0.01',
        '10..0.1',
        '10.0.0.-1',
        ' 10.0.0.1',
        'a.b.c.d',
        '1e1.0.0.1',
      ].forEach(text => expect(validator.isIpAddress(text)).withContext(text).toBeFalse());
    });

    it('reads IPv6 addresses case insensitive', () => {
      expect(sameAddress('2001:DB8:0:0:0:0:0:1', '2001:0db8:0000:0000:0000:0000:0000:0001')).toBeTrue();
      expect(sameAddress('2001:db8::1', '2001:db8::2')).toBeFalse();
    });

    it('reads compressed IPv6 addresses', () => {
      expect(sameAddress('::', '0:0:0:0:0:0:0:0')).toBeTrue();
      expect(sameAddress('::1', '0:0:0:0:0:0:0:1')).toBeTrue();
      expect(sameAddress('2001:db8::1', '2001:db8:0:0:0:0:0:1')).toBeTrue();
      expect(sameAddress('fe80::', 'fe80:0:0:0:0:0:0:0')).toBeTrue();
      expect(sameAddress('1:2:3:4:5:6:7::', '1:2:3:4:5:6:7:0')).toBeTrue();
    });

    it('reads IPv6 addresses with an embedded IPv4 address', () => {
      expect(sameAddress('::ffff:10.0.0.1', '::ffff:a00:1')).toBeTrue();
      expect(sameAddress('::ffff:192.168.1.1', '::ffff:c0a8:101')).toBeTrue();
      expect(sameAddress('64:ff9b::192.0.2.33', '64:ff9b::c000:221')).toBeTrue();
      expect(sameAddress('1:2:3:4:5::1.2.3.4', '1:2:3:4:5:0:102:304')).toBeTrue();
      expect(sameAddress('1:2:3:4:5:6:10.0.0.1', '1:2:3:4:5:6:a00:1')).toBeTrue();
    });

    it('orders addresses by value', () => {
      expect(validator.validateIpAddress('between', ['9.255.255.255', '10.0.0.0'])).toBeNull();
      expect(validator.validateIpAddress('between', ['10.0.0.0', '9.255.255.255'])).toBe(Code.INVALID_RANGE);
      expect(validator.validateIpAddress('between', ['::ffff', '::1:0'])).toBeNull();
    });

    it('rejects malformed IPv6 addresses', () => {
      [
        '1:2:3:4:5:6:7',
        '1:2:3:4:5:6:7:8:9',
        '1:2:3:4:5:6:7:8::',
        '1::2::3',
        ':::',
        ':1:2:3:4:5:6:7',
        '12345::1',
        'g::1',
        '1.2.3.4::',
        '1.2.3.4::1',
        '::10.0.0.1:1',
        '::256.0.0.1',
        '1:2:3:4:5:6:7:10.0.0.1',
        '1:2:3:4:5:6::1.2.3.4',
        '1:2:3:4:1.2.3.4:1.2.3.4',
        '::1.2.3.4:5.6.7.8',
      ].forEach(text => expect(validator.isIpAddress(text)).withContext(text).toBeFalse());
    });

    it('rejects zone ids', () => {
      expect(validator.isIpAddress('fe80::1%eth0')).toBeFalse();
    });

    it('rejects anything that is not a non-empty string', () => {
      [undefined, null, '', 167772161, {}].forEach(value =>
        expect(validator.isIpAddress(value)).withContext(String(value)).toBeFalse()
      );
    });

    it('accepts subnets with a prefix of 0 to 32 for IPv4 and 0 to 128 for IPv6, host bits set or not', () => {
      ['10.0.0.0/24', '0.0.0.0/0', '10.0.0.1/32', '10.0.0.1/24', '2001:db8::/32', '::/0', '::1/128'].forEach(text =>
        expect(validator.isCidr(text)).withContext(text).toBeTrue()
      );
      ['10.0.0.0/33', '2001:db8::/129'].forEach(text => expect(validator.isCidr(text)).withContext(text).toBeFalse());
    });

    it('rejects malformed subnets', () => {
      [
        '10.0.0.0',
        '10.0.0.0/',
        '/24',
        '10.0.0.0/24/1',
        '10.0.0.0/024',
        '10.0.0.0/a',
        '10.0.0/24',
        'fe80::1%eth0/64',
        undefined,
      ].forEach(text => expect(validator.isCidr(text)).withContext(String(text)).toBeFalse());
    });
  });

  describe('isIpAddress()', () => {
    it('accepts IPv4 and IPv6 addresses', () => {
      ['10.0.0.1', '::1', '2001:db8::1', '::ffff:10.0.0.1'].forEach(text =>
        expect(validator.isIpAddress(text)).withContext(text).toBeTrue()
      );
    });

    it('rejects everything else, zone ids included', () => {
      ['10.0.0', 'fe80::1%eth0', ' 10.0.0.1', '', 'abc', 167772161, null, undefined].forEach(text =>
        expect(validator.isIpAddress(text)).withContext(String(text)).toBeFalse()
      );
    });
  });

  describe('isCidr()', () => {
    it('accepts IPv4 and IPv6 subnets', () => {
      ['10.0.0.0/24', '10.0.0.1/24', '::/0', '2001:db8::/32'].forEach(text =>
        expect(validator.isCidr(text)).withContext(text).toBeTrue()
      );
    });

    it('rejects everything else', () => {
      ['10.0.0.0', '10.0.0.0/33', '::/129', '10.0.0.0/024', '', null].forEach(text =>
        expect(validator.isCidr(text)).withContext(String(text)).toBeFalse()
      );
    });
  });

  describe('validateIpAddress()', () => {
    it('requires a valid address for "Equal to"', () => {
      expect(validator.validateIpAddress('equals', '10.0.0.1')).toBeNull();
      expect(validator.validateIpAddress('equals', '2001:db8::1')).toBeNull();
      expect(validator.validateIpAddress('equals', '10.0.0')).toBe(IpCode.INVALID_IP);
      expect(validator.validateIpAddress('equals', ' 10.0.0.1')).toBe(IpCode.INVALID_IP);
      expect(validator.validateIpAddress('equals', undefined)).toBe(Code.REQUIRED);
    });

    it('requires a valid subnet for "All in a subnet"', () => {
      expect(validator.validateIpAddress('inSubnet', '10.0.0.0/24')).toBeNull();
      expect(validator.validateIpAddress('inSubnet', '2001:db8::/32')).toBeNull();
      expect(validator.validateIpAddress('inSubnet', '10.0.0.0')).toBe(IpCode.INVALID_CIDR);
      expect(validator.validateIpAddress('inSubnet', '10.0.0.0/33')).toBe(IpCode.INVALID_CIDR);
      expect(validator.validateIpAddress('inSubnet', '::/129')).toBe(IpCode.INVALID_CIDR);
      expect(validator.validateIpAddress('inSubnet', undefined)).toBe(Code.REQUIRED);
    });

    it('accepts partial addresses for text operators', () => {
      expect(validator.validateIpAddress('startsWith', '10.0.')).toBeNull();
      expect(validator.validateIpAddress('contains', ':db8:')).toBeNull();
      expect(validator.validateIpAddress('contains', '')).toBe(Code.REQUIRED);
      expect(validator.validateIpAddress('contains', '   ')).toBe(Code.REQUIRED);
      expect(validator.validateIpAddress('contains', 10)).toBe(Code.REQUIRED);
    });

    it('requires an ordered range of two addresses of the same family', () => {
      expect(validator.validateIpAddress('between', ['10.0.0.1', '10.0.0.255'])).toBeNull();
      expect(validator.validateIpAddress('between', ['10.0.0.1', '10.0.0.1'])).toBeNull();
      expect(validator.validateIpAddress('between', ['::1', '::ffff'])).toBeNull();
      expect(validator.validateIpAddress('between', ['2001:db8::1', '2001:db8::2'])).toBeNull();
      expect(validator.validateIpAddress('between', ['10.0.0.255', '10.0.0.1'])).toBe(Code.INVALID_RANGE);
      expect(validator.validateIpAddress('between', ['2001:db8::2', '2001:db8::1'])).toBe(Code.INVALID_RANGE);
      expect(validator.validateIpAddress('between', ['10.0.0.1', '::ffff:10.0.0.2'])).toBe(Code.INVALID_RANGE);
      expect(validator.validateIpAddress('between', ['10.0.0.1', 'nope'])).toBe(IpCode.INVALID_IP);
      expect(validator.validateIpAddress('between', ['10.0.0.1'])).toBe(Code.REQUIRED);
    });

    it('requires both bounds of a range before checking their format', () => {
      expect(validator.validateIpAddress('between', ['', '10.0.0.1'])).toBe(Code.REQUIRED);
      expect(validator.validateIpAddress('between', ['10.0.0.1', null])).toBe(Code.REQUIRED);
      expect(validator.validateIpAddress('between', ['  ', '10.0.0.1'])).toBe(Code.REQUIRED);
    });

    it('accepts IS_EMPTY and rejects operators it does not offer', () => {
      expect(validator.validateIpAddress('isEmpty', undefined)).toBeNull();
      expect(validator.validateIpAddress('isEmpty', '10.0.0.1')).toBe(Code.REQUIRED);
      expect(validator.validateIpAddress('lessThan' as IpAddressFilterOperator, '10.0.0.1')).toBe(
        Code.UNSUPPORTED_OPERATOR
      );
    });
  });
});

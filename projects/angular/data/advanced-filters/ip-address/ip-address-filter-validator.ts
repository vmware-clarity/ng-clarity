/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { IpAddressFilterOperator } from './ip-address-operators';
import { IpAddressFilterValidationError } from './ip-address-validation-error.enum';
import { ParsedIpAddress } from './parsed-ip-address.interface';
import { ClrAdvancedFilterValidationError } from '../enums/advanced-filter-validation-error.enum';
import { ClrAdvancedFilterValidator } from '../validators/advanced-filter-validator';

const IPV4_OCTET = /^(0|[1-9]\d{0,2})$/;
const IPV6_GROUP = /^[0-9a-f]{1,4}$/i;
const PREFIX_LENGTH = /^(0|[1-9]\d{0,2})$/;

/**
 * Internal, parked until custom field types exist: the validator of the planned IP address field type. It is not
 * wired into `validate()` yet, because its operators are not built-in `ClrAdvancedFilterOperator` members.
 *
 * IP values are kept as typed, never converted to a canonical form:
 * - EQUALS and BETWEEN: an IPv4 address in dotted decimal notation, or an IPv6 address in full, `::` compressed or
 *   embedded IPv4 notation, without a zone id. Both bounds of a range have the same family.
 * - IN_SUBNET: CIDR notation such as `10.0.0.0/24` or `2001:db8::/32`.
 * - STARTS_WITH and CONTAINS: any non-blank text, for example part of an address.
 */
export class ClrIpAddressFilterValidator extends ClrAdvancedFilterValidator {
  /**
   * An IPv4 address in dotted decimal notation, or an IPv6 address in full, `::` compressed or embedded IPv4 notation.
   * No zone id, no leading zeros in IPv4 parts, no surrounding whitespace.
   */
  isIpAddress(text: unknown): boolean {
    return this.parseIpAddress(text) !== null;
  }

  /**
   * CIDR notation such as `10.0.0.0/24` or `2001:db8::/32`, with a prefix of 0-32 for IPv4 and 0-128 for IPv6. Host
   * bits may be set.
   */
  isCidr(text: unknown): boolean {
    if (typeof text !== 'string') {
      return false;
    }
    const parts = text.split('/');
    if (parts.length !== 2 || !PREFIX_LENGTH.test(parts[1])) {
      return false;
    }
    const address = this.parseIpAddress(parts[0]);
    if (!address) {
      return false;
    }
    return Number(parts[1]) <= (address.family === 4 ? 32 : 128);
  }

  /**
   * The IP rules for one operator and its value.
   * @returns The first problem found, or `null`.
   */
  validateIpAddress(
    operator: IpAddressFilterOperator,
    value: unknown
  ): ClrAdvancedFilterValidationError | IpAddressFilterValidationError | null {
    switch (operator) {
      case 'isEmpty':
        return value === undefined ? null : ClrAdvancedFilterValidationError.REQUIRED;
      case 'between':
        return this.validateIpRange(value);
      case 'equals':
        if (this.isMissing(value)) {
          return ClrAdvancedFilterValidationError.REQUIRED;
        }
        return this.isIpAddress(value) ? null : IpAddressFilterValidationError.INVALID_IP;
      case 'inSubnet':
        if (this.isMissing(value)) {
          return ClrAdvancedFilterValidationError.REQUIRED;
        }
        return this.isCidr(value) ? null : IpAddressFilterValidationError.INVALID_CIDR;
      case 'startsWith':
      case 'contains':
        // These match on text, so a partial address is valid.
        return typeof value === 'string' && !this.isMissing(value) ? null : ClrAdvancedFilterValidationError.REQUIRED;
      default:
        return ClrAdvancedFilterValidationError.UNSUPPORTED_OPERATOR;
    }
  }

  private validateIpRange(value: unknown): ClrAdvancedFilterValidationError | IpAddressFilterValidationError | null {
    if (!this.isRange(value)) {
      return ClrAdvancedFilterValidationError.REQUIRED;
    }
    const start = this.parseIpAddress(value[0]);
    const end = this.parseIpAddress(value[1]);
    if (!start || !end) {
      return IpAddressFilterValidationError.INVALID_IP;
    }
    return start.family === end.family && start.value <= end.value
      ? null
      : ClrAdvancedFilterValidationError.INVALID_RANGE;
  }

  /**
   * Accepts IPv4 dotted quads and IPv6 in full, `::` compressed, or embedded IPv4 form (`::ffff:10.0.0.1`).
   * Rejects zone ids (`fe80::1%eth0`), leading zeros in IPv4 octets, and surrounding whitespace.
   */
  private parseIpAddress(text: unknown): ParsedIpAddress | null {
    if (typeof text !== 'string' || !text) {
      return null;
    }
    if (text.includes(':')) {
      const value = this.parseIpv6(text);
      return value === null ? null : { family: 6, value };
    }
    const value = this.parseIpv4(text);
    return value === null ? null : { family: 4, value };
  }

  private parseIpv4(text: string): bigint | null {
    const octets = text.split('.');
    if (octets.length !== 4) {
      return null;
    }
    let value = 0n;
    for (const octet of octets) {
      if (!IPV4_OCTET.test(octet) || Number(octet) > 255) {
        return null;
      }
      value = (value << 8n) + BigInt(octet);
    }
    return value;
  }

  private parseIpv6(text: string): bigint | null {
    const halves = text.split('::');
    if (halves.length > 2) {
      return null;
    }

    const head = this.parseIpv6Groups(halves[0]);
    const tail = halves.length === 2 ? this.parseIpv6Groups(halves[1]) : [];
    if (!head || !tail) {
      return null;
    }

    // An embedded IPv4 address is only allowed once, as the very last part of the address.
    const lastPart = halves.length === 2 ? tail : head;
    const embeddedIpv4Count = [...head, ...tail].filter(group => typeof group === 'bigint').length;
    if (embeddedIpv4Count > 1 || (embeddedIpv4Count === 1 && typeof lastPart[lastPart.length - 1] !== 'bigint')) {
      return null;
    }

    // An embedded IPv4 address takes the place of two groups. `::` must stand for at least one group.
    const groupCount = head.length + tail.length + embeddedIpv4Count;
    if (halves.length === 2 ? groupCount > 7 : groupCount !== 8) {
      return null;
    }

    const groups: bigint[] = [];
    const expand = (parts: (number | bigint)[]) =>
      parts.forEach(part => {
        if (typeof part === 'bigint') {
          groups.push(part >> 16n, part & 0xffffn);
        } else {
          groups.push(BigInt(part));
        }
      });
    expand(head);
    if (halves.length === 2) {
      for (let i = 0; i < 8 - groupCount; i++) {
        groups.push(0n);
      }
    }
    expand(tail);

    return groups.reduce((value, group) => (value << 16n) + group, 0n);
  }

  /**
   * Parses colon separated IPv6 groups. A dotted quad is returned as a bigint (it occupies two groups),
   * plain groups as numbers. An empty string is no groups.
   */
  private parseIpv6Groups(text: string): (number | bigint)[] | null {
    if (text === '') {
      return [];
    }
    const groups: (number | bigint)[] = [];
    for (const part of text.split(':')) {
      if (IPV6_GROUP.test(part)) {
        groups.push(parseInt(part, 16));
      } else if (part.includes('.')) {
        const ipv4 = this.parseIpv4(part);
        if (ipv4 === null) {
          return null;
        }
        groups.push(ipv4);
      } else {
        return null;
      }
    }
    return groups;
  }
}

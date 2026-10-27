/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Internal, parked until custom field types exist. The IP-only reasons a condition is rejected, next to the built-in
 * `ClrAdvancedFilterValidationError` codes.
 */
export enum IpAddressFilterValidationError {
  /**
   * Not an IPv4 or IPv6 address, for EQUALS and BETWEEN.
   */
  INVALID_IP = 'invalidIp',
  /**
   * Not in CIDR notation, for IN_SUBNET.
   */
  INVALID_CIDR = 'invalidCidr',
}

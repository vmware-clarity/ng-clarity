/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Internal, parked until custom field types exist. The operators an IP address field will offer, in display order,
 * with their English labels. 'inSubnet' is not a built-in ClrAdvancedFilterOperator: custom operators are designed
 * together with custom field types.
 */
export const IP_ADDRESS_OPERATORS = [
  { operator: 'equals', label: 'Equal to' },
  { operator: 'between', label: 'Range' },
  { operator: 'inSubnet', label: 'All in a subnet' },
  { operator: 'startsWith', label: 'Starts with' },
  { operator: 'contains', label: 'Contains' },
  { operator: 'isEmpty', label: 'Is empty' },
] as const;

export type IpAddressFilterOperator = (typeof IP_ADDRESS_OPERATORS)[number]['operator'];

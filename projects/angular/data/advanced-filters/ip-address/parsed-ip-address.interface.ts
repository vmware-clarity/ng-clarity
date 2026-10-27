/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Internal. A parsed IP address, only used to validate input (format, range order, family). Never stored: the tree
 * keeps the text as typed.
 */
export interface ParsedIpAddress {
  family: 4 | 6;
  value: bigint;
}

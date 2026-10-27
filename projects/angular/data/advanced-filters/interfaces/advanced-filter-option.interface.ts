/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * An option of an ENUM field.
 */
export interface ClrAdvancedFilterOption {
  /**
   * What an IN filter stores in its value.
   */
  value: string | number;
  /**
   * What the user sees.
   */
  label: string;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * The type of a filterable field. It decides which operators are offered, which value editor is shown and how the
 * value is validated.
 *
 * Later phases add a dynamic (entity) list type, and custom types (an IP address type is the first planned one) that
 * bring their own operators, validator and editor.
 */
export enum ClrAdvancedFilterFieldType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  /**
   * A static list to pick from, given by `ClrAdvancedFilterField.options`.
   */
  ENUM = 'enum',
}

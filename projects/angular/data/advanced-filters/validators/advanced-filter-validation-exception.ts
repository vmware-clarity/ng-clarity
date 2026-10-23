/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAdvancedFilterValidationError } from '../enums/advanced-filter-validation-error.enum';

/**
 * Thrown by `ClrAdvancedFilter` when an operator or a value does not pass the field's validator. Nothing has changed
 * then. `code` is what the validator returned, so callers can react to it without parsing the message.
 */
export class ClrAdvancedFilterValidationException extends Error {
  override readonly name = 'ClrAdvancedFilterValidationException';

  constructor(
    message: string,
    readonly code: ClrAdvancedFilterValidationError
  ) {
    super(message);
  }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

/**
 * Internal. Gives a value control the code the field's validator returned for the whole condition, so Clarity shows
 * the error state on the control once it is touched.
 */
@Directive({
  selector: '[clrAdvancedFiltersError]',
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => ClrAdvancedFiltersError), multi: true }],
  standalone: false,
})
export class ClrAdvancedFiltersError implements Validator {
  private code: string | null = null;
  private onValidatorChange: (() => void) | undefined;

  @Input('clrAdvancedFiltersError')
  set error(code: string | null) {
    if (code !== this.code) {
      this.code = code;
      this.onValidatorChange?.();
    }
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    return this.code ? { [this.code]: true } : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}

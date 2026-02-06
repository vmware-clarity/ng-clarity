/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, forwardRef, Input, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'input[type=radio][clrDgSingleSelectionRadio]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ClrDatagridSingleSelectionValueAccessor),
      multi: true,
    },
  ],
  host: {
    '(change)': 'onChange(value)',
    '(blur)': 'onTouched()',
  },
})
export class ClrDatagridSingleSelectionValueAccessor implements ControlValueAccessor {
  @Input() value;
  @Input() clrDgIdentityFn!: (value: any) => unknown;

  private state: any;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef<HTMLInputElement>
  ) {}

  onChange: (value: any) => void = () => {};

  onTouched: () => void = () => {};

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  writeValue(value: any): void {
    this.state = value;
    this.updateChecked();
  }

  private keyOf(value: any): unknown {
    if (value && this.clrDgIdentityFn) {
      return this.clrDgIdentityFn(value);
    }
    return value;
  }

  private updateChecked(): void {
    const state = this.keyOf(this.state);
    const value = this.keyOf(this.value);
    this.renderer.setProperty(this.elementRef.nativeElement, 'checked', state === value);
  }
}

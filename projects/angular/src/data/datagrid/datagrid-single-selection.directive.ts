/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, forwardRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
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
  standalone: false,
})
export class ClrDatagridSingleSelectionValueAccessor implements ControlValueAccessor, OnChanges {
  @Input() value: any;
  @Input() clrDgIdentityFn!: (value: any) => unknown;

  private model: any;
  private disabled = false;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngOnChanges(_: SimpleChanges): void {
    this.updateChecked();
  }

  writeValue(value: any): void {
    this.model = value;
    this.updateChecked();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (!this.el.nativeElement.hasAttribute('disabled')) {
      this.el.nativeElement.disabled = isDisabled;
    }
  }

  @HostListener('change')
  _onHostChange(): void {
    if (this.disabled) {
      return;
    }
    this.onChange(this.value);
  }

  @HostListener('blur')
  _onHostBlur(): void {
    this.onTouched();
  }

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  private keyOf = (value: any): unknown => {
    if (value && this.clrDgIdentityFn) {
      return this.clrDgIdentityFn(value);
    }
    return value;
  };

  private updateChecked(): void {
    const input = this.el.nativeElement;
    const model = this.keyOf(this.model);
    const value = this.keyOf(this.value);
    input.checked = model === value;
  }
}

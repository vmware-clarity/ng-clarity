/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { clearFiles, selectFiles } from './file-input.helpers';

@Directive({
  selector: 'input[type="file"][clrFileInput]',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: ClrFileInputValueAccessor, multi: true }],
  standalone: false,
})
export class ClrFileInputValueAccessor implements ControlValueAccessor {
  constructor(private readonly elementRef: ElementRef<HTMLInputElement>) {}

  writeValue(value: FileList) {
    if (value !== undefined && value !== null && !(value instanceof FileList)) {
      throw new Error('The value of a file input control must be a FileList.');
    }

    if (value) {
      selectFiles(this.elementRef.nativeElement, value);
    } else if (this.elementRef.nativeElement.files.length) {
      clearFiles(this.elementRef.nativeElement);
    }
  }

  registerOnChange(fn: (value: FileList) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  @HostListener('change')
  private handleChange() {
    this.onTouched();
    this.onChange(this.elementRef.nativeElement.files);
  }

  private onChange = (_value: FileList) => {};

  private onTouched = () => {};
}

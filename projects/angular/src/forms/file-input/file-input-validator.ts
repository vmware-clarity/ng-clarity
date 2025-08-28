/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

import { ClrFileListValidationErrors } from './file-input-validator-errors';

@Directive({
  selector: 'input[type="file"][clrFileInput]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ClrFileInputValidator, multi: true }],
  standalone: false,
})
export class ClrFileInputValidator implements Validator {
  @Input('clrMinFileSize') minFileSize: number;
  @Input('clrMaxFileSize') maxFileSize: number;

  constructor(private readonly elementRef: ElementRef<HTMLInputElement>) {}

  validate(control: AbstractControl<FileList>): ValidationErrors {
    const files = control.value;
    const fileInputElement = this.elementRef.nativeElement;

    const errors: ClrFileListValidationErrors = {};

    // required validation (native attribute)
    if (fileInputElement.required && files?.length === 0) {
      errors.required = true;
    }

    const accept = fileInputElement.accept ? fileInputElement.accept.split(',').map(type => type.trim()) : null;

    if (files?.length > 0 && (accept || this.minFileSize || this.maxFileSize)) {
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);

        // accept validation (native attribute)
        if (accept) {
          const [fileExtension] = file.name.match(/\..+$/);

          if (!accept.includes(file.type) && !accept.includes(fileExtension)) {
            errors.accept = errors.accept || [];
            errors.accept.push({ name: file.name, accept, type: file.type, extension: fileExtension });
          }
        }

        // min file validation (custom input)
        if (this.minFileSize && file.size < this.minFileSize) {
          errors.minFileSize = errors.minFileSize || [];
          errors.minFileSize.push({ name: file.name, minFileSize: this.minFileSize, actualFileSize: file.size });
        }

        // max file validation (custom input)
        if (this.maxFileSize && file.size > this.maxFileSize) {
          errors.maxFileSize = errors.maxFileSize || [];
          errors.maxFileSize.push({ name: file.name, maxFileSize: this.maxFileSize, actualFileSize: file.size });
        }
      }
    }

    return Object.keys(errors).length ? errors : null;
  }
}

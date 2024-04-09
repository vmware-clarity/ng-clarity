/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, Input } from '@angular/core';
import { NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: 'input[type="file"][clrFileInput]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ClrFileInputValidator, multi: true }],
})
export class ClrFileInputValidator implements Validator {
  @Input('clrMinFileSize') minFileSize: number;
  @Input('clrMaxFileSize') maxFileSize: number;

  constructor(private readonly elementRef: ElementRef<HTMLInputElement>) {}

  validate(): ValidationErrors {
    const fileInputElement = this.elementRef.nativeElement;
    const files = fileInputElement.files;

    const errors: ValidationErrors = {};

    // required validation (native attribute)
    if (fileInputElement.required && files.length === 0) {
      errors.required = true;
    }

    // accept validation (native attribute)
    if (fileInputElement.accept && files.length > 0) {
      const accept = fileInputElement.accept.split(',').map(type => type.trim());

      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        const [fileExtension] = file.name.match(/\..+$/);

        if (!accept.includes(file.type) && !accept.includes(fileExtension)) {
          errors.accept = errors.accept || [];
          errors.accept.push({ name: file.name, accept, type: file.type, extension: fileExtension });
        }
      }
    }

    // min file validation (custom input)
    if (this.minFileSize && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);

        if (file.size < this.minFileSize) {
          errors.minFileSize = errors.minFileSize || [];
          errors.minFileSize.push({ name: file.name, minFileSize: this.minFileSize, actualFileSize: file.size });
        }
      }
    }

    // max file validation (custom input)
    if (this.maxFileSize && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);

        if (file.size > this.maxFileSize) {
          errors.maxFileSize = errors.maxFileSize || [];
          errors.maxFileSize.push({ name: file.name, maxFileSize: this.maxFileSize, actualFileSize: file.size });
        }
      }
    }

    return Object.keys(errors).length ? errors : null;
  }
}

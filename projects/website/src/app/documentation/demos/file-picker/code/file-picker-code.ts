/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { FilePickerCodeAdvancedExample } from './advanced-example/file-picker-code-advanced-example';
import { FilePickerCodeBasicExample } from './basic-example/file-picker-code-basic-example';
import { FilePickerCodeCustomButtonLabelExample } from './custom-button-label-example/file-picker-code-custom-button-label-example';
import { FilePickerCodeDisabledExample } from './disabled-example/file-picker-code-disabled-example';
import { FilePickerCodeValidationExample } from './validation-example/file-picker-code-validation-example';
import { FilePickerCodeValueAccessorExample } from './value-accessor-example/file-picker-code-value-accessor-example';

@Component({
  selector: 'app-file-picker-code',
  templateUrl: './file-picker-code.html',
  imports: [
    FilePickerCodeBasicExample,
    FilePickerCodeDisabledExample,
    FilePickerCodeValidationExample,
    FilePickerCodeValueAccessorExample,
    FilePickerCodeCustomButtonLabelExample,
    FilePickerCodeAdvancedExample,
  ],
})
export class FilePickerCode {}

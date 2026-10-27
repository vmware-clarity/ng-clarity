/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClrFileInputModule } from '@clr/angular';

@Component({
  selector: 'clr-file-picker-disabled-example',
  templateUrl: './disabled.example.html',
  imports: [ReactiveFormsModule, ClrFileInputModule],
})
export class FilePickerDisabledExample {
  protected readonly form = new FormGroup({
    file: new FormControl<FileList | null>(null),
  });
}

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
  selector: 'clr-file-picker-basic-example',
  templateUrl: './basic.example.html',
  imports: [ReactiveFormsModule, ClrFileInputModule],
})
export class FilePickerBasicExample {
  protected readonly form = new FormGroup({
    files: new FormControl<FileList | null>(null),
  });
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClrFileInputModule } from '@clr/angular';

@Component({
  selector: 'clr-file-picker-value-accessor-example',
  templateUrl: './value-accessor.example.html',
  imports: [JsonPipe, ReactiveFormsModule, ClrFileInputModule],
})
export class FilePickerValueAccessorExample {
  protected readonly form = new FormGroup({
    files: new FormControl<FileList | null>(null),
  });

  protected get files() {
    if (this.form.controls.files.value) {
      return Array.from(this.form.controls.files.value).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));
    }

    return null;
  }
}

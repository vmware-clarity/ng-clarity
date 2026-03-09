/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClrCommonFormsModule, ClrFileInputModule } from '@clr/angular';

@Component({
  selector: 'app-file-picker-overview-layouts',
  templateUrl: './file-picker-overview-layouts.html',
  imports: [RouterLink, FormsModule, ClrCommonFormsModule, ReactiveFormsModule, ClrFileInputModule],
})
export class FilePickerOverviewLayouts {
  protected readonly verticalForm = new FormGroup({
    file: new FormControl<FileList | null>(null),
  });

  protected readonly horizontalForm = new FormGroup({
    file: new FormControl<FileList | null>(null),
  });

  protected readonly compactForm = new FormGroup({
    file: new FormControl<FileList | null>(null),
  });
}

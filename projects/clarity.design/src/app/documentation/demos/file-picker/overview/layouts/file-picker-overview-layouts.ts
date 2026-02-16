/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-file-picker-overview-layouts',
  templateUrl: './file-picker-overview-layouts.html',
  standalone: false,
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

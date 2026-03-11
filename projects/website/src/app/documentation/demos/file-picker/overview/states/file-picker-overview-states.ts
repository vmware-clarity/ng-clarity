/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrCommonFormsModule, ClrFileInputModule } from '@clr/angular';

import { clearFiles, selectFiles } from '../file-picker.helpers';

@Component({
  selector: 'app-file-picker-overview-states',
  templateUrl: './file-picker-overview-states.html',
  imports: [FormsModule, ClrCommonFormsModule, ReactiveFormsModule, ClrFileInputModule],
})
export class FilePickerOverviewStates implements AfterViewInit {
  protected readonly form = new FormGroup({
    enabled: new FormControl<FileList | null>(null),
    active: new FormControl<FileList | null>(null),
    disabled: new FormControl<FileList | null>(null),
    error: new FormControl<FileList | null>(null),
    success: new FormControl<FileList | null>(null),
  });

  private readonly errorStateFileInputElementRef = viewChild<ElementRef<HTMLInputElement>>('errorStateFileInput');
  private readonly successStateFileInputElementRef = viewChild<ElementRef<HTMLInputElement>>('successStateFileInput');

  ngAfterViewInit() {
    const errorStateFileInputElementRef = this.errorStateFileInputElementRef();
    if (errorStateFileInputElementRef) {
      clearFiles(errorStateFileInputElementRef.nativeElement);
    }

    const successStateFileInputElementRef = this.successStateFileInputElementRef();
    if (successStateFileInputElementRef) {
      selectFiles(successStateFileInputElementRef.nativeElement, [new File([''], 'filename.txt')]);
    }
  }
}

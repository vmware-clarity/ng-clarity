/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { clearFiles, selectFiles } from '../file-picker.helpers';

@Component({
  selector: 'app-file-picker-overview-states',
  templateUrl: './file-picker-overview-states.html',
  standalone: false,
})
export class FilePickerOverviewStates implements AfterViewInit {
  protected readonly form = new FormGroup({
    enabled: new FormControl<FileList | null>(null),
    active: new FormControl<FileList | null>(null),
    disabled: new FormControl<FileList | null>(null),
    error: new FormControl<FileList | null>(null),
    success: new FormControl<FileList | null>(null),
  });

  @ViewChild('errorStateFileInput') private readonly errorStateFileInputElementRef:
    | ElementRef<HTMLInputElement>
    | undefined;
  @ViewChild('successStateFileInput') private readonly successStateFileInputElementRef:
    | ElementRef<HTMLInputElement>
    | undefined;

  ngAfterViewInit() {
    if (this.errorStateFileInputElementRef) {
      clearFiles(this.errorStateFileInputElementRef.nativeElement);
    }

    if (this.successStateFileInputElementRef) {
      selectFiles(this.successStateFileInputElementRef.nativeElement, [new File([''], 'filename.txt')]);
    }
  }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { LinkCardsLink } from '../../../../../shared/link-cards/link-cards.component';
import { formsPatternLink } from '../../../pattern-links';
import { selectFiles } from '../file-picker.helpers';

@Component({
  selector: 'app-file-picker-overview-usage',
  templateUrl: './file-picker-overview-usage.html',
  styleUrl: './file-picker-overview-usage.scss',
  standalone: false,
})
export class FilePickerOverviewUsage implements AfterViewInit {
  readonly patternLinks: LinkCardsLink[] = [formsPatternLink];

  protected readonly form = new FormGroup({
    singleFile: new FormControl<FileList | null>(null),
    multipleFiles: new FormControl<FileList | null>(null),
  });

  @ViewChild('singleFileInput') private readonly singleFileInputElementRef: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('multipleFilesInput') private readonly multipleFilesElementRef: ElementRef<HTMLInputElement> | undefined;

  ngAfterViewInit() {
    if (this.singleFileInputElementRef) {
      selectFiles(this.singleFileInputElementRef.nativeElement, [new File([''], 'filename.txt')]);
    }

    if (this.multipleFilesElementRef) {
      selectFiles(this.multipleFilesElementRef.nativeElement, [
        new File([''], 'file-1.txt'),
        new File([''], 'file-2.txt'),
        new File([''], 'file-3.txt'),
      ]);
    }
  }
}

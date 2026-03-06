/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrCommonFormsModule, ClrFileInputModule } from '@clr/angular';

import { LinkCardsComponent, LinkCardsLink } from '../../../../../shared/link-cards/link-cards.component';
import { formsPatternLink } from '../../../pattern-links';
import { selectFiles } from '../file-picker.helpers';

@Component({
  selector: 'app-file-picker-overview-usage',
  templateUrl: './file-picker-overview-usage.html',
  styleUrl: './file-picker-overview-usage.scss',
  imports: [FormsModule, ClrCommonFormsModule, ReactiveFormsModule, ClrFileInputModule, LinkCardsComponent],
})
export class FilePickerOverviewUsage implements AfterViewInit {
  readonly patternLinks: LinkCardsLink[] = [formsPatternLink];

  protected readonly form = new FormGroup({
    singleFile: new FormControl<FileList | null>(null),
    multipleFiles: new FormControl<FileList | null>(null),
  });

  private readonly singleFileInputElementRef = viewChild<ElementRef<HTMLInputElement>>('singleFileInput');
  private readonly multipleFilesElementRef = viewChild<ElementRef<HTMLInputElement>>('multipleFilesInput');

  ngAfterViewInit() {
    const singleFileInputElementRef = this.singleFileInputElementRef();
    if (singleFileInputElementRef) {
      selectFiles(singleFileInputElementRef.nativeElement, [new File([''], 'filename.txt')]);
    }

    const multipleFilesElementRef = this.multipleFilesElementRef();
    if (multipleFilesElementRef) {
      selectFiles(multipleFilesElementRef.nativeElement, [
        new File([''], 'file-1.txt'),
        new File([''], 'file-2.txt'),
        new File([''], 'file-3.txt'),
      ]);
    }
  }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Injector,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { ClrCommonStringsService } from '../../utils';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrFileInputContainer } from './file-input-container';

export interface ClrFileInputSelection {
  fileCount: number;
  buttonLabel: string;
  clearFilesButtonLabel: string;
}

@Directive({
  selector: 'input[type="file"][clrFileInput]',
  host: {
    tabindex: '-1', // Remove the hidden file `input` element from the tab order because the browse `button` replaces it.
    'aria-hidden': 'true', // Remove the hidden file `input` element from the accessibility tree because the browse `button` replaces it.
    '[class.clr-file-input]': 'true',
  },
})
export class ClrFileInput extends WrappedFormControl<ClrFileInputContainer> {
  selection: ClrFileInputSelection = undefined;

  constructor(
    injector: Injector,
    renderer: Renderer2,
    viewContainerRef: ViewContainerRef,
    readonly elementRef: ElementRef<HTMLInputElement>,
    @Self() @Optional() private readonly control: NgControl,
    private readonly commonStrings: ClrCommonStringsService
  ) {
    super(viewContainerRef, ClrFileInputContainer, injector, control, renderer, elementRef);
  }

  @HostBinding('disabled')
  protected get disabled() {
    return this.elementRef.nativeElement.disabled || (this.control && this.control.disabled);
  }

  @HostListener('change')
  private handleChange() {
    this.updateSelection();
  }

  private updateSelection() {
    const files = this.elementRef.nativeElement.files;
    let selectionButtonLabel: string;
    let clearFilesButtonLabel: string;

    if (files?.length === 1) {
      const filename = files[0].name;

      selectionButtonLabel = filename;

      clearFilesButtonLabel = this.commonStrings.parse(this.commonStrings.keys.clearFile, {
        FILE: filename,
      });
    } else if (files?.length > 1) {
      const fileCount = files.length.toString();

      selectionButtonLabel = this.commonStrings.parse(this.commonStrings.keys.fileCount, {
        COUNT: fileCount,
      });

      clearFilesButtonLabel = this.commonStrings.parse(this.commonStrings.keys.clearFiles, {
        COUNT: fileCount,
      });
    }

    this.selection = {
      fileCount: files.length,
      buttonLabel: selectionButtonLabel,
      clearFilesButtonLabel,
    };
  }
}

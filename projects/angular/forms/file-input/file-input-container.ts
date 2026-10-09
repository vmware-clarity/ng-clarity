/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, ElementRef, forwardRef, inject, Input, ViewChild } from '@angular/core';
import {
  ClrAbstractContainer,
  ControlClassService,
  ControlIdService,
  NgControlService,
} from '@clr/angular/forms/common';
import {
  ClrCommonStringsService,
  clrContextText,
  clrNormalizeContextText,
  clrPublishElementContext,
} from '@clr/angular/utils';

import { ClrFileInput } from './file-input';
import { selectFiles } from './file-input.helpers';
import { ClrFileList } from './file-list';
import { ClrFileError, ClrFileSuccess } from './file-messages';

@Component({
  selector: 'clr-file-input-container',
  template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <!-- The browse button is labelled with the chosen file's name, which is what the user entered. -->
      <div class="clr-file-input-wrapper" data-clr-context-redact>
        <ng-content select="[clrFileInput]"></ng-content>

        <!-- file input to handle adding new files to selection when file list is present (prevent replacing selected files on the main file input) -->
        @if (fileList) {
          <input
            #fileListFileInput
            type="file"
            class="clr-file-input"
            tabindex="-1"
            aria-hidden="true"
            [accept]="accept"
            [multiple]="multiple"
            [disabled]="disabled"
            (change)="addFilesToSelection(fileListFileInput.files)"
          />
        }

        <button
          #browseButton
          type="button"
          class="btn btn-sm clr-file-input-browse-button"
          [attr.aria-describedby]="browseButtonDescribedBy"
          [disabled]="disabled"
          (click)="browse()"
        >
          <cds-icon shape="folder-open"></cds-icon>
          <span class="clr-file-input-browse-button-text">{{ browseButtonText }}</span>
        </button>
        @if (!fileList && fileInput?.selection?.fileCount) {
          <button
            type="button"
            class="btn btn-sm clr-file-input-clear-button"
            data-clr-context-ignore
            [attr.aria-label]="fileInput?.selection?.clearFilesButtonLabel"
            (click)="clearSelectedFiles()"
          >
            <cds-icon shape="times" status="neutral"></cds-icon>
          </button>
        }
      </div>
      @if (showHelper) {
        <ng-content select="clr-control-helper"></ng-content>
      }
      @if (showInvalid) {
        <ng-content select="clr-control-error"></ng-content>
      }
      @if (showValid) {
        <ng-content select="clr-control-success"></ng-content>
      }

      <!-- If this is present, this file input becomes an "advanced" file input. -->
      <ng-container>
        <div class="clr-file-list-break"></div>
        <ng-content select="clr-file-list"></ng-content>
      </ng-container>
    </div>
  `,
  host: {
    '[class.clr-form-control]': 'true',
    '[class.clr-form-control-disabled]': 'disabled',
    '[class.clr-row]': 'addGrid()',
  },
  providers: [NgControlService, ControlIdService, ControlClassService],
  standalone: false,
})
export class ClrFileInputContainer extends ClrAbstractContainer {
  @Input('clrButtonLabel') customButtonLabel: string;

  @ContentChild(forwardRef(() => ClrFileInput)) readonly fileInput: ClrFileInput;
  @ContentChild(forwardRef(() => ClrFileList)) protected readonly fileList: ClrFileList;

  @ViewChild('browseButton') private browseButtonElementRef: ElementRef<HTMLButtonElement>;
  @ViewChild('fileListFileInput') private fileListFileInputElementRef: ElementRef<HTMLInputElement>;

  // These are for the "message present" override properties
  @ContentChild(ClrFileSuccess) private readonly fileSuccessComponent: ClrFileSuccess;
  @ContentChild(ClrFileError) private readonly fileErrorComponent: ClrFileError;

  private readonly commonStrings = inject(ClrCommonStringsService);
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);

  // The chosen files' names are what the user entered, so only their count is published,
  // and only to the application's own tooling. The file list is left out of the snapshot
  // (see `ClrFileList`); the helper, error and success text are kept.
  private readonly teardownElementContext = clrPublishElementContext(this.hostElement.nativeElement, () => {
    const state: Record<string, unknown> = {
      fileCount: this.fileInput?.elementRef.nativeElement.files?.length ?? 0,
      redacted: true,
    };
    if (this.fileInput && this.disabled) {
      state.disabled = true;
    }
    const label = this.hostElement.nativeElement.querySelector(':scope > label');
    return {
      type: 'clr-file-input-container',
      element: 'clr-file-input-container',
      label: label ? clrNormalizeContextText(clrContextText(label), false) : '',
      state,
    };
  });

  protected get accept() {
    return this.fileInput.elementRef.nativeElement.accept;
  }

  protected get multiple() {
    return this.fileInput.elementRef.nativeElement.multiple;
  }

  protected get disabled() {
    return this.control ? this.control.disabled : this.fileInput.elementRef.nativeElement.disabled;
  }

  protected get browseButtonText() {
    const selectionButtonLabel = this.fileList ? undefined : this.fileInput?.selection?.buttonLabel;

    return selectionButtonLabel || this.customButtonLabel || this.commonStrings.keys.browse;
  }

  protected get browseButtonDescribedBy() {
    return `${this.label?.forAttr} ${this.fileInput.elementRef.nativeElement.getAttribute('aria-describedby')}`;
  }

  protected override get successMessagePresent() {
    return super.successMessagePresent || !!this.fileSuccessComponent;
  }

  protected override get errorMessagePresent() {
    return super.errorMessagePresent || !!this.fileErrorComponent;
  }

  override ngOnDestroy() {
    this.teardownElementContext();
    super.ngOnDestroy();
  }

  focusBrowseButton() {
    this.browseButtonElementRef.nativeElement.focus();
  }

  protected browse() {
    const fileInputElementRef =
      this.fileList && this.multiple ? this.fileListFileInputElementRef : this.fileInput.elementRef;

    fileInputElementRef.nativeElement.click();
  }

  protected clearSelectedFiles() {
    this.fileInput.elementRef.nativeElement.value = '';
    this.fileInput.elementRef.nativeElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

    this.focusBrowseButton();
  }

  protected addFilesToSelection(newFiles: FileList) {
    if (!newFiles.length) {
      return;
    }

    // start with new files
    const mergedFiles = [...newFiles];

    // add existing files if a new file doesn't have the same name
    for (const existingFile of this.fileInput.elementRef.nativeElement.files) {
      if (!mergedFiles.some(file => file.name === existingFile.name)) {
        mergedFiles.push(existingFile);
      }
    }

    // update file selection
    selectFiles(this.fileInput.elementRef.nativeElement, mergedFiles);
  }
}

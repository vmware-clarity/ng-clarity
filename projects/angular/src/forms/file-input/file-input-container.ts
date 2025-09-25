/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, ElementRef, forwardRef, inject, Input, ViewChild } from '@angular/core';

import { ClrFileInput } from './file-input';
import { selectFiles } from './file-input.helpers';
import { ClrFileList } from './file-list';
import { ClrFileError, ClrFileSuccess } from './file-messages';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { NgControlService } from '../common/providers/ng-control.service';

@Component({
  selector: 'clr-file-input-container',
  template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-file-input-wrapper">
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
            [attr.aria-label]="fileInput?.selection?.clearFilesButtonLabel"
            (click)="clearSelectedFiles()"
          >
            <cds-icon shape="times" status="neutral"></cds-icon>
          </button>
        }
        @if (showInvalid) {
          <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger" aria-hidden="true"></cds-icon>
        }
        @if (showValid) {
          <cds-icon class="clr-validate-icon" shape="check-circle" status="success" aria-hidden="true"></cds-icon>
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
  providers: [IfControlStateService, NgControlService, ControlIdService, ControlClassService],
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

  protected get accept() {
    return this.fileInput.elementRef.nativeElement.accept;
  }

  protected get multiple() {
    return this.fileInput.elementRef.nativeElement.multiple;
  }

  protected get disabled() {
    return this.fileInput.elementRef.nativeElement.disabled || (this.control && this.control.disabled);
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

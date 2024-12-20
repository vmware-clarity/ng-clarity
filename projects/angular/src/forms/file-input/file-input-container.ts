/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, ElementRef, forwardRef, inject, Input, ViewChild } from '@angular/core';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ClrFileInput } from './file-input';
import { ClrFileList } from './file-list';
import { ClrFileError, ClrFileSuccess } from './file-messages';

@Component({
  selector: 'clr-file-input-container',
  template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-file-input-wrapper">
        <ng-content select="[clrFileInput]"></ng-content>
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
        <button
          *ngIf="!fileList && fileInput?.selection?.fileCount"
          type="button"
          class="btn btn-sm clr-file-input-clear-button"
          [attr.aria-label]="fileInput?.selection?.clearFilesButtonLabel"
          (click)="clearSelectedFiles()"
        >
          <cds-icon shape="times" status="neutral" size="md"></cds-icon>
        </button>
        <cds-icon
          *ngIf="showInvalid"
          class="clr-validate-icon"
          shape="exclamation-circle"
          status="danger"
          aria-hidden="true"
        ></cds-icon>
        <cds-icon
          *ngIf="showValid"
          class="clr-validate-icon"
          shape="check-circle"
          status="success"
          aria-hidden="true"
        ></cds-icon>
      </div>
      <ng-content select="clr-control-helper" *ngIf="showHelper"></ng-content>
      <ng-content select="clr-control-error" *ngIf="showInvalid"></ng-content>
      <ng-content select="clr-control-success" *ngIf="showValid"></ng-content>

      <!-- If this is present, this file input becomes an "advanced" file input. -->
      <ng-container *ngIf="fileList">
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
})
export class ClrFileInputContainer extends ClrAbstractContainer {
  @Input('clrButtonLabel') customButtonLabel: string;

  @ContentChild(forwardRef(() => ClrFileInput)) readonly fileInput: ClrFileInput;
  @ContentChild(forwardRef(() => ClrFileList)) protected readonly fileList: ClrFileList;

  @ViewChild('browseButton') private browseButtonElementRef: ElementRef<HTMLButtonElement>;

  // These are for the "message present" override properties
  @ContentChild(ClrFileSuccess) private readonly fileSuccessComponent: ClrFileSuccess;
  @ContentChild(ClrFileError) private readonly fileErrorComponent: ClrFileError;

  private readonly commonStrings = inject(ClrCommonStringsService);

  protected get disabled() {
    return this.fileInput.elementRef.nativeElement.disabled;
  }

  protected get browseButtonText() {
    const selectionButtonLabel = this.fileList ? undefined : this.fileInput?.selection?.buttonLabel;

    return selectionButtonLabel || this.customButtonLabel || this.commonStrings.keys.browse;
  }

  protected get browseButtonDescribedBy() {
    return `${this.label?.idAttr} ${this.fileInput.elementRef.nativeElement.getAttribute('aria-describedby')}`;
  }

  protected override get successMessagePresent() {
    return super.successMessagePresent || !!this.fileSuccessComponent;
  }

  protected override get errorMessagePresent() {
    return super.errorMessagePresent || !!this.fileErrorComponent;
  }

  protected browse() {
    this.fileInput.elementRef.nativeElement.click();
  }

  protected clearSelectedFiles() {
    this.fileInput.elementRef.nativeElement.value = '';
    this.fileInput.elementRef.nativeElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

    this.browseButtonElementRef.nativeElement.focus();
  }
}

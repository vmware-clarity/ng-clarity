/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, inject, Injector } from '@angular/core';

import { ClrFileInputContainer } from './file-input-container';
import { ClrFileListValidationErrors } from './file-input-validator-errors';
import { selectFiles } from './file-input.helpers';
import { CLR_FILE_MESSAGES_TEMPLATE_CONTEXT } from './file-messages';
import {
  ClrFileMessagesTemplate,
  ClrFileMessagesTemplateContext,
  ClrSingleFileValidationErrors,
} from './file-messages-template';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { NgControlService } from '../common/providers/ng-control.service';

@Component({
  selector: 'clr-file-list',
  template: `
    @for (file of files; track file) {
      @if (createFileMessagesTemplateContext(file); as fileMessagesTemplateContext) {
        <div
          role="listitem"
          class="clr-file-list-item"
          [ngClass]="{
            'clr-error': !fileMessagesTemplateContext.success,
            'clr-success': fileMessagesTemplateContext.success,
          }"
        >
          <div class="clr-file-label-and-status-icon">
            <span class="label clr-file-label">
              {{ file.name }}
              <button
                class="btn btn-sm btn-link-neutral btn-icon clr-file-clear-button"
                [attr.aria-label]="getClearFileLabel(file.name)"
                (click)="clearFile(file)"
              >
                <cds-icon shape="times"></cds-icon>
              </button>
            </span>
            <cds-icon
              class="clr-validate-icon"
              [shape]="fileMessagesTemplateContext.success ? 'check-circle' : 'exclamation-circle'"
              [status]="fileMessagesTemplateContext.success ? 'success' : 'danger'"
              aria-hidden="true"
            ></cds-icon>
          </div>
          @if (fileMessagesTemplate) {
            <ng-container
              [ngTemplateOutlet]="fileMessagesTemplate.templateRef"
              [ngTemplateOutletContext]="fileMessagesTemplateContext"
              [ngTemplateOutletInjector]="createFileMessagesTemplateInjector(fileMessagesTemplateContext)"
            ></ng-container>
          }
        </div>
      }
    }
  `,
  host: {
    '[attr.role]': '"list"',
    '[class.clr-file-list]': 'true',
  },
  standalone: false,
})
export class ClrFileList {
  @ContentChild(ClrFileMessagesTemplate) protected readonly fileMessagesTemplate: ClrFileMessagesTemplate;

  private readonly injector = inject(Injector);
  private readonly commonStrings = inject(ClrCommonStringsService);
  private readonly ngControlService = inject(NgControlService, { optional: true });
  private readonly fileInputContainer = inject(ClrFileInputContainer, { optional: true });

  constructor() {
    if (!this.ngControlService || !this.fileInputContainer) {
      throw new Error('The clr-file-list component can only be used within a clr-file-input-container.');
    }
  }

  protected get files() {
    if (!this.fileInputContainer.fileInput) {
      return [];
    }

    const fileInputElement = this.fileInputContainer.fileInput.elementRef.nativeElement;

    return Array.from(fileInputElement.files).sort((a, b) => a.name.localeCompare(b.name));
  }

  protected getClearFileLabel(filename: string) {
    return this.commonStrings.parse(this.commonStrings.keys.clearFile, {
      FILE: filename,
    });
  }

  protected clearFile(fileToRemove: File) {
    if (!this.fileInputContainer.fileInput) {
      return;
    }

    const fileInputElement = this.fileInputContainer.fileInput.elementRef.nativeElement;
    const files = Array.from(fileInputElement.files);
    const newFiles = files.filter(file => file !== fileToRemove);

    selectFiles(fileInputElement, newFiles);
    this.fileInputContainer.focusBrowseButton();
  }

  protected createFileMessagesTemplateContext(file: File): ClrFileMessagesTemplateContext {
    const fileInputErrors: ClrFileListValidationErrors = this.ngControlService.control.errors || {};

    const errors: ClrSingleFileValidationErrors = {
      accept: fileInputErrors.accept?.find(error => error.name === file.name),
      minFileSize: fileInputErrors.minFileSize?.find(error => error.name === file.name),
      maxFileSize: fileInputErrors.maxFileSize?.find(error => error.name === file.name),
    };

    const success = Object.values(errors).every(error => !error);

    return { $implicit: file, success, errors };
  }

  protected createFileMessagesTemplateInjector(fileMessagesTemplateContext: ClrFileMessagesTemplateContext) {
    return Injector.create({
      parent: this.injector,
      providers: [{ provide: CLR_FILE_MESSAGES_TEMPLATE_CONTEXT, useValue: fileMessagesTemplateContext }],
    });
  }
}

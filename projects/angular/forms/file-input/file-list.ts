/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, inject, Injector } from '@angular/core';
import { NgControlService } from '@clr/angular/forms/common';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { ClrFileInputContainer } from './file-input-container';
import { ClrFileListValidationErrors } from './file-input-validator-errors';
import { selectFiles } from './file-input.helpers';
import { CLR_FILE_MESSAGES_TEMPLATE_CONTEXT } from './file-messages';
import {
  ClrFileMessagesTemplate,
  ClrFileMessagesTemplateContext,
  ClrSingleFileValidationErrors,
} from './file-messages-template';

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
          </div>
          @if (fileMessagesTemplate) {
            <div class="clr-control-subtext-container">
              <ng-container
                [ngTemplateOutlet]="fileMessagesTemplate.templateRef"
                [ngTemplateOutletContext]="fileMessagesTemplateContext"
                [ngTemplateOutletInjector]="injectorCache.get(file)"
              ></ng-container>
            </div>
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

  protected injectorCache = new Map<File, Injector>();
  private contextCache = new Map<File, ClrFileMessagesTemplateContext>();

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
    const fileInputErrors: ClrFileListValidationErrors = this.ngControlService.controls[0].errors || {};

    const errors: ClrSingleFileValidationErrors = {
      accept: fileInputErrors.accept?.find(error => error.name === file.name),
      minFileSize: fileInputErrors.minFileSize?.find(error => error.name === file.name),
      maxFileSize: fileInputErrors.maxFileSize?.find(error => error.name === file.name),
    };

    const success = Object.values(errors).every(error => !error);

    const cached = this.contextCache.get(file);
    if (cached && cached.success === success && this.errorsEqual(cached.errors, errors)) {
      return cached;
    }

    // new context is made and old reference replaced
    const context: ClrFileMessagesTemplateContext = { $implicit: file, success, errors };
    this.contextCache.set(file, context);

    // new injector is made and old reference replaced
    const injector = this.createFileMessagesTemplateInjector(context);
    this.injectorCache.set(file, injector);

    return context;
  }

  private createFileMessagesTemplateInjector(fileMessagesTemplateContext: ClrFileMessagesTemplateContext) {
    return Injector.create({
      parent: this.injector,
      providers: [{ provide: CLR_FILE_MESSAGES_TEMPLATE_CONTEXT, useValue: fileMessagesTemplateContext }],
    });
  }

  private errorsEqual(a: ClrSingleFileValidationErrors, b: ClrSingleFileValidationErrors): boolean {
    return a.accept === b.accept && a.minFileSize === b.minFileSize && a.maxFileSize === b.maxFileSize;
  }
}

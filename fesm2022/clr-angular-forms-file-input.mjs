import * as i0 from '@angular/core';
import { InjectionToken, Component, inject, TemplateRef, Directive, Injector, ContentChild, ViewChild, forwardRef, Input, HostListener, HostBinding, Self, Optional, NgModule } from '@angular/core';
import * as i3 from '@clr/angular/forms/common';
import { NgControlService, ClrAbstractContainer, ControlIdService, ControlClassService, WrappedFormControl, ClrCommonFormsModule } from '@clr/angular/forms/common';
import * as i2 from '@clr/angular/utils';
import { ClrCommonStringsService } from '@clr/angular/utils';
import * as i1 from '@clr/angular/icon';
import { ClarityIcons, folderOpenIcon, successStandardIcon, errorStandardIcon, ClrIcon } from '@clr/angular/icon';
import * as i1$1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i1$2 from '@angular/forms';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function buildFileList(files) {
    const dataTransfer = new DataTransfer();
    for (const file of files) {
        dataTransfer.items.add(file);
    }
    return dataTransfer.files;
}
function selectFiles(fileInputElement, files) {
    fileInputElement.files = files instanceof FileList ? files : buildFileList(files);
    fileInputElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
}
function clearFiles(fileInputElement) {
    fileInputElement.value = '';
    fileInputElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_FILE_MESSAGES_TEMPLATE_CONTEXT = new InjectionToken('ClrFileMessagesTemplateContext');
class ClrFileInfo {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileInfo, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrFileInfo, isStandalone: false, selector: "clr-file-info", host: { properties: { "class.clr-subtext-wrapper": "true" } }, ngImport: i0, template: `
    <span class="clr-subtext">
      <ng-content></ng-content>
    </span>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileInfo, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-file-info',
                    template: `
    <span class="clr-subtext">
      <ng-content></ng-content>
    </span>
  `,
                    host: {
                        '[class.clr-subtext-wrapper]': 'true',
                    },
                    standalone: false,
                }]
        }] });
class ClrFileSuccess {
    constructor() {
        this.context = inject(CLR_FILE_MESSAGES_TEMPLATE_CONTEXT);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileSuccess, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrFileSuccess, isStandalone: false, selector: "clr-file-success", host: { properties: { "style.display": "context.success ? \"flex\" : \"none\"", "class.clr-subtext-wrapper": "true", "class.success": "true" } }, ngImport: i0, template: `
    @if (context.success) {
      <cds-icon class="clr-validate-icon" shape="success-standard" status="success" aria-hidden="true"></cds-icon>
      <span class="clr-subtext">
        <ng-content></ng-content>
      </span>
    }
  `, isInline: true, dependencies: [{ kind: "component", type: i1.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileSuccess, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-file-success',
                    // We check for success here so that consumers don't have to.
                    template: `
    @if (context.success) {
      <cds-icon class="clr-validate-icon" shape="success-standard" status="success" aria-hidden="true"></cds-icon>
      <span class="clr-subtext">
        <ng-content></ng-content>
      </span>
    }
  `,
                    host: {
                        '[style.display]': 'context.success ? "flex" : "none"',
                        '[class.clr-subtext-wrapper]': 'true',
                        '[class.success]': 'true',
                    },
                    standalone: false,
                }]
        }] });
class ClrFileError {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileError, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrFileError, isStandalone: false, selector: "clr-file-error", host: { properties: { "class.clr-subtext-wrapper": "true", "class.error": "true" } }, ngImport: i0, template: `
    <cds-icon class="clr-validate-icon" shape="error-standard" status="danger" aria-hidden="true"></cds-icon>
    <span class="clr-subtext">
      <ng-content></ng-content>
    </span>
  `, isInline: true, dependencies: [{ kind: "component", type: i1.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileError, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-file-error',
                    // The host should have an `*ngIf` or `@if` that checks for the relevant error.
                    template: `
    <cds-icon class="clr-validate-icon" shape="error-standard" status="danger" aria-hidden="true"></cds-icon>
    <span class="clr-subtext">
      <ng-content></ng-content>
    </span>
  `,
                    host: {
                        '[class.clr-subtext-wrapper]': 'true',
                        '[class.error]': 'true',
                    },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrFileMessagesTemplate {
    constructor() {
        this.templateRef = inject(TemplateRef);
    }
    static ngTemplateContextGuard(directive, context) {
        return true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileMessagesTemplate, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrFileMessagesTemplate, isStandalone: false, selector: "ng-template[clr-file-messages]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileMessagesTemplate, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[clr-file-messages]',
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrFileList {
    constructor() {
        this.injectorCache = new Map();
        this.contextCache = new Map();
        this.injector = inject(Injector);
        this.commonStrings = inject(ClrCommonStringsService);
        this.ngControlService = inject(NgControlService, { optional: true });
        this.fileInputContainer = inject(ClrFileInputContainer, { optional: true });
        if (!this.ngControlService || !this.fileInputContainer) {
            throw new Error('The clr-file-list component can only be used within a clr-file-input-container.');
        }
    }
    get files() {
        if (!this.fileInputContainer.fileInput) {
            return [];
        }
        const fileInputElement = this.fileInputContainer.fileInput.elementRef.nativeElement;
        return Array.from(fileInputElement.files).sort((a, b) => a.name.localeCompare(b.name));
    }
    getClearFileLabel(filename) {
        return this.commonStrings.parse(this.commonStrings.keys.clearFile, {
            FILE: filename,
        });
    }
    clearFile(fileToRemove) {
        if (!this.fileInputContainer.fileInput) {
            return;
        }
        const fileInputElement = this.fileInputContainer.fileInput.elementRef.nativeElement;
        const files = Array.from(fileInputElement.files);
        const newFiles = files.filter(file => file !== fileToRemove);
        selectFiles(fileInputElement, newFiles);
        this.fileInputContainer.focusBrowseButton();
    }
    createFileMessagesTemplateContext(file) {
        const fileInputErrors = this.ngControlService.controls[0].errors || {};
        const errors = {
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
        const context = { $implicit: file, success, errors };
        this.contextCache.set(file, context);
        // new injector is made and old reference replaced
        const injector = this.createFileMessagesTemplateInjector(context);
        this.injectorCache.set(file, injector);
        return context;
    }
    createFileMessagesTemplateInjector(fileMessagesTemplateContext) {
        return Injector.create({
            parent: this.injector,
            providers: [{ provide: CLR_FILE_MESSAGES_TEMPLATE_CONTEXT, useValue: fileMessagesTemplateContext }],
        });
    }
    errorsEqual(a, b) {
        return a.accept === b.accept && a.minFileSize === b.minFileSize && a.maxFileSize === b.maxFileSize;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileList, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrFileList, isStandalone: false, selector: "clr-file-list", host: { properties: { "attr.role": "\"list\"", "class.clr-file-list": "true" } }, queries: [{ propertyName: "fileMessagesTemplate", first: true, predicate: ClrFileMessagesTemplate, descendants: true }], ngImport: i0, template: `
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
            <ng-container
              [ngTemplateOutlet]="fileMessagesTemplate.templateRef"
              [ngTemplateOutletContext]="fileMessagesTemplateContext"
              [ngTemplateOutletInjector]="injectorCache.get(file)"
            ></ng-container>
          }
        </div>
      }
    }
  `, isInline: true, dependencies: [{ kind: "directive", type: i1$1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1$1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i1.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileList, decorators: [{
            type: Component,
            args: [{
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
            <ng-container
              [ngTemplateOutlet]="fileMessagesTemplate.templateRef"
              [ngTemplateOutletContext]="fileMessagesTemplateContext"
              [ngTemplateOutletInjector]="injectorCache.get(file)"
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
                }]
        }], ctorParameters: () => [], propDecorators: { fileMessagesTemplate: [{
                type: ContentChild,
                args: [ClrFileMessagesTemplate]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrFileInputContainer extends ClrAbstractContainer {
    constructor() {
        super(...arguments);
        this.commonStrings = inject(ClrCommonStringsService);
    }
    get accept() {
        return this.fileInput.elementRef.nativeElement.accept;
    }
    get multiple() {
        return this.fileInput.elementRef.nativeElement.multiple;
    }
    get disabled() {
        return this.fileInput.elementRef.nativeElement.disabled || (this.control && this.control.disabled);
    }
    get browseButtonText() {
        const selectionButtonLabel = this.fileList ? undefined : this.fileInput?.selection?.buttonLabel;
        return selectionButtonLabel || this.customButtonLabel || this.commonStrings.keys.browse;
    }
    get browseButtonDescribedBy() {
        return `${this.label?.forAttr} ${this.fileInput.elementRef.nativeElement.getAttribute('aria-describedby')}`;
    }
    get successMessagePresent() {
        return super.successMessagePresent || !!this.fileSuccessComponent;
    }
    get errorMessagePresent() {
        return super.errorMessagePresent || !!this.fileErrorComponent;
    }
    focusBrowseButton() {
        this.browseButtonElementRef.nativeElement.focus();
    }
    browse() {
        const fileInputElementRef = this.fileList && this.multiple ? this.fileListFileInputElementRef : this.fileInput.elementRef;
        fileInputElementRef.nativeElement.click();
    }
    clearSelectedFiles() {
        this.fileInput.elementRef.nativeElement.value = '';
        this.fileInput.elementRef.nativeElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        this.focusBrowseButton();
    }
    addFilesToSelection(newFiles) {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileInputContainer, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrFileInputContainer, isStandalone: false, selector: "clr-file-input-container", inputs: { customButtonLabel: ["clrButtonLabel", "customButtonLabel"] }, host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "disabled", "class.clr-row": "addGrid()" } }, providers: [NgControlService, ControlIdService, ControlClassService], queries: [{ propertyName: "fileInput", first: true, predicate: i0.forwardRef(() => ClrFileInput), descendants: true }, { propertyName: "fileList", first: true, predicate: i0.forwardRef(() => ClrFileList), descendants: true }, { propertyName: "fileSuccessComponent", first: true, predicate: ClrFileSuccess, descendants: true }, { propertyName: "fileErrorComponent", first: true, predicate: ClrFileError, descendants: true }], viewQueries: [{ propertyName: "browseButtonElementRef", first: true, predicate: ["browseButton"], descendants: true }, { propertyName: "fileListFileInputElementRef", first: true, predicate: ["fileListFileInput"], descendants: true }], usesInheritance: true, ngImport: i0, template: `
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i1$1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i1.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i3.ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileInputContainer, decorators: [{
            type: Component,
            args: [{
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
                }]
        }], propDecorators: { customButtonLabel: [{
                type: Input,
                args: ['clrButtonLabel']
            }], fileInput: [{
                type: ContentChild,
                args: [forwardRef(() => ClrFileInput)]
            }], fileList: [{
                type: ContentChild,
                args: [forwardRef(() => ClrFileList)]
            }], browseButtonElementRef: [{
                type: ViewChild,
                args: ['browseButton']
            }], fileListFileInputElementRef: [{
                type: ViewChild,
                args: ['fileListFileInput']
            }], fileSuccessComponent: [{
                type: ContentChild,
                args: [ClrFileSuccess]
            }], fileErrorComponent: [{
                type: ContentChild,
                args: [ClrFileError]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrFileInput extends WrappedFormControl {
    constructor(injector, renderer, viewContainerRef, elementRef, control, commonStrings) {
        super(viewContainerRef, ClrFileInputContainer, injector, control, renderer, elementRef);
        this.elementRef = elementRef;
        this.control = control;
        this.commonStrings = commonStrings;
        this.selection = undefined;
    }
    get disabled() {
        return this.elementRef.nativeElement.disabled || (this.control && this.control.disabled);
    }
    handleChange() {
        this.updateSelection();
    }
    updateSelection() {
        const files = this.elementRef.nativeElement.files;
        let selectionButtonLabel;
        let clearFilesButtonLabel;
        if (files?.length === 1) {
            const filename = files[0].name;
            selectionButtonLabel = filename;
            clearFilesButtonLabel = this.commonStrings.parse(this.commonStrings.keys.clearFile, {
                FILE: filename,
            });
        }
        else if (files?.length > 1) {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileInput, deps: [{ token: i0.Injector }, { token: i0.Renderer2 }, { token: i0.ViewContainerRef }, { token: i0.ElementRef }, { token: i1$2.NgControl, optional: true, self: true }, { token: i2.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrFileInput, isStandalone: false, selector: "input[type=\"file\"][clrFileInput]", host: { attributes: { "tabindex": "-1", "aria-hidden": "true" }, listeners: { "change": "handleChange()" }, properties: { "class.clr-file-input": "true", "disabled": "this.disabled" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileInput, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type="file"][clrFileInput]',
                    host: {
                        tabindex: '-1', // Remove the hidden file `input` element from the tab order because the browse `button` replaces it.
                        'aria-hidden': 'true', // Remove the hidden file `input` element from the accessibility tree because the browse `button` replaces it.
                        '[class.clr-file-input]': 'true',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.Injector }, { type: i0.Renderer2 }, { type: i0.ViewContainerRef }, { type: i0.ElementRef }, { type: i1$2.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i2.ClrCommonStringsService }], propDecorators: { disabled: [{
                type: HostBinding,
                args: ['disabled']
            }], handleChange: [{
                type: HostListener,
                args: ['change']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrFileInputValidator {
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
    validate(control) {
        const files = control.value;
        const fileInputElement = this.elementRef.nativeElement;
        const errors = {};
        // required validation (native attribute)
        if (fileInputElement.required && files?.length === 0) {
            errors.required = true;
        }
        const accept = fileInputElement.accept ? fileInputElement.accept.split(',').map(type => type.trim()) : null;
        if (files?.length > 0 && (accept || this.minFileSize || this.maxFileSize)) {
            for (let i = 0; i < files.length; i++) {
                const file = files.item(i);
                // accept validation (native attribute)
                if (accept && accept.length) {
                    if (!this.validateAccept(file, accept)) {
                        errors.accept = errors.accept || [];
                        errors.accept.push({
                            name: file.name,
                            accept,
                            type: file.type || '',
                            extension: this.getSuffixByDepth(file.name, 2), // last up to 2 parts for reporting
                        });
                    }
                }
                // min file validation (custom input)
                if (this.minFileSize && file.size < this.minFileSize) {
                    errors.minFileSize = errors.minFileSize || [];
                    errors.minFileSize.push({ name: file.name, minFileSize: this.minFileSize, actualFileSize: file.size });
                }
                // max file validation (custom input)
                if (this.maxFileSize && file.size > this.maxFileSize) {
                    errors.maxFileSize = errors.maxFileSize || [];
                    errors.maxFileSize.push({ name: file.name, maxFileSize: this.maxFileSize, actualFileSize: file.size });
                }
            }
        }
        return Object.keys(errors).length ? errors : null;
    }
    getSuffixByDepth(filename, depth) {
        const match = filename.toLowerCase().match(new RegExp(`(\\.[^.]+){1,${depth}}$`, 'i'));
        return match ? match[0] : '';
    }
    validateAccept(file, acceptList) {
        const name = file.name.toLowerCase();
        const type = (file.type || '').toLowerCase();
        for (const entryRaw of acceptList) {
            const entry = entryRaw.trim().toLowerCase();
            if (!entry) {
                continue;
            }
            // Extension check
            if (entry.startsWith('.')) {
                const depth = (entry.match(/\./g) || []).length;
                if (this.getSuffixByDepth(name, depth) === entry) {
                    return true;
                }
                continue;
            }
            // MIME check
            if (entry.endsWith('/*')) {
                const prefix = entry.slice(0, entry.length - 1); // keep trailing slash
                if (type.startsWith(prefix)) {
                    return true;
                }
            }
            else if (entry.includes('/') && type === entry) {
                return true;
            }
        }
        return false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileInputValidator, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrFileInputValidator, isStandalone: false, selector: "input[type=\"file\"][clrFileInput]", inputs: { minFileSize: ["clrMinFileSize", "minFileSize"], maxFileSize: ["clrMaxFileSize", "maxFileSize"] }, providers: [{ provide: NG_VALIDATORS, useExisting: ClrFileInputValidator, multi: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileInputValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type="file"][clrFileInput]',
                    providers: [{ provide: NG_VALIDATORS, useExisting: ClrFileInputValidator, multi: true }],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { minFileSize: [{
                type: Input,
                args: ['clrMinFileSize']
            }], maxFileSize: [{
                type: Input,
                args: ['clrMaxFileSize']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrFileInputValueAccessor {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.onChange = (_value) => { };
        this.onTouched = () => { };
    }
    writeValue(value) {
        if (value !== undefined && value !== null && !(value instanceof FileList)) {
            throw new Error('The value of a file input control must be a FileList.');
        }
        if (value) {
            selectFiles(this.elementRef.nativeElement, value);
        }
        else if (this.elementRef.nativeElement.files.length) {
            clearFiles(this.elementRef.nativeElement);
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    handleChange() {
        this.onTouched();
        this.onChange(this.elementRef.nativeElement.files);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileInputValueAccessor, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrFileInputValueAccessor, isStandalone: false, selector: "input[type=\"file\"][clrFileInput]", host: { listeners: { "change": "handleChange()" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: ClrFileInputValueAccessor, multi: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileInputValueAccessor, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type="file"][clrFileInput]',
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: ClrFileInputValueAccessor, multi: true }],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { handleChange: [{
                type: HostListener,
                args: ['change']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrFileInputModule {
    constructor() {
        ClarityIcons.addIcons(folderOpenIcon, successStandardIcon, errorStandardIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrFileInputModule, declarations: [ClrFileInput,
            ClrFileInputContainer,
            ClrFileInputValidator,
            ClrFileInputValueAccessor,
            ClrFileList,
            ClrFileMessagesTemplate,
            ClrFileInfo,
            ClrFileSuccess,
            ClrFileError], imports: [CommonModule, ClrIcon, ClrCommonFormsModule], exports: [ClrCommonFormsModule,
            ClrFileInput,
            ClrFileInputContainer,
            ClrFileInputValidator,
            ClrFileInputValueAccessor,
            ClrFileList,
            ClrFileMessagesTemplate,
            ClrFileInfo,
            ClrFileSuccess,
            ClrFileError] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileInputModule, imports: [CommonModule, ClrIcon, ClrCommonFormsModule, ClrCommonFormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrFileInputModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon, ClrCommonFormsModule],
                    declarations: [
                        ClrFileInput,
                        ClrFileInputContainer,
                        ClrFileInputValidator,
                        ClrFileInputValueAccessor,
                        ClrFileList,
                        ClrFileMessagesTemplate,
                        ClrFileInfo,
                        ClrFileSuccess,
                        ClrFileError,
                    ],
                    exports: [
                        ClrCommonFormsModule,
                        ClrFileInput,
                        ClrFileInputContainer,
                        ClrFileInputValidator,
                        ClrFileInputValueAccessor,
                        ClrFileList,
                        ClrFileMessagesTemplate,
                        ClrFileInfo,
                        ClrFileSuccess,
                        ClrFileError,
                    ],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CLR_FILE_MESSAGES_TEMPLATE_CONTEXT, ClrFileError, ClrFileInfo, ClrFileInput, ClrFileInputContainer, ClrFileInputModule, ClrFileInputValidator, ClrFileInputValueAccessor, ClrFileList, ClrFileMessagesTemplate, ClrFileSuccess, buildFileList, clearFiles, selectFiles };
//# sourceMappingURL=clr-angular-forms-file-input.mjs.map

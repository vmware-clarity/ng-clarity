/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChild, forwardRef, inject, Input, ViewChild } from '@angular/core';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ClrFileInput } from './file-input';
import { selectFiles } from './file-input.helpers';
import { ClrFileList } from './file-list';
import { ClrFileError, ClrFileSuccess } from './file-messages';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../../icon/icon";
import * as i3 from "../common/label";
export class ClrFileInputContainer extends ClrAbstractContainer {
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
}
ClrFileInputContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileInputContainer, deps: null, target: i0.ɵɵFactoryTarget.Component });
ClrFileInputContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrFileInputContainer, selector: "clr-file-input-container", inputs: { customButtonLabel: ["clrButtonLabel", "customButtonLabel"] }, host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "disabled", "class.clr-row": "addGrid()" } }, providers: [IfControlStateService, NgControlService, ControlIdService, ControlClassService], queries: [{ propertyName: "fileInput", first: true, predicate: i0.forwardRef(function () { return ClrFileInput; }), descendants: true }, { propertyName: "fileList", first: true, predicate: i0.forwardRef(function () { return ClrFileList; }), descendants: true }, { propertyName: "fileSuccessComponent", first: true, predicate: ClrFileSuccess, descendants: true }, { propertyName: "fileErrorComponent", first: true, predicate: ClrFileError, descendants: true }], viewQueries: [{ propertyName: "browseButtonElementRef", first: true, predicate: ["browseButton"], descendants: true }, { propertyName: "fileListFileInputElementRef", first: true, predicate: ["fileListFileInput"], descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-file-input-wrapper">
        <ng-content select="[clrFileInput]"></ng-content>

        <!-- file input to handle adding new files to selection when file list is present (prevent replacing selected files on the main file input) -->
        <input
          *ngIf="fileList"
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
          <cds-icon shape="times" status="neutral"></cds-icon>
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
      <ng-container>
        <div class="clr-file-list-break"></div>
        <ng-content select="clr-file-list"></ng-content>
      </ng-container>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.CdsIconCustomTag, selector: "cds-icon" }, { kind: "directive", type: i3.ClrLabel, selector: "label", inputs: ["id", "for"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileInputContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-file-input-container',
                    template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-file-input-wrapper">
        <ng-content select="[clrFileInput]"></ng-content>

        <!-- file input to handle adding new files to selection when file list is present (prevent replacing selected files on the main file input) -->
        <input
          *ngIf="fileList"
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
          <cds-icon shape="times" status="neutral"></cds-icon>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1pbnB1dC1jb250YWluZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9maWxlLWlucHV0L2ZpbGUtaW5wdXQtY29udGFpbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQWMsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTFHLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQzVGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDNUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDMUMsT0FBTyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7QUE4RS9ELE1BQU0sT0FBTyxxQkFBc0IsU0FBUSxvQkFBb0I7SUE1RS9EOztRQXlGbUIsa0JBQWEsR0FBRyxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQztLQW9FbEU7SUFsRUMsSUFBYyxNQUFNO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLE1BQU0s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KSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgQ29udGVudENoaWxkLCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBpbmplY3QsIElucHV0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyQWJzdHJhY3RDb250YWluZXIgfSBmcm9tICcuLi9jb21tb24vYWJzdHJhY3QtY29udGFpbmVyJztcbmltcG9ydCB7IElmQ29udHJvbFN0YXRlU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9pZi1jb250cm9sLXN0YXRlL2lmLWNvbnRyb2wtc3RhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBDb250cm9sQ2xhc3NTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9jb250cm9sLWNsYXNzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29udHJvbElkU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9wcm92aWRlcnMvY29udHJvbC1pZC5zZXJ2aWNlJztcbmltcG9ydCB7IE5nQ29udHJvbFNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL25nLWNvbnRyb2wuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJGaWxlSW5wdXQgfSBmcm9tICcuL2ZpbGUtaW5wdXQnO1xuaW1wb3J0IHsgc2VsZWN0RmlsZXMgfSBmcm9tICcuL2ZpbGUtaW5wdXQuaGVscGVycyc7XG5pbXBvcnQgeyBDbHJGaWxlTGlzdCB9IGZyb20gJy4vZmlsZS1saXN0JztcbmltcG9ydCB7IENsckZpbGVFcnJvciwgQ2xyRmlsZVN1Y2Nlc3MgfSBmcm9tICcuL2ZpbGUtbWVzc2FnZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZmlsZS1pbnB1dC1jb250YWluZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImxhYmVsXCI+PC9uZy1jb250ZW50PlxuICAgIDxsYWJlbCAqbmdJZj1cIiFsYWJlbCAmJiBhZGRHcmlkKClcIj48L2xhYmVsPlxuICAgIDxkaXYgY2xhc3M9XCJjbHItY29udHJvbC1jb250YWluZXJcIiBbbmdDbGFzc109XCJjb250cm9sQ2xhc3MoKVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImNsci1maWxlLWlucHV0LXdyYXBwZXJcIj5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW2NsckZpbGVJbnB1dF1cIj48L25nLWNvbnRlbnQ+XG5cbiAgICAgICAgPCEtLSBmaWxlIGlucHV0IHRvIGhhbmRsZSBhZGRpbmcgbmV3IGZpbGVzIHRvIHNlbGVjdGlvbiB3aGVuIGZpbGUgbGlzdCBpcyBwcmVzZW50IChwcmV2ZW50IHJlcGxhY2luZyBzZWxlY3RlZCBmaWxlcyBvbiB0aGUgbWFpbiBmaWxlIGlucHV0KSAtLT5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgKm5nSWY9XCJmaWxlTGlzdFwiXG4gICAgICAgICAgI2ZpbGVMaXN0RmlsZUlucHV0XG4gICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgIGNsYXNzPVwiY2xyLWZpbGUtaW5wdXRcIlxuICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgW2FjY2VwdF09XCJhY2NlcHRcIlxuICAgICAgICAgIFttdWx0aXBsZV09XCJtdWx0aXBsZVwiXG4gICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgICAoY2hhbmdlKT1cImFkZEZpbGVzVG9TZWxlY3Rpb24oZmlsZUxpc3RGaWxlSW5wdXQuZmlsZXMpXCJcbiAgICAgICAgLz5cblxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgI2Jyb3dzZUJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1zbSBjbHItZmlsZS1pbnB1dC1icm93c2UtYnV0dG9uXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XT1cImJyb3dzZUJ1dHRvbkRlc2NyaWJlZEJ5XCJcbiAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgIChjbGljayk9XCJicm93c2UoKVwiXG4gICAgICAgID5cbiAgICAgICAgICA8Y2RzLWljb24gc2hhcGU9XCJmb2xkZXItb3BlblwiPjwvY2RzLWljb24+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHItZmlsZS1pbnB1dC1icm93c2UtYnV0dG9uLXRleHRcIj57eyBicm93c2VCdXR0b25UZXh0IH19PC9zcGFuPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICpuZ0lmPVwiIWZpbGVMaXN0ICYmIGZpbGVJbnB1dD8uc2VsZWN0aW9uPy5maWxlQ291bnRcIlxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1zbSBjbHItZmlsZS1pbnB1dC1jbGVhci1idXR0b25cIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiZmlsZUlucHV0Py5zZWxlY3Rpb24/LmNsZWFyRmlsZXNCdXR0b25MYWJlbFwiXG4gICAgICAgICAgKGNsaWNrKT1cImNsZWFyU2VsZWN0ZWRGaWxlcygpXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxjZHMtaWNvbiBzaGFwZT1cInRpbWVzXCIgc3RhdHVzPVwibmV1dHJhbFwiPjwvY2RzLWljb24+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8Y2RzLWljb25cbiAgICAgICAgICAqbmdJZj1cInNob3dJbnZhbGlkXCJcbiAgICAgICAgICBjbGFzcz1cImNsci12YWxpZGF0ZS1pY29uXCJcbiAgICAgICAgICBzaGFwZT1cImV4Y2xhbWF0aW9uLWNpcmNsZVwiXG4gICAgICAgICAgc3RhdHVzPVwiZGFuZ2VyXCJcbiAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICA+PC9jZHMtaWNvbj5cbiAgICAgICAgPGNkcy1pY29uXG4gICAgICAgICAgKm5nSWY9XCJzaG93VmFsaWRcIlxuICAgICAgICAgIGNsYXNzPVwiY2xyLXZhbGlkYXRlLWljb25cIlxuICAgICAgICAgIHNoYXBlPVwiY2hlY2stY2lyY2xlXCJcbiAgICAgICAgICBzdGF0dXM9XCJzdWNjZXNzXCJcbiAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICA+PC9jZHMtaWNvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWNvbnRyb2wtaGVscGVyXCIgKm5nSWY9XCJzaG93SGVscGVyXCI+PC9uZy1jb250ZW50PlxuICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWNvbnRyb2wtZXJyb3JcIiAqbmdJZj1cInNob3dJbnZhbGlkXCI+PC9uZy1jb250ZW50PlxuICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWNvbnRyb2wtc3VjY2Vzc1wiICpuZ0lmPVwic2hvd1ZhbGlkXCI+PC9uZy1jb250ZW50PlxuXG4gICAgICA8IS0tIElmIHRoaXMgaXMgcHJlc2VudCwgdGhpcyBmaWxlIGlucHV0IGJlY29tZXMgYW4gXCJhZHZhbmNlZFwiIGZpbGUgaW5wdXQuIC0tPlxuICAgICAgPG5nLWNvbnRhaW5lcj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNsci1maWxlLWxpc3QtYnJlYWtcIj48L2Rpdj5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWZpbGUtbGlzdFwiPjwvbmctY29udGVudD5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgIDwvZGl2PlxuICBgLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5jbHItZm9ybS1jb250cm9sXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLmNsci1mb3JtLWNvbnRyb2wtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLmNsci1yb3ddJzogJ2FkZEdyaWQoKScsXG4gIH0sXG4gIHByb3ZpZGVyczogW0lmQ29udHJvbFN0YXRlU2VydmljZSwgTmdDb250cm9sU2VydmljZSwgQ29udHJvbElkU2VydmljZSwgQ29udHJvbENsYXNzU2VydmljZV0sXG59KVxuZXhwb3J0IGNsYXNzIENsckZpbGVJbnB1dENvbnRhaW5lciBleHRlbmRzIENsckFic3RyYWN0Q29udGFpbmVyIHtcbiAgQElucHV0KCdjbHJCdXR0b25MYWJlbCcpIGN1c3RvbUJ1dHRvbkxhYmVsOiBzdHJpbmc7XG5cbiAgQENvbnRlbnRDaGlsZChmb3J3YXJkUmVmKCgpID0+IENsckZpbGVJbnB1dCkpIHJlYWRvbmx5IGZpbGVJbnB1dDogQ2xyRmlsZUlucHV0O1xuICBAQ29udGVudENoaWxkKGZvcndhcmRSZWYoKCkgPT4gQ2xyRmlsZUxpc3QpKSBwcm90ZWN0ZWQgcmVhZG9ubHkgZmlsZUxpc3Q6IENsckZpbGVMaXN0O1xuXG4gIEBWaWV3Q2hpbGQoJ2Jyb3dzZUJ1dHRvbicpIHByaXZhdGUgYnJvd3NlQnV0dG9uRWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MQnV0dG9uRWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ2ZpbGVMaXN0RmlsZUlucHV0JykgcHJpdmF0ZSBmaWxlTGlzdEZpbGVJbnB1dEVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD47XG5cbiAgLy8gVGhlc2UgYXJlIGZvciB0aGUgXCJtZXNzYWdlIHByZXNlbnRcIiBvdmVycmlkZSBwcm9wZXJ0aWVzXG4gIEBDb250ZW50Q2hpbGQoQ2xyRmlsZVN1Y2Nlc3MpIHByaXZhdGUgcmVhZG9ubHkgZmlsZVN1Y2Nlc3NDb21wb25lbnQ6IENsckZpbGVTdWNjZXNzO1xuICBAQ29udGVudENoaWxkKENsckZpbGVFcnJvcikgcHJpdmF0ZSByZWFkb25seSBmaWxlRXJyb3JDb21wb25lbnQ6IENsckZpbGVFcnJvcjtcblxuICBwcml2YXRlIHJlYWRvbmx5IGNvbW1vblN0cmluZ3MgPSBpbmplY3QoQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UpO1xuXG4gIHByb3RlY3RlZCBnZXQgYWNjZXB0KCkge1xuICAgIHJldHVybiB0aGlzLmZpbGVJbnB1dC5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYWNjZXB0O1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBtdWx0aXBsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5maWxlSW5wdXQuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm11bHRpcGxlO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBkaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5maWxlSW5wdXQuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmRpc2FibGVkIHx8ICh0aGlzLmNvbnRyb2wgJiYgdGhpcy5jb250cm9sLmRpc2FibGVkKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgYnJvd3NlQnV0dG9uVGV4dCgpIHtcbiAgICBjb25zdCBzZWxlY3Rpb25CdXR0b25MYWJlbCA9IHRoaXMuZmlsZUxpc3QgPyB1bmRlZmluZWQgOiB0aGlzLmZpbGVJbnB1dD8uc2VsZWN0aW9uPy5idXR0b25MYWJlbDtcblxuICAgIHJldHVybiBzZWxlY3Rpb25CdXR0b25MYWJlbCB8fCB0aGlzLmN1c3RvbUJ1dHRvbkxhYmVsIHx8IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmJyb3dzZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgYnJvd3NlQnV0dG9uRGVzY3JpYmVkQnkoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMubGFiZWw/LmZvckF0dHJ9ICR7dGhpcy5maWxlSW5wdXQuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpfWA7XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgZ2V0IHN1Y2Nlc3NNZXNzYWdlUHJlc2VudCgpIHtcbiAgICByZXR1cm4gc3VwZXIuc3VjY2Vzc01lc3NhZ2VQcmVzZW50IHx8ICEhdGhpcy5maWxlU3VjY2Vzc0NvbXBvbmVudDtcbiAgfVxuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBnZXQgZXJyb3JNZXNzYWdlUHJlc2VudCgpIHtcbiAgICByZXR1cm4gc3VwZXIuZXJyb3JNZXNzYWdlUHJlc2VudCB8fCAhIXRoaXMuZmlsZUVycm9yQ29tcG9uZW50O1xuICB9XG5cbiAgZm9jdXNCcm93c2VCdXR0b24oKSB7XG4gICAgdGhpcy5icm93c2VCdXR0b25FbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBicm93c2UoKSB7XG4gICAgY29uc3QgZmlsZUlucHV0RWxlbWVudFJlZiA9XG4gICAgICB0aGlzLmZpbGVMaXN0ICYmIHRoaXMubXVsdGlwbGUgPyB0aGlzLmZpbGVMaXN0RmlsZUlucHV0RWxlbWVudFJlZiA6IHRoaXMuZmlsZUlucHV0LmVsZW1lbnRSZWY7XG5cbiAgICBmaWxlSW5wdXRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xpY2soKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjbGVhclNlbGVjdGVkRmlsZXMoKSB7XG4gICAgdGhpcy5maWxlSW5wdXQuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlID0gJyc7XG4gICAgdGhpcy5maWxlSW5wdXQuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnLCB7IGJ1YmJsZXM6IHRydWUsIGNhbmNlbGFibGU6IHRydWUgfSkpO1xuXG4gICAgdGhpcy5mb2N1c0Jyb3dzZUJ1dHRvbigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFkZEZpbGVzVG9TZWxlY3Rpb24obmV3RmlsZXM6IEZpbGVMaXN0KSB7XG4gICAgaWYgKCFuZXdGaWxlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBzdGFydCB3aXRoIG5ldyBmaWxlc1xuICAgIGNvbnN0IG1lcmdlZEZpbGVzID0gWy4uLm5ld0ZpbGVzXTtcblxuICAgIC8vIGFkZCBleGlzdGluZyBmaWxlcyBpZiBhIG5ldyBmaWxlIGRvZXNuJ3QgaGF2ZSB0aGUgc2FtZSBuYW1lXG4gICAgZm9yIChjb25zdCBleGlzdGluZ0ZpbGUgb2YgdGhpcy5maWxlSW5wdXQuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZpbGVzKSB7XG4gICAgICBpZiAoIW1lcmdlZEZpbGVzLnNvbWUoZmlsZSA9PiBmaWxlLm5hbWUgPT09IGV4aXN0aW5nRmlsZS5uYW1lKSkge1xuICAgICAgICBtZXJnZWRGaWxlcy5wdXNoKGV4aXN0aW5nRmlsZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGZpbGUgc2VsZWN0aW9uXG4gICAgc2VsZWN0RmlsZXModGhpcy5maWxlSW5wdXQuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBtZXJnZWRGaWxlcyk7XG4gIH1cbn1cbiJdfQ==
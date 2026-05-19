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
        return this.control ? this.control.disabled : this.fileInput.elementRef.nativeElement.disabled;
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
ClrFileInputContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: ClrFileInputContainer, deps: null, target: i0.ɵɵFactoryTarget.Component });
ClrFileInputContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.10", type: ClrFileInputContainer, selector: "clr-file-input-container", inputs: { customButtonLabel: ["clrButtonLabel", "customButtonLabel"] }, host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "disabled", "class.clr-row": "addGrid()" } }, providers: [IfControlStateService, NgControlService, ControlIdService, ControlClassService], queries: [{ propertyName: "fileInput", first: true, predicate: i0.forwardRef(function () { return ClrFileInput; }), descendants: true }, { propertyName: "fileList", first: true, predicate: i0.forwardRef(function () { return ClrFileList; }), descendants: true }, { propertyName: "fileSuccessComponent", first: true, predicate: ClrFileSuccess, descendants: true }, { propertyName: "fileErrorComponent", first: true, predicate: ClrFileError, descendants: true }], viewQueries: [{ propertyName: "browseButtonElementRef", first: true, predicate: ["browseButton"], descendants: true }, { propertyName: "fileListFileInputElementRef", first: true, predicate: ["fileListFileInput"], descendants: true }], usesInheritance: true, ngImport: i0, template: `
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
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: ClrFileInputContainer, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1pbnB1dC1jb250YWluZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9maWxlLWlucHV0L2ZpbGUtaW5wdXQtY29udGFpbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQWMsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTFHLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQzVGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDNUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDMUMsT0FBTyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7QUE4RS9ELE1BQU0sT0FBTyxxQkFBc0IsU0FBUSxvQkFBb0I7SUE1RS9EOztRQXlGbUIsa0JBQWEsR0FBRyxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQztLQW9FbEU7SUFsRUMsSUFBYyxNQUFNO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLE1BQU0s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cHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgaW5qZWN0LCBJbnB1dCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IENsckFic3RyYWN0Q29udGFpbmVyIH0gZnJvbSAnLi4vY29tbW9uL2Fic3RyYWN0LWNvbnRhaW5lcic7XG5pbXBvcnQgeyBJZkNvbnRyb2xTdGF0ZVNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vaWYtY29udHJvbC1zdGF0ZS9pZi1jb250cm9sLXN0YXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29udHJvbENsYXNzU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9wcm92aWRlcnMvY29udHJvbC1jbGFzcy5zZXJ2aWNlJztcbmltcG9ydCB7IENvbnRyb2xJZFNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL2NvbnRyb2wtaWQuc2VydmljZSc7XG5pbXBvcnQgeyBOZ0NvbnRyb2xTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9uZy1jb250cm9sLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyRmlsZUlucHV0IH0gZnJvbSAnLi9maWxlLWlucHV0JztcbmltcG9ydCB7IHNlbGVjdEZpbGVzIH0gZnJvbSAnLi9maWxlLWlucHV0LmhlbHBlcnMnO1xuaW1wb3J0IHsgQ2xyRmlsZUxpc3QgfSBmcm9tICcuL2ZpbGUtbGlzdCc7XG5pbXBvcnQgeyBDbHJGaWxlRXJyb3IsIENsckZpbGVTdWNjZXNzIH0gZnJvbSAnLi9maWxlLW1lc3NhZ2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWZpbGUtaW5wdXQtY29udGFpbmVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJsYWJlbFwiPjwvbmctY29udGVudD5cbiAgICA8bGFiZWwgKm5nSWY9XCIhbGFiZWwgJiYgYWRkR3JpZCgpXCI+PC9sYWJlbD5cbiAgICA8ZGl2IGNsYXNzPVwiY2xyLWNvbnRyb2wtY29udGFpbmVyXCIgW25nQ2xhc3NdPVwiY29udHJvbENsYXNzKClcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjbHItZmlsZS1pbnB1dC13cmFwcGVyXCI+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIltjbHJGaWxlSW5wdXRdXCI+PC9uZy1jb250ZW50PlxuXG4gICAgICAgIDwhLS0gZmlsZSBpbnB1dCB0byBoYW5kbGUgYWRkaW5nIG5ldyBmaWxlcyB0byBzZWxlY3Rpb24gd2hlbiBmaWxlIGxpc3QgaXMgcHJlc2VudCAocHJldmVudCByZXBsYWNpbmcgc2VsZWN0ZWQgZmlsZXMgb24gdGhlIG1haW4gZmlsZSBpbnB1dCkgLS0+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgICpuZ0lmPVwiZmlsZUxpc3RcIlxuICAgICAgICAgICNmaWxlTGlzdEZpbGVJbnB1dFxuICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICBjbGFzcz1cImNsci1maWxlLWlucHV0XCJcbiAgICAgICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgIFthY2NlcHRdPVwiYWNjZXB0XCJcbiAgICAgICAgICBbbXVsdGlwbGVdPVwibXVsdGlwbGVcIlxuICAgICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgKGNoYW5nZSk9XCJhZGRGaWxlc1RvU2VsZWN0aW9uKGZpbGVMaXN0RmlsZUlucHV0LmZpbGVzKVwiXG4gICAgICAgIC8+XG5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICNicm93c2VCdXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzcz1cImJ0biBidG4tc20gY2xyLWZpbGUtaW5wdXQtYnJvd3NlLWJ1dHRvblwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1kZXNjcmliZWRieV09XCJicm93c2VCdXR0b25EZXNjcmliZWRCeVwiXG4gICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgICAoY2xpY2spPVwiYnJvd3NlKClcIlxuICAgICAgICA+XG4gICAgICAgICAgPGNkcy1pY29uIHNoYXBlPVwiZm9sZGVyLW9wZW5cIj48L2Nkcy1pY29uPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2xyLWZpbGUtaW5wdXQtYnJvd3NlLWJ1dHRvbi10ZXh0XCI+e3sgYnJvd3NlQnV0dG9uVGV4dCB9fTwvc3Bhbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICAqbmdJZj1cIiFmaWxlTGlzdCAmJiBmaWxlSW5wdXQ/LnNlbGVjdGlvbj8uZmlsZUNvdW50XCJcbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzcz1cImJ0biBidG4tc20gY2xyLWZpbGUtaW5wdXQtY2xlYXItYnV0dG9uXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImZpbGVJbnB1dD8uc2VsZWN0aW9uPy5jbGVhckZpbGVzQnV0dG9uTGFiZWxcIlxuICAgICAgICAgIChjbGljayk9XCJjbGVhclNlbGVjdGVkRmlsZXMoKVwiXG4gICAgICAgID5cbiAgICAgICAgICA8Y2RzLWljb24gc2hhcGU9XCJ0aW1lc1wiIHN0YXR1cz1cIm5ldXRyYWxcIj48L2Nkcy1pY29uPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGNkcy1pY29uXG4gICAgICAgICAgKm5nSWY9XCJzaG93SW52YWxpZFwiXG4gICAgICAgICAgY2xhc3M9XCJjbHItdmFsaWRhdGUtaWNvblwiXG4gICAgICAgICAgc2hhcGU9XCJleGNsYW1hdGlvbi1jaXJjbGVcIlxuICAgICAgICAgIHN0YXR1cz1cImRhbmdlclwiXG4gICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgPjwvY2RzLWljb24+XG4gICAgICAgIDxjZHMtaWNvblxuICAgICAgICAgICpuZ0lmPVwic2hvd1ZhbGlkXCJcbiAgICAgICAgICBjbGFzcz1cImNsci12YWxpZGF0ZS1pY29uXCJcbiAgICAgICAgICBzaGFwZT1cImNoZWNrLWNpcmNsZVwiXG4gICAgICAgICAgc3RhdHVzPVwic3VjY2Vzc1wiXG4gICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgPjwvY2RzLWljb24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1jb250cm9sLWhlbHBlclwiICpuZ0lmPVwic2hvd0hlbHBlclwiPjwvbmctY29udGVudD5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1jb250cm9sLWVycm9yXCIgKm5nSWY9XCJzaG93SW52YWxpZFwiPjwvbmctY29udGVudD5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1jb250cm9sLXN1Y2Nlc3NcIiAqbmdJZj1cInNob3dWYWxpZFwiPjwvbmctY29udGVudD5cblxuICAgICAgPCEtLSBJZiB0aGlzIGlzIHByZXNlbnQsIHRoaXMgZmlsZSBpbnB1dCBiZWNvbWVzIGFuIFwiYWR2YW5jZWRcIiBmaWxlIGlucHV0LiAtLT5cbiAgICAgIDxuZy1jb250YWluZXI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjbHItZmlsZS1saXN0LWJyZWFrXCI+PC9kaXY+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1maWxlLWxpc3RcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuY2xyLWZvcm0tY29udHJvbF0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5jbHItZm9ybS1jb250cm9sLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5jbHItcm93XSc6ICdhZGRHcmlkKCknLFxuICB9LFxuICBwcm92aWRlcnM6IFtJZkNvbnRyb2xTdGF0ZVNlcnZpY2UsIE5nQ29udHJvbFNlcnZpY2UsIENvbnRyb2xJZFNlcnZpY2UsIENvbnRyb2xDbGFzc1NlcnZpY2VdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJGaWxlSW5wdXRDb250YWluZXIgZXh0ZW5kcyBDbHJBYnN0cmFjdENvbnRhaW5lciB7XG4gIEBJbnB1dCgnY2xyQnV0dG9uTGFiZWwnKSBjdXN0b21CdXR0b25MYWJlbDogc3RyaW5nO1xuXG4gIEBDb250ZW50Q2hpbGQoZm9yd2FyZFJlZigoKSA9PiBDbHJGaWxlSW5wdXQpKSByZWFkb25seSBmaWxlSW5wdXQ6IENsckZpbGVJbnB1dDtcbiAgQENvbnRlbnRDaGlsZChmb3J3YXJkUmVmKCgpID0+IENsckZpbGVMaXN0KSkgcHJvdGVjdGVkIHJlYWRvbmx5IGZpbGVMaXN0OiBDbHJGaWxlTGlzdDtcblxuICBAVmlld0NoaWxkKCdicm93c2VCdXR0b24nKSBwcml2YXRlIGJyb3dzZUJ1dHRvbkVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEJ1dHRvbkVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdmaWxlTGlzdEZpbGVJbnB1dCcpIHByaXZhdGUgZmlsZUxpc3RGaWxlSW5wdXRFbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+O1xuXG4gIC8vIFRoZXNlIGFyZSBmb3IgdGhlIFwibWVzc2FnZSBwcmVzZW50XCIgb3ZlcnJpZGUgcHJvcGVydGllc1xuICBAQ29udGVudENoaWxkKENsckZpbGVTdWNjZXNzKSBwcml2YXRlIHJlYWRvbmx5IGZpbGVTdWNjZXNzQ29tcG9uZW50OiBDbHJGaWxlU3VjY2VzcztcbiAgQENvbnRlbnRDaGlsZChDbHJGaWxlRXJyb3IpIHByaXZhdGUgcmVhZG9ubHkgZmlsZUVycm9yQ29tcG9uZW50OiBDbHJGaWxlRXJyb3I7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBjb21tb25TdHJpbmdzID0gaW5qZWN0KENsckNvbW1vblN0cmluZ3NTZXJ2aWNlKTtcblxuICBwcm90ZWN0ZWQgZ2V0IGFjY2VwdCgpIHtcbiAgICByZXR1cm4gdGhpcy5maWxlSW5wdXQuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFjY2VwdDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgbXVsdGlwbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsZUlucHV0LmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5tdWx0aXBsZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgZGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbCA/IHRoaXMuY29udHJvbC5kaXNhYmxlZCA6IHRoaXMuZmlsZUlucHV0LmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5kaXNhYmxlZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgYnJvd3NlQnV0dG9uVGV4dCgpIHtcbiAgICBjb25zdCBzZWxlY3Rpb25CdXR0b25MYWJlbCA9IHRoaXMuZmlsZUxpc3QgPyB1bmRlZmluZWQgOiB0aGlzLmZpbGVJbnB1dD8uc2VsZWN0aW9uPy5idXR0b25MYWJlbDtcblxuICAgIHJldHVybiBzZWxlY3Rpb25CdXR0b25MYWJlbCB8fCB0aGlzLmN1c3RvbUJ1dHRvbkxhYmVsIHx8IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmJyb3dzZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgYnJvd3NlQnV0dG9uRGVzY3JpYmVkQnkoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMubGFiZWw/LmZvckF0dHJ9ICR7dGhpcy5maWxlSW5wdXQuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpfWA7XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgZ2V0IHN1Y2Nlc3NNZXNzYWdlUHJlc2VudCgpIHtcbiAgICByZXR1cm4gc3VwZXIuc3VjY2Vzc01lc3NhZ2VQcmVzZW50IHx8ICEhdGhpcy5maWxlU3VjY2Vzc0NvbXBvbmVudDtcbiAgfVxuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBnZXQgZXJyb3JNZXNzYWdlUHJlc2VudCgpIHtcbiAgICByZXR1cm4gc3VwZXIuZXJyb3JNZXNzYWdlUHJlc2VudCB8fCAhIXRoaXMuZmlsZUVycm9yQ29tcG9uZW50O1xuICB9XG5cbiAgZm9jdXNCcm93c2VCdXR0b24oKSB7XG4gICAgdGhpcy5icm93c2VCdXR0b25FbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBicm93c2UoKSB7XG4gICAgY29uc3QgZmlsZUlucHV0RWxlbWVudFJlZiA9XG4gICAgICB0aGlzLmZpbGVMaXN0ICYmIHRoaXMubXVsdGlwbGUgPyB0aGlzLmZpbGVMaXN0RmlsZUlucHV0RWxlbWVudFJlZiA6IHRoaXMuZmlsZUlucHV0LmVsZW1lbnRSZWY7XG5cbiAgICBmaWxlSW5wdXRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xpY2soKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjbGVhclNlbGVjdGVkRmlsZXMoKSB7XG4gICAgdGhpcy5maWxlSW5wdXQuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlID0gJyc7XG4gICAgdGhpcy5maWxlSW5wdXQuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnLCB7IGJ1YmJsZXM6IHRydWUsIGNhbmNlbGFibGU6IHRydWUgfSkpO1xuXG4gICAgdGhpcy5mb2N1c0Jyb3dzZUJ1dHRvbigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFkZEZpbGVzVG9TZWxlY3Rpb24obmV3RmlsZXM6IEZpbGVMaXN0KSB7XG4gICAgaWYgKCFuZXdGaWxlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBzdGFydCB3aXRoIG5ldyBmaWxlc1xuICAgIGNvbnN0IG1lcmdlZEZpbGVzID0gWy4uLm5ld0ZpbGVzXTtcblxuICAgIC8vIGFkZCBleGlzdGluZyBmaWxlcyBpZiBhIG5ldyBmaWxlIGRvZXNuJ3QgaGF2ZSB0aGUgc2FtZSBuYW1lXG4gICAgZm9yIChjb25zdCBleGlzdGluZ0ZpbGUgb2YgdGhpcy5maWxlSW5wdXQuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZpbGVzKSB7XG4gICAgICBpZiAoIW1lcmdlZEZpbGVzLnNvbWUoZmlsZSA9PiBmaWxlLm5hbWUgPT09IGV4aXN0aW5nRmlsZS5uYW1lKSkge1xuICAgICAgICBtZXJnZWRGaWxlcy5wdXNoKGV4aXN0aW5nRmlsZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGZpbGUgc2VsZWN0aW9uXG4gICAgc2VsZWN0RmlsZXModGhpcy5maWxlSW5wdXQuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBtZXJnZWRGaWxlcyk7XG4gIH1cbn1cbiJdfQ==
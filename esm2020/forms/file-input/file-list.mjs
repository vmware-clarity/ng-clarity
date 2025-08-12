/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChild, inject, Injector } from '@angular/core';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ClrFileInputContainer } from './file-input-container';
import { selectFiles } from './file-input.helpers';
import { CLR_FILE_MESSAGES_TEMPLATE_CONTEXT } from './file-messages';
import { ClrFileMessagesTemplate, } from './file-messages-template';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../../icon/icon";
export class ClrFileList {
    constructor() {
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
        const fileInputErrors = this.ngControlService.control.errors || {};
        const errors = {
            accept: fileInputErrors.accept?.find(error => error.name === file.name),
            minFileSize: fileInputErrors.minFileSize?.find(error => error.name === file.name),
            maxFileSize: fileInputErrors.maxFileSize?.find(error => error.name === file.name),
        };
        const success = Object.values(errors).every(error => !error);
        return { $implicit: file, success, errors };
    }
    createFileMessagesTemplateInjector(fileMessagesTemplateContext) {
        return Injector.create({
            parent: this.injector,
            providers: [{ provide: CLR_FILE_MESSAGES_TEMPLATE_CONTEXT, useValue: fileMessagesTemplateContext }],
        });
    }
}
ClrFileList.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileList, deps: [], target: i0.ɵɵFactoryTarget.Component });
ClrFileList.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrFileList, selector: "clr-file-list", host: { properties: { "attr.role": "\"list\"", "class.clr-file-list": "true" } }, queries: [{ propertyName: "fileMessagesTemplate", first: true, predicate: ClrFileMessagesTemplate, descendants: true }], ngImport: i0, template: `
    <ng-container *ngFor="let file of files">
      <div
        *ngIf="createFileMessagesTemplateContext(file); let fileMessagesTemplateContext"
        role="listitem"
        class="clr-file-list-item"
        [ngClass]="{
          'clr-error': !fileMessagesTemplateContext.success,
          'clr-success': fileMessagesTemplateContext.success
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
            [attr.shape]="fileMessagesTemplateContext.success ? 'check-circle' : 'exclamation-circle'"
            [attr.status]="fileMessagesTemplateContext.success ? 'success' : 'danger'"
            aria-hidden="true"
          ></cds-icon>
        </div>

        <ng-container
          *ngIf="fileMessagesTemplate"
          [ngTemplateOutlet]="fileMessagesTemplate.templateRef"
          [ngTemplateOutletContext]="fileMessagesTemplateContext"
          [ngTemplateOutletInjector]="createFileMessagesTemplateInjector(fileMessagesTemplateContext)"
        ></ng-container>
      </div>
    </ng-container>
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.CdsIconCustomTag, selector: "cds-icon" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileList, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-file-list',
                    template: `
    <ng-container *ngFor="let file of files">
      <div
        *ngIf="createFileMessagesTemplateContext(file); let fileMessagesTemplateContext"
        role="listitem"
        class="clr-file-list-item"
        [ngClass]="{
          'clr-error': !fileMessagesTemplateContext.success,
          'clr-success': fileMessagesTemplateContext.success
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
            [attr.shape]="fileMessagesTemplateContext.success ? 'check-circle' : 'exclamation-circle'"
            [attr.status]="fileMessagesTemplateContext.success ? 'success' : 'danger'"
            aria-hidden="true"
          ></cds-icon>
        </div>

        <ng-container
          *ngIf="fileMessagesTemplate"
          [ngTemplateOutlet]="fileMessagesTemplate.templateRef"
          [ngTemplateOutletContext]="fileMessagesTemplateContext"
          [ngTemplateOutletInjector]="createFileMessagesTemplateInjector(fileMessagesTemplateContext)"
        ></ng-container>
      </div>
    </ng-container>
  `,
                    host: {
                        '[attr.role]': '"list"',
                        '[class.clr-file-list]': 'true',
                    },
                }]
        }], ctorParameters: function () { return []; }, propDecorators: { fileMessagesTemplate: [{
                type: ContentChild,
                args: [ClrFileMessagesTemplate]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1saXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvZmlsZS1pbnB1dC9maWxlLWxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRS9ELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNuRCxPQUFPLEVBQUUsa0NBQWtDLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNyRSxPQUFPLEVBQ0wsdUJBQXVCLEdBR3hCLE1BQU0sMEJBQTBCLENBQUM7Ozs7QUFpRGxDLE1BQU0sT0FBTyxXQUFXO0lBUXRCO1FBTGlCLGFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUIsa0JBQWEsR0FBRyxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNoRCxxQkFBZ0IsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNoRSx1QkFBa0IsR0FBRyxNQUFNLENBQUMscUJBQXFCLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUd0RixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQ3RELE1BQU0sSUFBSSxLQUFLLENBQUMsaUZBQWlGLENBQUMsQ0FBQztTQUNwRztJQUNILENBQUM7SUFF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VSxXQUFXO2tCQS9DdkIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsZUFBZTtvQkFDekIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Q1Q7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLGFBQWEsRUFBRSxRQUFRO3dCQUN2Qix1QkFBdUIsRUFBRSxNQUFNO3FCQUNoQztpQkFDRjswRUFFMkQsb0JBQW9CO3NCQUE3RSxZQUFZO3VCQUFDLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsIGluamVjdCwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgTmdDb250cm9sU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9wcm92aWRlcnMvbmctY29udHJvbC5zZXJ2aWNlJztcbmltcG9ydCB7IENsckZpbGVJbnB1dENvbnRhaW5lciB9IGZyb20gJy4vZmlsZS1pbnB1dC1jb250YWluZXInO1xuaW1wb3J0IHsgQ2xyRmlsZUxpc3RWYWxpZGF0aW9uRXJyb3JzIH0gZnJvbSAnLi9maWxlLWlucHV0LXZhbGlkYXRvci1lcnJvcnMnO1xuaW1wb3J0IHsgc2VsZWN0RmlsZXMgfSBmcm9tICcuL2ZpbGUtaW5wdXQuaGVscGVycyc7XG5pbXBvcnQgeyBDTFJfRklMRV9NRVNTQUdFU19URU1QTEFURV9DT05URVhUIH0gZnJvbSAnLi9maWxlLW1lc3NhZ2VzJztcbmltcG9ydCB7XG4gIENsckZpbGVNZXNzYWdlc1RlbXBsYXRlLFxuICBDbHJGaWxlTWVzc2FnZXNUZW1wbGF0ZUNvbnRleHQsXG4gIENsclNpbmdsZUZpbGVWYWxpZGF0aW9uRXJyb3JzLFxufSBmcm9tICcuL2ZpbGUtbWVzc2FnZXMtdGVtcGxhdGUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZmlsZS1saXN0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBmaWxlIG9mIGZpbGVzXCI+XG4gICAgICA8ZGl2XG4gICAgICAgICpuZ0lmPVwiY3JlYXRlRmlsZU1lc3NhZ2VzVGVtcGxhdGVDb250ZXh0KGZpbGUpOyBsZXQgZmlsZU1lc3NhZ2VzVGVtcGxhdGVDb250ZXh0XCJcbiAgICAgICAgcm9sZT1cImxpc3RpdGVtXCJcbiAgICAgICAgY2xhc3M9XCJjbHItZmlsZS1saXN0LWl0ZW1cIlxuICAgICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICAgJ2Nsci1lcnJvcic6ICFmaWxlTWVzc2FnZXNUZW1wbGF0ZUNvbnRleHQuc3VjY2VzcyxcbiAgICAgICAgICAnY2xyLXN1Y2Nlc3MnOiBmaWxlTWVzc2FnZXNUZW1wbGF0ZUNvbnRleHQuc3VjY2Vzc1xuICAgICAgICB9XCJcbiAgICAgID5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNsci1maWxlLWxhYmVsLWFuZC1zdGF0dXMtaWNvblwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWwgY2xyLWZpbGUtbGFiZWxcIj5cbiAgICAgICAgICAgIHt7IGZpbGUubmFtZSB9fVxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBjbGFzcz1cImJ0biBidG4tc20gYnRuLWxpbmstbmV1dHJhbCBidG4taWNvbiBjbHItZmlsZS1jbGVhci1idXR0b25cIlxuICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImdldENsZWFyRmlsZUxhYmVsKGZpbGUubmFtZSlcIlxuICAgICAgICAgICAgICAoY2xpY2spPVwiY2xlYXJGaWxlKGZpbGUpXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPGNkcy1pY29uIHNoYXBlPVwidGltZXNcIj48L2Nkcy1pY29uPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9zcGFuPlxuXG4gICAgICAgICAgPGNkcy1pY29uXG4gICAgICAgICAgICBjbGFzcz1cImNsci12YWxpZGF0ZS1pY29uXCJcbiAgICAgICAgICAgIFthdHRyLnNoYXBlXT1cImZpbGVNZXNzYWdlc1RlbXBsYXRlQ29udGV4dC5zdWNjZXNzID8gJ2NoZWNrLWNpcmNsZScgOiAnZXhjbGFtYXRpb24tY2lyY2xlJ1wiXG4gICAgICAgICAgICBbYXR0ci5zdGF0dXNdPVwiZmlsZU1lc3NhZ2VzVGVtcGxhdGVDb250ZXh0LnN1Y2Nlc3MgPyAnc3VjY2VzcycgOiAnZGFuZ2VyJ1wiXG4gICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgID48L2Nkcy1pY29uPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICAgKm5nSWY9XCJmaWxlTWVzc2FnZXNUZW1wbGF0ZVwiXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiZmlsZU1lc3NhZ2VzVGVtcGxhdGUudGVtcGxhdGVSZWZcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJmaWxlTWVzc2FnZXNUZW1wbGF0ZUNvbnRleHRcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0SW5qZWN0b3JdPVwiY3JlYXRlRmlsZU1lc3NhZ2VzVGVtcGxhdGVJbmplY3RvcihmaWxlTWVzc2FnZXNUZW1wbGF0ZUNvbnRleHQpXCJcbiAgICAgICAgPjwvbmctY29udGFpbmVyPlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIucm9sZV0nOiAnXCJsaXN0XCInLFxuICAgICdbY2xhc3MuY2xyLWZpbGUtbGlzdF0nOiAndHJ1ZScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsckZpbGVMaXN0IHtcbiAgQENvbnRlbnRDaGlsZChDbHJGaWxlTWVzc2FnZXNUZW1wbGF0ZSkgcHJvdGVjdGVkIHJlYWRvbmx5IGZpbGVNZXNzYWdlc1RlbXBsYXRlOiBDbHJGaWxlTWVzc2FnZXNUZW1wbGF0ZTtcblxuICBwcml2YXRlIHJlYWRvbmx5IGluamVjdG9yID0gaW5qZWN0KEluamVjdG9yKTtcbiAgcHJpdmF0ZSByZWFkb25seSBjb21tb25TdHJpbmdzID0gaW5qZWN0KENsckNvbW1vblN0cmluZ3NTZXJ2aWNlKTtcbiAgcHJpdmF0ZSByZWFkb25seSBuZ0NvbnRyb2xTZXJ2aWNlID0gaW5qZWN0KE5nQ29udHJvbFNlcnZpY2UsIHsgb3B0aW9uYWw6IHRydWUgfSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgZmlsZUlucHV0Q29udGFpbmVyID0gaW5qZWN0KENsckZpbGVJbnB1dENvbnRhaW5lciwgeyBvcHRpb25hbDogdHJ1ZSB9KTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAoIXRoaXMubmdDb250cm9sU2VydmljZSB8fCAhdGhpcy5maWxlSW5wdXRDb250YWluZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGNsci1maWxlLWxpc3QgY29tcG9uZW50IGNhbiBvbmx5IGJlIHVzZWQgd2l0aGluIGEgY2xyLWZpbGUtaW5wdXQtY29udGFpbmVyLicpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgZmlsZXMoKSB7XG4gICAgaWYgKCF0aGlzLmZpbGVJbnB1dENvbnRhaW5lci5maWxlSW5wdXQpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlSW5wdXRFbGVtZW50ID0gdGhpcy5maWxlSW5wdXRDb250YWluZXIuZmlsZUlucHV0LmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIHJldHVybiBBcnJheS5mcm9tKGZpbGVJbnB1dEVsZW1lbnQuZmlsZXMpLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldENsZWFyRmlsZUxhYmVsKGZpbGVuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5jb21tb25TdHJpbmdzLnBhcnNlKHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmNsZWFyRmlsZSwge1xuICAgICAgRklMRTogZmlsZW5hbWUsXG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY2xlYXJGaWxlKGZpbGVUb1JlbW92ZTogRmlsZSkge1xuICAgIGlmICghdGhpcy5maWxlSW5wdXRDb250YWluZXIuZmlsZUlucHV0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZUlucHV0RWxlbWVudCA9IHRoaXMuZmlsZUlucHV0Q29udGFpbmVyLmZpbGVJbnB1dC5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgZmlsZXMgPSBBcnJheS5mcm9tKGZpbGVJbnB1dEVsZW1lbnQuZmlsZXMpO1xuICAgIGNvbnN0IG5ld0ZpbGVzID0gZmlsZXMuZmlsdGVyKGZpbGUgPT4gZmlsZSAhPT0gZmlsZVRvUmVtb3ZlKTtcblxuICAgIHNlbGVjdEZpbGVzKGZpbGVJbnB1dEVsZW1lbnQsIG5ld0ZpbGVzKTtcbiAgICB0aGlzLmZpbGVJbnB1dENvbnRhaW5lci5mb2N1c0Jyb3dzZUJ1dHRvbigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNyZWF0ZUZpbGVNZXNzYWdlc1RlbXBsYXRlQ29udGV4dChmaWxlOiBGaWxlKTogQ2xyRmlsZU1lc3NhZ2VzVGVtcGxhdGVDb250ZXh0IHtcbiAgICBjb25zdCBmaWxlSW5wdXRFcnJvcnM6IENsckZpbGVMaXN0VmFsaWRhdGlvbkVycm9ycyA9IHRoaXMubmdDb250cm9sU2VydmljZS5jb250cm9sLmVycm9ycyB8fCB7fTtcblxuICAgIGNvbnN0IGVycm9yczogQ2xyU2luZ2xlRmlsZVZhbGlkYXRpb25FcnJvcnMgPSB7XG4gICAgICBhY2NlcHQ6IGZpbGVJbnB1dEVycm9ycy5hY2NlcHQ/LmZpbmQoZXJyb3IgPT4gZXJyb3IubmFtZSA9PT0gZmlsZS5uYW1lKSxcbiAgICAgIG1pbkZpbGVTaXplOiBmaWxlSW5wdXRFcnJvcnMubWluRmlsZVNpemU/LmZpbmQoZXJyb3IgPT4gZXJyb3IubmFtZSA9PT0gZmlsZS5uYW1lKSxcbiAgICAgIG1heEZpbGVTaXplOiBmaWxlSW5wdXRFcnJvcnMubWF4RmlsZVNpemU/LmZpbmQoZXJyb3IgPT4gZXJyb3IubmFtZSA9PT0gZmlsZS5uYW1lKSxcbiAgICB9O1xuXG4gICAgY29uc3Qgc3VjY2VzcyA9IE9iamVjdC52YWx1ZXMoZXJyb3JzKS5ldmVyeShlcnJvciA9PiAhZXJyb3IpO1xuXG4gICAgcmV0dXJuIHsgJGltcGxpY2l0OiBmaWxlLCBzdWNjZXNzLCBlcnJvcnMgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjcmVhdGVGaWxlTWVzc2FnZXNUZW1wbGF0ZUluamVjdG9yKGZpbGVNZXNzYWdlc1RlbXBsYXRlQ29udGV4dDogQ2xyRmlsZU1lc3NhZ2VzVGVtcGxhdGVDb250ZXh0KSB7XG4gICAgcmV0dXJuIEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IHRoaXMuaW5qZWN0b3IsXG4gICAgICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IENMUl9GSUxFX01FU1NBR0VTX1RFTVBMQVRFX0NPTlRFWFQsIHVzZVZhbHVlOiBmaWxlTWVzc2FnZXNUZW1wbGF0ZUNvbnRleHQgfV0sXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==
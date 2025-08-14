/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/icon-and-types.service";
import * as i2 from "@angular/common";
import * as i3 from "../../icon/icon";
import * as i4 from "../../progress/spinner/spinner";
export class ClrAlertItem {
    constructor(iconService) {
        this.iconService = iconService;
    }
}
ClrAlertItem.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAlertItem, deps: [{ token: i1.AlertIconAndTypesService }], target: i0.ɵɵFactoryTarget.Component });
ClrAlertItem.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrAlertItem, selector: "clr-alert-item", host: { classAttribute: "alert-item" }, ngImport: i0, template: `
    <div class="alert-icon-wrapper">
      <clr-spinner class="alert-spinner" clrInline *ngIf="iconService.alertIconShape === 'loading'"></clr-spinner>
      <cds-icon
        class="alert-icon"
        role="img"
        *ngIf="iconService.alertIconShape !== 'loading'"
        [attr.shape]="iconService.alertIconShape"
        [attr.aria-label]="iconService.alertIconTitle"
      ></cds-icon>
    </div>
    <ng-content></ng-content>
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.CdsIconCustomTag, selector: "cds-icon" }, { kind: "component", type: i4.ClrSpinner, selector: "clr-spinner", inputs: ["clrInline", "clrInverse", "clrSmall", "clrMedium"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAlertItem, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-alert-item',
                    template: `
    <div class="alert-icon-wrapper">
      <clr-spinner class="alert-spinner" clrInline *ngIf="iconService.alertIconShape === 'loading'"></clr-spinner>
      <cds-icon
        class="alert-icon"
        role="img"
        *ngIf="iconService.alertIconShape !== 'loading'"
        [attr.shape]="iconService.alertIconShape"
        [attr.aria-label]="iconService.alertIconTitle"
      ></cds-icon>
    </div>
    <ng-content></ng-content>
  `,
                    host: { class: 'alert-item' },
                }]
        }], ctorParameters: function () { return [{ type: i1.AlertIconAndTypesService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxlcnQtaXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2VtcGhhc2lzL2FsZXJ0L2FsZXJ0LWl0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7Ozs7QUFxQjFDLE1BQU0sT0FBTyxZQUFZO0lBQ3ZCLFlBQW1CLFdBQXFDO1FBQXJDLGdCQUFXLEdBQVgsV0FBVyxDQUEwQjtJQUFHLENBQUM7O3lHQURqRCxZQUFZOzZGQUFaLFlBQVksOEZBZmI7Ozs7Ozs7Ozs7OztHQVlUOzJGQUdVLFlBQVk7a0JBakJ4QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7O0dBWVQ7b0JBQ0QsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRTtpQkFDOUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBBbGVydEljb25BbmRUeXBlc1NlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9pY29uLWFuZC10eXBlcy5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWFsZXJ0LWl0ZW0nLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJhbGVydC1pY29uLXdyYXBwZXJcIj5cbiAgICAgIDxjbHItc3Bpbm5lciBjbGFzcz1cImFsZXJ0LXNwaW5uZXJcIiBjbHJJbmxpbmUgKm5nSWY9XCJpY29uU2VydmljZS5hbGVydEljb25TaGFwZSA9PT0gJ2xvYWRpbmcnXCI+PC9jbHItc3Bpbm5lcj5cbiAgICAgIDxjZHMtaWNvblxuICAgICAgICBjbGFzcz1cImFsZXJ0LWljb25cIlxuICAgICAgICByb2xlPVwiaW1nXCJcbiAgICAgICAgKm5nSWY9XCJpY29uU2VydmljZS5hbGVydEljb25TaGFwZSAhPT0gJ2xvYWRpbmcnXCJcbiAgICAgICAgW2F0dHIuc2hhcGVdPVwiaWNvblNlcnZpY2UuYWxlcnRJY29uU2hhcGVcIlxuICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImljb25TZXJ2aWNlLmFsZXJ0SWNvblRpdGxlXCJcbiAgICAgID48L2Nkcy1pY29uPlxuICAgIDwvZGl2PlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgYCxcbiAgaG9zdDogeyBjbGFzczogJ2FsZXJ0LWl0ZW0nIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsckFsZXJ0SXRlbSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpY29uU2VydmljZTogQWxlcnRJY29uQW5kVHlwZXNTZXJ2aWNlKSB7fVxufVxuIl19
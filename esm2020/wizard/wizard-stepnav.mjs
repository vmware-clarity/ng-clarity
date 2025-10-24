/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/page-collection.service";
import * as i2 from "@angular/common";
import * as i3 from "./wizard-stepnav-item";
export class ClrWizardStepnav {
    constructor(pageService) {
        this.pageService = pageService;
    }
}
ClrWizardStepnav.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizardStepnav, deps: [{ token: i1.PageCollectionService }], target: i0.ɵɵFactoryTarget.Component });
ClrWizardStepnav.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrWizardStepnav, selector: "clr-wizard-stepnav", inputs: { label: "label" }, host: { classAttribute: "clr-wizard-stepnav" }, ngImport: i0, template: `
    <nav [attr.aria-label]="label">
      <ol class="clr-wizard-stepnav-list">
        <li
          *ngFor="let page of pageService.pages; let i = index"
          clr-wizard-stepnav-item
          [page]="page"
          class="clr-wizard-stepnav-item"
        >
          {{ i + 1 }}
        </li>
      </ol>
    </nav>
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "component", type: i3.ClrWizardStepnavItem, selector: "[clr-wizard-stepnav-item]", inputs: ["page"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizardStepnav, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-wizard-stepnav',
                    template: `
    <nav [attr.aria-label]="label">
      <ol class="clr-wizard-stepnav-list">
        <li
          *ngFor="let page of pageService.pages; let i = index"
          clr-wizard-stepnav-item
          [page]="page"
          class="clr-wizard-stepnav-item"
        >
          {{ i + 1 }}
        </li>
      </ol>
    </nav>
  `,
                    host: { class: 'clr-wizard-stepnav' },
                }]
        }], ctorParameters: function () { return [{ type: i1.PageCollectionService }]; }, propDecorators: { label: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXN0ZXBuYXYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy93aXphcmQvd2l6YXJkLXN0ZXBuYXYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7QUFzQmpELE1BQU0sT0FBTyxnQkFBZ0I7SUFHM0IsWUFBbUIsV0FBa0M7UUFBbEMsZ0JBQVcsR0FBWCxXQUFXLENBQXVCO0lBQUcsQ0FBQzs7NkdBSDlDLGdCQUFnQjtpR0FBaEIsZ0JBQWdCLHNJQWhCakI7Ozs7Ozs7Ozs7Ozs7R0FhVDsyRkFHVSxnQkFBZ0I7a0JBbEI1QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7OztHQWFUO29CQUNELElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxvQkFBb0IsRUFBRTtpQkFDdEM7NEdBRVUsS0FBSztzQkFBYixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFBhZ2VDb2xsZWN0aW9uU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3BhZ2UtY29sbGVjdGlvbi5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLXdpemFyZC1zdGVwbmF2JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmF2IFthdHRyLmFyaWEtbGFiZWxdPVwibGFiZWxcIj5cbiAgICAgIDxvbCBjbGFzcz1cImNsci13aXphcmQtc3RlcG5hdi1saXN0XCI+XG4gICAgICAgIDxsaVxuICAgICAgICAgICpuZ0Zvcj1cImxldCBwYWdlIG9mIHBhZ2VTZXJ2aWNlLnBhZ2VzOyBsZXQgaSA9IGluZGV4XCJcbiAgICAgICAgICBjbHItd2l6YXJkLXN0ZXBuYXYtaXRlbVxuICAgICAgICAgIFtwYWdlXT1cInBhZ2VcIlxuICAgICAgICAgIGNsYXNzPVwiY2xyLXdpemFyZC1zdGVwbmF2LWl0ZW1cIlxuICAgICAgICA+XG4gICAgICAgICAge3sgaSArIDEgfX1cbiAgICAgICAgPC9saT5cbiAgICAgIDwvb2w+XG4gICAgPC9uYXY+XG4gIGAsXG4gIGhvc3Q6IHsgY2xhc3M6ICdjbHItd2l6YXJkLXN0ZXBuYXYnIH0sXG59KVxuZXhwb3J0IGNsYXNzIENscldpemFyZFN0ZXBuYXYge1xuICBASW5wdXQoKSBsYWJlbDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYWdlU2VydmljZTogUGFnZUNvbGxlY3Rpb25TZXJ2aWNlKSB7fVxufVxuIl19
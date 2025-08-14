/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ViewChild } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/detail.service";
import * as i2 from "../../utils/i18n/common-strings.service";
import * as i3 from "../../icon/icon";
export class ClrDatagridDetailHeader {
    constructor(detailService, commonStrings) {
        this.detailService = detailService;
        this.commonStrings = commonStrings;
    }
    get titleId() {
        return `${this.detailService.id}-title`;
    }
    ngAfterViewInit() {
        this.title.nativeElement.focus();
    }
}
ClrDatagridDetailHeader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridDetailHeader, deps: [{ token: i1.DetailService }, { token: i2.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagridDetailHeader.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridDetailHeader, selector: "clr-dg-detail-header", host: { properties: { "class.datagrid-detail-header": "true" } }, viewQueries: [{ propertyName: "title", first: true, predicate: ["title"], descendants: true }], ngImport: i0, template: `
    <div #title class="datagrid-detail-header-title" tabindex="-1" [id]="titleId">
      <ng-content></ng-content>
    </div>
    <div class="datagrid-detail-pane-close">
      <button
        type="button"
        class="btn btn-icon btn-link"
        (click)="detailService.close()"
        [attr.aria-label]="commonStrings.keys.close"
      >
        <cds-icon shape="times"></cds-icon>
      </button>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i3.CdsIconCustomTag, selector: "cds-icon" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridDetailHeader, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-detail-header',
                    host: {
                        '[class.datagrid-detail-header]': 'true',
                    },
                    template: `
    <div #title class="datagrid-detail-header-title" tabindex="-1" [id]="titleId">
      <ng-content></ng-content>
    </div>
    <div class="datagrid-detail-pane-close">
      <button
        type="button"
        class="btn btn-icon btn-link"
        (click)="detailService.close()"
        [attr.aria-label]="commonStrings.keys.close"
      >
        <cds-icon shape="times"></cds-icon>
      </button>
    </div>
  `,
                }]
        }], ctorParameters: function () { return [{ type: i1.DetailService }, { type: i2.ClrCommonStringsService }]; }, propDecorators: { title: [{
                type: ViewChild,
                args: ['title']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtZGV0YWlsLWhlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvZGF0YWdyaWQtZGV0YWlsLWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBaUIsU0FBUyxFQUFjLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7QUEwQmhGLE1BQU0sT0FBTyx1QkFBdUI7SUFHbEMsWUFBbUIsYUFBNEIsRUFBUyxhQUFzQztRQUEzRSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFTLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtJQUFHLENBQUM7SUFFbEcsSUFBSSxPQUFPO1FBQ1QsT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxRQUFRLENBQUM7SUFDMUMsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNuQyxDQUFDOztvSEFYVSx1QkFBdUI7d0dBQXZCLHVCQUF1Qiw4TkFoQnhCOzs7Ozs7Ozs7Ozs7OztHQWNUOzJGQUVVLHVCQUF1QjtrQkFyQm5DLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtvQkFDaEMsSUFBSSxFQUFFO3dCQUNKLGdDQUFnQyxFQUFFLE1BQU07cUJBQ3pDO29CQUNELFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7R0FjVDtpQkFDRjswSUFFcUIsS0FBSztzQkFBeEIsU0FBUzt1QkFBQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJDb21tb25TdHJpbmdzU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL2kxOG4vY29tbW9uLXN0cmluZ3Muc2VydmljZSc7XG5pbXBvcnQgeyBEZXRhaWxTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGV0YWlsLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZGctZGV0YWlsLWhlYWRlcicsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmRhdGFncmlkLWRldGFpbC1oZWFkZXJdJzogJ3RydWUnLFxuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgI3RpdGxlIGNsYXNzPVwiZGF0YWdyaWQtZGV0YWlsLWhlYWRlci10aXRsZVwiIHRhYmluZGV4PVwiLTFcIiBbaWRdPVwidGl0bGVJZFwiPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1kZXRhaWwtcGFuZS1jbG9zZVwiPlxuICAgICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgY2xhc3M9XCJidG4gYnRuLWljb24gYnRuLWxpbmtcIlxuICAgICAgICAoY2xpY2spPVwiZGV0YWlsU2VydmljZS5jbG9zZSgpXCJcbiAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjb21tb25TdHJpbmdzLmtleXMuY2xvc2VcIlxuICAgICAgPlxuICAgICAgICA8Y2RzLWljb24gc2hhcGU9XCJ0aW1lc1wiPjwvY2RzLWljb24+XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWdyaWREZXRhaWxIZWFkZXIgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgQFZpZXdDaGlsZCgndGl0bGUnKSB0aXRsZTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgY29uc3RydWN0b3IocHVibGljIGRldGFpbFNlcnZpY2U6IERldGFpbFNlcnZpY2UsIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSkge31cblxuICBnZXQgdGl0bGVJZCgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5kZXRhaWxTZXJ2aWNlLmlkfS10aXRsZWA7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy50aXRsZS5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cbn1cbiJdfQ==
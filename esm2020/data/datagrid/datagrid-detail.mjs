/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChild, Input } from '@angular/core';
import { ClrDatagridDetailHeader } from './datagrid-detail-header';
import * as i0 from "@angular/core";
import * as i1 from "./providers/detail.service";
import * as i2 from "../../utils/i18n/common-strings.service";
import * as i3 from "@angular/common";
import * as i4 from "../../utils/cdk/cdk-trap-focus.module";
export class ClrDatagridDetail {
    constructor(detailService, commonStrings) {
        this.detailService = detailService;
        this.commonStrings = commonStrings;
    }
    get labelledBy() {
        if (this.ariaLabelledBy) {
            return this.header ? `${this.header.titleId} ${this.ariaLabelledBy}` : this.ariaLabelledBy;
        }
        else if (this.ariaLabel) {
            // If aria-label is set by the end user, do not set aria-labelledby
            return null;
        }
        else {
            return this.header?.titleId || '';
        }
    }
    get label() {
        if (!this.ariaLabelledBy) {
            return this.ariaLabel || null;
        }
        else {
            return null;
        }
    }
    close() {
        this.detailService.close();
    }
}
ClrDatagridDetail.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridDetail, deps: [{ token: i1.DetailService }, { token: i2.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagridDetail.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridDetail, selector: "clr-dg-detail", inputs: { ariaLabelledBy: ["clrDetailAriaLabelledBy", "ariaLabelledBy"], ariaLabel: ["clrDetailAriaLabel", "ariaLabel"] }, host: { properties: { "class.datagrid-detail-pane": "true" } }, queries: [{ propertyName: "header", first: true, predicate: ClrDatagridDetailHeader, descendants: true }], ngImport: i0, template: `
    <div
      cdkTrapFocus
      [cdkTrapFocusAutoCapture]="!header"
      class="datagrid-detail-pane-content"
      *ngIf="detailService.isOpen"
      role="dialog"
      [id]="detailService.id"
      aria-modal="true"
      [attr.aria-labelledby]="labelledBy"
      [attr.aria-label]="label"
    >
      <div class="clr-sr-only">{{ commonStrings.keys.detailPaneStart }}</div>
      <ng-content></ng-content>
      <div class="clr-sr-only">{{ commonStrings.keys.detailPaneEnd }}</div>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i4.CdkTrapFocusModule_CdkTrapFocus, selector: "[cdkTrapFocus]" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridDetail, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-detail',
                    host: {
                        '[class.datagrid-detail-pane]': 'true',
                    },
                    // We put the *ngIf on the cdkTrapFocus so it doesn't always exist on the page
                    // have to test for presence of header for aria-describedby because it was causing unit tests to crash
                    template: `
    <div
      cdkTrapFocus
      [cdkTrapFocusAutoCapture]="!header"
      class="datagrid-detail-pane-content"
      *ngIf="detailService.isOpen"
      role="dialog"
      [id]="detailService.id"
      aria-modal="true"
      [attr.aria-labelledby]="labelledBy"
      [attr.aria-label]="label"
    >
      <div class="clr-sr-only">{{ commonStrings.keys.detailPaneStart }}</div>
      <ng-content></ng-content>
      <div class="clr-sr-only">{{ commonStrings.keys.detailPaneEnd }}</div>
    </div>
  `,
                }]
        }], ctorParameters: function () { return [{ type: i1.DetailService }, { type: i2.ClrCommonStringsService }]; }, propDecorators: { ariaLabelledBy: [{
                type: Input,
                args: ['clrDetailAriaLabelledBy']
            }], ariaLabel: [{
                type: Input,
                args: ['clrDetailAriaLabel']
            }], header: [{
                type: ContentChild,
                args: [ClrDatagridDetailHeader]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtZGV0YWlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC1kZXRhaWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHL0QsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sMEJBQTBCLENBQUM7Ozs7OztBQTRCbkUsTUFBTSxPQUFPLGlCQUFpQjtJQU01QixZQUFtQixhQUE0QixFQUFTLGFBQXNDO1FBQTNFLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQVMsa0JBQWEsR0FBYixhQUFhLENBQXlCO0lBQUcsQ0FBQztJQUVsRyxJQUFJLFVBQVU7UUFDWixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdkIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztTQUM1RjthQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUN6QixtRUFBbUU7WUFDbkUsT0FBTyxJQUFJLENBQUM7U0FDYjthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sSUFBSSxFQUFFLENBQUM7U0FDbkM7SUFDSCxDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDeEIsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQztTQUMvQjthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUM7U0FDYjtJQUNILENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM3QixDQUFDOzs4R0E3QlUsaUJBQWlCO2tHQUFqQixpQkFBaUIsb1JBSWQsdUJBQXVCLGdEQXRCM0I7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQlQ7MkZBRVUsaUJBQWlCO2tCQXpCN0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsZUFBZTtvQkFDekIsSUFBSSxFQUFFO3dCQUNKLDhCQUE4QixFQUFFLE1BQU07cUJBQ3ZDO29CQUNELDhFQUE4RTtvQkFDOUUsc0dBQXNHO29CQUN0RyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQlQ7aUJBQ0Y7MElBRW1DLGNBQWM7c0JBQS9DLEtBQUs7dUJBQUMseUJBQXlCO2dCQUNILFNBQVM7c0JBQXJDLEtBQUs7dUJBQUMsb0JBQW9CO2dCQUVZLE1BQU07c0JBQTVDLFlBQVk7dUJBQUMsdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWREZXRhaWxIZWFkZXIgfSBmcm9tICcuL2RhdGFncmlkLWRldGFpbC1oZWFkZXInO1xuaW1wb3J0IHsgRGV0YWlsU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2RldGFpbC5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWRnLWRldGFpbCcsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmRhdGFncmlkLWRldGFpbC1wYW5lXSc6ICd0cnVlJyxcbiAgfSxcbiAgLy8gV2UgcHV0IHRoZSAqbmdJZiBvbiB0aGUgY2RrVHJhcEZvY3VzIHNvIGl0IGRvZXNuJ3QgYWx3YXlzIGV4aXN0IG9uIHRoZSBwYWdlXG4gIC8vIGhhdmUgdG8gdGVzdCBmb3IgcHJlc2VuY2Ugb2YgaGVhZGVyIGZvciBhcmlhLWRlc2NyaWJlZGJ5IGJlY2F1c2UgaXQgd2FzIGNhdXNpbmcgdW5pdCB0ZXN0cyB0byBjcmFzaFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXZcbiAgICAgIGNka1RyYXBGb2N1c1xuICAgICAgW2Nka1RyYXBGb2N1c0F1dG9DYXB0dXJlXT1cIiFoZWFkZXJcIlxuICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1kZXRhaWwtcGFuZS1jb250ZW50XCJcbiAgICAgICpuZ0lmPVwiZGV0YWlsU2VydmljZS5pc09wZW5cIlxuICAgICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgICBbaWRdPVwiZGV0YWlsU2VydmljZS5pZFwiXG4gICAgICBhcmlhLW1vZGFsPVwidHJ1ZVwiXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwibGFiZWxsZWRCeVwiXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImxhYmVsXCJcbiAgICA+XG4gICAgICA8ZGl2IGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57eyBjb21tb25TdHJpbmdzLmtleXMuZGV0YWlsUGFuZVN0YXJ0IH19PC9kaXY+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICA8ZGl2IGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57eyBjb21tb25TdHJpbmdzLmtleXMuZGV0YWlsUGFuZUVuZCB9fTwvZGl2PlxuICAgIDwvZGl2PlxuICBgLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEYXRhZ3JpZERldGFpbCB7XG4gIEBJbnB1dCgnY2xyRGV0YWlsQXJpYUxhYmVsbGVkQnknKSBhcmlhTGFiZWxsZWRCeTogc3RyaW5nO1xuICBASW5wdXQoJ2NsckRldGFpbEFyaWFMYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIEBDb250ZW50Q2hpbGQoQ2xyRGF0YWdyaWREZXRhaWxIZWFkZXIpIGhlYWRlcjogQ2xyRGF0YWdyaWREZXRhaWxIZWFkZXI7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGRldGFpbFNlcnZpY2U6IERldGFpbFNlcnZpY2UsIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSkge31cblxuICBnZXQgbGFiZWxsZWRCeSgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmFyaWFMYWJlbGxlZEJ5KSB7XG4gICAgICByZXR1cm4gdGhpcy5oZWFkZXIgPyBgJHt0aGlzLmhlYWRlci50aXRsZUlkfSAke3RoaXMuYXJpYUxhYmVsbGVkQnl9YCA6IHRoaXMuYXJpYUxhYmVsbGVkQnk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmFyaWFMYWJlbCkge1xuICAgICAgLy8gSWYgYXJpYS1sYWJlbCBpcyBzZXQgYnkgdGhlIGVuZCB1c2VyLCBkbyBub3Qgc2V0IGFyaWEtbGFiZWxsZWRieVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmhlYWRlcj8udGl0bGVJZCB8fCAnJztcbiAgICB9XG4gIH1cblxuICBnZXQgbGFiZWwoKTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMuYXJpYUxhYmVsbGVkQnkpIHtcbiAgICAgIHJldHVybiB0aGlzLmFyaWFMYWJlbCB8fCBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBjbG9zZSgpOiB2b2lkIHtcbiAgICB0aGlzLmRldGFpbFNlcnZpY2UuY2xvc2UoKTtcbiAgfVxufVxuIl19
/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';
import { SelectionType } from './enums/selection-type';
import * as i0 from "@angular/core";
import * as i1 from "./providers/selection";
import * as i2 from "./providers/detail.service";
import * as i3 from "./providers/columns.service";
import * as i4 from "../../utils";
import * as i5 from "@angular/common";
import * as i6 from "../../forms/common/label";
import * as i7 from "../../forms/checkbox/checkbox";
import * as i8 from "../../forms/checkbox/checkbox-wrapper";
import * as i9 from "./datagrid-column-toggle";
export class ClrDatagridFooter {
    constructor(selection, detailService, columnsService, commonStrings) {
        this.selection = selection;
        this.detailService = detailService;
        this.columnsService = columnsService;
        this.commonStrings = commonStrings;
        /* reference to the enum so that template can access */
        this.SELECTION_TYPE = SelectionType;
    }
    get hasHideableColumns() {
        return this.columnsService.hasHideableColumns;
    }
}
ClrDatagridFooter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridFooter, deps: [{ token: i1.Selection }, { token: i2.DetailService }, { token: i3.ColumnsService }, { token: i4.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagridFooter.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridFooter, selector: "clr-dg-footer", host: { properties: { "class.datagrid-footer": "true" } }, ngImport: i0, template: `
    <ng-container *ngIf="selection.selectionType === SELECTION_TYPE.Multi && selection.current.length > 0">
      <div class="clr-form-control-disabled">
        <clr-checkbox-wrapper class="datagrid-footer-select">
          <input clrCheckbox type="checkbox" checked="checked" disabled />
          <label>{{ selection.current.length }}</label>
          <span class="clr-sr-only">{{ commonStrings.keys.selectedRows }}</span>
        </clr-checkbox-wrapper>
      </div>
    </ng-container>
    <ng-container *ngIf="!detailService.isOpen">
      <clr-dg-column-toggle *ngIf="hasHideableColumns"></clr-dg-column-toggle>
      <div class="datagrid-footer-description">
        <ng-content></ng-content>
      </div>
    </ng-container>
    <ng-content select="clr-dg-pagination"></ng-content>
  `, isInline: true, dependencies: [{ kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.ClrLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i7.ClrCheckbox, selector: "[clrCheckbox],[clrToggle]" }, { kind: "component", type: i8.ClrCheckboxWrapper, selector: "clr-checkbox-wrapper,clr-toggle-wrapper" }, { kind: "component", type: i9.ClrDatagridColumnToggle, selector: "clr-dg-column-toggle" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridFooter, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-footer',
                    template: `
    <ng-container *ngIf="selection.selectionType === SELECTION_TYPE.Multi && selection.current.length > 0">
      <div class="clr-form-control-disabled">
        <clr-checkbox-wrapper class="datagrid-footer-select">
          <input clrCheckbox type="checkbox" checked="checked" disabled />
          <label>{{ selection.current.length }}</label>
          <span class="clr-sr-only">{{ commonStrings.keys.selectedRows }}</span>
        </clr-checkbox-wrapper>
      </div>
    </ng-container>
    <ng-container *ngIf="!detailService.isOpen">
      <clr-dg-column-toggle *ngIf="hasHideableColumns"></clr-dg-column-toggle>
      <div class="datagrid-footer-description">
        <ng-content></ng-content>
      </div>
    </ng-container>
    <ng-content select="clr-dg-pagination"></ng-content>
  `,
                    host: {
                        '[class.datagrid-footer]': 'true',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.Selection }, { type: i2.DetailService }, { type: i3.ColumnsService }, { type: i4.ClrCommonStringsService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtZm9vdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC1mb290ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7Ozs7Ozs7Ozs7QUE2QnZELE1BQU0sT0FBTyxpQkFBaUI7SUFJNUIsWUFDUyxTQUF1QixFQUN2QixhQUE0QixFQUMzQixjQUE4QixFQUMvQixhQUFzQztRQUh0QyxjQUFTLEdBQVQsU0FBUyxDQUFjO1FBQ3ZCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzNCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUMvQixrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFQL0MsdURBQXVEO1FBQ3ZELG1CQUFjLEdBQUcsYUFBYSxDQUFDO0lBTzVCLENBQUM7SUFFSixJQUFJLGtCQUFrQjtRQUNwQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUM7SUFDaEQsQ0FBQzs7OEdBYlUsaUJBQWlCO2tHQUFqQixpQkFBaUIsZ0hBdEJsQjs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQlQ7MkZBS1UsaUJBQWlCO2tCQXhCN0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsZUFBZTtvQkFDekIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCVDtvQkFDRCxJQUFJLEVBQUU7d0JBQ0oseUJBQXlCLEVBQUUsTUFBTTtxQkFDbEM7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJDb21tb25TdHJpbmdzU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IFNlbGVjdGlvblR5cGUgfSBmcm9tICcuL2VudW1zL3NlbGVjdGlvbi10eXBlJztcbmltcG9ydCB7IENvbHVtbnNTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvY29sdW1ucy5zZXJ2aWNlJztcbmltcG9ydCB7IERldGFpbFNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9kZXRhaWwuc2VydmljZSc7XG5pbXBvcnQgeyBTZWxlY3Rpb24gfSBmcm9tICcuL3Byb3ZpZGVycy9zZWxlY3Rpb24nO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZGctZm9vdGVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwic2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNFTEVDVElPTl9UWVBFLk11bHRpICYmIHNlbGVjdGlvbi5jdXJyZW50Lmxlbmd0aCA+IDBcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjbHItZm9ybS1jb250cm9sLWRpc2FibGVkXCI+XG4gICAgICAgIDxjbHItY2hlY2tib3gtd3JhcHBlciBjbGFzcz1cImRhdGFncmlkLWZvb3Rlci1zZWxlY3RcIj5cbiAgICAgICAgICA8aW5wdXQgY2xyQ2hlY2tib3ggdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD1cImNoZWNrZWRcIiBkaXNhYmxlZCAvPlxuICAgICAgICAgIDxsYWJlbD57eyBzZWxlY3Rpb24uY3VycmVudC5sZW5ndGggfX08L2xhYmVsPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57eyBjb21tb25TdHJpbmdzLmtleXMuc2VsZWN0ZWRSb3dzIH19PC9zcGFuPlxuICAgICAgICA8L2Nsci1jaGVja2JveC13cmFwcGVyPlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFkZXRhaWxTZXJ2aWNlLmlzT3BlblwiPlxuICAgICAgPGNsci1kZy1jb2x1bW4tdG9nZ2xlICpuZ0lmPVwiaGFzSGlkZWFibGVDb2x1bW5zXCI+PC9jbHItZGctY29sdW1uLXRvZ2dsZT5cbiAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1mb290ZXItZGVzY3JpcHRpb25cIj5cbiAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWRnLXBhZ2luYXRpb25cIj48L25nLWNvbnRlbnQ+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmRhdGFncmlkLWZvb3Rlcl0nOiAndHJ1ZScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsckRhdGFncmlkRm9vdGVyPFQgPSBhbnk+IHtcbiAgLyogcmVmZXJlbmNlIHRvIHRoZSBlbnVtIHNvIHRoYXQgdGVtcGxhdGUgY2FuIGFjY2VzcyAqL1xuICBTRUxFQ1RJT05fVFlQRSA9IFNlbGVjdGlvblR5cGU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHNlbGVjdGlvbjogU2VsZWN0aW9uPFQ+LFxuICAgIHB1YmxpYyBkZXRhaWxTZXJ2aWNlOiBEZXRhaWxTZXJ2aWNlLFxuICAgIHByaXZhdGUgY29sdW1uc1NlcnZpY2U6IENvbHVtbnNTZXJ2aWNlLFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZVxuICApIHt9XG5cbiAgZ2V0IGhhc0hpZGVhYmxlQ29sdW1ucygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb2x1bW5zU2VydmljZS5oYXNIaWRlYWJsZUNvbHVtbnM7XG4gIH1cbn1cbiJdfQ==
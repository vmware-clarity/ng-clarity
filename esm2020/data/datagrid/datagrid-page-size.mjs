/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, Input, ViewChild } from '@angular/core';
import { ClrLabel } from '../../forms';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import * as i0 from "@angular/core";
import * as i1 from "./providers/page";
import * as i2 from "@angular/common";
import * as i3 from "../../forms/common/label";
import * as i4 from "@angular/forms";
export class ClrDatagridPageSize {
    constructor(page) {
        this.page = page;
        this.pageSizeOptionsId = uniqueIdFactory();
    }
    set label(label) {
        if (label) {
            label.disableGrid();
        }
    }
    ngOnInit() {
        if (!this.pageSizeOptions || this.pageSizeOptions.length === 0) {
            this.pageSizeOptions = [this.page.size];
        }
    }
}
ClrDatagridPageSize.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridPageSize, deps: [{ token: i1.Page }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagridPageSize.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridPageSize, selector: "clr-dg-page-size", inputs: { pageSizeOptions: ["clrPageSizeOptions", "pageSizeOptions"], pageSizeOptionsId: ["clrPageSizeOptionsId", "pageSizeOptionsId"] }, viewQueries: [{ propertyName: "label", first: true, predicate: ClrLabel, descendants: true, static: true }], ngImport: i0, template: `
    <label [for]="pageSizeOptionsId"><ng-content></ng-content></label>
    <div class="clr-select-wrapper">
      <select [id]="pageSizeOptionsId" [class.clr-page-size-select]="true" [(ngModel)]="page.size">
        <option *ngFor="let option of pageSizeOptions" [ngValue]="option">{{ option }}</option>
      </select>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.ClrLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i4.NgSelectOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i4.ɵNgSelectMultipleOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i4.SelectControlValueAccessor, selector: "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]", inputs: ["compareWith"] }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridPageSize, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-page-size',
                    template: `
    <label [for]="pageSizeOptionsId"><ng-content></ng-content></label>
    <div class="clr-select-wrapper">
      <select [id]="pageSizeOptionsId" [class.clr-page-size-select]="true" [(ngModel)]="page.size">
        <option *ngFor="let option of pageSizeOptions" [ngValue]="option">{{ option }}</option>
      </select>
    </div>
  `,
                }]
        }], ctorParameters: function () { return [{ type: i1.Page }]; }, propDecorators: { pageSizeOptions: [{
                type: Input,
                args: ['clrPageSizeOptions']
            }], pageSizeOptionsId: [{
                type: Input,
                args: ['clrPageSizeOptionsId']
            }], label: [{
                type: ViewChild,
                args: [ClrLabel, { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtcGFnZS1zaXplLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC1wYWdlLXNpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFNUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN2QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sK0NBQStDLENBQUM7Ozs7OztBQWNoRixNQUFNLE9BQU8sbUJBQW1CO0lBSTlCLFlBQW1CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBRkUsc0JBQWlCLEdBQUcsZUFBZSxFQUFFLENBQUM7SUFFckMsQ0FBQztJQUVqQyxJQUNJLEtBQUssQ0FBQyxLQUFlO1FBQ3ZCLElBQUksS0FBSyxFQUFFO1lBQ1QsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDOUQsSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDekM7SUFDSCxDQUFDOztnSEFqQlUsbUJBQW1CO29HQUFuQixtQkFBbUIseU9BTW5CLFFBQVEsOERBZlQ7Ozs7Ozs7R0FPVDsyRkFFVSxtQkFBbUI7a0JBWC9CLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGtCQUFrQjtvQkFDNUIsUUFBUSxFQUFFOzs7Ozs7O0dBT1Q7aUJBQ0Y7MkZBRThCLGVBQWU7c0JBQTNDLEtBQUs7dUJBQUMsb0JBQW9CO2dCQUNJLGlCQUFpQjtzQkFBL0MsS0FBSzt1QkFBQyxzQkFBc0I7Z0JBS3pCLEtBQUs7c0JBRFIsU0FBUzt1QkFBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyTGFiZWwgfSBmcm9tICcuLi8uLi9mb3Jtcyc7XG5pbXBvcnQgeyB1bmlxdWVJZEZhY3RvcnkgfSBmcm9tICcuLi8uLi91dGlscy9pZC1nZW5lcmF0b3IvaWQtZ2VuZXJhdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gJy4vcHJvdmlkZXJzL3BhZ2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZGctcGFnZS1zaXplJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bGFiZWwgW2Zvcl09XCJwYWdlU2l6ZU9wdGlvbnNJZFwiPjxuZy1jb250ZW50PjwvbmctY29udGVudD48L2xhYmVsPlxuICAgIDxkaXYgY2xhc3M9XCJjbHItc2VsZWN0LXdyYXBwZXJcIj5cbiAgICAgIDxzZWxlY3QgW2lkXT1cInBhZ2VTaXplT3B0aW9uc0lkXCIgW2NsYXNzLmNsci1wYWdlLXNpemUtc2VsZWN0XT1cInRydWVcIiBbKG5nTW9kZWwpXT1cInBhZ2Uuc2l6ZVwiPlxuICAgICAgICA8b3B0aW9uICpuZ0Zvcj1cImxldCBvcHRpb24gb2YgcGFnZVNpemVPcHRpb25zXCIgW25nVmFsdWVdPVwib3B0aW9uXCI+e3sgb3B0aW9uIH19PC9vcHRpb24+XG4gICAgICA8L3NlbGVjdD5cbiAgICA8L2Rpdj5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWdyaWRQYWdlU2l6ZSB7XG4gIEBJbnB1dCgnY2xyUGFnZVNpemVPcHRpb25zJykgcGFnZVNpemVPcHRpb25zOiBudW1iZXJbXTtcbiAgQElucHV0KCdjbHJQYWdlU2l6ZU9wdGlvbnNJZCcpIHBhZ2VTaXplT3B0aW9uc0lkID0gdW5pcXVlSWRGYWN0b3J5KCk7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBhZ2U6IFBhZ2UpIHt9XG5cbiAgQFZpZXdDaGlsZChDbHJMYWJlbCwgeyBzdGF0aWM6IHRydWUgfSlcbiAgc2V0IGxhYmVsKGxhYmVsOiBDbHJMYWJlbCkge1xuICAgIGlmIChsYWJlbCkge1xuICAgICAgbGFiZWwuZGlzYWJsZUdyaWQoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAoIXRoaXMucGFnZVNpemVPcHRpb25zIHx8IHRoaXMucGFnZVNpemVPcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5wYWdlU2l6ZU9wdGlvbnMgPSBbdGhpcy5wYWdlLnNpemVdO1xuICAgIH1cbiAgfVxufVxuIl19
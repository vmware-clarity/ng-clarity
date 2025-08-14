/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, Input } from '@angular/core';
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
    ngOnInit() {
        if (!this.pageSizeOptions || this.pageSizeOptions.length === 0) {
            this.pageSizeOptions = [this.page.size];
        }
    }
}
ClrDatagridPageSize.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridPageSize, deps: [{ token: i1.Page }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagridPageSize.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridPageSize, selector: "clr-dg-page-size", inputs: { pageSizeOptions: ["clrPageSizeOptions", "pageSizeOptions"], pageSizeOptionsId: ["clrPageSizeOptionsId", "pageSizeOptionsId"] }, ngImport: i0, template: `
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
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtcGFnZS1zaXplLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC1wYWdlLXNpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVqRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sK0NBQStDLENBQUM7Ozs7OztBQWNoRixNQUFNLE9BQU8sbUJBQW1CO0lBSTlCLFlBQW1CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBRkUsc0JBQWlCLEdBQUcsZUFBZSxFQUFFLENBQUM7SUFFckMsQ0FBQztJQUVqQyxRQUFRO1FBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzlELElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQzs7Z0hBVlUsbUJBQW1CO29HQUFuQixtQkFBbUIsa01BVHBCOzs7Ozs7O0dBT1Q7MkZBRVUsbUJBQW1CO2tCQVgvQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLFFBQVEsRUFBRTs7Ozs7OztHQU9UO2lCQUNGOzJGQUU4QixlQUFlO3NCQUEzQyxLQUFLO3VCQUFDLG9CQUFvQjtnQkFDSSxpQkFBaUI7c0JBQS9DLEtBQUs7dUJBQUMsc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IHVuaXF1ZUlkRmFjdG9yeSB9IGZyb20gJy4uLy4uL3V0aWxzL2lkLWdlbmVyYXRvci9pZC1nZW5lcmF0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSAnLi9wcm92aWRlcnMvcGFnZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1kZy1wYWdlLXNpemUnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxsYWJlbCBbZm9yXT1cInBhZ2VTaXplT3B0aW9uc0lkXCI+PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PjwvbGFiZWw+XG4gICAgPGRpdiBjbGFzcz1cImNsci1zZWxlY3Qtd3JhcHBlclwiPlxuICAgICAgPHNlbGVjdCBbaWRdPVwicGFnZVNpemVPcHRpb25zSWRcIiBbY2xhc3MuY2xyLXBhZ2Utc2l6ZS1zZWxlY3RdPVwidHJ1ZVwiIFsobmdNb2RlbCldPVwicGFnZS5zaXplXCI+XG4gICAgICAgIDxvcHRpb24gKm5nRm9yPVwibGV0IG9wdGlvbiBvZiBwYWdlU2l6ZU9wdGlvbnNcIiBbbmdWYWx1ZV09XCJvcHRpb25cIj57eyBvcHRpb24gfX08L29wdGlvbj5cbiAgICAgIDwvc2VsZWN0PlxuICAgIDwvZGl2PlxuICBgLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEYXRhZ3JpZFBhZ2VTaXplIHtcbiAgQElucHV0KCdjbHJQYWdlU2l6ZU9wdGlvbnMnKSBwYWdlU2l6ZU9wdGlvbnM6IG51bWJlcltdO1xuICBASW5wdXQoJ2NsclBhZ2VTaXplT3B0aW9uc0lkJykgcGFnZVNpemVPcHRpb25zSWQgPSB1bmlxdWVJZEZhY3RvcnkoKTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGFnZTogUGFnZSkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAoIXRoaXMucGFnZVNpemVPcHRpb25zIHx8IHRoaXMucGFnZVNpemVPcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5wYWdlU2l6ZU9wdGlvbnMgPSBbdGhpcy5wYWdlLnNpemVdO1xuICAgIH1cbiAgfVxufVxuIl19
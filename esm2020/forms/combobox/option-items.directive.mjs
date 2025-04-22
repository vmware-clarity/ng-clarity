/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { NgForOf } from '@angular/common';
import { Directive, Input, } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/option-selection.service";
import * as i2 from "../../utils/popover/providers/popover-position.service";
export class ClrOptionItems {
    constructor(template, differs, optionService, positionService, vcr) {
        this.template = template;
        this.differs = differs;
        this.optionService = optionService;
        this.positionService = positionService;
        this.subscriptions = [];
        this.filter = '';
        this.differ = null;
        this.iterableProxy = new NgForOf(vcr, template, differs);
        this.subscriptions.push(optionService.inputChanged.subscribe(filter => {
            this.filter = filter;
            this.updateItems();
        }));
    }
    set rawItems(items) {
        this._rawItems = items ? items : [];
        this.updateItems();
    }
    set trackBy(value) {
        this.iterableProxy.ngForTrackBy = value;
    }
    set field(field) {
        this._filterField = field;
        this.optionService.displayField = field;
    }
    ngDoCheck() {
        if (!this.differ) {
            this.differ = this.differs.find(this.filteredItems).create(this.iterableProxy.ngForTrackBy);
        }
        if (this.differ) {
            const changes = this.differ.diff(this.filteredItems);
            if (changes) {
                this.iterableProxy.ngDoCheck();
                this.positionService.realign();
            }
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    updateItems() {
        if (!this._rawItems || this.filter === undefined || this.filter === null) {
            return;
        }
        const normalizedFilterValue = normalizeValue(this.filter);
        if (this.optionService.showAllOptions) {
            this.filteredItems = this._rawItems;
        }
        else if (this._filterField) {
            this.filteredItems = this._rawItems.filter(item => {
                const objValue = item[this._filterField];
                return objValue ? normalizeValue(objValue).includes(normalizedFilterValue) : false;
            });
        }
        else {
            // Filter by all item object values
            this.filteredItems = this._rawItems.filter(item => {
                if (typeof item !== 'object') {
                    return normalizeValue(item).includes(normalizedFilterValue);
                }
                const objValues = Object.values(item).filter(value => {
                    return value !== null && value !== undefined ? normalizeValue(value).includes(normalizedFilterValue) : false;
                });
                return objValues.length > 0;
            });
        }
        this.iterableProxy.ngForOf = this.filteredItems;
    }
}
ClrOptionItems.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrOptionItems, deps: [{ token: i0.TemplateRef }, { token: i0.IterableDiffers }, { token: i1.OptionSelectionService }, { token: i2.ClrPopoverPositionService }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrOptionItems.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrOptionItems, selector: "[clrOptionItems][clrOptionItemsOf]", inputs: { rawItems: ["clrOptionItemsOf", "rawItems"], trackBy: ["clrOptionItemsTrackBy", "trackBy"], field: ["clrOptionItemsField", "field"] }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrOptionItems, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrOptionItems][clrOptionItemsOf]',
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i0.IterableDiffers }, { type: i1.OptionSelectionService }, { type: i2.ClrPopoverPositionService }, { type: i0.ViewContainerRef }]; }, propDecorators: { rawItems: [{
                type: Input,
                args: ['clrOptionItemsOf']
            }], trackBy: [{
                type: Input,
                args: ['clrOptionItemsTrackBy']
            }], field: [{
                type: Input,
                args: ['clrOptionItemsField']
            }] } });
function normalizeValue(value) {
    return value
        .toString()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uLWl0ZW1zLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2NvbWJvYm94L29wdGlvbi1pdGVtcy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFrQixNQUFNLGlCQUFpQixDQUFDO0FBQzFELE9BQU8sRUFDTCxTQUFTLEVBRVQsS0FBSyxHQU9OLE1BQU0sZUFBZSxDQUFDOzs7O0FBU3ZCLE1BQU0sT0FBTyxjQUFjO0lBU3pCLFlBQ1MsUUFBd0MsRUFDdkMsT0FBd0IsRUFDeEIsYUFBd0MsRUFDeEMsZUFBMEMsRUFDbEQsR0FBcUI7UUFKZCxhQUFRLEdBQVIsUUFBUSxDQUFnQztRQUN2QyxZQUFPLEdBQVAsT0FBTyxDQUFpQjtRQUN4QixrQkFBYSxHQUFiLGFBQWEsQ0FBMkI7UUFDeEMsb0JBQWUsR0FBZixlQUFlLENBQTJCO1FBVDVDLGtCQUFhLEdBQW1CLEVBQUUsQ0FBQztRQUNuQyxXQUFNLEdBQUcsRUFBRSxDQUFDO1FBRVosV0FBTSxHQUE2QixJQUFJLENBQUM7UUFTOUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLE9BQU8sQ0FBSSxHQUFHLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNyQixhQUFhLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM1QyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUNyQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFFRCxJQUNJLFFBQVEsQ0FBQyxLQUFVO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFL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LEdBQUcsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQ2xELENBQUM7OzJHQXRGVSxjQUFjOytGQUFkLGNBQWM7MkZBQWQsY0FBYztrQkFIMUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsb0NBQW9DO2lCQUMvQzs0T0EyQkssUUFBUTtzQkFEWCxLQUFLO3VCQUFDLGtCQUFrQjtnQkFPckIsT0FBTztzQkFEVixLQUFLO3VCQUFDLHVCQUF1QjtnQkFNMUIsS0FBSztzQkFEUixLQUFLO3VCQUFDLHFCQUFxQjs7QUFxRDlCLFNBQVMsY0FBYyxDQUFDLEtBQVU7SUFDaEMsT0FBTyxLQUFLO1NBQ1QsUUFBUSxFQUFFO1NBQ1YsU0FBUyxDQUFDLEtBQUssQ0FBQztTQUNoQixPQUFPLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDO1NBQzlCLFdBQVcsRUFBRSxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IE5nRm9yT2YsIE5nRm9yT2ZDb250ZXh0IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRG9DaGVjayxcbiAgSW5wdXQsXG4gIEl0ZXJhYmxlRGlmZmVyLFxuICBJdGVyYWJsZURpZmZlcnMsXG4gIE9uRGVzdHJveSxcbiAgVGVtcGxhdGVSZWYsXG4gIFRyYWNrQnlGdW5jdGlvbixcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQ2xyUG9wb3ZlclBvc2l0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvcHJvdmlkZXJzL3BvcG92ZXItcG9zaXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBPcHRpb25TZWxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvb3B0aW9uLXNlbGVjdGlvbi5zZXJ2aWNlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2Nsck9wdGlvbkl0ZW1zXVtjbHJPcHRpb25JdGVtc09mXScsXG59KVxuZXhwb3J0IGNsYXNzIENsck9wdGlvbkl0ZW1zPFQ+IGltcGxlbWVudHMgRG9DaGVjaywgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBpdGVyYWJsZVByb3h5OiBOZ0Zvck9mPFQ+O1xuICBwcml2YXRlIF9yYXdJdGVtczogVFtdO1xuICBwcml2YXRlIGZpbHRlcmVkSXRlbXM6IFRbXTtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICBwcml2YXRlIGZpbHRlciA9ICcnO1xuICBwcml2YXRlIF9maWx0ZXJGaWVsZDogc3RyaW5nO1xuICBwcml2YXRlIGRpZmZlcjogSXRlcmFibGVEaWZmZXI8VD4gfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPE5nRm9yT2ZDb250ZXh0PFQ+PixcbiAgICBwcml2YXRlIGRpZmZlcnM6IEl0ZXJhYmxlRGlmZmVycyxcbiAgICBwcml2YXRlIG9wdGlvblNlcnZpY2U6IE9wdGlvblNlbGVjdGlvblNlcnZpY2U8VD4sXG4gICAgcHJpdmF0ZSBwb3NpdGlvblNlcnZpY2U6IENsclBvcG92ZXJQb3NpdGlvblNlcnZpY2UsXG4gICAgdmNyOiBWaWV3Q29udGFpbmVyUmVmXG4gICkge1xuICAgIHRoaXMuaXRlcmFibGVQcm94eSA9IG5ldyBOZ0Zvck9mPFQ+KHZjciwgdGVtcGxhdGUsIGRpZmZlcnMpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgb3B0aW9uU2VydmljZS5pbnB1dENoYW5nZWQuc3Vic2NyaWJlKGZpbHRlciA9PiB7XG4gICAgICAgIHRoaXMuZmlsdGVyID0gZmlsdGVyO1xuICAgICAgICB0aGlzLnVwZGF0ZUl0ZW1zKCk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBASW5wdXQoJ2Nsck9wdGlvbkl0ZW1zT2YnKVxuICBzZXQgcmF3SXRlbXMoaXRlbXM6IFRbXSkge1xuICAgIHRoaXMuX3Jhd0l0ZW1zID0gaXRlbXMgPyBpdGVtcyA6IFtdO1xuICAgIHRoaXMudXBkYXRlSXRlbXMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyT3B0aW9uSXRlbXNUcmFja0J5JylcbiAgc2V0IHRyYWNrQnkodmFsdWU6IFRyYWNrQnlGdW5jdGlvbjxUPikge1xuICAgIHRoaXMuaXRlcmFibGVQcm94eS5uZ0ZvclRyYWNrQnkgPSB2YWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyT3B0aW9uSXRlbXNGaWVsZCcpXG4gIHNldCBmaWVsZChmaWVsZDogc3RyaW5nKSB7XG4gICAgdGhpcy5fZmlsdGVyRmllbGQgPSBmaWVsZDtcbiAgICB0aGlzLm9wdGlvblNlcnZpY2UuZGlzcGxheUZpZWxkID0gZmllbGQ7XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgaWYgKCF0aGlzLmRpZmZlcikge1xuICAgICAgdGhpcy5kaWZmZXIgPSB0aGlzLmRpZmZlcnMuZmluZCh0aGlzLmZpbHRlcmVkSXRlbXMpLmNyZWF0ZSh0aGlzLml0ZXJhYmxlUHJveHkubmdGb3JUcmFja0J5KTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZGlmZmVyKSB7XG4gICAgICBjb25zdCBjaGFuZ2VzID0gdGhpcy5kaWZmZXIuZGlmZih0aGlzLmZpbHRlcmVkSXRlbXMpO1xuICAgICAgaWYgKGNoYW5nZXMpIHtcbiAgICAgICAgdGhpcy5pdGVyYWJsZVByb3h5Lm5nRG9DaGVjaygpO1xuICAgICAgICB0aGlzLnBvc2l0aW9uU2VydmljZS5yZWFsaWduKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmZvckVhY2goc3ViID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlSXRlbXMoKSB7XG4gICAgaWYgKCF0aGlzLl9yYXdJdGVtcyB8fCB0aGlzLmZpbHRlciA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuZmlsdGVyID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgbm9ybWFsaXplZEZpbHRlclZhbHVlID0gbm9ybWFsaXplVmFsdWUodGhpcy5maWx0ZXIpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9uU2VydmljZS5zaG93QWxsT3B0aW9ucykge1xuICAgICAgdGhpcy5maWx0ZXJlZEl0ZW1zID0gdGhpcy5fcmF3SXRlbXM7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9maWx0ZXJGaWVsZCkge1xuICAgICAgdGhpcy5maWx0ZXJlZEl0ZW1zID0gdGhpcy5fcmF3SXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xuICAgICAgICBjb25zdCBvYmpWYWx1ZSA9IChpdGVtIGFzIGFueSlbdGhpcy5fZmlsdGVyRmllbGRdO1xuICAgICAgICByZXR1cm4gb2JqVmFsdWUgPyBub3JtYWxpemVWYWx1ZShvYmpWYWx1ZSkuaW5jbHVkZXMobm9ybWFsaXplZEZpbHRlclZhbHVlKSA6IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZpbHRlciBieSBhbGwgaXRlbSBvYmplY3QgdmFsdWVzXG4gICAgICB0aGlzLmZpbHRlcmVkSXRlbXMgPSB0aGlzLl9yYXdJdGVtcy5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICByZXR1cm4gbm9ybWFsaXplVmFsdWUoaXRlbSkuaW5jbHVkZXMobm9ybWFsaXplZEZpbHRlclZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvYmpWYWx1ZXMgPSBPYmplY3QudmFsdWVzKGl0ZW0pLmZpbHRlcih2YWx1ZSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgPyBub3JtYWxpemVWYWx1ZSh2YWx1ZSkuaW5jbHVkZXMobm9ybWFsaXplZEZpbHRlclZhbHVlKSA6IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9ialZhbHVlcy5sZW5ndGggPiAwO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuaXRlcmFibGVQcm94eS5uZ0Zvck9mID0gdGhpcy5maWx0ZXJlZEl0ZW1zO1xuICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgcmV0dXJuIHZhbHVlXG4gICAgLnRvU3RyaW5nKClcbiAgICAubm9ybWFsaXplKCdORkQnKVxuICAgIC5yZXBsYWNlKC9cXHB7RGlhY3JpdGljfS9ndSwgJycpXG4gICAgLnRvTG93ZXJDYXNlKCk7XG59XG4iXX0=
/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export var ClrFormLayout;
(function (ClrFormLayout) {
    ClrFormLayout["VERTICAL"] = "vertical";
    ClrFormLayout["HORIZONTAL"] = "horizontal";
    ClrFormLayout["COMPACT"] = "compact";
})(ClrFormLayout || (ClrFormLayout = {}));
export class LayoutService {
    constructor() {
        this.minLabelSize = 1;
        this.maxLabelSize = 12;
        this.layout = ClrFormLayout.HORIZONTAL;
        // This is basically a replacement for Object.values(), which IE11 and Node <9 don't support :(
        // String enums cannot be reverse-mapped, meaning ClrFormLayout['COMPACT'] does not return 'compact' so
        // this exists to deal with this little caveat to get the list of the values as an array.
        this.layoutValues = Object.keys(ClrFormLayout).map(key => ClrFormLayout[key]);
        this._labelSize = 2;
    }
    get labelSize() {
        return this._labelSize;
    }
    set labelSize(size) {
        if (this.labelSizeIsValid(size)) {
            this._labelSize = size;
        }
    }
    get layoutClass() {
        return `clr-form-${this.layout}`;
    }
    isVertical() {
        return this.layout === ClrFormLayout.VERTICAL;
    }
    isHorizontal() {
        return this.layout === ClrFormLayout.HORIZONTAL;
    }
    isCompact() {
        return this.layout === ClrFormLayout.COMPACT;
    }
    isValid(layout) {
        return this.layoutValues.indexOf(layout) > -1;
    }
    labelSizeIsValid(labelSize) {
        return Number.isInteger(labelSize) && labelSize >= this.minLabelSize && labelSize <= this.maxLabelSize;
    }
}
LayoutService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: LayoutService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
LayoutService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: LayoutService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: LayoutService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9jb21tb24vcHJvdmlkZXJzL2xheW91dC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFFM0MsTUFBTSxDQUFOLElBQVksYUFJWDtBQUpELFdBQVksYUFBYTtJQUN2QixzQ0FBcUIsQ0FBQTtJQUNyQiwwQ0FBeUIsQ0FBQTtJQUN6QixvQ0FBbUIsQ0FBQTtBQUNyQixDQUFDLEVBSlcsYUFBYSxLQUFiLGFBQWEsUUFJeEI7QUFHRCxNQUFNLE9BQU8sYUFBYTtJQUQxQjtRQUVXLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLGlCQUFZLEdBQUcsRUFBRSxDQUFDO1FBRTNCLFdBQU0sR0FBMkIsYUFBYSxDQUFDLFVBQVUsQ0FBQztRQUUxRCwrRkFBK0Y7UUFDL0YsdUdBQXVHO1FBQ3ZHLHlGQUF5RjtRQUNqRixpQkFBWSxHQUFhLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUUsYUFBcUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzVHLGVBQVUsR0FBRyxDQUFDLENBQUM7S0FrQ3hCO0lBaENDLElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBQ0QsSUFBSSxTQUFTLENBQUMsSUFBWTtRQUN4QixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUN4QjtJQUNILENBQUM7SUFFRCxJQUFJLFdBQVc7UUFDYixPQUFPLFlBQVksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFRCxVQUFVO1FBQ1IsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLGFBQWEsQ0FBQyxRQUFRLENBQUM7SUFDaEQsQ0FBQztJQUVELFlBQVk7UUFDVixPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssYUFBYSxDQUFDLFVBQVUsQ0FBQztJQUNsRCxDQUFDO0lBRUQsU0FBUztRQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxhQUFhLENBQUMsT0FBTyxDQUFDO0lBQy9DLENBQUM7SUFFRCxPQUFPLENBQUMsTUFBYztRQUNwQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxTQUFpQjtRQUNoQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDekcsQ0FBQzs7MEdBM0NVLGFBQWE7OEdBQWIsYUFBYTsyRkFBYixhQUFhO2tCQUR6QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBlbnVtIENsckZvcm1MYXlvdXQge1xuICBWRVJUSUNBTCA9ICd2ZXJ0aWNhbCcsXG4gIEhPUklaT05UQUwgPSAnaG9yaXpvbnRhbCcsXG4gIENPTVBBQ1QgPSAnY29tcGFjdCcsXG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBMYXlvdXRTZXJ2aWNlIHtcbiAgcmVhZG9ubHkgbWluTGFiZWxTaXplID0gMTtcbiAgcmVhZG9ubHkgbWF4TGFiZWxTaXplID0gMTI7XG5cbiAgbGF5b3V0OiBDbHJGb3JtTGF5b3V0IHwgc3RyaW5nID0gQ2xyRm9ybUxheW91dC5IT1JJWk9OVEFMO1xuXG4gIC8vIFRoaXMgaXMgYmFzaWNhbGx5IGEgcmVwbGFjZW1lbnQgZm9yIE9iamVjdC52YWx1ZXMoKSwgd2hpY2ggSUUxMSBhbmQgTm9kZSA8OSBkb24ndCBzdXBwb3J0IDooXG4gIC8vIFN0cmluZyBlbnVtcyBjYW5ub3QgYmUgcmV2ZXJzZS1tYXBwZWQsIG1lYW5pbmcgQ2xyRm9ybUxheW91dFsnQ09NUEFDVCddIGRvZXMgbm90IHJldHVybiAnY29tcGFjdCcgc29cbiAgLy8gdGhpcyBleGlzdHMgdG8gZGVhbCB3aXRoIHRoaXMgbGl0dGxlIGNhdmVhdCB0byBnZXQgdGhlIGxpc3Qgb2YgdGhlIHZhbHVlcyBhcyBhbiBhcnJheS5cbiAgcHJpdmF0ZSBsYXlvdXRWYWx1ZXM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXMoQ2xyRm9ybUxheW91dCkubWFwKGtleSA9PiAoQ2xyRm9ybUxheW91dCBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+KVtrZXldKTtcbiAgcHJpdmF0ZSBfbGFiZWxTaXplID0gMjtcblxuICBnZXQgbGFiZWxTaXplKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2xhYmVsU2l6ZTtcbiAgfVxuICBzZXQgbGFiZWxTaXplKHNpemU6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmxhYmVsU2l6ZUlzVmFsaWQoc2l6ZSkpIHtcbiAgICAgIHRoaXMuX2xhYmVsU2l6ZSA9IHNpemU7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGxheW91dENsYXNzKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBjbHItZm9ybS0ke3RoaXMubGF5b3V0fWA7XG4gIH1cblxuICBpc1ZlcnRpY2FsKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmxheW91dCA9PT0gQ2xyRm9ybUxheW91dC5WRVJUSUNBTDtcbiAgfVxuXG4gIGlzSG9yaXpvbnRhbCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5sYXlvdXQgPT09IENsckZvcm1MYXlvdXQuSE9SSVpPTlRBTDtcbiAgfVxuXG4gIGlzQ29tcGFjdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5sYXlvdXQgPT09IENsckZvcm1MYXlvdXQuQ09NUEFDVDtcbiAgfVxuXG4gIGlzVmFsaWQobGF5b3V0OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5sYXlvdXRWYWx1ZXMuaW5kZXhPZihsYXlvdXQpID4gLTE7XG4gIH1cblxuICBsYWJlbFNpemVJc1ZhbGlkKGxhYmVsU2l6ZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIobGFiZWxTaXplKSAmJiBsYWJlbFNpemUgPj0gdGhpcy5taW5MYWJlbFNpemUgJiYgbGFiZWxTaXplIDw9IHRoaXMubWF4TGFiZWxTaXplO1xuICB9XG59XG4iXX0=
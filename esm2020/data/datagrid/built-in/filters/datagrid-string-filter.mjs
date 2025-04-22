/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, EventEmitter, Input, Output, ViewChild, } from '@angular/core';
import { ClrDatagridFilter } from '../../datagrid-filter';
import { CustomFilter } from '../../providers/custom-filter';
import { RegisteredFilter } from '../../providers/filters';
import { DatagridFilterRegistrar } from '../../utils/datagrid-filter-registrar';
import { DatagridStringFilterImpl } from './datagrid-string-filter-impl';
import * as i0 from "@angular/core";
import * as i1 from "../../providers/filters";
import * as i2 from "../../../../utils/dom-adapter/dom-adapter";
import * as i3 from "../../../../utils/i18n/common-strings.service";
import * as i4 from "../../../../utils/popover/providers/popover-toggle.service";
import * as i5 from "../../../../forms/common/label";
import * as i6 from "../../../../forms/input/input";
import * as i7 from "../../../../forms/input/input-container";
import * as i8 from "@angular/forms";
import * as i9 from "../../datagrid-filter";
export class DatagridStringFilter extends DatagridFilterRegistrar {
    constructor(filters, domAdapter, commonStrings, smartToggleService, elementRef, cdr, ngZone) {
        super(filters);
        this.domAdapter = domAdapter;
        this.commonStrings = commonStrings;
        this.smartToggleService = smartToggleService;
        this.elementRef = elementRef;
        this.cdr = cdr;
        this.ngZone = ngZone;
        this.filterValueChange = new EventEmitter();
        /**
         * Indicates if the filter dropdown is open
         */
        this.open = false;
        this.labelValue = '';
        this.subs = [];
    }
    /**
     * Customizable filter logic based on a search text
     */
    set customStringFilter(value) {
        if (value instanceof RegisteredFilter) {
            this.setFilter(value);
        }
        else {
            this.setFilter(new DatagridStringFilterImpl(value));
        }
        if (this.initFilterValue) {
            this.value = this.initFilterValue;
            // This initFilterValue should be used only once after the filter registration
            // So deleting this property value to prevent it from being used again
            // if this customStringFilter property is set again
            delete this.initFilterValue;
        }
    }
    /**
     * Common setter for the input value
     */
    get value() {
        return this.filter.value;
    }
    set value(value) {
        if (this.filter && typeof value === 'string') {
            if (!value) {
                value = '';
            }
            if (value !== this.filter.value) {
                this.filter.value = value;
                this.filterValueChange.emit(value);
            }
        }
        else {
            this.initFilterValue = value;
        }
    }
    get placeholderValue() {
        return this.placeholder || this.commonStrings.keys.filterItems;
    }
    ngAfterViewInit() {
        this.subs.push(this.smartToggleService.openChange.subscribe(openChange => {
            this.open = openChange;
            // Note: this is being run outside of the Angular zone because `element.focus()` doesn't require
            // running change detection.
            this.ngZone.runOutsideAngular(() => {
                // The animation frame in used because when this executes, the input isn't displayed.
                // Note: `element.focus()` causes re-layout and this may lead to frame drop on slower devices.
                // `setTimeout` is a macrotask and macrotasks are executed within the current rendering frame.
                // Animation tasks are executed within the next rendering frame.
                requestAnimationFrame(() => {
                    this.domAdapter.focus(this.input.nativeElement);
                });
            });
        }));
    }
    ngOnChanges() {
        setTimeout(() => {
            this.setFilterLabel();
            this.cdr.markForCheck();
        });
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this.subs.forEach(sub => sub.unsubscribe());
    }
    /**
     * This is not in a getter to prevent "expression has changed after it was checked" errors.
     */
    setFilterLabel() {
        if (this.label) {
            this.labelValue = this.label;
            return;
        }
        const columnElement = this.elementRef.nativeElement?.closest('clr-dg-column');
        const columnTitleElement = columnElement?.querySelector('.datagrid-column-title');
        this.labelValue = this.commonStrings.parse(this.commonStrings.keys.datagridFilterLabel, {
            COLUMN: columnTitleElement?.textContent.trim() || '',
        });
    }
}
DatagridStringFilter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridStringFilter, deps: [{ token: i1.FiltersProvider }, { token: i2.DomAdapter }, { token: i3.ClrCommonStringsService }, { token: i4.ClrPopoverToggleService }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
DatagridStringFilter.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: DatagridStringFilter, selector: "clr-dg-string-filter", inputs: { placeholder: ["clrFilterPlaceholder", "placeholder"], label: ["clrFilterLabel", "label"], customStringFilter: ["clrDgStringFilter", "customStringFilter"], value: ["clrFilterValue", "value"] }, outputs: { filterValueChange: "clrFilterValueChange" }, providers: [{ provide: CustomFilter, useExisting: DatagridStringFilter }], viewQueries: [{ propertyName: "input", first: true, predicate: ["input"], descendants: true }, { propertyName: "filterContainer", first: true, predicate: ClrDatagridFilter, descendants: true }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: `
    <clr-dg-filter [clrDgFilter]="registered" [(clrDgFilterOpen)]="open">
      <clr-input-container>
        <label>{{ labelValue }}</label>
        <input
          #input
          type="text"
          autocomplete="off"
          name="search"
          [(ngModel)]="value"
          clrInput
          [attr.aria-label]="placeholderValue"
          [placeholder]="placeholderValue"
        />
      </clr-input-container>
    </clr-dg-filter>
  `, isInline: true, dependencies: [{ kind: "directive", type: i5.ClrLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i6.ClrInput, selector: "[clrInput]" }, { kind: "component", type: i7.ClrInputContainer, selector: "clr-input-container" }, { kind: "directive", type: i8.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i8.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i8.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i9.ClrDatagridFilter, selector: "clr-dg-filter", inputs: ["clrDgFilterOpen", "clrDgFilter"], outputs: ["clrDgFilterOpenChange"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridStringFilter, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-string-filter',
                    providers: [{ provide: CustomFilter, useExisting: DatagridStringFilter }],
                    template: `
    <clr-dg-filter [clrDgFilter]="registered" [(clrDgFilterOpen)]="open">
      <clr-input-container>
        <label>{{ labelValue }}</label>
        <input
          #input
          type="text"
          autocomplete="off"
          name="search"
          [(ngModel)]="value"
          clrInput
          [attr.aria-label]="placeholderValue"
          [placeholder]="placeholderValue"
        />
      </clr-input-container>
    </clr-dg-filter>
  `,
                }]
        }], ctorParameters: function () { return [{ type: i1.FiltersProvider }, { type: i2.DomAdapter }, { type: i3.ClrCommonStringsService }, { type: i4.ClrPopoverToggleService }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }]; }, propDecorators: { placeholder: [{
                type: Input,
                args: ['clrFilterPlaceholder']
            }], label: [{
                type: Input,
                args: ['clrFilterLabel']
            }], filterValueChange: [{
                type: Output,
                args: ['clrFilterValueChange']
            }], input: [{
                type: ViewChild,
                args: ['input']
            }], filterContainer: [{
                type: ViewChild,
                args: [ClrDatagridFilter]
            }], customStringFilter: [{
                type: Input,
                args: ['clrDgStringFilter']
            }], value: [{
                type: Input,
                args: ['clrFilterValue']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtc3RyaW5nLWZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvYnVpbHQtaW4vZmlsdGVycy9kYXRhZ3JpZC1zdHJpbmctZmlsdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUdMLFNBQVMsRUFFVCxZQUFZLEVBQ1osS0FBSyxFQUlMLE1BQU0sRUFDTixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFNdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFMUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzdELE9BQU8sRUFBbUIsZ0JBQWdCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNoRixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQzs7Ozs7Ozs7Ozs7QUF1QnpFLE1BQU0sT0FBTyxvQkFDWCxTQUFRLHVCQUF1RDtJQThCL0QsWUFDRSxPQUEyQixFQUNuQixVQUFzQixFQUN2QixhQUFzQyxFQUNyQyxrQkFBMkMsRUFDM0MsVUFBbUMsRUFDbkMsR0FBc0IsRUFDdEIsTUFBYztRQUV0QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFQUCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3ZCLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQUNyQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQXlCO1FBQzNDLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBQ25DLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBQ3RCLFdBQU0sR0FBTixNQUFNLENBQVE7UUE1QlEsc0JBQWlCLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV2RTs7V0FFRztR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dGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBEb21BZGFwdGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbHMvZG9tLWFkYXB0ZXIvZG9tLWFkYXB0ZXInO1xuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi91dGlscy9wb3BvdmVyL3Byb3ZpZGVycy9wb3BvdmVyLXRvZ2dsZS5zZXJ2aWNlJztcbmltcG9ydCB7IENsckRhdGFncmlkRmlsdGVyIH0gZnJvbSAnLi4vLi4vZGF0YWdyaWQtZmlsdGVyJztcbmltcG9ydCB7IENsckRhdGFncmlkU3RyaW5nRmlsdGVySW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9zdHJpbmctZmlsdGVyLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDdXN0b21GaWx0ZXIgfSBmcm9tICcuLi8uLi9wcm92aWRlcnMvY3VzdG9tLWZpbHRlcic7XG5pbXBvcnQgeyBGaWx0ZXJzUHJvdmlkZXIsIFJlZ2lzdGVyZWRGaWx0ZXIgfSBmcm9tICcuLi8uLi9wcm92aWRlcnMvZmlsdGVycyc7XG5pbXBvcnQgeyBEYXRhZ3JpZEZpbHRlclJlZ2lzdHJhciB9IGZyb20gJy4uLy4uL3V0aWxzL2RhdGFncmlkLWZpbHRlci1yZWdpc3RyYXInO1xuaW1wb3J0IHsgRGF0YWdyaWRTdHJpbmdGaWx0ZXJJbXBsIH0gZnJvbSAnLi9kYXRhZ3JpZC1zdHJpbmctZmlsdGVyLWltcGwnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZGctc3RyaW5nLWZpbHRlcicsXG4gIHByb3ZpZGVyczogW3sgcHJvdmlkZTogQ3VzdG9tRmlsdGVyLCB1c2VFeGlzdGluZzogRGF0YWdyaWRTdHJpbmdGaWx0ZXIgfV0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGNsci1kZy1maWx0ZXIgW2NsckRnRmlsdGVyXT1cInJlZ2lzdGVyZWRcIiBbKGNsckRnRmlsdGVyT3BlbildPVwib3BlblwiPlxuICAgICAgPGNsci1pbnB1dC1jb250YWluZXI+XG4gICAgICAgIDxsYWJlbD57eyBsYWJlbFZhbHVlIH19PC9sYWJlbD5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgI2lucHV0XG4gICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgIGF1dG9jb21wbGV0ZT1cIm9mZlwiXG4gICAgICAgICAgbmFtZT1cInNlYXJjaFwiXG4gICAgICAgICAgWyhuZ01vZGVsKV09XCJ2YWx1ZVwiXG4gICAgICAgICAgY2xySW5wdXRcbiAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cInBsYWNlaG9sZGVyVmFsdWVcIlxuICAgICAgICAgIFtwbGFjZWhvbGRlcl09XCJwbGFjZWhvbGRlclZhbHVlXCJcbiAgICAgICAgLz5cbiAgICAgIDwvY2xyLWlucHV0LWNvbnRhaW5lcj5cbiAgICA8L2Nsci1kZy1maWx0ZXI+XG4gIGAsXG59KVxuZXhwb3J0IGNsYXNzIERhdGFncmlkU3RyaW5nRmlsdGVyPFQgPSBhbnk+XG4gIGV4dGVuZHMgRGF0YWdyaWRGaWx0ZXJSZWdpc3RyYXI8VCwgRGF0YWdyaWRTdHJpbmdGaWx0ZXJJbXBsPFQ+PlxuICBpbXBsZW1lbnRzIEN1c3RvbUZpbHRlciwgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3lcbntcbiAgLyoqXG4gICAqIFByb3ZpZGUgYSB3YXkgdG8gcGFzcyBleHRlcm5hbCBwbGFjZWhvbGRlciBhbmQgYXJpYS1sYWJlbCB0byB0aGUgZmlsdGVyIGlucHV0XG4gICAqL1xuICBASW5wdXQoJ2NsckZpbHRlclBsYWNlaG9sZGVyJykgcGxhY2Vob2xkZXI6IHN0cmluZztcbiAgQElucHV0KCdjbHJGaWx0ZXJMYWJlbCcpIGxhYmVsOiBzdHJpbmc7XG5cbiAgQE91dHB1dCgnY2xyRmlsdGVyVmFsdWVDaGFuZ2UnKSBmaWx0ZXJWYWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIHRoZSBmaWx0ZXIgZHJvcGRvd24gaXMgb3BlblxuICAgKi9cbiAgb3BlbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBXZSBuZWVkIHRoZSBhY3R1YWwgaW5wdXQgZWxlbWVudCB0byBhdXRvbWF0aWNhbGx5IGZvY3VzIG9uIGl0XG4gICAqL1xuICBAVmlld0NoaWxkKCdpbnB1dCcpIGlucHV0OiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+O1xuXG4gIC8qKlxuICAgKiBXZSBncmFiIHRoZSBDbHJEYXRhZ3JpZEZpbHRlciB3ZSB3cmFwIHRvIHJlZ2lzdGVyIHRoaXMgU3RyaW5nRmlsdGVyIHRvIGl0LlxuICAgKi9cbiAgQFZpZXdDaGlsZChDbHJEYXRhZ3JpZEZpbHRlcikgZmlsdGVyQ29udGFpbmVyOiBDbHJEYXRhZ3JpZEZpbHRlcjxUPjtcblxuICBsYWJlbFZhbHVlID0gJyc7XG4gIHByaXZhdGUgaW5pdEZpbHRlclZhbHVlOiBzdHJpbmc7XG4gIHByaXZhdGUgc3ViczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBmaWx0ZXJzOiBGaWx0ZXJzUHJvdmlkZXI8VD4sXG4gICAgcHJpdmF0ZSBkb21BZGFwdGVyOiBEb21BZGFwdGVyLFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIHNtYXJ0VG9nZ2xlU2VydmljZTogQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBzdXBlcihmaWx0ZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDdXN0b21pemFibGUgZmlsdGVyIGxvZ2ljIGJhc2VkIG9uIGEgc2VhcmNoIHRleHRcbiAgICovXG4gIEBJbnB1dCgnY2xyRGdTdHJpbmdGaWx0ZXInKVxuICBzZXQgY3VzdG9tU3RyaW5nRmlsdGVyKFxuICAgIHZhbHVlOiBDbHJEYXRhZ3JpZFN0cmluZ0ZpbHRlckludGVyZmFjZTxUPiB8IFJlZ2lzdGVyZWRGaWx0ZXI8VCwgRGF0YWdyaWRTdHJpbmdGaWx0ZXJJbXBsPFQ+PlxuICApIHtcbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBSZWdpc3RlcmVkRmlsdGVyKSB7XG4gICAgICB0aGlzLnNldEZpbHRlcih2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0RmlsdGVyKG5ldyBEYXRhZ3JpZFN0cmluZ0ZpbHRlckltcGwodmFsdWUpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaW5pdEZpbHRlclZhbHVlKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5pbml0RmlsdGVyVmFsdWU7XG4gICAgICAvLyBUaGlzIGluaXRGaWx0ZXJWYWx1ZSBzaG91bGQgYmUgdXNlZCBvbmx5IG9uY2UgYWZ0ZXIgdGhlIGZpbHRlciByZWdpc3RyYXRpb25cbiAgICAgIC8vIFNvIGRlbGV0aW5nIHRoaXMgcHJvcGVydHkgdmFsdWUgdG8gcHJldmVudCBpdCBmcm9tIGJlaW5nIHVzZWQgYWdhaW5cbiAgICAgIC8vIGlmIHRoaXMgY3VzdG9tU3RyaW5nRmlsdGVyIHByb3BlcnR5IGlzIHNldCBhZ2FpblxuICAgICAgZGVsZXRlIHRoaXMuaW5pdEZpbHRlclZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb21tb24gc2V0dGVyIGZvciB0aGUgaW5wdXQgdmFsdWVcbiAgICovXG4gIEBJbnB1dCgnY2xyRmlsdGVyVmFsdWUnKVxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyLnZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuZmlsdGVyICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgdmFsdWUgPSAnJztcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5maWx0ZXIudmFsdWUpIHtcbiAgICAgICAgdGhpcy5maWx0ZXIudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5maWx0ZXJWYWx1ZUNoYW5nZS5lbWl0KHZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbml0RmlsdGVyVmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBnZXQgcGxhY2Vob2xkZXJWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlciB8fCB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5maWx0ZXJJdGVtcztcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLnN1YnMucHVzaChcbiAgICAgIHRoaXMuc21hcnRUb2dnbGVTZXJ2aWNlLm9wZW5DaGFuZ2Uuc3Vic2NyaWJlKG9wZW5DaGFuZ2UgPT4ge1xuICAgICAgICB0aGlzLm9wZW4gPSBvcGVuQ2hhbmdlO1xuICAgICAgICAvLyBOb3RlOiB0aGlzIGlzIGJlaW5nIHJ1biBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyIHpvbmUgYmVjYXVzZSBgZWxlbWVudC5mb2N1cygpYCBkb2Vzbid0IHJlcXVpcmVcbiAgICAgICAgLy8gcnVubmluZyBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgLy8gVGhlIGFuaW1hdGlvbiBmcmFtZSBpbiB1c2VkIGJlY2F1c2Ugd2hlbiB0aGlzIGV4ZWN1dGVzLCB0aGUgaW5wdXQgaXNuJ3QgZGlzcGxheWVkLlxuICAgICAgICAgIC8vIE5vdGU6IGBlbGVtZW50LmZvY3VzKClgIGNhdXNlcyByZS1sYXlvdXQgYW5kIHRoaXMgbWF5IGxlYWQgdG8gZnJhbWUgZHJvcCBvbiBzbG93ZXIgZGV2aWNlcy5cbiAgICAgICAgICAvLyBgc2V0VGltZW91dGAgaXMgYSBtYWNyb3Rhc2sgYW5kIG1hY3JvdGFza3MgYXJlIGV4ZWN1dGVkIHdpdGhpbiB0aGUgY3VycmVudCByZW5kZXJpbmcgZnJhbWUuXG4gICAgICAgICAgLy8gQW5pbWF0aW9uIHRhc2tzIGFyZSBleGVjdXRlZCB3aXRoaW4gdGhlIG5leHQgcmVuZGVyaW5nIGZyYW1lLlxuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRvbUFkYXB0ZXIuZm9jdXModGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2V0RmlsdGVyTGFiZWwoKTtcbiAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLnN1YnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgbm90IGluIGEgZ2V0dGVyIHRvIHByZXZlbnQgXCJleHByZXNzaW9uIGhhcyBjaGFuZ2VkIGFmdGVyIGl0IHdhcyBjaGVja2VkXCIgZXJyb3JzLlxuICAgKi9cbiAgcHJpdmF0ZSBzZXRGaWx0ZXJMYWJlbCgpIHtcbiAgICBpZiAodGhpcy5sYWJlbCkge1xuICAgICAgdGhpcy5sYWJlbFZhbHVlID0gdGhpcy5sYWJlbDtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbHVtbkVsZW1lbnQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudD8uY2xvc2VzdCgnY2xyLWRnLWNvbHVtbicpO1xuICAgIGNvbnN0IGNvbHVtblRpdGxlRWxlbWVudCA9IGNvbHVtbkVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJy5kYXRhZ3JpZC1jb2x1bW4tdGl0bGUnKTtcblxuICAgIHRoaXMubGFiZWxWYWx1ZSA9IHRoaXMuY29tbW9uU3RyaW5ncy5wYXJzZSh0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5kYXRhZ3JpZEZpbHRlckxhYmVsLCB7XG4gICAgICBDT0xVTU46IGNvbHVtblRpdGxlRWxlbWVudD8udGV4dENvbnRlbnQudHJpbSgpIHx8ICcnLFxuICAgIH0pO1xuICB9XG59XG4iXX0=
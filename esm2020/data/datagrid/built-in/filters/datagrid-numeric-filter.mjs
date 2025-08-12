/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ClrDatagridFilter } from '../../datagrid-filter';
import { CustomFilter } from '../../providers/custom-filter';
import { RegisteredFilter } from '../../providers/filters';
import { DatagridFilterRegistrar } from '../../utils/datagrid-filter-registrar';
import { DatagridNumericFilterImpl } from './datagrid-numeric-filter-impl';
import * as i0 from "@angular/core";
import * as i1 from "../../providers/filters";
import * as i2 from "../../../../utils/dom-adapter/dom-adapter";
import * as i3 from "../../../../utils/i18n/common-strings.service";
import * as i4 from "../../../../utils/popover/providers/popover-toggle.service";
import * as i5 from "../../../../forms/common/label";
import * as i6 from "../../../../forms/number-input/number-input";
import * as i7 from "../../../../forms/number-input/number-input-container";
import * as i8 from "@angular/forms";
import * as i9 from "../../datagrid-filter";
export class DatagridNumericFilter extends DatagridFilterRegistrar {
    constructor(filters, domAdapter, commonStrings, popoverToggleService, ngZone) {
        super(filters);
        this.domAdapter = domAdapter;
        this.commonStrings = commonStrings;
        this.popoverToggleService = popoverToggleService;
        this.ngZone = ngZone;
        this.filterValueChange = new EventEmitter();
        /**
         * Indicates if the filter dropdown is open
         */
        this.open = false;
        this.subscriptions = [];
    }
    /**
     * Common setter for the input values
     */
    get value() {
        return [this.filter.low, this.filter.high];
    }
    set value(values) {
        if (this.filter && Array.isArray(values)) {
            if (values && (values[0] !== this.filter.low || values[1] !== this.filter.high)) {
                if (typeof values[0] === 'number') {
                    this.filter.low = values[0];
                }
                else {
                    this.filter.low = null;
                }
                if (typeof values[1] === 'number') {
                    this.filter.high = values[1];
                }
                else {
                    this.filter.high = null;
                }
                this.filterValueChange.emit(values);
            }
        }
        else {
            this.initFilterValues = values;
        }
    }
    /**
     * Customizable filter logic based on high and low values
     */
    set customNumericFilter(value) {
        if (value instanceof RegisteredFilter) {
            this.setFilter(value);
        }
        else {
            this.setFilter(new DatagridNumericFilterImpl(value));
        }
        if (this.initFilterValues) {
            this.value = this.initFilterValues;
            // This initFilterValues should be used only once after the filter registration
            // So deleting this property value to prevent it from being used again
            // if this customStringFilter property is set again
            delete this.initFilterValues;
        }
    }
    get maxPlaceholderValue() {
        return this.maxPlaceholder || this.commonStrings.keys.maxValue;
    }
    get minPlaceholderValue() {
        return this.minPlaceholder || this.commonStrings.keys.minValue;
    }
    get fromLabelValue() {
        return this.fromLabel || this.commonStrings.keys.fromLabel;
    }
    get toLabelValue() {
        return this.toLabel || this.commonStrings.keys.toLabel;
    }
    get low() {
        if (typeof this.filter.low === 'number' && isFinite(this.filter.low)) {
            return this.filter.low;
        }
        else {
            // There's not a low limit
            return null;
        }
    }
    set low(low) {
        if (typeof low === 'number' && low !== this.filter.low) {
            this.filter.low = low;
            this.filterValueChange.emit([this.filter.low, this.filter.high]);
        }
        else if (typeof low !== 'number') {
            this.filter.low = null;
            this.filterValueChange.emit([this.filter.low, this.filter.high]);
        }
    }
    get high() {
        if (typeof this.filter.high === 'number' && isFinite(this.filter.high)) {
            return this.filter.high;
        }
        else {
            // There's not a high limit
            return null;
        }
    }
    set high(high) {
        if (typeof high === 'number' && high !== this.filter.high) {
            this.filter.high = high;
            this.filterValueChange.emit([this.filter.low, this.filter.high]);
        }
        else if (typeof high !== 'number') {
            this.filter.high = null;
            this.filterValueChange.emit([this.filter.low, this.filter.high]);
        }
    }
    ngAfterViewInit() {
        this.subscriptions.push(this.popoverToggleService.openChange.subscribe(openChange => {
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
    ngOnDestroy() {
        super.ngOnDestroy();
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        });
    }
}
DatagridNumericFilter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridNumericFilter, deps: [{ token: i1.FiltersProvider }, { token: i2.DomAdapter }, { token: i3.ClrCommonStringsService }, { token: i4.ClrPopoverToggleService }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
DatagridNumericFilter.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: DatagridNumericFilter, selector: "clr-dg-numeric-filter", inputs: { minPlaceholder: ["clrFilterMinPlaceholder", "minPlaceholder"], maxPlaceholder: ["clrFilterMaxPlaceholder", "maxPlaceholder"], fromLabel: ["clrFilterFromLabel", "fromLabel"], toLabel: ["clrFilterToLabel", "toLabel"], value: ["clrFilterValue", "value"], customNumericFilter: ["clrDgNumericFilter", "customNumericFilter"] }, outputs: { filterValueChange: "clrFilterValueChange" }, providers: [{ provide: CustomFilter, useExisting: DatagridNumericFilter }], viewQueries: [{ propertyName: "input", first: true, predicate: ["input_low"], descendants: true }, { propertyName: "filterContainer", first: true, predicate: ClrDatagridFilter, descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <clr-dg-filter [clrDgFilter]="registered" [(clrDgFilterOpen)]="open">
      <div class="datagrid-numeric-filter-form">
        <clr-number-input-container>
          <label class="clr-control-label">{{ fromLabelValue }}</label>
          <input
            clrNumberInput
            class="datagrid-numeric-filter-input"
            #input_low
            type="number"
            autocomplete="off"
            name="low"
            [(ngModel)]="low"
            [placeholder]="minPlaceholderValue"
            [attr.aria-label]="minPlaceholderValue"
          />
        </clr-number-input-container>
        <clr-number-input-container>
          <label class="clr-control-label">{{ toLabelValue }}</label>
          <input
            clrNumberInput
            class="datagrid-numeric-filter-input"
            #input_high
            type="number"
            autocomplete="off"
            name="high"
            [(ngModel)]="high"
            [placeholder]="maxPlaceholderValue"
            [attr.aria-label]="maxPlaceholderValue"
          />
        </clr-number-input-container>
      </div>
    </clr-dg-filter>
  `, isInline: true, dependencies: [{ kind: "directive", type: i5.ClrLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i6.ClrNumberInput, selector: "input[type=\"number\"][clrNumberInput]" }, { kind: "component", type: i7.ClrNumberInputContainer, selector: "clr-number-input-container" }, { kind: "directive", type: i8.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i8.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i8.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i8.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i9.ClrDatagridFilter, selector: "clr-dg-filter", inputs: ["clrDgFilterOpen", "clrDgFilter"], outputs: ["clrDgFilterOpenChange"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridNumericFilter, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-numeric-filter',
                    providers: [{ provide: CustomFilter, useExisting: DatagridNumericFilter }],
                    template: `
    <clr-dg-filter [clrDgFilter]="registered" [(clrDgFilterOpen)]="open">
      <div class="datagrid-numeric-filter-form">
        <clr-number-input-container>
          <label class="clr-control-label">{{ fromLabelValue }}</label>
          <input
            clrNumberInput
            class="datagrid-numeric-filter-input"
            #input_low
            type="number"
            autocomplete="off"
            name="low"
            [(ngModel)]="low"
            [placeholder]="minPlaceholderValue"
            [attr.aria-label]="minPlaceholderValue"
          />
        </clr-number-input-container>
        <clr-number-input-container>
          <label class="clr-control-label">{{ toLabelValue }}</label>
          <input
            clrNumberInput
            class="datagrid-numeric-filter-input"
            #input_high
            type="number"
            autocomplete="off"
            name="high"
            [(ngModel)]="high"
            [placeholder]="maxPlaceholderValue"
            [attr.aria-label]="maxPlaceholderValue"
          />
        </clr-number-input-container>
      </div>
    </clr-dg-filter>
  `,
                }]
        }], ctorParameters: function () { return [{ type: i1.FiltersProvider }, { type: i2.DomAdapter }, { type: i3.ClrCommonStringsService }, { type: i4.ClrPopoverToggleService }, { type: i0.NgZone }]; }, propDecorators: { minPlaceholder: [{
                type: Input,
                args: ['clrFilterMinPlaceholder']
            }], maxPlaceholder: [{
                type: Input,
                args: ['clrFilterMaxPlaceholder']
            }], fromLabel: [{
                type: Input,
                args: ['clrFilterFromLabel']
            }], toLabel: [{
                type: Input,
                args: ['clrFilterToLabel']
            }], filterValueChange: [{
                type: Output,
                args: ['clrFilterValueChange']
            }], input: [{
                type: ViewChild,
                args: ['input_low']
            }], filterContainer: [{
                type: ViewChild,
                args: [ClrDatagridFilter]
            }], value: [{
                type: Input,
                args: ['clrFilterValue']
            }], customNumericFilter: [{
                type: Input,
                args: ['clrDgNumericFilter']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtbnVtZXJpYy1maWx0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2J1aWx0LWluL2ZpbHRlcnMvZGF0YWdyaWQtbnVtZXJpYy1maWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQWlCLFNBQVMsRUFBYyxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFNckgsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFMUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzdELE9BQU8sRUFBbUIsZ0JBQWdCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNoRixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQzs7Ozs7Ozs7Ozs7QUF3QzNFLE1BQU0sT0FBTyxxQkFDWCxTQUFRLHVCQUF3RDtJQTRCaEUsWUFDRSxPQUEyQixFQUNuQixVQUFzQixFQUN2QixhQUFzQyxFQUNyQyxvQkFBNkMsRUFDN0MsTUFBYztRQUV0QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFMUCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3ZCLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQUNyQyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXlCO1FBQzdDLFdBQU0sR0FBTixNQUFNLENBQVE7UUF6QlEsc0JBQWlCLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV2RTs7V0FFRztRQUNILFNBQUksR0FBRyxLQUFLLENBQUM7UUFhTCxrQkFBYSxHQUFtQixFQUFFLENBQUM7SUFVM0MsQ0FBQztJQUVEOztPQUVHO0lB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RSxPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxxQkFBcUIsRUFBRSxDQUFDLGdLQTREL0QsaUJBQWlCLHVFQTNEbEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWlDVDsyRkFFVSxxQkFBcUI7a0JBdENqQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx1QkFBdUI7b0JBQ2pDLFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxXQUFXLHVCQUF1QixFQUFFLENBQUM7b0JBQzFFLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUNUO2lCQUNGO2dPQUttQyxjQUFjO3NCQUEvQyxLQUFLO3VCQUFDLHlCQUF5QjtnQkFDRSxjQUFjO3NCQUEvQyxLQUFLO3VCQUFDLHlCQUF5QjtnQkFDSCxTQUFTO3NCQUFyQyxLQUFLO3VCQUFDLG9CQUFvQjtnQkFDQSxPQUFPO3NCQUFqQyxLQUFLO3VCQUFDLGtCQUFrQjtnQkFFTyxpQkFBaUI7c0JBQWhELE1BQU07dUJBQUMsc0JBQXNCO2dCQVVOLEtBQUs7c0JBQTVCLFNBQVM7dUJBQUMsV0FBVztnQkFLUSxlQUFlO3NCQUE1QyxTQUFTO3VCQUFDLGlCQUFpQjtnQkFtQnhCLEtBQUs7c0JBRFIsS0FBSzt1QkFBQyxnQkFBZ0I7Z0JBNEJuQixtQkFBbUI7c0JBRHRCLEtBQUs7dUJBQUMsb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE5nWm9uZSwgT3V0cHV0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBEb21BZGFwdGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbHMvZG9tLWFkYXB0ZXIvZG9tLWFkYXB0ZXInO1xuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi91dGlscy9wb3BvdmVyL3Byb3ZpZGVycy9wb3BvdmVyLXRvZ2dsZS5zZXJ2aWNlJztcbmltcG9ydCB7IENsckRhdGFncmlkRmlsdGVyIH0gZnJvbSAnLi4vLi4vZGF0YWdyaWQtZmlsdGVyJztcbmltcG9ydCB7IENsckRhdGFncmlkTnVtZXJpY0ZpbHRlckludGVyZmFjZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvbnVtZXJpYy1maWx0ZXIuaW50ZXJmYWNlJztcbmltcG9ydCB7IEN1c3RvbUZpbHRlciB9IGZyb20gJy4uLy4uL3Byb3ZpZGVycy9jdXN0b20tZmlsdGVyJztcbmltcG9ydCB7IEZpbHRlcnNQcm92aWRlciwgUmVnaXN0ZXJlZEZpbHRlciB9IGZyb20gJy4uLy4uL3Byb3ZpZGVycy9maWx0ZXJzJztcbmltcG9ydCB7IERhdGFncmlkRmlsdGVyUmVnaXN0cmFyIH0gZnJvbSAnLi4vLi4vdXRpbHMvZGF0YWdyaWQtZmlsdGVyLXJlZ2lzdHJhcic7XG5pbXBvcnQgeyBEYXRhZ3JpZE51bWVyaWNGaWx0ZXJJbXBsIH0gZnJvbSAnLi9kYXRhZ3JpZC1udW1lcmljLWZpbHRlci1pbXBsJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWRnLW51bWVyaWMtZmlsdGVyJyxcbiAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBDdXN0b21GaWx0ZXIsIHVzZUV4aXN0aW5nOiBEYXRhZ3JpZE51bWVyaWNGaWx0ZXIgfV0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGNsci1kZy1maWx0ZXIgW2NsckRnRmlsdGVyXT1cInJlZ2lzdGVyZWRcIiBbKGNsckRnRmlsdGVyT3BlbildPVwib3BlblwiPlxuICAgICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLW51bWVyaWMtZmlsdGVyLWZvcm1cIj5cbiAgICAgICAgPGNsci1udW1iZXItaW5wdXQtY29udGFpbmVyPlxuICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNsci1jb250cm9sLWxhYmVsXCI+e3sgZnJvbUxhYmVsVmFsdWUgfX08L2xhYmVsPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgY2xyTnVtYmVySW5wdXRcbiAgICAgICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtbnVtZXJpYy1maWx0ZXItaW5wdXRcIlxuICAgICAgICAgICAgI2lucHV0X2xvd1xuICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICBhdXRvY29tcGxldGU9XCJvZmZcIlxuICAgICAgICAgICAgbmFtZT1cImxvd1wiXG4gICAgICAgICAgICBbKG5nTW9kZWwpXT1cImxvd1wiXG4gICAgICAgICAgICBbcGxhY2Vob2xkZXJdPVwibWluUGxhY2Vob2xkZXJWYWx1ZVwiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIm1pblBsYWNlaG9sZGVyVmFsdWVcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvY2xyLW51bWJlci1pbnB1dC1jb250YWluZXI+XG4gICAgICAgIDxjbHItbnVtYmVyLWlucHV0LWNvbnRhaW5lcj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjbHItY29udHJvbC1sYWJlbFwiPnt7IHRvTGFiZWxWYWx1ZSB9fTwvbGFiZWw+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBjbHJOdW1iZXJJbnB1dFxuICAgICAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1udW1lcmljLWZpbHRlci1pbnB1dFwiXG4gICAgICAgICAgICAjaW5wdXRfaGlnaFxuICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICBhdXRvY29tcGxldGU9XCJvZmZcIlxuICAgICAgICAgICAgbmFtZT1cImhpZ2hcIlxuICAgICAgICAgICAgWyhuZ01vZGVsKV09XCJoaWdoXCJcbiAgICAgICAgICAgIFtwbGFjZWhvbGRlcl09XCJtYXhQbGFjZWhvbGRlclZhbHVlXCJcbiAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwibWF4UGxhY2Vob2xkZXJWYWx1ZVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9jbHItbnVtYmVyLWlucHV0LWNvbnRhaW5lcj5cbiAgICAgIDwvZGl2PlxuICAgIDwvY2xyLWRnLWZpbHRlcj5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgRGF0YWdyaWROdW1lcmljRmlsdGVyPFQgPSBhbnk+XG4gIGV4dGVuZHMgRGF0YWdyaWRGaWx0ZXJSZWdpc3RyYXI8VCwgRGF0YWdyaWROdW1lcmljRmlsdGVySW1wbDxUPj5cbiAgaW1wbGVtZW50cyBDdXN0b21GaWx0ZXIsIEFmdGVyVmlld0luaXRcbntcbiAgQElucHV0KCdjbHJGaWx0ZXJNaW5QbGFjZWhvbGRlcicpIG1pblBsYWNlaG9sZGVyOiBzdHJpbmc7XG4gIEBJbnB1dCgnY2xyRmlsdGVyTWF4UGxhY2Vob2xkZXInKSBtYXhQbGFjZWhvbGRlcjogc3RyaW5nO1xuICBASW5wdXQoJ2NsckZpbHRlckZyb21MYWJlbCcpIGZyb21MYWJlbDogc3RyaW5nO1xuICBASW5wdXQoJ2NsckZpbHRlclRvTGFiZWwnKSB0b0xhYmVsOiBzdHJpbmc7XG5cbiAgQE91dHB1dCgnY2xyRmlsdGVyVmFsdWVDaGFuZ2UnKSBmaWx0ZXJWYWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIHRoZSBmaWx0ZXIgZHJvcGRvd24gaXMgb3BlblxuICAgKi9cbiAgb3BlbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBXZSBuZWVkIHRoZSBhY3R1YWwgaW5wdXQgZWxlbWVudCB0byBhdXRvbWF0aWNhbGx5IGZvY3VzIG9uIGl0XG4gICAqL1xuICBAVmlld0NoaWxkKCdpbnB1dF9sb3cnKSBpbnB1dDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PjtcblxuICAvKipcbiAgICogV2UgZ3JhYiB0aGUgQ2xyRGF0YWdyaWRGaWx0ZXIgd2Ugd3JhcCB0byByZWdpc3RlciB0aGlzIFN0cmluZ0ZpbHRlciB0byBpdC5cbiAgICovXG4gIEBWaWV3Q2hpbGQoQ2xyRGF0YWdyaWRGaWx0ZXIpIGZpbHRlckNvbnRhaW5lcjogQ2xyRGF0YWdyaWRGaWx0ZXI8VD47XG5cbiAgcHJpdmF0ZSBpbml0RmlsdGVyVmFsdWVzOiBbbnVtYmVyLCBudW1iZXJdO1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZmlsdGVyczogRmlsdGVyc1Byb3ZpZGVyPFQ+LFxuICAgIHByaXZhdGUgZG9tQWRhcHRlcjogRG9tQWRhcHRlcixcbiAgICBwdWJsaWMgY29tbW9uU3RyaW5nczogQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBwb3BvdmVyVG9nZ2xlU2VydmljZTogQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBzdXBlcihmaWx0ZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21tb24gc2V0dGVyIGZvciB0aGUgaW5wdXQgdmFsdWVzXG4gICAqL1xuICBASW5wdXQoJ2NsckZpbHRlclZhbHVlJylcbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiBbdGhpcy5maWx0ZXIubG93LCB0aGlzLmZpbHRlci5oaWdoXTtcbiAgfVxuICBzZXQgdmFsdWUodmFsdWVzOiBbbnVtYmVyLCBudW1iZXJdKSB7XG4gICAgaWYgKHRoaXMuZmlsdGVyICYmIEFycmF5LmlzQXJyYXkodmFsdWVzKSkge1xuICAgICAgaWYgKHZhbHVlcyAmJiAodmFsdWVzWzBdICE9PSB0aGlzLmZpbHRlci5sb3cgfHwgdmFsdWVzWzFdICE9PSB0aGlzLmZpbHRlci5oaWdoKSkge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlc1swXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICB0aGlzLmZpbHRlci5sb3cgPSB2YWx1ZXNbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5maWx0ZXIubG93ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlc1sxXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICB0aGlzLmZpbHRlci5oaWdoID0gdmFsdWVzWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZmlsdGVyLmhpZ2ggPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmlsdGVyVmFsdWVDaGFuZ2UuZW1pdCh2YWx1ZXMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmluaXRGaWx0ZXJWYWx1ZXMgPSB2YWx1ZXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEN1c3RvbWl6YWJsZSBmaWx0ZXIgbG9naWMgYmFzZWQgb24gaGlnaCBhbmQgbG93IHZhbHVlc1xuICAgKi9cbiAgQElucHV0KCdjbHJEZ051bWVyaWNGaWx0ZXInKVxuICBzZXQgY3VzdG9tTnVtZXJpY0ZpbHRlcihcbiAgICB2YWx1ZTogQ2xyRGF0YWdyaWROdW1lcmljRmlsdGVySW50ZXJmYWNlPFQ+IHwgUmVnaXN0ZXJlZEZpbHRlcjxULCBEYXRhZ3JpZE51bWVyaWNGaWx0ZXJJbXBsPFQ+PlxuICApIHtcbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBSZWdpc3RlcmVkRmlsdGVyKSB7XG4gICAgICB0aGlzLnNldEZpbHRlcih2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0RmlsdGVyKG5ldyBEYXRhZ3JpZE51bWVyaWNGaWx0ZXJJbXBsKHZhbHVlKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmluaXRGaWx0ZXJWYWx1ZXMpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLmluaXRGaWx0ZXJWYWx1ZXM7XG4gICAgICAvLyBUaGlzIGluaXRGaWx0ZXJWYWx1ZXMgc2hvdWxkIGJlIHVzZWQgb25seSBvbmNlIGFmdGVyIHRoZSBmaWx0ZXIgcmVnaXN0cmF0aW9uXG4gICAgICAvLyBTbyBkZWxldGluZyB0aGlzIHByb3BlcnR5IHZhbHVlIHRvIHByZXZlbnQgaXQgZnJvbSBiZWluZyB1c2VkIGFnYWluXG4gICAgICAvLyBpZiB0aGlzIGN1c3RvbVN0cmluZ0ZpbHRlciBwcm9wZXJ0eSBpcyBzZXQgYWdhaW5cbiAgICAgIGRlbGV0ZSB0aGlzLmluaXRGaWx0ZXJWYWx1ZXM7XG4gICAgfVxuICB9XG5cbiAgZ2V0IG1heFBsYWNlaG9sZGVyVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF4UGxhY2Vob2xkZXIgfHwgdGhpcy5jb21tb25TdHJpbmdzLmtleXMubWF4VmFsdWU7XG4gIH1cblxuICBnZXQgbWluUGxhY2Vob2xkZXJWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5taW5QbGFjZWhvbGRlciB8fCB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5taW5WYWx1ZTtcbiAgfVxuXG4gIGdldCBmcm9tTGFiZWxWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tTGFiZWwgfHwgdGhpcy5jb21tb25TdHJpbmdzLmtleXMuZnJvbUxhYmVsO1xuICB9XG5cbiAgZ2V0IHRvTGFiZWxWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy50b0xhYmVsIHx8IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLnRvTGFiZWw7XG4gIH1cblxuICBnZXQgbG93KCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5maWx0ZXIubG93ID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh0aGlzLmZpbHRlci5sb3cpKSB7XG4gICAgICByZXR1cm4gdGhpcy5maWx0ZXIubG93O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGVyZSdzIG5vdCBhIGxvdyBsaW1pdFxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIHNldCBsb3cobG93OiBudW1iZXIgfCBzdHJpbmcpIHtcbiAgICBpZiAodHlwZW9mIGxvdyA9PT0gJ251bWJlcicgJiYgbG93ICE9PSB0aGlzLmZpbHRlci5sb3cpIHtcbiAgICAgIHRoaXMuZmlsdGVyLmxvdyA9IGxvdztcbiAgICAgIHRoaXMuZmlsdGVyVmFsdWVDaGFuZ2UuZW1pdChbdGhpcy5maWx0ZXIubG93LCB0aGlzLmZpbHRlci5oaWdoXSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbG93ICE9PSAnbnVtYmVyJykge1xuICAgICAgdGhpcy5maWx0ZXIubG93ID0gbnVsbDtcbiAgICAgIHRoaXMuZmlsdGVyVmFsdWVDaGFuZ2UuZW1pdChbdGhpcy5maWx0ZXIubG93LCB0aGlzLmZpbHRlci5oaWdoXSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGhpZ2goKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmZpbHRlci5oaWdoID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh0aGlzLmZpbHRlci5oaWdoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyLmhpZ2g7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoZXJlJ3Mgbm90IGEgaGlnaCBsaW1pdFxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIHNldCBoaWdoKGhpZ2g6IG51bWJlciB8IHN0cmluZykge1xuICAgIGlmICh0eXBlb2YgaGlnaCA9PT0gJ251bWJlcicgJiYgaGlnaCAhPT0gdGhpcy5maWx0ZXIuaGlnaCkge1xuICAgICAgdGhpcy5maWx0ZXIuaGlnaCA9IGhpZ2g7XG4gICAgICB0aGlzLmZpbHRlclZhbHVlQ2hhbmdlLmVtaXQoW3RoaXMuZmlsdGVyLmxvdywgdGhpcy5maWx0ZXIuaGlnaF0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGhpZ2ggIT09ICdudW1iZXInKSB7XG4gICAgICB0aGlzLmZpbHRlci5oaWdoID0gbnVsbDtcbiAgICAgIHRoaXMuZmlsdGVyVmFsdWVDaGFuZ2UuZW1pdChbdGhpcy5maWx0ZXIubG93LCB0aGlzLmZpbHRlci5oaWdoXSk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgdGhpcy5wb3BvdmVyVG9nZ2xlU2VydmljZS5vcGVuQ2hhbmdlLnN1YnNjcmliZShvcGVuQ2hhbmdlID0+IHtcbiAgICAgICAgdGhpcy5vcGVuID0gb3BlbkNoYW5nZTtcbiAgICAgICAgLy8gTm90ZTogdGhpcyBpcyBiZWluZyBydW4gb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lIGJlY2F1c2UgYGVsZW1lbnQuZm9jdXMoKWAgZG9lc24ndCByZXF1aXJlXG4gICAgICAgIC8vIHJ1bm5pbmcgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIC8vIFRoZSBhbmltYXRpb24gZnJhbWUgaW4gdXNlZCBiZWNhdXNlIHdoZW4gdGhpcyBleGVjdXRlcywgdGhlIGlucHV0IGlzbid0IGRpc3BsYXllZC5cbiAgICAgICAgICAvLyBOb3RlOiBgZWxlbWVudC5mb2N1cygpYCBjYXVzZXMgcmUtbGF5b3V0IGFuZCB0aGlzIG1heSBsZWFkIHRvIGZyYW1lIGRyb3Agb24gc2xvd2VyIGRldmljZXMuXG4gICAgICAgICAgLy8gYHNldFRpbWVvdXRgIGlzIGEgbWFjcm90YXNrIGFuZCBtYWNyb3Rhc2tzIGFyZSBleGVjdXRlZCB3aXRoaW4gdGhlIGN1cnJlbnQgcmVuZGVyaW5nIGZyYW1lLlxuICAgICAgICAgIC8vIEFuaW1hdGlvbiB0YXNrcyBhcmUgZXhlY3V0ZWQgd2l0aGluIHRoZSBuZXh0IHJlbmRlcmluZyBmcmFtZS5cbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kb21BZGFwdGVyLmZvY3VzKHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKSB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4ge1xuICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==
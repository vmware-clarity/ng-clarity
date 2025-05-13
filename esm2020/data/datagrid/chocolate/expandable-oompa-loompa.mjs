/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Optional } from '@angular/core';
import { OompaLoompa } from '../../../utils/chocolate/oompa-loompa';
import * as i0 from "@angular/core";
import * as i1 from "./datagrid-willy-wonka";
import * as i2 from "../providers/global-expandable-rows";
export class ExpandableOompaLoompa extends OompaLoompa {
    constructor(cdr, willyWonka, expandableCount) {
        if (!willyWonka) {
            throw new Error('clr-dg-row should only be used inside of a clr-datagrid');
        }
        super(cdr, willyWonka);
        this.expandableCount = expandableCount;
    }
    get flavor() {
        return this.expandableCount.hasExpandableRow;
    }
}
ExpandableOompaLoompa.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ExpandableOompaLoompa, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.DatagridWillyWonka, optional: true }, { token: i2.ExpandableRowsCount }], target: i0.ɵɵFactoryTarget.Directive });
ExpandableOompaLoompa.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ExpandableOompaLoompa, selector: "clr-datagrid, clr-dg-row", usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ExpandableOompaLoompa, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-datagrid, clr-dg-row',
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.DatagridWillyWonka, decorators: [{
                    type: Optional
                }] }, { type: i2.ExpandableRowsCount }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5kYWJsZS1vb21wYS1sb29tcGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2Nob2NvbGF0ZS9leHBhbmRhYmxlLW9vbXBhLWxvb21wYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBcUIsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV2RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sdUNBQXVDLENBQUM7Ozs7QUFPcEUsTUFBTSxPQUFPLHFCQUFzQixTQUFRLFdBQVc7SUFHcEQsWUFDRSxHQUFzQixFQUNWLFVBQThCLEVBQzFDLGVBQW9DO1FBRXBDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDZixNQUFNLElBQUksS0FBSyxDQUFDLHlEQUF5RCxDQUFDLENBQUM7U0FDNUU7UUFDRCxLQUFLLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO0lBQ3pDLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUM7SUFDL0MsQ0FBQzs7a0hBakJVLHFCQUFxQjtzR0FBckIscUJBQXFCOzJGQUFyQixxQkFBcUI7a0JBSGpDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDBCQUEwQjtpQkFDckM7OzBCQU1JLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENoYW5nZURldGVjdG9yUmVmLCBEaXJlY3RpdmUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9vbXBhTG9vbXBhIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvY2hvY29sYXRlL29vbXBhLWxvb21wYSc7XG5pbXBvcnQgeyBFeHBhbmRhYmxlUm93c0NvdW50IH0gZnJvbSAnLi4vcHJvdmlkZXJzL2dsb2JhbC1leHBhbmRhYmxlLXJvd3MnO1xuaW1wb3J0IHsgRGF0YWdyaWRXaWxseVdvbmthIH0gZnJvbSAnLi9kYXRhZ3JpZC13aWxseS13b25rYSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2Nsci1kYXRhZ3JpZCwgY2xyLWRnLXJvdycsXG59KVxuZXhwb3J0IGNsYXNzIEV4cGFuZGFibGVPb21wYUxvb21wYSBleHRlbmRzIE9vbXBhTG9vbXBhIHtcbiAgcHJpdmF0ZSBleHBhbmRhYmxlQ291bnQ6IEV4cGFuZGFibGVSb3dzQ291bnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBAT3B0aW9uYWwoKSB3aWxseVdvbmthOiBEYXRhZ3JpZFdpbGx5V29ua2EsXG4gICAgZXhwYW5kYWJsZUNvdW50OiBFeHBhbmRhYmxlUm93c0NvdW50XG4gICkge1xuICAgIGlmICghd2lsbHlXb25rYSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjbHItZGctcm93IHNob3VsZCBvbmx5IGJlIHVzZWQgaW5zaWRlIG9mIGEgY2xyLWRhdGFncmlkJyk7XG4gICAgfVxuICAgIHN1cGVyKGNkciwgd2lsbHlXb25rYSk7XG4gICAgdGhpcy5leHBhbmRhYmxlQ291bnQgPSBleHBhbmRhYmxlQ291bnQ7XG4gIH1cblxuICBnZXQgZmxhdm9yKCkge1xuICAgIHJldHVybiB0aGlzLmV4cGFuZGFibGVDb3VudC5oYXNFeHBhbmRhYmxlUm93O1xuICB9XG59XG4iXX0=
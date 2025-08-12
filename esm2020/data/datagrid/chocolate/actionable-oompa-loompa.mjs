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
import * as i2 from "../providers/row-action-service";
export class ActionableOompaLoompa extends OompaLoompa {
    constructor(cdr, willyWonka, rowActions) {
        if (!willyWonka) {
            throw new Error('clr-dg-row should only be used inside of a clr-datagrid');
        }
        super(cdr, willyWonka);
        this.rowActions = rowActions;
    }
    get flavor() {
        return this.rowActions.hasActionableRow;
    }
}
ActionableOompaLoompa.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ActionableOompaLoompa, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.DatagridWillyWonka, optional: true }, { token: i2.RowActionService }], target: i0.ɵɵFactoryTarget.Directive });
ActionableOompaLoompa.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ActionableOompaLoompa, selector: "clr-datagrid, clr-dg-row", usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ActionableOompaLoompa, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-datagrid, clr-dg-row',
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.DatagridWillyWonka, decorators: [{
                    type: Optional
                }] }, { type: i2.RowActionService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uYWJsZS1vb21wYS1sb29tcGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2Nob2NvbGF0ZS9hY3Rpb25hYmxlLW9vbXBhLWxvb21wYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBcUIsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV2RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sdUNBQXVDLENBQUM7Ozs7QUFPcEUsTUFBTSxPQUFPLHFCQUFzQixTQUFRLFdBQVc7SUFHcEQsWUFBWSxHQUFzQixFQUFjLFVBQThCLEVBQUUsVUFBNEI7UUFDMUcsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMseURBQXlELENBQUMsQ0FBQztTQUM1RTtRQUNELEtBQUssQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDL0IsQ0FBQztJQUVELElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztJQUMxQyxDQUFDOztrSEFiVSxxQkFBcUI7c0dBQXJCLHFCQUFxQjsyRkFBckIscUJBQXFCO2tCQUhqQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSwwQkFBMEI7aUJBQ3JDOzswQkFJc0MsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0b3JSZWYsIERpcmVjdGl2ZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT29tcGFMb29tcGEgfSBmcm9tICcuLi8uLi8uLi91dGlscy9jaG9jb2xhdGUvb29tcGEtbG9vbXBhJztcbmltcG9ydCB7IFJvd0FjdGlvblNlcnZpY2UgfSBmcm9tICcuLi9wcm92aWRlcnMvcm93LWFjdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IERhdGFncmlkV2lsbHlXb25rYSB9IGZyb20gJy4vZGF0YWdyaWQtd2lsbHktd29ua2EnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdjbHItZGF0YWdyaWQsIGNsci1kZy1yb3cnLFxufSlcbmV4cG9ydCBjbGFzcyBBY3Rpb25hYmxlT29tcGFMb29tcGEgZXh0ZW5kcyBPb21wYUxvb21wYSB7XG4gIHByaXZhdGUgcm93QWN0aW9uczogUm93QWN0aW9uU2VydmljZTtcblxuICBjb25zdHJ1Y3RvcihjZHI6IENoYW5nZURldGVjdG9yUmVmLCBAT3B0aW9uYWwoKSB3aWxseVdvbmthOiBEYXRhZ3JpZFdpbGx5V29ua2EsIHJvd0FjdGlvbnM6IFJvd0FjdGlvblNlcnZpY2UpIHtcbiAgICBpZiAoIXdpbGx5V29ua2EpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY2xyLWRnLXJvdyBzaG91bGQgb25seSBiZSB1c2VkIGluc2lkZSBvZiBhIGNsci1kYXRhZ3JpZCcpO1xuICAgIH1cbiAgICBzdXBlcihjZHIsIHdpbGx5V29ua2EpO1xuICAgIHRoaXMucm93QWN0aW9ucyA9IHJvd0FjdGlvbnM7XG4gIH1cblxuICBnZXQgZmxhdm9yKCkge1xuICAgIHJldHVybiB0aGlzLnJvd0FjdGlvbnMuaGFzQWN0aW9uYWJsZVJvdztcbiAgfVxufVxuIl19
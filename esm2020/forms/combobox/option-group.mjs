/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChild, Input } from '@angular/core';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrOptionItems } from './option-items.directive';
import * as i0 from "@angular/core";
export class ClrOptionGroup {
    constructor() {
        this.labelId = uniqueIdFactory();
    }
}
ClrOptionGroup.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrOptionGroup, deps: [], target: i0.ɵɵFactoryTarget.Component });
ClrOptionGroup.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrOptionGroup, selector: "clr-option-group", inputs: { label: ["clrOptionGroupLabel", "label"] }, host: { properties: { "attr.role": "\"group\"", "attr.aria-labelledby": "labelId", "style.display": "clrOptionItems.hasResults ? undefined : \"none\"" } }, queries: [{ propertyName: "clrOptionItems", first: true, predicate: ClrOptionItems, descendants: true }], ngImport: i0, template: `
    <span [id]="labelId" class="clr-option-group-label" role="presentation">{{ label }}</span>
    <ng-content></ng-content>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrOptionGroup, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-option-group',
                    host: {
                        '[attr.role]': '"group"',
                        '[attr.aria-labelledby]': 'labelId',
                        '[style.display]': 'clrOptionItems.hasResults ? undefined : "none"',
                    },
                    template: `
    <span [id]="labelId" class="clr-option-group-label" role="presentation">{{ label }}</span>
    <ng-content></ng-content>
  `,
                }]
        }], propDecorators: { label: [{
                type: Input,
                args: ['clrOptionGroupLabel']
            }], clrOptionItems: [{
                type: ContentChild,
                args: [ClrOptionItems]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uLWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvY29tYm9ib3gvb3B0aW9uLWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRS9ELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUNoRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7O0FBYzFELE1BQU0sT0FBTyxjQUFjO0lBWjNCO1FBaUJZLFlBQU8sR0FBRyxlQUFlLEVBQUUsQ0FBQztLQUN2Qzs7MkdBTlksY0FBYzsrRkFBZCxjQUFjLHFUQUdYLGNBQWMsZ0RBUmxCOzs7R0FHVDsyRkFFVSxjQUFjO2tCQVoxQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLElBQUksRUFBRTt3QkFDSixhQUFhLEVBQUUsU0FBUzt3QkFDeEIsd0JBQXdCLEVBQUUsU0FBUzt3QkFDbkMsaUJBQWlCLEVBQUUsZ0RBQWdEO3FCQUNwRTtvQkFDRCxRQUFRLEVBQUU7OztHQUdUO2lCQUNGOzhCQUUrQixLQUFLO3NCQUFsQyxLQUFLO3VCQUFDLHFCQUFxQjtnQkFFWSxjQUFjO3NCQUFyRCxZQUFZO3VCQUFDLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgQ29udGVudENoaWxkLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyB1bmlxdWVJZEZhY3RvcnkgfSBmcm9tICcuLi8uLi91dGlscy9pZC1nZW5lcmF0b3IvaWQtZ2VuZXJhdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyT3B0aW9uSXRlbXMgfSBmcm9tICcuL29wdGlvbi1pdGVtcy5kaXJlY3RpdmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItb3B0aW9uLWdyb3VwJyxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5yb2xlXSc6ICdcImdyb3VwXCInLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ2xhYmVsSWQnLFxuICAgICdbc3R5bGUuZGlzcGxheV0nOiAnY2xyT3B0aW9uSXRlbXMuaGFzUmVzdWx0cyA/IHVuZGVmaW5lZCA6IFwibm9uZVwiJyxcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8c3BhbiBbaWRdPVwibGFiZWxJZFwiIGNsYXNzPVwiY2xyLW9wdGlvbi1ncm91cC1sYWJlbFwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj57eyBsYWJlbCB9fTwvc3Bhbj5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIGAsXG59KVxuZXhwb3J0IGNsYXNzIENsck9wdGlvbkdyb3VwPFQ+IHtcbiAgQElucHV0KCdjbHJPcHRpb25Hcm91cExhYmVsJykgbGFiZWw6IHN0cmluZztcblxuICBAQ29udGVudENoaWxkKENsck9wdGlvbkl0ZW1zKSBwcm90ZWN0ZWQgY2xyT3B0aW9uSXRlbXM6IENsck9wdGlvbkl0ZW1zPFQ+O1xuXG4gIHByb3RlY3RlZCBsYWJlbElkID0gdW5pcXVlSWRGYWN0b3J5KCk7XG59XG4iXX0=
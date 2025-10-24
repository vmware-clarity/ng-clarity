/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, HostBinding, Input } from '@angular/core';
import { ClrTimelineLayout } from './enums/timeline-layout.enum';
import { TimelineIconAttributeService } from './providers/timeline-icon-attribute.service';
import * as i0 from "@angular/core";
export class ClrTimeline {
    constructor() {
        this.layout = ClrTimelineLayout.HORIZONTAL;
    }
    get isVertical() {
        return this.layout === ClrTimelineLayout.VERTICAL;
    }
}
ClrTimeline.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTimeline, deps: [], target: i0.ɵɵFactoryTarget.Component });
ClrTimeline.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrTimeline, selector: "clr-timeline", inputs: { layout: ["clrLayout", "layout"] }, host: { properties: { "class.clr-timeline": "true", "attr.role": "\"list\"", "class.clr-timeline-vertical": "this.isVertical" } }, providers: [TimelineIconAttributeService], ngImport: i0, template: `<ng-content></ng-content>`, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTimeline, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-timeline',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.clr-timeline]': 'true', '[attr.role]': '"list"' },
                    providers: [TimelineIconAttributeService],
                }]
        }], propDecorators: { layout: [{
                type: Input,
                args: ['clrLayout']
            }], isVertical: [{
                type: HostBinding,
                args: ['class.clr-timeline-vertical']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZWxpbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy90aW1lbGluZS90aW1lbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQzs7QUFRM0YsTUFBTSxPQUFPLFdBQVc7SUFOeEI7UUFPc0IsV0FBTSxHQUFzQixpQkFBaUIsQ0FBQyxVQUFVLENBQUM7S0FNOUU7SUFKQyxJQUNJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssaUJBQWlCLENBQUMsUUFBUSxDQUFDO0lBQ3BELENBQUM7O3dHQU5VLFdBQVc7NEZBQVgsV0FBVyx1TkFGWCxDQUFDLDRCQUE0QixDQUFDLDBCQUYvQiwyQkFBMkI7MkZBSTFCLFdBQVc7a0JBTnZCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLFFBQVEsRUFBRSwyQkFBMkI7b0JBQ3JDLElBQUksRUFBRSxFQUFFLHNCQUFzQixFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFO29CQUNqRSxTQUFTLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQztpQkFDMUM7OEJBRXFCLE1BQU07c0JBQXpCLEtBQUs7dUJBQUMsV0FBVztnQkFHZCxVQUFVO3NCQURiLFdBQVc7dUJBQUMsNkJBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEhvc3RCaW5kaW5nLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJUaW1lbGluZUxheW91dCB9IGZyb20gJy4vZW51bXMvdGltZWxpbmUtbGF5b3V0LmVudW0nO1xuaW1wb3J0IHsgVGltZWxpbmVJY29uQXR0cmlidXRlU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3RpbWVsaW5lLWljb24tYXR0cmlidXRlLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItdGltZWxpbmUnLFxuICB0ZW1wbGF0ZTogYDxuZy1jb250ZW50PjwvbmctY29udGVudD5gLFxuICBob3N0OiB7ICdbY2xhc3MuY2xyLXRpbWVsaW5lXSc6ICd0cnVlJywgJ1thdHRyLnJvbGVdJzogJ1wibGlzdFwiJyB9LFxuICBwcm92aWRlcnM6IFtUaW1lbGluZUljb25BdHRyaWJ1dGVTZXJ2aWNlXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyVGltZWxpbmUge1xuICBASW5wdXQoJ2NsckxheW91dCcpIGxheW91dDogQ2xyVGltZWxpbmVMYXlvdXQgPSBDbHJUaW1lbGluZUxheW91dC5IT1JJWk9OVEFMO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MuY2xyLXRpbWVsaW5lLXZlcnRpY2FsJylcbiAgZ2V0IGlzVmVydGljYWwoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubGF5b3V0ID09PSBDbHJUaW1lbGluZUxheW91dC5WRVJUSUNBTDtcbiAgfVxufVxuIl19
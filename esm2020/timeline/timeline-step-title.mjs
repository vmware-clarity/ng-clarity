/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Note: Why does this component have aria-hidden attribute?
 *
 * tl;dr: we want screen readers to ignore this element when its reading out to blind users.
 *
 * In order to make a timeline step accessible to screen readers we need the title read out before the
 * icon. In order to do this, ClrTimeLine step has a ContentChild that queries for the ClrTimelineStepTitle and
 * then adds the projected text into a .clr-sr-only element that is a sibling element to the icon. See the
 * ClrTimlineStep template for the DOM structure.
 */
export class ClrTimelineStepTitle {
}
ClrTimelineStepTitle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTimelineStepTitle, deps: [], target: i0.ɵɵFactoryTarget.Component });
ClrTimelineStepTitle.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrTimelineStepTitle, selector: "clr-timeline-step-title", host: { properties: { "class.clr-timeline-step-title": "true", "attr.aria-hidden": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTimelineStepTitle, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-timeline-step-title',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.clr-timeline-step-title]': 'true', '[attr.aria-hidden]': 'true' },
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZWxpbmUtc3RlcC10aXRsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3RpbWVsaW5lL3RpbWVsaW5lLXN0ZXAtdGl0bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUUxQzs7Ozs7Ozs7O0dBU0c7QUFNSCxNQUFNLE9BQU8sb0JBQW9COztpSEFBcEIsb0JBQW9CO3FHQUFwQixvQkFBb0IsOEpBSHJCLDJCQUEyQjsyRkFHMUIsb0JBQW9CO2tCQUxoQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx5QkFBeUI7b0JBQ25DLFFBQVEsRUFBRSwyQkFBMkI7b0JBQ3JDLElBQUksRUFBRSxFQUFFLGlDQUFpQyxFQUFFLE1BQU0sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLEVBQUU7aUJBQ2xGIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBOb3RlOiBXaHkgZG9lcyB0aGlzIGNvbXBvbmVudCBoYXZlIGFyaWEtaGlkZGVuIGF0dHJpYnV0ZT9cbiAqXG4gKiB0bDtkcjogd2Ugd2FudCBzY3JlZW4gcmVhZGVycyB0byBpZ25vcmUgdGhpcyBlbGVtZW50IHdoZW4gaXRzIHJlYWRpbmcgb3V0IHRvIGJsaW5kIHVzZXJzLlxuICpcbiAqIEluIG9yZGVyIHRvIG1ha2UgYSB0aW1lbGluZSBzdGVwIGFjY2Vzc2libGUgdG8gc2NyZWVuIHJlYWRlcnMgd2UgbmVlZCB0aGUgdGl0bGUgcmVhZCBvdXQgYmVmb3JlIHRoZVxuICogaWNvbi4gSW4gb3JkZXIgdG8gZG8gdGhpcywgQ2xyVGltZUxpbmUgc3RlcCBoYXMgYSBDb250ZW50Q2hpbGQgdGhhdCBxdWVyaWVzIGZvciB0aGUgQ2xyVGltZWxpbmVTdGVwVGl0bGUgYW5kXG4gKiB0aGVuIGFkZHMgdGhlIHByb2plY3RlZCB0ZXh0IGludG8gYSAuY2xyLXNyLW9ubHkgZWxlbWVudCB0aGF0IGlzIGEgc2libGluZyBlbGVtZW50IHRvIHRoZSBpY29uLiBTZWUgdGhlXG4gKiBDbHJUaW1saW5lU3RlcCB0ZW1wbGF0ZSBmb3IgdGhlIERPTSBzdHJ1Y3R1cmUuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci10aW1lbGluZS1zdGVwLXRpdGxlJyxcbiAgdGVtcGxhdGU6IGA8bmctY29udGVudD48L25nLWNvbnRlbnQ+YCxcbiAgaG9zdDogeyAnW2NsYXNzLmNsci10aW1lbGluZS1zdGVwLXRpdGxlXSc6ICd0cnVlJywgJ1thdHRyLmFyaWEtaGlkZGVuXSc6ICd0cnVlJyB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJUaW1lbGluZVN0ZXBUaXRsZSB7fVxuIl19
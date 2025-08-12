/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ContentChildren, Directive, HostListener, Input } from '@angular/core';
import { ClrLabel } from './label';
import { LayoutService } from './providers/layout.service';
import { MarkControlService } from './providers/mark-control.service';
import * as i0 from "@angular/core";
import * as i1 from "./providers/layout.service";
import * as i2 from "./providers/mark-control.service";
export class ClrForm {
    constructor(layoutService, markControlService) {
        this.layoutService = layoutService;
        this.markControlService = markControlService;
    }
    set labelSize(size) {
        const sizeNumber = parseInt(size, 10) || 2;
        this.layoutService.labelSize = sizeNumber;
    }
    onFormSubmit() {
        this.markAsTouched();
    }
    // Trying to avoid adding an input and keep this backwards compatible at the same time
    markAsTouched() {
        this.markControlService.markAsTouched();
    }
}
ClrForm.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrForm, deps: [{ token: i1.LayoutService }, { token: i2.MarkControlService }], target: i0.ɵɵFactoryTarget.Directive });
ClrForm.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrForm, selector: "[clrForm]", inputs: { labelSize: ["clrLabelSize", "labelSize"] }, host: { listeners: { "submit": "onFormSubmit()" }, properties: { "class.clr-form": "true", "class.clr-form-horizontal": "layoutService.isHorizontal()", "class.clr-form-compact": "layoutService.isCompact()" } }, providers: [LayoutService, MarkControlService], queries: [{ propertyName: "labels", predicate: ClrLabel, descendants: true }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrForm, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrForm]',
                    providers: [LayoutService, MarkControlService],
                    host: {
                        '[class.clr-form]': 'true',
                        '[class.clr-form-horizontal]': 'layoutService.isHorizontal()',
                        '[class.clr-form-compact]': 'layoutService.isCompact()',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.LayoutService }, { type: i2.MarkControlService }]; }, propDecorators: { labels: [{
                type: ContentChildren,
                args: [ClrLabel, { descendants: true }]
            }], labelSize: [{
                type: Input,
                args: ['clrLabelSize']
            }], onFormSubmit: [{
                type: HostListener,
                args: ['submit']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2NvbW1vbi9mb3JtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUUzRixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ25DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7OztBQVd0RSxNQUFNLE9BQU8sT0FBTztJQUdsQixZQUFtQixhQUE0QixFQUFVLGtCQUFzQztRQUE1RSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFVLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7SUFBRyxDQUFDO0lBRW5HLElBQ0ksU0FBUyxDQUFDLElBQXFCO1FBQ2pDLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxJQUFjLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztJQUM1QyxDQUFDO0lBR0QsWUFBWTtRQUNWLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsc0ZBQXNGO0lBQ3RGLGFBQWE7UUFDWCxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDMUMsQ0FBQzs7b0dBbkJVLE9BQU87d0ZBQVAsT0FBTyw2U0FQUCxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxpREFRN0IsUUFBUTsyRkFEZCxPQUFPO2tCQVRuQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxXQUFXO29CQUNyQixTQUFTLEVBQUUsQ0FBQyxhQUFhLEVBQUUsa0JBQWtCLENBQUM7b0JBQzlDLElBQUksRUFBRTt3QkFDSixrQkFBa0IsRUFBRSxNQUFNO3dCQUMxQiw2QkFBNkIsRUFBRSw4QkFBOEI7d0JBQzdELDBCQUEwQixFQUFFLDJCQUEyQjtxQkFDeEQ7aUJBQ0Y7cUlBRW1ELE1BQU07c0JBQXZELGVBQWU7dUJBQUMsUUFBUSxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRTtnQkFLNUMsU0FBUztzQkFEWixLQUFLO3VCQUFDLGNBQWM7Z0JBT3JCLFlBQVk7c0JBRFgsWUFBWTt1QkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb250ZW50Q2hpbGRyZW4sIERpcmVjdGl2ZSwgSG9zdExpc3RlbmVyLCBJbnB1dCwgUXVlcnlMaXN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckxhYmVsIH0gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQgeyBMYXlvdXRTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvbGF5b3V0LnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFya0NvbnRyb2xTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvbWFyay1jb250cm9sLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xyRm9ybV0nLFxuICBwcm92aWRlcnM6IFtMYXlvdXRTZXJ2aWNlLCBNYXJrQ29udHJvbFNlcnZpY2VdLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5jbHItZm9ybV0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5jbHItZm9ybS1ob3Jpem9udGFsXSc6ICdsYXlvdXRTZXJ2aWNlLmlzSG9yaXpvbnRhbCgpJyxcbiAgICAnW2NsYXNzLmNsci1mb3JtLWNvbXBhY3RdJzogJ2xheW91dFNlcnZpY2UuaXNDb21wYWN0KCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJGb3JtIHtcbiAgQENvbnRlbnRDaGlsZHJlbihDbHJMYWJlbCwgeyBkZXNjZW5kYW50czogdHJ1ZSB9KSBsYWJlbHM6IFF1ZXJ5TGlzdDxDbHJMYWJlbD47XG5cbiAgY29uc3RydWN0b3IocHVibGljIGxheW91dFNlcnZpY2U6IExheW91dFNlcnZpY2UsIHByaXZhdGUgbWFya0NvbnRyb2xTZXJ2aWNlOiBNYXJrQ29udHJvbFNlcnZpY2UpIHt9XG5cbiAgQElucHV0KCdjbHJMYWJlbFNpemUnKVxuICBzZXQgbGFiZWxTaXplKHNpemU6IG51bWJlciB8IHN0cmluZykge1xuICAgIGNvbnN0IHNpemVOdW1iZXIgPSBwYXJzZUludChzaXplIGFzIHN0cmluZywgMTApIHx8IDI7XG4gICAgdGhpcy5sYXlvdXRTZXJ2aWNlLmxhYmVsU2l6ZSA9IHNpemVOdW1iZXI7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdzdWJtaXQnKVxuICBvbkZvcm1TdWJtaXQoKSB7XG4gICAgdGhpcy5tYXJrQXNUb3VjaGVkKCk7XG4gIH1cblxuICAvLyBUcnlpbmcgdG8gYXZvaWQgYWRkaW5nIGFuIGlucHV0IGFuZCBrZWVwIHRoaXMgYmFja3dhcmRzIGNvbXBhdGlibGUgYXQgdGhlIHNhbWUgdGltZVxuICBtYXJrQXNUb3VjaGVkKCkge1xuICAgIHRoaXMubWFya0NvbnRyb2xTZXJ2aWNlLm1hcmtBc1RvdWNoZWQoKTtcbiAgfVxufVxuIl19
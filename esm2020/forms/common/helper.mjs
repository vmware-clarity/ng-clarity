/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, Optional } from '@angular/core';
import { ClrAbstractControl, CONTROL_SUFFIX } from './abstract-control';
import * as i0 from "@angular/core";
import * as i1 from "./providers/control-id.service";
import * as i2 from "./providers/container-id.service";
export class ClrControlHelper extends ClrAbstractControl {
    constructor(controlIdService, containerIdService) {
        super(controlIdService, containerIdService);
        this.controlIdService = controlIdService;
        this.containerIdService = containerIdService;
        this.controlIdSuffix = CONTROL_SUFFIX.HELPER;
    }
}
ClrControlHelper.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrControlHelper, deps: [{ token: i1.ControlIdService, optional: true }, { token: i2.ContainerIdService, optional: true }], target: i0.ɵɵFactoryTarget.Component });
ClrControlHelper.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrControlHelper, selector: "clr-control-helper", host: { properties: { "class.clr-subtext": "true", "attr.id": "id" } }, usesInheritance: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrControlHelper, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-control-helper',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.clr-subtext]': 'true',
                        '[attr.id]': 'id',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.ControlIdService, decorators: [{
                    type: Optional
                }] }, { type: i2.ContainerIdService, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvY29tbW9uL2hlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXBELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxjQUFjLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQzs7OztBQVl4RSxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsa0JBQWtCO0lBR3RELFlBQ2lDLGdCQUFrQyxFQUNsQyxrQkFBc0M7UUFFckUsS0FBSyxDQUFDLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFIYixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFKOUQsb0JBQWUsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDO0lBT2pELENBQUM7OzZHQVJVLGdCQUFnQjtpR0FBaEIsZ0JBQWdCLHlKQU5qQiwyQkFBMkI7MkZBTTFCLGdCQUFnQjtrQkFSNUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0oscUJBQXFCLEVBQUUsTUFBTTt3QkFDN0IsV0FBVyxFQUFFLElBQUk7cUJBQ2xCO2lCQUNGOzswQkFLSSxRQUFROzswQkFDUixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckFic3RyYWN0Q29udHJvbCwgQ09OVFJPTF9TVUZGSVggfSBmcm9tICcuL2Fic3RyYWN0LWNvbnRyb2wnO1xuaW1wb3J0IHsgQ29udGFpbmVySWRTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvY29udGFpbmVyLWlkLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29udHJvbElkU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2NvbnRyb2wtaWQuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1jb250cm9sLWhlbHBlcicsXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PmAsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmNsci1zdWJ0ZXh0XSc6ICd0cnVlJyxcbiAgICAnW2F0dHIuaWRdJzogJ2lkJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyQ29udHJvbEhlbHBlciBleHRlbmRzIENsckFic3RyYWN0Q29udHJvbCB7XG4gIG92ZXJyaWRlIGNvbnRyb2xJZFN1ZmZpeCA9IENPTlRST0xfU1VGRklYLkhFTFBFUjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBwcm90ZWN0ZWQgb3ZlcnJpZGUgY29udHJvbElkU2VydmljZTogQ29udHJvbElkU2VydmljZSxcbiAgICBAT3B0aW9uYWwoKSBwcm90ZWN0ZWQgb3ZlcnJpZGUgY29udGFpbmVySWRTZXJ2aWNlOiBDb250YWluZXJJZFNlcnZpY2VcbiAgKSB7XG4gICAgc3VwZXIoY29udHJvbElkU2VydmljZSwgY29udGFpbmVySWRTZXJ2aWNlKTtcbiAgfVxufVxuIl19
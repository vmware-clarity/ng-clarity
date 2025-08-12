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
export class ClrControlError extends ClrAbstractControl {
    constructor(controlIdService, containerIdService) {
        super(controlIdService, containerIdService);
        this.controlIdService = controlIdService;
        this.containerIdService = containerIdService;
        this.controlIdSuffix = CONTROL_SUFFIX.ERROR;
    }
}
ClrControlError.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrControlError, deps: [{ token: i1.ControlIdService, optional: true }, { token: i2.ContainerIdService, optional: true }], target: i0.ɵɵFactoryTarget.Component });
ClrControlError.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrControlError, selector: "clr-control-error", host: { properties: { "class.clr-subtext": "true", "class.error": "true", "attr.id": "id" } }, usesInheritance: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrControlError, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-control-error',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.clr-subtext]': 'true',
                        '[class.error]': 'true',
                        '[attr.id]': 'id',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.ControlIdService, decorators: [{
                    type: Optional
                }] }, { type: i2.ContainerIdService, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9jb21tb24vZXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVwRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7Ozs7QUFheEUsTUFBTSxPQUFPLGVBQWdCLFNBQVEsa0JBQWtCO0lBR3JELFlBQ2lDLGdCQUFrQyxFQUNsQyxrQkFBc0M7UUFFckUsS0FBSyxDQUFDLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFIYixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFKOUQsb0JBQWUsR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDO0lBT2hELENBQUM7OzRHQVJVLGVBQWU7Z0dBQWYsZUFBZSwrS0FQaEIsMkJBQTJCOzJGQU8xQixlQUFlO2tCQVQzQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLFFBQVEsRUFBRSwyQkFBMkI7b0JBQ3JDLElBQUksRUFBRTt3QkFDSixxQkFBcUIsRUFBRSxNQUFNO3dCQUM3QixlQUFlLEVBQUUsTUFBTTt3QkFDdkIsV0FBVyxFQUFFLElBQUk7cUJBQ2xCO2lCQUNGOzswQkFLSSxRQUFROzswQkFDUixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckFic3RyYWN0Q29udHJvbCwgQ09OVFJPTF9TVUZGSVggfSBmcm9tICcuL2Fic3RyYWN0LWNvbnRyb2wnO1xuaW1wb3J0IHsgQ29udGFpbmVySWRTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvY29udGFpbmVyLWlkLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29udHJvbElkU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2NvbnRyb2wtaWQuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1jb250cm9sLWVycm9yJyxcbiAgdGVtcGxhdGU6IGA8bmctY29udGVudD48L25nLWNvbnRlbnQ+YCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuY2xyLXN1YnRleHRdJzogJ3RydWUnLFxuICAgICdbY2xhc3MuZXJyb3JdJzogJ3RydWUnLFxuICAgICdbYXR0ci5pZF0nOiAnaWQnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJDb250cm9sRXJyb3IgZXh0ZW5kcyBDbHJBYnN0cmFjdENvbnRyb2wge1xuICBvdmVycmlkZSBjb250cm9sSWRTdWZmaXggPSBDT05UUk9MX1NVRkZJWC5FUlJPUjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBwcm90ZWN0ZWQgb3ZlcnJpZGUgY29udHJvbElkU2VydmljZTogQ29udHJvbElkU2VydmljZSxcbiAgICBAT3B0aW9uYWwoKSBwcm90ZWN0ZWQgb3ZlcnJpZGUgY29udGFpbmVySWRTZXJ2aWNlOiBDb250YWluZXJJZFNlcnZpY2VcbiAgKSB7XG4gICAgc3VwZXIoY29udHJvbElkU2VydmljZSwgY29udGFpbmVySWRTZXJ2aWNlKTtcbiAgfVxufVxuIl19
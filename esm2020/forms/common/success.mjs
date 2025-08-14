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
export class ClrControlSuccess extends ClrAbstractControl {
    constructor(controlIdService, containerIdService) {
        super(controlIdService, containerIdService);
        this.controlIdService = controlIdService;
        this.containerIdService = containerIdService;
        this.controlIdSuffix = CONTROL_SUFFIX.SUCCESS;
    }
}
ClrControlSuccess.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrControlSuccess, deps: [{ token: i1.ControlIdService, optional: true }, { token: i2.ContainerIdService, optional: true }], target: i0.ɵɵFactoryTarget.Component });
ClrControlSuccess.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrControlSuccess, selector: "clr-control-success", host: { properties: { "class.clr-subtext": "true", "class.success": "true", "attr.id": "id" } }, usesInheritance: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrControlSuccess, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-control-success',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.clr-subtext]': 'true',
                        '[class.success]': 'true',
                        '[attr.id]': 'id',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.ControlIdService, decorators: [{
                    type: Optional
                }] }, { type: i2.ContainerIdService, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VjY2Vzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2NvbW1vbi9zdWNjZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFcEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDOzs7O0FBYXhFLE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxrQkFBa0I7SUFHdkQsWUFDaUMsZ0JBQWtDLEVBQ2xDLGtCQUFzQztRQUVyRSxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUhiLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUo5RCxvQkFBZSxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUM7SUFPbEQsQ0FBQzs7OEdBUlUsaUJBQWlCO2tHQUFqQixpQkFBaUIsbUxBUGxCLDJCQUEyQjsyRkFPMUIsaUJBQWlCO2tCQVQ3QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLFFBQVEsRUFBRSwyQkFBMkI7b0JBQ3JDLElBQUksRUFBRTt3QkFDSixxQkFBcUIsRUFBRSxNQUFNO3dCQUM3QixpQkFBaUIsRUFBRSxNQUFNO3dCQUN6QixXQUFXLEVBQUUsSUFBSTtxQkFDbEI7aUJBQ0Y7OzBCQUtJLFFBQVE7OzBCQUNSLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyQWJzdHJhY3RDb250cm9sLCBDT05UUk9MX1NVRkZJWCB9IGZyb20gJy4vYWJzdHJhY3QtY29udHJvbCc7XG5pbXBvcnQgeyBDb250YWluZXJJZFNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9jb250YWluZXItaWQuc2VydmljZSc7XG5pbXBvcnQgeyBDb250cm9sSWRTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvY29udHJvbC1pZC5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWNvbnRyb2wtc3VjY2VzcycsXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PmAsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmNsci1zdWJ0ZXh0XSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLnN1Y2Nlc3NdJzogJ3RydWUnLFxuICAgICdbYXR0ci5pZF0nOiAnaWQnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJDb250cm9sU3VjY2VzcyBleHRlbmRzIENsckFic3RyYWN0Q29udHJvbCB7XG4gIG92ZXJyaWRlIGNvbnRyb2xJZFN1ZmZpeCA9IENPTlRST0xfU1VGRklYLlNVQ0NFU1M7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJvdGVjdGVkIG92ZXJyaWRlIGNvbnRyb2xJZFNlcnZpY2U6IENvbnRyb2xJZFNlcnZpY2UsXG4gICAgQE9wdGlvbmFsKCkgcHJvdGVjdGVkIG92ZXJyaWRlIGNvbnRhaW5lcklkU2VydmljZTogQ29udGFpbmVySWRTZXJ2aWNlXG4gICkge1xuICAgIHN1cGVyKGNvbnRyb2xJZFNlcnZpY2UsIGNvbnRhaW5lcklkU2VydmljZSk7XG4gIH1cbn1cbiJdfQ==
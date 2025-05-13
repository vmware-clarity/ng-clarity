/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Optional } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/control-id.service";
import * as i2 from "./providers/container-id.service";
export const CONTROL_SUFFIX = {
    HELPER: 'helper',
    ERROR: 'error',
    SUCCESS: 'success',
    NONE: null,
};
export class ClrAbstractControl {
    constructor(controlIdService, containerIdService) {
        this.controlIdService = controlIdService;
        this.containerIdService = containerIdService;
        /**
         * Hold the suffix for the ID
         */
        this.controlIdSuffix = 'abstract';
    }
    get id() {
        /**
         * The order of witch the id will be pick is:
         *   - Container ID  (Wrapper arround multiple Controls like, Checkbox, Radio, ...)
         *   - Control ID (Single Control wrapper like Input, Textarea, Password, ...)
         *   - None
         */
        if (this.containerIdService) {
            return `${this.containerIdService.id}-${this.controlIdSuffix}`;
        }
        if (this.controlIdService) {
            return `${this.controlIdService.id}-${this.controlIdSuffix}`;
        }
        return null;
    }
}
ClrAbstractControl.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAbstractControl, deps: [{ token: i1.ControlIdService, optional: true }, { token: i2.ContainerIdService, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
ClrAbstractControl.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrAbstractControl, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAbstractControl, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.ControlIdService, decorators: [{
                    type: Optional
                }] }, { type: i2.ContainerIdService, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3QtY29udHJvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2NvbW1vbi9hYnN0cmFjdC1jb250cm9sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7QUFLcEQsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFxQztJQUM5RCxNQUFNLEVBQUUsUUFBUTtJQUNoQixLQUFLLEVBQUUsT0FBTztJQUNkLE9BQU8sRUFBRSxTQUFTO0lBQ2xCLElBQUksRUFBRSxJQUFJO0NBQ1gsQ0FBQztBQUdGLE1BQU0sT0FBZ0Isa0JBQWtCO0lBTXRDLFlBQ3dCLGdCQUFrQyxFQUNsQyxrQkFBc0M7UUFEdEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBUDlEOztXQUVHO1FBQ0gsb0JBQWUsR0FBRyxVQUFVLENBQUM7SUFLMUIsQ0FBQztJQUVKLElBQUksRUFBRTtRQUNKOzs7OztXQUtHO1FBQ0gsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDM0IsT0FBTyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQ2hFO1FBRUQsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDekIsT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQzlEO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDOzsrR0EzQm1CLGtCQUFrQjttR0FBbEIsa0JBQWtCOzJGQUFsQixrQkFBa0I7a0JBRHZDLFNBQVM7OzBCQVFMLFFBQVE7OzBCQUNSLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ29udGFpbmVySWRTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvY29udGFpbmVyLWlkLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29udHJvbElkU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2NvbnRyb2wtaWQuc2VydmljZSc7XG5cbmV4cG9ydCBjb25zdCBDT05UUk9MX1NVRkZJWDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudWxsIH0gPSB7XG4gIEhFTFBFUjogJ2hlbHBlcicsXG4gIEVSUk9SOiAnZXJyb3InLFxuICBTVUNDRVNTOiAnc3VjY2VzcycsXG4gIE5PTkU6IG51bGwsXG59O1xuXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDbHJBYnN0cmFjdENvbnRyb2wge1xuICAvKipcbiAgICogSG9sZCB0aGUgc3VmZml4IGZvciB0aGUgSURcbiAgICovXG4gIGNvbnRyb2xJZFN1ZmZpeCA9ICdhYnN0cmFjdCc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJvdGVjdGVkIGNvbnRyb2xJZFNlcnZpY2U6IENvbnRyb2xJZFNlcnZpY2UsXG4gICAgQE9wdGlvbmFsKCkgcHJvdGVjdGVkIGNvbnRhaW5lcklkU2VydmljZTogQ29udGFpbmVySWRTZXJ2aWNlXG4gICkge31cblxuICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICAvKipcbiAgICAgKiBUaGUgb3JkZXIgb2Ygd2l0Y2ggdGhlIGlkIHdpbGwgYmUgcGljayBpczpcbiAgICAgKiAgIC0gQ29udGFpbmVyIElEICAoV3JhcHBlciBhcnJvdW5kIG11bHRpcGxlIENvbnRyb2xzIGxpa2UsIENoZWNrYm94LCBSYWRpbywgLi4uKVxuICAgICAqICAgLSBDb250cm9sIElEIChTaW5nbGUgQ29udHJvbCB3cmFwcGVyIGxpa2UgSW5wdXQsIFRleHRhcmVhLCBQYXNzd29yZCwgLi4uKVxuICAgICAqICAgLSBOb25lXG4gICAgICovXG4gICAgaWYgKHRoaXMuY29udGFpbmVySWRTZXJ2aWNlKSB7XG4gICAgICByZXR1cm4gYCR7dGhpcy5jb250YWluZXJJZFNlcnZpY2UuaWR9LSR7dGhpcy5jb250cm9sSWRTdWZmaXh9YDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb250cm9sSWRTZXJ2aWNlKSB7XG4gICAgICByZXR1cm4gYCR7dGhpcy5jb250cm9sSWRTZXJ2aWNlLmlkfS0ke3RoaXMuY29udHJvbElkU3VmZml4fWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==
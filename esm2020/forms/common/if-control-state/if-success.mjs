/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Optional } from '@angular/core';
import { AbstractIfState } from './abstract-if-state';
import { CONTROL_STATE } from './if-control-state.service';
import * as i0 from "@angular/core";
import * as i1 from "./if-control-state.service";
import * as i2 from "../providers/ng-control.service";
export class ClrIfSuccess extends AbstractIfState {
    constructor(ifControlStateService, ngControlService, template, container) {
        super(ifControlStateService, ngControlService);
        this.template = template;
        this.container = container;
        if (!ifControlStateService) {
            throw new Error('ClrIfSuccess can only be used within a form control container element like clr-input-container');
        }
    }
    /**
     * @param state CONTROL_STATE
     */
    handleState(state) {
        const isValid = CONTROL_STATE.VALID === state;
        if (isValid && !this.displayedContent) {
            this.container.createEmbeddedView(this.template);
        }
        else if (!isValid && this.container) {
            this.container.clear();
        }
        this.displayedContent = isValid;
    }
}
ClrIfSuccess.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrIfSuccess, deps: [{ token: i1.IfControlStateService, optional: true }, { token: i2.NgControlService, optional: true }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrIfSuccess.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrIfSuccess, selector: "[clrIfSuccess]", usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrIfSuccess, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrIfSuccess]',
                }]
        }], ctorParameters: function () { return [{ type: i1.IfControlStateService, decorators: [{
                    type: Optional
                }] }, { type: i2.NgControlService, decorators: [{
                    type: Optional
                }] }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWYtc3VjY2Vzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2NvbW1vbi9pZi1jb250cm9sLXN0YXRlL2lmLXN1Y2Nlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBaUMsTUFBTSxlQUFlLENBQUM7QUFHbkYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxhQUFhLEVBQXlCLE1BQU0sNEJBQTRCLENBQUM7Ozs7QUFLbEYsTUFBTSxPQUFPLFlBQWEsU0FBUSxlQUFlO0lBQy9DLFlBQ2MscUJBQTRDLEVBQzVDLGdCQUFrQyxFQUN0QyxRQUEwQixFQUMxQixTQUEyQjtRQUVuQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUh2QyxhQUFRLEdBQVIsUUFBUSxDQUFrQjtRQUMxQixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUluQyxJQUFJLENBQUMscUJBQXFCLEVBQUU7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnR0FBZ0csQ0FBQyxDQUFDO1NBQ25IO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ2dCLFdBQVcsQ0FBQyxLQUFvQjtRQUNqRCxNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQztRQUU5QyxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNsRDthQUFNLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3hCO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQztJQUNsQyxDQUFDOzt5R0ExQlUsWUFBWTs2RkFBWixZQUFZOzJGQUFaLFlBQVk7a0JBSHhCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtpQkFDM0I7OzBCQUdJLFFBQVE7OzBCQUNSLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgT3B0aW9uYWwsIFRlbXBsYXRlUmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE5nQ29udHJvbFNlcnZpY2UgfSBmcm9tICcuLi9wcm92aWRlcnMvbmctY29udHJvbC5zZXJ2aWNlJztcbmltcG9ydCB7IEFic3RyYWN0SWZTdGF0ZSB9IGZyb20gJy4vYWJzdHJhY3QtaWYtc3RhdGUnO1xuaW1wb3J0IHsgQ09OVFJPTF9TVEFURSwgSWZDb250cm9sU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi9pZi1jb250cm9sLXN0YXRlLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xySWZTdWNjZXNzXScsXG59KVxuZXhwb3J0IGNsYXNzIENscklmU3VjY2VzcyBleHRlbmRzIEFic3RyYWN0SWZTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIGlmQ29udHJvbFN0YXRlU2VydmljZTogSWZDb250cm9sU3RhdGVTZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIG5nQ29udHJvbFNlcnZpY2U6IE5nQ29udHJvbFNlcnZpY2UsXG4gICAgcHJpdmF0ZSB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PixcbiAgICBwcml2YXRlIGNvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZlxuICApIHtcbiAgICBzdXBlcihpZkNvbnRyb2xTdGF0ZVNlcnZpY2UsIG5nQ29udHJvbFNlcnZpY2UpO1xuXG4gICAgaWYgKCFpZkNvbnRyb2xTdGF0ZVNlcnZpY2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2xySWZTdWNjZXNzIGNhbiBvbmx5IGJlIHVzZWQgd2l0aGluIGEgZm9ybSBjb250cm9sIGNvbnRhaW5lciBlbGVtZW50IGxpa2UgY2xyLWlucHV0LWNvbnRhaW5lcicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gc3RhdGUgQ09OVFJPTF9TVEFURVxuICAgKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGhhbmRsZVN0YXRlKHN0YXRlOiBDT05UUk9MX1NUQVRFKSB7XG4gICAgY29uc3QgaXNWYWxpZCA9IENPTlRST0xfU1RBVEUuVkFMSUQgPT09IHN0YXRlO1xuXG4gICAgaWYgKGlzVmFsaWQgJiYgIXRoaXMuZGlzcGxheWVkQ29udGVudCkge1xuICAgICAgdGhpcy5jb250YWluZXIuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGUpO1xuICAgIH0gZWxzZSBpZiAoIWlzVmFsaWQgJiYgdGhpcy5jb250YWluZXIpIHtcbiAgICAgIHRoaXMuY29udGFpbmVyLmNsZWFyKCk7XG4gICAgfVxuICAgIHRoaXMuZGlzcGxheWVkQ29udGVudCA9IGlzVmFsaWQ7XG4gIH1cbn1cbiJdfQ==
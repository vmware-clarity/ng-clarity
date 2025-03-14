/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Input, Optional } from '@angular/core';
import { AbstractIfState } from './abstract-if-state';
import { CONTROL_STATE } from './if-control-state.service';
import * as i0 from "@angular/core";
import * as i1 from "./if-control-state.service";
import * as i2 from "../providers/ng-control.service";
export class ClrIfError extends AbstractIfState {
    constructor(ifControlStateService, ngControlService, template, container) {
        super(ifControlStateService, ngControlService);
        this.template = template;
        this.container = container;
        if (!this.ifControlStateService) {
            throw new Error('clrIfError can only be used within a form control container element like clr-input-container');
        }
    }
    /**
     * @param state CONTROL_STATE
     */
    handleState(state) {
        if (this.error && this.control && this.control.invalid) {
            this.displayError(this.control.hasError(this.error));
        }
        else if (this.error && !!this.additionalControls?.length) {
            const invalidControl = this.additionalControls?.filter(control => control.hasError(this.error))[0];
            this.displayError(!!invalidControl, invalidControl);
        }
        else {
            this.displayError(CONTROL_STATE.INVALID === state);
        }
    }
    displayError(invalid, control = this.control) {
        /* if no container do nothing */
        if (!this.container) {
            return;
        }
        if (invalid) {
            if (this.displayedContent === false) {
                this.embeddedViewRef = this.container.createEmbeddedView(this.template, {
                    error: control.getError(this.error),
                });
                this.displayedContent = true;
            }
            else if (this.embeddedViewRef && this.embeddedViewRef.context) {
                // if view is already rendered, update the error object to keep it in sync
                this.embeddedViewRef.context.error = control.getError(this.error);
            }
        }
        else {
            this.container.clear();
            this.displayedContent = false;
        }
    }
}
ClrIfError.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrIfError, deps: [{ token: i1.IfControlStateService, optional: true }, { token: i2.NgControlService, optional: true }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrIfError.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrIfError, selector: "[clrIfError]", inputs: { error: ["clrIfError", "error"] }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrIfError, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrIfError]',
                }]
        }], ctorParameters: function () { return [{ type: i1.IfControlStateService, decorators: [{
                    type: Optional
                }] }, { type: i2.NgControlService, decorators: [{
                    type: Optional
                }] }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }]; }, propDecorators: { error: [{
                type: Input,
                args: ['clrIfError']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWYtZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9jb21tb24vaWYtY29udHJvbC1zdGF0ZS9pZi1lcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQW1CLEtBQUssRUFBRSxRQUFRLEVBQWlDLE1BQU0sZUFBZSxDQUFDO0FBRzNHLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsYUFBYSxFQUF5QixNQUFNLDRCQUE0QixDQUFDOzs7O0FBS2xGLE1BQU0sT0FBTyxVQUFXLFNBQVEsZUFBZTtJQUs3QyxZQUNjLHFCQUE0QyxFQUM1QyxnQkFBa0MsRUFDdEMsUUFBMEIsRUFDMUIsU0FBMkI7UUFFbkMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFIdkMsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFDMUIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFJbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtZQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLDhGQUE4RixDQUFDLENBQUM7U0FDakg7SUFDSCxDQUFDO0lBQ0Q7O09BRUc7SUFDZ0IsV0FBVyxDQUFDLEtBQW9CO1FBQ2pELElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQ3RELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDdEQ7YUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLEVBQUU7WUFDMUQsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1NBQ3JEO2FBQU07WUFDTCxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUM7U0FDcEQ7SUFDSCxDQUFDO0lBRU8sWUFBWSxDQUFDLE9BQWdCLEVBQUUsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPO1FBQzNELGdDQUFnQztRQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixPQUFPO1NBQ1I7UUFDRCxJQUFJLE9BQU8sRUFBRTtZQUNYLElBQUksSUFBSSxDQUFDLGdCQUFnQixLQUFLLEtBQUssRUFBRTtnQkFDbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7b0JBQ3RFLEtBQUssRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7aUJBQ3BDLENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO2FBQzlCO2lCQUFNLElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRTtnQkFDL0QsMEVBQTBFO2dCQUMxRSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDbkU7U0FDRjthQUFNO1lBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1NBQy9CO0lBQ0gsQ0FBQzs7dUdBbERVLFVBQVU7MkZBQVYsVUFBVTsyRkFBVixVQUFVO2tCQUh0QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxjQUFjO2lCQUN6Qjs7MEJBT0ksUUFBUTs7MEJBQ1IsUUFBUTtxR0FOVSxLQUFLO3NCQUF6QixLQUFLO3VCQUFDLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgRW1iZWRkZWRWaWV3UmVmLCBJbnB1dCwgT3B0aW9uYWwsIFRlbXBsYXRlUmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE5nQ29udHJvbFNlcnZpY2UgfSBmcm9tICcuLi9wcm92aWRlcnMvbmctY29udHJvbC5zZXJ2aWNlJztcbmltcG9ydCB7IEFic3RyYWN0SWZTdGF0ZSB9IGZyb20gJy4vYWJzdHJhY3QtaWYtc3RhdGUnO1xuaW1wb3J0IHsgQ09OVFJPTF9TVEFURSwgSWZDb250cm9sU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi9pZi1jb250cm9sLXN0YXRlLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xySWZFcnJvcl0nLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJJZkVycm9yIGV4dGVuZHMgQWJzdHJhY3RJZlN0YXRlIHtcbiAgQElucHV0KCdjbHJJZkVycm9yJykgZXJyb3I6IHN0cmluZztcblxuICBwcml2YXRlIGVtYmVkZGVkVmlld1JlZjogRW1iZWRkZWRWaWV3UmVmPGFueT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgaWZDb250cm9sU3RhdGVTZXJ2aWNlOiBJZkNvbnRyb2xTdGF0ZVNlcnZpY2UsXG4gICAgQE9wdGlvbmFsKCkgbmdDb250cm9sU2VydmljZTogTmdDb250cm9sU2VydmljZSxcbiAgICBwcml2YXRlIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+LFxuICAgIHByaXZhdGUgY29udGFpbmVyOiBWaWV3Q29udGFpbmVyUmVmXG4gICkge1xuICAgIHN1cGVyKGlmQ29udHJvbFN0YXRlU2VydmljZSwgbmdDb250cm9sU2VydmljZSk7XG5cbiAgICBpZiAoIXRoaXMuaWZDb250cm9sU3RhdGVTZXJ2aWNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NscklmRXJyb3IgY2FuIG9ubHkgYmUgdXNlZCB3aXRoaW4gYSBmb3JtIGNvbnRyb2wgY29udGFpbmVyIGVsZW1lbnQgbGlrZSBjbHItaW5wdXQtY29udGFpbmVyJyk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0gc3RhdGUgQ09OVFJPTF9TVEFURVxuICAgKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGhhbmRsZVN0YXRlKHN0YXRlOiBDT05UUk9MX1NUQVRFKSB7XG4gICAgaWYgKHRoaXMuZXJyb3IgJiYgdGhpcy5jb250cm9sICYmIHRoaXMuY29udHJvbC5pbnZhbGlkKSB7XG4gICAgICB0aGlzLmRpc3BsYXlFcnJvcih0aGlzLmNvbnRyb2wuaGFzRXJyb3IodGhpcy5lcnJvcikpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5lcnJvciAmJiAhIXRoaXMuYWRkaXRpb25hbENvbnRyb2xzPy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGludmFsaWRDb250cm9sID0gdGhpcy5hZGRpdGlvbmFsQ29udHJvbHM/LmZpbHRlcihjb250cm9sID0+IGNvbnRyb2wuaGFzRXJyb3IodGhpcy5lcnJvcikpWzBdO1xuICAgICAgdGhpcy5kaXNwbGF5RXJyb3IoISFpbnZhbGlkQ29udHJvbCwgaW52YWxpZENvbnRyb2wpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRpc3BsYXlFcnJvcihDT05UUk9MX1NUQVRFLklOVkFMSUQgPT09IHN0YXRlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRpc3BsYXlFcnJvcihpbnZhbGlkOiBib29sZWFuLCBjb250cm9sID0gdGhpcy5jb250cm9sKSB7XG4gICAgLyogaWYgbm8gY29udGFpbmVyIGRvIG5vdGhpbmcgKi9cbiAgICBpZiAoIXRoaXMuY29udGFpbmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpbnZhbGlkKSB7XG4gICAgICBpZiAodGhpcy5kaXNwbGF5ZWRDb250ZW50ID09PSBmYWxzZSkge1xuICAgICAgICB0aGlzLmVtYmVkZGVkVmlld1JlZiA9IHRoaXMuY29udGFpbmVyLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlLCB7XG4gICAgICAgICAgZXJyb3I6IGNvbnRyb2wuZ2V0RXJyb3IodGhpcy5lcnJvciksXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpc3BsYXllZENvbnRlbnQgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmVtYmVkZGVkVmlld1JlZiAmJiB0aGlzLmVtYmVkZGVkVmlld1JlZi5jb250ZXh0KSB7XG4gICAgICAgIC8vIGlmIHZpZXcgaXMgYWxyZWFkeSByZW5kZXJlZCwgdXBkYXRlIHRoZSBlcnJvciBvYmplY3QgdG8ga2VlcCBpdCBpbiBzeW5jXG4gICAgICAgIHRoaXMuZW1iZWRkZWRWaWV3UmVmLmNvbnRleHQuZXJyb3IgPSBjb250cm9sLmdldEVycm9yKHRoaXMuZXJyb3IpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbnRhaW5lci5jbGVhcigpO1xuICAgICAgdGhpcy5kaXNwbGF5ZWRDb250ZW50ID0gZmFsc2U7XG4gICAgfVxuICB9XG59XG4iXX0=
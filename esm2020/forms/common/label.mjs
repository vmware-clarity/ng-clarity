/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ContentChild, Directive, ElementRef, HostBinding, HostListener, Input, Optional, } from '@angular/core';
import { ClrSignpost } from '../../popover';
import * as i0 from "@angular/core";
import * as i1 from "./providers/control-id.service";
import * as i2 from "./providers/layout.service";
import * as i3 from "./providers/ng-control.service";
export class ClrLabel {
    constructor(controlIdService, layoutService, ngControlService, renderer, el) {
        this.controlIdService = controlIdService;
        this.layoutService = layoutService;
        this.ngControlService = ngControlService;
        this.renderer = renderer;
        this.el = el;
        this.enableGrid = true;
        this.subscriptions = [];
    }
    get labelText() {
        return this.el.nativeElement && this.el.nativeElement.textContent;
    }
    ngOnInit() {
        // Prevent id attributes from being removed by the `undefined` host binding.
        // This happens when a `label` is used outside of a control container and other use cases.
        this.idAttr = this.idInput;
        // Only add the clr-control-label if it is inside a control container
        if (this.controlIdService || this.ngControlService) {
            this.renderer.addClass(this.el.nativeElement, 'clr-control-label');
        }
        // Only set the grid column classes if we are in the right context and if they aren't already set
        if (this.enableGrid &&
            this.layoutService &&
            !this.layoutService.isVertical() &&
            this.el.nativeElement &&
            this.el.nativeElement.className.indexOf('clr-col') < 0) {
            this.renderer.addClass(this.el.nativeElement, 'clr-col-12');
            this.renderer.addClass(this.el.nativeElement, `clr-col-md-${this.layoutService.labelSize}`);
        }
        if (this.controlIdService && !this.forAttr) {
            this.subscriptions.push(this.controlIdService.idChange.subscribe(id => {
                this.forAttr = id;
                this.idAttr = this.idInput || `${id}-label`;
            }));
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    disableGrid() {
        this.enableGrid = false;
    }
    /**
     * Allowing signposts inside labels to work without disabling default behavior. <label> is spreading a click event to its children so signposts get
     * automatically closed once clicked inside a <label>.
     * @param event
     */
    onClick(event) {
        this.preventDefaultOnSignpostTarget(event);
    }
    preventDefaultOnSignpostTarget(event) {
        if (this.signpost && this.signpost.nativeElement && this.signpost.nativeElement.contains(event.target)) {
            event.preventDefault();
        }
    }
}
ClrLabel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrLabel, deps: [{ token: i1.ControlIdService, optional: true }, { token: i2.LayoutService, optional: true }, { token: i3.NgControlService, optional: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrLabel.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrLabel, selector: "label", inputs: { idInput: ["id", "idInput"], forAttr: ["for", "forAttr"] }, host: { listeners: { "click": "onClick($event)" }, properties: { "attr.id": "this.idAttr", "attr.for": "this.forAttr" } }, queries: [{ propertyName: "signpost", first: true, predicate: ClrSignpost, descendants: true, read: ElementRef }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrLabel, decorators: [{
            type: Directive,
            args: [{
                    selector: 'label',
                }]
        }], ctorParameters: function () { return [{ type: i1.ControlIdService, decorators: [{
                    type: Optional
                }] }, { type: i2.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i3.NgControlService, decorators: [{
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }]; }, propDecorators: { idInput: [{
                type: Input,
                args: ['id']
            }], idAttr: [{
                type: HostBinding,
                args: ['attr.id']
            }], forAttr: [{
                type: Input,
                args: ['for']
            }, {
                type: HostBinding,
                args: ['attr.for']
            }], signpost: [{
                type: ContentChild,
                args: [ClrSignpost, { read: ElementRef }]
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFiZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9jb21tb24vbGFiZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQ0wsWUFBWSxFQUNaLFNBQVMsRUFDVCxVQUFVLEVBQ1YsV0FBVyxFQUNYLFlBQVksRUFDWixLQUFLLEVBR0wsUUFBUSxHQUVULE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7O0FBUTVDLE1BQU0sT0FBTyxRQUFRO0lBVW5CLFlBQ3NCLGdCQUFrQyxFQUNsQyxhQUE0QixFQUM1QixnQkFBa0MsRUFDOUMsUUFBbUIsRUFDbkIsRUFBZ0M7UUFKcEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQzlDLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsT0FBRSxHQUFGLEVBQUUsQ0FBOEI7UUFSbEMsZUFBVSxHQUFHLElBQUksQ0FBQztRQUNsQixrQkFBYSxHQUFtQixFQUFFLENBQUM7SUFReEMsQ0FBQztJQUVKLElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxRQUFRO1FBQ04sNEVBQTRFO1FBQzVFLDBGQUEwRjtRQUMxRixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFFM0IscUVBQXFFO1FBQ3JFLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUNsRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1NBQ3BFO1FBQ0QsaUdBQWlHO1FBQ2pHLElBQ0UsSUFBSSxDQUFDLFVBQVU7WUFDZixJQUFJLENBQUMsYUFBYTtZQUNsQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYTtZQUNyQixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFDdEQ7WUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxjQUFjLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztTQUM3RjtRQUNELElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUMxQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDckIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQzVDLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksR0FBRyxFQUFFLFFBQVEsQ0FBQztZQUM5QyxDQUFDLENBQUMsQ0FDSCxDQUFDO1NBQ0g7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztJQUMxQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUVLLE9BQU8sQ0FBQyxLQUFLO1FBQ25CLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRU8sOEJBQThCLENBQUMsS0FBSztRQUMxQyxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN0RyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDeEI7SUFDSCxDQUFDOztxR0ExRVUsUUFBUTt5RkFBUixRQUFRLG1SQU1MLFdBQVcsMkJBQVUsVUFBVTsyRkFObEMsUUFBUTtrQkFIcEIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsT0FBTztpQkFDbEI7OzBCQVlJLFFBQVE7OzBCQUNSLFFBQVE7OzBCQUNSLFFBQVE7NkZBWkUsT0FBTztzQkFBbkIsS0FBSzt1QkFBQyxJQUFJO2dCQUNhLE1BQU07c0JBQTdCLFdBQVc7dUJBQUMsU0FBUztnQkFFaUIsT0FBTztzQkFBN0MsS0FBSzt1QkFBQyxLQUFLOztzQkFBRyxXQUFXO3VCQUFDLFVBQVU7Z0JBRW9CLFFBQVE7c0JBQWhFLFlBQVk7dUJBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtnQkE0RHZDLE9BQU87c0JBRGQsWUFBWTt1QkFBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7XG4gIENvbnRlbnRDaGlsZCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZyxcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBSZW5kZXJlcjIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENsclNpZ25wb3N0IH0gZnJvbSAnLi4vLi4vcG9wb3Zlcic7XG5pbXBvcnQgeyBDb250cm9sSWRTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvY29udHJvbC1pZC5zZXJ2aWNlJztcbmltcG9ydCB7IExheW91dFNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9sYXlvdXQuc2VydmljZSc7XG5pbXBvcnQgeyBOZ0NvbnRyb2xTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvbmctY29udHJvbC5zZXJ2aWNlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbGFiZWwnLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJMYWJlbCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KCdpZCcpIGlkSW5wdXQ6IHN0cmluZztcbiAgQEhvc3RCaW5kaW5nKCdhdHRyLmlkJykgaWRBdHRyOiBzdHJpbmc7XG5cbiAgQElucHV0KCdmb3InKSBASG9zdEJpbmRpbmcoJ2F0dHIuZm9yJykgZm9yQXR0cjogc3RyaW5nO1xuXG4gIEBDb250ZW50Q2hpbGQoQ2xyU2lnbnBvc3QsIHsgcmVhZDogRWxlbWVudFJlZiB9KSBwcml2YXRlIHNpZ25wb3N0OiBFbGVtZW50UmVmO1xuICBwcml2YXRlIGVuYWJsZUdyaWQgPSB0cnVlO1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBjb250cm9sSWRTZXJ2aWNlOiBDb250cm9sSWRTZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgbGF5b3V0U2VydmljZTogTGF5b3V0U2VydmljZSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIG5nQ29udHJvbFNlcnZpY2U6IE5nQ29udHJvbFNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWY8SFRNTExhYmVsRWxlbWVudD5cbiAgKSB7fVxuXG4gIGdldCBsYWJlbFRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5lbC5uYXRpdmVFbGVtZW50ICYmIHRoaXMuZWwubmF0aXZlRWxlbWVudC50ZXh0Q29udGVudDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIFByZXZlbnQgaWQgYXR0cmlidXRlcyBmcm9tIGJlaW5nIHJlbW92ZWQgYnkgdGhlIGB1bmRlZmluZWRgIGhvc3QgYmluZGluZy5cbiAgICAvLyBUaGlzIGhhcHBlbnMgd2hlbiBhIGBsYWJlbGAgaXMgdXNlZCBvdXRzaWRlIG9mIGEgY29udHJvbCBjb250YWluZXIgYW5kIG90aGVyIHVzZSBjYXNlcy5cbiAgICB0aGlzLmlkQXR0ciA9IHRoaXMuaWRJbnB1dDtcblxuICAgIC8vIE9ubHkgYWRkIHRoZSBjbHItY29udHJvbC1sYWJlbCBpZiBpdCBpcyBpbnNpZGUgYSBjb250cm9sIGNvbnRhaW5lclxuICAgIGlmICh0aGlzLmNvbnRyb2xJZFNlcnZpY2UgfHwgdGhpcy5uZ0NvbnRyb2xTZXJ2aWNlKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2Nsci1jb250cm9sLWxhYmVsJyk7XG4gICAgfVxuICAgIC8vIE9ubHkgc2V0IHRoZSBncmlkIGNvbHVtbiBjbGFzc2VzIGlmIHdlIGFyZSBpbiB0aGUgcmlnaHQgY29udGV4dCBhbmQgaWYgdGhleSBhcmVuJ3QgYWxyZWFkeSBzZXRcbiAgICBpZiAoXG4gICAgICB0aGlzLmVuYWJsZUdyaWQgJiZcbiAgICAgIHRoaXMubGF5b3V0U2VydmljZSAmJlxuICAgICAgIXRoaXMubGF5b3V0U2VydmljZS5pc1ZlcnRpY2FsKCkgJiZcbiAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudCAmJlxuICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNsYXNzTmFtZS5pbmRleE9mKCdjbHItY29sJykgPCAwXG4gICAgKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2Nsci1jb2wtMTInKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBgY2xyLWNvbC1tZC0ke3RoaXMubGF5b3V0U2VydmljZS5sYWJlbFNpemV9YCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbnRyb2xJZFNlcnZpY2UgJiYgIXRoaXMuZm9yQXR0cikge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgIHRoaXMuY29udHJvbElkU2VydmljZS5pZENoYW5nZS5zdWJzY3JpYmUoaWQgPT4ge1xuICAgICAgICAgIHRoaXMuZm9yQXR0ciA9IGlkO1xuICAgICAgICAgIHRoaXMuaWRBdHRyID0gdGhpcy5pZElucHV0IHx8IGAke2lkfS1sYWJlbGA7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICBkaXNhYmxlR3JpZCgpIHtcbiAgICB0aGlzLmVuYWJsZUdyaWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd2luZyBzaWducG9zdHMgaW5zaWRlIGxhYmVscyB0byB3b3JrIHdpdGhvdXQgZGlzYWJsaW5nIGRlZmF1bHQgYmVoYXZpb3IuIDxsYWJlbD4gaXMgc3ByZWFkaW5nIGEgY2xpY2sgZXZlbnQgdG8gaXRzIGNoaWxkcmVuIHNvIHNpZ25wb3N0cyBnZXRcbiAgICogYXV0b21hdGljYWxseSBjbG9zZWQgb25jZSBjbGlja2VkIGluc2lkZSBhIDxsYWJlbD4uXG4gICAqIEBwYXJhbSBldmVudFxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snLCBbJyRldmVudCddKVxuICBwcml2YXRlIG9uQ2xpY2soZXZlbnQpIHtcbiAgICB0aGlzLnByZXZlbnREZWZhdWx0T25TaWducG9zdFRhcmdldChldmVudCk7XG4gIH1cblxuICBwcml2YXRlIHByZXZlbnREZWZhdWx0T25TaWducG9zdFRhcmdldChldmVudCkge1xuICAgIGlmICh0aGlzLnNpZ25wb3N0ICYmIHRoaXMuc2lnbnBvc3QubmF0aXZlRWxlbWVudCAmJiB0aGlzLnNpZ25wb3N0Lm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
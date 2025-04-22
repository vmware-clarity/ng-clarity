/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { filter } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./providers/popover-events.service";
import * as i2 from "./providers/popover-toggle.service";
export class ClrPopoverCloseButton {
    constructor(elementRef, smartEventsService, smartOpenService) {
        this.elementRef = elementRef;
        this.smartEventsService = smartEventsService;
        this.smartOpenService = smartOpenService;
        this.closeChange = new EventEmitter();
        this.subscriptions = [];
        this.subscriptions.push(smartOpenService.openChange.pipe(filter(value => !value)).subscribe(() => {
            this.closeChange.next();
        }));
    }
    handleClick(event) {
        this.smartOpenService.toggleWithEvent(event);
        this.smartEventsService.setAnchorFocus();
    }
    ngAfterViewInit() {
        this.smartEventsService.closeButtonRef = this.elementRef;
        this.smartEventsService.setCloseFocus();
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
ClrPopoverCloseButton.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverCloseButton, deps: [{ token: i0.ElementRef }, { token: i1.ClrPopoverEventsService }, { token: i2.ClrPopoverToggleService }], target: i0.ɵɵFactoryTarget.Directive });
ClrPopoverCloseButton.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrPopoverCloseButton, selector: "[clrPopoverCloseButton]", outputs: { closeChange: "clrPopoverOnCloseChange" }, host: { listeners: { "click": "handleClick($event)" }, properties: { "class.clr-smart-close-button": "true" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverCloseButton, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPopoverCloseButton]',
                    host: {
                        '[class.clr-smart-close-button]': 'true',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.ClrPopoverEventsService }, { type: i2.ClrPopoverToggleService }]; }, propDecorators: { closeChange: [{
                type: Output,
                args: ['clrPopoverOnCloseChange']
            }], handleClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1jbG9zZS1idXR0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy91dGlscy9wb3BvdmVyL3BvcG92ZXItY2xvc2UtYnV0dG9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFpQixTQUFTLEVBQWMsWUFBWSxFQUFFLFlBQVksRUFBYSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFcEgsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7O0FBV3hDLE1BQU0sT0FBTyxxQkFBcUI7SUFLaEMsWUFDVSxVQUF5QyxFQUN6QyxrQkFBMkMsRUFDM0MsZ0JBQXlDO1FBRnpDLGVBQVUsR0FBVixVQUFVLENBQStCO1FBQ3pDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBeUI7UUFDM0MscUJBQWdCLEdBQWhCLGdCQUFnQixDQUF5QjtRQVBoQixnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFRLENBQUM7UUFFbEUsa0JBQWEsR0FBbUIsRUFBRSxDQUFDO1FBT3pDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNyQixnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ3ZFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFHRCxXQUFXLENBQUMsS0FBaUI7UUFDM0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsa0JBQWtCLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDekQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFDRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUN2RCxDQUFDOztrSEE3QlUscUJBQXFCO3NHQUFyQixxQkFBcUI7MkZBQXJCLHFCQUFxQjtrQkFOakMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUseUJBQXlCO29CQUNuQyxJQUFJLEVBQUU7d0JBQ0osZ0NBQWdDLEVBQUUsTUFBTTtxQkFDekM7aUJBQ0Y7NktBRW9DLFdBQVc7c0JBQTdDLE1BQU07dUJBQUMseUJBQXlCO2dCQWlCakMsV0FBVztzQkFEVixZQUFZO3VCQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciwgT25EZXN0cm95LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBDbHJQb3BvdmVyRXZlbnRzU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3BvcG92ZXItZXZlbnRzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9wb3BvdmVyLXRvZ2dsZS5zZXJ2aWNlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsclBvcG92ZXJDbG9zZUJ1dHRvbl0nLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5jbHItc21hcnQtY2xvc2UtYnV0dG9uXSc6ICd0cnVlJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyUG9wb3ZlckNsb3NlQnV0dG9uIGltcGxlbWVudHMgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcbiAgQE91dHB1dCgnY2xyUG9wb3Zlck9uQ2xvc2VDaGFuZ2UnKSBjbG9zZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxCdXR0b25FbGVtZW50PixcbiAgICBwcml2YXRlIHNtYXJ0RXZlbnRzU2VydmljZTogQ2xyUG9wb3ZlckV2ZW50c1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBzbWFydE9wZW5TZXJ2aWNlOiBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZVxuICApIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHNtYXJ0T3BlblNlcnZpY2Uub3BlbkNoYW5nZS5waXBlKGZpbHRlcih2YWx1ZSA9PiAhdmFsdWUpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLmNsb3NlQ2hhbmdlLm5leHQoKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLnNtYXJ0T3BlblNlcnZpY2UudG9nZ2xlV2l0aEV2ZW50KGV2ZW50KTtcbiAgICB0aGlzLnNtYXJ0RXZlbnRzU2VydmljZS5zZXRBbmNob3JGb2N1cygpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuc21hcnRFdmVudHNTZXJ2aWNlLmNsb3NlQnV0dG9uUmVmID0gdGhpcy5lbGVtZW50UmVmO1xuICAgIHRoaXMuc21hcnRFdmVudHNTZXJ2aWNlLnNldENsb3NlRm9jdXMoKTtcbiAgfVxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG59XG4iXX0=
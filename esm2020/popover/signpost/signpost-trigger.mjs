/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Directive, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/popover/providers/popover-toggle.service";
import * as i2 from "./providers/signpost-id.service";
import * as i3 from "./providers/signpost-focus-manager.service";
/*********
 *
 * @description
 * A Directive added to the ClrSignpost Trigger button that will call the ClrSignpost.toggle() function to hide/show the
 * ClrSignpostContent.
 *
 */
export class ClrSignpostTrigger {
    constructor(toggleService, el, signpostIdService, signpostFocusManager, document, platformId) {
        this.toggleService = toggleService;
        this.el = el;
        this.signpostIdService = signpostIdService;
        this.signpostFocusManager = signpostFocusManager;
        this.platformId = platformId;
        this.ariaExpanded = false;
        this.subscriptions = [];
        this.document = document;
    }
    ngOnInit() {
        this.signpostFocusManager.triggerEl = this.el.nativeElement;
        this.subscriptions.push(this.toggleService.openChange.subscribe((isOpen) => {
            this.ariaExpanded = isOpen;
            const prevIsOpen = this.isOpen;
            this.isOpen = isOpen;
            // openChange fires false on initialization because signpost starts as closed by default
            // but we shouldn't focus on that initial false value
            // we should focus back only if it's closed after being opened
            if (!this.isOpen && prevIsOpen) {
                this.focusOnClose();
            }
        }), this.signpostIdService.id.subscribe(idChange => (this.ariaControl = idChange)));
    }
    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
    /**********
     *
     * @description
     * click handler for the ClrSignpost trigger button used to hide/show ClrSignpostContent.
     */
    onSignpostTriggerClick(event) {
        this.toggleService.toggleWithEvent(event);
    }
    focusOnClose() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        // we have to set the focus back on the trigger only if the focus is reset back to the body element
        // if the focus is on another element, we are not allowed to move that focus back to this trigger again.
        if (!this.isOpen && this.document.activeElement === this.document.body) {
            this.signpostFocusManager.focusTrigger();
        }
    }
}
ClrSignpostTrigger.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSignpostTrigger, deps: [{ token: i1.ClrPopoverToggleService }, { token: i0.ElementRef }, { token: i2.SignpostIdService }, { token: i3.SignpostFocusManager }, { token: DOCUMENT }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Directive });
ClrSignpostTrigger.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrSignpostTrigger, selector: "[clrSignpostTrigger]", host: { listeners: { "click": "onSignpostTriggerClick($event)" }, properties: { "attr.aria-expanded": "ariaExpanded", "attr.aria-controls": "ariaControl", "class.active": "isOpen" }, classAttribute: "signpost-trigger" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSignpostTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrSignpostTrigger]',
                    host: {
                        class: 'signpost-trigger',
                        '[attr.aria-expanded]': 'ariaExpanded',
                        '[attr.aria-controls]': 'ariaControl',
                        '[class.active]': 'isOpen',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.ClrPopoverToggleService }, { type: i0.ElementRef }, { type: i2.SignpostIdService }, { type: i3.SignpostFocusManager }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; }, propDecorators: { onSignpostTriggerClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbnBvc3QtdHJpZ2dlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3BvcG92ZXIvc2lnbnBvc3Qvc2lnbnBvc3QtdHJpZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsU0FBUyxFQUFjLFlBQVksRUFBRSxNQUFNLEVBQWEsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7OztBQWlCcEc7Ozs7OztHQU1HO0FBQ0gsTUFBTSxPQUFPLGtCQUFrQjtJQVE3QixZQUNVLGFBQXNDLEVBQ3RDLEVBQTJCLEVBQzNCLGlCQUFvQyxFQUNwQyxvQkFBMEMsRUFDaEMsUUFBYSxFQUNGLFVBQWU7UUFMcEMsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBQ3RDLE9BQUUsR0FBRixFQUFFLENBQXlCO1FBQzNCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFDcEMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUVyQixlQUFVLEdBQVYsVUFBVSxDQUFLO1FBYjlDLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBS2Isa0JBQWEsR0FBbUIsRUFBRSxDQUFDO1FBVXpDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzNCLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQztRQUM1RCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDckIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBZSxFQUFFLEVBQUU7WUFDMUQsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUM7WUFFM0IsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUVyQix3RkFBd0Y7WUFDeEYscURBQXFEO1lBQ3JELDhEQUE4RDtZQUM5RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxVQUFVLEVBQUU7Z0JBQzlCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzthQUNyQjtRQUNILENBQUMsQ0FBQyxFQUNGLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQy9FLENBQUM7SUFDSixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBaUIsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVEOzs7O09BSUc7SUFFSCxzQkFBc0IsQ0FBQyxLQUFZO1FBQ2pDLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFTyxZQUFZO1FBQ2xCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDdkMsT0FBTztTQUNSO1FBQ0QsbUdBQW1HO1FBQ25HLHdHQUF3RztRQUN4RyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRTtZQUN0RSxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDMUM7SUFDSCxDQUFDOzsrR0E5RFUsa0JBQWtCLHdKQWFuQixRQUFRLGFBQ1IsV0FBVzttR0FkVixrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFqQjlCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtvQkFDaEMsSUFBSSxFQUFFO3dCQUNKLEtBQUssRUFBRSxrQkFBa0I7d0JBQ3pCLHNCQUFzQixFQUFFLGNBQWM7d0JBQ3RDLHNCQUFzQixFQUFFLGFBQWE7d0JBQ3JDLGdCQUFnQixFQUFFLFFBQVE7cUJBQzNCO2lCQUNGOzswQkFzQkksTUFBTTsyQkFBQyxRQUFROzswQkFDZixNQUFNOzJCQUFDLFdBQVc7NENBbUNyQixzQkFBc0I7c0JBRHJCLFlBQVk7dUJBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBET0NVTUVOVCwgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIEluamVjdCwgT25EZXN0cm95LCBQTEFURk9STV9JRCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wcm92aWRlcnMvcG9wb3Zlci10b2dnbGUuc2VydmljZSc7XG5pbXBvcnQgeyBTaWducG9zdEZvY3VzTWFuYWdlciB9IGZyb20gJy4vcHJvdmlkZXJzL3NpZ25wb3N0LWZvY3VzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTaWducG9zdElkU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3NpZ25wb3N0LWlkLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xyU2lnbnBvc3RUcmlnZ2VyXScsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ3NpZ25wb3N0LXRyaWdnZXInLFxuICAgICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdhcmlhRXhwYW5kZWQnLFxuICAgICdbYXR0ci5hcmlhLWNvbnRyb2xzXSc6ICdhcmlhQ29udHJvbCcsXG4gICAgJ1tjbGFzcy5hY3RpdmVdJzogJ2lzT3BlbicsXG4gIH0sXG59KVxuXG4vKioqKioqKioqXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBIERpcmVjdGl2ZSBhZGRlZCB0byB0aGUgQ2xyU2lnbnBvc3QgVHJpZ2dlciBidXR0b24gdGhhdCB3aWxsIGNhbGwgdGhlIENsclNpZ25wb3N0LnRvZ2dsZSgpIGZ1bmN0aW9uIHRvIGhpZGUvc2hvdyB0aGVcbiAqIENsclNpZ25wb3N0Q29udGVudC5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBDbHJTaWducG9zdFRyaWdnZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBhcmlhRXhwYW5kZWQgPSBmYWxzZTtcbiAgYXJpYUNvbnRyb2w6IHN0cmluZztcbiAgaXNPcGVuOiBib29sZWFuO1xuXG4gIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50O1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSB0b2dnbGVTZXJ2aWNlOiBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSxcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIHNpZ25wb3N0SWRTZXJ2aWNlOiBTaWducG9zdElkU2VydmljZSxcbiAgICBwcml2YXRlIHNpZ25wb3N0Rm9jdXNNYW5hZ2VyOiBTaWducG9zdEZvY3VzTWFuYWdlcixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogYW55XG4gICkge1xuICAgIHRoaXMuZG9jdW1lbnQgPSBkb2N1bWVudDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuc2lnbnBvc3RGb2N1c01hbmFnZXIudHJpZ2dlckVsID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW5DaGFuZ2Uuc3Vic2NyaWJlKChpc09wZW46IGJvb2xlYW4pID0+IHtcbiAgICAgICAgdGhpcy5hcmlhRXhwYW5kZWQgPSBpc09wZW47XG5cbiAgICAgICAgY29uc3QgcHJldklzT3BlbiA9IHRoaXMuaXNPcGVuO1xuICAgICAgICB0aGlzLmlzT3BlbiA9IGlzT3BlbjtcblxuICAgICAgICAvLyBvcGVuQ2hhbmdlIGZpcmVzIGZhbHNlIG9uIGluaXRpYWxpemF0aW9uIGJlY2F1c2Ugc2lnbnBvc3Qgc3RhcnRzIGFzIGNsb3NlZCBieSBkZWZhdWx0XG4gICAgICAgIC8vIGJ1dCB3ZSBzaG91bGRuJ3QgZm9jdXMgb24gdGhhdCBpbml0aWFsIGZhbHNlIHZhbHVlXG4gICAgICAgIC8vIHdlIHNob3VsZCBmb2N1cyBiYWNrIG9ubHkgaWYgaXQncyBjbG9zZWQgYWZ0ZXIgYmVpbmcgb3BlbmVkXG4gICAgICAgIGlmICghdGhpcy5pc09wZW4gJiYgcHJldklzT3Blbikge1xuICAgICAgICAgIHRoaXMuZm9jdXNPbkNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5zaWducG9zdElkU2VydmljZS5pZC5zdWJzY3JpYmUoaWRDaGFuZ2UgPT4gKHRoaXMuYXJpYUNvbnRyb2wgPSBpZENoYW5nZSkpXG4gICAgKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKChzdWI6IFN1YnNjcmlwdGlvbikgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgLyoqKioqKioqKipcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGNsaWNrIGhhbmRsZXIgZm9yIHRoZSBDbHJTaWducG9zdCB0cmlnZ2VyIGJ1dHRvbiB1c2VkIHRvIGhpZGUvc2hvdyBDbHJTaWducG9zdENvbnRlbnQuXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gIG9uU2lnbnBvc3RUcmlnZ2VyQ2xpY2soZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy50b2dnbGVTZXJ2aWNlLnRvZ2dsZVdpdGhFdmVudChldmVudCk7XG4gIH1cblxuICBwcml2YXRlIGZvY3VzT25DbG9zZSgpIHtcbiAgICBpZiAoIWlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gd2UgaGF2ZSB0byBzZXQgdGhlIGZvY3VzIGJhY2sgb24gdGhlIHRyaWdnZXIgb25seSBpZiB0aGUgZm9jdXMgaXMgcmVzZXQgYmFjayB0byB0aGUgYm9keSBlbGVtZW50XG4gICAgLy8gaWYgdGhlIGZvY3VzIGlzIG9uIGFub3RoZXIgZWxlbWVudCwgd2UgYXJlIG5vdCBhbGxvd2VkIHRvIG1vdmUgdGhhdCBmb2N1cyBiYWNrIHRvIHRoaXMgdHJpZ2dlciBhZ2Fpbi5cbiAgICBpZiAoIXRoaXMuaXNPcGVuICYmIHRoaXMuZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5kb2N1bWVudC5ib2R5KSB7XG4gICAgICB0aGlzLnNpZ25wb3N0Rm9jdXNNYW5hZ2VyLmZvY3VzVHJpZ2dlcigpO1xuICAgIH1cbiAgfVxufVxuIl19
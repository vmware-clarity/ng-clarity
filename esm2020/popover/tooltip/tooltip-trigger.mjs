/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, HostListener } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/popover/providers/popover-toggle.service";
import * as i2 from "./providers/tooltip-id.service";
import * as i3 from "./providers/tooltip-mouse.service";
export class ClrTooltipTrigger {
    constructor(toggleService, tooltipIdService, tooltipMouseService) {
        this.toggleService = toggleService;
        this.tooltipMouseService = tooltipMouseService;
        this.subs = [];
        // The aria-described by comes from the id of content. It
        this.subs.push(tooltipIdService.id.subscribe(tooltipId => (this.ariaDescribedBy = tooltipId)));
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    showTooltip() {
        this.toggleService.open = true;
    }
    hideTooltip() {
        this.toggleService.open = false;
    }
    onMouseEnter() {
        this.tooltipMouseService.onMouseEnterTrigger();
    }
    onMouseLeave() {
        this.tooltipMouseService.onMouseLeaveTrigger();
    }
}
ClrTooltipTrigger.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTooltipTrigger, deps: [{ token: i1.ClrPopoverToggleService }, { token: i2.TooltipIdService }, { token: i3.TooltipMouseService }], target: i0.ɵɵFactoryTarget.Directive });
ClrTooltipTrigger.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrTooltipTrigger, selector: "[clrTooltipTrigger]", host: { attributes: { "tabindex": "0" }, listeners: { "focus": "showTooltip()", "blur": "hideTooltip()", "mouseenter": "onMouseEnter()", "mouseleave": "onMouseLeave()" }, properties: { "class.tooltip-trigger": "true", "attr.aria-describedby": "ariaDescribedBy", "attr.role": "\"button\"" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTooltipTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrTooltipTrigger]',
                    host: {
                        tabindex: '0',
                        '[class.tooltip-trigger]': 'true',
                        '[attr.aria-describedby]': 'ariaDescribedBy',
                        '[attr.role]': '"button"',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.ClrPopoverToggleService }, { type: i2.TooltipIdService }, { type: i3.TooltipMouseService }]; }, propDecorators: { showTooltip: [{
                type: HostListener,
                args: ['focus']
            }], hideTooltip: [{
                type: HostListener,
                args: ['blur']
            }], onMouseEnter: [{
                type: HostListener,
                args: ['mouseenter']
            }], onMouseLeave: [{
                type: HostListener,
                args: ['mouseleave']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC10cmlnZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvcG9wb3Zlci90b29sdGlwL3Rvb2x0aXAtdHJpZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7OztBQWdCeEQsTUFBTSxPQUFPLGlCQUFpQjtJQUk1QixZQUNVLGFBQXNDLEVBQzlDLGdCQUFrQyxFQUMxQixtQkFBd0M7UUFGeEMsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBRXRDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFMMUMsU0FBSSxHQUFtQixFQUFFLENBQUM7UUFPaEMseURBQXlEO1FBQ3pELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pHLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBR0QsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNqQyxDQUFDO0lBR0QsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUNsQyxDQUFDO0lBR08sWUFBWTtRQUNsQixJQUFJLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUNqRCxDQUFDO0lBR08sWUFBWTtRQUNsQixJQUFJLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUNqRCxDQUFDOzs4R0FuQ1UsaUJBQWlCO2tHQUFqQixpQkFBaUI7MkZBQWpCLGlCQUFpQjtrQkFUN0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixJQUFJLEVBQUU7d0JBQ0osUUFBUSxFQUFFLEdBQUc7d0JBQ2IseUJBQXlCLEVBQUUsTUFBTTt3QkFDakMseUJBQXlCLEVBQUUsaUJBQWlCO3dCQUM1QyxhQUFhLEVBQUUsVUFBVTtxQkFDMUI7aUJBQ0Y7K0tBbUJDLFdBQVc7c0JBRFYsWUFBWTt1QkFBQyxPQUFPO2dCQU1yQixXQUFXO3NCQURWLFlBQVk7dUJBQUMsTUFBTTtnQkFNWixZQUFZO3NCQURuQixZQUFZO3VCQUFDLFlBQVk7Z0JBTWxCLFlBQVk7c0JBRG5CLFlBQVk7dUJBQUMsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aXZlLCBIb3N0TGlzdGVuZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvcHJvdmlkZXJzL3BvcG92ZXItdG9nZ2xlLnNlcnZpY2UnO1xuaW1wb3J0IHsgVG9vbHRpcElkU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3Rvb2x0aXAtaWQuc2VydmljZSc7XG5pbXBvcnQgeyBUb29sdGlwTW91c2VTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvdG9vbHRpcC1tb3VzZS5zZXJ2aWNlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsclRvb2x0aXBUcmlnZ2VyXScsXG4gIGhvc3Q6IHtcbiAgICB0YWJpbmRleDogJzAnLFxuICAgICdbY2xhc3MudG9vbHRpcC10cmlnZ2VyXSc6ICd0cnVlJyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnYXJpYURlc2NyaWJlZEJ5JyxcbiAgICAnW2F0dHIucm9sZV0nOiAnXCJidXR0b25cIicsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsclRvb2x0aXBUcmlnZ2VyIHtcbiAgYXJpYURlc2NyaWJlZEJ5OiBzdHJpbmc7XG4gIHByaXZhdGUgc3ViczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHRvZ2dsZVNlcnZpY2U6IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlLFxuICAgIHRvb2x0aXBJZFNlcnZpY2U6IFRvb2x0aXBJZFNlcnZpY2UsXG4gICAgcHJpdmF0ZSB0b29sdGlwTW91c2VTZXJ2aWNlOiBUb29sdGlwTW91c2VTZXJ2aWNlXG4gICkge1xuICAgIC8vIFRoZSBhcmlhLWRlc2NyaWJlZCBieSBjb21lcyBmcm9tIHRoZSBpZCBvZiBjb250ZW50LiBJdFxuICAgIHRoaXMuc3Vicy5wdXNoKHRvb2x0aXBJZFNlcnZpY2UuaWQuc3Vic2NyaWJlKHRvb2x0aXBJZCA9PiAodGhpcy5hcmlhRGVzY3JpYmVkQnkgPSB0b29sdGlwSWQpKSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZm9jdXMnKVxuICBzaG93VG9vbHRpcCgpOiB2b2lkIHtcbiAgICB0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbiA9IHRydWU7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdibHVyJylcbiAgaGlkZVRvb2x0aXAoKTogdm9pZCB7XG4gICAgdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4gPSBmYWxzZTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZW50ZXInKVxuICBwcml2YXRlIG9uTW91c2VFbnRlcigpIHtcbiAgICB0aGlzLnRvb2x0aXBNb3VzZVNlcnZpY2Uub25Nb3VzZUVudGVyVHJpZ2dlcigpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VsZWF2ZScpXG4gIHByaXZhdGUgb25Nb3VzZUxlYXZlKCkge1xuICAgIHRoaXMudG9vbHRpcE1vdXNlU2VydmljZS5vbk1vdXNlTGVhdmVUcmlnZ2VyKCk7XG4gIH1cbn1cbiJdfQ==
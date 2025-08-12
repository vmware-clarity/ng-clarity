/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { DOCUMENT } from '@angular/common';
import { Directive, EventEmitter, Inject, Input, } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./providers/popover-position.service";
import * as i2 from "./providers/popover-events.service";
import * as i3 from "./providers/popover-toggle.service";
// https://github.com/angular/angular/issues/20351#issuecomment-344009887
/** @dynamic */
export class ClrPopoverContent {
    constructor(document, container, template, renderer, smartPositionService, smartEventsService, smartOpenService) {
        this.document = document;
        this.container = container;
        this.template = template;
        this.renderer = renderer;
        this.smartPositionService = smartPositionService;
        this.smartEventsService = smartEventsService;
        this.smartOpenService = smartOpenService;
        this.subscriptions = [];
        this.removeClickListenerFn = null;
        this.shouldRealign = false;
        this.previousContentHeight = null;
        // Check-collector pattern:
        // In order to get accurate content height/width values, we cannot calculate alignment offsets until
        // after the projected content has stabilized.
        // As multiple check events may happen in the same rendering cycle, we need to collect all events
        // and only act after the content is really stable. Or we may get wrong intermediate positioning values.
        // We will channel subsequent content check events through this observable.
        this.checkCollector = new EventEmitter();
    }
    set open(value) {
        this.smartOpenService.open = !!value;
    }
    set contentAt(position) {
        this.smartPositionService.position = position;
    }
    set outsideClickClose(clickToClose) {
        this.smartEventsService.outsideClickClose = !!clickToClose;
    }
    set scrollToClose(scrollToClose) {
        this.smartEventsService.scrollToClose = !!scrollToClose;
    }
    ngAfterContentChecked() {
        if (this.smartOpenService.open && this.view) {
            const rootNodeOffsetHeight = this.view.rootNodes[0].offsetHeight;
            if (this.shouldRealign ||
                (this.previousContentHeight !== null && this.previousContentHeight !== rootNodeOffsetHeight)) {
                // Channel content-check event through the check-collector
                this.previousContentHeight = rootNodeOffsetHeight;
                this.checkCollector.emit();
            }
        }
    }
    ngAfterViewInit() {
        this.subscriptions.push(this.smartOpenService.openChange.subscribe(change => {
            if (change) {
                this.addContent();
            }
            else {
                this.removeContent();
            }
        }), this.smartPositionService.shouldRealign.subscribe(() => {
            this.shouldRealign = true;
        }), 
        // Here we collect subsequent synchronously received content-check events and only take action
        // at the end of the cycle. See below for details on the check-collector pattern.
        this.checkCollector.pipe(debounceTime(0)).subscribe(() => {
            this.alignContent();
            this.shouldRealign = false;
            if (this.view) {
                this.renderer.setStyle(this.view.rootNodes[0], 'opacity', '1');
                this.smartOpenService.popoverVisibleEmit(true);
            }
        }));
    }
    ngOnDestroy() {
        this.removeContent();
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    /**
     * TODO(matt): investigate why DebugElement retains a reference to the nodes and causes a memory leak.
     * A note about the use of appendChild/removeChild
     * The DebugElement is keeping a reference to the detached node and its unclear why.
     * This does warrant further investigation. But, since it doesn't happen in production mode
     * it is a low priority issue for now.
     */
    addContent() {
        // Create the view container
        this.view = this.container.createEmbeddedView(this.template);
        const [rootNode] = this.view.rootNodes;
        this.smartEventsService.contentRef = rootNode; // So we know where/what to set close focus on
        this.renderer.addClass(rootNode, 'clr-popover-content');
        // Reset to the begining of the document to be available for sizing/positioning calculations.
        // If we add new content to the bottom it triggers changes in the layout that may lead to false anchor
        // coordinates values.
        this.renderer.setStyle(rootNode, 'top', '0px');
        this.renderer.setStyle(rootNode, 'left', '0px');
        // We need to hide it during the calculation phase, while it's not yet finally positioned.
        this.renderer.setStyle(rootNode, 'opacity', '0');
        this.removeClickListenerFn = this.renderer.listen(rootNode, 'click', event => {
            this.smartOpenService.openEvent = event;
        });
        this.view.rootNodes.forEach(node => {
            this.renderer.appendChild(this.document.body, node);
        });
        // Mark for realingment on the next content-check cycle.
        this.shouldRealign = true;
    }
    removeContent() {
        if (!this.view) {
            return;
        }
        if (this.removeClickListenerFn) {
            this.removeClickListenerFn();
            this.removeClickListenerFn = null;
        }
        this.view.rootNodes.forEach(node => this.renderer.removeChild(this.document.body, node));
        this.container.clear();
        delete this.view;
        this.smartOpenService.popoverVisibleEmit(false);
    }
    alignContent() {
        if (!this.view) {
            return;
        }
        const positionCoords = this.smartPositionService.alignContent(this.view.rootNodes[0]);
        this.renderer.setStyle(this.view.rootNodes[0], 'top', `${positionCoords.yOffset}px`);
        this.renderer.setStyle(this.view.rootNodes[0], 'left', `${positionCoords.xOffset}px`);
        this.smartOpenService.popoverAlignedEmit(this.view.rootNodes[0]);
    }
}
ClrPopoverContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverContent, deps: [{ token: DOCUMENT }, { token: i0.ViewContainerRef }, { token: i0.TemplateRef }, { token: i0.Renderer2 }, { token: i1.ClrPopoverPositionService }, { token: i2.ClrPopoverEventsService }, { token: i3.ClrPopoverToggleService }], target: i0.ɵɵFactoryTarget.Directive });
ClrPopoverContent.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrPopoverContent, selector: "[clrPopoverContent]", inputs: { open: ["clrPopoverContent", "open"], contentAt: ["clrPopoverContentAt", "contentAt"], outsideClickClose: ["clrPopoverContentOutsideClickToClose", "outsideClickClose"], scrollToClose: ["clrPopoverContentScrollToClose", "scrollToClose"] }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverContent, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPopoverContent]',
                }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ViewContainerRef }, { type: i0.TemplateRef }, { type: i0.Renderer2 }, { type: i1.ClrPopoverPositionService }, { type: i2.ClrPopoverEventsService }, { type: i3.ClrPopoverToggleService }]; }, propDecorators: { open: [{
                type: Input,
                args: ['clrPopoverContent']
            }], contentAt: [{
                type: Input,
                args: ['clrPopoverContentAt']
            }], outsideClickClose: [{
                type: Input,
                args: ['clrPopoverContentOutsideClickToClose']
            }], scrollToClose: [{
                type: Input,
                args: ['clrPopoverContentScrollToClose']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1jb250ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvdXRpbHMvcG9wb3Zlci9wb3BvdmVyLWNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssR0FLTixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7O0FBTzlDLHlFQUF5RTtBQUN6RSxlQUFlO0FBSWYsTUFBTSxPQUFPLGlCQUFpQjtJQWdCNUIsWUFDNEIsUUFBa0IsRUFDcEMsU0FBMkIsRUFDM0IsUUFBMEIsRUFDMUIsUUFBbUIsRUFDbkIsb0JBQStDLEVBQy9DLGtCQUEyQyxFQUMzQyxnQkFBeUM7UUFOdkIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNwQyxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUMzQixhQUFRLEdBQVIsUUFBUSxDQUFrQjtRQUMxQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBMkI7UUFDL0MsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUF5QjtRQUMzQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXlCO1FBckIzQyxrQkFBYSxHQUFtQixFQUFFLENBQUM7UUFDbkMsMEJBQXFCLEdBQXdCLElBQUksQ0FBQztRQUVsRCxrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUN0QiwwQkFBcUIsR0FBa0IsSUFBSSxDQUFDO1FBRXBELDJCQUEyQjtRQUMzQixvR0FBb0c7UUFDcEcsOENBQThDO1FBQzlDLGlHQUFpRztRQUNqRyx3R0FBd0c7UUFDeEcsMkVBQTJFO1FBQ25FLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVB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R0FqQlAsaUJBQWlCOzJGQUFqQixpQkFBaUI7a0JBSDdCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtpQkFDaEM7OzBCQWtCSSxNQUFNOzJCQUFDLFFBQVE7aVBBVWQsSUFBSTtzQkFEUCxLQUFLO3VCQUFDLG1CQUFtQjtnQkFNdEIsU0FBUztzQkFEWixLQUFLO3VCQUFDLHFCQUFxQjtnQkFNeEIsaUJBQWlCO3NCQURwQixLQUFLO3VCQUFDLHNDQUFzQztnQkFNekMsYUFBYTtzQkFEaEIsS0FBSzt1QkFBQyxnQ0FBZ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIERpcmVjdGl2ZSxcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgUmVuZGVyZXIyLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQ2xyUG9wb3ZlclBvc2l0aW9uIH0gZnJvbSAnLi9pbnRlcmZhY2VzL3BvcG92ZXItcG9zaXRpb24uaW50ZXJmYWNlJztcbmltcG9ydCB7IENsclBvcG92ZXJFdmVudHNTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvcG9wb3Zlci1ldmVudHMuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJQb3BvdmVyUG9zaXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvcG9wb3Zlci1wb3NpdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvcG9wb3Zlci10b2dnbGUuc2VydmljZSc7XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzIwMzUxI2lzc3VlY29tbWVudC0zNDQwMDk4ODdcbi8qKiBAZHluYW1pYyAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsclBvcG92ZXJDb250ZW50XScsXG59KVxuZXhwb3J0IGNsYXNzIENsclBvcG92ZXJDb250ZW50IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSB2aWV3OiBFbWJlZGRlZFZpZXdSZWY8dm9pZD47XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcbiAgcHJpdmF0ZSByZW1vdmVDbGlja0xpc3RlbmVyRm46IFZvaWRGdW5jdGlvbiB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgc2hvdWxkUmVhbGlnbiA9IGZhbHNlO1xuICBwcml2YXRlIHByZXZpb3VzQ29udGVudEhlaWdodDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLy8gQ2hlY2stY29sbGVjdG9yIHBhdHRlcm46XG4gIC8vIEluIG9yZGVyIHRvIGdldCBhY2N1cmF0ZSBjb250ZW50IGhlaWdodC93aWR0aCB2YWx1ZXMsIHdlIGNhbm5vdCBjYWxjdWxhdGUgYWxpZ25tZW50IG9mZnNldHMgdW50aWxcbiAgLy8gYWZ0ZXIgdGhlIHByb2plY3RlZCBjb250ZW50IGhhcyBzdGFiaWxpemVkLlxuICAvLyBBcyBtdWx0aXBsZSBjaGVjayBldmVudHMgbWF5IGhhcHBlbiBpbiB0aGUgc2FtZSByZW5kZXJpbmcgY3ljbGUsIHdlIG5lZWQgdG8gY29sbGVjdCBhbGwgZXZlbnRzXG4gIC8vIGFuZCBvbmx5IGFjdCBhZnRlciB0aGUgY29udGVudCBpcyByZWFsbHkgc3RhYmxlLiBPciB3ZSBtYXkgZ2V0IHdyb25nIGludGVybWVkaWF0ZSBwb3NpdGlvbmluZyB2YWx1ZXMuXG4gIC8vIFdlIHdpbGwgY2hhbm5lbCBzdWJzZXF1ZW50IGNvbnRlbnQgY2hlY2sgZXZlbnRzIHRocm91Z2ggdGhpcyBvYnNlcnZhYmxlLlxuICBwcml2YXRlIGNoZWNrQ29sbGVjdG9yID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50LFxuICAgIHByaXZhdGUgY29udGFpbmVyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4sXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgc21hcnRQb3NpdGlvblNlcnZpY2U6IENsclBvcG92ZXJQb3NpdGlvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBzbWFydEV2ZW50c1NlcnZpY2U6IENsclBvcG92ZXJFdmVudHNTZXJ2aWNlLFxuICAgIHByaXZhdGUgc21hcnRPcGVuU2VydmljZTogQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2VcbiAgKSB7fVxuXG4gIEBJbnB1dCgnY2xyUG9wb3ZlckNvbnRlbnQnKVxuICBzZXQgb3Blbih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc21hcnRPcGVuU2VydmljZS5vcGVuID0gISF2YWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyUG9wb3ZlckNvbnRlbnRBdCcpXG4gIHNldCBjb250ZW50QXQocG9zaXRpb246IENsclBvcG92ZXJQb3NpdGlvbikge1xuICAgIHRoaXMuc21hcnRQb3NpdGlvblNlcnZpY2UucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyUG9wb3ZlckNvbnRlbnRPdXRzaWRlQ2xpY2tUb0Nsb3NlJylcbiAgc2V0IG91dHNpZGVDbGlja0Nsb3NlKGNsaWNrVG9DbG9zZTogYm9vbGVhbikge1xuICAgIHRoaXMuc21hcnRFdmVudHNTZXJ2aWNlLm91dHNpZGVDbGlja0Nsb3NlID0gISFjbGlja1RvQ2xvc2U7XG4gIH1cblxuICBASW5wdXQoJ2NsclBvcG92ZXJDb250ZW50U2Nyb2xsVG9DbG9zZScpXG4gIHNldCBzY3JvbGxUb0Nsb3NlKHNjcm9sbFRvQ2xvc2U6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNtYXJ0RXZlbnRzU2VydmljZS5zY3JvbGxUb0Nsb3NlID0gISFzY3JvbGxUb0Nsb3NlO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNtYXJ0T3BlblNlcnZpY2Uub3BlbiAmJiB0aGlzLnZpZXcpIHtcbiAgICAgIGNvbnN0IHJvb3ROb2RlT2Zmc2V0SGVpZ2h0ID0gdGhpcy52aWV3LnJvb3ROb2Rlc1swXS5vZmZzZXRIZWlnaHQ7XG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuc2hvdWxkUmVhbGlnbiB8fFxuICAgICAgICAodGhpcy5wcmV2aW91c0NvbnRlbnRIZWlnaHQgIT09IG51bGwgJiYgdGhpcy5wcmV2aW91c0NvbnRlbnRIZWlnaHQgIT09IHJvb3ROb2RlT2Zmc2V0SGVpZ2h0KVxuICAgICAgKSB7XG4gICAgICAgIC8vIENoYW5uZWwgY29udGVudC1jaGVjayBldmVudCB0aHJvdWdoIHRoZSBjaGVjay1jb2xsZWN0b3JcbiAgICAgICAgdGhpcy5wcmV2aW91c0NvbnRlbnRIZWlnaHQgPSByb290Tm9kZU9mZnNldEhlaWdodDtcbiAgICAgICAgdGhpcy5jaGVja0NvbGxlY3Rvci5lbWl0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgdGhpcy5zbWFydE9wZW5TZXJ2aWNlLm9wZW5DaGFuZ2Uuc3Vic2NyaWJlKGNoYW5nZSA9PiB7XG4gICAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgICB0aGlzLmFkZENvbnRlbnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUNvbnRlbnQoKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICB0aGlzLnNtYXJ0UG9zaXRpb25TZXJ2aWNlLnNob3VsZFJlYWxpZ24uc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5zaG91bGRSZWFsaWduID0gdHJ1ZTtcbiAgICAgIH0pLFxuICAgICAgLy8gSGVyZSB3ZSBjb2xsZWN0IHN1YnNlcXVlbnQgc3luY2hyb25vdXNseSByZWNlaXZlZCBjb250ZW50LWNoZWNrIGV2ZW50cyBhbmQgb25seSB0YWtlIGFjdGlvblxuICAgICAgLy8gYXQgdGhlIGVuZCBvZiB0aGUgY3ljbGUuIFNlZSBiZWxvdyBmb3IgZGV0YWlscyBvbiB0aGUgY2hlY2stY29sbGVjdG9yIHBhdHRlcm4uXG4gICAgICB0aGlzLmNoZWNrQ29sbGVjdG9yLnBpcGUoZGVib3VuY2VUaW1lKDApKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLmFsaWduQ29udGVudCgpO1xuICAgICAgICB0aGlzLnNob3VsZFJlYWxpZ24gPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMudmlldykge1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy52aWV3LnJvb3ROb2Rlc1swXSwgJ29wYWNpdHknLCAnMScpO1xuICAgICAgICAgIHRoaXMuc21hcnRPcGVuU2VydmljZS5wb3BvdmVyVmlzaWJsZUVtaXQodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMucmVtb3ZlQ29udGVudCgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICAvKipcbiAgICogVE9ETyhtYXR0KTogaW52ZXN0aWdhdGUgd2h5IERlYnVnRWxlbWVudCByZXRhaW5zIGEgcmVmZXJlbmNlIHRvIHRoZSBub2RlcyBhbmQgY2F1c2VzIGEgbWVtb3J5IGxlYWsuXG4gICAqIEEgbm90ZSBhYm91dCB0aGUgdXNlIG9mIGFwcGVuZENoaWxkL3JlbW92ZUNoaWxkXG4gICAqIFRoZSBEZWJ1Z0VsZW1lbnQgaXMga2VlcGluZyBhIHJlZmVyZW5jZSB0byB0aGUgZGV0YWNoZWQgbm9kZSBhbmQgaXRzIHVuY2xlYXIgd2h5LlxuICAgKiBUaGlzIGRvZXMgd2FycmFudCBmdXJ0aGVyIGludmVzdGlnYXRpb24uIEJ1dCwgc2luY2UgaXQgZG9lc24ndCBoYXBwZW4gaW4gcHJvZHVjdGlvbiBtb2RlXG4gICAqIGl0IGlzIGEgbG93IHByaW9yaXR5IGlzc3VlIGZvciBub3cuXG4gICAqL1xuICBwcml2YXRlIGFkZENvbnRlbnQoKSB7XG4gICAgLy8gQ3JlYXRlIHRoZSB2aWV3IGNvbnRhaW5lclxuICAgIHRoaXMudmlldyA9IHRoaXMuY29udGFpbmVyLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlKTtcbiAgICBjb25zdCBbcm9vdE5vZGVdID0gdGhpcy52aWV3LnJvb3ROb2RlcztcbiAgICB0aGlzLnNtYXJ0RXZlbnRzU2VydmljZS5jb250ZW50UmVmID0gcm9vdE5vZGU7IC8vIFNvIHdlIGtub3cgd2hlcmUvd2hhdCB0byBzZXQgY2xvc2UgZm9jdXMgb25cbiAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHJvb3ROb2RlLCAnY2xyLXBvcG92ZXItY29udGVudCcpO1xuICAgIC8vIFJlc2V0IHRvIHRoZSBiZWdpbmluZyBvZiB0aGUgZG9jdW1lbnQgdG8gYmUgYXZhaWxhYmxlIGZvciBzaXppbmcvcG9zaXRpb25pbmcgY2FsY3VsYXRpb25zLlxuICAgIC8vIElmIHdlIGFkZCBuZXcgY29udGVudCB0byB0aGUgYm90dG9tIGl0IHRyaWdnZXJzIGNoYW5nZXMgaW4gdGhlIGxheW91dCB0aGF0IG1heSBsZWFkIHRvIGZhbHNlIGFuY2hvclxuICAgIC8vIGNvb3JkaW5hdGVzIHZhbHVlcy5cbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHJvb3ROb2RlLCAndG9wJywgJzBweCcpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUocm9vdE5vZGUsICdsZWZ0JywgJzBweCcpO1xuICAgIC8vIFdlIG5lZWQgdG8gaGlkZSBpdCBkdXJpbmcgdGhlIGNhbGN1bGF0aW9uIHBoYXNlLCB3aGlsZSBpdCdzIG5vdCB5ZXQgZmluYWxseSBwb3NpdGlvbmVkLlxuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUocm9vdE5vZGUsICdvcGFjaXR5JywgJzAnKTtcbiAgICB0aGlzLnJlbW92ZUNsaWNrTGlzdGVuZXJGbiA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHJvb3ROb2RlLCAnY2xpY2snLCBldmVudCA9PiB7XG4gICAgICB0aGlzLnNtYXJ0T3BlblNlcnZpY2Uub3BlbkV2ZW50ID0gZXZlbnQ7XG4gICAgfSk7XG4gICAgdGhpcy52aWV3LnJvb3ROb2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLmRvY3VtZW50LmJvZHksIG5vZGUpO1xuICAgIH0pO1xuICAgIC8vIE1hcmsgZm9yIHJlYWxpbmdtZW50IG9uIHRoZSBuZXh0IGNvbnRlbnQtY2hlY2sgY3ljbGUuXG4gICAgdGhpcy5zaG91bGRSZWFsaWduID0gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlQ29udGVudCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMudmlldykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5yZW1vdmVDbGlja0xpc3RlbmVyRm4pIHtcbiAgICAgIHRoaXMucmVtb3ZlQ2xpY2tMaXN0ZW5lckZuKCk7XG4gICAgICB0aGlzLnJlbW92ZUNsaWNrTGlzdGVuZXJGbiA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMudmlldy5yb290Tm9kZXMuZm9yRWFjaChub2RlID0+IHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQodGhpcy5kb2N1bWVudC5ib2R5LCBub2RlKSk7XG4gICAgdGhpcy5jb250YWluZXIuY2xlYXIoKTtcbiAgICBkZWxldGUgdGhpcy52aWV3O1xuICAgIHRoaXMuc21hcnRPcGVuU2VydmljZS5wb3BvdmVyVmlzaWJsZUVtaXQoZmFsc2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBhbGlnbkNvbnRlbnQoKSB7XG4gICAgaWYgKCF0aGlzLnZpZXcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwb3NpdGlvbkNvb3JkcyA9IHRoaXMuc21hcnRQb3NpdGlvblNlcnZpY2UuYWxpZ25Db250ZW50KHRoaXMudmlldy5yb290Tm9kZXNbMF0pO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy52aWV3LnJvb3ROb2Rlc1swXSwgJ3RvcCcsIGAke3Bvc2l0aW9uQ29vcmRzLnlPZmZzZXR9cHhgKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMudmlldy5yb290Tm9kZXNbMF0sICdsZWZ0JywgYCR7cG9zaXRpb25Db29yZHMueE9mZnNldH1weGApO1xuICAgIHRoaXMuc21hcnRPcGVuU2VydmljZS5wb3BvdmVyQWxpZ25lZEVtaXQodGhpcy52aWV3LnJvb3ROb2Rlc1swXSk7XG4gIH1cbn1cbiJdfQ==
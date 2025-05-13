/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./popover-toggle.service";
// https://github.com/angular/angular/issues/20351#issuecomment-344009887
/** @dynamic */
export class ClrPopoverEventsService {
    constructor(renderer, smartOpenService, document) {
        this.renderer = renderer;
        this.smartOpenService = smartOpenService;
        this.document = document;
        this.outsideClickClose = true;
        this.scrollToClose = true;
        this.subscriptions = [];
        this.subscriptions.push(smartOpenService.openChange.subscribe(open => {
            if (open) {
                this.addEscapeListener();
                this.addClickListener();
                this.addScrollListener();
            }
            else {
                this.removeAllEventListeners();
            }
        }), smartOpenService.getEventChange().subscribe(event => {
            // Remember the event that was used to open the content
            this.ignoredEvent = event;
        }));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.removeAllEventListeners();
    }
    addScrollListener() {
        if (this.scrollToClose) {
            this.documentScroller = fromEvent(this.document, 'scroll', { capture: true });
            this.scrollSubscription = this.documentScroller
                .pipe(filter(this.testForSmartPopoverContentContainer))
                .subscribe(() => {
                this.smartOpenService.open = false;
                this.setAnchorFocus();
            });
        }
        else {
            // I think this is where dynamic re-positioning will be added
            // Instead of testing like we do in the close pipe below
            // we need to switch positioning to use an observable and then
            // debounce the scroll events to recalculate content position in a performant way
            // For now, ignore scrolling events.
            return;
        }
    }
    removeScrollListener() {
        if (this.documentScroller) {
            this.scrollSubscription.unsubscribe();
            delete this.documentScroller;
        }
    }
    addClickListener() {
        if (this.outsideClickClose) {
            this.documentClickListener = this.renderer.listen(this.document, 'click', (event) => {
                if (event === this.ignoredEvent) {
                    // Here we ignore the opening click event (w/o this content opens and immediately closes.
                    delete this.ignoredEvent;
                }
                else {
                    this.smartOpenService.open = false;
                    // Rather than a complex change to the focus trap I put focus on the element that was clicked
                    const clickedElement = event.target;
                    clickedElement.focus();
                }
            });
        }
    }
    removeClickListener() {
        if (this.outsideClickClose) {
            delete this.ignoredEvent;
            if (this.documentClickListener) {
                this.documentClickListener();
                delete this.documentClickListener;
            }
        }
    }
    addEscapeListener() {
        this.escapeListener = this.renderer.listen(this.document, 'keydown.escape', () => {
            this.smartOpenService.open = false;
            this.setAnchorFocus();
        });
    }
    removeEscapeListener() {
        if (this.escapeListener) {
            this.escapeListener();
            delete this.escapeListener;
        }
    }
    setCloseFocus() {
        this.closeButtonRef.nativeElement.focus();
    }
    setAnchorFocus() {
        this.anchorButtonRef.nativeElement.focus();
    }
    testForSmartPopoverContentContainer(event) {
        // Filter for the documentScroller observable event targets
        let target = event.target;
        // Walk up the DOM tree until we get to the element that is a direct child of the body.
        while (target.classList && target.parentElement.localName !== 'body') {
            target = target.parentElement;
        }
        // Target is the child element of body where the scroll events originated.
        // Return false and prevent the popover content container from closing for any scroll events inside a popover
        // content container.
        if (target.classList) {
            // check scroll events to see if they are happening in popover content or elsewhere
            return target.classList.contains('clr-popover-content') ? false : true;
        }
        else {
            // prevents it from closing right after first opening
            return false;
        }
    }
    removeAllEventListeners() {
        this.removeScrollListener();
        this.removeClickListener();
        this.removeEscapeListener();
    }
}
ClrPopoverEventsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverEventsService, deps: [{ token: i0.Renderer2 }, { token: i1.ClrPopoverToggleService }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
ClrPopoverEventsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverEventsService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverEventsService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i1.ClrPopoverToggleService }, { type: HTMLDocument, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1ldmVudHMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3V0aWxzL3BvcG92ZXIvcHJvdmlkZXJzL3BvcG92ZXItZXZlbnRzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFjLE1BQU0sRUFBRSxVQUFVLEVBQXdCLE1BQU0sZUFBZSxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxTQUFTLEVBQTRCLE1BQU0sTUFBTSxDQUFDO0FBQzNELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBSXhDLHlFQUF5RTtBQUN6RSxlQUFlO0FBRWYsTUFBTSxPQUFPLHVCQUF1QjtJQWNsQyxZQUNVLFFBQW1CLEVBQ25CLGdCQUF5QyxFQUN2QixRQUFzQjtRQUZ4QyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBeUI7UUFDdkIsYUFBUSxHQUFSLFFBQVEsQ0FBYztRQWhCbEQsc0JBQWlCLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLGtCQUFhLEdBQUcsSUFBSSxDQUFDO1FBU2Isa0JBQWEsR0FBbUIsRUFBRSxDQUFDO1FBUXpDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNyQixnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzNDLElBQUksSUFBSSxFQUFFO2dCQUNSLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2dCQUN6QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7YUFDMUI7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7YUFDaEM7UUFD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cHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBFbGVtZW50UmVmLCBJbmplY3QsIEluamVjdGFibGUsIE9uRGVzdHJveSwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmcm9tRXZlbnQsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSB9IGZyb20gJy4vcG9wb3Zlci10b2dnbGUuc2VydmljZSc7XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzIwMzUxI2lzc3VlY29tbWVudC0zNDQwMDk4ODdcbi8qKiBAZHluYW1pYyAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENsclBvcG92ZXJFdmVudHNTZXJ2aWNlIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgb3V0c2lkZUNsaWNrQ2xvc2UgPSB0cnVlO1xuICBzY3JvbGxUb0Nsb3NlID0gdHJ1ZTtcbiAgaWdub3JlZEV2ZW50OiBhbnk7XG4gIGFuY2hvckJ1dHRvblJlZjogRWxlbWVudFJlZjxIVE1MQnV0dG9uRWxlbWVudD47XG4gIGNsb3NlQnV0dG9uUmVmOiBFbGVtZW50UmVmPEhUTUxCdXR0b25FbGVtZW50PjtcbiAgY29udGVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgcHJpdmF0ZSBkb2N1bWVudENsaWNrTGlzdGVuZXI6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgZXNjYXBlTGlzdGVuZXI6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgc2Nyb2xsU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcbiAgcHJpdmF0ZSBkb2N1bWVudFNjcm9sbGVyOiBPYnNlcnZhYmxlPEV2ZW50PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBzbWFydE9wZW5TZXJ2aWNlOiBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSxcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBIVE1MRG9jdW1lbnRcbiAgKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICBzbWFydE9wZW5TZXJ2aWNlLm9wZW5DaGFuZ2Uuc3Vic2NyaWJlKG9wZW4gPT4ge1xuICAgICAgICBpZiAob3Blbikge1xuICAgICAgICAgIHRoaXMuYWRkRXNjYXBlTGlzdGVuZXIoKTtcbiAgICAgICAgICB0aGlzLmFkZENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgICB0aGlzLmFkZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVBbGxFdmVudExpc3RlbmVycygpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHNtYXJ0T3BlblNlcnZpY2UuZ2V0RXZlbnRDaGFuZ2UoKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgICAvLyBSZW1lbWJlciB0aGUgZXZlbnQgdGhhdCB3YXMgdXNlZCB0byBvcGVuIHRoZSBjb250ZW50XG4gICAgICAgIHRoaXMuaWdub3JlZEV2ZW50ID0gZXZlbnQ7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICAgIHRoaXMucmVtb3ZlQWxsRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIGFkZFNjcm9sbExpc3RlbmVyKCkge1xuICAgIGlmICh0aGlzLnNjcm9sbFRvQ2xvc2UpIHtcbiAgICAgIHRoaXMuZG9jdW1lbnRTY3JvbGxlciA9IGZyb21FdmVudCh0aGlzLmRvY3VtZW50LCAnc2Nyb2xsJywgeyBjYXB0dXJlOiB0cnVlIH0pO1xuICAgICAgdGhpcy5zY3JvbGxTdWJzY3JpcHRpb24gPSB0aGlzLmRvY3VtZW50U2Nyb2xsZXJcbiAgICAgICAgLnBpcGUoZmlsdGVyKHRoaXMudGVzdEZvclNtYXJ0UG9wb3ZlckNvbnRlbnRDb250YWluZXIpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnNtYXJ0T3BlblNlcnZpY2Uub3BlbiA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuc2V0QW5jaG9yRm9jdXMoKTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEkgdGhpbmsgdGhpcyBpcyB3aGVyZSBkeW5hbWljIHJlLXBvc2l0aW9uaW5nIHdpbGwgYmUgYWRkZWRcbiAgICAgIC8vIEluc3RlYWQgb2YgdGVzdGluZyBsaWtlIHdlIGRvIGluIHRoZSBjbG9zZSBwaXBlIGJlbG93XG4gICAgICAvLyB3ZSBuZWVkIHRvIHN3aXRjaCBwb3NpdGlvbmluZyB0byB1c2UgYW4gb2JzZXJ2YWJsZSBhbmQgdGhlblxuICAgICAgLy8gZGVib3VuY2UgdGhlIHNjcm9sbCBldmVudHMgdG8gcmVjYWxjdWxhdGUgY29udGVudCBwb3NpdGlvbiBpbiBhIHBlcmZvcm1hbnQgd2F5XG4gICAgICAvLyBGb3Igbm93LCBpZ25vcmUgc2Nyb2xsaW5nIGV2ZW50cy5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICByZW1vdmVTY3JvbGxMaXN0ZW5lcigpIHtcbiAgICBpZiAodGhpcy5kb2N1bWVudFNjcm9sbGVyKSB7XG4gICAgICB0aGlzLnNjcm9sbFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgZGVsZXRlIHRoaXMuZG9jdW1lbnRTY3JvbGxlcjtcbiAgICB9XG4gIH1cblxuICBhZGRDbGlja0xpc3RlbmVyKCkge1xuICAgIGlmICh0aGlzLm91dHNpZGVDbGlja0Nsb3NlKSB7XG4gICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZG9jdW1lbnQsICdjbGljaycsIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICBpZiAoZXZlbnQgPT09IHRoaXMuaWdub3JlZEV2ZW50KSB7XG4gICAgICAgICAgLy8gSGVyZSB3ZSBpZ25vcmUgdGhlIG9wZW5pbmcgY2xpY2sgZXZlbnQgKHcvbyB0aGlzIGNvbnRlbnQgb3BlbnMgYW5kIGltbWVkaWF0ZWx5IGNsb3Nlcy5cbiAgICAgICAgICBkZWxldGUgdGhpcy5pZ25vcmVkRXZlbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zbWFydE9wZW5TZXJ2aWNlLm9wZW4gPSBmYWxzZTtcbiAgICAgICAgICAvLyBSYXRoZXIgdGhhbiBhIGNvbXBsZXggY2hhbmdlIHRvIHRoZSBmb2N1cyB0cmFwIEkgcHV0IGZvY3VzIG9uIHRoZSBlbGVtZW50IHRoYXQgd2FzIGNsaWNrZWRcbiAgICAgICAgICBjb25zdCBjbGlja2VkRWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICBjbGlja2VkRWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVDbGlja0xpc3RlbmVyKCkge1xuICAgIGlmICh0aGlzLm91dHNpZGVDbGlja0Nsb3NlKSB7XG4gICAgICBkZWxldGUgdGhpcy5pZ25vcmVkRXZlbnQ7XG4gICAgICBpZiAodGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZEVzY2FwZUxpc3RlbmVyKCkge1xuICAgIHRoaXMuZXNjYXBlTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmRvY3VtZW50LCAna2V5ZG93bi5lc2NhcGUnLCAoKSA9PiB7XG4gICAgICB0aGlzLnNtYXJ0T3BlblNlcnZpY2Uub3BlbiA9IGZhbHNlO1xuICAgICAgdGhpcy5zZXRBbmNob3JGb2N1cygpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVtb3ZlRXNjYXBlTGlzdGVuZXIoKSB7XG4gICAgaWYgKHRoaXMuZXNjYXBlTGlzdGVuZXIpIHtcbiAgICAgIHRoaXMuZXNjYXBlTGlzdGVuZXIoKTtcbiAgICAgIGRlbGV0ZSB0aGlzLmVzY2FwZUxpc3RlbmVyO1xuICAgIH1cbiAgfVxuXG4gIHNldENsb3NlRm9jdXMoKTogdm9pZCB7XG4gICAgdGhpcy5jbG9zZUJ1dHRvblJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICBzZXRBbmNob3JGb2N1cygpOiB2b2lkIHtcbiAgICB0aGlzLmFuY2hvckJ1dHRvblJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICBwcml2YXRlIHRlc3RGb3JTbWFydFBvcG92ZXJDb250ZW50Q29udGFpbmVyKGV2ZW50OiBFdmVudCk6IGJvb2xlYW4ge1xuICAgIC8vIEZpbHRlciBmb3IgdGhlIGRvY3VtZW50U2Nyb2xsZXIgb2JzZXJ2YWJsZSBldmVudCB0YXJnZXRzXG4gICAgbGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcblxuICAgIC8vIFdhbGsgdXAgdGhlIERPTSB0cmVlIHVudGlsIHdlIGdldCB0byB0aGUgZWxlbWVudCB0aGF0IGlzIGEgZGlyZWN0IGNoaWxkIG9mIHRoZSBib2R5LlxuICAgIHdoaWxlICh0YXJnZXQuY2xhc3NMaXN0ICYmIHRhcmdldC5wYXJlbnRFbGVtZW50LmxvY2FsTmFtZSAhPT0gJ2JvZHknKSB7XG4gICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50RWxlbWVudDtcbiAgICB9XG5cbiAgICAvLyBUYXJnZXQgaXMgdGhlIGNoaWxkIGVsZW1lbnQgb2YgYm9keSB3aGVyZSB0aGUgc2Nyb2xsIGV2ZW50cyBvcmlnaW5hdGVkLlxuICAgIC8vIFJldHVybiBmYWxzZSBhbmQgcHJldmVudCB0aGUgcG9wb3ZlciBjb250ZW50IGNvbnRhaW5lciBmcm9tIGNsb3NpbmcgZm9yIGFueSBzY3JvbGwgZXZlbnRzIGluc2lkZSBhIHBvcG92ZXJcbiAgICAvLyBjb250ZW50IGNvbnRhaW5lci5cbiAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdCkge1xuICAgICAgLy8gY2hlY2sgc2Nyb2xsIGV2ZW50cyB0byBzZWUgaWYgdGhleSBhcmUgaGFwcGVuaW5nIGluIHBvcG92ZXIgY29udGVudCBvciBlbHNld2hlcmVcbiAgICAgIHJldHVybiB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjbHItcG9wb3Zlci1jb250ZW50JykgPyBmYWxzZSA6IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHByZXZlbnRzIGl0IGZyb20gY2xvc2luZyByaWdodCBhZnRlciBmaXJzdCBvcGVuaW5nXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVBbGxFdmVudExpc3RlbmVycygpIHtcbiAgICB0aGlzLnJlbW92ZVNjcm9sbExpc3RlbmVyKCk7XG4gICAgdGhpcy5yZW1vdmVDbGlja0xpc3RlbmVyKCk7XG4gICAgdGhpcy5yZW1vdmVFc2NhcGVMaXN0ZW5lcigpO1xuICB9XG59XG4iXX0=
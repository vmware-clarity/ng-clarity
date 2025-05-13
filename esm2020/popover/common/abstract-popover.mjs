/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ChangeDetectorRef, Directive, ElementRef, NgZone, Renderer2, SkipSelf, } from '@angular/core';
import { startWith } from 'rxjs/operators';
import { Keys } from '../../utils/enums/keys.enum';
import { normalizeKey } from '../../utils/focus/key-focus/util';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { Popover } from './popover';
import * as i0 from "@angular/core";
/**
 * Fallback to hide when *clrIfOpen is not being used
 */
const isOffScreenClassName = 'is-off-screen';
export class AbstractPopover {
    constructor(injector, parentHost) {
        this.parentHost = parentHost;
        /*
         * Until https://github.com/angular/angular/issues/8785 is supported, we don't have any way to instantiate
         * a separate directive on the host. So let's do dirty but performant for now.
         */
        this.closeOnOutsideClick = false;
        this.popoverOptions = {};
        this.updateAnchor = false;
        this.documentESCListener = null;
        this.closeOnOutsideClickCallback = event => {
            // The anchor element containing the click event origin means, the click wasn't triggered outside.
            if (this.anchorElem.contains(event.target)) {
                return;
            }
            this.toggleService.open = false;
        };
        this.el = injector.get(ElementRef);
        this.toggleService = injector.get(ClrPopoverToggleService);
        this.renderer = injector.get(Renderer2);
        this.ngZone = injector.get(NgZone);
        this.ref = injector.get(ChangeDetectorRef);
        // Default anchor is the parent host
        this.anchorElem = parentHost.nativeElement;
        this.popoverInstance = new Popover(this.el.nativeElement);
        this.subscription = this.toggleService.openChange.pipe(startWith(this.toggleService.open)).subscribe(open => {
            if (open) {
                this.anchor();
                this.attachESCListener();
                this.renderer.removeClass(this.el.nativeElement, isOffScreenClassName);
            }
            else {
                this.release();
                this.detachESCListener();
                this.renderer.addClass(this.el.nativeElement, isOffScreenClassName);
            }
        });
        if (this.toggleService.open) {
            this.anchor();
            this.attachESCListener();
        }
    }
    ngAfterViewChecked() {
        if (this.updateAnchor) {
            this.updateAnchor = false;
            this.popoverInstance
                .anchor(this.anchorElem, this.anchorPoint, this.popoverPoint, this.popoverOptions)
                .subscribe(() => {
                // if a scroll event is detected, close the popover
                this.toggleService.open = false;
            });
            this.attachOutsideClickListener();
        }
    }
    ngOnDestroy() {
        this.release();
        this.detachESCListener();
        this.subscription.unsubscribe();
    }
    anchor() {
        this.updateAnchor = true;
    }
    release() {
        this.detachOutsideClickListener();
        this.popoverInstance.release();
    }
    attachESCListener() {
        if (this.popoverOptions.ignoreGlobalESCListener) {
            return;
        }
        this.ngZone.runOutsideAngular(() => {
            this.documentESCListener = this.renderer.listen('document', 'keydown', event => {
                if (event && event.key) {
                    if (normalizeKey(event.key) === Keys.Escape) {
                        this.ngZone.run(() => {
                            this.toggleService.open = false;
                            this.ref.markForCheck();
                        });
                    }
                }
            });
        });
    }
    detachESCListener() {
        if (this.documentESCListener) {
            this.documentESCListener();
            this.documentESCListener = null;
        }
    }
    attachOutsideClickListener() {
        if (this.closeOnOutsideClick && this.toggleService.open) {
            if (document && document.addEventListener) {
                // To listen outside click, the listener should catch the event during the capturing phase.
                // We have to do this ugly document check as Renderer2.listen doesn't allow passive/useCapture listen.
                document.addEventListener('click', this.closeOnOutsideClickCallback, true);
            }
        }
    }
    detachOutsideClickListener() {
        if (this.closeOnOutsideClick) {
            if (document && document.removeEventListener) {
                document.removeEventListener('click', this.closeOnOutsideClickCallback, true);
            }
        }
    }
}
AbstractPopover.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: AbstractPopover, deps: [{ token: i0.Injector }, { token: i0.ElementRef, skipSelf: true }], target: i0.ɵɵFactoryTarget.Directive });
AbstractPopover.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: AbstractPopover, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: AbstractPopover, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.Injector }, { type: i0.ElementRef, decorators: [{
                    type: SkipSelf
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3QtcG9wb3Zlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3BvcG92ZXIvY29tbW9uL2Fic3RyYWN0LXBvcG92ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBRUwsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBRVYsTUFBTSxFQUVOLFNBQVMsRUFDVCxRQUFRLEdBQ1QsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTNDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDaEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDL0YsT0FBTyxFQUFTLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQzs7QUFHM0M7O0dBRUc7QUFDSCxNQUFNLG9CQUFvQixHQUFHLGVBQWUsQ0FBQztBQUc3QyxNQUFNLE9BQWdCLGVBQWU7SUF1Qm5DLFlBQVksUUFBa0IsRUFBd0IsVUFBbUM7UUFBbkMsZUFBVSxHQUFWLFVBQVUsQ0FBeUI7UUF0QnpGOzs7V0FHRztRQUNILHdCQUFtQixHQUFHLEtBQUssQ0FBQztRQVVsQixtQkFBYyxHQUFtQixFQUFFLENBQUM7UUFHdEMsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFHckIsd0JBQW1CLEdBQXdCLElBQUksQ0FBQztRQW1GaEQsZ0NBQTJCLEdBQUcsS0FBSyxDQUFDLEVBQUU7WUFDNUMsa0dBQWtHO1lBQ2xHLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUMxQyxPQUFPO2FBQ1I7WUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksR0FB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Q0FBQyxtQkFBbUIsRUFBRTtnQkFDNUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDL0U7U0FDRjtJQUNILENBQUM7OzRHQWhJbUIsZUFBZTtnR0FBZixlQUFlOzJGQUFmLGVBQWU7a0JBRHBDLFNBQVM7OzBCQXdCeUIsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0b3IsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBSZW5kZXJlcjIsXG4gIFNraXBTZWxmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc3RhcnRXaXRoIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBLZXlzIH0gZnJvbSAnLi4vLi4vdXRpbHMvZW51bXMva2V5cy5lbnVtJztcbmltcG9ydCB7IG5vcm1hbGl6ZUtleSB9IGZyb20gJy4uLy4uL3V0aWxzL2ZvY3VzL2tleS1mb2N1cy91dGlsJztcbmltcG9ydCB7IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wcm92aWRlcnMvcG9wb3Zlci10b2dnbGUuc2VydmljZSc7XG5pbXBvcnQgeyBQb2ludCwgUG9wb3ZlciB9IGZyb20gJy4vcG9wb3Zlcic7XG5pbXBvcnQgeyBQb3BvdmVyT3B0aW9ucyB9IGZyb20gJy4vcG9wb3Zlci1vcHRpb25zLmludGVyZmFjZSc7XG5cbi8qKlxuICogRmFsbGJhY2sgdG8gaGlkZSB3aGVuICpjbHJJZk9wZW4gaXMgbm90IGJlaW5nIHVzZWRcbiAqL1xuY29uc3QgaXNPZmZTY3JlZW5DbGFzc05hbWUgPSAnaXMtb2ZmLXNjcmVlbic7XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0UG9wb3ZlciBpbXBsZW1lbnRzIEFmdGVyVmlld0NoZWNrZWQsIE9uRGVzdHJveSB7XG4gIC8qXG4gICAqIFVudGlsIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzg3ODUgaXMgc3VwcG9ydGVkLCB3ZSBkb24ndCBoYXZlIGFueSB3YXkgdG8gaW5zdGFudGlhdGVcbiAgICogYSBzZXBhcmF0ZSBkaXJlY3RpdmUgb24gdGhlIGhvc3QuIFNvIGxldCdzIGRvIGRpcnR5IGJ1dCBwZXJmb3JtYW50IGZvciBub3cuXG4gICAqL1xuICBjbG9zZU9uT3V0c2lkZUNsaWNrID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIGVsOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgcHJvdGVjdGVkIHRvZ2dsZVNlcnZpY2U6IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyMjtcbiAgcHJvdGVjdGVkIG5nWm9uZTogTmdab25lO1xuICBwcm90ZWN0ZWQgcmVmOiBDaGFuZ2VEZXRlY3RvclJlZjtcbiAgcHJvdGVjdGVkIGFuY2hvckVsZW06IGFueTtcbiAgcHJvdGVjdGVkIGFuY2hvclBvaW50OiBQb2ludDtcbiAgcHJvdGVjdGVkIHBvcG92ZXJQb2ludDogUG9pbnQ7XG4gIHByb3RlY3RlZCBwb3BvdmVyT3B0aW9uczogUG9wb3Zlck9wdGlvbnMgPSB7fTtcbiAgcHJvdGVjdGVkIGlnbm9yZWRFbGVtZW50OiBhbnk7XG5cbiAgcHJpdmF0ZSB1cGRhdGVBbmNob3IgPSBmYWxzZTtcbiAgcHJpdmF0ZSBwb3BvdmVySW5zdGFuY2U6IFBvcG92ZXI7XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgZG9jdW1lbnRFU0NMaXN0ZW5lcjogVm9pZEZ1bmN0aW9uIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLCBAU2tpcFNlbGYoKSBwcm90ZWN0ZWQgcGFyZW50SG9zdDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICB0aGlzLmVsID0gaW5qZWN0b3IuZ2V0KEVsZW1lbnRSZWYpO1xuICAgIHRoaXMudG9nZ2xlU2VydmljZSA9IGluamVjdG9yLmdldChDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSk7XG4gICAgdGhpcy5yZW5kZXJlciA9IGluamVjdG9yLmdldChSZW5kZXJlcjIpO1xuICAgIHRoaXMubmdab25lID0gaW5qZWN0b3IuZ2V0KE5nWm9uZSk7XG4gICAgdGhpcy5yZWYgPSBpbmplY3Rvci5nZXQoQ2hhbmdlRGV0ZWN0b3JSZWYpO1xuICAgIC8vIERlZmF1bHQgYW5jaG9yIGlzIHRoZSBwYXJlbnQgaG9zdFxuICAgIHRoaXMuYW5jaG9yRWxlbSA9IHBhcmVudEhvc3QubmF0aXZlRWxlbWVudDtcblxuICAgIHRoaXMucG9wb3Zlckluc3RhbmNlID0gbmV3IFBvcG92ZXIodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMudG9nZ2xlU2VydmljZS5vcGVuQ2hhbmdlLnBpcGUoc3RhcnRXaXRoKHRoaXMudG9nZ2xlU2VydmljZS5vcGVuKSkuc3Vic2NyaWJlKG9wZW4gPT4ge1xuICAgICAgaWYgKG9wZW4pIHtcbiAgICAgICAgdGhpcy5hbmNob3IoKTtcbiAgICAgICAgdGhpcy5hdHRhY2hFU0NMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgaXNPZmZTY3JlZW5DbGFzc05hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZWxlYXNlKCk7XG4gICAgICAgIHRoaXMuZGV0YWNoRVNDTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIGlzT2ZmU2NyZWVuQ2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAodGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4pIHtcbiAgICAgIHRoaXMuYW5jaG9yKCk7XG4gICAgICB0aGlzLmF0dGFjaEVTQ0xpc3RlbmVyKCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgIGlmICh0aGlzLnVwZGF0ZUFuY2hvcikge1xuICAgICAgdGhpcy51cGRhdGVBbmNob3IgPSBmYWxzZTtcbiAgICAgIHRoaXMucG9wb3Zlckluc3RhbmNlXG4gICAgICAgIC5hbmNob3IodGhpcy5hbmNob3JFbGVtLCB0aGlzLmFuY2hvclBvaW50LCB0aGlzLnBvcG92ZXJQb2ludCwgdGhpcy5wb3BvdmVyT3B0aW9ucylcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgLy8gaWYgYSBzY3JvbGwgZXZlbnQgaXMgZGV0ZWN0ZWQsIGNsb3NlIHRoZSBwb3BvdmVyXG4gICAgICAgICAgdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4gPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB0aGlzLmF0dGFjaE91dHNpZGVDbGlja0xpc3RlbmVyKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5yZWxlYXNlKCk7XG4gICAgdGhpcy5kZXRhY2hFU0NMaXN0ZW5lcigpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYW5jaG9yKCkge1xuICAgIHRoaXMudXBkYXRlQW5jaG9yID0gdHJ1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZWxlYXNlKCkge1xuICAgIHRoaXMuZGV0YWNoT3V0c2lkZUNsaWNrTGlzdGVuZXIoKTtcbiAgICB0aGlzLnBvcG92ZXJJbnN0YW5jZS5yZWxlYXNlKCk7XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaEVTQ0xpc3RlbmVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBvcG92ZXJPcHRpb25zLmlnbm9yZUdsb2JhbEVTQ0xpc3RlbmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5kb2N1bWVudEVTQ0xpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ2tleWRvd24nLCBldmVudCA9PiB7XG4gICAgICAgIGlmIChldmVudCAmJiBldmVudC5rZXkpIHtcbiAgICAgICAgICBpZiAobm9ybWFsaXplS2V5KGV2ZW50LmtleSkgPT09IEtleXMuRXNjYXBlKSB7XG4gICAgICAgICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICB0aGlzLnJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRldGFjaEVTQ0xpc3RlbmVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRvY3VtZW50RVNDTGlzdGVuZXIpIHtcbiAgICAgIHRoaXMuZG9jdW1lbnRFU0NMaXN0ZW5lcigpO1xuICAgICAgdGhpcy5kb2N1bWVudEVTQ0xpc3RlbmVyID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNsb3NlT25PdXRzaWRlQ2xpY2tDYWxsYmFjayA9IGV2ZW50ID0+IHtcbiAgICAvLyBUaGUgYW5jaG9yIGVsZW1lbnQgY29udGFpbmluZyB0aGUgY2xpY2sgZXZlbnQgb3JpZ2luIG1lYW5zLCB0aGUgY2xpY2sgd2Fzbid0IHRyaWdnZXJlZCBvdXRzaWRlLlxuICAgIGlmICh0aGlzLmFuY2hvckVsZW0uY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbiA9IGZhbHNlO1xuICB9O1xuXG4gIHByaXZhdGUgYXR0YWNoT3V0c2lkZUNsaWNrTGlzdGVuZXIoKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VPbk91dHNpZGVDbGljayAmJiB0aGlzLnRvZ2dsZVNlcnZpY2Uub3Blbikge1xuICAgICAgaWYgKGRvY3VtZW50ICYmIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgLy8gVG8gbGlzdGVuIG91dHNpZGUgY2xpY2ssIHRoZSBsaXN0ZW5lciBzaG91bGQgY2F0Y2ggdGhlIGV2ZW50IGR1cmluZyB0aGUgY2FwdHVyaW5nIHBoYXNlLlxuICAgICAgICAvLyBXZSBoYXZlIHRvIGRvIHRoaXMgdWdseSBkb2N1bWVudCBjaGVjayBhcyBSZW5kZXJlcjIubGlzdGVuIGRvZXNuJ3QgYWxsb3cgcGFzc2l2ZS91c2VDYXB0dXJlIGxpc3Rlbi5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsb3NlT25PdXRzaWRlQ2xpY2tDYWxsYmFjaywgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkZXRhY2hPdXRzaWRlQ2xpY2tMaXN0ZW5lcigpIHtcbiAgICBpZiAodGhpcy5jbG9zZU9uT3V0c2lkZUNsaWNrKSB7XG4gICAgICBpZiAoZG9jdW1lbnQgJiYgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xvc2VPbk91dHNpZGVDbGlja0NhbGxiYWNrLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==
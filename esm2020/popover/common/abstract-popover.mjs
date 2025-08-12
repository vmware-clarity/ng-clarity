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
            if (event.target.shadowRoot) {
                const containsNode = event.composedPath().some((element) => element === this.anchorElem);
                if (containsNode) {
                    return;
                }
            }
            else if (this.anchorElem.contains(event.target)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3QtcG9wb3Zlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3BvcG92ZXIvY29tbW9uL2Fic3RyYWN0LXBvcG92ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBRUwsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBRVYsTUFBTSxFQUVOLFNBQVMsRUFDVCxRQUFRLEdBQ1QsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTNDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDaEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDL0YsT0FBTyxFQUFTLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQzs7QUFHM0M7O0dBRUc7QUFDSCxNQUFNLG9CQUFvQixHQUFHLGVBQWUsQ0FBQztBQUc3QyxNQUFNLE9BQWdCLGVBQWU7SUF1Qm5DLFlBQXNCLFFBQWtCLEVBQXdCLFVBQW1DO1FBQW5DLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBdEJuRzs7O1dBR0c7UUFDSCx3QkFBbUIsR0FBRyxLQUFLLENBQUM7UUFVbEIsbUJBQWMsR0FBbUIsRUFBRSxDQUFDO1FBR3RDLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBR3JCLHdCQUFtQixHQUF3QixJQUFJLENBQUM7UUFtRmhELGdDQUEyQixHQUFHLEtBQUssQ0FBQyxFQUFFO1lBQzVDLGtHQUFrRztZQUNsRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO2dCQUMzQixNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBb0IsRUFBRSxF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QUFnQixFQUFFO2dCQUN6QywyRkFBMkY7Z0JBQzNGLHNHQUFzRztnQkFDdEcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDNUU7U0FDRjtJQUNILENBQUM7SUFFTywwQkFBMEI7UUFDaEMsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDNUIsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLG1CQUFtQixFQUFFO2dCQUM1QyxRQUFRLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQywyQkFBMkIsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUMvRTtTQUNGO0lBQ0gsQ0FBQzs7NEdBdEltQixlQUFlO2dHQUFmLGVBQWU7MkZBQWYsZUFBZTtrQkFEcEMsU0FBUzs7MEJBd0JtQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQge1xuICBBZnRlclZpZXdDaGVja2VkLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3RvcixcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIFJlbmRlcmVyMixcbiAgU2tpcFNlbGYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBzdGFydFdpdGggfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEtleXMgfSBmcm9tICcuLi8uLi91dGlscy9lbnVtcy9rZXlzLmVudW0nO1xuaW1wb3J0IHsgbm9ybWFsaXplS2V5IH0gZnJvbSAnLi4vLi4vdXRpbHMvZm9jdXMva2V5LWZvY3VzL3V0aWwnO1xuaW1wb3J0IHsgQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL3Byb3ZpZGVycy9wb3BvdmVyLXRvZ2dsZS5zZXJ2aWNlJztcbmltcG9ydCB7IFBvaW50LCBQb3BvdmVyIH0gZnJvbSAnLi9wb3BvdmVyJztcbmltcG9ydCB7IFBvcG92ZXJPcHRpb25zIH0gZnJvbSAnLi9wb3BvdmVyLW9wdGlvbnMuaW50ZXJmYWNlJztcblxuLyoqXG4gKiBGYWxsYmFjayB0byBoaWRlIHdoZW4gKmNscklmT3BlbiBpcyBub3QgYmVpbmcgdXNlZFxuICovXG5jb25zdCBpc09mZlNjcmVlbkNsYXNzTmFtZSA9ICdpcy1vZmYtc2NyZWVuJztcblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWJzdHJhY3RQb3BvdmVyIGltcGxlbWVudHMgQWZ0ZXJWaWV3Q2hlY2tlZCwgT25EZXN0cm95IHtcbiAgLypcbiAgICogVW50aWwgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvODc4NSBpcyBzdXBwb3J0ZWQsIHdlIGRvbid0IGhhdmUgYW55IHdheSB0byBpbnN0YW50aWF0ZVxuICAgKiBhIHNlcGFyYXRlIGRpcmVjdGl2ZSBvbiB0aGUgaG9zdC4gU28gbGV0J3MgZG8gZGlydHkgYnV0IHBlcmZvcm1hbnQgZm9yIG5vdy5cbiAgICovXG4gIGNsb3NlT25PdXRzaWRlQ2xpY2sgPSBmYWxzZTtcblxuICBwcm90ZWN0ZWQgZWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBwcm90ZWN0ZWQgdG9nZ2xlU2VydmljZTogQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2U7XG4gIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyO1xuICBwcm90ZWN0ZWQgbmdab25lOiBOZ1pvbmU7XG4gIHByb3RlY3RlZCByZWY6IENoYW5nZURldGVjdG9yUmVmO1xuICBwcm90ZWN0ZWQgYW5jaG9yRWxlbTogYW55O1xuICBwcm90ZWN0ZWQgYW5jaG9yUG9pbnQ6IFBvaW50O1xuICBwcm90ZWN0ZWQgcG9wb3ZlclBvaW50OiBQb2ludDtcbiAgcHJvdGVjdGVkIHBvcG92ZXJPcHRpb25zOiBQb3BvdmVyT3B0aW9ucyA9IHt9O1xuICBwcm90ZWN0ZWQgaWdub3JlZEVsZW1lbnQ6IGFueTtcblxuICBwcml2YXRlIHVwZGF0ZUFuY2hvciA9IGZhbHNlO1xuICBwcml2YXRlIHBvcG92ZXJJbnN0YW5jZTogUG9wb3ZlcjtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBkb2N1bWVudEVTQ0xpc3RlbmVyOiBWb2lkRnVuY3Rpb24gfCBudWxsID0gbnVsbDtcblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLCBAU2tpcFNlbGYoKSBwcm90ZWN0ZWQgcGFyZW50SG9zdDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICB0aGlzLmVsID0gaW5qZWN0b3IuZ2V0KEVsZW1lbnRSZWYpO1xuICAgIHRoaXMudG9nZ2xlU2VydmljZSA9IGluamVjdG9yLmdldChDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSk7XG4gICAgdGhpcy5yZW5kZXJlciA9IGluamVjdG9yLmdldChSZW5kZXJlcjIpO1xuICAgIHRoaXMubmdab25lID0gaW5qZWN0b3IuZ2V0KE5nWm9uZSk7XG4gICAgdGhpcy5yZWYgPSBpbmplY3Rvci5nZXQoQ2hhbmdlRGV0ZWN0b3JSZWYpO1xuICAgIC8vIERlZmF1bHQgYW5jaG9yIGlzIHRoZSBwYXJlbnQgaG9zdFxuICAgIHRoaXMuYW5jaG9yRWxlbSA9IHBhcmVudEhvc3QubmF0aXZlRWxlbWVudDtcblxuICAgIHRoaXMucG9wb3Zlckluc3RhbmNlID0gbmV3IFBvcG92ZXIodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMudG9nZ2xlU2VydmljZS5vcGVuQ2hhbmdlLnBpcGUoc3RhcnRXaXRoKHRoaXMudG9nZ2xlU2VydmljZS5vcGVuKSkuc3Vic2NyaWJlKG9wZW4gPT4ge1xuICAgICAgaWYgKG9wZW4pIHtcbiAgICAgICAgdGhpcy5hbmNob3IoKTtcbiAgICAgICAgdGhpcy5hdHRhY2hFU0NMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgaXNPZmZTY3JlZW5DbGFzc05hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZWxlYXNlKCk7XG4gICAgICAgIHRoaXMuZGV0YWNoRVNDTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIGlzT2ZmU2NyZWVuQ2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAodGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4pIHtcbiAgICAgIHRoaXMuYW5jaG9yKCk7XG4gICAgICB0aGlzLmF0dGFjaEVTQ0xpc3RlbmVyKCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgIGlmICh0aGlzLnVwZGF0ZUFuY2hvcikge1xuICAgICAgdGhpcy51cGRhdGVBbmNob3IgPSBmYWxzZTtcbiAgICAgIHRoaXMucG9wb3Zlckluc3RhbmNlXG4gICAgICAgIC5hbmNob3IodGhpcy5hbmNob3JFbGVtLCB0aGlzLmFuY2hvclBvaW50LCB0aGlzLnBvcG92ZXJQb2ludCwgdGhpcy5wb3BvdmVyT3B0aW9ucylcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgLy8gaWYgYSBzY3JvbGwgZXZlbnQgaXMgZGV0ZWN0ZWQsIGNsb3NlIHRoZSBwb3BvdmVyXG4gICAgICAgICAgdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4gPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB0aGlzLmF0dGFjaE91dHNpZGVDbGlja0xpc3RlbmVyKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5yZWxlYXNlKCk7XG4gICAgdGhpcy5kZXRhY2hFU0NMaXN0ZW5lcigpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYW5jaG9yKCkge1xuICAgIHRoaXMudXBkYXRlQW5jaG9yID0gdHJ1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZWxlYXNlKCkge1xuICAgIHRoaXMuZGV0YWNoT3V0c2lkZUNsaWNrTGlzdGVuZXIoKTtcbiAgICB0aGlzLnBvcG92ZXJJbnN0YW5jZS5yZWxlYXNlKCk7XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaEVTQ0xpc3RlbmVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBvcG92ZXJPcHRpb25zLmlnbm9yZUdsb2JhbEVTQ0xpc3RlbmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5kb2N1bWVudEVTQ0xpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ2tleWRvd24nLCBldmVudCA9PiB7XG4gICAgICAgIGlmIChldmVudCAmJiBldmVudC5rZXkpIHtcbiAgICAgICAgICBpZiAobm9ybWFsaXplS2V5KGV2ZW50LmtleSkgPT09IEtleXMuRXNjYXBlKSB7XG4gICAgICAgICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICB0aGlzLnJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRldGFjaEVTQ0xpc3RlbmVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRvY3VtZW50RVNDTGlzdGVuZXIpIHtcbiAgICAgIHRoaXMuZG9jdW1lbnRFU0NMaXN0ZW5lcigpO1xuICAgICAgdGhpcy5kb2N1bWVudEVTQ0xpc3RlbmVyID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNsb3NlT25PdXRzaWRlQ2xpY2tDYWxsYmFjayA9IGV2ZW50ID0+IHtcbiAgICAvLyBUaGUgYW5jaG9yIGVsZW1lbnQgY29udGFpbmluZyB0aGUgY2xpY2sgZXZlbnQgb3JpZ2luIG1lYW5zLCB0aGUgY2xpY2sgd2Fzbid0IHRyaWdnZXJlZCBvdXRzaWRlLlxuICAgIGlmIChldmVudC50YXJnZXQuc2hhZG93Um9vdCkge1xuICAgICAgY29uc3QgY29udGFpbnNOb2RlID0gZXZlbnQuY29tcG9zZWRQYXRoKCkuc29tZSgoZWxlbWVudDogSFRNTEVsZW1lbnQpID0+IGVsZW1lbnQgPT09IHRoaXMuYW5jaG9yRWxlbSk7XG5cbiAgICAgIGlmIChjb250YWluc05vZGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5hbmNob3JFbGVtLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4gPSBmYWxzZTtcbiAgfTtcblxuICBwcml2YXRlIGF0dGFjaE91dHNpZGVDbGlja0xpc3RlbmVyKCkge1xuICAgIGlmICh0aGlzLmNsb3NlT25PdXRzaWRlQ2xpY2sgJiYgdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4pIHtcbiAgICAgIGlmIChkb2N1bWVudCAmJiBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIC8vIFRvIGxpc3RlbiBvdXRzaWRlIGNsaWNrLCB0aGUgbGlzdGVuZXIgc2hvdWxkIGNhdGNoIHRoZSBldmVudCBkdXJpbmcgdGhlIGNhcHR1cmluZyBwaGFzZS5cbiAgICAgICAgLy8gV2UgaGF2ZSB0byBkbyB0aGlzIHVnbHkgZG9jdW1lbnQgY2hlY2sgYXMgUmVuZGVyZXIyLmxpc3RlbiBkb2Vzbid0IGFsbG93IHBhc3NpdmUvdXNlQ2FwdHVyZSBsaXN0ZW4uXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jbG9zZU9uT3V0c2lkZUNsaWNrQ2FsbGJhY2ssIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZGV0YWNoT3V0c2lkZUNsaWNrTGlzdGVuZXIoKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VPbk91dHNpZGVDbGljaykge1xuICAgICAgaWYgKGRvY3VtZW50ICYmIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsb3NlT25PdXRzaWRlQ2xpY2tDYWxsYmFjaywgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=
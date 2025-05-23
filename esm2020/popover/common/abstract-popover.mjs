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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3QtcG9wb3Zlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3BvcG92ZXIvY29tbW9uL2Fic3RyYWN0LXBvcG92ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBRUwsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBRVYsTUFBTSxFQUVOLFNBQVMsRUFDVCxRQUFRLEdBQ1QsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTNDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDaEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDL0YsT0FBTyxFQUFTLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQzs7QUFHM0M7O0dBRUc7QUFDSCxNQUFNLG9CQUFvQixHQUFHLGVBQWUsQ0FBQztBQUc3QyxNQUFNLE9BQWdCLGVBQWU7SUF1Qm5DLFlBQVksUUFBa0IsRUFBd0IsVUFBbUM7UUFBbkMsZUFBVSxHQUFWLFVBQVUsQ0FBeUI7UUF0QnpGOzs7V0FHRztRQUNILHdCQUFtQixHQUFHLEtBQUssQ0FBQztRQVVsQixtQkFBYyxHQUFtQixFQUFFLENBQUM7UUFHdEMsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFHckIsd0JBQW1CLEdBQXdCLElBQUksQ0FBQztRQW1GaEQsZ0NBQTJCLEdBQUcsS0FBSyxDQUFDLEVBQUU7WUFDNUMsa0dBQWtHO1lBQ2xHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7Z0JBQzNCLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFvQixFQUFFLEVBQUUsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUV0RyxJQUFJLFlBQVksRUFBRTtvQkFDaEIsT0FBTztpQkFDUjthQUNGO2lCQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNqRCxPQUFPO2FBQ1I7WUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7UUFDbEMsQ0FBQyxDQUFDO1FBNUZBLElBQUksQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzNDLG9DQUFvQztRQUNwQyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFFM0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzFHLElBQUksSUFBSSxFQUFFO2dCQUNSLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDZCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsb0JBQW9CLENBQUMsQ0FBQzthQUN4RTtpQkFBTTtnQkFDTCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLG9CQUFvQixDQUFDLENBQUM7YUFDckU7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUU7WUFDM0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7U0FDMUI7SUFDSCxDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztZQUMxQixJQUFJLENBQUMsZUFBZTtpQkFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUM7aUJBQ2pGLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsbURBQW1EO2dCQUNuRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7WUFDTCxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztTQUNuQztJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRVMsTUFBTTtRQUNkLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUM7SUFFUyxPQUFPO1FBQ2YsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRU8saUJBQWlCO1FBQ3ZCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyx1QkFBdUIsRUFBRTtZQUMvQyxPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUNqQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsRUFBRTtnQkFDN0UsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRTtvQkFDdEIsSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7d0JBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTs0QkFDbkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDOzRCQUNoQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUMxQixDQUFDLENBQUMsQ0FBQztxQkFDSjtpQkFDRjtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8saUJBQWlCO1FBQ3ZCLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7U0FDakM7SUFDSCxDQUFDO0lBZ0JPLDBCQUEwQjtRQUNoQyxJQUFJLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRTtZQUN2RCxJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ3pDLDJGQUEyRjtnQkFDM0Ysc0dBQXNHO2dCQUN0RyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQywyQkFBMkIsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUM1RTtTQUNGO0lBQ0gsQ0FBQztJQUVPLDBCQUEwQjtRQUNoQyxJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QixJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsbUJBQW1CLEVBQUU7Z0JBQzVDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLDJCQUEyQixFQUFFLElBQUksQ0FBQyxDQUFDO2FBQy9FO1NBQ0Y7SUFDSCxDQUFDOzs0R0F0SW1CLGVBQWU7Z0dBQWYsZUFBZTsyRkFBZixlQUFlO2tCQURwQyxTQUFTOzswQkF3QnlCLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0NoZWNrZWQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdG9yLFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgUmVuZGVyZXIyLFxuICBTa2lwU2VsZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHN0YXJ0V2l0aCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgS2V5cyB9IGZyb20gJy4uLy4uL3V0aWxzL2VudW1zL2tleXMuZW51bSc7XG5pbXBvcnQgeyBub3JtYWxpemVLZXkgfSBmcm9tICcuLi8uLi91dGlscy9mb2N1cy9rZXktZm9jdXMvdXRpbCc7XG5pbXBvcnQgeyBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvcHJvdmlkZXJzL3BvcG92ZXItdG9nZ2xlLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9pbnQsIFBvcG92ZXIgfSBmcm9tICcuL3BvcG92ZXInO1xuaW1wb3J0IHsgUG9wb3Zlck9wdGlvbnMgfSBmcm9tICcuL3BvcG92ZXItb3B0aW9ucy5pbnRlcmZhY2UnO1xuXG4vKipcbiAqIEZhbGxiYWNrIHRvIGhpZGUgd2hlbiAqY2xySWZPcGVuIGlzIG5vdCBiZWluZyB1c2VkXG4gKi9cbmNvbnN0IGlzT2ZmU2NyZWVuQ2xhc3NOYW1lID0gJ2lzLW9mZi1zY3JlZW4nO1xuXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBYnN0cmFjdFBvcG92ZXIgaW1wbGVtZW50cyBBZnRlclZpZXdDaGVja2VkLCBPbkRlc3Ryb3kge1xuICAvKlxuICAgKiBVbnRpbCBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy84Nzg1IGlzIHN1cHBvcnRlZCwgd2UgZG9uJ3QgaGF2ZSBhbnkgd2F5IHRvIGluc3RhbnRpYXRlXG4gICAqIGEgc2VwYXJhdGUgZGlyZWN0aXZlIG9uIHRoZSBob3N0LiBTbyBsZXQncyBkbyBkaXJ0eSBidXQgcGVyZm9ybWFudCBmb3Igbm93LlxuICAgKi9cbiAgY2xvc2VPbk91dHNpZGVDbGljayA9IGZhbHNlO1xuXG4gIHByb3RlY3RlZCBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIHByb3RlY3RlZCB0b2dnbGVTZXJ2aWNlOiBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZTtcbiAgcHJvdGVjdGVkIHJlbmRlcmVyOiBSZW5kZXJlcjI7XG4gIHByb3RlY3RlZCBuZ1pvbmU6IE5nWm9uZTtcbiAgcHJvdGVjdGVkIHJlZjogQ2hhbmdlRGV0ZWN0b3JSZWY7XG4gIHByb3RlY3RlZCBhbmNob3JFbGVtOiBhbnk7XG4gIHByb3RlY3RlZCBhbmNob3JQb2ludDogUG9pbnQ7XG4gIHByb3RlY3RlZCBwb3BvdmVyUG9pbnQ6IFBvaW50O1xuICBwcm90ZWN0ZWQgcG9wb3Zlck9wdGlvbnM6IFBvcG92ZXJPcHRpb25zID0ge307XG4gIHByb3RlY3RlZCBpZ25vcmVkRWxlbWVudDogYW55O1xuXG4gIHByaXZhdGUgdXBkYXRlQW5jaG9yID0gZmFsc2U7XG4gIHByaXZhdGUgcG9wb3Zlckluc3RhbmNlOiBQb3BvdmVyO1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIGRvY3VtZW50RVNDTGlzdGVuZXI6IFZvaWRGdW5jdGlvbiB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3RvciwgQFNraXBTZWxmKCkgcHJvdGVjdGVkIHBhcmVudEhvc3Q6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7XG4gICAgdGhpcy5lbCA9IGluamVjdG9yLmdldChFbGVtZW50UmVmKTtcbiAgICB0aGlzLnRvZ2dsZVNlcnZpY2UgPSBpbmplY3Rvci5nZXQoQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UpO1xuICAgIHRoaXMucmVuZGVyZXIgPSBpbmplY3Rvci5nZXQoUmVuZGVyZXIyKTtcbiAgICB0aGlzLm5nWm9uZSA9IGluamVjdG9yLmdldChOZ1pvbmUpO1xuICAgIHRoaXMucmVmID0gaW5qZWN0b3IuZ2V0KENoYW5nZURldGVjdG9yUmVmKTtcbiAgICAvLyBEZWZhdWx0IGFuY2hvciBpcyB0aGUgcGFyZW50IGhvc3RcbiAgICB0aGlzLmFuY2hvckVsZW0gPSBwYXJlbnRIb3N0Lm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICB0aGlzLnBvcG92ZXJJbnN0YW5jZSA9IG5ldyBQb3BvdmVyKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbkNoYW5nZS5waXBlKHN0YXJ0V2l0aCh0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbikpLnN1YnNjcmliZShvcGVuID0+IHtcbiAgICAgIGlmIChvcGVuKSB7XG4gICAgICAgIHRoaXMuYW5jaG9yKCk7XG4gICAgICAgIHRoaXMuYXR0YWNoRVNDTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIGlzT2ZmU2NyZWVuQ2xhc3NOYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVsZWFzZSgpO1xuICAgICAgICB0aGlzLmRldGFjaEVTQ0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBpc09mZlNjcmVlbkNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHRoaXMudG9nZ2xlU2VydmljZS5vcGVuKSB7XG4gICAgICB0aGlzLmFuY2hvcigpO1xuICAgICAgdGhpcy5hdHRhY2hFU0NMaXN0ZW5lcigpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcbiAgICBpZiAodGhpcy51cGRhdGVBbmNob3IpIHtcbiAgICAgIHRoaXMudXBkYXRlQW5jaG9yID0gZmFsc2U7XG4gICAgICB0aGlzLnBvcG92ZXJJbnN0YW5jZVxuICAgICAgICAuYW5jaG9yKHRoaXMuYW5jaG9yRWxlbSwgdGhpcy5hbmNob3JQb2ludCwgdGhpcy5wb3BvdmVyUG9pbnQsIHRoaXMucG9wb3Zlck9wdGlvbnMpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIC8vIGlmIGEgc2Nyb2xsIGV2ZW50IGlzIGRldGVjdGVkLCBjbG9zZSB0aGUgcG9wb3ZlclxuICAgICAgICAgIHRoaXMudG9nZ2xlU2VydmljZS5vcGVuID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgdGhpcy5hdHRhY2hPdXRzaWRlQ2xpY2tMaXN0ZW5lcigpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMucmVsZWFzZSgpO1xuICAgIHRoaXMuZGV0YWNoRVNDTGlzdGVuZXIoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFuY2hvcigpIHtcbiAgICB0aGlzLnVwZGF0ZUFuY2hvciA9IHRydWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVsZWFzZSgpIHtcbiAgICB0aGlzLmRldGFjaE91dHNpZGVDbGlja0xpc3RlbmVyKCk7XG4gICAgdGhpcy5wb3BvdmVySW5zdGFuY2UucmVsZWFzZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhdHRhY2hFU0NMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wb3BvdmVyT3B0aW9ucy5pZ25vcmVHbG9iYWxFU0NMaXN0ZW5lcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuZG9jdW1lbnRFU0NMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdrZXlkb3duJywgZXZlbnQgPT4ge1xuICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQua2V5KSB7XG4gICAgICAgICAgaWYgKG5vcm1hbGl6ZUtleShldmVudC5rZXkpID09PSBLZXlzLkVzY2FwZSkge1xuICAgICAgICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgdGhpcy5yZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkZXRhY2hFU0NMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kb2N1bWVudEVTQ0xpc3RlbmVyKSB7XG4gICAgICB0aGlzLmRvY3VtZW50RVNDTGlzdGVuZXIoKTtcbiAgICAgIHRoaXMuZG9jdW1lbnRFU0NMaXN0ZW5lciA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjbG9zZU9uT3V0c2lkZUNsaWNrQ2FsbGJhY2sgPSBldmVudCA9PiB7XG4gICAgLy8gVGhlIGFuY2hvciBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIGNsaWNrIGV2ZW50IG9yaWdpbiBtZWFucywgdGhlIGNsaWNrIHdhc24ndCB0cmlnZ2VyZWQgb3V0c2lkZS5cbiAgICBpZiAoZXZlbnQudGFyZ2V0LnNoYWRvd1Jvb3QpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5zTm9kZSA9IGV2ZW50LmNvbXBvc2VkUGF0aCgpLnNvbWUoKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiBlbGVtZW50ID09PSB0aGlzLmFuY2hvckVsZW0pO1xuXG4gICAgICBpZiAoY29udGFpbnNOb2RlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuYW5jaG9yRWxlbS5jb250YWlucyhldmVudC50YXJnZXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudG9nZ2xlU2VydmljZS5vcGVuID0gZmFsc2U7XG4gIH07XG5cbiAgcHJpdmF0ZSBhdHRhY2hPdXRzaWRlQ2xpY2tMaXN0ZW5lcigpIHtcbiAgICBpZiAodGhpcy5jbG9zZU9uT3V0c2lkZUNsaWNrICYmIHRoaXMudG9nZ2xlU2VydmljZS5vcGVuKSB7XG4gICAgICBpZiAoZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAvLyBUbyBsaXN0ZW4gb3V0c2lkZSBjbGljaywgdGhlIGxpc3RlbmVyIHNob3VsZCBjYXRjaCB0aGUgZXZlbnQgZHVyaW5nIHRoZSBjYXB0dXJpbmcgcGhhc2UuXG4gICAgICAgIC8vIFdlIGhhdmUgdG8gZG8gdGhpcyB1Z2x5IGRvY3VtZW50IGNoZWNrIGFzIFJlbmRlcmVyMi5saXN0ZW4gZG9lc24ndCBhbGxvdyBwYXNzaXZlL3VzZUNhcHR1cmUgbGlzdGVuLlxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xvc2VPbk91dHNpZGVDbGlja0NhbGxiYWNrLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRldGFjaE91dHNpZGVDbGlja0xpc3RlbmVyKCkge1xuICAgIGlmICh0aGlzLmNsb3NlT25PdXRzaWRlQ2xpY2spIHtcbiAgICAgIGlmIChkb2N1bWVudCAmJiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jbG9zZU9uT3V0c2lkZUNsaWNrQ2FsbGJhY2ssIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19
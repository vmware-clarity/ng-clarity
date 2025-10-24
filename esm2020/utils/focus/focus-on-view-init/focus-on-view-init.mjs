/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Directive, Inject, Input, PLATFORM_ID, } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FOCUS_ON_VIEW_INIT } from './focus-on-view-init.provider';
import * as i0 from "@angular/core";
/*  This directive is for guiding the document focus to the newly added content when its view is initialized
    so that assistive technologies can read its content. */
export class ClrFocusOnViewInit {
    constructor(el, platformId, focusOnViewInit, document, renderer, ngZone) {
        this.el = el;
        this.platformId = platformId;
        this.focusOnViewInit = focusOnViewInit;
        this.renderer = renderer;
        this.directFocus = true; // true if the element gets focused without need to set tabindex;
        this.destroy$ = new Subject();
        this._isEnabled = focusOnViewInit;
        // Angular compiler doesn't understand the type Document
        // when working out the metadata for injectable parameters,
        // even though it understands the injection token DOCUMENT
        // https://github.com/angular/angular/issues/20351
        this.document = document;
        ngZone.runOutsideAngular(() => fromEvent(el.nativeElement, 'focusout')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            if (!this.directFocus) {
                // manually set attributes and styles should be removed
                renderer.removeAttribute(el.nativeElement, 'tabindex');
                renderer.setStyle(el.nativeElement, 'outline', null);
            }
        }));
    }
    set isEnabled(value) {
        if (this.focusOnViewInit && typeof value === 'boolean') {
            this._isEnabled = value;
        }
    }
    ngAfterViewInit() {
        this.focus();
    }
    ngOnDestroy() {
        this.destroy$.next();
    }
    focus() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        if (!this._isEnabled) {
            return;
        }
        if (this.document && this.document.activeElement !== this.el.nativeElement) {
            this.el.nativeElement.focus();
            if (this.document.activeElement !== this.el.nativeElement) {
                // if it's not directly focused now, it means it was a non-interactive element
                // so we need to give it a tabindex.
                this.directFocus = false;
                this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '-1');
                this.renderer.setStyle(this.el.nativeElement, 'outline', 'none');
                this.el.nativeElement.focus();
            }
        }
    }
}
ClrFocusOnViewInit.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFocusOnViewInit, deps: [{ token: i0.ElementRef }, { token: PLATFORM_ID }, { token: FOCUS_ON_VIEW_INIT }, { token: DOCUMENT }, { token: i0.Renderer2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
ClrFocusOnViewInit.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrFocusOnViewInit, selector: "[clrFocusOnViewInit]", inputs: { isEnabled: ["clrFocusOnViewInit", "isEnabled"] }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFocusOnViewInit, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrFocusOnViewInit]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [FOCUS_ON_VIEW_INIT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.Renderer2 }, { type: i0.NgZone }]; }, propDecorators: { isEnabled: [{
                type: Input,
                args: ['clrFocusOnViewInit']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9jdXMtb24tdmlldy1pbml0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvdXRpbHMvZm9jdXMvZm9jdXMtb24tdmlldy1pbml0L2ZvY3VzLW9uLXZpZXctaW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM5RCxPQUFPLEVBRUwsU0FBUyxFQUVULE1BQU0sRUFDTixLQUFLLEVBR0wsV0FBVyxHQUVaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUUzQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQzs7QUFFbkU7MkRBQzJEO0FBSTNELE1BQU0sT0FBTyxrQkFBa0I7SUFNN0IsWUFDVSxFQUEyQixFQUNOLFVBQWUsRUFDUixlQUF3QixFQUMxQyxRQUFhLEVBQ3ZCLFFBQW1CLEVBQzNCLE1BQWM7UUFMTixPQUFFLEdBQUYsRUFBRSxDQUF5QjtRQUNOLGVBQVUsR0FBVixVQUFVLENBQUs7UUFDUixvQkFBZSxHQUFmLGVBQWUsQ0FBUztRQUVwRCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBVHJCLGdCQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsaUVBQWlFO1FBQ3JGLGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBV3JDLElBQUksQ0FBQyxVQUFVLEdBQUcsZUFBZSxDQUFDO1FBRWxDLHdEQUF3RDtRQUN4RCwyREFBMkQ7UUFDM0QsMERBQTBEO1FBQzFELGtEQUFrRDtRQUNsRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUV6QixNQUFNLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLENBQzVCLFNBQVMsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQzthQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUM5QixTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3JCLHVEQUF1RDtnQkFDdkQsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUN2RCxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3REO1FBQ0gsQ0FBQyxDQUFDLENBQ0wsQ0FBQztJQUNKLENBQUM7SUFFRCxJQUNJLFNBQVMsQ0FBQyxLQUF1QjtRQUNuQyxJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksT0FBTyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3RELElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVPLEtBQUs7UUFDWCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3ZDLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3BCLE9BQU87U0FDUjtRQUNELElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRTtZQUMxRSxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFO2dCQUN6RCw4RUFBOEU7Z0JBQzlFLG9DQUFvQztnQkFDcEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDcEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUNqRSxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUMvQjtTQUNGO0lBQ0gsQ0FBQzs7K0dBcEVVLGtCQUFrQiw0Q0FRbkIsV0FBVyxhQUNYLGtCQUFrQixhQUNsQixRQUFRO21HQVZQLGtCQUFrQjsyRkFBbEIsa0JBQWtCO2tCQUg5QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxzQkFBc0I7aUJBQ2pDOzswQkFTSSxNQUFNOzJCQUFDLFdBQVc7OzBCQUNsQixNQUFNOzJCQUFDLGtCQUFrQjs7MEJBQ3pCLE1BQU07MkJBQUMsUUFBUTt5RkEwQmQsU0FBUztzQkFEWixLQUFLO3VCQUFDLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRE9DVU1FTlQsIGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIFBMQVRGT1JNX0lELFxuICBSZW5kZXJlcjIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEZPQ1VTX09OX1ZJRVdfSU5JVCB9IGZyb20gJy4vZm9jdXMtb24tdmlldy1pbml0LnByb3ZpZGVyJztcblxuLyogIFRoaXMgZGlyZWN0aXZlIGlzIGZvciBndWlkaW5nIHRoZSBkb2N1bWVudCBmb2N1cyB0byB0aGUgbmV3bHkgYWRkZWQgY29udGVudCB3aGVuIGl0cyB2aWV3IGlzIGluaXRpYWxpemVkXG4gICAgc28gdGhhdCBhc3Npc3RpdmUgdGVjaG5vbG9naWVzIGNhbiByZWFkIGl0cyBjb250ZW50LiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsckZvY3VzT25WaWV3SW5pdF0nLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJGb2N1c09uVmlld0luaXQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudDtcbiAgcHJpdmF0ZSBkaXJlY3RGb2N1cyA9IHRydWU7IC8vIHRydWUgaWYgdGhlIGVsZW1lbnQgZ2V0cyBmb2N1c2VkIHdpdGhvdXQgbmVlZCB0byBzZXQgdGFiaW5kZXg7XG4gIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF9pc0VuYWJsZWQ6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnksXG4gICAgQEluamVjdChGT0NVU19PTl9WSUVXX0lOSVQpIHByaXZhdGUgZm9jdXNPblZpZXdJbml0OiBib29sZWFuLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50OiBhbnksXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIG5nWm9uZTogTmdab25lXG4gICkge1xuICAgIHRoaXMuX2lzRW5hYmxlZCA9IGZvY3VzT25WaWV3SW5pdDtcblxuICAgIC8vIEFuZ3VsYXIgY29tcGlsZXIgZG9lc24ndCB1bmRlcnN0YW5kIHRoZSB0eXBlIERvY3VtZW50XG4gICAgLy8gd2hlbiB3b3JraW5nIG91dCB0aGUgbWV0YWRhdGEgZm9yIGluamVjdGFibGUgcGFyYW1ldGVycyxcbiAgICAvLyBldmVuIHRob3VnaCBpdCB1bmRlcnN0YW5kcyB0aGUgaW5qZWN0aW9uIHRva2VuIERPQ1VNRU5UXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjAzNTFcbiAgICB0aGlzLmRvY3VtZW50ID0gZG9jdW1lbnQ7XG5cbiAgICBuZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT5cbiAgICAgIGZyb21FdmVudChlbC5uYXRpdmVFbGVtZW50LCAnZm9jdXNvdXQnKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5kaXJlY3RGb2N1cykge1xuICAgICAgICAgICAgLy8gbWFudWFsbHkgc2V0IGF0dHJpYnV0ZXMgYW5kIHN0eWxlcyBzaG91bGQgYmUgcmVtb3ZlZFxuICAgICAgICAgICAgcmVuZGVyZXIucmVtb3ZlQXR0cmlidXRlKGVsLm5hdGl2ZUVsZW1lbnQsICd0YWJpbmRleCcpO1xuICAgICAgICAgICAgcmVuZGVyZXIuc2V0U3R5bGUoZWwubmF0aXZlRWxlbWVudCwgJ291dGxpbmUnLCBudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyRm9jdXNPblZpZXdJbml0JylcbiAgc2V0IGlzRW5hYmxlZCh2YWx1ZTogYm9vbGVhbiB8IHN0cmluZykge1xuICAgIGlmICh0aGlzLmZvY3VzT25WaWV3SW5pdCAmJiB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJykge1xuICAgICAgdGhpcy5faXNFbmFibGVkID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuZm9jdXMoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBmb2N1cygpIHtcbiAgICBpZiAoIWlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9pc0VuYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuZG9jdW1lbnQgJiYgdGhpcy5kb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgaWYgKHRoaXMuZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gdGhpcy5lbC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgIC8vIGlmIGl0J3Mgbm90IGRpcmVjdGx5IGZvY3VzZWQgbm93LCBpdCBtZWFucyBpdCB3YXMgYSBub24taW50ZXJhY3RpdmUgZWxlbWVudFxuICAgICAgICAvLyBzbyB3ZSBuZWVkIHRvIGdpdmUgaXQgYSB0YWJpbmRleC5cbiAgICAgICAgdGhpcy5kaXJlY3RGb2N1cyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd0YWJpbmRleCcsICctMScpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ291dGxpbmUnLCAnbm9uZScpO1xuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==
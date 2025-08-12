/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Directive, HostListener, Inject, Input, PLATFORM_ID, } from '@angular/core';
import { ClarityIcons, timesIcon } from '@cds/core/icon';
import { filter } from 'rxjs/operators';
import { commonStringsDefault } from '../../utils';
import { LARGE_BREAKPOINT } from '../../utils/breakpoints/breakpoints';
import { ClrStandaloneCdkTrapFocus } from '../../utils/focus/focus-trap';
import { ResponsiveNavCodes } from './responsive-nav-codes';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/focus/focus-trap";
import * as i2 from "./providers/responsive-navigation.service";
import * as i3 from "../../utils/focus/focus-trap/standalone-cdk-trap-focus.directive";
const createCloseButton = (document, ariaLabel) => {
    ClarityIcons.addIcons(timesIcon);
    const closeButton = document.createElement('button');
    closeButton.setAttribute('aria-label', ariaLabel);
    closeButton.setAttribute('aria-hidden', 'true');
    closeButton.innerHTML = `
    <cds-icon
      inner-offset="1"
      shape="times"
      size="32"
    ></cds-icon>
  `;
    /**
     * The button is hidden by default based on our Desktop-first approach.
     */
    closeButton.setAttribute('hidden', 'true');
    closeButton.className = 'clr-nav-close';
    return closeButton;
};
export class ClrNavLevel {
    constructor(platformId, cdkTrapFocus, responsiveNavService, elementRef, renderer, injector) {
        this.cdkTrapFocus = cdkTrapFocus;
        this.responsiveNavService = responsiveNavService;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this._isOpen = false;
        if (isPlatformBrowser(platformId)) {
            this._document = injector.get(DOCUMENT);
        }
        this._subscription = responsiveNavService.navControl
            .pipe(filter(x => x.navLevel === this.level), filter(({ controlCode }) => (controlCode === ResponsiveNavCodes.NAV_OPEN && !this.isOpen) ||
            (controlCode === ResponsiveNavCodes.NAV_CLOSE && this.isOpen)))
            .subscribe(({ controlCode }) => {
            if (controlCode === ResponsiveNavCodes.NAV_OPEN) {
                this.open();
                return;
            }
            this.close();
        });
        this._subscription.add(responsiveNavService.navControl
            .pipe(filter(({ controlCode }) => controlCode === ResponsiveNavCodes.NAV_CLOSE_ALL))
            .subscribe(() => this.close()));
    }
    get level() {
        return this._level;
    }
    // getter to access the responsive navigation codes from the template
    get responsiveNavCodes() {
        return ResponsiveNavCodes;
    }
    get isOpen() {
        return this._isOpen;
    }
    ngOnInit() {
        this.cdkTrapFocus.enabled = false;
        if (!this.closeButtonAriaLabel) {
            this.closeButtonAriaLabel =
                this._level === ResponsiveNavCodes.NAV_LEVEL_1
                    ? commonStringsDefault.responsiveNavToggleClose
                    : commonStringsDefault.responsiveNavOverflowClose;
        }
        if (this.level !== ResponsiveNavCodes.NAV_LEVEL_1 && this.level !== ResponsiveNavCodes.NAV_LEVEL_2) {
            console.error('Nav Level can only be 1 or 2');
            return;
        }
        this.responsiveNavService.registerNav(this.level);
        this.addNavClass(this.level);
    }
    ngAfterViewInit() {
        const closeButton = createCloseButton(this._document, this.closeButtonAriaLabel);
        this.renderer.listen(closeButton, 'click', this.close.bind(this));
        this.renderer.insertBefore(this.elementRef.nativeElement, closeButton, this.elementRef.nativeElement.firstChild); // Adding the button at the top of the nav
        if (this._document.body.clientWidth < LARGE_BREAKPOINT) {
            /**
             * Close if the document body is smaller than the large breakpoint for example:
             * - Refreshing the page
             * - Browser window size is changed when opening the applicaiton
             * - Browser zoom is turned on and zoomed to a size that makes the document smaller than the large breakpoint
             */
            this.close();
        }
    }
    ngOnDestroy() {
        this.responsiveNavService.unregisterNav(this.level);
        this._subscription.unsubscribe();
    }
    onResize(event) {
        const target = event.target;
        if (target.innerWidth < LARGE_BREAKPOINT && this.isOpen) {
            this.close();
            return;
        }
        this.showNavigation();
    }
    // TODO: Figure out whats the best way to do this. Possible methods
    // 1. HostListener (current solution)
    // 2. Directives on the .nav-link class. We discussed on moving away from class selectors but I forget the reason
    // why
    onMouseClick(target) {
        let current = target; // Get the element in the DOM on which the mouse was clicked
        const navHost = this.elementRef.nativeElement; // Get the current nav native HTML element
        // Start checking if current and navHost are equal.
        // If not traverse to the parentNode and check again.
        while (current) {
            if (current === navHost) {
                return;
            }
            else if (current.classList.contains('nav-link') && this._document.body.clientWidth < LARGE_BREAKPOINT) {
                this.close();
                return;
            }
            current = current.parentNode;
        }
    }
    addNavClass(level) {
        const navHostClassList = this.elementRef.nativeElement.classList;
        if (level === ResponsiveNavCodes.NAV_LEVEL_1) {
            navHostClassList.add(ResponsiveNavCodes.NAV_CLASS_LEVEL_1);
        }
        else if (level === ResponsiveNavCodes.NAV_LEVEL_2) {
            navHostClassList.add(ResponsiveNavCodes.NAV_CLASS_LEVEL_2);
        }
    }
    open() {
        this._isOpen = true;
        this.showNavigation();
        this.cdkTrapFocus.enabled = true;
        this.showCloseButton();
        this.responsiveNavService.sendControlMessage(ResponsiveNavCodes.NAV_OPEN, this.level);
    }
    close() {
        this._isOpen = false;
        this.hideNavigation();
        this.cdkTrapFocus.enabled = false;
        this.hideCloseButton();
        this.responsiveNavService.sendControlMessage(ResponsiveNavCodes.NAV_CLOSE, this.level);
    }
    hideNavigation() {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-hidden', 'true');
        this.renderer.setAttribute(this.elementRef.nativeElement, 'hidden', 'true');
    }
    showNavigation() {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-hidden', 'false');
        this.renderer.removeAttribute(this.elementRef.nativeElement, 'hidden');
    }
    hideCloseButton() {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-hidden', 'true');
        this.renderer.setAttribute(this.elementRef.nativeElement.querySelector('.clr-nav-close'), 'hidden', 'true');
    }
    showCloseButton() {
        this.renderer.setAttribute(this.elementRef.nativeElement.querySelector('.clr-nav-close'), 'aria-hidden', 'false');
        this.renderer.removeAttribute(this.elementRef.nativeElement.querySelector('.clr-nav-close'), 'hidden');
    }
}
ClrNavLevel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrNavLevel, deps: [{ token: PLATFORM_ID }, { token: i1.ClrStandaloneCdkTrapFocus }, { token: i2.ResponsiveNavigationService }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.Injector }], target: i0.ɵɵFactoryTarget.Directive });
ClrNavLevel.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrNavLevel, selector: "[clr-nav-level]", inputs: { _level: ["clr-nav-level", "_level"], closeButtonAriaLabel: ["closeAriaLabel", "closeButtonAriaLabel"] }, host: { listeners: { "window:resize": "onResize($event)", "click": "onMouseClick($event.target)" } }, hostDirectives: [{ directive: i3.ClrStandaloneCdkTrapFocus }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrNavLevel, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clr-nav-level]',
                    hostDirectives: [ClrStandaloneCdkTrapFocus],
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i1.ClrStandaloneCdkTrapFocus }, { type: i2.ResponsiveNavigationService }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.Injector }]; }, propDecorators: { _level: [{
                type: Input,
                args: ['clr-nav-level']
            }], closeButtonAriaLabel: [{
                type: Input,
                args: ['closeAriaLabel']
            }], onResize: [{
                type: HostListener,
                args: ['window:resize', ['$event']]
            }], onMouseClick: [{
                type: HostListener,
                args: ['click', ['$event.target']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LWxldmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvbGF5b3V0L25hdi9uYXYtbGV2ZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDOUQsT0FBTyxFQUNMLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUVOLEtBQUssRUFFTCxXQUFXLEdBRVosTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6RCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRXpFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDOzs7OztBQUU1RCxNQUFNLGlCQUFpQixHQUFHLENBQUMsUUFBa0IsRUFBRSxTQUFpQixFQUFFLEVBQUU7SUFDbEUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUVqQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3JELFdBQVcsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2xELFdBQVcsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2hELFdBQVcsQ0FBQyxTQUFTLEdBQUc7Ozs7OztHQU12QixDQUFDO0lBQ0Y7O09BRUc7SUFDSCxXQUFXLENBQUMsWUFB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QUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5RyxDQUFDO0lBRVMsZUFBZTtRQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEgsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDekcsQ0FBQzs7d0dBOUtVLFdBQVcsa0JBU1osV0FBVzs0RkFUVixXQUFXOzJGQUFYLFdBQVc7a0JBSnZCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsY0FBYyxFQUFFLENBQUMseUJBQXlCLENBQUM7aUJBQzVDOzswQkFVSSxNQUFNOzJCQUFDLFdBQVc7c01BUkcsTUFBTTtzQkFBN0IsS0FBSzt1QkFBQyxlQUFlO2dCQUNHLG9CQUFvQjtzQkFBNUMsS0FBSzt1QkFBQyxnQkFBZ0I7Z0JBZ0d2QixRQUFRO3NCQURQLFlBQVk7dUJBQUMsZUFBZSxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQWlCekMsWUFBWTtzQkFEWCxZQUFZO3VCQUFDLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRE9DVU1FTlQsIGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSG9zdExpc3RlbmVyLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgT25Jbml0LFxuICBQTEFURk9STV9JRCxcbiAgUmVuZGVyZXIyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENsYXJpdHlJY29ucywgdGltZXNJY29uIH0gZnJvbSAnQGNkcy9jb3JlL2ljb24nO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IGNvbW1vblN0cmluZ3NEZWZhdWx0IH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgTEFSR0VfQlJFQUtQT0lOVCB9IGZyb20gJy4uLy4uL3V0aWxzL2JyZWFrcG9pbnRzL2JyZWFrcG9pbnRzJztcbmltcG9ydCB7IENsclN0YW5kYWxvbmVDZGtUcmFwRm9jdXMgfSBmcm9tICcuLi8uLi91dGlscy9mb2N1cy9mb2N1cy10cmFwJztcbmltcG9ydCB7IFJlc3BvbnNpdmVOYXZpZ2F0aW9uU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3Jlc3BvbnNpdmUtbmF2aWdhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IFJlc3BvbnNpdmVOYXZDb2RlcyB9IGZyb20gJy4vcmVzcG9uc2l2ZS1uYXYtY29kZXMnO1xuXG5jb25zdCBjcmVhdGVDbG9zZUJ1dHRvbiA9IChkb2N1bWVudDogRG9jdW1lbnQsIGFyaWFMYWJlbDogc3RyaW5nKSA9PiB7XG4gIENsYXJpdHlJY29ucy5hZGRJY29ucyh0aW1lc0ljb24pO1xuXG4gIGNvbnN0IGNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNsb3NlQnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGFyaWFMYWJlbCk7XG4gIGNsb3NlQnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICBjbG9zZUJ1dHRvbi5pbm5lckhUTUwgPSBgXG4gICAgPGNkcy1pY29uXG4gICAgICBpbm5lci1vZmZzZXQ9XCIxXCJcbiAgICAgIHNoYXBlPVwidGltZXNcIlxuICAgICAgc2l6ZT1cIjMyXCJcbiAgICA+PC9jZHMtaWNvbj5cbiAgYDtcbiAgLyoqXG4gICAqIFRoZSBidXR0b24gaXMgaGlkZGVuIGJ5IGRlZmF1bHQgYmFzZWQgb24gb3VyIERlc2t0b3AtZmlyc3QgYXBwcm9hY2guXG4gICAqL1xuICBjbG9zZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICd0cnVlJyk7XG4gIGNsb3NlQnV0dG9uLmNsYXNzTmFtZSA9ICdjbHItbmF2LWNsb3NlJztcbiAgcmV0dXJuIGNsb3NlQnV0dG9uO1xufTtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2Nsci1uYXYtbGV2ZWxdJyxcbiAgaG9zdERpcmVjdGl2ZXM6IFtDbHJTdGFuZGFsb25lQ2RrVHJhcEZvY3VzXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyTmF2TGV2ZWwgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoJ2Nsci1uYXYtbGV2ZWwnKSBfbGV2ZWw6IG51bWJlcjtcbiAgQElucHV0KCdjbG9zZUFyaWFMYWJlbCcpIGNsb3NlQnV0dG9uQXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfaXNPcGVuID0gZmFsc2U7XG4gIHByaXZhdGUgX2RvY3VtZW50OiBEb2N1bWVudDtcbiAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcGxhdGZvcm1JZDogYW55LFxuICAgIHByaXZhdGUgY2RrVHJhcEZvY3VzOiBDbHJTdGFuZGFsb25lQ2RrVHJhcEZvY3VzLFxuICAgIHByaXZhdGUgcmVzcG9uc2l2ZU5hdlNlcnZpY2U6IFJlc3BvbnNpdmVOYXZpZ2F0aW9uU2VydmljZSxcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpKSB7XG4gICAgICB0aGlzLl9kb2N1bWVudCA9IGluamVjdG9yLmdldChET0NVTUVOVCk7XG4gICAgfVxuXG4gICAgdGhpcy5fc3Vic2NyaXB0aW9uID0gcmVzcG9uc2l2ZU5hdlNlcnZpY2UubmF2Q29udHJvbFxuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcih4ID0+IHgubmF2TGV2ZWwgPT09IHRoaXMubGV2ZWwpLFxuICAgICAgICBmaWx0ZXIoXG4gICAgICAgICAgKHsgY29udHJvbENvZGUgfSkgPT5cbiAgICAgICAgICAgIChjb250cm9sQ29kZSA9PT0gUmVzcG9uc2l2ZU5hdkNvZGVzLk5BVl9PUEVOICYmICF0aGlzLmlzT3BlbikgfHxcbiAgICAgICAgICAgIChjb250cm9sQ29kZSA9PT0gUmVzcG9uc2l2ZU5hdkNvZGVzLk5BVl9DTE9TRSAmJiB0aGlzLmlzT3BlbilcbiAgICAgICAgKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoeyBjb250cm9sQ29kZSB9KSA9PiB7XG4gICAgICAgIGlmIChjb250cm9sQ29kZSA9PT0gUmVzcG9uc2l2ZU5hdkNvZGVzLk5BVl9PUEVOKSB7XG4gICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfSk7XG5cbiAgICB0aGlzLl9zdWJzY3JpcHRpb24uYWRkKFxuICAgICAgcmVzcG9uc2l2ZU5hdlNlcnZpY2UubmF2Q29udHJvbFxuICAgICAgICAucGlwZShmaWx0ZXIoKHsgY29udHJvbENvZGUgfSkgPT4gY29udHJvbENvZGUgPT09IFJlc3BvbnNpdmVOYXZDb2Rlcy5OQVZfQ0xPU0VfQUxMKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLmNsb3NlKCkpXG4gICAgKTtcbiAgfVxuXG4gIGdldCBsZXZlbCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9sZXZlbDtcbiAgfVxuXG4gIC8vIGdldHRlciB0byBhY2Nlc3MgdGhlIHJlc3BvbnNpdmUgbmF2aWdhdGlvbiBjb2RlcyBmcm9tIHRoZSB0ZW1wbGF0ZVxuICBnZXQgcmVzcG9uc2l2ZU5hdkNvZGVzKCk6IFJlc3BvbnNpdmVOYXZDb2RlcyB7XG4gICAgcmV0dXJuIFJlc3BvbnNpdmVOYXZDb2RlcztcbiAgfVxuXG4gIGdldCBpc09wZW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzT3BlbjtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuY2RrVHJhcEZvY3VzLmVuYWJsZWQgPSBmYWxzZTtcblxuICAgIGlmICghdGhpcy5jbG9zZUJ1dHRvbkFyaWFMYWJlbCkge1xuICAgICAgdGhpcy5jbG9zZUJ1dHRvbkFyaWFMYWJlbCA9XG4gICAgICAgIHRoaXMuX2xldmVsID09PSBSZXNwb25zaXZlTmF2Q29kZXMuTkFWX0xFVkVMXzFcbiAgICAgICAgICA/IGNvbW1vblN0cmluZ3NEZWZhdWx0LnJlc3BvbnNpdmVOYXZUb2dnbGVDbG9zZVxuICAgICAgICAgIDogY29tbW9uU3RyaW5nc0RlZmF1bHQucmVzcG9uc2l2ZU5hdk92ZXJmbG93Q2xvc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubGV2ZWwgIT09IFJlc3BvbnNpdmVOYXZDb2Rlcy5OQVZfTEVWRUxfMSAmJiB0aGlzLmxldmVsICE9PSBSZXNwb25zaXZlTmF2Q29kZXMuTkFWX0xFVkVMXzIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ05hdiBMZXZlbCBjYW4gb25seSBiZSAxIG9yIDInKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5yZXNwb25zaXZlTmF2U2VydmljZS5yZWdpc3Rlck5hdih0aGlzLmxldmVsKTtcbiAgICB0aGlzLmFkZE5hdkNsYXNzKHRoaXMubGV2ZWwpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGNvbnN0IGNsb3NlQnV0dG9uID0gY3JlYXRlQ2xvc2VCdXR0b24odGhpcy5fZG9jdW1lbnQsIHRoaXMuY2xvc2VCdXR0b25BcmlhTGFiZWwpO1xuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGNsb3NlQnV0dG9uLCAnY2xpY2snLCB0aGlzLmNsb3NlLmJpbmQodGhpcykpO1xuICAgIHRoaXMucmVuZGVyZXIuaW5zZXJ0QmVmb3JlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBjbG9zZUJ1dHRvbiwgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZmlyc3RDaGlsZCk7IC8vIEFkZGluZyB0aGUgYnV0dG9uIGF0IHRoZSB0b3Agb2YgdGhlIG5hdlxuXG4gICAgaWYgKHRoaXMuX2RvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggPCBMQVJHRV9CUkVBS1BPSU5UKSB7XG4gICAgICAvKipcbiAgICAgICAqIENsb3NlIGlmIHRoZSBkb2N1bWVudCBib2R5IGlzIHNtYWxsZXIgdGhhbiB0aGUgbGFyZ2UgYnJlYWtwb2ludCBmb3IgZXhhbXBsZTpcbiAgICAgICAqIC0gUmVmcmVzaGluZyB0aGUgcGFnZVxuICAgICAgICogLSBCcm93c2VyIHdpbmRvdyBzaXplIGlzIGNoYW5nZWQgd2hlbiBvcGVuaW5nIHRoZSBhcHBsaWNhaXRvblxuICAgICAgICogLSBCcm93c2VyIHpvb20gaXMgdHVybmVkIG9uIGFuZCB6b29tZWQgdG8gYSBzaXplIHRoYXQgbWFrZXMgdGhlIGRvY3VtZW50IHNtYWxsZXIgdGhhbiB0aGUgbGFyZ2UgYnJlYWtwb2ludFxuICAgICAgICovXG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5yZXNwb25zaXZlTmF2U2VydmljZS51bnJlZ2lzdGVyTmF2KHRoaXMubGV2ZWwpO1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScsIFsnJGV2ZW50J10pXG4gIG9uUmVzaXplKGV2ZW50OiBFdmVudCkge1xuICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBXaW5kb3c7XG5cbiAgICBpZiAodGFyZ2V0LmlubmVyV2lkdGggPCBMQVJHRV9CUkVBS1BPSU5UICYmIHRoaXMuaXNPcGVuKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zaG93TmF2aWdhdGlvbigpO1xuICB9XG5cbiAgLy8gVE9ETzogRmlndXJlIG91dCB3aGF0cyB0aGUgYmVzdCB3YXkgdG8gZG8gdGhpcy4gUG9zc2libGUgbWV0aG9kc1xuICAvLyAxLiBIb3N0TGlzdGVuZXIgKGN1cnJlbnQgc29sdXRpb24pXG4gIC8vIDIuIERpcmVjdGl2ZXMgb24gdGhlIC5uYXYtbGluayBjbGFzcy4gV2UgZGlzY3Vzc2VkIG9uIG1vdmluZyBhd2F5IGZyb20gY2xhc3Mgc2VsZWN0b3JzIGJ1dCBJIGZvcmdldCB0aGUgcmVhc29uXG4gIC8vIHdoeVxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50LnRhcmdldCddKVxuICBvbk1vdXNlQ2xpY2sodGFyZ2V0OiBhbnkpIHtcbiAgICBsZXQgY3VycmVudDogYW55ID0gdGFyZ2V0OyAvLyBHZXQgdGhlIGVsZW1lbnQgaW4gdGhlIERPTSBvbiB3aGljaCB0aGUgbW91c2Ugd2FzIGNsaWNrZWRcbiAgICBjb25zdCBuYXZIb3N0OiBhbnkgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDsgLy8gR2V0IHRoZSBjdXJyZW50IG5hdiBuYXRpdmUgSFRNTCBlbGVtZW50XG5cbiAgICAvLyBTdGFydCBjaGVja2luZyBpZiBjdXJyZW50IGFuZCBuYXZIb3N0IGFyZSBlcXVhbC5cbiAgICAvLyBJZiBub3QgdHJhdmVyc2UgdG8gdGhlIHBhcmVudE5vZGUgYW5kIGNoZWNrIGFnYWluLlxuICAgIHdoaWxlIChjdXJyZW50KSB7XG4gICAgICBpZiAoY3VycmVudCA9PT0gbmF2SG9zdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCduYXYtbGluaycpICYmIHRoaXMuX2RvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggPCBMQVJHRV9CUkVBS1BPSU5UKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50Tm9kZTtcbiAgICB9XG4gIH1cblxuICBhZGROYXZDbGFzcyhsZXZlbDogbnVtYmVyKSB7XG4gICAgY29uc3QgbmF2SG9zdENsYXNzTGlzdCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdDtcbiAgICBpZiAobGV2ZWwgPT09IFJlc3BvbnNpdmVOYXZDb2Rlcy5OQVZfTEVWRUxfMSkge1xuICAgICAgbmF2SG9zdENsYXNzTGlzdC5hZGQoUmVzcG9uc2l2ZU5hdkNvZGVzLk5BVl9DTEFTU19MRVZFTF8xKTtcbiAgICB9IGVsc2UgaWYgKGxldmVsID09PSBSZXNwb25zaXZlTmF2Q29kZXMuTkFWX0xFVkVMXzIpIHtcbiAgICAgIG5hdkhvc3RDbGFzc0xpc3QuYWRkKFJlc3BvbnNpdmVOYXZDb2Rlcy5OQVZfQ0xBU1NfTEVWRUxfMik7XG4gICAgfVxuICB9XG5cbiAgb3BlbigpOiB2b2lkIHtcbiAgICB0aGlzLl9pc09wZW4gPSB0cnVlO1xuICAgIHRoaXMuc2hvd05hdmlnYXRpb24oKTtcbiAgICB0aGlzLmNka1RyYXBGb2N1cy5lbmFibGVkID0gdHJ1ZTtcbiAgICB0aGlzLnNob3dDbG9zZUJ1dHRvbigpO1xuICAgIHRoaXMucmVzcG9uc2l2ZU5hdlNlcnZpY2Uuc2VuZENvbnRyb2xNZXNzYWdlKFJlc3BvbnNpdmVOYXZDb2Rlcy5OQVZfT1BFTiwgdGhpcy5sZXZlbCk7XG4gIH1cblxuICBjbG9zZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9pc09wZW4gPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVOYXZpZ2F0aW9uKCk7XG4gICAgdGhpcy5jZGtUcmFwRm9jdXMuZW5hYmxlZCA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZUNsb3NlQnV0dG9uKCk7XG4gICAgdGhpcy5yZXNwb25zaXZlTmF2U2VydmljZS5zZW5kQ29udHJvbE1lc3NhZ2UoUmVzcG9uc2l2ZU5hdkNvZGVzLk5BVl9DTE9TRSwgdGhpcy5sZXZlbCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaGlkZU5hdmlnYXRpb24oKSB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdoaWRkZW4nLCAndHJ1ZScpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNob3dOYXZpZ2F0aW9uKCkge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2hpZGRlbicpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGhpZGVDbG9zZUJ1dHRvbigpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuY2xyLW5hdi1jbG9zZScpLCAnaGlkZGVuJywgJ3RydWUnKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzaG93Q2xvc2VCdXR0b24oKSB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNsci1uYXYtY2xvc2UnKSwgJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG4gICAgdGhpcy5yZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNsci1uYXYtY2xvc2UnKSwgJ2hpZGRlbicpO1xuICB9XG59XG4iXX0=
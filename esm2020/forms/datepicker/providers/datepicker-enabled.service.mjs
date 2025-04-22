/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { DATEPICKER_ENABLE_BREAKPOINT } from '../../../utils/breakpoints/breakpoints';
import { MOBILE_USERAGENT_REGEX } from '../utils/constants';
import * as i0 from "@angular/core";
export class DatepickerEnabledService {
    constructor(_document) {
        this._document = _document;
        this._isUserAgentMobile = false;
        if (_document) {
            this._isUserAgentMobile = MOBILE_USERAGENT_REGEX.test(_document.defaultView.navigator.userAgent);
            this._innerWidth = _document.defaultView.innerWidth;
        }
    }
    /**
     * Returns if the calendar should be active or not.
     * If the user agent is mobile and the screen width is less than DATEPICKER_ACTIVE_BREAKPOINT
     * then the calendar is inactive.
     */
    get isEnabled() {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
        // What they recommend is:
        //"In summary, we recommend looking for the string 'Mobi'
        // anywhere in the User Agent to detect a mobile device."
        if (this._document) {
            if (this._innerWidth < DATEPICKER_ENABLE_BREAKPOINT && this._isUserAgentMobile) {
                return false;
            }
        }
        return true;
    }
}
DatepickerEnabledService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatepickerEnabledService, deps: [{ token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
DatepickerEnabledService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatepickerEnabledService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatepickerEnabledService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1lbmFibGVkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9kYXRlcGlja2VyL3Byb3ZpZGVycy9kYXRlcGlja2VyLWVuYWJsZWQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVuRCxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUN0RixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQzs7QUFHNUQsTUFBTSxPQUFPLHdCQUF3QjtJQUluQyxZQUFzQyxTQUFjO1FBQWQsY0FBUyxHQUFULFNBQVMsQ0FBSztRQUg1Qyx1QkFBa0IsR0FBRyxLQUFLLENBQUM7UUFJakMsSUFBSSxTQUFTLEVBQUU7WUFDYixJQUFJLENBQUMsa0JBQWtCLEdBQUcsc0JBQXNCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2pHLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7U0FDckQ7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILElBQUksU0FBUztRQUNYLDJGQUEyRjtRQUMzRiwwQkFBMEI7UUFDMUIseURBQXlEO1FBQ3pELHlEQUF5RDtRQUN6RCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLDRCQUE0QixJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtnQkFDOUUsT0FBTyxLQUFLLENBQUM7YUFDZDtTQUNGO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDOztxSEEzQlUsd0JBQXdCLGtCQUlmLFFBQVE7eUhBSmpCLHdCQUF3QjsyRkFBeEIsd0JBQXdCO2tCQURwQyxVQUFVOzswQkFLSSxNQUFNOzJCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEQVRFUElDS0VSX0VOQUJMRV9CUkVBS1BPSU5UIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvYnJlYWtwb2ludHMvYnJlYWtwb2ludHMnO1xuaW1wb3J0IHsgTU9CSUxFX1VTRVJBR0VOVF9SRUdFWCB9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEYXRlcGlja2VyRW5hYmxlZFNlcnZpY2Uge1xuICBwcml2YXRlIF9pc1VzZXJBZ2VudE1vYmlsZSA9IGZhbHNlO1xuICBwcml2YXRlIF9pbm5lcldpZHRoOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSkge1xuICAgIGlmIChfZG9jdW1lbnQpIHtcbiAgICAgIHRoaXMuX2lzVXNlckFnZW50TW9iaWxlID0gTU9CSUxFX1VTRVJBR0VOVF9SRUdFWC50ZXN0KF9kb2N1bWVudC5kZWZhdWx0Vmlldy5uYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgIHRoaXMuX2lubmVyV2lkdGggPSBfZG9jdW1lbnQuZGVmYXVsdFZpZXcuaW5uZXJXaWR0aDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBpZiB0aGUgY2FsZW5kYXIgc2hvdWxkIGJlIGFjdGl2ZSBvciBub3QuXG4gICAqIElmIHRoZSB1c2VyIGFnZW50IGlzIG1vYmlsZSBhbmQgdGhlIHNjcmVlbiB3aWR0aCBpcyBsZXNzIHRoYW4gREFURVBJQ0tFUl9BQ1RJVkVfQlJFQUtQT0lOVFxuICAgKiB0aGVuIHRoZSBjYWxlbmRhciBpcyBpbmFjdGl2ZS5cbiAgICovXG4gIGdldCBpc0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSFRUUC9Ccm93c2VyX2RldGVjdGlvbl91c2luZ190aGVfdXNlcl9hZ2VudFxuICAgIC8vIFdoYXQgdGhleSByZWNvbW1lbmQgaXM6XG4gICAgLy9cIkluIHN1bW1hcnksIHdlIHJlY29tbWVuZCBsb29raW5nIGZvciB0aGUgc3RyaW5nICdNb2JpJ1xuICAgIC8vIGFueXdoZXJlIGluIHRoZSBVc2VyIEFnZW50IHRvIGRldGVjdCBhIG1vYmlsZSBkZXZpY2UuXCJcbiAgICBpZiAodGhpcy5fZG9jdW1lbnQpIHtcbiAgICAgIGlmICh0aGlzLl9pbm5lcldpZHRoIDwgREFURVBJQ0tFUl9FTkFCTEVfQlJFQUtQT0lOVCAmJiB0aGlzLl9pc1VzZXJBZ2VudE1vYmlsZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG4iXX0=
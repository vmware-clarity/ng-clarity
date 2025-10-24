/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { filter, first } from 'rxjs/operators';
import * as i0 from "@angular/core";
/**
 * This service focuses the day that is focusable in the calendar.
 */
export class DatepickerFocusService {
    constructor(_ngZone, platformId) {
        this._ngZone = _ngZone;
        this.platformId = platformId;
    }
    focusCell(elRef) {
        this._ngZone.runOutsideAngular(() => {
            this.ngZoneIsStableInBrowser().subscribe(() => {
                const focusEl = elRef.nativeElement.querySelector('[tabindex="0"]');
                if (focusEl) {
                    focusEl.focus();
                }
            });
        });
    }
    focusInput(element) {
        this._ngZone.runOutsideAngular(() => this.ngZoneIsStableInBrowser().subscribe(() => element.focus()));
    }
    elementIsFocused(element) {
        return isPlatformBrowser(this.platformId) && document.activeElement === element;
    }
    ngZoneIsStableInBrowser() {
        // Credit: Material: https://github.com/angular/material2/blob/master/src/lib/datepicker/calendar.ts
        return this._ngZone.onStable.asObservable().pipe(first(), filter(() => isPlatformBrowser(this.platformId)));
    }
}
DatepickerFocusService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatepickerFocusService, deps: [{ token: i0.NgZone }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
DatepickerFocusService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatepickerFocusService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatepickerFocusService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1mb2N1cy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvZGF0ZXBpY2tlci9wcm92aWRlcnMvZGF0ZXBpY2tlci1mb2N1cy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUFjLE1BQU0sRUFBRSxVQUFVLEVBQVUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7O0FBRS9DOztHQUVHO0FBRUgsTUFBTSxPQUFPLHNCQUFzQjtJQUNqQyxZQUFvQixPQUFlLEVBQStCLFVBQWU7UUFBN0QsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUErQixlQUFVLEdBQVYsVUFBVSxDQUFLO0lBQUcsQ0FBQztJQUVyRixTQUFTLENBQUMsS0FBOEI7UUFDdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDbEMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDNUMsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQWMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDakYsSUFBSSxPQUFPLEVBQUU7b0JBQ1gsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUNqQjtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsVUFBVSxDQUFDLE9BQXlCO1FBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDeEcsQ0FBQztJQUVELGdCQUFnQixDQUFDLE9BQXlCO1FBQ3hDLE9BQU8saUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxhQUFhLEtBQUssT0FBTyxDQUFDO0lBQ2xGLENBQUM7SUFFTyx1QkFBdUI7UUFDN0Isb0dBQW9HO1FBQ3BHLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUM5QyxLQUFLLEVBQUUsRUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQ2pELENBQUM7SUFDSixDQUFDOzttSEE1QlUsc0JBQXNCLHdDQUNZLFdBQVc7dUhBRDdDLHNCQUFzQjsyRkFBdEIsc0JBQXNCO2tCQURsQyxVQUFVOzswQkFFNkIsTUFBTTsyQkFBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBFbGVtZW50UmVmLCBJbmplY3QsIEluamVjdGFibGUsIE5nWm9uZSwgUExBVEZPUk1fSUQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGZpbHRlciwgZmlyc3QgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbi8qKlxuICogVGhpcyBzZXJ2aWNlIGZvY3VzZXMgdGhlIGRheSB0aGF0IGlzIGZvY3VzYWJsZSBpbiB0aGUgY2FsZW5kYXIuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEYXRlcGlja2VyRm9jdXNTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogYW55KSB7fVxuXG4gIGZvY3VzQ2VsbChlbFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pOiB2b2lkIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5uZ1pvbmVJc1N0YWJsZUluQnJvd3NlcigpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZvY3VzRWwgPSBlbFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbdGFiaW5kZXg9XCIwXCJdJyk7XG4gICAgICAgIGlmIChmb2N1c0VsKSB7XG4gICAgICAgICAgZm9jdXNFbC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZvY3VzSW5wdXQoZWxlbWVudDogSFRNTElucHV0RWxlbWVudCk6IHZvaWQge1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB0aGlzLm5nWm9uZUlzU3RhYmxlSW5Ccm93c2VyKCkuc3Vic2NyaWJlKCgpID0+IGVsZW1lbnQuZm9jdXMoKSkpO1xuICB9XG5cbiAgZWxlbWVudElzRm9jdXNlZChlbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50KSB7XG4gICAgcmV0dXJuIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZWxlbWVudDtcbiAgfVxuXG4gIHByaXZhdGUgbmdab25lSXNTdGFibGVJbkJyb3dzZXIoKSB7XG4gICAgLy8gQ3JlZGl0OiBNYXRlcmlhbDogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvbWF0ZXJpYWwyL2Jsb2IvbWFzdGVyL3NyYy9saWIvZGF0ZXBpY2tlci9jYWxlbmRhci50c1xuICAgIHJldHVybiB0aGlzLl9uZ1pvbmUub25TdGFibGUuYXNPYnNlcnZhYmxlKCkucGlwZShcbiAgICAgIGZpcnN0KCksXG4gICAgICBmaWx0ZXIoKCkgPT4gaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSlcbiAgICApO1xuICB9XG59XG4iXX0=
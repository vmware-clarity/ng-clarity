/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ClrDateInputBase } from './date-input';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import * as i0 from "@angular/core";
export class ClrDateInput extends ClrDateInputBase {
    constructor() {
        super(...arguments);
        this.dateChange = new EventEmitter(false);
    }
    set date(date) {
        this.setDate(date);
    }
    set min(dateString) {
        this.dateIOService.setMinDate(dateString);
        this.triggerControlValidation();
    }
    set max(dateString) {
        this.dateIOService.setMaxDate(dateString);
        this.triggerControlValidation();
    }
    get userSelectedDayChange() {
        return this.dateNavigationService.selectedDayChange;
    }
    updateDayModel(dayModel) {
        this.dateNavigationService.persistedDate = this.dateNavigationService.selectedDay = dayModel;
    }
    triggerControlValidation() {
        if (this.datepickerHasFormControl()) {
            // Set `emitEvent` to false to prevent unnecessary value change event. Status change event will be emitted by `setErrors` below.
            this.control.control?.updateValueAndValidity({ emitEvent: false });
            this.control.control?.setErrors(this.control.control.errors);
        }
    }
}
ClrDateInput.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDateInput, deps: null, target: i0.ɵɵFactoryTarget.Directive });
ClrDateInput.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrDateInput, selector: "[clrDate]", inputs: { date: ["clrDate", "date"], min: "min", max: "max" }, outputs: { dateChange: "clrDateChange" }, host: { properties: { "class.clr-input": "true" } }, providers: [DatepickerFocusService], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDateInput, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrDate]',
                    host: {
                        '[class.clr-input]': 'true',
                    },
                    providers: [DatepickerFocusService],
                }]
        }], propDecorators: { dateChange: [{
                type: Output,
                args: ['clrDateChange']
            }], date: [{
                type: Input,
                args: ['clrDate']
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1zaW5nbGUtaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9kYXRlcGlja2VyL2RhdGUtc2luZ2xlLWlucHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV2RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFaEQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7O0FBUzlFLE1BQU0sT0FBTyxZQUFhLFNBQVEsZ0JBQWdCO0lBUGxEOztRQVFvQyxlQUFVLEdBQUcsSUFBSSxZQUFZLENBQU8sS0FBSyxDQUFDLENBQUM7S0FrQzlFO0lBaENDLElBQ0ksSUFBSSxDQUFDLElBQW1CO1FBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVELElBQ0ksR0FBRyxDQUFDLFVBQWtCO1FBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFRCxJQUNJLEdBQUcsQ0FBQyxVQUFrQjtRQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRUQsSUFBdUIscUJBQXFCO1FBQzFDLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixDQUFDO0lBQ3RELENBQUM7SUFFa0IsY0FBYyxDQUFDLFFBQWtCO1FBQ2xELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7SUFDL0YsQ0FBQztJQUVPLHdCQUF3QjtRQUM5QixJQUFJLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxFQUFFO1lBQ25DLGdJQUFnSTtZQUNoSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxzQkFBc0IsQ0FBQyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM5RDtJQUNILENBQUM7O3lHQWxDVSxZQUFZOzZGQUFaLFlBQVksa01BRlosQ0FBQyxzQkFBc0IsQ0FBQzsyRkFFeEIsWUFBWTtrQkFQeEIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsV0FBVztvQkFDckIsSUFBSSxFQUFFO3dCQUNKLG1CQUFtQixFQUFFLE1BQU07cUJBQzVCO29CQUNELFNBQVMsRUFBRSxDQUFDLHNCQUFzQixDQUFDO2lCQUNwQzs4QkFFbUMsVUFBVTtzQkFBM0MsTUFBTTt1QkFBQyxlQUFlO2dCQUduQixJQUFJO3NCQURQLEtBQUs7dUJBQUMsU0FBUztnQkFNWixHQUFHO3NCQUROLEtBQUs7Z0JBT0YsR0FBRztzQkFETixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJEYXRlSW5wdXRCYXNlIH0gZnJvbSAnLi9kYXRlLWlucHV0JztcbmltcG9ydCB7IERheU1vZGVsIH0gZnJvbSAnLi9tb2RlbC9kYXkubW9kZWwnO1xuaW1wb3J0IHsgRGF0ZXBpY2tlckZvY3VzU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2RhdGVwaWNrZXItZm9jdXMuc2VydmljZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbHJEYXRlXScsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmNsci1pbnB1dF0nOiAndHJ1ZScsXG4gIH0sXG4gIHByb3ZpZGVyczogW0RhdGVwaWNrZXJGb2N1c1NlcnZpY2VdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEYXRlSW5wdXQgZXh0ZW5kcyBDbHJEYXRlSW5wdXRCYXNlIHtcbiAgQE91dHB1dCgnY2xyRGF0ZUNoYW5nZScpIG92ZXJyaWRlIGRhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPERhdGU+KGZhbHNlKTtcblxuICBASW5wdXQoJ2NsckRhdGUnKVxuICBzZXQgZGF0ZShkYXRlOiBEYXRlIHwgc3RyaW5nKSB7XG4gICAgdGhpcy5zZXREYXRlKGRhdGUpO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IG1pbihkYXRlU3RyaW5nOiBzdHJpbmcpIHtcbiAgICB0aGlzLmRhdGVJT1NlcnZpY2Uuc2V0TWluRGF0ZShkYXRlU3RyaW5nKTtcbiAgICB0aGlzLnRyaWdnZXJDb250cm9sVmFsaWRhdGlvbigpO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IG1heChkYXRlU3RyaW5nOiBzdHJpbmcpIHtcbiAgICB0aGlzLmRhdGVJT1NlcnZpY2Uuc2V0TWF4RGF0ZShkYXRlU3RyaW5nKTtcbiAgICB0aGlzLnRyaWdnZXJDb250cm9sVmFsaWRhdGlvbigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGdldCB1c2VyU2VsZWN0ZWREYXlDaGFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRGF5Q2hhbmdlO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIHVwZGF0ZURheU1vZGVsKGRheU1vZGVsOiBEYXlNb2RlbCkge1xuICAgIHRoaXMuZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnBlcnNpc3RlZERhdGUgPSB0aGlzLmRhdGVOYXZpZ2F0aW9uU2VydmljZS5zZWxlY3RlZERheSA9IGRheU1vZGVsO1xuICB9XG5cbiAgcHJpdmF0ZSB0cmlnZ2VyQ29udHJvbFZhbGlkYXRpb24oKSB7XG4gICAgaWYgKHRoaXMuZGF0ZXBpY2tlckhhc0Zvcm1Db250cm9sKCkpIHtcbiAgICAgIC8vIFNldCBgZW1pdEV2ZW50YCB0byBmYWxzZSB0byBwcmV2ZW50IHVubmVjZXNzYXJ5IHZhbHVlIGNoYW5nZSBldmVudC4gU3RhdHVzIGNoYW5nZSBldmVudCB3aWxsIGJlIGVtaXR0ZWQgYnkgYHNldEVycm9yc2AgYmVsb3cuXG4gICAgICB0aGlzLmNvbnRyb2wuY29udHJvbD8udXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7IGVtaXRFdmVudDogZmFsc2UgfSk7XG4gICAgICB0aGlzLmNvbnRyb2wuY29udHJvbD8uc2V0RXJyb3JzKHRoaXMuY29udHJvbC5jb250cm9sLmVycm9ycyk7XG4gICAgfVxuICB9XG59XG4iXX0=
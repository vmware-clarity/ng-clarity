/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Optional } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "./providers/date-io.service";
import * as i2 from "./providers/date-navigation.service";
export class ClrDateInputValidator {
    constructor(dateIOService) {
        this.dateIOService = dateIOService;
    }
    validate(control) {
        if (this.dateIOService) {
            const value = this.dateIOService.getDateValueFromDateString(control.value);
            const minDate = this.dateIOService.disabledDates.minDate.toDate();
            const maxDate = this.dateIOService.disabledDates.maxDate.toDate();
            if (value && value < minDate) {
                return { min: { min: minDate.toLocaleDateString(), actual: value.toLocaleDateString() } };
            }
            else if (value && value > maxDate) {
                return { max: { max: maxDate.toLocaleDateString(), actual: value.toLocaleDateString() } };
            }
        }
        return null;
    }
}
ClrDateInputValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDateInputValidator, deps: [{ token: i1.DateIOService, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
ClrDateInputValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrDateInputValidator, selector: "[clrDate], [clrStartDate], [clrEndDate]", providers: [{ provide: NG_VALIDATORS, useExisting: ClrDateInputValidator, multi: true }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDateInputValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrDate], [clrStartDate], [clrEndDate]',
                    providers: [{ provide: NG_VALIDATORS, useExisting: ClrDateInputValidator, multi: true }],
                }]
        }], ctorParameters: function () { return [{ type: i1.DateIOService, decorators: [{
                    type: Optional
                }] }]; } });
export class ClrStartDateInputValidator {
    constructor(dateIOService, dateNavigationService) {
        this.dateIOService = dateIOService;
        this.dateNavigationService = dateNavigationService;
    }
    validate(control) {
        if (this.dateIOService) {
            const value = this.dateIOService.getDateValueFromDateString(control.value);
            const endDate = this.dateNavigationService?.selectedEndDay?.toDate();
            if (value && endDate && value > endDate) {
                return { range: { startDate: value, endDate } };
            }
        }
        return null;
    }
}
ClrStartDateInputValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStartDateInputValidator, deps: [{ token: i1.DateIOService, optional: true }, { token: i2.DateNavigationService, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
ClrStartDateInputValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrStartDateInputValidator, selector: "[clrStartDate]", providers: [{ provide: NG_VALIDATORS, useExisting: ClrStartDateInputValidator, multi: true }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStartDateInputValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrStartDate]',
                    providers: [{ provide: NG_VALIDATORS, useExisting: ClrStartDateInputValidator, multi: true }],
                }]
        }], ctorParameters: function () { return [{ type: i1.DateIOService, decorators: [{
                    type: Optional
                }] }, { type: i2.DateNavigationService, decorators: [{
                    type: Optional
                }] }]; } });
export class ClrEndDateInputValidator {
    constructor(dateIOService, dateNavigationService) {
        this.dateIOService = dateIOService;
        this.dateNavigationService = dateNavigationService;
    }
    validate(control) {
        if (this.dateIOService) {
            const value = this.dateIOService.getDateValueFromDateString(control.value);
            const startDate = this.dateNavigationService?.selectedDay?.toDate();
            if (value && startDate && value < startDate) {
                return { range: { startDate, endDate: value } };
            }
        }
        return null;
    }
}
ClrEndDateInputValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrEndDateInputValidator, deps: [{ token: i1.DateIOService, optional: true }, { token: i2.DateNavigationService, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
ClrEndDateInputValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrEndDateInputValidator, selector: "[clrEndDate]", providers: [{ provide: NG_VALIDATORS, useExisting: ClrEndDateInputValidator, multi: true }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrEndDateInputValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrEndDate]',
                    providers: [{ provide: NG_VALIDATORS, useExisting: ClrEndDateInputValidator, multi: true }],
                }]
        }], ctorParameters: function () { return [{ type: i1.DateIOService, decorators: [{
                    type: Optional
                }] }, { type: i2.DateNavigationService, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1pbnB1dC52YWxpZGF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9kYXRlcGlja2VyL2RhdGUtaW5wdXQudmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEQsT0FBTyxFQUFtQixhQUFhLEVBQStCLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFTN0YsTUFBTSxPQUFPLHFCQUFxQjtJQUNoQyxZQUFnQyxhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJQUFHLENBQUM7SUFFaEUsUUFBUSxDQUFDLE9BQXdCO1FBQy9CLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLDBCQUEwQixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzRSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDbEUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBRWxFLElBQUksS0FBSyxJQUFJLEtBQUssR0FBRyxPQUFPLEVBQUU7Z0JBQzVCLE9BQU8sRUFBRSxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLEVBQUUsQ0FBQzthQUMzRjtpQkFBTSxJQUFJLEtBQUssSUFBSSxLQUFLLEdBQUcsT0FBTyxFQUFFO2dCQUNuQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8s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UUFBUSxFQUFFLGNBQWM7b0JBQ3hCLFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLDBCQUEwQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQztpQkFDNUY7OzBCQUdJLFFBQVE7OzBCQUNSLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCwgTkdfVkFMSURBVE9SUywgVmFsaWRhdGlvbkVycm9ycywgVmFsaWRhdG9yIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBEYXRlSU9TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGF0ZS1pby5zZXJ2aWNlJztcbmltcG9ydCB7IERhdGVOYXZpZ2F0aW9uU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2RhdGUtbmF2aWdhdGlvbi5zZXJ2aWNlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsckRhdGVdLCBbY2xyU3RhcnREYXRlXSwgW2NsckVuZERhdGVdJyxcbiAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogQ2xyRGF0ZUlucHV0VmFsaWRhdG9yLCBtdWx0aTogdHJ1ZSB9XSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0ZUlucHV0VmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgcHJpdmF0ZSBkYXRlSU9TZXJ2aWNlOiBEYXRlSU9TZXJ2aWNlKSB7fVxuXG4gIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMge1xuICAgIGlmICh0aGlzLmRhdGVJT1NlcnZpY2UpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5kYXRlSU9TZXJ2aWNlLmdldERhdGVWYWx1ZUZyb21EYXRlU3RyaW5nKGNvbnRyb2wudmFsdWUpO1xuICAgICAgY29uc3QgbWluRGF0ZSA9IHRoaXMuZGF0ZUlPU2VydmljZS5kaXNhYmxlZERhdGVzLm1pbkRhdGUudG9EYXRlKCk7XG4gICAgICBjb25zdCBtYXhEYXRlID0gdGhpcy5kYXRlSU9TZXJ2aWNlLmRpc2FibGVkRGF0ZXMubWF4RGF0ZS50b0RhdGUoKTtcblxuICAgICAgaWYgKHZhbHVlICYmIHZhbHVlIDwgbWluRGF0ZSkge1xuICAgICAgICByZXR1cm4geyBtaW46IHsgbWluOiBtaW5EYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpLCBhY3R1YWw6IHZhbHVlLnRvTG9jYWxlRGF0ZVN0cmluZygpIH0gfTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgJiYgdmFsdWUgPiBtYXhEYXRlKSB7XG4gICAgICAgIHJldHVybiB7IG1heDogeyBtYXg6IG1heERhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKCksIGFjdHVhbDogdmFsdWUudG9Mb2NhbGVEYXRlU3RyaW5nKCkgfSB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbHJTdGFydERhdGVdJyxcbiAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogQ2xyU3RhcnREYXRlSW5wdXRWYWxpZGF0b3IsIG11bHRpOiB0cnVlIH1dLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJTdGFydERhdGVJbnB1dFZhbGlkYXRvciBpbXBsZW1lbnRzIFZhbGlkYXRvciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgZGF0ZUlPU2VydmljZTogRGF0ZUlPU2VydmljZSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGRhdGVOYXZpZ2F0aW9uU2VydmljZTogRGF0ZU5hdmlnYXRpb25TZXJ2aWNlXG4gICkge31cblxuICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHtcbiAgICBpZiAodGhpcy5kYXRlSU9TZXJ2aWNlKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZGF0ZUlPU2VydmljZS5nZXREYXRlVmFsdWVGcm9tRGF0ZVN0cmluZyhjb250cm9sLnZhbHVlKTtcbiAgICAgIGNvbnN0IGVuZERhdGUgPSB0aGlzLmRhdGVOYXZpZ2F0aW9uU2VydmljZT8uc2VsZWN0ZWRFbmREYXk/LnRvRGF0ZSgpO1xuXG4gICAgICBpZiAodmFsdWUgJiYgZW5kRGF0ZSAmJiB2YWx1ZSA+IGVuZERhdGUpIHtcbiAgICAgICAgcmV0dXJuIHsgcmFuZ2U6IHsgc3RhcnREYXRlOiB2YWx1ZSwgZW5kRGF0ZSB9IH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsckVuZERhdGVdJyxcbiAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogQ2xyRW5kRGF0ZUlucHV0VmFsaWRhdG9yLCBtdWx0aTogdHJ1ZSB9XSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRW5kRGF0ZUlucHV0VmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBkYXRlSU9TZXJ2aWNlOiBEYXRlSU9TZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgZGF0ZU5hdmlnYXRpb25TZXJ2aWNlOiBEYXRlTmF2aWdhdGlvblNlcnZpY2VcbiAgKSB7fVxuXG4gIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMge1xuICAgIGlmICh0aGlzLmRhdGVJT1NlcnZpY2UpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5kYXRlSU9TZXJ2aWNlLmdldERhdGVWYWx1ZUZyb21EYXRlU3RyaW5nKGNvbnRyb2wudmFsdWUpO1xuICAgICAgY29uc3Qgc3RhcnREYXRlID0gdGhpcy5kYXRlTmF2aWdhdGlvblNlcnZpY2U/LnNlbGVjdGVkRGF5Py50b0RhdGUoKTtcblxuICAgICAgaWYgKHZhbHVlICYmIHN0YXJ0RGF0ZSAmJiB2YWx1ZSA8IHN0YXJ0RGF0ZSkge1xuICAgICAgICByZXR1cm4geyByYW5nZTogeyBzdGFydERhdGUsIGVuZERhdGU6IHZhbHVlIH0gfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19
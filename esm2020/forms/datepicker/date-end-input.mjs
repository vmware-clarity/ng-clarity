/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ClrDateInputBase } from './date-input';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import * as i0 from "@angular/core";
export class ClrEndDateInput extends ClrDateInputBase {
    constructor() {
        super(...arguments);
        this.dateChange = new EventEmitter(false);
        this.inputWidth = 13;
    }
    set date(date) {
        this.setDate(date);
    }
    get inputSize() {
        return this.inputWidth;
    }
    get userSelectedDayChange() {
        return this.dateNavigationService.selectedEndDayChange;
    }
    triggerControlInputValidation() {
        if (this.datepickerHasFormControl()) {
            this.control.control?.updateValueAndValidity({ emitEvent: false });
            this.control.control?.setErrors(this.control.control.errors);
        }
    }
    updateDayModel(dayModel) {
        this.dateNavigationService.persistedEndDate = this.dateNavigationService.selectedEndDay = dayModel;
    }
}
ClrEndDateInput.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrEndDateInput, deps: null, target: i0.ɵɵFactoryTarget.Directive });
ClrEndDateInput.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrEndDateInput, selector: "[clrEndDate]", inputs: { inputWidth: "inputWidth", date: ["clrEndDate", "date"] }, outputs: { dateChange: "clrEndDateChange" }, host: { properties: { "class.clr-input": "true", "attr.size": "this.inputSize" } }, providers: [DatepickerFocusService], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrEndDateInput, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrEndDate]',
                    host: {
                        '[class.clr-input]': 'true',
                    },
                    providers: [DatepickerFocusService],
                }]
        }], propDecorators: { dateChange: [{
                type: Output,
                args: ['clrEndDateChange']
            }], inputWidth: [{
                type: Input,
                args: ['inputWidth']
            }], date: [{
                type: Input,
                args: ['clrEndDate']
            }], inputSize: [{
                type: HostBinding,
                args: ['attr.size']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1lbmQtaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9kYXRlcGlja2VyL2RhdGUtZW5kLWlucHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFcEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRWhELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDOztBQVM5RSxNQUFNLE9BQU8sZUFBZ0IsU0FBUSxnQkFBZ0I7SUFQckQ7O1FBUXVDLGVBQVUsR0FBRyxJQUFJLFlBQVksQ0FBTyxLQUFLLENBQUMsQ0FBQztRQUUzRCxlQUFVLEdBQUcsRUFBRSxDQUFDO0tBMEJ0QztJQXhCQyxJQUNJLElBQUksQ0FBQyxJQUFtQjtRQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxJQUNJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUVELElBQXVCLHFCQUFxQjtRQUMxQyxPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxvQkFBb0IsQ0FBQztJQUN6RCxDQUFDO0lBRUQsNkJBQTZCO1FBQzNCLElBQUksSUFBSSxDQUFDLHdCQUF3QixFQUFFLEVBQUU7WUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsc0JBQXNCLENBQUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDOUQ7SUFDSCxDQUFDO0lBRWtCLGNBQWMsQ0FBQyxRQUFrQjtRQUNsRCxJQUFJLENBQUMscUJBQXFCLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUM7SUFDckcsQ0FBQzs7NEdBNUJVLGVBQWU7Z0dBQWYsZUFBZSw0T0FGZixDQUFDLHNCQUFzQixDQUFDOzJGQUV4QixlQUFlO2tCQVAzQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxjQUFjO29CQUN4QixJQUFJLEVBQUU7d0JBQ0osbUJBQW1CLEVBQUUsTUFBTTtxQkFDNUI7b0JBQ0QsU0FBUyxFQUFFLENBQUMsc0JBQXNCLENBQUM7aUJBQ3BDOzhCQUVzQyxVQUFVO3NCQUE5QyxNQUFNO3VCQUFDLGtCQUFrQjtnQkFFTCxVQUFVO3NCQUE5QixLQUFLO3VCQUFDLFlBQVk7Z0JBR2YsSUFBSTtzQkFEUCxLQUFLO3VCQUFDLFlBQVk7Z0JBTWYsU0FBUztzQkFEWixXQUFXO3VCQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBIb3N0QmluZGluZywgSW5wdXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJEYXRlSW5wdXRCYXNlIH0gZnJvbSAnLi9kYXRlLWlucHV0JztcbmltcG9ydCB7IERheU1vZGVsIH0gZnJvbSAnLi9tb2RlbC9kYXkubW9kZWwnO1xuaW1wb3J0IHsgRGF0ZXBpY2tlckZvY3VzU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2RhdGVwaWNrZXItZm9jdXMuc2VydmljZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbHJFbmREYXRlXScsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmNsci1pbnB1dF0nOiAndHJ1ZScsXG4gIH0sXG4gIHByb3ZpZGVyczogW0RhdGVwaWNrZXJGb2N1c1NlcnZpY2VdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJFbmREYXRlSW5wdXQgZXh0ZW5kcyBDbHJEYXRlSW5wdXRCYXNlIHtcbiAgQE91dHB1dCgnY2xyRW5kRGF0ZUNoYW5nZScpIG92ZXJyaWRlIGRhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPERhdGU+KGZhbHNlKTtcblxuICBASW5wdXQoJ2lucHV0V2lkdGgnKSBpbnB1dFdpZHRoID0gMTM7XG5cbiAgQElucHV0KCdjbHJFbmREYXRlJylcbiAgc2V0IGRhdGUoZGF0ZTogRGF0ZSB8IHN0cmluZykge1xuICAgIHRoaXMuc2V0RGF0ZShkYXRlKTtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnYXR0ci5zaXplJylcbiAgZ2V0IGlucHV0U2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pbnB1dFdpZHRoO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGdldCB1c2VyU2VsZWN0ZWREYXlDaGFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRW5kRGF5Q2hhbmdlO1xuICB9XG5cbiAgdHJpZ2dlckNvbnRyb2xJbnB1dFZhbGlkYXRpb24oKSB7XG4gICAgaWYgKHRoaXMuZGF0ZXBpY2tlckhhc0Zvcm1Db250cm9sKCkpIHtcbiAgICAgIHRoaXMuY29udHJvbC5jb250cm9sPy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHsgZW1pdEV2ZW50OiBmYWxzZSB9KTtcbiAgICAgIHRoaXMuY29udHJvbC5jb250cm9sPy5zZXRFcnJvcnModGhpcy5jb250cm9sLmNvbnRyb2wuZXJyb3JzKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgdXBkYXRlRGF5TW9kZWwoZGF5TW9kZWw6IERheU1vZGVsKSB7XG4gICAgdGhpcy5kYXRlTmF2aWdhdGlvblNlcnZpY2UucGVyc2lzdGVkRW5kRGF0ZSA9IHRoaXMuZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRW5kRGF5ID0gZGF5TW9kZWw7XG4gIH1cbn1cbiJdfQ==
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
export class ClrStartDateInput extends ClrDateInputBase {
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
        return this.dateNavigationService.selectedDayChange;
    }
    triggerControlInputValidation() {
        if (this.datepickerHasFormControl()) {
            this.control.control?.updateValueAndValidity({ emitEvent: false });
            this.control.control?.setErrors(this.control.control.errors);
        }
    }
    updateDayModel(dayModel) {
        this.dateNavigationService.persistedDate = this.dateNavigationService.selectedDay = dayModel;
    }
}
ClrStartDateInput.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStartDateInput, deps: null, target: i0.ɵɵFactoryTarget.Directive });
ClrStartDateInput.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrStartDateInput, selector: "[clrStartDate]", inputs: { inputWidth: "inputWidth", date: ["clrStartDate", "date"] }, outputs: { dateChange: "clrStartDateChange" }, host: { properties: { "class.clr-input": "true", "style.text-align": "'right'", "attr.size": "this.inputSize" } }, providers: [DatepickerFocusService], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStartDateInput, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrStartDate]',
                    host: {
                        '[class.clr-input]': 'true',
                        '[style.text-align]': "'right'",
                    },
                    providers: [DatepickerFocusService],
                }]
        }], propDecorators: { dateChange: [{
                type: Output,
                args: ['clrStartDateChange']
            }], inputWidth: [{
                type: Input,
                args: ['inputWidth']
            }], date: [{
                type: Input,
                args: ['clrStartDate']
            }], inputSize: [{
                type: HostBinding,
                args: ['attr.size']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1zdGFydC1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2RhdGVwaWNrZXIvZGF0ZS1zdGFydC1pbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXBGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUVoRCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQzs7QUFVOUUsTUFBTSxPQUFPLGlCQUFrQixTQUFRLGdCQUFnQjtJQVJ2RDs7UUFTeUMsZUFBVSxHQUFHLElBQUksWUFBWSxDQUFPLEtBQUssQ0FBQyxDQUFDO1FBRTdELGVBQVUsR0FBRyxFQUFFLENBQUM7S0EwQnRDO0lBeEJDLElBQ0ksSUFBSSxDQUFDLElBQW1CO1FBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVELElBQ0ksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBRUQsSUFBdUIscUJBQXFCO1FBQzFDLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixDQUFDO0lBQ3RELENBQUM7SUFFRCw2QkFBNkI7UUFDM0IsSUFBSSxJQUFJLENBQUMsd0JBQXdCLEVBQUUsRUFBRTtZQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxzQkFBc0IsQ0FBQyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM5RDtJQUNILENBQUM7SUFFa0IsY0FBYyxDQUFDLFFBQWtCO1FBQ2xELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7SUFDL0YsQ0FBQzs7OEdBNUJVLGlCQUFpQjtrR0FBakIsaUJBQWlCLGlSQUZqQixDQUFDLHNCQUFzQixDQUFDOzJGQUV4QixpQkFBaUI7a0JBUjdCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsSUFBSSxFQUFFO3dCQUNKLG1CQUFtQixFQUFFLE1BQU07d0JBQzNCLG9CQUFvQixFQUFFLFNBQVM7cUJBQ2hDO29CQUNELFNBQVMsRUFBRSxDQUFDLHNCQUFzQixDQUFDO2lCQUNwQzs4QkFFd0MsVUFBVTtzQkFBaEQsTUFBTTt1QkFBQyxvQkFBb0I7Z0JBRVAsVUFBVTtzQkFBOUIsS0FBSzt1QkFBQyxZQUFZO2dCQUdmLElBQUk7c0JBRFAsS0FBSzt1QkFBQyxjQUFjO2dCQU1qQixTQUFTO3NCQURaLFdBQVc7dUJBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIEhvc3RCaW5kaW5nLCBJbnB1dCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckRhdGVJbnB1dEJhc2UgfSBmcm9tICcuL2RhdGUtaW5wdXQnO1xuaW1wb3J0IHsgRGF5TW9kZWwgfSBmcm9tICcuL21vZGVsL2RheS5tb2RlbCc7XG5pbXBvcnQgeyBEYXRlcGlja2VyRm9jdXNTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGF0ZXBpY2tlci1mb2N1cy5zZXJ2aWNlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsclN0YXJ0RGF0ZV0nLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5jbHItaW5wdXRdJzogJ3RydWUnLFxuICAgICdbc3R5bGUudGV4dC1hbGlnbl0nOiBcIidyaWdodCdcIixcbiAgfSxcbiAgcHJvdmlkZXJzOiBbRGF0ZXBpY2tlckZvY3VzU2VydmljZV0sXG59KVxuZXhwb3J0IGNsYXNzIENsclN0YXJ0RGF0ZUlucHV0IGV4dGVuZHMgQ2xyRGF0ZUlucHV0QmFzZSB7XG4gIEBPdXRwdXQoJ2NsclN0YXJ0RGF0ZUNoYW5nZScpIG92ZXJyaWRlIGRhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPERhdGU+KGZhbHNlKTtcblxuICBASW5wdXQoJ2lucHV0V2lkdGgnKSBpbnB1dFdpZHRoID0gMTM7XG5cbiAgQElucHV0KCdjbHJTdGFydERhdGUnKVxuICBzZXQgZGF0ZShkYXRlOiBEYXRlIHwgc3RyaW5nKSB7XG4gICAgdGhpcy5zZXREYXRlKGRhdGUpO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdhdHRyLnNpemUnKVxuICBnZXQgaW5wdXRTaXplKCkge1xuICAgIHJldHVybiB0aGlzLmlucHV0V2lkdGg7XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgZ2V0IHVzZXJTZWxlY3RlZERheUNoYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWREYXlDaGFuZ2U7XG4gIH1cblxuICB0cmlnZ2VyQ29udHJvbElucHV0VmFsaWRhdGlvbigpIHtcbiAgICBpZiAodGhpcy5kYXRlcGlja2VySGFzRm9ybUNvbnRyb2woKSkge1xuICAgICAgdGhpcy5jb250cm9sLmNvbnRyb2w/LnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoeyBlbWl0RXZlbnQ6IGZhbHNlIH0pO1xuICAgICAgdGhpcy5jb250cm9sLmNvbnRyb2w/LnNldEVycm9ycyh0aGlzLmNvbnRyb2wuY29udHJvbC5lcnJvcnMpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBvdmVycmlkZSB1cGRhdGVEYXlNb2RlbChkYXlNb2RlbDogRGF5TW9kZWwpIHtcbiAgICB0aGlzLmRhdGVOYXZpZ2F0aW9uU2VydmljZS5wZXJzaXN0ZWREYXRlID0gdGhpcy5kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWREYXkgPSBkYXlNb2RlbDtcbiAgfVxufVxuIl19
/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { isPlatformBrowser } from '@angular/common';
import { Directive, forwardRef, HostBinding, HostListener, Inject, Input, Optional, PLATFORM_ID, Self, } from '@angular/core';
import { filter } from 'rxjs/operators';
import { isBooleanAttributeSet } from '../../utils/component/is-boolean-attribute-set';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrDateContainer } from './date-container';
import { DayModel } from './model/day.model';
import { DateFormControlService } from './providers/date-form-control.service';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerEnabledService } from './providers/datepicker-enabled.service';
import { datesAreEqual } from './utils/date-utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "./providers/date-io.service";
import * as i3 from "./providers/date-navigation.service";
import * as i4 from "./providers/datepicker-enabled.service";
import * as i5 from "./providers/date-form-control.service";
import * as i6 from "../common/providers/focus.service";
import * as i7 from "./providers/datepicker-focus.service";
import * as i8 from "./date-container";
// There are four ways the datepicker value is set
// 1. Value set by user typing into text input as a string ex: '01/28/2015'
// 2. Value set explicitly by Angular Forms APIs as a string ex: '01/28/2015'
// 3. Value set by user via datepicker UI as a Date Object
// 4. Value set via `clrDate` input as a Date Object
export class ClrDateInputBase extends WrappedFormControl {
    constructor(viewContainerRef, injector, el, renderer, control, container, dateIOService, dateNavigationService, datepickerEnabledService, dateFormControlService, platformId, focusService, datepickerFocusService) {
        super(viewContainerRef, ClrDateContainer, injector, control, renderer, el);
        this.el = el;
        this.renderer = renderer;
        this.control = control;
        this.container = container;
        this.dateIOService = dateIOService;
        this.dateNavigationService = dateNavigationService;
        this.datepickerEnabledService = datepickerEnabledService;
        this.dateFormControlService = dateFormControlService;
        this.platformId = platformId;
        this.focusService = focusService;
        this.datepickerFocusService = datepickerFocusService;
        this.index = 1;
    }
    get disabled() {
        if (this.dateFormControlService) {
            return this.dateFormControlService.disabled || !!this.control?.control?.disabled;
        }
        return null;
    }
    set disabled(value) {
        if (this.dateFormControlService) {
            this.dateFormControlService.setDisabled(isBooleanAttributeSet(value));
        }
    }
    get placeholderText() {
        return this.placeholder ? this.placeholder : this.dateIOService.placeholderText;
    }
    get inputType() {
        return isPlatformBrowser(this.platformId) && this.usingNativeDatepicker() ? 'date' : 'text';
    }
    ngOnInit() {
        super.ngOnInit();
        this.populateServicesFromContainerComponent();
        this.subscriptions.push(this.listenForUserSelectedDayChanges(), this.listenForControlValueChanges(), this.listenForTouchChanges(), this.listenForDirtyChanges(), this.listenForInputRefocus());
    }
    ngAfterViewInit() {
        // I don't know why I have to do this but after using the new HostWrapping Module I have to delay the processing
        // of the initial Input set by the user to here. If I do not 2 issues occur:
        // 1. The Input setter is called before ngOnInit. ngOnInit initializes the services without which the setter fails.
        // 2. The Renderer doesn't work before ngAfterViewInit (It used to before the new HostWrapping Module for some reason).
        // I need the renderer to set the value property on the input to make sure that if the user has supplied a Date
        // input object, we reflect it with the right date on the input field using the IO service. I am not sure if
        // these are major issues or not but just noting them down here.
        this.processInitialInputs();
    }
    setFocusStates() {
        this.setFocus(true);
    }
    triggerValidation() {
        super.triggerValidation();
        this.setFocus(false);
    }
    onValueChange(target) {
        const validDateValue = this.dateIOService.getDateValueFromDateString(target.value);
        if (this.usingClarityDatepicker() && validDateValue) {
            this.updateDate(validDateValue, true);
        }
        else if (this.usingNativeDatepicker()) {
            const [year, month, day] = target.value.split('-');
            this.updateDate(new Date(+year, +month - 1, +day), true);
        }
        else {
            this.emitDateOutput(null);
        }
    }
    datepickerHasFormControl() {
        return !!this.control;
    }
    setDate(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        if (this.previousDateChange !== date) {
            this.updateDate(date);
        }
        if (!this.initialClrDateInputValue) {
            this.initialClrDateInputValue = date;
        }
    }
    usingClarityDatepicker() {
        return this.datepickerEnabledService.isEnabled;
    }
    usingNativeDatepicker() {
        return !this.datepickerEnabledService.isEnabled;
    }
    setFocus(focus) {
        if (this.focusService) {
            this.focusService.focused = focus;
        }
    }
    populateServicesFromContainerComponent() {
        if (!this.container) {
            this.dateIOService = this.getProviderFromContainer(DateIOService);
            this.dateNavigationService = this.getProviderFromContainer(DateNavigationService);
            this.datepickerEnabledService = this.getProviderFromContainer(DatepickerEnabledService);
            this.dateFormControlService = this.getProviderFromContainer(DateFormControlService);
        }
    }
    processInitialInputs() {
        if (this.datepickerHasFormControl()) {
            this.updateDate(this.dateIOService.getDateValueFromDateString(this.control.value));
        }
        else {
            this.updateDate(this.initialClrDateInputValue);
        }
    }
    updateDate(value, setByUserInteraction = false) {
        const date = this.getValidDateValueFromDate(value);
        if (setByUserInteraction) {
            this.emitDateOutput(date);
        }
        else {
            this.previousDateChange = date;
        }
        if (this.dateNavigationService) {
            const dayModel = date ? new DayModel(date.getFullYear(), date.getMonth(), date.getDate()) : null;
            this.updateDayModel(dayModel);
        }
        this.updateInput(date);
    }
    updateInput(date) {
        if (date) {
            const dateString = this.dateIOService.toLocaleDisplayFormatString(date);
            if (this.usingNativeDatepicker()) {
                // valueAsDate expects UTC, date from input is time-zoned
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                this.renderer.setProperty(this.el.nativeElement, 'valueAsDate', date);
            }
            else if (this.datepickerHasFormControl() && dateString !== this.control.value) {
                this.control.control.setValue(dateString);
            }
            else {
                this.renderer.setProperty(this.el.nativeElement, 'value', dateString);
            }
            this.validateDateRange();
        }
        else {
            this.renderer.setProperty(this.el.nativeElement, 'value', '');
        }
    }
    getValidDateValueFromDate(date) {
        if (this.dateIOService) {
            const dateString = this.dateIOService.toLocaleDisplayFormatString(date);
            return this.dateIOService.getDateValueFromDateString(dateString);
        }
        else {
            return null;
        }
    }
    emitDateOutput(date) {
        if (!datesAreEqual(date, this.previousDateChange)) {
            this.dateChange.emit(date);
            this.previousDateChange = date;
        }
        else if (!date && this.previousDateChange) {
            this.dateChange.emit(null);
            this.previousDateChange = null;
        }
    }
    listenForControlValueChanges() {
        if (this.datepickerHasFormControl()) {
            return this.control.valueChanges
                .pipe(
            // only update date value if not being set by user
            filter(() => !this.datepickerFocusService.elementIsFocused(this.el.nativeElement)))
                .subscribe((value) => this.updateDate(this.dateIOService.getDateValueFromDateString(value)));
        }
        else {
            return null;
        }
    }
    listenForUserSelectedDayChanges() {
        return this.userSelectedDayChange.subscribe(dayModel => this.updateDate(dayModel?.toDate(), true));
    }
    listenForTouchChanges() {
        return this.dateFormControlService.touchedChange
            .pipe(filter(() => this.datepickerHasFormControl()))
            .subscribe(() => this.control.control.markAsTouched());
    }
    listenForDirtyChanges() {
        return this.dateFormControlService.dirtyChange
            .pipe(filter(() => this.datepickerHasFormControl()))
            .subscribe(() => this.control.control.markAsDirty());
    }
    listenForInputRefocus() {
        return this.dateNavigationService.selectedDayChange
            .pipe(filter(date => !!date && !this.dateNavigationService.isRangePicker))
            .subscribe(() => this.datepickerFocusService.focusInput(this.el.nativeElement));
    }
    /**
     * In case of date range error, both start & end date field validation has to be triggered
     * if either of the field gets updated
     */
    validateDateRange() {
        if (this.dateNavigationService.isRangePicker) {
            const primaryControl = this.ngControlService?.control;
            const additionalControls = this.ngControlService?.additionalControls;
            const isValid = this.dateNavigationService.selectedDay?.isBefore(this.dateNavigationService.selectedEndDay, true);
            if (isValid &&
                (primaryControl?.hasError('range') || additionalControls?.some(control => control.hasError('range')))) {
                primaryControl.control?.updateValueAndValidity({ emitEvent: false });
                additionalControls.forEach((ngControl) => {
                    ngControl?.control?.updateValueAndValidity({ emitEvent: false });
                });
            }
        }
    }
}
ClrDateInputBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDateInputBase, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.NgControl, optional: true, self: true }, { token: forwardRef(() => ClrDateContainer), optional: true }, { token: i2.DateIOService, optional: true }, { token: i3.DateNavigationService, optional: true }, { token: i4.DatepickerEnabledService, optional: true }, { token: i5.DateFormControlService, optional: true }, { token: PLATFORM_ID }, { token: i6.FocusService, optional: true }, { token: i7.DatepickerFocusService }], target: i0.ɵɵFactoryTarget.Directive });
ClrDateInputBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrDateInputBase, inputs: { placeholder: "placeholder", disabled: "disabled" }, host: { listeners: { "focus": "setFocusStates()", "blur": "triggerValidation()", "change": "onValueChange($event.target)" }, properties: { "disabled": "this.disabled", "attr.placeholder": "this.placeholderText", "attr.type": "this.inputType" } }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDateInputBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i8.ClrDateContainer, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [forwardRef(() => ClrDateContainer)]
                }] }, { type: i2.DateIOService, decorators: [{
                    type: Optional
                }] }, { type: i3.DateNavigationService, decorators: [{
                    type: Optional
                }] }, { type: i4.DatepickerEnabledService, decorators: [{
                    type: Optional
                }] }, { type: i5.DateFormControlService, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i6.FocusService, decorators: [{
                    type: Optional
                }] }, { type: i7.DatepickerFocusService }]; }, propDecorators: { placeholder: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: ['disabled']
            }, {
                type: HostBinding,
                args: ['disabled']
            }], placeholderText: [{
                type: HostBinding,
                args: ['attr.placeholder']
            }], inputType: [{
                type: HostBinding,
                args: ['attr.type']
            }], setFocusStates: [{
                type: HostListener,
                args: ['focus']
            }], triggerValidation: [{
                type: HostListener,
                args: ['blur']
            }], onValueChange: [{
                type: HostListener,
                args: ['change', ['$event.target']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2RhdGVwaWNrZXIvZGF0ZS1pbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3BELE9BQU8sRUFFTCxTQUFTLEVBR1QsVUFBVSxFQUNWLFdBQVcsRUFDWCxZQUFZLEVBQ1osTUFBTSxFQUVOLEtBQUssRUFHTCxRQUFRLEVBQ1IsV0FBVyxFQUVYLElBQUksR0FFTCxNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFFdkYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDL0QsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDcEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQy9FLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM1RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUVsRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7Ozs7Ozs7Ozs7QUFFbkQsa0RBQWtEO0FBQ2xELDJFQUEyRTtBQUMzRSw2RUFBNkU7QUFDN0UsMERBQTBEO0FBQzFELG9EQUFvRDtBQUdwRCxNQUFNLE9BQWdCLGdCQUNwQixTQUFRLGtCQUFvQztJQWM1QyxZQUNFLGdC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SzlDLFdBQVc7aUdBNUJELGdCQUFnQjsyRkFBaEIsZ0JBQWdCO2tCQURyQyxTQUFTOzswQkFxQkwsSUFBSTs7MEJBQ0osUUFBUTs7MEJBRVIsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7OzBCQUNyRCxRQUFROzswQkFDUixRQUFROzswQkFDUixRQUFROzswQkFDUixRQUFROzswQkFDUixNQUFNOzJCQUFDLFdBQVc7OzBCQUNsQixRQUFRO2lGQXZCRixXQUFXO3NCQUFuQixLQUFLO2dCQXNDRixRQUFRO3NCQUZYLEtBQUs7dUJBQUMsVUFBVTs7c0JBQ2hCLFdBQVc7dUJBQUMsVUFBVTtnQkFRbkIsZUFBZTtzQkFEbEIsV0FBVzt1QkFBQyxrQkFBa0I7Z0JBTTNCLFNBQVM7c0JBRFosV0FBVzt1QkFBQyxXQUFXO2dCQWdDeEIsY0FBYztzQkFEYixZQUFZO3VCQUFDLE9BQU87Z0JBTVosaUJBQWlCO3NCQUR6QixZQUFZO3VCQUFDLE1BQU07Z0JBT3BCLGFBQWE7c0JBRFosWUFBWTt1QkFBQyxRQUFRLEVBQUUsQ0FBQyxlQUFlLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0QmluZGluZyxcbiAgSG9zdExpc3RlbmVyLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBQTEFURk9STV9JRCxcbiAgUmVuZGVyZXIyLFxuICBTZWxmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgaXNCb29sZWFuQXR0cmlidXRlU2V0IH0gZnJvbSAnLi4vLi4vdXRpbHMvY29tcG9uZW50L2lzLWJvb2xlYW4tYXR0cmlidXRlLXNldCc7XG5pbXBvcnQgeyBGb2N1c1NlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL2ZvY3VzLnNlcnZpY2UnO1xuaW1wb3J0IHsgV3JhcHBlZEZvcm1Db250cm9sIH0gZnJvbSAnLi4vY29tbW9uL3dyYXBwZWQtY29udHJvbCc7XG5pbXBvcnQgeyBDbHJEYXRlQ29udGFpbmVyIH0gZnJvbSAnLi9kYXRlLWNvbnRhaW5lcic7XG5pbXBvcnQgeyBEYXlNb2RlbCB9IGZyb20gJy4vbW9kZWwvZGF5Lm1vZGVsJztcbmltcG9ydCB7IERhdGVGb3JtQ29udHJvbFNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9kYXRlLWZvcm0tY29udHJvbC5zZXJ2aWNlJztcbmltcG9ydCB7IERhdGVJT1NlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9kYXRlLWlvLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGF0ZU5hdmlnYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGF0ZS1uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGF0ZXBpY2tlckVuYWJsZWRTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGF0ZXBpY2tlci1lbmFibGVkLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGF0ZXBpY2tlckZvY3VzU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2RhdGVwaWNrZXItZm9jdXMuc2VydmljZSc7XG5pbXBvcnQgeyBkYXRlc0FyZUVxdWFsIH0gZnJvbSAnLi91dGlscy9kYXRlLXV0aWxzJztcblxuLy8gVGhlcmUgYXJlIGZvdXIgd2F5cyB0aGUgZGF0ZXBpY2tlciB2YWx1ZSBpcyBzZXRcbi8vIDEuIFZhbHVlIHNldCBieSB1c2VyIHR5cGluZyBpbnRvIHRleHQgaW5wdXQgYXMgYSBzdHJpbmcgZXg6ICcwMS8yOC8yMDE1J1xuLy8gMi4gVmFsdWUgc2V0IGV4cGxpY2l0bHkgYnkgQW5ndWxhciBGb3JtcyBBUElzIGFzIGEgc3RyaW5nIGV4OiAnMDEvMjgvMjAxNSdcbi8vIDMuIFZhbHVlIHNldCBieSB1c2VyIHZpYSBkYXRlcGlja2VyIFVJIGFzIGEgRGF0ZSBPYmplY3Rcbi8vIDQuIFZhbHVlIHNldCB2aWEgYGNsckRhdGVgIGlucHV0IGFzIGEgRGF0ZSBPYmplY3RcblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ2xyRGF0ZUlucHV0QmFzZVxuICBleHRlbmRzIFdyYXBwZWRGb3JtQ29udHJvbDxDbHJEYXRlQ29udGFpbmVyPlxuICBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95XG57XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kYXRlOiBEYXRlIHwgbnVsbCB8IHN0cmluZztcblxuICBASW5wdXQoKSBwbGFjZWhvbGRlcjogc3RyaW5nO1xuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBpbmRleCA9IDE7XG5cbiAgcHJpdmF0ZSBpbml0aWFsQ2xyRGF0ZUlucHV0VmFsdWU6IERhdGU7XG4gIHByaXZhdGUgcHJldmlvdXNEYXRlQ2hhbmdlOiBEYXRlO1xuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBkYXRlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8RGF0ZT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIGVsOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIHByb3RlY3RlZCBvdmVycmlkZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIEBTZWxmKClcbiAgICBAT3B0aW9uYWwoKVxuICAgIHByb3RlY3RlZCBjb250cm9sOiBOZ0NvbnRyb2wsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IENsckRhdGVDb250YWluZXIpKSBwcml2YXRlIGNvbnRhaW5lcjogQ2xyRGF0ZUNvbnRhaW5lcixcbiAgICBAT3B0aW9uYWwoKSBwcm90ZWN0ZWQgZGF0ZUlPU2VydmljZTogRGF0ZUlPU2VydmljZSxcbiAgICBAT3B0aW9uYWwoKSBwcm90ZWN0ZWQgZGF0ZU5hdmlnYXRpb25TZXJ2aWNlOiBEYXRlTmF2aWdhdGlvblNlcnZpY2UsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBkYXRlcGlja2VyRW5hYmxlZFNlcnZpY2U6IERhdGVwaWNrZXJFbmFibGVkU2VydmljZSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGRhdGVGb3JtQ29udHJvbFNlcnZpY2U6IERhdGVGb3JtQ29udHJvbFNlcnZpY2UsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnksXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBmb2N1c1NlcnZpY2U6IEZvY3VzU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgZGF0ZXBpY2tlckZvY3VzU2VydmljZTogRGF0ZXBpY2tlckZvY3VzU2VydmljZVxuICApIHtcbiAgICBzdXBlcih2aWV3Q29udGFpbmVyUmVmLCBDbHJEYXRlQ29udGFpbmVyLCBpbmplY3RvciwgY29udHJvbCwgcmVuZGVyZXIsIGVsKTtcbiAgfVxuXG4gIGdldCBkaXNhYmxlZCgpIHtcbiAgICBpZiAodGhpcy5kYXRlRm9ybUNvbnRyb2xTZXJ2aWNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRlRm9ybUNvbnRyb2xTZXJ2aWNlLmRpc2FibGVkIHx8ICEhdGhpcy5jb250cm9sPy5jb250cm9sPy5kaXNhYmxlZDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBASW5wdXQoJ2Rpc2FibGVkJylcbiAgQEhvc3RCaW5kaW5nKCdkaXNhYmxlZCcpXG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbiB8IHN0cmluZykge1xuICAgIGlmICh0aGlzLmRhdGVGb3JtQ29udHJvbFNlcnZpY2UpIHtcbiAgICAgIHRoaXMuZGF0ZUZvcm1Db250cm9sU2VydmljZS5zZXREaXNhYmxlZChpc0Jvb2xlYW5BdHRyaWJ1dGVTZXQodmFsdWUpKTtcbiAgICB9XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2F0dHIucGxhY2Vob2xkZXInKVxuICBnZXQgcGxhY2Vob2xkZXJUZXh0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXIgPyB0aGlzLnBsYWNlaG9sZGVyIDogdGhpcy5kYXRlSU9TZXJ2aWNlLnBsYWNlaG9sZGVyVGV4dDtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnYXR0ci50eXBlJylcbiAgZ2V0IGlucHV0VHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpICYmIHRoaXMudXNpbmdOYXRpdmVEYXRlcGlja2VyKCkgPyAnZGF0ZScgOiAndGV4dCc7XG4gIH1cblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgZ2V0IHVzZXJTZWxlY3RlZERheUNoYW5nZSgpOiBPYnNlcnZhYmxlPERheU1vZGVsPjtcblxuICBvdmVycmlkZSBuZ09uSW5pdCgpIHtcbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuICAgIHRoaXMucG9wdWxhdGVTZXJ2aWNlc0Zyb21Db250YWluZXJDb21wb25lbnQoKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgdGhpcy5saXN0ZW5Gb3JVc2VyU2VsZWN0ZWREYXlDaGFuZ2VzKCksXG4gICAgICB0aGlzLmxpc3RlbkZvckNvbnRyb2xWYWx1ZUNoYW5nZXMoKSxcbiAgICAgIHRoaXMubGlzdGVuRm9yVG91Y2hDaGFuZ2VzKCksXG4gICAgICB0aGlzLmxpc3RlbkZvckRpcnR5Q2hhbmdlcygpLFxuICAgICAgdGhpcy5saXN0ZW5Gb3JJbnB1dFJlZm9jdXMoKVxuICAgICk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gSSBkb24ndCBrbm93IHdoeSBJIGhhdmUgdG8gZG8gdGhpcyBidXQgYWZ0ZXIgdXNpbmcgdGhlIG5ldyBIb3N0V3JhcHBpbmcgTW9kdWxlIEkgaGF2ZSB0byBkZWxheSB0aGUgcHJvY2Vzc2luZ1xuICAgIC8vIG9mIHRoZSBpbml0aWFsIElucHV0IHNldCBieSB0aGUgdXNlciB0byBoZXJlLiBJZiBJIGRvIG5vdCAyIGlzc3VlcyBvY2N1cjpcbiAgICAvLyAxLiBUaGUgSW5wdXQgc2V0dGVyIGlzIGNhbGxlZCBiZWZvcmUgbmdPbkluaXQuIG5nT25Jbml0IGluaXRpYWxpemVzIHRoZSBzZXJ2aWNlcyB3aXRob3V0IHdoaWNoIHRoZSBzZXR0ZXIgZmFpbHMuXG4gICAgLy8gMi4gVGhlIFJlbmRlcmVyIGRvZXNuJ3Qgd29yayBiZWZvcmUgbmdBZnRlclZpZXdJbml0IChJdCB1c2VkIHRvIGJlZm9yZSB0aGUgbmV3IEhvc3RXcmFwcGluZyBNb2R1bGUgZm9yIHNvbWUgcmVhc29uKS5cbiAgICAvLyBJIG5lZWQgdGhlIHJlbmRlcmVyIHRvIHNldCB0aGUgdmFsdWUgcHJvcGVydHkgb24gdGhlIGlucHV0IHRvIG1ha2Ugc3VyZSB0aGF0IGlmIHRoZSB1c2VyIGhhcyBzdXBwbGllZCBhIERhdGVcbiAgICAvLyBpbnB1dCBvYmplY3QsIHdlIHJlZmxlY3QgaXQgd2l0aCB0aGUgcmlnaHQgZGF0ZSBvbiB0aGUgaW5wdXQgZmllbGQgdXNpbmcgdGhlIElPIHNlcnZpY2UuIEkgYW0gbm90IHN1cmUgaWZcbiAgICAvLyB0aGVzZSBhcmUgbWFqb3IgaXNzdWVzIG9yIG5vdCBidXQganVzdCBub3RpbmcgdGhlbSBkb3duIGhlcmUuXG4gICAgdGhpcy5wcm9jZXNzSW5pdGlhbElucHV0cygpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZm9jdXMnKVxuICBzZXRGb2N1c1N0YXRlcygpIHtcbiAgICB0aGlzLnNldEZvY3VzKHRydWUpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignYmx1cicpXG4gIG92ZXJyaWRlIHRyaWdnZXJWYWxpZGF0aW9uKCkge1xuICAgIHN1cGVyLnRyaWdnZXJWYWxpZGF0aW9uKCk7XG4gICAgdGhpcy5zZXRGb2N1cyhmYWxzZSk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjaGFuZ2UnLCBbJyRldmVudC50YXJnZXQnXSlcbiAgb25WYWx1ZUNoYW5nZSh0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgICBjb25zdCB2YWxpZERhdGVWYWx1ZSA9IHRoaXMuZGF0ZUlPU2VydmljZS5nZXREYXRlVmFsdWVGcm9tRGF0ZVN0cmluZyh0YXJnZXQudmFsdWUpO1xuICAgIGlmICh0aGlzLnVzaW5nQ2xhcml0eURhdGVwaWNrZXIoKSAmJiB2YWxpZERhdGVWYWx1ZSkge1xuICAgICAgdGhpcy51cGRhdGVEYXRlKHZhbGlkRGF0ZVZhbHVlLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMudXNpbmdOYXRpdmVEYXRlcGlja2VyKCkpIHtcbiAgICAgIGNvbnN0IFt5ZWFyLCBtb250aCwgZGF5XSA9IHRhcmdldC52YWx1ZS5zcGxpdCgnLScpO1xuICAgICAgdGhpcy51cGRhdGVEYXRlKG5ldyBEYXRlKCt5ZWFyLCArbW9udGggLSAxLCArZGF5KSwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW1pdERhdGVPdXRwdXQobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGRhdGVwaWNrZXJIYXNGb3JtQ29udHJvbCgpIHtcbiAgICByZXR1cm4gISF0aGlzLmNvbnRyb2w7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0RGF0ZShkYXRlOiBEYXRlIHwgc3RyaW5nKSB7XG4gICAgaWYgKHR5cGVvZiBkYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByZXZpb3VzRGF0ZUNoYW5nZSAhPT0gZGF0ZSkge1xuICAgICAgdGhpcy51cGRhdGVEYXRlKGRhdGUpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5pbml0aWFsQ2xyRGF0ZUlucHV0VmFsdWUpIHtcbiAgICAgIHRoaXMuaW5pdGlhbENsckRhdGVJbnB1dFZhbHVlID0gZGF0ZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVzaW5nQ2xhcml0eURhdGVwaWNrZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZXBpY2tlckVuYWJsZWRTZXJ2aWNlLmlzRW5hYmxlZDtcbiAgfVxuXG4gIHByaXZhdGUgdXNpbmdOYXRpdmVEYXRlcGlja2VyKCkge1xuICAgIHJldHVybiAhdGhpcy5kYXRlcGlja2VyRW5hYmxlZFNlcnZpY2UuaXNFbmFibGVkO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRGb2N1cyhmb2N1czogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLmZvY3VzU2VydmljZSkge1xuICAgICAgdGhpcy5mb2N1c1NlcnZpY2UuZm9jdXNlZCA9IGZvY3VzO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcG9wdWxhdGVTZXJ2aWNlc0Zyb21Db250YWluZXJDb21wb25lbnQoKSB7XG4gICAgaWYgKCF0aGlzLmNvbnRhaW5lcikge1xuICAgICAgdGhpcy5kYXRlSU9TZXJ2aWNlID0gdGhpcy5nZXRQcm92aWRlckZyb21Db250YWluZXIoRGF0ZUlPU2VydmljZSk7XG4gICAgICB0aGlzLmRhdGVOYXZpZ2F0aW9uU2VydmljZSA9IHRoaXMuZ2V0UHJvdmlkZXJGcm9tQ29udGFpbmVyKERhdGVOYXZpZ2F0aW9uU2VydmljZSk7XG4gICAgICB0aGlzLmRhdGVwaWNrZXJFbmFibGVkU2VydmljZSA9IHRoaXMuZ2V0UHJvdmlkZXJGcm9tQ29udGFpbmVyKERhdGVwaWNrZXJFbmFibGVkU2VydmljZSk7XG4gICAgICB0aGlzLmRhdGVGb3JtQ29udHJvbFNlcnZpY2UgPSB0aGlzLmdldFByb3ZpZGVyRnJvbUNvbnRhaW5lcihEYXRlRm9ybUNvbnRyb2xTZXJ2aWNlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHByb2Nlc3NJbml0aWFsSW5wdXRzKCkge1xuICAgIGlmICh0aGlzLmRhdGVwaWNrZXJIYXNGb3JtQ29udHJvbCgpKSB7XG4gICAgICB0aGlzLnVwZGF0ZURhdGUodGhpcy5kYXRlSU9TZXJ2aWNlLmdldERhdGVWYWx1ZUZyb21EYXRlU3RyaW5nKHRoaXMuY29udHJvbC52YWx1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVwZGF0ZURhdGUodGhpcy5pbml0aWFsQ2xyRGF0ZUlucHV0VmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlRGF0ZSh2YWx1ZTogRGF0ZSwgc2V0QnlVc2VySW50ZXJhY3Rpb24gPSBmYWxzZSkge1xuICAgIGNvbnN0IGRhdGUgPSB0aGlzLmdldFZhbGlkRGF0ZVZhbHVlRnJvbURhdGUodmFsdWUpO1xuXG4gICAgaWYgKHNldEJ5VXNlckludGVyYWN0aW9uKSB7XG4gICAgICB0aGlzLmVtaXREYXRlT3V0cHV0KGRhdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByZXZpb3VzRGF0ZUNoYW5nZSA9IGRhdGU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGF0ZU5hdmlnYXRpb25TZXJ2aWNlKSB7XG4gICAgICBjb25zdCBkYXlNb2RlbCA9IGRhdGUgPyBuZXcgRGF5TW9kZWwoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpKSA6IG51bGw7XG5cbiAgICAgIHRoaXMudXBkYXRlRGF5TW9kZWwoZGF5TW9kZWwpO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlSW5wdXQoZGF0ZSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUlucHV0KGRhdGU6IERhdGUpIHtcbiAgICBpZiAoZGF0ZSkge1xuICAgICAgY29uc3QgZGF0ZVN0cmluZyA9IHRoaXMuZGF0ZUlPU2VydmljZS50b0xvY2FsZURpc3BsYXlGb3JtYXRTdHJpbmcoZGF0ZSk7XG4gICAgICBpZiAodGhpcy51c2luZ05hdGl2ZURhdGVwaWNrZXIoKSkge1xuICAgICAgICAvLyB2YWx1ZUFzRGF0ZSBleHBlY3RzIFVUQywgZGF0ZSBmcm9tIGlucHV0IGlzIHRpbWUtem9uZWRcbiAgICAgICAgZGF0ZS5zZXRNaW51dGVzKGRhdGUuZ2V0TWludXRlcygpIC0gZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd2YWx1ZUFzRGF0ZScsIGRhdGUpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmRhdGVwaWNrZXJIYXNGb3JtQ29udHJvbCgpICYmIGRhdGVTdHJpbmcgIT09IHRoaXMuY29udHJvbC52YWx1ZSkge1xuICAgICAgICB0aGlzLmNvbnRyb2wuY29udHJvbC5zZXRWYWx1ZShkYXRlU3RyaW5nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAndmFsdWUnLCBkYXRlU3RyaW5nKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudmFsaWRhdGVEYXRlUmFuZ2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsICcnKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldFZhbGlkRGF0ZVZhbHVlRnJvbURhdGUoZGF0ZTogRGF0ZSkge1xuICAgIGlmICh0aGlzLmRhdGVJT1NlcnZpY2UpIHtcbiAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSB0aGlzLmRhdGVJT1NlcnZpY2UudG9Mb2NhbGVEaXNwbGF5Rm9ybWF0U3RyaW5nKGRhdGUpO1xuICAgICAgcmV0dXJuIHRoaXMuZGF0ZUlPU2VydmljZS5nZXREYXRlVmFsdWVGcm9tRGF0ZVN0cmluZyhkYXRlU3RyaW5nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBlbWl0RGF0ZU91dHB1dChkYXRlOiBEYXRlKSB7XG4gICAgaWYgKCFkYXRlc0FyZUVxdWFsKGRhdGUsIHRoaXMucHJldmlvdXNEYXRlQ2hhbmdlKSkge1xuICAgICAgdGhpcy5kYXRlQ2hhbmdlLmVtaXQoZGF0ZSk7XG4gICAgICB0aGlzLnByZXZpb3VzRGF0ZUNoYW5nZSA9IGRhdGU7XG4gICAgfSBlbHNlIGlmICghZGF0ZSAmJiB0aGlzLnByZXZpb3VzRGF0ZUNoYW5nZSkge1xuICAgICAgdGhpcy5kYXRlQ2hhbmdlLmVtaXQobnVsbCk7XG4gICAgICB0aGlzLnByZXZpb3VzRGF0ZUNoYW5nZSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JDb250cm9sVmFsdWVDaGFuZ2VzKCkge1xuICAgIGlmICh0aGlzLmRhdGVwaWNrZXJIYXNGb3JtQ29udHJvbCgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250cm9sLnZhbHVlQ2hhbmdlc1xuICAgICAgICAucGlwZShcbiAgICAgICAgICAvLyBvbmx5IHVwZGF0ZSBkYXRlIHZhbHVlIGlmIG5vdCBiZWluZyBzZXQgYnkgdXNlclxuICAgICAgICAgIGZpbHRlcigoKSA9PiAhdGhpcy5kYXRlcGlja2VyRm9jdXNTZXJ2aWNlLmVsZW1lbnRJc0ZvY3VzZWQodGhpcy5lbC5uYXRpdmVFbGVtZW50KSlcbiAgICAgICAgKVxuICAgICAgICAuc3Vic2NyaWJlKCh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLnVwZGF0ZURhdGUodGhpcy5kYXRlSU9TZXJ2aWNlLmdldERhdGVWYWx1ZUZyb21EYXRlU3RyaW5nKHZhbHVlKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGxpc3RlbkZvclVzZXJTZWxlY3RlZERheUNoYW5nZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMudXNlclNlbGVjdGVkRGF5Q2hhbmdlLnN1YnNjcmliZShkYXlNb2RlbCA9PiB0aGlzLnVwZGF0ZURhdGUoZGF5TW9kZWw/LnRvRGF0ZSgpLCB0cnVlKSk7XG4gIH1cblxuICBwcml2YXRlIGxpc3RlbkZvclRvdWNoQ2hhbmdlcygpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRlRm9ybUNvbnRyb2xTZXJ2aWNlLnRvdWNoZWRDaGFuZ2VcbiAgICAgIC5waXBlKGZpbHRlcigoKSA9PiB0aGlzLmRhdGVwaWNrZXJIYXNGb3JtQ29udHJvbCgpKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jb250cm9sLmNvbnRyb2wubWFya0FzVG91Y2hlZCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdGVuRm9yRGlydHlDaGFuZ2VzKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGVGb3JtQ29udHJvbFNlcnZpY2UuZGlydHlDaGFuZ2VcbiAgICAgIC5waXBlKGZpbHRlcigoKSA9PiB0aGlzLmRhdGVwaWNrZXJIYXNGb3JtQ29udHJvbCgpKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jb250cm9sLmNvbnRyb2wubWFya0FzRGlydHkoKSk7XG4gIH1cblxuICBwcml2YXRlIGxpc3RlbkZvcklucHV0UmVmb2N1cygpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWREYXlDaGFuZ2VcbiAgICAgIC5waXBlKGZpbHRlcihkYXRlID0+ICEhZGF0ZSAmJiAhdGhpcy5kYXRlTmF2aWdhdGlvblNlcnZpY2UuaXNSYW5nZVBpY2tlcikpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuZGF0ZXBpY2tlckZvY3VzU2VydmljZS5mb2N1c0lucHV0KHRoaXMuZWwubmF0aXZlRWxlbWVudCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluIGNhc2Ugb2YgZGF0ZSByYW5nZSBlcnJvciwgYm90aCBzdGFydCAmIGVuZCBkYXRlIGZpZWxkIHZhbGlkYXRpb24gaGFzIHRvIGJlIHRyaWdnZXJlZFxuICAgKiBpZiBlaXRoZXIgb2YgdGhlIGZpZWxkIGdldHMgdXBkYXRlZFxuICAgKi9cbiAgcHJpdmF0ZSB2YWxpZGF0ZURhdGVSYW5nZSgpIHtcbiAgICBpZiAodGhpcy5kYXRlTmF2aWdhdGlvblNlcnZpY2UuaXNSYW5nZVBpY2tlcikge1xuICAgICAgY29uc3QgcHJpbWFyeUNvbnRyb2wgPSB0aGlzLm5nQ29udHJvbFNlcnZpY2U/LmNvbnRyb2w7XG4gICAgICBjb25zdCBhZGRpdGlvbmFsQ29udHJvbHMgPSB0aGlzLm5nQ29udHJvbFNlcnZpY2U/LmFkZGl0aW9uYWxDb250cm9scztcbiAgICAgIGNvbnN0IGlzVmFsaWQgPSB0aGlzLmRhdGVOYXZpZ2F0aW9uU2VydmljZS5zZWxlY3RlZERheT8uaXNCZWZvcmUodGhpcy5kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWRFbmREYXksIHRydWUpO1xuICAgICAgaWYgKFxuICAgICAgICBpc1ZhbGlkICYmXG4gICAgICAgIChwcmltYXJ5Q29udHJvbD8uaGFzRXJyb3IoJ3JhbmdlJykgfHwgYWRkaXRpb25hbENvbnRyb2xzPy5zb21lKGNvbnRyb2wgPT4gY29udHJvbC5oYXNFcnJvcigncmFuZ2UnKSkpXG4gICAgICApIHtcbiAgICAgICAgcHJpbWFyeUNvbnRyb2wuY29udHJvbD8udXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7IGVtaXRFdmVudDogZmFsc2UgfSk7XG4gICAgICAgIGFkZGl0aW9uYWxDb250cm9scy5mb3JFYWNoKChuZ0NvbnRyb2w6IE5nQ29udHJvbCkgPT4ge1xuICAgICAgICAgIG5nQ29udHJvbD8uY29udHJvbD8udXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7IGVtaXRFdmVudDogZmFsc2UgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCB1cGRhdGVEYXlNb2RlbChkYXlNb2RlbDogRGF5TW9kZWwpOiB2b2lkO1xufVxuIl19
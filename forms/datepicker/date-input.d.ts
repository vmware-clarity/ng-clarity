import { AfterViewInit, ElementRef, EventEmitter, Injector, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { FocusService } from '../common/providers/focus.service';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrDateContainer } from './date-container';
import { DayModel } from './model/day.model';
import { DateFormControlService } from './providers/date-form-control.service';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerEnabledService } from './providers/datepicker-enabled.service';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import * as i0 from "@angular/core";
export declare abstract class ClrDateInputBase extends WrappedFormControl<ClrDateContainer> implements OnInit, AfterViewInit, OnDestroy {
    protected el: ElementRef<HTMLInputElement>;
    protected renderer: Renderer2;
    protected control: NgControl;
    private container;
    protected dateIOService: DateIOService;
    protected dateNavigationService: DateNavigationService;
    private datepickerEnabledService;
    private dateFormControlService;
    private platformId;
    private focusService;
    protected datepickerFocusService: DatepickerFocusService;
    static ngAcceptInputType_date: Date | null | string;
    placeholder: string;
    protected index: number;
    private initialClrDateInputValue;
    private previousDateChange;
    protected abstract dateChange: EventEmitter<Date>;
    constructor(viewContainerRef: ViewContainerRef, injector: Injector, el: ElementRef<HTMLInputElement>, renderer: Renderer2, control: NgControl, container: ClrDateContainer, dateIOService: DateIOService, dateNavigationService: DateNavigationService, datepickerEnabledService: DatepickerEnabledService, dateFormControlService: DateFormControlService, platformId: any, focusService: FocusService, datepickerFocusService: DatepickerFocusService);
    get disabled(): boolean | string;
    set disabled(value: boolean | string);
    get placeholderText(): string;
    get inputType(): string;
    protected abstract get userSelectedDayChange(): Observable<DayModel>;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    setFocusStates(): void;
    triggerValidation(): void;
    onValueChange(target: HTMLInputElement): void;
    protected datepickerHasFormControl(): boolean;
    protected setDate(date: Date | string): void;
    private usingClarityDatepicker;
    private usingNativeDatepicker;
    private setFocus;
    private populateServicesFromContainerComponent;
    private processInitialInputs;
    private updateDate;
    private updateInput;
    private getValidDateValueFromDate;
    private emitDateOutput;
    private listenForControlValueChanges;
    private listenForUserSelectedDayChanges;
    private listenForTouchChanges;
    private listenForDirtyChanges;
    private listenForInputRefocus;
    /**
     * In case of date range error, both start & end date field validation has to be triggered
     * if either of the field gets updated
     */
    private validateDateRange;
    protected abstract updateDayModel(dayModel: DayModel): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDateInputBase, [null, null, null, null, { optional: true; self: true; }, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }, null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDateInputBase, never, never, { "placeholder": "placeholder"; "disabled": "disabled"; }, {}, never, never, false, never>;
}

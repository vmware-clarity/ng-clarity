/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  PLATFORM_ID,
  Renderer2,
  Self,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { filter } from 'rxjs/operators';

import { isBooleanAttributeSet } from '../../utils/component/is-boolean-attribute-set';
import { FocusService } from '../common/providers/focus.service';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrDateContainer } from './date-container';
import { DateFormControlService } from './providers/date-form-control.service';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerEnabledService } from './providers/datepicker-enabled.service';
import { DatepickerFocusService } from './providers/datepicker-focus.service';

// There are four ways the datepicker value is set
// 1. Value set by user typing into text input as a string ex: '01/28/2015'
// 2. Value set explicitly by Angular Forms APIs as a string ex: '01/28/2015'
// 3. Value set by user via datepicker UI as a Date Object
// 4. Value set via `clrDate` input as a Date Object

@Directive()
export class ClrDateInputBase extends WrappedFormControl<ClrDateContainer> implements OnInit, AfterViewInit, OnDestroy {
  static ngAcceptInputType_date: Date | null | string;

  @Input() placeholder: string;

  protected override index = 1;

  constructor(
    viewContainerRef: ViewContainerRef,
    injector: Injector,
    protected override el: ElementRef,
    protected override renderer: Renderer2,
    @Inject(DOCUMENT) protected document: any,
    @Self()
    @Optional()
    protected control: NgControl,
    @Optional() private container: ClrDateContainer,
    @Optional() protected dateIOService: DateIOService,
    @Optional() protected dateNavigationService: DateNavigationService,
    @Optional() private datepickerEnabledService: DatepickerEnabledService,
    @Optional() private dateFormControlService: DateFormControlService,
    @Inject(PLATFORM_ID) private platformId: any,
    @Optional() private focusService: FocusService,
    protected datepickerFocusService: DatepickerFocusService
  ) {
    super(viewContainerRef, ClrDateContainer, injector, control, renderer, el);
  }

  @Input()
  set min(dateString: string) {
    if (!this.dateNavigationService.isRangePicker) {
      this.dateIOService.setMinDate(dateString);
      this.triggerControlValidation();
    }
  }

  @Input()
  set max(dateString: string) {
    if (!this.dateNavigationService.isRangePicker) {
      this.dateIOService.setMaxDate(dateString);
      this.triggerControlValidation();
    }
  }

  get disabled() {
    if (this.dateFormControlService) {
      return this.dateFormControlService.disabled || !!this.control?.control?.disabled;
    }
    return null;
  }

  @Input('disabled')
  @HostBinding('disabled')
  set disabled(value: boolean | string) {
    if (this.dateFormControlService) {
      this.dateFormControlService.setDisabled(isBooleanAttributeSet(value));
    }
  }

  @HostBinding('attr.placeholder')
  get placeholderText(): string {
    return this.placeholder ? this.placeholder : this.dateIOService.placeholderText;
  }

  @HostBinding('attr.type')
  get inputType(): string {
    return isPlatformBrowser(this.platformId) && this.usingNativeDatepicker() ? 'date' : 'text';
  }

  override ngOnInit() {
    super.ngOnInit();
    this.populateServicesFromContainerComponent();

    this.subscriptions.push(this.listenForTouchChanges(), this.listenForDirtyChanges(), this.listenForInputRefocus());
  }

  ngAfterViewInit() {
    // I don't know why I have to do this but after using the new HostWrapping Module I have to delay the processing
    // of the initial Input set by the user to here. If I do not 2 issues occur:
    // 1. The Input setter is called before ngOnInit. ngOnInit initializes the services without which the setter fails.
    // 2. The Renderer doesn't work before ngAfterViewInit (It used to before the new HostWrapping Module for some reason).
    // I need the renderer to set the value property on the input to make sure that if the user has supplied a Date
    // input object, we reflect it with the right date on the input field using the IO service. I am not sure if
    // these are major issues or not but just noting them down here.
  }

  @HostListener('focus')
  setFocusStates() {
    this.setFocus(true);
  }

  @HostListener('blur')
  override triggerValidation() {
    super.triggerValidation();
    this.setFocus(false);
  }

  protected usingClarityDatepicker() {
    return this.datepickerEnabledService.isEnabled;
  }

  protected usingNativeDatepicker() {
    return !this.datepickerEnabledService.isEnabled;
  }

  protected updateInput(date: Date) {
    if (date) {
      const dateString = this.dateIOService.toLocaleDisplayFormatString(date);
      if (this.usingNativeDatepicker()) {
        // valueAsDate expects UTC, date from input is time-zoned
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        this.renderer.setProperty(this.el.nativeElement, 'valueAsDate', date);
      } else if (this.datepickerHasFormControl() && dateString !== this.control.value) {
        this.control.control.setValue(dateString);
      } else {
        this.renderer.setProperty(this.el.nativeElement, 'value', dateString);
      }
      this.validateDateRange();
    } else {
      this.renderer.setProperty(this.el.nativeElement, 'value', '');
    }
  }

  protected getValidDateValueFromDate(date: Date) {
    if (this.dateIOService) {
      const dateString = this.dateIOService.toLocaleDisplayFormatString(date);
      return this.dateIOService.getDateValueFromDateString(dateString);
    } else {
      return null;
    }
  }

  protected datepickerHasFormControl() {
    return !!this.control;
  }

  /**
   * Incase of date range error, both start & end date field valdiation has to be triggered
   * if either of the field gets updated
   */
  protected validateDateRange() {
    const primaryControl = this.ngControlService?.getControl();
    const secondaryControl = this.ngControlService?.getSecondaryControl();
    const isValid = this.dateNavigationService.selectedDay?.isBefore(this.dateNavigationService.selectedEndDay, true);
    if (isValid && (primaryControl?.hasError('range') || secondaryControl?.hasError('range'))) {
      primaryControl.control?.updateValueAndValidity();
      secondaryControl.control?.updateValueAndValidity();
    }
  }

  protected processBeforeEmittingDate(date) {
    if (!this.dateIOService.isMonthViewAllowed() || !this.dateIOService.isDayViewAllowed()) {
      return this.dateIOService.toLocaleDisplayFormatString(date);
    }
    return date;
  }

  private setFocus(focus: boolean) {
    if (this.focusService) {
      this.focusService.focused = focus;
    }
  }

  private triggerControlValidation() {
    if (this.datepickerHasFormControl()) {
      // Set `emitEvent` to false to prevent unnecessary value change event. Status change event will be emitted by `setErrors` below.
      this.control.control?.updateValueAndValidity({ emitEvent: false });
      this.control.control?.setErrors(this.control.control.errors);
    }
  }

  private populateServicesFromContainerComponent() {
    if (!this.container) {
      this.dateIOService = this.getProviderFromContainer(DateIOService);
      this.dateNavigationService = this.getProviderFromContainer(DateNavigationService);
      this.datepickerEnabledService = this.getProviderFromContainer(DatepickerEnabledService);
      this.dateFormControlService = this.getProviderFromContainer(DateFormControlService);
    }
  }

  private listenForTouchChanges() {
    return this.dateFormControlService.touchedChange
      .pipe(filter(() => this.datepickerHasFormControl()))
      .subscribe(() => this.control.control.markAsTouched());
  }

  private listenForDirtyChanges() {
    return this.dateFormControlService.dirtyChange
      .pipe(filter(() => this.datepickerHasFormControl()))
      .subscribe(() => this.control.control.markAsDirty());
  }

  private listenForInputRefocus() {
    return this.dateNavigationService.selectedDayChange
      .pipe(filter(date => !!date && !this.dateNavigationService.isRangePicker))
      .subscribe(() => this.datepickerFocusService.focusInput(this.el.nativeElement));
  }
}

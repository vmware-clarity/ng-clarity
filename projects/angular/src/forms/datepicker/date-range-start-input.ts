/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { ClrDateInputBase } from './date-input-base';
import { DayModel } from './model/day.model';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { datesAreEqual } from './utils/date-utils';

@Directive({
  selector: '[clrRangeStartDate]',
  host: {
    '[class.clr-input]': 'true',
  },
  providers: [DatepickerFocusService],
})
export class ClrDateRangeStartInput extends ClrDateInputBase implements AfterViewInit {
  @Output('clrRangeStartDateChange') dateChange = new EventEmitter<Date>(false);

  @Input('inputWidth') inputWidth = 13;

  private initialClrDateInputValue: Date;
  private previousDateChange: Date;

  @Input('clrRangeStartDate')
  set date(date: Date | string) {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    if (this.previousDateChange !== date) {
      this.updateDate(this.getValidDateValueFromDate(date as Date));
    }

    if (!this.initialClrDateInputValue) {
      this.initialClrDateInputValue = date as Date;
    }
  }

  @HostBinding('attr.size')
  get inputSize() {
    return this.inputWidth;
  }

  @HostListener('change', ['$event.target'])
  onValueChange(target: HTMLInputElement) {
    const validDateValue = this.dateIOService.getDateValueFromDateString(target.value);
    if (this.usingClarityDatepicker() && validDateValue) {
      this.updateDate(validDateValue, true);
    } else if (this.usingNativeDatepicker()) {
      const [year, month, day] = target.value.split('-');
      this.updateDate(new Date(+year, +month - 1, +day), true);
    } else {
      this.emitDateOutput(null);
    }
  }

  override ngOnInit() {
    super.ngOnInit();

    this.subscriptions.push(this.listenForUserSelectedDayChanges(), this.listenForControlValueChanges());
  }

  override ngAfterViewInit() {
    // I don't know why I have to do this but after using the new HostWrapping Module I have to delay the processing
    // of the initial Input set by the user to here. If I do not 2 issues occur:
    // 1. The Input setter is called before ngOnInit. ngOnInit initializes the services without which the setter fails.
    // 2. The Renderer doesn't work before ngAfterViewInit (It used to before the new HostWrapping Module for some reason).
    // I need the renderer to set the value property on the input to make sure that if the user has supplied a Date
    // input object, we reflect it with the right date on the input field using the IO service. I am not sure if
    // these are major issues or not but just noting them down here.
    this.processInitialInputs();
    this.addSeparatorSymbol();
  }

  triggerControlInputValidation() {
    if (this.datepickerHasFormControl()) {
      this.control.control?.updateValueAndValidity({ emitEvent: false });
      this.control.control?.setErrors(this.control.control.errors);
    }
  }

  protected updateDate(value: Date, setByUserInteraction = false) {
    const date = this.getValidDateValueFromDate(value);

    if (setByUserInteraction) {
      this.emitDateOutput(date);
    } else {
      this.previousDateChange = date;
    }

    if (this.dateNavigationService) {
      this.dateNavigationService.selectedDay = date
        ? new DayModel(date.getFullYear(), date.getMonth(), date.getDate())
        : null;
    }

    this.updateInput(date);
  }

  private listenForControlValueChanges() {
    return of(this.datepickerHasFormControl())
      .pipe(
        filter(hasControl => hasControl),
        switchMap(() => this.control.valueChanges),
        // only update date value if not being set by user
        filter(() => !this.datepickerFocusService.elementIsFocused(this.el.nativeElement))
      )
      .subscribe((value: string) => this.updateDate(this.dateIOService.getDateValueFromDateString(value)));
  }

  private listenForUserSelectedDayChanges() {
    return this.dateNavigationService.selectedDayChange.subscribe(dayModel =>
      this.updateDate(dayModel?.toDate(), true)
    );
  }

  private emitDateOutput(date: Date) {
    if (!datesAreEqual(date, this.previousDateChange)) {
      this.dateChange.emit(this.processBeforeEmittingDate(date));
      this.previousDateChange = date;
    } else if (!date && this.previousDateChange) {
      this.dateChange.emit(null);
      this.previousDateChange = null;
    }
  }

  private processInitialInputs() {
    if (this.datepickerHasFormControl()) {
      this.updateDate(this.dateIOService.getDateValueFromDateString(this.control.value));
    } else {
      this.updateDate(this.initialClrDateInputValue);
    }
  }

  private addSeparatorSymbol() {
    const seperatorSpan = this.document.createElement('span');
    seperatorSpan.className = 'date-range-separator';
    seperatorSpan.textContent = '-';
    this.el.nativeElement.parentNode?.insertBefore(seperatorSpan, this.el.nativeElement.nextSibling);
  }
}

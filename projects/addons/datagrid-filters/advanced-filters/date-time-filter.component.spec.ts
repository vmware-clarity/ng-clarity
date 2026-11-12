/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule, DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrDatepickerModule, ClrInputModule, ClrLocaleDateFormat, ClrSelectModule } from '@clr/angular/forms';
import { ClrIcon } from '@clr/angular/icon';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { DateTimeFilterComponent } from './date-time-filter.component';
import { FilterFormComponent } from './filter-form.component';
import { ComparisonOperator, LogicalOperator, TimeSpan } from '../model/datagrid-filters.enums';
import { DateTimePropertyDefinition, PropertyFilter, PropertyPredicate } from '../model/datagrid-filters.interfaces';
import { addDays, toIsoDate } from '../model/date-time-editor-state';
import { clockChangeDays } from '../model/date-time-editor-state.spec';

import Spy = jasmine.Spy;

const augustNinth = '2023-08-09';
// The clrDate inputs hold en-US locale strings (MM/dd/yyyy) in tests.
const enUsDateFormat = new ClrLocaleDateFormat('en-US');
const toInput = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number);
  return enUsDateFormat.format(new Date(year, month - 1, day));
};
// Emitted filters also carry editorState; these assertions check the criteria only.
const withCriteria = (filter: PropertyFilter) =>
  jasmine.objectContaining<PropertyFilter>(
    filter.operator === undefined
      ? { criteria: filter.criteria }
      : { criteria: filter.criteria, operator: filter.operator }
  );
const dateTimePropertyName = 'lastUpdated';
const dateTimePropertyDisplayName = 'Last Updated';
const dateTimeProperty: DateTimePropertyDefinition = new DateTimePropertyDefinition(
  dateTimePropertyDisplayName,
  dateTimePropertyName
);

const dateTimeoperations = [
  ComparisonOperator.Equals,
  ComparisonOperator.Before,
  ComparisonOperator.BeforeOrEqualTo,
  ComparisonOperator.After,
  ComparisonOperator.AfterOrEqualTo,
  ComparisonOperator.CustomRange,
  ComparisonOperator.IsEmpty,
  ComparisonOperator.LastDay,
  ComparisonOperator.LastWeek,
  ComparisonOperator.LastMonth,
  ComparisonOperator.LastYear,
  ComparisonOperator.TimeSpan,
];

const submitBtnSelector = 'button[data-test-id=submitBtn]';
const operatorSelector = 'select[formControlName=operator]';
const dateInputSelector = 'input[formControlName=dateValue]';
const timeSpanInputSelector = 'input[formControlName=timeSpanValue]';
const timeSpanSelector = 'select[formControlName=timeSpan]';

const equalsPredicate1 = new PropertyPredicate();
equalsPredicate1.filterableProperty = dateTimeProperty;
equalsPredicate1.operator = ComparisonOperator.GreaterThanOrEqualTo;
equalsPredicate1.value = '2023-08-09T00:00:00+06:00';

const equalsPredicate2 = new PropertyPredicate();
equalsPredicate2.filterableProperty = dateTimeProperty;
equalsPredicate2.operator = ComparisonOperator.LessThan;
equalsPredicate2.value = '2023-08-10T00:00:00+06:00';

const afterPredicate = new PropertyPredicate();
afterPredicate.filterableProperty = dateTimeProperty;
afterPredicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
afterPredicate.value = `2023-08-11T00:00:00+06:00`;

const customRangePredicate1 = new PropertyPredicate();
customRangePredicate1.filterableProperty = dateTimeProperty;
customRangePredicate1.operator = ComparisonOperator.GreaterThanOrEqualTo;
customRangePredicate1.value = `2023-08-11T15:15:00+06:00`;

const customRangePredicate2 = new PropertyPredicate();
customRangePredicate2.filterableProperty = dateTimeProperty;
customRangePredicate2.operator = ComparisonOperator.LessThan;
customRangePredicate2.value = `2023-08-11T15:19:00+06:00`;

const timeSpanPredicate = new PropertyPredicate();
timeSpanPredicate.filterableProperty = dateTimeProperty;
timeSpanPredicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
timeSpanPredicate.value = `2023-08-11T15:15:00+06:00`;

const lastMinutePredicate = new PropertyPredicate();
lastMinutePredicate.filterableProperty = dateTimeProperty;
lastMinutePredicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
lastMinutePredicate.value = `2023-10-20T17:50:00+06:00`;

const lastHourPredicate = new PropertyPredicate();
lastHourPredicate.filterableProperty = dateTimeProperty;
lastHourPredicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
lastHourPredicate.value = `2023-10-20T16:51:00+06:00`;

const lastDayPredicate = new PropertyPredicate();
lastDayPredicate.filterableProperty = dateTimeProperty;
lastDayPredicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
lastDayPredicate.value = `2023-10-19T17:51:00+06:00`;

const lastWeekPredicate = new PropertyPredicate();
lastWeekPredicate.filterableProperty = dateTimeProperty;
lastWeekPredicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
lastWeekPredicate.value = `2023-10-13T17:51:00+06:00`;

const lastMonthPredicate = new PropertyPredicate();
lastMonthPredicate.filterableProperty = dateTimeProperty;
lastMonthPredicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
lastMonthPredicate.value = `2023-09-20T17:51:00+06:00`;

const lastYearPredicate = new PropertyPredicate();
lastYearPredicate.filterableProperty = dateTimeProperty;
lastYearPredicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
lastYearPredicate.value = `2022-10-20T17:51:00+06:00`;

const currentTimePredicate = new PropertyPredicate();
currentTimePredicate.filterableProperty = dateTimeProperty;
currentTimePredicate.operator = ComparisonOperator.LessThanOrEqualTo;
currentTimePredicate.value = `2023-10-20T17:51:00+06:00`;

const equalsPropertyFilter: PropertyFilter = new PropertyFilter();
equalsPropertyFilter.criteria = [equalsPredicate1, equalsPredicate2];
equalsPropertyFilter.operator = LogicalOperator.And;

const customRangePropertyFilter = new PropertyFilter();
customRangePropertyFilter.criteria = [customRangePredicate1, customRangePredicate2];
customRangePropertyFilter.operator = LogicalOperator.And;

const lastMinutePropertyFilter: PropertyFilter = new PropertyFilter();
lastMinutePropertyFilter.criteria = [lastMinutePredicate, currentTimePredicate];
lastMinutePropertyFilter.operator = LogicalOperator.And;

const lastHourPropertyFilter: PropertyFilter = new PropertyFilter();
lastHourPropertyFilter.criteria = [lastHourPredicate, currentTimePredicate];
lastHourPropertyFilter.operator = LogicalOperator.And;

const lastDayPropertyFilter: PropertyFilter = new PropertyFilter();
lastDayPropertyFilter.criteria = [lastDayPredicate, currentTimePredicate];
lastDayPropertyFilter.operator = LogicalOperator.And;

const lastWeekPropertyFilter: PropertyFilter = new PropertyFilter();
lastWeekPropertyFilter.criteria = [lastWeekPredicate, currentTimePredicate];
lastWeekPropertyFilter.operator = LogicalOperator.And;

const lastMonthPropertyFilter: PropertyFilter = new PropertyFilter();
lastMonthPropertyFilter.criteria = [lastMonthPredicate, currentTimePredicate];
lastMonthPropertyFilter.operator = LogicalOperator.And;

const lastYearPropertyFilter: PropertyFilter = new PropertyFilter();
lastYearPropertyFilter.criteria = [lastYearPredicate, currentTimePredicate];
lastYearPropertyFilter.operator = LogicalOperator.And;

const baseTime = new Date(2023, 9, 20, 17, 51);

export interface ThisTest {
  fixture: ComponentFixture<DateTimeFilterComponent>;
  component: DateTimeFilterComponent;
  dateOffsetSpy: Spy;
}

function mockCurrentTime(): void {
  jasmine.clock().uninstall();
  jasmine.clock().install();
  jasmine.clock().mockDate(baseTime);
}

describe('DateTimeFilterComponent', () => {
  beforeEach(function (this: ThisTest) {
    TestBed.configureTestingModule({
      imports: [
        ClrDatepickerModule,
        ClrInputModule,
        ClrSelectModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClrIcon,
      ],
      declarations: [DateTimeFilterComponent, FilterFormComponent],
      providers: [DatagridFiltersStrings, DatePipe],
    });
    this.fixture = TestBed.createComponent(DateTimeFilterComponent);
    this.component = this.fixture.componentInstance;
    this.component.filterProperty = dateTimeProperty;
    this.dateOffsetSpy = spyOn(Date.prototype, 'getTimezoneOffset').and.returnValue(-360);
    mockCurrentTime();
  });

  afterEach(function (this: ThisTest) {
    jasmine.clock().uninstall();
    this.fixture.destroy();
  });
  describe('in normal mode', () => {
    beforeEach(function (this: ThisTest) {
      this.fixture.detectChanges();
    });
    it('is properly initialized', function (this: ThisTest) {
      expect(this.component).toBeTruthy();

      expect(this.component.comparisonOperators).toEqual(dateTimeoperations);
      expect(this.component.dateTimeFilterForm.controls['dateValue'].value).toEqual('');
      expect(this.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.AfterOrEqualTo);

      expect(this.component.dateTimeFilterForm.valid).toBeFalsy();
    });
    it('emits an empty event on cancel', function (this: ThisTest) {
      spyOn(this.component.filterCriteriaChange, 'emit');
      const cancelDateTimeFilterButton = this.fixture.debugElement.nativeElement.querySelector(
        'button[data-test-id=cancelBtn]'
      );
      expect(cancelDateTimeFilterButton).toBeTruthy();

      cancelDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith();
    });
    it('emits a property filter event on submit with operator equals', function (this: ThisTest) {
      spyOn(this.component.filterCriteriaChange, 'emit');
      const submitDateTimeFilterButton: HTMLButtonElement =
        this.fixture.debugElement.nativeElement.querySelector(submitBtnSelector);
      expect(submitDateTimeFilterButton).toBeTruthy();
      expect(submitDateTimeFilterButton.disabled).toBeTruthy();
      expect(this.component.dateTimeFilterForm.valid).toBeFalsy();

      const operatorSelect: HTMLSelectElement = this.fixture.debugElement.nativeElement.querySelector(operatorSelector);
      expect(operatorSelect).toBeTruthy();
      expect(operatorSelect.options.length).toEqual(12);

      operatorSelect.value = operatorSelect.options[0].value;
      operatorSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.Equals);

      const dateValueInput: HTMLInputElement = this.fixture.debugElement.nativeElement.querySelector(dateInputSelector);
      dateValueInput.value = toInput(augustNinth);
      dateValueInput.dispatchEvent(new Event('input'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['dateValue'].value).toEqual(toInput(augustNinth));
      expect(submitDateTimeFilterButton.disabled).toBeFalsy();
      expect(this.component.dateTimeFilterForm.valid).toBeTruthy();

      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(withCriteria(equalsPropertyFilter));
    });
    it('emits a property filter event on submit with operator after', function (this: ThisTest) {
      spyOn(this.component.filterCriteriaChange, 'emit');
      const afterPropertyFilter = new PropertyFilter();
      afterPropertyFilter.criteria = [afterPredicate];
      const submitDateTimeFilterButton: HTMLButtonElement =
        this.fixture.debugElement.nativeElement.querySelector(submitBtnSelector);

      const operatorSelect: HTMLSelectElement = this.fixture.debugElement.nativeElement.querySelector(operatorSelector);
      operatorSelect.value = operatorSelect.options[3].value;
      operatorSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.After);

      const dateValueInput: HTMLInputElement = this.fixture.debugElement.nativeElement.querySelector(dateInputSelector);
      dateValueInput.value = toInput('2023-08-10');
      dateValueInput.dispatchEvent(new Event('input'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['dateValue'].value).toEqual(toInput('2023-08-10'));
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(withCriteria(afterPropertyFilter));
    });
    it('uses one date range picker for a custom range without times', function (this: ThisTest) {
      spyOn(this.component.filterCriteriaChange, 'emit');
      this.fixture.detectChanges();
      const element: HTMLElement = this.fixture.nativeElement;
      const operatorSelect: HTMLSelectElement = element.querySelector(operatorSelector);
      operatorSelect.value = operatorSelect.options[5].value;
      operatorSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();

      const range = element.querySelector('clr-date-range-container');
      expect(range).not.toBeNull();
      expect(range.querySelector('input[formControlName=dateValue][clrStartDate]')).not.toBeNull();
      expect(range.querySelector('input[formControlName=dateValueTo][clrEndDate]')).not.toBeNull();
      expect(element.querySelector('clr-date-container')).toBeNull();

      this.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput('2023-08-11'));
      this.component.dateTimeFilterForm.controls['dateValueTo'].setValue(toInput('2023-08-15'));
      this.fixture.detectChanges();
      (element.querySelector(submitBtnSelector) as HTMLButtonElement).click();

      const emitted = (this.component.filterCriteriaChange.emit as Spy).calls.mostRecent().args[0] as PropertyFilter;
      expect(emitted.operator).toBe(LogicalOperator.And);
      expect(emitted.criteria.map(predicate => predicate.operator)).toEqual([
        ComparisonOperator.GreaterThanOrEqualTo,
        ComparisonOperator.LessThan,
      ]);
      expect(emitted.criteria[0].value).toContain('2023-08-11T00:00:00');
      // The end date is inclusive: the filter ends at the start of the next day.
      expect(emitted.criteria[1].value).toContain('2023-08-16T00:00:00');
    });

    it('switches to separate date pickers when a custom range uses times', function (this: ThisTest) {
      this.fixture.detectChanges();
      const element: HTMLElement = this.fixture.nativeElement;
      const operatorSelect: HTMLSelectElement = element.querySelector(operatorSelector);
      operatorSelect.value = operatorSelect.options[5].value;
      operatorSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      (element.querySelector('[data-test-id="add-button"]') as HTMLButtonElement).click();
      this.fixture.detectChanges();

      expect(element.querySelector('clr-date-range-container')).toBeNull();
      expect(element.querySelectorAll('clr-date-container').length).toBe(2);
      expect(element.querySelector('input[formControlName=timeValueTo]')).not.toBeNull();
    });

    it('emits a property filter event on submit with operator custom range', function (this: ThisTest) {
      spyOn(this.component.filterCriteriaChange, 'emit');
      this.component.timePredicate = true;

      const submitDateTimeFilterButton: HTMLButtonElement =
        this.fixture.debugElement.nativeElement.querySelector(submitBtnSelector);

      const operatorSelect: HTMLSelectElement = this.fixture.debugElement.nativeElement.querySelector(operatorSelector);
      operatorSelect.value = operatorSelect.options[5].value;
      operatorSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.CustomRange);

      const dateValueInput: HTMLInputElement = this.fixture.debugElement.nativeElement.querySelector(dateInputSelector);
      const dummyDate = '2023-08-11';
      dateValueInput.value = toInput(dummyDate);
      dateValueInput.dispatchEvent(new Event('input'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['dateValue'].value).toEqual(toInput(dummyDate));

      const dateValueToInput: HTMLInputElement = this.fixture.debugElement.nativeElement.querySelector(
        'input[formControlName=dateValueTo]'
      );
      dateValueToInput.value = toInput(dummyDate);
      dateValueToInput.dispatchEvent(new Event('input'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['dateValueTo'].value).toEqual(toInput(dummyDate));

      const timeValueInput: HTMLInputElement = this.fixture.debugElement.nativeElement.querySelector(
        'input[formControlName=timeValue]'
      );
      timeValueInput.value = '15:15';
      timeValueInput.dispatchEvent(new Event('input'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['timeValue'].value).toEqual('15:15');

      const timeValueToInput: HTMLInputElement = this.fixture.debugElement.nativeElement.querySelector(
        'input[formControlName=timeValueTo]'
      );
      timeValueToInput.value = '15:18';
      timeValueToInput.dispatchEvent(new Event('input'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['timeValueTo'].value).toEqual('15:18');

      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(withCriteria(customRangePropertyFilter));
    });
    it('emits a property filter event on submit with relative operator', function (this: ThisTest) {
      spyOn(this.component.filterCriteriaChange, 'emit');
      const submitDateTimeFilterButton: HTMLButtonElement =
        this.fixture.debugElement.nativeElement.querySelector(submitBtnSelector);

      const operatorSelect: HTMLSelectElement = this.fixture.debugElement.nativeElement.querySelector(operatorSelector);
      operatorSelect.value = operatorSelect.options[7].value;
      operatorSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.LastDay);
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(withCriteria(lastDayPropertyFilter));

      operatorSelect.value = operatorSelect.options[8].value;
      operatorSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.LastWeek);
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(2);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(withCriteria(lastWeekPropertyFilter));

      operatorSelect.value = operatorSelect.options[9].value;
      operatorSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.LastMonth);
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(3);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(withCriteria(lastMonthPropertyFilter));

      operatorSelect.value = operatorSelect.options[10].value;
      operatorSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.LastYear);
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(4);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(withCriteria(lastYearPropertyFilter));
    });
    it('emits a property filter event on submit with time span operator', function (this: ThisTest) {
      spyOn(this.component.filterCriteriaChange, 'emit');
      const submitDateTimeFilterButton: HTMLButtonElement =
        this.fixture.debugElement.nativeElement.querySelector(submitBtnSelector);

      const operatorSelect: HTMLSelectElement = this.fixture.debugElement.nativeElement.querySelector(operatorSelector);
      operatorSelect.value = operatorSelect.options[11].value;
      operatorSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.TimeSpan);
      const timeSpanValueInput: HTMLInputElement =
        this.fixture.debugElement.nativeElement.querySelector(timeSpanInputSelector);
      timeSpanValueInput.value = '1';
      timeSpanValueInput.dispatchEvent(new Event('input'));
      const timeSpanSelect: HTMLSelectElement = this.fixture.debugElement.nativeElement.querySelector(timeSpanSelector);
      timeSpanSelect.value = timeSpanSelect.options[0].value;
      timeSpanSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Minutes);
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(withCriteria(lastMinutePropertyFilter));

      timeSpanSelect.value = timeSpanSelect.options[1].value;
      timeSpanSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Hours);
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(2);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(withCriteria(lastHourPropertyFilter));

      timeSpanSelect.value = timeSpanSelect.options[2].value;
      timeSpanSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Days);
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(3);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(withCriteria(lastDayPropertyFilter));

      timeSpanSelect.value = timeSpanSelect.options[3].value;
      timeSpanSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Weeks);
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(4);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(withCriteria(lastWeekPropertyFilter));

      timeSpanSelect.value = timeSpanSelect.options[4].value;
      timeSpanSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Months);
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(5);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(withCriteria(lastMonthPropertyFilter));

      timeSpanSelect.value = timeSpanSelect.options[5].value;
      timeSpanSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Years);
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(6);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(withCriteria(lastYearPropertyFilter));
    });
  });
  describe('in edit mode', () => {
    it('is properly initialized with custom range operator', function (this: ThisTest) {
      this.component.propertyFilter = {
        ...customRangePropertyFilter,
        editorState: {
          operator: ComparisonOperator.CustomRange,
          value: '2023-10-23T15:15',
          valueTo: '2023-10-24T15:18',
        },
      };

      this.component.ngOnChanges();
      this.fixture.detectChanges();

      expect(this.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.CustomRange);
      expect(this.component.dateTimeFilterForm.controls['dateValue'].value).toEqual(toInput('2023-10-23'));
      expect(this.component.dateTimeFilterForm.controls['dateValueTo'].value).toEqual(toInput('2023-10-24'));

      expect(this.component.dateTimeFilterForm.controls['timeValue'].value).toEqual('15:15');
      expect(this.component.dateTimeFilterForm.controls['timeValueTo'].value).toEqual('15:18');
    });
    it('is properly initialized with time span operator', function (this: ThisTest) {
      this.component.propertyFilter = {
        ...lastYearPropertyFilter,
        editorState: { operator: ComparisonOperator.TimeSpan, timeSpanValue: 5, timeSpan: TimeSpan.Years },
      };

      this.component.ngOnChanges();
      this.fixture.detectChanges();

      expect(this.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.TimeSpan);
      expect(this.component.dateTimeFilterForm.controls['timeSpanValue'].value).toEqual(5);
      expect(this.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Years);
    });
  });
  describe('on the days the clocks change', () => {
    const days = clockChangeDays(2026);
    const nextDay = (iso: string) => toIsoDate(addDays(new Date(`${iso}T00:00:00`), 1));
    // Emitted values end with the local UTC offset; the local date and time come first.
    const localPart = (value: string) => value.substring(0, 19);
    const emittedCriteria = (component: DateTimeFilterComponent): PropertyPredicate[] =>
      ((component.filterCriteriaChange.emit as Spy).calls.mostRecent().args[0] as PropertyFilter).criteria;

    beforeEach(function (this: ThisTest) {
      if (!days.length) {
        pending('The time zone of this run has no daylight saving');
      }
      spyOn(this.component.filterCriteriaChange, 'emit');
      this.fixture.detectChanges();
    });

    it('emits Equals as midnight to the next midnight, however many hours the day has', function (this: ThisTest) {
      days.forEach(day => {
        this.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.Equals);
        this.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput(day));
        this.component.onApplyButtonClick();
        expect(emittedCriteria(this.component).map(predicate => localPart(predicate.value)))
          .withContext(day)
          .toEqual([`${day}T00:00:00`, `${nextDay(day)}T00:00:00`]);
      });
    });

    it('emits Before or equal to as before the next midnight', function (this: ThisTest) {
      days.forEach(day => {
        this.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.BeforeOrEqualTo);
        this.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput(day));
        this.component.onApplyButtonClick();
        expect(emittedCriteria(this.component).map(predicate => localPart(predicate.value)))
          .withContext(day)
          .toEqual([`${nextDay(day)}T00:00:00`]);
      });
    });

    it('ends a custom range at the midnight after its end date', function (this: ThisTest) {
      days.forEach(day => {
        this.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.CustomRange);
        this.fixture.detectChanges();
        this.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput('2026-01-01'));
        this.component.dateTimeFilterForm.controls['dateValueTo'].setValue(toInput(day));
        this.component.onApplyButtonClick();
        expect(emittedCriteria(this.component).map(predicate => localPart(predicate.value)))
          .withContext(day)
          .toEqual(['2026-01-01T00:00:00', `${nextDay(day)}T00:00:00`]);
      });
    });
  });

  describe('editor state', () => {
    it('stores its choices on the emitted filter, not on the field definition', function (this: ThisTest) {
      spyOn(this.component.filterCriteriaChange, 'emit');
      this.fixture.detectChanges();
      const before = { ...dateTimeProperty };
      this.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.Before);
      this.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput('2023-08-09'));
      this.component.onApplyButtonClick();
      const emitted = (this.component.filterCriteriaChange.emit as Spy).calls.mostRecent().args[0] as PropertyFilter;
      expect(emitted.editorState).toEqual({ operator: ComparisonOperator.Before, value: '2023-08-09' });
      expect({ ...dateTimeProperty }).toEqual(before);
    });

    it('emits a new filter object on every Apply', function (this: ThisTest) {
      spyOn(this.component.filterCriteriaChange, 'emit');
      this.fixture.detectChanges();
      this.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput('2023-08-09'));
      this.component.onApplyButtonClick();
      this.component.onApplyButtonClick();
      const [first, second] = (this.component.filterCriteriaChange.emit as Spy).calls.allArgs().map(args => args[0]);
      expect(first).not.toBe(second);
    });

    it('leaves an emitted filter unchanged after a later Apply', function (this: ThisTest) {
      spyOn(this.component.filterCriteriaChange, 'emit');
      this.fixture.detectChanges();
      this.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.Equals);
      this.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput('2023-08-09'));
      this.component.onApplyButtonClick();
      const first: PropertyFilter = (this.component.filterCriteriaChange.emit as Spy).calls.mostRecent().args[0];
      const snapshot = first.criteria.map(predicate => ({ operator: predicate.operator, value: predicate.value }));

      this.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput('2024-01-15'));
      this.component.onApplyButtonClick();
      this.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.IsEmpty);
      this.component.onApplyButtonClick();

      expect(first.criteria.map(predicate => ({ operator: predicate.operator, value: predicate.value }))).toEqual(
        snapshot
      );
    });

    it('opens a preset without editor state from its criteria', function (this: ThisTest) {
      const preset = new PropertyFilter();
      preset.operator = LogicalOperator.And;
      preset.criteria = [
        { filterableProperty: dateTimeProperty, operator: ComparisonOperator.Before, value: '2026-01-01T00:00' },
      ];
      this.component.propertyFilter = preset;
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.Before);
      expect(this.component.dateTimeFilterForm.controls['dateValue'].value).toEqual(toInput('2026-01-01'));
    });
  });

  describe('preset ranges', () => {
    const wholeWeek = { label: 'First week of August', value: [new Date(2023, 7, 1), new Date(2023, 7, 7)] };
    const workingHours = {
      label: 'Working hours',
      value: [new Date(2023, 7, 11, 9, 0), new Date(2023, 7, 11, 17, 30)],
    };
    const invalid = [
      { label: 'One date', value: [new Date(2023, 7, 1)] },
      { label: 'Strings', value: ['2023-08-01', '2023-08-07'] as unknown as Date[] },
      { label: 'Invalid date', value: [new Date('nope'), new Date(2023, 7, 7)] },
    ];
    const rangeButtons = (element: HTMLElement) =>
      Array.from(element.querySelectorAll<HTMLButtonElement>('[data-test-id="date-range-option"]'));

    function openCustomRange(this: ThisTest, withTime: boolean): HTMLElement {
      this.component.filterProperty = new DateTimePropertyDefinition(
        dateTimePropertyDisplayName,
        dateTimePropertyName,
        undefined,
        false,
        [wholeWeek, ...invalid, workingHours]
      );
      this.fixture.detectChanges();
      const element: HTMLElement = this.fixture.nativeElement;
      const operatorSelect: HTMLSelectElement = element.querySelector(operatorSelector);
      operatorSelect.value = operatorSelect.options[5].value;
      operatorSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      if (withTime) {
        (element.querySelector('[data-test-id="add-button"]') as HTMLButtonElement).click();
        this.fixture.detectChanges();
      }
      return element;
    }

    it('keeps only options with two valid dates and shows no buttons without times', function (this: ThisTest) {
      const element = openCustomRange.call(this, false);
      expect(this.component.rangeOptions).toEqual([wholeWeek, workingHours]);
      expect(element.querySelector('clr-date-range-container')).not.toBeNull();
      expect(rangeButtons(element).length).toBe(0);
    });

    it('lists the options as buttons under the operator with times', function (this: ThisTest) {
      const element = openCustomRange.call(this, true);
      const buttons = rangeButtons(element);
      expect(buttons.map(button => button.textContent.trim())).toEqual([wholeWeek.label, workingHours.label]);
      expect(buttons.every(button => button.type === 'button')).toBeTrue();
      expect(element.querySelector('.date-range-options').getAttribute('aria-label')).toBe('Preset ranges');
    });

    it('fills whole days as 00:00 to 23:59 and emits up to the next midnight', function (this: ThisTest) {
      spyOn(this.component.filterCriteriaChange, 'emit');
      const element = openCustomRange.call(this, true);
      rangeButtons(element)[0].click();
      this.fixture.detectChanges();

      const form = this.component.dateTimeFilterForm;
      expect(form.value.dateValue).toBe(toInput('2023-08-01'));
      expect(form.value.dateValueTo).toBe(toInput('2023-08-07'));
      expect(form.value.timeValue).toBe('00:00');
      expect(form.value.timeValueTo).toBe('23:59');

      (element.querySelector(submitBtnSelector) as HTMLButtonElement).click();
      const emitted = (this.component.filterCriteriaChange.emit as Spy).calls.mostRecent().args[0] as PropertyFilter;
      expect(emitted.criteria[0].value).toContain('2023-08-01T00:00:00');
      expect(emitted.criteria[1].value).toContain('2023-08-08T00:00:00');
    });

    it('fills the times of a timed range, ending one minute after its inclusive end', function (this: ThisTest) {
      spyOn(this.component.filterCriteriaChange, 'emit');
      const element = openCustomRange.call(this, true);
      rangeButtons(element)[1].click();
      this.fixture.detectChanges();

      expect(this.component.dateTimeFilterForm.value.timeValue).toBe('09:00');
      expect(this.component.dateTimeFilterForm.value.timeValueTo).toBe('17:30');

      (element.querySelector(submitBtnSelector) as HTMLButtonElement).click();
      const emitted = (this.component.filterCriteriaChange.emit as Spy).calls.mostRecent().args[0] as PropertyFilter;
      expect(emitted.criteria[0].value).toContain('2023-08-11T09:00:00');
      expect(emitted.criteria[1].value).toContain('2023-08-11T17:31:00');
    });
  });

  describe('custom range order with times', () => {
    function openCustomRangeWithTime(this: ThisTest): HTMLElement {
      this.fixture.detectChanges();
      const element: HTMLElement = this.fixture.nativeElement;
      const operatorSelect: HTMLSelectElement = element.querySelector(operatorSelector);
      operatorSelect.value = operatorSelect.options[5].value;
      operatorSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      (element.querySelector('[data-test-id="add-button"]') as HTMLButtonElement).click();
      this.fixture.detectChanges();
      return element;
    }

    function setRange(this: ThisTest, from: string, fromTime: string, to: string, toTime: string): void {
      this.component.dateTimeFilterForm.patchValue({
        dateValue: toInput(from),
        timeValue: fromTime,
        dateValueTo: toInput(to),
        timeValueTo: toTime,
      });
      this.fixture.detectChanges();
    }

    it('rejects a From date later than the To date', function (this: ThisTest) {
      const element = openCustomRangeWithTime.call(this);
      setRange.call(this, '2023-08-15', '10:00', '2023-08-11', '10:00');

      const dateValueTo = this.component.dateTimeFilterForm.get('dateValueTo');
      expect(dateValueTo.hasError('range')).toBeTrue();
      expect(this.component.dateTimeFilterForm.valid).toBeFalse();
      expect(element.textContent).toContain('End date must not be before start date');
    });

    it('rejects a From time later than the To time on the same day', function (this: ThisTest) {
      openCustomRangeWithTime.call(this);
      setRange.call(this, '2023-08-11', '15:00', '2023-08-11', '09:00');
      expect(this.component.dateTimeFilterForm.get('dateValueTo').hasError('range')).toBeTrue();
    });

    it('accepts equal From and To, and clears the error once the order is fixed', function (this: ThisTest) {
      openCustomRangeWithTime.call(this);
      setRange.call(this, '2023-08-11', '15:00', '2023-08-11', '09:00');
      setRange.call(this, '2023-08-11', '09:00', '2023-08-11', '09:00');
      expect(this.component.dateTimeFilterForm.get('dateValueTo').hasError('range')).toBeFalse();
      expect(this.component.dateTimeFilterForm.valid).toBeTrue();
    });
  });

  describe('additional coverage', () => {
    beforeEach(function (this: ThisTest) {
      this.fixture.detectChanges();
    });

    it('should handle includeSeconds=true correctly by preserving seconds in the value', function (this: ThisTest) {
      // Arrange
      this.component.includeSeconds = true;
      this.component.enableTimePredicate();
      this.fixture.detectChanges();

      // Act: Set operator to Equals (to trigger buildEqualsDateTimePredicates -> getFromDateTimePredicate)
      this.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.Equals);
      this.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput(augustNinth));
      // When includeSeconds is true, the component expects the input to contain the seconds
      this.component.dateTimeFilterForm.controls['timeValue'].setValue('12:30:45');

      spyOn(this.component.filterCriteriaChange, 'emit');
      this.component.onApplyButtonClick();

      // Assert
      const emitSpy = this.component.filterCriteriaChange.emit as jasmine.Spy;
      const emittedFilter = emitSpy.calls.mostRecent().args[0] as PropertyFilter;
      const primaryPredicate = emittedFilter.criteria[0];

      // Should contain the explicit seconds provided, not appended with :00
      // Note: +06:00 comes from the mocked timezone offset in beforeEach
      expect(primaryPredicate.value).toContain('2023-08-09T12:30:45');
    });

    it('should submit form when Enter key is pressed and form is valid', function (this: ThisTest) {
      spyOn(this.component, 'onApplyButtonClick');

      // Arrange: Make form valid
      this.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput('2023-01-01'));

      const event = new KeyboardEvent('keypress', { key: 'Enter' });
      spyOn(event, 'stopPropagation');
      spyOn(event, 'preventDefault');

      // Act
      this.component.onInputKeyPress(event);

      // Assert
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(this.component.onApplyButtonClick).toHaveBeenCalled();
    });

    it('should NOT submit form when Enter key is pressed and form is invalid', function (this: ThisTest) {
      spyOn(this.component, 'onApplyButtonClick');

      // Arrange: Make form invalid (dateValue is required by default)
      this.component.dateTimeFilterForm.controls['dateValue'].setValue('');

      const event = new KeyboardEvent('keypress', { key: 'Enter' });

      // Act
      this.component.onInputKeyPress(event);

      // Assert
      expect(this.component.onApplyButtonClick).not.toHaveBeenCalled();
    });

    it('should remove time controls when disableTimePredicate is called', function (this: ThisTest) {
      // Arrange: Enable first to verify they exist
      this.component.isCustomRangePredicate = true; // To test removal of 'To' controls
      this.component.enableTimePredicate();

      expect(this.component.dateTimeFilterForm.contains('timeValue')).toBeTrue();
      expect(this.component.dateTimeFilterForm.contains('timeValueTo')).toBeTrue();

      // Act
      this.component.disableTimePredicate();

      // Assert
      expect(this.component.timePredicate).toBeFalse();
      expect(this.component.dateTimeFilterForm.contains('timeValue')).toBeFalse();
      expect(this.component.dateTimeFilterForm.contains('timeValueTo')).toBeFalse();
    });

    describe('getSinglePredicate switch cases', () => {
      it('should handle Before operator', function (this: ThisTest) {
        spyOn(this.component.filterCriteriaChange, 'emit');

        // Act
        this.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.Before);
        this.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput(augustNinth));
        this.component.onApplyButtonClick();

        // Assert
        const emitSpy = this.component.filterCriteriaChange.emit as jasmine.Spy;
        const filter = emitSpy.calls.mostRecent().args[0] as PropertyFilter;

        // Before 2023-08-09 means < 2023-08-09T00:00:00
        expect(filter.criteria[0].operator).toEqual(ComparisonOperator.LessThan);
        expect(filter.criteria[0].value).toContain('2023-08-09T00:00:00');
      });

      it('should handle BeforeOrEqualTo operator', function (this: ThisTest) {
        spyOn(this.component.filterCriteriaChange, 'emit');

        // Act
        this.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.BeforeOrEqualTo);
        this.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput(augustNinth));
        this.component.onApplyButtonClick();

        // Assert
        const emitSpy = this.component.filterCriteriaChange.emit as jasmine.Spy;
        const filter = emitSpy.calls.mostRecent().args[0] as PropertyFilter;

        // BeforeOrEqualTo uses getFromDateTimePredicate(true), which adds 1 day (if no time)
        // So <= 08-09 effectively becomes < 08-10
        expect(filter.criteria[0].operator).toEqual(ComparisonOperator.LessThan);
        expect(filter.criteria[0].value).toContain('2023-08-10T00:00:00');
      });

      it('should handle After operator', function (this: ThisTest) {
        spyOn(this.component.filterCriteriaChange, 'emit');

        // Act
        this.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.After);
        this.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput(augustNinth));
        this.component.onApplyButtonClick();

        // Assert
        const emitSpy = this.component.filterCriteriaChange.emit as jasmine.Spy;
        const filter = emitSpy.calls.mostRecent().args[0] as PropertyFilter;

        // After uses getFromDateTimePredicate(true), adding 1 day
        // After 08-09 effectively means >= 08-10
        expect(filter.criteria[0].operator).toEqual(ComparisonOperator.GreaterThanOrEqualTo);
        expect(filter.criteria[0].value).toContain('2023-08-10T00:00:00');
      });
    });

    it('should handle getToDateTimePredicate else block (CustomRange without Time)', function (this: ThisTest) {
      spyOn(this.component.filterCriteriaChange, 'emit');

      // Arrange
      this.component.timePredicate = false; // Ensure we hit the 'else' block

      // Act
      this.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.CustomRange);
      // Trigger UI update to add controls (normally handled by subscription, but safer to be explicit in test setup logic)
      // But here we just set values because enableCustomRangePredicate was likely called by valueChanges in real component
      this.fixture.detectChanges();

      this.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput(augustNinth)); // From
      this.component.dateTimeFilterForm.controls['dateValueTo'].setValue(toInput('2023-08-15')); // To

      this.component.onApplyButtonClick();

      // Assert
      const emitSpy = this.component.filterCriteriaChange.emit as jasmine.Spy;
      const filter = emitSpy.calls.mostRecent().args[0] as PropertyFilter;

      // Index 0 is Primary (From), Index 1 is Secondary (To)
      const toPredicate = filter.criteria[1];

      // Logic: getToDateTimePredicate else block appends T00:00:00 then adds 1 day via getCustomDate
      // 2023-08-15 -> 2023-08-16T00:00:00
      expect(toPredicate.operator).toEqual(ComparisonOperator.LessThan);
      expect(toPredicate.value).toContain('2023-08-16T00:00:00');
    });
  });
});

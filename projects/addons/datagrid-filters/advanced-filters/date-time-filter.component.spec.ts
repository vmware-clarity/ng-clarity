/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrDatepickerModule, ClrInputModule, ClrLocaleDateFormat, ClrSelectModule } from '@clr/angular/forms';
import { ClrIcon } from '@clr/angular/icon';
import { renderFixture } from '@clr/angular/utils/testing';
import type { Mock, MockInstance } from 'vitest';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { DateTimeFilterComponent } from './date-time-filter.component';
import { FilterFormComponent } from './filter-form.component';
import { ComparisonOperator, LogicalOperator, TimeSpan } from '../model/datagrid-filters.enums';
import { DateTimePropertyDefinition, PropertyFilter, PropertyPredicate } from '../model/datagrid-filters.interfaces';
import { addDays, toIsoDate } from '../model/date-time-editor-state';
import { clockChangeDays } from '../model/date-time-editor-state.mock';

const augustNinth = '2023-08-09';
// The clrDate inputs hold en-US locale strings (MM/dd/yyyy) in tests.
const enUsDateFormat = new ClrLocaleDateFormat('en-US');
const toInput = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number);
  return enUsDateFormat.format(new Date(year, month - 1, day));
};
// Emitted filters also carry editorState; these assertions check the criteria only.
const withCriteria = (filter: PropertyFilter) =>
  expect.objectContaining<Partial<PropertyFilter>>(
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
  dateOffsetSpy: MockInstance<() => number>;
}

function mockCurrentTime(): void {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(baseTime);
}

describe('DateTimeFilterComponent', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  // The component is OnPush: after changing its fields directly (not through inputs or its template), mark its own
  // view, so the next render refreshes it instead of failing the exhaustive no-changes check.
  const markComponentForCheck = () => testContext.fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();

  beforeEach(() => {
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
    testContext.fixture = TestBed.createComponent(DateTimeFilterComponent);
    testContext.component = testContext.fixture.componentInstance;
    testContext.component.filterProperty = dateTimeProperty;
    testContext.dateOffsetSpy = vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-360);
    mockCurrentTime();
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });
  describe('in normal mode', () => {
    beforeEach(() => {
      renderFixture(testContext.fixture);
    });
    it('is properly initialized', () => {
      expect(testContext.component).toBeTruthy();

      expect(testContext.component.comparisonOperators).toEqual(dateTimeoperations);
      expect(testContext.component.dateTimeFilterForm.controls['dateValue'].value).toEqual('');
      expect(testContext.component.dateTimeFilterForm.controls['operator'].value).toEqual(
        ComparisonOperator.AfterOrEqualTo
      );

      expect(testContext.component.dateTimeFilterForm.valid).toBeFalsy();
    });
    it('emits an empty event on cancel', () => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      const cancelDateTimeFilterButton = testContext.fixture.debugElement.nativeElement.querySelector(
        'button[data-test-id=cancelBtn]'
      );
      expect(cancelDateTimeFilterButton).toBeTruthy();

      cancelDateTimeFilterButton.click();
      renderFixture(testContext.fixture);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith();
    });
    it('emits a property filter event on submit with operator equals', () => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      const submitDateTimeFilterButton: HTMLButtonElement =
        testContext.fixture.debugElement.nativeElement.querySelector(submitBtnSelector);
      expect(submitDateTimeFilterButton).toBeTruthy();
      expect(submitDateTimeFilterButton.disabled).toBeTruthy();
      expect(testContext.component.dateTimeFilterForm.valid).toBeFalsy();

      const operatorSelect: HTMLSelectElement =
        testContext.fixture.debugElement.nativeElement.querySelector(operatorSelector);
      expect(operatorSelect).toBeTruthy();
      expect(operatorSelect.options.length).toEqual(12);

      operatorSelect.value = operatorSelect.options[0].value;
      operatorSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.Equals);

      const dateValueInput: HTMLInputElement =
        testContext.fixture.debugElement.nativeElement.querySelector(dateInputSelector);
      dateValueInput.value = toInput(augustNinth);
      dateValueInput.dispatchEvent(new Event('input'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['dateValue'].value).toEqual(toInput(augustNinth));
      expect(submitDateTimeFilterButton.disabled).toBeFalsy();
      expect(testContext.component.dateTimeFilterForm.valid).toBeTruthy();

      submitDateTimeFilterButton.click();
      renderFixture(testContext.fixture);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(withCriteria(equalsPropertyFilter));
    });
    it('emits a property filter event on submit with operator after', () => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      const afterPropertyFilter = new PropertyFilter();
      afterPropertyFilter.criteria = [afterPredicate];
      const submitDateTimeFilterButton: HTMLButtonElement =
        testContext.fixture.debugElement.nativeElement.querySelector(submitBtnSelector);

      const operatorSelect: HTMLSelectElement =
        testContext.fixture.debugElement.nativeElement.querySelector(operatorSelector);
      operatorSelect.value = operatorSelect.options[3].value;
      operatorSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.After);

      const dateValueInput: HTMLInputElement =
        testContext.fixture.debugElement.nativeElement.querySelector(dateInputSelector);
      dateValueInput.value = toInput('2023-08-10');
      dateValueInput.dispatchEvent(new Event('input'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['dateValue'].value).toEqual(toInput('2023-08-10'));
      submitDateTimeFilterButton.click();
      renderFixture(testContext.fixture);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(withCriteria(afterPropertyFilter));
    });
    it('uses one date range picker for a custom range without times', () => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      renderFixture(testContext.fixture);
      const element: HTMLElement = testContext.fixture.nativeElement;
      const operatorSelect: HTMLSelectElement = element.querySelector(operatorSelector)!;
      operatorSelect.value = operatorSelect.options[5].value;
      operatorSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);

      const range = element.querySelector('clr-date-range-container')!;
      expect(range).not.toBeNull();
      expect(range.querySelector('input[formControlName=dateValue][clrStartDate]')).not.toBeNull();
      expect(range.querySelector('input[formControlName=dateValueTo][clrEndDate]')).not.toBeNull();
      expect(element.querySelector('clr-date-container')).toBeNull();

      testContext.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput('2023-08-11'));
      testContext.component.dateTimeFilterForm.controls['dateValueTo'].setValue(toInput('2023-08-15'));
      renderFixture(testContext.fixture);
      (element.querySelector(submitBtnSelector) as HTMLButtonElement).click();

      const emitted = (testContext.component.filterCriteriaChange.emit as Mock).mock.lastCall![0] as PropertyFilter;
      expect(emitted.operator).toBe(LogicalOperator.And);
      expect(emitted.criteria.map(predicate => predicate.operator)).toEqual([
        ComparisonOperator.GreaterThanOrEqualTo,
        ComparisonOperator.LessThan,
      ]);
      expect(emitted.criteria[0].value).toContain('2023-08-11T00:00:00');
      // The end date is inclusive: the filter ends at the start of the next day.
      expect(emitted.criteria[1].value).toContain('2023-08-16T00:00:00');
    });

    it('switches to separate date pickers when a custom range uses times', () => {
      renderFixture(testContext.fixture);
      const element: HTMLElement = testContext.fixture.nativeElement;
      const operatorSelect: HTMLSelectElement = element.querySelector(operatorSelector)!;
      operatorSelect.value = operatorSelect.options[5].value;
      operatorSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      (element.querySelector('[data-test-id="add-button"]') as HTMLButtonElement).click();
      renderFixture(testContext.fixture);

      expect(element.querySelector('clr-date-range-container')).toBeNull();
      expect(element.querySelectorAll('clr-date-container').length).toBe(2);
      expect(element.querySelector('input[formControlName=timeValueTo]')).not.toBeNull();
    });

    it('emits a property filter event on submit with operator custom range', () => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      testContext.component.timePredicate = true;

      const submitDateTimeFilterButton: HTMLButtonElement =
        testContext.fixture.debugElement.nativeElement.querySelector(submitBtnSelector);

      const operatorSelect: HTMLSelectElement =
        testContext.fixture.debugElement.nativeElement.querySelector(operatorSelector);
      operatorSelect.value = operatorSelect.options[5].value;
      operatorSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['operator'].value).toEqual(
        ComparisonOperator.CustomRange
      );

      const dateValueInput: HTMLInputElement =
        testContext.fixture.debugElement.nativeElement.querySelector(dateInputSelector);
      const dummyDate = '2023-08-11';
      dateValueInput.value = toInput(dummyDate);
      dateValueInput.dispatchEvent(new Event('input'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['dateValue'].value).toEqual(toInput(dummyDate));

      const dateValueToInput: HTMLInputElement = testContext.fixture.debugElement.nativeElement.querySelector(
        'input[formControlName=dateValueTo]'
      );
      dateValueToInput.value = toInput(dummyDate);
      dateValueToInput.dispatchEvent(new Event('input'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['dateValueTo'].value).toEqual(toInput(dummyDate));

      const timeValueInput: HTMLInputElement = testContext.fixture.debugElement.nativeElement.querySelector(
        'input[formControlName=timeValue]'
      );
      timeValueInput.value = '15:15';
      timeValueInput.dispatchEvent(new Event('input'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['timeValue'].value).toEqual('15:15');

      const timeValueToInput: HTMLInputElement = testContext.fixture.debugElement.nativeElement.querySelector(
        'input[formControlName=timeValueTo]'
      );
      timeValueToInput.value = '15:18';
      timeValueToInput.dispatchEvent(new Event('input'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['timeValueTo'].value).toEqual('15:18');

      submitDateTimeFilterButton.click();
      renderFixture(testContext.fixture);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(
        withCriteria(customRangePropertyFilter)
      );
    });
    it('emits a property filter event on submit with relative operator', () => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      const submitDateTimeFilterButton: HTMLButtonElement =
        testContext.fixture.debugElement.nativeElement.querySelector(submitBtnSelector);

      const operatorSelect: HTMLSelectElement =
        testContext.fixture.debugElement.nativeElement.querySelector(operatorSelector);
      operatorSelect.value = operatorSelect.options[7].value;
      operatorSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.LastDay);
      submitDateTimeFilterButton.click();
      renderFixture(testContext.fixture);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(withCriteria(lastDayPropertyFilter));

      operatorSelect.value = operatorSelect.options[8].value;
      operatorSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.LastWeek);
      submitDateTimeFilterButton.click();
      renderFixture(testContext.fixture);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(2);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(
        withCriteria(lastWeekPropertyFilter)
      );

      operatorSelect.value = operatorSelect.options[9].value;
      operatorSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.LastMonth);
      submitDateTimeFilterButton.click();
      renderFixture(testContext.fixture);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(3);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(
        withCriteria(lastMonthPropertyFilter)
      );

      operatorSelect.value = operatorSelect.options[10].value;
      operatorSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.LastYear);
      submitDateTimeFilterButton.click();
      renderFixture(testContext.fixture);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(4);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(
        withCriteria(lastYearPropertyFilter)
      );
    });
    it('emits a property filter event on submit with time span operator', () => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      const submitDateTimeFilterButton: HTMLButtonElement =
        testContext.fixture.debugElement.nativeElement.querySelector(submitBtnSelector);

      const operatorSelect: HTMLSelectElement =
        testContext.fixture.debugElement.nativeElement.querySelector(operatorSelector);
      operatorSelect.value = operatorSelect.options[11].value;
      operatorSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.TimeSpan);
      const timeSpanValueInput: HTMLInputElement =
        testContext.fixture.debugElement.nativeElement.querySelector(timeSpanInputSelector);
      timeSpanValueInput.value = '1';
      timeSpanValueInput.dispatchEvent(new Event('input'));
      const timeSpanSelect: HTMLSelectElement =
        testContext.fixture.debugElement.nativeElement.querySelector(timeSpanSelector);
      timeSpanSelect.value = timeSpanSelect.options[0].value;
      timeSpanSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Minutes);
      submitDateTimeFilterButton.click();
      renderFixture(testContext.fixture);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(
        withCriteria(lastMinutePropertyFilter)
      );

      timeSpanSelect.value = timeSpanSelect.options[1].value;
      timeSpanSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Hours);
      submitDateTimeFilterButton.click();
      renderFixture(testContext.fixture);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(2);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(
        withCriteria(lastHourPropertyFilter)
      );

      timeSpanSelect.value = timeSpanSelect.options[2].value;
      timeSpanSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Days);
      submitDateTimeFilterButton.click();
      renderFixture(testContext.fixture);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(3);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(withCriteria(lastDayPropertyFilter));

      timeSpanSelect.value = timeSpanSelect.options[3].value;
      timeSpanSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Weeks);
      submitDateTimeFilterButton.click();
      renderFixture(testContext.fixture);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(4);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(
        withCriteria(lastWeekPropertyFilter)
      );

      timeSpanSelect.value = timeSpanSelect.options[4].value;
      timeSpanSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Months);
      submitDateTimeFilterButton.click();
      renderFixture(testContext.fixture);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(5);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(
        withCriteria(lastMonthPropertyFilter)
      );

      timeSpanSelect.value = timeSpanSelect.options[5].value;
      timeSpanSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Years);
      submitDateTimeFilterButton.click();
      renderFixture(testContext.fixture);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(6);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(
        withCriteria(lastYearPropertyFilter)
      );
    });
  });
  describe('in edit mode', () => {
    it('is properly initialized with custom range operator', () => {
      testContext.component.propertyFilter = {
        ...customRangePropertyFilter,
        editorState: {
          operator: ComparisonOperator.CustomRange,
          value: '2023-10-23T15:15',
          valueTo: '2023-10-24T15:18',
        },
      };

      testContext.component.ngOnChanges();
      renderFixture(testContext.fixture);

      expect(testContext.component.dateTimeFilterForm.controls['operator'].value).toEqual(
        ComparisonOperator.CustomRange
      );
      expect(testContext.component.dateTimeFilterForm.controls['dateValue'].value).toEqual(toInput('2023-10-23'));
      expect(testContext.component.dateTimeFilterForm.controls['dateValueTo'].value).toEqual(toInput('2023-10-24'));

      expect(testContext.component.dateTimeFilterForm.controls['timeValue'].value).toEqual('15:15');
      expect(testContext.component.dateTimeFilterForm.controls['timeValueTo'].value).toEqual('15:18');
    });
    it('is properly initialized with time span operator', () => {
      testContext.component.propertyFilter = {
        ...lastYearPropertyFilter,
        editorState: { operator: ComparisonOperator.TimeSpan, timeSpanValue: 5, timeSpan: TimeSpan.Years },
      };

      testContext.component.ngOnChanges();
      renderFixture(testContext.fixture);

      expect(testContext.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.TimeSpan);
      expect(testContext.component.dateTimeFilterForm.controls['timeSpanValue'].value).toEqual(5);
      expect(testContext.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Years);
    });
  });
  const days = clockChangeDays(2026);

  // Skipped in a time zone without daylight saving (e.g. UTC).
  describe.skipIf(!days.length)('on the days the clocks change', () => {
    const nextDay = (iso: string) => toIsoDate(addDays(new Date(`${iso}T00:00:00`), 1));
    // Emitted values end with the local UTC offset; the local date and time come first.
    const localPart = (value: string) => value.substring(0, 19);
    const emittedCriteria = (component: DateTimeFilterComponent): PropertyPredicate[] =>
      ((component.filterCriteriaChange.emit as Mock).mock.lastCall![0] as PropertyFilter).criteria;

    beforeEach(() => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      renderFixture(testContext.fixture);
    });

    it('emits Equals as midnight to the next midnight, however many hours the day has', () => {
      days.forEach(day => {
        testContext.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.Equals);
        testContext.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput(day));
        testContext.component.onApplyButtonClick();
        expect(
          emittedCriteria(testContext.component).map(predicate => localPart(predicate.value)),
          day
        ).toEqual([`${day}T00:00:00`, `${nextDay(day)}T00:00:00`]);
      });
    });

    it('emits Before or equal to as before the next midnight', () => {
      days.forEach(day => {
        testContext.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.BeforeOrEqualTo);
        testContext.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput(day));
        testContext.component.onApplyButtonClick();
        expect(
          emittedCriteria(testContext.component).map(predicate => localPart(predicate.value)),
          day
        ).toEqual([`${nextDay(day)}T00:00:00`]);
      });
    });

    it('ends a custom range at the midnight after its end date', () => {
      days.forEach(day => {
        testContext.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.CustomRange);
        renderFixture(testContext.fixture);
        testContext.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput('2026-01-01'));
        testContext.component.dateTimeFilterForm.controls['dateValueTo'].setValue(toInput(day));
        testContext.component.onApplyButtonClick();
        expect(
          emittedCriteria(testContext.component).map(predicate => localPart(predicate.value)),
          day
        ).toEqual(['2026-01-01T00:00:00', `${nextDay(day)}T00:00:00`]);
      });
    });
  });

  describe('editor state', () => {
    it('stores its choices on the emitted filter, not on the field definition', () => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      renderFixture(testContext.fixture);
      const before = { ...dateTimeProperty };
      testContext.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.Before);
      testContext.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput('2023-08-09'));
      testContext.component.onApplyButtonClick();
      const emitted = (testContext.component.filterCriteriaChange.emit as Mock).mock.lastCall![0] as PropertyFilter;
      expect(emitted.editorState).toEqual({ operator: ComparisonOperator.Before, value: '2023-08-09' });
      expect({ ...dateTimeProperty }).toEqual(before);
    });

    it('emits a new filter object on every Apply', () => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      renderFixture(testContext.fixture);
      testContext.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput('2023-08-09'));
      testContext.component.onApplyButtonClick();
      testContext.component.onApplyButtonClick();
      const [first, second] = (testContext.component.filterCriteriaChange.emit as Mock).mock.calls.map(args => args[0]);
      expect(first).not.toBe(second);
    });

    it('leaves an emitted filter unchanged after a later Apply', () => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      renderFixture(testContext.fixture);
      testContext.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.Equals);
      testContext.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput('2023-08-09'));
      testContext.component.onApplyButtonClick();
      const first: PropertyFilter = (testContext.component.filterCriteriaChange.emit as Mock).mock.lastCall![0];
      const snapshot = first.criteria.map(predicate => ({ operator: predicate.operator, value: predicate.value }));

      testContext.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput('2024-01-15'));
      testContext.component.onApplyButtonClick();
      testContext.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.IsEmpty);
      testContext.component.onApplyButtonClick();

      expect(first.criteria.map(predicate => ({ operator: predicate.operator, value: predicate.value }))).toEqual(
        snapshot
      );
    });

    it('opens a preset without editor state from its criteria', () => {
      const preset = new PropertyFilter();
      preset.operator = LogicalOperator.And;
      preset.criteria = [
        { filterableProperty: dateTimeProperty, operator: ComparisonOperator.Before, value: '2026-01-01T00:00' },
      ];
      testContext.component.propertyFilter = preset;
      renderFixture(testContext.fixture);
      expect(testContext.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.Before);
      expect(testContext.component.dateTimeFilterForm.controls['dateValue'].value).toEqual(toInput('2026-01-01'));
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

    function openCustomRange(withTime: boolean): HTMLElement {
      testContext.component.filterProperty = new DateTimePropertyDefinition(
        dateTimePropertyDisplayName,
        dateTimePropertyName,
        undefined,
        false,
        [wholeWeek, ...invalid, workingHours]
      );
      renderFixture(testContext.fixture);
      const element: HTMLElement = testContext.fixture.nativeElement;
      const operatorSelect: HTMLSelectElement = element.querySelector(operatorSelector)!;
      operatorSelect.value = operatorSelect.options[5].value;
      operatorSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      if (withTime) {
        (element.querySelector('[data-test-id="add-button"]') as HTMLButtonElement).click();
        renderFixture(testContext.fixture);
      }
      return element;
    }

    it('keeps only options with two valid dates and shows no buttons without times', () => {
      const element = openCustomRange(false);
      expect(testContext.component.rangeOptions).toEqual([wholeWeek, workingHours]);
      expect(element.querySelector('clr-date-range-container')).not.toBeNull();
      expect(rangeButtons(element).length).toBe(0);
    });

    it('lists the options as buttons under the operator with times', () => {
      const element = openCustomRange(true);
      const buttons = rangeButtons(element);
      expect(buttons.map(button => button.textContent.trim())).toEqual([wholeWeek.label, workingHours.label]);
      expect(buttons.every(button => button.type === 'button')).toBe(true);
      expect(element.querySelector('.date-range-options')!.getAttribute('aria-label')!).toBe('Preset ranges');
    });

    it('fills whole days as 00:00 to 23:59 and emits up to the next midnight', () => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      const element = openCustomRange(true);
      rangeButtons(element)[0].click();
      renderFixture(testContext.fixture);

      const form = testContext.component.dateTimeFilterForm;
      expect(form.value.dateValue).toBe(toInput('2023-08-01'));
      expect(form.value.dateValueTo).toBe(toInput('2023-08-07'));
      expect(form.value.timeValue).toBe('00:00');
      expect(form.value.timeValueTo).toBe('23:59');

      (element.querySelector(submitBtnSelector) as HTMLButtonElement).click();
      const emitted = (testContext.component.filterCriteriaChange.emit as Mock).mock.lastCall![0] as PropertyFilter;
      expect(emitted.criteria[0].value).toContain('2023-08-01T00:00:00');
      expect(emitted.criteria[1].value).toContain('2023-08-08T00:00:00');
    });

    it('fills the times of a timed range, ending one minute after its inclusive end', () => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      const element = openCustomRange(true);
      rangeButtons(element)[1].click();
      renderFixture(testContext.fixture);

      expect(testContext.component.dateTimeFilterForm.value.timeValue).toBe('09:00');
      expect(testContext.component.dateTimeFilterForm.value.timeValueTo).toBe('17:30');

      (element.querySelector(submitBtnSelector) as HTMLButtonElement).click();
      const emitted = (testContext.component.filterCriteriaChange.emit as Mock).mock.lastCall![0] as PropertyFilter;
      expect(emitted.criteria[0].value).toContain('2023-08-11T09:00:00');
      expect(emitted.criteria[1].value).toContain('2023-08-11T17:31:00');
    });
  });

  describe('custom range order with times', () => {
    function openCustomRangeWithTime(): HTMLElement {
      renderFixture(testContext.fixture);
      const element: HTMLElement = testContext.fixture.nativeElement;
      const operatorSelect: HTMLSelectElement = element.querySelector(operatorSelector)!;
      operatorSelect.value = operatorSelect.options[5].value;
      operatorSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      (element.querySelector('[data-test-id="add-button"]') as HTMLButtonElement).click();
      renderFixture(testContext.fixture);
      return element;
    }

    function setRange(from: string, fromTime: string, to: string, toTime: string): void {
      testContext.component.dateTimeFilterForm.patchValue({
        dateValue: toInput(from),
        timeValue: fromTime,
        dateValueTo: toInput(to),
        timeValueTo: toTime,
      });
      renderFixture(testContext.fixture);
    }

    it('rejects a From date later than the To date', () => {
      const element = openCustomRangeWithTime();
      setRange('2023-08-15', '10:00', '2023-08-11', '10:00');

      const dateValueTo = testContext.component.dateTimeFilterForm.get('dateValueTo')!;
      expect(dateValueTo.hasError('range')).toBe(true);
      expect(testContext.component.dateTimeFilterForm.valid).toBe(false);
      expect(element.textContent).toContain('End date must not be before start date');
    });

    it('rejects a From time later than the To time on the same day', () => {
      openCustomRangeWithTime();
      setRange('2023-08-11', '15:00', '2023-08-11', '09:00');
      expect(testContext.component.dateTimeFilterForm.get('dateValueTo')!.hasError('range')).toBe(true);
    });

    it('accepts equal From and To, and clears the error once the order is fixed', () => {
      openCustomRangeWithTime();
      setRange('2023-08-11', '15:00', '2023-08-11', '09:00');
      setRange('2023-08-11', '09:00', '2023-08-11', '09:00');
      expect(testContext.component.dateTimeFilterForm.get('dateValueTo')!.hasError('range')).toBe(false);
      expect(testContext.component.dateTimeFilterForm.valid).toBe(true);
    });
  });

  describe('additional coverage', () => {
    beforeEach(() => {
      renderFixture(testContext.fixture);
    });

    it('should handle includeSeconds=true correctly by preserving seconds in the value', () => {
      // Arrange
      testContext.component.includeSeconds = true;
      testContext.component.enableTimePredicate();
      markComponentForCheck();
      renderFixture(testContext.fixture);

      // Act: Set operator to Equals (to trigger buildEqualsDateTimePredicates -> getFromDateTimePredicate)
      testContext.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.Equals);
      testContext.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput(augustNinth));
      // When includeSeconds is true, the component expects the input to contain the seconds
      testContext.component.dateTimeFilterForm.controls['timeValue'].setValue('12:30:45');

      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      testContext.component.onApplyButtonClick();

      // Assert
      const emitSpy = testContext.component.filterCriteriaChange.emit as Mock;
      const emittedFilter = emitSpy.mock.lastCall![0] as PropertyFilter;
      const primaryPredicate = emittedFilter.criteria[0];

      // Should contain the explicit seconds provided, not appended with :00
      // Note: +06:00 comes from the mocked timezone offset in beforeEach
      expect(primaryPredicate.value).toContain('2023-08-09T12:30:45');
    });

    describe('with seconds, inclusive times step by a second', () => {
      function apply(operator: ComparisonOperator): PropertyFilter {
        testContext.component.includeSeconds = true;
        testContext.component.enableTimePredicate();
        markComponentForCheck();
        renderFixture(testContext.fixture);
        testContext.component.dateTimeFilterForm.controls['operator'].setValue(operator);
        testContext.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput(augustNinth));
        testContext.component.dateTimeFilterForm.controls['timeValue'].setValue('12:30:45');
        vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
        testContext.component.onApplyButtonClick();
        return (testContext.component.filterCriteriaChange.emit as Mock).mock.lastCall![0];
      }

      it('Before or equal to ends before the next second', () => {
        const filter = apply(ComparisonOperator.BeforeOrEqualTo);
        expect(filter.criteria[0].operator).toBe(ComparisonOperator.LessThan);
        expect(filter.criteria[0].value).toContain('2023-08-09T12:30:46');
      });

      it('After starts at the next second', () => {
        const filter = apply(ComparisonOperator.After);
        expect(filter.criteria[0].operator).toBe(ComparisonOperator.GreaterThanOrEqualTo);
        expect(filter.criteria[0].value).toContain('2023-08-09T12:30:46');
      });

      it('Equals covers one second', () => {
        const filter = apply(ComparisonOperator.Equals);
        expect(filter.criteria[0].value).toContain('2023-08-09T12:30:45');
        expect(filter.criteria[1].value).toContain('2023-08-09T12:30:46');
      });
    });

    it('should submit form when Enter key is pressed and form is valid', () => {
      vi.spyOn(testContext.component, 'onApplyButtonClick').mockImplementation(() => undefined);

      // Arrange: Make form valid
      testContext.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput('2023-01-01'));

      const event = new KeyboardEvent('keypress', { key: 'Enter' });
      vi.spyOn(event, 'stopPropagation').mockImplementation(() => undefined);
      vi.spyOn(event, 'preventDefault').mockImplementation(() => undefined);

      // Act
      testContext.component.onInputKeyPress(event);

      // Assert
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(testContext.component.onApplyButtonClick).toHaveBeenCalled();
    });

    it('should NOT submit form when Enter key is pressed and form is invalid', () => {
      vi.spyOn(testContext.component, 'onApplyButtonClick').mockImplementation(() => undefined);

      // Arrange: Make form invalid (dateValue is required by default)
      testContext.component.dateTimeFilterForm.controls['dateValue'].setValue('');

      const event = new KeyboardEvent('keypress', { key: 'Enter' });

      // Act
      testContext.component.onInputKeyPress(event);

      // Assert
      expect(testContext.component.onApplyButtonClick).not.toHaveBeenCalled();
    });

    it('should remove time controls when disableTimePredicate is called', () => {
      // Arrange: Enable first to verify they exist
      testContext.component.isCustomRangePredicate = true; // To test removal of 'To' controls
      testContext.component.enableTimePredicate();

      expect(testContext.component.dateTimeFilterForm.contains('timeValue')).toBe(true);
      expect(testContext.component.dateTimeFilterForm.contains('timeValueTo')).toBe(true);

      // Act
      testContext.component.disableTimePredicate();

      // Assert
      expect(testContext.component.timePredicate).toBe(false);
      expect(testContext.component.dateTimeFilterForm.contains('timeValue')).toBe(false);
      expect(testContext.component.dateTimeFilterForm.contains('timeValueTo')).toBe(false);
    });

    describe('getSinglePredicate switch cases', () => {
      it('should handle Before operator', () => {
        vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);

        // Act
        testContext.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.Before);
        testContext.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput(augustNinth));
        testContext.component.onApplyButtonClick();

        // Assert
        const emitSpy = testContext.component.filterCriteriaChange.emit as Mock;
        const filter = emitSpy.mock.lastCall![0] as PropertyFilter;

        // Before 2023-08-09 means < 2023-08-09T00:00:00
        expect(filter.criteria[0].operator).toEqual(ComparisonOperator.LessThan);
        expect(filter.criteria[0].value).toContain('2023-08-09T00:00:00');
      });

      it('should handle BeforeOrEqualTo operator', () => {
        vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);

        // Act
        testContext.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.BeforeOrEqualTo);
        testContext.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput(augustNinth));
        testContext.component.onApplyButtonClick();

        // Assert
        const emitSpy = testContext.component.filterCriteriaChange.emit as Mock;
        const filter = emitSpy.mock.lastCall![0] as PropertyFilter;

        // BeforeOrEqualTo uses getFromDateTimePredicate(true), which adds 1 day (if no time)
        // So <= 08-09 effectively becomes < 08-10
        expect(filter.criteria[0].operator).toEqual(ComparisonOperator.LessThan);
        expect(filter.criteria[0].value).toContain('2023-08-10T00:00:00');
      });

      it('should handle After operator', () => {
        vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);

        // Act
        testContext.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.After);
        testContext.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput(augustNinth));
        testContext.component.onApplyButtonClick();

        // Assert
        const emitSpy = testContext.component.filterCriteriaChange.emit as Mock;
        const filter = emitSpy.mock.lastCall![0] as PropertyFilter;

        // After uses getFromDateTimePredicate(true), adding 1 day
        // After 08-09 effectively means >= 08-10
        expect(filter.criteria[0].operator).toEqual(ComparisonOperator.GreaterThanOrEqualTo);
        expect(filter.criteria[0].value).toContain('2023-08-10T00:00:00');
      });
    });

    it('should handle getToDateTimePredicate else block (CustomRange without Time)', () => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);

      // Arrange
      testContext.component.timePredicate = false; // Ensure we hit the 'else' block

      // Act
      testContext.component.dateTimeFilterForm.controls['operator'].setValue(ComparisonOperator.CustomRange);
      // Trigger UI update to add controls (normally handled by subscription, but safer to be explicit in test setup logic)
      // But here we just set values because enableCustomRangePredicate was likely called by valueChanges in real component
      renderFixture(testContext.fixture);

      testContext.component.dateTimeFilterForm.controls['dateValue'].setValue(toInput(augustNinth)); // From
      testContext.component.dateTimeFilterForm.controls['dateValueTo'].setValue(toInput('2023-08-15')); // To

      testContext.component.onApplyButtonClick();

      // Assert
      const emitSpy = testContext.component.filterCriteriaChange.emit as Mock;
      const filter = emitSpy.mock.lastCall![0] as PropertyFilter;

      // Index 0 is Primary (From), Index 1 is Secondary (To)
      const toPredicate = filter.criteria[1];

      // Logic: getToDateTimePredicate else block appends T00:00:00 then adds 1 day via getCustomDate
      // 2023-08-15 -> 2023-08-16T00:00:00
      expect(toPredicate.operator).toEqual(ComparisonOperator.LessThan);
      expect(toPredicate.value).toContain('2023-08-16T00:00:00');
    });
  });
});

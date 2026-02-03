/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule, DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrInputModule, ClrSelectModule } from '@clr/angular';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { ComparisonOperator, LogicalOperator, TimeSpan } from '../model/datagrid-filters.enums';
import { DateTimePropertyDefinition, PropertyFilter, PropertyPredicate } from '../model/datagrid-filters.interfaces';
import { DateTimeFilterComponent } from './date-time-filter.component';
import { FilterFormComponent } from './filter-form.component';

import Spy = jasmine.Spy;

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
      imports: [ClrInputModule, ClrSelectModule, CommonModule, FormsModule, ReactiveFormsModule],
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
      dateValueInput.value = '2023-08-09';
      dateValueInput.dispatchEvent(new Event('input'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['dateValue'].value).toEqual('2023-08-09');
      expect(submitDateTimeFilterButton.disabled).toBeFalsy();
      expect(this.component.dateTimeFilterForm.valid).toBeTruthy();

      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(equalsPropertyFilter);
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
      dateValueInput.value = '2023-08-10';
      dateValueInput.dispatchEvent(new Event('input'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['dateValue'].value).toEqual('2023-08-10');
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(afterPropertyFilter);
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
      dateValueInput.value = dummyDate;
      dateValueInput.dispatchEvent(new Event('input'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['dateValue'].value).toEqual(dummyDate);

      const dateValueToInput: HTMLInputElement = this.fixture.debugElement.nativeElement.querySelector(
        'input[formControlName=dateValueTo]'
      );
      dateValueToInput.value = dummyDate;
      dateValueToInput.dispatchEvent(new Event('input'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['dateValueTo'].value).toEqual(dummyDate);

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
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(customRangePropertyFilter);
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
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(lastDayPropertyFilter);

      operatorSelect.value = operatorSelect.options[8].value;
      operatorSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.LastWeek);
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(2);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(lastWeekPropertyFilter);

      operatorSelect.value = operatorSelect.options[9].value;
      operatorSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.LastMonth);
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(3);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(lastMonthPropertyFilter);

      operatorSelect.value = operatorSelect.options[10].value;
      operatorSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.LastYear);
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(4);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(lastYearPropertyFilter);
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
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(lastMinutePropertyFilter);

      timeSpanSelect.value = timeSpanSelect.options[1].value;
      timeSpanSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Hours);
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(2);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(lastHourPropertyFilter);

      timeSpanSelect.value = timeSpanSelect.options[2].value;
      timeSpanSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Days);
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(3);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(lastDayPropertyFilter);

      timeSpanSelect.value = timeSpanSelect.options[3].value;
      timeSpanSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Weeks);
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(4);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(lastWeekPropertyFilter);

      timeSpanSelect.value = timeSpanSelect.options[4].value;
      timeSpanSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Months);
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(5);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(lastMonthPropertyFilter);

      timeSpanSelect.value = timeSpanSelect.options[5].value;
      timeSpanSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Years);
      submitDateTimeFilterButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(6);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(lastYearPropertyFilter);
    });
  });
  describe('in edit mode', () => {
    beforeEach(function (this: ThisTest) {
      dateTimeProperty.selectedValue = undefined;
      dateTimeProperty.selectedValueTo = undefined;
    });
    it('is properly initialized with custom range operator', function (this: ThisTest) {
      this.component.propertyFilter = customRangePropertyFilter;
      dateTimeProperty.selectedOperator = ComparisonOperator.CustomRange;
      dateTimeProperty.selectedValue = '2023-10-23T15:15';
      dateTimeProperty.selectedValueTo = '2023-10-24T15:18';

      this.component.ngOnChanges();
      this.fixture.detectChanges();

      expect(this.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.CustomRange);
      expect(this.component.dateTimeFilterForm.controls['dateValue'].value).toEqual('2023-10-23');
      expect(this.component.dateTimeFilterForm.controls['dateValueTo'].value).toEqual('2023-10-24');

      expect(this.component.dateTimeFilterForm.controls['timeValue'].value).toEqual('15:15');
      expect(this.component.dateTimeFilterForm.controls['timeValueTo'].value).toEqual('15:18');
    });
    it('is properly initialized with time span operator', function (this: ThisTest) {
      this.component.propertyFilter = lastYearPropertyFilter;
      dateTimeProperty.selectedOperator = ComparisonOperator.TimeSpan;
      dateTimeProperty.selectedTimeSpanValue = '5';
      dateTimeProperty.selectedTimeSpan = TimeSpan.Years;

      this.component.ngOnChanges();
      this.fixture.detectChanges();

      expect(this.component.dateTimeFilterForm.controls['operator'].value).toEqual(ComparisonOperator.TimeSpan);
      expect(this.component.dateTimeFilterForm.controls['timeSpanValue'].value).toEqual('5');
      expect(this.component.dateTimeFilterForm.controls['timeSpan'].value).toEqual(TimeSpan.Years);
    });
  });
});

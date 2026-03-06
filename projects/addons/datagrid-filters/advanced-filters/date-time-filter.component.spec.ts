/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule, DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrInputModule, ClrSelectModule } from '@clr/angular/forms';
import { ClrIcon } from '@clr/angular/icon';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { DateTimeFilterComponent } from './date-time-filter.component';
import { FilterFormComponent } from './filter-form.component';
import { ComparisonOperator, LogicalOperator, TimeSpan } from '../model/datagrid-filters.enums';
import { DateTimePropertyDefinition, PropertyFilter, PropertyPredicate } from '../model/datagrid-filters.interfaces';

import Spy = jasmine.Spy;

const augustNinth = '2023-08-09';
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
      imports: [ClrInputModule, ClrSelectModule, CommonModule, FormsModule, ReactiveFormsModule, ClrIcon],
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
      dateValueInput.value = augustNinth;
      dateValueInput.dispatchEvent(new Event('input'));
      this.fixture.detectChanges();
      expect(this.component.dateTimeFilterForm.controls['dateValue'].value).toEqual(augustNinth);
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
      this.component.dateTimeFilterForm.controls['dateValue'].setValue(augustNinth);
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
      this.component.dateTimeFilterForm.controls['dateValue'].setValue('2023-01-01');

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
        this.component.dateTimeFilterForm.controls['dateValue'].setValue(augustNinth);
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
        this.component.dateTimeFilterForm.controls['dateValue'].setValue(augustNinth);
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
        this.component.dateTimeFilterForm.controls['dateValue'].setValue(augustNinth);
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

      this.component.dateTimeFilterForm.controls['dateValue'].setValue(augustNinth); // From
      this.component.dateTimeFilterForm.controls['dateValueTo'].setValue('2023-08-15'); // To

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

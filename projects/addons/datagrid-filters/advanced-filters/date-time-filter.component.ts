/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { ComparisonOperator, LogicalOperator, TimeSpan } from '../model/datagrid-filters.enums';
import { DateTimePropertyDefinition, PropertyFilter, PropertyPredicate } from '../model/datagrid-filters.interfaces';

const enterKey = 'Enter';
const dateTimeFormat = 'yyyy-MM-ddTHH:mm:ss';
const requiredValidators: ValidatorFn[] = [Validators.required];

// TODO: zpopov: Existing time utils to convert to/from milliseconds may make the code even easier to read
const oneSecondMs: number = 1 * 1000;
const oneMinuteMs: number = 60 * oneSecondMs;
const oneHourMs: number = 60 * oneMinuteMs;
const oneDayMs: number = 24 * oneHourMs;
const oneWeekMs: number = 7 * oneDayMs;
const oneMonthMs: number = 30 * oneDayMs;
// We ignore leap years when it comes to time-spans.
const oneYearMs: number = 365 * oneDayMs;

/**
 * Datetime filter component collects filtering criteria for datetime based properties
 *
 */

@Component({
  selector: 'appfx-datetime-filter',
  standalone: false,
  templateUrl: 'date-time-filter.component.html',
  styleUrls: ['date-time-filter.component.scss', '../common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateTimeFilterComponent implements OnInit, OnChanges {
  /**
   * Property used for filtering
   */
  #filterProperty: DateTimePropertyDefinition;
  readonly timeSpans: TimeSpan[];
  dateTimeFilterForm: FormGroup;
  comparisonOperators: ComparisonOperator[];
  isEmptyPredicate = false;
  isCustomRangePredicate = false;
  isRelativePredicate = false;
  isTimeSpanPredicate = false;
  timePredicate = false;
  /**
   * In case the component is used for filter editing
   */
  @Input() propertyFilter: PropertyFilter;

  /**
   * Event emitter to tell hosting view that filtering criteria have changed
   */
  @Output() filterCriteriaChange: EventEmitter<PropertyFilter> = new EventEmitter<PropertyFilter>();

  private readonly relativeOperators: ComparisonOperator[] = [
    ComparisonOperator.LastDay,
    ComparisonOperator.LastWeek,
    ComparisonOperator.LastMonth,
    ComparisonOperator.LastYear,
  ];
  private readonly singlePredicateOperators: ComparisonOperator[] = [
    ComparisonOperator.After,
    ComparisonOperator.AfterOrEqualTo,
    ComparisonOperator.Before,
    ComparisonOperator.BeforeOrEqualTo,
  ];
  private selectedFilterCriteria: PropertyFilter = new PropertyFilter();
  private primaryPredicate: PropertyPredicate = new PropertyPredicate();
  private secondaryPredicate: PropertyPredicate = new PropertyPredicate();

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    public filterStrings: DatagridFiltersStrings
  ) {
    this.timeSpans = [TimeSpan.Minutes, TimeSpan.Hours, TimeSpan.Days, TimeSpan.Weeks, TimeSpan.Months, TimeSpan.Years];
  }

  @Input()
  get filterProperty(): DateTimePropertyDefinition {
    return this.#filterProperty;
  }
  set filterProperty(filterProperty: DateTimePropertyDefinition) {
    this.#filterProperty = filterProperty;
  }

  ngOnInit() {
    this.comparisonOperators = this.filterProperty.getOperators();
    let dateValidators: ValidatorFn[] = requiredValidators;

    // To handle edit mode
    const storedOperator: ComparisonOperator = this.propertyFilter?.criteria[0]?.filterableProperty.selectedOperator;
    if (storedOperator) {
      this.processSelectedOperator(storedOperator);
      if (this.noDateTimeInputNeeded()) {
        dateValidators = [];
      }
    }

    this.dateTimeFilterForm = this.formBuilder.group({
      operator: [storedOperator || ComparisonOperator.AfterOrEqualTo],
      dateValue: [this.parseDateValue(this.getStoredDateTimeValue()), dateValidators],
    });

    if (this.parseTimeValue(this.getStoredDateTimeValue()).length > 0) {
      this.enableTimePredicate();
    }

    if (ComparisonOperator.CustomRange === storedOperator) {
      this.isCustomRangePredicate = true;
      this.enableCustomRangePredicate();
    }

    if (this.isTimeSpanPredicate) {
      this.enableTimeSpanPredicate();
    }

    this.onOperatorChange();
  }

  ngOnChanges() {
    this.comparisonOperators = this.filterProperty.getOperators();
  }

  onInputKeyPress(event: KeyboardEvent): void {
    if (event.key === enterKey) {
      event.stopPropagation();
      event.preventDefault();
      if (this.dateTimeFilterForm.valid) {
        this.onApplyButtonClick();
      }
    }
  }

  enableTimePredicate(): void {
    this.timePredicate = true;
    this.dateTimeFilterForm.addControl(
      'timeValue',
      new FormControl(this.parseTimeValue(this.getStoredDateTimeValue()), requiredValidators)
    );
    if (this.isCustomRangePredicate) {
      this.dateTimeFilterForm.addControl(
        'timeValueTo',
        new FormControl(this.parseTimeValue(this.getStoredDateTimeValueTo()), requiredValidators)
      );
    }
  }

  disableTimePredicate(): void {
    this.timePredicate = false;
    this.dateTimeFilterForm.removeControl('timeValue');
    if (this.isCustomRangePredicate) {
      this.dateTimeFilterForm.removeControl('timeValueTo');
    }
  }

  noDateTimeInputNeeded(): boolean {
    return this.isEmptyPredicate || this.isTimeSpanPredicate || this.isRelativePredicate;
  }

  onApplyButtonClick(): void {
    const selectedOperator: ComparisonOperator = this.dateTimeFilterForm.value.operator;

    if (this.isRelativeDateTimeOperator(selectedOperator)) {
      this.primaryPredicate = this.getRelativeDateTimePredicate(selectedOperator);
      this.secondaryPredicate = this.getcurrentTimePredicate();
    } else if (this.isTimeSpanPredicate) {
      this.primaryPredicate = this.getTimeSpanPredicate(
        this.dateTimeFilterForm.value.timeSpanValue,
        this.dateTimeFilterForm.value.timeSpan
      );
      this.secondaryPredicate = this.getcurrentTimePredicate();
    } else if (this.isCustomRangePredicate) {
      this.primaryPredicate = this.getFromDateTimePredicate();
      this.secondaryPredicate = this.getToDateTimePredicate();
    } else if (ComparisonOperator.Equals === selectedOperator) {
      this.buildEqualsDateTimePredicates();
    } else if (this.isSinglePredicateOperator(selectedOperator)) {
      this.primaryPredicate = this.getSinglePredicate(selectedOperator);
    }

    this.primaryPredicate.filterableProperty = this.filterProperty;

    if (!this.isEmptyPredicate) {
      this.primaryPredicate.value = this.adjustTimeZone(this.primaryPredicate.value);
      if (!this.isSinglePredicateOperator(selectedOperator)) {
        this.secondaryPredicate.filterableProperty = this.filterProperty;
        this.secondaryPredicate.value = this.adjustTimeZone(this.secondaryPredicate.value);
        this.selectedFilterCriteria.criteria = [this.primaryPredicate, this.secondaryPredicate];
        this.selectedFilterCriteria.operator = LogicalOperator.And;
      } else {
        this.selectedFilterCriteria.criteria = [this.primaryPredicate];
      }
    } else {
      this.primaryPredicate.operator = ComparisonOperator.IsEmpty;
      this.selectedFilterCriteria.criteria = [this.primaryPredicate];
    }

    // Selected data is stored, in order to be able to be rendered in edit mode
    this.storeSelectedValues();

    this.filterCriteriaChange.emit(this.selectedFilterCriteria);
  }

  onCancelButtonClick(): void {
    this.filterCriteriaChange.emit();
  }

  private onOperatorChange(): void {
    this.dateTimeFilterForm.get('operator')?.valueChanges.subscribe((operator: ComparisonOperator) => {
      this.processSelectedOperator(operator);
      if (this.noDateTimeInputNeeded()) {
        this.disableDateTimePredicates();
      } else {
        this.isCustomRangePredicate = ComparisonOperator.CustomRange === operator;
        this.enableDateTimePredicates();
        if (!this.isCustomRangePredicate) {
          this.disableCustomRangePredicate();
        }
      }
      if (this.isTimeSpanPredicate) {
        this.enableTimeSpanPredicate();
      } else {
        this.disableTimeSpanPredicate();
      }
    });
  }

  private addValidators(formControlName: string, validators: ValidatorFn[]): void {
    this.dateTimeFilterForm.get(formControlName)?.addValidators(validators);
    this.dateTimeFilterForm.get(formControlName)?.updateValueAndValidity();
  }

  private removeValidators(formControlName: string): void {
    this.dateTimeFilterForm.get(formControlName)?.clearValidators();
    this.dateTimeFilterForm.get(formControlName)?.updateValueAndValidity();
  }

  private isRelativeDateTimeOperator(operator: ComparisonOperator): boolean {
    return this.relativeOperators.includes(operator);
  }

  private isSinglePredicateOperator(operator: ComparisonOperator): boolean {
    return this.singlePredicateOperators.includes(operator);
  }

  private enableCustomRangePredicate(): void {
    this.dateTimeFilterForm.addControl(
      'dateValueTo',
      new FormControl(this.parseDateValue(this.getStoredDateTimeValueTo()), requiredValidators)
    );
    if (this.timePredicate) {
      this.dateTimeFilterForm.addControl(
        'timeValueTo',
        new FormControl(this.parseTimeValue(this.getStoredDateTimeValueTo()), requiredValidators)
      );
    }
  }

  private disableCustomRangePredicate(): void {
    this.isCustomRangePredicate = false;
    this.dateTimeFilterForm.removeControl('dateValueTo');
    if (this.timePredicate) {
      this.dateTimeFilterForm.removeControl('timeValueTo');
    }
  }

  private enableDateTimePredicates(): void {
    this.addValidators('dateValue', requiredValidators);
    if (this.timePredicate) {
      this.enableTimePredicate();
    }
    if (this.isCustomRangePredicate) {
      this.enableCustomRangePredicate();
    }
  }

  private disableDateTimePredicates(): void {
    this.removeValidators('dateValue');
    if (this.timePredicate) {
      this.disableTimePredicate();
    }
    if (this.isCustomRangePredicate) {
      this.disableCustomRangePredicate();
    }
  }

  private enableTimeSpanPredicate(): void {
    const timeSpanValue: number = this.propertyFilter?.criteria[0]?.filterableProperty?.selectedTimeSpanValue;
    this.dateTimeFilterForm.addControl('timeSpanValue', new FormControl(timeSpanValue || '', requiredValidators));
    const timeSpan: TimeSpan = this.propertyFilter?.criteria[0]?.filterableProperty?.selectedTimeSpan;
    this.dateTimeFilterForm.addControl('timeSpan', new FormControl(timeSpan || TimeSpan.Minutes));
  }

  private disableTimeSpanPredicate(): void {
    this.dateTimeFilterForm.removeControl('timeSpanValue');
    this.dateTimeFilterForm.removeControl('timeSpan');
  }

  private processSelectedOperator(operator: ComparisonOperator): void {
    this.isEmptyPredicate = ComparisonOperator.IsEmpty === operator;
    this.isTimeSpanPredicate = ComparisonOperator.TimeSpan === operator;
    this.isRelativePredicate = this.isRelativeDateTimeOperator(operator);
  }

  private getRelativeDateTimePredicate(operator: ComparisonOperator): PropertyPredicate {
    const predicate: PropertyPredicate = new PropertyPredicate();
    predicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
    switch (operator) {
      case ComparisonOperator.LastDay:
        predicate.value = this.getPastDate(oneDayMs);
        return predicate;
      case ComparisonOperator.LastWeek:
        predicate.value = this.getPastDate(oneWeekMs);
        return predicate;
      case ComparisonOperator.LastMonth:
        predicate.value = this.getPastDate(oneMonthMs);
        return predicate;
      case ComparisonOperator.LastYear:
        predicate.value = this.getPastDate(oneYearMs);
        return predicate;
      default:
        return predicate;
    }
  }

  private getTimeSpanPredicate(value: number, timeSpan: TimeSpan): PropertyPredicate {
    const predicate: PropertyPredicate = new PropertyPredicate();
    predicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
    if (value < 0) {
      return predicate;
    }
    switch (timeSpan) {
      case TimeSpan.Minutes:
        predicate.value = this.getPastDate(value * oneMinuteMs);
        return predicate;
      case TimeSpan.Hours:
        predicate.value = this.getPastDate(value * oneHourMs);
        return predicate;
      case TimeSpan.Days:
        predicate.value = this.getPastDate(value * oneDayMs);
        return predicate;
      case TimeSpan.Weeks:
        predicate.value = this.getPastDate(value * oneWeekMs);
        return predicate;
      case TimeSpan.Months:
        predicate.value = this.getPastDate(value * oneMonthMs);
        return predicate;
      case TimeSpan.Years:
        predicate.value = this.getPastDate(value * oneYearMs);
        return predicate;
      default:
        return predicate;
    }
  }

  private buildEqualsDateTimePredicates(): void {
    this.primaryPredicate = this.getFromDateTimePredicate();
    this.secondaryPredicate.operator = ComparisonOperator.LessThan;
    if (this.timePredicate) {
      this.secondaryPredicate.value = this.getCustomDate(this.primaryPredicate.value, oneMinuteMs);
    } else {
      this.secondaryPredicate.value = this.getCustomDate(this.primaryPredicate.value, oneDayMs);
    }
  }

  private getSinglePredicate(operator: ComparisonOperator): PropertyPredicate {
    let predicate: PropertyPredicate = new PropertyPredicate();
    switch (operator) {
      case ComparisonOperator.BeforeOrEqualTo:
        predicate = this.getFromDateTimePredicate(true);
        predicate.operator = ComparisonOperator.LessThan;
        return predicate;
      case ComparisonOperator.Before:
        predicate = this.getFromDateTimePredicate();
        predicate.operator = ComparisonOperator.LessThan;
        return predicate;
      case ComparisonOperator.After:
        predicate = this.getFromDateTimePredicate(true);
        predicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
        return predicate;
      case ComparisonOperator.AfterOrEqualTo:
        predicate = this.getFromDateTimePredicate();
        predicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
        return predicate;
      default:
        return predicate;
    }
  }

  private getFromDateTimePredicate(adjustTime = false): PropertyPredicate {
    const fromPredicate: PropertyPredicate = new PropertyPredicate();
    fromPredicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
    let fromValue: string = this.dateTimeFilterForm.value.dateValue;
    if (this.timePredicate) {
      fromValue += 'T' + this.dateTimeFilterForm.value.timeValue + ':00';
      if (adjustTime) {
        fromValue = this.getCustomDate(fromValue, oneMinuteMs);
      }
    } else {
      fromValue += 'T00:00:00';
      if (adjustTime) {
        fromValue = this.getCustomDate(fromValue, oneDayMs);
      }
    }
    fromPredicate.value = fromValue;
    return fromPredicate;
  }

  private getToDateTimePredicate(): PropertyPredicate {
    const toPredicate: PropertyPredicate = new PropertyPredicate();
    toPredicate.operator = ComparisonOperator.LessThan;
    let toValue: string = this.dateTimeFilterForm.value.dateValueTo;
    if (this.timePredicate) {
      toValue += 'T' + this.dateTimeFilterForm.value.timeValueTo + ':00';
      toValue = this.getCustomDate(toValue, oneMinuteMs);
    } else {
      toValue += 'T00:00:00';
      toValue = this.getCustomDate(toValue, oneDayMs);
    }
    toPredicate.value = toValue;
    return toPredicate;
  }

  private getcurrentTimePredicate(): PropertyPredicate {
    const predicate: PropertyPredicate = new PropertyPredicate();
    predicate.value = this.datePipe.transform(new Date(), dateTimeFormat);
    predicate.operator = ComparisonOperator.LessThanOrEqualTo;
    return predicate;
  }

  private getPastDate(timePeriod: number): string | null {
    const now: Date = new Date();
    const prevDate: Date = new Date(new Date().setTime(now.getTime() - timePeriod));
    return this.datePipe.transform(prevDate, dateTimeFormat);
  }

  private getCustomDate(baseDate: string, timePeriod: number): string {
    const date: Date = new Date(baseDate);
    const newDate: Date = new Date(new Date().setTime(date.getTime() + timePeriod));
    return this.datePipe.transform(newDate, dateTimeFormat) || baseDate;
  }

  private adjustTimeZone(utcDate: string): string {
    if (!utcDate) {
      return utcDate;
    }
    return utcDate + this.getUtcTimeZoneOffset(utcDate);
  }

  private getUtcTimeZoneOffset(utcDate: string): string {
    // Difference in minutes between the time on the local computer and Universal Coordinated Time
    const timeZoneOffset: number = new Date(utcDate).getTimezoneOffset();
    const decimalOffset: number = Math.abs(timeZoneOffset / 60);
    const offsetHours: number = Math.trunc(decimalOffset);
    const offsetMinutes: number = Math.round((decimalOffset - offsetHours) * 60);
    // Adding a leading 0 if needed
    const offsetHoursString: string = offsetHours.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    });
    const offsetMinutesString: string = offsetMinutes.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    });
    let utcOffset = '';
    if (timeZoneOffset > 0) {
      utcOffset = '-' + offsetHoursString + ':' + offsetMinutesString;
    } else if (timeZoneOffset < 0) {
      utcOffset = '+' + offsetHoursString + ':' + offsetMinutesString;
    }
    return utcOffset;
  }

  private storeSelectedValues(): void {
    this.primaryPredicate.filterableProperty.selectedOperator = this.dateTimeFilterForm.value.operator;
    this.primaryPredicate.filterableProperty.selectedValue = this.dateTimeFilterForm.value.dateValue;
    if (this.timePredicate) {
      this.primaryPredicate.filterableProperty.selectedValue += 'T' + this.dateTimeFilterForm.value.timeValue;
    }
    if (this.isCustomRangePredicate) {
      this.primaryPredicate.filterableProperty.selectedValueTo = this.dateTimeFilterForm.value.dateValueTo;
      if (this.timePredicate) {
        this.primaryPredicate.filterableProperty.selectedValueTo += 'T' + this.dateTimeFilterForm.value.timeValueTo;
      }
    }
    if (this.isTimeSpanPredicate) {
      this.primaryPredicate.filterableProperty.selectedTimeSpanValue = this.dateTimeFilterForm.value.timeSpanValue;
      this.primaryPredicate.filterableProperty.selectedTimeSpan = this.dateTimeFilterForm.value.timeSpan;
    }
  }

  private getStoredDateTimeValue(): string {
    return this.propertyFilter?.criteria[0]?.filterableProperty?.selectedValue || '';
  }

  private getStoredDateTimeValueTo(): string {
    return this.propertyFilter?.criteria[0]?.filterableProperty?.selectedValueTo || '';
  }

  private parseDateValue(dateTime: string): string {
    if (dateTime) {
      return dateTime.substring(0, 10);
    }
    return '';
  }

  private parseTimeValue(dateTime: string): string {
    if (!!dateTime && dateTime.indexOf('T') > 0) {
      return dateTime.substring(dateTime.indexOf('T') + 1);
    }
    return '';
  }
}

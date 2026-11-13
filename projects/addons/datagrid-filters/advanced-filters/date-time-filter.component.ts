/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  LOCALE_ID,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ClrLocaleDateFormat, DateRangeOption } from '@clr/angular/forms';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { ComparisonOperator, LogicalOperator, TimeSpan } from '../model/datagrid-filters.enums';
import {
  DateTimePropertyDefinition,
  FilterEditorState,
  PropertyFilter,
  PropertyPredicate,
} from '../model/datagrid-filters.interfaces';
import {
  oneDayMs,
  oneHourMs,
  oneMinuteMs,
  oneMonthMs,
  oneSecondMs,
  oneWeekMs,
  oneYearMs,
} from '../model/date-time-constants';
import { addDays, dateTimeEditorState, parseLocalDateTime, toIsoDate } from '../model/date-time-editor-state';

const enterKey = 'Enter';
const dateTimeFormat = 'yyyy-MM-ddTHH:mm:ss';
const requiredValidators: ValidatorFn[] = [Validators.required];

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
  readonly timeSpans: TimeSpan[];
  dateTimeFilterForm: FormGroup;
  comparisonOperators: ComparisonOperator[];
  isEmptyPredicate = false;
  isCustomRangePredicate = false;
  isRelativePredicate = false;
  isTimeSpanPredicate = false;
  timePredicate = false;
  /** Preset ranges of the field with valid dates, for the range picker and the time-mode buttons. */
  rangeOptions: DateRangeOption[] = [];
  includeSeconds = false;
  /**
   * In case the component is used for filter editing
   */
  @Input() propertyFilter: PropertyFilter;

  /**
   * Event emitter to tell hosting view that filtering criteria have changed
   */
  @Output() filterCriteriaChange: EventEmitter<PropertyFilter> = new EventEmitter<PropertyFilter>();

  // The clrDate inputs hold locale date strings; predicates and stored values use yyyy-MM-dd.
  private readonly dateFormat = new ClrLocaleDateFormat(inject(LOCALE_ID));
  /** Flags a typed date that cannot be read in the current locale with the `pattern` error. */
  private readonly dateValidators: ValidatorFn[] = [
    Validators.required,
    (control: AbstractControl): ValidationErrors | null =>
      control.value && !this.dateFormat.parse(control.value) ? { pattern: true } : null,
  ];
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
  /** The edited filter's own state, or one derived from its criteria (e.g. a preset). Never the shared definition. */
  private storedState: FilterEditorState | null = null;

  /**
   * Property used for filtering
   */
  #filterProperty: DateTimePropertyDefinition;

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

  /**
   * The smallest time the inputs can express: a second with `includeSeconds`, otherwise a minute. An inclusive time
   * becomes exclusive by adding it, so "Before or equal to 10:30:15" ends before 10:30:16, not 10:31:15.
   */
  private get timeStepMs(): number {
    return this.includeSeconds ? oneSecondMs : oneMinuteMs;
  }

  ngOnInit() {
    this.comparisonOperators = this.filterProperty.getOperators();
    this.rangeOptions = validRangeOptions(this.filterProperty.rangeOptions);
    let dateValidators: ValidatorFn[] = this.dateValidators;

    // To handle edit mode
    this.storedState = dateTimeEditorState(this.propertyFilter);
    const storedOperator: ComparisonOperator | undefined = this.storedState?.operator;
    if (storedOperator !== undefined) {
      this.processSelectedOperator(storedOperator);
      if (this.noDateTimeInputNeeded()) {
        dateValidators = [];
      }
    }

    this.dateTimeFilterForm = this.formBuilder.group({
      operator: [storedOperator ?? ComparisonOperator.AfterOrEqualTo],
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
    this.includeSeconds = this.filterProperty.includeSeconds;
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

  /** Fills From and To (dates and, with times, times) from a preset range. The user can still change them. */
  applyRangeOption(option: DateRangeOption): void {
    const [start, end] = option.value;
    this.dateTimeFilterForm.patchValue({
      dateValue: this.dateFormat.format(start),
      dateValueTo: this.dateFormat.format(end),
    });
    if (this.timePredicate) {
      this.dateTimeFilterForm.patchValue({
        timeValue: this.timeInputValue(start, false),
        timeValueTo: this.timeInputValue(end, true),
      });
    }
    this.dateTimeFilterForm.markAsDirty();
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
    // A new filter and predicates per Apply, so a filter emitted earlier is never changed afterwards.
    this.selectedFilterCriteria = new PropertyFilter();
    this.primaryPredicate = new PropertyPredicate();
    this.secondaryPredicate = new PropertyPredicate();
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
    // The To date's range rule depends on the other fields, so re-check it (and show its error) when they change.
    this.dateTimeFilterForm.valueChanges.subscribe(() => {
      const dateValueTo = this.dateTimeFilterForm.get('dateValueTo');
      if (!dateValueTo) {
        return;
      }
      // Without emitting value changes (that would loop back here); setErrors emits only the status change Clarity
      // needs to show or hide the message.
      dateValueTo.updateValueAndValidity({ emitEvent: false });
      if (dateValueTo.hasError('range')) {
        dateValueTo.markAsTouched();
      }
      dateValueTo.setErrors(dateValueTo.errors);
    });
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
      new FormControl(this.parseDateValue(this.getStoredDateTimeValueTo()), [
        ...this.dateValidators,
        (control: AbstractControl) => this.validateRangeOrder(control),
      ])
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
    this.addValidators('dateValue', this.dateValidators);
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
    const timeSpanValue: number = this.storedState?.timeSpanValue;
    this.dateTimeFilterForm.addControl('timeSpanValue', new FormControl(timeSpanValue || '', requiredValidators));
    const timeSpan: TimeSpan = this.storedState?.timeSpan;
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
      this.secondaryPredicate.value = this.getCustomDate(this.primaryPredicate.value, this.timeStepMs);
    } else {
      this.secondaryPredicate.value = this.getNextDay(this.primaryPredicate.value);
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
    let fromValue: string = this.isoDate('dateValue');
    if (this.timePredicate) {
      fromValue += 'T' + this.dateTimeFilterForm.value.timeValue + (this.includeSeconds ? '' : ':00');
      if (adjustTime) {
        fromValue = this.getCustomDate(fromValue, this.timeStepMs);
      }
    } else {
      fromValue += 'T00:00:00';
      if (adjustTime) {
        fromValue = this.getNextDay(fromValue);
      }
    }
    fromPredicate.value = fromValue;
    return fromPredicate;
  }

  private getToDateTimePredicate(): PropertyPredicate {
    const toPredicate: PropertyPredicate = new PropertyPredicate();
    toPredicate.operator = ComparisonOperator.LessThan;
    let toValue: string = this.isoDate('dateValueTo');
    if (this.timePredicate) {
      toValue += 'T' + this.dateTimeFilterForm.value.timeValueTo + (this.includeSeconds ? '' : ':00');
      toValue = this.getCustomDate(toValue, this.timeStepMs);
    } else {
      toValue += 'T00:00:00';
      toValue = this.getNextDay(toValue);
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

  /**
   * The next calendar day at the same clock time, e.g. "2026-03-29T00:00:00" to "2026-03-30T00:00:00".
   * Not 24 hours later: on the days daylight saving starts or ends that would miss midnight by an hour.
   */
  private getNextDay(baseDate: string): string {
    const parsed = parseLocalDateTime(baseDate);
    return parsed ? this.datePipe.transform(addDays(parsed.date, 1), dateTimeFormat) || baseDate : baseDate;
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

  /** Keeps the editor choices on the emitted filter, so the pill and a later edit read them from there. */
  private storeSelectedValues(): void {
    const value = this.dateTimeFilterForm.value;
    const state: FilterEditorState = { operator: value.operator };
    if (!this.noDateTimeInputNeeded()) {
      state.value = this.isoDate('dateValue') + (this.timePredicate ? 'T' + value.timeValue : '');
    }
    if (this.isCustomRangePredicate) {
      state.valueTo = this.isoDate('dateValueTo') + (this.timePredicate ? 'T' + value.timeValueTo : '');
    }
    if (this.isTimeSpanPredicate) {
      state.timeSpanValue = value.timeSpanValue;
      state.timeSpan = value.timeSpan;
    }
    this.selectedFilterCriteria.editorState = state;
  }

  private getStoredDateTimeValue(): string {
    return this.storedState?.value || '';
  }

  private getStoredDateTimeValueTo(): string {
    return this.storedState?.valueTo || '';
  }

  private parseDateValue(dateTime: string): string {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateTime || '');
    return match ? this.dateFormat.format(new Date(+match[1], +match[2] - 1, +match[3])) : '';
  }

  /** The date picker's locale date string as yyyy-MM-dd. */
  private isoDate(controlName: 'dateValue' | 'dateValueTo'): string {
    const date = this.dateFormat.parse(this.dateTimeFilterForm.value[controlName]);
    return date ? toIsoDate(date) : '';
  }

  /**
   * A time input value (`HH:mm`, or `HH:mm:ss` with seconds) for a preset range date. Exactly 00:00 means the whole
   * day: the start of the day for From, its last minute (or second) for To, since To is inclusive.
   */
  private timeInputValue(date: Date, isEnd: boolean): string {
    const pad = (value: number) => value.toString().padStart(2, '0');
    if (!date.getHours() && !date.getMinutes() && !date.getSeconds()) {
      if (isEnd) {
        return this.includeSeconds ? '23:59:59' : '23:59';
      }
      return this.includeSeconds ? '00:00:00' : '00:00';
    }
    const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    return this.includeSeconds ? `${time}:${pad(date.getSeconds())}` : time;
  }

  /**
   * With times the range picker is not used, so its start-before-end rule is applied here: From must not be later than
   * To (both inclusive, so equal is fine). Reported as the picker's `range` error on the To date.
   */
  private validateRangeOrder(control: AbstractControl): ValidationErrors | null {
    if (!this.timePredicate || !this.isCustomRangePredicate || !control.parent) {
      return null;
    }
    const start = this.localDateTime(control.parent, 'dateValue', 'timeValue');
    const end = this.localDateTime(control.parent, 'dateValueTo', 'timeValueTo');
    return start && end && start.getTime() > end.getTime() ? { range: true } : null;
  }

  /** A From or To field pair as a local date-time; null while the date or time is missing or invalid. */
  private localDateTime(form: AbstractControl, dateControl: string, timeControl: string): Date | null {
    const date = this.dateFormat.parse(form.get(dateControl)?.value);
    const time = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(form.get(timeControl)?.value || '');
    if (!date || !time) {
      return null;
    }
    const [, hours, minutes, seconds] = time;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), +hours, +minutes, +(seconds ?? 0));
  }

  private parseTimeValue(dateTime: string): string {
    if (!!dateTime && dateTime.indexOf('T') > 0) {
      return dateTime.substring(dateTime.indexOf('T') + 1);
    }
    return '';
  }
}

/** The options Clarity's range picker accepts: a `value` of exactly two valid dates. Applied to the buttons too. */
function validRangeOptions(options: DateRangeOption[] | undefined): DateRangeOption[] {
  const isDate = (value: unknown) => value instanceof Date && !isNaN(value.getTime());
  return (options ?? []).filter(option => option?.value?.length === 2 && option.value.every(isDate));
}

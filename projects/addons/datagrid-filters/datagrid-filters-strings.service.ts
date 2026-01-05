/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { ComparisonOperator, LogicalOperator, TimeSpan, Unit } from './model/datagrid-filters.enums';

/**
 * User-visible strings used in the 'appfx-datagrid-filters' library.
 * Fields are read-only to avoid accidentally modifying the values and affecting all
 * filters in the application.
 *
 * Strings are in English only. If you need to provide localized strings:
 * - extend this class
 * - override all fields with localized values
 * - provide instance in the module, where you use AppFx
 *
 * ```
 * @NgModule({
 *    ...
 *    providers: [
 *       { provide: DatagridFiltersStrings, useClass: LocalizedDatagridFiltersStrings },
 *    ]
 * })
 * export class AppModule {}
 * ```
 */
@Injectable()
export class DatagridFiltersStrings {
  /**
   * Quick filter label.
   */
  readonly quickFilter: string = 'Quick Filter';

  /**
   * Advanced filter label.
   */
  readonly advancedFilter: string = 'Advanced Filter';

  /**
   * Input placeholder.
   */
  readonly enterValue: string = 'Enter value';

  /**
   * Required validator error message
   */
  readonly requiredValidatorMessage: string = 'This field is required';

  /**
   * Numeric input validator error message
   */
  readonly integerValidatorMessage: string = 'Integer value required';

  /**
   * Add new filter button label.
   */
  readonly addNew: string = 'Add new';

  /**
   * Add new filter button aria label.
   */
  readonly addNewAriaLabel: string = 'Add new filter';

  /**
   * Select filter label.
   */
  readonly filterLabel: string = 'Filter';

  /**
   * Select operator label.
   */
  readonly operatorLabel: string = 'Operator';

  /**
   * Comparison operator display names.
   */
  readonly operator: {
    after: string;
    afterOrEqualTo: string;
    before: string;
    beforeOrEqualTo: string;
    contains: string;
    customRange: string;
    doesNotContain: string;
    doesNotEqual: string;
    endsWith: string;
    equals: string;
    greaterThan: string;
    greaterThanOrEqualTo: string;
    isEmpty: string;
    lastDay: string;
    lastWeek: string;
    lastMonth: string;
    lastYear: string;
    lessThan: string;
    lessThanOrEqualTo: string;
    startsWith: string;
    timeSpan: string;
  } = {
    after: 'After',
    afterOrEqualTo: 'After or equal to',
    before: 'Before',
    beforeOrEqualTo: 'Before or equal to',
    contains: 'Contains',
    customRange: 'Custom range',
    doesNotContain: 'Does not contain',
    doesNotEqual: 'Does not equal',
    endsWith: 'Ends with',
    equals: 'Equals',
    greaterThan: 'Greater than',
    greaterThanOrEqualTo: 'Greater than or equal to',
    isEmpty: 'Is empty',
    lastDay: 'Last day',
    lastWeek: 'Last week',
    lastMonth: 'Last month',
    lastYear: 'Last year',
    lessThan: 'Less than',
    lessThanOrEqualTo: 'Less than or equal to',
    startsWith: 'Starts with',
    timeSpan: 'Time span',
  };

  /**
   * Select unit aria label.
   */
  readonly unitAriaLabel: string = 'Unit';

  /**
   * Add second condition button label.
   */
  readonly addCondition: string = 'Add condition';

  /**
   * Remove second condition button aria label.
   */
  readonly removeConditionAriaLabel: string = 'Remove second condition';

  /**
   * Conjoiners.
   */
  readonly logicalOperator: {
    and: string;
    or: string;
  } = {
    and: 'And',
    or: 'Or',
  };

  /**
   * Cancel button label.
   */
  readonly cancel: string = 'Cancel';

  /**
   * Apply button label.
   */
  readonly apply: string = 'Apply';

  /**
   * Select values label.
   */
  readonly valueLabel: string = 'Value';

  /**
   * Select all option label.
   */
  readonly selectAll: string = 'Select all';

  /**
   * Applied filters text.
   */
  readonly appliedText: string = 'applied';

  readonly editFilterText: string = 'Edit filter';

  readonly removeFilterText: string = 'Remove filter';

  readonly hideButtonLabel: string = 'Hide';

  readonly hideButtonAriaLabel: string = 'Hide filters';

  readonly showButtonLabel: string = 'Show';

  readonly filtersText: string = 'filters';

  readonly filterText: string = 'filter';

  readonly clearAllButtonLabel: string = 'Clear all';

  readonly clearAllButtonAriaLabel: string = 'Clear all filters';

  /**
   * Add time condition button label.
   */
  readonly addTimeFilter: string = 'Filter by time';

  /**
   * Date input placeholder.
   */
  readonly dateFormat: string = 'YYYY-MM-DD';

  /**
   * Time input placeholder.
   */
  readonly timeFormat: string = 'HH:mm';

  /**
   * Date input validator error message
   */
  readonly dateValidatorMessage: string = 'Invalid date format';

  /**
   * Time input validator error message
   */
  readonly timeValidatorMessage: string = 'Invalid time format';

  readonly fromLabel: string = 'From';

  readonly toLabel: string = 'To';

  /**
   * Remove time filter button aria label.
   */
  readonly removeTimeFilterAriaLabel: string = 'Remove time filter';

  readonly timeSpan: {
    minutes: string;
    hours: string;
    days: string;
    weeks: string;
    months: string;
    years: string;
  } = {
    minutes: 'Minutes',
    hours: 'Hours',
    days: 'Days',
    weeks: 'Weeks',
    months: 'Months',
    years: 'Years',
  };

  /**
   * Time span aria label.
   */
  readonly timeSpanAriaLabel: string = 'Time span';

  readonly timeSpanInputLabel: string = 'In the last';

  readonly unit: {
    byte: string;
    kb: string;
    mb: string;
    gb: string;
    tb: string;
    hz: string;
    khz: string;
    mhz: string;
    ghz: string;
    byteps: string;
    kbyteps: string;
    mbyteps: string;
    gbyteps: string;
    bitps: string;
    kbitps: string;
    mbitps: string;
    gbitps: string;
  } = {
    byte: 'B',
    kb: 'KB',
    mb: 'MB',
    gb: 'GB',
    tb: 'TB',
    hz: 'Hz',
    khz: 'KHz',
    mhz: 'MHz',
    ghz: 'GHz',
    byteps: 'B/s',
    kbyteps: 'KB/s',
    mbyteps: 'MB/s',
    gbyteps: 'GB/s',
    bitps: 'Bit/s',
    kbitps: 'Kbit/s',
    mbitps: 'Mbit/s',
    gbitps: 'Gbit/s',
  };

  getOperatorDisplayName(operator: ComparisonOperator): string {
    switch (operator) {
      case ComparisonOperator.After:
        return this.operator.after;
      case ComparisonOperator.AfterOrEqualTo:
        return this.operator.afterOrEqualTo;
      case ComparisonOperator.Before:
        return this.operator.before;
      case ComparisonOperator.BeforeOrEqualTo:
        return this.operator.beforeOrEqualTo;
      case ComparisonOperator.Contains:
        return this.operator.contains;
      case ComparisonOperator.CustomRange:
        return this.operator.customRange;
      case ComparisonOperator.DoesNotContain:
        return this.operator.doesNotContain;
      case ComparisonOperator.DoesNotEqual:
        return this.operator.doesNotEqual;
      case ComparisonOperator.Equals:
        return this.operator.equals;
      case ComparisonOperator.EndsWith:
        return this.operator.endsWith;
      case ComparisonOperator.GreaterThan:
        return this.operator.greaterThan;
      case ComparisonOperator.GreaterThanOrEqualTo:
        return this.operator.greaterThanOrEqualTo;
      case ComparisonOperator.IsEmpty:
        return this.operator.isEmpty;
      case ComparisonOperator.LastDay:
        return this.operator.lastDay;
      case ComparisonOperator.LastWeek:
        return this.operator.lastWeek;
      case ComparisonOperator.LastMonth:
        return this.operator.lastMonth;
      case ComparisonOperator.LastYear:
        return this.operator.lastYear;
      case ComparisonOperator.LessThan:
        return this.operator.lessThan;
      case ComparisonOperator.LessThanOrEqualTo:
        return this.operator.lessThanOrEqualTo;
      case ComparisonOperator.StartsWith:
        return this.operator.startsWith;
      case ComparisonOperator.TimeSpan:
        return this.operator.timeSpan;
      default:
        return 'Unknown operator!';
    }
  }

  getConjoinerDisplayName(conjoiner: LogicalOperator): string {
    switch (conjoiner) {
      case LogicalOperator.And:
        return this.logicalOperator.and;
      case LogicalOperator.Or:
        return this.logicalOperator.or;
      default:
        return 'Unknown logical operator!';
    }
  }

  getTimeSpanDisplayName(timeSpan: TimeSpan): string {
    switch (timeSpan) {
      case TimeSpan.Minutes:
        return this.timeSpan.minutes;
      case TimeSpan.Hours:
        return this.timeSpan.hours;
      case TimeSpan.Days:
        return this.timeSpan.days;
      case TimeSpan.Weeks:
        return this.timeSpan.weeks;
      case TimeSpan.Months:
        return this.timeSpan.months;
      case TimeSpan.Years:
        return this.timeSpan.years;
      default:
        return 'Unknown time span!';
    }
  }

  getUnitDisplayName(unit: Unit): string {
    switch (unit) {
      case Unit.Byte:
        return this.unit.byte;
      case Unit.KB:
        return this.unit.kb;
      case Unit.MB:
        return this.unit.mb;
      case Unit.GB:
        return this.unit.gb;
      case Unit.TB:
        return this.unit.tb;
      case Unit.HZ:
        return this.unit.hz;
      case Unit.KHZ:
        return this.unit.khz;
      case Unit.MHZ:
        return this.unit.mhz;
      case Unit.GHZ:
        return this.unit.ghz;
      case Unit.BytePS:
        return this.unit.byteps;
      case Unit.KBytePS:
        return this.unit.kbyteps;
      case Unit.MBytePS:
        return this.unit.mbyteps;
      case Unit.GBytePS:
        return this.unit.gbyteps;
      case Unit.BitPS:
        return this.unit.bitps;
      case Unit.KBitPS:
        return this.unit.kbitps;
      case Unit.MBitPS:
        return this.unit.mbitps;
      case Unit.GBitPS:
        return this.unit.gbitps;
      default:
        return 'Unknown unit!';
    }
  }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable @typescript-eslint/parameter-properties */

import { DateRangeOption } from '@clr/angular/forms';

import { ComparisonOperator, LogicalOperator, TimeSpan, Unit } from './datagrid-filters.enums';

/**
 * Defines a property that can be used to filter data in a datagrid.
 * Filterable properties are usually a subset of the datagrid columns.
 */
export abstract class FilterablePropertyDefinition {
  /**
   * Used internally to store dynamically the selected numeric value, unit and/or other properties.
   */
  [key: string]: any;

  /**
   * Name as shown to users
   */
  displayName: string;

  /**
   *  Actual name of the property that is used for filtering
   */
  property: string;

  /**
   *  List of comparison operators. Optional.
   *  Use it to override the default operators for the property.
   *  Useful in case the data provider does not support all operators.
   */
  supportedOperators?: ComparisonOperator[];

  protected constructor(displayName: string, property: string, operators?: ComparisonOperator[]) {
    this.displayName = displayName;
    this.property = property;
    if (operators) {
      this.supportedOperators = operators;
    }
  }
}

export class StringPropertyDefinition extends FilterablePropertyDefinition {
  /**
   * Indicates that the property can be used with single condition only.
   */
  singleCondition = false;

  /**
   * Indicates that this property only supports a single logical operator (AND or OR).
   */
  logicalOperator: LogicalOperator | undefined;

  private readonly defaultOperators: ComparisonOperator[] = [
    ComparisonOperator.Equals,
    ComparisonOperator.DoesNotEqual,
    ComparisonOperator.Contains,
    ComparisonOperator.DoesNotContain,
    ComparisonOperator.StartsWith,
    ComparisonOperator.EndsWith,
    ComparisonOperator.IsEmpty,
  ];

  constructor(
    displayName: string,
    property: string,
    operators?: ComparisonOperator[],
    singleCondition?: boolean,
    logicalOperator?: LogicalOperator
  ) {
    super(displayName, property, operators);
    if (singleCondition) {
      this.singleCondition = singleCondition;
    }
    this.logicalOperator = logicalOperator;
  }

  getOperators(): ComparisonOperator[] {
    return this.supportedOperators || this.defaultOperators;
  }
}

export class EnumPropertyDefinition extends FilterablePropertyDefinition {
  /**
   * Enumeration key/value data to be used in the filter selection
   */
  values: Map<string, string>;

  /**
   * Indicates that the property should be used for single select filtering
   */
  singleSelect = false;

  /**
   * Indicates that the enumeration should be searchable in the filter UI.
   */
  searchable = false;

  /**
   * Flag indicating whether to show the select all checkbox.
   */
  enableSelectAll = true;

  /**
   * Creates an instance of EnumPropertyDefinition.
   * @param displayName - The human-readable name of the property shown in the UI.
   * @param property - The technical property name used for filtering logic.
   * @param values - A Map containing the enum keys and their corresponding display values.
   * @param singleSelect - Whether the filter restricts selection to a single item. Defaults to false.
   * @param searchable - Whether to enable a search input for the enum options. Defaults to false.
   * @param enableSelectAll - Whether to display the select all checkbox. Defaults to true.
   * @param allowNotInOperator - Flag indicating whether to allow the use of the "NOT IN" operator
   *        for the selected values, enabling users to exclude specific enum items.
   */
  constructor(
    displayName: string,
    property: string,
    values: Map<string, string>,
    singleSelect = false,
    searchable = false,
    enableSelectAll = true,
    allowNotInOperator = false
  ) {
    super(
      displayName,
      property,
      allowNotInOperator ? [ComparisonOperator.DoesNotEqual, ComparisonOperator.Equals] : undefined
    );
    this.values = values;
    this.singleSelect = singleSelect;
    this.searchable = searchable;
    this.enableSelectAll = enableSelectAll;
  }
}

export class NumericPropertyDefinition extends FilterablePropertyDefinition {
  /**
   * Default unit of the metric
   */
  unit: Unit;
  /**
   * Indicates that the property can be used with single condition only.
   */
  singleCondition = false;

  /**
   * Indicates that this property only supports a single logical operator (AND or OR).
   */
  logicalOperator: LogicalOperator | undefined;

  private readonly defaultOperators: ComparisonOperator[] = [
    ComparisonOperator.Equals,
    ComparisonOperator.DoesNotEqual,
    ComparisonOperator.LessThan,
    ComparisonOperator.LessThanOrEqualTo,
    ComparisonOperator.GreaterThan,
    ComparisonOperator.GreaterThanOrEqualTo,
    ComparisonOperator.IsEmpty,
  ];

  constructor(
    displayName: string,
    property: string,
    operators?: ComparisonOperator[],
    unit?: Unit,
    singleCondition?: boolean,
    logicalOperator?: LogicalOperator
  ) {
    super(displayName, property, operators);
    // Check for null and undefined
    if (unit !== null && unit !== undefined) {
      this.unit = unit;
    }
    if (singleCondition) {
      this.singleCondition = singleCondition;
    }
    this.logicalOperator = logicalOperator;
  }

  getOperators(): ComparisonOperator[] {
    return this.supportedOperators || this.defaultOperators;
  }
}

export class UserPropertyDefinition extends FilterablePropertyDefinition {
  constructor(displayName: string, property: string) {
    super(displayName, property, [ComparisonOperator.Equals, ComparisonOperator.DoesNotEqual]);
  }
}

export class DateTimePropertyDefinition extends FilterablePropertyDefinition {
  /**
   * Flag indicating whether to include seconds in the time selector for the DateTime filter.
   */
  includeSeconds: boolean;

  /**
   * Preset ranges offered by the custom range operator. Without times they are listed in the date range picker; with
   * times they are buttons under the operator. Each `value` is `[start, end]`, both inclusive, used as given. A `Date`
   * at exactly 00:00 means the whole day. Options whose `value` is not two valid dates are ignored.
   */
  rangeOptions: DateRangeOption[];

  private readonly defaultOperators: ComparisonOperator[] = [
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

  constructor(
    displayName: string,
    property: string,
    operators?: ComparisonOperator[],
    includeSeconds?: boolean,
    rangeOptions?: DateRangeOption[]
  ) {
    super(displayName, property, operators);
    this.includeSeconds = includeSeconds ? includeSeconds : false;
    this.rangeOptions = rangeOptions ?? [];
  }

  getOperators(): ComparisonOperator[] {
    return this.supportedOperators || this.defaultOperators;
  }
}

/**
 * Editor choices that the criteria alone cannot express, kept on each filter so that field definitions
 * can be shared between filter bars. Date-time filters store the operator as chosen (e.g. Last week or
 * Time span) and the entered dates; numeric filters with units store the typed values and units.
 */
export interface FilterEditorState {
  /** Date-time operator as chosen in the editor. */
  operator?: ComparisonOperator;
  /** Date-time value as `yyyy-MM-dd` or `yyyy-MM-ddTHH:mm[:ss]`. The start of a custom range. */
  value?: string;
  /** End of a custom range, in the same format as `value`. Inclusive. */
  valueTo?: string;
  timeSpanValue?: number;
  timeSpan?: TimeSpan;
  /** Numeric with unit: the value typed for each condition, before unit conversion. */
  values?: any[];
  /** Numeric with unit: the unit chosen for each condition. */
  units?: Unit[];
}

/**
 * An on/off pill for `toggleFilters`: ON applies `filter`, OFF applies nothing.
 */
export interface ToggleFilter {
  /**
   * Text of the pill, shown as given (any free text, translated by the host). Without a label, or with an empty
   * one, the text is generated from the filter's criteria, e.g. "Status: Warning". The tooltip always shows the
   * criteria.
   */
  label?: string;
  /** The filter applied while the toggle is ON. Toggles are identified by its criteria, not by the label. */
  filter: PropertyFilter;
}

export class PropertyFilter {
  /**
   *  Filter criteria
   */
  criteria: PropertyPredicate[];
  /**
   *  Logical operator. Supported values are AND/OR
   */
  operator: LogicalOperator;
  /**
   * Set by the built-in editors. Optional for host-built filters such as presets; without it the
   * editor and pill derive what they can from the criteria.
   */
  editorState?: FilterEditorState;
}

export class PropertyPredicate {
  /**
   *  Property that is used for filtering
   */
  filterableProperty: FilterablePropertyDefinition;

  /**
   *  Filtering operator
   */
  operator: ComparisonOperator;

  /**
   *  Filter value
   */
  value: any;
}

export interface EnumPropertyData {
  key: string;
  value: string;
}

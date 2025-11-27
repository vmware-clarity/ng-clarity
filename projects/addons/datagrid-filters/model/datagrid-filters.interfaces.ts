/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable @typescript-eslint/parameter-properties */

import { ComparisonOperator, LogicalOperator, Unit } from './datagrid-filters.enums';

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

  constructor(displayName: string, property: string, values: Map<string, string>, singleSelect?: boolean) {
    super(displayName, property);
    this.values = values;
    if (singleSelect) {
      this.singleSelect = singleSelect;
    }
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

export class DateTimePropertyDefinition extends FilterablePropertyDefinition {
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

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(displayName: string, property: string, operators?: ComparisonOperator[]) {
    super(displayName, property, operators);
  }

  getOperators(): ComparisonOperator[] {
    return this.supportedOperators || this.defaultOperators;
  }
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

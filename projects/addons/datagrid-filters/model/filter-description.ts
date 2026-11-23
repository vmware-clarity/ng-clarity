/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { formatDate } from '@angular/common';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { ComparisonOperator, TimeSpan } from './datagrid-filters.enums';
import {
  DateTimePropertyDefinition,
  EnumPropertyDefinition,
  FilterablePropertyDefinition,
  NumericPropertyDefinition,
  PropertyFilter,
} from './datagrid-filters.interfaces';
import { dateTimeEditorState, parseLocalDateTime } from './date-time-editor-state';

/**
 * Plain-text descriptions of a filter, shared by the pill (text, tooltip, aria-label) and the editor's read-back,
 * so both always say the same thing.
 */

const noDisplayValueOperators: ComparisonOperator[] = [
  ComparisonOperator.IsEmpty,
  ComparisonOperator.LastDay,
  ComparisonOperator.LastWeek,
  ComparisonOperator.LastMonth,
  ComparisonOperator.LastYear,
];

/**
 * One condition of the filter, e.g. "Contains: linux", or "Contains linux" when compact (the pill format).
 * A date-time filter is always one condition, built from its editor state.
 */
export function describeCondition(
  strings: DatagridFiltersStrings,
  locale: string,
  property: FilterablePropertyDefinition,
  filter: PropertyFilter,
  index: number,
  compact = false
): string {
  if (property instanceof DateTimePropertyDefinition) {
    return describeDateTime(strings, locale, property, filter, compact);
  }
  const predicate = filter.criteria[index];
  const operator = strings.getOperatorDisplayName(predicate.operator);
  if (predicate.operator === ComparisonOperator.IsEmpty) {
    return operator;
  }
  const predicateProperty = predicate.filterableProperty;
  let value = predicate.value;
  if (predicateProperty instanceof EnumPropertyDefinition) {
    value = predicateProperty.values.get(predicate.value) ?? value;
  } else if (predicateProperty instanceof NumericPropertyDefinition && predicateProperty.unit !== undefined) {
    const state = filter.editorState;
    value =
      (state?.values?.[index] ?? value) +
      ' ' +
      strings.getUnitDisplayName(state?.units?.[index] ?? predicateProperty.unit);
  }
  return operator + (compact ? ' ' : ': ') + value;
}

/**
 * The whole filter after the field name, conditions joined by the filter's conjoiner, e.g.
 * "Contains: web Or Starts with: db". Empty for a filter without conditions.
 */
export function describeConditions(
  strings: DatagridFiltersStrings,
  locale: string,
  property: FilterablePropertyDefinition,
  filter: PropertyFilter
): string {
  if (!filter.criteria?.length && !(property instanceof DateTimePropertyDefinition && filter.editorState)) {
    return '';
  }
  if (property instanceof DateTimePropertyDefinition) {
    return describeCondition(strings, locale, property, filter, 0);
  }
  const conjoiner = ' ' + strings.getConjoinerDisplayName(filter.operator) + ' ';
  return filter.criteria.map((_, index) => describeCondition(strings, locale, property, filter, index)).join(conjoiner);
}

function describeDateTime(
  strings: DatagridFiltersStrings,
  locale: string,
  property: DateTimePropertyDefinition,
  filter: PropertyFilter,
  compact: boolean
): string {
  const separator = compact ? ' ' : ': ';
  const state = dateTimeEditorState(filter);
  const format = (value: string | undefined) => formatDateTime(locale, property, value);

  // dateTimeEditorState always sets the operator; the check only narrows the type.
  if (!state || state.operator === undefined) {
    // Criteria with no date-time meaning (e.g. a custom preset): show them as they are.
    const predicate = filter.criteria?.[0];
    if (!predicate) {
      return '';
    }
    return strings.getOperatorDisplayName(predicate.operator) + separator + format(predicate.value);
  }
  const operator = state.operator;
  if (operator === ComparisonOperator.CustomRange) {
    return (
      strings.fromLabel + separator + format(state.value) + ' ' + strings.toLabel + separator + format(state.valueTo)
    );
  }
  if (noDisplayValueOperators.includes(operator)) {
    return strings.getOperatorDisplayName(operator);
  }
  if (operator === ComparisonOperator.TimeSpan) {
    return (
      strings.getOperatorDisplayName(operator) +
      separator +
      state.timeSpanValue +
      ' ' +
      strings.getTimeSpanDisplayName(state.timeSpan as TimeSpan)
    );
  }
  return strings.getOperatorDisplayName(operator) + separator + format(state.value);
}

/** Dates use the locale's medium date format; times are shown only when the value has one. */
function formatDateTime(locale: string, property: DateTimePropertyDefinition, dateTime: string | undefined): string {
  const parsed = parseLocalDateTime(dateTime);
  if (!parsed) {
    return dateTime ?? '';
  }
  const date = formatDate(parsed.date, 'mediumDate', locale);
  return parsed.hasTime
    ? date + ' ' + formatDate(parsed.date, property.includeSeconds ? 'mediumTime' : 'shortTime', locale)
    : date;
}

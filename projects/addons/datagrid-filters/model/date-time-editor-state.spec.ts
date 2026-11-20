/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComparisonOperator, LogicalOperator } from './datagrid-filters.enums';
import { DateTimePropertyDefinition, PropertyFilter } from './datagrid-filters.interfaces';
import { addDays, dateTimeEditorState, toIsoDate } from './date-time-editor-state';
import { clockChangeDays } from './date-time-editor-state.mock';

const property = new DateTimePropertyDefinition('Created', 'created');
const range = (from: string, to: string): PropertyFilter => ({
  operator: LogicalOperator.And,
  criteria: [
    { filterableProperty: property, operator: ComparisonOperator.GreaterThanOrEqualTo, value: from },
    { filterableProperty: property, operator: ComparisonOperator.LessThan, value: to },
  ],
});
const nextDay = (iso: string) => toIsoDate(addDays(new Date(`${iso}T00:00:00`), 1));

describe('dateTimeEditorState', () => {
  it('reads [day, next day) as Equals on a normal day', () => {
    expect(dateTimeEditorState(range('2026-08-09T00:00:00', '2026-08-10T00:00:00'))).toEqual({
      operator: ComparisonOperator.Equals,
      value: '2026-08-09',
    });
  });

  it('reads [minute, next minute) as Equals', () => {
    expect(dateTimeEditorState(range('2026-08-09T10:30:00', '2026-08-09T10:31:00'))).toEqual({
      operator: ComparisonOperator.Equals,
      value: '2026-08-09T10:30',
    });
  });

  it('reads [second, next second) as Equals on a field with seconds', () => {
    const withSeconds = new DateTimePropertyDefinition('Created', 'created', undefined, true);
    const filter = range('2026-08-09T10:30:15', '2026-08-09T10:30:16');
    filter.criteria.forEach(predicate => (predicate.filterableProperty = withSeconds));
    expect(dateTimeEditorState(filter)).toEqual({
      operator: ComparisonOperator.Equals,
      value: '2026-08-09T10:30:15',
    });
  });

  it('reads a custom range end a second before the exclusive end on a field with seconds', () => {
    const withSeconds = new DateTimePropertyDefinition('Created', 'created', undefined, true);
    const filter = range('2026-08-09T10:30:15', '2026-08-09T12:00:16');
    filter.criteria.forEach(predicate => (predicate.filterableProperty = withSeconds));
    expect(dateTimeEditorState(filter)).toEqual({
      operator: ComparisonOperator.CustomRange,
      value: '2026-08-09T10:30:15',
      valueTo: '2026-08-09T12:00:15',
    });
  });

  it('reads a custom range with its inclusive end date', () => {
    expect(dateTimeEditorState(range('2026-08-01T00:00:00', '2026-08-10T00:00:00'))).toEqual({
      operator: ComparisonOperator.CustomRange,
      value: '2026-08-01',
      valueTo: '2026-08-09',
    });
  });

  const days = clockChangeDays(2026);

  // Skipped in a time zone without daylight saving (e.g. UTC).
  describe.skipIf(!days.length)('on the days the clocks change', () => {
    it('reads midnight to the next midnight as Equals, however many hours the day has', () => {
      days.forEach(day => {
        expect(dateTimeEditorState(range(`${day}T00:00:00`, `${nextDay(day)}T00:00:00`)), day).toEqual({
          operator: ComparisonOperator.Equals,
          value: day,
        });
      });
    });

    it('reads the end date of a custom range that ends the day after a clock change', () => {
      days.forEach(day => {
        expect(dateTimeEditorState(range('2026-01-01T00:00:00', `${nextDay(day)}T00:00:00`)), day).toEqual({
          operator: ComparisonOperator.CustomRange,
          value: '2026-01-01',
          valueTo: day,
        });
      });
    });
  });
});

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { ComparisonOperator, LogicalOperator, TimeSpan, Unit } from './datagrid-filters.enums';
import {
  DateTimePropertyDefinition,
  EnumPropertyDefinition,
  NumericPropertyDefinition,
  PropertyFilter,
  StringPropertyDefinition,
} from './datagrid-filters.interfaces';
import { describeCondition, describeConditions } from './filter-description';

const strings = new DatagridFiltersStrings();
const locale = 'en-US';

describe('filter description', () => {
  it('joins text conditions with the filter conjoiner', () => {
    const name = new StringPropertyDefinition('Name', 'name');
    const filter: PropertyFilter = {
      operator: LogicalOperator.Or,
      criteria: [
        { filterableProperty: name, operator: ComparisonOperator.Contains, value: 'web' },
        { filterableProperty: name, operator: ComparisonOperator.IsEmpty, value: '' },
      ],
    };
    expect(describeConditions(strings, locale, name, filter)).toBe('Contains: web Or Is empty');
    expect(describeCondition(strings, locale, name, filter, 0, true)).toBe('Contains web');
  });

  it('shows enum labels and numeric units', () => {
    const status = new EnumPropertyDefinition('Status', 'status', new Map([['alert', 'Alert']]));
    const enumFilter: PropertyFilter = {
      operator: LogicalOperator.Or,
      criteria: [{ filterableProperty: status, operator: ComparisonOperator.Equals, value: 'alert' }],
    };
    expect(describeConditions(strings, locale, status, enumFilter)).toBe('Equals: Alert');

    const memory = new NumericPropertyDefinition('Memory', 'memory', undefined, Unit.MB);
    const numericFilter: PropertyFilter = {
      operator: LogicalOperator.And,
      criteria: [{ filterableProperty: memory, operator: ComparisonOperator.GreaterThan, value: '4096' }],
      editorState: { values: ['4'], units: [Unit.GB] },
    };
    expect(describeConditions(strings, locale, memory, numericFilter)).toBe('Greater than: 4 GB');
  });

  it('describes a date-time filter from its editor state alone', () => {
    const created = new DateTimePropertyDefinition('Created', 'created');
    const filter = (editorState: PropertyFilter['editorState']): PropertyFilter => ({
      operator: LogicalOperator.And,
      criteria: [],
      editorState,
    });
    expect(
      describeConditions(
        strings,
        locale,
        created,
        filter({ operator: ComparisonOperator.CustomRange, value: '2026-11-16', valueTo: '2026-11-23' })
      )
    ).toBe('From: Nov 16, 2026 To: Nov 23, 2026');
    expect(
      describeConditions(
        strings,
        locale,
        created,
        filter({ operator: ComparisonOperator.TimeSpan, timeSpanValue: 3, timeSpan: TimeSpan.Days })
      )
    ).toBe('Time span: 3 Days');
    expect(describeConditions(strings, locale, created, filter({ operator: ComparisonOperator.LastWeek }))).toBe(
      'Last week'
    );
  });

  it('is empty without conditions', () => {
    const name = new StringPropertyDefinition('Name', 'name');
    expect(describeConditions(strings, locale, name, { operator: LogicalOperator.And, criteria: [] })).toBe('');
  });
});

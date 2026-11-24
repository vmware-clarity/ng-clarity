/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { formatDate } from '@angular/common';

import { ComparisonOperator, LogicalOperator } from './datagrid-filters.enums';
import { DateTimePropertyDefinition, FilterEditorState, PropertyFilter } from './datagrid-filters.interfaces';
import { oneMinuteMs, oneSecondMs } from './date-time-constants';

// Internal helpers for date-time filters. Not exported from the package.

const LOCAL_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?/;

/**
 * A stored or emitted date-time ("2003-05-01", "2003-05-01T10:30", "2003-05-01T00:00:00+03:00") as a local `Date`.
 * A trailing UTC offset is ignored: the editors write local times followed by the local offset.
 */
export function parseLocalDateTime(value: string | undefined): { date: Date; hasTime: boolean } | null {
  const match = LOCAL_DATE_TIME.exec(value || '');
  if (!match) {
    return null;
  }
  const [, year, month, day, hours, minutes, seconds] = match;
  const date = new Date(+year, +month - 1, +day, +(hours ?? 0), +(minutes ?? 0), +(seconds ?? 0));
  return isNaN(date.getTime()) ? null : { date, hasTime: hours !== undefined };
}

function isMidnight(date: Date): boolean {
  return !date.getHours() && !date.getMinutes() && !date.getSeconds();
}

/** Midnight `days` calendar days after (or before) the date. A day can have 23 or 25 hours, so not `days * 24h`. */
function midnightAfter(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** The editor state format: `yyyy-MM-dd`, or `yyyy-MM-ddTHH:mm[:ss]` when the time is not midnight. */
function toStateValue(date: Date): string {
  const format = isMidnight(date) ? 'yyyy-MM-dd' : date.getSeconds() ? 'yyyy-MM-ddTHH:mm:ss' : 'yyyy-MM-ddTHH:mm';
  return formatDate(date, format, 'en-US');
}

function normalize(value: string): string | undefined {
  const parsed = parseLocalDateTime(value);
  return parsed ? toStateValue(parsed.date) : undefined;
}

const singleOperators = new Map<ComparisonOperator, ComparisonOperator>([
  [ComparisonOperator.Before, ComparisonOperator.Before],
  [ComparisonOperator.LessThan, ComparisonOperator.Before],
  [ComparisonOperator.BeforeOrEqualTo, ComparisonOperator.BeforeOrEqualTo],
  [ComparisonOperator.LessThanOrEqualTo, ComparisonOperator.BeforeOrEqualTo],
  [ComparisonOperator.After, ComparisonOperator.After],
  [ComparisonOperator.GreaterThan, ComparisonOperator.After],
  [ComparisonOperator.AfterOrEqualTo, ComparisonOperator.AfterOrEqualTo],
  [ComparisonOperator.GreaterThanOrEqualTo, ComparisonOperator.AfterOrEqualTo],
  [ComparisonOperator.Equals, ComparisonOperator.Equals],
]);

/**
 * The editor state of a date-time filter: its own `editorState` when an editor built it, otherwise derived from the
 * criteria (e.g. a host preset). Relative operators (Last week, Time span) cannot be recovered from criteria, so such
 * filters are read as the absolute range they cover. Returns null when the criteria have no date-time meaning.
 */
export function dateTimeEditorState(filter: PropertyFilter | undefined): FilterEditorState | null {
  if (filter?.editorState?.operator !== undefined) {
    return filter.editorState;
  }
  const criteria = filter?.criteria ?? [];
  if (criteria.length === 1) {
    const [predicate] = criteria;
    if (predicate.operator === ComparisonOperator.IsEmpty) {
      return { operator: ComparisonOperator.IsEmpty };
    }
    const operator = singleOperators.get(predicate.operator);
    const value = normalize(predicate.value);
    return operator !== undefined && value ? { operator, value } : null;
  }
  if (criteria.length === 2 && filter?.operator === LogicalOperator.And) {
    const from = criteria.find(predicate => predicate.operator === ComparisonOperator.GreaterThanOrEqualTo);
    const to = criteria.find(predicate => predicate.operator === ComparisonOperator.LessThan);
    const start = parseLocalDateTime(from?.value);
    const end = parseLocalDateTime(to?.value);
    if (!from || !to || !start || !end) {
      return null;
    }
    // The editor steps by a second on a field with seconds, otherwise by a minute.
    const prop = criteria[0].filterableProperty;
    const stepMs = prop instanceof DateTimePropertyDefinition && prop.includeSeconds ? oneSecondMs : oneMinuteMs;

    // The editor writes Equals as [day, next day) or [time, time + step). A day is midnight to the next midnight,
    // however many hours it has.
    const isWholeDay = isMidnight(start.date) && end.date.getTime() === midnightAfter(start.date, 1).getTime();
    const isOneStep = end.date.getTime() - start.date.getTime() === stepMs;
    if (isWholeDay || isOneStep) {
      return { operator: ComparisonOperator.Equals, value: normalize(from.value) };
    }
    // A custom range ends at the midnight after its (inclusive) end date, or a step after its end time.
    const inclusiveEnd = isMidnight(end.date) ? midnightAfter(end.date, -1) : new Date(end.date.getTime() - stepMs);
    return {
      operator: ComparisonOperator.CustomRange,
      value: normalize(from.value),
      valueTo: toStateValue(inclusiveEnd),
    };
  }
  return null;
}

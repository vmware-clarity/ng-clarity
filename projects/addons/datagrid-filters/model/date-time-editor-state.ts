/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComparisonOperator, LogicalOperator } from './datagrid-filters.enums';
import { FilterEditorState, PropertyFilter } from './datagrid-filters.interfaces';

// Internal helpers for date-time filters. Not exported from the package.

const LOCAL_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?/;
const oneMinuteMs = 60 * 1000;
const oneDayMs = 24 * 60 * oneMinuteMs;

const pad = (value: number, length = 2) => value.toString().padStart(length, '0');

/**
 * A stored or emitted date-time ("2003-05-01", "2003-05-01T10:30", "2003-05-01T00:00:00+03:00") as a local `Date`.
 * A trailing UTC offset is ignored: the editors write local times followed by the local offset.
 */
export function parseLocalDateTime(value: string): { date: Date; hasTime: boolean } | null {
  const match = LOCAL_DATE_TIME.exec(value || '');
  if (!match) {
    return null;
  }
  const [, year, month, day, hours, minutes, seconds] = match;
  const date = new Date(+year, +month - 1, +day, +(hours ?? 0), +(minutes ?? 0), +(seconds ?? 0));
  return isNaN(date.getTime()) ? null : { date, hasTime: hours !== undefined };
}

/** A local date as `yyyy-MM-dd`, the date format of predicates and editor state. */
export function toIsoDate(date: Date): string {
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** `yyyy-MM-dd`, or `yyyy-MM-ddTHH:mm[:ss]` when the time is not midnight. */
function toStateValue(date: Date, withSeconds: boolean): string {
  const day = toIsoDate(date);
  if (!date.getHours() && !date.getMinutes() && !date.getSeconds()) {
    return day;
  }
  return `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}` + (withSeconds ? `:${pad(date.getSeconds())}` : '');
}

function normalize(value: string, shiftMs = 0): string | undefined {
  const parsed = parseLocalDateTime(value);
  if (!parsed) {
    return undefined;
  }
  const date = new Date(parsed.date.getTime() + shiftMs);
  return toStateValue(date, !!date.getSeconds());
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
  if (criteria.length === 2 && filter.operator === LogicalOperator.And) {
    const from = criteria.find(predicate => predicate.operator === ComparisonOperator.GreaterThanOrEqualTo);
    const to = criteria.find(predicate => predicate.operator === ComparisonOperator.LessThan);
    const start = parseLocalDateTime(from?.value);
    const end = parseLocalDateTime(to?.value);
    if (!start || !end) {
      return null;
    }
    const span = end.date.getTime() - start.date.getTime();
    if (span === oneDayMs || span === oneMinuteMs) {
      // The editor writes Equals as [day, next day) or [minute, next minute).
      return { operator: ComparisonOperator.Equals, value: normalize(from.value) };
    }
    // A custom range ends at the start of the day after its (inclusive) end date, or a minute after its end time.
    const endHasTime = !!(end.date.getHours() || end.date.getMinutes() || end.date.getSeconds());
    return {
      operator: ComparisonOperator.CustomRange,
      value: normalize(from.value),
      valueTo: normalize(to.value, endHasTime ? -oneMinuteMs : -oneDayMs),
    };
  }
  return null;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ComparisonOperator,
  DateTimePropertyDefinition,
  EnumPropertyDefinition,
  FilterablePropertyDefinition,
  LogicalOperator,
  NumericPropertyDefinition,
  PropertyFilter,
  PropertyPredicate,
  StringPropertyDefinition,
  Unit,
} from '@clr/addons/datagrid-filters';
import { DateRangeOption } from '@clr/angular';

export const nameProperty = new StringPropertyDefinition('VM Name', 'name');

export const stateProperty = new EnumPropertyDefinition(
  'State',
  'state',
  new Map([
    ['Powered On', 'Powered On'],
    ['Powered Off', 'Powered Off'],
  ]),
  true
);

export const statusProperty = new EnumPropertyDefinition(
  'Status',
  'status',
  new Map([
    ['Normal', 'Normal'],
    ['Warning', 'Warning'],
    ['Alert', 'Alert'],
  ])
);

export const guestOsProperty = new EnumPropertyDefinition(
  'Guest OS',
  'guestOs',
  new Map([
    ['linux', 'Linux'],
    ['windows', 'Windows'],
    ['other', 'Other'],
  ])
);

export const usedSpaceProperty = new NumericPropertyDefinition('Used space', 'usedSpace', undefined, Unit.GB);

/**
 * Preset ranges for Custom range. Dates are used as given; a Date at 00:00 means the whole day. Without times they show
 * in the date range picker, with times as buttons under the operator.
 */
function createdRangeOptions(): DateRangeOption[] {
  const now = new Date();
  const day = (offset: number, hours = 0, minutes = 0) =>
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, hours, minutes);
  return [
    { label: 'Today', value: [day(0), day(0)] },
    { label: 'Last 7 days', value: [day(-6), day(0)] },
    { label: 'This month', value: [new Date(now.getFullYear(), now.getMonth(), 1), day(0)] },
    { label: 'Working hours today', value: [day(0, 9), day(0, 17)] },
  ];
}

export const createdProperty = new DateTimePropertyDefinition(
  'Created',
  'created',
  undefined,
  false,
  createdRangeOptions()
);

export const vmProperties: FilterablePropertyDefinition[] = [
  nameProperty,
  stateProperty,
  statusProperty,
  guestOsProperty,
  usedSpaceProperty,
  createdProperty,
];

export function createPredicate(
  filterableProperty: FilterablePropertyDefinition,
  operator: ComparisonOperator,
  value: any
): PropertyPredicate {
  const predicate = new PropertyPredicate();
  predicate.filterableProperty = filterableProperty;
  predicate.operator = operator;
  predicate.value = value;
  return predicate;
}

export function createPropertyFilter(operator: LogicalOperator, ...criteria: PropertyPredicate[]): PropertyFilter {
  const propertyFilter = new PropertyFilter();
  propertyFilter.operator = operator;
  propertyFilter.criteria = criteria;
  return propertyFilter;
}

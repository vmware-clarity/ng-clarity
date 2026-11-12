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

export const createdProperty = new DateTimePropertyDefinition('Created', 'created');

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

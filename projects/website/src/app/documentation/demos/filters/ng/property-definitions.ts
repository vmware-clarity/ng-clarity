/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, Injectable } from '@angular/core';
import {
  AppfxDatagridFiltersModule,
  ComparisonOperator,
  DatagridFiltersUserService,
  DateTimePropertyDefinition,
  EnumPropertyDefinition,
  FilterablePropertyDefinition,
  FilterMode,
  LogicalOperator,
  NumericPropertyDefinition,
  PropertyFilter,
  PropertyPredicate,
  StringPropertyDefinition,
  Unit,
  UserPropertyDefinition,
} from '@clr/addons/datagrid-filters';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppliedFiltersComponent } from './applied-filters';

// Provide a custom user service for the User filter
@Injectable()
export class CustomUserService extends DatagridFiltersUserService {
  override getDomains(): Observable<string[]> {
    return timer(1000).pipe(map(() => ['CORP.EXAMPLE', 'CLOUD.EXAMPLE']));
  }

  override searchUsers(searchTerm: string): Observable<string[]> {
    const users = ['admin', 'john.doe', 'jane.smith'];
    return timer(500).pipe(map(() => users.filter(u => u.toLowerCase().includes(searchTerm.toLowerCase()))));
  }
}

const stringNameProperty = new StringPropertyDefinition('Name', 'name');
const stringAddressProperty = new StringPropertyDefinition('Address', 'address');

const dateTimeProperty = new DateTimePropertyDefinition('Last change', 'lastChanged');

const numericCustomerCountProperty = new NumericPropertyDefinition('Number of customers', 'customersCount');
const numericCapacityProperty = new NumericPropertyDefinition('Capacity', 'capacity', undefined, Unit.MB);

const enumValuesMap = new Map<string, string>([
  ['green', 'Green'],
  ['yellow', 'Yellow'],
  ['orange', 'Orange'],
  ['red', 'Red'],
]);
const enumProperty = new EnumPropertyDefinition('Status', 'status', enumValuesMap);
const singleSelectEnumProperty = new EnumPropertyDefinition('Color', 'color', enumValuesMap, true);

// Searchable enum with many values
const categoryValues = new Map<string, string>([
  ['auth.login', 'User Login'],
  ['resource.created', 'Resource Created'],
  ['deploy.completed', 'Deployment Completed'],
  // ... many more values
]);
const categoryEnumProp = new EnumPropertyDefinition(
  'Category',
  'category',
  categoryValues,
  false, // multi-select
  true, // searchable
  true, // enableSelectAll
  true // allowNotInOperator
);

// User filter — requires DatagridFiltersUserService
const userProp = new UserPropertyDefinition('User', 'user');

function createPreSelectedFilter(): PropertyFilter {
  const predicate = new PropertyPredicate();
  predicate.filterableProperty = categoryEnumProp;
  predicate.operator = ComparisonOperator.DoesNotEqual;
  predicate.value = [...categoryValues.keys()][0];

  const preSelectedFilter = new PropertyFilter();
  preSelectedFilter.operator = LogicalOperator.And;
  preSelectedFilter.criteria = [predicate];
  return preSelectedFilter;
}

@Component({
  selector: 'app-datagrid-filters-property-definitions-demo',
  templateUrl: './property-definitions.html',
  imports: [AppfxDatagridFiltersModule, AppliedFiltersComponent],
  providers: [{ provide: DatagridFiltersUserService, useClass: CustomUserService }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridFiltersPropertyDefinitionsDemoComponent {
  readonly filterMode = FilterMode.Advanced;
  readonly filterableProperties: FilterablePropertyDefinition[] = [
    stringNameProperty,
    stringAddressProperty,
    dateTimeProperty,
    numericCustomerCountProperty,
    numericCapacityProperty,
    enumProperty,
    singleSelectEnumProperty,
    categoryEnumProp,
    userProp,
  ];
  readonly presetFilters: PropertyFilter[] = [createPreSelectedFilter()];

  searchTerm = '';
  filters: PropertyFilter[] = [];
}

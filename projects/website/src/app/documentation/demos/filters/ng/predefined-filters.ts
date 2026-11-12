/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AppfxDatagridFiltersModule,
  ComparisonOperator,
  FilterMode,
  LogicalOperator,
  PropertyFilter,
} from '@clr/addons/datagrid-filters';

import { AppliedFiltersComponent } from './applied-filters';
import {
  createdProperty,
  createPredicate,
  createPropertyFilter,
  nameProperty,
  statusProperty,
  usedSpaceProperty,
  vmProperties,
} from './vm-properties';

@Component({
  selector: 'app-datagrid-filters-predefined-demo',
  templateUrl: './predefined-filters.html',
  imports: [AppfxDatagridFiltersModule, AppliedFiltersComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridFiltersPredefinedDemoComponent {
  readonly FilterMode = FilterMode;
  readonly filterableProperties = vmProperties;

  // Pills that stay visible, in this order, even without criteria.
  readonly predefinedFilters = [nameProperty, statusProperty, usedSpaceProperty, createdProperty];

  // Initial values, read once at start-up.
  readonly presetFilters: PropertyFilter[] = [
    createPropertyFilter(
      LogicalOperator.And,
      createPredicate(nameProperty, ComparisonOperator.Contains, 'web'),
      createPredicate(nameProperty, ComparisonOperator.DoesNotContain, 'test')
    ),
    createPropertyFilter(LogicalOperator.Or, createPredicate(statusProperty, ComparisonOperator.Equals, 'Warning')),
  ];

  filters: PropertyFilter[] = [];
}

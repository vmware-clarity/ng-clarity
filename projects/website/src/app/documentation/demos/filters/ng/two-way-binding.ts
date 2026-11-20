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
  ToggleFilter,
} from '@clr/addons/datagrid-filters';

import { AppliedFiltersComponent } from './applied-filters';
import {
  createPredicate,
  createPropertyFilter,
  nameProperty,
  stateProperty,
  statusProperty,
  vmProperties,
} from './vm-properties';

@Component({
  selector: 'app-datagrid-filters-two-way-demo',
  templateUrl: './two-way-binding.html',
  imports: [AppfxDatagridFiltersModule, AppliedFiltersComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridFiltersTwoWayDemoComponent {
  readonly FilterMode = FilterMode;
  readonly filterableProperties = vmProperties;

  readonly toggleFilters: ToggleFilter[] = [
    {
      filter: createPropertyFilter(
        LogicalOperator.Or,
        createPredicate(stateProperty, ComparisonOperator.Equals, 'Powered On')
      ),
    },
    {
      filter: createPropertyFilter(
        LogicalOperator.Or,
        createPredicate(statusProperty, ComparisonOperator.Equals, 'Alert')
      ),
    },
  ];

  // A saved view, e.g. read from a URL. Its second filter matches a toggle, so the toggle turns ON.
  readonly savedView: PropertyFilter[] = [
    createPropertyFilter(LogicalOperator.And, createPredicate(nameProperty, ComparisonOperator.StartsWith, 'db')),
    createPropertyFilter(LogicalOperator.Or, createPredicate(stateProperty, ComparisonOperator.Equals, 'Powered On')),
  ];

  filters: PropertyFilter[] = [];

  restoreSavedView(): void {
    // Assign a new array. Setting the input does not emit propertyFiltersChange.
    this.filters = [...this.savedView];
  }

  clearFromHost(): void {
    this.filters = [];
  }
}

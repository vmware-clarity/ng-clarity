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
import { createPredicate, createPropertyFilter, stateProperty, statusProperty, vmProperties } from './vm-properties';

@Component({
  selector: 'app-datagrid-filters-toggle-demo',
  templateUrl: './toggle-filters.html',
  imports: [AppfxDatagridFiltersModule, AppliedFiltersComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridFiltersToggleDemoComponent {
  readonly FilterMode = FilterMode;
  readonly filterableProperties = vmProperties;

  // Ready-made filters shown as on/off pills. ON applies the filter as configured.
  readonly toggleFilters: PropertyFilter[] = [
    createPropertyFilter(LogicalOperator.Or, createPredicate(stateProperty, ComparisonOperator.Equals, 'Powered On')),
    createPropertyFilter(LogicalOperator.Or, createPredicate(statusProperty, ComparisonOperator.Equals, 'Alert')),
  ];

  filters: PropertyFilter[] = [];
}

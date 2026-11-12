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
import { createdProperty, createPredicate, createPropertyFilter, vmProperties } from './vm-properties';

@Component({
  selector: 'app-datagrid-filters-date-time-demo',
  templateUrl: './date-time-filters.html',
  imports: [AppfxDatagridFiltersModule, AppliedFiltersComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridFiltersDateTimeDemoComponent {
  readonly FilterMode = FilterMode;
  readonly filterableProperties = vmProperties;
  readonly predefinedFilters = [createdProperty];

  filters: PropertyFilter[] = [];

  // Equals a day, written as the editor writes it: from that midnight to the next.
  showEqualsDay(): void {
    this.filters = [
      createPropertyFilter(
        LogicalOperator.And,
        createPredicate(createdProperty, ComparisonOperator.GreaterThanOrEqualTo, '2026-03-29'),
        createPredicate(createdProperty, ComparisonOperator.LessThan, '2026-03-30')
      ),
    ];
  }

  // 1 to 7 March: a custom range ends at the midnight after its last day.
  showCustomRange(): void {
    this.filters = [
      createPropertyFilter(
        LogicalOperator.And,
        createPredicate(createdProperty, ComparisonOperator.GreaterThanOrEqualTo, '2026-03-01'),
        createPredicate(createdProperty, ComparisonOperator.LessThan, '2026-03-08')
      ),
    ];
  }

  // Relative operators cannot be recovered from the criteria, so the filter carries an editorState.
  showLastWeek(): void {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    const filter = createPropertyFilter(
      LogicalOperator.And,
      createPredicate(createdProperty, ComparisonOperator.GreaterThanOrEqualTo, start.toISOString())
    );
    filter.editorState = { operator: ComparisonOperator.LastWeek };
    this.filters = [filter];
  }
}

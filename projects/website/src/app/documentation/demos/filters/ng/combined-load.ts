/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  AppfxDatagridFiltersModule,
  ComparisonOperator,
  FilterMode,
  LogicalOperator,
  PropertyFilter,
} from '@clr/addons/datagrid-filters';

import { createPredicate, createPropertyFilter, stateProperty, vmProperties } from './vm-properties';

@Component({
  selector: 'app-datagrid-filters-combined-load-demo',
  templateUrl: './combined-load.html',
  imports: [AppfxDatagridFiltersModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridFiltersCombinedLoadDemoComponent implements AfterViewInit {
  readonly FilterMode = FilterMode;
  readonly filterableProperties = vmProperties;
  readonly presetFilters: PropertyFilter[] = [
    createPropertyFilter(LogicalOperator.And, createPredicate(stateProperty, ComparisonOperator.Equals, 'Powered On')),
  ];

  /** One line per load, newest first. */
  readonly loads = signal<string[]>([]);

  private searchTerm = '';
  private filters: PropertyFilter[] = [];
  private loadPending = false;

  // The first load is scheduled here, not in ngOnInit: the filter bar emits the presets at start-up, and that emit
  // joins this load, so start-up loads once, with the presets.
  ngAfterViewInit(): void {
    this.scheduleLoad();
  }

  onSearchTermChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.scheduleLoad();
  }

  onPropertyFiltersChange(filters: PropertyFilter[]): void {
    this.filters = filters;
    this.scheduleLoad();
  }

  // Clear all emits propertyFiltersChange and then searchTermChange in the same turn, and the start-up emit comes right
  // after ngAfterViewInit. Loading at the end of the turn sends one request with the latest values.
  private scheduleLoad(): void {
    if (this.loadPending) {
      return;
    }
    this.loadPending = true;
    queueMicrotask(() => {
      this.loadPending = false;
      this.load();
    });
  }

  // Replace with a server request, e.g. this.api.search(this.searchTerm, this.filters).
  private load(): void {
    const search = this.searchTerm ? `"${this.searchTerm}"` : 'none';
    const line = `Load ${this.loads().length + 1}: search ${search}, ${this.filters.length} filter(s)`;
    this.loads.update(loads => [line, ...loads]);
  }
}

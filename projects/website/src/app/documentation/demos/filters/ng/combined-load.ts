/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AppfxDatagridFiltersModule, FilterMode, PropertyFilter } from '@clr/addons/datagrid-filters';

import { vmProperties } from './vm-properties';

@Component({
  selector: 'app-datagrid-filters-combined-load-demo',
  templateUrl: './combined-load.html',
  imports: [AppfxDatagridFiltersModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridFiltersCombinedLoadDemoComponent {
  readonly FilterMode = FilterMode;
  readonly filterableProperties = vmProperties;

  /** One line per load, newest first. */
  readonly loads = signal<string[]>([]);

  private searchTerm = '';
  private filters: PropertyFilter[] = [];
  private loadPending = false;

  onSearchTermChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.scheduleLoad();
  }

  onPropertyFiltersChange(filters: PropertyFilter[]): void {
    this.filters = filters;
    this.scheduleLoad();
  }

  // Clear all emits propertyFiltersChange and then searchTermChange in the same turn.
  // Loading at the end of the turn sends one request with both values.
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

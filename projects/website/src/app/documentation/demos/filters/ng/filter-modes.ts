/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppfxDatagridFiltersModule, FilterMode, PropertyFilter } from '@clr/addons/datagrid-filters';
import { ClrSelectModule } from '@clr/angular';

import { AppliedFiltersComponent } from './applied-filters';
import { vmProperties } from './vm-properties';

@Component({
  selector: 'app-datagrid-filters-modes-demo',
  templateUrl: './filter-modes.html',
  imports: [AppfxDatagridFiltersModule, AppliedFiltersComponent, ClrSelectModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridFiltersModesDemoComponent {
  readonly FilterMode = FilterMode;
  readonly filterableProperties = vmProperties;

  filterMode = FilterMode.Advanced;
  searchTerm = '';
  filters: PropertyFilter[] = [];
}

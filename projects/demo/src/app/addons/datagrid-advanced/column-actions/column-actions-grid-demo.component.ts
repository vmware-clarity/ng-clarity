/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppfxDatagridModule, ColumnDefinition, ColumnOrderChanged, ColumnPinnedState } from '@clr/addons/datagrid';
import { SelectionType } from '@clr/angular/data/datagrid';
import { ClrCheckboxModule } from '@clr/angular/forms';

import { Inventory, VmItem } from '../inventory/inventory';

@Component({
  imports: [AppfxDatagridModule, ClrCheckboxModule, FormsModule],
  standalone: true,
  templateUrl: 'column-actions-grid-demo.component.html',
  providers: [Inventory],
})
export class ColumnActionsGridDemoComponent {
  vms: VmItem[];
  selectedVms: VmItem[] = [];
  lastPinnedChange = '';
  lastOrderChange = '';
  SelectionType = SelectionType;

  // Drives enableColumnActions on the grid, so the menu can be turned on and off here. The input
  // itself defaults to false - this demo just starts with it on, since it is what the page is about.
  protected enableColumnActions = true;

  // enableColumnActions on the grid below turns the per-column menu on; it is off by default. Sort
  // and Filter join the menu automatically whenever the column itself is sortable/filterable, and
  // pinnable adds Pin Column.
  protected columns: ColumnDefinition<VmItem>[] = [
    {
      displayName: 'VM Name',
      field: 'name',
      pinnable: true,
      width: '220px',
    },
    {
      displayName: 'State',
      field: 'state',
      pinnable: true,
      width: '160px',
    },
    {
      displayName: 'Status',
      field: 'status',
      width: '160px',
    },
    {
      displayName: 'Used space',
      field: 'usedSpace',
      width: '200px',
    },
    {
      displayName: 'CPUs',
      field: 'cpus',
      width: '160px',
    },
    {
      displayName: 'Creation date',
      field: 'creation',
      width: '220px',
    },
  ];

  constructor(inventory: Inventory) {
    inventory.size = 25;
    inventory.reset();
    this.vms = inventory.allItems;
  }

  onSelectedItemsChange(selectedItems: VmItem[]): void {
    this.selectedVms = [...selectedItems];
  }

  onColumnPinnedChange(event: ColumnPinnedState): void {
    this.lastPinnedChange = `${event.column.displayName} was ${event.pinned ? 'pinned' : 'unpinned'}`;
  }

  onColumnOrderChange(event: ColumnOrderChanged): void {
    const columnOrder = event.columns.map(column => column.displayName).join(', ');
    this.lastOrderChange = `New order: ${columnOrder}`;
  }
}

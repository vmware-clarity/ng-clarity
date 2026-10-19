/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { AppfxDatagridModule, ColumnDefinition, ColumnPinnedState } from '@clr/addons/datagrid';
import { SelectionType } from '@clr/angular/data/datagrid';

import { Inventory, VmItem } from './inventory/inventory';

@Component({
  selector: 'app-pinnable-columns-advanced-grid-demo',
  imports: [AppfxDatagridModule],
  standalone: true,
  templateUrl: './pinnable-columns.html',
  providers: [Inventory],
})
export class PinnableColumnsGridDemoComponent {
  vms: VmItem[] = [];
  selectedVms: VmItem[] = [];
  lastPinnedChange = '';
  SelectionType = SelectionType;

  // The columns are wide on purpose, so the grid scrolls horizontally and the pinned ones have
  // something to stay in front of.
  columns: ColumnDefinition<VmItem>[] = [
    {
      displayName: 'VM Name',
      field: 'name',
      pinned: true,
      width: '200px',
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
      pinned: true,
      pinnable: true,
      width: '200px',
    },
    {
      displayName: 'Used space',
      field: 'usedSpace',
      width: '200px',
    },
    {
      displayName: 'CPUs',
      field: 'cpus',
      width: '200px',
    },
    {
      displayName: 'Creation date',
      field: 'creation',
      width: '200px',
    },
  ];

  constructor(inventory: Inventory) {
    inventory.size = 25;
    inventory.reset();
    this.vms = inventory.allItems;
  }

  get pinnedColumns(): string {
    return this.columns
      .filter(column => column.pinned)
      .map(column => column.displayName)
      .join(', ');
  }

  onSelectedItemsChange(selectedItems: VmItem[]): void {
    this.selectedVms = [...selectedItems];
  }

  // The grid writes the new state onto the column definition before emitting, so this only has to
  // report it. Use the event to persist the choice for the next visit.
  onColumnPinnedChange(event: ColumnPinnedState): void {
    this.lastPinnedChange = `${event.column.displayName} was ${event.pinned ? 'pinned' : 'unpinned'}`;
  }
}

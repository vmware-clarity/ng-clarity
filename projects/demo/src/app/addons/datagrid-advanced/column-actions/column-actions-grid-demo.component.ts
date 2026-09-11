/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActionClickEvent,
  ActionDefinition,
  AppfxDatagridModule,
  ColumnDefinition,
  ColumnOrderChanged,
  ColumnPinnedState,
} from '@clr/addons/datagrid';
import { SelectionType } from '@clr/angular/data/datagrid';
import { ClrCheckboxModule } from '@clr/angular/forms';
import { ClarityIcons, clockIcon, copyIcon, infoStandardIcon } from '@clr/angular/icon';

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
  lastActionClick = '';
  SelectionType = SelectionType;

  // Offered in every column's menu, after the built-in items. These are the actions that apply to
  // whichever column they are invoked from, which the event tells the handler.
  protected columnActions: ActionDefinition[] = [
    { id: 'copy-values', label: 'Copy column', enabled: true, icon: 'copy' },
    {
      id: 'column-details',
      label: 'Column details',
      enabled: false,
      tooltip: 'Nothing to show for this column yet',
      icon: 'info-standard',
    },
  ];

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
      // Only makes sense on a date, so it lives on the column rather than on the grid. Column
      // actions are appended after the grid-wide ones.
      actions: [{ id: 'relative-time', label: 'Show as relative time', enabled: true, icon: 'clock' }],
    },
  ];

  constructor(inventory: Inventory) {
    // An action names an icon shape, so the application has to register it, the same as it would for
    // a cds-icon of its own.
    ClarityIcons.addIcons(clockIcon, copyIcon, infoStandardIcon);

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

  // Column actions report through the grid's shared actionClick output, with the column definition as
  // the event context - that is what says which column the action was invoked from. This grid has no
  // action bar or row actions, so every event here is a column action; a grid that has them would
  // tell them apart by the context.
  onActionClick(event: ActionClickEvent<ColumnDefinition<VmItem>>): void {
    this.lastActionClick = `${event.action.label} on ${event.context.displayName}`;
  }
}

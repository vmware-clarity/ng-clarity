/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { AppfxDatagridModule, ColumnDefinition } from '@clr/addons/datagrid';
import { SelectionType } from '@clr/angular';

import { Inventory, VmItem } from './inventory/inventory';

@Component({
  selector: 'clr-advanced-datagrid-detail-pane-example',
  imports: [AppfxDatagridModule],
  templateUrl: './detail-pane.example.html',
  providers: [Inventory],
})
export class AdvancedDatagridDetailPaneExample {
  protected readonly selectionType = SelectionType.None;
  protected readonly columns: ColumnDefinition<VmItem>[] = [
    {
      displayName: 'VM Name',
      field: 'name',
    },
    {
      displayName: 'State',
      field: 'state',
    },
    {
      displayName: 'Status',
      field: 'status',
    },
    {
      displayName: 'Used space',
      field: 'usedSpace',
    },
  ];

  protected allItems: VmItem[];

  constructor(private inventory: Inventory) {
    inventory.reset();
    this.allItems = inventory.allItems;
  }
}

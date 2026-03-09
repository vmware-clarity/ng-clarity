/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { AppfxDatagridModule, appfxDatagridPersistSettingsToken, ColumnDefinition } from '@clr/addons/datagrid';
import { ClrAlertModule } from '@clr/angular';

import { Inventory, VmItem } from './inventory/inventory';
import { DatagridLocalStorageService } from './persistance-datagrid-local-storage.service';

@Component({
  selector: 'app-persistance-advanced-grid-demo',
  imports: [AppfxDatagridModule, ClrAlertModule],
  standalone: true,
  templateUrl: './persistance.html',
  providers: [
    Inventory,
    {
      provide: appfxDatagridPersistSettingsToken,
      useFactory: (service: DatagridLocalStorageService) => service,
      deps: [DatagridLocalStorageService],
    },
  ],
})
export class PersistenceGridDemoComponent {
  protected readonly allItems: VmItem[];
  protected readonly columns: ColumnDefinition<VmItem>[] = [
    {
      displayName: 'Virtual Machine ID',
      field: 'id',
      hidden: true,
    },
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
    {
      displayName: 'CPUs',
      field: 'cpus',
      width: '40px',
    },
    {
      displayName: 'Creation date',
      field: 'creation',
    },
  ];

  constructor(private inventory: Inventory) {
    inventory.reset();
    this.allItems = inventory.allItems;
  }
}

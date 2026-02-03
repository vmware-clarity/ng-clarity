/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AppfxDatagridModule,
  ClientSideExportConfig,
  ColumnDefinition,
  ExportProviderService,
  SelectionType,
} from '@clr/addons/datagrid';

import { GridConfigDemoOptions, GridConfigFormComponent } from '../grid-config/grid-config-form.component';
import { Inventory, VmItem } from '../inventory/inventory';

@Component({
  imports: [AppfxDatagridModule, CommonModule, GridConfigFormComponent],
  standalone: true,
  templateUrl: 'client-side-grid-demo.component.html',
  providers: [ExportProviderService, Inventory],
})
export class ClientSideDatagridDemoComponent {
  resetting = false;
  allVms: VmItem[];
  selectedVms: VmItem[] = [];
  filteredVms: VmItem[];

  protected options: GridConfigDemoOptions = {
    totalItems: 100,
    selectionType: SelectionType.Multi,
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100],
    enableExport: true,
    showFooter: true,
    showColumnToggle: true,
    enableRowSelection: true,
    compactDatagrid: true,
    disabled: false,
    loading: false,
  };

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

  protected exportConfig: ClientSideExportConfig;

  constructor(private inventory: Inventory) {
    this.reset();
    this.exportConfig = this.getExportProperties();
  }

  onSearchTermChange(searchTerm: string): void {
    if (!searchTerm || searchTerm === '') {
      this.filteredVms = this.allVms || [];
    }

    searchTerm = searchTerm.toLowerCase();

    this.filteredVms = this.allVms.filter(
      (item: VmItem) =>
        item.id.toString().indexOf(searchTerm) !== -1 ||
        item.color.toLowerCase().indexOf(searchTerm) !== -1 ||
        item.name.toLowerCase().indexOf(searchTerm) !== -1 ||
        item.creation.toString().toLowerCase().indexOf(searchTerm) !== -1 ||
        item.pokemon.toString().toLowerCase().indexOf(searchTerm) !== -1
    );
  }

  onSelectedItemsChange(selectedItems: VmItem[]) {
    this.selectedVms = [...selectedItems];
  }

  reset(): void {
    this.resetting = true;

    // Timeout to make sure we completely reset the datagrid.
    setTimeout(() => {
      this.inventory.size = this.options.totalItems;
      this.inventory.reset();
      this.allVms = this.inventory.allItems;
      this.filteredVms = this.allVms;
      this.selectedVms = [];
      this.resetting = false;
    });
  }

  refresh(): void {
    this.options.loading = true;
    setTimeout(() => {
      this.options.loading = false;
      this.filteredVms = [...this.inventory.allItems];
    }, 1000);
  }

  private getExportProperties(): ClientSideExportConfig {
    return {
      exportedFileName: 'exported-file',
      columnDefinitions: [...this.columns],
    };
  }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AppfxDatagridModule, ColumnDefinition, ExportProviderService, SelectionType } from '@clr/addons/datagrid';
import { ClrDatagridStateInterface } from '@clr/angular';

import { GridConfigDemoOptions, GridConfigFormComponent } from '../grid-config/grid-config-form.component';
import { FetchResult, Inventory, VmItem } from '../inventory/inventory';

@Component({
  imports: [AppfxDatagridModule, CommonModule, GridConfigFormComponent],
  standalone: true,
  templateUrl: 'server-driven-grid-demo.component.html',
  providers: [ExportProviderService, Inventory],
})
export class ServerDrivenGridDemoComponent {
  protected options: GridConfigDemoOptions = {
    totalItems: 50,
    selectionType: SelectionType.Multi,
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100],
    showFooter: true,
    showColumnToggle: true,
    enableExport: false,
    enableRowSelection: true,
    compactDatagrid: true,
    disabled: false,
    loading: true,
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

  protected resetting = true;
  protected vmItems: VmItem[];
  protected selectedVms: VmItem[] = [];

  constructor(private inventory: Inventory, private cdr: ChangeDetectorRef) {
    inventory.latency = 500;
    this.reset();
  }

  protected onRefreshGridData(state: ClrDatagridStateInterface): void {
    console.log('#refreshGridData emitted:', state);
    this.options.loading = true;
    this.cdr.detectChanges();
    this.inventory
      .filter()
      .fetch$(state.page.size * (state.page.current - 1), state.page.size)
      .subscribe((result: FetchResult) => {
        this.vmItems = result.vms;
        this.options.loading = false;
      });
  }

  protected onSelectedItemsChange(selectedItems: VmItem[]): void {
    console.log('#onSelectedItemsChange emitted:', selectedItems);
    this.selectedVms = [...selectedItems];
  }

  protected onExportDataEvent(exportStatus: any): void {
    console.log('#onExportDataEvent emitted:', exportStatus);
    window.alert('handle custom export event');
  }

  protected reset(): void {
    this.inventory.reset();
    this.inventory.size = this.options.totalItems;

    this.resetting = true;
    this.inventory
      .filter()
      .fetch$(0, this.options.pageSize)
      .subscribe((data: FetchResult) => {
        this.vmItems = data.vms;
        this.resetting = false;
      });
  }

  protected refresh(): void {
    this.options.loading = true;
    setTimeout(() => {
      this.options.loading = false;
      this.vmItems = [...this.vmItems];
    }, this.inventory.latency);
  }
}

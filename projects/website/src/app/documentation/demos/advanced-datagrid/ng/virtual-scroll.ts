/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component } from '@angular/core';
import { AppfxDatagridModule, ColumnDefinition, ExportProviderService, SelectionType } from '@clr/addons/datagrid';
import { ClrDatagridStateInterface } from '@clr/angular';

import { GridConfigDemoOptions, GridConfigFormComponent } from './grid-config/grid-config-form.component';
import { FetchResult, Inventory, VmItem } from './inventory/inventory';

@Component({
  selector: 'app-virtual-scroll-advanced-grid-demo',
  imports: [AppfxDatagridModule, GridConfigFormComponent],
  standalone: true,
  templateUrl: './virtual-scroll.html',
  providers: [ExportProviderService, Inventory],
})
export class VirtualScrollGridDemoComponent {
  protected options: GridConfigDemoOptions = {
    totalItems: 10000,
    selectionType: SelectionType.Multi,
    showFooter: true,
    showColumnToggle: true,
    enableExport: false,
    enableRowSelection: true,
    compactDatagrid: true,
    disabled: false,
    loading: true,
  };

  protected dataRange = {
    total: 0,
    skip: 0,
    data: [] as any,
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
  protected vmItems: VmItem[] = [];
  protected selectedVms: VmItem[] = [];

  constructor(
    private inventory: Inventory,
    private cdr: ChangeDetectorRef
  ) {
    inventory.latency = 500;
    inventory.size = this.options.totalItems;
    this.reset();
  }

  protected onRefreshGridData(state: ClrDatagridStateInterface): void {
    this.options.loading = true;
    this.cdr.detectChanges();
    const pageSize = state.page?.size || 20;
    const currentPage = state.page?.current || 1;
    this.inventory
      .filter()
      .fetch$(pageSize * (currentPage - 1), pageSize)
      .subscribe((result: FetchResult) => {
        this.vmItems = result.vms;
        this.dataRange = {
          total: this.options.totalItems,
          skip: currentPage * pageSize,
          data: this.vmItems,
        };
        this.cdr.detectChanges();
        this.options.loading = false;
      });
  }

  protected refreshVirtualGridData(state: ClrDatagridStateInterface) {
    const pageSize = state.page?.size || 20;
    const pageFrom = state.page?.from || 0;
    this.inventory
      .filter()
      .fetch$(pageFrom, pageSize)
      .subscribe((result: FetchResult) => {
        this.vmItems = result.vms;
        this.dataRange = {
          total: this.options.totalItems,
          skip: pageFrom,
          data: this.vmItems,
        };
        console.log(result);
        this.cdr.detectChanges();
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
    this.inventory.size = this.options.totalItems;
    this.inventory.reset();

    this.resetting = true;
    this.inventory
      .filter()
      .fetch$(0, this.options.pageSize)
      .subscribe((data: FetchResult) => {
        this.vmItems = data.vms;
        this.dataRange = {
          total: this.options.totalItems,
          skip: 0,
          data: this.vmItems,
        };
        this.cdr.detectChanges();
        this.resetting = false;
      });
  }

  protected refresh(): void {
    this.options.loading = true;
    setTimeout(() => {
      this.vmItems = [...this.vmItems];
      this.dataRange = {
        total: this.options.totalItems,
        skip: this.dataRange.skip,
        data: this.vmItems,
      };
      this.cdr.detectChanges();
      this.options.loading = false;
    }, this.inventory.latency);
  }
}

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
import { FetchResult, Inventory } from '../inventory/inventory';
import { VmItem } from '../inventory/inventory';

@Component({
  imports: [AppfxDatagridModule, CommonModule, GridConfigFormComponent],
  standalone: true,
  templateUrl: 'virtual-scroll-grid-demo.component.html',
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
  protected vmItems: VmItem[];
  protected selectedVms: VmItem[] = [];

  constructor(private inventory: Inventory, private cdr: ChangeDetectorRef) {
    inventory.latency = 500;
    inventory.size = this.options.totalItems;
    this.reset();
  }

  protected onRefreshGridData(state: ClrDatagridStateInterface): void {
    this.options.loading = true;
    this.cdr.detectChanges();
    this.inventory
      .filter()
      .fetch$(state.page.size * (state.page.current - 1), state.page.size)
      .subscribe((result: FetchResult) => {
        this.vmItems = result.vms;
        this.dataRange = {
          total: this.options.totalItems,
          skip: state.page.current * state.page.size,
          data: this.vmItems,
        };
        this.cdr.detectChanges();
        this.options.loading = false;
      });
  }

  protected refreshVirtualGridData(state: ClrDatagridStateInterface) {
    this.inventory
      .filter()
      .fetch$(state.page.from, state.page.size)
      .subscribe((result: FetchResult) => {
        this.vmItems = result.vms;
        this.dataRange = {
          total: this.options.totalItems,
          skip: state.page.from,
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

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppfxDatagridModule, ColumnDefinition } from '@clr/addons/datagrid';
import { ClrCheckboxModule, ClrInputModule, DatagridPropertyStringFilter } from '@clr/angular';

import { Inventory } from '../inventory/inventory';

@Component({
  imports: [AppfxDatagridModule, ClrCheckboxModule, ClrInputModule, CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: 'custom-column-definitions-demo.component.html',
  providers: [Inventory],
})
export class CustomColumnDefinitionsDemoComponent {
  allItems: unknown[];

  protected contentText = 'New column text';

  protected stringFilterEnabled = false;
  protected sortingEnabled = false;

  protected columnConfig: ColumnDefinition<unknown> = {
    displayName: 'Custom column',
    field: 'dynamicColumn',
    hideable: true,
    hidden: false,
    stringFilter: new DatagridPropertyStringFilter('dynamicColumn'),
    columnRenderer: undefined,
    width: '',
  };

  protected columns: ColumnDefinition<unknown>[] = [
    {
      displayName: 'VM Name',
      field: 'name',
      stringFilter: new DatagridPropertyStringFilter('name'),
    },
    {
      displayName: 'Status',
      field: 'status',
      stringFilter: new DatagridPropertyStringFilter('status'),
    },
  ];

  private columnIndex = 0;

  constructor(private cdr: ChangeDetectorRef, private inventory: Inventory) {
    inventory.reset();
    this.allItems = inventory.allItems;
  }

  addNewColumn(): void {
    const fieldName = `dynamic-column-${this.columnIndex++}`;
    this.columnConfig = {
      ...this.columnConfig,
      field: fieldName,
      stringFilter: this.stringFilterEnabled ? new DatagridPropertyStringFilter(fieldName) : undefined,
      sortComparator: this.sortingEnabled ? fieldName : undefined,
    };

    this.allItems = this.allItems.map((item: object, index: number) => {
      return {
        ...item,
        [this.columnConfig.field]: this.contentText + ' ' + index,
      };
    });
    this.cdr.detectChanges();

    this.columns = [...this.columns, this.columnConfig];
  }

  removeLastColumn(): void {
    this.columns = this.columns.slice(0, this.columns.length - 1);
    this.allItems = this.allItems.slice(0, this.allItems.length - 1);
  }
}

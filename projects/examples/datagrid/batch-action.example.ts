/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrDatagridModule, ClrDropdownModule } from '@clr/angular';

import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

@Component({
  selector: 'clr-datagrid-batch-action-example',
  templateUrl: './batch-action.example.html',
  styleUrl: './batch-action.example.scss',
  providers: [Inventory],
  imports: [DatePipe, ClrDatagridModule, ClrDropdownModule],
})
export class DatagridBatchActionExample {
  users: User[];
  selected: User[] = [];
  toAdd: User[] = [];
  toDelete: User[] = [];
  toEdit: User | undefined;
  toExport: User[] = [];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }

  cleanUp(): void {
    this.toAdd = [];
    this.toDelete = [];
    this.toEdit = undefined;
    this.toExport = [];
  }

  onAdd() {
    this.cleanUp();
    this.toAdd = this.selected.slice();
  }

  onEdit() {
    this.cleanUp();
    this.toEdit = this.selected[0];
  }

  onDelete() {
    this.cleanUp();
    this.toDelete = this.selected.slice();
  }

  onExportAll() {
    this.cleanUp();
    this.toExport = this.users.slice();
  }

  onExportSelected() {
    this.cleanUp();
    this.toExport = this.selected.slice();
  }
}

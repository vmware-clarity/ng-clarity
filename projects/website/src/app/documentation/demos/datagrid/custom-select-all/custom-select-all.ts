/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrAlertModule, ClrDatagridModule } from '@clr/angular';

import { EXAMPLES } from './examples';
import { CodeSnippetComponent } from '../../../../shared/code-snippet/code-snippet.component';
import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';
import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { CommonFiles } from '../utils/stackblitz-common-data';

@Component({
  selector: 'clr-datagrid-custom-select-all-demo',
  providers: [Inventory],
  templateUrl: 'custom-select-all.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [ClrDatagridModule, StackblitzExampleComponent, ClrAlertModule, CodeSnippetComponent, DatePipe],
})
export class DatagridCustomSelectAllDemo {
  commonFiles = CommonFiles;
  examples = EXAMPLES;

  handlerExample = `
  onCustomSelectAll(selectAll: boolean) {
    if (selectAll) {
      // Custom logic. Select all items from your full dataset
      this.selected = [...this.allItems];
    } else {
      this.selected = [];
    }
  }`;

  virtualScrollHandlerExample = `
    onCustomSelectAll(selectAll: boolean) {
      if (selectAll) {
        // In virtual scroll, only a subset of rows are rendered at a time.
        // Use custom select all to select from the full dataset,
        // not just the currently rendered rows.
        const newSelection = [...this.selected];
        this.allItems.forEach(item => {
          if (!this.selected.some(s => this.trackItemById(s) === this.trackItemById(item))) {
            newSelection.push(item);
          }
        });
        this.selected = newSelection;
      } else {
        this.selected = [];
      }
    }
    `;

  users: User[];
  selected: User[] = [];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }

  trackUserItemById(user: User) {
    return user.id;
  }

  onCustomSelectAll(selectAll: boolean) {
    console.log('onCustomSelectAll');
    if (selectAll) {
      this.selected = [...this.users];
    } else {
      this.selected = [];
    }
  }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrCheckboxModule, ClrDatagridModule } from '@clr/angular';

import { EXAMPLES } from './examples';
import { CodeSnippetComponent } from '../../../../shared/code-snippet/code-snippet.component';
import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';
import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { CommonFiles } from '../utils/stackblitz-common-data';

@Component({
  selector: 'clr-datagrid-select-all-disabled-demo',
  providers: [Inventory],
  templateUrl: 'select-all-disabled.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [
    ClrDatagridModule,
    FormsModule,
    StackblitzExampleComponent,
    CodeSnippetComponent,
    DatePipe,
    ClrCheckboxModule,
    ClrCheckboxModule,
  ],
})
export class DatagridSelectAllDisabledDemo {
  commonFiles = CommonFiles;
  examples = EXAMPLES;

  users: User[];
  selected: User[] = [];
  selectAllDisabled = false;

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}

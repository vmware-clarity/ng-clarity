/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrDatagridModule, ClrPopoverHostDirective, ClrStopEscapePropagationDirective } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';
import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { CommonFiles } from '../utils/stackblitz-common-data';

const EXAMPLE_HTML = `
<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>
  <clr-dg-column>Favorite color</clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users">
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
    <clr-dg-cell>
      <span class="color-square" [style.backgroundColor]="user.color"></span>
    </clr-dg-cell>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

@Component({
  selector: 'clr-datagrid-smart-iterator-demo',
  providers: [Inventory],
  templateUrl: './smart-iterator.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [
    ClrDatagridModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    StackblitzExampleComponent,
    DatePipe,
  ],
})
export class DatagridSmartIteratorDemo {
  exampleHtml = EXAMPLE_HTML;
  exampleTs = CommonFiles.exampleTs;
  exampleCss = CommonFiles.exampleCss;
  additionalFiles = CommonFiles.additionalFiles;

  users: User[];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}

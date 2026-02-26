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

const EXAMPLE = `
<div class="limit-height">
  <clr-datagrid>
    <clr-dg-column>
      <ng-container *clrDgHideableColumn="{ hidden: false }">User ID</ng-container>
    </clr-dg-column>
    <clr-dg-column>
      <ng-container *clrDgHideableColumn="{ hidden: false }">Name</ng-container>
    </clr-dg-column>
    <clr-dg-column><ng-container *clrDgHideableColumn>Creation date</ng-container></clr-dg-column>
    <clr-dg-column>
      <ng-container *clrDgHideableColumn="{ hidden: true }">Pokemon</ng-container>
    </clr-dg-column>
    <clr-dg-column><ng-container *clrDgHideableColumn>Favorite color</ng-container></clr-dg-column>

    <clr-dg-row *clrDgItems="let user of users" [clrDgItem]="user">
      <clr-dg-cell>{{ user.id }}</clr-dg-cell>
      <clr-dg-cell>{{ user.name }}</clr-dg-cell>
      <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
      <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
      <clr-dg-cell><span class="color-square" [style.backgroundColor]="user.color"></span></clr-dg-cell>
    </clr-dg-row>

    <clr-dg-footer>
      {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of
      {{ pagination.totalItems }} users
      <clr-dg-pagination #pagination [clrDgPageSize]="inventory.size"></clr-dg-pagination>
    </clr-dg-footer>
  </clr-datagrid>
</div>
`;

@Component({
  selector: 'clr-datagrid-hide-show-columns-demo',
  providers: [Inventory],
  templateUrl: './fixed-height.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [
    ClrDatagridModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    StackblitzExampleComponent,
    DatePipe,
  ],
})
export class DatagridFixedHeightDemo {
  example = EXAMPLE;
  commonFiles = {
    ...CommonFiles,
    exampleCss: CommonFiles.exampleCss.replace(
      '.color-square {',
      '.limit-height clr-datagrid {\n  height: 15rem;\n}\n\n.color-square {'
    ),
  };

  users: User[];
  usersLimited: User[];
  currentPageSize = 10;

  constructor(inventory: Inventory) {
    inventory.size = this.currentPageSize;
    inventory.reset();
    this.users = inventory.all;
    this.usersLimited = inventory.all.slice(0, 2);
  }
}

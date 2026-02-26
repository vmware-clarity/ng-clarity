/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  ClarityIcons,
  ClrAlertModule,
  ClrDatagridModule,
  ClrIcon,
  ClrIconModule,
  ClrPopoverHostDirective,
  ClrStopEscapePropagationDirective,
  exclamationTriangleIcon,
} from '@clr/angular';

import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';
import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { CommonFiles } from '../utils/stackblitz-common-data';

const EXAMPLE_HTML = `
<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>
  <clr-dg-column [clrDgField]="'creation'">Creation date</clr-dg-column>
  <clr-dg-column [clrDgField]="'pokemon.name'">Pokemon</clr-dg-column>
  <clr-dg-column [clrDgField]="'color'">Favorite color</clr-dg-column>
  <clr-dg-column [clrDgField]="'wins'" [clrDgColType]="'number'">Wins</clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users">
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
    <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
    <clr-dg-cell>
      <span class="color-square" [style.backgroundColor]="user.color"></span>
    </clr-dg-cell>
    <clr-dg-cell>{{ user.wins }}</clr-dg-cell>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

@Component({
  selector: 'clr-datagrid-binding-properties-demo',
  providers: [Inventory],
  templateUrl: './binding-properties.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [
    ClrDatagridModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    StackblitzExampleComponent,
    ClrIcon,
    ClrIconModule,
    ClrAlertModule,
    DatePipe,
  ],
})
export class DatagridBindingPropertiesDemo {
  exampleHtml = EXAMPLE_HTML;
  commonFiles = CommonFiles;

  users: User[];

  constructor(inventory: Inventory) {
    ClarityIcons.addIcons(exclamationTriangleIcon);

    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}

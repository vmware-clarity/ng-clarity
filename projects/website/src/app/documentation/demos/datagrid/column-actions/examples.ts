/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const basicExample = `
<clr-datagrid>
  <clr-dg-column [clrDgField]="'id'">
    User ID
    <clr-dg-column-actions></clr-dg-column-actions>
  </clr-dg-column>
  <clr-dg-column [clrDgField]="'name'">
    Name
    <clr-dg-column-actions></clr-dg-column-actions>
  </clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users" [clrDgItem]="user">
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const keepFilterInHeaderExample = `
<clr-datagrid>
  <clr-dg-column [clrDgField]="'name'">
    Name
    <clr-dg-column-actions [clrDgKeepFilterInHeader]="true"></clr-dg-column-actions>
  </clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users" [clrDgItem]="user">
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const customActionsExample = `
<p>
  Last action:
  <b>{{ lastAction || 'none yet' }}</b>
</p>

<clr-datagrid>
  <clr-dg-column [clrDgField]="'name'">
    Name
    <clr-dg-column-actions>
      <button type="button" clrDgColumnAction (click)="renameColumn()">
        <cds-icon shape="pencil" aria-hidden="true"></cds-icon>
        Rename column
      </button>
      <button type="button" clrDgColumnAction [clrDisabled]="true">
        <cds-icon shape="trash" aria-hidden="true"></cds-icon>
        Clear column
      </button>
    </clr-dg-column-actions>
  </clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users" [clrDgItem]="user">
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const customActionsComponentTS = `
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClarityIcons, ClrDatagridModule, pencilIcon, trashIcon } from '@clr/angular';

import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  providers: [Inventory],
  imports: [DatePipe, ClrDatagridModule],
})
export class ExampleComponent {
  users: User[];

  lastAction = '';

  constructor(inventory: Inventory) {
    // A projected action renders its own cds-icon, so the shape has to be registered.
    ClarityIcons.addIcons(pencilIcon, trashIcon);

    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }

  renameColumn(): void {
    this.lastAction = 'Rename column';
  }
}
`;

export const EXAMPLES = {
  basicExample,
  keepFilterInHeaderExample,
  customActionsExample,
  customActionsComponentTS,
};

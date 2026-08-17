/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const basicExample = `
<clr-datagrid>
  <clr-dg-column clrDgPinned [style.width.px]="140">User ID</clr-dg-column>
  <clr-dg-column clrDgPinned [style.width.px]="240">Name</clr-dg-column>
  <clr-dg-column [style.width.px]="280">Creation date</clr-dg-column>
  <clr-dg-column [style.width.px]="280">Favorite color</clr-dg-column>
  <clr-dg-column [style.width.px]="280">Pokemon</clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users" [clrDgItem]="user">
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
    <clr-dg-cell>
      <span class="color-square" [style.backgroundColor]="user.color"></span>
    </clr-dg-cell>
    <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const runtimeExample = `
<clr-checkbox-container clrInline>
  <label>Pinned columns</label>
  <clr-checkbox-wrapper>
    <input type="checkbox" clrCheckbox name="pin-id" [(ngModel)]="pinId" />
    <label>User ID</label>
  </clr-checkbox-wrapper>
  <clr-checkbox-wrapper>
    <input type="checkbox" clrCheckbox name="pin-name" [(ngModel)]="pinName" />
    <label>Name</label>
  </clr-checkbox-wrapper>
</clr-checkbox-container>

<clr-datagrid>
  <clr-dg-column [clrDgPinned]="pinId" [style.width.px]="140">User ID</clr-dg-column>
  <clr-dg-column [style.width.px]="280">Creation date</clr-dg-column>
  <clr-dg-column [clrDgPinned]="pinName" [style.width.px]="240">Name</clr-dg-column>
  <clr-dg-column [style.width.px]="280">Favorite color</clr-dg-column>
  <clr-dg-column [style.width.px]="280">Pokemon</clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users" [clrDgItem]="user">
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>
      <span class="color-square" [style.backgroundColor]="user.color"></span>
    </clr-dg-cell>
    <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const runtimeComponentTS = `
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrCheckboxModule, ClrDatagridModule } from '@clr/angular';
import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  providers: [Inventory],
  imports: [DatePipe, FormsModule, ClrCheckboxModule, ClrDatagridModule],
})
export class ExampleComponent {
  users: User[];

  pinId = true;
  pinName = true;

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}
`;

const pinnableExample = `
<p>
  Pinned from the header:
  <b>{{ pinnedColumns || 'none' }}</b>
</p>

<clr-datagrid>
  <clr-dg-column clrDgPinnable [(clrDgPinned)]="idPinned" [style.width.px]="140">User ID</clr-dg-column>
  <clr-dg-column clrDgPinnable [(clrDgPinned)]="namePinned" [style.width.px]="240">Name</clr-dg-column>
  <clr-dg-column [style.width.px]="280">Creation date</clr-dg-column>
  <clr-dg-column [style.width.px]="280">Favorite color</clr-dg-column>
  <clr-dg-column [style.width.px]="280">Pokemon</clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users" [clrDgItem]="user">
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
    <clr-dg-cell>
      <span class="color-square" [style.backgroundColor]="user.color"></span>
    </clr-dg-cell>
    <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const pinnableComponentTS = `
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrDatagridModule } from '@clr/angular';
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

  idPinned = false;
  namePinned = false;

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }

  // Kept up to date by clrDgPinnedChange, which the two-way binding above uses under the hood.
  get pinnedColumns(): string {
    return [this.idPinned ? 'User ID' : null, this.namePinned ? 'Name' : null]
      .filter(Boolean)
      .join(', ');
  }
}
`;

export const EXAMPLES = {
  basicExample,
  runtimeExample,
  runtimeComponentTS,
  pinnableExample,
  pinnableComponentTS,
};

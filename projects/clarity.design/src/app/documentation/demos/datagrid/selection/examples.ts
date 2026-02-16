/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const main = `
<div class="card card-block">
  <p class="card-text">
    Selected users:
    <em *ngIf="selected.length == 0">No user selected.</em>
    <span class="username" *ngFor="let user of selected; last as isLast">
      {{ user.name }}{{ isLast ? '.' : ',' }}
    </span>
  </p>
</div>

<clr-datagrid [(clrDgSelected)]="selected" [clrDgItemsTrackBy]="trackUserItemById">
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>
  <clr-dg-column>Favorite color</clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users" [clrDgItem]="user">
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

const singleRow = `
<clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item" [(clrDgSelected)]="item.selected">
  <!-- ... -->
</clr-dg-row>
`;
/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const rowSelection = `
<clr-datagrid
  [(clrDgSelected)]="selected"
  [clrDgRowSelection]="true"
  [clrDgItemsTrackBy]="trackUserItemById"
>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>
  <clr-dg-column>Favorite color</clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users" [clrDgItem]="user">
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

const selectionChangeEvent = `
<clr-datagrid [clrDgSelected]="selected" (clrDgSelectedChange)="selectionChanged($event)">
  <!-- ... -->
</clr-datagrid>
`;
const unselectableRow = `
<clr-dg-row [clrDgSelectable]="!user.locked" *clrDgItems="let user of users" [clrDgItem]="user">
  <clr-dg-cell>{{ user.id }}</clr-dg-cell>
  <!-- ... -->
</clr-dg-row>
`;

const componentTS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClrDatagridModule } from '@clr/angular';
import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  providers: [Inventory],
  imports: [CommonModule, ClrDatagridModule],
})
export class ExampleComponent {
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
}
`;

const fullHtml = `
<button class="btn btn-primary" (click)="lockRows()">Lock Rows</button>
<button class="btn btn-primary" (click)="unlockRows()">Unlock Rows</button>

<clr-datagrid
  [(clrDgSelected)]="selected"
  [clrDgItemsTrackBy]="trackUserItemById"
  (clrDgSelectedChange)="selectionChanged($event)"
>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>
  <clr-dg-column>Favorite color</clr-dg-column>

  <clr-dg-row
    *clrDgItems="let user of lockedUsers"
    [(clrDgSelected)]="user.selected"
    [clrDgSelectable]="!user.locked"
    [clrDgItem]="user"
  >
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
    <clr-dg-cell>
      <span class="color-square" [style.backgroundColor]="user.color"></span>
    </clr-dg-cell>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>

<div class="card card-block">
  <p class="card-text">
    Selected users:
    <em *ngIf="selected.length == 0">No user selected.</em>
    <span class="username" *ngFor="let user of selected; last as isLast">
      {{ user.name }}{{ isLast ? '.' : ',' }}
    </span>
  </p>
</div>

<div class="card card-block">
  <p class="card-text">
    Locked users:
    <em *ngIf="findLocked.length == 0">No user locked.</em>
    <span class="username" *ngFor="let user of findLocked; last as isLast">
      {{ user.name }}{{ isLast ? '.' : ',' }}
    </span>
  </p>
</div>
`;

const fullTS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClrDatagridModule } from '@clr/angular';
import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  providers: [Inventory],
  imports: [CommonModule, ClrDatagridModule],
})
export class ExampleComponent {
  users: User[];
  selected: User[] = [];
  lockedUsers: User[] = [];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;

    this.lockedUsers = [...inventory.all];
  }

  selectionChanged($event: User[]) {
    // emit change
    // $event is equal to this.selected array
  }

  unlockRows() {
    this.lockedUsers = this.lockedUsers.map(row => {
      row.locked = false;
      return row;
    });
  }

  lockRows() {
    this.lockedUsers = this.lockedUsers.map((user, index) => {
      // lock few rows
      if ([2, 3, 5, 9].includes(index)) {
        user.locked = true;
      }
      return user;
    });
  }

  get findLocked() {
    return this.lockedUsers.filter(user => {
      return user.locked;
    });
  }

  trackUserItemById(user: User) {
    return user.id;
  }
}
`;

export const EXAMPLES = {
  main,
  singleRow,
  rowSelection,
  selectionChangeEvent,
  unselectableRow,
  fullHtml,
  fullTS,
  componentTS,
};

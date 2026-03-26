/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const basicUsage = `
<clr-datagrid
  [(clrDgSelected)]="selected"
  [clrDgSelectionType]="'multi'"
  [clrDgCustomSelectAllEnabled]="true"
  (clrDgCustomSelectAll)="onCustomSelectAll($event)"
>
  <!-- columns and rows -->
</clr-datagrid>
`;

const main = `
<div class="card card-block">
  <p class="card-text">
    Selected users:
    @if (selected.length === 0) {
      <em>No user selected.</em>
    }
    @for (user of selected; track user.id; let isLast = $last) {
      <span class="username">{{ user.name }}{{ isLast ? '.' : ',' }}</span>
    }
  </p>
</div>

<clr-datagrid
  [(clrDgSelected)]="selected"
  [clrDgSelectionType]="'multi'"
  [clrDgItemsIdentityFn]="trackUserItemById"
  [clrDgCustomSelectAllEnabled]="true"
  (clrDgCustomSelectAll)="onCustomSelectAll($event)"
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

const componentTS = `
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
    if (selectAll) {
      this.selected = [...this.users];
    } else {
      this.selected = [];
    }
  }
}
`;

const virtualScrollExample = `
<clr-datagrid
  [(clrDgSelected)]="selected"
  [clrDgSelectionType]="'multi'"
  [clrDgItemsIdentityFn]="trackItemById"
  [clrDgCustomSelectAllEnabled]="true"
  (clrDgCustomSelectAll)="onCustomSelectAll($event)"
  style="height: 32rem"
>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>

  <ng-template
    clrVirtualScroll
    let-user
    [clrVirtualRowsOf]="users"
    [clrVirtualRowsTrackBy]="rowByIndex"
  >
    <clr-dg-row [clrDgItem]="user">
      <clr-dg-cell>{{ user.id }}</clr-dg-cell>
      <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    </clr-dg-row>
  </ng-template>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

export const EXAMPLES = {
  basicUsage,
  main,
  componentTS,
  virtualScrollExample,
};

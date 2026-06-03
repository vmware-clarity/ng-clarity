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
  [clrDgSelectAllDisabled]="true"
>
  <!-- columns and rows -->
</clr-datagrid>
`;

const main = `
<div class="card">
  <p class="card-block" cds-layout="m-t:none">
    <clr-checkbox-container cds-layout="m-t:none">
      <label>Select all</label>
      <clr-checkbox-wrapper>
        <input clrToggle type="checkbox" [(ngModel)]="selectAllDisabled" />
        <label>{{ selectAllDisabled ? 'Disabled' : 'Active' }}</label>
      </clr-checkbox-wrapper>
    </clr-checkbox-container>
  </p>
  <p class="card-block username-list" cds-layout="m-t:none">
    Selected users:
    @if (selected.length == 0) {
      <em>No user selected.</em>
    }
    @for (user of selected; track user) {
      <span class="username">{{ user.name }}</span>
    }
  </p>
</div>

<clr-datagrid
  [(clrDgSelected)]="selected"
  [clrDgSelectionType]="'multi'"
  [clrDgSelectAllDisabled]="selectAllDisabled"
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
import { FormsModule } from '@angular/forms';
import { ClrCheckboxModule, ClrDatagridModule } from '@clr/angular';
import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  providers: [Inventory],
  imports: [DatePipe, FormsModule, ClrDatagridModule],
})
export class ExampleComponent {
  users: User[];
  selected: User[] = [];
  selectAllDisabled = false;

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}
`;

export const EXAMPLES = {
  basicUsage,
  main,
  componentTS,
};

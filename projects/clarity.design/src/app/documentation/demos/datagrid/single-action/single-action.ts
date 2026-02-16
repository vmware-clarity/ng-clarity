/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { CommonFiles } from '../utils/stackblitz-common-data';

const MAIN_EXAMPLE = `
<div class="card card-block">
  <p class="card-text username-list">
    User to be edited:
    <em *ngIf="!toEdit">No user selected.</em>
    <span class="username" *ngIf="toEdit">{{ toEdit.name }}</span>
  </p>

  <p class="card-text username-list">
    User to be deleted:
    <em *ngIf="!toDelete">No user selected.</em>
    <span class="username" *ngIf="toDelete">{{ toDelete.name }}</span>
  </p>
</div>

<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>
  <clr-dg-column>Favorite color</clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users" [clrDgItem]="user">
    <clr-dg-action-overflow>
      <button class="action-item" (click)="onEdit(user)">Edit</button>
      <button class="action-item" (click)="onDelete(user)">Delete</button>
    </clr-dg-action-overflow>
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

const MAIN_EXAMPLE_TS = `
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
  toDelete: User | undefined;
  toEdit: User | undefined;

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }

  cleanUp(): void {
    this.toDelete = undefined;
    this.toEdit = undefined;
  }

  onEdit(user: User) {
    this.cleanUp();
    this.toEdit = user;
  }

  onDelete(user: User) {
    this.cleanUp();
    this.toDelete = user;
  }
}
`;

@Component({
  selector: 'clr-datagrid-single-action-demo',
  providers: [Inventory],
  templateUrl: 'single-action.html',
  styleUrl: '../datagrid.demo.scss',
  standalone: false,
})
export class DatagridSingleActionDemo {
  mainExample = MAIN_EXAMPLE;
  mainExampleTs = MAIN_EXAMPLE_TS;
  commonFiles = CommonFiles;

  users: User[];
  toDelete: User | undefined;
  toEdit: User | undefined;

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }

  cleanUp(): void {
    this.toDelete = undefined;
    this.toEdit = undefined;
  }

  onEdit(user: User) {
    this.cleanUp();
    this.toEdit = user;
  }

  onDelete(user: User) {
    this.cleanUp();
    this.toDelete = user;
  }
}

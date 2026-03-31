/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  ClrDatagridModule,
  ClrDropdownModule,
  ClrIcon,
  ClrIconModule,
  ClrIfOpen,
  ClrPopoverContent,
  ClrPopoverHostDirective,
  ClrStopEscapePropagationDirective,
} from '@clr/angular';

import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';
import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { CommonFiles } from '../utils/stackblitz-common-data';

const MAIN_EXAMPLE = `
<clr-datagrid [(clrDgSelected)]="selected">
  <clr-dg-action-bar>
    <div class="btn-group">
      <button type="button" class="btn btn-sm btn-secondary" (click)="onAdd()">Add to group</button>
      <button type="button" class="btn btn-sm btn-secondary" (click)="onDelete()">Delete</button>
      @if (selected.length === 1) {
        <button type="button" class="btn btn-sm btn-secondary" (click)="onEdit()">Edit</button>
      }
    </div>
    <div class="btn-group">
      <clr-dropdown>
        <button type="button" class="btn btn-sm btn-secondary" clrDropdownTrigger>
          Export
          <clr-icon shape="angle" direction="down"></clr-icon>
        </button>
        <clr-dropdown-menu clrPosition="bottom-left" *clrIfOpen>
          <button type="button" (click)="onExportAll()" clrDropdownItem>Export All</button>
          <button
            type="button"
            (click)="onExportSelected()"
            [disabled]="selected.length === 0"
            clrDropdownItem
          >
            Export Selected Items
          </button>
        </clr-dropdown-menu>
      </clr-dropdown>
    </div>
  </clr-dg-action-bar>

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

<div class="card card-block">
  <p class="card-text">
    Selected users:
    @if (selected.length === 0) {
      <em>No user selected.</em>
    }
    @for (user of selected; track user.id; let isLast = $last) {
      <span>{{ user.name }}{{ isLast ? '.' : ', ' }}</span>
    }
  </p>

  <p class="card-text">
    Users to be added to group:
    @if (toAdd.length === 0) {
      <em>No user selected.</em>
    }
    @for (user of toAdd; track user.id; let isLast = $last) {
      <span>{{ user.name }}{{ isLast ? '.' : ', ' }}</span>
    }
  </p>

  <p class="card-text">
    User to be edited:
    @if (!toEdit) {
      <em>No user selected.</em>
    } @else {
      <span class="username">{{ toEdit.name }}</span>
    }
  </p>

  <p class="card-text">
    Users to be deleted:
    @if (toDelete.length === 0) {
      <em>No user selected.</em>
    }
    @for (user of toDelete; track user.id; let isLast = $last) {
      <span class="username">{{ user.name }}{{ isLast ? '.' : ', ' }}</span>
    }
  </p>

  <p class="card-text">
    Users to be exported:
    @if (toExport.length === 0) {
      <em>No user selected.</em>
    }
    @for (user of toExport; track user.id; let isLast = $last) {
      <span class="username">{{ user.name }}{{ isLast ? '.' : ', ' }}</span>
    }
  </p>
</div>
`;

const MAIN_EXAMPLE_TS = `
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';
import { ClrDatagridModule, ClrDropdownModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  providers: [Inventory],
  imports: [DatePipe, ClrDatagridModule, ClrDropdownModule],
})
export class ExampleComponent {
  users: User[];
  selected: User[] = [];
  toAdd: User[] = [];
  toDelete: User[] = [];
  toEdit: User | undefined;
  toExport: User[] = [];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }

  cleanUp(): void {
    this.toAdd = [];
    this.toDelete = [];
    this.toEdit = undefined;
    this.toExport = [];
  }

  onAdd() {
    this.cleanUp();
    this.toAdd = this.selected.slice();
  }

  onEdit() {
    this.cleanUp();
    this.toEdit = this.selected[0];
  }

  onDelete() {
    this.cleanUp();
    this.toDelete = this.selected.slice();
  }

  onExportAll() {
    this.cleanUp();
    this.toExport = this.users.slice();
  }

  onExportSelected() {
    this.cleanUp();
    this.toExport = this.selected.slice();
  }
}
`;

@Component({
  selector: 'clr-datagrid-batch-action-demo',
  providers: [Inventory],
  templateUrl: 'batch-action.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [
    ClrDatagridModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrDropdownModule,
    ClrIcon,
    ClrIconModule,
    ClrIfOpen,
    ClrPopoverContent,
    StackblitzExampleComponent,
    DatePipe,
  ],
})
export class DatagridBatchActionDemo {
  mainExample = MAIN_EXAMPLE;
  mainExampleTs = MAIN_EXAMPLE_TS;
  commonFiles = CommonFiles;

  users: User[];
  selected: User[] = [];
  toAdd: User[] = [];
  toDelete: User[] = [];
  toEdit: User | undefined;
  toExport: User[] = [];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }

  cleanUp(): void {
    this.toAdd = [];
    this.toDelete = [];
    this.toEdit = undefined;
    this.toExport = [];
  }

  onAdd() {
    this.cleanUp();
    this.toAdd = this.selected.slice();
  }

  onEdit() {
    this.cleanUp();
    this.toEdit = this.selected[0];
  }

  onDelete() {
    this.cleanUp();
    this.toDelete = this.selected.slice();
  }

  onExportAll() {
    this.cleanUp();
    this.toExport = this.users.slice();
  }

  onExportSelected() {
    this.cleanUp();
    this.toExport = this.selected.slice();
  }
}

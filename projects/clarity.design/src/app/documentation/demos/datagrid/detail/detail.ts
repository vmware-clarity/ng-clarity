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
<clr-datagrid [(clrDgSelected)]="selected">
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>

  <clr-dg-row
    *clrDgItems="let user of users; let i = index"
    [clrDgItem]="user"
    [clrDgDetailOpenLabel]="'Open details for user ' + user.id"
    [clrDgDetailCloseLabel]="'Close details for user' + user.id"
    [clrDgDetailDisabled]="i === 1"
    [clrDgDetailHidden]="i === 2"
  >
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
  </clr-dg-row>

  <clr-dg-detail *clrIfDetail="let detail">
    <clr-dg-detail-header>{{ detail.name }}</clr-dg-detail-header>
    <clr-dg-detail-body>
      <b cds-text="medium">Additional Details</b>
      <table class="table">
        <tr>
          <th>Property</th>
          <th>Value</th>
        </tr>
        <tr>
          <td>ID</td>
          <td>{{ detail.id }}</td>
        </tr>
        <tr>
          <td>Wins</td>
          <td>{{ detail.wins }}</td>
        </tr>
        <tr>
          <td>Favorite Color</td>
          <td>
            {{ detail.color }}
            <span class="color-square" [style.backgroundColor]="detail.color"></span>
          </td>
        </tr>
        <tr>
          <td>Creation</td>
          <td>{{ detail.creation | date }}</td>
        </tr>
      </table>
    </clr-dg-detail-body>
  </clr-dg-detail>

  <clr-dg-footer>
    <clr-dg-pagination #pagination [clrDgPageSize]="10">
      <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100]">Users per page</clr-dg-page-size>
      {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of
      {{ pagination.totalItems }} users
    </clr-dg-pagination>
  </clr-dg-footer>
</clr-datagrid>

Selected users:
<span *ngFor="let user of selected">{{ user.name }}</span>
`;

const DETAIL_PANE_EXAMPLE = `
<clr-dg-detail *clrIfDetail="let detail">
  <clr-dg-detail-header>{{ detail.name }}</clr-dg-detail-header>
  <clr-dg-detail-body>
    <!-- ... -->
  </clr-dg-detail-body>
</clr-dg-detail>
`;

const CHANGE_EVENT_EXAMPLE = `
<div class="card card-block">
  <p class="card-text">
    Opened Pane:
    <em *ngIf="!state">No user selected.</em>
    <span *ngIf="state">{{ state.id }}</span>
  </p>
</div>

<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>

  <clr-dg-row
    *clrDgItems="let user of users"
    [clrDgItem]="user"
    [clrDgDetailOpenLabel]="'Open details for user ' + user.id"
    [clrDgDetailCloseLabel]="'Close details for user' + user.id"
  >
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
  </clr-dg-row>

  <ng-template [clrIfDetail]="state" let-detail (clrIfDetailChange)="state = $event">
    <clr-dg-detail>
      <clr-dg-detail-header>{{ detail.name }}</clr-dg-detail-header>
      <clr-dg-detail-body>
        <b cds-text="medium">Additional Details</b>
        <table class="table">
          <tr>
            <th>Property</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>ID</td>
            <td>{{ detail.id }}</td>
          </tr>
          <tr>
            <td>Wins</td>
            <td>{{ detail.wins }}</td>
          </tr>
          <tr>
            <td>Favorite Color</td>
            <td>
              {{ detail.color }}
              <span class="color-square" [style.backgroundColor]="detail.color"></span>
            </td>
          </tr>
          <tr>
            <td>Creation</td>
            <td>{{ detail.creation | date }}</td>
          </tr>
        </table>
      </clr-dg-detail-body>
    </clr-dg-detail>
  </ng-template>

  <clr-dg-footer>
    <clr-dg-pagination #pagination [clrDgPageSize]="10">
      <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100]">Users per page</clr-dg-page-size>
      {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of
      {{ pagination.totalItems }} users
    </clr-dg-pagination>
  </clr-dg-footer>
</clr-datagrid>
`;

const TWO_WAY_BINDING_EXAMPLE = `
<div class="card card-block">
  <p class="card-text">
    Opened Pane:
    <em *ngIf="!state">No user selected.</em>
    <span *ngIf="state">{{ state.id }}</span>
  </p>
</div>

<button class="btn btn-primary" (click)="state = users[4]">Open Row 5 Pane</button>

<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>

  <clr-dg-row
    *clrDgItems="let user of users"
    [clrDgItem]="user"
    [clrDgDetailOpenLabel]="'Open details for user ' + user.id"
    [clrDgDetailCloseLabel]="'Close details for user' + user.id"
  >
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
  </clr-dg-row>

  <ng-template [(clrIfDetail)]="state" let-detail>
    <clr-dg-detail>
      <clr-dg-detail-header>{{ detail.name }}</clr-dg-detail-header>
      <clr-dg-detail-body>
        <b cds-text="medium">Additional Details</b>
        <table class="table">
          <tr>
            <th>Property</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>ID</td>
            <td>{{ detail.id }}</td>
          </tr>
          <tr>
            <td>Wins</td>
            <td>{{ detail.wins }}</td>
          </tr>
          <tr>
            <td>Favorite Color</td>
            <td>
              {{ detail.color }}
              <span class="color-square" [style.backgroundColor]="detail.color"></span>
            </td>
          </tr>
          <tr>
            <td>Creation</td>
            <td>{{ detail.creation | date }}</td>
          </tr>
        </table>
      </clr-dg-detail-body>
    </clr-dg-detail>
  </ng-template>

  <clr-dg-footer>
    <clr-dg-pagination #pagination [clrDgPageSize]="10">
      <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100]">Users per page</clr-dg-page-size>
      {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of
      {{ pagination.totalItems }} users
    </clr-dg-pagination>
  </clr-dg-footer>
</clr-datagrid>
`;

@Component({
  providers: [Inventory],
  templateUrl: 'detail.html',
  styleUrl: '../datagrid.demo.scss',
  standalone: false,
})
export class DatagridDetailPaneDemo {
  mainExample = MAIN_EXAMPLE;
  detailPaneExample = DETAIL_PANE_EXAMPLE;
  changeEventExample = CHANGE_EVENT_EXAMPLE;
  twoWayBindingExample = TWO_WAY_BINDING_EXAMPLE;
  commonFiles = {
    ...CommonFiles,
    exampleTs: CommonFiles.exampleTs
      .replace(`users: User[];`, `users: User[]; selected: User[] = []; state: User | undefined;`)
      .replace(`inventory.size = 10;`, `inventory.size = 103;`),
  };

  users: User[];
  selected: User[] = [];
  state: User | undefined;

  constructor(inventory: Inventory) {
    inventory.size = 103;
    inventory.reset();
    this.users = inventory.all;
  }
}

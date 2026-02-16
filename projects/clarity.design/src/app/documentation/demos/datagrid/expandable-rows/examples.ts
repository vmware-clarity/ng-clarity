/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const basic = `
<clr-dg-row *ngFor="let user of users">
  <!-- Cells declarations -->
  <clr-dg-cell>...</clr-dg-cell>

  <clr-dg-row-detail *clrIfExpanded>Lorem ipsum...</clr-dg-row-detail>
</clr-dg-row>
`;

const replace = `<clr-dg-row-detail *clrIfExpanded [clrDgReplace]="true">Lorem ipsum...</clr-dg-row-detail>`;

const lazyLoadingRow = `
<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>
  <clr-dg-column [clrDgField]="'creation'">Creation date</clr-dg-column>
  <clr-dg-column [clrDgField]="'pokemon.name'">Pokemon</clr-dg-column>
  <clr-dg-column [clrDgField]="'color'">Favorite color</clr-dg-column>

  <clr-dg-row *ngFor="let user of users">
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
    <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
    <clr-dg-cell>
      <span class="color-square" [style.backgroundColor]="user.color"></span>
    </clr-dg-cell>

    <expandable-row *clrIfExpanded [user]="user" ngProjectAs="clr-dg-row-detail"></expandable-row>
  </clr-dg-row>
  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const lazyLoadingTs = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClrDatagridModule, ClrConditionalModule } from '@clr/angular';
import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';
import { ExpandableRowComponent } from './expandableRowComponent';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  providers: [Inventory],
  imports: [CommonModule, ClrConditionalModule, ClrDatagridModule, ExpandableRowComponent],
})
export class ExampleComponent {
  users: User[];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}
`;

const lazyLoadingDetailComponent = `
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ClrLoading } from '@clr/angular';
import { User } from './inventory/user';

@Component({
  selector: 'expandable-row',
  template: \`<div cds-layout="m:sm" clrLoading>{{user|json}}</div>\`,
  
  providers: [ClrLoading],
  imports: [CommonModule],
})
export class ExpandableRowComponent implements OnInit {
  @Input() user: User | undefined;

  constructor(private loading: ClrLoading) {}

  ngOnInit() {
    this.loading.loadingState = true;
    setTimeout(() => {
      this.loading.loadingState = false;
    }, 1000);
  }
}
`;

const conditionalExpandableRow = `
<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>
  <clr-dg-column [clrDgField]="'creation'">Creation date</clr-dg-column>
  <clr-dg-column [clrDgField]="'pokemon.name'">Pokemon</clr-dg-column>
  <clr-dg-column [clrDgField]="'color'">Favorite color</clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users; let i = index">
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
    <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
    <clr-dg-cell>
      <span class="color-square" [style.backgroundColor]="user.color"></span>
    </clr-dg-cell>

    <ng-container *ngIf="i % 2 === 0" ngProjectAs="clr-dg-row-detail">
      <clr-dg-row-detail *clrIfExpanded>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis
        id sed quam. Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet
        suscipit eget, pellentesque sed arcu. Vivamus in dui lectus. Suspendisse cursus est ac nisl
        imperdiet viverra. Aenean sagittis nibh lacus, in eleifend urna ultrices et. Mauris porttitor
        nisi nec velit pharetra porttitor.
      </clr-dg-row-detail>
    </ng-container>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const fullHtml = `
<form clrForm>
  <clr-radio-container>
    <label>Type of detail</label>
    <clr-radio-wrapper>
      <input type="radio" clrRadio name="detail" required value="default" [(ngModel)]="detail" />
      <label>Overall</label>
    </clr-radio-wrapper>
    <clr-radio-wrapper>
      <input type="radio" clrRadio name="detail" required value="columns" [(ngModel)]="detail" />
      <label>Per Column</label>
    </clr-radio-wrapper>
  </clr-radio-container>

  <clr-checkbox-wrapper>
    <input type="checkbox" clrCheckbox name="replace" [(ngModel)]="replace" />
    <label>Replace row</label>
  </clr-checkbox-wrapper>
</form>

<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>
  <clr-dg-column [clrDgField]="'creation'">
    Creation date
    <clr-dg-string-filter [clrDgStringFilter]="dateFilter"></clr-dg-string-filter>
  </clr-dg-column>
  <clr-dg-column [clrDgField]="'pokemon.name'">Pokemon</clr-dg-column>
  <clr-dg-column [clrDgField]="'color'">Favorite color</clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users" [clrDgItem]="user">
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
    <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
    <clr-dg-cell>
      <span class="color-square" [style.backgroundColor]="user.color"></span>
    </clr-dg-cell>

    <clr-dg-row-detail *clrIfExpanded [clrDgReplace]="replace">
      <ng-container *ngIf="detail === 'default'">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis
        id sed quam. Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet
        suscipit eget, pellentesque sed arcu. Vivamus in dui lectus. Suspendisse cursus est ac nisl
        imperdiet viverra. Aenean sagittis nibh lacus, in eleifend urna ultrices et. Mauris porttitor
        nisi nec velit pharetra porttitor.
      </ng-container>

      <ng-container *ngIf="detail === 'columns'">
        <clr-dg-cell>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</clr-dg-cell>
        <clr-dg-cell>Proin in neque in ante placerat mattis id sed quam.</clr-dg-cell>
        <clr-dg-cell>Proin rhoncus lacus et tempor dignissim.</clr-dg-cell>
        <clr-dg-cell>
          Vivamus sem quam, pellentesque aliquet suscipit eget, pellentesque sed arcu.
        </clr-dg-cell>
        <clr-dg-cell>
          Vivamus in dui lectus. Suspendisse cursus est ac nisl imperdiet viverra.
        </clr-dg-cell>
      </ng-container>
    </clr-dg-row-detail>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const fullTs = `
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import {
  ClrCheckboxModule,
  ClrConditionalModule,
  ClrDatagridModule,
  ClrDatagridStringFilterInterface,
  ClrRadioModule,
} from '@clr/angular';
import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

class DateFilter implements ClrDatagridStringFilterInterface<User> {
  accepts(user: User, search: string): boolean {
    const date = (user.creation as Date).toDateString();
    return date === search || date.toLowerCase().indexOf(search) >= 0;
  }
}

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  providers: [Inventory],
  imports: [
    CommonModule,
    ClrConditionalModule,
    ClrCheckboxModule,
    ClrDatagridModule,
    ClrRadioModule,
    FormsModule,
  ],
})
export class ExampleComponent {
  users: User[];

  detail = 'default';
  replace = false;

  dateFilter = new DateFilter();

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}
`;

export const EXAMPLES = {
  basic,
  replace,
  lazyLoadingRow,
  lazyLoadingTs,
  lazyLoadingDetailComponent,
  conditionalExpandableRow,
  fullHtml,
  fullTs,
};

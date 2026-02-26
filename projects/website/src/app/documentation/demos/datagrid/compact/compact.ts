/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrCheckboxModule,
  ClrCommonFormsModule,
  ClrDatagridModule,
  ClrIcon,
  ClrIconModule,
  ClrIfExpanded,
  ClrPopoverContent,
  ClrPopoverHostDirective,
  ClrRadioModule,
  ClrStopEscapePropagationDirective,
  ClrTooltipModule,
} from '@clr/angular';

import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';
import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { CommonFiles } from '../utils/stackblitz-common-data';

const COMPACT_EXAMPLE = `
<clr-datagrid class="datagrid-compact">
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column>Pokemon</clr-dg-column>
  <clr-dg-row *ngFor="let user of users; let i = index">
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>
      <clr-icon shape="user"></clr-icon>
      {{ user.name }}
    </clr-dg-cell>
    <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const ELLIPSIS_EXAMPLE = `
<clr-datagrid class="datagrid-overflow-ellipsis">
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column [style.width.px]="300">Long Text Static Width 300px</clr-dg-column>
  <clr-dg-column>Pokemon</clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>
  <clr-dg-row *ngFor="let user of users; let i = index">
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>
      <clr-icon shape="user"></clr-icon>
      {{ user.name }}
    </clr-dg-cell>
    <clr-dg-cell>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque ins id sed quam.
    </clr-dg-cell>
    <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const FULL_EXAMPLE_HTML = `
<form clrForm>
  <clr-radio-container>
    <label>Overflow examples</label>
    <clr-radio-wrapper>
      <input type="radio" clrRadio name="detail" value="tooltip" [(ngModel)]="detail" />
      <label>Tooltip</label>
    </clr-radio-wrapper>
    <clr-radio-wrapper>
      <input type="radio" clrRadio name="detail" value="rowDetails" [(ngModel)]="detail" />
      <label>Row details</label>
    </clr-radio-wrapper>
    <clr-radio-wrapper>
      <input type="radio" clrRadio name="detail" value="title" [(ngModel)]="detail" />
      <label>Title (is A11Y contrast limited)</label>
    </clr-radio-wrapper>
  </clr-radio-container>
  <clr-toggle-container>
    <label>Compact</label>
    <clr-toggle-wrapper>
      <input type="checkbox" clrToggle name="compact" [(ngModel)]="compact" />
      <label>{{ compact ? 'ON' : 'OFF' }}</label>
    </clr-toggle-wrapper>
  </clr-toggle-container>
</form>

<clr-datagrid [class.datagrid-compact]="compact" class="datagrid-overflow-ellipsis">
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column [style.width.px]="300">Long Text Static Width 300px</clr-dg-column>
  <clr-dg-column>Pokemon</clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>
  <clr-dg-row *ngFor="let user of users; let i = index">
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>
      <clr-icon shape="user"></clr-icon>
      {{ user.name }}
    </clr-dg-cell>
    <clr-dg-cell [attr.title]="detail === 'title' ? longString : null">
      <clr-tooltip *ngIf="detail === 'tooltip'">
        <clr-icon clrTooltipTrigger shape="info-circle" solid></clr-icon>
        <clr-tooltip-content clrPosition="bottom-right" clrSize="lg">
          {{ longString }}
        </clr-tooltip-content>
      </clr-tooltip>
      {{ longString }}
    </clr-dg-cell>
    <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>

    <ng-container ngProjectAs="clr-dg-row-detail" *ngIf="detail === 'rowDetails'">
      <clr-dg-row-detail *clrIfExpanded [clrDgReplace]="true">
        <clr-dg-cell>{{ user.id }}</clr-dg-cell>
        <clr-dg-cell>
          <clr-icon shape="user"></clr-icon>
          {{ user.name }}
        </clr-dg-cell>
        <clr-dg-cell>{{ longString }}</clr-dg-cell>
        <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
        <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
      </clr-dg-row-detail>
    </ng-container>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;
const FULL_EXAMPLE_TS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrCheckboxModule,
  ClrDatagridModule,
  ClrIcon,
  ClrRadioModule,
  ClrTooltipModule,
} from '@clr/angular';
import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  providers: [Inventory],
  imports: [
    CommonModule,
    FormsModule,
    ClrCheckboxModule,
    ClrDatagridModule,
    ClrIcon,
    ClrRadioModule,
    ClrTooltipModule,
  ],
})
export class ExampleComponent {
  users: User[];
  compact = true;
  detail = 'tooltip';
  longString =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque pellentesque eget id sed quam.';

  constructor(public inventory: Inventory) {
    this.inventory.size = 10;
    this.inventory.reset();
    this.users = this.inventory.all;
  }
}
`;

@Component({
  selector: 'clr-datagrid-compact-demo',
  templateUrl: './compact.html',
  providers: [Inventory],
  styleUrl: '../datagrid.demo.scss',
  imports: [
    ClrDatagridModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrIcon,
    ClrIconModule,
    StackblitzExampleComponent,
    FormsModule,
    ClrCommonFormsModule,
    ClrRadioModule,
    ClrCheckboxModule,
    ClrTooltipModule,
    ClrPopoverContent,
    ClrIfExpanded,
    DatePipe,
  ],
})
export class DatagridCompactDemo {
  compactExample = COMPACT_EXAMPLE;
  ellipsisExample = ELLIPSIS_EXAMPLE;
  fullExampleHtml = FULL_EXAMPLE_HTML;
  fullExampleTs = FULL_EXAMPLE_TS;
  commonFiles = CommonFiles;

  users: User[];
  compact = true;
  detail = 'tooltip';
  longString = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque pellentesque eget id sed quam.';

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}

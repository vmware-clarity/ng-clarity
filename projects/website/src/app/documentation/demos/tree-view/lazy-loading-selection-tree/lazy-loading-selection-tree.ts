/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrDatagridModule, ClrIfExpanded, ClrTreeViewModule } from '@clr/angular';
import { Observable } from 'rxjs';

import { GroceryItemsComponent } from './grocery-items.component';
import { GROCERY_SERVICE, Group } from './grocery-models';
import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE_HTML = `
<clr-tree [clrLazy]="true">
  <clr-tree-node *ngFor="let group of groceries$ | async" [(clrSelected)]="group.selected">
    {{ group.name }}
    <ng-template clrIfExpanded>
      <my-grocery-items [group]="group"></my-grocery-items>
    </ng-template>
  </clr-tree-node>
</clr-tree>
`;

const EXAMPLE_TS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { GroceryItemsComponent } from './grocery-items.component';
import { GROCERY_SERVICE, Group } from './grocery-models';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',

  imports: [
    CommonModule,
    ClrConditionalModule,
    ClrLoadingModule,
    ClrTreeViewModule,
    GroceryItemsComponent,
  ],
})
export class ExampleComponent {
  groceries$: Observable<Group[]> | undefined;

  constructor() {
    this.groceries$ = GROCERY_SERVICE.getGroups();
  }
}
`;

const additionalFiles = {
  'grocery-models.ts': '',
  'grocery-items.component.ts': '',
};

@Component({
  selector: 'clr-lazy-loading-selection-tree-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: './lazy-loading-selection-tree.html',
  imports: [
    ClrTreeViewModule,
    ClrDatagridModule,
    ClrIfExpanded,
    GroceryItemsComponent,
    StackblitzExampleComponent,
    AsyncPipe,
  ],
})
export class LazyLoadingSelectionTreeDemo {
  exampleHtml = EXAMPLE_HTML;
  exampleTs = EXAMPLE_TS;
  additionalFiles = additionalFiles;

  groceries$: Observable<Group[]>;

  constructor() {
    this.groceries$ = GROCERY_SERVICE.getGroups();
  }
}

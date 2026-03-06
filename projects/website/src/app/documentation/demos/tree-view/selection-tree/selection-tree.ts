/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrSelectedState, ClrTreeViewModule } from '@clr/angular';

import { groceries } from './groceries';
import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE_HTML = `
<clr-tree>
  @for (group of groceries; track group.name) {
    <clr-tree-node [(clrSelected)]="group.selected" [clrExpanded]="true">
      {{ group.name }}
      @for (item of group.items; track item.name) {
        <clr-tree-node [(clrSelected)]="item.selected">
          {{ item.name }}
        </clr-tree-node>
      }
    </clr-tree-node>
  }
</clr-tree>

<button class="btn btn-sm" type="button" (click)="selectVegetables()">Select all vegetables</button>
`;

const EXAMPLE_TS = `
import { Component } from '@angular/core';
import { groceries } from './groceries';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ClrTreeViewModule],
})
export class ExampleComponent {
  groceries = groceries;

  selectVegetables() {
    this.groceries[1].selected = ClrSelectedState.SELECTED;
  }
}
`;

const additionalFiles = {
  'groceries.ts': require('!raw-loader!./groceries.ts').default,
};

@Component({
  selector: 'clr-selection-tree-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: 'selection-tree.html',
  imports: [ClrTreeViewModule, StackblitzExampleComponent],
})
export class SelectionTreeDemo {
  exampleHtml = EXAMPLE_HTML;
  exampleTs = EXAMPLE_TS;
  additionalFiles = additionalFiles;

  groceries = groceries;

  get displayGroceries() {
    const replacer = (key: string, value: any) => {
      if (key === 'selected') {
        return ClrSelectedState[value];
      }
      return value;
    };

    return JSON.stringify(this.groceries, replacer, 2);
  }

  selectVegetables() {
    this.groceries[1].selected = ClrSelectedState.SELECTED;
  }
}

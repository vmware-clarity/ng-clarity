/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrSelectedState, ClrTreeViewModule } from '@clr/angular';

import { groceries } from './data/groceries';

@Component({
  selector: 'clr-tree-view-selection-example',
  templateUrl: './selection.example.html',
  styleUrl: './selection.example.scss',
  imports: [ClrTreeViewModule],
})
export class TreeViewSelectionExample {
  groceries = groceries;

  get displayGroceries() {
    const replacer = (key: string, value: unknown) =>
      key === 'selected' ? ClrSelectedState[value as ClrSelectedState] : value;

    return JSON.stringify(this.groceries, replacer, 2);
  }

  selectVegetables() {
    this.groceries[1].selected = ClrSelectedState.SELECTED;
  }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrConditionalModule, ClrTreeViewModule } from '@clr/angular';
import { Observable } from 'rxjs';

import { GroceryItemsComponent } from './grocery-items/grocery-items.component';
import { GROCERY_SERVICE, Group } from './grocery-items/grocery-models';

@Component({
  selector: 'clr-tree-view-lazy-selection-example',
  templateUrl: './lazy-selection.example.html',
  imports: [AsyncPipe, ClrConditionalModule, ClrTreeViewModule, GroceryItemsComponent],
})
export class TreeViewLazySelectionExample {
  groceries$: Observable<Group[]> = GROCERY_SERVICE.getGroups();
}

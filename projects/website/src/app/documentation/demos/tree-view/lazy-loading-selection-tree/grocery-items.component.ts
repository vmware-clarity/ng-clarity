/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Group, Item, ITEMS_SERVICE } from './grocery-models';

@Component({
  selector: 'my-grocery-items',
  imports: [CommonModule, ClarityModule],
  template: `
    <ng-container [clrLoading]="loading">
      @for (item of items$ | async; track item) {
        <clr-tree-node [(clrSelected)]="item.selected">
          {{ item.name }}
        </clr-tree-node>
      }
    </ng-container>
  `,
})
export class GroceryItemsComponent implements OnInit {
  readonly group = input<Group | undefined>(undefined);
  items$: Observable<Item[]> | undefined;
  loading = false;

  itemsService = ITEMS_SERVICE;

  ngOnInit() {
    this.loading = true;
    this.items$ = this.itemsService.getItems(this.group()).pipe(tap(() => (this.loading = false)));
  }
}

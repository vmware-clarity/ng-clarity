/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { Items } from './providers/items';

@Component({
  selector: 'clr-dg-placeholder',
  template: `
    <div class="datagrid-placeholder" [class.datagrid-empty]="emptyDatagrid">
      <div class="datagrid-placeholder-image" *ngIf="emptyDatagrid"></div>
      <span class="datagrid-placeholder-content"><ng-content *ngIf="emptyDatagrid"></ng-content></span>
    </div>
  `,
  host: { '[class.datagrid-placeholder-container]': 'true' },
  standalone: false,
})
export class ClrDatagridPlaceholder<T = any> {
  constructor(private items: Items<T>) {}

  /**
   * Tests if the datagrid is empty, meaning it doesn't contain any items
   */
  get emptyDatagrid() {
    return !this.items.loading && (!this.items.displayed || this.items.displayed.length === 0);
  }
}

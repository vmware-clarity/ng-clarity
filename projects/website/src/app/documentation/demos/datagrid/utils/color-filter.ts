/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrDatagridFilterInterface } from '@clr/angular';
import { Observable, Subject } from 'rxjs';

import INVENTORY_ITEMS from '../inventory/inventory-items.json';
import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagrid-color-filter',
  template: ` @for (color of allColors; track color) {
    <span
      class="color-square color-selectable"
      (click)="toggleColor(color)"
      [style.backgroundColor]="color"
      [class.color-selected]="selectedColors[color]"
    ></span>
  }`,
  imports: [],
  styles: [
    `
      .color-square {
        display: inline-block;
        vertical-align: text-bottom;
        height: var(--cds-global-space-7);
        width: var(--cds-global-space-7);
        border: var(--cds-alias-object-border-width-100) solid var(--cds-global-color-construction-1000);
        border-radius: var(--cds-global-space-3);
      }

      .color-filter {
        display: block;
        width: var(--cds-global-space-15);
      }

      .color-selectable {
        cursor: pointer;
        margin: var(--cds-global-space-2);
        opacity: 0.2;

        &:hover,
        &.color-selected {
          opacity: 1;
        }
      }
    `,
  ],
  host: {
    '[class.color-filter]': 'true',
  },
})
export class ColorFilter implements ClrDatagridFilterInterface<User> {
  allColors = INVENTORY_ITEMS.map((item: User) => item.color)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort();
  selectedColors: { [color: string]: boolean } = {};
  nbColors = 0;

  private _changes = new Subject<any>();
  // We do not want to expose the Subject itself, but the Observable which is read-only
  get changes(): Observable<any> {
    return this._changes.asObservable();
  }

  listSelected(): string[] {
    const list: string[] = [];
    for (const color in this.selectedColors) {
      if (this.selectedColors[color]) {
        list.push(color);
      }
    }
    return list;
  }

  toggleColor(color: string) {
    this.selectedColors[color] = !this.selectedColors[color];

    if (this.selectedColors[color]) {
      this.nbColors++;
    } else {
      this.nbColors--;
    }

    this._changes.next(true);
  }

  accepts(user: User) {
    return this.nbColors === 0 || this.selectedColors[user.color];
  }

  isActive(): boolean {
    return this.nbColors > 0;
  }
}

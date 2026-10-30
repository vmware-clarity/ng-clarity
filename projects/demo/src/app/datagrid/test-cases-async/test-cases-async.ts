/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagrid-test-cases-async-demo',
  providers: [Inventory],
  templateUrl: 'test-cases-async.html',
  styleUrls: ['../datagrid.demo.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DatagridTestCasesAsyncDemo {
  users: User[];
  users1: User[];

  loading = false;
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  constructor(inventory: Inventory) {
    inventory.size = 15;
    inventory.reset();

    setTimeout(() => {
      this.changeDetectorRef.markForCheck();
      this.users = inventory.all;
    }, 1000);

    this.users1 = inventory.all.slice(0, 5);

    setTimeout(() => {
      this.changeDetectorRef.markForCheck();
      this.users1 = this.users1.concat(inventory.all.slice(5));
    }, 3000);
  }

  toggle() {
    this.loading = !this.loading;
  }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef } from '@angular/core';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  selector: 'basic-on-push-wrapper-demo',
  providers: [Inventory],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <clr-datagrid>
      <clr-dg-column>User ID</clr-dg-column>
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-column>Creation date</clr-dg-column>
      <clr-dg-column>Favorite color</clr-dg-column>

      <clr-dg-row *ngFor="let user of users">
        <clr-dg-cell>{{ user.id }}</clr-dg-cell>
        <clr-dg-cell>
          aReallyReallyReallyReallyReallyReallyReallyReallyReallyReallyReallyReallyLongUninterruptedContent
        </clr-dg-cell>
        <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
        <clr-dg-cell>{{ user.color }}</clr-dg-cell>
      </clr-dg-row>

      <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
    </clr-datagrid>
  `,
  standalone: false,
})
export class DatagridBasicOnPushWrapperDemo {
  users: User[];

  constructor(inventory: Inventory, private cd: ChangeDetectorRef, private el: ElementRef) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}

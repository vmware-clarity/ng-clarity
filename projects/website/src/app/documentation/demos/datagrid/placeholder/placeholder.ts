/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrDatagridModule, ClrPopoverHostDirective, ClrStopEscapePropagationDirective } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';
import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

const EXAMPLE = `
<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>
  <clr-dg-column>Favorite color</clr-dg-column>

  <clr-dg-placeholder>We couldn't find any users!</clr-dg-placeholder>
  @for (user of users; track user.id) {
    <clr-dg-row></clr-dg-row>
  }

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const EXAMPLE_TS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrDatagridModule],
})
export class ExampleComponent {
  users = [];
}
`;

@Component({
  selector: 'clr-datagrid-placeholder-demo',
  providers: [Inventory],
  templateUrl: 'placeholder.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [ClrDatagridModule, ClrStopEscapePropagationDirective, ClrPopoverHostDirective, StackblitzExampleComponent],
})
export class DatagridPlaceholderDemo {
  example = EXAMPLE;
  exampleTs = EXAMPLE_TS;
  users: User[] = [];
}

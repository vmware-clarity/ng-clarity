/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagrid-placeholder-demo',
  providers: [Inventory],
  templateUrl: 'placeholder.html',
  styleUrls: ['../datagrid.demo.scss'],
})
export class DatagridPlaceholderDemo {
  users: User[] = [];
}

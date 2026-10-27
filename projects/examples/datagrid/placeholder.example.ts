/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrDatagridModule } from '@clr/angular';

import { User } from './inventory/user';

@Component({
  selector: 'clr-datagrid-placeholder-example',
  templateUrl: './placeholder.example.html',
  imports: [ClrDatagridModule],
})
export class DatagridPlaceholderExample {
  users: User[] = [];
}

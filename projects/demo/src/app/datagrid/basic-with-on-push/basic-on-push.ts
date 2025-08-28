/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { Inventory } from '../inventory/inventory';

@Component({
  selector: 'clr-datagrid-basic-on-push-demo',
  providers: [Inventory],
  templateUrl: './basic-on-push.html',
  styleUrls: ['../datagrid.demo.scss'],
  standalone: false,
})
export class DatagridBasicOnPushDemo {}

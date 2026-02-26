/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Inventory } from '../inventory/inventory';

@Component({
  selector: 'clr-datagrid-usage-demo',
  providers: [Inventory],
  templateUrl: './usage.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [RouterLink],
})
export class DatagridUsageDemo {}

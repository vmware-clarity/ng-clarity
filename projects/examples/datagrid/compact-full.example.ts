/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrCheckboxModule,
  ClrCommonFormsModule,
  ClrDatagridModule,
  ClrIcon,
  ClrRadioModule,
  ClrTooltipModule,
} from '@clr/angular';

import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

@Component({
  selector: 'clr-datagrid-compact-full-example',
  templateUrl: './compact-full.example.html',
  providers: [Inventory],
  imports: [
    DatePipe,
    FormsModule,
    ClrCheckboxModule,
    ClrCommonFormsModule,
    ClrDatagridModule,
    ClrIcon,
    ClrRadioModule,
    ClrTooltipModule,
  ],
})
export class DatagridCompactFullExample {
  users: User[];
  compact = true;
  detail = 'tooltip';
  longString =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque pellentesque eget id sed quam.';

  constructor(public inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}

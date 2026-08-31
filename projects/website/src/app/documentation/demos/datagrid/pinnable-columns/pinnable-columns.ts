/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClrCheckboxModule, ClrDatagridModule } from '@clr/angular';

import { EXAMPLES } from './examples';
import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';
import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { CommonFiles } from '../utils/stackblitz-common-data';

@Component({
  selector: 'clr-datagrid-pinnable-columns-demo',
  providers: [Inventory],
  templateUrl: './pinnable-columns.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [ClrDatagridModule, ClrCheckboxModule, FormsModule, StackblitzExampleComponent, RouterLink, DatePipe],
})
export class DatagridPinnableColumnsDemo {
  examples = EXAMPLES;
  commonFiles = CommonFiles;

  users: User[];

  pinId = true;
  pinName = true;

  // Used by the disabled 'Letting the User Pin Columns' section.
  // idPinned = false;
  // namePinned = false;

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }

  // Kept up to date by clrDgPinnedChange, which the two-way binding in the template uses under the hood.
  //
  // Disabled with clrDgPinnable, along with the section that displayed it.
  // get pinnedColumns(): string {
  //   return [this.idPinned ? 'User ID' : null, this.namePinned ? 'Name' : null].filter(Boolean).join(', ');
  // }
}

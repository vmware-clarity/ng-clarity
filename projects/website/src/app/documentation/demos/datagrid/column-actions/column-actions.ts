/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClarityIcons, ClrDatagridModule, ClrIcon, pencilIcon, trashIcon } from '@clr/angular';

import { EXAMPLES } from './examples';
import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';
import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { CommonFiles } from '../utils/stackblitz-common-data';

@Component({
  selector: 'clr-datagrid-column-actions-demo',
  providers: [Inventory],
  templateUrl: './column-actions.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [ClrIcon, ClrDatagridModule, StackblitzExampleComponent, RouterLink, DatePipe],
})
export class DatagridColumnActionsDemo {
  examples = EXAMPLES;
  commonFiles = CommonFiles;

  users: User[];

  idPinned = false;
  lastAction = '';

  constructor(inventory: Inventory) {
    // A projected action renders its own cds-icon, so the shape has to be registered.
    ClarityIcons.addIcons(pencilIcon, trashIcon);

    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }

  renameColumn(): void {
    this.lastAction = 'Rename column';
  }
}

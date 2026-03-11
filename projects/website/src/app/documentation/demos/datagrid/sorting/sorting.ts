/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  ClrAlertModule,
  ClrDatagridModule,
  ClrDatagridSortOrder,
  ClrIcon,
  ClrIconModule,
  ClrPopoverHostDirective,
  ClrStopEscapePropagationDirective,
} from '@clr/angular';

import { EXAMPLES } from './examples';
import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';
import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { PokemonComparator } from '../utils/pokemon-comparator';
import { CommonFiles } from '../utils/stackblitz-common-data';

@Component({
  selector: 'clr-datagrid-sorting-demo',
  providers: [Inventory],
  templateUrl: './sorting.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [
    ClrIcon,
    ClrIconModule,
    ClrAlertModule,
    ClrDatagridModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    StackblitzExampleComponent,
    DatePipe,
  ],
})
export class DatagridSortingDemo {
  examples = EXAMPLES;
  commonFiles = CommonFiles;
  users: User[];
  sortOrder: ClrDatagridSortOrder = ClrDatagridSortOrder.UNSORTED;
  descSort: ClrDatagridSortOrder = ClrDatagridSortOrder.DESC;

  pokemonComparator = new PokemonComparator();

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}

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
  ClrPopoverHostDirective,
  ClrStopEscapePropagationDirective,
} from '@clr/angular';

import { EXAMPLES } from './examples';
import { CodeSnippetComponent } from '../../../../shared/code-snippet/code-snippet.component';
import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';
import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { PokemonFilter } from '../utils/pokemon-filter';
import { CommonFiles } from '../utils/stackblitz-common-data';
import { WinsFilter } from '../utils/wins-filter';

@Component({
  selector: 'clr-datagrid-built-in-filters-demo',
  providers: [Inventory],
  templateUrl: 'built-in-filters.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [
    CodeSnippetComponent,
    ClrDatagridModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    StackblitzExampleComponent,
    ClrAlertModule,
    DatePipe,
  ],
})
export class DatagridBuiltInFiltersDemo {
  examples = EXAMPLES;
  users: User[];

  pokemonFilter = new PokemonFilter();
  winsFilter = new WinsFilter();
  myFilterValue = 'A';
  commonFiles = CommonFiles;

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrDatagridModule, ClrPopoverHostDirective, ClrStopEscapePropagationDirective } from '@clr/angular';

import { EXAMPLES } from './examples';
import { CodeSnippetComponent } from '../../../../shared/code-snippet/code-snippet.component';
import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';
import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { ColorFilter } from '../utils/color-filter';
import { PokemonFilter } from '../utils/pokemon-filter';
import { CommonFiles } from '../utils/stackblitz-common-data';

@Component({
  selector: 'clr-datagrid-filtering-demo',
  providers: [Inventory],
  templateUrl: './filtering.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [
    CodeSnippetComponent,
    StackblitzExampleComponent,
    ClrDatagridModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ColorFilter,
    DatePipe,
  ],
})
export class DatagridFilteringDemo {
  examples = EXAMPLES;
  users: User[];
  myFilterValue = 'A';
  pokemonFilter = new PokemonFilter();
  commonFiles = CommonFiles;

  colorFilters = {
    ...this.commonFiles.additionalFiles,
    'utils/color-filter.ts': '',
  };

  colorFiltersTemplateVariable = {
    ...this.commonFiles.additionalFiles,
    'utils/color-filter.ts': '',
  };
  pokemonFilters = {
    ...this.commonFiles.additionalFiles,
    'utils/pokemon-filter.ts': '',
  };

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { EXAMPLES } from './examples';
import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { PokemonFilter } from '../utils/pokemon-filter';
import { CommonFiles } from '../utils/stackblitz-common-data';

@Component({
  selector: 'clr-datagrid-filtering-demo',
  providers: [Inventory],
  templateUrl: './filtering.html',
  styleUrl: '../datagrid.demo.scss',
  standalone: false,
})
export class DatagridFilteringDemo {
  examples = EXAMPLES;
  users: User[];
  myFilterValue = 'A';
  pokemonFilter = new PokemonFilter();
  commonFiles = CommonFiles;

  /* eslint-disable @typescript-eslint/no-var-requires */
  colorFilters = {
    ...this.commonFiles.additionalFiles,
    'utils/color-filter.ts': require('!raw-loader!../utils/color-filter-default.ts').default,
  };

  colorFiltersTemplateVariable = {
    ...this.commonFiles.additionalFiles,
    'utils/color-filter.ts': require('!raw-loader!../utils/color-filter.ts').default,
  };
  pokemonFilters = {
    ...this.commonFiles.additionalFiles,
    'utils/pokemon-filter.ts': require('!raw-loader!../utils/pokemon-filter.ts').default,
  };
  /* eslint-enable @typescript-eslint/no-var-requires */

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}

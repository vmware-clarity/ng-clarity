/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { IDFilter } from '../utils/id-filter';
import { PokemonFilter } from '../utils/pokemon-filter';

@Component({
  selector: 'clr-built-in-filters-demo',
  providers: [Inventory],
  templateUrl: 'built-in-filters.html',
  styleUrls: ['../datagrid.demo.scss'],
  standalone: false,
})
export class DatagridBuiltInFiltersDemo {
  users: User[];

  pokemonFilter = new PokemonFilter();
  idFilter = new IDFilter();
  myFilterValue1 = 'A';
  myFilterValue2 = 'E';
  displayFilter = true;

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }

  filterToggle() {
    this.displayFilter = !this.displayFilter;
  }
}

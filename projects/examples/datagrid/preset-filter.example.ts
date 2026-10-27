/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrDatagridModule } from '@clr/angular';

import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';
import { PokemonFilter } from './utils/pokemon-filter';

@Component({
  selector: 'clr-datagrid-preset-filter-example',
  templateUrl: './preset-filter.example.html',
  styleUrl: './preset-filter.example.scss',
  providers: [Inventory],
  imports: [DatePipe, ClrDatagridModule],
})
export class DatagridPresetFilterExample {
  users: User[];
  nameFilterValue = 'Dorian';
  pokemonFilter = new PokemonFilter();

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}

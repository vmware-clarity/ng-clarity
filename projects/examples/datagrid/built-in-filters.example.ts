/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  ClrDatagridModule,
  ClrDatagridNumericFilterInterface,
  ClrDatagridStringFilterInterface,
} from '@clr/angular';

import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

class PokemonFilter implements ClrDatagridStringFilterInterface<User> {
  accepts(user: User, search: string): boolean {
    return '' + user.pokemon.number === search || user.pokemon.name.toLowerCase().indexOf(search) >= 0;
  }
}

class WinsFilter implements ClrDatagridNumericFilterInterface<User> {
  accepts(user: User, low: number, high: number): boolean {
    if (low !== null && user.wins < low) {
      return false;
    }
    return !(high !== null && user.wins > high);
  }
}

@Component({
  selector: 'clr-datagrid-built-in-filters-example',
  templateUrl: './built-in-filters.example.html',
  styleUrl: './built-in-filters.example.scss',
  providers: [Inventory],
  imports: [DatePipe, ClrDatagridModule],
})
export class DatagridBuiltInFiltersExample {
  users: User[];
  pokemonFilter = new PokemonFilter();
  winsFilter = new WinsFilter();

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}

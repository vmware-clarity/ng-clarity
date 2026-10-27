/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrDatagridComparatorInterface, ClrDatagridModule, ClrDatagridSortOrder } from '@clr/angular';

import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

class PokemonComparator implements ClrDatagridComparatorInterface<User> {
  compare(a: User, b: User) {
    return a.pokemon.number - b.pokemon.number;
  }
}

@Component({
  selector: 'clr-datagrid-custom-sort-example',
  templateUrl: './custom-sort.example.html',
  styleUrl: './custom-sort.example.scss',
  providers: [Inventory],
  imports: [DatePipe, ClrDatagridModule],
})
export class DatagridCustomSortExample {
  users: User[];
  pokemonComparator = new PokemonComparator();
  sortOrder: ClrDatagridSortOrder = ClrDatagridSortOrder.UNSORTED;

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}

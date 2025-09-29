/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrDatagridComparatorInterface, ClrDatagridSortOrder } from '@clr/angular';

import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { PokemonComparator } from '../utils/pokemon-comparator';

export class UserCreationComparator implements ClrDatagridComparatorInterface<User> {
  compare(a: User, b: User) {
    return a.creation.getTime() - b.creation.getTime();
  }
}

@Component({
  selector: 'clr-datagrid-sorting-demo',
  providers: [Inventory],
  templateUrl: './sorting.html',
  styleUrls: ['../datagrid.demo.scss'],
  standalone: false,
})
export class DatagridSortingDemo {
  users: User[];
  sortOrder: ClrDatagridSortOrder = ClrDatagridSortOrder.UNSORTED;

  pokemonComparator = new PokemonComparator();
  userCreationComparator = new UserCreationComparator();

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}

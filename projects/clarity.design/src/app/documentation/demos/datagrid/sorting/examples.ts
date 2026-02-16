/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const sortingTS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClrDatagridModule, ClrDatagridComparatorInterface, ClrDatagridSortOrder } from '@clr/angular';
import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

class PokemonComparator implements ClrDatagridComparatorInterface<User> {
  compare(a: User, b: User) {
    return a.pokemon.number - b.pokemon.number;
  }
}

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  providers: [Inventory],
  imports: [CommonModule, ClrDatagridModule],
})
export class ExampleComponent {
  public pokemonComparator = new PokemonComparator();
  sortOrder: ClrDatagridSortOrder = ClrDatagridSortOrder.UNSORTED;
  users: User[];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}
`;

const sortingHTML = `
<p cds-text="body">
  <button class="btn btn-secondary" (click)="sortOrder = 1" [disabled]="sortOrder === 1">
    Sort ascendingly
  </button>
  <button class="btn btn-secondary" (click)="sortOrder = -1" [disabled]="sortOrder === -1">
    Sort descendingly
  </button>
  <button class="btn btn-secondary" (click)="sortOrder = 0" [disabled]="sortOrder === 0">
    Clear sort
  </button>
</p>
<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>
  <clr-dg-column
    [clrDgField]="'pokemon.name'"
    [clrDgSortBy]="pokemonComparator"
    [(clrDgSortOrder)]="sortOrder"
  >
    Pokemon
  </clr-dg-column>
  <clr-dg-column>Favorite color</clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users">
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
    <clr-dg-cell>
      {{ user.pokemon.name }}
      <span class="badge badge-5">#{{ user.pokemon.number }}</span>
    </clr-dg-cell>
    <clr-dg-cell>
      <span class="color-square" [style.backgroundColor]="user.color"></span>
    </clr-dg-cell>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const preSortTS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClrDatagridModule, ClrDatagridSortOrder } from '@clr/angular';
import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  providers: [Inventory],
  imports: [CommonModule, ClrDatagridModule],
})
export class ExampleComponent {
  descSort = ClrDatagridSortOrder.DESC;
  users: User[];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}
`;

const preSortHTML = `
<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column [clrDgField]="'name'" [clrDgSortOrder]="descSort">Name</clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>
  <clr-dg-column>Pokemon</clr-dg-column>
  <clr-dg-column>Favorite color</clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users">
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
    <clr-dg-cell>
      {{ user.pokemon.name }}
      <span class="badge badge-5">#{{ user.pokemon.number }}</span>
    </clr-dg-cell>
    <clr-dg-cell>
      <span class="color-square" [style.backgroundColor]="user.color"></span>
    </clr-dg-cell>
  </clr-dg-row>
  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

export const EXAMPLES = {
  sortingTS,
  sortingHTML,
  preSortTS,
  preSortHTML,
};

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const stringFilterInterface = `
interface ClrDatagridStringFilterInterface<T> {
  accepts(item: T, search: string): boolean;
}
`;

const stringFilterInput = `
<!-- In the columns declaration -->
<clr-dg-column>
  My column
  <clr-dg-string-filter [clrDgStringFilter]="myFilter"></clr-dg-string-filter>
</clr-dg-column>
`;

const filterTS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ClrDatagridModule,
  ClrDatagridStringFilterInterface,
  ClrDatagridNumericFilterInterface,
} from '@clr/angular';
import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

class PokemonFilter implements ClrDatagridStringFilterInterface<User> {
  accepts(user: User, search: string): boolean {
    return '' + user.pokemon.number == search || user.pokemon.name.toLowerCase().indexOf(search) >= 0;
  }
}

class WinsFilter implements ClrDatagridNumericFilterInterface<any> {
  accepts(row: any, low: number, high: number): boolean {
    if (low !== null && row.wins < low) {
      return false;
    }
    return !(high !== null && row.wins > high);
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
  users: User[];
  pokemonFilterValue = 'A';
  pokemonFilter = new PokemonFilter();
  winsFilter = new WinsFilter();

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}
`;

const stringFilterHTML = `
<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>
  <clr-dg-column>
    Pokemon
    <clr-dg-string-filter [clrDgStringFilter]="pokemonFilter"></clr-dg-string-filter>
  </clr-dg-column>
  <clr-dg-column>Favorite color</clr-dg-column>
  <clr-dg-column>
    Wins
    <clr-dg-numeric-filter [clrDgNumericFilter]="winsFilter"></clr-dg-numeric-filter>
  </clr-dg-column>

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
    <clr-dg-cell>{{ user.wins }}</clr-dg-cell>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const filterPresetHTML = `
<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>
  <clr-dg-column>
    Pokemon
    <clr-dg-string-filter
      [clrDgStringFilter]="pokemonFilter"
      [(clrFilterValue)]="pokemonFilterValue"
    ></clr-dg-string-filter>
  </clr-dg-column>
  <clr-dg-column>Favorite color</clr-dg-column>
  <clr-dg-column>
    Wins
    <clr-dg-numeric-filter
      [clrDgNumericFilter]="winsFilter"
      [clrFilterValue]="[10, 100]"
    ></clr-dg-numeric-filter>
  </clr-dg-column>

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
    <clr-dg-cell>{{ user.wins }}</clr-dg-cell>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const numericFilterInterface = `
interface ClrDatagridNumericFilterInterface<T> {
  accepts(item: T, low: number, high: number): boolean;
}
`;

const numericFilterInput = `
<clr-dg-column>
  Wins
  <clr-dg-numeric-filter [clrDgNumericFilter]="winsFilter"></clr-dg-numeric-filter>
</clr-dg-column>
`;

export const EXAMPLES = {
  stringFilterInterface,
  stringFilterInput,
  filterTS,
  stringFilterHTML,
  filterPresetHTML,
  numericFilterInterface,
  numericFilterInput,
};

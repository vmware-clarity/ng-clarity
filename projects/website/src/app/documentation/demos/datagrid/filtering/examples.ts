/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const filterInterface = `
interface ClrDatagridFilterInterface<T, S = any> {
  isActive(): boolean;
  accepts(item: T): boolean;
  changes: Observable<any>;
  readonly state?: S;
  equals?(other: ClrDatagridFilterInterface<T, any>): boolean;
}
`;

const inlineFilterTS = `
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrDatagridFilterInterface, ClrDatagridModule } from '@clr/angular';
import { Observable, Subject } from 'rxjs';
import { Inventory } from './inventory/inventory';
import INVENTORY_ITEMS from './inventory/inventory-items.json';
import { User } from './inventory/user';

class ColorFilter implements ClrDatagridFilterInterface<User> {
  allColors = INVENTORY_ITEMS.map((item: User) => item.color)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort();
  selectedColors: { [color: string]: boolean } = {};
  nbColors = 0;

  private _changes = new Subject<any>();
  // We do not want to expose the Subject itself, but the Observable which is read-only
  get changes(): Observable<any> {
    return this._changes.asObservable();
  }

  listSelected(): string[] {
    const list: string[] = [];
    for (const color in this.selectedColors) {
      if (this.selectedColors[color]) {
        list.push(color);
      }
    }
    return list;
  }

  toggleColor(color: string) {
    this.selectedColors[color] = !this.selectedColors[color];
    this.selectedColors[color] ? this.nbColors++ : this.nbColors--;
    this._changes.next(true);
  }

  accepts(user: User) {
    return this.nbColors === 0 || this.selectedColors[user.color];
  }

  isActive(): boolean {
    return this.nbColors > 0;
  }
}

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  providers: [Inventory],
  imports: [DatePipe, ClrDatagridModule],
})
export class ExampleComponent {
  public colorFilter = new ColorFilter();
  users: User[];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}
`;

const inlineFilterHTML = `
<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>
  <clr-dg-column>Pokemon</clr-dg-column>
  <clr-dg-column>
    Favorite color
    <clr-dg-filter [clrDgFilter]="colorFilter">
      <div class="color-filter">
        @for (color of colorFilter.allColors; track color) {
          <span
            class="color-square color-selectable"
            (click)="colorFilter.toggleColor(color)"
            [style.backgroundColor]="color"
            [class.color-selected]="colorFilter.selectedColors[color]"
          ></span>
        }
      </div>
    </clr-dg-filter>
  </clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users">
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
    <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
    <clr-dg-cell>
      <span class="color-square" [style.backgroundColor]="user.color"></span>
    </clr-dg-cell>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const customFilterComponentTS = `
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ColorFilter } from './utils/color-filter';
import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  providers: [Inventory],
  imports: [DatePipe, ClrDatagridModule, ColorFilter],
})
export class ExampleComponent {
  users: User[];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}
`;

const customFilterComponentHTML = `
<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>
  <clr-dg-column>Pokemon</clr-dg-column>
  <!-- In the columns declaration -->
  <clr-dg-column>
    Favorite color
    <clr-dg-filter>
      <clr-datagrid-color-filter></clr-datagrid-color-filter>
    </clr-dg-filter>
  </clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users">
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
    <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
    <clr-dg-cell>
      <span class="color-square" [style.backgroundColor]="user.color"></span>
    </clr-dg-cell>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const templateVariableTS = `
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ColorFilter } from './utils/color-filter';
import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  providers: [Inventory],
  imports: [DatePipe, ClrDatagridModule, ColorFilter],
})
export class ExampleComponent {
  public colorFilter = new ColorFilter();
  users: User[];

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}
`;

const templateVariableHTML = `
<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>
  <clr-dg-column>Pokemon</clr-dg-column>
  <clr-dg-column>
    Favorite color
    <clr-dg-filter [clrDgFilter]="colorFilter">
      <clr-datagrid-color-filter #colorFilter class="color-filter"></clr-datagrid-color-filter>
    </clr-dg-filter>
  </clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users">
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
    <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
    <clr-dg-cell>
      <span class="color-square" [style.backgroundColor]="user.color"></span>
    </clr-dg-cell>
  </clr-dg-row>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

const stringFilterColumnPresetHTML = `
<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column [clrDgField]="'name'" [(clrFilterValue)]="nameFilterValue">Name</clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>
  <clr-dg-column>
    Pokemon
    <clr-dg-string-filter [clrDgStringFilter]="pokemonFilter"></clr-dg-string-filter>
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

const stringFilterColumnPresetTS = `
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';
import { PokemonFilter } from './utils/pokemon-filter';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  providers: [Inventory],
  imports: [DatePipe, ClrDatagridModule],
})
export class ExampleComponent {
  users: User[];
  nameFilterValue = 'Dorian';
  pokemonFilter = new PokemonFilter();

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}
`;

const filterSearchResults = `
<clr-datagrid>
  <!--
      This will search into user.creation (a Date object) and not the result
      of the pipe (the string 'Jan 6, 2018').
    -->
  <clr-dg-column [clrDgField]="'creation'">Creation Date</clr-dg-column>

  <!--
      This will search into user.name and will not include user.id --
      searching for user.id will not return any results.
    -->
  <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>

  @for (user of users; track user.id) {
    <clr-dg-row>
      <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
      <clr-dg-cell>{{ user.id }} : {{ user.name }}</clr-dg-cell>
    </clr-dg-row>
  }
</clr-datagrid>
`;

export const EXAMPLES = {
  filterInterface,
  inlineFilterTS,
  inlineFilterHTML,
  customFilterComponentTS,
  customFilterComponentHTML,
  templateVariableTS,
  templateVariableHTML,
  stringFilterColumnPresetHTML,
  stringFilterColumnPresetTS,
  filterSearchResults,
};

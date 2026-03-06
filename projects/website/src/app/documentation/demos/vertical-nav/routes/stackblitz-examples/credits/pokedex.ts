/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrFocusOnViewInitModule } from '@clr/angular';

@Component({
  selector: 'pokedex-credit',
  template: `
    <b clrFocusOnViewInit>Credit: </b>
    <a target="_blank" href="https://www.pokemon.com/us/pokedex/">Pokédex</a>
    and
    <a target="_blank" href="https://pokemondb.net">PokémonDB</a>
  `,
  imports: [ClrFocusOnViewInitModule],
})
export class PokedexComponent {}

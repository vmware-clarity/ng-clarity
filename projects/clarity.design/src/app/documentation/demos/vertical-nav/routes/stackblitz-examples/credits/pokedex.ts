import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, ClrFocusOnViewInitModule],
})
export class PokedexComponent {}

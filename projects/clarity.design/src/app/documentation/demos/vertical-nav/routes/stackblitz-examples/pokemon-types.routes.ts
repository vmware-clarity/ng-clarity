import { Routes } from '@angular/router';

import { PokedexComponent } from './credits/pokedex';
import { ElectricPokemonComponent } from './pokemon-types/electric';
import { FightingPokemonComponent } from './pokemon-types/fighting';
import { GrassPokemonComponent } from './pokemon-types/grass';
import { NormalPokemonComponent } from './pokemon-types/normal';
import { PoisonPokemonComponent } from './pokemon-types/poison';
import { ProjectPokemonComponent } from './project-pokemon/project-pokemon';

export const appRoutes: Routes = [
  {
    path: '',
    component: ProjectPokemonComponent,
  },
  {
    path: 'normal',
    component: NormalPokemonComponent,
  },
  {
    path: 'electric',
    component: ElectricPokemonComponent,
  },
  {
    path: 'poison',
    component: PoisonPokemonComponent,
  },
  {
    path: 'grass',
    component: GrassPokemonComponent,
  },
  {
    path: 'fighting',
    component: FightingPokemonComponent,
  },
  {
    path: 'credit',
    component: PokedexComponent,
  },
];

import { Routes } from '@angular/router';

import { PokedexComponent } from './credits/pokedex';
import { CharizardComponent } from './pokemon/charizard';
import { CharmanderComponent } from './pokemon/charmander';
import { PidgeyComponent } from './pokemon/pidgey';
import { PikachuComponent } from './pokemon/pikachu';
import { RaichuComponent } from './pokemon/raichu';
import { SnorlaxComponent } from './pokemon/snorlax';
import { ProjectPokemonComponent } from './project-pokemon/project-pokemon';

export const appRoutes: Routes = [
  {
    path: '',
    component: ProjectPokemonComponent,
  },
  {
    path: 'normal/snorlax',
    component: SnorlaxComponent,
  },
  {
    path: 'normal/pidgey',
    component: PidgeyComponent,
  },
  {
    path: 'electric/pikachu',
    component: PikachuComponent,
  },
  {
    path: 'electric/raichu',
    component: RaichuComponent,
  },
  {
    path: 'fire/charmander',
    component: CharmanderComponent,
  },
  {
    path: 'fire/charizard',
    component: CharizardComponent,
  },
  {
    path: 'credit',
    component: PokedexComponent,
  },
];

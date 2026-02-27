/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Routes } from '@angular/router';

import { PokedexComponent } from './credits/pokedex';
import { CharizardComponent } from './pokemon/charizard';
import { CharmanderComponent } from './pokemon/charmander';
import { JigglypuffComponent } from './pokemon/jigglypuff';
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
    path: 'charmander',
    component: CharmanderComponent,
  },
  {
    path: 'jigglypuff',
    component: JigglypuffComponent,
  },
  {
    path: 'pidgey',
    component: PidgeyComponent,
  },
  {
    path: 'pikachu',
    component: PikachuComponent,
  },
  {
    path: 'raichu',
    component: RaichuComponent,
  },
  {
    path: 'snorlax',
    component: SnorlaxComponent,
  },
  {
    path: 'charizard',
    component: CharizardComponent,
  },
  {
    path: 'credit',
    component: PokedexComponent,
  },
];

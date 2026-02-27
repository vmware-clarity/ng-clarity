/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ClrIcon, ClrIconModule, ClrVerticalNavModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../../../shared/stackblitz-example/stackblitz-example.component';
import { pokemonComponents } from '../stackblitz-examples/pokemon-component-generator';

const HTML_EXAMPLE = `
<div class="main-container">
  <header class="header">
    <div class="branding">
      <a routerLink="/" routerLinkActive="active">
        <clr-icon shape="bolt"></clr-icon>
        <span class="title">Project Pokémon</span>
      </a>
    </div>
  </header>
  <div class="content-container">
    <clr-vertical-nav>
      <a clrVerticalNavLink routerLink="./charizard" routerLinkActive="active">Charizard</a>
      <a clrVerticalNavLink routerLink="./charmander" routerLinkActive="active">Charmander</a>
      <a clrVerticalNavLink routerLink="./jigglypuff" routerLinkActive="active">Jigglypuff</a>
      <a clrVerticalNavLink routerLink="./pidgey" routerLinkActive="active">Pidgey</a>
      <a clrVerticalNavLink routerLink="./pikachu" routerLinkActive="active">Pikachu</a>
      <a clrVerticalNavLink routerLink="./raichu" routerLinkActive="active">Raichu</a>
      <a clrVerticalNavLink routerLink="./snorlax" routerLinkActive="active">Snorlax</a>
      <div class="nav-divider"></div>
      <a clrVerticalNavLink routerLink="./credit" routerLinkActive="active">Credit</a>
    </clr-vertical-nav>
    <div class="content-area">
      <router-outlet></router-outlet>
    </div>
  </div>
</div>
`;

const EXAMPLE_TS = '';

const additionalFiles = {
  ...pokemonComponents,
  'app.routes.ts': '',
  'project-pokemon/project-pokemon.ts': '',
  'credits/pokedex.ts': '',
};

@Component({
  selector: 'clr-basic-structure-vertical-nav-demo',
  templateUrl: './basic-structure.html',
  styleUrl: '../../vertical-nav.demo.scss',
  imports: [
    RouterLink,
    RouterLinkActive,
    ClrIcon,
    ClrIconModule,
    ClrVerticalNavModule,
    RouterOutlet,
    StackblitzExampleComponent,
  ],
})
export class BasicNavStructureDemo {
  htmlExample = HTML_EXAMPLE;
  tsExample = EXAMPLE_TS;
  additionalFiles = additionalFiles;
}

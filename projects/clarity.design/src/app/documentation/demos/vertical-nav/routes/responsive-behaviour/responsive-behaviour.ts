/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { pokemonComponents } from '../stackblitz-examples/pokemon-component-generator';

const HTML_EXAMPLE = `
<clr-main-container>
  <clr-header class="header">
    <div class="branding">
      <a routerLink="/" routerLinkActive="active">
        <cds-icon shape="bolt"></cds-icon>
        <span class="title">Project Pokémon</span>
      </a>
    </div>
  </clr-header>
  <div class="content-container">
    <clr-vertical-nav [clr-nav-level]="1">
      <a clrVerticalNavLink routerLink="./charizard" routerLinkActive="active">Charizard</a>
      <a clrVerticalNavLink routerLink="./charmander" routerLinkActive="active">Charmander</a>
      <a clrVerticalNavLink routerLink="./jigglypuff" routerLinkActive="active">Jigglypuff</a>
      <a clrVerticalNavLink routerLink="./pidgey" routerLinkActive="active">Pidgey</a>
      <a clrVerticalNavLink routerLink="./pikachu" routerLinkActive="active">Pikachu</a>
      <div class="nav-divider"></div>
      <a clrVerticalNavLink routerLink="./credit" routerLinkActive="active">Credit</a>
    </clr-vertical-nav>
    <div class="content-area">
      <router-outlet></router-outlet>
    </div>
  </div>
</clr-main-container>
`;

const EXAMPLE_TS = `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClrNavigationModule, ClrVerticalNavModule, ClrMainContainerModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',

  imports: [
    CommonModule,
    RouterModule,
    ClrNavigationModule,
    ClrVerticalNavModule,
    ClrMainContainerModule,
  ],
})
export class ExampleComponent {}
`;

/* eslint-disable @typescript-eslint/no-var-requires */
const additionalFiles = {
  ...pokemonComponents,
  'app.routes.ts': require('!raw-loader!../stackblitz-examples/pokemon.routes').default,
  'project-pokemon/project-pokemon.ts': require('!raw-loader!../stackblitz-examples/project-pokemon/project-pokemon')
    .default,
  'credits/pokedex.ts': require('!raw-loader!../stackblitz-examples/credits/pokedex').default,
};
/* eslint-enable @typescript-eslint/no-var-requires */

@Component({
  selector: 'clr-responsive-behaviour-vertical-nav-demo',
  templateUrl: './responsive-behaviour.html',
  styleUrl: '../../vertical-nav.demo.scss',
  standalone: false,
})
export class ResponsiveBehaviourDemo {
  htmlExample = HTML_EXAMPLE;
  tsExample = EXAMPLE_TS;
  additionalFiles = additionalFiles;
}

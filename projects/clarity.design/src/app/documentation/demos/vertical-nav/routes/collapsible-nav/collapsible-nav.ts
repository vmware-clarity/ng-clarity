/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { pokemonTypeComponents } from '../stackblitz-examples/pokemon-component-generator';

const HTML_EXAMPLE = `
<div class="main-container">
  <header class="header">
    <div class="branding">
      <a routerLink="/" routerLinkActive="active">
        <cds-icon shape="bolt"></cds-icon>
        <span class="title">Project Pokémon</span>
      </a>
    </div>
  </header>
  <div class="content-container">
    <clr-vertical-nav [clrVerticalNavCollapsible]="true" [clrVerticalNavCollapsed]="false">
      <a clrVerticalNavLink routerLink="./normal" routerLinkActive="active">
        <cds-icon clrVerticalNavIcon shape="user"></cds-icon>
        Normal
      </a>
      <a clrVerticalNavLink routerLink="./electric" routerLinkActive="active">
        <cds-icon clrVerticalNavIcon shape="bolt"></cds-icon>
        Electric
      </a>
      <a clrVerticalNavLink routerLink="./poison" routerLinkActive="active">
        <cds-icon clrVerticalNavIcon shape="sad-face"></cds-icon>
        Poison
      </a>
      <a clrVerticalNavLink routerLink="./grass" routerLinkActive="active">
        <cds-icon clrVerticalNavIcon shape="bug"></cds-icon>
        Grass
      </a>
      <a clrVerticalNavLink routerLink="./fighting" routerLinkActive="active">
        <cds-icon clrVerticalNavIcon shape="shield"></cds-icon>
        Fighting
      </a>
      <a clrVerticalNavLink routerLink="./credit" routerLinkActive="active">
        <cds-icon clrVerticalNavIcon shape="certificate"></cds-icon>
        Credit
      </a>
    </clr-vertical-nav>
    <div class="content-area">
      <router-outlet></router-outlet>
    </div>
  </div>
</div>
`;

const HTML_EXAMPLE_1 = `
<div class="main-container">
  <header class="header">
    <div class="branding">
      <a routerLink="/" routerLinkActive="active">
        <cds-icon shape="bolt"></cds-icon>
        <span class="title">Project Pokémon</span>
      </a>
    </div>
  </header>
  <div class="content-container">
    <clr-vertical-nav
      [clrVerticalNavCollapsible]="true"
      [clrVerticalNavCollapsed]="false"
      class="nav-trigger--bottom"
    >
      <a clrVerticalNavLink routerLink="./normal" routerLinkActive="active">
        <cds-icon clrVerticalNavIcon shape="user"></cds-icon>
        Normal
      </a>
      <a clrVerticalNavLink routerLink="./electric" routerLinkActive="active">
        <cds-icon clrVerticalNavIcon shape="bolt"></cds-icon>
        Electric
      </a>
    </clr-vertical-nav>
    <div class="content-area">
      <router-outlet></router-outlet>
    </div>
  </div>
</div>
`;

/* eslint-disable @typescript-eslint/no-var-requires */
const EXAMPLE_TS = require('!raw-loader!../stackblitz-examples/example.component').default;

const additionalFiles = {
  ...pokemonTypeComponents,
  'app.routes.ts': require('!raw-loader!../stackblitz-examples/pokemon-types.routes').default,
  'project-pokemon/project-pokemon.ts': require('!raw-loader!../stackblitz-examples/project-pokemon/project-pokemon')
    .default,
  'credits/pokedex.ts': require('!raw-loader!../stackblitz-examples/credits/pokedex').default,
};
/* eslint-enable @typescript-eslint/no-var-requires */

@Component({
  selector: 'clr-vertical-nav-collapsible-demo',
  templateUrl: './collapsible-nav.html',
  styleUrl: '../../vertical-nav.demo.scss',
  standalone: false,
})
export class CollapsibleNavDemo {
  htmlExampleTop = HTML_EXAMPLE;
  htmlExampleBottom = HTML_EXAMPLE_1;
  tsExample = EXAMPLE_TS;
  additionalFiles = additionalFiles;

  collapsible = true;
  collapsed = false;
}

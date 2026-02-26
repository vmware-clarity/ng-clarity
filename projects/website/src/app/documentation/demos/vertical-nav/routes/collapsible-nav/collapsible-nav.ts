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
import { pokemonTypeComponents } from '../stackblitz-examples/pokemon-component-generator';

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
    <clr-vertical-nav [clrVerticalNavCollapsible]="true" [clrVerticalNavCollapsed]="false">
      <a clrVerticalNavLink routerLink="./normal" routerLinkActive="active">
        <clr-icon clrVerticalNavIcon shape="user"></clr-icon>
        Normal
      </a>
      <a clrVerticalNavLink routerLink="./electric" routerLinkActive="active">
        <clr-icon clrVerticalNavIcon shape="bolt"></clr-icon>
        Electric
      </a>
      <a clrVerticalNavLink routerLink="./poison" routerLinkActive="active">
        <clr-icon clrVerticalNavIcon shape="sad-face"></clr-icon>
        Poison
      </a>
      <a clrVerticalNavLink routerLink="./grass" routerLinkActive="active">
        <clr-icon clrVerticalNavIcon shape="bug"></clr-icon>
        Grass
      </a>
      <a clrVerticalNavLink routerLink="./fighting" routerLinkActive="active">
        <clr-icon clrVerticalNavIcon shape="shield"></clr-icon>
        Fighting
      </a>
      <a clrVerticalNavLink routerLink="./credit" routerLinkActive="active">
        <clr-icon clrVerticalNavIcon shape="certificate"></clr-icon>
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
        <clr-icon shape="bolt"></clr-icon>
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
        <clr-icon clrVerticalNavIcon shape="user"></clr-icon>
        Normal
      </a>
      <a clrVerticalNavLink routerLink="./electric" routerLinkActive="active">
        <clr-icon clrVerticalNavIcon shape="bolt"></clr-icon>
        Electric
      </a>
    </clr-vertical-nav>
    <div class="content-area">
      <router-outlet></router-outlet>
    </div>
  </div>
</div>
`;

const EXAMPLE_TS = '';

const additionalFiles = {
  ...pokemonTypeComponents,
  'app.routes.ts': '',
  'project-pokemon/project-pokemon.ts': '',
  'credits/pokedex.ts': '',
};

@Component({
  selector: 'clr-vertical-nav-collapsible-demo',
  templateUrl: './collapsible-nav.html',
  styleUrl: '../../vertical-nav.demo.scss',
  imports: [
    ClrIcon,
    ClrIconModule,
    ClrVerticalNavModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    StackblitzExampleComponent,
  ],
})
export class CollapsibleNavDemo {
  htmlExampleTop = HTML_EXAMPLE;
  htmlExampleBottom = HTML_EXAMPLE_1;
  tsExample = EXAMPLE_TS;
  additionalFiles = additionalFiles;

  collapsible = true;
  collapsed = false;
}

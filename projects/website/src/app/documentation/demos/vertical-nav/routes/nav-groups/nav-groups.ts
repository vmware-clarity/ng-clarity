/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ClrAlertModule, ClrIcon, ClrIconModule, ClrVerticalNavModule } from '@clr/angular';

import { CodeSnippetComponent } from '../../../../../shared/code-snippet/code-snippet.component';
import { StackblitzExampleComponent } from '../../../../../shared/stackblitz-example/stackblitz-example.component';
import { pokemonComponents } from '../stackblitz-examples/pokemon-component-generator';

const HTML_EXAMPLE = `
<div class="main-container">
  <header class="header">
    <div class="branding">
      <a href="/">
        <clr-icon shape="bolt"></clr-icon>
        <span class="title">Project Pokémon</span>
      </a>
    </div>
  </header>
  <div class="content-container">
    <clr-vertical-nav [clrVerticalNavCollapsible]="true">
      <clr-vertical-nav-group routerLinkActive="active">
        <clr-icon shape="user" clrVerticalNavIcon></clr-icon>
        Normal
        <clr-vertical-nav-group-children>
          <a clrVerticalNavLink routerLink="./normal/pidgey" routerLinkActive="active">Pidgey</a>
          <a clrVerticalNavLink routerLink="./normal/snorlax" routerLinkActive="active">Snorlax</a>
        </clr-vertical-nav-group-children>
      </clr-vertical-nav-group>
      <clr-vertical-nav-group routerLinkActive="active">
        <clr-icon shape="flame" clrVerticalNavIcon></clr-icon>
        Fire
        <clr-vertical-nav-group-children>
          <a clrVerticalNavLink routerLink="./fire/charmander" routerLinkActive="active">Charmander</a>
          <a clrVerticalNavLink routerLink="./fire/charizard" routerLinkActive="active">Charizard</a>
        </clr-vertical-nav-group-children>
      </clr-vertical-nav-group>
      <clr-vertical-nav-group routerLinkActive="active">
        <clr-icon shape="bolt" clrVerticalNavIcon></clr-icon>
        Electric
        <clr-vertical-nav-group-children>
          <a clrVerticalNavLink routerLink="./electric/pikachu" routerLinkActive="active">Pikachu</a>
          <a clrVerticalNavLink routerLink="./electric/raichu" routerLinkActive="active">Raichu</a>
        </clr-vertical-nav-group-children>
      </clr-vertical-nav-group>
      <a clrVerticalNavLink routerLinkActive="active" routerLink="./credit">
        <clr-icon shape="certificate" clrVerticalNavIcon></clr-icon>
        Credit
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
  ...pokemonComponents,
  'app.routes.ts': '',
  'project-pokemon/project-pokemon.ts': '',
  'credits/pokedex.ts': '',
};

@Component({
  selector: 'clr-vertical-nav-nav-groups-demo',
  templateUrl: './nav-groups.html',
  styleUrl: '../../vertical-nav.demo.scss',
  imports: [
    ClrIcon,
    ClrIconModule,
    ClrVerticalNavModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    ClrAlertModule,
    StackblitzExampleComponent,
    CodeSnippetComponent,
  ],
})
export class VerticalNavGroupsDemo {
  htmlExample = HTML_EXAMPLE;
  tsExample = EXAMPLE_TS;
  additionalFiles = additionalFiles;

  demoCollapsible = true;
}

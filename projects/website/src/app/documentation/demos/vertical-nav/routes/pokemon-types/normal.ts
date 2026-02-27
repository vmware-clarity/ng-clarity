/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrFocusOnViewInitModule } from '@clr/angular';

import { CodeSnippetComponent } from '../../../../../shared/code-snippet/code-snippet.component';

const HTML_EXAMPLE = `
<!-- This could be a heading element. -->
<div cds-text="subsection-bold" clrFocusOnViewInit>Normal</div>
<p>
  The Normal type is the most basic type of Pokémon. They are very common and appear from the very first
  route you visit. Most Normal Pokémon are single type, but there is a large contingent having a second
  type of Flying.
</p>
`;
@Component({
  selector: 'clr-normal-pokemon-demo',
  template: `
    <div cds-text="subsection-bold" clrFocusOnViewInit class="demo-title">Normal</div>
    <p>
      The Normal type is the most basic type of Pokémon. They are very common and appear from the very first route you
      visit. Most Normal Pokémon are single type, but there is a large contingent having a second type of Flying.
    </p>
    <p>
      <em>The template preview of the router component:</em>
    </p>
    <app-code-snippet [code]="htmlExample"></app-code-snippet>
  `,
  styleUrl: '../../vertical-nav.demo.scss',
  imports: [ClrFocusOnViewInitModule, CodeSnippetComponent],
})
export class NormalPokemonDemo {
  htmlExample = HTML_EXAMPLE;
}

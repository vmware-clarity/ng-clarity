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
<div cds-text="subsection-bold" clrFocusOnViewInit>Grass</div>
<p>
  Grass is one of the three basic elemental types along with Fire and Water, which constitute the three
  starter Pokémon. This creates a simple triangle to explain the type concept easily to new players.
</p>
<p>
  Grass is one of the weakest types statistically, with 5 defensive weaknesses and 7 types that are
  resistant to Grass moves. Furthermore, many Grass Pokémon have Poison as their secondary type, adding
  a Psychic vulnerability. The type combination with the most weaknesses is Grass/Psychic.
</p>
`;
@Component({
  selector: 'clr-grass-pokemon-demo',
  template: `
    <div cds-text="subsection-bold" clrFocusOnViewInit class="demo-title">Grass</div>
    <p>
      Grass is one of the three basic elemental types along with Fire and Water, which constitute the three starter
      Pokémon. This creates a simple triangle to explain the type concept easily to new players.
    </p>
    <p>
      Grass is one of the weakest types statistically, with 5 defensive weaknesses and 7 types that are resistant to
      Grass moves. Furthermore, many Grass Pokémon have Poison as their secondary type, adding a Psychic vulnerability.
      The type combination with the most weaknesses is Grass/Psychic.
    </p>
    <p>
      <em>The template preview of the router component:</em>
    </p>
    <app-code-snippet [code]="htmlExample"></app-code-snippet>
  `,
  styleUrl: '../../vertical-nav.demo.scss',
  imports: [ClrFocusOnViewInitModule, CodeSnippetComponent],
})
export class GrassPokemonDemo {
  htmlExample = HTML_EXAMPLE;
}

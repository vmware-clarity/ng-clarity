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
<div cds-text="subsection-bold" clrFocusOnViewInit>Poison</div>
<p>
  The Poison type is regarded as one of the weakest offensively. Prior to Pokémon X/Y it was
  super-effective only against Grass (many of which are dual Poison so neutralizes the effect). It now
  has an extra advantage against the new Fairy type. In the first generation it was also super-effective
  against Bug but this was changed. It fares a little better defensively but its best advantage is
  through status moves like Toxic.
</p>
`;
@Component({
  selector: 'clr-poison-pokemon-demo',
  template: `
    <div cds-text="subsection-bold" clrFocusOnViewInit class="demo-title">Poison</div>
    <p>
      The Poison type is regarded as one of the weakest offensively. Prior to Pokémon X/Y it was super-effective only
      against Grass (many of which are dual Poison so neutralizes the effect). It now has an extra advantage against the
      new Fairy type. In the first generation it was also super-effective against Bug but this was changed. It fares a
      little better defensively but its best advantage is through status moves like Toxic.
    </p>
    <p>
      <em>The template preview of the router component:</em>
    </p>
    <app-code-snippet [code]="htmlExample"></app-code-snippet>
  `,
  styleUrl: '../../vertical-nav.demo.scss',
  imports: [ClrFocusOnViewInitModule, CodeSnippetComponent],
})
export class PoisonPokemonDemo {
  htmlExample = HTML_EXAMPLE;
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `
<!-- This could be a heading element. -->
<div cds-text="subsection-bold" clrFocusOnViewInit>Fighting</div>
<p>
  Fighting Pokémon are strong and muscle-bound, often based on martial artists. Fighting moves are
  super-effective against five other types (as is Ground), making them very good offensively. Most
  Fighting type moves are in the Physical category, for obvious reasons.
</p>
`;

@Component({
  selector: 'clr-fighting-pokemon-demo',
  template: ` <div cds-text="subsection-bold" clrFocusOnViewInit class="demo-title">Fighting</div>
    <p>
      Fighting Pokémon are strong and muscle-bound, often based on martial artists. Fighting moves are super-effective
      against five other types (as is Ground), making them very good offensively. Most Fighting type moves are in the
      Physical category, for obvious reasons.
    </p>
    <p>
      <em>The template preview of the router component:</em>
    </p>
    <app-code-snippet [code]="htmlExample"></app-code-snippet>`,
  styleUrl: '../../vertical-nav.demo.scss',
  standalone: false,
})
export class FightingPokemonDemo {
  htmlExample = HTML_EXAMPLE;
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `
<!-- This could be a heading element. -->
<div cds-text="subsection bold" clrFocusOnViewInit>Snorlax</div>
<p>
  Snorlax's typical day consists of nothing more than eating and sleeping. It is such a docile Pokémon
  that there are children who use its expansive belly as a place to play.
</p>
`;

@Component({
  selector: 'clr-snorlax-demo',
  template: `
    <div cds-text="subsection bold" clrFocusOnViewInit class="demo-title">Snorlax</div>
    <p>
      Snorlax's typical day consists of nothing more than eating and sleeping. It is such a docile Pokémon that there
      are children who use its expansive belly as a place to play.
    </p>
    <p>
      <em>The template preview of the router component:</em>
    </p>
    <app-code-snippet [code]="htmlExample"></app-code-snippet>
  `,
  styleUrl: '../../vertical-nav.demo.scss',
  standalone: false,
})
export class SnorlaxDemo {
  htmlExample = HTML_EXAMPLE;
}

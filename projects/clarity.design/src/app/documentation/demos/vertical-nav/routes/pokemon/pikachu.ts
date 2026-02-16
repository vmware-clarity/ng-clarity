/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `
<!-- This could be a heading element. -->
<div cds-text="subsection bold" clrFocusOnViewInit>Pikachu</div>
<p>
  Whenever Pikachu comes across something new, it blasts it with a jolt of electricity. If you come
  across a blackened berry, it's evidence that this Pokémon mistook the intensity of its charge.
</p>
`;

@Component({
  selector: 'clr-pikachu-demo',
  template: `
    <div cds-text="subsection bold" clrFocusOnViewInit class="demo-title">Pikachu</div>
    <p>
      Whenever Pikachu comes across something new, it blasts it with a jolt of electricity. If you come across a
      blackened berry, it's evidence that this Pokémon mistook the intensity of its charge.
    </p>
    <p>
      <em>The template preview of the router component:</em>
    </p>
    <app-code-snippet [code]="htmlExample"></app-code-snippet>
  `,
  styleUrl: '../../vertical-nav.demo.scss',
  standalone: false,
})
export class PikachuDemo {
  htmlExample = HTML_EXAMPLE;
}

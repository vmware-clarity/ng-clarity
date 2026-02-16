/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `
<!-- This could be a heading element. -->
<div cds-text="subsection bold" clrFocusOnViewInit>Jiggpuff</div>
<p>
  Jigglypuff's vocal cords can freely adjust the wavelength of its voice. This Pokémon uses this ability
  to sing at precisely the right wavelength to make its foes most drowsy.
</p>
`;

@Component({
  selector: 'clr-jigglypuff-demo',
  template: `
    <div cds-text="subsection bold" clrFocusOnViewInit class="demo-title">Jiggpuff</div>
    <p>
      Jigglypuff's vocal cords can freely adjust the wavelength of its voice. This Pokémon uses this ability to sing at
      precisely the right wavelength to make its foes most drowsy.
    </p>
    <p>
      <em>The template preview of the router component:</em>
    </p>
    <app-code-snippet [code]="htmlExample"></app-code-snippet>
  `,
  styleUrl: '../../vertical-nav.demo.scss',
  standalone: false,
})
export class JigglypuffDemo {
  htmlExample = HTML_EXAMPLE;
}

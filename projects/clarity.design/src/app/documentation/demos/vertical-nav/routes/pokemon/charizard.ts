/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `
<!-- This could be a heading element. -->
<div cds-text="subsection bold" clrFocusOnViewInit>Charizard</div>
<p>
  Charizard flies around the sky in search of powerful opponents. It breathes fire of such great heat
  that it melts anything. However, it never turns its fiery breath on any opponent weaker than itself.
</p>
`;

@Component({
  selector: 'clr-charizard-demo',
  template: `
    <div cds-text="subsection bold" clrFocusOnViewInit class="demo-title">Charizard</div>
    <p>
      Charizard flies around the sky in search of powerful opponents. It breathes fire of such great heat that it melts
      anything. However, it never turns its fiery breath on any opponent weaker than itself.
    </p>
    <p>
      <em>The template preview of the router component:</em>
    </p>
    <app-code-snippet [code]="htmlExample"></app-code-snippet>
  `,
  styleUrl: '../../vertical-nav.demo.scss',
  standalone: false,
})
export class CharizardDemo {
  htmlExample = HTML_EXAMPLE;
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `
<!-- This could be a heading element. -->
<div cds-text="subsection bold" clrFocusOnViewInit>Pidgey</div>
<p>
  Pidgey has an extremely sharp sense of direction. It is capable of unerringly returning home to its
  nest, however far it may be removed from its familiar surroundings.
</p>
`;

@Component({
  selector: 'clr-pidgey-demo',
  template: `
    <div cds-text="subsection bold" clrFocusOnViewInit class="demo-title">Pidgey</div>
    <p>
      Pidgey has an extremely sharp sense of direction. It is capable of unerringly returning home to its nest, however
      far it may be removed from its familiar surroundings.
    </p>
    <p>
      <em>The template preview of the router component:</em>
    </p>
    <app-code-snippet [code]="htmlExample"></app-code-snippet>
  `,
  styleUrl: '../../vertical-nav.demo.scss',
  standalone: false,
})
export class PidgeyDemo {
  htmlExample = HTML_EXAMPLE;
}

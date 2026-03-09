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
<div cds-text="subsection bold" clrFocusOnViewInit>Raichu</div>
<p>
  If the electrical sacs become excessively charged, Raichu plants its tail in the ground and
  discharges. Scorched patches of ground will be found near this Pokémon's nest.
</p>
`;

@Component({
  selector: 'clr-raichu-demo',
  template: `
    <div cds-text="subsection bold" clrFocusOnViewInit class="demo-title">Raichu</div>
    <p>
      If the electrical sacs become excessively charged, Raichu plants its tail in the ground and discharges. Scorched
      patches of ground will be found near this Pokémon's nest.
    </p>
    <p>
      <em>The template preview of the router component:</em>
    </p>
    <app-code-snippet [code]="htmlExample"></app-code-snippet>
  `,
  styleUrl: '../../vertical-nav.demo.scss',
  imports: [ClrFocusOnViewInitModule, CodeSnippetComponent],
})
export class RaichuDemo {
  htmlExample = HTML_EXAMPLE;
}

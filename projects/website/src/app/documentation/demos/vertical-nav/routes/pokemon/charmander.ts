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
<div cds-text="subsection bold" clrFocusOnViewInit>Charmander</div>
<p>
  The flame that burns at the tip of its tail is an indication of its emotions. The flame wavers when
  Charmander is enjoying itself. If the Pokémon becomes enraged, the flame burns fiercely.
</p>
`;

@Component({
  selector: 'clr-charmander-demo',
  template: `
    <div cds-text="subsection bold" clrFocusOnViewInit class="demo-title">Charmander</div>
    <p>
      The flame that burns at the tip of its tail is an indication of its emotions. The flame wavers when Charmander is
      enjoying itself. If the Pokémon becomes enraged, the flame burns fiercely.
    </p>
    <p>
      <em>The template preview of the router component:</em>
    </p>

    <app-code-snippet [code]="htmlExample"></app-code-snippet>
  `,
  styleUrl: '../../vertical-nav.demo.scss',
  imports: [ClrFocusOnViewInitModule, CodeSnippetComponent],
})
export class CharmanderDemo {
  htmlExample = HTML_EXAMPLE;
}

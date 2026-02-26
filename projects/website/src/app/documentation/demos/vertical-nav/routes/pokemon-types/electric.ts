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
<div cds-text="subsection-bold" clrFocusOnViewInit>Electric</div>
<p>
  There are relatively few Electric Pokémon; in fact only four were added in the third generation. Most
  are based on rodents or inanimate objects.
</p>
<p>Electric Pokémon are very good defensively, being weak only to Ground moves.</p>
`;
@Component({
  selector: 'clr-electric-pokemon-demo',
  template: ` <div cds-text="subsection-bold" clrFocusOnViewInit class="demo-title">Electric</div>
    <p>
      There are relatively few Electric Pokémon; in fact only four were added in the third generation. Most are based on
      rodents or inanimate objects.
    </p>
    <p>Electric Pokémon are very good defensively, being weak only to Ground moves.</p>
    <p>
      <em>The template preview of the router component:</em>
    </p>
    <app-code-snippet [code]="htmlExample"></app-code-snippet>`,
  styleUrl: '../../vertical-nav.demo.scss',
  imports: [ClrFocusOnViewInitModule, CodeSnippetComponent],
})
export class ElectricPokemonDemo {
  htmlExample = HTML_EXAMPLE;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrIcon } from '@clr/angular/icon';

import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ClarityDocComponent } from '../clarity-doc';

const HORIZONTAL_EXAMPLE = `
<div cds-layout="horizontal gap:md">
  <span>Item 1</span>
  <span>Item 2</span>
  <span>Item 3</span>
</div>
`;

const VERTICAL_EXAMPLE = `
<div cds-layout="vertical gap:md">
  <span>Item 1</span>
  <span>Item 2</span>
  <span>Item 3</span>
</div>
`;

const ALIGNMENT_EXAMPLE = `
<!-- align children to the center of both axes -->
<div cds-layout="horizontal gap:md align:center" style="height: 200px">
  <span>Centered</span>
</div>

<!-- push children to the right -->
<div cds-layout="horizontal gap:md align:right">
  <button class="btn btn-sm">Cancel</button>
  <button class="btn btn-sm btn-primary">Save</button>
</div>

<!-- stretch children to fill the container width equally -->
<div cds-layout="horizontal gap:sm align:fill">
  <button class="btn btn-sm">One</button>
  <button class="btn btn-sm">Two</button>
  <button class="btn btn-sm">Three</button>
</div>
`;

const GAP_EXAMPLE = `
<!-- gap sizes: none | xxs | xs | sm | md | lg | xl | xxl -->
<div cds-layout="horizontal gap:sm">
  <span>Small gap</span>
  <span>between items</span>
</div>

<div cds-layout="horizontal gap:xl">
  <span>Extra large gap</span>
  <span>between items</span>
</div>
`;

const SPACING_EXAMPLE = `
<!-- padding shorthand: p:md applies equal padding on all sides -->
<div cds-layout="p:md">…</div>

<!-- padding per-axis -->
<div cds-layout="p-x:lg p-y:sm">…</div>

<!-- padding per-side: p-t (top) p-r (right) p-b (bottom) p-l (left) -->
<div cds-layout="p-t:xxl p-b:md">…</div>

<!-- margin works the same way with m:, m-x:, m-y:, m-t:, m-r:, m-b:, m-l: -->
<div cds-layout="m-t:lg m-b:md">…</div>
`;

const CONTAINER_EXAMPLE = `
<!-- constrain max-width to standard breakpoints -->
<div cds-layout="container:sm">…</div>
<!-- 576px -->
<div cds-layout="container:md">…</div>
<!-- 768px -->
<div cds-layout="container:lg">…</div>
<!-- 992px -->
<div cds-layout="container:xl">…</div>
<!-- 1200px -->

<!-- center the constrained container horizontally -->
<div cds-layout="container:md container:center">…</div>
`;

const WRAP_EXAMPLE = `
<!-- wrap:none prevents items wrapping to a new row -->
<div cds-layout="horizontal gap:md wrap:none">
  <span>Item 1</span>
  <span>Item 2</span>
  <span>Item 3</span>
</div>
`;

const COMBINED_EXAMPLE = `
<!-- real-world card footer: right-aligned button pair -->
<footer cds-layout="horizontal gap:sm align:right p:md">
  <button class="btn btn-outline btn-sm">Cancel</button>
  <button class="btn btn-primary btn-sm">Submit</button>
</footer>
`;

@Component({
  templateUrl: './layout-utilities.demo.html',
  styleUrl: './layout-utilities.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [DocTabsComponent, DocTabComponent, CodeSnippetComponent, ClrIcon],
})
export class LayoutUtilitiesDemo extends ClarityDocComponent {
  readonly horizontalExample = HORIZONTAL_EXAMPLE;
  readonly verticalExample = VERTICAL_EXAMPLE;
  readonly alignmentExample = ALIGNMENT_EXAMPLE;
  readonly gapExample = GAP_EXAMPLE;
  readonly spacingExample = SPACING_EXAMPLE;
  readonly containerExample = CONTAINER_EXAMPLE;
  readonly wrapExample = WRAP_EXAMPLE;
  readonly combinedExample = COMBINED_EXAMPLE;

  readonly alignValues = [
    { value: 'top', description: 'Children align to the top of the cross axis.' },
    { value: 'bottom', description: 'Children align to the bottom of the cross axis.' },
    { value: 'left', description: 'Children align to the left of the main axis.' },
    { value: 'right', description: 'Children align to the right of the main axis.' },
    { value: 'center', description: 'Children are centered on both axes.' },
    { value: 'vertical-center', description: 'Children are centered on the cross (vertical) axis.' },
    { value: 'horizontal-center', description: 'Children are centered on the main (horizontal) axis.' },
    { value: 'fill', description: 'Children expand equally to fill the available main-axis space.' },
    { value: 'vertical-stretch', description: 'Children stretch to fill the full height of the container.' },
    { value: 'horizontal-stretch', description: 'Children stretch to fill the full width of the container.' },
  ];

  readonly gapValues = ['none', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

  constructor() {
    super('layout-utilities');
  }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ClarityDocComponent } from '../clarity-doc';

const HORIZONTAL_EXAMPLE = `
<div cds-layout="vertical gap:md">
  <p cds-text="body">Content above the divider.</p>
  <hr cds-divider />
  <p cds-text="body">Content below the divider.</p>
</div>
`;

const VERTICAL_EXAMPLE = `
<div cds-layout="horizontal gap:md align:vertical-center">
  <button class="btn btn-outline btn-sm">Action 1</button>
  <button class="btn btn-outline btn-sm">Action 2</button>
  <hr cds-divider orientation="vertical" />
  <button class="btn btn-outline btn-sm">Action 3</button>
</div>
`;

const CUSTOM_EXAMPLE = `
<!-- Override color and thickness with CSS custom properties -->
<style>
  .my-divider {
    --color: var(--cds-global-color-blue-700);
    --size: 2px;
  }
</style>

<hr cds-divider class="my-divider" />
`;

@Component({
  templateUrl: './divider.demo.html',
  styleUrl: './divider.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [DocTabsComponent, DocTabComponent, CodeSnippetComponent],
})
export class DividerDemo extends ClarityDocComponent {
  readonly horizontalExample = HORIZONTAL_EXAMPLE;
  readonly verticalExample = VERTICAL_EXAMPLE;
  readonly customExample = CUSTOM_EXAMPLE;

  constructor() {
    super('divider');
  }
}

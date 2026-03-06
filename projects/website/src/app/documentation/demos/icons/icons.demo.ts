/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClrIcon, ClrIconModule } from '@clr/angular';

import { IconShapesComponent } from './icon-shapes/icon-shapes.component';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ClarityDocComponent } from '../clarity-doc';

const ICONS_IMPORT_EXAMPLE = `
import '@cds/core/icon/register.js';

ClarityIcons.addIcons(userIcon);
`;

const ICONS_INSTANTIATE_EXAMPLE = `<clr-icon shape="user"></clr-icon>`;

const ADD_ICONS_EXAMPLE = `ClarityIcons.addIcons(['my-custom-icon', '<svg ... >[your SVG code goes here]</svg>']);`;

const ICONS_CUSTOMIZE_EXAMPLE = `<clr-icon shape="my-custom-shape"></clr-icon>`;

const INERT_ICONS_EXAMPLE = `<clr-icon shape="bars"></clr-icon>`;

const INTERACTIVE_ICONS_EXAMPLE = `
<button class="btn" aria-label="toggle menu">
  <clr-icon shape="bars"></clr-icon>
  Menu
</button>
`;

const INTERACTIVE_ICONS_WITHOUT_DESCRIPTIVE_TEXT_EXAMPLE = `
<button class="btn btn-icon" aria-label="toggle menu">
  <clr-icon shape="bars"></clr-icon>
</button>
`;

const STATUS_OR_INDICATOR_ICONS_EXAMPLE = `
<p>
  <clr-icon shape="exclamation-triangle" role="img" aria-label="Usage Warning"></clr-icon>
  CPU usage is at 99% use.
</p>
`;

@Component({
  templateUrl: 'icons.demo.html',
  styleUrl: './icons.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    RouterLink,
    CodeSnippetComponent,
    ClrIcon,
    ClrIconModule,
    IconShapesComponent,
  ],
})
export class IconsDemo extends ClarityDocComponent {
  iconsImportExample = ICONS_IMPORT_EXAMPLE;
  iconsInstantiateExample = ICONS_INSTANTIATE_EXAMPLE;
  addIconsExample = ADD_ICONS_EXAMPLE;
  iconsCustomizeExample = ICONS_CUSTOMIZE_EXAMPLE;
  inertIconsExample = INERT_ICONS_EXAMPLE;
  interactiveIconsExample = INTERACTIVE_ICONS_EXAMPLE;
  interactiveIconsExampleWithoutDescriptiveText = INTERACTIVE_ICONS_WITHOUT_DESCRIPTIVE_TEXT_EXAMPLE;
  statusOrIndicatorIconsExample = STATUS_OR_INDICATOR_ICONS_EXAMPLE;

  constructor() {
    super('icons');
  }
}

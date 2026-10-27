/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClrIcon } from '@clr/angular/icon';
import { ICON_EXAMPLES } from '@clr/examples/icon';

import { IconShapesComponent } from './icon-shapes/icon-shapes.component';
import { AiSkillComponent } from '../../../shared/ai-skill/ai-skill.component';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { ClarityDocComponent } from '../clarity-doc';

const ICONS_IMPORT_EXAMPLE = `
import { ClarityIcons, userIcon } from '@clr/angular/icon';

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

const CUSTOM_ALIASES_TEMPLATE = `
<h3>Custom Aliases</h3>
<p>
  You can create your own aliases for any registered icon using
  <code>ClarityIcons.addAliases()</code>
  . This lets you use domain-specific names that make sense in your application.
</p>

<div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap; padding: 16px">
  <div style="text-align: center">
    <clr-icon shape="home" size="lg"></clr-icon>
    <div>home (original)</div>
  </div>
  <div style="text-align: center">
    <clr-icon shape="homepage" size="lg"></clr-icon>
    <div>homepage (custom alias)</div>
  </div>
  <div style="text-align: center">
    <clr-icon shape="dashboard" size="lg"></clr-icon>
    <div>dashboard (custom alias)</div>
  </div>
</div>

<div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap; padding: 16px">
  <div style="text-align: center">
    <clr-icon shape="user" size="lg"></clr-icon>
    <div>user (original)</div>
  </div>
  <div style="text-align: center">
    <clr-icon shape="profile" size="lg"></clr-icon>
    <div>profile (custom alias)</div>
  </div>
  <div style="text-align: center">
    <clr-icon shape="account" size="lg"></clr-icon>
    <div>account (custom alias)</div>
  </div>
</div>
`;

const CUSTOM_ALIASES_CLASS = `
import { Component } from '@angular/core';
import { ClarityIcons, ClrIcon, homeIcon, userIcon } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  imports: [ClrIcon],
})
export class ExampleComponent {
  constructor() {
    ClarityIcons.addIcons(homeIcon, userIcon);

    ClarityIcons.addAliases(['home', ['homepage', 'dashboard']], ['user', ['profile', 'account']]);
  }
}
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
    IconShapesComponent,
    StackblitzExampleComponent,
    DocExampleComponent,
    AiSkillComponent,
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

  readonly examples = ICON_EXAMPLES;

  customAliasesTemplate = CUSTOM_ALIASES_TEMPLATE;
  customAliasesClass = CUSTOM_ALIASES_CLASS;

  constructor() {
    super('icons');
  }
}

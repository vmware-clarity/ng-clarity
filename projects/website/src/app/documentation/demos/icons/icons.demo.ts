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
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
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

const BASIC_ICONS_TEMPLATE = `
<h3>Basic Icon Usage</h3>
<p>Register icons individually and use them by their shape name.</p>

<div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap; padding: 16px">
  <div style="text-align: center">
    <clr-icon shape="home" size="lg"></clr-icon>
    <div>home</div>
  </div>
  <div style="text-align: center">
    <clr-icon shape="cog" size="lg"></clr-icon>
    <div>cog</div>
  </div>
  <div style="text-align: center">
    <clr-icon shape="user" size="lg"></clr-icon>
    <div>user</div>
  </div>
  <div style="text-align: center">
    <clr-icon shape="bell" size="lg"></clr-icon>
    <div>bell</div>
  </div>
  <div style="text-align: center">
    <clr-icon shape="search" size="lg"></clr-icon>
    <div>search</div>
  </div>
</div>
`;

const BASIC_ICONS_CLASS = `
import { Component } from '@angular/core';
import { ClarityIcons, ClrIcon, homeIcon, cogIcon, userIcon, bellIcon, searchIcon } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  imports: [ClrIcon],
})
export class ExampleComponent {
  constructor() {
    ClarityIcons.addIcons(homeIcon, cogIcon, userIcon, bellIcon, searchIcon);
  }
}
`;

const BUILTIN_ALIASES_TEMPLATE = `
<h3>Built-in Aliases</h3>
<p>
  Many Clarity icons come with pre-defined aliases. For example, the "home" icon is also available as
  "house", and the "cog" icon as "settings". Once you load an icon collection, all its built-in aliases
  are automatically registered.
</p>

<table class="table">
  <thead>
    <tr>
      <th class="left">Icon</th>
      <th class="left">Original Name</th>
      <th class="left">Alias Name</th>
      <th class="left">Rendered via Alias</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="left"><clr-icon shape="home" size="md"></clr-icon></td>
      <td class="left">home</td>
      <td class="left">house</td>
      <td class="left"><clr-icon shape="house" size="md"></clr-icon></td>
    </tr>
    <tr>
      <td class="left"><clr-icon shape="cog" size="md"></clr-icon></td>
      <td class="left">cog</td>
      <td class="left">settings</td>
      <td class="left"><clr-icon shape="settings" size="md"></clr-icon></td>
    </tr>
    <tr>
      <td class="left"><clr-icon shape="times" size="md"></clr-icon></td>
      <td class="left">times</td>
      <td class="left">close</td>
      <td class="left"><clr-icon shape="close" size="md"></clr-icon></td>
    </tr>
    <tr>
      <td class="left"><clr-icon shape="user" size="md"></clr-icon></td>
      <td class="left">user</td>
      <td class="left">avatar</td>
      <td class="left"><clr-icon shape="avatar" size="md"></clr-icon></td>
    </tr>
    <tr>
      <td class="left"><clr-icon shape="pencil" size="md"></clr-icon></td>
      <td class="left">pencil</td>
      <td class="left">edit</td>
      <td class="left"><clr-icon shape="edit" size="md"></clr-icon></td>
    </tr>
  </tbody>
</table>
`;

const BUILTIN_ALIASES_CLASS = `
import { Component } from '@angular/core';
import { ClrIcon, loadCoreIconSet, loadEssentialIconSet } from '@clr/angular/icon';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  imports: [ClrIcon],
})
export class ExampleComponent {
  constructor() {
    loadCoreIconSet();
    loadEssentialIconSet();
  }
}
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
import { ClarityIcons, ClrIconModule, homeIcon, userIcon } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  imports: [ClrIconModule],
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
    ClrIconModule,
    IconShapesComponent,
    StackblitzExampleComponent,
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

  basicIconsTemplate = BASIC_ICONS_TEMPLATE;
  basicIconsClass = BASIC_ICONS_CLASS;

  builtinAliasesTemplate = BUILTIN_ALIASES_TEMPLATE;
  builtinAliasesClass = BUILTIN_ALIASES_CLASS;

  customAliasesTemplate = CUSTOM_ALIASES_TEMPLATE;
  customAliasesClass = CUSTOM_ALIASES_CLASS;

  constructor() {
    super('icons');
  }
}

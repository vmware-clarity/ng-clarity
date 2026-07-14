/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRESETS, ThemePreset } from '@clr/addons/theme-builder';

import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { ClarityDocComponent } from '../clarity-doc';

const DEFAULT_HTML = `
<clr-theme-builder [presets]="presets" (generatedCSS)="generatedCss = $event"></clr-theme-builder>

<pre>{{ generatedCss }}</pre>
`;

const DEFAULT_TS = `
import { Component } from '@angular/core';
import { PRESETS, ThemeBuilderComponent, ThemePreset } from '@clr/addons/theme-builder';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  standalone: true,
  imports: [ThemeBuilderComponent],
})
export class ExampleComponent {
  readonly presets: ThemePreset[] = PRESETS;

  generatedCss = '';
}
`;

@Component({
  selector: 'clr-theme-builder-addon-demo',
  templateUrl: './theme-builder.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [DocTabsComponent, DocTabComponent, StackblitzExampleComponent, RouterLink],
})
export class ThemeBuilderAddonDemo extends ClarityDocComponent {
  defaultHtml = DEFAULT_HTML;
  defaultTs = DEFAULT_TS;

  readonly presets: ThemePreset[] = PRESETS;

  generatedCss = '';

  constructor() {
    super('theme-builder');
  }
}

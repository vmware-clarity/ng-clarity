/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { THEME_BUILDER_EXAMPLES } from '@clr/examples/theme-builder';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-theme-builder-addon-demo',
  templateUrl: './theme-builder.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [DocTabsComponent, DocTabComponent, DocExampleComponent, RouterLink],
})
export class ThemeBuilderAddonDemo extends ClarityDocComponent {
  readonly examples = THEME_BUILDER_EXAMPLES;

  constructor() {
    super('theme-builder');
  }
}

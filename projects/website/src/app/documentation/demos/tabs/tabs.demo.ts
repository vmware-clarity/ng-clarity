/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ClarityDocComponent } from '../clarity-doc';
import { TabsAngularDemo } from './tabs-angular';
import { TabsAngularActionsButtonDemo } from './tabs-angular-actions-button';
import { TabsAngularDynamicSelectionDemo } from './tabs-angular-dynamic-selection';
import { TabsAngularOverflowDemo } from './tabs-angular-overflow';
import { TabsAngularSimpleDemo } from './tabs-angular-simple';
import { TabsAngularVerticalDemo } from './tabs-angular-vertical';
import { TabsStaticDemo } from './tabs-static';
import { TabsStaticVerticalDemo } from './tabs-static-vertical';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';

@Component({
  selector: 'clr-tabs-demo',
  templateUrl: './tabs.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    TabsAngularSimpleDemo,
    TabsAngularDynamicSelectionDemo,
    TabsAngularDemo,
    TabsAngularOverflowDemo,
    TabsAngularVerticalDemo,
    TabsAngularActionsButtonDemo,
    TabsStaticDemo,
    TabsStaticVerticalDemo,
    StyleDocsComponent,
    RouterLink,
  ],
})
export class TabsDemo extends ClarityDocComponent {
  constructor() {
    super('tabs');
  }
}

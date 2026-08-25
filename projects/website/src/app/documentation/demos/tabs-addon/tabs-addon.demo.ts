/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppfxTabsModule } from '@clr/addons/tabs';
import { ClarityModule } from '@clr/angular';

import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { ClarityDocComponent } from '../clarity-doc';
import { DisabledTabsDemoComponent } from './ng/disabled-tabs';
import { HorizontalTabsDemoComponent } from './ng/horizontal-tabs';
import { SecondaryTabsDemoComponent } from './ng/secondary-tabs';
import { VerticalTabsDemoComponent } from './ng/vertical-tabs';

const DisabledTabsHtml = require('!raw-loader!./ng/disabled-tabs.html').default;
const DisabledTabsTs = require('!raw-loader!./ng/disabled-tabs.ts').default;
const HorizontalTabsHtml = require('!raw-loader!./ng/horizontal-tabs.html').default;
const HorizontalTabsTs = require('!raw-loader!./ng/horizontal-tabs.ts').default;
const SecondaryTabsHtml = require('!raw-loader!./ng/secondary-tabs.html').default;
const SecondaryTabsTs = require('!raw-loader!./ng/secondary-tabs.ts').default;
const VerticalTabsHtml = require('!raw-loader!./ng/vertical-tabs.html').default;
const VerticalTabsTs = require('!raw-loader!./ng/vertical-tabs.ts').default;

const ModuleImportTs = `
import { AppfxTabsModule } from '@clr/addons/tabs';
import { AppfxWorkflowCoreModule } from '@clr/addons/var';

@NgModule({
  imports: [AppfxTabsModule, AppfxWorkflowCoreModule],
})
export class MyModule {}
`;

@Component({
  selector: 'app-tabs-addon-demo',
  templateUrl: './tabs-addon.demo.html',
  styleUrls: ['./tabs-addon.demo.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    RouterModule,
    AppfxTabsModule,
    CodeSnippetComponent,
    DocTabComponent,
    DocTabsComponent,
    StackblitzExampleComponent,
    HorizontalTabsDemoComponent,
    VerticalTabsDemoComponent,
    SecondaryTabsDemoComponent,
    DisabledTabsDemoComponent,
  ],
})
export class TabsAddonDemoComponent extends ClarityDocComponent {
  readonly moduleImportTs = ModuleImportTs;
  readonly horizontalTabsHtml = HorizontalTabsHtml;
  readonly horizontalTabsTs = HorizontalTabsTs;
  readonly verticalTabsHtml = VerticalTabsHtml;
  readonly verticalTabsTs = VerticalTabsTs;
  readonly secondaryTabsHtml = SecondaryTabsHtml;
  readonly secondaryTabsTs = SecondaryTabsTs;
  readonly disabledTabsHtml = DisabledTabsHtml;
  readonly disabledTabsTs = DisabledTabsTs;

  constructor() {
    super('tabs-addon');
  }
}

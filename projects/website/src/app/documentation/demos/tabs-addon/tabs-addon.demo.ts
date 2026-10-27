/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { TABS_ADDON_EXAMPLES } from '@clr/examples/tabs-addon';

import { AiSkillComponent } from '../../../shared/ai-skill/ai-skill.component';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ClarityDocComponent } from '../clarity-doc';

const ModuleImportTs = `
import { AppfxWorkflowCoreModule } from '@clr/addons/var';

@NgModule({
  imports: [AppfxTabsModule, AppfxWorkflowCoreModule],
})
export class MyModule {}
`;

@Component({
  selector: 'app-tabs-addon-demo',
  templateUrl: './tabs-addon.demo.html',
  standalone: true,
  imports: [
    CommonModule,
    ClarityModule,
    RouterModule,
    CodeSnippetComponent,
    DocTabComponent,
    DocTabsComponent,
    DocExampleComponent,
    AiSkillComponent,
  ],
})
export class TabsAddonDemoComponent extends ClarityDocComponent {
  readonly moduleImportTs = ModuleImportTs;
  readonly examples = TABS_ADDON_EXAMPLES;

  constructor() {
    super('advanced-tabs');
  }
}

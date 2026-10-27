/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { STEPPER_ADDON_EXAMPLES } from '@clr/examples/stepper-addon';

import { AiSkillComponent } from '../../../shared/ai-skill/ai-skill.component';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ClarityDocComponent } from '../clarity-doc';

const ModuleImportTs = `
import { AppfxStepperModule } from '@clr/addons/stepper';
import { AppfxWorkflowCoreModule } from '@clr/addons/var';

@NgModule({
  imports: [AppfxStepperModule, AppfxWorkflowCoreModule],
})
export class MyModule {}
`;

@Component({
  selector: 'clr-stepper-addon-demo',
  standalone: true,
  templateUrl: './stepper-addon.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    CodeSnippetComponent,
    DocExampleComponent,
    DocTabComponent,
    DocTabsComponent,
    RouterModule,
    AiSkillComponent,
  ],
})
export class StepperAddonDemoComponent extends ClarityDocComponent {
  readonly examples = STEPPER_ADDON_EXAMPLES;
  readonly moduleImportTs = ModuleImportTs;

  constructor() {
    super('advanced-stepper');
  }
}

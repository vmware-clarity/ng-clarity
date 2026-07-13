/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZoomLevelService } from '@clr/addons/a11y';
import { WorkflowConfigurationService } from '@clr/addons/var';
import { AppfxWizardModule } from '@clr/addons/wizard';
import { ClarityModule } from '@clr/angular';

import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';
import { SampleStepperComponent } from './sample/sample-stepper.component';
import { SampleWizardComponent } from './sample/sample-wizard.component';
import { SampleWorkflowService } from './sample/sample-workflow.service';

const BasicWizardHtml = require('!raw-loader!./ng/basic-wizard.html').default;
const BasicWizardTs = require('!raw-loader!./ng/basic-wizard.ts').default;

const ModuleImportTs = `
import { AppfxWizardModule } from '@clr/addons/wizard';
import { AppfxWorkflowCoreModule } from '@clr/addons/var';

@NgModule({
  imports: [AppfxWizardModule, AppfxWorkflowCoreModule],
})
export class MyModule {}
`;

@Component({
  selector: 'clr-wizard-addon-demo',
  standalone: true,
  templateUrl: './wizard-addon.demo.html',
  styleUrl: './wizard-addon.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  providers: [SampleWorkflowService, ZoomLevelService],
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    AppfxWizardModule,
    CodeSnippetComponent,
    DocTabComponent,
    DocTabsComponent,
    StackblitzExampleComponent,
    ThemedImageComponent,
    SampleWizardComponent,
    SampleStepperComponent,
  ],
})
export class WizardAddonDemoComponent extends ClarityDocComponent {
  readonly moduleImportTs = ModuleImportTs;
  readonly basicWizardHtml = BasicWizardHtml;
  readonly basicWizardTs = BasicWizardTs;

  readonly vcMoRef = 'demo-datacenter-ref';
  readonly supportedWizardSizes = ['md', 'lg', 'xl', 'full-screen'];

  simpleWizardOpened = false;
  longNavTitle = false;
  showSummaryPage = true;
  asyncErrorOnSubmit = false;
  useCustomFooter = false;
  selectedWizardSize = 'xl';

  #inlineMode = false;

  constructor(readonly configurationService: WorkflowConfigurationService) {
    super('wizard-addon');
  }

  get inlineMode(): boolean {
    return this.#inlineMode;
  }
  set inlineMode(value: boolean) {
    this.#inlineMode = value;
    this.simpleWizardOpened = false;
  }

  openSimpleWizard(): void {
    this.simpleWizardOpened = true;
  }

  closeSimpleWizard(): void {
    this.simpleWizardOpened = false;
  }
}

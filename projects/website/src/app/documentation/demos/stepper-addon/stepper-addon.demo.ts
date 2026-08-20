/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppfxStepperModule } from '@clr/addons/stepper';
import { Step } from '@clr/addons/var';
import { ClarityModule } from '@clr/angular';

import {
  ProjectNameModel,
  ProjectWorkflowModel,
  StepperStep1Component,
  StepperStep2Component,
  TeamModel,
} from './ng/basic-stepper';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { ClarityDocComponent } from '../clarity-doc';

const BasicStepperHtml = require('!raw-loader!./ng/basic-stepper.html').default;
const BasicStepperTs = require('!raw-loader!./ng/basic-stepper.ts').default;

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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    AppfxStepperModule,
    CodeSnippetComponent,
    DocTabComponent,
    DocTabsComponent,
    StackblitzExampleComponent,
    StepperStep1Component,
    StepperStep2Component,
    RouterModule,
  ],
})
export class StepperAddonDemoComponent extends ClarityDocComponent implements OnInit {
  model = new ProjectWorkflowModel();
  steps: Step[];
  submitted = false;
  result: { name: string; team: string } | null = null;

  readonly moduleImportTs = ModuleImportTs;
  readonly basicStepperHtml = BasicStepperHtml;
  readonly basicStepperTs = BasicStepperTs;

  constructor() {
    super('stepper-addon');
  }

  ngOnInit() {
    this.initSteps();
  }

  onFinish() {
    this.result = { name: this.model.name.value, team: this.model.team.value };
    this.submitted = true;
  }

  reset() {
    this.submitted = false;
    this.result = null;
    this.model = new ProjectWorkflowModel();
    this.initSteps();
  }

  private initSteps() {
    this.steps = [
      {
        title: 'Project Name',
        description: 'Enter a unique name',
        componentClass: StepperStep1Component,
        model: new ProjectNameModel(),
      },
      {
        title: 'Assign Team',
        description: 'Select the owner team',
        componentClass: StepperStep2Component,
        model: new TeamModel(),
      },
    ];
  }
}

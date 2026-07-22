/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppfxStepperModule } from '@clr/addons/stepper';
import { Step, StepModel, StepModelHolder, Var } from '@clr/addons/var';
import { ClarityModule } from '@clr/angular';

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

class ProjectNameModel implements StepModel {
  name = Var.of<string>('');
  readyToComplete = true;
}

@Component({
  selector: 'clr-stp-doc-step1',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="clr-form-group">
      <label class="clr-control-label" for="proj-n">Project Name</label>
      <input id="proj-n" type="text" class="clr-input" [(ngModel)]="model.name.value" />
    </div>
  `,
})
class StepperDocStep1Component implements StepModelHolder {
  model: ProjectNameModel;
}

class TeamModel implements StepModel {
  team = Var.of<string>('frontend');
  readyToComplete = true;
}

@Component({
  selector: 'clr-stp-doc-step2',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="clr-select-wrapper">
      <select class="clr-select" [(ngModel)]="model.team.value">
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
        <option value="platform">Platform</option>
      </select>
    </div>
  `,
})
class StepperDocStep2Component implements StepModelHolder {
  model: TeamModel;
}

class ProjectWorkflowModel {
  name = Var.of<string>('');
  team = Var.of<string>('frontend');
}

@Component({
  selector: 'clr-stepper-addon-demo',
  standalone: true,
  templateUrl: './stepper-addon.demo.html',
  styleUrl: './stepper-addon.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    AppfxStepperModule,
    CodeSnippetComponent,
    DocTabComponent,
    DocTabsComponent,
    StackblitzExampleComponent,
    StepperDocStep1Component,
    StepperDocStep2Component,
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
        componentClass: StepperDocStep1Component,
        model: new ProjectNameModel(),
      },
      {
        title: 'Assign Team',
        description: 'Select the owner team',
        componentClass: StepperDocStep2Component,
        model: new TeamModel(),
      },
    ];
  }
}

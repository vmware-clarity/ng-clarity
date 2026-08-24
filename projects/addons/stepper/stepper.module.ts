/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppfxA11yModule } from '@clr/addons/a11y';
import { AppfxPropertyViewModule } from '@clr/addons/property-view';
import { AppfxWorkflowCoreModule } from '@clr/addons/var';
import { ClrStepperModule } from '@clr/angular/stepper';

import { StepperStateService } from './state/stepper-state.service';
import { StepperComponent } from './stepper.component';
import { SummaryService } from './summary/summary.service';

const clarityDependencies = [ClrStepperModule];
const appfxDependencies = [AppfxPropertyViewModule, AppfxA11yModule, AppfxWorkflowCoreModule];

@NgModule({
  imports: [...appfxDependencies, ...clarityDependencies, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [StepperComponent],
  providers: [StepperStateService, SummaryService],
  exports: [StepperComponent],
})
export class AppfxStepperModule {}

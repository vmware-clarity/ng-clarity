/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertyViewModule } from '@clr/addons/property-view';
import { AppfxWorkflowCoreModule } from '@clr/addons/var';
import { ClrIcon } from '@clr/angular/icon';
import { ClrWizardModule } from '@clr/angular/wizard';

import { SummaryComponent } from './summary/summary.component';
import { WizardComponent } from './wizard.component';

const clarityDependencies = [ClrWizardModule, ClrIcon];
const appfxDependencies = [PropertyViewModule, AppfxWorkflowCoreModule];

@NgModule({
  imports: [...appfxDependencies, ...clarityDependencies, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [SummaryComponent, WizardComponent],
  exports: [WizardComponent],
})
export class AppfxWizardModule {}

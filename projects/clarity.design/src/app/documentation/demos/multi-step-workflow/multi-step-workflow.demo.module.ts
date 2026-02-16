/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { ComponentTableDemo } from './component-table';
import { MultiStepWorkflowDemo } from './multi-step-workflow.demo';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { SiteFooterComponent } from '../../../shared/site-footer/site-footer.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    RouterModule.forChild([{ path: '', component: MultiStepWorkflowDemo }]),
    DocTabsModule,
    DoDontComponent,
    SiteFooterComponent,
    ThemedImageComponent,
  ],
  declarations: [MultiStepWorkflowDemo, ComponentTableDemo],
  exports: [MultiStepWorkflowDemo],
})
export class MultiStepWorkflowDemoModule {}

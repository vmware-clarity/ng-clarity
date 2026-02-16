/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { AngularStepperApiDemo } from './angular-stepper-api.demo';
import { AngularStepperReactiveDemo } from './angular-stepper-reactive.demo';
import { AngularStepperTemplateDemo } from './angular-stepper-template.demo';
import { StepperDemo } from './stepper.demo';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { LinkCardsComponent } from '../../../shared/link-cards/link-cards.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    DocTabsModule,
    RouterModule.forChild([{ path: '', component: StepperDemo }]),
    DoDontComponent,
    ThemedImageComponent,
    StackblitzExampleComponent,
    LinkCardsComponent,
  ],
  declarations: [StepperDemo, AngularStepperReactiveDemo, AngularStepperTemplateDemo, AngularStepperApiDemo],
})
export class StepperDemoModule {}

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

import { OnboardingDemo } from './onboarding.demo';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { UseDontUseComponent } from '../../../shared/use-dont-use/use-dont-use.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    DocTabsModule,
    RouterModule.forChild([{ path: '', component: OnboardingDemo }]),
    UseDontUseComponent,
    ThemedImageComponent,
  ],
  declarations: [OnboardingDemo],
  exports: [OnboardingDemo],
})
export class OnboardingDemoModule {}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { ProgressBarAnimationsDemo } from './progress-bar-animations';
import { ProgressBarCardsDemo } from './progress-bar-cards';
import { ProgressBarColorsDemo } from './progress-bar-colors';
import { ProgressBarComponentDemo } from './progress-bar-component.demo';
import { ProgressBarExamplesDemo } from './progress-bar-examples';
import { ProgressBarInlineDemo } from './progress-bar-inline';
import { ProgressBarInlineCardsDemo } from './progress-bar-inline-cards';
import { ProgressBarLoopDemo } from './progress-bar-loop';
import { ProgressBarStaticDemo } from './progress-bar-static';
import { ProgressBarStaticCardsDemo } from './progress-bar-static-cards';
import { ProgressBarStoryDemo } from './progress-bar-story';
import { ProgressBarsDemo } from './progress-bars.demo';
import { AnimatedExampleComponent } from '../../../shared/animated-example/animated-example.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    DocTabsModule,
    RouterModule.forChild([{ path: '', component: ProgressBarsDemo }]),
    StyleDocsComponent,
    AnimatedExampleComponent,
    StackblitzExampleComponent,
    ProgressBarExamplesDemo,
    ProgressBarColorsDemo,
    ProgressBarAnimationsDemo,
    ProgressBarCardsDemo,
    ProgressBarLoopDemo,
    ProgressBarStaticDemo,
    ProgressBarStaticCardsDemo,
    ProgressBarInlineDemo,
    ProgressBarInlineCardsDemo,
    ProgressBarComponentDemo,
    ProgressBarStoryDemo,
    ProgressBarsDemo,
  ],
  exports: [ProgressBarsDemo],
})
export class ProgressBarsDemoModule {}

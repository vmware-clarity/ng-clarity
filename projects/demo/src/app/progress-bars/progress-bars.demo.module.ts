/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { ProgressBarAnimationsDemo } from './progress-bar-animations';
import { ProgressBarCardsDemo } from './progress-bar-cards';
import { ProgressBarComponentDemo } from './progress-bar-component';
import { ProgressBarInlineDemo } from './progress-bar-inline';
import { ProgressBarInlineCardsDemo } from './progress-bar-inline-cards';
import { ProgressBarLoopDemo } from './progress-bar-loop';
import { ProgressBarStaticDemo } from './progress-bar-static';
import { ProgressBarsDemo } from './progress-bars.demo';
import { ROUTING } from './progress-bars.demo.routing';

@NgModule({
  imports: [CommonModule, ClarityModule, ROUTING],
  declarations: [
    ProgressBarAnimationsDemo,
    ProgressBarCardsDemo,
    ProgressBarLoopDemo,
    ProgressBarsDemo,
    ProgressBarStaticDemo,
    ProgressBarInlineDemo,
    ProgressBarInlineCardsDemo,
    ProgressBarComponentDemo,
  ],
  exports: [
    ProgressBarAnimationsDemo,
    ProgressBarCardsDemo,
    ProgressBarLoopDemo,
    ProgressBarsDemo,
    ProgressBarStaticDemo,
    ProgressBarInlineDemo,
    ProgressBarInlineCardsDemo,
    ProgressBarComponentDemo,
  ],
})
export class ProgressBarsDemoModule {}

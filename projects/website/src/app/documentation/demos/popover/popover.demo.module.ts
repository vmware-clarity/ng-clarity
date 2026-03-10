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

import { PopoverBasicDemo } from './popover-basic';
import { PopoverFallbackPositionsDemo } from './popover-fallback-positions';
import { PopoverPositionsDemo } from './popover-positions';
import { PopoverScrollToCloseDemo } from './popover-scroll-to-close';
import { PopoverDemo } from './popover.demo';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    RouterModule.forChild([{ path: '', component: PopoverDemo }]),
    DocTabsModule,
    StackblitzExampleComponent,
    PopoverBasicDemo,
    PopoverPositionsDemo,
    PopoverFallbackPositionsDemo,
    PopoverScrollToCloseDemo,
    PopoverDemo,
  ],
  exports: [PopoverDemo],
})
export class PopoverDemoModule {}

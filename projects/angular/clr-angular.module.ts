/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';
import { ClrButtonModule } from '@clr/angular/button';
import { ClrDataModule } from '@clr/angular/data';
import { ClrEmphasisModule } from '@clr/angular/emphasis';
import { ClrFormsModule } from '@clr/angular/forms';
import { ClrIcon, ClrIconModule } from '@clr/angular/icon';
import { ClrLayoutModule } from '@clr/angular/layout';
import { ClrModalModule, ClrSidePanelModule } from '@clr/angular/modal';
import { ClrPopoverModule } from '@clr/angular/popover';
import { ÇlrClrPopoverModuleNext } from '@clr/angular/popover/common';
import { ClrProgressBarModule } from '@clr/angular/progress/progress-bars';
import { ClrSpinnerModule } from '@clr/angular/progress/spinner';
import { ClrStepperModule } from '@clr/angular/stepper';
import { ClrTimelineModule } from '@clr/angular/timeline';
import { ClrConditionalModule, ClrFocusOnViewInitModule, ClrLoadingModule } from '@clr/angular/utils';
import { ClrWizardModule } from '@clr/angular/wizard';

@NgModule({
  imports: [ClrIcon],
  exports: [
    ClrEmphasisModule,
    ClrDataModule,
    ClrIcon,
    ClrIconModule,
    ClrModalModule,
    ClrLoadingModule,
    ClrConditionalModule,
    ClrFocusOnViewInitModule,
    ClrButtonModule,
    ClrFormsModule,
    ClrLayoutModule,
    ClrPopoverModule,
    ClrWizardModule,
    ClrSidePanelModule,
    ClrStepperModule,
    ClrSpinnerModule,
    ClrProgressBarModule,
    ÇlrClrPopoverModuleNext,
    ClrTimelineModule,
  ],
})
export class ClarityModule {}

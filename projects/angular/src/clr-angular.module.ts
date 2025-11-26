/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';
import { ClrStepperModule } from '@clr/angular/src/accordion';
import { ClrButtonModule } from '@clr/angular/src/button';
import { ClrDataModule } from '@clr/angular/src/data';
import { ClrEmphasisModule } from '@clr/angular/src/emphasis';
import { ClrFormsModule } from '@clr/angular/src/forms';
import { ClrIcon, ClrIconModule } from '@clr/angular/src/icon';
import { ClrLayoutModule } from '@clr/angular/src/layout';
import { ClrModalModule, ClrSidePanelModule } from '@clr/angular/src/modal';
import { ClrPopoverModule } from '@clr/angular/src/popover';
import { ÇlrClrPopoverModuleNext } from '@clr/angular/src/popover/common';
import { ClrProgressBarModule } from '@clr/angular/src/progress/progress-bars';
import { ClrSpinnerModule } from '@clr/angular/src/progress/spinner';
import { ClrTimelineModule } from '@clr/angular/src/timeline';
import { ClrConditionalModule, ClrFocusOnViewInitModule, ClrLoadingModule } from '@clr/angular/src/utils';
import { ClrWizardModule } from '@clr/angular/src/wizard';

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

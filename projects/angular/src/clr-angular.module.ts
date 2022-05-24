/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';

import { ClrStepperModule } from './accordion/stepper/stepper.module';
import { ClrButtonModule } from './button/button.module';
import { ClrDataModule } from './data/data.module';
import { ClrEmphasisModule } from './emphasis/emphasis.module';
import { ClrFormsModule } from './forms/forms.module';
import { ClrIconModule } from './icon/icon.module';
import { ClrLayoutModule } from './layout/layout.module';
import { ClrModalModule } from './modal/modal.module';
import { ClrPopoverModule } from './popover/popover.module';
import { ClrProgressBarModule } from './progress/progress-bars/progress-bar.module';
import { ClrSpinnerModule } from './progress/spinner/spinner.module';
import { ClrTimelineModule } from './timeline/timeline.module';
import { ClrConditionalModule } from './utils/conditional/conditional.module';
import { ClrDragAndDropModule } from './utils/drag-and-drop/drag-and-drop.module';
import { ClrFocusTrapModule } from './utils/focus-trap/focus-trap.module';
import { ClrFocusOnViewInitModule } from './utils/focus/focus-on-view-init/focus-on-view-init.module';
import { ClrLoadingModule } from './utils/loading/loading.module';
import { ClrPopoverModuleNext } from './utils/popover/popover.module';
import { ClrWizardModule } from './wizard/wizard.module';

// Register the icon library
import '@cds/core/icon/register';

@NgModule({
  exports: [
    ClrEmphasisModule,
    ClrDataModule,
    ClrIconModule,
    ClrModalModule,
    ClrLoadingModule,
    ClrConditionalModule,
    ClrFocusTrapModule,
    ClrFocusOnViewInitModule,
    ClrButtonModule,
    ClrFormsModule,
    ClrLayoutModule,
    ClrPopoverModule,
    ClrWizardModule,
    ClrDragAndDropModule,
    ClrStepperModule,
    ClrSpinnerModule,
    ClrProgressBarModule,
    ClrPopoverModuleNext,
    ClrTimelineModule,
  ],
})
export class ClarityModule {}

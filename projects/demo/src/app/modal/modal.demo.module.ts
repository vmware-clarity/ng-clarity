/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { CdkTrapFocusModule } from '@clr/angular/utils';

import { ModalAngularShowDemo } from './modal-angular-show';
import { ModalAngularSizeDemo } from './modal-angular-size';
import { ModalFormDemo } from './modal-form.demo';
import { ModalMaxHeightDemo } from './modal-max-height';
import { ModalStaticOldDemo } from './modal-static-old';
import { ModalTrapDemo } from './modal-trap';
import { ModalDemo } from './modal.demo';
import { ROUTING } from './modal.demo.routing';

@NgModule({
  imports: [CommonModule, CdkTrapFocusModule, ClarityModule, ROUTING, FormsModule],
  declarations: [
    ModalDemo,
    ModalStaticOldDemo,
    ModalAngularShowDemo,
    ModalAngularSizeDemo,
    ModalMaxHeightDemo,
    ModalTrapDemo,
    ModalFormDemo,
  ],
  exports: [
    ModalDemo,
    ModalStaticOldDemo,
    ModalAngularShowDemo,
    ModalAngularSizeDemo,
    ModalMaxHeightDemo,
    ModalTrapDemo,
    ModalFormDemo,
  ],
})
export class ModalDemoModule {}

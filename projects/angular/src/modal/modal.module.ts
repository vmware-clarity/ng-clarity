/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ClarityIcons, windowCloseIcon } from '@cds/core/icon';

import { ClrIconModule } from '../icon/icon.module';
import { CdkTrapFocusModule } from '../utils/cdk/cdk-trap-focus.module';
import { ClrModal } from './modal';
import { ClrModalBody } from './modal-body';
import { ClrModalConfigurationService } from './modal-configuration.service';

export const CLR_MODAL_DIRECTIVES: Type<any>[] = [ClrModal, ClrModalBody];

@NgModule({
  imports: [CommonModule, CdkTrapFocusModule, ClrIconModule],
  declarations: [CLR_MODAL_DIRECTIVES],
  exports: [CLR_MODAL_DIRECTIVES, ClrIconModule],
  providers: [ClrModalConfigurationService],
})
export class ClrModalModule {
  constructor() {
    ClarityIcons.addIcons(windowCloseIcon);
  }
}

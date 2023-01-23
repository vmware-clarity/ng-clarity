/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
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

export const CLR_MODAL_DIRECTIVES: Type<any>[] = [ClrModal, ClrModalBody];

@NgModule({
  imports: [CommonModule, CdkTrapFocusModule, ClrIconModule],
  declarations: [CLR_MODAL_DIRECTIVES],
  exports: [CLR_MODAL_DIRECTIVES, ClrIconModule],
})
export class ClrModalModule {
  constructor() {
    ClarityIcons.addIcons(windowCloseIcon);
  }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ClarityIcons, ClrIcon, windowCloseIcon } from '@clr/angular/src/icon';
import { CdkTrapFocusModule } from '@clr/angular/src/utils';

import { ClrModal } from './modal';
import { ClrModalBody } from './modal-body';
import { ClrModalHostComponent } from './modal-host.component';

export const CLR_MODAL_DIRECTIVES: Type<any>[] = [ClrModal, ClrModalBody, ClrModalHostComponent];

@NgModule({
  imports: [CommonModule, CdkTrapFocusModule, ClrIcon],
  declarations: [CLR_MODAL_DIRECTIVES],
  exports: [CLR_MODAL_DIRECTIVES, ClrIcon],
})
export class ClrModalModule {
  constructor() {
    ClarityIcons.addIcons(windowCloseIcon);
  }
}

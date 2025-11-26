/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ClrIcon } from '@clr/angular/src/icon';
import { CdkTrapFocusModule } from '@clr/angular/src/utils';

import { ClrModalModule } from './modal.module';
import { ClrSidePanel } from './side-panel';

export const CLR_SIDEPANEL_DIRECTIVES: Type<any>[] = [ClrSidePanel];

@NgModule({
  imports: [CommonModule, CdkTrapFocusModule, ClrIcon, ClrModalModule],
  declarations: [CLR_SIDEPANEL_DIRECTIVES],
  exports: [CLR_SIDEPANEL_DIRECTIVES, ClrModalModule, ClrIcon],
})
export class ClrSidePanelModule {}

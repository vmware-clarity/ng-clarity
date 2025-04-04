/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { ClrIconModule } from '../../icon/icon.module';
import { ClrPopoverModuleNext } from '../../utils/popover/popover.module';
import { ClrButton } from './button';
import { ClrButtonGroup } from './button-group';

export const CLR_BUTTON_GROUP_DIRECTIVES: Type<any>[] = [ClrButton, ClrButtonGroup];

@NgModule({
  imports: [CommonModule, ClrIconModule, ClrPopoverModuleNext],
  declarations: [CLR_BUTTON_GROUP_DIRECTIVES],
  exports: [CLR_BUTTON_GROUP_DIRECTIVES],
})
export class ClrButtonGroupModule {}

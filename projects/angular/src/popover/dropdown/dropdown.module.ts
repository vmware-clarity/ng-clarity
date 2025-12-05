/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { ClrDropdown } from './dropdown';
import { ClrDropdownItem } from './dropdown-item';
import { ClrDropdownMenu } from './dropdown-menu';
import { ClrDropdownTrigger } from './dropdown-trigger';
import { ClrIcon } from '../../icon';
import { ClrConditionalModule } from '../../utils/conditional/conditional.module';
import { ClrPopoverModuleNext } from '../common/popover.module';

export const CLR_DROPDOWN_DIRECTIVES: Type<any>[] = [ClrDropdown, ClrDropdownMenu, ClrDropdownTrigger, ClrDropdownItem];

@NgModule({
  imports: [CommonModule, ClrPopoverModuleNext, ClrIcon],
  declarations: [CLR_DROPDOWN_DIRECTIVES],
  exports: [CLR_DROPDOWN_DIRECTIVES, ClrConditionalModule, ClrIcon],
})
export class ClrDropdownModule {}

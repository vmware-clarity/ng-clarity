/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ClrIcon } from '@clr/angular/icon';
import { ClrDropdownModule } from '@clr/angular/popover/dropdown';

import { ClrAriaCurrentLink } from './aria-current-link';
import { ClrHeader } from './header';
import { ClrNavLevel } from './nav-level';

export const CLR_NAVIGATION_DIRECTIVES: Type<any>[] = [ClrHeader, ClrNavLevel, ClrAriaCurrentLink];

@NgModule({
  imports: [CommonModule, ClrIcon, ClrDropdownModule],
  declarations: [CLR_NAVIGATION_DIRECTIVES],
  exports: [CLR_NAVIGATION_DIRECTIVES],
})
export class ClrNavigationModule {}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { ClrAriaCurrentLink } from './aria-current-link';
import { ClrIcon } from '../../icon';
import { MainContainerWillyWonka } from './chocolate/main-container-willy-wonka';
import { NavDetectionOompaLoompa } from './chocolate/nav-detection-oompa-loompa';
import { ClrHeader } from './header';
import { ClrNavLevel } from './nav-level';
import { ClrDropdownModule } from '../../popover/dropdown/dropdown.module';

export const CLR_NAVIGATION_DIRECTIVES: Type<any>[] = [
  ClrHeader,
  ClrNavLevel,
  ClrAriaCurrentLink,
  NavDetectionOompaLoompa,
  MainContainerWillyWonka,
];

@NgModule({
  imports: [CommonModule, ClrIcon, ClrDropdownModule],
  declarations: [CLR_NAVIGATION_DIRECTIVES],
  exports: [CLR_NAVIGATION_DIRECTIVES],
})
export class ClrNavigationModule {}

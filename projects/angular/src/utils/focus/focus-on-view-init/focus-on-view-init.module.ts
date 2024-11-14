/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { ClrFocusOnViewInit } from './focus-on-view-init';
import { FOCUS_ON_VIEW_INIT_PROVIDER } from './focus-on-view-init.provider';

export const FOCUS_ON_VIEW_INIT_DIRECTIVES: Type<any>[] = [ClrFocusOnViewInit];

@NgModule({
  imports: [CommonModule],
  declarations: [FOCUS_ON_VIEW_INIT_DIRECTIVES],
  providers: [FOCUS_ON_VIEW_INIT_PROVIDER],
  exports: [FOCUS_ON_VIEW_INIT_DIRECTIVES],
})
export class ClrFocusOnViewInitModule {}

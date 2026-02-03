/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { OutsideClick } from './outside-click';

export const OUSTIDE_CLICK_DIRECTIVES: Type<any>[] = [OutsideClick];
@NgModule({
  imports: [CommonModule],
  declarations: [OUSTIDE_CLICK_DIRECTIVES],
  exports: [OUSTIDE_CLICK_DIRECTIVES],
})
export class ClrOutsideClickModule {}

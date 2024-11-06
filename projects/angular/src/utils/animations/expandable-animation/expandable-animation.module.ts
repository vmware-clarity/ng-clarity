/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EXPANDABLE_ANIMATION_DIRECTIVES } from './index';

@NgModule({
  imports: [CommonModule],
  declarations: [EXPANDABLE_ANIMATION_DIRECTIVES],
  exports: [EXPANDABLE_ANIMATION_DIRECTIVES],
})
export class ClrExpandableAnimationModule {}

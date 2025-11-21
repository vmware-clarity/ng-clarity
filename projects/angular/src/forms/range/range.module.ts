/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClrRange } from './range';
import { ClrRangeContainer } from './range-container';
import { checkCircleIcon, ClarityIcons, ClrIcon, exclamationCircleIcon } from '../../icon';
import { ClrHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { ClrCommonFormsModule } from '../common/common.module';

@NgModule({
  imports: [CommonModule, ClrCommonFormsModule, ClrHostWrappingModule, ClrIcon],
  declarations: [ClrRange, ClrRangeContainer],
  exports: [ClrCommonFormsModule, ClrRange, ClrRangeContainer],
})
export class ClrRangeModule {
  constructor() {
    ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
  }
}

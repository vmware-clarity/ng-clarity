/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { checkCircleIcon, ClarityIcons, exclamationCircleIcon } from '@cds/core/icon';

import { ClrIconModule } from '../../icon/icon.module';
import { ClrHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { ClrCommonFormsModule } from '../common/common.module';
import { ClrRange } from './range';
import { ClrRangeContainer } from './range-container';

@NgModule({
  imports: [CommonModule, ClrCommonFormsModule, ClrHostWrappingModule, ClrIconModule],
  declarations: [ClrRange, ClrRangeContainer],
  exports: [ClrCommonFormsModule, ClrRange, ClrRangeContainer],
})
export class ClrRangeModule {
  constructor() {
    ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
  }
}

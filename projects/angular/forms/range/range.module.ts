/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrCommonFormsModule } from '@clr/angular/forms/common';
import { ClarityIcons, ClrIcon, errorStandardIcon, successStandardIcon } from '@clr/angular/icon';
import { ClrHostWrappingModule } from '@clr/angular/utils';

import { ClrRange } from './range';
import { ClrRangeContainer } from './range-container';

@NgModule({
  imports: [CommonModule, ClrCommonFormsModule, ClrHostWrappingModule, ClrIcon],
  declarations: [ClrRange, ClrRangeContainer],
  exports: [ClrCommonFormsModule, ClrRange, ClrRangeContainer],
})
export class ClrRangeModule {
  constructor() {
    ClarityIcons.addIcons(successStandardIcon, errorStandardIcon);
  }
}

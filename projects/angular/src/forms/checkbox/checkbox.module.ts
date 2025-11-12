/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClrCheckbox } from './checkbox';
import { ClrCheckboxContainer } from './checkbox-container';
import { ClrCheckboxWrapper } from './checkbox-wrapper';
import { checkCircleIcon, ClarityIcons, exclamationCircleIcon } from '../../icon';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { ClrCommonFormsModule } from '../common/common.module';

@NgModule({
  imports: [CommonModule, ClrIconModule, ClrCommonFormsModule, ClrHostWrappingModule],
  declarations: [ClrCheckbox, ClrCheckboxContainer, ClrCheckboxWrapper],
  exports: [ClrCommonFormsModule, ClrCheckbox, ClrCheckboxContainer, ClrCheckboxWrapper, ClrIconModule],
})
export class ClrCheckboxModule {
  constructor() {
    ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
  }
}

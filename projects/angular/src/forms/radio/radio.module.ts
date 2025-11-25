/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrCommonFormsModule } from '@clr/angular/src/forms/common';
import { checkCircleIcon, ClarityIcons, ClrIcon, exclamationCircleIcon } from '@clr/angular/src/icon';
import { ClrHostWrappingModule } from '@clr/angular/src/utils';

import { ClrRadio } from './radio';
import { ClrRadioContainer } from './radio-container';
import { ClrRadioWrapper } from './radio-wrapper';

@NgModule({
  imports: [CommonModule, ClrCommonFormsModule, ClrHostWrappingModule, ClrIcon],
  declarations: [ClrRadio, ClrRadioContainer, ClrRadioWrapper],
  exports: [ClrCommonFormsModule, ClrRadio, ClrRadioContainer, ClrRadioWrapper],
})
export class ClrRadioModule {
  constructor() {
    ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
  }
}

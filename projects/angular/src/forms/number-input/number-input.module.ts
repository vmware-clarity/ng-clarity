/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrCommonFormsModule } from '@clr/angular/src/forms/common';
import {
  checkCircleIcon,
  ClarityIcons,
  ClrIcon,
  exclamationCircleIcon,
  minusIcon,
  plusIcon,
} from '@clr/angular/src/icon';

import { ClrNumberInput } from './number-input';
import { ClrNumberInputContainer } from './number-input-container';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule],
  declarations: [ClrNumberInput, ClrNumberInputContainer],
  exports: [ClrCommonFormsModule, ClrNumberInput, ClrNumberInputContainer],
})
export class ClrNumberInputModule {
  constructor() {
    ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon, minusIcon, plusIcon);
  }
}

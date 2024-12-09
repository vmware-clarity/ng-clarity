/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { checkCircleIcon, ClarityIcons, exclamationCircleIcon } from '@cds/core/icon';

import { ClrIconModule } from '../../icon/icon.module';
import { ClrCommonFormsModule } from '../common/common.module';
import { ClrNumberPicker } from './number-picker';
import { ClrNumberPickerContainer } from './number-picker-container';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIconModule, ClrCommonFormsModule],
  declarations: [ClrNumberPicker, ClrNumberPickerContainer],
  exports: [ClrCommonFormsModule, ClrNumberPicker, ClrNumberPickerContainer],
})
export class ClrNumberPickerModule {
  constructor() {
    ClarityIcons.addIcons(
      exclamationCircleIcon,
      checkCircleIcon // caret
    );
  }
}

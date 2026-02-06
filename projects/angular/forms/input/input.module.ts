/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClrInput } from './input';
import { ClrInputContainer } from './input-container';
import { checkCircleIcon, ClarityIcons, ClrIcon, exclamationCircleIcon } from '../../icon';
import { ClrCommonFormsModule } from '../common/common.module';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule],
  declarations: [ClrInput, ClrInputContainer],
  exports: [ClrCommonFormsModule, ClrInput, ClrInputContainer],
})
export class ClrInputModule {
  constructor() {
    ClarityIcons.addIcons(
      exclamationCircleIcon,
      checkCircleIcon // caret
    );
  }
}

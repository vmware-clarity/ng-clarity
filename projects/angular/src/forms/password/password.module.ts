/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClrPassword } from './password';
import { ClrPasswordContainer } from './password-container';
import { checkCircleIcon, ClarityIcons, ClrIcon, exclamationCircleIcon, eyeHideIcon, eyeIcon } from '../../icon';
import { ClrProgressBarModule } from '../../progress/progress-bars/progress-bar.module';
import { ClrCommonFormsModule } from '../common/common.module';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule, ClrProgressBarModule],
  declarations: [ClrPassword, ClrPasswordContainer],
  exports: [ClrCommonFormsModule, ClrPassword, ClrPasswordContainer],
})
export class ClrPasswordModule {
  constructor() {
    ClarityIcons.addIcons(eyeHideIcon, eyeIcon, exclamationCircleIcon, checkCircleIcon);
  }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrCommonFormsModule } from '@clr/angular/forms/common';
import { ClarityIcons, ClrIcon, errorStandardIcon, eyeHideIcon, eyeIcon, successStandardIcon } from '@clr/angular/icon';

import { ClrPassword } from './password';
import { ClrPasswordContainer } from './password-container';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule],
  declarations: [ClrPassword, ClrPasswordContainer],
  exports: [ClrCommonFormsModule, ClrPassword, ClrPasswordContainer],
})
export class ClrPasswordModule {
  constructor() {
    ClarityIcons.addIcons(eyeHideIcon, eyeIcon, successStandardIcon, errorStandardIcon);
  }
}

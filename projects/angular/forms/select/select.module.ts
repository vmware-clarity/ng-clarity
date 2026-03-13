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
import { ClarityIcons, ClrIcon, errorStandardIcon, successStandardIcon } from '@clr/angular/icon';

import { ClrSelect } from './select';
import { ClrSelectContainer } from './select-container';

@NgModule({
  imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule],
  declarations: [ClrSelect, ClrSelectContainer],
  exports: [ClrCommonFormsModule, ClrSelect, ClrSelectContainer],
})
export class ClrSelectModule {
  constructor() {
    ClarityIcons.addIcons(successStandardIcon, errorStandardIcon);
  }
}

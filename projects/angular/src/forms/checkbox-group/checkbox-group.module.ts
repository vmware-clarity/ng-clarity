/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { checkCircleIcon, ClarityIcons, exclamationCircleIcon } from '@cds/core/icon';

import { ClrIconModule } from '../../icon';
import { ClrCommonFormsModule } from '../common';
import { ClrCheckboxGroupContainer } from './checkbox-group-container';
import { ClrTestContainer } from './test-container';

@NgModule({
  // imports: [CommonModule, ClrIconModule, ClrCommonFormsModule, ClrHostWrappingModule],
  imports: [CommonModule, ClrIconModule, ClrCommonFormsModule],
  declarations: [ClrCheckboxGroupContainer, ClrTestContainer],
  providers: [],
  exports: [ClrCheckboxGroupContainer, ClrTestContainer],
})
export class ClrCheckboxGroupModule {
  constructor() {
    ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
  }
}

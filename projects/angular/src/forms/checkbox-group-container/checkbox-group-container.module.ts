/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { checkCircleIcon, ClarityIcons, exclamationCircleIcon } from '@cds/core/icon';

import { ClrTreeViewModule } from '../../data';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { ClrCommonFormsModule } from '../common/common.module';
import { ClrCheckboxGroupContainer } from './checkbox-group-container';

@NgModule({
  imports: [CommonModule, ClrIconModule, ClrCommonFormsModule, ClrHostWrappingModule, ClrTreeViewModule],
  declarations: [ClrCheckboxGroupContainer],
  exports: [ClrCommonFormsModule, ClrCheckboxGroupContainer],
})
export class ClrCheckboxGroupContainerModule {
  constructor() {
    ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
  }
}

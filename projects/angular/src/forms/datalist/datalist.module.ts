/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrInputModule } from '@clr/angular/src/forms/input';
import { checkCircleIcon, ClarityIcons, ClrIcon, exclamationCircleIcon } from '@clr/angular/src/icon';

import { ClrDatalist } from './datalist';
import { ClrDatalistContainer } from './datalist-container';
import { ClrDatalistInput } from './datalist-input';

@NgModule({
  imports: [CommonModule, ClrInputModule, ClrIcon],
  declarations: [ClrDatalist, ClrDatalistInput, ClrDatalistContainer],
  exports: [ClrDatalist, ClrDatalistInput, ClrDatalistContainer],
})
export class ClrDatalistModule {
  constructor() {
    ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
  }
}

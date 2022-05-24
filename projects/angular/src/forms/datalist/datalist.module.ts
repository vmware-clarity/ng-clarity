/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { checkCircleIcon, ClarityIcons, exclamationCircleIcon } from '@cds/core/icon';

import { ClrIconModule } from '../../icon/icon.module';
import { ClrInputModule } from '../input/input.module';
import { ClrDatalist } from './datalist';
import { ClrDatalistContainer } from './datalist-container';
import { ClrDatalistInput } from './datalist-input';

@NgModule({
  imports: [CommonModule, ClrInputModule, ClrIconModule],
  declarations: [ClrDatalist, ClrDatalistInput, ClrDatalistContainer],
  exports: [ClrDatalist, ClrDatalistInput, ClrDatalistContainer],
})
export class ClrDatalistModule {
  constructor() {
    ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
  }
}

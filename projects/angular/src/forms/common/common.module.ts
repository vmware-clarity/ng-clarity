/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClrControl } from './control';
import { ClrControlContainer } from './control-container';
import { ClrControlError } from './error';
import { ClrForm } from './form';
import { ClrControlHelper } from './helper';
import { ClrIfError } from './if-control-state/if-error';
import { ClrIfSuccess } from './if-control-state/if-success';
import { ClrControlLabel } from './label';
import { ClrLayout } from './layout';
import { ClrControlSuccess } from './success';
import { checkCircleIcon, ClarityIcons, exclamationCircleIcon } from '../../icon';
import { ClrIconModule } from '../../icon/icon.module';

@NgModule({
  imports: [CommonModule, ClrIconModule],
  declarations: [
    ClrControlLabel,
    ClrControlError,
    ClrControlSuccess,
    ClrControlHelper,
    ClrIfError,
    ClrIfSuccess,
    ClrForm,
    ClrLayout,
    ClrControlContainer,
    ClrControl,
  ],
  exports: [
    ClrControlLabel,
    ClrControlError,
    ClrControlSuccess,
    ClrControlHelper,
    ClrIfError,
    ClrIfSuccess,
    ClrForm,
    ClrLayout,
    ClrControlContainer,
    ClrControl,
    ClrIconModule,
  ],
})
export class ClrCommonFormsModule {
  constructor() {
    ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
  }
}

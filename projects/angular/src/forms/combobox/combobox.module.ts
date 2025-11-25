/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrCommonFormsModule } from '@clr/angular/src/forms/common';
import {
  angleIcon,
  checkCircleIcon,
  ClarityIcons,
  ClrIcon,
  exclamationCircleIcon,
  windowCloseIcon,
} from '@clr/angular/src/icon';
import { ÇlrClrPopoverModuleNext } from '@clr/angular/src/popover/common';
import { ClrSpinnerModule } from '@clr/angular/src/progress/spinner';
import { ClrConditionalModule, ClrKeyFocusModule } from '@clr/angular/src/utils';

import { ClrCombobox } from './combobox';
import { ClrComboboxContainer } from './combobox-container';
import { ClrOption } from './option';
import { ClrOptionGroup } from './option-group';
import { ClrOptionItems } from './option-items.directive';
import { ClrOptionSelected } from './option-selected.directive';
import { ClrOptions } from './options';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClrIcon,
    ClrKeyFocusModule,
    ClrCommonFormsModule,
    ClrConditionalModule,
    ÇlrClrPopoverModuleNext,
    ClrSpinnerModule,
  ],
  declarations: [
    ClrCombobox,
    ClrComboboxContainer,
    ClrOptions,
    ClrOption,
    ClrOptionGroup,
    ClrOptionSelected,
    ClrOptionItems,
  ],
  exports: [
    ClrCommonFormsModule,
    ClrCombobox,
    ClrComboboxContainer,
    ClrOptions,
    ClrOption,
    ClrOptionGroup,
    ClrOptionSelected,
    ClrConditionalModule,
    ClrOptionItems,
  ],
})
export class ClrComboboxModule {
  constructor() {
    ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon, angleIcon, windowCloseIcon);
  }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClrCombobox } from './combobox';
import { ClrComboboxContainer } from './combobox-container';
import { ClrOption } from './option';
import { ClrOptionGroup } from './option-group';
import { ClrOptionItems } from './option-items.directive';
import { ClrOptionSelected } from './option-selected.directive';
import { ClrOptions } from './options';
import { angleIcon, checkCircleIcon, ClarityIcons, exclamationCircleIcon, windowCloseIcon } from '../../icon';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrPopoverModuleNext } from '../../popover/common/popover.module';
import { ClrSpinnerModule } from '../../progress/spinner/spinner.module';
import { ClrConditionalModule } from '../../utils/conditional/conditional.module';
import { ClrKeyFocusModule } from '../../utils/focus/key-focus/key-focus.module';
import { ClrCommonFormsModule } from '../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClrIconModule,
    ClrKeyFocusModule,
    ClrCommonFormsModule,
    ClrConditionalModule,
    ClrPopoverModuleNext,
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
    ClrIconModule,
  ],
})
export class ClrComboboxModule {
  constructor() {
    ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon, angleIcon, windowCloseIcon);
  }
}

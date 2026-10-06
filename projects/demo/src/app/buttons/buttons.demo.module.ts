/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { ButtonsIconsDemo } from './buttons-icons';
import { ButtonsIconsSmallDemo } from './buttons-icons-sm';
import { ButtonsTestDemo } from './buttons-test';
import { ButtonsDemo } from './buttons.demo';
import { ROUTING } from './buttons.demo.routing';
import { PrimaryButtonDemo } from './primary-button';
import { SecondaryButtonDemo } from './secondary-button';
import { TertiaryButtonDemo } from './tertiary-button';

@NgModule({
  imports: [CommonModule, ClarityModule, ROUTING],
  declarations: [
    ButtonsDemo,
    PrimaryButtonDemo,
    SecondaryButtonDemo,
    TertiaryButtonDemo,
    ButtonsTestDemo,
    ButtonsIconsDemo,
    ButtonsIconsSmallDemo,
  ],
  exports: [
    ButtonsDemo,
    PrimaryButtonDemo,
    SecondaryButtonDemo,
    TertiaryButtonDemo,
    ButtonsTestDemo,
    ButtonsIconsDemo,
    ButtonsIconsSmallDemo,
  ],
})
export class ButtonsDemoModule {}

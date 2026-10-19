/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { IconColorsDemo } from './icon-colors';
import { IconInverseColorDemo } from './icon-inverse-color';
import { IconOptionsDemo } from './icon-options';
import { IconOrientationDemo } from './icon-orientation';
import { IconSelectionDemo } from './icon-selection';
import { IconSizeDemo } from './icon-size';
import { IconVariantsDemo } from './icon-variants';
import { IconsDemo } from './iconography.demo';
import { ROUTING } from './iconography.demo.routing';
import { IconsViewBoxTestDemo } from './icons-view-box-test.demo';

@NgModule({
  imports: [CommonModule, ClarityModule, FormsModule, ROUTING],
  declarations: [
    IconsDemo,
    IconColorsDemo,
    IconOrientationDemo,
    IconSelectionDemo,
    IconSizeDemo,
    IconInverseColorDemo,
    IconVariantsDemo,
    IconsViewBoxTestDemo,
    IconOptionsDemo,
  ],
  exports: [
    IconsDemo,
    IconColorsDemo,
    IconOrientationDemo,
    IconSelectionDemo,
    IconSizeDemo,
    IconInverseColorDemo,
    IconVariantsDemo,
    IconOptionsDemo,
  ],
})
export class IconographyDemoModule {}

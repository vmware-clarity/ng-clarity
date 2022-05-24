/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { TypographyFontAutopsyDemo } from './typography-font-autopsy';
import { TypographyFontCharTestDemo } from './typography-font-char-test';
import { TypographyFontWeightDemo } from './typography-font-weight';
import { TypographyHeadersDemo } from './typography-headers';
import { TypographyLineHeightDemo } from './typography-line-height';
import { TypographyLinksDemo } from './typography-links';
import { TypographyTextDemo } from './typography-text';
import { TypographyDemo } from './typography.demo';
import { ROUTING } from './typography.demo.routing';
import { FontSwitcher } from './utils/font-switcher';

@NgModule({
  imports: [CommonModule, ClarityModule, ROUTING, FormsModule, ReactiveFormsModule],
  declarations: [
    TypographyDemo,
    TypographyFontWeightDemo,
    TypographyHeadersDemo,
    TypographyTextDemo,
    TypographyLinksDemo,
    TypographyFontCharTestDemo,
    TypographyLineHeightDemo,
    TypographyFontAutopsyDemo,
    FontSwitcher,
  ],
  exports: [
    TypographyDemo,
    TypographyFontWeightDemo,
    TypographyHeadersDemo,
    TypographyTextDemo,
    TypographyLinksDemo,
    TypographyFontCharTestDemo,
    TypographyLineHeightDemo,
    TypographyFontAutopsyDemo,
  ],
})
export class TypographyDemoModule {}

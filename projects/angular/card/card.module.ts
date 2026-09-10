/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityIcons, ClrIcon, collapseCardIcon, expandCardIcon } from '@clr/angular/icon';

import { ClrCard } from './card';
import { ClrCardBody } from './card-body';
import { ClrCardBodyText } from './card-body-text';
import { ClrCardBodyTitle } from './card-body-title';
import { ClrCardDivider } from './card-divider';
import { ClrCardFooter } from './card-footer';
import { ClrCardHeader } from './card-header';
import { ClrCardImg } from './card-img';
import { ClrCardMediaBlock } from './card-media-block';
import { ClrCardMediaDescription } from './card-media-description';
import { ClrCardMediaImage } from './card-media-image.directive';
import { ClrCardMediaText } from './card-media-text.directive';
import { ClrCardMediaTitle } from './card-media-title.directive';

const declarations = [
  ClrCard,
  ClrCardHeader,
  ClrCardBody,
  ClrCardBodyTitle,
  ClrCardBodyText,
  ClrCardFooter,
  ClrCardImg,
  ClrCardDivider,
  ClrCardMediaBlock,
  ClrCardMediaDescription,
  ClrCardMediaImage,
  ClrCardMediaTitle,
  ClrCardMediaText,
];

@NgModule({
  imports: [CommonModule, ClrIcon],
  declarations: [...declarations],
  exports: [...declarations],
})
export class ClrCardModule {
  constructor() {
    ClarityIcons.addIcons(expandCardIcon, collapseCardIcon);
  }
}

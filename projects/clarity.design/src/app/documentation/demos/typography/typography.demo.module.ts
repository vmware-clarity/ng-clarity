/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { ColorTypeDemo } from './color-type/color-type.demo';
import { ColorizeCapitalizeLettersPipe } from './colorize-capitalized-letters.pipe';
import { TypographyDemo } from './typography.demo';
import { ColorExampleItemComponent } from '../../../shared/color-example-item/color-example-item.component';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    DocTabsModule,
    RouterModule.forChild([{ path: '', component: TypographyDemo }]),
    DoDontComponent,
    ThemedImageComponent,
    ColorExampleItemComponent,
  ],
  declarations: [TypographyDemo, ColorTypeDemo, ColorizeCapitalizeLettersPipe],
  exports: [TypographyDemo],
})
export class TypographyDemoModule {}

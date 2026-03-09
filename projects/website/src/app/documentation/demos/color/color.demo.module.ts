/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { ColorInteractionDemo } from './color-interaction/color-interaction.demo';
import { ColorObjectBorderDemo } from './color-object-border/color-object-border.demo';
import { ColorPaletteExampleItem } from './color-palette/color-palette-example-item/color-palette-example-item';
import { ColorPaletteDemo } from './color-palette/color-palette.demo';
import { ColorStatusDemo } from './color-status/color-status.demo';
import { ColorTypeDemo } from './color-type/color-type.demo';
import { ColorUtilityDemo } from './color-utility/color-utility.demo';
import { ColorDemo } from './color.demo';
import { ColorExampleItemComponent } from '../../../shared/color-example-item/color-example-item.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { CssVariablePipe } from '../../../shared/pipes/css-variable.pipe';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    RouterModule.forChild([{ path: '', component: ColorDemo }]),
    DocTabsModule,
    CssVariablePipe,
    ThemedImageComponent,
    ColorExampleItemComponent,
    ColorPaletteDemo,
    ColorPaletteExampleItem,
    ColorDemo,
    ColorStatusDemo,
    ColorInteractionDemo,
    ColorObjectBorderDemo,
    ColorTypeDemo,
    ColorUtilityDemo,
  ],
  exports: [ColorDemo],
})
export class ColorDemoModule {}

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

import { ChartsAccessibility } from './accessibility/charts-accessibility';
import { ChartsDemo } from './charts.demo';
import { ChartsColorsCategorical } from './colors/categorical/charts-colors-categorical';
import { VizGeneralColorNumberPipe } from './colors/categorical/viz-general-color-number.pipe';
import { ChartsColors } from './colors/charts-colors';
import { ChartsColorsDiverging } from './colors/diverging/charts-colors-diverging';
import { ChartsColorsSequential } from './colors/sequential/charts-colors-sequential';
import { ChartsColorsSeverity } from './colors/severity/charts-colors-severity';
import { ChartsOverview } from './overview/charts-overview';
import { ColorExampleItemComponent } from '../../../shared/color-example-item/color-example-item.component';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { LinkCardsComponent } from '../../../shared/link-cards/link-cards.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    DocTabsModule,
    DoDontComponent,
    LinkCardsComponent,
    ThemedImageComponent,
    ColorExampleItemComponent,
    RouterModule.forChild([{ path: '', component: ChartsDemo }]),
    ChartsDemo,
    ChartsOverview,
    ChartsColors,
    ChartsColorsCategorical,
    ChartsColorsSequential,
    ChartsColorsDiverging,
    ChartsColorsSeverity,
    ChartsAccessibility,
    VizGeneralColorNumberPipe,
  ],
  exports: [ChartsDemo],
})
export class ChartsDemoModule {}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { GridColumnWrappingDemo } from './column-wrapping/column-wrapping';
import { GridColumnsDemo } from './columns/grid-columns';
import { GridDemo } from './grid.demo';
import { ROUTING } from './grid.demo.routing';
import { GridNestingDemo } from './nesting/nesting';
import { GridNoGuttersDemo } from './no-gutters/no-gutters';
import { GridContainerDemo } from './overflow/grid-container';
import { GridColumnStackingDemo } from './stacking/grid-column-stacking';

@NgModule({
  imports: [CommonModule, ClarityModule, ROUTING],
  declarations: [
    GridDemo,
    GridColumnsDemo,
    GridColumnStackingDemo,
    GridNoGuttersDemo,
    GridColumnWrappingDemo,
    GridNestingDemo,
    GridContainerDemo,
  ],
  exports: [
    GridDemo,
    GridColumnsDemo,
    GridColumnStackingDemo,
    GridNoGuttersDemo,
    GridColumnWrappingDemo,
    GridNestingDemo,
  ],
})
export class GridDemoModule {}

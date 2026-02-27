/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ChartsColorsCategorical } from './categorical/charts-colors-categorical';
import { ChartsColorsDiverging } from './diverging/charts-colors-diverging';
import { ChartsColorsSequential } from './sequential/charts-colors-sequential';
import { ChartsColorsSeverity } from './severity/charts-colors-severity';

@Component({
  selector: 'app-charts-colors',
  templateUrl: './charts-colors.html',
  imports: [ChartsColorsCategorical, ChartsColorsSequential, ChartsColorsDiverging, ChartsColorsSeverity],
})
export class ChartsColors {}

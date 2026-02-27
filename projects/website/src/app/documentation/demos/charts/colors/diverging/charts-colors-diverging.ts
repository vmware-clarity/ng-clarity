/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ColorExampleItemComponent } from '../../../../../shared/color-example-item/color-example-item.component';
import { ThemedImageComponent } from '../../../../../shared/themed-image/themed-image.component';

@Component({
  selector: 'app-charts-colors-diverging',
  templateUrl: './charts-colors-diverging.html',
  imports: [ColorExampleItemComponent, ThemedImageComponent],
})
export class ChartsColorsDiverging {
  protected readonly palettes = [
    {
      name: 'Violet-Aqua Palette',
      colors: makePalette('violet-aqua', ['v', 700], ['a', 900]),
    },
    {
      name: 'Blue-Jade Palette',
      colors: makePalette('blue-jade', ['b', 800], ['j', 800]),
    },
    {
      name: 'Blue-Green Palette',
      colors: makePalette('blue-green', ['b', 800], ['g', 800]),
    },
    {
      name: 'Green-Yellow-Red Palette',
      colors: makePalette('green-yellow-red', ['g', 700], ['r', 900]),
    },
  ];
}

function makePalette(
  colors: string,
  [startLetter, startNumber]: [string, number],
  [endLetter, endNumber]: [string, number]
) {
  return [
    `--cds-alias-viz-diverging-${colors}-${startLetter}-${startNumber}`,
    `--cds-alias-viz-diverging-${colors}-${startLetter}-${startNumber - 100}`,
    `--cds-alias-viz-diverging-${colors}-${startLetter}-${startNumber - 200}`,
    `--cds-alias-viz-diverging-${colors}-${startLetter}-${startNumber - 300}`,
    `--cds-alias-viz-diverging-${colors}-${startLetter}-${startNumber - 400}`,
    `--cds-alias-viz-diverging-${colors}-${startLetter}-${startNumber - 500}`,
    `--cds-alias-viz-diverging-${colors}-neutral`,
    `--cds-alias-viz-diverging-${colors}-${endLetter}-${endNumber - 500}`,
    `--cds-alias-viz-diverging-${colors}-${endLetter}-${endNumber - 400}`,
    `--cds-alias-viz-diverging-${colors}-${endLetter}-${endNumber - 300}`,
    `--cds-alias-viz-diverging-${colors}-${endLetter}-${endNumber - 200}`,
    `--cds-alias-viz-diverging-${colors}-${endLetter}-${endNumber - 100}`,
    `--cds-alias-viz-diverging-${colors}-${endLetter}-${endNumber}`,
  ];
}

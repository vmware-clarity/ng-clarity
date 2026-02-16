/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-charts-colors-sequential',
  templateUrl: './charts-colors-sequential.html',
  standalone: false,
})
export class ChartsColorsSequential {
  protected readonly palettes = [
    {
      name: 'Blue Palette',
      colors: makePalette('blue'),
    },
    {
      name: 'Violet Palette',
      colors: makePalette('violet'),
    },
    {
      name: 'Ochre Palette',
      colors: makePalette('ochre'),
    },
    {
      name: 'Aqua Palette',
      colors: makePalette('aqua'),
    },
    {
      name: 'Green Palette',
      colors: makePalette('green'),
    },
    {
      name: 'Red Palette',
      colors: makePalette('red'),
    },
  ];
}

function makePalette(color: string) {
  return [
    `--cds-alias-viz-sequential-${color}-50`,
    `--cds-alias-viz-sequential-${color}-100`,
    `--cds-alias-viz-sequential-${color}-200`,
    `--cds-alias-viz-sequential-${color}-300`,
    `--cds-alias-viz-sequential-${color}-400`,
    `--cds-alias-viz-sequential-${color}-500`,
    `--cds-alias-viz-sequential-${color}-600`,
    `--cds-alias-viz-sequential-${color}-700`,
    `--cds-alias-viz-sequential-${color}-800`,
    `--cds-alias-viz-sequential-${color}-900`,
    `--cds-alias-viz-sequential-${color}-1000`,
  ];
}

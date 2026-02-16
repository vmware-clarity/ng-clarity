/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-color-palette',
  styleUrl: './color-palette.demo.scss',
  templateUrl: './color-palette.demo.html',
  standalone: false,
})
export class ColorPaletteDemo {
  protected colorCodes = [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100, 50];
  protected paletteRow1Colors = ['magenta', 'pink', 'violet', 'lavender', 'azure', 'blue', 'aqua'];
  protected paletteRow2Colors = ['jade', 'green', 'lime', 'yellow', 'ochre', 'tangerine', 'red'];
  protected mutedUtilityColors = ['warm-gray', 'cool-gray', 'slate', 'ice', 'tan', 'construction'];

  protected getColorName(color: string) {
    return color.replace('-', ' ');
  }
}

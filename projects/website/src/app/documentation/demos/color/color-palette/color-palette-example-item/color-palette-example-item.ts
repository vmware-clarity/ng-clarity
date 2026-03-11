/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NgClass, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

import { CssVariablePipe } from '../../../../../shared/pipes/css-variable.pipe';

@Component({
  selector: 'clr-color-palette-example-item',
  templateUrl: './color-palette-example-item.html',
  styleUrl: 'color-palette-example-item.scss',
  imports: [NgClass, NgStyle, CssVariablePipe],
})
export class ColorPaletteExampleItem {
  @Input() color: string | undefined;
  @Input() colorCode: number | undefined;

  protected copied = false;
  protected showColorCode = true;

  protected colorContrastThreshold: Record<string, number> = {
    magenta: 500,
    pink: 500,
    violet: 500,
    lavender: 400,
    azure: 500,
    blue: 600,
    aqua: 600,
    jade: 600,
    green: 600,
    lime: 700,
    yellow: 700,
    ochre: 700,
    tangerine: 600,
    red: 600,
    'warm-gray': 500,
    'cool-gray': 500,
    slate: 500,
    ice: 500,
    tan: 500,
    construction: 500,
  };

  constructor(private liveAnnouncer: LiveAnnouncer) {}

  get colorToken() {
    return this.colorCode ? `--cds-global-color-${this.color}-${this.colorCode}` : `--cds-global-color-${this.color}`;
  }

  protected async copyTokenToClipboard() {
    await navigator.clipboard.writeText(this.colorToken);
    await this.liveAnnouncer.announce(`copied ${this.color} ${this.colorCode} color token to clipboard`);

    this.copied = true;

    setTimeout(() => {
      this.copied = false;
    }, 1000);
  }
}

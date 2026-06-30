/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// WCAG 2.0 contrast formulas extracted from wcag-contrast@3.0.0 (BSD-2-Clause).

import { hslToRgb } from './color';
import { HslColor, WcagLevel } from './types';

const redCoefficient = 0.2126;
const greenCoefficient = 0.7152;
const blueCoefficient = 0.0722;
const lowGammaCoefficient = 12.92;

function adjustGamma(v: number): number {
  return Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const colorMap = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / lowGammaCoefficient : adjustGamma(s);
  });

  return colorMap[0] * redCoefficient + colorMap[1] * greenCoefficient + colorMap[2] * blueCoefficient;
}

export function contrastRatio(a: HslColor, b: HslColor): number {
  const l1 = relativeLuminance(hslToRgb(...a));
  const l2 = relativeLuminance(hslToRgb(...b));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export function wcagScore(ratio: number): WcagLevel {
  if (ratio >= 7) {
    return 'AAA';
  }
  if (ratio >= 4.5) {
    return 'AA';
  }
  if (ratio >= 3) {
    return 'AA Large';
  }
  return 'Fail';
}

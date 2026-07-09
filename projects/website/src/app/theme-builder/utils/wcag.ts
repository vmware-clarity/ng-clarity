/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// WCAG 2.0 contrast formulas extracted from wcag-contrast@3.0.0 (BSD-2-Clause).

import { RgbColor, WcagLevel } from './types';

const redCoefficient = 0.2126;
const greenCoefficient = 0.7152;
const blueCoefficient = 0.0722;
const lowGammaCoefficient = 12.92;

function adjustGamma(v: number): number {
  return Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance([r, g, b]: RgbColor): number {
  const colorMap = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / lowGammaCoefficient : adjustGamma(s);
  });

  return colorMap[0] * redCoefficient + colorMap[1] * greenCoefficient + colorMap[2] * blueCoefficient;
}

export function contrastRatio(a: RgbColor, b: RgbColor): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export function wcagScore(ratio: number): WcagLevel {
  const result = {
    label: 'Fail',
    score: ratio.toFixed(2),
    type: 'danger',
  };

  if (ratio >= 7) {
    result.label = 'AAA';
    result.type = 'success';
  } else if (ratio >= 4.5) {
    result.label = 'AA';
    result.type = 'success';
  } else if (ratio >= 3) {
    result.label = 'AA Large';
    result.type = 'warning';
  }

  return result;
}

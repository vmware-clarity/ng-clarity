/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { RgbColor } from './types';
import { contrastRatio, wcagScore } from './wcag';

const white = new RgbColor(255, 255, 255);
const black = new RgbColor(0, 0, 0);

describe('contrastRatio', () => {
  it('is 21:1 for black on white', () => {
    expect(contrastRatio(white, black)).toBe(21);
  });

  it('is 1:1 for identical colors', () => {
    expect(contrastRatio(white, white)).toBe(1);
  });

  it('is symmetric', () => {
    expect(contrastRatio(white, black)).toBe(contrastRatio(black, white));
  });
});

describe('wcagScore', () => {
  it('scores AAA at or above 7:1', () => {
    expect(wcagScore(7)).toEqual({ label: 'AAA', score: '7.00', type: 'success' });
    expect(wcagScore(21)).toEqual({ label: 'AAA', score: '21.00', type: 'success' });
  });

  it('scores AA between 4.5:1 and 7:1', () => {
    expect(wcagScore(4.5)).toEqual({ label: 'AA', score: '4.50', type: 'success' });
    expect(wcagScore(6.99)).toEqual({ label: 'AA', score: '6.99', type: 'success' });
  });

  it('scores AA Large between 3:1 and 4.5:1', () => {
    expect(wcagScore(3)).toEqual({ label: 'AA Large', score: '3.00', type: 'warning' });
    expect(wcagScore(4.49)).toEqual({ label: 'AA Large', score: '4.49', type: 'warning' });
  });

  it('scores Fail below 3:1', () => {
    expect(wcagScore(2.99)).toEqual({ label: 'Fail', score: '2.99', type: 'danger' });
    expect(wcagScore(1)).toEqual({ label: 'Fail', score: '1.00', type: 'danger' });
  });
});

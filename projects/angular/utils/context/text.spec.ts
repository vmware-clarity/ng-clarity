/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { normalizeContextText } from './text';

describe('normalizeContextText', () => {
  it('collapses and trims whitespace and lowercases', () => {
    expect(normalizeContextText('  Beta \n  Cluster ')).toBe('beta cluster');
  });

  it('keeps the case when asked to', () => {
    expect(normalizeContextText('  Beta \t Cluster', false)).toBe('Beta Cluster');
  });
});

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { SimpleNumericComparator } from './simple-numeric-comparator';

describe('SimpleNumericComparator', () => {
  let comparator: SimpleNumericComparator<unknown>;

  beforeEach(() => {
    comparator = new SimpleNumericComparator<unknown>('field');
  });

  it('should compare two numeric values correctly', () => {
    expect(comparator.compare({ field: 1 }, { field: 2 })).toBeLessThan(0);
    expect(comparator.compare({ field: 2 }, { field: 1 })).toBeGreaterThan(0);
    expect(comparator.compare({ field: 1 }, { field: 1 })).toEqual(0);
  });

  it('should handle NaN values correctly', () => {
    expect(comparator.compare({ field: NaN }, { field: NaN })).toEqual(0);
    expect(comparator.compare({ field: NaN }, { field: 1 })).toBeLessThan(0);
    expect(comparator.compare({ field: 1 }, { field: NaN })).toBeGreaterThan(0);
  });

  it('should handle undefined values correctly', () => {
    expect(comparator.compare({ field: undefined }, { field: undefined })).toEqual(0);
    expect(comparator.compare({ field: undefined }, { field: 1 })).toBeLessThan(0);
    expect(comparator.compare({ field: 1 }, { field: undefined })).toBeGreaterThan(0);
  });

  it('should handle null values correctly', () => {
    expect(comparator.compare({ field: null }, { field: null })).toEqual(0);
    expect(comparator.compare({ field: null }, { field: 1 })).toBeLessThan(0);
    expect(comparator.compare({ field: 1 }, { field: null })).toBeGreaterThan(0);
  });
});

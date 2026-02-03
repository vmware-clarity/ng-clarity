/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FieldComparator, ListComparator } from './field-list.comparator';

describe('FieldComparator', () => {
  let comparator: FieldComparator<unknown>;

  beforeEach(() => {
    comparator = new FieldComparator<unknown>('field');
  });

  it('should compare two objects correctly', () => {
    expect(comparator.compare({ field: 'a' }, { field: 'b' })).toBeLessThan(0);
    expect(comparator.compare({ field: 'a' }, { field: 'a' })).toEqual(0);
    expect(comparator.compare({ field: null }, { field: null })).toEqual(0);
    expect(comparator.compare({ field: 'a' }, { field: '' })).toBeLessThan(0);
  });
});

describe('ListComparator', () => {
  let comparator: ListComparator<unknown>;

  beforeEach(() => {
    comparator = new ListComparator<unknown>('field');
  });

  it('should compare two objects correctly', () => {
    expect(comparator.compare({ field: [] }, { field: ['a'] })).toBeGreaterThan(0);
    expect(comparator.compare({ field: ['a'] }, { field: [] })).toBeLessThan(0);
    expect(comparator.compare({ field: ['a'] }, { field: ['b'] })).toBeGreaterThan(0);
  });
});

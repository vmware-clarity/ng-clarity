/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AdvancedFilterIsoDate } from './advanced-filter-iso-date';

describe('AdvancedFilterIsoDate', () => {
  const isoDate = new AdvancedFilterIsoDate();

  it('reads an ISO date as local midnight of that day', () => {
    expect(isoDate.toDate('2026-10-20')).toEqual(new Date(2026, 9, 20));
    expect(isoDate.toDate('2028-02-29')).toEqual(new Date(2028, 1, 29));
  });

  it('reads years below 100 as they are', () => {
    expect(isoDate.toDate('0050-01-02').getFullYear()).toBe(50);
  });

  it('reads nothing that is not an ISO date of a day that exists', () => {
    [
      '2026-02-29',
      '2026-13-01',
      '2026-00-10',
      '2026-10-00',
      '2026-10-32',
      '2026-10-20T00:00',
      '26-10-20',
      '',
      20261020,
      null,
      undefined,
    ].forEach(value => expect(isoDate.toDate(value)).withContext(String(value)).toBeNull());
    expect(isoDate.isIsoDate('2026-10-20')).toBeTrue();
    expect(isoDate.isIsoDate('2026-02-30')).toBeFalse();
  });

  it('writes the local day of a date, whatever its time of day', () => {
    expect(isoDate.fromDate(new Date(2026, 9, 20))).toBe('2026-10-20');
    expect(isoDate.fromDate(new Date(2026, 0, 5, 23, 59, 59))).toBe('2026-01-05');
    const early = new Date(2026, 0, 1);
    early.setFullYear(50);
    expect(isoDate.fromDate(early)).toBe('0050-01-01');
  });

  it('reads back what it writes', () => {
    expect(isoDate.toDate(isoDate.fromDate(new Date(2026, 9, 20, 15)))).toEqual(new Date(2026, 9, 20));
  });
});

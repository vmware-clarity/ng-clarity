/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { registerLocaleData } from '@angular/common';
import localeBg from '@angular/common/locales/bg';
import localeJa from '@angular/common/locales/ja';
import { FormControl } from '@angular/forms';

import { isoToLocaleDate, localeDateToIso, localeDateValidator } from './locale-date.utils';

describe('locale date utils', () => {
  beforeAll(() => {
    registerLocaleData(localeBg);
    registerLocaleData(localeJa);
  });

  it('converts en-US (MM/dd/yyyy) both ways', () => {
    expect(isoToLocaleDate('2003-01-15', 'en-US')).toBe('01/15/2003');
    expect(localeDateToIso('01/15/2003', 'en-US')).toBe('2003-01-15');
    expect(localeDateToIso('1/5/2003', 'en-US')).toBe('2003-01-05');
  });

  it('converts day-first and year-first locales', () => {
    expect(localeDateToIso(isoToLocaleDate('2003-01-15', 'bg'), 'bg')).toBe('2003-01-15');
    expect(localeDateToIso('15.01.2003', 'bg')).toBe('2003-01-15');
    expect(localeDateToIso(isoToLocaleDate('2003-01-15', 'ja'), 'ja')).toBe('2003-01-15');
  });

  it('ignores the time part of a stored value', () => {
    expect(isoToLocaleDate('2003-01-15T10:30', 'en-US')).toBe('01/15/2003');
  });

  it('returns empty for empty input and null for invalid dates', () => {
    expect(localeDateToIso('', 'en-US')).toBe('');
    expect(localeDateToIso('02/30/2003', 'en-US')).toBeNull();
    expect(localeDateToIso('abc', 'en-US')).toBeNull();
    expect(isoToLocaleDate('', 'en-US')).toBe('');
  });

  it('flags unreadable dates with the pattern error', () => {
    const validator = localeDateValidator('en-US');
    expect(validator(new FormControl('13/45/2003'))).toEqual({ pattern: true });
    expect(validator(new FormControl('01/15/2003'))).toBeNull();
    expect(validator(new FormControl(''))).toBeNull();
  });
});

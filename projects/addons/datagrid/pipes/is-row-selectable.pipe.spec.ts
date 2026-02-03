/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { inject, TestBed } from '@angular/core/testing';

import { IsRowSelectablePipe } from './is-row-selectable.pipe';

describe('IsRowSelectablePipe', () => {
  beforeEach(function () {
    TestBed.configureTestingModule({
      providers: [IsRowSelectablePipe],
    });
  });

  it('when isLocked function not provided', inject(
    [IsRowSelectablePipe],
    (isRowSelectablePipe: IsRowSelectablePipe) => {
      expect(isRowSelectablePipe.transform({})).toEqual(true);
    }
  ));

  it('when disabled is provided and is true pipe return false', inject(
    [IsRowSelectablePipe],
    (isRowSelectablePipe: IsRowSelectablePipe) => {
      const disabled = true;
      expect(isRowSelectablePipe.transform({}, undefined, disabled)).toEqual(false);
    }
  ));

  describe('a valid isLocked function provided', () => {
    it('when returns true', inject([IsRowSelectablePipe], (isRowSelectablePipe: IsRowSelectablePipe) => {
      const isLockedFunc = (): boolean => true;
      expect(isRowSelectablePipe.transform({}, isLockedFunc)).toEqual(false);
    }));

    it('when returns false', inject([IsRowSelectablePipe], (isRowSelectablePipe: IsRowSelectablePipe) => {
      const isLockedFunc = (): boolean => false;
      expect(isRowSelectablePipe.transform({}, isLockedFunc)).toEqual(true);
    }));
  });
});

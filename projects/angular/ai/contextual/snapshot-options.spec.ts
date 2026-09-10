/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { capSnapshotOptions, CLR_CONTEXT_DEFAULT_OPTIONS, resolveSnapshotOptions } from './snapshot-options';
import { sanitizeUntrustedSnapshotOptions } from './untrusted-options';

describe('snapshot options', () => {
  describe('resolveSnapshotOptions', () => {
    it('applies the defaults when nothing was asked', () => {
      expect(resolveSnapshotOptions()).toEqual(CLR_CONTEXT_DEFAULT_OPTIONS);
      expect(resolveSnapshotOptions({})).toEqual(CLR_CONTEXT_DEFAULT_OPTIONS);
    });

    it('honours budgets inside their ranges', () => {
      expect(resolveSnapshotOptions({ maxComponents: 7, maxTextLength: 20 })).toEqual({
        ...CLR_CONTEXT_DEFAULT_OPTIONS,
        maxComponents: 7,
        maxTextLength: 20,
      });
    });

    it('falls back to the default for a budget that is not a finite number, never to unbounded', () => {
      expect(resolveSnapshotOptions({ maxComponents: Number.NaN }).maxComponents).toBe(
        CLR_CONTEXT_DEFAULT_OPTIONS.maxComponents
      );
      expect(resolveSnapshotOptions({ maxComponents: Number.POSITIVE_INFINITY }).maxComponents).toBe(
        CLR_CONTEXT_DEFAULT_OPTIONS.maxComponents
      );
      expect(resolveSnapshotOptions({ maxTextLength: '50' as unknown as number }).maxTextLength).toBe(
        CLR_CONTEXT_DEFAULT_OPTIONS.maxTextLength
      );
    });

    it('holds a budget to its range', () => {
      expect(resolveSnapshotOptions({ maxComponents: -5 }).maxComponents).toBe(0);
      expect(resolveSnapshotOptions({ maxTextLength: -5 }).maxTextLength).toBe(1);
      expect(resolveSnapshotOptions({ maxComponents: 1e9 }).maxComponents).toBe(10_000);
      expect(resolveSnapshotOptions({ maxItemsPerCollection: 2.9 }).maxItemsPerCollection).toBe(2);
    });
  });

  describe('capSnapshotOptions', () => {
    it('lets a caller ask for less than the ceiling', () => {
      expect(capSnapshotOptions({ maxComponents: 5 }, { maxComponents: 50 })).toEqual({ maxComponents: 5 });
    });

    it('never lets a caller ask for more than the ceiling', () => {
      expect(capSnapshotOptions({ maxComponents: 500 }, { maxComponents: 50 })).toEqual({ maxComponents: 50 });
    });

    it('applies the ceiling where the caller asked for nothing', () => {
      expect(capSnapshotOptions(undefined, { maxComponents: 50, maxTextLength: 40 })).toEqual({
        maxComponents: 50,
        maxTextLength: 40,
      });
    });

    it('leaves the request alone where there is no ceiling', () => {
      expect(capSnapshotOptions({ maxComponents: 500 }, undefined)).toEqual({ maxComponents: 500 });
      expect(capSnapshotOptions({ maxComponents: 500 }, { maxTextLength: 40 })).toEqual({
        maxComponents: 500,
        maxTextLength: 40,
      });
    });

    it('cannot be talked into DOM collection the ceiling switched off', () => {
      expect(capSnapshotOptions({ includeDomComponents: true }, { includeDomComponents: false })).toEqual({
        includeDomComponents: false,
      });
    });
  });

  describe('sanitizeUntrustedSnapshotOptions', () => {
    it('drops a budget that is not a finite number', () => {
      expect(sanitizeUntrustedSnapshotOptions({ maxComponents: Number.NaN, maxTextLength: 10 })).toEqual({
        maxTextLength: 10,
      });
      expect(sanitizeUntrustedSnapshotOptions({ maxComponents: Number.POSITIVE_INFINITY })).toEqual({});
    });
  });
});

describe('snapshot option switches', () => {
  it('default to describing text and frames', () => {
    expect(resolveSnapshotOptions().includeText).toBe(true);
    expect(resolveSnapshotOptions().includeFrames).toBe(true);
  });

  it('can be turned off by the caller, and stay off when the ceiling turned them off', () => {
    expect(resolveSnapshotOptions({ includeText: false }).includeText).toBe(false);
    expect(capSnapshotOptions({ includeFrames: true }, { includeFrames: false }).includeFrames).toBe(false);
    expect(capSnapshotOptions({ includeFrames: false }, { includeFrames: true }).includeFrames).toBe(false);
  });
});

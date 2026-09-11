/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  capSnapshotOptions,
  CLR_CONTEXT_DEFAULT_OPTIONS,
  clrContextPreset,
  resolveSnapshotOptions,
} from './snapshot-options';
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

describe('snapshot options, choosing what to collect', () => {
  it('resolves lists, the root selector and the enumerations, dropping what is not usable', () => {
    const resolved = resolveSnapshotOptions({
      excludeRoles: ['navigation', 3 as unknown as string, ' banner '],
      excludeSelectors: ['clr-header'],
      rootSelector: ' main ',
      maxDepth: 2.7,
      focus: 'modal',
      collectionItems: 'bogus' as 'all',
    });
    expect(resolved.excludeRoles).toEqual(['navigation', 'banner']);
    expect(resolved.excludeSelectors).toEqual(['clr-header']);
    expect(resolved.rootSelector).toBe('main');
    expect(resolved.maxDepth).toBe(2);
    expect(resolved.focus).toBe('modal');
    expect(resolved.collectionItems).toBe('all');
  });

  it('bounds the lists an untrusted caller may send', () => {
    const many = Array.from({ length: 80 }, (_, index) => `role-${index}`);
    expect(resolveSnapshotOptions({ excludeRoles: many }).excludeRoles.length).toBe(50);
    expect(sanitizeUntrustedSnapshotOptions({ excludeRoles: many, excludeSelectors: ['x'] })).toEqual({
      excludeRoles: many.slice(0, 50),
    });
  });

  it('adds exclusions up and keeps a narrowing the ceiling chose', () => {
    const capped = capSnapshotOptions(
      { excludeRoles: ['banner'], maxDepth: 5, focus: 'page', collectionItems: 'all', rootSelector: 'body' },
      { excludeRoles: ['navigation'], maxDepth: 3, focus: 'modal', collectionItems: 'summary', rootSelector: 'main' }
    );
    expect(capped.excludeRoles).toEqual(['banner', 'navigation']);
    expect(capped.maxDepth).toBe(3);
    expect(capped.focus).toBe('modal');
    expect(capped.collectionItems).toBe('summary');
    expect(capped.rootSelector).toBe('main');
  });

  it('treats an unlimited depth ceiling as the largest, not the smallest', () => {
    expect(capSnapshotOptions({ maxDepth: 4 }, { maxDepth: 0 }).maxDepth).toBe(4);
    expect(capSnapshotOptions({ maxDepth: 0 }, { maxDepth: 3 }).maxDepth).toBe(3);
  });

  describe('presets', () => {
    it('start from the full defaults and narrow from there', () => {
      expect(clrContextPreset('full')).toEqual({});
      expect(clrContextPreset('interactive').includeText).toBe(false);
      expect(clrContextPreset('interactive').excludeRoles).toContain('navigation');
      expect(clrContextPreset('minimal').collectionItems).toBe('summary');
      expect(clrContextPreset('minimal').focus).toBe('modal');
    });

    it('apply overrides over the preset', () => {
      expect(clrContextPreset('minimal', { maxComponents: 500 }).maxComponents).toBe(500);
      expect(clrContextPreset('minimal', { maxComponents: 500 }).includeText).toBe(false);
    });
  });
});

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  CLR_CONTEXT_CATEGORIES,
  CLR_CONTEXT_DEFAULT_OPTIONS,
  CLR_CONTEXT_PRESETS,
  presetOrOptions,
  resolveSnapshotOptions,
  withCallOptions,
} from './snapshot-options';

describe('snapshot options', () => {
  describe('resolveSnapshotOptions', () => {
    it('applies the defaults when nothing was asked', () => {
      expect(resolveSnapshotOptions()).toEqual(expect.objectContaining(CLR_CONTEXT_DEFAULT_OPTIONS));
      expect(resolveSnapshotOptions({})).toEqual(resolveSnapshotOptions());
    });

    it('describes the whole page with prose and frames, at any depth, by default', () => {
      const resolved = resolveSnapshotOptions();
      expect(resolved.focus).toBe('page');
      expect(resolved.rootSelector).toBe('');
      expect(resolved.includeText).toBe(true);
      expect(resolved.includeFrames).toBe(true);
      expect(resolved.depth).toBe(Infinity);
      expect(resolved.excludeRoles).toEqual([]);
      expect(resolved.maxTextLength).toBe(100);
    });

    it('takes a depth of one level or more, in whole levels', () => {
      expect(resolveSnapshotOptions({ depth: 2 }).depth).toBe(2);
      expect(resolveSnapshotOptions({ depth: 2.9 }).depth).toBe(2);
    });

    it('describes every level for a depth below one or not a number', () => {
      expect(resolveSnapshotOptions({ depth: 0 }).depth).toBe(Infinity);
      expect(resolveSnapshotOptions({ depth: Number.NaN }).depth).toBe(Infinity);
      expect(resolveSnapshotOptions({ depth: '2' as unknown as number }).depth).toBe(Infinity);
    });

    it('reads root as the page, the open modal, or a selector', () => {
      expect(resolveSnapshotOptions({ root: 'page' })).toEqual(
        expect.objectContaining({ focus: 'page', rootSelector: '' })
      );
      expect(resolveSnapshotOptions({ root: 'modal' })).toEqual(
        expect.objectContaining({ focus: 'modal', rootSelector: '' })
      );
      expect(resolveSnapshotOptions({ root: ' main ' })).toEqual(
        expect.objectContaining({ root: 'main', focus: 'page', rootSelector: 'main' })
      );
      expect(resolveSnapshotOptions({ root: '  ' }).root).toBe('page');
      expect(resolveSnapshotOptions({ root: 7 as unknown as string }).root).toBe('page');
    });

    it('keeps only usable selectors and known categories', () => {
      const resolved = resolveSnapshotOptions({
        excludeSelectors: [' .ads ', '', 7 as unknown as string],
        excludeCategories: ['layout', 'nonsense' as never],
      });
      expect(resolved.excludeSelectors).toEqual(['.ads']);
      expect(resolved.excludeCategories).toEqual(['layout']);
    });
  });

  describe('categories', () => {
    it('expand into the roles they stand for', () => {
      expect(resolveSnapshotOptions({ excludeCategories: ['layout', 'headings'] }).excludeRoles).toEqual([
        ...CLR_CONTEXT_CATEGORIES.layout,
        'heading',
      ]);
    });

    it('leave out prose and frames', () => {
      const resolved = resolveSnapshotOptions({ excludeCategories: ['text', 'frames'] });
      expect(resolved.includeText).toBe(false);
      expect(resolved.includeFrames).toBe(false);
      expect(resolved.excludeRoles).toEqual([]);
    });
  });

  describe('presets', () => {
    it('narrow from the full defaults', () => {
      expect(CLR_CONTEXT_PRESETS.full).toEqual({});
      expect(CLR_CONTEXT_PRESETS.interactive).toEqual({ excludeCategories: ['layout', 'text'] });
      expect(resolveSnapshotOptions(CLR_CONTEXT_PRESETS.minimal)).toEqual(
        expect.objectContaining({ focus: 'modal', excludeRoles: [...CLR_CONTEXT_CATEGORIES.layout] })
      );
    });

    it('are handed out as copies the caller may change', () => {
      const options = presetOrOptions('interactive');
      options.depth = 1;
      expect(CLR_CONTEXT_PRESETS.interactive.depth).toBeUndefined();
    });

    it('report a name that is not a preset, and give no options for it', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      expect(presetOrOptions('everything' as never)).toEqual({});
      expect(warn).toHaveBeenCalledTimes(1);
    });

    it('say that an exclusion list given as something else will be ignored', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      presetOrOptions({ excludeSelectors: '.secret' as unknown as string[] });
      expect(warn).toHaveBeenCalledExactlyOnceWith(
        'Clarity context options: excludeSelectors must be a list, so ".secret" was ignored.'
      );
    });
  });

  describe('withCallOptions', () => {
    it('lets a call set the depth and the root over the application’s', () => {
      expect(withCallOptions({ depth: 1, root: 'main' }, { depth: 3, root: 'modal' })).toEqual({
        depth: 3,
        root: 'modal',
      });
    });

    it('ignores what a call left undefined', () => {
      expect(withCallOptions({ depth: 2 }, { depth: undefined })).toEqual({ depth: 2 });
    });

    it('keeps the application’s value, not the default, when a call gives one of the wrong type', () => {
      const application = { depth: 2, root: 'main' };
      const call = { depth: '3' as never, root: '  ' };

      expect(withCallOptions(application, call)).toEqual(application);
      expect(resolveSnapshotOptions(withCallOptions(application, call))).toEqual(
        expect.objectContaining({ depth: 2, root: 'main' })
      );
    });

    it('adds a call’s exclusions to the application’s, so an empty list removes none', () => {
      const application = { excludeSelectors: ['nav'], excludeCategories: ['layout' as const] };
      expect(withCallOptions(application, { excludeSelectors: ['aside'], excludeCategories: [] })).toEqual({
        excludeSelectors: ['nav', 'aside'],
        excludeCategories: ['layout'],
      });
    });

    it('ignores an exclusion list that is not a list, so the application’s stays', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      expect(
        withCallOptions({ excludeSelectors: ['nav'] }, { excludeSelectors: 'aside' as unknown as string[] })
      ).toEqual({ excludeSelectors: ['nav'] });
      expect(warn).toHaveBeenCalledTimes(1);
    });

    it('says a value it cannot print was ignored, rather than throwing while saying so', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const circular: Record<string, unknown> = {};
      circular['self'] = circular;
      withCallOptions({}, { excludeSelectors: circular as never });
      withCallOptions({}, { excludeSelectors: BigInt(1) as never });
      expect(warn.mock.calls).toEqual([
        ['Clarity context options: excludeSelectors must be a list, so an object was ignored.'],
        ['Clarity context options: excludeSelectors must be a list, so a bigint was ignored.'],
      ]);
    });
  });

  describe('the exported constants', () => {
    it('cannot be changed by an application, since they decide what every snapshot gets', () => {
      expect(Object.isFrozen(CLR_CONTEXT_DEFAULT_OPTIONS)).toBe(true);
      expect(Object.isFrozen(CLR_CONTEXT_PRESETS.minimal)).toBe(true);
      expect(Object.isFrozen(CLR_CONTEXT_CATEGORIES.layout)).toBe(true);
    });
  });
});

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isDevMode } from '@angular/core';
import { CLR_CONTEXT_DEFAULT_MAX_ITEMS } from '@clr/angular/utils';

import { WRITABLE_ROLES } from './dom/tables/roles';
import { ClrContextCategory, ClrContextSnapshotOptions } from './interfaces/context.interface';
import { ownEntry } from './lookup';

/** Default snapshot options, sized for an AI agent's context window. */
export const CLR_CONTEXT_DEFAULT_OPTIONS: Readonly<Required<ClrContextSnapshotOptions>> = deepFreeze({
  root: 'page',
  excludeSelectors: [],
  excludeCategories: [],
  maxComponents: 300,
  maxItemsPerCollection: CLR_CONTEXT_DEFAULT_MAX_ITEMS,
});

/** Longest text value in a snapshot; longer text is truncated. */
export const MAX_TEXT_LENGTH = 100;

/** The options as the walk reads them: the public ones resolved, and what they imply. */
export interface ResolvedSnapshotOptions extends Required<ClrContextSnapshotOptions> {
  /** `'modal'` when `root` is `'modal'`. */
  focus: 'page' | 'modal';
  /** The selector `root` names, or empty for the page and the modal. */
  rootSelector: string;
  /** The roles the excluded categories stand for. */
  excludeRoles: string[];
  /** `false` when the `text` category is excluded. */
  includeText: boolean;
  /** `false` when the `frames` category is excluded. */
  includeFrames: boolean;
  /** `'summary'` when `maxItemsPerCollection` is `0`. */
  collectionItems: 'all' | 'summary';
  maxTextLength: number;
}

/** The roles each category stands for. `text` and `frames` leave out prose and frames. */
export const CLR_CONTEXT_CATEGORIES: Readonly<Record<ClrContextCategory, readonly string[]>> = deepFreeze({
  layout: ['navigation', 'banner', 'contentinfo', 'complementary'],
  actions: ['button', 'link', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio'],
  forms: ['form', ...WRITABLE_ROLES],
  headings: ['heading'],
  collections: ['grid', 'treegrid', 'table', 'list', 'tablist', 'tree'],
  dialogs: ['dialog', 'alertdialog'],
  status: ['alert', 'status', 'progressbar', 'meter'],
  images: ['img', 'figure'],
  text: [],
  frames: [],
});

const CATEGORY_NAMES = Object.keys(CLR_CONTEXT_CATEGORIES) as ClrContextCategory[];

type BudgetKey = 'maxComponents' | 'maxItemsPerCollection';

/** A non-finite budget would never run out and the whole document would be walked. */
const BUDGET_RANGES: Record<BudgetKey, { min: number; max: number }> = {
  maxComponents: { min: 0, max: 10_000 },
  maxItemsPerCollection: { min: 0, max: 1_000 },
};

export const BUDGET_KEYS = Object.keys(BUDGET_RANGES) as BudgetKey[];
const EXCLUSION_KEYS = ['excludeCategories', 'excludeSelectors'] as const;

function isExclusionKey(key: string): key is (typeof EXCLUSION_KEYS)[number] {
  return (EXCLUSION_KEYS as readonly string[]).includes(key);
}

/** Whether a call's value can replace the application's: the type `resolveSnapshotOptions` would accept. */
function isUsable(key: string, value: unknown): boolean {
  if (isExclusionKey(key)) {
    return Array.isArray(value);
  }
  if ((BUDGET_KEYS as readonly string[]).includes(key)) {
    return typeof value === 'number' && Number.isFinite(value);
  }
  if (key === 'root') {
    return typeof value === 'string' && !!value.trim();
  }
  return value !== undefined;
}

function listOrNothing(value: unknown): readonly unknown[] {
  return Array.isArray(value) ? value : [];
}

function union<T>(first: readonly T[], second: readonly T[]): T[] {
  return [...new Set([...first, ...second])];
}

/** In development, warns that a non-list exclusion (`excludeSelectors: '.secret'`) was ignored. */
function warnIfNotAList(key: string, value: unknown): void {
  if (value !== undefined && !Array.isArray(value) && isDevMode()) {
    console.warn(`Clarity context options: ${key} must be a list, so ${describeValue(value)} was ignored.`);
  }
}

export function warnIfExclusionsAreNotLists(options: ClrContextSnapshotOptions | null | undefined): void {
  for (const key of EXCLUSION_KEYS) {
    warnIfNotAList(key, options?.[key]);
  }
}

/** A warning must not throw on a circular object or a BigInt. */
function describeValue(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (value === null) {
    return 'null';
  }
  return typeof value === 'object' ? 'an object' : `a ${typeof value}`;
}

function categoryRoles(categories: readonly ClrContextCategory[]): string[] {
  return [...new Set(categories.flatMap(category => ownEntry(CLR_CONTEXT_CATEGORIES, category) ?? []))];
}

/** Named option bundles for common ways of consuming context. */
export type ClrContextPreset = 'full' | 'interactive' | 'minimal';

/** Presets from most to least verbose: `full`, `interactive` (no prose or layout) and `minimal`. */
export const CLR_CONTEXT_PRESETS: Readonly<Record<ClrContextPreset, Readonly<ClrContextSnapshotOptions>>> = deepFreeze({
  full: {},
  interactive: {
    excludeCategories: ['layout', 'text'],
  },
  minimal: {
    excludeCategories: ['layout', 'text'],
    maxItemsPerCollection: 0,
    maxComponents: 150,
    root: 'modal',
  },
});

/** A preset's options, or `options` as given; an unknown preset name is reported and ignored. */
export function presetOrOptions(
  scope: ClrContextPreset | ClrContextSnapshotOptions | undefined
): ClrContextSnapshotOptions {
  if (typeof scope !== 'string') {
    warnIfExclusionsAreNotLists(scope);
    return { ...scope };
  }
  const options = ownEntry(CLR_CONTEXT_PRESETS, scope);
  if (!options) {
    if (isDevMode()) {
      console.warn(
        `Clarity context options: "${scope}" is not a preset; use one of ${Object.keys(CLR_CONTEXT_PRESETS).join(', ')}.`
      );
    }
    return {};
  }
  return { ...options };
}

/**
 * One call's options over the application's: a call's root and budgets replace the application's, and its exclusion
 * lists add to them, so a call can only leave out more. A call value of the wrong type is ignored, keeping the
 * application's value rather than falling back to the default.
 */
export function withCallOptions(
  application: ClrContextSnapshotOptions | null | undefined,
  call: ClrContextSnapshotOptions | undefined
): ClrContextSnapshotOptions {
  const effective: ClrContextSnapshotOptions = { ...application };
  for (const [key, value] of Object.entries(call ?? {})) {
    if (isExclusionKey(key)) {
      warnIfNotAList(key, value);
    }
    if (isUsable(key, value)) {
      (effective as Record<string, unknown>)[key] = value;
    }
  }
  for (const key of EXCLUSION_KEYS) {
    const added = call?.[key];
    if (Array.isArray(added)) {
      (effective as Record<string, unknown>)[key] = union(listOrNothing(application?.[key]), added);
    }
  }
  return effective;
}

/** The caller's options over the defaults, each held to its type and range or else defaulted. */
export function resolveSnapshotOptions(options?: ClrContextSnapshotOptions): ResolvedSnapshotOptions {
  const resolved: Required<ClrContextSnapshotOptions> = { ...CLR_CONTEXT_DEFAULT_OPTIONS };
  for (const key of BUDGET_KEYS) {
    const value = options?.[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      resolved[key] = clamp(Math.floor(value), BUDGET_RANGES[key]);
    }
  }
  if (Array.isArray(options?.excludeSelectors)) {
    resolved.excludeSelectors = stringList(options.excludeSelectors);
  }
  if (Array.isArray(options?.excludeCategories)) {
    // Validated before bounding, so junk entries cannot push real categories out.
    resolved.excludeCategories = stringList(
      options.excludeCategories.filter(name => CATEGORY_NAMES.includes(name as ClrContextCategory))
    ) as ClrContextCategory[];
  }
  if (typeof options?.root === 'string' && options.root.trim()) {
    resolved.root = options.root.trim();
  }
  const isSelector = resolved.root !== 'page' && resolved.root !== 'modal';
  return {
    ...resolved,
    focus: resolved.root === 'modal' ? 'modal' : 'page',
    rootSelector: isSelector ? resolved.root : '',
    excludeRoles: categoryRoles(resolved.excludeCategories),
    includeText: !resolved.excludeCategories.includes('text'),
    includeFrames: !resolved.excludeCategories.includes('frames'),
    collectionItems: resolved.maxItemsPerCollection === 0 ? 'summary' : 'all',
    maxTextLength: MAX_TEXT_LENGTH,
  };
}

function stringList(value: readonly unknown[]): string[] {
  return value
    .filter((entry): entry is string => typeof entry === 'string')
    .map(entry => entry.trim())
    .filter(entry => entry.length > 0);
}

function clamp(value: number, range: { min: number; max: number }): number {
  return Math.min(range.max, Math.max(range.min, value));
}

/** The exported option constants are shared, so they must not be mutable. */
function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const entry of Object.values(value as Record<string, unknown>)) {
      deepFreeze(entry);
    }
  }
  return value;
}

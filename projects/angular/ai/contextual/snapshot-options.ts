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

/** Default snapshot budgets, sized for an AI agent's context window. */
export const CLR_CONTEXT_DEFAULT_OPTIONS: Readonly<Required<ClrContextSnapshotOptions>> = deepFreeze({
  maxTextLength: 100,
  maxItemsPerCollection: CLR_CONTEXT_DEFAULT_MAX_ITEMS,
  maxComponents: 300,
  maxDepth: 0,
  includeDomComponents: true,
  includeText: true,
  includeFrames: true,
  excludeCategories: [],
  excludeRoles: [],
  excludeSelectors: [],
  rootSelector: '',
  focus: 'page',
  collectionItems: 'all',
  includeRoutes: false,
});

/** The roles each category stands for. `text` and `frames` map to the `includeText` and `includeFrames` switches. */
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

type BudgetKey = 'maxTextLength' | 'maxItemsPerCollection' | 'maxComponents' | 'maxDepth';

/** A non-finite budget would never run out and the whole document would be walked. */
const BUDGET_RANGES: Record<BudgetKey, { min: number; max: number }> = {
  maxTextLength: { min: 1, max: 10_000 },
  maxItemsPerCollection: { min: 1, max: 1_000 },
  maxComponents: { min: 0, max: 10_000 },
  maxDepth: { min: 0, max: 100 },
};

export const BUDGET_KEYS = Object.keys(BUDGET_RANGES) as BudgetKey[];
export const SWITCH_KEYS = ['includeDomComponents', 'includeText', 'includeFrames', 'includeRoutes'] as const;
const LIST_KEYS = ['excludeRoles', 'excludeSelectors'] as const;
const EXCLUSION_KEYS = ['excludeCategories', ...LIST_KEYS] as const;

function isExclusionKey(key: string): key is (typeof EXCLUSION_KEYS)[number] {
  return (EXCLUSION_KEYS as readonly string[]).includes(key);
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

/** The roles a set of categories leaves out, for the categories that are roles. */
export function clrContextCategoryRoles(categories: readonly ClrContextCategory[]): string[] {
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
    collectionItems: 'summary',
    maxItemsPerCollection: 10,
    maxTextLength: 60,
    maxComponents: 150,
    focus: 'modal',
  },
});

/** A copy of a preset's options with overrides; exclusion lists add up. Throws for an unknown name. */
export function clrContextPreset(
  preset: ClrContextPreset,
  overrides: ClrContextSnapshotOptions = {}
): ClrContextSnapshotOptions {
  const options = ownEntry(CLR_CONTEXT_PRESETS, preset);
  if (!options) {
    throw new Error(
      `Clarity context options: "${String(preset)}" is not a preset; use one of ${Object.keys(CLR_CONTEXT_PRESETS).join(', ')}.`
    );
  }
  const base: Record<string, unknown> = { ...options };
  for (const key of EXCLUSION_KEYS) {
    if (Array.isArray(base[key])) {
      base[key] = [...base[key]];
    }
  }
  return withCallOptions(base, overrides);
}

/** One call's options over the application's; exclusion lists add up, so a call can only leave out more. */
export function withCallOptions(
  application: ClrContextSnapshotOptions | null | undefined,
  call: ClrContextSnapshotOptions | undefined
): ClrContextSnapshotOptions {
  const effective: ClrContextSnapshotOptions = { ...application };
  for (const [key, value] of Object.entries(call ?? {})) {
    if (isExclusionKey(key)) {
      warnIfNotAList(key, value);
    }
    if (value !== undefined && (!isExclusionKey(key) || Array.isArray(value))) {
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

/** Most entries in an untrusted caller's role list; the application's own lists are never cut. */
export const MAX_LIST_ENTRIES = 50;

/** The caller's options over the defaults, each held to its type and range or else defaulted. */
export function resolveSnapshotOptions(options?: ClrContextSnapshotOptions): Required<ClrContextSnapshotOptions> {
  const resolved: Required<ClrContextSnapshotOptions> = { ...CLR_CONTEXT_DEFAULT_OPTIONS };
  if (!options) {
    return resolved;
  }
  for (const key of BUDGET_KEYS) {
    const value = options[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      resolved[key] = clamp(Math.floor(value), BUDGET_RANGES[key]);
    }
  }
  for (const key of SWITCH_KEYS) {
    const value = options[key];
    if (typeof value === 'boolean') {
      resolved[key] = value;
    }
  }
  for (const key of LIST_KEYS) {
    const value = options[key];
    if (Array.isArray(value)) {
      resolved[key] = stringList(value);
    }
  }
  if (Array.isArray(options.excludeCategories)) {
    // Validated before bounding, so junk entries cannot push real categories out.
    resolved.excludeCategories = stringList(
      options.excludeCategories.filter(name => CATEGORY_NAMES.includes(name as ClrContextCategory))
    ) as ClrContextCategory[];
  }
  resolved.excludeRoles = union(resolved.excludeRoles, clrContextCategoryRoles(resolved.excludeCategories));
  if (resolved.excludeCategories.includes('text')) {
    resolved.includeText = false;
  }
  if (resolved.excludeCategories.includes('frames')) {
    resolved.includeFrames = false;
  }
  if (typeof options.rootSelector === 'string') {
    resolved.rootSelector = options.rootSelector.trim();
  }
  if (options.focus === 'page' || options.focus === 'modal') {
    resolved.focus = options.focus;
  }
  if (options.collectionItems === 'all' || options.collectionItems === 'summary') {
    resolved.collectionItems = options.collectionItems;
  }
  return resolved;
}

/** Options asked by one party capped by another's ceiling: the smaller budget wins and exclusions add up. */
export function capSnapshotOptions(
  requested: ClrContextSnapshotOptions | undefined,
  ceiling: ClrContextSnapshotOptions | undefined
): ClrContextSnapshotOptions {
  const capped: ClrContextSnapshotOptions = { ...requested };
  if (!ceiling) {
    return capped;
  }
  for (const key of BUDGET_KEYS) {
    const limit = ceiling[key];
    if (typeof limit !== 'number' || !Number.isFinite(limit)) {
      continue;
    }
    const asked = capped[key];
    if (key === 'maxDepth') {
      // Zero is "unlimited", so it is the largest value.
      capped[key] = limit === 0 ? asked : typeof asked === 'number' && asked > 0 ? Math.min(asked, limit) : limit;
      continue;
    }
    capped[key] = typeof asked === 'number' && Number.isFinite(asked) ? Math.min(asked, limit) : limit;
  }
  for (const key of SWITCH_KEYS) {
    if (ceiling[key] === false) {
      capped[key] = false;
    }
  }
  for (const key of LIST_KEYS) {
    const limit = ceiling[key];
    if (Array.isArray(limit) && limit.length) {
      capped[key] = union(stringList(limit), stringList(listOrNothing(capped[key])));
    }
  }
  if (Array.isArray(ceiling.excludeCategories) && ceiling.excludeCategories.length) {
    capped.excludeCategories = union(
      ceiling.excludeCategories,
      listOrNothing(capped.excludeCategories)
    ) as ClrContextCategory[];
  }
  if (ceiling.rootSelector) {
    capped.rootSelector = ceiling.rootSelector;
  }
  if (ceiling.focus === 'modal') {
    capped.focus = 'modal';
  }
  if (ceiling.collectionItems === 'summary') {
    capped.collectionItems = 'summary';
  }
  return capped;
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

/** The exported option constants feed the untrusted allow-list, so they must not be mutable. */
function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const entry of Object.values(value as Record<string, unknown>)) {
      deepFreeze(entry);
    }
  }
  return value;
}

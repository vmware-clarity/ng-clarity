/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isDevMode } from '@angular/core';
import { CLR_CONTEXT_DEFAULT_MAX_ITEMS } from '@clr/angular/utils';

import { ClrContextCategory, ClrContextSnapshotOptions } from './interfaces/context.interface';
import { ownEntry } from './lookup';

/**
 * Default budgets applied while building a snapshot, tuned to keep snapshots compact
 * enough for an AI agent's context window.
 */
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

/**
 * The roles each category stands for. `text` and `frames` are not roles but the
 * `includeText` and `includeFrames` switches, and are handled where options resolve.
 */
export const CLR_CONTEXT_CATEGORIES: Readonly<Record<ClrContextCategory, readonly string[]>> = deepFreeze({
  layout: ['navigation', 'banner', 'contentinfo', 'complementary'],
  actions: ['button', 'link', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio'],
  forms: [
    'form',
    'textbox',
    'searchbox',
    'combobox',
    'listbox',
    'checkbox',
    'radio',
    'radiogroup',
    'switch',
    'slider',
    'spinbutton',
  ],
  headings: ['heading'],
  collections: ['grid', 'treegrid', 'table', 'list', 'tablist', 'tree'],
  dialogs: ['dialog', 'alertdialog'],
  status: ['alert', 'status', 'progressbar', 'meter'],
  images: ['img', 'figure'],
  text: [],
  frames: [],
});

const CATEGORY_NAMES = Object.keys(CLR_CONTEXT_CATEGORIES) as ClrContextCategory[];
const EXCLUSION_KEYS = ['excludeCategories', 'excludeRoles', 'excludeSelectors'] as const;

function isExclusionKey(key: string): key is (typeof EXCLUSION_KEYS)[number] {
  return (EXCLUSION_KEYS as readonly string[]).includes(key);
}

/** An exclusion list as given, or no entries when what was given is not a list. */
function listOrNothing(value: unknown): readonly unknown[] {
  return Array.isArray(value) ? value : [];
}

/**
 * In development, says that an exclusion list the application gave was ignored for not
 * being a list (`excludeSelectors: '.secret'` for `['.secret']`): the snapshot is then wider
 * than the caller meant. Untrusted callers never get here; their options are sanitized.
 */
function warnIfNotAList(key: string, value: unknown): void {
  if (value !== undefined && !Array.isArray(value) && isDevMode()) {
    console.warn(`Clarity context options: ${key} must be a list, so ${describeValue(value)} was ignored.`);
  }
}

/**
 * {@link warnIfNotAList} for every exclusion list in a set of options the application
 * configured once — `provideClrContextOptions`, a frame host's ceiling — where nothing
 * else would say that one was ignored.
 */
export function warnIfExclusionsAreNotLists(options: ClrContextSnapshotOptions | null | undefined): void {
  for (const key of EXCLUSION_KEYS) {
    warnIfNotAList(key, options?.[key]);
  }
}

/** A string as written, anything else by its kind: a warning must not throw on a circular object or a BigInt. */
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

/** Named bundles of options for the common ways of consuming context. */
export type ClrContextPreset = 'full' | 'interactive' | 'minimal';

/**
 * Presets, from most to least verbose:
 *
 * - `full` — the defaults: everything visible, prose included.
 * - `interactive` — what a user can act on and read as structure: no prose, no
 *   page layout (header, navigation, footer, side panels).
 * - `minimal` — the smallest useful snapshot: no prose or layout, collections reduced to
 *   counts and selection, shorter text, a lower component budget, and only the open
 *   modal while one is open.
 */
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

/**
 * A preset's options with the caller's overrides applied over them, as a copy the caller
 * may change. The exclusion lists add to the preset's rather than replace them —
 * `clrContextPreset('interactive', { excludeCategories: ['images'] })` leaves out layout,
 * prose and images — so an override can only narrow a preset further; to start from no
 * exclusions, pass options rather than a preset.
 */
export function clrContextPreset(
  preset: ClrContextPreset,
  overrides: ClrContextSnapshotOptions = {}
): ClrContextSnapshotOptions {
  const base: Readonly<ClrContextSnapshotOptions> = ownEntry(CLR_CONTEXT_PRESETS, preset) ?? {};
  const options = { ...base, ...overrides } as ClrContextSnapshotOptions;
  for (const key of EXCLUSION_KEYS) {
    warnIfNotAList(key, overrides[key]);
    const combined = [...listOrNothing(base[key]), ...listOrNothing(overrides[key])];
    if (combined.length || (key in options && !Array.isArray(options[key]))) {
      (options as Record<string, unknown>)[key] = [...new Set(combined)];
    }
  }
  return options;
}

/**
 * One call's options over the application's, ignoring what the call left undefined. The
 * exclusion lists add to the application's rather than replace them: what the application
 * keeps from agents stays kept whatever a call passes — a call can only leave out more.
 */
export function withCallOptions(
  application: ClrContextSnapshotOptions | null | undefined,
  call: ClrContextSnapshotOptions | undefined
): ClrContextSnapshotOptions {
  const effective: ClrContextSnapshotOptions = { ...application };
  for (const [key, value] of Object.entries(call ?? {})) {
    // An exclusion list that is not a list — `null`, a string — is ignored rather than
    // put in place of the application's, which would then resolve to no exclusions.
    if (isExclusionKey(key)) {
      warnIfNotAList(key, value);
    }
    if (value !== undefined && (!isExclusionKey(key) || Array.isArray(value))) {
      (effective as Record<string, unknown>)[key] = value;
    }
  }
  for (const key of EXCLUSION_KEYS) {
    const kept = application?.[key];
    const added = call?.[key];
    if (Array.isArray(kept) && kept.length && Array.isArray(added)) {
      (effective as Record<string, unknown>)[key] = [...new Set([...kept, ...added])];
    }
  }
  return effective;
}

type BudgetKey = 'maxTextLength' | 'maxItemsPerCollection' | 'maxComponents' | 'maxDepth';

/**
 * The range each budget is held to. The walk stops when a budget is exhausted, so a
 * budget that is not a finite number — `NaN`, `Infinity` — would never be exhausted and
 * the whole document would be walked and serialised; the upper bounds keep even a
 * trusted caller's typo from doing the same.
 */
const BUDGET_RANGES: Record<BudgetKey, { min: number; max: number }> = {
  maxTextLength: { min: 1, max: 10_000 },
  maxItemsPerCollection: { min: 1, max: 1_000 },
  maxComponents: { min: 0, max: 10_000 },
  maxDepth: { min: 0, max: 100 },
};

const BUDGET_KEYS = Object.keys(BUDGET_RANGES) as BudgetKey[];
const SWITCH_KEYS = ['includeDomComponents', 'includeText', 'includeFrames', 'includeRoutes'] as const;
const LIST_KEYS = ['excludeRoles', 'excludeSelectors'] as const;

/**
 * Most entries an untrusted caller's role list may hold; an untrusted caller cannot send
 * selectors at all. The application's own lists and selectors are never cut: an exclusion
 * dropped or shortened for length is content that leaks.
 */
export const MAX_LIST_ENTRIES = 50;

/**
 * The budgets a snapshot is actually built with: the caller's options over the defaults,
 * with every budget a finite integer inside its range, every list a list of strings, and
 * every enumeration one of its values. Anything else falls back to the
 * default rather than to "unbounded".
 */
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
    // Validated before the list is bounded, so entries that name nothing cannot push
    // real categories out of it.
    resolved.excludeCategories = stringList(
      options.excludeCategories.filter(name => CATEGORY_NAMES.includes(name as ClrContextCategory))
    ) as ClrContextCategory[];
  }
  // A category is a name for roles, or for a switch: both are applied here, so the walk
  // only ever sees roles and switches.
  resolved.excludeRoles = [
    ...new Set([...resolved.excludeRoles, ...clrContextCategoryRoles(resolved.excludeCategories)]),
  ];
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

/**
 * Budgets requested by one party, held to the ceiling set by another: whichever asked
 * for less wins. This is how a host caps what an embedded frame may ask for — a frame
 * can request a smaller snapshot than the host allows, never a larger one. Exclusions
 * add up, a root the ceiling fixed stays fixed, and a narrowing the ceiling chose —
 * modal focus, summary collections — stays chosen.
 */
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
      // Zero is "unlimited", so it is the largest value, not the smallest.
      capped[key] = limit === 0 ? asked : typeof asked === 'number' && asked > 0 ? Math.min(asked, limit) : limit;
      continue;
    }
    capped[key] = typeof asked === 'number' && Number.isFinite(asked) ? Math.min(asked, limit) : limit;
  }
  // A switch the ceiling turned off stays off: less is always allowed, more never.
  for (const key of SWITCH_KEYS) {
    if (ceiling[key] === false) {
      capped[key] = false;
    }
  }
  // Exclusions add up. A requester's list was bounded when it was sanitized; the
  // ceiling's is kept whole.
  for (const key of LIST_KEYS) {
    const limit = ceiling[key];
    if (Array.isArray(limit) && limit.length) {
      capped[key] = [...new Set([...stringList(limit), ...stringList(listOrNothing(capped[key]))])];
    }
  }
  if (Array.isArray(ceiling.excludeCategories) && ceiling.excludeCategories.length) {
    capped.excludeCategories = [
      ...new Set([...ceiling.excludeCategories, ...listOrNothing(capped.excludeCategories)]),
    ] as ClrContextCategory[];
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

/**
 * The value, and every object and array inside it, made read-only. The exported option
 * constants feed option resolution and the untrusted-caller allow-list: an application
 * pushing into one of them would change what every snapshot, and every untrusted caller,
 * is allowed.
 */
function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const entry of Object.values(value as Record<string, unknown>)) {
      deepFreeze(entry);
    }
  }
  return value;
}

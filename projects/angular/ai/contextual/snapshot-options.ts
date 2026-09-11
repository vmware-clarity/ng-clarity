/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrContextCategory, ClrContextSnapshotOptions } from './interfaces/context.interface';

/**
 * Default budgets applied while building a snapshot, tuned to keep snapshots compact
 * enough for an AI agent's context window.
 */
export const CLR_CONTEXT_DEFAULT_OPTIONS: Required<ClrContextSnapshotOptions> = {
  maxTextLength: 100,
  maxItemsPerCollection: 25,
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
};

/**
 * The roles each category stands for. `text` and `frames` are not roles but the
 * `includeText` and `includeFrames` switches, and are handled where options resolve.
 */
export const CLR_CONTEXT_CATEGORIES: Record<ClrContextCategory, readonly string[]> = {
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
};

const CATEGORY_NAMES = Object.keys(CLR_CONTEXT_CATEGORIES) as ClrContextCategory[];

/** The roles a set of categories leaves out, for the categories that are roles. */
export function clrContextCategoryRoles(categories: readonly ClrContextCategory[]): string[] {
  return [...new Set(categories.flatMap(category => CLR_CONTEXT_CATEGORIES[category] ?? []))];
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
export const CLR_CONTEXT_PRESETS: Record<ClrContextPreset, ClrContextSnapshotOptions> = {
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
};

/** A preset's options with the caller's overrides applied over them. */
export function clrContextPreset(
  preset: ClrContextPreset,
  overrides: ClrContextSnapshotOptions = {}
): ClrContextSnapshotOptions {
  return { ...CLR_CONTEXT_PRESETS[preset], ...overrides };
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

/** Most entries a selector or role list may hold, and the longest any entry may be. */
const MAX_LIST_ENTRIES = 50;
const MAX_ENTRY_LENGTH = 500;

/**
 * The budgets a snapshot is actually built with: the caller's options over the defaults,
 * with every budget a finite integer inside its range, every list a bounded list of
 * strings, and every enumeration one of its values. Anything else falls back to the
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
    resolved.excludeCategories = stringList(options.excludeCategories).filter((name): name is ClrContextCategory =>
      CATEGORY_NAMES.includes(name as ClrContextCategory)
    );
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
    resolved.rootSelector = options.rootSelector.trim().slice(0, MAX_ENTRY_LENGTH);
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
  for (const key of LIST_KEYS) {
    const limit = ceiling[key];
    if (Array.isArray(limit) && limit.length) {
      capped[key] = [...new Set([...stringList(capped[key] ?? []), ...stringList(limit)])];
    }
  }
  if (Array.isArray(ceiling.excludeCategories) && ceiling.excludeCategories.length) {
    capped.excludeCategories = [
      ...new Set([...(capped.excludeCategories ?? []), ...ceiling.excludeCategories]),
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

function stringList(value: unknown[]): string[] {
  return value
    .filter((entry): entry is string => typeof entry === 'string')
    .map(entry => entry.trim().slice(0, MAX_ENTRY_LENGTH))
    .filter(entry => entry.length > 0)
    .slice(0, MAX_LIST_ENTRIES);
}

function clamp(value: number, range: { min: number; max: number }): number {
  return Math.min(range.max, Math.max(range.min, value));
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/** Compact, serializable description of one piece of UI at the moment of the snapshot. */
export interface ClrComponentContext {
  /** ARIA role, e.g. `'dialog'` or `'grid'`; `'group'` for a component without one, `'text'` for prose. */
  type: string;
  /** Tag name when it adds to the role, e.g. the `clr-modal` rendering a dialog. */
  element?: string;
  /** Human-readable label: a title, heading or accessible name. */
  label?: string;
  /** Current state that is relevant right now, e.g. `{ open: true }` or `{ selectedRows: 3 }`. */
  state?: Record<string, unknown>;
  /** Nested contexts; controls here are as invocable as top-level ones. */
  children?: ClrComponentContext[];
  /** A random, stable handle the mutation engine accepts for this node, present only when mutations are enabled. */
  ref?: string;
}

/** Kinds of content a snapshot can leave out wholesale; each expands to the ARIA roles it covers. */
export type ClrContextCategory =
  'layout' | 'actions' | 'forms' | 'headings' | 'collections' | 'dialogs' | 'status' | 'images' | 'text' | 'frames';

/** Default for `maxItemsPerCollection`, shared with page tooling that calls a publisher directly. */
export const CLR_CONTEXT_DEFAULT_MAX_ITEMS = 25;

/** Budgets applied while building a snapshot, conservative so it fits an agent's context window. */
export interface ClrContextSnapshotOptions {
  /** Maximum length of any single text value. Longer text is truncated. Default `100`. */
  maxTextLength?: number;
  /** Maximum number of items collected per list (rows, tabs, links, options...). Default `25`. */
  maxItemsPerCollection?: number;
  /** Maximum number of components reported. Default `300`; past it the snapshot has `truncated: true`. */
  maxComponents?: number;
  /** Whether to describe what is rendered in the DOM at all. Default `true`. */
  includeDomComponents?: boolean;
  /** Whether to report text that carries no role as `text` nodes. Default `true`. */
  includeText?: boolean;
  /** Whether to report frames; a same-origin frame is described in place. Default `true`. */
  includeFrames?: boolean;
  /** Kinds of content to leave out, e.g. `['layout', 'actions']`. Default none. */
  excludeCategories?: ClrContextCategory[];
  /** Roles whose subtree is left out, e.g. `['navigation', 'banner']`. Default none. */
  excludeRoles?: string[];
  /**
   * CSS selectors for elements to leave out with their subtree, shadow content included. A selector matches
   * within one tree, so `main .secret` does not reach into a shadow root; select the host instead. Default none.
   */
  excludeSelectors?: string[];
  /** CSS selector for the element(s) to describe instead of the whole document. Default: the document. */
  rootSelector?: string;
  /** Deepest nesting of described nodes; `0` means unlimited. Default `0`. */
  maxDepth?: number;
  /** `'modal'` describes only the open modal dialog and sets `focus: 'modal'`. Default `'page'`. */
  focus?: 'page' | 'modal';
  /** `'summary'` reports counts and selection only, without item lists. Default `'all'`. */
  collectionItems?: 'all' | 'summary';
  /** Whether to list the router's configured routes. Default `false`. */
  includeRoutes?: boolean;
}

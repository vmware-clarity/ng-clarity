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

/**
 * Context that application code publishes. Its state is shared only with trusted callers, except the keys
 * listed in `publicKeys`, which untrusted ones (such as `window.clrContext()`) see too.
 */
export interface ClrPublishedContext extends ClrComponentContext {
  /** State keys untrusted callers may see; every other key is withheld from them. Default none. */
  publicKeys?: readonly string[];
  /** Nested contexts, each listing its own public keys. */
  children?: ClrPublishedContext[];
}

/** Kinds of content a snapshot can leave out wholesale; each expands to the ARIA roles it covers. */
export type ClrContextCategory =
  'layout' | 'actions' | 'forms' | 'headings' | 'collections' | 'dialogs' | 'status' | 'images' | 'text' | 'frames';

/** Default for `maxItemsPerCollection`, shared with page tooling that calls a publisher directly. */
export const CLR_CONTEXT_DEFAULT_MAX_ITEMS = 25;

/** Budgets applied while building a snapshot, conservative so it fits an agent's context window. */
export interface ClrContextSnapshotOptions {
  /**
   * What to describe: `'page'` (default) for the whole page, `'modal'` for the open modal dialog (the page when
   * none is open), or a CSS selector for the element(s) to describe.
   */
  root?: string;
  /**
   * CSS selectors for elements to leave out with their subtree, shadow content included. A selector matches
   * within one tree, so `main .secret` does not reach into a shadow root; select the host instead. Default none.
   */
  excludeSelectors?: string[];
  /** Kinds of content to leave out, e.g. `['layout', 'text']`. Default none. */
  excludeCategories?: ClrContextCategory[];
  /** Maximum number of components reported. Default `300`; past it the snapshot has `truncated: true`. */
  maxComponents?: number;
  /** Items listed per collection (rows, tabs, options...); `0` reports counts and selection only. Default `25`. */
  maxItemsPerCollection?: number;
}

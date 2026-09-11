/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Compact, serializable description of a single piece of UI, intended to be consumed
 * by AI agents. Only information that is true at the moment the snapshot is taken
 * should ever be placed here.
 */
export interface ClrComponentContext {
  /** ARIA role describing what this piece of UI is, e.g. `'dialog'`, `'grid'`, `'tablist'`. */
  type: string;
  /**
   * Tag name, when it says something the role cannot — most usefully the custom element
   * that renders a role-bearing node, so a `clr-side-panel` and a `clr-modal` remain
   * distinguishable even though both are dialogs.
   */
  element?: string;
  /** Human-readable label: a title, heading or accessible name. */
  label?: string;
  /** Current state that is relevant right now, e.g. `{ open: true }` or `{ selectedRows: 3 }`. */
  state?: Record<string, unknown>;
  /**
   * Nested contexts, when a component wants to describe its relevant children. A button
   * or link found here, at any depth, is exactly as invocable as one found at the top
   * level: there is no separate flattened list, so nesting is never discarded.
   */
  children?: ClrComponentContext[];
}

/**
 * Budgets applied while building a snapshot. The defaults are deliberately conservative
 * so a snapshot stays small enough to be pasted into an AI agent's context window.
 */
export interface ClrContextSnapshotOptions {
  /** Maximum length of any single text value. Longer text is truncated. Default `100`. */
  maxTextLength?: number;
  /** Maximum number of items collected per list (rows, tabs, links, options...). Default `25`. */
  maxItemsPerCollection?: number;
  /**
   * Maximum number of components reported from the DOM. Default `300`. When the budget
   * runs out the snapshot says so (`truncated: true`), so a consumer can raise it or narrow
   * the scope rather than mistake a cut-off tree for the whole page.
   */
  maxComponents?: number;
  /** Whether to scan the rendered DOM for Clarity components. Default `true`. */
  includeDomComponents?: boolean;
  /**
   * Whether to report visible text that carries no role — a paragraph, a card's body,
   * a status line — as `text` nodes, so what a page says reaches an agent along with
   * what it can do. Default `true`.
   */
  includeText?: boolean;
  /**
   * Whether to describe the contents of same-origin frames in place, as `frame` nodes
   * with children, so a page assembled from embedded plugins is described as one page.
   * A cross-origin frame is reported as a `frame` node without children either way.
   * Default `true`.
   */
  includeFrames?: boolean;
  /**
   * Roles whose whole subtree is left out — `['navigation', 'banner', 'contentinfo']`
   * drops the application chrome that repeats in every snapshot. Default none.
   */
  excludeRoles?: string[];
  /**
   * CSS selectors for elements to leave out with their subtree: chrome that cannot be
   * annotated with `data-clr-context-ignore`, such as a header component. Default none.
   */
  excludeSelectors?: string[];
  /**
   * CSS selector for the element(s) to describe instead of the whole document — `'main'`
   * for the content area only. Nothing outside the matches is described. Default: the
   * whole document.
   */
  rootSelector?: string;
  /**
   * Deepest nesting of described nodes, counted from the top: `1` reports only top-level
   * nodes, `2` their children, and so on. `0` means unlimited. Default `0`.
   */
  maxDepth?: number;
  /**
   * `'modal'`: while a modal dialog is open, describe only the dialog — what the user can
   * act on is the dialog, and the page behind it is exactly the content an agent no longer
   * needs. The snapshot then carries `focus: 'modal'`. Default `'page'`.
   */
  focus?: 'page' | 'modal';
  /**
   * `'summary'`: collections report their counts and current selection only — no item,
   * option or tab lists. Default `'all'`.
   */
  collectionItems?: 'all' | 'summary';
}

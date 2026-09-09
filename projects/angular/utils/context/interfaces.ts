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
  /** Maximum number of components reported from the DOM. Default `100`. */
  maxComponents?: number;
  /** Whether to scan the rendered DOM for Clarity components. Default `true`. */
  includeDomComponents?: boolean;
}

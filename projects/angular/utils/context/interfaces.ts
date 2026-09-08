/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * An action currently available to the user (or to an AI agent driving the UI),
 * such as a visible button or link.
 */
export interface ClrContextAction {
  /** Visible or accessible label of the action. */
  label: string;
  kind: 'button' | 'link';
  disabled?: boolean;
  /** Target of the action when it is a link. */
  href?: string;
}

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
  /** Actions currently available inside this piece of UI. */
  actions?: ClrContextAction[];
  /** Nested contexts, when a component wants to describe its relevant children. */
  children?: ClrComponentContext[];
}

/**
 * Budgets applied while building a snapshot. The defaults are deliberately conservative
 * so a snapshot stays small enough to be pasted into an AI agent's context window.
 */
export interface ClrContextSnapshotOptions {
  /** Maximum length of any single text value. Longer text is truncated. Default `100`. */
  maxTextLength?: number;
  /** Maximum number of items collected per list (rows, tabs, links, actions...). Default `25`. */
  maxItemsPerCollection?: number;
  /** Maximum number of components reported from the DOM. Default `100`. */
  maxComponents?: number;
  /** Whether to scan the rendered DOM for Clarity components. Default `true`. */
  includeDomComponents?: boolean;
  /** Whether to collect currently available actions (buttons and links). Default `true`. */
  includeActions?: boolean;
  /**
   * Whether to include the current value and the selectable options of every form
   * control, keyed by control `name` — what a form-filling agent needs to produce a
   * JSON answer that can be applied back. Password and file inputs are always
   * redacted, opted in or not.
   *
   * Default `false`: turning this on puts user-typed data into snapshots, so it must
   * be a deliberate application decision. Embedded frames can never turn it on through
   * the frame bridge; only the hosting application can.
   */
  includeFormValues?: boolean;
}

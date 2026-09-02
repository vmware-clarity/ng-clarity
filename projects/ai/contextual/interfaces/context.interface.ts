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
  /** Kind of UI this context describes, e.g. `'modal'`, `'datagrid'`, `'region'`. */
  type: string;
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
 * Information about the currently active route, when the application uses the Angular router.
 */
export interface ClrRouteContext {
  /** The current router URL, e.g. `/users/42?tab=details`. */
  url: string;
  /** The configured route path pattern, e.g. `users/:id`. */
  path?: string;
  /** Route parameters of the active route chain. */
  params?: Record<string, string>;
  /** Query parameters of the current URL. */
  queryParams?: Record<string, string>;
  /** JSON-serializable subset of the route `data` of the active route chain. */
  data?: Record<string, unknown>;
}

/**
 * A full snapshot of the page context. This is always computed on demand from the live
 * application state and the rendered DOM — it is never cached, so it cannot contain
 * information about UI that no longer exists.
 */
export interface ClrPageContext {
  /** The document title. */
  title: string;
  /** The current URL (browser location, or router URL when available). */
  url?: string;
  /** Route information, present when the application uses the Angular router. */
  route?: ClrRouteContext;
  /**
   * Application-provided contexts, registered through the `clrContext` directive or a
   * custom {@link ClrContextProvider}. These carry the semantic knowledge only the
   * application has, e.g. "this section manages firewall rules".
   */
  regions: ClrComponentContext[];
  /** Clarity components discovered in the rendered DOM, with their current state. */
  components: ClrComponentContext[];
  /** Page-level actions (buttons and links) currently available to the user. */
  actions?: ClrContextAction[];
  /** ISO timestamp of the moment the snapshot was taken. */
  collectedAt: string;
}

/**
 * Implemented by anything that wants to contribute context to snapshots — Clarity
 * components, application components or the `clrContext` directive.
 *
 * Providers are polled when a snapshot is requested (pull model). They must describe
 * their state as it is at that moment and should return `null` when they currently
 * have nothing useful to report, which keeps snapshots free of noise.
 */
export interface ClrContextProvider {
  getClrContext(): ClrComponentContext | null;
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
   * JSON answer that can be applied back with `applyClrFormValues`. Password and file
   * inputs are always redacted, opted in or not.
   *
   * Default `false`: turning this on puts user-typed data into snapshots, so it must
   * be a deliberate application decision. Embedded frames can never turn it on through
   * the frame bridge; only the hosting application can.
   */
  includeFormValues?: boolean;
}

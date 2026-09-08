/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext, ClrContextAction, ClrContextSnapshotOptions } from '@clr/angular/utils';

import { collectContextTree } from './walk';

/**
 * Default budgets applied while building a snapshot, tuned to keep snapshots compact
 * enough for an AI agent's context window.
 */
export const CLR_CONTEXT_DEFAULT_OPTIONS: Required<ClrContextSnapshotOptions> = {
  maxTextLength: 100,
  maxItemsPerCollection: 25,
  maxComponents: 100,
  includeDomComponents: true,
  includeActions: true,
  includeFormValues: false,
};

export { CLR_CONTEXT_IGNORE_ATTRIBUTE } from './walk';
export type { ClrContextDomExtractor } from './walk';

/** Roles that describe something a user can invoke. */
const ACTION_ROLES = new Set(['button', 'link']);

/**
 * Roles that own the actions inside them. A dialog's buttons belong to the dialog, and a
 * navigation's links belong to the navigation, so neither is reported again as a
 * page-level action.
 */
const ACTION_OWNING_ROLES = new Set(['dialog', 'alertdialog', 'navigation', 'menu', 'listbox']);

/**
 * Describes everything currently rendered, as a tree, by reading the accessibility tree.
 *
 * Clarity components, `@clr/ui` CSS-only markup, other component libraries and plain
 * semantic HTML are all described by the same code: a role means the same thing wherever
 * it appears. Components contribute only what a role cannot express, by publishing
 * through `publishElementContext`.
 *
 * `customExtractors` cover the remainder — markup carrying neither a role nor an
 * accessible name, such as a bare `<div class="card">`.
 */
export function collectClrDomContexts(
  root: ParentNode,
  options?: ClrContextSnapshotOptions,
  customExtractors: import('./walk').ClrContextDomExtractor[] = []
): ClrComponentContext[] {
  return collectContextTree(root, { ...CLR_CONTEXT_DEFAULT_OPTIONS, ...options }, customExtractors);
}

/**
 * Flattens the actions a user can currently invoke out of an already-described tree, so
 * an agent can see what is clickable without walking the whole structure itself.
 *
 * Derived from the tree rather than scanned separately: the walk has already decided what
 * is visible and what is ignored, and re-querying the DOM would risk disagreeing with it.
 */
export function collectClrDomActions(
  components: ClrComponentContext[],
  options?: ClrContextSnapshotOptions
): ClrContextAction[] {
  const resolved = { ...CLR_CONTEXT_DEFAULT_OPTIONS, ...options };
  const actions: ClrContextAction[] = [];
  appendActions(components, actions, resolved.maxItemsPerCollection);
  return actions;
}

function appendActions(nodes: ClrComponentContext[], actions: ClrContextAction[], limit: number): void {
  for (const node of nodes) {
    if (actions.length >= limit) {
      return;
    }
    if (ACTION_OWNING_ROLES.has(node.type)) {
      continue;
    }
    if (ACTION_ROLES.has(node.type)) {
      const action = toAction(node);
      if (action.label || action.href) {
        actions.push(action);
      }
      continue;
    }
    if (node.children?.length) {
      appendActions(node.children, actions, limit);
    }
  }
}

function toAction(node: ClrComponentContext): ClrContextAction {
  const action: ClrContextAction = {
    label: node.label ?? '',
    kind: node.type === 'link' ? 'link' : 'button',
  };
  const href = node.state?.['href'];
  if (typeof href === 'string') {
    action.href = href;
  }
  if (node.state?.['disabled'] === true) {
    action.disabled = true;
  }
  return action;
}

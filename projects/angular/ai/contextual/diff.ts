/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext, ClrPageContext } from './interfaces/context.interface';
import { serialize } from './json-safe';

/** A node whose own state changed between two snapshots, without its children. */
export interface ClrComponentContextChange {
  /** The node as it was in the previous snapshot. */
  before: ClrComponentContext;
  /** The node as it is now. */
  after: ClrComponentContext;
}

/** What changed between two snapshots, so a conversation can send the difference instead of the page. */
export interface ClrContextChange {
  /** The previous snapshot, or `null` for the first, where everything is `added`. */
  previous: ClrPageContext | null;
  /** The snapshot the change leads to. */
  current: ClrPageContext;
  /** Nodes that were not there before, with their subtrees. */
  added: ClrComponentContext[];
  /** Nodes that are gone, without their subtrees. */
  removed: ClrComponentContext[];
  /** Nodes present in both whose own state differs. Their children are compared separately. */
  changed: ClrComponentContextChange[];
  /** Whether the route, URL or view id differs. */
  routeChanged: boolean;
  /** Whether the application's annotations or metadata differ. */
  regionsChanged: boolean;
  /** Whether the document title differs. */
  titleChanged: boolean;
}

/** Compares two snapshots, matching nodes level by level by role, element and label, since nodes have no ids. */
export function clrDiffContext(previous: ClrPageContext | null, current: ClrPageContext): ClrContextChange {
  const change: ClrContextChange = {
    previous,
    current,
    added: [],
    removed: [],
    changed: [],
    routeChanged:
      !previous ||
      serialize(previous.route) !== serialize(current.route) ||
      previous.url !== current.url ||
      previous.viewId !== current.viewId,
    regionsChanged:
      !previous ||
      serialize(previous.regions) !== serialize(current.regions) ||
      serialize(previous.metadata) !== serialize(current.metadata),
    titleChanged: !previous || previous.title !== current.title,
  };
  diffLevel(previous?.components ?? [], current.components, change);
  return change;
}

/** Whether a change carries anything at all. */
export function clrIsEmptyContextChange(change: ClrContextChange): boolean {
  return (
    !change.added.length &&
    !change.removed.length &&
    !change.changed.length &&
    !change.routeChanged &&
    !change.regionsChanged &&
    !change.titleChanged
  );
}

function diffLevel(before: ClrComponentContext[], after: ClrComponentContext[], change: ClrContextChange): void {
  const previousByKey = keyed(before);
  const currentByKey = keyed(after);

  for (const [key, node] of currentByKey) {
    const counterpart = previousByKey.get(key);
    if (!counterpart) {
      change.added.push(node);
      continue;
    }
    if (serialize(counterpart.state) !== serialize(node.state)) {
      change.changed.push({ before: withoutChildren(counterpart), after: withoutChildren(node) });
    }
    diffLevel(counterpart.children ?? [], node.children ?? [], change);
  }
  for (const [key, node] of previousByKey) {
    if (!currentByKey.has(key)) {
      change.removed.push(withoutChildren(node));
    }
  }
}

function keyed(nodes: ClrComponentContext[]): Map<string, ClrComponentContext> {
  const seen = new Map<string, number>();
  const result = new Map<string, ClrComponentContext>();
  for (const node of nodes) {
    const identity = `${node.type}|${node.element ?? ''}|${node.label ?? ''}`;
    const occurrence = seen.get(identity) ?? 0;
    seen.set(identity, occurrence + 1);
    result.set(`${identity}#${occurrence}`, node);
  }
  return result;
}

function withoutChildren(node: ClrComponentContext): ClrComponentContext {
  const shallow = { ...node };
  delete shallow.children;
  return shallow;
}

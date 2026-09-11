/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext, ClrPageContext } from './interfaces/context.interface';

/** A node whose own state changed between two snapshots, without its children. */
export interface ClrComponentContextChange {
  before: ClrComponentContext;
  after: ClrComponentContext;
}

/**
 * What changed between two snapshots. A consumer in a conversation sends this rather
 * than the whole page each turn: "a dialog opened with these controls", "this field's
 * value changed", "that alert went away" — which is what keeps a model's context from
 * filling up with the same page described over and over.
 */
export interface ClrContextChange {
  /** The snapshot before, or `null` for the first one — in which case everything is `added`. */
  previous: ClrPageContext | null;
  current: ClrPageContext;
  /** Nodes that were not there before, with their subtrees. */
  added: ClrComponentContext[];
  /** Nodes that are gone, without their subtrees. */
  removed: ClrComponentContext[];
  /** Nodes present in both whose own state differs. Their children are compared separately. */
  changed: ClrComponentContextChange[];
  /** Whether the route or URL differs. */
  routeChanged: boolean;
  /** Whether the application's annotations differ. */
  regionsChanged: boolean;
  /** Whether the document title differs. */
  titleChanged: boolean;
}

/**
 * Compares two snapshots, matching nodes level by level by what they are — role,
 * rendering element and label — since snapshots carry no ids. Two nodes at the same
 * level that read alike are counted as the same node in order of appearance, which is
 * what a reader would do too.
 */
export function diffClrContext(previous: ClrPageContext | null, current: ClrPageContext): ClrContextChange {
  const change: ClrContextChange = {
    previous,
    current,
    added: [],
    removed: [],
    changed: [],
    routeChanged: !previous || serialize(previous.route) !== serialize(current.route) || previous.url !== current.url,
    regionsChanged: !previous || serialize(previous.regions) !== serialize(current.regions),
    titleChanged: !previous || previous.title !== current.title,
  };
  diffLevel(previous?.components ?? [], current.components, change);
  return change;
}

/** Whether a change carries anything at all. */
export function isEmptyClrContextChange(change: ClrContextChange): boolean {
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

/** Nodes of one level by identity, with a running index so look-alikes stay distinct. */
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

function serialize(value: unknown): string {
  try {
    return JSON.stringify(value ?? null);
  } catch {
    return '';
  }
}

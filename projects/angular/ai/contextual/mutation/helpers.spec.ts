/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture } from '@angular/core/testing';
import { ClrComponentContext } from '@clr/angular/utils';

import { ClrPageContext } from '../interfaces/context.interface';

/** Helpers the mutation specs share: finding nodes and refs in a snapshot, and letting a fixture settle. */

export function findNode(
  nodes: ClrComponentContext[],
  match: (node: ClrComponentContext) => boolean
): ClrComponentContext | null {
  for (const node of nodes) {
    if (match(node)) {
      return node;
    }
    const inside = findNode(node.children ?? [], match);
    if (inside) {
      return inside;
    }
  }
  return null;
}

/** The node matching, or a failure naming what was looked for — never `null` to guard against. */
export function nodeOf(
  snapshot: ClrPageContext,
  match: (node: ClrComponentContext) => boolean,
  what: string
): ClrComponentContext {
  const node = findNode(snapshot.components, match);
  if (!node) {
    throw new Error(`no ${what} in ${JSON.stringify(snapshot.components)}`);
  }
  return node;
}

/** The ref of the node with this label, and this type when one is given. */
export function refOf(snapshot: ClrPageContext, label: string, type?: string): string {
  const node = findNode(
    snapshot.components,
    node => !!node.ref && node.label === label && (!type || node.type === type)
  );
  if (!node?.ref) {
    throw new Error(`no ref for "${label}" in ${JSON.stringify(snapshot.components)}`);
  }
  return node.ref;
}

export function allNodes(nodes: ClrComponentContext[]): ClrComponentContext[] {
  return nodes.flatMap(node => [node, ...allNodes(node.children ?? [])]);
}

export function allRefs(nodes: ClrComponentContext[]): string[] {
  return allNodes(nodes).flatMap(node => (node.ref ? [node.ref] : []));
}

export async function settle(fixture: ComponentFixture<unknown>): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

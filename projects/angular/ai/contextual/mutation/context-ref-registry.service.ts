/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { ClrComponentContext } from '@clr/angular/utils';

import { ClrContextRefSink } from '../dom/walk';

/** What a ref stands for: the node as the snapshot showed it, and the elements behind it. */
export interface ContextRefTarget {
  /**
   * Outermost first: the custom element that renders the control and carries its form
   * binding, then the element inside it that carries the role. Whichever of them has a
   * binding or a published mutator is the one to write to.
   */
  elements: Element[];
  /** The node's `type` in the snapshot — the role, or what the component published. */
  type: string;
  /** The node's `label` in the snapshot, which is what an agent refers to it by. */
  label?: string;
}

/**
 * Keeps the refs the latest snapshot handed out, and resolves them back to elements.
 *
 * A ref is stable: the same element gets the same ref in every snapshot for as long as
 * the document holds it, so an agent that read `e12` last time still has `e12` this
 * time. Only the latest snapshot's refs resolve, though — an element that has dropped
 * out of the snapshot, or the document, is exactly what an agent must not write to on
 * the strength of a description that no longer holds. It is told to read again.
 */
@Injectable({ providedIn: 'root' })
export class ContextRefRegistryService {
  private readonly refsByElement = new WeakMap<Element, string>();
  private latest = new Map<string, ContextRefTarget>();
  private next = 1;

  /**
   * A sink for one walk. The refs it collects replace the previous snapshot's the moment
   * the walk is committed, and not before, so a snapshot that fails midway leaves the
   * last complete one in force.
   */
  begin(): ClrContextRefSink & { commit(): void } {
    const collected = new Map<string, ContextRefTarget>();
    return {
      note: (node: ClrComponentContext, element: Element) => {
        if (!node.ref) {
          node.ref = this.refFor(element);
          collected.set(node.ref, { elements: [element], type: node.type, label: node.label });
          return;
        }
        // The walk finishes a node once per element that produced it, innermost first;
        // an outer element is a second way to reach the same node's binding, and the
        // outer finish is the node as the snapshot will show it.
        const target = collected.get(node.ref);
        if (target) {
          if (!target.elements.includes(element)) {
            target.elements.unshift(element);
          }
          target.type = node.type;
          target.label = node.label;
        }
      },
      commit: () => {
        this.latest = collected;
      },
    };
  }

  /** The elements behind a ref from the latest snapshot, or `null` when it is not one. */
  resolve(ref: string): ContextRefTarget | null {
    return this.latest.get(ref) ?? null;
  }

  /** Forgets every ref, so that none resolves until the next snapshot. */
  clear(): void {
    this.latest = new Map();
  }

  private refFor(element: Element): string {
    let ref = this.refsByElement.get(element);
    if (!ref) {
      ref = `e${this.next++}`;
      this.refsByElement.set(element, ref);
    }
    return ref;
  }
}

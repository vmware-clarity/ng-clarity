/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { ClrComponentContext } from '@clr/angular/utils';

import { topmostModal } from './writability';
import { offersWrite } from './write';
import { ClrContextRefSink } from '../dom/walk';

/** What a ref stands for: the node as a snapshot last showed it, and the elements behind it. */
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

interface StoredTarget {
  elements: WeakRef<Element>[];
  type: string;
  label?: string;
}

/** Length of the random part of a ref: enough that one cannot be guessed, short enough to read. */
const REF_RANDOM_LENGTH = 8;

/**
 * Keeps the refs snapshots hand out, and resolves them back to elements.
 *
 * A ref is stable: the same element gets the same ref in every snapshot, whoever took
 * it and with whatever options, for as long as the document holds the element. It
 * resolves for as long as the element is connected; whether the element may be written
 * to right now — shown, enabled, not redacted — is decided when a write is attempted,
 * not by which snapshot happened to be taken last. A ref is random, so one can only be
 * recalled from a snapshot, never worked out from another.
 *
 * A snapshot hands out a ref only where a write could get somewhere: to a node whose
 * elements carry a form binding or write themselves, and that no open modal dialog
 * stands in front of. A ref is still a candidate rather than a promise: the write may be
 * refused for what is true when it is attempted.
 *
 * Elements are held weakly: a ref to UI that has been removed never keeps it alive.
 */
@Injectable({ providedIn: 'root' })
export class ContextRefRegistryService {
  private readonly refsByElement = new WeakMap<Element, string>();
  private readonly targets = new Map<string, StoredTarget>();

  /**
   * A sink for one walk. What it collects is recorded once the walk is committed, and
   * not before, so a snapshot that fails midway records nothing. Committing takes the
   * refs off the nodes, in the tree the walk produced, that `offered` turns down — by
   * default, those the engine could not write through (see {@link offersWrite}).
   */
  begin(
    offered: (target: ContextRefTarget) => boolean = offersWrite
  ): ClrContextRefSink & { commit(components?: ClrComponentContext[]): void } {
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
      commit: (components = []) => {
        const withheld = new Set<string>();
        // Refs never reach into a frame, so the walk's elements share one document.
        let modal: Element | null | undefined;
        for (const [ref, target] of collected) {
          const control = target.elements[target.elements.length - 1];
          modal = modal === undefined ? topmostModal(control.ownerDocument) : modal;
          if ((modal && !modal.contains(control)) || !offered(target)) {
            withheld.add(ref);
            continue;
          }
          this.targets.set(ref, {
            elements: target.elements.map(element => new WeakRef(element)),
            type: target.type,
            label: target.label,
          });
        }
        if (withheld.size) {
          withoutRefs(components, withheld);
        }
        this.prune();
      },
    };
  }

  /** The elements behind a ref, or `null` when it was never handed out or its element is gone. */
  resolve(ref: string): ContextRefTarget | null {
    const stored = this.targets.get(ref);
    if (!stored) {
      return null;
    }
    const elements = stored.elements.map(element => element.deref());
    if (elements.some(element => !element || !element.isConnected)) {
      return null;
    }
    return { elements: elements as Element[], type: stored.type, label: stored.label };
  }

  /** Forgets refs whose elements have left the document. */
  private prune(): void {
    for (const [ref, stored] of this.targets) {
      if (stored.elements.some(element => !element.deref()?.isConnected)) {
        this.targets.delete(ref);
      }
    }
  }

  private refFor(element: Element): string {
    let ref = this.refsByElement.get(element);
    if (!ref) {
      do {
        ref = `e${randomSuffix()}`;
      } while (this.targets.has(ref));
      this.refsByElement.set(element, ref);
    }
    return ref;
  }
}

/** Takes these refs off the nodes carrying them. */
function withoutRefs(nodes: ClrComponentContext[], refs: ReadonlySet<string>): void {
  for (const node of nodes) {
    if (node.ref && refs.has(node.ref)) {
      delete node.ref;
    }
    withoutRefs(node.children ?? [], refs);
  }
}

function randomSuffix(): string {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  const bytes = crypto.getRandomValues(new Uint8Array(REF_RANDOM_LENGTH));
  return Array.from(bytes, byte => alphabet[byte % alphabet.length]).join('');
}

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

export interface ContextRefTarget {
  /** Outermost first: the custom element with the form binding, then the element with the role. */
  elements: Element[];
  type: string;
  label?: string;
}

interface StoredTarget {
  elements: WeakRef<Element>[];
  type: string;
  label?: string;
}

/** Long enough not to be guessed, short enough to read. */
const REF_RANDOM_LENGTH = 8;

/**
 * Hands out refs and resolves them back to elements. A ref is stable per element, random so it can
 * only be recalled from a snapshot, and held weakly.
 */
@Injectable({ providedIn: 'root' })
export class ContextRefRegistryService {
  private readonly refsByElement = new WeakMap<Element, string>();
  private readonly targets = new Map<string, StoredTarget>();

  /** A sink for one walk, recorded only once the walk commits, so a failed snapshot records nothing. */
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
        // Finished innermost first; the outer finish is the node as the snapshot shows it.
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

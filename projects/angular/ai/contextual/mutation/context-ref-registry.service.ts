/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { ClrComponentContext } from '@clr/angular/utils';

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
 * Elements are held weakly: a ref to UI that has been removed never keeps it alive.
 */
@Injectable({ providedIn: 'root' })
export class ContextRefRegistryService {
  private readonly refsByElement = new WeakMap<Element, string>();
  private readonly targets = new Map<string, StoredTarget>();

  /**
   * A sink for one walk. What it collects is recorded once the walk is committed, and
   * not before, so a snapshot that fails midway records nothing.
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
        for (const [ref, target] of collected) {
          this.targets.set(ref, {
            elements: target.elements.map(element => new WeakRef(element)),
            type: target.type,
            label: target.label,
          });
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

function randomSuffix(): string {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  const bytes = new Uint8Array(REF_RANDOM_LENGTH);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index++) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, byte => alphabet[byte % alphabet.length]).join('');
}

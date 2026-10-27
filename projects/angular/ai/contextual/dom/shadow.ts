/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { readScope } from './read-scope';

/** Where ids resolve and labels are found: the element's shadow root, or its document. */
export type IdScope = Document | ShadowRoot;

/** Hosts described by their own role and name, whose shadow roots are neither walked nor watched. */
const LEAF_HOST_SELECTOR = 'clr-icon, cds-icon';

/**
 * The nodes that render inside `parent`: an open shadow root's content instead of the light DOM, and for
 * a slot in a shadow root, what is assigned to it or else its fallback. Slots stay in the result, so a
 * marker on a slot applies to what it shows.
 */
export function renderedChildNodes(parent: ParentNode): ChildNode[] {
  if (isShadowSlot(parent)) {
    const assigned = parent.assignedNodes() as ChildNode[];
    return assigned.length ? assigned : Array.from(parent.childNodes);
  }
  const source = parent.nodeType === Node.ELEMENT_NODE ? walkedShadowRoot(parent as Element) : null;
  return Array.from((source ?? parent).childNodes);
}

/** The parent in the rendered tree: the slot the element is assigned to, its parent, or its shadow root's host. */
export function parentAcrossShadow(element: Element): Element | null {
  return element.assignedSlot ?? element.parentElement ?? shadowRootOf(element)?.host ?? null;
}

/** `element.closest(selector)` along the rendered tree, through slots and shadow root hosts. */
export function closestAcrossShadow(element: Element, selector: string): Element | null {
  for (let current: Element | null = element; current; current = parentAcrossShadow(current)) {
    if (current.matches(selector)) {
      return current;
    }
  }
  return null;
}

/** `ancestor.contains(node)` along the rendered tree, through slots and shadow root hosts. */
export function containsAcrossShadow(ancestor: Element, node: Element): boolean {
  for (let current: Element | null = node; current; current = parentAcrossShadow(current)) {
    if (current === ancestor) {
      return true;
    }
  }
  return false;
}

/** Whether `root.querySelector(selector)` would find something, looking inside open shadow roots and slots too. */
export function hasRendered(root: ParentNode, selector: string): boolean {
  return !!root.querySelector(selector) || queryRendered(root, selector).length > 0;
}

/** `root.querySelectorAll(selector)`, also inside the open shadow roots under `root` and what their slots show. */
export function queryRendered(root: ParentNode, selector: string): Element[] {
  const found = new Set<Element>();
  for (const scope of [root, ...openShadowRoots(root)]) {
    scope.querySelectorAll(selector).forEach(element => found.add(element));
    for (const slot of Array.from(scope.querySelectorAll('slot')).filter(isShadowSlot)) {
      for (const slotted of slot.assignedElements()) {
        if (slotted.matches(selector)) {
          found.add(slotted);
        }
        queryRendered(slotted, selector).forEach(element => found.add(element));
      }
    }
  }
  return Array.from(found);
}

export function idScope(element: Element): IdScope {
  return shadowRootOf(element) ?? element.ownerDocument;
}

/** Every open shadow root under `root` (its own included) that the walk reads, nested ones too; cached for the walk. */
export function openShadowRoots(root: ParentNode): ShadowRoot[] {
  const cache = readScope()?.shadowRoots;
  const cached = cache?.get(root);
  if (cached) {
    return cached;
  }
  const own = root.nodeType === Node.ELEMENT_NODE ? walkedShadowRoot(root as Element) : null;
  const roots: ShadowRoot[] = own ? [own, ...openShadowRoots(own)] : [];
  for (const element of Array.from(root.querySelectorAll('*'))) {
    const shadowRoot = walkedShadowRoot(element);
    if (shadowRoot) {
      roots.push(shadowRoot, ...openShadowRoots(shadowRoot));
    }
  }
  cache?.set(root, roots);
  return roots;
}

/** The element's open shadow root, unless the element is described as a leaf. */
export function walkedShadowRoot(element: Element): ShadowRoot | null {
  return element.shadowRoot && !element.matches(LEAF_HOST_SELECTOR) ? element.shadowRoot : null;
}

function shadowRootOf(element: Element): ShadowRoot | null {
  const root = element.getRootNode();
  return root.nodeType === Node.DOCUMENT_FRAGMENT_NODE && 'host' in root ? (root as ShadowRoot) : null;
}

/** A slot that projects light DOM; a `<slot>` outside a shadow root is an ordinary element. */
function isShadowSlot(node: ParentNode): node is HTMLSlotElement {
  return node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'SLOT' && !!shadowRootOf(node as Element);
}

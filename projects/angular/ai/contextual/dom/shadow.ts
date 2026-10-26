/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/** Where ids resolve and labels are found: the element's shadow root, or its document. */
export type IdScope = Document | ShadowRoot;

/**
 * The nodes that render inside `parent`: an open shadow root's content instead of the light DOM,
 * with each slot replaced by what is assigned to it (or its fallback), so slotted content is read once.
 */
export function renderedChildNodes(parent: ParentNode): ChildNode[] {
  const source = (parent as Element).shadowRoot ?? parent;
  return Array.from(source.childNodes).flatMap(node =>
    isSlot(node) ? (node.assignedNodes({ flatten: true }) as ChildNode[]) : [node]
  );
}

/** `element.closest(selector)`, continuing past shadow roots to their hosts. */
export function closestAcrossShadow(element: Element, selector: string): Element | null {
  for (let current: Element | undefined = element; current; current = shadowRootOf(current)?.host) {
    const match = current.closest(selector);
    if (match) {
      return match;
    }
  }
  return null;
}

/** `ancestor.contains(node)`, continuing past shadow roots to their hosts. */
export function containsAcrossShadow(ancestor: Element, node: Element): boolean {
  for (let current: Element | undefined = node; current; current = shadowRootOf(current)?.host) {
    if (ancestor.contains(current)) {
      return true;
    }
  }
  return false;
}

/** The parent element, or the host for an element at the top of a shadow root. */
export function parentAcrossShadow(element: Element): Element | null {
  return element.parentElement ?? shadowRootOf(element)?.host ?? null;
}

export function idScope(element: Element): IdScope {
  return shadowRootOf(element) ?? element.ownerDocument;
}

/** Every open shadow root under `root`, nested ones included. */
export function openShadowRoots(root: ParentNode): ShadowRoot[] {
  const roots: ShadowRoot[] = [];
  for (const element of Array.from(root.querySelectorAll('*'))) {
    if (element.shadowRoot) {
      roots.push(element.shadowRoot, ...openShadowRoots(element.shadowRoot));
    }
  }
  return roots;
}

function shadowRootOf(element: Element): ShadowRoot | null {
  const root = element.getRootNode();
  return root.nodeType === Node.DOCUMENT_FRAGMENT_NODE && 'host' in root ? (root as ShadowRoot) : null;
}

function isSlot(node: Node): node is HTMLSlotElement {
  return node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'SLOT';
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Realm-independent shape checks for getScrollableParents(): `instanceof` fails for
// nodes created by a different window's constructors (e.g. an iframe's own Element,
// ShadowRoot, or HTMLHtmlElement classes), so these duck-type via nodeType/tagName
// instead, which works the same regardless of which window created the node.

export function isElementOrShadowRoot(node: Node): boolean {
  return node.nodeType === Node.ELEMENT_NODE || isShadowRoot(node);
}

export function isShadowRoot(node: Node): node is ShadowRoot {
  return node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && 'host' in node;
}

export function isHtmlElement(node: Node): boolean {
  return node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'HTML';
}

// Same-origin-safe: returns null (rather than throwing) if `frameElement` can't be
// read, which happens when `win` is embedded in a cross-origin parent window.
export function getFrameElement(win: Window): Element | null {
  try {
    return win.frameElement;
  } catch {
    return null;
  }
}

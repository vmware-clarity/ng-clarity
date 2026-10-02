/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * What one walk may remember while it reads the page: the page does not change while it
 * is read, so each element's computed style and each control's label are looked up once.
 * Nothing is kept past the walk — a style declaration jsdom hands out, unlike a
 * browser's, does not follow later changes, and a label can be added at any time.
 */
interface ReadScope {
  styles: WeakMap<Element, CSSStyleDeclaration>;
  /** Per document, the first label of every labelled control, in document order. */
  labels: WeakMap<Document, Map<Element, HTMLLabelElement>>;
}

let current: ReadScope | null = null;

/** Runs `read` with lookups shared across it; a scope already open is joined. */
export function withinReadScope<T>(read: () => T): T {
  if (current) {
    return read();
  }
  current = { styles: new WeakMap(), labels: new WeakMap() };
  try {
    return read();
  } finally {
    current = null;
  }
}

/** The open read scope, or `null` outside a walk. */
export function readScope(): ReadScope | null {
  return current;
}

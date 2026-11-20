/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrPublishedContext } from '../interfaces/context.interface';

/** Reads what `[clrContext]` says about the element it sits on. */
export type ClrAnnotationReader = () => Partial<ClrPublishedContext> | null;

// Kept off the elements, so other scripts on the page can neither read nor plant an annotation.
const annotations = new WeakMap<Element, ClrAnnotationReader>();

/** Annotates the element; the teardown removes only this annotation. */
export function annotate(element: Element, read: ClrAnnotationReader): () => void {
  annotations.set(element, read);
  return () => {
    if (annotations.get(element) === read) {
      annotations.delete(element);
    }
  };
}

/** Whether the element carries an annotation that says something. */
export function hasAnnotation(element: Element): boolean {
  return annotations.has(element) && annotationContext(element) !== null;
}

/** What the application says about the element: its label, type and state, or `null` when it says nothing. */
export function annotationContext(element: Element): Partial<ClrPublishedContext> | null {
  let context: Partial<ClrPublishedContext> | null | undefined;
  try {
    context = annotations.get(element)?.();
  } catch {
    return null;
  }
  return context && typeof context === 'object' && saysSomething(context) ? context : null;
}

function saysSomething({ label, type, state }: Partial<ClrPublishedContext>): boolean {
  return !!label || !!type || (!!state && typeof state === 'object' && Object.keys(state).length > 0);
}

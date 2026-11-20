/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isDevMode } from '@angular/core';

import { parentAcrossShadow } from './shadow';
import { attempt } from '../attempt';
import { ClrPublishedContext } from '../interfaces/context.interface';
import { jsonSafe, REGION_DEPTH } from '../json-safe';

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

/** Elements whose annotation describes the view: each root and its annotated ancestors, outermost first. */
export function viewAnnotationHosts(roots: Element[]): Element[] {
  const hosts: Element[] = [];
  for (const root of roots) {
    const chain: Element[] = [];
    for (let element: Element | null = root; element; element = parentAcrossShadow(element)) {
      if (hasAnnotation(element) && !hosts.includes(element)) {
        chain.unshift(element);
      }
    }
    hosts.push(...chain);
  }
  return hosts;
}

/** The JSON object in `text`, such as a loaded file; `null`, with a dev-mode warning, when it is too long, invalid or not an object. */
export function parseJsonObject(
  text: string | null,
  source: string,
  maxLength: number
): Record<string, unknown> | null {
  if (text === null) {
    return null;
  }
  if (text.length > maxLength) {
    warnLeftOut(`${source} is longer than ${maxLength} characters`);
    return null;
  }
  const parsed: unknown = attempt(() => JSON.parse(text), undefined);
  if (!isRecord(parsed)) {
    warnLeftOut(`${source} is not a JSON object`);
    return null;
  }
  const safe = jsonSafe(parsed, REGION_DEPTH);
  return isRecord(safe) ? safe : null;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function warnLeftOut(message: string): void {
  if (isDevMode()) {
    console.warn(`${message} and was left out of the snapshot.`);
  }
}

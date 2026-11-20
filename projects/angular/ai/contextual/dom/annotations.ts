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

/** Host element property through which `[clrContext]` annotates the element it sits on. */
export const CLR_CONTEXT_ANNOTATION_PROPERTY = 'clrContextAnnotation';

/** What the element is about, as `[clrContext]` sets it, for markup without Angular. */
export const CLR_CONTEXT_LABEL_ATTRIBUTE = 'data-clr-context';

/** The kind of UI annotated, as `[clrContextType]` sets it. */
export const CLR_CONTEXT_TYPE_ATTRIBUTE = 'data-clr-context-type';

/** The annotated UI's state as a JSON object, as `[clrContextState]` sets it. */
export const CLR_CONTEXT_STATE_ATTRIBUTE = 'data-clr-context-state';

/**
 * The URL of an annotation as JSON (`{ "label", "type", "state" }`), loaded once per session.
 * Read on the view's root and its ancestors, where it describes the view.
 */
export const CLR_CONTEXT_URL_ATTRIBUTE = 'data-clr-context-url';

const ANNOTATION_ATTRIBUTES = [CLR_CONTEXT_LABEL_ATTRIBUTE, CLR_CONTEXT_TYPE_ATTRIBUTE, CLR_CONTEXT_STATE_ATTRIBUTE];

/** An annotation in an attribute is meant to be small. */
const MAX_ATTRIBUTE_LENGTH = 8 * 1024;

interface Annotation {
  getClrContext(): Partial<ClrPublishedContext> | null;
}

/** The JSON object in `text`; `null`, with a dev-mode warning, when it is too long, invalid or not an object. */
export function parseJsonObject(
  text: string | null,
  source: string,
  maxLength = MAX_ATTRIBUTE_LENGTH
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

/** Elements whose annotation describes the view: each root and its annotated ancestors, outermost first. */
export function viewAnnotationHosts(roots: Element[]): Element[] {
  const hosts: Element[] = [];
  for (const root of roots) {
    const chain: Element[] = [];
    for (let element: Element | null = root; element; element = parentAcrossShadow(element)) {
      const annotated = hasAnnotation(element) || element.hasAttribute(CLR_CONTEXT_URL_ATTRIBUTE);
      if (annotated && !hosts.includes(element)) {
        chain.unshift(element);
      }
    }
    hosts.push(...chain);
  }
  return hosts;
}

/** Whether the element carries an annotation that says something. */
export function hasAnnotation(element: Element): boolean {
  return (
    (CLR_CONTEXT_ANNOTATION_PROPERTY in element && annotationContext(element) !== null) ||
    ANNOTATION_ATTRIBUTES.some(attribute => element.hasAttribute(attribute))
  );
}

/**
 * What the application says about the element: its label, type and state.
 * `[clrContext]` wins over the attributes, which are for markup without Angular.
 */
export function annotationContext(element: Element): Partial<ClrPublishedContext> | null {
  const directive = (element as Element & { [CLR_CONTEXT_ANNOTATION_PROPERTY]?: Annotation })[
    CLR_CONTEXT_ANNOTATION_PROPERTY
  ];
  const annotated = attempt(() => directive?.getClrContext() ?? null, null);
  return annotated ?? attributeAnnotation(element);
}

/** An annotation as JSON, such as one loaded from a URL, reduced to its known fields. */
export function annotationFrom(value: unknown): Partial<ClrPublishedContext> | null {
  if (!isRecord(value)) {
    return null;
  }
  const { label, type, state } = value;
  return annotation(
    typeof label === 'string' ? label : null,
    typeof type === 'string' ? type : null,
    isRecord(state) ? state : null
  );
}

function attributeAnnotation(element: Element): Partial<ClrPublishedContext> | null {
  const state = parseJsonObject(element.getAttribute(CLR_CONTEXT_STATE_ATTRIBUTE), CLR_CONTEXT_STATE_ATTRIBUTE);
  return annotation(
    element.getAttribute(CLR_CONTEXT_LABEL_ATTRIBUTE),
    element.getAttribute(CLR_CONTEXT_TYPE_ATTRIBUTE),
    state
  );
}

function annotation(
  label: string | null,
  type: string | null,
  state: Record<string, unknown> | null
): Partial<ClrPublishedContext> | null {
  if (!label && !type && !state) {
    return null;
  }
  const context: Partial<ClrPublishedContext> = {};
  if (type) {
    context.type = type;
  }
  if (label) {
    context.label = label;
  }
  if (state) {
    context.state = state;
  }
  return context;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function warnLeftOut(message: string): void {
  if (isDevMode()) {
    console.warn(`${message} and was left out of the snapshot.`);
  }
}

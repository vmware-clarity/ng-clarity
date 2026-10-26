/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isDevMode } from '@angular/core';
import { ClrComponentContext } from '@clr/angular/utils';

import { parentAcrossShadow } from './shadow';
import { attempt } from '../attempt';
import { jsonSafe, REGION_DEPTH } from '../json-safe';

/**
 * A JSON object about the view when it sits on the view's root or an ancestor of it, or about the
 * piece of UI it sits on anywhere else, where it is reported as the node's `state.metadata`.
 */
export const CLR_AI_METADATA_ATTRIBUTE = 'data-ai-metadata';

/** The URL of a JSON object about the view; read on the view's root and its ancestors. */
export const CLR_AI_METADATA_URL_ATTRIBUTE = 'data-ai-metadata-url';

/** What a piece of UI is about, as `[clrContext]` sets it, for pages without Angular. */
export const CLR_CONTEXT_LABEL_ATTRIBUTE = 'data-clr-context';

/** The kind of UI annotated, as `[clrContextType]` sets it. */
export const CLR_CONTEXT_TYPE_ATTRIBUTE = 'data-clr-context-type';

/** The annotated UI's state as a JSON object, as `[clrContextState]` sets it. */
export const CLR_CONTEXT_STATE_ATTRIBUTE = 'data-clr-context-state';

const ANNOTATION_ATTRIBUTES = [
  CLR_CONTEXT_LABEL_ATTRIBUTE,
  CLR_CONTEXT_TYPE_ATTRIBUTE,
  CLR_CONTEXT_STATE_ATTRIBUTE,
  CLR_AI_METADATA_ATTRIBUTE,
];

/** Metadata in an attribute is meant to be small. */
const MAX_ATTRIBUTE_LENGTH = 8 * 1024;

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

/** Elements carrying view metadata: each root and its ancestors, outermost first. */
export function viewMetadataHosts(roots: Element[]): Element[] {
  const hosts: Element[] = [];
  for (const root of roots) {
    const chain: Element[] = [];
    for (let element: Element | null = root; element; element = parentAcrossShadow(element)) {
      const annotated =
        element.hasAttribute(CLR_AI_METADATA_ATTRIBUTE) || element.hasAttribute(CLR_AI_METADATA_URL_ATTRIBUTE);
      if (annotated && !hosts.includes(element)) {
        chain.unshift(element);
      }
    }
    hosts.push(...chain);
  }
  return hosts;
}

export function hasAnnotation(element: Element): boolean {
  return ANNOTATION_ATTRIBUTES.some(attribute => element.hasAttribute(attribute));
}

/** The context the annotation attributes give the element; `data-ai-metadata` only when `withMetadata`. */
export function annotationContext(element: Element, withMetadata: boolean): Partial<ClrComponentContext> | null {
  const label = element.getAttribute(CLR_CONTEXT_LABEL_ATTRIBUTE);
  const type = element.getAttribute(CLR_CONTEXT_TYPE_ATTRIBUTE);
  const state = parseJsonObject(element.getAttribute(CLR_CONTEXT_STATE_ATTRIBUTE), CLR_CONTEXT_STATE_ATTRIBUTE);
  const metadata = withMetadata
    ? parseJsonObject(element.getAttribute(CLR_AI_METADATA_ATTRIBUTE), CLR_AI_METADATA_ATTRIBUTE)
    : null;
  if (!label && !type && !state && !metadata) {
    return null;
  }
  const context: Partial<ClrComponentContext> = {};
  if (type) {
    context.type = type;
  }
  if (label) {
    context.label = label;
  }
  if (state || metadata) {
    context.state = metadata ? { ...state, metadata } : { ...state };
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

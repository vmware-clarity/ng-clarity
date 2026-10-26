/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isDevMode } from '@angular/core';
import { CLR_ELEMENT_CONTEXT_PROPERTY, ClrComponentContext, ClrContextSnapshotOptions } from '@clr/angular/utils';

import { truncate } from './text';
import { defineOwn, jsonSafe, STATE_DEPTH } from '../json-safe';

/** Reads an element's published context. A callback that throws counts as nothing, with a dev-mode warning. */
export function readClrElementContext(
  element: Element,
  options: Required<ClrContextSnapshotOptions>
): Partial<ClrComponentContext> | null {
  const callback = (element as Element & { [CLR_ELEMENT_CONTEXT_PROPERTY]?: unknown })[CLR_ELEMENT_CONTEXT_PROPERTY];
  if (typeof callback !== 'function') {
    return null;
  }
  try {
    const published = callback(options);
    return published && typeof published === 'object' ? (published as Partial<ClrComponentContext>) : null;
  } catch (error) {
    warnLeftOut(element, error);
    return null;
  }
}

function warnLeftOut(element: Element, error: unknown): void {
  if (isDevMode()) {
    console.warn(
      `The context <${element.tagName.toLowerCase()}> published could not be read and was left out of the snapshot.`,
      error
    );
  }
}

/**
 * Merges the context from an element's annotation attributes, then its published context, over the
 * DOM-extracted one; published values win.
 */
export function mergeElementContext(
  base: ClrComponentContext,
  element: Element,
  options: Required<ClrContextSnapshotOptions>,
  annotation: Partial<ClrComponentContext> | null = null
): ClrComponentContext {
  const published = readClrElementContext(element, options);
  const source =
    annotation && published
      ? { ...annotation, ...published, state: { ...annotation.state, ...published.state } }
      : (published ?? annotation);
  if (!source) {
    return base;
  }
  let own: Partial<ClrComponentContext>;
  try {
    own = publishedParts(source, options, PUBLISHED_DEPTH);
  } catch (error) {
    warnLeftOut(element, error);
    return base;
  }
  const merged: ClrComponentContext = { ...base, state: { ...base.state, ...own.state } };
  if (own.type) {
    merged.type = own.type;
  }
  if (own.element) {
    merged.element = own.element;
  }
  if (own.label !== undefined) {
    merged.label = own.label;
  }
  if (own.children) {
    merged.children = own.children;
  }
  return merged;
}

const PUBLISHED_DEPTH = 4;

/**
 * A node as application code published it, reduced to plain, budgeted, serialisable data.
 * A snapshot is data other code serialises and sends, so anything else is dropped.
 */
export function publishedNode(
  value: unknown,
  options: Required<ClrContextSnapshotOptions>,
  depth = PUBLISHED_DEPTH
): ClrComponentContext | null {
  let parts: Partial<ClrComponentContext>;
  try {
    parts = publishedParts(value, options, depth);
  } catch {
    return null;
  }
  if (!parts.type) {
    return null;
  }
  const node: ClrComponentContext = { type: parts.type };
  if (parts.element) {
    node.element = parts.element;
  }
  if (parts.label !== undefined) {
    node.label = parts.label;
  }
  if (parts.state && Object.keys(parts.state).length) {
    node.state = parts.state;
  }
  if (parts.children) {
    node.children = parts.children;
  }
  return node;
}

function publishedParts(
  value: unknown,
  options: Required<ClrContextSnapshotOptions>,
  depth: number
): Partial<ClrComponentContext> {
  if (!value || typeof value !== 'object') {
    return {};
  }
  const source = value as Record<string, unknown>;
  const ownState: Record<string, unknown> = {};
  const parts: Partial<ClrComponentContext> = { state: ownState };
  if (typeof source['type'] === 'string' && source['type']) {
    parts.type = truncate(source['type'], MAX_TYPE_LENGTH);
  }
  if (typeof source['element'] === 'string' && source['element']) {
    parts.element = truncate(source['element'], MAX_TYPE_LENGTH);
  }
  if (typeof source['label'] === 'string') {
    parts.label = truncate(source['label'], options.maxTextLength);
  }
  const state = source['state'];
  if (state && typeof state === 'object' && !Array.isArray(state)) {
    for (const [key, entry] of Object.entries(state)) {
      const safe = jsonSafe(entry, STATE_DEPTH, true, options);
      if (safe !== undefined) {
        defineOwn(ownState, key, safe);
      }
    }
  }
  if (depth > 0 && Array.isArray(source['children'])) {
    // Published children are not walked, so the collection budget bounds them instead.
    parts.children = source['children']
      .slice(0, options.maxItemsPerCollection)
      .map(child => publishedNode(child, options, depth - 1))
      .filter((child): child is ClrComponentContext => child !== null);
  }
  return parts;
}

const MAX_TYPE_LENGTH = 64;

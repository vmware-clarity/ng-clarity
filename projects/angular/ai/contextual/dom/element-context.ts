/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isDevMode } from '@angular/core';
import { CLR_ELEMENT_CONTEXT_PROPERTY, ClrComponentContext, ClrContextSnapshotOptions } from '@clr/angular/utils';

import { truncate } from './text';
import { jsonSafe, STATE_DEPTH } from '../json-safe';

/**
 * Reads an element's published context, if any. A callback that throws is treated as
 * having nothing to say — one broken publisher must not break the snapshot — and in
 * development says so on the console, so the component's author hears of it.
 */
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

/** In development, says on the console that what an element published was left out, and why. */
function warnLeftOut(element: Element, error: unknown): void {
  if (isDevMode()) {
    console.warn(
      `The context <${element.tagName.toLowerCase()}> published could not be read and was left out of the snapshot.`,
      error
    );
  }
}

/**
 * Merges an element's published context over a DOM-extracted one. Published values win
 * — the component knows itself better than the markup does — and states are merged
 * key-wise. What is published is reduced first (see {@link publishedNode}).
 */
export function mergeElementContext(
  base: ClrComponentContext,
  element: Element,
  options: Required<ClrContextSnapshotOptions>
): ClrComponentContext {
  const published = readClrElementContext(element, options);
  if (!published) {
    return base;
  }
  let own: Partial<ClrComponentContext>;
  try {
    own = publishedParts(published, options, PUBLISHED_DEPTH);
  } catch (error) {
    // Reading what was published can throw too — a getter in its state — and counts as
    // having published nothing.
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

/** How many levels of children a publisher or an extractor may nest. */
const PUBLISHED_DEPTH = 4;

/**
 * A node as application code published or extracted it, reduced to what a snapshot may
 * carry: a string `type` (without one there is no node), a string `element` and `label`
 * with the label held to the text budget, state reduced to its plain, serialisable part
 * with long strings shortened and lists held to the collection budget, and children
 * reduced the same way, a few levels deep. Anything else is dropped — a DOM element, a
 * function, a circular object, an unknown key — because a snapshot is data other code
 * serialises and sends.
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
  const parts: Partial<ClrComponentContext> = { state: {} };
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
      const safe = bounded(jsonSafe(entry, STATE_DEPTH, true), options);
      if (safe !== undefined) {
        Object.defineProperty(parts.state, key, { value: safe, enumerable: true, writable: true, configurable: true });
      }
    }
  }
  if (depth > 0 && Array.isArray(source['children'])) {
    // Children a component publishes are not walked, so they are not counted against the
    // component budget either; the collection budget bounds them instead.
    parts.children = source['children']
      .slice(0, options.maxItemsPerCollection)
      .map(child => publishedNode(child, options, depth - 1))
      .filter((child): child is ClrComponentContext => child !== null);
  }
  return parts;
}

/** The longest a published `type` or `element` name may be. */
const MAX_TYPE_LENGTH = 64;

/** Serialisable data with strings held to the text budget and lists to the collection budget. */
function bounded(value: unknown, options: Required<ClrContextSnapshotOptions>): unknown {
  if (typeof value === 'string') {
    return truncate(value, options.maxTextLength);
  }
  if (Array.isArray(value)) {
    return value.slice(0, options.maxItemsPerCollection).map(entry => bounded(entry, options));
  }
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      Object.defineProperty(result, key, {
        value: bounded(entry, options),
        enumerable: true,
        writable: true,
        configurable: true,
      });
    }
    return result;
  }
  return value;
}

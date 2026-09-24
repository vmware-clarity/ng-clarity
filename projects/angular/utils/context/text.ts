/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * How many items a published collection lists when the caller gives no budget: the
 * same default `maxItemsPerCollection` the contextual engine applies, so a component
 * called by other page tooling reports no more than the engine would ask for.
 */
export const CLR_CONTEXT_DEFAULT_MAX_ITEMS = 25;

/**
 * Text as page-context tooling compares it: whitespace collapsed and trimmed, and
 * lowercased unless `lowercase` is false. Components that publish labels and the engine
 * that matches an agent's words against them use this one rule, so the two never
 * disagree about whether "Beta  cluster" and "beta cluster" are the same option.
 */
export function normalizeContextText(text: string, lowercase = true): string {
  const collapsed = text.replace(/\s+/g, ' ').trim();
  return lowercase ? collapsed.toLowerCase() : collapsed;
}

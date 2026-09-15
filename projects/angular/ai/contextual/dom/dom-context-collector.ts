/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext, ClrContextSnapshotOptions } from '@clr/angular/utils';

import { ClrContextDomExtractor, ClrContextTreeResult, collectContextTreeWithin } from './walk';
import { resolveSnapshotOptions } from '../snapshot-options';

export { CLR_CONTEXT_DEFAULT_OPTIONS } from '../snapshot-options';
export { CLR_CONTEXT_REDACT_ATTRIBUTE } from './aria-state';
export { CLR_CONTEXT_IGNORE_ATTRIBUTE } from './walk';
export type { ClrContextDomExtractor, ClrContextTreeResult } from './walk';

/**
 * Describes everything currently rendered, as a tree, by reading the accessibility tree.
 *
 * Clarity components, `@clr/ui` CSS-only markup, other component libraries and plain
 * semantic HTML are all described by the same code: a role means the same thing wherever
 * it appears. Components contribute only what a role cannot express, by publishing
 * through `publishElementContext`.
 *
 * A button or link is reported wherever it actually is in the tree — inside the dialog,
 * the heading, the alert that owns it — never pulled out into a separate flattened list.
 * Nesting is the only representation of "this belongs to that": an agent looking for
 * what it can invoke inside a specific dialog walks that dialog's own `children`, the
 * same way it would read the rendered page.
 *
 * `customExtractors` cover the remainder — markup carrying neither a role nor an
 * accessible name, such as a bare `<div class="card">`.
 */
export function collectClrDomContexts(
  root: ParentNode,
  options?: ClrContextSnapshotOptions,
  customExtractors: ClrContextDomExtractor[] = []
): ClrComponentContext[] {
  return collectClrDomContextTree(root, options, customExtractors).components;
}

/**
 * {@link collectClrDomContexts}, also reporting whether the component budget ran out
 * before the whole page was described.
 */
export function collectClrDomContextTree(
  root: ParentNode,
  options?: ClrContextSnapshotOptions,
  customExtractors: ClrContextDomExtractor[] = []
): ClrContextTreeResult {
  return collectContextTreeWithin(root, resolveSnapshotOptions(options), customExtractors);
}

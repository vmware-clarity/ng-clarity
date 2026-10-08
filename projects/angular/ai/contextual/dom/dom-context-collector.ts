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
export type { ClrContextDomExtractor, ClrContextTreeResult } from './walk';

/**
 * Describes everything currently rendered, as a tree, by reading the accessibility tree.
 *
 * Clarity components, `@clr/ui` CSS-only markup, other component libraries and plain
 * semantic HTML are all described by the same code: a role means the same thing wherever
 * it appears. Components contribute only what a role cannot express, by publishing
 * through `clrPublishElementContext`.
 *
 * A button or link is reported wherever it actually is in the tree — inside the dialog,
 * the heading, the alert that owns it — never pulled out into a separate flattened list.
 * Nesting is the only representation of "this belongs to that": an agent looking for
 * what it can invoke inside a specific dialog walks that dialog's own `children`, the
 * same way it would read the rendered page. The exception is a summarised collection: a
 * table or grid reports its columns, row count and the form controls in its cells, and
 * no other cell content, buttons and links included.
 *
 * `customExtractors` cover the remainder — markup carrying neither a role nor an
 * accessible name, such as a bare `<div class="card">`.
 */
export function clrCollectDomContexts(
  root: ParentNode,
  options?: ClrContextSnapshotOptions,
  customExtractors: ClrContextDomExtractor[] = []
): ClrComponentContext[] {
  return clrCollectDomContextTree(root, options, customExtractors).components;
}

/**
 * {@link clrCollectDomContexts}, also reporting whether the component budget ran out
 * before the whole page was described.
 */
export function clrCollectDomContextTree(
  root: ParentNode,
  options?: ClrContextSnapshotOptions,
  customExtractors: ClrContextDomExtractor[] = []
): ClrContextTreeResult {
  return collectContextTreeWithin(root, resolveSnapshotOptions(options), customExtractors);
}

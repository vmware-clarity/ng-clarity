/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrContextSnapshotOptions } from '@clr/angular/utils';

import { ClrContextDomExtractor, ClrContextTreeResult, collectContextTreeWithin } from './walk';
import { resolveSnapshotOptions } from '../snapshot-options';

export { CLR_CONTEXT_DEFAULT_OPTIONS } from '../snapshot-options';
export type { ClrContextDomExtractor, ClrContextTreeResult } from './walk';

/**
 * Describes everything rendered under `root` as a tree, and whether the budget ran out.
 * `customExtractors` describe markup with neither a role nor an accessible name.
 */
export function clrCollectDomContextTree(
  root: ParentNode,
  options?: ClrContextSnapshotOptions,
  customExtractors: ClrContextDomExtractor[] = []
): ClrContextTreeResult {
  return collectContextTreeWithin(root, resolveSnapshotOptions(options), customExtractors);
}

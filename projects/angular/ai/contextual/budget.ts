/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext } from '@clr/angular/utils';

/** `nodes` without those of an `excluded` type, which go with their children. For trees that are not walked: published children. */
export function withoutTypes(nodes: ClrComponentContext[], excluded: ReadonlySet<string>): ClrComponentContext[] {
  return nodes
    .filter(node => !excluded.has(node.type))
    .map(node => (node.children ? { ...node, children: withoutTypes(node.children, excluded) } : node));
}

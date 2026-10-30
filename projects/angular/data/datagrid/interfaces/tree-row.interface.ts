/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridCell } from '../datagrid-cell';
import { DatagridTreeNode } from '../providers/tree-node.model';

/**
 * What a cell needs from its row to render the tree toggle.
 */
export interface DatagridTreeRow {
  readonly _treeNode: DatagridTreeNode<unknown> | undefined;
  readonly _treeCells: ClrDatagridCell[];
  readonly _treeLabelCell: ClrDatagridCell | undefined;
}

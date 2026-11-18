/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridCell } from '../datagrid-cell';
import { DatagridTreeNode } from '../providers/tree-node.model';

/**
 * What the cells of a tree row render: the node of the row, the cells that carry the indentation and
 * the expand toggle, and the cell that names the row on its toggles.
 */
export interface DatagridTreeRowCells<T = unknown> {
  readonly node: DatagridTreeNode<T>;
  readonly toggleCells: ReadonlySet<ClrDatagridCell>;
  readonly labelCell: ClrDatagridCell | undefined;
}

/**
 * What a cell needs from its row to render the tree toggle.
 */
export interface DatagridTreeRow {
  /** `null` while the row has no tree node, like the rows of items still loading. */
  readonly _tree: DatagridTreeRowCells | null;
}

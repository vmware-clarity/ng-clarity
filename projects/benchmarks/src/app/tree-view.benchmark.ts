/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, signal, viewChild } from '@angular/core';
import { ClrTree, ClrTreeViewModule } from '@clr/angular';

import { sizeParam } from './data';

interface Node {
  name: string;
  children: Node[];
}

/**
 * A tree of `count` roots with `branching` children per node, `depth` levels deep.
 */
function generateTree(count: number, branching: number, depth: number, prefix = ''): Node[] {
  return Array.from({ length: count }, (_, i) => {
    const name = prefix ? `${prefix}.${i + 1}` : `${i + 1}`;
    return { name, children: depth > 1 ? generateTree(branching, branching, depth - 1, name) : [] };
  });
}

@Component({
  selector: 'app-tree-view-benchmark',
  imports: [ClrTreeViewModule],
  template: `
    <button type="button" data-bench="render" (click)="roots.set(all)">Render tree</button>
    <button type="button" data-bench="expand-binding" (click)="expanded.set(true)">Expand all (binding)</button>
    <button type="button" data-bench="expand-all" (click)="tree().expandAll()">Expand all (expandAll)</button>

    <clr-tree>
      <clr-tree-node *clrRecursiveFor="let node of roots(); getChildren: getChildren" [clrExpanded]="expanded()">
        {{ node.name }}
      </clr-tree-node>
    </clr-tree>
  `,
})
export class TreeViewBenchmark {
  // 10 roots with 6 children per node on 4 levels: 2,590 nodes by default, 259 per root.
  readonly all = generateTree(sizeParam(10), 6, 4);
  readonly roots = signal<Node[]>([]);
  readonly expanded = signal(false);
  readonly tree = viewChild.required(ClrTree);

  getChildren = (node: Node) => node.children;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { spec, TestContext } from '@clr/angular/testing';

import { ClrTree } from './tree';
import { TreeFocusManagerService } from './tree-focus-manager.service';
import { ClrTreeNode } from './tree-node';
import { ClrTreeViewModule } from './tree-view.module';

interface PerfNode {
  name: string;
  children?: PerfNode[];
}

/*
 * Shape of the generated tree: 10 roots with 7 children per node on 4 levels = 4,000 nodes.
 */
const ROOTS = 10;
const BRANCHING = 7;
const DEPTH = 4;

/*
 * Generous upper bounds, so that this spec catches regressions of an order of magnitude
 * without being flaky on slow CI machines. The actual timings are logged for reference.
 */
const MAX_BUILD_MS = 15000;
const MAX_CHANGE_DETECTION_MS = 2000;
const MAX_FOCUS_MS = 50;

@Component({
  template: `
    <clr-tree>
      <clr-tree-node
        *clrRecursiveFor="let node of roots; getChildren: getChildren"
        [clrForTypeAhead]="node.name"
        [clrExpanded]="expanded[node.name]"
      >
        {{ node.name }}
      </clr-tree-node>
    </clr-tree>
  `,
  standalone: false,
})
class PerformanceTestComponent {
  @ViewChild(ClrTree) tree: ClrTree<PerfNode>;

  roots: PerfNode[] = generateTree(ROOTS, BRANCHING, DEPTH);
  expanded: { [name: string]: boolean } = {};

  getChildren = (node: PerfNode) => node.children;
}

function generateTree(count: number, branching: number, depth: number, prefix = ''): PerfNode[] {
  const nodes: PerfNode[] = [];
  for (let i = 0; i < count; i++) {
    const name = prefix ? `${prefix}.${i + 1}` : `${i + 1}`;
    const node: PerfNode = { name };
    if (depth > 1) {
      node.children = generateTree(branching, branching, depth - 1, name);
    }
    nodes.push(node);
  }
  return nodes;
}

function countNodes(nodes: PerfNode[]): number {
  return nodes.reduce((total, node) => total + 1 + (node.children ? countNodes(node.children) : 0), 0);
}

function timed(label: string, action: () => void): number {
  const start = performance.now();
  action();
  const duration = performance.now() - start;
  console.log(`[tree-view performance] ${label}: ${duration.toFixed(1)}ms`);
  return duration;
}

export default function (): void {
  describe('ClrTree performance on a large eager recursive tree', function () {
    type Context = TestContext<ClrTree<PerfNode>, PerformanceTestComponent>;

    const totalNodes = countNodes(generateTree(ROOTS, BRANCHING, DEPTH));
    let buildMs: number;

    spec(ClrTree, PerformanceTestComponent, ClrTreeViewModule, { imports: [NoopAnimationsModule] }, false);

    beforeEach(function (this: Context) {
      buildMs = timed(`build ${totalNodes} nodes`, () => this.init());
    });

    function nodes(context: Context): ClrTreeNode<PerfNode>[] {
      return context.fixture.debugElement.queryAll(By.directive(ClrTreeNode)).map(de => de.componentInstance);
    }

    it('renders every node of the tree', function (this: Context) {
      expect(nodes(this).length).toBe(totalNodes);
      expect(buildMs).toBeLessThan(MAX_BUILD_MS);
    });

    it('runs a change detection pass with no changes within bounds', function (this: Context) {
      const noopMs = timed('change detection with no changes', () => this.detectChanges());
      expect(noopMs).toBeLessThan(MAX_CHANGE_DETECTION_MS);
    });

    it('expands and collapses a root node within bounds', function (this: Context) {
      const subtreeParents = (totalNodes - ROOTS * Math.pow(BRANCHING, DEPTH - 1)) / ROOTS;

      const expandMs = timed('expand a root and change detection', () => {
        this.testComponent.expanded = expandedMap(this.testComponent.roots[0]);
        this.detectChanges();
      });
      expect(this.clarityElement.querySelectorAll('[aria-expanded="true"]').length).toBe(subtreeParents);

      const collapseMs = timed('collapse a root and change detection', () => {
        this.testComponent.expanded = {};
        this.detectChanges();
      });
      expect(this.clarityElement.querySelectorAll('[aria-expanded="true"]').length).toBe(0);

      expect(expandMs).toBeLessThan(MAX_CHANGE_DETECTION_MS);
      expect(collapseMs).toBeLessThan(MAX_CHANGE_DETECTION_MS);
    });

    it('moves the focus within bounds', function (this: Context) {
      const focusManager = this.getClarityProvider(TreeFocusManagerService);
      const roots = this.fixture.debugElement
        .queryAll(By.directive(ClrTreeNode))
        .filter(de => !(de.componentInstance as ClrTreeNode<PerfNode>)._model.parent);
      const first: ClrTreeNode<PerfNode> = roots[0].componentInstance;
      const last: ClrTreeNode<PerfNode> = roots[roots.length - 1].componentInstance;
      first.focusTreeNode();
      const focusMs = timed('focus request on the last root node', () => focusManager.focusNode(last._model));
      expect(document.activeElement).toBe(
        roots[roots.length - 1].nativeElement.querySelector('.clr-tree-node-content-container')
      );
      expect(focusMs).toBeLessThan(MAX_FOCUS_MS);
    });
  });
}

function expandedMap(root: PerfNode, map: { [name: string]: boolean } = {}) {
  map[root.name] = true;
  (root.children || []).forEach(child => expandedMap(child, map));
  return map;
}

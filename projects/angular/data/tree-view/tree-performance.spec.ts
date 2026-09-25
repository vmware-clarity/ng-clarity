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
 * Wall-clock bounds sit an order of magnitude above what a developer machine measures, so they only catch
 * catastrophic regressions and do not flake on shared CI runners. The regression that actually matters here,
 * collapsed subtrees being rendered again, is asserted directly rather than timed.
 */
const MAX_BUILD_MS = 20000;
const MAX_TOGGLE_MS = 3000;
const MAX_FOCUS_MS = 1000;

/*
 * Set to true to print the timings while working on the tree view.
 */
const LOG_TIMINGS = false;

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
  if (LOG_TIMINGS) {
    console.log(`[tree-view performance] ${label}: ${duration.toFixed(1)}ms`);
  }
  return duration;
}

export default function (): void {
  describe('ClrTree performance on a large eager recursive tree', function () {
    type Context = TestContext<ClrTree<PerfNode>, PerformanceTestComponent>;

    const totalNodes = countNodes(generateTree(ROOTS, BRANCHING, DEPTH));

    spec(ClrTree, PerformanceTestComponent, ClrTreeViewModule, { imports: [NoopAnimationsModule] }, false);

    /*
     * Change detection alone does not cover the cost of showing or hiding a subtree: the browser only restyles
     * and lays it out afterwards. Reading a layout property forces that work into the measured block.
     */
    function render(context: Context) {
      context.detectChanges();
      return (context.clarityElement as HTMLElement).offsetHeight;
    }

    function nodes(context: Context): ClrTreeNode<PerfNode>[] {
      return context.fixture.debugElement.queryAll(By.directive(ClrTreeNode)).map(de => de.componentInstance);
    }

    /*
     * The children containers of collapsed nodes that the browser still renders. An eager tree keeps every node in
     * the DOM, so these have to be skipped from rendering entirely for a large tree to stay fast.
     */
    function renderedCollapsedSubtrees(context: Context): number {
      const collapsed = (context.clarityElement as HTMLElement).querySelectorAll<HTMLElement>(
        '.clr-tree-node-content-container[aria-expanded="false"]'
      );
      return Array.from(collapsed).filter(
        content => getComputedStyle(content.nextElementSibling).contentVisibility !== 'hidden'
      ).length;
    }

    // One test, so that the 4,000 nodes are only built once.
    it('builds, expands, collapses and focuses without rendering collapsed subtrees', function (this: Context) {
      const buildMs = timed(`build ${totalNodes} nodes`, () => {
        this.init();
        render(this);
      });
      expect(nodes(this).length).toBe(totalNodes);
      expect(renderedCollapsedSubtrees(this)).toBe(0);
      // inert would hide them too, but forces a style recalculation of the whole subtree on every toggle.
      expect(this.clarityElement.querySelectorAll('.clr-treenode-children[inert]').length).toBe(0);

      const noopMs = timed('change detection with no changes', () => render(this));

      const subtreeParents = (totalNodes - ROOTS * Math.pow(BRANCHING, DEPTH - 1)) / ROOTS;
      const expandMs = timed('expand a root', () => {
        this.testComponent.expanded = expandedMap(this.testComponent.roots[0]);
        render(this);
      });
      expect(this.clarityElement.querySelectorAll('[aria-expanded="true"]').length).toBe(subtreeParents);
      // Expanding one root does not start rendering the subtrees of the others.
      expect(renderedCollapsedSubtrees(this)).toBe(0);

      const collapseMs = timed('collapse a root', () => {
        this.testComponent.expanded = {};
        render(this);
      });
      expect(this.clarityElement.querySelectorAll('[aria-expanded="true"]').length).toBe(0);

      const focusManager = this.getClarityProvider(TreeFocusManagerService);
      const roots = this.fixture.debugElement
        .queryAll(By.directive(ClrTreeNode))
        .filter(de => !(de.componentInstance as ClrTreeNode<PerfNode>)._model.parent);
      const last = roots[roots.length - 1];
      (roots[0].componentInstance as ClrTreeNode<PerfNode>).focusTreeNode();
      const focusMs = timed('focus request on the last root node', () =>
        focusManager.focusNode((last.componentInstance as ClrTreeNode<PerfNode>)._model)
      );
      expect(document.activeElement).toBe(last.nativeElement.querySelector('.clr-tree-node-content-container'));

      expect(buildMs).toBeLessThan(MAX_BUILD_MS);
      expect(noopMs).toBeLessThan(MAX_TOGGLE_MS);
      expect(expandMs).toBeLessThan(MAX_TOGGLE_MS);
      expect(collapseMs).toBeLessThan(MAX_TOGGLE_MS);
      expect(focusMs).toBeLessThan(MAX_FOCUS_MS);
    });
  });
}

function expandedMap(root: PerfNode, map: { [name: string]: boolean } = {}) {
  map[root.name] = true;
  (root.children || []).forEach(child => expandedMap(child, map));
  return map;
}

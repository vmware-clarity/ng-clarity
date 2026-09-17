/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ClrTree, ClrTreeNode } from '@clr/angular';

interface PerfNode {
  name: string;
  children?: PerfNode[];
}

interface SizePreset {
  roots: number;
  branching: number;
  depth: number;
}

interface Measurement {
  operation: string;
  mode: string;
  nodes: number;
  rendered: number;
  expanded: number;
  callMs: number;
  firstFrameMs: number;
  settledMs: number;
}

/**
 * Number of consecutive frames without any change in the DOM before a run is considered settled.
 * Lazy trees load their levels one after the other, so a single frame is not enough for them.
 */
const STABLE_FRAMES = 5;
const MAX_MEASUREMENTS = 12;

@Component({
  selector: 'clr-expand-all-performance-demo',
  styleUrls: ['../tree-view.demo.scss'],
  templateUrl: './expand-all-performance.html',
  standalone: false,
})
export class ExpandAllPerformanceDemo implements OnInit {
  @ViewChild(ClrTree) tree: ClrTree<PerfNode>;
  @ViewChildren(ClrTreeNode) nodes: QueryList<ClrTreeNode<PerfNode>>;

  presets: SizePreset[] = [
    { roots: 10, branching: 10, depth: 3 }, // 1,110 nodes
    { roots: 10, branching: 7, depth: 4 }, // 4,000 nodes
    { roots: 10, branching: 10, depth: 4 }, // 11,110 nodes
    { roots: 25, branching: 5, depth: 5 }, // 19,525 nodes
    { roots: 6, branching: 6, depth: 6 }, // 55,986 nodes
    { roots: 2, branching: 2, depth: 10 }, // 2,046 nodes, 10 levels deep
  ];

  /**
   * Shape of the generated tree: how many root nodes, how many children each non-leaf node gets,
   * and how many levels of nesting (1 = the roots only).
   */
  roots = 10;
  branching = 7;
  depth = 4;
  lazy = false;
  lazyDelay = 0;
  /**
   * Without [clrForTypeAhead], every node reads the text content of its whole subtree once rendered,
   * to support type-ahead navigation. Turn it off to see what that costs on a large tree.
   */
  typeAhead = true;

  data: PerfNode[] = [];
  totalNodes = 0;
  treeVisible = true;
  allExpanded: boolean | null = false;
  running = false;
  measurements: Measurement[] = [];

  constructor(
    private el: ElementRef<HTMLElement>,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  get mode() {
    return (this.lazy ? 'lazy' : 'eager') + (this.typeAhead ? '' : ', no type-ahead');
  }

  /**
   * How many nodes the current settings will generate, before building the tree.
   */
  get plannedNodes(): number {
    return plannedNodes(this.roots, this.branching, this.depth);
  }

  presetLabel(preset: SizePreset): string {
    return `${plannedNodes(preset.roots, preset.branching, preset.depth).toLocaleString('en-US')} nodes, ${
      preset.depth
    } levels`;
  }

  getChildren = (node: PerfNode) => {
    if (!this.lazy) {
      return node.children;
    }
    return new Promise<PerfNode[]>(resolve => setTimeout(() => resolve(node.children), this.lazyDelay));
  };

  ngOnInit() {
    this.build();
  }

  applyPreset(preset: SizePreset) {
    this.roots = preset.roots;
    this.branching = preset.branching;
    this.depth = preset.depth;
    this.build();
  }

  build() {
    this.measure('build tree', () => {
      this.data = generateTree(clamp(this.roots, 1, 1000), clamp(this.branching, 0, 1000), clamp(this.depth, 1, 50));
      this.totalNodes = countNodes(this.data);
      this.allExpanded = false;
      if (this.tree) {
        // Destroy and recreate the tree, so that the mode and the data are picked up from scratch.
        this.treeVisible = false;
        this.cdr.detectChanges();
      }
      this.treeVisible = true;
    });
  }

  expandAll() {
    this.measure('tree.expandAll()', () => this.tree.expandAll());
  }

  collapseAll() {
    this.measure('tree.collapseAll()', () => this.tree.collapseAll());
  }

  expandFirstRoot() {
    this.measure('firstRoot.expandDescendants()', () => this.nodes.first.expandDescendants());
  }

  collapseFirstRoot() {
    this.measure('firstRoot.collapseDescendants()', () => this.nodes.first.collapseDescendants());
  }

  clearMeasurements() {
    this.measurements = [];
  }

  /**
   * Measures three things for an operation:
   * - the synchronous cost of the call itself (model walk, expand services, output emissions),
   * - the time until the first frame is painted (change detection, style and layout of the whole tree),
   * - the time until the DOM stops changing, which matters for lazy trees loading level after level.
   */
  private measure(operation: string, action: () => void) {
    if (this.running) {
      return;
    }
    this.running = true;
    const measurement: Measurement = {
      operation,
      mode: this.mode,
      nodes: this.totalNodes,
      rendered: 0,
      expanded: 0,
      callMs: 0,
      firstFrameMs: 0,
      settledMs: 0,
    };
    const start = performance.now();
    action();
    measurement.callMs = performance.now() - start;
    measurement.nodes = this.totalNodes;

    this.ngZone.runOutsideAngular(() => {
      let lastCount = -1;
      let stableFrames = 0;
      let lastChange = start;
      let frames = 0;
      const check = () => {
        frames++;
        const count = this.renderedNodes();
        if (frames === 2 && !measurement.firstFrameMs) {
          // The second frame is the first one that has actually been painted.
          measurement.firstFrameMs = performance.now() - start;
        }
        if (count !== lastCount) {
          lastCount = count;
          stableFrames = 0;
          lastChange = performance.now();
        } else {
          stableFrames++;
        }
        if (stableFrames < STABLE_FRAMES || frames < 2) {
          requestAnimationFrame(check);
          return;
        }
        measurement.settledMs = Math.max(lastChange - start, measurement.firstFrameMs);
        measurement.rendered = count;
        measurement.expanded = this.expandedNodes();
        this.ngZone.run(() => {
          this.measurements = [measurement, ...this.measurements].slice(0, MAX_MEASUREMENTS);
          this.running = false;
        });
      };
      requestAnimationFrame(check);
    });
  }

  private renderedNodes() {
    return this.el.nativeElement.querySelectorAll('.clr-tree-node').length;
  }

  private expandedNodes() {
    return this.el.nativeElement.querySelectorAll('[aria-expanded="true"]').length;
  }
}

function generateTree(count: number, branching: number, depth: number, prefix = ''): PerfNode[] {
  const nodes: PerfNode[] = [];
  for (let i = 0; i < count; i++) {
    const name = prefix ? `${prefix}.${i + 1}` : `${i + 1}`;
    const node: PerfNode = { name };
    if (depth > 1 && branching > 0) {
      node.children = generateTree(branching, branching, depth - 1, name);
    }
    nodes.push(node);
  }
  return nodes;
}

function plannedNodes(roots: number, branching: number, depth: number): number {
  roots = clamp(roots, 1, 1000);
  branching = clamp(branching, 0, 1000);
  depth = clamp(depth, 1, 50);
  if (depth === 1 || branching === 0) {
    return roots;
  }
  if (branching === 1) {
    return roots * depth;
  }
  // Each root is a full tree of "depth" levels: 1 + b + b^2 + ... + b^(depth-1)
  return roots * ((Math.pow(branching, depth) - 1) / (branching - 1));
}

function clamp(value: number, min: number, max: number): number {
  const number = Math.floor(Number(value));
  if (isNaN(number)) {
    return min;
  }
  return Math.min(max, Math.max(min, number));
}

function countNodes(nodes: PerfNode[]): number {
  return nodes.reduce((total, node) => total + 1 + (node.children ? countNodes(node.children) : 0), 0);
}

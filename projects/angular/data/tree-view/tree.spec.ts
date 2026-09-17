/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ApplicationRef, Component, DebugElement, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { delay, spec, TestContext } from '@clr/angular/testing';

import { RecursiveChildren } from './recursive-children';
import { ClrTree } from './tree';
import { TreeFeaturesService } from './tree-features.service';
import { TreeFocusManagerService } from './tree-focus-manager.service';
import { ClrTreeNode } from './tree-node';
import { ClrTreeViewModule } from './tree-view.module';

@Component({
  template: `
    <clr-tree [clrLazy]="lazy">
      Hello world
      @if (hasChild) {
        <clr-tree-node>Child</clr-tree-node>
      }
    </clr-tree>
  `,
  standalone: false,
})
class TestComponent {
  @ViewChild(ClrTree) tree: ClrTree<void>;

  lazy = false;
  hasChild = false;
}
@Component({
  template: `
    <clr-tree>
      <clr-tree-node [clrExpanded]="true">
        California
        <clr-tree-node>San Francisco</clr-tree-node>
        <clr-tree-node>Los Angeles</clr-tree-node>
      </clr-tree-node>
      <clr-tree-node [clrExpanded]="true">
        Washington
        <clr-tree-node>Seattle</clr-tree-node>
      </clr-tree-node>
      <clr-tree-node [clrExpanded]="false">
        Vermont
        <clr-tree-node>Burlington</clr-tree-node>
      </clr-tree-node>
    </clr-tree>
  `,
  standalone: false,
})
class TreeTypeAhead {}

@Component({
  template: `
    @if (hasTree) {
      <clr-tree #tree [(clrAllExpanded)]="allExpanded">
        <clr-tree-node #california [(clrExpanded)]="californiaExpanded">
          California
          <clr-tree-node #sanFrancisco>
            San Francisco
            <clr-tree-node>Mission District</clr-tree-node>
          </clr-tree-node>
          <clr-tree-node #losAngeles [(clrExpanded)]="losAngelesExpanded">Los Angeles</clr-tree-node>
        </clr-tree-node>
        <clr-tree-node #washington [(clrDescendantsExpanded)]="washingtonDescendantsExpanded">
          Washington
          <clr-tree-node #seattle>
            Seattle
            <clr-tree-node>Capitol Hill</clr-tree-node>
          </clr-tree-node>
        </clr-tree-node>
        <clr-tree-node #oregon [clrDisabled]="true">
          Oregon
          <clr-tree-node #portland>
            Portland
            <clr-tree-node>Pearl District</clr-tree-node>
          </clr-tree-node>
        </clr-tree-node>
        @if (hasVermont) {
          <clr-tree-node #vermont>
            Vermont
            <clr-tree-node>Burlington</clr-tree-node>
          </clr-tree-node>
          <clr-tree-node #maine [(clrExpanded)]="maineExpanded">Maine</clr-tree-node>
        }
      </clr-tree>
    }
  `,
  standalone: false,
})
class ExpandAllTestComponent {
  @ViewChild('tree') tree: ClrTree<void>;
  @ViewChild('california') california: ClrTreeNode<void>;
  @ViewChild('sanFrancisco') sanFrancisco: ClrTreeNode<void>;
  @ViewChild('losAngeles') losAngeles: ClrTreeNode<void>;
  @ViewChild('washington') washington: ClrTreeNode<void>;
  @ViewChild('seattle') seattle: ClrTreeNode<void>;
  @ViewChild('oregon') oregon: ClrTreeNode<void>;
  @ViewChild('portland') portland: ClrTreeNode<void>;
  @ViewChild('vermont') vermont: ClrTreeNode<void>;
  @ViewChild('maine') maine: ClrTreeNode<void>;

  hasTree = true;
  allExpanded: boolean | null = false;
  washingtonDescendantsExpanded: boolean | null = false;
  californiaExpanded = false;
  losAngelesExpanded = false;
  maineExpanded = false;
  hasVermont = false;
}

interface LazyNode {
  name: string;
  children?: LazyNode[];
}

@Component({
  template: `
    <clr-tree #tree [clrLazy]="true">
      <clr-tree-node
        *clrRecursiveFor="let node of roots; getChildren: getChildren"
        [clrExpandable]="!!node.children"
        [attr.data-name]="node.name"
      >
        {{ node.name }}
      </clr-tree-node>
    </clr-tree>
  `,
  standalone: false,
})
class LazyExpandAllTestComponent {
  @ViewChild('tree') tree: ClrTree<LazyNode>;

  roots: LazyNode[] = [
    { name: 'A', children: [{ name: 'AA', children: [{ name: 'AAA', children: [{ name: 'AAAA' }] }] }] },
    { name: 'B' },
  ];
  fetches: string[] = [];

  getChildren = (node: LazyNode) => {
    this.fetches.push(node.name);
    return Promise.resolve(node.children);
  };
}

export default function (): void {
  type Context = TestContext<ClrTree<void>, TestComponent>;

  describe('ClrTree Component', function () {
    spec(ClrTree, TestComponent, ClrTreeViewModule, { imports: [NoopAnimationsModule] });

    it('declares a TreeFeaturesService provider', function (this: Context) {
      expect(this.getClarityProvider(TreeFeaturesService, null)).not.toBeNull();
    });

    it('accepts a [clrLazy] input and forwards it to the TreeFeaturesService', function (this: Context) {
      const featuresService = this.getClarityProvider(TreeFeaturesService);
      expect(featuresService.eager).toBe(true);
      this.testComponent.lazy = true;
      this.detectChanges();
      expect(featuresService.eager).toBe(false);
    });

    it('projects content', function (this: Context) {
      expect(this.clarityElement.textContent).toContain('Hello world');
    });

    it('adds the aria-multiselectable if tree is selectable and has children', function (this: Context) {
      expect(this.clarityElement.getAttribute('aria-multiselectable')).toBeNull();
      this.getClarityProvider(TreeFeaturesService).selectable = true;
      this.testComponent.hasChild = true;
      this.detectChanges();
      expect(this.clarityElement.getAttribute('aria-multiselectable')).toBe('true');
    });

    it('creates a clr-recursive-children component if the tree is recursive', function (this: Context) {
      expect(this.fixture.debugElement.query(By.directive(RecursiveChildren))).toBeFalsy();
      // Using an empty tree and checking reference equality because I don't want to create full models for this.
      const emptyTree = [];
      this.getClarityProvider(TreeFeaturesService).recursion = {
        template: null,
        root: emptyTree,
      };
      this.detectChanges();
      const recursiveChildrenDE = this.fixture.debugElement.query(By.directive(RecursiveChildren));
      expect(recursiveChildrenDE).toBeTruthy();
      expect((recursiveChildrenDE.componentInstance as RecursiveChildren<void>).children).toBe(emptyTree);
    });

    it('gets tree role by default', function (this: Context) {
      expect(this.clarityElement.getAttribute('role')).toBe('tree');
    });

    it('calls focusManager.focusFirstVisibleNode when focus is received and should not run change detection', function (this: Context) {
      const appRef = TestBed.inject(ApplicationRef);
      spyOn(appRef, 'tick');
      const focusManager = this.getClarityProvider(TreeFocusManagerService);
      spyOn(focusManager, 'focusFirstVisibleNode');
      this.clarityElement.focus();
      expect(appRef.tick).not.toHaveBeenCalled();
      expect(focusManager.focusFirstVisibleNode).toHaveBeenCalled();
    });

    it('removes tabindex once focus is shifted to the first visible child', function (this: Context) {
      expect(this.clarityElement.getAttribute('tabindex')).toEqual('0');
      this.clarityElement.focus();
      expect(this.clarityElement.hasAttribute('tabindex')).toEqual(false);
    });
  });

  describe('Type-Ahead in ClrTree Component', function () {
    let forTypeAheadDirectiveDEs: DebugElement[];
    let forTypeAheadDirectives: ClrTreeNode<any>[];

    spec(ClrTree, TreeTypeAhead, ClrTreeViewModule, { imports: [NoopAnimationsModule] });

    beforeEach(function (this: Context) {
      forTypeAheadDirectiveDEs = this.fixture.debugElement.queryAll(By.directive(ClrTreeNode));
      forTypeAheadDirectives = forTypeAheadDirectiveDEs.map(de => de.componentInstance);
      this.fixture.detectChanges();
    });

    it('focuses node whose text content that starts with pressed keys', async function () {
      forTypeAheadDirectives[0].focusTreeNode();
      expect(document.activeElement.textContent.trim()).toBe('California');
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
      await delay(200);
      expect(document.activeElement.textContent.trim()).toBe('San Francisco');
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
      await delay(200);
      expect(document.activeElement.textContent.trim()).toBe('Seattle');
    });

    it('skips and focuses node whose text content that starts with pressed keys', async function () {
      forTypeAheadDirectives[0].focusTreeNode();
      expect(document.activeElement.textContent.trim()).toBe('California');
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'se' }));
      await delay(200);
      expect(document.activeElement.textContent.trim()).toBe('Seattle');
    });

    it('should skip node even if its text content starts with pressed keys', async function () {
      forTypeAheadDirectives[0].focusTreeNode();
      expect(document.activeElement.textContent.trim()).toBe('California');
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
      await delay(200);
      expect(document.activeElement.textContent.trim()).toBe(
        'California',
        'Should skip Burlington because the containing node is not expanded'
      );
    });
  });

  describe('Expand all in ClrTree Component', function () {
    type ExpandAllContext = TestContext<ClrTree<void>, ExpandAllTestComponent>;

    spec(ClrTree, ExpandAllTestComponent, ClrTreeViewModule, { imports: [NoopAnimationsModule] });

    function allNodes(context: ExpandAllContext): ClrTreeNode<void>[] {
      return context.fixture.debugElement.queryAll(By.directive(ClrTreeNode)).map(de => de.componentInstance);
    }

    function expandedNodes(context: ExpandAllContext): number {
      return context.clarityElement.querySelectorAll('[aria-expanded="true"]').length;
    }

    // The tri-state outputs are asynchronous, so the bound values only settle on the next turn.
    async function settle(context: ExpandAllContext) {
      await context.fixture.whenStable();
      context.detectChanges();
    }

    it('expandAll() expands every expandable node and leaves the leaves alone', function (this: ExpandAllContext) {
      this.testComponent.tree.expandAll();
      this.detectChanges();
      expect(this.testComponent.california.expanded).toBeTrue();
      expect(this.testComponent.sanFrancisco.expanded).toBeTrue();
      expect(this.testComponent.washington.expanded).toBeTrue();
      expect(this.testComponent.seattle.expanded).toBeTrue();
      expect(this.testComponent.losAngeles.expanded).toBeFalse();
      expect(this.testComponent.sanFrancisco._model.expanded).toBeTrue();
      expect(expandedNodes(this)).toBe(4);
    });

    it('collapseAll() collapses every node', function (this: ExpandAllContext) {
      this.testComponent.tree.expandAll();
      this.detectChanges();
      this.testComponent.tree.collapseAll();
      this.detectChanges();
      expect(allNodes(this).every(node => !node.expanded)).toBeTrue();
      expect(expandedNodes(this)).toBe(0);
    });

    it('leaves disabled nodes and their children untouched', function (this: ExpandAllContext) {
      this.testComponent.tree.expandAll();
      this.detectChanges();
      expect(this.testComponent.oregon.expanded).toBeFalse();
      expect(this.testComponent.portland.expanded).toBeFalse();

      this.testComponent.oregon.disabled = false;
      this.testComponent.oregon.expanded = true;
      this.testComponent.portland.expanded = true;
      this.testComponent.oregon.disabled = true;
      this.testComponent.tree.collapseAll();
      this.detectChanges();
      expect(this.testComponent.oregon.expanded).toBeTrue();
      expect(this.testComponent.portland.expanded).toBeTrue();
    });

    it('keeps the two-way bindings of the nodes in sync', function (this: ExpandAllContext) {
      this.testComponent.tree.expandAll();
      expect(this.testComponent.californiaExpanded).toBeTrue();
      this.testComponent.tree.collapseAll();
      expect(this.testComponent.californiaExpanded).toBeFalse();
    });

    it('emits clrAllExpandedChange on expandAll() and collapseAll()', async function (this: ExpandAllContext) {
      this.testComponent.tree.expandAll();
      await settle(this);
      expect(this.testComponent.allExpanded).toBeTrue();
      this.testComponent.tree.collapseAll();
      await settle(this);
      expect(this.testComponent.allExpanded).toBeFalse();
    });

    it('does not emit clrAllExpandedChange when nothing changes', function (this: ExpandAllContext) {
      const spy = spyOn(this.testComponent.tree.allExpandedChange, 'emit');
      this.testComponent.tree.collapseAll();
      expect(spy).not.toHaveBeenCalled();
      this.testComponent.tree.expandAll();
      this.testComponent.tree.expandAll();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('reports the mixed state as soon as any node collapses', async function (this: ExpandAllContext) {
      this.testComponent.tree.expandAll();
      await settle(this);
      expect(this.testComponent.allExpanded).toBeTrue();

      this.testComponent.seattle.expanded = false;
      await settle(this);
      // Not every node is expanded anymore, but not every node is collapsed either
      expect(this.testComponent.allExpanded).toBeNull();
      expect(this.testComponent.tree.allExpanded).toBeNull();
      // Other nodes are left untouched
      expect(this.testComponent.california.expanded).toBeTrue();
    });

    it('collapses everything when the binding goes from mixed to false', async function (this: ExpandAllContext) {
      this.testComponent.tree.expandAll();
      await settle(this);
      this.testComponent.seattle.expanded = false;
      await settle(this);
      expect(this.testComponent.allExpanded).toBeNull();

      // From the mixed state, asking for false is a real change, so it applies
      this.testComponent.allExpanded = false;
      this.detectChanges();
      expect(allNodes(this).every(node => !node.expanded)).toBeTrue();
    });

    it('ignores the mixed state written back into the binding', async function (this: ExpandAllContext) {
      this.testComponent.tree.expandAll();
      await settle(this);
      this.testComponent.seattle.expanded = false;
      await settle(this);

      // The echo of the mixed state must not be read as an instruction to collapse
      this.detectChanges();
      await settle(this);
      expect(this.testComponent.california.expanded).toBeTrue();
      expect(this.testComponent.washington.expanded).toBeTrue();
    });

    it('reports the mixed state when a node is expanded on its own', async function (this: ExpandAllContext) {
      expect(this.testComponent.tree.allExpanded).toBeFalse();

      this.testComponent.california.expanded = true;
      await settle(this);
      // The tree claimed every node was collapsed, which is no longer true
      expect(this.testComponent.allExpanded).toBeNull();
      expect(this.testComponent.tree.allExpanded).toBeNull();
    });

    it('offers a [(clrAllExpanded)] two-way binding on the tree', function (this: ExpandAllContext) {
      this.testComponent.allExpanded = true;
      this.detectChanges();
      expect(this.testComponent.california.expanded).toBeTrue();
      expect(this.testComponent.seattle.expanded).toBeTrue();
      expect(this.testComponent.tree.allExpanded).toBeTrue();

      this.testComponent.allExpanded = false;
      this.detectChanges();
      expect(allNodes(this).every(node => !node.expanded)).toBeTrue();
    });

    it('keeps the tree and the binding consistent when a node is collapsed in the same pass', function (this: ExpandAllContext) {
      this.testComponent.tree.expandAll();
      this.detectChanges();
      this.testComponent.allExpanded = false;
      this.testComponent.californiaExpanded = false;
      this.detectChanges();
      this.testComponent.allExpanded = true;
      this.testComponent.californiaExpanded = false;
      this.detectChanges();
      expect(this.testComponent.california.expanded).toBe(this.testComponent.californiaExpanded);
      expect(this.testComponent.tree.allExpanded).toBe(this.testComponent.allExpanded);
      expect(this.testComponent.tree.allExpanded).toBeTrue();
    });

    it('does not throw when the tree is destroyed right after the input is set', function (this: ExpandAllContext) {
      this.testComponent.allExpanded = true;
      this.testComponent.hasTree = false;
      expect(() => this.detectChanges()).not.toThrow();
    });

    it('expands nodes added to the tree while everything is expanded', function (this: ExpandAllContext) {
      this.testComponent.tree.expandAll();
      this.detectChanges();
      this.testComponent.hasVermont = true;
      this.detectChanges();
      expect(this.testComponent.vermont.expanded).toBeTrue();
      expect(this.testComponent.vermont._model.expanded).toBeTrue();
    });

    it('leaves leaves added to the tree while everything is expanded alone', function (this: ExpandAllContext) {
      this.testComponent.tree.expandAll();
      this.detectChanges();
      this.testComponent.hasVermont = true;
      this.detectChanges();
      expect(this.testComponent.maine.expanded).toBeFalse();
      expect(this.testComponent.maineExpanded).toBeFalse();
      const spy = spyOn(this.testComponent.maine.expandedChange, 'emit');
      this.testComponent.tree.collapseAll();
      expect(spy).not.toHaveBeenCalled();
    });

    it('does not expand nodes added to the tree after a node was collapsed', function (this: ExpandAllContext) {
      this.testComponent.tree.expandAll();
      this.detectChanges();
      this.testComponent.seattle.expanded = false;
      this.testComponent.hasVermont = true;
      this.detectChanges();
      expect(this.testComponent.vermont.expanded).toBeFalse();
    });

    it('expandDescendants() on a node only expands its own subtree', async function (this: ExpandAllContext) {
      this.testComponent.washington.expandDescendants();
      expect(this.testComponent.washington.expanded).toBeTrue();
      expect(this.testComponent.seattle.expanded).toBeTrue();
      expect(this.testComponent.california.expanded).toBeFalse();
      expect(this.testComponent.sanFrancisco.expanded).toBeFalse();
      await settle(this);
      expect(this.testComponent.washingtonDescendantsExpanded).toBeTrue();
      // Part of the tree is expanded now, so the tree itself is mixed
      expect(this.testComponent.allExpanded).toBeNull();

      this.testComponent.washington.collapseDescendants();
      await settle(this);
      expect(this.testComponent.washington.expanded).toBeFalse();
      expect(this.testComponent.seattle.expanded).toBeFalse();
      expect(this.testComponent.washingtonDescendantsExpanded).toBeFalse();
    });

    it('offers a [(clrDescendantsExpanded)] two-way binding on a node', async function (this: ExpandAllContext) {
      this.testComponent.washingtonDescendantsExpanded = true;
      this.detectChanges();
      expect(this.testComponent.washington.expanded).toBeTrue();
      expect(this.testComponent.seattle.expanded).toBeTrue();
      expect(this.testComponent.california.expanded).toBeFalse();

      // Collapsing a descendant moves the binding to the mixed state
      this.testComponent.seattle.expanded = false;
      await settle(this);
      expect(this.testComponent.washingtonDescendantsExpanded).toBeNull();
      expect(this.testComponent.washington.expanded).toBeTrue();

      // And from there, asking for false collapses the subtree
      this.testComponent.washingtonDescendantsExpanded = false;
      this.detectChanges();
      expect(this.testComponent.washington.expanded).toBeFalse();
    });

    it('resets the descendants binding of a node when the tree collapses', async function (this: ExpandAllContext) {
      this.testComponent.washington.expandDescendants();
      await settle(this);
      this.testComponent.tree.collapseAll();
      await settle(this);
      expect(this.testComponent.washingtonDescendantsExpanded).toBeFalse();
      expect(this.testComponent.washington.descendantsExpanded).toBeFalse();
    });

    it('skips the animation for bulk changes only', function (this: ExpandAllContext) {
      const node = this.testComponent.california;
      expect(node.childrenAnimationState).toBe('collapsed');
      this.testComponent.tree.expandAll();
      expect(node.childrenAnimationState).toBe('expandedInstant');
      node.expandService.toggle();
      expect(node.childrenAnimationState).toBe('collapsed');
      node.expandService.toggle();
      expect(node.childrenAnimationState).toBe('expanded');
      this.testComponent.tree.collapseAll();
      expect(node.childrenAnimationState).toBe('collapsedInstant');
    });
  });

  describe('Expand all in a lazy-loaded recursive ClrTree Component', function () {
    type LazyContext = TestContext<ClrTree<LazyNode>, LazyExpandAllTestComponent>;

    spec(ClrTree, LazyExpandAllTestComponent, ClrTreeViewModule, { imports: [NoopAnimationsModule] });

    async function settleLoading(context: LazyContext, rounds = 6) {
      for (let i = 0; i < rounds; i++) {
        await delay(0);
        context.detectChanges();
      }
    }

    function nodeByName(context: LazyContext, name: string): ClrTreeNode<LazyNode> {
      const de = context.fixture.debugElement.query(By.css(`[data-name="${name}"]`));
      return de && de.componentInstance;
    }

    it('cascades through lazy-loaded levels as they get loaded', async function (this: LazyContext) {
      expect(nodeByName(this, 'AA')).toBeFalsy();
      this.testComponent.tree.expandAll();
      await settleLoading(this);
      expect(nodeByName(this, 'A').expanded).toBeTrue();
      expect(nodeByName(this, 'AA').expanded).toBeTrue();
      expect(nodeByName(this, 'AAA').expanded).toBeTrue();
      expect(nodeByName(this, 'AAAA')).toBeTruthy();
      // Leaves are not expandable and never fetch children
      expect(this.testComponent.fetches).toEqual(['A', 'AA', 'AAA']);
    });

    it('stops cascading once a node gets collapsed', async function (this: LazyContext) {
      this.testComponent.tree.expandAll();
      await settleLoading(this);
      // Collapsing clears the lazy-loaded children...
      nodeByName(this, 'AA').expanded = false;
      await settleLoading(this);
      expect(nodeByName(this, 'AAA')).toBeFalsy();
      // ...and re-expanding it does not expand the reloaded children anymore
      nodeByName(this, 'AA').expanded = true;
      await settleLoading(this);
      expect(nodeByName(this, 'AAA').expanded).toBeFalse();
    });

    it('cascades a subtree through lazy-loaded levels', async function (this: LazyContext) {
      nodeByName(this, 'A').expanded = true;
      await settleLoading(this);
      nodeByName(this, 'AA').expandDescendants();
      await settleLoading(this);
      expect(nodeByName(this, 'AAA').expanded).toBeTrue();
      expect(nodeByName(this, 'AAAA')).toBeTruthy();
      // Only part of the tree was expanded
      expect(this.testComponent.tree.allExpanded).toBeNull();
    });
  });
}

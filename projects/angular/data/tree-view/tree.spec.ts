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
      <clr-tree #tree>
        <clr-tree-node #california [(clrExpanded)]="californiaExpanded">
          California
          <clr-tree-node #sanFrancisco>
            San Francisco
            <clr-tree-node>Mission District</clr-tree-node>
          </clr-tree-node>
          <clr-tree-node #losAngeles [(clrExpanded)]="losAngelesExpanded">Los Angeles</clr-tree-node>
        </clr-tree-node>
        <clr-tree-node #washington>
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

  describe('ClrTree Component', () => {
    let testContext: Context;

    const getContext = spec(ClrTree, TestComponent, ClrTreeViewModule, { imports: [NoopAnimationsModule] });
    beforeEach(() => {
      testContext = getContext() as Context;
    });

    it('declares a TreeFeaturesService provider', () => {
      expect(testContext.getClarityProvider(TreeFeaturesService, null)).not.toBeNull();
    });

    it('accepts a [clrLazy] input and forwards it to the TreeFeaturesService', () => {
      const featuresService = testContext.getClarityProvider(TreeFeaturesService);
      expect(featuresService.eager).toBe(true);
      testContext.testComponent.lazy = true;
      testContext.detectChanges();
      expect(featuresService.eager).toBe(false);
    });

    it('projects content', () => {
      expect(testContext.clarityElement.textContent).toContain('Hello world');
    });

    it('adds the aria-multiselectable if tree is selectable and has children', () => {
      expect(testContext.clarityElement.getAttribute('aria-multiselectable')).toBeNull();
      testContext.getClarityProvider(TreeFeaturesService).selectable = true;
      testContext.testComponent.hasChild = true;
      testContext.detectChanges();
      expect(testContext.clarityElement.getAttribute('aria-multiselectable')).toBe('true');
    });

    it('creates a clr-recursive-children component if the tree is recursive', () => {
      expect(testContext.fixture.debugElement.query(By.directive(RecursiveChildren))).toBeFalsy();
      // Using an empty tree and checking reference equality because I don't want to create full models for this.
      const emptyTree = [];
      testContext.getClarityProvider(TreeFeaturesService).recursion = {
        template: null,
        root: emptyTree,
      };
      testContext.detectChanges();
      const recursiveChildrenDE = testContext.fixture.debugElement.query(By.directive(RecursiveChildren));
      expect(recursiveChildrenDE).toBeTruthy();
      expect((recursiveChildrenDE.componentInstance as RecursiveChildren<void>).children).toBe(emptyTree);
    });

    it('gets tree role by default', () => {
      expect(testContext.clarityElement.getAttribute('role')).toBe('tree');
    });

    it('calls focusManager.focusFirstVisibleNode when focus is received and should not run change detection', () => {
      const appRef = TestBed.inject(ApplicationRef);
      spyOn(appRef, 'tick');
      const focusManager = testContext.getClarityProvider(TreeFocusManagerService);
      spyOn(focusManager, 'focusFirstVisibleNode');
      testContext.clarityElement.focus();
      expect(appRef.tick).not.toHaveBeenCalled();
      expect(focusManager.focusFirstVisibleNode).toHaveBeenCalled();
    });

    it('removes tabindex once focus is shifted to the first visible child', () => {
      expect(testContext.clarityElement.getAttribute('tabindex')).toEqual('0');
      testContext.clarityElement.focus();
      expect(testContext.clarityElement.hasAttribute('tabindex')).toEqual(false);
    });
  });

  describe('Type-Ahead in ClrTree Component', () => {
    let testContext: Context;

    let forTypeAheadDirectiveDEs: DebugElement[];
    let forTypeAheadDirectives: ClrTreeNode<any>[];

    const getContext = spec(ClrTree, TreeTypeAhead, ClrTreeViewModule, { imports: [NoopAnimationsModule] });
    beforeEach(() => {
      testContext = getContext() as Context;
    });

    beforeEach(() => {
      forTypeAheadDirectiveDEs = testContext.fixture.debugElement.queryAll(By.directive(ClrTreeNode));
      forTypeAheadDirectives = forTypeAheadDirectiveDEs.map(de => de.componentInstance);
      testContext.fixture.detectChanges();
    });

    it('focuses node whose text content that starts with pressed keys', async () => {
      forTypeAheadDirectives[0].focusTreeNode();
      expect(document.activeElement.textContent.trim()).toBe('California');
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
      await delay(200);
      expect(document.activeElement.textContent.trim()).toBe('San Francisco');
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
      await delay(200);
      expect(document.activeElement.textContent.trim()).toBe('Seattle');
    });

    it('skips and focuses node whose text content that starts with pressed keys', async () => {
      forTypeAheadDirectives[0].focusTreeNode();
      expect(document.activeElement.textContent.trim()).toBe('California');
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'se' }));
      await delay(200);
      expect(document.activeElement.textContent.trim()).toBe('Seattle');
    });

    it('should skip node even if its text content starts with pressed keys', async () => {
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

  describe('Expand all in ClrTree Component', () => {
    let testContext: ExpandAllContext;

    type ExpandAllContext = TestContext<ClrTree<void>, ExpandAllTestComponent>;

    const getContext = spec(ClrTree, ExpandAllTestComponent, ClrTreeViewModule, { imports: [NoopAnimationsModule] });
    beforeEach(() => {
      testContext = getContext() as ExpandAllContext;
    });

    function allNodes(context: ExpandAllContext): ClrTreeNode<void>[] {
      return context.fixture.debugElement.queryAll(By.directive(ClrTreeNode)).map(de => de.componentInstance);
    }

    function expandedNodes(context: ExpandAllContext): number {
      return context.clarityElement.querySelectorAll('[aria-expanded="true"]').length;
    }

    function tabStops(context: ExpandAllContext): HTMLElement[] {
      return Array.from(
        context.clarityElement.querySelectorAll('.clr-tree-node-content-container[tabindex="0"]')
      ) as HTMLElement[];
    }

    it('expandAll() expands every expandable node and leaves the leaves alone', () => {
      testContext.testComponent.tree.expandAll();
      testContext.detectChanges();
      expect(testContext.testComponent.california.expanded).toBeTrue();
      expect(testContext.testComponent.sanFrancisco.expanded).toBeTrue();
      expect(testContext.testComponent.washington.expanded).toBeTrue();
      expect(testContext.testComponent.seattle.expanded).toBeTrue();
      expect(testContext.testComponent.losAngeles.expanded).toBeFalse();
      expect(testContext.testComponent.sanFrancisco._model.expanded).toBeTrue();
      expect(expandedNodes(testContext)).toBe(4);
    });

    it('collapseAll() collapses every node', () => {
      testContext.testComponent.tree.expandAll();
      testContext.detectChanges();
      testContext.testComponent.tree.collapseAll();
      testContext.detectChanges();
      expect(allNodes(testContext).every(node => !node.expanded)).toBeTrue();
      expect(expandedNodes(testContext)).toBe(0);
    });

    it('leaves disabled nodes and their children untouched', () => {
      testContext.testComponent.tree.expandAll();
      testContext.detectChanges();
      expect(testContext.testComponent.oregon.expanded).toBeFalse();
      expect(testContext.testComponent.portland.expanded).toBeFalse();

      testContext.testComponent.oregon.disabled = false;
      testContext.testComponent.oregon.expanded = true;
      testContext.testComponent.portland.expanded = true;
      testContext.testComponent.oregon.disabled = true;
      testContext.testComponent.tree.collapseAll();
      testContext.detectChanges();
      expect(testContext.testComponent.oregon.expanded).toBeTrue();
      expect(testContext.testComponent.portland.expanded).toBeTrue();
    });

    it('keeps the two-way bindings of the nodes in sync', () => {
      testContext.testComponent.tree.expandAll();
      expect(testContext.testComponent.californiaExpanded).toBeTrue();
      testContext.testComponent.tree.collapseAll();
      expect(testContext.testComponent.californiaExpanded).toBeFalse();
    });

    it('does not emit clrExpandedChange for the nodes it leaves alone', () => {
      const leaf = spyOn(testContext.testComponent.losAngeles.expandedChange, 'emit');
      const disabled = spyOn(testContext.testComponent.oregon.expandedChange, 'emit');
      testContext.testComponent.tree.expandAll();
      testContext.detectChanges();
      expect(leaf).not.toHaveBeenCalled();
      expect(disabled).not.toHaveBeenCalled();
    });

    it('expands nodes added to the tree while everything is expanded', () => {
      testContext.testComponent.tree.expandAll();
      testContext.detectChanges();
      testContext.testComponent.hasVermont = true;
      testContext.detectChanges();
      expect(testContext.testComponent.vermont.expanded).toBeTrue();
      expect(testContext.testComponent.vermont._model.expanded).toBeTrue();
    });

    it('leaves leaves added to the tree while everything is expanded alone', () => {
      testContext.testComponent.tree.expandAll();
      testContext.detectChanges();
      testContext.testComponent.hasVermont = true;
      testContext.detectChanges();
      expect(testContext.testComponent.maine.expanded).toBeFalse();
      expect(testContext.testComponent.maineExpanded).toBeFalse();
      const spy = spyOn(testContext.testComponent.maine.expandedChange, 'emit');
      testContext.testComponent.tree.collapseAll();
      expect(spy).not.toHaveBeenCalled();
    });

    it('does not expand nodes added to the tree after a node was collapsed', () => {
      testContext.testComponent.tree.expandAll();
      testContext.detectChanges();
      testContext.testComponent.seattle.expanded = false;
      testContext.testComponent.hasVermont = true;
      testContext.detectChanges();
      expect(testContext.testComponent.vermont.expanded).toBeFalse();
    });

    it('cascades again once the tree is expanded anew after a collapse', () => {
      testContext.testComponent.tree.expandAll();
      testContext.detectChanges();
      testContext.testComponent.seattle.expanded = false;
      testContext.detectChanges();
      testContext.testComponent.tree.expandAll();
      testContext.detectChanges();
      testContext.testComponent.hasVermont = true;
      testContext.detectChanges();
      expect(testContext.testComponent.vermont.expanded).toBeTrue();
    });

    it('does not throw when the tree is destroyed right after a bulk operation', () => {
      testContext.testComponent.tree.expandAll();
      testContext.testComponent.hasTree = false;
      expect(() => testContext.detectChanges()).not.toThrow();
    });

    it('expandDescendants() on a node only expands its own subtree', () => {
      testContext.testComponent.washington.expandDescendants();
      testContext.detectChanges();
      expect(testContext.testComponent.washington.expanded).toBeTrue();
      expect(testContext.testComponent.seattle.expanded).toBeTrue();
      expect(testContext.testComponent.california.expanded).toBeFalse();
      expect(testContext.testComponent.sanFrancisco.expanded).toBeFalse();

      testContext.testComponent.washington.collapseDescendants();
      testContext.detectChanges();
      expect(testContext.testComponent.washington.expanded).toBeFalse();
      expect(testContext.testComponent.seattle.expanded).toBeFalse();
    });

    it('expands nodes added to a subtree that was expanded on its own', () => {
      testContext.testComponent.hasVermont = true;
      testContext.detectChanges();
      testContext.testComponent.vermont.collapseDescendants();
      testContext.detectChanges();
      expect(testContext.testComponent.vermont.expanded).toBeFalse();

      testContext.testComponent.vermont.expandDescendants();
      testContext.detectChanges();
      expect(testContext.testComponent.vermont.expanded).toBeTrue();
      // A subtree operation leaves the rest of the tree alone
      expect(testContext.testComponent.california.expanded).toBeFalse();
    });

    it('does nothing when a bulk operation is called on a disabled node', () => {
      const spy = spyOn(testContext.testComponent.oregon.expandedChange, 'emit');
      testContext.testComponent.oregon.expandDescendants();
      testContext.detectChanges();
      expect(testContext.testComponent.oregon.expanded).toBeFalse();
      expect(testContext.testComponent.portland.expanded).toBeFalse();
      expect(spy).not.toHaveBeenCalled();

      // And it does not stop the tree from cascading into nodes added later either
      testContext.testComponent.tree.expandAll();
      testContext.detectChanges();
      testContext.testComponent.hasVermont = true;
      testContext.detectChanges();
      expect(testContext.testComponent.vermont.expanded).toBeTrue();
    });

    it('skips the animation for bulk changes only', () => {
      const node = testContext.testComponent.california;
      expect(node.childrenAnimationState).toBe('collapsed');
      testContext.testComponent.tree.expandAll();
      expect(node.childrenAnimationState).toBe('expandedInstant');
      node.expandService.toggle();
      expect(node.childrenAnimationState).toBe('collapsed');
      node.expandService.toggle();
      expect(node.childrenAnimationState).toBe('expanded');
      testContext.testComponent.tree.collapseAll();
      expect(node.childrenAnimationState).toBe('collapsedInstant');
    });

    it('skips the animation for nodes added while the tree is expanded', () => {
      testContext.testComponent.tree.expandAll();
      testContext.detectChanges();
      testContext.testComponent.hasVermont = true;
      testContext.detectChanges();
      expect(testContext.testComponent.vermont.childrenAnimationState).toBe('expandedInstant');
    });

    it('does not leave the tab stop inside a subtree collapsed by collapseAll()', () => {
      testContext.testComponent.tree.expandAll();
      testContext.detectChanges();
      testContext.testComponent.sanFrancisco.focusTreeNode();
      testContext.detectChanges();
      expect(tabStops(testContext).length).toBe(1);

      testContext.testComponent.tree.collapseAll();
      testContext.detectChanges();

      // A collapsed subtree is inert, so a tab stop left inside one makes the tree unreachable by keyboard
      const stops = tabStops(testContext);
      expect(stops.length).toBe(1);
      expect(stops[0].closest('.clr-treenode-children')).toBeNull();
    });

    it('does not leave the tab stop inside a subtree collapsed by collapseDescendants()', () => {
      testContext.testComponent.tree.expandAll();
      testContext.detectChanges();
      testContext.testComponent.seattle.focusTreeNode();
      testContext.detectChanges();

      testContext.testComponent.washington.collapseDescendants();
      testContext.detectChanges();

      const stops = tabStops(testContext);
      expect(stops.length).toBe(1);
      expect(stops[0].textContent.trim()).toBe('Washington');
    });

    it('leaves the tab stop alone when it is still visible after a collapse', () => {
      testContext.testComponent.california.focusTreeNode();
      testContext.detectChanges();
      testContext.testComponent.tree.collapseAll();
      testContext.detectChanges();

      const stops = tabStops(testContext);
      expect(stops.length).toBe(1);
      expect(stops[0].textContent.trim()).toBe('California');
    });
  });

  describe('Expand all in a lazy-loaded recursive ClrTree Component', () => {
    let testContext: LazyContext;

    type LazyContext = TestContext<ClrTree<LazyNode>, LazyExpandAllTestComponent>;

    const getContext = spec(ClrTree, LazyExpandAllTestComponent, ClrTreeViewModule, {
      imports: [NoopAnimationsModule],
    });
    beforeEach(() => {
      testContext = getContext() as LazyContext;
    });

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

    it('cascades through lazy-loaded levels as they get loaded', async () => {
      expect(nodeByName(testContext, 'AA')).toBeFalsy();
      testContext.testComponent.tree.expandAll();
      await settleLoading(testContext);
      expect(nodeByName(testContext, 'A').expanded).toBeTrue();
      expect(nodeByName(testContext, 'AA').expanded).toBeTrue();
      expect(nodeByName(testContext, 'AAA').expanded).toBeTrue();
      expect(nodeByName(testContext, 'AAAA')).toBeTruthy();
      // Leaves are not expandable and never fetch children
      expect(testContext.testComponent.fetches).toEqual(['A', 'AA', 'AAA']);
    });

    it('stops cascading once a node gets collapsed', async () => {
      testContext.testComponent.tree.expandAll();
      await settleLoading(testContext);
      // Collapsing clears the lazy-loaded children...
      nodeByName(testContext, 'AA').expanded = false;
      await settleLoading(testContext);
      expect(nodeByName(testContext, 'AAA')).toBeFalsy();
      // ...and re-expanding it does not expand the reloaded children anymore
      nodeByName(testContext, 'AA').expanded = true;
      await settleLoading(testContext);
      expect(nodeByName(testContext, 'AAA').expanded).toBeFalse();
    });

    it('cascades a subtree through lazy-loaded levels', async () => {
      nodeByName(testContext, 'A').expanded = true;
      await settleLoading(testContext);
      nodeByName(testContext, 'AA').expandDescendants();
      await settleLoading(testContext);
      expect(nodeByName(testContext, 'AAA').expanded).toBeTrue();
      expect(nodeByName(testContext, 'AAAA')).toBeTruthy();
      // A subtree operation leaves the sibling root alone
      expect(nodeByName(testContext, 'B').expanded).toBeFalse();
    });
  });
}

/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ApplicationRef, Component, DebugElement, ViewChild } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { spec, TestContext } from '../../utils/testing/helpers.spec';
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
      <clr-tree-node *ngIf="hasChild">Child</clr-tree-node>
    </clr-tree>
  `,
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
})
class TreeTypeAhead {}

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
      this.hostComponent.lazy = true;
      this.detectChanges();
      expect(featuresService.eager).toBe(false);
    });

    it('projects content', function (this: Context) {
      expect(this.clarityElement.textContent).toContain('Hello world');
    });

    it('adds the aria-multiselectable if tree is selectable and has children', function (this: Context) {
      expect(this.clarityElement.getAttribute('aria-multiselectable')).toBe('false');
      this.getClarityProvider(TreeFeaturesService).selectable = true;
      this.hostComponent.hasChild = true;
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

    it('focuses node whose text content that starts with pressed keys', fakeAsync(function () {
      forTypeAheadDirectives[0].focusTreeNode();
      expect(document.activeElement.textContent.trim()).toBe('California');
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
      tick(200);
      expect(document.activeElement.textContent.trim()).toBe('San Francisco');
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));
      tick(200);
      expect(document.activeElement.textContent.trim()).toBe('Seattle');
    }));

    it('skips and focuses node whose text content that starts with pressed keys', fakeAsync(function () {
      forTypeAheadDirectives[0].focusTreeNode();
      expect(document.activeElement.textContent.trim()).toBe('California');
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'se' }));
      tick(200);
      expect(document.activeElement.textContent.trim()).toBe('Seattle');
    }));

    it('should skip node even if its text content starts with pressed keys', fakeAsync(function () {
      forTypeAheadDirectives[0].focusTreeNode();
      expect(document.activeElement.textContent.trim()).toBe('California');
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
      tick(200);
      expect(document.activeElement.textContent.trim()).toBe(
        'California',
        'Should skip Burlington because the containing node is not expanded'
      );
    }));
  });
}

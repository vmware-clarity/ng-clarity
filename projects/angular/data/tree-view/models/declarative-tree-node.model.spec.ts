/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { computed } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DeclarativeTreeNodeModel } from './declarative-tree-node.model';
import { TreeNodeModel } from './tree-node.model';

describe('Tree View', () => {
  describe('Models', () => {
    describe('DeclarativeTreeNodeModel', () => {
      let parent: DeclarativeTreeNodeModel<void>;

      beforeEach(function () {
        parent = new DeclarativeTreeNodeModel(null);
      });

      afterEach(function () {
        parent.destroy();
      });

      it('extends TreeNodeModel', function () {
        expect(parent instanceof TreeNodeModel).toBe(true);
      });

      it('registers to its parent on creation and the parent keeps track of the children', function () {
        const child1 = new DeclarativeTreeNodeModel<void>(parent);
        const child2 = new DeclarativeTreeNodeModel<void>(parent);
        expect(parent.children).toEqual([child1, child2]);
        child1.destroy();
        child2.destroy();
      });

      it('unregisters from its parent when destroyed', function () {
        const child1 = new DeclarativeTreeNodeModel<void>(parent);
        const child2 = new DeclarativeTreeNodeModel<void>(parent);
        child1.destroy();
        expect(parent.children).toEqual([child2]);
        child2.destroy();
        expect(parent.children).toEqual([]);
      });

      it('lets a computed signal follow the children being added, removed and replaced', function () {
        const count = TestBed.runInInjectionContext(() => computed(() => parent.children.length));
        expect(count()).toBe(0);
        const child1 = new DeclarativeTreeNodeModel<void>(parent);
        const child2 = new DeclarativeTreeNodeModel<void>(parent);
        expect(count()).toBe(2);
        child1.destroy();
        expect(count()).toBe(1);
        parent.children = [];
        expect(count()).toBe(0);
        child2.destroy();
      });

      it('adds and removes many siblings without copying the children each time', function () {
        const children = Array.from({ length: 5000 }, () => new DeclarativeTreeNodeModel<void>(parent));
        const held = parent.children;
        expect(held.length).toBe(5000);
        children.forEach(child => child.destroy());
        // The same array is kept and changed in place.
        expect(parent.children).toBe(held);
        expect(parent.children.length).toBe(0);
      });
    });
  });
});

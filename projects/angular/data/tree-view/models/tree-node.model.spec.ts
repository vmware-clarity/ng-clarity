/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { BehaviorSubject } from 'rxjs';

import { ClrSelectedState } from './selected-state.enum';
import type { ClrTreeNode } from '../tree-node';
import { TreeNodeModel } from './tree-node.model';

class TestModel extends TreeNodeModel<string> {
  children: TestModel[] = [];
  parent: TestModel | null;

  constructor(name: string, parent: TestModel) {
    super();
    this.model = name;
    this.parent = parent;
  }
}

/* Stands in for the rendered node: the model only ever calls these two. */
class FakeTreeNode {
  expanded = false;
  descendantsCollapsedCount = 0;

  setExpandedInBulk(expanded: boolean) {
    this.expanded = expanded;
  }

  onDescendantsCollapsed() {
    this.descendantsCollapsedCount++;
  }
}

export default function (): void {
  describe('TreeNodeModel', () => {
    let root: TestModel;
    let child: TestModel;

    beforeEach(function () {
      root = new TestModel('A', null);
      child = new TestModel('AA', root);
      child.children = [new TestModel('AAA', child), new TestModel('AAB', child)];
      root.children = [child, new TestModel('AB', root)];
    });

    afterEach(function () {
      child.children.forEach(c => c.destroy());
      root.children.forEach(c => c.destroy());
      root.destroy();
    });

    it('offers a selected BehaviorSubject', function () {
      expect(root.selected instanceof BehaviorSubject).toBeTrue();
    });

    it('starts unselected', function () {
      expect(root.selected.value).toBe(ClrSelectedState.UNSELECTED);
    });

    it('allows to set the selection state of a node without propagating', function () {
      // Selected
      child.setSelected(ClrSelectedState.SELECTED, false, false);
      expect(child.selected.value).toBe(ClrSelectedState.SELECTED);
      [root, ...child.children].forEach(n => expect(n.selected.value).toBe(ClrSelectedState.UNSELECTED));
      // Indeterminate
      child.setSelected(ClrSelectedState.INDETERMINATE, false, false);
      expect(child.selected.value).toBe(ClrSelectedState.INDETERMINATE);
      [root, ...child.children].forEach(n => expect(n.selected.value).toBe(ClrSelectedState.UNSELECTED));
    });

    it('emits selection changes only when it actually changes', function () {
      let nbChanges = 0;
      child.selected.subscribe(() => nbChanges++);
      // BehaviorSubject sends us the first state on subscription
      expect(nbChanges).toBe(1);
      child.setSelected(ClrSelectedState.UNSELECTED, false, false);
      expect(nbChanges).toBe(1);
      child.setSelected(ClrSelectedState.SELECTED, false, false);
      expect(nbChanges).toBe(2);
      child.setSelected(ClrSelectedState.SELECTED, false, false);
      expect(nbChanges).toBe(2);
    });

    it('can propagate the selection to parents', function () {
      // Selecting only one grandchild sets all parents up the tree to indeterminate
      child.children[0].setSelected(ClrSelectedState.SELECTED, true, false);
      expect(child.selected.value).toBe(ClrSelectedState.INDETERMINATE);
      expect(root.selected.value).toBe(ClrSelectedState.INDETERMINATE);
      // Selecting all children of a node will make it selected
      child.children[1].setSelected(ClrSelectedState.SELECTED, true, false);
      expect(child.selected.value).toBe(ClrSelectedState.SELECTED);
      root.children[1].setSelected(ClrSelectedState.SELECTED, true, false);
      expect(root.selected.value).toBe(ClrSelectedState.SELECTED);
    });

    it('can propagate the selection to children', function () {
      // Selecting a parent selects all the children down the tree
      root.setSelected(ClrSelectedState.SELECTED, false, true);
      [...root.children, ...child.children].forEach(n => expect(n.selected.value).toBe(ClrSelectedState.SELECTED));
      // Unselecting a parent unselects all the children down the tree
      root.setSelected(ClrSelectedState.UNSELECTED, false, true);
      [...root.children, ...child.children].forEach(n => expect(n.selected.value).toBe(ClrSelectedState.UNSELECTED));
    });

    it('does not propagate indeterminate state down', function () {
      child.setSelected(ClrSelectedState.SELECTED, false, true);
      root.setSelected(ClrSelectedState.INDETERMINATE, false, true);
      // The children are left untouched, in whatever state they were before
      expect(root.children[1].selected.value).toBe(ClrSelectedState.UNSELECTED);
      [child, ...child.children].forEach(n => expect(n.selected.value).toBe(ClrSelectedState.SELECTED));
    });

    it('toggles from unselected to selected', function () {
      child.setSelected(ClrSelectedState.UNSELECTED, false, false);
      const spy = spyOn(child, 'setSelected');
      child.toggleSelection(true);
      expect(spy).toHaveBeenCalledWith(ClrSelectedState.SELECTED, true, true);
    });

    it('toggles from selected to unselected', function () {
      child.setSelected(ClrSelectedState.SELECTED, false, false);
      const spy = spyOn(child, 'setSelected');
      child.toggleSelection(true);
      expect(spy).toHaveBeenCalledWith(ClrSelectedState.UNSELECTED, true, true);
    });

    it('toggles from indeterminate to selected', function () {
      child.setSelected(ClrSelectedState.INDETERMINATE, false, false);
      const spy = spyOn(child, 'setSelected');
      child.toggleSelection(true);
      expect(spy).toHaveBeenCalledWith(ClrSelectedState.SELECTED, true, true);
    });

    it('can toggle without propagating down', function () {
      const spy = spyOn(child, 'setSelected');
      child.toggleSelection(false);
      expect(spy).toHaveBeenCalledWith(ClrSelectedState.SELECTED, true, false);
    });

    it('completes the selected Observable on destroy', function () {
      let complete = false;
      root.selected.subscribe({ complete: () => (complete = true) });
      root.destroy();
      expect(complete).toBeTrue();
    });

    it('unselected disabled node can not be selected', function () {
      child.disabled = true;
      child.toggleSelection(true);
      expect(child.selected.value).toBe(ClrSelectedState.UNSELECTED);
    });

    it('selected disabled node can not be unselected', function () {
      child.setSelected(ClrSelectedState.SELECTED, false, false);
      child.disabled = true;
      expect(child.selected.value).toBe(ClrSelectedState.SELECTED);
      child.toggleSelection(true);
      expect(child.selected.value).toBe(ClrSelectedState.SELECTED);
    });

    it('disabled parent node can not select children', function () {
      child.disabled = true;
      child.toggleSelection(true);
      [...root.children, ...child.children].forEach(n => expect(n.selected.value).toBe(ClrSelectedState.UNSELECTED));
    });

    it('re enabled disabled root node do not change children disable status', function () {
      child.disabled = true;

      expect(root.disabled).toBeFalse();
      expect(child.disabled).toBeTrue();

      root.disabled = true;
      expect(root.disabled).toBeTrue();
      expect(child.disabled).toBeTrue();

      root.disabled = false;
      expect(root.disabled).toBeFalse();
      expect(child.disabled).toBeTrue();
    });

    it('knows whether a node is inside a subtree expected to be expanded', function () {
      expect(child.children[0].isInExpandedSubtree()).toBeFalse();
      child.descendantsExpanded = true;
      expect(child.isInExpandedSubtree()).toBeTrue();
      expect(child.children[0].isInExpandedSubtree()).toBeTrue();
      expect(root.isInExpandedSubtree()).toBeFalse();
      expect(root.children[1].isInExpandedSubtree()).toBeFalse();
    });

    it('exposes the children it already knows about', function () {
      expect(root.loadedChildren).toBe(root.children);
    });

    describe('bulk expansion', function () {
      let nodes: Map<TestModel, FakeTreeNode>;

      beforeEach(function () {
        nodes = new Map();
        [root, child, ...root.children, ...child.children].forEach(model => {
          const node = new FakeTreeNode();
          nodes.set(model, node);
          model.node = node as unknown as ClrTreeNode<string>;
        });
      });

      it('expands or collapses a node and every descendant it already knows about', function () {
        root.setExpandedRecursive(true);
        nodes.forEach(node => expect(node.expanded).toBeTrue());

        child.setExpandedRecursive(false);
        expect(nodes.get(root).expanded).toBeTrue();
        expect(nodes.get(child).expanded).toBeFalse();
        child.children.forEach(c => expect(nodes.get(c).expanded).toBeFalse());
      });

      it('leaves disabled nodes and their descendants untouched', function () {
        child.disabled = true;
        root.setExpandedRecursive(true);
        expect(nodes.get(root).expanded).toBeTrue();
        expect(nodes.get(child).expanded).toBeFalse();
        child.children.forEach(c => expect(nodes.get(c).expanded).toBeFalse());
      });

      it('does nothing for a node that is not rendered', function () {
        const orphan = new TestModel('X', null);
        expect(() => orphan.setExpandedRecursive(true)).not.toThrow();
      });

      it('clears the descendantsExpanded flag of every ancestor when a node collapses', function () {
        root.descendantsExpanded = true;
        child.descendantsExpanded = true;

        child.children[0]._clearDescendantsExpanded();

        expect(root.descendantsExpanded).toBeFalse();
        expect(child.descendantsExpanded).toBeFalse();
        expect(nodes.get(root).descendantsCollapsedCount).toBe(1);
        expect(nodes.get(child).descendantsCollapsedCount).toBe(1);
        expect(nodes.get(child.children[0]).descendantsCollapsedCount).toBe(0);

        // Only notifies once
        child.children[0]._clearDescendantsExpanded();
        expect(nodes.get(root).descendantsCollapsedCount).toBe(1);
      });

      it('drops its reference to the node on destroy', function () {
        const model = new TestModel('Y', null);
        model.node = new FakeTreeNode() as unknown as ClrTreeNode<string>;
        model.destroy();
        expect(model.node).toBeNull();
      });
    });
  });
}

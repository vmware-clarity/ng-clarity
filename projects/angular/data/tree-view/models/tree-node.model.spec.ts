/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { BehaviorSubject } from 'rxjs';

import { ClrSelectedState } from './selected-state.enum';
import { TreeNodeExpander, TreeNodeModel } from './tree-node.model';

class TestModel extends TreeNodeModel<string> {
  children: TestModel[] = [];
  parent: TestModel | null;

  constructor(name: string, parent: TestModel) {
    super();
    this.model = name;
    this.parent = parent;
  }
}

class TestExpander implements TreeNodeExpander {
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

    describe('bulk expansion', function () {
      let expanders: Map<TestModel, TestExpander>;

      beforeEach(function () {
        expanders = new Map();
        [root, child, ...root.children, ...child.children].forEach(model => {
          const expander = new TestExpander();
          expanders.set(model, expander);
          model._expander = expander;
        });
      });

      it('expands or collapses a node and every known descendant', function () {
        root.setExpandedRecursive(true);
        expanders.forEach(expander => expect(expander.expanded).toBeTrue());
        child.setExpandedRecursive(false);
        expect(expanders.get(root).expanded).toBeTrue();
        expect(expanders.get(child).expanded).toBeFalse();
        child.children.forEach(c => expect(expanders.get(c).expanded).toBeFalse());
      });

      it('leaves disabled nodes and their descendants untouched', function () {
        child.disabled = true;
        root.setExpandedRecursive(true);
        expect(expanders.get(root).expanded).toBeTrue();
        expect(expanders.get(child).expanded).toBeFalse();
        child.children.forEach(c => expect(expanders.get(c).expanded).toBeFalse());
      });

      it('knows whether a node is inside a subtree expected to be expanded', function () {
        expect(child.children[0].isInExpandedSubtree()).toBeFalse();
        child.descendantsExpanded = true;
        expect(child.isInExpandedSubtree()).toBeTrue();
        expect(child.children[0].isInExpandedSubtree()).toBeTrue();
        expect(root.isInExpandedSubtree()).toBeFalse();
        expect(root.children[1].isInExpandedSubtree()).toBeFalse();
      });

      it('clears the descendantsExpanded flag of every ancestor when a node collapses', function () {
        root.descendantsExpanded = true;
        child.descendantsExpanded = true;
        child.children[0]._clearDescendantsExpanded();
        expect(root.descendantsExpanded).toBeFalse();
        expect(child.descendantsExpanded).toBeFalse();
        expect(expanders.get(root).descendantsCollapsedCount).toBe(1);
        expect(expanders.get(child).descendantsCollapsedCount).toBe(1);
        expect(expanders.get(child.children[0]).descendantsCollapsedCount).toBe(0);
        // Only notifies once
        child.children[0]._clearDescendantsExpanded();
        expect(expanders.get(root).descendantsCollapsedCount).toBe(1);
      });

      it('forgets its expander on destroy', function () {
        const model = new TestModel('X', null);
        model._expander = new TestExpander();
        model.destroy();
        expect(model._expander).toBeNull();
      });
    });
  });
}

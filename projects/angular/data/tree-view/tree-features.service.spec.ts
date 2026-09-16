/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TreeNodeModel } from './models/tree-node.model';
import { TreeFeaturesService, TreeNodeExpander } from './tree-features.service';

class TestModel extends TreeNodeModel<string> {
  children: TestModel[] = [];
  parent: TestModel | null;

  constructor(name: string, parent: TestModel | null) {
    super();
    this.model = name;
    this.parent = parent;
    if (parent) {
      parent.children.push(this);
    }
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
  describe('TreeFeaturesService', function () {
    let featuresService: TreeFeaturesService<string>;
    let root: TestModel;
    let child: TestModel;
    let grandChild: TestModel;
    let expanders: Map<TestModel, TestExpander>;

    beforeEach(function () {
      featuresService = new TreeFeaturesService<string>();
      root = new TestModel('A', null);
      child = new TestModel('AA', root);
      grandChild = new TestModel('AAA', child);
      expanders = new Map();
      [root, child, grandChild].forEach(model => {
        const expander = new TestExpander();
        expanders.set(model, expander);
        featuresService.registerExpander(model, expander);
      });
    });

    it('expands or collapses a node and every descendant it already knows about', function () {
      featuresService.setExpandedRecursive(root, true);
      expanders.forEach(expander => expect(expander.expanded).toBeTrue());

      featuresService.setExpandedRecursive(child, false);
      expect(expanders.get(root).expanded).toBeTrue();
      expect(expanders.get(child).expanded).toBeFalse();
      expect(expanders.get(grandChild).expanded).toBeFalse();
    });

    it('leaves disabled nodes and their descendants untouched', function () {
      child.disabled = true;
      featuresService.setExpandedRecursive(root, true);
      expect(expanders.get(root).expanded).toBeTrue();
      expect(expanders.get(child).expanded).toBeFalse();
      expect(expanders.get(grandChild).expanded).toBeFalse();
    });

    it('does nothing for a model whose node is not rendered', function () {
      const orphan = new TestModel('B', null);
      expect(() => featuresService.setExpandedRecursive(orphan, true)).not.toThrow();
    });

    it('clears the descendantsExpanded flag of every ancestor when a node collapses', function () {
      root.descendantsExpanded = true;
      child.descendantsExpanded = true;

      featuresService._onNodeCollapsed(grandChild);

      expect(root.descendantsExpanded).toBeFalse();
      expect(child.descendantsExpanded).toBeFalse();
      expect(expanders.get(root).descendantsCollapsedCount).toBe(1);
      expect(expanders.get(child).descendantsCollapsedCount).toBe(1);
      expect(expanders.get(grandChild).descendantsCollapsedCount).toBe(0);

      // Only notifies once
      featuresService._onNodeCollapsed(grandChild);
      expect(expanders.get(root).descendantsCollapsedCount).toBe(1);
    });

    it('clears the tree-wide flag and notifies the tree when a node collapses', function () {
      let cleared = 0;
      featuresService.allExpanded = true;
      featuresService._onAllExpandedCleared = () => cleared++;

      featuresService._onNodeCollapsed(grandChild);
      expect(featuresService.allExpanded).toBeFalse();
      expect(cleared).toBe(1);

      // Only notifies once
      featuresService._onNodeCollapsed(grandChild);
      expect(cleared).toBe(1);
    });

    it('unregisters a node only if it is still the registered one', function () {
      const replacement = new TestExpander();
      featuresService.registerExpander(child, replacement);

      // The previous node is destroyed after the replacement registered itself
      featuresService.unregisterExpander(child, expanders.get(child));
      featuresService.setExpandedRecursive(child, true);
      expect(replacement.expanded).toBeTrue();

      featuresService.unregisterExpander(child, replacement);
      replacement.expanded = false;
      featuresService.setExpandedRecursive(child, true);
      expect(replacement.expanded).toBeFalse();
    });
  });
}

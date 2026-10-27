/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAdvancedFilterGroup } from './advanced-filter-group.model';
import { ClrAdvancedFilterNode } from './advanced-filter-node.model';
import { ClrAdvancedFilter } from './advanced-filter.model';
import { ClrAdvancedFilterFieldType as FieldType } from '../enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterLogic as Logic } from '../enums/advanced-filter-logic.enum';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterChange } from '../interfaces/advanced-filter-change.interface';

function filter(field = 'name'): ClrAdvancedFilter {
  return new ClrAdvancedFilter({ key: field, label: field, type: FieldType.STRING }, Operator.CONTAINS, 'vm');
}

function listen(node: ClrAdvancedFilterNode): ClrAdvancedFilterChange[] {
  const changes: ClrAdvancedFilterChange[] = [];
  node.changes.subscribe(change => changes.push(change));
  return changes;
}

/**
 * Builds a group through the public API.
 */
function createGroup(logic = Logic.AND, children: ClrAdvancedFilterNode[] = []): ClrAdvancedFilterGroup {
  const group = new ClrAdvancedFilterGroup();
  group.logic = logic;
  children.forEach(child => group.addChild(child));
  return group;
}

/**
 * root (and) > middle (or) > deepest (and) > leaf
 */
function createTree() {
  const leaf = filter('leaf');
  const deepest = createGroup(Logic.AND, [leaf]);
  const middle = createGroup(Logic.OR, [deepest]);
  const root = createGroup(Logic.AND, [middle]);
  return { root, middle, deepest, leaf };
}

describe('ClrAdvancedFilterNode', () => {
  describe('detachChild()', () => {
    it('does nothing on a node without children', () => {
      class Leaf extends ClrAdvancedFilterNode {
        toJSON(): object {
          return {};
        }

        detach(child: ClrAdvancedFilterNode): void {
          this.detachChild(child);
        }
      }
      const leaf = new Leaf();
      const child = filter();
      expect(() => leaf.detach(child)).not.toThrow();
      expect(child.parent).toBeNull();
    });
  });

  describe('remove()', () => {
    it('detaches the node with its subtree', () => {
      const { root, middle, deepest, leaf } = createTree();
      middle.remove();
      expect(root.children).toEqual([]);
      expect(middle.parent).toBeNull();
      expect(middle.children).toEqual([deepest]);
      expect(leaf.parent).toBe(deepest);
    });

    it('emits on the former parent and its ancestors, not on the removed subtree', () => {
      const { root, middle, deepest, leaf } = createTree();
      const [rootChanges, middleChanges, deepestChanges, leafChanges] = [root, middle, deepest, leaf].map(listen);

      deepest.remove();

      expect(rootChanges.map(change => change.node)).toEqual([middle]);
      expect(middleChanges.map(change => change.node)).toEqual([middle]);
      expect(deepestChanges).toEqual([]);
      expect(leafChanges).toEqual([]);
    });

    it('lets subscribers of the former parent see the removed node without a parent', () => {
      const middle = createGroup(Logic.OR, [filter()]);
      const root = createGroup(Logic.AND, [middle]);
      let seen: unknown = 'not emitted';
      root.changes.subscribe(() => (seen = middle.parent));

      middle.remove();

      expect(seen).toBeNull();
    });

    it('does nothing for a node without a parent', () => {
      const root = createGroup(Logic.AND, [filter()]);
      const changes = listen(root);
      root.remove();
      expect(root.children.length).toBe(1);
      expect(changes).toEqual([]);
    });

    it('lets the node be added again', () => {
      const { root, middle } = createTree();
      middle.remove();
      root.addChild(middle);
      expect(root.children).toEqual([middle]);
      expect(middle.parent).toBe(root);
    });
  });

  describe('changes', () => {
    it('does not emit on subscribe', () => {
      const { root } = createTree();
      expect(listen(root)).toEqual([]);
    });

    it('emits on the changed node and every ancestor, deepest first, root last', () => {
      const { root, middle, deepest, leaf } = createTree();
      const order: string[] = [];
      [root, middle, deepest, leaf].forEach((node, index) =>
        node.changes.subscribe(() => order.push(['root', 'middle', 'deepest', 'leaf'][index]))
      );

      leaf.value = 'other';

      expect(order).toEqual(['leaf', 'deepest', 'middle', 'root']);
    });

    it('emits the same frozen change object on every node', () => {
      const { root, leaf } = createTree();
      const [rootChanges, leafChanges] = [listen(root), listen(leaf)];

      leaf.value = 'other';

      expect(rootChanges.length).toBe(1);
      expect(rootChanges[0]).toBe(leafChanges[0]);
      expect(rootChanges[0].node).toBe(leaf);
      expect(Object.isFrozen(rootChanges[0])).toBeTrue();
    });

    it('emits one change per changed node', () => {
      const { root, middle, deepest } = createTree();
      const [rootChanges, middleChanges] = [listen(root), listen(middle)];

      middle.addChild(filter('added'));
      root.addChild(deepest);

      expect(rootChanges.map(change => change.node)).toEqual([middle, middle, root]);
      expect(middleChanges.map(change => change.node)).toEqual([middle, middle]);
    });

    it('emits on its own root only, once a subtree is detached', () => {
      const { root, middle, leaf } = createTree();
      middle.remove();
      const [rootChanges, middleChanges] = [listen(root), listen(middle)];

      leaf.value = 'other';

      expect(rootChanges).toEqual([]);
      expect(middleChanges.map(change => change.node)).toEqual([leaf]);
    });

    it('delivers a change to a node that an earlier subscriber starts listening to', () => {
      const { root, leaf } = createTree();
      const received: ClrAdvancedFilterChange[] = [];
      leaf.changes.subscribe(() => root.changes.subscribe(change => received.push(change)));

      leaf.value = 'other';

      expect(received.length).toBe(1);
    });

    it('delivers changes made by a subscriber after the current one, before the call returns', () => {
      const { root, leaf } = createTree();
      const log: string[] = [];
      root.changes.subscribe(change => {
        log.push(`first ${change.node.id}`);
        if (change.node === leaf) {
          root.logic = Logic.OR;
        }
      });
      root.changes.subscribe(change => log.push(`second ${change.node.id}`));

      leaf.value = 'other';

      expect(log).toEqual([`first ${leaf.id}`, `second ${leaf.id}`, `first ${root.id}`, `second ${root.id}`]);
    });
  });

  describe('changes, more cases', () => {
    it('emits the removal before the addition, each up to its own root', () => {
      const a = filter('a');
      const nested = new ClrAdvancedFilterGroup();
      const root = createGroup(Logic.AND, [a, nested]);
      const order: string[] = [];
      root.changes.subscribe(() => order.push('root'));
      nested.changes.subscribe(() => order.push('nested'));

      nested.addChild(a);

      expect(order).toEqual(['root', 'nested', 'root']);
    });

    it('is the same Observable on every read', () => {
      const node = filter();
      expect(node.changes).toBe(node.changes);
    });
  });

  describe('id', () => {
    it('is unique', () => {
      const { root, middle, deepest, leaf } = createTree();
      expect(new Set([root.id, middle.id, deepest.id, leaf.id]).size).toBe(4);
    });

    it('never changes', () => {
      const { root, middle, deepest, leaf } = createTree();
      const ids = [root.id, middle.id, deepest.id, leaf.id];

      leaf.value = 'other';
      middle.logic = Logic.AND;
      root.addChild(deepest);
      deepest.remove();
      middle.addChild(deepest);
      root.clear();

      expect([root.id, middle.id, deepest.id, leaf.id]).toEqual(ids);
    });
  });
});

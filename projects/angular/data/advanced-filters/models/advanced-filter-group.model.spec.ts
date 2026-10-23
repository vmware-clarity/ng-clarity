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
 * A node of a class the groups do not accept.
 */
class ForeignNode extends ClrAdvancedFilterNode {
  toJSON(): object {
    return {};
  }
}

describe('ClrAdvancedFilterGroup', () => {
  describe('a new group', () => {
    it('defaults to an empty AND group without a parent', () => {
      const group = new ClrAdvancedFilterGroup();
      expect(group.logic).toBe(Logic.AND);
      expect(group.children).toEqual([]);
      expect(Object.isFrozen(group.children)).toBeTrue();
      expect(group.parent).toBeNull();
    });

    it('creates a new id every time', () => {
      expect(new ClrAdvancedFilterGroup().id).not.toBe(new ClrAdvancedFilterGroup().id);
    });
  });

  describe('logic', () => {
    it('emits when it changes', () => {
      const group = new ClrAdvancedFilterGroup();
      const changes = listen(group);
      group.logic = Logic.OR;
      expect(group.logic).toBe(Logic.OR);
      expect(changes.map(change => change.node)).toEqual([group]);
    });

    it('emits nothing when set to the current logic', () => {
      const group = createGroup(Logic.OR);
      const changes = listen(group);
      group.logic = Logic.OR;
      expect(changes).toEqual([]);
    });

    it('throws for an unknown logic and keeps the current one', () => {
      const group = createGroup(Logic.OR);
      const changes = listen(group);
      expect(() => (group.logic = 'xor' as Logic)).toThrowError(/Invalid ClrAdvancedFilterLogic/);
      expect(group.logic).toBe(Logic.OR);
      expect(changes).toEqual([]);
    });
  });

  describe('addChild()', () => {
    let group: ClrAdvancedFilterGroup;
    let a: ClrAdvancedFilter;
    let b: ClrAdvancedFilter;

    beforeEach(() => {
      [a, b] = [filter('a'), filter('b')];
      group = createGroup(Logic.AND, [a, b]);
    });

    it('appends a node and returns it', () => {
      const c = filter('c');
      expect(group.addChild(c)).toBe(c);
      expect(group.children).toEqual([a, b, c]);
      expect(c.parent).toBe(group);
    });

    it('inserts a node at an index', () => {
      const [c, d] = [filter('c'), filter('d')];
      group.addChild(c, 0);
      group.addChild(d, 2);
      expect(group.children).toEqual([c, a, d, b]);
    });

    it('appends when the index is not a position in the group', () => {
      [-1, 3, 1.5, NaN, Infinity].forEach(index => {
        const c = filter('c');
        group.addChild(c, index);
        expect(group.children[group.children.length - 1])
          .withContext(String(index))
          .toBe(c);
      });
    });

    it('treats -0 as the first position', () => {
      const c = filter('c');
      group.addChild(c, -0);
      expect(group.children[0]).toBe(c);
    });

    it('reorders a child, the index being its position after the call', () => {
      const c = group.addChild(filter('c'));
      const changes = listen(group);
      group.addChild(a, 2);
      expect(group.children).toEqual([b, c, a]);
      expect(changes.map(change => change.node)).toEqual([group]);
    });

    it('emits nothing when the last child is added at the end by index', () => {
      const children = group.children;
      const changes = listen(group);

      group.addChild(b, 2);
      group.addChild(b, 1);

      expect(group.children).toBe(children);
      expect(changes).toEqual([]);
    });

    it('emits nothing when the node already is at that position', () => {
      const children = group.children;
      const changes = listen(group);
      group.addChild(a, 0);
      group.addChild(b);
      expect(group.children).toBe(children);
      expect(changes).toEqual([]);
    });

    it('moves a node to another group of the tree as a removal and an addition: two changes, removal first', () => {
      const nested = group.addChild(new ClrAdvancedFilterGroup());
      const changes = listen(group);
      const parentsSeen: unknown[] = [];
      group.changes.subscribe(() => parentsSeen.push(a.parent));

      nested.addChild(a);

      expect(group.children).toEqual([b, nested]);
      expect(nested.children).toEqual([a]);
      expect(a.parent).toBe(nested);
      expect(changes.map(change => change.node)).toEqual([group, nested]);
      expect(parentsSeen).withContext('both changes go out after the move is complete').toEqual([nested, nested]);
    });

    it('moves a node between trees, with one emission per tree', () => {
      const other = new ClrAdvancedFilterGroup();
      const [changes, otherChanges] = [listen(group), listen(other)];

      other.addChild(a);

      expect(group.children).toEqual([b]);
      expect(other.children).toEqual([a]);
      expect(changes.map(change => change.node)).toEqual([group]);
      expect(otherChanges.map(change => change.node)).toEqual([other]);
    });

    it('takes the ancestors of both changes before delivering the first', () => {
      const [other, outer] = [new ClrAdvancedFilterGroup(), new ClrAdvancedFilterGroup()];
      const outerChanges = listen(outer);
      let moved = false;
      group.changes.subscribe(() => {
        if (!moved) {
          moved = true;
          outer.addChild(other);
        }
      });

      other.addChild(a);

      expect(other.parent).toBe(outer);
      expect(outerChanges.map(change => change.node))
        .withContext('the addition to other was not delivered to outer, which other joined later')
        .toEqual([outer]);
    });

    it('adds a removed node again, with its id and subtree', () => {
      const nested = group.addChild(createGroup(Logic.OR, [filter('c')]));
      const [id, children] = [nested.id, nested.children];
      nested.remove();
      group.addChild(nested, 0);
      expect(group.children[0]).toBe(nested);
      expect(nested.id).toBe(id);
      expect(nested.children).toBe(children);
    });

    it('throws for a cycle or a foreign node, and changes nothing', () => {
      const nested = group.addChild(new ClrAdvancedFilterGroup());
      const deeper = nested.addChild(new ClrAdvancedFilterGroup());
      const children = group.children;
      const changes = listen(group);

      expect(() => group.addChild(group)).toThrowError(/itself or to one of its descendants/);
      expect(() => deeper.addChild(group)).toThrowError(/itself or to one of its descendants/);
      expect(() => deeper.addChild(nested)).toThrowError(/itself or to one of its descendants/);
      expect(() => group.addChild(new ForeignNode())).toThrowError(/only/);
      expect(() => group.addChild({} as ClrAdvancedFilterNode)).toThrowError(/only/);

      expect(group.children).toBe(children);
      expect(nested.parent).toBe(group);
      expect(changes).toEqual([]);
    });
  });

  describe('clear()', () => {
    it('empties the group and resets the logic to AND, keeping the id', () => {
      const [a, b] = [filter('a'), filter('b')];
      const group = createGroup(Logic.OR, [a, b]);
      const id = group.id;
      const changes = listen(group);

      group.clear();

      expect(group.id).toBe(id);
      expect(group.logic).toBe(Logic.AND);
      expect(group.children).toEqual([]);
      expect(changes.map(change => change.node)).toEqual([group]);
    });

    it('detaches the children, which stay usable', () => {
      const a = filter('a');
      const group = createGroup(Logic.AND, [a]);
      group.clear();
      expect(a.parent).toBeNull();
      new ClrAdvancedFilterGroup().addChild(a);
      expect(group.children).toEqual([]);
    });

    it('emits nothing for an empty AND group', () => {
      const group = new ClrAdvancedFilterGroup();
      const changes = listen(group);
      group.clear();
      expect(changes).toEqual([]);
    });

    it('turns an empty OR group into the empty AND group', () => {
      const group = createGroup(Logic.OR);
      const changes = listen(group);
      group.clear();
      expect(group.logic).toBe(Logic.AND);
      expect(changes.length).toBe(1);
    });

    it('keeps the children array of an empty OR group, as only the logic changes', () => {
      const fresh = createGroup(Logic.OR);
      const emptied = createGroup(Logic.OR, [filter()]);
      emptied.children[0].remove();

      [fresh, emptied].forEach(group => {
        const children = group.children;
        const changes = listen(group);
        group.clear();
        expect(group.logic).toBe(Logic.AND);
        expect(group.children).toBe(children);
        expect(changes.length).toBe(1);
      });
    });

    it('leaves a cleared nested group in place', () => {
      const nested = createGroup(Logic.OR, [filter()]);
      const root = createGroup(Logic.AND, [nested]);
      nested.clear();
      expect(root.children).toEqual([nested]);
      expect(nested.parent).toBe(root);
    });
  });

  describe('children', () => {
    it('is a frozen array', () => {
      const group = createGroup(Logic.AND, [filter()]);
      expect(Object.isFrozen(group.children)).toBeTrue();
      expect(() => (group.children as ClrAdvancedFilterNode[]).push(filter())).toThrowError(TypeError);
    });

    it('stays frozen after every kind of change', () => {
      const [a, b, c] = [filter('a'), filter('b'), filter('c')];
      const first = createGroup(Logic.AND, [a, b, c]);
      const second = new ClrAdvancedFilterGroup();
      const frozen = () => [first, second].every(group => Object.isFrozen(group.children));

      second.addChild(a);
      expect(frozen()).withContext('addChild() from another group').toBeTrue();
      first.addChild(c, 0);
      expect(frozen()).withContext('addChild() reorder').toBeTrue();
      b.remove();
      expect(frozen()).withContext('remove()').toBeTrue();
      second.clear();
      expect(frozen()).withContext('clear()').toBeTrue();
    });

    it('is replaced exactly when the list changes', () => {
      const a = filter('a');
      const group = createGroup(Logic.AND, [a]);
      let children = group.children;

      group.logic = Logic.OR;
      a.value = 'other';
      group.addChild(a, 0);
      expect(group.children).toBe(children);

      group.addChild(filter('b'));
      expect(group.children).not.toBe(children);
      children = group.children;

      a.remove();
      expect(group.children).not.toBe(children);
      children = group.children;

      group.clear();
      expect(group.children).not.toBe(children);
    });
  });

  describe('toJSON()', () => {
    it('returns the public state of the whole subtree as plain data', () => {
      const a = filter('a');
      const nested = createGroup(Logic.OR, [a]);
      const root = createGroup(Logic.AND, [nested]);

      expect(JSON.parse(JSON.stringify(root))).toEqual({
        id: root.id,
        logic: 'and',
        children: [
          {
            id: nested.id,
            logic: 'or',
            children: [{ id: a.id, field: 'a', operator: 'contains', value: 'vm' }],
          },
        ],
      });
    });
  });
});

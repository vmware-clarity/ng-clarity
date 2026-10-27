/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AdvancedFilterPills } from './advanced-filter-pills';
import { ClrAdvancedFilterFieldType as FieldType } from '../enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterLogic as Logic } from '../enums/advanced-filter-logic.enum';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { AdvancedFilterPillKind as Kind } from '../enums/advanced-filter-pill-kind.enum';
import { ClrAdvancedFilterValue } from '../interfaces/advanced-filter-condition.interface';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { AdvancedFilterPillEdit } from '../interfaces/advanced-filter-pill-edit.interface';
import { AdvancedFilterPillRow } from '../interfaces/advanced-filter-pill-row.interface';
import { ClrAdvancedFilterGroup } from '../models/advanced-filter-group.model';
import { ClrAdvancedFilter } from '../models/advanced-filter.model';
import { ClrEnumFilterValidator } from '../validators/enum-filter-validator';
import { ClrStringFilterValidator } from '../validators/string-filter-validator';

const NAME: ClrAdvancedFilterField = {
  key: 'name',
  label: 'Name',
  type: FieldType.STRING,
  validator: new ClrStringFilterValidator(),
};
const CITY: ClrAdvancedFilterField = {
  key: 'city',
  label: 'City',
  type: FieldType.STRING,
  validator: new ClrStringFilterValidator(),
};
const REGION: ClrAdvancedFilterField = {
  key: 'region',
  label: 'Region',
  type: FieldType.ENUM,
  validator: new ClrEnumFilterValidator(),
  options: [{ value: 'eu', label: 'EU Central' }],
};

describe('AdvancedFilterPills', () => {
  let pills: AdvancedFilterPills;
  let root: ClrAdvancedFilterGroup;

  const name = (value: string) => new ClrAdvancedFilter(NAME, Operator.CONTAINS, value);

  function row(
    filter: ClrAdvancedFilter | null,
    value: ClrAdvancedFilterValue,
    operator = Operator.CONTAINS
  ): AdvancedFilterPillRow {
    return { id: `row-${String(value)}`, filter, operator, value };
  }

  function edit(rows: AdvancedFilterPillRow[], logic = Logic.AND, field = NAME): AdvancedFilterPillEdit {
    return { field, logic, rows };
  }

  function group(logic: Logic, ...children: (ClrAdvancedFilter | ClrAdvancedFilterGroup)[]): ClrAdvancedFilterGroup {
    const result = new ClrAdvancedFilterGroup();
    result.logic = logic;
    children.forEach(child => result.addChild(child));
    return result;
  }

  const values = (node: ClrAdvancedFilterGroup) => node.children.map(child => (child as ClrAdvancedFilter).value);

  beforeEach(() => {
    pills = new AdvancedFilterPills();
    root = new ClrAdvancedFilterGroup();
  });

  describe('building the pills', () => {
    it('gives a filter a FIELD pill with the definition among the fields', () => {
      const filter = root.addChild(new ClrAdvancedFilter({ ...NAME, label: 'Old' }, Operator.CONTAINS, 'Alice'));
      const [pill] = pills.build(root, [NAME]);
      expect(pill).toEqual({ node: filter, kind: Kind.FIELD, field: NAME, filters: [filter], duplicate: false });
    });

    it("falls back to the filter's own definition", () => {
      const filter = root.addChild(name('Alice'));
      expect(pills.build(root, [])[0].field).toBe(filter.field);
    });

    it('gives a group of filters on one field a FIELD pill, its filters in order', () => {
      const alice = name('Alice');
      const peter = name('Peter');
      const node = root.addChild(group(Logic.OR, alice, peter));
      const [pill] = pills.build(root, [NAME]);
      expect([pill.node, pill.kind, pill.field, pill.filters]).toEqual([node, Kind.FIELD, NAME, [alice, peter]]);
    });

    it('gives a SUMMARY pill with every filter below it to a group the layout cannot edit', () => {
      const alice = name('Alice');
      const paris = new ClrAdvancedFilter(CITY, Operator.CONTAINS, 'Paris');
      const peter = name('Peter');
      root.addChild(group(Logic.AND, alice, paris));
      root.addChild(group(Logic.AND, peter, group(Logic.OR, name('Ann'))));
      root.addChild(new ClrAdvancedFilterGroup());

      const result = pills.build(root, [NAME, CITY]);
      expect(result.map(pill => pill.kind)).toEqual([Kind.SUMMARY, Kind.SUMMARY, Kind.SUMMARY]);
      expect(result.map(pill => pill.filters.length)).toEqual([2, 2, 0]);
      expect(result[0]).toEqual(jasmine.objectContaining({ field: null, filters: [alice, paris], duplicate: false }));
    });

    it('marks every pill after the first of its field as a duplicate, and ignores SUMMARY pills', () => {
      root.addChild(group(Logic.AND, name('Ann'), new ClrAdvancedFilter(CITY, Operator.CONTAINS, 'Paris')));
      root.addChild(name('Alice'));
      root.addChild(new ClrAdvancedFilter(CITY, Operator.CONTAINS, 'Rome'));
      root.addChild(group(Logic.OR, name('Peter')));
      expect(pills.build(root, [NAME, CITY]).map(pill => pill.duplicate)).toEqual([false, false, false, true]);
    });

    it('ignores the logic of the root', () => {
      root.logic = Logic.OR;
      root.addChild(name('Alice'));
      expect(pills.build(root, [NAME]).length).toBe(1);
    });
  });

  it('offers AND / OR for DATE, NUMBER and STRING fields only', () => {
    const supports = (type: FieldType) => pills.supportsLogic({ key: 'k', label: 'K', type });
    expect([FieldType.STRING, FieldType.NUMBER, FieldType.DATE].map(supports)).toEqual([true, true, true]);
    expect([FieldType.BOOLEAN, FieldType.ENUM].map(supports)).toEqual([false, false]);
  });

  describe('adding', () => {
    it('adds a group for a field with AND / OR, even with one condition, in one change of the root', () => {
      root.addChild(name('first'));
      const changes = jasmine.createSpy('changes');
      root.changes.subscribe(changes);

      const added = pills.add(root, edit([row(null, 'Alice')], Logic.OR));
      expect(changes).toHaveBeenCalledTimes(1);
      expect(root.children[1]).toBe(added);
      expect(added).toEqual(jasmine.any(ClrAdvancedFilterGroup));
      const addedGroup = added as ClrAdvancedFilterGroup;
      expect(addedGroup.logic).toBe(Logic.OR);
      expect(values(addedGroup)).toEqual(['Alice']);
      expect((addedGroup.children[0] as ClrAdvancedFilter).field).toBe(NAME);
    });

    it('adds every row, in order', () => {
      const added = pills.add(root, edit([row(null, 'Alice'), row(null, 'Peter')])) as ClrAdvancedFilterGroup;
      expect(values(added)).toEqual(['Alice', 'Peter']);
    });

    it('adds a filter for a field without AND / OR', () => {
      const added = pills.add(root, edit([row(null, ['eu'], Operator.IN)], Logic.AND, REGION));
      expect(added).toEqual(jasmine.any(ClrAdvancedFilter));
      expect(root.children).toEqual([added]);
      expect((added as ClrAdvancedFilter).value).toEqual(['eu']);
    });
  });

  describe('updating', () => {
    it('edits a group in place: its logic, the kept filters, removed and new rows, in the order of the rows', () => {
      const alice = name('Alice');
      const peter = name('Peter');
      const william = name('William');
      const node = root.addChild(group(Logic.AND, alice, peter, william));

      const result = pills.update(
        node,
        edit([row(william, 'Will'), row(null, 'Ann'), row(alice, 'Alice', Operator.STARTS_WITH)], Logic.OR)
      );

      expect(result).toBe(node);
      expect(node.logic).toBe(Logic.OR);
      expect(node.children[0]).toBe(william);
      expect(node.children[2]).toBe(alice);
      expect(values(node)).toEqual(['Will', 'Ann', 'Alice']);
      expect(alice.operator).toBe(Operator.STARTS_WITH);
      expect(peter.parent).toBeNull();
    });

    it('edits a filter with one row in place', () => {
      const alice = root.addChild(name('Alice'));
      expect(pills.update(alice, edit([row(alice, 'Ann')]))).toBe(alice);
      expect(alice.value).toBe('Ann');
      expect(root.children).toEqual([alice]);
    });

    it('gives a filter the values of the only row, also a new one', () => {
      const alice = root.addChild(name('Alice'));
      pills.update(alice, edit([row(null, 'Peter', Operator.ENDS_WITH)]));
      expect([alice.operator, alice.value]).toEqual([Operator.ENDS_WITH, 'Peter']);
    });

    it('moves a filter that gets more rows into a new group at its place, keeping its id', () => {
      const before = root.addChild(new ClrAdvancedFilter(CITY, Operator.CONTAINS, 'Paris'));
      const alice = root.addChild(name('Alice'));
      const after = root.addChild(new ClrAdvancedFilter(CITY, Operator.CONTAINS, 'Rome'));
      const id = alice.id;

      const result = pills.update(alice, edit([row(alice, 'Alice'), row(null, 'Peter')], Logic.OR));

      expect(root.children).toEqual([before, result, after]);
      const created = result as ClrAdvancedFilterGroup;
      expect(created.logic).toBe(Logic.OR);
      expect(created.children[0]).toBe(alice);
      expect(alice.id).toBe(id);
      expect(values(created)).toEqual(['Alice', 'Peter']);
    });

    it('removes a filter whose row was removed when it gets a group', () => {
      const alice = root.addChild(name('Alice'));
      const result = pills.update(alice, edit([row(null, 'Peter'), row(null, 'Ann')])) as ClrAdvancedFilterGroup;
      expect(root.children).toEqual([result]);
      expect(alice.parent).toBeNull();
      expect(values(result)).toEqual(['Peter', 'Ann']);
    });

    it('builds the group of a filter without a parent, without adding it anywhere', () => {
      const alice = name('Alice');
      const result = pills.update(alice, edit([row(alice, 'Alice'), row(null, 'Peter')])) as ClrAdvancedFilterGroup;
      expect(result.parent).toBeNull();
      expect(alice.parent).toBe(result);
    });
  });
});

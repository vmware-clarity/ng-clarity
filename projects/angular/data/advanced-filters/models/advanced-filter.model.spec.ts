/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAdvancedFilter } from './advanced-filter.model';
import { ClrAdvancedFilterFieldType as FieldType } from '../enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError as Code } from '../enums/advanced-filter-validation-error.enum';
import { ClrAdvancedFilterChange } from '../interfaces/advanced-filter-change.interface';
import { ClrAdvancedFilterValue } from '../interfaces/advanced-filter-condition.interface';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { ClrAdvancedFilterValidationException } from '../validators/advanced-filter-validation-exception';
import { ClrBooleanFilterValidator } from '../validators/boolean-filter-validator';
import { ClrEnumFilterValidator } from '../validators/enum-filter-validator';
import { ClrNumberFilterValidator } from '../validators/number-filter-validator';
import { ClrStringFilterValidator } from '../validators/string-filter-validator';

const NAME: ClrAdvancedFilterField = {
  key: 'name',
  label: 'Name',
  type: FieldType.STRING,
  validator: new ClrStringFilterValidator(),
};
const CPU: ClrAdvancedFilterField = {
  key: 'cpu',
  label: 'CPU',
  type: FieldType.NUMBER,
  validator: new ClrNumberFilterValidator(),
};
const BACKED_UP: ClrAdvancedFilterField = {
  key: 'backedUp',
  label: 'Backed up',
  type: FieldType.BOOLEAN,
  validator: new ClrBooleanFilterValidator(),
};
const STATUS: ClrAdvancedFilterField = {
  key: 'status',
  label: 'Status',
  type: FieldType.ENUM,
  validator: new ClrEnumFilterValidator(),
  options: [
    { value: 'pending', label: 'Pending' },
    { value: 1, label: 'One' },
  ],
};

/**
 * Builds a filter from loosely typed arguments, to check what the constructor does with bad input.
 */
function create(field: unknown, operator: unknown, value?: unknown): ClrAdvancedFilter {
  return new ClrAdvancedFilter(field as ClrAdvancedFilterField, operator as Operator, value as ClrAdvancedFilterValue);
}

/**
 * The code of the validation exception `action` throws, or 'no exception'.
 */
function codeOf(action: () => unknown): Code | string {
  try {
    action();
  } catch (error) {
    return error instanceof ClrAdvancedFilterValidationException ? error.code : 'another error';
  }
  return 'no exception';
}

function listen(filter: ClrAdvancedFilter): ClrAdvancedFilterChange[] {
  const changes: ClrAdvancedFilterChange[] = [];
  filter.changes.subscribe(change => changes.push(change));
  return changes;
}

describe('ClrAdvancedFilter', () => {
  describe('constructor', () => {
    it('builds a filter for every kind of value', () => {
      const single = new ClrAdvancedFilter(NAME, Operator.CONTAINS, 'vm');
      const range = new ClrAdvancedFilter(CPU, Operator.BETWEEN, [2, 8]);
      const set = new ClrAdvancedFilter(STATUS, Operator.IN, ['pending', 1]);
      const none = new ClrAdvancedFilter(NAME, Operator.IS_EMPTY);

      expect([single.field, single.operator, single.value]).toEqual([NAME, Operator.CONTAINS, 'vm']);
      expect(range.value).toEqual([2, 8]);
      expect(set.value).toEqual(['pending', 1]);
      expect(none.value).toBeUndefined();
    });

    it('keeps the field definition by reference', () => {
      expect(new ClrAdvancedFilter(NAME, Operator.CONTAINS, 'vm').field).toBe(NAME);
    });

    it('throws for any value given to IS_EMPTY, null and blank text included', () => {
      ['x', null, '', 0, false, ['a']].forEach(value =>
        expect(() => create(NAME, Operator.IS_EMPTY, value))
          .withContext(JSON.stringify(value))
          .toThrowError(/not a complete filter/)
      );
    });

    it('builds boolean filters with EQUALS and true or false', () => {
      expect(new ClrAdvancedFilter(BACKED_UP, Operator.EQUALS, true).value).toBeTrue();
      expect(new ClrAdvancedFilter(BACKED_UP, Operator.EQUALS, false).value).toBeFalse();
    });

    it('keeps a single value as it is', () => {
      expect(new ClrAdvancedFilter(NAME, Operator.CONTAINS, ' a ').value).toBe(' a ');
      expect(new ClrAdvancedFilter(CPU, Operator.EQUALS, -0).value).toBe(-0);
    });

    it('copies an array value and freezes the copy', () => {
      const value = ['pending'];
      const filter = new ClrAdvancedFilter(STATUS, Operator.IN, value);

      value.push('failed');

      expect(filter.value).toEqual(['pending']);
      expect(Object.isFrozen(filter.value)).toBeTrue();
      expect(() => (filter.value as string[]).push('failed')).toThrowError(TypeError);
    });

    it('copies an array by index, not through its iterator', () => {
      const value = ['pending'];
      value[Symbol.iterator] = function* () {
        yield null;
      };
      expect(new ClrAdvancedFilter(STATUS, Operator.IN, value).value).toEqual(['pending']);

      const noIterator = [1, 2];
      noIterator[Symbol.iterator] = undefined;
      expect(() => new ClrAdvancedFilter(CPU, Operator.BETWEEN, noIterator)).not.toThrow();
    });

    it('throws for a filter that is not complete', () => {
      [
        [NAME, 'toString', 'a'],
        [NAME, 'notIn', ['a']],
        [NAME, undefined, 'a'],
        [NAME, Operator.CONTAINS],
        [NAME, Operator.CONTAINS, '  '],
        [NAME, Operator.CONTAINS, null],
        [CPU, Operator.EQUALS, NaN],
        [CPU, Operator.EQUALS, Infinity],
        [CPU, Operator.BETWEEN, 5],
        [CPU, Operator.BETWEEN, [1]],
        [CPU, Operator.BETWEEN, [true, false]],
        [STATUS, Operator.IN, []],
        [STATUS, Operator.IN, [, 'a']],
        [STATUS, Operator.IN, [{}]],
      ].forEach(([field, operator, value]) =>
        expect(() => create(field, operator, value))
          .withContext(`${(field as ClrAdvancedFilterField).key} ${String(operator)} ${JSON.stringify(value)}`)
          .toThrowError(/not a complete filter/)
      );
    });

    it('applies the rules of the field type', () => {
      expect(() => create(CPU, Operator.CONTAINS, 'a')).toThrowError(/unsupportedOperator/);
      expect(() => create(NAME, Operator.BETWEEN, ['a', 'b'])).toThrowError(/unsupportedOperator/);
      expect(() => create(CPU, Operator.EQUALS, '60')).toThrowError(/invalidNumber/);
      expect(() => create(CPU, Operator.BETWEEN, [8, 2])).toThrowError(/invalidRange/);
      expect(() => create(BACKED_UP, Operator.EQUALS, 'true')).toThrowError(/required/);
    });

    it("uses the field's own validator when it has one", () => {
      class NoTestValidator extends ClrStringFilterValidator {
        protected override validateSingle(operator: Operator, value: unknown): Code | null {
          return value === 'test' ? Code.REQUIRED : super.validateSingle(operator, value);
        }
      }
      const field: ClrAdvancedFilterField = { ...NAME, validator: new NoTestValidator() };

      expect(() => new ClrAdvancedFilter(field, Operator.EQUALS, 'test')).toThrowError(/not a complete filter/);
      expect(new ClrAdvancedFilter(field, Operator.EQUALS, 'prod').value).toBe('prod');
    });

    it('throws without a field definition, or for a blank key', () => {
      [null, undefined, 'name', 42].forEach(field =>
        expect(() => create(field, Operator.CONTAINS, 'a'))
          .withContext(String(field))
          .toThrowError(/a field definition is required/)
      );
      expect(() => create({ ...NAME, key: '' }, Operator.CONTAINS, 'a')).toThrowError(/not a complete filter/);
    });

    it('checks only the shape for a field without a validator, whatever its type', () => {
      const cpu = { key: 'cpu', label: 'CPU', type: FieldType.NUMBER };
      const custom = { key: 'ip', label: 'IP', type: 'ip' as FieldType };

      expect(create(cpu, Operator.CONTAINS, 'abc').value).toBe('abc');
      expect(create(cpu, Operator.BETWEEN, [8, 2]).value).toEqual([8, 2]);
      expect(create(custom, Operator.EQUALS, '10.0.0.1').value).toBe('10.0.0.1');
      [
        [cpu, 'toString', 'a'],
        [cpu, Operator.BETWEEN],
        [cpu, Operator.IS_EMPTY, 5],
        [cpu, Operator.EQUALS, {}],
        [custom, Operator.EQUALS, NaN],
      ].forEach(([field, operator, value]) =>
        expect(() => create(field, operator, value))
          .withContext(`${String(operator)} ${JSON.stringify(value)}`)
          .toThrowError(/not a complete filter/)
      );
    });

    it('reads the validator of the field once, when it is built', () => {
      const field: ClrAdvancedFilterField = { ...CPU };
      const filter = new ClrAdvancedFilter(field, Operator.GREATER_THAN, 4);

      field.validator = new ClrStringFilterValidator();

      expect(() => (filter.value = 'abc')).toThrowError(/invalidNumber/);
    });

    it('copies a filter, with a new id', () => {
      const filter = new ClrAdvancedFilter(CPU, Operator.BETWEEN, [2, 8]);
      const copy = new ClrAdvancedFilter(filter.field, filter.operator, filter.value);
      expect([copy.field, copy.operator, copy.value]).toEqual([filter.field, filter.operator, filter.value]);
      expect(copy.id).not.toBe(filter.id);
    });

    it('starts complete and without a parent', () => {
      const filter = new ClrAdvancedFilter(NAME, Operator.IS_EMPTY);
      expect(filter.error).toBeNull();
      expect(filter.parent).toBeNull();
    });
  });

  describe('operator setter', () => {
    let filter: ClrAdvancedFilter;
    let changes: ClrAdvancedFilterChange[];

    beforeEach(() => {
      filter = new ClrAdvancedFilter(CPU, Operator.GREATER_THAN, 4);
      changes = listen(filter);
    });

    it('keeps the value when it suits the new operator, with one emission', () => {
      filter.operator = Operator.LESS_THAN_OR_EQUAL;
      expect([filter.operator, filter.value, filter.error]).toEqual([Operator.LESS_THAN_OR_EQUAL, 4, null]);
      expect(changes.length).toBe(1);
      expect(changes[0].node).toBe(filter);
    });

    it('clears a value that does not suit the new operator, and leaves the filter incomplete', () => {
      filter.operator = Operator.BETWEEN;
      expect([filter.operator, filter.value, filter.error]).toEqual([Operator.BETWEEN, undefined, Code.REQUIRED]);
      expect(changes.length).toBe(1);

      filter.value = [1, 8];
      expect([filter.operator, filter.value, filter.error]).toEqual([Operator.BETWEEN, [1, 8], null]);
      expect(changes.length).toBe(2);
    });

    it('clears the value when switching to IS_EMPTY, which leaves the filter complete', () => {
      filter.operator = Operator.IS_EMPTY;
      expect([filter.operator, filter.value, filter.error]).toEqual([Operator.IS_EMPTY, undefined, null]);
      expect(changes.length).toBe(1);
    });

    it('uses the rules of the field type to decide whether the value suits', () => {
      const range = new ClrAdvancedFilter(CPU, Operator.BETWEEN, [1, 5]);
      range.operator = Operator.EQUALS;
      expect([range.value, range.error]).toEqual([undefined, Code.REQUIRED]);

      const text = new ClrAdvancedFilter(NAME, Operator.CONTAINS, 'vm');
      text.operator = Operator.STARTS_WITH;
      expect(text.value).toBe('vm');
    });

    it('throws for an operator the field does not allow, and changes nothing', () => {
      [Operator.CONTAINS, Operator.IN, 'toString', 'notIn', null, undefined].forEach(operator =>
        expect(() => (filter.operator = operator as Operator))
          .withContext(String(operator))
          .toThrowError(/does not allow/)
      );
      expect([filter.operator, filter.value]).toEqual([Operator.GREATER_THAN, 4]);
      expect(changes).toEqual([]);
    });

    it('accepts every known operator for a field without a validator', () => {
      const plain = new ClrAdvancedFilter(
        { key: 'cpu', label: 'CPU', type: FieldType.NUMBER },
        Operator.GREATER_THAN,
        4
      );

      plain.operator = Operator.CONTAINS;
      expect([plain.operator, plain.value]).toEqual([Operator.CONTAINS, 4]);
      plain.operator = Operator.IN;
      expect([plain.operator, plain.value, plain.error]).toEqual([Operator.IN, undefined, Code.REQUIRED]);
      expect(() => (plain.operator = 'toString' as Operator)).toThrowError(/does not allow/);
    });

    it('emits nothing for the current operator', () => {
      filter.operator = Operator.GREATER_THAN;
      expect(changes).toEqual([]);
    });

    it('never changes the id', () => {
      const id = filter.id;
      filter.operator = Operator.BETWEEN;
      filter.value = [1, 8];
      expect(filter.id).toBe(id);
    });
  });

  describe('value setter', () => {
    let filter: ClrAdvancedFilter;
    let changes: ClrAdvancedFilterChange[];

    beforeEach(() => {
      filter = new ClrAdvancedFilter(CPU, Operator.GREATER_THAN, 4);
      changes = listen(filter);
    });

    it('changes the value, with one emission', () => {
      filter.value = 8;
      expect(filter.value).toBe(8);
      expect(changes.length).toBe(1);
      expect(changes[0].node).toBe(filter);
    });

    it('throws for a value that does not suit the operator, and changes nothing', () => {
      [undefined, null, '', '4', NaN, true, [1, 5]].forEach(value =>
        expect(() => (filter.value = value as ClrAdvancedFilterValue))
          .withContext(JSON.stringify(value) ?? 'undefined')
          .toThrowError(/not a complete filter/)
      );
      expect(filter.value).toBe(4);
      expect(changes).toEqual([]);
    });

    it('accepts only undefined for IS_EMPTY', () => {
      const empty = new ClrAdvancedFilter(CPU, Operator.IS_EMPTY);
      const emptyChanges = listen(empty);

      empty.value = undefined;
      expect(() => (empty.value = 4)).toThrowError(/not a complete filter/);
      expect(emptyChanges).toEqual([]);
    });

    it('keeps an incomplete filter as it is when it throws', () => {
      filter.operator = Operator.BETWEEN;
      expect(() => (filter.value = 4)).toThrowError(/not a complete filter/);
      expect([filter.value, filter.error]).toEqual([undefined, Code.REQUIRED]);
    });

    it('emits nothing when the value does not change, comparing arrays item by item', () => {
      const set = new ClrAdvancedFilter(STATUS, Operator.IN, ['pending', 1]);
      const setChanges = listen(set);

      filter.value = 4;
      set.value = ['pending', 1];

      expect(changes).toEqual([]);
      expect(setChanges).toEqual([]);
    });

    it('compares single values with Object.is', () => {
      const zero = new ClrAdvancedFilter(CPU, Operator.EQUALS, 0);
      const zeroChanges = listen(zero);
      zero.value = -0;
      expect(Object.is(zero.value, -0)).toBeTrue();
      expect(zeroChanges.length).toBe(1);
    });

    it('compares array values by length and by Object.is per item', () => {
      const set = new ClrAdvancedFilter(STATUS, Operator.IN, ['pending', 1]);
      const setChanges = listen(set);

      set.value = ['pending'];
      expect(set.value).toEqual(['pending']);
      set.value = [0];
      set.value = [-0];
      expect(Object.is((set.value as readonly number[])[0], -0)).toBeTrue();
      expect(setChanges.length).toBe(3);
    });

    it('copies and freezes a new array value', () => {
      const range = new ClrAdvancedFilter(CPU, Operator.BETWEEN, [1, 2]);
      const value = [1, 5];
      range.value = value;
      value[1] = 9;
      expect(range.value).toEqual([1, 5]);
      expect(Object.isFrozen(range.value)).toBeTrue();
    });
  });

  describe('set()', () => {
    let filter: ClrAdvancedFilter;
    let changes: ClrAdvancedFilterChange[];

    beforeEach(() => {
      filter = new ClrAdvancedFilter(CPU, Operator.GREATER_THAN, 4);
      changes = listen(filter);
    });

    it('switches to another kind of value in one step, with one emission', () => {
      filter.set(Operator.BETWEEN, [1, 8]);
      expect([filter.operator, filter.value, filter.error]).toEqual([Operator.BETWEEN, [1, 8], null]);
      expect(changes.length).toBe(1);
      expect(changes[0].node).toBe(filter);
    });

    it('switches to IS_EMPTY without a value', () => {
      filter.set(Operator.IS_EMPTY);
      expect([filter.operator, filter.value]).toEqual([Operator.IS_EMPTY, undefined]);
    });

    it('completes an incomplete filter', () => {
      filter.operator = Operator.BETWEEN;
      filter.set(Operator.EQUALS, 2);
      expect([filter.operator, filter.value, filter.error]).toEqual([Operator.EQUALS, 2, null]);
    });

    it('throws for an operator or a value that does not suit, and changes nothing', () => {
      expect(() => filter.set(Operator.BETWEEN)).toThrowError(/not a complete filter/);
      expect(() => filter.set(Operator.BETWEEN, [8, 2])).toThrowError(/invalidRange/);
      expect(() => filter.set(Operator.CONTAINS, 'a')).toThrowError(/unsupportedOperator/);
      expect(() => filter.set(Operator.IS_EMPTY, 4)).toThrowError(/not a complete filter/);
      expect([filter.operator, filter.value]).toEqual([Operator.GREATER_THAN, 4]);
      expect(changes).toEqual([]);
    });

    it('emits nothing when nothing changes', () => {
      filter.set(Operator.GREATER_THAN, 4);
      expect(changes).toEqual([]);
    });

    it('copies and freezes an array value', () => {
      const value = [1, 5];
      filter.set(Operator.BETWEEN, value);
      value[1] = 9;
      expect(filter.value).toEqual([1, 5]);
      expect(Object.isFrozen(filter.value)).toBeTrue();
    });
  });

  describe('toJSON()', () => {
    it('returns the public state as plain data, with the key of the field', () => {
      const filter = new ClrAdvancedFilter(CPU, Operator.BETWEEN, [2, 8]);
      expect(JSON.parse(JSON.stringify(filter))).toEqual({
        id: filter.id,
        field: 'cpu',
        operator: 'between',
        value: [2, 8],
      });
    });

    it('leaves out a missing value, also of an incomplete filter', () => {
      const empty = new ClrAdvancedFilter(CPU, Operator.IS_EMPTY);
      expect(JSON.parse(JSON.stringify(empty))).toEqual({ id: empty.id, field: 'cpu', operator: 'isEmpty' });

      const incomplete = new ClrAdvancedFilter(CPU, Operator.GREATER_THAN, 4);
      incomplete.operator = Operator.BETWEEN;
      expect(JSON.parse(JSON.stringify(incomplete))).toEqual({ id: incomplete.id, field: 'cpu', operator: 'between' });
    });
  });

  describe('validation exceptions', () => {
    it('carry the code of the validator', () => {
      const filter = new ClrAdvancedFilter(CPU, Operator.GREATER_THAN, 4);

      expect(codeOf(() => create(CPU, Operator.EQUALS, '60'))).toBe(Code.INVALID_NUMBER);
      expect(codeOf(() => create(CPU, Operator.BETWEEN, [8, 2]))).toBe(Code.INVALID_RANGE);
      expect(codeOf(() => create(CPU, Operator.CONTAINS, 'a'))).toBe(Code.UNSUPPORTED_OPERATOR);
      expect(codeOf(() => create(CPU, Operator.EQUALS))).toBe(Code.REQUIRED);
      expect(codeOf(() => (filter.operator = Operator.CONTAINS))).toBe(Code.UNSUPPORTED_OPERATOR);
      expect(codeOf(() => (filter.value = NaN))).toBe(Code.INVALID_NUMBER);
      expect(codeOf(() => filter.set(Operator.BETWEEN, [8, 2]))).toBe(Code.INVALID_RANGE);
      expect(codeOf(() => create(STATUS, Operator.IN, ['pending', 'pending']))).toBe(Code.DUPLICATE_VALUE);
      expect(codeOf(() => (new ClrAdvancedFilter(STATUS, Operator.IN, ['pending']).value = [1, 1]))).toBe(
        Code.DUPLICATE_VALUE
      );
    });

    it('are errors with a readable message and name', () => {
      try {
        create(CPU, Operator.EQUALS, '60');
        fail('expected an exception');
      } catch (error) {
        expect(error).toEqual(jasmine.any(Error));
        expect(error.name).toBe('ClrAdvancedFilterValidationException');
        expect(error.message).toBe("ClrAdvancedFilter: 'cpu' equals is not a complete filter (invalidNumber).");
      }
    });

    it('are not used for a missing field definition', () => {
      expect(codeOf(() => create(null, Operator.EQUALS, 'a'))).toBe('another error');
    });
  });
});

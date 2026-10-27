/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { commonStringsDefault } from '@clr/angular/utils';

import { ClrAdvancedFilterValidator } from './advanced-filter-validator';
import { ClrBooleanFilterValidator } from './boolean-filter-validator';
import { ClrDateFilterValidator } from './date-filter-validator';
import { ClrEnumFilterValidator } from './enum-filter-validator';
import { ClrNumberFilterValidator } from './number-filter-validator';
import { ClrStringFilterValidator } from './string-filter-validator';
import { ClrAdvancedFilterFieldType as FieldType } from '../enums/advanced-filter-field-type.enum';
import { AdvancedFilterOperatorArity as Arity } from '../enums/advanced-filter-operator-arity.enum';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError as Code } from '../enums/advanced-filter-validation-error.enum';
import { ClrAdvancedFilterCondition } from '../interfaces/advanced-filter-condition.interface';

function condition(field: unknown, operator: unknown, value?: unknown): ClrAdvancedFilterCondition {
  return { field, operator, value } as unknown as ClrAdvancedFilterCondition;
}

/**
 * Types and operators can come from runtime data, including strings that are Object.prototype keys.
 */
const UNKNOWN_STRINGS = ['unknown', 'notIn', 'constructor', 'toString', 'valueOf', 'hasOwnProperty', '__proto__'];

const BUILT_IN: Readonly<Record<FieldType, ClrAdvancedFilterValidator>> = {
  [FieldType.STRING]: new ClrStringFilterValidator(),
  [FieldType.NUMBER]: new ClrNumberFilterValidator(),
  [FieldType.BOOLEAN]: new ClrBooleanFilterValidator(),
  [FieldType.DATE]: new ClrDateFilterValidator(),
  [FieldType.ENUM]: new ClrEnumFilterValidator(),
};

/**
 * A validator for any field type, also one that does not exist, with the protected arity lookup made readable.
 */
class TypedValidator extends ClrAdvancedFilterValidator {
  protected override readonly fieldType: FieldType;

  constructor(type: unknown) {
    super();
    this.fieldType = type as FieldType;
  }

  arityOf(operator: unknown): Arity | undefined {
    return this.getOperatorArity(operator as Operator);
  }
}

function labelsOf(type: FieldType): string[] {
  const validator = BUILT_IN[type];
  return validator.getOperators().map(operator => commonStringsDefault[validator.getOperatorLabelKey(operator)]);
}

describe('ClrAdvancedFilterValidator', () => {
  const validator = new ClrAdvancedFilterValidator();
  const shape = (operator: unknown, value?: unknown) => validator.validate(condition('any', operator, value));

  describe('field key', () => {
    it('requires a non-empty string', () => {
      ['', undefined, null, 42, {}].forEach(key =>
        expect(validator.validate(condition(key, Operator.CONTAINS, 'a')))
          .withContext(JSON.stringify(key) ?? 'undefined')
          .toBe(Code.REQUIRED)
      );
      expect(validator.validate({ operator: Operator.CONTAINS, value: 'a' } as ClrAdvancedFilterCondition)).toBe(
        Code.REQUIRED
      );
    });

    it('accepts any other string, also one that matches no definition', () => {
      expect(validator.validate(condition('gone', Operator.CONTAINS, 'a'))).toBeNull();
      expect(validator.validate(condition('  ', Operator.CONTAINS, 'a'))).toBeNull();
    });

    it('checks the field key before the operator', () => {
      expect(validator.validate(condition('', 'notIn', 'a'))).toBe(Code.REQUIRED);
    });

    it('requires a condition', () => {
      expect(validator.validate(null)).toBe(Code.REQUIRED);
      expect(validator.validate(undefined)).toBe(Code.REQUIRED);
    });
  });

  describe('operator', () => {
    it('rejects unknown operators, including Object.prototype keys and the removed IP operator', () => {
      ['notIn', 'inSubnet', 'toString', 'constructor', '__proto__', undefined, null].forEach(operator =>
        expect(shape(operator, 'a')).withContext(String(operator)).toBe(Code.UNSUPPORTED_OPERATOR)
      );
    });

    it('accepts every built-in operator, whatever the field type', () => {
      expect(shape(Operator.CONTAINS, 'a')).toBeNull();
      expect(shape(Operator.LESS_THAN, 5)).toBeNull();
      expect(shape(Operator.BEFORE, 5)).toBeNull();
    });
  });

  describe('value', () => {
    it('accepts IS_EMPTY only without a value', () => {
      expect(shape(Operator.IS_EMPTY)).toBeNull();
      [null, '', 'x', 0, false, [1, 2]].forEach(value =>
        expect(shape(Operator.IS_EMPTY, value)).withContext(JSON.stringify(value)).toBe(Code.REQUIRED)
      );
    });

    it('requires a non-blank string, a finite number or a boolean as a single value', () => {
      expect(shape(Operator.EQUALS, 'a')).toBeNull();
      expect(shape(Operator.EQUALS, 0)).toBeNull();
      expect(shape(Operator.EQUALS, -1.5)).toBeNull();
      expect(shape(Operator.EQUALS, true)).toBeNull();
      expect(shape(Operator.EQUALS, false)).toBeNull();
      [undefined, null, '', '  ', NaN, Infinity, {}, [], ['a']].forEach(value =>
        expect(shape(Operator.EQUALS, value))
          .withContext(JSON.stringify(value) ?? 'undefined')
          .toBe(Code.REQUIRED)
      );
    });

    it('requires two single values as a range, without checking their order', () => {
      expect(shape(Operator.BETWEEN, [1, 2])).toBeNull();
      expect(shape(Operator.BETWEEN, [2, 1])).toBeNull();
      expect(shape(Operator.BETWEEN, ['a', 'b'])).toBeNull();
      [5, [1], [1, 2, 3], ['', 1], [1, NaN], [, 1], [null, 1], [true, false]].forEach(value =>
        expect(shape(Operator.BETWEEN, value))
          .withContext(JSON.stringify(value) ?? 'undefined')
          .toBe(Code.REQUIRED)
      );
    });

    it('rejects a set that lists a value twice, comparing the values as they are', () => {
      expect(shape(Operator.IN, ['a', 'a'])).toBe(Code.DUPLICATE_VALUE);
      expect(shape(Operator.IN, [1, 'a', 1])).toBe(Code.DUPLICATE_VALUE);
      expect(shape(Operator.IN, ['', ''])).toBe(Code.DUPLICATE_VALUE);
      expect(shape(Operator.IN, [1, '1'])).toBeNull();
      expect(shape(Operator.IN, ['a', 'A', 'a '])).toBeNull();
    });

    it('checks the kind of every value before duplicates', () => {
      expect(shape(Operator.IN, ['a', 'a', null])).toBe(Code.REQUIRED);
    });

    it('accepts blank strings in a set, as the user picks a set rather than typing it', () => {
      expect(shape(Operator.IN, ['a', ''])).toBeNull();
      expect(shape(Operator.IN, ['  '])).toBeNull();
    });

    it('requires a non-empty array of strings or finite numbers as a set', () => {
      expect(shape(Operator.IN, ['a', 1])).toBeNull();
      [undefined, 'a', [], [NaN], [Infinity], [, 'a'], new Array(3), [{}], [null]].forEach(value =>
        expect(shape(Operator.IN, value))
          .withContext(JSON.stringify(value) ?? 'undefined')
          .toBe(Code.REQUIRED)
      );
    });
  });

  describe('getOperators()', () => {
    it('offers the string operators in display order', () => {
      expect(BUILT_IN[FieldType.STRING].getOperators()).toEqual([
        Operator.CONTAINS,
        Operator.NOT_CONTAINS,
        Operator.EQUALS,
        Operator.NOT_EQUALS,
        Operator.STARTS_WITH,
        Operator.ENDS_WITH,
        Operator.IS_EMPTY,
      ]);
      expect(labelsOf(FieldType.STRING)).toEqual([
        'Contains',
        'Does not contain',
        'Equals',
        'Does not equal',
        'Starts with',
        'Ends with',
        'Is empty',
      ]);
    });

    it('offers the numeric operators in display order', () => {
      expect(BUILT_IN[FieldType.NUMBER].getOperators()).toEqual([
        Operator.EQUALS,
        Operator.NOT_EQUALS,
        Operator.LESS_THAN,
        Operator.LESS_THAN_OR_EQUAL,
        Operator.GREATER_THAN,
        Operator.GREATER_THAN_OR_EQUAL,
        Operator.BETWEEN,
        Operator.IS_EMPTY,
      ]);
      expect(labelsOf(FieldType.NUMBER)).toEqual([
        'Equal to',
        'Does not equal to',
        'Less than',
        'Less than or equal to',
        'Greater than',
        'Greater than or equal to',
        'Between',
        'Is empty',
      ]);
    });

    it('offers the boolean operators', () => {
      expect(BUILT_IN[FieldType.BOOLEAN].getOperators()).toEqual([Operator.EQUALS]);
      expect(labelsOf(FieldType.BOOLEAN)).toEqual(['Equals']);
    });

    it('offers the date operators in display order', () => {
      expect(BUILT_IN[FieldType.DATE].getOperators()).toEqual([
        Operator.EQUALS,
        Operator.NOT_EQUALS,
        Operator.BEFORE,
        Operator.BEFORE_OR_EQUAL,
        Operator.AFTER,
        Operator.AFTER_OR_EQUAL,
        Operator.BETWEEN,
        Operator.IS_EMPTY,
      ]);
      expect(labelsOf(FieldType.DATE)).toEqual([
        'On date',
        'Does not equal',
        'Before',
        'Before or equal to',
        'After',
        'After or equal to',
        'Between dates',
        'Is empty',
      ]);
    });

    it('offers only "is in set" for static enums', () => {
      expect(BUILT_IN[FieldType.ENUM].getOperators()).toEqual([Operator.IN]);
      expect(labelsOf(FieldType.ENUM)).toEqual(['Is in set']);
    });

    it('offers every known operator without a field type', () => {
      expect(validator.getOperators()).toEqual(Object.values(Operator));
    });

    it('offers operators for every field type', () => {
      Object.values(FieldType).forEach(type =>
        expect(new TypedValidator(type).getOperators().length).withContext(type).toBeGreaterThan(0)
      );
    });

    it('returns a new array every time', () => {
      BUILT_IN[FieldType.STRING].getOperators().pop();
      validator.getOperators().pop();
      expect(BUILT_IN[FieldType.STRING].getOperators().length).toBe(7);
      expect(validator.getOperators().length).toBe(Object.values(Operator).length);
    });

    it('returns no operators for an unknown type', () => {
      UNKNOWN_STRINGS.forEach(type => expect(new TypedValidator(type).getOperators()).withContext(type).toEqual([]));
    });
  });

  describe('supported operators', () => {
    it('accepts only operators of the field type', () => {
      expect(BUILT_IN[FieldType.STRING].validate(condition('a', Operator.CONTAINS, 'a'))).toBeNull();
      expect(BUILT_IN[FieldType.NUMBER].validate(condition('a', Operator.CONTAINS, 'a'))).toBe(
        Code.UNSUPPORTED_OPERATOR
      );
      expect(BUILT_IN[FieldType.ENUM].validate(condition('a', Operator.EQUALS, 'a'))).toBe(Code.UNSUPPORTED_OPERATOR);
      expect(BUILT_IN[FieldType.BOOLEAN].validate(condition('a', Operator.IS_EMPTY))).toBe(Code.UNSUPPORTED_OPERATOR);
    });

    it('accepts no operator for an unknown type', () => {
      UNKNOWN_STRINGS.forEach(type =>
        expect(new TypedValidator(type).validate(condition('a', Operator.CONTAINS, 'a')))
          .withContext(type)
          .toBe(Code.UNSUPPORTED_OPERATOR)
      );
    });
  });

  describe('getOperatorLabelKey()', () => {
    it('labels the same operator differently per type', () => {
      expect(BUILT_IN[FieldType.STRING].getOperatorLabelKey(Operator.EQUALS)).toBe('advancedFilterEquals');
      expect(BUILT_IN[FieldType.NUMBER].getOperatorLabelKey(Operator.EQUALS)).toBe('advancedFilterEqualTo');
      expect(BUILT_IN[FieldType.DATE].getOperatorLabelKey(Operator.EQUALS)).toBe('advancedFilterOnDate');
      expect(BUILT_IN[FieldType.NUMBER].getOperatorLabelKey(Operator.BETWEEN)).toBe('advancedFilterBetween');
      expect(BUILT_IN[FieldType.DATE].getOperatorLabelKey(Operator.BETWEEN)).toBe('advancedFilterBetweenDates');
    });

    it('returns undefined for an unsupported operator, and without a field type', () => {
      expect(BUILT_IN[FieldType.BOOLEAN].getOperatorLabelKey(Operator.CONTAINS)).toBeUndefined();
      expect(validator.getOperatorLabelKey(Operator.CONTAINS)).toBeUndefined();
    });

    it('returns undefined for unknown types and operators', () => {
      UNKNOWN_STRINGS.forEach(value => {
        expect(new TypedValidator(value).getOperatorLabelKey(Operator.CONTAINS)).withContext(value).toBeUndefined();
        expect(BUILT_IN[FieldType.STRING].getOperatorLabelKey(value as Operator))
          .withContext(value)
          .toBeUndefined();
      });
    });
  });

  describe('getOperatorArity()', () => {
    const probe = new TypedValidator(undefined);

    it('knows which operators take no value, a range or a set', () => {
      expect(probe.arityOf(Operator.IS_EMPTY)).toBe(Arity.NONE);
      expect(probe.arityOf(Operator.BETWEEN)).toBe(Arity.RANGE);
      expect(probe.arityOf(Operator.IN)).toBe(Arity.SET);
    });

    it('treats every other operator as a single value', () => {
      const multi = [Operator.IS_EMPTY, Operator.BETWEEN, Operator.IN];
      Object.values(Operator)
        .filter(operator => !multi.includes(operator))
        .forEach(operator => expect(probe.arityOf(operator)).withContext(operator).toBe(Arity.SINGLE));
    });

    it('returns undefined for unknown operators', () => {
      UNKNOWN_STRINGS.forEach(operator => expect(probe.arityOf(operator)).withContext(operator).toBeUndefined());
    });
  });

  describe('runtime values that are not strings', () => {
    // An array such as ['string'] would resolve to a table entry if keys were coerced to strings.
    const NON_STRINGS = [['string'], ['in'], 42, null, {}];

    it('never resolves them to a table entry', () => {
      NON_STRINGS.forEach(value => {
        const context = JSON.stringify(value);
        const typed = new TypedValidator(value);
        expect(typed.getOperators()).withContext(context).toEqual([]);
        expect(typed.getOperatorLabelKey(Operator.CONTAINS)).withContext(context).toBeUndefined();
        expect(typed.validate(condition('a', Operator.CONTAINS, 'a')))
          .withContext(context)
          .toBe(Code.UNSUPPORTED_OPERATOR);
        expect(BUILT_IN[FieldType.ENUM].getOperatorLabelKey(value as unknown as Operator))
          .withContext(context)
          .toBeUndefined();
        expect(typed.arityOf(value)).withContext(context).toBeUndefined();
      });
    });
  });

  describe('every built-in validator', () => {
    const SAMPLES: unknown[] = [
      undefined,
      null,
      '',
      '  ',
      'abc',
      0,
      42,
      -1.5,
      NaN,
      Infinity,
      new Date(2026, 9, 21).getTime(),
      '2026-10-21',
      '2026-02-30',
      ['2026-10-01', '2026-10-21'],
      ['2026-10-21', '2026-10-01'],
      true,
      {},
      [],
      [1],
      [1, 2],
      [2, 1],
      ['a', 'b'],
      ['a', 1, 2],
      [NaN],
    ];

    it('accepts only what the base validator accepts too', () => {
      let checked = 0;
      Object.values(FieldType).forEach(type => {
        const typed = BUILT_IN[type];
        typed.getOperators().forEach(operator =>
          SAMPLES.forEach(value => {
            const sample = condition(type, operator, value);
            if (typed.validate(sample) === null) {
              checked++;
              expect(validator.validate(sample))
                .withContext(`${type} ${operator} ${JSON.stringify(value)}`)
                .toBeNull();
            }
          })
        );
      });
      expect(checked).toBeGreaterThan(40);
    });
  });
});

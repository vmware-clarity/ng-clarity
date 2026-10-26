/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCommonStrings } from '@clr/angular/utils';

import { ClrAdvancedFilterFieldType } from '../enums/advanced-filter-field-type.enum';
import { AdvancedFilterOperatorArity } from '../enums/advanced-filter-operator-arity.enum';
import { ClrAdvancedFilterOperator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError } from '../enums/advanced-filter-validation-error.enum';
import { ClrAdvancedFilterCondition } from '../interfaces/advanced-filter-condition.interface';
import { AdvancedFilterOperatorDefinition } from '../interfaces/advanced-filter-operator-definition.interface';

/**
 * Operators offered per field type, in display order.
 * The same operator can have a different label depending on the type ("Equals" vs. "Equal to" vs. "On date").
 */
const OPERATORS_BY_TYPE: Readonly<Record<ClrAdvancedFilterFieldType, readonly AdvancedFilterOperatorDefinition[]>> = {
  [ClrAdvancedFilterFieldType.STRING]: [
    {
      operator: ClrAdvancedFilterOperator.CONTAINS,
      labelKey: 'advancedFilterContains',
      textKey: 'advancedFilterTextContains',
    },
    {
      operator: ClrAdvancedFilterOperator.NOT_CONTAINS,
      labelKey: 'advancedFilterNotContains',
      textKey: 'advancedFilterTextNotContains',
    },
    {
      operator: ClrAdvancedFilterOperator.EQUALS,
      labelKey: 'advancedFilterEquals',
      textKey: 'advancedFilterTextEquals',
    },
    {
      operator: ClrAdvancedFilterOperator.NOT_EQUALS,
      labelKey: 'advancedFilterNotEquals',
      textKey: 'advancedFilterTextNotEquals',
    },
    {
      operator: ClrAdvancedFilterOperator.STARTS_WITH,
      labelKey: 'advancedFilterStartsWith',
      textKey: 'advancedFilterTextStartsWith',
    },
    {
      operator: ClrAdvancedFilterOperator.ENDS_WITH,
      labelKey: 'advancedFilterEndsWith',
      textKey: 'advancedFilterTextEndsWith',
    },
    {
      operator: ClrAdvancedFilterOperator.IS_EMPTY,
      labelKey: 'advancedFilterIsEmpty',
      textKey: 'advancedFilterTextIsEmpty',
    },
  ],
  [ClrAdvancedFilterFieldType.NUMBER]: [
    {
      operator: ClrAdvancedFilterOperator.EQUALS,
      labelKey: 'advancedFilterEqualTo',
      textKey: 'advancedFilterTextEqualTo',
    },
    {
      operator: ClrAdvancedFilterOperator.NOT_EQUALS,
      labelKey: 'advancedFilterNotEqualTo',
      textKey: 'advancedFilterTextNotEqualTo',
    },
    {
      operator: ClrAdvancedFilterOperator.LESS_THAN,
      labelKey: 'advancedFilterLessThan',
      textKey: 'advancedFilterTextLessThan',
    },
    {
      operator: ClrAdvancedFilterOperator.LESS_THAN_OR_EQUAL,
      labelKey: 'advancedFilterLessThanOrEqual',
      textKey: 'advancedFilterTextLessThanOrEqual',
    },
    {
      operator: ClrAdvancedFilterOperator.GREATER_THAN,
      labelKey: 'advancedFilterGreaterThan',
      textKey: 'advancedFilterTextGreaterThan',
    },
    {
      operator: ClrAdvancedFilterOperator.GREATER_THAN_OR_EQUAL,
      labelKey: 'advancedFilterGreaterThanOrEqual',
      textKey: 'advancedFilterTextGreaterThanOrEqual',
    },
    {
      operator: ClrAdvancedFilterOperator.BETWEEN,
      labelKey: 'advancedFilterBetween',
      textKey: 'advancedFilterTextBetween',
    },
    {
      operator: ClrAdvancedFilterOperator.IS_EMPTY,
      labelKey: 'advancedFilterIsEmpty',
      textKey: 'advancedFilterTextIsEmpty',
    },
  ],
  [ClrAdvancedFilterFieldType.BOOLEAN]: [
    // The value is true or false; the UI labels the values with advancedFilterTrue and advancedFilterFalse.
    {
      operator: ClrAdvancedFilterOperator.EQUALS,
      labelKey: 'advancedFilterEquals',
      textKey: 'advancedFilterTextBoolean',
    },
  ],
  [ClrAdvancedFilterFieldType.DATE]: [
    {
      operator: ClrAdvancedFilterOperator.EQUALS,
      labelKey: 'advancedFilterOnDate',
      textKey: 'advancedFilterTextOnDate',
    },
    {
      operator: ClrAdvancedFilterOperator.NOT_EQUALS,
      labelKey: 'advancedFilterNotEquals',
      textKey: 'advancedFilterTextNotOnDate',
    },
    {
      operator: ClrAdvancedFilterOperator.BEFORE,
      labelKey: 'advancedFilterBefore',
      textKey: 'advancedFilterTextBefore',
    },
    {
      operator: ClrAdvancedFilterOperator.BEFORE_OR_EQUAL,
      labelKey: 'advancedFilterBeforeOrEqual',
      textKey: 'advancedFilterTextBeforeOrEqual',
    },
    { operator: ClrAdvancedFilterOperator.AFTER, labelKey: 'advancedFilterAfter', textKey: 'advancedFilterTextAfter' },
    {
      operator: ClrAdvancedFilterOperator.AFTER_OR_EQUAL,
      labelKey: 'advancedFilterAfterOrEqual',
      textKey: 'advancedFilterTextAfterOrEqual',
    },
    {
      operator: ClrAdvancedFilterOperator.BETWEEN,
      labelKey: 'advancedFilterBetweenDates',
      textKey: 'advancedFilterTextBetween',
    },
    {
      operator: ClrAdvancedFilterOperator.IS_EMPTY,
      labelKey: 'advancedFilterIsEmpty',
      textKey: 'advancedFilterTextIsEmpty',
    },
  ],
  [ClrAdvancedFilterFieldType.ENUM]: [
    { operator: ClrAdvancedFilterOperator.IN, labelKey: 'advancedFilterInSet', textKey: 'advancedFilterTextIn' },
  ],
};

const OPERATOR_ARITY: Readonly<Record<ClrAdvancedFilterOperator, AdvancedFilterOperatorArity>> = {
  [ClrAdvancedFilterOperator.CONTAINS]: AdvancedFilterOperatorArity.SINGLE,
  [ClrAdvancedFilterOperator.NOT_CONTAINS]: AdvancedFilterOperatorArity.SINGLE,
  [ClrAdvancedFilterOperator.EQUALS]: AdvancedFilterOperatorArity.SINGLE,
  [ClrAdvancedFilterOperator.NOT_EQUALS]: AdvancedFilterOperatorArity.SINGLE,
  [ClrAdvancedFilterOperator.STARTS_WITH]: AdvancedFilterOperatorArity.SINGLE,
  [ClrAdvancedFilterOperator.ENDS_WITH]: AdvancedFilterOperatorArity.SINGLE,
  [ClrAdvancedFilterOperator.IS_EMPTY]: AdvancedFilterOperatorArity.NONE,
  [ClrAdvancedFilterOperator.LESS_THAN]: AdvancedFilterOperatorArity.SINGLE,
  [ClrAdvancedFilterOperator.LESS_THAN_OR_EQUAL]: AdvancedFilterOperatorArity.SINGLE,
  [ClrAdvancedFilterOperator.GREATER_THAN]: AdvancedFilterOperatorArity.SINGLE,
  [ClrAdvancedFilterOperator.GREATER_THAN_OR_EQUAL]: AdvancedFilterOperatorArity.SINGLE,
  [ClrAdvancedFilterOperator.BETWEEN]: AdvancedFilterOperatorArity.RANGE,
  [ClrAdvancedFilterOperator.BEFORE]: AdvancedFilterOperatorArity.SINGLE,
  [ClrAdvancedFilterOperator.BEFORE_OR_EQUAL]: AdvancedFilterOperatorArity.SINGLE,
  [ClrAdvancedFilterOperator.AFTER]: AdvancedFilterOperatorArity.SINGLE,
  [ClrAdvancedFilterOperator.AFTER_OR_EQUAL]: AdvancedFilterOperatorArity.SINGLE,
  [ClrAdvancedFilterOperator.IN]: AdvancedFilterOperatorArity.SET,
};

/**
 * Checks that a condition is complete and well-formed. It never decides what a condition means.
 *
 * This base class checks the shape of a condition, whatever its field's type: a non-empty field key, a known operator,
 * and a value of the operator's shape. `ClrAdvancedFilter` checks its operator and value with its field's validator.
 *
 * Each field type has a subclass that adds the rules of the type (`ClrStringFilterValidator`,
 * `ClrNumberFilterValidator`, `ClrBooleanFilterValidator`, `ClrDateFilterValidator`, `ClrEnumFilterValidator`). A
 * condition that is valid for a type is also valid for this base class. Field definitions can bring their own
 * validator (`ClrAdvancedFilterField.validator`).
 */
export class ClrAdvancedFilterValidator {
  /**
   * The field type whose operators this validator accepts, or `undefined` for every known operator.
   */
  protected readonly fieldType: ClrAdvancedFilterFieldType | undefined;

  /**
   * The operators this validator accepts, in display order: those of `fieldType`, or every known operator without
   * one. A new array on every call. The UI offers them in the operator select.
   */
  getOperators(): ClrAdvancedFilterOperator[] {
    if (this.fieldType === undefined) {
      return Object.values(ClrAdvancedFilterOperator);
    }
    return this.getDefinitions().map(definition => definition.operator);
  }

  /**
   * Key of the operator's label in `ClrCommonStrings`. The same operator can have another label per type: Equals,
   * Equal to, On date. `undefined` without `fieldType`, or when the type does not offer the operator.
   */
  getOperatorLabelKey(operator: ClrAdvancedFilterOperator): keyof ClrCommonStrings | undefined {
    return this.findDefinition(operator)?.labelKey;
  }

  /**
   * Key of the filter's text in `ClrCommonStrings`, with the tokens {FIELD} and {VALUE}, for example
   * '{FIELD} is greater than {VALUE}'. `undefined` without `fieldType`, or when the type does not offer the operator.
   */
  getOperatorTextKey(operator: ClrAdvancedFilterOperator): keyof ClrCommonStrings | undefined {
    return this.findDefinition(operator)?.textKey;
  }

  /**
   * Checks the field key, then the operator, then the value.
   * @returns The first problem found, or `null`.
   */
  validate(condition: ClrAdvancedFilterCondition): ClrAdvancedFilterValidationError | null {
    if (!condition || typeof condition.field !== 'string' || condition.field === '') {
      return ClrAdvancedFilterValidationError.REQUIRED;
    }
    const { operator, value } = condition;
    const arity = this.getOperatorArity(operator);
    if (arity === undefined || !this.supportsOperator(operator)) {
      return ClrAdvancedFilterValidationError.UNSUPPORTED_OPERATOR;
    }
    switch (arity) {
      case AdvancedFilterOperatorArity.NONE:
        // No value means `undefined`: `null`, '' and anything else are a value, which this operator does not take.
        return value === undefined ? null : ClrAdvancedFilterValidationError.REQUIRED;
      case AdvancedFilterOperatorArity.SET:
        return this.validateSet(value);
      case AdvancedFilterOperatorArity.RANGE:
        return this.validateRange(value);
      default:
        return this.validateSingle(operator, value);
    }
  }

  /**
   * Whether the field type offers the operator. Only called for known operators.
   */
  protected supportsOperator(operator: ClrAdvancedFilterOperator): boolean {
    return this.fieldType === undefined || !!this.findDefinition(operator);
  }

  /**
   * The kind of value the operator takes, or `undefined` for anything that is not a `ClrAdvancedFilterOperator`, so it
   * also tells whether an operator is known.
   */
  protected getOperatorArity(operator: ClrAdvancedFilterOperator): AdvancedFilterOperatorArity | undefined {
    return this.hasOwn(OPERATOR_ARITY, operator) ? OPERATOR_ARITY[operator] : undefined;
  }

  /**
   * A single value: here a non-blank string, a finite number or a boolean.
   */
  protected validateSingle(
    _operator: ClrAdvancedFilterOperator,
    value: unknown
  ): ClrAdvancedFilterValidationError | null {
    return this.isSingleValue(value) || typeof value === 'boolean' ? null : ClrAdvancedFilterValidationError.REQUIRED;
  }

  /**
   * `[from, to]`: here two non-blank strings or finite numbers, in any order.
   */
  protected validateRange(value: unknown): ClrAdvancedFilterValidationError | null {
    return this.isRange(value) && this.isSingleValue(value[0]) && this.isSingleValue(value[1])
      ? null
      : ClrAdvancedFilterValidationError.REQUIRED;
  }

  /**
   * A non-empty array of strings or finite numbers, each listed once. Blank strings are allowed: a set is picked by
   * the user, not typed. The values are not checked against the field's options.
   */
  protected validateSet(value: unknown): ClrAdvancedFilterValidationError | null {
    if (!Array.isArray(value) || value.length === 0) {
      return ClrAdvancedFilterValidationError.REQUIRED;
    }
    // An index loop, because `every` would skip the holes of a sparse array.
    for (let i = 0; i < value.length; i++) {
      if (typeof value[i] !== 'string' && !this.isFiniteNumber(value[i])) {
        return ClrAdvancedFilterValidationError.REQUIRED;
      }
    }
    return new Set(value).size === value.length ? null : ClrAdvancedFilterValidationError.DUPLICATE_VALUE;
  }

  // Shared rules for the subclasses.

  /**
   * `undefined`, `null`, or a string with only whitespace.
   */
  protected isMissing(value: unknown): boolean {
    return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
  }

  protected isFiniteNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value);
  }

  /**
   * A non-blank string or a finite number.
   */
  protected isSingleValue(value: unknown): boolean {
    return (typeof value === 'string' && !this.isMissing(value)) || this.isFiniteNumber(value);
  }

  /**
   * An array of exactly two items, both present (see `isMissing`).
   */
  protected isRange(value: unknown): value is readonly [unknown, unknown] {
    return Array.isArray(value) && value.length === 2 && !this.isMissing(value[0]) && !this.isMissing(value[1]);
  }

  // Types and operators can come from runtime data, so the tables are only read through their own keys: a value such
  // as 'toString' or ['string'] never resolves to a table entry.

  private getDefinitions(): readonly AdvancedFilterOperatorDefinition[] {
    return this.hasOwn(OPERATORS_BY_TYPE, this.fieldType) ? OPERATORS_BY_TYPE[this.fieldType] : [];
  }

  private findDefinition(operator: ClrAdvancedFilterOperator): AdvancedFilterOperatorDefinition | undefined {
    return this.getDefinitions().find(definition => definition.operator === operator);
  }

  private hasOwn(target: object, key: unknown): key is string {
    return typeof key === 'string' && Object.prototype.hasOwnProperty.call(target, key);
  }
}

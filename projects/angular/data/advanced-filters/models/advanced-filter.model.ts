/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAdvancedFilterNode } from './advanced-filter-node.model';
import { ClrAdvancedFilterOperator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError } from '../enums/advanced-filter-validation-error.enum';
import { ClrAdvancedFilterValue } from '../interfaces/advanced-filter-condition.interface';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { ClrAdvancedFilterValidationException } from '../validators/advanced-filter-validation-exception';
import { ClrAdvancedFilterValidator } from '../validators/advanced-filter-validator';

/**
 * A single condition: field + operator + value. The component only builds filters; what they mean is up to the
 * consumer.
 *
 * The field definition comes first: it decides which operators are allowed, and the operator decides which values are.
 * Both are checked by the field's validator. A field without one only gets the shape checked, by the base
 * `ClrAdvancedFilterValidator`: no rules of its type.
 * - The constructor only builds complete filters. The field never changes after that.
 * - The `operator` setter accepts any operator the field allows. It keeps the value when the value suits the new
 *   operator, and otherwise clears it silently, so the filter can become incomplete (see `error`).
 * - The `value` setter and `set()` only accept a value that suits the operator, so they always leave the filter
 *   complete.
 *
 * Read the state through the getters: spreading an instance (`{ ...filter }`) does not give a condition.
 */
export class ClrAdvancedFilter extends ClrAdvancedFilterNode {
  private readonly _field: ClrAdvancedFilterField;
  private readonly _validator: ClrAdvancedFilterValidator;
  private _operator: ClrAdvancedFilterOperator;
  private _value: ClrAdvancedFilterValue | undefined;

  /**
   * @param field Kept by reference, not copied. Its validator is read once, here: replacing `field.validator` later
   *   does not affect the filter.
   * @param value Copied: later changes to an array value do not affect the filter. A value given to IS_EMPTY throws.
   * @throws An `Error` when there is no field definition, or a `ClrAdvancedFilterValidationException` when the filter
   *   would not be complete.
   */
  constructor(field: ClrAdvancedFilterField, operator: ClrAdvancedFilterOperator, value?: ClrAdvancedFilterValue) {
    super();
    if (!field || typeof field !== 'object') {
      throw new Error('ClrAdvancedFilter: a field definition is required.');
    }
    this._field = field;
    this._validator = field.validator ?? new ClrAdvancedFilterValidator();
    const snapshot = this.snapshot(value);
    this.assertComplete(operator, snapshot);
    this._operator = operator;
    this._value = snapshot;
  }

  get field(): ClrAdvancedFilterField {
    return this._field;
  }

  get operator(): ClrAdvancedFilterOperator {
    return this._operator;
  }

  /**
   * Accepts any operator the field allows, and emits when the operator changes. The value is kept when it suits the
   * new operator, and cleared otherwise (switching to IS_EMPTY, or to another kind of value). To switch to another
   * kind of value in one step, use `set()`.
   * @throws `ClrAdvancedFilterValidationException` with UNSUPPORTED_OPERATOR when the field does not allow the operator.
   *   Nothing changes then.
   */
  set operator(operator: ClrAdvancedFilterOperator) {
    if (operator === this._operator) {
      return;
    }
    const error = this.validate(operator, this._value);
    if (error === ClrAdvancedFilterValidationError.UNSUPPORTED_OPERATOR) {
      throw new ClrAdvancedFilterValidationException(
        `ClrAdvancedFilter: field '${this._field.key}' does not allow the '${operator}' operator.`,
        error
      );
    }
    this._operator = operator;
    if (error) {
      this._value = undefined;
    }
    this.emitChange(this);
  }

  /**
   * See `ClrAdvancedFilterValue` for the shape. `undefined` for IS_EMPTY and after the `operator` setter cleared it.
   * Arrays are frozen.
   */
  get value(): ClrAdvancedFilterValue | undefined {
    return this._value;
  }

  /**
   * Copies an array value. Emits when the value changes; arrays are compared item by item.
   * @throws `ClrAdvancedFilterValidationException` when the value does not suit the operator. Nothing changes then.
   */
  set value(value: ClrAdvancedFilterValue | undefined) {
    const snapshot = this.snapshot(value);
    this.assertComplete(this._operator, snapshot);
    if (this.sameValue(snapshot, this._value)) {
      return;
    }
    this._value = snapshot;
    this.emitChange(this);
  }

  /**
   * Why the filter is incomplete, or `null` when it is complete. Only the `operator` setter can make it incomplete;
   * a valid value completes it again.
   */
  get error(): ClrAdvancedFilterValidationError | null {
    return this.validate(this._operator, this._value);
  }

  /**
   * Changes the operator and the value in one step, with one emission, for example to switch from GREATER_THAN to
   * BETWEEN. Emits nothing when nothing changes.
   * @throws `ClrAdvancedFilterValidationException` when the field does not allow the operator, or the value does not
   *   suit it. Nothing changes then.
   */
  set(operator: ClrAdvancedFilterOperator, value?: ClrAdvancedFilterValue): void {
    const snapshot = this.snapshot(value);
    this.assertComplete(operator, snapshot);
    if (operator === this._operator && this.sameValue(snapshot, this._value)) {
      return;
    }
    this._operator = operator;
    this._value = snapshot;
    this.emitChange(this);
  }

  toJSON(): { id: string; field: string; operator: ClrAdvancedFilterOperator; value?: ClrAdvancedFilterValue } {
    return { id: this.id, field: this._field.key, operator: this._operator, value: this._value };
  }

  /**
   * The value to check and store: an array is copied by index and frozen, so what is checked is exactly what is
   * stored.
   */
  private snapshot(value: ClrAdvancedFilterValue | undefined): ClrAdvancedFilterValue | undefined {
    return Array.isArray(value) ? Object.freeze(Array.prototype.slice.call(value) as (string | number)[]) : value;
  }

  /**
   * Checks an operator and a value with the field's validator, or the base one.
   */
  private validate(
    operator: ClrAdvancedFilterOperator,
    value: ClrAdvancedFilterValue | undefined
  ): ClrAdvancedFilterValidationError | null {
    const condition = { field: this._field.key, operator, value };
    return this._validator.validate(condition);
  }

  /**
   * @throws `ClrAdvancedFilterValidationException` when the operator and the value do not make a complete filter.
   */
  private assertComplete(operator: ClrAdvancedFilterOperator, value: ClrAdvancedFilterValue | undefined): void {
    const error = this.validate(operator, value);
    if (error) {
      throw new ClrAdvancedFilterValidationException(
        `ClrAdvancedFilter: '${this._field.key}' ${operator} is not a complete filter (${error}).`,
        error
      );
    }
  }

  /**
   * Whether two values are the same: `Object.is`, item by item for arrays. Decides whether a change emits.
   */
  private sameValue(a: ClrAdvancedFilterValue | undefined, b: ClrAdvancedFilterValue | undefined): boolean {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.length === b.length && a.every((item, i) => Object.is(item, b[i]));
    }
    return Object.is(a, b);
  }
}

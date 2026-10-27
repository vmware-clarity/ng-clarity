/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TestBed } from '@angular/core/testing';

import { AdvancedFilterText } from './advanced-filter-text';
import { ClrAdvancedFilterFieldType as FieldType } from '../enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterLogic as Logic } from '../enums/advanced-filter-logic.enum';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { ClrBooleanFilterValidator } from '../validators/boolean-filter-validator';
import { ClrDateFilterValidator } from '../validators/date-filter-validator';
import { ClrEnumFilterValidator } from '../validators/enum-filter-validator';
import { ClrNumberFilterValidator } from '../validators/number-filter-validator';
import { ClrStringFilterValidator } from '../validators/string-filter-validator';

const BUDGET: ClrAdvancedFilterField = {
  key: 'budget',
  label: 'Budget',
  type: FieldType.NUMBER,
  validator: new ClrNumberFilterValidator(),
};
const COUNTRY: ClrAdvancedFilterField = {
  key: 'country',
  label: 'Country',
  type: FieldType.STRING,
  validator: new ClrStringFilterValidator(),
};
const ORDERED: ClrAdvancedFilterField = {
  key: 'ordered',
  label: 'Ordered on',
  type: FieldType.DATE,
  validator: new ClrDateFilterValidator(),
};
const ACTIVE: ClrAdvancedFilterField = {
  key: 'active',
  label: 'Active',
  type: FieldType.BOOLEAN,
  validator: new ClrBooleanFilterValidator(),
};
const REGION: ClrAdvancedFilterField = {
  key: 'region',
  label: 'Region',
  type: FieldType.ENUM,
  validator: new ClrEnumFilterValidator(),
  options: [
    { value: 'us-west', label: 'US West' },
    { value: 'eu', label: 'EU Central' },
  ],
};

describe('AdvancedFilterText', () => {
  let text: AdvancedFilterText;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AdvancedFilterText] });
    text = TestBed.inject(AdvancedFilterText);
  });

  it('writes every kind of value', () => {
    expect(text.format(BUDGET, Operator.BETWEEN, [10, 1500])).toBe('Budget: between 10 and 1,500');
    expect(text.format(COUNTRY, Operator.IS_EMPTY, undefined)).toBe('Country: is empty');
    expect(text.format(COUNTRY, Operator.CONTAINS, 'dfsd')).toBe('Country: contains dfsd');
    expect(text.format(ACTIVE, Operator.EQUALS, false)).toBe('Active: False');
    expect(text.format(ACTIVE, Operator.EQUALS, true)).toBe('Active: True');
    expect(text.format(REGION, Operator.IN, ['us-west', 'eu'])).toBe('Region: in US West, EU Central');
    expect(text.format(ORDERED, Operator.BETWEEN, ['2026-10-01', '2026-10-20'])).toBe(
      'Ordered on: between Oct 1, 2026 and Oct 20, 2026'
    );
    expect(text.format(ORDERED, Operator.AFTER, '2026-10-20')).toBe('Ordered on: after Oct 20, 2026');
  });

  it('writes a missing value as a placeholder', () => {
    expect(text.format(BUDGET, Operator.BETWEEN, undefined)).toBe('Budget: between (missing value)');
  });

  it('falls back to the raw operator for a field without a validator', () => {
    expect(text.format({ key: 'ip', label: 'IP', type: 'ip' as FieldType }, Operator.EQUALS, '10.0.0.1')).toBe(
      'IP: equals 10.0.0.1'
    );
  });

  it('keeps an option value that is not among the options', () => {
    expect(text.format(REGION, Operator.IN, ['gone'])).toBe('Region: in gone');
  });

  it('writes a value that is not a number or an ISO date as it is, on number and date fields', () => {
    expect(text.format(BUDGET, Operator.EQUALS, 'abc')).toBe('Budget: equal to abc');
    expect(text.format(ORDERED, Operator.AFTER, 'soon')).toBe('Ordered on: after soon');
    expect(text.format(ORDERED, Operator.AFTER, 1760918400000)).toBe('Ordered on: after 1760918400000');
  });

  describe('the condition of a pill', () => {
    it('writes the operator and the value, without the field', () => {
      expect(text.formatCondition(COUNTRY, Operator.CONTAINS, 'Alice')).toBe('Contains Alice');
      expect(text.formatCondition(BUDGET, Operator.BETWEEN, [10, 60])).toBe('Between 10 and 60');
      expect(text.formatCondition(ORDERED, Operator.AFTER, '2026-10-20')).toBe('After Oct 20, 2026');
    });

    it('writes only the operator for IS_EMPTY', () => {
      expect(text.formatCondition(COUNTRY, Operator.IS_EMPTY, undefined)).toBe('Is empty');
    });

    it('writes only the value for a type with a single operator', () => {
      expect(text.formatCondition(REGION, Operator.IN, ['us-west', 'eu'])).toBe('US West, EU Central');
      expect(text.formatCondition(ACTIVE, Operator.EQUALS, true)).toBe('True');
    });

    it('writes a missing value as a placeholder', () => {
      expect(text.formatCondition(BUDGET, Operator.BETWEEN, undefined)).toBe('Between (missing value)');
    });

    it('falls back to the raw operator for a field without a validator', () => {
      expect(
        text.formatCondition({ key: 'ip', label: 'IP', type: 'ip' as FieldType }, Operator.EQUALS, '10.0.0.1')
      ).toBe('equals 10.0.0.1');
    });
  });

  describe('joining texts', () => {
    it("joins them with the group's logic", () => {
      expect(text.join(['A', 'B', 'C'], Logic.AND)).toBe('A and B and C');
      expect(text.join(['A', 'B'], Logic.OR)).toBe('A or B');
    });

    it('keeps a single text as it is', () => {
      expect(text.join(['A'], Logic.OR)).toBe('A');
    });
  });
});

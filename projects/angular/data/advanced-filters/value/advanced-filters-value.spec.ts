/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClrAdvancedFiltersValue } from './advanced-filters-value';
import { ClrAdvancedFiltersModule } from '../advanced-filters.module';
import { ClrAdvancedFilterFieldType as FieldType } from '../enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError as Code } from '../enums/advanced-filter-validation-error.enum';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';

const BUDGET: ClrAdvancedFilterField = { key: 'budget', label: 'Budget', type: FieldType.NUMBER };
const COUNTRY: ClrAdvancedFilterField = { key: 'country', label: 'Country', type: FieldType.STRING };
const ORDERED: ClrAdvancedFilterField = { key: 'ordered', label: 'Ordered on', type: FieldType.DATE };
const ACTIVE: ClrAdvancedFilterField = { key: 'active', label: 'Active', type: FieldType.BOOLEAN };
const REGION: ClrAdvancedFilterField = {
  key: 'region',
  label: 'Region',
  type: FieldType.ENUM,
  options: [
    { value: 'us-east', label: 'US East' },
    { value: 'us-west', label: 'US West' },
    { value: 'eu', label: 'EU Central' },
  ],
};

describe('ClrAdvancedFiltersValue', () => {
  let value: ClrAdvancedFiltersValue;
  let emitted: unknown[];

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ClrAdvancedFiltersModule, NoopAnimationsModule] });
    value = TestBed.createComponent(ClrAdvancedFiltersValue).componentInstance;
    emitted = [];
    value.valueChange.subscribe(change => emitted.push(change));
  });

  it('picks the editor by field type and operator', () => {
    const editorOf = (field: ClrAdvancedFilterField, operator: Operator) => {
      value.field = field;
      value.operator = operator;
      return value.editor;
    };
    expect(editorOf(COUNTRY, Operator.CONTAINS)).toBe(value.editors.TEXT);
    expect(editorOf(COUNTRY, Operator.IS_EMPTY)).toBe(value.editors.NONE);
    expect(editorOf(BUDGET, Operator.EQUALS)).toBe(value.editors.NUMBER);
    expect(editorOf(BUDGET, Operator.BETWEEN)).toBe(value.editors.NUMBER_RANGE);
    expect(editorOf(ACTIVE, Operator.EQUALS)).toBe(value.editors.BOOLEAN);
    expect(editorOf(ORDERED, Operator.AFTER)).toBe(value.editors.DATE);
    expect(editorOf(ORDERED, Operator.BETWEEN)).toBe(value.editors.DATE_RANGE);
    expect(editorOf(REGION, Operator.IN)).toBe(value.editors.SET);
  });

  it('writes the message of the validation code, and none without a code', () => {
    expect(value.errorMessage).toBe('');
    value.error = Code.INVALID_RANGE;
    expect(value.errorMessage).toBe('The start must not be after the end');
  });

  it('shows its labels, or keeps them for screen readers only when inline', () => {
    const fixture = TestBed.createComponent(ClrAdvancedFiltersValue);
    fixture.componentInstance.field = COUNTRY;
    fixture.componentInstance.operator = Operator.CONTAINS;
    fixture.detectChanges();
    const label = () => (fixture.nativeElement as HTMLElement).querySelector('label');
    expect(label().classList).not.toContain('clr-sr-only');

    fixture.componentInstance.inline = true;
    fixture.detectChanges();
    expect(label().classList).toContain('clr-sr-only');
    expect(label().textContent.trim()).toBe('Value');
    fixture.destroy();
  });

  it('emits no value for an empty input', () => {
    value.change('');
    value.change(null);
    expect(emitted).toEqual([undefined, undefined]);
  });

  describe('ranges', () => {
    it('keeps both bounds of a range', () => {
      value.value = [1, 9];
      value.ngOnChanges();
      value.changeBound(1, 5);
      value.changeBound(0, null);
      expect(emitted).toEqual([
        [1, 5],
        [undefined, 5],
      ]);
    });

    it('keeps both bounds when the start and the end arrive before the value comes back', () => {
      value.field = ORDERED;
      value.operator = Operator.BETWEEN;
      value.ngOnChanges();
      value.changeRangeText(0, '10/21/2026');
      value.changeRangeText(1, '10/28/2026');
      expect(emitted.pop()).toEqual(['2026-10-21', '2026-10-28']);
    });
  });

  // The tests run with the en-US locale, so the date inputs show MM/DD/YYYY.
  describe('dates', () => {
    it('emits a typed or picked day as an ISO date', () => {
      value.changeDateText('10/20/2026');
      value.value = ['2026-10-01', '2026-10-02'];
      value.ngOnChanges();
      value.changeRangeText(1, '10/21/2026');
      expect(emitted).toEqual(['2026-10-20', ['2026-10-01', '2026-10-21']]);
    });

    it('emits no value for text that is no date yet, or a cleared date', () => {
      value.value = ['2026-10-01', '2026-10-09'];
      value.ngOnChanges();
      value.changeDateText('10/2');
      value.changeRangeText(0, '');
      expect(emitted).toEqual([undefined, [undefined, '2026-10-09']]);
    });

    it("shows the value in the locale's format, and nothing for what is not an ISO date", () => {
      value.value = '2026-10-20';
      value.ngOnChanges();
      expect(value.dateText).toBe('10/20/2026');

      value.value = ['2026-10-01', 'x'];
      value.ngOnChanges();
      expect([value.dateText, value.rangeText]).toEqual(['', ['10/01/2026', '']]);
    });

    it('keeps the text being typed when its own value comes back, and shows a value set from outside', () => {
      value.changeDateText('10/2');
      value.value = emitted.pop() as undefined;
      value.ngOnChanges();
      expect(value.dateText).toBe('10/2');

      value.value = '2026-11-05';
      value.ngOnChanges();
      expect(value.dateText).toBe('11/05/2026');
    });
  });

  describe('sets', () => {
    it('keeps the picked options in the order of the options, and no value when none is picked', () => {
      value.field = REGION;
      value.value = ['eu'];
      value.toggle(REGION.options[0], true);
      expect(emitted.pop()).toEqual(['us-east', 'eu']);

      value.value = ['eu'];
      value.toggle(REGION.options[2], false);
      expect(emitted.pop()).toBeUndefined();
    });

    it('emits no value for an enum field without options', () => {
      value.field = { key: 'empty', label: 'Empty', type: FieldType.ENUM };
      value.toggle({ value: 'x', label: 'X' }, true);
      expect(emitted.pop()).toBeUndefined();
    });
  });
});

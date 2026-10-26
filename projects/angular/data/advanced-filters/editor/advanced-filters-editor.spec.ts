/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClrAdvancedFiltersEditor } from './advanced-filters-editor';
import { ClrAdvancedFiltersModule } from '../advanced-filters.module';
import { ClrAdvancedFilterFieldType as FieldType } from '../enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError as Code } from '../enums/advanced-filter-validation-error.enum';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { ClrAdvancedFilter } from '../models/advanced-filter.model';
import { ClrBooleanFilterValidator } from '../validators/boolean-filter-validator';
import { ClrEnumFilterValidator } from '../validators/enum-filter-validator';
import { ClrNumberFilterValidator } from '../validators/number-filter-validator';

const BUDGET: ClrAdvancedFilterField = {
  key: 'budget',
  label: 'Budget',
  type: FieldType.NUMBER,
  validator: new ClrNumberFilterValidator(),
};
const REGION: ClrAdvancedFilterField = {
  key: 'region',
  label: 'Region',
  type: FieldType.ENUM,
  validator: new ClrEnumFilterValidator(),
  options: [{ value: 'eu', label: 'EU Central' }],
};
const ACTIVE: ClrAdvancedFilterField = {
  key: 'active',
  label: 'Active',
  type: FieldType.BOOLEAN,
  validator: new ClrBooleanFilterValidator(),
};

describe('ClrAdvancedFiltersEditor', () => {
  let fixture: ComponentFixture<ClrAdvancedFiltersEditor>;
  let editor: ClrAdvancedFiltersEditor;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ClrAdvancedFiltersModule, NoopAnimationsModule] });
    fixture = TestBed.createComponent(ClrAdvancedFiltersEditor);
    editor = fixture.componentInstance;
    editor.fields = [BUDGET, REGION, ACTIVE];
  });

  afterEach(() => fixture.destroy());

  describe('a new condition', () => {
    it('cannot be applied before a field is picked', () => {
      fixture.detectChanges();
      expect([editor.field, editor.operator, editor.operators]).toEqual([null, null, []]);
      expect(editor.error).toBe(Code.REQUIRED);
      const apply = spyOn(editor.apply, 'emit');
      editor.submit();
      expect(apply).not.toHaveBeenCalled();
    });

    it("starts a picked field with its first operator and no value, and checks it with the field's validator", () => {
      fixture.detectChanges();
      editor.selectField(BUDGET);
      expect([editor.operator, editor.value, editor.error]).toEqual([Operator.EQUALS, undefined, Code.REQUIRED]);

      editor.value = 'abc';
      expect(editor.error).toBe(Code.INVALID_NUMBER);
      editor.value = 5;
      expect(editor.error).toBeNull();
    });

    it('keeps everything when the picked field is picked again', () => {
      editor.selectField(BUDGET);
      editor.selectOperator(Operator.LESS_THAN);
      editor.value = 5;
      editor.selectField(BUDGET);
      expect([editor.operator, editor.value]).toEqual([Operator.LESS_THAN, 5]);
    });

    it('starts over when the field is cleared', () => {
      editor.selectField(BUDGET);
      editor.value = 5;
      editor.selectField(null);
      expect([editor.field, editor.operator, editor.value, editor.error]).toEqual([
        null,
        null,
        undefined,
        Code.REQUIRED,
      ]);
    });

    it('keeps the value on an operator change only when it still fits', () => {
      editor.selectField(BUDGET);
      editor.value = 5;

      editor.selectOperator(Operator.GREATER_THAN);
      expect(editor.value).toBe(5);
      editor.selectOperator(Operator.BETWEEN);
      expect(editor.value).toBeUndefined();
    });

    it('applies a complete condition', () => {
      editor.selectField(BUDGET);
      editor.value = 5;
      const apply = spyOn(editor.apply, 'emit');
      editor.submit();
      expect(apply).toHaveBeenCalledWith({ field: BUDGET, operator: Operator.EQUALS, value: 5 });
    });
  });

  describe('editing a filter', () => {
    it('starts from the filter, using the definition among its fields', () => {
      editor.filter = new ClrAdvancedFilter(
        { key: 'budget', label: 'Old', type: FieldType.NUMBER },
        Operator.LESS_THAN,
        3
      );
      fixture.detectChanges();
      expect([editor.field, editor.operator, editor.value]).toEqual([BUDGET, Operator.LESS_THAN, 3]);
    });

    it("uses the filter's own definition when its key is not among the fields", () => {
      const gone: ClrAdvancedFilterField = { key: 'gone', label: 'Gone', type: FieldType.NUMBER };
      editor.filter = new ClrAdvancedFilter(gone, Operator.LESS_THAN, 3);
      fixture.detectChanges();
      expect(editor.field).toBe(gone);
    });
  });

  describe('operators', () => {
    it('hides the operator select for a type with a single operator', () => {
      editor.selectField(REGION);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('select[clrSelect]'))).toBeNull();

      editor.selectField(BUDGET);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('select[clrSelect]'))).not.toBeNull();
    });

    it('labels the operators per type', () => {
      editor.selectField(BUDGET);
      expect(editor.operatorLabel(Operator.EQUALS)).toBe('Equal to');
    });

    it('shows the operator itself for a field without a validator, which has no labels', () => {
      editor.selectField({ key: 'plain', label: 'Plain', type: FieldType.NUMBER });
      expect(editor.operatorLabel(Operator.EQUALS)).toBe(Operator.EQUALS);
    });
  });

  it('emits cancel from the Cancel button', () => {
    fixture.detectChanges();
    const cancel = spyOn(editor.cancel, 'emit');
    fixture.debugElement.query(By.css('.clr-advanced-filters-editor-actions .btn-outline')).nativeElement.click();
    expect(cancel).toHaveBeenCalled();
  });
});

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrInputModule, ClrSelectModule } from '@clr/angular/forms';
import { ClrIcon } from '@clr/angular/icon';
import { renderFixture } from '@clr/angular/utils/testing';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { FilterFormComponent } from './filter-form.component';
import { GeneralFilterComponent } from './general-filter.component';
import { ComparisonOperator, LogicalOperator, Unit } from '../model/datagrid-filters.enums';
import {
  NumericPropertyDefinition,
  PropertyFilter,
  PropertyPredicate,
  StringPropertyDefinition,
} from '../model/datagrid-filters.interfaces';

const property = 'vmName';
const propertyDisplayName = 'Name';
const comparisonOperators = [ComparisonOperator.Equals, ComparisonOperator.Contains, ComparisonOperator.IsEmpty];
const stringProperty: StringPropertyDefinition = new StringPropertyDefinition(
  property,
  propertyDisplayName,
  comparisonOperators
);
const predicate1 = new PropertyPredicate();
predicate1.filterableProperty = stringProperty;
predicate1.operator = ComparisonOperator.Equals;
predicate1.value = 'vm 1';

const predicate2 = new PropertyPredicate();
predicate2.filterableProperty = stringProperty;
predicate2.operator = ComparisonOperator.IsEmpty;

const propertyFilter1: PropertyFilter = new PropertyFilter();
propertyFilter1.criteria = [predicate1];
propertyFilter1.operator = LogicalOperator.And;

const propertyFilter2: PropertyFilter = new PropertyFilter();
propertyFilter2.criteria = [predicate1, predicate2];
propertyFilter2.operator = LogicalOperator.Or;

const numericPropertyName = 'hostMemory';
const numericPropertyDisplayName = 'Host Mem';
const numericOperators = [
  ComparisonOperator.Equals,
  ComparisonOperator.DoesNotEqual,
  ComparisonOperator.GreaterThan,
  ComparisonOperator.GreaterThanOrEqualTo,
  ComparisonOperator.LessThan,
  ComparisonOperator.LessThanOrEqualTo,
  ComparisonOperator.IsEmpty,
];
const numericProperty: NumericPropertyDefinition = new NumericPropertyDefinition(
  numericPropertyName,
  numericPropertyDisplayName,
  numericOperators,
  Unit.MB
);

const numericPredicate1 = new PropertyPredicate();
numericPredicate1.filterableProperty = numericProperty;
numericPredicate1.operator = ComparisonOperator.GreaterThan;
numericPredicate1.value = '500';

const numericPropertyFilter1: PropertyFilter = new PropertyFilter();
numericPropertyFilter1.criteria = [numericPredicate1];
numericPropertyFilter1.operator = LogicalOperator.And;

const numericPredicate2 = new PropertyPredicate();
numericPredicate2.filterableProperty = numericProperty;
numericPredicate2.operator = ComparisonOperator.LessThanOrEqualTo;
numericPredicate2.value = '900';

const numericPropertyFilter2: PropertyFilter = new PropertyFilter();
numericPropertyFilter2.criteria = [numericPredicate1, numericPredicate2];
numericPropertyFilter2.operator = LogicalOperator.Or;

const isInitializedExpectation = 'is properly initialized';
const primaryOperatorSelector = 'select[formControlName=operator]';
const primaryValueSelector = 'input[formControlName=value]';
const primaryUnitSelector = 'select[formControlName=unit]';
const submitBtnSelector = 'button[data-test-id=submitBtn]';
const addButtonSelector = 'button[data-test-id=add-button]';

export interface ThisTest {
  fixture: ComponentFixture<GeneralFilterComponent>;
  component: GeneralFilterComponent;
}

describe('GeneralFilterComponent', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrInputModule, ClrSelectModule, CommonModule, FormsModule, ReactiveFormsModule, ClrIcon],
      declarations: [FilterFormComponent, GeneralFilterComponent],
      providers: [DatagridFiltersStrings],
    });
    testContext.fixture = TestBed.createComponent(GeneralFilterComponent);
    testContext.component = testContext.fixture.componentInstance;
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });
  describe('in normal mode with string property', () => {
    beforeEach(() => {
      testContext.component.filterProperty = stringProperty;
      renderFixture(testContext.fixture);
    });
    it(isInitializedExpectation, () => {
      expect(testContext.component).toBeTruthy();
      expect(testContext.component.comparisonOperators).toEqual(comparisonOperators);

      expect(testContext.component.conditions.at(0).controls.operator.value).toEqual(ComparisonOperator.Contains);
      expect(testContext.component.conditions.at(0).controls.value.value).toEqual('');
      expect(testContext.component.generalFilterForm.controls['logicalOperator'].value).toEqual(LogicalOperator.And);
    });
    it('emits an empty event on cancel', () => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      const cancelButton = testContext.fixture.debugElement.nativeElement.querySelector(
        'button[data-test-id=cancelBtn]'
      );
      expect(cancelButton).toBeTruthy();

      cancelButton.click();
      renderFixture(testContext.fixture);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith();
    });
    it('emits a property filter event on submit', () => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      const submitButton: HTMLButtonElement =
        testContext.fixture.debugElement.nativeElement.querySelector(submitBtnSelector);
      expect(submitButton).toBeTruthy();
      expect(submitButton.disabled).toBeTruthy();
      expect(testContext.component.generalFilterForm.valid).toBeFalsy();

      const primaryOperatorSelect: HTMLSelectElement =
        testContext.fixture.debugElement.nativeElement.querySelector(primaryOperatorSelector);
      expect(primaryOperatorSelect).toBeTruthy();
      expect(primaryOperatorSelect.options.length).toEqual(3);

      primaryOperatorSelect.value = primaryOperatorSelect.options[0].value;
      primaryOperatorSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      expect(testContext.component.conditions.at(0).controls.operator.value).toEqual(ComparisonOperator.Equals);

      const primaryValueInput: HTMLInputElement =
        testContext.fixture.debugElement.nativeElement.querySelector(primaryValueSelector);
      primaryValueInput.value = 'vm 1';
      primaryValueInput.dispatchEvent(new Event('input'));
      renderFixture(testContext.fixture);
      expect(testContext.component.conditions.at(0).controls.value.value).toEqual('vm 1');
      expect(submitButton.disabled).toBeFalsy();
      expect(testContext.component.generalFilterForm.valid).toBeTruthy();

      submitButton.click();
      renderFixture(testContext.fixture);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(propertyFilter1);
    });
    it('updates comparison operators on property change ', () => {
      const testProperty = 'vmIpAddress';
      const testPropertyDisplayName = 'Ip Address';
      const testComparisonOperators = [ComparisonOperator.Contains, ComparisonOperator.IsEmpty];
      const testStringProperty: StringPropertyDefinition = new StringPropertyDefinition(
        testProperty,
        testPropertyDisplayName,
        testComparisonOperators
      );

      expect(testContext.component.comparisonOperators).toEqual(comparisonOperators);
      testContext.component.filterProperty = testStringProperty;
      testContext.component.ngOnChanges();
      expect(testContext.component.comparisonOperators).toEqual(testComparisonOperators);
    });

    it('applies the logic selected in the segmented buttons', () => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      const logicInputs: NodeListOf<HTMLInputElement> =
        testContext.fixture.nativeElement.querySelectorAll('.filter-logic input');
      expect(logicInputs.length).toBe(2);
      expect(logicInputs[0].checked).toBe(true);

      logicInputs[1].click();
      testContext.fixture.nativeElement.querySelector(addButtonSelector).click();
      renderFixture(testContext.fixture);
      expect(logicInputs[1].checked).toBe(true);
      expect(
        testContext.fixture.nativeElement.querySelector('[data-test-id=logical-operator]').textContent.trim()
      ).toBe('Or');

      testContext.component.conditions.patchValue([{ value: 'vm' }, { value: 'host' }]);
      renderFixture(testContext.fixture);
      testContext.fixture.nativeElement.querySelector(submitBtnSelector).click();
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(
        expect.objectContaining({ operator: LogicalOperator.Or, criteria: expect.any(Array) })
      );
      expect(testContext.component.generalFilterForm.value.logicalOperator).toBe(LogicalOperator.Or);
    });

    it('disables AND for an empty primary condition and restores it for a value condition', () => {
      const andInput: HTMLInputElement = testContext.fixture.nativeElement.querySelector('.filter-logic input');
      testContext.component.conditions.at(0).controls.operator.setValue(ComparisonOperator.IsEmpty);
      renderFixture(testContext.fixture);
      expect(andInput.disabled).toBe(true);
      // The input is hidden, so the visible button carries the disabled state; Or stays enabled.
      const [andButton, orButton] = testContext.fixture.nativeElement.querySelectorAll('.filter-logic .radio.btn');
      expect(andButton.classList).toContain('disabled');
      expect(orButton.classList).not.toContain('disabled');
      expect(testContext.component.generalFilterForm.value.logicalOperator).toBe(LogicalOperator.Or);

      andInput.click();
      expect(testContext.component.generalFilterForm.value.logicalOperator).toBe(LogicalOperator.Or);

      testContext.component.conditions.at(0).controls.operator.setValue(ComparisonOperator.Equals);
      renderFixture(testContext.fixture);
      expect(andInput.disabled).toBe(false);
      expect(andButton.classList).not.toContain('disabled');
      andInput.click();
      expect(testContext.component.generalFilterForm.value.logicalOperator).toBe(LogicalOperator.And);
    });

    it('restores AND after removing an empty secondary condition', () => {
      testContext.fixture.nativeElement.querySelector(addButtonSelector).click();
      renderFixture(testContext.fixture);
      testContext.component.conditions.at(1).controls.operator.setValue(ComparisonOperator.IsEmpty);
      renderFixture(testContext.fixture);
      const andInput: HTMLInputElement = testContext.fixture.nativeElement.querySelector('.filter-logic input');
      expect(andInput.disabled).toBe(true);

      testContext.fixture.nativeElement.querySelectorAll('[data-test-id=close-button]')[1].click();
      renderFixture(testContext.fixture);
      expect(andInput.disabled).toBe(false);
      andInput.click();
      expect(testContext.component.generalFilterForm.value.logicalOperator).toBe(LogicalOperator.And);
      expect(testContext.fixture.nativeElement.querySelector('[data-test-id=logical-operator]')).toBeNull();
    });
  });
  describe('with restricted comparison operators', () => {
    it('does not apply a value when no comparison operators are available', () => {
      testContext.component.filterProperty = new StringPropertyDefinition('Name', 'name', []);
      const emitted = vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      renderFixture(testContext.fixture);
      testContext.component.conditions.at(0).controls.value.setValue('vm');
      renderFixture(testContext.fixture);
      expect(testContext.component.conditions.at(0).controls.operator.hasError('required')).toBe(true);
      expect(testContext.component.generalFilterForm.valid).toBe(false);
      const submit: HTMLButtonElement = testContext.fixture.nativeElement.querySelector(submitBtnSelector);
      expect(submit.disabled).toBe(true);
      submit.click();
      testContext.component.onApplyButtonClick();
      expect(emitted).not.toHaveBeenCalled();
    });

    it('uses the only supported operator for both initial and added conditions', () => {
      testContext.component.filterProperty = new StringPropertyDefinition('Name', 'name', [
        ComparisonOperator.StartsWith,
      ]);
      const emitted = vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      renderFixture(testContext.fixture);
      testContext.component.addCondition();
      testContext.component.conditions.patchValue([{ value: 'vm' }, { value: 'host' }]);
      renderFixture(testContext.fixture);
      expect(testContext.component.conditions.value.map(condition => condition.operator)).toEqual([
        ComparisonOperator.StartsWith,
        ComparisonOperator.StartsWith,
      ]);
      testContext.fixture.nativeElement.querySelector(submitBtnSelector).click();
      expect(emitted.mock.lastCall![0].criteria.map(predicate => predicate.operator)).toEqual([
        ComparisonOperator.StartsWith,
        ComparisonOperator.StartsWith,
      ]);
    });
  });

  describe('with multiple conditions', () => {
    for (const logic of [LogicalOperator.And, LogicalOperator.Or]) {
      it(`applies and reopens four conditions with ${LogicalOperator[logic]}`, () => {
        testContext.component.filterProperty = new StringPropertyDefinition('Name', 'name');
        renderFixture(testContext.fixture);
        const emitted = vi
          .spyOn(testContext.component.filterCriteriaChange, 'emit')
          .mockImplementation(() => undefined);
        for (let index = 0; index < 3; index++) {
          testContext.fixture.nativeElement.querySelector(addButtonSelector).click();
          renderFixture(testContext.fixture);
        }
        testContext.component.generalFilterForm.patchValue({
          logicalOperator: logic,
          conditions: [
            { operator: ComparisonOperator.Contains, value: 'vm' },
            { operator: ComparisonOperator.DoesNotContain, value: 'test' },
            { operator: ComparisonOperator.StartsWith, value: 'prod' },
            { operator: ComparisonOperator.EndsWith, value: '01' },
          ],
        });
        renderFixture(testContext.fixture);
        expect(testContext.fixture.nativeElement.querySelectorAll('.filter-condition-row').length).toBe(4);
        expect(testContext.fixture.nativeElement.querySelectorAll('[data-test-id=logical-operator]').length).toBe(3);
        expect(testContext.fixture.nativeElement.querySelector(addButtonSelector)).not.toBeNull();
        testContext.fixture.nativeElement.querySelector(submitBtnSelector).click();

        const filter = emitted.mock.lastCall![0];
        expect(filter.operator).toBe(logic);
        expect(filter.criteria.map(predicate => predicate.value)).toEqual(['vm', 'test', 'prod', '01']);
        expect(filter.criteria.map(predicate => predicate.operator)).toEqual([
          ComparisonOperator.Contains,
          ComparisonOperator.DoesNotContain,
          ComparisonOperator.StartsWith,
          ComparisonOperator.EndsWith,
        ]);

        const reopened = TestBed.createComponent(GeneralFilterComponent);
        try {
          reopened.componentInstance.filterProperty = testContext.component.filterProperty;
          reopened.componentInstance.propertyFilter = filter;
          renderFixture(reopened);
          expect(reopened.componentInstance.conditions.length).toBe(4);
          expect(reopened.componentInstance.generalFilterForm.value.logicalOperator).toBe(logic);
          expect(reopened.componentInstance.conditions.value.map(condition => condition.value)).toEqual([
            'vm',
            'test',
            'prod',
            '01',
          ]);
          expect(reopened.componentInstance.conditions.value.map(condition => condition.operator)).toEqual(
            filter.criteria.map(predicate => predicate.operator)
          );
        } finally {
          reopened.destroy();
        }
      });
    }

    it('removes middle, first, and last rows while preserving survivors and at least one row', () => {
      testContext.component.filterProperty = new StringPropertyDefinition('Name', 'name');
      renderFixture(testContext.fixture);
      for (let index = 0; index < 3; index++) {
        testContext.component.addCondition();
      }
      testContext.component.conditions.patchValue(['first', 'second', 'third', 'fourth'].map(value => ({ value })));
      const thirdRow = testContext.component.conditions.at(2);
      renderFixture(testContext.fixture);
      testContext.fixture.nativeElement.querySelectorAll('[data-test-id=close-button]')[1].click();
      renderFixture(testContext.fixture);
      expect(testContext.component.conditions.value.map(condition => condition.value)).toEqual([
        'first',
        'third',
        'fourth',
      ]);
      testContext.fixture.nativeElement.querySelectorAll('[data-test-id=close-button]')[0].click();
      renderFixture(testContext.fixture);
      expect(testContext.component.conditions.value.map(condition => condition.value)).toEqual(['third', 'fourth']);
      testContext.fixture.nativeElement.querySelectorAll('[data-test-id=close-button]')[1].click();
      renderFixture(testContext.fixture);
      expect(testContext.component.conditions.value.map(condition => condition.value)).toEqual(['third']);
      expect(testContext.component.conditions.at(0)).toBe(thirdRow);
      expect(testContext.fixture.nativeElement.querySelector('[data-test-id=close-button]').disabled).toBe(true);
      testContext.component.removeCondition(0);
      expect(testContext.component.conditions.length).toBe(1);
    });

    it('validates the third row and restores required validation after Is empty', () => {
      testContext.component.filterProperty = new StringPropertyDefinition('Name', 'name');
      renderFixture(testContext.fixture);
      testContext.component.addCondition();
      testContext.component.addCondition();
      testContext.component.conditions.patchValue([{ value: 'first' }, { value: 'second' }, { value: '' }]);
      renderFixture(testContext.fixture);
      const submit: HTMLButtonElement = testContext.fixture.nativeElement.querySelector(submitBtnSelector);
      expect(submit.disabled).toBe(true);
      const thirdOperator = testContext.component.conditions.at(2).controls.operator;
      thirdOperator.setValue(ComparisonOperator.IsEmpty);
      renderFixture(testContext.fixture);
      expect(submit.disabled).toBe(false);
      expect(testContext.fixture.nativeElement.querySelector('.filter-logic input').disabled).toBe(true);
      expect(testContext.component.generalFilterForm.value.logicalOperator).toBe(LogicalOperator.Or);
      thirdOperator.setValue(ComparisonOperator.Equals);
      renderFixture(testContext.fixture);
      expect(submit.disabled).toBe(true);
      expect(testContext.component.conditions.at(2).controls.value.hasError('required')).toBe(true);
      expect(testContext.fixture.nativeElement.querySelector('.filter-logic input').disabled).toBe(false);
      testContext.component.conditions.at(2).controls.value.setValue('third');
      renderFixture(testContext.fixture);
      expect(submit.disabled).toBe(false);
    });

    it('restores required validation when a preset empty condition becomes a value condition', () => {
      const field = new StringPropertyDefinition('Name', 'name');
      testContext.component.filterProperty = field;
      testContext.component.propertyFilter = {
        operator: LogicalOperator.Or,
        criteria: [
          { filterableProperty: field, operator: ComparisonOperator.Contains, value: 'vm' },
          { filterableProperty: field, operator: ComparisonOperator.Contains, value: 'host' },
          { filterableProperty: field, operator: ComparisonOperator.IsEmpty, value: '' },
        ],
      };
      renderFixture(testContext.fixture);
      expect(testContext.component.generalFilterForm.valid).toBe(true);
      testContext.component.conditions.at(2).controls.operator.setValue(ComparisonOperator.Contains);
      expect(testContext.component.conditions.at(2).controls.value.hasError('required')).toBe(true);
      expect(testContext.component.generalFilterForm.valid).toBe(false);
    });

    it('preserves zero and per-row numeric units through removal, apply, and reopening', () => {
      const field = new NumericPropertyDefinition('Memory', 'memory', undefined, Unit.Byte);
      testContext.component.filterProperty = field;
      renderFixture(testContext.fixture);
      const emitted = vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      for (let index = 0; index < 3; index++) {
        testContext.component.addCondition();
      }
      testContext.component.conditions.patchValue([
        { value: 0, unit: Unit.Byte },
        { value: 1, unit: Unit.KB },
        { value: 2, unit: Unit.MB },
        { value: 3, unit: Unit.GB },
      ]);
      testContext.component.removeCondition(1);
      renderFixture(testContext.fixture);
      testContext.fixture.nativeElement.querySelector(submitBtnSelector).click();
      const filter = emitted.mock.lastCall![0];
      expect(filter.criteria.map(predicate => predicate.value)).toEqual([0, 2 * 1024 ** 2, 3 * 1024 ** 3]);
      expect(filter.editorState).toEqual({ values: [0, 2, 3], units: [Unit.Byte, Unit.MB, Unit.GB] });
      // The shared definition is not written to.
      expect(field['selectedValue']).toBeUndefined();
      expect(field['selectedUnit']).toBeUndefined();
      const reopened = TestBed.createComponent(GeneralFilterComponent);
      try {
        reopened.componentInstance.filterProperty = filter.criteria[0].filterableProperty as NumericPropertyDefinition;
        reopened.componentInstance.propertyFilter = filter;
        renderFixture(reopened);
        expect(reopened.componentInstance.conditions.value.map(condition => condition.value)).toEqual([0, 2, 3]);
        expect(reopened.componentInstance.conditions.value.map(condition => condition.unit)).toEqual([
          Unit.Byte,
          Unit.MB,
          Unit.GB,
        ]);
        reopened.componentInstance.removeCondition(0);
        reopened.componentInstance.removeCondition(1);
        expect(reopened.componentInstance.conditions.at(0).value.value).toBe(2);
        expect(reopened.componentInstance.conditions.at(0).value.unit).toBe(Unit.MB);
      } finally {
        reopened.destroy();
      }
    });

    it('loads numeric presets without display metadata in their base unit, including zero', () => {
      const field = new NumericPropertyDefinition('Memory', 'memory', undefined, Unit.MB);
      const values = [0, 1024, 2048];
      testContext.component.filterProperty = field;
      testContext.component.propertyFilter = {
        operator: LogicalOperator.Or,
        criteria: values.map(value => ({ filterableProperty: field, operator: ComparisonOperator.Equals, value })),
      };
      const emitted = vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      renderFixture(testContext.fixture);
      expect(field['selectedValue']).toBeUndefined();
      expect(field['selectedUnit']).toBeUndefined();
      expect(testContext.component.conditions.value.map(condition => condition.value)).toEqual(values);
      expect(testContext.component.conditions.value.map(condition => condition.unit)).toEqual([
        Unit.MB,
        Unit.MB,
        Unit.MB,
      ]);
      expect(testContext.component.generalFilterForm.valid).toBe(true);
      testContext.fixture.nativeElement.querySelector(submitBtnSelector).click();
      expect(emitted.mock.lastCall![0].criteria.map(predicate => predicate.value)).toEqual(values);
    });

    it('rejects an invalid numeric value in a later row', () => {
      testContext.component.filterProperty = new NumericPropertyDefinition('Memory', 'memory');
      renderFixture(testContext.fixture);
      testContext.component.addCondition();
      testContext.component.addCondition();
      testContext.component.conditions.patchValue([{ value: '10' }, { value: '20' }, { value: 'not a number' }]);
      renderFixture(testContext.fixture);
      expect(testContext.component.conditions.at(2).controls.value.hasError('pattern')).toBe(true);
      expect(testContext.fixture.nativeElement.querySelector(submitBtnSelector).disabled).toBe(true);
      testContext.component.conditions.at(2).controls.value.setValue(0);
      renderFixture(testContext.fixture);
      expect(testContext.component.generalFilterForm.valid).toBe(true);
    });
  });

  describe('in normal mode with numeric property', () => {
    beforeEach(() => {
      numericProperty.unit = Unit.Byte;
      testContext.component.filterProperty = numericProperty;
      renderFixture(testContext.fixture);
    });
    it(isInitializedExpectation, () => {
      expect(testContext.component.comparisonOperators).toEqual(numericOperators);

      expect(testContext.component.conditions.at(0).controls.operator.value).toEqual(ComparisonOperator.Equals);
      expect(testContext.component.conditions.at(0).controls.value.value).toEqual('');
      expect(testContext.component.generalFilterForm.controls['logicalOperator'].value).toEqual(LogicalOperator.And);
    });
    it('correctly updates units on property change', () => {
      const primaryUnitSelect: HTMLSelectElement =
        testContext.fixture.debugElement.nativeElement.querySelector(primaryUnitSelector);
      expect(primaryUnitSelect.options.length).toEqual(5);
      expect(primaryUnitSelect.options[0].text).toEqual('B');
      expect(primaryUnitSelect.options[1].text).toEqual('KB');
      expect(primaryUnitSelect.options[2].text).toEqual('MB');
      expect(primaryUnitSelect.options[3].text).toEqual('GB');
      expect(primaryUnitSelect.options[4].text).toEqual('TB');

      testContext.component.filterProperty.unit = Unit.Byte;
      testContext.component.ngOnChanges();
      expect(testContext.component.units.length).toEqual(5);
      expect(testContext.component.units[0]).toEqual(Unit.Byte);
      expect(testContext.component.units[1]).toEqual(Unit.KB);
      expect(testContext.component.units[2]).toEqual(Unit.MB);
      expect(testContext.component.units[3]).toEqual(Unit.GB);
      expect(testContext.component.units[4]).toEqual(Unit.TB);

      testContext.component.filterProperty.unit = Unit.KB;
      testContext.component.ngOnChanges();
      expect(testContext.component.units.length).toEqual(4);
      expect(testContext.component.units[0]).toEqual(Unit.KB);
      expect(testContext.component.units[1]).toEqual(Unit.MB);
      expect(testContext.component.units[2]).toEqual(Unit.GB);
      expect(testContext.component.units[3]).toEqual(Unit.TB);

      testContext.component.filterProperty.unit = Unit.MB;
      testContext.component.ngOnChanges();
      expect(testContext.component.units.length).toEqual(3);
      expect(testContext.component.units[0]).toEqual(Unit.MB);
      expect(testContext.component.units[1]).toEqual(Unit.GB);
      expect(testContext.component.units[2]).toEqual(Unit.TB);

      testContext.component.filterProperty.unit = Unit.GB;
      testContext.component.ngOnChanges();
      expect(testContext.component.units.length).toEqual(2);
      expect(testContext.component.units[0]).toEqual(Unit.GB);
      expect(testContext.component.units[1]).toEqual(Unit.TB);

      testContext.component.filterProperty.unit = Unit.TB;
      testContext.component.ngOnChanges();
      expect(testContext.component.units.length).toEqual(1);
      expect(testContext.component.units[0]).toEqual(Unit.TB);

      testContext.component.filterProperty.unit = Unit.HZ;
      testContext.component.ngOnChanges();
      expect(testContext.component.units.length).toEqual(4);
      expect(testContext.component.units[0]).toEqual(Unit.HZ);
      expect(testContext.component.units[1]).toEqual(Unit.KHZ);
      expect(testContext.component.units[2]).toEqual(Unit.MHZ);
      expect(testContext.component.units[3]).toEqual(Unit.GHZ);

      testContext.component.filterProperty.unit = Unit.KHZ;
      testContext.component.ngOnChanges();
      expect(testContext.component.units.length).toEqual(3);
      expect(testContext.component.units[0]).toEqual(Unit.KHZ);
      expect(testContext.component.units[1]).toEqual(Unit.MHZ);
      expect(testContext.component.units[2]).toEqual(Unit.GHZ);

      testContext.component.filterProperty.unit = Unit.MHZ;
      testContext.component.ngOnChanges();
      expect(testContext.component.units.length).toEqual(2);
      expect(testContext.component.units[0]).toEqual(Unit.MHZ);
      expect(testContext.component.units[1]).toEqual(Unit.GHZ);

      testContext.component.filterProperty.unit = Unit.GHZ;
      testContext.component.ngOnChanges();
      expect(testContext.component.units.length).toEqual(1);
      expect(testContext.component.units[0]).toEqual(Unit.GHZ);

      testContext.component.filterProperty.unit = Unit.BytePS;
      testContext.component.ngOnChanges();
      expect(testContext.component.units.length).toEqual(4);
      expect(testContext.component.units[0]).toEqual(Unit.BytePS);
      expect(testContext.component.units[1]).toEqual(Unit.KBytePS);
      expect(testContext.component.units[2]).toEqual(Unit.MBytePS);
      expect(testContext.component.units[3]).toEqual(Unit.GBytePS);

      testContext.component.filterProperty.unit = Unit.KBytePS;
      testContext.component.ngOnChanges();
      expect(testContext.component.units.length).toEqual(3);
      expect(testContext.component.units[0]).toEqual(Unit.KBytePS);
      expect(testContext.component.units[1]).toEqual(Unit.MBytePS);
      expect(testContext.component.units[2]).toEqual(Unit.GBytePS);

      testContext.component.filterProperty.unit = Unit.MBytePS;
      testContext.component.ngOnChanges();
      expect(testContext.component.units.length).toEqual(2);
      expect(testContext.component.units[0]).toEqual(Unit.MBytePS);
      expect(testContext.component.units[1]).toEqual(Unit.GBytePS);

      testContext.component.filterProperty.unit = Unit.GBytePS;
      testContext.component.ngOnChanges();
      expect(testContext.component.units.length).toEqual(1);
      expect(testContext.component.units[0]).toEqual(Unit.GBytePS);

      testContext.component.filterProperty.unit = Unit.BitPS;
      testContext.component.ngOnChanges();
      expect(testContext.component.units.length).toEqual(4);
      expect(testContext.component.units[0]).toEqual(Unit.BitPS);
      expect(testContext.component.units[1]).toEqual(Unit.KBitPS);
      expect(testContext.component.units[2]).toEqual(Unit.MBitPS);
      expect(testContext.component.units[3]).toEqual(Unit.GBitPS);

      testContext.component.filterProperty.unit = Unit.KBitPS;
      testContext.component.ngOnChanges();
      expect(testContext.component.units.length).toEqual(3);
      expect(testContext.component.units[0]).toEqual(Unit.KBitPS);
      expect(testContext.component.units[1]).toEqual(Unit.MBitPS);
      expect(testContext.component.units[2]).toEqual(Unit.GBitPS);

      testContext.component.filterProperty.unit = Unit.MBitPS;
      testContext.component.ngOnChanges();
      expect(testContext.component.units.length).toEqual(2);
      expect(testContext.component.units[0]).toEqual(Unit.MBitPS);
      expect(testContext.component.units[1]).toEqual(Unit.GBitPS);

      testContext.component.filterProperty.unit = Unit.GBitPS;
      testContext.component.ngOnChanges();
      expect(testContext.component.units.length).toEqual(1);
      expect(testContext.component.units[0]).toEqual(Unit.GBitPS);
    });
    it('emits a property filter event on submit', () => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      const submitButton: HTMLButtonElement =
        testContext.fixture.debugElement.nativeElement.querySelector(submitBtnSelector);
      expect(submitButton).toBeTruthy();
      expect(submitButton.disabled).toBeTruthy();
      expect(testContext.component.generalFilterForm.valid).toBeFalsy();

      const primaryOperatorSelect: HTMLSelectElement =
        testContext.fixture.debugElement.nativeElement.querySelector(primaryOperatorSelector);
      expect(primaryOperatorSelect).toBeTruthy();
      expect(primaryOperatorSelect.options.length).toEqual(7);

      primaryOperatorSelect.value = primaryOperatorSelect.options[2].value;
      primaryOperatorSelect.dispatchEvent(new Event('change'));
      renderFixture(testContext.fixture);
      expect(testContext.component.conditions.at(0).controls.operator.value).toEqual(ComparisonOperator.GreaterThan);

      const primaryValueInput: HTMLInputElement =
        testContext.fixture.debugElement.nativeElement.querySelector(primaryValueSelector);
      primaryValueInput.value = 'text';
      primaryValueInput.dispatchEvent(new Event('input'));
      renderFixture(testContext.fixture);
      expect(testContext.component.conditions.at(0).controls.value.value).toEqual('text');
      expect(submitButton.disabled).toBeTruthy();
      expect(testContext.component.generalFilterForm.valid).toBeFalsy();

      primaryValueInput.value = '500';
      primaryValueInput.dispatchEvent(new Event('input'));
      renderFixture(testContext.fixture);
      expect(testContext.component.conditions.at(0).controls.value.value).toEqual('500');
      expect(submitButton.disabled).toBeFalsy();
      expect(testContext.component.generalFilterForm.valid).toBeTruthy();

      submitButton.click();
      renderFixture(testContext.fixture);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          criteria: numericPropertyFilter1.criteria,
          operator: numericPropertyFilter1.operator,
        })
      );
    });
    it('converts filter values to the corresponding property unit', () => {
      const emitted = vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      const submitButton: HTMLButtonElement =
        testContext.fixture.debugElement.nativeElement.querySelector(submitBtnSelector);
      const primaryValueInput: HTMLInputElement =
        testContext.fixture.debugElement.nativeElement.querySelector(primaryValueSelector);
      primaryValueInput.value = '100';
      primaryValueInput.dispatchEvent(new Event('input'));
      renderFixture(testContext.fixture);

      testContext.component.filterProperty.unit = Unit.Byte;
      testContext.component.ngOnChanges();
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual('100');

      const primaryUnitSelect: HTMLSelectElement =
        testContext.fixture.debugElement.nativeElement.querySelector(primaryUnitSelector);
      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(102400);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(104857600);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(107374182400);

      primaryUnitSelect.value = primaryUnitSelect.options[4].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(109951162777600);

      testContext.component.filterProperty.unit = Unit.HZ;
      testContext.component.ngOnChanges();
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(100000000);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(100000000000);

      testContext.component.filterProperty.unit = Unit.BytePS;
      testContext.component.ngOnChanges();
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(100000000);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(100000000000);

      testContext.component.filterProperty.unit = Unit.KB;
      testContext.component.ngOnChanges();
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(102400);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(104857600);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(107374182400);

      testContext.component.filterProperty.unit = Unit.MB;
      testContext.component.ngOnChanges();
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(102400);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(104857600);

      testContext.component.filterProperty.unit = Unit.GB;
      testContext.component.ngOnChanges();
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(102400);

      testContext.component.filterProperty.unit = Unit.TB;
      testContext.component.ngOnChanges();
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual('100');

      testContext.component.filterProperty.unit = Unit.KHZ;
      testContext.component.ngOnChanges();
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(100000000);

      testContext.component.filterProperty.unit = Unit.MHZ;
      testContext.component.ngOnChanges();
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(100000);

      testContext.component.filterProperty.unit = Unit.GHZ;
      testContext.component.ngOnChanges();
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual('100');

      testContext.component.filterProperty.unit = Unit.KBytePS;
      testContext.component.ngOnChanges();
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(100000000);

      testContext.component.filterProperty.unit = Unit.MBytePS;
      testContext.component.ngOnChanges();
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(100000);

      testContext.component.filterProperty.unit = Unit.GBytePS;
      testContext.component.ngOnChanges();
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual('100');

      testContext.component.filterProperty.unit = Unit.BitPS;
      testContext.component.ngOnChanges();
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(100000000);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(100000000000);

      testContext.component.filterProperty.unit = Unit.KBitPS;
      testContext.component.ngOnChanges();
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(100000000);

      testContext.component.filterProperty.unit = Unit.MBitPS;
      testContext.component.ngOnChanges();
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual(100000);

      testContext.component.filterProperty.unit = Unit.GBitPS;
      testContext.component.ngOnChanges();
      submitButton.click();
      renderFixture(testContext.fixture);
      expect(emitted.mock.lastCall![0].criteria[0].value).toEqual('100');
    });
  });
  describe('in edit mode with string property', () => {
    beforeEach(() => {
      testContext.component.filterProperty = stringProperty;
      testContext.component.propertyFilter = propertyFilter2;
      renderFixture(testContext.fixture);
    });
    it(isInitializedExpectation, () => {
      expect(testContext.component.conditions.at(0).controls.operator.value).toEqual(ComparisonOperator.Equals);
      expect(testContext.component.conditions.at(0).controls.value.value).toEqual('vm 1');
      expect(testContext.component.generalFilterForm.controls['logicalOperator'].value).toEqual(LogicalOperator.Or);
      expect(testContext.component.conditions.at(1).controls.operator.value).toEqual(ComparisonOperator.IsEmpty);
    });
  });
  describe('in edit mode with numeric property', () => {
    beforeEach(() => {
      numericProperty.unit = Unit.MB;
      testContext.component.filterProperty = numericProperty;
      testContext.component.propertyFilter = {
        ...numericPropertyFilter2,
        editorState: { values: [800, 700], units: [Unit.MB, Unit.KB] },
      };
      renderFixture(testContext.fixture);
    });
    it(isInitializedExpectation, () => {
      expect(testContext.component.conditions.at(0).controls.operator.value).toEqual(ComparisonOperator.GreaterThan);
      expect(testContext.component.conditions.at(0).controls.value.value).toEqual(800);
      expect(testContext.component.conditions.at(0).controls.unit.value).toEqual(Unit.MB);
      expect(testContext.component.generalFilterForm.controls['logicalOperator'].value).toEqual(LogicalOperator.Or);
      expect(testContext.component.conditions.at(1).controls.operator.value).toEqual(
        ComparisonOperator.LessThanOrEqualTo
      );
      expect(testContext.component.conditions.at(1).controls.value.value).toEqual(700);
      expect(testContext.component.conditions.at(1).controls.unit.value).toEqual(Unit.KB);
    });
  });
  describe('with single condition property', () => {
    beforeEach(() => {
      const singleProperty = 'singleConditionProperty';
      const singlePropertyName = 'singleConditionPropertyName';
      const singlePropertyComparisonOperators = [ComparisonOperator.Contains, ComparisonOperator.Equals];
      const singleConditionStringProperty: StringPropertyDefinition = new StringPropertyDefinition(
        singleProperty,
        singlePropertyName,
        singlePropertyComparisonOperators,
        true
      );
      testContext.component.filterProperty = singleConditionStringProperty;
      renderFixture(testContext.fixture);
    });
    it(isInitializedExpectation, () => {
      const addConditionButton = testContext.fixture.debugElement.nativeElement.querySelector(addButtonSelector);
      expect(addConditionButton).toBeNull();
      expect(testContext.fixture.nativeElement.querySelector('.filter-logic')).toBeNull();
      testContext.component.addCondition();
      expect(testContext.component.conditions.length).toBe(1);
    });
  });

  describe('with only one logical operator', () => {
    let singleConditionStringProperty: StringPropertyDefinition;
    beforeEach(() => {
      const singleProperty = 'singleConditionProperty';
      const singlePropertyName = 'singleConditionPropertyName';
      const singlePropertyComparisonOperators = [ComparisonOperator.Contains, ComparisonOperator.Equals];
      singleConditionStringProperty = new StringPropertyDefinition(
        singleProperty,
        singlePropertyName,
        singlePropertyComparisonOperators,
        false,
        LogicalOperator.And
      );
    });
    it(' which is AND is displayed correctly', () => {
      testContext.component.filterProperty = singleConditionStringProperty;
      renderFixture(testContext.fixture);
      const addConditionButton = testContext.fixture.debugElement.nativeElement.querySelector(addButtonSelector);
      addConditionButton.click();
      renderFixture(testContext.fixture);
      const logicalOperatorLabel = testContext.fixture.debugElement.nativeElement.querySelector(
        'button[data-test-id=logical-operator]'
      );

      expect(logicalOperatorLabel).toBeTruthy();
      expect(logicalOperatorLabel.textContent.trim()).toEqual('And');
      expect(logicalOperatorLabel.disabled).toBe(true);
      expect(testContext.fixture.nativeElement.querySelector('.filter-logic')).toBeNull();
    });

    it('which is OR is displayed correctly', () => {
      singleConditionStringProperty.logicalOperator = LogicalOperator.Or;
      testContext.component.filterProperty = singleConditionStringProperty;
      renderFixture(testContext.fixture);
      const addConditionButton = testContext.fixture.debugElement.nativeElement.querySelector(addButtonSelector);
      addConditionButton.click();
      addConditionButton.click();
      renderFixture(testContext.fixture);
      const logicalOperatorLabel = testContext.fixture.debugElement.nativeElement.querySelector(
        'button[data-test-id=logical-operator]'
      );

      expect(logicalOperatorLabel).toBeTruthy();
      expect(logicalOperatorLabel.textContent.trim()).toEqual('Or');
      expect(logicalOperatorLabel.disabled).toBe(true);
      expect(testContext.fixture.nativeElement.querySelector('.filter-logic')).toBeNull();
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      testContext.component.generalFilterForm.patchValue({
        logicalOperator: LogicalOperator.And,
        conditions: [{ value: 'vm' }, { value: 'host' }, { value: 'server' }],
      });
      renderFixture(testContext.fixture);
      testContext.fixture.nativeElement.querySelector(submitBtnSelector).click();
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(
        expect.objectContaining({ operator: LogicalOperator.Or })
      );
    });
  });
});

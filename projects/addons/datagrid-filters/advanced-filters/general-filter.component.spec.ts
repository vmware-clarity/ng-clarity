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
  beforeEach(function (this: ThisTest) {
    TestBed.configureTestingModule({
      imports: [ClrInputModule, ClrSelectModule, CommonModule, FormsModule, ReactiveFormsModule, ClrIcon],
      declarations: [FilterFormComponent, GeneralFilterComponent],
      providers: [DatagridFiltersStrings],
    });
    this.fixture = TestBed.createComponent(GeneralFilterComponent);
    this.component = this.fixture.componentInstance;
  });

  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });
  describe('in normal mode with string property', () => {
    beforeEach(function (this: ThisTest) {
      this.component.filterProperty = stringProperty;
      this.fixture.detectChanges();
    });
    it(isInitializedExpectation, function (this: ThisTest) {
      expect(this.component).toBeTruthy();
      expect(this.component.comparisonOperators).toEqual(comparisonOperators);

      expect(this.component.conditions.at(0).controls.operator.value).toEqual(ComparisonOperator.Contains);
      expect(this.component.conditions.at(0).controls.value.value).toEqual('');
      expect(this.component.generalFilterForm.controls['logicalOperator'].value).toEqual(LogicalOperator.And);
    });
    it('emits an empty event on cancel', function (this: ThisTest) {
      spyOn(this.component.filterCriteriaChange, 'emit');
      const cancelButton = this.fixture.debugElement.nativeElement.querySelector('button[data-test-id=cancelBtn]');
      expect(cancelButton).toBeTruthy();

      cancelButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith();
    });
    it('emits a property filter event on submit', function (this: ThisTest) {
      spyOn(this.component.filterCriteriaChange, 'emit');
      const submitButton: HTMLButtonElement = this.fixture.debugElement.nativeElement.querySelector(submitBtnSelector);
      expect(submitButton).toBeTruthy();
      expect(submitButton.disabled).toBeTruthy();
      expect(this.component.generalFilterForm.valid).toBeFalsy();

      const primaryOperatorSelect: HTMLSelectElement =
        this.fixture.debugElement.nativeElement.querySelector(primaryOperatorSelector);
      expect(primaryOperatorSelect).toBeTruthy();
      expect(primaryOperatorSelect.options.length).toEqual(3);

      primaryOperatorSelect.value = primaryOperatorSelect.options[0].value;
      primaryOperatorSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.conditions.at(0).controls.operator.value).toEqual(ComparisonOperator.Equals);

      const primaryValueInput: HTMLInputElement =
        this.fixture.debugElement.nativeElement.querySelector(primaryValueSelector);
      primaryValueInput.value = 'vm 1';
      primaryValueInput.dispatchEvent(new Event('input'));
      this.fixture.detectChanges();
      expect(this.component.conditions.at(0).controls.value.value).toEqual('vm 1');
      expect(submitButton.disabled).toBeFalsy();
      expect(this.component.generalFilterForm.valid).toBeTruthy();

      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(propertyFilter1);
    });
    it('updates comparison operators on property change ', function (this: ThisTest) {
      const testProperty = 'vmIpAddress';
      const testPropertyDisplayName = 'Ip Address';
      const testComparisonOperators = [ComparisonOperator.Contains, ComparisonOperator.IsEmpty];
      const testStringProperty: StringPropertyDefinition = new StringPropertyDefinition(
        testProperty,
        testPropertyDisplayName,
        testComparisonOperators
      );

      expect(this.component.comparisonOperators).toEqual(comparisonOperators);
      this.component.filterProperty = testStringProperty;
      this.component.ngOnChanges();
      expect(this.component.comparisonOperators).toEqual(testComparisonOperators);
    });

    it('applies the logic selected in the segmented buttons', function (this: ThisTest) {
      spyOn(this.component.filterCriteriaChange, 'emit');
      const logicInputs: NodeListOf<HTMLInputElement> =
        this.fixture.nativeElement.querySelectorAll('.filter-logic input');
      expect(logicInputs.length).toBe(2);
      expect(logicInputs[0].checked).toBeTrue();

      logicInputs[1].click();
      this.fixture.nativeElement.querySelector(addButtonSelector).click();
      this.fixture.detectChanges();
      expect(logicInputs[1].checked).toBeTrue();
      expect(this.fixture.nativeElement.querySelector('[data-test-id=logical-operator]').textContent.trim()).toBe('Or');

      this.component.conditions.patchValue([{ value: 'vm' }, { value: 'host' }]);
      this.fixture.detectChanges();
      this.fixture.nativeElement.querySelector(submitBtnSelector).click();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(
        jasmine.objectContaining({ operator: LogicalOperator.Or, criteria: jasmine.any(Array) })
      );
      expect(this.component.generalFilterForm.value.logicalOperator).toBe(LogicalOperator.Or);
    });

    it('disables AND for an empty primary condition and restores it for a value condition', function (this: ThisTest) {
      const andInput: HTMLInputElement = this.fixture.nativeElement.querySelector('.filter-logic input');
      this.component.conditions.at(0).controls.operator.setValue(ComparisonOperator.IsEmpty);
      this.fixture.detectChanges();
      expect(andInput.disabled).toBeTrue();
      expect(this.component.generalFilterForm.value.logicalOperator).toBe(LogicalOperator.Or);

      andInput.click();
      expect(this.component.generalFilterForm.value.logicalOperator).toBe(LogicalOperator.Or);

      this.component.conditions.at(0).controls.operator.setValue(ComparisonOperator.Equals);
      this.fixture.detectChanges();
      expect(andInput.disabled).toBeFalse();
      andInput.click();
      expect(this.component.generalFilterForm.value.logicalOperator).toBe(LogicalOperator.And);
    });

    it('restores AND after removing an empty secondary condition', function (this: ThisTest) {
      this.fixture.nativeElement.querySelector(addButtonSelector).click();
      this.fixture.detectChanges();
      this.component.conditions.at(1).controls.operator.setValue(ComparisonOperator.IsEmpty);
      this.fixture.detectChanges();
      const andInput: HTMLInputElement = this.fixture.nativeElement.querySelector('.filter-logic input');
      expect(andInput.disabled).toBeTrue();

      this.fixture.nativeElement.querySelectorAll('[data-test-id=close-button]')[1].click();
      this.fixture.detectChanges();
      expect(andInput.disabled).toBeFalse();
      andInput.click();
      expect(this.component.generalFilterForm.value.logicalOperator).toBe(LogicalOperator.And);
      expect(this.fixture.nativeElement.querySelector('[data-test-id=logical-operator]')).toBeNull();
    });
  });
  describe('with restricted comparison operators', () => {
    it('does not apply a value when no comparison operators are available', function (this: ThisTest) {
      this.component.filterProperty = new StringPropertyDefinition('Name', 'name', []);
      const emitted = spyOn(this.component.filterCriteriaChange, 'emit');
      this.fixture.detectChanges();
      this.component.conditions.at(0).controls.value.setValue('vm');
      this.fixture.detectChanges();
      expect(this.component.conditions.at(0).controls.operator.hasError('required')).toBeTrue();
      expect(this.component.generalFilterForm.valid).toBeFalse();
      const submit: HTMLButtonElement = this.fixture.nativeElement.querySelector(submitBtnSelector);
      expect(submit.disabled).toBeTrue();
      submit.click();
      this.component.onApplyButtonClick();
      expect(emitted).not.toHaveBeenCalled();
    });

    it('uses the only supported operator for both initial and added conditions', function (this: ThisTest) {
      this.component.filterProperty = new StringPropertyDefinition('Name', 'name', [ComparisonOperator.StartsWith]);
      const emitted = spyOn(this.component.filterCriteriaChange, 'emit');
      this.fixture.detectChanges();
      this.component.addCondition();
      this.component.conditions.patchValue([{ value: 'vm' }, { value: 'host' }]);
      this.fixture.detectChanges();
      expect(this.component.conditions.value.map(condition => condition.operator)).toEqual([
        ComparisonOperator.StartsWith,
        ComparisonOperator.StartsWith,
      ]);
      this.fixture.nativeElement.querySelector(submitBtnSelector).click();
      expect(emitted.calls.mostRecent().args[0].criteria.map(predicate => predicate.operator)).toEqual([
        ComparisonOperator.StartsWith,
        ComparisonOperator.StartsWith,
      ]);
    });
  });

  describe('with multiple conditions', () => {
    for (const logic of [LogicalOperator.And, LogicalOperator.Or]) {
      it(`applies and reopens four conditions with ${LogicalOperator[logic]}`, function (this: ThisTest) {
        this.component.filterProperty = new StringPropertyDefinition('Name', 'name');
        this.fixture.detectChanges();
        const emitted = spyOn(this.component.filterCriteriaChange, 'emit');
        for (let index = 0; index < 3; index++) {
          this.fixture.nativeElement.querySelector(addButtonSelector).click();
          this.fixture.detectChanges();
        }
        this.component.generalFilterForm.patchValue({
          logicalOperator: logic,
          conditions: [
            { operator: ComparisonOperator.Contains, value: 'vm' },
            { operator: ComparisonOperator.DoesNotContain, value: 'test' },
            { operator: ComparisonOperator.StartsWith, value: 'prod' },
            { operator: ComparisonOperator.EndsWith, value: '01' },
          ],
        });
        this.fixture.detectChanges();
        expect(this.fixture.nativeElement.querySelectorAll('.filter-condition-row').length).toBe(4);
        expect(this.fixture.nativeElement.querySelectorAll('[data-test-id=logical-operator]').length).toBe(3);
        expect(this.fixture.nativeElement.querySelector(addButtonSelector)).not.toBeNull();
        this.fixture.nativeElement.querySelector(submitBtnSelector).click();

        const filter = emitted.calls.mostRecent().args[0];
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
          reopened.componentInstance.filterProperty = this.component.filterProperty;
          reopened.componentInstance.propertyFilter = filter;
          reopened.detectChanges();
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

    it('removes middle, first, and last rows while preserving survivors and at least one row', function (this: ThisTest) {
      this.component.filterProperty = new StringPropertyDefinition('Name', 'name');
      this.fixture.detectChanges();
      for (let index = 0; index < 3; index++) {
        this.component.addCondition();
      }
      this.component.conditions.patchValue(['first', 'second', 'third', 'fourth'].map(value => ({ value })));
      const thirdRow = this.component.conditions.at(2);
      this.fixture.detectChanges();
      this.fixture.nativeElement.querySelectorAll('[data-test-id=close-button]')[1].click();
      this.fixture.detectChanges();
      expect(this.component.conditions.value.map(condition => condition.value)).toEqual(['first', 'third', 'fourth']);
      this.fixture.nativeElement.querySelectorAll('[data-test-id=close-button]')[0].click();
      this.fixture.detectChanges();
      expect(this.component.conditions.value.map(condition => condition.value)).toEqual(['third', 'fourth']);
      this.fixture.nativeElement.querySelectorAll('[data-test-id=close-button]')[1].click();
      this.fixture.detectChanges();
      expect(this.component.conditions.value.map(condition => condition.value)).toEqual(['third']);
      expect(this.component.conditions.at(0)).toBe(thirdRow);
      expect(this.fixture.nativeElement.querySelector('[data-test-id=close-button]').disabled).toBeTrue();
      this.component.removeCondition(0);
      expect(this.component.conditions.length).toBe(1);
    });

    it('validates the third row and restores required validation after Is empty', function (this: ThisTest) {
      this.component.filterProperty = new StringPropertyDefinition('Name', 'name');
      this.fixture.detectChanges();
      this.component.addCondition();
      this.component.addCondition();
      this.component.conditions.patchValue([{ value: 'first' }, { value: 'second' }, { value: '' }]);
      this.fixture.detectChanges();
      const submit: HTMLButtonElement = this.fixture.nativeElement.querySelector(submitBtnSelector);
      expect(submit.disabled).toBeTrue();
      const thirdOperator = this.component.conditions.at(2).controls.operator;
      thirdOperator.setValue(ComparisonOperator.IsEmpty);
      this.fixture.detectChanges();
      expect(submit.disabled).toBeFalse();
      expect(this.fixture.nativeElement.querySelector('.filter-logic input').disabled).toBeTrue();
      expect(this.component.generalFilterForm.value.logicalOperator).toBe(LogicalOperator.Or);
      thirdOperator.setValue(ComparisonOperator.Equals);
      this.fixture.detectChanges();
      expect(submit.disabled).toBeTrue();
      expect(this.component.conditions.at(2).controls.value.hasError('required')).toBeTrue();
      expect(this.fixture.nativeElement.querySelector('.filter-logic input').disabled).toBeFalse();
      this.component.conditions.at(2).controls.value.setValue('third');
      this.fixture.detectChanges();
      expect(submit.disabled).toBeFalse();
    });

    it('restores required validation when a preset empty condition becomes a value condition', function (this: ThisTest) {
      const field = new StringPropertyDefinition('Name', 'name');
      this.component.filterProperty = field;
      this.component.propertyFilter = {
        operator: LogicalOperator.Or,
        criteria: [
          { filterableProperty: field, operator: ComparisonOperator.Contains, value: 'vm' },
          { filterableProperty: field, operator: ComparisonOperator.Contains, value: 'host' },
          { filterableProperty: field, operator: ComparisonOperator.IsEmpty, value: '' },
        ],
      };
      this.fixture.detectChanges();
      expect(this.component.generalFilterForm.valid).toBeTrue();
      this.component.conditions.at(2).controls.operator.setValue(ComparisonOperator.Contains);
      expect(this.component.conditions.at(2).controls.value.hasError('required')).toBeTrue();
      expect(this.component.generalFilterForm.valid).toBeFalse();
    });

    it('preserves zero and per-row numeric units through removal, apply, and reopening', function (this: ThisTest) {
      const field = new NumericPropertyDefinition('Memory', 'memory', undefined, Unit.Byte);
      this.component.filterProperty = field;
      this.fixture.detectChanges();
      const emitted = spyOn(this.component.filterCriteriaChange, 'emit');
      for (let index = 0; index < 3; index++) {
        this.component.addCondition();
      }
      this.component.conditions.patchValue([
        { value: 0, unit: Unit.Byte },
        { value: 1, unit: Unit.KB },
        { value: 2, unit: Unit.MB },
        { value: 3, unit: Unit.GB },
      ]);
      this.component.removeCondition(1);
      this.fixture.detectChanges();
      this.fixture.nativeElement.querySelector(submitBtnSelector).click();
      const filter = emitted.calls.mostRecent().args[0];
      expect(filter.criteria.map(predicate => predicate.value)).toEqual([0, 2 * 1024 ** 2, 3 * 1024 ** 3]);
      expect(filter.criteria[0].filterableProperty.selectedValue).toEqual([0, 2, 3]);
      expect(filter.criteria[0].filterableProperty.selectedUnit).toEqual([Unit.Byte, Unit.MB, Unit.GB]);
      const reopened = TestBed.createComponent(GeneralFilterComponent);
      try {
        reopened.componentInstance.filterProperty = filter.criteria[0].filterableProperty as NumericPropertyDefinition;
        reopened.componentInstance.propertyFilter = filter;
        reopened.detectChanges();
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

    it('loads numeric presets without display metadata in their base unit, including zero', function (this: ThisTest) {
      const field = new NumericPropertyDefinition('Memory', 'memory', undefined, Unit.MB);
      const values = [0, 1024, 2048];
      this.component.filterProperty = field;
      this.component.propertyFilter = {
        operator: LogicalOperator.Or,
        criteria: values.map(value => ({ filterableProperty: field, operator: ComparisonOperator.Equals, value })),
      };
      const emitted = spyOn(this.component.filterCriteriaChange, 'emit');
      this.fixture.detectChanges();
      expect(field.selectedValue).toBeUndefined();
      expect(field.selectedUnit).toBeUndefined();
      expect(this.component.conditions.value.map(condition => condition.value)).toEqual(values);
      expect(this.component.conditions.value.map(condition => condition.unit)).toEqual([Unit.MB, Unit.MB, Unit.MB]);
      expect(this.component.generalFilterForm.valid).toBeTrue();
      this.fixture.nativeElement.querySelector(submitBtnSelector).click();
      expect(emitted.calls.mostRecent().args[0].criteria.map(predicate => predicate.value)).toEqual(values);
    });

    it('rejects an invalid numeric value in a later row', function (this: ThisTest) {
      this.component.filterProperty = new NumericPropertyDefinition('Memory', 'memory');
      this.fixture.detectChanges();
      this.component.addCondition();
      this.component.addCondition();
      this.component.conditions.patchValue([{ value: '10' }, { value: '20' }, { value: 'not a number' }]);
      this.fixture.detectChanges();
      expect(this.component.conditions.at(2).controls.value.hasError('pattern')).toBeTrue();
      expect(this.fixture.nativeElement.querySelector(submitBtnSelector).disabled).toBeTrue();
      this.component.conditions.at(2).controls.value.setValue(0);
      this.fixture.detectChanges();
      expect(this.component.generalFilterForm.valid).toBeTrue();
    });
  });

  describe('in normal mode with numeric property', () => {
    beforeEach(function (this: ThisTest) {
      numericProperty.unit = Unit.Byte;
      this.component.filterProperty = numericProperty;
      this.fixture.detectChanges();
    });
    it(isInitializedExpectation, function (this: ThisTest) {
      expect(this.component.comparisonOperators).toEqual(numericOperators);

      expect(this.component.conditions.at(0).controls.operator.value).toEqual(ComparisonOperator.Equals);
      expect(this.component.conditions.at(0).controls.value.value).toEqual('');
      expect(this.component.generalFilterForm.controls['logicalOperator'].value).toEqual(LogicalOperator.And);
    });
    it('correctly updates units on property change', function (this: ThisTest) {
      const primaryUnitSelect: HTMLSelectElement =
        this.fixture.debugElement.nativeElement.querySelector(primaryUnitSelector);
      expect(primaryUnitSelect.options.length).toEqual(5);
      expect(primaryUnitSelect.options[0].text).toEqual('B');
      expect(primaryUnitSelect.options[1].text).toEqual('KB');
      expect(primaryUnitSelect.options[2].text).toEqual('MB');
      expect(primaryUnitSelect.options[3].text).toEqual('GB');
      expect(primaryUnitSelect.options[4].text).toEqual('TB');

      this.component.filterProperty.unit = Unit.Byte;
      this.component.ngOnChanges();
      expect(this.component.units.length).toEqual(5);
      expect(this.component.units[0]).toEqual(Unit.Byte);
      expect(this.component.units[1]).toEqual(Unit.KB);
      expect(this.component.units[2]).toEqual(Unit.MB);
      expect(this.component.units[3]).toEqual(Unit.GB);
      expect(this.component.units[4]).toEqual(Unit.TB);

      this.component.filterProperty.unit = Unit.KB;
      this.component.ngOnChanges();
      expect(this.component.units.length).toEqual(4);
      expect(this.component.units[0]).toEqual(Unit.KB);
      expect(this.component.units[1]).toEqual(Unit.MB);
      expect(this.component.units[2]).toEqual(Unit.GB);
      expect(this.component.units[3]).toEqual(Unit.TB);

      this.component.filterProperty.unit = Unit.MB;
      this.component.ngOnChanges();
      expect(this.component.units.length).toEqual(3);
      expect(this.component.units[0]).toEqual(Unit.MB);
      expect(this.component.units[1]).toEqual(Unit.GB);
      expect(this.component.units[2]).toEqual(Unit.TB);

      this.component.filterProperty.unit = Unit.GB;
      this.component.ngOnChanges();
      expect(this.component.units.length).toEqual(2);
      expect(this.component.units[0]).toEqual(Unit.GB);
      expect(this.component.units[1]).toEqual(Unit.TB);

      this.component.filterProperty.unit = Unit.TB;
      this.component.ngOnChanges();
      expect(this.component.units.length).toEqual(1);
      expect(this.component.units[0]).toEqual(Unit.TB);

      this.component.filterProperty.unit = Unit.HZ;
      this.component.ngOnChanges();
      expect(this.component.units.length).toEqual(4);
      expect(this.component.units[0]).toEqual(Unit.HZ);
      expect(this.component.units[1]).toEqual(Unit.KHZ);
      expect(this.component.units[2]).toEqual(Unit.MHZ);
      expect(this.component.units[3]).toEqual(Unit.GHZ);

      this.component.filterProperty.unit = Unit.KHZ;
      this.component.ngOnChanges();
      expect(this.component.units.length).toEqual(3);
      expect(this.component.units[0]).toEqual(Unit.KHZ);
      expect(this.component.units[1]).toEqual(Unit.MHZ);
      expect(this.component.units[2]).toEqual(Unit.GHZ);

      this.component.filterProperty.unit = Unit.MHZ;
      this.component.ngOnChanges();
      expect(this.component.units.length).toEqual(2);
      expect(this.component.units[0]).toEqual(Unit.MHZ);
      expect(this.component.units[1]).toEqual(Unit.GHZ);

      this.component.filterProperty.unit = Unit.GHZ;
      this.component.ngOnChanges();
      expect(this.component.units.length).toEqual(1);
      expect(this.component.units[0]).toEqual(Unit.GHZ);

      this.component.filterProperty.unit = Unit.BytePS;
      this.component.ngOnChanges();
      expect(this.component.units.length).toEqual(4);
      expect(this.component.units[0]).toEqual(Unit.BytePS);
      expect(this.component.units[1]).toEqual(Unit.KBytePS);
      expect(this.component.units[2]).toEqual(Unit.MBytePS);
      expect(this.component.units[3]).toEqual(Unit.GBytePS);

      this.component.filterProperty.unit = Unit.KBytePS;
      this.component.ngOnChanges();
      expect(this.component.units.length).toEqual(3);
      expect(this.component.units[0]).toEqual(Unit.KBytePS);
      expect(this.component.units[1]).toEqual(Unit.MBytePS);
      expect(this.component.units[2]).toEqual(Unit.GBytePS);

      this.component.filterProperty.unit = Unit.MBytePS;
      this.component.ngOnChanges();
      expect(this.component.units.length).toEqual(2);
      expect(this.component.units[0]).toEqual(Unit.MBytePS);
      expect(this.component.units[1]).toEqual(Unit.GBytePS);

      this.component.filterProperty.unit = Unit.GBytePS;
      this.component.ngOnChanges();
      expect(this.component.units.length).toEqual(1);
      expect(this.component.units[0]).toEqual(Unit.GBytePS);

      this.component.filterProperty.unit = Unit.BitPS;
      this.component.ngOnChanges();
      expect(this.component.units.length).toEqual(4);
      expect(this.component.units[0]).toEqual(Unit.BitPS);
      expect(this.component.units[1]).toEqual(Unit.KBitPS);
      expect(this.component.units[2]).toEqual(Unit.MBitPS);
      expect(this.component.units[3]).toEqual(Unit.GBitPS);

      this.component.filterProperty.unit = Unit.KBitPS;
      this.component.ngOnChanges();
      expect(this.component.units.length).toEqual(3);
      expect(this.component.units[0]).toEqual(Unit.KBitPS);
      expect(this.component.units[1]).toEqual(Unit.MBitPS);
      expect(this.component.units[2]).toEqual(Unit.GBitPS);

      this.component.filterProperty.unit = Unit.MBitPS;
      this.component.ngOnChanges();
      expect(this.component.units.length).toEqual(2);
      expect(this.component.units[0]).toEqual(Unit.MBitPS);
      expect(this.component.units[1]).toEqual(Unit.GBitPS);

      this.component.filterProperty.unit = Unit.GBitPS;
      this.component.ngOnChanges();
      expect(this.component.units.length).toEqual(1);
      expect(this.component.units[0]).toEqual(Unit.GBitPS);
    });
    it('emits a property filter event on submit', function (this: ThisTest) {
      spyOn(this.component.filterCriteriaChange, 'emit');
      const submitButton: HTMLButtonElement = this.fixture.debugElement.nativeElement.querySelector(submitBtnSelector);
      expect(submitButton).toBeTruthy();
      expect(submitButton.disabled).toBeTruthy();
      expect(this.component.generalFilterForm.valid).toBeFalsy();

      const primaryOperatorSelect: HTMLSelectElement =
        this.fixture.debugElement.nativeElement.querySelector(primaryOperatorSelector);
      expect(primaryOperatorSelect).toBeTruthy();
      expect(primaryOperatorSelect.options.length).toEqual(7);

      primaryOperatorSelect.value = primaryOperatorSelect.options[2].value;
      primaryOperatorSelect.dispatchEvent(new Event('change'));
      this.fixture.detectChanges();
      expect(this.component.conditions.at(0).controls.operator.value).toEqual(ComparisonOperator.GreaterThan);

      const primaryValueInput: HTMLInputElement =
        this.fixture.debugElement.nativeElement.querySelector(primaryValueSelector);
      primaryValueInput.value = 'text';
      primaryValueInput.dispatchEvent(new Event('input'));
      this.fixture.detectChanges();
      expect(this.component.conditions.at(0).controls.value.value).toEqual('text');
      expect(submitButton.disabled).toBeTruthy();
      expect(this.component.generalFilterForm.valid).toBeFalsy();

      primaryValueInput.value = '500';
      primaryValueInput.dispatchEvent(new Event('input'));
      this.fixture.detectChanges();
      expect(this.component.conditions.at(0).controls.value.value).toEqual('500');
      expect(submitButton.disabled).toBeFalsy();
      expect(this.component.generalFilterForm.valid).toBeTruthy();

      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(numericPropertyFilter1);
    });
    it('converts filter values to the corresponding property unit', function (this: ThisTest) {
      const emitted = spyOn(this.component.filterCriteriaChange, 'emit');
      const submitButton: HTMLButtonElement = this.fixture.debugElement.nativeElement.querySelector(submitBtnSelector);
      const primaryValueInput: HTMLInputElement =
        this.fixture.debugElement.nativeElement.querySelector(primaryValueSelector);
      primaryValueInput.value = '100';
      primaryValueInput.dispatchEvent(new Event('input'));
      this.fixture.detectChanges();

      this.component.filterProperty.unit = Unit.Byte;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual('100');

      const primaryUnitSelect: HTMLSelectElement =
        this.fixture.debugElement.nativeElement.querySelector(primaryUnitSelector);
      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(102400);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(104857600);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(107374182400);

      primaryUnitSelect.value = primaryUnitSelect.options[4].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(109951162777600);

      this.component.filterProperty.unit = Unit.HZ;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(100000000);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(100000000000);

      this.component.filterProperty.unit = Unit.BytePS;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(100000000);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(100000000000);

      this.component.filterProperty.unit = Unit.KB;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(102400);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(104857600);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(107374182400);

      this.component.filterProperty.unit = Unit.MB;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(102400);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(104857600);

      this.component.filterProperty.unit = Unit.GB;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(102400);

      this.component.filterProperty.unit = Unit.TB;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual('100');

      this.component.filterProperty.unit = Unit.KHZ;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(100000000);

      this.component.filterProperty.unit = Unit.MHZ;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(100000);

      this.component.filterProperty.unit = Unit.GHZ;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual('100');

      this.component.filterProperty.unit = Unit.KBytePS;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(100000000);

      this.component.filterProperty.unit = Unit.MBytePS;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(100000);

      this.component.filterProperty.unit = Unit.GBytePS;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual('100');

      this.component.filterProperty.unit = Unit.BitPS;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(100000000);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(100000000000);

      this.component.filterProperty.unit = Unit.KBitPS;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(100000000);

      this.component.filterProperty.unit = Unit.MBitPS;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual(100000);

      this.component.filterProperty.unit = Unit.GBitPS;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(emitted.calls.mostRecent().args[0].criteria[0].value).toEqual('100');
    });
  });
  describe('in edit mode with string property', () => {
    beforeEach(function (this: ThisTest) {
      this.component.filterProperty = stringProperty;
      this.component.propertyFilter = propertyFilter2;
      this.fixture.detectChanges();
    });
    it(isInitializedExpectation, function (this: ThisTest) {
      expect(this.component.conditions.at(0).controls.operator.value).toEqual(ComparisonOperator.Equals);
      expect(this.component.conditions.at(0).controls.value.value).toEqual('vm 1');
      expect(this.component.generalFilterForm.controls['logicalOperator'].value).toEqual(LogicalOperator.Or);
      expect(this.component.conditions.at(1).controls.operator.value).toEqual(ComparisonOperator.IsEmpty);
    });
  });
  describe('in edit mode with numeric property', () => {
    beforeEach(function (this: ThisTest) {
      numericProperty.unit = Unit.MB;
      numericProperty.selectedValue = [800, 700];
      numericProperty.selectedUnit = [Unit.MB, Unit.KB];
      this.component.filterProperty = numericProperty;
      this.component.propertyFilter = numericPropertyFilter2;
      this.fixture.detectChanges();
    });
    it(isInitializedExpectation, function (this: ThisTest) {
      expect(this.component.conditions.at(0).controls.operator.value).toEqual(ComparisonOperator.GreaterThan);
      expect(this.component.conditions.at(0).controls.value.value).toEqual(800);
      expect(this.component.conditions.at(0).controls.unit.value).toEqual(Unit.MB);
      expect(this.component.generalFilterForm.controls['logicalOperator'].value).toEqual(LogicalOperator.Or);
      expect(this.component.conditions.at(1).controls.operator.value).toEqual(ComparisonOperator.LessThanOrEqualTo);
      expect(this.component.conditions.at(1).controls.value.value).toEqual(700);
      expect(this.component.conditions.at(1).controls.unit.value).toEqual(Unit.KB);
    });
  });
  describe('with single condition property', () => {
    beforeEach(function (this: ThisTest) {
      const singleProperty = 'singleConditionProperty';
      const singlePropertyName = 'singleConditionPropertyName';
      const singlePropertyComparisonOperators = [ComparisonOperator.Contains, ComparisonOperator.Equals];
      const singleConditionStringProperty: StringPropertyDefinition = new StringPropertyDefinition(
        singleProperty,
        singlePropertyName,
        singlePropertyComparisonOperators,
        true
      );
      this.component.filterProperty = singleConditionStringProperty;
      this.fixture.detectChanges();
    });
    it(isInitializedExpectation, function (this: ThisTest) {
      const addConditionButton = this.fixture.debugElement.nativeElement.querySelector(addButtonSelector);
      expect(addConditionButton).toBeNull();
      expect(this.fixture.nativeElement.querySelector('.filter-logic')).toBeNull();
      this.component.addCondition();
      expect(this.component.conditions.length).toBe(1);
    });
  });

  describe('with only one logical operator', () => {
    let singleConditionStringProperty: StringPropertyDefinition;
    beforeEach(function (this: ThisTest) {
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
    it(' which is AND is displayed correctly', function (this: ThisTest) {
      this.component.filterProperty = singleConditionStringProperty;
      this.fixture.detectChanges();
      const addConditionButton = this.fixture.debugElement.nativeElement.querySelector(addButtonSelector);
      addConditionButton.click();
      this.fixture.detectChanges();
      const logicalOperatorLabel = this.fixture.debugElement.nativeElement.querySelector(
        'button[data-test-id=logical-operator]'
      );

      expect(logicalOperatorLabel).toBeTruthy();
      expect(logicalOperatorLabel.textContent.trim()).toEqual('And');
      expect(logicalOperatorLabel.disabled).toBeTrue();
      expect(this.fixture.nativeElement.querySelector('.filter-logic')).toBeNull();
    });

    it('which is OR is displayed correctly', function (this: ThisTest) {
      singleConditionStringProperty.logicalOperator = LogicalOperator.Or;
      this.component.filterProperty = singleConditionStringProperty;
      this.fixture.detectChanges();
      const addConditionButton = this.fixture.debugElement.nativeElement.querySelector(addButtonSelector);
      addConditionButton.click();
      addConditionButton.click();
      this.fixture.detectChanges();
      const logicalOperatorLabel = this.fixture.debugElement.nativeElement.querySelector(
        'button[data-test-id=logical-operator]'
      );

      expect(logicalOperatorLabel).toBeTruthy();
      expect(logicalOperatorLabel.textContent.trim()).toEqual('Or');
      expect(logicalOperatorLabel.disabled).toBeTrue();
      expect(this.fixture.nativeElement.querySelector('.filter-logic')).toBeNull();
      spyOn(this.component.filterCriteriaChange, 'emit');
      this.component.generalFilterForm.patchValue({
        logicalOperator: LogicalOperator.And,
        conditions: [{ value: 'vm' }, { value: 'host' }, { value: 'server' }],
      });
      this.fixture.detectChanges();
      this.fixture.nativeElement.querySelector(submitBtnSelector).click();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(
        jasmine.objectContaining({ operator: LogicalOperator.Or })
      );
    });
  });
});

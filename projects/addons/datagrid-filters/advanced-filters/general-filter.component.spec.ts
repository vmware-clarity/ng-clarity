/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrInputModule, ClrRadioModule, ClrSelectModule } from '@clr/angular/forms';
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
const primaryOperatorSelector = 'select[formControlName=primaryOperator]';
const primaryValueSelector = 'input[formControlName=primaryValue]';
const primaryUnitSelector = 'select[formControlName=primaryUnit]';
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
      imports: [
        ClrInputModule,
        ClrRadioModule,
        ClrSelectModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClrIcon,
      ],
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
      testContext.fixture.detectChanges();
    });
    it(isInitializedExpectation, () => {
      expect(testContext.component).toBeTruthy();
      expect(testContext.component.comparisonOperators).toEqual(comparisonOperators);

      expect(testContext.component.generalFilterForm.controls['primaryOperator'].value).toEqual(
        ComparisonOperator.Contains
      );
      expect(testContext.component.generalFilterForm.controls['primaryValue'].value).toEqual('');
      expect(testContext.component.generalFilterForm.controls['logicalOperator'].value).toEqual(LogicalOperator.And);
    });
    it('emits an empty event on cancel', () => {
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      const cancelButton = testContext.fixture.debugElement.nativeElement.querySelector(
        'button[data-test-id=cancelBtn]'
      );
      expect(cancelButton).toBeTruthy();

      cancelButton.click();
      testContext.fixture.detectChanges();
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
      testContext.fixture.detectChanges();
      expect(testContext.component.generalFilterForm.controls['primaryOperator'].value).toEqual(
        ComparisonOperator.Equals
      );

      const primaryValueInput: HTMLInputElement =
        testContext.fixture.debugElement.nativeElement.querySelector(primaryValueSelector);
      primaryValueInput.value = 'vm 1';
      primaryValueInput.dispatchEvent(new Event('input'));
      testContext.fixture.detectChanges();
      expect(testContext.component.generalFilterForm.controls['primaryValue'].value).toEqual('vm 1');
      expect(submitButton.disabled).toBeFalsy();
      expect(testContext.component.generalFilterForm.valid).toBeTruthy();

      submitButton.click();
      testContext.fixture.detectChanges();
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
  });
  describe('in normal mode with numeric property', () => {
    beforeEach(() => {
      numericProperty.unit = Unit.Byte;
      testContext.component.filterProperty = numericProperty;
      testContext.fixture.detectChanges();
    });
    it(isInitializedExpectation, () => {
      expect(testContext.component.comparisonOperators).toEqual(numericOperators);

      expect(testContext.component.generalFilterForm.controls['primaryOperator'].value).toEqual(
        ComparisonOperator.Equals
      );
      expect(testContext.component.generalFilterForm.controls['primaryValue'].value).toEqual('');
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
      testContext.fixture.detectChanges();
      expect(testContext.component.generalFilterForm.controls['primaryOperator'].value).toEqual(
        ComparisonOperator.GreaterThan
      );

      const primaryValueInput: HTMLInputElement =
        testContext.fixture.debugElement.nativeElement.querySelector(primaryValueSelector);
      primaryValueInput.value = 'text';
      primaryValueInput.dispatchEvent(new Event('input'));
      testContext.fixture.detectChanges();
      expect(testContext.component.generalFilterForm.controls['primaryValue'].value).toEqual('text');
      expect(submitButton.disabled).toBeTruthy();
      expect(testContext.component.generalFilterForm.valid).toBeFalsy();

      primaryValueInput.value = '500';
      primaryValueInput.dispatchEvent(new Event('input'));
      testContext.fixture.detectChanges();
      expect(testContext.component.generalFilterForm.controls['primaryValue'].value).toEqual('500');
      expect(submitButton.disabled).toBeFalsy();
      expect(testContext.component.generalFilterForm.valid).toBeTruthy();

      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(numericPropertyFilter1);
    });
    it('converts filter values to the corresponding property unit', () => {
      const submitButton: HTMLButtonElement =
        testContext.fixture.debugElement.nativeElement.querySelector(submitBtnSelector);
      const primaryValueInput: HTMLInputElement =
        testContext.fixture.debugElement.nativeElement.querySelector(primaryValueSelector);
      primaryValueInput.value = '100';
      primaryValueInput.dispatchEvent(new Event('input'));
      testContext.fixture.detectChanges();

      testContext.component.filterProperty.unit = Unit.Byte;
      testContext.component.ngOnChanges();
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      const primaryUnitSelect: HTMLSelectElement =
        testContext.fixture.debugElement.nativeElement.querySelector(primaryUnitSelector);
      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(102400);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(104857600);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(107374182400);

      primaryUnitSelect.value = primaryUnitSelect.options[4].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(109951162777600);

      testContext.component.filterProperty.unit = Unit.HZ;
      testContext.component.ngOnChanges();
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000000);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000000000);

      testContext.component.filterProperty.unit = Unit.BytePS;
      testContext.component.ngOnChanges();
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000000);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000000000);

      testContext.component.filterProperty.unit = Unit.KB;
      testContext.component.ngOnChanges();
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(102400);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(104857600);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(107374182400);

      testContext.component.filterProperty.unit = Unit.MB;
      testContext.component.ngOnChanges();
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(102400);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(104857600);

      testContext.component.filterProperty.unit = Unit.GB;
      testContext.component.ngOnChanges();
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(102400);

      testContext.component.filterProperty.unit = Unit.TB;
      testContext.component.ngOnChanges();
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      testContext.component.filterProperty.unit = Unit.KHZ;
      testContext.component.ngOnChanges();
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000000);

      testContext.component.filterProperty.unit = Unit.MHZ;
      testContext.component.ngOnChanges();
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000);

      testContext.component.filterProperty.unit = Unit.GHZ;
      testContext.component.ngOnChanges();
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      testContext.component.filterProperty.unit = Unit.KBytePS;
      testContext.component.ngOnChanges();
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000000);

      testContext.component.filterProperty.unit = Unit.MBytePS;
      testContext.component.ngOnChanges();
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000);

      testContext.component.filterProperty.unit = Unit.GBytePS;
      testContext.component.ngOnChanges();
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      testContext.component.filterProperty.unit = Unit.BitPS;
      testContext.component.ngOnChanges();
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000000);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000000000);

      testContext.component.filterProperty.unit = Unit.KBitPS;
      testContext.component.ngOnChanges();
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000000);

      testContext.component.filterProperty.unit = Unit.MBitPS;
      testContext.component.ngOnChanges();
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000);

      testContext.component.filterProperty.unit = Unit.GBitPS;
      testContext.component.ngOnChanges();
      submitButton.click();
      testContext.fixture.detectChanges();
      expect(testContext.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');
    });
  });
  describe('in edit mode with string property', () => {
    beforeEach(() => {
      testContext.component.filterProperty = stringProperty;
      testContext.component.propertyFilter = propertyFilter2;
      testContext.fixture.detectChanges();
    });
    it(isInitializedExpectation, () => {
      expect(testContext.component.generalFilterForm.controls['primaryOperator'].value).toEqual(
        ComparisonOperator.Equals
      );
      expect(testContext.component.generalFilterForm.controls['primaryValue'].value).toEqual('vm 1');
      expect(testContext.component.generalFilterForm.controls['logicalOperator'].value).toEqual(LogicalOperator.Or);
      expect(testContext.component.generalFilterForm.controls['secondaryOperator'].value).toEqual(
        ComparisonOperator.IsEmpty
      );
    });
  });
  describe('in edit mode with numeric property', () => {
    beforeEach(() => {
      numericProperty.unit = Unit.MB;
      numericProperty.selectedValue = [800, 700];
      numericProperty.selectedUnit = [Unit.MB, Unit.KB];
      testContext.component.filterProperty = numericProperty;
      testContext.component.propertyFilter = numericPropertyFilter2;
      testContext.fixture.detectChanges();
    });
    it(isInitializedExpectation, () => {
      expect(testContext.component.generalFilterForm.controls['primaryOperator'].value).toEqual(
        ComparisonOperator.GreaterThan
      );
      expect(testContext.component.generalFilterForm.controls['primaryValue'].value).toEqual(800);
      expect(testContext.component.generalFilterForm.controls['primaryUnit'].value).toEqual(Unit.MB);
      expect(testContext.component.generalFilterForm.controls['logicalOperator'].value).toEqual(LogicalOperator.Or);
      expect(testContext.component.generalFilterForm.controls['secondaryOperator'].value).toEqual(
        ComparisonOperator.LessThanOrEqualTo
      );
      expect(testContext.component.generalFilterForm.controls['secondaryValue'].value).toEqual(700);
      expect(testContext.component.generalFilterForm.controls['secondaryUnit'].value).toEqual(Unit.KB);
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
      testContext.fixture.detectChanges();
    });
    it(isInitializedExpectation, () => {
      const addConditionButton = testContext.fixture.debugElement.nativeElement.querySelector(addButtonSelector);
      expect(addConditionButton).toBeNull();
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
      testContext.fixture.detectChanges();
      const addConditionButton = testContext.fixture.debugElement.nativeElement.querySelector(addButtonSelector);
      addConditionButton.click();
      testContext.fixture.detectChanges();
      const logicalOperatorLabel = testContext.fixture.debugElement.nativeElement.querySelector(
        'span[data-test-id=logical-operator]'
      );

      expect(logicalOperatorLabel).toBeTruthy();
      expect(logicalOperatorLabel.innerText.trim()).toEqual('And');
    });

    it('which is OR is displayed correctly', () => {
      singleConditionStringProperty.logicalOperator = LogicalOperator.Or;
      testContext.component.filterProperty = singleConditionStringProperty;
      testContext.fixture.detectChanges();
      const addConditionButton = testContext.fixture.debugElement.nativeElement.querySelector(addButtonSelector);
      addConditionButton.click();
      testContext.fixture.detectChanges();
      const logicalOperatorLabel = testContext.fixture.debugElement.nativeElement.querySelector(
        'span[data-test-id=logical-operator]'
      );

      expect(logicalOperatorLabel).toBeTruthy();
      expect(logicalOperatorLabel.innerText.trim()).toEqual('Or');
    });
  });
});

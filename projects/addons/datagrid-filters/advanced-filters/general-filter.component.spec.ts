/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrIcon, ClrInputModule, ClrRadioModule, ClrSelectModule } from '@clr/angular';

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
  beforeEach(function (this: ThisTest) {
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

      expect(this.component.generalFilterForm.controls['primaryOperator'].value).toEqual(ComparisonOperator.Contains);
      expect(this.component.generalFilterForm.controls['primaryValue'].value).toEqual('');
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
      expect(this.component.generalFilterForm.controls['primaryOperator'].value).toEqual(ComparisonOperator.Equals);

      const primaryValueInput: HTMLInputElement =
        this.fixture.debugElement.nativeElement.querySelector(primaryValueSelector);
      primaryValueInput.value = 'vm 1';
      primaryValueInput.dispatchEvent(new Event('input'));
      this.fixture.detectChanges();
      expect(this.component.generalFilterForm.controls['primaryValue'].value).toEqual('vm 1');
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
  });
  describe('in normal mode with numeric property', () => {
    beforeEach(function (this: ThisTest) {
      numericProperty.unit = Unit.Byte;
      this.component.filterProperty = numericProperty;
      this.fixture.detectChanges();
    });
    it(isInitializedExpectation, function (this: ThisTest) {
      expect(this.component.comparisonOperators).toEqual(numericOperators);

      expect(this.component.generalFilterForm.controls['primaryOperator'].value).toEqual(ComparisonOperator.Equals);
      expect(this.component.generalFilterForm.controls['primaryValue'].value).toEqual('');
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
      expect(this.component.generalFilterForm.controls['primaryOperator'].value).toEqual(
        ComparisonOperator.GreaterThan
      );

      const primaryValueInput: HTMLInputElement =
        this.fixture.debugElement.nativeElement.querySelector(primaryValueSelector);
      primaryValueInput.value = 'text';
      primaryValueInput.dispatchEvent(new Event('input'));
      this.fixture.detectChanges();
      expect(this.component.generalFilterForm.controls['primaryValue'].value).toEqual('text');
      expect(submitButton.disabled).toBeTruthy();
      expect(this.component.generalFilterForm.valid).toBeFalsy();

      primaryValueInput.value = '500';
      primaryValueInput.dispatchEvent(new Event('input'));
      this.fixture.detectChanges();
      expect(this.component.generalFilterForm.controls['primaryValue'].value).toEqual('500');
      expect(submitButton.disabled).toBeFalsy();
      expect(this.component.generalFilterForm.valid).toBeTruthy();

      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
      expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(numericPropertyFilter1);
    });
    it('converts filter values to the corresponding property unit', function (this: ThisTest) {
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
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      const primaryUnitSelect: HTMLSelectElement =
        this.fixture.debugElement.nativeElement.querySelector(primaryUnitSelector);
      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(102400);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(104857600);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(107374182400);

      primaryUnitSelect.value = primaryUnitSelect.options[4].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(109951162777600);

      this.component.filterProperty.unit = Unit.HZ;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000000);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000000000);

      this.component.filterProperty.unit = Unit.BytePS;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000000);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000000000);

      this.component.filterProperty.unit = Unit.KB;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(102400);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(104857600);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(107374182400);

      this.component.filterProperty.unit = Unit.MB;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(102400);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(104857600);

      this.component.filterProperty.unit = Unit.GB;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(102400);

      this.component.filterProperty.unit = Unit.TB;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      this.component.filterProperty.unit = Unit.KHZ;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000000);

      this.component.filterProperty.unit = Unit.MHZ;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000);

      this.component.filterProperty.unit = Unit.GHZ;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      this.component.filterProperty.unit = Unit.KBytePS;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000000);

      this.component.filterProperty.unit = Unit.MBytePS;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000);

      this.component.filterProperty.unit = Unit.GBytePS;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      this.component.filterProperty.unit = Unit.BitPS;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000000);

      primaryUnitSelect.value = primaryUnitSelect.options[3].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000000000);

      this.component.filterProperty.unit = Unit.KBitPS;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000);

      primaryUnitSelect.value = primaryUnitSelect.options[2].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000000);

      this.component.filterProperty.unit = Unit.MBitPS;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');

      primaryUnitSelect.value = primaryUnitSelect.options[1].value;
      primaryUnitSelect.dispatchEvent(new Event('change'));
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual(100000);

      this.component.filterProperty.unit = Unit.GBitPS;
      this.component.ngOnChanges();
      submitButton.click();
      this.fixture.detectChanges();
      expect(this.component['selectedFilterCriteria'].criteria[0].value).toEqual('100');
    });
  });
  describe('in edit mode with string property', () => {
    beforeEach(function (this: ThisTest) {
      this.component.filterProperty = stringProperty;
      this.component.propertyFilter = propertyFilter2;
      this.fixture.detectChanges();
    });
    it(isInitializedExpectation, function (this: ThisTest) {
      expect(this.component.generalFilterForm.controls['primaryOperator'].value).toEqual(ComparisonOperator.Equals);
      expect(this.component.generalFilterForm.controls['primaryValue'].value).toEqual('vm 1');
      expect(this.component.generalFilterForm.controls['logicalOperator'].value).toEqual(LogicalOperator.Or);
      expect(this.component.generalFilterForm.controls['secondaryOperator'].value).toEqual(ComparisonOperator.IsEmpty);
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
      expect(this.component.generalFilterForm.controls['primaryOperator'].value).toEqual(
        ComparisonOperator.GreaterThan
      );
      expect(this.component.generalFilterForm.controls['primaryValue'].value).toEqual(800);
      expect(this.component.generalFilterForm.controls['primaryUnit'].value).toEqual(Unit.MB);
      expect(this.component.generalFilterForm.controls['logicalOperator'].value).toEqual(LogicalOperator.Or);
      expect(this.component.generalFilterForm.controls['secondaryOperator'].value).toEqual(
        ComparisonOperator.LessThanOrEqualTo
      );
      expect(this.component.generalFilterForm.controls['secondaryValue'].value).toEqual(700);
      expect(this.component.generalFilterForm.controls['secondaryUnit'].value).toEqual(Unit.KB);
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
        'span[data-test-id=logical-operator]'
      );

      expect(logicalOperatorLabel).toBeTruthy();
      expect(logicalOperatorLabel.innerText.trim()).toEqual('And');
    });

    it('which is OR is displayed correctly', function (this: ThisTest) {
      singleConditionStringProperty.logicalOperator = LogicalOperator.Or;
      this.component.filterProperty = singleConditionStringProperty;
      this.fixture.detectChanges();
      const addConditionButton = this.fixture.debugElement.nativeElement.querySelector(addButtonSelector);
      addConditionButton.click();
      this.fixture.detectChanges();
      const logicalOperatorLabel = this.fixture.debugElement.nativeElement.querySelector(
        'span[data-test-id=logical-operator]'
      );

      expect(logicalOperatorLabel).toBeTruthy();
      expect(logicalOperatorLabel.innerText.trim()).toEqual('Or');
    });
  });
});

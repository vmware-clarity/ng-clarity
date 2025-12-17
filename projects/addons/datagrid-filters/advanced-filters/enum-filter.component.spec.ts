/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrCheckboxModule, ClrRadioModule } from '@clr/angular';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { EnumFilterComponent } from './enum-filter.component';
import { FilterFormComponent } from './filter-form.component';
import { ComparisonOperator, LogicalOperator } from '../model/datagrid-filters.enums';
import { EnumPropertyDefinition, PropertyFilter, PropertyPredicate } from '../model/datagrid-filters.interfaces';

const selectAllCheckBoxSelector = 'input[formControlName=selectAll]';

const property = 'vmStatus';
const propertyDisplayName = 'Status';
const values = { red: 'Alert', green: 'Normal' };
const enumProperty: EnumPropertyDefinition = new EnumPropertyDefinition(
  property,
  propertyDisplayName,
  new Map(Object.entries(values))
);
const singleSelectEnumProperty: EnumPropertyDefinition = new EnumPropertyDefinition(
  property,
  propertyDisplayName,
  new Map(Object.entries(values)),
  true
);

const predicate1 = new PropertyPredicate();
predicate1.filterableProperty = enumProperty;
predicate1.operator = ComparisonOperator.Equals;
predicate1.value = 'red';

const predicate2 = new PropertyPredicate();
predicate2.filterableProperty = enumProperty;
predicate2.operator = ComparisonOperator.Equals;
predicate2.value = 'green';

const predicate3 = new PropertyPredicate();
predicate3.filterableProperty = singleSelectEnumProperty;
predicate3.operator = ComparisonOperator.Equals;
predicate3.value = 'green';

const propertyFilter: PropertyFilter = new PropertyFilter();
propertyFilter.criteria = [predicate1, predicate2];
propertyFilter.operator = LogicalOperator.Or;

const singlePredicatePropertyFilter: PropertyFilter = new PropertyFilter();
singlePredicatePropertyFilter.criteria = [predicate3];
singlePredicatePropertyFilter.operator = LogicalOperator.Or;

export interface ThisTest {
  fixture: ComponentFixture<EnumFilterComponent>;
  component: EnumFilterComponent;
}

describe('EnumFilterComponent', () => {
  beforeEach(function (this: ThisTest) {
    TestBed.configureTestingModule({
      imports: [ClrCheckboxModule, ClrRadioModule, CommonModule, FormsModule, ReactiveFormsModule],
      declarations: [EnumFilterComponent, FilterFormComponent],
      providers: [DatagridFiltersStrings],
    });
    this.fixture = TestBed.createComponent(EnumFilterComponent);
    this.component = this.fixture.componentInstance;
    this.component.filterProperty = enumProperty;
  });

  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });
  describe('in normal mode', () => {
    describe('with multi selection', (): void => {
      beforeEach(function (this: ThisTest) {
        this.component.ngOnChanges();
        this.fixture.detectChanges();
      });
      it('is properly initialized', function (this: ThisTest) {
        expect(this.component).toBeTruthy();
        expect(this.component.optionsData.length).toEqual(2);
        expect(this.component.optionsData[0].key).toEqual('red');
        expect(this.component.optionsData[0].value).toEqual('Alert');
        expect(this.component.optionsData[1].key).toEqual('green');
        expect(this.component.optionsData[1].value).toEqual('Normal');

        expect(this.component.enumFilterForm.controls['selectAll'].value).toEqual(false);
        expect(this.component.optionsFormArray.length).toEqual(2);
        expect(this.component.optionsFormArray.controls[0].value).toEqual(false);
        expect(this.component.optionsFormArray.controls[1].value).toEqual(false);

        expect(this.component.enumFilterForm.valid).toBeFalsy();
        expect(this.component['selectedFilterCriteria'].operator).toEqual(LogicalOperator.Or);
      });
      it('selecting an option works as expected', function (this: ThisTest) {
        const enumValuesCheckBoxes = this.fixture.debugElement.nativeElement.querySelectorAll('input[type=checkbox]');
        expect(enumValuesCheckBoxes.length).toEqual(3);

        enumValuesCheckBoxes[1].click();
        this.fixture.detectChanges();
        expect(this.component.optionsFormArray.controls[0].value).toEqual(true);
        expect(this.component.optionsFormArray.controls[1].value).toEqual(false);
        expect(this.component.enumFilterForm.controls.selectAll.value).toEqual(false);

        enumValuesCheckBoxes[2].click();
        this.fixture.detectChanges();
        expect(this.component.optionsFormArray.controls[0].value).toEqual(true);
        expect(this.component.optionsFormArray.controls[1].value).toEqual(true);
        expect(this.component.enumFilterForm.controls.selectAll.value).toEqual(true);

        enumValuesCheckBoxes[1].click();
        this.fixture.detectChanges();
        expect(this.component.optionsFormArray.controls[0].value).toEqual(false);
        expect(this.component.optionsFormArray.controls[1].value).toEqual(true);
        expect(this.component.enumFilterForm.controls.selectAll.value).toEqual(false);
      });
      it('select all works as expected', function (this: ThisTest) {
        const selectAllCheckBox = this.fixture.debugElement.nativeElement.querySelector(selectAllCheckBoxSelector);
        expect(selectAllCheckBox).toBeTruthy();

        selectAllCheckBox.click();
        this.fixture.detectChanges();
        expect(this.component.optionsFormArray.controls[0].value).toEqual(true);
        expect(this.component.optionsFormArray.controls[1].value).toEqual(true);

        selectAllCheckBox.click();
        this.fixture.detectChanges();
        this.fixture.detectChanges();
        expect(this.component.optionsFormArray.controls[0].value).toEqual(false);
        expect(this.component.optionsFormArray.controls[1].value).toEqual(false);
      });
      it('emits a property filter event on submit', function (this: ThisTest) {
        spyOn(this.component.filterCriteriaChange, 'emit');
        const submitButton = this.fixture.debugElement.nativeElement.querySelector('button[data-test-id=submitBtn]');
        expect(submitButton).toBeTruthy();
        expect(submitButton.disabled).toBeTruthy();
        expect(this.component.enumFilterForm.valid).toBeFalsy();

        const selectAllCheckBox = this.fixture.debugElement.nativeElement.querySelector(selectAllCheckBoxSelector);
        expect(selectAllCheckBox).toBeTruthy();

        selectAllCheckBox.click();
        this.fixture.detectChanges();
        expect(submitButton.disabled).toBeFalsy();
        expect(this.component.enumFilterForm.valid).toBeTruthy();

        submitButton.click();
        this.fixture.detectChanges();
        expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
        expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(propertyFilter);
      });
    });
    describe('with single selection', (): void => {
      beforeEach(function (this: ThisTest) {
        this.component.filterProperty = singleSelectEnumProperty;
        this.component.ngOnChanges();
        this.fixture.detectChanges();
      });
      it('is properly initialized', function (this: ThisTest) {
        expect(this.component.enumFilterForm.controls.singleSelectOption.value).toEqual('red');
        expect(this.component.enumFilterForm.valid).toBeTruthy();
        expect(this.component['selectedFilterCriteria'].operator).toEqual(LogicalOperator.Or);
      });
      it('selecting an option works as expected', function (this: ThisTest) {
        const enumValuesRadioButtons = this.fixture.debugElement.nativeElement.querySelectorAll('input[type=radio]');
        expect(enumValuesRadioButtons.length).toEqual(2);

        enumValuesRadioButtons[0].click();
        this.fixture.detectChanges();
        expect(this.component.enumFilterForm.controls.singleSelectOption.value).toEqual('red');

        enumValuesRadioButtons[1].click();
        this.fixture.detectChanges();
        expect(this.component.enumFilterForm.controls.singleSelectOption.value).toEqual('green');
      });
      it('emits a property filter event on submit', function (this: ThisTest) {
        spyOn(this.component.filterCriteriaChange, 'emit');

        const enumValuesRadioButtons = this.fixture.debugElement.nativeElement.querySelectorAll('input[type=radio]');
        enumValuesRadioButtons[1].click();
        this.fixture.detectChanges();

        const submitButton = this.fixture.debugElement.nativeElement.querySelector('button[data-test-id=submitBtn]');
        expect(submitButton).toBeTruthy();
        expect(submitButton.disabled).toBeFalsy();
        expect(this.component.enumFilterForm.valid).toBeTruthy();

        const selectAllCheckBox = this.fixture.debugElement.nativeElement.querySelector(selectAllCheckBoxSelector);
        expect(selectAllCheckBox).toBeNull();

        submitButton.click();
        this.fixture.detectChanges();
        expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledTimes(1);
        expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(singlePredicatePropertyFilter);
      });
    });
    it('updates data on enum property change', function (this: ThisTest) {
      const newValues = { orange: 'Warning', white: 'NoStatus', purple: 'Dangerous' };
      const updatedProperty: EnumPropertyDefinition = new EnumPropertyDefinition(
        property,
        propertyDisplayName,
        new Map(Object.entries(newValues))
      );
      this.component.filterProperty = updatedProperty;
      this.component.ngOnChanges();
      expect(this.component.optionsData.length).toEqual(3);
      expect(this.component.optionsData[0].key).toEqual('orange');
      expect(this.component.optionsData[0].value).toEqual('Warning');
      expect(this.component.optionsData[1].key).toEqual('white');
      expect(this.component.optionsData[1].value).toEqual('NoStatus');
      expect(this.component.optionsData[2].key).toEqual('purple');
      expect(this.component.optionsData[2].value).toEqual('Dangerous');
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
  });

  describe('in edit mode', () => {
    it('is properly initialized with multi selection', function (this: ThisTest) {
      this.component.propertyFilter = propertyFilter;
      this.component.ngOnChanges();
      this.fixture.detectChanges();
      expect(this.component.optionsFormArray.controls[0].value).toEqual(true);
      expect(this.component.optionsFormArray.controls[1].value).toEqual(true);
    });
    it('is properly initialized with single selection', function (this: ThisTest) {
      this.component.filterProperty = singleSelectEnumProperty;
      this.component.propertyFilter = singlePredicatePropertyFilter;
      this.component.ngOnChanges();
      this.fixture.detectChanges();
      expect(this.component.enumFilterForm.controls.singleSelectOption.value).toEqual('green');
    });
  });
});

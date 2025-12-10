/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrIcon, ClrInputModule, ClrRadioModule, ClrSelectModule, ClrSignpostModule } from '@clr/angular';

import { FilterFormComponent } from '../advanced-filters/filter-form.component';
import { GeneralFilterComponent } from '../advanced-filters/general-filter.component';
import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { DismissableDirective } from './dismissable.directive';
import { ManageFilterComponent } from './manage-filter.component';
import { ComparisonOperator, LogicalOperator, PropertyType, TimeSpan, Unit } from '../model/datagrid-filters.enums';
import {
  DateTimePropertyDefinition,
  EnumPropertyDefinition,
  NumericPropertyDefinition,
  PropertyFilter,
  PropertyPredicate,
  StringPropertyDefinition,
} from '../model/datagrid-filters.interfaces';

const stringPropertyName = 'vmName';
const stringPropertyDisplayName = 'Name';
const comparisonOperators = [ComparisonOperator.Equals, ComparisonOperator.Contains, ComparisonOperator.IsEmpty];
const stringProperty: StringPropertyDefinition = new StringPropertyDefinition(
  stringPropertyName,
  stringPropertyDisplayName,
  comparisonOperators
);
const stringPredicate1 = new PropertyPredicate();
stringPredicate1.filterableProperty = stringProperty;
stringPredicate1.operator = ComparisonOperator.Equals;
stringPredicate1.value = 'vm 1';

const stringPredicate2 = new PropertyPredicate();
stringPredicate2.filterableProperty = stringProperty;
stringPredicate2.operator = ComparisonOperator.IsEmpty;

const stringPropertyFilter: PropertyFilter = new PropertyFilter();
stringPropertyFilter.criteria = [stringPredicate1, stringPredicate2];
stringPropertyFilter.operator = LogicalOperator.And;

const enumPropertyName = 'vmStatus';
const enumPropertyDisplayName = 'Status';
const values = { red: 'Alert', green: 'Normal' };
const enumProperty: EnumPropertyDefinition = new EnumPropertyDefinition(
  enumPropertyName,
  enumPropertyDisplayName,
  new Map(Object.entries(values))
);

const enumPredicate1 = new PropertyPredicate();
enumPredicate1.filterableProperty = enumProperty;
enumPredicate1.operator = ComparisonOperator.Equals;
enumPredicate1.value = 'red';

const enumPredicate2 = new PropertyPredicate();
enumPredicate2.filterableProperty = enumProperty;
enumPredicate2.operator = ComparisonOperator.Equals;
enumPredicate2.value = 'green';

const enumPropertyFilter: PropertyFilter = new PropertyFilter();
enumPropertyFilter.criteria = [enumPredicate1, enumPredicate2];
enumPropertyFilter.operator = LogicalOperator.Or;

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
numericProperty.selectedValue = [176, 50];
numericProperty.selectedUnit = [Unit.MB, Unit.GB];

const numericPredicate1 = new PropertyPredicate();
numericPredicate1.filterableProperty = numericProperty;
numericPredicate1.operator = ComparisonOperator.Equals;
numericPredicate1.value = 176;

const numericPredicate2 = new PropertyPredicate();
numericPredicate2.filterableProperty = numericProperty;
numericPredicate2.operator = ComparisonOperator.GreaterThan;

const numericPropertyFilter: PropertyFilter = new PropertyFilter();
numericPropertyFilter.criteria = [numericPredicate1, numericPredicate2];
numericPropertyFilter.operator = LogicalOperator.Or;

const dateTimePropertyName = 'lastUpdated';
const dateTimePropertyDisplayName = 'Last Updated';
const dateTimeProperty: DateTimePropertyDefinition = new DateTimePropertyDefinition(
  dateTimePropertyName,
  dateTimePropertyDisplayName
);
dateTimeProperty.selectedOperator = ComparisonOperator.BeforeOrEqualTo;
dateTimeProperty.selectedValue = '2023-02-02T13:23';

const dateTimePredicate1 = new PropertyPredicate();
dateTimePredicate1.filterableProperty = dateTimeProperty;
dateTimePredicate1.operator = ComparisonOperator.LessThan;
dateTimePredicate1.value = '2023-02-02T13:24+03:00';

const dateTimePropertyFilter: PropertyFilter = new PropertyFilter();
dateTimePropertyFilter.criteria = [dateTimePredicate1];
dateTimePropertyFilter.operator = LogicalOperator.And;

const removeFilterSelector = '.remove-filter';

export interface ThisTest {
  fixture: ComponentFixture<ManageFilterComponent>;
  component: ManageFilterComponent;
}

describe('ManageFilterComponent', () => {
  beforeEach(function (this: ThisTest) {
    TestBed.configureTestingModule({
      imports: [
        ClrInputModule,
        ClrRadioModule,
        ClrSignpostModule,
        ClrSelectModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClrIcon,
      ],
      declarations: [DismissableDirective, FilterFormComponent, ManageFilterComponent, GeneralFilterComponent],
      providers: [DatagridFiltersStrings],
    });
    this.fixture = TestBed.createComponent(ManageFilterComponent);
    this.component = this.fixture.componentInstance;
  });

  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });
  it('manages string property filter', function (this: ThisTest) {
    spyOn(this.component.filterStrings, 'getConjoinerDisplayName');
    this.component.propertyFilter = stringPropertyFilter;
    stringPropertyFilter.criteria = [stringPredicate1, stringPredicate2];
    this.fixture.detectChanges();
    expect(this.component.managedProperty).toEqual(stringProperty);
    expect(this.component.managedPropertyType).toEqual(PropertyType.String);
    expect(this.component.stringProperty).toEqual(stringProperty);
    expect(this.component.primaryConditionDisplayText).toEqual('Equals: vm 1');
    expect(this.component.secondaryConditionDisplayText).toEqual('Is empty');
    expect(this.component.filterStrings.getConjoinerDisplayName).toHaveBeenCalledWith(stringPropertyFilter.operator);

    const editFilterSignpostTrigger: HTMLSpanElement[] =
      this.fixture.debugElement.nativeElement.querySelectorAll('.edit-filter');
    expect(editFilterSignpostTrigger.length).toEqual(2);

    editFilterSignpostTrigger[0].click();
    this.fixture.detectChanges();
    expect(this.component.openPrimaryConditionSignPost).toBeTruthy();
    editFilterSignpostTrigger[1].click();
    this.fixture.detectChanges();
    expect(this.component.openSecondaryConditionSignPost).toBeTruthy();
  });
  it('manages enum property filter', function (this: ThisTest) {
    this.component.propertyFilter = enumPropertyFilter;
    this.fixture.detectChanges();
    expect(this.component.managedProperty).toEqual(enumProperty);
    expect(this.component.managedPropertyType).toEqual(PropertyType.Enum);
    expect(this.component.enumProperty).toEqual(enumProperty);
    expect(this.component.primaryConditionDisplayText).toEqual('Equals: Alert');
    expect(this.component.secondaryConditionDisplayText).toEqual('Equals: Normal');
  });
  it('manages numeric property filter', function (this: ThisTest) {
    spyOn(this.component.filterStrings, 'getConjoinerDisplayName');
    this.component.propertyFilter = numericPropertyFilter;
    numericPropertyFilter.criteria = [numericPredicate1, numericPredicate2];
    numericProperty.selectedValue = [176, 50];
    numericProperty.selectedUnit = [Unit.MB, Unit.GB];
    this.fixture.detectChanges();
    expect(this.component.managedProperty).toEqual(numericProperty);
    expect(this.component.managedPropertyType).toEqual(PropertyType.Numeric);
    expect(this.component.numericProperty).toEqual(numericProperty);
    expect(this.component.primaryConditionDisplayText).toEqual('Equals: 176 MB');
    expect(this.component.secondaryConditionDisplayText).toEqual('Greater than: 50 GB');
    expect(this.component.filterStrings.getConjoinerDisplayName).toHaveBeenCalledWith(numericPropertyFilter.operator);
  });
  it('removes string property filter', function (this: ThisTest) {
    spyOn(this.component.filterCriteriaChange, 'emit');
    this.component.propertyFilter = stringPropertyFilter;
    stringPropertyFilter.criteria = [stringPredicate1, stringPredicate2];
    this.fixture.detectChanges();
    let removeFilterIcon: HTMLElement[] =
      this.fixture.debugElement.nativeElement.querySelectorAll(removeFilterSelector);
    expect(removeFilterIcon.length).toEqual(2);

    const modifiedPropertyFilter = new PropertyFilter();
    modifiedPropertyFilter.criteria = [stringPredicate2];
    modifiedPropertyFilter.operator = LogicalOperator.And;
    removeFilterIcon[0].click();
    this.fixture.detectChanges();
    expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(modifiedPropertyFilter);

    modifiedPropertyFilter.criteria = [];
    removeFilterIcon = this.fixture.debugElement.nativeElement.querySelectorAll(removeFilterSelector);
    expect(removeFilterIcon.length).toEqual(1);
    removeFilterIcon[0].click();
    this.fixture.detectChanges();
    expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(modifiedPropertyFilter);
  });
  it('removes numeric property filter', function (this: ThisTest) {
    spyOn(this.component.filterCriteriaChange, 'emit');
    this.component.propertyFilter = numericPropertyFilter;
    numericPropertyFilter.criteria = [numericPredicate1, numericPredicate2];
    this.fixture.detectChanges();
    const removeFilterIcon: HTMLElement[] =
      this.fixture.debugElement.nativeElement.querySelectorAll(removeFilterSelector);
    expect(removeFilterIcon.length).toEqual(2);

    const modifiedPropertyFilter = new PropertyFilter();
    modifiedPropertyFilter.criteria = [numericPredicate2];
    modifiedPropertyFilter.operator = LogicalOperator.Or;
    removeFilterIcon[0].click();
    this.fixture.detectChanges();
    expect(numericProperty.selectedValue).toEqual([50]);
    expect(numericProperty.selectedUnit).toEqual([Unit.GB]);
    expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(modifiedPropertyFilter);

    removeFilterIcon[0].click();
    this.fixture.detectChanges();
    modifiedPropertyFilter.criteria = [];
    expect(this.component.filterCriteriaChange.emit).toHaveBeenCalledWith(modifiedPropertyFilter);
  });
  it('manages date-time property filter normal operator', function (this: ThisTest) {
    this.component.propertyFilter = dateTimePropertyFilter;
    dateTimeProperty.selectedOperator = ComparisonOperator.BeforeOrEqualTo;
    dateTimeProperty.selectedValue = '2023-02-02T13:23';
    this.fixture.detectChanges();
    expect(this.component.managedProperty).toEqual(dateTimeProperty);
    expect(this.component.managedPropertyType).toEqual(PropertyType.DateTime);
    expect(this.component.dateTimeProperty).toEqual(dateTimeProperty);

    expect(this.component.primaryConditionDisplayText).toEqual('Before or equal to: 2023-02-02 13:23');
  });
  it('manages date-time property filter custom range operator', function (this: ThisTest) {
    dateTimeProperty.selectedOperator = ComparisonOperator.CustomRange;
    dateTimeProperty.selectedValueTo = '2023-02-07T13:28';
    this.component.propertyFilter = dateTimePropertyFilter;
    this.fixture.detectChanges();

    expect(this.component.primaryConditionDisplayText).toEqual('' + 'From: 2023-02-02 13:23 ' + 'To: 2023-02-07 13:28');
  });
  it('manages date-time property filter relative operator', function (this: ThisTest) {
    dateTimeProperty.selectedOperator = ComparisonOperator.LastYear;
    this.component.propertyFilter = dateTimePropertyFilter;
    this.fixture.detectChanges();

    expect(this.component.primaryConditionDisplayText).toEqual('Last year');
  });
  it('manages date-time property filter time span operator', function (this: ThisTest) {
    dateTimeProperty.selectedOperator = ComparisonOperator.TimeSpan;
    dateTimeProperty.selectedTimeSpanValue = '300';
    dateTimeProperty.selectedTimeSpan = TimeSpan.Weeks;
    this.component.propertyFilter = dateTimePropertyFilter;
    this.fixture.detectChanges();

    expect(this.component.primaryConditionDisplayText).toEqual('Time span: 300 Weeks');
  });
});

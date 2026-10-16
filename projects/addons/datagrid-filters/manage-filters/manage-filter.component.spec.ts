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
import { ClrSignpostModule } from '@clr/angular/popover/signpost';

import { DismissableDirective } from './dismissable.directive';
import { ManageFilterComponent } from './manage-filter.component';
import { FilterFormComponent } from '../advanced-filters/filter-form.component';
import { GeneralFilterComponent } from '../advanced-filters/general-filter.component';
import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
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
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
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
    testContext.fixture = TestBed.createComponent(ManageFilterComponent);
    testContext.component = testContext.fixture.componentInstance;
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });
  it('manages string property filter', () => {
    spyOn(testContext.component.filterStrings, 'getConjoinerDisplayName');
    testContext.component.propertyFilter = stringPropertyFilter;
    stringPropertyFilter.criteria = [stringPredicate1, stringPredicate2];
    testContext.fixture.detectChanges();
    expect(testContext.component.managedProperty).toEqual(stringProperty);
    expect(testContext.component.managedPropertyType).toEqual(PropertyType.String);
    expect(testContext.component.stringProperty).toEqual(stringProperty);
    expect(testContext.component.primaryConditionDisplayText).toEqual('Equals: vm 1');
    expect(testContext.component.secondaryConditionDisplayText).toEqual('Is empty');
    expect(testContext.component.filterStrings.getConjoinerDisplayName).toHaveBeenCalledWith(
      stringPropertyFilter.operator
    );

    const editFilterSignpostTrigger: HTMLSpanElement[] =
      testContext.fixture.debugElement.nativeElement.querySelectorAll('.edit-filter');
    expect(editFilterSignpostTrigger.length).toEqual(2);

    editFilterSignpostTrigger[0].click();
    testContext.fixture.detectChanges();
    expect(testContext.component.openPrimaryConditionSignPost).toBeTruthy();
    editFilterSignpostTrigger[1].click();
    testContext.fixture.detectChanges();
    expect(testContext.component.openSecondaryConditionSignPost).toBeTruthy();
  });
  it('manages enum property filter', () => {
    testContext.component.propertyFilter = enumPropertyFilter;
    testContext.fixture.detectChanges();
    expect(testContext.component.managedProperty).toEqual(enumProperty);
    expect(testContext.component.managedPropertyType).toEqual(PropertyType.Enum);
    expect(testContext.component.enumProperty).toEqual(enumProperty);
    expect(testContext.component.primaryConditionDisplayText).toEqual('Equals: Alert');
    expect(testContext.component.secondaryConditionDisplayText).toEqual('Equals: Normal');
  });
  it('manages numeric property filter', () => {
    spyOn(testContext.component.filterStrings, 'getConjoinerDisplayName');
    testContext.component.propertyFilter = numericPropertyFilter;
    numericPropertyFilter.criteria = [numericPredicate1, numericPredicate2];
    numericProperty.selectedValue = [176, 50];
    numericProperty.selectedUnit = [Unit.MB, Unit.GB];
    testContext.fixture.detectChanges();
    expect(testContext.component.managedProperty).toEqual(numericProperty);
    expect(testContext.component.managedPropertyType).toEqual(PropertyType.Numeric);
    expect(testContext.component.numericProperty).toEqual(numericProperty);
    expect(testContext.component.primaryConditionDisplayText).toEqual('Equals: 176 MB');
    expect(testContext.component.secondaryConditionDisplayText).toEqual('Greater than: 50 GB');
    expect(testContext.component.filterStrings.getConjoinerDisplayName).toHaveBeenCalledWith(
      numericPropertyFilter.operator
    );
  });
  it('renders the remove filter icons with their SVG content', () => {
    testContext.component.propertyFilter = stringPropertyFilter;
    stringPropertyFilter.criteria = [stringPredicate1, stringPredicate2];
    testContext.fixture.detectChanges();
    const removeFilterIcons: NodeListOf<HTMLElement> =
      testContext.fixture.debugElement.nativeElement.querySelectorAll(removeFilterSelector);
    expect(removeFilterIcons.length).toEqual(2);
    removeFilterIcons.forEach(icon => {
      expect(icon.tagName.toLowerCase()).toEqual('cds-icon');
      expect(icon.getAttribute('shape')).toEqual('window-close');
      expect(icon.closest('.badge')).toBeTruthy();
      const svg = (icon.shadowRoot ?? icon).querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg.innerHTML).toContain('path');
    });
  });
  it('removes string property filter', () => {
    spyOn(testContext.component.filterCriteriaChange, 'emit');
    testContext.component.propertyFilter = stringPropertyFilter;
    stringPropertyFilter.criteria = [stringPredicate1, stringPredicate2];
    testContext.fixture.detectChanges();
    let removeFilterIcon: HTMLElement[] =
      testContext.fixture.debugElement.nativeElement.querySelectorAll(removeFilterSelector);
    expect(removeFilterIcon.length).toEqual(2);

    const modifiedPropertyFilter = new PropertyFilter();
    modifiedPropertyFilter.criteria = [stringPredicate2];
    modifiedPropertyFilter.operator = LogicalOperator.And;
    removeFilterIcon[0].click();
    testContext.fixture.detectChanges();
    expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(modifiedPropertyFilter);

    modifiedPropertyFilter.criteria = [];
    removeFilterIcon = testContext.fixture.debugElement.nativeElement.querySelectorAll(removeFilterSelector);
    expect(removeFilterIcon.length).toEqual(1);
    removeFilterIcon[0].click();
    testContext.fixture.detectChanges();
    expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(modifiedPropertyFilter);
  });
  it('removes numeric property filter', () => {
    spyOn(testContext.component.filterCriteriaChange, 'emit');
    testContext.component.propertyFilter = numericPropertyFilter;
    numericPropertyFilter.criteria = [numericPredicate1, numericPredicate2];
    testContext.fixture.detectChanges();
    const removeFilterIcon: HTMLElement[] =
      testContext.fixture.debugElement.nativeElement.querySelectorAll(removeFilterSelector);
    expect(removeFilterIcon.length).toEqual(2);

    const modifiedPropertyFilter = new PropertyFilter();
    modifiedPropertyFilter.criteria = [numericPredicate2];
    modifiedPropertyFilter.operator = LogicalOperator.Or;
    removeFilterIcon[0].click();
    testContext.fixture.detectChanges();
    expect(numericProperty.selectedValue).toEqual([50]);
    expect(numericProperty.selectedUnit).toEqual([Unit.GB]);
    expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(modifiedPropertyFilter);

    removeFilterIcon[0].click();
    testContext.fixture.detectChanges();
    modifiedPropertyFilter.criteria = [];
    expect(testContext.component.filterCriteriaChange.emit).toHaveBeenCalledWith(modifiedPropertyFilter);
  });
  it('manages date-time property filter normal operator', () => {
    testContext.component.propertyFilter = dateTimePropertyFilter;
    dateTimeProperty.selectedOperator = ComparisonOperator.BeforeOrEqualTo;
    dateTimeProperty.selectedValue = '2023-02-02T13:23';
    testContext.fixture.detectChanges();
    expect(testContext.component.managedProperty).toEqual(dateTimeProperty);
    expect(testContext.component.managedPropertyType).toEqual(PropertyType.DateTime);
    expect(testContext.component.dateTimeProperty).toEqual(dateTimeProperty);

    expect(testContext.component.primaryConditionDisplayText).toEqual('Before or equal to: 2023-02-02 13:23');
  });
  it('manages date-time property filter custom range operator', () => {
    dateTimeProperty.selectedOperator = ComparisonOperator.CustomRange;
    dateTimeProperty.selectedValueTo = '2023-02-07T13:28';
    testContext.component.propertyFilter = dateTimePropertyFilter;
    testContext.fixture.detectChanges();

    expect(testContext.component.primaryConditionDisplayText).toEqual(
      '' + 'From: 2023-02-02 13:23 ' + 'To: 2023-02-07 13:28'
    );
  });
  it('manages date-time property filter relative operator', () => {
    dateTimeProperty.selectedOperator = ComparisonOperator.LastYear;
    testContext.component.propertyFilter = dateTimePropertyFilter;
    testContext.fixture.detectChanges();

    expect(testContext.component.primaryConditionDisplayText).toEqual('Last year');
  });
  it('manages date-time property filter time span operator', () => {
    dateTimeProperty.selectedOperator = ComparisonOperator.TimeSpan;
    dateTimeProperty.selectedTimeSpanValue = '300';
    dateTimeProperty.selectedTimeSpan = TimeSpan.Weeks;
    testContext.component.propertyFilter = dateTimePropertyFilter;
    testContext.fixture.detectChanges();

    expect(testContext.component.primaryConditionDisplayText).toEqual('Time span: 300 Weeks');
  });
});

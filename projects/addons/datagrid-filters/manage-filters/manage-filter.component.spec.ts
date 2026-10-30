/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFilterComponent } from './manage-filter.component';
import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { AppfxDatagridFiltersModule } from '../datagrid-filters.module';
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

export interface ThisTest {
  fixture: ComponentFixture<ManageFilterComponent>;
  component: ManageFilterComponent;
}

describe('ManageFilterComponent', () => {
  beforeEach(function (this: ThisTest) {
    TestBed.configureTestingModule({
      imports: [AppfxDatagridFiltersModule],
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

    const trigger: HTMLButtonElement = this.fixture.nativeElement.querySelector('.filter-pill');
    expect(trigger.textContent).toContain('vm 1');
    expect(trigger.textContent).toContain('+1');
    trigger.click();
    this.fixture.detectChanges();
    expect(this.component.open).toBeTrue();
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
  it('shows the field name without an active style or count when empty', function (this: ThisTest) {
    this.component.filterProperty = stringProperty;
    this.component.predefined = true;
    this.fixture.detectChanges();
    const trigger: HTMLButtonElement = this.fixture.nativeElement.querySelector('.filter-pill');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.closest('clr-label').classList.contains('label-info')).toBeFalse();
    expect(trigger.textContent.trim()).toBe(stringProperty.displayName);
    expect(trigger.classList.contains('filter-pill-active')).toBeFalse();
    expect(trigger.querySelector('.filter-pill-count')).toBeNull();
    expect(trigger.querySelector('cds-icon').getAttribute('direction')).toBe('down');
  });

  it('shows the first value and counts all additional selections', function (this: ThisTest) {
    this.component.propertyFilter = {
      operator: LogicalOperator.Or,
      criteria: [enumPredicate1, enumPredicate2, enumPredicate2, enumPredicate2],
    };
    this.fixture.detectChanges();
    const trigger: HTMLButtonElement = this.fixture.nativeElement.querySelector('.filter-pill');
    expect(trigger.classList.contains('filter-pill-active')).toBeTrue();
    expect(trigger.closest('clr-label').classList.contains('label-info')).toBeTrue();
    expect(trigger.querySelector('clr-badge').textContent).toBe('+3');
    expect(trigger.querySelector('.filter-pill-text').textContent).toBe('Alert');
    expect(trigger.querySelector('.filter-pill-count').textContent).toBe('+3');
    expect(trigger.getAttribute('aria-label')).toContain('Equals: Normal');
  });

  it('keeps exclusion operators in the pill text', function (this: ThisTest) {
    this.component.propertyFilter = {
      operator: LogicalOperator.And,
      criteria: [{ ...enumPredicate1, operator: ComparisonOperator.DoesNotEqual }],
    };
    this.fixture.detectChanges();
    expect(this.component.pillText).toBe('Does not equal: Alert');
  });

  it('updates an existing pill when its criteria are replaced or cleared', function (this: ThisTest) {
    this.fixture.componentRef.setInput('filterProperty', stringProperty);
    this.fixture.componentRef.setInput('propertyFilter', stringPropertyFilter);
    this.fixture.detectChanges();
    const trigger = this.fixture.nativeElement.querySelector('.filter-pill');
    this.fixture.componentRef.setInput('propertyFilter', {
      operator: LogicalOperator.And,
      criteria: [{ ...stringPredicate1, value: 'new name' }],
    });
    this.fixture.detectChanges();
    expect(trigger.textContent.trim()).toBe('new name');
    this.fixture.componentRef.setInput('propertyFilter', undefined);
    this.fixture.detectChanges();
    expect(trigger.textContent.trim()).toBe(stringProperty.displayName);
    expect(trigger.classList.contains('filter-pill-active')).toBeFalse();
  });

  it('clears a predefined filter from the popover without mutating its defaults', async function (this: ThisTest) {
    this.component.propertyFilter = stringPropertyFilter;
    this.component.predefined = true;
    spyOn(this.component.filterRemoved, 'emit');
    this.fixture.detectChanges();
    const trigger: HTMLButtonElement = this.fixture.nativeElement.querySelector('.filter-pill');
    trigger.click();
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    this.fixture.detectChanges();
    const clear: HTMLButtonElement = document.querySelector('[data-test-id="clear-filter"]');
    expect(clear.textContent.trim()).toBe('Clear filter');
    clear.click();
    this.fixture.detectChanges();
    expect(this.component.filterRemoved.emit).toHaveBeenCalledTimes(1);
    expect(stringPropertyFilter.criteria).toEqual([stringPredicate1, stringPredicate2]);
    expect(this.component.open).toBeFalse();
    expect(document.activeElement).toBe(trigger);
  });

  it('offers removal for a user-added filter', async function (this: ThisTest) {
    this.component.propertyFilter = numericPropertyFilter;
    spyOn(this.component.filterRemoved, 'emit');
    this.fixture.detectChanges();
    this.fixture.nativeElement.querySelector('.filter-pill').click();
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    this.fixture.detectChanges();
    const remove: HTMLButtonElement = document.querySelector('[data-test-id="clear-filter"]');
    expect(remove.textContent.trim()).toBe(this.component.filterStrings.removeFilterText);
    remove.click();
    expect(this.component.filterRemoved.emit).toHaveBeenCalledTimes(1);
    expect(numericProperty.selectedValue).toEqual([176, 50]);
  });

  for (const dismiss of ['escape', 'outside', 'cancel']) {
    it('discards unapplied edits on ' + dismiss, async function (this: ThisTest) {
      this.component.propertyFilter = { operator: LogicalOperator.And, criteria: [stringPredicate1] };
      spyOn(this.component.filterCriteriaChange, 'emit');
      this.fixture.detectChanges();
      const trigger: HTMLButtonElement = this.fixture.nativeElement.querySelector('.filter-pill');
      trigger.click();
      this.fixture.detectChanges();
      await this.fixture.whenStable();
      this.fixture.detectChanges();
      const input: HTMLInputElement = document.querySelector('input[formControlName="primaryValue"]');
      input.value = 'unsaved';
      input.dispatchEvent(new Event('input'));
      if (dismiss === 'escape') {
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      } else if (dismiss === 'outside') {
        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      } else {
        document.querySelector<HTMLButtonElement>('[data-test-id="cancelBtn"]').click();
      }
      this.fixture.detectChanges();
      await this.fixture.whenStable();
      this.fixture.detectChanges();
      expect(this.component.open).toBeFalse();
      expect(this.component.propertyFilter.criteria[0].value).toBe('vm 1');
      expect(this.component.filterCriteriaChange.emit).not.toHaveBeenCalled();
    });
  }

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

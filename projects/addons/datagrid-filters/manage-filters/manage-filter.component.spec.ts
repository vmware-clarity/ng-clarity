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
numericPropertyFilter.editorState = { values: [176, 50], units: [Unit.MB, Unit.GB] };

const dateTimePropertyName = 'lastUpdated';
const dateTimePropertyDisplayName = 'Last Updated';
const dateTimeProperty: DateTimePropertyDefinition = new DateTimePropertyDefinition(
  dateTimePropertyName,
  dateTimePropertyDisplayName
);
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
  it('describes the pill with a clr-tooltip instead of a title', function (this: ThisTest) {
    this.component.propertyFilter = { operator: LogicalOperator.And, criteria: [stringPredicate1] };
    this.fixture.detectChanges();

    const trigger: HTMLButtonElement = this.fixture.nativeElement.querySelector('.filter-pill');
    expect(trigger.hasAttribute('title')).toBeFalse();
    expect(trigger.hasAttribute('clrTooltipTrigger')).toBeTrue();

    trigger.dispatchEvent(new Event('focus'));
    this.fixture.detectChanges();
    const tooltip = document.querySelector<HTMLElement>('.tooltip-content');
    expect(tooltip.textContent.trim()).toBe(this.component.editFilterAriaLabel);
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);

    trigger.click();
    this.fixture.detectChanges();
    expect(this.component.open).toBeTrue();
    expect(document.querySelector('.tooltip-content')).toBeNull();
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
  it('locks the field combobox while editing a pill', async function (this: ThisTest) {
    this.component.propertyFilter = { operator: LogicalOperator.And, criteria: [stringPredicate1] };
    this.fixture.detectChanges();
    this.fixture.nativeElement.querySelector('.filter-pill').click();
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    this.fixture.detectChanges();

    const input = document.querySelector<HTMLInputElement>('.filter-popover .clr-combobox-input');
    expect(input.value).toBe(stringProperty.displayName);
    expect(input.disabled).toBeTrue();
    expect(document.querySelector<HTMLButtonElement>('.filter-popover .clr-combobox-trigger').disabled).toBeTrue();
    expect(document.querySelector('.filter-form-actions [data-test-id="clear-filter"]')).not.toBeNull();
  });
  it('hides the field combobox for predefined pills', async function (this: ThisTest) {
    this.component.filterProperty = enumProperty;
    this.component.predefined = true;
    this.fixture.detectChanges();
    this.fixture.nativeElement.querySelector('.filter-pill').click();
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    this.fixture.detectChanges();

    expect(document.querySelector('.filter-popover')).toBeTruthy();
    expect(document.querySelector('.filter-popover clr-combobox')).toBeNull();
    expect(getComputedStyle(document.querySelector('.filter-popover .filter-field-row')).display).toBe('none');
  });
  it('shows a minimal enum editor for predefined pills', async function (this: ThisTest) {
    this.component.filterProperty = enumProperty;
    this.component.predefined = true;
    this.fixture.detectChanges();
    this.fixture.nativeElement.querySelector('.filter-pill').click();
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    this.fixture.detectChanges();

    const popover = document.querySelector('.filter-popover');
    expect(popover.classList).toContain('filter-popover-minimal');
    expect(popover.querySelector('.selection-counter')).toBeNull();
    expect(popover.textContent).not.toContain(this.component.filterStrings.valueLabel);
    expect(popover.querySelectorAll('input[type="checkbox"]').length).toBeGreaterThan(0);
    expect(popover.querySelector('.filter-options').hasAttribute('cds-layout')).toBeFalse();
    expect(popover.querySelector('.filter-options').classList).toContain('filter-options-minimal');
  });
  it('removes a user-added pill with its X button', function (this: ThisTest) {
    spyOn(this.component.filterRemoved, 'emit');
    this.component.propertyFilter = { operator: LogicalOperator.And, criteria: [stringPredicate1] };
    this.fixture.detectChanges();
    const remove: HTMLButtonElement = this.fixture.nativeElement.querySelector('[data-test-id="remove-pill"]');
    expect(remove.getAttribute('aria-label')).toBe(
      this.component.filterStrings.removeFilterText + ' ' + stringProperty.displayName
    );
    remove.click();
    expect(this.component.filterRemoved.emit).toHaveBeenCalled();
    expect(this.component.open).toBeFalse();
  });
  it('has no X button on predefined pills', function (this: ThisTest) {
    this.component.filterProperty = stringProperty;
    this.component.predefined = true;
    this.fixture.detectChanges();
    expect(this.fixture.nativeElement.querySelector('[data-test-id="remove-pill"]')).toBeNull();
  });
  it('makes the pill button the only click target', function (this: ThisTest) {
    this.component.propertyFilter = { operator: LogicalOperator.Or, criteria: [stringPredicate1, stringPredicate1] };
    this.fixture.detectChanges();
    const trigger: HTMLButtonElement = this.fixture.nativeElement.querySelector('.filter-pill');
    // Clicks on the text, badge or chevron must target the button, so Clarity sees one toggle element.
    for (const child of Array.from(trigger.children)) {
      expect(getComputedStyle(child).pointerEvents).toBe('none');
    }
  });
  it('manages numeric property filter', function (this: ThisTest) {
    spyOn(this.component.filterStrings, 'getConjoinerDisplayName');
    this.component.propertyFilter = numericPropertyFilter;
    numericPropertyFilter.criteria = [numericPredicate1, numericPredicate2];
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
    expect(trigger.querySelector('.filter-pill-text').textContent.trim()).toBe(
      `${enumProperty.displayName}: Equals Alert`
    );
    expect(trigger.querySelector('.filter-pill-count').textContent).toBe('+3');
    expect(trigger.getAttribute('aria-label')).toContain('Equals: Normal');
  });

  it('prefixes the pill text with the field name and condition', function (this: ThisTest) {
    this.component.propertyFilter = {
      operator: LogicalOperator.Or,
      criteria: [
        { ...stringPredicate1, operator: ComparisonOperator.Contains, value: 'linux' },
        { ...stringPredicate1, operator: ComparisonOperator.Contains, value: 'ubuntu' },
        { ...stringPredicate1, operator: ComparisonOperator.Contains, value: 'centos' },
      ],
    };
    this.fixture.detectChanges();
    const trigger: HTMLButtonElement = this.fixture.nativeElement.querySelector('.filter-pill');
    expect(trigger.querySelector('.filter-pill-text').textContent.trim()).toBe(
      `${stringProperty.displayName}: Contains linux`
    );
    expect(trigger.querySelector('.filter-pill-condition').textContent).toBe('Contains linux');
    expect(trigger.querySelector('.filter-pill-count').textContent).toBe('+2');
  });

  it('shows only the field name on an empty pill', function (this: ThisTest) {
    this.component.filterProperty = stringProperty;
    this.fixture.detectChanges();
    expect(this.component.pillText).toBe(stringProperty.displayName);
  });

  it('keeps exclusion operators in the pill text', function (this: ThisTest) {
    this.component.propertyFilter = {
      operator: LogicalOperator.And,
      criteria: [{ ...enumPredicate1, operator: ComparisonOperator.DoesNotEqual }],
    };
    this.fixture.detectChanges();
    expect(this.component.pillText).toBe(`${enumProperty.displayName}: Does not equal Alert`);
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
    expect(trigger.textContent.trim()).toBe(`${stringProperty.displayName}: Equals new name`);
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
    expect(numericProperty['selectedValue']).toBeUndefined();
  });

  it('edits four string conditions without dropping criteria or changing the count', async function (this: ThisTest) {
    const field = new StringPropertyDefinition('Name', 'name');
    const values = ['first', 'second', 'third', 'fourth'];
    const originalFilter: PropertyFilter = {
      operator: LogicalOperator.Or,
      criteria: values.map(value => ({ filterableProperty: field, operator: ComparisonOperator.Contains, value })),
    };
    this.component.propertyFilter = originalFilter;
    const emitted = spyOn(this.component.filterCriteriaChange, 'emit');
    this.fixture.detectChanges();
    const trigger: HTMLButtonElement = this.fixture.nativeElement.querySelector('.filter-pill');
    expect(trigger.querySelector('clr-badge').textContent).toBe('+3');
    for (const value of values) {
      expect(trigger.getAttribute('aria-label')).toContain(value);
    }
    trigger.click();
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    this.fixture.detectChanges();
    const inputs = document.querySelectorAll<HTMLInputElement>('.filter-condition-row input[formControlName="value"]');
    expect(Array.from(inputs, input => input.value)).toEqual(values);
    inputs[2].value = 'changed';
    inputs[2].dispatchEvent(new Event('input'));
    this.fixture.detectChanges();
    document.querySelector<HTMLButtonElement>('[data-test-id="submitBtn"]').click();
    this.fixture.detectChanges();
    const updated = emitted.calls.mostRecent().args[0];
    expect(updated.criteria.map(predicate => predicate.value)).toEqual(['first', 'second', 'changed', 'fourth']);
    expect(originalFilter.criteria.map(predicate => predicate.value)).toEqual(values);
    this.fixture.componentRef.setInput('propertyFilter', updated);
    this.fixture.detectChanges();
    expect(trigger.querySelector('clr-badge').textContent).toBe('+3');
  });

  it('summarizes and opens numeric presets without display metadata', async function (this: ThisTest) {
    const field = new NumericPropertyDefinition('Memory', 'memory', undefined, Unit.MB);
    const values = [0, 1024, 2048];
    this.component.propertyFilter = {
      operator: LogicalOperator.Or,
      criteria: values.map(value => ({ filterableProperty: field, operator: ComparisonOperator.Equals, value })),
    };
    this.fixture.detectChanges();
    const trigger: HTMLButtonElement = this.fixture.nativeElement.querySelector('.filter-pill');
    expect(trigger.querySelector('.filter-pill-text').textContent.trim()).toBe(`${field.displayName}: Equals 0 MB`);
    expect(trigger.querySelector('clr-badge').textContent).toBe('+2');
    for (const value of values) {
      expect(trigger.getAttribute('aria-label')).toContain(`${value} MB`);
    }
    trigger.click();
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    this.fixture.detectChanges();
    const inputs = document.querySelectorAll<HTMLInputElement>('.filter-condition-row input[formControlName="value"]');
    expect(Array.from(inputs, input => input.value)).toEqual(['0', '1024', '2048']);
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
      const input: HTMLInputElement = document.querySelector('input[formControlName="value"]');
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

  // Date-time pills read this filter's own editor state; the shared definition is never consulted (bug 10).
  const dateFilter = (editorState: PropertyFilter['editorState']): PropertyFilter => ({
    ...dateTimePropertyFilter,
    editorState,
  });

  it('manages date-time property filter normal operator', function (this: ThisTest) {
    this.component.propertyFilter = dateFilter({
      operator: ComparisonOperator.BeforeOrEqualTo,
      value: '2023-02-02T13:23',
    });
    this.fixture.detectChanges();
    expect(this.component.managedProperty).toEqual(dateTimeProperty);
    expect(this.component.managedPropertyType).toEqual(PropertyType.DateTime);
    expect(this.component.dateTimeProperty).toEqual(dateTimeProperty);

    // Angular formats times with a narrow no-break space before AM/PM.
    expect(this.component.primaryConditionDisplayText.replace(/\u202f/g, ' ')).toEqual(
      'Before or equal to: Feb 2, 2023 1:23 PM'
    );
  });
  it('manages date-time property filter custom range operator', function (this: ThisTest) {
    this.component.propertyFilter = dateFilter({
      operator: ComparisonOperator.CustomRange,
      value: '2023-02-02',
      valueTo: '2023-02-07',
    });
    this.fixture.detectChanges();

    expect(this.component.primaryConditionDisplayText).toEqual('From: Feb 2, 2023 To: Feb 7, 2023');
    expect(this.component.pillCondition).toEqual('From Feb 2, 2023 To Feb 7, 2023');
  });
  it('manages date-time property filter relative operator', function (this: ThisTest) {
    this.component.propertyFilter = dateFilter({ operator: ComparisonOperator.LastYear });
    this.fixture.detectChanges();

    expect(this.component.primaryConditionDisplayText).toEqual('Last year');
  });
  it('manages date-time property filter time span operator', function (this: ThisTest) {
    this.component.propertyFilter = dateFilter({
      operator: ComparisonOperator.TimeSpan,
      timeSpanValue: 300,
      timeSpan: TimeSpan.Weeks,
    });
    this.fixture.detectChanges();

    expect(this.component.primaryConditionDisplayText).toEqual('Time span: 300 Weeks');
  });
  it('does not change its text when another filter on the same definition changes (bug 10)', function (this: ThisTest) {
    this.component.propertyFilter = dateFilter({ operator: ComparisonOperator.LastWeek });
    this.fixture.detectChanges();
    // Another grid writing legacy editor fields onto the shared definition has no effect.
    dateTimeProperty['selectedOperator'] = ComparisonOperator.TimeSpan;
    this.component.ngOnChanges();
    expect(this.component.primaryConditionDisplayText).toEqual('Last week');
    delete dateTimeProperty['selectedOperator'];
  });
  it('describes a preset without editor state from its criteria (bug 9)', function (this: ThisTest) {
    this.component.propertyFilter = {
      operator: LogicalOperator.And,
      criteria: [{ filterableProperty: dateTimeProperty, operator: ComparisonOperator.Before, value: '2026-01-01' }],
    };
    this.fixture.detectChanges();
    expect(this.component.primaryConditionDisplayText).toEqual('Before: Jan 1, 2026');
    expect(this.component.editFilterAriaLabel).not.toContain('Unknown operator');
  });
  it('reads an editor-built custom range preset back from its criteria', function (this: ThisTest) {
    this.component.propertyFilter = {
      operator: LogicalOperator.And,
      criteria: [
        {
          filterableProperty: dateTimeProperty,
          operator: ComparisonOperator.GreaterThanOrEqualTo,
          value: '2023-05-01T00:00:00+03:00',
        },
        {
          filterableProperty: dateTimeProperty,
          operator: ComparisonOperator.LessThan,
          value: '2024-01-01T00:00:00+03:00',
        },
      ],
    };
    this.fixture.detectChanges();
    expect(this.component.primaryConditionDisplayText).toEqual('From: May 1, 2023 To: Dec 31, 2023');
  });
  it('shows numeric values and units from its own filter', function (this: ThisTest) {
    this.component.propertyFilter = { ...numericPropertyFilter, editorState: { values: [2], units: [Unit.GB] } };
    this.fixture.detectChanges();
    expect(this.component.primaryConditionDisplayText).toEqual('Equals: 2 GB');
  });
});

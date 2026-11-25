/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { animationFrameTick, renderFixture } from '@clr/angular/utils/testing';

import { ManageFilterComponent } from './manage-filter.component';
import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { AppfxDatagridFiltersModule } from '../datagrid-filters.module';
import { ComparisonOperator, LogicalOperator, TimeSpan, Unit } from '../model/datagrid-filters.enums';
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
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppfxDatagridFiltersModule],
      providers: [DatagridFiltersStrings],
    });
    testContext.fixture = TestBed.createComponent(ManageFilterComponent);
    testContext.component = testContext.fixture.componentInstance;
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });
  it('manages string property filter', () => {
    vi.spyOn(testContext.component.filterStrings, 'getConjoinerDisplayName').mockImplementation(() => undefined);
    testContext.component.propertyFilter = stringPropertyFilter;
    stringPropertyFilter.criteria = [stringPredicate1, stringPredicate2];
    renderFixture(testContext.fixture);
    expect(testContext.component.managedProperty).toEqual(stringProperty);
    expect(testContext.component.primaryConditionDisplayText).toEqual('Equals: vm 1');
    expect(testContext.component.secondaryConditionDisplayText).toEqual('Is empty');
    expect(testContext.component.filterStrings.getConjoinerDisplayName).toHaveBeenCalledWith(
      stringPropertyFilter.operator
    );

    const trigger: HTMLButtonElement = testContext.fixture.nativeElement.querySelector('.filter-pill');
    expect(trigger.textContent).toContain('vm 1');
    expect(trigger.textContent).toContain('+1');
    trigger.click();
    renderFixture(testContext.fixture);
    expect(testContext.component.open).toBe(true);
  });
  it('describes the pill with a clr-tooltip instead of a title', () => {
    testContext.component.propertyFilter = { operator: LogicalOperator.And, criteria: [stringPredicate1] };
    renderFixture(testContext.fixture);

    const trigger: HTMLButtonElement = testContext.fixture.nativeElement.querySelector('.filter-pill');
    expect(trigger.hasAttribute('title')).toBe(false);
    expect(trigger.hasAttribute('clrTooltipTrigger')).toBe(true);

    trigger.dispatchEvent(new Event('focus'));
    renderFixture(testContext.fixture);
    const tooltip = document.querySelector<HTMLElement>('.tooltip-content')!;
    expect(tooltip.textContent.trim()).toBe(testContext.component.tooltipText);

    trigger.click();
    renderFixture(testContext.fixture);
    expect(testContext.component.open).toBe(true);
    expect(document.querySelector('.tooltip-content')).toBeNull();
  });
  it('names the pill by its visible text and shows the full filter in a tooltip that is not read', () => {
    testContext.component.propertyFilter = stringPropertyFilter;
    renderFixture(testContext.fixture);
    const trigger: HTMLButtonElement = testContext.fixture.nativeElement.querySelector('.filter-pill');
    const visibleText = trigger.querySelector('.filter-pill-text')!.textContent!.trim().replace(/\s+/g, ' ');
    const otherConditions = ' And ' + testContext.component.secondaryConditionDisplayText;

    // Name: the visible text first (WCAG 2.5.3), then the condition behind the +1 badge, then the hint.
    const label = trigger.getAttribute('aria-label')!;
    expect(label.startsWith(visibleText), label).toBe(true);
    expect(label).toBe(testContext.component.pillText + otherConditions + ', Edit filter');

    trigger.dispatchEvent(new Event('focus'));
    renderFixture(testContext.fixture);
    const tooltip = document.querySelector<HTMLElement>('.tooltip-content')!;
    expect(tooltip.textContent.trim()).toBe(
      stringProperty.displayName + ' ' + testContext.component.primaryConditionDisplayText + otherConditions
    );
    // Visual only: hidden from the accessibility tree, and not linked as the description.
    expect(tooltip.getAttribute('aria-hidden')).toBe('true');
    expect(trigger.getAttribute('aria-describedby')).toBe('');
  });
  it('names an empty pill by its field', () => {
    testContext.component.filterProperty = stringProperty;
    renderFixture(testContext.fixture);
    expect(testContext.component.editFilterAriaLabel).toBe(stringProperty.displayName + ', Edit filter');
    expect(testContext.component.tooltipText).toBe(stringProperty.displayName);
  });
  it('manages enum property filter', () => {
    testContext.component.propertyFilter = enumPropertyFilter;
    renderFixture(testContext.fixture);
    expect(testContext.component.managedProperty).toEqual(enumProperty);
    expect(testContext.component.primaryConditionDisplayText).toEqual('Equals: Alert');
    expect(testContext.component.secondaryConditionDisplayText).toEqual('Equals: Normal');
  });
  it('locks the field combobox while editing a pill', async () => {
    testContext.component.propertyFilter = { operator: LogicalOperator.And, criteria: [stringPredicate1] };
    renderFixture(testContext.fixture);
    testContext.fixture.nativeElement.querySelector('.filter-pill').click();
    renderFixture(testContext.fixture);
    await testContext.fixture.whenStable();
    renderFixture(testContext.fixture);
    // Zoneless: the combobox writes its display value a frame after it renders.
    await animationFrameTick(testContext.fixture);

    const input = document.querySelector<HTMLInputElement>('.filter-popover .clr-combobox-input')!;
    expect(input.value).toBe(stringProperty.displayName);
    expect(input.disabled).toBe(true);
    expect(document.querySelector<HTMLButtonElement>('.filter-popover .clr-combobox-trigger')!.disabled).toBe(true);
    expect(document.querySelector('.filter-form-actions [data-test-id="clear-filter"]')).not.toBeNull();
  });
  it('hides the field combobox for predefined pills', async () => {
    testContext.component.filterProperty = enumProperty;
    testContext.component.predefined = true;
    renderFixture(testContext.fixture);
    testContext.fixture.nativeElement.querySelector('.filter-pill').click();
    renderFixture(testContext.fixture);
    await testContext.fixture.whenStable();
    renderFixture(testContext.fixture);

    expect(document.querySelector('.filter-popover')).toBeTruthy();
    expect(document.querySelector('.filter-popover clr-combobox')).toBeNull();
    expect(getComputedStyle(document.querySelector('.filter-popover .filter-field-row')!).display).toBe('none');
  });
  it('shows a minimal enum editor for predefined pills', async () => {
    testContext.component.filterProperty = enumProperty;
    testContext.component.predefined = true;
    renderFixture(testContext.fixture);
    testContext.fixture.nativeElement.querySelector('.filter-pill').click();
    renderFixture(testContext.fixture);
    await testContext.fixture.whenStable();
    renderFixture(testContext.fixture);

    const popover = document.querySelector('.filter-popover')!;
    expect(popover.classList).toContain('filter-popover-minimal');
    expect(popover.querySelector('.selection-counter')).toBeNull();
    expect(popover.textContent).not.toContain(testContext.component.filterStrings.valueLabel);
    expect(popover.querySelectorAll('input[type="checkbox"]').length).toBeGreaterThan(0);
    expect(popover.querySelector('.filter-options')!.hasAttribute('cds-layout')).toBe(false);
    expect(popover.querySelector('.filter-options')!.classList).toContain('filter-options-minimal');
  });
  it('removes a user-added pill with its X button', () => {
    vi.spyOn(testContext.component.filterRemoved, 'emit').mockImplementation(() => undefined);
    testContext.component.propertyFilter = { operator: LogicalOperator.And, criteria: [stringPredicate1] };
    renderFixture(testContext.fixture);
    const remove: HTMLButtonElement = testContext.fixture.nativeElement.querySelector('[data-test-id="remove-pill"]');
    expect(remove.getAttribute('aria-label')).toBe(
      testContext.component.filterStrings.removeFilterText + ' ' + stringProperty.displayName
    );
    remove.click();
    expect(testContext.component.filterRemoved.emit).toHaveBeenCalled();
    expect(testContext.component.open).toBe(false);
  });
  it('has no X button on predefined pills', () => {
    testContext.component.filterProperty = stringProperty;
    testContext.component.predefined = true;
    renderFixture(testContext.fixture);
    expect(testContext.fixture.nativeElement.querySelector('[data-test-id="remove-pill"]')).toBeNull();
  });
  it('makes the pill button the only click target', () => {
    testContext.component.propertyFilter = {
      operator: LogicalOperator.Or,
      criteria: [stringPredicate1, stringPredicate1],
    };
    renderFixture(testContext.fixture);
    const trigger: HTMLButtonElement = testContext.fixture.nativeElement.querySelector('.filter-pill');
    // Clicks on the text, badge or chevron must target the button, so Clarity sees one toggle element.
    for (const child of Array.from(trigger.children)) {
      expect(getComputedStyle(child).pointerEvents).toBe('none');
    }
  });
  it('manages numeric property filter', () => {
    vi.spyOn(testContext.component.filterStrings, 'getConjoinerDisplayName').mockImplementation(() => undefined);
    testContext.component.propertyFilter = numericPropertyFilter;
    numericPropertyFilter.criteria = [numericPredicate1, numericPredicate2];
    renderFixture(testContext.fixture);
    expect(testContext.component.managedProperty).toEqual(numericProperty);
    expect(testContext.component.primaryConditionDisplayText).toEqual('Equals: 176 MB');
    expect(testContext.component.secondaryConditionDisplayText).toEqual('Greater than: 50 GB');
    expect(testContext.component.filterStrings.getConjoinerDisplayName).toHaveBeenCalledWith(
      numericPropertyFilter.operator
    );
  });
  it('shows the field name without an active style or count when empty', () => {
    testContext.component.filterProperty = stringProperty;
    testContext.component.predefined = true;
    renderFixture(testContext.fixture);
    const trigger: HTMLButtonElement = testContext.fixture.nativeElement.querySelector('.filter-pill');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.closest('clr-label')!.classList.contains('label-info')).toBe(false);
    expect(trigger.textContent.trim()).toBe(stringProperty.displayName);
    expect(trigger.classList.contains('filter-pill-active')).toBe(false);
    expect(trigger.querySelector('.filter-pill-count')).toBeNull();
    expect(trigger.querySelector('cds-icon')!.getAttribute('direction')!).toBe('down');
  });

  it('shows the first value and counts all additional selections', () => {
    testContext.component.propertyFilter = {
      operator: LogicalOperator.Or,
      criteria: [enumPredicate1, enumPredicate2, enumPredicate2, enumPredicate2],
    };
    renderFixture(testContext.fixture);
    const trigger: HTMLButtonElement = testContext.fixture.nativeElement.querySelector('.filter-pill');
    expect(trigger.classList.contains('filter-pill-active')).toBe(true);
    expect(trigger.closest('clr-label')!.classList.contains('label-info')).toBe(true);
    expect(trigger.querySelector('clr-badge')!.textContent!).toBe('+3');
    expect(trigger.querySelector('.filter-pill-text')!.textContent!.trim()).toBe(
      `${enumProperty.displayName}: Equals Alert`
    );
    expect(trigger.querySelector('.filter-pill-count')!.textContent!).toBe('+3');
    expect(trigger.getAttribute('aria-label')).toContain('Equals: Normal');
  });

  it('prefixes the pill text with the field name and condition', () => {
    testContext.component.propertyFilter = {
      operator: LogicalOperator.Or,
      criteria: [
        { ...stringPredicate1, operator: ComparisonOperator.Contains, value: 'linux' },
        { ...stringPredicate1, operator: ComparisonOperator.Contains, value: 'ubuntu' },
        { ...stringPredicate1, operator: ComparisonOperator.Contains, value: 'centos' },
      ],
    };
    renderFixture(testContext.fixture);
    const trigger: HTMLButtonElement = testContext.fixture.nativeElement.querySelector('.filter-pill');
    expect(trigger.querySelector('.filter-pill-text')!.textContent!.trim()).toBe(
      `${stringProperty.displayName}: Contains linux`
    );
    expect(trigger.querySelector('.filter-pill-condition')!.textContent!).toBe('Contains linux');
    expect(trigger.querySelector('.filter-pill-count')!.textContent!).toBe('+2');
  });

  it('shows only the field name on an empty pill', () => {
    testContext.component.filterProperty = stringProperty;
    renderFixture(testContext.fixture);
    expect(testContext.component.pillText).toBe(stringProperty.displayName);
  });

  it('keeps exclusion operators in the pill text', () => {
    testContext.component.propertyFilter = {
      operator: LogicalOperator.And,
      criteria: [{ ...enumPredicate1, operator: ComparisonOperator.DoesNotEqual }],
    };
    renderFixture(testContext.fixture);
    expect(testContext.component.pillText).toBe(`${enumProperty.displayName}: Does not equal Alert`);
  });

  it('updates an existing pill when its criteria are replaced or cleared', () => {
    testContext.fixture.componentRef.setInput('filterProperty', stringProperty);
    testContext.fixture.componentRef.setInput('propertyFilter', stringPropertyFilter);
    renderFixture(testContext.fixture);
    const trigger = testContext.fixture.nativeElement.querySelector('.filter-pill');
    testContext.fixture.componentRef.setInput('propertyFilter', {
      operator: LogicalOperator.And,
      criteria: [{ ...stringPredicate1, value: 'new name' }],
    });
    renderFixture(testContext.fixture);
    expect(trigger.textContent.trim()).toBe(`${stringProperty.displayName}: Equals new name`);
    testContext.fixture.componentRef.setInput('propertyFilter', undefined);
    renderFixture(testContext.fixture);
    expect(trigger.textContent.trim()).toBe(stringProperty.displayName);
    expect(trigger.classList.contains('filter-pill-active')).toBe(false);
  });

  it('clears a predefined filter from the popover without mutating its defaults', async () => {
    testContext.component.propertyFilter = stringPropertyFilter;
    testContext.component.predefined = true;
    vi.spyOn(testContext.component.filterRemoved, 'emit').mockImplementation(() => undefined);
    renderFixture(testContext.fixture);
    const trigger: HTMLButtonElement = testContext.fixture.nativeElement.querySelector('.filter-pill');
    trigger.click();
    renderFixture(testContext.fixture);
    await testContext.fixture.whenStable();
    renderFixture(testContext.fixture);
    const clear: HTMLButtonElement = document.querySelector('[data-test-id="clear-filter"]')!;
    expect(clear.textContent.trim()).toBe('Clear filter');
    clear.click();
    renderFixture(testContext.fixture);
    expect(testContext.component.filterRemoved.emit).toHaveBeenCalledTimes(1);
    expect(stringPropertyFilter.criteria).toEqual([stringPredicate1, stringPredicate2]);
    expect(testContext.component.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('offers removal for a user-added filter', async () => {
    testContext.component.propertyFilter = numericPropertyFilter;
    vi.spyOn(testContext.component.filterRemoved, 'emit').mockImplementation(() => undefined);
    renderFixture(testContext.fixture);
    testContext.fixture.nativeElement.querySelector('.filter-pill').click();
    renderFixture(testContext.fixture);
    await testContext.fixture.whenStable();
    renderFixture(testContext.fixture);
    const remove: HTMLButtonElement = document.querySelector('[data-test-id="clear-filter"]')!;
    expect(remove.textContent.trim()).toBe(testContext.component.filterStrings.removeFilterText);
    remove.click();
    expect(testContext.component.filterRemoved.emit).toHaveBeenCalledTimes(1);
    expect(numericProperty['selectedValue']).toBeUndefined();
  });

  it('edits four string conditions without dropping criteria or changing the count', async () => {
    const field = new StringPropertyDefinition('Name', 'name');
    const values = ['first', 'second', 'third', 'fourth'];
    const originalFilter: PropertyFilter = {
      operator: LogicalOperator.Or,
      criteria: values.map(value => ({ filterableProperty: field, operator: ComparisonOperator.Contains, value })),
    };
    testContext.component.propertyFilter = originalFilter;
    const emitted = vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
    renderFixture(testContext.fixture);
    const trigger: HTMLButtonElement = testContext.fixture.nativeElement.querySelector('.filter-pill');
    expect(trigger.querySelector('clr-badge')!.textContent!).toBe('+3');
    for (const value of values) {
      expect(trigger.getAttribute('aria-label')).toContain(value);
    }
    trigger.click();
    renderFixture(testContext.fixture);
    await testContext.fixture.whenStable();
    renderFixture(testContext.fixture);
    const inputs = document.querySelectorAll<HTMLInputElement>('.filter-condition-row input[formControlName="value"]');
    expect(Array.from(inputs, input => input.value)).toEqual(values);
    inputs[2].value = 'changed';
    inputs[2].dispatchEvent(new Event('input'));
    renderFixture(testContext.fixture);
    document.querySelector<HTMLButtonElement>('[data-test-id="submitBtn"]')!.click();
    renderFixture(testContext.fixture);
    const updated = emitted.mock.lastCall![0]!;
    expect(updated.criteria.map(predicate => predicate.value)).toEqual(['first', 'second', 'changed', 'fourth']);
    expect(originalFilter.criteria.map(predicate => predicate.value)).toEqual(values);
    testContext.fixture.componentRef.setInput('propertyFilter', updated);
    renderFixture(testContext.fixture);
    expect(trigger.querySelector('clr-badge')!.textContent!).toBe('+3');
  });

  it('summarizes and opens numeric presets without display metadata', async () => {
    const field = new NumericPropertyDefinition('Memory', 'memory', undefined, Unit.MB);
    const values = [0, 1024, 2048];
    testContext.component.propertyFilter = {
      operator: LogicalOperator.Or,
      criteria: values.map(value => ({ filterableProperty: field, operator: ComparisonOperator.Equals, value })),
    };
    renderFixture(testContext.fixture);
    const trigger: HTMLButtonElement = testContext.fixture.nativeElement.querySelector('.filter-pill');
    expect(trigger.querySelector('.filter-pill-text')!.textContent!.trim()).toBe(`${field.displayName}: Equals 0 MB`);
    expect(trigger.querySelector('clr-badge')!.textContent!).toBe('+2');
    for (const value of values) {
      expect(trigger.getAttribute('aria-label')).toContain(`${value} MB`);
    }
    trigger.click();
    renderFixture(testContext.fixture);
    await testContext.fixture.whenStable();
    renderFixture(testContext.fixture);
    const inputs = document.querySelectorAll<HTMLInputElement>('.filter-condition-row input[formControlName="value"]');
    expect(Array.from(inputs, input => input.value)).toEqual(['0', '1024', '2048']);
  });

  for (const dismiss of ['escape', 'outside', 'cancel']) {
    it('discards unapplied edits on ' + dismiss, async () => {
      testContext.component.propertyFilter = { operator: LogicalOperator.And, criteria: [stringPredicate1] };
      vi.spyOn(testContext.component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      renderFixture(testContext.fixture);
      const trigger: HTMLButtonElement = testContext.fixture.nativeElement.querySelector('.filter-pill');
      trigger.click();
      renderFixture(testContext.fixture);
      await testContext.fixture.whenStable();
      renderFixture(testContext.fixture);
      const input: HTMLInputElement = document.querySelector('input[formControlName="value"]')!;
      input.value = 'unsaved';
      input.dispatchEvent(new Event('input'));
      if (dismiss === 'escape') {
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      } else if (dismiss === 'outside') {
        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      } else {
        document.querySelector<HTMLButtonElement>('[data-test-id="cancelBtn"]')!.click();
      }
      renderFixture(testContext.fixture);
      await testContext.fixture.whenStable();
      renderFixture(testContext.fixture);
      expect(testContext.component.open).toBe(false);
      expect(testContext.component.propertyFilter.criteria[0].value).toBe('vm 1');
      expect(testContext.component.filterCriteriaChange.emit).not.toHaveBeenCalled();
    });
  }

  // Date-time pills read this filter's own editor state; the shared definition is never consulted (bug 10).
  const dateFilter = (editorState: PropertyFilter['editorState']): PropertyFilter => ({
    ...dateTimePropertyFilter,
    editorState,
  });

  it('manages date-time property filter normal operator', () => {
    testContext.component.propertyFilter = dateFilter({
      operator: ComparisonOperator.BeforeOrEqualTo,
      value: '2023-02-02T13:23',
    });
    renderFixture(testContext.fixture);
    expect(testContext.component.managedProperty).toEqual(dateTimeProperty);

    // Angular formats times with a narrow no-break space before AM/PM.
    expect(testContext.component.primaryConditionDisplayText.replace(/\u202f/g, ' ')).toEqual(
      'Before or equal to: Feb 2, 2023 1:23 PM'
    );
  });
  it('manages date-time property filter custom range operator', () => {
    testContext.component.propertyFilter = dateFilter({
      operator: ComparisonOperator.CustomRange,
      value: '2023-02-02',
      valueTo: '2023-02-07',
    });
    renderFixture(testContext.fixture);

    expect(testContext.component.primaryConditionDisplayText).toEqual('From: Feb 2, 2023 To: Feb 7, 2023');
    expect(testContext.component.pillCondition).toEqual('From Feb 2, 2023 To Feb 7, 2023');
  });
  it('manages date-time property filter relative operator', () => {
    testContext.component.propertyFilter = dateFilter({ operator: ComparisonOperator.LastYear });
    renderFixture(testContext.fixture);

    expect(testContext.component.primaryConditionDisplayText).toEqual('Last year');
  });
  it('manages date-time property filter time span operator', () => {
    testContext.component.propertyFilter = dateFilter({
      operator: ComparisonOperator.TimeSpan,
      timeSpanValue: 300,
      timeSpan: TimeSpan.Weeks,
    });
    renderFixture(testContext.fixture);

    expect(testContext.component.primaryConditionDisplayText).toEqual('Time span: 300 Weeks');
  });
  it('does not change its text when another filter on the same definition changes (bug 10)', () => {
    testContext.component.propertyFilter = dateFilter({ operator: ComparisonOperator.LastWeek });
    renderFixture(testContext.fixture);
    // Another grid writing legacy editor fields onto the shared definition has no effect.
    dateTimeProperty['selectedOperator'] = ComparisonOperator.TimeSpan;
    testContext.component.ngOnChanges();
    expect(testContext.component.primaryConditionDisplayText).toEqual('Last week');
    delete dateTimeProperty['selectedOperator'];
  });
  it('describes a preset without editor state from its criteria (bug 9)', () => {
    testContext.component.propertyFilter = {
      operator: LogicalOperator.And,
      criteria: [{ filterableProperty: dateTimeProperty, operator: ComparisonOperator.Before, value: '2026-01-01' }],
    };
    renderFixture(testContext.fixture);
    expect(testContext.component.primaryConditionDisplayText).toEqual('Before: Jan 1, 2026');
    expect(testContext.component.editFilterAriaLabel).not.toContain('Unknown operator');
  });
  it('reads an editor-built custom range preset back from its criteria', () => {
    testContext.component.propertyFilter = {
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
    renderFixture(testContext.fixture);
    expect(testContext.component.primaryConditionDisplayText).toEqual('From: May 1, 2023 To: Dec 31, 2023');
  });
  it('shows numeric values and units from its own filter', () => {
    testContext.component.propertyFilter = { ...numericPropertyFilter, editorState: { values: [2], units: [Unit.GB] } };
    renderFixture(testContext.fixture);
    expect(testContext.component.primaryConditionDisplayText).toEqual('Equals: 2 GB');
  });
});

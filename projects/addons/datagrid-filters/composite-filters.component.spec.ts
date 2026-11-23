/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { A11yModule as CdkA11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ClrBadge } from '@clr/angular/emphasis/badge';
import { ClrLabel } from '@clr/angular/emphasis/label';
import { ClrCheckboxModule, ClrCombobox, ClrComboboxModule, ClrInputModule, ClrSelectModule } from '@clr/angular/forms';
import { ClrIcon } from '@clr/angular/icon';
import { ClrPopoverModuleNext } from '@clr/angular/popover/common';
import { ClrTooltipModule } from '@clr/angular/popover/tooltip';
import { renderFixture } from '@clr/angular/utils/testing';
import type { Mock } from 'vitest';

import { EnumFilterComponent } from './advanced-filters/enum-filter.component';
import { FilterFormComponent } from './advanced-filters/filter-form.component';
import { GeneralFilterComponent } from './advanced-filters/general-filter.component';
import { CompositeFiltersComponent } from './composite-filters.component';
import { DatagridFiltersStrings } from './datagrid-filters-strings.service';
import { ManageFilterComponent } from './manage-filters/manage-filter.component';
import { ComparisonOperator, LogicalOperator, PropertyType } from './model/datagrid-filters.enums';
import {
  EnumPropertyDefinition,
  FilterablePropertyDefinition,
  PropertyFilter,
  PropertyPredicate,
  StringPropertyDefinition,
  ToggleFilter,
} from './model/datagrid-filters.interfaces';

/** aria-pressed of the semi-predefined option pill with this label. */
const optionPressed = (label: string) =>
  Array.from(document.querySelectorAll<HTMLButtonElement>('[data-test-id="semi-filter-option"]'))
    .find(option => option.textContent.trim() === label)
    ?.getAttribute('aria-pressed');

/** Toggles without a label, from their filters. */
const asToggles = (...filters: PropertyFilter[]): ToggleFilter[] => filters.map(filter => ({ filter }));

const property = 'vmName';
const propertyDisplayName = 'Name';
const comparisonOperators = [ComparisonOperator.Equals, ComparisonOperator.Contains, ComparisonOperator.IsEmpty];
const stringProperty: StringPropertyDefinition = new StringPropertyDefinition(
  property,
  propertyDisplayName,
  comparisonOperators
);
const enumPropertyName = 'vmStatus';
const enumPropertyDisplayName = 'Status';
const values = { red: 'Alert', green: 'Normal' };
const enumProperty: EnumPropertyDefinition = new EnumPropertyDefinition(
  enumPropertyName,
  enumPropertyDisplayName,
  new Map(Object.entries(values))
);

const filterableProperties = [stringProperty, enumProperty];

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

const ariaLabelAttributeName = 'aria-label';

/**
 * A parent for the OnPush filter bar, as in an app. A fixture always refreshes its own root component,
 * so state that only goes stale in a child view (e.g. aria-expanded) needs this host to show up.
 */
@Component({
  template: `<appfx-composite-filter
    [filterableProperties]="filterableProperties"
    [presetFilters]="presetFilters"
  ></appfx-composite-filter>`,
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false,
})
class CompositeFiltersHostComponent {
  filterableProperties = filterableProperties;
  presetFilters = [enumPropertyFilter];
}

/** A host that keeps the active filters in sync with two-way binding. */
@Component({
  template: `<appfx-composite-filter
    [filterableProperties]="filterableProperties"
    [presetFilters]="presetFilters"
    [predefinedFilters]="predefinedFilters"
    [semiPredefinedFilters]="semiPredefinedFilters"
    [toggleFilters]="toggleFilters"
    [(propertyFilters)]="filters"
  ></appfx-composite-filter>`,
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false,
})
class TwoWayHostComponent {
  filterableProperties = filterableProperties;
  presetFilters: PropertyFilter[] = [];
  predefinedFilters: FilterablePropertyDefinition[] = [];
  semiPredefinedFilters: EnumPropertyDefinition[] = [];
  toggleFilters: ToggleFilter[] = [];
  filters: PropertyFilter[] = [];
}

export interface ThisTest {
  fixture: ComponentFixture<CompositeFiltersComponent>;
  component: CompositeFiltersComponent;
}

describe('CompositeFiltersComponent', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ClrBadge,
        ClrLabel,
        ClrCheckboxModule,
        ClrComboboxModule,
        ClrInputModule,
        ClrSelectModule,
        ClrPopoverModuleNext,
        ClrTooltipModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CdkA11yModule,
        ClrIcon,
      ],
      declarations: [
        CompositeFiltersComponent,
        CompositeFiltersHostComponent,
        TwoWayHostComponent,
        EnumFilterComponent,
        FilterFormComponent,
        ManageFilterComponent,
        GeneralFilterComponent,
      ],
      providers: [DatagridFiltersStrings],
    });
    testContext.fixture = TestBed.createComponent(CompositeFiltersComponent);
    testContext.component = testContext.fixture.componentInstance;
    testContext.component.filterableProperties = filterableProperties;
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });

  describe('layout', () => {
    const container = (): HTMLElement => testContext.fixture.nativeElement.querySelector('.manage-filter-container');

    it('shows Add filter in the pill row even without pills', () => {
      renderFixture(testContext.fixture);
      expect(container().querySelector('[data-test-id="add-button"]')).not.toBeNull();
    });

    it('puts the pills first, then Add filter and Clear all, in one row', () => {
      testContext.component.presetFilters = [stringPropertyFilter];
      renderFixture(testContext.fixture);
      const items = Array.from(container().children)
        .map(child =>
          child.matches('appfx-manage-filter')
            ? 'pill'
            : (child.querySelector('[data-test-id]') ?? child).getAttribute('data-test-id')
        )
        .filter(Boolean);
      expect(items).toEqual(['pill', 'hide-filters', 'add-button', 'clear-all-button']);
    });

    it('wraps the buttons with the pills at phone width, so Clear all stays on screen', () => {
      const host: HTMLElement = testContext.fixture.nativeElement;
      host.style.display = 'block';
      host.style.width = '375px';
      testContext.component.presetFilters = [stringPropertyFilter, enumPropertyFilter];
      renderFixture(testContext.fixture);
      const clearAll = host.querySelector('[data-test-id="clear-all-button"]')!.getBoundingClientRect();
      const add = host.querySelector('[data-test-id="add-button"]')!.getBoundingClientRect();
      const right = host.getBoundingClientRect().right;
      expect(clearAll.right).toBeLessThanOrEqual(right);
      expect(add.right).toBeLessThanOrEqual(right);
    });
  });

  it('shows empty predefined pills without emitting active filters', async () => {
    testContext.component.predefinedFilters = [stringProperty];
    vi.spyOn(testContext.component.propertyFiltersChange, 'emit').mockImplementation(() => undefined);
    renderFixture(testContext.fixture);
    const pill = testContext.fixture.nativeElement.querySelector('.filter-pill');
    expect(pill.textContent.trim()).toBe(stringProperty.displayName);
    expect(pill.classList.contains('filter-pill-active')).toBe(false);
    expect(testContext.component.propertyFilters).toEqual([]);
    expect(testContext.component.propertyFiltersChange.emit).not.toHaveBeenCalled();
    expect(testContext.component.selectedFilterableProperty).toBe(enumProperty);
    expect(await offeredFields(testContext.fixture)).toEqual([enumProperty.displayName]);
  });

  it('deduplicates predefined fields and presets by property key', async () => {
    const equivalentProperty = new StringPropertyDefinition('Another label', stringProperty.property);
    testContext.component.predefinedFilters = [stringProperty, equivalentProperty];
    testContext.component.presetFilters = [stringPropertyFilter];
    renderFixture(testContext.fixture);
    expect(testContext.fixture.nativeElement.querySelectorAll('.filter-pill').length).toBe(1);
    expect(testContext.component.propertyFilters).toEqual([stringPropertyFilter]);
    expect(await offeredFields(testContext.fixture)).toEqual([enumProperty.displayName]);
  });

  it('keeps predefined pills visible when hiding and clearing active filters', () => {
    testContext.component.predefinedFilters = [stringProperty];
    testContext.component.presetFilters = [stringPropertyFilter, enumPropertyFilter];
    vi.spyOn(testContext.component.propertyFiltersChange, 'emit').mockImplementation(() => undefined);
    renderFixture(testContext.fixture);
    testContext.fixture.nativeElement.querySelector('[data-test-id="hide-filters"]').click();
    renderFixture(testContext.fixture);
    const pills = testContext.fixture.nativeElement.querySelectorAll('appfx-manage-filter');
    expect(pills[0].hidden).toBe(false);
    expect(pills[1].hidden).toBe(true);
    testContext.fixture.nativeElement.querySelector('[data-test-id="clear-all-button"]').click();
    renderFixture(testContext.fixture);
    expect(testContext.fixture.nativeElement.querySelectorAll('.filter-pill').length).toBe(1);
    expect(testContext.fixture.nativeElement.querySelector('.filter-pill').textContent.trim()).toBe(
      stringProperty.displayName
    );
    expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledWith([]);
    expect(testContext.component.presetFilters[0].criteria.length).toBe(2);
  });

  it('disables Add New when every property has a predefined pill', () => {
    testContext.component.predefinedFilters = filterableProperties;
    renderFixture(testContext.fixture);
    expect(testContext.fixture.nativeElement.querySelector('[data-test-id="add-button"]').disabled).toBe(true);
  });

  it('updates the predefined list without dropping active criteria', () => {
    testContext.fixture.componentRef.setInput('predefinedFilters', [stringProperty]);
    testContext.component.presetFilters = [stringPropertyFilter];
    renderFixture(testContext.fixture);
    testContext.fixture.componentRef.setInput('predefinedFilters', [enumProperty]);
    renderFixture(testContext.fixture);
    const pillFields = testContext.fixture.debugElement
      .queryAll(By.directive(ManageFilterComponent))
      .map(pill => (pill.componentInstance as ManageFilterComponent).filterProperty);
    expect(pillFields).toEqual([enumProperty, stringProperty]);
    expect(testContext.component.propertyFilters).toEqual([stringPropertyFilter]);
  });

  it('applies and clears a predefined filter through its popover', async () => {
    testContext.component.predefinedFilters = [stringProperty];
    vi.spyOn(testContext.component.propertyFiltersChange, 'emit').mockImplementation(() => undefined);
    renderFixture(testContext.fixture);
    const trigger: HTMLButtonElement = testContext.fixture.nativeElement.querySelector('.filter-pill');
    trigger.click();
    renderFixture(testContext.fixture);
    await testContext.fixture.whenStable();
    renderFixture(testContext.fixture);
    const input: HTMLInputElement = document.querySelector('input[formControlName="value"]')!;
    input.value = 'Demo';
    input.dispatchEvent(new Event('input'));
    renderFixture(testContext.fixture);
    document.querySelector<HTMLButtonElement>('[data-test-id="submitBtn"]')!.click();
    renderFixture(testContext.fixture);
    await testContext.fixture.whenStable();
    renderFixture(testContext.fixture);
    expect(trigger.textContent.trim()).toBe(`${stringProperty.displayName}: Contains Demo`);
    expect(trigger.classList.contains('filter-pill-active')).toBe(true);
    expect(testContext.component.propertyFilters[0].criteria[0].value).toBe('Demo');
    trigger.click();
    renderFixture(testContext.fixture);
    await testContext.fixture.whenStable();
    renderFixture(testContext.fixture);
    document.querySelector<HTMLButtonElement>('[data-test-id="clear-filter"]')!.click();
    renderFixture(testContext.fixture);
    await testContext.fixture.whenStable();
    renderFixture(testContext.fixture);
    expect(testContext.fixture.nativeElement.querySelector('.filter-pill')).toBe(trigger);
    expect(trigger.textContent.trim()).toBe(stringProperty.displayName);
    expect(trigger.classList.contains('filter-pill-active')).toBe(false);
    expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledWith([]);
    expect(document.activeElement).toBe(trigger);
  });
  it('is properly initialized', () => {
    renderFixture(testContext.fixture);
    expect(testContext.component).toBeTruthy();
    expect(testContext.component.selectedFilterableProperty).toEqual(stringProperty);
    expect(testContext.component.propertyType).toEqual(PropertyType.String);
    expect(testContext.component.stringProperty).toEqual(stringProperty);
  });
  it('searches fields in the combobox and switches to the selected editor', async () => {
    await openAddFilter(testContext.fixture);
    expect(testContext.component.signPostOpened).toBeTruthy();
    await selectField(testContext.fixture, enumProperty.displayName);
    expect(testContext.component.selectedFilterableProperty).toEqual(filterableProperties[1]);
    expect(testContext.component.propertyType).toEqual(PropertyType.Enum);
    expect(testContext.component.enumProperty).toEqual(enumProperty);
    expect(document.querySelector('appfx-general-filter')).toBeNull();
    expect(document.querySelector('appfx-enum-filter')).not.toBeNull();
    expect(testContext.component.signPostOpened).toBe(true);
    expect(document.activeElement).toBe(document.querySelector('.filter-popover .clr-combobox-input'));
  });
  it('discards the draft when switching between fields of the same type', async () => {
    const otherProperty = new StringPropertyDefinition('Description', 'description', [ComparisonOperator.Equals]);
    testContext.component.filterableProperties = [stringProperty, otherProperty];
    vi.spyOn(testContext.component.propertyFiltersChange, 'emit').mockImplementation(() => undefined);
    await openAddFilter(testContext.fixture);
    const input: HTMLInputElement = document.querySelector('input[formControlName="value"]')!;
    input.value = 'Draft name';
    input.dispatchEvent(new Event('input'));
    renderFixture(testContext.fixture);
    document.querySelector<HTMLButtonElement>('.filter-popover [data-test-id="add-button"]')!.click();
    renderFixture(testContext.fixture);
    await testContext.fixture.whenStable();
    renderFixture(testContext.fixture);

    await selectField(testContext.fixture, otherProperty.displayName);

    expect(document.querySelector<HTMLInputElement>('input[formControlName="value"]')!.value).toBe('');
    expect(document.querySelectorAll('.filter-condition-row').length).toBe(1);
    expect(document.querySelector<HTMLSelectElement>('select[formControlName="operator"]')!.options.length).toBe(1);
    expect(document.querySelector<HTMLButtonElement>('[data-test-id="submitBtn"]')!.disabled).toBe(true);
    expect(testContext.component.propertyFiltersChange.emit).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(document.querySelector('.filter-popover .clr-combobox-input'));
  });
  it('keeps the field picker available after a cleared selection', async () => {
    await openAddFilter(testContext.fixture);
    const picker = testContext.fixture.debugElement.query(By.directive(ClrCombobox));
    picker.triggerEventHandler('ngModelChange', null);
    renderFixture(testContext.fixture);
    await testContext.fixture.whenStable();
    renderFixture(testContext.fixture);
    expect(document.querySelector('appfx-general-filter')).toBeNull();
    expect(document.querySelector<HTMLButtonElement>('[data-test-id="submitBtn"]')!.disabled).toBe(true);
    expect(document.querySelector('[data-test-id="cancelBtn"]')).not.toBeNull();
    expect(document.querySelector('.filter-popover clr-combobox')).not.toBeNull();
    expect(document.activeElement).toBe(document.querySelector('.filter-popover .clr-combobox-input'));

    await selectField(testContext.fixture, stringProperty.displayName);

    expect(testContext.component.selectedFilterableProperty).toBe(stringProperty);
    expect(document.querySelector('appfx-general-filter')).not.toBeNull();
    expect(testContext.component.signPostOpened).toBe(true);
    expect(document.activeElement).toBe(document.querySelector('.filter-popover .clr-combobox-input'));
  });
  it('does not move focus when changing the field with the popover closed', async () => {
    renderFixture(testContext.fixture);
    const trigger: HTMLButtonElement = testContext.fixture.nativeElement.querySelector('[data-test-id="add-button"]');
    trigger.focus();
    testContext.component.selectedFilterableProperty = enumProperty;
    testContext.component.onPropertyChange();
    renderFixture(testContext.fixture);
    await testContext.fixture.whenStable();
    expect(document.activeElement).toBe(trigger);
    expect(document.querySelector('.filter-popover')).toBeNull();
  });
  it('runs the first ngOnChanges before ngOnInit and preselects the first available field', () => {
    // Angular reads ngOnInit from the class, so the order is checked through the presets, which only ngOnInit applies.
    const seenInOnChanges: { applied: number; selected: FilterablePropertyDefinition }[] = [];
    const component = testContext.component;
    const ngOnChanges = CompositeFiltersComponent.prototype.ngOnChanges;
    vi.spyOn(component, 'ngOnChanges').mockImplementation(changes => {
      ngOnChanges.call(component, changes);
      seenInOnChanges.push({
        applied: component.propertyFilters.length,
        selected: component.selectedFilterableProperty,
      });
    });
    // setInput goes through Angular's input handling, as a template binding does.
    testContext.fixture.componentRef.setInput('filterableProperties', filterableProperties);
    testContext.fixture.componentRef.setInput('predefinedFilters', [stringProperty]);
    testContext.fixture.componentRef.setInput('presetFilters', [stringPropertyFilter]);
    renderFixture(testContext.fixture);
    // One ngOnChanges, before ngOnInit (no preset applied yet), which already picked the first available field.
    expect(seenInOnChanges).toEqual([{ applied: 0, selected: enumProperty }]);
    // ngOnInit ran afterwards: it applied the preset and kept the same field.
    expect(testContext.component.propertyFilters).toEqual([stringPropertyFilter]);
    expect(testContext.component.selectedFilterableProperty).toBe(enumProperty);
  });

  it('keeps the chosen Add filter field when an unrelated input changes', () => {
    renderFixture(testContext.fixture);
    testContext.component.selectedFilterableProperty = enumProperty;
    testContext.component.onPropertyChange();

    const propertyChange = vi.spyOn(testContext.component, 'onPropertyChange').mockImplementation(() => undefined);
    testContext.component.externalCriteriaActive = true;
    testContext.component.ngOnChanges({ externalCriteriaActive: new SimpleChange(false, true, false) });
    expect(testContext.component.selectedFilterableProperty).toBe(enumProperty);
    expect(propertyChange).not.toHaveBeenCalled();

    // A toggle on another field leaves the chosen field available, so the editor is not rebuilt.
    const nameToggle: PropertyFilter = {
      operator: LogicalOperator.And,
      criteria: [{ filterableProperty: stringProperty, operator: ComparisonOperator.Contains, value: 'demo' }],
    };
    testContext.component.toggleFilters = asToggles(nameToggle);
    testContext.component.ngOnChanges({ toggleFilters: new SimpleChange([], asToggles(nameToggle), false) });
    expect(testContext.component.selectedFilterableProperty).toBe(enumProperty);
    expect(propertyChange).not.toHaveBeenCalled();
    testContext.component.toggleFilters = asToggles();

    // A new array with an equal field keeps the choice and switches to the new definition.
    const newEnumProperty = new EnumPropertyDefinition(
      enumProperty.displayName,
      enumProperty.property,
      enumProperty.values
    );
    testContext.component.filterableProperties = [stringProperty, newEnumProperty];
    testContext.component.ngOnChanges({
      filterableProperties: new SimpleChange(filterableProperties, testContext.component.filterableProperties, false),
    });
    expect(testContext.component.selectedFilterableProperty).toBe(newEnumProperty);
  });

  it('moves the Add filter field to the first available one when the chosen field is taken', () => {
    renderFixture(testContext.fixture);
    testContext.component.selectedFilterableProperty = enumProperty;
    testContext.component.onPropertyChange();

    testContext.component.semiPredefinedFilters = [enumProperty];
    testContext.component.ngOnChanges({ semiPredefinedFilters: new SimpleChange([], [enumProperty], false) });
    expect(testContext.component.selectedFilterableProperty).toBe(stringProperty);
  });

  describe('aria-expanded when an outside click closes a popover', () => {
    const closeWithOutsideClick = async (fixture: ComponentFixture<CompositeFiltersHostComponent>) => {
      document.body.click();
      renderFixture(fixture);
      await fixture.whenStable();
    };

    it('resets it on Add filter', async () => {
      const host = TestBed.createComponent(CompositeFiltersHostComponent);
      renderFixture(host);
      const addButton: HTMLButtonElement = host.nativeElement.querySelector('[data-test-id="add-button"]');
      addButton.click();
      renderFixture(host);
      await host.whenStable();
      expect(addButton.getAttribute('aria-expanded')).toBe('true');

      await closeWithOutsideClick(host);
      expect(document.querySelector('.filter-popover')).toBeNull();
      expect(addButton.getAttribute('aria-expanded')).toBe('false');
      host.destroy();
    });

    it('resets it on a filter pill', async () => {
      const host = TestBed.createComponent(CompositeFiltersHostComponent);
      renderFixture(host);
      const pill: HTMLButtonElement = host.nativeElement.querySelector('appfx-manage-filter .filter-pill');
      pill.click();
      renderFixture(host);
      await host.whenStable();
      expect(pill.getAttribute('aria-expanded')).toBe('true');

      await closeWithOutsideClick(host);
      expect(document.querySelector('.filter-popover')).toBeNull();
      expect(pill.getAttribute('aria-expanded')).toBe('false');
      host.destroy();
    });

    const openAddFilterInHost = async (host: ComponentFixture<CompositeFiltersHostComponent>) => {
      renderFixture(host);
      const addButton: HTMLButtonElement = host.nativeElement.querySelector('[data-test-id="add-button"]');
      addButton.click();
      renderFixture(host);
      await host.whenStable();
      expect(addButton.getAttribute('aria-expanded')).toBe('true');
      return addButton;
    };

    it('resets it on Add filter after Escape', async () => {
      const host = TestBed.createComponent(CompositeFiltersHostComponent);
      const addButton = await openAddFilterInHost(host);
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      renderFixture(host);
      await host.whenStable();
      expect(document.querySelector('.filter-popover')).toBeNull();
      expect(addButton.getAttribute('aria-expanded')).toBe('false');
      host.destroy();
    });

    it('resets it on Add filter after a second click on it', async () => {
      const host = TestBed.createComponent(CompositeFiltersHostComponent);
      const addButton = await openAddFilterInHost(host);
      addButton.click();
      renderFixture(host);
      await host.whenStable();
      expect(document.querySelector('.filter-popover')).toBeNull();
      expect(addButton.getAttribute('aria-expanded')).toBe('false');
      host.destroy();
    });
  });

  describe('[(propertyFilters)] two-way binding', () => {
    const pillNames = (host: ComponentFixture<TwoWayHostComponent>) =>
      Array.from<HTMLElement>(host.nativeElement.querySelectorAll('appfx-manage-filter .filter-pill-text')).map(pill =>
        pill.textContent.trim()
      );
    const bar = (host: ComponentFixture<TwoWayHostComponent>): CompositeFiltersComponent =>
      host.debugElement.query(By.directive(CompositeFiltersComponent)).componentInstance;
    /** aria-pressed of the (only) toggle. */
    const toggleState = (host: ComponentFixture<TwoWayHostComponent>) =>
      host.nativeElement.querySelector('[data-test-id="toggle-filter"]').getAttribute('aria-pressed');
    const redToggle = (): PropertyFilter => ({
      operator: LogicalOperator.Or,
      criteria: [{ filterableProperty: enumProperty, operator: ComparisonOperator.Equals, value: 'red' }],
    });

    it('shows filters set by the host without emitting them back', () => {
      const host = TestBed.createComponent(TwoWayHostComponent);
      renderFixture(host);
      vi.spyOn(bar(host).propertyFiltersChange, 'emit');

      host.componentInstance.filters = [stringPropertyFilter];
      renderFixture(host);
      expect(pillNames(host)).toEqual([expect.stringContaining(stringProperty.displayName)]);
      expect(bar(host).propertyFiltersChange.emit).not.toHaveBeenCalled();
      host.destroy();
    });

    it('restores filters saved as JSON with the field definitions of the filter bar', async () => {
      const host = TestBed.createComponent(TwoWayHostComponent);
      renderFixture(host);
      vi.spyOn(bar(host).propertyFiltersChange, 'emit');

      // A saved view: the field definitions are plain objects now, and the enum values Map is lost.
      const restored: PropertyFilter[] = JSON.parse(JSON.stringify([stringPropertyFilter, enumPropertyFilter]));
      host.componentInstance.filters = restored;
      renderFixture(host);

      const [stringFilter, enumFilter] = bar(host).propertyFilters;
      stringFilter.criteria.forEach(predicate => expect(predicate.filterableProperty).toBe(stringProperty));
      expect(enumFilter.criteria[0].filterableProperty).toBe(enumProperty);
      expect(stringFilter.criteria[0].value).toBe('vm 1');
      expect(stringFilter.operator).toBe(LogicalOperator.And);
      // The host's restored array is not changed, and nothing is emitted: the filters are the same.
      expect(restored[0].criteria[0].filterableProperty).not.toBeInstanceOf(StringPropertyDefinition);
      expect(bar(host).propertyFiltersChange.emit).not.toHaveBeenCalled();

      // The pill opens its editor.
      (host.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('appfx-manage-filter .filter-pill')!.click();
      renderFixture(host);
      await host.whenStable();
      renderFixture(host);
      expect(document.querySelector('appfx-general-filter')).not.toBeNull();
      host.destroy();
    });

    it('keeps restored filters on fields it does not know as they are', () => {
      const host = TestBed.createComponent(TwoWayHostComponent);
      renderFixture(host);
      const unknown: PropertyFilter = JSON.parse(
        JSON.stringify({
          operator: LogicalOperator.And,
          criteria: [{ filterableProperty: { property: 'other' }, operator: ComparisonOperator.Equals, value: 'x' }],
        })
      );
      host.componentInstance.filters = [unknown];
      renderFixture(host);
      expect(bar(host).propertyFilters).toEqual([unknown]);
      expect(bar(host).propertyFilters[0]).toBe(unknown);
      host.destroy();
    });

    it('turns a toggle ON when the host value contains its criteria, and OFF when it no longer does', () => {
      const host = TestBed.createComponent(TwoWayHostComponent);
      host.componentInstance.toggleFilters = asToggles(redToggle());
      renderFixture(host);

      host.componentInstance.filters = [redToggle()];
      renderFixture(host);
      expect(toggleState(host)).toBe('true');
      expect(pillNames(host)).toEqual([]);

      host.componentInstance.filters = [];
      renderFixture(host);
      expect(toggleState(host)).toBe('false');
      host.destroy();
    });

    it('updates the host value on user changes and never changes the host array', () => {
      const host = TestBed.createComponent(TwoWayHostComponent);
      const original = [stringPropertyFilter];
      host.componentInstance.filters = original;
      renderFixture(host);

      bar(host).onFilterCriteriaChange(enumPropertyFilter);
      renderFixture(host);
      expect(host.componentInstance.filters).toEqual([stringPropertyFilter, enumPropertyFilter]);
      expect(original).toEqual([stringPropertyFilter]);
      expect(pillNames(host).length).toBe(2);

      bar(host).clearAllFilters();
      renderFixture(host);
      expect(host.componentInstance.filters).toEqual([]);
      host.destroy();
    });

    it('emits once at start-up when presets change what the host passed in', async () => {
      const host = TestBed.createComponent(TwoWayHostComponent);
      const presetForName: PropertyFilter = {
        operator: LogicalOperator.And,
        criteria: [{ filterableProperty: stringProperty, operator: ComparisonOperator.Contains, value: 'preset' }],
      };
      host.componentInstance.presetFilters = [presetForName];
      host.componentInstance.filters = [stringPropertyFilter, enumPropertyFilter];
      const emitted: PropertyFilter[][] = [];
      renderFixture(host);
      bar(host).propertyFiltersChange.subscribe(filters => emitted.push(filters));
      await host.whenStable();
      renderFixture(host);

      expect(emitted).toEqual([[presetForName, enumPropertyFilter]]);
      expect(host.componentInstance.filters).toEqual([presetForName, enumPropertyFilter]);
      host.destroy();
    });

    it('does not emit at start-up when the result is what the host passed in', async () => {
      const host = TestBed.createComponent(TwoWayHostComponent);
      host.componentInstance.toggleFilters = asToggles(redToggle());
      // New but equal objects, in another order than the bar emits them (pills first, then toggles).
      host.componentInstance.filters = [redToggle(), stringPropertyFilter];
      renderFixture(host);
      vi.spyOn(bar(host).propertyFiltersChange, 'emit');
      await host.whenStable();
      expect(bar(host).propertyFiltersChange.emit).not.toHaveBeenCalled();
      host.destroy();
    });

    it('corrects the host value without NG0100 when a field turns semi-predefined', async () => {
      const host = TestBed.createComponent(TwoWayHostComponent);
      host.componentInstance.semiPredefinedFilters = [enumProperty];
      renderFixture(host);
      await host.whenStable();
      const key = Array.from(enumProperty.values.keys())[0];
      host.componentInstance.filters = [
        {
          operator: LogicalOperator.Or,
          criteria: [{ filterableProperty: enumProperty, operator: ComparisonOperator.DoesNotEqual, value: key }],
        },
        stringPropertyFilter,
      ];
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      expect(() => renderFixture(host)).not.toThrow();
      await host.whenStable();
      renderFixture(host);
      expect(host.componentInstance.filters).toEqual([stringPropertyFilter]);
      host.destroy();
    });

    it('tells the host when a toggle that is ON loses its field to a predefined filter', async () => {
      const host = TestBed.createComponent(TwoWayHostComponent);
      host.componentInstance.toggleFilters = asToggles(redToggle());
      host.componentInstance.filters = [redToggle()];
      renderFixture(host);
      await host.whenStable();
      expect(toggleState(host)).toBe('true');

      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      host.componentInstance.predefinedFilters = [enumProperty];
      expect(() => renderFixture(host)).not.toThrow();
      await host.whenStable();
      renderFixture(host);
      expect(host.componentInstance.filters).toEqual([]);
      expect(host.nativeElement.querySelector('[data-test-id="clear-all-button"]')).toBeNull();
      host.destroy();
    });

    it('lets a preset win over a bound filter for the same field at start-up', () => {
      const host = TestBed.createComponent(TwoWayHostComponent);
      const presetForName: PropertyFilter = {
        operator: LogicalOperator.And,
        criteria: [{ filterableProperty: stringProperty, operator: ComparisonOperator.Contains, value: 'preset' }],
      };
      host.componentInstance.presetFilters = [presetForName];
      host.componentInstance.filters = [stringPropertyFilter, enumPropertyFilter];
      renderFixture(host);
      expect(bar(host).propertyFilters).toEqual([presetForName, enumPropertyFilter]);

      // Presets are read once: a later change is ignored.
      host.componentInstance.presetFilters = [];
      renderFixture(host);
      expect(bar(host).propertyFilters).toEqual([presetForName, enumPropertyFilter]);
      host.destroy();
    });
  });

  it('separates predefined pills from user-added pills', () => {
    testContext.component.predefinedFilters = [stringProperty];
    renderFixture(testContext.fixture);
    const separator = () => testContext.fixture.nativeElement.querySelector('[data-test-id="filter-group-separator"]');
    expect(separator()).toBeNull();

    testContext.component.onFilterCriteriaChange(enumPropertyFilter);
    renderFixture(testContext.fixture);
    const element: HTMLElement = separator();
    expect(element.getAttribute('role')).toBe('separator');
    expect(element.previousElementSibling!.tagName).toBe('APPFX-MANAGE-FILTER');
    expect(element.nextElementSibling!.textContent).toContain(enumProperty.displayName);
  });

  it('reads Clear all once: its tooltip is visual only', () => {
    testContext.component.onFilterCriteriaChange(enumPropertyFilter);
    renderFixture(testContext.fixture);
    const clearAll: HTMLButtonElement = testContext.fixture.nativeElement.querySelector(
      '[data-test-id="clear-all-button"]'
    );
    clearAll.dispatchEvent(new Event('focus'));
    renderFixture(testContext.fixture);
    // The tooltip opened last (other tooltips may still be in the shared overlay container).
    const tooltips = document.querySelectorAll<HTMLElement>('.tooltip-content');
    const tooltip = tooltips[tooltips.length - 1];
    expect(clearAll.getAttribute('aria-label')).toBe(testContext.component.filterStrings.clearAllButtonAriaLabel);
    expect(tooltip.textContent.trim()).toBe(testContext.component.filterStrings.clearAllButtonAriaLabel);
    expect(tooltip.getAttribute('aria-hidden')).toBe('true');
    expect(clearAll.getAttribute('aria-describedby')).toBe('');
  });

  it('moves focus to Add filter after Clear all', async () => {
    testContext.component.onFilterCriteriaChange(enumPropertyFilter);
    renderFixture(testContext.fixture);
    const clearAll: HTMLButtonElement = testContext.fixture.nativeElement.querySelector(
      '[data-test-id="clear-all-button"]'
    );
    clearAll.focus();
    clearAll.click();
    renderFixture(testContext.fixture);
    await testContext.fixture.whenStable();
    expect(testContext.component.propertyFilters.length).toBe(0);
    expect(testContext.fixture.nativeElement.querySelector('[data-test-id="clear-all-button"]')).toBeNull();
    expect(document.activeElement).toBe(testContext.fixture.nativeElement.querySelector('[data-test-id="add-button"]'));
  });

  it('moves focus to the first filter after Clear all when Add filter is disabled', async () => {
    testContext.component.predefinedFilters = [...testContext.component.filterableProperties];
    renderFixture(testContext.fixture);
    testContext.component.onFilterCriteriaChange(enumPropertyFilter);
    renderFixture(testContext.fixture);
    const addButton: HTMLButtonElement = testContext.fixture.nativeElement.querySelector('[data-test-id="add-button"]');
    const clearAll: HTMLButtonElement = testContext.fixture.nativeElement.querySelector(
      '[data-test-id="clear-all-button"]'
    );
    clearAll.focus();
    clearAll.click();
    renderFixture(testContext.fixture);
    await testContext.fixture.whenStable();
    expect(addButton.disabled).toBe(true);
    const firstPill: HTMLButtonElement = testContext.fixture.nativeElement.querySelector('appfx-manage-filter button');
    expect(document.activeElement).toBe(firstPill);
  });

  it('moves focus to Add filter after a user-added pill is removed', async () => {
    testContext.component.onFilterCriteriaChange(enumPropertyFilter);
    renderFixture(testContext.fixture);
    const remove: HTMLButtonElement = testContext.fixture.nativeElement.querySelector('[data-test-id="remove-pill"]');
    remove.focus();
    remove.click();
    renderFixture(testContext.fixture);
    await testContext.fixture.whenStable();
    expect(testContext.component.propertyFilters.length).toBe(0);
    expect(document.activeElement).toBe(testContext.fixture.nativeElement.querySelector('[data-test-id="add-button"]'));
  });

  describe('toggle filters', () => {
    const toggles = () => Array.from(document.querySelectorAll<HTMLButtonElement>('[data-test-id="toggle-filter"]'));
    const equalsToggle = (): PropertyFilter => ({
      operator: LogicalOperator.Or,
      criteria: [{ filterableProperty: enumProperty, operator: ComparisonOperator.Equals, value: 'red' }],
    });

    it('shows FIELD: VALUE for Equals and FIELD: CONDITION VALUE otherwise', async () => {
      const notEquals: PropertyFilter = {
        operator: LogicalOperator.And,
        criteria: [{ filterableProperty: stringProperty, operator: ComparisonOperator.Contains, value: 'demo' }],
      };
      testContext.component.toggleFilters = asToggles(equalsToggle(), notEquals);
      renderFixture(testContext.fixture);
      expect(toggles().map(toggle => toggle.textContent.trim())).toEqual([
        `${enumProperty.displayName}: ${enumProperty.values.get('red')}`,
        `${stringProperty.displayName}: Contains demo`,
      ]);
      // Both fields are taken by toggles, so Add filter has nothing to offer.
      expect(await offeredFields(testContext.fixture)).toEqual([]);
    });

    it('gives toggle and field pill buttons the pill shape, for their hover background and focus outline', () => {
      testContext.component.toggleFilters = asToggles(equalsToggle());
      testContext.component.predefinedFilters = [stringProperty];
      renderFixture(testContext.fixture);
      const buttons = [toggles()[0], testContext.fixture.nativeElement.querySelector('.filter-pill')];
      for (const button of buttons) {
        const label = button.closest('clr-label')!;
        const labelStyle = getComputedStyle(label);
        const buttonStyle = getComputedStyle(button);
        expect(labelStyle.borderTopLeftRadius).not.toBe('0px');
        expect(buttonStyle.borderTopLeftRadius).toBe(labelStyle.borderTopLeftRadius);
        // The button fills the label's height inside its border, so all pill outlines line up.
        const borderHeight = parseFloat(labelStyle.borderTopWidth) + parseFloat(labelStyle.borderBottomWidth);
        expect(button.getBoundingClientRect().height).toBeCloseTo(
          label.getBoundingClientRect().height - borderHeight,
          0
        );
      }
    });

    it('shows Is empty without a value and joins criteria with the logical operator', () => {
      const isEmpty: PropertyFilter = {
        operator: LogicalOperator.And,
        criteria: [{ filterableProperty: stringProperty, operator: ComparisonOperator.IsEmpty, value: undefined }],
      };
      const redOrGreen: PropertyFilter = {
        operator: LogicalOperator.Or,
        criteria: [
          { filterableProperty: enumProperty, operator: ComparisonOperator.Equals, value: 'red' },
          { filterableProperty: enumProperty, operator: ComparisonOperator.Equals, value: 'green' },
        ],
      };
      testContext.component.toggleFilters = asToggles(isEmpty, redOrGreen);
      renderFixture(testContext.fixture);
      expect(toggles().map(toggle => toggle.textContent.trim())).toEqual([
        `${stringProperty.displayName}: Is empty`,
        `${enumProperty.displayName}: ${enumProperty.values.get('red')} Or ${enumProperty.values.get('green')}`,
      ]);
    });

    it('applies the filter only while ON', () => {
      const toggle = equalsToggle();
      testContext.component.toggleFilters = asToggles(toggle);
      renderFixture(testContext.fixture);
      vi.spyOn(testContext.component.propertyFiltersChange, 'emit').mockImplementation(() => undefined);
      expect(toggles()[0].getAttribute('aria-pressed')).toBe('false');
      expect(toggles()[0].closest('clr-label')!.classList).not.toContain('label-info');

      toggles()[0].click();
      renderFixture(testContext.fixture);
      expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledWith([toggle]);
      expect(toggles()[0].getAttribute('aria-pressed')).toBe('true');
      expect(toggles()[0].querySelector('cds-icon[shape="check"]')).toBeTruthy();
      expect(toggles()[0].closest('clr-label')!.classList).toContain('label-info');

      toggles()[0].click();
      renderFixture(testContext.fixture);
      expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledWith([]);
    });

    it('keeps the ON state when the host passes equal but new toggle objects', () => {
      const emitted: PropertyFilter[][] = [];
      testContext.component.propertyFiltersChange.subscribe(value => emitted.push(value));
      testContext.fixture.componentRef.setInput('toggleFilters', asToggles(equalsToggle()));
      renderFixture(testContext.fixture);
      toggles()[0].click();
      renderFixture(testContext.fixture);

      testContext.fixture.componentRef.setInput('toggleFilters', asToggles(equalsToggle()));
      renderFixture(testContext.fixture);
      expect(toggles()[0].getAttribute('aria-pressed')).toBe('true');

      toggles()[0].click();
      renderFixture(testContext.fixture);
      expect(toggles()[0].getAttribute('aria-pressed')).toBe('false');
      expect(emitted[emitted.length - 1]).toEqual([]);
    });

    it('drops the ON state of a toggle that is no longer configured', async () => {
      const emitted: PropertyFilter[][] = [];
      testContext.component.propertyFiltersChange.subscribe(value => emitted.push(value));
      testContext.fixture.componentRef.setInput('toggleFilters', asToggles(equalsToggle()));
      renderFixture(testContext.fixture);
      toggles()[0].click();
      expect(emitted[emitted.length - 1]).toEqual([equalsToggle()]);
      testContext.fixture.componentRef.setInput('toggleFilters', asToggles());
      renderFixture(testContext.fixture);
      expect(testContext.fixture.nativeElement.querySelector('[data-test-id="clear-all-button"]')).toBeNull();
      // The host is told the toggle is no longer applied, after change detection.
      await testContext.fixture.whenStable();
      expect(emitted[emitted.length - 1]).toEqual([]);
    });

    it('removes a preset with other criteria on a toggle field, with a warning', () => {
      const toggle = equalsToggle();
      const otherValue: PropertyFilter = {
        operator: LogicalOperator.Or,
        criteria: [{ filterableProperty: enumProperty, operator: ComparisonOperator.Equals, value: 'green' }],
      };
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      testContext.component.toggleFilters = asToggles(toggle);
      testContext.component.presetFilters = [otherValue, stringPropertyFilter];
      renderFixture(testContext.fixture);
      expect(toggles()[0].getAttribute('aria-pressed')).toBe('false');
      // The toggle owns its field, so only the filter on another field is kept.
      expect(testContext.component.propertyFilters).toEqual([stringPropertyFilter]);
      expect((console.warn as Mock).mock.lastCall![0]).toContain('Removed filters for: ' + enumProperty.property);
    });

    it('removes a host filter with other criteria on a toggle field and emits the corrected list', async () => {
      const toggle = equalsToggle();
      const otherValue: PropertyFilter = {
        operator: LogicalOperator.Or,
        criteria: [{ filterableProperty: enumProperty, operator: ComparisonOperator.Equals, value: 'green' }],
      };
      testContext.fixture.componentRef.setInput('toggleFilters', asToggles(toggle));
      renderFixture(testContext.fixture);
      await testContext.fixture.whenStable();
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      vi.spyOn(testContext.component.propertyFiltersChange, 'emit').mockImplementation(() => undefined);
      testContext.fixture.componentRef.setInput('propertyFilters', [otherValue, stringPropertyFilter]);
      renderFixture(testContext.fixture);
      await testContext.fixture.whenStable();
      expect(testContext.component.propertyFilters).toEqual([stringPropertyFilter]);
      expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledTimes(1);
      expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledWith([stringPropertyFilter]);
    });

    it('shows a label as given, with the criteria in the tooltip', () => {
      testContext.component.toggleFilters = [{ label: 'Only red', filter: equalsToggle() }];
      renderFixture(testContext.fixture);
      expect(toggles()[0].textContent.trim()).toBe('Only red');
      const tooltip: HTMLElement = testContext.fixture.nativeElement.querySelector('clr-tooltip-content');
      expect(tooltip.textContent.trim()).toBe(`${enumProperty.displayName}: ${enumProperty.values.get('red')}`);
    });

    it('falls back to the criteria text for an empty label', () => {
      testContext.component.toggleFilters = [{ label: '  ', filter: equalsToggle() }];
      renderFixture(testContext.fixture);
      expect(toggles()[0].textContent.trim()).toBe(`${enumProperty.displayName}: ${enumProperty.values.get('red')}`);
    });

    it('emits only the filter of a labelled toggle', () => {
      const toggle = equalsToggle();
      testContext.component.toggleFilters = [{ label: 'Only red', filter: toggle }];
      renderFixture(testContext.fixture);
      vi.spyOn(testContext.component.propertyFiltersChange, 'emit').mockImplementation(() => undefined);
      toggles()[0].click();
      expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledWith([toggle]);
    });

    it('renders when the array inputs are undefined', () => {
      testContext.fixture.componentRef.setInput('toggleFilters', undefined);
      testContext.fixture.componentRef.setInput('semiPredefinedFilters', undefined);
      testContext.fixture.componentRef.setInput('predefinedFilters', undefined);
      expect(() => renderFixture(testContext.fixture)).not.toThrow();
      expect(testContext.component.toggleFilters).toEqual([]);
      expect(testContext.fixture.nativeElement.querySelector('[data-test-id="add-button"]')).toBeTruthy();
    });

    it('starts ON from a preset and is turned OFF by Clear all', () => {
      const toggle = equalsToggle();
      testContext.component.toggleFilters = asToggles(toggle);
      testContext.component.presetFilters = [equalsToggle()];
      renderFixture(testContext.fixture);
      expect(toggles()[0].getAttribute('aria-pressed')).toBe('true');
      expect(testContext.component.propertyFilters.length).toBe(0);

      testContext.fixture.nativeElement.querySelector('[data-test-id="clear-all-button"]').click();
      renderFixture(testContext.fixture);
      expect(toggles()[0].getAttribute('aria-pressed')).toBe('false');
    });
  });

  describe('field precedence', () => {
    const enumToggle = (value: string): PropertyFilter => ({
      operator: LogicalOperator.Or,
      criteria: [{ filterableProperty: enumProperty, operator: ComparisonOperator.Equals, value }],
    });

    it('keeps a field in predefinedFilters over semi-predefined and toggle filters', () => {
      testContext.component.predefinedFilters = [enumProperty];
      testContext.component.semiPredefinedFilters = [enumProperty];
      testContext.component.toggleFilters = asToggles(enumToggle('red'));
      renderFixture(testContext.fixture);
      expect(testContext.component.predefinedFilters).toEqual([enumProperty]);
      expect(testContext.component.semiPredefinedFilters).toEqual([]);
      expect(testContext.component.toggleFilters).toEqual([]);
      expect(document.querySelectorAll('[data-test-id="toggle-filter"]').length).toBe(0);
    });

    it('keeps a semi-predefined field over a toggle', () => {
      testContext.component.semiPredefinedFilters = [enumProperty];
      testContext.component.toggleFilters = asToggles(enumToggle('red'));
      expect(testContext.component.semiPredefinedFilters).toEqual([enumProperty]);
      expect(testContext.component.toggleFilters).toEqual([]);
    });

    it('keeps only the first toggle per field', () => {
      const first = enumToggle('red');
      testContext.component.toggleFilters = asToggles(first, enumToggle('blue'));
      expect(testContext.component.toggleFilters).toEqual(asToggles(first));
    });

    it('restores an ignored entry when the conflicting one is removed', () => {
      testContext.component.toggleFilters = asToggles(enumToggle('red'));
      testContext.component.predefinedFilters = [enumProperty];
      expect(testContext.component.toggleFilters).toEqual([]);
      testContext.component.predefinedFilters = [];
      expect(testContext.component.toggleFilters.length).toBe(1);
    });

    it('warns about ignored entries', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      testContext.component.predefinedFilters = [enumProperty];
      testContext.component.semiPredefinedFilters = [enumProperty];
      testContext.component.ngOnChanges({ semiPredefinedFilters: new SimpleChange(undefined, [enumProperty], true) });
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect((console.warn as Mock).mock.lastCall![0]).toContain(`semiPredefinedFilters: ${enumProperty.property}`);
    });

    it('ignores semi-predefined presets that do not select options', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const key = Array.from(enumProperty.values.keys())[0];
      const notEquals: PropertyFilter = {
        operator: LogicalOperator.Or,
        criteria: [{ filterableProperty: enumProperty, operator: ComparisonOperator.DoesNotEqual, value: key }],
      };
      testContext.component.semiPredefinedFilters = [enumProperty];
      testContext.component.presetFilters = [notEquals];
      renderFixture(testContext.fixture);
      expect(testContext.component.propertyFilters).toEqual([]);
      expect((console.warn as Mock).mock.lastCall![0]).toContain('Removed filters for: ' + enumProperty.property);
    });

    it('keeps semi-predefined presets that select options', () => {
      const [first, second] = Array.from(enumProperty.values.keys());
      const selection: PropertyFilter = {
        operator: LogicalOperator.Or,
        criteria: [first, second].map(value => ({
          filterableProperty: enumProperty,
          operator: ComparisonOperator.Equals,
          value,
        })),
      };
      testContext.component.semiPredefinedFilters = [enumProperty];
      testContext.component.presetFilters = [selection];
      renderFixture(testContext.fixture);
      expect(testContext.component.propertyFilters).toEqual([selection]);
      renderFixture(testContext.fixture);
      expect(optionPressed(enumProperty.values.get(first)!)).toBe('true');
    });

    it('removes a filter that becomes invalid when its field turns semi-predefined', async () => {
      const key = Array.from(enumProperty.values.keys())[0];
      const notEquals: PropertyFilter = {
        operator: LogicalOperator.Or,
        criteria: [{ filterableProperty: enumProperty, operator: ComparisonOperator.DoesNotEqual, value: key }],
      };
      const valid = stringPropertyFilter;
      testContext.component.presetFilters = [notEquals, valid];
      renderFixture(testContext.fixture);
      await testContext.fixture.whenStable();
      expect(testContext.component.propertyFilters).toEqual([notEquals, valid]);
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      vi.spyOn(testContext.component.propertyFiltersChange, 'emit').mockImplementation(() => undefined);
      testContext.component.semiPredefinedFilters = [enumProperty];
      testContext.component.ngOnChanges({ semiPredefinedFilters: new SimpleChange([], [enumProperty], false) });
      expect(testContext.component.propertyFilters).toEqual([valid]);
      // Emitted after change detection, not from ngOnChanges.
      expect(testContext.component.propertyFiltersChange.emit).not.toHaveBeenCalled();
      await testContext.fixture.whenStable();
      expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledTimes(1);
      expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledWith([valid]);
      expect((console.warn as Mock).mock.lastCall![0]).toContain('Removed filters for: ' + enumProperty.property);
    });

    it('keeps a valid option selection when its field turns semi-predefined', () => {
      const key = Array.from(enumProperty.values.keys())[0];
      const equals: PropertyFilter = {
        operator: LogicalOperator.Or,
        criteria: [{ filterableProperty: enumProperty, operator: ComparisonOperator.Equals, value: key }],
      };
      testContext.component.presetFilters = [equals];
      renderFixture(testContext.fixture);
      vi.spyOn(testContext.component.propertyFiltersChange, 'emit').mockImplementation(() => undefined);
      // setInput runs ngOnChanges and re-renders the OnPush view.
      testContext.fixture.componentRef.setInput('semiPredefinedFilters', [enumProperty]);
      renderFixture(testContext.fixture);
      expect(testContext.component.propertyFilters).toEqual([equals]);
      expect(testContext.component.propertyFiltersChange.emit).not.toHaveBeenCalled();
      expect(optionPressed(enumProperty.values.get(key)!)).toBe('true');
    });

    it('does not warn without conflicts', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      testContext.component.predefinedFilters = [stringProperty];
      testContext.component.semiPredefinedFilters = [enumProperty];
      testContext.component.ngOnChanges({ semiPredefinedFilters: new SimpleChange(undefined, [enumProperty], true) });
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('semi-predefined filters', () => {
    const options = () =>
      Array.from(document.querySelectorAll<HTMLButtonElement>('[data-test-id="semi-filter-option"]'));

    beforeEach(() => {
      testContext.component.predefinedFilters = [stringProperty];
      testContext.component.semiPredefinedFilters = [enumProperty];
      renderFixture(testContext.fixture);
    });

    it('renders the field label and one pill per option, after the predefined pills', async () => {
      const group: HTMLElement = testContext.fixture.nativeElement.querySelector('[data-test-id="semi-filter-group"]');
      expect(group.querySelector('.semi-filter-label')!.textContent!.trim()).toBe(enumProperty.displayName + ':');
      expect(options().map(option => option.textContent.trim())).toEqual(Array.from(enumProperty.values.values()));
      expect(group.previousElementSibling!.getAttribute('role')).toBe('separator');
      // Name is predefined and Status semi-predefined, so Add filter has nothing to offer.
      expect(await offeredFields(testContext.fixture)).toEqual([]);
    });

    it('separates multiple semi-predefined filters', () => {
      const second = new EnumPropertyDefinition('Kind', 'kind', new Map([['a', 'A']]));
      testContext.fixture.componentRef.setInput('semiPredefinedFilters', [enumProperty, second]);
      renderFixture(testContext.fixture);
      const groups = testContext.fixture.nativeElement.querySelectorAll('[data-test-id="semi-filter-group"]');
      expect(groups.length).toBe(2);
      expect(groups[1].previousElementSibling.getAttribute('role')).toBe('separator');
    });

    it('toggles options instantly and combines them with OR', () => {
      vi.spyOn(testContext.component.propertyFiltersChange, 'emit').mockImplementation(() => undefined);
      const keys = Array.from(enumProperty.values.keys());
      options()[0].click();
      options()[1].click();
      renderFixture(testContext.fixture);
      const emitted: PropertyFilter[] = (testContext.component.propertyFiltersChange.emit as Mock).mock.lastCall![0];
      const filter = emitted.find(
        (candidate: PropertyFilter) => candidate.criteria[0].filterableProperty.property === enumProperty.property
      )!;
      expect(filter.operator).toBe(LogicalOperator.Or);
      expect(filter.criteria.map(predicate => predicate.value)).toEqual(keys.slice(0, 2));
      expect(options()[0].getAttribute('aria-pressed')).toBe('true');
      expect(options()[0].querySelector('cds-icon[shape="check"]')).toBeTruthy();
      expect(options()[0].closest('clr-label')!.classList).toContain('label-info');
      // Semi-predefined filters are not user-added pills.
      expect(testContext.fixture.nativeElement.querySelector('[data-test-id="hide-filters"]')).toBeNull();
      expect(testContext.fixture.nativeElement.querySelectorAll('appfx-manage-filter').length).toBe(1);

      options()[0].click();
      options()[1].click();
      renderFixture(testContext.fixture);
      expect((testContext.component.propertyFiltersChange.emit as Mock).mock.lastCall![0]).toEqual([]);
      expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledTimes(4);
    });

    it('is cleared by Clear all', () => {
      options()[0].click();
      renderFixture(testContext.fixture);
      testContext.fixture.nativeElement.querySelector('[data-test-id="clear-all-button"]').click();
      renderFixture(testContext.fixture);
      expect(options().every(option => option.getAttribute('aria-pressed') === 'false')).toBe(true);
    });
  });

  it('displays property filters', () => {
    testContext.component.propertyFilters.push(stringPropertyFilter);
    testContext.component.propertyFilters.push(enumPropertyFilter);
    renderFixture(testContext.fixture);
    expect(testContext.component.propertyFilters.length).toEqual(2);
    const propertyFilterElements: HTMLElement[] =
      testContext.fixture.debugElement.nativeElement.querySelectorAll('appfx-manage-filter');
    const clearAllButtonElement: HTMLButtonElement = testContext.fixture.debugElement.nativeElement.querySelector(
      'button[data-test-id="clear-all-button"]'
    );
    expect(propertyFilterElements.length).toEqual(2);
    expect(clearAllButtonElement).toBeTruthy();
  });
  it('emits property filter change event', () => {
    vi.spyOn(testContext.component.propertyFiltersChange, 'emit').mockImplementation(() => undefined);
    testContext.component.onFilterCriteriaChange(stringPropertyFilter);
    expect(testContext.component.propertyFilters.length).toEqual(1);
    expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledWith([stringPropertyFilter]);
    testContext.component.onFilterCriteriaChange(enumPropertyFilter);
    expect(testContext.component.propertyFilters.length).toEqual(2);
    expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledWith([
      stringPropertyFilter,
      enumPropertyFilter,
    ]);

    const modifiedStringFilter = new PropertyFilter();
    modifiedStringFilter.criteria = [stringPredicate1];
    modifiedStringFilter.operator = LogicalOperator.And;
    testContext.component.onFilterCriteriaChange(modifiedStringFilter);
    expect(testContext.component.propertyFilters.length).toEqual(2);
    expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledWith([
      modifiedStringFilter,
      enumPropertyFilter,
    ]);

    modifiedStringFilter.criteria.splice(0);
    testContext.component.onFilterCriteriaChange(modifiedStringFilter);
    expect(testContext.component.propertyFilters.length).toEqual(1);
    expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledWith([enumPropertyFilter]);
  });
  it('removes all filters on clear all click', () => {
    vi.spyOn(testContext.component.propertyFiltersChange, 'emit').mockImplementation(() => undefined);
    testContext.component.propertyFilters.push(stringPropertyFilter);
    testContext.component.propertyFilters.push(enumPropertyFilter);
    renderFixture(testContext.fixture);
    const clearAllButtonElement: HTMLButtonElement = testContext.fixture.debugElement.nativeElement.querySelector(
      'button[data-test-id="clear-all-button"]'
    );
    expect(clearAllButtonElement).toBeTruthy();
    clearAllButtonElement.click();
    renderFixture(testContext.fixture);
    expect(testContext.component.propertyFilters.length).toEqual(0);
    expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledWith([]);
  });
  it('shows/hides the display filters on show/hide button click', () => {
    testContext.component.propertyFilters.push(stringPropertyFilter);
    testContext.component.propertyFilters.push(enumPropertyFilter);
    renderFixture(testContext.fixture);
    const hideButtonElement: HTMLButtonElement = testContext.fixture.debugElement.nativeElement.querySelector(
      'button[data-test-id="hide-filters"]'
    );
    expect(hideButtonElement).toBeTruthy();
    expect(hideButtonElement.innerText.trim()).toEqual('HIDE');
    expect(hideButtonElement.getAttribute(ariaLabelAttributeName)).toEqual('Hide filters');

    hideButtonElement.click();
    renderFixture(testContext.fixture);
    const propertyFilterElements: HTMLElement[] =
      testContext.fixture.debugElement.nativeElement.querySelectorAll('appfx-manage-filter');
    expect(hideButtonElement.innerText.trim()).toEqual('SHOW(2)');
    expect(hideButtonElement.getAttribute(ariaLabelAttributeName)).toEqual('Show 2 filters');
    expect(propertyFilterElements.length).toEqual(2);
    expect(propertyFilterElements[0].hasAttribute('hidden')).toBeTruthy();
    expect(propertyFilterElements[1].hasAttribute('hidden')).toBeTruthy();

    hideButtonElement.click();
    renderFixture(testContext.fixture);
    expect(hideButtonElement.innerText.trim()).toEqual('HIDE');
    expect(hideButtonElement.getAttribute(ariaLabelAttributeName)).toEqual('Hide filters');
    expect(propertyFilterElements.length).toEqual(2);
    expect(propertyFilterElements[0].hasAttribute('hidden')).toBeFalsy();
    expect(propertyFilterElements[1].hasAttribute('hidden')).toBeFalsy();
  });
});

/** Display names of the fields Add filter offers, read from its combobox. Empty when Add filter is disabled. */
async function offeredFields(fixture: ComponentFixture<CompositeFiltersComponent>): Promise<string[]> {
  renderFixture(fixture);
  if (fixture.nativeElement.querySelector('button[data-test-id="add-button"]').disabled) {
    return [];
  }
  await openAddFilter(fixture);
  document.querySelector<HTMLButtonElement>('.filter-popover .clr-combobox-trigger')!.click();
  renderFixture(fixture);
  await fixture.whenStable();
  renderFixture(fixture);
  // Each option also has a screen-reader-only state ("Selected"); read only the visible label.
  return Array.from(document.querySelectorAll<HTMLElement>('clr-option')).map(option => {
    const label = option.cloneNode(true) as HTMLElement;
    label.querySelectorAll('.clr-sr-only').forEach(hidden => hidden.remove());
    return label.textContent.trim();
  });
}

async function openAddFilter(fixture: ComponentFixture<CompositeFiltersComponent>): Promise<void> {
  renderFixture(fixture);
  fixture.nativeElement.querySelector('button[data-test-id="add-button"]').click();
  renderFixture(fixture);
  await fixture.whenStable();
  renderFixture(fixture);
}

async function selectField(fixture: ComponentFixture<CompositeFiltersComponent>, displayName: string): Promise<void> {
  document.querySelector<HTMLButtonElement>('.filter-popover .clr-combobox-trigger')!.click();
  renderFixture(fixture);
  await fixture.whenStable();
  renderFixture(fixture);
  const input = document.querySelector<HTMLInputElement>('.filter-popover .clr-combobox-input')!;
  input.value = displayName;
  input.dispatchEvent(new Event('input'));
  renderFixture(fixture);
  await fixture.whenStable();
  renderFixture(fixture);
  const options = document.querySelectorAll<HTMLElement>('clr-option');
  expect(options.length).toBe(1);
  expect(options[0].textContent).toContain(displayName);
  options[0].click();
  renderFixture(fixture);
  await fixture.whenStable();
  renderFixture(fixture);
}

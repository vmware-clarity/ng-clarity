/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { A11yModule as CdkA11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ClrBadge } from '@clr/angular/emphasis/badge';
import { ClrLabel } from '@clr/angular/emphasis/label';
import { ClrCheckboxModule, ClrCombobox, ClrComboboxModule, ClrInputModule, ClrSelectModule } from '@clr/angular/forms';
import { ClrIcon } from '@clr/angular/icon';
import { ClrPopoverModuleNext } from '@clr/angular/popover/common';
import { ClrSignpostModule } from '@clr/angular/popover/signpost';
import { ClrTooltipModule } from '@clr/angular/popover/tooltip';

import { EnumFilterComponent } from './advanced-filters/enum-filter.component';
import { FilterFormComponent } from './advanced-filters/filter-form.component';
import { GeneralFilterComponent } from './advanced-filters/general-filter.component';
import { CompositeFiltersComponent } from './composite-filters.component';
import { DatagridFiltersStrings } from './datagrid-filters-strings.service';
import { DismissableDirective } from './manage-filters/dismissable.directive';
import { ManageFilterComponent } from './manage-filters/manage-filter.component';
import { ComparisonOperator, LogicalOperator, PropertyType } from './model/datagrid-filters.enums';
import {
  EnumPropertyDefinition,
  PropertyFilter,
  PropertyPredicate,
  StringPropertyDefinition,
} from './model/datagrid-filters.interfaces';
import { SkipFiltersPipe } from './skip-filters.pipe';

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

export interface ThisTest {
  fixture: ComponentFixture<CompositeFiltersComponent>;
  component: CompositeFiltersComponent;
}

describe('CompositeFiltersComponent', () => {
  beforeEach(function (this: ThisTest) {
    TestBed.configureTestingModule({
      imports: [
        ClrBadge,
        ClrLabel,
        ClrCheckboxModule,
        ClrComboboxModule,
        ClrInputModule,
        ClrSelectModule,
        ClrSignpostModule,
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
        DismissableDirective,
        EnumFilterComponent,
        FilterFormComponent,
        ManageFilterComponent,
        SkipFiltersPipe,
        GeneralFilterComponent,
      ],
      providers: [DatagridFiltersStrings],
    });
    this.fixture = TestBed.createComponent(CompositeFiltersComponent);
    this.component = this.fixture.componentInstance;
    this.component.filterableProperties = filterableProperties;
  });

  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });

  it('shows empty predefined pills without emitting active filters', function (this: ThisTest) {
    this.component.predefinedFilters = [stringProperty];
    spyOn(this.component.propertyFiltersChange, 'emit');
    this.fixture.detectChanges();
    const pill = this.fixture.nativeElement.querySelector('.filter-pill');
    expect(pill.textContent.trim()).toBe(stringProperty.displayName);
    expect(pill.classList.contains('filter-pill-active')).toBeFalse();
    expect(this.component.propertyFilters).toEqual([]);
    expect(this.component.propertyFiltersChange.emit).not.toHaveBeenCalled();
    expect(this.component.availableProperties).toEqual([enumProperty]);
    expect(this.component.selectedFilterableProperty).toBe(enumProperty);
  });

  it('deduplicates predefined fields and presets by property key', function (this: ThisTest) {
    const equivalentProperty = new StringPropertyDefinition('Another label', stringProperty.property);
    this.component.predefinedFilters = [stringProperty, equivalentProperty];
    this.component.presetFilters = [stringPropertyFilter];
    this.fixture.detectChanges();
    expect(this.fixture.nativeElement.querySelectorAll('.filter-pill').length).toBe(1);
    expect(this.component.propertyFilters).toEqual([stringPropertyFilter]);
    expect(this.component.availableProperties).toEqual([enumProperty]);
  });

  it('keeps predefined pills visible when hiding and clearing active filters', function (this: ThisTest) {
    this.component.predefinedFilters = [stringProperty];
    this.component.presetFilters = [stringPropertyFilter, enumPropertyFilter];
    spyOn(this.component.propertyFiltersChange, 'emit');
    this.fixture.detectChanges();
    this.fixture.nativeElement.querySelector('[data-test-id="hide-filters"]').click();
    this.fixture.detectChanges();
    const pills = this.fixture.nativeElement.querySelectorAll('appfx-manage-filter');
    expect(pills[0].hidden).toBeFalse();
    expect(pills[1].hidden).toBeTrue();
    this.fixture.nativeElement.querySelector('[data-test-id="clear-all-button"]').click();
    this.fixture.detectChanges();
    expect(this.fixture.nativeElement.querySelectorAll('.filter-pill').length).toBe(1);
    expect(this.fixture.nativeElement.querySelector('.filter-pill').textContent.trim()).toBe(
      stringProperty.displayName
    );
    expect(this.component.propertyFiltersChange.emit).toHaveBeenCalledWith([]);
    expect(this.component.presetFilters[0].criteria.length).toBe(2);
  });

  it('disables Add New when every property has a predefined pill', function (this: ThisTest) {
    this.component.predefinedFilters = filterableProperties;
    this.fixture.detectChanges();
    expect(this.fixture.nativeElement.querySelector('[data-test-id="add-button"]').disabled).toBeTrue();
  });

  it('updates the predefined list without dropping active criteria', function (this: ThisTest) {
    this.fixture.componentRef.setInput('predefinedFilters', [stringProperty]);
    this.component.presetFilters = [stringPropertyFilter];
    this.fixture.detectChanges();
    this.fixture.componentRef.setInput('predefinedFilters', [enumProperty]);
    this.fixture.detectChanges();
    expect(this.component.visibleProperties).toEqual([enumProperty, stringProperty]);
    expect(this.component.propertyFilters).toEqual([stringPropertyFilter]);
  });

  it('applies and clears a predefined filter through its popover', async function (this: ThisTest) {
    this.component.predefinedFilters = [stringProperty];
    spyOn(this.component.propertyFiltersChange, 'emit');
    this.fixture.detectChanges();
    const trigger: HTMLButtonElement = this.fixture.nativeElement.querySelector('.filter-pill');
    trigger.click();
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    this.fixture.detectChanges();
    const input: HTMLInputElement = document.querySelector('input[formControlName="value"]');
    input.value = 'Demo';
    input.dispatchEvent(new Event('input'));
    this.fixture.detectChanges();
    document.querySelector<HTMLButtonElement>('[data-test-id="submitBtn"]').click();
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    this.fixture.detectChanges();
    expect(trigger.textContent.trim()).toBe(`${stringProperty.displayName}: Contains Demo`);
    expect(trigger.classList.contains('filter-pill-active')).toBeTrue();
    expect(this.component.propertyFilters[0].criteria[0].value).toBe('Demo');
    trigger.click();
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    this.fixture.detectChanges();
    document.querySelector<HTMLButtonElement>('[data-test-id="clear-filter"]').click();
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    this.fixture.detectChanges();
    expect(this.fixture.nativeElement.querySelector('.filter-pill')).toBe(trigger);
    expect(trigger.textContent.trim()).toBe(stringProperty.displayName);
    expect(trigger.classList.contains('filter-pill-active')).toBeFalse();
    expect(this.component.propertyFiltersChange.emit).toHaveBeenCalledWith([]);
    expect(document.activeElement).toBe(trigger);
  });
  it('is properly initialized', function (this: ThisTest) {
    this.fixture.detectChanges();
    expect(this.component).toBeTruthy();
    expect(this.component.selectedFilterableProperty).toEqual(stringProperty);
    expect(this.component.propertyType).toEqual(PropertyType.String);
    expect(this.component.stringProperty).toEqual(stringProperty);
  });
  it('searches fields in the combobox and switches to the selected editor', async function (this: ThisTest) {
    await openAddFilter(this.fixture);
    expect(this.component.signPostOpened).toBeTruthy();
    await selectField(this.fixture, enumProperty.displayName);
    expect(this.component.selectedFilterableProperty).toEqual(filterableProperties[1]);
    expect(this.component.propertyType).toEqual(PropertyType.Enum);
    expect(this.component.enumProperty).toEqual(enumProperty);
    expect(document.querySelector('appfx-general-filter')).toBeNull();
    expect(document.querySelector('appfx-enum-filter')).not.toBeNull();
    expect(this.component.signPostOpened).toBeTrue();
    expect(document.activeElement).toBe(document.querySelector('.filter-popover .clr-combobox-input'));
  });
  it('discards the draft when switching between fields of the same type', async function (this: ThisTest) {
    const otherProperty = new StringPropertyDefinition('Description', 'description', [ComparisonOperator.Equals]);
    this.component.filterableProperties = [stringProperty, otherProperty];
    spyOn(this.component.propertyFiltersChange, 'emit');
    await openAddFilter(this.fixture);
    const input: HTMLInputElement = document.querySelector('input[formControlName="value"]');
    input.value = 'Draft name';
    input.dispatchEvent(new Event('input'));
    this.fixture.detectChanges();
    document.querySelector<HTMLButtonElement>('.filter-popover [data-test-id="add-button"]').click();
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    this.fixture.detectChanges();

    await selectField(this.fixture, otherProperty.displayName);

    expect(document.querySelector<HTMLInputElement>('input[formControlName="value"]').value).toBe('');
    expect(document.querySelectorAll('.filter-condition-row').length).toBe(1);
    expect(document.querySelector<HTMLSelectElement>('select[formControlName="operator"]').options.length).toBe(1);
    expect(document.querySelector<HTMLButtonElement>('[data-test-id="submitBtn"]').disabled).toBeTrue();
    expect(this.component.propertyFiltersChange.emit).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(document.querySelector('.filter-popover .clr-combobox-input'));
  });
  it('keeps the field picker available after a cleared selection', async function (this: ThisTest) {
    await openAddFilter(this.fixture);
    const picker = this.fixture.debugElement.query(By.directive(ClrCombobox));
    picker.triggerEventHandler('ngModelChange', null);
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    this.fixture.detectChanges();
    expect(document.querySelector('appfx-general-filter')).toBeNull();
    expect(document.querySelector<HTMLButtonElement>('[data-test-id="submitBtn"]').disabled).toBeTrue();
    expect(document.querySelector('[data-test-id="cancelBtn"]')).not.toBeNull();
    expect(document.querySelector('.filter-popover clr-combobox')).not.toBeNull();
    expect(document.activeElement).toBe(document.querySelector('.filter-popover .clr-combobox-input'));

    await selectField(this.fixture, stringProperty.displayName);

    expect(this.component.selectedFilterableProperty).toBe(stringProperty);
    expect(document.querySelector('appfx-general-filter')).not.toBeNull();
    expect(this.component.signPostOpened).toBeTrue();
    expect(document.activeElement).toBe(document.querySelector('.filter-popover .clr-combobox-input'));
  });
  it('does not move focus when changing the field with the popover closed', async function (this: ThisTest) {
    this.fixture.detectChanges();
    const trigger: HTMLButtonElement = this.fixture.nativeElement.querySelector('[data-test-id="add-button"]');
    trigger.focus();
    this.component.selectedFilterableProperty = enumProperty;
    this.component.onPropertyChange();
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    expect(document.activeElement).toBe(trigger);
    expect(document.querySelector('.filter-popover')).toBeNull();
  });
  it('separates predefined pills from user-added pills', function (this: ThisTest) {
    this.component.predefinedFilters = [stringProperty];
    this.fixture.detectChanges();
    const separator = () => this.fixture.nativeElement.querySelector('[data-test-id="filter-group-separator"]');
    expect(separator()).toBeNull();

    this.component.onFilterCriteriaChange(enumPropertyFilter);
    this.fixture.detectChanges();
    const element: HTMLElement = separator();
    expect(element.getAttribute('role')).toBe('separator');
    expect(element.previousElementSibling.tagName).toBe('APPFX-MANAGE-FILTER');
    expect(element.nextElementSibling.textContent).toContain(enumProperty.displayName);
  });

  it('moves focus to Add filter after a user-added pill is removed', async function (this: ThisTest) {
    this.component.onFilterCriteriaChange(enumPropertyFilter);
    this.fixture.detectChanges();
    const remove: HTMLButtonElement = this.fixture.nativeElement.querySelector('[data-test-id="remove-pill"]');
    remove.focus();
    remove.click();
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    expect(this.component.propertyFilters.length).toBe(0);
    expect(document.activeElement).toBe(this.fixture.nativeElement.querySelector('[data-test-id="add-button"]'));
  });

  describe('toggle filters', () => {
    const toggles = () => Array.from(document.querySelectorAll<HTMLButtonElement>('[data-test-id="toggle-filter"]'));
    const equalsToggle = (): PropertyFilter => ({
      operator: LogicalOperator.Or,
      criteria: [{ filterableProperty: enumProperty, operator: ComparisonOperator.Equals, value: 'red' }],
    });

    it('shows FIELD: VALUE for Equals and FIELD: CONDITION VALUE otherwise', function (this: ThisTest) {
      const notEquals: PropertyFilter = {
        operator: LogicalOperator.And,
        criteria: [{ filterableProperty: stringProperty, operator: ComparisonOperator.Contains, value: 'demo' }],
      };
      this.component.toggleFilters = [equalsToggle(), notEquals];
      this.fixture.detectChanges();
      expect(toggles().map(toggle => toggle.textContent.trim())).toEqual([
        `${enumProperty.displayName}: ${enumProperty.values.get('red')}`,
        `${stringProperty.displayName}: Contains demo`,
      ]);
      expect(this.component.availableProperties).not.toContain(enumProperty);
      expect(this.component.availableProperties).not.toContain(stringProperty);
    });

    it('applies the filter only while ON', function (this: ThisTest) {
      const toggle = equalsToggle();
      this.component.toggleFilters = [toggle];
      this.fixture.detectChanges();
      spyOn(this.component.propertyFiltersChange, 'emit');
      expect(toggles()[0].getAttribute('aria-pressed')).toBe('false');
      expect(toggles()[0].closest('clr-label').classList).not.toContain('label-info');

      toggles()[0].click();
      this.fixture.detectChanges();
      expect(this.component.propertyFiltersChange.emit).toHaveBeenCalledWith([toggle]);
      expect(toggles()[0].getAttribute('aria-pressed')).toBe('true');
      expect(toggles()[0].querySelector('cds-icon[shape="check"]')).toBeTruthy();
      expect(toggles()[0].closest('clr-label').classList).toContain('label-info');

      toggles()[0].click();
      this.fixture.detectChanges();
      expect(this.component.propertyFiltersChange.emit).toHaveBeenCalledWith([]);
    });

    it('keeps the ON state when the host passes equal but new toggle objects', function (this: ThisTest) {
      const emitted: PropertyFilter[][] = [];
      this.component.propertyFiltersChange.subscribe(value => emitted.push(value));
      this.fixture.componentRef.setInput('toggleFilters', [equalsToggle()]);
      this.fixture.detectChanges();
      toggles()[0].click();
      this.fixture.detectChanges();

      this.fixture.componentRef.setInput('toggleFilters', [equalsToggle()]);
      this.fixture.detectChanges();
      expect(toggles()[0].getAttribute('aria-pressed')).toBe('true');

      toggles()[0].click();
      this.fixture.detectChanges();
      expect(toggles()[0].getAttribute('aria-pressed')).toBe('false');
      expect(emitted[emitted.length - 1]).toEqual([]);
    });

    it('drops the ON state of a toggle that is no longer configured', function (this: ThisTest) {
      const emitted: PropertyFilter[][] = [];
      this.component.propertyFiltersChange.subscribe(value => emitted.push(value));
      this.fixture.componentRef.setInput('toggleFilters', [equalsToggle()]);
      this.fixture.detectChanges();
      toggles()[0].click();
      this.fixture.componentRef.setInput('toggleFilters', []);
      this.fixture.detectChanges();
      expect(this.component.hasActiveCriteria).toBeFalse();
      this.component.clearFilter(stringProperty);
      expect(emitted[emitted.length - 1]).toEqual([]);
    });

    it('turns a toggle ON only for a preset with the same criteria', function (this: ThisTest) {
      const toggle = equalsToggle();
      const otherValue: PropertyFilter = {
        operator: LogicalOperator.Or,
        criteria: [{ filterableProperty: enumProperty, operator: ComparisonOperator.Equals, value: 'green' }],
      };
      this.component.toggleFilters = [toggle];
      this.component.presetFilters = [otherValue];
      this.fixture.detectChanges();
      expect(this.component.isToggleOn(toggle)).toBeFalse();
      // The preset is kept as a normal pill with its own value.
      expect(this.component.propertyFilters).toEqual([otherValue]);
    });

    it('renders when the array inputs are undefined', function (this: ThisTest) {
      this.fixture.componentRef.setInput('toggleFilters', undefined);
      this.fixture.componentRef.setInput('semiPredefinedFilters', undefined);
      this.fixture.componentRef.setInput('predefinedFilters', undefined);
      expect(() => this.fixture.detectChanges()).not.toThrow();
      expect(this.component.toggleFilters).toEqual([]);
      expect(this.fixture.nativeElement.querySelector('[data-test-id="add-button"]')).toBeTruthy();
    });

    it('starts ON from a preset and is turned OFF by Clear all', function (this: ThisTest) {
      const toggle = equalsToggle();
      this.component.toggleFilters = [toggle];
      this.component.presetFilters = [equalsToggle()];
      this.fixture.detectChanges();
      expect(this.component.isToggleOn(toggle)).toBeTrue();
      expect(this.component.propertyFilters.length).toBe(0);

      this.fixture.nativeElement.querySelector('[data-test-id="clear-all-button"]').click();
      this.fixture.detectChanges();
      expect(this.component.isToggleOn(toggle)).toBeFalse();
    });
  });

  describe('field precedence', () => {
    const enumToggle = (value: string): PropertyFilter => ({
      operator: LogicalOperator.Or,
      criteria: [{ filterableProperty: enumProperty, operator: ComparisonOperator.Equals, value }],
    });

    it('keeps a field in predefinedFilters over semi-predefined and toggle filters', function (this: ThisTest) {
      this.component.predefinedFilters = [enumProperty];
      this.component.semiPredefinedFilters = [enumProperty];
      this.component.toggleFilters = [enumToggle('red')];
      this.fixture.detectChanges();
      expect(this.component.predefinedFilters).toEqual([enumProperty]);
      expect(this.component.semiPredefinedFilters).toEqual([]);
      expect(this.component.toggleFilters).toEqual([]);
      expect(document.querySelectorAll('[data-test-id="toggle-filter"]').length).toBe(0);
    });

    it('keeps a semi-predefined field over a toggle', function (this: ThisTest) {
      this.component.semiPredefinedFilters = [enumProperty];
      this.component.toggleFilters = [enumToggle('red')];
      expect(this.component.semiPredefinedFilters).toEqual([enumProperty]);
      expect(this.component.toggleFilters).toEqual([]);
    });

    it('keeps only the first toggle per field', function (this: ThisTest) {
      const first = enumToggle('red');
      this.component.toggleFilters = [first, enumToggle('blue')];
      expect(this.component.toggleFilters).toEqual([first]);
    });

    it('restores an ignored entry when the conflicting one is removed', function (this: ThisTest) {
      this.component.toggleFilters = [enumToggle('red')];
      this.component.predefinedFilters = [enumProperty];
      expect(this.component.toggleFilters).toEqual([]);
      this.component.predefinedFilters = [];
      expect(this.component.toggleFilters.length).toBe(1);
    });

    it('warns in dev mode about ignored entries', function (this: ThisTest) {
      spyOn(console, 'warn');
      this.component.predefinedFilters = [enumProperty];
      this.component.semiPredefinedFilters = [enumProperty];
      this.component.ngOnChanges({ semiPredefinedFilters: new SimpleChange(undefined, [enumProperty], true) });
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect((console.warn as jasmine.Spy).calls.mostRecent().args[0]).toContain(
        `semiPredefinedFilters: ${enumProperty.property}`
      );
    });

    it('ignores semi-predefined presets that do not select options', function (this: ThisTest) {
      spyOn(console, 'warn');
      const key = Array.from(enumProperty.values.keys())[0];
      const notEquals: PropertyFilter = {
        operator: LogicalOperator.Or,
        criteria: [{ filterableProperty: enumProperty, operator: ComparisonOperator.DoesNotEqual, value: key }],
      };
      this.component.semiPredefinedFilters = [enumProperty];
      this.component.presetFilters = [notEquals];
      this.fixture.detectChanges();
      expect(this.component.propertyFilters).toEqual([]);
      expect((console.warn as jasmine.Spy).calls.mostRecent().args[0]).toContain(
        'Ignored presets for: ' + enumProperty.property
      );
    });

    it('keeps semi-predefined presets that select options', function (this: ThisTest) {
      const [first, second] = Array.from(enumProperty.values.keys());
      const selection: PropertyFilter = {
        operator: LogicalOperator.Or,
        criteria: [first, second].map(value => ({
          filterableProperty: enumProperty,
          operator: ComparisonOperator.Equals,
          value,
        })),
      };
      this.component.semiPredefinedFilters = [enumProperty];
      this.component.presetFilters = [selection];
      this.fixture.detectChanges();
      expect(this.component.propertyFilters).toEqual([selection]);
      expect(this.component.isOptionSelected(enumProperty, first)).toBeTrue();
    });

    it('does not warn without conflicts', function (this: ThisTest) {
      spyOn(console, 'warn');
      this.component.predefinedFilters = [stringProperty];
      this.component.semiPredefinedFilters = [enumProperty];
      this.component.ngOnChanges({ semiPredefinedFilters: new SimpleChange(undefined, [enumProperty], true) });
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('semi-predefined filters', () => {
    const options = () =>
      Array.from(document.querySelectorAll<HTMLButtonElement>('[data-test-id="semi-filter-option"]'));

    beforeEach(function (this: ThisTest) {
      this.component.predefinedFilters = [stringProperty];
      this.component.semiPredefinedFilters = [enumProperty];
      this.fixture.detectChanges();
    });

    it('renders the field label and one pill per option, after the predefined pills', function (this: ThisTest) {
      const group: HTMLElement = this.fixture.nativeElement.querySelector('[data-test-id="semi-filter-group"]');
      expect(group.querySelector('.semi-filter-label').textContent.trim()).toBe(enumProperty.displayName + ':');
      expect(options().map(option => option.textContent.trim())).toEqual(Array.from(enumProperty.values.values()));
      expect(group.previousElementSibling.getAttribute('role')).toBe('separator');
      expect(this.component.availableProperties).not.toContain(enumProperty);
    });

    it('separates multiple semi-predefined filters', function (this: ThisTest) {
      const second = new EnumPropertyDefinition('Kind', 'kind', new Map([['a', 'A']]));
      this.fixture.componentRef.setInput('semiPredefinedFilters', [enumProperty, second]);
      this.fixture.detectChanges();
      const groups = this.fixture.nativeElement.querySelectorAll('[data-test-id="semi-filter-group"]');
      expect(groups.length).toBe(2);
      expect(groups[1].previousElementSibling.getAttribute('role')).toBe('separator');
    });

    it('toggles options instantly and combines them with OR', function (this: ThisTest) {
      spyOn(this.component.propertyFiltersChange, 'emit');
      const keys = Array.from(enumProperty.values.keys());
      options()[0].click();
      options()[1].click();
      this.fixture.detectChanges();
      const filter = this.component.filterFor(enumProperty);
      expect(filter.operator).toBe(LogicalOperator.Or);
      expect(filter.criteria.map(predicate => predicate.value)).toEqual(keys.slice(0, 2));
      expect(options()[0].getAttribute('aria-pressed')).toBe('true');
      expect(options()[0].querySelector('cds-icon[shape="check"]')).toBeTruthy();
      expect(options()[0].closest('clr-label').classList).toContain('label-info');
      // Semi-predefined filters are not user-added pills.
      expect(this.component.userAddedFiltersCount).toBe(0);
      expect(this.fixture.nativeElement.querySelectorAll('appfx-manage-filter').length).toBe(1);

      options()[0].click();
      options()[1].click();
      this.fixture.detectChanges();
      expect(this.component.filterFor(enumProperty)).toBeUndefined();
      expect(this.component.propertyFiltersChange.emit).toHaveBeenCalledTimes(4);
    });

    it('is cleared by Clear all', function (this: ThisTest) {
      options()[0].click();
      this.fixture.detectChanges();
      this.fixture.nativeElement.querySelector('[data-test-id="clear-all-button"]').click();
      this.fixture.detectChanges();
      expect(options().every(option => option.getAttribute('aria-pressed') === 'false')).toBeTrue();
    });
  });

  it('displays property filters', function (this: ThisTest) {
    this.component.propertyFilters.push(stringPropertyFilter);
    this.component.propertyFilters.push(enumPropertyFilter);
    this.fixture.detectChanges();
    expect(this.component.propertyFilters.length).toEqual(2);
    const propertyFilterElements: HTMLElement[] =
      this.fixture.debugElement.nativeElement.querySelectorAll('appfx-manage-filter');
    const clearAllButtonElement: HTMLButtonElement = this.fixture.debugElement.nativeElement.querySelector(
      'button[data-test-id="clear-all-button"]'
    );
    expect(propertyFilterElements.length).toEqual(2);
    expect(clearAllButtonElement).toBeTruthy();
  });
  it('emits property filter change event', function (this: ThisTest) {
    spyOn(this.component.propertyFiltersChange, 'emit');
    this.component.onFilterCriteriaChange(stringPropertyFilter);
    expect(this.component.propertyFilters.length).toEqual(1);
    expect(this.component.propertyFiltersChange.emit).toHaveBeenCalledWith([stringPropertyFilter]);
    this.component.onFilterCriteriaChange(enumPropertyFilter);
    expect(this.component.propertyFilters.length).toEqual(2);
    expect(this.component.propertyFiltersChange.emit).toHaveBeenCalledWith([stringPropertyFilter, enumPropertyFilter]);

    const modifiedStringFilter = new PropertyFilter();
    modifiedStringFilter.criteria = [stringPredicate1];
    modifiedStringFilter.operator = LogicalOperator.And;
    this.component.onFilterCriteriaChange(modifiedStringFilter);
    expect(this.component.propertyFilters.length).toEqual(2);
    expect(this.component.propertyFiltersChange.emit).toHaveBeenCalledWith([modifiedStringFilter, enumPropertyFilter]);

    modifiedStringFilter.criteria.splice(0);
    this.component.onFilterCriteriaChange(modifiedStringFilter);
    expect(this.component.propertyFilters.length).toEqual(1);
    expect(this.component.propertyFiltersChange.emit).toHaveBeenCalledWith([enumPropertyFilter]);
  });
  it('removes all filters on clear all click', function (this: ThisTest) {
    spyOn(this.component.propertyFiltersChange, 'emit');
    this.component.propertyFilters.push(stringPropertyFilter);
    this.component.propertyFilters.push(enumPropertyFilter);
    this.fixture.detectChanges();
    const clearAllButtonElement: HTMLButtonElement = this.fixture.debugElement.nativeElement.querySelector(
      'button[data-test-id="clear-all-button"]'
    );
    expect(clearAllButtonElement).toBeTruthy();
    clearAllButtonElement.click();
    this.fixture.detectChanges();
    expect(this.component.propertyFilters.length).toEqual(0);
    expect(this.component.propertyFiltersChange.emit).toHaveBeenCalledWith([]);
  });
  it('shows/hides the display filters on show/hide button click', function (this: ThisTest) {
    this.component.propertyFilters.push(stringPropertyFilter);
    this.component.propertyFilters.push(enumPropertyFilter);
    this.fixture.detectChanges();
    const hideButtonElement: HTMLButtonElement = this.fixture.debugElement.nativeElement.querySelector(
      'button[data-test-id="hide-filters"]'
    );
    expect(hideButtonElement).toBeTruthy();
    expect(hideButtonElement.innerText.trim()).toEqual('HIDE');
    expect(hideButtonElement.getAttribute(ariaLabelAttributeName)).toEqual('Hide filters');

    hideButtonElement.click();
    this.fixture.detectChanges();
    const propertyFilterElements: HTMLElement[] =
      this.fixture.debugElement.nativeElement.querySelectorAll('appfx-manage-filter');
    expect(hideButtonElement.innerText.trim()).toEqual('SHOW(2)');
    expect(hideButtonElement.getAttribute(ariaLabelAttributeName)).toEqual('Show 2 filters');
    expect(propertyFilterElements.length).toEqual(2);
    expect(propertyFilterElements[0].hasAttribute('hidden')).toBeTruthy();
    expect(propertyFilterElements[1].hasAttribute('hidden')).toBeTruthy();

    hideButtonElement.click();
    this.fixture.detectChanges();
    expect(hideButtonElement.innerText.trim()).toEqual('HIDE');
    expect(hideButtonElement.getAttribute(ariaLabelAttributeName)).toEqual('Hide filters');
    expect(propertyFilterElements.length).toEqual(2);
    expect(propertyFilterElements[0].hasAttribute('hidden')).toBeFalsy();
    expect(propertyFilterElements[1].hasAttribute('hidden')).toBeFalsy();
  });
});

async function openAddFilter(fixture: ComponentFixture<CompositeFiltersComponent>): Promise<void> {
  fixture.detectChanges();
  fixture.nativeElement.querySelector('button[data-test-id="add-button"]').click();
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

async function selectField(fixture: ComponentFixture<CompositeFiltersComponent>, displayName: string): Promise<void> {
  document.querySelector<HTMLButtonElement>('.filter-popover .clr-combobox-trigger').click();
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  const input = document.querySelector<HTMLInputElement>('.filter-popover .clr-combobox-input');
  input.value = displayName;
  input.dispatchEvent(new Event('input'));
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  const options = document.querySelectorAll<HTMLElement>('clr-option');
  expect(options.length).toBe(1);
  expect(options[0].textContent).toContain(displayName);
  options[0].click();
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

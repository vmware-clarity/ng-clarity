/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { A11yModule as CdkA11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrBadge } from '@clr/angular/emphasis/badge';
import { ClrLabel } from '@clr/angular/emphasis/label';
import { ClrCheckboxModule, ClrInputModule, ClrSelectModule } from '@clr/angular/forms';
import { ClrIcon } from '@clr/angular/icon';
import { ClrPopoverModuleNext } from '@clr/angular/popover/common';
import { ClrSignpostModule } from '@clr/angular/popover/signpost';

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
        ClrInputModule,
        ClrSelectModule,
        ClrSignpostModule,
        ClrPopoverModuleNext,
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
    const input: HTMLInputElement = document.querySelector('input[formControlName="primaryValue"]');
    input.value = 'Demo';
    input.dispatchEvent(new Event('input'));
    this.fixture.detectChanges();
    document.querySelector<HTMLButtonElement>('[data-test-id="submitBtn"]').click();
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    this.fixture.detectChanges();
    expect(trigger.textContent.trim()).toBe('Contains: Demo');
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
  it('on property change', function (this: ThisTest) {
    const addNewButton: HTMLButtonElement = this.fixture.debugElement.nativeElement.querySelector(
      'button[data-test-id="add-button"]'
    );
    expect(addNewButton).toBeTruthy();
    addNewButton.click();
    this.fixture.detectChanges();
    expect(this.component.signPostOpened).toBeTruthy();
    const propertySelect: HTMLSelectElement = document.body.querySelector('select');
    expect(propertySelect).toBeTruthy();
    expect(propertySelect.options.length).toEqual(2);

    propertySelect.value = propertySelect.options[1].value;
    propertySelect.dispatchEvent(new Event('change'));
    this.fixture.detectChanges();
    expect(this.component.selectedFilterableProperty).toEqual(filterableProperties[1]);
    expect(this.component.propertyType).toEqual(PropertyType.Enum);
    expect(this.component.enumProperty).toEqual(enumProperty);
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

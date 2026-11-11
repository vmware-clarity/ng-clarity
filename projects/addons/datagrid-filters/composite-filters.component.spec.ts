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
import { ClrCheckboxModule, ClrInputModule, ClrSelectModule } from '@clr/angular/forms';
import { ClrIcon } from '@clr/angular/icon';
import { ClrSignpostModule } from '@clr/angular/popover/signpost';
import { renderFixture } from '@clr/angular/utils/testing';

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
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ClrCheckboxModule,
        ClrInputModule,
        ClrSelectModule,
        ClrSignpostModule,
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
    testContext.fixture = TestBed.createComponent(CompositeFiltersComponent);
    testContext.component = testContext.fixture.componentInstance;
    testContext.fixture.componentRef.setInput('filterableProperties', filterableProperties);
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });
  it('is properly initialized', () => {
    renderFixture(testContext.fixture);
    expect(testContext.component).toBeTruthy();
    expect(testContext.component.selectedFilterableProperty).toEqual(stringProperty);
    expect(testContext.component.propertyType).toEqual(PropertyType.String);
    expect(testContext.component.stringProperty).toEqual(stringProperty);
  });
  it('on property change', () => {
    const addNewButton: HTMLButtonElement = testContext.fixture.debugElement.nativeElement.querySelector(
      'button[data-test-id="add-button"]'
    );
    expect(addNewButton).toBeTruthy();
    addNewButton.click();
    renderFixture(testContext.fixture);
    expect(testContext.component.signPostOpened).toBeTruthy();
    const propertySelect: HTMLSelectElement = document.body.querySelector('select');
    expect(propertySelect).toBeTruthy();
    expect(propertySelect.options.length).toEqual(2);

    propertySelect.value = propertySelect.options[1].value;
    propertySelect.dispatchEvent(new Event('change'));
    renderFixture(testContext.fixture);
    expect(testContext.component.selectedFilterableProperty).toEqual(filterableProperties[1]);
    expect(testContext.component.propertyType).toEqual(PropertyType.Enum);
    expect(testContext.component.enumProperty).toEqual(enumProperty);
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

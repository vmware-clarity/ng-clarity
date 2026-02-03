/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrCheckboxModule, ClrInputModule, ClrSelectModule, ClrSignpostModule } from '@clr/angular';

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
        ClrCheckboxModule,
        ClrInputModule,
        ClrSelectModule,
        ClrSignpostModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
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
    const propertySelect: HTMLSelectElement = this.fixture.debugElement.nativeElement.querySelector('select');
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

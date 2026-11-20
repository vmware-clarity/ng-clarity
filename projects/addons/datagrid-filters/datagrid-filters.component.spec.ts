/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { renderFixture } from '@clr/angular/utils/testing';

import { CompositeFiltersComponent } from './composite-filters.component';
import { DatagridFiltersStrings } from './datagrid-filters-strings.service';
import { DataGridFiltersComponent } from './datagrid-filters.component';
import { AppfxDatagridFiltersModule } from './datagrid-filters.module';
import { ComparisonOperator, FilterMode, LogicalOperator } from './model/datagrid-filters.enums';
import { PropertyFilter, StringPropertyDefinition } from './model/datagrid-filters.interfaces';

const testInput = 'Test input';

/** Types the term into the search input and presses Enter, so it is applied and emitted straight away. */
function applySearch(fixture: ComponentFixture<DataGridFiltersComponent>, term: string): void {
  const input: HTMLInputElement = fixture.nativeElement.querySelector('input[clrInput]');
  input.value = term;
  input.dispatchEvent(new Event('input'));
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  renderFixture(fixture);
}

export interface ThisTest {
  fixture: ComponentFixture<DataGridFiltersComponent>;
  component: DataGridFiltersComponent;
}

describe('DataGridFiltersComponent', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    // The module declares everything the filter bar renders (pills, editors), so no template element is unknown.
    TestBed.configureTestingModule({
      imports: [AppfxDatagridFiltersModule],
      providers: [DatagridFiltersStrings],
    });
    testContext.fixture = TestBed.createComponent(DataGridFiltersComponent);
    testContext.component = testContext.fixture.componentInstance;
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });
  it('is properly initialized in quick mode', () => {
    renderFixture(testContext.fixture);
    const filterInput: HTMLInputElement = testContext.fixture.debugElement.nativeElement.querySelector('input');
    const quickFilterLabel: HTMLLabelElement = testContext.fixture.debugElement.nativeElement.querySelector('label');
    expect(filterInput).toBeTruthy();
    expect(quickFilterLabel).toBeTruthy();
    expect(quickFilterLabel.textContent?.trim()).toEqual('Quick Filter');
  });
  it('is properly initialized in advanced mode', () => {
    testContext.component.mode = FilterMode.Advanced;
    renderFixture(testContext.fixture);
    const filterSelect: HTMLSelectElement = testContext.fixture.debugElement.nativeElement.querySelector('select');
    expect(filterSelect).toBeTruthy();
    expect(filterSelect.options.length).toEqual(2);
  });
  it('shows the search and the pills together without a label in combined mode', () => {
    testContext.component.filterMode = FilterMode.Combined;
    renderFixture(testContext.fixture);
    const element: HTMLElement = testContext.fixture.nativeElement;
    expect(element.querySelector('input[clrInput]')).toBeTruthy();
    expect(element.querySelector('appfx-composite-filter')).toBeTruthy();
    expect(element.querySelector('select')).toBeNull();
    expect(element.querySelector('.filter-container > label')).toBeNull();
    // Search comes first, then the pills.
    expect(
      element
        .querySelector('clr-input-container')!
        .compareDocumentPosition(element.querySelector('appfx-composite-filter')!)
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });
  it('keeps the search when property filters change in combined mode', () => {
    testContext.component.filterMode = FilterMode.Combined;
    vi.spyOn(testContext.component.searchTermChange, 'emit').mockImplementation(() => undefined);
    testContext.component.searchTerm = 'Test';
    testContext.component.onFilterCriteriaChange([]);
    expect(testContext.component.searchTerm).toBe('Test');
    expect(testContext.component.searchTermChange.emit).not.toHaveBeenCalled();
  });
  it('clears the search and the pills on Clear all in combined mode', () => {
    testContext.component.filterMode = FilterMode.Combined;
    renderFixture(testContext.fixture);
    // The user has already searched for "Test".
    applySearch(testContext.fixture, 'Test');
    vi.spyOn(testContext.component.searchTermChange, 'emit').mockImplementation(() => undefined);
    vi.spyOn(testContext.component.propertyFiltersChange, 'emit').mockImplementation(() => undefined);

    const clearAll: HTMLButtonElement = testContext.fixture.nativeElement.querySelector(
      '[data-test-id="clear-all-button"]'
    );
    expect(clearAll).toBeTruthy();
    clearAll.click();
    renderFixture(testContext.fixture);
    expect(testContext.component.searchTerm).toBe('');
    expect(testContext.component.searchTermChange.emit).toHaveBeenCalledWith('');
    expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledWith([]);
  });
  it('clears quick filter on mode switch', () => {
    renderFixture(testContext.fixture);
    // The user has already searched for "Test".
    applySearch(testContext.fixture, 'Test');
    vi.spyOn(testContext.component.searchTermChange, 'emit').mockImplementation(() => undefined);
    testContext.component.selectedFilterMode = FilterMode.Advanced;
    testContext.component.onFilterModeChange();
    expect(testContext.component.searchTermChange.emit).toHaveBeenCalledWith('');
  });
  it('clears advanced filters on mode switch', () => {
    vi.spyOn(testContext.component.propertyFiltersChange, 'emit').mockImplementation(() => undefined);
    const nameProperty = new StringPropertyDefinition('Name', 'name', [ComparisonOperator.Contains]);
    testContext.component.propertyFilters = [
      {
        operator: LogicalOperator.And,
        criteria: [{ filterableProperty: nameProperty, operator: ComparisonOperator.Contains, value: 'vm' }],
      },
    ];
    testContext.component.selectedFilterMode = FilterMode.Quick;
    testContext.component.onFilterModeChange();
    expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledWith([]);
    expect(testContext.component.propertyFilters).toEqual([]);
  });
  it('does not emit on the switch to quick mode when no filters are applied', () => {
    vi.spyOn(testContext.component.propertyFiltersChange, 'emit').mockImplementation(() => undefined);
    testContext.component.selectedFilterMode = FilterMode.Quick;
    testContext.component.onFilterModeChange();
    expect(testContext.component.propertyFiltersChange.emit).not.toHaveBeenCalled();
  });
  it('passes propertyFilters to the filter bar and resets them when switching to quick mode', () => {
    const nameProperty = new StringPropertyDefinition('Name', 'name', [ComparisonOperator.Contains]);
    const nameFilter: PropertyFilter = {
      operator: LogicalOperator.And,
      criteria: [{ filterableProperty: nameProperty, operator: ComparisonOperator.Contains, value: 'vm' }],
    };
    testContext.component.filterableProperties = [nameProperty];
    testContext.component.mode = FilterMode.Advanced;
    testContext.component.selectedFilterMode = FilterMode.Advanced;
    testContext.component.propertyFilters = [nameFilter];
    renderFixture(testContext.fixture);
    // The wrapper is OnPush: the mode select marks it in the app, so mark it here after changing fields directly.
    const refresh = () => {
      testContext.fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
      renderFixture(testContext.fixture);
    };
    const bar = (): CompositeFiltersComponent =>
      testContext.fixture.debugElement.query(By.directive(CompositeFiltersComponent))?.componentInstance;
    expect(bar().propertyFilters).toEqual([nameFilter]);

    vi.spyOn(testContext.component.propertyFiltersChange, 'emit').mockImplementation(() => undefined);
    testContext.component.selectedFilterMode = FilterMode.Quick;
    testContext.component.onFilterModeChange();
    refresh();
    expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledWith([]);
    expect(testContext.component.propertyFilters).toEqual([]);
    expect(bar()).toBeUndefined();

    // Back in advanced mode, the filter bar starts from the cleared state, not the old filters.
    testContext.component.selectedFilterMode = FilterMode.Advanced;
    refresh();
    expect(bar().propertyFilters).toEqual([]);
  });
  it('emits an event on search term change', async () => {
    vi.useFakeTimers();
    vi.spyOn(testContext.component, 'onSearchTermChanged');
    vi.spyOn(testContext.component.searchTermChange, 'emit').mockImplementation(() => undefined);
    renderFixture(testContext.fixture);
    const filterInput: HTMLInputElement = testContext.fixture.debugElement.nativeElement.querySelector('input');
    filterInput.value = testInput;
    filterInput.dispatchEvent(new Event('input'));
    renderFixture(testContext.fixture);
    expect(testContext.component.searchTermChange.emit).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(2000);
    expect(filterInput).toBeTruthy();
    expect(testContext.component.onSearchTermChanged).toHaveBeenCalledWith(testInput);
    expect(testContext.component.searchTerm).toEqual(testInput);
    expect(testContext.component.searchTermChange.emit).toHaveBeenCalledWith(testInput);
  });
  it('emits an event on enter key press', () => {
    vi.spyOn(testContext.component, 'onSearchInputKeyPress');
    vi.spyOn(testContext.component.searchTermChange, 'emit').mockImplementation(() => undefined);
    const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
    });
    renderFixture(testContext.fixture);
    const filterInput: HTMLInputElement = testContext.fixture.debugElement.nativeElement.querySelector('input');
    filterInput.value = 'Key press';
    filterInput.dispatchEvent(new Event('input'));
    filterInput.dispatchEvent(keyDownEvent);
    renderFixture(testContext.fixture);
    expect(testContext.component.onSearchInputKeyPress).toHaveBeenCalledWith(keyDownEvent);
    expect(testContext.component.searchTerm).toEqual('Key press');
    expect(testContext.component.searchTermChange.emit).toHaveBeenCalledWith('Key press');
  });
  it('is properly initialized in advanced only mode', () => {
    testContext.component.mode = FilterMode.AdvancedOnly;
    testContext.component.filterableProperties = [];
    renderFixture(testContext.fixture);
    const filterSelect: HTMLSelectElement = testContext.fixture.debugElement.nativeElement.querySelector('select');
    expect(filterSelect).toBeFalsy();
    const advancedFilterLabel: HTMLLabelElement = testContext.fixture.debugElement.nativeElement.querySelector('label');
    expect(advancedFilterLabel).toBeTruthy();
    expect(advancedFilterLabel.textContent?.trim()).toEqual('Advanced Filter');
  });
});

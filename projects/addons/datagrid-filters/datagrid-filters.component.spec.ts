/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrInputModule, ClrSelectModule } from '@clr/angular/forms';
import { ClrIcon } from '@clr/angular/icon';
import { ClrSignpostModule } from '@clr/angular/popover/signpost';

import { CompositeFiltersComponent } from './composite-filters.component';
import { DatagridFiltersStrings } from './datagrid-filters-strings.service';
import { DataGridFiltersComponent } from './datagrid-filters.component';
import { DismissableDirective } from './manage-filters/dismissable.directive';
import { FilterMode } from './model/datagrid-filters.enums';

const testInput = 'Test input';

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
    TestBed.configureTestingModule({
      imports: [
        ClrInputModule,
        ClrSelectModule,
        ClrSignpostModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClrIcon,
      ],
      declarations: [DataGridFiltersComponent, CompositeFiltersComponent],
      providers: [DatagridFiltersStrings, DismissableDirective],
    });
    testContext.fixture = TestBed.createComponent(DataGridFiltersComponent);
    testContext.component = testContext.fixture.componentInstance;
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });
  it('is properly initialized in quick mode', () => {
    testContext.fixture.detectChanges();
    const filterInput: HTMLInputElement = testContext.fixture.debugElement.nativeElement.querySelector('input');
    const quickFilterLabel: HTMLLabelElement = testContext.fixture.debugElement.nativeElement.querySelector('label');
    expect(filterInput).toBeTruthy();
    expect(quickFilterLabel).toBeTruthy();
    expect(quickFilterLabel.textContent?.trim()).toEqual('Quick Filter');
  });
  it('is properly initialized in advanced mode', () => {
    testContext.component.mode = FilterMode.Advanced;
    testContext.fixture.detectChanges();
    const filterSelect: HTMLSelectElement = testContext.fixture.debugElement.nativeElement.querySelector('select');
    expect(filterSelect).toBeTruthy();
    expect(filterSelect.options.length).toEqual(2);
  });
  it('clears quick filter on mode switch', () => {
    vi.spyOn(testContext.component.searchTermChange, 'emit').mockImplementation(() => undefined);
    testContext.component.searchTerm = 'Test';
    testContext.component['lastSearchTerm'] = 'Test';
    testContext.component.selectedFilterMode = FilterMode.Advanced;
    testContext.component.onFilterModeChange();
    expect(testContext.component.searchTermChange.emit).toHaveBeenCalledWith('');
  });
  it('clears advanced filters on mode switch', () => {
    vi.spyOn(testContext.component.propertyFiltersChange, 'emit').mockImplementation(() => undefined);
    testContext.component['appliedFiltersCount'] = 3;
    testContext.component.selectedFilterMode = FilterMode.Quick;
    testContext.component.onFilterModeChange();
    expect(testContext.component.propertyFiltersChange.emit).toHaveBeenCalledWith([]);
  });
  it('emits an event on search term change', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
    vi.spyOn(testContext.component, 'onSearchTermChanged');
    vi.spyOn(testContext.component.searchTermChange, 'emit').mockImplementation(() => undefined);
    testContext.fixture.detectChanges();
    const filterInput: HTMLInputElement = testContext.fixture.debugElement.nativeElement.querySelector('input');
    filterInput.value = testInput;
    filterInput.dispatchEvent(new Event('input'));
    testContext.fixture.detectChanges();
    expect(testContext.component['lastSearchTerm']).toEqual('');
    await vi.advanceTimersByTimeAsync(2000);
    expect(filterInput).toBeTruthy();
    expect(testContext.component.onSearchTermChanged).toHaveBeenCalledWith(testInput);
    expect(testContext.component.searchTerm).toEqual(testInput);
    expect(testContext.component['lastSearchTerm']).toEqual(testInput);
    expect(testContext.component.searchTermChange.emit).toHaveBeenCalledWith(testInput);
  });
  it('emits an event on enter key press', () => {
    vi.spyOn(testContext.component, 'onSearchInputKeyPress');
    vi.spyOn(testContext.component.searchTermChange, 'emit').mockImplementation(() => undefined);
    const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
    });
    testContext.fixture.detectChanges();
    const filterInput: HTMLInputElement = testContext.fixture.debugElement.nativeElement.querySelector('input');
    filterInput.value = 'Key press';
    filterInput.dispatchEvent(new Event('input'));
    filterInput.dispatchEvent(keyDownEvent);
    testContext.fixture.detectChanges();
    expect(testContext.component.onSearchInputKeyPress).toHaveBeenCalledWith(keyDownEvent);
    expect(testContext.component.searchTerm).toEqual('Key press');
    expect(testContext.component['lastSearchTerm']).toEqual('Key press');
    expect(testContext.component.searchTermChange.emit).toHaveBeenCalledWith('Key press');
  });
  it('is properly initialized in advanced only mode', () => {
    testContext.component.mode = FilterMode.AdvancedOnly;
    testContext.component.filterableProperties = [];
    testContext.fixture.detectChanges();
    const filterSelect: HTMLSelectElement = testContext.fixture.debugElement.nativeElement.querySelector('select');
    expect(filterSelect).toBeFalsy();
    const advancedFilterLabel: HTMLLabelElement = testContext.fixture.debugElement.nativeElement.querySelector('label');
    expect(advancedFilterLabel).toBeTruthy();
    expect(advancedFilterLabel.textContent?.trim()).toEqual('Advanced Filter');
  });
});

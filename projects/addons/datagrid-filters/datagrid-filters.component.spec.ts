/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrIcon, ClrInputModule, ClrSelectModule, ClrSignpostModule } from '@clr/angular';

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
  beforeEach(function (this: ThisTest) {
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
    this.fixture = TestBed.createComponent(DataGridFiltersComponent);
    this.component = this.fixture.componentInstance;
  });

  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });
  it('is properly initialized in quick mode', function (this: ThisTest) {
    this.fixture.detectChanges();
    const filterInput: HTMLInputElement = this.fixture.debugElement.nativeElement.querySelector('input');
    const quickFilterLabel: HTMLLabelElement = this.fixture.debugElement.nativeElement.querySelector('label');
    expect(filterInput).toBeTruthy();
    expect(quickFilterLabel).toBeTruthy();
    expect(quickFilterLabel.textContent?.trim()).toEqual('Quick Filter');
  });
  it('is properly initialized in advanced mode', function (this: ThisTest) {
    this.component.mode = FilterMode.Advanced;
    this.fixture.detectChanges();
    const filterSelect: HTMLSelectElement = this.fixture.debugElement.nativeElement.querySelector('select');
    expect(filterSelect).toBeTruthy();
    expect(filterSelect.options.length).toEqual(2);
  });
  it('clears quick filter on mode switch', function (this: ThisTest) {
    spyOn(this.component.searchTermChange, 'emit');
    this.component.searchTerm = 'Test';
    this.component['lastSearchTerm'] = 'Test';
    this.component.selectedFilterMode = FilterMode.Advanced;
    this.component.onFilterModeChange();
    expect(this.component.searchTermChange.emit).toHaveBeenCalledWith('');
  });
  it('clears advanced filters on mode switch', function (this: ThisTest) {
    spyOn(this.component.propertyFiltersChange, 'emit');
    this.component['appliedFiltersCount'] = 3;
    this.component.selectedFilterMode = FilterMode.Quick;
    this.component.onFilterModeChange();
    expect(this.component.propertyFiltersChange.emit).toHaveBeenCalledWith([]);
  });
  it('emits an event on search term change', fakeAsync(function (this: ThisTest) {
    spyOn(this.component, 'onSearchTermChanged').and.callThrough();
    spyOn(this.component.searchTermChange, 'emit');
    this.fixture.detectChanges();
    const filterInput: HTMLInputElement = this.fixture.debugElement.nativeElement.querySelector('input');
    filterInput.value = testInput;
    filterInput.dispatchEvent(new Event('input'));
    this.fixture.detectChanges();
    expect(this.component['lastSearchTerm']).toEqual('');
    tick(2000);
    expect(filterInput).toBeTruthy();
    expect(this.component.onSearchTermChanged).toHaveBeenCalledWith(testInput);
    expect(this.component.searchTerm).toEqual(testInput);
    expect(this.component['lastSearchTerm']).toEqual(testInput);
    expect(this.component.searchTermChange.emit).toHaveBeenCalledWith(testInput);
  }));
  it('emits an event on enter key press', function (this: ThisTest) {
    spyOn(this.component, 'onSearchInputKeyPress').and.callThrough();
    spyOn(this.component.searchTermChange, 'emit');
    const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
    });
    this.fixture.detectChanges();
    const filterInput: HTMLInputElement = this.fixture.debugElement.nativeElement.querySelector('input');
    filterInput.value = 'Key press';
    filterInput.dispatchEvent(new Event('input'));
    filterInput.dispatchEvent(keyDownEvent);
    this.fixture.detectChanges();
    expect(this.component.onSearchInputKeyPress).toHaveBeenCalledWith(keyDownEvent);
    expect(this.component.searchTerm).toEqual('Key press');
    expect(this.component['lastSearchTerm']).toEqual('Key press');
    expect(this.component.searchTermChange.emit).toHaveBeenCalledWith('Key press');
  });
  it('is properly initialized in advanced only mode', function (this: ThisTest) {
    this.component.mode = FilterMode.AdvancedOnly;
    this.component.filterableProperties = [];
    this.fixture.detectChanges();
    const filterSelect: HTMLSelectElement = this.fixture.debugElement.nativeElement.querySelector('select');
    expect(filterSelect).toBeFalsy();
    const advancedFilterLabel: HTMLLabelElement = this.fixture.debugElement.nativeElement.querySelector('label');
    expect(advancedFilterLabel).toBeTruthy();
    expect(advancedFilterLabel.textContent?.trim()).toEqual('Advanced Filter');
  });
});

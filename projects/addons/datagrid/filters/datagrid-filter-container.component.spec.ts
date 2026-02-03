/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrDatagridFilter } from '@clr/angular';
import { Subject } from 'rxjs';

import { DatagridFilterContainerComponent } from './datagrid-filter-container.component';

@Component({
  selector: 'mock-filter',
  standalone: false,
  template: '',
})
class MockFilterComponent {
  filterValue: unknown;
  changes = new Subject<unknown>();
}

describe('DatagridFilterContainer', () => {
  let component: DatagridFilterContainerComponent;
  let fixture: ComponentFixture<DatagridFilterContainerComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [DatagridFilterContainerComponent, MockFilterComponent],
      providers: [
        {
          provide: ClrDatagridFilter,
          useValue: {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            setFilter: () => {},
          },
        },
      ],
    });

    fixture = TestBed.createComponent(DatagridFilterContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create the filter component when filterType is set', () => {
    component.filterType = MockFilterComponent;
    component.filterValue = 'testValue';
    fixture.detectChanges();

    const filterComponent = fixture.debugElement.query(By.directive(MockFilterComponent));
    expect(filterComponent).toBeTruthy();

    const filterInstance = filterComponent.componentInstance as MockFilterComponent;
    expect(filterInstance.filterValue).toBe('testValue');
  });

  it('should emit filterValueChange when filter value changes', () => {
    component.filterType = MockFilterComponent;
    component.filterValue = 'testValue';
    fixture.detectChanges();

    const filterComponent = fixture.debugElement.query(By.directive(MockFilterComponent));
    const filterInstance = filterComponent.componentInstance as MockFilterComponent;

    const filterValueChangeSpy = spyOn(component.filterValueChange, 'emit');
    filterInstance.changes.next('newTestValue');

    expect(filterValueChangeSpy).toHaveBeenCalledWith('newTestValue');
  });

  it('should destroy the filter component when destroyed', () => {
    component.filterType = MockFilterComponent;
    component.filterValue = 'testValue';
    fixture.detectChanges();

    const filterComponent = fixture.debugElement.query(By.directive(MockFilterComponent));
    expect(filterComponent).toBeTruthy();

    component.ngOnDestroy();
    fixture.detectChanges();

    const destroyedFilterComponent = fixture.debugElement.query(By.directive(MockFilterComponent));
    expect(destroyedFilterComponent).toBeNull();
  });
});

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDatagridFiltersComponent } from './datagrid-filters.component.mock';

describe('MockAppfxMenuComponent', () => {
  let fixture: ComponentFixture<MockDatagridFiltersComponent>;
  let component: MockDatagridFiltersComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockDatagridFiltersComponent],
    });

    fixture = TestBed.createComponent(MockDatagridFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance of MockDatagridFiltersComponent', () => {
    expect(component).toBeDefined();
  });
});

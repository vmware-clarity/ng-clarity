/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDatagridColumnToggleComponent } from './datagrid-column-toggle.component.mock';

describe('MockDatagridColumnToggleComponent', () => {
  let fixture: ComponentFixture<MockDatagridColumnToggleComponent>;
  let component: MockDatagridColumnToggleComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockDatagridColumnToggleComponent],
    });

    fixture = TestBed.createComponent(MockDatagridColumnToggleComponent);
    component = fixture.componentInstance;
  });

  it('should have defined empty functions for mocking purpose', () => {
    expect(component.hideColumn()).toBeUndefined();
    expect(component.showColumn()).toBeUndefined();
  });
});

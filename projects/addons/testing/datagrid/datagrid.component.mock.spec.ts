/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockAppfxDatagridComponent } from './datagrid.component.mock';

describe('MockAppfxDatagridComponent', () => {
  let fixture: ComponentFixture<MockAppfxDatagridComponent>;
  let component: MockAppfxDatagridComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockAppfxDatagridComponent],
    });

    fixture = TestBed.createComponent(MockAppfxDatagridComponent);
    component = fixture.componentInstance;
  });

  it('should have defined empty functions for mocking purpose', () => {
    expect(component.onModelChange()).toBeUndefined();
    expect(component.setSelectedItems()).toBeUndefined();
  });
});

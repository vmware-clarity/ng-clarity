/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockAppfxDialogComponent } from './multi-page-dialog.component.mock';

describe('MockAppfxDialogComponent', () => {
  let fixture: ComponentFixture<MockAppfxDialogComponent>;
  let component: MockAppfxDialogComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockAppfxDialogComponent],
    });

    fixture = TestBed.createComponent(MockAppfxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance of MockAppfxDialogComponent', () => {
    expect(component).toBeDefined();
  });
});

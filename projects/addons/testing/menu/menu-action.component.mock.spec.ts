/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockAppfxMenuActionComponent } from './menu-action.component.mock';

describe('MockAppfxMenuActionComponent', () => {
  let fixture: ComponentFixture<MockAppfxMenuActionComponent>;
  let component: MockAppfxMenuActionComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockAppfxMenuActionComponent],
    });

    fixture = TestBed.createComponent(MockAppfxMenuActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance of MockAppfxMenuActionComponent', () => {
    expect(component).toBeDefined();
  });
});

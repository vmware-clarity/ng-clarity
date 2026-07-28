/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockAppfxCardContainerComponent } from './appfx-card-container.component.mock';

describe('MockAppfxCardContainerComponent', () => {
  let fixture: ComponentFixture<MockAppfxCardContainerComponent>;
  let component: MockAppfxCardContainerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockAppfxCardContainerComponent],
    });

    fixture = TestBed.createComponent(MockAppfxCardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance of MockAppfxCardContainerComponent', () => {
    expect(component).toBeDefined();
  });
});

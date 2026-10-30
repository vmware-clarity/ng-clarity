/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { renderFixture } from '@clr/angular/utils/testing';

import { MockAppfxMenuComponent } from './menu.component.mock';

describe('MockAppfxMenuComponent', () => {
  let fixture: ComponentFixture<MockAppfxMenuComponent>;
  let component: MockAppfxMenuComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockAppfxMenuComponent],
    });

    fixture = TestBed.createComponent(MockAppfxMenuComponent);
    component = fixture.componentInstance;
    renderFixture(fixture);
  });

  it('should create an instance of MockAppfxMenuComponent', () => {
    expect(component).toBeDefined();
  });
});

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemType } from './menu-item.token';
import { MenuSeparatorComponent } from './menu-separator.component';

describe('MenuSeparatorComponent', () => {
  let component: MenuSeparatorComponent;
  let fixture: ComponentFixture<MenuSeparatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuSeparatorComponent],
    });

    fixture = TestBed.createComponent(MenuSeparatorComponent);
    component = fixture.componentInstance;
  });

  it('should have the correct type', () => {
    expect(component.type).toEqual(MenuItemType.separator);
  });
});

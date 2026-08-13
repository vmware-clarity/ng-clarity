/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHeaderComponent } from './menu-header.component';
import { MenuItemType } from './menu-item.token';

describe('MenuHeaderComponent', () => {
  let component: MenuHeaderComponent;
  let fixture: ComponentFixture<MenuHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuHeaderComponent],
    });

    fixture = TestBed.createComponent(MenuHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should have the correct type', () => {
    expect(component.type).toEqual(MenuItemType.header);
  });

  it('should have set values for iconClass and text', () => {
    expect(component.iconClass).toBeUndefined();
    expect(component.text).toBeUndefined();
  });

  it('should set values for iconClass and text', () => {
    const iconClass = 'icon-class';
    const text = 'Header Text';

    component.iconClass = iconClass;
    component.text = text;

    expect(component.iconClass).toEqual(iconClass);
    expect(component.text).toEqual(text);
  });
});

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { renderFixture } from '@clr/angular/utils/testing';

import { MenuActionComponent } from './menu-action.component';
import { MenuItemType } from './menu-item.token';

describe('MenuActionComponent', () => {
  let component: MenuActionComponent;
  let fixture: ComponentFixture<MenuActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuActionComponent],
    });

    fixture = TestBed.createComponent(MenuActionComponent);
    component = fixture.componentInstance;
    renderFixture(fixture);
  });

  it('should have the correct type and set iconClass, text, shortcut, and enabled properties', () => {
    expect(component.type).toEqual(MenuItemType.action);

    fixture.componentRef.setInput('iconClass', 'fa fa-check');
    fixture.componentRef.setInput('text', 'Check');
    fixture.componentRef.setInput('shortcut', 'Ctrl+C');
    fixture.componentRef.setInput('enabled', false);

    renderFixture(fixture);
  });
});

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuOutletComponent } from './menu-outlet.component';
import { MenuOutletService } from './menu-outlet.service';

describe('MenuOutletComponent', () => {
  const mockMenuText = 'mocked menu';
  let component: MenuOutletComponent;
  let fixture: ComponentFixture<MenuOutletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuOutletComponent],
      providers: [MenuOutletService],
    });

    fixture = TestBed.createComponent(MenuOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should attach menu', () => {
    const menuComponentRef = createMockMenuComponentRef();
    component.attachMenu(menuComponentRef);

    fixture.detectChanges();

    const viewContainerElement: HTMLElement = fixture.debugElement.nativeElement;
    expect(viewContainerElement.innerHTML).toContain(mockMenuText);
  });

  it('should detach menu', () => {
    const menuComponentRef = createMockMenuComponentRef();
    component.attachMenu(menuComponentRef);

    let viewContainerElement: HTMLElement = fixture.debugElement.nativeElement;
    expect(viewContainerElement.innerHTML).toContain(mockMenuText);

    component.detachMenu();

    viewContainerElement = fixture.debugElement.nativeElement;
    expect(viewContainerElement.innerHTML).not.toContain(mockMenuText);
  });

  function createMockMenuComponentRef(): ComponentRef<any> {
    const fixtureMenu = TestBed.createComponent(MockMenuComponent);
    const componentRef = fixtureMenu.componentRef;
    fixtureMenu.detectChanges();
    return componentRef;
  }
});

@Component({
  selector: 'app-mock-menu',
  standalone: false,
  template: 'mocked menu',
})
class MockMenuComponent {}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { QueryList } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrDropdownMenu } from '@clr/angular/popover/dropdown';

import { FocusableItemCollectorComponent } from './focusable-item-collector.component';
import { FocusableItemProvider } from './focusable-item-provider';

describe('FocusableItemCollectorComponent', () => {
  const mockDropdownMenu = jasmine.createSpyObj('ClrDropdownMenu', ['addChildren']);

  let fixture: ComponentFixture<FocusableItemCollectorComponent>;
  let component: FocusableItemCollectorComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FocusableItemCollectorComponent],
      providers: [{ provide: ClrDropdownMenu, useValue: mockDropdownMenu }],
    });

    fixture = TestBed.createComponent(FocusableItemCollectorComponent);
    component = fixture.componentInstance;
  });

  it('should override focusHandler.addChildren and handle item changes', () => {
    const mockFocusHandler = {
      addChildren: jasmine.createSpy('addChildren'),
    };

    component.parentMenu = {
      focusHandler: mockFocusHandler,
    } as unknown as ClrDropdownMenu;

    const item1 = { getFocusableItem: () => 'item1' } as FocusableItemProvider;
    const item2 = { getFocusableItem: () => 'item2' } as FocusableItemProvider;

    component.items = new QueryList<FocusableItemProvider>();
    component.items.reset([item1, item2]);

    spyOn((component as any).parentMenu, 'focusHandler').and.returnValue(mockFocusHandler);

    component.ngAfterContentInit();

    component.items.notifyOnChanges();

    expect(mockFocusHandler.addChildren).toHaveBeenCalledWith([item1.getFocusableItem(), item2.getFocusableItem()]);
  });
});

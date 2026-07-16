/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import { ZoomLevelServiceMock } from '@clr/addons/testing';
import { ClrDropdownModule } from '@clr/angular/popover/dropdown';

import { MenuComponent } from './menu.component';
import { MenuActionComponent } from './model/menu-action.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let overlayContainer: OverlayContainer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrDropdownModule],
      declarations: [MenuComponent],
      providers: [
        {
          provide: ZoomLevelService,
          useClass: ZoomLevelServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    overlayContainer = TestBed.inject(OverlayContainer);
    fixture.detectChanges();
  });

  afterEach(() => {
    if (component.dropdown?.popoverService?.open) {
      component.dropdown.popoverService.open = false;
    }
    overlayContainer.ngOnDestroy();
    fixture.destroy();
  });

  it('should show and close menu', () => {
    const event = new Event('click');
    const x = 10;
    const y = 20;

    component.show(event, x, y);

    expect(component.dropdown.popoverService.open).toBe(true);

    component.close(event);
  });

  it('should handle action', () => {
    const actionItem = {
      enabled: true,
      handle: { next: jasmine.createSpy() },
    } as unknown as MenuActionComponent;

    spyOn(component, 'handleAction').and.callThrough();

    component.handleAction(actionItem);

    expect(component.handleAction).toHaveBeenCalledWith(actionItem);
    expect(actionItem.handle.next).toHaveBeenCalled();
  });

  it('should handle document context menu', () => {
    const event = new Event('contextmenu');

    spyOn(component.dropdownElRef.nativeElement, 'contains').and.returnValue(true);

    const preventDefaultSpy = spyOn(Event.prototype, 'preventDefault');

    component.documentContextMenu(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should prevent default when context menu event is inside the menu', () => {
    const event = new Event('contextmenu');

    spyOn(component.dropdownElRef.nativeElement, 'contains').and.returnValue(true);
    const preventDefaultSpy = spyOn(event, 'preventDefault');

    component.documentContextMenu(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should close menu when context menu event is outside the menu', () => {
    const event = new Event('contextmenu');

    spyOn(component.dropdownElRef.nativeElement, 'contains').and.returnValue(false);
    const closeSpy = spyOn(component, 'close');

    component.documentContextMenu(event);

    expect(closeSpy).toHaveBeenCalledWith(event);
  });

  it('should update zoom level when zoom is changed', () => {
    const zoomLevelService = TestBed.inject(ZoomLevelService);
    zoomLevelService['resizeSubject'].next(ZoomLevel.x4);

    fixture.detectChanges();

    expect(component.currentZoomLevel).toEqual(ZoomLevel.x4);
  });

  it('should throw an error when menu items change', fakeAsync(() => {
    component.menuItems.reset([{} as any]);

    expect(() => {
      component.menuItems.notifyOnChanges();
      component.ngAfterContentInit();
      tick();
    }).toThrowError();
  }));
});

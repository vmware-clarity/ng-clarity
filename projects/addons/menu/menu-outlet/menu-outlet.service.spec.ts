/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Menu } from '../menu.interface';
import { MenuOutletComponent } from './menu-outlet.component';
import { MenuOutletService } from './menu-outlet.service';

@Component({
  selector: 'appfx-menu-outlet',
  standalone: false,
  template: '',
})
class MockMenuOutletComponent {
  attachMenu() {}
  detachMenu() {}
}

describe('MenuOutletService', () => {
  let service: MenuOutletService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuOutletService, { provide: MenuOutletComponent, useClass: MockMenuOutletComponent }],
    });
    service = TestBed.inject(MenuOutletService);
  });

  it('should attach and detach menu', () => {
    const menuComponentRef: ComponentRef<Menu> = {
      instance: {
        show: jasmine.createSpy(),
        closed: of({}),
      },
    } as unknown as ComponentRef<Menu>;

    service.menuOutlet = TestBed.inject(MenuOutletComponent);
    spyOn(service.menuOutlet, 'attachMenu');
    spyOn(service.menuOutlet, 'detachMenu');

    service.showMenu(menuComponentRef, {} as Event, 0, 0);

    expect(service.menuOutlet.attachMenu).toHaveBeenCalledWith(menuComponentRef);
    expect(menuComponentRef.instance.show).toHaveBeenCalled();
    expect(service.menuOutlet.detachMenu).toHaveBeenCalled();
  });

  it('should close menu', () => {
    service.menuOutlet = TestBed.inject(MenuOutletComponent);
    spyOn(service.menuOutlet, 'detachMenu');

    service.closeMenu();

    expect(service.menuOutlet.detachMenu).toHaveBeenCalled();
  });
});

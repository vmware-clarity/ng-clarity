/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalNavIconService } from './providers/vertical-nav-icon.service';
import { ClrVerticalNavIcon } from './vertical-nav-icon';

export default function (): void {
  describe('Vertical Nav Icons', () => {
    let fixture: ComponentFixture<any>;
    let verticalNavIconService: VerticalNavIconService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ClrVerticalNavIcon, TestComponent],
        providers: [VerticalNavIconService],
      });
      verticalNavIconService = TestBed.inject(VerticalNavIconService);
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
    });

    it('registers itself on the service', () => {
      expect(verticalNavIconService.hasIcons).toBe(true);

      fixture.destroy();
    });

    it('adds a nav-icon class to the host', () => {
      expect(fixture.debugElement.componentInstance.navIcon.nativeElement.classList.contains('nav-icon')).toBeTruthy();

      fixture.destroy();
    });

    it('unregisters the icon when the fixture is destroyed', () => {
      expect(verticalNavIconService.hasIcons).toBe(true);

      fixture.destroy();

      expect(verticalNavIconService.hasIcons).toBe(false);
    });
  });
}

@Component({
  template: `<div clrVerticalNavIcon #navIcon></div>`,
  standalone: false,
})
class TestComponent {
  @ViewChild('navIcon') navIcon: any;
}

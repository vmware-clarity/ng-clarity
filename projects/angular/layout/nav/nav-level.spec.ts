/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { spec, TestContext } from '@clr/angular/testing';
import { LARGE_BREAKPOINT } from '@clr/angular/utils';

import { ClrNavLevel } from './nav-level';
import { ClrNavigationModule } from './navigation.module';
import { ResponsiveNavigationService } from './providers/responsive-navigation.service';
import { ResponsiveNavCodes } from './responsive-nav-codes';

@Component({
  template: `
    <nav [clr-nav-level]="1">
      <a href="javascript:void(0)">Level 1</a>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestComponent {}

type Context = TestContext<ClrNavLevel, TestComponent>;

describe('NavLevelDirective', function () {
  spec(ClrNavLevel, TestComponent, ClrNavigationModule, {}, true);

  it('#level is set to 1', function (this: Context) {
    const navLevel = this.clarityDirective;
    expect(navLevel.level).toBe(ResponsiveNavCodes.NAV_LEVEL_1);
  });

  it('#level is set to 2', async function (this: Context) {
    const navLevel = this.clarityDirective;
    navLevel._level = 2;
    expect(navLevel.level).toBe(ResponsiveNavCodes.NAV_LEVEL_2);
  });
  it('should set [attr.hidden] when called hideNavigation()', function (this: Context) {
    const navLevel = this.clarityDirective;
    navLevel['hideNavigation']();
    const element = this.fixture.nativeElement.querySelector('nav');
    expect(element.getAttribute('aria-hidden')).toBe('true');
    expect(element.getAttribute('hidden')).toBe('true');
  });

  it('should remove [attr.hidden] when called showNavigation()', function (this: Context) {
    const navLevel = this.clarityDirective;
    const element = this.fixture.nativeElement.querySelector('nav');
    navLevel['hideNavigation']();
    expect(element.getAttribute('hidden')).toBe('true');
    navLevel['showNavigation']();
    expect(element.getAttribute('aria-hidden')).toBe('false');
    expect(element.getAttribute('hidden')).toBeNull();
  });

  it('should set [attr.hidden] when called hideCloseButton()', function (this: Context) {
    const navLevel = this.clarityDirective;
    const element = this.fixture.nativeElement.querySelector('.clr-nav-close');
    navLevel['hideCloseButton']();
    expect(element.getAttribute('aria-hidden')).toBe('true');
    expect(element.getAttribute('hidden')).toBe('true');
  });

  it('should remove [attr.hidden] when called showCloseButton()', function (this: Context) {
    const navLevel = this.clarityDirective;
    const element = this.fixture.nativeElement.querySelector('.clr-nav-close');
    navLevel['hideCloseButton']();
    expect(element.getAttribute('aria-hidden')).toBe('true');
    expect(element.getAttribute('hidden')).toBe('true');
    navLevel['showCloseButton']();
    expect(element.getAttribute('aria-hidden')).toBe('false');
    expect(element.getAttribute('hidden')).toBeNull();
  });

  it('should hide the navigation when document client width is smaller than LARGE_BREAKPOINT', function (this: Context) {
    this.clarityDirective.onResize({
      target: {
        innerWidth: LARGE_BREAKPOINT - 1,
      },
    } as unknown as Event);

    expect(this.clarityDirective.isOpen).toBe(false);
  });

  it('should disable focus trap by default', function (this: Context) {
    const cdkTrapFocus = getCdkTrapFocus(this.clarityDirective);
    expect(cdkTrapFocus.enabled).toBe(false);
  });

  describe('ResponsiveNavLevel intergration:', function () {
    it('#registers nav on init. sends the registration code on registerNavSubject in the service', function () {
      const service = new ResponsiveNavigationService();

      service.registerNav(ResponsiveNavCodes.NAV_LEVEL_1);
      service.registeredNavs.subscribe(navArray => {
        expect(navArray[0]).toBe(ResponsiveNavCodes.NAV_LEVEL_1);
      });
    });

    it('#sends the open code on controlNavSubject in the service when open() is called', function (this: Context) {
      const navLevel = this.clarityDirective;
      const service = this.clarityDirective['responsiveNavService'];
      service.navControl.subscribe(controlMessage => {
        expect(controlMessage.controlCode).toBe(ResponsiveNavCodes.NAV_OPEN);
      });
      navLevel.open();
    });

    it('#sends the close code on controlNavSubject when close() is called', function (this: Context) {
      const navLevel = this.clarityDirective;
      const service = this.clarityDirective['responsiveNavService'];
      service.navControl.subscribe(controlMessage => {
        expect(controlMessage.controlCode).toBe(ResponsiveNavCodes.NAV_CLOSE);
      });
      navLevel.close();
    });

    it('#unregisters itself from the registerNavSubject when ngOnDestroy() is called', function (this: Context) {
      const navLevel = this.clarityDirective;
      const service = this.clarityDirective['responsiveNavService'];
      navLevel.ngOnDestroy();
      service.registeredNavs.subscribe(navArray => {
        expect(navArray.length).toBe(0);
      });
    });
  });

  describe('Open/Close functionality: ', function () {
    it('should be open', function (this: Context) {
      this.clarityDirective.open();
      expect(this.clarityDirective.isOpen).toBe(true);
    });

    describe('Open', function () {
      it('should not be open by default', function (this: Context) {
        expect(this.clarityDirective.isOpen).toBe(false);
      });

      it('should call showNavigation()', function (this: Context) {
        spyOn<any>(this.clarityDirective, 'showNavigation');
        this.clarityDirective.open();
        expect(this.clarityDirective['showNavigation']).toHaveBeenCalled();
      });

      it('should enable focus trap', function (this: Context) {
        const cdkTrapFocus = getCdkTrapFocus(this.clarityDirective);
        this.clarityDirective.open();
        expect(cdkTrapFocus.enabled).toBe(true);
      });

      it('should call showCloseButton()', function (this: Context) {
        spyOn<any>(this.clarityDirective, 'showCloseButton');
        this.clarityDirective.open();
        expect(this.clarityDirective['showCloseButton']).toHaveBeenCalled();
      });
    });

    it('should be closed', function (this: Context) {
      this.clarityDirective.close();
      expect(this.clarityDirective.isOpen).toBe(false);
    });

    describe('Close', function () {
      it('should be closed by default', function (this: Context) {
        expect(this.clarityDirective.isOpen).toBe(false);
      });

      it('should call hideNavigation()', function (this: Context) {
        const spy = spyOn<any>(this.clarityDirective, 'hideNavigation');
        this.clarityDirective.close();
        expect(spy).toHaveBeenCalled();
      });

      it('should call removeFocusTrap()', function (this: Context) {
        const cdkTrapFocus = getCdkTrapFocus(this.clarityDirective);
        this.clarityDirective.close();
        expect(cdkTrapFocus.enabled).toBeFalse();
      });

      it('should call hideCloseButton()', function (this: Context) {
        const spy = spyOn<any>(this.clarityDirective, 'hideCloseButton');
        this.clarityDirective.close();
        expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('ngAfterViewInit: ', function () {
    it('should add close button to the host element', function (this: Context) {
      const closeButtons = this.fixture.elementRef.nativeElement.querySelectorAll('.clr-nav-close');
      expect(closeButtons.length).toBe(1);
      expect(closeButtons[0]).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Close button:', function () {
    it('should hide navigation when the close button is clicked', function (this: Context) {
      /**
       * Tried to spyOn on the 'close` function but since we are using `this.close.bind(this)` the spy is not working.
       */
      const closeButton = this.fixture.elementRef.nativeElement.querySelector('.clr-nav-close');
      this.clarityDirective['_isOpen'] = false;
      closeButton.click();
      expect(this.clarityDirective.isOpen).toBe(false);
    });
  });
});

function getCdkTrapFocus(clrNavLevel: ClrNavLevel) {
  return (clrNavLevel as any).cdkTrapFocus;
}

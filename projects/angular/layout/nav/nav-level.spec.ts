/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { spec } from '@clr/angular/testing';
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

describe('NavLevelDirective', () => {
  let testContext: any;

  const getContext = spec(ClrNavLevel, TestComponent, ClrNavigationModule, null, true);
  beforeEach(() => {
    testContext = getContext();
  });

  it('#level is set to 1', () => {
    const navLevel = testContext.clarityDirective;
    expect(navLevel.level).toBe(ResponsiveNavCodes.NAV_LEVEL_1);
  });

  it('#level is set to 2', async () => {
    const navLevel = testContext.clarityDirective;
    navLevel._level = 2;
    expect(navLevel.level).toBe(ResponsiveNavCodes.NAV_LEVEL_2);
  });
  it('should set [attr.hidden] when called hideNavigation()', () => {
    const navLevel = testContext.clarityDirective;
    navLevel.hideNavigation();
    const element = testContext.fixture.nativeElement.querySelector('nav');
    expect(element.getAttribute('aria-hidden')).toBe('true');
    expect(element.getAttribute('hidden')).toBe('true');
  });

  it('should remove [attr.hidden] when called showNavigation()', () => {
    const navLevel = testContext.clarityDirective;
    const element = testContext.fixture.nativeElement.querySelector('nav');
    navLevel.hideNavigation();
    expect(element.getAttribute('hidden')).toBe('true');
    navLevel.showNavigation();
    expect(element.getAttribute('aria-hidden')).toBe('false');
    expect(element.getAttribute('hidden')).toBeNull();
  });

  it('should set [attr.hidden] when called hideCloseButton()', () => {
    const navLevel = testContext.clarityDirective;
    const element = testContext.fixture.nativeElement.querySelector('.clr-nav-close');
    navLevel.hideCloseButton();
    expect(element.getAttribute('aria-hidden')).toBe('true');
    expect(element.getAttribute('hidden')).toBe('true');
  });

  it('should remove [attr.hidden] when called showCloseButton()', () => {
    const navLevel = testContext.clarityDirective;
    const element = testContext.fixture.nativeElement.querySelector('.clr-nav-close');
    navLevel.hideCloseButton();
    expect(element.getAttribute('aria-hidden')).toBe('true');
    expect(element.getAttribute('hidden')).toBe('true');
    navLevel.showCloseButton();
    expect(element.getAttribute('aria-hidden')).toBe('false');
    expect(element.getAttribute('hidden')).toBeNull();
  });

  it('should hide the navigation when document client width is smaller than LARGE_BREAKPOINT', () => {
    testContext.clarityDirective.onResize({
      target: {
        innerWidth: LARGE_BREAKPOINT - 1,
      },
    });

    expect(testContext.clarityDirective.isOpen).toBe(false);
  });

  it('should disable focus trap by default', () => {
    const cdkTrapFocus = getCdkTrapFocus(testContext.clarityDirective);
    expect(cdkTrapFocus.enabled).toBe(false);
  });

  describe('ResponsiveNavLevel intergration:', () => {
    it('#registers nav on init. sends the registration code on registerNavSubject in the service', () => {
      const service = new ResponsiveNavigationService();

      service.registerNav(ResponsiveNavCodes.NAV_LEVEL_1);
      service.registeredNavs.subscribe(navArray => {
        expect(navArray[0]).toBe(ResponsiveNavCodes.NAV_LEVEL_1);
      });
    });

    it('#sends the open code on controlNavSubject in the service when open() is called', () => {
      const navLevel = testContext.clarityDirective;
      const service = testContext.clarityDirective.responsiveNavService;
      service.navControl.subscribe(controlMessage => {
        expect(controlMessage.controlCode).toBe(ResponsiveNavCodes.NAV_OPEN);
      });
      navLevel.open();
    });

    it('#sends the close code on controlNavSubject when close() is called', () => {
      const navLevel = testContext.clarityDirective;
      const service = testContext.clarityDirective.responsiveNavService;
      service.navControl.subscribe(controlMessage => {
        expect(controlMessage.controlCode).toBe(ResponsiveNavCodes.NAV_CLOSE);
      });
      navLevel.close();
    });

    it('#unregisters itself from the registerNavSubject when ngOnDestroy() is called', () => {
      const navLevel = testContext.clarityDirective;
      const service = testContext.clarityDirective.responsiveNavService;
      navLevel.ngOnDestroy();
      service.registeredNavs.subscribe(navArray => {
        expect(navArray.length).toBe(0);
      });
    });
  });

  describe('Open/Close functionality: ', () => {
    it('should be open', () => {
      testContext.clarityDirective.open();
      expect(testContext.clarityDirective.isOpen).toBe(true);
    });

    describe('Open', () => {
      it('should not be open by default', () => {
        expect(testContext.clarityDirective.isOpen).toBe(false);
      });

      it('should call showNavigation()', () => {
        vi.spyOn(testContext.clarityDirective, 'showNavigation').mockImplementation(() => undefined);
        testContext.clarityDirective.open();
        expect(testContext.clarityDirective.showNavigation).toHaveBeenCalled();
      });

      it('should enable focus trap', () => {
        const cdkTrapFocus = getCdkTrapFocus(testContext.clarityDirective);
        testContext.clarityDirective.open();
        expect(cdkTrapFocus.enabled).toBe(true);
      });

      it('should call showCloseButton()', () => {
        vi.spyOn(testContext.clarityDirective, 'showCloseButton').mockImplementation(() => undefined);
        testContext.clarityDirective.open();
        expect(testContext.clarityDirective.showCloseButton).toHaveBeenCalled();
      });
    });

    it('should be closed', () => {
      testContext.clarityDirective.close();
      expect(testContext.clarityDirective.isOpen).toBe(false);
    });

    describe('Close', () => {
      it('should be closed by default', () => {
        expect(testContext.clarityDirective.isOpen).toBe(false);
      });

      it('should call hideNavigation()', () => {
        const spy = vi.spyOn(testContext.clarityDirective, 'hideNavigation').mockImplementation(() => undefined);
        testContext.clarityDirective.close();
        expect(spy).toHaveBeenCalled();
      });

      it('should call removeFocusTrap()', () => {
        const cdkTrapFocus = getCdkTrapFocus(testContext.clarityDirective);
        testContext.clarityDirective.close();
        expect(cdkTrapFocus.enabled).toBe(false);
      });

      it('should call hideCloseButton()', () => {
        const spy = vi.spyOn(testContext.clarityDirective, 'hideCloseButton').mockImplementation(() => undefined);
        testContext.clarityDirective.close();
        expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('ngAfterViewInit: ', () => {
    it('should add close button to the host element', () => {
      const closeButtons = testContext.fixture.elementRef.nativeElement.querySelectorAll('.clr-nav-close');
      expect(closeButtons.length).toBe(1);
      expect(closeButtons[0]).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Close button:', () => {
    it('should hide navigation when the close button is clicked', () => {
      /**
       * Tried to spyOn on the 'close` function but since we are using `this.close.bind(this)` the spy is not working.
       */
      const closeButton = testContext.fixture.elementRef.nativeElement.querySelector('.clr-nav-close');
      testContext.clarityDirective._isOpen = false;
      closeButton.click();
      expect(testContext.clarityDirective.isOpen).toBe(false);
    });
  });
});

function getCdkTrapFocus(clrNavLevel: ClrNavLevel) {
  return (clrNavLevel as any).cdkTrapFocus;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, HostBinding, Input, linkedSignal } from '@angular/core';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { ResponsiveNavigationService } from './providers/responsive-navigation.service';
import { ResponsiveNavCodes } from './responsive-nav-codes';

@Component({
  selector: 'clr-header',
  template: `
    @if (isNavLevel1OnPage) {
      <button
        type="button"
        class="header-hamburger-trigger"
        [attr.aria-label]="responsiveNavCommonString"
        (click)="openNav(responsiveNavCodes.NAV_LEVEL_1)"
      >
        <span></span>
      </button>
    }
    <ng-content></ng-content>
    @if (isNavLevel2OnPage) {
      <button
        type="button"
        class="header-overflow-trigger"
        [attr.aria-label]="responsiveOverflowCommonString"
        (click)="openNav(responsiveNavCodes.NAV_LEVEL_2)"
      >
        <span></span>
      </button>
    }
    <div class="header-backdrop" (click)="closeOpenNav()"></div>
  `,
  host: { '[class.header]': 'true' },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrHeader {
  @Input() @HostBinding('attr.role') role = 'banner';

  responsiveNavCodes = ResponsiveNavCodes;

  // Derived from the signal-backed nav level list of ResponsiveNavigationService, so the triggers are updated whenever
  // a clr-nav-level is registered or unregistered, including after the header was checked. It stays writable to keep
  // the public setters, resetNavTriggers() and initializeNavTriggers() working.
  private readonly navTriggers = linkedSignal(() => getNavTriggers(this.responsiveNavService.responsiveNavList));

  constructor(
    private responsiveNavService: ResponsiveNavigationService,
    public commonStrings: ClrCommonStringsService
  ) {}

  // The open level lives in ResponsiveNavigationService. It stays writable here to keep the public field working.
  get openNavLevel(): number | null {
    return this.responsiveNavService.openNavLevel();
  }
  set openNavLevel(value: number | null) {
    this.responsiveNavService.openNavLevel.set(value);
  }

  get isNavLevel1OnPage(): boolean {
    return this.navTriggers().level1;
  }
  set isNavLevel1OnPage(value: boolean) {
    this.navTriggers.update(triggers => ({ ...triggers, level1: value }));
  }

  get isNavLevel2OnPage(): boolean {
    return this.navTriggers().level2;
  }
  set isNavLevel2OnPage(value: boolean) {
    this.navTriggers.update(triggers => ({ ...triggers, level2: value }));
  }

  get responsiveNavCommonString() {
    const myCommonStrings = this.commonStrings.keys;
    if (this.openNavLevel !== this.responsiveNavCodes.NAV_LEVEL_1) {
      return myCommonStrings.responsiveNavToggleOpen;
    } else {
      return myCommonStrings.responsiveNavToggleClose;
    }
  }

  get responsiveOverflowCommonString() {
    const myCommonStrings = this.commonStrings.keys;
    if (this.openNavLevel !== this.responsiveNavCodes.NAV_LEVEL_2) {
      return myCommonStrings.responsiveNavOverflowOpen;
    } else {
      return myCommonStrings.responsiveNavOverflowClose;
    }
  }

  // reset triggers. handles cases when an application has different nav levels on different pages.
  resetNavTriggers() {
    this.navTriggers.set({ level1: false, level2: false });
  }

  // decides which triggers to show on the header
  initializeNavTriggers(navList: number[]): void {
    if (navList.length > 2) {
      console.error('More than 2 Nav Levels detected.');
    }
    this.navTriggers.set(getNavTriggers(navList));
  }

  // closes the nav that is open
  closeOpenNav() {
    this.responsiveNavService.closeAllNavs();
  }

  /**
   * @deprecated Will be removed in with @clr/angular v15.0.0
   *
   * Use `openNav(navLevel)` instead to open the navigation and ResponsiveNavService to close it.
   */
  toggleNav(navLevel: number) {
    if (this.openNavLevel === navLevel) {
      this.responsiveNavService.sendControlMessage(ResponsiveNavCodes.NAV_CLOSE, navLevel);
      return;
    }

    this.openNav(navLevel);
  }

  openNav(navLevel: number) {
    this.responsiveNavService.sendControlMessage(ResponsiveNavCodes.NAV_OPEN, navLevel);
  }
}

function getNavTriggers(navList: number[]): { level1: boolean; level2: boolean } {
  if (navList.length > 2) {
    return { level1: false, level2: false };
  }
  return {
    level1: navList.includes(ResponsiveNavCodes.NAV_LEVEL_1),
    level2: navList.includes(ResponsiveNavCodes.NAV_LEVEL_2),
  };
}

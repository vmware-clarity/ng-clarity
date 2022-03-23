/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ClrDestroyService } from '../../utils/destroy';
import { ResponsiveNavigationService } from '../nav/providers/responsive-navigation.service';
import { ResponsiveNavCodes } from '../nav/responsive-nav-codes';
import { ResponsiveNavControlMessage } from '../nav/responsive-nav-control-message';

@Directive({
  selector: 'clr-main-container',
  host: { '[class.main-container]': 'true' },
  providers: [ClrDestroyService],
})
export class ClrMainContainer implements OnInit {
  private _classList: DOMTokenList;

  constructor(
    private elRef: ElementRef,
    private responsiveNavService: ResponsiveNavigationService,
    private destroy$: ClrDestroyService
  ) {}

  ngOnInit() {
    this._classList = this.elRef.nativeElement.classList;
    this.responsiveNavService.navControl.pipe(takeUntil(this.destroy$)).subscribe({
      next: (message: ResponsiveNavControlMessage) => {
        this.processMessage(message);
      },
    });
  }

  processMessage(message: ResponsiveNavControlMessage): void {
    let navClass: string = ResponsiveNavCodes.NAV_CLASS_HAMBURGER_MENU;
    if (message.controlCode === ResponsiveNavCodes.NAV_CLOSE_ALL) {
      this._classList.remove(ResponsiveNavCodes.NAV_CLASS_HAMBURGER_MENU);
      this._classList.remove(ResponsiveNavCodes.NAV_CLASS_OVERFLOW_MENU);
    } else if (message.navLevel === ResponsiveNavCodes.NAV_LEVEL_1) {
      this.controlNav(message.controlCode, navClass);
    } else if (message.navLevel === ResponsiveNavCodes.NAV_LEVEL_2) {
      navClass = ResponsiveNavCodes.NAV_CLASS_OVERFLOW_MENU;
      this.controlNav(message.controlCode, navClass);
    }
  }

  controlNav(controlCode: string, navClass: string): void {
    if (controlCode === ResponsiveNavCodes.NAV_OPEN) {
      this._classList.add(navClass);
    } else if (controlCode === ResponsiveNavCodes.NAV_CLOSE) {
      this._classList.remove(navClass);
    } else if (controlCode === ResponsiveNavCodes.NAV_TOGGLE) {
      this._classList.toggle(navClass);
    }
  }
}

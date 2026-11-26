/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, signal } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

import { ResponsiveNavCodes } from '../responsive-nav-codes';
import { ResponsiveNavControlMessage } from '../responsive-nav-control-message';

@Injectable({ providedIn: 'root' })
export class ResponsiveNavigationService {
  /**
   * The nav level that is open, or `null` when none is. Every control message updates it, so the header triggers,
   * the nav levels and any consumer reading it share one value.
   */
  readonly openNavLevel = signal<number | null>(null);

  // The list is mutated in place (its reference is what `registeredNavs` emits), so the signal is configured to
  // notify on every write rather than on reference change. Views reading `responsiveNavList` are refreshed
  // whenever a nav level is registered or unregistered.
  private readonly _responsiveNavList = signal<number[]>([], { equal: () => false });

  private registerNavSubject = new ReplaySubject<number[]>();
  private controlNavSubject = new Subject<ResponsiveNavControlMessage>();

  constructor() {
    this.closeAllNavs(); // We start with all navs closed
  }

  get responsiveNavList(): number[] {
    return this._responsiveNavList();
  }
  set responsiveNavList(value: number[]) {
    this._responsiveNavList.set(value);
  }

  get registeredNavs(): Observable<number[]> {
    return this.registerNavSubject.asObservable();
  }

  get navControl(): Observable<ResponsiveNavControlMessage> {
    return this.controlNavSubject.asObservable();
  }

  registerNav(navLevel: number): void {
    if (!navLevel || this.isNavRegistered(navLevel)) {
      return;
    }
    const navList = this.responsiveNavList;
    navList.push(navLevel);
    if (navList.length > 2) {
      console.error('More than 2 Nav Levels detected.');
    }
    this._responsiveNavList.set(navList);
    this.registerNavSubject.next(navList);
  }

  isNavRegistered(navLevel: number): boolean {
    if (this.responsiveNavList.indexOf(navLevel) > -1) {
      console.error('Multiple clr-nav-level ' + navLevel + ' attributes found. Please make sure that only one exists');
      return true;
    }
    return false;
  }

  unregisterNav(navLevel: number) {
    const index = this.responsiveNavList.indexOf(navLevel);
    if (index > -1) {
      const navList = this.responsiveNavList;
      navList.splice(index, 1);
      this._responsiveNavList.set(navList);
      if (this.openNavLevel() === navLevel) {
        this.openNavLevel.set(null);
      }
      this.registerNavSubject.next(navList);
    }
  }

  sendControlMessage(controlCode: string, navLevel: number) {
    this.openNavLevel.update(openNavLevel => openNavLevelAfter(openNavLevel, controlCode, navLevel));
    this.controlNavSubject.next(new ResponsiveNavControlMessage(controlCode, navLevel));
  }

  closeAllNavs() {
    this.sendControlMessage(ResponsiveNavCodes.NAV_CLOSE_ALL, -999);
  }
}

function openNavLevelAfter(openNavLevel: number | null, controlCode: string, navLevel: number): number | null {
  switch (controlCode) {
    case ResponsiveNavCodes.NAV_OPEN:
      return navLevel;
    case ResponsiveNavCodes.NAV_CLOSE:
      return openNavLevel === navLevel ? null : openNavLevel;
    case ResponsiveNavCodes.NAV_CLOSE_ALL:
      return null;
    default:
      return openNavLevel;
  }
}

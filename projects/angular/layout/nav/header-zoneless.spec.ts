/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ApplicationRef, ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { ClrHeader } from './header';
import { ClrNavLevel } from './nav-level';
import { ClrNavigationModule } from './navigation.module';
import { ResponsiveNavigationService } from './providers/responsive-navigation.service';
import { ResponsiveNavCodes } from './responsive-nav-codes';

/**
 * OnPush component rendered after the header (like a page in a router outlet) that registers nav levels late.
 * The header has already been checked when these nav levels are created or destroyed.
 */
@Component({
  selector: 'late-nav',
  template: `
    @if (level1()) {
      <nav class="sidenav" [clr-nav-level]="1"></nav>
    }
    @if (level2()) {
      <nav class="subnav" [clr-nav-level]="2"></nav>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class LateNav {
  readonly level1 = signal(false);
  readonly level2 = signal(false);
}

/**
 * Reads the header's open level in its own template, like an application that hides header actions while the
 * hamburger menu is open.
 */
@Component({
  template: `
    <clr-header #header [role]="role()">
      <div class="branding">{{ title() }}</div>
      <span class="open-level">{{ header.openNavLevel }}</span>
    </clr-header>
    <late-nav></late-nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class ZonelessHeaderHost {
  readonly title = signal('Title');
  readonly role = signal('banner');
}

describe('ClrHeader (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<ZonelessHeaderHost>;
  let lateNav: LateNav;
  let header: ClrHeader;

  function triggers(): { hamburger: boolean; overflow: boolean } {
    return {
      hamburger: !!fixture.nativeElement.querySelector('.header-hamburger-trigger'),
      overflow: !!fixture.nativeElement.querySelector('.header-overflow-trigger'),
    };
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ZonelessHeaderHost, LateNav],
      imports: [ClrNavigationModule],
    });

    fixture = TestBed.createComponent(ZonelessHeaderHost);
    header = fixture.debugElement.children[0].componentInstance;
    lateNav = fixture.debugElement.children[1].componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('shows no nav triggers without nav levels', () => {
    expect(triggers()).toEqual({ hamburger: false, overflow: false });
  });

  it('shows the hamburger trigger when a level 1 nav is added after the header was checked', async () => {
    lateNav.level1.set(true);
    await fixture.whenStable();
    expect(triggers()).toEqual({ hamburger: true, overflow: false });

    lateNav.level1.set(false);
    await fixture.whenStable();
    expect(triggers()).toEqual({ hamburger: false, overflow: false });
  });

  it('shows the overflow trigger when a level 2 nav is added after the header was checked', async () => {
    lateNav.level2.set(true);
    await fixture.whenStable();
    expect(triggers()).toEqual({ hamburger: false, overflow: true });

    lateNav.level1.set(true);
    await fixture.whenStable();
    expect(triggers()).toEqual({ hamburger: true, overflow: true });

    lateNav.level2.set(false);
    await fixture.whenStable();
    expect(triggers()).toEqual({ hamburger: true, overflow: false });
  });
  it('allows manual trigger overrides and derives them again after nav registration', async () => {
    header.isNavLevel1OnPage = true;
    header.isNavLevel2OnPage = true;
    await fixture.whenStable();
    expect(triggers()).toEqual({ hamburger: true, overflow: true });

    header.resetNavTriggers();
    await fixture.whenStable();
    expect(triggers()).toEqual({ hamburger: false, overflow: false });

    header.initializeNavTriggers([2]);
    await fixture.whenStable();
    expect(triggers()).toEqual({ hamburger: false, overflow: true });

    lateNav.level1.set(true);
    await fixture.whenStable();
    expect(triggers()).toEqual({ hamburger: true, overflow: false });
  });
  it('refreshes projected content and the role input', async () => {
    fixture.componentInstance.title.set('New title');
    fixture.componentInstance.role.set('navigation');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.branding').textContent).toBe('New title');
    expect(fixture.nativeElement.querySelector('clr-header').getAttribute('role')).toBe('navigation');
  });

  describe('open nav level', () => {
    const { NAV_LEVEL_1, NAV_LEVEL_2 } = ResponsiveNavCodes;

    function labels(): { hamburger: string; overflow: string } {
      return {
        hamburger: fixture.nativeElement.querySelector('.header-hamburger-trigger')?.getAttribute('aria-label'),
        overflow: fixture.nativeElement.querySelector('.header-overflow-trigger')?.getAttribute('aria-label'),
      };
    }

    function openLevelText(): string {
      return fixture.nativeElement.querySelector('.open-level').textContent;
    }

    function navLevel(level: number): ClrNavLevel {
      return fixture.debugElement
        .queryAll(By.directive(ClrNavLevel))
        .map(element => element.injector.get(ClrNavLevel))
        .find(nav => nav.level === level);
    }

    const closed = { hamburger: 'Open navigation menu', overflow: 'Open navigation overflow menu' };

    beforeEach(async () => {
      lateNav.level1.set(true);
      lateNav.level2.set(true);
      await fixture.whenStable();
    });

    it('labels the trigger of the level opened from the header and resets it when the backdrop closes it', async () => {
      fixture.nativeElement.querySelector('.header-hamburger-trigger').click();
      await fixture.whenStable();
      expect(labels()).toEqual({ ...closed, hamburger: 'Close navigation menu' });
      expect(openLevelText()).toBe(`${NAV_LEVEL_1}`);
      expect(navLevel(NAV_LEVEL_1).isOpen).toBe(true);

      fixture.nativeElement.querySelector('.header-backdrop').click();
      await fixture.whenStable();
      expect(labels()).toEqual(closed);
      expect(openLevelText()).toBe('');
      expect(navLevel(NAV_LEVEL_1).isOpen).toBe(false);
    });

    it('follows a nav level opened and closed outside the header', async () => {
      navLevel(NAV_LEVEL_2).open();
      await fixture.whenStable();
      expect(labels()).toEqual({ ...closed, overflow: 'Close navigation overflow menu' });
      expect(openLevelText()).toBe(`${NAV_LEVEL_2}`);

      fixture.nativeElement.querySelector('.clr-nav-level-2 .clr-nav-close').click();
      await fixture.whenStable();
      expect(labels()).toEqual(closed);
      expect(openLevelText()).toBe('');
    });

    it('resets after an asynchronous closeAllNavs()', async () => {
      header.openNav(NAV_LEVEL_1);
      await fixture.whenStable();
      expect(labels().hamburger).toBe('Close navigation menu');

      await new Promise<void>(resolve =>
        setTimeout(() => {
          TestBed.inject(ResponsiveNavigationService).closeAllNavs();
          resolve();
        })
      );
      await fixture.whenStable();
      expect(labels()).toEqual(closed);
      expect(openLevelText()).toBe('');
    });

    it('keeps the open level when another level closes', async () => {
      header.openNav(NAV_LEVEL_1);
      header.openNav(NAV_LEVEL_2);
      await fixture.whenStable();
      expect(labels()).toEqual({ ...closed, overflow: 'Close navigation overflow menu' });

      navLevel(NAV_LEVEL_1).close();
      await fixture.whenStable();
      expect(labels()).toEqual({ ...closed, overflow: 'Close navigation overflow menu' });
    });

    it('relabels the triggers after localize()', async () => {
      header.openNav(NAV_LEVEL_1);
      await fixture.whenStable();

      TestBed.inject(ClrCommonStringsService).localize({
        responsiveNavToggleClose: 'Menü schließen',
        responsiveNavOverflowOpen: 'Überlaufmenü öffnen',
      });
      await fixture.whenStable();
      expect(labels()).toEqual({ hamburger: 'Menü schließen', overflow: 'Überlaufmenü öffnen' });
    });

    it('toggles with the deprecated toggleNav()', async () => {
      header.toggleNav(NAV_LEVEL_1);
      await fixture.whenStable();
      expect(labels().hamburger).toBe('Close navigation menu');

      header.toggleNav(NAV_LEVEL_1);
      await fixture.whenStable();
      expect(labels()).toEqual(closed);
    });

    it('keeps openNavLevel writable', async () => {
      header.openNavLevel = NAV_LEVEL_2;
      await fixture.whenStable();
      expect(labels()).toEqual({ ...closed, overflow: 'Close navigation overflow menu' });
      expect(openLevelText()).toBe(`${NAV_LEVEL_2}`);
    });

    it('resets when the open nav level is destroyed and does not carry over to a new one', async () => {
      header.openNav(NAV_LEVEL_1);
      await fixture.whenStable();

      lateNav.level1.set(false);
      await fixture.whenStable();
      expect(openLevelText()).toBe('');

      lateNav.level1.set(true);
      await fixture.whenStable();
      expect(labels()).toEqual(closed);
      expect(navLevel(NAV_LEVEL_1).isOpen).toBe(false);
    });

    it('destroys the close button icon with its nav level', async () => {
      const appRef = TestBed.inject(ApplicationRef);
      const views = appRef.viewCount;

      lateNav.level1.set(false);
      lateNav.level2.set(false);
      await fixture.whenStable();
      expect(appRef.viewCount).toBe(views - 2);
    });
  });
});

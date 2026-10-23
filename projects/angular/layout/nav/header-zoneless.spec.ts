/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  Component,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrHeader } from './header';
import { ClrNavigationModule } from './navigation.module';

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

@Component({
  template: `
    <clr-header>
      <div class="branding">Title</div>
    </clr-header>
    <late-nav></late-nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class ZonelessHeaderHost {}

describe('ClrHeader (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<ZonelessHeaderHost>;
  let lateNav: LateNav;

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
      providers: [provideZonelessChangeDetection(), provideCheckNoChangesConfig({ exhaustive: true })],
    });

    fixture = TestBed.createComponent(ZonelessHeaderHost);
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
    const header: ClrHeader = fixture.debugElement.children[0].componentInstance;
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
});

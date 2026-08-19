/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrTabsModule } from '@clr/angular/layout/tabs';

import { IfTabActiveDirective } from './if-tab-active.directive';

@Component({
  standalone: false,
  template: `
    <clr-tabs>
      <clr-tab
        appfxIfTabActive
        activeClass="my-active-class"
        [activateTab]="firstActive"
        (appfxIfTabActiveChange)="firstChange($event)"
      >
        <button clrTabLink>Tab 1</button>
        <clr-tab-content>content 1</clr-tab-content>
      </clr-tab>
      <clr-tab
        appfxIfTabActive
        activeClass="my-active-class"
        [activateTab]="secondActive"
        (appfxIfTabActiveChange)="secondChange($event)"
      >
        <button clrTabLink>Tab 2</button>
        <clr-tab-content>content 2</clr-tab-content>
      </clr-tab>
    </clr-tabs>
  `,
})
class TestHostComponent {
  firstActive = true;
  secondActive = false;

  firstChange = jasmine.createSpy('firstChange');
  secondChange = jasmine.createSpy('secondChange');
}

describe('IfTabActiveDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrTabsModule],
      declarations: [TestHostComponent, IfTabActiveDirective],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function tabLinkElements(): HTMLElement[] {
    return fixture.debugElement.queryAll(By.css('[clrTabLink]')).map(debugEl => debugEl.nativeElement);
  }

  it('activates the tab whose activateTab input is true', () => {
    // Native Clarity `.active` state is derived reactively (a getter), so it's correct
    // immediately. The directive's own `activeClass`/output only react to *changes* on
    // IfActiveService's currentChange, which is a plain Subject: it can't replay the
    // activation that happened synchronously while the directive was still being
    // constructed, so those only reflect transitions that occur after init (see below).
    const [firstLink, secondLink] = tabLinkElements();

    expect(firstLink.classList).toContain('active');
    expect(secondLink.classList).not.toContain('active');
  });

  it('switches the active tab when activateTab flips on another tab', () => {
    host.firstActive = false;
    host.secondActive = true;
    fixture.detectChanges();

    const [firstLink, secondLink] = tabLinkElements();

    expect(firstLink.classList).not.toContain('my-active-class');
    expect(secondLink.classList).toContain('my-active-class');
    expect(host.secondChange).toHaveBeenCalledWith(true);
  });

  it('activates the tab when its link is clicked directly', () => {
    const [, secondLink] = tabLinkElements();

    secondLink.click();
    fixture.detectChanges();

    const [firstLink, refreshedSecondLink] = tabLinkElements();
    expect(firstLink.classList).not.toContain('my-active-class');
    expect(refreshedSecondLink.classList).toContain('my-active-class');
    expect(host.secondChange).toHaveBeenCalledWith(true);
  });
});

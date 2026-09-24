/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { VerticalNavGroupRegistrationService } from './providers/vertical-nav-group-registration.service';
import { VerticalNavIconService } from './providers/vertical-nav-icon.service';
import { VerticalNavService } from './providers/vertical-nav.service';
import { ClrVerticalNav } from './vertical-nav';
import { ClrVerticalNavModule } from './vertical-nav.module';

@Component({
  template: `
    <clr-vertical-nav>
      <a clrVerticalNavLink href="#/hosts">Hosts</a>
    </clr-vertical-nav>
    <clr-vertical-nav role="none" class="wrapped">
      <a clrVerticalNavLink href="#/vms">VMs</a>
    </clr-vertical-nav>
    <nav aria-label="Sidebar">
      <clr-vertical-nav class="inside-nav">
        <a clrVerticalNavLink href="#/storage">Storage</a>
      </clr-vertical-nav>
    </nav>
    <div role="navigation" aria-label="Secondary">
      <div>
        <clr-vertical-nav class="inside-role-navigation">
          <a clrVerticalNavLink href="#/networks">Networks</a>
        </clr-vertical-nav>
      </div>
    </div>
    <nav aria-label="Authored inside">
      <clr-vertical-nav role="menu" class="authored-inside-nav">
        <a clrVerticalNavLink href="#/datastores">Datastores</a>
      </clr-vertical-nav>
    </nav>
    <clr-vertical-nav [attr.role]="boundRole" class="bound">
      <a clrVerticalNavLink href="#/clusters">Clusters</a>
    </clr-vertical-nav>
  `,
  standalone: false,
})
class TestComponent {
  boundRole: string | null = 'region';
}

describe('Vertical nav, as assistive technology sees it', () => {
  let fixture: ComponentFixture<TestComponent>;

  function nav(selector: string): HTMLElement {
    return fixture.nativeElement.querySelector(`clr-vertical-nav${selector}`);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrVerticalNavModule, NoopAnimationsModule],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('is a navigation landmark', () => {
    expect(nav('').getAttribute('role')).toBe('navigation');
  });

  it('lets the application override the role', () => {
    expect(nav('.wrapped').getAttribute('role')).toBe('none');
  });

  it('keeps a role written in the template across change detection', () => {
    fixture.detectChanges();
    fixture.detectChanges();

    expect(nav('.wrapped').getAttribute('role')).toBe('none');
  });

  it('adds no landmark of its own inside an existing one, so the page does not get two nested', () => {
    expect(nav('.inside-nav').hasAttribute('role')).toBe(false);
  });

  it('treats an ancestor with role="navigation" as an existing landmark, too', () => {
    expect(nav('.inside-role-navigation').hasAttribute('role')).toBe(false);
  });

  it('keeps a role written in the template inside a landmark', () => {
    expect(nav('.authored-inside-nav').getAttribute('role')).toBe('menu');
  });

  it('keeps the role the application binds', () => {
    expect(nav('.bound').getAttribute('role')).toBe('region');
  });

  it('keeps following the role the application binds when it changes later', () => {
    fixture.componentInstance.boundRole = 'complementary';
    fixture.detectChanges();
    expect(nav('.bound').getAttribute('role')).toBe('complementary');

    fixture.componentInstance.boundRole = null;
    fixture.detectChanges();
    expect(nav('.bound').hasAttribute('role')).toBe(false);

    fixture.componentInstance.boundRole = 'region';
    fixture.detectChanges();
    expect(nav('.bound').getAttribute('role')).toBe('region');
  });
});

describe('Vertical nav, constructed without its element', () => {
  // Subclasses written before the element argument existed call `super()` without it.
  function construct(): ClrVerticalNav {
    return new ClrVerticalNav(
      new VerticalNavService(),
      new VerticalNavIconService(),
      new VerticalNavGroupRegistrationService(),
      new ClrCommonStringsService()
    );
  }

  it('can be created, initialised and destroyed', () => {
    expect(() => {
      const verticalNav = construct();
      verticalNav.ngOnInit();
      verticalNav.ngOnDestroy();
    }).not.toThrow();
  });

  it('still reports itself as a navigation landmark', () => {
    const verticalNav = construct();
    verticalNav.ngOnInit();

    expect(verticalNav['hostRole']).toBe('navigation');
    verticalNav.ngOnDestroy();
  });
});

/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { MainContainerWillyWonka } from './chocolate/main-container-willy-wonka';
import { ClrNavigationModule } from './navigation.module';
import { ClrAriaCurrentLink } from './aria-current-link';
@Component({
  template: `
    <clr-header class="header">
      <div class="header-nav">
        <a clrAriaCurrentLink class="nav-link" id="link1" routerLink="/home" routerLinkActive="active"
          ><span class="nav-text">Components</span></a
        >
        <a clrAriaCurrentLink class="nav-link" id="link2" routerLink="/patterns" routerLinkActive="active"
          ><span class="nav-text">Patterns</span></a
        >
      </div>
    </clr-header>
  `,
})
class TestComponent {}

describe('AriaCurrentLink Directive', () => {
  let fixture: ComponentFixture<any>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ClrNavigationModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: TestComponent },
          { path: 'patterns', component: TestComponent },
        ]),
      ],
      declarations: [TestComponent, ClrAriaCurrentLink],
      providers: [MainContainerWillyWonka],
    });

    fixture = TestBed.createComponent(TestComponent);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('decorates the active link with aria-current', fakeAsync(() => {
    router.navigate(['/home']);
    tick();
    fixture.detectChanges();

    const link1 = fixture.debugElement.query(By.css('#link1'));
    const link2 = fixture.debugElement.query(By.css('#link2'));

    expect(link1.nativeElement.getAttribute('aria-current')).toEqual('page');
    expect(link2.nativeElement.getAttribute('aria-current')).toBeNull();

    router.navigate(['/patterns']);
    tick();
    fixture.detectChanges();

    expect(link1.nativeElement.getAttribute('aria-current')).toBeNull();
    expect(link2.nativeElement.getAttribute('aria-current')).toEqual('page');
  }));
});

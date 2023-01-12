/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClrIconModule } from '../../icon/icon.module';
import { VerticalNavGroupRegistrationService } from './providers/vertical-nav-group-registration.service';
import { VerticalNavGroupService } from './providers/vertical-nav-group.service';
import { VerticalNavIconService } from './providers/vertical-nav-icon.service';
import { VerticalNavService } from './providers/vertical-nav.service';
import { ClrVerticalNavGroup } from './vertical-nav-group';
import { ClrVerticalNavLink } from './vertical-nav-link';
import { ClrVerticalNavModule } from './vertical-nav.module';

export default function (): void {
  describe('Vertical Nav Links', () => {
    let fixture: ComponentFixture<any>;
    let compiled: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrVerticalNavModule, ClrIconModule, NoopAnimationsModule],
        declarations: [TestComponent, TestComponentWithGroup],
      });
    });

    describe('View Basics', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
        compiled = fixture.nativeElement;
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('adds the .nav-link class on the links', () => {
        const navLinks = compiled.querySelectorAll('a');

        expect(navLinks[0].classList.contains('nav-link')).toBeTruthy();
        expect(navLinks[1].classList.contains('nav-link')).toBeTruthy();
      });

      it('projects the text in .nav-text', () => {
        const navText = compiled.querySelectorAll('.nav-text');

        expect(navText[0].textContent).toMatch(/Text/);
      });

      it('projects the icon directly under it and the text in .nav-text', () => {
        const navText = compiled.querySelectorAll('.nav-text');

        expect(navText[1].textContent).toMatch(/Icon Text/);

        const icon = compiled.querySelector('cds-icon');

        expect(icon).not.toBeNull();

        // expect(icon.parentElement).toBe(compiled.querySelector("#link2"));
      });

      it('should not add `click` listener if the `[clrVerticalNavLink]` is not located within the `clr-vertical-nav-group`', () => {
        const vertinalNavLink = fixture.debugElement.query(By.directive(ClrVerticalNavLink));
        expect(() => vertinalNavLink.injector.get(VerticalNavGroupService)).toThrow();
        expect(vertinalNavLink.nativeElement.eventListeners()).toEqual([]);
      });
    });

    describe('Nav Link Interactions with Nav Group', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(TestComponentWithGroup);
        fixture.detectChanges();
        compiled = fixture.nativeElement;
      });

      it('should add `click` listener if the `[clrVerticalNavLink]` is located within the `clr-vertical-nav-group`', () => {
        const vertinalNavLink = fixture.debugElement.query(By.css('#link1'));
        expect(vertinalNavLink.nativeElement.eventListeners().length).toEqual(1);
      });
    });
  });
}

@Component({
  template: `
    <a href="#" clrVerticalNavLink id="link1">Text</a>
    <a href="#" clrVerticalNavLink id="link2">
      <cds-icon shape="home" clrVerticalNavIcon></cds-icon>
      Icon Text
    </a>
  `,
  providers: [VerticalNavService, VerticalNavIconService, VerticalNavGroupRegistrationService],
})
class TestComponent {}

@Component({
  template: `
    <clr-vertical-nav-group #group>
      Group
      <a href="#" clrVerticalNavLink id="link1" #link>Link 1</a>
      <a href="#" clrVerticalNavLink id="link2">Link 2</a>
    </clr-vertical-nav-group>
    <a href="#" clrVerticalNavLink id="link3">Link 3</a>
  `,
  providers: [VerticalNavService, VerticalNavIconService, VerticalNavGroupRegistrationService],
})
class TestComponentWithGroup {
  @ViewChild('group') navGroup: ClrVerticalNavGroup;
  @ViewChild('link') navLink: ClrVerticalNavLink;
}

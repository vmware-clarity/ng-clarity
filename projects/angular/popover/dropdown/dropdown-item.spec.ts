/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { spec, TestContext } from '@clr/angular/testing';
import { FocusableItem } from '@clr/angular/utils';

import { ClrDropdown } from './dropdown';
import { ClrDropdownItem } from './dropdown-item';
import { ROOT_DROPDOWN_PROVIDER } from './providers/dropdown.service';

@Component({
  template: `<button clrDropdownItem [disabled]="disabledDeprecated" [clrDisabled]="disabled">Hello world</button>`,
  standalone: false,
})
class SimpleTest {
  disabled: boolean;
  disabledDeprecated: boolean;
}

@Component({
  template: `<button clrDropdownItem role="menuitemcheckbox">Hello world</button>`,
  standalone: false,
})
class CustomRoleTest {}

export default function (): void {
  describe('DropdownItem directive', function () {
    /*
     * Most tests for this directive are apparently jammed in the main dropdown.spec.ts,
     * but moving them isn't relevant to this commit.
     */

    type Context = TestContext<ClrDropdownItem, SimpleTest>;
    spec(ClrDropdownItem, SimpleTest, null, {
      // Dummy dropdown provider, I don't even need a single property or method on it at the moment.
      providers: [{ provide: ClrDropdown, useValue: {} }, ROOT_DROPDOWN_PROVIDER],
    });

    it('sets the id to the unique generated id', function (this: Context) {
      const id = 'myId';
      this.clarityElement.setAttribute('id', id);
      this.detectChanges();
      expect(this.clarityElement.getAttribute('id')).toBe(id);
    });

    it('should have id by default', function (this: Context) {
      expect(this.clarityElement.getAttribute('id')).not.toBe(null);
    });

    it('adds the menuitem role to the host', function (this: Context) {
      expect(this.clarityElement.getAttribute('role')).toBe('menuitem');
    });

    it('adds the disabled class if set by input', function (this: Context) {
      expect(this.clarityElement.classList.contains('disabled')).toBe(false);
      this.testComponent.disabled = true;
      this.detectChanges();
      expect(this.clarityElement.classList.contains('disabled')).toBe(true);
    });

    it('sets aria-disabled to true if the FocusableItem is disabled', function (this: Context) {
      expect(this.clarityElement.getAttribute('aria-disabled')).toBe('false');
      this.testComponent.disabled = true;
      this.detectChanges();
      expect(this.clarityElement.getAttribute('aria-disabled')).toBe('true');
    });

    it('updates the disabled property of the FocusableItem', function (this: Context) {
      this.testComponent.disabled = true;
      this.detectChanges();
      expect(this.getClarityProvider(FocusableItem).disabled).toBe(true);
      this.testComponent.disabled = false;
      this.detectChanges();
      expect(this.getClarityProvider(FocusableItem).disabled).toBe(false);
    });
  });

  // A separate module, because the shared spec() helper above instantiates the testing module for
  // every test in its own describe, and a nested one could no longer configure it.
  describe('DropdownItem role', function () {
    // An item that reports a setting rather than performing an action needs one of the checkable
    // menu roles. Writing it as a plain attribute is not enough on its own: the host binding is
    // applied after the template attribute and used to hard-code menuitem over it.
    it('takes the role written on the item', function () {
      TestBed.configureTestingModule({
        declarations: [ClrDropdownItem, CustomRoleTest],
        providers: [{ provide: ClrDropdown, useValue: {} }, ROOT_DROPDOWN_PROVIDER],
      });

      const fixture = TestBed.createComponent(CustomRoleTest);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('button').getAttribute('role')).toBe('menuitemcheckbox');
    });
  });
}

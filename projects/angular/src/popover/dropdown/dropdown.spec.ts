/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClrModalModule } from '@clr/angular/src/modal';
import { ClrPopoverToggleService } from '@clr/angular/src/popover/common';
import { FocusableItem, FocusService } from '@clr/angular/src/utils';
import { delay, expectActiveElementToBe } from '@clr/angular/testing';
import { Subscription } from 'rxjs';

import { ClrDropdown } from './dropdown';
import { ClrDropdownItem } from './dropdown-item';
import { ClrDropdownTrigger } from './dropdown-trigger';
import { ClrDropdownModule } from './dropdown.module';
import { DropdownFocusHandler } from './providers/dropdown-focus-handler.service';

export default function (): void {
  describe('Dropdown', () => {
    let fixture: ComponentFixture<TestComponent>;
    let compiled: HTMLElement;
    let subscription: Subscription;

    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [ClrDropdownModule], declarations: [TestComponent] });

      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      compiled = fixture.nativeElement;
    });

    afterEach(() => {
      fixture.destroy();

      if (subscription) {
        subscription.unsubscribe();
      }
    });

    it('projects content', () => {
      expect(compiled.textContent).toMatch(/Dropdown/);
    });

    it('adds the .dropdown class on clr-dropdown', () => {
      expect(compiled.querySelector('.dropdown')).not.toBeNull();
    });

    it('adds the .dropdown-toggle class on clrDropdownTrigger', () => {
      const dropdownToggle: HTMLElement = compiled.querySelector('[clrDropdownTrigger]');
      expect(dropdownToggle.classList.contains('.dropdown-toggle'));
    });

    it('adds the .dropdown-item class on clrDropdownItem', () => {
      const dropdownToggle: HTMLElement = compiled.querySelector('.dropdown-toggle');
      dropdownToggle.click();
      // detect the click
      fixture.detectChanges();

      const dropdownItem: HTMLElement = compiled.querySelector('[clrDropdownItem]');
      expect(dropdownItem.classList.contains('.dropdown-item'));
    });

    it('toggles the menu when clicked on the host', () => {
      const dropdownToggle: HTMLElement = compiled.querySelector('.dropdown-toggle');

      expect(compiled.querySelector('.dropdown-item')).toBeNull();
      dropdownToggle.click();
      // detect the click
      fixture.detectChanges();
      expect(compiled.querySelector('.dropdown-item')).not.toBeNull();

      // click the dropdown toggle again to close the menu
      dropdownToggle.click();
      // detect the click
      fixture.detectChanges();
      expect(compiled.querySelector('.dropdown-item')).toBeNull();
    });

    it('toggles the nested menu when clicked on the toggle', () => {
      const dropdownToggle: HTMLElement = compiled.querySelector('.dropdown-toggle');
      dropdownToggle.click();
      // detect the click
      fixture.detectChanges();

      const nestedToggle: HTMLElement = compiled.querySelector('.nested');
      expect(compiled.textContent.trim()).not.toMatch('Foo');
      nestedToggle.click();
      // detect the click
      fixture.detectChanges();
      expect(compiled.textContent.trim()).toMatch('Foo');

      // click the nested toggle again to close the menu
      nestedToggle.click();
      // detect the click
      fixture.detectChanges();
      expect(compiled.textContent.trim()).not.toMatch('Foo');
    });

    it('closes the menu when clicked outside of the host', async () => {
      const dropdownToggle: HTMLElement = compiled.querySelector('.dropdown-toggle');
      const outsideButton: HTMLElement = compiled.querySelector('.outside-click-test');

      // check if the dropdown is closed
      expect(compiled.querySelector('.dropdown-item')).toBeNull();

      // click outside the dropdown
      outsideButton.click();
      fixture.detectChanges();

      // check if the click handler is triggered
      expect(fixture.componentInstance.testCnt).toEqual(1);
      // check if the open class is added
      expect(compiled.querySelector('.dropdown-item')).toBeNull();

      // click on the dropdown
      dropdownToggle.click();
      await delay();
      fixture.detectChanges();
      expect(compiled.querySelector('.dropdown-item')).not.toBeNull();

      // click outside the dropdown
      outsideButton.click();
      fixture.detectChanges();

      // check if the click handler is triggered
      expect(fixture.componentInstance.testCnt).toEqual(2);
      // check if the open class is added
      expect(compiled.querySelector('.dropdown-item')).toBeNull();
    });

    it('supports clrMenuClosable option. Closes the dropdown menu when clrMenuClosable is set to true', async () => {
      const dropdownToggle: HTMLElement = compiled.querySelector('.dropdown-toggle');
      dropdownToggle.click();
      fixture.detectChanges();

      const dropdownItem: HTMLElement = compiled.querySelector('.dropdown-item');

      dropdownItem.click();
      await delay();
      fixture.detectChanges();
      expect(compiled.querySelector('.dropdown-item')).toBeNull();

      fixture.componentInstance.menuClosable = false;
      dropdownToggle.click();
      fixture.detectChanges();
      expect(compiled.querySelector('.dropdown-item')).not.toBeNull();

      dropdownItem.click();
      await delay();
      fixture.detectChanges();
      expect(compiled.querySelector('.dropdown-item')).not.toBeNull();
    });

    it('closes all dropdown menus when clrMenuClosable is true', async () => {
      const dropdownToggle: HTMLElement = compiled.querySelector('.dropdown-toggle');
      dropdownToggle.click();
      fixture.detectChanges();

      const nestedToggle: HTMLElement = compiled.querySelector('.nested');
      nestedToggle.click();

      fixture.detectChanges();

      const nestedItem: HTMLElement = compiled.querySelector('.nested-item');
      nestedItem.click();
      await delay();

      fixture.detectChanges();

      const items: HTMLElement = compiled.querySelector('.dropdown-item');
      expect(items).toBeNull();
    });

    it('does not close the menu when a disabled item is clicked', async () => {
      const dropdownToggle: HTMLElement = compiled.querySelector('.dropdown-toggle');
      dropdownToggle.click();
      fixture.detectChanges();

      const disabledDropdownItem: HTMLElement = compiled.querySelector('.dropdown-item.disabled');
      const dropdownItem: HTMLElement = compiled.querySelector('.dropdown-item');

      disabledDropdownItem.click();
      await delay();
      fixture.detectChanges();
      expect(compiled.querySelector('.dropdown-item')).not.toBeNull();

      dropdownItem.click();
      await delay();
      fixture.detectChanges();
      expect(compiled.querySelector('.dropdown-item')).toBeNull();
    });

    it("doesn't close before custom click events have triggered", async function () {
      const toggleService = fixture.debugElement.query(By.directive(ClrDropdown)).injector.get(ClrPopoverToggleService);

      const dropdownToggle: HTMLElement = compiled.querySelector('.dropdown-toggle');
      dropdownToggle.click();
      fixture.detectChanges();

      const nestedToggle: HTMLElement = compiled.querySelector('.nested');
      nestedToggle.click();
      fixture.detectChanges();

      subscription = toggleService.openChange.subscribe(() => {
        expect(fixture.componentInstance.customClickHandlerDone).toBe(true);
      });

      const nestedItem: HTMLElement = compiled.querySelector('.nested-item');
      nestedItem.click();
      await delay();
      fixture.detectChanges();

      // Make sure the dropdown correctly closed, otherwise our expect() in the subscription might not have run.
      expect(toggleService.open).toBe(false);
    });
    it('puts focus back on the trigger when a dropdown item is clicked', async () => {
      const dropdownToggle: HTMLElement = compiled.querySelector('.dropdown-toggle');

      dropdownToggle.click();
      await delay();
      fixture.detectChanges();

      const dropdownItem: HTMLElement = compiled.querySelector('.dropdown-item');
      expectActiveElementToBe(dropdownItem);

      dropdownItem.click();
      await delay();
      fixture.detectChanges();

      expectActiveElementToBe(dropdownToggle);
    });

    it('does not put focus back on the trigger when a dropdown item is clicked if [clrCloseMenuOnItemClick] is false', async () => {
      // set [clrCloseMenuOnItemClick]="false"
      fixture.componentInstance.dropdownInstance.isMenuClosable = false;
      fixture.detectChanges();

      const dropdownToggle: HTMLElement = compiled.querySelector('.dropdown-toggle');

      dropdownToggle.click();
      await delay();
      fixture.detectChanges();

      const dropdownItem: HTMLElement = compiled.querySelector('.dropdown-item');
      expectActiveElementToBe(dropdownItem);

      dropdownItem.click();
      await delay();
      fixture.detectChanges();

      expectActiveElementToBe(dropdownItem);
    });

    it('declares a FocusService provider', () => {
      const focusService = fixture.debugElement.query(By.directive(ClrDropdown)).injector.get(FocusService, null);
      expect(focusService).not.toBeNull();
    });

    it('declares a DropdownFocusHandler provider', () => {
      const injector = fixture.debugElement.query(By.directive(ClrDropdown)).injector;
      const focusHandler = injector.get(DropdownFocusHandler, null);
      expect(focusHandler).not.toBeNull();
      expect(injector.get(FocusableItem, null)).toBe(focusHandler);
    });
  });

  describe('Dropdown item that opens a modal', () => {
    let fixture: ComponentFixture<DropdownItemThatOpensModalTestComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrDropdownModule, ClrModalModule, NoopAnimationsModule],
        declarations: [DropdownItemThatOpensModalTestComponent],
      });

      fixture = TestBed.createComponent(DropdownItemThatOpensModalTestComponent);
      fixture.detectChanges();
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('manages focus correctly when a modal is opened from a dropdown item', async () => {
      // Click the dropdown trigger button.
      await clickButton(fixture.componentInstance.dropdownTriggerButtonElementRef);

      // The dropdown item button should be focused.
      expectActiveElementToBe(fixture.componentInstance.dropdownItemButtonElementRef.nativeElement);

      // Click the dropdown item button.
      await clickButton(fixture.componentInstance.dropdownItemButtonElementRef);

      // The modal title should be focused.
      expectActiveElementToBe(fixture.componentInstance.elementRef.nativeElement.querySelector('.modal-title-wrapper'));

      // Click the close modal button.
      await clickButton(fixture.componentInstance.modalCloseButtonElementRef);

      // Focus should be returned to the dropdown trigger. (This expectation tests behavior implemented in the dropdown AND modal components.)
      expectActiveElementToBe(fixture.componentInstance.dropdownTriggerButtonElementRef.nativeElement);
    });

    async function clickButton(buttonElementRef: ElementRef<HTMLButtonElement>) {
      buttonElementRef.nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
    }
  });

  describe('Dropdown in shadow DOM', () => {
    let fixture: ComponentFixture<TestShadowDomComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [ClrDropdownModule], declarations: [TestShadowDomComponent] });

      fixture = TestBed.createComponent(TestShadowDomComponent);
      fixture.detectChanges();
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('API toggles the menu when clicked on the trigger', () => {
      expect(fixture.componentInstance.dropdownInstance.toggleService.open).toBeFalse();

      // click the dropdown toggle to open the menu
      fixture.componentInstance.dropdownTriggerInstance.onDropdownTriggerClick(new MouseEvent('click'));
      expect(fixture.componentInstance.dropdownInstance.toggleService.open).toBeTrue();

      // click the dropdown toggle again to close the menu
      fixture.componentInstance.dropdownTriggerInstance.onDropdownTriggerClick(new MouseEvent('click'));
      expect(fixture.componentInstance.dropdownInstance.toggleService.open).toBeFalse();
    });
  });
}

@Component({
  template: `
    <button class="outside-click-test" (click)="outsideButtonClickHandler()">
      Button to test clicks outside of the dropdown component
    </button>
    <clr-dropdown [clrCloseMenuOnItemClick]="menuClosable">
      <button class="btn btn-primary" type="button" clrDropdownTrigger>
        Dropdown
        <cds-icon shape="angle" direction="down"></cds-icon>
      </button>
      <clr-dropdown-menu *clrIfOpen>
        <label class="dropdown-header">Header</label>
        <a href="javascript://" clrDropdownItem>Item</a>
        <a href="javascript://" clrDisabled="true" clrDropdownItem>Disabled Item</a>
        <clr-dropdown>
          <button clrDropdownTrigger class="nested">Nested</button>
          <clr-dropdown-menu *clrIfOpen>
            <a href="javascript://" clrDropdownItem class="nested-item" (click)="customClickHandler()">Foo</a>
          </clr-dropdown-menu>
        </clr-dropdown>
      </clr-dropdown-menu>
    </clr-dropdown>
  `,
  standalone: false,
})
class TestComponent {
  @ViewChild(ClrDropdown) dropdownInstance: ClrDropdown;

  menuClosable = true;
  testCnt = 0;
  customClickHandlerDone = false;

  outsideButtonClickHandler(): void {
    this.testCnt++;
  }

  customClickHandler() {
    this.customClickHandlerDone = true;
  }
}

@Component({
  template: `
    <clr-dropdown [clrCloseMenuOnItemClick]="menuClosable">
      <button class="btn btn-primary" type="button" clrDropdownTrigger>
        Dropdown
        <cds-icon shape="angle" direction="down"></cds-icon>
      </button>
      <clr-dropdown-menu *clrIfOpen>
        <label class="dropdown-header">Header</label>
        <a href="javascript://" clrDropdownItem>Item</a>
        <a href="javascript://" clrDisabled="true" clrDropdownItem>Disabled Item</a>
        <clr-dropdown>
          <button clrDropdownTrigger class="nested">Nested</button>
          <clr-dropdown-menu *clrIfOpen>
            <a href="javascript://" clrDropdownItem class="nested-item">Foo</a>
          </clr-dropdown-menu>
        </clr-dropdown>
      </clr-dropdown-menu>
    </clr-dropdown>
  `,
  encapsulation: ViewEncapsulation.ShadowDom,
  standalone: false,
})
class TestShadowDomComponent {
  @ViewChild(ClrDropdown) dropdownInstance: ClrDropdown;
  @ViewChild(ClrDropdownTrigger) dropdownTriggerInstance: ClrDropdownTrigger;

  menuClosable = true;
}

@Component({
  template: `
    <clr-dropdown>
      <button class="btn btn-primary" type="button" clrDropdownTrigger>
        Dropdown
        <cds-icon shape="angle" direction="down"></cds-icon>
      </button>
      <clr-dropdown-menu *clrIfOpen>
        <button clrDropdownItem (click)="modalOpen = true">Open Modal</button>
      </clr-dropdown-menu>
    </clr-dropdown>

    <clr-modal [clrModalOpen]="modalOpen">
      <h3 class="modal-title">Modal Title</h3>
      <div class="modal-body">This is a modal.</div>
      <div class="modal-footer">
        <button #modalCloseButton type="button" class="btn btn-primary" (click)="modalOpen = false">Close</button>
      </div>
    </clr-modal>
  `,
  standalone: false,
})
class DropdownItemThatOpensModalTestComponent {
  modalOpen = false;

  // eslint-disable-next-line decorator-position/decorator-position
  @ViewChild(ClrDropdownTrigger, { read: ElementRef })
  readonly dropdownTriggerButtonElementRef: ElementRef<HTMLButtonElement>;

  // eslint-disable-next-line decorator-position/decorator-position
  @ViewChild(ClrDropdownItem, { read: ElementRef })
  readonly dropdownItemButtonElementRef: ElementRef<HTMLButtonElement>;

  // eslint-disable-next-line decorator-position/decorator-position
  @ViewChild('modalCloseButton', { read: ElementRef })
  readonly modalCloseButtonElementRef: ElementRef<HTMLButtonElement>;

  constructor(readonly elementRef: ElementRef<HTMLElement>) {}
}

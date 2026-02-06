/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, ViewChild } from '@angular/core';

import { ClrPopoverCloseButton } from './popover-close-button';
import { ClrPopoverModuleNext } from './popover.module';
import { ClrPopoverService } from './providers/popover.service';
import { spec, TestContext } from '../../utils/testing/helpers.spec';

@Component({
  selector: 'test-host',
  template: `
    <button #closeButton clrPopoverCloseButton (clrPopoverOnCloseChange)="handleClose()">Smart Close Button</button>
    <button #toggleButton clrPopoverAnchor>Toggle Button</button>
  `,
  providers: [ClrPopoverService],
  standalone: false,
})
class TestHost {
  @ViewChild('closeButton', { read: ElementRef, static: true }) closeButton: ElementRef<HTMLButtonElement>;
  @ViewChild('toggleButton', { read: ElementRef, static: true }) toggleButton: ElementRef<HTMLButtonElement>;
  openState;

  handleClose() {
    this.openState = false;
  }
}

export default function (): void {
  describe('ClrPopoverCloseButton', function () {
    type Context = TestContext<ClrPopoverCloseButton, TestHost> & {
      popoverService: ClrPopoverService;
    };

    describe('TypeScript API', function (this: Context) {
      spec(ClrPopoverCloseButton, TestHost, ClrPopoverModuleNext, {
        providers: [ClrPopoverService],
      });

      beforeEach(function (this: Context) {
        this.popoverService = this.getClarityProvider(ClrPopoverService);
        this.detectChanges();
      });

      it('declares a Popover Service', function (this: Context) {
        expect(this.popoverService).toBeDefined();
      });

      it('sets the close button ref in the popover service', function (this: Context) {
        expect(this.hostComponent.closeButton).toEqual(this.popoverService.closeButtonRef);
      });
    });

    describe('Template API', () => {
      spec(ClrPopoverCloseButton, TestHost, ClrPopoverModuleNext, {
        providers: [ClrPopoverService],
      });

      beforeEach(function (this: Context) {
        this.popoverService = this.getClarityProvider(ClrPopoverService);
        this.detectChanges();
      });

      it('emits a close change event when popover is closed', function (this: Context) {
        this.popoverService.open = true;
        this.detectChanges();
        expect(this.fixture.componentInstance.openState).toBeUndefined();
        const closeBtn: HTMLButtonElement = this.hostElement.querySelector('.clr-smart-close-button');
        closeBtn.click();
        this.detectChanges();
        expect(this.hostComponent.openState).toBe(this.popoverService.open);
      });

      it('focuses on the toggle/anchor element when clicked', function (this: Context) {
        const clickSpy = spyOn(this.popoverService, 'toggleWithEvent');
        const closeBtn: HTMLButtonElement = this.hostElement.querySelector('.clr-smart-close-button');
        const focusSpy = spyOn(this.hostComponent.toggleButton.nativeElement, 'focus');
        closeBtn.click();
        expect(clickSpy.calls.count()).toEqual(1);
        expect(focusSpy.calls.count()).toEqual(1);
      });
    });

    describe('View Basics', function (this: Context) {
      spec(ClrPopoverCloseButton, TestHost, undefined, {
        providers: [ClrPopoverService],
      });

      it('adds the clr-smart-close-button classname to the host', function (this: Context) {
        expect(this.clarityElement.classList).toContain('clr-smart-close-button');
      });
    });
  });
}

/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, ViewChild } from '@angular/core';

import { spec, TestContext } from '../testing/helpers.spec';
import { ClrPopoverCloseButton } from './popover-close-button';
import { ClrPopoverModuleNext } from './popover.module';
import { ClrPopoverService } from './providers/popover.service';

@Component({
  selector: 'test-host',
  template: `
    <button #closeButton clrPopoverCloseButton (clrPopoverOnCloseChange)="handleClose()">Smart Close Button</button>
    <button #toggleButton clrPopoverAnchor>Toggle Button</button>
  `,
  providers: [ClrPopoverService],
})
class TestHost {
  @ViewChild('closeButton', { read: ElementRef, static: true }) closeButton: ElementRef;
  @ViewChild('toggleButton', { read: ElementRef, static: true }) toggleButton: ElementRef;
  openState;

  handleClose() {
    this.openState = false;
  }
}

export default function (): void {
  describe('ClrPopoverCloseButton', function () {
    type Context = TestContext<ClrPopoverCloseButton, TestHost> & {
      stateService: ClrPopoverService;
    };

    describe('TypeScript API', function (this: Context) {
      spec(ClrPopoverCloseButton, TestHost, ClrPopoverModuleNext, {
        providers: [ClrPopoverService],
      });

      beforeEach(function (this: Context) {
        this.stateService = this.getClarityProvider(ClrPopoverService);
        this.detectChanges();
      });

      it('declares a Popover stateService', function (this: Context) {
        expect(this.stateService).toBeDefined();
      });

      it('sets the close button ref in the events service', function (this: Context) {
        expect(this.hostComponent.closeButton).toEqual(this.stateService.closeButtonRef);
      });
    });

    describe('Template API', () => {
      spec(ClrPopoverCloseButton, TestHost, ClrPopoverModuleNext, {
        providers: [ClrPopoverService],
      });

      beforeEach(function (this: Context) {
        this.stateService = this.getClarityProvider(ClrPopoverService);
        this.detectChanges();
      });

      it('emits a close change event when popover is closed', function (this: Context) {
        this.stateService.open = true;
        this.detectChanges();
        expect(this.fixture.componentInstance.openState).toBeUndefined();
        const closeBtn: HTMLButtonElement = this.hostElement.querySelector('.clr-smart-close-button');
        closeBtn.click();
        this.detectChanges();
        expect(this.hostComponent.openState).toBe(this.stateService.open);
      });

      it('focuses on the toggle/anchor element when clicked', function (this: Context) {
        const clickSpy = spyOn(this.stateService, 'toggleWithEvent');
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

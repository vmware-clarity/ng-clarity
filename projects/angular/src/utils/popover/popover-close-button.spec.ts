/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, ViewChild } from '@angular/core';

import { spec, TestContext } from '../testing/helpers.spec';
import { ClrPopoverCloseButton } from './popover-close-button';
import { ClrPopoverModuleNext } from './popover.module';
import { ClrPopoverEventsService } from './providers/popover-events.service';
import { ClrPopoverToggleService } from './providers/popover-toggle.service';

@Component({
  selector: 'test-host',
  template: `
    <button #closeButton clrPopoverCloseButton (clrPopoverOnCloseChange)="handleClose()">Smart Close Button</button>
    <button #toggleButton clrPopoverAnchor>Toggle Button</button>
  `,
  providers: [ClrPopoverToggleService, ClrPopoverEventsService],
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
      toggleService: ClrPopoverToggleService;
      eventService: ClrPopoverEventsService;
    };

    describe('TypeScript API', function (this: Context) {
      spec(ClrPopoverCloseButton, TestHost, ClrPopoverModuleNext, {
        providers: [ClrPopoverToggleService],
      });

      beforeEach(function (this: Context) {
        this.toggleService = this.getClarityProvider(ClrPopoverToggleService);
        this.eventService = this.getClarityProvider(ClrPopoverEventsService);
        this.detectChanges();
      });

      it('declares a Popover ToggleService', function (this: Context) {
        expect(this.toggleService).toBeDefined();
      });

      it('declares a Popover EventService', function (this: Context) {
        expect(this.eventService).toBeDefined();
      });

      it('sets the close button ref in the events service', function (this: Context) {
        expect(this.hostComponent.closeButton).toEqual(this.eventService.closeButtonRef);
      });
    });

    describe('Template API', () => {
      spec(ClrPopoverCloseButton, TestHost, ClrPopoverModuleNext, {
        providers: [ClrPopoverToggleService],
      });

      beforeEach(function (this: Context) {
        this.toggleService = this.getClarityProvider(ClrPopoverToggleService);
        this.eventService = this.getClarityProvider(ClrPopoverEventsService);
        this.detectChanges();
      });

      it('emits a close change event when popover is closed', function (this: Context) {
        this.toggleService.open = true;
        this.detectChanges();
        expect(this.fixture.componentInstance.openState).toBeUndefined();
        const closeBtn: HTMLButtonElement = this.hostElement.querySelector('.clr-smart-close-button');
        closeBtn.click();
        this.detectChanges();
        expect(this.hostComponent.openState).toBe(this.toggleService.open);
      });

      it('focuses on the toggle/anchor element when clicked', function (this: Context) {
        const clickSpy = spyOn(this.toggleService, 'toggleWithEvent');
        const closeBtn: HTMLButtonElement = this.hostElement.querySelector('.clr-smart-close-button');
        const focusSpy = spyOn(this.hostComponent.toggleButton.nativeElement, 'focus');
        closeBtn.click();
        expect(clickSpy.calls.count()).toEqual(1);
        expect(focusSpy.calls.count()).toEqual(1);
      });
    });

    describe('View Basics', function (this: Context) {
      spec(ClrPopoverCloseButton, TestHost, undefined, {
        providers: [ClrPopoverToggleService],
      });

      it('adds the clr-smart-close-button classname to the host', function (this: Context) {
        expect(this.clarityElement.classList).toContain('clr-smart-close-button');
      });
    });
  });
}

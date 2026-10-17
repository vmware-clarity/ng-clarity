/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, ViewChild } from '@angular/core';
import { spec, TestContext } from '@clr/angular/testing';

import { ClrPopoverCloseButton } from './popover-close-button';
import { ClrPopoverModuleNext } from './popover.module';
import { ClrPopoverService } from './providers/popover.service';

@Component({
  selector: 'test-host',
  template: `
    <button #closeButton clrPopoverCloseButton (clrPopoverOnCloseChange)="handleClose()">Smart Close Button</button>
    <button #toggleButton clrPopoverOrigin>Toggle Button</button>
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

describe('ClrPopover', () => {
  describe('Directive', () => {
    describe('ClrPopoverCloseButton', () => {
      type Context = TestContext<ClrPopoverCloseButton, TestHost> & {
        popoverService: ClrPopoverService;
      };

      describe('TypeScript API', () => {
        let testContext: Context;

        const getContext = spec(ClrPopoverCloseButton, TestHost, ClrPopoverModuleNext, {
          providers: [ClrPopoverService],
        });
        beforeEach(() => {
          testContext = getContext() as Context;
        });

        beforeEach(() => {
          testContext.popoverService = testContext.getClarityProvider(ClrPopoverService);
          testContext.detectChanges();
        });

        it('declares a Popover Service', () => {
          expect(testContext.popoverService).toBeDefined();
        });

        it('sets the close button ref in the popover service', () => {
          expect(testContext.testComponent.closeButton).toEqual(testContext.popoverService.closeButtonRef);
        });
      });

      describe('Template API', () => {
        let testContext: Context;

        const getContext = spec(ClrPopoverCloseButton, TestHost, ClrPopoverModuleNext, {
          providers: [ClrPopoverService],
        });
        beforeEach(() => {
          testContext = getContext() as Context;
        });

        beforeEach(() => {
          testContext.popoverService = testContext.getClarityProvider(ClrPopoverService);
          testContext.detectChanges();
        });

        it('emits a close change event when popover is closed', () => {
          testContext.popoverService.open = true;
          testContext.detectChanges();
          expect(testContext.fixture.componentInstance.openState).toBeUndefined();
          const closeBtn: HTMLButtonElement = testContext.testElement.querySelector('.clr-smart-close-button');
          closeBtn.click();
          testContext.detectChanges();
          expect(testContext.testComponent.openState).toBe(testContext.popoverService.open);
        });

        it('focuses on the origin element when clicked', () => {
          const clickSpy = vi.spyOn(testContext.popoverService, 'toggleWithEvent').mockImplementation(() => undefined);
          const closeBtn: HTMLButtonElement = testContext.testElement.querySelector('.clr-smart-close-button');
          const focusSpy = vi
            .spyOn(testContext.testComponent.toggleButton.nativeElement, 'focus')
            .mockImplementation(() => undefined);
          closeBtn.click();
          expect(vi.mocked(clickSpy).mock.calls.length).toEqual(1);
          expect(vi.mocked(focusSpy).mock.calls.length).toEqual(1);
        });
      });

      describe('View Basics', () => {
        let testContext: Context;

        const getContext = spec(ClrPopoverCloseButton, TestHost, undefined, {
          providers: [ClrPopoverService],
        });
        beforeEach(() => {
          testContext = getContext() as Context;
        });

        it('adds the clr-smart-close-button classname to the host', () => {
          expect(testContext.clarityElement.classList).toContain('clr-smart-close-button');
        });
      });
    });
  });
});

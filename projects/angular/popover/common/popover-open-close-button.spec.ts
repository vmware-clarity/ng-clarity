/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { spec, TestContext } from '@clr/angular/testing';
import { Subscription } from 'rxjs';

import { ClrPopoverOpenCloseButton } from './popover-open-close-button';
import { ClrPopoverService } from './providers/popover.service';

@Component({
  selector: 'test-host',
  template:
    '<button #testAnchor clrPopoverOpenCloseButton (clrPopoverOpenCloseChange)="updateOpenState($event)">Smart' +
    ' Open Close' +
    ' Button</button>',
  providers: [ClrPopoverService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestHost {
  @ViewChild('testAnchor', { read: ElementRef, static: true }) anchor: ElementRef<HTMLButtonElement>;

  openState: boolean;

  updateOpenState(event: boolean) {
    this.openState = event;
  }
}

describe('ClrPopover', () => {
  describe('Directive', () => {
    describe('ClrPopoverOpenCloseButton', () => {
      type Context = TestContext<ClrPopoverOpenCloseButton, TestHost> & {
        popoverService: ClrPopoverService;
      };

      describe('TypeScript API', () => {
        let testContext: Context;

        const getContext = spec(ClrPopoverOpenCloseButton, TestHost, undefined, {
          providers: [ClrPopoverService],
        });
        beforeEach(() => {
          testContext = getContext() as Context;
        });

        beforeEach(() => {
          testContext.popoverService = testContext.getClarityProvider(ClrPopoverService);
          testContext.detectChanges();
        });

        it('declares a ClrPopoverService', () => {
          expect(testContext.popoverService).toBeDefined();
        });

        it('responds to openChange events from the popoverService', () => {
          let changeCount = 0;
          const sub: Subscription = testContext.popoverService.openChange.subscribe(() => {
            changeCount++;
          });
          expect(changeCount).toBe(0); // initial state
          testContext.clarityElement.click();
          expect(changeCount).toBe(1); // open click
          testContext.clarityElement.click();
          expect(changeCount).toBe(2); // close click
          sub.unsubscribe();
        });
      });

      describe('Template API', () => {
        let testContext: Context;

        const getContext = spec(ClrPopoverOpenCloseButton, TestHost, undefined, {
          providers: [ClrPopoverService],
        });
        beforeEach(() => {
          testContext = getContext() as Context;
        });

        beforeEach(() => {
          testContext.popoverService = testContext.getClarityProvider(ClrPopoverService);
          testContext.detectChanges();
        });

        it('emits events when the open state changes', () => {
          expect(testContext.fixture.componentInstance.openState).toBeUndefined(); // inital state
          testContext.clarityElement.click();
          expect(testContext.testComponent.openState).toEqual(testContext.popoverService.open);
          expect(testContext.testComponent.openState).toBe(true); // opened state
          testContext.clarityElement.click();
          expect(testContext.testComponent.openState).toEqual(testContext.popoverService.open);
          expect(testContext.testComponent.openState).toBe(false); // closed state
        });

        it('handles click events', () => {
          const clickSpy = vi.spyOn(testContext.popoverService, 'toggleWithEvent').mockImplementation(() => undefined);
          testContext.clarityElement.click();
          expect(vi.mocked(clickSpy).mock.calls.length).toEqual(1);
        });
      });

      describe('View Basics', () => {
        let testContext: Context;

        const getContext = spec(ClrPopoverOpenCloseButton, TestHost, undefined, {
          providers: [ClrPopoverService],
        });
        beforeEach(() => {
          testContext = getContext() as Context;
        });

        it('adds the clr-smart-open-close classname', () => {
          expect(testContext.clarityElement.classList).toContain('clr-smart-open-close');
        });
      });
    });
  });
});

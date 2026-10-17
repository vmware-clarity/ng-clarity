/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, ViewChild } from '@angular/core';
import { spec, TestContext } from '@clr/angular/testing';

import { ClrPopoverOrigin } from './popover-origin';
import { ClrPopoverService } from './providers/popover.service';

@Component({
  selector: 'test-host',
  template: '<button #testOrigin clrPopoverOrigin>Smart Origin</button>',
  providers: [ClrPopoverService],
  standalone: false,
})
class TestHost {
  @ViewChild('testOrigin', { read: ElementRef, static: true }) origin: ElementRef<HTMLButtonElement>;
}

describe('ClrPopover', () => {
  describe('Directive', () => {
    describe('ClrPopoverOrigin', () => {
      type Context = TestContext<ClrPopoverOrigin, TestHost> & {
        popoverService: ClrPopoverService;
      };

      describe('Template API', () => {
        let testContext: Context;

        const getContext = spec(ClrPopoverOrigin, TestHost, undefined);
        beforeEach(() => {
          testContext = getContext() as Context;
        });

        beforeEach(() => {
          testContext.popoverService = testContext.getClarityProvider(ClrPopoverService);
          testContext.detectChanges();
        });

        it('registers the element as the popover origin', () => {
          expect(testContext.popoverService.origin).toEqual(testContext.testComponent.origin);
        });
      });

      describe('View Basics', () => {
        let testContext: Context;

        const getContext = spec(ClrPopoverOrigin, TestHost, undefined);
        beforeEach(() => {
          testContext = getContext() as Context;
        });

        it('adds the clr-popover-origin classname', () => {
          expect(testContext.clarityElement.classList).toContain('clr-popover-origin');
        });
      });
    });
  });
});

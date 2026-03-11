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

export default function (): void {
  describe('ClrPopoverOrigin', function () {
    type Context = TestContext<ClrPopoverOrigin, TestHost> & {
      popoverService: ClrPopoverService;
    };

    describe('Template API', () => {
      spec(ClrPopoverOrigin, TestHost, undefined);

      beforeEach(function (this: Context) {
        this.popoverService = this.getClarityProvider(ClrPopoverService);
        this.detectChanges();
      });

      it('registers the element as the popover origin', function (this: Context) {
        expect(this.popoverService.origin).toEqual(this.testComponent.origin);
      });
    });

    describe('View Basics', function (this: Context) {
      spec(ClrPopoverOrigin, TestHost, undefined);

      it('adds the clr-popover-origin classname', function (this: Context) {
        expect(this.clarityElement.classList).toContain('clr-popover-origin');
      });
    });
  });
}

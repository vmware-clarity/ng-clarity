/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, ViewChild } from '@angular/core';

import { ClrPopoverAnchor } from './popover-anchor';
import { ClrPopoverService } from './providers/popover.service';
import { spec, TestContext } from '../../utils/testing/helpers.spec';

@Component({
  selector: 'test-host',
  template: '<button #testAnchor clrPopoverAnchor>Smart Anchor</button>',
  providers: [ClrPopoverService],
  standalone: false,
})
class TestHost {
  @ViewChild('testAnchor', { read: ElementRef, static: true }) anchor: ElementRef<HTMLButtonElement>;
}

export default function (): void {
  describe('ClrPopoverAnchor', function () {
    type Context = TestContext<ClrPopoverAnchor, TestHost> & {
      popoverService: ClrPopoverService;
    };

    describe('Template API', () => {
      spec(ClrPopoverAnchor, TestHost, undefined);

      beforeEach(function (this: Context) {
        this.popoverService = this.getClarityProvider(ClrPopoverService);
        this.detectChanges();
      });

      it('registers the anchor element with the event service', function (this: Context) {
        expect(this.popoverService.anchorElementRef).toEqual(this.hostComponent.anchor);
      });
    });

    describe('View Basics', function (this: Context) {
      spec(ClrPopoverAnchor, TestHost, undefined);

      it('adds the clr-anchor classname', function (this: Context) {
        expect(this.clarityElement.classList).toContain('clr-anchor');
      });
    });
  });
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

// I'm giving up, I'm using the datagrid ones for now.
import { TestContext } from '../../data/datagrid/helpers.spec';
import { ClrIcon } from '../../icon';
import { POPOVER_HOST_ANCHOR } from '../common/popover-host-anchor.token';
import { SignpostFocusManager } from './providers/signpost-focus-manager.service';
import { SignpostIdService } from './providers/signpost-id.service';
import { ClrSignpostContent } from './signpost-content';
import { ClrPopoverService } from '../common/providers/popover.service';
import { ClrPopoverPosition } from '../common/utils/popover-positions';

export default function (): void {
  describe('ClrSignpostContent', function () {
    let context: TestContext<ClrSignpostContent, SimpleTest>;

    beforeEach(function () {
      context = this.createOnly(ClrSignpostContent, SimpleTest, [
        SignpostIdService,
        ClrPopoverService,
        SignpostFocusManager,
        ClrIcon,
      ]);
    });

    afterEach(() => {
      context.fixture.destroy();
    });

    it('has an id', () => {
      expect(context.clarityElement.getAttribute('id')).toBeDefined();
    });

    it('projects content when open', function () {
      expect(context.clarityElement.textContent).toContain('Signpost content');
    });

    it('has a close button that updates the ClrPopoverService.open value', function () {
      const closer: HTMLElement = context.clarityElement.querySelector('.signpost-action');
      expect(closer).toBeDefined();
      const service = TestBed.inject(ClrPopoverService);
      service.open = true;
      closer.click();
      context.detectChanges();
      expect(service.open).toBeFalse();
    });

    it('takes an input for position', function () {
      context.testComponent.position = ClrPopoverPosition.TOP_MIDDLE;
      context.detectChanges();
      expect(context.clarityDirective.position).toBe(ClrPopoverPosition.TOP_MIDDLE);
    });

    it('has a default signpost content position', function () {
      expect(context.clarityDirective.position).toBe(ClrPopoverPosition.RIGHT_MIDDLE);
    });
  });
}

@Component({
  template: `
    <button class="outside-click-test" (click)="bodyClickHandler()">
      Button to test clicks outside of the dropdown component
    </button>
    <clr-signpost-content [clrPosition]="position">Signpost content</clr-signpost-content>
  `,
  providers: [{ provide: POPOVER_HOST_ANCHOR, useExisting: ElementRef }],
  standalone: false,
})
class SimpleTest {
  position = ClrPopoverPosition.RIGHT_MIDDLE;
  bodyClickHandler() {
    // Do nothing
  }
}

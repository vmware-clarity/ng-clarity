/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, ViewChild } from '@angular/core';

import { commonStringsDefault } from '../../utils/i18n/common-strings.default';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { expectActiveElementToBe } from '../../utils/testing/helpers.spec';
import { ClrDatagridActionOverflow } from './datagrid-action-overflow';
import { TestContext } from './helpers.spec';
import { RowActionService } from './providers/row-action-service';

export default function (): void {
  describe('DatagridActionOverflow component', function () {
    let context: TestContext<ClrDatagridActionOverflow, SimpleTest>;
    let toggle: HTMLElement;

    beforeEach(function () {
      context = this.create(ClrDatagridActionOverflow, SimpleTest, [RowActionService, ClrPopoverToggleService]);
      toggle = context.clarityElement.querySelector('.clr-smart-open-close');
    });

    afterEach(function () {
      context.fixture.destroy();
      const popoverContent = document.querySelectorAll('.clr-popover-content');
      popoverContent.forEach(content => document.body.removeChild(content));
    });

    it('has a default aria-label for the button', function () {
      expect(toggle.getAttribute('aria-label')).toBe(commonStringsDefault.rowActions);
    });

    it('allows a custom aria-label for the button', function () {
      context.testComponent.buttonLabel = 'custom label';
      context.detectChanges();

      expect(toggle.getAttribute('aria-label')).toBe('custom label');
    });

    it('offers two-way binding on clrDgActionOverflowOpen', function () {
      context.clarityDirective.open = true;
      context.detectChanges();
      expect(context.testComponent.open).toBe(true);
      context.testComponent.open = false;
      context.detectChanges();
      expect(context.clarityDirective.open).toBe(false);
    });

    it('opens and closes the menu when the toggle is clicked', function () {
      expect(context.clarityDirective.open).toBe(false);
      toggle.click();
      context.detectChanges();
      expect(context.clarityDirective.open).toBe(true);
      toggle.click();
      context.detectChanges();
      expect(context.clarityDirective.open).toBe(false);
    });

    it('closes the menu when clicked outside of the host', function () {
      const outsideDiv: HTMLElement = context.testElement.querySelector('.outside-click-test');

      // should be closed initially
      expect(context.clarityDirective.open).toBe(false);

      // should open when the ellipses icon is clicked
      toggle.click();
      context.detectChanges();
      expect(context.clarityDirective.open).toBe(true);

      // should close when an area outside of the component is clicked
      outsideDiv.click();
      context.detectChanges();
      expect(context.clarityDirective.open).toBe(false);
    });

    it('projects menu content when open', function () {
      toggle.click();
      context.detectChanges();
      const popoverContent = document.querySelector('.clr-popover-content');
      expect(popoverContent.textContent.trim()).toMatch('Hello world');
    });

    it('should call clrDgActionOverflowOpenChange output when open changed', function () {
      spyOn(context.fixture.componentInstance, 'clrDgActionOverflowOpenChangeFn');
      toggle = context.clarityElement.querySelector('.datagrid-action-toggle');
      toggle.click();
      expect(context.fixture.componentInstance.clrDgActionOverflowOpenChangeFn).toHaveBeenCalledWith(true);
      toggle.click();
      expect(context.fixture.componentInstance.clrDgActionOverflowOpenChangeFn).toHaveBeenCalledWith(false);
    });

    it('closes the menu when an action menu item is clicked', function () {
      toggle.click();
      context.detectChanges();

      const actionItem: HTMLElement = document.querySelector('.clr-popover-content > .action-item');
      actionItem.click();
      context.detectChanges();
      expect(context.clarityDirective.open).toBe(false);
    });

    it('focuses on the first projected button', async function () {
      toggle.click();
      context.detectChanges();
      await context.fixture.whenStable();
      const firstButton: HTMLButtonElement = context.testComponent.actionItem.nativeElement;
      expectActiveElementToBe(firstButton);
    });
  });
}

@Component({
  template: `
    <div>
      <div class="outside-click-test">This is an area outside of the action overflow</div>
      <clr-dg-action-overflow
        [(clrDgActionOverflowOpen)]="open"
        [(clrDgActionOverflowButtonLabel)]="buttonLabel"
        (clrDgActionOverflowOpenChange)="clrDgActionOverflowOpenChangeFn($event)"
      >
        <button #actionItem class="action-item" clrPopoverCloseButton>Hello world</button>
      </clr-dg-action-overflow>
    </div>
  `,
})
class SimpleTest {
  open: boolean;
  buttonLabel: string;

  @ViewChild('actionItem', { read: ElementRef, static: true }) actionItem: ElementRef<HTMLButtonElement>;

  clrDgActionOverflowOpenChangeFn(_$event: boolean) {
    // Do nothing
  }
}

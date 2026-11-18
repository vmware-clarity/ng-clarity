/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { createTestHelpers, expectActiveElementToBe, TestContext } from '@clr/angular/testing';
import { commonStringsDefault } from '@clr/angular/utils';

import { ClrDatagridActionOverflow } from './datagrid-action-overflow';
import { RowActionService } from './providers/row-action-service';

describe('Datagrid', () => {
  describe('Components', () => {
    describe('DatagridActionOverflow component', () => {
      const helpers = createTestHelpers();

      let context: TestContext<ClrDatagridActionOverflow, SimpleTest>;
      let toggle: HTMLElement;

      beforeEach(() => {
        context = helpers.create(ClrDatagridActionOverflow, SimpleTest, [RowActionService, ClrPopoverService]);
        toggle = context.clarityElement.querySelector('.clr-smart-open-close');
      });

      afterEach(() => {
        context.fixture.destroy();
        const popoverContent = document.querySelectorAll('.datagrid-action-overflow');
        popoverContent.forEach(content => content.remove());
      });

      it('has a default aria-label for the button', () => {
        expect(toggle.getAttribute('aria-label')).toBe(commonStringsDefault.rowActions);
      });

      it('allows a custom aria-label for the button', () => {
        context.testComponent.buttonLabel = 'custom label';
        context.detectChanges();

        expect(toggle.getAttribute('aria-label')).toBe('custom label');
      });

      it('offers two-way binding on clrDgActionOverflowOpen', () => {
        context.clarityDirective.open = true;
        context.detectChanges();
        expect(context.testComponent.open).toBe(true);
        context.testComponent.open = false;
        context.detectChanges();
        expect(context.clarityDirective.open).toBe(false);
      });

      it('opens and closes the menu when the toggle is clicked', () => {
        expect(context.clarityDirective.open).toBe(false);
        toggle.click();
        context.detectChanges();
        expect(context.clarityDirective.open).toBe(true);
        toggle.click();
        context.detectChanges();
        expect(context.clarityDirective.open).toBe(false);
      });

      it('closes the menu when clicked outside of the host', () => {
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

      it('projects menu content when open', () => {
        toggle.click();
        context.detectChanges();
        const popoverContent = document.querySelector('.datagrid-action-overflow');
        expect(popoverContent.textContent.trim()).toMatch('Hello world');
      });

      it('should call clrDgActionOverflowOpenChange output when open changed', () => {
        vi.spyOn(context.fixture.componentInstance, 'clrDgActionOverflowOpenChangeFn').mockImplementation(
          () => undefined
        );
        toggle = context.clarityElement.querySelector('.datagrid-action-toggle');
        toggle.click();
        expect(context.fixture.componentInstance.clrDgActionOverflowOpenChangeFn).toHaveBeenCalledWith(true);
        toggle.click();
        expect(context.fixture.componentInstance.clrDgActionOverflowOpenChangeFn).toHaveBeenCalledWith(false);
      });

      it('closes the menu when an action menu item is clicked', () => {
        toggle.click();
        context.detectChanges();

        const actionItem: HTMLElement = document.querySelector('.datagrid-action-overflow .action-item');
        actionItem.click();
        context.detectChanges();
        expect(context.clarityDirective.open).toBe(false);
      });

      it('focuses on the first projected button', async () => {
        toggle.click();
        context.detectChanges();
        await context.fixture.whenStable();
        const firstButton: HTMLButtonElement = context.testComponent.actionItem.nativeElement;
        expectActiveElementToBe(firstButton);
      });

      it('stops click event propagation when the toggle button is clicked', () => {
        let propagatedToParent = false;
        context.testElement.addEventListener('click', () => {
          propagatedToParent = true;
        });

        toggle.click();
        context.detectChanges();

        expect(propagatedToParent).toBe(false);
      });
    });
  });
});

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
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class SimpleTest {
  open: boolean;
  buttonLabel: string;

  @ViewChild('actionItem', { read: ElementRef, static: true }) actionItem: ElementRef<HTMLButtonElement>;

  clrDgActionOverflowOpenChangeFn(_$event: boolean) {
    // Do nothing
  }
}

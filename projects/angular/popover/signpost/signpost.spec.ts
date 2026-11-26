/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { ClrPopoverPosition, ClrPopoverService, SIGNPOST_POSITIONS } from '@clr/angular/popover/common';
import { delay, expectActiveElementNotToBe, expectActiveElementToBe, spec, TestContext } from '@clr/angular/testing';
import { renderFixture } from '@clr/angular/utils/testing';

import { SignpostIdService } from './providers/signpost-id.service';
import { ClrSignpost } from './signpost';
import { ClrSignpostModule } from './signpost.module';

interface Context extends TestContext<ClrSignpost, TestDefaultSignpost | TestCustomTriggerSignpost> {
  popoverService: ClrPopoverService;
  triggerButton: HTMLButtonElement;
  contentCloseButton: HTMLButtonElement;
  content: HTMLDivElement;
  signpostIdService: SignpostIdService;
}

describe('Signpost', () => {
  describe('Signpost', () => {
    describe('default trigger', () => {
      let testContext: Context;

      const getContext = spec(ClrSignpost, TestDefaultSignpost, ClrSignpostModule);
      beforeEach(() => {
        testContext = getContext() as Context;
      });

      beforeEach(() => {
        testContext.signpostIdService = testContext.getClarityProvider(SignpostIdService);
        testContext.popoverService = testContext.getClarityProvider(ClrPopoverService);
      });

      it('adds the .signpost class to clr-signpost', () => {
        expect(testContext.clarityElement.classList).toContain('signpost');
      });

      it('has a default trigger that can hide/show content', () => {
        const signpostToggle: HTMLElement = testContext.testElement.querySelector('.signpost-action');
        let signpostContent: HTMLElement;

        // Test we have a trigger
        expect(signpostToggle).not.toBeNull();

        // Test that content shows
        signpostToggle.click();
        testContext.detectChanges();
        signpostContent = document.body.querySelector('.clr-signpost-container');
        expect(signpostContent).not.toBeNull();
        expect(testContext.popoverService.open).toBe(true);

        // Test that content hides again
        signpostToggle.click();
        testContext.detectChanges();
        signpostContent = document.body.querySelector('.clr-signpost-container');
        expect(signpostContent).toBeNull();
        expect(testContext.popoverService.open).toBe(false);
      });

      it('has a default aria-label on the default trigger', () => {
        const signpostToggle: HTMLElement = testContext.testElement.querySelector('.signpost-action');

        expect(signpostToggle.getAttribute('aria-label')).toEqual('Signpost Toggle');
      });

      it('allows a custom aria-label for the default trigger', () => {
        testContext.fixture.componentInstance.signpost.signpostTriggerAriaLabel = 'custom label';
        testContext.detectChanges();
        const signpostToggle: HTMLElement = testContext.testElement.querySelector('.signpost-action');

        expect(signpostToggle.getAttribute('aria-label')).toBe('custom label');
      });

      // Iterating here on purpose.
      SIGNPOST_POSITIONS.forEach(signpost => {
        testPosition(signpost);
      });

      function testPosition(name: ClrPopoverPosition): void {
        it('has a ' + name + ' signpost content position', async () => {
          const untypedContext: any = testContext;

          untypedContext.testElement.style.padding = '300px';
          untypedContext.testComponent.position = name;
          untypedContext.detectChanges();

          const signpostToggle: HTMLElement = untypedContext.testElement.querySelector('.signpost-action');

          // Test we have a trigger
          expect(signpostToggle).not.toBeNull();

          // Test that content shows
          signpostToggle.click();
          await untypedContext.fixture.whenStable();
          untypedContext.detectChanges();

          const signpostContent = document.body.querySelector('.clr-signpost-container');
          expect(signpostContent).not.toBeNull();
          await vi.waitFor(() => expect(signpostContent.classList).toContain(name));
        });
      }
    });

    describe('focus management', () => {
      let testContext: Context;

      const getContext = spec(ClrSignpost, TestDefaultSignpost, ClrSignpostModule);
      beforeEach(() => {
        testContext = getContext() as Context;
      });

      beforeEach(() => {
        testContext.popoverService = testContext.getClarityProvider(ClrPopoverService);
      });

      it('should not get focus on trigger initially', () => {
        const signpostToggle: HTMLElement = testContext.testElement.querySelector('.signpost-action');
        testContext.popoverService.open = false;
        testContext.detectChanges();
        expect(signpostToggle).not.toBeNull();
        expectActiveElementNotToBe(signpostToggle);
      });

      it('should not get focus back on trigger if signpost gets closed with outside click on another interactive element', async () => {
        testContext.popoverService.open = true;
        await delay();
        testContext.detectChanges();
        expect(document.body.querySelector('.clr-signpost-container')).not.toBeNull();

        // dynamic click doesn't set the focus so here manually focusing first
        testContext.testComponent.outsideClickBtn.nativeElement.focus();
        testContext.testComponent.outsideClickBtn.nativeElement.click();
        testContext.detectChanges();

        expect(document.body.querySelector('.clr-signpost-container')).toBeNull();
        expectActiveElementToBe(testContext.testComponent.outsideClickBtn.nativeElement);
      });

      it('should get focus back on trigger if signpost gets closed with outside click on non-interactive element', async () => {
        testContext.popoverService.open = true;
        await delay();
        testContext.detectChanges();
        expect(document.body.querySelector('.clr-signpost-container')).not.toBeNull();

        document.body.click();
        testContext.detectChanges();

        expect(document.body.querySelector('.clr-signpost-container')).toBeNull();
        expectActiveElementToBe(testContext.testElement.querySelector('.signpost-action'));
      });

      it('should get focus back on trigger if signpost gets closed while focused element inside content', () => {
        testContext.popoverService.open = true;
        testContext.detectChanges();

        const dummyButton: HTMLElement = document.body.querySelector('.dummy-button');
        dummyButton.focus();

        testContext.popoverService.open = false;
        testContext.detectChanges();

        expectActiveElementToBe(testContext.testElement.querySelector('.signpost-action'));
      });

      it('should get focus back on trigger if signpost gets closed with ESC key', () => {
        testContext.popoverService.open = true;
        testContext.detectChanges();
        expect(document.body.querySelector('.clr-signpost-container')).not.toBeNull();

        const event: KeyboardEvent = new KeyboardEvent('keydown', { key: 'Escape' });

        document.body.dispatchEvent(event);
        testContext.detectChanges();

        expect(document.body.querySelector('.clr-signpost-container')).toBeNull();
        expectActiveElementToBe(testContext.testElement.querySelector('.signpost-action'));
      });
    });

    describe('custom trigger', () => {
      let testContext: Context;

      const getContext = spec(ClrSignpost, TestCustomTriggerSignpost, ClrSignpostModule);
      beforeEach(() => {
        testContext = getContext() as Context;
      });

      beforeEach(() => {
        testContext.popoverService = testContext.getClarityProvider(ClrPopoverService);
      });

      /********
       * This test assumes that if
       */
      it('does not display the default trigger', () => {
        const triggerIcon: HTMLElement = testContext.testElement.querySelector('cds-icon');

        /**********
         * If there is a cds-icon we are testing that it is not the same shape
         * used for the default trigger.
         */
        if (triggerIcon) {
          expect(triggerIcon.getAttribute('shape')).not.toBe('info');
        }
      });

      it('projects a custom trigger element to hide/show content', () => {
        const signpostTrigger: HTMLElement = testContext.testElement.querySelector('.signpost-action');
        let signpostContent: HTMLElement;

        expect(signpostTrigger.textContent.trim()).toBe('Custom trigger');

        // Test we have a trigger
        expect(signpostTrigger).not.toBeNull();

        // Test it shows after changes
        signpostTrigger.click();
        testContext.detectChanges();
        signpostContent = document.body.querySelector('.clr-signpost-container');
        expect(signpostContent).not.toBeNull();
        expect(testContext.popoverService.open).toBe(true);

        // Test it hide when clicked again
        signpostTrigger.click();
        testContext.detectChanges();
        signpostContent = document.body.querySelector('.clr-signpost-container');
        expect(signpostContent).toBeNull();
        expect(testContext.popoverService.open).toBe(false);
      });
    });

    describe('aria-control values', () => {
      let testContext: Context;

      const getContext = spec(ClrSignpost, TestDefaultSignpost, ClrSignpostModule);
      beforeEach(() => {
        testContext = getContext() as Context;
      });

      function checkAriaControlsId(id: string, element: HTMLElement) {
        const triggerControlsValue = element.querySelector('.signpost-action').getAttribute('aria-controls');
        const closeControlsValue = element
          .querySelector('.signpost-content .signpost-action')
          .getAttribute('aria-controls');
        const contentId = element.querySelector('.signpost-content').getAttribute('id');

        expect(id, 'ClrSignpostContent id is out of sync (content gets a new id each time it is created)').toBe(
          contentId
        );
        expect(
          id,
          'ClrSignpost id does not match the signpost trigger aria-controls value on the signpost trigger'
        ).toBe(triggerControlsValue);
        expect(id, 'ClrSignpost id does not match the aria-controls value on the close button').toBe(
          closeControlsValue
        );
      }

      beforeEach(() => {
        testContext.signpostIdService = testContext.getClarityProvider(SignpostIdService);
        testContext.triggerButton = testContext.testElement.querySelector('.signpost-action');
      });

      it('are correct when content is opened', () => {
        let currentId;
        testContext.signpostIdService.id.subscribe(idChange => {
          currentId = idChange;
        });

        // First open
        testContext.triggerButton.click();
        renderFixture(testContext.fixture);

        checkAriaControlsId(currentId, document.body.querySelector('.clr-signpost-container'));

        // Close it
        testContext.triggerButton.click();
        renderFixture(testContext.fixture);

        // Second open
        testContext.triggerButton.click();
        renderFixture(testContext.fixture);

        checkAriaControlsId(currentId, document.body.querySelector('.clr-signpost-container'));
      });
    });
  });
});

@Component({
  template: `
    <button #outsideClick type="button">Button to test clicks outside of the dropdown component</button>
    <clr-signpost>
      <button type="button" class="signpost-action btn btn-sm btn-link" clrSignpostTrigger>Custom trigger</button>
      <clr-signpost-content *clrIfOpen="openState">Signpost content</clr-signpost-content>
    </clr-signpost>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestCustomTriggerSignpost {
  @ViewChild(ClrSignpost) signpost: ClrSignpost;
  openState = false;

  @ViewChild('outsideClick', { read: ElementRef, static: true }) outsideClickBtn: ElementRef<HTMLButtonElement>;

  position = ClrPopoverPosition.RIGHT_MIDDLE;
}

@Component({
  template: `
    <button #outsideClick class="btn">Button to test clicks outside of the dropdown component</button>
    <div style="padding: 150px 350px; width: 700px; height: 300px">
      <clr-signpost [clrSignpostTriggerAriaLabel]="signpostTriggerAriaLabel">
        <clr-signpost-content *clrIfOpen="openState" [clrPosition]="position">
          <button class="dummy-button btn btn-sm btn-link">dummy button</button>
          Signpost content
        </clr-signpost-content>
      </clr-signpost>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestDefaultSignpost {
  @ViewChild(ClrSignpost) signpost: ClrSignpost;

  openState = false;
  signpostTriggerAriaLabel: string;
  position = ClrPopoverPosition.RIGHT_MIDDLE;

  @ViewChild('outsideClick', { read: ElementRef, static: true }) outsideClickBtn: ElementRef<HTMLButtonElement>;
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, ViewChild } from '@angular/core';

import { SignpostIdService } from './providers/signpost-id.service';
import { ClrSignpost } from './signpost';
import { ClrSignpostModule } from './signpost.module';
import { ClrPopoverService } from '../../utils';
import {
  expectActiveElementNotToBe,
  expectActiveElementToBe,
  spec,
  TestContext,
} from '../../utils/testing/helpers.spec';
import { delay } from '../../utils/testing/helpers.spec';

interface Context extends TestContext<ClrSignpost, TestDefaultSignpost | TestCustomTriggerSignpost> {
  popoverService: ClrPopoverService;
  triggerButton: HTMLButtonElement;
  contentCloseButton: HTMLButtonElement;
  content: HTMLDivElement;
  signpostIdService: SignpostIdService;
}

export default function (): void {
  describe('Signpost', function () {
    describe('default trigger', function () {
      spec(ClrSignpost, TestDefaultSignpost, ClrSignpostModule);

      beforeEach(function (this: Context) {
        this.signpostIdService = this.getClarityProvider(SignpostIdService);
        this.popoverService = this.getClarityProvider(ClrPopoverService);
      });

      it('adds the .signpost class to clr-signpost', function (this: Context) {
        expect(this.clarityElement.classList).toContain('signpost');
      });

      it('has a default trigger that can hide/show content', function (this: Context) {
        const signpostToggle: HTMLElement = this.hostElement.querySelector('.signpost-action');
        let signpostContent: HTMLElement;

        // Test we have a trigger
        expect(signpostToggle).not.toBeNull();

        // Test that content shows
        signpostToggle.click();
        this.detectChanges();
        signpostContent = document.body.querySelector('.clr-signpost-container');
        expect(signpostContent).not.toBeNull();
        expect(this.popoverService.open).toBe(true);

        // Test that content hides again
        signpostToggle.click();
        this.detectChanges();
        signpostContent = document.body.querySelector('.clr-signpost-container');
        expect(signpostContent).toBeNull();
        expect(this.popoverService.open).toBe(false);
      });

      it('has a default aria-label on the default trigger', function (this: Context) {
        const signpostToggle: HTMLElement = this.hostElement.querySelector('.signpost-action');

        expect(signpostToggle.getAttribute('aria-label')).toEqual('Signpost Toggle');
      });

      it('allows a custom aria-label for the default trigger', function (this: Context) {
        this.fixture.componentInstance.signpost.signpostTriggerAriaLabel = 'custom label';
        this.detectChanges();
        const signpostToggle: HTMLElement = this.hostElement.querySelector('.signpost-action');

        expect(signpostToggle.getAttribute('aria-label')).toBe('custom label');
      });
    });

    describe('focus management', function () {
      spec(ClrSignpost, TestDefaultSignpost, ClrSignpostModule);

      beforeEach(function (this: Context) {
        this.popoverService = this.getClarityProvider(ClrPopoverService);
      });

      it('should not get focus on trigger initially', function (this: Context) {
        const signpostToggle: HTMLElement = this.hostElement.querySelector('.signpost-action');
        this.popoverService.open = false;
        this.detectChanges();
        expect(signpostToggle).not.toBeNull();
        expectActiveElementNotToBe(signpostToggle);
      });

      it('should not get focus back on trigger if signpost gets closed with outside click on another interactive element', async function (this: Context) {
        this.popoverService.open = true;
        await delay();
        this.detectChanges();
        expect(document.body.querySelector('.clr-signpost-container')).not.toBeNull();

        // dynamic click doesn't set the focus so here manually focusing first
        this.hostComponent.outsideClickBtn.nativeElement.focus();
        this.hostComponent.outsideClickBtn.nativeElement.click();
        this.detectChanges();

        expect(document.body.querySelector('.clr-signpost-container')).toBeNull();
        expectActiveElementToBe(this.hostComponent.outsideClickBtn.nativeElement);
      });

      it('should get focus back on trigger if signpost gets closed with outside click on non-interactive element', async function (this: Context) {
        this.popoverService.open = true;
        await delay();
        this.detectChanges();
        expect(document.body.querySelector('.clr-signpost-container')).not.toBeNull();

        document.body.click();
        this.detectChanges();

        expect(document.body.querySelector('.clr-signpost-container')).toBeNull();
        expectActiveElementToBe(this.hostElement.querySelector('.signpost-action'));
      });

      it('should get focus back on trigger if signpost gets closed while focused element inside content', function (this: Context) {
        this.popoverService.open = true;
        this.detectChanges();

        const dummyButton: HTMLElement = document.body.querySelector('.dummy-button');
        dummyButton.focus();

        this.popoverService.open = false;
        this.detectChanges();

        expectActiveElementToBe(this.hostElement.querySelector('.signpost-action'));
      });

      it('should get focus back on trigger if signpost gets closed with ESC key', function (this: Context) {
        this.popoverService.open = true;
        this.detectChanges();
        expect(document.body.querySelector('.clr-signpost-container')).not.toBeNull();

        const event: KeyboardEvent = new KeyboardEvent('keydown', { key: 'Escape' });

        document.body.dispatchEvent(event);
        this.detectChanges();

        expect(document.body.querySelector('.clr-signpost-container')).toBeNull();
        expectActiveElementToBe(this.hostElement.querySelector('.signpost-action'));
      });
    });

    describe('custom trigger', function () {
      spec(ClrSignpost, TestCustomTriggerSignpost, ClrSignpostModule);

      beforeEach(function (this: Context) {
        this.popoverService = this.getClarityProvider(ClrPopoverService);
      });

      /********
       * This test assumes that if
       */
      it('does not display the default trigger', function (this: Context) {
        const triggerIcon: HTMLElement = this.hostElement.querySelector('cds-icon');

        /**********
         * If there is a cds-icon we are testing that it is not the same shape
         * used for the default trigger.
         */
        if (triggerIcon) {
          expect(triggerIcon.getAttribute('shape')).not.toBe('info');
        }
      });

      it('projects a custom trigger element to hide/show content', function (this: Context) {
        const signpostTrigger: HTMLElement = this.hostElement.querySelector('.signpost-action');
        let signpostContent: HTMLElement;

        expect(signpostTrigger.textContent.trim()).toBe('Custom trigger');

        // Test we have a trigger
        expect(signpostTrigger).not.toBeNull();

        // Test it shows after changes
        signpostTrigger.click();
        this.detectChanges();
        signpostContent = document.body.querySelector('.clr-signpost-container');
        expect(signpostContent).not.toBeNull();
        expect(this.popoverService.open).toBe(true);

        // Test it hide when clicked again
        signpostTrigger.click();
        this.detectChanges();
        signpostContent = document.body.querySelector('.clr-signpost-container');
        expect(signpostContent).toBeNull();
        expect(this.popoverService.open).toBe(false);
      });
    });

    describe('aria-control values', () => {
      spec(ClrSignpost, TestDefaultSignpost, ClrSignpostModule);

      function checkAriaControlsId(id: string, element: HTMLElement) {
        const triggerControlsValue = element.querySelector('.signpost-action').getAttribute('aria-controls');
        const closeControlsValue = element
          .querySelector('.signpost-content .signpost-action')
          .getAttribute('aria-controls');
        const contentId = element.querySelector('.signpost-content').getAttribute('id');

        expect(id).toBe(
          contentId,
          'ClrSignpostContent id is out of sync (content gets a new id each time it is created)'
        );
        expect(id).toBe(
          triggerControlsValue,
          'ClrSignpost id does not match the signpost trigger aria-controls value on the signpost trigger'
        );
        expect(id).toBe(
          closeControlsValue,
          'ClrSignpost id does not match the aria-controls value on the close button'
        );
      }

      beforeEach(function (this: Context) {
        this.signpostIdService = this.getClarityProvider(SignpostIdService);
        this.triggerButton = this.hostElement.querySelector('.signpost-action');
      });

      it('are correct when content is opened', function (this: Context) {
        let currentId;
        this.signpostIdService.id.subscribe(idChange => {
          currentId = idChange;
        });

        // First open
        this.triggerButton.click();
        this.fixture.detectChanges();

        checkAriaControlsId(currentId, document.body.querySelector('.clr-signpost-container'));

        // Close it
        this.triggerButton.click();
        this.fixture.detectChanges();

        // Second open
        this.triggerButton.click();
        this.fixture.detectChanges();

        checkAriaControlsId(currentId, document.body.querySelector('.clr-signpost-container'));
      });
    });
  });
}

@Component({
  template: `
    <button #outsideClick type="button">Button to test clicks outside of the dropdown component</button>
    <clr-signpost>
      <button type="button" class="signpost-action btn btn-sm btn-link" clrSignpostTrigger>Custom trigger</button>
      <clr-signpost-content *clrIfOpen="openState">Signpost content</clr-signpost-content>
    </clr-signpost>
  `,
  standalone: false,
})
class TestCustomTriggerSignpost {
  @ViewChild(ClrSignpost) signpost: ClrSignpost;
  openState = false;

  @ViewChild('outsideClick', { read: ElementRef, static: true }) outsideClickBtn: ElementRef<HTMLButtonElement>;

  position = 'right-middle';
}

@Component({
  template: `
    <button #outsideClick type="button">Button to test clicks outside of the dropdown component</button>
    <clr-signpost [clrSignpostTriggerAriaLabel]="signpostTriggerAriaLabel">
      <clr-signpost-content *clrIfOpen="openState">
        <button class="dummy-button" type="button">dummy button</button>
        Signpost content
      </clr-signpost-content>
    </clr-signpost>
  `,
  standalone: false,
})
class TestDefaultSignpost {
  @ViewChild(ClrSignpost) signpost: ClrSignpost;

  openState = false;
  signpostTriggerAriaLabel: string;

  @ViewChild('outsideClick', { read: ElementRef, static: true }) outsideClickBtn: ElementRef<HTMLButtonElement>;
}

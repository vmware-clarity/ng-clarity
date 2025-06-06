/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, ViewChild } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import {
  expectActiveElementNotToBe,
  expectActiveElementToBe,
  spec,
  TestContext,
} from '../../utils/testing/helpers.spec';
import { SignpostIdService } from './providers/signpost-id.service';
import { ClrSignpost } from './signpost';
import { ClrSignpostModule } from './signpost.module';

interface Context extends TestContext<ClrSignpost, TestDefaultSignpost | TestCustomTriggerSignpost> {
  toggleService: ClrPopoverToggleService;
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
        this.toggleService = this.getClarityProvider(ClrPopoverToggleService);
      });

      it('adds the .signpost class to clr-signpost', function (this: Context) {
        expect(this.clarityElement.classList).toContain('signpost');
      });

      it('has a default trigger that can hide/show content', function (this: Context) {
        const signpostToggle: HTMLElement = this.hostElement.querySelector('.signpost-action');
        let signpostContent: HTMLElement;

        // Test we have a trigger
        expect(signpostToggle).not.toBeNull();

        // // Test that content shows
        signpostToggle.click();
        this.detectChanges();
        signpostContent = this.hostElement.querySelector('.signpost-content');
        expect(signpostContent).not.toBeNull();
        expect(this.toggleService.open).toBe(true);

        // Test that content hides again
        signpostToggle.click();
        this.detectChanges();
        signpostContent = this.hostElement.querySelector('.signpost-content');
        expect(signpostContent).toBeNull();
        expect(this.toggleService.open).toBe(false);
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
        this.toggleService = this.getClarityProvider(ClrPopoverToggleService);
      });

      it('should not get focus on trigger initially', function (this: Context) {
        const signpostToggle: HTMLElement = this.hostElement.querySelector('.signpost-action');
        this.toggleService.open = false;
        this.detectChanges();
        expect(signpostToggle).not.toBeNull();
        expectActiveElementNotToBe(signpostToggle);
      });

      it('should not get focus back on trigger if signpost gets closed with outside click on another interactive element', fakeAsync(function (
        this: Context
      ) {
        this.toggleService.open = true;
        tick();
        this.detectChanges();
        expect(this.hostElement.querySelector('.signpost-content')).not.toBeNull();

        // dynamic click doesn't set the focus so here manually focusing first
        this.hostComponent.outsideClickBtn.nativeElement.focus();
        this.hostComponent.outsideClickBtn.nativeElement.click();
        this.detectChanges();

        expect(this.hostElement.querySelector('.signpost-content')).toBeNull();
        expectActiveElementToBe(this.hostComponent.outsideClickBtn.nativeElement);
      }));

      it('should get focus back on trigger if signpost gets closed with outside click on non-interactive element', fakeAsync(function (
        this: Context
      ) {
        this.toggleService.open = true;
        tick();
        this.detectChanges();
        expect(this.hostElement.querySelector('.signpost-content')).not.toBeNull();

        document.body.click();
        this.detectChanges();

        expect(this.hostElement.querySelector('.signpost-content')).toBeNull();
        expectActiveElementToBe(this.hostElement.querySelector('.signpost-action'));
      }));

      it('should get focus back on trigger if signpost gets closed while focused element inside content', function (this: Context) {
        this.toggleService.open = true;
        this.detectChanges();

        const dummyButton: HTMLElement = this.hostElement.querySelector('.dummy-button');
        dummyButton.focus();

        this.toggleService.open = false;
        this.detectChanges();

        expectActiveElementToBe(this.hostElement.querySelector('.signpost-action'));
      });

      it('should get focus back on trigger if signpost gets closed with ESC key', function (this: Context) {
        this.toggleService.open = true;
        this.detectChanges();
        expect(this.hostElement.querySelector('.signpost-content')).not.toBeNull();

        const event: KeyboardEvent = new KeyboardEvent('keydown', { key: 'Escape' });

        document.dispatchEvent(event);
        this.detectChanges();

        expect(this.hostElement.querySelector('.signpost-content')).toBeNull();
        expectActiveElementToBe(this.hostElement.querySelector('.signpost-action'));
      });
    });

    describe('custom trigger', function () {
      spec(ClrSignpost, TestCustomTriggerSignpost, ClrSignpostModule);

      beforeEach(function (this: Context) {
        this.toggleService = this.getClarityProvider(ClrPopoverToggleService);
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
        signpostContent = this.hostElement.querySelector('.signpost-content');
        expect(signpostContent).not.toBeNull();
        expect(this.toggleService.open).toBe(true);

        // Test it hide when clicked again
        signpostTrigger.click();
        this.detectChanges();
        signpostContent = this.hostElement.querySelector('.signpost-content');
        expect(signpostContent).toBeNull();
        expect(this.toggleService.open).toBe(false);
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

        checkAriaControlsId(currentId, this.clarityElement);

        // Close it
        this.triggerButton.click();
        this.fixture.detectChanges();

        // Second open
        this.triggerButton.click();
        this.fixture.detectChanges();

        checkAriaControlsId(currentId, this.clarityElement);
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
})
class TestDefaultSignpost {
  @ViewChild(ClrSignpost) signpost: ClrSignpost;

  openState = false;
  signpostTriggerAriaLabel: string;

  @ViewChild('outsideClick', { read: ElementRef, static: true }) outsideClickBtn: ElementRef<HTMLButtonElement>;
}

/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, ViewChild } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

import { ClrPopoverService } from '../../utils/popover/providers/popover.service';
import { spec, TestContext } from '../../utils/testing/helpers.spec';
import { ClrOverlayPanel } from './overlay-panel';
import { ClrOverlayPanelModule } from './overlay-panel.module';
import { OverlayPanelIdService } from './providers/overlay-panel-id.service';

interface Context extends TestContext<ClrOverlayPanel, TestDefaultOverlayPanel | TestCustomTriggerOverlayPanel> {
  popoverService: ClrPopoverService;
  triggerButton: HTMLButtonElement;
  contentCloseButton: HTMLButtonElement;
  content: HTMLDivElement;
  overlayPanelIdService: OverlayPanelIdService;
}

export default function (): void {
  describe('OverlayPanel', function () {
    describe('default trigger', function () {
      spec(ClrOverlayPanel, TestDefaultOverlayPanel, ClrOverlayPanelModule);

      beforeEach(function (this: Context) {
        this.overlayPanelIdService = this.getClarityProvider(OverlayPanelIdService);
        this.popoverService = this.getClarityProvider(ClrPopoverService);
      });

      it('adds the .overlay-panel class to clr-overlay-panel', function (this: Context) {
        expect(this.clarityElement.classList).toContain('overlay-panel');
      });

      it('has a default trigger that can hide/show content', function (this: Context) {
        const overlayPanelToggle: HTMLElement = this.hostElement.querySelector('.overlay-panel-action');
        let overlayPanelContent: HTMLElement;

        // Test we have a trigger
        expect(overlayPanelToggle).not.toBeNull();

        // // Test that content shows
        overlayPanelToggle.click();
        this.detectChanges();
        overlayPanelContent = this.hostElement.querySelector('.overlay-panel-content');
        expect(overlayPanelContent).not.toBeNull();
        expect(this.popoverService.open).toBe(true);

        // Test that content hides again
        overlayPanelToggle.click();
        this.detectChanges();
        overlayPanelContent = this.hostElement.querySelector('.overlay-panel-content');
        expect(overlayPanelContent).toBeNull();
        expect(this.popoverService.open).toBe(false);
      });

      it('has a default aria-label on the default trigger', function (this: Context) {
        const overlayPanelToggle: HTMLElement = this.hostElement.querySelector('.overlay-panel-action');

        expect(overlayPanelToggle.getAttribute('aria-label')).toEqual('OverlayPanel Toggle');
      });
    });

    describe('focus management', function () {
      spec(ClrOverlayPanel, TestDefaultOverlayPanel, ClrOverlayPanelModule);

      beforeEach(function (this: Context) {
        this.popoverService = this.getClarityProvider(ClrPopoverService);
      });

      it('should not get focus on trigger initially', function (this: Context) {
        const overlayPanelToggle: HTMLElement = this.hostElement.querySelector('.overlay-panel-action');
        this.popoverService.open = false;
        this.detectChanges();
        expect(overlayPanelToggle).not.toBeNull();
        expect(document.activeElement).not.toBe(overlayPanelToggle);
      });

      it('should not get focus back on trigger if overlay-panel gets closed with outside click on another interactive element', fakeAsync(function (
        this: Context
      ) {
        this.popoverService.open = true;
        tick();
        this.detectChanges();
        expect(this.hostElement.querySelector('.overlay-panel-content')).not.toBeNull();

        // dynamic click doesn't set the focus so here manually focusing first
        this.hostComponent.outsideClickBtn.nativeElement.focus();
        this.hostComponent.outsideClickBtn.nativeElement.click();
        this.detectChanges();

        expect(this.hostElement.querySelector('.overlay-panel-content')).toBeNull();
        expect(document.activeElement).toBe(this.hostComponent.outsideClickBtn.nativeElement);
      }));

      it('should get focus back on trigger if overlay-panel gets closed with outside click on non-interactive element', fakeAsync(function (
        this: Context
      ) {
        this.popoverService.open = true;
        tick();
        this.detectChanges();
        expect(this.hostElement.querySelector('.overlay-panel-content')).not.toBeNull();

        document.body.click();
        this.detectChanges();

        expect(this.hostElement.querySelector('.overlay-panel-content')).toBeNull();
        expect(document.activeElement).toBe(this.hostElement.querySelector('.overlay-panel-action'));
      }));

      it('should get focus back on trigger if overlay-panel gets closed while focused element inside content', function (this: Context) {
        this.popoverService.open = true;
        this.detectChanges();

        const dummyButton: HTMLElement = this.hostElement.querySelector('.dummy-button');
        dummyButton.focus();

        this.popoverService.open = false;
        this.detectChanges();

        expect(document.activeElement).toBe(this.hostElement.querySelector('.overlay-panel-action'));
      });

      it('should get focus back on trigger if overlay-panel gets closed with ESC key', function (this: Context) {
        this.popoverService.open = true;
        this.detectChanges();
        expect(this.hostElement.querySelector('.overlay-panel-content')).not.toBeNull();

        const event: KeyboardEvent = new KeyboardEvent('keydown', { key: 'Escape' });

        document.dispatchEvent(event);
        this.detectChanges();

        expect(this.hostElement.querySelector('.overlay-panel-content')).toBeNull();
        expect(document.activeElement).toBe(this.hostElement.querySelector('.overlay-panel-action'));
      });
    });

    describe('custom trigger', function () {
      spec(ClrOverlayPanel, TestCustomTriggerOverlayPanel, ClrOverlayPanelModule);

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
        const overlayPanelTrigger: HTMLElement = this.hostElement.querySelector('.overlay-panel-action');
        let overlayPanelContent: HTMLElement;

        expect(overlayPanelTrigger.textContent.trim()).toBe('Custom trigger');

        // Test we have a trigger
        expect(overlayPanelTrigger).not.toBeNull();

        // Test it shows after changes
        overlayPanelTrigger.click();
        this.detectChanges();
        overlayPanelContent = this.hostElement.querySelector('.overlay-panel-content');
        expect(overlayPanelContent).not.toBeNull();
        expect(this.popoverService.open).toBe(true);

        // Test it hide when clicked again
        overlayPanelTrigger.click();
        this.detectChanges();
        overlayPanelContent = this.hostElement.querySelector('.overlay-panel-content');
        expect(overlayPanelContent).toBeNull();
        expect(this.popoverService.open).toBe(false);
      });
    });

    describe('aria-control values', () => {
      spec(ClrOverlayPanel, TestDefaultOverlayPanel, ClrOverlayPanelModule);

      function checkAriaControlsId(id: string, element: HTMLElement) {
        const triggerControlsValue = element.querySelector('.overlay-panel-action').getAttribute('aria-controls');
        const closeControlsValue = element
          .querySelector('.overlay-panel-content .overlay-panel-action')
          .getAttribute('aria-controls');
        const contentId = element.querySelector('.overlay-panel-content').getAttribute('id');

        expect(id).toBe(
          contentId,
          'ClrOverlayPanelContent id is out of sync (content gets a new id each time it is created)'
        );
        expect(id).toBe(
          triggerControlsValue,
          'ClrOverlayPanel id does not match the overlay-panel trigger aria-controls value on the overlay-panel trigger'
        );
        expect(id).toBe(
          closeControlsValue,
          'ClrOverlayPanel id does not match the aria-controls value on the close button'
        );
      }

      beforeEach(function (this: Context) {
        this.overlayPanelIdService = this.getClarityProvider(OverlayPanelIdService);
        this.triggerButton = this.hostElement.querySelector('.overlay-panel-action');
      });

      it('are correct when content is opened', function (this: Context) {
        let currentId;
        this.overlayPanelIdService.id.subscribe(idChange => {
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
    <clr-overlay-panel>
      <button type="button" class="overlay-panel-action btn btn-sm btn-link" clrOverlayPanelTrigger>
        Custom trigger
      </button>
      <clr-overlay-panel-content *clrIfOpen="openState">OverlayPanel content</clr-overlay-panel-content>
    </clr-overlay-panel>
  `,
})
class TestCustomTriggerOverlayPanel {
  @ViewChild(ClrOverlayPanel) overlayPanel: ClrOverlayPanel;
  openState = false;

  @ViewChild('outsideClick', { read: ElementRef, static: true }) outsideClickBtn: ElementRef;

  position = 'right-middle';
}

@Component({
  template: `
    <button #outsideClick type="button">Button to test clicks outside of the dropdown component</button>
    <clr-overlay-panel>
      <clr-overlay-panel-content *clrIfOpen="openState">
        <button class="dummy-button" type="button">dummy button</button>
        OverlayPanel content
      </clr-overlay-panel-content>
    </clr-overlay-panel>
  `,
})
class TestDefaultOverlayPanel {
  @ViewChild(ClrOverlayPanel) overlayPanel: ClrOverlayPanel;

  openState = false;

  @ViewChild('outsideClick', { read: ElementRef, static: true }) outsideClickBtn: ElementRef;
}

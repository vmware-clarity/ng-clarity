/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ClrPopoverContent } from './popover-content';
import { ClrPopoverModuleNext } from './popover.module';
import { ClrPopoverService } from './providers/popover.service';
import { ClrPopoverPosition } from './utils/popover-positions';
import { TestContext } from '../../utils/testing/helpers.spec';

@Component({
  selector: 'test-host',
  template: `
    <button #anchor clrPopoverAnchor clrPopoverOpenCloseButton>Popover Toggle</button>
    <div
      *clrPopoverContent="openState; at: popoverPosition; outsideClickToClose: closeClick; scrollToClose: closeScroll"
      (clrPopoverContentChange)="changeCounter()"
    >
      Popover content
    </div>
  `,
  providers: [ClrPopoverService],
  standalone: false,
})
@Component({
  template: ``,
  providers: [ClrPopoverService],
  standalone: false,
})
class SimpleContent {
  @ViewChild(ClrPopoverContent, { read: ClrPopoverContent, static: true }) content: ClrPopoverContent;
  popoverPosition = ClrPopoverPosition.BOTTOM_LEFT;
  openState = false;
  closeClick = true;
  closeScroll = true;
  changeCount = 0;
  changeCounter() {
    this.changeCount += 1;
  }
}

export default function (): void {
  describe('ClrPopoverContent', function () {
    type Context = TestContext<ClrPopoverContent, SimpleContent> & {
      testComponent: SimpleContent;
      clarityDirective: ClrPopoverModuleNext;
      popoverService: ClrPopoverService;
      changeDetectorRef: ChangeDetectorRef;
    };

    beforeEach(function (this: Context) {
      /*
       * The ClrPopoverContent element is a template and not rendered in the DOM,
       * This test is reliant on the @ViewChild in the test component.
       * the spec() helper wasn't working out of the box here.
       */
      TestBed.configureTestingModule({
        imports: [ClrPopoverModuleNext],
        declarations: [SimpleContent],
      });
      this.fixture = TestBed.createComponent(SimpleContent);
      this.fixture.detectChanges();
      this.testComponent = this.fixture.componentInstance;
      this.clarityDirective = this.fixture.componentInstance.content;
      this.changeDetectorRef = this.fixture.debugElement.injector.get(ChangeDetectorRef);
      this.popoverService = this.fixture.debugElement.injector.get(ClrPopoverService);
    });

    describe('Providers', function (this: Context) {
      it('declares a Popover Service', function (this: Context) {
        expect(this.popoverService).toBeDefined();
      });
    });

    describe('TypeScript API', function (this: Context) {
      it('responds to openChange events from the popoverService', function (this: Context) {
        this.testComponent.openState = true; // Add content to the DOM
        this.fixture.detectChanges();
        let content = document.body.querySelectorAll('div.clr-popover-content');
        // Popovers are not getting cleaned up here.
        expect(content.length).toBe(1);
        expect(content[0].textContent.trim()).toBe('Popover content');

        this.testComponent.openState = false; // Remove content from the DOM
        this.fixture.detectChanges();
        content = document.body.querySelectorAll('div.clr-popover-content');
        expect(content.length).toBe(0);
      });
    });

    describe('Template API', () => {
      it('binds to [clrPopoverContent] open state', function (this: Context) {
        expect(this.testComponent.openState).toBe(this.popoverService.open);
        this.testComponent.openState = undefined;
        expect(this.popoverService.open).toBe(false);
        this.testComponent.openState = false;
        expect(this.popoverService.open).toBe(false);
      });

      it('binds to [clrPopoverContentAt] position', function (this: Context) {
        expect(this.testComponent.popoverPosition).toEqual(this.popoverService.position);
        const newPosition = ClrPopoverPosition.TOP_RIGHT;
        this.testComponent.popoverPosition = newPosition;
        this.fixture.detectChanges();
        expect(this.popoverService.position).toEqual(newPosition);
      });

      it('binds to [clrPopoverContentOutsideClickToClose]', function (this: Context) {
        expect(this.testComponent.content.outsideClickClose).toBe(true);
        this.testComponent.closeClick = false;
        this.fixture.detectChanges();
        expect(this.testComponent.content.outsideClickClose).toBe(false);
      });

      it('binds to [clrPopoverContentScrollToClose]', function (this: Context) {
        expect(this.testComponent.closeScroll).toBe(this.testComponent.content.scrollToClose);
        this.testComponent.closeScroll = false;
        this.fixture.detectChanges();
        expect(this.testComponent.content.scrollToClose).toBe(false);
      });
    });

    describe('View Basics', function (this: Context) {
      it('adds top and left style to the content container when content is open', function (this: Context) {
        this.testComponent.openState = true; // Add content to the DOM
        this.fixture.detectChanges();
        const content: HTMLCollectionOf<Element> = document.body.getElementsByClassName('clr-popover-content');
        const testElement = content[0] as HTMLElement;
        expect(testElement.parentElement.style.top).toMatch(/\d+px/);
        expect(testElement.parentElement.style.left).toMatch(/\d+px/);
      });

      it('does not fail when the popup view is immediately destroyed', async function (this: Context) {
        spyOn(this.fixture, 'detectChanges');
        this.testComponent.openState = true;
        this.fixture.detectChanges();
        this.testComponent.openState = false;
        this.fixture.detectChanges();

        expect(this.fixture.detectChanges).not.toThrowAnyError();
      });
    });
  });
}

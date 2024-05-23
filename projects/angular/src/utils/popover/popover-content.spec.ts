/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TestContext } from '../testing/helpers.spec';
import { ClrAlignment } from './enums/alignment.enum';
import { ClrAxis } from './enums/axis.enum';
import { ClrSide } from './enums/side.enum';
import { ClrPopoverPosition } from './interfaces/popover-position.interface';
import { ClrPopoverContent } from './popover-content';
import { ClrPopoverModuleNext } from './popover.module';
import { ClrPopoverService } from './providers/popover.service';

@Component({
  selector: 'test-host',
  template: `
    <button #anchor clrPopoverAnchor clrPopoverOpenCloseButton>Popover Toggle</button>
    <div
      *clrPopoverContent="openState; at: smartPosition; outsideClickToClose: closeClick; scrollToClose: closeScroll"
      (clrPopoverContentChange)="changeCounter()"
    >
      Popover content
    </div>
  `,
  providers: [ClrPopoverService],
})
@Component({
  template: ``,
  providers: [ClrPopoverService],
})
class SimpleContent {
  @ViewChild(ClrPopoverContent, { read: ClrPopoverContent, static: true }) content: ClrPopoverContent;
  smartPosition: ClrPopoverPosition = {
    axis: ClrAxis.VERTICAL,
    side: ClrSide.BEFORE,
    anchor: ClrAlignment.START,
    content: ClrAlignment.START,
  };
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
      this.popoverService = this.fixture.debugElement.injector.get(ClrPopoverService);
    });

    describe('Providers', function (this: Context) {
      it('declares a Popover popoverService', function (this: Context) {
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

      it('binds to [clrPopoverContentOutsideClickToClose]', function (this: Context) {
        expect(this.popoverService.outsideClickClose).toBe(true);
        this.testComponent.closeClick = false;
        this.fixture.detectChanges();
        expect(this.popoverService.outsideClickClose).toBe(false);
      });

      it('binds to [clrPopoverContentScrollToClose]', function (this: Context) {
        expect(this.testComponent.closeScroll).toBe(this.popoverService.scrollToClose);
        this.testComponent.closeScroll = false;
        this.fixture.detectChanges();
        expect(this.popoverService.scrollToClose).toBe(false);
      });
    });

    describe('View Basics', function (this: Context) {
      it('adds top and left style to the content container when content is open', function (this: Context) {
        this.testComponent.openState = true; // Add content to the DOM
        this.fixture.detectChanges();
        const content: HTMLCollectionOf<Element> = document.body.getElementsByClassName(
          'cdk-overlay-connected-position-bounding-box'
        );
        const testElement = content[0] as HTMLElement;
        expect(testElement.style.top).toMatch(/\d+px/);
        expect(testElement.style.left).toMatch(/\d+px/);
      });

      it('does not fail when the popup view is immediately destroyed', fakeAsync(function (this: Context) {
        this.testComponent.openState = true;
        this.fixture.detectChanges();
        this.testComponent.openState = false;
        this.fixture.detectChanges();

        expect(tick).not.toThrowAnyError();
      }));
    });
  });
}

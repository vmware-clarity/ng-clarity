/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TestContext } from '@clr/angular/testing';

import { ClrPopoverContent } from './popover-content';
import { ClrPopoverModuleNext } from './popover.module';
import { ClrPopoverService } from './providers/popover.service';
import { ClrPopoverPosition } from './utils/popover-positions';

@Component({
  selector: 'test-host',
  template: `
    <button #anchor clrPopoverOrigin clrPopoverOpenCloseButton>Popover Toggle</button>
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

@Component({
  template: `
    <div *clrPopoverContent="openState; at: 'bottom-left'; outsideClickToClose: true; origin: point">
      Point popover content
    </div>
  `,
  providers: [ClrPopoverService],
  standalone: false,
})
class PointContent {
  openState = false;
  point: { x: number; y: number } | null = null;
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
        expect(this.testComponent.popoverPosition).toEqual(this.testComponent.content.contentAt as ClrPopoverPosition);
        const newPosition = ClrPopoverPosition.TOP_RIGHT;
        this.testComponent.popoverPosition = newPosition;
        this.fixture.detectChanges();
        expect(this.testComponent.content.contentAt as ClrPopoverPosition).toEqual(newPosition);
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

    describe('getScrollableParents', function (this: Context) {
      let cleanupFns: (() => void)[];

      beforeEach(function () {
        cleanupFns = [];
      });

      afterEach(function () {
        cleanupFns.forEach(cleanup => cleanup());
      });

      it('does not throw when the origin lives inside a ShadowRoot belonging to a foreign document realm', function (this: Context) {
        // Reproduces CDE-3155: a ShadowRoot host whose ancestor <html>/document belong to a
        // different window realm (e.g. an iframe in a micro-frontend architecture) fails the
        // `instanceof HTMLHtmlElement` check across realms, so the walk must not fall through
        // to calling getComputedStyle() on a non-Element (the foreign Document).
        const iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        cleanupFns.push(() => iframe.remove());
        const iframeDoc = iframe.contentDocument;
        iframeDoc.open();
        iframeDoc.write('<!DOCTYPE html><html><body><div id="host"></div></body></html>');
        iframeDoc.close();
        const host = iframeDoc.getElementById('host');
        const shadowRoot = host.attachShadow({ mode: 'open' });
        const trigger = iframeDoc.createElement('button');
        shadowRoot.appendChild(trigger);

        expect(() => {
          (this.clarityDirective as any).getScrollableParents(trigger);
        }).not.toThrow();
      });

      it('discovers scrollable containers both inside the iframe and beyond it in the main document', function (this: Context) {
        // The realm-safe walk should continue past the iframe boundary instead of just
        // stopping there, so scrollable ancestors on both sides of it are found.
        const outerScrollable = document.createElement('div');
        outerScrollable.id = 'outer-scrollable';
        outerScrollable.style.overflowY = 'auto';
        document.body.appendChild(outerScrollable);
        cleanupFns.push(() => outerScrollable.remove());

        const iframe = document.createElement('iframe');
        outerScrollable.appendChild(iframe);
        cleanupFns.push(() => iframe.remove());

        const iframeDoc = iframe.contentDocument;
        iframeDoc.open();
        iframeDoc.write(
          '<!DOCTYPE html><html><body><div id="inner-scrollable" style="overflow-y:auto;"><div id="host"></div></div></body></html>'
        );
        iframeDoc.close();
        const innerScrollable = iframeDoc.getElementById('inner-scrollable');
        const host = iframeDoc.getElementById('host');
        const shadowRoot = host.attachShadow({ mode: 'open' });
        const trigger = iframeDoc.createElement('button');
        shadowRoot.appendChild(trigger);

        const scrollableParents: unknown[] = (this.clarityDirective as any).getScrollableParents(trigger);

        expect(scrollableParents).toContain(document);
        expect(scrollableParents).toContain(iframeDoc);
        expect(scrollableParents).toContain(innerScrollable);
        expect(scrollableParents).toContain(outerScrollable);
      });
    });

    describe('outside click for cross-window origins', function (this: Context) {
      let iframe: HTMLIFrameElement;
      let iframeDoc: Document;
      let trigger: HTMLButtonElement;

      beforeEach(function () {
        iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        iframeDoc = iframe.contentDocument;
        iframeDoc.open();
        iframeDoc.write('<!DOCTYPE html><html><body></body></html>');
        iframeDoc.close();
        trigger = iframeDoc.createElement('button');
        iframeDoc.body.appendChild(trigger);
      });

      afterEach(function () {
        iframe.remove();
      });

      it('closes the popover on a click dispatched inside the foreign-realm document CDK cannot see', function (this: Context) {
        // CDK's outsidePointerEvents() only listens on this window's document, so a click
        // inside the origin's own iframe document would otherwise never close the popover.
        this.popoverService.origin = new ElementRef(trigger);
        this.testComponent.openState = true;
        this.fixture.detectChanges();

        expect(this.popoverService.open).toBe(true);

        iframeDoc.dispatchEvent(new Event('click', { bubbles: true }));

        expect(this.popoverService.open).toBe(false);
      });

      it('does not let a toggle re-click on a cross-window trigger reopen the popover', function (this: Context) {
        // Regression test: a bubble-phase or pointerdown-based listener can't suppress
        // the trigger's own click handler, so a re-click would close then immediately
        // reopen the popover. The capture-phase listener must stopPropagation() before
        // the trigger's own handler ever runs.
        this.popoverService.origin = new ElementRef(trigger);

        let toggleCount = 0;
        const toggleListener = (event: Event) => {
          toggleCount++;
          this.popoverService.toggleWithEvent(event);
        };
        trigger.addEventListener('click', toggleListener);

        // First click opens the popover, mimicking ClrDropdownTrigger's own click handler.
        trigger.click();
        this.fixture.detectChanges();
        expect(this.popoverService.open).toBe(true);
        expect(toggleCount).toBe(1);

        // Second click (the re-click) must close it via the capture-phase listener
        // without ever letting the trigger's own click handler run.
        trigger.click();
        this.fixture.detectChanges();

        expect(this.popoverService.open).toBe(false);
        expect(toggleCount).toBe(1);

        trigger.removeEventListener('click', toggleListener);
      });
    });

    describe('positioning for cross-window origins', function (this: Context) {
      it('anchors the overlay to the resolved cross-window position, not the raw iframe-relative rect', function (this: Context) {
        // Integration check that positionStrategy actually wires resolveCrossWindowOrigin
        // in - cross-window-origin.spec.ts only tests the util in isolation, so deleting
        // the call site in positionStrategy wouldn't be caught there.
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.left = '50px';
        iframe.style.top = '300px';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentDocument;
        iframeDoc.open();
        iframeDoc.write('<!DOCTYPE html><html><body style="margin:0"></body></html>');
        iframeDoc.close();

        const trigger = iframeDoc.createElement('button');
        trigger.style.position = 'absolute';
        trigger.style.left = '10px';
        trigger.style.top = '10px';
        trigger.style.width = '20px';
        trigger.style.height = '20px';
        iframeDoc.body.appendChild(trigger);

        this.popoverService.origin = new ElementRef(trigger);
        this.testComponent.openState = true;
        this.fixture.detectChanges();

        // CDK 21's native-popover-mode overlay doesn't expose the resolved position via
        // plain top/left CSS (it uses a full-viewport bounding box plus internal
        // anchoring), so read the position strategy's own resolved origin directly -
        // the same field _getOriginRect() reads from.
        const overlayRef = (this.clarityDirective as any).overlayRef;
        const usedOrigin = (overlayRef.getConfig().positionStrategy as any)._origin;

        // Without resolveCrossWindowOrigin, this would be the raw ElementRef whose
        // getBoundingClientRect() is relative to the iframe's own viewport (~10, ~10) -
        // nowhere near where the iframe (and thus the trigger) actually renders on
        // screen, roughly iframe (50, 300) + trigger (10, 10).
        expect(usedOrigin.x).toBeCloseTo(60, 0);
        expect(usedOrigin.y).toBeCloseTo(310, 0);

        iframe.remove();
      });
    });
  });

  describe('Point-based positioning', function () {
    beforeEach(function () {
      TestBed.configureTestingModule({
        imports: [ClrPopoverModuleNext],
        declarations: [PointContent],
      });
    });

    it('opens a popover at a specific point origin', fakeAsync(function () {
      const fixture = TestBed.createComponent(PointContent);
      fixture.detectChanges();

      const popoverService = fixture.debugElement.injector.get(ClrPopoverService);
      const point = { x: 150, y: 250 };
      fixture.componentInstance.point = point;
      fixture.componentInstance.openState = true;
      fixture.detectChanges();
      tick();

      const content = document.body.querySelectorAll('div.clr-popover-content');
      expect(content.length).toBe(1);
      expect(content[0].textContent.trim()).toBe('Point popover content');
      expect(popoverService.originPoint).toEqual(point);

      fixture.componentInstance.openState = false;
      fixture.detectChanges();
      tick();

      fixture.destroy();
    }));

    it('opens via popoverService.openAtPoint without errors', fakeAsync(function () {
      const fixture = TestBed.createComponent(PointContent);
      fixture.detectChanges();

      const popoverService = fixture.debugElement.injector.get(ClrPopoverService);
      const point = { x: 300, y: 100 };

      fixture.componentInstance.point = point;
      popoverService.openAtPoint(point);
      fixture.componentInstance.openState = true;
      fixture.detectChanges();
      tick();

      const content = document.body.querySelectorAll('div.clr-popover-content');
      expect(content.length).toBe(1);

      popoverService.open = false;
      fixture.detectChanges();
      tick();

      expect(popoverService.open).toBeFalse();

      fixture.destroy();
    }));
  });
}

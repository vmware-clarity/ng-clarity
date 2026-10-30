/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestContext } from '@clr/angular/testing';
import type { Mock } from 'vitest';

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
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
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
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class PointContent {
  openState = false;
  point: {
    x: number;
    y: number;
  } | null = null;
}

describe('ClrPopover', () => {
  describe('Directive', () => {
    describe('ClrPopoverContent', () => {
      let testContext: Context;
      beforeEach(() => {
        testContext = {} as Context;
      });

      type Context = TestContext<ClrPopoverContent, SimpleContent> & {
        testComponent: SimpleContent;
        clarityDirective: ClrPopoverModuleNext;
        popoverService: ClrPopoverService;
        changeDetectorRef: ChangeDetectorRef;
      };

      beforeEach(() => {
        /*
         * The ClrPopoverContent element is a template and not rendered in the DOM,
         * This test is reliant on the @ViewChild in the test component.
         * the spec() helper wasn't working out of the box here.
         */
        TestBed.configureTestingModule({
          imports: [ClrPopoverModuleNext],
          declarations: [SimpleContent],
        });
        testContext.fixture = TestBed.createComponent(SimpleContent);
        testContext.fixture.detectChanges();
        testContext.testComponent = testContext.fixture.componentInstance;
        testContext.clarityDirective = testContext.fixture.componentInstance.content;
        testContext.changeDetectorRef = testContext.fixture.debugElement.injector.get(ChangeDetectorRef);
        testContext.popoverService = testContext.fixture.debugElement.injector.get(ClrPopoverService);
      });

      describe('Providers', () => {
        it('declares a Popover Service', () => {
          expect(testContext.popoverService).toBeDefined();
        });
      });

      describe('TypeScript API', () => {
        it('responds to openChange events from the popoverService', () => {
          testContext.testComponent.openState = true; // Add content to the DOM
          testContext.fixture.detectChanges();
          let content = document.body.querySelectorAll('div.clr-popover-content');
          // Popovers are not getting cleaned up here.
          expect(content.length).toBe(1);
          expect(content[0].textContent.trim()).toBe('Popover content');

          testContext.testComponent.openState = false; // Remove content from the DOM
          testContext.fixture.detectChanges();
          content = document.body.querySelectorAll('div.clr-popover-content');
          expect(content.length).toBe(0);
        });
      });

      describe('Template API', () => {
        it('binds to [clrPopoverContent] open state', () => {
          expect(testContext.testComponent.openState).toBe(testContext.popoverService.open);
          testContext.testComponent.openState = undefined;
          expect(testContext.popoverService.open).toBe(false);
          testContext.testComponent.openState = false;
          expect(testContext.popoverService.open).toBe(false);
        });

        it('binds to [clrPopoverContentAt] position', () => {
          expect(testContext.testComponent.popoverPosition).toEqual(
            testContext.testComponent.content.contentAt as ClrPopoverPosition
          );
          const newPosition = ClrPopoverPosition.TOP_RIGHT;
          testContext.testComponent.popoverPosition = newPosition;
          testContext.fixture.detectChanges();
          expect(testContext.testComponent.content.contentAt as ClrPopoverPosition).toEqual(newPosition);
        });

        it('binds to [clrPopoverContentOutsideClickToClose]', () => {
          expect(testContext.testComponent.content.outsideClickClose).toBe(true);
          testContext.testComponent.closeClick = false;
          testContext.fixture.detectChanges();
          expect(testContext.testComponent.content.outsideClickClose).toBe(false);
        });

        it('binds to [clrPopoverContentScrollToClose]', () => {
          expect(testContext.testComponent.closeScroll).toBe(testContext.testComponent.content.scrollToClose);
          testContext.testComponent.closeScroll = false;
          testContext.fixture.detectChanges();
          expect(testContext.testComponent.content.scrollToClose).toBe(false);
        });
      });

      describe('View Basics', () => {
        it('adds top and left style to the content container when content is open', () => {
          testContext.testComponent.openState = true; // Add content to the DOM
          testContext.fixture.detectChanges();
          const content: HTMLCollectionOf<Element> = document.body.getElementsByClassName('clr-popover-content');
          const testElement = content[0] as HTMLElement;
          expect(testElement.parentElement.style.top).toMatch(/\d+px/);
          expect(testElement.parentElement.style.left).toMatch(/\d+px/);
        });

        it('does not fail when the popup view is immediately destroyed', async () => {
          vi.spyOn(testContext.fixture, 'detectChanges').mockImplementation(() => undefined);
          testContext.testComponent.openState = true;
          testContext.fixture.detectChanges();
          testContext.testComponent.openState = false;
          testContext.fixture.detectChanges();

          expect(testContext.fixture.detectChanges).not.toThrow();
        });
      });

      describe('getScrollableParents', () => {
        let cleanupFns: (() => void)[];

        beforeEach(() => {
          cleanupFns = [];
        });

        afterEach(() => {
          cleanupFns.forEach(cleanup => cleanup());
        });

        it('does not throw when the origin lives inside a ShadowRoot belonging to a foreign document realm', () => {
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
            (testContext.clarityDirective as any).getScrollableParents(trigger);
          }).not.toThrow();
        });

        it('does not throw when the ancestor chain passes through a plain (non-shadow) DocumentFragment', () => {
          // Second distinct trigger for the same reported TypeError, independent of realms:
          // a detached subtree rooted in a DocumentFragment. `instanceof ShadowRoot` is false
          // for a plain fragment (it shares ShadowRoot's nodeType but has no `host`), so the
          // pre-fix walk fell straight through to getComputedStyle(fragment) and threw.
          const fragment = document.createDocumentFragment();
          const wrapper = document.createElement('div');
          fragment.appendChild(wrapper);
          const trigger = document.createElement('button');
          wrapper.appendChild(trigger);

          expect(() => {
            (testContext.clarityDirective as any).getScrollableParents(trigger);
          }).not.toThrow();
        });

        it('discovers scrollable containers both inside the iframe and beyond it in the main document', () => {
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

          const scrollableParents: unknown[] = (testContext.clarityDirective as any).getScrollableParents(trigger);

          expect(scrollableParents).toContain(document);
          expect(scrollableParents).toContain(iframeDoc);
          expect(scrollableParents).toContain(innerScrollable);
          expect(scrollableParents).toContain(outerScrollable);
        });
      });

      describe('closing when the origin leaves the screen', () => {
        const viewport = { width: 1280, height: 720 } as DOMRectReadOnly;
        const collapsedViewport = { width: 1, height: 1 } as DOMRectReadOnly;

        let observerCallback: IntersectionObserverCallback;
        let observerOptions: IntersectionObserverInit;
        let originalIntersectionObserver: typeof IntersectionObserver;

        // Delivers one callback with an entry per given visible ratio of the origin. isIntersecting
        // mirrors what Chromium reports for a single 0.8 threshold.
        function notify(visibleRatios: number[], rootBounds = viewport) {
          observerCallback(
            visibleRatios.map(
              intersectionRatio =>
                ({
                  intersectionRatio,
                  isIntersecting: intersectionRatio >= 0.8,
                  rootBounds,
                }) as IntersectionObserverEntry
            ),
            null
          );
        }

        beforeEach(() => {
          originalIntersectionObserver = window.IntersectionObserver;
          window.IntersectionObserver = class {
            constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit) {
              observerCallback = callback;
              observerOptions = options;
            }
            observe() {
              // entries are delivered manually through notify()
            }
            disconnect() {
              // nothing to clean up
            }
          } as unknown as typeof IntersectionObserver;

          testContext.testComponent.openState = true;
          testContext.fixture.detectChanges();
        });

        afterEach(() => {
          window.IntersectionObserver = originalIntersectionObserver;
        });

        it('closes once a visible origin drops below 80% visible', () => {
          notify([1]);
          expect(testContext.popoverService.open).toBe(true);

          notify([0.7]);
          expect(testContext.popoverService.open).toBe(false);
        });

        it('closes right away when the origin is completely hidden at open', () => {
          notify([0]);

          expect(testContext.popoverService.open).toBe(false);
        });

        it('stays open for a partially visible origin until it is completely out of view', () => {
          // An origin clipped below 80% when the popover opens (e.g. horizontally on a narrow
          // screen) used to close the popover immediately. It must stay open, and still close
          // once the origin is scrolled out of view - which the 0 threshold reports.
          expect(observerOptions.threshold).toContain(0);

          notify([0.5]);
          expect(testContext.popoverService.open).toBe(true);

          notify([0]);
          expect(testContext.popoverService.open).toBe(false);
        });

        it('closes an origin that was partially visible at open only once it is completely out of view', () => {
          // Only an origin that is fully visible when the popover opens uses the 80% rule.
          notify([0.9]);

          notify([0.7]);
          expect(testContext.popoverService.open).toBe(true);

          notify([0]);
          expect(testContext.popoverService.open).toBe(false);
        });

        it('ignores entries reported against a collapsed viewport', () => {
          // Regression: the cause of the flaky popover visual snapshots. While Playwright captures a
          // screenshot of an element taller than the viewport, it briefly resizes the window to 1x1,
          // and the observer reports the origin as not intersecting in between.
          notify([1]);

          notify([0], collapsedViewport);

          expect(testContext.popoverService.open).toBe(true);
        });

        it('treats an empty viewport (display: none origin) as hidden, not as a collapsed viewport', () => {
          notify([1]);

          notify([0], { width: 0, height: 0 } as DOMRectReadOnly);

          expect(testContext.popoverService.open).toBe(false);
        });

        it('still closes when the viewport bounds are not reported (cross-origin iframe)', () => {
          notify([1], null);

          notify([0], null);

          expect(testContext.popoverService.open).toBe(false);
        });

        it('handles every entry of a batched callback', () => {
          notify([1]);

          // a collapsed-viewport entry batched with the recovering one is still ignored
          observerCallback(
            [
              { intersectionRatio: 0, isIntersecting: false, rootBounds: collapsedViewport },
              { intersectionRatio: 1, isIntersecting: true, rootBounds: viewport },
            ] as IntersectionObserverEntry[],
            null
          );
          expect(testContext.popoverService.open).toBe(true);

          // the origin dropped below 80% at some point, even if it is back by the time of the callback
          notify([0.7, 1]);
          expect(testContext.popoverService.open).toBe(false);
        });
      });

      describe('closing when the origin leaves the screen (real IntersectionObserver)', () => {
        let spacer: HTMLElement;

        // IntersectionObserver delivers entries asynchronously, after layout.
        async function nextFrames() {
          for (let i = 0; i < 3; i++) {
            await new Promise(resolve => requestAnimationFrame(resolve));
          }
        }

        beforeEach(() => {
          spacer = document.createElement('div');
          spacer.style.height = '10000px';
          document.body.appendChild(spacer);

          // isolate the observer from the scrollToClose scroll listener
          testContext.testComponent.closeScroll = false;
        });

        afterEach(() => {
          spacer.remove();
          window.scrollTo(0, 0);
        });

        it('closes when the origin is scrolled out of view', async () => {
          testContext.testComponent.openState = true;
          testContext.fixture.detectChanges();
          await nextFrames();
          expect(testContext.popoverService.open).toBe(true);

          const origin = testContext.popoverService.originElement.nativeElement as HTMLElement;
          window.scrollTo(0, window.scrollY + origin.getBoundingClientRect().bottom + window.innerHeight);
          await nextFrames();

          expect(testContext.popoverService.open).toBe(false);
        });

        it('closes when a visible origin is scrolled to less than 80% visible', async () => {
          // With a 0 threshold in the list, the browser reports isIntersecting: true for any partially
          // visible origin, so closing must be decided on intersectionRatio instead.
          testContext.testComponent.openState = true;
          testContext.fixture.detectChanges();
          await nextFrames();
          expect(testContext.popoverService.open).toBe(true);

          const origin = testContext.popoverService.originElement.nativeElement as HTMLElement;
          const rect = origin.getBoundingClientRect();
          // scroll the top 40% of the origin above the viewport - 60% stays visible
          window.scrollTo(0, window.scrollY + rect.top + rect.height * 0.4);
          await nextFrames();

          expect(testContext.popoverService.open).toBe(false);
        });

        it('opens with a partially clipped origin and closes once it is scrolled out of view', async () => {
          // the origin button is wider than its clipping container, so it is never 80% visible
          const host = testContext.fixture.nativeElement as HTMLElement;
          host.style.display = 'block';
          host.style.width = '30px';
          host.style.overflow = 'hidden';

          testContext.testComponent.openState = true;
          testContext.fixture.detectChanges();
          await nextFrames();
          expect(testContext.popoverService.open).toBe(true);

          const origin = testContext.popoverService.originElement.nativeElement as HTMLElement;
          window.scrollTo(0, window.scrollY + origin.getBoundingClientRect().bottom + window.innerHeight);
          await nextFrames();

          expect(testContext.popoverService.open).toBe(false);
        });

        it('closes when the origin is hidden with display: none while open', async () => {
          testContext.testComponent.openState = true;
          testContext.fixture.detectChanges();
          await nextFrames();
          expect(testContext.popoverService.open).toBe(true);

          const host = testContext.fixture.nativeElement as HTMLElement;
          host.style.display = 'none';
          await nextFrames();

          expect(testContext.popoverService.open).toBe(false);
          host.style.display = '';
        });

        it('closes right away when the origin is hidden at open', async () => {
          const host = testContext.fixture.nativeElement as HTMLElement;
          host.style.display = 'none';

          testContext.testComponent.openState = true;
          testContext.fixture.detectChanges();
          await nextFrames();

          expect(testContext.popoverService.open).toBe(false);
          host.style.display = '';
        });
      });

      describe('outside click toggle-button detection', () => {
        it('does not throw when openEvent.target is null, and does not treat the click as a toggle re-click', () => {
          // Regression: found via a real production repro where clicking outside a popover
          // did nothing at all. openEvent.target can be null (e.g. the original toggle
          // button was removed from the DOM, or the event was constructed without one), and
          // `(openEvent.target as Element).contains(...)` used to run unguarded - throwing
          // before closePopover() ever got a chance to run, so outside clicks silently died.
          const openEvent = new MouseEvent('click');
          Object.defineProperty(openEvent, 'target', { value: null });
          testContext.popoverService.openEvent = openEvent;
          testContext.testComponent.closeClick = false;
          testContext.testComponent.openState = true;
          testContext.fixture.detectChanges();

          expect(() => {
            (testContext.clarityDirective as any).handleOutsideClick(new MouseEvent('click'));
          }).not.toThrow();

          // outsideClickToClose is false and the click can't be verified as the toggle
          // button (openEvent.target is null), so it correctly stays open rather than crash.
          expect(testContext.popoverService.open).toBe(true);
        });

        it('ignores the very event that opened the popover instead of closing on it', () => {
          // Regression: in an ESM micro-frontend plugin (trigger inside a ShadowRoot, its own
          // CDK instance) the overlay can already be attached when CDK's capture-phase
          // outside-click dispatcher sees the opening click, so that same click is delivered
          // straight back as an "outside" click and closes the popover ~2ms after it opened -
          // the popover appears never to open at all, with no console error.
          const trigger = document.createElement('button');
          document.body.appendChild(trigger);

          const openEvent = new MouseEvent('click', { bubbles: true });
          trigger.dispatchEvent(openEvent);

          testContext.popoverService.origin = new ElementRef(trigger);
          testContext.popoverService.openEvent = openEvent;
          testContext.testComponent.openState = true;
          testContext.fixture.detectChanges();

          expect(testContext.popoverService.open).toBe(true);

          // Re-delivering the *same* Event instance must be ignored entirely.
          (testContext.clarityDirective as any).handleOutsideClick(openEvent);

          expect(testContext.popoverService.open).toBe(true);

          // A genuinely different click still closes it, so toggle/outside-click is intact.
          (testContext.clarityDirective as any).handleOutsideClick(new MouseEvent('click', { bubbles: true }));

          expect(testContext.popoverService.open).toBe(false);

          trigger.remove();
        });
      });

      describe('outside click for cross-window origins', () => {
        let iframe: HTMLIFrameElement;
        let iframeDoc: Document;
        let trigger: HTMLButtonElement;

        beforeEach(() => {
          iframe = document.createElement('iframe');
          document.body.appendChild(iframe);
          iframeDoc = iframe.contentDocument;
          iframeDoc.open();
          iframeDoc.write('<!DOCTYPE html><html><body></body></html>');
          iframeDoc.close();
          trigger = iframeDoc.createElement('button');
          iframeDoc.body.appendChild(trigger);
        });

        afterEach(() => {
          iframe.remove();
        });

        // Counts the capture-phase click listeners this directive registers on an origin's
        // own document (see createCrossWindowOutsideClickSubscription). CDK's own dispatcher
        // listens on <body>, not the document, so it isn't picked up here.
        function countCaptureClickListeners(spy: Mock): number {
          return vi
            .mocked(spy)
            .mock.calls.filter(
              args => (args[0] === 'click' || args[0] === 'auxclick') && (args[2] as any)?.capture === true
            ).length;
        }

        it('registers capture-phase listeners on the origin document for a cross-window origin', () => {
          // Positive control for the same-window assertion below - proves the counter can
          // actually observe the listeners when they are registered.
          const iframeDocSpy = vi.spyOn(iframeDoc, 'addEventListener');

          testContext.popoverService.origin = new ElementRef(trigger);
          testContext.testComponent.openState = true;
          testContext.fixture.detectChanges();

          expect(countCaptureClickListeners(iframeDocSpy)).toBeGreaterThan(0);
        });

        it('registers no cross-window listeners at all for a same-window origin', () => {
          // The "only iframe-hosted origins pay for cross-window handling" contract: a
          // normal popover must behave exactly as it did before any of this existed.
          const sameWindowTrigger = document.createElement('button');
          document.body.appendChild(sameWindowTrigger);

          const mainDocSpy = vi.spyOn(document, 'addEventListener');

          testContext.popoverService.origin = new ElementRef(sameWindowTrigger);
          testContext.testComponent.openState = true;
          testContext.fixture.detectChanges();

          expect(countCaptureClickListeners(mainDocSpy)).toBe(0);

          sameWindowTrigger.remove();
        });

        it('closes the popover on a click dispatched inside the foreign-realm document CDK cannot see', () => {
          // CDK's outsidePointerEvents() only listens on this window's document, so a click
          // inside the origin's own iframe document would otherwise never close the popover.
          testContext.popoverService.origin = new ElementRef(trigger);
          testContext.testComponent.openState = true;
          testContext.fixture.detectChanges();

          expect(testContext.popoverService.open).toBe(true);

          iframeDoc.dispatchEvent(new Event('click', { bubbles: true }));

          expect(testContext.popoverService.open).toBe(false);
        });

        it('does not let a toggle re-click on a cross-window trigger reopen the popover', () => {
          // Regression test: a bubble-phase or pointerdown-based listener can't suppress
          // the trigger's own click handler, so a re-click would close then immediately
          // reopen the popover. The capture-phase listener must stopPropagation() before
          // the trigger's own handler ever runs.
          testContext.popoverService.origin = new ElementRef(trigger);

          let toggleCount = 0;
          const toggleListener = (event: Event) => {
            toggleCount++;
            testContext.popoverService.toggleWithEvent(event);
          };
          trigger.addEventListener('click', toggleListener);

          // First click opens the popover, mimicking ClrDropdownTrigger's own click handler.
          trigger.click();
          testContext.fixture.detectChanges();
          expect(testContext.popoverService.open).toBe(true);
          expect(toggleCount).toBe(1);

          // Second click (the re-click) must close it via the capture-phase listener
          // without ever letting the trigger's own click handler run.
          trigger.click();
          testContext.fixture.detectChanges();

          expect(testContext.popoverService.open).toBe(false);
          expect(toggleCount).toBe(1);

          trigger.removeEventListener('click', toggleListener);
        });
      });

      describe('escape key for cross-window origins', () => {
        let iframe: HTMLIFrameElement;
        let iframeDoc: Document;
        let trigger: HTMLButtonElement;

        beforeEach(() => {
          iframe = document.createElement('iframe');
          document.body.appendChild(iframe);
          iframeDoc = iframe.contentDocument;
          iframeDoc.open();
          iframeDoc.write('<!DOCTYPE html><html><body></body></html>');
          iframeDoc.close();
          trigger = iframeDoc.createElement('button');
          iframeDoc.body.appendChild(trigger);
        });

        afterEach(() => {
          iframe.remove();
        });

        it('closes the popover on Escape dispatched inside the foreign-realm document CDK cannot see', () => {
          // CDK's OverlayKeyboardDispatcher listens for keydown on this window's
          // document.body only (see createEscapeSubscription), so a keydown fired inside
          // the origin's own iframe document - e.g. because focus never left that document
          // - would otherwise never reach it.
          testContext.popoverService.origin = new ElementRef(trigger);
          testContext.testComponent.openState = true;
          testContext.fixture.detectChanges();

          expect(testContext.popoverService.open).toBe(true);

          iframeDoc.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

          expect(testContext.popoverService.open).toBe(false);
        });

        it('ignores Escape with a modifier key held', () => {
          testContext.popoverService.origin = new ElementRef(trigger);
          testContext.testComponent.openState = true;
          testContext.fixture.detectChanges();

          iframeDoc.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', altKey: true, bubbles: true }));

          expect(testContext.popoverService.open).toBe(true);
        });

        it('registers no cross-window keydown listener for a same-window origin', () => {
          const sameWindowTrigger = document.createElement('button');
          document.body.appendChild(sameWindowTrigger);

          const mainDocSpy = vi.spyOn(document, 'addEventListener');

          testContext.popoverService.origin = new ElementRef(sameWindowTrigger);
          testContext.testComponent.openState = true;
          testContext.fixture.detectChanges();

          expect(vi.mocked(mainDocSpy).mock.calls.some(args => args[0] === 'keydown')).toBe(false);

          sameWindowTrigger.remove();
        });
      });

      describe('positioning for cross-window origins', () => {
        it('anchors the overlay to the resolved cross-window position, not the raw iframe-relative rect', () => {
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

          testContext.popoverService.origin = new ElementRef(trigger);
          testContext.testComponent.openState = true;
          testContext.fixture.detectChanges();

          // CDK 21's native-popover-mode overlay doesn't expose the resolved position via
          // plain top/left CSS (it uses a full-viewport bounding box plus internal
          // anchoring), so read the position strategy's own resolved origin directly -
          // the same field _getOriginRect() reads from.
          const overlayRef = (testContext.clarityDirective as any).overlayRef;
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

    describe('Point-based positioning', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrPopoverModuleNext],
          declarations: [PointContent],
        });
      });

      it('opens a popover at a specific point origin', async () => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
        const fixture = TestBed.createComponent(PointContent);
        fixture.detectChanges();

        const popoverService = fixture.debugElement.injector.get(ClrPopoverService);
        const point = { x: 150, y: 250 };
        fixture.componentInstance.point = point;
        fixture.componentInstance.openState = true;
        fixture.detectChanges();
        await vi.advanceTimersByTimeAsync(0);

        const content = document.body.querySelectorAll('div.clr-popover-content');
        expect(content.length).toBe(1);
        expect(content[0].textContent.trim()).toBe('Point popover content');
        expect(popoverService.originPoint).toEqual(point);

        fixture.componentInstance.openState = false;
        fixture.detectChanges();
        await vi.advanceTimersByTimeAsync(0);

        fixture.destroy();
      });

      it('opens via popoverService.openAtPoint without errors', async () => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
        const fixture = TestBed.createComponent(PointContent);
        fixture.detectChanges();

        const popoverService = fixture.debugElement.injector.get(ClrPopoverService);
        const point = { x: 300, y: 100 };

        fixture.componentInstance.point = point;
        popoverService.openAtPoint(point);
        fixture.componentInstance.openState = true;
        fixture.detectChanges();
        await vi.advanceTimersByTimeAsync(0);

        const content = document.body.querySelectorAll('div.clr-popover-content');
        expect(content.length).toBe(1);

        popoverService.open = false;
        fixture.detectChanges();
        await vi.advanceTimersByTimeAsync(0);

        expect(popoverService.open).toBe(false);

        fixture.destroy();
      });
    });

    describe('outside click for cross-window point-based origins', () => {
      let iframe: HTMLIFrameElement;
      let iframeDoc: Document;
      let trigger: HTMLButtonElement;
      let fixture: ComponentFixture<PointContent>;
      let popoverService: ClrPopoverService;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrPopoverModuleNext],
          declarations: [PointContent],
        });

        iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        iframeDoc = iframe.contentDocument;
        iframeDoc.open();
        iframeDoc.write('<!DOCTYPE html><html><body></body></html>');
        iframeDoc.close();
        trigger = iframeDoc.createElement('button');
        iframeDoc.body.appendChild(trigger);

        fixture = TestBed.createComponent(PointContent);
        fixture.detectChanges();
        popoverService = fixture.debugElement.injector.get(ClrPopoverService);
      });

      afterEach(() => {
        iframe.remove();
        fixture.destroy();
      });

      it('closes a point-based popover on a click dispatched inside the foreign-realm document CDK cannot see', async () => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
        // Mirrors the element-based cross-window outside-click fix: pointTargetElement
        // (the right-clicked element a context menu is anchored to) can itself live
        // inside a foreign iframe document, invisible to CDK's outsidePointerEvents().
        popoverService.openAtPoint({ x: 10, y: 10 }, trigger);
        fixture.detectChanges();
        await vi.advanceTimersByTimeAsync(500);

        expect(popoverService.open).toBe(true);

        iframeDoc.dispatchEvent(new Event('click', { bubbles: true }));

        expect(popoverService.open).toBe(false);
      });
    });
  });
});

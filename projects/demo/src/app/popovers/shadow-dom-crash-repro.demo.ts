/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { ClarityModule, ClrDropdown, ClrPopoverService } from '@clr/angular';
import { Subscription } from 'rxjs';

/**
 * Manual repro for CDE-3155: ClrPopoverService.getScrollableParents crashes with
 * "getComputedStyle: parameter 1 is not of type 'Element'" when the popover trigger's
 * ShadowRoot ancestry belongs to a different JS realm (e.g. an iframe hosting a
 * micro-frontend / Web Component), because `instanceof HTMLHtmlElement` fails across
 * realms and the ancestor walk falls through to the foreign Document.
 *
 * Clicking "Relocate" physically moves the dropdown (trigger + menu, still driven by the
 * very same live Angular component instance) into a native ShadowRoot hosted inside a
 * same-origin iframe, which is a genuinely separate window/document realm. Clicking the
 * relocated trigger afterwards exercises the exact code path from the ticket. The overlay
 * still anchors correctly with no demo-side workaround needed: ClrPopoverContent detects
 * a cross-window origin itself and corrects for it (see resolveCrossWindowOrigin()).
 *
 * The relocated dropdown only looks correct once Clarity's stylesheets are cloned into
 * the ShadowRoot below, since native ShadowRoots never inherit page-level stylesheets.
 *
 * getScrollableParents() walks the trigger's ancestors realm-safely (see its doc comment
 * in popover-content.ts), continuing across the iframe boundary instead of stopping at
 * it, so scrolling either the iframe's own internal scroll container or the main page
 * (Clarity's .content-area) correctly repositions/closes the popover, same as any
 * same-window trigger - no polling workaround needed here.
 *
 * Two popover consumers are relocated side by side to also demonstrate that per-consumer
 * scroll behavior survives the cross-realm rewrite: ClrDropdown opts into
 * `scrollToClose`, so scrolling closes it, while ClrSignpost leaves it at its default of
 * `false`, so scrolling repositions the signpost content and keeps it open.
 */
@Component({
  selector: 'clr-shadow-dom-crash-repro-demo',
  standalone: true,
  imports: [ClarityModule],
  styleUrls: ['./popovers.demo.scss'],
  template: `
    <h4>Popover trigger inside a cross-realm ShadowRoot</h4>
    <p>
      1. Click "Relocate Triggers" to move both widgets below into a <code>ShadowRoot</code> hosted inside an iframe (a
      separate JS realm), mirroring a micro-frontend/Web Component architecture.<br />
      2. Click a relocated trigger inside the dashed box. Watch for the error banner (bug present) vs. a normally
      opening popover with no banner (bug fixed).<br />
      3. With a popover open, scroll either the dashed box's own inner content or the rest of this page. The dropdown
      closes on scroll (it opts into <code>scrollToClose</code>); the signpost instead tracks the trigger and stays
      open, since it leaves <code>scrollToClose</code> at its default of <code>false</code> - both behaviors should be
      unchanged by relocating into the cross-realm ShadowRoot.
    </p>

    <div #reproContainer>
      <clr-dropdown #dropdown>
        <button class="btn btn-outline" type="button" clrDropdownTrigger>Dropdown Trigger</button>
        <clr-dropdown-menu>
          <button type="button" clrDropdownItem>Action One</button>
          <button type="button" clrDropdownItem>Action Two</button>
        </clr-dropdown-menu>
      </clr-dropdown>

      <clr-signpost #signpost>
        <clr-signpost-content [clrPosition]="'right-middle'">
          Signpost content stays open and repositions while you scroll.
        </clr-signpost-content>
      </clr-signpost>
    </div>

    <iframe #hostFrame class="shadow-realm-frame" title="Cross-realm ShadowRoot host"></iframe>

    <div class="repro-actions">
      <button class="btn btn-outline" type="button" (click)="relocateIntoShadowRealm()" [disabled]="relocated">
        Relocate Triggers
      </button>
    </div>

    <!--
      Always rendered (never added/removed via @if) with a fixed min-height, so appearing
      status text never shifts the page layout - a layout shift here would itself trigger
      a scroll of Clarity's own .content-area, which can close the open popover.
    -->
    <div
      class="repro-status"
      [class.repro-status-error]="errorMessage"
      [class.repro-status-success]="!errorMessage && (dropdownOpened || signpostOpened)"
    >
      @if (errorMessage) {
        <cds-icon shape="exclamation-circle"></cds-icon>
        <span>Reproduced crash: {{ errorMessage }}</span>
      } @else if (dropdownOpened) {
        <cds-icon shape="check-circle"></cds-icon>
        <span>Dropdown opened with no errors. Fix is working.</span>
      } @else if (signpostOpened) {
        <cds-icon shape="check-circle"></cds-icon>
        <span>Signpost opened with no errors. Fix is working.</span>
      }
    </div>
  `,
})
export class ShadowDomCrashReproDemo implements AfterViewInit, OnDestroy {
  @ViewChild('hostFrame', { static: true }) hostFrame: ElementRef<HTMLIFrameElement>;
  @ViewChild('reproContainer', { static: true }) reproContainer: ElementRef<HTMLElement>;
  @ViewChild('dropdown', { static: true }) dropdown: ClrDropdown;
  @ViewChild('signpost', { static: true, read: ClrPopoverService }) signpostPopoverService: ClrPopoverService;

  relocated = false;
  dropdownOpened = false;
  signpostOpened = false;
  errorMessage: string | null = null;

  private subscriptions: Subscription[] = [];

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    // window 'error' events never fire here: zone.js intercepts the thrown error and
    // routes it to Angular's default ErrorHandler (console.error), it never becomes a
    // real uncaught exception. NgZone.onError is the same signal Angular's own error
    // handling pipeline listens to, so it reliably observes the crash too.
    this.subscriptions.push(
      this.ngZone.onError.subscribe((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        if (this.relocated && message.includes('getComputedStyle')) {
          this.errorMessage = message;
        }
      })
    );

    this.subscriptions.push(
      this.dropdown.popoverService.openChange.subscribe(open => this.trackOpenState(open, 'dropdownOpened'))
    );
    this.subscriptions.push(
      this.signpostPopoverService.openChange.subscribe(open => this.trackOpenState(open, 'signpostOpened'))
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  relocateIntoShadowRealm() {
    const iframe = this.hostFrame.nativeElement;
    const iframeDoc = iframe.contentDocument;
    iframeDoc.open();
    iframeDoc.write(`<!DOCTYPE html><html><head></head><body style="margin:0">
      <div id="scroll-container" style="height:165px; overflow-y:auto;">
        <div style="height:200px; padding:8px; font-family:sans-serif; color:#666;">
          Scroll down to reach the trigger&hellip;
        </div>
        <div id="shadow-host"></div>
        <div style="height:200px; padding:8px; font-family:sans-serif; color:#666;">
          More content below the trigger.
        </div>
      </div>
    </body></html>`);
    iframeDoc.close();

    const shadowHost = iframeDoc.getElementById('shadow-host');
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

    // Native ShadowRoots never inherit page-level stylesheets, so clone the ones
    // already driving this dropdown's appearance (Clarity's CSS plus this component's
    // own emulated-encapsulation styles) directly into the shadow root.
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => {
      shadowRoot.appendChild(node.cloneNode(true));
    });

    // Moving this container across documents implicitly adopts it into the iframe's
    // realm, while the Angular component instances driving it keep working unchanged.
    // No positioning workaround needed here: ClrPopoverContent detects the cross-window
    // origin on its own and corrects for it.
    shadowRoot.appendChild(this.reproContainer.nativeElement);

    this.relocated = true;
    this.errorMessage = null;
    this.dropdownOpened = false;
    this.signpostOpened = false;
  }

  private trackOpenState(open: boolean, flag: 'dropdownOpened' | 'signpostOpened') {
    if (!open) {
      this[flag] = false;
      return;
    }

    // popoverService.open flips synchronously on click, before the crash-prone
    // getScrollableParents() call runs (it's deferred inside a setTimeout in
    // showOverlay()). Wait for that to have a chance to throw before declaring success.
    setTimeout(() => {
      if (!this.errorMessage) {
        this[flag] = true;
      }
    }, 50);
  }
}

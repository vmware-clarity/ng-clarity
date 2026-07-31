/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { ClarityModule, ClrDropdown } from '@clr/angular';
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
 */
@Component({
  selector: 'clr-shadow-dom-crash-repro-demo',
  standalone: true,
  imports: [ClarityModule],
  styleUrls: ['./popovers.demo.scss'],
  template: `
    <h4>Popover trigger inside a cross-realm ShadowRoot</h4>
    <p>
      1. Click "Relocate Trigger" to move the dropdown below into a <code>ShadowRoot</code> hosted inside an iframe (a
      separate JS realm), mirroring a micro-frontend/Web Component architecture.<br />
      2. Click the relocated dropdown trigger inside the dashed box. Watch for the error banner (bug present) vs. a
      normally opening menu with no banner (bug fixed).
    </p>

    <button class="btn btn-outline" type="button" (click)="relocateIntoShadowRealm()" [disabled]="relocated">
      Relocate Trigger
    </button>

    @if (errorMessage) {
      <div class="alert alert-danger" role="alert">
        <div class="alert-items">
          <div class="alert-item static">
            <div class="alert-icon-wrapper">
              <cds-icon class="alert-icon" shape="exclamation-circle"></cds-icon>
            </div>
            <span class="alert-text">Reproduced crash: {{ errorMessage }}</span>
          </div>
        </div>
      </div>
    } @else if (dropdownOpened) {
      <div class="alert alert-success" role="alert">
        <div class="alert-items">
          <div class="alert-item static">
            <div class="alert-icon-wrapper">
              <cds-icon class="alert-icon" shape="check-circle"></cds-icon>
            </div>
            <span class="alert-text">Dropdown opened with no errors. Fix is working.</span>
          </div>
        </div>
      </div>
    }

    <iframe #hostFrame class="shadow-realm-frame" title="Cross-realm ShadowRoot host"></iframe>

    <div #dropdownContainer>
      <clr-dropdown #dropdown>
        <button type="button" clrDropdownTrigger>Dropdown Trigger</button>
        <clr-dropdown-menu>
          <button type="button" clrDropdownItem>Action One</button>
          <button type="button" clrDropdownItem>Action Two</button>
        </clr-dropdown-menu>
      </clr-dropdown>
    </div>
  `,
})
export class ShadowDomCrashReproDemo implements AfterViewInit, OnDestroy {
  @ViewChild('hostFrame', { static: true }) hostFrame: ElementRef<HTMLIFrameElement>;
  @ViewChild('dropdownContainer', { static: true }) dropdownContainer: ElementRef<HTMLElement>;
  @ViewChild('dropdown', { static: true }) dropdown: ClrDropdown;

  relocated = false;
  dropdownOpened = false;
  errorMessage: string | null = null;

  private openSubscription: Subscription;
  private errorSubscription: Subscription;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    // window 'error' events never fire here: zone.js intercepts the thrown error and
    // routes it to Angular's default ErrorHandler (console.error), it never becomes a
    // real uncaught exception. NgZone.onError is the same signal Angular's own error
    // handling pipeline listens to, so it reliably observes the crash too.
    this.errorSubscription = this.ngZone.onError.subscribe((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      if (this.relocated && message.includes('getComputedStyle')) {
        this.errorMessage = message;
      }
    });

    this.openSubscription = this.dropdown.popoverService.openChange.subscribe(open => {
      if (!open) {
        this.dropdownOpened = false;
        return;
      }

      // popoverService.open flips synchronously on click, before the crash-prone
      // getScrollableParents() call runs (it's deferred inside a setTimeout in
      // showOverlay()). Wait for that to have a chance to throw before declaring success.
      setTimeout(() => {
        if (!this.errorMessage) {
          this.dropdownOpened = true;
        }
      }, 50);
    });
  }

  ngOnDestroy() {
    this.openSubscription?.unsubscribe();
    this.errorSubscription?.unsubscribe();
  }

  relocateIntoShadowRealm() {
    const iframe = this.hostFrame.nativeElement;
    const iframeDoc = iframe.contentDocument;
    iframeDoc.open();
    iframeDoc.write('<!DOCTYPE html><html><head></head><body style="margin:8px"></body></html>');
    iframeDoc.close();

    const shadowHost = iframeDoc.createElement('div');
    iframeDoc.body.appendChild(shadowHost);
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

    // Native ShadowRoots never inherit page-level stylesheets, so clone the ones
    // already driving this dropdown's appearance (Clarity's CSS plus this component's
    // own emulated-encapsulation styles) directly into the shadow root.
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => {
      shadowRoot.appendChild(node.cloneNode(true));
    });

    // Moving this container across documents implicitly adopts it into the iframe's
    // realm, while the Angular component instance driving it keeps working unchanged.
    // No positioning workaround needed here: ClrPopoverContent detects the cross-window
    // origin on its own and corrects for it.
    shadowRoot.appendChild(this.dropdownContainer.nativeElement);

    this.relocated = true;
    this.errorMessage = null;
    this.dropdownOpened = false;
  }
}

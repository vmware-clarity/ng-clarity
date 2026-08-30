/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { hasModifierKey } from '@angular/cdk/keycodes';
import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategyOrigin,
  Overlay,
  OverlayConfig,
  OverlayContainer,
  OverlayRef,
} from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  PLATFORM_ID,
  SkipSelf,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Keys } from '@clr/angular/utils';
import { fromEvent, merge, Subscription, switchMap, timer } from 'rxjs';

import { ClrPopoverService } from './providers/popover.service';
import { getCrossWindowOriginContext, resolveCrossWindowOrigin } from './utils/cross-window-origin';
import { getFrameElement, isElementOrShadowRoot, isHtmlElement, isShadowRoot } from './utils/dom-realm';
import {
  ClrPopoverPosition,
  ClrPopoverType,
  getConnectedPositions,
  mapPopoverKeyToPosition,
} from './utils/popover-positions';

/** @dynamic */
@Directive({
  selector: '[clrPopoverContent]',
})
export class ClrPopoverContent implements OnDestroy, AfterViewInit {
  private _outsideClickClose = true;
  private _scrollToClose = false;
  private view: EmbeddedViewRef<void>;
  private elementRef: ElementRef;
  private overlayRef: OverlayRef;
  private popoverType: ClrPopoverType = ClrPopoverType.DEFAULT;
  private _availablePositions: ConnectedPosition[] = [];
  private _position = ClrPopoverPosition.BOTTOM_LEFT;

  private subscriptions: Subscription[] = [];
  private openCloseSubscription: Subscription;
  private domPortal: DomPortal;
  private preferredPositionIsSet = false;
  private availablePositionsAreSet = false;
  private _preferredPosition: ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
    panelClass: ClrPopoverPosition.LEFT_TOP,
  };
  private intersectionObserver: IntersectionObserver;

  constructor(
    element: ElementRef,
    private container: ViewContainerRef,
    @Optional() private template: TemplateRef<any>,
    overlayContainer: OverlayContainer,

    @Optional() @SkipSelf() private parent: ClrPopoverContent,
    private overlay: Overlay,
    @Inject(ClrPopoverService) private popoverService: ClrPopoverService,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    popoverService.panelClass.push('clr-popover-content');

    overlayContainer.getContainerElement().classList.add('clr-overlay-container');

    if (!template) {
      this.elementRef = element;
    }
  }

  @Input('clrPopoverContent')
  set open(value: boolean) {
    this.popoverService.open = !!value;
  }

  @Input('clrPopoverContentAt')
  get contentAt(): string | ClrPopoverPosition | ConnectedPosition {
    return this.preferredPositionIsSet ? this._preferredPosition : this._position;
  }
  set contentAt(position: string | ClrPopoverPosition | ConnectedPosition) {
    if (typeof position === 'string') {
      if (!position || Object.values(ClrPopoverPosition).indexOf(position as ClrPopoverPosition) === -1) {
        return;
      }

      // set the popover values based on menu position
      this._position = position as ClrPopoverPosition;
      this.popoverService.positionChange(this._position);
    } else {
      this.preferredPositionIsSet = true;
      this._preferredPosition = position;
    }
  }

  @Input('clrPopoverContentAvailablePositions')
  set availablePositions(positions: ConnectedPosition[]) {
    this.availablePositionsAreSet = true;

    this._availablePositions = positions;
  }

  @Input('clrPopoverContentType')
  set contentType(type: ClrPopoverType) {
    this.popoverType = type;

    if (!this.availablePositionsAreSet) {
      this._availablePositions = getConnectedPositions(type);
    }
  }

  @Input('clrPopoverContentOutsideClickToClose')
  get outsideClickClose() {
    return this._outsideClickClose;
  }
  set outsideClickClose(clickToClose: boolean) {
    this._outsideClickClose = !!clickToClose;
  }

  @Input('clrPopoverContentScrollToClose')
  get scrollToClose() {
    return this._scrollToClose;
  }
  set scrollToClose(scrollToClose: boolean) {
    this._scrollToClose = !!scrollToClose;
  }

  @Input('clrPopoverContentOrigin')
  set contentOrigin(origin: FlexibleConnectedPositionStrategyOrigin) {
    // `instanceof Element` is realm-sensitive and misses a raw element belonging to
    // another window, so a consumer passing one here would bypass the ElementRef wrap
    // resolveCrossWindowOrigin() relies on to detect a cross-window origin.
    if ((origin as Node)?.nodeType === Node.ELEMENT_NODE) {
      this.popoverService.origin = new ElementRef(origin as HTMLElement);
    } else {
      this.popoverService.origin = origin;
    }
  }

  private get positionStrategy() {
    const origin = resolveCrossWindowOrigin(this.popoverService.origin);

    return this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .setOrigin(origin)
      .withPush(true)
      .withPositions([this.preferredPosition, ...this._availablePositions])
      .withFlexibleDimensions(true);
  }

  private get preferredPosition(): ConnectedPosition {
    if (this.preferredPositionIsSet) {
      return this._preferredPosition;
    }

    // Default position is "bottom-left"
    return mapPopoverKeyToPosition(this._position, this.popoverType);
  }

  ngAfterViewInit() {
    if (this.popoverService.open) {
      this.showOverlay();
    }

    this.openCloseSubscription = this.popoverService.openChange.subscribe(change => {
      if (change) {
        this.showOverlay();
      } else {
        this.closePopover();
      }
    });
  }

  ngOnDestroy() {
    this.removeOverlay();
    this.openCloseSubscription?.unsubscribe();
  }

  private _createOverlayRef() {
    this.overlayRef = this.overlay.create(
      new OverlayConfig({
        // This is where we can pass externally facing inputs into the angular overlay API, and essentially proxy behaviors our users want directly to the CDK if they have them.
        positionStrategy: this.positionStrategy,
        // the scrolling behaviour is controlled by this popover content directive
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        panelClass: this.popoverService.panelClass,
        hasBackdrop: false,
      })
    );

    this.subscriptions.push(
      merge(this.popoverService.resetPositionsChange, this.popoverService.getPositionChange()).subscribe(() => {
        this.resetPosition();
      }),
      this.popoverService.updatePositionChange().subscribe(() => {
        this.overlayRef?.updatePosition();
      }),
      this.createEscapeSubscription(),

      this.popoverService.originPoint
        ? this.createPointBasedOutsideClickSubscription()
        : this.createElementBasedOutsideClickSubscription()
    );
  }

  /**
   * Point-based origins (context menus) delay the subscription to avoid the
   * mouseup from the same right-click that opened the popover.
   */
  private createPointBasedOutsideClickSubscription(): Subscription {
    const subscription = timer(500)
      .pipe(switchMap(() => this.overlayRef.outsidePointerEvents()))
      .subscribe(event => this.handlePointOutsideClick(event));

    const crossWindowSubscription = this.createCrossWindowPointOutsideClickSubscription();
    if (crossWindowSubscription) {
      subscription.add(crossWindowSubscription);
    }

    return subscription;
  }

  private handlePointOutsideClick(event: Event): void {
    if (this.elementRef?.nativeElement?.contains(event.target as Node)) {
      return;
    }

    if (this._outsideClickClose) {
      this.closePopover();
    }
  }

  /**
   * Mirrors createCrossWindowOutsideClickSubscription for point-based origins (context
   * menus): pointTargetElement - the element the point was derived from, e.g. the
   * right-clicked element - can itself live inside a foreign iframe document, and CDK's
   * outsidePointerEvents() only listens on this window's document, so a click elsewhere
   * in that foreign document would otherwise never dismiss the menu. Delayed by the same
   * 500ms as the same-window stream, for the same reason: avoid the click that opened the
   * menu immediately closing it again.
   */
  private createCrossWindowPointOutsideClickSubscription(): Subscription | null {
    const pointTargetElement = this.popoverService.pointTargetElement;
    const crossWindowOrigin = pointTargetElement ? getCrossWindowOriginContext(pointTargetElement) : null;

    if (!crossWindowOrigin) {
      return null;
    }

    const originWindow = crossWindowOrigin.elementWindow;

    return timer(500)
      .pipe(
        switchMap(() =>
          this.zone.runOutsideAngular(() =>
            merge(
              fromEvent(originWindow.document, 'click', { capture: true }),
              fromEvent(originWindow.document, 'auxclick', { capture: true })
            )
          )
        )
      )
      .subscribe(event => this.zone.run(() => this.handlePointOutsideClick(event)));
  }

  /**
   * Element-based origins close on outside clicks and suppress toggle-button
   * re-clicks so the popover doesn't immediately reopen.
   */
  private createElementBasedOutsideClickSubscription(): Subscription {
    const subscription = this.overlayRef.outsidePointerEvents().subscribe(event => this.handleOutsideClick(event));

    const crossWindowSubscription = this.createCrossWindowOutsideClickSubscription();
    if (crossWindowSubscription) {
      subscription.add(crossWindowSubscription);
    }

    return subscription;
  }

  private handleOutsideClick(event: Event): void {
    // The very click that opened this popover must never be treated as an outside click.
    // CDK's OverlayOutsideClickDispatcher listens in the capture phase on this window's
    // document.body, so it normally runs *before* the trigger's own click handler has
    // attached the overlay, and the opening click is therefore never delivered here.
    // That ordering does not hold everywhere: when the trigger lives in a ShadowRoot
    // owned by a separately bootstrapped Angular application (an ESM micro-frontend
    // plugin with its own CDK instance), the overlay can already be attached by the time
    // the dispatcher sees the click, which delivers the opening click straight back as an
    // "outside" click and tears the popover down microseconds after it opened.
    // Comparing against the stored open event is exact - CDK re-emits the same Event
    // object - and it leaves toggle-to-close untouched, since a later click on the
    // trigger is always a different Event instance.
    if (event === this.popoverService.openEvent) {
      return;
    }

    // web components (cds-icon) register as outside pointer events, so if the event target is inside the content panel return early
    if (this.elementRef?.nativeElement?.contains(event.target as Node)) {
      return;
    }

    // Check if the same element that opened the popover is the same element triggering the outside pointer events (toggle button)
    // openEvent.target can itself be null (e.g. the original toggle button was removed
    // from the DOM before this handler runs), so every access below is optional - an
    // unguarded `.contains()` call here throws and aborts the whole handler, which is
    // exactly what stops closePopover() from ever running.
    const openEventTarget = this.popoverService.openEvent?.target as Element | undefined;
    const isToggleButton =
      !!openEventTarget &&
      (openEventTarget.contains(event.target as Element) ||
        openEventTarget.parentElement?.contains(event.target as Element) ||
        openEventTarget === event.target);

    if (isToggleButton) {
      event.stopPropagation();
    }

    if (this._outsideClickClose || isToggleButton) {
      this.closePopover();
    }
  }

  /**
   * CDK's outsidePointerEvents() only listens on the document that owns the overlay
   * (this window's), so clicks inside a cross-window origin's own document (e.g. a
   * ShadowRoot hosted in an iframe) are invisible to it - see resolveCrossWindowOrigin
   * for the same cross-window scenario affecting positioning instead. Any pointer event
   * dispatched in that foreign document is guaranteed to be outside the overlay panel,
   * since the panel always renders in this window's document, so this only needs the
   * toggle-button exclusion handleOutsideClick already does, not the content-panel
   * containment check (which can never be true across documents).
   *
   * Listens on capture-phase click/auxclick, mirroring CDK's own OverlayOutsideClickDispatcher.
   * Capture phase matters: for a toggle re-click, this listener must run and
   * stopPropagation() BEFORE the trigger's own bubble-phase click handler
   * (ClrDropdownTrigger's toggleWithEvent) gets a chance to fire, otherwise the popover
   * closes here and immediately reopens there. A bubble-phase or pointerdown-based
   * listener can't suppress that handler at all, since pointerdown and click are separate
   * events and stopping one doesn't affect the other.
   *
   * The foreign document's own addEventListener isn't zone-patched (zone.js only patches
   * the window it's loaded into), so the listener is registered directly and the handler
   * is explicitly run back inside NgZone.
   */
  private createCrossWindowOutsideClickSubscription(): Subscription | null {
    // Same-window origins bail out here, so a popover that never crosses a window
    // boundary registers no extra listeners at all.
    const crossWindowOrigin = getCrossWindowOriginContext(this.popoverService.origin);

    if (!crossWindowOrigin) {
      return null;
    }

    const originWindow = crossWindowOrigin.elementWindow;

    return this.zone.runOutsideAngular(() =>
      merge(
        fromEvent(originWindow.document, 'click', { capture: true }),
        fromEvent(originWindow.document, 'auxclick', { capture: true })
      ).subscribe(event => this.zone.run(() => this.handleOutsideClick(event)))
    );
  }

  /**
   * CDK's OverlayKeyboardDispatcher (the source behind `overlayRef.keydownEvents()`)
   * attaches a single keydown listener on this window's document.body once, at app
   * bootstrap - see its `add()`/`_keydownListener`. A keydown fired while focus sits
   * inside a cross-window origin's own document (e.g. a ShadowRoot hosted in an iframe)
   * never bubbles there, since events don't cross document boundaries, so Escape silently
   * does nothing once the trigger (and focus) has moved into that foreign document. This
   * mirrors createCrossWindowOutsideClickSubscription's rationale for outside clicks -
   * merged into a single stream/handler here since both ultimately just detect Escape and
   * close.
   */
  private createEscapeSubscription(): Subscription {
    const crossWindowOrigin = getCrossWindowOriginContext(this.popoverService.origin);
    const keydownEvents = crossWindowOrigin
      ? merge(
          this.overlayRef.keydownEvents(),
          this.zone.runOutsideAngular(() =>
            fromEvent<KeyboardEvent>(crossWindowOrigin.elementWindow.document, 'keydown')
          )
        )
      : this.overlayRef.keydownEvents();

    return keydownEvents.subscribe(event => {
      if (isEscapeKey(event)) {
        this.zone.run(() => {
          event.preventDefault();
          this.closePopover();
        });
      }
    });
  }

  private resetPosition() {
    if (this.overlayRef) {
      this.overlayRef.updatePositionStrategy(this.positionStrategy);
      this.overlayRef.updatePosition();
    }
  }

  private closePopover() {
    if (!this.overlayRef) {
      return;
    }

    this.removeOverlay();
    this.popoverService.popoverVisibleEmit(false);
    this.popoverService.open = false;

    if (this.popoverService.originElement) {
      const shouldFocusTrigger =
        this.popoverType !== ClrPopoverType.TOOLTIP &&
        (document.activeElement === document.body ||
          document.activeElement === this.popoverService.originElement.nativeElement);

      if (shouldFocusTrigger) {
        this.popoverService.focusOrigin();
      }
    }
  }

  private showOverlay() {
    if (!this.overlayRef) {
      this._createOverlayRef();
    }

    if (!this.view && this.template) {
      this.view = this.container.createEmbeddedView(this.template);

      if (!this.elementRef) {
        const [rootNode] = this.view.rootNodes;
        this.elementRef = new ElementRef(rootNode); // So we know where/what to set close focus on
      }
    }

    if (!this.domPortal) {
      this.domPortal = new DomPortal<HTMLElement>(this.elementRef);
      this.overlayRef.attach(this.domPortal);
    }

    if (this.popoverService.originElement) {
      this.popoverService.originElement.nativeElement.scrollIntoView({
        behavior: 'instant',
        block: 'nearest',
        inline: 'nearest',
      });

      this.setupIntersectionObserver();
    }

    setTimeout(() => {
      // Get Scrollable Parents
      this.listenToScrollEvents();

      this.popoverService.popoverVisibleEmit(true);

      if (this.elementRef?.nativeElement?.focus) {
        this.elementRef.nativeElement.focus();
      }
    });
  }

  private removeOverlay(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.subscriptions = [];

    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }

    if (this.domPortal?.isAttached) {
      this.domPortal.detach();
    }

    if (this.view) {
      this.view.destroy();
    }

    this.overlayRef = null;
    this.domPortal = null;
    if (this.template) {
      this.elementRef = null;
    }
    this.view = null;

    this.intersectionObserver?.disconnect();
    this.intersectionObserver = null;
  }

  /**
   * Walks ancestors looking for scrollable containers, following the node up through
   * ShadowRoots and, when the node's own ancestry crosses into an iframe (a different
   * window realm - e.g. a ShadowRoot hosted in a micro-frontend iframe), continuing the
   * walk into the parent window via window.frameElement, all the way up to the true
   * top-level document. Every embedded document passed through this way is added as its
   * own scrollable parent, so page-level scrolling inside an iframe is tracked too.
   *
   * `instanceof` checks are realm-sensitive (they fail for nodes created by a different
   * window's constructors), so this deliberately uses realm-independent shape checks
   * (nodeType, tagName, duck-typing ShadowRoot via `host`) instead, and always resolves
   * computed style through the node's own window rather than this one. This is what lets
   * the walk safely continue across a same-origin realm boundary instead of just
   * stopping at it.
   */
  private getScrollableParents(node: HTMLElement) {
    const overflowScrollKeys = ['auto', 'scroll', 'clip'];
    const scrollableParents: (Document | Element)[] = [window.document];

    let parent: Node | null = node;

    while (parent && isElementOrShadowRoot(parent)) {
      if (isShadowRoot(parent)) {
        parent = parent.host;
        continue;
      }

      const element = parent as Element;
      const elementWindow = element.ownerDocument?.defaultView;

      if (isHtmlElement(element)) {
        const frameElement = elementWindow && elementWindow !== window ? getFrameElement(elementWindow) : null;

        if (!frameElement) {
          break;
        }

        // Leaving this document for its parent window - track its own page-level scroll too.
        scrollableParents.push(element.ownerDocument);
        parent = frameElement;
        continue;
      }

      const { overflowY, overflowX } = (elementWindow ?? window).getComputedStyle(element);

      if (overflowScrollKeys.includes(overflowY) || overflowScrollKeys.includes(overflowX)) {
        scrollableParents.push(element);
      }

      parent = element.parentNode;
    }

    return scrollableParents;
  }

  /**
   * Uses IntersectionObserver to detect when the origin element leaves the screen.
   * This handles the "Close on Scroll" logic much cheaper than getBoundingClientRect.
   */
  private setupIntersectionObserver() {
    if (!this.popoverService.originElement || this.intersectionObserver) {
      return;
    }

    // The spec guarantees the callback fires once immediately when observe() is called,
    // reporting the origin's current visibility as a baseline - not because it scrolled
    // out of view. If that baseline lands before the origin's scrollIntoView/layout has
    // settled, it can read as not-intersecting and close the popover instants after it
    // opened. Only real visibility changes reported after that first callback should close it.
    let isBaselineCallback = true;

    this.intersectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (isBaselineCallback) {
            isBaselineCallback = false;
            return;
          }

          // If the origin is no longer visible (scrolled out of view)
          if (!entry.isIntersecting && this.popoverService.open) {
            this.zone.run(() => this.closePopover());
          }
        });
      },
      // threshold 0.8 alone only fires when the ratio crosses 0.8 - if the origin is
      // already below 0.8 when the popover opens (e.g. still partially clipped after
      // scrollIntoView can't fully reveal it) and then scrolls further away without ever
      // going back above 0.8, no callback fires again and it never gets a chance to close.
      // Threshold 0 adds a checkpoint at true zero-visibility so leaving the viewport
      // entirely always fires a real (non-baseline) callback, regardless of what happens
      // at 0.8.
      { root: null, threshold: [0, 0.8] }
    );

    this.intersectionObserver.observe(this.popoverService.originElement.nativeElement);
  }

  private listenToScrollEvents() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const originEl = this.popoverService.originPoint
      ? this.popoverService.pointTargetElement
      : this.getRootPopover(this)?.popoverService?.originElement?.nativeElement;

    this.listenToScrollForElementOrigin(originEl);
  }

  // Element origins track ancestor scroll containers to reposition or close.
  private listenToScrollForElementOrigin(originEl: HTMLElement) {
    const scrollableParents = this.getScrollableParents(originEl);

    this.zone.runOutsideAngular(() => {
      this.subscriptions.push(
        merge(...scrollableParents.map(parent => fromEvent(parent, 'scroll', { passive: true }))).subscribe(() => {
          if (this._scrollToClose) {
            this.zone.run(() => this.closePopover());
            return;
          }

          this.overlayRef?.updatePosition();
        })
      );
    });
  }

  private getRootPopover(popover: ClrPopoverContent): ClrPopoverContent {
    if (popover && popover.parent) {
      return this.getRootPopover(popover.parent);
    }

    return popover;
  }
}

function isEscapeKey(event: KeyboardEvent): boolean {
  return !!event && event.key === Keys.Escape && !hasModifierKey(event);
}

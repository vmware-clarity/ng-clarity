/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { hasModifierKey } from '@angular/cdk/keycodes';
import { ConnectedPosition, Overlay, OverlayConfig, OverlayContainer, OverlayRef } from '@angular/cdk/overlay';
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
import { fromEvent, merge, Subscription } from 'rxjs';

import { ClrPopoverService } from './providers/popover.service';
import {
  ClrPopoverPosition,
  ClrPopoverType,
  getConnectedPositions,
  mapPopoverKeyToPosition,
} from './utils/popover-positions';
import { Keys } from '../../utils/enums/keys.enum';
import { normalizeKey } from '../../utils/focus/key-focus/util';

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
  private scrollableParents: (HTMLDocument | HTMLElement)[] = [];

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

  private get positionStrategy() {
    return this.overlay
      .position()
      .flexibleConnectedTo(this.popoverService.anchorElementRef)
      .setOrigin(this.popoverService.anchorElementRef)
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
      this.overlayRef.keydownEvents().subscribe(event => {
        if (event && event.key && normalizeKey(event.key) === Keys.Escape && !hasModifierKey(event)) {
          event.preventDefault();
          this.closePopover();
        }
      }),
      this.overlayRef.outsidePointerEvents().subscribe(event => {
        // web components (cds-icon) register as outside pointer events, so if the event target is inside the content panel return early
        if (this.elementRef && this.elementRef.nativeElement.contains(event.target)) {
          return;
        }

        // Check if the same element that opened the popover is the same element triggering the outside pointer events (toggle button)
        const isToggleButton =
          this.popoverService.openEvent &&
          ((this.popoverService.openEvent.target as Element).contains(event.target as Element) ||
            (this.popoverService.openEvent.target as Element).parentElement.contains(event.target as Element) ||
            this.popoverService.openEvent.target === event.target);

        if (isToggleButton) {
          event.stopPropagation();
        }

        if (this._outsideClickClose || isToggleButton) {
          this.closePopover();
        }
      })
    );
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
    this.popoverService.open = false;

    const shouldFocusTrigger =
      this.popoverType !== ClrPopoverType.TOOLTIP &&
      (document.activeElement === document.body ||
        document.activeElement === this.popoverService.anchorElementRef?.nativeElement);

    if (shouldFocusTrigger) {
      this.popoverService.focusAnchor();
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

    this.popoverService?.anchorElementRef?.nativeElement.scrollIntoView({
      behavior: 'instant',
      block: 'nearest',
      inline: 'nearest',
    });

    this.setupIntersectionObserver();

    setTimeout(() => {
      // Get Scrollable Parents
      this.listenToMouseEvents();

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

    this.popoverService.popoverVisibleEmit(false);
  }

  private getScrollableParents(node: HTMLElement) {
    let parent = node;
    const overflowScrollKeys = ['auto', 'scroll', 'clip'];
    const scrollableParents: (HTMLDocument | HTMLElement)[] = [window.document];

    while (parent && !(parent instanceof HTMLHtmlElement)) {
      if (parent instanceof ShadowRoot) {
        parent = parent.host as HTMLElement;
      }

      const { overflowY, overflowX } = window.getComputedStyle(parent);

      if (overflowScrollKeys.includes(overflowY) || overflowScrollKeys.includes(overflowX)) {
        scrollableParents.push(parent);
      }

      parent = parent.parentNode as HTMLElement;
    }

    return scrollableParents;
  }

  /**
   * Uses IntersectionObserver to detect when the anchor leaves the screen.
   * This handles the "Close on Scroll" logic much cheaper than getBoundingClientRect.
   */
  private setupIntersectionObserver() {
    if (!this.popoverService.anchorElementRef || this.intersectionObserver) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          // If the anchor is no longer visible (scrolled out of view)
          if (!entry.isIntersecting && this.popoverService.open) {
            this.zone.run(() => this.closePopover());
          }
        });
      },
      { root: null, threshold: 0.8 }
    );

    this.intersectionObserver.observe(this.popoverService.anchorElementRef.nativeElement);
  }

  //Align the popover on scrolling
  private listenToMouseEvents() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const anchor = this.getRootPopover(this)?.popoverService?.anchorElementRef.nativeElement;

    const scrollableParents = this.getScrollableParents(anchor);

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

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { hasModifierKey } from '@angular/cdk/keycodes';
import {
  CdkScrollable,
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayContainer,
  OverlayRef,
  ScrollDispatcher,
} from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
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
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { fromEvent, merge, Subscription } from 'rxjs';

import { ClrPopoverService } from './providers/popover.service';
import { ClrPopoverPosition, ClrPopoverType, mapPopoverKeyToPosition } from './utils/popover-positions';
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

  private subscriptions: Subscription[] = [];
  private openCloseSubscription: Subscription;
  private domPortal: DomPortal;
  private preferredPositionIsSet = false;
  private preferredPosition: ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
  };
  private intersectionObserver: IntersectionObserver;

  constructor(
    element: ElementRef,
    private container: ViewContainerRef,
    @Optional() private template: TemplateRef<any>,
    overlayContainer: OverlayContainer,

    private overlay: Overlay,
    @Inject(ClrPopoverService) private popoverService: ClrPopoverService,
    private scrollDispatcher: ScrollDispatcher,
    private zone: NgZone
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
  set contentAt(position: string | ClrPopoverPosition | ConnectedPosition) {
    if (typeof position === 'string') {
      if (!position || Object.values(ClrPopoverPosition).indexOf(position as ClrPopoverPosition) === -1) {
        return;
      }

      // set the popover values based on menu position
      this.popoverService.position = position as ClrPopoverPosition;
    } else {
      this.preferredPositionIsSet = true;
      this.preferredPosition = position;
    }
  }

  @Input('clrPopoverContentAvailablePositions')
  set availablePositions(positions: ConnectedPosition[]) {
    this.popoverService.availablePositions = positions;
  }

  @Input('clrPopoverContentType')
  set contentType(type: ClrPopoverType) {
    this.popoverService.popoverType = type;
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

  setPreferredPosition() {
    if (this.preferredPositionIsSet) {
      return;
    }

    // Set default position to "bottom-left", if position is not available in the map
    this.preferredPosition = mapPopoverKeyToPosition(this.popoverService.position, this.popoverService.popoverType);
  }

  private _createOverlayRef(): OverlayRef {
    const overlay = this.overlay.create(
      new OverlayConfig({
        // This is where we can pass externally facing inputs into the angular overlay API, and essentially proxy behaviors our users want directly to the CDK if they have them.
        positionStrategy: this.getPositionStrategy(),
        // the scrolling behaviour is controlled by this popover content directive
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        panelClass: this.popoverService.panelClass,
        hasBackdrop: false,
      })
    );

    this.subscriptions.push(
      merge(this.popoverService.resetPositions, this.popoverService.getPositionChange()).subscribe(() => {
        this.updatePosition();
      }),
      // handles cdkScrollable positionChanges. We don't need it Since IntersectionObserver is running.
      // commenting for now
      // positionStrategy?.positionChanges?.subscribe(change => {
      //   // Close the overlay when the Origin is clipped
      //   if (change.scrollableViewProperties.isOriginClipped) {
      //     // Running the zone is essential to invoke HostBinding
      //     this.zone.run(() => {
      //       this.popoverService.open = false;
      //     });
      //   }
      // }),
      overlay.keydownEvents().subscribe(event => {
        if (event && event.key && normalizeKey(event.key) === Keys.Escape && !hasModifierKey(event)) {
          event.preventDefault();
          this.closePopover();
        }
      }),
      overlay.outsidePointerEvents().subscribe(event => {
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

    return overlay;
  }

  private updatePosition() {
    if (this.popoverService.overlayRef) {
      this.popoverService.overlayRef.updatePositionStrategy(this.getPositionStrategy());
      this.popoverService.overlayRef.updatePosition();
    }
  }

  private getPositionStrategy() {
    this.setPreferredPosition(); //Preferred position defined by consumer

    // fetch all Scrolling Containers registered with CDK
    let scrollableAncestors: CdkScrollable[];
    if (this.popoverService.anchorElementRef) {
      scrollableAncestors = this.scrollDispatcher.getAncestorScrollContainers(this.popoverService.anchorElementRef);
    }

    return this.overlay
      .position()
      .flexibleConnectedTo(this.popoverService.anchorElementRef)
      .setOrigin(this.popoverService.anchorElementRef)
      .withPush(true)
      .withPositions([this.preferredPosition, ...this.popoverService.availablePositions])
      .withFlexibleDimensions(true)
      .withScrollableContainers(scrollableAncestors);
  }

  private closePopover() {
    if (!this.popoverService.overlayRef) {
      return;
    }

    this.removeOverlay();
    this.popoverService.open = false;

    const shouldFocusTrigger =
      this.popoverService.popoverType !== ClrPopoverType.TOOLTIP &&
      (document.activeElement === document.body ||
        document.activeElement === this.popoverService.anchorElementRef?.nativeElement);

    if (shouldFocusTrigger) {
      this.popoverService.focusAnchor();
    }
  }

  private showOverlay() {
    // Get Scrollable Parents
    this.listenToMouseEvents();

    //Preferred position defined by consumer
    this.setPreferredPosition();

    if (!this.popoverService.overlayRef) {
      this.popoverService.overlayRef = this._createOverlayRef();
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
      this.popoverService.overlayRef.attach(this.domPortal);
    }

    this.setupIntersectionObserver();

    setTimeout(() => {
      this.popoverService.popoverVisibleEmit(true);

      if (this.elementRef?.nativeElement?.focus) {
        this.elementRef.nativeElement.focus();
      }
    });
  }

  private removeOverlay(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.subscriptions = [];

    if (this.popoverService.overlayRef?.hasAttached()) {
      this.popoverService.overlayRef.detach();
      this.popoverService.overlayRef.dispose();
    }

    if (this.domPortal?.isAttached) {
      this.domPortal.detach();
    }

    if (this.view) {
      this.view.destroy();
    }

    this.popoverService.overlayRef = null;
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
    const scrollableParents = this.getScrollableParents(this.popoverService.anchorElementRef?.nativeElement);

    this.zone.runOutsideAngular(() => {
      this.subscriptions.push(
        merge(...scrollableParents.map(parent => fromEvent(parent, 'scroll', { passive: true }))).subscribe(() => {
          if (this._scrollToClose) {
            this.zone.run(() => this.closePopover());
            return;
          }

          if (this.popoverService.overlayRef) {
            this.popoverService.overlayRef.updatePosition();
          }
        })
      );
    });
  }
}

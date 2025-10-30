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
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

import { ClrCDKPopoverPositions } from './enums/cdk-dropdown-position.enum';
import { ClrPopoverService } from './providers/popover.service';
import { Keys } from '../enums/keys.enum';
import { normalizeKey } from '../focus/key-focus/util';

const AvailablePopoverPositions = [
  ClrCDKPopoverPositions.bottom,
  ClrCDKPopoverPositions['bottom-left'],
  ClrCDKPopoverPositions['bottom-middle'],
  ClrCDKPopoverPositions['bottom-right'],
  ClrCDKPopoverPositions.left,
  ClrCDKPopoverPositions['left-bottom'],
  ClrCDKPopoverPositions['left-middle'],
  ClrCDKPopoverPositions['left-top'],
  ClrCDKPopoverPositions['middle-bottom'],
  ClrCDKPopoverPositions['middle-left'],
  ClrCDKPopoverPositions['middle-right'],
  ClrCDKPopoverPositions.right,
  ClrCDKPopoverPositions['right-bottom'],
  ClrCDKPopoverPositions['right-middle'],
  ClrCDKPopoverPositions['right-top'],
  ClrCDKPopoverPositions.top,
  ClrCDKPopoverPositions['top-left'],
  ClrCDKPopoverPositions['top-middle'],
  ClrCDKPopoverPositions['top-right'],
];

/** @dynamic */
@Directive({
  selector: '[clrPopoverContent]',
  standalone: false,
})
export class ClrPopoverContent implements OnDestroy, AfterViewInit {
  private view: EmbeddedViewRef<void>;
  private domPortal: DomPortal;
  private subscriptions: Subscription[] = [];
  private overlayRef: OverlayRef = null;
  private preferredPosition: ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
  };

  private scrollableParent: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private container: ViewContainerRef,
    private template: TemplateRef<any>,
    private renderer: Renderer2,
    private overlay: Overlay,
    overlayContainer: OverlayContainer,
    private scrollDispatcher: ScrollDispatcher,
    private popoverService: ClrPopoverService,
    private zone: NgZone
  ) {
    popoverService.panelClass = 'clr-popover-content';
    popoverService.defaultPosition = 'bottom-left';
    popoverService.availablePositions = AvailablePopoverPositions;
    popoverService.popoverPositions = ClrCDKPopoverPositions;

    overlayContainer.getContainerElement().classList.add('clr-container-element');
  }

  @Input('clrPopoverContent')
  set open(value: boolean) {
    this.popoverService.open = !!value;
  }

  @Input('clrPopoverContentAt')
  set contentAt(position: string) {
    // set the popover values based on menu position
    this.popoverService.position = position || this.popoverService.defaultPosition;
  }

  @Input('clrPopoverContentOutsideClickToClose')
  set outsideClickClose(clickToClose: boolean) {
    this.popoverService.outsideClickClose = !!clickToClose;
  }

  @Input('clrPopoverContentScrollToClose')
  set scrollToClose(scrollToClose: boolean) {
    this.popoverService.scrollToClose = !!scrollToClose;

    if (this.overlayRef) {
      this.overlayRef.updateScrollStrategy(this.getScrollStrategy());
    }
  }

  ngAfterViewInit() {
    if (this.popoverService.open) {
      this.showOverlay();
    }
    this.subscriptions.push(
      this.popoverService.openChange.subscribe(change => {
        if (!this.scrollableParent) {
          // Get Scrollable Parent when there is no cdkScrollable directive set
          this.scrollableParent = this.getScrollParent(this.popoverService.anchorElementRef?.nativeElement);
          this.listenToMouseEvents();
        }

        if (change) {
          this.showOverlay();
        } else {
          this.removeOverlay();
        }
      })
    );
  }

  ngOnDestroy() {
    this.removeOverlay();
    this.subscriptions.forEach(s => s.unsubscribe());
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.popoverService.overlayRef = null;
      this.overlayRef = null;
    }
  }

  setPreferredPosition() {
    //Set default position to "top-right", if position is not available in the map
    this.preferredPosition =
      this.popoverService.position in this.popoverService.popoverPositions
        ? this.popoverService.popoverPositions[this.popoverService.position]
        : this.popoverService.popoverPositions[this.popoverService.defaultPosition || 'top-right'];
  }

  private _createOverlayRef(): OverlayRef {
    //fetch all Scrolling Containers registered with CDK
    let scrollableAncestors: CdkScrollable[];
    if (this.popoverService.anchorElementRef) {
      scrollableAncestors = this.scrollDispatcher.getAncestorScrollContainers(this.popoverService.anchorElementRef);
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.popoverService.anchorElementRef)
      .setOrigin(this.popoverService.anchorElementRef)
      .withPush(true)
      .withPositions([this.preferredPosition, ...this.popoverService.availablePositions])
      .withFlexibleDimensions(true)
      .withScrollableContainers(scrollableAncestors);

    const overlay = this.overlay.create(
      new OverlayConfig({
        // This is where we can pass externally facing inputs into the angular overlay API, and essentially proxy behaviors our users want directly to the CDK if they have them.
        positionStrategy: positionStrategy,
        scrollStrategy: this.getScrollStrategy(),
        panelClass: this.popoverService.panelClass,
        hasBackdrop: this.popoverService.hasBackdrop,
      })
    );

    this.subscriptions.push(
      positionStrategy?.positionChanges?.subscribe(change => {
        //Close the overlay when the Origin is clipped
        if (change.scrollableViewProperties.isOriginClipped) {
          // Running the zone is essential to invoke HostBinding
          this.zone.run(() => {
            this.popoverService.open = false;
          });
        }
      })
    );

    this.subscriptions.push(
      overlay.keydownEvents().subscribe(event => {
        if (event && event.key && normalizeKey(event.key) === Keys.Escape && !hasModifierKey(event)) {
          event.preventDefault();
          this.popoverService.open = false;
          this.popoverService.setOpenedButtonFocus();
        }
      })
    );

    this.subscriptions.push(
      overlay.outsidePointerEvents().subscribe(event => {
        // web components (cds-icon) register as outside pointer events, so if the event target is inside the content panel return early
        if (this.popoverService.contentRef && this.popoverService.contentRef.nativeElement.contains(event.target)) {
          return;
        }
        // Check if the same element that opened the popover is the same element triggering the outside pointer events (toggle button)
        if (this.popoverService.openEvent) {
          if (
            (this.popoverService.openEvent.target as Element).contains(event.target as Element) ||
            (this.popoverService.openEvent.target as Element).parentElement.contains(event.target as Element) ||
            this.popoverService.openEvent.target === event.target
          ) {
            return;
          }
        }

        if (this.popoverService.outsideClickClose) {
          this.popoverService.open = false;
          this.popoverService.setOpenedButtonFocus();
        }
      })
    );

    this.subscriptions.push(
      overlay.detachments().subscribe(() => {
        this.popoverService.open = false;
        this.popoverService.setOpenedButtonFocus();
      })
    );

    return overlay;
  }

  private getScrollStrategy(): ScrollStrategy {
    return this.popoverService.scrollToClose
      ? this.overlay.scrollStrategies.close()
      : this.overlay.scrollStrategies.reposition({ autoClose: true });
  }

  private showOverlay() {
    this.setPreferredPosition(); //Preferred position defined by consumer

    if (!this.overlayRef) {
      this.overlayRef = this._createOverlayRef();
      this.popoverService.overlayRef = this.overlayRef;
    }

    if (!this.view) {
      this.view = this.container.createEmbeddedView(this.template);
      const [rootNode] = this.view.rootNodes;
      this.popoverService.contentRef = new ElementRef(rootNode); // So we know where/what to set close focus on
      this.domPortal = new DomPortal<HTMLElement>(this.popoverService.contentRef);
    }
    this.overlayRef.attach(this.domPortal);

    setTimeout(() => this.popoverService.popoverVisibleEmit(true));
  }

  private removeOverlay(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    if (this.domPortal?.isAttached) {
      this.domPortal.detach();
      this.domPortal = null;
    }
    if (this.view) {
      this.view.destroy();
      this.view = null;
    }

    this.popoverService.popoverVisibleEmit(false);
  }

  //The below method is taken from https://gist.github.com/oscarmarina/3a546cff4d106a49a5be417e238d9558
  private getScrollParent = (node, axis = 'y') => {
    let el = node;
    if (!(el instanceof HTMLElement || el instanceof ShadowRoot)) {
      return null;
    }

    if (el instanceof ShadowRoot) {
      el = el.host;
    }
    const style = window.getComputedStyle(el);
    const overflow = axis === 'y' ? style.overflowY : style.overflowX;
    const scrollSize = axis === 'y' ? el.scrollHeight : el.scrollWidth;
    const clientSize = axis === 'y' ? el.clientHeight : el.clientWidth;
    const isScrolled = scrollSize > clientSize;

    if (isScrolled && !overflow.includes('visible') && !overflow.includes('hidden')) {
      return {
        scrollParent: el,
        scrollParentSize: scrollSize,
        clientParentSize: clientSize,
      };
    }

    return this.getScrollParent(el.parentNode, axis) || window.document.body;
  };

  //Align the popover on scrolling
  private listenToMouseEvents() {
    this.zone.runOutsideAngular(() => {
      this.subscriptions.push(
        fromEvent(
          this.scrollableParent?.scrollParent ? this.scrollableParent?.scrollParent : window.document,
          'scroll'
        ).subscribe(() => {
          if (!this.overlayRef) {
            return;
          }

          if (
            !this.elementIsVisibleInViewport(this.popoverService.anchorElementRef?.nativeElement) ||
            this.popoverService.scrollToClose
          ) {
            this.zone.run(() => {
              this.removeOverlay();
            });
            return;
          }

          this.overlayRef.updatePosition();
        })
      );
    });
  }

  //Check if element is in ViewPort
  private elementIsVisibleInViewport(el, partiallyVisible = false) {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return partiallyVisible
      ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
          ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
      : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
  }
}

/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayRef,
  // RepositionScrollStrategy,
  // ScrollDispatcher,
  // ScrollStrategy,
  STANDARD_DROPDOWN_BELOW_POSITIONS,
  // ViewportRuler,
} from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { AfterViewInit, Directive, Inject, NgZone, Renderer2 } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

import { ClrCDKPopoverPositions } from '../../utils/popover/enums/cdk-position.enum';
import { ClrPopoverService } from '../../utils/popover/providers/popover.service';
import { AvailablePopoverPositions } from './popover-positions';

@Directive({
  selector: 'clr-tooltip, clr-signpost',
})
export class PopoverDirective implements AfterViewInit {
  private subscriptions: Subscription[] = [];
  private overlayRef: OverlayRef = null;
  private domPortal: DomPortal;
  private preferredPosition: ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
  };
  private anchorWidth: number;
  private anchorHeight: number;

  private positions: ConnectedPosition[] = STANDARD_DROPDOWN_BELOW_POSITIONS;
  private renderer: Renderer2;
  private scrollableParent: any;

  constructor(
    private overlay: Overlay,
    @Inject(ClrPopoverService) private popoverService: ClrPopoverService,
    private zone: NgZone
  ) {}

  ngAfterViewInit() {
    if (this.popoverService.open) {
      this.showOverlay();
    }
    this.subscriptions.push(
      this.popoverService.openChange.subscribe(change => {
        if (change) {
          setTimeout(() => this.showOverlay());
        } else {
          this.removeOverlay();
        }
      })
    );
    this.scrollableParent = this.getScrollParent(this.popoverService.anchorElementRef.nativeElement);
    this.listenToMouseEvents();
  }

  listenToMouseEvents() {
    this.zone.runOutsideAngular(() => {
      this.subscriptions.push(
        fromEvent(
          this.scrollableParent?.scrollParent ? this.scrollableParent?.scrollParent : 'body',
          'scroll'
        ).subscribe(() => {
          if (this.overlayRef) {
            this.overlayRef.updatePosition();
          }
        })
      );
    });
  }

  //The below method is taken from https://gist.github.com/oscarmarina/3a546cff4d106a49a5be417e238d9558
  getScrollParent = (node, axis = 'y') => {
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

    return this.getScrollParent(el.parentNode, axis) || document.body;
  };

  setDynamicOffsetPosition() {
    this.anchorWidth = this.popoverService.anchorElementRef.nativeElement.offsetWidth;
    this.anchorHeight = this.popoverService.anchorElementRef.nativeElement.offsetHeight;
    if (this.preferredPosition.originX === 'end' && this.preferredPosition.originY === 'center') {
      this.preferredPosition.offsetX = -this.anchorWidth - 10;
    } else if (this.preferredPosition.originX === 'start' && this.preferredPosition.originY === 'center') {
      this.preferredPosition.offsetX = this.anchorWidth + 10;
    } else if (this.preferredPosition.originX === 'start') {
      this.preferredPosition.offsetX = this.anchorWidth / 2;
    } else if (this.preferredPosition.originX === 'end') {
      this.preferredPosition.offsetX = -this.anchorWidth / 2;
    }
  }

  setPosition() {
    //Set default position to "top-right", if position is not available in the map

    this.preferredPosition =
      this.popoverService.position in ClrCDKPopoverPositions
        ? ClrCDKPopoverPositions[this.popoverService.position]
        : ClrCDKPopoverPositions['top-right'];
    this.setDynamicOffsetPosition();
  }

  showOverlay() {
    this.setPosition();
    if (!this.overlayRef) {
      this.overlayRef = this._createOverlayRef();
    }

    if (!this.domPortal) {
      this.domPortal = new DomPortal(this.popoverService.contentRef);
    }
    this.overlayRef.attach(this.domPortal);
    this.overlayRef.updatePosition();
    setTimeout(() => this.popoverService.popoverVisibleEmit(true));
  }

  removeOverlay(): void {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
    if (this.domPortal.isAttached) {
      this.domPortal.detach();
    }
    this.domPortal = null;
    this.popoverService.popoverVisibleEmit(false);
  }

  private _createOverlayRef(): OverlayRef {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.popoverService.anchorElementRef)
      .setOrigin(this.popoverService.anchorElementRef)
      .withPush(true)
      .withPositions([this.preferredPosition, ...AvailablePopoverPositions]);

    const overlay = this.overlay.create(
      new OverlayConfig({
        // This is where we can pass externally facing inputs into the angular overlay API, and essentially proxy behaviors our users want directly to the CDK if they have them.
        positionStrategy: positionStrategy,
        scrollStrategy: this.popoverService.scrollToClose
          ? this.overlay.scrollStrategies.noop()
          : this.overlay.scrollStrategies.reposition(),
        panelClass: this.popoverService.panelClass,
        hasBackdrop: false,
      })
    );

    // positionStrategy?.positionChanges?.subscribe(d => {
    //   console.log('🚀 ~ PopoverDirective ~ positionStrategy.positionChanges.subscribe ~ positionChanges:', d);
    // });

    this.subscriptions.push(
      overlay.keydownEvents().subscribe(event => {
        if (event.keyCode === ESCAPE && !hasModifierKey(event)) {
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
}

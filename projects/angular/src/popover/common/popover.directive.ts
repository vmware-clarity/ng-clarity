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
  OverlayRef,
  ScrollDispatcher,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { AfterViewInit, Directive, Inject, NgZone } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

import { ClrPopoverService } from '../../utils';
import { Keys } from '../../utils/enums/keys.enum';
import { normalizeKey } from '../../utils/focus/key-focus/util';

@Directive({
  selector: 'clr-tooltip-content, clr-signpost-content, clr-dropdown-menu',
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
  private scrollableParent: any;

  constructor(
    private overlay: Overlay,
    @Inject(ClrPopoverService) private popoverService: ClrPopoverService,
    private scrollDispatcher: ScrollDispatcher,
    private zone: NgZone
  ) {}

  ngAfterViewInit() {
    if (this.popoverService.open) {
      this.popoverService.anchorElementRef
        ? this.showOverlay()
        : setTimeout(() => {
            this.showOverlay();
          }, 0);
    }

    this.subscriptions.push(
      this.popoverService.openChange.subscribe(change => {
        if (change) {
          this.showOverlay();
        } else {
          this.removeOverlay();
        }
      })
    );
    // Get Scrollable Parent when there is no cdkScrollable directive set
    this.scrollableParent = this.getScrollParent(this.popoverService.anchorElementRef?.nativeElement);
    this.listenToMouseEvents();
  }

  ngOnDestroy() {
    this.removeOverlay();
    this.subscriptions.forEach(s => s.unsubscribe());
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  //Align the popover on scrolling
  listenToMouseEvents() {
    this.zone.runOutsideAngular(() => {
      this.subscriptions.push(
        fromEvent(
          this.scrollableParent?.scrollParent ? this.scrollableParent?.scrollParent : window.document,
          'scroll'
        ).subscribe(() => {
          if (this.popoverService.scrollToClose) {
            this.zone.run(() => {
              this.removeOverlay();
            });

            return;
          }

          if (this.overlayRef) {
            if (this.elementIsVisibleInViewport(this.popoverService.anchorElementRef?.nativeElement)) {
              this.overlayRef.updatePosition();
            } else {
              this.zone.run(() => {
                this.removeOverlay();
              });
            }
          }
        })
      );
    });
  }

  //Check if element is in ViewPort
  elementIsVisibleInViewport(el, partiallyVisible = false) {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return partiallyVisible
      ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
          ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
      : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
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

  setPreferredPosition() {
    //Set default position to "top-right", if position is not available in the map
    this.preferredPosition =
      this.popoverService.position in this.popoverService.popoverPositions
        ? this.popoverService.popoverPositions[this.popoverService.position]
        : this.popoverService.popoverPositions[this.popoverService.defaultPosition || 'top-right'];
  }

  showOverlay() {
    this.setPreferredPosition(); //Preferred position defined by consumer

    if (!this.overlayRef) {
      this.overlayRef = this._createOverlayRef();
    }

    if (!this.domPortal) {
      this.domPortal = new DomPortal(this.popoverService.contentRef);
      this.overlayRef.attach(this.domPortal);
    }

    // this.overlayRef.updatePosition();
    setTimeout(() => {
      this.popoverService.popoverVisibleEmit(true);

      if (this.popoverService.contentRef.nativeElement.focus) {
        this.popoverService.contentRef.nativeElement.focus();
      }
    });
  }

  removeOverlay(): void {
    // Detach Overlay Reference
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }

    // Detach Dom Portal
    if (this.domPortal?.isAttached) {
      this.domPortal.detach();
    }

    this.domPortal = null;
    this.popoverService.popoverVisibleEmit(false);
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
          this.closePopover();
        }
      })
    );

    this.subscriptions.push(
      overlay.outsidePointerEvents().subscribe(event => {
        console.log(this.popoverService.contentRef.nativeElement);

        // web components (cds-icon) register as outside pointer events, so if the event target is inside the content panel return early
        if (this.popoverService.contentRef && this.popoverService.contentRef.nativeElement.contains(event.target)) {
          return;
        }

        // Check if the same element that opened the popover is the same element triggering the outside pointer events (toggle button)
        const isToggleButton =
          this.popoverService.openEvent &&
          ((this.popoverService.openEvent.target as Element).contains(event.target as Element) ||
            (this.popoverService.openEvent.target as Element).parentElement.contains(event.target as Element) ||
            this.popoverService.openEvent.target === event.target);

        if (this.popoverService.outsideClickClose || isToggleButton) {
          event.stopPropagation();
          this.closePopover();
        }
      })
    );

    this.subscriptions.push(
      overlay.detachments().subscribe(() => {
        this.closePopover();
      })
    );

    return overlay;
  }

  private closePopover() {
    this.removeOverlay();
    this.popoverService.open = false;
    this.popoverService.setOpenedButtonFocus();
  }

  private getScrollStrategy(): ScrollStrategy {
    return this.popoverService.scrollToClose
      ? this.overlay.scrollStrategies.close()
      : this.overlay.scrollStrategies.reposition();
  }
}

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
import { AfterViewInit, ElementRef, Injectable, NgZone, OnDestroy, TemplateRef } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

import { ClrAbstractPopoverService } from './abstract-popover.service';
import { Keys } from '../../enums/keys.enum';
import { normalizeKey } from '../../focus/key-focus/util';
import { ClrCDKPopoverPositions } from '../enums/cdk-signpost-position.enum';

// Popovers might need to ignore click events on an element
// (eg: popover opens on focus on an input field. Clicks should be ignored in this case)

@Injectable()
export class ClrPopoverService extends ClrAbstractPopoverService implements AfterViewInit, OnDestroy {
  outsideClickClose = true;
  scrollToClose = false;
  anchorElementRef: ElementRef;
  closeButtonRef: ElementRef;
  contentRef: ElementRef;
  templateRef: TemplateRef<any>;
  position: string;
  defaultPosition: string;
  panelClass: string | string[];
  popoverPositions: ClrCDKPopoverPositions;
  availablePositions: any;
  hasBackdrop: false;
  overlayRef: OverlayRef = null;
  noFocus: boolean;

  private subscriptions: Subscription[] = [];
  private domPortal: DomPortal;
  private preferredPosition: ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
  };
  private scrollableParent: any;

  constructor(
    public overlay: Overlay,
    public scrollDispatcher: ScrollDispatcher,
    public zone: NgZone
  ) {
    super();
  }

  override get open() {
    return super.open;
  }

  override set open(value: boolean) {
    value = !!value;

    // setting super's open and show/remove overlay order is IMPORTANT. DO NOT CHANGE.
    if (value) {
      super.open = value;
      this.toggleOverlay(value);
    } else {
      this.toggleOverlay(value);
      super.open = value;
    }
  }

  ngAfterViewInit() {
    if (this.open) {
      this.anchorElementRef
        ? this.showOverlay()
        : setTimeout(() => {
            this.showOverlay();
          }, 0);
    }

    this.subscriptions.push(
      this.openChange.subscribe(change => {
        this.toggleOverlay(change);
      })
    );
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
          if (this.scrollToClose) {
            this.zone.run(() => {
              this.removeOverlay();
            });

            return;
          }

          if (this.overlayRef) {
            if (this.elementIsVisibleInViewport(this.anchorElementRef?.nativeElement)) {
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

  setPreferredPosition() {
    //Set default position to "top-right", if position is not available in the map
    this.preferredPosition =
      this.position in this.popoverPositions
        ? this.popoverPositions[this.position]
        : this.popoverPositions[this.defaultPosition || 'top-right'];
  }

  showOverlay() {
    this.setPreferredPosition(); //Preferred position defined by consumer

    if (!this.overlayRef) {
      this.overlayRef = this._createOverlayRef();
    }

    if (!this.domPortal) {
      this.domPortal = new DomPortal(this.contentRef);
      this.overlayRef.attach(this.domPortal);
    }

    // Get Scrollable Parent when there is no cdkScrollable directive set
    this.scrollableParent = this.getScrollParent(this.anchorElementRef?.nativeElement);
    this.listenToMouseEvents();

    setTimeout(() => {
      if (this.contentRef.nativeElement.focus) {
        this.contentRef.nativeElement.focus();
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
    this.popoverVisibleEmit(true);
  }

  toggleOverlay(change: boolean) {
    if (change) {
      this.showOverlay();
    } else {
      this.removeOverlay();
    }
  }

  setOpenedButtonFocus(): void {
    const activeEl = document.activeElement;
    const shouldNotFocusTrigger = activeEl !== document.body && activeEl !== this.anchorElementRef?.nativeElement;

    if (this.noFocus || shouldNotFocusTrigger) {
      return;
    }

    this.anchorElementRef?.nativeElement?.focus();
  }

  setCloseFocus(): void {
    this.closeButtonRef.nativeElement?.focus();
  }

  private _createOverlayRef(): OverlayRef {
    //fetch all Scrolling Containers registered with CDK
    let scrollableAncestors: CdkScrollable[];
    if (this.anchorElementRef) {
      scrollableAncestors = this.scrollDispatcher.getAncestorScrollContainers(this.anchorElementRef);
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.anchorElementRef)
      .setOrigin(this.anchorElementRef)
      .withPush(true)
      .withPositions([this.preferredPosition, ...this.availablePositions])
      .withFlexibleDimensions(true)
      .withScrollableContainers(scrollableAncestors);

    const overlay = this.overlay.create(
      new OverlayConfig({
        // This is where we can pass externally facing inputs into the angular overlay API, and essentially proxy behaviors our users want directly to the CDK if they have them.
        positionStrategy: positionStrategy,
        scrollStrategy: this.getScrollStrategy(),
        panelClass: this.panelClass,
        hasBackdrop: this.hasBackdrop,
      })
    );

    this.subscriptions.push(
      positionStrategy?.positionChanges?.subscribe(change => {
        //Close the overlay when the Origin is clipped
        if (change.scrollableViewProperties.isOriginClipped) {
          // Running the zone is essential to invoke HostBinding
          this.zone.run(() => {
            this.open = false;
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
        // web components (cds-icon) register as outside pointer events, so if the event target is inside the content panel return early
        if (this.contentRef && this.contentRef.nativeElement.contains(event.target)) {
          return;
        }

        // Check if the same element that opened the popover is the same element triggering the outside pointer events (toggle button)
        const isToggleButton =
          this.openEvent &&
          ((this.openEvent.target as Element).contains(event.target as Element) ||
            (this.openEvent.target as Element).parentElement.contains(event.target as Element) ||
            this.openEvent.target === event.target);

        if (isToggleButton) {
          event.stopPropagation();
        }

        if (this.outsideClickClose || isToggleButton) {
          this.toggleWithEvent(event);
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
    this.setOpenedButtonFocus();
  }

  private getScrollStrategy(): ScrollStrategy {
    return this.scrollToClose ? this.overlay.scrollStrategies.close() : this.overlay.scrollStrategies.reposition();
  }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { hasModifierKey } from '@angular/cdk/keycodes';
import { ConnectedPosition, Overlay, OverlayConfig, OverlayContainer, OverlayRef } from '@angular/cdk/overlay';
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
import { fromEvent, merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ClrPopoverService } from './providers/popover.service';
import { ClrPopoverPosition, ClrPopoverType, mapPopoverKeyToPosition } from './utils/popover-positions';
import { Keys } from '../../utils/enums/keys.enum';
import { normalizeKey } from '../../utils/focus/key-focus/util';

/** @dynamic */
@Directive({
  selector: '[clrPopoverContent]',
})
export class ClrPopoverContent implements OnDestroy, AfterViewInit {
  private view: EmbeddedViewRef<void> | null = null;
  private elementRef: ElementRef | null = null;
  private domPortal: DomPortal | null = null;

  // State management
  private destroy$ = new Subject<void>();
  private overlayDetach$ = new Subject<void>(); // Specific closer for overlay instances
  private preferredPositionIsSet = false;
  private preferredPosition: ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
  };

  // Performance Observers
  private intersectionObserver: IntersectionObserver | null = null;

  constructor(
    element: ElementRef,
    private container: ViewContainerRef,
    @Optional() private template: TemplateRef<any>,
    overlayContainer: OverlayContainer,
    private overlay: Overlay,
    @Inject(ClrPopoverService) private popoverService: ClrPopoverService,
    private zone: NgZone
  ) {
    popoverService.panelClass.push('clr-popover-content');
    popoverService.defaultPosition = ClrPopoverPosition.BOTTOM_LEFT;
    popoverService.overlay = overlay;

    overlayContainer.getContainerElement().classList.add('clr-container-element');

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
      const posIndex = Object.values(ClrPopoverPosition).indexOf(position as ClrPopoverPosition);
      this.popoverService.position =
        posIndex > -1 ? (position as ClrPopoverPosition) : this.popoverService.defaultPosition;
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
  set outsideClickClose(clickToClose: boolean) {
    this.popoverService.outsideClickClose = !!clickToClose;
  }

  @Input('clrPopoverContentScrollToClose')
  set scrollToClose(scrollToClose: boolean) {
    this.popoverService.scrollToClose = !!scrollToClose;
  }

  ngAfterViewInit() {
    // 1. Listen to Service Open Changes
    this.popoverService.openChange.pipe(takeUntil(this.destroy$)).subscribe(isOpen => {
      isOpen ? this.showOverlay() : this.closePopover();
    });

    // 2. Initial Open Check
    if (this.popoverService.open) {
      this.showOverlay();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.removeOverlay();
  }

  private showOverlay() {
    if (this.popoverService.overlayRef) {
      return;
    }

    this.updatePreferredPosition();

    // 1. Create Overlay
    this.popoverService.overlayRef = this._createOverlayRef();
    this.renderTemplate();

    // 2. Attach Content
    if (!this.domPortal) {
      this.domPortal = new DomPortal<HTMLElement>(this.elementRef);
      this.popoverService.overlayRef.attach(this.domPortal);
    }

    // 3. Setup Listeners (Scroll & Visibility)
    // We do this AFTER attaching so we know the environment
    this.setupManualScrollListeners();
    this.setupIntersectionObserver();

    // 4. Notify & Focus
    this.zone.onStable.pipe(takeUntil(this.overlayDetach$)).subscribe(() => {
      this.popoverService.popoverVisibleEmit(true);
      this.elementRef?.nativeElement?.focus?.();
    });
  }

  private closePopover() {
    this.removeOverlay();
    this.popoverService.open = false; // Sync state

    // Restore focus
    const activeEl = document.activeElement;
    const isBody = activeEl === document.body;
    const isAnchor = activeEl === this.popoverService.anchorElementRef?.nativeElement;

    if (isBody || isAnchor) {
      this.popoverService.setOpenedButtonFocus();
    }
  }

  private removeOverlay(): void {
    // Trigger cleanup of overlay-specific subscriptions (scroll listeners, etc)
    this.overlayDetach$.next();

    if (this.popoverService.overlayRef) {
      this.popoverService.overlayRef.detach();
      this.popoverService.overlayRef.dispose();
      this.popoverService.overlayRef = null;
    }

    if (this.domPortal?.isAttached) {
      this.domPortal.detach();
    }

    this.domPortal = null;
    this.disconnectObserver(); // Stop visibility check

    if (this.view) {
      this.view.destroy();
      this.view = null;
    }

    if (this.template) {
      this.elementRef = null;
    }

    this.popoverService.popoverVisibleEmit(false);
  }

  private _createOverlayRef(): OverlayRef {
    const positionStrategy = this.getPositionStrategy();

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.noop(), // Manual handling active
      panelClass: this.popoverService.panelClass,
      hasBackdrop: this.popoverService.hasBackdrop,
    });

    const overlayRef = this.overlay.create(overlayConfig);
    this.setupOverlayEvents(overlayRef, positionStrategy);

    return overlayRef;
  }

  private getPositionStrategy() {
    this.updatePreferredPosition();

    return this.overlay
      .position()
      .flexibleConnectedTo(this.popoverService.anchorElementRef)
      .setOrigin(this.popoverService.anchorElementRef)
      .withPush(true)
      .withPositions([this.preferredPosition, ...this.popoverService.availablePositions])
      .withFlexibleDimensions(true);
  }

  /**
   * Since we don't use CdkScrollable, we manually find scrollable parents
   * and listen to their scroll events to update the overlay position.
   */
  private setupManualScrollListeners() {
    if (!this.popoverService.anchorElementRef) {
      return;
    }

    const scrollParents = this.getScrollParents(this.popoverService.anchorElementRef.nativeElement);
    console.log('scroll', scrollParents);

    // Create a stream of scroll events from all parents + window
    const scrollObservables = scrollParents.map(p => fromEvent(p, 'scroll', { passive: true }));
    // Add window scroll for safety
    scrollObservables.push(fromEvent(window, 'scroll', { passive: true }));

    merge(...scrollObservables)
      .pipe(
        takeUntil(this.overlayDetach$) // Stop listening when overlay closes
      )
      .subscribe(() => {
        if (this.popoverService.scrollToClose) {
          this.zone.run(() => this.closePopover());
        } else if (this.popoverService.overlayRef) {
          this.popoverService.overlayRef.updatePosition();
        }
      });
  }

  /**
   * DOM Traversal to find all parents with overflow: auto/scroll.
   * This is expensive, so we ONLY run it once inside showOverlay().
   */
  private getScrollParents(node: HTMLElement): (HTMLElement | Window)[] {
    const parents: (HTMLElement | Window)[] = [];
    let current = node.parentElement;

    while (current) {
      const style = getComputedStyle(current);
      const isScrollable = /(auto|scroll)/.test(style.overflow + style.overflowY + style.overflowX);

      if (isScrollable) {
        parents.push(current);
      }
      current = current.parentElement;
    }

    return parents;
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
      { root: null, threshold: 1 }
    );

    this.intersectionObserver.observe(this.popoverService.anchorElementRef.nativeElement);
  }

  private disconnectObserver() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
  }

  private setupOverlayEvents(overlayRef: OverlayRef, positionStrategy: any) {
    // 1. Service Position Updates
    this.popoverService
      .getPositionChange()
      .pipe(takeUntil(this.overlayDetach$))
      .subscribe(() => {
        overlayRef.updatePositionStrategy(this.getPositionStrategy());
        overlayRef.updatePosition();
      });

    // 2. Position Strategy Updates (e.g. pushed off screen)
    positionStrategy.positionChanges.pipe(takeUntil(this.overlayDetach$)).subscribe(change => {
      if (change.scrollableViewProperties.isOriginClipped) {
        this.zone.run(() => (this.popoverService.open = false));
      }
    });

    // 3. Keyboard (Escape)
    overlayRef
      .keydownEvents()
      .pipe(takeUntil(this.overlayDetach$))
      .subscribe(event => {
        if (normalizeKey(event.key) === Keys.Escape && !hasModifierKey(event)) {
          event.preventDefault();
          this.closePopover();
        }
      });

    // 4. Outside Clicks
    overlayRef
      .outsidePointerEvents()
      .pipe(takeUntil(this.overlayDetach$))
      .subscribe(event => {
        this.handleOutsideClick(event);
      });
  }

  private handleOutsideClick(event: MouseEvent) {
    const target = event.target as Element;

    // Inside content?
    if (this.elementRef && this.elementRef.nativeElement.contains(target)) {
      return;
    }

    // Inside trigger?
    const trigger = this.popoverService.openEvent?.target as Element;
    if (trigger && (trigger === target || trigger.contains(target))) {
      return;
    }

    if (this.popoverService.outsideClickClose) {
      this.zone.run(() => this.closePopover());
    }
  }

  private updatePreferredPosition() {
    if (this.preferredPositionIsSet) {
      return;
    }
    const positionKey = this.popoverService.position || this.popoverService.defaultPosition;
    this.preferredPosition = mapPopoverKeyToPosition(positionKey, this.popoverService.popoverType);
  }

  private renderTemplate() {
    if (!this.view && this.template) {
      this.view = this.container.createEmbeddedView(this.template);
      if (!this.elementRef) {
        this.elementRef = new ElementRef(this.view.rootNodes[0]);
      }
    }
  }
}

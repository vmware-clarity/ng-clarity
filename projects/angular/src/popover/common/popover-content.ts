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
import { fromEvent, Subscription } from 'rxjs';

import { ClrPopoverService } from './providers/popover.service';
import { ClrPopoverType, mapPopoverKeyToPosition } from './utils/popover-positions';
import { Keys } from '../../utils/enums/keys.enum';
import { normalizeKey } from '../../utils/focus/key-focus/util';

/** @dynamic */
@Directive({
  selector: '[clrPopoverContent]',
  standalone: false,
})
export class ClrPopoverContent implements OnDestroy, AfterViewInit {
  private view: EmbeddedViewRef<void>;

  private subscriptions: Subscription[] = [];
  private domPortal: DomPortal;
  private preferredPositionIsSet = false;
  private preferredPosition: ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
  };
  private scrollableParent: any;

  constructor(
    private container: ViewContainerRef,
    @Optional() private template: TemplateRef<any>,
    overlayContainer: OverlayContainer,

    private overlay: Overlay,
    @Inject(ClrPopoverService) private popoverService: ClrPopoverService,
    private scrollDispatcher: ScrollDispatcher,
    private zone: NgZone
  ) {
    popoverService.panelClass.push('clr-popover-content');
    popoverService.defaultPosition = 'bottom-left';
    popoverService.overlay = overlay;

    overlayContainer.getContainerElement().classList.add('clr-container-element');
  }

  @Input('clrPopoverContent')
  set open(value: boolean) {
    this.popoverService.open = !!value;
  }

  @Input('clrPopoverContentAt')
  set contentAt(position: string | ConnectedPosition) {
    if (typeof position === 'string') {
      // set the popover values based on menu position
      this.popoverService.position = position || this.popoverService.defaultPosition;
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

    if (this.popoverService.overlayRef) {
      this.popoverService.overlayRef.updateScrollStrategy(this.getScrollStrategy());
    }
  }

  ngAfterViewInit() {
    if (this.popoverService.open) {
      this.showOverlay();

      // this.popoverService.anchorElementRef
      //   ? this.showOverlay()
      //   : setTimeout(() => {
      //       this.showOverlay();
      //     }, 0);
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
          this.closePopover();
        }
      })
    );
  }

  ngOnDestroy() {
    this.removeOverlay();
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  setPreferredPosition() {
    if (this.preferredPositionIsSet) {
      return;
    }

    // Set default position to "top-right", if position is not available in the map
    const positionKey = this.popoverService.position
      ? this.popoverService.position
      : this.popoverService.defaultPosition;

    this.preferredPosition = mapPopoverKeyToPosition(positionKey, this.popoverService.popoverType);
  }

  private _createOverlayRef(): OverlayRef {
    const positionStrategy = this.getPositionStrategy();

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
      this.popoverService.getPositionChange().subscribe(() => {
        if (this.popoverService.overlayRef) {
          const strategy = this.getPositionStrategy();

          this.popoverService.overlayRef.updatePositionStrategy(strategy);
          this.popoverService.overlayRef.updatePosition();
        }
      }),
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

        if (isToggleButton) {
          event.stopPropagation();
        }

        if (this.popoverService.outsideClickClose || isToggleButton) {
          this.closePopover();
        }
      })
    );

    return overlay;
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
    this.removeOverlay();
    this.popoverService.open = false;

    const shouldFocusTrigger =
      document.activeElement === document.body ||
      document.activeElement === this.popoverService.anchorElementRef?.nativeElement;

    if (shouldFocusTrigger) {
      this.popoverService.setOpenedButtonFocus();
    }
  }

  private getScrollStrategy(): ScrollStrategy {
    return this.popoverService.scrollToClose
      ? this.overlay.scrollStrategies.close()
      : this.overlay.scrollStrategies.reposition({ autoClose: true });
  }

  private showOverlay() {
    this.setPreferredPosition(); //Preferred position defined by consumer

    if (!this.popoverService.overlayRef) {
      this.popoverService.overlayRef = this._createOverlayRef();
    }

    if (!this.view && this.template) {
      this.view = this.container.createEmbeddedView(this.template);

      if (!this.popoverService.contentRef) {
        const [rootNode] = this.view.rootNodes;
        this.popoverService.contentRef = new ElementRef(rootNode); // So we know where/what to set close focus on
      }
    }

    if (!this.domPortal) {
      this.domPortal = new DomPortal<HTMLElement>(this.popoverService.contentRef);
      this.popoverService.overlayRef.attach(this.domPortal);
    }

    setTimeout(() => {
      this.popoverService.popoverVisibleEmit(true);

      if (this.popoverService.contentRef?.nativeElement?.focus) {
        this.popoverService.contentRef.nativeElement.focus();
      }
    });
  }

  private removeOverlay(): void {
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
    this.popoverService.contentRef = null;
    this.view = null;

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
          if (this.popoverService.scrollToClose) {
            this.zone.run(() => {
              this.removeOverlay();
            });

            return;
          }

          if (this.popoverService.overlayRef) {
            if (this.elementIsVisibleInViewport(this.popoverService.anchorElementRef?.nativeElement)) {
              this.popoverService.overlayRef.updatePosition();
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
  private elementIsVisibleInViewport(el, partiallyVisible = false) {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return partiallyVisible
      ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
          ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
      : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
  }
}

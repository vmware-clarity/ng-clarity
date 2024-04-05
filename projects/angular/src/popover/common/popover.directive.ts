/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

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
import { AfterViewInit, ContentChild, Directive, NgZone, Renderer2 } from '@angular/core';
import { delay, fromEvent, Subscription } from 'rxjs';

import { ClrCDKPopoverPositions } from '../../utils/popover/enums/cdk-position.enum';
import { ClrTooltipContent, ClrTooltipTrigger } from '../tooltip';

@Directive({
  selector: 'clr-tooltip',
})
export class PopoverDirective implements AfterViewInit {
  @ContentChild(ClrTooltipContent) tooltipContent: ClrTooltipContent;
  @ContentChild(ClrTooltipTrigger) tooltipCTrigger: ClrTooltipTrigger;

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
    // private scrollDispatcher: ScrollDispatcher,
    private zone: NgZone,
    private overlay: Overlay
  ) {}

  ngAfterViewInit(): void {
    this.scrollableParent = this.getScrollParent(this.tooltipCTrigger.elementRef.nativeElement);
    this.listenToMouseEvents();
    // console.log(this.tooltipCTrigger.elementRef.nativeElement.closest('.content-area').setAttribute("cdk-scrollable",""));
  }

  listenToMouseEvents() {
    this.zone.runOutsideAngular(() => {
      this.subscriptions.push(
        fromEvent(this.tooltipCTrigger?.elementRef?.nativeElement, 'mouseenter')
          .pipe(delay(100))
          .subscribe(() => {
            this.showOverlay();
          }),
        fromEvent(this.tooltipCTrigger?.elementRef?.nativeElement, 'mouseleave')
          .pipe(delay(100))
          .subscribe(() => {
            this.removeOverlay();
          }),
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
    this.anchorWidth = this.tooltipCTrigger.elementRef.nativeElement.offsetWidth;
    this.anchorHeight = this.tooltipCTrigger.elementRef.nativeElement.offsetHeight;
    if (this.preferredPosition.originX === 'end' && this.preferredPosition.originY === 'center') {
      this.preferredPosition.offsetX = -this.anchorWidth;
    } else if (this.preferredPosition.originX === 'start' && this.preferredPosition.originY === 'center') {
      this.preferredPosition.offsetX = this.anchorWidth;
    } else if (this.preferredPosition.originX === 'start') {
      this.preferredPosition.offsetX = this.anchorWidth / 2;
    } else if (this.preferredPosition.originX === 'end') {
      this.preferredPosition.offsetX = -this.anchorWidth / 2;
    }
  }

  setPosition() {
    //Set default position to "top-right", if position is not available in the map
    this.preferredPosition =
      this.tooltipContent.position in ClrCDKPopoverPositions
        ? ClrCDKPopoverPositions[this.tooltipContent.position]
        : ClrCDKPopoverPositions['top-right'];
    this.setDynamicOffsetPosition();
  }

  showOverlay() {
    this.setPosition();
    if (!this.overlayRef) {
      this.overlayRef = this._createOverlayRef();
    }

    if (!this.domPortal) {
      this.domPortal = new DomPortal(this.tooltipContent.elementRef.nativeElement);
    }
    this.overlayRef.attach(this.domPortal);
    this.overlayRef.updatePosition();
    // const scrollStrategy: ScrollStrategy = new RepositionScrollStrategy(this.scrollDispatcher, this.viewportruler, this.zone);
    // this.overlayRef.updateScrollStrategy(scrollStrategy);
  }

  removeOverlay(): void {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
    if (this.domPortal.isAttached) {
      this.domPortal.detach();
    }
  }

  private _createOverlayRef(): OverlayRef {
    const overlay = this.overlay.create(
      new OverlayConfig({
        // This is where we can pass externally facing inputs into the angular overlay API, and essentially proxy behaviors our users want directly to the CDK if they have them.
        positionStrategy: this.overlay
          .position()
          .flexibleConnectedTo(this.tooltipCTrigger.elementRef.nativeElement)
          .setOrigin(this.tooltipCTrigger.elementRef.nativeElement)
          // .withScrollableContainers([this.scrollableParent.scrollParent])
          .withPush(false)
          .withPositions([this.preferredPosition, ...this.positions]),
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
        panelClass: 'clr-tooltip-container',
        hasBackdrop: false,
      })
    );
    return overlay;
  }
}

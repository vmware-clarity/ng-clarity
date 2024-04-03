/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayContainer,
  OverlayRef,
  STANDARD_DROPDOWN_BELOW_POSITIONS,
} from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { AfterViewInit, ContentChild, Directive, ElementRef, NgZone } from '@angular/core';
import { delay, fromEvent, Subscription } from 'rxjs';

import { ClrCDKPopoverPositions } from '../../utils/popover/enums/cdk-position.enum';
import { ClrTooltipContent, ClrTooltipTrigger } from '../tooltip';

@Directive({
  selector: 'clr-tooltip',
})
export class PopoverDirective implements AfterViewInit {
  @ContentChild(ClrTooltipContent) tooltipContent: ClrTooltipContent;
  @ContentChild(ClrTooltipTrigger) tooltipCTrigger: ClrTooltipTrigger;

  anchor: ElementRef;
  private subscriptions: Subscription[] = [];
  private overlayRef: OverlayRef = null;
  private domPortal: DomPortal;
  private preferredPosition: ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
  };
  private _open = false;
  private parentHost: ElementRef;
  private position: string;
  private anchorWidth: number;
  private anchorHeight: number;

  private positions: ConnectedPosition[] = STANDARD_DROPDOWN_BELOW_POSITIONS;

  constructor(private zone: NgZone, private overlay: Overlay, private overlayContainer: OverlayContainer) {}

  ngAfterViewInit(): void {
    this.listenToMouseEvents();

    //Below is only for poc purpose. Need to be cleanedup
    this.anchorWidth = this.tooltipCTrigger.elementRef.nativeElement.offsetWidth / 2;
    this.anchorHeight = this.tooltipCTrigger.elementRef.nativeElement.offsetHeight / 2;
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
          })
      );
    });
  }

  setPosition() {
    //Set default position to "top-right" if position is not available in the map
    this.preferredPosition =
      this.tooltipContent.position in ClrCDKPopoverPositions
        ? ClrCDKPopoverPositions[this.tooltipContent.position]
        : ClrCDKPopoverPositions['top-right'];
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
          // .withDefaultOffsetX(-this.anchorWidth)
          // .withDefaultOffsetY(-this.anchorHeight)
          .withPositions([this.preferredPosition, ...this.positions]),
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
        panelClass: 'clr-tooltip-container',
        hasBackdrop: false,
      })
    );
    return overlay;
  }
}

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
import { AfterViewInit, ContentChild, Directive, ElementRef, EmbeddedViewRef, NgZone } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

import { ClrPopoverPosition } from '../../utils';
import { ClrTooltipContent, ClrTooltipTrigger } from '../tooltip';

@Directive({
  selector: 'clr-tooltip',
})
export class PopoverDirective implements AfterViewInit {
  @ContentChild(ClrTooltipContent) tooltipContent1: ClrTooltipContent;
  @ContentChild(ClrTooltipTrigger) tooltipCTrigger1: ClrTooltipTrigger;

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
  private view: EmbeddedViewRef<void>;
  private position: string;

  private positions: ConnectedPosition[] = STANDARD_DROPDOWN_BELOW_POSITIONS;
  private popoverPosition: ClrPopoverPosition;

  constructor(
    private zone: NgZone,
    private overlay: Overlay,
    // private container: ViewContainerRef,
    private overlayContainer: OverlayContainer // private template: TemplateRef<any>,
  ) {
    this.overlayContainer.getContainerElement().classList.add('clr-container-element');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      console.log('tooltipContent', this.tooltipContent1, this.tooltipCTrigger1);
    }, 3000);
    this.setPosition();
    this.listenToMouseEvents();
  }

  listenToMouseEvents() {
    this.zone.runOutsideAngular(() => {
      this.subscriptions.push(
        fromEvent(this.tooltipCTrigger1.elementRef.nativeElement, 'mouseenter').subscribe(() => {
          console.log('Mouse Enter');
          this.showOverlay();
        }),
        fromEvent(this.tooltipCTrigger1.elementRef.nativeElement, 'mouseleave').subscribe(() => {
          console.log('Mouse Leave ');
          this.removeOverlay();
        })
      );
    });
  }

  setPosition() {
    this.preferredPosition.originX = 'start';
    this.preferredPosition.originY = 'top';
    this.preferredPosition.overlayX = 'start';
    this.preferredPosition.overlayY = 'bottom';
  }

  showOverlay() {
    if (!this.overlayRef) {
      this.overlayRef = this._createOverlayRef();
    }

    if (!this.view) {
      this.domPortal = new DomPortal(this.tooltipContent1.elementRef.nativeElement);
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
          .flexibleConnectedTo(this.tooltipContent1.elementRef.nativeElement)
          .setOrigin(this.tooltipCTrigger1.elementRef.nativeElement)
          .withPositions([this.preferredPosition, ...this.positions]),
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        panelClass: 'clr-tooltip',
        hasBackdrop: false,
      })
    );
    return overlay;
  }
}

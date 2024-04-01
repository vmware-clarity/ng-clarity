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
import { ElementRef, EmbeddedViewRef, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrPopoverPosition } from '../interfaces/popover-position.interface';
// import { ClrPopoverService } from '../providers/popover.service';

@Injectable({
  providedIn: 'root',
})
export class PopoverCdkService {
  private subscriptions = new Subscription();
  private overlayRef: OverlayRef = null;
  private domPortal: DomPortal;
  private preferredPosition: ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
  };
  private _open = false;
  private contentRef: ElementRef;
  private parentHost: ElementRef;
  private view: EmbeddedViewRef<void>;
  private position: string;

  private positions: ConnectedPosition[] = STANDARD_DROPDOWN_BELOW_POSITIONS;
  private popoverPosition: ClrPopoverPosition;

  constructor(
    private overlay: Overlay,
    // private container: ViewContainerRef,
    private overlayContainer: OverlayContainer // private template: TemplateRef<any>,
  ) {
    this.overlayContainer.getContainerElement().classList.add('clr-container-element');
  }

  get open(): boolean {
    return this._open;
  }

  setPosition() {
    this.preferredPosition.originY = 'top';
    this.preferredPosition.overlayY = 'top';
    this.preferredPosition.originX = 'end';
    this.preferredPosition.overlayX = 'end';
  }

  referenceElement(ref: ElementRef) {
    console.log('Reference', ref);
    this.contentRef = ref;
  }

  showOverlay() {
    if (!this.overlayRef) {
      this.overlayRef = this._createOverlayRef();
    }

    if (!this.view) {
      // this.view = this.container.createEmbeddedView(this.template);
      // const [rootNode] = this.view.rootNodes;
      // this.contentRef = new ElementRef(rootNode); // So we know where/what to set close focus on
      // this.domPortal = new DomPortal<HTMLElement>(this.contentRef);
      // console.log(this.contentRef);
      this.domPortal = new DomPortal(this.contentRef.nativeElement);
    }
    this.overlayRef.attach(this.domPortal);

    // setTimeout(() => this.popoverService.popoverVisibleEmit(true));
  }

  removeOverlay(): void {
    // console.log("remove");
    // if (!this.view) {
    //   return;
    // }
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
    if (this.domPortal.isAttached) {
      this.domPortal.detach();
    }
    // if (this.view) {
    // this.view.destroy();
    // this.view = null;
    // }

    // this.popoverService.popoverVisibleEmit(false);
  }

  private _createOverlayRef(): OverlayRef {
    const overlay = this.overlay.create(
      new OverlayConfig({
        // This is where we can pass externally facing inputs into the angular overlay API, and essentially proxy behaviors our users want directly to the CDK if they have them.
        positionStrategy: this.overlay
          .position()
          .flexibleConnectedTo(this.contentRef)
          .withPositions([this.preferredPosition, ...this.positions]),
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        panelClass: 'clr-tooltip-content',
        hasBackdrop: false,
      })
    );
    return overlay;
  }

  // private parsePositionObject(position: ClrPopoverPosition) {
  //   if (position.axis === ClrAxis.VERTICAL) {
  //     // top or bottom
  //     if (position.side === ClrSide.BEFORE) {
  //       // above
  //       this.preferredPosition.originY = 'top';
  //       this.preferredPosition.overlayY = 'bottom';
  //     } else {
  //       // below
  //       this.preferredPosition.originY = 'bottom';
  //       this.preferredPosition.overlayY = 'top';
  //     }
  //     switch (position.anchor) {
  //       case ClrAlignment.START:
  //         this.preferredPosition.originX = 'start';
  //         break;
  //       case ClrAlignment.CENTER:
  //         this.preferredPosition.originX = 'center';
  //         break;
  //       default: // end
  //         this.preferredPosition.originX = 'end';
  //     }
  //     switch (position.content) {
  //       case ClrAlignment.START:
  //         this.preferredPosition.overlayX = 'start';
  //         break;
  //       case ClrAlignment.CENTER:
  //         this.preferredPosition.overlayX = 'center';
  //         break;
  //       default: // end
  //         this.preferredPosition.overlayX = 'end';
  //     }
  //   } else {
  //     // Horizontal
  //     if (position.side === ClrSide.BEFORE) {
  //       // left
  //       this.preferredPosition.originX = 'start';
  //       this.preferredPosition.overlayX = 'end';
  //     } else {
  //       // right
  //       this.preferredPosition.originX = 'end';
  //       this.preferredPosition.overlayX = 'start';
  //     }
  //     switch (position.anchor) {
  //       case ClrAlignment.START:
  //         this.preferredPosition.originY = 'top';
  //         break;
  //       case ClrAlignment.CENTER:
  //         this.preferredPosition.originY = 'center';
  //         break;
  //       default: // end
  //         this.preferredPosition.originY = 'bottom';
  //     }
  //     switch (position.content) {
  //       case ClrAlignment.START:
  //         this.preferredPosition.overlayY = 'top';
  //         break;
  //       case ClrAlignment.CENTER:
  //         this.preferredPosition.overlayY = 'center';
  //         break;
  //       default: // end
  //         this.preferredPosition.overlayY = 'bottom';
  //     }
  //   }
  // }
}

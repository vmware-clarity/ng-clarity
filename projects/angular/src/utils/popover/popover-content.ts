/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayContainer,
  OverlayRef,
  STANDARD_DROPDOWN_BELOW_POSITIONS,
} from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  EmbeddedViewRef,
  Inject,
  Input,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrAlignment } from './enums/alignment.enum';
import { ClrAxis } from './enums/axis.enum';
import { ClrSide } from './enums/side.enum';
import { ClrPopoverPosition } from './interfaces/popover-position.interface';
import { ClrPopoverService } from './providers/popover.service';

/** @dynamic */
@Directive({
  selector: '[clrPopoverContent]',
  standalone: false,
})
export class ClrPopoverContent implements OnDestroy {
  private view: EmbeddedViewRef<void>;
  private domPortal: DomPortal;
  private subscriptions = new Subscription();
  private overlayRef: OverlayRef = null;
  private preferredPosition: ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
  };

  private positions: ConnectedPosition[] = STANDARD_DROPDOWN_BELOW_POSITIONS;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private container: ViewContainerRef,
    private template: TemplateRef<any>,
    private renderer: Renderer2,
    private overlay: Overlay,
    private overlayContainer: OverlayContainer,
    private popoverService: ClrPopoverService
  ) {
    overlayContainer.getContainerElement().classList.add('clr-container-element');
  }

  @Input('clrPopoverContent')
  set open(value: boolean) {
    this.popoverService.open = !!value;
  }

  @Input('clrPopoverContentAt')
  set contentAt(position: ClrPopoverPosition | ConnectedPosition[]) {
    if (Array.isArray(position)) {
      this.positions = position;
    } else {
      //TODO: remap these positions to something the CDK Overlay can use
      this.parsePositionObject(position);
    }
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
    if (this.popoverService.open) {
      this.showOverlay();
    }
    this.subscriptions.add(
      this.popoverService.openChange.subscribe(change => {
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
    this.subscriptions.unsubscribe();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  private _createOverlayRef(): OverlayRef {
    const overlay = this.overlay.create(
      new OverlayConfig({
        // This is where we can pass externally facing inputs into the angular overlay API, and essentially proxy behaviors our users want directly to the CDK if they have them.
        positionStrategy: this.overlay
          .position()
          .flexibleConnectedTo(this.popoverService.anchorElementRef)
          .withPositions([this.preferredPosition, ...this.positions]),
        scrollStrategy: this.popoverService.scrollToClose
          ? this.overlay.scrollStrategies.close()
          : this.overlay.scrollStrategies.reposition(),
        panelClass: 'clr-popover-content',
        hasBackdrop: false,
      })
    );

    this.subscriptions.add(
      overlay.keydownEvents().subscribe(event => {
        if (event.keyCode === ESCAPE && !hasModifierKey(event)) {
          event.preventDefault();
          this.popoverService.open = false;
          this.popoverService.setOpenedButtonFocus();
        }
      })
    );
    this.subscriptions.add(
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
    this.subscriptions.add(
      overlay.detachments().subscribe(() => {
        this.popoverService.open = false;
        this.popoverService.setOpenedButtonFocus();
      })
    );

    return overlay;
  }

  private showOverlay() {
    if (!this.overlayRef) {
      this.overlayRef = this._createOverlayRef();
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
    if (!this.view) {
      return;
    }
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
    if (this.domPortal.isAttached) {
      this.domPortal.detach();
    }
    if (this.view) {
      this.view.destroy();
      this.view = null;
    }

    this.popoverService.popoverVisibleEmit(false);
  }

  private parsePositionObject(position: ClrPopoverPosition) {
    if (position.axis === ClrAxis.VERTICAL) {
      // top or bottom
      if (position.side === ClrSide.BEFORE) {
        // above
        this.preferredPosition.originY = 'top';
        this.preferredPosition.overlayY = 'bottom';
      } else {
        // below
        this.preferredPosition.originY = 'bottom';
        this.preferredPosition.overlayY = 'top';
      }
      switch (position.anchor) {
        case ClrAlignment.START:
          this.preferredPosition.originX = 'start';
          break;
        case ClrAlignment.CENTER:
          this.preferredPosition.originX = 'center';
          break;
        default: // end
          this.preferredPosition.originX = 'end';
      }
      switch (position.content) {
        case ClrAlignment.START:
          this.preferredPosition.overlayX = 'start';
          break;
        case ClrAlignment.CENTER:
          this.preferredPosition.overlayX = 'center';
          break;
        default: // end
          this.preferredPosition.overlayX = 'end';
      }
    } else {
      // Horizontal
      if (position.side === ClrSide.BEFORE) {
        // left
        this.preferredPosition.originX = 'start';
        this.preferredPosition.overlayX = 'end';
      } else {
        // right
        this.preferredPosition.originX = 'end';
        this.preferredPosition.overlayX = 'start';
      }
      switch (position.anchor) {
        case ClrAlignment.START:
          this.preferredPosition.originY = 'top';
          break;
        case ClrAlignment.CENTER:
          this.preferredPosition.originY = 'center';
          break;
        default: // end
          this.preferredPosition.originY = 'bottom';
      }
      switch (position.content) {
        case ClrAlignment.START:
          this.preferredPosition.overlayY = 'top';
          break;
        case ClrAlignment.CENTER:
          this.preferredPosition.overlayY = 'center';
          break;
        default: // end
          this.preferredPosition.overlayY = 'bottom';
      }
    }
  }
}

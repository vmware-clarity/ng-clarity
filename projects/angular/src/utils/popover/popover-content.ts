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
  STANDARD_DROPDOWN_BELOW_POSITIONS,
} from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  Directive,
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
import { ClrPopoverEventsService } from './providers/popover-events.service';
import { ClrPopoverToggleService } from './providers/popover-toggle.service';

/** @dynamic */
@Directive({
  selector: '[clrPopoverContent]',
})
export class ClrPopoverContent implements OnDestroy {
  private view: EmbeddedViewRef<void>;
  private subscriptions: Subscription[] = [];
  private overlayRef: OverlayRef = null;
  private preferredPosition: ConnectedPosition = {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'bottom',
  };

  private positions: ConnectedPosition[] = STANDARD_DROPDOWN_BELOW_POSITIONS;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private container: ViewContainerRef,
    private template: TemplateRef<any>,
    private renderer: Renderer2,
    private overlay: Overlay,
    private smartEventsService: ClrPopoverEventsService,
    private smartOpenService: ClrPopoverToggleService
  ) {}

  @Input('clrPopoverContent')
  set open(value: boolean) {
    this.smartOpenService.open = !!value;
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
    this.smartEventsService.outsideClickClose = !!clickToClose;
  }

  @Input('clrPopoverContentScrollToClose')
  set scrollToClose(scrollToClose: boolean) {
    this.smartEventsService.scrollToClose = !!scrollToClose;
  }

  ngAfterViewInit() {
    if (this.smartOpenService.open) {
      this.addContent();
    }
    this.subscriptions.push(
      this.smartOpenService.openChange.subscribe(change => {
        if (change) {
          this.addContent();
        } else {
          this.removeContent();
        }
      })
    );
  }

  ngOnDestroy() {
    this.removeContent();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private addContent() {
    this.overlayRef = this.overlay.create(
      new OverlayConfig({
        // This is where we can pass externally facing inputs into the angular overlay API, and essentially proxy behaviors our users want directly to the CDK if they have them.
        positionStrategy: this.overlay
          .position()
          .flexibleConnectedTo(this.smartEventsService.anchorButtonRef)
          .withPositions(this.positions)
          .withGrowAfterOpen(),
        scrollStrategy: this.scrollToClose
          ? this.overlay.scrollStrategies.close()
          : this.overlay.scrollStrategies.reposition(),
        panelClass: 'clr-popover-content',
        // In order to get access to the backdrop clicks to close the popover, we need to have a backdrop.
        // The CDK provides a transparent and non-transparent class we can use as a scrim. Again, this is
        // something we can parameterize as part of our API (modals get a non-transparent scrim, most other
        // components don't).
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-transparent-backdrop',
      })
    );

    this.overlayRef.backdropClick().subscribe(() => this.backdropClick());
    // TemplatePortals don't use the provided viewContainerRef to create the embedded template, they use
    // the portal ref. The DomPortal allows the content to be rendered inline and then moves it to the
    // overlay, which works seamlessly with the previous version of this utility.
    this.view = this.container.createEmbeddedView(this.template);
    const [rootNode] = this.view.rootNodes;

    const domPortal = new DomPortal(rootNode);

    this.overlayRef.attach(domPortal);

    this.smartEventsService.contentRef = rootNode; // So we know where/what to set close focus on
  }

  private backdropClick() {
    if (this.smartEventsService.outsideClickClose) {
      this.smartOpenService.open = false;
    }
  }

  private removeContent(): void {
    if (!this.view) {
      return;
    }
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.view.destroy();
    delete this.view;
    this.smartOpenService.popoverVisibleEmit(false);
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

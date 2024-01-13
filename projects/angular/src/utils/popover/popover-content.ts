/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Overlay, OverlayConfig, OverlayRef, STANDARD_DROPDOWN_BELOW_POSITIONS } from '@angular/cdk/overlay';
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
  set contentAt(position: ClrPopoverPosition) {
    //TODO: remap these positions to something the CDK Overlay can use
    // this.smartPositionService.position = position;
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
    console.log('addContent');
    this.overlayRef = this.overlay.create(
      new OverlayConfig({
        // This is where we can pass externally facing inputs into the angular overlay API, and essentially proxy behaviors our users want directly to the CDK if they have them.
        positionStrategy: this.overlay
          .position()
          .flexibleConnectedTo(this.smartEventsService.anchorButtonRef)
          .withPositions([{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }])
          .withGrowAfterOpen()
          .withPositions(STANDARD_DROPDOWN_BELOW_POSITIONS),
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
    // This could use some deeper investigation. Ideally, we'd use a TemplatePortal here, but
    // when attaching the view to the overlayRef, the templateRef loses all context and the component
    // fails to render (even though we pass in the same ViewContainerRef).
    // const templatePortal = new TemplatePortal(this.template, this.container);

    // Rendering the view the old way allows us to create a DomPortal which gives us our desired outcome
    // but it also seems like we're working around something that shouldn't be an issue.
    this.view = this.container.createEmbeddedView(this.template);
    const [rootNode] = this.view.rootNodes;

    const domPortal = new DomPortal(rootNode);

    domPortal.setAttachedHost(this.overlayRef);

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
    }
    this.view.destroy();
    delete this.view;
    this.smartOpenService.popoverVisibleEmit(false);
  }
}

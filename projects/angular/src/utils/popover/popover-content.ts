/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT } from '@angular/common';
import {
  AfterContentChecked,
  Directive,
  EmbeddedViewRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ClrPopoverPosition } from './interfaces/popover-position.interface';
import { ClrPopoverEventsService } from './providers/popover-events.service';
import { ClrPopoverPositionService } from './providers/popover-position.service';
import { ClrPopoverToggleService } from './providers/popover-toggle.service';

// https://github.com/angular/angular/issues/20351#issuecomment-344009887
/** @dynamic */
@Directive({
  selector: '[clrPopoverContent]',
})
export class ClrPopoverContent implements AfterContentChecked, OnDestroy {
  private view: EmbeddedViewRef<void>;
  private subscriptions: Subscription[] = [];
  private removeClickListenerFn: VoidFunction | null = null;

  private shouldRealign = false;

  // Check-collector pattern:
  // In order to get accurate content height/width values, we cannot calculate alignment offsets until
  // after the projected content has stabilized.
  // As multiple check events may happen in the same rendering cycle, we need to collect all events
  // and only act after the content is really stable. Or we may get wrong intermediate positioning values.
  // We will channel subsequent content check events through this observable.
  private checkCollector = new EventEmitter<void>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private container: ViewContainerRef,
    private template: TemplateRef<any>,
    private renderer: Renderer2,
    private smartPositionService: ClrPopoverPositionService,
    private smartEventsService: ClrPopoverEventsService,
    private smartOpenService: ClrPopoverToggleService
  ) {}

  @Input('clrPopoverContent')
  set open(value: boolean) {
    this.smartOpenService.open = !!value;
  }

  @Input('clrPopoverContentAt')
  set contentAt(position: ClrPopoverPosition) {
    this.smartPositionService.position = position;
  }

  @Input('clrPopoverContentOutsideClickToClose')
  set outsideClickClose(clickToClose: boolean) {
    this.smartEventsService.outsideClickClose = !!clickToClose;
  }

  @Input('clrPopoverContentScrollToClose')
  set scrollToClose(scrollToClose: boolean) {
    this.smartEventsService.scrollToClose = !!scrollToClose;
  }

  ngAfterContentChecked(): void {
    if (this.smartOpenService.open && this.view && this.shouldRealign) {
      // Channel content-check event through the check-collector
      this.checkCollector.emit();
    }
  }

  ngAfterViewInit() {
    this.subscriptions.push(
      this.smartOpenService.openChange.subscribe(change => {
        if (change) {
          this.addContent();
        } else {
          this.removeContent();
        }
      }),
      this.smartPositionService.shouldRealign.subscribe(() => {
        this.shouldRealign = true;
      }),
      // Here we collect subsequent synchronously received content-check events and only take action
      // at the end of the cycle. See below for details on the check-collector pattern.
      this.checkCollector.pipe(debounceTime(0)).subscribe(() => {
        this.alignContent();
        this.shouldRealign = false;
        if (this.view) {
          this.renderer.setStyle(this.view.rootNodes[0], 'opacity', '1');
          this.smartOpenService.popoverVisibleEmit(true);
        }
      })
    );
  }

  ngOnDestroy() {
    this.removeContent();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * TODO(matt): investigate why DebugElement retains a reference to the nodes and causes a memory leak.
   * A note about the use of appendChild/removeChild
   * The DebugElement is keeping a reference to the detached node and its unclear why.
   * This does warrant further investigation. But, since it doesn't happen in production mode
   * it is a low priority issue for now.
   */
  private addContent() {
    // Create the view container
    this.view = this.container.createEmbeddedView(this.template);
    const [rootNode] = this.view.rootNodes;
    this.smartEventsService.contentRef = rootNode; // So we know where/what to set close focus on
    this.renderer.addClass(rootNode, 'clr-popover-content');
    // Reset to the begining of the document to be available for sizing/positioning calculations.
    // If we add new content to the bottom it triggers changes in the layout that may lead to false anchor
    // coordinates values.
    this.renderer.setStyle(rootNode, 'top', '0px');
    this.renderer.setStyle(rootNode, 'left', '0px');
    // We need to hide it during the calculation phase, while it's not yet finally positioned.
    this.renderer.setStyle(rootNode, 'opacity', '0');
    this.removeClickListenerFn = this.renderer.listen(rootNode, 'click', event => {
      this.smartOpenService.openEvent = event;
    });
    this.view.rootNodes.forEach(node => {
      this.renderer.appendChild(this.document.body, node);
    });
    // Mark for realingment on the next content-check cycle.
    this.shouldRealign = true;
  }

  private removeContent(): void {
    if (!this.view) {
      return;
    }
    if (this.removeClickListenerFn) {
      this.removeClickListenerFn();
      this.removeClickListenerFn = null;
    }
    this.view.rootNodes.forEach(node => this.renderer.removeChild(this.document.body, node));
    this.container.clear();
    delete this.view;
    this.smartOpenService.popoverVisibleEmit(false);
  }

  private alignContent() {
    if (!this.view) {
      return;
    }

    const positionCoords = this.smartPositionService.alignContent(this.view.rootNodes[0]);
    this.renderer.setStyle(this.view.rootNodes[0], 'top', `${positionCoords.yOffset}px`);
    this.renderer.setStyle(this.view.rootNodes[0], 'left', `${positionCoords.xOffset}px`);
    this.smartOpenService.popoverAlignedEmit(this.view.rootNodes[0]);
  }
}

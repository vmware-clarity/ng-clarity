/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Inject, NgZone, OnDestroy, Optional, SkipSelf, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { DragEventListenerService } from './providers/drag-event-listener.service';

// This structural directive will be used mainly together with `clr-draggable-ghost` directive inside of clrDraggable
// directive. The directive is responsible for instantiating `clr-draggable-ghost` directive only during dragging so
// that Angular Change Detection is prevented from running if a component or directive is placed inside of the
// `clr-draggable-ghost` directive.

@Directive({ selector: '[clrIfDragged]' })
export class ClrIfDragged<T> implements OnDestroy {
  private subscriptions: Subscription[];

  constructor(
    private template: TemplateRef<any>,
    @Optional()
    @SkipSelf()
    @Inject(ViewContainerRef)
    private container: ViewContainerRef | null,
    @Optional() @Inject(DragEventListenerService) private dragEventListener: DragEventListenerService<T> | null,
    private ngZone: NgZone
  ) {
    if (!this.dragEventListener || !this.container) {
      throw new Error('The *clrIfDragged directive can only be used inside of a clrDraggable directive.');
    }

    this.subscriptions = [
      this.dragEventListener.dragStarted.subscribe(() => {
        // Note: the `dragStarted` emits outside of the Angular zone, see `DragEventListenerService#broadcast`.
        // This won't trigger another change detection if it's already being run in the zone.
        this.ngZone.run(() => this.container.createEmbeddedView(this.template));
      }),
      this.dragEventListener.dragEnded.subscribe(() => {
        // Note: the `dragEnded` emits outside of the Angular zone, see `DragEventListenerService#broadcast`.
        // This won't trigger another change detection if it's already being run in the zone.
        this.ngZone.run(() => this.container.clear());
      }),
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
}

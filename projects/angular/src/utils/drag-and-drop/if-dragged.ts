/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Optional, SkipSelf, TemplateRef, ViewContainerRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ClrDestroyService } from '../destroy';
import { DragEventListenerService } from './providers/drag-event-listener.service';

// This structural directive will be used mainly together with `clr-draggable-ghost` directive inside of clrDraggable
// directive. The directive is responsible for instantiating `clr-draggable-ghost` directive only during dragging so
// that Angular Change Detection is prevented from running if a component or directive is placed inside of the
// `clr-draggable-ghost` directive.

@Directive({ selector: '[clrIfDragged]', providers: [ClrDestroyService] })
export class ClrIfDragged<T> {
  constructor(
    private template: TemplateRef<any>,
    @Optional()
    @SkipSelf()
    private container: ViewContainerRef,
    @Optional() private dragEventListener: DragEventListenerService<T>,
    destroy$: ClrDestroyService
  ) {
    if (!this.dragEventListener || !this.container) {
      throw new Error('The *clrIfDragged directive can only be used inside of a clrDraggable directive.');
    }

    this.dragEventListener.dragStarted.pipe(takeUntil(destroy$)).subscribe(() => {
      this.container.createEmbeddedView(this.template);
    });

    this.dragEventListener.dragEnded.pipe(takeUntil(destroy$)).subscribe(() => {
      this.container.clear();
    });
  }
}

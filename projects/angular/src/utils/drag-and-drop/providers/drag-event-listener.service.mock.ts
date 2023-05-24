/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { DragPointPosition } from '../interfaces/drag-event.interface';
import { DragEventListenerService } from './drag-event-listener.service';

// This mock service is necessary because the real service uses Renderer2 and attaches complex event listeners.
// This class mocks that as setting ".hasListener" to true
// when attachDragListener() is called and removes it when detachDragListener() is called.
@Injectable()
export class MockDragEventListener {
  draggableEl: any;
  dragStarted = new Subject<any>();
  dragMoved = new Subject<any>();
  dragEnded = new Subject<any>();
  dragStartPosition: DragPointPosition;

  private listeners: (() => void)[];

  attachDragListeners(draggableEl: any) {
    this.draggableEl = draggableEl;
    this.draggableEl.hasListener = true;
    this.draggableEl.setAttribute('hasListener', 'true');
    this.listeners = [
      () => {
        this.draggableEl.removeAttribute('hasListener');
      },
    ];
  }

  detachDragListeners() {
    if (this.listeners) {
      this.listeners.map(event => event());
    }
  }
}

export const MOCK_DRAG_EVENT_LISTENER_PROVIDER = {
  provide: DragEventListenerService,
  useClass: MockDragEventListener,
};

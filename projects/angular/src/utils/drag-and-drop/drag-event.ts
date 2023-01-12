/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DragEventInterface, DragPointPosition } from './interfaces/drag-event.interface';

// This class is used to convert an internal event
// to an external event to be emitted.
export class ClrDragEvent<T> {
  dragPosition: DragPointPosition;
  group: string | string[];
  dragDataTransfer: T;
  dropPointPosition: DragPointPosition;

  constructor(dragEvent: DragEventInterface<T>) {
    this.dragPosition = dragEvent.dragPosition;
    this.group = dragEvent.group;
    this.dragDataTransfer = dragEvent.dragDataTransfer;
    this.dropPointPosition = dragEvent.dropPointPosition;
  }
}

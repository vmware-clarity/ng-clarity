/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { cardDefaults } from '../appfx-card-container-constants';
import { ContainerService } from './container.service';

/**
 * Provides functionality to drag and drop cards with clr drag drop directives.
 */
@Injectable()
export class DragDropService {
  private dragOrder: number;

  constructor(private containerService: ContainerService) {}

  /**
   * Saves the order of drag order to plate at the drop order later.
   */
  onDragStart(cardId: string): void {
    const dragOrder = this.containerService.getCardOrder(cardId);
    if (dragOrder === cardDefaults.order) {
      return;
    }
    this.dragOrder = dragOrder;
  }

  /**
   * On drop move the cards from drag order to drop order.
   */
  onDragDrop(cardId: string): void {
    const dropOrder = this.containerService.getCardOrder(cardId);
    if (dropOrder === cardDefaults.order) {
      return;
    }
    this.containerService.moveCard(this.dragOrder, dropOrder);
  }
}

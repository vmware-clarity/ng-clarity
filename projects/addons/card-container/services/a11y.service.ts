/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { a11ykeys } from '@clr/addons/a11y';

import { cardDefaults } from '../appfx-card-container-constants';
import { ContainerService } from './container.service';

/**
 * Provides functionality to drag and drop cards with keyboard interaction
 */
@Injectable()
export class A11yService {
  private a11yMode: boolean;
  private a11yDragOrder: number = cardDefaults.order;
  private a11yDropOrder: number = cardDefaults.order;

  constructor(private containerService: ContainerService) {}

  /**
   * Selects the card on press of Enter Key
   * If it is first enter on the card container - updates the drag order
   * Else moves the card from drag order to drop order
   */
  selectCard(cardId: string): void {
    const cardOrder = this.containerService.getCardOrder(cardId);
    if (cardOrder === cardDefaults.order) {
      return;
    }

    if (this.a11yMode) {
      // if already in the drag card is already selected move it to the new drop position
      this.containerService.moveCard(this.a11yDragOrder, this.a11yDropOrder);
      // reset
      this.getOutOfA11yMode();
    } else {
      this.a11yDragOrder = cardOrder;
      this.a11yDropOrder = cardOrder;
      this.a11yMode = true;
    }
  }

  /**
   * Moves the drop position on Arrow Keys
   * Updates the drop placeholder according to the arrow key direction
   */
  moveDropPosition(arrowKey: string): void {
    if (!this.a11yMode) {
      return;
    }
    // move position of drop card
    // if leftArrowKey then to previous card
    if (arrowKey === a11ykeys.arrowLeft) {
      this.a11yDropOrder -= 1;
    }
    // if rightArrowKey then to next card
    if (arrowKey === a11ykeys.arrowRight) {
      this.a11yDropOrder += 1;
    }

    // if drop card goes before first card, move to last card
    this.a11yDropOrder = this.a11yDropOrder < 0 ? this.containerService.getVisibleCardsCount() - 1 : this.a11yDropOrder;

    // if drop card goes after last card, move to first card
    this.a11yDropOrder = this.a11yDropOrder > this.containerService.getVisibleCardsCount() - 1 ? 0 : this.a11yDropOrder;
  }

  /**
   * Get out of the Accessibility mode
   */
  getOutOfA11yMode(): void {
    this.a11yMode = false;
    this.a11yDropOrder = cardDefaults.order;
    this.a11yDragOrder = cardDefaults.order;
  }

  /**
   * checks if cardOrder is equal to a11yDragOrder
   */
  isSelected(cardId: string): boolean {
    const cardOrder = this.containerService.getCardOrder(cardId);
    return cardOrder !== cardDefaults.order && this.a11yDragOrder === cardOrder;
  }

  /**
   * checks if cardOrder is equal to a11yDropOrder
   */
  isDraggableOver(cardId: string): boolean {
    const cardOrder = this.containerService.getCardOrder(cardId);
    return cardOrder !== cardDefaults.order && this.a11yDropOrder === cardOrder;
  }
}

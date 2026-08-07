/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, Renderer2 } from '@angular/core';

import { cardSize } from '../appfx-card-container-constants';

/**
 * Provides functionality related to layout of cards like updating card sizes
 * adding scrolling inside card block depending on conditions
 */
@Injectable()
export class LayoutService {
  constructor(private renderer: Renderer2) {}

  /**
   * Updates the size of the cards according to the info provided
   */
  updateCardSize(element: HTMLElement, unitWidth: number = 1, unitHeight: number = 5) {
    const cardElement = element?.querySelector('.card') as HTMLElement;
    if (!cardElement) {
      return;
    }
    if (unitWidth > -1) {
      const cardWidth = this.calculateCardWidth(unitWidth);
      this.renderer.setStyle(cardElement, 'width', `${cardWidth}px`);
    } else {
      this.renderer.removeStyle(cardElement, 'width');
    }
    let cardBlockHeight = this.calculateCardHeight(unitHeight);
    // if .card-header is defined reduce header height(50px) from .card-block height
    // 5 unit -> 58*5 + 18*4 -> 362px - 50px -> 312px
    const cardHeader = cardElement.querySelector('.card-header') as HTMLElement;
    if (cardHeader) {
      cardBlockHeight -= cardSize.headerHeightInPixels;
      this.renderer.setStyle(cardHeader, 'height', `${cardSize.headerHeightInPixels}px`);
    }

    // if .card-footer is defined reduce footer height(50px) from .card-block height
    // 5 unit -> 58*5 + 18*4 -> 362px - 50px -> 312px
    const cardFooter = cardElement.querySelector('.card-footer') as HTMLElement;
    if (cardFooter) {
      cardBlockHeight -= cardSize.footerHeightInPixels;
      this.renderer.setStyle(cardFooter, 'height', `${cardSize.footerHeightInPixels}px`);
    }
    const cardBlock = cardElement.querySelector('.card-block') as HTMLElement;
    if (cardBlock) {
      if (unitHeight > -1) {
        this.renderer.setStyle(cardBlock, 'height', `${cardBlockHeight}px`);
      } else {
        this.renderer.removeStyle(cardBlock, 'height');
      }
      if (cardHeader) {
        this.renderer.setStyle(cardBlock, 'overflow-y', 'auto');
      }
    }
  }

  /**
   * card width is unitWidth * unitWidthInPixels(258px) + in between gutters * unitGutterSizeInPixels(18px)
   * in between gutters are number of units - 1
   * 1 unit -> 258px
   * 2 unit -> 258*2 + 18 -> 534px
   * 3 unit -> 258*3 + 18*2 -> 810px ....
   * @param unitWidth
   */
  private calculateCardWidth(unitWidth: number): number {
    return unitWidth * cardSize.unitWidthInPixels + (unitWidth - 1) * cardSize.unitGutterSizeInPixels;
  }

  /**
   * card height is unitHeight * unitHeightInPixels(258px) + in between gutters * unitGutterSizeInPixels(18px)
   * in between gutters are number of units - 1
   * 1 unit -> 58px
   * 5 unit -> 58*5 + 18*4 -> 362px
   * 7 unit -> 58*7 + 18*6 -> 514px ....
   * @param unitHeight
   */
  private calculateCardHeight(unitHeight: number): number {
    return unitHeight * cardSize.unitHeightInPixels + (unitHeight - 1) * cardSize.unitGutterSizeInPixels;
  }
}

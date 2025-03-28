/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CellCoordinates, KeyNavigationGridConfig } from '../key-navigation-grid.controller';
import { ClrDefaultKeyNavigationStrategy } from './default';

export class ClrExpandedDetailsRowKeyNavigationStrategy extends ClrDefaultKeyNavigationStrategy {
  constructor(
    host: HTMLElement,
    rows: NodeListOf<HTMLElement>,
    cells: NodeListOf<HTMLElement>,
    config: KeyNavigationGridConfig
  ) {
    super(host, rows, cells, config);
    console.log('constructor ClrExpandedDetailsRowKeyNavigationStrategy');
  }

  keyUp(currentCellCoords: CellCoordinates) {
    console.log('keyUp ClrExpandedDetailsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    if (currentCellCoords.y === 0) {
      return nextCellCoords;
    }

    nextCellCoords.y = currentCellCoords.y - 1;

    const isSingleCellExpandedRow = this.isSingleCellExpandedRow(currentCellCoords.y);
    const isActionCell = this.isActionCell(currentCellCoords);

    if (isSingleCellExpandedRow && !isActionCell) {
      if (this.isRowReplaced(currentCellCoords.y)) {
        nextCellCoords.y = nextCellCoords.y - 1;
      }

      switch (true) {
        case this.isDetailsRow(nextCellCoords.y):
          nextCellCoords.x = 0;
          break;
        case this.isDetailsRow(currentCellCoords.y) === false:
          nextCellCoords.x = currentCellCoords.x;
          break;
        default:
          nextCellCoords.x = this.actionCellCount(nextCellCoords.y);
      }

      return nextCellCoords;
    }

    /// TODO: more is needed
    return nextCellCoords;
  }

  keyDown(currentCellCoords: CellCoordinates) {
    console.log('keyDown ClrExpandedDetailsRowKeyNavigationStrategy');
    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    return nextCellCoords;
  }
  keyLeft(currentCellCoords: CellCoordinates) {
    console.log('keyLeft ClrExpandedDetailsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    if (!this.isDetailsRow(currentCellCoords.y) && !this.isRowReplaced(currentCellCoords.y)) {
      return super.keyLeft(currentCellCoords);
    }

    return nextCellCoords;
  }

  keyRight(currentCellCoords: CellCoordinates) {
    console.log('keyRight ClrExpandedDetailsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    if (!this.isDetailsRow(currentCellCoords.y) && !this.isRowReplaced(currentCellCoords.y)) {
      return super.keyRight(currentCellCoords);
    }

    return nextCellCoords;
  }

  keyEnd(currentCellCoords: CellCoordinates, ctrlKey: boolean) {
    console.log('keyEnd ClrExpandedDetailsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    if (!this.isDetailsRow(currentCellCoords.y) && !this.isRowReplaced(currentCellCoords.y)) {
      return super.keyEnd(currentCellCoords, ctrlKey);
    }

    return nextCellCoords;
  }

  keyHome(currentCellCoords: CellCoordinates, ctrlKey: boolean) {
    console.log('keyHome ClrExpandedDetailsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    if (!this.isDetailsRow(currentCellCoords.y) && !this.isRowReplaced(currentCellCoords.y)) {
      return super.keyHome(currentCellCoords, ctrlKey);
    }

    return nextCellCoords;
  }

  keyPageUp(currentCellCoords: CellCoordinates) {
    console.log('keyPageUp ClrExpandedDetailsRowKeyNavigationStrategy');

    const nextCellCoords = super.keyPageUp(currentCellCoords);

    return nextCellCoords;
  }

  keyPageDown(currentCellCoords: CellCoordinates) {
    console.log('keyPageDown ClrExpandedDetailsRowKeyNavigationStrategy');

    const nextCellCoords = super.keyPageDown(currentCellCoords);

    return nextCellCoords;
  }
}

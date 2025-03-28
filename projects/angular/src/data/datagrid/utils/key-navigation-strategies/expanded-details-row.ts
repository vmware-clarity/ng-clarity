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

    // const isSingleCellExpandedRow = this.isSingleCellExpandedRow(currentCellCoords.y);
    const isActionCell = this.isActionCell(currentCellCoords);

    if (!isActionCell) {
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
    }

    /// TODO: more is needed?

    return nextCellCoords;
  }

  keyDown(currentCellCoords: CellCoordinates) {
    console.log('keyDown ClrExpandedDetailsRowKeyNavigationStrategy');
    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    nextCellCoords.y = currentCellCoords.y + 1;

    const isActionCell = this.isActionCell(currentCellCoords);

    if (!isActionCell) {
      if (this.isRowReplaced(nextCellCoords.y)) {
        nextCellCoords.y = nextCellCoords.y + 1;
      }

      if (this.isDetailsRow(nextCellCoords.y)) {
        nextCellCoords.x = 0;
      } else {
        nextCellCoords.x = this.actionCellCount(nextCellCoords.y);
      }
    }

    return nextCellCoords;
  }

  keyLeft(currentCellCoords: CellCoordinates) {
    console.log('keyLeft ClrExpandedDetailsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    if (!this.isDetailsRow(currentCellCoords.y) && !this.isRowReplaced(currentCellCoords.y)) {
      return super.keyLeft(currentCellCoords);
    }

    if (currentCellCoords.x !== 0) {
      nextCellCoords.x = currentCellCoords.x - 1;
    } else if (!this.isActionCell(currentCellCoords)) {
      nextCellCoords.y = currentCellCoords.y - 1;
      nextCellCoords.x = this.actionCellCount(nextCellCoords.y) - 1;
    }

    return nextCellCoords;
  }

  keyRight(currentCellCoords: CellCoordinates) {
    console.log('keyRight ClrExpandedDetailsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    if (!this.isDetailsRow(currentCellCoords.y) && !this.isRowReplaced(currentCellCoords.y)) {
      return super.keyRight(currentCellCoords);
    }

    // calculate numOfColumns based on header cells.
    const numOfColumns = this.rows?.length - 1 ? this.getCellsForRow(0).length - 1 : 0;

    if (currentCellCoords.x >= numOfColumns) {
      return nextCellCoords;
    }

    if (
      this.isActionCell(currentCellCoords) &&
      currentCellCoords.x === this.actionCellCount(currentCellCoords.x) - 1 &&
      this.isRowReplaced(currentCellCoords.y) &&
      !this.isDetailsRow(currentCellCoords.y)
    ) {
      nextCellCoords.y = currentCellCoords.y + 1;
      nextCellCoords.x = 0;
    } else {
      nextCellCoords.x = currentCellCoords.x + 1;
    }

    return nextCellCoords;
  }

  keyEnd(currentCellCoords: CellCoordinates, ctrlKey: boolean) {
    console.log('keyEnd ClrExpandedDetailsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    if (!this.isDetailsRow(currentCellCoords.y) && !this.isRowReplaced(currentCellCoords.y)) {
      return super.keyEnd(currentCellCoords, ctrlKey);
    }

    nextCellCoords.x = this.getCellsForRow(currentCellCoords.y).length - 1;

    const numOfRows = this.rows ? this.rows.length - 1 : 0;
    const numOfColumns = numOfRows ? this.getCellsForRow(0).length - 1 : 0;
    if (ctrlKey) {
      nextCellCoords.x = numOfColumns;
      nextCellCoords.y = numOfRows;
    }

    return nextCellCoords;
  }

  keyHome(currentCellCoords: CellCoordinates, ctrlKey: boolean) {
    console.log('keyHome ClrExpandedDetailsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    if (!this.isDetailsRow(currentCellCoords.y) && !this.isRowReplaced(currentCellCoords.y)) {
      return super.keyHome(currentCellCoords, ctrlKey);
    }

    nextCellCoords.x = 0;
    nextCellCoords.y = currentCellCoords.y - 1;

    if (ctrlKey) {
      nextCellCoords.y = 0;
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

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { KeyNavigationGridStrategyInterface } from '../../interfaces/key-nav-grid-strategy.interface';
import { CellCoordinates } from '../key-navigation-grid.controller';
import { KeyNavigationUtils } from '../key-navigation-utils';

export class DefaultKeyNavigationStrategy implements KeyNavigationGridStrategyInterface {
  constructor(protected utils: KeyNavigationUtils) {}

  keyUp(currentCellCoords: CellCoordinates) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);

    if (currentCellCoords.y === 0) {
      return nextCellCoords;
    }

    nextCellCoords.y = currentCellCoords.y - 1;

    const isActionCell = this.utils.isActionCell(currentCellCoords);

    if (
      this.utils.isSingleCellExpandedRow(nextCellCoords.y) &&
      !isActionCell &&
      this.utils.isDetailsRow(nextCellCoords.y)
    ) {
      nextCellCoords.x = 0;
    } else if (this.utils.isDetailsRow(nextCellCoords.y)) {
      if (isActionCell) {
        nextCellCoords.y = nextCellCoords.y - 1;
      } else {
        nextCellCoords.x = nextCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
      }
    }

    return nextCellCoords;
  }

  keyDown(currentCellCoords: CellCoordinates) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);

    const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
    if (currentCellCoords.y >= numOfRows) {
      return nextCellCoords;
    }

    const isActionCell = this.utils.isActionCell(currentCellCoords);
    nextCellCoords.y = currentCellCoords.y + 1;

    if (!isActionCell && this.utils.isRowReplaced(nextCellCoords.y)) {
      nextCellCoords.y = nextCellCoords.y + 1;

      nextCellCoords.x = this.utils.isSingleCellExpandedRow(nextCellCoords.y)
        ? 0
        : nextCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
    }

    return nextCellCoords;
  }

  keyLeft(currentCellCoords: CellCoordinates) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);

    if (currentCellCoords.x === 0) {
      return nextCellCoords;
    }

    nextCellCoords.x = currentCellCoords.x - 1;

    return nextCellCoords;
  }

  keyRight(currentCellCoords: CellCoordinates) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);

    // calculate numOfColumns based on header cells.
    const numOfColumns = this.utils.rows?.length - 1 ? this.utils.getCellsForRow(0).length - 1 : 0;

    nextCellCoords.x = currentCellCoords.x < numOfColumns ? nextCellCoords.x + 1 : nextCellCoords.x;

    return nextCellCoords;
  }

  keyEnd(currentCellCoords: CellCoordinates, ctrlKey: boolean) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
    const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;

    // calculate X based on header cells.
    nextCellCoords.x = numOfRows ? this.utils.getCellsForRow(0).length - 1 : 0;

    if (ctrlKey) {
      nextCellCoords.y = numOfRows;

      if (this.utils.isDetailsRow(nextCellCoords.y)) {
        nextCellCoords.x = this.utils.getCellsForRow(nextCellCoords.y).length - 1;
      }
    }

    return nextCellCoords;
  }

  keyHome(currentCellCoords: CellCoordinates, ctrlKey: boolean) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);

    nextCellCoords.x = 0;

    if (ctrlKey) {
      nextCellCoords.y = 0;
    }

    return nextCellCoords;
  }

  keyPageUp(currentCellCoords: CellCoordinates) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
    const itemsPerPage = this.utils.itemsPerPage(nextCellCoords.y);

    nextCellCoords.y = currentCellCoords.y - itemsPerPage > 0 ? currentCellCoords.y - itemsPerPage + 1 : 1;

    if (!this.utils.isActionCell(currentCellCoords)) {
      if (this.utils.isDetailsRow(nextCellCoords.y)) {
        nextCellCoords.x = this.utils.isSingleCellExpandedRow(nextCellCoords.y)
          ? 0
          : nextCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
      } else if (this.utils.isRowReplaced(nextCellCoords.y)) {
        nextCellCoords.y = nextCellCoords.y + 1;

        nextCellCoords.x = this.utils.isSingleCellExpandedRow(nextCellCoords.y)
          ? 0
          : nextCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
      }
    } else {
      if (this.utils.isDetailsRow(nextCellCoords.y)) {
        nextCellCoords.y = nextCellCoords.y - 1;
      }
    }

    return nextCellCoords;
  }

  keyPageDown(currentCellCoords: CellCoordinates) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
    const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
    const itemsPerPage = this.utils.itemsPerPage(nextCellCoords.y);

    nextCellCoords.y = currentCellCoords.y + itemsPerPage >= numOfRows ? numOfRows : currentCellCoords.y + itemsPerPage;

    if (this.utils.isActionCell(currentCellCoords) && this.utils.isDetailsRow(nextCellCoords.y)) {
      nextCellCoords.y = nextCellCoords.y - 1;
    } else if (this.utils.isDetailsRow(nextCellCoords.y) && this.utils.isSingleCellExpandedRow(nextCellCoords.y)) {
      nextCellCoords.x = 0;
    } else if (this.utils.isDetailsRow(nextCellCoords.y)) {
      nextCellCoords.x = nextCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
    } else if (this.utils.isRowReplaced(nextCellCoords.y)) {
      nextCellCoords.y = nextCellCoords.y + 1;
      nextCellCoords.x = this.utils.isSingleCellExpandedRow(nextCellCoords.y)
        ? 0
        : nextCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
    }

    return nextCellCoords;
  }
}

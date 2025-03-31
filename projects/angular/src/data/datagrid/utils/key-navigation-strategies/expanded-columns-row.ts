/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CellCoordinates, KeyNavigationGridConfig } from '../key-navigation-grid.controller';
import { ClrDefaultKeyNavigationStrategy } from './default';

export class ClrExpandedColumnsRowKeyNavigationStrategy extends ClrDefaultKeyNavigationStrategy {
  constructor(
    host: HTMLElement,
    rows: NodeListOf<HTMLElement>,
    cells: NodeListOf<HTMLElement>,
    config: KeyNavigationGridConfig
  ) {
    super(host, rows, cells, config);

    console.log('constructor ClrExpandedColumnsRowKeyNavigationStrategy');
  }

  keyUp(currentCellCoords: CellCoordinates) {
    console.log('keyUp ClrExpandedColumnsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    if (currentCellCoords.y === 0) {
      return nextCellCoords;
    }

    nextCellCoords.y = currentCellCoords.y - 1;

    const isActionCell = this.isActionCell(currentCellCoords);

    if (isActionCell && this.isDetailsRow(nextCellCoords.y)) {
      nextCellCoords.y = nextCellCoords.y - 1;
    } else if (this.isRowReplaced(nextCellCoords.y)) {
      nextCellCoords.y = nextCellCoords.y - 1;

      if (!this.isDetailsRow(nextCellCoords.y)) {
        nextCellCoords.x = currentCellCoords.x + this.actionCellCount(nextCellCoords.y);
      }
    } else if (this.isDetailsRow(currentCellCoords.y) && !this.isDetailsRow(nextCellCoords.y)) {
      nextCellCoords.x = currentCellCoords.x + this.actionCellCount(nextCellCoords.y);
    } else if (!isActionCell && this.isDetailsRow(nextCellCoords.y)) {
      nextCellCoords.x = currentCellCoords.x - this.actionCellCount(currentCellCoords.y);
    }

    return nextCellCoords;
  }

  keyDown(currentCellCoords: CellCoordinates) {
    console.log('keyDown ClrExpandedColumnsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    const numOfRows = this.rows ? this.rows.length - 1 : 0;
    const numOfColumns = numOfRows ? this.getCellsForRow(0).length - 1 : 0;

    if (currentCellCoords.y >= numOfRows) {
      return nextCellCoords;
    }

    nextCellCoords.y = currentCellCoords.y + 1;
    const isActionCell = this.isActionCell(currentCellCoords);

    if (isActionCell || this.isRowReplaced(nextCellCoords.y)) {
      nextCellCoords.y = nextCellCoords.y + 1;
    } else if (this.getCellsForRow(currentCellCoords.y).length > numOfColumns) {
      nextCellCoords.x = currentCellCoords.x - this.actionCellCount(currentCellCoords.y);
    } else {
      nextCellCoords.x = currentCellCoords.x + this.actionCellCount(nextCellCoords.y);
    }

    return nextCellCoords;
  }

  keyLeft(currentCellCoords: CellCoordinates) {
    console.log('keyLeft ClrExpandedColumnsRowKeyNavigationStrategy');

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
    console.log('keyRight ClrExpandedColumnsRowKeyNavigationStrategy');

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
    console.log('keyEnd ClrExpandedColumnsRowKeyNavigationStrategy');

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
    console.log('keyHome ClrExpandedColumnsRowKeyNavigationStrategy');

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
    console.log('keyPageUp ClrExpandedColumnsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);
    const itemsPerPage = this.getItemsPerPage();

    nextCellCoords.y = currentCellCoords.y - itemsPerPage > 0 ? currentCellCoords.y - itemsPerPage + 1 : 1;

    if (!this.isActionCell(currentCellCoords)) {
      if (this.isRowReplaced(nextCellCoords.y)) {
        nextCellCoords.y = nextCellCoords.y + 1;

        if (this.isDetailsRow(nextCellCoords.y)) {
          nextCellCoords.x = currentCellCoords.x + this.actionCellCount(nextCellCoords.y);
        }
      } else if (this.isDetailsRow(currentCellCoords.y) && !this.isDetailsRow(nextCellCoords.y)) {
        nextCellCoords.x = currentCellCoords.x + this.actionCellCount(nextCellCoords.y);
      } else if (this.isDetailsRow(nextCellCoords.y)) {
        nextCellCoords.x = currentCellCoords.x - this.actionCellCount(currentCellCoords.y);
      }
    }

    return nextCellCoords;
  }

  keyPageDown(currentCellCoords: CellCoordinates) {
    console.log('keyPageDown ClrExpandedColumnsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    const numOfRows = this.rows ? this.rows.length - 1 : 0;
    const itemsPerPage = this.getItemsPerPage();
    const numOfColumns = numOfRows ? this.getCellsForRow(0).length - 1 : 0;

    nextCellCoords.y = currentCellCoords.y + itemsPerPage >= numOfRows ? numOfRows : currentCellCoords.y + itemsPerPage;

    // const isActionCell = this.isActionCell(currentCellCoords);

    if (this.isActionCell(currentCellCoords) || this.isRowReplaced(nextCellCoords.y)) {
      nextCellCoords.y = nextCellCoords.y - 1;
    } else if (this.getCellsForRow(currentCellCoords.y).length > numOfColumns) {
      nextCellCoords.x = currentCellCoords.x - this.actionCellCount(currentCellCoords.y);
    } else {
      nextCellCoords.x = currentCellCoords.x + this.actionCellCount(nextCellCoords.y);
    }

    // if (this.isActionCell(currentCellCoords) && this.isDetailsRow(nextCellCoords.y)) {
    //   console.log(1)
    //   nextCellCoords.y = nextCellCoords.y - 1;
    // } else if (this.isDetailsRow(nextCellCoords.y)) {
    //   console.log(2)
    //   nextCellCoords.x = nextCellCoords.x - this.actionCellCount(currentCellCoords.y);
    // } else if (this.isRowReplaced(nextCellCoords.y)) {
    //   console.log(3)
    //   nextCellCoords.y = nextCellCoords.y + 1;
    //   nextCellCoords.x = nextCellCoords.x - this.actionCellCount(currentCellCoords.y);
    // } else {
    //   console.log(4)
    //   nextCellCoords.x = nextCellCoords.x + this.actionCellCount(nextCellCoords.y);
    // }

    return nextCellCoords;
  }
}

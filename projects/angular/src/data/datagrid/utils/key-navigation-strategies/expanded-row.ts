/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CellCoordinates } from '../key-navigation-grid.controller';
import { DefaultKeyNavigationStrategy } from './default';

export class ExpandedRowKeyNavigationStrategy extends DefaultKeyNavigationStrategy {
  override keyUp(currentCellCoords: CellCoordinates) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);

    if (currentCellCoords.y === 0) {
      return nextCellCoords;
    }

    nextCellCoords.y = currentCellCoords.y - 1;

    if (!this.utils.isActionCell(currentCellCoords)) {
      if (this.utils.isRowReplaced(currentCellCoords.y)) {
        nextCellCoords.y = nextCellCoords.y - 1;
      }

      switch (true) {
        case this.utils.isDetailsRow(nextCellCoords.y):
          nextCellCoords.x = 0;
          break;
        case this.utils.isDetailsRow(currentCellCoords.y) === false:
          nextCellCoords.x = currentCellCoords.x;
          break;
        default:
          nextCellCoords.x = this.utils.actionCellCount(nextCellCoords.y);
      }
    } else if (this.utils.isDetailsRow(nextCellCoords.y) && nextCellCoords.y > 0) {
      nextCellCoords.y = nextCellCoords.y - 1;
    }

    return nextCellCoords;
  }

  override keyDown(currentCellCoords: CellCoordinates) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);

    const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
    if (currentCellCoords.y >= numOfRows) {
      return nextCellCoords;
    }

    nextCellCoords.y = currentCellCoords.y + 1;

    if (!this.utils.isActionCell(currentCellCoords)) {
      if (this.utils.isRowReplaced(nextCellCoords.y)) {
        nextCellCoords.y = nextCellCoords.y + 1;
      }

      if (this.utils.isDetailsRow(nextCellCoords.y)) {
        nextCellCoords.x = 0;
      } else {
        nextCellCoords.x = this.utils.actionCellCount(nextCellCoords.y);
      }
    } else {
      nextCellCoords.y = nextCellCoords.y < numOfRows ? nextCellCoords.y + 1 : nextCellCoords.y;
    }

    return nextCellCoords;
  }

  override keyLeft(currentCellCoords: CellCoordinates) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);

    if (!this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isRowReplaced(currentCellCoords.y)) {
      return super.keyLeft(currentCellCoords);
    }

    if (currentCellCoords.x !== 0) {
      nextCellCoords.x = currentCellCoords.x - 1;
    } else if (!this.utils.isActionCell(currentCellCoords)) {
      nextCellCoords.y = currentCellCoords.y - 1;
      nextCellCoords.x = this.utils.actionCellCount(nextCellCoords.y) - 1;
    }

    return nextCellCoords;
  }

  override keyRight(currentCellCoords: CellCoordinates) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);

    if (!this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isRowReplaced(currentCellCoords.y)) {
      return super.keyRight(currentCellCoords);
    }

    // calculate numOfColumns based on header cells.
    const numOfColumns = this.utils.rows?.length - 1 ? this.utils.getCellsForRow(0).length - 1 : 0;

    if (currentCellCoords.x >= numOfColumns) {
      return nextCellCoords;
    }

    if (
      this.utils.isActionCell(currentCellCoords) &&
      currentCellCoords.x === this.utils.actionCellCount(currentCellCoords.x) - 1 &&
      this.utils.isRowReplaced(currentCellCoords.y) &&
      !this.utils.isDetailsRow(currentCellCoords.y)
    ) {
      nextCellCoords.y = currentCellCoords.y + 1;
      nextCellCoords.x = 0;
    } else {
      nextCellCoords.x = currentCellCoords.x + 1;
    }

    return nextCellCoords;
  }

  override keyEnd(currentCellCoords: CellCoordinates, ctrlKey: boolean) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);

    if ((!this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isRowReplaced(currentCellCoords.y)) || ctrlKey) {
      return super.keyEnd(currentCellCoords, ctrlKey);
    }

    nextCellCoords.x = this.utils.getCellsForRow(currentCellCoords.y).length - 1;

    return nextCellCoords;
  }

  override keyHome(currentCellCoords: CellCoordinates, ctrlKey: boolean) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);

    if (!this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isRowReplaced(currentCellCoords.y)) {
      return super.keyHome(currentCellCoords, ctrlKey);
    }

    nextCellCoords.x = 0;
    nextCellCoords.y = currentCellCoords.y - 1;

    if (ctrlKey) {
      nextCellCoords.y = 0;
    }

    return nextCellCoords;
  }

  override keyPageUp(currentCellCoords: CellCoordinates) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
    const itemsPerPage = this.utils.itemsPerPage(nextCellCoords.y);

    nextCellCoords.y = currentCellCoords.y - itemsPerPage > 0 ? currentCellCoords.y - itemsPerPage + 1 : 1;

    if (!this.utils.isActionCell(currentCellCoords)) {
      if (this.utils.isRowReplaced(nextCellCoords.y)) {
        if (!this.utils.isDetailsRow(nextCellCoords.y)) {
          nextCellCoords.y = nextCellCoords.y + 1;
          nextCellCoords.x = 0;
        }
      } else if (!this.utils.isDetailsRow(currentCellCoords.y)) {
        if (this.utils.isDetailsRow(nextCellCoords.y)) {
          nextCellCoords.x = 0;
        }
      } else if (this.utils.isDetailsRow(currentCellCoords.y)) {
        if (!this.utils.isDetailsRow(nextCellCoords.y)) {
          nextCellCoords.x = this.utils.actionCellCount(nextCellCoords.y);
        }
      }
    } else if (this.utils.isDetailsRow(nextCellCoords.y)) {
      nextCellCoords.y = nextCellCoords.y - 1;
    }

    return nextCellCoords;
  }

  override keyPageDown(currentCellCoords: CellCoordinates) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);

    const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
    const itemsPerPage = this.utils.itemsPerPage(nextCellCoords.y);

    nextCellCoords.y = currentCellCoords.y + itemsPerPage >= numOfRows ? numOfRows : currentCellCoords.y + itemsPerPage;

    if (!this.utils.isActionCell(currentCellCoords)) {
      if (this.utils.isRowReplaced(nextCellCoords.y)) {
        if (nextCellCoords.y < numOfRows && !this.utils.isDetailsRow(nextCellCoords.y)) {
          nextCellCoords.y = nextCellCoords.y + 1;
        }
      } else if (this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isDetailsRow(nextCellCoords.y)) {
        nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
      } else if (this.utils.isDetailsRow(nextCellCoords.y)) {
        nextCellCoords.x = 0;
      }
    } else if (this.utils.isDetailsRow(nextCellCoords.y)) {
      nextCellCoords.y = nextCellCoords.y - 1;
    }

    return nextCellCoords;
  }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CellCoordinates } from '../key-navigation-grid.controller';
import { ExpandedRowKeyNavigationStrategy } from './expanded-row';

export class ExpandedColumnsRowKeyNavigationStrategy extends ExpandedRowKeyNavigationStrategy {
  override keyUp(currentCellCoords: CellCoordinates) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);

    if (currentCellCoords.y === 0) {
      return nextCellCoords;
    }

    nextCellCoords.y = currentCellCoords.y - 1;

    if (this.utils.isSingleCellExpandedRow(nextCellCoords.y)) {
      return super.keyUp(currentCellCoords);
    }

    const isActionCell = this.utils.isActionCell(currentCellCoords);

    if (isActionCell && this.utils.isDetailsRow(nextCellCoords.y)) {
      nextCellCoords.y = nextCellCoords.y - 1;
    } else if (this.utils.isRowReplaced(nextCellCoords.y)) {
      nextCellCoords.y = nextCellCoords.y - 1;

      if (!this.utils.isDetailsRow(nextCellCoords.y)) {
        nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
      }
    } else if (this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isDetailsRow(nextCellCoords.y)) {
      nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
    } else if (!isActionCell && this.utils.isDetailsRow(nextCellCoords.y)) {
      nextCellCoords.x = currentCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
    }

    return nextCellCoords;
  }

  override keyDown(currentCellCoords: CellCoordinates) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);

    const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
    const numOfColumns = numOfRows ? this.utils.getCellsForRow(0).length - 1 : 0;

    if (currentCellCoords.y >= numOfRows) {
      return nextCellCoords;
    }

    nextCellCoords.y = currentCellCoords.y + 1;

    if (this.utils.isSingleCellExpandedRow(nextCellCoords.y)) {
      return super.keyDown(currentCellCoords);
    }

    if (!this.utils.isActionCell(currentCellCoords)) {
      if (this.utils.isRowReplaced(nextCellCoords.y)) {
        nextCellCoords.y = nextCellCoords.y < numOfRows ? nextCellCoords.y + 1 : nextCellCoords.y - 1;
      } else if (this.utils.getCellsForRow(currentCellCoords.y).length > numOfColumns) {
        nextCellCoords.x = currentCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
      } else {
        nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
      }
    } else {
      nextCellCoords.y = nextCellCoords.y < numOfRows ? nextCellCoords.y + 1 : nextCellCoords.y - 1;
    }

    return nextCellCoords;
  }

  override keyLeft(currentCellCoords: CellCoordinates) {
    return super.keyLeft(currentCellCoords);
  }

  override keyRight(currentCellCoords: CellCoordinates) {
    return super.keyRight(currentCellCoords);
  }

  override keyEnd(currentCellCoords: CellCoordinates, ctrlKey: boolean) {
    return super.keyEnd(currentCellCoords, ctrlKey);
  }

  override keyHome(currentCellCoords: CellCoordinates, ctrlKey: boolean) {
    return super.keyHome(currentCellCoords, ctrlKey);
  }

  override keyPageUp(currentCellCoords: CellCoordinates) {
    const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
    const itemsPerPage = this.utils.itemsPerPage(nextCellCoords.y);

    nextCellCoords.y = currentCellCoords.y - itemsPerPage > 0 ? currentCellCoords.y - itemsPerPage + 1 : 1;

    if (this.utils.isSingleCellExpandedRow(nextCellCoords.y)) {
      return super.keyPageUp(currentCellCoords);
    }

    if (!this.utils.isActionCell(currentCellCoords)) {
      if (this.utils.isRowReplaced(nextCellCoords.y)) {
        if (!this.utils.isDetailsRow(nextCellCoords.y)) {
          nextCellCoords.y = nextCellCoords.y + 1;
          nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
        }
      } else if (this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isDetailsRow(nextCellCoords.y)) {
        nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
      } else if (this.utils.isDetailsRow(nextCellCoords.y)) {
        nextCellCoords.x = currentCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
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

    if (this.utils.isSingleCellExpandedRow(nextCellCoords.y)) {
      return super.keyPageDown(currentCellCoords);
    }

    if (!this.utils.isActionCell(currentCellCoords)) {
      if (this.utils.isRowReplaced(nextCellCoords.y) && !this.utils.isDetailsRow(nextCellCoords.y)) {
        if (nextCellCoords.y < numOfRows) {
          nextCellCoords.y = nextCellCoords.y + 1;
          nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
        }
      } else if (this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isDetailsRow(nextCellCoords.y)) {
        nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
      } else if (this.utils.isDetailsRow(nextCellCoords.y)) {
        nextCellCoords.x = currentCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
      }
    } else if (this.utils.isDetailsRow(nextCellCoords.y)) {
      nextCellCoords.y = nextCellCoords.y - 1;
    }

    return nextCellCoords;
  }
}

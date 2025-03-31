/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { KeyNavigationGridStrategyInterface } from '../../interfaces/key-nav-grid-strategy.interface';
import { CellCoordinates, KeyNavigationGridConfig } from '../key-navigation-grid.controller';

export class ClrDefaultKeyNavigationStrategy implements KeyNavigationGridStrategyInterface {
  protected rows: NodeListOf<HTMLElement>;
  protected host: HTMLElement;
  protected cells: NodeListOf<HTMLElement>;
  protected config: KeyNavigationGridConfig;

  constructor(
    host: HTMLElement,
    rows: NodeListOf<HTMLElement>,
    cells: NodeListOf<HTMLElement>,
    config: KeyNavigationGridConfig
  ) {
    console.log('constructor ClrDefaultKeyNavigationStrategy');

    this.rows = rows;
    this.cells = cells;
    this.config = config;
    this.host = host;
  }

  static isExpandedRow(index: number, rows: NodeListOf<HTMLElement>) {
    const selectedElement: HTMLElement = rows[index].querySelector('.datagrid-row-detail');

    return selectedElement ? selectedElement.style.display !== 'none' : false;
  }

  static isDetailsRow(index: number, rows: NodeListOf<HTMLElement>) {
    return rows[index].classList.contains('datagrid-row-detail');
  }

  keyUp(currentCellCoords: CellCoordinates) {
    console.log('keyUp ClrKeyNavigationStrategy');
    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    if (currentCellCoords.y === 0) {
      return nextCellCoords;
    }

    nextCellCoords.y = currentCellCoords.y - 1;

    const isActionCell = this.isActionCell(currentCellCoords);

    if (this.isSingleCellExpandedRow(nextCellCoords.y) && !isActionCell && this.isDetailsRow(nextCellCoords.y)) {
      nextCellCoords.x = 0;
    } else if (this.isDetailsRow(nextCellCoords.y)) {
      if (isActionCell) {
        nextCellCoords.y = nextCellCoords.y - 1;
      } else {
        nextCellCoords.x = nextCellCoords.x - this.actionCellCount(currentCellCoords.y);
      }
    }

    return nextCellCoords;
  }

  keyDown(currentCellCoords: CellCoordinates) {
    console.log('keyDown ClrKeyNavigationStrategy');
    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    const numOfRows = this.rows ? this.rows.length - 1 : 0;
    if (currentCellCoords.y >= numOfRows) {
      return nextCellCoords;
    }

    const isActionCell = this.isActionCell(currentCellCoords);
    nextCellCoords.y = currentCellCoords.y + 1;

    if (this.isSingleCellExpandedRow(nextCellCoords.y) && !isActionCell && this.isRowReplaced(nextCellCoords.y)) {
      nextCellCoords.x = 0;
      nextCellCoords.y = nextCellCoords.y + 1;
      return nextCellCoords;
    }

    if (!isActionCell && this.isRowReplaced(nextCellCoords.y)) {
      nextCellCoords.y = nextCellCoords.y + 1;
      nextCellCoords.x = nextCellCoords.x - this.actionCellCount(currentCellCoords.y);
    }

    return nextCellCoords;
  }

  keyLeft(currentCellCoords: CellCoordinates) {
    console.log('keyLeft ClrKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    if (currentCellCoords.x === 0) {
      return nextCellCoords;
    }

    nextCellCoords.x = currentCellCoords.x - 1;

    return nextCellCoords;
  }

  keyRight(currentCellCoords: CellCoordinates) {
    console.log('keyRight ClrKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    // calculate numOfColumns based on header cells.
    const numOfColumns = this.rows?.length - 1 ? this.getCellsForRow(0).length - 1 : 0;

    nextCellCoords.x = currentCellCoords.x < numOfColumns ? nextCellCoords.x + 1 : nextCellCoords.x;

    return nextCellCoords;
  }

  keyEnd(currentCellCoords: CellCoordinates, ctrlKey: boolean) {
    console.log('keyEnd ClrKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);
    const numOfRows = this.rows ? this.rows.length - 1 : 0;

    // calculate X based on header cells.
    nextCellCoords.x = numOfRows ? this.getCellsForRow(0).length - 1 : 0;

    if (ctrlKey) {
      nextCellCoords.y = numOfRows;
    }

    return nextCellCoords;
  }

  keyHome(currentCellCoords: CellCoordinates, ctrlKey: boolean) {
    console.log('keyHome ClrKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    nextCellCoords.x = 0;

    if (ctrlKey) {
      nextCellCoords.y = 0;
    }

    return nextCellCoords;
  }

  keyPageUp(currentCellCoords: CellCoordinates) {
    console.log('keyPageUp ClrKeyNavigationStrategy');
    const nextCellCoords = this.createNextCellCoords(currentCellCoords);
    const itemsPerPage = this.getItemsPerPage();

    nextCellCoords.y = currentCellCoords.y - itemsPerPage > 0 ? currentCellCoords.y - itemsPerPage + 1 : 1;

    const isActionCell = this.isActionCell(currentCellCoords);

    if (this.isSingleCellExpandedRow(nextCellCoords.y) && !isActionCell && this.isDetailsRow(nextCellCoords.y)) {
      nextCellCoords.x = 0;
    } else if (this.isDetailsRow(nextCellCoords.y)) {
      if (isActionCell) {
        nextCellCoords.y = nextCellCoords.y - 1;
      } else {
        nextCellCoords.x = nextCellCoords.x - this.actionCellCount(currentCellCoords.y);
      }
    }

    return nextCellCoords;
  }

  keyPageDown(currentCellCoords: CellCoordinates) {
    console.log('keyPageDown ClrKeyNavigationStrategy');
    const nextCellCoords = this.createNextCellCoords(currentCellCoords);
    const numOfRows = this.rows ? this.rows.length - 1 : 0;
    const itemsPerPage = this.getItemsPerPage();

    nextCellCoords.y = currentCellCoords.y + itemsPerPage >= numOfRows ? numOfRows : currentCellCoords.y + itemsPerPage;

    if (this.isActionCell(currentCellCoords) && this.isDetailsRow(nextCellCoords.y)) {
      nextCellCoords.y = nextCellCoords.y - 1;
    } else if (this.isSingleCellExpandedRow(nextCellCoords.y)) {
      nextCellCoords.x = 0;
    } else if (this.isDetailsRow(nextCellCoords.y)) {
      nextCellCoords.x = nextCellCoords.x - this.actionCellCount(currentCellCoords.y);
    } else if (this.isRowReplaced(nextCellCoords.y)) {
      nextCellCoords.y = nextCellCoords.y + 1;
      nextCellCoords.x = nextCellCoords.x - this.actionCellCount(currentCellCoords.y);
    }

    return nextCellCoords;
  }

  protected getItemsPerPage() {
    return Math.floor(this.host?.querySelector('.datagrid').clientHeight / this.rows[0].clientHeight) - 1 || 0;
  }

  protected getCellsForRow(index: number) {
    return this.rows[index].querySelectorAll(this.config.keyGridCells);
  }

  protected isExpandedRow(index: number) {
    const selectedElement: HTMLElement = this.rows[index].querySelector('.datagrid-row-detail');

    return selectedElement ? selectedElement.style.display !== 'none' : false;
  }

  protected isDetailsRow(index: number) {
    return this.rows[index].classList.contains('datagrid-row-detail');
  }

  protected isRowReplaced(index: number) {
    return !!this.rows[index].closest('clr-dg-row.datagrid-row-replaced');
  }

  protected isSingleCellExpandedRow(index: number) {
    const row = this.rows[index].classList.contains('datagrid-row-detail')
      ? this.rows[index]
      : this.rows[index].querySelector('.datagrid-row-detail');

    return row?.querySelectorAll(this.config.keyGridCells).length === 1;
  }

  protected actionCellCount(index: number) {
    return this.actionCellsAsArray(index).length;
  }

  protected actionCellsAsArray(index: number) {
    return Array.from(
      this.rows[index].querySelectorAll('.datagrid-row-sticky .datagrid-cell, .datagrid-row-sticky .datagrid-column')
    );
  }

  protected isActionCell(cellCoords: CellCoordinates) {
    return !!this.actionCellsAsArray(cellCoords.y)[cellCoords.x];
  }

  protected createNextCellCoords(cellCoords: CellCoordinates): CellCoordinates {
    return {
      x: cellCoords.x,
      y: cellCoords.y,
    };
  }

  protected getCalcVariables(currentCellCoords: CellCoordinates) {
    const numOfRows = this.rows ? this.rows.length - 1 : 0;

    // calculate numOfColumns based on header cells.
    const numOfColumns = numOfRows ? this.getCellsForRow(0).length - 1 : 0;

    const isActionCell = this.isActionCell(currentCellCoords);

    return {
      rowCount: numOfRows,
      ColCount: numOfColumns,
      isActionCell: isActionCell,
    };
  }
}

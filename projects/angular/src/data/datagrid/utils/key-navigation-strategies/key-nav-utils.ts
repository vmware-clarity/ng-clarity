/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CellCoordinates, KeyNavigationGridConfig } from '../key-navigation-grid.controller';

export class KeyNavigationUtils {
  constructor(
    public host: HTMLElement,
    public rows: NodeListOf<HTMLElement>,
    public cells: NodeListOf<HTMLElement>,
    public config: KeyNavigationGridConfig
  ) {}

  getItemsPerPage() {
    return Math.floor(this.host?.querySelector('.datagrid').clientHeight / this.rows[0].clientHeight) - 1 || 0;
  }

  getCellsForRow(index: number) {
    return this.rows[index].querySelectorAll(this.config.keyGridCells);
  }

  isExpandedRow(index: number) {
    const selectedElement: HTMLElement = this.rows[index].querySelector('.datagrid-row-detail');

    return selectedElement ? selectedElement.style.display !== 'none' : false;
  }

  isDetailsRow(index: number) {
    return this.rows[index].classList.contains('datagrid-row-detail');
  }

  isRowReplaced(index: number) {
    return !!this.rows[index].closest('clr-dg-row.datagrid-row-replaced');
  }

  isSingleCellExpandedRow(index: number) {
    const row = this.isDetailsRow(index) ? this.rows[index] : this.rows[index].querySelector('.datagrid-row-detail');

    return row?.querySelectorAll(this.config.keyGridCells).length === 1;
  }

  actionCellCount(index: number) {
    return this.actionCellsAsArray(index).length;
  }

  actionCellsAsArray(index: number) {
    return Array.from(
      this.rows[index].querySelectorAll('.datagrid-row-sticky .datagrid-cell, .datagrid-row-sticky .datagrid-column')
    );
  }

  isActionCell(cellCoords: CellCoordinates) {
    return !!this.actionCellsAsArray(cellCoords.y)[cellCoords.x];
  }

  createNextCellCoords(cellCoords: CellCoordinates): CellCoordinates {
    return {
      x: cellCoords.x,
      y: cellCoords.y,
    };
  }

  getCurrentCellCoordinates() {
    const currentCell = this.cells ? Array.from(this.cells).find(i => i.getAttribute('tabindex') === '0') : null;
    const currentRow: HTMLElement = currentCell ? currentCell.closest(this.config.keyGridRows) : null;

    const coordinates: CellCoordinates = {
      x:
        currentRow && currentCell
          ? Array.from(currentRow.querySelectorAll(this.config.keyGridCells)).indexOf(currentCell)
          : 0,
      y: currentRow && currentCell && this.rows ? Array.from(this.rows).indexOf(currentRow) : 0,
    };

    return coordinates;
  }
}

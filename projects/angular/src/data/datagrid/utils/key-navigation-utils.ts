/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Keys } from '../../../utils/enums/keys.enum';
import { KeyNavigationGridStrategyInterface } from '../interfaces/key-nav-grid-strategy.interface';
import { CellCoordinates, KeyNavigationGridConfig } from './key-navigation-grid.controller';
import { DefaultKeyNavigationStrategy } from './key-navigation-strategies/default';
import { ExpandedColumnsRowKeyNavigationStrategy } from './key-navigation-strategies/expanded-columns-row';
import { ExpandedRowKeyNavigationStrategy } from './key-navigation-strategies/expanded-row';

export class KeyNavigationUtils {
  constructor(public host: HTMLElement, public config: KeyNavigationGridConfig) {}

  get grid() {
    return this.host?.querySelector(this.config.keyGrid);
  }

  get rows() {
    return this.host?.querySelectorAll(this.config.keyGridRows) as NodeListOf<HTMLElement>;
  }

  get cells() {
    return this.host?.querySelectorAll(this.config.keyGridCells) as NodeListOf<HTMLElement>;
  }

  get currentCellCoordinates() {
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

  get averageRowHeight() {
    const heightSum = Array.from(this.rows.values()).reduce((initial, row) => {
      return initial + row.clientHeight;
    }, 0);

    return Math.round(heightSum / this.rows.length);
  }

  get itemsPerPage() {
    return Math.floor(this.host?.querySelector('.datagrid').clientHeight / this.averageRowHeight) - 1 || 0;
  }

  getNextItemCoordinate(e: KeyboardEvent) {
    const currentCellCoords = this.currentCellCoordinates;
    const strategy = this.getNavStrategy(currentCellCoords);

    const inlineStart = this.host.dir === 'rtl' ? Keys.ArrowRight : Keys.ArrowLeft;
    const inlineEnd = this.host.dir === 'rtl' ? Keys.ArrowLeft : Keys.ArrowRight;

    switch (e.key) {
      case Keys.ArrowUp:
        return strategy.keyUp(currentCellCoords);
      case Keys.ArrowDown:
        return strategy.keyDown(currentCellCoords);
      case inlineStart:
        return strategy.keyLeft(currentCellCoords);
      case inlineEnd:
        return strategy.keyRight(currentCellCoords);
      case Keys.Home:
        return strategy.keyHome(currentCellCoords, e.ctrlKey);
      case Keys.End:
        return strategy.keyEnd(currentCellCoords, e.ctrlKey);
      case Keys.PageUp:
        return strategy.keyPageUp(currentCellCoords);
      case Keys.PageDown:
        return strategy.keyPageDown(currentCellCoords);
      default:
        return currentCellCoords;
    }
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
    return this.rows[index]?.querySelectorAll(this.config.keyGridCells).length === 1;
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

  private getNavStrategy(currentCellCoords: CellCoordinates): KeyNavigationGridStrategyInterface {
    switch (true) {
      case this.isSingleCellExpandedRow(currentCellCoords.y):
        return new ExpandedRowKeyNavigationStrategy(this);
      case this.isDetailsRow(currentCellCoords.y):
      case this.isExpandedRow(currentCellCoords.y):
        return new ExpandedColumnsRowKeyNavigationStrategy(this);
      default:
        return new DefaultKeyNavigationStrategy(this);
    }
  }
}

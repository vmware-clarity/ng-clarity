/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { Keys } from '../../../utils/enums/keys.enum';

const actionableItemSelectors = [
  'a[href]',
  'area[href]',
  'input:not([disabled])',
  'button:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable=true]',
  '[role=button]:not([disabled])',
];

export function getTabbableItems(el: HTMLElement) {
  const tabbableItemSelectors = [...actionableItemSelectors, '[tabindex="0"]:not([disabled])'];
  const tabbableSelector = tabbableItemSelectors.join(',');
  return Array.from(el.querySelectorAll(tabbableSelector)) as HTMLElement[];
}

function isActionableItem(el: HTMLElement) {
  const actionableSelector = actionableItemSelectors.join(',');
  return el.matches(actionableSelector);
}

export interface KeyNavigationGridConfig {
  keyGrid: string;
  keyGridRows: string;
  keyGridCells: string;
}

export interface CellCoordinates {
  x: number;
  y: number;
}

@Injectable()
export class KeyNavigationGridController implements OnDestroy {
  skipItemFocus = false;

  private host: HTMLElement;
  private config: KeyNavigationGridConfig;
  private listenersAdded = false;
  private destroy$ = new Subject<void>();
  private _activeCell: HTMLElement = null;

  constructor(private zone: NgZone) {
    this.config = {
      keyGridRows: '[role=row]:not(.datagrid-placeholder):not([style*="display: none"])',
      keyGridCells:
        '[role=gridcell]:not(.datagrid-hidden-column):not(.datagrid-placeholder-content), [role=columnheader]:not(.datagrid-hidden-column):not(.datagrid-placeholder-content), .datagrid-detail-caret',
      keyGrid: '[role=grid]',
    };
  }

  private get grid() {
    return this.host?.querySelector(this.config.keyGrid);
  }

  private get rows() {
    return this.host?.querySelectorAll(this.config.keyGridRows) as NodeListOf<HTMLElement>;
  }

  private get cells() {
    return this.host?.querySelectorAll(this.config.keyGridCells) as NodeListOf<HTMLElement>;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addListeners() {
    if (this.listenersAdded) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      fromEvent(this.grid, 'mousedown')
        .pipe(takeUntil(this.destroy$))
        .subscribe((e: MouseEvent) => {
          // preserve right click for context menus & keyboard mouse control https://apple.stackexchange.com/questions/32715/how-do-i-open-the-context-menu-from-a-mac-keyboard
          if (e.buttons === 1 && !e.ctrlKey) {
            const activeCell = this.cells
              ? Array.from(this.cells).find(
                  c => c === e.target || c === (e.target as HTMLElement).closest(this.config.keyGridCells)
                )
              : null;
            if (activeCell) {
              this.setActiveCell(activeCell, { keepFocus: isActionableItem(e.target as HTMLElement) });
            }
          }
        });

      fromEvent(this.grid, 'wheel')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.removeActiveCell();
        });

      fromEvent(this.grid, 'focusout')
        .pipe(debounceTime(0), takeUntil(this.destroy$))
        .subscribe(() => {
          if (this.grid.contains(document.activeElement)) {
            return;
          }

          this.removeActiveCell();
        });

      fromEvent(this.grid, 'keydown')
        .pipe(takeUntil(this.destroy$))
        .subscribe((e: KeyboardEvent) => {
          // Skip column resize events
          if (
            (e.target as HTMLElement).classList.contains('drag-handle') &&
            (e.key === Keys.ArrowLeft || e.key === Keys.ArrowRight)
          ) {
            return;
          }
          if (
            e.key === Keys.ArrowUp ||
            e.key === Keys.ArrowDown ||
            e.key === Keys.ArrowLeft ||
            e.key === Keys.ArrowRight ||
            e.key === Keys.End ||
            e.key === Keys.Home ||
            e.key === Keys.PageUp ||
            e.key === Keys.PageDown
          ) {
            const currentCellCoords = this.getCurrentCellCoordinates();

            const nextCellCoords =
              this.isExpandedRow(currentCellCoords.y) || this.isDetailsRow(currentCellCoords.y)
                ? this.getNextForExpandedRowCoordinate(e, currentCellCoords)
                : this.getNextItemCoordinate(e, currentCellCoords);

            const activeItem = this.rows
              ? (Array.from(this.getCellsForRow(nextCellCoords.y))[nextCellCoords.x] as HTMLElement)
              : null;

            if (activeItem) {
              this.setActiveCell(activeItem);
            }

            e.preventDefault();
          }
        });
    });
    this.listenersAdded = true;
  }

  initializeKeyGrid(host: HTMLElement) {
    this.host = host;
    this.addListeners();
    this.resetKeyGrid();
  }

  resetKeyGrid() {
    this.cells?.forEach((i: HTMLElement) => i.setAttribute('tabindex', '-1'));
    const firstCell = this.cells ? this.cells[0] : null;
    firstCell?.setAttribute('tabindex', '0');
  }

  removeActiveCell() {
    this._activeCell = null;
  }

  getActiveCell() {
    return this._activeCell;
  }

  setActiveCell(activeCell: HTMLElement, { keepFocus } = { keepFocus: false }) {
    const prior = this.cells ? Array.from(this.cells).find(c => c.getAttribute('tabindex') === '0') : null;

    if (prior) {
      prior.setAttribute('tabindex', '-1');
    }

    activeCell.setAttribute('tabindex', '0');
    this._activeCell = activeCell;

    if (!this.skipItemFocus && !keepFocus) {
      let elementToFocus: HTMLElement;

      if (activeCell.getAttribute('role') === 'columnheader') {
        elementToFocus = activeCell;
      } else {
        const tabbableElements = getTabbableItems(activeCell);
        elementToFocus = tabbableElements.length ? tabbableElements[0] : activeCell;
      }

      elementToFocus.focus();
    }
  }

  private getNextForExpandedRowCoordinate(e: any, currentCellCoords: CellCoordinates) {
    if (e.key === Keys.PageUp || e.key === Keys.PageDown) {
      return this.getNextItemCoordinate(e, currentCellCoords);
    }

    if (
      !this.isDetailsRow(currentCellCoords.y) &&
      !this.isRowReplaced(currentCellCoords.y) &&
      (e.key === Keys.Home || e.key === Keys.End || e.key === Keys.ArrowRight || e.key === Keys.ArrowLeft)
    ) {
      return this.getNextItemCoordinate(e, currentCellCoords);
    }

    const { numOfRows, numOfColumns, inlineStart, inlineEnd, isActionCell, nextCellCoords } =
      this.getCalcVariables(currentCellCoords);

    const isSingleCellExpandedRow = this.isSingleCellExpandedRow(currentCellCoords.y);

    if (e.key === Keys.ArrowUp && currentCellCoords.y !== 0) {
      nextCellCoords.y = currentCellCoords.y - 1;

      if (isSingleCellExpandedRow && !isActionCell) {
        if (this.isRowReplaced(currentCellCoords.y)) {
          nextCellCoords.y = nextCellCoords.y - 1;
        }

        if (this.isDetailsRow(nextCellCoords.y)) {
          nextCellCoords.x = 0;
        } else if (this.isDetailsRow(currentCellCoords.y) === false) {
          // false check is intentional, the ! operator may be missed easily in this case
          nextCellCoords.x = currentCellCoords.x;
        } else {
          nextCellCoords.x = this.actionCellCount(nextCellCoords.y);
        }

        return nextCellCoords;
      }

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
    } else if (e.key === Keys.ArrowDown && currentCellCoords.y < numOfRows) {
      nextCellCoords.y = currentCellCoords.y + 1;

      if (isSingleCellExpandedRow && !isActionCell) {
        if (this.isRowReplaced(nextCellCoords.y)) {
          nextCellCoords.y = nextCellCoords.y + 1;
        }

        if (this.isDetailsRow(nextCellCoords.y)) {
          nextCellCoords.x = 0;
        } else {
          nextCellCoords.x = this.actionCellCount(nextCellCoords.y);
        }
        return nextCellCoords;
      }

      if (isActionCell || this.isRowReplaced(nextCellCoords.y)) {
        nextCellCoords.y = nextCellCoords.y + 1;
      } else if (this.getCellsForRow(currentCellCoords.y).length > numOfColumns) {
        nextCellCoords.x = currentCellCoords.x - this.actionCellCount(currentCellCoords.y);
      } else {
        nextCellCoords.x = currentCellCoords.x + this.actionCellCount(nextCellCoords.y);
      }
    } else if (e.key === inlineStart) {
      if (currentCellCoords.x !== 0) {
        nextCellCoords.x = currentCellCoords.x - 1;
      } else if (!isActionCell) {
        nextCellCoords.y = currentCellCoords.y - 1;
        nextCellCoords.x = this.actionCellCount(nextCellCoords.y) - 1;
      }
    } else if (e.key === inlineEnd && currentCellCoords.x < numOfColumns) {
      if (
        isActionCell &&
        currentCellCoords.x === this.actionCellCount(currentCellCoords.x) - 1 &&
        this.isRowReplaced(currentCellCoords.y) &&
        !this.isDetailsRow(currentCellCoords.y)
      ) {
        nextCellCoords.y = currentCellCoords.y + 1;
        nextCellCoords.x = 0;
      } else {
        nextCellCoords.x = currentCellCoords.x + 1;
      }
    } else if (e.key === Keys.End) {
      nextCellCoords.x = this.getCellsForRow(currentCellCoords.y).length - 1;

      if (e.ctrlKey) {
        nextCellCoords.x = numOfColumns;
        nextCellCoords.y = numOfRows;
      }
    } else if (e.key === Keys.Home) {
      nextCellCoords.x = 0;
      nextCellCoords.y = currentCellCoords.y - 1;

      if (e.ctrlKey) {
        nextCellCoords.y = 0;
      }
    }

    return nextCellCoords;
  }

  private getNextItemCoordinate(e: any, currentCellCoords: CellCoordinates) {
    const { numOfRows, numOfColumns, inlineStart, inlineEnd, itemsPerPage, isActionCell, nextCellCoords } =
      this.getCalcVariables(currentCellCoords);

    if (e.key === Keys.ArrowUp && currentCellCoords.y !== 0) {
      nextCellCoords.y = currentCellCoords.y - 1;

      if (this.isSingleCellExpandedRow(nextCellCoords.y) && !isActionCell && this.isDetailsRow(nextCellCoords.y)) {
        nextCellCoords.x = 0;
        return nextCellCoords;
      }

      if (this.isDetailsRow(nextCellCoords.y)) {
        if (isActionCell) {
          nextCellCoords.y = nextCellCoords.y - 1;
        } else {
          nextCellCoords.x = nextCellCoords.x - this.actionCellCount(currentCellCoords.y);
        }
      }
    } else if (e.key === Keys.ArrowDown && currentCellCoords.y < numOfRows) {
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
    } else if (e.key === inlineStart && currentCellCoords.x !== 0) {
      nextCellCoords.x = currentCellCoords.x - 1;
    } else if (e.key === inlineEnd && currentCellCoords.x < numOfColumns) {
      nextCellCoords.x = currentCellCoords.x + 1;
    } else if (e.key === Keys.End) {
      nextCellCoords.x = numOfColumns;

      if (e.ctrlKey) {
        nextCellCoords.y = numOfRows;
      }
    } else if (e.key === Keys.Home) {
      nextCellCoords.x = 0;

      if (e.ctrlKey) {
        nextCellCoords.y = 0;
      }
    } else if (e.key === Keys.PageUp) {
      nextCellCoords.y = currentCellCoords.y - itemsPerPage > 0 ? currentCellCoords.y - itemsPerPage + 1 : 1;
    } else if (e.key === Keys.PageDown) {
      nextCellCoords.y =
        currentCellCoords.y + itemsPerPage < numOfRows ? currentCellCoords.y + itemsPerPage : numOfRows;
    }

    return nextCellCoords;
  }

  private getCalcVariables(currentCellCoords: CellCoordinates) {
    const numOfRows = this.rows ? this.rows.length - 1 : 0;

    // calculate numOfColumns based on header cells.
    const numOfColumns = numOfRows ? this.getCellsForRow(0).length - 1 : 0;

    const dir = this.host.dir;
    const inlineStart = dir === 'rtl' ? Keys.ArrowRight : Keys.ArrowLeft;
    const inlineEnd = dir === 'rtl' ? Keys.ArrowLeft : Keys.ArrowRight;

    const itemsPerPage =
      Math.floor(this.host?.querySelector('.datagrid').clientHeight / this.rows[0].clientHeight) - 1 || 0;

    const isActionCell = this.isActionCell(currentCellCoords);

    const nextCellCoords: CellCoordinates = {
      x: currentCellCoords.x,
      y: currentCellCoords.y,
    };

    return { numOfRows, numOfColumns, inlineStart, inlineEnd, itemsPerPage, isActionCell, nextCellCoords };
  }

  private getCurrentCellCoordinates() {
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

  private getCellsForRow(index: number) {
    return this.rows[index].querySelectorAll(this.config.keyGridCells);
  }

  private isExpandedRow(index: number) {
    const selectedElement: HTMLElement = this.rows[index].querySelector('.datagrid-row-detail');

    return selectedElement ? selectedElement.style.display !== 'none' : false;
  }

  private isDetailsRow(index: number) {
    return this.rows[index].classList.contains('datagrid-row-detail');
  }

  private isRowReplaced(index: number) {
    return !!this.rows[index].closest('clr-dg-row.datagrid-row-replaced');
  }

  private isSingleCellExpandedRow(index: number) {
    const row = this.rows[index].classList.contains('datagrid-row-detail')
      ? this.rows[index]
      : this.rows[index].querySelector('.datagrid-row-detail');

    return row?.querySelectorAll(this.config.keyGridCells).length === 1;
  }

  private actionCellCount(index: number) {
    return this.actionCellsAsArray(index).length;
  }

  private actionCellsAsArray(index: number) {
    return Array.from(
      this.rows[index].querySelectorAll('.datagrid-row-sticky .datagrid-cell, .datagrid-row-sticky .datagrid-column')
    );
  }

  private isActionCell(cellCoords: CellCoordinates) {
    return !!this.actionCellsAsArray(cellCoords.y)[cellCoords.x];
  }
}

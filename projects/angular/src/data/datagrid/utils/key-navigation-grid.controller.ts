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

export function getTabableItems(el: HTMLElement) {
  const tabableSelector = [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'button:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'iframe',
    'object',
    'embed',
    '*[tabindex]:not([disabled])',
    '*[contenteditable=true]',
    '[role=button]:not([disabled])',
  ].join(',');
  return Array.from(el.querySelectorAll(tabableSelector)) as HTMLElement[];
}

export interface KeyNavigationGridConfig {
  keyGrid: string;
  keyGridRows: string;
  keyGridCells: string;
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
      keyGridRows: '[role=row]:not(.datagrid-placeholder)',
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
              this.setActiveCell(activeCell);
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
            const { x, y } = this.getNextItemCoordinate(e);
            const activeItem = this.rows
              ? (Array.from(this.rows[y].querySelectorAll(this.config.keyGridCells))[x] as HTMLElement)
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

  setActiveCell(activeCell: HTMLElement) {
    const prior = this.cells ? Array.from(this.cells).find(c => c.getAttribute('tabindex') === '0') : null;

    if (prior) {
      prior.setAttribute('tabindex', '-1');
    }

    activeCell.setAttribute('tabindex', '0');
    this._activeCell = activeCell;

    const items = getTabableItems(activeCell);
    const item = activeCell.getAttribute('role') !== 'columnheader' && items[0] ? items[0] : activeCell;

    if (!this.skipItemFocus) {
      item.focus();
    }
  }

  calcKeyArrowUp(y: number) {
    return y !== 0 ? y - 1 : y;
  }

  calcKeyArrowDown(y: number, numOfRows: number) {
    return y < numOfRows ? y + 1 : y;
  }

  calcKeyArrowLeft(x: number) {
    return x !== 0 ? x - 1 : x;
  }

  calcKeyArrowRight(x: number, numOfColumns: number) {
    return x < numOfColumns ? x + 1 : x;
  }

  calcKeyEnd(countX: number, y: number, countY: number, ctrlKeyPressed: boolean) {
    return { x: countX, y: ctrlKeyPressed ? countY : y };
  }

  calcKeyHome(countX: number, y: number, countY: number, ctrlKeyPressed: boolean) {
    return { x: countX, y: ctrlKeyPressed ? countY : y };
  }

  calcKeyPageUp(y: number, itemsPerPage: number) {
    return y - itemsPerPage > 0 ? y - itemsPerPage + 1 : 1;
  }

  calcKeyPageDown(y: number, itemsPerPage: number, numOfRows: number) {
    return y + itemsPerPage < numOfRows ? y + itemsPerPage : numOfRows;
  }

  private getNextItemCoordinate(e: any) {
    let currentCell = this.cells ? Array.from(this.cells).find(i => i.getAttribute('tabindex') === '0') : null;
    if (e.key === Keys.Tab) {
      currentCell = document.activeElement as HTMLElement;
    }
    const currentRow = this.rows && currentCell ? Array.from(this.rows).find(r => r.contains(currentCell)) : null;
    const numOfRows = this.rows ? this.rows.length - 1 : 0;
    const numOfColumns = this.cells ? Math.floor(this.cells.length / this.rows.length - 1) : 0;

    const x =
      currentRow && currentCell
        ? Array.from(currentRow.querySelectorAll(this.config.keyGridCells)).indexOf(currentCell)
        : 0;
    const y = currentRow && currentCell && this.rows ? Array.from(this.rows).indexOf(currentRow) : 0;

    const dir = this.host.dir;
    const inlineStart = dir === 'rtl' ? Keys.ArrowRight : Keys.ArrowLeft;
    const inlineEnd = dir === 'rtl' ? Keys.ArrowLeft : Keys.ArrowRight;

    const itemsPerPage =
      Math.floor(this.host?.querySelector('.datagrid').clientHeight / this.rows[0].clientHeight) - 1 || 0;

    switch (e.key) {
      case Keys.ArrowUp:
        return { x, y: this.calcKeyArrowUp(y) };
      case Keys.ArrowDown:
        return { x, y: this.calcKeyArrowDown(y, numOfRows) };
      case inlineStart:
        return { x: this.calcKeyArrowLeft(x), y };
      case inlineEnd:
        return { x: this.calcKeyArrowRight(x, numOfColumns), y };
      case Keys.End:
        return this.calcKeyEnd(numOfColumns, y, numOfRows, e.ctrlKey);
      case Keys.Home:
        return this.calcKeyHome(0, y, 0, e.ctrlKey);
      case Keys.PageUp:
        return { x, y: this.calcKeyPageUp(y, itemsPerPage) };
      case Keys.PageDown:
        return { x, y: this.calcKeyPageDown(y, itemsPerPage, numOfRows) };
      default:
        return { x, y };
    }
  }
}

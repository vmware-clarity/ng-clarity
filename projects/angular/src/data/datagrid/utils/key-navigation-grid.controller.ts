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
  strategy: 'regular' | 'virtualScroller' = 'regular';

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

  private getNextItemCoordinate(e: any) {
    let currentCell = this.cells ? Array.from(this.cells).find(i => i.getAttribute('tabindex') === '0') : null;
    if (e.key === Keys.Tab) {
      currentCell = document.activeElement as HTMLElement;
    }
    const currentRow = this.rows && currentCell ? Array.from(this.rows).find(r => r.contains(currentCell)) : null;
    const numOfRows = this.rows ? this.rows.length - 1 : 0;
    const numOfColumns = this.cells ? Math.floor(this.cells.length / this.rows.length - 1) : 0;

    let x =
      currentRow && currentCell
        ? Array.from(currentRow.querySelectorAll(this.config.keyGridCells)).indexOf(currentCell)
        : 0;
    let y = currentRow && currentCell && this.rows ? Array.from(this.rows).indexOf(currentRow) : 0;

    const dir = this.host.dir;
    const inlineStart = dir === 'rtl' ? Keys.ArrowRight : Keys.ArrowLeft;
    const inlineEnd = dir === 'rtl' ? Keys.ArrowLeft : Keys.ArrowRight;

    const itemsPerPage =
      Math.floor(this.host?.querySelector('.datagrid').clientHeight / this.rows[0].clientHeight) - 1 || 0;
    // console.log('itemsPerPage', itemsPerPage)
    // console.log('numOfRows', numOfRows)

    if (e.key === Keys.ArrowUp && y !== 0) {
      y = y - 1;
    } else if (e.key === Keys.ArrowDown && y < numOfRows) {
      y = y + 1;
    } else if (e.key === inlineStart && x !== 0) {
      x = x - 1;
    } else if (e.key === inlineEnd && x < numOfColumns) {
      x = x + 1;
    } else if (e.key === Keys.End) {
      x = numOfColumns;

      if (e.ctrlKey) {
        y = numOfRows;
      }
    } else if (e.key === Keys.Home) {
      x = 0;

      if (e.ctrlKey) {
        y = 0;
      }
    } else if (e.key === Keys.PageUp) {
      // if (this.strategy === 'virtualScroller') {
      //   // console.log('initial y', y)
      //   // numOfRows are all the rows currently rendered
      //   // itemsPerPage are total rows that are visible at once
      //   // half the difference between them is the count not visible before/after rows
      //   // removing 3 from half the difference will force single scroll UP by not selecting a barely visible row
      //   // const position = Math.floor((numOfRows - itemsPerPage) / 2) - 3;
      //   // const position = 1;
      //
      //   // The threshold is to ensure the current Y position need
      //   // const threshold = numOfRows / 4;
      //
      //   // y = y >= threshold ? position : 1;
      //   y = y - itemsPerPage > 0 ? y - itemsPerPage + 1 : 1;
      //   // console.log('calced y', y)
      // } else {
      // }
      y = y - itemsPerPage > 0 ? y - itemsPerPage + 1 : 1;
    } else if (e.key === Keys.PageDown) {
      y = y + itemsPerPage < numOfRows ? y + itemsPerPage : numOfRows;
    }

    return { x, y };
  }
}

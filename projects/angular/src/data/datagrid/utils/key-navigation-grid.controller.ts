/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

      fromEvent(this.grid, 'keydown')
        .pipe(takeUntil(this.destroy$))
        .subscribe((e: KeyboardEvent) => {
          // Skip column resize events
          if (
            (e.target as HTMLElement).classList.contains('drag-handle') &&
            (e.code === 'ArrowLeft' || e.code === 'ArrowRight')
          ) {
            return;
          }
          if (
            e.code === 'ArrowUp' ||
            e.code === 'ArrowDown' ||
            e.code === 'ArrowLeft' ||
            e.code === 'ArrowRight' ||
            e.code === 'End' ||
            e.code === 'Home' ||
            e.code === 'PageUp' ||
            e.code === 'PageDown'
          ) {
            // console.log('is current active cell in details: ', this.isCurrentActiveCellInDetails());
            // console.log('is row 1 expanded: ', this.isRowExpanded(1));
            const nextActiveItem = this.getNextItem(e);

            if (nextActiveItem) {
              this.setActiveCell(nextActiveItem);
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

  private getNextItem(e: any) {
    let currentCell = this.cells ? Array.from(this.cells).find(i => i.getAttribute('tabindex') === '0') : null;
    if (e.code === 'Tab') {
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

    console.log('x is:', x);

    const dir = this.host.dir;
    const inlineStart = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    const inlineEnd = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';

    const itemsPerPage =
      Math.floor(this.host?.querySelector('.datagrid').clientHeight / this.rows[0].clientHeight) - 1 || 0;

    if (e.code === 'ArrowUp' && y !== 0) {
      if (!this.isCurrentActiveCellInDetails()) {
        y = y - 1;
      }
    } else if (e.code === 'ArrowDown' && y < numOfRows) {
      if (!this.isRowExpanded(y) || (this.isRowExpanded(y) && this.isCurrentActiveCellInDetails())) {
        y = y + 1;
      }
    } else if (e.code === inlineStart && x !== 0) {
      x = x - 1;
    } else if (e.code === inlineEnd && x < numOfColumns) {
      x = x + 1;
    } else if (e.code === 'End') {
      x = numOfColumns;

      if (e.ctrlKey) {
        y = numOfRows;
      }
    } else if (e.code === 'Home') {
      x = 0;

      if (e.ctrlKey) {
        y = 0;
      }
    } else if (e.code === 'PageUp') {
      y = y - itemsPerPage > 0 ? y - itemsPerPage + 1 : 1;
    } else if (e.code === 'PageDown') {
      y = y + itemsPerPage < numOfRows ? y + itemsPerPage : numOfRows;
    }

    let nextActiveItem;

    if (e.code === 'ArrowUp' && y !== 0) {
      if (this.isCurrentActiveCellInDetails()) {
        // console.log('up!');
        nextActiveItem = this.rows
          ? (Array.from(this.rows[y].querySelectorAll('.datagrid-scrolling-cells'))[0].querySelectorAll(
              '.datagrid-cell'
            )[0] as HTMLElement)
          : null;
      } else {
        nextActiveItem = this.rows
          ? (Array.from(this.rows[y].querySelectorAll(this.config.keyGridCells))[x] as HTMLElement)
          : null;
      }
    } else if (e.code === 'ArrowDown' && y < numOfRows) {
      // TODO: Go to next row
      if (!this.isCurrentActiveCellInDetails() && this.isRowExpanded(y)) {
        console.log('go to next details');
        // TODO: Go to details
        nextActiveItem = this.rows
          ? (Array.from(this.rows[y].querySelectorAll('.datagrid-row-detail'))[0].querySelectorAll('.datagrid-cell')[
              x
            ] as HTMLElement)
          : null;
      } else {
        if (this.isCurrentActiveCellInDetails()) {
          nextActiveItem = this.rows
            ? (Array.from(this.rows[y].querySelectorAll('.datagrid-scrolling-cells'))[0].querySelectorAll(
                '.datagrid-cell'
              )[0] as HTMLElement)
            : null;
        } else {
          nextActiveItem = this.rows
            ? (Array.from(this.rows[y].querySelectorAll(this.config.keyGridCells))[x] as HTMLElement)
            : null;
        }
      }
    } else {
      if (!this.isCurrentActiveCellInDetails()) {
        nextActiveItem = this.rows
          ? (Array.from(this.rows[y].querySelectorAll(this.config.keyGridCells))[x] as HTMLElement)
          : null;
      } else if (this.isCurrentActiveCellInDetails() && e.code === inlineEnd) {
        nextActiveItem = this.rows
          ? (Array.from(this.rows[y].querySelectorAll(this.config.keyGridCells))[x + 1] as HTMLElement)
          : null;
      } else if (this.isCurrentActiveCellInDetails() && e.code === inlineStart) {
        nextActiveItem = this.rows
          ? (Array.from(this.rows[y].querySelectorAll(this.config.keyGridCells))[x] as HTMLElement)
          : null;
      }
    }

    return nextActiveItem;
  }

  private isRowExpanded(y: number): boolean {
    console.log('isRowExpanded: ', this.rows[y]);
    return !!this.rows[y].querySelector('.datagrid-row-detail');
  }

  private isCurrentActiveCellInDetails(): boolean {
    return (
      this.getActiveCell().parentElement.classList.contains('datagrid-row-detail') ||
      this.getActiveCell().classList.contains('datagrid-row-detail')
    );
  }
}

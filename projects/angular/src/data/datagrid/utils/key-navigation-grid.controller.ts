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
import { KeyNavigationStrategyBuilder } from './key-navigation-strategies/key-nav-strategy-builder';

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
            const strategyBuilder = new KeyNavigationStrategyBuilder(this.host, this.rows, this.cells, this.config);

            const nextCellCoords = strategyBuilder.getNextItemCoordinate(e);

            const activeItem = this.rows
              ? (Array.from(strategyBuilder.keyNavUtils.getCellsForRow(nextCellCoords.y))[
                  nextCellCoords.x
                ] as HTMLElement)
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
}

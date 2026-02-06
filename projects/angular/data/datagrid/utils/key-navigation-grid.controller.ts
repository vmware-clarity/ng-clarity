/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { EventEmitter, Injectable, NgZone, OnDestroy } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { KeyNavigationUtils } from './key-navigation-utils';
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
  ariaRowIndex?: string;
}

@Injectable()
export class KeyNavigationGridController implements OnDestroy {
  nextCellCoordsEmitter = new EventEmitter<CellCoordinates>(false);

  skipItemFocus = false;
  preventScrollOnFocus = false;

  config: KeyNavigationGridConfig = {
    keyGridRows: '[role=row]:not(.datagrid-placeholder):not([style*="display: none"])',
    keyGridCells:
      '[role=gridcell]:not(.datagrid-hidden-column):not(.datagrid-placeholder-content), [role=columnheader]:not(.datagrid-hidden-column):not(.datagrid-placeholder-content), .datagrid-detail-caret',
    keyGrid: '[role=grid]',
  };
  private keyNavUtils: KeyNavigationUtils;
  private listenersAdded = false;
  private destroy$ = new Subject<void>();

  constructor(private zone: NgZone) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addListeners() {
    if (this.listenersAdded) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      fromEvent(this.keyNavUtils.grid, 'mousedown')
        .pipe(takeUntil(this.destroy$))
        .subscribe((e: MouseEvent) => {
          // preserve right click for context menus & keyboard mouse control https://apple.stackexchange.com/questions/32715/how-do-i-open-the-context-menu-from-a-mac-keyboard
          if (e.buttons === 1 && !e.ctrlKey) {
            const activeCell = this.keyNavUtils.cells
              ? Array.from(this.keyNavUtils.cells).find(
                  c => c === e.target || c === (e.target as HTMLElement).closest(this.config.keyGridCells)
                )
              : null;
            if (activeCell) {
              this.setActiveCell(activeCell);

              if (!isActionableItem(e.target as HTMLElement)) {
                this.focusElement(activeCell);
              }
            }
          }
        });

      fromEvent(this.keyNavUtils.grid, 'wheel')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.nextCellCoordsEmitter.emit(null);
        });

      fromEvent(this.keyNavUtils.grid, 'keydown')
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
            const nextCellCoords = this.keyNavUtils.getNextItemCoordinate(e);

            if (
              nextCellCoords.y > 0 &&
              (e.key === Keys.ArrowUp || e.key === Keys.ArrowDown || e.key === Keys.PageUp || e.key === Keys.PageDown)
            ) {
              this.keyNavUtils.setAriaRowIndexTo(nextCellCoords);

              this.nextCellCoordsEmitter.emit(nextCellCoords);
            }

            const activeItem = this.keyNavUtils.rows
              ? (Array.from(this.keyNavUtils.getCellsForRow(nextCellCoords.y))[nextCellCoords.x] as HTMLElement)
              : null;

            if (activeItem) {
              this.setActiveCell(activeItem);
              this.focusElement(activeItem, {
                preventScroll: this.preventScrollOnFocus && !!nextCellCoords.ariaRowIndex,
              });
            }

            e.preventDefault();
          }
        });
    });
    this.listenersAdded = true;
  }

  initializeKeyGrid(host: HTMLElement) {
    this.keyNavUtils = new KeyNavigationUtils(host, this.config);
    this.addListeners();
    this.resetKeyGrid();
  }

  resetKeyGrid() {
    this.keyNavUtils.cells?.forEach((i: HTMLElement) => i.setAttribute('tabindex', '-1'));
    const firstCell = this.keyNavUtils.cells ? this.keyNavUtils.cells[0] : null;
    firstCell?.setAttribute('tabindex', '0');
  }

  setActiveCell(activeCell: HTMLElement) {
    const prior = this.keyNavUtils.cells
      ? Array.from(this.keyNavUtils.cells).find(c => c.getAttribute('tabindex') === '0')
      : null;

    if (prior) {
      prior.setAttribute('tabindex', '-1');
    }

    activeCell.setAttribute('tabindex', '0');
  }

  focusElement(activeCell: HTMLElement, options: FocusOptions = { preventScroll: false }) {
    if (this.skipItemFocus) {
      return;
    }

    let elementToFocus: HTMLElement;

    if (activeCell.getAttribute('role') === 'columnheader') {
      elementToFocus = activeCell;
    } else {
      const tabbableElements = getTabbableItems(activeCell);
      elementToFocus = tabbableElements.length ? tabbableElements[0] : activeCell;
    }

    elementToFocus.focus(options);
  }
}

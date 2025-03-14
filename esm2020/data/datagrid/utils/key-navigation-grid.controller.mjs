/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Keys } from '../../../utils/enums/keys.enum';
import * as i0 from "@angular/core";
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
export function getTabbableItems(el) {
    const tabbableItemSelectors = [...actionableItemSelectors, '[tabindex="0"]:not([disabled])'];
    const tabbableSelector = tabbableItemSelectors.join(',');
    return Array.from(el.querySelectorAll(tabbableSelector));
}
function isActionableItem(el) {
    const actionableSelector = actionableItemSelectors.join(',');
    return el.matches(actionableSelector);
}
export class KeyNavigationGridController {
    constructor(zone) {
        this.zone = zone;
        this.skipItemFocus = false;
        this.listenersAdded = false;
        this.destroy$ = new Subject();
        this._activeCell = null;
        this.config = {
            keyGridRows: '[role=row]:not(.datagrid-placeholder):not([style*="display: none"])',
            keyGridCells: '[role=gridcell]:not(.datagrid-hidden-column):not(.datagrid-placeholder-content), [role=columnheader]:not(.datagrid-hidden-column):not(.datagrid-placeholder-content), .datagrid-detail-caret',
            keyGrid: '[role=grid]',
        };
    }
    get grid() {
        return this.host?.querySelector(this.config.keyGrid);
    }
    get rows() {
        return this.host?.querySelectorAll(this.config.keyGridRows);
    }
    get cells() {
        return this.host?.querySelectorAll(this.config.keyGridCells);
    }
    ngOnDestroy() {
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
                .subscribe((e) => {
                // preserve right click for context menus & keyboard mouse control https://apple.stackexchange.com/questions/32715/how-do-i-open-the-context-menu-from-a-mac-keyboard
                if (e.buttons === 1 && !e.ctrlKey) {
                    const activeCell = this.cells
                        ? Array.from(this.cells).find(c => c === e.target || c === e.target.closest(this.config.keyGridCells))
                        : null;
                    if (activeCell) {
                        this.setActiveCell(activeCell, { keepFocus: isActionableItem(e.target) });
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
                .subscribe((e) => {
                // Skip column resize events
                if (e.target.classList.contains('drag-handle') &&
                    (e.key === Keys.ArrowLeft || e.key === Keys.ArrowRight)) {
                    return;
                }
                if (e.key === Keys.ArrowUp ||
                    e.key === Keys.ArrowDown ||
                    e.key === Keys.ArrowLeft ||
                    e.key === Keys.ArrowRight ||
                    e.key === Keys.End ||
                    e.key === Keys.Home ||
                    e.key === Keys.PageUp ||
                    e.key === Keys.PageDown) {
                    const currentCellCoords = this.getCurrentCellCoordinates();
                    const nextCellCoords = this.isExpandedRow(currentCellCoords.y) || this.isDetailsRow(currentCellCoords.y)
                        ? this.getNextForExpandedRowCoordinate(e, currentCellCoords)
                        : this.getNextItemCoordinate(e, currentCellCoords);
                    const activeItem = this.rows
                        ? Array.from(this.getCellsForRow(nextCellCoords.y))[nextCellCoords.x]
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
    initializeKeyGrid(host) {
        this.host = host;
        this.addListeners();
        this.resetKeyGrid();
    }
    resetKeyGrid() {
        this.cells?.forEach((i) => i.setAttribute('tabindex', '-1'));
        const firstCell = this.cells ? this.cells[0] : null;
        firstCell?.setAttribute('tabindex', '0');
    }
    removeActiveCell() {
        this._activeCell = null;
    }
    getActiveCell() {
        return this._activeCell;
    }
    setActiveCell(activeCell, { keepFocus } = { keepFocus: false }) {
        const prior = this.cells ? Array.from(this.cells).find(c => c.getAttribute('tabindex') === '0') : null;
        if (prior) {
            prior.setAttribute('tabindex', '-1');
        }
        activeCell.setAttribute('tabindex', '0');
        this._activeCell = activeCell;
        if (!this.skipItemFocus && !keepFocus) {
            let elementToFocus;
            if (activeCell.getAttribute('role') === 'columnheader') {
                elementToFocus = activeCell;
            }
            else {
                const tabbableElements = getTabbableItems(activeCell);
                elementToFocus = tabbableElements.length ? tabbableElements[0] : activeCell;
            }
            elementToFocus.focus();
        }
    }
    getNextForExpandedRowCoordinate(e, currentCellCoords) {
        if (e.key === Keys.PageUp || e.key === Keys.PageDown) {
            return this.getNextItemCoordinate(e, currentCellCoords);
        }
        if (!this.isDetailsRow(currentCellCoords.y) &&
            !this.isRowReplaced(currentCellCoords.y) &&
            (e.key === Keys.Home || e.key === Keys.End || e.key === Keys.ArrowRight || e.key === Keys.ArrowLeft)) {
            return this.getNextItemCoordinate(e, currentCellCoords);
        }
        const { numOfRows, numOfColumns, inlineStart, inlineEnd, isActionCell, nextCellCoords } = this.getCalcVariables(currentCellCoords);
        const isSingleCellExpandedRow = this.isSingleCellExpandedRow(currentCellCoords.y);
        if (e.key === Keys.ArrowUp && currentCellCoords.y !== 0) {
            nextCellCoords.y = currentCellCoords.y - 1;
            if (isSingleCellExpandedRow && !isActionCell) {
                if (this.isRowReplaced(currentCellCoords.y)) {
                    nextCellCoords.y = nextCellCoords.y - 1;
                }
                if (this.isDetailsRow(nextCellCoords.y)) {
                    nextCellCoords.x = 0;
                }
                else if (this.isDetailsRow(currentCellCoords.y) === false) {
                    // false check is intentional, the ! operator may be missed easily in this case
                    nextCellCoords.x = currentCellCoords.x;
                }
                else {
                    nextCellCoords.x = this.actionCellCount(nextCellCoords.y);
                }
                return nextCellCoords;
            }
            if (isActionCell && this.isDetailsRow(nextCellCoords.y)) {
                nextCellCoords.y = nextCellCoords.y - 1;
            }
            else if (this.isRowReplaced(nextCellCoords.y)) {
                nextCellCoords.y = nextCellCoords.y - 1;
                if (!this.isDetailsRow(nextCellCoords.y)) {
                    nextCellCoords.x = currentCellCoords.x + this.actionCellCount(nextCellCoords.y);
                }
            }
            else if (this.isDetailsRow(currentCellCoords.y) && !this.isDetailsRow(nextCellCoords.y)) {
                nextCellCoords.x = currentCellCoords.x + this.actionCellCount(nextCellCoords.y);
            }
            else if (!isActionCell && this.isDetailsRow(nextCellCoords.y)) {
                nextCellCoords.x = currentCellCoords.x - this.actionCellCount(currentCellCoords.y);
            }
        }
        else if (e.key === Keys.ArrowDown && currentCellCoords.y < numOfRows) {
            nextCellCoords.y = currentCellCoords.y + 1;
            if (isSingleCellExpandedRow && !isActionCell) {
                if (this.isRowReplaced(nextCellCoords.y)) {
                    nextCellCoords.y = nextCellCoords.y + 1;
                }
                if (this.isDetailsRow(nextCellCoords.y)) {
                    nextCellCoords.x = 0;
                }
                else {
                    nextCellCoords.x = this.actionCellCount(nextCellCoords.y);
                }
                return nextCellCoords;
            }
            if (isActionCell || this.isRowReplaced(nextCellCoords.y)) {
                nextCellCoords.y = nextCellCoords.y + 1;
            }
            else if (this.getCellsForRow(currentCellCoords.y).length > numOfColumns) {
                nextCellCoords.x = currentCellCoords.x - this.actionCellCount(currentCellCoords.y);
            }
            else {
                nextCellCoords.x = currentCellCoords.x + this.actionCellCount(nextCellCoords.y);
            }
        }
        else if (e.key === inlineStart) {
            if (currentCellCoords.x !== 0) {
                nextCellCoords.x = currentCellCoords.x - 1;
            }
            else if (!isActionCell) {
                nextCellCoords.y = currentCellCoords.y - 1;
                nextCellCoords.x = this.actionCellCount(nextCellCoords.y) - 1;
            }
        }
        else if (e.key === inlineEnd && currentCellCoords.x < numOfColumns) {
            if (isActionCell &&
                currentCellCoords.x === this.actionCellCount(currentCellCoords.x) - 1 &&
                this.isRowReplaced(currentCellCoords.y) &&
                !this.isDetailsRow(currentCellCoords.y)) {
                nextCellCoords.y = currentCellCoords.y + 1;
                nextCellCoords.x = 0;
            }
            else {
                nextCellCoords.x = currentCellCoords.x + 1;
            }
        }
        else if (e.key === Keys.End) {
            nextCellCoords.x = this.getCellsForRow(currentCellCoords.y).length - 1;
            if (e.ctrlKey) {
                nextCellCoords.x = numOfColumns;
                nextCellCoords.y = numOfRows;
            }
        }
        else if (e.key === Keys.Home) {
            nextCellCoords.x = 0;
            nextCellCoords.y = currentCellCoords.y - 1;
            if (e.ctrlKey) {
                nextCellCoords.y = 0;
            }
        }
        return nextCellCoords;
    }
    getNextItemCoordinate(e, currentCellCoords) {
        const { numOfRows, numOfColumns, inlineStart, inlineEnd, itemsPerPage, isActionCell, nextCellCoords } = this.getCalcVariables(currentCellCoords);
        if (e.key === Keys.ArrowUp && currentCellCoords.y !== 0) {
            nextCellCoords.y = currentCellCoords.y - 1;
            if (this.isSingleCellExpandedRow(nextCellCoords.y) && !isActionCell && this.isDetailsRow(nextCellCoords.y)) {
                nextCellCoords.x = 0;
                return nextCellCoords;
            }
            if (this.isDetailsRow(nextCellCoords.y)) {
                if (isActionCell) {
                    nextCellCoords.y = nextCellCoords.y - 1;
                }
                else {
                    nextCellCoords.x = nextCellCoords.x - this.actionCellCount(currentCellCoords.y);
                }
            }
        }
        else if (e.key === Keys.ArrowDown && currentCellCoords.y < numOfRows) {
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
        }
        else if (e.key === inlineStart && currentCellCoords.x !== 0) {
            nextCellCoords.x = currentCellCoords.x - 1;
        }
        else if (e.key === inlineEnd && currentCellCoords.x < numOfColumns) {
            nextCellCoords.x = currentCellCoords.x + 1;
        }
        else if (e.key === Keys.End) {
            nextCellCoords.x = numOfColumns;
            if (e.ctrlKey) {
                nextCellCoords.y = numOfRows;
            }
        }
        else if (e.key === Keys.Home) {
            nextCellCoords.x = 0;
            if (e.ctrlKey) {
                nextCellCoords.y = 0;
            }
        }
        else if (e.key === Keys.PageUp) {
            nextCellCoords.y = currentCellCoords.y - itemsPerPage > 0 ? currentCellCoords.y - itemsPerPage + 1 : 1;
        }
        else if (e.key === Keys.PageDown) {
            nextCellCoords.y =
                currentCellCoords.y + itemsPerPage < numOfRows ? currentCellCoords.y + itemsPerPage : numOfRows;
        }
        return nextCellCoords;
    }
    getCalcVariables(currentCellCoords) {
        const numOfRows = this.rows ? this.rows.length - 1 : 0;
        // calculate numOfColumns based on header cells.
        const numOfColumns = numOfRows ? this.getCellsForRow(0).length - 1 : 0;
        const dir = this.host.dir;
        const inlineStart = dir === 'rtl' ? Keys.ArrowRight : Keys.ArrowLeft;
        const inlineEnd = dir === 'rtl' ? Keys.ArrowLeft : Keys.ArrowRight;
        const itemsPerPage = Math.floor(this.host?.querySelector('.datagrid').clientHeight / this.rows[0].clientHeight) - 1 || 0;
        const isActionCell = this.isActionCell(currentCellCoords);
        const nextCellCoords = {
            x: currentCellCoords.x,
            y: currentCellCoords.y,
        };
        return { numOfRows, numOfColumns, inlineStart, inlineEnd, itemsPerPage, isActionCell, nextCellCoords };
    }
    getCurrentCellCoordinates() {
        const currentCell = this.cells ? Array.from(this.cells).find(i => i.getAttribute('tabindex') === '0') : null;
        const currentRow = currentCell ? currentCell.closest(this.config.keyGridRows) : null;
        const coordinates = {
            x: currentRow && currentCell
                ? Array.from(currentRow.querySelectorAll(this.config.keyGridCells)).indexOf(currentCell)
                : 0,
            y: currentRow && currentCell && this.rows ? Array.from(this.rows).indexOf(currentRow) : 0,
        };
        return coordinates;
    }
    getCellsForRow(index) {
        return this.rows[index].querySelectorAll(this.config.keyGridCells);
    }
    isExpandedRow(index) {
        const selectedElement = this.rows[index].querySelector('.datagrid-row-detail');
        return selectedElement ? selectedElement.style.display !== 'none' : false;
    }
    isDetailsRow(index) {
        return this.rows[index].classList.contains('datagrid-row-detail');
    }
    isRowReplaced(index) {
        return !!this.rows[index].closest('clr-dg-row.datagrid-row-replaced');
    }
    isSingleCellExpandedRow(index) {
        const row = this.rows[index].classList.contains('datagrid-row-detail')
            ? this.rows[index]
            : this.rows[index].querySelector('.datagrid-row-detail');
        return row?.querySelectorAll(this.config.keyGridCells).length === 1;
    }
    actionCellCount(index) {
        return this.actionCellsAsArray(index).length;
    }
    actionCellsAsArray(index) {
        return Array.from(this.rows[index].querySelectorAll('.datagrid-row-sticky .datagrid-cell, .datagrid-row-sticky .datagrid-column'));
    }
    isActionCell(cellCoords) {
        return !!this.actionCellsAsArray(cellCoords.y)[cellCoords.x];
    }
}
KeyNavigationGridController.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: KeyNavigationGridController, deps: [{ token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
KeyNavigationGridController.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: KeyNavigationGridController });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: KeyNavigationGridController, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.NgZone }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5LW5hdmlnYXRpb24tZ3JpZC5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC91dGlscy9rZXktbmF2aWdhdGlvbi1ncmlkLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMxQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXpELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQzs7QUFFdEQsTUFBTSx1QkFBdUIsR0FBRztJQUM5QixTQUFTO0lBQ1QsWUFBWTtJQUNaLHVCQUF1QjtJQUN2Qix3QkFBd0I7SUFDeEIsd0JBQXdCO0lBQ3hCLDBCQUEwQjtJQUMxQixRQUFRO0lBQ1IsUUFBUTtJQUNSLE9BQU87SUFDUCx3QkFBd0I7SUFDeEIsK0JBQStCO0NBQ2hDLENBQUM7QUFFRixNQUFNLFVBQVUsZ0JBQWdCLENBQUMsRUFBZTtJQUM5QyxNQUFNLHFCQUFxQixHQUFHLENBQUMsR0FBRyx1QkFBdUIsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQzdGLE1BQU0sZ0JBQWdCLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBa0IsQ0FBQztBQUM1RSxDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxFQUFlO0lBQ3ZDLE1BQU0sa0JBQWtCLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdE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QUNqQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFTyx1QkFBdUIsQ0FBQyxLQUFhO1FBQzNDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQztZQUNwRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDbEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFFM0QsT0FBTyxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFTyxlQUFlLENBQUMsS0FBYTtRQUNuQyxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDL0MsQ0FBQztJQUVPLGtCQUFrQixDQUFDLEtBQWE7UUFDdEMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsNEVBQTRFLENBQUMsQ0FDaEgsQ0FBQztJQUNKLENBQUM7SUFFTyxZQUFZLENBQUMsVUFBMkI7UUFDOUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQzs7d0hBclpVLDJCQUEyQjs0SEFBM0IsMkJBQTJCOzJGQUEzQiwyQkFBMkI7a0JBRHZDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUsIE5nWm9uZSwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmcm9tRXZlbnQsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBLZXlzIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvZW51bXMva2V5cy5lbnVtJztcblxuY29uc3QgYWN0aW9uYWJsZUl0ZW1TZWxlY3RvcnMgPSBbXG4gICdhW2hyZWZdJyxcbiAgJ2FyZWFbaHJlZl0nLFxuICAnaW5wdXQ6bm90KFtkaXNhYmxlZF0pJyxcbiAgJ2J1dHRvbjpub3QoW2Rpc2FibGVkXSknLFxuICAnc2VsZWN0Om5vdChbZGlzYWJsZWRdKScsXG4gICd0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSknLFxuICAnaWZyYW1lJyxcbiAgJ29iamVjdCcsXG4gICdlbWJlZCcsXG4gICdbY29udGVudGVkaXRhYmxlPXRydWVdJyxcbiAgJ1tyb2xlPWJ1dHRvbl06bm90KFtkaXNhYmxlZF0pJyxcbl07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUYWJiYWJsZUl0ZW1zKGVsOiBIVE1MRWxlbWVudCkge1xuICBjb25zdCB0YWJiYWJsZUl0ZW1TZWxlY3RvcnMgPSBbLi4uYWN0aW9uYWJsZUl0ZW1TZWxlY3RvcnMsICdbdGFiaW5kZXg9XCIwXCJdOm5vdChbZGlzYWJsZWRdKSddO1xuICBjb25zdCB0YWJiYWJsZVNlbGVjdG9yID0gdGFiYmFibGVJdGVtU2VsZWN0b3JzLmpvaW4oJywnKTtcbiAgcmV0dXJuIEFycmF5LmZyb20oZWwucXVlcnlTZWxlY3RvckFsbCh0YWJiYWJsZVNlbGVjdG9yKSkgYXMgSFRNTEVsZW1lbnRbXTtcbn1cblxuZnVuY3Rpb24gaXNBY3Rpb25hYmxlSXRlbShlbDogSFRNTEVsZW1lbnQpIHtcbiAgY29uc3QgYWN0aW9uYWJsZVNlbGVjdG9yID0gYWN0aW9uYWJsZUl0ZW1TZWxlY3RvcnMuam9pbignLCcpO1xuICByZXR1cm4gZWwubWF0Y2hlcyhhY3Rpb25hYmxlU2VsZWN0b3IpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEtleU5hdmlnYXRpb25HcmlkQ29uZmlnIHtcbiAga2V5R3JpZDogc3RyaW5nO1xuICBrZXlHcmlkUm93czogc3RyaW5nO1xuICBrZXlHcmlkQ2VsbHM6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDZWxsQ29vcmRpbmF0ZXMge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEtleU5hdmlnYXRpb25HcmlkQ29udHJvbGxlciBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHNraXBJdGVtRm9jdXMgPSBmYWxzZTtcblxuICBwcml2YXRlIGhvc3Q6IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIGNvbmZpZzogS2V5TmF2aWdhdGlvbkdyaWRDb25maWc7XG4gIHByaXZhdGUgbGlzdGVuZXJzQWRkZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHByaXZhdGUgX2FjdGl2ZUNlbGw6IEhUTUxFbGVtZW50ID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHpvbmU6IE5nWm9uZSkge1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAga2V5R3JpZFJvd3M6ICdbcm9sZT1yb3ddOm5vdCguZGF0YWdyaWQtcGxhY2Vob2xkZXIpOm5vdChbc3R5bGUqPVwiZGlzcGxheTogbm9uZVwiXSknLFxuICAgICAga2V5R3JpZENlbGxzOlxuICAgICAgICAnW3JvbGU9Z3JpZGNlbGxdOm5vdCguZGF0YWdyaWQtaGlkZGVuLWNvbHVtbik6bm90KC5kYXRhZ3JpZC1wbGFjZWhvbGRlci1jb250ZW50KSwgW3JvbGU9Y29sdW1uaGVhZGVyXTpub3QoLmRhdGFncmlkLWhpZGRlbi1jb2x1bW4pOm5vdCguZGF0YWdyaWQtcGxhY2Vob2xkZXItY29udGVudCksIC5kYXRhZ3JpZC1kZXRhaWwtY2FyZXQnLFxuICAgICAga2V5R3JpZDogJ1tyb2xlPWdyaWRdJyxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgZ3JpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5ob3N0Py5xdWVyeVNlbGVjdG9yKHRoaXMuY29uZmlnLmtleUdyaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgcm93cygpIHtcbiAgICByZXR1cm4gdGhpcy5ob3N0Py5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuY29uZmlnLmtleUdyaWRSb3dzKSBhcyBOb2RlTGlzdE9mPEhUTUxFbGVtZW50PjtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IGNlbGxzKCkge1xuICAgIHJldHVybiB0aGlzLmhvc3Q/LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5jb25maWcua2V5R3JpZENlbGxzKSBhcyBOb2RlTGlzdE9mPEhUTUxFbGVtZW50PjtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcbiAgfVxuXG4gIGFkZExpc3RlbmVycygpIHtcbiAgICBpZiAodGhpcy5saXN0ZW5lcnNBZGRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBmcm9tRXZlbnQodGhpcy5ncmlkLCAnbW91c2Vkb3duJylcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgICAuc3Vic2NyaWJlKChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgLy8gcHJlc2VydmUgcmlnaHQgY2xpY2sgZm9yIGNvbnRleHQgbWVudXMgJiBrZXlib2FyZCBtb3VzZSBjb250cm9sIGh0dHBzOi8vYXBwbGUuc3RhY2tleGNoYW5nZS5jb20vcXVlc3Rpb25zLzMyNzE1L2hvdy1kby1pLW9wZW4tdGhlLWNvbnRleHQtbWVudS1mcm9tLWEtbWFjLWtleWJvYXJkXG4gICAgICAgICAgaWYgKGUuYnV0dG9ucyA9PT0gMSAmJiAhZS5jdHJsS2V5KSB7XG4gICAgICAgICAgICBjb25zdCBhY3RpdmVDZWxsID0gdGhpcy5jZWxsc1xuICAgICAgICAgICAgICA/IEFycmF5LmZyb20odGhpcy5jZWxscykuZmluZChcbiAgICAgICAgICAgICAgICAgIGMgPT4gYyA9PT0gZS50YXJnZXQgfHwgYyA9PT0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KHRoaXMuY29uZmlnLmtleUdyaWRDZWxscylcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgICAgIGlmIChhY3RpdmVDZWxsKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ2VsbChhY3RpdmVDZWxsLCB7IGtlZXBGb2N1czogaXNBY3Rpb25hYmxlSXRlbShlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgZnJvbUV2ZW50KHRoaXMuZ3JpZCwgJ3doZWVsJylcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUFjdGl2ZUNlbGwoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGZyb21FdmVudCh0aGlzLmdyaWQsICdmb2N1c291dCcpXG4gICAgICAgIC5waXBlKGRlYm91bmNlVGltZSgwKSwgdGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5ncmlkLmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5yZW1vdmVBY3RpdmVDZWxsKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICBmcm9tRXZlbnQodGhpcy5ncmlkLCAna2V5ZG93bicpXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgICAgLnN1YnNjcmliZSgoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICAgIC8vIFNraXAgY29sdW1uIHJlc2l6ZSBldmVudHNcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsYXNzTGlzdC5jb250YWlucygnZHJhZy1oYW5kbGUnKSAmJlxuICAgICAgICAgICAgKGUua2V5ID09PSBLZXlzLkFycm93TGVmdCB8fCBlLmtleSA9PT0gS2V5cy5BcnJvd1JpZ2h0KVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBlLmtleSA9PT0gS2V5cy5BcnJvd1VwIHx8XG4gICAgICAgICAgICBlLmtleSA9PT0gS2V5cy5BcnJvd0Rvd24gfHxcbiAgICAgICAgICAgIGUua2V5ID09PSBLZXlzLkFycm93TGVmdCB8fFxuICAgICAgICAgICAgZS5rZXkgPT09IEtleXMuQXJyb3dSaWdodCB8fFxuICAgICAgICAgICAgZS5rZXkgPT09IEtleXMuRW5kIHx8XG4gICAgICAgICAgICBlLmtleSA9PT0gS2V5cy5Ib21lIHx8XG4gICAgICAgICAgICBlLmtleSA9PT0gS2V5cy5QYWdlVXAgfHxcbiAgICAgICAgICAgIGUua2V5ID09PSBLZXlzLlBhZ2VEb3duXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2VsbENvb3JkcyA9IHRoaXMuZ2V0Q3VycmVudENlbGxDb29yZGluYXRlcygpO1xuXG4gICAgICAgICAgICBjb25zdCBuZXh0Q2VsbENvb3JkcyA9XG4gICAgICAgICAgICAgIHRoaXMuaXNFeHBhbmRlZFJvdyhjdXJyZW50Q2VsbENvb3Jkcy55KSB8fCB0aGlzLmlzRGV0YWlsc1JvdyhjdXJyZW50Q2VsbENvb3Jkcy55KVxuICAgICAgICAgICAgICAgID8gdGhpcy5nZXROZXh0Rm9yRXhwYW5kZWRSb3dDb29yZGluYXRlKGUsIGN1cnJlbnRDZWxsQ29vcmRzKVxuICAgICAgICAgICAgICAgIDogdGhpcy5nZXROZXh0SXRlbUNvb3JkaW5hdGUoZSwgY3VycmVudENlbGxDb29yZHMpO1xuXG4gICAgICAgICAgICBjb25zdCBhY3RpdmVJdGVtID0gdGhpcy5yb3dzXG4gICAgICAgICAgICAgID8gKEFycmF5LmZyb20odGhpcy5nZXRDZWxsc0ZvclJvdyhuZXh0Q2VsbENvb3Jkcy55KSlbbmV4dENlbGxDb29yZHMueF0gYXMgSFRNTEVsZW1lbnQpXG4gICAgICAgICAgICAgIDogbnVsbDtcblxuICAgICAgICAgICAgaWYgKGFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDZWxsKGFjdGl2ZUl0ZW0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLmxpc3RlbmVyc0FkZGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGluaXRpYWxpemVLZXlHcmlkKGhvc3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5ob3N0ID0gaG9zdDtcbiAgICB0aGlzLmFkZExpc3RlbmVycygpO1xuICAgIHRoaXMucmVzZXRLZXlHcmlkKCk7XG4gIH1cblxuICByZXNldEtleUdyaWQoKSB7XG4gICAgdGhpcy5jZWxscz8uZm9yRWFjaCgoaTogSFRNTEVsZW1lbnQpID0+IGkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpKTtcbiAgICBjb25zdCBmaXJzdENlbGwgPSB0aGlzLmNlbGxzID8gdGhpcy5jZWxsc1swXSA6IG51bGw7XG4gICAgZmlyc3RDZWxsPy5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTtcbiAgfVxuXG4gIHJlbW92ZUFjdGl2ZUNlbGwoKSB7XG4gICAgdGhpcy5fYWN0aXZlQ2VsbCA9IG51bGw7XG4gIH1cblxuICBnZXRBY3RpdmVDZWxsKCkge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmVDZWxsO1xuICB9XG5cbiAgc2V0QWN0aXZlQ2VsbChhY3RpdmVDZWxsOiBIVE1MRWxlbWVudCwgeyBrZWVwRm9jdXMgfSA9IHsga2VlcEZvY3VzOiBmYWxzZSB9KSB7XG4gICAgY29uc3QgcHJpb3IgPSB0aGlzLmNlbGxzID8gQXJyYXkuZnJvbSh0aGlzLmNlbGxzKS5maW5kKGMgPT4gYy5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykgPT09ICcwJykgOiBudWxsO1xuXG4gICAgaWYgKHByaW9yKSB7XG4gICAgICBwcmlvci5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgfVxuXG4gICAgYWN0aXZlQ2VsbC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTtcbiAgICB0aGlzLl9hY3RpdmVDZWxsID0gYWN0aXZlQ2VsbDtcblxuICAgIGlmICghdGhpcy5za2lwSXRlbUZvY3VzICYmICFrZWVwRm9jdXMpIHtcbiAgICAgIGxldCBlbGVtZW50VG9Gb2N1czogSFRNTEVsZW1lbnQ7XG5cbiAgICAgIGlmIChhY3RpdmVDZWxsLmdldEF0dHJpYnV0ZSgncm9sZScpID09PSAnY29sdW1uaGVhZGVyJykge1xuICAgICAgICBlbGVtZW50VG9Gb2N1cyA9IGFjdGl2ZUNlbGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0YWJiYWJsZUVsZW1lbnRzID0gZ2V0VGFiYmFibGVJdGVtcyhhY3RpdmVDZWxsKTtcbiAgICAgICAgZWxlbWVudFRvRm9jdXMgPSB0YWJiYWJsZUVsZW1lbnRzLmxlbmd0aCA/IHRhYmJhYmxlRWxlbWVudHNbMF0gOiBhY3RpdmVDZWxsO1xuICAgICAgfVxuXG4gICAgICBlbGVtZW50VG9Gb2N1cy5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0TmV4dEZvckV4cGFuZGVkUm93Q29vcmRpbmF0ZShlOiBhbnksIGN1cnJlbnRDZWxsQ29vcmRzOiBDZWxsQ29vcmRpbmF0ZXMpIHtcbiAgICBpZiAoZS5rZXkgPT09IEtleXMuUGFnZVVwIHx8IGUua2V5ID09PSBLZXlzLlBhZ2VEb3duKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXROZXh0SXRlbUNvb3JkaW5hdGUoZSwgY3VycmVudENlbGxDb29yZHMpO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgICF0aGlzLmlzRGV0YWlsc1JvdyhjdXJyZW50Q2VsbENvb3Jkcy55KSAmJlxuICAgICAgIXRoaXMuaXNSb3dSZXBsYWNlZChjdXJyZW50Q2VsbENvb3Jkcy55KSAmJlxuICAgICAgKGUua2V5ID09PSBLZXlzLkhvbWUgfHwgZS5rZXkgPT09IEtleXMuRW5kIHx8IGUua2V5ID09PSBLZXlzLkFycm93UmlnaHQgfHwgZS5rZXkgPT09IEtleXMuQXJyb3dMZWZ0KVxuICAgICkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0TmV4dEl0ZW1Db29yZGluYXRlKGUsIGN1cnJlbnRDZWxsQ29vcmRzKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IG51bU9mUm93cywgbnVtT2ZDb2x1bW5zLCBpbmxpbmVTdGFydCwgaW5saW5lRW5kLCBpc0FjdGlvbkNlbGwsIG5leHRDZWxsQ29vcmRzIH0gPVxuICAgICAgdGhpcy5nZXRDYWxjVmFyaWFibGVzKGN1cnJlbnRDZWxsQ29vcmRzKTtcblxuICAgIGNvbnN0IGlzU2luZ2xlQ2VsbEV4cGFuZGVkUm93ID0gdGhpcy5pc1NpbmdsZUNlbGxFeHBhbmRlZFJvdyhjdXJyZW50Q2VsbENvb3Jkcy55KTtcblxuICAgIGlmIChlLmtleSA9PT0gS2V5cy5BcnJvd1VwICYmIGN1cnJlbnRDZWxsQ29vcmRzLnkgIT09IDApIHtcbiAgICAgIG5leHRDZWxsQ29vcmRzLnkgPSBjdXJyZW50Q2VsbENvb3Jkcy55IC0gMTtcblxuICAgICAgaWYgKGlzU2luZ2xlQ2VsbEV4cGFuZGVkUm93ICYmICFpc0FjdGlvbkNlbGwpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNSb3dSZXBsYWNlZChjdXJyZW50Q2VsbENvb3Jkcy55KSkge1xuICAgICAgICAgIG5leHRDZWxsQ29vcmRzLnkgPSBuZXh0Q2VsbENvb3Jkcy55IC0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzRGV0YWlsc1JvdyhuZXh0Q2VsbENvb3Jkcy55KSkge1xuICAgICAgICAgIG5leHRDZWxsQ29vcmRzLnggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNEZXRhaWxzUm93KGN1cnJlbnRDZWxsQ29vcmRzLnkpID09PSBmYWxzZSkge1xuICAgICAgICAgIC8vIGZhbHNlIGNoZWNrIGlzIGludGVudGlvbmFsLCB0aGUgISBvcGVyYXRvciBtYXkgYmUgbWlzc2VkIGVhc2lseSBpbiB0aGlzIGNhc2VcbiAgICAgICAgICBuZXh0Q2VsbENvb3Jkcy54ID0gY3VycmVudENlbGxDb29yZHMueDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXh0Q2VsbENvb3Jkcy54ID0gdGhpcy5hY3Rpb25DZWxsQ291bnQobmV4dENlbGxDb29yZHMueSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV4dENlbGxDb29yZHM7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0FjdGlvbkNlbGwgJiYgdGhpcy5pc0RldGFpbHNSb3cobmV4dENlbGxDb29yZHMueSkpIHtcbiAgICAgICAgbmV4dENlbGxDb29yZHMueSA9IG5leHRDZWxsQ29vcmRzLnkgLSAxO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzUm93UmVwbGFjZWQobmV4dENlbGxDb29yZHMueSkpIHtcbiAgICAgICAgbmV4dENlbGxDb29yZHMueSA9IG5leHRDZWxsQ29vcmRzLnkgLSAxO1xuXG4gICAgICAgIGlmICghdGhpcy5pc0RldGFpbHNSb3cobmV4dENlbGxDb29yZHMueSkpIHtcbiAgICAgICAgICBuZXh0Q2VsbENvb3Jkcy54ID0gY3VycmVudENlbGxDb29yZHMueCArIHRoaXMuYWN0aW9uQ2VsbENvdW50KG5leHRDZWxsQ29vcmRzLnkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNEZXRhaWxzUm93KGN1cnJlbnRDZWxsQ29vcmRzLnkpICYmICF0aGlzLmlzRGV0YWlsc1JvdyhuZXh0Q2VsbENvb3Jkcy55KSkge1xuICAgICAgICBuZXh0Q2VsbENvb3Jkcy54ID0gY3VycmVudENlbGxDb29yZHMueCArIHRoaXMuYWN0aW9uQ2VsbENvdW50KG5leHRDZWxsQ29vcmRzLnkpO1xuICAgICAgfSBlbHNlIGlmICghaXNBY3Rpb25DZWxsICYmIHRoaXMuaXNEZXRhaWxzUm93KG5leHRDZWxsQ29vcmRzLnkpKSB7XG4gICAgICAgIG5leHRDZWxsQ29vcmRzLnggPSBjdXJyZW50Q2VsbENvb3Jkcy54IC0gdGhpcy5hY3Rpb25DZWxsQ291bnQoY3VycmVudENlbGxDb29yZHMueSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PT0gS2V5cy5BcnJvd0Rvd24gJiYgY3VycmVudENlbGxDb29yZHMueSA8IG51bU9mUm93cykge1xuICAgICAgbmV4dENlbGxDb29yZHMueSA9IGN1cnJlbnRDZWxsQ29vcmRzLnkgKyAxO1xuXG4gICAgICBpZiAoaXNTaW5nbGVDZWxsRXhwYW5kZWRSb3cgJiYgIWlzQWN0aW9uQ2VsbCkge1xuICAgICAgICBpZiAodGhpcy5pc1Jvd1JlcGxhY2VkKG5leHRDZWxsQ29vcmRzLnkpKSB7XG4gICAgICAgICAgbmV4dENlbGxDb29yZHMueSA9IG5leHRDZWxsQ29vcmRzLnkgKyAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNEZXRhaWxzUm93KG5leHRDZWxsQ29vcmRzLnkpKSB7XG4gICAgICAgICAgbmV4dENlbGxDb29yZHMueCA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV4dENlbGxDb29yZHMueCA9IHRoaXMuYWN0aW9uQ2VsbENvdW50KG5leHRDZWxsQ29vcmRzLnkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXh0Q2VsbENvb3JkcztcbiAgICAgIH1cblxuICAgICAgaWYgKGlzQWN0aW9uQ2VsbCB8fCB0aGlzLmlzUm93UmVwbGFjZWQobmV4dENlbGxDb29yZHMueSkpIHtcbiAgICAgICAgbmV4dENlbGxDb29yZHMueSA9IG5leHRDZWxsQ29vcmRzLnkgKyAxO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmdldENlbGxzRm9yUm93KGN1cnJlbnRDZWxsQ29vcmRzLnkpLmxlbmd0aCA+IG51bU9mQ29sdW1ucykge1xuICAgICAgICBuZXh0Q2VsbENvb3Jkcy54ID0gY3VycmVudENlbGxDb29yZHMueCAtIHRoaXMuYWN0aW9uQ2VsbENvdW50KGN1cnJlbnRDZWxsQ29vcmRzLnkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dENlbGxDb29yZHMueCA9IGN1cnJlbnRDZWxsQ29vcmRzLnggKyB0aGlzLmFjdGlvbkNlbGxDb3VudChuZXh0Q2VsbENvb3Jkcy55KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGUua2V5ID09PSBpbmxpbmVTdGFydCkge1xuICAgICAgaWYgKGN1cnJlbnRDZWxsQ29vcmRzLnggIT09IDApIHtcbiAgICAgICAgbmV4dENlbGxDb29yZHMueCA9IGN1cnJlbnRDZWxsQ29vcmRzLnggLSAxO1xuICAgICAgfSBlbHNlIGlmICghaXNBY3Rpb25DZWxsKSB7XG4gICAgICAgIG5leHRDZWxsQ29vcmRzLnkgPSBjdXJyZW50Q2VsbENvb3Jkcy55IC0gMTtcbiAgICAgICAgbmV4dENlbGxDb29yZHMueCA9IHRoaXMuYWN0aW9uQ2VsbENvdW50KG5leHRDZWxsQ29vcmRzLnkpIC0gMTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGUua2V5ID09PSBpbmxpbmVFbmQgJiYgY3VycmVudENlbGxDb29yZHMueCA8IG51bU9mQ29sdW1ucykge1xuICAgICAgaWYgKFxuICAgICAgICBpc0FjdGlvbkNlbGwgJiZcbiAgICAgICAgY3VycmVudENlbGxDb29yZHMueCA9PT0gdGhpcy5hY3Rpb25DZWxsQ291bnQoY3VycmVudENlbGxDb29yZHMueCkgLSAxICYmXG4gICAgICAgIHRoaXMuaXNSb3dSZXBsYWNlZChjdXJyZW50Q2VsbENvb3Jkcy55KSAmJlxuICAgICAgICAhdGhpcy5pc0RldGFpbHNSb3coY3VycmVudENlbGxDb29yZHMueSlcbiAgICAgICkge1xuICAgICAgICBuZXh0Q2VsbENvb3Jkcy55ID0gY3VycmVudENlbGxDb29yZHMueSArIDE7XG4gICAgICAgIG5leHRDZWxsQ29vcmRzLnggPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dENlbGxDb29yZHMueCA9IGN1cnJlbnRDZWxsQ29vcmRzLnggKyAxO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZS5rZXkgPT09IEtleXMuRW5kKSB7XG4gICAgICBuZXh0Q2VsbENvb3Jkcy54ID0gdGhpcy5nZXRDZWxsc0ZvclJvdyhjdXJyZW50Q2VsbENvb3Jkcy55KS5sZW5ndGggLSAxO1xuXG4gICAgICBpZiAoZS5jdHJsS2V5KSB7XG4gICAgICAgIG5leHRDZWxsQ29vcmRzLnggPSBudW1PZkNvbHVtbnM7XG4gICAgICAgIG5leHRDZWxsQ29vcmRzLnkgPSBudW1PZlJvd3M7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PT0gS2V5cy5Ib21lKSB7XG4gICAgICBuZXh0Q2VsbENvb3Jkcy54ID0gMDtcbiAgICAgIG5leHRDZWxsQ29vcmRzLnkgPSBjdXJyZW50Q2VsbENvb3Jkcy55IC0gMTtcblxuICAgICAgaWYgKGUuY3RybEtleSkge1xuICAgICAgICBuZXh0Q2VsbENvb3Jkcy55ID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dENlbGxDb29yZHM7XG4gIH1cblxuICBwcml2YXRlIGdldE5leHRJdGVtQ29vcmRpbmF0ZShlOiBhbnksIGN1cnJlbnRDZWxsQ29vcmRzOiBDZWxsQ29vcmRpbmF0ZXMpIHtcbiAgICBjb25zdCB7IG51bU9mUm93cywgbnVtT2ZDb2x1bW5zLCBpbmxpbmVTdGFydCwgaW5saW5lRW5kLCBpdGVtc1BlclBhZ2UsIGlzQWN0aW9uQ2VsbCwgbmV4dENlbGxDb29yZHMgfSA9XG4gICAgICB0aGlzLmdldENhbGNWYXJpYWJsZXMoY3VycmVudENlbGxDb29yZHMpO1xuXG4gICAgaWYgKGUua2V5ID09PSBLZXlzLkFycm93VXAgJiYgY3VycmVudENlbGxDb29yZHMueSAhPT0gMCkge1xuICAgICAgbmV4dENlbGxDb29yZHMueSA9IGN1cnJlbnRDZWxsQ29vcmRzLnkgLSAxO1xuXG4gICAgICBpZiAodGhpcy5pc1NpbmdsZUNlbGxFeHBhbmRlZFJvdyhuZXh0Q2VsbENvb3Jkcy55KSAmJiAhaXNBY3Rpb25DZWxsICYmIHRoaXMuaXNEZXRhaWxzUm93KG5leHRDZWxsQ29vcmRzLnkpKSB7XG4gICAgICAgIG5leHRDZWxsQ29vcmRzLnggPSAwO1xuICAgICAgICByZXR1cm4gbmV4dENlbGxDb29yZHM7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmlzRGV0YWlsc1JvdyhuZXh0Q2VsbENvb3Jkcy55KSkge1xuICAgICAgICBpZiAoaXNBY3Rpb25DZWxsKSB7XG4gICAgICAgICAgbmV4dENlbGxDb29yZHMueSA9IG5leHRDZWxsQ29vcmRzLnkgLSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5leHRDZWxsQ29vcmRzLnggPSBuZXh0Q2VsbENvb3Jkcy54IC0gdGhpcy5hY3Rpb25DZWxsQ291bnQoY3VycmVudENlbGxDb29yZHMueSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGUua2V5ID09PSBLZXlzLkFycm93RG93biAmJiBjdXJyZW50Q2VsbENvb3Jkcy55IDwgbnVtT2ZSb3dzKSB7XG4gICAgICBuZXh0Q2VsbENvb3Jkcy55ID0gY3VycmVudENlbGxDb29yZHMueSArIDE7XG5cbiAgICAgIGlmICh0aGlzLmlzU2luZ2xlQ2VsbEV4cGFuZGVkUm93KG5leHRDZWxsQ29vcmRzLnkpICYmICFpc0FjdGlvbkNlbGwgJiYgdGhpcy5pc1Jvd1JlcGxhY2VkKG5leHRDZWxsQ29vcmRzLnkpKSB7XG4gICAgICAgIG5leHRDZWxsQ29vcmRzLnggPSAwO1xuICAgICAgICBuZXh0Q2VsbENvb3Jkcy55ID0gbmV4dENlbGxDb29yZHMueSArIDE7XG4gICAgICAgIHJldHVybiBuZXh0Q2VsbENvb3JkcztcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc0FjdGlvbkNlbGwgJiYgdGhpcy5pc1Jvd1JlcGxhY2VkKG5leHRDZWxsQ29vcmRzLnkpKSB7XG4gICAgICAgIG5leHRDZWxsQ29vcmRzLnkgPSBuZXh0Q2VsbENvb3Jkcy55ICsgMTtcbiAgICAgICAgbmV4dENlbGxDb29yZHMueCA9IG5leHRDZWxsQ29vcmRzLnggLSB0aGlzLmFjdGlvbkNlbGxDb3VudChjdXJyZW50Q2VsbENvb3Jkcy55KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGUua2V5ID09PSBpbmxpbmVTdGFydCAmJiBjdXJyZW50Q2VsbENvb3Jkcy54ICE9PSAwKSB7XG4gICAgICBuZXh0Q2VsbENvb3Jkcy54ID0gY3VycmVudENlbGxDb29yZHMueCAtIDE7XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PT0gaW5saW5lRW5kICYmIGN1cnJlbnRDZWxsQ29vcmRzLnggPCBudW1PZkNvbHVtbnMpIHtcbiAgICAgIG5leHRDZWxsQ29vcmRzLnggPSBjdXJyZW50Q2VsbENvb3Jkcy54ICsgMTtcbiAgICB9IGVsc2UgaWYgKGUua2V5ID09PSBLZXlzLkVuZCkge1xuICAgICAgbmV4dENlbGxDb29yZHMueCA9IG51bU9mQ29sdW1ucztcblxuICAgICAgaWYgKGUuY3RybEtleSkge1xuICAgICAgICBuZXh0Q2VsbENvb3Jkcy55ID0gbnVtT2ZSb3dzO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZS5rZXkgPT09IEtleXMuSG9tZSkge1xuICAgICAgbmV4dENlbGxDb29yZHMueCA9IDA7XG5cbiAgICAgIGlmIChlLmN0cmxLZXkpIHtcbiAgICAgICAgbmV4dENlbGxDb29yZHMueSA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PT0gS2V5cy5QYWdlVXApIHtcbiAgICAgIG5leHRDZWxsQ29vcmRzLnkgPSBjdXJyZW50Q2VsbENvb3Jkcy55IC0gaXRlbXNQZXJQYWdlID4gMCA/IGN1cnJlbnRDZWxsQ29vcmRzLnkgLSBpdGVtc1BlclBhZ2UgKyAxIDogMTtcbiAgICB9IGVsc2UgaWYgKGUua2V5ID09PSBLZXlzLlBhZ2VEb3duKSB7XG4gICAgICBuZXh0Q2VsbENvb3Jkcy55ID1cbiAgICAgICAgY3VycmVudENlbGxDb29yZHMueSArIGl0ZW1zUGVyUGFnZSA8IG51bU9mUm93cyA/IGN1cnJlbnRDZWxsQ29vcmRzLnkgKyBpdGVtc1BlclBhZ2UgOiBudW1PZlJvd3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHRDZWxsQ29vcmRzO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDYWxjVmFyaWFibGVzKGN1cnJlbnRDZWxsQ29vcmRzOiBDZWxsQ29vcmRpbmF0ZXMpIHtcbiAgICBjb25zdCBudW1PZlJvd3MgPSB0aGlzLnJvd3MgPyB0aGlzLnJvd3MubGVuZ3RoIC0gMSA6IDA7XG5cbiAgICAvLyBjYWxjdWxhdGUgbnVtT2ZDb2x1bW5zIGJhc2VkIG9uIGhlYWRlciBjZWxscy5cbiAgICBjb25zdCBudW1PZkNvbHVtbnMgPSBudW1PZlJvd3MgPyB0aGlzLmdldENlbGxzRm9yUm93KDApLmxlbmd0aCAtIDEgOiAwO1xuXG4gICAgY29uc3QgZGlyID0gdGhpcy5ob3N0LmRpcjtcbiAgICBjb25zdCBpbmxpbmVTdGFydCA9IGRpciA9PT0gJ3J0bCcgPyBLZXlzLkFycm93UmlnaHQgOiBLZXlzLkFycm93TGVmdDtcbiAgICBjb25zdCBpbmxpbmVFbmQgPSBkaXIgPT09ICdydGwnID8gS2V5cy5BcnJvd0xlZnQgOiBLZXlzLkFycm93UmlnaHQ7XG5cbiAgICBjb25zdCBpdGVtc1BlclBhZ2UgPVxuICAgICAgTWF0aC5mbG9vcih0aGlzLmhvc3Q/LnF1ZXJ5U2VsZWN0b3IoJy5kYXRhZ3JpZCcpLmNsaWVudEhlaWdodCAvIHRoaXMucm93c1swXS5jbGllbnRIZWlnaHQpIC0gMSB8fCAwO1xuXG4gICAgY29uc3QgaXNBY3Rpb25DZWxsID0gdGhpcy5pc0FjdGlvbkNlbGwoY3VycmVudENlbGxDb29yZHMpO1xuXG4gICAgY29uc3QgbmV4dENlbGxDb29yZHM6IENlbGxDb29yZGluYXRlcyA9IHtcbiAgICAgIHg6IGN1cnJlbnRDZWxsQ29vcmRzLngsXG4gICAgICB5OiBjdXJyZW50Q2VsbENvb3Jkcy55LFxuICAgIH07XG5cbiAgICByZXR1cm4geyBudW1PZlJvd3MsIG51bU9mQ29sdW1ucywgaW5saW5lU3RhcnQsIGlubGluZUVuZCwgaXRlbXNQZXJQYWdlLCBpc0FjdGlvbkNlbGwsIG5leHRDZWxsQ29vcmRzIH07XG4gIH1cblxuICBwcml2YXRlIGdldEN1cnJlbnRDZWxsQ29vcmRpbmF0ZXMoKSB7XG4gICAgY29uc3QgY3VycmVudENlbGwgPSB0aGlzLmNlbGxzID8gQXJyYXkuZnJvbSh0aGlzLmNlbGxzKS5maW5kKGkgPT4gaS5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykgPT09ICcwJykgOiBudWxsO1xuICAgIGNvbnN0IGN1cnJlbnRSb3c6IEhUTUxFbGVtZW50ID0gY3VycmVudENlbGwgPyBjdXJyZW50Q2VsbC5jbG9zZXN0KHRoaXMuY29uZmlnLmtleUdyaWRSb3dzKSA6IG51bGw7XG5cbiAgICBjb25zdCBjb29yZGluYXRlczogQ2VsbENvb3JkaW5hdGVzID0ge1xuICAgICAgeDpcbiAgICAgICAgY3VycmVudFJvdyAmJiBjdXJyZW50Q2VsbFxuICAgICAgICAgID8gQXJyYXkuZnJvbShjdXJyZW50Um93LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5jb25maWcua2V5R3JpZENlbGxzKSkuaW5kZXhPZihjdXJyZW50Q2VsbClcbiAgICAgICAgICA6IDAsXG4gICAgICB5OiBjdXJyZW50Um93ICYmIGN1cnJlbnRDZWxsICYmIHRoaXMucm93cyA/IEFycmF5LmZyb20odGhpcy5yb3dzKS5pbmRleE9mKGN1cnJlbnRSb3cpIDogMCxcbiAgICB9O1xuXG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDZWxsc0ZvclJvdyhpbmRleDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMucm93c1tpbmRleF0ucXVlcnlTZWxlY3RvckFsbCh0aGlzLmNvbmZpZy5rZXlHcmlkQ2VsbHMpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0V4cGFuZGVkUm93KGluZGV4OiBudW1iZXIpIHtcbiAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5yb3dzW2luZGV4XS5xdWVyeVNlbGVjdG9yKCcuZGF0YWdyaWQtcm93LWRldGFpbCcpO1xuXG4gICAgcmV0dXJuIHNlbGVjdGVkRWxlbWVudCA/IHNlbGVjdGVkRWxlbWVudC5zdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScgOiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgaXNEZXRhaWxzUm93KGluZGV4OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5yb3dzW2luZGV4XS5jbGFzc0xpc3QuY29udGFpbnMoJ2RhdGFncmlkLXJvdy1kZXRhaWwnKTtcbiAgfVxuXG4gIHByaXZhdGUgaXNSb3dSZXBsYWNlZChpbmRleDogbnVtYmVyKSB7XG4gICAgcmV0dXJuICEhdGhpcy5yb3dzW2luZGV4XS5jbG9zZXN0KCdjbHItZGctcm93LmRhdGFncmlkLXJvdy1yZXBsYWNlZCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc1NpbmdsZUNlbGxFeHBhbmRlZFJvdyhpbmRleDogbnVtYmVyKSB7XG4gICAgY29uc3Qgcm93ID0gdGhpcy5yb3dzW2luZGV4XS5jbGFzc0xpc3QuY29udGFpbnMoJ2RhdGFncmlkLXJvdy1kZXRhaWwnKVxuICAgICAgPyB0aGlzLnJvd3NbaW5kZXhdXG4gICAgICA6IHRoaXMucm93c1tpbmRleF0ucXVlcnlTZWxlY3RvcignLmRhdGFncmlkLXJvdy1kZXRhaWwnKTtcblxuICAgIHJldHVybiByb3c/LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5jb25maWcua2V5R3JpZENlbGxzKS5sZW5ndGggPT09IDE7XG4gIH1cblxuICBwcml2YXRlIGFjdGlvbkNlbGxDb3VudChpbmRleDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aW9uQ2VsbHNBc0FycmF5KGluZGV4KS5sZW5ndGg7XG4gIH1cblxuICBwcml2YXRlIGFjdGlvbkNlbGxzQXNBcnJheShpbmRleDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oXG4gICAgICB0aGlzLnJvd3NbaW5kZXhdLnF1ZXJ5U2VsZWN0b3JBbGwoJy5kYXRhZ3JpZC1yb3ctc3RpY2t5IC5kYXRhZ3JpZC1jZWxsLCAuZGF0YWdyaWQtcm93LXN0aWNreSAuZGF0YWdyaWQtY29sdW1uJylcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0FjdGlvbkNlbGwoY2VsbENvb3JkczogQ2VsbENvb3JkaW5hdGVzKSB7XG4gICAgcmV0dXJuICEhdGhpcy5hY3Rpb25DZWxsc0FzQXJyYXkoY2VsbENvb3Jkcy55KVtjZWxsQ29vcmRzLnhdO1xuICB9XG59XG4iXX0=
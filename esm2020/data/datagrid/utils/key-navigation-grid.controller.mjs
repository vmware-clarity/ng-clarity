/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { EventEmitter, Injectable } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Keys } from '../../../utils/enums/keys.enum';
import { KeyNavigationUtils } from './key-navigation-utils';
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
        this.nextCellCoordsEmitter = new EventEmitter(false);
        this.skipItemFocus = false;
        this.preventScrollOnFocus = false;
        this.config = {
            keyGridRows: '[role=row]:not(.datagrid-placeholder):not([style*="display: none"])',
            keyGridCells: '[role=gridcell]:not(.datagrid-hidden-column):not(.datagrid-placeholder-content), [role=columnheader]:not(.datagrid-hidden-column):not(.datagrid-placeholder-content), .datagrid-detail-caret',
            keyGrid: '[role=grid]',
        };
        this.listenersAdded = false;
        this.destroy$ = new Subject();
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
            fromEvent(this.keyNavUtils.grid, 'mousedown')
                .pipe(takeUntil(this.destroy$))
                .subscribe((e) => {
                // preserve right click for context menus & keyboard mouse control https://apple.stackexchange.com/questions/32715/how-do-i-open-the-context-menu-from-a-mac-keyboard
                if (e.buttons === 1 && !e.ctrlKey) {
                    const activeCell = this.keyNavUtils.cells
                        ? Array.from(this.keyNavUtils.cells).find(c => c === e.target || c === e.target.closest(this.config.keyGridCells))
                        : null;
                    if (activeCell) {
                        this.setActiveCell(activeCell);
                        if (!isActionableItem(e.target)) {
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
                    const nextCellCoords = this.keyNavUtils.getNextItemCoordinate(e);
                    if (nextCellCoords.y > 0 &&
                        (e.key === Keys.ArrowUp || e.key === Keys.ArrowDown || e.key === Keys.PageUp || e.key === Keys.PageDown)) {
                        this.keyNavUtils.setAriaRowIndexTo(nextCellCoords);
                        this.nextCellCoordsEmitter.emit(nextCellCoords);
                    }
                    const activeItem = this.keyNavUtils.rows
                        ? Array.from(this.keyNavUtils.getCellsForRow(nextCellCoords.y))[nextCellCoords.x]
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
    initializeKeyGrid(host) {
        this.keyNavUtils = new KeyNavigationUtils(host, this.config);
        this.addListeners();
        this.resetKeyGrid();
    }
    resetKeyGrid() {
        this.keyNavUtils.cells?.forEach((i) => i.setAttribute('tabindex', '-1'));
        const firstCell = this.keyNavUtils.cells ? this.keyNavUtils.cells[0] : null;
        firstCell?.setAttribute('tabindex', '0');
    }
    setActiveCell(activeCell) {
        const prior = this.keyNavUtils.cells
            ? Array.from(this.keyNavUtils.cells).find(c => c.getAttribute('tabindex') === '0')
            : null;
        if (prior) {
            prior.setAttribute('tabindex', '-1');
        }
        activeCell.setAttribute('tabindex', '0');
    }
    focusElement(activeCell, options = { preventScroll: false }) {
        if (this.skipItemFocus) {
            return;
        }
        let elementToFocus;
        if (activeCell.getAttribute('role') === 'columnheader') {
            elementToFocus = activeCell;
        }
        else {
            const tabbableElements = getTabbableItems(activeCell);
            elementToFocus = tabbableElements.length ? tabbableElements[0] : activeCell;
        }
        elementToFocus.focus(options);
    }
}
KeyNavigationGridController.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: KeyNavigationGridController, deps: [{ token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
KeyNavigationGridController.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: KeyNavigationGridController });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: KeyNavigationGridController, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.NgZone }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5LW5hdmlnYXRpb24tZ3JpZC5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC91dGlscy9rZXktbmF2aWdhdGlvbi1ncmlkLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBcUIsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDMUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTNDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN0RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7QUFFNUQsTUFBTSx1QkFBdUIsR0FBRztJQUM5QixTQUFTO0lBQ1QsWUFBWTtJQUNaLHVCQUF1QjtJQUN2Qix3QkFBd0I7SUFDeEIsd0JBQXdCO0lBQ3hCLDBCQUEwQjtJQUMxQixRQUFRO0lBQ1IsUUFBUTtJQUNSLE9BQU87SUFDUCx3QkFBd0I7SUFDeEIsK0JBQStCO0NBQ2hDLENBQUM7QUFFRixNQUFNLFVBQVUsZ0JBQWdCLENBQUMsRUFBZTtJQUM5QyxNQUFNLHFCQUFxQixHQUFHLENBQUMsR0FBRyx1QkFBdUIsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQzdGLE1BQU0sZ0JBQWdCLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBa0IsQ0FBQztBQUM1RSxDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxFQUFlO0lBQ3ZDLE1BQU0sa0JBQWtCLEdB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KlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEV2ZW50RW1pdHRlciwgSW5qZWN0YWJsZSwgTmdab25lLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGZyb21FdmVudCwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBLZXlzIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvZW51bXMva2V5cy5lbnVtJztcbmltcG9ydCB7IEtleU5hdmlnYXRpb25VdGlscyB9IGZyb20gJy4va2V5LW5hdmlnYXRpb24tdXRpbHMnO1xuXG5jb25zdCBhY3Rpb25hYmxlSXRlbVNlbGVjdG9ycyA9IFtcbiAgJ2FbaHJlZl0nLFxuICAnYXJlYVtocmVmXScsXG4gICdpbnB1dDpub3QoW2Rpc2FibGVkXSknLFxuICAnYnV0dG9uOm5vdChbZGlzYWJsZWRdKScsXG4gICdzZWxlY3Q6bm90KFtkaXNhYmxlZF0pJyxcbiAgJ3RleHRhcmVhOm5vdChbZGlzYWJsZWRdKScsXG4gICdpZnJhbWUnLFxuICAnb2JqZWN0JyxcbiAgJ2VtYmVkJyxcbiAgJ1tjb250ZW50ZWRpdGFibGU9dHJ1ZV0nLFxuICAnW3JvbGU9YnV0dG9uXTpub3QoW2Rpc2FibGVkXSknLFxuXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRhYmJhYmxlSXRlbXMoZWw6IEhUTUxFbGVtZW50KSB7XG4gIGNvbnN0IHRhYmJhYmxlSXRlbVNlbGVjdG9ycyA9IFsuLi5hY3Rpb25hYmxlSXRlbVNlbGVjdG9ycywgJ1t0YWJpbmRleD1cIjBcIl06bm90KFtkaXNhYmxlZF0pJ107XG4gIGNvbnN0IHRhYmJhYmxlU2VsZWN0b3IgPSB0YWJiYWJsZUl0ZW1TZWxlY3RvcnMuam9pbignLCcpO1xuICByZXR1cm4gQXJyYXkuZnJvbShlbC5xdWVyeVNlbGVjdG9yQWxsKHRhYmJhYmxlU2VsZWN0b3IpKSBhcyBIVE1MRWxlbWVudFtdO1xufVxuXG5mdW5jdGlvbiBpc0FjdGlvbmFibGVJdGVtKGVsOiBIVE1MRWxlbWVudCkge1xuICBjb25zdCBhY3Rpb25hYmxlU2VsZWN0b3IgPSBhY3Rpb25hYmxlSXRlbVNlbGVjdG9ycy5qb2luKCcsJyk7XG4gIHJldHVybiBlbC5tYXRjaGVzKGFjdGlvbmFibGVTZWxlY3Rvcik7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgS2V5TmF2aWdhdGlvbkdyaWRDb25maWcge1xuICBrZXlHcmlkOiBzdHJpbmc7XG4gIGtleUdyaWRSb3dzOiBzdHJpbmc7XG4gIGtleUdyaWRDZWxsczogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENlbGxDb29yZGluYXRlcyB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICBhcmlhUm93SW5kZXg/OiBzdHJpbmc7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBLZXlOYXZpZ2F0aW9uR3JpZENvbnRyb2xsZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBuZXh0Q2VsbENvb3Jkc0VtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPENlbGxDb29yZGluYXRlcz4oZmFsc2UpO1xuXG4gIHNraXBJdGVtRm9jdXMgPSBmYWxzZTtcbiAgcHJldmVudFNjcm9sbE9uRm9jdXMgPSBmYWxzZTtcblxuICBjb25maWc6IEtleU5hdmlnYXRpb25HcmlkQ29uZmlnID0ge1xuICAgIGtleUdyaWRSb3dzOiAnW3JvbGU9cm93XTpub3QoLmRhdGFncmlkLXBsYWNlaG9sZGVyKTpub3QoW3N0eWxlKj1cImRpc3BsYXk6IG5vbmVcIl0pJyxcbiAgICBrZXlHcmlkQ2VsbHM6XG4gICAgICAnW3JvbGU9Z3JpZGNlbGxdOm5vdCguZGF0YWdyaWQtaGlkZGVuLWNvbHVtbik6bm90KC5kYXRhZ3JpZC1wbGFjZWhvbGRlci1jb250ZW50KSwgW3JvbGU9Y29sdW1uaGVhZGVyXTpub3QoLmRhdGFncmlkLWhpZGRlbi1jb2x1bW4pOm5vdCguZGF0YWdyaWQtcGxhY2Vob2xkZXItY29udGVudCksIC5kYXRhZ3JpZC1kZXRhaWwtY2FyZXQnLFxuICAgIGtleUdyaWQ6ICdbcm9sZT1ncmlkXScsXG4gIH07XG4gIHByaXZhdGUga2V5TmF2VXRpbHM6IEtleU5hdmlnYXRpb25VdGlscztcbiAgcHJpdmF0ZSBsaXN0ZW5lcnNBZGRlZCA9IGZhbHNlO1xuICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHpvbmU6IE5nWm9uZSkge31cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gIH1cblxuICBhZGRMaXN0ZW5lcnMoKSB7XG4gICAgaWYgKHRoaXMubGlzdGVuZXJzQWRkZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgZnJvbUV2ZW50KHRoaXMua2V5TmF2VXRpbHMuZ3JpZCwgJ21vdXNlZG93bicpXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgICAgLnN1YnNjcmliZSgoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgIC8vIHByZXNlcnZlIHJpZ2h0IGNsaWNrIGZvciBjb250ZXh0IG1lbnVzICYga2V5Ym9hcmQgbW91c2UgY29udHJvbCBodHRwczovL2FwcGxlLnN0YWNrZXhjaGFuZ2UuY29tL3F1ZXN0aW9ucy8zMjcxNS9ob3ctZG8taS1vcGVuLXRoZS1jb250ZXh0LW1lbnUtZnJvbS1hLW1hYy1rZXlib2FyZFxuICAgICAgICAgIGlmIChlLmJ1dHRvbnMgPT09IDEgJiYgIWUuY3RybEtleSkge1xuICAgICAgICAgICAgY29uc3QgYWN0aXZlQ2VsbCA9IHRoaXMua2V5TmF2VXRpbHMuY2VsbHNcbiAgICAgICAgICAgICAgPyBBcnJheS5mcm9tKHRoaXMua2V5TmF2VXRpbHMuY2VsbHMpLmZpbmQoXG4gICAgICAgICAgICAgICAgICBjID0+IGMgPT09IGUudGFyZ2V0IHx8IGMgPT09IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCh0aGlzLmNvbmZpZy5rZXlHcmlkQ2VsbHMpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICA6IG51bGw7XG4gICAgICAgICAgICBpZiAoYWN0aXZlQ2VsbCkge1xuICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUNlbGwoYWN0aXZlQ2VsbCk7XG5cbiAgICAgICAgICAgICAgaWYgKCFpc0FjdGlvbmFibGVJdGVtKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNFbGVtZW50KGFjdGl2ZUNlbGwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgZnJvbUV2ZW50KHRoaXMua2V5TmF2VXRpbHMuZ3JpZCwgJ3doZWVsJylcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLm5leHRDZWxsQ29vcmRzRW1pdHRlci5lbWl0KG51bGwpO1xuICAgICAgICB9KTtcblxuICAgICAgZnJvbUV2ZW50KHRoaXMua2V5TmF2VXRpbHMuZ3JpZCwgJ2tleWRvd24nKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgICAvLyBTa2lwIGNvbHVtbiByZXNpemUgZXZlbnRzXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QuY29udGFpbnMoJ2RyYWctaGFuZGxlJykgJiZcbiAgICAgICAgICAgIChlLmtleSA9PT0gS2V5cy5BcnJvd0xlZnQgfHwgZS5rZXkgPT09IEtleXMuQXJyb3dSaWdodClcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgZS5rZXkgPT09IEtleXMuQXJyb3dVcCB8fFxuICAgICAgICAgICAgZS5rZXkgPT09IEtleXMuQXJyb3dEb3duIHx8XG4gICAgICAgICAgICBlLmtleSA9PT0gS2V5cy5BcnJvd0xlZnQgfHxcbiAgICAgICAgICAgIGUua2V5ID09PSBLZXlzLkFycm93UmlnaHQgfHxcbiAgICAgICAgICAgIGUua2V5ID09PSBLZXlzLkVuZCB8fFxuICAgICAgICAgICAgZS5rZXkgPT09IEtleXMuSG9tZSB8fFxuICAgICAgICAgICAgZS5rZXkgPT09IEtleXMuUGFnZVVwIHx8XG4gICAgICAgICAgICBlLmtleSA9PT0gS2V5cy5QYWdlRG93blxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY29uc3QgbmV4dENlbGxDb29yZHMgPSB0aGlzLmtleU5hdlV0aWxzLmdldE5leHRJdGVtQ29vcmRpbmF0ZShlKTtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBuZXh0Q2VsbENvb3Jkcy55ID4gMCAmJlxuICAgICAgICAgICAgICAoZS5rZXkgPT09IEtleXMuQXJyb3dVcCB8fCBlLmtleSA9PT0gS2V5cy5BcnJvd0Rvd24gfHwgZS5rZXkgPT09IEtleXMuUGFnZVVwIHx8IGUua2V5ID09PSBLZXlzLlBhZ2VEb3duKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIHRoaXMua2V5TmF2VXRpbHMuc2V0QXJpYVJvd0luZGV4VG8obmV4dENlbGxDb29yZHMpO1xuXG4gICAgICAgICAgICAgIHRoaXMubmV4dENlbGxDb29yZHNFbWl0dGVyLmVtaXQobmV4dENlbGxDb29yZHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBhY3RpdmVJdGVtID0gdGhpcy5rZXlOYXZVdGlscy5yb3dzXG4gICAgICAgICAgICAgID8gKEFycmF5LmZyb20odGhpcy5rZXlOYXZVdGlscy5nZXRDZWxsc0ZvclJvdyhuZXh0Q2VsbENvb3Jkcy55KSlbbmV4dENlbGxDb29yZHMueF0gYXMgSFRNTEVsZW1lbnQpXG4gICAgICAgICAgICAgIDogbnVsbDtcblxuICAgICAgICAgICAgaWYgKGFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDZWxsKGFjdGl2ZUl0ZW0pO1xuICAgICAgICAgICAgICB0aGlzLmZvY3VzRWxlbWVudChhY3RpdmVJdGVtLCB7XG4gICAgICAgICAgICAgICAgcHJldmVudFNjcm9sbDogdGhpcy5wcmV2ZW50U2Nyb2xsT25Gb2N1cyAmJiAhIW5leHRDZWxsQ29vcmRzLmFyaWFSb3dJbmRleCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMubGlzdGVuZXJzQWRkZWQgPSB0cnVlO1xuICB9XG5cbiAgaW5pdGlhbGl6ZUtleUdyaWQoaG9zdDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLmtleU5hdlV0aWxzID0gbmV3IEtleU5hdmlnYXRpb25VdGlscyhob3N0LCB0aGlzLmNvbmZpZyk7XG4gICAgdGhpcy5hZGRMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLnJlc2V0S2V5R3JpZCgpO1xuICB9XG5cbiAgcmVzZXRLZXlHcmlkKCkge1xuICAgIHRoaXMua2V5TmF2VXRpbHMuY2VsbHM/LmZvckVhY2goKGk6IEhUTUxFbGVtZW50KSA9PiBpLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKSk7XG4gICAgY29uc3QgZmlyc3RDZWxsID0gdGhpcy5rZXlOYXZVdGlscy5jZWxscyA/IHRoaXMua2V5TmF2VXRpbHMuY2VsbHNbMF0gOiBudWxsO1xuICAgIGZpcnN0Q2VsbD8uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG4gIH1cblxuICBzZXRBY3RpdmVDZWxsKGFjdGl2ZUNlbGw6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgcHJpb3IgPSB0aGlzLmtleU5hdlV0aWxzLmNlbGxzXG4gICAgICA/IEFycmF5LmZyb20odGhpcy5rZXlOYXZVdGlscy5jZWxscykuZmluZChjID0+IGMuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpID09PSAnMCcpXG4gICAgICA6IG51bGw7XG5cbiAgICBpZiAocHJpb3IpIHtcbiAgICAgIHByaW9yLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICB9XG5cbiAgICBhY3RpdmVDZWxsLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICB9XG5cbiAgZm9jdXNFbGVtZW50KGFjdGl2ZUNlbGw6IEhUTUxFbGVtZW50LCBvcHRpb25zOiBGb2N1c09wdGlvbnMgPSB7IHByZXZlbnRTY3JvbGw6IGZhbHNlIH0pIHtcbiAgICBpZiAodGhpcy5za2lwSXRlbUZvY3VzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGVsZW1lbnRUb0ZvY3VzOiBIVE1MRWxlbWVudDtcblxuICAgIGlmIChhY3RpdmVDZWxsLmdldEF0dHJpYnV0ZSgncm9sZScpID09PSAnY29sdW1uaGVhZGVyJykge1xuICAgICAgZWxlbWVudFRvRm9jdXMgPSBhY3RpdmVDZWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0YWJiYWJsZUVsZW1lbnRzID0gZ2V0VGFiYmFibGVJdGVtcyhhY3RpdmVDZWxsKTtcbiAgICAgIGVsZW1lbnRUb0ZvY3VzID0gdGFiYmFibGVFbGVtZW50cy5sZW5ndGggPyB0YWJiYWJsZUVsZW1lbnRzWzBdIDogYWN0aXZlQ2VsbDtcbiAgICB9XG5cbiAgICBlbGVtZW50VG9Gb2N1cy5mb2N1cyhvcHRpb25zKTtcbiAgfVxufVxuIl19
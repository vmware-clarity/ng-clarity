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
                        this.setActiveCell(activeCell, { keepFocus: isActionableItem(e.target) });
                    }
                }
            });
            fromEvent(this.keyNavUtils.grid, 'wheel')
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                this.removeActiveCell();
            });
            fromEvent(this.keyNavUtils.grid, 'focusout')
                .pipe(debounceTime(0), takeUntil(this.destroy$))
                .subscribe(() => {
                if (this.keyNavUtils.grid.contains(document.activeElement)) {
                    return;
                }
                this.removeActiveCell();
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
                    const activeItem = this.keyNavUtils.rows
                        ? Array.from(this.keyNavUtils.getCellsForRow(nextCellCoords.y))[nextCellCoords.x]
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
        this.keyNavUtils = new KeyNavigationUtils(host, this.config);
        this.addListeners();
        this.resetKeyGrid();
    }
    resetKeyGrid() {
        this.keyNavUtils.cells?.forEach((i) => i.setAttribute('tabindex', '-1'));
        const firstCell = this.keyNavUtils.cells ? this.keyNavUtils.cells[0] : null;
        firstCell?.setAttribute('tabindex', '0');
    }
    removeActiveCell() {
        this._activeCell = null;
    }
    getActiveCell() {
        return this._activeCell;
    }
    setActiveCell(activeCell, { keepFocus } = { keepFocus: false }) {
        const prior = this.keyNavUtils.cells
            ? Array.from(this.keyNavUtils.cells).find(c => c.getAttribute('tabindex') === '0')
            : null;
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
}
KeyNavigationGridController.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: KeyNavigationGridController, deps: [{ token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
KeyNavigationGridController.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: KeyNavigationGridController });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: KeyNavigationGridController, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.NgZone }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5LW5hdmlnYXRpb24tZ3JpZC5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC91dGlscy9rZXktbmF2aWdhdGlvbi1ncmlkLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMxQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXpELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN0RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7QUFFNUQsTUFBTSx1QkFBdUIsR0FBRztJQUM5QixTQUFTO0lBQ1QsWUFBWTtJQUNaLHVCQUF1QjtJQUN2Qix3QkFBd0I7SUFDeEIsd0JBQXdCO0lBQ3hCLDBCQUEwQjtJQUMxQixRQUFRO0lBQ1IsUUFBUTtJQUNSLE9BQU87SUFDUCx3QkFBd0I7SUFDeEIsK0JBQStCO0NBQ2hDLENBQUM7QUFFRixNQUFNLFVBQVUsZ0JBQWdCLENBQUMsRUFBZTtJQUM5QyxNQUFNLHFCQUFxQixHQUFHLENBQUMsR0FBRyx1QkFBdUIsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQzdGLE1BQU0sZ0JBQWdCLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBa0IsQ0FBQztBQUM1RSxDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxFQUFlO0lBQ3ZDLE1BQU0sa0JBQWtCLEdB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QUFDLEtBQUs7WUFDbEMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsQ0FBQztZQUNsRixDQUFDLENBQUMsSUFBSSxDQUFDO1FBRVQsSUFBSSxLQUFLLEVBQUU7WUFDVCxLQUFLLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUN0QztRQUVELFVBQVUsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBRTlCLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3JDLElBQUksY0FBMkIsQ0FBQztZQUVoQyxJQUFJLFVBQVUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssY0FBYyxFQUFFO2dCQUN0RCxjQUFjLEdBQUcsVUFBVSxDQUFDO2FBQzdCO2lCQUFNO2dCQUNMLE1BQU0sZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3RELGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7YUFDN0U7WUFFRCxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDeEI7SUFDSCxDQUFDOzt3SEE5SVUsMkJBQTJCOzRIQUEzQiwyQkFBMkI7MkZBQTNCLDJCQUEyQjtrQkFEdkMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgTmdab25lLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGZyb21FdmVudCwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVib3VuY2VUaW1lLCB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEtleXMgfSBmcm9tICcuLi8uLi8uLi91dGlscy9lbnVtcy9rZXlzLmVudW0nO1xuaW1wb3J0IHsgS2V5TmF2aWdhdGlvblV0aWxzIH0gZnJvbSAnLi9rZXktbmF2aWdhdGlvbi11dGlscyc7XG5cbmNvbnN0IGFjdGlvbmFibGVJdGVtU2VsZWN0b3JzID0gW1xuICAnYVtocmVmXScsXG4gICdhcmVhW2hyZWZdJyxcbiAgJ2lucHV0Om5vdChbZGlzYWJsZWRdKScsXG4gICdidXR0b246bm90KFtkaXNhYmxlZF0pJyxcbiAgJ3NlbGVjdDpub3QoW2Rpc2FibGVkXSknLFxuICAndGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pJyxcbiAgJ2lmcmFtZScsXG4gICdvYmplY3QnLFxuICAnZW1iZWQnLFxuICAnW2NvbnRlbnRlZGl0YWJsZT10cnVlXScsXG4gICdbcm9sZT1idXR0b25dOm5vdChbZGlzYWJsZWRdKScsXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGFiYmFibGVJdGVtcyhlbDogSFRNTEVsZW1lbnQpIHtcbiAgY29uc3QgdGFiYmFibGVJdGVtU2VsZWN0b3JzID0gWy4uLmFjdGlvbmFibGVJdGVtU2VsZWN0b3JzLCAnW3RhYmluZGV4PVwiMFwiXTpub3QoW2Rpc2FibGVkXSknXTtcbiAgY29uc3QgdGFiYmFibGVTZWxlY3RvciA9IHRhYmJhYmxlSXRlbVNlbGVjdG9ycy5qb2luKCcsJyk7XG4gIHJldHVybiBBcnJheS5mcm9tKGVsLnF1ZXJ5U2VsZWN0b3JBbGwodGFiYmFibGVTZWxlY3RvcikpIGFzIEhUTUxFbGVtZW50W107XG59XG5cbmZ1bmN0aW9uIGlzQWN0aW9uYWJsZUl0ZW0oZWw6IEhUTUxFbGVtZW50KSB7XG4gIGNvbnN0IGFjdGlvbmFibGVTZWxlY3RvciA9IGFjdGlvbmFibGVJdGVtU2VsZWN0b3JzLmpvaW4oJywnKTtcbiAgcmV0dXJuIGVsLm1hdGNoZXMoYWN0aW9uYWJsZVNlbGVjdG9yKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLZXlOYXZpZ2F0aW9uR3JpZENvbmZpZyB7XG4gIGtleUdyaWQ6IHN0cmluZztcbiAga2V5R3JpZFJvd3M6IHN0cmluZztcbiAga2V5R3JpZENlbGxzOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2VsbENvb3JkaW5hdGVzIHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBLZXlOYXZpZ2F0aW9uR3JpZENvbnRyb2xsZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBza2lwSXRlbUZvY3VzID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBrZXlOYXZVdGlsczogS2V5TmF2aWdhdGlvblV0aWxzO1xuICBwcml2YXRlIGNvbmZpZzogS2V5TmF2aWdhdGlvbkdyaWRDb25maWc7XG4gIHByaXZhdGUgbGlzdGVuZXJzQWRkZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHByaXZhdGUgX2FjdGl2ZUNlbGw6IEhUTUxFbGVtZW50ID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHpvbmU6IE5nWm9uZSkge1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAga2V5R3JpZFJvd3M6ICdbcm9sZT1yb3ddOm5vdCguZGF0YWdyaWQtcGxhY2Vob2xkZXIpOm5vdChbc3R5bGUqPVwiZGlzcGxheTogbm9uZVwiXSknLFxuICAgICAga2V5R3JpZENlbGxzOlxuICAgICAgICAnW3JvbGU9Z3JpZGNlbGxdOm5vdCguZGF0YWdyaWQtaGlkZGVuLWNvbHVtbik6bm90KC5kYXRhZ3JpZC1wbGFjZWhvbGRlci1jb250ZW50KSwgW3JvbGU9Y29sdW1uaGVhZGVyXTpub3QoLmRhdGFncmlkLWhpZGRlbi1jb2x1bW4pOm5vdCguZGF0YWdyaWQtcGxhY2Vob2xkZXItY29udGVudCksIC5kYXRhZ3JpZC1kZXRhaWwtY2FyZXQnLFxuICAgICAga2V5R3JpZDogJ1tyb2xlPWdyaWRdJyxcbiAgICB9O1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgYWRkTGlzdGVuZXJzKCkge1xuICAgIGlmICh0aGlzLmxpc3RlbmVyc0FkZGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGZyb21FdmVudCh0aGlzLmtleU5hdlV0aWxzLmdyaWQsICdtb3VzZWRvd24nKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAvLyBwcmVzZXJ2ZSByaWdodCBjbGljayBmb3IgY29udGV4dCBtZW51cyAmIGtleWJvYXJkIG1vdXNlIGNvbnRyb2wgaHR0cHM6Ly9hcHBsZS5zdGFja2V4Y2hhbmdlLmNvbS9xdWVzdGlvbnMvMzI3MTUvaG93LWRvLWktb3Blbi10aGUtY29udGV4dC1tZW51LWZyb20tYS1tYWMta2V5Ym9hcmRcbiAgICAgICAgICBpZiAoZS5idXR0b25zID09PSAxICYmICFlLmN0cmxLZXkpIHtcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2ZUNlbGwgPSB0aGlzLmtleU5hdlV0aWxzLmNlbGxzXG4gICAgICAgICAgICAgID8gQXJyYXkuZnJvbSh0aGlzLmtleU5hdlV0aWxzLmNlbGxzKS5maW5kKFxuICAgICAgICAgICAgICAgICAgYyA9PiBjID09PSBlLnRhcmdldCB8fCBjID09PSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QodGhpcy5jb25maWcua2V5R3JpZENlbGxzKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICAgICAgaWYgKGFjdGl2ZUNlbGwpIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDZWxsKGFjdGl2ZUNlbGwsIHsga2VlcEZvY3VzOiBpc0FjdGlvbmFibGVJdGVtKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBmcm9tRXZlbnQodGhpcy5rZXlOYXZVdGlscy5ncmlkLCAnd2hlZWwnKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVtb3ZlQWN0aXZlQ2VsbCgpO1xuICAgICAgICB9KTtcblxuICAgICAgZnJvbUV2ZW50KHRoaXMua2V5TmF2VXRpbHMuZ3JpZCwgJ2ZvY3Vzb3V0JylcbiAgICAgICAgLnBpcGUoZGVib3VuY2VUaW1lKDApLCB0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmtleU5hdlV0aWxzLmdyaWQuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnJlbW92ZUFjdGl2ZUNlbGwoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGZyb21FdmVudCh0aGlzLmtleU5hdlV0aWxzLmdyaWQsICdrZXlkb3duJylcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgICAuc3Vic2NyaWJlKChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgLy8gU2tpcCBjb2x1bW4gcmVzaXplIGV2ZW50c1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuY2xhc3NMaXN0LmNvbnRhaW5zKCdkcmFnLWhhbmRsZScpICYmXG4gICAgICAgICAgICAoZS5rZXkgPT09IEtleXMuQXJyb3dMZWZ0IHx8IGUua2V5ID09PSBLZXlzLkFycm93UmlnaHQpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGUua2V5ID09PSBLZXlzLkFycm93VXAgfHxcbiAgICAgICAgICAgIGUua2V5ID09PSBLZXlzLkFycm93RG93biB8fFxuICAgICAgICAgICAgZS5rZXkgPT09IEtleXMuQXJyb3dMZWZ0IHx8XG4gICAgICAgICAgICBlLmtleSA9PT0gS2V5cy5BcnJvd1JpZ2h0IHx8XG4gICAgICAgICAgICBlLmtleSA9PT0gS2V5cy5FbmQgfHxcbiAgICAgICAgICAgIGUua2V5ID09PSBLZXlzLkhvbWUgfHxcbiAgICAgICAgICAgIGUua2V5ID09PSBLZXlzLlBhZ2VVcCB8fFxuICAgICAgICAgICAgZS5rZXkgPT09IEtleXMuUGFnZURvd25cbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnN0IG5leHRDZWxsQ29vcmRzID0gdGhpcy5rZXlOYXZVdGlscy5nZXROZXh0SXRlbUNvb3JkaW5hdGUoZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFjdGl2ZUl0ZW0gPSB0aGlzLmtleU5hdlV0aWxzLnJvd3NcbiAgICAgICAgICAgICAgPyAoQXJyYXkuZnJvbSh0aGlzLmtleU5hdlV0aWxzLmdldENlbGxzRm9yUm93KG5leHRDZWxsQ29vcmRzLnkpKVtuZXh0Q2VsbENvb3Jkcy54XSBhcyBIVE1MRWxlbWVudClcbiAgICAgICAgICAgICAgOiBudWxsO1xuXG4gICAgICAgICAgICBpZiAoYWN0aXZlSXRlbSkge1xuICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUNlbGwoYWN0aXZlSXRlbSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMubGlzdGVuZXJzQWRkZWQgPSB0cnVlO1xuICB9XG5cbiAgaW5pdGlhbGl6ZUtleUdyaWQoaG9zdDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLmtleU5hdlV0aWxzID0gbmV3IEtleU5hdmlnYXRpb25VdGlscyhob3N0LCB0aGlzLmNvbmZpZyk7XG4gICAgdGhpcy5hZGRMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLnJlc2V0S2V5R3JpZCgpO1xuICB9XG5cbiAgcmVzZXRLZXlHcmlkKCkge1xuICAgIHRoaXMua2V5TmF2VXRpbHMuY2VsbHM/LmZvckVhY2goKGk6IEhUTUxFbGVtZW50KSA9PiBpLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKSk7XG4gICAgY29uc3QgZmlyc3RDZWxsID0gdGhpcy5rZXlOYXZVdGlscy5jZWxscyA/IHRoaXMua2V5TmF2VXRpbHMuY2VsbHNbMF0gOiBudWxsO1xuICAgIGZpcnN0Q2VsbD8uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG4gIH1cblxuICByZW1vdmVBY3RpdmVDZWxsKCkge1xuICAgIHRoaXMuX2FjdGl2ZUNlbGwgPSBudWxsO1xuICB9XG5cbiAgZ2V0QWN0aXZlQ2VsbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlQ2VsbDtcbiAgfVxuXG4gIHNldEFjdGl2ZUNlbGwoYWN0aXZlQ2VsbDogSFRNTEVsZW1lbnQsIHsga2VlcEZvY3VzIH0gPSB7IGtlZXBGb2N1czogZmFsc2UgfSkge1xuICAgIGNvbnN0IHByaW9yID0gdGhpcy5rZXlOYXZVdGlscy5jZWxsc1xuICAgICAgPyBBcnJheS5mcm9tKHRoaXMua2V5TmF2VXRpbHMuY2VsbHMpLmZpbmQoYyA9PiBjLmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKSA9PT0gJzAnKVxuICAgICAgOiBudWxsO1xuXG4gICAgaWYgKHByaW9yKSB7XG4gICAgICBwcmlvci5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgfVxuXG4gICAgYWN0aXZlQ2VsbC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTtcbiAgICB0aGlzLl9hY3RpdmVDZWxsID0gYWN0aXZlQ2VsbDtcblxuICAgIGlmICghdGhpcy5za2lwSXRlbUZvY3VzICYmICFrZWVwRm9jdXMpIHtcbiAgICAgIGxldCBlbGVtZW50VG9Gb2N1czogSFRNTEVsZW1lbnQ7XG5cbiAgICAgIGlmIChhY3RpdmVDZWxsLmdldEF0dHJpYnV0ZSgncm9sZScpID09PSAnY29sdW1uaGVhZGVyJykge1xuICAgICAgICBlbGVtZW50VG9Gb2N1cyA9IGFjdGl2ZUNlbGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0YWJiYWJsZUVsZW1lbnRzID0gZ2V0VGFiYmFibGVJdGVtcyhhY3RpdmVDZWxsKTtcbiAgICAgICAgZWxlbWVudFRvRm9jdXMgPSB0YWJiYWJsZUVsZW1lbnRzLmxlbmd0aCA/IHRhYmJhYmxlRWxlbWVudHNbMF0gOiBhY3RpdmVDZWxsO1xuICAgICAgfVxuXG4gICAgICBlbGVtZW50VG9Gb2N1cy5mb2N1cygpO1xuICAgIH1cbiAgfVxufVxuIl19
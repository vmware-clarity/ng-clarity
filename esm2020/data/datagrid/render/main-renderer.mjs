/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { isPlatformBrowser } from '@angular/common';
import { ContentChildren, Directive, PLATFORM_ID, } from '@angular/core';
import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';
import { DatagridColumnChanges } from '../enums/column-changes.enum';
import { DatagridRenderStep } from '../enums/render-step.enum';
import { DatagridHeaderRenderer } from './header-renderer';
import { NoopDomAdapter } from './noop-dom-adapter';
import { DatagridRowRenderer } from './row-renderer';
import * as i0 from "@angular/core";
import * as i1 from "../datagrid";
import * as i2 from "./render-organizer";
import * as i3 from "../providers/items";
import * as i4 from "../providers/page";
import * as i5 from "../providers/detail.service";
import * as i6 from "../providers/table-size.service";
import * as i7 from "../providers/columns.service";
import * as i8 from "../utils/key-navigation-grid.controller";
// Fixes build error
// @dynamic (https://github.com/angular/angular/issues/19698#issuecomment-338340211)
export const domAdapterFactory = (platformId) => {
    if (isPlatformBrowser(platformId)) {
        return new DomAdapter();
    }
    else {
        return new NoopDomAdapter();
    }
};
// Fixes build error
// @dynamic (https://github.com/angular/angular/issues/19698#issuecomment-338340211)
export class DatagridMainRenderer {
    constructor(datagrid, organizer, items, page, el, renderer, detailService, tableSizeService, columnsService, ngZone, keyNavigation, changeDetectorRef) {
        this.datagrid = datagrid;
        this.organizer = organizer;
        this.items = items;
        this.page = page;
        this.el = el;
        this.renderer = renderer;
        this.tableSizeService = tableSizeService;
        this.columnsService = columnsService;
        this.ngZone = ngZone;
        this.keyNavigation = keyNavigation;
        this.changeDetectorRef = changeDetectorRef;
        this._heightSet = false;
        this.shouldStabilizeColumns = true;
        this.subscriptions = [];
        this.intersectionObserver = null;
        /**
         * Indicates if we want to re-compute columns width. This should only happen:
         * 1) When headers change, with columns being added or removed
         * 2) When rows are lazily loaded for the first time
         */
        this.columnsSizesStable = false;
        this.subscriptions.push(organizer.filterRenderSteps(DatagridRenderStep.COMPUTE_COLUMN_WIDTHS).subscribe(() => this.computeHeadersWidth()));
        this.subscriptions.push(page.sizeChange.subscribe(() => {
            if (this._heightSet) {
                this.resetDatagridHeight();
            }
        }));
        this.subscriptions.push(detailService.stateChange.subscribe(state => this.toggleDetailPane(state)));
        this.subscriptions.push(items.change.subscribe(() => (this.shouldStabilizeColumns = true)));
    }
    ngOnInit() {
        this.columnsService.columnsStateChange.subscribe(change => this.columnStateChanged(change));
        // Datagrid used in other components like Accordion, Tabs or wrapped in onPush component which have their content
        // hidden by default gets initialised without being visible and breakes rendering cycle.
        // Should run only the first time if the datagrid is not visible on first initialization.
        if (this.el.nativeElement.offsetParent === null) {
            this.intersectionObserver = new IntersectionObserver(([entry]) => {
                if ((this.el.nativeElement.offsetParent || entry.isIntersecting) && this.columnsSizesStable) {
                    this.columnsSizesStable = false;
                    this.changeDetectorRef.markForCheck();
                    this.intersectionObserver.disconnect();
                }
            });
            this.intersectionObserver.observe(this.el.nativeElement);
        }
    }
    ngAfterContentInit() {
        this.setupColumns();
        this.subscriptions.push(this.headers.changes.subscribe(() => {
            // TODO: only re-stabilize if a column was added or removed. Reordering is fine.
            // Need to setup columns before stabalizing them
            this.setupColumns();
            this.columnsSizesStable = false;
            this.stabilizeColumns();
        }));
    }
    // Initialize and set Table width for horizontal scrolling here.
    ngAfterViewInit() {
        this.tableSizeService.table = this.el;
    }
    ngAfterViewChecked() {
        if (this.shouldStabilizeColumns) {
            this.stabilizeColumns();
        }
        if (this.shouldComputeHeight()) {
            this.ngZone.runOutsideAngular(() => {
                setTimeout(() => {
                    this.computeDatagridHeight();
                });
            });
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.intersectionObserver?.disconnect();
    }
    toggleDetailPane(state) {
        if (this.headers) {
            if (state && !this.columnsService.hasCache()) {
                this.columnsService.cache();
                this.columnsService.visibleColumns.forEach((header, index) => {
                    if (index > 0) {
                        this.columnsService.emitStateChangeAt(header.columnIndex, {
                            changes: [DatagridColumnChanges.HIDDEN],
                            hidden: state,
                        });
                    }
                });
            }
            else if (!state) {
                this.columnsService.resetToLastCache();
            }
        }
    }
    setupColumns() {
        this.headers.forEach((header, index) => header.setColumnState(index));
        this.columnsService.columns.splice(this.headers.length); // Trim any old columns
        // Sets columnIndex for each column
        this.columnsService.columns.forEach((column, index) => {
            this.columnsService.emitStateChange(column, { changes: [DatagridColumnChanges.INITIALIZE], columnIndex: index });
        });
    }
    shouldComputeHeight() {
        if (!this._heightSet && this.page.size > 0) {
            if (this.items.displayed.length === this.page.size) {
                return true;
            }
        }
        return false;
    }
    /**
     * Computes the height of the datagrid.
     *
     * NOTE: We had to choose to set the height instead of the min-height because
     * IE 11 requires the height on the parent for the children flex grow/shrink properties to work.
     * When we used min-height, 1 1 auto doesn't used to work in IE11 :-(
     * But this doesn't affect the fix. It works in both fixed & variable height datagrids.
     *
     * Refer: http://stackoverflow.com/questions/24396205/flex-grow-not-working-in-internet-explorer-11-0
     */
    computeDatagridHeight() {
        const height = window.getComputedStyle(this.el.nativeElement).height;
        this.renderer.setStyle(this.el.nativeElement, 'height', height);
        this._heightSet = true;
    }
    resetDatagridHeight() {
        this.renderer.setStyle(this.el.nativeElement, 'height', '');
        this._heightSet = false;
    }
    /**
     * Makes each header compute its width.
     */
    computeHeadersWidth() {
        const nbColumns = this.headers.length;
        const headerWidths = this.headers.map(header => {
            return header.getColumnWidthState();
        });
        let allStrict = true;
        this.headers.forEach((header, index) => {
            // On the last header column check whether all columns have strict widths.
            // If all columns have strict widths, remove the strict width from the last column and make it the column's
            // minimum width so that when all previous columns shrink, it will get a flexible width and cover the empty
            // gap in the Datagrid.
            const state = {
                changes: [DatagridColumnChanges.WIDTH],
                ...headerWidths[index],
            };
            if (!state.strictWidth) {
                allStrict = false;
            }
            if (nbColumns === index + 1 && allStrict) {
                state.strictWidth = 0;
            }
            this.columnsService.emitStateChangeAt(index, state);
        });
    }
    columnStateChanged(state) {
        // eslint-disable-next-line eqeqeq
        if (!this.headers || state.columnIndex == null) {
            return;
        }
        const columnIndex = state.columnIndex;
        if (state.changes && state.changes.length) {
            state.changes.forEach(change => {
                switch (change) {
                    case DatagridColumnChanges.WIDTH:
                        this.headers.get(columnIndex).setWidth(state);
                        this.rows.forEach(row => {
                            if (row?.cells.length === this.columnsService.columns.length) {
                                row.cells.get(columnIndex).setWidth(state);
                                row.expandableRows.forEach(expandableRow => {
                                    expandableRow.cells.get(columnIndex)?.setWidth(state);
                                });
                            }
                        });
                        break;
                    case DatagridColumnChanges.HIDDEN:
                        this.headers.get(columnIndex).setHidden(state);
                        this.rows.forEach(row => {
                            if (row.cells && row.cells.length) {
                                row.cells.get(columnIndex).setHidden(state);
                                row.expandableRows.forEach(expandableRow => {
                                    expandableRow.cells.get(columnIndex)?.setHidden(state);
                                });
                            }
                        });
                        this.updateColumnSeparatorsVisibility();
                        this.keyNavigation.resetKeyGrid();
                        break;
                    case DatagridColumnChanges.INITIALIZE:
                        if (state.hideable && state.hidden) {
                            this.headers.get(columnIndex).setHidden(state);
                            this.rows.forEach(row => {
                                row.setCellsState();
                                row.expandableRows.forEach(expandableRow => {
                                    expandableRow.setCellsState();
                                });
                            });
                        }
                        break;
                    default:
                        break;
                }
            });
        }
    }
    /**
     * Triggers a whole re-rendring cycle to set column sizes, if needed.
     */
    stabilizeColumns() {
        if (this.columnsSizesStable) {
            // Nothing to do.
            return;
        }
        // Resize when the rows are loaded.
        if (this.items.displayed.length > 0) {
            this.organizer.resize();
            this.columnsSizesStable = true;
        }
    }
    updateColumnSeparatorsVisibility() {
        const visibleColumns = this.datagrid.columns.filter(column => !column.isHidden);
        visibleColumns.forEach((column, index) => {
            if (index === visibleColumns.length - 1) {
                column.showSeparator = false;
            }
            else if (!column.showSeparator) {
                column.showSeparator = true;
            }
        });
    }
}
DatagridMainRenderer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridMainRenderer, deps: [{ token: i1.ClrDatagrid }, { token: i2.DatagridRenderOrganizer }, { token: i3.Items }, { token: i4.Page }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i5.DetailService }, { token: i6.TableSizeService }, { token: i7.ColumnsService }, { token: i0.NgZone }, { token: i8.KeyNavigationGridController }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
DatagridMainRenderer.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: DatagridMainRenderer, selector: "clr-datagrid", providers: [{ provide: DomAdapter, useFactory: domAdapterFactory, deps: [PLATFORM_ID] }], queries: [{ propertyName: "headers", predicate: DatagridHeaderRenderer }, { propertyName: "rows", predicate: DatagridRowRenderer }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridMainRenderer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-datagrid',
                    providers: [{ provide: DomAdapter, useFactory: domAdapterFactory, deps: [PLATFORM_ID] }],
                }]
        }], ctorParameters: function () { return [{ type: i1.ClrDatagrid }, { type: i2.DatagridRenderOrganizer }, { type: i3.Items }, { type: i4.Page }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i5.DetailService }, { type: i6.TableSizeService }, { type: i7.ColumnsService }, { type: i0.NgZone }, { type: i8.KeyNavigationGridController }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { headers: [{
                type: ContentChildren,
                args: [DatagridHeaderRenderer]
            }], rows: [{
                type: ContentChildren,
                args: [DatagridRowRenderer]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1yZW5kZXJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvcmVuZGVyL21haW4tcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBS0wsZUFBZSxFQUNmLFNBQVMsRUFJVCxXQUFXLEdBR1osTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBRXBFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBUS9ELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQzNELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVwRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7OztBQUVyRCxvQkFBb0I7QUFDcEIsb0ZBQW9GO0FBQ3BGLE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLENBQUMsVUFBZSxFQUFFLEVBQUU7SUFDbkQsSUFBSSxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUNqQyxPQUFPLElBQUksVUFBVSxFQUFFLENBQUM7S0FDekI7U0FBTTtRQUNMLE9BQU8sSUFBSSxjQUFjLEVBQUUsQ0FBQztLQUM3QjtBQUNILENBQUMsQ0FBQztBQUVGLG9CQUFvQjtBQUNwQixvRkFBb0Y7QUFLcEYsTUFBTSxPQUFPLG9CQUFvQjtJQWdCL0IsWUFDVSxRQUFxQixFQUNyQixTQUFrQyxFQUNsQyxLQUFZLEVBQ1osSUFBVSxFQUNWLEVBQTJCLEVBQzNCLFFBQW1CLEVBQzNC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Q3ZDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO2FBQzlCO2lCQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO2dCQUNoQyxNQUFNLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzthQUM3QjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7aUhBeFFVLG9CQUFvQjtxR0FBcEIsb0JBQW9CLHVDQUZwQixDQUFDLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxrREFHdkUsc0JBQXNCLHVDQUN0QixtQkFBbUI7MkZBRnpCLG9CQUFvQjtrQkFKaEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsY0FBYztvQkFDeEIsU0FBUyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO2lCQUN6Rjt1WkFFa0QsT0FBTztzQkFBdkQsZUFBZTt1QkFBQyxzQkFBc0I7Z0JBQ08sSUFBSTtzQkFBakQsZUFBZTt1QkFBQyxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEFmdGVyVmlld0NoZWNrZWQsXG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIFBMQVRGT1JNX0lELFxuICBRdWVyeUxpc3QsXG4gIFJlbmRlcmVyMixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgRG9tQWRhcHRlciB9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2RvbS1hZGFwdGVyL2RvbS1hZGFwdGVyJztcbmltcG9ydCB7IENsckRhdGFncmlkIH0gZnJvbSAnLi4vZGF0YWdyaWQnO1xuaW1wb3J0IHsgRGF0YWdyaWRDb2x1bW5DaGFuZ2VzIH0gZnJvbSAnLi4vZW51bXMvY29sdW1uLWNoYW5nZXMuZW51bSc7XG5pbXBvcnQgeyBEYXRhZ3JpZFJlbmRlclN0ZXAgfSBmcm9tICcuLi9lbnVtcy9yZW5kZXItc3RlcC5lbnVtJztcbmltcG9ydCB7IENvbHVtblN0YXRlLCBDb2x1bW5TdGF0ZURpZmYgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2NvbHVtbi1zdGF0ZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ29sdW1uc1NlcnZpY2UgfSBmcm9tICcuLi9wcm92aWRlcnMvY29sdW1ucy5zZXJ2aWNlJztcbmltcG9ydCB7IERldGFpbFNlcnZpY2UgfSBmcm9tICcuLi9wcm92aWRlcnMvZGV0YWlsLnNlcnZpY2UnO1xuaW1wb3J0IHsgSXRlbXMgfSBmcm9tICcuLi9wcm92aWRlcnMvaXRlbXMnO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gJy4uL3Byb3ZpZGVycy9wYWdlJztcbmltcG9ydCB7IFRhYmxlU2l6ZVNlcnZpY2UgfSBmcm9tICcuLi9wcm92aWRlcnMvdGFibGUtc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7IEtleU5hdmlnYXRpb25HcmlkQ29udHJvbGxlciB9IGZyb20gJy4uL3V0aWxzL2tleS1uYXZpZ2F0aW9uLWdyaWQuY29udHJvbGxlcic7XG5pbXBvcnQgeyBEYXRhZ3JpZEhlYWRlclJlbmRlcmVyIH0gZnJvbSAnLi9oZWFkZXItcmVuZGVyZXInO1xuaW1wb3J0IHsgTm9vcERvbUFkYXB0ZXIgfSBmcm9tICcuL25vb3AtZG9tLWFkYXB0ZXInO1xuaW1wb3J0IHsgRGF0YWdyaWRSZW5kZXJPcmdhbml6ZXIgfSBmcm9tICcuL3JlbmRlci1vcmdhbml6ZXInO1xuaW1wb3J0IHsgRGF0YWdyaWRSb3dSZW5kZXJlciB9IGZyb20gJy4vcm93LXJlbmRlcmVyJztcblxuLy8gRml4ZXMgYnVpbGQgZXJyb3Jcbi8vIEBkeW5hbWljIChodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xOTY5OCNpc3N1ZWNvbW1lbnQtMzM4MzQwMjExKVxuZXhwb3J0IGNvbnN0IGRvbUFkYXB0ZXJGYWN0b3J5ID0gKHBsYXRmb3JtSWQ6IGFueSkgPT4ge1xuICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIocGxhdGZvcm1JZCkpIHtcbiAgICByZXR1cm4gbmV3IERvbUFkYXB0ZXIoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IE5vb3BEb21BZGFwdGVyKCk7XG4gIH1cbn07XG5cbi8vIEZpeGVzIGJ1aWxkIGVycm9yXG4vLyBAZHluYW1pYyAoaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTk2OTgjaXNzdWVjb21tZW50LTMzODM0MDIxMSlcbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2Nsci1kYXRhZ3JpZCcsXG4gIHByb3ZpZGVyczogW3sgcHJvdmlkZTogRG9tQWRhcHRlciwgdXNlRmFjdG9yeTogZG9tQWRhcHRlckZhY3RvcnksIGRlcHM6IFtQTEFURk9STV9JRF0gfV0sXG59KVxuZXhwb3J0IGNsYXNzIERhdGFncmlkTWFpblJlbmRlcmVyIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJWaWV3SW5pdCwgQWZ0ZXJWaWV3Q2hlY2tlZCwgT25EZXN0cm95IHtcbiAgQENvbnRlbnRDaGlsZHJlbihEYXRhZ3JpZEhlYWRlclJlbmRlcmVyKSBwcml2YXRlIGhlYWRlcnM6IFF1ZXJ5TGlzdDxEYXRhZ3JpZEhlYWRlclJlbmRlcmVyPjtcbiAgQENvbnRlbnRDaGlsZHJlbihEYXRhZ3JpZFJvd1JlbmRlcmVyKSBwcml2YXRlIHJvd3M6IFF1ZXJ5TGlzdDxEYXRhZ3JpZFJvd1JlbmRlcmVyPjtcblxuICBwcml2YXRlIF9oZWlnaHRTZXQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBzaG91bGRTdGFiaWxpemVDb2x1bW5zID0gdHJ1ZTtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICBwcml2YXRlIGludGVyc2VjdGlvbk9ic2VydmVyOiBJbnRlcnNlY3Rpb25PYnNlcnZlciA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyBpZiB3ZSB3YW50IHRvIHJlLWNvbXB1dGUgY29sdW1ucyB3aWR0aC4gVGhpcyBzaG91bGQgb25seSBoYXBwZW46XG4gICAqIDEpIFdoZW4gaGVhZGVycyBjaGFuZ2UsIHdpdGggY29sdW1ucyBiZWluZyBhZGRlZCBvciByZW1vdmVkXG4gICAqIDIpIFdoZW4gcm93cyBhcmUgbGF6aWx5IGxvYWRlZCBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICovXG4gIHByaXZhdGUgY29sdW1uc1NpemVzU3RhYmxlID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBkYXRhZ3JpZDogQ2xyRGF0YWdyaWQsXG4gICAgcHJpdmF0ZSBvcmdhbml6ZXI6IERhdGFncmlkUmVuZGVyT3JnYW5pemVyLFxuICAgIHByaXZhdGUgaXRlbXM6IEl0ZW1zLFxuICAgIHByaXZhdGUgcGFnZTogUGFnZSxcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgZGV0YWlsU2VydmljZTogRGV0YWlsU2VydmljZSxcbiAgICBwcml2YXRlIHRhYmxlU2l6ZVNlcnZpY2U6IFRhYmxlU2l6ZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb2x1bW5zU2VydmljZTogQ29sdW1uc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIGtleU5hdmlnYXRpb246IEtleU5hdmlnYXRpb25HcmlkQ29udHJvbGxlcixcbiAgICBwcml2YXRlIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZlxuICApIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIG9yZ2FuaXplci5maWx0ZXJSZW5kZXJTdGVwcyhEYXRhZ3JpZFJlbmRlclN0ZXAuQ09NUFVURV9DT0xVTU5fV0lEVEhTKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jb21wdXRlSGVhZGVyc1dpZHRoKCkpXG4gICAgKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgcGFnZS5zaXplQ2hhbmdlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9oZWlnaHRTZXQpIHtcbiAgICAgICAgICB0aGlzLnJlc2V0RGF0YWdyaWRIZWlnaHQoKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKGRldGFpbFNlcnZpY2Uuc3RhdGVDaGFuZ2Uuc3Vic2NyaWJlKHN0YXRlID0+IHRoaXMudG9nZ2xlRGV0YWlsUGFuZShzdGF0ZSkpKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChpdGVtcy5jaGFuZ2Uuc3Vic2NyaWJlKCgpID0+ICh0aGlzLnNob3VsZFN0YWJpbGl6ZUNvbHVtbnMgPSB0cnVlKSkpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5jb2x1bW5zU2VydmljZS5jb2x1bW5zU3RhdGVDaGFuZ2Uuc3Vic2NyaWJlKGNoYW5nZSA9PiB0aGlzLmNvbHVtblN0YXRlQ2hhbmdlZChjaGFuZ2UpKTtcbiAgICAvLyBEYXRhZ3JpZCB1c2VkIGluIG90aGVyIGNvbXBvbmVudHMgbGlrZSBBY2NvcmRpb24sIFRhYnMgb3Igd3JhcHBlZCBpbiBvblB1c2ggY29tcG9uZW50IHdoaWNoIGhhdmUgdGhlaXIgY29udGVudFxuICAgIC8vIGhpZGRlbiBieSBkZWZhdWx0IGdldHMgaW5pdGlhbGlzZWQgd2l0aG91dCBiZWluZyB2aXNpYmxlIGFuZCBicmVha2VzIHJlbmRlcmluZyBjeWNsZS5cbiAgICAvLyBTaG91bGQgcnVuIG9ubHkgdGhlIGZpcnN0IHRpbWUgaWYgdGhlIGRhdGFncmlkIGlzIG5vdCB2aXNpYmxlIG9uIGZpcnN0IGluaXRpYWxpemF0aW9uLlxuICAgIGlmICh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0UGFyZW50ID09PSBudWxsKSB7XG4gICAgICB0aGlzLmludGVyc2VjdGlvbk9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKChbZW50cnldKSA9PiB7XG4gICAgICAgIGlmICgodGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldFBhcmVudCB8fCBlbnRyeS5pc0ludGVyc2VjdGluZykgJiYgdGhpcy5jb2x1bW5zU2l6ZXNTdGFibGUpIHtcbiAgICAgICAgICB0aGlzLmNvbHVtbnNTaXplc1N0YWJsZSA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgdGhpcy5pbnRlcnNlY3Rpb25PYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5pbnRlcnNlY3Rpb25PYnNlcnZlci5vYnNlcnZlKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuc2V0dXBDb2x1bW5zKCk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHRoaXMuaGVhZGVycy5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIFRPRE86IG9ubHkgcmUtc3RhYmlsaXplIGlmIGEgY29sdW1uIHdhcyBhZGRlZCBvciByZW1vdmVkLiBSZW9yZGVyaW5nIGlzIGZpbmUuXG4gICAgICAgIC8vIE5lZWQgdG8gc2V0dXAgY29sdW1ucyBiZWZvcmUgc3RhYmFsaXppbmcgdGhlbVxuICAgICAgICB0aGlzLnNldHVwQ29sdW1ucygpO1xuICAgICAgICB0aGlzLmNvbHVtbnNTaXplc1N0YWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN0YWJpbGl6ZUNvbHVtbnMoKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemUgYW5kIHNldCBUYWJsZSB3aWR0aCBmb3IgaG9yaXpvbnRhbCBzY3JvbGxpbmcgaGVyZS5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMudGFibGVTaXplU2VydmljZS50YWJsZSA9IHRoaXMuZWw7XG4gIH1cblxuICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgaWYgKHRoaXMuc2hvdWxkU3RhYmlsaXplQ29sdW1ucykge1xuICAgICAgdGhpcy5zdGFiaWxpemVDb2x1bW5zKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2hvdWxkQ29tcHV0ZUhlaWdodCgpKSB7XG4gICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY29tcHV0ZURhdGFncmlkSGVpZ2h0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmZvckVhY2goc3ViID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcbiAgICB0aGlzLmludGVyc2VjdGlvbk9ic2VydmVyPy5kaXNjb25uZWN0KCk7XG4gIH1cblxuICB0b2dnbGVEZXRhaWxQYW5lKHN0YXRlOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuaGVhZGVycykge1xuICAgICAgaWYgKHN0YXRlICYmICF0aGlzLmNvbHVtbnNTZXJ2aWNlLmhhc0NhY2hlKCkpIHtcbiAgICAgICAgdGhpcy5jb2x1bW5zU2VydmljZS5jYWNoZSgpO1xuICAgICAgICB0aGlzLmNvbHVtbnNTZXJ2aWNlLnZpc2libGVDb2x1bW5zLmZvckVhY2goKGhlYWRlciwgaW5kZXgpID0+IHtcbiAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmNvbHVtbnNTZXJ2aWNlLmVtaXRTdGF0ZUNoYW5nZUF0KGhlYWRlci5jb2x1bW5JbmRleCwge1xuICAgICAgICAgICAgICBjaGFuZ2VzOiBbRGF0YWdyaWRDb2x1bW5DaGFuZ2VzLkhJRERFTl0sXG4gICAgICAgICAgICAgIGhpZGRlbjogc3RhdGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICghc3RhdGUpIHtcbiAgICAgICAgdGhpcy5jb2x1bW5zU2VydmljZS5yZXNldFRvTGFzdENhY2hlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXR1cENvbHVtbnMoKSB7XG4gICAgdGhpcy5oZWFkZXJzLmZvckVhY2goKGhlYWRlciwgaW5kZXgpID0+IGhlYWRlci5zZXRDb2x1bW5TdGF0ZShpbmRleCkpO1xuICAgIHRoaXMuY29sdW1uc1NlcnZpY2UuY29sdW1ucy5zcGxpY2UodGhpcy5oZWFkZXJzLmxlbmd0aCk7IC8vIFRyaW0gYW55IG9sZCBjb2x1bW5zXG4gICAgLy8gU2V0cyBjb2x1bW5JbmRleCBmb3IgZWFjaCBjb2x1bW5cbiAgICB0aGlzLmNvbHVtbnNTZXJ2aWNlLmNvbHVtbnMuZm9yRWFjaCgoY29sdW1uLCBpbmRleCkgPT4ge1xuICAgICAgdGhpcy5jb2x1bW5zU2VydmljZS5lbWl0U3RhdGVDaGFuZ2UoY29sdW1uLCB7IGNoYW5nZXM6IFtEYXRhZ3JpZENvbHVtbkNoYW5nZXMuSU5JVElBTElaRV0sIGNvbHVtbkluZGV4OiBpbmRleCB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2hvdWxkQ29tcHV0ZUhlaWdodCgpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuX2hlaWdodFNldCAmJiB0aGlzLnBhZ2Uuc2l6ZSA+IDApIHtcbiAgICAgIGlmICh0aGlzLml0ZW1zLmRpc3BsYXllZC5sZW5ndGggPT09IHRoaXMucGFnZS5zaXplKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQ29tcHV0ZXMgdGhlIGhlaWdodCBvZiB0aGUgZGF0YWdyaWQuXG4gICAqXG4gICAqIE5PVEU6IFdlIGhhZCB0byBjaG9vc2UgdG8gc2V0IHRoZSBoZWlnaHQgaW5zdGVhZCBvZiB0aGUgbWluLWhlaWdodCBiZWNhdXNlXG4gICAqIElFIDExIHJlcXVpcmVzIHRoZSBoZWlnaHQgb24gdGhlIHBhcmVudCBmb3IgdGhlIGNoaWxkcmVuIGZsZXggZ3Jvdy9zaHJpbmsgcHJvcGVydGllcyB0byB3b3JrLlxuICAgKiBXaGVuIHdlIHVzZWQgbWluLWhlaWdodCwgMSAxIGF1dG8gZG9lc24ndCB1c2VkIHRvIHdvcmsgaW4gSUUxMSA6LShcbiAgICogQnV0IHRoaXMgZG9lc24ndCBhZmZlY3QgdGhlIGZpeC4gSXQgd29ya3MgaW4gYm90aCBmaXhlZCAmIHZhcmlhYmxlIGhlaWdodCBkYXRhZ3JpZHMuXG4gICAqXG4gICAqIFJlZmVyOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI0Mzk2MjA1L2ZsZXgtZ3Jvdy1ub3Qtd29ya2luZy1pbi1pbnRlcm5ldC1leHBsb3Jlci0xMS0wXG4gICAqL1xuICBwcml2YXRlIGNvbXB1dGVEYXRhZ3JpZEhlaWdodCgpIHtcbiAgICBjb25zdCBoZWlnaHQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpLmhlaWdodDtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgdGhpcy5faGVpZ2h0U2V0ID0gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzZXREYXRhZ3JpZEhlaWdodCgpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2hlaWdodCcsICcnKTtcbiAgICB0aGlzLl9oZWlnaHRTZXQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBlYWNoIGhlYWRlciBjb21wdXRlIGl0cyB3aWR0aC5cbiAgICovXG4gIHByaXZhdGUgY29tcHV0ZUhlYWRlcnNXaWR0aCgpIHtcbiAgICBjb25zdCBuYkNvbHVtbnM6IG51bWJlciA9IHRoaXMuaGVhZGVycy5sZW5ndGg7XG4gICAgY29uc3QgaGVhZGVyV2lkdGhzID0gdGhpcy5oZWFkZXJzLm1hcChoZWFkZXIgPT4ge1xuICAgICAgcmV0dXJuIGhlYWRlci5nZXRDb2x1bW5XaWR0aFN0YXRlKCk7XG4gICAgfSk7XG4gICAgbGV0IGFsbFN0cmljdCA9IHRydWU7XG4gICAgdGhpcy5oZWFkZXJzLmZvckVhY2goKGhlYWRlciwgaW5kZXgpID0+IHtcbiAgICAgIC8vIE9uIHRoZSBsYXN0IGhlYWRlciBjb2x1bW4gY2hlY2sgd2hldGhlciBhbGwgY29sdW1ucyBoYXZlIHN0cmljdCB3aWR0aHMuXG4gICAgICAvLyBJZiBhbGwgY29sdW1ucyBoYXZlIHN0cmljdCB3aWR0aHMsIHJlbW92ZSB0aGUgc3RyaWN0IHdpZHRoIGZyb20gdGhlIGxhc3QgY29sdW1uIGFuZCBtYWtlIGl0IHRoZSBjb2x1bW4nc1xuICAgICAgLy8gbWluaW11bSB3aWR0aCBzbyB0aGF0IHdoZW4gYWxsIHByZXZpb3VzIGNvbHVtbnMgc2hyaW5rLCBpdCB3aWxsIGdldCBhIGZsZXhpYmxlIHdpZHRoIGFuZCBjb3ZlciB0aGUgZW1wdHlcbiAgICAgIC8vIGdhcCBpbiB0aGUgRGF0YWdyaWQuXG4gICAgICBjb25zdCBzdGF0ZTogQ29sdW1uU3RhdGVEaWZmID0ge1xuICAgICAgICBjaGFuZ2VzOiBbRGF0YWdyaWRDb2x1bW5DaGFuZ2VzLldJRFRIXSxcbiAgICAgICAgLi4uaGVhZGVyV2lkdGhzW2luZGV4XSxcbiAgICAgIH07XG5cbiAgICAgIGlmICghc3RhdGUuc3RyaWN0V2lkdGgpIHtcbiAgICAgICAgYWxsU3RyaWN0ID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmIChuYkNvbHVtbnMgPT09IGluZGV4ICsgMSAmJiBhbGxTdHJpY3QpIHtcbiAgICAgICAgc3RhdGUuc3RyaWN0V2lkdGggPSAwO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbHVtbnNTZXJ2aWNlLmVtaXRTdGF0ZUNoYW5nZUF0KGluZGV4LCBzdGF0ZSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNvbHVtblN0YXRlQ2hhbmdlZChzdGF0ZTogQ29sdW1uU3RhdGUpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG4gICAgaWYgKCF0aGlzLmhlYWRlcnMgfHwgc3RhdGUuY29sdW1uSW5kZXggPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjb2x1bW5JbmRleCA9IHN0YXRlLmNvbHVtbkluZGV4O1xuICAgIGlmIChzdGF0ZS5jaGFuZ2VzICYmIHN0YXRlLmNoYW5nZXMubGVuZ3RoKSB7XG4gICAgICBzdGF0ZS5jaGFuZ2VzLmZvckVhY2goY2hhbmdlID0+IHtcbiAgICAgICAgc3dpdGNoIChjaGFuZ2UpIHtcbiAgICAgICAgICBjYXNlIERhdGFncmlkQ29sdW1uQ2hhbmdlcy5XSURUSDpcbiAgICAgICAgICAgIHRoaXMuaGVhZGVycy5nZXQoY29sdW1uSW5kZXgpLnNldFdpZHRoKHN0YXRlKTtcbiAgICAgICAgICAgIHRoaXMucm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICAgIGlmIChyb3c/LmNlbGxzLmxlbmd0aCA9PT0gdGhpcy5jb2x1bW5zU2VydmljZS5jb2x1bW5zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJvdy5jZWxscy5nZXQoY29sdW1uSW5kZXgpLnNldFdpZHRoKHN0YXRlKTtcbiAgICAgICAgICAgICAgICByb3cuZXhwYW5kYWJsZVJvd3MuZm9yRWFjaChleHBhbmRhYmxlUm93ID0+IHtcbiAgICAgICAgICAgICAgICAgIGV4cGFuZGFibGVSb3cuY2VsbHMuZ2V0KGNvbHVtbkluZGV4KT8uc2V0V2lkdGgoc3RhdGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgRGF0YWdyaWRDb2x1bW5DaGFuZ2VzLkhJRERFTjpcbiAgICAgICAgICAgIHRoaXMuaGVhZGVycy5nZXQoY29sdW1uSW5kZXgpLnNldEhpZGRlbihzdGF0ZSk7XG4gICAgICAgICAgICB0aGlzLnJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICAgICAgICBpZiAocm93LmNlbGxzICYmIHJvdy5jZWxscy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByb3cuY2VsbHMuZ2V0KGNvbHVtbkluZGV4KS5zZXRIaWRkZW4oc3RhdGUpO1xuXG4gICAgICAgICAgICAgICAgcm93LmV4cGFuZGFibGVSb3dzLmZvckVhY2goZXhwYW5kYWJsZVJvdyA9PiB7XG4gICAgICAgICAgICAgICAgICBleHBhbmRhYmxlUm93LmNlbGxzLmdldChjb2x1bW5JbmRleCk/LnNldEhpZGRlbihzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVDb2x1bW5TZXBhcmF0b3JzVmlzaWJpbGl0eSgpO1xuICAgICAgICAgICAgdGhpcy5rZXlOYXZpZ2F0aW9uLnJlc2V0S2V5R3JpZCgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBEYXRhZ3JpZENvbHVtbkNoYW5nZXMuSU5JVElBTElaRTpcbiAgICAgICAgICAgIGlmIChzdGF0ZS5oaWRlYWJsZSAmJiBzdGF0ZS5oaWRkZW4pIHtcbiAgICAgICAgICAgICAgdGhpcy5oZWFkZXJzLmdldChjb2x1bW5JbmRleCkuc2V0SGlkZGVuKHN0YXRlKTtcbiAgICAgICAgICAgICAgdGhpcy5yb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICAgICAgICByb3cuc2V0Q2VsbHNTdGF0ZSgpO1xuICAgICAgICAgICAgICAgIHJvdy5leHBhbmRhYmxlUm93cy5mb3JFYWNoKGV4cGFuZGFibGVSb3cgPT4ge1xuICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZVJvdy5zZXRDZWxsc1N0YXRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJpZ2dlcnMgYSB3aG9sZSByZS1yZW5kcmluZyBjeWNsZSB0byBzZXQgY29sdW1uIHNpemVzLCBpZiBuZWVkZWQuXG4gICAqL1xuICBwcml2YXRlIHN0YWJpbGl6ZUNvbHVtbnMoKSB7XG4gICAgaWYgKHRoaXMuY29sdW1uc1NpemVzU3RhYmxlKSB7XG4gICAgICAvLyBOb3RoaW5nIHRvIGRvLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBSZXNpemUgd2hlbiB0aGUgcm93cyBhcmUgbG9hZGVkLlxuICAgIGlmICh0aGlzLml0ZW1zLmRpc3BsYXllZC5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLm9yZ2FuaXplci5yZXNpemUoKTtcbiAgICAgIHRoaXMuY29sdW1uc1NpemVzU3RhYmxlID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUNvbHVtblNlcGFyYXRvcnNWaXNpYmlsaXR5KCkge1xuICAgIGNvbnN0IHZpc2libGVDb2x1bW5zID0gdGhpcy5kYXRhZ3JpZC5jb2x1bW5zLmZpbHRlcihjb2x1bW4gPT4gIWNvbHVtbi5pc0hpZGRlbik7XG4gICAgdmlzaWJsZUNvbHVtbnMuZm9yRWFjaCgoY29sdW1uLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGluZGV4ID09PSB2aXNpYmxlQ29sdW1ucy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGNvbHVtbi5zaG93U2VwYXJhdG9yID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKCFjb2x1bW4uc2hvd1NlcGFyYXRvcikge1xuICAgICAgICBjb2x1bW4uc2hvd1NlcGFyYXRvciA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==
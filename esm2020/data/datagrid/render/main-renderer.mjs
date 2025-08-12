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
                                row.expandableRow?.cells.get(columnIndex)?.setWidth(state);
                            }
                        });
                        break;
                    case DatagridColumnChanges.HIDDEN:
                        this.headers.get(columnIndex).setHidden(state);
                        this.rows.forEach(row => {
                            if (row.cells && row.cells.length) {
                                row.cells.get(columnIndex).setHidden(state);
                                row.expandableRow?.cells.get(columnIndex)?.setHidden(state);
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
                                row.expandableRow?.setCellsState();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1yZW5kZXJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvcmVuZGVyL21haW4tcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBS0wsZUFBZSxFQUNmLFNBQVMsRUFJVCxXQUFXLEdBR1osTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBRXBFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBUS9ELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQzNELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVwRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7OztBQUVyRCxvQkFBb0I7QUFDcEIsb0ZBQW9GO0FBQ3BGLE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLENBQUMsVUFBZSxFQUFFLEVBQUU7SUFDbkQsSUFBSSxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUNqQyxPQUFPLElBQUksVUFBVSxFQUFFLENBQUM7S0FDekI7U0FBTTtRQUNMLE9BQU8sSUFBSSxjQUFjLEVBQUUsQ0FBQztLQUM3QjtBQUNILENBQUMsQ0FBQztBQUVGLG9CQUFvQjtBQUNwQixvRkFBb0Y7QUFLcEYsTUFBTSxPQUFPLG9CQUFvQjtJQWdCL0IsWUFDVSxRQUFxQixFQUNyQixTQUFrQyxFQUNsQyxLQUFZLEVBQ1osSUFBVSxFQUNWLEVBQTJCLEVBQzNCLFFBQW1CLEVBQzNC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RUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLGtEQUd2RSxzQkFBc0IsdUNBQ3RCLG1CQUFtQjsyRkFGekIsb0JBQW9CO2tCQUpoQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxjQUFjO29CQUN4QixTQUFTLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7aUJBQ3pGO3VaQUVrRCxPQUFPO3NCQUF2RCxlQUFlO3VCQUFDLHNCQUFzQjtnQkFDTyxJQUFJO3NCQUFqRCxlQUFlO3VCQUFDLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgUExBVEZPUk1fSUQsXG4gIFF1ZXJ5TGlzdCxcbiAgUmVuZGVyZXIyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBEb21BZGFwdGVyIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvZG9tLWFkYXB0ZXIvZG9tLWFkYXB0ZXInO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWQgfSBmcm9tICcuLi9kYXRhZ3JpZCc7XG5pbXBvcnQgeyBEYXRhZ3JpZENvbHVtbkNoYW5nZXMgfSBmcm9tICcuLi9lbnVtcy9jb2x1bW4tY2hhbmdlcy5lbnVtJztcbmltcG9ydCB7IERhdGFncmlkUmVuZGVyU3RlcCB9IGZyb20gJy4uL2VudW1zL3JlbmRlci1zdGVwLmVudW0nO1xuaW1wb3J0IHsgQ29sdW1uU3RhdGVEaWZmIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9jb2x1bW4tc3RhdGUuaW50ZXJmYWNlJztcbmltcG9ydCB7IENvbHVtbnNTZXJ2aWNlIH0gZnJvbSAnLi4vcHJvdmlkZXJzL2NvbHVtbnMuc2VydmljZSc7XG5pbXBvcnQgeyBEZXRhaWxTZXJ2aWNlIH0gZnJvbSAnLi4vcHJvdmlkZXJzL2RldGFpbC5zZXJ2aWNlJztcbmltcG9ydCB7IEl0ZW1zIH0gZnJvbSAnLi4vcHJvdmlkZXJzL2l0ZW1zJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICcuLi9wcm92aWRlcnMvcGFnZSc7XG5pbXBvcnQgeyBUYWJsZVNpemVTZXJ2aWNlIH0gZnJvbSAnLi4vcHJvdmlkZXJzL3RhYmxlLXNpemUuc2VydmljZSc7XG5pbXBvcnQgeyBLZXlOYXZpZ2F0aW9uR3JpZENvbnRyb2xsZXIgfSBmcm9tICcuLi91dGlscy9rZXktbmF2aWdhdGlvbi1ncmlkLmNvbnRyb2xsZXInO1xuaW1wb3J0IHsgRGF0YWdyaWRIZWFkZXJSZW5kZXJlciB9IGZyb20gJy4vaGVhZGVyLXJlbmRlcmVyJztcbmltcG9ydCB7IE5vb3BEb21BZGFwdGVyIH0gZnJvbSAnLi9ub29wLWRvbS1hZGFwdGVyJztcbmltcG9ydCB7IERhdGFncmlkUmVuZGVyT3JnYW5pemVyIH0gZnJvbSAnLi9yZW5kZXItb3JnYW5pemVyJztcbmltcG9ydCB7IERhdGFncmlkUm93UmVuZGVyZXIgfSBmcm9tICcuL3Jvdy1yZW5kZXJlcic7XG5cbi8vIEZpeGVzIGJ1aWxkIGVycm9yXG4vLyBAZHluYW1pYyAoaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTk2OTgjaXNzdWVjb21tZW50LTMzODM0MDIxMSlcbmV4cG9ydCBjb25zdCBkb21BZGFwdGVyRmFjdG9yeSA9IChwbGF0Zm9ybUlkOiBhbnkpID0+IHtcbiAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpKSB7XG4gICAgcmV0dXJuIG5ldyBEb21BZGFwdGVyKCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBOb29wRG9tQWRhcHRlcigpO1xuICB9XG59O1xuXG4vLyBGaXhlcyBidWlsZCBlcnJvclxuLy8gQGR5bmFtaWMgKGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzE5Njk4I2lzc3VlY29tbWVudC0zMzgzNDAyMTEpXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdjbHItZGF0YWdyaWQnLFxuICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IERvbUFkYXB0ZXIsIHVzZUZhY3Rvcnk6IGRvbUFkYXB0ZXJGYWN0b3J5LCBkZXBzOiBbUExBVEZPUk1fSURdIH1dLFxufSlcbmV4cG9ydCBjbGFzcyBEYXRhZ3JpZE1haW5SZW5kZXJlciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIEFmdGVyVmlld0luaXQsIEFmdGVyVmlld0NoZWNrZWQsIE9uRGVzdHJveSB7XG4gIEBDb250ZW50Q2hpbGRyZW4oRGF0YWdyaWRIZWFkZXJSZW5kZXJlcikgcHJpdmF0ZSBoZWFkZXJzOiBRdWVyeUxpc3Q8RGF0YWdyaWRIZWFkZXJSZW5kZXJlcj47XG4gIEBDb250ZW50Q2hpbGRyZW4oRGF0YWdyaWRSb3dSZW5kZXJlcikgcHJpdmF0ZSByb3dzOiBRdWVyeUxpc3Q8RGF0YWdyaWRSb3dSZW5kZXJlcj47XG5cbiAgcHJpdmF0ZSBfaGVpZ2h0U2V0ID0gZmFsc2U7XG4gIHByaXZhdGUgc2hvdWxkU3RhYmlsaXplQ29sdW1ucyA9IHRydWU7XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcbiAgcHJpdmF0ZSBpbnRlcnNlY3Rpb25PYnNlcnZlcjogSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgd2Ugd2FudCB0byByZS1jb21wdXRlIGNvbHVtbnMgd2lkdGguIFRoaXMgc2hvdWxkIG9ubHkgaGFwcGVuOlxuICAgKiAxKSBXaGVuIGhlYWRlcnMgY2hhbmdlLCB3aXRoIGNvbHVtbnMgYmVpbmcgYWRkZWQgb3IgcmVtb3ZlZFxuICAgKiAyKSBXaGVuIHJvd3MgYXJlIGxhemlseSBsb2FkZWQgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAqL1xuICBwcml2YXRlIGNvbHVtbnNTaXplc1N0YWJsZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZGF0YWdyaWQ6IENsckRhdGFncmlkLFxuICAgIHByaXZhdGUgb3JnYW5pemVyOiBEYXRhZ3JpZFJlbmRlck9yZ2FuaXplcixcbiAgICBwcml2YXRlIGl0ZW1zOiBJdGVtcyxcbiAgICBwcml2YXRlIHBhZ2U6IFBhZ2UsXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIGRldGFpbFNlcnZpY2U6IERldGFpbFNlcnZpY2UsXG4gICAgcHJpdmF0ZSB0YWJsZVNpemVTZXJ2aWNlOiBUYWJsZVNpemVTZXJ2aWNlLFxuICAgIHByaXZhdGUgY29sdW1uc1NlcnZpY2U6IENvbHVtbnNTZXJ2aWNlLFxuICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSBrZXlOYXZpZ2F0aW9uOiBLZXlOYXZpZ2F0aW9uR3JpZENvbnRyb2xsZXIsXG4gICAgcHJpdmF0ZSBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWZcbiAgKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICBvcmdhbml6ZXIuZmlsdGVyUmVuZGVyU3RlcHMoRGF0YWdyaWRSZW5kZXJTdGVwLkNPTVBVVEVfQ09MVU1OX1dJRFRIUykuc3Vic2NyaWJlKCgpID0+IHRoaXMuY29tcHV0ZUhlYWRlcnNXaWR0aCgpKVxuICAgICk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHBhZ2Uuc2l6ZUNoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5faGVpZ2h0U2V0KSB7XG4gICAgICAgICAgdGhpcy5yZXNldERhdGFncmlkSGVpZ2h0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChkZXRhaWxTZXJ2aWNlLnN0YXRlQ2hhbmdlLnN1YnNjcmliZShzdGF0ZSA9PiB0aGlzLnRvZ2dsZURldGFpbFBhbmUoc3RhdGUpKSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goaXRlbXMuY2hhbmdlLnN1YnNjcmliZSgoKSA9PiAodGhpcy5zaG91bGRTdGFiaWxpemVDb2x1bW5zID0gdHJ1ZSkpKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuY29sdW1uc1NlcnZpY2UuY29sdW1uc1N0YXRlQ2hhbmdlLnN1YnNjcmliZShjaGFuZ2UgPT4gdGhpcy5jb2x1bW5TdGF0ZUNoYW5nZWQoY2hhbmdlKSk7XG4gICAgLy8gRGF0YWdyaWQgdXNlZCBpbiBvdGhlciBjb21wb25lbnRzIGxpa2UgQWNjb3JkaW9uLCBUYWJzIG9yIHdyYXBwZWQgaW4gb25QdXNoIGNvbXBvbmVudCB3aGljaCBoYXZlIHRoZWlyIGNvbnRlbnRcbiAgICAvLyBoaWRkZW4gYnkgZGVmYXVsdCBnZXRzIGluaXRpYWxpc2VkIHdpdGhvdXQgYmVpbmcgdmlzaWJsZSBhbmQgYnJlYWtlcyByZW5kZXJpbmcgY3ljbGUuXG4gICAgLy8gU2hvdWxkIHJ1biBvbmx5IHRoZSBmaXJzdCB0aW1lIGlmIHRoZSBkYXRhZ3JpZCBpcyBub3QgdmlzaWJsZSBvbiBmaXJzdCBpbml0aWFsaXphdGlvbi5cbiAgICBpZiAodGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldFBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5pbnRlcnNlY3Rpb25PYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcigoW2VudHJ5XSkgPT4ge1xuICAgICAgICBpZiAoKHRoaXMuZWwubmF0aXZlRWxlbWVudC5vZmZzZXRQYXJlbnQgfHwgZW50cnkuaXNJbnRlcnNlY3RpbmcpICYmIHRoaXMuY29sdW1uc1NpemVzU3RhYmxlKSB7XG4gICAgICAgICAgdGhpcy5jb2x1bW5zU2l6ZXNTdGFibGUgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICAgIHRoaXMuaW50ZXJzZWN0aW9uT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuaW50ZXJzZWN0aW9uT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLnNldHVwQ29sdW1ucygpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLmhlYWRlcnMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAvLyBUT0RPOiBvbmx5IHJlLXN0YWJpbGl6ZSBpZiBhIGNvbHVtbiB3YXMgYWRkZWQgb3IgcmVtb3ZlZC4gUmVvcmRlcmluZyBpcyBmaW5lLlxuICAgICAgICAvLyBOZWVkIHRvIHNldHVwIGNvbHVtbnMgYmVmb3JlIHN0YWJhbGl6aW5nIHRoZW1cbiAgICAgICAgdGhpcy5zZXR1cENvbHVtbnMoKTtcbiAgICAgICAgdGhpcy5jb2x1bW5zU2l6ZXNTdGFibGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdGFiaWxpemVDb2x1bW5zKCk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICAvLyBJbml0aWFsaXplIGFuZCBzZXQgVGFibGUgd2lkdGggZm9yIGhvcml6b250YWwgc2Nyb2xsaW5nIGhlcmUuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLnRhYmxlU2l6ZVNlcnZpY2UudGFibGUgPSB0aGlzLmVsO1xuICB9XG5cbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgIGlmICh0aGlzLnNob3VsZFN0YWJpbGl6ZUNvbHVtbnMpIHtcbiAgICAgIHRoaXMuc3RhYmlsaXplQ29sdW1ucygpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3VsZENvbXB1dGVIZWlnaHQoKSkge1xuICAgICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNvbXB1dGVEYXRhZ3JpZEhlaWdodCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gICAgdGhpcy5pbnRlcnNlY3Rpb25PYnNlcnZlcj8uZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgdG9nZ2xlRGV0YWlsUGFuZShzdGF0ZTogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLmhlYWRlcnMpIHtcbiAgICAgIGlmIChzdGF0ZSAmJiAhdGhpcy5jb2x1bW5zU2VydmljZS5oYXNDYWNoZSgpKSB7XG4gICAgICAgIHRoaXMuY29sdW1uc1NlcnZpY2UuY2FjaGUoKTtcbiAgICAgICAgdGhpcy5jb2x1bW5zU2VydmljZS52aXNpYmxlQ29sdW1ucy5mb3JFYWNoKChoZWFkZXIsIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5zU2VydmljZS5lbWl0U3RhdGVDaGFuZ2VBdChoZWFkZXIuY29sdW1uSW5kZXgsIHtcbiAgICAgICAgICAgICAgY2hhbmdlczogW0RhdGFncmlkQ29sdW1uQ2hhbmdlcy5ISURERU5dLFxuICAgICAgICAgICAgICBoaWRkZW46IHN0YXRlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoIXN0YXRlKSB7XG4gICAgICAgIHRoaXMuY29sdW1uc1NlcnZpY2UucmVzZXRUb0xhc3RDYWNoZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0dXBDb2x1bW5zKCkge1xuICAgIHRoaXMuaGVhZGVycy5mb3JFYWNoKChoZWFkZXIsIGluZGV4KSA9PiBoZWFkZXIuc2V0Q29sdW1uU3RhdGUoaW5kZXgpKTtcbiAgICB0aGlzLmNvbHVtbnNTZXJ2aWNlLmNvbHVtbnMuc3BsaWNlKHRoaXMuaGVhZGVycy5sZW5ndGgpOyAvLyBUcmltIGFueSBvbGQgY29sdW1uc1xuICAgIC8vIFNldHMgY29sdW1uSW5kZXggZm9yIGVhY2ggY29sdW1uXG4gICAgdGhpcy5jb2x1bW5zU2VydmljZS5jb2x1bW5zLmZvckVhY2goKGNvbHVtbiwgaW5kZXgpID0+IHtcbiAgICAgIHRoaXMuY29sdW1uc1NlcnZpY2UuZW1pdFN0YXRlQ2hhbmdlKGNvbHVtbiwgeyBjaGFuZ2VzOiBbRGF0YWdyaWRDb2x1bW5DaGFuZ2VzLklOSVRJQUxJWkVdLCBjb2x1bW5JbmRleDogaW5kZXggfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNob3VsZENvbXB1dGVIZWlnaHQoKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLl9oZWlnaHRTZXQgJiYgdGhpcy5wYWdlLnNpemUgPiAwKSB7XG4gICAgICBpZiAodGhpcy5pdGVtcy5kaXNwbGF5ZWQubGVuZ3RoID09PSB0aGlzLnBhZ2Uuc2l6ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXB1dGVzIHRoZSBoZWlnaHQgb2YgdGhlIGRhdGFncmlkLlxuICAgKlxuICAgKiBOT1RFOiBXZSBoYWQgdG8gY2hvb3NlIHRvIHNldCB0aGUgaGVpZ2h0IGluc3RlYWQgb2YgdGhlIG1pbi1oZWlnaHQgYmVjYXVzZVxuICAgKiBJRSAxMSByZXF1aXJlcyB0aGUgaGVpZ2h0IG9uIHRoZSBwYXJlbnQgZm9yIHRoZSBjaGlsZHJlbiBmbGV4IGdyb3cvc2hyaW5rIHByb3BlcnRpZXMgdG8gd29yay5cbiAgICogV2hlbiB3ZSB1c2VkIG1pbi1oZWlnaHQsIDEgMSBhdXRvIGRvZXNuJ3QgdXNlZCB0byB3b3JrIGluIElFMTEgOi0oXG4gICAqIEJ1dCB0aGlzIGRvZXNuJ3QgYWZmZWN0IHRoZSBmaXguIEl0IHdvcmtzIGluIGJvdGggZml4ZWQgJiB2YXJpYWJsZSBoZWlnaHQgZGF0YWdyaWRzLlxuICAgKlxuICAgKiBSZWZlcjogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNDM5NjIwNS9mbGV4LWdyb3ctbm90LXdvcmtpbmctaW4taW50ZXJuZXQtZXhwbG9yZXItMTEtMFxuICAgKi9cbiAgcHJpdmF0ZSBjb21wdXRlRGF0YWdyaWRIZWlnaHQoKSB7XG4gICAgY29uc3QgaGVpZ2h0ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50KS5oZWlnaHQ7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgIHRoaXMuX2hlaWdodFNldCA9IHRydWU7XG4gIH1cblxuICBwcml2YXRlIHJlc2V0RGF0YWdyaWRIZWlnaHQoKSB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdoZWlnaHQnLCAnJyk7XG4gICAgdGhpcy5faGVpZ2h0U2V0ID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgZWFjaCBoZWFkZXIgY29tcHV0ZSBpdHMgd2lkdGguXG4gICAqL1xuICBwcml2YXRlIGNvbXB1dGVIZWFkZXJzV2lkdGgoKSB7XG4gICAgY29uc3QgbmJDb2x1bW5zOiBudW1iZXIgPSB0aGlzLmhlYWRlcnMubGVuZ3RoO1xuICAgIGNvbnN0IGhlYWRlcldpZHRocyA9IHRoaXMuaGVhZGVycy5tYXAoaGVhZGVyID0+IHtcbiAgICAgIHJldHVybiBoZWFkZXIuZ2V0Q29sdW1uV2lkdGhTdGF0ZSgpO1xuICAgIH0pO1xuICAgIGxldCBhbGxTdHJpY3QgPSB0cnVlO1xuICAgIHRoaXMuaGVhZGVycy5mb3JFYWNoKChoZWFkZXIsIGluZGV4KSA9PiB7XG4gICAgICAvLyBPbiB0aGUgbGFzdCBoZWFkZXIgY29sdW1uIGNoZWNrIHdoZXRoZXIgYWxsIGNvbHVtbnMgaGF2ZSBzdHJpY3Qgd2lkdGhzLlxuICAgICAgLy8gSWYgYWxsIGNvbHVtbnMgaGF2ZSBzdHJpY3Qgd2lkdGhzLCByZW1vdmUgdGhlIHN0cmljdCB3aWR0aCBmcm9tIHRoZSBsYXN0IGNvbHVtbiBhbmQgbWFrZSBpdCB0aGUgY29sdW1uJ3NcbiAgICAgIC8vIG1pbmltdW0gd2lkdGggc28gdGhhdCB3aGVuIGFsbCBwcmV2aW91cyBjb2x1bW5zIHNocmluaywgaXQgd2lsbCBnZXQgYSBmbGV4aWJsZSB3aWR0aCBhbmQgY292ZXIgdGhlIGVtcHR5XG4gICAgICAvLyBnYXAgaW4gdGhlIERhdGFncmlkLlxuICAgICAgY29uc3Qgc3RhdGU6IENvbHVtblN0YXRlRGlmZiA9IHtcbiAgICAgICAgY2hhbmdlczogW0RhdGFncmlkQ29sdW1uQ2hhbmdlcy5XSURUSF0sXG4gICAgICAgIC4uLmhlYWRlcldpZHRoc1tpbmRleF0sXG4gICAgICB9O1xuXG4gICAgICBpZiAoIXN0YXRlLnN0cmljdFdpZHRoKSB7XG4gICAgICAgIGFsbFN0cmljdCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAobmJDb2x1bW5zID09PSBpbmRleCArIDEgJiYgYWxsU3RyaWN0KSB7XG4gICAgICAgIHN0YXRlLnN0cmljdFdpZHRoID0gMDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb2x1bW5zU2VydmljZS5lbWl0U3RhdGVDaGFuZ2VBdChpbmRleCwgc3RhdGUpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjb2x1bW5TdGF0ZUNoYW5nZWQoc3RhdGUpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG4gICAgaWYgKCF0aGlzLmhlYWRlcnMgfHwgc3RhdGUuY29sdW1uSW5kZXggPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjb2x1bW5JbmRleCA9IHN0YXRlLmNvbHVtbkluZGV4O1xuICAgIGlmIChzdGF0ZS5jaGFuZ2VzICYmIHN0YXRlLmNoYW5nZXMubGVuZ3RoKSB7XG4gICAgICBzdGF0ZS5jaGFuZ2VzLmZvckVhY2goY2hhbmdlID0+IHtcbiAgICAgICAgc3dpdGNoIChjaGFuZ2UpIHtcbiAgICAgICAgICBjYXNlIERhdGFncmlkQ29sdW1uQ2hhbmdlcy5XSURUSDpcbiAgICAgICAgICAgIHRoaXMuaGVhZGVycy5nZXQoY29sdW1uSW5kZXgpLnNldFdpZHRoKHN0YXRlKTtcbiAgICAgICAgICAgIHRoaXMucm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICAgIGlmIChyb3c/LmNlbGxzLmxlbmd0aCA9PT0gdGhpcy5jb2x1bW5zU2VydmljZS5jb2x1bW5zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJvdy5jZWxscy5nZXQoY29sdW1uSW5kZXgpLnNldFdpZHRoKHN0YXRlKTtcbiAgICAgICAgICAgICAgICByb3cuZXhwYW5kYWJsZVJvdz8uY2VsbHMuZ2V0KGNvbHVtbkluZGV4KT8uc2V0V2lkdGgoc3RhdGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgRGF0YWdyaWRDb2x1bW5DaGFuZ2VzLkhJRERFTjpcbiAgICAgICAgICAgIHRoaXMuaGVhZGVycy5nZXQoY29sdW1uSW5kZXgpLnNldEhpZGRlbihzdGF0ZSk7XG4gICAgICAgICAgICB0aGlzLnJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICAgICAgICBpZiAocm93LmNlbGxzICYmIHJvdy5jZWxscy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByb3cuY2VsbHMuZ2V0KGNvbHVtbkluZGV4KS5zZXRIaWRkZW4oc3RhdGUpO1xuICAgICAgICAgICAgICAgIHJvdy5leHBhbmRhYmxlUm93Py5jZWxscy5nZXQoY29sdW1uSW5kZXgpPy5zZXRIaWRkZW4oc3RhdGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ29sdW1uU2VwYXJhdG9yc1Zpc2liaWxpdHkoKTtcbiAgICAgICAgICAgIHRoaXMua2V5TmF2aWdhdGlvbi5yZXNldEtleUdyaWQoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgRGF0YWdyaWRDb2x1bW5DaGFuZ2VzLklOSVRJQUxJWkU6XG4gICAgICAgICAgICBpZiAoc3RhdGUuaGlkZWFibGUgJiYgc3RhdGUuaGlkZGVuKSB7XG4gICAgICAgICAgICAgIHRoaXMuaGVhZGVycy5nZXQoY29sdW1uSW5kZXgpLnNldEhpZGRlbihzdGF0ZSk7XG4gICAgICAgICAgICAgIHRoaXMucm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICAgICAgcm93LnNldENlbGxzU3RhdGUoKTtcbiAgICAgICAgICAgICAgICByb3cuZXhwYW5kYWJsZVJvdz8uc2V0Q2VsbHNTdGF0ZSgpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyaWdnZXJzIGEgd2hvbGUgcmUtcmVuZHJpbmcgY3ljbGUgdG8gc2V0IGNvbHVtbiBzaXplcywgaWYgbmVlZGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBzdGFiaWxpemVDb2x1bW5zKCkge1xuICAgIGlmICh0aGlzLmNvbHVtbnNTaXplc1N0YWJsZSkge1xuICAgICAgLy8gTm90aGluZyB0byBkby5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gUmVzaXplIHdoZW4gdGhlIHJvd3MgYXJlIGxvYWRlZC5cbiAgICBpZiAodGhpcy5pdGVtcy5kaXNwbGF5ZWQubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5vcmdhbml6ZXIucmVzaXplKCk7XG4gICAgICB0aGlzLmNvbHVtbnNTaXplc1N0YWJsZSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVDb2x1bW5TZXBhcmF0b3JzVmlzaWJpbGl0eSgpIHtcbiAgICBjb25zdCB2aXNpYmxlQ29sdW1ucyA9IHRoaXMuZGF0YWdyaWQuY29sdW1ucy5maWx0ZXIoY29sdW1uID0+ICFjb2x1bW4uaXNIaWRkZW4pO1xuICAgIHZpc2libGVDb2x1bW5zLmZvckVhY2goKGNvbHVtbiwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChpbmRleCA9PT0gdmlzaWJsZUNvbHVtbnMubGVuZ3RoIC0gMSkge1xuICAgICAgICBjb2x1bW4uc2hvd1NlcGFyYXRvciA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmICghY29sdW1uLnNob3dTZXBhcmF0b3IpIHtcbiAgICAgICAgY29sdW1uLnNob3dTZXBhcmF0b3IgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=
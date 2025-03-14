import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, ElementRef, NgZone, OnDestroy, Renderer2 } from '@angular/core';
import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';
import { ClrDatagrid } from '../datagrid';
import { ColumnsService } from '../providers/columns.service';
import { DetailService } from '../providers/detail.service';
import { Items } from '../providers/items';
import { Page } from '../providers/page';
import { TableSizeService } from '../providers/table-size.service';
import { KeyNavigationGridController } from '../utils/key-navigation-grid.controller';
import { NoopDomAdapter } from './noop-dom-adapter';
import { DatagridRenderOrganizer } from './render-organizer';
import * as i0 from "@angular/core";
export declare const domAdapterFactory: (platformId: any) => DomAdapter | NoopDomAdapter;
export declare class DatagridMainRenderer implements AfterContentInit, AfterViewInit, AfterViewChecked, OnDestroy {
    private datagrid;
    private organizer;
    private items;
    private page;
    private el;
    private renderer;
    private tableSizeService;
    private columnsService;
    private ngZone;
    private keyNavigation;
    private changeDetectorRef;
    private headers;
    private rows;
    private _heightSet;
    private shouldStabilizeColumns;
    private subscriptions;
    private intersectionObserver;
    /**
     * Indicates if we want to re-compute columns width. This should only happen:
     * 1) When headers change, with columns being added or removed
     * 2) When rows are lazily loaded for the first time
     */
    private columnsSizesStable;
    constructor(datagrid: ClrDatagrid, organizer: DatagridRenderOrganizer, items: Items, page: Page, el: ElementRef<HTMLElement>, renderer: Renderer2, detailService: DetailService, tableSizeService: TableSizeService, columnsService: ColumnsService, ngZone: NgZone, keyNavigation: KeyNavigationGridController, changeDetectorRef: ChangeDetectorRef);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    toggleDetailPane(state: boolean): void;
    private setupColumns;
    private shouldComputeHeight;
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
    private computeDatagridHeight;
    private resetDatagridHeight;
    /**
     * Makes each header compute its width.
     */
    private computeHeadersWidth;
    private columnStateChanged;
    /**
     * Triggers a whole re-rendring cycle to set column sizes, if needed.
     */
    private stabilizeColumns;
    private updateColumnSeparatorsVisibility;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridMainRenderer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridMainRenderer, "clr-datagrid", never, {}, {}, ["headers", "rows"], never, false, never>;
}

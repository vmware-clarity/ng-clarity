import { ElementRef, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrDatagridPageSize } from './datagrid-page-size';
import { DetailService } from './providers/detail.service';
import { Page } from './providers/page';
import * as i0 from "@angular/core";
export declare class ClrDatagridPagination implements OnDestroy, OnInit {
    page: Page;
    commonStrings: ClrCommonStringsService;
    detailService: DetailService;
    disableCurrentPageInput: boolean;
    currentChanged: EventEmitter<number>;
    _pageSizeComponent: ClrDatagridPageSize;
    currentPageInputRef: ElementRef<HTMLInputElement>;
    /**
     * Subscription to the page service changes
     */
    private _pageSubscription;
    constructor(page: Page, commonStrings: ClrCommonStringsService, detailService: DetailService);
    /**
     * Page size
     */
    get pageSize(): number;
    set pageSize(size: number);
    /**
     * Total items (needed to guess the last page)
     */
    get totalItems(): number;
    set totalItems(total: number);
    /**
     * Last page
     */
    get lastPage(): number;
    set lastPage(last: number);
    /**
     * Current page
     */
    get currentPage(): number;
    set currentPage(page: number);
    /**
     * Index of the first item displayed on the current page, starting at 0, -1 if none displayed
     */
    get firstItem(): number;
    /**
     * Index of the last item displayed on the current page, starting at 0, -1 if none displayed
     */
    get lastItem(): number;
    /**
     * Conditionally adds page numbers before and after the current page
     */
    get middlePages(): number[];
    /**********
     * Subscription to the Page service for page changes.
     * Note: this only emits after the datagrid is initialized/stabalized and the page changes.
     */
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * Moves to the previous page if it exists
     */
    previous(): void;
    /**
     * Moves to the next page if it exists
     */
    next(): void;
    verifyCurrentPage(event: any): void;
    /**
     * We only update the pagination's current page on enter.
     */
    updateCurrentPage(event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridPagination, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridPagination, "clr-dg-pagination", never, { "disableCurrentPageInput": "clrDgPageInputDisabled"; "pageSize": "clrDgPageSize"; "totalItems": "clrDgTotalItems"; "lastPage": "clrDgLastPage"; "currentPage": "clrDgPage"; }, { "currentChanged": "clrDgPageChange"; }, ["_pageSizeComponent"], ["clr-dg-page-size", "*"], false, never>;
}

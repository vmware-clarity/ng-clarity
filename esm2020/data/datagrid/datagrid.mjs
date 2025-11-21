/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { DOCUMENT } from '@angular/common';
import { Component, ContentChild, ContentChildren, ElementRef, EventEmitter, Inject, Input, Output, ViewChild, ViewChildren, ViewContainerRef, } from '@angular/core';
import { combineLatest, fromEvent, merge, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrDatagridColumn } from './datagrid-column';
import { ClrDatagridItems } from './datagrid-items';
import { ClrDatagridPlaceholder } from './datagrid-placeholder';
import { ClrDatagridRow } from './datagrid-row';
import { ClrDatagridVirtualScrollDirective } from './datagrid-virtual-scroll.directive';
import { DatagridDisplayMode } from './enums/display-mode.enum';
import { SelectionType } from './enums/selection-type';
import { ColumnsService } from './providers/columns.service';
import { DetailService } from './providers/detail.service';
import { DisplayModeService } from './providers/display-mode.service';
import { FiltersProvider } from './providers/filters';
import { ExpandableRowsCount } from './providers/global-expandable-rows';
import { Items } from './providers/items';
import { Page } from './providers/page';
import { RowActionService } from './providers/row-action-service';
import { Selection } from './providers/selection';
import { Sort } from './providers/sort';
import { StateDebouncer } from './providers/state-debouncer.provider';
import { StateProvider } from './providers/state.provider';
import { TableSizeService } from './providers/table-size.service';
import { DatagridRenderOrganizer } from './render/render-organizer';
import { KeyNavigationGridController } from './utils/key-navigation-grid.controller';
import * as i0 from "@angular/core";
import * as i1 from "./render/render-organizer";
import * as i2 from "./providers/items";
import * as i3 from "./providers/global-expandable-rows";
import * as i4 from "./providers/selection";
import * as i5 from "./providers/row-action-service";
import * as i6 from "./providers/state.provider";
import * as i7 from "./providers/display-mode.service";
import * as i8 from "./providers/detail.service";
import * as i9 from "./providers/page";
import * as i10 from "../../utils/i18n/common-strings.service";
import * as i11 from "./utils/key-navigation-grid.controller";
import * as i12 from "@angular/common";
import * as i13 from "../../forms/common/label";
import * as i14 from "@angular/forms";
import * as i15 from "../../progress/spinner/spinner";
import * as i16 from "./datagrid-cell";
import * as i17 from "./datagrid-placeholder";
import * as i18 from "./datagrid-row";
import * as i19 from "./datagrid-selection-cell.directive";
import * as i20 from "./render/cell-renderer";
import * as i21 from "./render/row-renderer";
import * as i22 from "./chocolate/actionable-oompa-loompa";
import * as i23 from "./chocolate/expandable-oompa-loompa";
export class ClrDatagrid {
    constructor(organizer, items, expandableRows, selection, rowActionService, stateProvider, displayMode, renderer, detailService, document, el, page, commonStrings, keyNavigation, zone) {
        this.organizer = organizer;
        this.items = items;
        this.expandableRows = expandableRows;
        this.selection = selection;
        this.rowActionService = rowActionService;
        this.stateProvider = stateProvider;
        this.displayMode = displayMode;
        this.renderer = renderer;
        this.detailService = detailService;
        this.document = document;
        this.el = el;
        this.page = page;
        this.commonStrings = commonStrings;
        this.keyNavigation = keyNavigation;
        this.zone = zone;
        this.clrDgSingleSelectionAriaLabel = this.commonStrings.keys.singleSelectionAriaLabel;
        this.clrDgSingleActionableAriaLabel = this.commonStrings.keys.singleActionableAriaLabel;
        this.clrDetailExpandableAriaLabel = this.commonStrings.keys.detailExpandableAriaLabel;
        // Allows disabling of the auto focus on page/state changes (excludes focus management inside of popups)
        this.clrDgDisablePageFocus = false;
        this.selectedChanged = new EventEmitter(false);
        this.singleSelectedChanged = new EventEmitter(false);
        /**
         * Output emitted whenever the data needs to be refreshed, based on user action or external ones
         */
        this.refresh = new EventEmitter(false);
        /**
         * The application can provide custom select all logic.
         */
        this.customSelectAllEnabled = false;
        this.customSelectAll = new EventEmitter();
        /* reference to the enum so that template can access */
        this.SELECTION_TYPE = SelectionType;
        /**
         * Subscriptions to all the services and queries changes
         */
        this._subscriptions = [];
        this._virtualScrollSubscriptions = [];
        this.cachedRowsHeight = 0;
        this.cachedContentHeight = 0;
        this.resizeObserver = new ResizeObserver(entries => {
            requestAnimationFrame(() => {
                this.handleResizeChanges(entries);
            });
        });
        const datagridId = uniqueIdFactory();
        this.selectAllId = 'clr-dg-select-all-' + datagridId;
        detailService.id = datagridId;
    }
    /**
     * Freezes the datagrid while data is loading
     */
    get loading() {
        return this.items.loading;
    }
    set loading(value) {
        this.items.loading = value;
    }
    /**
     * Array of all selected items
     */
    set selected(value) {
        if (value) {
            this.selection.selectionType = SelectionType.Multi;
        }
        else {
            this.selection.selectionType = SelectionType.None;
        }
        this.selection.updateCurrent(value, false);
    }
    /**
     * Selected item in single-select mode
     */
    set singleSelected(value) {
        this.selection.selectionType = SelectionType.Single;
        // the clrDgSingleSelected is updated in one of two cases:
        // 1. an explicit value is passed
        // 2. is being set to null or undefined, where previously it had a value
        if (value) {
            this.selection.currentSingle = value;
        }
        else if (this.selection.currentSingle) {
            this.selection.currentSingle = null;
        }
    }
    set clrDgPreserveSelection(state) {
        this.selection.preserveSelection = state;
    }
    /**
     * @deprecated since 2.0, remove in 3.0
     *
     * Selection/Deselection on row click mode
     */
    set rowSelectionMode(value) {
        this.selection.rowSelectionMode = value;
    }
    set trackBy(value) {
        this.items.trackBy = value;
    }
    /**
     * Indicates if all currently displayed items are selected
     */
    get allSelected() {
        return this.selection.isAllSelected();
    }
    set allSelected(value) {
        if (this.customSelectAllEnabled) {
            this.customSelectAll.emit(value);
        }
        else {
            /**
             * This is a setter but we ignore the value.
             * It's strange, but it lets us have an indeterminate state where only
             * some of the items are selected.
             */
            this.selection.toggleAll();
        }
    }
    get virtualScroll() {
        return this._virtualScroll?.get(0);
    }
    ngAfterContentInit() {
        if (!this.items.smart) {
            this.items.all = this.rows.map((row) => row.item);
        }
        const rowItemsChanges = this.rows.changes.pipe(switchMap((rows) => merge(
        // immediate update
        of(rows.map(row => row.item)), 
        // subsequent updates once per tick
        combineLatest(rows.map(row => row.itemChanges)).pipe(debounceTime(0)))));
        this._subscriptions.push(rowItemsChanges.subscribe(all => {
            if (!this.items.smart) {
                this.items.all = all;
            }
        }), this._virtualScroll.changes.subscribe(() => {
            this.toggleVirtualScrollSubscriptions();
        }), this.rows.changes.subscribe(() => {
            // Remove any projected rows from the displayedRows container
            // Necessary with Ivy off. See https://github.com/vmware/clarity/issues/4692
            for (let i = this._displayedRows.length - 1; i >= 0; i--) {
                if (this._displayedRows.get(i).destroyed) {
                    this._displayedRows.remove(i);
                }
            }
            this.rows.forEach(row => {
                this._displayedRows.insert(row._view);
            });
            this.updateDetailState();
            // retain active cell when navigating with Up/Down Arrows, PageUp and PageDown buttons in virtual scroller
            if (this.virtualScroll && this.activeCellCoords) {
                this.zone.runOutsideAngular(() => {
                    const row = Array.from(this.rows).find(row => {
                        return row.el.nativeElement.children[0].ariaRowIndex === this.activeCellCoords.ariaRowIndex;
                    });
                    if (!row) {
                        return;
                    }
                    const activeCell = row.el.nativeElement.querySelectorAll(this.keyNavigation.config.keyGridCells)[this.activeCellCoords.x];
                    this.keyNavigation.setActiveCell(activeCell);
                    this.keyNavigation.focusElement(activeCell, { preventScroll: true });
                });
            }
        }));
    }
    /**
     * Our setup happens in the view of some of our components, so we wait for it to be done before starting
     */
    ngAfterViewInit() {
        this.keyNavigation.initializeKeyGrid(this.el.nativeElement);
        this.updateDetailState();
        // TODO: determine if we can get rid of provider wiring in view init so that subscriptions can be done earlier
        this.refresh.emit(this.stateProvider.state);
        this._subscriptions.push(this.stickyHeaders.changes.subscribe(() => this.resize()), this.stateProvider.change.subscribe(state => this.refresh.emit(state)), this.selection.change.subscribe(s => {
            if (this.selection.selectionType === SelectionType.Single) {
                this.singleSelectedChanged.emit(s);
            }
            else if (this.selection.selectionType === SelectionType.Multi) {
                this.selectedChanged.emit(s);
            }
        }), 
        // Reinitialize arrow key navigation on page changes
        this.page.change.subscribe(() => {
            this.keyNavigation.resetKeyGrid();
            if (!this.clrDgDisablePageFocus) {
                this.datagridTable.nativeElement.focus();
            }
        }), 
        // A subscription that listens for displayMode changes on the datagrid
        this.displayMode.view.subscribe(viewChange => {
            // Remove any projected columns from the projectedDisplayColumns container
            for (let i = this._projectedDisplayColumns.length; i > 0; i--) {
                this._projectedDisplayColumns.detach();
            }
            // Remove any projected columns from the projectedCalculationColumns container
            for (let i = this._projectedCalculationColumns.length; i > 0; i--) {
                this._projectedCalculationColumns.detach();
            }
            // Remove any projected rows from the calculationRows container
            for (let i = this._calculationRows.length; i > 0; i--) {
                this._calculationRows.detach();
            }
            // Remove any projected rows from the displayedRows container
            for (let i = this._displayedRows.length; i > 0; i--) {
                this._displayedRows.detach();
            }
            if (viewChange === DatagridDisplayMode.DISPLAY) {
                // Set state, style for the datagrid to DISPLAY and insert row & columns into containers
                this.renderer.removeClass(this.el.nativeElement, 'datagrid-calculate-mode');
                this.columns.forEach(column => {
                    this._projectedDisplayColumns.insert(column._view);
                });
                this.rows.forEach(row => {
                    this._displayedRows.insert(row._view);
                });
            }
            else {
                // Set state, style for the datagrid to CALCULATE and insert row & columns into containers
                this.renderer.addClass(this.el.nativeElement, 'datagrid-calculate-mode');
                // Inserts a fixed column if any of these conditions are true.
                const fixedColumnConditions = [
                    this.rowActionService.hasActionableRow,
                    this.selection.selectionType !== this.SELECTION_TYPE.None,
                    this.expandableRows.hasExpandableRow || this.detailService.enabled,
                ];
                fixedColumnConditions
                    .filter(Boolean)
                    .forEach(() => this._projectedCalculationColumns.insert(this._fixedColumnTemplate.createEmbeddedView(null)));
                this.columns.forEach(column => {
                    this._projectedCalculationColumns.insert(column._view);
                });
                this.rows.forEach(row => {
                    this._calculationRows.insert(row._view);
                });
            }
        }));
        if (this.virtualScroll) {
            this.toggleVirtualScrollSubscriptions();
        }
        // We need to preserve shift state, so it can be used on selection change, regardless of the input event
        // that triggered the change. This helps us to easily resolve the k/b only case together with the mouse selection case.
        this.zone.runOutsideAngular(() => {
            this._subscriptions.push(fromEvent(this.document.body, 'keydown').subscribe((event) => {
                if (event.key === 'Shift') {
                    this.selection.shiftPressed = true;
                }
            }), fromEvent(this.document.body, 'keyup').subscribe((event) => {
                if (event.key === 'Shift') {
                    this.selection.shiftPressed = false;
                }
            }));
        });
    }
    ngDoCheck() {
        // we track for changes on selection.current because it can happen with pushing items
        // instead of overriding the variable
        this.selection.checkForChanges();
    }
    ngOnDestroy() {
        this._subscriptions.forEach((sub) => sub.unsubscribe());
        this._virtualScrollSubscriptions.forEach((sub) => sub.unsubscribe());
        this.resizeObserver.disconnect();
    }
    toggleAllSelected($event) {
        $event.preventDefault();
        this.selectAllCheckbox?.nativeElement.click();
    }
    resize() {
        this.organizer.resize();
    }
    /**
     * Checks the state of detail panel and if it's opened then
     * find the matching row and trigger the detail panel
     */
    updateDetailState() {
        // Try to update only when there is something cached and its open.
        if (this.detailService.state && this.detailService.isOpen) {
            const row = this.rows.find(row => this.items.trackBy(row.item) === this.items.trackBy(this.detailService.state));
            /**
             * Reopen updated row or close it
             */
            if (row) {
                this.detailService.open(row.item, row.detailButton.nativeElement);
                // always keep open when virtual scroll is available otherwise close it
            }
            else if (!this.virtualScroll) {
                // Using setTimeout to make sure the inner cycles in rows are done
                setTimeout(() => {
                    this.detailService.close();
                });
            }
        }
    }
    /**
     * Public method to re-trigger the computation of displayed items manually
     */
    dataChanged() {
        this.items.refresh();
    }
    toggleVirtualScrollSubscriptions() {
        const hasVirtualScroll = !!this.virtualScroll;
        // the virtual scroll will handle the scrolling
        this.keyNavigation.preventScrollOnFocus = hasVirtualScroll;
        if (hasVirtualScroll && this._virtualScrollSubscriptions.length === 0) {
            // TODO: use `resizeObserver` for all datagrid variants
            this.resizeObserver.observe(this.contentWrapper.nativeElement);
            this.resizeObserver.observe(this.rowsWrapper.nativeElement);
            this._virtualScrollSubscriptions.push(fromEvent(this.contentWrapper.nativeElement, 'scroll').subscribe(() => {
                if (this.datagridHeader.nativeElement.scrollLeft !== this.contentWrapper.nativeElement.scrollLeft) {
                    this.datagridHeader.nativeElement.scrollLeft = this.contentWrapper.nativeElement.scrollLeft;
                }
            }), fromEvent(this.datagridHeader.nativeElement, 'scroll').subscribe(() => {
                if (this.datagridHeader.nativeElement.scrollLeft !== this.contentWrapper.nativeElement.scrollLeft) {
                    this.contentWrapper.nativeElement.scrollLeft = this.datagridHeader.nativeElement.scrollLeft;
                }
            }), this.keyNavigation.nextCellCoordsEmitter.subscribe(cellCoords => {
                if (!cellCoords?.ariaRowIndex) {
                    this.activeCellCoords = null;
                    return;
                }
                if (cellCoords.ariaRowIndex === this.activeCellCoords?.ariaRowIndex) {
                    this.activeCellCoords = cellCoords;
                    return;
                }
                this.activeCellCoords = cellCoords;
                // aria-rowindex is always + 1. Check virtual scroller updateAriaRowIndexes method.
                const rowIndex = Number(cellCoords.ariaRowIndex) - 1;
                this.virtualScroll.scrollToIndex(rowIndex);
            }));
        }
        else if (!hasVirtualScroll) {
            this.resizeObserver.disconnect();
            this._virtualScrollSubscriptions.forEach((sub) => sub.unsubscribe());
            this._virtualScrollSubscriptions = [];
        }
    }
    handleResizeChanges(entries) {
        const rowsWrapper = this.rowsWrapper.nativeElement;
        for (const entry of entries) {
            if (entry.target === this.contentWrapper.nativeElement) {
                this.cachedContentHeight = entry.contentRect.height;
            }
            if (entry.target === rowsWrapper) {
                this.cachedRowsHeight = entry.contentRect.height;
            }
        }
        const scrollClass = 'datagrid-scrollbar-visible';
        if (this.cachedRowsHeight > this.cachedContentHeight) {
            this.renderer.addClass(rowsWrapper, scrollClass);
        }
        else {
            this.renderer.removeClass(rowsWrapper, scrollClass);
        }
    }
}
ClrDatagrid.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagrid, deps: [{ token: i1.DatagridRenderOrganizer }, { token: i2.Items }, { token: i3.ExpandableRowsCount }, { token: i4.Selection }, { token: i5.RowActionService }, { token: i6.StateProvider }, { token: i7.DisplayModeService }, { token: i0.Renderer2 }, { token: i8.DetailService }, { token: DOCUMENT }, { token: i0.ElementRef }, { token: i9.Page }, { token: i10.ClrCommonStringsService }, { token: i11.KeyNavigationGridController }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagrid.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagrid, selector: "clr-datagrid", inputs: { loadingMoreItems: ["clrLoadingMoreItems", "loadingMoreItems"], clrDgSingleSelectionAriaLabel: "clrDgSingleSelectionAriaLabel", clrDgSingleActionableAriaLabel: "clrDgSingleActionableAriaLabel", clrDetailExpandableAriaLabel: "clrDetailExpandableAriaLabel", clrDgDisablePageFocus: "clrDgDisablePageFocus", customSelectAllEnabled: ["clrDgCustomSelectAllEnabled", "customSelectAllEnabled"], loading: ["clrDgLoading", "loading"], selected: ["clrDgSelected", "selected"], singleSelected: ["clrDgSingleSelected", "singleSelected"], clrDgPreserveSelection: "clrDgPreserveSelection", rowSelectionMode: ["clrDgRowSelection", "rowSelectionMode"], trackBy: ["clrDgItemsTrackBy", "trackBy"] }, outputs: { selectedChanged: "clrDgSelectedChange", singleSelectedChanged: "clrDgSingleSelectedChange", refresh: "clrDgRefresh", customSelectAll: "clrDgCustomSelectAll" }, host: { properties: { "class.datagrid-host": "true", "class.datagrid-detail-open": "detailService.isOpen", "class.datagrid-virtual-scroll": "!!virtualScroll" } }, providers: [
        Selection,
        Sort,
        FiltersProvider,
        Page,
        Items,
        DatagridRenderOrganizer,
        RowActionService,
        ExpandableRowsCount,
        StateDebouncer,
        DetailService,
        StateProvider,
        TableSizeService,
        ColumnsService,
        DisplayModeService,
        KeyNavigationGridController,
    ], queries: [{ propertyName: "iterator", first: true, predicate: ClrDatagridItems, descendants: true }, { propertyName: "placeholder", first: true, predicate: ClrDatagridPlaceholder, descendants: true }, { propertyName: "_virtualScroll", predicate: ClrDatagridVirtualScrollDirective }, { propertyName: "columns", predicate: ClrDatagridColumn }, { propertyName: "rows", predicate: ClrDatagridRow, emitDistinctChangesOnly: false }], viewQueries: [{ propertyName: "datagrid", first: true, predicate: ["datagrid"], descendants: true, read: ElementRef }, { propertyName: "datagridTable", first: true, predicate: ["datagridTable"], descendants: true, read: ElementRef }, { propertyName: "datagridHeader", first: true, predicate: ["datagridHeader"], descendants: true, read: ElementRef }, { propertyName: "contentWrapper", first: true, predicate: ["contentWrapper"], descendants: true, read: ElementRef, static: true }, { propertyName: "rowsWrapper", first: true, predicate: ["rowsWrapper"], descendants: true, read: ElementRef, static: true }, { propertyName: "scrollableColumns", first: true, predicate: ["scrollableColumns"], descendants: true, read: ViewContainerRef }, { propertyName: "_projectedDisplayColumns", first: true, predicate: ["projectedDisplayColumns"], descendants: true, read: ViewContainerRef }, { propertyName: "_projectedCalculationColumns", first: true, predicate: ["projectedCalculationColumns"], descendants: true, read: ViewContainerRef }, { propertyName: "_displayedRows", first: true, predicate: ["displayedRows"], descendants: true, read: ViewContainerRef }, { propertyName: "_calculationRows", first: true, predicate: ["calculationRows"], descendants: true, read: ViewContainerRef }, { propertyName: "_fixedColumnTemplate", first: true, predicate: ["fixedColumnTemplate"], descendants: true }, { propertyName: "selectAllCheckbox", first: true, predicate: ["selectAllCheckbox"], descendants: true }, { propertyName: "stickyHeaders", predicate: ["stickyHeader"], descendants: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<ng-content select=\"clr-dg-action-bar\"></ng-content>\n<div class=\"datagrid-outer-wrapper\">\n  <div class=\"datagrid-inner-wrapper\">\n    <div class=\"datagrid\" #datagrid [attr.aria-hidden]=\"detailService.isOpen ? true : null\">\n      <div class=\"datagrid-table-wrapper\">\n        <div role=\"grid\" class=\"datagrid-table\" tabindex=\"-1\" #datagridTable>\n          <div role=\"rowgroup\" class=\"datagrid-header\" #datagridHeader>\n            <div role=\"row\" class=\"datagrid-row\">\n              <div class=\"datagrid-row-master datagrid-row-flex\">\n                <div class=\"datagrid-row-sticky\">\n                  <!--header for datagrid where you can select multiple rows -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    *ngIf=\"selection.selectionType === SELECTION_TYPE.Multi\"\n                    (keydown.space)=\"toggleAllSelected($event)\"\n                  >\n                    <div *ngIf=\"!virtualScroll || customSelectAllEnabled\" class=\"clr-checkbox-wrapper\">\n                      <!-- We need to move focus and space-key handling to the parent because of keyboard arrow key navigation,\n                           which is not able to transfer focus directly on the input when focused with the tab key -->\n                      <input\n                        #selectAllCheckbox\n                        type=\"checkbox\"\n                        [id]=\"selectAllId\"\n                        [(ngModel)]=\"allSelected\"\n                        [attr.aria-label]=\"commonStrings.keys.selectAll\"\n                        tabindex=\"-1\"\n                      />\n                      <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n                      <label [for]=\"selectAllId\" class=\"clr-control-label clr-col-null\">\n                        <span class=\"clr-sr-only\">{{commonStrings.keys.selectAll}}</span>\n                      </label>\n                    </div>\n\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for datagrid where you can select one row only -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    *ngIf=\"selection.selectionType === SELECTION_TYPE.Single\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleSelectionAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for single row action; only displayType if we have at least one actionable row in datagrid -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-row-actions datagrid-fixed-column\"\n                    *ngIf=\"rowActionService.hasActionableRow\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleActionableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for carets; only displayType if we have at least one expandable row in datagrid -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-expandable-caret datagrid-fixed-column\"\n                    *ngIf=\"expandableRows.hasExpandableRow || detailService.enabled\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDetailExpandableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                </div>\n                <div class=\"datagrid-row-scrollable\">\n                  <ng-container #projectedDisplayColumns></ng-container>\n                </div>\n                <div *ngIf=\"virtualScroll\" class=\"datagrid-row-sticky datagrid-row-sticky-scroll\">\n                  <div class=\"datagrid-column\"></div>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <div class=\"datagrid-content\" [class.datagrid-content-virtual]=\"virtualScroll\" #contentWrapper>\n            <div\n              *ngIf=\"virtualScroll\"\n              class=\"datagrid-content-virtual-spacer\"\n              [style.height]=\"virtualScroll?.totalContentHeight\"\n            ></div>\n            <div role=\"presentation\" #rowsWrapper class=\"datagrid-rows\">\n              <clr-dg-row class=\"datagrid-row-loading\" *ngIf=\"loadingMoreItems\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n\n              <ng-container #displayedRows></ng-container>\n\n              <clr-dg-row class=\"datagrid-row-loading\" *ngIf=\"loadingMoreItems\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n\n              <!-- Custom placeholder overrides the default empty one -->\n              <ng-content select=\"clr-dg-placeholder\"></ng-content>\n              <clr-dg-placeholder *ngIf=\"!placeholder\"></clr-dg-placeholder>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <ng-content select=\"clr-dg-footer\"></ng-content>\n    <div class=\"datagrid-spinner\" *ngIf=\"loading\">\n      <clr-spinner clrMedium>Loading</clr-spinner>\n    </div>\n  </div>\n  <ng-content select=\"[clrIfDetail],clr-dg-detail\"></ng-content>\n</div>\n\n<div class=\"datagrid-calculation-table\">\n  <div class=\"datagrid-calculation-header\">\n    <ng-container #projectedCalculationColumns></ng-container>\n  </div>\n  <ng-container #calculationRows></ng-container>\n</div>\n\n<ng-template #fixedColumnTemplate>\n  <div class=\"datagrid-column datagrid-fixed-column\"></div>\n</ng-template>\n", dependencies: [{ kind: "directive", type: i12.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i13.ClrLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i14.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i14.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i14.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i15.ClrSpinner, selector: "clr-spinner", inputs: ["clrInline", "clrInverse", "clrSmall", "clrMedium"] }, { kind: "component", type: i16.ClrDatagridCell, selector: "clr-dg-cell" }, { kind: "component", type: i17.ClrDatagridPlaceholder, selector: "clr-dg-placeholder" }, { kind: "component", type: i18.ClrDatagridRow, selector: "clr-dg-row", inputs: ["clrDgDetailDisabled", "clrDgDetailHidden", "clrDgSkeletonLoading", "clrDgItem", "clrDgSelectable", "clrDgSelected", "clrDgExpanded", "clrDgDetailOpenLabel", "clrDgDetailCloseLabel", "clrDgRowSelectionLabel"], outputs: ["clrDgSelectedChange", "clrDgExpandedChange"] }, { kind: "directive", type: i19.ClrDatagridSelectionCellDirective, selector: ".datagrid-select" }, { kind: "directive", type: i20.DatagridCellRenderer, selector: "clr-dg-cell" }, { kind: "directive", type: i21.DatagridRowRenderer, selector: "clr-dg-row" }, { kind: "directive", type: i22.ActionableOompaLoompa, selector: "clr-datagrid, clr-dg-row" }, { kind: "directive", type: i23.ExpandableOompaLoompa, selector: "clr-datagrid, clr-dg-row" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagrid, decorators: [{
            type: Component,
            args: [{ selector: 'clr-datagrid', providers: [
                        Selection,
                        Sort,
                        FiltersProvider,
                        Page,
                        Items,
                        DatagridRenderOrganizer,
                        RowActionService,
                        ExpandableRowsCount,
                        StateDebouncer,
                        DetailService,
                        StateProvider,
                        TableSizeService,
                        ColumnsService,
                        DisplayModeService,
                        KeyNavigationGridController,
                    ], host: {
                        '[class.datagrid-host]': 'true',
                        '[class.datagrid-detail-open]': 'detailService.isOpen',
                        '[class.datagrid-virtual-scroll]': '!!virtualScroll',
                    }, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<ng-content select=\"clr-dg-action-bar\"></ng-content>\n<div class=\"datagrid-outer-wrapper\">\n  <div class=\"datagrid-inner-wrapper\">\n    <div class=\"datagrid\" #datagrid [attr.aria-hidden]=\"detailService.isOpen ? true : null\">\n      <div class=\"datagrid-table-wrapper\">\n        <div role=\"grid\" class=\"datagrid-table\" tabindex=\"-1\" #datagridTable>\n          <div role=\"rowgroup\" class=\"datagrid-header\" #datagridHeader>\n            <div role=\"row\" class=\"datagrid-row\">\n              <div class=\"datagrid-row-master datagrid-row-flex\">\n                <div class=\"datagrid-row-sticky\">\n                  <!--header for datagrid where you can select multiple rows -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    *ngIf=\"selection.selectionType === SELECTION_TYPE.Multi\"\n                    (keydown.space)=\"toggleAllSelected($event)\"\n                  >\n                    <div *ngIf=\"!virtualScroll || customSelectAllEnabled\" class=\"clr-checkbox-wrapper\">\n                      <!-- We need to move focus and space-key handling to the parent because of keyboard arrow key navigation,\n                           which is not able to transfer focus directly on the input when focused with the tab key -->\n                      <input\n                        #selectAllCheckbox\n                        type=\"checkbox\"\n                        [id]=\"selectAllId\"\n                        [(ngModel)]=\"allSelected\"\n                        [attr.aria-label]=\"commonStrings.keys.selectAll\"\n                        tabindex=\"-1\"\n                      />\n                      <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n                      <label [for]=\"selectAllId\" class=\"clr-control-label clr-col-null\">\n                        <span class=\"clr-sr-only\">{{commonStrings.keys.selectAll}}</span>\n                      </label>\n                    </div>\n\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for datagrid where you can select one row only -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    *ngIf=\"selection.selectionType === SELECTION_TYPE.Single\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleSelectionAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for single row action; only displayType if we have at least one actionable row in datagrid -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-row-actions datagrid-fixed-column\"\n                    *ngIf=\"rowActionService.hasActionableRow\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleActionableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for carets; only displayType if we have at least one expandable row in datagrid -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-expandable-caret datagrid-fixed-column\"\n                    *ngIf=\"expandableRows.hasExpandableRow || detailService.enabled\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDetailExpandableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                </div>\n                <div class=\"datagrid-row-scrollable\">\n                  <ng-container #projectedDisplayColumns></ng-container>\n                </div>\n                <div *ngIf=\"virtualScroll\" class=\"datagrid-row-sticky datagrid-row-sticky-scroll\">\n                  <div class=\"datagrid-column\"></div>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <div class=\"datagrid-content\" [class.datagrid-content-virtual]=\"virtualScroll\" #contentWrapper>\n            <div\n              *ngIf=\"virtualScroll\"\n              class=\"datagrid-content-virtual-spacer\"\n              [style.height]=\"virtualScroll?.totalContentHeight\"\n            ></div>\n            <div role=\"presentation\" #rowsWrapper class=\"datagrid-rows\">\n              <clr-dg-row class=\"datagrid-row-loading\" *ngIf=\"loadingMoreItems\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n\n              <ng-container #displayedRows></ng-container>\n\n              <clr-dg-row class=\"datagrid-row-loading\" *ngIf=\"loadingMoreItems\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n\n              <!-- Custom placeholder overrides the default empty one -->\n              <ng-content select=\"clr-dg-placeholder\"></ng-content>\n              <clr-dg-placeholder *ngIf=\"!placeholder\"></clr-dg-placeholder>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <ng-content select=\"clr-dg-footer\"></ng-content>\n    <div class=\"datagrid-spinner\" *ngIf=\"loading\">\n      <clr-spinner clrMedium>Loading</clr-spinner>\n    </div>\n  </div>\n  <ng-content select=\"[clrIfDetail],clr-dg-detail\"></ng-content>\n</div>\n\n<div class=\"datagrid-calculation-table\">\n  <div class=\"datagrid-calculation-header\">\n    <ng-container #projectedCalculationColumns></ng-container>\n  </div>\n  <ng-container #calculationRows></ng-container>\n</div>\n\n<ng-template #fixedColumnTemplate>\n  <div class=\"datagrid-column datagrid-fixed-column\"></div>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i1.DatagridRenderOrganizer }, { type: i2.Items }, { type: i3.ExpandableRowsCount }, { type: i4.Selection }, { type: i5.RowActionService }, { type: i6.StateProvider }, { type: i7.DisplayModeService }, { type: i0.Renderer2 }, { type: i8.DetailService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ElementRef }, { type: i9.Page }, { type: i10.ClrCommonStringsService }, { type: i11.KeyNavigationGridController }, { type: i0.NgZone }]; }, propDecorators: { loadingMoreItems: [{
                type: Input,
                args: ['clrLoadingMoreItems']
            }], clrDgSingleSelectionAriaLabel: [{
                type: Input
            }], clrDgSingleActionableAriaLabel: [{
                type: Input
            }], clrDetailExpandableAriaLabel: [{
                type: Input
            }], clrDgDisablePageFocus: [{
                type: Input
            }], selectedChanged: [{
                type: Output,
                args: ['clrDgSelectedChange']
            }], singleSelectedChanged: [{
                type: Output,
                args: ['clrDgSingleSelectedChange']
            }], refresh: [{
                type: Output,
                args: ['clrDgRefresh']
            }], customSelectAllEnabled: [{
                type: Input,
                args: ['clrDgCustomSelectAllEnabled']
            }], customSelectAll: [{
                type: Output,
                args: ['clrDgCustomSelectAll']
            }], _virtualScroll: [{
                type: ContentChildren,
                args: [ClrDatagridVirtualScrollDirective]
            }], iterator: [{
                type: ContentChild,
                args: [ClrDatagridItems]
            }], placeholder: [{
                type: ContentChild,
                args: [ClrDatagridPlaceholder]
            }], columns: [{
                type: ContentChildren,
                args: [ClrDatagridColumn]
            }], rows: [{
                type: ContentChildren,
                args: [ClrDatagridRow, { emitDistinctChangesOnly: false }]
            }], datagrid: [{
                type: ViewChild,
                args: ['datagrid', { read: ElementRef }]
            }], datagridTable: [{
                type: ViewChild,
                args: ['datagridTable', { read: ElementRef }]
            }], datagridHeader: [{
                type: ViewChild,
                args: ['datagridHeader', { read: ElementRef }]
            }], contentWrapper: [{
                type: ViewChild,
                args: ['contentWrapper', { read: ElementRef, static: true }]
            }], rowsWrapper: [{
                type: ViewChild,
                args: ['rowsWrapper', { read: ElementRef, static: true }]
            }], scrollableColumns: [{
                type: ViewChild,
                args: ['scrollableColumns', { read: ViewContainerRef }]
            }], _projectedDisplayColumns: [{
                type: ViewChild,
                args: ['projectedDisplayColumns', { read: ViewContainerRef }]
            }], _projectedCalculationColumns: [{
                type: ViewChild,
                args: ['projectedCalculationColumns', { read: ViewContainerRef }]
            }], _displayedRows: [{
                type: ViewChild,
                args: ['displayedRows', { read: ViewContainerRef }]
            }], _calculationRows: [{
                type: ViewChild,
                args: ['calculationRows', { read: ViewContainerRef }]
            }], _fixedColumnTemplate: [{
                type: ViewChild,
                args: ['fixedColumnTemplate']
            }], stickyHeaders: [{
                type: ViewChildren,
                args: ['stickyHeader', { emitDistinctChangesOnly: true }]
            }], selectAllCheckbox: [{
                type: ViewChild,
                args: ['selectAllCheckbox']
            }], loading: [{
                type: Input,
                args: ['clrDgLoading']
            }], selected: [{
                type: Input,
                args: ['clrDgSelected']
            }], singleSelected: [{
                type: Input,
                args: ['clrDgSingleSelected']
            }], clrDgPreserveSelection: [{
                type: Input
            }], rowSelectionMode: [{
                type: Input,
                args: ['clrDgRowSelection']
            }], trackBy: [{
                type: Input,
                args: ['clrDgItemsTrackBy']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2RhdGFncmlkLnRzIiwiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFHTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFFZixVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBR0wsTUFBTSxFQUlOLFNBQVMsRUFDVCxZQUFZLEVBQ1osZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHekQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN4RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFdkQs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O3NCQUF6RSxTQUFTO3VCQUFDLGlCQUFpQixFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFO2dCQUN0QixvQkFBb0I7c0JBQXJELFNBQVM7dUJBQUMscUJBQXFCO2dCQUNpQyxhQUFhO3NCQUE3RSxZQUFZO3VCQUFDLGNBQWMsRUFBRSxFQUFFLHVCQUF1QixFQUFFLElBQUksRUFBRTtnQkFRdkIsaUJBQWlCO3NCQUF4RCxTQUFTO3VCQUFDLG1CQUFtQjtnQkEyQzFCLE9BQU87c0JBRFYsS0FBSzt1QkFBQyxjQUFjO2dCQVlqQixRQUFRO3NCQURYLEtBQUs7dUJBQUMsZUFBZTtnQkFjbEIsY0FBYztzQkFEakIsS0FBSzt1QkFBQyxxQkFBcUI7Z0JBY3hCLHNCQUFzQjtzQkFEekIsS0FBSztnQkFXRixnQkFBZ0I7c0JBRG5CLEtBQUs7dUJBQUMsbUJBQW1CO2dCQU10QixPQUFPO3NCQURWLEtBQUs7dUJBQUMsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEb0NoZWNrLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgUmVuZGVyZXIyLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3Q2hpbGRyZW4sXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY29tYmluZUxhdGVzdCwgZnJvbUV2ZW50LCBtZXJnZSwgb2YsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVib3VuY2VUaW1lLCBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IHVuaXF1ZUlkRmFjdG9yeSB9IGZyb20gJy4uLy4uL3V0aWxzL2lkLWdlbmVyYXRvci9pZC1nZW5lcmF0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZENvbHVtbiB9IGZyb20gJy4vZGF0YWdyaWQtY29sdW1uJztcbmltcG9ydCB7IENsckRhdGFncmlkSXRlbXMgfSBmcm9tICcuL2RhdGFncmlkLWl0ZW1zJztcbmltcG9ydCB7IENsckRhdGFncmlkUGxhY2Vob2xkZXIgfSBmcm9tICcuL2RhdGFncmlkLXBsYWNlaG9sZGVyJztcbmltcG9ydCB7IENsckRhdGFncmlkUm93IH0gZnJvbSAnLi9kYXRhZ3JpZC1yb3cnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRWaXJ0dWFsU2Nyb2xsRGlyZWN0aXZlIH0gZnJvbSAnLi9kYXRhZ3JpZC12aXJ0dWFsLXNjcm9sbC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRGF0YWdyaWREaXNwbGF5TW9kZSB9IGZyb20gJy4vZW51bXMvZGlzcGxheS1tb2RlLmVudW0nO1xuaW1wb3J0IHsgU2VsZWN0aW9uVHlwZSB9IGZyb20gJy4vZW51bXMvc2VsZWN0aW9uLXR5cGUnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRTdGF0ZUludGVyZmFjZSB9IGZyb20gJy4vaW50ZXJmYWNlcy9zdGF0ZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ29sdW1uc1NlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9jb2x1bW5zLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGV0YWlsU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2RldGFpbC5zZXJ2aWNlJztcbmltcG9ydCB7IERpc3BsYXlNb2RlU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2Rpc3BsYXktbW9kZS5zZXJ2aWNlJztcbmltcG9ydCB7IEZpbHRlcnNQcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXJzL2ZpbHRlcnMnO1xuaW1wb3J0IHsgRXhwYW5kYWJsZVJvd3NDb3VudCB9IGZyb20gJy4vcHJvdmlkZXJzL2dsb2JhbC1leHBhbmRhYmxlLXJvd3MnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRJdGVtc1RyYWNrQnlGdW5jdGlvbiwgSXRlbXMgfSBmcm9tICcuL3Byb3ZpZGVycy9pdGVtcyc7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSAnLi9wcm92aWRlcnMvcGFnZSc7XG5pbXBvcnQgeyBSb3dBY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvcm93LWFjdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IFNlbGVjdGlvbiB9IGZyb20gJy4vcHJvdmlkZXJzL3NlbGVjdGlvbic7XG5pbXBvcnQgeyBTb3J0IH0gZnJvbSAnLi9wcm92aWRlcnMvc29ydCc7XG5pbXBvcnQgeyBTdGF0ZURlYm91bmNlciB9IGZyb20gJy4vcHJvdmlkZXJzL3N0YXRlLWRlYm91bmNlci5wcm92aWRlcic7XG5pbXBvcnQgeyBTdGF0ZVByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvc3RhdGUucHJvdmlkZXInO1xuaW1wb3J0IHsgVGFibGVTaXplU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3RhYmxlLXNpemUuc2VydmljZSc7XG5pbXBvcnQgeyBEYXRhZ3JpZFJlbmRlck9yZ2FuaXplciB9IGZyb20gJy4vcmVuZGVyL3JlbmRlci1vcmdhbml6ZXInO1xuaW1wb3J0IHsgQ2VsbENvb3JkaW5hdGVzLCBLZXlOYXZpZ2F0aW9uR3JpZENvbnRyb2xsZXIgfSBmcm9tICcuL3V0aWxzL2tleS1uYXZpZ2F0aW9uLWdyaWQuY29udHJvbGxlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1kYXRhZ3JpZCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9kYXRhZ3JpZC5odG1sJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgU2VsZWN0aW9uLFxuICAgIFNvcnQsXG4gICAgRmlsdGVyc1Byb3ZpZGVyLFxuICAgIFBhZ2UsXG4gICAgSXRlbXMsXG4gICAgRGF0YWdyaWRSZW5kZXJPcmdhbml6ZXIsXG4gICAgUm93QWN0aW9uU2VydmljZSxcbiAgICBFeHBhbmRhYmxlUm93c0NvdW50LFxuICAgIFN0YXRlRGVib3VuY2VyLFxuICAgIERldGFpbFNlcnZpY2UsXG4gICAgU3RhdGVQcm92aWRlcixcbiAgICBUYWJsZVNpemVTZXJ2aWNlLFxuICAgIENvbHVtbnNTZXJ2aWNlLFxuICAgIERpc3BsYXlNb2RlU2VydmljZSxcbiAgICBLZXlOYXZpZ2F0aW9uR3JpZENvbnRyb2xsZXIsXG4gIF0sXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmRhdGFncmlkLWhvc3RdJzogJ3RydWUnLFxuICAgICdbY2xhc3MuZGF0YWdyaWQtZGV0YWlsLW9wZW5dJzogJ2RldGFpbFNlcnZpY2UuaXNPcGVuJyxcbiAgICAnW2NsYXNzLmRhdGFncmlkLXZpcnR1YWwtc2Nyb2xsXSc6ICchIXZpcnR1YWxTY3JvbGwnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEYXRhZ3JpZDxUID0gYW55PiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgRG9DaGVjayB7XG4gIEBJbnB1dCgnY2xyTG9hZGluZ01vcmVJdGVtcycpIGxvYWRpbmdNb3JlSXRlbXM6IGJvb2xlYW47XG5cbiAgQElucHV0KCkgY2xyRGdTaW5nbGVTZWxlY3Rpb25BcmlhTGFiZWw6IHN0cmluZyA9IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLnNpbmdsZVNlbGVjdGlvbkFyaWFMYWJlbDtcbiAgQElucHV0KCkgY2xyRGdTaW5nbGVBY3Rpb25hYmxlQXJpYUxhYmVsOiBzdHJpbmcgPSB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5zaW5nbGVBY3Rpb25hYmxlQXJpYUxhYmVsO1xuICBASW5wdXQoKSBjbHJEZXRhaWxFeHBhbmRhYmxlQXJpYUxhYmVsOiBzdHJpbmcgPSB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5kZXRhaWxFeHBhbmRhYmxlQXJpYUxhYmVsO1xuXG4gIC8vIEFsbG93cyBkaXNhYmxpbmcgb2YgdGhlIGF1dG8gZm9jdXMgb24gcGFnZS9zdGF0ZSBjaGFuZ2VzIChleGNsdWRlcyBmb2N1cyBtYW5hZ2VtZW50IGluc2lkZSBvZiBwb3B1cHMpXG4gIEBJbnB1dCgpIGNsckRnRGlzYWJsZVBhZ2VGb2N1cyA9IGZhbHNlO1xuXG4gIEBPdXRwdXQoJ2NsckRnU2VsZWN0ZWRDaGFuZ2UnKSBzZWxlY3RlZENoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPFRbXT4oZmFsc2UpO1xuICBAT3V0cHV0KCdjbHJEZ1NpbmdsZVNlbGVjdGVkQ2hhbmdlJykgc2luZ2xlU2VsZWN0ZWRDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxUPihmYWxzZSk7XG5cbiAgLyoqXG4gICAqIE91dHB1dCBlbWl0dGVkIHdoZW5ldmVyIHRoZSBkYXRhIG5lZWRzIHRvIGJlIHJlZnJlc2hlZCwgYmFzZWQgb24gdXNlciBhY3Rpb24gb3IgZXh0ZXJuYWwgb25lc1xuICAgKi9cbiAgQE91dHB1dCgnY2xyRGdSZWZyZXNoJykgcmVmcmVzaCA9IG5ldyBFdmVudEVtaXR0ZXI8Q2xyRGF0YWdyaWRTdGF0ZUludGVyZmFjZTxUPj4oZmFsc2UpO1xuXG4gIC8qKlxuICAgKiBUaGUgYXBwbGljYXRpb24gY2FuIHByb3ZpZGUgY3VzdG9tIHNlbGVjdCBhbGwgbG9naWMuXG4gICAqL1xuICBASW5wdXQoJ2NsckRnQ3VzdG9tU2VsZWN0QWxsRW5hYmxlZCcpIGN1c3RvbVNlbGVjdEFsbEVuYWJsZWQgPSBmYWxzZTtcbiAgQE91dHB1dCgnY2xyRGdDdXN0b21TZWxlY3RBbGwnKSBjdXN0b21TZWxlY3RBbGwgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgLyoqXG4gICAqIEV4cG9zZSB2aXJ0dWFsIHNjcm9sbCBkaXJlY3RpdmUgZm9yIGFwcGxpY2F0aW9ucyB0byBhY2Nlc3MgaXRzIHB1YmxpYyBtZXRob2RzXG4gICAqL1xuICBAQ29udGVudENoaWxkcmVuKENsckRhdGFncmlkVmlydHVhbFNjcm9sbERpcmVjdGl2ZSkgX3ZpcnR1YWxTY3JvbGw6IFF1ZXJ5TGlzdDxDbHJEYXRhZ3JpZFZpcnR1YWxTY3JvbGxEaXJlY3RpdmU8YW55Pj47XG4gIC8qKlxuICAgKiBXZSBncmFiIHRoZSBzbWFydCBpdGVyYXRvciBmcm9tIHByb2plY3RlZCBjb250ZW50XG4gICAqL1xuICBAQ29udGVudENoaWxkKENsckRhdGFncmlkSXRlbXMpIGl0ZXJhdG9yOiBDbHJEYXRhZ3JpZEl0ZW1zPFQ+O1xuXG4gIC8qKlxuICAgKiBDdXN0b20gcGxhY2Vob2xkZXIgZGV0ZWN0aW9uXG4gICAqL1xuICBAQ29udGVudENoaWxkKENsckRhdGFncmlkUGxhY2Vob2xkZXIpIHBsYWNlaG9sZGVyOiBDbHJEYXRhZ3JpZFBsYWNlaG9sZGVyPFQ+O1xuXG4gIC8qKlxuICAgKiBIaWRlYWJsZSBDb2x1bW4gZGF0YSBzb3VyY2UgLyBkZXRlY3Rpb24uXG4gICAqL1xuICBAQ29udGVudENoaWxkcmVuKENsckRhdGFncmlkQ29sdW1uKSBjb2x1bW5zOiBRdWVyeUxpc3Q8Q2xyRGF0YWdyaWRDb2x1bW48VD4+O1xuXG4gIC8qKlxuICAgKiBXaGVuIHRoZSBkYXRhZ3JpZCBpcyB1c2VyLW1hbmFnZWQgd2l0aG91dCB0aGUgc21hcnQgaXRlcmF0b3IsIHdlIGdldCB0aGUgaXRlbXMgZGlzcGxheWVkXG4gICAqIGJ5IHF1ZXJ5aW5nIHRoZSBwcm9qZWN0ZWQgY29udGVudC4gVGhpcyBpcyBuZWVkZWQgdG8ga2VlcCB0cmFjayBvZiB0aGUgbW9kZWxzIGN1cnJlbnRseVxuICAgKiBkaXNwbGF5ZWQsIHR5cGljYWxseSBmb3Igc2VsZWN0aW9uLlxuICAgKi9cbiAgQENvbnRlbnRDaGlsZHJlbihDbHJEYXRhZ3JpZFJvdywgeyBlbWl0RGlzdGluY3RDaGFuZ2VzT25seTogZmFsc2UgfSkgcm93czogUXVlcnlMaXN0PENsckRhdGFncmlkUm93PFQ+PjtcblxuICBAVmlld0NoaWxkKCdkYXRhZ3JpZCcsIHsgcmVhZDogRWxlbWVudFJlZiB9KSBkYXRhZ3JpZDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ2RhdGFncmlkVGFibGUnLCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSkgZGF0YWdyaWRUYWJsZTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ2RhdGFncmlkSGVhZGVyJywgeyByZWFkOiBFbGVtZW50UmVmIH0pIGRhdGFncmlkSGVhZGVyOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgnY29udGVudFdyYXBwZXInLCB7IHJlYWQ6IEVsZW1lbnRSZWYsIHN0YXRpYzogdHJ1ZSB9KSBjb250ZW50V3JhcHBlcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ3Jvd3NXcmFwcGVyJywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IHRydWUgfSkgcm93c1dyYXBwZXI6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdzY3JvbGxhYmxlQ29sdW1ucycsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSBzY3JvbGxhYmxlQ29sdW1uczogVmlld0NvbnRhaW5lclJlZjtcbiAgQFZpZXdDaGlsZCgncHJvamVjdGVkRGlzcGxheUNvbHVtbnMnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSkgX3Byb2plY3RlZERpc3BsYXlDb2x1bW5zOiBWaWV3Q29udGFpbmVyUmVmO1xuICBAVmlld0NoaWxkKCdwcm9qZWN0ZWRDYWxjdWxhdGlvbkNvbHVtbnMnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSkgX3Byb2plY3RlZENhbGN1bGF0aW9uQ29sdW1uczogVmlld0NvbnRhaW5lclJlZjtcbiAgQFZpZXdDaGlsZCgnZGlzcGxheWVkUm93cycsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSBfZGlzcGxheWVkUm93czogVmlld0NvbnRhaW5lclJlZjtcbiAgQFZpZXdDaGlsZCgnY2FsY3VsYXRpb25Sb3dzJywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmIH0pIF9jYWxjdWxhdGlvblJvd3M6IFZpZXdDb250YWluZXJSZWY7XG4gIEBWaWV3Q2hpbGQoJ2ZpeGVkQ29sdW1uVGVtcGxhdGUnKSBfZml4ZWRDb2x1bW5UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgQFZpZXdDaGlsZHJlbignc3RpY2t5SGVhZGVyJywgeyBlbWl0RGlzdGluY3RDaGFuZ2VzT25seTogdHJ1ZSB9KSBzdGlja3lIZWFkZXJzOiBRdWVyeUxpc3Q8RWxlbWVudFJlZj47XG5cbiAgc2VsZWN0QWxsSWQ6IHN0cmluZztcbiAgYWN0aXZlQ2VsbENvb3JkczogQ2VsbENvb3JkaW5hdGVzO1xuXG4gIC8qIHJlZmVyZW5jZSB0byB0aGUgZW51bSBzbyB0aGF0IHRlbXBsYXRlIGNhbiBhY2Nlc3MgKi9cbiAgU0VMRUNUSU9OX1RZUEUgPSBTZWxlY3Rpb25UeXBlO1xuXG4gIEBWaWV3Q2hpbGQoJ3NlbGVjdEFsbENoZWNrYm94JykgcHJpdmF0ZSBzZWxlY3RBbGxDaGVja2JveDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PjtcblxuICAvKipcbiAgICogU3Vic2NyaXB0aW9ucyB0byBhbGwgdGhlIHNlcnZpY2VzIGFuZCBxdWVyaWVzIGNoYW5nZXNcbiAgICovXG4gIHByaXZhdGUgX3N1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG4gIHByaXZhdGUgX3ZpcnR1YWxTY3JvbGxTdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIHByaXZhdGUgY2FjaGVkUm93c0hlaWdodCA9IDA7XG4gIHByaXZhdGUgY2FjaGVkQ29udGVudEhlaWdodCA9IDA7XG4gIHByaXZhdGUgcmVzaXplT2JzZXJ2ZXI6IFJlc2l6ZU9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKGVudHJpZXMgPT4ge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZVJlc2l6ZUNoYW5nZXMoZW50cmllcyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgb3JnYW5pemVyOiBEYXRhZ3JpZFJlbmRlck9yZ2FuaXplcixcbiAgICBwdWJsaWMgaXRlbXM6IEl0ZW1zPFQ+LFxuICAgIHB1YmxpYyBleHBhbmRhYmxlUm93czogRXhwYW5kYWJsZVJvd3NDb3VudCxcbiAgICBwdWJsaWMgc2VsZWN0aW9uOiBTZWxlY3Rpb248VD4sXG4gICAgcHVibGljIHJvd0FjdGlvblNlcnZpY2U6IFJvd0FjdGlvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBzdGF0ZVByb3ZpZGVyOiBTdGF0ZVByb3ZpZGVyPFQ+LFxuICAgIHByaXZhdGUgZGlzcGxheU1vZGU6IERpc3BsYXlNb2RlU2VydmljZSxcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIGRldGFpbFNlcnZpY2U6IERldGFpbFNlcnZpY2UsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogYW55LFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSxcbiAgICBwdWJsaWMga2V5TmF2aWdhdGlvbjogS2V5TmF2aWdhdGlvbkdyaWRDb250cm9sbGVyLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lXG4gICkge1xuICAgIGNvbnN0IGRhdGFncmlkSWQgPSB1bmlxdWVJZEZhY3RvcnkoKTtcblxuICAgIHRoaXMuc2VsZWN0QWxsSWQgPSAnY2xyLWRnLXNlbGVjdC1hbGwtJyArIGRhdGFncmlkSWQ7XG4gICAgZGV0YWlsU2VydmljZS5pZCA9IGRhdGFncmlkSWQ7XG4gIH1cblxuICAvKipcbiAgICogRnJlZXplcyB0aGUgZGF0YWdyaWQgd2hpbGUgZGF0YSBpcyBsb2FkaW5nXG4gICAqL1xuICBASW5wdXQoJ2NsckRnTG9hZGluZycpXG4gIGdldCBsb2FkaW5nKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLml0ZW1zLmxvYWRpbmc7XG4gIH1cbiAgc2V0IGxvYWRpbmcodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLml0ZW1zLmxvYWRpbmcgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcnJheSBvZiBhbGwgc2VsZWN0ZWQgaXRlbXNcbiAgICovXG4gIEBJbnB1dCgnY2xyRGdTZWxlY3RlZCcpXG4gIHNldCBzZWxlY3RlZCh2YWx1ZTogVFtdIHwgdW5kZWZpbmVkKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID0gU2VsZWN0aW9uVHlwZS5NdWx0aTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9IFNlbGVjdGlvblR5cGUuTm9uZTtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3Rpb24udXBkYXRlQ3VycmVudCh2YWx1ZSwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdGVkIGl0ZW0gaW4gc2luZ2xlLXNlbGVjdCBtb2RlXG4gICAqL1xuICBASW5wdXQoJ2NsckRnU2luZ2xlU2VsZWN0ZWQnKVxuICBzZXQgc2luZ2xlU2VsZWN0ZWQodmFsdWU6IFQpIHtcbiAgICB0aGlzLnNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID0gU2VsZWN0aW9uVHlwZS5TaW5nbGU7XG4gICAgLy8gdGhlIGNsckRnU2luZ2xlU2VsZWN0ZWQgaXMgdXBkYXRlZCBpbiBvbmUgb2YgdHdvIGNhc2VzOlxuICAgIC8vIDEuIGFuIGV4cGxpY2l0IHZhbHVlIGlzIHBhc3NlZFxuICAgIC8vIDIuIGlzIGJlaW5nIHNldCB0byBudWxsIG9yIHVuZGVmaW5lZCwgd2hlcmUgcHJldmlvdXNseSBpdCBoYWQgYSB2YWx1ZVxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5zZWxlY3Rpb24uY3VycmVudFNpbmdsZSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3Rpb24uY3VycmVudFNpbmdsZSkge1xuICAgICAgdGhpcy5zZWxlY3Rpb24uY3VycmVudFNpbmdsZSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGNsckRnUHJlc2VydmVTZWxlY3Rpb24oc3RhdGU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNlbGVjdGlvbi5wcmVzZXJ2ZVNlbGVjdGlvbiA9IHN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIHNpbmNlIDIuMCwgcmVtb3ZlIGluIDMuMFxuICAgKlxuICAgKiBTZWxlY3Rpb24vRGVzZWxlY3Rpb24gb24gcm93IGNsaWNrIG1vZGVcbiAgICovXG4gIEBJbnB1dCgnY2xyRGdSb3dTZWxlY3Rpb24nKVxuICBzZXQgcm93U2VsZWN0aW9uTW9kZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2VsZWN0aW9uLnJvd1NlbGVjdGlvbk1vZGUgPSB2YWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyRGdJdGVtc1RyYWNrQnknKVxuICBzZXQgdHJhY2tCeSh2YWx1ZTogQ2xyRGF0YWdyaWRJdGVtc1RyYWNrQnlGdW5jdGlvbjxUPikge1xuICAgIHRoaXMuaXRlbXMudHJhY2tCeSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyBpZiBhbGwgY3VycmVudGx5IGRpc3BsYXllZCBpdGVtcyBhcmUgc2VsZWN0ZWRcbiAgICovXG4gIGdldCBhbGxTZWxlY3RlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uaXNBbGxTZWxlY3RlZCgpO1xuICB9XG4gIHNldCBhbGxTZWxlY3RlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLmN1c3RvbVNlbGVjdEFsbEVuYWJsZWQpIHtcbiAgICAgIHRoaXMuY3VzdG9tU2VsZWN0QWxsLmVtaXQodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgaXMgYSBzZXR0ZXIgYnV0IHdlIGlnbm9yZSB0aGUgdmFsdWUuXG4gICAgICAgKiBJdCdzIHN0cmFuZ2UsIGJ1dCBpdCBsZXRzIHVzIGhhdmUgYW4gaW5kZXRlcm1pbmF0ZSBzdGF0ZSB3aGVyZSBvbmx5XG4gICAgICAgKiBzb21lIG9mIHRoZSBpdGVtcyBhcmUgc2VsZWN0ZWQuXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2VsZWN0aW9uLnRvZ2dsZUFsbCgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2aXJ0dWFsU2Nyb2xsKCk6IENsckRhdGFncmlkVmlydHVhbFNjcm9sbERpcmVjdGl2ZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fdmlydHVhbFNjcm9sbD8uZ2V0KDApO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIGlmICghdGhpcy5pdGVtcy5zbWFydCkge1xuICAgICAgdGhpcy5pdGVtcy5hbGwgPSB0aGlzLnJvd3MubWFwKChyb3c6IENsckRhdGFncmlkUm93PFQ+KSA9PiByb3cuaXRlbSk7XG4gICAgfVxuXG4gICAgY29uc3Qgcm93SXRlbXNDaGFuZ2VzID0gdGhpcy5yb3dzLmNoYW5nZXMucGlwZShcbiAgICAgIHN3aXRjaE1hcCgocm93czogQ2xyRGF0YWdyaWRSb3c8VD5bXSkgPT5cbiAgICAgICAgbWVyZ2UoXG4gICAgICAgICAgLy8gaW1tZWRpYXRlIHVwZGF0ZVxuICAgICAgICAgIG9mKHJvd3MubWFwKHJvdyA9PiByb3cuaXRlbSkpLFxuICAgICAgICAgIC8vIHN1YnNlcXVlbnQgdXBkYXRlcyBvbmNlIHBlciB0aWNrXG4gICAgICAgICAgY29tYmluZUxhdGVzdChyb3dzLm1hcChyb3cgPT4gcm93Lml0ZW1DaGFuZ2VzKSkucGlwZShkZWJvdW5jZVRpbWUoMCkpXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuXG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgcm93SXRlbXNDaGFuZ2VzLnN1YnNjcmliZShhbGwgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuaXRlbXMuc21hcnQpIHtcbiAgICAgICAgICB0aGlzLml0ZW1zLmFsbCA9IGFsbDtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICB0aGlzLl92aXJ0dWFsU2Nyb2xsLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy50b2dnbGVWaXJ0dWFsU2Nyb2xsU3Vic2NyaXB0aW9ucygpO1xuICAgICAgfSksXG4gICAgICB0aGlzLnJvd3MuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAvLyBSZW1vdmUgYW55IHByb2plY3RlZCByb3dzIGZyb20gdGhlIGRpc3BsYXllZFJvd3MgY29udGFpbmVyXG4gICAgICAgIC8vIE5lY2Vzc2FyeSB3aXRoIEl2eSBvZmYuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdm13YXJlL2NsYXJpdHkvaXNzdWVzLzQ2OTJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX2Rpc3BsYXllZFJvd3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICBpZiAodGhpcy5fZGlzcGxheWVkUm93cy5nZXQoaSkuZGVzdHJveWVkKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXNwbGF5ZWRSb3dzLnJlbW92ZShpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICB0aGlzLl9kaXNwbGF5ZWRSb3dzLmluc2VydChyb3cuX3ZpZXcpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZURldGFpbFN0YXRlKCk7XG5cbiAgICAgICAgLy8gcmV0YWluIGFjdGl2ZSBjZWxsIHdoZW4gbmF2aWdhdGluZyB3aXRoIFVwL0Rvd24gQXJyb3dzLCBQYWdlVXAgYW5kIFBhZ2VEb3duIGJ1dHRvbnMgaW4gdmlydHVhbCBzY3JvbGxlclxuICAgICAgICBpZiAodGhpcy52aXJ0dWFsU2Nyb2xsICYmIHRoaXMuYWN0aXZlQ2VsbENvb3Jkcykge1xuICAgICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByb3cgPSBBcnJheS5mcm9tKHRoaXMucm93cykuZmluZChyb3cgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gcm93LmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0uYXJpYVJvd0luZGV4ID09PSB0aGlzLmFjdGl2ZUNlbGxDb29yZHMuYXJpYVJvd0luZGV4O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghcm93KSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYWN0aXZlQ2VsbCA9IHJvdy5lbC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5rZXlOYXZpZ2F0aW9uLmNvbmZpZy5rZXlHcmlkQ2VsbHMpW1xuICAgICAgICAgICAgICB0aGlzLmFjdGl2ZUNlbGxDb29yZHMueFxuICAgICAgICAgICAgXSBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgICAgICAgdGhpcy5rZXlOYXZpZ2F0aW9uLnNldEFjdGl2ZUNlbGwoYWN0aXZlQ2VsbCk7XG4gICAgICAgICAgICB0aGlzLmtleU5hdmlnYXRpb24uZm9jdXNFbGVtZW50KGFjdGl2ZUNlbGwsIHsgcHJldmVudFNjcm9sbDogdHJ1ZSB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIE91ciBzZXR1cCBoYXBwZW5zIGluIHRoZSB2aWV3IG9mIHNvbWUgb2Ygb3VyIGNvbXBvbmVudHMsIHNvIHdlIHdhaXQgZm9yIGl0IHRvIGJlIGRvbmUgYmVmb3JlIHN0YXJ0aW5nXG4gICAqL1xuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5rZXlOYXZpZ2F0aW9uLmluaXRpYWxpemVLZXlHcmlkKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG5cbiAgICB0aGlzLnVwZGF0ZURldGFpbFN0YXRlKCk7XG4gICAgLy8gVE9ETzogZGV0ZXJtaW5lIGlmIHdlIGNhbiBnZXQgcmlkIG9mIHByb3ZpZGVyIHdpcmluZyBpbiB2aWV3IGluaXQgc28gdGhhdCBzdWJzY3JpcHRpb25zIGNhbiBiZSBkb25lIGVhcmxpZXJcbiAgICB0aGlzLnJlZnJlc2guZW1pdCh0aGlzLnN0YXRlUHJvdmlkZXIuc3RhdGUpO1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHRoaXMuc3RpY2t5SGVhZGVycy5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB0aGlzLnJlc2l6ZSgpKSxcbiAgICAgIHRoaXMuc3RhdGVQcm92aWRlci5jaGFuZ2Uuc3Vic2NyaWJlKHN0YXRlID0+IHRoaXMucmVmcmVzaC5lbWl0KHN0YXRlKSksXG4gICAgICB0aGlzLnNlbGVjdGlvbi5jaGFuZ2Uuc3Vic2NyaWJlKHMgPT4ge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5TaW5nbGUpIHtcbiAgICAgICAgICB0aGlzLnNpbmdsZVNlbGVjdGVkQ2hhbmdlZC5lbWl0KHMgYXMgVCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5NdWx0aSkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2VkLmVtaXQocyBhcyBUW10pO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIC8vIFJlaW5pdGlhbGl6ZSBhcnJvdyBrZXkgbmF2aWdhdGlvbiBvbiBwYWdlIGNoYW5nZXNcbiAgICAgIHRoaXMucGFnZS5jaGFuZ2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5rZXlOYXZpZ2F0aW9uLnJlc2V0S2V5R3JpZCgpO1xuICAgICAgICBpZiAoIXRoaXMuY2xyRGdEaXNhYmxlUGFnZUZvY3VzKSB7XG4gICAgICAgICAgdGhpcy5kYXRhZ3JpZFRhYmxlLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICAvLyBBIHN1YnNjcmlwdGlvbiB0aGF0IGxpc3RlbnMgZm9yIGRpc3BsYXlNb2RlIGNoYW5nZXMgb24gdGhlIGRhdGFncmlkXG4gICAgICB0aGlzLmRpc3BsYXlNb2RlLnZpZXcuc3Vic2NyaWJlKHZpZXdDaGFuZ2UgPT4ge1xuICAgICAgICAvLyBSZW1vdmUgYW55IHByb2plY3RlZCBjb2x1bW5zIGZyb20gdGhlIHByb2plY3RlZERpc3BsYXlDb2x1bW5zIGNvbnRhaW5lclxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fcHJvamVjdGVkRGlzcGxheUNvbHVtbnMubGVuZ3RoOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgdGhpcy5fcHJvamVjdGVkRGlzcGxheUNvbHVtbnMuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVtb3ZlIGFueSBwcm9qZWN0ZWQgY29sdW1ucyBmcm9tIHRoZSBwcm9qZWN0ZWRDYWxjdWxhdGlvbkNvbHVtbnMgY29udGFpbmVyXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl9wcm9qZWN0ZWRDYWxjdWxhdGlvbkNvbHVtbnMubGVuZ3RoOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgdGhpcy5fcHJvamVjdGVkQ2FsY3VsYXRpb25Db2x1bW5zLmRldGFjaCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlbW92ZSBhbnkgcHJvamVjdGVkIHJvd3MgZnJvbSB0aGUgY2FsY3VsYXRpb25Sb3dzIGNvbnRhaW5lclxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fY2FsY3VsYXRpb25Sb3dzLmxlbmd0aDsgaSA+IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMuX2NhbGN1bGF0aW9uUm93cy5kZXRhY2goKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZW1vdmUgYW55IHByb2plY3RlZCByb3dzIGZyb20gdGhlIGRpc3BsYXllZFJvd3MgY29udGFpbmVyXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl9kaXNwbGF5ZWRSb3dzLmxlbmd0aDsgaSA+IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMuX2Rpc3BsYXllZFJvd3MuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZpZXdDaGFuZ2UgPT09IERhdGFncmlkRGlzcGxheU1vZGUuRElTUExBWSkge1xuICAgICAgICAgIC8vIFNldCBzdGF0ZSwgc3R5bGUgZm9yIHRoZSBkYXRhZ3JpZCB0byBESVNQTEFZIGFuZCBpbnNlcnQgcm93ICYgY29sdW1ucyBpbnRvIGNvbnRhaW5lcnNcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2RhdGFncmlkLWNhbGN1bGF0ZS1tb2RlJyk7XG4gICAgICAgICAgdGhpcy5jb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3RlZERpc3BsYXlDb2x1bW5zLmluc2VydChjb2x1bW4uX3ZpZXcpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMucm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICB0aGlzLl9kaXNwbGF5ZWRSb3dzLmluc2VydChyb3cuX3ZpZXcpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFNldCBzdGF0ZSwgc3R5bGUgZm9yIHRoZSBkYXRhZ3JpZCB0byBDQUxDVUxBVEUgYW5kIGluc2VydCByb3cgJiBjb2x1bW5zIGludG8gY29udGFpbmVyc1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnZGF0YWdyaWQtY2FsY3VsYXRlLW1vZGUnKTtcbiAgICAgICAgICAvLyBJbnNlcnRzIGEgZml4ZWQgY29sdW1uIGlmIGFueSBvZiB0aGVzZSBjb25kaXRpb25zIGFyZSB0cnVlLlxuICAgICAgICAgIGNvbnN0IGZpeGVkQ29sdW1uQ29uZGl0aW9ucyA9IFtcbiAgICAgICAgICAgIHRoaXMucm93QWN0aW9uU2VydmljZS5oYXNBY3Rpb25hYmxlUm93LFxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSAhPT0gdGhpcy5TRUxFQ1RJT05fVFlQRS5Ob25lLFxuICAgICAgICAgICAgdGhpcy5leHBhbmRhYmxlUm93cy5oYXNFeHBhbmRhYmxlUm93IHx8IHRoaXMuZGV0YWlsU2VydmljZS5lbmFibGVkLFxuICAgICAgICAgIF07XG4gICAgICAgICAgZml4ZWRDb2x1bW5Db25kaXRpb25zXG4gICAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgICAgICAuZm9yRWFjaCgoKSA9PlxuICAgICAgICAgICAgICB0aGlzLl9wcm9qZWN0ZWRDYWxjdWxhdGlvbkNvbHVtbnMuaW5zZXJ0KHRoaXMuX2ZpeGVkQ29sdW1uVGVtcGxhdGUuY3JlYXRlRW1iZWRkZWRWaWV3KG51bGwpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLmNvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xuICAgICAgICAgICAgdGhpcy5fcHJvamVjdGVkQ2FsY3VsYXRpb25Db2x1bW5zLmluc2VydChjb2x1bW4uX3ZpZXcpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMucm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGlvblJvd3MuaW5zZXJ0KHJvdy5fdmlldyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGlmICh0aGlzLnZpcnR1YWxTY3JvbGwpIHtcbiAgICAgIHRoaXMudG9nZ2xlVmlydHVhbFNjcm9sbFN1YnNjcmlwdGlvbnMoKTtcbiAgICB9XG5cbiAgICAvLyBXZSBuZWVkIHRvIHByZXNlcnZlIHNoaWZ0IHN0YXRlLCBzbyBpdCBjYW4gYmUgdXNlZCBvbiBzZWxlY3Rpb24gY2hhbmdlLCByZWdhcmRsZXNzIG9mIHRoZSBpbnB1dCBldmVudFxuICAgIC8vIHRoYXQgdHJpZ2dlcmVkIHRoZSBjaGFuZ2UuIFRoaXMgaGVscHMgdXMgdG8gZWFzaWx5IHJlc29sdmUgdGhlIGsvYiBvbmx5IGNhc2UgdG9nZXRoZXIgd2l0aCB0aGUgbW91c2Ugc2VsZWN0aW9uIGNhc2UuXG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgZnJvbUV2ZW50KHRoaXMuZG9jdW1lbnQuYm9keSwgJ2tleWRvd24nKS5zdWJzY3JpYmUoKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ1NoaWZ0Jykge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc2hpZnRQcmVzc2VkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICBmcm9tRXZlbnQodGhpcy5kb2N1bWVudC5ib2R5LCAna2V5dXAnKS5zdWJzY3JpYmUoKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ1NoaWZ0Jykge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc2hpZnRQcmVzc2VkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICAvLyB3ZSB0cmFjayBmb3IgY2hhbmdlcyBvbiBzZWxlY3Rpb24uY3VycmVudCBiZWNhdXNlIGl0IGNhbiBoYXBwZW4gd2l0aCBwdXNoaW5nIGl0ZW1zXG4gICAgLy8gaW5zdGVhZCBvZiBvdmVycmlkaW5nIHRoZSB2YXJpYWJsZVxuICAgIHRoaXMuc2VsZWN0aW9uLmNoZWNrRm9yQ2hhbmdlcygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5mb3JFYWNoKChzdWI6IFN1YnNjcmlwdGlvbikgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICAgIHRoaXMuX3ZpcnR1YWxTY3JvbGxTdWJzY3JpcHRpb25zLmZvckVhY2goKHN1YjogU3Vic2NyaXB0aW9uKSA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gICAgdGhpcy5yZXNpemVPYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gIH1cblxuICB0b2dnbGVBbGxTZWxlY3RlZCgkZXZlbnQ6IGFueSkge1xuICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2VsZWN0QWxsQ2hlY2tib3g/Lm5hdGl2ZUVsZW1lbnQuY2xpY2soKTtcbiAgfVxuXG4gIHJlc2l6ZSgpOiB2b2lkIHtcbiAgICB0aGlzLm9yZ2FuaXplci5yZXNpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgdGhlIHN0YXRlIG9mIGRldGFpbCBwYW5lbCBhbmQgaWYgaXQncyBvcGVuZWQgdGhlblxuICAgKiBmaW5kIHRoZSBtYXRjaGluZyByb3cgYW5kIHRyaWdnZXIgdGhlIGRldGFpbCBwYW5lbFxuICAgKi9cbiAgdXBkYXRlRGV0YWlsU3RhdGUoKSB7XG4gICAgLy8gVHJ5IHRvIHVwZGF0ZSBvbmx5IHdoZW4gdGhlcmUgaXMgc29tZXRoaW5nIGNhY2hlZCBhbmQgaXRzIG9wZW4uXG4gICAgaWYgKHRoaXMuZGV0YWlsU2VydmljZS5zdGF0ZSAmJiB0aGlzLmRldGFpbFNlcnZpY2UuaXNPcGVuKSB7XG4gICAgICBjb25zdCByb3cgPSB0aGlzLnJvd3MuZmluZChyb3cgPT4gdGhpcy5pdGVtcy50cmFja0J5KHJvdy5pdGVtKSA9PT0gdGhpcy5pdGVtcy50cmFja0J5KHRoaXMuZGV0YWlsU2VydmljZS5zdGF0ZSkpO1xuXG4gICAgICAvKipcbiAgICAgICAqIFJlb3BlbiB1cGRhdGVkIHJvdyBvciBjbG9zZSBpdFxuICAgICAgICovXG4gICAgICBpZiAocm93KSB7XG4gICAgICAgIHRoaXMuZGV0YWlsU2VydmljZS5vcGVuKHJvdy5pdGVtLCByb3cuZGV0YWlsQnV0dG9uLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAvLyBhbHdheXMga2VlcCBvcGVuIHdoZW4gdmlydHVhbCBzY3JvbGwgaXMgYXZhaWxhYmxlIG90aGVyd2lzZSBjbG9zZSBpdFxuICAgICAgfSBlbHNlIGlmICghdGhpcy52aXJ0dWFsU2Nyb2xsKSB7XG4gICAgICAgIC8vIFVzaW5nIHNldFRpbWVvdXQgdG8gbWFrZSBzdXJlIHRoZSBpbm5lciBjeWNsZXMgaW4gcm93cyBhcmUgZG9uZVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLmRldGFpbFNlcnZpY2UuY2xvc2UoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBtZXRob2QgdG8gcmUtdHJpZ2dlciB0aGUgY29tcHV0YXRpb24gb2YgZGlzcGxheWVkIGl0ZW1zIG1hbnVhbGx5XG4gICAqL1xuICBkYXRhQ2hhbmdlZCgpIHtcbiAgICB0aGlzLml0ZW1zLnJlZnJlc2goKTtcbiAgfVxuXG4gIHByaXZhdGUgdG9nZ2xlVmlydHVhbFNjcm9sbFN1YnNjcmlwdGlvbnMoKSB7XG4gICAgY29uc3QgaGFzVmlydHVhbFNjcm9sbCA9ICEhdGhpcy52aXJ0dWFsU2Nyb2xsO1xuXG4gICAgLy8gdGhlIHZpcnR1YWwgc2Nyb2xsIHdpbGwgaGFuZGxlIHRoZSBzY3JvbGxpbmdcbiAgICB0aGlzLmtleU5hdmlnYXRpb24ucHJldmVudFNjcm9sbE9uRm9jdXMgPSBoYXNWaXJ0dWFsU2Nyb2xsO1xuXG4gICAgaWYgKGhhc1ZpcnR1YWxTY3JvbGwgJiYgdGhpcy5fdmlydHVhbFNjcm9sbFN1YnNjcmlwdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBUT0RPOiB1c2UgYHJlc2l6ZU9ic2VydmVyYCBmb3IgYWxsIGRhdGFncmlkIHZhcmlhbnRzXG4gICAgICB0aGlzLnJlc2l6ZU9ic2VydmVyLm9ic2VydmUodGhpcy5jb250ZW50V3JhcHBlci5uYXRpdmVFbGVtZW50KTtcbiAgICAgIHRoaXMucmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnJvd3NXcmFwcGVyLm5hdGl2ZUVsZW1lbnQpO1xuXG4gICAgICB0aGlzLl92aXJ0dWFsU2Nyb2xsU3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICBmcm9tRXZlbnQodGhpcy5jb250ZW50V3JhcHBlci5uYXRpdmVFbGVtZW50LCAnc2Nyb2xsJykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5kYXRhZ3JpZEhlYWRlci5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQgIT09IHRoaXMuY29udGVudFdyYXBwZXIubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0KSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFncmlkSGVhZGVyLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdCA9IHRoaXMuY29udGVudFdyYXBwZXIubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgIGZyb21FdmVudCh0aGlzLmRhdGFncmlkSGVhZGVyLm5hdGl2ZUVsZW1lbnQsICdzY3JvbGwnKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmRhdGFncmlkSGVhZGVyLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdCAhPT0gdGhpcy5jb250ZW50V3JhcHBlci5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGVudFdyYXBwZXIubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0ID0gdGhpcy5kYXRhZ3JpZEhlYWRlci5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICAgdGhpcy5rZXlOYXZpZ2F0aW9uLm5leHRDZWxsQ29vcmRzRW1pdHRlci5zdWJzY3JpYmUoY2VsbENvb3JkcyA9PiB7XG4gICAgICAgICAgaWYgKCFjZWxsQ29vcmRzPy5hcmlhUm93SW5kZXgpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ2VsbENvb3JkcyA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNlbGxDb29yZHMuYXJpYVJvd0luZGV4ID09PSB0aGlzLmFjdGl2ZUNlbGxDb29yZHM/LmFyaWFSb3dJbmRleCkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVDZWxsQ29vcmRzID0gY2VsbENvb3JkcztcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmFjdGl2ZUNlbGxDb29yZHMgPSBjZWxsQ29vcmRzO1xuXG4gICAgICAgICAgLy8gYXJpYS1yb3dpbmRleCBpcyBhbHdheXMgKyAxLiBDaGVjayB2aXJ0dWFsIHNjcm9sbGVyIHVwZGF0ZUFyaWFSb3dJbmRleGVzIG1ldGhvZC5cbiAgICAgICAgICBjb25zdCByb3dJbmRleCA9IE51bWJlcihjZWxsQ29vcmRzLmFyaWFSb3dJbmRleCkgLSAxO1xuXG4gICAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsLnNjcm9sbFRvSW5kZXgocm93SW5kZXgpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKCFoYXNWaXJ0dWFsU2Nyb2xsKSB7XG4gICAgICB0aGlzLnJlc2l6ZU9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgIHRoaXMuX3ZpcnR1YWxTY3JvbGxTdWJzY3JpcHRpb25zLmZvckVhY2goKHN1YjogU3Vic2NyaXB0aW9uKSA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gICAgICB0aGlzLl92aXJ0dWFsU2Nyb2xsU3Vic2NyaXB0aW9ucyA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlUmVzaXplQ2hhbmdlcyhlbnRyaWVzOiBSZXNpemVPYnNlcnZlckVudHJ5W10pIHtcbiAgICBjb25zdCByb3dzV3JhcHBlciA9IHRoaXMucm93c1dyYXBwZXIubmF0aXZlRWxlbWVudDtcblxuICAgIGZvciAoY29uc3QgZW50cnkgb2YgZW50cmllcykge1xuICAgICAgaWYgKGVudHJ5LnRhcmdldCA9PT0gdGhpcy5jb250ZW50V3JhcHBlci5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuY2FjaGVkQ29udGVudEhlaWdodCA9IGVudHJ5LmNvbnRlbnRSZWN0LmhlaWdodDtcbiAgICAgIH1cbiAgICAgIGlmIChlbnRyeS50YXJnZXQgPT09IHJvd3NXcmFwcGVyKSB7XG4gICAgICAgIHRoaXMuY2FjaGVkUm93c0hlaWdodCA9IGVudHJ5LmNvbnRlbnRSZWN0LmhlaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzY3JvbGxDbGFzcyA9ICdkYXRhZ3JpZC1zY3JvbGxiYXItdmlzaWJsZSc7XG5cbiAgICBpZiAodGhpcy5jYWNoZWRSb3dzSGVpZ2h0ID4gdGhpcy5jYWNoZWRDb250ZW50SGVpZ2h0KSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHJvd3NXcmFwcGVyLCBzY3JvbGxDbGFzcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3Mocm93c1dyYXBwZXIsIHNjcm9sbENsYXNzKTtcbiAgICB9XG4gIH1cbn1cbiIsIjwhLS1cbiAgfiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAgfiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gIH4gVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAgfiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gIC0tPlxuXG48bmctY29udGVudCBzZWxlY3Q9XCJjbHItZGctYWN0aW9uLWJhclwiPjwvbmctY29udGVudD5cbjxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1vdXRlci13cmFwcGVyXCI+XG4gIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1pbm5lci13cmFwcGVyXCI+XG4gICAgPGRpdiBjbGFzcz1cImRhdGFncmlkXCIgI2RhdGFncmlkIFthdHRyLmFyaWEtaGlkZGVuXT1cImRldGFpbFNlcnZpY2UuaXNPcGVuID8gdHJ1ZSA6IG51bGxcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC10YWJsZS13cmFwcGVyXCI+XG4gICAgICAgIDxkaXYgcm9sZT1cImdyaWRcIiBjbGFzcz1cImRhdGFncmlkLXRhYmxlXCIgdGFiaW5kZXg9XCItMVwiICNkYXRhZ3JpZFRhYmxlPlxuICAgICAgICAgIDxkaXYgcm9sZT1cInJvd2dyb3VwXCIgY2xhc3M9XCJkYXRhZ3JpZC1oZWFkZXJcIiAjZGF0YWdyaWRIZWFkZXI+XG4gICAgICAgICAgICA8ZGl2IHJvbGU9XCJyb3dcIiBjbGFzcz1cImRhdGFncmlkLXJvd1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtcm93LW1hc3RlciBkYXRhZ3JpZC1yb3ctZmxleFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1yb3ctc3RpY2t5XCI+XG4gICAgICAgICAgICAgICAgICA8IS0taGVhZGVyIGZvciBkYXRhZ3JpZCB3aGVyZSB5b3UgY2FuIHNlbGVjdCBtdWx0aXBsZSByb3dzIC0tPlxuICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAjc3RpY2t5SGVhZGVyXG4gICAgICAgICAgICAgICAgICAgIHJvbGU9XCJjb2x1bW5oZWFkZXJcIlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImRhdGFncmlkLWNvbHVtbiBkYXRhZ3JpZC1zZWxlY3QgZGF0YWdyaWQtZml4ZWQtY29sdW1uXCJcbiAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJzZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9PT0gU0VMRUNUSU9OX1RZUEUuTXVsdGlcIlxuICAgICAgICAgICAgICAgICAgICAoa2V5ZG93bi5zcGFjZSk9XCJ0b2dnbGVBbGxTZWxlY3RlZCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiAqbmdJZj1cIiF2aXJ0dWFsU2Nyb2xsIHx8IGN1c3RvbVNlbGVjdEFsbEVuYWJsZWRcIiBjbGFzcz1cImNsci1jaGVja2JveC13cmFwcGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPCEtLSBXZSBuZWVkIHRvIG1vdmUgZm9jdXMgYW5kIHNwYWNlLWtleSBoYW5kbGluZyB0byB0aGUgcGFyZW50IGJlY2F1c2Ugb2Yga2V5Ym9hcmQgYXJyb3cga2V5IG5hdmlnYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB3aGljaCBpcyBub3QgYWJsZSB0byB0cmFuc2ZlciBmb2N1cyBkaXJlY3RseSBvbiB0aGUgaW5wdXQgd2hlbiBmb2N1c2VkIHdpdGggdGhlIHRhYiBrZXkgLS0+XG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAjc2VsZWN0QWxsQ2hlY2tib3hcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbaWRdPVwic2VsZWN0QWxsSWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XCJhbGxTZWxlY3RlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy5zZWxlY3RBbGxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8IS0tIFVzYWdlIG9mIGNsYXNzIGNsci1jb2wtbnVsbCBoZXJlIHByZXZlbnRzIGNsci1jb2wtKiBjbGFzc2VzIGZyb20gYmVpbmcgYWRkZWQgd2hlbiBhIGRhdGFncmlkIGlzIHdyYXBwZWQgaW5zaWRlIGNsckZvcm0gLS0+XG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIFtmb3JdPVwic2VsZWN0QWxsSWRcIiBjbGFzcz1cImNsci1jb250cm9sLWxhYmVsIGNsci1jb2wtbnVsbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHItc3Itb25seVwiPnt7Y29tbW9uU3RyaW5ncy5rZXlzLnNlbGVjdEFsbH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4tc2VwYXJhdG9yXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwhLS0gaGVhZGVyIGZvciBkYXRhZ3JpZCB3aGVyZSB5b3UgY2FuIHNlbGVjdCBvbmUgcm93IG9ubHkgLS0+XG4gICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICNzdGlja3lIZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgcm9sZT1cImNvbHVtbmhlYWRlclwiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uIGRhdGFncmlkLXNlbGVjdCBkYXRhZ3JpZC1maXhlZC1jb2x1bW5cIlxuICAgICAgICAgICAgICAgICAgICAqbmdJZj1cInNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID09PSBTRUxFQ1RJT05fVFlQRS5TaW5nbGVcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57e2NsckRnU2luZ2xlU2VsZWN0aW9uQXJpYUxhYmVsfX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLWNvbHVtbi1zZXBhcmF0b3JcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPCEtLSBoZWFkZXIgZm9yIHNpbmdsZSByb3cgYWN0aW9uOyBvbmx5IGRpc3BsYXlUeXBlIGlmIHdlIGhhdmUgYXQgbGVhc3Qgb25lIGFjdGlvbmFibGUgcm93IGluIGRhdGFncmlkIC0tPlxuICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAjc3RpY2t5SGVhZGVyXG4gICAgICAgICAgICAgICAgICAgIHJvbGU9XCJjb2x1bW5oZWFkZXJcIlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImRhdGFncmlkLWNvbHVtbiBkYXRhZ3JpZC1yb3ctYWN0aW9ucyBkYXRhZ3JpZC1maXhlZC1jb2x1bW5cIlxuICAgICAgICAgICAgICAgICAgICAqbmdJZj1cInJvd0FjdGlvblNlcnZpY2UuaGFzQWN0aW9uYWJsZVJvd1wiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjbHItc3Itb25seVwiPnt7Y2xyRGdTaW5nbGVBY3Rpb25hYmxlQXJpYUxhYmVsfX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLWNvbHVtbi1zZXBhcmF0b3JcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPCEtLSBoZWFkZXIgZm9yIGNhcmV0czsgb25seSBkaXNwbGF5VHlwZSBpZiB3ZSBoYXZlIGF0IGxlYXN0IG9uZSBleHBhbmRhYmxlIHJvdyBpbiBkYXRhZ3JpZCAtLT5cbiAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgI3N0aWNreUhlYWRlclxuICAgICAgICAgICAgICAgICAgICByb2xlPVwiY29sdW1uaGVhZGVyXCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4gZGF0YWdyaWQtZXhwYW5kYWJsZS1jYXJldCBkYXRhZ3JpZC1maXhlZC1jb2x1bW5cIlxuICAgICAgICAgICAgICAgICAgICAqbmdJZj1cImV4cGFuZGFibGVSb3dzLmhhc0V4cGFuZGFibGVSb3cgfHwgZGV0YWlsU2VydmljZS5lbmFibGVkXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNsci1zci1vbmx5XCI+e3tjbHJEZXRhaWxFeHBhbmRhYmxlQXJpYUxhYmVsfX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLWNvbHVtbi1zZXBhcmF0b3JcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1yb3ctc2Nyb2xsYWJsZVwiPlxuICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAjcHJvamVjdGVkRGlzcGxheUNvbHVtbnM+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiAqbmdJZj1cInZpcnR1YWxTY3JvbGxcIiBjbGFzcz1cImRhdGFncmlkLXJvdy1zdGlja3kgZGF0YWdyaWQtcm93LXN0aWNreS1zY3JvbGxcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW5cIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1jb250ZW50XCIgW2NsYXNzLmRhdGFncmlkLWNvbnRlbnQtdmlydHVhbF09XCJ2aXJ0dWFsU2Nyb2xsXCIgI2NvbnRlbnRXcmFwcGVyPlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAqbmdJZj1cInZpcnR1YWxTY3JvbGxcIlxuICAgICAgICAgICAgICBjbGFzcz1cImRhdGFncmlkLWNvbnRlbnQtdmlydHVhbC1zcGFjZXJcIlxuICAgICAgICAgICAgICBbc3R5bGUuaGVpZ2h0XT1cInZpcnR1YWxTY3JvbGw/LnRvdGFsQ29udGVudEhlaWdodFwiXG4gICAgICAgICAgICA+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHJvbGU9XCJwcmVzZW50YXRpb25cIiAjcm93c1dyYXBwZXIgY2xhc3M9XCJkYXRhZ3JpZC1yb3dzXCI+XG4gICAgICAgICAgICAgIDxjbHItZGctcm93IGNsYXNzPVwiZGF0YWdyaWQtcm93LWxvYWRpbmdcIiAqbmdJZj1cImxvYWRpbmdNb3JlSXRlbXNcIj5cbiAgICAgICAgICAgICAgICA8Y2xyLWRnLWNlbGw+XG4gICAgICAgICAgICAgICAgICA8Y2xyLXNwaW5uZXIgY2xyTWVkaXVtPjwvY2xyLXNwaW5uZXI+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj57eyBjb21tb25TdHJpbmdzLmtleXMubG9hZGluZyB9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Nsci1kZy1jZWxsPlxuICAgICAgICAgICAgICA8L2Nsci1kZy1yb3c+XG5cbiAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAjZGlzcGxheWVkUm93cz48L25nLWNvbnRhaW5lcj5cblxuICAgICAgICAgICAgICA8Y2xyLWRnLXJvdyBjbGFzcz1cImRhdGFncmlkLXJvdy1sb2FkaW5nXCIgKm5nSWY9XCJsb2FkaW5nTW9yZUl0ZW1zXCI+XG4gICAgICAgICAgICAgICAgPGNsci1kZy1jZWxsPlxuICAgICAgICAgICAgICAgICAgPGNsci1zcGlubmVyIGNsck1lZGl1bT48L2Nsci1zcGlubmVyPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+e3sgY29tbW9uU3RyaW5ncy5rZXlzLmxvYWRpbmcgfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9jbHItZGctY2VsbD5cbiAgICAgICAgICAgICAgPC9jbHItZGctcm93PlxuXG4gICAgICAgICAgICAgIDwhLS0gQ3VzdG9tIHBsYWNlaG9sZGVyIG92ZXJyaWRlcyB0aGUgZGVmYXVsdCBlbXB0eSBvbmUgLS0+XG4gICAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1kZy1wbGFjZWhvbGRlclwiPjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgPGNsci1kZy1wbGFjZWhvbGRlciAqbmdJZj1cIiFwbGFjZWhvbGRlclwiPjwvY2xyLWRnLXBsYWNlaG9sZGVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWRnLWZvb3RlclwiPjwvbmctY29udGVudD5cbiAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtc3Bpbm5lclwiICpuZ0lmPVwibG9hZGluZ1wiPlxuICAgICAgPGNsci1zcGlubmVyIGNsck1lZGl1bT5Mb2FkaW5nPC9jbHItc3Bpbm5lcj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIDxuZy1jb250ZW50IHNlbGVjdD1cIltjbHJJZkRldGFpbF0sY2xyLWRnLWRldGFpbFwiPjwvbmctY29udGVudD5cbjwvZGl2PlxuXG48ZGl2IGNsYXNzPVwiZGF0YWdyaWQtY2FsY3VsYXRpb24tdGFibGVcIj5cbiAgPGRpdiBjbGFzcz1cImRhdGFncmlkLWNhbGN1bGF0aW9uLWhlYWRlclwiPlxuICAgIDxuZy1jb250YWluZXIgI3Byb2plY3RlZENhbGN1bGF0aW9uQ29sdW1ucz48L25nLWNvbnRhaW5lcj5cbiAgPC9kaXY+XG4gIDxuZy1jb250YWluZXIgI2NhbGN1bGF0aW9uUm93cz48L25nLWNvbnRhaW5lcj5cbjwvZGl2PlxuXG48bmctdGVtcGxhdGUgI2ZpeGVkQ29sdW1uVGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4gZGF0YWdyaWQtZml4ZWQtY29sdW1uXCI+PC9kaXY+XG48L25nLXRlbXBsYXRlPlxuIl19
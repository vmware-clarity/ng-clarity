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
        return this._virtualScroll.get(0);
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
    ngOnDestroy() {
        this._subscriptions.forEach((sub) => sub.unsubscribe());
        this._virtualScrollSubscriptions.forEach((sub) => sub.unsubscribe());
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
            this._virtualScrollSubscriptions.forEach((sub) => sub.unsubscribe());
            this._virtualScrollSubscriptions = [];
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
    ], queries: [{ propertyName: "iterator", first: true, predicate: ClrDatagridItems, descendants: true }, { propertyName: "placeholder", first: true, predicate: ClrDatagridPlaceholder, descendants: true }, { propertyName: "_virtualScroll", predicate: ClrDatagridVirtualScrollDirective }, { propertyName: "columns", predicate: ClrDatagridColumn }, { propertyName: "rows", predicate: ClrDatagridRow, emitDistinctChangesOnly: false }], viewQueries: [{ propertyName: "datagrid", first: true, predicate: ["datagrid"], descendants: true, read: ElementRef }, { propertyName: "datagridTable", first: true, predicate: ["datagridTable"], descendants: true, read: ElementRef }, { propertyName: "datagridHeader", first: true, predicate: ["datagridHeader"], descendants: true, read: ElementRef }, { propertyName: "contentWrapper", first: true, predicate: ["contentWrapper"], descendants: true, read: ElementRef }, { propertyName: "scrollableColumns", first: true, predicate: ["scrollableColumns"], descendants: true, read: ViewContainerRef }, { propertyName: "_projectedDisplayColumns", first: true, predicate: ["projectedDisplayColumns"], descendants: true, read: ViewContainerRef }, { propertyName: "_projectedCalculationColumns", first: true, predicate: ["projectedCalculationColumns"], descendants: true, read: ViewContainerRef }, { propertyName: "_displayedRows", first: true, predicate: ["displayedRows"], descendants: true, read: ViewContainerRef }, { propertyName: "_calculationRows", first: true, predicate: ["calculationRows"], descendants: true, read: ViewContainerRef }, { propertyName: "_fixedColumnTemplate", first: true, predicate: ["fixedColumnTemplate"], descendants: true }, { propertyName: "selectAllCheckbox", first: true, predicate: ["selectAllCheckbox"], descendants: true }, { propertyName: "stickyHeaders", predicate: ["stickyHeader"], descendants: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<ng-content select=\"clr-dg-action-bar\"></ng-content>\n<div class=\"datagrid-outer-wrapper\">\n  <div class=\"datagrid-inner-wrapper\">\n    <div class=\"datagrid\" #datagrid [attr.aria-hidden]=\"detailService.isOpen ? true : null\">\n      <div class=\"datagrid-table-wrapper\">\n        <div role=\"grid\" class=\"datagrid-table\" tabindex=\"-1\" #datagridTable>\n          <div role=\"rowgroup\" class=\"datagrid-header\" #datagridHeader>\n            <div role=\"row\" class=\"datagrid-row\">\n              <div class=\"datagrid-row-master datagrid-row-flex\">\n                <div class=\"datagrid-row-sticky\">\n                  <!--header for datagrid where you can select multiple rows -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    *ngIf=\"selection.selectionType === SELECTION_TYPE.Multi\"\n                    (keydown.space)=\"toggleAllSelected($event)\"\n                  >\n                    <div *ngIf=\"!virtualScroll || customSelectAllEnabled\" class=\"clr-checkbox-wrapper\">\n                      <!-- We need to move focus and space-key handling to the parent because of keyboard arrow key navigation,\n                           which is not able to transfer focus directly on the input when focused with the tab key -->\n                      <input\n                        #selectAllCheckbox\n                        type=\"checkbox\"\n                        [id]=\"selectAllId\"\n                        [(ngModel)]=\"allSelected\"\n                        [attr.aria-label]=\"commonStrings.keys.selectAll\"\n                        tabindex=\"-1\"\n                      />\n                      <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n                      <label [for]=\"selectAllId\" class=\"clr-control-label clr-col-null\">\n                        <span class=\"clr-sr-only\">{{commonStrings.keys.selectAll}}</span>\n                      </label>\n                    </div>\n\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for datagrid where you can select one row only -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    *ngIf=\"selection.selectionType === SELECTION_TYPE.Single\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleSelectionAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for single row action; only displayType if we have at least one actionable row in datagrid -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-row-actions datagrid-fixed-column\"\n                    *ngIf=\"rowActionService.hasActionableRow\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleActionableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for carets; only displayType if we have at least one expandable row in datagrid -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-expandable-caret datagrid-fixed-column\"\n                    *ngIf=\"expandableRows.hasExpandableRow || detailService.enabled\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDetailExpandableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                </div>\n                <div class=\"datagrid-row-scrollable\">\n                  <ng-container #projectedDisplayColumns></ng-container>\n                </div>\n                <div *ngIf=\"virtualScroll\" class=\"datagrid-row-sticky datagrid-row-sticky-scroll\">\n                  <div class=\"datagrid-column\"></div>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <div class=\"datagrid-content\" [class.datagrid-content-virtual]=\"virtualScroll\" #contentWrapper>\n            <div\n              *ngIf=\"virtualScroll\"\n              class=\"datagrid-content-virtual-spacer\"\n              [style.height]=\"virtualScroll?.totalContentHeight\"\n            ></div>\n            <div role=\"presentation\" class=\"datagrid-rows\">\n              <clr-dg-row class=\"datagrid-row-loading\" *ngIf=\"loadingMoreItems\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n\n              <ng-container #displayedRows></ng-container>\n\n              <clr-dg-row class=\"datagrid-row-loading\" *ngIf=\"loadingMoreItems\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n\n              <!-- Custom placeholder overrides the default empty one -->\n              <ng-content select=\"clr-dg-placeholder\"></ng-content>\n              <clr-dg-placeholder *ngIf=\"!placeholder\"></clr-dg-placeholder>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <ng-content select=\"clr-dg-footer\"></ng-content>\n    <div class=\"datagrid-spinner\" *ngIf=\"loading\">\n      <clr-spinner clrMedium>Loading</clr-spinner>\n    </div>\n  </div>\n  <ng-content select=\"[clrIfDetail],clr-dg-detail\"></ng-content>\n</div>\n\n<div class=\"datagrid-calculation-table\">\n  <div class=\"datagrid-calculation-header\">\n    <ng-container #projectedCalculationColumns></ng-container>\n  </div>\n  <ng-container #calculationRows></ng-container>\n</div>\n\n<ng-template #fixedColumnTemplate>\n  <div class=\"datagrid-column datagrid-fixed-column\"></div>\n</ng-template>\n", dependencies: [{ kind: "directive", type: i12.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i13.ClrLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i14.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i14.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i14.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i15.ClrSpinner, selector: "clr-spinner", inputs: ["clrInline", "clrInverse", "clrSmall", "clrMedium"] }, { kind: "component", type: i16.ClrDatagridCell, selector: "clr-dg-cell" }, { kind: "component", type: i17.ClrDatagridPlaceholder, selector: "clr-dg-placeholder" }, { kind: "component", type: i18.ClrDatagridRow, selector: "clr-dg-row", inputs: ["clrDgDetailDisabled", "clrDgDetailHidden", "clrDgSkeletonLoading", "clrDgItem", "clrDgSelectable", "clrDgSelected", "clrDgExpanded", "clrDgDetailOpenLabel", "clrDgDetailCloseLabel", "clrDgRowSelectionLabel"], outputs: ["clrDgSelectedChange", "clrDgExpandedChange"] }, { kind: "directive", type: i19.ClrDatagridSelectionCellDirective, selector: ".datagrid-select" }, { kind: "directive", type: i20.DatagridCellRenderer, selector: "clr-dg-cell" }, { kind: "directive", type: i21.DatagridRowRenderer, selector: "clr-dg-row" }, { kind: "directive", type: i22.ActionableOompaLoompa, selector: "clr-datagrid, clr-dg-row" }, { kind: "directive", type: i23.ExpandableOompaLoompa, selector: "clr-datagrid, clr-dg-row" }] });
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
                    }, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<ng-content select=\"clr-dg-action-bar\"></ng-content>\n<div class=\"datagrid-outer-wrapper\">\n  <div class=\"datagrid-inner-wrapper\">\n    <div class=\"datagrid\" #datagrid [attr.aria-hidden]=\"detailService.isOpen ? true : null\">\n      <div class=\"datagrid-table-wrapper\">\n        <div role=\"grid\" class=\"datagrid-table\" tabindex=\"-1\" #datagridTable>\n          <div role=\"rowgroup\" class=\"datagrid-header\" #datagridHeader>\n            <div role=\"row\" class=\"datagrid-row\">\n              <div class=\"datagrid-row-master datagrid-row-flex\">\n                <div class=\"datagrid-row-sticky\">\n                  <!--header for datagrid where you can select multiple rows -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    *ngIf=\"selection.selectionType === SELECTION_TYPE.Multi\"\n                    (keydown.space)=\"toggleAllSelected($event)\"\n                  >\n                    <div *ngIf=\"!virtualScroll || customSelectAllEnabled\" class=\"clr-checkbox-wrapper\">\n                      <!-- We need to move focus and space-key handling to the parent because of keyboard arrow key navigation,\n                           which is not able to transfer focus directly on the input when focused with the tab key -->\n                      <input\n                        #selectAllCheckbox\n                        type=\"checkbox\"\n                        [id]=\"selectAllId\"\n                        [(ngModel)]=\"allSelected\"\n                        [attr.aria-label]=\"commonStrings.keys.selectAll\"\n                        tabindex=\"-1\"\n                      />\n                      <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n                      <label [for]=\"selectAllId\" class=\"clr-control-label clr-col-null\">\n                        <span class=\"clr-sr-only\">{{commonStrings.keys.selectAll}}</span>\n                      </label>\n                    </div>\n\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for datagrid where you can select one row only -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    *ngIf=\"selection.selectionType === SELECTION_TYPE.Single\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleSelectionAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for single row action; only displayType if we have at least one actionable row in datagrid -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-row-actions datagrid-fixed-column\"\n                    *ngIf=\"rowActionService.hasActionableRow\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleActionableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for carets; only displayType if we have at least one expandable row in datagrid -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-expandable-caret datagrid-fixed-column\"\n                    *ngIf=\"expandableRows.hasExpandableRow || detailService.enabled\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDetailExpandableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                </div>\n                <div class=\"datagrid-row-scrollable\">\n                  <ng-container #projectedDisplayColumns></ng-container>\n                </div>\n                <div *ngIf=\"virtualScroll\" class=\"datagrid-row-sticky datagrid-row-sticky-scroll\">\n                  <div class=\"datagrid-column\"></div>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <div class=\"datagrid-content\" [class.datagrid-content-virtual]=\"virtualScroll\" #contentWrapper>\n            <div\n              *ngIf=\"virtualScroll\"\n              class=\"datagrid-content-virtual-spacer\"\n              [style.height]=\"virtualScroll?.totalContentHeight\"\n            ></div>\n            <div role=\"presentation\" class=\"datagrid-rows\">\n              <clr-dg-row class=\"datagrid-row-loading\" *ngIf=\"loadingMoreItems\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n\n              <ng-container #displayedRows></ng-container>\n\n              <clr-dg-row class=\"datagrid-row-loading\" *ngIf=\"loadingMoreItems\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n\n              <!-- Custom placeholder overrides the default empty one -->\n              <ng-content select=\"clr-dg-placeholder\"></ng-content>\n              <clr-dg-placeholder *ngIf=\"!placeholder\"></clr-dg-placeholder>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <ng-content select=\"clr-dg-footer\"></ng-content>\n    <div class=\"datagrid-spinner\" *ngIf=\"loading\">\n      <clr-spinner clrMedium>Loading</clr-spinner>\n    </div>\n  </div>\n  <ng-content select=\"[clrIfDetail],clr-dg-detail\"></ng-content>\n</div>\n\n<div class=\"datagrid-calculation-table\">\n  <div class=\"datagrid-calculation-header\">\n    <ng-container #projectedCalculationColumns></ng-container>\n  </div>\n  <ng-container #calculationRows></ng-container>\n</div>\n\n<ng-template #fixedColumnTemplate>\n  <div class=\"datagrid-column datagrid-fixed-column\"></div>\n</ng-template>\n" }]
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
                args: ['contentWrapper', { read: ElementRef }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2RhdGFncmlkLnRzIiwiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFHTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBR0wsTUFBTSxFQUlOLFNBQVMsRUFDVCxZQUFZLEVBQ1osZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHekQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN4RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFdkQs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bUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBSZW5kZXJlcjIsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDaGlsZHJlbixcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBjb21iaW5lTGF0ZXN0LCBmcm9tRXZlbnQsIG1lcmdlLCBvZiwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUsIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgdW5pcXVlSWRGYWN0b3J5IH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQtZ2VuZXJhdG9yL2lkLWdlbmVyYXRvci5zZXJ2aWNlJztcbmltcG9ydCB7IENsckRhdGFncmlkQ29sdW1uIH0gZnJvbSAnLi9kYXRhZ3JpZC1jb2x1bW4nO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRJdGVtcyB9IGZyb20gJy4vZGF0YWdyaWQtaXRlbXMnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRQbGFjZWhvbGRlciB9IGZyb20gJy4vZGF0YWdyaWQtcGxhY2Vob2xkZXInO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRSb3cgfSBmcm9tICcuL2RhdGFncmlkLXJvdyc7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZFZpcnR1YWxTY3JvbGxEaXJlY3RpdmUgfSBmcm9tICcuL2RhdGFncmlkLXZpcnR1YWwtc2Nyb2xsLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEYXRhZ3JpZERpc3BsYXlNb2RlIH0gZnJvbSAnLi9lbnVtcy9kaXNwbGF5LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBTZWxlY3Rpb25UeXBlIH0gZnJvbSAnLi9lbnVtcy9zZWxlY3Rpb24tdHlwZSc7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZFN0YXRlSW50ZXJmYWNlIH0gZnJvbSAnLi9pbnRlcmZhY2VzL3N0YXRlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDb2x1bW5zU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2NvbHVtbnMuc2VydmljZSc7XG5pbXBvcnQgeyBEZXRhaWxTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGV0YWlsLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGlzcGxheU1vZGVTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGlzcGxheS1tb2RlLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmlsdGVyc1Byb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvZmlsdGVycyc7XG5pbXBvcnQgeyBFeHBhbmRhYmxlUm93c0NvdW50IH0gZnJvbSAnLi9wcm92aWRlcnMvZ2xvYmFsLWV4cGFuZGFibGUtcm93cyc7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZEl0ZW1zVHJhY2tCeUZ1bmN0aW9uLCBJdGVtcyB9IGZyb20gJy4vcHJvdmlkZXJzL2l0ZW1zJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICcuL3Byb3ZpZGVycy9wYWdlJztcbmltcG9ydCB7IFJvd0FjdGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9yb3ctYWN0aW9uLXNlcnZpY2UnO1xuaW1wb3J0IHsgU2VsZWN0aW9uIH0gZnJvbSAnLi9wcm92aWRlcnMvc2VsZWN0aW9uJztcbmltcG9ydCB7IFNvcnQgfSBmcm9tICcuL3Byb3ZpZGVycy9zb3J0JztcbmltcG9ydCB7IFN0YXRlRGVib3VuY2VyIH0gZnJvbSAnLi9wcm92aWRlcnMvc3RhdGUtZGVib3VuY2VyLnByb3ZpZGVyJztcbmltcG9ydCB7IFN0YXRlUHJvdmlkZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9zdGF0ZS5wcm92aWRlcic7XG5pbXBvcnQgeyBUYWJsZVNpemVTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvdGFibGUtc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7IERhdGFncmlkUmVuZGVyT3JnYW5pemVyIH0gZnJvbSAnLi9yZW5kZXIvcmVuZGVyLW9yZ2FuaXplcic7XG5pbXBvcnQgeyBDZWxsQ29vcmRpbmF0ZXMsIEtleU5hdmlnYXRpb25HcmlkQ29udHJvbGxlciB9IGZyb20gJy4vdXRpbHMva2V5LW5hdmlnYXRpb24tZ3JpZC5jb250cm9sbGVyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWRhdGFncmlkJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2RhdGFncmlkLmh0bWwnLFxuICBwcm92aWRlcnM6IFtcbiAgICBTZWxlY3Rpb24sXG4gICAgU29ydCxcbiAgICBGaWx0ZXJzUHJvdmlkZXIsXG4gICAgUGFnZSxcbiAgICBJdGVtcyxcbiAgICBEYXRhZ3JpZFJlbmRlck9yZ2FuaXplcixcbiAgICBSb3dBY3Rpb25TZXJ2aWNlLFxuICAgIEV4cGFuZGFibGVSb3dzQ291bnQsXG4gICAgU3RhdGVEZWJvdW5jZXIsXG4gICAgRGV0YWlsU2VydmljZSxcbiAgICBTdGF0ZVByb3ZpZGVyLFxuICAgIFRhYmxlU2l6ZVNlcnZpY2UsXG4gICAgQ29sdW1uc1NlcnZpY2UsXG4gICAgRGlzcGxheU1vZGVTZXJ2aWNlLFxuICAgIEtleU5hdmlnYXRpb25HcmlkQ29udHJvbGxlcixcbiAgXSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuZGF0YWdyaWQtaG9zdF0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5kYXRhZ3JpZC1kZXRhaWwtb3Blbl0nOiAnZGV0YWlsU2VydmljZS5pc09wZW4nLFxuICAgICdbY2xhc3MuZGF0YWdyaWQtdmlydHVhbC1zY3JvbGxdJzogJyEhdmlydHVhbFNjcm9sbCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsckRhdGFncmlkPFQgPSBhbnk+IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KCdjbHJMb2FkaW5nTW9yZUl0ZW1zJykgbG9hZGluZ01vcmVJdGVtczogYm9vbGVhbjtcblxuICBASW5wdXQoKSBjbHJEZ1NpbmdsZVNlbGVjdGlvbkFyaWFMYWJlbDogc3RyaW5nID0gdGhpcy5jb21tb25TdHJpbmdzLmtleXMuc2luZ2xlU2VsZWN0aW9uQXJpYUxhYmVsO1xuICBASW5wdXQoKSBjbHJEZ1NpbmdsZUFjdGlvbmFibGVBcmlhTGFiZWw6IHN0cmluZyA9IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLnNpbmdsZUFjdGlvbmFibGVBcmlhTGFiZWw7XG4gIEBJbnB1dCgpIGNsckRldGFpbEV4cGFuZGFibGVBcmlhTGFiZWw6IHN0cmluZyA9IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmRldGFpbEV4cGFuZGFibGVBcmlhTGFiZWw7XG5cbiAgLy8gQWxsb3dzIGRpc2FibGluZyBvZiB0aGUgYXV0byBmb2N1cyBvbiBwYWdlL3N0YXRlIGNoYW5nZXMgKGV4Y2x1ZGVzIGZvY3VzIG1hbmFnZW1lbnQgaW5zaWRlIG9mIHBvcHVwcylcbiAgQElucHV0KCkgY2xyRGdEaXNhYmxlUGFnZUZvY3VzID0gZmFsc2U7XG5cbiAgQE91dHB1dCgnY2xyRGdTZWxlY3RlZENoYW5nZScpIHNlbGVjdGVkQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8VFtdPihmYWxzZSk7XG4gIEBPdXRwdXQoJ2NsckRnU2luZ2xlU2VsZWN0ZWRDaGFuZ2UnKSBzaW5nbGVTZWxlY3RlZENoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPFQ+KGZhbHNlKTtcblxuICAvKipcbiAgICogT3V0cHV0IGVtaXR0ZWQgd2hlbmV2ZXIgdGhlIGRhdGEgbmVlZHMgdG8gYmUgcmVmcmVzaGVkLCBiYXNlZCBvbiB1c2VyIGFjdGlvbiBvciBleHRlcm5hbCBvbmVzXG4gICAqL1xuICBAT3V0cHV0KCdjbHJEZ1JlZnJlc2gnKSByZWZyZXNoID0gbmV3IEV2ZW50RW1pdHRlcjxDbHJEYXRhZ3JpZFN0YXRlSW50ZXJmYWNlPFQ+PihmYWxzZSk7XG5cbiAgLyoqXG4gICAqIFRoZSBhcHBsaWNhdGlvbiBjYW4gcHJvdmlkZSBjdXN0b20gc2VsZWN0IGFsbCBsb2dpYy5cbiAgICovXG4gIEBJbnB1dCgnY2xyRGdDdXN0b21TZWxlY3RBbGxFbmFibGVkJykgY3VzdG9tU2VsZWN0QWxsRW5hYmxlZCA9IGZhbHNlO1xuICBAT3V0cHV0KCdjbHJEZ0N1c3RvbVNlbGVjdEFsbCcpIGN1c3RvbVNlbGVjdEFsbCA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAvKipcbiAgICogRXhwb3NlIHZpcnR1YWwgc2Nyb2xsIGRpcmVjdGl2ZSBmb3IgYXBwbGljYXRpb25zIHRvIGFjY2VzcyBpdHMgcHVibGljIG1ldGhvZHNcbiAgICovXG4gIEBDb250ZW50Q2hpbGRyZW4oQ2xyRGF0YWdyaWRWaXJ0dWFsU2Nyb2xsRGlyZWN0aXZlKSBfdmlydHVhbFNjcm9sbDogUXVlcnlMaXN0PENsckRhdGFncmlkVmlydHVhbFNjcm9sbERpcmVjdGl2ZTxhbnk+PjtcbiAgLyoqXG4gICAqIFdlIGdyYWIgdGhlIHNtYXJ0IGl0ZXJhdG9yIGZyb20gcHJvamVjdGVkIGNvbnRlbnRcbiAgICovXG4gIEBDb250ZW50Q2hpbGQoQ2xyRGF0YWdyaWRJdGVtcykgaXRlcmF0b3I6IENsckRhdGFncmlkSXRlbXM8VD47XG5cbiAgLyoqXG4gICAqIEN1c3RvbSBwbGFjZWhvbGRlciBkZXRlY3Rpb25cbiAgICovXG4gIEBDb250ZW50Q2hpbGQoQ2xyRGF0YWdyaWRQbGFjZWhvbGRlcikgcGxhY2Vob2xkZXI6IENsckRhdGFncmlkUGxhY2Vob2xkZXI8VD47XG5cbiAgLyoqXG4gICAqIEhpZGVhYmxlIENvbHVtbiBkYXRhIHNvdXJjZSAvIGRldGVjdGlvbi5cbiAgICovXG4gIEBDb250ZW50Q2hpbGRyZW4oQ2xyRGF0YWdyaWRDb2x1bW4pIGNvbHVtbnM6IFF1ZXJ5TGlzdDxDbHJEYXRhZ3JpZENvbHVtbjxUPj47XG5cbiAgLyoqXG4gICAqIFdoZW4gdGhlIGRhdGFncmlkIGlzIHVzZXItbWFuYWdlZCB3aXRob3V0IHRoZSBzbWFydCBpdGVyYXRvciwgd2UgZ2V0IHRoZSBpdGVtcyBkaXNwbGF5ZWRcbiAgICogYnkgcXVlcnlpbmcgdGhlIHByb2plY3RlZCBjb250ZW50LiBUaGlzIGlzIG5lZWRlZCB0byBrZWVwIHRyYWNrIG9mIHRoZSBtb2RlbHMgY3VycmVudGx5XG4gICAqIGRpc3BsYXllZCwgdHlwaWNhbGx5IGZvciBzZWxlY3Rpb24uXG4gICAqL1xuICBAQ29udGVudENoaWxkcmVuKENsckRhdGFncmlkUm93LCB7IGVtaXREaXN0aW5jdENoYW5nZXNPbmx5OiBmYWxzZSB9KSByb3dzOiBRdWVyeUxpc3Q8Q2xyRGF0YWdyaWRSb3c8VD4+O1xuXG4gIEBWaWV3Q2hpbGQoJ2RhdGFncmlkJywgeyByZWFkOiBFbGVtZW50UmVmIH0pIGRhdGFncmlkOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgnZGF0YWdyaWRUYWJsZScsIHsgcmVhZDogRWxlbWVudFJlZiB9KSBkYXRhZ3JpZFRhYmxlOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgnZGF0YWdyaWRIZWFkZXInLCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSkgZGF0YWdyaWRIZWFkZXI6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdjb250ZW50V3JhcHBlcicsIHsgcmVhZDogRWxlbWVudFJlZiB9KSBjb250ZW50V3JhcHBlcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ3Njcm9sbGFibGVDb2x1bW5zJywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmIH0pIHNjcm9sbGFibGVDb2x1bW5zOiBWaWV3Q29udGFpbmVyUmVmO1xuICBAVmlld0NoaWxkKCdwcm9qZWN0ZWREaXNwbGF5Q29sdW1ucycsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSBfcHJvamVjdGVkRGlzcGxheUNvbHVtbnM6IFZpZXdDb250YWluZXJSZWY7XG4gIEBWaWV3Q2hpbGQoJ3Byb2plY3RlZENhbGN1bGF0aW9uQ29sdW1ucycsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSBfcHJvamVjdGVkQ2FsY3VsYXRpb25Db2x1bW5zOiBWaWV3Q29udGFpbmVyUmVmO1xuICBAVmlld0NoaWxkKCdkaXNwbGF5ZWRSb3dzJywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmIH0pIF9kaXNwbGF5ZWRSb3dzOiBWaWV3Q29udGFpbmVyUmVmO1xuICBAVmlld0NoaWxkKCdjYWxjdWxhdGlvblJvd3MnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSkgX2NhbGN1bGF0aW9uUm93czogVmlld0NvbnRhaW5lclJlZjtcbiAgQFZpZXdDaGlsZCgnZml4ZWRDb2x1bW5UZW1wbGF0ZScpIF9maXhlZENvbHVtblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAVmlld0NoaWxkcmVuKCdzdGlja3lIZWFkZXInLCB7IGVtaXREaXN0aW5jdENoYW5nZXNPbmx5OiB0cnVlIH0pIHN0aWNreUhlYWRlcnM6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcblxuICBzZWxlY3RBbGxJZDogc3RyaW5nO1xuICBhY3RpdmVDZWxsQ29vcmRzOiBDZWxsQ29vcmRpbmF0ZXM7XG5cbiAgLyogcmVmZXJlbmNlIHRvIHRoZSBlbnVtIHNvIHRoYXQgdGVtcGxhdGUgY2FuIGFjY2VzcyAqL1xuICBTRUxFQ1RJT05fVFlQRSA9IFNlbGVjdGlvblR5cGU7XG5cbiAgQFZpZXdDaGlsZCgnc2VsZWN0QWxsQ2hlY2tib3gnKSBwcml2YXRlIHNlbGVjdEFsbENoZWNrYm94OiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+O1xuXG4gIC8qKlxuICAgKiBTdWJzY3JpcHRpb25zIHRvIGFsbCB0aGUgc2VydmljZXMgYW5kIHF1ZXJpZXMgY2hhbmdlc1xuICAgKi9cbiAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcbiAgcHJpdmF0ZSBfdmlydHVhbFNjcm9sbFN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBvcmdhbml6ZXI6IERhdGFncmlkUmVuZGVyT3JnYW5pemVyLFxuICAgIHB1YmxpYyBpdGVtczogSXRlbXM8VD4sXG4gICAgcHVibGljIGV4cGFuZGFibGVSb3dzOiBFeHBhbmRhYmxlUm93c0NvdW50LFxuICAgIHB1YmxpYyBzZWxlY3Rpb246IFNlbGVjdGlvbjxUPixcbiAgICBwdWJsaWMgcm93QWN0aW9uU2VydmljZTogUm93QWN0aW9uU2VydmljZSxcbiAgICBwcml2YXRlIHN0YXRlUHJvdmlkZXI6IFN0YXRlUHJvdmlkZXI8VD4sXG4gICAgcHJpdmF0ZSBkaXNwbGF5TW9kZTogRGlzcGxheU1vZGVTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgZGV0YWlsU2VydmljZTogRGV0YWlsU2VydmljZSxcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBhbnksXG4gICAgcHVibGljIGVsOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIHBhZ2U6IFBhZ2UsXG4gICAgcHVibGljIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlLFxuICAgIHB1YmxpYyBrZXlOYXZpZ2F0aW9uOiBLZXlOYXZpZ2F0aW9uR3JpZENvbnRyb2xsZXIsXG4gICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgY29uc3QgZGF0YWdyaWRJZCA9IHVuaXF1ZUlkRmFjdG9yeSgpO1xuXG4gICAgdGhpcy5zZWxlY3RBbGxJZCA9ICdjbHItZGctc2VsZWN0LWFsbC0nICsgZGF0YWdyaWRJZDtcbiAgICBkZXRhaWxTZXJ2aWNlLmlkID0gZGF0YWdyaWRJZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGcmVlemVzIHRoZSBkYXRhZ3JpZCB3aGlsZSBkYXRhIGlzIGxvYWRpbmdcbiAgICovXG4gIEBJbnB1dCgnY2xyRGdMb2FkaW5nJylcbiAgZ2V0IGxvYWRpbmcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMubG9hZGluZztcbiAgfVxuICBzZXQgbG9hZGluZyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuaXRlbXMubG9hZGluZyA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFycmF5IG9mIGFsbCBzZWxlY3RlZCBpdGVtc1xuICAgKi9cbiAgQElucHV0KCdjbHJEZ1NlbGVjdGVkJylcbiAgc2V0IHNlbGVjdGVkKHZhbHVlOiBUW10gfCB1bmRlZmluZWQpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPSBTZWxlY3Rpb25UeXBlLk11bHRpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID0gU2VsZWN0aW9uVHlwZS5Ob25lO1xuICAgIH1cbiAgICB0aGlzLnNlbGVjdGlvbi51cGRhdGVDdXJyZW50KHZhbHVlLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0ZWQgaXRlbSBpbiBzaW5nbGUtc2VsZWN0IG1vZGVcbiAgICovXG4gIEBJbnB1dCgnY2xyRGdTaW5nbGVTZWxlY3RlZCcpXG4gIHNldCBzaW5nbGVTZWxlY3RlZCh2YWx1ZTogVCkge1xuICAgIHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPSBTZWxlY3Rpb25UeXBlLlNpbmdsZTtcbiAgICAvLyB0aGUgY2xyRGdTaW5nbGVTZWxlY3RlZCBpcyB1cGRhdGVkIGluIG9uZSBvZiB0d28gY2FzZXM6XG4gICAgLy8gMS4gYW4gZXhwbGljaXQgdmFsdWUgaXMgcGFzc2VkXG4gICAgLy8gMi4gaXMgYmVpbmcgc2V0IHRvIG51bGwgb3IgdW5kZWZpbmVkLCB3aGVyZSBwcmV2aW91c2x5IGl0IGhhZCBhIHZhbHVlXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbi5jdXJyZW50U2luZ2xlID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdGlvbi5jdXJyZW50U2luZ2xlKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbi5jdXJyZW50U2luZ2xlID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgY2xyRGdQcmVzZXJ2ZVNlbGVjdGlvbihzdGF0ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2VsZWN0aW9uLnByZXNlcnZlU2VsZWN0aW9uID0gc3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgc2luY2UgMi4wLCByZW1vdmUgaW4gMy4wXG4gICAqXG4gICAqIFNlbGVjdGlvbi9EZXNlbGVjdGlvbiBvbiByb3cgY2xpY2sgbW9kZVxuICAgKi9cbiAgQElucHV0KCdjbHJEZ1Jvd1NlbGVjdGlvbicpXG4gIHNldCByb3dTZWxlY3Rpb25Nb2RlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZWxlY3Rpb24ucm93U2VsZWN0aW9uTW9kZSA9IHZhbHVlO1xuICB9XG5cbiAgQElucHV0KCdjbHJEZ0l0ZW1zVHJhY2tCeScpXG4gIHNldCB0cmFja0J5KHZhbHVlOiBDbHJEYXRhZ3JpZEl0ZW1zVHJhY2tCeUZ1bmN0aW9uPFQ+KSB7XG4gICAgdGhpcy5pdGVtcy50cmFja0J5ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIGFsbCBjdXJyZW50bHkgZGlzcGxheWVkIGl0ZW1zIGFyZSBzZWxlY3RlZFxuICAgKi9cbiAgZ2V0IGFsbFNlbGVjdGVkKCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbi5pc0FsbFNlbGVjdGVkKCk7XG4gIH1cbiAgc2V0IGFsbFNlbGVjdGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuY3VzdG9tU2VsZWN0QWxsRW5hYmxlZCkge1xuICAgICAgdGhpcy5jdXN0b21TZWxlY3RBbGwuZW1pdCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhpcyBpcyBhIHNldHRlciBidXQgd2UgaWdub3JlIHRoZSB2YWx1ZS5cbiAgICAgICAqIEl0J3Mgc3RyYW5nZSwgYnV0IGl0IGxldHMgdXMgaGF2ZSBhbiBpbmRldGVybWluYXRlIHN0YXRlIHdoZXJlIG9ubHlcbiAgICAgICAqIHNvbWUgb2YgdGhlIGl0ZW1zIGFyZSBzZWxlY3RlZC5cbiAgICAgICAqL1xuICAgICAgdGhpcy5zZWxlY3Rpb24udG9nZ2xlQWxsKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZpcnR1YWxTY3JvbGwoKTogQ2xyRGF0YWdyaWRWaXJ0dWFsU2Nyb2xsRGlyZWN0aXZlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl92aXJ0dWFsU2Nyb2xsLmdldCgwKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuaXRlbXMuc21hcnQpIHtcbiAgICAgIHRoaXMuaXRlbXMuYWxsID0gdGhpcy5yb3dzLm1hcCgocm93OiBDbHJEYXRhZ3JpZFJvdzxUPikgPT4gcm93Lml0ZW0pO1xuICAgIH1cblxuICAgIGNvbnN0IHJvd0l0ZW1zQ2hhbmdlcyA9IHRoaXMucm93cy5jaGFuZ2VzLnBpcGUoXG4gICAgICBzd2l0Y2hNYXAoKHJvd3M6IENsckRhdGFncmlkUm93PFQ+W10pID0+XG4gICAgICAgIG1lcmdlKFxuICAgICAgICAgIC8vIGltbWVkaWF0ZSB1cGRhdGVcbiAgICAgICAgICBvZihyb3dzLm1hcChyb3cgPT4gcm93Lml0ZW0pKSxcbiAgICAgICAgICAvLyBzdWJzZXF1ZW50IHVwZGF0ZXMgb25jZSBwZXIgdGlja1xuICAgICAgICAgIGNvbWJpbmVMYXRlc3Qocm93cy5tYXAocm93ID0+IHJvdy5pdGVtQ2hhbmdlcykpLnBpcGUoZGVib3VuY2VUaW1lKDApKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcblxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHJvd0l0ZW1zQ2hhbmdlcy5zdWJzY3JpYmUoYWxsID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLml0ZW1zLnNtYXJ0KSB7XG4gICAgICAgICAgdGhpcy5pdGVtcy5hbGwgPSBhbGw7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5fdmlydHVhbFNjcm9sbC5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMudG9nZ2xlVmlydHVhbFNjcm9sbFN1YnNjcmlwdGlvbnMoKTtcbiAgICAgIH0pLFxuICAgICAgdGhpcy5yb3dzLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgLy8gUmVtb3ZlIGFueSBwcm9qZWN0ZWQgcm93cyBmcm9tIHRoZSBkaXNwbGF5ZWRSb3dzIGNvbnRhaW5lclxuICAgICAgICAvLyBOZWNlc3Nhcnkgd2l0aCBJdnkgb2ZmLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3Ztd2FyZS9jbGFyaXR5L2lzc3Vlcy80NjkyXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl9kaXNwbGF5ZWRSb3dzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX2Rpc3BsYXllZFJvd3MuZ2V0KGkpLmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGxheWVkUm93cy5yZW1vdmUoaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgdGhpcy5fZGlzcGxheWVkUm93cy5pbnNlcnQocm93Ll92aWV3KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEZXRhaWxTdGF0ZSgpO1xuXG4gICAgICAgIC8vIHJldGFpbiBhY3RpdmUgY2VsbCB3aGVuIG5hdmlnYXRpbmcgd2l0aCBVcC9Eb3duIEFycm93cywgUGFnZVVwIGFuZCBQYWdlRG93biBidXR0b25zIGluIHZpcnR1YWwgc2Nyb2xsZXJcbiAgICAgICAgaWYgKHRoaXMudmlydHVhbFNjcm9sbCAmJiB0aGlzLmFjdGl2ZUNlbGxDb29yZHMpIHtcbiAgICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gQXJyYXkuZnJvbSh0aGlzLnJvd3MpLmZpbmQocm93ID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJvdy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdLmFyaWFSb3dJbmRleCA9PT0gdGhpcy5hY3RpdmVDZWxsQ29vcmRzLmFyaWFSb3dJbmRleDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIXJvdykge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGFjdGl2ZUNlbGwgPSByb3cuZWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMua2V5TmF2aWdhdGlvbi5jb25maWcua2V5R3JpZENlbGxzKVtcbiAgICAgICAgICAgICAgdGhpcy5hY3RpdmVDZWxsQ29vcmRzLnhcbiAgICAgICAgICAgIF0gYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgICAgIHRoaXMua2V5TmF2aWdhdGlvbi5zZXRBY3RpdmVDZWxsKGFjdGl2ZUNlbGwpO1xuICAgICAgICAgICAgdGhpcy5rZXlOYXZpZ2F0aW9uLmZvY3VzRWxlbWVudChhY3RpdmVDZWxsLCB7IHByZXZlbnRTY3JvbGw6IHRydWUgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdXIgc2V0dXAgaGFwcGVucyBpbiB0aGUgdmlldyBvZiBzb21lIG9mIG91ciBjb21wb25lbnRzLCBzbyB3ZSB3YWl0IGZvciBpdCB0byBiZSBkb25lIGJlZm9yZSBzdGFydGluZ1xuICAgKi9cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMua2V5TmF2aWdhdGlvbi5pbml0aWFsaXplS2V5R3JpZCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuXG4gICAgdGhpcy51cGRhdGVEZXRhaWxTdGF0ZSgpO1xuICAgIC8vIFRPRE86IGRldGVybWluZSBpZiB3ZSBjYW4gZ2V0IHJpZCBvZiBwcm92aWRlciB3aXJpbmcgaW4gdmlldyBpbml0IHNvIHRoYXQgc3Vic2NyaXB0aW9ucyBjYW4gYmUgZG9uZSBlYXJsaWVyXG4gICAgdGhpcy5yZWZyZXNoLmVtaXQodGhpcy5zdGF0ZVByb3ZpZGVyLnN0YXRlKTtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLnN0aWNreUhlYWRlcnMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5yZXNpemUoKSksXG4gICAgICB0aGlzLnN0YXRlUHJvdmlkZXIuY2hhbmdlLnN1YnNjcmliZShzdGF0ZSA9PiB0aGlzLnJlZnJlc2guZW1pdChzdGF0ZSkpLFxuICAgICAgdGhpcy5zZWxlY3Rpb24uY2hhbmdlLnN1YnNjcmliZShzID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuU2luZ2xlKSB7XG4gICAgICAgICAgdGhpcy5zaW5nbGVTZWxlY3RlZENoYW5nZWQuZW1pdChzIGFzIFQpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuTXVsdGkpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlZC5lbWl0KHMgYXMgVFtdKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICAvLyBSZWluaXRpYWxpemUgYXJyb3cga2V5IG5hdmlnYXRpb24gb24gcGFnZSBjaGFuZ2VzXG4gICAgICB0aGlzLnBhZ2UuY2hhbmdlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMua2V5TmF2aWdhdGlvbi5yZXNldEtleUdyaWQoKTtcbiAgICAgICAgaWYgKCF0aGlzLmNsckRnRGlzYWJsZVBhZ2VGb2N1cykge1xuICAgICAgICAgIHRoaXMuZGF0YWdyaWRUYWJsZS5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgLy8gQSBzdWJzY3JpcHRpb24gdGhhdCBsaXN0ZW5zIGZvciBkaXNwbGF5TW9kZSBjaGFuZ2VzIG9uIHRoZSBkYXRhZ3JpZFxuICAgICAgdGhpcy5kaXNwbGF5TW9kZS52aWV3LnN1YnNjcmliZSh2aWV3Q2hhbmdlID0+IHtcbiAgICAgICAgLy8gUmVtb3ZlIGFueSBwcm9qZWN0ZWQgY29sdW1ucyBmcm9tIHRoZSBwcm9qZWN0ZWREaXNwbGF5Q29sdW1ucyBjb250YWluZXJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX3Byb2plY3RlZERpc3BsYXlDb2x1bW5zLmxlbmd0aDsgaSA+IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMuX3Byb2plY3RlZERpc3BsYXlDb2x1bW5zLmRldGFjaCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlbW92ZSBhbnkgcHJvamVjdGVkIGNvbHVtbnMgZnJvbSB0aGUgcHJvamVjdGVkQ2FsY3VsYXRpb25Db2x1bW5zIGNvbnRhaW5lclxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fcHJvamVjdGVkQ2FsY3VsYXRpb25Db2x1bW5zLmxlbmd0aDsgaSA+IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMuX3Byb2plY3RlZENhbGN1bGF0aW9uQ29sdW1ucy5kZXRhY2goKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZW1vdmUgYW55IHByb2plY3RlZCByb3dzIGZyb20gdGhlIGNhbGN1bGF0aW9uUm93cyBjb250YWluZXJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX2NhbGN1bGF0aW9uUm93cy5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICB0aGlzLl9jYWxjdWxhdGlvblJvd3MuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVtb3ZlIGFueSBwcm9qZWN0ZWQgcm93cyBmcm9tIHRoZSBkaXNwbGF5ZWRSb3dzIGNvbnRhaW5lclxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fZGlzcGxheWVkUm93cy5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICB0aGlzLl9kaXNwbGF5ZWRSb3dzLmRldGFjaCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2aWV3Q2hhbmdlID09PSBEYXRhZ3JpZERpc3BsYXlNb2RlLkRJU1BMQVkpIHtcbiAgICAgICAgICAvLyBTZXQgc3RhdGUsIHN0eWxlIGZvciB0aGUgZGF0YWdyaWQgdG8gRElTUExBWSBhbmQgaW5zZXJ0IHJvdyAmIGNvbHVtbnMgaW50byBjb250YWluZXJzXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdkYXRhZ3JpZC1jYWxjdWxhdGUtbW9kZScpO1xuICAgICAgICAgIHRoaXMuY29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0ZWREaXNwbGF5Q29sdW1ucy5pbnNlcnQoY29sdW1uLl92aWV3KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGxheWVkUm93cy5pbnNlcnQocm93Ll92aWV3KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBTZXQgc3RhdGUsIHN0eWxlIGZvciB0aGUgZGF0YWdyaWQgdG8gQ0FMQ1VMQVRFIGFuZCBpbnNlcnQgcm93ICYgY29sdW1ucyBpbnRvIGNvbnRhaW5lcnNcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2RhdGFncmlkLWNhbGN1bGF0ZS1tb2RlJyk7XG4gICAgICAgICAgLy8gSW5zZXJ0cyBhIGZpeGVkIGNvbHVtbiBpZiBhbnkgb2YgdGhlc2UgY29uZGl0aW9ucyBhcmUgdHJ1ZS5cbiAgICAgICAgICBjb25zdCBmaXhlZENvbHVtbkNvbmRpdGlvbnMgPSBbXG4gICAgICAgICAgICB0aGlzLnJvd0FjdGlvblNlcnZpY2UuaGFzQWN0aW9uYWJsZVJvdyxcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgIT09IHRoaXMuU0VMRUNUSU9OX1RZUEUuTm9uZSxcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kYWJsZVJvd3MuaGFzRXhwYW5kYWJsZVJvdyB8fCB0aGlzLmRldGFpbFNlcnZpY2UuZW5hYmxlZCxcbiAgICAgICAgICBdO1xuICAgICAgICAgIGZpeGVkQ29sdW1uQ29uZGl0aW9uc1xuICAgICAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAgICAgLmZvckVhY2goKCkgPT5cbiAgICAgICAgICAgICAgdGhpcy5fcHJvamVjdGVkQ2FsY3VsYXRpb25Db2x1bW5zLmluc2VydCh0aGlzLl9maXhlZENvbHVtblRlbXBsYXRlLmNyZWF0ZUVtYmVkZGVkVmlldyhudWxsKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5jb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3RlZENhbGN1bGF0aW9uQ29sdW1ucy5pbnNlcnQoY29sdW1uLl92aWV3KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRpb25Sb3dzLmluc2VydChyb3cuX3ZpZXcpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG5cbiAgICAvLyBXZSBuZWVkIHRvIHByZXNlcnZlIHNoaWZ0IHN0YXRlLCBzbyBpdCBjYW4gYmUgdXNlZCBvbiBzZWxlY3Rpb24gY2hhbmdlLCByZWdhcmRsZXNzIG9mIHRoZSBpbnB1dCBldmVudFxuICAgIC8vIHRoYXQgdHJpZ2dlcmVkIHRoZSBjaGFuZ2UuIFRoaXMgaGVscHMgdXMgdG8gZWFzaWx5IHJlc29sdmUgdGhlIGsvYiBvbmx5IGNhc2UgdG9nZXRoZXIgd2l0aCB0aGUgbW91c2Ugc2VsZWN0aW9uIGNhc2UuXG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgZnJvbUV2ZW50KHRoaXMuZG9jdW1lbnQuYm9keSwgJ2tleWRvd24nKS5zdWJzY3JpYmUoKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ1NoaWZ0Jykge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc2hpZnRQcmVzc2VkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICBmcm9tRXZlbnQodGhpcy5kb2N1bWVudC5ib2R5LCAna2V5dXAnKS5zdWJzY3JpYmUoKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ1NoaWZ0Jykge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc2hpZnRQcmVzc2VkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuZm9yRWFjaCgoc3ViOiBTdWJzY3JpcHRpb24pID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcbiAgICB0aGlzLl92aXJ0dWFsU2Nyb2xsU3Vic2NyaXB0aW9ucy5mb3JFYWNoKChzdWI6IFN1YnNjcmlwdGlvbikgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgdG9nZ2xlQWxsU2VsZWN0ZWQoJGV2ZW50OiBhbnkpIHtcbiAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnNlbGVjdEFsbENoZWNrYm94Py5uYXRpdmVFbGVtZW50LmNsaWNrKCk7XG4gIH1cblxuICByZXNpemUoKTogdm9pZCB7XG4gICAgdGhpcy5vcmdhbml6ZXIucmVzaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHRoZSBzdGF0ZSBvZiBkZXRhaWwgcGFuZWwgYW5kIGlmIGl0J3Mgb3BlbmVkIHRoZW5cbiAgICogZmluZCB0aGUgbWF0Y2hpbmcgcm93IGFuZCB0cmlnZ2VyIHRoZSBkZXRhaWwgcGFuZWxcbiAgICovXG4gIHVwZGF0ZURldGFpbFN0YXRlKCkge1xuICAgIC8vIFRyeSB0byB1cGRhdGUgb25seSB3aGVuIHRoZXJlIGlzIHNvbWV0aGluZyBjYWNoZWQgYW5kIGl0cyBvcGVuLlxuICAgIGlmICh0aGlzLmRldGFpbFNlcnZpY2Uuc3RhdGUgJiYgdGhpcy5kZXRhaWxTZXJ2aWNlLmlzT3Blbikge1xuICAgICAgY29uc3Qgcm93ID0gdGhpcy5yb3dzLmZpbmQocm93ID0+IHRoaXMuaXRlbXMudHJhY2tCeShyb3cuaXRlbSkgPT09IHRoaXMuaXRlbXMudHJhY2tCeSh0aGlzLmRldGFpbFNlcnZpY2Uuc3RhdGUpKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBSZW9wZW4gdXBkYXRlZCByb3cgb3IgY2xvc2UgaXRcbiAgICAgICAqL1xuICAgICAgaWYgKHJvdykge1xuICAgICAgICB0aGlzLmRldGFpbFNlcnZpY2Uub3Blbihyb3cuaXRlbSwgcm93LmRldGFpbEJ1dHRvbi5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgLy8gYWx3YXlzIGtlZXAgb3BlbiB3aGVuIHZpcnR1YWwgc2Nyb2xsIGlzIGF2YWlsYWJsZSBvdGhlcndpc2UgY2xvc2UgaXRcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMudmlydHVhbFNjcm9sbCkge1xuICAgICAgICAvLyBVc2luZyBzZXRUaW1lb3V0IHRvIG1ha2Ugc3VyZSB0aGUgaW5uZXIgY3ljbGVzIGluIHJvd3MgYXJlIGRvbmVcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5kZXRhaWxTZXJ2aWNlLmNsb3NlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaWMgbWV0aG9kIHRvIHJlLXRyaWdnZXIgdGhlIGNvbXB1dGF0aW9uIG9mIGRpc3BsYXllZCBpdGVtcyBtYW51YWxseVxuICAgKi9cbiAgZGF0YUNoYW5nZWQoKSB7XG4gICAgdGhpcy5pdGVtcy5yZWZyZXNoKCk7XG4gIH1cblxuICBwcml2YXRlIHRvZ2dsZVZpcnR1YWxTY3JvbGxTdWJzY3JpcHRpb25zKCkge1xuICAgIGNvbnN0IGhhc1ZpcnR1YWxTY3JvbGwgPSAhIXRoaXMudmlydHVhbFNjcm9sbDtcblxuICAgIC8vIHRoZSB2aXJ0dWFsIHNjcm9sbCB3aWxsIGhhbmRsZSB0aGUgc2Nyb2xsaW5nXG4gICAgdGhpcy5rZXlOYXZpZ2F0aW9uLnByZXZlbnRTY3JvbGxPbkZvY3VzID0gaGFzVmlydHVhbFNjcm9sbDtcblxuICAgIGlmIChoYXNWaXJ0dWFsU2Nyb2xsICYmIHRoaXMuX3ZpcnR1YWxTY3JvbGxTdWJzY3JpcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5fdmlydHVhbFNjcm9sbFN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgZnJvbUV2ZW50KHRoaXMuY29udGVudFdyYXBwZXIubmF0aXZlRWxlbWVudCwgJ3Njcm9sbCcpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuZGF0YWdyaWRIZWFkZXIubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0ICE9PSB0aGlzLmNvbnRlbnRXcmFwcGVyLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdCkge1xuICAgICAgICAgICAgdGhpcy5kYXRhZ3JpZEhlYWRlci5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQgPSB0aGlzLmNvbnRlbnRXcmFwcGVyLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICBmcm9tRXZlbnQodGhpcy5kYXRhZ3JpZEhlYWRlci5uYXRpdmVFbGVtZW50LCAnc2Nyb2xsJykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5kYXRhZ3JpZEhlYWRlci5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQgIT09IHRoaXMuY29udGVudFdyYXBwZXIubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0KSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRXcmFwcGVyLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdCA9IHRoaXMuZGF0YWdyaWRIZWFkZXIubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgIHRoaXMua2V5TmF2aWdhdGlvbi5uZXh0Q2VsbENvb3Jkc0VtaXR0ZXIuc3Vic2NyaWJlKGNlbGxDb29yZHMgPT4ge1xuICAgICAgICAgIGlmICghY2VsbENvb3Jkcz8uYXJpYVJvd0luZGV4KSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUNlbGxDb29yZHMgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjZWxsQ29vcmRzLmFyaWFSb3dJbmRleCA9PT0gdGhpcy5hY3RpdmVDZWxsQ29vcmRzPy5hcmlhUm93SW5kZXgpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ2VsbENvb3JkcyA9IGNlbGxDb29yZHM7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5hY3RpdmVDZWxsQ29vcmRzID0gY2VsbENvb3JkcztcblxuICAgICAgICAgIC8vIGFyaWEtcm93aW5kZXggaXMgYWx3YXlzICsgMS4gQ2hlY2sgdmlydHVhbCBzY3JvbGxlciB1cGRhdGVBcmlhUm93SW5kZXhlcyBtZXRob2QuXG4gICAgICAgICAgY29uc3Qgcm93SW5kZXggPSBOdW1iZXIoY2VsbENvb3Jkcy5hcmlhUm93SW5kZXgpIC0gMTtcblxuICAgICAgICAgIHRoaXMudmlydHVhbFNjcm9sbC5zY3JvbGxUb0luZGV4KHJvd0luZGV4KTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICghaGFzVmlydHVhbFNjcm9sbCkge1xuICAgICAgdGhpcy5fdmlydHVhbFNjcm9sbFN1YnNjcmlwdGlvbnMuZm9yRWFjaCgoc3ViOiBTdWJzY3JpcHRpb24pID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcbiAgICAgIHRoaXMuX3ZpcnR1YWxTY3JvbGxTdWJzY3JpcHRpb25zID0gW107XG4gICAgfVxuICB9XG59XG4iLCI8IS0tXG4gIH4gQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gIH4gVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICB+IFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gIH4gVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICAtLT5cblxuPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWRnLWFjdGlvbi1iYXJcIj48L25nLWNvbnRlbnQ+XG48ZGl2IGNsYXNzPVwiZGF0YWdyaWQtb3V0ZXItd3JhcHBlclwiPlxuICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtaW5uZXItd3JhcHBlclwiPlxuICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZFwiICNkYXRhZ3JpZCBbYXR0ci5hcmlhLWhpZGRlbl09XCJkZXRhaWxTZXJ2aWNlLmlzT3BlbiA/IHRydWUgOiBudWxsXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtdGFibGUtd3JhcHBlclwiPlxuICAgICAgICA8ZGl2IHJvbGU9XCJncmlkXCIgY2xhc3M9XCJkYXRhZ3JpZC10YWJsZVwiIHRhYmluZGV4PVwiLTFcIiAjZGF0YWdyaWRUYWJsZT5cbiAgICAgICAgICA8ZGl2IHJvbGU9XCJyb3dncm91cFwiIGNsYXNzPVwiZGF0YWdyaWQtaGVhZGVyXCIgI2RhdGFncmlkSGVhZGVyPlxuICAgICAgICAgICAgPGRpdiByb2xlPVwicm93XCIgY2xhc3M9XCJkYXRhZ3JpZC1yb3dcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLXJvdy1tYXN0ZXIgZGF0YWdyaWQtcm93LWZsZXhcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtcm93LXN0aWNreVwiPlxuICAgICAgICAgICAgICAgICAgPCEtLWhlYWRlciBmb3IgZGF0YWdyaWQgd2hlcmUgeW91IGNhbiBzZWxlY3QgbXVsdGlwbGUgcm93cyAtLT5cbiAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgI3N0aWNreUhlYWRlclxuICAgICAgICAgICAgICAgICAgICByb2xlPVwiY29sdW1uaGVhZGVyXCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4gZGF0YWdyaWQtc2VsZWN0IGRhdGFncmlkLWZpeGVkLWNvbHVtblwiXG4gICAgICAgICAgICAgICAgICAgICpuZ0lmPVwic2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNFTEVDVElPTl9UWVBFLk11bHRpXCJcbiAgICAgICAgICAgICAgICAgICAgKGtleWRvd24uc3BhY2UpPVwidG9nZ2xlQWxsU2VsZWN0ZWQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgKm5nSWY9XCIhdmlydHVhbFNjcm9sbCB8fCBjdXN0b21TZWxlY3RBbGxFbmFibGVkXCIgY2xhc3M9XCJjbHItY2hlY2tib3gtd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgICAgICAgIDwhLS0gV2UgbmVlZCB0byBtb3ZlIGZvY3VzIGFuZCBzcGFjZS1rZXkgaGFuZGxpbmcgdG8gdGhlIHBhcmVudCBiZWNhdXNlIG9mIGtleWJvYXJkIGFycm93IGtleSBuYXZpZ2F0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpY2ggaXMgbm90IGFibGUgdG8gdHJhbnNmZXIgZm9jdXMgZGlyZWN0bHkgb24gdGhlIGlucHV0IHdoZW4gZm9jdXNlZCB3aXRoIHRoZSB0YWIga2V5IC0tPlxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgI3NlbGVjdEFsbENoZWNrYm94XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2lkXT1cInNlbGVjdEFsbElkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFsobmdNb2RlbCldPVwiYWxsU2VsZWN0ZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjb21tb25TdHJpbmdzLmtleXMuc2VsZWN0QWxsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPCEtLSBVc2FnZSBvZiBjbGFzcyBjbHItY29sLW51bGwgaGVyZSBwcmV2ZW50cyBjbHItY29sLSogY2xhc3NlcyBmcm9tIGJlaW5nIGFkZGVkIHdoZW4gYSBkYXRhZ3JpZCBpcyB3cmFwcGVkIGluc2lkZSBjbHJGb3JtIC0tPlxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBbZm9yXT1cInNlbGVjdEFsbElkXCIgY2xhc3M9XCJjbHItY29udHJvbC1sYWJlbCBjbHItY29sLW51bGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57e2NvbW1vblN0cmluZ3Mua2V5cy5zZWxlY3RBbGx9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uLXNlcGFyYXRvclwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8IS0tIGhlYWRlciBmb3IgZGF0YWdyaWQgd2hlcmUgeW91IGNhbiBzZWxlY3Qgb25lIHJvdyBvbmx5IC0tPlxuICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAjc3RpY2t5SGVhZGVyXG4gICAgICAgICAgICAgICAgICAgIHJvbGU9XCJjb2x1bW5oZWFkZXJcIlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImRhdGFncmlkLWNvbHVtbiBkYXRhZ3JpZC1zZWxlY3QgZGF0YWdyaWQtZml4ZWQtY29sdW1uXCJcbiAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJzZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9PT0gU0VMRUNUSU9OX1RZUEUuU2luZ2xlXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNsci1zci1vbmx5XCI+e3tjbHJEZ1NpbmdsZVNlbGVjdGlvbkFyaWFMYWJlbH19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4tc2VwYXJhdG9yXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwhLS0gaGVhZGVyIGZvciBzaW5nbGUgcm93IGFjdGlvbjsgb25seSBkaXNwbGF5VHlwZSBpZiB3ZSBoYXZlIGF0IGxlYXN0IG9uZSBhY3Rpb25hYmxlIHJvdyBpbiBkYXRhZ3JpZCAtLT5cbiAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgI3N0aWNreUhlYWRlclxuICAgICAgICAgICAgICAgICAgICByb2xlPVwiY29sdW1uaGVhZGVyXCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4gZGF0YWdyaWQtcm93LWFjdGlvbnMgZGF0YWdyaWQtZml4ZWQtY29sdW1uXCJcbiAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJyb3dBY3Rpb25TZXJ2aWNlLmhhc0FjdGlvbmFibGVSb3dcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57e2NsckRnU2luZ2xlQWN0aW9uYWJsZUFyaWFMYWJlbH19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4tc2VwYXJhdG9yXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwhLS0gaGVhZGVyIGZvciBjYXJldHM7IG9ubHkgZGlzcGxheVR5cGUgaWYgd2UgaGF2ZSBhdCBsZWFzdCBvbmUgZXhwYW5kYWJsZSByb3cgaW4gZGF0YWdyaWQgLS0+XG4gICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICNzdGlja3lIZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgcm9sZT1cImNvbHVtbmhlYWRlclwiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uIGRhdGFncmlkLWV4cGFuZGFibGUtY2FyZXQgZGF0YWdyaWQtZml4ZWQtY29sdW1uXCJcbiAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJleHBhbmRhYmxlUm93cy5oYXNFeHBhbmRhYmxlUm93IHx8IGRldGFpbFNlcnZpY2UuZW5hYmxlZFwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjbHItc3Itb25seVwiPnt7Y2xyRGV0YWlsRXhwYW5kYWJsZUFyaWFMYWJlbH19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4tc2VwYXJhdG9yXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtcm93LXNjcm9sbGFibGVcIj5cbiAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgI3Byb2plY3RlZERpc3BsYXlDb2x1bW5zPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJ2aXJ0dWFsU2Nyb2xsXCIgY2xhc3M9XCJkYXRhZ3JpZC1yb3ctc3RpY2t5IGRhdGFncmlkLXJvdy1zdGlja3ktc2Nyb2xsXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtY29udGVudFwiIFtjbGFzcy5kYXRhZ3JpZC1jb250ZW50LXZpcnR1YWxdPVwidmlydHVhbFNjcm9sbFwiICNjb250ZW50V3JhcHBlcj5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgKm5nSWY9XCJ2aXJ0dWFsU2Nyb2xsXCJcbiAgICAgICAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1jb250ZW50LXZpcnR1YWwtc3BhY2VyXCJcbiAgICAgICAgICAgICAgW3N0eWxlLmhlaWdodF09XCJ2aXJ0dWFsU2Nyb2xsPy50b3RhbENvbnRlbnRIZWlnaHRcIlxuICAgICAgICAgICAgPjwvZGl2PlxuICAgICAgICAgICAgPGRpdiByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3M9XCJkYXRhZ3JpZC1yb3dzXCI+XG4gICAgICAgICAgICAgIDxjbHItZGctcm93IGNsYXNzPVwiZGF0YWdyaWQtcm93LWxvYWRpbmdcIiAqbmdJZj1cImxvYWRpbmdNb3JlSXRlbXNcIj5cbiAgICAgICAgICAgICAgICA8Y2xyLWRnLWNlbGw+XG4gICAgICAgICAgICAgICAgICA8Y2xyLXNwaW5uZXIgY2xyTWVkaXVtPjwvY2xyLXNwaW5uZXI+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj57eyBjb21tb25TdHJpbmdzLmtleXMubG9hZGluZyB9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Nsci1kZy1jZWxsPlxuICAgICAgICAgICAgICA8L2Nsci1kZy1yb3c+XG5cbiAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAjZGlzcGxheWVkUm93cz48L25nLWNvbnRhaW5lcj5cblxuICAgICAgICAgICAgICA8Y2xyLWRnLXJvdyBjbGFzcz1cImRhdGFncmlkLXJvdy1sb2FkaW5nXCIgKm5nSWY9XCJsb2FkaW5nTW9yZUl0ZW1zXCI+XG4gICAgICAgICAgICAgICAgPGNsci1kZy1jZWxsPlxuICAgICAgICAgICAgICAgICAgPGNsci1zcGlubmVyIGNsck1lZGl1bT48L2Nsci1zcGlubmVyPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+e3sgY29tbW9uU3RyaW5ncy5rZXlzLmxvYWRpbmcgfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9jbHItZGctY2VsbD5cbiAgICAgICAgICAgICAgPC9jbHItZGctcm93PlxuXG4gICAgICAgICAgICAgIDwhLS0gQ3VzdG9tIHBsYWNlaG9sZGVyIG92ZXJyaWRlcyB0aGUgZGVmYXVsdCBlbXB0eSBvbmUgLS0+XG4gICAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1kZy1wbGFjZWhvbGRlclwiPjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgPGNsci1kZy1wbGFjZWhvbGRlciAqbmdJZj1cIiFwbGFjZWhvbGRlclwiPjwvY2xyLWRnLXBsYWNlaG9sZGVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWRnLWZvb3RlclwiPjwvbmctY29udGVudD5cbiAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtc3Bpbm5lclwiICpuZ0lmPVwibG9hZGluZ1wiPlxuICAgICAgPGNsci1zcGlubmVyIGNsck1lZGl1bT5Mb2FkaW5nPC9jbHItc3Bpbm5lcj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIDxuZy1jb250ZW50IHNlbGVjdD1cIltjbHJJZkRldGFpbF0sY2xyLWRnLWRldGFpbFwiPjwvbmctY29udGVudD5cbjwvZGl2PlxuXG48ZGl2IGNsYXNzPVwiZGF0YWdyaWQtY2FsY3VsYXRpb24tdGFibGVcIj5cbiAgPGRpdiBjbGFzcz1cImRhdGFncmlkLWNhbGN1bGF0aW9uLWhlYWRlclwiPlxuICAgIDxuZy1jb250YWluZXIgI3Byb2plY3RlZENhbGN1bGF0aW9uQ29sdW1ucz48L25nLWNvbnRhaW5lcj5cbiAgPC9kaXY+XG4gIDxuZy1jb250YWluZXIgI2NhbGN1bGF0aW9uUm93cz48L25nLWNvbnRhaW5lcj5cbjwvZGl2PlxuXG48bmctdGVtcGxhdGUgI2ZpeGVkQ29sdW1uVGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4gZGF0YWdyaWQtZml4ZWQtY29sdW1uXCI+PC9kaXY+XG48L25nLXRlbXBsYXRlPlxuIl19
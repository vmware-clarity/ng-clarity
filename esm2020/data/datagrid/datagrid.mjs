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
    ngAfterViewChecked() {
        if (this.virtualScroll && this._virtualScrollSubscriptions.length === 0) {
            // the virtual scroll will handle the scrolling
            this.keyNavigation.preventScrollOnFocus = !!this.virtualScroll;
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
        else if (!this.virtualScroll && this._virtualScrollSubscriptions.length > 0) {
            // the virtual scroll will handle the scrolling
            this.keyNavigation.preventScrollOnFocus = !!this.virtualScroll;
            this._virtualScrollSubscriptions.forEach((sub) => sub.unsubscribe());
            this._virtualScrollSubscriptions = [];
        }
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
    ], queries: [{ propertyName: "virtualScroll", first: true, predicate: ClrDatagridVirtualScrollDirective, descendants: true }, { propertyName: "iterator", first: true, predicate: ClrDatagridItems, descendants: true }, { propertyName: "placeholder", first: true, predicate: ClrDatagridPlaceholder, descendants: true }, { propertyName: "columns", predicate: ClrDatagridColumn }, { propertyName: "rows", predicate: ClrDatagridRow, emitDistinctChangesOnly: false }], viewQueries: [{ propertyName: "datagrid", first: true, predicate: ["datagrid"], descendants: true, read: ElementRef }, { propertyName: "datagridTable", first: true, predicate: ["datagridTable"], descendants: true, read: ElementRef }, { propertyName: "datagridHeader", first: true, predicate: ["datagridHeader"], descendants: true, read: ElementRef }, { propertyName: "contentWrapper", first: true, predicate: ["contentWrapper"], descendants: true, read: ElementRef }, { propertyName: "scrollableColumns", first: true, predicate: ["scrollableColumns"], descendants: true, read: ViewContainerRef }, { propertyName: "_projectedDisplayColumns", first: true, predicate: ["projectedDisplayColumns"], descendants: true, read: ViewContainerRef }, { propertyName: "_projectedCalculationColumns", first: true, predicate: ["projectedCalculationColumns"], descendants: true, read: ViewContainerRef }, { propertyName: "_displayedRows", first: true, predicate: ["displayedRows"], descendants: true, read: ViewContainerRef }, { propertyName: "_calculationRows", first: true, predicate: ["calculationRows"], descendants: true, read: ViewContainerRef }, { propertyName: "_fixedColumnTemplate", first: true, predicate: ["fixedColumnTemplate"], descendants: true }, { propertyName: "selectAllCheckbox", first: true, predicate: ["selectAllCheckbox"], descendants: true }, { propertyName: "stickyHeaders", predicate: ["stickyHeader"], descendants: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<ng-content select=\"clr-dg-action-bar\"></ng-content>\n<div class=\"datagrid-outer-wrapper\">\n  <div class=\"datagrid-inner-wrapper\">\n    <div class=\"datagrid\" #datagrid [attr.aria-hidden]=\"detailService.isOpen ? true : null\">\n      <div class=\"datagrid-table-wrapper\">\n        <div role=\"grid\" class=\"datagrid-table\" tabindex=\"-1\" #datagridTable>\n          <div role=\"rowgroup\" class=\"datagrid-header\" #datagridHeader>\n            <div role=\"row\" class=\"datagrid-row\">\n              <div class=\"datagrid-row-master datagrid-row-flex\">\n                <div class=\"datagrid-row-sticky\">\n                  <!--header for datagrid where you can select multiple rows -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    *ngIf=\"selection.selectionType === SELECTION_TYPE.Multi\"\n                    (keydown.space)=\"toggleAllSelected($event)\"\n                  >\n                    <div *ngIf=\"!virtualScroll || customSelectAllEnabled\" class=\"clr-checkbox-wrapper\">\n                      <!-- We need to move focus and space-key handling to the parent because of keyboard arrow key navigation,\n                           which is not able to transfer focus directly on the input when focused with the tab key -->\n                      <input\n                        #selectAllCheckbox\n                        type=\"checkbox\"\n                        [id]=\"selectAllId\"\n                        [(ngModel)]=\"allSelected\"\n                        [attr.aria-label]=\"commonStrings.keys.selectAll\"\n                        tabindex=\"-1\"\n                      />\n                      <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n                      <label [for]=\"selectAllId\" class=\"clr-control-label clr-col-null\">\n                        <span class=\"clr-sr-only\">{{commonStrings.keys.selectAll}}</span>\n                      </label>\n                    </div>\n\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for datagrid where you can select one row only -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    *ngIf=\"selection.selectionType === SELECTION_TYPE.Single\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleSelectionAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for single row action; only displayType if we have at least one actionable row in datagrid -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-row-actions datagrid-fixed-column\"\n                    *ngIf=\"rowActionService.hasActionableRow\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleActionableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for carets; only displayType if we have at least one expandable row in datagrid -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-expandable-caret datagrid-fixed-column\"\n                    *ngIf=\"expandableRows.hasExpandableRow || detailService.enabled\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDetailExpandableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                </div>\n                <div class=\"datagrid-row-scrollable\">\n                  <ng-container #projectedDisplayColumns></ng-container>\n                </div>\n                <div *ngIf=\"virtualScroll\" class=\"datagrid-row-sticky datagrid-row-sticky-scroll\">\n                  <div class=\"datagrid-column\"></div>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <div class=\"datagrid-content\" [class.datagrid-content-virtual]=\"virtualScroll\" #contentWrapper>\n            <div\n              *ngIf=\"virtualScroll\"\n              class=\"datagrid-content-virtual-spacer\"\n              [style.height]=\"virtualScroll?.totalContentHeight\"\n            ></div>\n            <div role=\"presentation\" class=\"datagrid-rows\">\n              <clr-dg-row class=\"datagrid-row-loading\" *ngIf=\"loadingMoreItems\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n\n              <ng-container #displayedRows></ng-container>\n\n              <clr-dg-row class=\"datagrid-row-loading\" *ngIf=\"loadingMoreItems\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n\n              <!-- Custom placeholder overrides the default empty one -->\n              <ng-content select=\"clr-dg-placeholder\"></ng-content>\n              <clr-dg-placeholder *ngIf=\"!placeholder\"></clr-dg-placeholder>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <ng-content select=\"clr-dg-footer\"></ng-content>\n    <div class=\"datagrid-spinner\" *ngIf=\"loading\">\n      <clr-spinner clrMedium>Loading</clr-spinner>\n    </div>\n  </div>\n  <ng-content select=\"[clrIfDetail],clr-dg-detail\"></ng-content>\n</div>\n\n<div class=\"datagrid-calculation-table\">\n  <div class=\"datagrid-calculation-header\">\n    <ng-container #projectedCalculationColumns></ng-container>\n  </div>\n  <ng-container #calculationRows></ng-container>\n</div>\n\n<ng-template #fixedColumnTemplate>\n  <div class=\"datagrid-column datagrid-fixed-column\"></div>\n</ng-template>\n", dependencies: [{ kind: "directive", type: i12.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i13.ClrLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i14.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i14.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i14.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i15.ClrSpinner, selector: "clr-spinner", inputs: ["clrInline", "clrInverse", "clrSmall", "clrMedium"] }, { kind: "component", type: i16.ClrDatagridCell, selector: "clr-dg-cell" }, { kind: "component", type: i17.ClrDatagridPlaceholder, selector: "clr-dg-placeholder" }, { kind: "component", type: i18.ClrDatagridRow, selector: "clr-dg-row", inputs: ["clrDgDetailDisabled", "clrDgDetailHidden", "clrDgSkeletonLoading", "clrDgItem", "clrDgSelectable", "clrDgSelected", "clrDgExpanded", "clrDgDetailOpenLabel", "clrDgDetailCloseLabel", "clrDgRowSelectionLabel"], outputs: ["clrDgSelectedChange", "clrDgExpandedChange"] }, { kind: "directive", type: i19.ClrDatagridSelectionCellDirective, selector: ".datagrid-select" }, { kind: "directive", type: i20.DatagridCellRenderer, selector: "clr-dg-cell" }, { kind: "directive", type: i21.DatagridRowRenderer, selector: "clr-dg-row, clr-dg-row-detail" }, { kind: "directive", type: i22.ActionableOompaLoompa, selector: "clr-datagrid, clr-dg-row" }, { kind: "directive", type: i23.ExpandableOompaLoompa, selector: "clr-datagrid, clr-dg-row" }] });
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
            }], virtualScroll: [{
                type: ContentChild,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2RhdGFncmlkLnRzIiwiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFJTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBR0wsTUFBTSxFQUlOLFNBQVMsRUFDVCxZQUFZLEVBQ1osZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHekQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN4RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFdkQs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QWM7c0JBQWhFLFNBQVM7dUJBQUMsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO2dCQUNFLGNBQWM7c0JBQWhFLFNBQVM7dUJBQUMsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO2dCQUNXLGlCQUFpQjtzQkFBNUUsU0FBUzt1QkFBQyxtQkFBbUIsRUFBRSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtnQkFDUSx3QkFBd0I7c0JBQXpGLFNBQVM7dUJBQUMseUJBQXlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBQ00sNEJBQTRCO3NCQUFqRyxTQUFTO3VCQUFDLDZCQUE2QixFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFO2dCQUNaLGNBQWM7c0JBQXJFLFNBQVM7dUJBQUMsZUFBZSxFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFO2dCQUNJLGdCQUFnQjtzQkFBekUsU0FBUzt1QkFBQyxpQkFBaUIsRUFBRSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtnQkFDdEIsb0JBQW9CO3NCQUFyRCxTQUFTO3VCQUFDLHFCQUFxQjtnQkFDaUMsYUFBYTtzQkFBN0UsWUFBWTt1QkFBQyxjQUFjLEVBQUUsRUFBRSx1QkFBdUIsRUFBRSxJQUFJLEVBQUU7Z0JBUXZCLGlCQUFpQjtzQkFBeEQsU0FBUzt1QkFBQyxtQkFBbUI7Z0JBbUMxQixPQUFPO3NCQURWLEtBQUs7dUJBQUMsY0FBYztnQkFZakIsUUFBUTtzQkFEWCxLQUFLO3VCQUFDLGVBQWU7Z0JBY2xCLGNBQWM7c0JBRGpCLEtBQUs7dUJBQUMscUJBQXFCO2dCQWN4QixzQkFBc0I7c0JBRHpCLEtBQUs7Z0JBV0YsZ0JBQWdCO3NCQURuQixLQUFLO3VCQUFDLG1CQUFtQjtnQkFNdEIsT0FBTztzQkFEVixLQUFLO3VCQUFDLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFJlbmRlcmVyMixcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NoaWxkcmVuLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGNvbWJpbmVMYXRlc3QsIGZyb21FdmVudCwgbWVyZ2UsIG9mLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgc3dpdGNoTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBDbHJDb21tb25TdHJpbmdzU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL2kxOG4vY29tbW9uLXN0cmluZ3Muc2VydmljZSc7XG5pbXBvcnQgeyB1bmlxdWVJZEZhY3RvcnkgfSBmcm9tICcuLi8uLi91dGlscy9pZC1nZW5lcmF0b3IvaWQtZ2VuZXJhdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRDb2x1bW4gfSBmcm9tICcuL2RhdGFncmlkLWNvbHVtbic7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZEl0ZW1zIH0gZnJvbSAnLi9kYXRhZ3JpZC1pdGVtcyc7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZFBsYWNlaG9sZGVyIH0gZnJvbSAnLi9kYXRhZ3JpZC1wbGFjZWhvbGRlcic7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZFJvdyB9IGZyb20gJy4vZGF0YWdyaWQtcm93JztcbmltcG9ydCB7IENsckRhdGFncmlkVmlydHVhbFNjcm9sbERpcmVjdGl2ZSB9IGZyb20gJy4vZGF0YWdyaWQtdmlydHVhbC1zY3JvbGwuZGlyZWN0aXZlJztcbmltcG9ydCB7IERhdGFncmlkRGlzcGxheU1vZGUgfSBmcm9tICcuL2VudW1zL2Rpc3BsYXktbW9kZS5lbnVtJztcbmltcG9ydCB7IFNlbGVjdGlvblR5cGUgfSBmcm9tICcuL2VudW1zL3NlbGVjdGlvbi10eXBlJztcbmltcG9ydCB7IENsckRhdGFncmlkU3RhdGVJbnRlcmZhY2UgfSBmcm9tICcuL2ludGVyZmFjZXMvc3RhdGUuaW50ZXJmYWNlJztcbmltcG9ydCB7IENvbHVtbnNTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvY29sdW1ucy5zZXJ2aWNlJztcbmltcG9ydCB7IERldGFpbFNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9kZXRhaWwuc2VydmljZSc7XG5pbXBvcnQgeyBEaXNwbGF5TW9kZVNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9kaXNwbGF5LW1vZGUuc2VydmljZSc7XG5pbXBvcnQgeyBGaWx0ZXJzUHJvdmlkZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9maWx0ZXJzJztcbmltcG9ydCB7IEV4cGFuZGFibGVSb3dzQ291bnQgfSBmcm9tICcuL3Byb3ZpZGVycy9nbG9iYWwtZXhwYW5kYWJsZS1yb3dzJztcbmltcG9ydCB7IENsckRhdGFncmlkSXRlbXNUcmFja0J5RnVuY3Rpb24sIEl0ZW1zIH0gZnJvbSAnLi9wcm92aWRlcnMvaXRlbXMnO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gJy4vcHJvdmlkZXJzL3BhZ2UnO1xuaW1wb3J0IHsgUm93QWN0aW9uU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3Jvdy1hY3Rpb24tc2VydmljZSc7XG5pbXBvcnQgeyBTZWxlY3Rpb24gfSBmcm9tICcuL3Byb3ZpZGVycy9zZWxlY3Rpb24nO1xuaW1wb3J0IHsgU29ydCB9IGZyb20gJy4vcHJvdmlkZXJzL3NvcnQnO1xuaW1wb3J0IHsgU3RhdGVEZWJvdW5jZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9zdGF0ZS1kZWJvdW5jZXIucHJvdmlkZXInO1xuaW1wb3J0IHsgU3RhdGVQcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXJzL3N0YXRlLnByb3ZpZGVyJztcbmltcG9ydCB7IFRhYmxlU2l6ZVNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy90YWJsZS1zaXplLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGF0YWdyaWRSZW5kZXJPcmdhbml6ZXIgfSBmcm9tICcuL3JlbmRlci9yZW5kZXItb3JnYW5pemVyJztcbmltcG9ydCB7IENlbGxDb29yZGluYXRlcywgS2V5TmF2aWdhdGlvbkdyaWRDb250cm9sbGVyIH0gZnJvbSAnLi91dGlscy9rZXktbmF2aWdhdGlvbi1ncmlkLmNvbnRyb2xsZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZGF0YWdyaWQnLFxuICB0ZW1wbGF0ZVVybDogJy4vZGF0YWdyaWQuaHRtbCcsXG4gIHByb3ZpZGVyczogW1xuICAgIFNlbGVjdGlvbixcbiAgICBTb3J0LFxuICAgIEZpbHRlcnNQcm92aWRlcixcbiAgICBQYWdlLFxuICAgIEl0ZW1zLFxuICAgIERhdGFncmlkUmVuZGVyT3JnYW5pemVyLFxuICAgIFJvd0FjdGlvblNlcnZpY2UsXG4gICAgRXhwYW5kYWJsZVJvd3NDb3VudCxcbiAgICBTdGF0ZURlYm91bmNlcixcbiAgICBEZXRhaWxTZXJ2aWNlLFxuICAgIFN0YXRlUHJvdmlkZXIsXG4gICAgVGFibGVTaXplU2VydmljZSxcbiAgICBDb2x1bW5zU2VydmljZSxcbiAgICBEaXNwbGF5TW9kZVNlcnZpY2UsXG4gICAgS2V5TmF2aWdhdGlvbkdyaWRDb250cm9sbGVyLFxuICBdLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5kYXRhZ3JpZC1ob3N0XSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLmRhdGFncmlkLWRldGFpbC1vcGVuXSc6ICdkZXRhaWxTZXJ2aWNlLmlzT3BlbicsXG4gICAgJ1tjbGFzcy5kYXRhZ3JpZC12aXJ0dWFsLXNjcm9sbF0nOiAnISF2aXJ0dWFsU2Nyb2xsJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWdyaWQ8VCA9IGFueT4gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdDaGVja2VkLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoJ2NsckxvYWRpbmdNb3JlSXRlbXMnKSBsb2FkaW5nTW9yZUl0ZW1zOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpIGNsckRnU2luZ2xlU2VsZWN0aW9uQXJpYUxhYmVsOiBzdHJpbmcgPSB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5zaW5nbGVTZWxlY3Rpb25BcmlhTGFiZWw7XG4gIEBJbnB1dCgpIGNsckRnU2luZ2xlQWN0aW9uYWJsZUFyaWFMYWJlbDogc3RyaW5nID0gdGhpcy5jb21tb25TdHJpbmdzLmtleXMuc2luZ2xlQWN0aW9uYWJsZUFyaWFMYWJlbDtcbiAgQElucHV0KCkgY2xyRGV0YWlsRXhwYW5kYWJsZUFyaWFMYWJlbDogc3RyaW5nID0gdGhpcy5jb21tb25TdHJpbmdzLmtleXMuZGV0YWlsRXhwYW5kYWJsZUFyaWFMYWJlbDtcblxuICAvLyBBbGxvd3MgZGlzYWJsaW5nIG9mIHRoZSBhdXRvIGZvY3VzIG9uIHBhZ2Uvc3RhdGUgY2hhbmdlcyAoZXhjbHVkZXMgZm9jdXMgbWFuYWdlbWVudCBpbnNpZGUgb2YgcG9wdXBzKVxuICBASW5wdXQoKSBjbHJEZ0Rpc2FibGVQYWdlRm9jdXMgPSBmYWxzZTtcblxuICBAT3V0cHV0KCdjbHJEZ1NlbGVjdGVkQ2hhbmdlJykgc2VsZWN0ZWRDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxUW10+KGZhbHNlKTtcbiAgQE91dHB1dCgnY2xyRGdTaW5nbGVTZWxlY3RlZENoYW5nZScpIHNpbmdsZVNlbGVjdGVkQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8VD4oZmFsc2UpO1xuXG4gIC8qKlxuICAgKiBPdXRwdXQgZW1pdHRlZCB3aGVuZXZlciB0aGUgZGF0YSBuZWVkcyB0byBiZSByZWZyZXNoZWQsIGJhc2VkIG9uIHVzZXIgYWN0aW9uIG9yIGV4dGVybmFsIG9uZXNcbiAgICovXG4gIEBPdXRwdXQoJ2NsckRnUmVmcmVzaCcpIHJlZnJlc2ggPSBuZXcgRXZlbnRFbWl0dGVyPENsckRhdGFncmlkU3RhdGVJbnRlcmZhY2U8VD4+KGZhbHNlKTtcblxuICAvKipcbiAgICogVGhlIGFwcGxpY2F0aW9uIGNhbiBwcm92aWRlIGN1c3RvbSBzZWxlY3QgYWxsIGxvZ2ljLlxuICAgKi9cbiAgQElucHV0KCdjbHJEZ0N1c3RvbVNlbGVjdEFsbEVuYWJsZWQnKSBjdXN0b21TZWxlY3RBbGxFbmFibGVkID0gZmFsc2U7XG4gIEBPdXRwdXQoJ2NsckRnQ3VzdG9tU2VsZWN0QWxsJykgY3VzdG9tU2VsZWN0QWxsID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIC8qKlxuICAgKiBFeHBvc2UgdmlydHVhbCBzY3JvbGwgZGlyZWN0aXZlIGZvciBhcHBsaWNhdGlvbnMgdG8gYWNjZXNzIGl0cyBwdWJsaWMgbWV0aG9kc1xuICAgKi9cbiAgQENvbnRlbnRDaGlsZChDbHJEYXRhZ3JpZFZpcnR1YWxTY3JvbGxEaXJlY3RpdmUpIHZpcnR1YWxTY3JvbGw6IENsckRhdGFncmlkVmlydHVhbFNjcm9sbERpcmVjdGl2ZTxhbnk+O1xuXG4gIC8qKlxuICAgKiBXZSBncmFiIHRoZSBzbWFydCBpdGVyYXRvciBmcm9tIHByb2plY3RlZCBjb250ZW50XG4gICAqL1xuICBAQ29udGVudENoaWxkKENsckRhdGFncmlkSXRlbXMpIGl0ZXJhdG9yOiBDbHJEYXRhZ3JpZEl0ZW1zPFQ+O1xuXG4gIC8qKlxuICAgKiBDdXN0b20gcGxhY2Vob2xkZXIgZGV0ZWN0aW9uXG4gICAqL1xuICBAQ29udGVudENoaWxkKENsckRhdGFncmlkUGxhY2Vob2xkZXIpIHBsYWNlaG9sZGVyOiBDbHJEYXRhZ3JpZFBsYWNlaG9sZGVyPFQ+O1xuXG4gIC8qKlxuICAgKiBIaWRlYWJsZSBDb2x1bW4gZGF0YSBzb3VyY2UgLyBkZXRlY3Rpb24uXG4gICAqL1xuICBAQ29udGVudENoaWxkcmVuKENsckRhdGFncmlkQ29sdW1uKSBjb2x1bW5zOiBRdWVyeUxpc3Q8Q2xyRGF0YWdyaWRDb2x1bW48VD4+O1xuXG4gIC8qKlxuICAgKiBXaGVuIHRoZSBkYXRhZ3JpZCBpcyB1c2VyLW1hbmFnZWQgd2l0aG91dCB0aGUgc21hcnQgaXRlcmF0b3IsIHdlIGdldCB0aGUgaXRlbXMgZGlzcGxheWVkXG4gICAqIGJ5IHF1ZXJ5aW5nIHRoZSBwcm9qZWN0ZWQgY29udGVudC4gVGhpcyBpcyBuZWVkZWQgdG8ga2VlcCB0cmFjayBvZiB0aGUgbW9kZWxzIGN1cnJlbnRseVxuICAgKiBkaXNwbGF5ZWQsIHR5cGljYWxseSBmb3Igc2VsZWN0aW9uLlxuICAgKi9cbiAgQENvbnRlbnRDaGlsZHJlbihDbHJEYXRhZ3JpZFJvdywgeyBlbWl0RGlzdGluY3RDaGFuZ2VzT25seTogZmFsc2UgfSkgcm93czogUXVlcnlMaXN0PENsckRhdGFncmlkUm93PFQ+PjtcblxuICBAVmlld0NoaWxkKCdkYXRhZ3JpZCcsIHsgcmVhZDogRWxlbWVudFJlZiB9KSBkYXRhZ3JpZDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ2RhdGFncmlkVGFibGUnLCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSkgZGF0YWdyaWRUYWJsZTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ2RhdGFncmlkSGVhZGVyJywgeyByZWFkOiBFbGVtZW50UmVmIH0pIGRhdGFncmlkSGVhZGVyOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgnY29udGVudFdyYXBwZXInLCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSkgY29udGVudFdyYXBwZXI6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdzY3JvbGxhYmxlQ29sdW1ucycsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSBzY3JvbGxhYmxlQ29sdW1uczogVmlld0NvbnRhaW5lclJlZjtcbiAgQFZpZXdDaGlsZCgncHJvamVjdGVkRGlzcGxheUNvbHVtbnMnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSkgX3Byb2plY3RlZERpc3BsYXlDb2x1bW5zOiBWaWV3Q29udGFpbmVyUmVmO1xuICBAVmlld0NoaWxkKCdwcm9qZWN0ZWRDYWxjdWxhdGlvbkNvbHVtbnMnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSkgX3Byb2plY3RlZENhbGN1bGF0aW9uQ29sdW1uczogVmlld0NvbnRhaW5lclJlZjtcbiAgQFZpZXdDaGlsZCgnZGlzcGxheWVkUm93cycsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSBfZGlzcGxheWVkUm93czogVmlld0NvbnRhaW5lclJlZjtcbiAgQFZpZXdDaGlsZCgnY2FsY3VsYXRpb25Sb3dzJywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmIH0pIF9jYWxjdWxhdGlvblJvd3M6IFZpZXdDb250YWluZXJSZWY7XG4gIEBWaWV3Q2hpbGQoJ2ZpeGVkQ29sdW1uVGVtcGxhdGUnKSBfZml4ZWRDb2x1bW5UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgQFZpZXdDaGlsZHJlbignc3RpY2t5SGVhZGVyJywgeyBlbWl0RGlzdGluY3RDaGFuZ2VzT25seTogdHJ1ZSB9KSBzdGlja3lIZWFkZXJzOiBRdWVyeUxpc3Q8RWxlbWVudFJlZj47XG5cbiAgc2VsZWN0QWxsSWQ6IHN0cmluZztcbiAgYWN0aXZlQ2VsbENvb3JkczogQ2VsbENvb3JkaW5hdGVzO1xuXG4gIC8qIHJlZmVyZW5jZSB0byB0aGUgZW51bSBzbyB0aGF0IHRlbXBsYXRlIGNhbiBhY2Nlc3MgKi9cbiAgU0VMRUNUSU9OX1RZUEUgPSBTZWxlY3Rpb25UeXBlO1xuXG4gIEBWaWV3Q2hpbGQoJ3NlbGVjdEFsbENoZWNrYm94JykgcHJpdmF0ZSBzZWxlY3RBbGxDaGVja2JveDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PjtcblxuICAvKipcbiAgICogU3Vic2NyaXB0aW9ucyB0byBhbGwgdGhlIHNlcnZpY2VzIGFuZCBxdWVyaWVzIGNoYW5nZXNcbiAgICovXG4gIHByaXZhdGUgX3N1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG4gIHByaXZhdGUgX3ZpcnR1YWxTY3JvbGxTdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgb3JnYW5pemVyOiBEYXRhZ3JpZFJlbmRlck9yZ2FuaXplcixcbiAgICBwdWJsaWMgaXRlbXM6IEl0ZW1zPFQ+LFxuICAgIHB1YmxpYyBleHBhbmRhYmxlUm93czogRXhwYW5kYWJsZVJvd3NDb3VudCxcbiAgICBwdWJsaWMgc2VsZWN0aW9uOiBTZWxlY3Rpb248VD4sXG4gICAgcHVibGljIHJvd0FjdGlvblNlcnZpY2U6IFJvd0FjdGlvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBzdGF0ZVByb3ZpZGVyOiBTdGF0ZVByb3ZpZGVyPFQ+LFxuICAgIHByaXZhdGUgZGlzcGxheU1vZGU6IERpc3BsYXlNb2RlU2VydmljZSxcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIGRldGFpbFNlcnZpY2U6IERldGFpbFNlcnZpY2UsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogYW55LFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSxcbiAgICBwdWJsaWMga2V5TmF2aWdhdGlvbjogS2V5TmF2aWdhdGlvbkdyaWRDb250cm9sbGVyLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lXG4gICkge1xuICAgIGNvbnN0IGRhdGFncmlkSWQgPSB1bmlxdWVJZEZhY3RvcnkoKTtcblxuICAgIHRoaXMuc2VsZWN0QWxsSWQgPSAnY2xyLWRnLXNlbGVjdC1hbGwtJyArIGRhdGFncmlkSWQ7XG4gICAgZGV0YWlsU2VydmljZS5pZCA9IGRhdGFncmlkSWQ7XG4gIH1cblxuICAvKipcbiAgICogRnJlZXplcyB0aGUgZGF0YWdyaWQgd2hpbGUgZGF0YSBpcyBsb2FkaW5nXG4gICAqL1xuICBASW5wdXQoJ2NsckRnTG9hZGluZycpXG4gIGdldCBsb2FkaW5nKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLml0ZW1zLmxvYWRpbmc7XG4gIH1cbiAgc2V0IGxvYWRpbmcodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLml0ZW1zLmxvYWRpbmcgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcnJheSBvZiBhbGwgc2VsZWN0ZWQgaXRlbXNcbiAgICovXG4gIEBJbnB1dCgnY2xyRGdTZWxlY3RlZCcpXG4gIHNldCBzZWxlY3RlZCh2YWx1ZTogVFtdIHwgdW5kZWZpbmVkKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID0gU2VsZWN0aW9uVHlwZS5NdWx0aTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9IFNlbGVjdGlvblR5cGUuTm9uZTtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3Rpb24udXBkYXRlQ3VycmVudCh2YWx1ZSwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdGVkIGl0ZW0gaW4gc2luZ2xlLXNlbGVjdCBtb2RlXG4gICAqL1xuICBASW5wdXQoJ2NsckRnU2luZ2xlU2VsZWN0ZWQnKVxuICBzZXQgc2luZ2xlU2VsZWN0ZWQodmFsdWU6IFQpIHtcbiAgICB0aGlzLnNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID0gU2VsZWN0aW9uVHlwZS5TaW5nbGU7XG4gICAgLy8gdGhlIGNsckRnU2luZ2xlU2VsZWN0ZWQgaXMgdXBkYXRlZCBpbiBvbmUgb2YgdHdvIGNhc2VzOlxuICAgIC8vIDEuIGFuIGV4cGxpY2l0IHZhbHVlIGlzIHBhc3NlZFxuICAgIC8vIDIuIGlzIGJlaW5nIHNldCB0byBudWxsIG9yIHVuZGVmaW5lZCwgd2hlcmUgcHJldmlvdXNseSBpdCBoYWQgYSB2YWx1ZVxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5zZWxlY3Rpb24uY3VycmVudFNpbmdsZSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3Rpb24uY3VycmVudFNpbmdsZSkge1xuICAgICAgdGhpcy5zZWxlY3Rpb24uY3VycmVudFNpbmdsZSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGNsckRnUHJlc2VydmVTZWxlY3Rpb24oc3RhdGU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNlbGVjdGlvbi5wcmVzZXJ2ZVNlbGVjdGlvbiA9IHN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIHNpbmNlIDIuMCwgcmVtb3ZlIGluIDMuMFxuICAgKlxuICAgKiBTZWxlY3Rpb24vRGVzZWxlY3Rpb24gb24gcm93IGNsaWNrIG1vZGVcbiAgICovXG4gIEBJbnB1dCgnY2xyRGdSb3dTZWxlY3Rpb24nKVxuICBzZXQgcm93U2VsZWN0aW9uTW9kZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2VsZWN0aW9uLnJvd1NlbGVjdGlvbk1vZGUgPSB2YWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyRGdJdGVtc1RyYWNrQnknKVxuICBzZXQgdHJhY2tCeSh2YWx1ZTogQ2xyRGF0YWdyaWRJdGVtc1RyYWNrQnlGdW5jdGlvbjxUPikge1xuICAgIHRoaXMuaXRlbXMudHJhY2tCeSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyBpZiBhbGwgY3VycmVudGx5IGRpc3BsYXllZCBpdGVtcyBhcmUgc2VsZWN0ZWRcbiAgICovXG4gIGdldCBhbGxTZWxlY3RlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uaXNBbGxTZWxlY3RlZCgpO1xuICB9XG4gIHNldCBhbGxTZWxlY3RlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLmN1c3RvbVNlbGVjdEFsbEVuYWJsZWQpIHtcbiAgICAgIHRoaXMuY3VzdG9tU2VsZWN0QWxsLmVtaXQodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgaXMgYSBzZXR0ZXIgYnV0IHdlIGlnbm9yZSB0aGUgdmFsdWUuXG4gICAgICAgKiBJdCdzIHN0cmFuZ2UsIGJ1dCBpdCBsZXRzIHVzIGhhdmUgYW4gaW5kZXRlcm1pbmF0ZSBzdGF0ZSB3aGVyZSBvbmx5XG4gICAgICAgKiBzb21lIG9mIHRoZSBpdGVtcyBhcmUgc2VsZWN0ZWQuXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2VsZWN0aW9uLnRvZ2dsZUFsbCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcbiAgICBpZiAodGhpcy52aXJ0dWFsU2Nyb2xsICYmIHRoaXMuX3ZpcnR1YWxTY3JvbGxTdWJzY3JpcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gdGhlIHZpcnR1YWwgc2Nyb2xsIHdpbGwgaGFuZGxlIHRoZSBzY3JvbGxpbmdcbiAgICAgIHRoaXMua2V5TmF2aWdhdGlvbi5wcmV2ZW50U2Nyb2xsT25Gb2N1cyA9ICEhdGhpcy52aXJ0dWFsU2Nyb2xsO1xuICAgICAgdGhpcy5fdmlydHVhbFNjcm9sbFN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgZnJvbUV2ZW50KHRoaXMuY29udGVudFdyYXBwZXIubmF0aXZlRWxlbWVudCwgJ3Njcm9sbCcpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuZGF0YWdyaWRIZWFkZXIubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0ICE9PSB0aGlzLmNvbnRlbnRXcmFwcGVyLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdCkge1xuICAgICAgICAgICAgdGhpcy5kYXRhZ3JpZEhlYWRlci5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQgPSB0aGlzLmNvbnRlbnRXcmFwcGVyLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICBmcm9tRXZlbnQodGhpcy5kYXRhZ3JpZEhlYWRlci5uYXRpdmVFbGVtZW50LCAnc2Nyb2xsJykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5kYXRhZ3JpZEhlYWRlci5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQgIT09IHRoaXMuY29udGVudFdyYXBwZXIubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0KSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRXcmFwcGVyLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdCA9IHRoaXMuZGF0YWdyaWRIZWFkZXIubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgIHRoaXMua2V5TmF2aWdhdGlvbi5uZXh0Q2VsbENvb3Jkc0VtaXR0ZXIuc3Vic2NyaWJlKGNlbGxDb29yZHMgPT4ge1xuICAgICAgICAgIGlmICghY2VsbENvb3Jkcz8uYXJpYVJvd0luZGV4KSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUNlbGxDb29yZHMgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjZWxsQ29vcmRzLmFyaWFSb3dJbmRleCA9PT0gdGhpcy5hY3RpdmVDZWxsQ29vcmRzPy5hcmlhUm93SW5kZXgpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ2VsbENvb3JkcyA9IGNlbGxDb29yZHM7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5hY3RpdmVDZWxsQ29vcmRzID0gY2VsbENvb3JkcztcblxuICAgICAgICAgIC8vIGFyaWEtcm93aW5kZXggaXMgYWx3YXlzICsgMS4gQ2hlY2sgdmlydHVhbCBzY3JvbGxlciB1cGRhdGVBcmlhUm93SW5kZXhlcyBtZXRob2QuXG4gICAgICAgICAgY29uc3Qgcm93SW5kZXggPSBOdW1iZXIoY2VsbENvb3Jkcy5hcmlhUm93SW5kZXgpIC0gMTtcblxuICAgICAgICAgIHRoaXMudmlydHVhbFNjcm9sbC5zY3JvbGxUb0luZGV4KHJvd0luZGV4KTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICghdGhpcy52aXJ0dWFsU2Nyb2xsICYmIHRoaXMuX3ZpcnR1YWxTY3JvbGxTdWJzY3JpcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIHRoZSB2aXJ0dWFsIHNjcm9sbCB3aWxsIGhhbmRsZSB0aGUgc2Nyb2xsaW5nXG4gICAgICB0aGlzLmtleU5hdmlnYXRpb24ucHJldmVudFNjcm9sbE9uRm9jdXMgPSAhIXRoaXMudmlydHVhbFNjcm9sbDtcbiAgICAgIHRoaXMuX3ZpcnR1YWxTY3JvbGxTdWJzY3JpcHRpb25zLmZvckVhY2goKHN1YjogU3Vic2NyaXB0aW9uKSA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gICAgICB0aGlzLl92aXJ0dWFsU2Nyb2xsU3Vic2NyaXB0aW9ucyA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuaXRlbXMuc21hcnQpIHtcbiAgICAgIHRoaXMuaXRlbXMuYWxsID0gdGhpcy5yb3dzLm1hcCgocm93OiBDbHJEYXRhZ3JpZFJvdzxUPikgPT4gcm93Lml0ZW0pO1xuICAgIH1cblxuICAgIGNvbnN0IHJvd0l0ZW1zQ2hhbmdlcyA9IHRoaXMucm93cy5jaGFuZ2VzLnBpcGUoXG4gICAgICBzd2l0Y2hNYXAoKHJvd3M6IENsckRhdGFncmlkUm93PFQ+W10pID0+XG4gICAgICAgIG1lcmdlKFxuICAgICAgICAgIC8vIGltbWVkaWF0ZSB1cGRhdGVcbiAgICAgICAgICBvZihyb3dzLm1hcChyb3cgPT4gcm93Lml0ZW0pKSxcbiAgICAgICAgICAvLyBzdWJzZXF1ZW50IHVwZGF0ZXMgb25jZSBwZXIgdGlja1xuICAgICAgICAgIGNvbWJpbmVMYXRlc3Qocm93cy5tYXAocm93ID0+IHJvdy5pdGVtQ2hhbmdlcykpLnBpcGUoZGVib3VuY2VUaW1lKDApKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcblxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHJvd0l0ZW1zQ2hhbmdlcy5zdWJzY3JpYmUoYWxsID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLml0ZW1zLnNtYXJ0KSB7XG4gICAgICAgICAgdGhpcy5pdGVtcy5hbGwgPSBhbGw7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5yb3dzLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgLy8gUmVtb3ZlIGFueSBwcm9qZWN0ZWQgcm93cyBmcm9tIHRoZSBkaXNwbGF5ZWRSb3dzIGNvbnRhaW5lclxuICAgICAgICAvLyBOZWNlc3Nhcnkgd2l0aCBJdnkgb2ZmLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3Ztd2FyZS9jbGFyaXR5L2lzc3Vlcy80NjkyXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl9kaXNwbGF5ZWRSb3dzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX2Rpc3BsYXllZFJvd3MuZ2V0KGkpLmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGxheWVkUm93cy5yZW1vdmUoaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgdGhpcy5fZGlzcGxheWVkUm93cy5pbnNlcnQocm93Ll92aWV3KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEZXRhaWxTdGF0ZSgpO1xuXG4gICAgICAgIC8vIHJldGFpbiBhY3RpdmUgY2VsbCB3aGVuIG5hdmlnYXRpbmcgd2l0aCBVcC9Eb3duIEFycm93cywgUGFnZVVwIGFuZCBQYWdlRG93biBidXR0b25zIGluIHZpcnR1YWwgc2Nyb2xsZXJcbiAgICAgICAgaWYgKHRoaXMudmlydHVhbFNjcm9sbCAmJiB0aGlzLmFjdGl2ZUNlbGxDb29yZHMpIHtcbiAgICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gQXJyYXkuZnJvbSh0aGlzLnJvd3MpLmZpbmQocm93ID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJvdy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdLmFyaWFSb3dJbmRleCA9PT0gdGhpcy5hY3RpdmVDZWxsQ29vcmRzLmFyaWFSb3dJbmRleDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIXJvdykge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGFjdGl2ZUNlbGwgPSByb3cuZWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMua2V5TmF2aWdhdGlvbi5jb25maWcua2V5R3JpZENlbGxzKVtcbiAgICAgICAgICAgICAgdGhpcy5hY3RpdmVDZWxsQ29vcmRzLnhcbiAgICAgICAgICAgIF0gYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgICAgIHRoaXMua2V5TmF2aWdhdGlvbi5zZXRBY3RpdmVDZWxsKGFjdGl2ZUNlbGwpO1xuICAgICAgICAgICAgdGhpcy5rZXlOYXZpZ2F0aW9uLmZvY3VzRWxlbWVudChhY3RpdmVDZWxsLCB7IHByZXZlbnRTY3JvbGw6IHRydWUgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdXIgc2V0dXAgaGFwcGVucyBpbiB0aGUgdmlldyBvZiBzb21lIG9mIG91ciBjb21wb25lbnRzLCBzbyB3ZSB3YWl0IGZvciBpdCB0byBiZSBkb25lIGJlZm9yZSBzdGFydGluZ1xuICAgKi9cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMua2V5TmF2aWdhdGlvbi5pbml0aWFsaXplS2V5R3JpZCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuXG4gICAgdGhpcy51cGRhdGVEZXRhaWxTdGF0ZSgpO1xuICAgIC8vIFRPRE86IGRldGVybWluZSBpZiB3ZSBjYW4gZ2V0IHJpZCBvZiBwcm92aWRlciB3aXJpbmcgaW4gdmlldyBpbml0IHNvIHRoYXQgc3Vic2NyaXB0aW9ucyBjYW4gYmUgZG9uZSBlYXJsaWVyXG4gICAgdGhpcy5yZWZyZXNoLmVtaXQodGhpcy5zdGF0ZVByb3ZpZGVyLnN0YXRlKTtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLnN0aWNreUhlYWRlcnMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5yZXNpemUoKSksXG4gICAgICB0aGlzLnN0YXRlUHJvdmlkZXIuY2hhbmdlLnN1YnNjcmliZShzdGF0ZSA9PiB0aGlzLnJlZnJlc2guZW1pdChzdGF0ZSkpLFxuICAgICAgdGhpcy5zZWxlY3Rpb24uY2hhbmdlLnN1YnNjcmliZShzID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuU2luZ2xlKSB7XG4gICAgICAgICAgdGhpcy5zaW5nbGVTZWxlY3RlZENoYW5nZWQuZW1pdChzIGFzIFQpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuTXVsdGkpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlZC5lbWl0KHMgYXMgVFtdKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICAvLyBSZWluaXRpYWxpemUgYXJyb3cga2V5IG5hdmlnYXRpb24gb24gcGFnZSBjaGFuZ2VzXG4gICAgICB0aGlzLnBhZ2UuY2hhbmdlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMua2V5TmF2aWdhdGlvbi5yZXNldEtleUdyaWQoKTtcbiAgICAgICAgaWYgKCF0aGlzLmNsckRnRGlzYWJsZVBhZ2VGb2N1cykge1xuICAgICAgICAgIHRoaXMuZGF0YWdyaWRUYWJsZS5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgLy8gQSBzdWJzY3JpcHRpb24gdGhhdCBsaXN0ZW5zIGZvciBkaXNwbGF5TW9kZSBjaGFuZ2VzIG9uIHRoZSBkYXRhZ3JpZFxuICAgICAgdGhpcy5kaXNwbGF5TW9kZS52aWV3LnN1YnNjcmliZSh2aWV3Q2hhbmdlID0+IHtcbiAgICAgICAgLy8gUmVtb3ZlIGFueSBwcm9qZWN0ZWQgY29sdW1ucyBmcm9tIHRoZSBwcm9qZWN0ZWREaXNwbGF5Q29sdW1ucyBjb250YWluZXJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX3Byb2plY3RlZERpc3BsYXlDb2x1bW5zLmxlbmd0aDsgaSA+IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMuX3Byb2plY3RlZERpc3BsYXlDb2x1bW5zLmRldGFjaCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlbW92ZSBhbnkgcHJvamVjdGVkIGNvbHVtbnMgZnJvbSB0aGUgcHJvamVjdGVkQ2FsY3VsYXRpb25Db2x1bW5zIGNvbnRhaW5lclxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fcHJvamVjdGVkQ2FsY3VsYXRpb25Db2x1bW5zLmxlbmd0aDsgaSA+IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMuX3Byb2plY3RlZENhbGN1bGF0aW9uQ29sdW1ucy5kZXRhY2goKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZW1vdmUgYW55IHByb2plY3RlZCByb3dzIGZyb20gdGhlIGNhbGN1bGF0aW9uUm93cyBjb250YWluZXJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX2NhbGN1bGF0aW9uUm93cy5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICB0aGlzLl9jYWxjdWxhdGlvblJvd3MuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVtb3ZlIGFueSBwcm9qZWN0ZWQgcm93cyBmcm9tIHRoZSBkaXNwbGF5ZWRSb3dzIGNvbnRhaW5lclxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fZGlzcGxheWVkUm93cy5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICB0aGlzLl9kaXNwbGF5ZWRSb3dzLmRldGFjaCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2aWV3Q2hhbmdlID09PSBEYXRhZ3JpZERpc3BsYXlNb2RlLkRJU1BMQVkpIHtcbiAgICAgICAgICAvLyBTZXQgc3RhdGUsIHN0eWxlIGZvciB0aGUgZGF0YWdyaWQgdG8gRElTUExBWSBhbmQgaW5zZXJ0IHJvdyAmIGNvbHVtbnMgaW50byBjb250YWluZXJzXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdkYXRhZ3JpZC1jYWxjdWxhdGUtbW9kZScpO1xuICAgICAgICAgIHRoaXMuY29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0ZWREaXNwbGF5Q29sdW1ucy5pbnNlcnQoY29sdW1uLl92aWV3KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGxheWVkUm93cy5pbnNlcnQocm93Ll92aWV3KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBTZXQgc3RhdGUsIHN0eWxlIGZvciB0aGUgZGF0YWdyaWQgdG8gQ0FMQ1VMQVRFIGFuZCBpbnNlcnQgcm93ICYgY29sdW1ucyBpbnRvIGNvbnRhaW5lcnNcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2RhdGFncmlkLWNhbGN1bGF0ZS1tb2RlJyk7XG4gICAgICAgICAgLy8gSW5zZXJ0cyBhIGZpeGVkIGNvbHVtbiBpZiBhbnkgb2YgdGhlc2UgY29uZGl0aW9ucyBhcmUgdHJ1ZS5cbiAgICAgICAgICBjb25zdCBmaXhlZENvbHVtbkNvbmRpdGlvbnMgPSBbXG4gICAgICAgICAgICB0aGlzLnJvd0FjdGlvblNlcnZpY2UuaGFzQWN0aW9uYWJsZVJvdyxcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgIT09IHRoaXMuU0VMRUNUSU9OX1RZUEUuTm9uZSxcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kYWJsZVJvd3MuaGFzRXhwYW5kYWJsZVJvdyB8fCB0aGlzLmRldGFpbFNlcnZpY2UuZW5hYmxlZCxcbiAgICAgICAgICBdO1xuICAgICAgICAgIGZpeGVkQ29sdW1uQ29uZGl0aW9uc1xuICAgICAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAgICAgLmZvckVhY2goKCkgPT5cbiAgICAgICAgICAgICAgdGhpcy5fcHJvamVjdGVkQ2FsY3VsYXRpb25Db2x1bW5zLmluc2VydCh0aGlzLl9maXhlZENvbHVtblRlbXBsYXRlLmNyZWF0ZUVtYmVkZGVkVmlldyhudWxsKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5jb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3RlZENhbGN1bGF0aW9uQ29sdW1ucy5pbnNlcnQoY29sdW1uLl92aWV3KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRpb25Sb3dzLmluc2VydChyb3cuX3ZpZXcpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG5cbiAgICAvLyBXZSBuZWVkIHRvIHByZXNlcnZlIHNoaWZ0IHN0YXRlLCBzbyBpdCBjYW4gYmUgdXNlZCBvbiBzZWxlY3Rpb24gY2hhbmdlLCByZWdhcmRsZXNzIG9mIHRoZSBpbnB1dCBldmVudFxuICAgIC8vIHRoYXQgdHJpZ2dlcmVkIHRoZSBjaGFuZ2UuIFRoaXMgaGVscHMgdXMgdG8gZWFzaWx5IHJlc29sdmUgdGhlIGsvYiBvbmx5IGNhc2UgdG9nZXRoZXIgd2l0aCB0aGUgbW91c2Ugc2VsZWN0aW9uIGNhc2UuXG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgZnJvbUV2ZW50KHRoaXMuZG9jdW1lbnQuYm9keSwgJ2tleWRvd24nKS5zdWJzY3JpYmUoKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ1NoaWZ0Jykge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc2hpZnRQcmVzc2VkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICBmcm9tRXZlbnQodGhpcy5kb2N1bWVudC5ib2R5LCAna2V5dXAnKS5zdWJzY3JpYmUoKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ1NoaWZ0Jykge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc2hpZnRQcmVzc2VkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuZm9yRWFjaCgoc3ViOiBTdWJzY3JpcHRpb24pID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcbiAgICB0aGlzLl92aXJ0dWFsU2Nyb2xsU3Vic2NyaXB0aW9ucy5mb3JFYWNoKChzdWI6IFN1YnNjcmlwdGlvbikgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgdG9nZ2xlQWxsU2VsZWN0ZWQoJGV2ZW50OiBhbnkpIHtcbiAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnNlbGVjdEFsbENoZWNrYm94Py5uYXRpdmVFbGVtZW50LmNsaWNrKCk7XG4gIH1cblxuICByZXNpemUoKTogdm9pZCB7XG4gICAgdGhpcy5vcmdhbml6ZXIucmVzaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHRoZSBzdGF0ZSBvZiBkZXRhaWwgcGFuZWwgYW5kIGlmIGl0J3Mgb3BlbmVkIHRoZW5cbiAgICogZmluZCB0aGUgbWF0Y2hpbmcgcm93IGFuZCB0cmlnZ2VyIHRoZSBkZXRhaWwgcGFuZWxcbiAgICovXG4gIHVwZGF0ZURldGFpbFN0YXRlKCkge1xuICAgIC8vIFRyeSB0byB1cGRhdGUgb25seSB3aGVuIHRoZXJlIGlzIHNvbWV0aGluZyBjYWNoZWQgYW5kIGl0cyBvcGVuLlxuICAgIGlmICh0aGlzLmRldGFpbFNlcnZpY2Uuc3RhdGUgJiYgdGhpcy5kZXRhaWxTZXJ2aWNlLmlzT3Blbikge1xuICAgICAgY29uc3Qgcm93ID0gdGhpcy5yb3dzLmZpbmQocm93ID0+IHRoaXMuaXRlbXMudHJhY2tCeShyb3cuaXRlbSkgPT09IHRoaXMuaXRlbXMudHJhY2tCeSh0aGlzLmRldGFpbFNlcnZpY2Uuc3RhdGUpKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBSZW9wZW4gdXBkYXRlZCByb3cgb3IgY2xvc2UgaXRcbiAgICAgICAqL1xuICAgICAgaWYgKHJvdykge1xuICAgICAgICB0aGlzLmRldGFpbFNlcnZpY2Uub3Blbihyb3cuaXRlbSwgcm93LmRldGFpbEJ1dHRvbi5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgLy8gYWx3YXlzIGtlZXAgb3BlbiB3aGVuIHZpcnR1YWwgc2Nyb2xsIGlzIGF2YWlsYWJsZSBvdGhlcndpc2UgY2xvc2UgaXRcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMudmlydHVhbFNjcm9sbCkge1xuICAgICAgICAvLyBVc2luZyBzZXRUaW1lb3V0IHRvIG1ha2Ugc3VyZSB0aGUgaW5uZXIgY3ljbGVzIGluIHJvd3MgYXJlIGRvbmVcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5kZXRhaWxTZXJ2aWNlLmNsb3NlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaWMgbWV0aG9kIHRvIHJlLXRyaWdnZXIgdGhlIGNvbXB1dGF0aW9uIG9mIGRpc3BsYXllZCBpdGVtcyBtYW51YWxseVxuICAgKi9cbiAgZGF0YUNoYW5nZWQoKSB7XG4gICAgdGhpcy5pdGVtcy5yZWZyZXNoKCk7XG4gIH1cbn1cbiIsIjwhLS1cbiAgfiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAgfiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gIH4gVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAgfiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gIC0tPlxuXG48bmctY29udGVudCBzZWxlY3Q9XCJjbHItZGctYWN0aW9uLWJhclwiPjwvbmctY29udGVudD5cbjxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1vdXRlci13cmFwcGVyXCI+XG4gIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1pbm5lci13cmFwcGVyXCI+XG4gICAgPGRpdiBjbGFzcz1cImRhdGFncmlkXCIgI2RhdGFncmlkIFthdHRyLmFyaWEtaGlkZGVuXT1cImRldGFpbFNlcnZpY2UuaXNPcGVuID8gdHJ1ZSA6IG51bGxcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC10YWJsZS13cmFwcGVyXCI+XG4gICAgICAgIDxkaXYgcm9sZT1cImdyaWRcIiBjbGFzcz1cImRhdGFncmlkLXRhYmxlXCIgdGFiaW5kZXg9XCItMVwiICNkYXRhZ3JpZFRhYmxlPlxuICAgICAgICAgIDxkaXYgcm9sZT1cInJvd2dyb3VwXCIgY2xhc3M9XCJkYXRhZ3JpZC1oZWFkZXJcIiAjZGF0YWdyaWRIZWFkZXI+XG4gICAgICAgICAgICA8ZGl2IHJvbGU9XCJyb3dcIiBjbGFzcz1cImRhdGFncmlkLXJvd1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtcm93LW1hc3RlciBkYXRhZ3JpZC1yb3ctZmxleFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1yb3ctc3RpY2t5XCI+XG4gICAgICAgICAgICAgICAgICA8IS0taGVhZGVyIGZvciBkYXRhZ3JpZCB3aGVyZSB5b3UgY2FuIHNlbGVjdCBtdWx0aXBsZSByb3dzIC0tPlxuICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAjc3RpY2t5SGVhZGVyXG4gICAgICAgICAgICAgICAgICAgIHJvbGU9XCJjb2x1bW5oZWFkZXJcIlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImRhdGFncmlkLWNvbHVtbiBkYXRhZ3JpZC1zZWxlY3QgZGF0YWdyaWQtZml4ZWQtY29sdW1uXCJcbiAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJzZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9PT0gU0VMRUNUSU9OX1RZUEUuTXVsdGlcIlxuICAgICAgICAgICAgICAgICAgICAoa2V5ZG93bi5zcGFjZSk9XCJ0b2dnbGVBbGxTZWxlY3RlZCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiAqbmdJZj1cIiF2aXJ0dWFsU2Nyb2xsIHx8IGN1c3RvbVNlbGVjdEFsbEVuYWJsZWRcIiBjbGFzcz1cImNsci1jaGVja2JveC13cmFwcGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPCEtLSBXZSBuZWVkIHRvIG1vdmUgZm9jdXMgYW5kIHNwYWNlLWtleSBoYW5kbGluZyB0byB0aGUgcGFyZW50IGJlY2F1c2Ugb2Yga2V5Ym9hcmQgYXJyb3cga2V5IG5hdmlnYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB3aGljaCBpcyBub3QgYWJsZSB0byB0cmFuc2ZlciBmb2N1cyBkaXJlY3RseSBvbiB0aGUgaW5wdXQgd2hlbiBmb2N1c2VkIHdpdGggdGhlIHRhYiBrZXkgLS0+XG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAjc2VsZWN0QWxsQ2hlY2tib3hcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbaWRdPVwic2VsZWN0QWxsSWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XCJhbGxTZWxlY3RlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy5zZWxlY3RBbGxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8IS0tIFVzYWdlIG9mIGNsYXNzIGNsci1jb2wtbnVsbCBoZXJlIHByZXZlbnRzIGNsci1jb2wtKiBjbGFzc2VzIGZyb20gYmVpbmcgYWRkZWQgd2hlbiBhIGRhdGFncmlkIGlzIHdyYXBwZWQgaW5zaWRlIGNsckZvcm0gLS0+XG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIFtmb3JdPVwic2VsZWN0QWxsSWRcIiBjbGFzcz1cImNsci1jb250cm9sLWxhYmVsIGNsci1jb2wtbnVsbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHItc3Itb25seVwiPnt7Y29tbW9uU3RyaW5ncy5rZXlzLnNlbGVjdEFsbH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4tc2VwYXJhdG9yXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwhLS0gaGVhZGVyIGZvciBkYXRhZ3JpZCB3aGVyZSB5b3UgY2FuIHNlbGVjdCBvbmUgcm93IG9ubHkgLS0+XG4gICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICNzdGlja3lIZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgcm9sZT1cImNvbHVtbmhlYWRlclwiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uIGRhdGFncmlkLXNlbGVjdCBkYXRhZ3JpZC1maXhlZC1jb2x1bW5cIlxuICAgICAgICAgICAgICAgICAgICAqbmdJZj1cInNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID09PSBTRUxFQ1RJT05fVFlQRS5TaW5nbGVcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57e2NsckRnU2luZ2xlU2VsZWN0aW9uQXJpYUxhYmVsfX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLWNvbHVtbi1zZXBhcmF0b3JcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPCEtLSBoZWFkZXIgZm9yIHNpbmdsZSByb3cgYWN0aW9uOyBvbmx5IGRpc3BsYXlUeXBlIGlmIHdlIGhhdmUgYXQgbGVhc3Qgb25lIGFjdGlvbmFibGUgcm93IGluIGRhdGFncmlkIC0tPlxuICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAjc3RpY2t5SGVhZGVyXG4gICAgICAgICAgICAgICAgICAgIHJvbGU9XCJjb2x1bW5oZWFkZXJcIlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImRhdGFncmlkLWNvbHVtbiBkYXRhZ3JpZC1yb3ctYWN0aW9ucyBkYXRhZ3JpZC1maXhlZC1jb2x1bW5cIlxuICAgICAgICAgICAgICAgICAgICAqbmdJZj1cInJvd0FjdGlvblNlcnZpY2UuaGFzQWN0aW9uYWJsZVJvd1wiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjbHItc3Itb25seVwiPnt7Y2xyRGdTaW5nbGVBY3Rpb25hYmxlQXJpYUxhYmVsfX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLWNvbHVtbi1zZXBhcmF0b3JcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPCEtLSBoZWFkZXIgZm9yIGNhcmV0czsgb25seSBkaXNwbGF5VHlwZSBpZiB3ZSBoYXZlIGF0IGxlYXN0IG9uZSBleHBhbmRhYmxlIHJvdyBpbiBkYXRhZ3JpZCAtLT5cbiAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgI3N0aWNreUhlYWRlclxuICAgICAgICAgICAgICAgICAgICByb2xlPVwiY29sdW1uaGVhZGVyXCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4gZGF0YWdyaWQtZXhwYW5kYWJsZS1jYXJldCBkYXRhZ3JpZC1maXhlZC1jb2x1bW5cIlxuICAgICAgICAgICAgICAgICAgICAqbmdJZj1cImV4cGFuZGFibGVSb3dzLmhhc0V4cGFuZGFibGVSb3cgfHwgZGV0YWlsU2VydmljZS5lbmFibGVkXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNsci1zci1vbmx5XCI+e3tjbHJEZXRhaWxFeHBhbmRhYmxlQXJpYUxhYmVsfX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLWNvbHVtbi1zZXBhcmF0b3JcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1yb3ctc2Nyb2xsYWJsZVwiPlxuICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAjcHJvamVjdGVkRGlzcGxheUNvbHVtbnM+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiAqbmdJZj1cInZpcnR1YWxTY3JvbGxcIiBjbGFzcz1cImRhdGFncmlkLXJvdy1zdGlja3kgZGF0YWdyaWQtcm93LXN0aWNreS1zY3JvbGxcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW5cIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1jb250ZW50XCIgW2NsYXNzLmRhdGFncmlkLWNvbnRlbnQtdmlydHVhbF09XCJ2aXJ0dWFsU2Nyb2xsXCIgI2NvbnRlbnRXcmFwcGVyPlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAqbmdJZj1cInZpcnR1YWxTY3JvbGxcIlxuICAgICAgICAgICAgICBjbGFzcz1cImRhdGFncmlkLWNvbnRlbnQtdmlydHVhbC1zcGFjZXJcIlxuICAgICAgICAgICAgICBbc3R5bGUuaGVpZ2h0XT1cInZpcnR1YWxTY3JvbGw/LnRvdGFsQ29udGVudEhlaWdodFwiXG4gICAgICAgICAgICA+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzcz1cImRhdGFncmlkLXJvd3NcIj5cbiAgICAgICAgICAgICAgPGNsci1kZy1yb3cgY2xhc3M9XCJkYXRhZ3JpZC1yb3ctbG9hZGluZ1wiICpuZ0lmPVwibG9hZGluZ01vcmVJdGVtc1wiPlxuICAgICAgICAgICAgICAgIDxjbHItZGctY2VsbD5cbiAgICAgICAgICAgICAgICAgIDxjbHItc3Bpbm5lciBjbHJNZWRpdW0+PC9jbHItc3Bpbm5lcj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPnt7IGNvbW1vblN0cmluZ3Mua2V5cy5sb2FkaW5nIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvY2xyLWRnLWNlbGw+XG4gICAgICAgICAgICAgIDwvY2xyLWRnLXJvdz5cblxuICAgICAgICAgICAgICA8bmctY29udGFpbmVyICNkaXNwbGF5ZWRSb3dzPjwvbmctY29udGFpbmVyPlxuXG4gICAgICAgICAgICAgIDxjbHItZGctcm93IGNsYXNzPVwiZGF0YWdyaWQtcm93LWxvYWRpbmdcIiAqbmdJZj1cImxvYWRpbmdNb3JlSXRlbXNcIj5cbiAgICAgICAgICAgICAgICA8Y2xyLWRnLWNlbGw+XG4gICAgICAgICAgICAgICAgICA8Y2xyLXNwaW5uZXIgY2xyTWVkaXVtPjwvY2xyLXNwaW5uZXI+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj57eyBjb21tb25TdHJpbmdzLmtleXMubG9hZGluZyB9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Nsci1kZy1jZWxsPlxuICAgICAgICAgICAgICA8L2Nsci1kZy1yb3c+XG5cbiAgICAgICAgICAgICAgPCEtLSBDdXN0b20gcGxhY2Vob2xkZXIgb3ZlcnJpZGVzIHRoZSBkZWZhdWx0IGVtcHR5IG9uZSAtLT5cbiAgICAgICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWRnLXBsYWNlaG9sZGVyXCI+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgICA8Y2xyLWRnLXBsYWNlaG9sZGVyICpuZ0lmPVwiIXBsYWNlaG9sZGVyXCI+PC9jbHItZGctcGxhY2Vob2xkZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItZGctZm9vdGVyXCI+PC9uZy1jb250ZW50PlxuICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1zcGlubmVyXCIgKm5nSWY9XCJsb2FkaW5nXCI+XG4gICAgICA8Y2xyLXNwaW5uZXIgY2xyTWVkaXVtPkxvYWRpbmc8L2Nsci1zcGlubmVyPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW2NscklmRGV0YWlsXSxjbHItZGctZGV0YWlsXCI+PC9uZy1jb250ZW50PlxuPC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1jYWxjdWxhdGlvbi10YWJsZVwiPlxuICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtY2FsY3VsYXRpb24taGVhZGVyXCI+XG4gICAgPG5nLWNvbnRhaW5lciAjcHJvamVjdGVkQ2FsY3VsYXRpb25Db2x1bW5zPjwvbmctY29udGFpbmVyPlxuICA8L2Rpdj5cbiAgPG5nLWNvbnRhaW5lciAjY2FsY3VsYXRpb25Sb3dzPjwvbmctY29udGFpbmVyPlxuPC9kaXY+XG5cbjxuZy10ZW1wbGF0ZSAjZml4ZWRDb2x1bW5UZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cImRhdGFncmlkLWNvbHVtbiBkYXRhZ3JpZC1maXhlZC1jb2x1bW5cIj48L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG4iXX0=
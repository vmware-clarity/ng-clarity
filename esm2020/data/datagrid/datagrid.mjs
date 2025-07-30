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
            if (this.virtualScroll) {
                const active = this.keyNavigation.getActiveCell();
                if (active) {
                    this.zone.runOutsideAngular(() => {
                        setTimeout(() => this.keyNavigation.setActiveCell(active));
                    });
                }
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
        if (this.virtualScroll) {
            this._subscriptions.push(fromEvent(this.contentWrapper.nativeElement, 'scroll').subscribe(() => {
                this.datagridHeader.nativeElement.scrollLeft = this.contentWrapper.nativeElement.scrollLeft;
            }));
        }
    }
    ngOnDestroy() {
        this._subscriptions.forEach((sub) => sub.unsubscribe());
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
    ], queries: [{ propertyName: "virtualScroll", first: true, predicate: ClrDatagridVirtualScrollDirective, descendants: true }, { propertyName: "iterator", first: true, predicate: ClrDatagridItems, descendants: true }, { propertyName: "placeholder", first: true, predicate: ClrDatagridPlaceholder, descendants: true }, { propertyName: "columns", predicate: ClrDatagridColumn }, { propertyName: "rows", predicate: ClrDatagridRow, emitDistinctChangesOnly: false }], viewQueries: [{ propertyName: "datagrid", first: true, predicate: ["datagrid"], descendants: true, read: ElementRef }, { propertyName: "datagridTable", first: true, predicate: ["datagridTable"], descendants: true, read: ElementRef }, { propertyName: "datagridHeader", first: true, predicate: ["datagridHeader"], descendants: true, read: ElementRef }, { propertyName: "contentWrapper", first: true, predicate: ["contentWrapper"], descendants: true, read: ElementRef }, { propertyName: "scrollableColumns", first: true, predicate: ["scrollableColumns"], descendants: true, read: ViewContainerRef }, { propertyName: "_projectedDisplayColumns", first: true, predicate: ["projectedDisplayColumns"], descendants: true, read: ViewContainerRef }, { propertyName: "_projectedCalculationColumns", first: true, predicate: ["projectedCalculationColumns"], descendants: true, read: ViewContainerRef }, { propertyName: "_displayedRows", first: true, predicate: ["displayedRows"], descendants: true, read: ViewContainerRef }, { propertyName: "_calculationRows", first: true, predicate: ["calculationRows"], descendants: true, read: ViewContainerRef }, { propertyName: "_fixedColumnTemplate", first: true, predicate: ["fixedColumnTemplate"], descendants: true }, { propertyName: "selectAllCheckbox", first: true, predicate: ["selectAllCheckbox"], descendants: true }, { propertyName: "stickyHeaders", predicate: ["stickyHeader"], descendants: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<ng-content select=\"clr-dg-action-bar\"></ng-content>\n<div class=\"datagrid-outer-wrapper\">\n  <div class=\"datagrid-inner-wrapper\">\n    <div class=\"datagrid\" #datagrid [attr.aria-hidden]=\"detailService.isOpen ? true : null\">\n      <div class=\"datagrid-table-wrapper\">\n        <div role=\"grid\" class=\"datagrid-table\" tabindex=\"-1\" #datagridTable>\n          <div role=\"rowgroup\" class=\"datagrid-header\" #datagridHeader>\n            <div role=\"row\" class=\"datagrid-row\">\n              <div class=\"datagrid-row-master datagrid-row-flex\">\n                <div class=\"datagrid-row-sticky\">\n                  <!--header for datagrid where you can select multiple rows -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    *ngIf=\"selection.selectionType === SELECTION_TYPE.Multi\"\n                    (keydown.space)=\"toggleAllSelected($event)\"\n                  >\n                    <div *ngIf=\"!virtualScroll || customSelectAllEnabled\" class=\"clr-checkbox-wrapper\">\n                      <!-- We need to move focus and space-key handling to the parent because of keyboard arrow key navigation,\n                           which is not able to transfer focus directly on the input when focused with the tab key -->\n                      <input\n                        #selectAllCheckbox\n                        type=\"checkbox\"\n                        [id]=\"selectAllId\"\n                        [(ngModel)]=\"allSelected\"\n                        [attr.aria-label]=\"commonStrings.keys.selectAll\"\n                        tabindex=\"-1\"\n                      />\n                      <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n                      <label [for]=\"selectAllId\" class=\"clr-control-label clr-col-null\">\n                        <span class=\"clr-sr-only\">{{commonStrings.keys.selectAll}}</span>\n                      </label>\n                    </div>\n\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for datagrid where you can select one row only -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    *ngIf=\"selection.selectionType === SELECTION_TYPE.Single\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleSelectionAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for single row action; only displayType if we have at least one actionable row in datagrid -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-row-actions datagrid-fixed-column\"\n                    *ngIf=\"rowActionService.hasActionableRow\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleActionableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for carets; only displayType if we have at least one expandable row in datagrid -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-expandable-caret datagrid-fixed-column\"\n                    *ngIf=\"expandableRows.hasExpandableRow || detailService.enabled\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDetailExpandableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                </div>\n                <div class=\"datagrid-row-scrollable\">\n                  <ng-container #projectedDisplayColumns></ng-container>\n                </div>\n                <div *ngIf=\"virtualScroll\" class=\"datagrid-row-sticky datagrid-row-sticky-scroll\">\n                  <div class=\"datagrid-column\"></div>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <div class=\"datagrid-content\" [class.datagrid-content-virtual]=\"virtualScroll\" #contentWrapper>\n            <div role=\"presentation\" class=\"datagrid-rows\">\n              <clr-dg-row class=\"datagrid-row-loading\" *ngIf=\"loadingMoreItems\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n\n              <ng-container #displayedRows></ng-container>\n\n              <clr-dg-row class=\"datagrid-row-loading\" *ngIf=\"loadingMoreItems\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n\n              <!-- Custom placeholder overrides the default empty one -->\n              <ng-content select=\"clr-dg-placeholder\"></ng-content>\n              <clr-dg-placeholder *ngIf=\"!placeholder\"></clr-dg-placeholder>\n            </div>\n            <div\n              *ngIf=\"virtualScroll\"\n              class=\"datagrid-content-virtual-spacer\"\n              [style.height]=\"virtualScroll?.totalContentHeight\"\n            ></div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <ng-content select=\"clr-dg-footer\"></ng-content>\n    <div class=\"datagrid-spinner\" *ngIf=\"loading\">\n      <clr-spinner clrMedium>Loading</clr-spinner>\n    </div>\n  </div>\n  <ng-content select=\"[clrIfDetail],clr-dg-detail\"></ng-content>\n</div>\n\n<div class=\"datagrid-calculation-table\">\n  <div class=\"datagrid-calculation-header\">\n    <ng-container #projectedCalculationColumns></ng-container>\n  </div>\n  <ng-container #calculationRows></ng-container>\n</div>\n\n<ng-template #fixedColumnTemplate>\n  <div class=\"datagrid-column datagrid-fixed-column\"></div>\n</ng-template>\n", dependencies: [{ kind: "directive", type: i12.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i13.ClrLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i14.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i14.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i14.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i15.ClrSpinner, selector: "clr-spinner", inputs: ["clrInline", "clrInverse", "clrSmall", "clrMedium"] }, { kind: "component", type: i16.ClrDatagridCell, selector: "clr-dg-cell" }, { kind: "component", type: i17.ClrDatagridPlaceholder, selector: "clr-dg-placeholder" }, { kind: "component", type: i18.ClrDatagridRow, selector: "clr-dg-row", inputs: ["clrDgDetailDisabled", "clrDgDetailHidden", "clrDgSkeletonLoading", "clrDgItem", "clrDgSelectable", "clrDgSelected", "clrDgExpanded", "clrDgDetailOpenLabel", "clrDgDetailCloseLabel", "clrDgRowSelectionLabel"], outputs: ["clrDgSelectedChange", "clrDgExpandedChange"] }, { kind: "directive", type: i19.ClrDatagridSelectionCellDirective, selector: ".datagrid-select" }, { kind: "directive", type: i20.DatagridCellRenderer, selector: "clr-dg-cell" }, { kind: "directive", type: i21.DatagridRowRenderer, selector: "clr-dg-row, clr-dg-row-detail" }, { kind: "directive", type: i22.ActionableOompaLoompa, selector: "clr-datagrid, clr-dg-row" }, { kind: "directive", type: i23.ExpandableOompaLoompa, selector: "clr-datagrid, clr-dg-row" }] });
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
                    }, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<ng-content select=\"clr-dg-action-bar\"></ng-content>\n<div class=\"datagrid-outer-wrapper\">\n  <div class=\"datagrid-inner-wrapper\">\n    <div class=\"datagrid\" #datagrid [attr.aria-hidden]=\"detailService.isOpen ? true : null\">\n      <div class=\"datagrid-table-wrapper\">\n        <div role=\"grid\" class=\"datagrid-table\" tabindex=\"-1\" #datagridTable>\n          <div role=\"rowgroup\" class=\"datagrid-header\" #datagridHeader>\n            <div role=\"row\" class=\"datagrid-row\">\n              <div class=\"datagrid-row-master datagrid-row-flex\">\n                <div class=\"datagrid-row-sticky\">\n                  <!--header for datagrid where you can select multiple rows -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    *ngIf=\"selection.selectionType === SELECTION_TYPE.Multi\"\n                    (keydown.space)=\"toggleAllSelected($event)\"\n                  >\n                    <div *ngIf=\"!virtualScroll || customSelectAllEnabled\" class=\"clr-checkbox-wrapper\">\n                      <!-- We need to move focus and space-key handling to the parent because of keyboard arrow key navigation,\n                           which is not able to transfer focus directly on the input when focused with the tab key -->\n                      <input\n                        #selectAllCheckbox\n                        type=\"checkbox\"\n                        [id]=\"selectAllId\"\n                        [(ngModel)]=\"allSelected\"\n                        [attr.aria-label]=\"commonStrings.keys.selectAll\"\n                        tabindex=\"-1\"\n                      />\n                      <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n                      <label [for]=\"selectAllId\" class=\"clr-control-label clr-col-null\">\n                        <span class=\"clr-sr-only\">{{commonStrings.keys.selectAll}}</span>\n                      </label>\n                    </div>\n\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for datagrid where you can select one row only -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    *ngIf=\"selection.selectionType === SELECTION_TYPE.Single\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleSelectionAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for single row action; only displayType if we have at least one actionable row in datagrid -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-row-actions datagrid-fixed-column\"\n                    *ngIf=\"rowActionService.hasActionableRow\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleActionableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for carets; only displayType if we have at least one expandable row in datagrid -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-expandable-caret datagrid-fixed-column\"\n                    *ngIf=\"expandableRows.hasExpandableRow || detailService.enabled\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDetailExpandableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                </div>\n                <div class=\"datagrid-row-scrollable\">\n                  <ng-container #projectedDisplayColumns></ng-container>\n                </div>\n                <div *ngIf=\"virtualScroll\" class=\"datagrid-row-sticky datagrid-row-sticky-scroll\">\n                  <div class=\"datagrid-column\"></div>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <div class=\"datagrid-content\" [class.datagrid-content-virtual]=\"virtualScroll\" #contentWrapper>\n            <div role=\"presentation\" class=\"datagrid-rows\">\n              <clr-dg-row class=\"datagrid-row-loading\" *ngIf=\"loadingMoreItems\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n\n              <ng-container #displayedRows></ng-container>\n\n              <clr-dg-row class=\"datagrid-row-loading\" *ngIf=\"loadingMoreItems\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n\n              <!-- Custom placeholder overrides the default empty one -->\n              <ng-content select=\"clr-dg-placeholder\"></ng-content>\n              <clr-dg-placeholder *ngIf=\"!placeholder\"></clr-dg-placeholder>\n            </div>\n            <div\n              *ngIf=\"virtualScroll\"\n              class=\"datagrid-content-virtual-spacer\"\n              [style.height]=\"virtualScroll?.totalContentHeight\"\n            ></div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <ng-content select=\"clr-dg-footer\"></ng-content>\n    <div class=\"datagrid-spinner\" *ngIf=\"loading\">\n      <clr-spinner clrMedium>Loading</clr-spinner>\n    </div>\n  </div>\n  <ng-content select=\"[clrIfDetail],clr-dg-detail\"></ng-content>\n</div>\n\n<div class=\"datagrid-calculation-table\">\n  <div class=\"datagrid-calculation-header\">\n    <ng-container #projectedCalculationColumns></ng-container>\n  </div>\n  <ng-container #calculationRows></ng-container>\n</div>\n\n<ng-template #fixedColumnTemplate>\n  <div class=\"datagrid-column datagrid-fixed-column\"></div>\n</ng-template>\n" }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2RhdGFncmlkLnRzIiwiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFHTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBR0wsTUFBTSxFQUlOLFNBQVMsRUFDVCxZQUFZLEVBQ1osZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHekQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN4RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFdkQs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QVM7dUJBQUMsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO2dCQUNFLGNBQWM7c0JBQWhFLFNBQVM7dUJBQUMsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO2dCQUNXLGlCQUFpQjtzQkFBNUUsU0FBUzt1QkFBQyxtQkFBbUIsRUFBRSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtnQkFDUSx3QkFBd0I7c0JBQXpGLFNBQVM7dUJBQUMseUJBQXlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBQ00sNEJBQTRCO3NCQUFqRyxTQUFTO3VCQUFDLDZCQUE2QixFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFO2dCQUNaLGNBQWM7c0JBQXJFLFNBQVM7dUJBQUMsZUFBZSxFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFO2dCQUNJLGdCQUFnQjtzQkFBekUsU0FBUzt1QkFBQyxpQkFBaUIsRUFBRSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtnQkFDdEIsb0JBQW9CO3NCQUFyRCxTQUFTO3VCQUFDLHFCQUFxQjtnQkFDaUMsYUFBYTtzQkFBN0UsWUFBWTt1QkFBQyxjQUFjLEVBQUUsRUFBRSx1QkFBdUIsRUFBRSxJQUFJLEVBQUU7Z0JBT3ZCLGlCQUFpQjtzQkFBeEQsU0FBUzt1QkFBQyxtQkFBbUI7Z0JBa0MxQixPQUFPO3NCQURWLEtBQUs7dUJBQUMsY0FBYztnQkFZakIsUUFBUTtzQkFEWCxLQUFLO3VCQUFDLGVBQWU7Z0JBY2xCLGNBQWM7c0JBRGpCLEtBQUs7dUJBQUMscUJBQXFCO2dCQWN4QixzQkFBc0I7c0JBRHpCLEtBQUs7Z0JBV0YsZ0JBQWdCO3NCQURuQixLQUFLO3VCQUFDLG1CQUFtQjtnQkFNdEIsT0FBTztzQkFEVixLQUFLO3VCQUFDLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFJlbmRlcmVyMixcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NoaWxkcmVuLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGNvbWJpbmVMYXRlc3QsIGZyb21FdmVudCwgbWVyZ2UsIG9mLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgc3dpdGNoTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBDbHJDb21tb25TdHJpbmdzU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL2kxOG4vY29tbW9uLXN0cmluZ3Muc2VydmljZSc7XG5pbXBvcnQgeyB1bmlxdWVJZEZhY3RvcnkgfSBmcm9tICcuLi8uLi91dGlscy9pZC1nZW5lcmF0b3IvaWQtZ2VuZXJhdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRDb2x1bW4gfSBmcm9tICcuL2RhdGFncmlkLWNvbHVtbic7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZEl0ZW1zIH0gZnJvbSAnLi9kYXRhZ3JpZC1pdGVtcyc7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZFBsYWNlaG9sZGVyIH0gZnJvbSAnLi9kYXRhZ3JpZC1wbGFjZWhvbGRlcic7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZFJvdyB9IGZyb20gJy4vZGF0YWdyaWQtcm93JztcbmltcG9ydCB7IENsckRhdGFncmlkVmlydHVhbFNjcm9sbERpcmVjdGl2ZSB9IGZyb20gJy4vZGF0YWdyaWQtdmlydHVhbC1zY3JvbGwuZGlyZWN0aXZlJztcbmltcG9ydCB7IERhdGFncmlkRGlzcGxheU1vZGUgfSBmcm9tICcuL2VudW1zL2Rpc3BsYXktbW9kZS5lbnVtJztcbmltcG9ydCB7IFNlbGVjdGlvblR5cGUgfSBmcm9tICcuL2VudW1zL3NlbGVjdGlvbi10eXBlJztcbmltcG9ydCB7IENsckRhdGFncmlkU3RhdGVJbnRlcmZhY2UgfSBmcm9tICcuL2ludGVyZmFjZXMvc3RhdGUuaW50ZXJmYWNlJztcbmltcG9ydCB7IENvbHVtbnNTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvY29sdW1ucy5zZXJ2aWNlJztcbmltcG9ydCB7IERldGFpbFNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9kZXRhaWwuc2VydmljZSc7XG5pbXBvcnQgeyBEaXNwbGF5TW9kZVNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9kaXNwbGF5LW1vZGUuc2VydmljZSc7XG5pbXBvcnQgeyBGaWx0ZXJzUHJvdmlkZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9maWx0ZXJzJztcbmltcG9ydCB7IEV4cGFuZGFibGVSb3dzQ291bnQgfSBmcm9tICcuL3Byb3ZpZGVycy9nbG9iYWwtZXhwYW5kYWJsZS1yb3dzJztcbmltcG9ydCB7IENsckRhdGFncmlkSXRlbXNUcmFja0J5RnVuY3Rpb24sIEl0ZW1zIH0gZnJvbSAnLi9wcm92aWRlcnMvaXRlbXMnO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gJy4vcHJvdmlkZXJzL3BhZ2UnO1xuaW1wb3J0IHsgUm93QWN0aW9uU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3Jvdy1hY3Rpb24tc2VydmljZSc7XG5pbXBvcnQgeyBTZWxlY3Rpb24gfSBmcm9tICcuL3Byb3ZpZGVycy9zZWxlY3Rpb24nO1xuaW1wb3J0IHsgU29ydCB9IGZyb20gJy4vcHJvdmlkZXJzL3NvcnQnO1xuaW1wb3J0IHsgU3RhdGVEZWJvdW5jZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9zdGF0ZS1kZWJvdW5jZXIucHJvdmlkZXInO1xuaW1wb3J0IHsgU3RhdGVQcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXJzL3N0YXRlLnByb3ZpZGVyJztcbmltcG9ydCB7IFRhYmxlU2l6ZVNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy90YWJsZS1zaXplLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGF0YWdyaWRSZW5kZXJPcmdhbml6ZXIgfSBmcm9tICcuL3JlbmRlci9yZW5kZXItb3JnYW5pemVyJztcbmltcG9ydCB7IEtleU5hdmlnYXRpb25HcmlkQ29udHJvbGxlciB9IGZyb20gJy4vdXRpbHMva2V5LW5hdmlnYXRpb24tZ3JpZC5jb250cm9sbGVyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWRhdGFncmlkJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2RhdGFncmlkLmh0bWwnLFxuICBwcm92aWRlcnM6IFtcbiAgICBTZWxlY3Rpb24sXG4gICAgU29ydCxcbiAgICBGaWx0ZXJzUHJvdmlkZXIsXG4gICAgUGFnZSxcbiAgICBJdGVtcyxcbiAgICBEYXRhZ3JpZFJlbmRlck9yZ2FuaXplcixcbiAgICBSb3dBY3Rpb25TZXJ2aWNlLFxuICAgIEV4cGFuZGFibGVSb3dzQ291bnQsXG4gICAgU3RhdGVEZWJvdW5jZXIsXG4gICAgRGV0YWlsU2VydmljZSxcbiAgICBTdGF0ZVByb3ZpZGVyLFxuICAgIFRhYmxlU2l6ZVNlcnZpY2UsXG4gICAgQ29sdW1uc1NlcnZpY2UsXG4gICAgRGlzcGxheU1vZGVTZXJ2aWNlLFxuICAgIEtleU5hdmlnYXRpb25HcmlkQ29udHJvbGxlcixcbiAgXSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuZGF0YWdyaWQtaG9zdF0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5kYXRhZ3JpZC1kZXRhaWwtb3Blbl0nOiAnZGV0YWlsU2VydmljZS5pc09wZW4nLFxuICAgICdbY2xhc3MuZGF0YWdyaWQtdmlydHVhbC1zY3JvbGxdJzogJyEhdmlydHVhbFNjcm9sbCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsckRhdGFncmlkPFQgPSBhbnk+IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KCdjbHJMb2FkaW5nTW9yZUl0ZW1zJykgbG9hZGluZ01vcmVJdGVtczogYm9vbGVhbjtcblxuICBASW5wdXQoKSBjbHJEZ1NpbmdsZVNlbGVjdGlvbkFyaWFMYWJlbDogc3RyaW5nID0gdGhpcy5jb21tb25TdHJpbmdzLmtleXMuc2luZ2xlU2VsZWN0aW9uQXJpYUxhYmVsO1xuICBASW5wdXQoKSBjbHJEZ1NpbmdsZUFjdGlvbmFibGVBcmlhTGFiZWw6IHN0cmluZyA9IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLnNpbmdsZUFjdGlvbmFibGVBcmlhTGFiZWw7XG4gIEBJbnB1dCgpIGNsckRldGFpbEV4cGFuZGFibGVBcmlhTGFiZWw6IHN0cmluZyA9IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmRldGFpbEV4cGFuZGFibGVBcmlhTGFiZWw7XG5cbiAgLy8gQWxsb3dzIGRpc2FibGluZyBvZiB0aGUgYXV0byBmb2N1cyBvbiBwYWdlL3N0YXRlIGNoYW5nZXMgKGV4Y2x1ZGVzIGZvY3VzIG1hbmFnZW1lbnQgaW5zaWRlIG9mIHBvcHVwcylcbiAgQElucHV0KCkgY2xyRGdEaXNhYmxlUGFnZUZvY3VzID0gZmFsc2U7XG5cbiAgQE91dHB1dCgnY2xyRGdTZWxlY3RlZENoYW5nZScpIHNlbGVjdGVkQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8VFtdPihmYWxzZSk7XG4gIEBPdXRwdXQoJ2NsckRnU2luZ2xlU2VsZWN0ZWRDaGFuZ2UnKSBzaW5nbGVTZWxlY3RlZENoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPFQ+KGZhbHNlKTtcblxuICAvKipcbiAgICogT3V0cHV0IGVtaXR0ZWQgd2hlbmV2ZXIgdGhlIGRhdGEgbmVlZHMgdG8gYmUgcmVmcmVzaGVkLCBiYXNlZCBvbiB1c2VyIGFjdGlvbiBvciBleHRlcm5hbCBvbmVzXG4gICAqL1xuICBAT3V0cHV0KCdjbHJEZ1JlZnJlc2gnKSByZWZyZXNoID0gbmV3IEV2ZW50RW1pdHRlcjxDbHJEYXRhZ3JpZFN0YXRlSW50ZXJmYWNlPFQ+PihmYWxzZSk7XG5cbiAgLyoqXG4gICAqIFRoZSBhcHBsaWNhdGlvbiBjYW4gcHJvdmlkZSBjdXN0b20gc2VsZWN0IGFsbCBsb2dpYy5cbiAgICovXG4gIEBJbnB1dCgnY2xyRGdDdXN0b21TZWxlY3RBbGxFbmFibGVkJykgY3VzdG9tU2VsZWN0QWxsRW5hYmxlZCA9IGZhbHNlO1xuICBAT3V0cHV0KCdjbHJEZ0N1c3RvbVNlbGVjdEFsbCcpIGN1c3RvbVNlbGVjdEFsbCA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAvKipcbiAgICogRXhwb3NlIHZpcnR1YWwgc2Nyb2xsIGRpcmVjdGl2ZSBmb3IgYXBwbGljYXRpb25zIHRvIGFjY2VzcyBpdHMgcHVibGljIG1ldGhvZHNcbiAgICovXG4gIEBDb250ZW50Q2hpbGQoQ2xyRGF0YWdyaWRWaXJ0dWFsU2Nyb2xsRGlyZWN0aXZlKSB2aXJ0dWFsU2Nyb2xsOiBDbHJEYXRhZ3JpZFZpcnR1YWxTY3JvbGxEaXJlY3RpdmU8YW55PjtcblxuICAvKipcbiAgICogV2UgZ3JhYiB0aGUgc21hcnQgaXRlcmF0b3IgZnJvbSBwcm9qZWN0ZWQgY29udGVudFxuICAgKi9cbiAgQENvbnRlbnRDaGlsZChDbHJEYXRhZ3JpZEl0ZW1zKSBpdGVyYXRvcjogQ2xyRGF0YWdyaWRJdGVtczxUPjtcblxuICAvKipcbiAgICogQ3VzdG9tIHBsYWNlaG9sZGVyIGRldGVjdGlvblxuICAgKi9cbiAgQENvbnRlbnRDaGlsZChDbHJEYXRhZ3JpZFBsYWNlaG9sZGVyKSBwbGFjZWhvbGRlcjogQ2xyRGF0YWdyaWRQbGFjZWhvbGRlcjxUPjtcblxuICAvKipcbiAgICogSGlkZWFibGUgQ29sdW1uIGRhdGEgc291cmNlIC8gZGV0ZWN0aW9uLlxuICAgKi9cbiAgQENvbnRlbnRDaGlsZHJlbihDbHJEYXRhZ3JpZENvbHVtbikgY29sdW1uczogUXVlcnlMaXN0PENsckRhdGFncmlkQ29sdW1uPFQ+PjtcblxuICAvKipcbiAgICogV2hlbiB0aGUgZGF0YWdyaWQgaXMgdXNlci1tYW5hZ2VkIHdpdGhvdXQgdGhlIHNtYXJ0IGl0ZXJhdG9yLCB3ZSBnZXQgdGhlIGl0ZW1zIGRpc3BsYXllZFxuICAgKiBieSBxdWVyeWluZyB0aGUgcHJvamVjdGVkIGNvbnRlbnQuIFRoaXMgaXMgbmVlZGVkIHRvIGtlZXAgdHJhY2sgb2YgdGhlIG1vZGVscyBjdXJyZW50bHlcbiAgICogZGlzcGxheWVkLCB0eXBpY2FsbHkgZm9yIHNlbGVjdGlvbi5cbiAgICovXG4gIEBDb250ZW50Q2hpbGRyZW4oQ2xyRGF0YWdyaWRSb3csIHsgZW1pdERpc3RpbmN0Q2hhbmdlc09ubHk6IGZhbHNlIH0pIHJvd3M6IFF1ZXJ5TGlzdDxDbHJEYXRhZ3JpZFJvdzxUPj47XG5cbiAgQFZpZXdDaGlsZCgnZGF0YWdyaWQnLCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSkgZGF0YWdyaWQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdkYXRhZ3JpZFRhYmxlJywgeyByZWFkOiBFbGVtZW50UmVmIH0pIGRhdGFncmlkVGFibGU6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdkYXRhZ3JpZEhlYWRlcicsIHsgcmVhZDogRWxlbWVudFJlZiB9KSBkYXRhZ3JpZEhlYWRlcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ2NvbnRlbnRXcmFwcGVyJywgeyByZWFkOiBFbGVtZW50UmVmIH0pIGNvbnRlbnRXcmFwcGVyOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgnc2Nyb2xsYWJsZUNvbHVtbnMnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSkgc2Nyb2xsYWJsZUNvbHVtbnM6IFZpZXdDb250YWluZXJSZWY7XG4gIEBWaWV3Q2hpbGQoJ3Byb2plY3RlZERpc3BsYXlDb2x1bW5zJywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmIH0pIF9wcm9qZWN0ZWREaXNwbGF5Q29sdW1uczogVmlld0NvbnRhaW5lclJlZjtcbiAgQFZpZXdDaGlsZCgncHJvamVjdGVkQ2FsY3VsYXRpb25Db2x1bW5zJywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmIH0pIF9wcm9qZWN0ZWRDYWxjdWxhdGlvbkNvbHVtbnM6IFZpZXdDb250YWluZXJSZWY7XG4gIEBWaWV3Q2hpbGQoJ2Rpc3BsYXllZFJvd3MnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSkgX2Rpc3BsYXllZFJvd3M6IFZpZXdDb250YWluZXJSZWY7XG4gIEBWaWV3Q2hpbGQoJ2NhbGN1bGF0aW9uUm93cycsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSBfY2FsY3VsYXRpb25Sb3dzOiBWaWV3Q29udGFpbmVyUmVmO1xuICBAVmlld0NoaWxkKCdmaXhlZENvbHVtblRlbXBsYXRlJykgX2ZpeGVkQ29sdW1uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG4gIEBWaWV3Q2hpbGRyZW4oJ3N0aWNreUhlYWRlcicsIHsgZW1pdERpc3RpbmN0Q2hhbmdlc09ubHk6IHRydWUgfSkgc3RpY2t5SGVhZGVyczogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xuXG4gIHNlbGVjdEFsbElkOiBzdHJpbmc7XG5cbiAgLyogcmVmZXJlbmNlIHRvIHRoZSBlbnVtIHNvIHRoYXQgdGVtcGxhdGUgY2FuIGFjY2VzcyAqL1xuICBTRUxFQ1RJT05fVFlQRSA9IFNlbGVjdGlvblR5cGU7XG5cbiAgQFZpZXdDaGlsZCgnc2VsZWN0QWxsQ2hlY2tib3gnKSBwcml2YXRlIHNlbGVjdEFsbENoZWNrYm94OiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+O1xuXG4gIC8qKlxuICAgKiBTdWJzY3JpcHRpb25zIHRvIGFsbCB0aGUgc2VydmljZXMgYW5kIHF1ZXJpZXMgY2hhbmdlc1xuICAgKi9cbiAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG9yZ2FuaXplcjogRGF0YWdyaWRSZW5kZXJPcmdhbml6ZXIsXG4gICAgcHVibGljIGl0ZW1zOiBJdGVtczxUPixcbiAgICBwdWJsaWMgZXhwYW5kYWJsZVJvd3M6IEV4cGFuZGFibGVSb3dzQ291bnQsXG4gICAgcHVibGljIHNlbGVjdGlvbjogU2VsZWN0aW9uPFQ+LFxuICAgIHB1YmxpYyByb3dBY3Rpb25TZXJ2aWNlOiBSb3dBY3Rpb25TZXJ2aWNlLFxuICAgIHByaXZhdGUgc3RhdGVQcm92aWRlcjogU3RhdGVQcm92aWRlcjxUPixcbiAgICBwcml2YXRlIGRpc3BsYXlNb2RlOiBEaXNwbGF5TW9kZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyBkZXRhaWxTZXJ2aWNlOiBEZXRhaWxTZXJ2aWNlLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueSxcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgcGFnZTogUGFnZSxcbiAgICBwdWJsaWMgY29tbW9uU3RyaW5nczogQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UsXG4gICAgcHVibGljIGtleU5hdmlnYXRpb246IEtleU5hdmlnYXRpb25HcmlkQ29udHJvbGxlcixcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZVxuICApIHtcbiAgICBjb25zdCBkYXRhZ3JpZElkID0gdW5pcXVlSWRGYWN0b3J5KCk7XG5cbiAgICB0aGlzLnNlbGVjdEFsbElkID0gJ2Nsci1kZy1zZWxlY3QtYWxsLScgKyBkYXRhZ3JpZElkO1xuICAgIGRldGFpbFNlcnZpY2UuaWQgPSBkYXRhZ3JpZElkO1xuICB9XG5cbiAgLyoqXG4gICAqIEZyZWV6ZXMgdGhlIGRhdGFncmlkIHdoaWxlIGRhdGEgaXMgbG9hZGluZ1xuICAgKi9cbiAgQElucHV0KCdjbHJEZ0xvYWRpbmcnKVxuICBnZXQgbG9hZGluZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5sb2FkaW5nO1xuICB9XG4gIHNldCBsb2FkaW5nKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5pdGVtcy5sb2FkaW5nID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQXJyYXkgb2YgYWxsIHNlbGVjdGVkIGl0ZW1zXG4gICAqL1xuICBASW5wdXQoJ2NsckRnU2VsZWN0ZWQnKVxuICBzZXQgc2VsZWN0ZWQodmFsdWU6IFRbXSB8IHVuZGVmaW5lZCkge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5zZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9IFNlbGVjdGlvblR5cGUuTXVsdGk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPSBTZWxlY3Rpb25UeXBlLk5vbmU7XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0aW9uLnVwZGF0ZUN1cnJlbnQodmFsdWUsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RlZCBpdGVtIGluIHNpbmdsZS1zZWxlY3QgbW9kZVxuICAgKi9cbiAgQElucHV0KCdjbHJEZ1NpbmdsZVNlbGVjdGVkJylcbiAgc2V0IHNpbmdsZVNlbGVjdGVkKHZhbHVlOiBUKSB7XG4gICAgdGhpcy5zZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9IFNlbGVjdGlvblR5cGUuU2luZ2xlO1xuICAgIC8vIHRoZSBjbHJEZ1NpbmdsZVNlbGVjdGVkIGlzIHVwZGF0ZWQgaW4gb25lIG9mIHR3byBjYXNlczpcbiAgICAvLyAxLiBhbiBleHBsaWNpdCB2YWx1ZSBpcyBwYXNzZWRcbiAgICAvLyAyLiBpcyBiZWluZyBzZXQgdG8gbnVsbCBvciB1bmRlZmluZWQsIHdoZXJlIHByZXZpb3VzbHkgaXQgaGFkIGEgdmFsdWVcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uLmN1cnJlbnRTaW5nbGUgPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2VsZWN0aW9uLmN1cnJlbnRTaW5nbGUpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uLmN1cnJlbnRTaW5nbGUgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBjbHJEZ1ByZXNlcnZlU2VsZWN0aW9uKHN0YXRlOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZWxlY3Rpb24ucHJlc2VydmVTZWxlY3Rpb24gPSBzdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBzaW5jZSAyLjAsIHJlbW92ZSBpbiAzLjBcbiAgICpcbiAgICogU2VsZWN0aW9uL0Rlc2VsZWN0aW9uIG9uIHJvdyBjbGljayBtb2RlXG4gICAqL1xuICBASW5wdXQoJ2NsckRnUm93U2VsZWN0aW9uJylcbiAgc2V0IHJvd1NlbGVjdGlvbk1vZGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNlbGVjdGlvbi5yb3dTZWxlY3Rpb25Nb2RlID0gdmFsdWU7XG4gIH1cblxuICBASW5wdXQoJ2NsckRnSXRlbXNUcmFja0J5JylcbiAgc2V0IHRyYWNrQnkodmFsdWU6IENsckRhdGFncmlkSXRlbXNUcmFja0J5RnVuY3Rpb248VD4pIHtcbiAgICB0aGlzLml0ZW1zLnRyYWNrQnkgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgYWxsIGN1cnJlbnRseSBkaXNwbGF5ZWQgaXRlbXMgYXJlIHNlbGVjdGVkXG4gICAqL1xuICBnZXQgYWxsU2VsZWN0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uLmlzQWxsU2VsZWN0ZWQoKTtcbiAgfVxuICBzZXQgYWxsU2VsZWN0ZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5jdXN0b21TZWxlY3RBbGxFbmFibGVkKSB7XG4gICAgICB0aGlzLmN1c3RvbVNlbGVjdEFsbC5lbWl0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGlzIGlzIGEgc2V0dGVyIGJ1dCB3ZSBpZ25vcmUgdGhlIHZhbHVlLlxuICAgICAgICogSXQncyBzdHJhbmdlLCBidXQgaXQgbGV0cyB1cyBoYXZlIGFuIGluZGV0ZXJtaW5hdGUgc3RhdGUgd2hlcmUgb25seVxuICAgICAgICogc29tZSBvZiB0aGUgaXRlbXMgYXJlIHNlbGVjdGVkLlxuICAgICAgICovXG4gICAgICB0aGlzLnNlbGVjdGlvbi50b2dnbGVBbGwoKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgaWYgKCF0aGlzLml0ZW1zLnNtYXJ0KSB7XG4gICAgICB0aGlzLml0ZW1zLmFsbCA9IHRoaXMucm93cy5tYXAoKHJvdzogQ2xyRGF0YWdyaWRSb3c8VD4pID0+IHJvdy5pdGVtKTtcbiAgICB9XG5cbiAgICBjb25zdCByb3dJdGVtc0NoYW5nZXMgPSB0aGlzLnJvd3MuY2hhbmdlcy5waXBlKFxuICAgICAgc3dpdGNoTWFwKChyb3dzOiBDbHJEYXRhZ3JpZFJvdzxUPltdKSA9PlxuICAgICAgICBtZXJnZShcbiAgICAgICAgICAvLyBpbW1lZGlhdGUgdXBkYXRlXG4gICAgICAgICAgb2Yocm93cy5tYXAocm93ID0+IHJvdy5pdGVtKSksXG4gICAgICAgICAgLy8gc3Vic2VxdWVudCB1cGRhdGVzIG9uY2UgcGVyIHRpY2tcbiAgICAgICAgICBjb21iaW5lTGF0ZXN0KHJvd3MubWFwKHJvdyA9PiByb3cuaXRlbUNoYW5nZXMpKS5waXBlKGRlYm91bmNlVGltZSgwKSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG5cbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICByb3dJdGVtc0NoYW5nZXMuc3Vic2NyaWJlKGFsbCA9PiB7XG4gICAgICAgIGlmICghdGhpcy5pdGVtcy5zbWFydCkge1xuICAgICAgICAgIHRoaXMuaXRlbXMuYWxsID0gYWxsO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHRoaXMucm93cy5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIFJlbW92ZSBhbnkgcHJvamVjdGVkIHJvd3MgZnJvbSB0aGUgZGlzcGxheWVkUm93cyBjb250YWluZXJcbiAgICAgICAgLy8gTmVjZXNzYXJ5IHdpdGggSXZ5IG9mZi4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS92bXdhcmUvY2xhcml0eS9pc3N1ZXMvNDY5MlxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fZGlzcGxheWVkUm93cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmICh0aGlzLl9kaXNwbGF5ZWRSb3dzLmdldChpKS5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXllZFJvd3MucmVtb3ZlKGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICAgIHRoaXMuX2Rpc3BsYXllZFJvd3MuaW5zZXJ0KHJvdy5fdmlldyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGV0YWlsU3RhdGUoKTtcblxuICAgICAgICAvLyByZXRhaW4gYWN0aXZlIGNlbGwgd2hlbiBuYXZpZ2F0aW5nIHdpdGggVXAvRG93biBBcnJvd3MsIFBhZ2VVcCBhbmQgUGFnZURvd24gYnV0dG9ucyBpbiB2aXJ0dWFsIHNjcm9sbGVyXG4gICAgICAgIGlmICh0aGlzLnZpcnR1YWxTY3JvbGwpIHtcbiAgICAgICAgICBjb25zdCBhY3RpdmUgPSB0aGlzLmtleU5hdmlnYXRpb24uZ2V0QWN0aXZlQ2VsbCgpO1xuICAgICAgICAgIGlmIChhY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5rZXlOYXZpZ2F0aW9uLnNldEFjdGl2ZUNlbGwoYWN0aXZlKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdXIgc2V0dXAgaGFwcGVucyBpbiB0aGUgdmlldyBvZiBzb21lIG9mIG91ciBjb21wb25lbnRzLCBzbyB3ZSB3YWl0IGZvciBpdCB0byBiZSBkb25lIGJlZm9yZSBzdGFydGluZ1xuICAgKi9cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMua2V5TmF2aWdhdGlvbi5pbml0aWFsaXplS2V5R3JpZCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMudXBkYXRlRGV0YWlsU3RhdGUoKTtcbiAgICAvLyBUT0RPOiBkZXRlcm1pbmUgaWYgd2UgY2FuIGdldCByaWQgb2YgcHJvdmlkZXIgd2lyaW5nIGluIHZpZXcgaW5pdCBzbyB0aGF0IHN1YnNjcmlwdGlvbnMgY2FuIGJlIGRvbmUgZWFybGllclxuICAgIHRoaXMucmVmcmVzaC5lbWl0KHRoaXMuc3RhdGVQcm92aWRlci5zdGF0ZSk7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgdGhpcy5zdGlja3lIZWFkZXJzLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHRoaXMucmVzaXplKCkpLFxuICAgICAgdGhpcy5zdGF0ZVByb3ZpZGVyLmNoYW5nZS5zdWJzY3JpYmUoc3RhdGUgPT4gdGhpcy5yZWZyZXNoLmVtaXQoc3RhdGUpKSxcbiAgICAgIHRoaXMuc2VsZWN0aW9uLmNoYW5nZS5zdWJzY3JpYmUocyA9PiB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLlNpbmdsZSkge1xuICAgICAgICAgIHRoaXMuc2luZ2xlU2VsZWN0ZWRDaGFuZ2VkLmVtaXQocyBhcyBUKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLk11bHRpKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZENoYW5nZWQuZW1pdChzIGFzIFRbXSk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgLy8gUmVpbml0aWFsaXplIGFycm93IGtleSBuYXZpZ2F0aW9uIG9uIHBhZ2UgY2hhbmdlc1xuICAgICAgdGhpcy5wYWdlLmNoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLmtleU5hdmlnYXRpb24ucmVzZXRLZXlHcmlkKCk7XG4gICAgICAgIGlmICghdGhpcy5jbHJEZ0Rpc2FibGVQYWdlRm9jdXMpIHtcbiAgICAgICAgICB0aGlzLmRhdGFncmlkVGFibGUubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIC8vIEEgc3Vic2NyaXB0aW9uIHRoYXQgbGlzdGVucyBmb3IgZGlzcGxheU1vZGUgY2hhbmdlcyBvbiB0aGUgZGF0YWdyaWRcbiAgICAgIHRoaXMuZGlzcGxheU1vZGUudmlldy5zdWJzY3JpYmUodmlld0NoYW5nZSA9PiB7XG4gICAgICAgIC8vIFJlbW92ZSBhbnkgcHJvamVjdGVkIGNvbHVtbnMgZnJvbSB0aGUgcHJvamVjdGVkRGlzcGxheUNvbHVtbnMgY29udGFpbmVyXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl9wcm9qZWN0ZWREaXNwbGF5Q29sdW1ucy5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICB0aGlzLl9wcm9qZWN0ZWREaXNwbGF5Q29sdW1ucy5kZXRhY2goKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZW1vdmUgYW55IHByb2plY3RlZCBjb2x1bW5zIGZyb20gdGhlIHByb2plY3RlZENhbGN1bGF0aW9uQ29sdW1ucyBjb250YWluZXJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX3Byb2plY3RlZENhbGN1bGF0aW9uQ29sdW1ucy5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICB0aGlzLl9wcm9qZWN0ZWRDYWxjdWxhdGlvbkNvbHVtbnMuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVtb3ZlIGFueSBwcm9qZWN0ZWQgcm93cyBmcm9tIHRoZSBjYWxjdWxhdGlvblJvd3MgY29udGFpbmVyXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl9jYWxjdWxhdGlvblJvd3MubGVuZ3RoOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgdGhpcy5fY2FsY3VsYXRpb25Sb3dzLmRldGFjaCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlbW92ZSBhbnkgcHJvamVjdGVkIHJvd3MgZnJvbSB0aGUgZGlzcGxheWVkUm93cyBjb250YWluZXJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX2Rpc3BsYXllZFJvd3MubGVuZ3RoOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgdGhpcy5fZGlzcGxheWVkUm93cy5kZXRhY2goKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmlld0NoYW5nZSA9PT0gRGF0YWdyaWREaXNwbGF5TW9kZS5ESVNQTEFZKSB7XG4gICAgICAgICAgLy8gU2V0IHN0YXRlLCBzdHlsZSBmb3IgdGhlIGRhdGFncmlkIHRvIERJU1BMQVkgYW5kIGluc2VydCByb3cgJiBjb2x1bW5zIGludG8gY29udGFpbmVyc1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnZGF0YWdyaWQtY2FsY3VsYXRlLW1vZGUnKTtcbiAgICAgICAgICB0aGlzLmNvbHVtbnMuZm9yRWFjaChjb2x1bW4gPT4ge1xuICAgICAgICAgICAgdGhpcy5fcHJvamVjdGVkRGlzcGxheUNvbHVtbnMuaW5zZXJ0KGNvbHVtbi5fdmlldyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5yb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXllZFJvd3MuaW5zZXJ0KHJvdy5fdmlldyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gU2V0IHN0YXRlLCBzdHlsZSBmb3IgdGhlIGRhdGFncmlkIHRvIENBTENVTEFURSBhbmQgaW5zZXJ0IHJvdyAmIGNvbHVtbnMgaW50byBjb250YWluZXJzXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdkYXRhZ3JpZC1jYWxjdWxhdGUtbW9kZScpO1xuICAgICAgICAgIC8vIEluc2VydHMgYSBmaXhlZCBjb2x1bW4gaWYgYW55IG9mIHRoZXNlIGNvbmRpdGlvbnMgYXJlIHRydWUuXG4gICAgICAgICAgY29uc3QgZml4ZWRDb2x1bW5Db25kaXRpb25zID0gW1xuICAgICAgICAgICAgdGhpcy5yb3dBY3Rpb25TZXJ2aWNlLmhhc0FjdGlvbmFibGVSb3csXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlICE9PSB0aGlzLlNFTEVDVElPTl9UWVBFLk5vbmUsXG4gICAgICAgICAgICB0aGlzLmV4cGFuZGFibGVSb3dzLmhhc0V4cGFuZGFibGVSb3cgfHwgdGhpcy5kZXRhaWxTZXJ2aWNlLmVuYWJsZWQsXG4gICAgICAgICAgXTtcbiAgICAgICAgICBmaXhlZENvbHVtbkNvbmRpdGlvbnNcbiAgICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgICAgICAgIC5mb3JFYWNoKCgpID0+XG4gICAgICAgICAgICAgIHRoaXMuX3Byb2plY3RlZENhbGN1bGF0aW9uQ29sdW1ucy5pbnNlcnQodGhpcy5fZml4ZWRDb2x1bW5UZW1wbGF0ZS5jcmVhdGVFbWJlZGRlZFZpZXcobnVsbCkpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuY29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0ZWRDYWxjdWxhdGlvbkNvbHVtbnMuaW5zZXJ0KGNvbHVtbi5fdmlldyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5yb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0aW9uUm93cy5pbnNlcnQocm93Ll92aWV3KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuXG4gICAgLy8gV2UgbmVlZCB0byBwcmVzZXJ2ZSBzaGlmdCBzdGF0ZSwgc28gaXQgY2FuIGJlIHVzZWQgb24gc2VsZWN0aW9uIGNoYW5nZSwgcmVnYXJkbGVzcyBvZiB0aGUgaW5wdXQgZXZlbnRcbiAgICAvLyB0aGF0IHRyaWdnZXJlZCB0aGUgY2hhbmdlLiBUaGlzIGhlbHBzIHVzIHRvIGVhc2lseSByZXNvbHZlIHRoZSBrL2Igb25seSBjYXNlIHRvZ2V0aGVyIHdpdGggdGhlIG1vdXNlIHNlbGVjdGlvbiBjYXNlLlxuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgIGZyb21FdmVudCh0aGlzLmRvY3VtZW50LmJvZHksICdrZXlkb3duJykuc3Vic2NyaWJlKChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChldmVudC5rZXkgPT09ICdTaGlmdCcpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uLnNoaWZ0UHJlc3NlZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICAgZnJvbUV2ZW50KHRoaXMuZG9jdW1lbnQuYm9keSwgJ2tleXVwJykuc3Vic2NyaWJlKChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChldmVudC5rZXkgPT09ICdTaGlmdCcpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uLnNoaWZ0UHJlc3NlZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSk7XG4gICAgaWYgKHRoaXMudmlydHVhbFNjcm9sbCkge1xuICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICBmcm9tRXZlbnQodGhpcy5jb250ZW50V3JhcHBlci5uYXRpdmVFbGVtZW50LCAnc2Nyb2xsJykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmRhdGFncmlkSGVhZGVyLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdCA9IHRoaXMuY29udGVudFdyYXBwZXIubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmZvckVhY2goKHN1YjogU3Vic2NyaXB0aW9uKSA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICB0b2dnbGVBbGxTZWxlY3RlZCgkZXZlbnQ6IGFueSkge1xuICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2VsZWN0QWxsQ2hlY2tib3g/Lm5hdGl2ZUVsZW1lbnQuY2xpY2soKTtcbiAgfVxuXG4gIHJlc2l6ZSgpOiB2b2lkIHtcbiAgICB0aGlzLm9yZ2FuaXplci5yZXNpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgdGhlIHN0YXRlIG9mIGRldGFpbCBwYW5lbCBhbmQgaWYgaXQncyBvcGVuZWQgdGhlblxuICAgKiBmaW5kIHRoZSBtYXRjaGluZyByb3cgYW5kIHRyaWdnZXIgdGhlIGRldGFpbCBwYW5lbFxuICAgKi9cbiAgdXBkYXRlRGV0YWlsU3RhdGUoKSB7XG4gICAgLy8gVHJ5IHRvIHVwZGF0ZSBvbmx5IHdoZW4gdGhlcmUgaXMgc29tZXRoaW5nIGNhY2hlZCBhbmQgaXRzIG9wZW4uXG4gICAgaWYgKHRoaXMuZGV0YWlsU2VydmljZS5zdGF0ZSAmJiB0aGlzLmRldGFpbFNlcnZpY2UuaXNPcGVuKSB7XG4gICAgICBjb25zdCByb3cgPSB0aGlzLnJvd3MuZmluZChyb3cgPT4gdGhpcy5pdGVtcy50cmFja0J5KHJvdy5pdGVtKSA9PT0gdGhpcy5pdGVtcy50cmFja0J5KHRoaXMuZGV0YWlsU2VydmljZS5zdGF0ZSkpO1xuXG4gICAgICAvKipcbiAgICAgICAqIFJlb3BlbiB1cGRhdGVkIHJvdyBvciBjbG9zZSBpdFxuICAgICAgICovXG4gICAgICBpZiAocm93KSB7XG4gICAgICAgIHRoaXMuZGV0YWlsU2VydmljZS5vcGVuKHJvdy5pdGVtLCByb3cuZGV0YWlsQnV0dG9uLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAvLyBhbHdheXMga2VlcCBvcGVuIHdoZW4gdmlydHVhbCBzY3JvbGwgaXMgYXZhaWxhYmxlIG90aGVyd2lzZSBjbG9zZSBpdFxuICAgICAgfSBlbHNlIGlmICghdGhpcy52aXJ0dWFsU2Nyb2xsKSB7XG4gICAgICAgIC8vIFVzaW5nIHNldFRpbWVvdXQgdG8gbWFrZSBzdXJlIHRoZSBpbm5lciBjeWNsZXMgaW4gcm93cyBhcmUgZG9uZVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLmRldGFpbFNlcnZpY2UuY2xvc2UoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBtZXRob2QgdG8gcmUtdHJpZ2dlciB0aGUgY29tcHV0YXRpb24gb2YgZGlzcGxheWVkIGl0ZW1zIG1hbnVhbGx5XG4gICAqL1xuICBkYXRhQ2hhbmdlZCgpIHtcbiAgICB0aGlzLml0ZW1zLnJlZnJlc2goKTtcbiAgfVxufVxuIiwiPCEtLVxuICB+IENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICB+IFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAgfiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICB+IFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAgLS0+XG5cbjxuZy1jb250ZW50IHNlbGVjdD1cImNsci1kZy1hY3Rpb24tYmFyXCI+PC9uZy1jb250ZW50PlxuPGRpdiBjbGFzcz1cImRhdGFncmlkLW91dGVyLXdyYXBwZXJcIj5cbiAgPGRpdiBjbGFzcz1cImRhdGFncmlkLWlubmVyLXdyYXBwZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWRcIiAjZGF0YWdyaWQgW2F0dHIuYXJpYS1oaWRkZW5dPVwiZGV0YWlsU2VydmljZS5pc09wZW4gPyB0cnVlIDogbnVsbFwiPlxuICAgICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLXRhYmxlLXdyYXBwZXJcIj5cbiAgICAgICAgPGRpdiByb2xlPVwiZ3JpZFwiIGNsYXNzPVwiZGF0YWdyaWQtdGFibGVcIiB0YWJpbmRleD1cIi0xXCIgI2RhdGFncmlkVGFibGU+XG4gICAgICAgICAgPGRpdiByb2xlPVwicm93Z3JvdXBcIiBjbGFzcz1cImRhdGFncmlkLWhlYWRlclwiICNkYXRhZ3JpZEhlYWRlcj5cbiAgICAgICAgICAgIDxkaXYgcm9sZT1cInJvd1wiIGNsYXNzPVwiZGF0YWdyaWQtcm93XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1yb3ctbWFzdGVyIGRhdGFncmlkLXJvdy1mbGV4XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLXJvdy1zdGlja3lcIj5cbiAgICAgICAgICAgICAgICAgIDwhLS1oZWFkZXIgZm9yIGRhdGFncmlkIHdoZXJlIHlvdSBjYW4gc2VsZWN0IG11bHRpcGxlIHJvd3MgLS0+XG4gICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICNzdGlja3lIZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgcm9sZT1cImNvbHVtbmhlYWRlclwiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uIGRhdGFncmlkLXNlbGVjdCBkYXRhZ3JpZC1maXhlZC1jb2x1bW5cIlxuICAgICAgICAgICAgICAgICAgICAqbmdJZj1cInNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID09PSBTRUxFQ1RJT05fVFlQRS5NdWx0aVwiXG4gICAgICAgICAgICAgICAgICAgIChrZXlkb3duLnNwYWNlKT1cInRvZ2dsZUFsbFNlbGVjdGVkKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2ICpuZ0lmPVwiIXZpcnR1YWxTY3JvbGwgfHwgY3VzdG9tU2VsZWN0QWxsRW5hYmxlZFwiIGNsYXNzPVwiY2xyLWNoZWNrYm94LXdyYXBwZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8IS0tIFdlIG5lZWQgdG8gbW92ZSBmb2N1cyBhbmQgc3BhY2Uta2V5IGhhbmRsaW5nIHRvIHRoZSBwYXJlbnQgYmVjYXVzZSBvZiBrZXlib2FyZCBhcnJvdyBrZXkgbmF2aWdhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWNoIGlzIG5vdCBhYmxlIHRvIHRyYW5zZmVyIGZvY3VzIGRpcmVjdGx5IG9uIHRoZSBpbnB1dCB3aGVuIGZvY3VzZWQgd2l0aCB0aGUgdGFiIGtleSAtLT5cbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICNzZWxlY3RBbGxDaGVja2JveFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtpZF09XCJzZWxlY3RBbGxJZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cImFsbFNlbGVjdGVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiY29tbW9uU3RyaW5ncy5rZXlzLnNlbGVjdEFsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwhLS0gVXNhZ2Ugb2YgY2xhc3MgY2xyLWNvbC1udWxsIGhlcmUgcHJldmVudHMgY2xyLWNvbC0qIGNsYXNzZXMgZnJvbSBiZWluZyBhZGRlZCB3aGVuIGEgZGF0YWdyaWQgaXMgd3JhcHBlZCBpbnNpZGUgY2xyRm9ybSAtLT5cbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgW2Zvcl09XCJzZWxlY3RBbGxJZFwiIGNsYXNzPVwiY2xyLWNvbnRyb2wtbGFiZWwgY2xyLWNvbC1udWxsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNsci1zci1vbmx5XCI+e3tjb21tb25TdHJpbmdzLmtleXMuc2VsZWN0QWxsfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLWNvbHVtbi1zZXBhcmF0b3JcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPCEtLSBoZWFkZXIgZm9yIGRhdGFncmlkIHdoZXJlIHlvdSBjYW4gc2VsZWN0IG9uZSByb3cgb25seSAtLT5cbiAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgI3N0aWNreUhlYWRlclxuICAgICAgICAgICAgICAgICAgICByb2xlPVwiY29sdW1uaGVhZGVyXCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4gZGF0YWdyaWQtc2VsZWN0IGRhdGFncmlkLWZpeGVkLWNvbHVtblwiXG4gICAgICAgICAgICAgICAgICAgICpuZ0lmPVwic2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNFTEVDVElPTl9UWVBFLlNpbmdsZVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjbHItc3Itb25seVwiPnt7Y2xyRGdTaW5nbGVTZWxlY3Rpb25BcmlhTGFiZWx9fTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uLXNlcGFyYXRvclwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8IS0tIGhlYWRlciBmb3Igc2luZ2xlIHJvdyBhY3Rpb247IG9ubHkgZGlzcGxheVR5cGUgaWYgd2UgaGF2ZSBhdCBsZWFzdCBvbmUgYWN0aW9uYWJsZSByb3cgaW4gZGF0YWdyaWQgLS0+XG4gICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICNzdGlja3lIZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgcm9sZT1cImNvbHVtbmhlYWRlclwiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uIGRhdGFncmlkLXJvdy1hY3Rpb25zIGRhdGFncmlkLWZpeGVkLWNvbHVtblwiXG4gICAgICAgICAgICAgICAgICAgICpuZ0lmPVwicm93QWN0aW9uU2VydmljZS5oYXNBY3Rpb25hYmxlUm93XCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNsci1zci1vbmx5XCI+e3tjbHJEZ1NpbmdsZUFjdGlvbmFibGVBcmlhTGFiZWx9fTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uLXNlcGFyYXRvclwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8IS0tIGhlYWRlciBmb3IgY2FyZXRzOyBvbmx5IGRpc3BsYXlUeXBlIGlmIHdlIGhhdmUgYXQgbGVhc3Qgb25lIGV4cGFuZGFibGUgcm93IGluIGRhdGFncmlkIC0tPlxuICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAjc3RpY2t5SGVhZGVyXG4gICAgICAgICAgICAgICAgICAgIHJvbGU9XCJjb2x1bW5oZWFkZXJcIlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImRhdGFncmlkLWNvbHVtbiBkYXRhZ3JpZC1leHBhbmRhYmxlLWNhcmV0IGRhdGFncmlkLWZpeGVkLWNvbHVtblwiXG4gICAgICAgICAgICAgICAgICAgICpuZ0lmPVwiZXhwYW5kYWJsZVJvd3MuaGFzRXhwYW5kYWJsZVJvdyB8fCBkZXRhaWxTZXJ2aWNlLmVuYWJsZWRcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57e2NsckRldGFpbEV4cGFuZGFibGVBcmlhTGFiZWx9fTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uLXNlcGFyYXRvclwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLXJvdy1zY3JvbGxhYmxlXCI+XG4gICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICNwcm9qZWN0ZWREaXNwbGF5Q29sdW1ucz48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2ICpuZ0lmPVwidmlydHVhbFNjcm9sbFwiIGNsYXNzPVwiZGF0YWdyaWQtcm93LXN0aWNreSBkYXRhZ3JpZC1yb3ctc3RpY2t5LXNjcm9sbFwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLWNvbHVtblwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLWNvbnRlbnRcIiBbY2xhc3MuZGF0YWdyaWQtY29udGVudC12aXJ0dWFsXT1cInZpcnR1YWxTY3JvbGxcIiAjY29udGVudFdyYXBwZXI+XG4gICAgICAgICAgICA8ZGl2IHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzcz1cImRhdGFncmlkLXJvd3NcIj5cbiAgICAgICAgICAgICAgPGNsci1kZy1yb3cgY2xhc3M9XCJkYXRhZ3JpZC1yb3ctbG9hZGluZ1wiICpuZ0lmPVwibG9hZGluZ01vcmVJdGVtc1wiPlxuICAgICAgICAgICAgICAgIDxjbHItZGctY2VsbD5cbiAgICAgICAgICAgICAgICAgIDxjbHItc3Bpbm5lciBjbHJNZWRpdW0+PC9jbHItc3Bpbm5lcj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPnt7IGNvbW1vblN0cmluZ3Mua2V5cy5sb2FkaW5nIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvY2xyLWRnLWNlbGw+XG4gICAgICAgICAgICAgIDwvY2xyLWRnLXJvdz5cblxuICAgICAgICAgICAgICA8bmctY29udGFpbmVyICNkaXNwbGF5ZWRSb3dzPjwvbmctY29udGFpbmVyPlxuXG4gICAgICAgICAgICAgIDxjbHItZGctcm93IGNsYXNzPVwiZGF0YWdyaWQtcm93LWxvYWRpbmdcIiAqbmdJZj1cImxvYWRpbmdNb3JlSXRlbXNcIj5cbiAgICAgICAgICAgICAgICA8Y2xyLWRnLWNlbGw+XG4gICAgICAgICAgICAgICAgICA8Y2xyLXNwaW5uZXIgY2xyTWVkaXVtPjwvY2xyLXNwaW5uZXI+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj57eyBjb21tb25TdHJpbmdzLmtleXMubG9hZGluZyB9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Nsci1kZy1jZWxsPlxuICAgICAgICAgICAgICA8L2Nsci1kZy1yb3c+XG5cbiAgICAgICAgICAgICAgPCEtLSBDdXN0b20gcGxhY2Vob2xkZXIgb3ZlcnJpZGVzIHRoZSBkZWZhdWx0IGVtcHR5IG9uZSAtLT5cbiAgICAgICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWRnLXBsYWNlaG9sZGVyXCI+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgICA8Y2xyLWRnLXBsYWNlaG9sZGVyICpuZ0lmPVwiIXBsYWNlaG9sZGVyXCI+PC9jbHItZGctcGxhY2Vob2xkZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgKm5nSWY9XCJ2aXJ0dWFsU2Nyb2xsXCJcbiAgICAgICAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1jb250ZW50LXZpcnR1YWwtc3BhY2VyXCJcbiAgICAgICAgICAgICAgW3N0eWxlLmhlaWdodF09XCJ2aXJ0dWFsU2Nyb2xsPy50b3RhbENvbnRlbnRIZWlnaHRcIlxuICAgICAgICAgICAgPjwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1kZy1mb290ZXJcIj48L25nLWNvbnRlbnQ+XG4gICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLXNwaW5uZXJcIiAqbmdJZj1cImxvYWRpbmdcIj5cbiAgICAgIDxjbHItc3Bpbm5lciBjbHJNZWRpdW0+TG9hZGluZzwvY2xyLXNwaW5uZXI+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuICA8bmctY29udGVudCBzZWxlY3Q9XCJbY2xySWZEZXRhaWxdLGNsci1kZy1kZXRhaWxcIj48L25nLWNvbnRlbnQ+XG48L2Rpdj5cblxuPGRpdiBjbGFzcz1cImRhdGFncmlkLWNhbGN1bGF0aW9uLXRhYmxlXCI+XG4gIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1jYWxjdWxhdGlvbi1oZWFkZXJcIj5cbiAgICA8bmctY29udGFpbmVyICNwcm9qZWN0ZWRDYWxjdWxhdGlvbkNvbHVtbnM+PC9uZy1jb250YWluZXI+XG4gIDwvZGl2PlxuICA8bmctY29udGFpbmVyICNjYWxjdWxhdGlvblJvd3M+PC9uZy1jb250YWluZXI+XG48L2Rpdj5cblxuPG5nLXRlbXBsYXRlICNmaXhlZENvbHVtblRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uIGRhdGFncmlkLWZpeGVkLWNvbHVtblwiPjwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==
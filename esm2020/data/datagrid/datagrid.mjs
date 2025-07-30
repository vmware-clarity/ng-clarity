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
    ], queries: [{ propertyName: "virtualScroll", first: true, predicate: ClrDatagridVirtualScrollDirective, descendants: true }, { propertyName: "iterator", first: true, predicate: ClrDatagridItems, descendants: true }, { propertyName: "placeholder", first: true, predicate: ClrDatagridPlaceholder, descendants: true }, { propertyName: "columns", predicate: ClrDatagridColumn }, { propertyName: "rows", predicate: ClrDatagridRow }], viewQueries: [{ propertyName: "datagrid", first: true, predicate: ["datagrid"], descendants: true, read: ElementRef }, { propertyName: "datagridTable", first: true, predicate: ["datagridTable"], descendants: true, read: ElementRef }, { propertyName: "datagridHeader", first: true, predicate: ["datagridHeader"], descendants: true, read: ElementRef }, { propertyName: "contentWrapper", first: true, predicate: ["contentWrapper"], descendants: true, read: ElementRef }, { propertyName: "scrollableColumns", first: true, predicate: ["scrollableColumns"], descendants: true, read: ViewContainerRef }, { propertyName: "_projectedDisplayColumns", first: true, predicate: ["projectedDisplayColumns"], descendants: true, read: ViewContainerRef }, { propertyName: "_projectedCalculationColumns", first: true, predicate: ["projectedCalculationColumns"], descendants: true, read: ViewContainerRef }, { propertyName: "_displayedRows", first: true, predicate: ["displayedRows"], descendants: true, read: ViewContainerRef }, { propertyName: "_calculationRows", first: true, predicate: ["calculationRows"], descendants: true, read: ViewContainerRef }, { propertyName: "_fixedColumnTemplate", first: true, predicate: ["fixedColumnTemplate"], descendants: true }, { propertyName: "selectAllCheckbox", first: true, predicate: ["selectAllCheckbox"], descendants: true }, { propertyName: "stickyHeaders", predicate: ["stickyHeader"], descendants: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<ng-content select=\"clr-dg-action-bar\"></ng-content>\n<div class=\"datagrid-outer-wrapper\">\n  <div class=\"datagrid-inner-wrapper\">\n    <div class=\"datagrid\" #datagrid [attr.aria-hidden]=\"detailService.isOpen ? true : null\">\n      <div class=\"datagrid-table-wrapper\">\n        <div role=\"grid\" class=\"datagrid-table\" tabindex=\"-1\" #datagridTable>\n          <div role=\"rowgroup\" class=\"datagrid-header\" #datagridHeader>\n            <div role=\"row\" class=\"datagrid-row\">\n              <div class=\"datagrid-row-master datagrid-row-flex\">\n                <div class=\"datagrid-row-sticky\">\n                  <!--header for datagrid where you can select multiple rows -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    *ngIf=\"selection.selectionType === SELECTION_TYPE.Multi\"\n                    (keydown.space)=\"toggleAllSelected($event)\"\n                  >\n                    <div *ngIf=\"!virtualScroll || customSelectAllEnabled\" class=\"clr-checkbox-wrapper\">\n                      <!-- We need to move focus and space-key handling to the parent because of keyboard arrow key navigation,\n                           which is not able to transfer focus directly on the input when focused with the tab key -->\n                      <input\n                        #selectAllCheckbox\n                        type=\"checkbox\"\n                        [id]=\"selectAllId\"\n                        [(ngModel)]=\"allSelected\"\n                        [attr.aria-label]=\"commonStrings.keys.selectAll\"\n                        tabindex=\"-1\"\n                      />\n                      <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n                      <label [for]=\"selectAllId\" class=\"clr-control-label clr-col-null\">\n                        <span class=\"clr-sr-only\">{{commonStrings.keys.selectAll}}</span>\n                      </label>\n                    </div>\n\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for datagrid where you can select one row only -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    *ngIf=\"selection.selectionType === SELECTION_TYPE.Single\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleSelectionAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for single row action; only displayType if we have at least one actionable row in datagrid -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-row-actions datagrid-fixed-column\"\n                    *ngIf=\"rowActionService.hasActionableRow\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleActionableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  <!-- header for carets; only displayType if we have at least one expandable row in datagrid -->\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-expandable-caret datagrid-fixed-column\"\n                    *ngIf=\"expandableRows.hasExpandableRow || detailService.enabled\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDetailExpandableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                </div>\n                <div class=\"datagrid-row-scrollable\">\n                  <ng-container #projectedDisplayColumns></ng-container>\n                </div>\n                <div *ngIf=\"virtualScroll\" class=\"datagrid-row-sticky datagrid-row-sticky-scroll\">\n                  <div class=\"datagrid-column\"></div>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <div class=\"datagrid-content\" [class.datagrid-content-virtual]=\"virtualScroll\" #contentWrapper>\n            <div role=\"presentation\" class=\"datagrid-rows\">\n              <clr-dg-row class=\"datagrid-row-loading\" *ngIf=\"loadingMoreItems\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n\n              <ng-container #displayedRows></ng-container>\n\n              <clr-dg-row class=\"datagrid-row-loading\" *ngIf=\"loadingMoreItems\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n\n              <!-- Custom placeholder overrides the default empty one -->\n              <ng-content select=\"clr-dg-placeholder\"></ng-content>\n              <clr-dg-placeholder *ngIf=\"!placeholder\"></clr-dg-placeholder>\n            </div>\n            <div\n              *ngIf=\"virtualScroll\"\n              class=\"datagrid-content-virtual-spacer\"\n              [style.height]=\"virtualScroll?.totalContentHeight\"\n            ></div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <ng-content select=\"clr-dg-footer\"></ng-content>\n    <div class=\"datagrid-spinner\" *ngIf=\"loading\">\n      <clr-spinner clrMedium>Loading</clr-spinner>\n    </div>\n  </div>\n  <ng-content select=\"[clrIfDetail],clr-dg-detail\"></ng-content>\n</div>\n\n<div class=\"datagrid-calculation-table\">\n  <div class=\"datagrid-calculation-header\">\n    <ng-container #projectedCalculationColumns></ng-container>\n  </div>\n  <ng-container #calculationRows></ng-container>\n</div>\n\n<ng-template #fixedColumnTemplate>\n  <div class=\"datagrid-column datagrid-fixed-column\"></div>\n</ng-template>\n", dependencies: [{ kind: "directive", type: i12.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i13.ClrLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i14.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i14.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i14.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i15.ClrSpinner, selector: "clr-spinner", inputs: ["clrInline", "clrInverse", "clrSmall", "clrMedium"] }, { kind: "component", type: i16.ClrDatagridCell, selector: "clr-dg-cell" }, { kind: "component", type: i17.ClrDatagridPlaceholder, selector: "clr-dg-placeholder" }, { kind: "component", type: i18.ClrDatagridRow, selector: "clr-dg-row", inputs: ["clrDgDetailDisabled", "clrDgDetailHidden", "clrDgSkeletonLoading", "clrDgItem", "clrDgSelectable", "clrDgSelected", "clrDgExpanded", "clrDgDetailOpenLabel", "clrDgDetailCloseLabel", "clrDgRowSelectionLabel"], outputs: ["clrDgSelectedChange", "clrDgExpandedChange"] }, { kind: "directive", type: i19.ClrDatagridSelectionCellDirective, selector: ".datagrid-select" }, { kind: "directive", type: i20.DatagridCellRenderer, selector: "clr-dg-cell" }, { kind: "directive", type: i21.DatagridRowRenderer, selector: "clr-dg-row, clr-dg-row-detail" }, { kind: "directive", type: i22.ActionableOompaLoompa, selector: "clr-datagrid, clr-dg-row" }, { kind: "directive", type: i23.ExpandableOompaLoompa, selector: "clr-datagrid, clr-dg-row" }] });
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
                args: [ClrDatagridRow]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2RhdGFncmlkLnRzIiwiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFHTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBR0wsTUFBTSxFQUlOLFNBQVMsRUFDVCxZQUFZLEVBQ1osZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHekQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN4RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFdkQs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RSxVQUFVLEVBQUU7Z0JBQ0UsY0FBYztzQkFBaEUsU0FBUzt1QkFBQyxnQkFBZ0IsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7Z0JBQ1csaUJBQWlCO3NCQUE1RSxTQUFTO3VCQUFDLG1CQUFtQixFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFO2dCQUNRLHdCQUF3QjtzQkFBekYsU0FBUzt1QkFBQyx5QkFBeUIsRUFBRSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtnQkFDTSw0QkFBNEI7c0JBQWpHLFNBQVM7dUJBQUMsNkJBQTZCLEVBQUUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBQ1osY0FBYztzQkFBckUsU0FBUzt1QkFBQyxlQUFlLEVBQUUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBQ0ksZ0JBQWdCO3NCQUF6RSxTQUFTO3VCQUFDLGlCQUFpQixFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFO2dCQUN0QixvQkFBb0I7c0JBQXJELFNBQVM7dUJBQUMscUJBQXFCO2dCQUNpQyxhQUFhO3NCQUE3RSxZQUFZO3VCQUFDLGNBQWMsRUFBRSxFQUFFLHVCQUF1QixFQUFFLElBQUksRUFBRTtnQkFPdkIsaUJBQWlCO3NCQUF4RCxTQUFTO3VCQUFDLG1CQUFtQjtnQkFrQzFCLE9BQU87c0JBRFYsS0FBSzt1QkFBQyxjQUFjO2dCQVlqQixRQUFRO3NCQURYLEtBQUs7dUJBQUMsZUFBZTtnQkFjbEIsY0FBYztzQkFEakIsS0FBSzt1QkFBQyxxQkFBcUI7Z0JBY3hCLHNCQUFzQjtzQkFEekIsS0FBSztnQkFXRixnQkFBZ0I7c0JBRG5CLEtBQUs7dUJBQUMsbUJBQW1CO2dCQU10QixPQUFPO3NCQURWLEtBQUs7dUJBQUMsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgUmVuZGVyZXIyLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3Q2hpbGRyZW4sXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY29tYmluZUxhdGVzdCwgZnJvbUV2ZW50LCBtZXJnZSwgb2YsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVib3VuY2VUaW1lLCBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IHVuaXF1ZUlkRmFjdG9yeSB9IGZyb20gJy4uLy4uL3V0aWxzL2lkLWdlbmVyYXRvci9pZC1nZW5lcmF0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZENvbHVtbiB9IGZyb20gJy4vZGF0YWdyaWQtY29sdW1uJztcbmltcG9ydCB7IENsckRhdGFncmlkSXRlbXMgfSBmcm9tICcuL2RhdGFncmlkLWl0ZW1zJztcbmltcG9ydCB7IENsckRhdGFncmlkUGxhY2Vob2xkZXIgfSBmcm9tICcuL2RhdGFncmlkLXBsYWNlaG9sZGVyJztcbmltcG9ydCB7IENsckRhdGFncmlkUm93IH0gZnJvbSAnLi9kYXRhZ3JpZC1yb3cnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRWaXJ0dWFsU2Nyb2xsRGlyZWN0aXZlIH0gZnJvbSAnLi9kYXRhZ3JpZC12aXJ0dWFsLXNjcm9sbC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRGF0YWdyaWREaXNwbGF5TW9kZSB9IGZyb20gJy4vZW51bXMvZGlzcGxheS1tb2RlLmVudW0nO1xuaW1wb3J0IHsgU2VsZWN0aW9uVHlwZSB9IGZyb20gJy4vZW51bXMvc2VsZWN0aW9uLXR5cGUnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRTdGF0ZUludGVyZmFjZSB9IGZyb20gJy4vaW50ZXJmYWNlcy9zdGF0ZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ29sdW1uc1NlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9jb2x1bW5zLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGV0YWlsU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2RldGFpbC5zZXJ2aWNlJztcbmltcG9ydCB7IERpc3BsYXlNb2RlU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2Rpc3BsYXktbW9kZS5zZXJ2aWNlJztcbmltcG9ydCB7IEZpbHRlcnNQcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXJzL2ZpbHRlcnMnO1xuaW1wb3J0IHsgRXhwYW5kYWJsZVJvd3NDb3VudCB9IGZyb20gJy4vcHJvdmlkZXJzL2dsb2JhbC1leHBhbmRhYmxlLXJvd3MnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRJdGVtc1RyYWNrQnlGdW5jdGlvbiwgSXRlbXMgfSBmcm9tICcuL3Byb3ZpZGVycy9pdGVtcyc7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSAnLi9wcm92aWRlcnMvcGFnZSc7XG5pbXBvcnQgeyBSb3dBY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvcm93LWFjdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IFNlbGVjdGlvbiB9IGZyb20gJy4vcHJvdmlkZXJzL3NlbGVjdGlvbic7XG5pbXBvcnQgeyBTb3J0IH0gZnJvbSAnLi9wcm92aWRlcnMvc29ydCc7XG5pbXBvcnQgeyBTdGF0ZURlYm91bmNlciB9IGZyb20gJy4vcHJvdmlkZXJzL3N0YXRlLWRlYm91bmNlci5wcm92aWRlcic7XG5pbXBvcnQgeyBTdGF0ZVByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvc3RhdGUucHJvdmlkZXInO1xuaW1wb3J0IHsgVGFibGVTaXplU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3RhYmxlLXNpemUuc2VydmljZSc7XG5pbXBvcnQgeyBEYXRhZ3JpZFJlbmRlck9yZ2FuaXplciB9IGZyb20gJy4vcmVuZGVyL3JlbmRlci1vcmdhbml6ZXInO1xuaW1wb3J0IHsgS2V5TmF2aWdhdGlvbkdyaWRDb250cm9sbGVyIH0gZnJvbSAnLi91dGlscy9rZXktbmF2aWdhdGlvbi1ncmlkLmNvbnRyb2xsZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZGF0YWdyaWQnLFxuICB0ZW1wbGF0ZVVybDogJy4vZGF0YWdyaWQuaHRtbCcsXG4gIHByb3ZpZGVyczogW1xuICAgIFNlbGVjdGlvbixcbiAgICBTb3J0LFxuICAgIEZpbHRlcnNQcm92aWRlcixcbiAgICBQYWdlLFxuICAgIEl0ZW1zLFxuICAgIERhdGFncmlkUmVuZGVyT3JnYW5pemVyLFxuICAgIFJvd0FjdGlvblNlcnZpY2UsXG4gICAgRXhwYW5kYWJsZVJvd3NDb3VudCxcbiAgICBTdGF0ZURlYm91bmNlcixcbiAgICBEZXRhaWxTZXJ2aWNlLFxuICAgIFN0YXRlUHJvdmlkZXIsXG4gICAgVGFibGVTaXplU2VydmljZSxcbiAgICBDb2x1bW5zU2VydmljZSxcbiAgICBEaXNwbGF5TW9kZVNlcnZpY2UsXG4gICAgS2V5TmF2aWdhdGlvbkdyaWRDb250cm9sbGVyLFxuICBdLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5kYXRhZ3JpZC1ob3N0XSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLmRhdGFncmlkLWRldGFpbC1vcGVuXSc6ICdkZXRhaWxTZXJ2aWNlLmlzT3BlbicsXG4gICAgJ1tjbGFzcy5kYXRhZ3JpZC12aXJ0dWFsLXNjcm9sbF0nOiAnISF2aXJ0dWFsU2Nyb2xsJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWdyaWQ8VCA9IGFueT4gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoJ2NsckxvYWRpbmdNb3JlSXRlbXMnKSBsb2FkaW5nTW9yZUl0ZW1zOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpIGNsckRnU2luZ2xlU2VsZWN0aW9uQXJpYUxhYmVsOiBzdHJpbmcgPSB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5zaW5nbGVTZWxlY3Rpb25BcmlhTGFiZWw7XG4gIEBJbnB1dCgpIGNsckRnU2luZ2xlQWN0aW9uYWJsZUFyaWFMYWJlbDogc3RyaW5nID0gdGhpcy5jb21tb25TdHJpbmdzLmtleXMuc2luZ2xlQWN0aW9uYWJsZUFyaWFMYWJlbDtcbiAgQElucHV0KCkgY2xyRGV0YWlsRXhwYW5kYWJsZUFyaWFMYWJlbDogc3RyaW5nID0gdGhpcy5jb21tb25TdHJpbmdzLmtleXMuZGV0YWlsRXhwYW5kYWJsZUFyaWFMYWJlbDtcblxuICAvLyBBbGxvd3MgZGlzYWJsaW5nIG9mIHRoZSBhdXRvIGZvY3VzIG9uIHBhZ2Uvc3RhdGUgY2hhbmdlcyAoZXhjbHVkZXMgZm9jdXMgbWFuYWdlbWVudCBpbnNpZGUgb2YgcG9wdXBzKVxuICBASW5wdXQoKSBjbHJEZ0Rpc2FibGVQYWdlRm9jdXMgPSBmYWxzZTtcblxuICBAT3V0cHV0KCdjbHJEZ1NlbGVjdGVkQ2hhbmdlJykgc2VsZWN0ZWRDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxUW10+KGZhbHNlKTtcbiAgQE91dHB1dCgnY2xyRGdTaW5nbGVTZWxlY3RlZENoYW5nZScpIHNpbmdsZVNlbGVjdGVkQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8VD4oZmFsc2UpO1xuXG4gIC8qKlxuICAgKiBPdXRwdXQgZW1pdHRlZCB3aGVuZXZlciB0aGUgZGF0YSBuZWVkcyB0byBiZSByZWZyZXNoZWQsIGJhc2VkIG9uIHVzZXIgYWN0aW9uIG9yIGV4dGVybmFsIG9uZXNcbiAgICovXG4gIEBPdXRwdXQoJ2NsckRnUmVmcmVzaCcpIHJlZnJlc2ggPSBuZXcgRXZlbnRFbWl0dGVyPENsckRhdGFncmlkU3RhdGVJbnRlcmZhY2U8VD4+KGZhbHNlKTtcblxuICAvKipcbiAgICogVGhlIGFwcGxpY2F0aW9uIGNhbiBwcm92aWRlIGN1c3RvbSBzZWxlY3QgYWxsIGxvZ2ljLlxuICAgKi9cbiAgQElucHV0KCdjbHJEZ0N1c3RvbVNlbGVjdEFsbEVuYWJsZWQnKSBjdXN0b21TZWxlY3RBbGxFbmFibGVkID0gZmFsc2U7XG4gIEBPdXRwdXQoJ2NsckRnQ3VzdG9tU2VsZWN0QWxsJykgY3VzdG9tU2VsZWN0QWxsID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIC8qKlxuICAgKiBFeHBvc2UgdmlydHVhbCBzY3JvbGwgZGlyZWN0aXZlIGZvciBhcHBsaWNhdGlvbnMgdG8gYWNjZXNzIGl0cyBwdWJsaWMgbWV0aG9kc1xuICAgKi9cbiAgQENvbnRlbnRDaGlsZChDbHJEYXRhZ3JpZFZpcnR1YWxTY3JvbGxEaXJlY3RpdmUpIHZpcnR1YWxTY3JvbGw6IENsckRhdGFncmlkVmlydHVhbFNjcm9sbERpcmVjdGl2ZTxhbnk+O1xuXG4gIC8qKlxuICAgKiBXZSBncmFiIHRoZSBzbWFydCBpdGVyYXRvciBmcm9tIHByb2plY3RlZCBjb250ZW50XG4gICAqL1xuICBAQ29udGVudENoaWxkKENsckRhdGFncmlkSXRlbXMpIGl0ZXJhdG9yOiBDbHJEYXRhZ3JpZEl0ZW1zPFQ+O1xuXG4gIC8qKlxuICAgKiBDdXN0b20gcGxhY2Vob2xkZXIgZGV0ZWN0aW9uXG4gICAqL1xuICBAQ29udGVudENoaWxkKENsckRhdGFncmlkUGxhY2Vob2xkZXIpIHBsYWNlaG9sZGVyOiBDbHJEYXRhZ3JpZFBsYWNlaG9sZGVyPFQ+O1xuXG4gIC8qKlxuICAgKiBIaWRlYWJsZSBDb2x1bW4gZGF0YSBzb3VyY2UgLyBkZXRlY3Rpb24uXG4gICAqL1xuICBAQ29udGVudENoaWxkcmVuKENsckRhdGFncmlkQ29sdW1uKSBjb2x1bW5zOiBRdWVyeUxpc3Q8Q2xyRGF0YWdyaWRDb2x1bW48VD4+O1xuXG4gIC8qKlxuICAgKiBXaGVuIHRoZSBkYXRhZ3JpZCBpcyB1c2VyLW1hbmFnZWQgd2l0aG91dCB0aGUgc21hcnQgaXRlcmF0b3IsIHdlIGdldCB0aGUgaXRlbXMgZGlzcGxheWVkXG4gICAqIGJ5IHF1ZXJ5aW5nIHRoZSBwcm9qZWN0ZWQgY29udGVudC4gVGhpcyBpcyBuZWVkZWQgdG8ga2VlcCB0cmFjayBvZiB0aGUgbW9kZWxzIGN1cnJlbnRseVxuICAgKiBkaXNwbGF5ZWQsIHR5cGljYWxseSBmb3Igc2VsZWN0aW9uLlxuICAgKi9cbiAgQENvbnRlbnRDaGlsZHJlbihDbHJEYXRhZ3JpZFJvdykgcm93czogUXVlcnlMaXN0PENsckRhdGFncmlkUm93PFQ+PjtcblxuICBAVmlld0NoaWxkKCdkYXRhZ3JpZCcsIHsgcmVhZDogRWxlbWVudFJlZiB9KSBkYXRhZ3JpZDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ2RhdGFncmlkVGFibGUnLCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSkgZGF0YWdyaWRUYWJsZTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ2RhdGFncmlkSGVhZGVyJywgeyByZWFkOiBFbGVtZW50UmVmIH0pIGRhdGFncmlkSGVhZGVyOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgnY29udGVudFdyYXBwZXInLCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSkgY29udGVudFdyYXBwZXI6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdzY3JvbGxhYmxlQ29sdW1ucycsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSBzY3JvbGxhYmxlQ29sdW1uczogVmlld0NvbnRhaW5lclJlZjtcbiAgQFZpZXdDaGlsZCgncHJvamVjdGVkRGlzcGxheUNvbHVtbnMnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSkgX3Byb2plY3RlZERpc3BsYXlDb2x1bW5zOiBWaWV3Q29udGFpbmVyUmVmO1xuICBAVmlld0NoaWxkKCdwcm9qZWN0ZWRDYWxjdWxhdGlvbkNvbHVtbnMnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSkgX3Byb2plY3RlZENhbGN1bGF0aW9uQ29sdW1uczogVmlld0NvbnRhaW5lclJlZjtcbiAgQFZpZXdDaGlsZCgnZGlzcGxheWVkUm93cycsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSBfZGlzcGxheWVkUm93czogVmlld0NvbnRhaW5lclJlZjtcbiAgQFZpZXdDaGlsZCgnY2FsY3VsYXRpb25Sb3dzJywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmIH0pIF9jYWxjdWxhdGlvblJvd3M6IFZpZXdDb250YWluZXJSZWY7XG4gIEBWaWV3Q2hpbGQoJ2ZpeGVkQ29sdW1uVGVtcGxhdGUnKSBfZml4ZWRDb2x1bW5UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgQFZpZXdDaGlsZHJlbignc3RpY2t5SGVhZGVyJywgeyBlbWl0RGlzdGluY3RDaGFuZ2VzT25seTogdHJ1ZSB9KSBzdGlja3lIZWFkZXJzOiBRdWVyeUxpc3Q8RWxlbWVudFJlZj47XG5cbiAgc2VsZWN0QWxsSWQ6IHN0cmluZztcblxuICAvKiByZWZlcmVuY2UgdG8gdGhlIGVudW0gc28gdGhhdCB0ZW1wbGF0ZSBjYW4gYWNjZXNzICovXG4gIFNFTEVDVElPTl9UWVBFID0gU2VsZWN0aW9uVHlwZTtcblxuICBAVmlld0NoaWxkKCdzZWxlY3RBbGxDaGVja2JveCcpIHByaXZhdGUgc2VsZWN0QWxsQ2hlY2tib3g6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD47XG5cbiAgLyoqXG4gICAqIFN1YnNjcmlwdGlvbnMgdG8gYWxsIHRoZSBzZXJ2aWNlcyBhbmQgcXVlcmllcyBjaGFuZ2VzXG4gICAqL1xuICBwcml2YXRlIF9zdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgb3JnYW5pemVyOiBEYXRhZ3JpZFJlbmRlck9yZ2FuaXplcixcbiAgICBwdWJsaWMgaXRlbXM6IEl0ZW1zPFQ+LFxuICAgIHB1YmxpYyBleHBhbmRhYmxlUm93czogRXhwYW5kYWJsZVJvd3NDb3VudCxcbiAgICBwdWJsaWMgc2VsZWN0aW9uOiBTZWxlY3Rpb248VD4sXG4gICAgcHVibGljIHJvd0FjdGlvblNlcnZpY2U6IFJvd0FjdGlvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBzdGF0ZVByb3ZpZGVyOiBTdGF0ZVByb3ZpZGVyPFQ+LFxuICAgIHByaXZhdGUgZGlzcGxheU1vZGU6IERpc3BsYXlNb2RlU2VydmljZSxcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIGRldGFpbFNlcnZpY2U6IERldGFpbFNlcnZpY2UsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogYW55LFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSxcbiAgICBwdWJsaWMga2V5TmF2aWdhdGlvbjogS2V5TmF2aWdhdGlvbkdyaWRDb250cm9sbGVyLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lXG4gICkge1xuICAgIGNvbnN0IGRhdGFncmlkSWQgPSB1bmlxdWVJZEZhY3RvcnkoKTtcblxuICAgIHRoaXMuc2VsZWN0QWxsSWQgPSAnY2xyLWRnLXNlbGVjdC1hbGwtJyArIGRhdGFncmlkSWQ7XG4gICAgZGV0YWlsU2VydmljZS5pZCA9IGRhdGFncmlkSWQ7XG4gIH1cblxuICAvKipcbiAgICogRnJlZXplcyB0aGUgZGF0YWdyaWQgd2hpbGUgZGF0YSBpcyBsb2FkaW5nXG4gICAqL1xuICBASW5wdXQoJ2NsckRnTG9hZGluZycpXG4gIGdldCBsb2FkaW5nKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLml0ZW1zLmxvYWRpbmc7XG4gIH1cbiAgc2V0IGxvYWRpbmcodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLml0ZW1zLmxvYWRpbmcgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcnJheSBvZiBhbGwgc2VsZWN0ZWQgaXRlbXNcbiAgICovXG4gIEBJbnB1dCgnY2xyRGdTZWxlY3RlZCcpXG4gIHNldCBzZWxlY3RlZCh2YWx1ZTogVFtdIHwgdW5kZWZpbmVkKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID0gU2VsZWN0aW9uVHlwZS5NdWx0aTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9IFNlbGVjdGlvblR5cGUuTm9uZTtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3Rpb24udXBkYXRlQ3VycmVudCh2YWx1ZSwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdGVkIGl0ZW0gaW4gc2luZ2xlLXNlbGVjdCBtb2RlXG4gICAqL1xuICBASW5wdXQoJ2NsckRnU2luZ2xlU2VsZWN0ZWQnKVxuICBzZXQgc2luZ2xlU2VsZWN0ZWQodmFsdWU6IFQpIHtcbiAgICB0aGlzLnNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID0gU2VsZWN0aW9uVHlwZS5TaW5nbGU7XG4gICAgLy8gdGhlIGNsckRnU2luZ2xlU2VsZWN0ZWQgaXMgdXBkYXRlZCBpbiBvbmUgb2YgdHdvIGNhc2VzOlxuICAgIC8vIDEuIGFuIGV4cGxpY2l0IHZhbHVlIGlzIHBhc3NlZFxuICAgIC8vIDIuIGlzIGJlaW5nIHNldCB0byBudWxsIG9yIHVuZGVmaW5lZCwgd2hlcmUgcHJldmlvdXNseSBpdCBoYWQgYSB2YWx1ZVxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5zZWxlY3Rpb24uY3VycmVudFNpbmdsZSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3Rpb24uY3VycmVudFNpbmdsZSkge1xuICAgICAgdGhpcy5zZWxlY3Rpb24uY3VycmVudFNpbmdsZSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGNsckRnUHJlc2VydmVTZWxlY3Rpb24oc3RhdGU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNlbGVjdGlvbi5wcmVzZXJ2ZVNlbGVjdGlvbiA9IHN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIHNpbmNlIDIuMCwgcmVtb3ZlIGluIDMuMFxuICAgKlxuICAgKiBTZWxlY3Rpb24vRGVzZWxlY3Rpb24gb24gcm93IGNsaWNrIG1vZGVcbiAgICovXG4gIEBJbnB1dCgnY2xyRGdSb3dTZWxlY3Rpb24nKVxuICBzZXQgcm93U2VsZWN0aW9uTW9kZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2VsZWN0aW9uLnJvd1NlbGVjdGlvbk1vZGUgPSB2YWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyRGdJdGVtc1RyYWNrQnknKVxuICBzZXQgdHJhY2tCeSh2YWx1ZTogQ2xyRGF0YWdyaWRJdGVtc1RyYWNrQnlGdW5jdGlvbjxUPikge1xuICAgIHRoaXMuaXRlbXMudHJhY2tCeSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyBpZiBhbGwgY3VycmVudGx5IGRpc3BsYXllZCBpdGVtcyBhcmUgc2VsZWN0ZWRcbiAgICovXG4gIGdldCBhbGxTZWxlY3RlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uaXNBbGxTZWxlY3RlZCgpO1xuICB9XG4gIHNldCBhbGxTZWxlY3RlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLmN1c3RvbVNlbGVjdEFsbEVuYWJsZWQpIHtcbiAgICAgIHRoaXMuY3VzdG9tU2VsZWN0QWxsLmVtaXQodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgaXMgYSBzZXR0ZXIgYnV0IHdlIGlnbm9yZSB0aGUgdmFsdWUuXG4gICAgICAgKiBJdCdzIHN0cmFuZ2UsIGJ1dCBpdCBsZXRzIHVzIGhhdmUgYW4gaW5kZXRlcm1pbmF0ZSBzdGF0ZSB3aGVyZSBvbmx5XG4gICAgICAgKiBzb21lIG9mIHRoZSBpdGVtcyBhcmUgc2VsZWN0ZWQuXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2VsZWN0aW9uLnRvZ2dsZUFsbCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuaXRlbXMuc21hcnQpIHtcbiAgICAgIHRoaXMuaXRlbXMuYWxsID0gdGhpcy5yb3dzLm1hcCgocm93OiBDbHJEYXRhZ3JpZFJvdzxUPikgPT4gcm93Lml0ZW0pO1xuICAgIH1cblxuICAgIGNvbnN0IHJvd0l0ZW1zQ2hhbmdlcyA9IHRoaXMucm93cy5jaGFuZ2VzLnBpcGUoXG4gICAgICBzd2l0Y2hNYXAoKHJvd3M6IENsckRhdGFncmlkUm93PFQ+W10pID0+XG4gICAgICAgIG1lcmdlKFxuICAgICAgICAgIC8vIGltbWVkaWF0ZSB1cGRhdGVcbiAgICAgICAgICBvZihyb3dzLm1hcChyb3cgPT4gcm93Lml0ZW0pKSxcbiAgICAgICAgICAvLyBzdWJzZXF1ZW50IHVwZGF0ZXMgb25jZSBwZXIgdGlja1xuICAgICAgICAgIGNvbWJpbmVMYXRlc3Qocm93cy5tYXAocm93ID0+IHJvdy5pdGVtQ2hhbmdlcykpLnBpcGUoZGVib3VuY2VUaW1lKDApKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcblxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHJvd0l0ZW1zQ2hhbmdlcy5zdWJzY3JpYmUoYWxsID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLml0ZW1zLnNtYXJ0KSB7XG4gICAgICAgICAgdGhpcy5pdGVtcy5hbGwgPSBhbGw7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5yb3dzLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgLy8gUmVtb3ZlIGFueSBwcm9qZWN0ZWQgcm93cyBmcm9tIHRoZSBkaXNwbGF5ZWRSb3dzIGNvbnRhaW5lclxuICAgICAgICAvLyBOZWNlc3Nhcnkgd2l0aCBJdnkgb2ZmLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3Ztd2FyZS9jbGFyaXR5L2lzc3Vlcy80NjkyXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl9kaXNwbGF5ZWRSb3dzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX2Rpc3BsYXllZFJvd3MuZ2V0KGkpLmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGxheWVkUm93cy5yZW1vdmUoaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgdGhpcy5fZGlzcGxheWVkUm93cy5pbnNlcnQocm93Ll92aWV3KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEZXRhaWxTdGF0ZSgpO1xuXG4gICAgICAgIC8vIHJldGFpbiBhY3RpdmUgY2VsbCB3aGVuIG5hdmlnYXRpbmcgd2l0aCBVcC9Eb3duIEFycm93cywgUGFnZVVwIGFuZCBQYWdlRG93biBidXR0b25zIGluIHZpcnR1YWwgc2Nyb2xsZXJcbiAgICAgICAgaWYgKHRoaXMudmlydHVhbFNjcm9sbCkge1xuICAgICAgICAgIGNvbnN0IGFjdGl2ZSA9IHRoaXMua2V5TmF2aWdhdGlvbi5nZXRBY3RpdmVDZWxsKCk7XG4gICAgICAgICAgaWYgKGFjdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmtleU5hdmlnYXRpb24uc2V0QWN0aXZlQ2VsbChhY3RpdmUpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIE91ciBzZXR1cCBoYXBwZW5zIGluIHRoZSB2aWV3IG9mIHNvbWUgb2Ygb3VyIGNvbXBvbmVudHMsIHNvIHdlIHdhaXQgZm9yIGl0IHRvIGJlIGRvbmUgYmVmb3JlIHN0YXJ0aW5nXG4gICAqL1xuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5rZXlOYXZpZ2F0aW9uLmluaXRpYWxpemVLZXlHcmlkKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy51cGRhdGVEZXRhaWxTdGF0ZSgpO1xuICAgIC8vIFRPRE86IGRldGVybWluZSBpZiB3ZSBjYW4gZ2V0IHJpZCBvZiBwcm92aWRlciB3aXJpbmcgaW4gdmlldyBpbml0IHNvIHRoYXQgc3Vic2NyaXB0aW9ucyBjYW4gYmUgZG9uZSBlYXJsaWVyXG4gICAgdGhpcy5yZWZyZXNoLmVtaXQodGhpcy5zdGF0ZVByb3ZpZGVyLnN0YXRlKTtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLnN0aWNreUhlYWRlcnMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5yZXNpemUoKSksXG4gICAgICB0aGlzLnN0YXRlUHJvdmlkZXIuY2hhbmdlLnN1YnNjcmliZShzdGF0ZSA9PiB0aGlzLnJlZnJlc2guZW1pdChzdGF0ZSkpLFxuICAgICAgdGhpcy5zZWxlY3Rpb24uY2hhbmdlLnN1YnNjcmliZShzID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuU2luZ2xlKSB7XG4gICAgICAgICAgdGhpcy5zaW5nbGVTZWxlY3RlZENoYW5nZWQuZW1pdChzIGFzIFQpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuTXVsdGkpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlZC5lbWl0KHMgYXMgVFtdKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICAvLyBSZWluaXRpYWxpemUgYXJyb3cga2V5IG5hdmlnYXRpb24gb24gcGFnZSBjaGFuZ2VzXG4gICAgICB0aGlzLnBhZ2UuY2hhbmdlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMua2V5TmF2aWdhdGlvbi5yZXNldEtleUdyaWQoKTtcbiAgICAgICAgaWYgKCF0aGlzLmNsckRnRGlzYWJsZVBhZ2VGb2N1cykge1xuICAgICAgICAgIHRoaXMuZGF0YWdyaWRUYWJsZS5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgLy8gQSBzdWJzY3JpcHRpb24gdGhhdCBsaXN0ZW5zIGZvciBkaXNwbGF5TW9kZSBjaGFuZ2VzIG9uIHRoZSBkYXRhZ3JpZFxuICAgICAgdGhpcy5kaXNwbGF5TW9kZS52aWV3LnN1YnNjcmliZSh2aWV3Q2hhbmdlID0+IHtcbiAgICAgICAgLy8gUmVtb3ZlIGFueSBwcm9qZWN0ZWQgY29sdW1ucyBmcm9tIHRoZSBwcm9qZWN0ZWREaXNwbGF5Q29sdW1ucyBjb250YWluZXJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX3Byb2plY3RlZERpc3BsYXlDb2x1bW5zLmxlbmd0aDsgaSA+IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMuX3Byb2plY3RlZERpc3BsYXlDb2x1bW5zLmRldGFjaCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlbW92ZSBhbnkgcHJvamVjdGVkIGNvbHVtbnMgZnJvbSB0aGUgcHJvamVjdGVkQ2FsY3VsYXRpb25Db2x1bW5zIGNvbnRhaW5lclxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fcHJvamVjdGVkQ2FsY3VsYXRpb25Db2x1bW5zLmxlbmd0aDsgaSA+IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMuX3Byb2plY3RlZENhbGN1bGF0aW9uQ29sdW1ucy5kZXRhY2goKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZW1vdmUgYW55IHByb2plY3RlZCByb3dzIGZyb20gdGhlIGNhbGN1bGF0aW9uUm93cyBjb250YWluZXJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX2NhbGN1bGF0aW9uUm93cy5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICB0aGlzLl9jYWxjdWxhdGlvblJvd3MuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVtb3ZlIGFueSBwcm9qZWN0ZWQgcm93cyBmcm9tIHRoZSBkaXNwbGF5ZWRSb3dzIGNvbnRhaW5lclxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fZGlzcGxheWVkUm93cy5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICB0aGlzLl9kaXNwbGF5ZWRSb3dzLmRldGFjaCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2aWV3Q2hhbmdlID09PSBEYXRhZ3JpZERpc3BsYXlNb2RlLkRJU1BMQVkpIHtcbiAgICAgICAgICAvLyBTZXQgc3RhdGUsIHN0eWxlIGZvciB0aGUgZGF0YWdyaWQgdG8gRElTUExBWSBhbmQgaW5zZXJ0IHJvdyAmIGNvbHVtbnMgaW50byBjb250YWluZXJzXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdkYXRhZ3JpZC1jYWxjdWxhdGUtbW9kZScpO1xuICAgICAgICAgIHRoaXMuY29sdW1ucy5mb3JFYWNoKGNvbHVtbiA9PiB7XG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0ZWREaXNwbGF5Q29sdW1ucy5pbnNlcnQoY29sdW1uLl92aWV3KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGxheWVkUm93cy5pbnNlcnQocm93Ll92aWV3KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBTZXQgc3RhdGUsIHN0eWxlIGZvciB0aGUgZGF0YWdyaWQgdG8gQ0FMQ1VMQVRFIGFuZCBpbnNlcnQgcm93ICYgY29sdW1ucyBpbnRvIGNvbnRhaW5lcnNcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2RhdGFncmlkLWNhbGN1bGF0ZS1tb2RlJyk7XG4gICAgICAgICAgLy8gSW5zZXJ0cyBhIGZpeGVkIGNvbHVtbiBpZiBhbnkgb2YgdGhlc2UgY29uZGl0aW9ucyBhcmUgdHJ1ZS5cbiAgICAgICAgICBjb25zdCBmaXhlZENvbHVtbkNvbmRpdGlvbnMgPSBbXG4gICAgICAgICAgICB0aGlzLnJvd0FjdGlvblNlcnZpY2UuaGFzQWN0aW9uYWJsZVJvdyxcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgIT09IHRoaXMuU0VMRUNUSU9OX1RZUEUuTm9uZSxcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kYWJsZVJvd3MuaGFzRXhwYW5kYWJsZVJvdyB8fCB0aGlzLmRldGFpbFNlcnZpY2UuZW5hYmxlZCxcbiAgICAgICAgICBdO1xuICAgICAgICAgIGZpeGVkQ29sdW1uQ29uZGl0aW9uc1xuICAgICAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAgICAgLmZvckVhY2goKCkgPT5cbiAgICAgICAgICAgICAgdGhpcy5fcHJvamVjdGVkQ2FsY3VsYXRpb25Db2x1bW5zLmluc2VydCh0aGlzLl9maXhlZENvbHVtblRlbXBsYXRlLmNyZWF0ZUVtYmVkZGVkVmlldyhudWxsKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5jb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3RlZENhbGN1bGF0aW9uQ29sdW1ucy5pbnNlcnQoY29sdW1uLl92aWV3KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnJvd3MuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRpb25Sb3dzLmluc2VydChyb3cuX3ZpZXcpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG5cbiAgICAvLyBXZSBuZWVkIHRvIHByZXNlcnZlIHNoaWZ0IHN0YXRlLCBzbyBpdCBjYW4gYmUgdXNlZCBvbiBzZWxlY3Rpb24gY2hhbmdlLCByZWdhcmRsZXNzIG9mIHRoZSBpbnB1dCBldmVudFxuICAgIC8vIHRoYXQgdHJpZ2dlcmVkIHRoZSBjaGFuZ2UuIFRoaXMgaGVscHMgdXMgdG8gZWFzaWx5IHJlc29sdmUgdGhlIGsvYiBvbmx5IGNhc2UgdG9nZXRoZXIgd2l0aCB0aGUgbW91c2Ugc2VsZWN0aW9uIGNhc2UuXG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgZnJvbUV2ZW50KHRoaXMuZG9jdW1lbnQuYm9keSwgJ2tleWRvd24nKS5zdWJzY3JpYmUoKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ1NoaWZ0Jykge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc2hpZnRQcmVzc2VkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICBmcm9tRXZlbnQodGhpcy5kb2N1bWVudC5ib2R5LCAna2V5dXAnKS5zdWJzY3JpYmUoKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ1NoaWZ0Jykge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc2hpZnRQcmVzc2VkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KTtcbiAgICBpZiAodGhpcy52aXJ0dWFsU2Nyb2xsKSB7XG4gICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgIGZyb21FdmVudCh0aGlzLmNvbnRlbnRXcmFwcGVyLm5hdGl2ZUVsZW1lbnQsICdzY3JvbGwnKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZGF0YWdyaWRIZWFkZXIubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0ID0gdGhpcy5jb250ZW50V3JhcHBlci5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuZm9yRWFjaCgoc3ViOiBTdWJzY3JpcHRpb24pID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcbiAgfVxuXG4gIHRvZ2dsZUFsbFNlbGVjdGVkKCRldmVudDogYW55KSB7XG4gICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zZWxlY3RBbGxDaGVja2JveD8ubmF0aXZlRWxlbWVudC5jbGljaygpO1xuICB9XG5cbiAgcmVzaXplKCk6IHZvaWQge1xuICAgIHRoaXMub3JnYW5pemVyLnJlc2l6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB0aGUgc3RhdGUgb2YgZGV0YWlsIHBhbmVsIGFuZCBpZiBpdCdzIG9wZW5lZCB0aGVuXG4gICAqIGZpbmQgdGhlIG1hdGNoaW5nIHJvdyBhbmQgdHJpZ2dlciB0aGUgZGV0YWlsIHBhbmVsXG4gICAqL1xuICB1cGRhdGVEZXRhaWxTdGF0ZSgpIHtcbiAgICAvLyBUcnkgdG8gdXBkYXRlIG9ubHkgd2hlbiB0aGVyZSBpcyBzb21ldGhpbmcgY2FjaGVkIGFuZCBpdHMgb3Blbi5cbiAgICBpZiAodGhpcy5kZXRhaWxTZXJ2aWNlLnN0YXRlICYmIHRoaXMuZGV0YWlsU2VydmljZS5pc09wZW4pIHtcbiAgICAgIGNvbnN0IHJvdyA9IHRoaXMucm93cy5maW5kKHJvdyA9PiB0aGlzLml0ZW1zLnRyYWNrQnkocm93Lml0ZW0pID09PSB0aGlzLml0ZW1zLnRyYWNrQnkodGhpcy5kZXRhaWxTZXJ2aWNlLnN0YXRlKSk7XG5cbiAgICAgIC8qKlxuICAgICAgICogUmVvcGVuIHVwZGF0ZWQgcm93IG9yIGNsb3NlIGl0XG4gICAgICAgKi9cbiAgICAgIGlmIChyb3cpIHtcbiAgICAgICAgdGhpcy5kZXRhaWxTZXJ2aWNlLm9wZW4ocm93Lml0ZW0sIHJvdy5kZXRhaWxCdXR0b24ubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIC8vIGFsd2F5cyBrZWVwIG9wZW4gd2hlbiB2aXJ0dWFsIHNjcm9sbCBpcyBhdmFpbGFibGUgb3RoZXJ3aXNlIGNsb3NlIGl0XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLnZpcnR1YWxTY3JvbGwpIHtcbiAgICAgICAgLy8gVXNpbmcgc2V0VGltZW91dCB0byBtYWtlIHN1cmUgdGhlIGlubmVyIGN5Y2xlcyBpbiByb3dzIGFyZSBkb25lXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZGV0YWlsU2VydmljZS5jbG9zZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHVibGljIG1ldGhvZCB0byByZS10cmlnZ2VyIHRoZSBjb21wdXRhdGlvbiBvZiBkaXNwbGF5ZWQgaXRlbXMgbWFudWFsbHlcbiAgICovXG4gIGRhdGFDaGFuZ2VkKCkge1xuICAgIHRoaXMuaXRlbXMucmVmcmVzaCgpO1xuICB9XG59XG4iLCI8IS0tXG4gIH4gQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gIH4gVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICB+IFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gIH4gVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICAtLT5cblxuPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWRnLWFjdGlvbi1iYXJcIj48L25nLWNvbnRlbnQ+XG48ZGl2IGNsYXNzPVwiZGF0YWdyaWQtb3V0ZXItd3JhcHBlclwiPlxuICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtaW5uZXItd3JhcHBlclwiPlxuICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZFwiICNkYXRhZ3JpZCBbYXR0ci5hcmlhLWhpZGRlbl09XCJkZXRhaWxTZXJ2aWNlLmlzT3BlbiA/IHRydWUgOiBudWxsXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtdGFibGUtd3JhcHBlclwiPlxuICAgICAgICA8ZGl2IHJvbGU9XCJncmlkXCIgY2xhc3M9XCJkYXRhZ3JpZC10YWJsZVwiIHRhYmluZGV4PVwiLTFcIiAjZGF0YWdyaWRUYWJsZT5cbiAgICAgICAgICA8ZGl2IHJvbGU9XCJyb3dncm91cFwiIGNsYXNzPVwiZGF0YWdyaWQtaGVhZGVyXCIgI2RhdGFncmlkSGVhZGVyPlxuICAgICAgICAgICAgPGRpdiByb2xlPVwicm93XCIgY2xhc3M9XCJkYXRhZ3JpZC1yb3dcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLXJvdy1tYXN0ZXIgZGF0YWdyaWQtcm93LWZsZXhcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtcm93LXN0aWNreVwiPlxuICAgICAgICAgICAgICAgICAgPCEtLWhlYWRlciBmb3IgZGF0YWdyaWQgd2hlcmUgeW91IGNhbiBzZWxlY3QgbXVsdGlwbGUgcm93cyAtLT5cbiAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgI3N0aWNreUhlYWRlclxuICAgICAgICAgICAgICAgICAgICByb2xlPVwiY29sdW1uaGVhZGVyXCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4gZGF0YWdyaWQtc2VsZWN0IGRhdGFncmlkLWZpeGVkLWNvbHVtblwiXG4gICAgICAgICAgICAgICAgICAgICpuZ0lmPVwic2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNFTEVDVElPTl9UWVBFLk11bHRpXCJcbiAgICAgICAgICAgICAgICAgICAgKGtleWRvd24uc3BhY2UpPVwidG9nZ2xlQWxsU2VsZWN0ZWQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgKm5nSWY9XCIhdmlydHVhbFNjcm9sbCB8fCBjdXN0b21TZWxlY3RBbGxFbmFibGVkXCIgY2xhc3M9XCJjbHItY2hlY2tib3gtd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgICAgICAgIDwhLS0gV2UgbmVlZCB0byBtb3ZlIGZvY3VzIGFuZCBzcGFjZS1rZXkgaGFuZGxpbmcgdG8gdGhlIHBhcmVudCBiZWNhdXNlIG9mIGtleWJvYXJkIGFycm93IGtleSBuYXZpZ2F0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpY2ggaXMgbm90IGFibGUgdG8gdHJhbnNmZXIgZm9jdXMgZGlyZWN0bHkgb24gdGhlIGlucHV0IHdoZW4gZm9jdXNlZCB3aXRoIHRoZSB0YWIga2V5IC0tPlxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgI3NlbGVjdEFsbENoZWNrYm94XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2lkXT1cInNlbGVjdEFsbElkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFsobmdNb2RlbCldPVwiYWxsU2VsZWN0ZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjb21tb25TdHJpbmdzLmtleXMuc2VsZWN0QWxsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPCEtLSBVc2FnZSBvZiBjbGFzcyBjbHItY29sLW51bGwgaGVyZSBwcmV2ZW50cyBjbHItY29sLSogY2xhc3NlcyBmcm9tIGJlaW5nIGFkZGVkIHdoZW4gYSBkYXRhZ3JpZCBpcyB3cmFwcGVkIGluc2lkZSBjbHJGb3JtIC0tPlxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBbZm9yXT1cInNlbGVjdEFsbElkXCIgY2xhc3M9XCJjbHItY29udHJvbC1sYWJlbCBjbHItY29sLW51bGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57e2NvbW1vblN0cmluZ3Mua2V5cy5zZWxlY3RBbGx9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uLXNlcGFyYXRvclwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8IS0tIGhlYWRlciBmb3IgZGF0YWdyaWQgd2hlcmUgeW91IGNhbiBzZWxlY3Qgb25lIHJvdyBvbmx5IC0tPlxuICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAjc3RpY2t5SGVhZGVyXG4gICAgICAgICAgICAgICAgICAgIHJvbGU9XCJjb2x1bW5oZWFkZXJcIlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImRhdGFncmlkLWNvbHVtbiBkYXRhZ3JpZC1zZWxlY3QgZGF0YWdyaWQtZml4ZWQtY29sdW1uXCJcbiAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJzZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9PT0gU0VMRUNUSU9OX1RZUEUuU2luZ2xlXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNsci1zci1vbmx5XCI+e3tjbHJEZ1NpbmdsZVNlbGVjdGlvbkFyaWFMYWJlbH19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4tc2VwYXJhdG9yXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwhLS0gaGVhZGVyIGZvciBzaW5nbGUgcm93IGFjdGlvbjsgb25seSBkaXNwbGF5VHlwZSBpZiB3ZSBoYXZlIGF0IGxlYXN0IG9uZSBhY3Rpb25hYmxlIHJvdyBpbiBkYXRhZ3JpZCAtLT5cbiAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgI3N0aWNreUhlYWRlclxuICAgICAgICAgICAgICAgICAgICByb2xlPVwiY29sdW1uaGVhZGVyXCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4gZGF0YWdyaWQtcm93LWFjdGlvbnMgZGF0YWdyaWQtZml4ZWQtY29sdW1uXCJcbiAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJyb3dBY3Rpb25TZXJ2aWNlLmhhc0FjdGlvbmFibGVSb3dcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57e2NsckRnU2luZ2xlQWN0aW9uYWJsZUFyaWFMYWJlbH19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4tc2VwYXJhdG9yXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwhLS0gaGVhZGVyIGZvciBjYXJldHM7IG9ubHkgZGlzcGxheVR5cGUgaWYgd2UgaGF2ZSBhdCBsZWFzdCBvbmUgZXhwYW5kYWJsZSByb3cgaW4gZGF0YWdyaWQgLS0+XG4gICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICNzdGlja3lIZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgcm9sZT1cImNvbHVtbmhlYWRlclwiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uIGRhdGFncmlkLWV4cGFuZGFibGUtY2FyZXQgZGF0YWdyaWQtZml4ZWQtY29sdW1uXCJcbiAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJleHBhbmRhYmxlUm93cy5oYXNFeHBhbmRhYmxlUm93IHx8IGRldGFpbFNlcnZpY2UuZW5hYmxlZFwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjbHItc3Itb25seVwiPnt7Y2xyRGV0YWlsRXhwYW5kYWJsZUFyaWFMYWJlbH19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4tc2VwYXJhdG9yXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtcm93LXNjcm9sbGFibGVcIj5cbiAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgI3Byb2plY3RlZERpc3BsYXlDb2x1bW5zPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJ2aXJ0dWFsU2Nyb2xsXCIgY2xhc3M9XCJkYXRhZ3JpZC1yb3ctc3RpY2t5IGRhdGFncmlkLXJvdy1zdGlja3ktc2Nyb2xsXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtY29udGVudFwiIFtjbGFzcy5kYXRhZ3JpZC1jb250ZW50LXZpcnR1YWxdPVwidmlydHVhbFNjcm9sbFwiICNjb250ZW50V3JhcHBlcj5cbiAgICAgICAgICAgIDxkaXYgcm9sZT1cInByZXNlbnRhdGlvblwiIGNsYXNzPVwiZGF0YWdyaWQtcm93c1wiPlxuICAgICAgICAgICAgICA8Y2xyLWRnLXJvdyBjbGFzcz1cImRhdGFncmlkLXJvdy1sb2FkaW5nXCIgKm5nSWY9XCJsb2FkaW5nTW9yZUl0ZW1zXCI+XG4gICAgICAgICAgICAgICAgPGNsci1kZy1jZWxsPlxuICAgICAgICAgICAgICAgICAgPGNsci1zcGlubmVyIGNsck1lZGl1bT48L2Nsci1zcGlubmVyPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+e3sgY29tbW9uU3RyaW5ncy5rZXlzLmxvYWRpbmcgfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9jbHItZGctY2VsbD5cbiAgICAgICAgICAgICAgPC9jbHItZGctcm93PlxuXG4gICAgICAgICAgICAgIDxuZy1jb250YWluZXIgI2Rpc3BsYXllZFJvd3M+PC9uZy1jb250YWluZXI+XG5cbiAgICAgICAgICAgICAgPGNsci1kZy1yb3cgY2xhc3M9XCJkYXRhZ3JpZC1yb3ctbG9hZGluZ1wiICpuZ0lmPVwibG9hZGluZ01vcmVJdGVtc1wiPlxuICAgICAgICAgICAgICAgIDxjbHItZGctY2VsbD5cbiAgICAgICAgICAgICAgICAgIDxjbHItc3Bpbm5lciBjbHJNZWRpdW0+PC9jbHItc3Bpbm5lcj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPnt7IGNvbW1vblN0cmluZ3Mua2V5cy5sb2FkaW5nIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvY2xyLWRnLWNlbGw+XG4gICAgICAgICAgICAgIDwvY2xyLWRnLXJvdz5cblxuICAgICAgICAgICAgICA8IS0tIEN1c3RvbSBwbGFjZWhvbGRlciBvdmVycmlkZXMgdGhlIGRlZmF1bHQgZW1wdHkgb25lIC0tPlxuICAgICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItZGctcGxhY2Vob2xkZXJcIj48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICAgIDxjbHItZGctcGxhY2Vob2xkZXIgKm5nSWY9XCIhcGxhY2Vob2xkZXJcIj48L2Nsci1kZy1wbGFjZWhvbGRlcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAqbmdJZj1cInZpcnR1YWxTY3JvbGxcIlxuICAgICAgICAgICAgICBjbGFzcz1cImRhdGFncmlkLWNvbnRlbnQtdmlydHVhbC1zcGFjZXJcIlxuICAgICAgICAgICAgICBbc3R5bGUuaGVpZ2h0XT1cInZpcnR1YWxTY3JvbGw/LnRvdGFsQ29udGVudEhlaWdodFwiXG4gICAgICAgICAgICA+PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWRnLWZvb3RlclwiPjwvbmctY29udGVudD5cbiAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtc3Bpbm5lclwiICpuZ0lmPVwibG9hZGluZ1wiPlxuICAgICAgPGNsci1zcGlubmVyIGNsck1lZGl1bT5Mb2FkaW5nPC9jbHItc3Bpbm5lcj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIDxuZy1jb250ZW50IHNlbGVjdD1cIltjbHJJZkRldGFpbF0sY2xyLWRnLWRldGFpbFwiPjwvbmctY29udGVudD5cbjwvZGl2PlxuXG48ZGl2IGNsYXNzPVwiZGF0YWdyaWQtY2FsY3VsYXRpb24tdGFibGVcIj5cbiAgPGRpdiBjbGFzcz1cImRhdGFncmlkLWNhbGN1bGF0aW9uLWhlYWRlclwiPlxuICAgIDxuZy1jb250YWluZXIgI3Byb2plY3RlZENhbGN1bGF0aW9uQ29sdW1ucz48L25nLWNvbnRhaW5lcj5cbiAgPC9kaXY+XG4gIDxuZy1jb250YWluZXIgI2NhbGN1bGF0aW9uUm93cz48L25nLWNvbnRhaW5lcj5cbjwvZGl2PlxuXG48bmctdGVtcGxhdGUgI2ZpeGVkQ29sdW1uVGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4gZGF0YWdyaWQtZml4ZWQtY29sdW1uXCI+PC9kaXY+XG48L25nLXRlbXBsYXRlPlxuIl19
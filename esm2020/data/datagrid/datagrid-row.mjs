/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { DOCUMENT } from '@angular/common';
import { Component, ContentChildren, EventEmitter, Inject, Input, Output, ViewChild, ViewContainerRef, } from '@angular/core';
import { combineLatest, ReplaySubject } from 'rxjs';
import { ClrExpandableAnimationDirective } from '../../utils/animations/expandable-animation/expandable-animation.directive';
import { IfExpandService } from '../../utils/conditional/if-expanded.service';
import { HostWrapper } from '../../utils/host-wrapping/host-wrapper';
import { LoadingListener } from '../../utils/loading/loading-listener';
import { ClrDatagridCell } from './datagrid-cell';
import { DatagridIfExpandService } from './datagrid-if-expanded.service';
import { DatagridDisplayMode } from './enums/display-mode.enum';
import { SelectionType } from './enums/selection-type';
import { WrappedRow } from './wrapped-row';
import * as i0 from "@angular/core";
import * as i1 from "./providers/selection";
import * as i2 from "./providers/row-action-service";
import * as i3 from "./providers/global-expandable-rows";
import * as i4 from "./datagrid-if-expanded.service";
import * as i5 from "./providers/detail.service";
import * as i6 from "./providers/display-mode.service";
import * as i7 from "../../utils/i18n/common-strings.service";
import * as i8 from "./providers/items";
import * as i9 from "@angular/common";
import * as i10 from "../../icon/icon";
import * as i11 from "../../forms/common/label";
import * as i12 from "../../forms/radio/radio";
import * as i13 from "../../forms/radio/radio-wrapper";
import * as i14 from "@angular/forms";
import * as i15 from "../../utils/animations/expandable-animation/expandable-animation.directive";
import * as i16 from "../../progress/spinner/spinner";
import * as i17 from "./datagrid-cell";
import * as i18 from "./datagrid-selection-cell.directive";
import * as i19 from "./render/cell-renderer";
let nbRow = 0;
export class ClrDatagridRow {
    constructor(selection, rowActionService, globalExpandable, expand, detailService, displayMode, vcr, renderer, el, commonStrings, items, document) {
        this.selection = selection;
        this.rowActionService = rowActionService;
        this.globalExpandable = globalExpandable;
        this.expand = expand;
        this.detailService = detailService;
        this.displayMode = displayMode;
        this.vcr = vcr;
        this.commonStrings = commonStrings;
        this.items = items;
        this.document = document;
        this.selectedChanged = new EventEmitter(false);
        this.expandedChange = new EventEmitter(false);
        this.detailDisabled = false;
        this.detailHidden = false;
        this.skeletonLoading = false;
        this.displayCells = false;
        this.expandAnimationTrigger = false;
        /* reference to the enum so that template can access */
        this.SELECTION_TYPE = SelectionType;
        /**
         * @internal
         */
        this.itemChanges = new ReplaySubject(1);
        this._selected = false;
        this._detailOpenLabel = '';
        this._detailCloseLabel = '';
        this._rowSelectionLabel = '';
        this.subscriptions = [];
        // By default, every item is selectable; it becomes not selectable only if it's explicitly set to false
        this._selectable = true;
        nbRow++;
        this.id = 'clr-dg-row' + nbRow;
        this.radioId = 'clr-dg-row-rd' + nbRow;
        this.checkboxId = 'clr-dg-row-cb' + nbRow;
        this.expandableId = expand.expandableId;
        this.subscriptions.push(combineLatest(expand.replace, expand.expandChange).subscribe(([expandReplaceValue, expandChangeValue]) => {
            if (expandReplaceValue && expandChangeValue) {
                // replaced and expanding
                this.replaced = true;
                renderer.addClass(el.nativeElement, 'datagrid-row-replaced');
            }
            else {
                this.replaced = false;
                // Handles these cases: not replaced and collapsing & replaced and
                // collapsing and not replaced and expanding.
                renderer.removeClass(el.nativeElement, 'datagrid-row-replaced');
            }
        }));
    }
    /**
     * Model of the row, to use for selection
     */
    get item() {
        return this._item;
    }
    set item(item) {
        this._item = item;
        this.itemChanges.next(item);
        this.clrDgSelectable = this._selectable;
    }
    get clrDgSelectable() {
        return !this.selection.isLocked(this.item);
    }
    set clrDgSelectable(value) {
        if (this.item) {
            this.selection.lockItem(this.item, value === 'false' || value === false);
        }
        // Store this value locally, to be initialized when item is initialized
        this._selectable = value;
    }
    /**
     * Indicates if the row is selected
     */
    get selected() {
        if (this.selection.selectionType === SelectionType.None) {
            return this._selected;
        }
        else {
            return this.selection.isSelected(this.item);
        }
    }
    set selected(value) {
        if (this.selection.selectionType === SelectionType.None) {
            this._selected = value;
        }
        else {
            if (value && this.selection.selectionType === SelectionType.Multi) {
                this.rangeSelect();
            }
            else {
                this.selection.rangeStart = null;
            }
            this.selection.setSelected(this.item, value);
        }
    }
    get expanded() {
        return this.expand.expanded;
    }
    set expanded(value) {
        this.expand.expanded = value;
    }
    get clrDgDetailOpenLabel() {
        return this._detailOpenLabel ? this._detailOpenLabel : this.commonStrings.keys.open;
    }
    set clrDgDetailOpenLabel(label) {
        this._detailOpenLabel = label;
    }
    get clrDgDetailCloseLabel() {
        return this._detailCloseLabel ? this._detailCloseLabel : this.commonStrings.keys.close;
    }
    set clrDgDetailCloseLabel(label) {
        this._detailCloseLabel = label;
    }
    // CDE-151: Rename this field to clrDgRowSelectionLabel in v16
    get clrDgRowSelectionLabel() {
        return this._rowSelectionLabel ? this._rowSelectionLabel : this.commonStrings.keys.select;
    }
    set clrDgRowSelectionLabel(label) {
        this._rowSelectionLabel = label;
    }
    get _view() {
        return this.wrappedInjector.get(WrappedRow, this.vcr).rowView;
    }
    ngOnInit() {
        this.wrappedInjector = new HostWrapper(WrappedRow, this.vcr);
        this.selection.lockItem(this.item, this.clrDgSelectable === false);
    }
    ngAfterContentInit() {
        this.dgCells.changes.subscribe(() => {
            this.dgCells.forEach(cell => {
                if (!cell._view.destroyed) {
                    this._scrollableCells.insert(cell._view);
                }
            });
        });
    }
    ngAfterViewInit() {
        this.subscriptions.push(this.displayMode.view.subscribe(viewChange => {
            // Listen for view changes and move cells around depending on the current displayType
            // remove cell views from display view
            for (let i = this._scrollableCells.length; i > 0; i--) {
                this._scrollableCells.detach();
            }
            // remove cell views from calculated view
            for (let i = this._calculatedCells.length; i > 0; i--) {
                this._calculatedCells.detach();
            }
            if (viewChange === DatagridDisplayMode.CALCULATE) {
                this.displayCells = false;
                // Inserts a fixed cell if any of these conditions are true.
                const fixedCellConditions = [
                    this.selection.selectionType !== this.SELECTION_TYPE.None,
                    this.rowActionService.hasActionableRow,
                    this.globalExpandable.hasExpandableRow,
                    this.detailService.enabled,
                ];
                fixedCellConditions
                    .filter(Boolean)
                    .forEach(() => this._calculatedCells.insert(this._fixedCellTemplate.createEmbeddedView(null)));
                this.dgCells.forEach(cell => {
                    if (!cell._view.destroyed) {
                        this._calculatedCells.insert(cell._view);
                    }
                });
            }
            else {
                this.displayCells = true;
                this.dgCells.forEach(cell => {
                    if (!cell._view.destroyed) {
                        this._scrollableCells.insert(cell._view);
                    }
                });
            }
        }), this.expand.animate.subscribe(() => {
            this.expandAnimationTrigger = !this.expandAnimationTrigger;
        }));
    }
    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
    toggle(selected = !this.selected) {
        if (selected !== this.selected) {
            this.selected = selected;
            this.selectedChanged.emit(selected);
        }
    }
    toggleExpand() {
        if (this.expand.expandable) {
            this.expandAnimation.updateStartHeight();
            this.expanded = !this.expanded;
            this.expandedChange.emit(this.expanded);
        }
    }
    /**
     * The default behavior in Chrome and Firefox for shift-clicking on a label is to perform text-selection.
     * This prevents our intended range-selection, because this text-selection overrides our shift-click event.
     * We need to clear the stored selection range when shift-clicking. This will override the mostly unused shift-click
     * selection browser functionality, which is inconsistently implemented in browsers anyway.
     */
    clearRanges(event) {
        if (this.selection.rowSelectionMode && event.shiftKey) {
            this.document.getSelection().removeAllRanges();
            // Firefox is too persistent about its text-selection behaviour. So we need to add a preventDefault();
            // We should not try to enforce this on the other browsers, though, because their toggle cycle does not get canceled by
            // the preventDefault() and they toggle the checkbox second time, effectively retrurning it to not-selected.
            if (window.navigator.userAgent.indexOf('Firefox') !== -1) {
                event.preventDefault();
                this.toggle(true);
            }
        }
    }
    /**
     * @deprecated related to clrDgRowSelection, which is deprecated
     */
    selectRow(selected = !this.selected, $event) {
        // The label also captures clicks that bubble up to the row event listener, causing
        // this handler to run twice. This exits early to prevent toggling the checkbox twice.
        if (!this.selection.rowSelectionMode || $event.target.tagName === 'LABEL') {
            return;
        }
        if (this.selection.selectionType === this.SELECTION_TYPE.Single) {
            this.selection.currentSingle = this.item;
        }
        else {
            this.toggle(selected);
        }
    }
    rangeSelect() {
        const items = this.items.displayed;
        if (!items) {
            return;
        }
        const startIx = items.indexOf(this.selection.rangeStart);
        if (this.selection.rangeStart &&
            this.selection.current.includes(this.selection.rangeStart) &&
            this.selection.shiftPressed &&
            startIx !== -1) {
            const endIx = items.indexOf(this.item);
            // Using Set to remove duplicates
            const newSelection = new Set(this.selection.current.concat(items.slice(Math.min(startIx, endIx), Math.max(startIx, endIx) + 1)));
            this.selection.clearSelection();
            this.selection.current.push(...newSelection);
        }
        else {
            // page number has changed or
            // no Shift was pressed or
            // rangeStart not yet set
            this.selection.rangeStart = this.item;
        }
    }
}
ClrDatagridRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridRow, deps: [{ token: i1.Selection }, { token: i2.RowActionService }, { token: i3.ExpandableRowsCount }, { token: i4.DatagridIfExpandService }, { token: i5.DetailService }, { token: i6.DisplayModeService }, { token: i0.ViewContainerRef }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i7.ClrCommonStringsService }, { token: i8.Items }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagridRow.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridRow, selector: "clr-dg-row", inputs: { detailDisabled: ["clrDgDetailDisabled", "detailDisabled"], detailHidden: ["clrDgDetailHidden", "detailHidden"], skeletonLoading: ["clrDgSkeletonLoading", "skeletonLoading"], item: ["clrDgItem", "item"], clrDgSelectable: "clrDgSelectable", selected: ["clrDgSelected", "selected"], expanded: ["clrDgExpanded", "expanded"], clrDgDetailOpenLabel: "clrDgDetailOpenLabel", clrDgDetailCloseLabel: "clrDgDetailCloseLabel", clrDgRowSelectionLabel: "clrDgRowSelectionLabel" }, outputs: { selectedChanged: "clrDgSelectedChange", expandedChange: "clrDgExpandedChange" }, host: { attributes: { "role": "rowgroup" }, properties: { "class.datagrid-row": "true", "class.datagrid-row-skeleton": "skeletonLoading", "class.datagrid-selected": "selected", "attr.aria-owns": "id" } }, providers: [
        DatagridIfExpandService,
        { provide: IfExpandService, useExisting: DatagridIfExpandService },
        { provide: LoadingListener, useExisting: DatagridIfExpandService },
    ], queries: [{ propertyName: "dgCells", predicate: ClrDatagridCell }], viewQueries: [{ propertyName: "expandAnimation", first: true, predicate: ClrExpandableAnimationDirective, descendants: true }, { propertyName: "detailButton", first: true, predicate: ["detailButton"], descendants: true }, { propertyName: "_stickyCells", first: true, predicate: ["stickyCells"], descendants: true, read: ViewContainerRef }, { propertyName: "_scrollableCells", first: true, predicate: ["scrollableCells"], descendants: true, read: ViewContainerRef }, { propertyName: "_calculatedCells", first: true, predicate: ["calculatedCells"], descendants: true, read: ViewContainerRef }, { propertyName: "_fixedCellTemplate", first: true, predicate: ["fixedCellTemplate"], descendants: true }], ngImport: i0, template: "<div\n  role=\"row\"\n  [id]=\"id\"\n  class=\"datagrid-row-master datagrid-row-flex\"\n  [clrExpandableAnimation]=\"expandAnimationTrigger\"\n  (mousedown)=\"clearRanges($event)\"\n  (click)=\"selectRow(!selected, $event)\"\n  [class.datagrid-row-clickable]=\"selection.rowSelectionMode\"\n  [class.datagrid-row-detail-open]=\"detailService.isRowOpen(item)\"\n>\n  <div class=\"datagrid-row-sticky\">\n    <!-- Sticky elements here -->\n    <ng-container #stickyCells>\n      <div\n        *ngIf=\"selection.selectionType === SELECTION_TYPE.Multi\"\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <div class=\"clr-checkbox-wrapper\">\n          <input\n            tabindex=\"-1\"\n            type=\"checkbox\"\n            [ngModel]=\"selected\"\n            (ngModelChange)=\"toggle($event)\"\n            [id]=\"checkboxId\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n          <label [for]=\"checkboxId\" class=\"clr-control-label clr-col-null\" (click)=\"clearRanges($event)\">\n            <span class=\"clr-sr-only\">{{clrDgRowSelectionLabel || commonStrings.keys.select}}</span>\n          </label>\n        </div>\n      </div>\n      <div\n        *ngIf=\"selection.selectionType === SELECTION_TYPE.Single\"\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <clr-radio-wrapper>\n          <input\n            tabindex=\"-1\"\n            type=\"radio\"\n            clrRadio\n            [id]=\"radioId\"\n            [name]=\"selection.id + '-radio'\"\n            [value]=\"item\"\n            [(ngModel)]=\"selection.currentSingle\"\n            [checked]=\"selection.currentSingle === item\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <label class=\"clr-control-label clr-col-null\" [for]=\"radioId\">\n            <span class=\"clr-sr-only\">{{ clrDgRowSelectionLabel || commonStrings.keys.select }}</span>\n          </label>\n        </clr-radio-wrapper>\n      </div>\n      <div\n        *ngIf=\"rowActionService.hasActionableRow\"\n        class=\"datagrid-row-actions datagrid-fixed-column datagrid-cell\"\n        role=\"gridcell\"\n      >\n        <ng-content select=\"clr-dg-action-overflow\"></ng-content>\n      </div>\n      <div\n        *ngIf=\"globalExpandable.hasExpandableRow\"\n        class=\"datagrid-expandable-caret datagrid-fixed-column datagrid-cell\"\n        role=\"gridcell\"\n      >\n        <ng-container *ngIf=\"expand.expandable\">\n          <button\n            tabindex=\"-1\"\n            *ngIf=\"!expand.loading\"\n            (click)=\"toggleExpand()\"\n            type=\"button\"\n            class=\"datagrid-expandable-caret-button\"\n            [attr.aria-expanded]=\"expand.expanded\"\n            [attr.aria-label]=\"expand.expanded ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n            [attr.aria-controls]=\"expand.hasExpandTemplate && !expand.expanded ? null : expandableId\"\n          >\n            <cds-icon\n              shape=\"angle\"\n              class=\"datagrid-expandable-caret-icon\"\n              [attr.direction]=\"expand.expanded ? 'down' : 'right'\"\n              [attr.title]=\"expand.expanded ? commonStrings.keys.collapse : commonStrings.keys.expand\"\n            ></cds-icon>\n          </button>\n          <clr-spinner *ngIf=\"expand.loading\" clrSmall>{{ commonStrings.keys.loading }}</clr-spinner>\n        </ng-container>\n      </div>\n      <div\n        *ngIf=\"detailService.enabled\"\n        class=\"datagrid-detail-caret datagrid-fixed-column datagrid-cell\"\n        role=\"gridcell\"\n      >\n        <button\n          tabindex=\"-1\"\n          (click)=\"detailService.toggle(item, detailButton)\"\n          type=\"button\"\n          #detailButton\n          class=\"datagrid-detail-caret-button\"\n          [disabled]=\"detailDisabled\"\n          *ngIf=\"!detailHidden\"\n          [class.is-open]=\"detailService.isRowOpen(item)\"\n          [attr.aria-label]=\"detailService.isRowOpen(item) ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n          [attr.aria-expanded]=\"detailService.isRowOpen(item)\"\n          [attr.aria-controls]=\"detailService.id\"\n          aria-haspopup=\"dialog\"\n        >\n          <cds-icon\n            shape=\"angle-double\"\n            [attr.direction]=\"detailService.isRowOpen(item) ? 'left' : 'right'\"\n            class=\"datagrid-detail-caret-icon\"\n            [attr.title]=\"detailService.isRowOpen(item) ? commonStrings.keys.close: commonStrings.keys.open\"\n          ></cds-icon>\n        </button>\n      </div>\n    </ng-container>\n    <!-- placeholder for projecting other sticky cells as pinned-->\n  </div>\n  <div class=\"datagrid-row-scrollable\" [ngClass]=\"{'is-replaced': replaced && expanded}\">\n    <div class=\"datagrid-scrolling-cells\">\n      <ng-content select=\"clr-dg-cell\"></ng-content>\n      <ng-container #scrollableCells></ng-container>\n    </div>\n    <!-- details here when replace, re-visit when sticky container is used for pinned cells -->\n    <ng-template *ngIf=\"replaced && !expand.loading\" [ngTemplateOutlet]=\"detail\"></ng-template>\n    <ng-template *ngIf=\"!replaced && !expand.loading\" [ngTemplateOutlet]=\"detail\"></ng-template>\n  </div>\n  <clr-dg-cell class=\"skeleton-loading\" *ngIf=\"skeletonLoading\"></clr-dg-cell>\n</div>\n<!--\n    We need the \"project into template\" hacks because we need this in 2 different places\n    depending on whether the details replace the row or not.\n-->\n<ng-template #detail>\n  <ng-content select=\"clr-dg-row-detail\"></ng-content>\n</ng-template>\n\n<ng-container #calculatedCells></ng-container>\n\n<ng-template #fixedCellTemplate>\n  <div class=\"datagrid-fixed-column datagrid-cell\" role=\"gridcell\"></div>\n</ng-template>\n", dependencies: [{ kind: "directive", type: i9.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i9.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i9.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i10.CdsIconCustomTag, selector: "cds-icon" }, { kind: "directive", type: i11.ClrLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i12.ClrRadio, selector: "[clrRadio]" }, { kind: "component", type: i13.ClrRadioWrapper, selector: "clr-radio-wrapper" }, { kind: "directive", type: i14.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i14.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i14.RadioControlValueAccessor, selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]", inputs: ["name", "formControlName", "value"] }, { kind: "directive", type: i14.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i14.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i15.ClrExpandableAnimationDirective, selector: "[clrExpandableAnimation]", inputs: ["clrExpandableAnimation"] }, { kind: "component", type: i16.ClrSpinner, selector: "clr-spinner", inputs: ["clrInline", "clrInverse", "clrSmall", "clrMedium"] }, { kind: "component", type: i17.ClrDatagridCell, selector: "clr-dg-cell" }, { kind: "directive", type: i18.ClrDatagridSelectionCellDirective, selector: ".datagrid-select" }, { kind: "directive", type: i19.DatagridCellRenderer, selector: "clr-dg-cell" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridRow, decorators: [{
            type: Component,
            args: [{ selector: 'clr-dg-row', host: {
                        '[class.datagrid-row]': 'true',
                        '[class.datagrid-row-skeleton]': 'skeletonLoading',
                        '[class.datagrid-selected]': 'selected',
                        '[attr.aria-owns]': 'id',
                        role: 'rowgroup',
                    }, providers: [
                        DatagridIfExpandService,
                        { provide: IfExpandService, useExisting: DatagridIfExpandService },
                        { provide: LoadingListener, useExisting: DatagridIfExpandService },
                    ], template: "<div\n  role=\"row\"\n  [id]=\"id\"\n  class=\"datagrid-row-master datagrid-row-flex\"\n  [clrExpandableAnimation]=\"expandAnimationTrigger\"\n  (mousedown)=\"clearRanges($event)\"\n  (click)=\"selectRow(!selected, $event)\"\n  [class.datagrid-row-clickable]=\"selection.rowSelectionMode\"\n  [class.datagrid-row-detail-open]=\"detailService.isRowOpen(item)\"\n>\n  <div class=\"datagrid-row-sticky\">\n    <!-- Sticky elements here -->\n    <ng-container #stickyCells>\n      <div\n        *ngIf=\"selection.selectionType === SELECTION_TYPE.Multi\"\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <div class=\"clr-checkbox-wrapper\">\n          <input\n            tabindex=\"-1\"\n            type=\"checkbox\"\n            [ngModel]=\"selected\"\n            (ngModelChange)=\"toggle($event)\"\n            [id]=\"checkboxId\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n          <label [for]=\"checkboxId\" class=\"clr-control-label clr-col-null\" (click)=\"clearRanges($event)\">\n            <span class=\"clr-sr-only\">{{clrDgRowSelectionLabel || commonStrings.keys.select}}</span>\n          </label>\n        </div>\n      </div>\n      <div\n        *ngIf=\"selection.selectionType === SELECTION_TYPE.Single\"\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <clr-radio-wrapper>\n          <input\n            tabindex=\"-1\"\n            type=\"radio\"\n            clrRadio\n            [id]=\"radioId\"\n            [name]=\"selection.id + '-radio'\"\n            [value]=\"item\"\n            [(ngModel)]=\"selection.currentSingle\"\n            [checked]=\"selection.currentSingle === item\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <label class=\"clr-control-label clr-col-null\" [for]=\"radioId\">\n            <span class=\"clr-sr-only\">{{ clrDgRowSelectionLabel || commonStrings.keys.select }}</span>\n          </label>\n        </clr-radio-wrapper>\n      </div>\n      <div\n        *ngIf=\"rowActionService.hasActionableRow\"\n        class=\"datagrid-row-actions datagrid-fixed-column datagrid-cell\"\n        role=\"gridcell\"\n      >\n        <ng-content select=\"clr-dg-action-overflow\"></ng-content>\n      </div>\n      <div\n        *ngIf=\"globalExpandable.hasExpandableRow\"\n        class=\"datagrid-expandable-caret datagrid-fixed-column datagrid-cell\"\n        role=\"gridcell\"\n      >\n        <ng-container *ngIf=\"expand.expandable\">\n          <button\n            tabindex=\"-1\"\n            *ngIf=\"!expand.loading\"\n            (click)=\"toggleExpand()\"\n            type=\"button\"\n            class=\"datagrid-expandable-caret-button\"\n            [attr.aria-expanded]=\"expand.expanded\"\n            [attr.aria-label]=\"expand.expanded ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n            [attr.aria-controls]=\"expand.hasExpandTemplate && !expand.expanded ? null : expandableId\"\n          >\n            <cds-icon\n              shape=\"angle\"\n              class=\"datagrid-expandable-caret-icon\"\n              [attr.direction]=\"expand.expanded ? 'down' : 'right'\"\n              [attr.title]=\"expand.expanded ? commonStrings.keys.collapse : commonStrings.keys.expand\"\n            ></cds-icon>\n          </button>\n          <clr-spinner *ngIf=\"expand.loading\" clrSmall>{{ commonStrings.keys.loading }}</clr-spinner>\n        </ng-container>\n      </div>\n      <div\n        *ngIf=\"detailService.enabled\"\n        class=\"datagrid-detail-caret datagrid-fixed-column datagrid-cell\"\n        role=\"gridcell\"\n      >\n        <button\n          tabindex=\"-1\"\n          (click)=\"detailService.toggle(item, detailButton)\"\n          type=\"button\"\n          #detailButton\n          class=\"datagrid-detail-caret-button\"\n          [disabled]=\"detailDisabled\"\n          *ngIf=\"!detailHidden\"\n          [class.is-open]=\"detailService.isRowOpen(item)\"\n          [attr.aria-label]=\"detailService.isRowOpen(item) ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n          [attr.aria-expanded]=\"detailService.isRowOpen(item)\"\n          [attr.aria-controls]=\"detailService.id\"\n          aria-haspopup=\"dialog\"\n        >\n          <cds-icon\n            shape=\"angle-double\"\n            [attr.direction]=\"detailService.isRowOpen(item) ? 'left' : 'right'\"\n            class=\"datagrid-detail-caret-icon\"\n            [attr.title]=\"detailService.isRowOpen(item) ? commonStrings.keys.close: commonStrings.keys.open\"\n          ></cds-icon>\n        </button>\n      </div>\n    </ng-container>\n    <!-- placeholder for projecting other sticky cells as pinned-->\n  </div>\n  <div class=\"datagrid-row-scrollable\" [ngClass]=\"{'is-replaced': replaced && expanded}\">\n    <div class=\"datagrid-scrolling-cells\">\n      <ng-content select=\"clr-dg-cell\"></ng-content>\n      <ng-container #scrollableCells></ng-container>\n    </div>\n    <!-- details here when replace, re-visit when sticky container is used for pinned cells -->\n    <ng-template *ngIf=\"replaced && !expand.loading\" [ngTemplateOutlet]=\"detail\"></ng-template>\n    <ng-template *ngIf=\"!replaced && !expand.loading\" [ngTemplateOutlet]=\"detail\"></ng-template>\n  </div>\n  <clr-dg-cell class=\"skeleton-loading\" *ngIf=\"skeletonLoading\"></clr-dg-cell>\n</div>\n<!--\n    We need the \"project into template\" hacks because we need this in 2 different places\n    depending on whether the details replace the row or not.\n-->\n<ng-template #detail>\n  <ng-content select=\"clr-dg-row-detail\"></ng-content>\n</ng-template>\n\n<ng-container #calculatedCells></ng-container>\n\n<ng-template #fixedCellTemplate>\n  <div class=\"datagrid-fixed-column datagrid-cell\" role=\"gridcell\"></div>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i1.Selection }, { type: i2.RowActionService }, { type: i3.ExpandableRowsCount }, { type: i4.DatagridIfExpandService }, { type: i5.DetailService }, { type: i6.DisplayModeService }, { type: i0.ViewContainerRef }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i7.ClrCommonStringsService }, { type: i8.Items }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { selectedChanged: [{
                type: Output,
                args: ['clrDgSelectedChange']
            }], expandedChange: [{
                type: Output,
                args: ['clrDgExpandedChange']
            }], detailDisabled: [{
                type: Input,
                args: ['clrDgDetailDisabled']
            }], detailHidden: [{
                type: Input,
                args: ['clrDgDetailHidden']
            }], skeletonLoading: [{
                type: Input,
                args: ['clrDgSkeletonLoading']
            }], dgCells: [{
                type: ContentChildren,
                args: [ClrDatagridCell]
            }], expandAnimation: [{
                type: ViewChild,
                args: [ClrExpandableAnimationDirective]
            }], detailButton: [{
                type: ViewChild,
                args: ['detailButton']
            }], _stickyCells: [{
                type: ViewChild,
                args: ['stickyCells', { read: ViewContainerRef }]
            }], _scrollableCells: [{
                type: ViewChild,
                args: ['scrollableCells', { read: ViewContainerRef }]
            }], _calculatedCells: [{
                type: ViewChild,
                args: ['calculatedCells', { read: ViewContainerRef }]
            }], _fixedCellTemplate: [{
                type: ViewChild,
                args: ['fixedCellTemplate']
            }], item: [{
                type: Input,
                args: ['clrDgItem']
            }], clrDgSelectable: [{
                type: Input,
                args: ['clrDgSelectable']
            }], selected: [{
                type: Input,
                args: ['clrDgSelected']
            }], expanded: [{
                type: Input,
                args: ['clrDgExpanded']
            }], clrDgDetailOpenLabel: [{
                type: Input
            }], clrDgDetailCloseLabel: [{
                type: Input
            }], clrDgRowSelectionLabel: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtcm93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC1yb3cudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2RhdGFncmlkLXJvdy5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFHTCxTQUFTLEVBQ1QsZUFBZSxFQUVmLFlBQVksRUFDWixNQUFNLEVBRU4sS0FBSyxFQUNMLE1BQU0sRUFJTixTQUFTLEVBQ1QsZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUVsRSxPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSw0RUFBNEUsQ0FBQztBQUM3SCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDOUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBRXJFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDekUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBT3ZELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUUzQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFrQmQsTUFB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QVE7c0JBRFgsS0FBSzt1QkFBQyxlQUFlO2dCQXNCbEIsUUFBUTtzQkFEWCxLQUFLO3VCQUFDLGVBQWU7Z0JBU2xCLG9CQUFvQjtzQkFEdkIsS0FBSztnQkFTRixxQkFBcUI7c0JBRHhCLEtBQUs7Z0JBVUYsc0JBQXNCO3NCQUR6QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFJlbmRlcmVyMixcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBjb21iaW5lTGF0ZXN0LCBSZXBsYXlTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQ2xyRXhwYW5kYWJsZUFuaW1hdGlvbkRpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL3V0aWxzL2FuaW1hdGlvbnMvZXhwYW5kYWJsZS1hbmltYXRpb24vZXhwYW5kYWJsZS1hbmltYXRpb24uZGlyZWN0aXZlJztcbmltcG9ydCB7IElmRXhwYW5kU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL2NvbmRpdGlvbmFsL2lmLWV4cGFuZGVkLnNlcnZpY2UnO1xuaW1wb3J0IHsgSG9zdFdyYXBwZXIgfSBmcm9tICcuLi8uLi91dGlscy9ob3N0LXdyYXBwaW5nL2hvc3Qtd3JhcHBlcic7XG5pbXBvcnQgeyBDbHJDb21tb25TdHJpbmdzU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL2kxOG4vY29tbW9uLXN0cmluZ3Muc2VydmljZSc7XG5pbXBvcnQgeyBMb2FkaW5nTGlzdGVuZXIgfSBmcm9tICcuLi8uLi91dGlscy9sb2FkaW5nL2xvYWRpbmctbGlzdGVuZXInO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRDZWxsIH0gZnJvbSAnLi9kYXRhZ3JpZC1jZWxsJztcbmltcG9ydCB7IERhdGFncmlkSWZFeHBhbmRTZXJ2aWNlIH0gZnJvbSAnLi9kYXRhZ3JpZC1pZi1leHBhbmRlZC5zZXJ2aWNlJztcbmltcG9ydCB7IERhdGFncmlkRGlzcGxheU1vZGUgfSBmcm9tICcuL2VudW1zL2Rpc3BsYXktbW9kZS5lbnVtJztcbmltcG9ydCB7IFNlbGVjdGlvblR5cGUgfSBmcm9tICcuL2VudW1zL3NlbGVjdGlvbi10eXBlJztcbmltcG9ydCB7IERldGFpbFNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9kZXRhaWwuc2VydmljZSc7XG5pbXBvcnQgeyBEaXNwbGF5TW9kZVNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9kaXNwbGF5LW1vZGUuc2VydmljZSc7XG5pbXBvcnQgeyBFeHBhbmRhYmxlUm93c0NvdW50IH0gZnJvbSAnLi9wcm92aWRlcnMvZ2xvYmFsLWV4cGFuZGFibGUtcm93cyc7XG5pbXBvcnQgeyBJdGVtcyB9IGZyb20gJy4vcHJvdmlkZXJzL2l0ZW1zJztcbmltcG9ydCB7IFJvd0FjdGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9yb3ctYWN0aW9uLXNlcnZpY2UnO1xuaW1wb3J0IHsgU2VsZWN0aW9uIH0gZnJvbSAnLi9wcm92aWRlcnMvc2VsZWN0aW9uJztcbmltcG9ydCB7IFdyYXBwZWRSb3cgfSBmcm9tICcuL3dyYXBwZWQtcm93JztcblxubGV0IG5iUm93ID0gMDtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWRnLXJvdycsXG4gIHRlbXBsYXRlVXJsOiAnLi9kYXRhZ3JpZC1yb3cuaHRtbCcsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmRhdGFncmlkLXJvd10nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5kYXRhZ3JpZC1yb3ctc2tlbGV0b25dJzogJ3NrZWxldG9uTG9hZGluZycsXG4gICAgJ1tjbGFzcy5kYXRhZ3JpZC1zZWxlY3RlZF0nOiAnc2VsZWN0ZWQnLFxuICAgICdbYXR0ci5hcmlhLW93bnNdJzogJ2lkJyxcbiAgICByb2xlOiAncm93Z3JvdXAnLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICBEYXRhZ3JpZElmRXhwYW5kU2VydmljZSxcbiAgICB7IHByb3ZpZGU6IElmRXhwYW5kU2VydmljZSwgdXNlRXhpc3Rpbmc6IERhdGFncmlkSWZFeHBhbmRTZXJ2aWNlIH0sXG4gICAgeyBwcm92aWRlOiBMb2FkaW5nTGlzdGVuZXIsIHVzZUV4aXN0aW5nOiBEYXRhZ3JpZElmRXhwYW5kU2VydmljZSB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEYXRhZ3JpZFJvdzxUID0gYW55PiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIEFmdGVyVmlld0luaXQge1xuICBAT3V0cHV0KCdjbHJEZ1NlbGVjdGVkQ2hhbmdlJykgc2VsZWN0ZWRDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPihmYWxzZSk7XG4gIEBPdXRwdXQoJ2NsckRnRXhwYW5kZWRDaGFuZ2UnKSBleHBhbmRlZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oZmFsc2UpO1xuICBASW5wdXQoJ2NsckRnRGV0YWlsRGlzYWJsZWQnKSBkZXRhaWxEaXNhYmxlZCA9IGZhbHNlO1xuICBASW5wdXQoJ2NsckRnRGV0YWlsSGlkZGVuJykgZGV0YWlsSGlkZGVuID0gZmFsc2U7XG4gIEBJbnB1dCgnY2xyRGdTa2VsZXRvbkxvYWRpbmcnKSBza2VsZXRvbkxvYWRpbmcgPSBmYWxzZTtcblxuICBpZDogc3RyaW5nO1xuICByYWRpb0lkOiBzdHJpbmc7XG4gIGNoZWNrYm94SWQ6IHN0cmluZztcbiAgZXhwYW5kYWJsZUlkOiBzdHJpbmc7XG4gIHJlcGxhY2VkOiBib29sZWFuO1xuICBkaXNwbGF5Q2VsbHMgPSBmYWxzZTtcbiAgZXhwYW5kQW5pbWF0aW9uVHJpZ2dlciA9IGZhbHNlO1xuXG4gIC8qIHJlZmVyZW5jZSB0byB0aGUgZW51bSBzbyB0aGF0IHRlbXBsYXRlIGNhbiBhY2Nlc3MgKi9cbiAgU0VMRUNUSU9OX1RZUEUgPSBTZWxlY3Rpb25UeXBlO1xuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGl0ZW1DaGFuZ2VzID0gbmV3IFJlcGxheVN1YmplY3Q8VD4oMSk7XG5cbiAgLyoqKioqXG4gICAqIHByb3BlcnR5IGRnQ2VsbHNcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEEgUXVlcnkgTGlzdCBvZiB0aGUgQ2xyRGF0YWdyaWQgY2VsbHMgaW4gdGhpcyByb3cuXG4gICAqXG4gICAqL1xuICBAQ29udGVudENoaWxkcmVuKENsckRhdGFncmlkQ2VsbCkgZGdDZWxsczogUXVlcnlMaXN0PENsckRhdGFncmlkQ2VsbD47XG5cbiAgQFZpZXdDaGlsZChDbHJFeHBhbmRhYmxlQW5pbWF0aW9uRGlyZWN0aXZlKSBleHBhbmRBbmltYXRpb246IENsckV4cGFuZGFibGVBbmltYXRpb25EaXJlY3RpdmU7XG4gIEBWaWV3Q2hpbGQoJ2RldGFpbEJ1dHRvbicpIGRldGFpbEJ1dHRvbjogRWxlbWVudFJlZjxIVE1MQnV0dG9uRWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ3N0aWNreUNlbGxzJywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmIH0pIF9zdGlja3lDZWxsczogVmlld0NvbnRhaW5lclJlZjtcbiAgQFZpZXdDaGlsZCgnc2Nyb2xsYWJsZUNlbGxzJywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmIH0pIF9zY3JvbGxhYmxlQ2VsbHM6IFZpZXdDb250YWluZXJSZWY7XG4gIEBWaWV3Q2hpbGQoJ2NhbGN1bGF0ZWRDZWxscycsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSBfY2FsY3VsYXRlZENlbGxzOiBWaWV3Q29udGFpbmVyUmVmO1xuICBAVmlld0NoaWxkKCdmaXhlZENlbGxUZW1wbGF0ZScpIF9maXhlZENlbGxUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBwcml2YXRlIF9pdGVtOiBUO1xuICBwcml2YXRlIF9zZWxlY3RlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9kZXRhaWxPcGVuTGFiZWwgPSAnJztcbiAgcHJpdmF0ZSBfZGV0YWlsQ2xvc2VMYWJlbCA9ICcnO1xuICBwcml2YXRlIF9yb3dTZWxlY3Rpb25MYWJlbCA9ICcnO1xuICBwcml2YXRlIHdyYXBwZWRJbmplY3RvcjogSW5qZWN0b3I7XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICAvLyBCeSBkZWZhdWx0LCBldmVyeSBpdGVtIGlzIHNlbGVjdGFibGU7IGl0IGJlY29tZXMgbm90IHNlbGVjdGFibGUgb25seSBpZiBpdCdzIGV4cGxpY2l0bHkgc2V0IHRvIGZhbHNlXG4gIHByaXZhdGUgX3NlbGVjdGFibGU6IGJvb2xlYW4gfCBzdHJpbmcgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBzZWxlY3Rpb246IFNlbGVjdGlvbjxUPixcbiAgICBwdWJsaWMgcm93QWN0aW9uU2VydmljZTogUm93QWN0aW9uU2VydmljZSxcbiAgICBwdWJsaWMgZ2xvYmFsRXhwYW5kYWJsZTogRXhwYW5kYWJsZVJvd3NDb3VudCxcbiAgICBwdWJsaWMgZXhwYW5kOiBEYXRhZ3JpZElmRXhwYW5kU2VydmljZSxcbiAgICBwdWJsaWMgZGV0YWlsU2VydmljZTogRGV0YWlsU2VydmljZSxcbiAgICBwcml2YXRlIGRpc3BsYXlNb2RlOiBEaXNwbGF5TW9kZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSB2Y3I6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHVibGljIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlLFxuICAgIHByaXZhdGUgaXRlbXM6IEl0ZW1zLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueVxuICApIHtcbiAgICBuYlJvdysrO1xuICAgIHRoaXMuaWQgPSAnY2xyLWRnLXJvdycgKyBuYlJvdztcbiAgICB0aGlzLnJhZGlvSWQgPSAnY2xyLWRnLXJvdy1yZCcgKyBuYlJvdztcbiAgICB0aGlzLmNoZWNrYm94SWQgPSAnY2xyLWRnLXJvdy1jYicgKyBuYlJvdztcbiAgICB0aGlzLmV4cGFuZGFibGVJZCA9IGV4cGFuZC5leHBhbmRhYmxlSWQ7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIGNvbWJpbmVMYXRlc3QoZXhwYW5kLnJlcGxhY2UsIGV4cGFuZC5leHBhbmRDaGFuZ2UpLnN1YnNjcmliZSgoW2V4cGFuZFJlcGxhY2VWYWx1ZSwgZXhwYW5kQ2hhbmdlVmFsdWVdKSA9PiB7XG4gICAgICAgIGlmIChleHBhbmRSZXBsYWNlVmFsdWUgJiYgZXhwYW5kQ2hhbmdlVmFsdWUpIHtcbiAgICAgICAgICAvLyByZXBsYWNlZCBhbmQgZXhwYW5kaW5nXG4gICAgICAgICAgdGhpcy5yZXBsYWNlZCA9IHRydWU7XG4gICAgICAgICAgcmVuZGVyZXIuYWRkQ2xhc3MoZWwubmF0aXZlRWxlbWVudCwgJ2RhdGFncmlkLXJvdy1yZXBsYWNlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmVwbGFjZWQgPSBmYWxzZTtcbiAgICAgICAgICAvLyBIYW5kbGVzIHRoZXNlIGNhc2VzOiBub3QgcmVwbGFjZWQgYW5kIGNvbGxhcHNpbmcgJiByZXBsYWNlZCBhbmRcbiAgICAgICAgICAvLyBjb2xsYXBzaW5nIGFuZCBub3QgcmVwbGFjZWQgYW5kIGV4cGFuZGluZy5cbiAgICAgICAgICByZW5kZXJlci5yZW1vdmVDbGFzcyhlbC5uYXRpdmVFbGVtZW50LCAnZGF0YWdyaWQtcm93LXJlcGxhY2VkJyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb2RlbCBvZiB0aGUgcm93LCB0byB1c2UgZm9yIHNlbGVjdGlvblxuICAgKi9cbiAgQElucHV0KCdjbHJEZ0l0ZW0nKVxuICBnZXQgaXRlbSgpOiBUIHtcbiAgICByZXR1cm4gdGhpcy5faXRlbTtcbiAgfVxuICBzZXQgaXRlbShpdGVtOiBUKSB7XG4gICAgdGhpcy5faXRlbSA9IGl0ZW07XG4gICAgdGhpcy5pdGVtQ2hhbmdlcy5uZXh0KGl0ZW0pO1xuICAgIHRoaXMuY2xyRGdTZWxlY3RhYmxlID0gdGhpcy5fc2VsZWN0YWJsZTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyRGdTZWxlY3RhYmxlJylcbiAgZ2V0IGNsckRnU2VsZWN0YWJsZSgpIHtcbiAgICByZXR1cm4gIXRoaXMuc2VsZWN0aW9uLmlzTG9ja2VkKHRoaXMuaXRlbSk7XG4gIH1cbiAgc2V0IGNsckRnU2VsZWN0YWJsZSh2YWx1ZTogYm9vbGVhbiB8IHN0cmluZykge1xuICAgIGlmICh0aGlzLml0ZW0pIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uLmxvY2tJdGVtKHRoaXMuaXRlbSwgdmFsdWUgPT09ICdmYWxzZScgfHwgdmFsdWUgPT09IGZhbHNlKTtcbiAgICB9XG4gICAgLy8gU3RvcmUgdGhpcyB2YWx1ZSBsb2NhbGx5LCB0byBiZSBpbml0aWFsaXplZCB3aGVuIGl0ZW0gaXMgaW5pdGlhbGl6ZWRcbiAgICB0aGlzLl9zZWxlY3RhYmxlID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIHRoZSByb3cgaXMgc2VsZWN0ZWRcbiAgICovXG4gIEBJbnB1dCgnY2xyRGdTZWxlY3RlZCcpXG4gIGdldCBzZWxlY3RlZCgpIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5Ob25lKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbi5pc1NlbGVjdGVkKHRoaXMuaXRlbSk7XG4gICAgfVxuICB9XG4gIHNldCBzZWxlY3RlZCh2YWx1ZTogYm9vbGVhbiB8IHN0cmluZykge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLk5vbmUpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gdmFsdWUgYXMgYm9vbGVhbjtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHZhbHVlICYmIHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuTXVsdGkpIHtcbiAgICAgICAgdGhpcy5yYW5nZVNlbGVjdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb24ucmFuZ2VTdGFydCA9IG51bGw7XG4gICAgICB9XG4gICAgICB0aGlzLnNlbGVjdGlvbi5zZXRTZWxlY3RlZCh0aGlzLml0ZW0sIHZhbHVlIGFzIGJvb2xlYW4pO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgnY2xyRGdFeHBhbmRlZCcpXG4gIGdldCBleHBhbmRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5leHBhbmQuZXhwYW5kZWQ7XG4gIH1cbiAgc2V0IGV4cGFuZGVkKHZhbHVlOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgdGhpcy5leHBhbmQuZXhwYW5kZWQgPSB2YWx1ZSBhcyBib29sZWFuO1xuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IGNsckRnRGV0YWlsT3BlbkxhYmVsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2RldGFpbE9wZW5MYWJlbCA/IHRoaXMuX2RldGFpbE9wZW5MYWJlbCA6IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLm9wZW47XG4gIH1cbiAgc2V0IGNsckRnRGV0YWlsT3BlbkxhYmVsKGxhYmVsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9kZXRhaWxPcGVuTGFiZWwgPSBsYWJlbDtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBjbHJEZ0RldGFpbENsb3NlTGFiZWwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZGV0YWlsQ2xvc2VMYWJlbCA/IHRoaXMuX2RldGFpbENsb3NlTGFiZWwgOiB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5jbG9zZTtcbiAgfVxuICBzZXQgY2xyRGdEZXRhaWxDbG9zZUxhYmVsKGxhYmVsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9kZXRhaWxDbG9zZUxhYmVsID0gbGFiZWw7XG4gIH1cblxuICAvLyBDREUtMTUxOiBSZW5hbWUgdGhpcyBmaWVsZCB0byBjbHJEZ1Jvd1NlbGVjdGlvbkxhYmVsIGluIHYxNlxuICBASW5wdXQoKVxuICBnZXQgY2xyRGdSb3dTZWxlY3Rpb25MYWJlbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9yb3dTZWxlY3Rpb25MYWJlbCA/IHRoaXMuX3Jvd1NlbGVjdGlvbkxhYmVsIDogdGhpcy5jb21tb25TdHJpbmdzLmtleXMuc2VsZWN0O1xuICB9XG4gIHNldCBjbHJEZ1Jvd1NlbGVjdGlvbkxhYmVsKGxhYmVsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9yb3dTZWxlY3Rpb25MYWJlbCA9IGxhYmVsO1xuICB9XG5cbiAgZ2V0IF92aWV3KCkge1xuICAgIHJldHVybiB0aGlzLndyYXBwZWRJbmplY3Rvci5nZXQoV3JhcHBlZFJvdywgdGhpcy52Y3IpLnJvd1ZpZXc7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLndyYXBwZWRJbmplY3RvciA9IG5ldyBIb3N0V3JhcHBlcihXcmFwcGVkUm93LCB0aGlzLnZjcik7XG4gICAgdGhpcy5zZWxlY3Rpb24ubG9ja0l0ZW0odGhpcy5pdGVtLCB0aGlzLmNsckRnU2VsZWN0YWJsZSA9PT0gZmFsc2UpO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuZGdDZWxscy5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmRnQ2VsbHMuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgaWYgKCFjZWxsLl92aWV3LmRlc3Ryb3llZCkge1xuICAgICAgICAgIHRoaXMuX3Njcm9sbGFibGVDZWxscy5pbnNlcnQoY2VsbC5fdmlldyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgdGhpcy5kaXNwbGF5TW9kZS52aWV3LnN1YnNjcmliZSh2aWV3Q2hhbmdlID0+IHtcbiAgICAgICAgLy8gTGlzdGVuIGZvciB2aWV3IGNoYW5nZXMgYW5kIG1vdmUgY2VsbHMgYXJvdW5kIGRlcGVuZGluZyBvbiB0aGUgY3VycmVudCBkaXNwbGF5VHlwZVxuICAgICAgICAvLyByZW1vdmUgY2VsbCB2aWV3cyBmcm9tIGRpc3BsYXkgdmlld1xuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fc2Nyb2xsYWJsZUNlbGxzLmxlbmd0aDsgaSA+IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMuX3Njcm9sbGFibGVDZWxscy5kZXRhY2goKTtcbiAgICAgICAgfVxuICAgICAgICAvLyByZW1vdmUgY2VsbCB2aWV3cyBmcm9tIGNhbGN1bGF0ZWQgdmlld1xuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fY2FsY3VsYXRlZENlbGxzLmxlbmd0aDsgaSA+IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZWRDZWxscy5kZXRhY2goKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmlld0NoYW5nZSA9PT0gRGF0YWdyaWREaXNwbGF5TW9kZS5DQUxDVUxBVEUpIHtcbiAgICAgICAgICB0aGlzLmRpc3BsYXlDZWxscyA9IGZhbHNlO1xuICAgICAgICAgIC8vIEluc2VydHMgYSBmaXhlZCBjZWxsIGlmIGFueSBvZiB0aGVzZSBjb25kaXRpb25zIGFyZSB0cnVlLlxuICAgICAgICAgIGNvbnN0IGZpeGVkQ2VsbENvbmRpdGlvbnMgPSBbXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlICE9PSB0aGlzLlNFTEVDVElPTl9UWVBFLk5vbmUsXG4gICAgICAgICAgICB0aGlzLnJvd0FjdGlvblNlcnZpY2UuaGFzQWN0aW9uYWJsZVJvdyxcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsRXhwYW5kYWJsZS5oYXNFeHBhbmRhYmxlUm93LFxuICAgICAgICAgICAgdGhpcy5kZXRhaWxTZXJ2aWNlLmVuYWJsZWQsXG4gICAgICAgICAgXTtcbiAgICAgICAgICBmaXhlZENlbGxDb25kaXRpb25zXG4gICAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgICAgICAuZm9yRWFjaCgoKSA9PiB0aGlzLl9jYWxjdWxhdGVkQ2VsbHMuaW5zZXJ0KHRoaXMuX2ZpeGVkQ2VsbFRlbXBsYXRlLmNyZWF0ZUVtYmVkZGVkVmlldyhudWxsKSkpO1xuICAgICAgICAgIHRoaXMuZGdDZWxscy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgaWYgKCFjZWxsLl92aWV3LmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVkQ2VsbHMuaW5zZXJ0KGNlbGwuX3ZpZXcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZGlzcGxheUNlbGxzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmRnQ2VsbHMuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgIGlmICghY2VsbC5fdmlldy5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsYWJsZUNlbGxzLmluc2VydChjZWxsLl92aWV3KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICB0aGlzLmV4cGFuZC5hbmltYXRlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuZXhwYW5kQW5pbWF0aW9uVHJpZ2dlciA9ICF0aGlzLmV4cGFuZEFuaW1hdGlvblRyaWdnZXI7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaCgoc3ViOiBTdWJzY3JpcHRpb24pID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcbiAgfVxuXG4gIHRvZ2dsZShzZWxlY3RlZCA9ICF0aGlzLnNlbGVjdGVkKSB7XG4gICAgaWYgKHNlbGVjdGVkICE9PSB0aGlzLnNlbGVjdGVkKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XG4gICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlZC5lbWl0KHNlbGVjdGVkKTtcbiAgICB9XG4gIH1cblxuICB0b2dnbGVFeHBhbmQoKSB7XG4gICAgaWYgKHRoaXMuZXhwYW5kLmV4cGFuZGFibGUpIHtcbiAgICAgIHRoaXMuZXhwYW5kQW5pbWF0aW9uLnVwZGF0ZVN0YXJ0SGVpZ2h0KCk7XG4gICAgICB0aGlzLmV4cGFuZGVkID0gIXRoaXMuZXhwYW5kZWQ7XG4gICAgICB0aGlzLmV4cGFuZGVkQ2hhbmdlLmVtaXQodGhpcy5leHBhbmRlZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IGJlaGF2aW9yIGluIENocm9tZSBhbmQgRmlyZWZveCBmb3Igc2hpZnQtY2xpY2tpbmcgb24gYSBsYWJlbCBpcyB0byBwZXJmb3JtIHRleHQtc2VsZWN0aW9uLlxuICAgKiBUaGlzIHByZXZlbnRzIG91ciBpbnRlbmRlZCByYW5nZS1zZWxlY3Rpb24sIGJlY2F1c2UgdGhpcyB0ZXh0LXNlbGVjdGlvbiBvdmVycmlkZXMgb3VyIHNoaWZ0LWNsaWNrIGV2ZW50LlxuICAgKiBXZSBuZWVkIHRvIGNsZWFyIHRoZSBzdG9yZWQgc2VsZWN0aW9uIHJhbmdlIHdoZW4gc2hpZnQtY2xpY2tpbmcuIFRoaXMgd2lsbCBvdmVycmlkZSB0aGUgbW9zdGx5IHVudXNlZCBzaGlmdC1jbGlja1xuICAgKiBzZWxlY3Rpb24gYnJvd3NlciBmdW5jdGlvbmFsaXR5LCB3aGljaCBpcyBpbmNvbnNpc3RlbnRseSBpbXBsZW1lbnRlZCBpbiBicm93c2VycyBhbnl3YXkuXG4gICAqL1xuICBjbGVhclJhbmdlcyhldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbi5yb3dTZWxlY3Rpb25Nb2RlICYmIGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICB0aGlzLmRvY3VtZW50LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgLy8gRmlyZWZveCBpcyB0b28gcGVyc2lzdGVudCBhYm91dCBpdHMgdGV4dC1zZWxlY3Rpb24gYmVoYXZpb3VyLiBTbyB3ZSBuZWVkIHRvIGFkZCBhIHByZXZlbnREZWZhdWx0KCk7XG4gICAgICAvLyBXZSBzaG91bGQgbm90IHRyeSB0byBlbmZvcmNlIHRoaXMgb24gdGhlIG90aGVyIGJyb3dzZXJzLCB0aG91Z2gsIGJlY2F1c2UgdGhlaXIgdG9nZ2xlIGN5Y2xlIGRvZXMgbm90IGdldCBjYW5jZWxlZCBieVxuICAgICAgLy8gdGhlIHByZXZlbnREZWZhdWx0KCkgYW5kIHRoZXkgdG9nZ2xlIHRoZSBjaGVja2JveCBzZWNvbmQgdGltZSwgZWZmZWN0aXZlbHkgcmV0cnVybmluZyBpdCB0byBub3Qtc2VsZWN0ZWQuXG4gICAgICBpZiAod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignRmlyZWZveCcpICE9PSAtMSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnRvZ2dsZSh0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgcmVsYXRlZCB0byBjbHJEZ1Jvd1NlbGVjdGlvbiwgd2hpY2ggaXMgZGVwcmVjYXRlZFxuICAgKi9cbiAgcHJvdGVjdGVkIHNlbGVjdFJvdyhzZWxlY3RlZCA9ICF0aGlzLnNlbGVjdGVkLCAkZXZlbnQpIHtcbiAgICAvLyBUaGUgbGFiZWwgYWxzbyBjYXB0dXJlcyBjbGlja3MgdGhhdCBidWJibGUgdXAgdG8gdGhlIHJvdyBldmVudCBsaXN0ZW5lciwgY2F1c2luZ1xuICAgIC8vIHRoaXMgaGFuZGxlciB0byBydW4gdHdpY2UuIFRoaXMgZXhpdHMgZWFybHkgdG8gcHJldmVudCB0b2dnbGluZyB0aGUgY2hlY2tib3ggdHdpY2UuXG4gICAgaWYgKCF0aGlzLnNlbGVjdGlvbi5yb3dTZWxlY3Rpb25Nb2RlIHx8ICRldmVudC50YXJnZXQudGFnTmFtZSA9PT0gJ0xBQkVMJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9PT0gdGhpcy5TRUxFQ1RJT05fVFlQRS5TaW5nbGUpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uLmN1cnJlbnRTaW5nbGUgPSB0aGlzLml0ZW07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudG9nZ2xlKHNlbGVjdGVkKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJhbmdlU2VsZWN0KCkge1xuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pdGVtcy5kaXNwbGF5ZWQ7XG4gICAgaWYgKCFpdGVtcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzdGFydEl4ID0gaXRlbXMuaW5kZXhPZih0aGlzLnNlbGVjdGlvbi5yYW5nZVN0YXJ0KTtcbiAgICBpZiAoXG4gICAgICB0aGlzLnNlbGVjdGlvbi5yYW5nZVN0YXJ0ICYmXG4gICAgICB0aGlzLnNlbGVjdGlvbi5jdXJyZW50LmluY2x1ZGVzKHRoaXMuc2VsZWN0aW9uLnJhbmdlU3RhcnQpICYmXG4gICAgICB0aGlzLnNlbGVjdGlvbi5zaGlmdFByZXNzZWQgJiZcbiAgICAgIHN0YXJ0SXggIT09IC0xXG4gICAgKSB7XG4gICAgICBjb25zdCBlbmRJeCA9IGl0ZW1zLmluZGV4T2YodGhpcy5pdGVtKTtcbiAgICAgIC8vIFVzaW5nIFNldCB0byByZW1vdmUgZHVwbGljYXRlc1xuICAgICAgY29uc3QgbmV3U2VsZWN0aW9uID0gbmV3IFNldChcbiAgICAgICAgdGhpcy5zZWxlY3Rpb24uY3VycmVudC5jb25jYXQoaXRlbXMuc2xpY2UoTWF0aC5taW4oc3RhcnRJeCwgZW5kSXgpLCBNYXRoLm1heChzdGFydEl4LCBlbmRJeCkgKyAxKSlcbiAgICAgICk7XG4gICAgICB0aGlzLnNlbGVjdGlvbi5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgdGhpcy5zZWxlY3Rpb24uY3VycmVudC5wdXNoKC4uLm5ld1NlbGVjdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHBhZ2UgbnVtYmVyIGhhcyBjaGFuZ2VkIG9yXG4gICAgICAvLyBubyBTaGlmdCB3YXMgcHJlc3NlZCBvclxuICAgICAgLy8gcmFuZ2VTdGFydCBub3QgeWV0IHNldFxuICAgICAgdGhpcy5zZWxlY3Rpb24ucmFuZ2VTdGFydCA9IHRoaXMuaXRlbTtcbiAgICB9XG4gIH1cbn1cbiIsIjxkaXZcbiAgcm9sZT1cInJvd1wiXG4gIFtpZF09XCJpZFwiXG4gIGNsYXNzPVwiZGF0YWdyaWQtcm93LW1hc3RlciBkYXRhZ3JpZC1yb3ctZmxleFwiXG4gIFtjbHJFeHBhbmRhYmxlQW5pbWF0aW9uXT1cImV4cGFuZEFuaW1hdGlvblRyaWdnZXJcIlxuICAobW91c2Vkb3duKT1cImNsZWFyUmFuZ2VzKCRldmVudClcIlxuICAoY2xpY2spPVwic2VsZWN0Um93KCFzZWxlY3RlZCwgJGV2ZW50KVwiXG4gIFtjbGFzcy5kYXRhZ3JpZC1yb3ctY2xpY2thYmxlXT1cInNlbGVjdGlvbi5yb3dTZWxlY3Rpb25Nb2RlXCJcbiAgW2NsYXNzLmRhdGFncmlkLXJvdy1kZXRhaWwtb3Blbl09XCJkZXRhaWxTZXJ2aWNlLmlzUm93T3BlbihpdGVtKVwiXG4+XG4gIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1yb3ctc3RpY2t5XCI+XG4gICAgPCEtLSBTdGlja3kgZWxlbWVudHMgaGVyZSAtLT5cbiAgICA8bmctY29udGFpbmVyICNzdGlja3lDZWxscz5cbiAgICAgIDxkaXZcbiAgICAgICAgKm5nSWY9XCJzZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9PT0gU0VMRUNUSU9OX1RZUEUuTXVsdGlcIlxuICAgICAgICBjbGFzcz1cImRhdGFncmlkLXNlbGVjdCBkYXRhZ3JpZC1maXhlZC1jb2x1bW4gZGF0YWdyaWQtY2VsbFwiXG4gICAgICAgIFtuZ0NsYXNzXT1cInsgJ2Nsci1mb3JtLWNvbnRyb2wtZGlzYWJsZWQnOiAhY2xyRGdTZWxlY3RhYmxlIH1cIlxuICAgICAgICByb2xlPVwiZ3JpZGNlbGxcIlxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2xyLWNoZWNrYm94LXdyYXBwZXJcIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgIFtuZ01vZGVsXT1cInNlbGVjdGVkXCJcbiAgICAgICAgICAgIChuZ01vZGVsQ2hhbmdlKT1cInRvZ2dsZSgkZXZlbnQpXCJcbiAgICAgICAgICAgIFtpZF09XCJjaGVja2JveElkXCJcbiAgICAgICAgICAgIFtkaXNhYmxlZF09XCJjbHJEZ1NlbGVjdGFibGUgPyBudWxsIDogdHJ1ZVwiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWRpc2FibGVkXT1cImNsckRnU2VsZWN0YWJsZSA/IG51bGwgOiB0cnVlXCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIDwhLS0gVXNhZ2Ugb2YgY2xhc3MgY2xyLWNvbC1udWxsIGhlcmUgcHJldmVudHMgY2xyLWNvbC0qIGNsYXNzZXMgZnJvbSBiZWluZyBhZGRlZCB3aGVuIGEgZGF0YWdyaWQgaXMgd3JhcHBlZCBpbnNpZGUgY2xyRm9ybSAtLT5cbiAgICAgICAgICA8bGFiZWwgW2Zvcl09XCJjaGVja2JveElkXCIgY2xhc3M9XCJjbHItY29udHJvbC1sYWJlbCBjbHItY29sLW51bGxcIiAoY2xpY2spPVwiY2xlYXJSYW5nZXMoJGV2ZW50KVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHItc3Itb25seVwiPnt7Y2xyRGdSb3dTZWxlY3Rpb25MYWJlbCB8fCBjb21tb25TdHJpbmdzLmtleXMuc2VsZWN0fX08L3NwYW4+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXZcbiAgICAgICAgKm5nSWY9XCJzZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9PT0gU0VMRUNUSU9OX1RZUEUuU2luZ2xlXCJcbiAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1zZWxlY3QgZGF0YWdyaWQtZml4ZWQtY29sdW1uIGRhdGFncmlkLWNlbGxcIlxuICAgICAgICBbbmdDbGFzc109XCJ7ICdjbHItZm9ybS1jb250cm9sLWRpc2FibGVkJzogIWNsckRnU2VsZWN0YWJsZSB9XCJcbiAgICAgICAgcm9sZT1cImdyaWRjZWxsXCJcbiAgICAgID5cbiAgICAgICAgPGNsci1yYWRpby13cmFwcGVyPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgICAgICAgICB0eXBlPVwicmFkaW9cIlxuICAgICAgICAgICAgY2xyUmFkaW9cbiAgICAgICAgICAgIFtpZF09XCJyYWRpb0lkXCJcbiAgICAgICAgICAgIFtuYW1lXT1cInNlbGVjdGlvbi5pZCArICctcmFkaW8nXCJcbiAgICAgICAgICAgIFt2YWx1ZV09XCJpdGVtXCJcbiAgICAgICAgICAgIFsobmdNb2RlbCldPVwic2VsZWN0aW9uLmN1cnJlbnRTaW5nbGVcIlxuICAgICAgICAgICAgW2NoZWNrZWRdPVwic2VsZWN0aW9uLmN1cnJlbnRTaW5nbGUgPT09IGl0ZW1cIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImNsckRnU2VsZWN0YWJsZSA/IG51bGwgOiB0cnVlXCJcbiAgICAgICAgICAgIFthdHRyLmFyaWEtZGlzYWJsZWRdPVwiY2xyRGdTZWxlY3RhYmxlID8gbnVsbCA6IHRydWVcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY2xyLWNvbnRyb2wtbGFiZWwgY2xyLWNvbC1udWxsXCIgW2Zvcl09XCJyYWRpb0lkXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNsci1zci1vbmx5XCI+e3sgY2xyRGdSb3dTZWxlY3Rpb25MYWJlbCB8fCBjb21tb25TdHJpbmdzLmtleXMuc2VsZWN0IH19PC9zcGFuPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvY2xyLXJhZGlvLXdyYXBwZXI+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXZcbiAgICAgICAgKm5nSWY9XCJyb3dBY3Rpb25TZXJ2aWNlLmhhc0FjdGlvbmFibGVSb3dcIlxuICAgICAgICBjbGFzcz1cImRhdGFncmlkLXJvdy1hY3Rpb25zIGRhdGFncmlkLWZpeGVkLWNvbHVtbiBkYXRhZ3JpZC1jZWxsXCJcbiAgICAgICAgcm9sZT1cImdyaWRjZWxsXCJcbiAgICAgID5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWRnLWFjdGlvbi1vdmVyZmxvd1wiPjwvbmctY29udGVudD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdlxuICAgICAgICAqbmdJZj1cImdsb2JhbEV4cGFuZGFibGUuaGFzRXhwYW5kYWJsZVJvd1wiXG4gICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtZXhwYW5kYWJsZS1jYXJldCBkYXRhZ3JpZC1maXhlZC1jb2x1bW4gZGF0YWdyaWQtY2VsbFwiXG4gICAgICAgIHJvbGU9XCJncmlkY2VsbFwiXG4gICAgICA+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJleHBhbmQuZXhwYW5kYWJsZVwiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgICAgKm5nSWY9XCIhZXhwYW5kLmxvYWRpbmdcIlxuICAgICAgICAgICAgKGNsaWNrKT1cInRvZ2dsZUV4cGFuZCgpXCJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1leHBhbmRhYmxlLWNhcmV0LWJ1dHRvblwiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWV4cGFuZGVkXT1cImV4cGFuZC5leHBhbmRlZFwiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImV4cGFuZC5leHBhbmRlZCA/IGNsckRnRGV0YWlsQ2xvc2VMYWJlbCA6IGNsckRnRGV0YWlsT3BlbkxhYmVsXCJcbiAgICAgICAgICAgIFthdHRyLmFyaWEtY29udHJvbHNdPVwiZXhwYW5kLmhhc0V4cGFuZFRlbXBsYXRlICYmICFleHBhbmQuZXhwYW5kZWQgPyBudWxsIDogZXhwYW5kYWJsZUlkXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8Y2RzLWljb25cbiAgICAgICAgICAgICAgc2hhcGU9XCJhbmdsZVwiXG4gICAgICAgICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtZXhwYW5kYWJsZS1jYXJldC1pY29uXCJcbiAgICAgICAgICAgICAgW2F0dHIuZGlyZWN0aW9uXT1cImV4cGFuZC5leHBhbmRlZCA/ICdkb3duJyA6ICdyaWdodCdcIlxuICAgICAgICAgICAgICBbYXR0ci50aXRsZV09XCJleHBhbmQuZXhwYW5kZWQgPyBjb21tb25TdHJpbmdzLmtleXMuY29sbGFwc2UgOiBjb21tb25TdHJpbmdzLmtleXMuZXhwYW5kXCJcbiAgICAgICAgICAgID48L2Nkcy1pY29uPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxjbHItc3Bpbm5lciAqbmdJZj1cImV4cGFuZC5sb2FkaW5nXCIgY2xyU21hbGw+e3sgY29tbW9uU3RyaW5ncy5rZXlzLmxvYWRpbmcgfX08L2Nsci1zcGlubmVyPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdlxuICAgICAgICAqbmdJZj1cImRldGFpbFNlcnZpY2UuZW5hYmxlZFwiXG4gICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtZGV0YWlsLWNhcmV0IGRhdGFncmlkLWZpeGVkLWNvbHVtbiBkYXRhZ3JpZC1jZWxsXCJcbiAgICAgICAgcm9sZT1cImdyaWRjZWxsXCJcbiAgICAgID5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgIChjbGljayk9XCJkZXRhaWxTZXJ2aWNlLnRvZ2dsZShpdGVtLCBkZXRhaWxCdXR0b24pXCJcbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAjZGV0YWlsQnV0dG9uXG4gICAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1kZXRhaWwtY2FyZXQtYnV0dG9uXCJcbiAgICAgICAgICBbZGlzYWJsZWRdPVwiZGV0YWlsRGlzYWJsZWRcIlxuICAgICAgICAgICpuZ0lmPVwiIWRldGFpbEhpZGRlblwiXG4gICAgICAgICAgW2NsYXNzLmlzLW9wZW5dPVwiZGV0YWlsU2VydmljZS5pc1Jvd09wZW4oaXRlbSlcIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiZGV0YWlsU2VydmljZS5pc1Jvd09wZW4oaXRlbSkgPyBjbHJEZ0RldGFpbENsb3NlTGFiZWwgOiBjbHJEZ0RldGFpbE9wZW5MYWJlbFwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJkZXRhaWxTZXJ2aWNlLmlzUm93T3BlbihpdGVtKVwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1jb250cm9sc109XCJkZXRhaWxTZXJ2aWNlLmlkXCJcbiAgICAgICAgICBhcmlhLWhhc3BvcHVwPVwiZGlhbG9nXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxjZHMtaWNvblxuICAgICAgICAgICAgc2hhcGU9XCJhbmdsZS1kb3VibGVcIlxuICAgICAgICAgICAgW2F0dHIuZGlyZWN0aW9uXT1cImRldGFpbFNlcnZpY2UuaXNSb3dPcGVuKGl0ZW0pID8gJ2xlZnQnIDogJ3JpZ2h0J1wiXG4gICAgICAgICAgICBjbGFzcz1cImRhdGFncmlkLWRldGFpbC1jYXJldC1pY29uXCJcbiAgICAgICAgICAgIFthdHRyLnRpdGxlXT1cImRldGFpbFNlcnZpY2UuaXNSb3dPcGVuKGl0ZW0pID8gY29tbW9uU3RyaW5ncy5rZXlzLmNsb3NlOiBjb21tb25TdHJpbmdzLmtleXMub3BlblwiXG4gICAgICAgICAgPjwvY2RzLWljb24+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPCEtLSBwbGFjZWhvbGRlciBmb3IgcHJvamVjdGluZyBvdGhlciBzdGlja3kgY2VsbHMgYXMgcGlubmVkLS0+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtcm93LXNjcm9sbGFibGVcIiBbbmdDbGFzc109XCJ7J2lzLXJlcGxhY2VkJzogcmVwbGFjZWQgJiYgZXhwYW5kZWR9XCI+XG4gICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLXNjcm9sbGluZy1jZWxsc1wiPlxuICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWRnLWNlbGxcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8bmctY29udGFpbmVyICNzY3JvbGxhYmxlQ2VsbHM+PC9uZy1jb250YWluZXI+XG4gICAgPC9kaXY+XG4gICAgPCEtLSBkZXRhaWxzIGhlcmUgd2hlbiByZXBsYWNlLCByZS12aXNpdCB3aGVuIHN0aWNreSBjb250YWluZXIgaXMgdXNlZCBmb3IgcGlubmVkIGNlbGxzIC0tPlxuICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cInJlcGxhY2VkICYmICFleHBhbmQubG9hZGluZ1wiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImRldGFpbFwiPjwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlICpuZ0lmPVwiIXJlcGxhY2VkICYmICFleHBhbmQubG9hZGluZ1wiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImRldGFpbFwiPjwvbmctdGVtcGxhdGU+XG4gIDwvZGl2PlxuICA8Y2xyLWRnLWNlbGwgY2xhc3M9XCJza2VsZXRvbi1sb2FkaW5nXCIgKm5nSWY9XCJza2VsZXRvbkxvYWRpbmdcIj48L2Nsci1kZy1jZWxsPlxuPC9kaXY+XG48IS0tXG4gICAgV2UgbmVlZCB0aGUgXCJwcm9qZWN0IGludG8gdGVtcGxhdGVcIiBoYWNrcyBiZWNhdXNlIHdlIG5lZWQgdGhpcyBpbiAyIGRpZmZlcmVudCBwbGFjZXNcbiAgICBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgZGV0YWlscyByZXBsYWNlIHRoZSByb3cgb3Igbm90LlxuLS0+XG48bmctdGVtcGxhdGUgI2RldGFpbD5cbiAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWRnLXJvdy1kZXRhaWxcIj48L25nLWNvbnRlbnQ+XG48L25nLXRlbXBsYXRlPlxuXG48bmctY29udGFpbmVyICNjYWxjdWxhdGVkQ2VsbHM+PC9uZy1jb250YWluZXI+XG5cbjxuZy10ZW1wbGF0ZSAjZml4ZWRDZWxsVGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1maXhlZC1jb2x1bW4gZGF0YWdyaWQtY2VsbFwiIHJvbGU9XCJncmlkY2VsbFwiPjwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==
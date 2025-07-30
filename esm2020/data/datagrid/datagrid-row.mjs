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
        if (!this.selection.rowSelectionMode || $event.target.tagName === 'LABEL' || !this._selectable) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtcm93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC1yb3cudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2RhdGFncmlkLXJvdy5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFHTCxTQUFTLEVBQ1QsZUFBZSxFQUVmLFlBQVksRUFDWixNQUFNLEVBRU4sS0FBSyxFQUNMLE1BQU0sRUFJTixTQUFTLEVBQ1QsZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUVsRSxPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSw0RUFBNEUsQ0FBQztBQUM3SCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDOUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBRXJFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDekUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBT3ZELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUUzQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFrQmQsTUFB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Szt1QkFBQyxpQkFBaUI7Z0JBZ0JwQixRQUFRO3NCQURYLEtBQUs7dUJBQUMsZUFBZTtnQkFzQmxCLFFBQVE7c0JBRFgsS0FBSzt1QkFBQyxlQUFlO2dCQVNsQixvQkFBb0I7c0JBRHZCLEtBQUs7Z0JBU0YscUJBQXFCO3NCQUR4QixLQUFLO2dCQVVGLHNCQUFzQjtzQkFEekIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBSZW5kZXJlcjIsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY29tYmluZUxhdGVzdCwgUmVwbGF5U3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENsckV4cGFuZGFibGVBbmltYXRpb25EaXJlY3RpdmUgfSBmcm9tICcuLi8uLi91dGlscy9hbmltYXRpb25zL2V4cGFuZGFibGUtYW5pbWF0aW9uL2V4cGFuZGFibGUtYW5pbWF0aW9uLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZkV4cGFuZFNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9jb25kaXRpb25hbC9pZi1leHBhbmRlZC5zZXJ2aWNlJztcbmltcG9ydCB7IEhvc3RXcmFwcGVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvaG9zdC13cmFwcGluZy9ob3N0LXdyYXBwZXInO1xuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgTG9hZGluZ0xpc3RlbmVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvbG9hZGluZy9sb2FkaW5nLWxpc3RlbmVyJztcbmltcG9ydCB7IENsckRhdGFncmlkQ2VsbCB9IGZyb20gJy4vZGF0YWdyaWQtY2VsbCc7XG5pbXBvcnQgeyBEYXRhZ3JpZElmRXhwYW5kU2VydmljZSB9IGZyb20gJy4vZGF0YWdyaWQtaWYtZXhwYW5kZWQuc2VydmljZSc7XG5pbXBvcnQgeyBEYXRhZ3JpZERpc3BsYXlNb2RlIH0gZnJvbSAnLi9lbnVtcy9kaXNwbGF5LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBTZWxlY3Rpb25UeXBlIH0gZnJvbSAnLi9lbnVtcy9zZWxlY3Rpb24tdHlwZSc7XG5pbXBvcnQgeyBEZXRhaWxTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGV0YWlsLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGlzcGxheU1vZGVTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGlzcGxheS1tb2RlLnNlcnZpY2UnO1xuaW1wb3J0IHsgRXhwYW5kYWJsZVJvd3NDb3VudCB9IGZyb20gJy4vcHJvdmlkZXJzL2dsb2JhbC1leHBhbmRhYmxlLXJvd3MnO1xuaW1wb3J0IHsgSXRlbXMgfSBmcm9tICcuL3Byb3ZpZGVycy9pdGVtcyc7XG5pbXBvcnQgeyBSb3dBY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvcm93LWFjdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IFNlbGVjdGlvbiB9IGZyb20gJy4vcHJvdmlkZXJzL3NlbGVjdGlvbic7XG5pbXBvcnQgeyBXcmFwcGVkUm93IH0gZnJvbSAnLi93cmFwcGVkLXJvdyc7XG5cbmxldCBuYlJvdyA9IDA7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1kZy1yb3cnLFxuICB0ZW1wbGF0ZVVybDogJy4vZGF0YWdyaWQtcm93Lmh0bWwnLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5kYXRhZ3JpZC1yb3ddJzogJ3RydWUnLFxuICAgICdbY2xhc3MuZGF0YWdyaWQtcm93LXNrZWxldG9uXSc6ICdza2VsZXRvbkxvYWRpbmcnLFxuICAgICdbY2xhc3MuZGF0YWdyaWQtc2VsZWN0ZWRdJzogJ3NlbGVjdGVkJyxcbiAgICAnW2F0dHIuYXJpYS1vd25zXSc6ICdpZCcsXG4gICAgcm9sZTogJ3Jvd2dyb3VwJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgRGF0YWdyaWRJZkV4cGFuZFNlcnZpY2UsXG4gICAgeyBwcm92aWRlOiBJZkV4cGFuZFNlcnZpY2UsIHVzZUV4aXN0aW5nOiBEYXRhZ3JpZElmRXhwYW5kU2VydmljZSB9LFxuICAgIHsgcHJvdmlkZTogTG9hZGluZ0xpc3RlbmVyLCB1c2VFeGlzdGluZzogRGF0YWdyaWRJZkV4cGFuZFNlcnZpY2UgfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWdyaWRSb3c8VCA9IGFueT4gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0IHtcbiAgQE91dHB1dCgnY2xyRGdTZWxlY3RlZENoYW5nZScpIHNlbGVjdGVkQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oZmFsc2UpO1xuICBAT3V0cHV0KCdjbHJEZ0V4cGFuZGVkQ2hhbmdlJykgZXhwYW5kZWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KGZhbHNlKTtcbiAgQElucHV0KCdjbHJEZ0RldGFpbERpc2FibGVkJykgZGV0YWlsRGlzYWJsZWQgPSBmYWxzZTtcbiAgQElucHV0KCdjbHJEZ0RldGFpbEhpZGRlbicpIGRldGFpbEhpZGRlbiA9IGZhbHNlO1xuICBASW5wdXQoJ2NsckRnU2tlbGV0b25Mb2FkaW5nJykgc2tlbGV0b25Mb2FkaW5nID0gZmFsc2U7XG5cbiAgaWQ6IHN0cmluZztcbiAgcmFkaW9JZDogc3RyaW5nO1xuICBjaGVja2JveElkOiBzdHJpbmc7XG4gIGV4cGFuZGFibGVJZDogc3RyaW5nO1xuICByZXBsYWNlZDogYm9vbGVhbjtcbiAgZGlzcGxheUNlbGxzID0gZmFsc2U7XG4gIGV4cGFuZEFuaW1hdGlvblRyaWdnZXIgPSBmYWxzZTtcblxuICAvKiByZWZlcmVuY2UgdG8gdGhlIGVudW0gc28gdGhhdCB0ZW1wbGF0ZSBjYW4gYWNjZXNzICovXG4gIFNFTEVDVElPTl9UWVBFID0gU2VsZWN0aW9uVHlwZTtcblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBpdGVtQ2hhbmdlcyA9IG5ldyBSZXBsYXlTdWJqZWN0PFQ+KDEpO1xuXG4gIC8qKioqKlxuICAgKiBwcm9wZXJ0eSBkZ0NlbGxzXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBIFF1ZXJ5IExpc3Qgb2YgdGhlIENsckRhdGFncmlkIGNlbGxzIGluIHRoaXMgcm93LlxuICAgKlxuICAgKi9cbiAgQENvbnRlbnRDaGlsZHJlbihDbHJEYXRhZ3JpZENlbGwpIGRnQ2VsbHM6IFF1ZXJ5TGlzdDxDbHJEYXRhZ3JpZENlbGw+O1xuXG4gIEBWaWV3Q2hpbGQoQ2xyRXhwYW5kYWJsZUFuaW1hdGlvbkRpcmVjdGl2ZSkgZXhwYW5kQW5pbWF0aW9uOiBDbHJFeHBhbmRhYmxlQW5pbWF0aW9uRGlyZWN0aXZlO1xuICBAVmlld0NoaWxkKCdkZXRhaWxCdXR0b24nKSBkZXRhaWxCdXR0b246IEVsZW1lbnRSZWY8SFRNTEJ1dHRvbkVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdzdGlja3lDZWxscycsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSBfc3RpY2t5Q2VsbHM6IFZpZXdDb250YWluZXJSZWY7XG4gIEBWaWV3Q2hpbGQoJ3Njcm9sbGFibGVDZWxscycsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSBfc2Nyb2xsYWJsZUNlbGxzOiBWaWV3Q29udGFpbmVyUmVmO1xuICBAVmlld0NoaWxkKCdjYWxjdWxhdGVkQ2VsbHMnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSkgX2NhbGN1bGF0ZWRDZWxsczogVmlld0NvbnRhaW5lclJlZjtcbiAgQFZpZXdDaGlsZCgnZml4ZWRDZWxsVGVtcGxhdGUnKSBfZml4ZWRDZWxsVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgcHJpdmF0ZSBfaXRlbTogVDtcbiAgcHJpdmF0ZSBfc2VsZWN0ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZGV0YWlsT3BlbkxhYmVsID0gJyc7XG4gIHByaXZhdGUgX2RldGFpbENsb3NlTGFiZWwgPSAnJztcbiAgcHJpdmF0ZSBfcm93U2VsZWN0aW9uTGFiZWwgPSAnJztcbiAgcHJpdmF0ZSB3cmFwcGVkSW5qZWN0b3I6IEluamVjdG9yO1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgLy8gQnkgZGVmYXVsdCwgZXZlcnkgaXRlbSBpcyBzZWxlY3RhYmxlOyBpdCBiZWNvbWVzIG5vdCBzZWxlY3RhYmxlIG9ubHkgaWYgaXQncyBleHBsaWNpdGx5IHNldCB0byBmYWxzZVxuICBwcml2YXRlIF9zZWxlY3RhYmxlOiBib29sZWFuIHwgc3RyaW5nID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgc2VsZWN0aW9uOiBTZWxlY3Rpb248VD4sXG4gICAgcHVibGljIHJvd0FjdGlvblNlcnZpY2U6IFJvd0FjdGlvblNlcnZpY2UsXG4gICAgcHVibGljIGdsb2JhbEV4cGFuZGFibGU6IEV4cGFuZGFibGVSb3dzQ291bnQsXG4gICAgcHVibGljIGV4cGFuZDogRGF0YWdyaWRJZkV4cGFuZFNlcnZpY2UsXG4gICAgcHVibGljIGRldGFpbFNlcnZpY2U6IERldGFpbFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBkaXNwbGF5TW9kZTogRGlzcGxheU1vZGVTZXJ2aWNlLFxuICAgIHByaXZhdGUgdmNyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgZWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIGl0ZW1zOiBJdGVtcyxcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBhbnlcbiAgKSB7XG4gICAgbmJSb3crKztcbiAgICB0aGlzLmlkID0gJ2Nsci1kZy1yb3cnICsgbmJSb3c7XG4gICAgdGhpcy5yYWRpb0lkID0gJ2Nsci1kZy1yb3ctcmQnICsgbmJSb3c7XG4gICAgdGhpcy5jaGVja2JveElkID0gJ2Nsci1kZy1yb3ctY2InICsgbmJSb3c7XG4gICAgdGhpcy5leHBhbmRhYmxlSWQgPSBleHBhbmQuZXhwYW5kYWJsZUlkO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICBjb21iaW5lTGF0ZXN0KGV4cGFuZC5yZXBsYWNlLCBleHBhbmQuZXhwYW5kQ2hhbmdlKS5zdWJzY3JpYmUoKFtleHBhbmRSZXBsYWNlVmFsdWUsIGV4cGFuZENoYW5nZVZhbHVlXSkgPT4ge1xuICAgICAgICBpZiAoZXhwYW5kUmVwbGFjZVZhbHVlICYmIGV4cGFuZENoYW5nZVZhbHVlKSB7XG4gICAgICAgICAgLy8gcmVwbGFjZWQgYW5kIGV4cGFuZGluZ1xuICAgICAgICAgIHRoaXMucmVwbGFjZWQgPSB0cnVlO1xuICAgICAgICAgIHJlbmRlcmVyLmFkZENsYXNzKGVsLm5hdGl2ZUVsZW1lbnQsICdkYXRhZ3JpZC1yb3ctcmVwbGFjZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJlcGxhY2VkID0gZmFsc2U7XG4gICAgICAgICAgLy8gSGFuZGxlcyB0aGVzZSBjYXNlczogbm90IHJlcGxhY2VkIGFuZCBjb2xsYXBzaW5nICYgcmVwbGFjZWQgYW5kXG4gICAgICAgICAgLy8gY29sbGFwc2luZyBhbmQgbm90IHJlcGxhY2VkIGFuZCBleHBhbmRpbmcuXG4gICAgICAgICAgcmVuZGVyZXIucmVtb3ZlQ2xhc3MoZWwubmF0aXZlRWxlbWVudCwgJ2RhdGFncmlkLXJvdy1yZXBsYWNlZCcpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogTW9kZWwgb2YgdGhlIHJvdywgdG8gdXNlIGZvciBzZWxlY3Rpb25cbiAgICovXG4gIEBJbnB1dCgnY2xyRGdJdGVtJylcbiAgZ2V0IGl0ZW0oKTogVCB7XG4gICAgcmV0dXJuIHRoaXMuX2l0ZW07XG4gIH1cbiAgc2V0IGl0ZW0oaXRlbTogVCkge1xuICAgIHRoaXMuX2l0ZW0gPSBpdGVtO1xuICAgIHRoaXMuaXRlbUNoYW5nZXMubmV4dChpdGVtKTtcbiAgICB0aGlzLmNsckRnU2VsZWN0YWJsZSA9IHRoaXMuX3NlbGVjdGFibGU7XG4gIH1cblxuICBASW5wdXQoJ2NsckRnU2VsZWN0YWJsZScpXG4gIGdldCBjbHJEZ1NlbGVjdGFibGUoKSB7XG4gICAgcmV0dXJuICF0aGlzLnNlbGVjdGlvbi5pc0xvY2tlZCh0aGlzLml0ZW0pO1xuICB9XG4gIHNldCBjbHJEZ1NlbGVjdGFibGUodmFsdWU6IGJvb2xlYW4gfCBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5pdGVtKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbi5sb2NrSXRlbSh0aGlzLml0ZW0sIHZhbHVlID09PSAnZmFsc2UnIHx8IHZhbHVlID09PSBmYWxzZSk7XG4gICAgfVxuICAgIC8vIFN0b3JlIHRoaXMgdmFsdWUgbG9jYWxseSwgdG8gYmUgaW5pdGlhbGl6ZWQgd2hlbiBpdGVtIGlzIGluaXRpYWxpemVkXG4gICAgdGhpcy5fc2VsZWN0YWJsZSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyBpZiB0aGUgcm93IGlzIHNlbGVjdGVkXG4gICAqL1xuICBASW5wdXQoJ2NsckRnU2VsZWN0ZWQnKVxuICBnZXQgc2VsZWN0ZWQoKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuTm9uZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uaXNTZWxlY3RlZCh0aGlzLml0ZW0pO1xuICAgIH1cbiAgfVxuICBzZXQgc2VsZWN0ZWQodmFsdWU6IGJvb2xlYW4gfCBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5Ob25lKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IHZhbHVlIGFzIGJvb2xlYW47XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh2YWx1ZSAmJiB0aGlzLnNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLk11bHRpKSB7XG4gICAgICAgIHRoaXMucmFuZ2VTZWxlY3QoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uLnJhbmdlU3RhcnQgPSBudWxsO1xuICAgICAgfVxuICAgICAgdGhpcy5zZWxlY3Rpb24uc2V0U2VsZWN0ZWQodGhpcy5pdGVtLCB2YWx1ZSBhcyBib29sZWFuKTtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ2NsckRnRXhwYW5kZWQnKVxuICBnZXQgZXhwYW5kZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5kLmV4cGFuZGVkO1xuICB9XG4gIHNldCBleHBhbmRlZCh2YWx1ZTogYm9vbGVhbiB8IHN0cmluZykge1xuICAgIHRoaXMuZXhwYW5kLmV4cGFuZGVkID0gdmFsdWUgYXMgYm9vbGVhbjtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBjbHJEZ0RldGFpbE9wZW5MYWJlbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9kZXRhaWxPcGVuTGFiZWwgPyB0aGlzLl9kZXRhaWxPcGVuTGFiZWwgOiB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5vcGVuO1xuICB9XG4gIHNldCBjbHJEZ0RldGFpbE9wZW5MYWJlbChsYWJlbDogc3RyaW5nKSB7XG4gICAgdGhpcy5fZGV0YWlsT3BlbkxhYmVsID0gbGFiZWw7XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgY2xyRGdEZXRhaWxDbG9zZUxhYmVsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2RldGFpbENsb3NlTGFiZWwgPyB0aGlzLl9kZXRhaWxDbG9zZUxhYmVsIDogdGhpcy5jb21tb25TdHJpbmdzLmtleXMuY2xvc2U7XG4gIH1cbiAgc2V0IGNsckRnRGV0YWlsQ2xvc2VMYWJlbChsYWJlbDogc3RyaW5nKSB7XG4gICAgdGhpcy5fZGV0YWlsQ2xvc2VMYWJlbCA9IGxhYmVsO1xuICB9XG5cbiAgLy8gQ0RFLTE1MTogUmVuYW1lIHRoaXMgZmllbGQgdG8gY2xyRGdSb3dTZWxlY3Rpb25MYWJlbCBpbiB2MTZcbiAgQElucHV0KClcbiAgZ2V0IGNsckRnUm93U2VsZWN0aW9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcm93U2VsZWN0aW9uTGFiZWwgPyB0aGlzLl9yb3dTZWxlY3Rpb25MYWJlbCA6IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLnNlbGVjdDtcbiAgfVxuICBzZXQgY2xyRGdSb3dTZWxlY3Rpb25MYWJlbChsYWJlbDogc3RyaW5nKSB7XG4gICAgdGhpcy5fcm93U2VsZWN0aW9uTGFiZWwgPSBsYWJlbDtcbiAgfVxuXG4gIGdldCBfdmlldygpIHtcbiAgICByZXR1cm4gdGhpcy53cmFwcGVkSW5qZWN0b3IuZ2V0KFdyYXBwZWRSb3csIHRoaXMudmNyKS5yb3dWaWV3O1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy53cmFwcGVkSW5qZWN0b3IgPSBuZXcgSG9zdFdyYXBwZXIoV3JhcHBlZFJvdywgdGhpcy52Y3IpO1xuICAgIHRoaXMuc2VsZWN0aW9uLmxvY2tJdGVtKHRoaXMuaXRlbSwgdGhpcy5jbHJEZ1NlbGVjdGFibGUgPT09IGZhbHNlKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLmRnQ2VsbHMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5kZ0NlbGxzLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgIGlmICghY2VsbC5fdmlldy5kZXN0cm95ZWQpIHtcbiAgICAgICAgICB0aGlzLl9zY3JvbGxhYmxlQ2VsbHMuaW5zZXJ0KGNlbGwuX3ZpZXcpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHRoaXMuZGlzcGxheU1vZGUudmlldy5zdWJzY3JpYmUodmlld0NoYW5nZSA9PiB7XG4gICAgICAgIC8vIExpc3RlbiBmb3IgdmlldyBjaGFuZ2VzIGFuZCBtb3ZlIGNlbGxzIGFyb3VuZCBkZXBlbmRpbmcgb24gdGhlIGN1cnJlbnQgZGlzcGxheVR5cGVcbiAgICAgICAgLy8gcmVtb3ZlIGNlbGwgdmlld3MgZnJvbSBkaXNwbGF5IHZpZXdcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX3Njcm9sbGFibGVDZWxscy5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICB0aGlzLl9zY3JvbGxhYmxlQ2VsbHMuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVtb3ZlIGNlbGwgdmlld3MgZnJvbSBjYWxjdWxhdGVkIHZpZXdcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX2NhbGN1bGF0ZWRDZWxscy5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVkQ2VsbHMuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZpZXdDaGFuZ2UgPT09IERhdGFncmlkRGlzcGxheU1vZGUuQ0FMQ1VMQVRFKSB7XG4gICAgICAgICAgdGhpcy5kaXNwbGF5Q2VsbHMgPSBmYWxzZTtcbiAgICAgICAgICAvLyBJbnNlcnRzIGEgZml4ZWQgY2VsbCBpZiBhbnkgb2YgdGhlc2UgY29uZGl0aW9ucyBhcmUgdHJ1ZS5cbiAgICAgICAgICBjb25zdCBmaXhlZENlbGxDb25kaXRpb25zID0gW1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSAhPT0gdGhpcy5TRUxFQ1RJT05fVFlQRS5Ob25lLFxuICAgICAgICAgICAgdGhpcy5yb3dBY3Rpb25TZXJ2aWNlLmhhc0FjdGlvbmFibGVSb3csXG4gICAgICAgICAgICB0aGlzLmdsb2JhbEV4cGFuZGFibGUuaGFzRXhwYW5kYWJsZVJvdyxcbiAgICAgICAgICAgIHRoaXMuZGV0YWlsU2VydmljZS5lbmFibGVkLFxuICAgICAgICAgIF07XG4gICAgICAgICAgZml4ZWRDZWxsQ29uZGl0aW9uc1xuICAgICAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAgICAgLmZvckVhY2goKCkgPT4gdGhpcy5fY2FsY3VsYXRlZENlbGxzLmluc2VydCh0aGlzLl9maXhlZENlbGxUZW1wbGF0ZS5jcmVhdGVFbWJlZGRlZFZpZXcobnVsbCkpKTtcbiAgICAgICAgICB0aGlzLmRnQ2VsbHMuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgIGlmICghY2VsbC5fdmlldy5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlZENlbGxzLmluc2VydChjZWxsLl92aWV3KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRpc3BsYXlDZWxscyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5kZ0NlbGxzLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICBpZiAoIWNlbGwuX3ZpZXcuZGVzdHJveWVkKSB7XG4gICAgICAgICAgICAgIHRoaXMuX3Njcm9sbGFibGVDZWxscy5pbnNlcnQoY2VsbC5fdmlldyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5leHBhbmQuYW5pbWF0ZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLmV4cGFuZEFuaW1hdGlvblRyaWdnZXIgPSAhdGhpcy5leHBhbmRBbmltYXRpb25UcmlnZ2VyO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmZvckVhY2goKHN1YjogU3Vic2NyaXB0aW9uKSA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICB0b2dnbGUoc2VsZWN0ZWQgPSAhdGhpcy5zZWxlY3RlZCkge1xuICAgIGlmIChzZWxlY3RlZCAhPT0gdGhpcy5zZWxlY3RlZCkge1xuICAgICAgdGhpcy5zZWxlY3RlZCA9IHNlbGVjdGVkO1xuICAgICAgdGhpcy5zZWxlY3RlZENoYW5nZWQuZW1pdChzZWxlY3RlZCk7XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlRXhwYW5kKCkge1xuICAgIGlmICh0aGlzLmV4cGFuZC5leHBhbmRhYmxlKSB7XG4gICAgICB0aGlzLmV4cGFuZEFuaW1hdGlvbi51cGRhdGVTdGFydEhlaWdodCgpO1xuICAgICAgdGhpcy5leHBhbmRlZCA9ICF0aGlzLmV4cGFuZGVkO1xuICAgICAgdGhpcy5leHBhbmRlZENoYW5nZS5lbWl0KHRoaXMuZXhwYW5kZWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZGVmYXVsdCBiZWhhdmlvciBpbiBDaHJvbWUgYW5kIEZpcmVmb3ggZm9yIHNoaWZ0LWNsaWNraW5nIG9uIGEgbGFiZWwgaXMgdG8gcGVyZm9ybSB0ZXh0LXNlbGVjdGlvbi5cbiAgICogVGhpcyBwcmV2ZW50cyBvdXIgaW50ZW5kZWQgcmFuZ2Utc2VsZWN0aW9uLCBiZWNhdXNlIHRoaXMgdGV4dC1zZWxlY3Rpb24gb3ZlcnJpZGVzIG91ciBzaGlmdC1jbGljayBldmVudC5cbiAgICogV2UgbmVlZCB0byBjbGVhciB0aGUgc3RvcmVkIHNlbGVjdGlvbiByYW5nZSB3aGVuIHNoaWZ0LWNsaWNraW5nLiBUaGlzIHdpbGwgb3ZlcnJpZGUgdGhlIG1vc3RseSB1bnVzZWQgc2hpZnQtY2xpY2tcbiAgICogc2VsZWN0aW9uIGJyb3dzZXIgZnVuY3Rpb25hbGl0eSwgd2hpY2ggaXMgaW5jb25zaXN0ZW50bHkgaW1wbGVtZW50ZWQgaW4gYnJvd3NlcnMgYW55d2F5LlxuICAgKi9cbiAgY2xlYXJSYW5nZXMoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb24ucm93U2VsZWN0aW9uTW9kZSAmJiBldmVudC5zaGlmdEtleSkge1xuICAgICAgdGhpcy5kb2N1bWVudC5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgIC8vIEZpcmVmb3ggaXMgdG9vIHBlcnNpc3RlbnQgYWJvdXQgaXRzIHRleHQtc2VsZWN0aW9uIGJlaGF2aW91ci4gU28gd2UgbmVlZCB0byBhZGQgYSBwcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgLy8gV2Ugc2hvdWxkIG5vdCB0cnkgdG8gZW5mb3JjZSB0aGlzIG9uIHRoZSBvdGhlciBicm93c2VycywgdGhvdWdoLCBiZWNhdXNlIHRoZWlyIHRvZ2dsZSBjeWNsZSBkb2VzIG5vdCBnZXQgY2FuY2VsZWQgYnlcbiAgICAgIC8vIHRoZSBwcmV2ZW50RGVmYXVsdCgpIGFuZCB0aGV5IHRvZ2dsZSB0aGUgY2hlY2tib3ggc2Vjb25kIHRpbWUsIGVmZmVjdGl2ZWx5IHJldHJ1cm5pbmcgaXQgdG8gbm90LXNlbGVjdGVkLlxuICAgICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0ZpcmVmb3gnKSAhPT0gLTEpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy50b2dnbGUodHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIHJlbGF0ZWQgdG8gY2xyRGdSb3dTZWxlY3Rpb24sIHdoaWNoIGlzIGRlcHJlY2F0ZWRcbiAgICovXG4gIHByb3RlY3RlZCBzZWxlY3RSb3coc2VsZWN0ZWQgPSAhdGhpcy5zZWxlY3RlZCwgJGV2ZW50KSB7XG4gICAgLy8gVGhlIGxhYmVsIGFsc28gY2FwdHVyZXMgY2xpY2tzIHRoYXQgYnViYmxlIHVwIHRvIHRoZSByb3cgZXZlbnQgbGlzdGVuZXIsIGNhdXNpbmdcbiAgICAvLyB0aGlzIGhhbmRsZXIgdG8gcnVuIHR3aWNlLiBUaGlzIGV4aXRzIGVhcmx5IHRvIHByZXZlbnQgdG9nZ2xpbmcgdGhlIGNoZWNrYm94IHR3aWNlLlxuICAgIGlmICghdGhpcy5zZWxlY3Rpb24ucm93U2VsZWN0aW9uTW9kZSB8fCAkZXZlbnQudGFyZ2V0LnRhZ05hbWUgPT09ICdMQUJFTCcgfHwgIXRoaXMuX3NlbGVjdGFibGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IHRoaXMuU0VMRUNUSU9OX1RZUEUuU2luZ2xlKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbi5jdXJyZW50U2luZ2xlID0gdGhpcy5pdGVtO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRvZ2dsZShzZWxlY3RlZCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByYW5nZVNlbGVjdCgpIHtcbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuaXRlbXMuZGlzcGxheWVkO1xuICAgIGlmICghaXRlbXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc3RhcnRJeCA9IGl0ZW1zLmluZGV4T2YodGhpcy5zZWxlY3Rpb24ucmFuZ2VTdGFydCk7XG4gICAgaWYgKFxuICAgICAgdGhpcy5zZWxlY3Rpb24ucmFuZ2VTdGFydCAmJlxuICAgICAgdGhpcy5zZWxlY3Rpb24uY3VycmVudC5pbmNsdWRlcyh0aGlzLnNlbGVjdGlvbi5yYW5nZVN0YXJ0KSAmJlxuICAgICAgdGhpcy5zZWxlY3Rpb24uc2hpZnRQcmVzc2VkICYmXG4gICAgICBzdGFydEl4ICE9PSAtMVxuICAgICkge1xuICAgICAgY29uc3QgZW5kSXggPSBpdGVtcy5pbmRleE9mKHRoaXMuaXRlbSk7XG4gICAgICAvLyBVc2luZyBTZXQgdG8gcmVtb3ZlIGR1cGxpY2F0ZXNcbiAgICAgIGNvbnN0IG5ld1NlbGVjdGlvbiA9IG5ldyBTZXQoXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uLmN1cnJlbnQuY29uY2F0KGl0ZW1zLnNsaWNlKE1hdGgubWluKHN0YXJ0SXgsIGVuZEl4KSwgTWF0aC5tYXgoc3RhcnRJeCwgZW5kSXgpICsgMSkpXG4gICAgICApO1xuICAgICAgdGhpcy5zZWxlY3Rpb24uY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgIHRoaXMuc2VsZWN0aW9uLmN1cnJlbnQucHVzaCguLi5uZXdTZWxlY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBwYWdlIG51bWJlciBoYXMgY2hhbmdlZCBvclxuICAgICAgLy8gbm8gU2hpZnQgd2FzIHByZXNzZWQgb3JcbiAgICAgIC8vIHJhbmdlU3RhcnQgbm90IHlldCBzZXRcbiAgICAgIHRoaXMuc2VsZWN0aW9uLnJhbmdlU3RhcnQgPSB0aGlzLml0ZW07XG4gICAgfVxuICB9XG59XG4iLCI8ZGl2XG4gIHJvbGU9XCJyb3dcIlxuICBbaWRdPVwiaWRcIlxuICBjbGFzcz1cImRhdGFncmlkLXJvdy1tYXN0ZXIgZGF0YWdyaWQtcm93LWZsZXhcIlxuICBbY2xyRXhwYW5kYWJsZUFuaW1hdGlvbl09XCJleHBhbmRBbmltYXRpb25UcmlnZ2VyXCJcbiAgKG1vdXNlZG93bik9XCJjbGVhclJhbmdlcygkZXZlbnQpXCJcbiAgKGNsaWNrKT1cInNlbGVjdFJvdyghc2VsZWN0ZWQsICRldmVudClcIlxuICBbY2xhc3MuZGF0YWdyaWQtcm93LWNsaWNrYWJsZV09XCJzZWxlY3Rpb24ucm93U2VsZWN0aW9uTW9kZVwiXG4gIFtjbGFzcy5kYXRhZ3JpZC1yb3ctZGV0YWlsLW9wZW5dPVwiZGV0YWlsU2VydmljZS5pc1Jvd09wZW4oaXRlbSlcIlxuPlxuICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtcm93LXN0aWNreVwiPlxuICAgIDwhLS0gU3RpY2t5IGVsZW1lbnRzIGhlcmUgLS0+XG4gICAgPG5nLWNvbnRhaW5lciAjc3RpY2t5Q2VsbHM+XG4gICAgICA8ZGl2XG4gICAgICAgICpuZ0lmPVwic2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNFTEVDVElPTl9UWVBFLk11bHRpXCJcbiAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1zZWxlY3QgZGF0YWdyaWQtZml4ZWQtY29sdW1uIGRhdGFncmlkLWNlbGxcIlxuICAgICAgICBbbmdDbGFzc109XCJ7ICdjbHItZm9ybS1jb250cm9sLWRpc2FibGVkJzogIWNsckRnU2VsZWN0YWJsZSB9XCJcbiAgICAgICAgcm9sZT1cImdyaWRjZWxsXCJcbiAgICAgID5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNsci1jaGVja2JveC13cmFwcGVyXCI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICBbbmdNb2RlbF09XCJzZWxlY3RlZFwiXG4gICAgICAgICAgICAobmdNb2RlbENoYW5nZSk9XCJ0b2dnbGUoJGV2ZW50KVwiXG4gICAgICAgICAgICBbaWRdPVwiY2hlY2tib3hJZFwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiY2xyRGdTZWxlY3RhYmxlID8gbnVsbCA6IHRydWVcIlxuICAgICAgICAgICAgW2F0dHIuYXJpYS1kaXNhYmxlZF09XCJjbHJEZ1NlbGVjdGFibGUgPyBudWxsIDogdHJ1ZVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8IS0tIFVzYWdlIG9mIGNsYXNzIGNsci1jb2wtbnVsbCBoZXJlIHByZXZlbnRzIGNsci1jb2wtKiBjbGFzc2VzIGZyb20gYmVpbmcgYWRkZWQgd2hlbiBhIGRhdGFncmlkIGlzIHdyYXBwZWQgaW5zaWRlIGNsckZvcm0gLS0+XG4gICAgICAgICAgPGxhYmVsIFtmb3JdPVwiY2hlY2tib3hJZFwiIGNsYXNzPVwiY2xyLWNvbnRyb2wtbGFiZWwgY2xyLWNvbC1udWxsXCIgKGNsaWNrKT1cImNsZWFyUmFuZ2VzKCRldmVudClcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57e2NsckRnUm93U2VsZWN0aW9uTGFiZWwgfHwgY29tbW9uU3RyaW5ncy5rZXlzLnNlbGVjdH19PC9zcGFuPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2XG4gICAgICAgICpuZ0lmPVwic2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNFTEVDVElPTl9UWVBFLlNpbmdsZVwiXG4gICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtc2VsZWN0IGRhdGFncmlkLWZpeGVkLWNvbHVtbiBkYXRhZ3JpZC1jZWxsXCJcbiAgICAgICAgW25nQ2xhc3NdPVwieyAnY2xyLWZvcm0tY29udHJvbC1kaXNhYmxlZCc6ICFjbHJEZ1NlbGVjdGFibGUgfVwiXG4gICAgICAgIHJvbGU9XCJncmlkY2VsbFwiXG4gICAgICA+XG4gICAgICAgIDxjbHItcmFkaW8td3JhcHBlcj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgICAgdHlwZT1cInJhZGlvXCJcbiAgICAgICAgICAgIGNsclJhZGlvXG4gICAgICAgICAgICBbaWRdPVwicmFkaW9JZFwiXG4gICAgICAgICAgICBbbmFtZV09XCJzZWxlY3Rpb24uaWQgKyAnLXJhZGlvJ1wiXG4gICAgICAgICAgICBbdmFsdWVdPVwiaXRlbVwiXG4gICAgICAgICAgICBbKG5nTW9kZWwpXT1cInNlbGVjdGlvbi5jdXJyZW50U2luZ2xlXCJcbiAgICAgICAgICAgIFtjaGVja2VkXT1cInNlbGVjdGlvbi5jdXJyZW50U2luZ2xlID09PSBpdGVtXCJcbiAgICAgICAgICAgIFtkaXNhYmxlZF09XCJjbHJEZ1NlbGVjdGFibGUgPyBudWxsIDogdHJ1ZVwiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWRpc2FibGVkXT1cImNsckRnU2VsZWN0YWJsZSA/IG51bGwgOiB0cnVlXCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNsci1jb250cm9sLWxhYmVsIGNsci1jb2wtbnVsbFwiIFtmb3JdPVwicmFkaW9JZFwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHItc3Itb25seVwiPnt7IGNsckRnUm93U2VsZWN0aW9uTGFiZWwgfHwgY29tbW9uU3RyaW5ncy5rZXlzLnNlbGVjdCB9fTwvc3Bhbj5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Nsci1yYWRpby13cmFwcGVyPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2XG4gICAgICAgICpuZ0lmPVwicm93QWN0aW9uU2VydmljZS5oYXNBY3Rpb25hYmxlUm93XCJcbiAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1yb3ctYWN0aW9ucyBkYXRhZ3JpZC1maXhlZC1jb2x1bW4gZGF0YWdyaWQtY2VsbFwiXG4gICAgICAgIHJvbGU9XCJncmlkY2VsbFwiXG4gICAgICA+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1kZy1hY3Rpb24tb3ZlcmZsb3dcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXZcbiAgICAgICAgKm5nSWY9XCJnbG9iYWxFeHBhbmRhYmxlLmhhc0V4cGFuZGFibGVSb3dcIlxuICAgICAgICBjbGFzcz1cImRhdGFncmlkLWV4cGFuZGFibGUtY2FyZXQgZGF0YWdyaWQtZml4ZWQtY29sdW1uIGRhdGFncmlkLWNlbGxcIlxuICAgICAgICByb2xlPVwiZ3JpZGNlbGxcIlxuICAgICAgPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiZXhwYW5kLmV4cGFuZGFibGVcIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgICAgICAgICpuZ0lmPVwiIWV4cGFuZC5sb2FkaW5nXCJcbiAgICAgICAgICAgIChjbGljayk9XCJ0b2dnbGVFeHBhbmQoKVwiXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtZXhwYW5kYWJsZS1jYXJldC1idXR0b25cIlxuICAgICAgICAgICAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJleHBhbmQuZXhwYW5kZWRcIlxuICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJleHBhbmQuZXhwYW5kZWQgPyBjbHJEZ0RldGFpbENsb3NlTGFiZWwgOiBjbHJEZ0RldGFpbE9wZW5MYWJlbFwiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWNvbnRyb2xzXT1cImV4cGFuZC5oYXNFeHBhbmRUZW1wbGF0ZSAmJiAhZXhwYW5kLmV4cGFuZGVkID8gbnVsbCA6IGV4cGFuZGFibGVJZFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGNkcy1pY29uXG4gICAgICAgICAgICAgIHNoYXBlPVwiYW5nbGVcIlxuICAgICAgICAgICAgICBjbGFzcz1cImRhdGFncmlkLWV4cGFuZGFibGUtY2FyZXQtaWNvblwiXG4gICAgICAgICAgICAgIFthdHRyLmRpcmVjdGlvbl09XCJleHBhbmQuZXhwYW5kZWQgPyAnZG93bicgOiAncmlnaHQnXCJcbiAgICAgICAgICAgICAgW2F0dHIudGl0bGVdPVwiZXhwYW5kLmV4cGFuZGVkID8gY29tbW9uU3RyaW5ncy5rZXlzLmNvbGxhcHNlIDogY29tbW9uU3RyaW5ncy5rZXlzLmV4cGFuZFwiXG4gICAgICAgICAgICA+PC9jZHMtaWNvbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8Y2xyLXNwaW5uZXIgKm5nSWY9XCJleHBhbmQubG9hZGluZ1wiIGNsclNtYWxsPnt7IGNvbW1vblN0cmluZ3Mua2V5cy5sb2FkaW5nIH19PC9jbHItc3Bpbm5lcj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXZcbiAgICAgICAgKm5nSWY9XCJkZXRhaWxTZXJ2aWNlLmVuYWJsZWRcIlxuICAgICAgICBjbGFzcz1cImRhdGFncmlkLWRldGFpbC1jYXJldCBkYXRhZ3JpZC1maXhlZC1jb2x1bW4gZGF0YWdyaWQtY2VsbFwiXG4gICAgICAgIHJvbGU9XCJncmlkY2VsbFwiXG4gICAgICA+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgICAgICAoY2xpY2spPVwiZGV0YWlsU2VydmljZS50b2dnbGUoaXRlbSwgZGV0YWlsQnV0dG9uKVwiXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgI2RldGFpbEJ1dHRvblxuICAgICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtZGV0YWlsLWNhcmV0LWJ1dHRvblwiXG4gICAgICAgICAgW2Rpc2FibGVkXT1cImRldGFpbERpc2FibGVkXCJcbiAgICAgICAgICAqbmdJZj1cIiFkZXRhaWxIaWRkZW5cIlxuICAgICAgICAgIFtjbGFzcy5pcy1vcGVuXT1cImRldGFpbFNlcnZpY2UuaXNSb3dPcGVuKGl0ZW0pXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImRldGFpbFNlcnZpY2UuaXNSb3dPcGVuKGl0ZW0pID8gY2xyRGdEZXRhaWxDbG9zZUxhYmVsIDogY2xyRGdEZXRhaWxPcGVuTGFiZWxcIlxuICAgICAgICAgIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwiZGV0YWlsU2VydmljZS5pc1Jvd09wZW4oaXRlbSlcIlxuICAgICAgICAgIFthdHRyLmFyaWEtY29udHJvbHNdPVwiZGV0YWlsU2VydmljZS5pZFwiXG4gICAgICAgICAgYXJpYS1oYXNwb3B1cD1cImRpYWxvZ1wiXG4gICAgICAgID5cbiAgICAgICAgICA8Y2RzLWljb25cbiAgICAgICAgICAgIHNoYXBlPVwiYW5nbGUtZG91YmxlXCJcbiAgICAgICAgICAgIFthdHRyLmRpcmVjdGlvbl09XCJkZXRhaWxTZXJ2aWNlLmlzUm93T3BlbihpdGVtKSA/ICdsZWZ0JyA6ICdyaWdodCdcIlxuICAgICAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1kZXRhaWwtY2FyZXQtaWNvblwiXG4gICAgICAgICAgICBbYXR0ci50aXRsZV09XCJkZXRhaWxTZXJ2aWNlLmlzUm93T3BlbihpdGVtKSA/IGNvbW1vblN0cmluZ3Mua2V5cy5jbG9zZTogY29tbW9uU3RyaW5ncy5rZXlzLm9wZW5cIlxuICAgICAgICAgID48L2Nkcy1pY29uPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctY29udGFpbmVyPlxuICAgIDwhLS0gcGxhY2Vob2xkZXIgZm9yIHByb2plY3Rpbmcgb3RoZXIgc3RpY2t5IGNlbGxzIGFzIHBpbm5lZC0tPlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cImRhdGFncmlkLXJvdy1zY3JvbGxhYmxlXCIgW25nQ2xhc3NdPVwieydpcy1yZXBsYWNlZCc6IHJlcGxhY2VkICYmIGV4cGFuZGVkfVwiPlxuICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1zY3JvbGxpbmctY2VsbHNcIj5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1kZy1jZWxsXCI+PC9uZy1jb250ZW50PlxuICAgICAgPG5nLWNvbnRhaW5lciAjc2Nyb2xsYWJsZUNlbGxzPjwvbmctY29udGFpbmVyPlxuICAgIDwvZGl2PlxuICAgIDwhLS0gZGV0YWlscyBoZXJlIHdoZW4gcmVwbGFjZSwgcmUtdmlzaXQgd2hlbiBzdGlja3kgY29udGFpbmVyIGlzIHVzZWQgZm9yIHBpbm5lZCBjZWxscyAtLT5cbiAgICA8bmctdGVtcGxhdGUgKm5nSWY9XCJyZXBsYWNlZCAmJiAhZXhwYW5kLmxvYWRpbmdcIiBbbmdUZW1wbGF0ZU91dGxldF09XCJkZXRhaWxcIj48L25nLXRlbXBsYXRlPlxuICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cIiFyZXBsYWNlZCAmJiAhZXhwYW5kLmxvYWRpbmdcIiBbbmdUZW1wbGF0ZU91dGxldF09XCJkZXRhaWxcIj48L25nLXRlbXBsYXRlPlxuICA8L2Rpdj5cbiAgPGNsci1kZy1jZWxsIGNsYXNzPVwic2tlbGV0b24tbG9hZGluZ1wiICpuZ0lmPVwic2tlbGV0b25Mb2FkaW5nXCI+PC9jbHItZGctY2VsbD5cbjwvZGl2PlxuPCEtLVxuICAgIFdlIG5lZWQgdGhlIFwicHJvamVjdCBpbnRvIHRlbXBsYXRlXCIgaGFja3MgYmVjYXVzZSB3ZSBuZWVkIHRoaXMgaW4gMiBkaWZmZXJlbnQgcGxhY2VzXG4gICAgZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhlIGRldGFpbHMgcmVwbGFjZSB0aGUgcm93IG9yIG5vdC5cbi0tPlxuPG5nLXRlbXBsYXRlICNkZXRhaWw+XG4gIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1kZy1yb3ctZGV0YWlsXCI+PC9uZy1jb250ZW50PlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLWNvbnRhaW5lciAjY2FsY3VsYXRlZENlbGxzPjwvbmctY29udGFpbmVyPlxuXG48bmctdGVtcGxhdGUgI2ZpeGVkQ2VsbFRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtZml4ZWQtY29sdW1uIGRhdGFncmlkLWNlbGxcIiByb2xlPVwiZ3JpZGNlbGxcIj48L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG4iXX0=
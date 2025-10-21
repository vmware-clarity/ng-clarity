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
import * as i17 from "./datagrid-selection-cell.directive";
import * as i18 from "./datagrid-single-selection.directive";
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
        this.el = el;
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
    get trackBy() {
        return this.items.trackBy;
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
    ], queries: [{ propertyName: "dgCells", predicate: ClrDatagridCell }], viewQueries: [{ propertyName: "expandAnimation", first: true, predicate: ClrExpandableAnimationDirective, descendants: true }, { propertyName: "detailButton", first: true, predicate: ["detailButton"], descendants: true }, { propertyName: "_stickyCells", first: true, predicate: ["stickyCells"], descendants: true, read: ViewContainerRef }, { propertyName: "_scrollableCells", first: true, predicate: ["scrollableCells"], descendants: true, read: ViewContainerRef }, { propertyName: "_calculatedCells", first: true, predicate: ["calculatedCells"], descendants: true, read: ViewContainerRef }, { propertyName: "_fixedCellTemplate", first: true, predicate: ["fixedCellTemplate"], descendants: true }], ngImport: i0, template: "<div\n  role=\"row\"\n  [id]=\"id\"\n  class=\"datagrid-row-master datagrid-row-flex\"\n  [clrExpandableAnimation]=\"expandAnimationTrigger\"\n  (mousedown)=\"clearRanges($event)\"\n  (click)=\"selectRow(!selected, $event)\"\n  [class.datagrid-row-clickable]=\"selection.rowSelectionMode\"\n  [class.datagrid-row-detail-open]=\"detailService.isRowOpen(item)\"\n>\n  <div class=\"datagrid-row-sticky\">\n    <!-- Sticky elements here -->\n    <ng-container #stickyCells>\n      <div\n        *ngIf=\"selection.selectionType === SELECTION_TYPE.Multi\"\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <div class=\"clr-checkbox-wrapper\">\n          <input\n            tabindex=\"-1\"\n            type=\"checkbox\"\n            [ngModel]=\"selected\"\n            (ngModelChange)=\"toggle($event)\"\n            [id]=\"checkboxId\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n          <label [for]=\"checkboxId\" class=\"clr-control-label clr-col-null\" (click)=\"clearRanges($event)\">\n            <span class=\"clr-sr-only\">{{clrDgRowSelectionLabel || commonStrings.keys.select}}</span>\n          </label>\n        </div>\n      </div>\n      <div\n        *ngIf=\"selection.selectionType === SELECTION_TYPE.Single\"\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <clr-radio-wrapper>\n          <input\n            tabindex=\"-1\"\n            type=\"radio\"\n            clrRadio\n            clrDgSingleSelectionRadio\n            [clrDgItemsTrackBy]=\"trackBy\"\n            [id]=\"radioId\"\n            [name]=\"selection.id + '-radio'\"\n            [value]=\"item\"\n            [(ngModel)]=\"selection.currentSingle\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <label class=\"clr-control-label clr-col-null\" [for]=\"radioId\">\n            <span class=\"clr-sr-only\">{{ clrDgRowSelectionLabel || commonStrings.keys.select }}</span>\n          </label>\n        </clr-radio-wrapper>\n      </div>\n      <div\n        *ngIf=\"rowActionService.hasActionableRow\"\n        class=\"datagrid-row-actions datagrid-fixed-column datagrid-cell\"\n        role=\"gridcell\"\n      >\n        <ng-content select=\"clr-dg-action-overflow\"></ng-content>\n      </div>\n      <div\n        *ngIf=\"globalExpandable.hasExpandableRow\"\n        class=\"datagrid-expandable-caret datagrid-fixed-column datagrid-cell\"\n        role=\"gridcell\"\n      >\n        <ng-container *ngIf=\"expand.expandable\">\n          <button\n            tabindex=\"-1\"\n            *ngIf=\"!expand.loading\"\n            (click)=\"toggleExpand()\"\n            type=\"button\"\n            class=\"datagrid-expandable-caret-button\"\n            [attr.aria-expanded]=\"expand.expanded\"\n            [attr.aria-label]=\"expand.expanded ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n            [attr.aria-controls]=\"expand.hasExpandTemplate && !expand.expanded ? null : expandableId\"\n          >\n            <cds-icon\n              shape=\"angle\"\n              class=\"datagrid-expandable-caret-icon\"\n              [attr.direction]=\"expand.expanded ? 'down' : 'right'\"\n              [attr.title]=\"expand.expanded ? commonStrings.keys.collapse : commonStrings.keys.expand\"\n            ></cds-icon>\n          </button>\n          <clr-spinner *ngIf=\"expand.loading\" clrSmall>{{ commonStrings.keys.loading }}</clr-spinner>\n        </ng-container>\n      </div>\n      <div\n        *ngIf=\"detailService.enabled\"\n        class=\"datagrid-detail-caret datagrid-fixed-column datagrid-cell\"\n        role=\"gridcell\"\n      >\n        <button\n          tabindex=\"-1\"\n          (click)=\"detailService.toggle(item, detailButton)\"\n          type=\"button\"\n          #detailButton\n          class=\"datagrid-detail-caret-button\"\n          [disabled]=\"detailDisabled\"\n          *ngIf=\"!detailHidden\"\n          [class.is-open]=\"detailService.isRowOpen(item)\"\n          [attr.aria-label]=\"detailService.isRowOpen(item) ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n          [attr.aria-expanded]=\"detailService.isRowOpen(item)\"\n          [attr.aria-controls]=\"detailService.id\"\n          aria-haspopup=\"dialog\"\n        >\n          <cds-icon\n            shape=\"angle-double\"\n            [attr.direction]=\"detailService.isRowOpen(item) ? 'left' : 'right'\"\n            class=\"datagrid-detail-caret-icon\"\n            [attr.title]=\"detailService.isRowOpen(item) ? commonStrings.keys.close: commonStrings.keys.open\"\n          ></cds-icon>\n        </button>\n      </div>\n    </ng-container>\n    <!-- placeholder for projecting other sticky cells as pinned-->\n  </div>\n  <div class=\"datagrid-row-scrollable\" [ngClass]=\"{'is-replaced': replaced && expanded}\">\n    <div class=\"datagrid-scrolling-cells\">\n      <ng-content select=\"clr-dg-cell\"></ng-content>\n      <ng-container #scrollableCells></ng-container>\n    </div>\n    <!-- details here when replace, re-visit when sticky container is used for pinned cells -->\n    <ng-template *ngIf=\"replaced && !expand.loading\" [ngTemplateOutlet]=\"detail\"></ng-template>\n    <ng-template *ngIf=\"!replaced && !expand.loading\" [ngTemplateOutlet]=\"detail\"></ng-template>\n  </div>\n</div>\n<!--\n    We need the \"project into template\" hacks because we need this in 2 different places\n    depending on whether the details replace the row or not.\n-->\n<ng-template #detail>\n  <ng-content select=\"clr-dg-row-detail\"></ng-content>\n</ng-template>\n\n<ng-container #calculatedCells></ng-container>\n\n<ng-template #fixedCellTemplate>\n  <div class=\"datagrid-fixed-column datagrid-cell\" role=\"gridcell\"></div>\n</ng-template>\n", dependencies: [{ kind: "directive", type: i9.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i9.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i9.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i10.CdsIconCustomTag, selector: "cds-icon" }, { kind: "directive", type: i11.ClrLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i12.ClrRadio, selector: "[clrRadio]" }, { kind: "component", type: i13.ClrRadioWrapper, selector: "clr-radio-wrapper" }, { kind: "directive", type: i14.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i14.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i14.RadioControlValueAccessor, selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]", inputs: ["name", "formControlName", "value"] }, { kind: "directive", type: i14.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i14.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i15.ClrExpandableAnimationDirective, selector: "[clrExpandableAnimation]", inputs: ["clrExpandableAnimation"] }, { kind: "component", type: i16.ClrSpinner, selector: "clr-spinner", inputs: ["clrInline", "clrInverse", "clrSmall", "clrMedium"] }, { kind: "directive", type: i17.ClrDatagridSelectionCellDirective, selector: ".datagrid-select" }, { kind: "directive", type: i18.ClrDatagridSingleSelectionValueAccessor, selector: "input[type=radio][clrDgSingleSelectionRadio]", inputs: ["value", "clrDgItemsTrackBy"] }] });
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
                    ], template: "<div\n  role=\"row\"\n  [id]=\"id\"\n  class=\"datagrid-row-master datagrid-row-flex\"\n  [clrExpandableAnimation]=\"expandAnimationTrigger\"\n  (mousedown)=\"clearRanges($event)\"\n  (click)=\"selectRow(!selected, $event)\"\n  [class.datagrid-row-clickable]=\"selection.rowSelectionMode\"\n  [class.datagrid-row-detail-open]=\"detailService.isRowOpen(item)\"\n>\n  <div class=\"datagrid-row-sticky\">\n    <!-- Sticky elements here -->\n    <ng-container #stickyCells>\n      <div\n        *ngIf=\"selection.selectionType === SELECTION_TYPE.Multi\"\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <div class=\"clr-checkbox-wrapper\">\n          <input\n            tabindex=\"-1\"\n            type=\"checkbox\"\n            [ngModel]=\"selected\"\n            (ngModelChange)=\"toggle($event)\"\n            [id]=\"checkboxId\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n          <label [for]=\"checkboxId\" class=\"clr-control-label clr-col-null\" (click)=\"clearRanges($event)\">\n            <span class=\"clr-sr-only\">{{clrDgRowSelectionLabel || commonStrings.keys.select}}</span>\n          </label>\n        </div>\n      </div>\n      <div\n        *ngIf=\"selection.selectionType === SELECTION_TYPE.Single\"\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <clr-radio-wrapper>\n          <input\n            tabindex=\"-1\"\n            type=\"radio\"\n            clrRadio\n            clrDgSingleSelectionRadio\n            [clrDgItemsTrackBy]=\"trackBy\"\n            [id]=\"radioId\"\n            [name]=\"selection.id + '-radio'\"\n            [value]=\"item\"\n            [(ngModel)]=\"selection.currentSingle\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <label class=\"clr-control-label clr-col-null\" [for]=\"radioId\">\n            <span class=\"clr-sr-only\">{{ clrDgRowSelectionLabel || commonStrings.keys.select }}</span>\n          </label>\n        </clr-radio-wrapper>\n      </div>\n      <div\n        *ngIf=\"rowActionService.hasActionableRow\"\n        class=\"datagrid-row-actions datagrid-fixed-column datagrid-cell\"\n        role=\"gridcell\"\n      >\n        <ng-content select=\"clr-dg-action-overflow\"></ng-content>\n      </div>\n      <div\n        *ngIf=\"globalExpandable.hasExpandableRow\"\n        class=\"datagrid-expandable-caret datagrid-fixed-column datagrid-cell\"\n        role=\"gridcell\"\n      >\n        <ng-container *ngIf=\"expand.expandable\">\n          <button\n            tabindex=\"-1\"\n            *ngIf=\"!expand.loading\"\n            (click)=\"toggleExpand()\"\n            type=\"button\"\n            class=\"datagrid-expandable-caret-button\"\n            [attr.aria-expanded]=\"expand.expanded\"\n            [attr.aria-label]=\"expand.expanded ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n            [attr.aria-controls]=\"expand.hasExpandTemplate && !expand.expanded ? null : expandableId\"\n          >\n            <cds-icon\n              shape=\"angle\"\n              class=\"datagrid-expandable-caret-icon\"\n              [attr.direction]=\"expand.expanded ? 'down' : 'right'\"\n              [attr.title]=\"expand.expanded ? commonStrings.keys.collapse : commonStrings.keys.expand\"\n            ></cds-icon>\n          </button>\n          <clr-spinner *ngIf=\"expand.loading\" clrSmall>{{ commonStrings.keys.loading }}</clr-spinner>\n        </ng-container>\n      </div>\n      <div\n        *ngIf=\"detailService.enabled\"\n        class=\"datagrid-detail-caret datagrid-fixed-column datagrid-cell\"\n        role=\"gridcell\"\n      >\n        <button\n          tabindex=\"-1\"\n          (click)=\"detailService.toggle(item, detailButton)\"\n          type=\"button\"\n          #detailButton\n          class=\"datagrid-detail-caret-button\"\n          [disabled]=\"detailDisabled\"\n          *ngIf=\"!detailHidden\"\n          [class.is-open]=\"detailService.isRowOpen(item)\"\n          [attr.aria-label]=\"detailService.isRowOpen(item) ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n          [attr.aria-expanded]=\"detailService.isRowOpen(item)\"\n          [attr.aria-controls]=\"detailService.id\"\n          aria-haspopup=\"dialog\"\n        >\n          <cds-icon\n            shape=\"angle-double\"\n            [attr.direction]=\"detailService.isRowOpen(item) ? 'left' : 'right'\"\n            class=\"datagrid-detail-caret-icon\"\n            [attr.title]=\"detailService.isRowOpen(item) ? commonStrings.keys.close: commonStrings.keys.open\"\n          ></cds-icon>\n        </button>\n      </div>\n    </ng-container>\n    <!-- placeholder for projecting other sticky cells as pinned-->\n  </div>\n  <div class=\"datagrid-row-scrollable\" [ngClass]=\"{'is-replaced': replaced && expanded}\">\n    <div class=\"datagrid-scrolling-cells\">\n      <ng-content select=\"clr-dg-cell\"></ng-content>\n      <ng-container #scrollableCells></ng-container>\n    </div>\n    <!-- details here when replace, re-visit when sticky container is used for pinned cells -->\n    <ng-template *ngIf=\"replaced && !expand.loading\" [ngTemplateOutlet]=\"detail\"></ng-template>\n    <ng-template *ngIf=\"!replaced && !expand.loading\" [ngTemplateOutlet]=\"detail\"></ng-template>\n  </div>\n</div>\n<!--\n    We need the \"project into template\" hacks because we need this in 2 different places\n    depending on whether the details replace the row or not.\n-->\n<ng-template #detail>\n  <ng-content select=\"clr-dg-row-detail\"></ng-content>\n</ng-template>\n\n<ng-container #calculatedCells></ng-container>\n\n<ng-template #fixedCellTemplate>\n  <div class=\"datagrid-fixed-column datagrid-cell\" role=\"gridcell\"></div>\n</ng-template>\n" }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtcm93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC1yb3cudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2RhdGFncmlkLXJvdy5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFHTCxTQUFTLEVBQ1QsZUFBZSxFQUVmLFlBQVksRUFDWixNQUFNLEVBRU4sS0FBSyxFQUNMLE1BQU0sRUFJTixTQUFTLEVBQ1QsZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUVsRSxPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSw0RUFBNEUsQ0FBQztBQUM3SCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDOUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBRXJFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDekUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBT3ZELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRTNDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQWtCZCxNQUFN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eEIsa0JBQWtCO3NCQUFqRCxTQUFTO3VCQUFDLG1CQUFtQjtnQkFxRDFCLElBQUk7c0JBRFAsS0FBSzt1QkFBQyxXQUFXO2dCQVdkLGVBQWU7c0JBRGxCLEtBQUs7dUJBQUMsaUJBQWlCO2dCQWdCcEIsUUFBUTtzQkFEWCxLQUFLO3VCQUFDLGVBQWU7Z0JBc0JsQixRQUFRO3NCQURYLEtBQUs7dUJBQUMsZUFBZTtnQkFTbEIsb0JBQW9CO3NCQUR2QixLQUFLO2dCQVNGLHFCQUFxQjtzQkFEeEIsS0FBSztnQkFVRixzQkFBc0I7c0JBRHpCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgUmVuZGVyZXIyLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGNvbWJpbmVMYXRlc3QsIFJlcGxheVN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDbHJFeHBhbmRhYmxlQW5pbWF0aW9uRGlyZWN0aXZlIH0gZnJvbSAnLi4vLi4vdXRpbHMvYW5pbWF0aW9ucy9leHBhbmRhYmxlLWFuaW1hdGlvbi9leHBhbmRhYmxlLWFuaW1hdGlvbi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSWZFeHBhbmRTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvY29uZGl0aW9uYWwvaWYtZXhwYW5kZWQuc2VydmljZSc7XG5pbXBvcnQgeyBIb3N0V3JhcHBlciB9IGZyb20gJy4uLy4uL3V0aWxzL2hvc3Qtd3JhcHBpbmcvaG9zdC13cmFwcGVyJztcbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IExvYWRpbmdMaXN0ZW5lciB9IGZyb20gJy4uLy4uL3V0aWxzL2xvYWRpbmcvbG9hZGluZy1saXN0ZW5lcic7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZENlbGwgfSBmcm9tICcuL2RhdGFncmlkLWNlbGwnO1xuaW1wb3J0IHsgRGF0YWdyaWRJZkV4cGFuZFNlcnZpY2UgfSBmcm9tICcuL2RhdGFncmlkLWlmLWV4cGFuZGVkLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGF0YWdyaWREaXNwbGF5TW9kZSB9IGZyb20gJy4vZW51bXMvZGlzcGxheS1tb2RlLmVudW0nO1xuaW1wb3J0IHsgU2VsZWN0aW9uVHlwZSB9IGZyb20gJy4vZW51bXMvc2VsZWN0aW9uLXR5cGUnO1xuaW1wb3J0IHsgRGV0YWlsU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2RldGFpbC5zZXJ2aWNlJztcbmltcG9ydCB7IERpc3BsYXlNb2RlU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2Rpc3BsYXktbW9kZS5zZXJ2aWNlJztcbmltcG9ydCB7IEV4cGFuZGFibGVSb3dzQ291bnQgfSBmcm9tICcuL3Byb3ZpZGVycy9nbG9iYWwtZXhwYW5kYWJsZS1yb3dzJztcbmltcG9ydCB7IEl0ZW1zIH0gZnJvbSAnLi9wcm92aWRlcnMvaXRlbXMnO1xuaW1wb3J0IHsgUm93QWN0aW9uU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3Jvdy1hY3Rpb24tc2VydmljZSc7XG5pbXBvcnQgeyBTZWxlY3Rpb24gfSBmcm9tICcuL3Byb3ZpZGVycy9zZWxlY3Rpb24nO1xuaW1wb3J0IHsgV3JhcHBlZFJvdyB9IGZyb20gJy4vd3JhcHBlZC1yb3cnO1xuXG5sZXQgbmJSb3cgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZGctcm93JyxcbiAgdGVtcGxhdGVVcmw6ICcuL2RhdGFncmlkLXJvdy5odG1sJyxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuZGF0YWdyaWQtcm93XSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLmRhdGFncmlkLXJvdy1za2VsZXRvbl0nOiAnc2tlbGV0b25Mb2FkaW5nJyxcbiAgICAnW2NsYXNzLmRhdGFncmlkLXNlbGVjdGVkXSc6ICdzZWxlY3RlZCcsXG4gICAgJ1thdHRyLmFyaWEtb3duc10nOiAnaWQnLFxuICAgIHJvbGU6ICdyb3dncm91cCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIERhdGFncmlkSWZFeHBhbmRTZXJ2aWNlLFxuICAgIHsgcHJvdmlkZTogSWZFeHBhbmRTZXJ2aWNlLCB1c2VFeGlzdGluZzogRGF0YWdyaWRJZkV4cGFuZFNlcnZpY2UgfSxcbiAgICB7IHByb3ZpZGU6IExvYWRpbmdMaXN0ZW5lciwgdXNlRXhpc3Rpbmc6IERhdGFncmlkSWZFeHBhbmRTZXJ2aWNlIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIENsckRhdGFncmlkUm93PFQgPSBhbnk+IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBPdXRwdXQoJ2NsckRnU2VsZWN0ZWRDaGFuZ2UnKSBzZWxlY3RlZENoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KGZhbHNlKTtcbiAgQE91dHB1dCgnY2xyRGdFeHBhbmRlZENoYW5nZScpIGV4cGFuZGVkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPihmYWxzZSk7XG4gIEBJbnB1dCgnY2xyRGdEZXRhaWxEaXNhYmxlZCcpIGRldGFpbERpc2FibGVkID0gZmFsc2U7XG4gIEBJbnB1dCgnY2xyRGdEZXRhaWxIaWRkZW4nKSBkZXRhaWxIaWRkZW4gPSBmYWxzZTtcbiAgQElucHV0KCdjbHJEZ1NrZWxldG9uTG9hZGluZycpIHNrZWxldG9uTG9hZGluZyA9IGZhbHNlO1xuXG4gIGlkOiBzdHJpbmc7XG4gIHJhZGlvSWQ6IHN0cmluZztcbiAgY2hlY2tib3hJZDogc3RyaW5nO1xuICBleHBhbmRhYmxlSWQ6IHN0cmluZztcbiAgcmVwbGFjZWQ6IGJvb2xlYW47XG4gIGRpc3BsYXlDZWxscyA9IGZhbHNlO1xuICBleHBhbmRBbmltYXRpb25UcmlnZ2VyID0gZmFsc2U7XG5cbiAgLyogcmVmZXJlbmNlIHRvIHRoZSBlbnVtIHNvIHRoYXQgdGVtcGxhdGUgY2FuIGFjY2VzcyAqL1xuICBTRUxFQ1RJT05fVFlQRSA9IFNlbGVjdGlvblR5cGU7XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgaXRlbUNoYW5nZXMgPSBuZXcgUmVwbGF5U3ViamVjdDxUPigxKTtcblxuICAvKioqKipcbiAgICogcHJvcGVydHkgZGdDZWxsc1xuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQSBRdWVyeSBMaXN0IG9mIHRoZSBDbHJEYXRhZ3JpZCBjZWxscyBpbiB0aGlzIHJvdy5cbiAgICpcbiAgICovXG4gIEBDb250ZW50Q2hpbGRyZW4oQ2xyRGF0YWdyaWRDZWxsKSBkZ0NlbGxzOiBRdWVyeUxpc3Q8Q2xyRGF0YWdyaWRDZWxsPjtcblxuICBAVmlld0NoaWxkKENsckV4cGFuZGFibGVBbmltYXRpb25EaXJlY3RpdmUpIGV4cGFuZEFuaW1hdGlvbjogQ2xyRXhwYW5kYWJsZUFuaW1hdGlvbkRpcmVjdGl2ZTtcbiAgQFZpZXdDaGlsZCgnZGV0YWlsQnV0dG9uJykgZGV0YWlsQnV0dG9uOiBFbGVtZW50UmVmPEhUTUxCdXR0b25FbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgnc3RpY2t5Q2VsbHMnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSkgX3N0aWNreUNlbGxzOiBWaWV3Q29udGFpbmVyUmVmO1xuICBAVmlld0NoaWxkKCdzY3JvbGxhYmxlQ2VsbHMnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSkgX3Njcm9sbGFibGVDZWxsczogVmlld0NvbnRhaW5lclJlZjtcbiAgQFZpZXdDaGlsZCgnY2FsY3VsYXRlZENlbGxzJywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmIH0pIF9jYWxjdWxhdGVkQ2VsbHM6IFZpZXdDb250YWluZXJSZWY7XG4gIEBWaWV3Q2hpbGQoJ2ZpeGVkQ2VsbFRlbXBsYXRlJykgX2ZpeGVkQ2VsbFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIHByaXZhdGUgX2l0ZW06IFQ7XG4gIHByaXZhdGUgX3NlbGVjdGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX2RldGFpbE9wZW5MYWJlbCA9ICcnO1xuICBwcml2YXRlIF9kZXRhaWxDbG9zZUxhYmVsID0gJyc7XG4gIHByaXZhdGUgX3Jvd1NlbGVjdGlvbkxhYmVsID0gJyc7XG4gIHByaXZhdGUgd3JhcHBlZEluamVjdG9yOiBJbmplY3RvcjtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIC8vIEJ5IGRlZmF1bHQsIGV2ZXJ5IGl0ZW0gaXMgc2VsZWN0YWJsZTsgaXQgYmVjb21lcyBub3Qgc2VsZWN0YWJsZSBvbmx5IGlmIGl0J3MgZXhwbGljaXRseSBzZXQgdG8gZmFsc2VcbiAgcHJpdmF0ZSBfc2VsZWN0YWJsZTogYm9vbGVhbiB8IHN0cmluZyA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHNlbGVjdGlvbjogU2VsZWN0aW9uPFQ+LFxuICAgIHB1YmxpYyByb3dBY3Rpb25TZXJ2aWNlOiBSb3dBY3Rpb25TZXJ2aWNlLFxuICAgIHB1YmxpYyBnbG9iYWxFeHBhbmRhYmxlOiBFeHBhbmRhYmxlUm93c0NvdW50LFxuICAgIHB1YmxpYyBleHBhbmQ6IERhdGFncmlkSWZFeHBhbmRTZXJ2aWNlLFxuICAgIHB1YmxpYyBkZXRhaWxTZXJ2aWNlOiBEZXRhaWxTZXJ2aWNlLFxuICAgIHByaXZhdGUgZGlzcGxheU1vZGU6IERpc3BsYXlNb2RlU2VydmljZSxcbiAgICBwcml2YXRlIHZjcjogVmlld0NvbnRhaW5lclJlZixcbiAgICByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHVibGljIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlLFxuICAgIHByaXZhdGUgaXRlbXM6IEl0ZW1zLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueVxuICApIHtcbiAgICBuYlJvdysrO1xuICAgIHRoaXMuaWQgPSAnY2xyLWRnLXJvdycgKyBuYlJvdztcbiAgICB0aGlzLnJhZGlvSWQgPSAnY2xyLWRnLXJvdy1yZCcgKyBuYlJvdztcbiAgICB0aGlzLmNoZWNrYm94SWQgPSAnY2xyLWRnLXJvdy1jYicgKyBuYlJvdztcbiAgICB0aGlzLmV4cGFuZGFibGVJZCA9IGV4cGFuZC5leHBhbmRhYmxlSWQ7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIGNvbWJpbmVMYXRlc3QoZXhwYW5kLnJlcGxhY2UsIGV4cGFuZC5leHBhbmRDaGFuZ2UpLnN1YnNjcmliZSgoW2V4cGFuZFJlcGxhY2VWYWx1ZSwgZXhwYW5kQ2hhbmdlVmFsdWVdKSA9PiB7XG4gICAgICAgIGlmIChleHBhbmRSZXBsYWNlVmFsdWUgJiYgZXhwYW5kQ2hhbmdlVmFsdWUpIHtcbiAgICAgICAgICAvLyByZXBsYWNlZCBhbmQgZXhwYW5kaW5nXG4gICAgICAgICAgdGhpcy5yZXBsYWNlZCA9IHRydWU7XG4gICAgICAgICAgcmVuZGVyZXIuYWRkQ2xhc3MoZWwubmF0aXZlRWxlbWVudCwgJ2RhdGFncmlkLXJvdy1yZXBsYWNlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmVwbGFjZWQgPSBmYWxzZTtcbiAgICAgICAgICAvLyBIYW5kbGVzIHRoZXNlIGNhc2VzOiBub3QgcmVwbGFjZWQgYW5kIGNvbGxhcHNpbmcgJiByZXBsYWNlZCBhbmRcbiAgICAgICAgICAvLyBjb2xsYXBzaW5nIGFuZCBub3QgcmVwbGFjZWQgYW5kIGV4cGFuZGluZy5cbiAgICAgICAgICByZW5kZXJlci5yZW1vdmVDbGFzcyhlbC5uYXRpdmVFbGVtZW50LCAnZGF0YWdyaWQtcm93LXJlcGxhY2VkJyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb2RlbCBvZiB0aGUgcm93LCB0byB1c2UgZm9yIHNlbGVjdGlvblxuICAgKi9cbiAgQElucHV0KCdjbHJEZ0l0ZW0nKVxuICBnZXQgaXRlbSgpOiBUIHtcbiAgICByZXR1cm4gdGhpcy5faXRlbTtcbiAgfVxuICBzZXQgaXRlbShpdGVtOiBUKSB7XG4gICAgdGhpcy5faXRlbSA9IGl0ZW07XG4gICAgdGhpcy5pdGVtQ2hhbmdlcy5uZXh0KGl0ZW0pO1xuICAgIHRoaXMuY2xyRGdTZWxlY3RhYmxlID0gdGhpcy5fc2VsZWN0YWJsZTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyRGdTZWxlY3RhYmxlJylcbiAgZ2V0IGNsckRnU2VsZWN0YWJsZSgpIHtcbiAgICByZXR1cm4gIXRoaXMuc2VsZWN0aW9uLmlzTG9ja2VkKHRoaXMuaXRlbSk7XG4gIH1cbiAgc2V0IGNsckRnU2VsZWN0YWJsZSh2YWx1ZTogYm9vbGVhbiB8IHN0cmluZykge1xuICAgIGlmICh0aGlzLml0ZW0pIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uLmxvY2tJdGVtKHRoaXMuaXRlbSwgdmFsdWUgPT09ICdmYWxzZScgfHwgdmFsdWUgPT09IGZhbHNlKTtcbiAgICB9XG4gICAgLy8gU3RvcmUgdGhpcyB2YWx1ZSBsb2NhbGx5LCB0byBiZSBpbml0aWFsaXplZCB3aGVuIGl0ZW0gaXMgaW5pdGlhbGl6ZWRcbiAgICB0aGlzLl9zZWxlY3RhYmxlID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIHRoZSByb3cgaXMgc2VsZWN0ZWRcbiAgICovXG4gIEBJbnB1dCgnY2xyRGdTZWxlY3RlZCcpXG4gIGdldCBzZWxlY3RlZCgpIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5Ob25lKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbi5pc1NlbGVjdGVkKHRoaXMuaXRlbSk7XG4gICAgfVxuICB9XG4gIHNldCBzZWxlY3RlZCh2YWx1ZTogYm9vbGVhbiB8IHN0cmluZykge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLk5vbmUpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gdmFsdWUgYXMgYm9vbGVhbjtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHZhbHVlICYmIHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuTXVsdGkpIHtcbiAgICAgICAgdGhpcy5yYW5nZVNlbGVjdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb24ucmFuZ2VTdGFydCA9IG51bGw7XG4gICAgICB9XG4gICAgICB0aGlzLnNlbGVjdGlvbi5zZXRTZWxlY3RlZCh0aGlzLml0ZW0sIHZhbHVlIGFzIGJvb2xlYW4pO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgnY2xyRGdFeHBhbmRlZCcpXG4gIGdldCBleHBhbmRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5leHBhbmQuZXhwYW5kZWQ7XG4gIH1cbiAgc2V0IGV4cGFuZGVkKHZhbHVlOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgdGhpcy5leHBhbmQuZXhwYW5kZWQgPSB2YWx1ZSBhcyBib29sZWFuO1xuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IGNsckRnRGV0YWlsT3BlbkxhYmVsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2RldGFpbE9wZW5MYWJlbCA/IHRoaXMuX2RldGFpbE9wZW5MYWJlbCA6IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLm9wZW47XG4gIH1cbiAgc2V0IGNsckRnRGV0YWlsT3BlbkxhYmVsKGxhYmVsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9kZXRhaWxPcGVuTGFiZWwgPSBsYWJlbDtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBjbHJEZ0RldGFpbENsb3NlTGFiZWwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZGV0YWlsQ2xvc2VMYWJlbCA/IHRoaXMuX2RldGFpbENsb3NlTGFiZWwgOiB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5jbG9zZTtcbiAgfVxuICBzZXQgY2xyRGdEZXRhaWxDbG9zZUxhYmVsKGxhYmVsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9kZXRhaWxDbG9zZUxhYmVsID0gbGFiZWw7XG4gIH1cblxuICAvLyBDREUtMTUxOiBSZW5hbWUgdGhpcyBmaWVsZCB0byBjbHJEZ1Jvd1NlbGVjdGlvbkxhYmVsIGluIHYxNlxuICBASW5wdXQoKVxuICBnZXQgY2xyRGdSb3dTZWxlY3Rpb25MYWJlbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9yb3dTZWxlY3Rpb25MYWJlbCA/IHRoaXMuX3Jvd1NlbGVjdGlvbkxhYmVsIDogdGhpcy5jb21tb25TdHJpbmdzLmtleXMuc2VsZWN0O1xuICB9XG4gIHNldCBjbHJEZ1Jvd1NlbGVjdGlvbkxhYmVsKGxhYmVsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9yb3dTZWxlY3Rpb25MYWJlbCA9IGxhYmVsO1xuICB9XG5cbiAgZ2V0IF92aWV3KCkge1xuICAgIHJldHVybiB0aGlzLndyYXBwZWRJbmplY3Rvci5nZXQoV3JhcHBlZFJvdywgdGhpcy52Y3IpLnJvd1ZpZXc7XG4gIH1cblxuICBnZXQgdHJhY2tCeSgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcy50cmFja0J5O1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy53cmFwcGVkSW5qZWN0b3IgPSBuZXcgSG9zdFdyYXBwZXIoV3JhcHBlZFJvdywgdGhpcy52Y3IpO1xuICAgIHRoaXMuc2VsZWN0aW9uLmxvY2tJdGVtKHRoaXMuaXRlbSwgdGhpcy5jbHJEZ1NlbGVjdGFibGUgPT09IGZhbHNlKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLmRnQ2VsbHMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5kZ0NlbGxzLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgIGlmICghY2VsbC5fdmlldy5kZXN0cm95ZWQpIHtcbiAgICAgICAgICB0aGlzLl9zY3JvbGxhYmxlQ2VsbHMuaW5zZXJ0KGNlbGwuX3ZpZXcpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHRoaXMuZGlzcGxheU1vZGUudmlldy5zdWJzY3JpYmUodmlld0NoYW5nZSA9PiB7XG4gICAgICAgIC8vIExpc3RlbiBmb3IgdmlldyBjaGFuZ2VzIGFuZCBtb3ZlIGNlbGxzIGFyb3VuZCBkZXBlbmRpbmcgb24gdGhlIGN1cnJlbnQgZGlzcGxheVR5cGVcbiAgICAgICAgLy8gcmVtb3ZlIGNlbGwgdmlld3MgZnJvbSBkaXNwbGF5IHZpZXdcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX3Njcm9sbGFibGVDZWxscy5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICB0aGlzLl9zY3JvbGxhYmxlQ2VsbHMuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVtb3ZlIGNlbGwgdmlld3MgZnJvbSBjYWxjdWxhdGVkIHZpZXdcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX2NhbGN1bGF0ZWRDZWxscy5sZW5ndGg7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVkQ2VsbHMuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZpZXdDaGFuZ2UgPT09IERhdGFncmlkRGlzcGxheU1vZGUuQ0FMQ1VMQVRFKSB7XG4gICAgICAgICAgdGhpcy5kaXNwbGF5Q2VsbHMgPSBmYWxzZTtcbiAgICAgICAgICAvLyBJbnNlcnRzIGEgZml4ZWQgY2VsbCBpZiBhbnkgb2YgdGhlc2UgY29uZGl0aW9ucyBhcmUgdHJ1ZS5cbiAgICAgICAgICBjb25zdCBmaXhlZENlbGxDb25kaXRpb25zID0gW1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSAhPT0gdGhpcy5TRUxFQ1RJT05fVFlQRS5Ob25lLFxuICAgICAgICAgICAgdGhpcy5yb3dBY3Rpb25TZXJ2aWNlLmhhc0FjdGlvbmFibGVSb3csXG4gICAgICAgICAgICB0aGlzLmdsb2JhbEV4cGFuZGFibGUuaGFzRXhwYW5kYWJsZVJvdyxcbiAgICAgICAgICAgIHRoaXMuZGV0YWlsU2VydmljZS5lbmFibGVkLFxuICAgICAgICAgIF07XG4gICAgICAgICAgZml4ZWRDZWxsQ29uZGl0aW9uc1xuICAgICAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAgICAgLmZvckVhY2goKCkgPT4gdGhpcy5fY2FsY3VsYXRlZENlbGxzLmluc2VydCh0aGlzLl9maXhlZENlbGxUZW1wbGF0ZS5jcmVhdGVFbWJlZGRlZFZpZXcobnVsbCkpKTtcbiAgICAgICAgICB0aGlzLmRnQ2VsbHMuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgIGlmICghY2VsbC5fdmlldy5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlZENlbGxzLmluc2VydChjZWxsLl92aWV3KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRpc3BsYXlDZWxscyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5kZ0NlbGxzLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICBpZiAoIWNlbGwuX3ZpZXcuZGVzdHJveWVkKSB7XG4gICAgICAgICAgICAgIHRoaXMuX3Njcm9sbGFibGVDZWxscy5pbnNlcnQoY2VsbC5fdmlldyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5leHBhbmQuYW5pbWF0ZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLmV4cGFuZEFuaW1hdGlvblRyaWdnZXIgPSAhdGhpcy5leHBhbmRBbmltYXRpb25UcmlnZ2VyO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmZvckVhY2goKHN1YjogU3Vic2NyaXB0aW9uKSA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICB0b2dnbGUoc2VsZWN0ZWQgPSAhdGhpcy5zZWxlY3RlZCkge1xuICAgIGlmIChzZWxlY3RlZCAhPT0gdGhpcy5zZWxlY3RlZCkge1xuICAgICAgdGhpcy5zZWxlY3RlZCA9IHNlbGVjdGVkO1xuICAgICAgdGhpcy5zZWxlY3RlZENoYW5nZWQuZW1pdChzZWxlY3RlZCk7XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlRXhwYW5kKCkge1xuICAgIGlmICh0aGlzLmV4cGFuZC5leHBhbmRhYmxlKSB7XG4gICAgICB0aGlzLmV4cGFuZEFuaW1hdGlvbi51cGRhdGVTdGFydEhlaWdodCgpO1xuICAgICAgdGhpcy5leHBhbmRlZCA9ICF0aGlzLmV4cGFuZGVkO1xuICAgICAgdGhpcy5leHBhbmRlZENoYW5nZS5lbWl0KHRoaXMuZXhwYW5kZWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZGVmYXVsdCBiZWhhdmlvciBpbiBDaHJvbWUgYW5kIEZpcmVmb3ggZm9yIHNoaWZ0LWNsaWNraW5nIG9uIGEgbGFiZWwgaXMgdG8gcGVyZm9ybSB0ZXh0LXNlbGVjdGlvbi5cbiAgICogVGhpcyBwcmV2ZW50cyBvdXIgaW50ZW5kZWQgcmFuZ2Utc2VsZWN0aW9uLCBiZWNhdXNlIHRoaXMgdGV4dC1zZWxlY3Rpb24gb3ZlcnJpZGVzIG91ciBzaGlmdC1jbGljayBldmVudC5cbiAgICogV2UgbmVlZCB0byBjbGVhciB0aGUgc3RvcmVkIHNlbGVjdGlvbiByYW5nZSB3aGVuIHNoaWZ0LWNsaWNraW5nLiBUaGlzIHdpbGwgb3ZlcnJpZGUgdGhlIG1vc3RseSB1bnVzZWQgc2hpZnQtY2xpY2tcbiAgICogc2VsZWN0aW9uIGJyb3dzZXIgZnVuY3Rpb25hbGl0eSwgd2hpY2ggaXMgaW5jb25zaXN0ZW50bHkgaW1wbGVtZW50ZWQgaW4gYnJvd3NlcnMgYW55d2F5LlxuICAgKi9cbiAgY2xlYXJSYW5nZXMoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb24ucm93U2VsZWN0aW9uTW9kZSAmJiBldmVudC5zaGlmdEtleSkge1xuICAgICAgdGhpcy5kb2N1bWVudC5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgIC8vIEZpcmVmb3ggaXMgdG9vIHBlcnNpc3RlbnQgYWJvdXQgaXRzIHRleHQtc2VsZWN0aW9uIGJlaGF2aW91ci4gU28gd2UgbmVlZCB0byBhZGQgYSBwcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgLy8gV2Ugc2hvdWxkIG5vdCB0cnkgdG8gZW5mb3JjZSB0aGlzIG9uIHRoZSBvdGhlciBicm93c2VycywgdGhvdWdoLCBiZWNhdXNlIHRoZWlyIHRvZ2dsZSBjeWNsZSBkb2VzIG5vdCBnZXQgY2FuY2VsZWQgYnlcbiAgICAgIC8vIHRoZSBwcmV2ZW50RGVmYXVsdCgpIGFuZCB0aGV5IHRvZ2dsZSB0aGUgY2hlY2tib3ggc2Vjb25kIHRpbWUsIGVmZmVjdGl2ZWx5IHJldHJ1cm5pbmcgaXQgdG8gbm90LXNlbGVjdGVkLlxuICAgICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0ZpcmVmb3gnKSAhPT0gLTEpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy50b2dnbGUodHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIHJlbGF0ZWQgdG8gY2xyRGdSb3dTZWxlY3Rpb24sIHdoaWNoIGlzIGRlcHJlY2F0ZWRcbiAgICovXG4gIHByb3RlY3RlZCBzZWxlY3RSb3coc2VsZWN0ZWQgPSAhdGhpcy5zZWxlY3RlZCwgJGV2ZW50KSB7XG4gICAgLy8gVGhlIGxhYmVsIGFsc28gY2FwdHVyZXMgY2xpY2tzIHRoYXQgYnViYmxlIHVwIHRvIHRoZSByb3cgZXZlbnQgbGlzdGVuZXIsIGNhdXNpbmdcbiAgICAvLyB0aGlzIGhhbmRsZXIgdG8gcnVuIHR3aWNlLiBUaGlzIGV4aXRzIGVhcmx5IHRvIHByZXZlbnQgdG9nZ2xpbmcgdGhlIGNoZWNrYm94IHR3aWNlLlxuICAgIGlmICghdGhpcy5zZWxlY3Rpb24ucm93U2VsZWN0aW9uTW9kZSB8fCAkZXZlbnQudGFyZ2V0LnRhZ05hbWUgPT09ICdMQUJFTCcgfHwgIXRoaXMuX3NlbGVjdGFibGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IHRoaXMuU0VMRUNUSU9OX1RZUEUuU2luZ2xlKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbi5jdXJyZW50U2luZ2xlID0gdGhpcy5pdGVtO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRvZ2dsZShzZWxlY3RlZCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByYW5nZVNlbGVjdCgpIHtcbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuaXRlbXMuZGlzcGxheWVkO1xuICAgIGlmICghaXRlbXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc3RhcnRJeCA9IGl0ZW1zLmluZGV4T2YodGhpcy5zZWxlY3Rpb24ucmFuZ2VTdGFydCk7XG4gICAgaWYgKFxuICAgICAgdGhpcy5zZWxlY3Rpb24ucmFuZ2VTdGFydCAmJlxuICAgICAgdGhpcy5zZWxlY3Rpb24uY3VycmVudC5pbmNsdWRlcyh0aGlzLnNlbGVjdGlvbi5yYW5nZVN0YXJ0KSAmJlxuICAgICAgdGhpcy5zZWxlY3Rpb24uc2hpZnRQcmVzc2VkICYmXG4gICAgICBzdGFydEl4ICE9PSAtMVxuICAgICkge1xuICAgICAgY29uc3QgZW5kSXggPSBpdGVtcy5pbmRleE9mKHRoaXMuaXRlbSk7XG4gICAgICAvLyBVc2luZyBTZXQgdG8gcmVtb3ZlIGR1cGxpY2F0ZXNcbiAgICAgIGNvbnN0IG5ld1NlbGVjdGlvbiA9IG5ldyBTZXQoXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uLmN1cnJlbnQuY29uY2F0KGl0ZW1zLnNsaWNlKE1hdGgubWluKHN0YXJ0SXgsIGVuZEl4KSwgTWF0aC5tYXgoc3RhcnRJeCwgZW5kSXgpICsgMSkpXG4gICAgICApO1xuICAgICAgdGhpcy5zZWxlY3Rpb24uY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgIHRoaXMuc2VsZWN0aW9uLmN1cnJlbnQucHVzaCguLi5uZXdTZWxlY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBwYWdlIG51bWJlciBoYXMgY2hhbmdlZCBvclxuICAgICAgLy8gbm8gU2hpZnQgd2FzIHByZXNzZWQgb3JcbiAgICAgIC8vIHJhbmdlU3RhcnQgbm90IHlldCBzZXRcbiAgICAgIHRoaXMuc2VsZWN0aW9uLnJhbmdlU3RhcnQgPSB0aGlzLml0ZW07XG4gICAgfVxuICB9XG59XG4iLCI8ZGl2XG4gIHJvbGU9XCJyb3dcIlxuICBbaWRdPVwiaWRcIlxuICBjbGFzcz1cImRhdGFncmlkLXJvdy1tYXN0ZXIgZGF0YWdyaWQtcm93LWZsZXhcIlxuICBbY2xyRXhwYW5kYWJsZUFuaW1hdGlvbl09XCJleHBhbmRBbmltYXRpb25UcmlnZ2VyXCJcbiAgKG1vdXNlZG93bik9XCJjbGVhclJhbmdlcygkZXZlbnQpXCJcbiAgKGNsaWNrKT1cInNlbGVjdFJvdyghc2VsZWN0ZWQsICRldmVudClcIlxuICBbY2xhc3MuZGF0YWdyaWQtcm93LWNsaWNrYWJsZV09XCJzZWxlY3Rpb24ucm93U2VsZWN0aW9uTW9kZVwiXG4gIFtjbGFzcy5kYXRhZ3JpZC1yb3ctZGV0YWlsLW9wZW5dPVwiZGV0YWlsU2VydmljZS5pc1Jvd09wZW4oaXRlbSlcIlxuPlxuICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtcm93LXN0aWNreVwiPlxuICAgIDwhLS0gU3RpY2t5IGVsZW1lbnRzIGhlcmUgLS0+XG4gICAgPG5nLWNvbnRhaW5lciAjc3RpY2t5Q2VsbHM+XG4gICAgICA8ZGl2XG4gICAgICAgICpuZ0lmPVwic2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNFTEVDVElPTl9UWVBFLk11bHRpXCJcbiAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1zZWxlY3QgZGF0YWdyaWQtZml4ZWQtY29sdW1uIGRhdGFncmlkLWNlbGxcIlxuICAgICAgICBbbmdDbGFzc109XCJ7ICdjbHItZm9ybS1jb250cm9sLWRpc2FibGVkJzogIWNsckRnU2VsZWN0YWJsZSB9XCJcbiAgICAgICAgcm9sZT1cImdyaWRjZWxsXCJcbiAgICAgID5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNsci1jaGVja2JveC13cmFwcGVyXCI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICBbbmdNb2RlbF09XCJzZWxlY3RlZFwiXG4gICAgICAgICAgICAobmdNb2RlbENoYW5nZSk9XCJ0b2dnbGUoJGV2ZW50KVwiXG4gICAgICAgICAgICBbaWRdPVwiY2hlY2tib3hJZFwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiY2xyRGdTZWxlY3RhYmxlID8gbnVsbCA6IHRydWVcIlxuICAgICAgICAgICAgW2F0dHIuYXJpYS1kaXNhYmxlZF09XCJjbHJEZ1NlbGVjdGFibGUgPyBudWxsIDogdHJ1ZVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8IS0tIFVzYWdlIG9mIGNsYXNzIGNsci1jb2wtbnVsbCBoZXJlIHByZXZlbnRzIGNsci1jb2wtKiBjbGFzc2VzIGZyb20gYmVpbmcgYWRkZWQgd2hlbiBhIGRhdGFncmlkIGlzIHdyYXBwZWQgaW5zaWRlIGNsckZvcm0gLS0+XG4gICAgICAgICAgPGxhYmVsIFtmb3JdPVwiY2hlY2tib3hJZFwiIGNsYXNzPVwiY2xyLWNvbnRyb2wtbGFiZWwgY2xyLWNvbC1udWxsXCIgKGNsaWNrKT1cImNsZWFyUmFuZ2VzKCRldmVudClcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57e2NsckRnUm93U2VsZWN0aW9uTGFiZWwgfHwgY29tbW9uU3RyaW5ncy5rZXlzLnNlbGVjdH19PC9zcGFuPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2XG4gICAgICAgICpuZ0lmPVwic2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNFTEVDVElPTl9UWVBFLlNpbmdsZVwiXG4gICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtc2VsZWN0IGRhdGFncmlkLWZpeGVkLWNvbHVtbiBkYXRhZ3JpZC1jZWxsXCJcbiAgICAgICAgW25nQ2xhc3NdPVwieyAnY2xyLWZvcm0tY29udHJvbC1kaXNhYmxlZCc6ICFjbHJEZ1NlbGVjdGFibGUgfVwiXG4gICAgICAgIHJvbGU9XCJncmlkY2VsbFwiXG4gICAgICA+XG4gICAgICAgIDxjbHItcmFkaW8td3JhcHBlcj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgICAgdHlwZT1cInJhZGlvXCJcbiAgICAgICAgICAgIGNsclJhZGlvXG4gICAgICAgICAgICBjbHJEZ1NpbmdsZVNlbGVjdGlvblJhZGlvXG4gICAgICAgICAgICBbY2xyRGdJdGVtc1RyYWNrQnldPVwidHJhY2tCeVwiXG4gICAgICAgICAgICBbaWRdPVwicmFkaW9JZFwiXG4gICAgICAgICAgICBbbmFtZV09XCJzZWxlY3Rpb24uaWQgKyAnLXJhZGlvJ1wiXG4gICAgICAgICAgICBbdmFsdWVdPVwiaXRlbVwiXG4gICAgICAgICAgICBbKG5nTW9kZWwpXT1cInNlbGVjdGlvbi5jdXJyZW50U2luZ2xlXCJcbiAgICAgICAgICAgIFtkaXNhYmxlZF09XCJjbHJEZ1NlbGVjdGFibGUgPyBudWxsIDogdHJ1ZVwiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWRpc2FibGVkXT1cImNsckRnU2VsZWN0YWJsZSA/IG51bGwgOiB0cnVlXCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNsci1jb250cm9sLWxhYmVsIGNsci1jb2wtbnVsbFwiIFtmb3JdPVwicmFkaW9JZFwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHItc3Itb25seVwiPnt7IGNsckRnUm93U2VsZWN0aW9uTGFiZWwgfHwgY29tbW9uU3RyaW5ncy5rZXlzLnNlbGVjdCB9fTwvc3Bhbj5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Nsci1yYWRpby13cmFwcGVyPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2XG4gICAgICAgICpuZ0lmPVwicm93QWN0aW9uU2VydmljZS5oYXNBY3Rpb25hYmxlUm93XCJcbiAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1yb3ctYWN0aW9ucyBkYXRhZ3JpZC1maXhlZC1jb2x1bW4gZGF0YWdyaWQtY2VsbFwiXG4gICAgICAgIHJvbGU9XCJncmlkY2VsbFwiXG4gICAgICA+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1kZy1hY3Rpb24tb3ZlcmZsb3dcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXZcbiAgICAgICAgKm5nSWY9XCJnbG9iYWxFeHBhbmRhYmxlLmhhc0V4cGFuZGFibGVSb3dcIlxuICAgICAgICBjbGFzcz1cImRhdGFncmlkLWV4cGFuZGFibGUtY2FyZXQgZGF0YWdyaWQtZml4ZWQtY29sdW1uIGRhdGFncmlkLWNlbGxcIlxuICAgICAgICByb2xlPVwiZ3JpZGNlbGxcIlxuICAgICAgPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiZXhwYW5kLmV4cGFuZGFibGVcIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgICAgICAgICpuZ0lmPVwiIWV4cGFuZC5sb2FkaW5nXCJcbiAgICAgICAgICAgIChjbGljayk9XCJ0b2dnbGVFeHBhbmQoKVwiXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtZXhwYW5kYWJsZS1jYXJldC1idXR0b25cIlxuICAgICAgICAgICAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJleHBhbmQuZXhwYW5kZWRcIlxuICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJleHBhbmQuZXhwYW5kZWQgPyBjbHJEZ0RldGFpbENsb3NlTGFiZWwgOiBjbHJEZ0RldGFpbE9wZW5MYWJlbFwiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWNvbnRyb2xzXT1cImV4cGFuZC5oYXNFeHBhbmRUZW1wbGF0ZSAmJiAhZXhwYW5kLmV4cGFuZGVkID8gbnVsbCA6IGV4cGFuZGFibGVJZFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGNkcy1pY29uXG4gICAgICAgICAgICAgIHNoYXBlPVwiYW5nbGVcIlxuICAgICAgICAgICAgICBjbGFzcz1cImRhdGFncmlkLWV4cGFuZGFibGUtY2FyZXQtaWNvblwiXG4gICAgICAgICAgICAgIFthdHRyLmRpcmVjdGlvbl09XCJleHBhbmQuZXhwYW5kZWQgPyAnZG93bicgOiAncmlnaHQnXCJcbiAgICAgICAgICAgICAgW2F0dHIudGl0bGVdPVwiZXhwYW5kLmV4cGFuZGVkID8gY29tbW9uU3RyaW5ncy5rZXlzLmNvbGxhcHNlIDogY29tbW9uU3RyaW5ncy5rZXlzLmV4cGFuZFwiXG4gICAgICAgICAgICA+PC9jZHMtaWNvbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8Y2xyLXNwaW5uZXIgKm5nSWY9XCJleHBhbmQubG9hZGluZ1wiIGNsclNtYWxsPnt7IGNvbW1vblN0cmluZ3Mua2V5cy5sb2FkaW5nIH19PC9jbHItc3Bpbm5lcj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXZcbiAgICAgICAgKm5nSWY9XCJkZXRhaWxTZXJ2aWNlLmVuYWJsZWRcIlxuICAgICAgICBjbGFzcz1cImRhdGFncmlkLWRldGFpbC1jYXJldCBkYXRhZ3JpZC1maXhlZC1jb2x1bW4gZGF0YWdyaWQtY2VsbFwiXG4gICAgICAgIHJvbGU9XCJncmlkY2VsbFwiXG4gICAgICA+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgICAgICAoY2xpY2spPVwiZGV0YWlsU2VydmljZS50b2dnbGUoaXRlbSwgZGV0YWlsQnV0dG9uKVwiXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgI2RldGFpbEJ1dHRvblxuICAgICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtZGV0YWlsLWNhcmV0LWJ1dHRvblwiXG4gICAgICAgICAgW2Rpc2FibGVkXT1cImRldGFpbERpc2FibGVkXCJcbiAgICAgICAgICAqbmdJZj1cIiFkZXRhaWxIaWRkZW5cIlxuICAgICAgICAgIFtjbGFzcy5pcy1vcGVuXT1cImRldGFpbFNlcnZpY2UuaXNSb3dPcGVuKGl0ZW0pXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImRldGFpbFNlcnZpY2UuaXNSb3dPcGVuKGl0ZW0pID8gY2xyRGdEZXRhaWxDbG9zZUxhYmVsIDogY2xyRGdEZXRhaWxPcGVuTGFiZWxcIlxuICAgICAgICAgIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwiZGV0YWlsU2VydmljZS5pc1Jvd09wZW4oaXRlbSlcIlxuICAgICAgICAgIFthdHRyLmFyaWEtY29udHJvbHNdPVwiZGV0YWlsU2VydmljZS5pZFwiXG4gICAgICAgICAgYXJpYS1oYXNwb3B1cD1cImRpYWxvZ1wiXG4gICAgICAgID5cbiAgICAgICAgICA8Y2RzLWljb25cbiAgICAgICAgICAgIHNoYXBlPVwiYW5nbGUtZG91YmxlXCJcbiAgICAgICAgICAgIFthdHRyLmRpcmVjdGlvbl09XCJkZXRhaWxTZXJ2aWNlLmlzUm93T3BlbihpdGVtKSA/ICdsZWZ0JyA6ICdyaWdodCdcIlxuICAgICAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1kZXRhaWwtY2FyZXQtaWNvblwiXG4gICAgICAgICAgICBbYXR0ci50aXRsZV09XCJkZXRhaWxTZXJ2aWNlLmlzUm93T3BlbihpdGVtKSA/IGNvbW1vblN0cmluZ3Mua2V5cy5jbG9zZTogY29tbW9uU3RyaW5ncy5rZXlzLm9wZW5cIlxuICAgICAgICAgID48L2Nkcy1pY29uPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctY29udGFpbmVyPlxuICAgIDwhLS0gcGxhY2Vob2xkZXIgZm9yIHByb2plY3Rpbmcgb3RoZXIgc3RpY2t5IGNlbGxzIGFzIHBpbm5lZC0tPlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cImRhdGFncmlkLXJvdy1zY3JvbGxhYmxlXCIgW25nQ2xhc3NdPVwieydpcy1yZXBsYWNlZCc6IHJlcGxhY2VkICYmIGV4cGFuZGVkfVwiPlxuICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1zY3JvbGxpbmctY2VsbHNcIj5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1kZy1jZWxsXCI+PC9uZy1jb250ZW50PlxuICAgICAgPG5nLWNvbnRhaW5lciAjc2Nyb2xsYWJsZUNlbGxzPjwvbmctY29udGFpbmVyPlxuICAgIDwvZGl2PlxuICAgIDwhLS0gZGV0YWlscyBoZXJlIHdoZW4gcmVwbGFjZSwgcmUtdmlzaXQgd2hlbiBzdGlja3kgY29udGFpbmVyIGlzIHVzZWQgZm9yIHBpbm5lZCBjZWxscyAtLT5cbiAgICA8bmctdGVtcGxhdGUgKm5nSWY9XCJyZXBsYWNlZCAmJiAhZXhwYW5kLmxvYWRpbmdcIiBbbmdUZW1wbGF0ZU91dGxldF09XCJkZXRhaWxcIj48L25nLXRlbXBsYXRlPlxuICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cIiFyZXBsYWNlZCAmJiAhZXhwYW5kLmxvYWRpbmdcIiBbbmdUZW1wbGF0ZU91dGxldF09XCJkZXRhaWxcIj48L25nLXRlbXBsYXRlPlxuICA8L2Rpdj5cbjwvZGl2PlxuPCEtLVxuICAgIFdlIG5lZWQgdGhlIFwicHJvamVjdCBpbnRvIHRlbXBsYXRlXCIgaGFja3MgYmVjYXVzZSB3ZSBuZWVkIHRoaXMgaW4gMiBkaWZmZXJlbnQgcGxhY2VzXG4gICAgZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhlIGRldGFpbHMgcmVwbGFjZSB0aGUgcm93IG9yIG5vdC5cbi0tPlxuPG5nLXRlbXBsYXRlICNkZXRhaWw+XG4gIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1kZy1yb3ctZGV0YWlsXCI+PC9uZy1jb250ZW50PlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLWNvbnRhaW5lciAjY2FsY3VsYXRlZENlbGxzPjwvbmctY29udGFpbmVyPlxuXG48bmctdGVtcGxhdGUgI2ZpeGVkQ2VsbFRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtZml4ZWQtY29sdW1uIGRhdGFncmlkLWNlbGxcIiByb2xlPVwiZ3JpZGNlbGxcIj48L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG4iXX0=
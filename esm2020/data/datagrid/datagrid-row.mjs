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
            this.selection.current = [...newSelection];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtcm93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC1yb3cudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2RhdGFncmlkLXJvdy5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFHTCxTQUFTLEVBQ1QsZUFBZSxFQUVmLFlBQVksRUFDWixNQUFNLEVBRU4sS0FBSyxFQUNMLE1BQU0sRUFJTixTQUFTLEVBQ1QsZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUVsRSxPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSw0RUFBNEUsQ0FBQztBQUM3SCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDOUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBRXJFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDekUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBT3ZELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRTNDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQWtCZCxNQUFN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STtzQkFEUCxLQUFLO3VCQUFDLFdBQVc7Z0JBV2QsZUFBZTtzQkFEbEIsS0FBSzt1QkFBQyxpQkFBaUI7Z0JBZ0JwQixRQUFRO3NCQURYLEtBQUs7dUJBQUMsZUFBZTtnQkFzQmxCLFFBQVE7c0JBRFgsS0FBSzt1QkFBQyxlQUFlO2dCQVNsQixvQkFBb0I7c0JBRHZCLEtBQUs7Z0JBU0YscUJBQXFCO3NCQUR4QixLQUFLO2dCQVVGLHNCQUFzQjtzQkFEekIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBSZW5kZXJlcjIsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY29tYmluZUxhdGVzdCwgUmVwbGF5U3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENsckV4cGFuZGFibGVBbmltYXRpb25EaXJlY3RpdmUgfSBmcm9tICcuLi8uLi91dGlscy9hbmltYXRpb25zL2V4cGFuZGFibGUtYW5pbWF0aW9uL2V4cGFuZGFibGUtYW5pbWF0aW9uLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZkV4cGFuZFNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9jb25kaXRpb25hbC9pZi1leHBhbmRlZC5zZXJ2aWNlJztcbmltcG9ydCB7IEhvc3RXcmFwcGVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvaG9zdC13cmFwcGluZy9ob3N0LXdyYXBwZXInO1xuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgTG9hZGluZ0xpc3RlbmVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvbG9hZGluZy9sb2FkaW5nLWxpc3RlbmVyJztcbmltcG9ydCB7IENsckRhdGFncmlkQ2VsbCB9IGZyb20gJy4vZGF0YWdyaWQtY2VsbCc7XG5pbXBvcnQgeyBEYXRhZ3JpZElmRXhwYW5kU2VydmljZSB9IGZyb20gJy4vZGF0YWdyaWQtaWYtZXhwYW5kZWQuc2VydmljZSc7XG5pbXBvcnQgeyBEYXRhZ3JpZERpc3BsYXlNb2RlIH0gZnJvbSAnLi9lbnVtcy9kaXNwbGF5LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBTZWxlY3Rpb25UeXBlIH0gZnJvbSAnLi9lbnVtcy9zZWxlY3Rpb24tdHlwZSc7XG5pbXBvcnQgeyBEZXRhaWxTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGV0YWlsLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGlzcGxheU1vZGVTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGlzcGxheS1tb2RlLnNlcnZpY2UnO1xuaW1wb3J0IHsgRXhwYW5kYWJsZVJvd3NDb3VudCB9IGZyb20gJy4vcHJvdmlkZXJzL2dsb2JhbC1leHBhbmRhYmxlLXJvd3MnO1xuaW1wb3J0IHsgSXRlbXMgfSBmcm9tICcuL3Byb3ZpZGVycy9pdGVtcyc7XG5pbXBvcnQgeyBSb3dBY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvcm93LWFjdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IFNlbGVjdGlvbiB9IGZyb20gJy4vcHJvdmlkZXJzL3NlbGVjdGlvbic7XG5pbXBvcnQgeyBXcmFwcGVkUm93IH0gZnJvbSAnLi93cmFwcGVkLXJvdyc7XG5cbmxldCBuYlJvdyA9IDA7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1kZy1yb3cnLFxuICB0ZW1wbGF0ZVVybDogJy4vZGF0YWdyaWQtcm93Lmh0bWwnLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5kYXRhZ3JpZC1yb3ddJzogJ3RydWUnLFxuICAgICdbY2xhc3MuZGF0YWdyaWQtcm93LXNrZWxldG9uXSc6ICdza2VsZXRvbkxvYWRpbmcnLFxuICAgICdbY2xhc3MuZGF0YWdyaWQtc2VsZWN0ZWRdJzogJ3NlbGVjdGVkJyxcbiAgICAnW2F0dHIuYXJpYS1vd25zXSc6ICdpZCcsXG4gICAgcm9sZTogJ3Jvd2dyb3VwJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgRGF0YWdyaWRJZkV4cGFuZFNlcnZpY2UsXG4gICAgeyBwcm92aWRlOiBJZkV4cGFuZFNlcnZpY2UsIHVzZUV4aXN0aW5nOiBEYXRhZ3JpZElmRXhwYW5kU2VydmljZSB9LFxuICAgIHsgcHJvdmlkZTogTG9hZGluZ0xpc3RlbmVyLCB1c2VFeGlzdGluZzogRGF0YWdyaWRJZkV4cGFuZFNlcnZpY2UgfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWdyaWRSb3c8VCA9IGFueT4gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0IHtcbiAgQE91dHB1dCgnY2xyRGdTZWxlY3RlZENoYW5nZScpIHNlbGVjdGVkQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oZmFsc2UpO1xuICBAT3V0cHV0KCdjbHJEZ0V4cGFuZGVkQ2hhbmdlJykgZXhwYW5kZWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KGZhbHNlKTtcbiAgQElucHV0KCdjbHJEZ0RldGFpbERpc2FibGVkJykgZGV0YWlsRGlzYWJsZWQgPSBmYWxzZTtcbiAgQElucHV0KCdjbHJEZ0RldGFpbEhpZGRlbicpIGRldGFpbEhpZGRlbiA9IGZhbHNlO1xuICBASW5wdXQoJ2NsckRnU2tlbGV0b25Mb2FkaW5nJykgc2tlbGV0b25Mb2FkaW5nID0gZmFsc2U7XG5cbiAgaWQ6IHN0cmluZztcbiAgcmFkaW9JZDogc3RyaW5nO1xuICBjaGVja2JveElkOiBzdHJpbmc7XG4gIGV4cGFuZGFibGVJZDogc3RyaW5nO1xuICByZXBsYWNlZDogYm9vbGVhbjtcbiAgZGlzcGxheUNlbGxzID0gZmFsc2U7XG4gIGV4cGFuZEFuaW1hdGlvblRyaWdnZXIgPSBmYWxzZTtcblxuICAvKiByZWZlcmVuY2UgdG8gdGhlIGVudW0gc28gdGhhdCB0ZW1wbGF0ZSBjYW4gYWNjZXNzICovXG4gIFNFTEVDVElPTl9UWVBFID0gU2VsZWN0aW9uVHlwZTtcblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBpdGVtQ2hhbmdlcyA9IG5ldyBSZXBsYXlTdWJqZWN0PFQ+KDEpO1xuXG4gIC8qKioqKlxuICAgKiBwcm9wZXJ0eSBkZ0NlbGxzXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBIFF1ZXJ5IExpc3Qgb2YgdGhlIENsckRhdGFncmlkIGNlbGxzIGluIHRoaXMgcm93LlxuICAgKlxuICAgKi9cbiAgQENvbnRlbnRDaGlsZHJlbihDbHJEYXRhZ3JpZENlbGwpIGRnQ2VsbHM6IFF1ZXJ5TGlzdDxDbHJEYXRhZ3JpZENlbGw+O1xuXG4gIEBWaWV3Q2hpbGQoQ2xyRXhwYW5kYWJsZUFuaW1hdGlvbkRpcmVjdGl2ZSkgZXhwYW5kQW5pbWF0aW9uOiBDbHJFeHBhbmRhYmxlQW5pbWF0aW9uRGlyZWN0aXZlO1xuICBAVmlld0NoaWxkKCdkZXRhaWxCdXR0b24nKSBkZXRhaWxCdXR0b246IEVsZW1lbnRSZWY8SFRNTEJ1dHRvbkVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdzdGlja3lDZWxscycsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSBfc3RpY2t5Q2VsbHM6IFZpZXdDb250YWluZXJSZWY7XG4gIEBWaWV3Q2hpbGQoJ3Njcm9sbGFibGVDZWxscycsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSBfc2Nyb2xsYWJsZUNlbGxzOiBWaWV3Q29udGFpbmVyUmVmO1xuICBAVmlld0NoaWxkKCdjYWxjdWxhdGVkQ2VsbHMnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSkgX2NhbGN1bGF0ZWRDZWxsczogVmlld0NvbnRhaW5lclJlZjtcbiAgQFZpZXdDaGlsZCgnZml4ZWRDZWxsVGVtcGxhdGUnKSBfZml4ZWRDZWxsVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgcHJpdmF0ZSBfaXRlbTogVDtcbiAgcHJpdmF0ZSBfc2VsZWN0ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZGV0YWlsT3BlbkxhYmVsID0gJyc7XG4gIHByaXZhdGUgX2RldGFpbENsb3NlTGFiZWwgPSAnJztcbiAgcHJpdmF0ZSBfcm93U2VsZWN0aW9uTGFiZWwgPSAnJztcbiAgcHJpdmF0ZSB3cmFwcGVkSW5qZWN0b3I6IEluamVjdG9yO1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgLy8gQnkgZGVmYXVsdCwgZXZlcnkgaXRlbSBpcyBzZWxlY3RhYmxlOyBpdCBiZWNvbWVzIG5vdCBzZWxlY3RhYmxlIG9ubHkgaWYgaXQncyBleHBsaWNpdGx5IHNldCB0byBmYWxzZVxuICBwcml2YXRlIF9zZWxlY3RhYmxlOiBib29sZWFuIHwgc3RyaW5nID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgc2VsZWN0aW9uOiBTZWxlY3Rpb248VD4sXG4gICAgcHVibGljIHJvd0FjdGlvblNlcnZpY2U6IFJvd0FjdGlvblNlcnZpY2UsXG4gICAgcHVibGljIGdsb2JhbEV4cGFuZGFibGU6IEV4cGFuZGFibGVSb3dzQ291bnQsXG4gICAgcHVibGljIGV4cGFuZDogRGF0YWdyaWRJZkV4cGFuZFNlcnZpY2UsXG4gICAgcHVibGljIGRldGFpbFNlcnZpY2U6IERldGFpbFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBkaXNwbGF5TW9kZTogRGlzcGxheU1vZGVTZXJ2aWNlLFxuICAgIHByaXZhdGUgdmNyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIGVsOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwdWJsaWMgY29tbW9uU3RyaW5nczogQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBpdGVtczogSXRlbXMsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogYW55XG4gICkge1xuICAgIG5iUm93Kys7XG4gICAgdGhpcy5pZCA9ICdjbHItZGctcm93JyArIG5iUm93O1xuICAgIHRoaXMucmFkaW9JZCA9ICdjbHItZGctcm93LXJkJyArIG5iUm93O1xuICAgIHRoaXMuY2hlY2tib3hJZCA9ICdjbHItZGctcm93LWNiJyArIG5iUm93O1xuICAgIHRoaXMuZXhwYW5kYWJsZUlkID0gZXhwYW5kLmV4cGFuZGFibGVJZDtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgY29tYmluZUxhdGVzdChleHBhbmQucmVwbGFjZSwgZXhwYW5kLmV4cGFuZENoYW5nZSkuc3Vic2NyaWJlKChbZXhwYW5kUmVwbGFjZVZhbHVlLCBleHBhbmRDaGFuZ2VWYWx1ZV0pID0+IHtcbiAgICAgICAgaWYgKGV4cGFuZFJlcGxhY2VWYWx1ZSAmJiBleHBhbmRDaGFuZ2VWYWx1ZSkge1xuICAgICAgICAgIC8vIHJlcGxhY2VkIGFuZCBleHBhbmRpbmdcbiAgICAgICAgICB0aGlzLnJlcGxhY2VkID0gdHJ1ZTtcbiAgICAgICAgICByZW5kZXJlci5hZGRDbGFzcyhlbC5uYXRpdmVFbGVtZW50LCAnZGF0YWdyaWQtcm93LXJlcGxhY2VkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yZXBsYWNlZCA9IGZhbHNlO1xuICAgICAgICAgIC8vIEhhbmRsZXMgdGhlc2UgY2FzZXM6IG5vdCByZXBsYWNlZCBhbmQgY29sbGFwc2luZyAmIHJlcGxhY2VkIGFuZFxuICAgICAgICAgIC8vIGNvbGxhcHNpbmcgYW5kIG5vdCByZXBsYWNlZCBhbmQgZXhwYW5kaW5nLlxuICAgICAgICAgIHJlbmRlcmVyLnJlbW92ZUNsYXNzKGVsLm5hdGl2ZUVsZW1lbnQsICdkYXRhZ3JpZC1yb3ctcmVwbGFjZWQnKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vZGVsIG9mIHRoZSByb3csIHRvIHVzZSBmb3Igc2VsZWN0aW9uXG4gICAqL1xuICBASW5wdXQoJ2NsckRnSXRlbScpXG4gIGdldCBpdGVtKCk6IFQge1xuICAgIHJldHVybiB0aGlzLl9pdGVtO1xuICB9XG4gIHNldCBpdGVtKGl0ZW06IFQpIHtcbiAgICB0aGlzLl9pdGVtID0gaXRlbTtcbiAgICB0aGlzLml0ZW1DaGFuZ2VzLm5leHQoaXRlbSk7XG4gICAgdGhpcy5jbHJEZ1NlbGVjdGFibGUgPSB0aGlzLl9zZWxlY3RhYmxlO1xuICB9XG5cbiAgQElucHV0KCdjbHJEZ1NlbGVjdGFibGUnKVxuICBnZXQgY2xyRGdTZWxlY3RhYmxlKCkge1xuICAgIHJldHVybiAhdGhpcy5zZWxlY3Rpb24uaXNMb2NrZWQodGhpcy5pdGVtKTtcbiAgfVxuICBzZXQgY2xyRGdTZWxlY3RhYmxlKHZhbHVlOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuaXRlbSkge1xuICAgICAgdGhpcy5zZWxlY3Rpb24ubG9ja0l0ZW0odGhpcy5pdGVtLCB2YWx1ZSA9PT0gJ2ZhbHNlJyB8fCB2YWx1ZSA9PT0gZmFsc2UpO1xuICAgIH1cbiAgICAvLyBTdG9yZSB0aGlzIHZhbHVlIGxvY2FsbHksIHRvIGJlIGluaXRpYWxpemVkIHdoZW4gaXRlbSBpcyBpbml0aWFsaXplZFxuICAgIHRoaXMuX3NlbGVjdGFibGUgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgdGhlIHJvdyBpcyBzZWxlY3RlZFxuICAgKi9cbiAgQElucHV0KCdjbHJEZ1NlbGVjdGVkJylcbiAgZ2V0IHNlbGVjdGVkKCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLk5vbmUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uLmlzU2VsZWN0ZWQodGhpcy5pdGVtKTtcbiAgICB9XG4gIH1cbiAgc2V0IHNlbGVjdGVkKHZhbHVlOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuTm9uZSkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB2YWx1ZSBhcyBib29sZWFuO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmFsdWUgJiYgdGhpcy5zZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5NdWx0aSkge1xuICAgICAgICB0aGlzLnJhbmdlU2VsZWN0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbGVjdGlvbi5yYW5nZVN0YXJ0ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2VsZWN0aW9uLnNldFNlbGVjdGVkKHRoaXMuaXRlbSwgdmFsdWUgYXMgYm9vbGVhbik7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdjbHJEZ0V4cGFuZGVkJylcbiAgZ2V0IGV4cGFuZGVkKCkge1xuICAgIHJldHVybiB0aGlzLmV4cGFuZC5leHBhbmRlZDtcbiAgfVxuICBzZXQgZXhwYW5kZWQodmFsdWU6IGJvb2xlYW4gfCBzdHJpbmcpIHtcbiAgICB0aGlzLmV4cGFuZC5leHBhbmRlZCA9IHZhbHVlIGFzIGJvb2xlYW47XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgY2xyRGdEZXRhaWxPcGVuTGFiZWwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZGV0YWlsT3BlbkxhYmVsID8gdGhpcy5fZGV0YWlsT3BlbkxhYmVsIDogdGhpcy5jb21tb25TdHJpbmdzLmtleXMub3BlbjtcbiAgfVxuICBzZXQgY2xyRGdEZXRhaWxPcGVuTGFiZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRoaXMuX2RldGFpbE9wZW5MYWJlbCA9IGxhYmVsO1xuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IGNsckRnRGV0YWlsQ2xvc2VMYWJlbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9kZXRhaWxDbG9zZUxhYmVsID8gdGhpcy5fZGV0YWlsQ2xvc2VMYWJlbCA6IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmNsb3NlO1xuICB9XG4gIHNldCBjbHJEZ0RldGFpbENsb3NlTGFiZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRoaXMuX2RldGFpbENsb3NlTGFiZWwgPSBsYWJlbDtcbiAgfVxuXG4gIC8vIENERS0xNTE6IFJlbmFtZSB0aGlzIGZpZWxkIHRvIGNsckRnUm93U2VsZWN0aW9uTGFiZWwgaW4gdjE2XG4gIEBJbnB1dCgpXG4gIGdldCBjbHJEZ1Jvd1NlbGVjdGlvbkxhYmVsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3Jvd1NlbGVjdGlvbkxhYmVsID8gdGhpcy5fcm93U2VsZWN0aW9uTGFiZWwgOiB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5zZWxlY3Q7XG4gIH1cbiAgc2V0IGNsckRnUm93U2VsZWN0aW9uTGFiZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRoaXMuX3Jvd1NlbGVjdGlvbkxhYmVsID0gbGFiZWw7XG4gIH1cblxuICBnZXQgX3ZpZXcoKSB7XG4gICAgcmV0dXJuIHRoaXMud3JhcHBlZEluamVjdG9yLmdldChXcmFwcGVkUm93LCB0aGlzLnZjcikucm93VmlldztcbiAgfVxuXG4gIGdldCB0cmFja0J5KCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zLnRyYWNrQnk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLndyYXBwZWRJbmplY3RvciA9IG5ldyBIb3N0V3JhcHBlcihXcmFwcGVkUm93LCB0aGlzLnZjcik7XG4gICAgdGhpcy5zZWxlY3Rpb24ubG9ja0l0ZW0odGhpcy5pdGVtLCB0aGlzLmNsckRnU2VsZWN0YWJsZSA9PT0gZmFsc2UpO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuZGdDZWxscy5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmRnQ2VsbHMuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgaWYgKCFjZWxsLl92aWV3LmRlc3Ryb3llZCkge1xuICAgICAgICAgIHRoaXMuX3Njcm9sbGFibGVDZWxscy5pbnNlcnQoY2VsbC5fdmlldyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgdGhpcy5kaXNwbGF5TW9kZS52aWV3LnN1YnNjcmliZSh2aWV3Q2hhbmdlID0+IHtcbiAgICAgICAgLy8gTGlzdGVuIGZvciB2aWV3IGNoYW5nZXMgYW5kIG1vdmUgY2VsbHMgYXJvdW5kIGRlcGVuZGluZyBvbiB0aGUgY3VycmVudCBkaXNwbGF5VHlwZVxuICAgICAgICAvLyByZW1vdmUgY2VsbCB2aWV3cyBmcm9tIGRpc3BsYXkgdmlld1xuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fc2Nyb2xsYWJsZUNlbGxzLmxlbmd0aDsgaSA+IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMuX3Njcm9sbGFibGVDZWxscy5kZXRhY2goKTtcbiAgICAgICAgfVxuICAgICAgICAvLyByZW1vdmUgY2VsbCB2aWV3cyBmcm9tIGNhbGN1bGF0ZWQgdmlld1xuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fY2FsY3VsYXRlZENlbGxzLmxlbmd0aDsgaSA+IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZWRDZWxscy5kZXRhY2goKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmlld0NoYW5nZSA9PT0gRGF0YWdyaWREaXNwbGF5TW9kZS5DQUxDVUxBVEUpIHtcbiAgICAgICAgICB0aGlzLmRpc3BsYXlDZWxscyA9IGZhbHNlO1xuICAgICAgICAgIC8vIEluc2VydHMgYSBmaXhlZCBjZWxsIGlmIGFueSBvZiB0aGVzZSBjb25kaXRpb25zIGFyZSB0cnVlLlxuICAgICAgICAgIGNvbnN0IGZpeGVkQ2VsbENvbmRpdGlvbnMgPSBbXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlICE9PSB0aGlzLlNFTEVDVElPTl9UWVBFLk5vbmUsXG4gICAgICAgICAgICB0aGlzLnJvd0FjdGlvblNlcnZpY2UuaGFzQWN0aW9uYWJsZVJvdyxcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsRXhwYW5kYWJsZS5oYXNFeHBhbmRhYmxlUm93LFxuICAgICAgICAgICAgdGhpcy5kZXRhaWxTZXJ2aWNlLmVuYWJsZWQsXG4gICAgICAgICAgXTtcbiAgICAgICAgICBmaXhlZENlbGxDb25kaXRpb25zXG4gICAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgICAgICAuZm9yRWFjaCgoKSA9PiB0aGlzLl9jYWxjdWxhdGVkQ2VsbHMuaW5zZXJ0KHRoaXMuX2ZpeGVkQ2VsbFRlbXBsYXRlLmNyZWF0ZUVtYmVkZGVkVmlldyhudWxsKSkpO1xuICAgICAgICAgIHRoaXMuZGdDZWxscy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgaWYgKCFjZWxsLl92aWV3LmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVkQ2VsbHMuaW5zZXJ0KGNlbGwuX3ZpZXcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZGlzcGxheUNlbGxzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmRnQ2VsbHMuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgIGlmICghY2VsbC5fdmlldy5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsYWJsZUNlbGxzLmluc2VydChjZWxsLl92aWV3KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICB0aGlzLmV4cGFuZC5hbmltYXRlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuZXhwYW5kQW5pbWF0aW9uVHJpZ2dlciA9ICF0aGlzLmV4cGFuZEFuaW1hdGlvblRyaWdnZXI7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaCgoc3ViOiBTdWJzY3JpcHRpb24pID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcbiAgfVxuXG4gIHRvZ2dsZShzZWxlY3RlZCA9ICF0aGlzLnNlbGVjdGVkKSB7XG4gICAgaWYgKHNlbGVjdGVkICE9PSB0aGlzLnNlbGVjdGVkKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XG4gICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlZC5lbWl0KHNlbGVjdGVkKTtcbiAgICB9XG4gIH1cblxuICB0b2dnbGVFeHBhbmQoKSB7XG4gICAgaWYgKHRoaXMuZXhwYW5kLmV4cGFuZGFibGUpIHtcbiAgICAgIHRoaXMuZXhwYW5kQW5pbWF0aW9uLnVwZGF0ZVN0YXJ0SGVpZ2h0KCk7XG4gICAgICB0aGlzLmV4cGFuZGVkID0gIXRoaXMuZXhwYW5kZWQ7XG4gICAgICB0aGlzLmV4cGFuZGVkQ2hhbmdlLmVtaXQodGhpcy5leHBhbmRlZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IGJlaGF2aW9yIGluIENocm9tZSBhbmQgRmlyZWZveCBmb3Igc2hpZnQtY2xpY2tpbmcgb24gYSBsYWJlbCBpcyB0byBwZXJmb3JtIHRleHQtc2VsZWN0aW9uLlxuICAgKiBUaGlzIHByZXZlbnRzIG91ciBpbnRlbmRlZCByYW5nZS1zZWxlY3Rpb24sIGJlY2F1c2UgdGhpcyB0ZXh0LXNlbGVjdGlvbiBvdmVycmlkZXMgb3VyIHNoaWZ0LWNsaWNrIGV2ZW50LlxuICAgKiBXZSBuZWVkIHRvIGNsZWFyIHRoZSBzdG9yZWQgc2VsZWN0aW9uIHJhbmdlIHdoZW4gc2hpZnQtY2xpY2tpbmcuIFRoaXMgd2lsbCBvdmVycmlkZSB0aGUgbW9zdGx5IHVudXNlZCBzaGlmdC1jbGlja1xuICAgKiBzZWxlY3Rpb24gYnJvd3NlciBmdW5jdGlvbmFsaXR5LCB3aGljaCBpcyBpbmNvbnNpc3RlbnRseSBpbXBsZW1lbnRlZCBpbiBicm93c2VycyBhbnl3YXkuXG4gICAqL1xuICBjbGVhclJhbmdlcyhldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbi5yb3dTZWxlY3Rpb25Nb2RlICYmIGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICB0aGlzLmRvY3VtZW50LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgLy8gRmlyZWZveCBpcyB0b28gcGVyc2lzdGVudCBhYm91dCBpdHMgdGV4dC1zZWxlY3Rpb24gYmVoYXZpb3VyLiBTbyB3ZSBuZWVkIHRvIGFkZCBhIHByZXZlbnREZWZhdWx0KCk7XG4gICAgICAvLyBXZSBzaG91bGQgbm90IHRyeSB0byBlbmZvcmNlIHRoaXMgb24gdGhlIG90aGVyIGJyb3dzZXJzLCB0aG91Z2gsIGJlY2F1c2UgdGhlaXIgdG9nZ2xlIGN5Y2xlIGRvZXMgbm90IGdldCBjYW5jZWxlZCBieVxuICAgICAgLy8gdGhlIHByZXZlbnREZWZhdWx0KCkgYW5kIHRoZXkgdG9nZ2xlIHRoZSBjaGVja2JveCBzZWNvbmQgdGltZSwgZWZmZWN0aXZlbHkgcmV0cnVybmluZyBpdCB0byBub3Qtc2VsZWN0ZWQuXG4gICAgICBpZiAod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignRmlyZWZveCcpICE9PSAtMSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnRvZ2dsZSh0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgcmVsYXRlZCB0byBjbHJEZ1Jvd1NlbGVjdGlvbiwgd2hpY2ggaXMgZGVwcmVjYXRlZFxuICAgKi9cbiAgcHJvdGVjdGVkIHNlbGVjdFJvdyhzZWxlY3RlZCA9ICF0aGlzLnNlbGVjdGVkLCAkZXZlbnQpIHtcbiAgICAvLyBUaGUgbGFiZWwgYWxzbyBjYXB0dXJlcyBjbGlja3MgdGhhdCBidWJibGUgdXAgdG8gdGhlIHJvdyBldmVudCBsaXN0ZW5lciwgY2F1c2luZ1xuICAgIC8vIHRoaXMgaGFuZGxlciB0byBydW4gdHdpY2UuIFRoaXMgZXhpdHMgZWFybHkgdG8gcHJldmVudCB0b2dnbGluZyB0aGUgY2hlY2tib3ggdHdpY2UuXG4gICAgaWYgKCF0aGlzLnNlbGVjdGlvbi5yb3dTZWxlY3Rpb25Nb2RlIHx8ICRldmVudC50YXJnZXQudGFnTmFtZSA9PT0gJ0xBQkVMJyB8fCAhdGhpcy5fc2VsZWN0YWJsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9PT0gdGhpcy5TRUxFQ1RJT05fVFlQRS5TaW5nbGUpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uLmN1cnJlbnRTaW5nbGUgPSB0aGlzLml0ZW07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudG9nZ2xlKHNlbGVjdGVkKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJhbmdlU2VsZWN0KCkge1xuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pdGVtcy5kaXNwbGF5ZWQ7XG4gICAgaWYgKCFpdGVtcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzdGFydEl4ID0gaXRlbXMuaW5kZXhPZih0aGlzLnNlbGVjdGlvbi5yYW5nZVN0YXJ0KTtcbiAgICBpZiAoXG4gICAgICB0aGlzLnNlbGVjdGlvbi5yYW5nZVN0YXJ0ICYmXG4gICAgICB0aGlzLnNlbGVjdGlvbi5jdXJyZW50LmluY2x1ZGVzKHRoaXMuc2VsZWN0aW9uLnJhbmdlU3RhcnQpICYmXG4gICAgICB0aGlzLnNlbGVjdGlvbi5zaGlmdFByZXNzZWQgJiZcbiAgICAgIHN0YXJ0SXggIT09IC0xXG4gICAgKSB7XG4gICAgICBjb25zdCBlbmRJeCA9IGl0ZW1zLmluZGV4T2YodGhpcy5pdGVtKTtcbiAgICAgIC8vIFVzaW5nIFNldCB0byByZW1vdmUgZHVwbGljYXRlc1xuICAgICAgY29uc3QgbmV3U2VsZWN0aW9uID0gbmV3IFNldChcbiAgICAgICAgdGhpcy5zZWxlY3Rpb24uY3VycmVudC5jb25jYXQoaXRlbXMuc2xpY2UoTWF0aC5taW4oc3RhcnRJeCwgZW5kSXgpLCBNYXRoLm1heChzdGFydEl4LCBlbmRJeCkgKyAxKSlcbiAgICAgICk7XG4gICAgICB0aGlzLnNlbGVjdGlvbi5jdXJyZW50ID0gWy4uLm5ld1NlbGVjdGlvbl07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHBhZ2UgbnVtYmVyIGhhcyBjaGFuZ2VkIG9yXG4gICAgICAvLyBubyBTaGlmdCB3YXMgcHJlc3NlZCBvclxuICAgICAgLy8gcmFuZ2VTdGFydCBub3QgeWV0IHNldFxuICAgICAgdGhpcy5zZWxlY3Rpb24ucmFuZ2VTdGFydCA9IHRoaXMuaXRlbTtcbiAgICB9XG4gIH1cbn1cbiIsIjxkaXZcbiAgcm9sZT1cInJvd1wiXG4gIFtpZF09XCJpZFwiXG4gIGNsYXNzPVwiZGF0YWdyaWQtcm93LW1hc3RlciBkYXRhZ3JpZC1yb3ctZmxleFwiXG4gIFtjbHJFeHBhbmRhYmxlQW5pbWF0aW9uXT1cImV4cGFuZEFuaW1hdGlvblRyaWdnZXJcIlxuICAobW91c2Vkb3duKT1cImNsZWFyUmFuZ2VzKCRldmVudClcIlxuICAoY2xpY2spPVwic2VsZWN0Um93KCFzZWxlY3RlZCwgJGV2ZW50KVwiXG4gIFtjbGFzcy5kYXRhZ3JpZC1yb3ctY2xpY2thYmxlXT1cInNlbGVjdGlvbi5yb3dTZWxlY3Rpb25Nb2RlXCJcbiAgW2NsYXNzLmRhdGFncmlkLXJvdy1kZXRhaWwtb3Blbl09XCJkZXRhaWxTZXJ2aWNlLmlzUm93T3BlbihpdGVtKVwiXG4+XG4gIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1yb3ctc3RpY2t5XCI+XG4gICAgPCEtLSBTdGlja3kgZWxlbWVudHMgaGVyZSAtLT5cbiAgICA8bmctY29udGFpbmVyICNzdGlja3lDZWxscz5cbiAgICAgIDxkaXZcbiAgICAgICAgKm5nSWY9XCJzZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9PT0gU0VMRUNUSU9OX1RZUEUuTXVsdGlcIlxuICAgICAgICBjbGFzcz1cImRhdGFncmlkLXNlbGVjdCBkYXRhZ3JpZC1maXhlZC1jb2x1bW4gZGF0YWdyaWQtY2VsbFwiXG4gICAgICAgIFtuZ0NsYXNzXT1cInsgJ2Nsci1mb3JtLWNvbnRyb2wtZGlzYWJsZWQnOiAhY2xyRGdTZWxlY3RhYmxlIH1cIlxuICAgICAgICByb2xlPVwiZ3JpZGNlbGxcIlxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2xyLWNoZWNrYm94LXdyYXBwZXJcIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgIFtuZ01vZGVsXT1cInNlbGVjdGVkXCJcbiAgICAgICAgICAgIChuZ01vZGVsQ2hhbmdlKT1cInRvZ2dsZSgkZXZlbnQpXCJcbiAgICAgICAgICAgIFtpZF09XCJjaGVja2JveElkXCJcbiAgICAgICAgICAgIFtkaXNhYmxlZF09XCJjbHJEZ1NlbGVjdGFibGUgPyBudWxsIDogdHJ1ZVwiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWRpc2FibGVkXT1cImNsckRnU2VsZWN0YWJsZSA/IG51bGwgOiB0cnVlXCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIDwhLS0gVXNhZ2Ugb2YgY2xhc3MgY2xyLWNvbC1udWxsIGhlcmUgcHJldmVudHMgY2xyLWNvbC0qIGNsYXNzZXMgZnJvbSBiZWluZyBhZGRlZCB3aGVuIGEgZGF0YWdyaWQgaXMgd3JhcHBlZCBpbnNpZGUgY2xyRm9ybSAtLT5cbiAgICAgICAgICA8bGFiZWwgW2Zvcl09XCJjaGVja2JveElkXCIgY2xhc3M9XCJjbHItY29udHJvbC1sYWJlbCBjbHItY29sLW51bGxcIiAoY2xpY2spPVwiY2xlYXJSYW5nZXMoJGV2ZW50KVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHItc3Itb25seVwiPnt7Y2xyRGdSb3dTZWxlY3Rpb25MYWJlbCB8fCBjb21tb25TdHJpbmdzLmtleXMuc2VsZWN0fX08L3NwYW4+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXZcbiAgICAgICAgKm5nSWY9XCJzZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9PT0gU0VMRUNUSU9OX1RZUEUuU2luZ2xlXCJcbiAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1zZWxlY3QgZGF0YWdyaWQtZml4ZWQtY29sdW1uIGRhdGFncmlkLWNlbGxcIlxuICAgICAgICBbbmdDbGFzc109XCJ7ICdjbHItZm9ybS1jb250cm9sLWRpc2FibGVkJzogIWNsckRnU2VsZWN0YWJsZSB9XCJcbiAgICAgICAgcm9sZT1cImdyaWRjZWxsXCJcbiAgICAgID5cbiAgICAgICAgPGNsci1yYWRpby13cmFwcGVyPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgICAgICAgICB0eXBlPVwicmFkaW9cIlxuICAgICAgICAgICAgY2xyUmFkaW9cbiAgICAgICAgICAgIGNsckRnU2luZ2xlU2VsZWN0aW9uUmFkaW9cbiAgICAgICAgICAgIFtjbHJEZ0l0ZW1zVHJhY2tCeV09XCJ0cmFja0J5XCJcbiAgICAgICAgICAgIFtpZF09XCJyYWRpb0lkXCJcbiAgICAgICAgICAgIFtuYW1lXT1cInNlbGVjdGlvbi5pZCArICctcmFkaW8nXCJcbiAgICAgICAgICAgIFt2YWx1ZV09XCJpdGVtXCJcbiAgICAgICAgICAgIFsobmdNb2RlbCldPVwic2VsZWN0aW9uLmN1cnJlbnRTaW5nbGVcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImNsckRnU2VsZWN0YWJsZSA/IG51bGwgOiB0cnVlXCJcbiAgICAgICAgICAgIFthdHRyLmFyaWEtZGlzYWJsZWRdPVwiY2xyRGdTZWxlY3RhYmxlID8gbnVsbCA6IHRydWVcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY2xyLWNvbnRyb2wtbGFiZWwgY2xyLWNvbC1udWxsXCIgW2Zvcl09XCJyYWRpb0lkXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNsci1zci1vbmx5XCI+e3sgY2xyRGdSb3dTZWxlY3Rpb25MYWJlbCB8fCBjb21tb25TdHJpbmdzLmtleXMuc2VsZWN0IH19PC9zcGFuPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDwvY2xyLXJhZGlvLXdyYXBwZXI+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXZcbiAgICAgICAgKm5nSWY9XCJyb3dBY3Rpb25TZXJ2aWNlLmhhc0FjdGlvbmFibGVSb3dcIlxuICAgICAgICBjbGFzcz1cImRhdGFncmlkLXJvdy1hY3Rpb25zIGRhdGFncmlkLWZpeGVkLWNvbHVtbiBkYXRhZ3JpZC1jZWxsXCJcbiAgICAgICAgcm9sZT1cImdyaWRjZWxsXCJcbiAgICAgID5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWRnLWFjdGlvbi1vdmVyZmxvd1wiPjwvbmctY29udGVudD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdlxuICAgICAgICAqbmdJZj1cImdsb2JhbEV4cGFuZGFibGUuaGFzRXhwYW5kYWJsZVJvd1wiXG4gICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtZXhwYW5kYWJsZS1jYXJldCBkYXRhZ3JpZC1maXhlZC1jb2x1bW4gZGF0YWdyaWQtY2VsbFwiXG4gICAgICAgIHJvbGU9XCJncmlkY2VsbFwiXG4gICAgICA+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJleHBhbmQuZXhwYW5kYWJsZVwiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgICAgKm5nSWY9XCIhZXhwYW5kLmxvYWRpbmdcIlxuICAgICAgICAgICAgKGNsaWNrKT1cInRvZ2dsZUV4cGFuZCgpXCJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1leHBhbmRhYmxlLWNhcmV0LWJ1dHRvblwiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWV4cGFuZGVkXT1cImV4cGFuZC5leHBhbmRlZFwiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImV4cGFuZC5leHBhbmRlZCA/IGNsckRnRGV0YWlsQ2xvc2VMYWJlbCA6IGNsckRnRGV0YWlsT3BlbkxhYmVsXCJcbiAgICAgICAgICAgIFthdHRyLmFyaWEtY29udHJvbHNdPVwiZXhwYW5kLmhhc0V4cGFuZFRlbXBsYXRlICYmICFleHBhbmQuZXhwYW5kZWQgPyBudWxsIDogZXhwYW5kYWJsZUlkXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8Y2RzLWljb25cbiAgICAgICAgICAgICAgc2hhcGU9XCJhbmdsZVwiXG4gICAgICAgICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtZXhwYW5kYWJsZS1jYXJldC1pY29uXCJcbiAgICAgICAgICAgICAgW2F0dHIuZGlyZWN0aW9uXT1cImV4cGFuZC5leHBhbmRlZCA/ICdkb3duJyA6ICdyaWdodCdcIlxuICAgICAgICAgICAgICBbYXR0ci50aXRsZV09XCJleHBhbmQuZXhwYW5kZWQgPyBjb21tb25TdHJpbmdzLmtleXMuY29sbGFwc2UgOiBjb21tb25TdHJpbmdzLmtleXMuZXhwYW5kXCJcbiAgICAgICAgICAgID48L2Nkcy1pY29uPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxjbHItc3Bpbm5lciAqbmdJZj1cImV4cGFuZC5sb2FkaW5nXCIgY2xyU21hbGw+e3sgY29tbW9uU3RyaW5ncy5rZXlzLmxvYWRpbmcgfX08L2Nsci1zcGlubmVyPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdlxuICAgICAgICAqbmdJZj1cImRldGFpbFNlcnZpY2UuZW5hYmxlZFwiXG4gICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtZGV0YWlsLWNhcmV0IGRhdGFncmlkLWZpeGVkLWNvbHVtbiBkYXRhZ3JpZC1jZWxsXCJcbiAgICAgICAgcm9sZT1cImdyaWRjZWxsXCJcbiAgICAgID5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgIChjbGljayk9XCJkZXRhaWxTZXJ2aWNlLnRvZ2dsZShpdGVtLCBkZXRhaWxCdXR0b24pXCJcbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAjZGV0YWlsQnV0dG9uXG4gICAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1kZXRhaWwtY2FyZXQtYnV0dG9uXCJcbiAgICAgICAgICBbZGlzYWJsZWRdPVwiZGV0YWlsRGlzYWJsZWRcIlxuICAgICAgICAgICpuZ0lmPVwiIWRldGFpbEhpZGRlblwiXG4gICAgICAgICAgW2NsYXNzLmlzLW9wZW5dPVwiZGV0YWlsU2VydmljZS5pc1Jvd09wZW4oaXRlbSlcIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiZGV0YWlsU2VydmljZS5pc1Jvd09wZW4oaXRlbSkgPyBjbHJEZ0RldGFpbENsb3NlTGFiZWwgOiBjbHJEZ0RldGFpbE9wZW5MYWJlbFwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJkZXRhaWxTZXJ2aWNlLmlzUm93T3BlbihpdGVtKVwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1jb250cm9sc109XCJkZXRhaWxTZXJ2aWNlLmlkXCJcbiAgICAgICAgICBhcmlhLWhhc3BvcHVwPVwiZGlhbG9nXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxjZHMtaWNvblxuICAgICAgICAgICAgc2hhcGU9XCJhbmdsZS1kb3VibGVcIlxuICAgICAgICAgICAgW2F0dHIuZGlyZWN0aW9uXT1cImRldGFpbFNlcnZpY2UuaXNSb3dPcGVuKGl0ZW0pID8gJ2xlZnQnIDogJ3JpZ2h0J1wiXG4gICAgICAgICAgICBjbGFzcz1cImRhdGFncmlkLWRldGFpbC1jYXJldC1pY29uXCJcbiAgICAgICAgICAgIFthdHRyLnRpdGxlXT1cImRldGFpbFNlcnZpY2UuaXNSb3dPcGVuKGl0ZW0pID8gY29tbW9uU3RyaW5ncy5rZXlzLmNsb3NlOiBjb21tb25TdHJpbmdzLmtleXMub3BlblwiXG4gICAgICAgICAgPjwvY2RzLWljb24+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPCEtLSBwbGFjZWhvbGRlciBmb3IgcHJvamVjdGluZyBvdGhlciBzdGlja3kgY2VsbHMgYXMgcGlubmVkLS0+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtcm93LXNjcm9sbGFibGVcIiBbbmdDbGFzc109XCJ7J2lzLXJlcGxhY2VkJzogcmVwbGFjZWQgJiYgZXhwYW5kZWR9XCI+XG4gICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLXNjcm9sbGluZy1jZWxsc1wiPlxuICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWRnLWNlbGxcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8bmctY29udGFpbmVyICNzY3JvbGxhYmxlQ2VsbHM+PC9uZy1jb250YWluZXI+XG4gICAgPC9kaXY+XG4gICAgPCEtLSBkZXRhaWxzIGhlcmUgd2hlbiByZXBsYWNlLCByZS12aXNpdCB3aGVuIHN0aWNreSBjb250YWluZXIgaXMgdXNlZCBmb3IgcGlubmVkIGNlbGxzIC0tPlxuICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cInJlcGxhY2VkICYmICFleHBhbmQubG9hZGluZ1wiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImRldGFpbFwiPjwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlICpuZ0lmPVwiIXJlcGxhY2VkICYmICFleHBhbmQubG9hZGluZ1wiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImRldGFpbFwiPjwvbmctdGVtcGxhdGU+XG4gIDwvZGl2PlxuPC9kaXY+XG48IS0tXG4gICAgV2UgbmVlZCB0aGUgXCJwcm9qZWN0IGludG8gdGVtcGxhdGVcIiBoYWNrcyBiZWNhdXNlIHdlIG5lZWQgdGhpcyBpbiAyIGRpZmZlcmVudCBwbGFjZXNcbiAgICBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgZGV0YWlscyByZXBsYWNlIHRoZSByb3cgb3Igbm90LlxuLS0+XG48bmctdGVtcGxhdGUgI2RldGFpbD5cbiAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWRnLXJvdy1kZXRhaWxcIj48L25nLWNvbnRlbnQ+XG48L25nLXRlbXBsYXRlPlxuXG48bmctY29udGFpbmVyICNjYWxjdWxhdGVkQ2VsbHM+PC9uZy1jb250YWluZXI+XG5cbjxuZy10ZW1wbGF0ZSAjZml4ZWRDZWxsVGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1maXhlZC1jb2x1bW4gZGF0YWdyaWQtY2VsbFwiIHJvbGU9XCJncmlkY2VsbFwiPjwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==
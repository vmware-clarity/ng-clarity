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
    ], queries: [{ propertyName: "dgCells", predicate: ClrDatagridCell }], viewQueries: [{ propertyName: "expandAnimation", first: true, predicate: ClrExpandableAnimationDirective, descendants: true }, { propertyName: "detailButton", first: true, predicate: ["detailButton"], descendants: true }, { propertyName: "_stickyCells", first: true, predicate: ["stickyCells"], descendants: true, read: ViewContainerRef }, { propertyName: "_scrollableCells", first: true, predicate: ["scrollableCells"], descendants: true, read: ViewContainerRef }, { propertyName: "_calculatedCells", first: true, predicate: ["calculatedCells"], descendants: true, read: ViewContainerRef }, { propertyName: "_fixedCellTemplate", first: true, predicate: ["fixedCellTemplate"], descendants: true }], ngImport: i0, template: "<div\n  role=\"row\"\n  [id]=\"id\"\n  class=\"datagrid-row-master datagrid-row-flex\"\n  [clrExpandableAnimation]=\"expandAnimationTrigger\"\n  (mousedown)=\"clearRanges($event)\"\n  (click)=\"selectRow(!selected, $event)\"\n  [class.datagrid-row-clickable]=\"selection.rowSelectionMode\"\n  [class.datagrid-row-detail-open]=\"detailService.isRowOpen(item)\"\n>\n  <div class=\"datagrid-row-sticky\">\n    <!-- Sticky elements here -->\n    <ng-container #stickyCells>\n      <div\n        *ngIf=\"selection.selectionType === SELECTION_TYPE.Multi\"\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <div class=\"clr-checkbox-wrapper\">\n          <input\n            tabindex=\"-1\"\n            type=\"checkbox\"\n            [ngModel]=\"selected\"\n            (ngModelChange)=\"toggle($event)\"\n            [id]=\"checkboxId\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n          <label [for]=\"checkboxId\" class=\"clr-control-label clr-col-null\" (click)=\"clearRanges($event)\">\n            <span class=\"clr-sr-only\">{{clrDgRowSelectionLabel || commonStrings.keys.select}}</span>\n          </label>\n        </div>\n      </div>\n      <div\n        *ngIf=\"selection.selectionType === SELECTION_TYPE.Single\"\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <clr-radio-wrapper>\n          <input\n            tabindex=\"-1\"\n            type=\"radio\"\n            clrRadio\n            [id]=\"radioId\"\n            [name]=\"selection.id + '-radio'\"\n            [value]=\"item\"\n            [(ngModel)]=\"selection.currentSingle\"\n            [checked]=\"selection.currentSingle === item\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <label class=\"clr-control-label clr-col-null\" [for]=\"radioId\">\n            <span class=\"clr-sr-only\">{{ clrDgRowSelectionLabel || commonStrings.keys.select }}</span>\n          </label>\n        </clr-radio-wrapper>\n      </div>\n      <div\n        *ngIf=\"rowActionService.hasActionableRow\"\n        class=\"datagrid-row-actions datagrid-fixed-column datagrid-cell\"\n        role=\"gridcell\"\n      >\n        <ng-content select=\"clr-dg-action-overflow\"></ng-content>\n      </div>\n      <div\n        *ngIf=\"globalExpandable.hasExpandableRow\"\n        class=\"datagrid-expandable-caret datagrid-fixed-column datagrid-cell\"\n        role=\"gridcell\"\n      >\n        <ng-container *ngIf=\"expand.expandable\">\n          <button\n            tabindex=\"-1\"\n            *ngIf=\"!expand.loading\"\n            (click)=\"toggleExpand()\"\n            type=\"button\"\n            class=\"datagrid-expandable-caret-button\"\n            [attr.aria-expanded]=\"expand.expanded\"\n            [attr.aria-label]=\"expand.expanded ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n            [attr.aria-controls]=\"expand.hasExpandTemplate && !expand.expanded ? null : expandableId\"\n          >\n            <cds-icon\n              shape=\"angle\"\n              class=\"datagrid-expandable-caret-icon\"\n              [attr.direction]=\"expand.expanded ? 'down' : 'right'\"\n              [attr.title]=\"expand.expanded ? commonStrings.keys.collapse : commonStrings.keys.expand\"\n            ></cds-icon>\n          </button>\n          <clr-spinner *ngIf=\"expand.loading\" clrSmall>{{ commonStrings.keys.loading }}</clr-spinner>\n        </ng-container>\n      </div>\n      <div\n        *ngIf=\"detailService.enabled\"\n        class=\"datagrid-detail-caret datagrid-fixed-column datagrid-cell\"\n        role=\"gridcell\"\n      >\n        <button\n          tabindex=\"-1\"\n          (click)=\"detailService.toggle(item, detailButton)\"\n          type=\"button\"\n          #detailButton\n          class=\"datagrid-detail-caret-button\"\n          [disabled]=\"detailDisabled\"\n          *ngIf=\"!detailHidden\"\n          [class.is-open]=\"detailService.isRowOpen(item)\"\n          [attr.aria-label]=\"detailService.isRowOpen(item) ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n          [attr.aria-expanded]=\"detailService.isRowOpen(item)\"\n          [attr.aria-controls]=\"detailService.id\"\n          aria-haspopup=\"dialog\"\n        >\n          <cds-icon\n            shape=\"angle-double\"\n            [attr.direction]=\"detailService.isRowOpen(item) ? 'left' : 'right'\"\n            class=\"datagrid-detail-caret-icon\"\n            [attr.title]=\"detailService.isRowOpen(item) ? commonStrings.keys.close: commonStrings.keys.open\"\n          ></cds-icon>\n        </button>\n      </div>\n    </ng-container>\n    <!-- placeholder for projecting other sticky cells as pinned-->\n  </div>\n  <div class=\"datagrid-row-scrollable\" [ngClass]=\"{'is-replaced': replaced && expanded}\">\n    <div class=\"datagrid-scrolling-cells\">\n      <ng-content select=\"clr-dg-cell\"></ng-content>\n      <ng-container #scrollableCells></ng-container>\n    </div>\n    <!-- details here when replace, re-visit when sticky container is used for pinned cells -->\n    <ng-template *ngIf=\"replaced && !expand.loading\" [ngTemplateOutlet]=\"detail\"></ng-template>\n    <ng-template *ngIf=\"!replaced && !expand.loading\" [ngTemplateOutlet]=\"detail\"></ng-template>\n  </div>\n</div>\n<!--\n    We need the \"project into template\" hacks because we need this in 2 different places\n    depending on whether the details replace the row or not.\n-->\n<ng-template #detail>\n  <ng-content select=\"clr-dg-row-detail\"></ng-content>\n</ng-template>\n\n<ng-container #calculatedCells></ng-container>\n\n<ng-template #fixedCellTemplate>\n  <div class=\"datagrid-fixed-column datagrid-cell\" role=\"gridcell\"></div>\n</ng-template>\n", dependencies: [{ kind: "directive", type: i9.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i9.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i9.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i10.CdsIconCustomTag, selector: "cds-icon" }, { kind: "directive", type: i11.ClrLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i12.ClrRadio, selector: "[clrRadio]" }, { kind: "component", type: i13.ClrRadioWrapper, selector: "clr-radio-wrapper" }, { kind: "directive", type: i14.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i14.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i14.RadioControlValueAccessor, selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]", inputs: ["name", "formControlName", "value"] }, { kind: "directive", type: i14.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i14.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i15.ClrExpandableAnimationDirective, selector: "[clrExpandableAnimation]", inputs: ["clrExpandableAnimation"] }, { kind: "component", type: i16.ClrSpinner, selector: "clr-spinner", inputs: ["clrInline", "clrInverse", "clrSmall", "clrMedium"] }, { kind: "directive", type: i17.ClrDatagridSelectionCellDirective, selector: ".datagrid-select" }] });
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
                    ], template: "<div\n  role=\"row\"\n  [id]=\"id\"\n  class=\"datagrid-row-master datagrid-row-flex\"\n  [clrExpandableAnimation]=\"expandAnimationTrigger\"\n  (mousedown)=\"clearRanges($event)\"\n  (click)=\"selectRow(!selected, $event)\"\n  [class.datagrid-row-clickable]=\"selection.rowSelectionMode\"\n  [class.datagrid-row-detail-open]=\"detailService.isRowOpen(item)\"\n>\n  <div class=\"datagrid-row-sticky\">\n    <!-- Sticky elements here -->\n    <ng-container #stickyCells>\n      <div\n        *ngIf=\"selection.selectionType === SELECTION_TYPE.Multi\"\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <div class=\"clr-checkbox-wrapper\">\n          <input\n            tabindex=\"-1\"\n            type=\"checkbox\"\n            [ngModel]=\"selected\"\n            (ngModelChange)=\"toggle($event)\"\n            [id]=\"checkboxId\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n          <label [for]=\"checkboxId\" class=\"clr-control-label clr-col-null\" (click)=\"clearRanges($event)\">\n            <span class=\"clr-sr-only\">{{clrDgRowSelectionLabel || commonStrings.keys.select}}</span>\n          </label>\n        </div>\n      </div>\n      <div\n        *ngIf=\"selection.selectionType === SELECTION_TYPE.Single\"\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <clr-radio-wrapper>\n          <input\n            tabindex=\"-1\"\n            type=\"radio\"\n            clrRadio\n            [id]=\"radioId\"\n            [name]=\"selection.id + '-radio'\"\n            [value]=\"item\"\n            [(ngModel)]=\"selection.currentSingle\"\n            [checked]=\"selection.currentSingle === item\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <label class=\"clr-control-label clr-col-null\" [for]=\"radioId\">\n            <span class=\"clr-sr-only\">{{ clrDgRowSelectionLabel || commonStrings.keys.select }}</span>\n          </label>\n        </clr-radio-wrapper>\n      </div>\n      <div\n        *ngIf=\"rowActionService.hasActionableRow\"\n        class=\"datagrid-row-actions datagrid-fixed-column datagrid-cell\"\n        role=\"gridcell\"\n      >\n        <ng-content select=\"clr-dg-action-overflow\"></ng-content>\n      </div>\n      <div\n        *ngIf=\"globalExpandable.hasExpandableRow\"\n        class=\"datagrid-expandable-caret datagrid-fixed-column datagrid-cell\"\n        role=\"gridcell\"\n      >\n        <ng-container *ngIf=\"expand.expandable\">\n          <button\n            tabindex=\"-1\"\n            *ngIf=\"!expand.loading\"\n            (click)=\"toggleExpand()\"\n            type=\"button\"\n            class=\"datagrid-expandable-caret-button\"\n            [attr.aria-expanded]=\"expand.expanded\"\n            [attr.aria-label]=\"expand.expanded ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n            [attr.aria-controls]=\"expand.hasExpandTemplate && !expand.expanded ? null : expandableId\"\n          >\n            <cds-icon\n              shape=\"angle\"\n              class=\"datagrid-expandable-caret-icon\"\n              [attr.direction]=\"expand.expanded ? 'down' : 'right'\"\n              [attr.title]=\"expand.expanded ? commonStrings.keys.collapse : commonStrings.keys.expand\"\n            ></cds-icon>\n          </button>\n          <clr-spinner *ngIf=\"expand.loading\" clrSmall>{{ commonStrings.keys.loading }}</clr-spinner>\n        </ng-container>\n      </div>\n      <div\n        *ngIf=\"detailService.enabled\"\n        class=\"datagrid-detail-caret datagrid-fixed-column datagrid-cell\"\n        role=\"gridcell\"\n      >\n        <button\n          tabindex=\"-1\"\n          (click)=\"detailService.toggle(item, detailButton)\"\n          type=\"button\"\n          #detailButton\n          class=\"datagrid-detail-caret-button\"\n          [disabled]=\"detailDisabled\"\n          *ngIf=\"!detailHidden\"\n          [class.is-open]=\"detailService.isRowOpen(item)\"\n          [attr.aria-label]=\"detailService.isRowOpen(item) ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n          [attr.aria-expanded]=\"detailService.isRowOpen(item)\"\n          [attr.aria-controls]=\"detailService.id\"\n          aria-haspopup=\"dialog\"\n        >\n          <cds-icon\n            shape=\"angle-double\"\n            [attr.direction]=\"detailService.isRowOpen(item) ? 'left' : 'right'\"\n            class=\"datagrid-detail-caret-icon\"\n            [attr.title]=\"detailService.isRowOpen(item) ? commonStrings.keys.close: commonStrings.keys.open\"\n          ></cds-icon>\n        </button>\n      </div>\n    </ng-container>\n    <!-- placeholder for projecting other sticky cells as pinned-->\n  </div>\n  <div class=\"datagrid-row-scrollable\" [ngClass]=\"{'is-replaced': replaced && expanded}\">\n    <div class=\"datagrid-scrolling-cells\">\n      <ng-content select=\"clr-dg-cell\"></ng-content>\n      <ng-container #scrollableCells></ng-container>\n    </div>\n    <!-- details here when replace, re-visit when sticky container is used for pinned cells -->\n    <ng-template *ngIf=\"replaced && !expand.loading\" [ngTemplateOutlet]=\"detail\"></ng-template>\n    <ng-template *ngIf=\"!replaced && !expand.loading\" [ngTemplateOutlet]=\"detail\"></ng-template>\n  </div>\n</div>\n<!--\n    We need the \"project into template\" hacks because we need this in 2 different places\n    depending on whether the details replace the row or not.\n-->\n<ng-template #detail>\n  <ng-content select=\"clr-dg-row-detail\"></ng-content>\n</ng-template>\n\n<ng-container #calculatedCells></ng-container>\n\n<ng-template #fixedCellTemplate>\n  <div class=\"datagrid-fixed-column datagrid-cell\" role=\"gridcell\"></div>\n</ng-template>\n" }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtcm93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC1yb3cudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2RhdGFncmlkLXJvdy5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFHTCxTQUFTLEVBQ1QsZUFBZSxFQUVmLFlBQVksRUFDWixNQUFNLEVBRU4sS0FBSyxFQUNMLE1BQU0sRUFJTixTQUFTLEVBQ1QsZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUVsRSxPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSw0RUFBNEUsQ0FBQztBQUM3SCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDOUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBRXJFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDekUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBT3ZELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFM0MsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBa0JkLE1BQU0s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QVc7Z0JBV2QsZUFBZTtzQkFEbEIsS0FBSzt1QkFBQyxpQkFBaUI7Z0JBZ0JwQixRQUFRO3NCQURYLEtBQUs7dUJBQUMsZUFBZTtnQkFzQmxCLFFBQVE7c0JBRFgsS0FBSzt1QkFBQyxlQUFlO2dCQVNsQixvQkFBb0I7c0JBRHZCLEtBQUs7Z0JBU0YscUJBQXFCO3NCQUR4QixLQUFLO2dCQVVGLHNCQUFzQjtzQkFEekIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBSZW5kZXJlcjIsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY29tYmluZUxhdGVzdCwgUmVwbGF5U3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENsckV4cGFuZGFibGVBbmltYXRpb25EaXJlY3RpdmUgfSBmcm9tICcuLi8uLi91dGlscy9hbmltYXRpb25zL2V4cGFuZGFibGUtYW5pbWF0aW9uL2V4cGFuZGFibGUtYW5pbWF0aW9uLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBJZkV4cGFuZFNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9jb25kaXRpb25hbC9pZi1leHBhbmRlZC5zZXJ2aWNlJztcbmltcG9ydCB7IEhvc3RXcmFwcGVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvaG9zdC13cmFwcGluZy9ob3N0LXdyYXBwZXInO1xuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgTG9hZGluZ0xpc3RlbmVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvbG9hZGluZy9sb2FkaW5nLWxpc3RlbmVyJztcbmltcG9ydCB7IENsckRhdGFncmlkQ2VsbCB9IGZyb20gJy4vZGF0YWdyaWQtY2VsbCc7XG5pbXBvcnQgeyBEYXRhZ3JpZElmRXhwYW5kU2VydmljZSB9IGZyb20gJy4vZGF0YWdyaWQtaWYtZXhwYW5kZWQuc2VydmljZSc7XG5pbXBvcnQgeyBEYXRhZ3JpZERpc3BsYXlNb2RlIH0gZnJvbSAnLi9lbnVtcy9kaXNwbGF5LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBTZWxlY3Rpb25UeXBlIH0gZnJvbSAnLi9lbnVtcy9zZWxlY3Rpb24tdHlwZSc7XG5pbXBvcnQgeyBEZXRhaWxTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGV0YWlsLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGlzcGxheU1vZGVTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGlzcGxheS1tb2RlLnNlcnZpY2UnO1xuaW1wb3J0IHsgRXhwYW5kYWJsZVJvd3NDb3VudCB9IGZyb20gJy4vcHJvdmlkZXJzL2dsb2JhbC1leHBhbmRhYmxlLXJvd3MnO1xuaW1wb3J0IHsgSXRlbXMgfSBmcm9tICcuL3Byb3ZpZGVycy9pdGVtcyc7XG5pbXBvcnQgeyBSb3dBY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvcm93LWFjdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IFNlbGVjdGlvbiB9IGZyb20gJy4vcHJvdmlkZXJzL3NlbGVjdGlvbic7XG5pbXBvcnQgeyBXcmFwcGVkUm93IH0gZnJvbSAnLi93cmFwcGVkLXJvdyc7XG5cbmxldCBuYlJvdyA9IDA7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1kZy1yb3cnLFxuICB0ZW1wbGF0ZVVybDogJy4vZGF0YWdyaWQtcm93Lmh0bWwnLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5kYXRhZ3JpZC1yb3ddJzogJ3RydWUnLFxuICAgICdbY2xhc3MuZGF0YWdyaWQtcm93LXNrZWxldG9uXSc6ICdza2VsZXRvbkxvYWRpbmcnLFxuICAgICdbY2xhc3MuZGF0YWdyaWQtc2VsZWN0ZWRdJzogJ3NlbGVjdGVkJyxcbiAgICAnW2F0dHIuYXJpYS1vd25zXSc6ICdpZCcsXG4gICAgcm9sZTogJ3Jvd2dyb3VwJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgRGF0YWdyaWRJZkV4cGFuZFNlcnZpY2UsXG4gICAgeyBwcm92aWRlOiBJZkV4cGFuZFNlcnZpY2UsIHVzZUV4aXN0aW5nOiBEYXRhZ3JpZElmRXhwYW5kU2VydmljZSB9LFxuICAgIHsgcHJvdmlkZTogTG9hZGluZ0xpc3RlbmVyLCB1c2VFeGlzdGluZzogRGF0YWdyaWRJZkV4cGFuZFNlcnZpY2UgfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWdyaWRSb3c8VCA9IGFueT4gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0IHtcbiAgQE91dHB1dCgnY2xyRGdTZWxlY3RlZENoYW5nZScpIHNlbGVjdGVkQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oZmFsc2UpO1xuICBAT3V0cHV0KCdjbHJEZ0V4cGFuZGVkQ2hhbmdlJykgZXhwYW5kZWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KGZhbHNlKTtcbiAgQElucHV0KCdjbHJEZ0RldGFpbERpc2FibGVkJykgZGV0YWlsRGlzYWJsZWQgPSBmYWxzZTtcbiAgQElucHV0KCdjbHJEZ0RldGFpbEhpZGRlbicpIGRldGFpbEhpZGRlbiA9IGZhbHNlO1xuICBASW5wdXQoJ2NsckRnU2tlbGV0b25Mb2FkaW5nJykgc2tlbGV0b25Mb2FkaW5nID0gZmFsc2U7XG5cbiAgaWQ6IHN0cmluZztcbiAgcmFkaW9JZDogc3RyaW5nO1xuICBjaGVja2JveElkOiBzdHJpbmc7XG4gIGV4cGFuZGFibGVJZDogc3RyaW5nO1xuICByZXBsYWNlZDogYm9vbGVhbjtcbiAgZGlzcGxheUNlbGxzID0gZmFsc2U7XG4gIGV4cGFuZEFuaW1hdGlvblRyaWdnZXIgPSBmYWxzZTtcblxuICAvKiByZWZlcmVuY2UgdG8gdGhlIGVudW0gc28gdGhhdCB0ZW1wbGF0ZSBjYW4gYWNjZXNzICovXG4gIFNFTEVDVElPTl9UWVBFID0gU2VsZWN0aW9uVHlwZTtcblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBpdGVtQ2hhbmdlcyA9IG5ldyBSZXBsYXlTdWJqZWN0PFQ+KDEpO1xuXG4gIC8qKioqKlxuICAgKiBwcm9wZXJ0eSBkZ0NlbGxzXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBIFF1ZXJ5IExpc3Qgb2YgdGhlIENsckRhdGFncmlkIGNlbGxzIGluIHRoaXMgcm93LlxuICAgKlxuICAgKi9cbiAgQENvbnRlbnRDaGlsZHJlbihDbHJEYXRhZ3JpZENlbGwpIGRnQ2VsbHM6IFF1ZXJ5TGlzdDxDbHJEYXRhZ3JpZENlbGw+O1xuXG4gIEBWaWV3Q2hpbGQoQ2xyRXhwYW5kYWJsZUFuaW1hdGlvbkRpcmVjdGl2ZSkgZXhwYW5kQW5pbWF0aW9uOiBDbHJFeHBhbmRhYmxlQW5pbWF0aW9uRGlyZWN0aXZlO1xuICBAVmlld0NoaWxkKCdkZXRhaWxCdXR0b24nKSBkZXRhaWxCdXR0b246IEVsZW1lbnRSZWY8SFRNTEJ1dHRvbkVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdzdGlja3lDZWxscycsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSBfc3RpY2t5Q2VsbHM6IFZpZXdDb250YWluZXJSZWY7XG4gIEBWaWV3Q2hpbGQoJ3Njcm9sbGFibGVDZWxscycsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSBfc2Nyb2xsYWJsZUNlbGxzOiBWaWV3Q29udGFpbmVyUmVmO1xuICBAVmlld0NoaWxkKCdjYWxjdWxhdGVkQ2VsbHMnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSkgX2NhbGN1bGF0ZWRDZWxsczogVmlld0NvbnRhaW5lclJlZjtcbiAgQFZpZXdDaGlsZCgnZml4ZWRDZWxsVGVtcGxhdGUnKSBfZml4ZWRDZWxsVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgcHJpdmF0ZSBfaXRlbTogVDtcbiAgcHJpdmF0ZSBfc2VsZWN0ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZGV0YWlsT3BlbkxhYmVsID0gJyc7XG4gIHByaXZhdGUgX2RldGFpbENsb3NlTGFiZWwgPSAnJztcbiAgcHJpdmF0ZSBfcm93U2VsZWN0aW9uTGFiZWwgPSAnJztcbiAgcHJpdmF0ZSB3cmFwcGVkSW5qZWN0b3I6IEluamVjdG9yO1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgLy8gQnkgZGVmYXVsdCwgZXZlcnkgaXRlbSBpcyBzZWxlY3RhYmxlOyBpdCBiZWNvbWVzIG5vdCBzZWxlY3RhYmxlIG9ubHkgaWYgaXQncyBleHBsaWNpdGx5IHNldCB0byBmYWxzZVxuICBwcml2YXRlIF9zZWxlY3RhYmxlOiBib29sZWFuIHwgc3RyaW5nID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgc2VsZWN0aW9uOiBTZWxlY3Rpb248VD4sXG4gICAgcHVibGljIHJvd0FjdGlvblNlcnZpY2U6IFJvd0FjdGlvblNlcnZpY2UsXG4gICAgcHVibGljIGdsb2JhbEV4cGFuZGFibGU6IEV4cGFuZGFibGVSb3dzQ291bnQsXG4gICAgcHVibGljIGV4cGFuZDogRGF0YWdyaWRJZkV4cGFuZFNlcnZpY2UsXG4gICAgcHVibGljIGRldGFpbFNlcnZpY2U6IERldGFpbFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBkaXNwbGF5TW9kZTogRGlzcGxheU1vZGVTZXJ2aWNlLFxuICAgIHByaXZhdGUgdmNyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIGVsOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwdWJsaWMgY29tbW9uU3RyaW5nczogQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBpdGVtczogSXRlbXMsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogYW55XG4gICkge1xuICAgIG5iUm93Kys7XG4gICAgdGhpcy5pZCA9ICdjbHItZGctcm93JyArIG5iUm93O1xuICAgIHRoaXMucmFkaW9JZCA9ICdjbHItZGctcm93LXJkJyArIG5iUm93O1xuICAgIHRoaXMuY2hlY2tib3hJZCA9ICdjbHItZGctcm93LWNiJyArIG5iUm93O1xuICAgIHRoaXMuZXhwYW5kYWJsZUlkID0gZXhwYW5kLmV4cGFuZGFibGVJZDtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgY29tYmluZUxhdGVzdChleHBhbmQucmVwbGFjZSwgZXhwYW5kLmV4cGFuZENoYW5nZSkuc3Vic2NyaWJlKChbZXhwYW5kUmVwbGFjZVZhbHVlLCBleHBhbmRDaGFuZ2VWYWx1ZV0pID0+IHtcbiAgICAgICAgaWYgKGV4cGFuZFJlcGxhY2VWYWx1ZSAmJiBleHBhbmRDaGFuZ2VWYWx1ZSkge1xuICAgICAgICAgIC8vIHJlcGxhY2VkIGFuZCBleHBhbmRpbmdcbiAgICAgICAgICB0aGlzLnJlcGxhY2VkID0gdHJ1ZTtcbiAgICAgICAgICByZW5kZXJlci5hZGRDbGFzcyhlbC5uYXRpdmVFbGVtZW50LCAnZGF0YWdyaWQtcm93LXJlcGxhY2VkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yZXBsYWNlZCA9IGZhbHNlO1xuICAgICAgICAgIC8vIEhhbmRsZXMgdGhlc2UgY2FzZXM6IG5vdCByZXBsYWNlZCBhbmQgY29sbGFwc2luZyAmIHJlcGxhY2VkIGFuZFxuICAgICAgICAgIC8vIGNvbGxhcHNpbmcgYW5kIG5vdCByZXBsYWNlZCBhbmQgZXhwYW5kaW5nLlxuICAgICAgICAgIHJlbmRlcmVyLnJlbW92ZUNsYXNzKGVsLm5hdGl2ZUVsZW1lbnQsICdkYXRhZ3JpZC1yb3ctcmVwbGFjZWQnKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vZGVsIG9mIHRoZSByb3csIHRvIHVzZSBmb3Igc2VsZWN0aW9uXG4gICAqL1xuICBASW5wdXQoJ2NsckRnSXRlbScpXG4gIGdldCBpdGVtKCk6IFQge1xuICAgIHJldHVybiB0aGlzLl9pdGVtO1xuICB9XG4gIHNldCBpdGVtKGl0ZW06IFQpIHtcbiAgICB0aGlzLl9pdGVtID0gaXRlbTtcbiAgICB0aGlzLml0ZW1DaGFuZ2VzLm5leHQoaXRlbSk7XG4gICAgdGhpcy5jbHJEZ1NlbGVjdGFibGUgPSB0aGlzLl9zZWxlY3RhYmxlO1xuICB9XG5cbiAgQElucHV0KCdjbHJEZ1NlbGVjdGFibGUnKVxuICBnZXQgY2xyRGdTZWxlY3RhYmxlKCkge1xuICAgIHJldHVybiAhdGhpcy5zZWxlY3Rpb24uaXNMb2NrZWQodGhpcy5pdGVtKTtcbiAgfVxuICBzZXQgY2xyRGdTZWxlY3RhYmxlKHZhbHVlOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuaXRlbSkge1xuICAgICAgdGhpcy5zZWxlY3Rpb24ubG9ja0l0ZW0odGhpcy5pdGVtLCB2YWx1ZSA9PT0gJ2ZhbHNlJyB8fCB2YWx1ZSA9PT0gZmFsc2UpO1xuICAgIH1cbiAgICAvLyBTdG9yZSB0aGlzIHZhbHVlIGxvY2FsbHksIHRvIGJlIGluaXRpYWxpemVkIHdoZW4gaXRlbSBpcyBpbml0aWFsaXplZFxuICAgIHRoaXMuX3NlbGVjdGFibGUgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgdGhlIHJvdyBpcyBzZWxlY3RlZFxuICAgKi9cbiAgQElucHV0KCdjbHJEZ1NlbGVjdGVkJylcbiAgZ2V0IHNlbGVjdGVkKCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLk5vbmUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uLmlzU2VsZWN0ZWQodGhpcy5pdGVtKTtcbiAgICB9XG4gIH1cbiAgc2V0IHNlbGVjdGVkKHZhbHVlOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuTm9uZSkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB2YWx1ZSBhcyBib29sZWFuO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmFsdWUgJiYgdGhpcy5zZWxlY3Rpb24uc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5NdWx0aSkge1xuICAgICAgICB0aGlzLnJhbmdlU2VsZWN0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbGVjdGlvbi5yYW5nZVN0YXJ0ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2VsZWN0aW9uLnNldFNlbGVjdGVkKHRoaXMuaXRlbSwgdmFsdWUgYXMgYm9vbGVhbik7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdjbHJEZ0V4cGFuZGVkJylcbiAgZ2V0IGV4cGFuZGVkKCkge1xuICAgIHJldHVybiB0aGlzLmV4cGFuZC5leHBhbmRlZDtcbiAgfVxuICBzZXQgZXhwYW5kZWQodmFsdWU6IGJvb2xlYW4gfCBzdHJpbmcpIHtcbiAgICB0aGlzLmV4cGFuZC5leHBhbmRlZCA9IHZhbHVlIGFzIGJvb2xlYW47XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgY2xyRGdEZXRhaWxPcGVuTGFiZWwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZGV0YWlsT3BlbkxhYmVsID8gdGhpcy5fZGV0YWlsT3BlbkxhYmVsIDogdGhpcy5jb21tb25TdHJpbmdzLmtleXMub3BlbjtcbiAgfVxuICBzZXQgY2xyRGdEZXRhaWxPcGVuTGFiZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRoaXMuX2RldGFpbE9wZW5MYWJlbCA9IGxhYmVsO1xuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IGNsckRnRGV0YWlsQ2xvc2VMYWJlbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9kZXRhaWxDbG9zZUxhYmVsID8gdGhpcy5fZGV0YWlsQ2xvc2VMYWJlbCA6IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmNsb3NlO1xuICB9XG4gIHNldCBjbHJEZ0RldGFpbENsb3NlTGFiZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRoaXMuX2RldGFpbENsb3NlTGFiZWwgPSBsYWJlbDtcbiAgfVxuXG4gIC8vIENERS0xNTE6IFJlbmFtZSB0aGlzIGZpZWxkIHRvIGNsckRnUm93U2VsZWN0aW9uTGFiZWwgaW4gdjE2XG4gIEBJbnB1dCgpXG4gIGdldCBjbHJEZ1Jvd1NlbGVjdGlvbkxhYmVsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3Jvd1NlbGVjdGlvbkxhYmVsID8gdGhpcy5fcm93U2VsZWN0aW9uTGFiZWwgOiB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5zZWxlY3Q7XG4gIH1cbiAgc2V0IGNsckRnUm93U2VsZWN0aW9uTGFiZWwobGFiZWw6IHN0cmluZykge1xuICAgIHRoaXMuX3Jvd1NlbGVjdGlvbkxhYmVsID0gbGFiZWw7XG4gIH1cblxuICBnZXQgX3ZpZXcoKSB7XG4gICAgcmV0dXJuIHRoaXMud3JhcHBlZEluamVjdG9yLmdldChXcmFwcGVkUm93LCB0aGlzLnZjcikucm93VmlldztcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMud3JhcHBlZEluamVjdG9yID0gbmV3IEhvc3RXcmFwcGVyKFdyYXBwZWRSb3csIHRoaXMudmNyKTtcbiAgICB0aGlzLnNlbGVjdGlvbi5sb2NrSXRlbSh0aGlzLml0ZW0sIHRoaXMuY2xyRGdTZWxlY3RhYmxlID09PSBmYWxzZSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5kZ0NlbGxzLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuZGdDZWxscy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICBpZiAoIWNlbGwuX3ZpZXcuZGVzdHJveWVkKSB7XG4gICAgICAgICAgdGhpcy5fc2Nyb2xsYWJsZUNlbGxzLmluc2VydChjZWxsLl92aWV3KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLmRpc3BsYXlNb2RlLnZpZXcuc3Vic2NyaWJlKHZpZXdDaGFuZ2UgPT4ge1xuICAgICAgICAvLyBMaXN0ZW4gZm9yIHZpZXcgY2hhbmdlcyBhbmQgbW92ZSBjZWxscyBhcm91bmQgZGVwZW5kaW5nIG9uIHRoZSBjdXJyZW50IGRpc3BsYXlUeXBlXG4gICAgICAgIC8vIHJlbW92ZSBjZWxsIHZpZXdzIGZyb20gZGlzcGxheSB2aWV3XG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl9zY3JvbGxhYmxlQ2VsbHMubGVuZ3RoOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgdGhpcy5fc2Nyb2xsYWJsZUNlbGxzLmRldGFjaCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJlbW92ZSBjZWxsIHZpZXdzIGZyb20gY2FsY3VsYXRlZCB2aWV3XG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl9jYWxjdWxhdGVkQ2VsbHMubGVuZ3RoOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgdGhpcy5fY2FsY3VsYXRlZENlbGxzLmRldGFjaCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2aWV3Q2hhbmdlID09PSBEYXRhZ3JpZERpc3BsYXlNb2RlLkNBTENVTEFURSkge1xuICAgICAgICAgIHRoaXMuZGlzcGxheUNlbGxzID0gZmFsc2U7XG4gICAgICAgICAgLy8gSW5zZXJ0cyBhIGZpeGVkIGNlbGwgaWYgYW55IG9mIHRoZXNlIGNvbmRpdGlvbnMgYXJlIHRydWUuXG4gICAgICAgICAgY29uc3QgZml4ZWRDZWxsQ29uZGl0aW9ucyA9IFtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uLnNlbGVjdGlvblR5cGUgIT09IHRoaXMuU0VMRUNUSU9OX1RZUEUuTm9uZSxcbiAgICAgICAgICAgIHRoaXMucm93QWN0aW9uU2VydmljZS5oYXNBY3Rpb25hYmxlUm93LFxuICAgICAgICAgICAgdGhpcy5nbG9iYWxFeHBhbmRhYmxlLmhhc0V4cGFuZGFibGVSb3csXG4gICAgICAgICAgICB0aGlzLmRldGFpbFNlcnZpY2UuZW5hYmxlZCxcbiAgICAgICAgICBdO1xuICAgICAgICAgIGZpeGVkQ2VsbENvbmRpdGlvbnNcbiAgICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgICAgICAgIC5mb3JFYWNoKCgpID0+IHRoaXMuX2NhbGN1bGF0ZWRDZWxscy5pbnNlcnQodGhpcy5fZml4ZWRDZWxsVGVtcGxhdGUuY3JlYXRlRW1iZWRkZWRWaWV3KG51bGwpKSk7XG4gICAgICAgICAgdGhpcy5kZ0NlbGxzLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICBpZiAoIWNlbGwuX3ZpZXcuZGVzdHJveWVkKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZWRDZWxscy5pbnNlcnQoY2VsbC5fdmlldyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5kaXNwbGF5Q2VsbHMgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuZGdDZWxscy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgaWYgKCFjZWxsLl92aWV3LmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxhYmxlQ2VsbHMuaW5zZXJ0KGNlbGwuX3ZpZXcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHRoaXMuZXhwYW5kLmFuaW1hdGUuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5leHBhbmRBbmltYXRpb25UcmlnZ2VyID0gIXRoaXMuZXhwYW5kQW5pbWF0aW9uVHJpZ2dlcjtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKChzdWI6IFN1YnNjcmlwdGlvbikgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgdG9nZ2xlKHNlbGVjdGVkID0gIXRoaXMuc2VsZWN0ZWQpIHtcbiAgICBpZiAoc2VsZWN0ZWQgIT09IHRoaXMuc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSBzZWxlY3RlZDtcbiAgICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2VkLmVtaXQoc2VsZWN0ZWQpO1xuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZUV4cGFuZCgpIHtcbiAgICBpZiAodGhpcy5leHBhbmQuZXhwYW5kYWJsZSkge1xuICAgICAgdGhpcy5leHBhbmRBbmltYXRpb24udXBkYXRlU3RhcnRIZWlnaHQoKTtcbiAgICAgIHRoaXMuZXhwYW5kZWQgPSAhdGhpcy5leHBhbmRlZDtcbiAgICAgIHRoaXMuZXhwYW5kZWRDaGFuZ2UuZW1pdCh0aGlzLmV4cGFuZGVkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIGRlZmF1bHQgYmVoYXZpb3IgaW4gQ2hyb21lIGFuZCBGaXJlZm94IGZvciBzaGlmdC1jbGlja2luZyBvbiBhIGxhYmVsIGlzIHRvIHBlcmZvcm0gdGV4dC1zZWxlY3Rpb24uXG4gICAqIFRoaXMgcHJldmVudHMgb3VyIGludGVuZGVkIHJhbmdlLXNlbGVjdGlvbiwgYmVjYXVzZSB0aGlzIHRleHQtc2VsZWN0aW9uIG92ZXJyaWRlcyBvdXIgc2hpZnQtY2xpY2sgZXZlbnQuXG4gICAqIFdlIG5lZWQgdG8gY2xlYXIgdGhlIHN0b3JlZCBzZWxlY3Rpb24gcmFuZ2Ugd2hlbiBzaGlmdC1jbGlja2luZy4gVGhpcyB3aWxsIG92ZXJyaWRlIHRoZSBtb3N0bHkgdW51c2VkIHNoaWZ0LWNsaWNrXG4gICAqIHNlbGVjdGlvbiBicm93c2VyIGZ1bmN0aW9uYWxpdHksIHdoaWNoIGlzIGluY29uc2lzdGVudGx5IGltcGxlbWVudGVkIGluIGJyb3dzZXJzIGFueXdheS5cbiAgICovXG4gIGNsZWFyUmFuZ2VzKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uLnJvd1NlbGVjdGlvbk1vZGUgJiYgZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgIHRoaXMuZG9jdW1lbnQuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICAvLyBGaXJlZm94IGlzIHRvbyBwZXJzaXN0ZW50IGFib3V0IGl0cyB0ZXh0LXNlbGVjdGlvbiBiZWhhdmlvdXIuIFNvIHdlIG5lZWQgdG8gYWRkIGEgcHJldmVudERlZmF1bHQoKTtcbiAgICAgIC8vIFdlIHNob3VsZCBub3QgdHJ5IHRvIGVuZm9yY2UgdGhpcyBvbiB0aGUgb3RoZXIgYnJvd3NlcnMsIHRob3VnaCwgYmVjYXVzZSB0aGVpciB0b2dnbGUgY3ljbGUgZG9lcyBub3QgZ2V0IGNhbmNlbGVkIGJ5XG4gICAgICAvLyB0aGUgcHJldmVudERlZmF1bHQoKSBhbmQgdGhleSB0b2dnbGUgdGhlIGNoZWNrYm94IHNlY29uZCB0aW1lLCBlZmZlY3RpdmVseSByZXRydXJuaW5nIGl0IHRvIG5vdC1zZWxlY3RlZC5cbiAgICAgIGlmICh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdGaXJlZm94JykgIT09IC0xKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMudG9nZ2xlKHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCByZWxhdGVkIHRvIGNsckRnUm93U2VsZWN0aW9uLCB3aGljaCBpcyBkZXByZWNhdGVkXG4gICAqL1xuICBwcm90ZWN0ZWQgc2VsZWN0Um93KHNlbGVjdGVkID0gIXRoaXMuc2VsZWN0ZWQsICRldmVudCkge1xuICAgIC8vIFRoZSBsYWJlbCBhbHNvIGNhcHR1cmVzIGNsaWNrcyB0aGF0IGJ1YmJsZSB1cCB0byB0aGUgcm93IGV2ZW50IGxpc3RlbmVyLCBjYXVzaW5nXG4gICAgLy8gdGhpcyBoYW5kbGVyIHRvIHJ1biB0d2ljZS4gVGhpcyBleGl0cyBlYXJseSB0byBwcmV2ZW50IHRvZ2dsaW5nIHRoZSBjaGVja2JveCB0d2ljZS5cbiAgICBpZiAoIXRoaXMuc2VsZWN0aW9uLnJvd1NlbGVjdGlvbk1vZGUgfHwgJGV2ZW50LnRhcmdldC50YWdOYW1lID09PSAnTEFCRUwnIHx8ICF0aGlzLl9zZWxlY3RhYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID09PSB0aGlzLlNFTEVDVElPTl9UWVBFLlNpbmdsZSkge1xuICAgICAgdGhpcy5zZWxlY3Rpb24uY3VycmVudFNpbmdsZSA9IHRoaXMuaXRlbTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50b2dnbGUoc2VsZWN0ZWQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmFuZ2VTZWxlY3QoKSB7XG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zLmRpc3BsYXllZDtcbiAgICBpZiAoIWl0ZW1zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHN0YXJ0SXggPSBpdGVtcy5pbmRleE9mKHRoaXMuc2VsZWN0aW9uLnJhbmdlU3RhcnQpO1xuICAgIGlmIChcbiAgICAgIHRoaXMuc2VsZWN0aW9uLnJhbmdlU3RhcnQgJiZcbiAgICAgIHRoaXMuc2VsZWN0aW9uLmN1cnJlbnQuaW5jbHVkZXModGhpcy5zZWxlY3Rpb24ucmFuZ2VTdGFydCkgJiZcbiAgICAgIHRoaXMuc2VsZWN0aW9uLnNoaWZ0UHJlc3NlZCAmJlxuICAgICAgc3RhcnRJeCAhPT0gLTFcbiAgICApIHtcbiAgICAgIGNvbnN0IGVuZEl4ID0gaXRlbXMuaW5kZXhPZih0aGlzLml0ZW0pO1xuICAgICAgLy8gVXNpbmcgU2V0IHRvIHJlbW92ZSBkdXBsaWNhdGVzXG4gICAgICBjb25zdCBuZXdTZWxlY3Rpb24gPSBuZXcgU2V0KFxuICAgICAgICB0aGlzLnNlbGVjdGlvbi5jdXJyZW50LmNvbmNhdChpdGVtcy5zbGljZShNYXRoLm1pbihzdGFydEl4LCBlbmRJeCksIE1hdGgubWF4KHN0YXJ0SXgsIGVuZEl4KSArIDEpKVxuICAgICAgKTtcbiAgICAgIHRoaXMuc2VsZWN0aW9uLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICB0aGlzLnNlbGVjdGlvbi5jdXJyZW50LnB1c2goLi4ubmV3U2VsZWN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcGFnZSBudW1iZXIgaGFzIGNoYW5nZWQgb3JcbiAgICAgIC8vIG5vIFNoaWZ0IHdhcyBwcmVzc2VkIG9yXG4gICAgICAvLyByYW5nZVN0YXJ0IG5vdCB5ZXQgc2V0XG4gICAgICB0aGlzLnNlbGVjdGlvbi5yYW5nZVN0YXJ0ID0gdGhpcy5pdGVtO1xuICAgIH1cbiAgfVxufVxuIiwiPGRpdlxuICByb2xlPVwicm93XCJcbiAgW2lkXT1cImlkXCJcbiAgY2xhc3M9XCJkYXRhZ3JpZC1yb3ctbWFzdGVyIGRhdGFncmlkLXJvdy1mbGV4XCJcbiAgW2NsckV4cGFuZGFibGVBbmltYXRpb25dPVwiZXhwYW5kQW5pbWF0aW9uVHJpZ2dlclwiXG4gIChtb3VzZWRvd24pPVwiY2xlYXJSYW5nZXMoJGV2ZW50KVwiXG4gIChjbGljayk9XCJzZWxlY3RSb3coIXNlbGVjdGVkLCAkZXZlbnQpXCJcbiAgW2NsYXNzLmRhdGFncmlkLXJvdy1jbGlja2FibGVdPVwic2VsZWN0aW9uLnJvd1NlbGVjdGlvbk1vZGVcIlxuICBbY2xhc3MuZGF0YWdyaWQtcm93LWRldGFpbC1vcGVuXT1cImRldGFpbFNlcnZpY2UuaXNSb3dPcGVuKGl0ZW0pXCJcbj5cbiAgPGRpdiBjbGFzcz1cImRhdGFncmlkLXJvdy1zdGlja3lcIj5cbiAgICA8IS0tIFN0aWNreSBlbGVtZW50cyBoZXJlIC0tPlxuICAgIDxuZy1jb250YWluZXIgI3N0aWNreUNlbGxzPlxuICAgICAgPGRpdlxuICAgICAgICAqbmdJZj1cInNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID09PSBTRUxFQ1RJT05fVFlQRS5NdWx0aVwiXG4gICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtc2VsZWN0IGRhdGFncmlkLWZpeGVkLWNvbHVtbiBkYXRhZ3JpZC1jZWxsXCJcbiAgICAgICAgW25nQ2xhc3NdPVwieyAnY2xyLWZvcm0tY29udHJvbC1kaXNhYmxlZCc6ICFjbHJEZ1NlbGVjdGFibGUgfVwiXG4gICAgICAgIHJvbGU9XCJncmlkY2VsbFwiXG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjbHItY2hlY2tib3gtd3JhcHBlclwiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgW25nTW9kZWxdPVwic2VsZWN0ZWRcIlxuICAgICAgICAgICAgKG5nTW9kZWxDaGFuZ2UpPVwidG9nZ2xlKCRldmVudClcIlxuICAgICAgICAgICAgW2lkXT1cImNoZWNrYm94SWRcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImNsckRnU2VsZWN0YWJsZSA/IG51bGwgOiB0cnVlXCJcbiAgICAgICAgICAgIFthdHRyLmFyaWEtZGlzYWJsZWRdPVwiY2xyRGdTZWxlY3RhYmxlID8gbnVsbCA6IHRydWVcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPCEtLSBVc2FnZSBvZiBjbGFzcyBjbHItY29sLW51bGwgaGVyZSBwcmV2ZW50cyBjbHItY29sLSogY2xhc3NlcyBmcm9tIGJlaW5nIGFkZGVkIHdoZW4gYSBkYXRhZ3JpZCBpcyB3cmFwcGVkIGluc2lkZSBjbHJGb3JtIC0tPlxuICAgICAgICAgIDxsYWJlbCBbZm9yXT1cImNoZWNrYm94SWRcIiBjbGFzcz1cImNsci1jb250cm9sLWxhYmVsIGNsci1jb2wtbnVsbFwiIChjbGljayk9XCJjbGVhclJhbmdlcygkZXZlbnQpXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNsci1zci1vbmx5XCI+e3tjbHJEZ1Jvd1NlbGVjdGlvbkxhYmVsIHx8IGNvbW1vblN0cmluZ3Mua2V5cy5zZWxlY3R9fTwvc3Bhbj5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdlxuICAgICAgICAqbmdJZj1cInNlbGVjdGlvbi5zZWxlY3Rpb25UeXBlID09PSBTRUxFQ1RJT05fVFlQRS5TaW5nbGVcIlxuICAgICAgICBjbGFzcz1cImRhdGFncmlkLXNlbGVjdCBkYXRhZ3JpZC1maXhlZC1jb2x1bW4gZGF0YWdyaWQtY2VsbFwiXG4gICAgICAgIFtuZ0NsYXNzXT1cInsgJ2Nsci1mb3JtLWNvbnRyb2wtZGlzYWJsZWQnOiAhY2xyRGdTZWxlY3RhYmxlIH1cIlxuICAgICAgICByb2xlPVwiZ3JpZGNlbGxcIlxuICAgICAgPlxuICAgICAgICA8Y2xyLXJhZGlvLXdyYXBwZXI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgICAgICAgIHR5cGU9XCJyYWRpb1wiXG4gICAgICAgICAgICBjbHJSYWRpb1xuICAgICAgICAgICAgW2lkXT1cInJhZGlvSWRcIlxuICAgICAgICAgICAgW25hbWVdPVwic2VsZWN0aW9uLmlkICsgJy1yYWRpbydcIlxuICAgICAgICAgICAgW3ZhbHVlXT1cIml0ZW1cIlxuICAgICAgICAgICAgWyhuZ01vZGVsKV09XCJzZWxlY3Rpb24uY3VycmVudFNpbmdsZVwiXG4gICAgICAgICAgICBbY2hlY2tlZF09XCJzZWxlY3Rpb24uY3VycmVudFNpbmdsZSA9PT0gaXRlbVwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiY2xyRGdTZWxlY3RhYmxlID8gbnVsbCA6IHRydWVcIlxuICAgICAgICAgICAgW2F0dHIuYXJpYS1kaXNhYmxlZF09XCJjbHJEZ1NlbGVjdGFibGUgPyBudWxsIDogdHJ1ZVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjbHItY29udHJvbC1sYWJlbCBjbHItY29sLW51bGxcIiBbZm9yXT1cInJhZGlvSWRcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57eyBjbHJEZ1Jvd1NlbGVjdGlvbkxhYmVsIHx8IGNvbW1vblN0cmluZ3Mua2V5cy5zZWxlY3QgfX08L3NwYW4+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9jbHItcmFkaW8td3JhcHBlcj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdlxuICAgICAgICAqbmdJZj1cInJvd0FjdGlvblNlcnZpY2UuaGFzQWN0aW9uYWJsZVJvd1wiXG4gICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtcm93LWFjdGlvbnMgZGF0YWdyaWQtZml4ZWQtY29sdW1uIGRhdGFncmlkLWNlbGxcIlxuICAgICAgICByb2xlPVwiZ3JpZGNlbGxcIlxuICAgICAgPlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItZGctYWN0aW9uLW92ZXJmbG93XCI+PC9uZy1jb250ZW50PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2XG4gICAgICAgICpuZ0lmPVwiZ2xvYmFsRXhwYW5kYWJsZS5oYXNFeHBhbmRhYmxlUm93XCJcbiAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1leHBhbmRhYmxlLWNhcmV0IGRhdGFncmlkLWZpeGVkLWNvbHVtbiBkYXRhZ3JpZC1jZWxsXCJcbiAgICAgICAgcm9sZT1cImdyaWRjZWxsXCJcbiAgICAgID5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImV4cGFuZC5leHBhbmRhYmxlXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgICAgICAgICAqbmdJZj1cIiFleHBhbmQubG9hZGluZ1wiXG4gICAgICAgICAgICAoY2xpY2spPVwidG9nZ2xlRXhwYW5kKClcIlxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBjbGFzcz1cImRhdGFncmlkLWV4cGFuZGFibGUtY2FyZXQtYnV0dG9uXCJcbiAgICAgICAgICAgIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwiZXhwYW5kLmV4cGFuZGVkXCJcbiAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiZXhwYW5kLmV4cGFuZGVkID8gY2xyRGdEZXRhaWxDbG9zZUxhYmVsIDogY2xyRGdEZXRhaWxPcGVuTGFiZWxcIlxuICAgICAgICAgICAgW2F0dHIuYXJpYS1jb250cm9sc109XCJleHBhbmQuaGFzRXhwYW5kVGVtcGxhdGUgJiYgIWV4cGFuZC5leHBhbmRlZCA/IG51bGwgOiBleHBhbmRhYmxlSWRcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxjZHMtaWNvblxuICAgICAgICAgICAgICBzaGFwZT1cImFuZ2xlXCJcbiAgICAgICAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1leHBhbmRhYmxlLWNhcmV0LWljb25cIlxuICAgICAgICAgICAgICBbYXR0ci5kaXJlY3Rpb25dPVwiZXhwYW5kLmV4cGFuZGVkID8gJ2Rvd24nIDogJ3JpZ2h0J1wiXG4gICAgICAgICAgICAgIFthdHRyLnRpdGxlXT1cImV4cGFuZC5leHBhbmRlZCA/IGNvbW1vblN0cmluZ3Mua2V5cy5jb2xsYXBzZSA6IGNvbW1vblN0cmluZ3Mua2V5cy5leHBhbmRcIlxuICAgICAgICAgICAgPjwvY2RzLWljb24+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGNsci1zcGlubmVyICpuZ0lmPVwiZXhwYW5kLmxvYWRpbmdcIiBjbHJTbWFsbD57eyBjb21tb25TdHJpbmdzLmtleXMubG9hZGluZyB9fTwvY2xyLXNwaW5uZXI+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2XG4gICAgICAgICpuZ0lmPVwiZGV0YWlsU2VydmljZS5lbmFibGVkXCJcbiAgICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1kZXRhaWwtY2FyZXQgZGF0YWdyaWQtZml4ZWQtY29sdW1uIGRhdGFncmlkLWNlbGxcIlxuICAgICAgICByb2xlPVwiZ3JpZGNlbGxcIlxuICAgICAgPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgICAgICAgKGNsaWNrKT1cImRldGFpbFNlcnZpY2UudG9nZ2xlKGl0ZW0sIGRldGFpbEJ1dHRvbilcIlxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICNkZXRhaWxCdXR0b25cbiAgICAgICAgICBjbGFzcz1cImRhdGFncmlkLWRldGFpbC1jYXJldC1idXR0b25cIlxuICAgICAgICAgIFtkaXNhYmxlZF09XCJkZXRhaWxEaXNhYmxlZFwiXG4gICAgICAgICAgKm5nSWY9XCIhZGV0YWlsSGlkZGVuXCJcbiAgICAgICAgICBbY2xhc3MuaXMtb3Blbl09XCJkZXRhaWxTZXJ2aWNlLmlzUm93T3BlbihpdGVtKVwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJkZXRhaWxTZXJ2aWNlLmlzUm93T3BlbihpdGVtKSA/IGNsckRnRGV0YWlsQ2xvc2VMYWJlbCA6IGNsckRnRGV0YWlsT3BlbkxhYmVsXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWV4cGFuZGVkXT1cImRldGFpbFNlcnZpY2UuaXNSb3dPcGVuKGl0ZW0pXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWNvbnRyb2xzXT1cImRldGFpbFNlcnZpY2UuaWRcIlxuICAgICAgICAgIGFyaWEtaGFzcG9wdXA9XCJkaWFsb2dcIlxuICAgICAgICA+XG4gICAgICAgICAgPGNkcy1pY29uXG4gICAgICAgICAgICBzaGFwZT1cImFuZ2xlLWRvdWJsZVwiXG4gICAgICAgICAgICBbYXR0ci5kaXJlY3Rpb25dPVwiZGV0YWlsU2VydmljZS5pc1Jvd09wZW4oaXRlbSkgPyAnbGVmdCcgOiAncmlnaHQnXCJcbiAgICAgICAgICAgIGNsYXNzPVwiZGF0YWdyaWQtZGV0YWlsLWNhcmV0LWljb25cIlxuICAgICAgICAgICAgW2F0dHIudGl0bGVdPVwiZGV0YWlsU2VydmljZS5pc1Jvd09wZW4oaXRlbSkgPyBjb21tb25TdHJpbmdzLmtleXMuY2xvc2U6IGNvbW1vblN0cmluZ3Mua2V5cy5vcGVuXCJcbiAgICAgICAgICA+PC9jZHMtaWNvbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8IS0tIHBsYWNlaG9sZGVyIGZvciBwcm9qZWN0aW5nIG90aGVyIHN0aWNreSBjZWxscyBhcyBwaW5uZWQtLT5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1yb3ctc2Nyb2xsYWJsZVwiIFtuZ0NsYXNzXT1cInsnaXMtcmVwbGFjZWQnOiByZXBsYWNlZCAmJiBleHBhbmRlZH1cIj5cbiAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtc2Nyb2xsaW5nLWNlbGxzXCI+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItZGctY2VsbFwiPjwvbmctY29udGVudD5cbiAgICAgIDxuZy1jb250YWluZXIgI3Njcm9sbGFibGVDZWxscz48L25nLWNvbnRhaW5lcj5cbiAgICA8L2Rpdj5cbiAgICA8IS0tIGRldGFpbHMgaGVyZSB3aGVuIHJlcGxhY2UsIHJlLXZpc2l0IHdoZW4gc3RpY2t5IGNvbnRhaW5lciBpcyB1c2VkIGZvciBwaW5uZWQgY2VsbHMgLS0+XG4gICAgPG5nLXRlbXBsYXRlICpuZ0lmPVwicmVwbGFjZWQgJiYgIWV4cGFuZC5sb2FkaW5nXCIgW25nVGVtcGxhdGVPdXRsZXRdPVwiZGV0YWlsXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctdGVtcGxhdGUgKm5nSWY9XCIhcmVwbGFjZWQgJiYgIWV4cGFuZC5sb2FkaW5nXCIgW25nVGVtcGxhdGVPdXRsZXRdPVwiZGV0YWlsXCI+PC9uZy10ZW1wbGF0ZT5cbiAgPC9kaXY+XG48L2Rpdj5cbjwhLS1cbiAgICBXZSBuZWVkIHRoZSBcInByb2plY3QgaW50byB0ZW1wbGF0ZVwiIGhhY2tzIGJlY2F1c2Ugd2UgbmVlZCB0aGlzIGluIDIgZGlmZmVyZW50IHBsYWNlc1xuICAgIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZSBkZXRhaWxzIHJlcGxhY2UgdGhlIHJvdyBvciBub3QuXG4tLT5cbjxuZy10ZW1wbGF0ZSAjZGV0YWlsPlxuICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItZGctcm93LWRldGFpbFwiPjwvbmctY29udGVudD5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy1jb250YWluZXIgI2NhbGN1bGF0ZWRDZWxscz48L25nLWNvbnRhaW5lcj5cblxuPG5nLXRlbXBsYXRlICNmaXhlZENlbGxUZW1wbGF0ZT5cbiAgPGRpdiBjbGFzcz1cImRhdGFncmlkLWZpeGVkLWNvbHVtbiBkYXRhZ3JpZC1jZWxsXCIgcm9sZT1cImdyaWRjZWxsXCI+PC9kaXY+XG48L25nLXRlbXBsYXRlPlxuIl19
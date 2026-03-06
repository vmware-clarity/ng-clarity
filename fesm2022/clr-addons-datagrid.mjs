import * as i0 from '@angular/core';
import { Directive, EventEmitter, ElementRef, Output, Input, ViewChildren, Component, Injectable, InjectionToken, Optional, Inject, Host, HostListener, HostBinding, ViewChild, ViewContainerRef, Pipe, forwardRef, ChangeDetectionStrategy, NgModule, SkipSelf } from '@angular/core';
import * as i4 from '@clr/addons/a11y';
import { ZoomLevel, AppfxA11yModule } from '@clr/addons/a11y';
import { BehaviorSubject, interval, Subject, Subscription, map, asyncScheduler, combineLatest } from 'rxjs';
import { debounce, filter, observeOn, takeUntil, first } from 'rxjs/operators';
import * as i2 from '@clr/angular/icon';
import { ClarityIcons, dragHandleIcon, ClrIcon } from '@clr/angular/icon';
import * as i3 from '@clr/angular/popover/dropdown';
import { ClrDropdownModule } from '@clr/angular/popover/dropdown';
import * as i2$1 from '@clr/angular/popover/common';
import * as i5 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i5$2 from '@clr/addons/datagrid-filters';
import { AppfxDatagridFiltersModule } from '@clr/addons/datagrid-filters';
import * as i3$3 from '@clr/addons/drag-and-drop';
import * as i9 from '@clr/angular/data/datagrid';
import { ClrDatagridSortOrder, SelectionType, selectionTypeAttribute, ClrDatagridPagination, ClrDatagrid, ClrDatagridModule } from '@clr/angular/data/datagrid';
import * as i6 from '@angular/cdk/drag-drop';
import { moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import * as i4$1 from '@clr/angular/forms/common';
import * as i10 from '@clr/angular/utils';
import * as i3$1 from '@clr/angular/forms';
import { ClrCheckboxModule, ClrInputModule } from '@clr/angular/forms';
import * as i3$2 from '@angular/cdk/overlay';
import { ConnectionPositionPair, OverlayModule } from '@angular/cdk/overlay';
import * as i2$2 from '@angular/cdk/a11y';
import { A11yModule } from '@angular/cdk/a11y';
import * as i5$1 from '@clr/angular/utils/loading';
import { ClrLoadingModule } from '@clr/angular/utils/loading';
import { FormsModule } from '@angular/forms';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * A directive that fixes position of the clarity dropdown menu opened
 * when actions in appfx-datagrid-action-bar are collapsed and opened in a
 * menu. Since the dropdown trigger button could be center or left aligned -
 * depending on the available horizontal space and length of the action
 * names that are collapsed, sometimes the menu could go out of left
 * boundaries of its parent container. To prevent this the directive ensures
 * the dropdown menu does not get a negative `translateX` property for the
 * `transform` style.
 *
 * The directive requires ongoing maintenance and support as this peers deep in the Clarity tab internals
 */
class DatagridActionBarDropdownRepositionDirective {
    constructor(elementRef) {
        this.elementRef = elementRef;
        // minimal `translateX` property of transform style of the dropdown menu
        // that ensures the dropdown menu is not opened out of left boundaries of
        // its parent container
        this.menuMinTranslateX = 10;
    }
    ngAfterViewInit() {
        const computedStyle = getComputedStyle(this.elementRef.nativeElement);
        const matrix = new DOMMatrix(computedStyle.transform);
        const originalTranslateX = matrix.m41;
        const translateY = matrix.m42;
        const newTranslateX = Math.max(this.menuMinTranslateX, originalTranslateX);
        // override default `translateX` property
        this.elementRef.nativeElement.style.transform = `translateX(${newTranslateX}px) translateY(${translateY}px)`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridActionBarDropdownRepositionDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: DatagridActionBarDropdownRepositionDirective, isStandalone: false, selector: "[dropdownMenuReposition]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridActionBarDropdownRepositionDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[dropdownMenuReposition]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const resources = {
    dropdownToggleWidthInRem: 3, // '...' button occupies max dropdownToggleWidthInRem rems in width
    layoutChangesDebounceDuration: 10,
};
class DatagridActionBarComponent {
    #subscription;
    constructor(cdr, el, elementResizeService) {
        this.cdr = cdr;
        this.el = el;
        this.elementResizeService = elementResizeService;
        this.btnLayout = 'flex';
        this.dropdownOrientation = 'bottom-left';
        this.invokeAction = new EventEmitter();
        this.actionsSubject = new BehaviorSubject([]);
        this.actions$ = this.actionsSubject.asObservable();
        this.isDropdownOpened = false;
        this.listOfWidths = [];
    }
    ngOnInit() {
        this.updateLayout();
    }
    ngAfterViewInit() {
        const resize$ = this.elementResizeService.getResizeObservable(this.el.nativeElement);
        this.#subscription = resize$
            .pipe(debounce(() => interval(resources.layoutChangesDebounceDuration)))
            .subscribe(() => this.updateLayout());
        this.updateLayout();
    }
    ngOnDestroy() {
        if (this.#subscription && !this.#subscription.closed) {
            this.#subscription.unsubscribe();
        }
    }
    ngOnChanges(changes) {
        if (changes['actions'] && changes['actions'].currentValue) {
            if (this.isActionsIdsEqual(changes['actions'])) {
                this.restoreVisible(changes['actions'].previousValue);
            }
            else {
                // actions with different ids are treated as a new list of actions
                this.initActionsVisibility();
                // update the width of each action btn with the new one
                this.cdr.detectChanges();
                this.updateListOfWidths();
                this.updateLayout();
            }
        }
    }
    getDropdownActions() {
        return this.actions.filter((action) => !action.isVisible);
    }
    hasDropdownActions() {
        return this.getDropdownActions().length > 0;
    }
    onActionClick(action) {
        if (action.enabled) {
            this.invokeAction.emit(action);
        }
    }
    /**
     * Derives the base root element size (REM) in pixels.
     */
    deriveBaseRootElementSize() {
        return parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('font-size'), 10);
    }
    isActionsIdsEqual(change) {
        if (!change.previousValue) {
            return false;
        }
        const a = change.currentValue;
        const b = change.previousValue;
        const aLength = a.length;
        const bLength = b.length;
        if (aLength !== bLength) {
            return false;
        }
        return (a.reduce((length, aValue, i) => (aValue.id === b[i].id ? length - 1 : length), aLength) === 0);
    }
    initActionsVisibility() {
        this.actions.forEach((action) => {
            if (action.isVisible !== false) {
                action.isVisible = true;
            }
        });
        this.actionsSubject.next(this.actions);
    }
    restoreVisible(fromPrevious) {
        if (fromPrevious.length !== this.actions.length) {
            return;
        }
        fromPrevious.forEach((action, i) => (this.actions[i].isVisible = action.isVisible));
        this.actionsSubject.next(this.actions);
    }
    updateListOfWidths() {
        this.listOfWidths.length = 0;
        this.queryActionBtnElementList.forEach(btnElementRef => this.listOfWidths.push(btnElementRef.nativeElement.offsetWidth));
    }
    updateLayout() {
        // If offset is 0, the element is not yet fully loaded, so no need to update the layout
        if (this.el.nativeElement.offsetWidth) {
            const dropdownToggleWidthInPx = this.deriveBaseRootElementSize() * resources.dropdownToggleWidthInRem;
            const maxWidth = this.el.nativeElement.offsetWidth - dropdownToggleWidthInPx;
            // choose which action button is within the dropdown or not
            let totalWidth = 0;
            this.listOfWidths.forEach((actionBtnWidth, i) => {
                totalWidth += actionBtnWidth;
                this.actions[i].isVisible = totalWidth < maxWidth;
            });
            // if the dropdown is opened while the browser window is resized then collapse the dropdown
            if (this.isDropdownOpened) {
                this.isDropdownOpened = false;
            }
            this.actionsSubject.next(this.actions);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridActionBarComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i4.ElementResizeService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: DatagridActionBarComponent, isStandalone: false, selector: "appfx-datagrid-action-bar", inputs: { actions: "actions", btnLayout: "btnLayout", dropdownOrientation: "dropdownOrientation" }, outputs: { invokeAction: "invokeAction" }, viewQueries: [{ propertyName: "queryActionBtnElementList", predicate: ["actionBtn"], descendants: true, read: ElementRef }], usesOnChanges: true, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"btn-group\" [ngClass]=\"{ 'btn-flex': btnLayout === 'flex', 'btn-inline': btnLayout === 'inline' }\">\n  @for (action of actions$ | async; track action; let i = $index) {\n    @if (action.children && action.isVisible) {\n      <clr-dropdown [clrCloseMenuOnItemClick]=\"true\" #actionBtn [class]=\"i === 0 ? 'has-border-left' : ''\">\n        <button\n          type=\"button\"\n          clrDropdownTrigger\n          [title]=\"action.tooltip\"\n          [attr.data-test-id]=\"action.id\"\n          [disabled]=\"!action.enabled\"\n          [ngClass]=\"action.class\"\n        >\n          {{ action.label }}\n          <cds-icon shape=\"angle\" direction=\"down\"></cds-icon>\n        </button>\n        <clr-dropdown-menu *clrIfOpen [clrPosition]=\"dropdownOrientation\">\n          @for (childAction of action.children; track childAction) {\n            <button\n              clrDropdownItem\n              type=\"button\"\n              (click)=\"onActionClick(childAction)\"\n              [title]=\"childAction.tooltip\"\n              [attr.data-test-id]=\"childAction.id\"\n              [clrDisabled]=\"!childAction.enabled\"\n              [ngClass]=\"childAction.class\"\n            >\n              {{ childAction.label }}\n            </button>\n          }\n        </clr-dropdown-menu>\n      </clr-dropdown>\n    }\n    @if (!action.children && action.isVisible) {\n      <button\n        type=\"button\"\n        #actionBtn\n        (click)=\"onActionClick(action)\"\n        [title]=\"action.tooltip\"\n        [attr.data-test-id]=\"action.id\"\n        [disabled]=\"!action.enabled\"\n        [attr.aria-label]=\"action.ariaLabel\"\n        [ngClass]=\"action.class\"\n      >\n        {{ action.label }}\n      </button>\n    }\n  }\n\n  <!-- Process the hidden actions due to not enough space on the screen -->\n  @if (hasDropdownActions()) {\n    <clr-dropdown class=\"dropdown-container\" [clrCloseMenuOnItemClick]=\"true\">\n      <button type=\"button\" clrDropdownTrigger [ngClass]=\"actions[0].class\">\n        <cds-icon shape=\"ellipsis-horizontal\"></cds-icon>\n      </button>\n      <ng-template [(clrIfOpen)]=\"isDropdownOpened\">\n        <clr-dropdown-menu clrPosition=\"bottom-right\" dropdownMenuReposition>\n          @for (action of getDropdownActions(); track action) {\n            <!-- Action has children - show a nested dropdown -->\n            @if (action.children) {\n              <clr-dropdown [clrCloseMenuOnItemClick]=\"true\" #actionBtn>\n                <button\n                  type=\"button\"\n                  clrDropdownTrigger\n                  class=\"\"\n                  [title]=\"action.tooltip\"\n                  [attr.data-test-id]=\"action.id\"\n                  [disabled]=\"!action.enabled\"\n                  [attr.aria-label]=\"action.ariaLabel\"\n                  [ngClass]=\"action.class\"\n                >\n                  {{ action.label }}\n                  <clr-icon shape=\"caret down\"></clr-icon>\n                </button>\n                <clr-dropdown-menu *clrIfOpen clrPosition=\"bottom-right\">\n                  @for (childAction of action.children; track childAction) {\n                    <button\n                      clrDropdownItem\n                      type=\"button\"\n                      (click)=\"onActionClick(childAction)\"\n                      [title]=\"childAction.tooltip\"\n                      [attr.data-test-id]=\"childAction.id\"\n                      [clrDisabled]=\"!childAction.enabled\"\n                      [attr.aria-label]=\"action.ariaLabel\"\n                      [ngClass]=\"childAction.class\"\n                    >\n                      {{ childAction.label }}\n                    </button>\n                  }\n                </clr-dropdown-menu>\n              </clr-dropdown>\n            }\n            <!-- Action has no children -->\n            @if (!action.children) {\n              <button\n                clrDropdownItem\n                type=\"button\"\n                (click)=\"onActionClick(action)\"\n                [title]=\"action.tooltip\"\n                [attr.data-test-id]=\"action.id\"\n                [attr.aria-label]=\"action.ariaLabel\"\n                [disabled]=\"!action.enabled\"\n                [ngClass]=\"action.class\"\n              >\n                {{ action.label }}\n              </button>\n            }\n          }\n        </clr-dropdown-menu>\n      </ng-template>\n    </clr-dropdown>\n  }\n</div>\n", styles: [":host .dropdown-container{margin-left:auto}:host div.btn-group{width:100%;margin-right:0}:host div.btn-group.btn-inline{display:inline-block}:host button{flex:0 0 auto;max-width:unset}:host clr-dropdown button.dropdown-toggle{color:var(--clr-btn-default-color)}:host clr-dropdown.has-border-left button.dropdown-toggle{border-left-style:solid!important;border-left-width:1px!important}:host clr-dropdown-menu{max-width:18rem}:host clr-dropdown-menu button{overflow-wrap:break-word;word-break:normal;white-space:normal}:host-context(.zoom4x) clr-dropdown-menu{margin-right:.8rem}:host-context(.zoom4x) .dropdown-container{margin-left:0}:host-context(.zoom4x) div.btn-group .btn-flex{display:flex;flex-direction:row;justify-content:flex-start}:host-context(.zoom4x) div.btn-group .btn-inline{display:inline-block}:host-context(.zoom4x) div.btn-group button{padding-left:10px}\n"], dependencies: [{ kind: "component", type: i2.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "component", type: i3.ClrDropdown, selector: "clr-dropdown", inputs: ["clrCloseMenuOnItemClick"] }, { kind: "component", type: i3.ClrDropdownMenu, selector: "clr-dropdown-menu", inputs: ["clrPosition"] }, { kind: "directive", type: i3.ClrDropdownTrigger, selector: "[clrDropdownTrigger],[clrDropdownToggle]" }, { kind: "directive", type: i3.ClrDropdownItem, selector: "[clrDropdownItem]", inputs: ["clrDisabled", "id"] }, { kind: "directive", type: i2$1.ClrIfOpen, selector: "[clrIfOpen]", inputs: ["clrIfOpen"], outputs: ["clrIfOpenChange"] }, { kind: "directive", type: i5.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: DatagridActionBarDropdownRepositionDirective, selector: "[dropdownMenuReposition]" }, { kind: "pipe", type: i5.AsyncPipe, name: "async" }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridActionBarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-datagrid-action-bar', standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"btn-group\" [ngClass]=\"{ 'btn-flex': btnLayout === 'flex', 'btn-inline': btnLayout === 'inline' }\">\n  @for (action of actions$ | async; track action; let i = $index) {\n    @if (action.children && action.isVisible) {\n      <clr-dropdown [clrCloseMenuOnItemClick]=\"true\" #actionBtn [class]=\"i === 0 ? 'has-border-left' : ''\">\n        <button\n          type=\"button\"\n          clrDropdownTrigger\n          [title]=\"action.tooltip\"\n          [attr.data-test-id]=\"action.id\"\n          [disabled]=\"!action.enabled\"\n          [ngClass]=\"action.class\"\n        >\n          {{ action.label }}\n          <cds-icon shape=\"angle\" direction=\"down\"></cds-icon>\n        </button>\n        <clr-dropdown-menu *clrIfOpen [clrPosition]=\"dropdownOrientation\">\n          @for (childAction of action.children; track childAction) {\n            <button\n              clrDropdownItem\n              type=\"button\"\n              (click)=\"onActionClick(childAction)\"\n              [title]=\"childAction.tooltip\"\n              [attr.data-test-id]=\"childAction.id\"\n              [clrDisabled]=\"!childAction.enabled\"\n              [ngClass]=\"childAction.class\"\n            >\n              {{ childAction.label }}\n            </button>\n          }\n        </clr-dropdown-menu>\n      </clr-dropdown>\n    }\n    @if (!action.children && action.isVisible) {\n      <button\n        type=\"button\"\n        #actionBtn\n        (click)=\"onActionClick(action)\"\n        [title]=\"action.tooltip\"\n        [attr.data-test-id]=\"action.id\"\n        [disabled]=\"!action.enabled\"\n        [attr.aria-label]=\"action.ariaLabel\"\n        [ngClass]=\"action.class\"\n      >\n        {{ action.label }}\n      </button>\n    }\n  }\n\n  <!-- Process the hidden actions due to not enough space on the screen -->\n  @if (hasDropdownActions()) {\n    <clr-dropdown class=\"dropdown-container\" [clrCloseMenuOnItemClick]=\"true\">\n      <button type=\"button\" clrDropdownTrigger [ngClass]=\"actions[0].class\">\n        <cds-icon shape=\"ellipsis-horizontal\"></cds-icon>\n      </button>\n      <ng-template [(clrIfOpen)]=\"isDropdownOpened\">\n        <clr-dropdown-menu clrPosition=\"bottom-right\" dropdownMenuReposition>\n          @for (action of getDropdownActions(); track action) {\n            <!-- Action has children - show a nested dropdown -->\n            @if (action.children) {\n              <clr-dropdown [clrCloseMenuOnItemClick]=\"true\" #actionBtn>\n                <button\n                  type=\"button\"\n                  clrDropdownTrigger\n                  class=\"\"\n                  [title]=\"action.tooltip\"\n                  [attr.data-test-id]=\"action.id\"\n                  [disabled]=\"!action.enabled\"\n                  [attr.aria-label]=\"action.ariaLabel\"\n                  [ngClass]=\"action.class\"\n                >\n                  {{ action.label }}\n                  <clr-icon shape=\"caret down\"></clr-icon>\n                </button>\n                <clr-dropdown-menu *clrIfOpen clrPosition=\"bottom-right\">\n                  @for (childAction of action.children; track childAction) {\n                    <button\n                      clrDropdownItem\n                      type=\"button\"\n                      (click)=\"onActionClick(childAction)\"\n                      [title]=\"childAction.tooltip\"\n                      [attr.data-test-id]=\"childAction.id\"\n                      [clrDisabled]=\"!childAction.enabled\"\n                      [attr.aria-label]=\"action.ariaLabel\"\n                      [ngClass]=\"childAction.class\"\n                    >\n                      {{ childAction.label }}\n                    </button>\n                  }\n                </clr-dropdown-menu>\n              </clr-dropdown>\n            }\n            <!-- Action has no children -->\n            @if (!action.children) {\n              <button\n                clrDropdownItem\n                type=\"button\"\n                (click)=\"onActionClick(action)\"\n                [title]=\"action.tooltip\"\n                [attr.data-test-id]=\"action.id\"\n                [attr.aria-label]=\"action.ariaLabel\"\n                [disabled]=\"!action.enabled\"\n                [ngClass]=\"action.class\"\n              >\n                {{ action.label }}\n              </button>\n            }\n          }\n        </clr-dropdown-menu>\n      </ng-template>\n    </clr-dropdown>\n  }\n</div>\n", styles: [":host .dropdown-container{margin-left:auto}:host div.btn-group{width:100%;margin-right:0}:host div.btn-group.btn-inline{display:inline-block}:host button{flex:0 0 auto;max-width:unset}:host clr-dropdown button.dropdown-toggle{color:var(--clr-btn-default-color)}:host clr-dropdown.has-border-left button.dropdown-toggle{border-left-style:solid!important;border-left-width:1px!important}:host clr-dropdown-menu{max-width:18rem}:host clr-dropdown-menu button{overflow-wrap:break-word;word-break:normal;white-space:normal}:host-context(.zoom4x) clr-dropdown-menu{margin-right:.8rem}:host-context(.zoom4x) .dropdown-container{margin-left:0}:host-context(.zoom4x) div.btn-group .btn-flex{display:flex;flex-direction:row;justify-content:flex-start}:host-context(.zoom4x) div.btn-group .btn-inline{display:inline-block}:host-context(.zoom4x) div.btn-group button{padding-left:10px}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i4.ElementResizeService }], propDecorators: { queryActionBtnElementList: [{
                type: ViewChildren,
                args: ['actionBtn', { read: ElementRef }]
            }], actions: [{
                type: Input
            }], btnLayout: [{
                type: Input
            }], dropdownOrientation: [{
                type: Input
            }], invokeAction: [{
                type: Output
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Helper functions to convert data into CSV format
 */
class CsvHelperService {
    getData(rows, columns) {
        let columnCsvData = '', rowsCsvData = '';
        if (columns) {
            columnCsvData = this.getColumnDataFromColumnDef(columns);
            rowsCsvData = this.getRowDataFromColumnDef(rows, columns);
        }
        const csvData = columnCsvData + rowsCsvData;
        return csvData;
    }
    getColumnDataFromColumnDef(columnDefinitions) {
        const columnNames = [];
        for (const columnDef of columnDefinitions) {
            const columnName = this.toCsvFormat(columnDef.displayName.toString());
            columnNames.push(columnName);
        }
        const columnCsvData = columnNames.join(',') + '\n';
        return columnCsvData;
    }
    getRowDataFromColumnDef(exportItems, columnDefinitions) {
        let rowsCsvData = '';
        for (const item of exportItems) {
            const rowValues = [];
            for (const columnDef of columnDefinitions) {
                let exportValue = '';
                const itemValue = this.getItemValueFromColumnField(item, columnDef.field);
                if (!itemValue) {
                    exportValue = '';
                }
                else {
                    exportValue = itemValue.toString();
                }
                exportValue = this.toCsvFormat(exportValue);
                rowValues.push(exportValue);
            }
            rowsCsvData += rowValues.join(',') + '\n';
        }
        return rowsCsvData;
    }
    toCsvFormat(itemValue) {
        if (itemValue.indexOf('"') > -1) {
            itemValue = itemValue.replace(/"/g, '""');
        }
        itemValue = '"' + itemValue.toString() + '"';
        return itemValue;
    }
    /** To extract value from nested JSON objects."
     * Example =>
     * JSON object to extract value from => { product: {cost: {limit: 100, lowestValue: 0 }}}
     * Field format => "product.cost.limit'
     * Value returned => 100
     */
    getItemValueFromColumnField(item, field) {
        if (field.indexOf('.') > 0) {
            const fieldNames = field.split('.');
            let itemValue = item;
            for (const str of fieldNames) {
                itemValue = itemValue[str];
                if (!itemValue) {
                    itemValue = item[field];
                    break;
                }
            }
            return itemValue;
        }
        return item[field];
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: CsvHelperService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: CsvHelperService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: CsvHelperService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Defining the three export types, selected export option is passed to Datagrid Export Component
 * @type {{ALL: string; SELECTED_ONLY: string; MATCHING_FILTERS: string}}
 */
var ExportType;
(function (ExportType) {
    ExportType["ALL"] = "ALL";
    ExportType["SELECTED_ONLY"] = "SELECTED_ONLY";
    ExportType["MATCHING_FILTERS"] = "MATCHING_FILTERS";
})(ExportType || (ExportType = {}));

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const defaultFileExtension = '.csv';
const defaultFileName = 'exportedData';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * User-visible strings used in the 'datagrid' library.
 *
 * Strings are in English only. If you need to provide localized strings:
 * - extend this class
 * - override all fields with localized values
 * - provide instance in the module, where you use the library
 *
 * ```
 * @NgModule({
 *    ...
 *    providers: [
 *       { provide: DatagridStrings, useClass: LocalizedDatagridStrings },
 *    ]
 * })
 * export class AppModule {}
 * ```
 */
class DatagridStrings {
    constructor() {
        /**
         * Text displayed inside the grid when the grid is empty.
         */
        this.noItemsFound = 'No items found';
        /**
         * Label of the column toggle buttons.
         */
        this.showColumns = 'Show Columns';
        /**
         * Label of the button (inside column toggle) that selects all columns.
         */
        this.selectAll = 'Select All';
        /**
         * Tooltip for Show Columns toggle button
         */
        this.pickColumns = 'Manage Columns';
        /**
         * Datagrid Show columns menu description
         */
        this.showColumnsMenuDescription = 'Show columns menu description';
        /**
         * Datagrid Show columns / All columns selected confirmation
         */
        this.allColumnsSelected = 'Select all columns';
        /**
         * Footer label displayed when there is a single item.
         * @example "1 item"
         */
        this.singleItem = '1 item';
        /**
         * Footer label to display total items count.
         * @example "{0} items"
         */
        this.multipleItems = '{0} items';
        /**
         * Footer label when using pagination.
         * @example "{1} - {2} of {0} items"
         */
        this.pagedItems = '{1} - {2} of {0} items';
        /**
         * Label for page size selector.
         */
        this.itemsPerPage = 'Items per page';
        /**
         * Title of the export button.
         */
        this.exportLink = 'Export';
        /**
         * Title of 'Export > Export All' option.
         */
        this.exportAll = 'All Rows';
        /**
         * Title of 'Export > Matching Filters' option.
         */
        this.exportMatchingFilters = 'Matching Filters';
        /**
         * Title of 'Export > Selected Rows' option.
         */
        this.exportSelectedRows = 'Selected Rows';
        /**
         * Error message displayed in case of error during data export.
         */
        this.exportErrorMessage = 'Sorry, the data could not be exported at the moment due to some internal error.';
        /**
         * Title of the error dialog displayed in case of error during data export.
         */
        this.exportErrorTitle = 'Export Data Failure';
        /**
         * Text for close button of column toggler on 4x zoom
         */
        this.closeColumnTogglerText = 'Close';
        /**
         * Label of the button for deselecting all rows.
         */
        this.deselectAll = 'Deselect All';
        /**
         * Details pane label for the collapsed button.
         * @example "Expand the details pane for the {0} item"
         */
        this.expandDetailsPaneLabel = 'Expand the details pane for the {0} item';
        /**
         * Details pane label for the expanded button.
         * @example "Collapse the details pane for the {0} item"
         */
        this.collapseDetailsPaneLabel = 'Collapse the details pane for the {0} item';
        /**
         * Placeholder text for the filter input in each filterable column.
         * @example "Filter items"
         */
        this.filterPlaceholder = 'Filter Items';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridStrings, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridStrings }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridStrings, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// Injectable service contract for app-specific code that can log and present error notifications
const appfxDatagridErrorNotifiableToken = new InjectionToken('notifier service that presents errors whenever an unrecoverable event occurs within grid');

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ExportProviderService {
    constructor(csvHelperService, renderer, elementRef, dgStrings, errorNotifiableService) {
        this.csvHelperService = csvHelperService;
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.dgStrings = dgStrings;
        this.errorNotifiableService = errorNotifiableService;
    }
    exportUIOnlyData(datagridProperties, exportStatus, datagridItemSet) {
        try {
            exportStatus.inProgress = true;
            let exportItems = datagridItemSet.totalDatagridItems;
            if (exportStatus.exportType === ExportType.SELECTED_ONLY) {
                exportItems = datagridItemSet.selectedItems;
            }
            else if (exportStatus.exportType === ExportType.MATCHING_FILTERS) {
                exportItems = datagridItemSet.filteredDatagridItems;
            }
            if (exportItems.length > 1 && datagridProperties.sort) {
                const sortFunction = datagridProperties.sortFunction || this.sortExportedItems;
                exportItems = sortFunction(exportItems, datagridProperties.sortOrder);
            }
            const csvData = this.csvHelperService.getData(exportItems, datagridProperties?.columnDefinitions || []);
            exportStatus.inProgress = false;
            this.downloadFile(csvData, datagridProperties.exportedFileName);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (exception) {
            exportStatus.inProgress = false;
            this.showExportError();
        }
    }
    /**
     * Function to create a CSV file from CsvData and download it
     */
    downloadFile(csvData, exportedFileName) {
        try {
            const blob = new Blob([csvData], { type: 'text/plain' });
            let fileName = defaultFileName + defaultFileExtension;
            if (exportedFileName) {
                fileName = exportedFileName + defaultFileExtension;
            }
            const csvDataUrl = URL.createObjectURL(blob);
            const downloadLink = this.renderer.createElement('a');
            downloadLink.setAttribute('href', csvDataUrl);
            downloadLink.setAttribute('download', fileName);
            this.renderer.appendChild(this.elementRef.nativeElement, downloadLink);
            downloadLink.click();
            setTimeout(() => {
                this.renderer.removeChild(this.elementRef.nativeElement, downloadLink);
                URL.revokeObjectURL(csvDataUrl);
                downloadLink.remove();
            }, 100);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (exception) {
            this.showExportError();
        }
    }
    showExportError() {
        if (this.errorNotifiableService) {
            this.errorNotifiableService.notifyError(this.dgStrings.exportErrorTitle, this.dgStrings.exportErrorMessage);
        }
        else {
            console.error(this.dgStrings.exportErrorTitle, this.dgStrings.exportErrorMessage);
        }
    }
    /**
     * Sort function used internally from ExportProviderService to sort exported items.
     */
    sortExportedItems(gridItems, sortOrder) {
        if (!sortOrder) {
            return gridItems;
        }
        const forField = sortOrder.column.field;
        const sortedItems = gridItems.sort((a, b) => {
            if (!Object.prototype.hasOwnProperty.call(a, forField) || !Object.prototype.hasOwnProperty.call(b, forField)) {
                return 0;
            }
            const valA = a[forField];
            const valB = b[forField];
            if (valA === null || valA === undefined) {
                if (valB === null || valB === undefined) {
                    return 0;
                }
                else {
                    return 1;
                }
            }
            if (valB === null || valB === undefined) {
                return -1;
            }
            return valA.localeCompare(valB);
        });
        return sortOrder.sortOrder === ClrDatagridSortOrder.DESC ? sortedItems.reverse() : sortedItems;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ExportProviderService, deps: [{ token: CsvHelperService }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: DatagridStrings }, { token: appfxDatagridErrorNotifiableToken, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ExportProviderService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ExportProviderService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: CsvHelperService }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: DatagridStrings }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [appfxDatagridErrorNotifiableToken]
                }] }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// Variable to keep track of unique ID instances
// Using BigInt to avoid overflow.
let instancesCount = BigInt(0);
const uniqueIdToken = new InjectionToken('UID generator');
const uniqueIdProvider = {
    provide: uniqueIdToken,
    useFactory: uniqueIdFactory,
};
function uniqueIdFactory() {
    return `${instancesCount++}`;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * The problem we want to solve with the common interface and the token below:
 * We don't want this directive to enumerate all its host components by type
 * because we don't want to import and thus depend on components which might
 * use the directive. To reverse the dependency, we use the token. Each
 * component which might host this directive should provide itself as the token.
 */
const appfxPreselectableComponentToken = new InjectionToken('PRESELECTABLE_COMPONENT_TOKEN');
/**
 * Preserves selection of datagrid and datagrid-detail by tracking whether some
 * grid item should be selected on the base of the a set "trackByGridItemProperty"
 * input of the datagrid or with the help of the "trackByFunction" function
 * input of the datagrid.
 *
 * After global refresh the data grid receives new items and the selection is lost
 * because the grid doesn't know how to recognize which of the new items are the old one
 * selected before global refresh. This directive tracks the selected items by property and
 * when the grid receives new data update the selected items array with the items from the
 * the new grid data.
 *
 * The server-side driven data grid doesn't receive all data. The directive in this case will
 * update only the items which can be found among the new grid items and leave
 * the old ones which it can't find in the selected grid items array. In this case, the component
 * which host the appfx datagrid has responsibility to remove the old selected items which are
 * not applicable for selection after grid data has been updated.
 *
 * How to use it
 *
 *  <appfx-datagrid [appfxPreserveSelection] ="'hostObjectId'" [gridItems]="gridItems" ....>
 *
 *  <appfx-datagrid appfxPreserveSelection [trackByGridItemProperty]="'hostObjectId'" [gridItems]="gridItems" ....>
 *
 *  <appfx-datagrid appfxPreserveSelection [trackByFunction]="<function>" [gridItems]="gridItems" ....>
 *
 * Where function receives as an argument datagrid item and returns unique identifier for it.
 */
class DatagridPreserveSelectionDirective {
    constructor(preselectableComponent) {
        this.preselectableComponent = preselectableComponent;
        /**
         * preserveSelection - needed mainly because of list-view component and
         * indicates whether grid should preserve the selection based on 'trackByFunction' or
         * 'trackByGridItemProperty'.
         */
        this.preserveExistingSelection = true;
        this.selectedItemsUpdated = new EventEmitter();
        this.component = preselectableComponent;
    }
    ngAfterViewInit() {
        if (this.preserveExistingSelection) {
            this.selectBy = this.component.trackByGridItemProperty || this.component.trackByFunction;
            if (!this.selectBy) {
                throw Error('The "preserveSelection" directive is not initialized correctly. Provide "trackByFunction" or ' +
                    ' "trackByGridItemProperty" of the appfx datagrid.');
            }
            this.gridItemChangeSub = this.component.gridItemsChange.subscribe((items) => {
                if (this.component.selectionType !== SelectionType.None && this.component.selectedItems?.length > 0) {
                    this.updateSelectedItems(items);
                }
            });
        }
    }
    ngOnDestroy() {
        if (this.gridItemChangeSub) {
            this.gridItemChangeSub.unsubscribe();
        }
    }
    updateSelectedItems(items) {
        let selectedItems;
        if (this.component.serverDrivenDatagrid) {
            // TODO: Delete this when  https://github.com/vmware/clarity/issues/4903 is resolved.
            selectedItems = this.findAndUpdateSelectedItems(items);
        }
        else {
            // TODO: When  https://github.com/vmware/clarity/issues/4786 is resolved
            // check if selection works without this directive for client side
            // datagrid and delete this.
            selectedItems = this.findSelectedItems(items);
        }
        if (this.selectedItemsUpdated.observers.length > 0) {
            this.selectedItemsUpdated.emit(selectedItems);
        }
        else {
            this.component.selectedItems = selectedItems;
        }
    }
    findSelectedItems(items) {
        const selectedItemsDic = this.createSelectedItemsDictionary();
        return items.filter((item) => {
            const itemPropertyValue = this.getItemUniquePropertyValue(item);
            return selectedItemsDic.has(itemPropertyValue);
        });
    }
    findAndUpdateSelectedItems(items) {
        // We need to preserve the order of selected items due to strange implementation
        // of selection in the clarity datagrid
        const selectedItems = [];
        const selectedItemIndexByRef = new Map();
        const selectedItemsDic = this.createSelectedItemsDictionary(selectedItems, selectedItemIndexByRef);
        items.forEach((item) => {
            const itemPropertyValue = this.getItemUniquePropertyValue(item);
            if (selectedItemsDic.has(itemPropertyValue)) {
                const index = selectedItemIndexByRef.get(itemPropertyValue);
                selectedItems[index] = item;
            }
        });
        return selectedItems;
    }
    createSelectedItemsDictionary(selectedItems, selectedItemIndexByRef) {
        const selectedItemsDic = new Map();
        const storeItemsAndIndexes = selectedItems && selectedItemIndexByRef;
        this.component.selectedItems.forEach((item, index) => {
            const itemPropertyValue = this.getItemUniquePropertyValue(item);
            selectedItemsDic.set(itemPropertyValue, item);
            if (storeItemsAndIndexes) {
                selectedItems?.push(item);
                selectedItemIndexByRef?.set(itemPropertyValue, index);
            }
        });
        return selectedItemsDic;
    }
    getItemUniquePropertyValue(item) {
        if (typeof this.selectBy === 'function') {
            return this.selectBy(0, item || {});
        }
        return item ? item[this.selectBy] : '';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridPreserveSelectionDirective, deps: [{ token: appfxPreselectableComponentToken, host: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: DatagridPreserveSelectionDirective, isStandalone: false, selector: "[appfxPreserveSelection]", inputs: { preserveExistingSelection: "preserveExistingSelection" }, outputs: { selectedItemsUpdated: "selectedItemsUpdated" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridPreserveSelectionDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[appfxPreserveSelection]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [appfxPreselectableComponentToken]
                }, {
                    type: Host
                }] }], propDecorators: { preserveExistingSelection: [{
                type: Input
            }], selectedItemsUpdated: [{
                type: Output
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Expose most common datagrid actionbar layout styles.
 */
var ActionBarLayout;
(function (ActionBarLayout) {
    ActionBarLayout["flatCompact"] = "btn btn-sm btn-link";
    ActionBarLayout["flat"] = "btn btn-link";
    ActionBarLayout["outlined"] = "btn btn-sm btn-secondary";
})(ActionBarLayout || (ActionBarLayout = {}));

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function getDatagridKeyNavigationController(datagrid) {
    const datagridPrivateMembers = datagrid;
    return datagridPrivateMembers.keyNavigation;
}
function isEqualColumns(column, other) {
    return (!!column &&
        !!other &&
        ((!!column.uid && column.uid === other.uid) || (!!column.displayName && column.displayName === other.displayName)));
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Provides subjects for communication between appfxDgColumnsOrder and appfxColumnOrder
 * directives.
 */
class DatagridColumnsOrderService {
    constructor() {
        /**
         * Emits the column which should be marked as grabbed. If the column is null all columns are
         * marked as not grabbed
         */
        this.grabbedColumn = new BehaviorSubject(null);
        /**
         * Emits when the column should be moved as result of left or right arrow key press.
         */
        this.moveVisibleColumn = new Subject();
        /**
         * Event emitter to tell the dragged column to set focus
         */
        this.focusGrabbedColumn = new Subject();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridColumnsOrderService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridColumnsOrderService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridColumnsOrderService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ColumnOrderDirective {
    constructor(datagrid, elementRef, columnOrderingService, changeDetectorRef, cdkDrag) {
        this.datagrid = datagrid;
        this.elementRef = elementRef;
        this.columnOrderingService = columnOrderingService;
        this.changeDetectorRef = changeDetectorRef;
        this.cdkDrag = cdkDrag;
        this.isGrabbed = false;
        this.subs = new Subscription();
        cdkDrag.previewContainer = 'parent';
    }
    keydown(event) {
        const isColumnTarget = event.target?.tagName === 'CLR-DG-COLUMN';
        if (!isColumnTarget) {
            return;
        }
        const isSpace = event.code === 'Space';
        const isLeft = event.code === 'ArrowLeft';
        const isRight = event.code === 'ArrowRight';
        const isUp = event.code === 'ArrowUp';
        const isDown = event.code === 'ArrowDown';
        const isEsc = event.code === 'Escape';
        const isCurrentColumnGrabbed = isEqualColumns(this.columnData, this.columnOrderingService.grabbedColumn.value);
        if (isCurrentColumnGrabbed && (isLeft || isRight)) {
            event.stopImmediatePropagation();
            event.preventDefault();
            this.moveColumn(isLeft);
        }
        if (isSpace) {
            event.stopImmediatePropagation();
            event.preventDefault();
        }
        if (isCurrentColumnGrabbed && (isEsc || isDown || isUp || isSpace)) {
            // Remove grabbed css of the columns
            this.columnOrderingService.grabbedColumn.next(null);
        }
        if (!isCurrentColumnGrabbed && isSpace) {
            // Set grabbed css of the column provided as parameter
            this.columnOrderingService.grabbedColumn.next(this.columnData);
        }
    }
    ngOnInit() {
        this.subs.add(this.columnOrderingService.grabbedColumn
            .pipe(filter(other => {
            return isEqualColumns(this.columnData, other) !== this.isGrabbed;
        }))
            .subscribe(() => {
            this.updateGrabbedState();
        }));
        this.subs.add(this.columnOrderingService.focusGrabbedColumn.pipe(filter(() => this.isGrabbed)).subscribe(() => {
            this.setActiveCell();
        }));
        this.subs.add(this.cdkDrag.started.subscribe(() => {
            //Remove grabbed css of the columns, when user start dragging with the mouse
            this.columnOrderingService.grabbedColumn.next(null);
        }));
    }
    ngOnDestroy() {
        this.subs.unsubscribe();
    }
    moveColumn(isLeft) {
        this.columnOrderingService.moveVisibleColumn.next({
            moveLeft: isLeft,
            visibleColumnIndex: this.columnIndex,
        });
    }
    updateGrabbedState() {
        this.isGrabbed = !this.isGrabbed;
        this.changeDetectorRef.markForCheck();
    }
    setActiveCell() {
        getDatagridKeyNavigationController(this.datagrid).setActiveCell(this.elementRef.nativeElement);
        getDatagridKeyNavigationController(this.datagrid).focusElement(this.elementRef.nativeElement);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ColumnOrderDirective, deps: [{ token: i9.ClrDatagrid }, { token: i0.ElementRef }, { token: DatagridColumnsOrderService }, { token: i0.ChangeDetectorRef }, { token: i6.CdkDrag }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ColumnOrderDirective, isStandalone: false, selector: "clr-dg-column[appfxColumnOrder]", inputs: { columnData: "columnData", columnIndex: "columnIndex" }, host: { listeners: { "keydown": "keydown($event)" }, properties: { "class.grabbed": "this.isGrabbed" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ColumnOrderDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-dg-column[appfxColumnOrder]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i9.ClrDatagrid }, { type: i0.ElementRef }, { type: DatagridColumnsOrderService }, { type: i0.ChangeDetectorRef }, { type: i6.CdkDrag }], propDecorators: { isGrabbed: [{
                type: HostBinding,
                args: ['class.grabbed']
            }], columnData: [{
                type: Input
            }], columnIndex: [{
                type: Input
            }], keydown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridColumnsOrderDirective {
    constructor(elementRef, cdkDropList, columnOrderingService) {
        this.elementRef = elementRef;
        this.cdkDropList = cdkDropList;
        this.columnOrderingService = columnOrderingService;
        this.dgColumnsVirtualScrolling = false;
        this.dgColumnsOrderChange = new EventEmitter();
        this.subs = new Subscription();
        cdkDropList.orientation = 'horizontal';
    }
    ngOnInit() {
        this.subs.add(this.cdkDropList.dropped
            .pipe(filter(droppedData => !!droppedData?.item?.data?.displayName), map(droppedData => {
            return this.findColumnIndices(droppedData.item.data, droppedData.currentIndex);
        }), filter(columnIndices => columnIndices.currentIndex !== columnIndices.previousIndex))
            .subscribe(columnIndices => {
            this.reorderColumn(columnIndices);
        }));
        this.subs.add(this.columnOrderingService.moveVisibleColumn
            .pipe(map(visibleColumnIndices => {
            return this.getColumnIndices(visibleColumnIndices.moveLeft, visibleColumnIndices.visibleColumnIndex);
        }), filter(columnIndices => {
            return columnIndices.previousIndex !== columnIndices.currentIndex;
        }))
            .subscribe(columnIndices => {
            this.reorderColumn(columnIndices);
            this.columnOrderingService.focusGrabbedColumn.next();
        }));
    }
    setDgColumnsContainer() {
        // Clarity doesn't expose the scrollable datagrid container, and I didn't find a way to
        // get it from the parent component or directive, so we need to use querySelector
        // When virtualScrolling is enabled grid data and grid header are split into two different
        // scrollable containers. In this case we aim for the grid header.
        let selector = 'div.datagrid';
        if (this.dgColumnsVirtualScrolling) {
            selector += ' div.datagrid-header';
        }
        const scrollableContainer = this.elementRef.nativeElement.querySelector(selector);
        if (scrollableContainer) {
            // A workaround for the cdkDropList directive. The issue is that draggable columns are not direct
            // children of the drop list container on which the cdkDropList directive is applied. The selector
            // that can be provided to the cdkDropList directive and that directive can use to find an alternate
            // element container for the drop list container doesn't work. The clarity column separators are
            // draggable and inside column elements, and the drop list container is not their parent.
            // The correct fix is the clarity to support column reordering as they have better access to the
            // datagrid dom structure.
            this.cdkDropList._dropListRef._container = scrollableContainer;
            this.cdkDropList._dropListRef.element = scrollableContainer;
            this.cdkDropList.element = new ElementRef(scrollableContainer);
        }
    }
    ngOnChanges(changes) {
        if (changes['dgColumnsVirtualScrolling']) {
            this.setDgColumnsContainer();
        }
    }
    ngOnDestroy() {
        this.subs.unsubscribe();
    }
    reorderColumn(indices) {
        const value = [...this.dgColumnsOrderColumns];
        moveItemInArray(value, indices.previousIndex, indices.currentIndex);
        this.dgColumnsOrderColumns = value;
        this.dgColumnsOrderChange.emit({ ...indices, columns: this.dgColumnsOrderColumns });
    }
    getColumnIndices(moveLeft, previousColumnIndex) {
        const visibleColumns = this.dgColumnsOrderColumns.filter(column => !column.hidden);
        const newVisibleColumnIndex = moveLeft ? previousColumnIndex - 1 : previousColumnIndex + 1;
        let currenColumnIndex = newVisibleColumnIndex >= 0 ? newVisibleColumnIndex : 0;
        currenColumnIndex = currenColumnIndex < visibleColumns.length - 1 ? currenColumnIndex : visibleColumns.length - 1;
        const previousColumn = visibleColumns[previousColumnIndex];
        const currentColumn = visibleColumns[currenColumnIndex];
        return this.createColumnIndices(previousColumn, currentColumn);
    }
    findColumnIndices(previousColumn, currentDroppedItemIndex) {
        const mappedColumnDragItems = this.cdkDropList.getSortedItems().map(item => item.data);
        const currentColumn = mappedColumnDragItems.find((column, index) => {
            //For some reason the index of the dropped item in the dropped event start from 1 not from 0
            return index >= currentDroppedItemIndex - 1 && !!column;
        });
        return this.createColumnIndices(previousColumn, currentColumn);
    }
    createColumnIndices(previousColumn, currentColumn) {
        const previousIndex = this.findColumnIndex(previousColumn);
        const currentIndex = this.findColumnIndex(currentColumn);
        return {
            previousIndex: previousIndex,
            currentIndex: currentIndex,
        };
    }
    findColumnIndex(column) {
        return this.dgColumnsOrderColumns.findIndex(other => {
            return isEqualColumns(column, other);
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridColumnsOrderDirective, deps: [{ token: i0.ElementRef }, { token: i6.CdkDropList }, { token: DatagridColumnsOrderService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: DatagridColumnsOrderDirective, isStandalone: false, selector: "clr-datagrid[appfxDgColumnsOrder]", inputs: { dgColumnsOrderColumns: "dgColumnsOrderColumns", dgColumnsVirtualScrolling: "dgColumnsVirtualScrolling" }, outputs: { dgColumnsOrderChange: "dgColumnsOrderChange" }, providers: [DatagridColumnsOrderService], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridColumnsOrderDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-datagrid[appfxDgColumnsOrder]',
                    providers: [DatagridColumnsOrderService],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i6.CdkDropList }, { type: DatagridColumnsOrderService }], propDecorators: { dgColumnsOrderColumns: [{
                type: Input
            }], dgColumnsVirtualScrolling: [{
                type: Input
            }], dgColumnsOrderChange: [{
                type: Output
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridFilterComponent {
    constructor(dgStrings, popoverService) {
        this.dgStrings = dgStrings;
        this.popoverService = popoverService;
        this.filterValueChange = new EventEmitter();
        this.changes = new Subject();
    }
    ngOnInit() {
        this.value = this.filterValue || '';
    }
    ngAfterViewInit() {
        this.popoverService.openChange.pipe(observeOn(asyncScheduler)).subscribe(openChange => {
            if (openChange) {
                this.input.nativeElement.focus();
            }
        });
    }
    onKey(event) {
        this.value = event.target.value;
        this.changes.next(true);
        if (this.filterValue !== this.value) {
            this.filterValueChange.emit(this.value);
        }
    }
    isActive() {
        return !!this.value;
    }
    accepts(item) {
        const lowerCaseTrimmedValue = this.value.toLowerCase().trim();
        let currentItemFieldValue;
        if (this.stringFilterType) {
            return this.stringFilterType.accepts(item, lowerCaseTrimmedValue);
        }
        else if (this.fieldName) {
            currentItemFieldValue = '' + item[this.fieldName];
            return currentItemFieldValue.toLowerCase().indexOf(lowerCaseTrimmedValue) >= 0;
        }
        return false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridFilterComponent, deps: [{ token: DatagridStrings }, { token: i2$1.ClrPopoverService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: DatagridFilterComponent, isStandalone: false, selector: "appfx-datagrid-filter", inputs: { filterValue: "filterValue", stringFilterType: "stringFilterType", fieldName: "fieldName" }, outputs: { filterValueChange: "filterValueChange" }, viewQueries: [{ propertyName: "input", first: true, predicate: ["input"], descendants: true }], ngImport: i0, template: `
    <clr-input-container class="mt-0">
      <input
        #input
        clrInput
        type="text"
        name="search"
        autocomplete="off"
        [value]="value"
        (keyup)="onKey($event)"
        [placeholder]="dgStrings.filterPlaceholder"
        [attr.aria-label]="dgStrings.filterPlaceholder"
      />
    </clr-input-container>
  `, isInline: true, dependencies: [{ kind: "directive", type: i3$1.ClrInput, selector: "[clrInput]" }, { kind: "component", type: i3$1.ClrInputContainer, selector: "clr-input-container" }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridFilterComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'appfx-datagrid-filter',
                    standalone: false,
                    template: `
    <clr-input-container class="mt-0">
      <input
        #input
        clrInput
        type="text"
        name="search"
        autocomplete="off"
        [value]="value"
        (keyup)="onKey($event)"
        [placeholder]="dgStrings.filterPlaceholder"
        [attr.aria-label]="dgStrings.filterPlaceholder"
      />
    </clr-input-container>
  `,
                }]
        }], ctorParameters: () => [{ type: DatagridStrings }, { type: i2$1.ClrPopoverService }], propDecorators: { filterValue: [{
                type: Input
            }], stringFilterType: [{
                type: Input
            }], fieldName: [{
                type: Input
            }], filterValueChange: [{
                type: Output
            }], input: [{
                type: ViewChild,
                args: ['input']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridCellContainerComponent {
    ngOnChanges() {
        if (this.instance && typeof this.instance.onChange === 'function') {
            this.instance.onChange(this.item || {}, this.column);
        }
    }
    ngOnInit() {
        if (this.column.columnRenderer) {
            this.componentRef = this.container.createComponent(this.column.columnRenderer);
            this.instance = this.componentRef?.instance;
            this.instance.item = this.item || {};
            this.instance.column = this.column;
        }
    }
    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.instance = null;
            this.componentRef = null;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridCellContainerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: DatagridCellContainerComponent, isStandalone: false, selector: "appfx-dg-cell-container", inputs: { column: "column", item: "item" }, viewQueries: [{ propertyName: "container", first: true, predicate: ["cellContainer"], descendants: true, read: ViewContainerRef, static: true }], usesOnChanges: true, ngImport: i0, template: `
    @if (!column.columnRenderer) {
      <span [title]="item?.[column.field]">{{ item?.[column.field] }}</span>
    }
    <ng-template #cellContainer></ng-template>
  `, isInline: true, styles: [":host{width:100%}\n"], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridCellContainerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-dg-cell-container', standalone: false, template: `
    @if (!column.columnRenderer) {
      <span [title]="item?.[column.field]">{{ item?.[column.field] }}</span>
    }
    <ng-template #cellContainer></ng-template>
  `, styles: [":host{width:100%}\n"] }]
        }], propDecorators: { container: [{
                type: ViewChild,
                args: ['cellContainer', { read: ViewContainerRef, static: true }]
            }], column: [{
                type: Input
            }], item: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridColumnToggleComponent {
    constructor(dgStrings) {
        this.dgStrings = dgStrings;
        this.layoutClass = 'column-switch-wrapper';
        this.columnsChange = new EventEmitter();
        this.columnHiddenStateChange = new EventEmitter();
        this.positions = [
            new ConnectionPositionPair({
                originX: 'start',
                originY: 'top',
            }, {
                overlayX: 'start',
                overlayY: 'bottom',
            }),
        ];
        this.openState = false;
    }
    get hasOnlyOneVisibleColumn() {
        const hideableColumns = this.hideableColumns();
        const nonHideableColumns = this.columns.length - hideableColumns.length;
        return nonHideableColumns === 0 && hideableColumns.filter(column => !column.hidden).length === 1;
    }
    ngOnDestroy() {
        this.openState = false;
    }
    onAttach(overlay) {
        this.overlay = overlay;
        this.viewId = overlay?.overlayRef?.overlayElement.id;
    }
    onDetach() {
        this.openState = false;
        this.viewId = undefined;
    }
    showColumn(colUid) {
        this.showHideColumn(colUid, false);
    }
    hideColumn(colUid) {
        this.showHideColumn(colUid, true);
    }
    toggleColumnState(columnToToggle, event) {
        const shouldHide = !!event?.target && !event.target.checked;
        columnToToggle.hidden = shouldHide;
        this.columnsChange.emit([...this.columns]);
        this.columnHiddenStateChange.emit({
            hidden: shouldHide,
            column: columnToToggle,
        });
    }
    onSelectAll() {
        this.hideableColumns()
            .filter(column => column.hidden)
            .forEach(column => this.toggleColumnState(column));
    }
    allColumnsSelected() {
        return this.hideableColumns().filter(column => column.hidden).length === 0;
    }
    hideableColumns() {
        // If column.hideable is not set to false explicitly then column is considered visible
        return this.columns.filter(column => column.hideable !== false);
    }
    showHideColumn(colUid, hide) {
        const columnToToggle = this.columns.find(col => col.uid === colUid);
        if (!columnToToggle) {
            return;
        }
        columnToToggle.hidden = hide;
        this.columnsChange.emit([...this.columns]);
        this.columnHiddenStateChange.emit({
            hidden: hide,
            column: columnToToggle,
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridColumnToggleComponent, deps: [{ token: DatagridStrings }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: DatagridColumnToggleComponent, isStandalone: false, selector: "appfx-dg-column-toggle", inputs: { columns: "columns" }, outputs: { columnsChange: "columnsChange", columnHiddenStateChange: "columnHiddenStateChange" }, host: { properties: { "class": "this.layoutClass" } }, viewQueries: [{ propertyName: "closeColumnButtonElement", first: true, predicate: ["closeColumnButton"], descendants: true, read: ElementRef }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<button\n  cdkOverlayOrigin\n  #trigger=\"cdkOverlayOrigin\"\n  role=\"button\"\n  type=\"button\"\n  class=\"btn btn-sm btn-link column-toggle-action\"\n  (click)=\"openState = !openState\"\n  [attr.aria-owns]=\"viewId\"\n  [attr.aria-controls]=\"viewId\"\n  [attr.aria-expanded]=\"openState\"\n>\n  {{ dgStrings.pickColumns }}\n</button>\n<ng-template\n  cdkConnectedOverlay\n  #overlay=\"cdkConnectedOverlay\"\n  [cdkConnectedOverlayOrigin]=\"trigger\"\n  [cdkConnectedOverlayOpen]=\"openState\"\n  [cdkConnectedOverlayHasBackdrop]=\"true\"\n  [cdkConnectedOverlayPositions]=\"positions\"\n  cdkConnectedOverlayBackdropClass=\"cdk-overlay-transparent-backdrop\"\n  (detach)=\"onDetach()\"\n  (attach)=\"onAttach(overlay)\"\n  (backdropClick)=\"openState = false\"\n>\n  <div\n    class=\"column-switch\"\n    role=\"dialog\"\n    cdkTrapFocus\n    [cdkTrapFocusAutoCapture]=\"true\"\n    [attr.aria-label]=\"dgStrings.showColumnsMenuDescription\"\n    tabindex=\"-1\"\n  >\n    <div class=\"switch-header\">\n      <div class=\"clr-sr-only\">\n        {{ dgStrings.allColumnsSelected }}\n      </div>\n      <span role=\"heading\" aria-level=\"3\">{{ dgStrings.showColumns }}</span>\n      <button\n        class=\"btn btn-sm btn-link\"\n        cdkFocusInitial\n        cdkFocusRegionStart\n        (click)=\"openState = false\"\n        #closeColumnButton\n      >\n        <span class=\"clr-sr-only\">{{ dgStrings.closeColumnTogglerText }}</span>\n        <cds-icon shape=\"window-close\"></cds-icon>\n      </button>\n    </div>\n    <ul class=\"switch-content list-unstyled\" tabindex=\"-1\">\n      @for (column of hideableColumns(); track column) {\n        <li>\n          <clr-checkbox-wrapper>\n            <input\n              type=\"checkbox\"\n              clrCheckbox\n              [disabled]=\"hasOnlyOneVisibleColumn && !column.hidden\"\n              [checked]=\"!column.hidden\"\n              (change)=\"toggleColumnState(column, $event)\"\n            />\n            <label>{{ column.displayName }}</label>\n          </clr-checkbox-wrapper>\n        </li>\n      }\n    </ul>\n    <div class=\"switch-footer\">\n      <button\n        class=\"btn btn-sm btn-link switch-button export-link\"\n        type=\"button\"\n        cdkFocusRegionEnd\n        [disabled]=\"allColumnsSelected()\"\n        (click)=\"onSelectAll()\"\n      >\n        {{ dgStrings.selectAll }}\n      </button>\n    </div>\n  </div>\n</ng-template>\n", styles: ["::ng-deep .cdk-overlay-container,::ng-deep .cdk-global-overlay-wrapper{pointer-events:none;top:0;left:0;height:100%;width:100%}::ng-deep .cdk-overlay-container{position:fixed;z-index:1000}::ng-deep .cdk-overlay-container:empty{display:none}::ng-deep .cdk-global-overlay-wrapper{display:flex;position:absolute;z-index:1000}::ng-deep .cdk-overlay-pane{position:absolute;pointer-events:auto;box-sizing:border-box;z-index:1000;display:flex;max-width:100%;max-height:100%}::ng-deep .cdk-overlay-backdrop{position:absolute;inset:0;z-index:1000;pointer-events:auto;-webkit-tap-highlight-color:rgba(0,0,0,0);transition:opacity .4s cubic-bezier(.25,.8,.25,1);opacity:0}::ng-deep .cdk-overlay-backdrop.cdk-overlay-backdrop-showing{opacity:1}::ng-deep .cdk-high-contrast-active .cdk-overlay-backdrop.cdk-overlay-backdrop-showing{opacity:.6}::ng-deep .cdk-overlay-dark-backdrop{background:#00000052}::ng-deep .cdk-overlay-transparent-backdrop{transition:visibility 1ms linear,opacity 1ms linear;visibility:hidden;opacity:1}::ng-deep .cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing{opacity:0;visibility:visible}::ng-deep .cdk-overlay-backdrop-noop-animation{transition:none}::ng-deep .cdk-overlay-connected-position-bounding-box{position:absolute;z-index:1000;display:flex;flex-direction:column;min-width:1px;min-height:1px}::ng-deep .cdk-global-scrollblock{position:fixed;width:100%;overflow-y:scroll}\n"], dependencies: [{ kind: "directive", type: i2$2.CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }, { kind: "directive", type: i3$2.CdkConnectedOverlay, selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]", inputs: ["cdkConnectedOverlayOrigin", "cdkConnectedOverlayPositions", "cdkConnectedOverlayPositionStrategy", "cdkConnectedOverlayOffsetX", "cdkConnectedOverlayOffsetY", "cdkConnectedOverlayWidth", "cdkConnectedOverlayHeight", "cdkConnectedOverlayMinWidth", "cdkConnectedOverlayMinHeight", "cdkConnectedOverlayBackdropClass", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayViewportMargin", "cdkConnectedOverlayScrollStrategy", "cdkConnectedOverlayOpen", "cdkConnectedOverlayDisableClose", "cdkConnectedOverlayTransformOriginOn", "cdkConnectedOverlayHasBackdrop", "cdkConnectedOverlayLockPosition", "cdkConnectedOverlayFlexibleDimensions", "cdkConnectedOverlayGrowAfterOpen", "cdkConnectedOverlayPush", "cdkConnectedOverlayDisposeOnNavigation", "cdkConnectedOverlayUsePopover", "cdkConnectedOverlayMatchWidth", "cdkConnectedOverlay"], outputs: ["backdropClick", "positionChange", "attach", "detach", "overlayKeydown", "overlayOutsideClick"], exportAs: ["cdkConnectedOverlay"] }, { kind: "directive", type: i3$2.CdkOverlayOrigin, selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]", exportAs: ["cdkOverlayOrigin"] }, { kind: "directive", type: i4$1.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "component", type: i2.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i3$1.ClrCheckbox, selector: "[clrCheckbox],[clrToggle]" }, { kind: "component", type: i3$1.ClrCheckboxWrapper, selector: "clr-checkbox-wrapper,clr-toggle-wrapper" }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridColumnToggleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-dg-column-toggle', standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<button\n  cdkOverlayOrigin\n  #trigger=\"cdkOverlayOrigin\"\n  role=\"button\"\n  type=\"button\"\n  class=\"btn btn-sm btn-link column-toggle-action\"\n  (click)=\"openState = !openState\"\n  [attr.aria-owns]=\"viewId\"\n  [attr.aria-controls]=\"viewId\"\n  [attr.aria-expanded]=\"openState\"\n>\n  {{ dgStrings.pickColumns }}\n</button>\n<ng-template\n  cdkConnectedOverlay\n  #overlay=\"cdkConnectedOverlay\"\n  [cdkConnectedOverlayOrigin]=\"trigger\"\n  [cdkConnectedOverlayOpen]=\"openState\"\n  [cdkConnectedOverlayHasBackdrop]=\"true\"\n  [cdkConnectedOverlayPositions]=\"positions\"\n  cdkConnectedOverlayBackdropClass=\"cdk-overlay-transparent-backdrop\"\n  (detach)=\"onDetach()\"\n  (attach)=\"onAttach(overlay)\"\n  (backdropClick)=\"openState = false\"\n>\n  <div\n    class=\"column-switch\"\n    role=\"dialog\"\n    cdkTrapFocus\n    [cdkTrapFocusAutoCapture]=\"true\"\n    [attr.aria-label]=\"dgStrings.showColumnsMenuDescription\"\n    tabindex=\"-1\"\n  >\n    <div class=\"switch-header\">\n      <div class=\"clr-sr-only\">\n        {{ dgStrings.allColumnsSelected }}\n      </div>\n      <span role=\"heading\" aria-level=\"3\">{{ dgStrings.showColumns }}</span>\n      <button\n        class=\"btn btn-sm btn-link\"\n        cdkFocusInitial\n        cdkFocusRegionStart\n        (click)=\"openState = false\"\n        #closeColumnButton\n      >\n        <span class=\"clr-sr-only\">{{ dgStrings.closeColumnTogglerText }}</span>\n        <cds-icon shape=\"window-close\"></cds-icon>\n      </button>\n    </div>\n    <ul class=\"switch-content list-unstyled\" tabindex=\"-1\">\n      @for (column of hideableColumns(); track column) {\n        <li>\n          <clr-checkbox-wrapper>\n            <input\n              type=\"checkbox\"\n              clrCheckbox\n              [disabled]=\"hasOnlyOneVisibleColumn && !column.hidden\"\n              [checked]=\"!column.hidden\"\n              (change)=\"toggleColumnState(column, $event)\"\n            />\n            <label>{{ column.displayName }}</label>\n          </clr-checkbox-wrapper>\n        </li>\n      }\n    </ul>\n    <div class=\"switch-footer\">\n      <button\n        class=\"btn btn-sm btn-link switch-button export-link\"\n        type=\"button\"\n        cdkFocusRegionEnd\n        [disabled]=\"allColumnsSelected()\"\n        (click)=\"onSelectAll()\"\n      >\n        {{ dgStrings.selectAll }}\n      </button>\n    </div>\n  </div>\n</ng-template>\n", styles: ["::ng-deep .cdk-overlay-container,::ng-deep .cdk-global-overlay-wrapper{pointer-events:none;top:0;left:0;height:100%;width:100%}::ng-deep .cdk-overlay-container{position:fixed;z-index:1000}::ng-deep .cdk-overlay-container:empty{display:none}::ng-deep .cdk-global-overlay-wrapper{display:flex;position:absolute;z-index:1000}::ng-deep .cdk-overlay-pane{position:absolute;pointer-events:auto;box-sizing:border-box;z-index:1000;display:flex;max-width:100%;max-height:100%}::ng-deep .cdk-overlay-backdrop{position:absolute;inset:0;z-index:1000;pointer-events:auto;-webkit-tap-highlight-color:rgba(0,0,0,0);transition:opacity .4s cubic-bezier(.25,.8,.25,1);opacity:0}::ng-deep .cdk-overlay-backdrop.cdk-overlay-backdrop-showing{opacity:1}::ng-deep .cdk-high-contrast-active .cdk-overlay-backdrop.cdk-overlay-backdrop-showing{opacity:.6}::ng-deep .cdk-overlay-dark-backdrop{background:#00000052}::ng-deep .cdk-overlay-transparent-backdrop{transition:visibility 1ms linear,opacity 1ms linear;visibility:hidden;opacity:1}::ng-deep .cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing{opacity:0;visibility:visible}::ng-deep .cdk-overlay-backdrop-noop-animation{transition:none}::ng-deep .cdk-overlay-connected-position-bounding-box{position:absolute;z-index:1000;display:flex;flex-direction:column;min-width:1px;min-height:1px}::ng-deep .cdk-global-scrollblock{position:fixed;width:100%;overflow-y:scroll}\n"] }]
        }], ctorParameters: () => [{ type: DatagridStrings }], propDecorators: { layoutClass: [{
                type: HostBinding,
                args: ['class']
            }], closeColumnButtonElement: [{
                type: ViewChild,
                args: ['closeColumnButton', { read: ElementRef }]
            }], columns: [{
                type: Input
            }], columnsChange: [{
                type: Output
            }], columnHiddenStateChange: [{
                type: Output
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * A component that acts as a container for custom column filters.
 * It creates an instance of the specified filter component and manages its lifecycle.
 */
class DatagridFilterContainerComponent {
    constructor(filterContainer) {
        this.filterContainer = filterContainer;
        /**
         * Event emitter to notify the hosting view about changes in the filter value.
         */
        this.filterValueChange = new EventEmitter();
    }
    ngAfterViewInit() {
        if (this.filterType) {
            this.componentRef = this.container.createComponent(this.filterType);
            this.filter = this.componentRef.instance;
            this.filter.filterValue = this.filterValue;
            this.filterChangeSub = this.filter.changes.subscribe((value) => {
                this.filterValueChange.emit(value);
            });
            this.filterContainer.setFilter(this.filter);
        }
    }
    ngOnDestroy() {
        if (this.filterChangeSub) {
            this.filterChangeSub.unsubscribe();
            this.filterChangeSub = null;
        }
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridFilterContainerComponent, deps: [{ token: i9.ClrDatagridFilter }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: DatagridFilterContainerComponent, isStandalone: false, selector: "appfx-dg-filter-container", inputs: { filterType: "filterType", filterValue: "filterValue" }, outputs: { filterValueChange: "filterValueChange" }, viewQueries: [{ propertyName: "container", first: true, predicate: ["filterContainer"], descendants: true, read: ViewContainerRef, static: true }], ngImport: i0, template: ` <ng-template #filterContainer></ng-template>`, isInline: true, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridFilterContainerComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'appfx-dg-filter-container',
                    standalone: false,
                    template: ` <ng-template #filterContainer></ng-template>`,
                }]
        }], ctorParameters: () => [{ type: i9.ClrDatagridFilter }], propDecorators: { container: [{
                type: ViewChild,
                args: ['filterContainer', { read: ViewContainerRef, static: true }]
            }], filterType: [{
                type: Input
            }], filterValue: [{
                type: Input
            }], filterValueChange: [{
                type: Output
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ExportDatagridComponent {
    constructor(dgStrings) {
        this.dgStrings = dgStrings;
        /**
         * All grid items count
         */
        this.allItemsCount = 0;
        /**
         * All filtered items count
         */
        this.filteredItemsCount = 0;
        /**
         * Selected items in the datagrid
         */
        this.selectedItemsCount = 0;
        /**
         * Event emitter to tell the hosting view that user has requested to export list data
         */
        this.exportEventEmitter = new EventEmitter();
        this.exportStatus = { inProgress: false, exportType: ExportType.ALL };
        this.exportType = ExportType;
    }
    /**
     * Export event is emitted on Export button click and no dropdown options are available
     * All Items are Exported.
     */
    exportAllIfOnlyOption() {
        if (this.selectedItemsCount === 0 && this.filteredItemsCount === 0) {
            this.exportStatus.exportType = this.exportType.ALL;
            this.exportEventEmitter.emit(this.exportStatus);
        }
        else {
            this.allRowsCount = '';
            this.selectedRowsCount = '';
            this.matchedFilterRowsCount = '';
            if (this.allItemsCount) {
                this.allRowsCount = `(${this.allItemsCount})`;
            }
            else {
                this.allRowsCount = `(0)`;
            }
            if (this.filteredItemsCount) {
                this.matchedFilterRowsCount = `(${this.filteredItemsCount})`;
            }
            else {
                this.matchedFilterRowsCount = `(0)`;
            }
            if (this.selectedItemsCount) {
                this.selectedRowsCount = `(${this.selectedItemsCount})`;
            }
            else {
                this.selectedRowsCount = `(0)`;
            }
        }
    }
    /**
     * Handler function called when one of the export options is clicked
     */
    onExportClick(exportType) {
        this.exportStatus.exportType = exportType;
        this.exportEventEmitter.emit(this.exportStatus);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ExportDatagridComponent, deps: [{ token: DatagridStrings }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ExportDatagridComponent, isStandalone: false, selector: "appfx-dg-export", inputs: { allItemsCount: "allItemsCount", filteredItemsCount: "filteredItemsCount", selectedItemsCount: "selectedItemsCount" }, outputs: { exportEventEmitter: "exportEventEmitter" }, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n@if (selectedItemsCount > 0 || filteredItemsCount > 0) {\n  <clr-dropdown class=\"column-switch-wrapper\">\n    <button\n      data-test-id=\"export-link\"\n      type=\"button\"\n      class=\"column-toggle-action btn btn-sm btn-link\"\n      [clrLoading]=\"exportStatus.inProgress || false\"\n      [disabled]=\"!(allItemsCount > 0)\"\n      (click)=\"exportAllIfOnlyOption()\"\n      clrDropdownTrigger\n    >\n      {{ dgStrings.exportLink }}\n      @if (selectedItemsCount > 0 || filteredItemsCount > 0) {\n        <cds-icon shape=\"angle\" direction=\"down\"></cds-icon>\n      }\n    </button>\n    <clr-dropdown-menu class=\"export-dropdown\" clrPosition=\"top-left\" *clrIfOpen>\n      @if (selectedItemsCount > 0 || filteredItemsCount > 0) {\n        <button type=\"button\" clrDropdownItem (click)=\"onExportClick(exportType.ALL)\">\n          {{ dgStrings.exportAll }} {{ allRowsCount }}\n        </button>\n      }\n      @if (filteredItemsCount > 0) {\n        <button type=\"button\" clrDropdownItem (click)=\"onExportClick(exportType.MATCHING_FILTERS)\">\n          {{ dgStrings.exportMatchingFilters }}\n          {{ matchedFilterRowsCount }}\n        </button>\n      }\n      @if (selectedItemsCount > 0) {\n        <button type=\"button\" clrDropdownItem (click)=\"onExportClick(exportType.SELECTED_ONLY)\">\n          {{ dgStrings.exportSelectedRows }} {{ selectedRowsCount }}\n        </button>\n      }\n    </clr-dropdown-menu>\n  </clr-dropdown>\n} @else {\n  <div class=\"column-switch-wrapper\">\n    <button\n      data-test-id=\"export-link\"\n      type=\"button\"\n      class=\"column-toggle-action btn btn-sm btn-link\"\n      [clrLoading]=\"exportStatus.inProgress || false\"\n      [disabled]=\"!(allItemsCount > 0)\"\n      (click)=\"exportAllIfOnlyOption()\"\n    >\n      {{ dgStrings.exportLink }}\n    </button>\n  </div>\n}\n", styles: [".export-dropdown{max-width:12rem}\n"], dependencies: [{ kind: "component", type: i2.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "component", type: i3.ClrDropdown, selector: "clr-dropdown", inputs: ["clrCloseMenuOnItemClick"] }, { kind: "component", type: i3.ClrDropdownMenu, selector: "clr-dropdown-menu", inputs: ["clrPosition"] }, { kind: "directive", type: i3.ClrDropdownTrigger, selector: "[clrDropdownTrigger],[clrDropdownToggle]" }, { kind: "directive", type: i3.ClrDropdownItem, selector: "[clrDropdownItem]", inputs: ["clrDisabled", "id"] }, { kind: "directive", type: i2$1.ClrIfOpen, selector: "[clrIfOpen]", inputs: ["clrIfOpen"], outputs: ["clrIfOpenChange"] }, { kind: "directive", type: i5$1.ClrLoading, selector: "[clrLoading]", inputs: ["clrLoading"] }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ExportDatagridComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-dg-export', standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n@if (selectedItemsCount > 0 || filteredItemsCount > 0) {\n  <clr-dropdown class=\"column-switch-wrapper\">\n    <button\n      data-test-id=\"export-link\"\n      type=\"button\"\n      class=\"column-toggle-action btn btn-sm btn-link\"\n      [clrLoading]=\"exportStatus.inProgress || false\"\n      [disabled]=\"!(allItemsCount > 0)\"\n      (click)=\"exportAllIfOnlyOption()\"\n      clrDropdownTrigger\n    >\n      {{ dgStrings.exportLink }}\n      @if (selectedItemsCount > 0 || filteredItemsCount > 0) {\n        <cds-icon shape=\"angle\" direction=\"down\"></cds-icon>\n      }\n    </button>\n    <clr-dropdown-menu class=\"export-dropdown\" clrPosition=\"top-left\" *clrIfOpen>\n      @if (selectedItemsCount > 0 || filteredItemsCount > 0) {\n        <button type=\"button\" clrDropdownItem (click)=\"onExportClick(exportType.ALL)\">\n          {{ dgStrings.exportAll }} {{ allRowsCount }}\n        </button>\n      }\n      @if (filteredItemsCount > 0) {\n        <button type=\"button\" clrDropdownItem (click)=\"onExportClick(exportType.MATCHING_FILTERS)\">\n          {{ dgStrings.exportMatchingFilters }}\n          {{ matchedFilterRowsCount }}\n        </button>\n      }\n      @if (selectedItemsCount > 0) {\n        <button type=\"button\" clrDropdownItem (click)=\"onExportClick(exportType.SELECTED_ONLY)\">\n          {{ dgStrings.exportSelectedRows }} {{ selectedRowsCount }}\n        </button>\n      }\n    </clr-dropdown-menu>\n  </clr-dropdown>\n} @else {\n  <div class=\"column-switch-wrapper\">\n    <button\n      data-test-id=\"export-link\"\n      type=\"button\"\n      class=\"column-toggle-action btn btn-sm btn-link\"\n      [clrLoading]=\"exportStatus.inProgress || false\"\n      [disabled]=\"!(allItemsCount > 0)\"\n      (click)=\"exportAllIfOnlyOption()\"\n    >\n      {{ dgStrings.exportLink }}\n    </button>\n  </div>\n}\n", styles: [".export-dropdown{max-width:12rem}\n"] }]
        }], ctorParameters: () => [{ type: DatagridStrings }], propDecorators: { allItemsCount: [{
                type: Input
            }], filteredItemsCount: [{
                type: Input
            }], selectedItemsCount: [{
                type: Input
            }], exportEventEmitter: [{
                type: Output
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Used to determine whether the datagrid row is locked (disabled) or not, by
 * returning boolean result. If the disabled state is provided and is true the row
 * is consider as not selectable. If  isLocked function is provided the return
 * boolean result from it is used to be determine whether the row is selectable.
 * If  isLocked function is not provided the pipe returns null, row is consider
 * selectable.
 *
 * Usage:
 *    rowItem | isRowSelectable: isLockedFunction : disabled
 */
class IsRowSelectablePipe {
    transform(rowItem, isLocked, disabled) {
        if (disabled) {
            return false;
        }
        if (isLocked) {
            return !isLocked(rowItem);
        }
        return true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: IsRowSelectablePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: IsRowSelectablePipe, isStandalone: false, name: "isRowSelectable" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: IsRowSelectablePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'isRowSelectable', standalone: false }]
        }] });

/**
 * DatagridComponent represents a data-bound list control that displays items from an array-based source in the form of columns and rows.
 * The component is built on top of the ClrDatagrid component from Clarity
 * and provides additional functionality and customization options on top of the base ClrDatagrid.
 *
 * @template T - The type of the data being displayed in the datagrid.
 * This allows the datagrid to enforce type safety for the items passed to it, ensuring
 * that the `gridItems` and other related inputs conform to a specific structure.
 *
 * @example
 * <appfx-datagrid [gridItems]="data" [columns]="columns"></appfx-datagrid>
 */
class DatagridComponent {
    #defaultActionButtonClass;
    #interpolationExpression;
    #unsubscribeSubject;
    #zoomLevelSubscription;
    /**
     * Array of objects defining the properties of each column in the Datagrid.
     *
     * @type ColumnDefinition
     */
    #dgColumns;
    #selectionType;
    #selectedItems;
    #rowSelectionMode;
    #actionBarActions;
    /**
     * Disable datagrid rows, has the same value as
     * 'disabled' input and is changed when this input is changed.
     * It is needed only because in some modals when the grid is init with
     * disabled state equal to true this state is not apply on row select column
     * and row's checkbox/radiobuttons for selection are enabled for disabled grid.
     * The resolution of this problem is the row disabled state to be init in ngAfterViewInit
     * method on a base of 'disabled' input.
     * Default: false
     */
    #areRowsDisabled;
    #pageSize;
    /**
     * Whether there are applied advanced filters
     */
    #hasAdvancedFilters;
    #wrapCellText;
    constructor(datagridStrings, uid, cdr, exportProviderService, groupService, zoomLevelService) {
        this.uid = uid;
        this.cdr = cdr;
        this.exportProviderService = exportProviderService;
        this.groupService = groupService;
        this.zoomLevelService = zoomLevelService;
        this.searchTerm = '';
        this.draggedItems = [];
        /**
         * Shows loading indicator inside the datagrid to prevent user interactions while data is loading.
         * Set to `true` to display loading; set to `false` to hide the loading indicator.
         * Defaults to `false`.
         */
        this.loading = false;
        /**
         * When set to `true`, automatically selects the first item in the datagrid upon initialization.
         * Defaults to `false`.
         */
        this.preSelectFirstItem = false;
        /**
         * The totalItems should be provided when the grid is server driven datagrid
         * (serverDrivenDatagrid = true), otherwise the totalItems is calculated
         * internally and shouldn't be set.
         */
        this.totalItems = 0;
        /**
         * Shows the projected custom pagination component from the host component.
         * Used for infinite pagination scenarios.
         * Default: false
         */
        this.showCustomPagination = false;
        /**
         * Enables or disables server-driven mode for the datagrid.
         * When set to `true`, pagination and filtering should be managed externally.
         * Defaults to `false`.
         */
        this.serverDrivenDatagrid = false;
        /**
         * All grid items count when no filter is added.
         * Used for Export functionality when showExport is true.
         * Should be provided only when the grid is server driven datagrid
         * (serverDrivenDatagrid = true), otherwise the listItemsCount is calculated
         * internally and shouldn't be set.
         *
         * @deprecated To be removed with VSUIP-4776
         */
        this.listItemsCount = 0;
        this.rowsExpandedByDefault = false;
        /**
         * The state passed to the detail pane. Contains the gridItem for which
         * detail is shown or null in case detail pane is hidden.
         */
        this.detailState = null;
        /**
         * Used to notify the hosting view that the detailState value has changed
         * ( to enable two way data binding )
         */
        this.detailStateChange = new EventEmitter(true);
        /**
         * An array of properties used for advanced filtering in FilterMode.Advanced
         */
        this.filterableProperties = [];
        /**
         * Controls whether the datagrid uses virtual scrolling to render data.
         * Virtual scrolling improves performance with large datasets by only rendering
         * rows that are currently visible in the viewport.
         *
         * @remarks
         * Virtual scrolling has the following limitations:
         * - Requires fixed row height for accurate scroll position calculations
         * - Cell text is always truncated to maintain consistent row heights
         * - Expandable rows are not supported due to height constraints
         * - Only works with server-driven data mode
         *
         * @default false
         */
        this.virtualScrolling = false;
        /**
         * Input for providing data when virtual scrolling is enabled.
         * <code>gridItems</code> should not be used in this case.
         */
        this.dataRange = {
            total: 100,
            skip: 0,
            data: [],
        };
        /**
         * Emits the updated page size {@link pageSize} to the parent component when changed.
         */
        this.pageSizeChange = new EventEmitter();
        /**
         * Emits the updated gridItems to the parent component when changed.
         */
        this.gridItemsChange = new EventEmitter();
        /**
         * Emits when advanced filter criteria changes.
         */
        this.advancedFilterChange = new EventEmitter();
        /**
         * Emits the updated column definitions {@link columns} to the parent component when changed.
         */
        this.columnDefsChange = new EventEmitter();
        /**
         * Emits the updated selected items {@link selectedItems} when changed.
         */
        this.selectedItemsChange = new EventEmitter();
        /**
         * Event emitter to tell the hosting view that user has requested to export list data
         */
        this.exportDataEvent = new EventEmitter();
        /**
         * Event emitter to tell hosting view that search term, used for filtering has changed.
         */
        this.searchTermChange = new EventEmitter();
        /**
         * Event emitter to tell hosting view that size of column has changed.
         */
        this.columnResize = new EventEmitter();
        /**
         * Event emitter to tell hosting view that sort order of column has changed.
         */
        this.columnSortOrderChange = new EventEmitter();
        /**
         * Event emitter to tell hosting view that hidden state of column has changed.
         */
        this.columnHiddenStateChange = new EventEmitter();
        /**
         * Event emitter to tell hosting view that column filtering has changed.
         */
        this.columnFilterChange = new EventEmitter();
        /**
         * Event emitter emitted when the data needs to be refreshed,
         * based on user action or external ones.
         */
        this.refreshGridData = new EventEmitter();
        /**
         * Event emitter emits when data in the grid with virtual scrolling needs to be refreshed.
         */
        this.refreshVirtualGridData = new EventEmitter();
        /**
         * Event emitter triggered when a single-row action or actionbar action is clicked.
         * The emitted event contains information about the action that was clicked. {@link ActionClickEvent}
         */
        this.actionClick = new EventEmitter();
        /**
         * Event emitter triggered when the single-row action menu is opened.
         * The emitted event contains information about the open state and the actions associated with the menu. {@link SingleRowActionOpen}
         */
        this.rowActionMenuOpenChange = new EventEmitter();
        /**
         * Event emitter triggered when a right-click event is performed on a grid row.
         */
        this.openContextMenu = new EventEmitter();
        /**
         * Event emitter to tell hosting view that column order has changed.
         */
        this.columnOrderChange = new EventEmitter();
        this.applyFlexLayout = true;
        this.zoomLevel = ZoomLevel.none;
        this.gridLayoutModel = {
            compact: true,
            disabled: false,
            stretchToParentHeight: true,
        };
        this.gridFooterModel = {
            showFooter: true,
            hideColumnToggle: false,
            enableCustomExport: false,
        };
        this.defaultUnsetValue = undefined;
        this.defaultUnsortedOrder = ClrDatagridSortOrder.UNSORTED;
        this.enableSingleRowActions = false;
        this.#defaultActionButtonClass = ActionBarLayout.flatCompact;
        this.#interpolationExpression = /\{(\d+)\}/g;
        this.#unsubscribeSubject = new Subject();
        this.#zoomLevelSubscription = new Subscription();
        this.#selectionType = SelectionType.Single;
        this.#selectedItems = [];
        this.#rowSelectionMode = true;
        this.#actionBarActions = [];
        /**
         * Disable datagrid rows, has the same value as
         * 'disabled' input and is changed when this input is changed.
         * It is needed only because in some modals when the grid is init with
         * disabled state equal to true this state is not apply on row select column
         * and row's checkbox/radiobuttons for selection are enabled for disabled grid.
         * The resolution of this problem is the row disabled state to be init in ngAfterViewInit
         * method on a base of 'disabled' input.
         * Default: false
         */
        this.#areRowsDisabled = false;
        this.#pageSize = 0;
        /**
         * Whether there are applied advanced filters
         */
        this.#hasAdvancedFilters = false;
        this.#wrapCellText = true;
        this.trackByGridItemFn = (item) => this.trackByFn(0, (item || {}));
        this.dgStrings = {
            ...datagridStrings,
        };
    }
    /**
     * Input property for the grid layout configuration.
     * Allows the consumer of the component to provide configuration values.
     *
     * @See GridLayoutModel
     */
    get layoutModel() {
        return { ...this.gridLayoutModel };
    }
    set layoutModel(config) {
        this.gridLayoutModel = {
            ...config,
            compact: config?.compact ?? true,
            stretchToParentHeight: config?.stretchToParentHeight ?? true,
        };
        this.applyFlexLayout = !!this.gridLayoutModel.stretchToParentHeight;
    }
    /**
     * Input property for the footer configuration.
     * Allows the consumer of the component to provide configuration values.
     *
     * @See GridFooterModel
     */
    get footerModel() {
        return { ...this.gridFooterModel };
    }
    set footerModel(config) {
        this.gridFooterModel = {
            ...config,
            showFooter: config?.showFooter ?? true,
        };
    }
    /**
     * Array of column definitions that configure the appearance and behavior of each column in the Datagrid.
     *
     * Each object in this array represents a column {@link ColumnDefinition}.
     * The required ColumnDefinition properties are:
     * - `displayName`: The text for the column header.
     * - `field`: The name of the property in the data source to be shown in the column.
     */
    get columns() {
        return this.#dgColumns;
    }
    set columns(columns) {
        this.#dgColumns = columns;
        if (columns) {
            this.visibleColumns = columns.filter((column) => !column.hidden);
            this.columnDefsChange.emit(this.#dgColumns);
        }
        if (this.clrDatagrid.columns) {
            this.clrDatagrid.dataChanged();
        }
    }
    /**
     * Defines the grid selection type.
     * Accepts a value from `SelectionType` enum {@link SelectionType}, which specifies the row selection behavior:
     * - `SelectionType.NONE`: No rows are selectable.
     * - `SelectionType.SINGLE_SELECT` (default): Only one row can be selected at a time.
     * - `SelectionType.MULTI_SELECT`: Multiple rows can be selected.
     *
     * Defaults to `SelectionType.SINGLE_SELECT`.
     */
    get selectionType() {
        return this.#selectionType;
    }
    set selectionType(type) {
        // guard against malformed component bindings to unset variables
        if (type !== undefined) {
            this.#selectionType = selectionTypeAttribute(type);
            if (this.clrDatagrid) {
                this.initGridSelection();
            }
        }
    }
    /**
     * Array of grid items {@link gridItems} which to be selected.
     */
    get selectedItems() {
        return this.#selectedItems;
    }
    set selectedItems(items) {
        this.#selectedItems = Array.isArray(items) ? items.filter((item) => item !== undefined) : [];
        this.cdr.detectChanges();
    }
    /**
     * Enables or disables selection/deselection of rows when a row is clicked.
     * If `SelectionType` is set to `NONE`, row selection is automatically disabled, regardless of this setting.
     * Defaults to `true`.
     */
    get rowSelectionMode() {
        // Clarity 15 allows row selection even though the selection mode is none.
        // Ensure that row selection mode is false when selection mode is none.
        return this.#selectionType === SelectionType.None ? false : this.#rowSelectionMode;
    }
    set rowSelectionMode(value) {
        this.#rowSelectionMode = value;
    }
    /**
     * Action definitions for the action bar.
     */
    get actionBarActions() {
        return this.#actionBarActions;
    }
    set actionBarActions(actions) {
        if (actions) {
            actions.forEach((action) => {
                action.class = action.class || this.#defaultActionButtonClass;
            });
            this.#actionBarActions = actions;
        }
    }
    /**
     * Sets the number of items displayed per page in the datagrid.
     * By default, no page size is set.
     */
    get pageSize() {
        return this.#pageSize;
    }
    set pageSize(value) {
        this.#pageSize = value;
        if (value > 0) {
            this.pageSizeChange.emit(this.#pageSize);
        }
    }
    set datagridLabels(overriddenStrings) {
        if (overriddenStrings) {
            for (const key of Object.keys(overriddenStrings)) {
                this.dgStrings[key] = overriddenStrings[key] || '';
            }
        }
    }
    /**
     * Defines whether the content in the cells of the datagrid should be wrapped
     * {@see DatagridContentNoWrapDirective}.
     */
    get wrapText() {
        return this.#wrapCellText;
    }
    set wrapText(value) {
        if (value !== this.#wrapCellText) {
            this.#wrapCellText = value;
            this.cdr.markForCheck();
        }
    }
    get rowsDisabled() {
        return this.#areRowsDisabled;
    }
    get enableToolBar() {
        return !!this.actionBarActions?.length || (this.filterMode !== null && this.filterMode !== undefined);
    }
    get enableExportButton() {
        return !!this.gridFooterModel.enableCustomExport || !!this.gridFooterModel.clientSideExportConfig;
    }
    get selectedItemsCount() {
        return this.#selectedItems ? this.#selectedItems.length : 0;
    }
    get showDeselectAll() {
        return this.#selectionType === SelectionType.Multi;
    }
    get deselectAllDisabled() {
        return this.selectedItemsCount === 0;
    }
    get filteredItemsCount() {
        let filteredItemsCount = 0;
        if (this.searchTerm?.length > 0 || this.#hasAdvancedFilters) {
            filteredItemsCount = this.totalItems;
        }
        return filteredItemsCount;
    }
    ngOnInit() {
        this.initGridSelection();
        this.initTotalItemsCount();
        if (this.zoomLevelService) {
            this.zoomLevelService.onChange.subscribe((v) => (this.zoomLevel = v));
        }
    }
    ngAfterViewInit() {
        this.#areRowsDisabled = !!this.gridLayoutModel.disabled;
    }
    ngOnDestroy() {
        this.#unsubscribeSubject.next();
        this.#unsubscribeSubject.complete();
        this.#zoomLevelSubscription.unsubscribe();
    }
    resize() {
        this.clrDatagrid.resize();
    }
    onModelChange() {
        this.cdr.markForCheck();
    }
    onContextMenu($event, item) {
        if (this.#selectionType !== SelectionType.None &&
            !this.isItemSelected(item) &&
            (!this.isRowLocked || !this.isRowLocked(item))) {
            this.#selectedItems = [];
            this.updateSelectedItems(item);
        }
        const targets = this.#selectionType === SelectionType.Multi ? this.#selectedItems : [item];
        $event.preventDefault();
        this.openContextMenu.emit({ event: $event, context: targets });
    }
    onColumnOrderChange(data) {
        this.columns = data.columns;
        this.visibleColumns = this.columns.filter((column) => !column.hidden);
        this.cdr.detectChanges();
        //Without resize when the grid is empty and column is moved
        //the columns are not displayed correctly
        this.resize();
        this.columnOrderChange.emit(data);
    }
    /**
     * Virtual scroll event handler. Called when visible data range has changed
     */
    renderedRangeChange($event) {
        const currentPageState = {
            page: { size: $event.end - $event.start, from: $event.start },
        };
        if ($event.start === 0 && $event.end === 0) {
            return;
        }
        this.refreshVirtualGridData.emit(currentPageState);
        this.cdr.detectChanges();
    }
    /**
     * Scrolls to a specified index when virtual scrolling is enabled.
     */
    scrollToIndex(index, behavior) {
        if (this.virtualScrolling) {
            this.clrDatagrid.virtualScroll.scrollToIndex(index, behavior);
        }
    }
    ngOnChanges(changes) {
        if (changes['gridItems'] && changes['gridItems'].currentValue) {
            this.gridItemsChange.emit(this.gridItems);
            this.preselectDetail();
            if (!this.serverDrivenDatagrid) {
                this.totalItems = this.gridItems.length;
                this.listItemsCount = this.gridItems.length;
            }
            else if (!changes['gridItems'].isFirstChange() && this.selectionType === SelectionType.Multi) {
                this.notifyOnChanges();
            }
        }
        // inform Clarity datagrid component for building headers
        if (changes['columns'] &&
            Array.isArray(changes['columns'].currentValue) &&
            changes['columns'].currentValue.length) {
            this.cdr.detectChanges();
        }
        //Skip first initial change of disabled field, initially the
        //areRowsDisabled field is updated in ngAfterViewInit method
        if (changes.layoutModel?.currentValue && !changes.layoutModel.isFirstChange()) {
            this.#areRowsDisabled = !!this.gridLayoutModel?.disabled;
        }
        if (changes['singleRowActions']) {
            this.initActionTypes();
        }
    }
    trackByColumnId(index, column) {
        return column.uid || column.displayName;
    }
    buildRowDetailContentId(index) {
        return `datagrid-${this.uid}-row-detail-${index}`;
    }
    onAdvancedFilterCriteriaChange(filterCriteria) {
        // We need to know if there are filters, because of filteredItemsCount
        this.#hasAdvancedFilters = filterCriteria ? filterCriteria.length > 0 : false;
        this.advancedFilterChange.emit(filterCriteria);
    }
    /**
     * Handles datagrid selected items changes.
     * It is public because is use from directives to emit selection
     * change events (see DatagridPreserveSelection directive).
     */
    onSelectedItemsChange(selected) {
        this.#selectedItems = selected;
        this.selectedItemsChange.emit(selected);
    }
    /**
     * Return DataGrid footer label.
     * - Return "datagridLabels.footer" property, if defined.
     * - If there is one item -> 1 item
     * - If there is no paging -> {0} items
     * - Else -> {1} - {2} of {0} items
     */
    getFooterMessage(totalItems, pageSize, firstItem, lastItem) {
        let footer = this.dgStrings.footer;
        if (footer) {
            // Footer is overridden.
            return this.interpolateMessage(footer, [totalItems, firstItem, lastItem]);
        }
        // Flag indicating when to show current range of loaded items (e.g. {1} - {2} of {0} items)
        const showRange = (pageSize !== undefined && pageSize > 0 && totalItems > pageSize) ||
            (lastItem !== undefined &&
                firstItem !== undefined &&
                this.virtualScrolling &&
                totalItems > 0 &&
                totalItems > lastItem - firstItem + 1);
        if (totalItems === 1) {
            footer = this.dgStrings.singleItem;
        }
        else if (showRange) {
            footer = this.interpolateMessage(this.dgStrings.pagedItems, [totalItems, firstItem, lastItem]);
        }
        else {
            footer = this.interpolateMessage(this.dgStrings.multipleItems, [totalItems]);
        }
        return footer;
    }
    getExpandDetailsLabel(item) {
        if (!this.hasExpandableRows(item)) {
            return '';
        }
        const itemName = item[this.visibleColumns?.[0]?.field || ''] || '';
        return this.interpolateMessage(this.dgStrings.expandDetailsPaneLabel, [itemName]);
    }
    getCollapseDetailsLabel(item) {
        if (!this.hasExpandableRows(item)) {
            return '';
        }
        const itemName = item[this.visibleColumns?.[0]?.field || ''] || '';
        return this.interpolateMessage(this.dgStrings.collapseDetailsPaneLabel, [itemName]);
    }
    onColumnResize(columnSize, column) {
        this.columnResize.emit({ columnSize: columnSize, column: column });
    }
    onSortOrderChange(sortOrder, column) {
        const columnSortOrder = {
            sortOrder: sortOrder,
            column: column,
        };
        if (this.gridFooterModel?.clientSideExportConfig?.sort) {
            this.gridFooterModel.clientSideExportConfig.sortOrder = columnSortOrder;
        }
        this.columnSortOrderChange.emit(columnSortOrder);
        this.columns.forEach(col => (col.defaultSortOrder = this.defaultUnsortedOrder));
        column.defaultSortOrder = sortOrder;
    }
    onDeselectAllClick() {
        this.#selectedItems = [];
        this.selectedItemsChange.emit(this.#selectedItems);
    }
    onSelectAllInVirtualGrid(isSelect) {
        if (isSelect) {
            // Select all
            // Append all currently loaded records to the existing selection
            const newSelection = [...this.#selectedItems];
            this.dataRange.data.forEach(item => {
                if (!this.#selectedItems.some(selected => this.trackByGridItemFn(selected) === this.trackByGridItemFn(item))) {
                    newSelection.push(item);
                }
            });
            this.#selectedItems = newSelection;
            this.selectedItemsChange.emit(newSelection);
        }
        else {
            // Deselect all
            this.onDeselectAllClick();
        }
    }
    onDragStart(row) {
        this.setDraggedItems(row);
    }
    onDragMove() {
        // note mibryamov: since the default strategy for change detection is
        // OnPush, if we don't mark the view changed on every drag move, when
        // you stop the dragging without triggering OnDrop on the target area,
        // the dragging ghost element is not positioned as expected when
        // disappearing, it goes to the top-left corner of the page instead of
        // going to the drop handle icon from where the drag is triggered. To
        // prevent this we should mark the view changed on every move.
        this.cdr.markForCheck();
    }
    onFilterChange(filterValue, column) {
        this.columnFilterChange.emit({
            filterValue: filterValue,
            column: column,
        });
    }
    onColumnHiddenStateChange(value) {
        this.columnHiddenStateChange.emit(value);
        if (this.gridItems && this.gridItems.length === 0 && value.hidden === false) {
            // Force change detection otherwise column is not shown when grid is empty
            this.cdr.detectChanges();
            this.resize();
        }
    }
    refreshGrid(state) {
        if (this.virtualScrolling) {
            return;
        }
        // There is a 'cosmetic' change in Clarity 2 in the page provider.
        // The change is related to using firstItem & lastItem in generating page info, when there are no items.
        // However, this breaks our data retrieval. For this reason, we are keeping the page state as it was before.
        if (state.page && state.page.from === -1) {
            state.page.from = 0;
        }
        if (state.page && state.page.to === -1) {
            state.page.to = 0;
        }
        this.refreshGridData.emit(state);
        if (this.detailState) {
            this.cdr.detectChanges();
        }
    }
    onExportEvent(exportStatus) {
        if (this.footerModel.enableCustomExport || this.footerModel.clientSideExportConfig?.customExport) {
            // If custom export is enabled, emit the export event and return.
            this.exportDataEvent.emit(exportStatus);
            return;
        }
        if (this.footerModel.clientSideExportConfig) {
            // If client-side export configuration is available, process with the export.
            const datagridItemSet = {
                totalDatagridItems: this.gridItems,
                selectedItems: this.selectedItems,
                filteredDatagridItems: [],
            };
            this.exportProviderService.exportUIOnlyData(this.footerModel.clientSideExportConfig, exportStatus, datagridItemSet);
        }
    }
    onActionClick(action, context) {
        // We have context when is clicked row action
        // when the action bar action is clicked the context is the selected items
        if (!context) {
            context = this.#selectedItems;
        }
        this.actionClick.emit({ action: action, context: context });
    }
    onRowActionOverflowOpen(open, actions, item) {
        this.rowActionMenuOpenChange.emit({
            open: open,
            actions: actions,
            context: item,
        });
    }
    onAdvancedSearchTermChange(searchTerm) {
        // We need the search term, because of filteredItemsCount
        this.searchTerm = searchTerm;
        this.searchTermChange.emit(searchTerm);
    }
    /**
     * Update "detailState" with the latest value
     * @param state
     */
    onDetailStateChange(state) {
        if (state !== this.detailState) {
            this.detailState = state;
            this.detailStateChange.emit(state);
        }
    }
    /**
     * Angular ngFor optimization:
     * By allowing client to specify a given function or property key lookup expression
     * the looping and binding over large datasets can now offer performance.
     * The default Angular differ offered is slower since it does a complete object comparison.
     */
    trackByFn(index, gridItem) {
        const trackByGridItemPropertySeparator = '.'; // rethink constant when properties have "."
        if (this.trackByGridItemProperty) {
            let parseValid = false;
            const observedPropertyValue = this.trackByGridItemProperty
                .split(trackByGridItemPropertySeparator)
                .reduce((o, i) => (parseValid = Object.prototype.hasOwnProperty.call(o, i)) && o[i], gridItem);
            if (parseValid) {
                return observedPropertyValue;
            }
        }
        if (this.trackByFunction) {
            return this.trackByFunction(index, gridItem);
        }
        return gridItem;
    }
    isItemSelected(item) {
        for (const selectedItem of this.#selectedItems) {
            if (selectedItem === item) {
                return true;
            }
        }
        return false;
    }
    dropGroup(group) {
        return (this.groupService?.getGroupItems(group) || []);
    }
    hasExpandableRows(item) {
        return !!this.detailHeader || !!this.detailBody || !!item?.rowDetailRenderer || !!this.rowDetailContent;
    }
    preselectDetail() {
        const isDetailEnabled = !!this.detailHeader || !!this.detailBody;
        if (isDetailEnabled && this.detailState && this.trackByGridItemProperty) {
            const gridItems = this.gridItems || [];
            const matchingItems = gridItems.filter((item) => {
                return (item[this.trackByGridItemProperty] === this.detailState?.[this.trackByGridItemProperty]);
            });
            if (matchingItems.length === 0) {
                // Hide detail pane when item is no longer present in the dataset
                this.detailState = null;
            }
            else {
                this.detailState = matchingItems[0];
                // In order for the datagrid detail caret button to be activated and
                // detail pane anchor to point to the grid item two change
                // detection cycles are required. Otherwise the detail pane is shown
                // but anchor and activated datagrid detail caret button are not.
                this.cdr.detectChanges();
            }
            this.cdr.markForCheck();
        }
    }
    setDraggedItems(row) {
        this.draggedItems = [];
        if (this.isItemSelected(row)) {
            this.draggedItems.push(...this.#selectedItems);
        }
        else {
            this.draggedItems.push(row);
        }
    }
    /**
     * Notifies clarity datagrid about data changes.
     * When <code>trackByFunction</code> or <code>trackByGridItemProperty</code>
     * is provided clarity datagrid is not able to pick up data changes in the
     * <code>rows</<code> collection and selection is messed up. Angular just
     * does not emit <code>QueryList<T>.changes</code> in this case.
     */
    notifyOnChanges() {
        // Disable check for this.trackByFunction since the compiler thinks it's always assigned but that's not the case.
        // In the PreselectComponent interface, trackByFunction is required but in the datagrid it's optional.
        // @ts-ignore
        if (this.trackByGridItemProperty || this.trackByFunction) {
            setTimeout(() => {
                this.clrDatagrid?.rows?.notifyOnChanges();
            }, 0);
        }
    }
    initActionTypes() {
        if (this.singleRowActions) {
            this.enableSingleRowActions = true;
            this.cdr.markForCheck();
        }
    }
    initGridSelection() {
        if (this.clrDatagrid) {
            this.clrDatagrid.identityFn = this.trackByGridItemFn;
        }
        if (this.preSelectFirstItem && this.gridItems && this.gridItems.length > 0) {
            // TODO: Find better solution, This will not work if we
            // have some default sorting
            this.#selectedItems = [this.gridItems[0]];
        }
    }
    updateSelectedItems(item) {
        if (this.#selectionType === SelectionType.Single) {
            this.#selectedItems = [item];
        }
        else {
            this.#selectedItems.push(item);
        }
        this.selectedItemsChange.emit(this.#selectedItems);
    }
    initTotalItemsCount() {
        if (!this.footerModel.showFooter || this.serverDrivenDatagrid) {
            return;
        }
        if (this.gridItems && this.gridItems.length > 0) {
            this.totalItems = this.gridItems.length;
            this.cdr.markForCheck();
        }
        // This clarity items (clrDatagrid.items) are all items if there are no pages
        // and only the items in the page if there are pages in the grid.
        // We can listen for changes and update the totalItems only if the grid doesn't use
        // pages. This is usable for example when the user filer data in the grid which doesn't
        // have pages, in this case we can show correctly the number of items displayed after filtering
        this.clrDatagrid.items.change
            .pipe(filter(() => this.pageSize <= 0), takeUntil(this.#unsubscribeSubject))
            .subscribe((value) => {
            this.totalItems = value.length;
        });
    }
    interpolateMessage(message, parameters) {
        return message.replace(this.#interpolationExpression, (match, index) => {
            if (index >= parameters.length) {
                // There are fewer parameters than there are placeholders,
                // return the placeholder value.
                return match;
            }
            return String(parameters[index]);
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridComponent, deps: [{ token: DatagridStrings }, { token: uniqueIdToken }, { token: i0.ChangeDetectorRef }, { token: ExportProviderService }, { token: i3$3.DragAndDropGroupService, optional: true }, { token: i4.ZoomLevelService, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: DatagridComponent, isStandalone: false, selector: "appfx-datagrid", inputs: { loading: "loading", preSelectFirstItem: "preSelectFirstItem", pageSizeOptions: "pageSizeOptions", totalItems: "totalItems", showCustomPagination: "showCustomPagination", serverDrivenDatagrid: "serverDrivenDatagrid", listItemsCount: "listItemsCount", rowDetailContent: "rowDetailContent", rowsExpandedByDefault: "rowsExpandedByDefault", trackByFunction: "trackByFunction", trackByGridItemProperty: "trackByGridItemProperty", detailHeader: "detailHeader", detailBody: "detailBody", detailState: "detailState", isRowLocked: "isRowLocked", dragConfig: "dragConfig", filterableProperties: "filterableProperties", filterMode: "filterMode", singleRowActions: "singleRowActions", preserveExistingSelectionOnFilter: "preserveExistingSelectionOnFilter", virtualScrolling: "virtualScrolling", dataRange: "dataRange", gridItems: "gridItems", layoutModel: "layoutModel", footerModel: "footerModel", columns: "columns", selectionType: "selectionType", selectedItems: "selectedItems", rowSelectionMode: "rowSelectionMode", actionBarActions: "actionBarActions", pageSize: "pageSize", datagridLabels: "datagridLabels" }, outputs: { detailStateChange: "detailStateChange", pageSizeChange: "pageSizeChange", gridItemsChange: "gridItemsChange", advancedFilterChange: "advancedFilterChange", columnDefsChange: "columnDefsChange", selectedItemsChange: "selectedItemsChange", exportDataEvent: "exportDataEvent", searchTermChange: "searchTermChange", columnResize: "columnResize", columnSortOrderChange: "columnSortOrderChange", columnHiddenStateChange: "columnHiddenStateChange", columnFilterChange: "columnFilterChange", refreshGridData: "refreshGridData", refreshVirtualGridData: "refreshVirtualGridData", actionClick: "actionClick", rowActionMenuOpenChange: "rowActionMenuOpenChange", openContextMenu: "openContextMenu", columnOrderChange: "columnOrderChange" }, host: { properties: { "class.embedded-flex-component": "this.applyFlexLayout", "class": "this.zoomLevel" } }, providers: [
            ExportProviderService,
            uniqueIdProvider,
            {
                provide: appfxPreselectableComponentToken,
                useExisting: forwardRef(() => DatagridComponent),
            },
        ], viewQueries: [{ propertyName: "clrDatagridPagination", first: true, predicate: ClrDatagridPagination, descendants: true }, { propertyName: "clrDatagrid", first: true, predicate: ClrDatagrid, descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-datagrid\n  zoomLevelIndicator\n  [clrDgDisablePageFocus]=\"true\"\n  [clrDgPreserveSelection]=\"preserveExistingSelectionOnFilter\"\n  [clrDgSelectionType]=\"selectionType\"\n  [clrDgSelected]=\"selectedItems\"\n  [clrDgItemsIdentityFn]=\"trackByGridItemFn\"\n  (clrDgRefresh)=\"refreshGrid($event)\"\n  [clrDgLoading]=\"loading\"\n  [clrDgRowSelection]=\"rowSelectionMode\"\n  [ngClass]=\"{\n    'disabled-grid': gridLayoutModel.disabled,\n    'datagrid-compact': gridLayoutModel.compact,\n    'flex-clr-datagrid': gridLayoutModel.stretchToParentHeight,\n    'datagrid-overflow-ellipsis': virtualScrolling || !wrapText,\n  }\"\n  cdkDropList\n  [cdkDropListAutoScrollStep]=\"5\"\n  appfxDgColumnsOrder\n  [clrDgCustomSelectAllEnabled]=\"virtualScrolling\"\n  (clrDgCustomSelectAll)=\"onSelectAllInVirtualGrid($event)\"\n  [dgColumnsOrderColumns]=\"columns\"\n  [dgColumnsVirtualScrolling]=\"virtualScrolling\"\n  (dgColumnsOrderChange)=\"onColumnOrderChange($event)\"\n  (clrDgSelectedChange)=\"onSelectedItemsChange($event)\"\n>\n  @if (enableToolBar) {\n    <clr-dg-action-bar>\n      @if (!!actionBarActions.length) {\n        <div class=\"appfx-datagrid-actions-container\">\n          <appfx-datagrid-action-bar\n            class=\"action-bar\"\n            (invokeAction)=\"onActionClick($event)\"\n            [actions]=\"actionBarActions\"\n          >\n          </appfx-datagrid-action-bar>\n        </div>\n      }\n      @if (filterMode !== undefined && filterMode !== null) {\n        <appfx-datagrid-filters\n          [filterMode]=\"filterMode\"\n          [filterableProperties]=\"filterableProperties\"\n          (searchTermChange)=\"onAdvancedSearchTermChange($event)\"\n          (propertyFiltersChange)=\"onAdvancedFilterCriteriaChange($event)\"\n        >\n        </appfx-datagrid-filters>\n      }\n    </clr-dg-action-bar>\n  }\n  @if (dragConfig) {\n    <clr-dg-column class=\"draggableCell\" style=\"width: 20px\"></clr-dg-column>\n  }\n  @for (column of visibleColumns; track trackByColumnId(index, column); let index = $index) {\n    <clr-dg-column\n      cdkDrag\n      [cdkDragLockAxis]=\"'x'\"\n      [cdkDragData]=\"column\"\n      appfxColumnOrder\n      [columnData]=\"column\"\n      [columnIndex]=\"index\"\n      [style]=\"column.width ? { width: column.width } : null\"\n      (clrDgColumnResize)=\"onColumnResize($event, column)\"\n      [clrDgField]=\"column.sortAndFilterByField || defaultUnsetValue\"\n      [clrDgSortBy]=\"column.sortComparator || defaultUnsetValue\"\n      [clrDgSortOrder]=\"column.defaultSortOrder || defaultUnsortedOrder\"\n      (clrDgSortOrderChange)=\"onSortOrderChange($event, column)\"\n    >\n      @if (column.stringFilter || column.sortAndFilterByField) {\n        <clr-dg-filter [clrDgFilter]=\"appfxDatagridStringFilter\">\n          <appfx-datagrid-filter\n            #appfxDatagridStringFilter\n            [stringFilterType]=\"column.stringFilter\"\n            [filterValue]=\"column.defaultFilterValue\"\n            [fieldName]=\"column.sortAndFilterByField\"\n            (filterValueChange)=\"onFilterChange($event, column)\"\n          ></appfx-datagrid-filter>\n        </clr-dg-filter>\n      }\n      @if (column.filter) {\n        <clr-dg-filter>\n          <appfx-dg-filter-container\n            [filterType]=\"column.filter\"\n            [filterValue]=\"column.defaultFilterValue\"\n            (filterValueChange)=\"onFilterChange($event, column)\"\n          ></appfx-dg-filter-container>\n        </clr-dg-filter>\n      }\n      {{ column.displayName }}\n    </clr-dg-column>\n  }\n  <clr-dg-placeholder>\n    {{ dgStrings.noItemsFound }}\n    <ng-content select=\".custom-placeholder-content\"></ng-content>\n  </clr-dg-placeholder>\n\n  <!-- Server driven datagrid with virtual scrolling -->\n  @if (serverDrivenDatagrid && virtualScrolling) {\n    <ng-template\n      ClrVirtualScroll\n      let-item\n      let-i=\"index\"\n      [clrVirtualDataRange]=\"dataRange\"\n      [clrVirtualRowsItemSize]=\"25\"\n      [clrVirtualRowsMinBufferPx]=\"400\"\n      [clrVirtualRowsMaxBufferPx]=\"800\"\n      [clrVirtualRowsTemplateCacheSize]=\"400\"\n      [clrVirtualPersistItems]=\"false\"\n      [clrVirtualRowsTrackBy]=\"trackByFunction\"\n      (renderedRangeChange)=\"renderedRangeChange($event)\"\n    >\n      <clr-dg-row\n        [clrDgItem]=\"item\"\n        [clrDgSelectable]=\"item | isRowSelectable: isRowLocked : rowsDisabled\"\n        [clrDgRowSelectionLabel]=\"$any(item)?.[visibleColumns && visibleColumns.length ? visibleColumns[0].field : -1]\"\n        (contextmenu)=\"onContextMenu($event, item)\"\n        [clrDgSkeletonLoading]=\"!item\"\n      >\n        @if (dragConfig) {\n          <clr-dg-cell class=\"draggableCell\" style=\"width: 20px\">\n            <ng-container *ngTemplateOutlet=\"draggableCell; context: { $implicit: item }\"> </ng-container>\n          </clr-dg-cell>\n        }\n        @for (column of visibleColumns; track column) {\n          <clr-dg-cell class=\"fixed-cell-height\">\n            <appfx-dg-cell-container [column]=\"column\" [item]=\"item\"></appfx-dg-cell-container>\n          </clr-dg-cell>\n        }\n      </clr-dg-row>\n    </ng-template>\n  }\n\n  <!--  Server driven datagrid with paging -->\n  @if (serverDrivenDatagrid && !virtualScrolling) {\n    @for (item of gridItems; track trackByFn.bind(this)(i, item); let i = $index) {\n      <clr-dg-row\n        [clrDgItem]=\"item\"\n        [clrDgDetailOpenLabel]=\"getExpandDetailsLabel(item)\"\n        [clrDgDetailCloseLabel]=\"getCollapseDetailsLabel(item)\"\n        [clrDgSelectable]=\"item | isRowSelectable: isRowLocked : rowsDisabled\"\n        [clrDgRowSelectionLabel]=\"$any(item)?.[visibleColumns && visibleColumns.length ? visibleColumns[0].field : -1]\"\n        (contextmenu)=\"onContextMenu($event, item)\"\n      >\n        @if (enableSingleRowActions) {\n          <clr-dg-action-overflow\n            (clrDgActionOverflowOpenChange)=\"onRowActionOverflowOpen($event, singleRowActions, item)\"\n          >\n            @for (action of singleRowActions; track action) {\n              <button\n                class=\"action-item\"\n                (click)=\"onActionClick(action, item)\"\n                [title]=\"action.tooltip\"\n                [disabled]=\"!action.enabled\"\n              >\n                {{ action.label }}\n              </button>\n            }\n          </clr-dg-action-overflow>\n        }\n        @if (dragConfig) {\n          <clr-dg-cell class=\"draggableCell\" style=\"width: 20px\">\n            <ng-container *ngTemplateOutlet=\"draggableCell; context: { $implicit: item }\"> </ng-container>\n          </clr-dg-cell>\n        }\n        @for (column of visibleColumns; track column) {\n          <clr-dg-cell>\n            <appfx-dg-cell-container [column]=\"column\" [item]=\"item\"></appfx-dg-cell-container>\n          </clr-dg-cell>\n        }\n        @if (rowDetailContent) {\n          <ng-container ngProjectAs=\"clr-dg-row-detail\">\n            @if ({ id: buildRowDetailContentId(i) }; as detailData) {\n              <clr-dg-row-detail\n                *clrIfExpanded=\"rowsExpandedByDefault\"\n                tabindex=\"0\"\n                [attr.aria-describedby]=\"detailData.id\"\n              >\n                <div [id]=\"detailData.id\" class=\"datagrid-row-flex\">\n                  <ng-container *ngTemplateOutlet=\"rowDetailContent; context: { item: item }\"> </ng-container>\n                </div>\n              </clr-dg-row-detail>\n            }\n          </ng-container>\n        }\n      </clr-dg-row>\n    }\n  }\n\n  <!-- Client side datagrid with paging -->\n  @if (!serverDrivenDatagrid) {\n    <clr-dg-row\n      *clrDgItems=\"let item of gridItems; trackBy: trackByFn.bind(this); index as i\"\n      [clrDgItem]=\"item\"\n      [clrDgDetailOpenLabel]=\"getExpandDetailsLabel(item)\"\n      [clrDgDetailCloseLabel]=\"getCollapseDetailsLabel(item)\"\n      [clrDgSelectable]=\"item | isRowSelectable: isRowLocked : rowsDisabled\"\n      [clrDgRowSelectionLabel]=\"$any(item)?.[visibleColumns && visibleColumns.length ? visibleColumns[0].field : -1]\"\n      (contextmenu)=\"onContextMenu($event, item)\"\n    >\n      @if (enableSingleRowActions) {\n        <clr-dg-action-overflow\n          (clrDgActionOverflowOpenChange)=\"onRowActionOverflowOpen($event, singleRowActions, item)\"\n        >\n          @for (action of singleRowActions; track action) {\n            <button\n              class=\"action-item\"\n              (click)=\"onActionClick(action, item)\"\n              [title]=\"action.tooltip\"\n              [disabled]=\"!action.enabled\"\n            >\n              {{ action.label }}\n            </button>\n          }\n        </clr-dg-action-overflow>\n      }\n      @if (dragConfig) {\n        <clr-dg-cell class=\"draggableCell\">\n          <ng-container *ngTemplateOutlet=\"draggableCell; context: { $implicit: item }\"> </ng-container>\n        </clr-dg-cell>\n      }\n      @for (column of visibleColumns; track column) {\n        <clr-dg-cell>\n          <appfx-dg-cell-container [column]=\"column\" [item]=\"item\"></appfx-dg-cell-container>\n        </clr-dg-cell>\n      }\n      @if ($any(item).rowDetailRenderer) {\n        <ng-container ngProjectAs=\"clr-dg-row-detail\">\n          @if ({ id: buildRowDetailContentId(i) }; as detailData) {\n            <clr-dg-row-detail *clrIfExpanded tabindex=\"0\" [attr.aria-describedby]=\"detailData.id\">\n              <appfx-dg-cell-container\n                [id]=\"detailData.id\"\n                [column]=\"{\n                  displayName: '',\n                  field: '',\n                  columnRenderer: $any(item).rowDetailRenderer,\n                }\"\n                [item]=\"item\"\n              ></appfx-dg-cell-container>\n            </clr-dg-row-detail>\n          }\n        </ng-container>\n      }\n      @if (rowDetailContent) {\n        <ng-container ngProjectAs=\"clr-dg-row-detail\">\n          @if ({ id: buildRowDetailContentId(i) }; as detailData) {\n            <clr-dg-row-detail\n              *clrIfExpanded=\"rowsExpandedByDefault\"\n              tabindex=\"0\"\n              [attr.aria-describedby]=\"detailData.id\"\n            >\n              <div [id]=\"detailData.id\" class=\"datagrid-row-flex\">\n                <ng-container *ngTemplateOutlet=\"rowDetailContent; context: { item: item }\"> </ng-container>\n              </div>\n            </clr-dg-row-detail>\n          }\n        </ng-container>\n      }\n    </clr-dg-row>\n  }\n  @if (detailHeader || detailBody) {\n    <ng-container ngProjectAs=\"clr-dg-detail\">\n      <ng-template [clrIfDetail]=\"detailState\" (clrIfDetailChange)=\"onDetailStateChange($event)\" let-detail>\n        <clr-dg-detail>\n          @if (detailHeader) {\n            <clr-dg-detail-header>\n              <ng-container *ngTemplateOutlet=\"detailHeader; context: { $implicit: detail }\"></ng-container>\n            </clr-dg-detail-header>\n          }\n          @if (detailBody) {\n            <clr-dg-detail-body>\n              <ng-container *ngTemplateOutlet=\"detailBody; context: { $implicit: detail }\"></ng-container>\n            </clr-dg-detail-body>\n          }\n        </clr-dg-detail>\n      </ng-template>\n    </ng-container>\n  }\n  @if (gridFooterModel.showFooter) {\n    <clr-dg-footer>\n      @if (!gridFooterModel.hideColumnToggle) {\n        <appfx-dg-column-toggle [(columns)]=\"columns\" (columnHiddenStateChange)=\"onColumnHiddenStateChange($event)\">\n        </appfx-dg-column-toggle>\n      }\n      @if (enableExportButton) {\n        <appfx-dg-export\n          [allItemsCount]=\"gridFooterModel.clientSideExportConfig?.allItemsCount || listItemsCount\"\n          [selectedItemsCount]=\"selectedItemsCount\"\n          [filteredItemsCount]=\"filteredItemsCount\"\n          (exportEventEmitter)=\"onExportEvent($event)\"\n          class=\"export-link\"\n        >\n        </appfx-dg-export>\n      }\n      @if (showDeselectAll) {\n        <div class=\"column-switch-wrapper export-link\">\n          <button\n            class=\"btn btn-sm column-toggle-action\"\n            [disabled]=\"deselectAllDisabled\"\n            (click)=\"onDeselectAllClick()\"\n          >\n            {{ dgStrings.deselectAll }}\n          </button>\n        </div>\n      }\n      <ng-content select=\".custom-footer-content\"></ng-content>\n      @if (pageSize > 0) {\n        <ng-container ngProjectAs=\"clr-dg-pagination\">\n          <clr-dg-pagination #pagination [clrDgPageSize]=\"pageSize\" [clrDgTotalItems]=\"totalItems\">\n            @if (pageSizeOptions?.length) {\n              <clr-dg-page-size #clrDgPageSize [clrPageSizeOptions]=\"pageSizeOptions\">\n                <label [for]=\"clrDgPageSize.pageSizeOptionsId\"> {{ dgStrings.itemsPerPage }} </label>\n              </clr-dg-page-size>\n            }\n            {{\n              getFooterMessage(\n                pagination.totalItems,\n                pagination.pageSize,\n                pagination.firstItem + 1,\n                pagination.lastItem + 1\n              )\n            }}\n          </clr-dg-pagination>\n        </ng-container>\n      } @else {\n        @if (!showCustomPagination) {\n          <span class=\"pagination\">\n            {{ getFooterMessage(totalItems, undefined, dataRange.skip + 1, dataRange.skip + dataRange.data.length) }}\n          </span>\n        }\n        @if (showCustomPagination) {\n          <div>\n            <ng-container *ngTemplateOutlet=\"customPagination\"></ng-container>\n          </div>\n        }\n        <ng-template #customPagination>\n          <ng-content></ng-content>\n        </ng-template>\n      }\n    </clr-dg-footer>\n  }\n</clr-datagrid>\n\n<ng-template #draggableCell let-item>\n  <div cdkDropList [cdkDropListAutoScrollStep]=\"0\" [cdkDropListConnectedTo]=\"dropGroup(dragConfig.dragGroup || '')\">\n    <div\n      cdkDrag\n      cdkDragPreviewContainer=\"parent\"\n      [cdkDragData]=\"draggedItems\"\n      (cdkDragStarted)=\"onDragStart(item)\"\n      (cdkDragMoved)=\"onDragMove()\"\n    >\n      <cds-icon shape=\"drag-handle\" size=\"22\" cdkDragHandle> </cds-icon>\n      <div class=\"custom-placeholder\" *cdkDragPlaceholder></div>\n      <div class=\"custom-preview\" *cdkDragPreview>\n        @if (draggedItems.length === 1) {\n          <div class=\"grid-ghost text-truncate single-ghost\" [ngClass]=\"{ 'selection-ghost': isItemSelected(item) }\">\n            <ng-container *ngTemplateOutlet=\"draggableGhostContent; context: { $implicit: item }\"> </ng-container>\n          </div>\n        } @else {\n          <div class=\"grid-ghost text-truncate multiple-ghost selection-ghost\">\n            <ng-container *ngTemplateOutlet=\"draggableGhostContent; context: { $implicit: item }\"> </ng-container>\n          </div>\n          <span class=\"badge badge-purple ghost-badge\">\n            {{ draggedItems.length }}\n          </span>\n        }\n      </div>\n    </div>\n  </div>\n</ng-template>\n\n<ng-template #draggableGhostContent let-item>\n  <i class=\"{{ item.primaryIconId }}\"></i>\n  <span>{{ item[dragConfig.fieldName] }}</span>\n</ng-template>\n", styles: ["clr-datagrid .draggableCell{min-width:20px;width:20px;padding-left:0!important;order:-1;flex:0}:host{min-height:3.6rem}:host ::ng-deep clr-datagrid{min-height:0}:host(.zoom2x) ::ng-deep clr-datagrid.flex-clr-datagrid,:host(.zoom4x) ::ng-deep clr-datagrid.flex-clr-datagrid{height:auto!important;flex:1 0 auto!important}:host(.zoom4x){min-height:7.2rem}clr-datagrid.flex-clr-datagrid{flex-basis:auto;height:100%}clr-datagrid .custom-preview{width:200px;overflow:hidden}clr-datagrid clr-dg-cell.fixed-cell-height{height:16px}clr-datagrid .grid-ghost{border:1px solid var(--clr-table-border-color);border-left:2px solid var(--cds-alias-object-interaction-background-highlight);border-radius:3px 0 0 3px;background-color:var(--cds-global-color-white);padding:5px;width:90%;max-height:60px;color:var(--cds-global-color-gray-400);white-space:normal}clr-datagrid .single-ghost{box-shadow:0 3px 4px #7474744d}clr-datagrid .multiple-ghost{box-shadow:8px 7px var(--clr-table-bgcolor),8px 7px var(--clr-table-border-color),8px 8px 4px #7474744d}clr-datagrid .selection-ghost{color:var(--cds-global-color-gray-400);background-color:var(--clr-table-bgcolor)}clr-datagrid .ghost-badge{float:right}clr-datagrid.disabled-grid{pointer-events:none;cursor:not-allowed;opacity:.5}clr-datagrid .draggableCell .draggableIcon{transform:unset}clr-datagrid clr-dg-footer ::ng-deep .export-link{margin-left:10px;display:flex;align-items:center}clr-datagrid clr-dg-footer ::ng-deep .export-link:not(:disabled):hover,clr-datagrid clr-dg-footer ::ng-deep .export-link:not(:disabled):active{cursor:pointer;text-decoration:none}clr-datagrid clr-dg-footer ::ng-deep .datagrid-footer-description{display:flex;text-align:left}clr-datagrid clr-dg-footer ::ng-deep li{white-space:normal}clr-datagrid clr-dg-footer clr-dg-pagination{display:inline-flex;align-items:center}clr-datagrid clr-dg-footer clr-dg-pagination ::ng-deep>ul{height:auto}clr-datagrid clr-dg-column ::ng-deep .datagrid-column-flex{width:100%}clr-datagrid clr-dg-column.grabbed:not(.cdk-drag-placeholder,.cdk-drag-preview)::ng-deep .datagrid-column-title{background-color:var(--clr-datagrid-row-selected-background-color);color:var(--clr-datagrid-row-selected)}clr-datagrid clr-dg-column.grabbed:not(.cdk-drag-placeholder,.cdk-drag-preview){background-color:var(--clr-datagrid-row-selected-background-color);color:var(--clr-datagrid-row-selected)}clr-datagrid clr-dg-column.cdk-drag-placeholder{outline:var(--cds-alias-object-interaction-outline);outline-color:-webkit-focus-ring-color;outline-offset:var(--clr-datagrid-cell-outline-offset);z-index:100}clr-datagrid clr-dg-column.cdk-drag-preview{opacity:.75}clr-datagrid clr-dg-action-bar .appfx-datagrid-actions-container{display:flex;justify-content:space-between}clr-datagrid clr-dg-action-bar .appfx-datagrid-actions-container .filter-input{display:flex;flex-direction:row;align-items:center}clr-datagrid clr-dg-action-bar .appfx-datagrid-actions-container .filter-input cds-icon{cursor:pointer}clr-datagrid clr-dg-action-bar .appfx-datagrid-actions-container .action-bar{flex:1 0 auto;width:.05rem}clr-datagrid clr-dg-row-detail appfx-dg-cell-container{width:100%}clr-datagrid clr-dg-row-detail::ng-deep appfx-datagrid div.datagrid-header{z-index:500}clr-datagrid.zoom4x{min-height:7.2rem}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container{flex-direction:column}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .action-bar{flex:1 0 auto;width:100%;max-width:100%;min-width:1px}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .action-bar ::ng-deep .btn-group button:first-child{padding-left:10px}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input{padding-left:10px;width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input cds-icon{flex:0 1 auto}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input clr-input-container{flex:1 0 auto}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input clr-input-container ::ng-deep .clr-control-container{width:100%}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input clr-input-container ::ng-deep .clr-control-container input{width:100%}clr-datagrid.zoom4x ::ng-deep .column-switch-wrapper clr-dropdown-menu{position:fixed!important;transform:none!important;width:100%;min-width:100%;height:100%}clr-datagrid .custom-placeholder{height:0;width:0}clr-datagrid cds-icon[shape=drag-handle]{cursor:grab}:host-context([data-theme=dark]) clr-datagrid .custom-preview .grid-ghost{background-color:var(--clr-table-bgcolor)}\n"], dependencies: [{ kind: "directive", type: i4.ZoomLevelIndicatorDirective, selector: "[zoomLevelIndicator]" }, { kind: "component", type: i5$2.DataGridFiltersComponent, selector: "appfx-datagrid-filters", inputs: ["filterableProperties", "filterMode"], outputs: ["searchTermChange", "propertyFiltersChange"] }, { kind: "directive", type: i6.CdkDropList, selector: "[cdkDropList], cdk-drop-list", inputs: ["cdkDropListConnectedTo", "cdkDropListData", "cdkDropListOrientation", "id", "cdkDropListLockAxis", "cdkDropListDisabled", "cdkDropListSortingDisabled", "cdkDropListEnterPredicate", "cdkDropListSortPredicate", "cdkDropListAutoScrollDisabled", "cdkDropListAutoScrollStep", "cdkDropListElementContainer", "cdkDropListHasAnchor"], outputs: ["cdkDropListDropped", "cdkDropListEntered", "cdkDropListExited", "cdkDropListSorted"], exportAs: ["cdkDropList"] }, { kind: "directive", type: i6.CdkDrag, selector: "[cdkDrag]", inputs: ["cdkDragData", "cdkDragLockAxis", "cdkDragRootElement", "cdkDragBoundary", "cdkDragStartDelay", "cdkDragFreeDragPosition", "cdkDragDisabled", "cdkDragConstrainPosition", "cdkDragPreviewClass", "cdkDragPreviewContainer", "cdkDragScale"], outputs: ["cdkDragStarted", "cdkDragReleased", "cdkDragEnded", "cdkDragEntered", "cdkDragExited", "cdkDragDropped", "cdkDragMoved"], exportAs: ["cdkDrag"] }, { kind: "directive", type: i6.CdkDragHandle, selector: "[cdkDragHandle]", inputs: ["cdkDragHandleDisabled"] }, { kind: "directive", type: i6.CdkDragPreview, selector: "ng-template[cdkDragPreview]", inputs: ["data", "matchSize"] }, { kind: "directive", type: i6.CdkDragPlaceholder, selector: "ng-template[cdkDragPlaceholder]", inputs: ["data"] }, { kind: "directive", type: i4$1.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "component", type: i2.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "component", type: i9.ClrDatagrid, selector: "clr-datagrid", inputs: ["clrLoadingMoreItems", "clrDgSingleSelectionAriaLabel", "clrDgSingleActionableAriaLabel", "clrDetailExpandableAriaLabel", "clrDgDisablePageFocus", "clrDgCustomSelectAllEnabled", "clrDgLoading", "clrDgSelectionType", "clrDgSelected", "clrDgPreserveSelection", "clrDgRowSelection", "clrDgItemsIdentityFn"], outputs: ["clrDgSelectedChange", "clrDgRefresh", "clrDgCustomSelectAll"] }, { kind: "component", type: i9.ClrDatagridActionBar, selector: "clr-dg-action-bar" }, { kind: "component", type: i9.ClrDatagridActionOverflow, selector: "clr-dg-action-overflow", inputs: ["clrDgActionOverflowButtonLabel", "clrDgActionOverflowOpen"], outputs: ["clrDgActionOverflowOpenChange"] }, { kind: "component", type: i9.ClrDatagridCell, selector: "clr-dg-cell" }, { kind: "component", type: i9.ClrDatagridColumn, selector: "clr-dg-column", inputs: ["clrFilterStringPlaceholder", "clrFilterNumberMaxPlaceholder", "clrFilterNumberMinPlaceholder", "clrDgDisableUnsort", "clrDgColType", "clrDgField", "clrDgSortBy", "clrDgSortOrder", "clrFilterValue"], outputs: ["clrDgSortOrderChange", "clrFilterValueChange"] }, { kind: "component", type: i9.ClrDatagridDetail, selector: "clr-dg-detail", inputs: ["clrDetailAriaLabelledBy", "clrDetailAriaLabel"] }, { kind: "component", type: i9.ClrDatagridDetailBody, selector: "clr-dg-detail-body" }, { kind: "component", type: i9.ClrDatagridDetailHeader, selector: "clr-dg-detail-header" }, { kind: "component", type: i9.ClrDatagridFilter, selector: "clr-dg-filter", inputs: ["clrDgFilterOpen", "clrDgFilter"], outputs: ["clrDgFilterOpenChange"] }, { kind: "component", type: i9.ClrDatagridFooter, selector: "clr-dg-footer" }, { kind: "directive", type: i9.ClrDatagridItems, selector: "[clrDgItems][clrDgItemsOf]", inputs: ["clrDgItemsOf", "clrDgItemsTrackBy"] }, { kind: "component", type: i9.ClrDatagridPageSize, selector: "clr-dg-page-size", inputs: ["clrPageSizeOptions", "clrPageSizeOptionsId"] }, { kind: "component", type: i9.ClrDatagridPagination, selector: "clr-dg-pagination", inputs: ["clrDgPageInputDisabled", "clrDgPageSize", "clrDgTotalItems", "clrDgLastPage", "clrDgPage"], outputs: ["clrDgPageChange"] }, { kind: "component", type: i9.ClrDatagridPlaceholder, selector: "clr-dg-placeholder" }, { kind: "component", type: i9.ClrDatagridRow, selector: "clr-dg-row", inputs: ["clrDgDetailDisabled", "clrDgDetailHidden", "clrDgSkeletonLoading", "clrDgItem", "clrDgSelectable", "clrDgSelected", "clrDgExpanded", "clrDgDetailOpenLabel", "clrDgDetailCloseLabel", "clrDgRowSelectionLabel"], outputs: ["clrDgSelectedChange", "clrDgExpandedChange"] }, { kind: "component", type: i9.ClrDatagridRowDetail, selector: "clr-dg-row-detail", inputs: ["clrRowDetailBeginningAriaText", "clrRowDetailEndAriaText", "clrDgReplace"] }, { kind: "directive", type: i9.ÇlrDatagridVirtualScrollDirective, selector: "[clrVirtualScroll],[ClrVirtualScroll]", inputs: ["clrVirtualPersistItems", "clrVirtualRowsOf", "clrVirtualRowsTrackBy", "clrVirtualRowsTemplate", "clrVirtualRowsTemplateCacheSize", "clrVirtualRowsItemSize", "clrVirtualRowsMinBufferPx", "clrVirtualRowsMaxBufferPx", "clrVirtualDataRange"], outputs: ["renderedRangeChange"] }, { kind: "directive", type: i9.ClrIfDetail, selector: "[clrIfDetail]", inputs: ["clrIfDetail"], outputs: ["clrIfDetailChange"] }, { kind: "directive", type: i9.ÇlrDatagridDetailRegisterer, selector: "[clrIfExpanded]" }, { kind: "directive", type: i9.ÇlrDatagridCellRenderer, selector: "clr-dg-cell" }, { kind: "directive", type: i9.ÇlrDatagridHeaderRenderer, selector: "clr-dg-column", outputs: ["clrDgColumnResize"] }, { kind: "directive", type: i9.ÇlrDatagridMainRenderer, selector: "clr-datagrid" }, { kind: "directive", type: i9.ÇlrDatagridRowDetailRenderer, selector: "clr-dg-row-detail" }, { kind: "directive", type: i9.ÇlrDatagridRowRenderer, selector: "clr-dg-row" }, { kind: "directive", type: i9.ÇlrActionableOompaLoompa, selector: "clr-datagrid, clr-dg-row" }, { kind: "directive", type: i9.ÇlrDatagridWillyWonka, selector: "clr-datagrid" }, { kind: "directive", type: i9.ÇlrExpandableOompaLoompa, selector: "clr-datagrid, clr-dg-row" }, { kind: "directive", type: i10.ClrIfExpanded, selector: "[clrIfExpanded]", inputs: ["clrIfExpanded"], outputs: ["clrIfExpandedChange"] }, { kind: "directive", type: i5.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i5.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: ColumnOrderDirective, selector: "clr-dg-column[appfxColumnOrder]", inputs: ["columnData", "columnIndex"] }, { kind: "directive", type: DatagridColumnsOrderDirective, selector: "clr-datagrid[appfxDgColumnsOrder]", inputs: ["dgColumnsOrderColumns", "dgColumnsVirtualScrolling"], outputs: ["dgColumnsOrderChange"] }, { kind: "component", type: DatagridActionBarComponent, selector: "appfx-datagrid-action-bar", inputs: ["actions", "btnLayout", "dropdownOrientation"], outputs: ["invokeAction"] }, { kind: "component", type: DatagridFilterComponent, selector: "appfx-datagrid-filter", inputs: ["filterValue", "stringFilterType", "fieldName"], outputs: ["filterValueChange"] }, { kind: "component", type: DatagridCellContainerComponent, selector: "appfx-dg-cell-container", inputs: ["column", "item"] }, { kind: "component", type: DatagridColumnToggleComponent, selector: "appfx-dg-column-toggle", inputs: ["columns"], outputs: ["columnsChange", "columnHiddenStateChange"] }, { kind: "component", type: DatagridFilterContainerComponent, selector: "appfx-dg-filter-container", inputs: ["filterType", "filterValue"], outputs: ["filterValueChange"] }, { kind: "component", type: ExportDatagridComponent, selector: "appfx-dg-export", inputs: ["allItemsCount", "filteredItemsCount", "selectedItemsCount"], outputs: ["exportEventEmitter"] }, { kind: "pipe", type: IsRowSelectablePipe, name: "isRowSelectable" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-datagrid', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        ExportProviderService,
                        uniqueIdProvider,
                        {
                            provide: appfxPreselectableComponentToken,
                            useExisting: forwardRef(() => DatagridComponent),
                        },
                    ], template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-datagrid\n  zoomLevelIndicator\n  [clrDgDisablePageFocus]=\"true\"\n  [clrDgPreserveSelection]=\"preserveExistingSelectionOnFilter\"\n  [clrDgSelectionType]=\"selectionType\"\n  [clrDgSelected]=\"selectedItems\"\n  [clrDgItemsIdentityFn]=\"trackByGridItemFn\"\n  (clrDgRefresh)=\"refreshGrid($event)\"\n  [clrDgLoading]=\"loading\"\n  [clrDgRowSelection]=\"rowSelectionMode\"\n  [ngClass]=\"{\n    'disabled-grid': gridLayoutModel.disabled,\n    'datagrid-compact': gridLayoutModel.compact,\n    'flex-clr-datagrid': gridLayoutModel.stretchToParentHeight,\n    'datagrid-overflow-ellipsis': virtualScrolling || !wrapText,\n  }\"\n  cdkDropList\n  [cdkDropListAutoScrollStep]=\"5\"\n  appfxDgColumnsOrder\n  [clrDgCustomSelectAllEnabled]=\"virtualScrolling\"\n  (clrDgCustomSelectAll)=\"onSelectAllInVirtualGrid($event)\"\n  [dgColumnsOrderColumns]=\"columns\"\n  [dgColumnsVirtualScrolling]=\"virtualScrolling\"\n  (dgColumnsOrderChange)=\"onColumnOrderChange($event)\"\n  (clrDgSelectedChange)=\"onSelectedItemsChange($event)\"\n>\n  @if (enableToolBar) {\n    <clr-dg-action-bar>\n      @if (!!actionBarActions.length) {\n        <div class=\"appfx-datagrid-actions-container\">\n          <appfx-datagrid-action-bar\n            class=\"action-bar\"\n            (invokeAction)=\"onActionClick($event)\"\n            [actions]=\"actionBarActions\"\n          >\n          </appfx-datagrid-action-bar>\n        </div>\n      }\n      @if (filterMode !== undefined && filterMode !== null) {\n        <appfx-datagrid-filters\n          [filterMode]=\"filterMode\"\n          [filterableProperties]=\"filterableProperties\"\n          (searchTermChange)=\"onAdvancedSearchTermChange($event)\"\n          (propertyFiltersChange)=\"onAdvancedFilterCriteriaChange($event)\"\n        >\n        </appfx-datagrid-filters>\n      }\n    </clr-dg-action-bar>\n  }\n  @if (dragConfig) {\n    <clr-dg-column class=\"draggableCell\" style=\"width: 20px\"></clr-dg-column>\n  }\n  @for (column of visibleColumns; track trackByColumnId(index, column); let index = $index) {\n    <clr-dg-column\n      cdkDrag\n      [cdkDragLockAxis]=\"'x'\"\n      [cdkDragData]=\"column\"\n      appfxColumnOrder\n      [columnData]=\"column\"\n      [columnIndex]=\"index\"\n      [style]=\"column.width ? { width: column.width } : null\"\n      (clrDgColumnResize)=\"onColumnResize($event, column)\"\n      [clrDgField]=\"column.sortAndFilterByField || defaultUnsetValue\"\n      [clrDgSortBy]=\"column.sortComparator || defaultUnsetValue\"\n      [clrDgSortOrder]=\"column.defaultSortOrder || defaultUnsortedOrder\"\n      (clrDgSortOrderChange)=\"onSortOrderChange($event, column)\"\n    >\n      @if (column.stringFilter || column.sortAndFilterByField) {\n        <clr-dg-filter [clrDgFilter]=\"appfxDatagridStringFilter\">\n          <appfx-datagrid-filter\n            #appfxDatagridStringFilter\n            [stringFilterType]=\"column.stringFilter\"\n            [filterValue]=\"column.defaultFilterValue\"\n            [fieldName]=\"column.sortAndFilterByField\"\n            (filterValueChange)=\"onFilterChange($event, column)\"\n          ></appfx-datagrid-filter>\n        </clr-dg-filter>\n      }\n      @if (column.filter) {\n        <clr-dg-filter>\n          <appfx-dg-filter-container\n            [filterType]=\"column.filter\"\n            [filterValue]=\"column.defaultFilterValue\"\n            (filterValueChange)=\"onFilterChange($event, column)\"\n          ></appfx-dg-filter-container>\n        </clr-dg-filter>\n      }\n      {{ column.displayName }}\n    </clr-dg-column>\n  }\n  <clr-dg-placeholder>\n    {{ dgStrings.noItemsFound }}\n    <ng-content select=\".custom-placeholder-content\"></ng-content>\n  </clr-dg-placeholder>\n\n  <!-- Server driven datagrid with virtual scrolling -->\n  @if (serverDrivenDatagrid && virtualScrolling) {\n    <ng-template\n      ClrVirtualScroll\n      let-item\n      let-i=\"index\"\n      [clrVirtualDataRange]=\"dataRange\"\n      [clrVirtualRowsItemSize]=\"25\"\n      [clrVirtualRowsMinBufferPx]=\"400\"\n      [clrVirtualRowsMaxBufferPx]=\"800\"\n      [clrVirtualRowsTemplateCacheSize]=\"400\"\n      [clrVirtualPersistItems]=\"false\"\n      [clrVirtualRowsTrackBy]=\"trackByFunction\"\n      (renderedRangeChange)=\"renderedRangeChange($event)\"\n    >\n      <clr-dg-row\n        [clrDgItem]=\"item\"\n        [clrDgSelectable]=\"item | isRowSelectable: isRowLocked : rowsDisabled\"\n        [clrDgRowSelectionLabel]=\"$any(item)?.[visibleColumns && visibleColumns.length ? visibleColumns[0].field : -1]\"\n        (contextmenu)=\"onContextMenu($event, item)\"\n        [clrDgSkeletonLoading]=\"!item\"\n      >\n        @if (dragConfig) {\n          <clr-dg-cell class=\"draggableCell\" style=\"width: 20px\">\n            <ng-container *ngTemplateOutlet=\"draggableCell; context: { $implicit: item }\"> </ng-container>\n          </clr-dg-cell>\n        }\n        @for (column of visibleColumns; track column) {\n          <clr-dg-cell class=\"fixed-cell-height\">\n            <appfx-dg-cell-container [column]=\"column\" [item]=\"item\"></appfx-dg-cell-container>\n          </clr-dg-cell>\n        }\n      </clr-dg-row>\n    </ng-template>\n  }\n\n  <!--  Server driven datagrid with paging -->\n  @if (serverDrivenDatagrid && !virtualScrolling) {\n    @for (item of gridItems; track trackByFn.bind(this)(i, item); let i = $index) {\n      <clr-dg-row\n        [clrDgItem]=\"item\"\n        [clrDgDetailOpenLabel]=\"getExpandDetailsLabel(item)\"\n        [clrDgDetailCloseLabel]=\"getCollapseDetailsLabel(item)\"\n        [clrDgSelectable]=\"item | isRowSelectable: isRowLocked : rowsDisabled\"\n        [clrDgRowSelectionLabel]=\"$any(item)?.[visibleColumns && visibleColumns.length ? visibleColumns[0].field : -1]\"\n        (contextmenu)=\"onContextMenu($event, item)\"\n      >\n        @if (enableSingleRowActions) {\n          <clr-dg-action-overflow\n            (clrDgActionOverflowOpenChange)=\"onRowActionOverflowOpen($event, singleRowActions, item)\"\n          >\n            @for (action of singleRowActions; track action) {\n              <button\n                class=\"action-item\"\n                (click)=\"onActionClick(action, item)\"\n                [title]=\"action.tooltip\"\n                [disabled]=\"!action.enabled\"\n              >\n                {{ action.label }}\n              </button>\n            }\n          </clr-dg-action-overflow>\n        }\n        @if (dragConfig) {\n          <clr-dg-cell class=\"draggableCell\" style=\"width: 20px\">\n            <ng-container *ngTemplateOutlet=\"draggableCell; context: { $implicit: item }\"> </ng-container>\n          </clr-dg-cell>\n        }\n        @for (column of visibleColumns; track column) {\n          <clr-dg-cell>\n            <appfx-dg-cell-container [column]=\"column\" [item]=\"item\"></appfx-dg-cell-container>\n          </clr-dg-cell>\n        }\n        @if (rowDetailContent) {\n          <ng-container ngProjectAs=\"clr-dg-row-detail\">\n            @if ({ id: buildRowDetailContentId(i) }; as detailData) {\n              <clr-dg-row-detail\n                *clrIfExpanded=\"rowsExpandedByDefault\"\n                tabindex=\"0\"\n                [attr.aria-describedby]=\"detailData.id\"\n              >\n                <div [id]=\"detailData.id\" class=\"datagrid-row-flex\">\n                  <ng-container *ngTemplateOutlet=\"rowDetailContent; context: { item: item }\"> </ng-container>\n                </div>\n              </clr-dg-row-detail>\n            }\n          </ng-container>\n        }\n      </clr-dg-row>\n    }\n  }\n\n  <!-- Client side datagrid with paging -->\n  @if (!serverDrivenDatagrid) {\n    <clr-dg-row\n      *clrDgItems=\"let item of gridItems; trackBy: trackByFn.bind(this); index as i\"\n      [clrDgItem]=\"item\"\n      [clrDgDetailOpenLabel]=\"getExpandDetailsLabel(item)\"\n      [clrDgDetailCloseLabel]=\"getCollapseDetailsLabel(item)\"\n      [clrDgSelectable]=\"item | isRowSelectable: isRowLocked : rowsDisabled\"\n      [clrDgRowSelectionLabel]=\"$any(item)?.[visibleColumns && visibleColumns.length ? visibleColumns[0].field : -1]\"\n      (contextmenu)=\"onContextMenu($event, item)\"\n    >\n      @if (enableSingleRowActions) {\n        <clr-dg-action-overflow\n          (clrDgActionOverflowOpenChange)=\"onRowActionOverflowOpen($event, singleRowActions, item)\"\n        >\n          @for (action of singleRowActions; track action) {\n            <button\n              class=\"action-item\"\n              (click)=\"onActionClick(action, item)\"\n              [title]=\"action.tooltip\"\n              [disabled]=\"!action.enabled\"\n            >\n              {{ action.label }}\n            </button>\n          }\n        </clr-dg-action-overflow>\n      }\n      @if (dragConfig) {\n        <clr-dg-cell class=\"draggableCell\">\n          <ng-container *ngTemplateOutlet=\"draggableCell; context: { $implicit: item }\"> </ng-container>\n        </clr-dg-cell>\n      }\n      @for (column of visibleColumns; track column) {\n        <clr-dg-cell>\n          <appfx-dg-cell-container [column]=\"column\" [item]=\"item\"></appfx-dg-cell-container>\n        </clr-dg-cell>\n      }\n      @if ($any(item).rowDetailRenderer) {\n        <ng-container ngProjectAs=\"clr-dg-row-detail\">\n          @if ({ id: buildRowDetailContentId(i) }; as detailData) {\n            <clr-dg-row-detail *clrIfExpanded tabindex=\"0\" [attr.aria-describedby]=\"detailData.id\">\n              <appfx-dg-cell-container\n                [id]=\"detailData.id\"\n                [column]=\"{\n                  displayName: '',\n                  field: '',\n                  columnRenderer: $any(item).rowDetailRenderer,\n                }\"\n                [item]=\"item\"\n              ></appfx-dg-cell-container>\n            </clr-dg-row-detail>\n          }\n        </ng-container>\n      }\n      @if (rowDetailContent) {\n        <ng-container ngProjectAs=\"clr-dg-row-detail\">\n          @if ({ id: buildRowDetailContentId(i) }; as detailData) {\n            <clr-dg-row-detail\n              *clrIfExpanded=\"rowsExpandedByDefault\"\n              tabindex=\"0\"\n              [attr.aria-describedby]=\"detailData.id\"\n            >\n              <div [id]=\"detailData.id\" class=\"datagrid-row-flex\">\n                <ng-container *ngTemplateOutlet=\"rowDetailContent; context: { item: item }\"> </ng-container>\n              </div>\n            </clr-dg-row-detail>\n          }\n        </ng-container>\n      }\n    </clr-dg-row>\n  }\n  @if (detailHeader || detailBody) {\n    <ng-container ngProjectAs=\"clr-dg-detail\">\n      <ng-template [clrIfDetail]=\"detailState\" (clrIfDetailChange)=\"onDetailStateChange($event)\" let-detail>\n        <clr-dg-detail>\n          @if (detailHeader) {\n            <clr-dg-detail-header>\n              <ng-container *ngTemplateOutlet=\"detailHeader; context: { $implicit: detail }\"></ng-container>\n            </clr-dg-detail-header>\n          }\n          @if (detailBody) {\n            <clr-dg-detail-body>\n              <ng-container *ngTemplateOutlet=\"detailBody; context: { $implicit: detail }\"></ng-container>\n            </clr-dg-detail-body>\n          }\n        </clr-dg-detail>\n      </ng-template>\n    </ng-container>\n  }\n  @if (gridFooterModel.showFooter) {\n    <clr-dg-footer>\n      @if (!gridFooterModel.hideColumnToggle) {\n        <appfx-dg-column-toggle [(columns)]=\"columns\" (columnHiddenStateChange)=\"onColumnHiddenStateChange($event)\">\n        </appfx-dg-column-toggle>\n      }\n      @if (enableExportButton) {\n        <appfx-dg-export\n          [allItemsCount]=\"gridFooterModel.clientSideExportConfig?.allItemsCount || listItemsCount\"\n          [selectedItemsCount]=\"selectedItemsCount\"\n          [filteredItemsCount]=\"filteredItemsCount\"\n          (exportEventEmitter)=\"onExportEvent($event)\"\n          class=\"export-link\"\n        >\n        </appfx-dg-export>\n      }\n      @if (showDeselectAll) {\n        <div class=\"column-switch-wrapper export-link\">\n          <button\n            class=\"btn btn-sm column-toggle-action\"\n            [disabled]=\"deselectAllDisabled\"\n            (click)=\"onDeselectAllClick()\"\n          >\n            {{ dgStrings.deselectAll }}\n          </button>\n        </div>\n      }\n      <ng-content select=\".custom-footer-content\"></ng-content>\n      @if (pageSize > 0) {\n        <ng-container ngProjectAs=\"clr-dg-pagination\">\n          <clr-dg-pagination #pagination [clrDgPageSize]=\"pageSize\" [clrDgTotalItems]=\"totalItems\">\n            @if (pageSizeOptions?.length) {\n              <clr-dg-page-size #clrDgPageSize [clrPageSizeOptions]=\"pageSizeOptions\">\n                <label [for]=\"clrDgPageSize.pageSizeOptionsId\"> {{ dgStrings.itemsPerPage }} </label>\n              </clr-dg-page-size>\n            }\n            {{\n              getFooterMessage(\n                pagination.totalItems,\n                pagination.pageSize,\n                pagination.firstItem + 1,\n                pagination.lastItem + 1\n              )\n            }}\n          </clr-dg-pagination>\n        </ng-container>\n      } @else {\n        @if (!showCustomPagination) {\n          <span class=\"pagination\">\n            {{ getFooterMessage(totalItems, undefined, dataRange.skip + 1, dataRange.skip + dataRange.data.length) }}\n          </span>\n        }\n        @if (showCustomPagination) {\n          <div>\n            <ng-container *ngTemplateOutlet=\"customPagination\"></ng-container>\n          </div>\n        }\n        <ng-template #customPagination>\n          <ng-content></ng-content>\n        </ng-template>\n      }\n    </clr-dg-footer>\n  }\n</clr-datagrid>\n\n<ng-template #draggableCell let-item>\n  <div cdkDropList [cdkDropListAutoScrollStep]=\"0\" [cdkDropListConnectedTo]=\"dropGroup(dragConfig.dragGroup || '')\">\n    <div\n      cdkDrag\n      cdkDragPreviewContainer=\"parent\"\n      [cdkDragData]=\"draggedItems\"\n      (cdkDragStarted)=\"onDragStart(item)\"\n      (cdkDragMoved)=\"onDragMove()\"\n    >\n      <cds-icon shape=\"drag-handle\" size=\"22\" cdkDragHandle> </cds-icon>\n      <div class=\"custom-placeholder\" *cdkDragPlaceholder></div>\n      <div class=\"custom-preview\" *cdkDragPreview>\n        @if (draggedItems.length === 1) {\n          <div class=\"grid-ghost text-truncate single-ghost\" [ngClass]=\"{ 'selection-ghost': isItemSelected(item) }\">\n            <ng-container *ngTemplateOutlet=\"draggableGhostContent; context: { $implicit: item }\"> </ng-container>\n          </div>\n        } @else {\n          <div class=\"grid-ghost text-truncate multiple-ghost selection-ghost\">\n            <ng-container *ngTemplateOutlet=\"draggableGhostContent; context: { $implicit: item }\"> </ng-container>\n          </div>\n          <span class=\"badge badge-purple ghost-badge\">\n            {{ draggedItems.length }}\n          </span>\n        }\n      </div>\n    </div>\n  </div>\n</ng-template>\n\n<ng-template #draggableGhostContent let-item>\n  <i class=\"{{ item.primaryIconId }}\"></i>\n  <span>{{ item[dragConfig.fieldName] }}</span>\n</ng-template>\n", styles: ["clr-datagrid .draggableCell{min-width:20px;width:20px;padding-left:0!important;order:-1;flex:0}:host{min-height:3.6rem}:host ::ng-deep clr-datagrid{min-height:0}:host(.zoom2x) ::ng-deep clr-datagrid.flex-clr-datagrid,:host(.zoom4x) ::ng-deep clr-datagrid.flex-clr-datagrid{height:auto!important;flex:1 0 auto!important}:host(.zoom4x){min-height:7.2rem}clr-datagrid.flex-clr-datagrid{flex-basis:auto;height:100%}clr-datagrid .custom-preview{width:200px;overflow:hidden}clr-datagrid clr-dg-cell.fixed-cell-height{height:16px}clr-datagrid .grid-ghost{border:1px solid var(--clr-table-border-color);border-left:2px solid var(--cds-alias-object-interaction-background-highlight);border-radius:3px 0 0 3px;background-color:var(--cds-global-color-white);padding:5px;width:90%;max-height:60px;color:var(--cds-global-color-gray-400);white-space:normal}clr-datagrid .single-ghost{box-shadow:0 3px 4px #7474744d}clr-datagrid .multiple-ghost{box-shadow:8px 7px var(--clr-table-bgcolor),8px 7px var(--clr-table-border-color),8px 8px 4px #7474744d}clr-datagrid .selection-ghost{color:var(--cds-global-color-gray-400);background-color:var(--clr-table-bgcolor)}clr-datagrid .ghost-badge{float:right}clr-datagrid.disabled-grid{pointer-events:none;cursor:not-allowed;opacity:.5}clr-datagrid .draggableCell .draggableIcon{transform:unset}clr-datagrid clr-dg-footer ::ng-deep .export-link{margin-left:10px;display:flex;align-items:center}clr-datagrid clr-dg-footer ::ng-deep .export-link:not(:disabled):hover,clr-datagrid clr-dg-footer ::ng-deep .export-link:not(:disabled):active{cursor:pointer;text-decoration:none}clr-datagrid clr-dg-footer ::ng-deep .datagrid-footer-description{display:flex;text-align:left}clr-datagrid clr-dg-footer ::ng-deep li{white-space:normal}clr-datagrid clr-dg-footer clr-dg-pagination{display:inline-flex;align-items:center}clr-datagrid clr-dg-footer clr-dg-pagination ::ng-deep>ul{height:auto}clr-datagrid clr-dg-column ::ng-deep .datagrid-column-flex{width:100%}clr-datagrid clr-dg-column.grabbed:not(.cdk-drag-placeholder,.cdk-drag-preview)::ng-deep .datagrid-column-title{background-color:var(--clr-datagrid-row-selected-background-color);color:var(--clr-datagrid-row-selected)}clr-datagrid clr-dg-column.grabbed:not(.cdk-drag-placeholder,.cdk-drag-preview){background-color:var(--clr-datagrid-row-selected-background-color);color:var(--clr-datagrid-row-selected)}clr-datagrid clr-dg-column.cdk-drag-placeholder{outline:var(--cds-alias-object-interaction-outline);outline-color:-webkit-focus-ring-color;outline-offset:var(--clr-datagrid-cell-outline-offset);z-index:100}clr-datagrid clr-dg-column.cdk-drag-preview{opacity:.75}clr-datagrid clr-dg-action-bar .appfx-datagrid-actions-container{display:flex;justify-content:space-between}clr-datagrid clr-dg-action-bar .appfx-datagrid-actions-container .filter-input{display:flex;flex-direction:row;align-items:center}clr-datagrid clr-dg-action-bar .appfx-datagrid-actions-container .filter-input cds-icon{cursor:pointer}clr-datagrid clr-dg-action-bar .appfx-datagrid-actions-container .action-bar{flex:1 0 auto;width:.05rem}clr-datagrid clr-dg-row-detail appfx-dg-cell-container{width:100%}clr-datagrid clr-dg-row-detail::ng-deep appfx-datagrid div.datagrid-header{z-index:500}clr-datagrid.zoom4x{min-height:7.2rem}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container{flex-direction:column}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .action-bar{flex:1 0 auto;width:100%;max-width:100%;min-width:1px}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .action-bar ::ng-deep .btn-group button:first-child{padding-left:10px}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input{padding-left:10px;width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input cds-icon{flex:0 1 auto}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input clr-input-container{flex:1 0 auto}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input clr-input-container ::ng-deep .clr-control-container{width:100%}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input clr-input-container ::ng-deep .clr-control-container input{width:100%}clr-datagrid.zoom4x ::ng-deep .column-switch-wrapper clr-dropdown-menu{position:fixed!important;transform:none!important;width:100%;min-width:100%;height:100%}clr-datagrid .custom-placeholder{height:0;width:0}clr-datagrid cds-icon[shape=drag-handle]{cursor:grab}:host-context([data-theme=dark]) clr-datagrid .custom-preview .grid-ghost{background-color:var(--clr-table-bgcolor)}\n"] }]
        }], ctorParameters: () => [{ type: DatagridStrings }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [uniqueIdToken]
                }] }, { type: i0.ChangeDetectorRef }, { type: ExportProviderService }, { type: i3$3.DragAndDropGroupService, decorators: [{
                    type: Optional
                }] }, { type: i4.ZoomLevelService, decorators: [{
                    type: Optional
                }] }], propDecorators: { clrDatagridPagination: [{
                type: ViewChild,
                args: [ClrDatagridPagination]
            }], loading: [{
                type: Input
            }], preSelectFirstItem: [{
                type: Input
            }], pageSizeOptions: [{
                type: Input
            }], totalItems: [{
                type: Input
            }], showCustomPagination: [{
                type: Input
            }], serverDrivenDatagrid: [{
                type: Input
            }], listItemsCount: [{
                type: Input
            }], rowDetailContent: [{
                type: Input
            }], rowsExpandedByDefault: [{
                type: Input
            }], trackByFunction: [{
                type: Input
            }], trackByGridItemProperty: [{
                type: Input
            }], detailHeader: [{
                type: Input
            }], detailBody: [{
                type: Input
            }], detailState: [{
                type: Input
            }], detailStateChange: [{
                type: Output
            }], isRowLocked: [{
                type: Input
            }], dragConfig: [{
                type: Input
            }], filterableProperties: [{
                type: Input
            }], filterMode: [{
                type: Input
            }], singleRowActions: [{
                type: Input
            }], preserveExistingSelectionOnFilter: [{
                type: Input
            }], virtualScrolling: [{
                type: Input
            }], dataRange: [{
                type: Input
            }], gridItems: [{
                type: Input
            }], pageSizeChange: [{
                type: Output
            }], gridItemsChange: [{
                type: Output
            }], advancedFilterChange: [{
                type: Output
            }], columnDefsChange: [{
                type: Output
            }], selectedItemsChange: [{
                type: Output
            }], exportDataEvent: [{
                type: Output
            }], searchTermChange: [{
                type: Output
            }], columnResize: [{
                type: Output
            }], columnSortOrderChange: [{
                type: Output
            }], columnHiddenStateChange: [{
                type: Output
            }], columnFilterChange: [{
                type: Output
            }], refreshGridData: [{
                type: Output
            }], refreshVirtualGridData: [{
                type: Output
            }], actionClick: [{
                type: Output
            }], rowActionMenuOpenChange: [{
                type: Output
            }], openContextMenu: [{
                type: Output
            }], columnOrderChange: [{
                type: Output
            }], applyFlexLayout: [{
                type: HostBinding,
                args: ['class.embedded-flex-component']
            }], zoomLevel: [{
                type: HostBinding,
                args: ['class']
            }], clrDatagrid: [{
                type: ViewChild,
                args: [ClrDatagrid, { static: true }]
            }], layoutModel: [{
                type: Input
            }], footerModel: [{
                type: Input
            }], columns: [{
                type: Input
            }], selectionType: [{
                type: Input
            }], selectedItems: [{
                type: Input
            }], rowSelectionMode: [{
                type: Input
            }], actionBarActions: [{
                type: Input
            }], pageSize: [{
                type: Input
            }], datagridLabels: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Datagrid page directive which set the page which to be shown when the appfx datagrid is display.
 * Supports  setting of arbitrary grid page as current page and emits the new page
 * number when the page is change.
 * Supports this functionality for server side and client side grids.
 */
class DatagridPageDirective {
    constructor(datagrid) {
        this.datagridPageChange = new EventEmitter(false);
        this.initCompleted = false;
        this.component = datagrid;
    }
    set datagridPage(value) {
        if (this.initCompleted) {
            this.component.clrDatagridPagination.currentPage = value;
        }
        else {
            this.initialPage = value;
        }
    }
    ngAfterViewInit() {
        this.subscription = this.component.clrDatagridPagination.currentChanged.subscribe((page) => this.datagridPageChange.emit(page));
        if (this.initialPage > 1) {
            if (this.component.serverDrivenDatagrid) {
                this.component.clrDatagridPagination.currentPage = this.initialPage;
            }
            else {
                // Client side grids work with clarity smart iterators, which initially create all rows, then
                // destroy them and again create them.
                // This I think make the clarity grid to throw ExpressionChangedAfterItHasBeenCheckedError
                // error when this small timout is not set.
                setTimeout(() => {
                    this.component.clrDatagridPagination.currentPage = this.initialPage;
                }, 0);
            }
        }
        this.initCompleted = true;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridPageDirective, deps: [{ token: DatagridComponent, host: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: DatagridPageDirective, isStandalone: false, selector: "[datagridPage]", inputs: { datagridPage: "datagridPage" }, outputs: { datagridPageChange: "datagridPageChange" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridPageDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[datagridPage]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: DatagridComponent, decorators: [{
                    type: Host
                }] }], propDecorators: { datagridPageChange: [{
                type: Output
            }], datagridPage: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// injectable service contract for app-specific code that can store and read data from local browser storage
const appfxDatagridPersistSettingsToken = new InjectionToken('service that store and read data from local browser storage');

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Sets the grid up with page size, column visibility and width from user-defined storage that is provided
 * Reacts to user changes in the Clarity datagrid to notify the injected storage to persist the grid properties
 * So reloading the application in automatically restore these preferences as a convenience
 */
class DatagridPersistSettingsDirective {
    constructor(grid, persistDatagridSettingsService) {
        this.grid = grid;
        this.persistDatagridSettingsService = persistDatagridSettingsService;
        this.subs = new Subscription();
        this.datagridKeyChange$ = new Subject();
        this.storePageSize = true;
        this.storeSortOrder = true;
        this.initialiseDatagridWithPersistedSettings();
    }
    /**
     * Directive takes unique identifier input to describe the grid
     */
    set appfxPersistDatagridSettings(key) {
        this.datagridKey = key;
        this.datagridKeyChange$.next(key);
    }
    /**
     * Flag indicates whether to be persisted the grid page size.
     */
    set persistPageSize(value) {
        this.storePageSize = value;
    }
    /**
     * Flag indicates whether to be persisted the grid page size.
     */
    set persistSortOrder(value) {
        this.storeSortOrder = value;
    }
    ngAfterViewInit() {
        if (!this.datagridKey) {
            return;
        }
        // Listen for column resize
        this.subs.add(this.grid.columnResize.subscribe((data) => {
            data.column.width = data.columnSize + 'px';
            this.saveColumnStates();
        }));
        // Listen for column order changes
        this.subs.add(this.grid.columnOrderChange.subscribe(() => {
            this.saveColumnStates();
        }));
        // Listen for column hidden state changes
        this.subs.add(this.grid.columnHiddenStateChange.subscribe((data) => {
            data.column.hidden = data.hidden;
            this.saveColumnStates();
        }));
        if (this.storeSortOrder) {
            // Listen for column sort order changes
            this.subs.add(this.grid.columnSortOrderChange.subscribe((data) => {
                this.saveColumnSortOrder(data);
            }));
        }
        if (this.storePageSize) {
            // Listen for datagrid refresh event which contains page size info
            this.subs.add(this.grid.refreshGridData.subscribe((clrDatagridState) => {
                const clrPageSize = clrDatagridState?.page?.size || 0;
                if (clrPageSize > 0 && clrPageSize !== this.grid.pageSize) {
                    this.grid.pageSize = clrPageSize;
                    this.savePageSize(clrPageSize);
                }
            }));
        }
    }
    ngOnDestroy() {
        this.subs.unsubscribe();
    }
    saveColumnStates() {
        if (this.saveColumnsStateTimerId) {
            clearTimeout(this.saveColumnsStateTimerId);
        }
        this.saveColumnsStateTimerId = setTimeout(() => {
            this.saveColumnsData();
        }, 100);
    }
    saveColumnsData() {
        const persistedData = this.getPersistedData();
        persistedData.columns = this.grid.columns.map((column) => this.createPersistedColumnState(column));
        //Update sort column if it is persisted as it may become hidden
        if (persistedData.sorting) {
            const columnDef = persistedData.columns.find(column => {
                return column.uid === persistedData.sorting?.column.uid;
            });
            if (columnDef) {
                persistedData.sorting.column = columnDef;
            }
        }
        this.setPersistedData(persistedData);
    }
    saveColumnSortOrder(columnSortOrder) {
        const persistedData = this.getPersistedData();
        const column = this.createPersistedColumnState(columnSortOrder.column);
        persistedData.sorting = {
            sortOrder: columnSortOrder?.sortOrder,
            column: column,
        };
        this.setPersistedData(persistedData);
    }
    savePageSize(pageSize) {
        const data = this.getPersistedData();
        data.pageSize = pageSize;
        this.setPersistedData(data);
    }
    createPersistedColumnState(column) {
        const width = column.width ? parseInt(column.width, 10) : undefined;
        return {
            headerText: column.displayName,
            visible: column.hidden !== true,
            width: width,
            uid: this.getColumnUid(column),
        };
    }
    /**
     * Preserve data in the persistence storage.
     * @param data the data that is going to be persisted.
     */
    setPersistedData(data) {
        if (!this.datagridKey) {
            return;
        }
        if (!this.persistDatagridSettingsService) {
            console.error('Persist datagrid service is not provided.');
            return;
        }
        //save into the userdata, using a key based on the listViewId
        this.persistDatagridSettingsService.setUserData(this.getListViewColumnDefKey(this.datagridKey), data);
    }
    /**
     * Retrieves the data from the persistence storage.
     * @returns a promise which when resolved will contain the ListView columns data.
     */
    getPersistedData() {
        if (!this.datagridKey || !this.persistDatagridSettingsService) {
            return {};
        }
        return this.persistDatagridSettingsService.getUserDataSync(this.getListViewColumnDefKey(this.datagridKey)) || {};
    }
    getListViewColumnDefKey(datagridId) {
        return datagridId + '_AppfxDatagridSettingsDef';
    }
    initialiseDatagridWithPersistedSettings() {
        //Update datagrid column definitions with the persisted data immediately after
        //the datagrid key is set and the column definitions of the datagrid are set
        this.subs.add(combineLatest([this.datagridKeyChange$.asObservable(), this.grid.columnDefsChange.pipe(first())]).subscribe(() => {
            this.updateDatagridColumnDefinitions();
        }));
        //Update datagrid page size with the persisted page size immediately after
        //the datagrid key is set and the page size of the datagrid is set
        this.subs.add(combineLatest([this.datagridKeyChange$.asObservable(), this.grid.pageSizeChange.pipe(first())]).subscribe(() => {
            this.updateDatagridPageSize();
        }));
    }
    /**
     * Set initial page size read from the local storage on the datagrid.
     */
    updateDatagridPageSize() {
        const data = this.getPersistedData();
        const persistedPageSize = data?.pageSize || 0;
        if (persistedPageSize > 0 && this.grid.pageSize !== persistedPageSize) {
            this.grid.pageSize = persistedPageSize;
        }
    }
    /**
     * Set width of datagrid columns, its visible and sort states.
     */
    updateDatagridColumnDefinitions() {
        const data = this.getPersistedData();
        if (!data.columns && !data.sorting) {
            return;
        }
        const columnsMap = new Map();
        this.grid.columns.forEach((column) => {
            const uid = this.getColumnUid(column);
            this.applySorting(uid, column, data.sorting);
            // Store a copy of the column definitions, as this will allow all the
            // changes to be discarded at once if this is needed.
            columnsMap.set(uid, { ...column });
        });
        //Apply persisted data only if the column size of persisted data is equal
        // to datagrid column size
        if (data.columns && columnsMap.size === data.columns.length) {
            this.applyPersistedColumnSettings(data.columns, columnsMap);
        }
    }
    applyPersistedColumnSettings(columns, columnsDefinitionsMap) {
        const columnsOrder = [];
        columns.forEach((columnPersistedState) => {
            const column = columnsDefinitionsMap.get(columnPersistedState.uid);
            if (column) {
                column.width = columnPersistedState.width ? columnPersistedState.width + 'px' : undefined;
                column.hidden = !columnPersistedState.visible;
                columnsOrder.push(column);
                columnsDefinitionsMap.delete(columnPersistedState.uid);
            }
        });
        //Update columns only if persisted columns are the same as
        //the set columns of the datagrid
        if (columnsOrder && columnsOrder.length === this.grid.columns.length && columnsDefinitionsMap.size === 0) {
            this.grid.columns = columnsOrder;
            // Update datagrid visible columns after applying persisted columns settings
            this.grid.visibleColumns = this.grid.columns.filter((column) => !column.hidden);
        }
    }
    /**
     * Set column default sort order read from the local storage on the datagrid
     */
    applySorting(columnUid, column, sorting) {
        if (!sorting?.column.visible) {
            return;
        }
        if (columnUid === sorting?.column?.uid) {
            column.defaultSortOrder = sorting.sortOrder;
        }
        // Clear default column by which the grid is sorted if there is
        // other visible column by which should be sorted the grid
        if (column.defaultSortOrder && columnUid !== sorting?.column?.uid) {
            column.defaultSortOrder = undefined;
        }
    }
    getColumnUid(column) {
        return column.uid || column.field || column.displayName;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridPersistSettingsDirective, deps: [{ token: DatagridComponent, host: true }, { token: appfxDatagridPersistSettingsToken, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: DatagridPersistSettingsDirective, isStandalone: false, selector: "appfx-datagrid[appfxPersistDatagridSettings]", inputs: { appfxPersistDatagridSettings: "appfxPersistDatagridSettings", persistPageSize: "persistPageSize", persistSortOrder: "persistSortOrder" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridPersistSettingsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'appfx-datagrid[appfxPersistDatagridSettings]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: DatagridComponent, decorators: [{
                    type: Host
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [appfxDatagridPersistSettingsToken]
                }] }], propDecorators: { appfxPersistDatagridSettings: [{
                type: Input
            }], persistPageSize: [{
                type: Input
            }], persistSortOrder: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// Injectable service contract for app-specific code that can get user preferences
const appfxDatagridUserPreferencesToken = new InjectionToken('Service that stores and reads user preferences related to the datagrid.');

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridContentNoWrapDirective {
    /**
     * Constructor, if DatagridUserPreferencesService is provided get wrap grid cell
     * user preference.
     *
     * @param grid
     * @param userPreferencesService - optional, because external projects which use appfx-datagrid may decide not
     *                                 to use this directive and allow their customers to select whether to wrap
     *                                 or not text in columns, in this case, they don't need to provide this service
     *                                 and the grid will have default behavior that will not wrap the text in list columns.
     */
    constructor(grid, userPreferencesService) {
        this.grid = grid;
        this.userPreferencesService = userPreferencesService;
        this.subs = new Subscription();
        if (userPreferencesService) {
            this.subs.add(userPreferencesService.getWrapGridCellTextPreference$().subscribe((data) => {
                grid.wrapText = data;
            }));
        }
    }
    ngOnDestroy() {
        this.subs.unsubscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridContentNoWrapDirective, deps: [{ token: DatagridComponent, host: true }, { token: appfxDatagridUserPreferencesToken, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: DatagridContentNoWrapDirective, isStandalone: false, selector: "appfx-datagrid", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridContentNoWrapDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'appfx-datagrid',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: DatagridComponent, decorators: [{
                    type: Host
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [appfxDatagridUserPreferencesToken]
                }] }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// Handle sorting on 'null | undefined | ""' value on the property
class FieldComparator {
    constructor(compareField) {
        this.field = compareField;
    }
    compare(a, b) {
        if (!a[this.field] && !b[this.field]) {
            return 0;
        }
        else if (!a[this.field] && b[this.field]) {
            return 1;
        }
        else if (a[this.field] && !b[this.field]) {
            return -1;
        }
        else {
            if (a[this.field] > b[this.field]) {
                return 1;
            }
            else if (a[this.field] < b[this.field]) {
                return -1;
            }
            else {
                return 0;
            }
        }
    }
}
// Handle sorting on field that is a list
class ListComparator {
    constructor(compareField) {
        this.field = compareField;
    }
    compare(a, b) {
        if (!a[this.field] && !b[this.field]) {
            return 0;
        }
        else if (!a[this.field] && b[this.field]) {
            return 1;
        }
        else if (a[this.field] && !b[this.field]) {
            return -1;
        }
        else {
            return a[this.field].length > b[this.field].length ? -1 : 1;
        }
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function compareNumericValues(itemA, itemB, fieldName) {
    const firstValue = Number(itemA[fieldName]);
    const secondValue = Number(itemB[fieldName]);
    if (isNaN(firstValue) && isNaN(secondValue)) {
        return 0;
    }
    if (isNaN(firstValue)) {
        return -1;
    }
    if (isNaN(secondValue)) {
        return 1;
    }
    return firstValue - secondValue;
}
class SimpleNumericComparator {
    constructor(fieldName) {
        this.fieldName = fieldName;
    }
    compare(first, second) {
        return compareNumericValues(first, second, this.fieldName);
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridColumnsOrderModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridColumnsOrderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: DatagridColumnsOrderModule, declarations: [ColumnOrderDirective, DatagridColumnsOrderDirective], imports: [ClrDatagridModule, CommonModule, DragDropModule], exports: [ColumnOrderDirective, DatagridColumnsOrderDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridColumnsOrderModule, imports: [ClrDatagridModule, CommonModule, DragDropModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridColumnsOrderModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ColumnOrderDirective, DatagridColumnsOrderDirective],
                    imports: [ClrDatagridModule, CommonModule, DragDropModule],
                    exports: [ColumnOrderDirective, DatagridColumnsOrderDirective],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function datagridStringsServiceFactory(existing) {
    return existing || new DatagridStrings();
}
const exportedComponents = [DatagridComponent, DatagridActionBarComponent, DatagridFilterComponent];
const exportedDirectives = [
    DatagridPageDirective,
    DatagridPersistSettingsDirective,
    DatagridPreserveSelectionDirective,
    DatagridContentNoWrapDirective,
];
class AppfxDatagridModule {
    constructor() {
        ClarityIcons.addIcons(dragHandleIcon);
    }
    static forRoot(errorNotifiableService) {
        return {
            ngModule: AppfxDatagridModule,
            providers: [{ provide: appfxDatagridErrorNotifiableToken, useClass: errorNotifiableService }],
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxDatagridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: AppfxDatagridModule, declarations: [DatagridComponent, DatagridActionBarComponent, DatagridFilterComponent, DatagridPageDirective,
            DatagridPersistSettingsDirective,
            DatagridPreserveSelectionDirective,
            DatagridContentNoWrapDirective, DatagridActionBarDropdownRepositionDirective,
            DatagridCellContainerComponent,
            DatagridColumnToggleComponent,
            DatagridFilterContainerComponent,
            ExportDatagridComponent,
            IsRowSelectablePipe], imports: [AppfxA11yModule,
            AppfxDatagridFiltersModule,
            A11yModule,
            DragDropModule,
            OverlayModule,
            ClrCheckboxModule,
            ClrDatagridModule,
            ClrDropdownModule,
            ClrIcon,
            ClrInputModule,
            ClrLoadingModule,
            CommonModule,
            DatagridColumnsOrderModule,
            FormsModule], exports: [DatagridComponent, DatagridActionBarComponent, DatagridFilterComponent, DatagridPageDirective,
            DatagridPersistSettingsDirective,
            DatagridPreserveSelectionDirective,
            DatagridContentNoWrapDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxDatagridModule, providers: [
            CsvHelperService,
            ExportProviderService,
            {
                // This pattern allows the importer of this module to specify its own DatagridStrings.
                provide: DatagridStrings,
                useFactory: datagridStringsServiceFactory,
                deps: [[new Optional(), new SkipSelf(), DatagridStrings]],
            },
        ], imports: [AppfxA11yModule,
            AppfxDatagridFiltersModule,
            A11yModule,
            DragDropModule,
            OverlayModule,
            ClrCheckboxModule,
            ClrDatagridModule,
            ClrDropdownModule,
            ClrIcon,
            ClrInputModule,
            ClrLoadingModule,
            CommonModule,
            DatagridColumnsOrderModule,
            FormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxDatagridModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        ...exportedComponents,
                        ...exportedDirectives,
                        DatagridActionBarDropdownRepositionDirective,
                        DatagridCellContainerComponent,
                        DatagridColumnToggleComponent,
                        DatagridFilterContainerComponent,
                        ExportDatagridComponent,
                        IsRowSelectablePipe,
                    ],
                    imports: [
                        AppfxA11yModule,
                        AppfxDatagridFiltersModule,
                        A11yModule,
                        DragDropModule,
                        OverlayModule,
                        ClrCheckboxModule,
                        ClrDatagridModule,
                        ClrDropdownModule,
                        ClrIcon,
                        ClrInputModule,
                        ClrLoadingModule,
                        CommonModule,
                        DatagridColumnsOrderModule,
                        FormsModule,
                    ],
                    exports: [...exportedComponents, ...exportedDirectives],
                    providers: [
                        CsvHelperService,
                        ExportProviderService,
                        {
                            // This pattern allows the importer of this module to specify its own DatagridStrings.
                            provide: DatagridStrings,
                            useFactory: datagridStringsServiceFactory,
                            deps: [[new Optional(), new SkipSelf(), DatagridStrings]],
                        },
                    ],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Feature states populated on application level during app initialization.
 * This is needed, because datagrid module does not have direct access to feature-state-service.
 */
class DatagridFeatureStates {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridFeatureStates, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridFeatureStates }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridFeatureStates, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class CaseInsensitiveContainsStringFilter {
    constructor(fieldName) {
        this.fieldName = fieldName;
    }
    accepts(item, search) {
        const currentItem = '' + item[this.fieldName];
        return currentItem === search || currentItem.toLowerCase().indexOf(search) >= 0;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ActionBarLayout, AppfxDatagridModule, CaseInsensitiveContainsStringFilter, CsvHelperService, DatagridActionBarComponent, DatagridComponent, DatagridContentNoWrapDirective, DatagridFeatureStates, DatagridFilterComponent, DatagridPageDirective, DatagridPersistSettingsDirective, DatagridPreserveSelectionDirective, DatagridStrings, ExportProviderService, ExportType, FieldComparator, ListComparator, SimpleNumericComparator, appfxDatagridErrorNotifiableToken, appfxDatagridPersistSettingsToken, appfxDatagridUserPreferencesToken, appfxPreselectableComponentToken };
//# sourceMappingURL=clr-addons-datagrid.mjs.map

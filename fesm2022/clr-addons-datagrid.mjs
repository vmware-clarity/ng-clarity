import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, Component, Directive, ElementRef, EventEmitter, Host, HostBinding, HostListener, Inject, Injectable, InjectionToken, Input, NgModule, Optional, Output, Pipe, SkipSelf, ViewChild, ViewChildren, ViewContainerRef, forwardRef, isDevMode, signal } from "@angular/core";
import * as i1$2 from "@clr/addons/a11y";
import { AppfxA11yModule, ZoomLevel } from "@clr/addons/a11y";
import { BehaviorSubject, Subject, Subscription, asyncScheduler, combineLatest, interval, map } from "rxjs";
import { debounce, filter, first, observeOn, takeUntil } from "rxjs/operators";
import * as i2$1 from "@clr/angular/icon";
import { ClarityIcons, ClrIcon, angleDoubleIcon, angleIcon, banIcon, dragHandleIcon, plusIcon } from "@clr/angular/icon";
import * as i3$3 from "@clr/angular/popover/dropdown";
import { ClrDropdownModule } from "@clr/angular/popover/dropdown";
import * as i4$1 from "@clr/angular/popover/common";
import * as i5$2 from "@angular/common";
import { CommonModule } from "@angular/common";
import * as i5 from "@clr/addons/datagrid-filters";
import { AppfxDatagridFiltersModule } from "@clr/addons/datagrid-filters";
import * as i3 from "@clr/addons/drag-and-drop";
import * as i1 from "@clr/angular/data/datagrid";
import { ClrDatagrid, ClrDatagridModule, ClrDatagridPagination, ClrDatagridSortOrder, SelectionType, selectionTypeAttribute } from "@clr/angular/data/datagrid";
import * as i1$1 from "@angular/cdk/drag-drop";
import { DragDropModule, moveItemInArray } from "@angular/cdk/drag-drop";
import * as i4 from "@clr/angular/forms/common";
import * as i10 from "@clr/angular/utils";
import * as i3$2 from "@clr/angular/forms";
import { ClrCheckboxModule, ClrInputModule } from "@clr/angular/forms";
import * as i3$1 from "@angular/cdk/overlay";
import { ConnectionPositionPair, OverlayModule } from "@angular/cdk/overlay";
import * as i2 from "@angular/cdk/a11y";
import { A11yModule } from "@angular/cdk/a11y";
import * as i5$1 from "@clr/angular/utils/loading";
import { ClrLoadingModule } from "@clr/angular/utils/loading";
import { FormsModule } from "@angular/forms";
const resources = {
	dropdownToggleWidthInRem: 3,
	layoutChangesDebounceDuration: 10
};
var DatagridActionBarComponent = class DatagridActionBarComponent {
	#subscription;
	constructor(cdr, el, elementResizeService) {
		this.cdr = cdr;
		this.el = el;
		this.elementResizeService = elementResizeService;
		this.btnLayout = "flex";
		this.dropdownOrientation = "bottom-left";
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
		this.#subscription = resize$.pipe(debounce(() => interval(resources.layoutChangesDebounceDuration))).subscribe(() => this.updateLayout());
		this.updateLayout();
	}
	ngOnDestroy() {
		if (this.#subscription && !this.#subscription.closed) this.#subscription.unsubscribe();
	}
	ngOnChanges(changes) {
		if (changes["actions"] && changes["actions"].currentValue) {
			if (this.isActionsIdsEqual(changes["actions"])) this.restoreVisible(changes["actions"].previousValue);
			else {
				this.initActionsVisibility();
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
		if (action.enabled) this.invokeAction.emit(action);
	}
	deriveBaseRootElementSize() {
		return parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("font-size"), 10);
	}
	isActionsIdsEqual(change) {
		if (!change.previousValue) return false;
		const a = change.currentValue;
		const b = change.previousValue;
		const aLength = a.length;
		if (aLength !== b.length) return false;
		return a.reduce((length, aValue, i) => aValue.id === b[i].id ? length - 1 : length, aLength) === 0;
	}
	initActionsVisibility() {
		this.actions.forEach((action) => {
			if (action.isVisible !== false) action.isVisible = true;
		});
		this.actionsSubject.next(this.actions);
	}
	restoreVisible(fromPrevious) {
		if (fromPrevious.length !== this.actions.length) return;
		fromPrevious.forEach((action, i) => this.actions[i].isVisible = action.isVisible);
		this.actionsSubject.next(this.actions);
	}
	updateListOfWidths() {
		this.listOfWidths.length = 0;
		this.queryActionBtnElementList.forEach((btnElementRef) => this.listOfWidths.push(btnElementRef.nativeElement.offsetWidth));
	}
	updateLayout() {
		if (this.el.nativeElement.offsetWidth) {
			const dropdownToggleWidthInPx = this.deriveBaseRootElementSize() * resources.dropdownToggleWidthInRem;
			const maxWidth = this.el.nativeElement.offsetWidth - dropdownToggleWidthInPx;
			let totalWidth = 0;
			this.listOfWidths.forEach((actionBtnWidth, i) => {
				totalWidth += actionBtnWidth;
				this.actions[i].isVisible = totalWidth < maxWidth;
			});
			if (this.isDropdownOpened) this.isDropdownOpened = false;
			this.actionsSubject.next(this.actions);
		}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridActionBarComponent,
			deps: [
				{ token: i0.ChangeDetectorRef },
				{ token: i0.ElementRef },
				{ token: i1$2.ElementResizeService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: DatagridActionBarComponent,
			isStandalone: false,
			selector: "appfx-datagrid-action-bar",
			inputs: {
				actions: "actions",
				btnLayout: "btnLayout",
				dropdownOrientation: "dropdownOrientation"
			},
			outputs: { invokeAction: "invokeAction" },
			viewQueries: [{
				propertyName: "queryActionBtnElementList",
				predicate: ["actionBtn"],
				descendants: true,
				read: ElementRef
			}],
			usesOnChanges: true,
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"btn-group\" [ngClass]=\"{ 'btn-flex': btnLayout === 'flex', 'btn-inline': btnLayout === 'inline' }\">\n  @for (action of actions$ | async; track action; let i = $index) {\n    @if (action.children && action.isVisible) {\n      <clr-dropdown [clrCloseMenuOnItemClick]=\"true\" #actionBtn [class]=\"i === 0 ? 'has-border-left' : ''\">\n        <button\n          type=\"button\"\n          clrDropdownTrigger\n          [title]=\"action.tooltip\"\n          [attr.data-test-id]=\"action.id\"\n          [disabled]=\"!action.enabled\"\n          [ngClass]=\"action.class\"\n        >\n          {{ action.label }}\n          <cds-icon shape=\"angle\" direction=\"down\"></cds-icon>\n        </button>\n        <clr-dropdown-menu *clrIfOpen [clrPosition]=\"dropdownOrientation\">\n          @for (childAction of action.children; track childAction) {\n            <button\n              clrDropdownItem\n              type=\"button\"\n              (click)=\"onActionClick(childAction)\"\n              [title]=\"childAction.tooltip\"\n              [attr.data-test-id]=\"childAction.id\"\n              [clrDisabled]=\"!childAction.enabled\"\n              [ngClass]=\"childAction.class\"\n            >\n              {{ childAction.label }}\n            </button>\n          }\n        </clr-dropdown-menu>\n      </clr-dropdown>\n    }\n    @if (!action.children && action.isVisible) {\n      <button\n        type=\"button\"\n        #actionBtn\n        (click)=\"onActionClick(action)\"\n        [title]=\"action.tooltip\"\n        [attr.data-test-id]=\"action.id\"\n        [disabled]=\"!action.enabled\"\n        [attr.aria-label]=\"action.ariaLabel\"\n        [ngClass]=\"action.class\"\n      >\n        {{ action.label }}\n      </button>\n    }\n  }\n\n  <!-- Process the hidden actions due to not enough space on the screen -->\n  @if (hasDropdownActions()) {\n    <clr-dropdown class=\"dropdown-container\" [clrCloseMenuOnItemClick]=\"true\">\n      <button type=\"button\" clrDropdownTrigger [ngClass]=\"actions[0].class\">\n        <cds-icon shape=\"ellipsis-horizontal\"></cds-icon>\n      </button>\n      <ng-template [(clrIfOpen)]=\"isDropdownOpened\">\n        <clr-dropdown-menu clrPosition=\"bottom-right\">\n          @for (action of getDropdownActions(); track action) {\n            <!-- Action has children - show a nested dropdown -->\n            @if (action.children) {\n              <clr-dropdown [clrCloseMenuOnItemClick]=\"true\" #actionBtn>\n                <button\n                  type=\"button\"\n                  clrDropdownTrigger\n                  class=\"\"\n                  [title]=\"action.tooltip\"\n                  [attr.data-test-id]=\"action.id\"\n                  [disabled]=\"!action.enabled\"\n                  [attr.aria-label]=\"action.ariaLabel\"\n                  [ngClass]=\"action.class\"\n                >\n                  {{ action.label }}\n                  <clr-icon shape=\"caret\" direction=\"down\"></clr-icon>\n                </button>\n                <clr-dropdown-menu *clrIfOpen clrPosition=\"bottom-right\">\n                  @for (childAction of action.children; track childAction) {\n                    <button\n                      clrDropdownItem\n                      type=\"button\"\n                      (click)=\"onActionClick(childAction)\"\n                      [title]=\"childAction.tooltip\"\n                      [attr.data-test-id]=\"childAction.id\"\n                      [clrDisabled]=\"!childAction.enabled\"\n                      [attr.aria-label]=\"action.ariaLabel\"\n                      [ngClass]=\"childAction.class\"\n                    >\n                      {{ childAction.label }}\n                    </button>\n                  }\n                </clr-dropdown-menu>\n              </clr-dropdown>\n            }\n            <!-- Action has no children -->\n            @if (!action.children) {\n              <button\n                clrDropdownItem\n                type=\"button\"\n                (click)=\"onActionClick(action)\"\n                [title]=\"action.tooltip\"\n                [attr.data-test-id]=\"action.id\"\n                [attr.aria-label]=\"action.ariaLabel\"\n                [disabled]=\"!action.enabled\"\n                [ngClass]=\"action.class\"\n              >\n                {{ action.label }}\n              </button>\n            }\n          }\n        </clr-dropdown-menu>\n      </ng-template>\n    </clr-dropdown>\n  }\n</div>\n",
			styles: [":host .dropdown-container{margin-left:auto}:host div.btn-group{width:100%;margin-right:0}:host div.btn-group.btn-inline{display:inline-block}:host button{flex:0 0 auto;max-width:unset}:host clr-dropdown button.dropdown-toggle{color:var(--clr-btn-default-color)}:host clr-dropdown.has-border-left button.dropdown-toggle{border-left-style:solid!important;border-left-width:1px!important}:host clr-dropdown-menu{max-width:18rem}:host clr-dropdown-menu button{overflow-wrap:break-word;word-break:normal;white-space:normal}:host-context(.zoom4x) clr-dropdown-menu{margin-right:.8rem}:host-context(.zoom4x) .dropdown-container{margin-left:0}:host-context(.zoom4x) div.btn-group .btn-flex{display:flex;flex-direction:row;justify-content:flex-start}:host-context(.zoom4x) div.btn-group .btn-inline{display:inline-block}:host-context(.zoom4x) div.btn-group button{padding-left:10px}\n"],
			dependencies: [
				{
					kind: "component",
					type: i2$1.ClrIcon,
					selector: "clr-icon, cds-icon",
					inputs: [
						"shape",
						"size",
						"direction",
						"flip",
						"solid",
						"status",
						"inverse",
						"badge",
						"innerOffset"
					]
				},
				{
					kind: "component",
					type: i3$3.ClrDropdown,
					selector: "clr-dropdown",
					inputs: ["clrCloseMenuOnItemClick"]
				},
				{
					kind: "component",
					type: i3$3.ClrDropdownMenu,
					selector: "clr-dropdown-menu",
					inputs: ["clrPosition"]
				},
				{
					kind: "directive",
					type: i3$3.ClrDropdownTrigger,
					selector: "[clrDropdownTrigger],[clrDropdownToggle]"
				},
				{
					kind: "directive",
					type: i3$3.ClrDropdownItem,
					selector: "[clrDropdownItem]",
					inputs: [
						"role",
						"clrDisabled",
						"id"
					]
				},
				{
					kind: "directive",
					type: i4$1.ClrIfOpen,
					selector: "[clrIfOpen]",
					inputs: ["clrIfOpen"],
					outputs: ["clrIfOpenChange"]
				},
				{
					kind: "directive",
					type: i5$2.NgClass,
					selector: "[ngClass]",
					inputs: ["class", "ngClass"]
				},
				{
					kind: "pipe",
					type: i5$2.AsyncPipe,
					name: "async"
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridActionBarComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-datagrid-action-bar",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"btn-group\" [ngClass]=\"{ 'btn-flex': btnLayout === 'flex', 'btn-inline': btnLayout === 'inline' }\">\n  @for (action of actions$ | async; track action; let i = $index) {\n    @if (action.children && action.isVisible) {\n      <clr-dropdown [clrCloseMenuOnItemClick]=\"true\" #actionBtn [class]=\"i === 0 ? 'has-border-left' : ''\">\n        <button\n          type=\"button\"\n          clrDropdownTrigger\n          [title]=\"action.tooltip\"\n          [attr.data-test-id]=\"action.id\"\n          [disabled]=\"!action.enabled\"\n          [ngClass]=\"action.class\"\n        >\n          {{ action.label }}\n          <cds-icon shape=\"angle\" direction=\"down\"></cds-icon>\n        </button>\n        <clr-dropdown-menu *clrIfOpen [clrPosition]=\"dropdownOrientation\">\n          @for (childAction of action.children; track childAction) {\n            <button\n              clrDropdownItem\n              type=\"button\"\n              (click)=\"onActionClick(childAction)\"\n              [title]=\"childAction.tooltip\"\n              [attr.data-test-id]=\"childAction.id\"\n              [clrDisabled]=\"!childAction.enabled\"\n              [ngClass]=\"childAction.class\"\n            >\n              {{ childAction.label }}\n            </button>\n          }\n        </clr-dropdown-menu>\n      </clr-dropdown>\n    }\n    @if (!action.children && action.isVisible) {\n      <button\n        type=\"button\"\n        #actionBtn\n        (click)=\"onActionClick(action)\"\n        [title]=\"action.tooltip\"\n        [attr.data-test-id]=\"action.id\"\n        [disabled]=\"!action.enabled\"\n        [attr.aria-label]=\"action.ariaLabel\"\n        [ngClass]=\"action.class\"\n      >\n        {{ action.label }}\n      </button>\n    }\n  }\n\n  <!-- Process the hidden actions due to not enough space on the screen -->\n  @if (hasDropdownActions()) {\n    <clr-dropdown class=\"dropdown-container\" [clrCloseMenuOnItemClick]=\"true\">\n      <button type=\"button\" clrDropdownTrigger [ngClass]=\"actions[0].class\">\n        <cds-icon shape=\"ellipsis-horizontal\"></cds-icon>\n      </button>\n      <ng-template [(clrIfOpen)]=\"isDropdownOpened\">\n        <clr-dropdown-menu clrPosition=\"bottom-right\">\n          @for (action of getDropdownActions(); track action) {\n            <!-- Action has children - show a nested dropdown -->\n            @if (action.children) {\n              <clr-dropdown [clrCloseMenuOnItemClick]=\"true\" #actionBtn>\n                <button\n                  type=\"button\"\n                  clrDropdownTrigger\n                  class=\"\"\n                  [title]=\"action.tooltip\"\n                  [attr.data-test-id]=\"action.id\"\n                  [disabled]=\"!action.enabled\"\n                  [attr.aria-label]=\"action.ariaLabel\"\n                  [ngClass]=\"action.class\"\n                >\n                  {{ action.label }}\n                  <clr-icon shape=\"caret\" direction=\"down\"></clr-icon>\n                </button>\n                <clr-dropdown-menu *clrIfOpen clrPosition=\"bottom-right\">\n                  @for (childAction of action.children; track childAction) {\n                    <button\n                      clrDropdownItem\n                      type=\"button\"\n                      (click)=\"onActionClick(childAction)\"\n                      [title]=\"childAction.tooltip\"\n                      [attr.data-test-id]=\"childAction.id\"\n                      [clrDisabled]=\"!childAction.enabled\"\n                      [attr.aria-label]=\"action.ariaLabel\"\n                      [ngClass]=\"childAction.class\"\n                    >\n                      {{ childAction.label }}\n                    </button>\n                  }\n                </clr-dropdown-menu>\n              </clr-dropdown>\n            }\n            <!-- Action has no children -->\n            @if (!action.children) {\n              <button\n                clrDropdownItem\n                type=\"button\"\n                (click)=\"onActionClick(action)\"\n                [title]=\"action.tooltip\"\n                [attr.data-test-id]=\"action.id\"\n                [attr.aria-label]=\"action.ariaLabel\"\n                [disabled]=\"!action.enabled\"\n                [ngClass]=\"action.class\"\n              >\n                {{ action.label }}\n              </button>\n            }\n          }\n        </clr-dropdown-menu>\n      </ng-template>\n    </clr-dropdown>\n  }\n</div>\n",
			styles: [":host .dropdown-container{margin-left:auto}:host div.btn-group{width:100%;margin-right:0}:host div.btn-group.btn-inline{display:inline-block}:host button{flex:0 0 auto;max-width:unset}:host clr-dropdown button.dropdown-toggle{color:var(--clr-btn-default-color)}:host clr-dropdown.has-border-left button.dropdown-toggle{border-left-style:solid!important;border-left-width:1px!important}:host clr-dropdown-menu{max-width:18rem}:host clr-dropdown-menu button{overflow-wrap:break-word;word-break:normal;white-space:normal}:host-context(.zoom4x) clr-dropdown-menu{margin-right:.8rem}:host-context(.zoom4x) .dropdown-container{margin-left:0}:host-context(.zoom4x) div.btn-group .btn-flex{display:flex;flex-direction:row;justify-content:flex-start}:host-context(.zoom4x) div.btn-group .btn-inline{display:inline-block}:host-context(.zoom4x) div.btn-group button{padding-left:10px}\n"]
		}]
	}],
	ctorParameters: () => [
		{ type: i0.ChangeDetectorRef },
		{ type: i0.ElementRef },
		{ type: i1$2.ElementResizeService }
	],
	propDecorators: {
		queryActionBtnElementList: [{
			type: ViewChildren,
			args: ["actionBtn", { read: ElementRef }]
		}],
		actions: [{ type: Input }],
		btnLayout: [{ type: Input }],
		dropdownOrientation: [{ type: Input }],
		invokeAction: [{ type: Output }]
	}
});
function getDatagridKeyNavigationController(datagrid) {
	return datagrid.keyNavigation;
}
function isEqualColumns(column, other) {
	return !!column && !!other && (!!column.uid && column.uid === other.uid || !!column.displayName && column.displayName === other.displayName);
}
var DatagridColumnsOrderService = class DatagridColumnsOrderService {
	constructor() {
		this.grabbedColumn = new BehaviorSubject(null);
		this.moveVisibleColumn = new Subject();
		this.focusGrabbedColumn = new Subject();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridColumnsOrderService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridColumnsOrderService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridColumnsOrderService,
	decorators: [{ type: Injectable }]
});
var ColumnMoveDirection;
(function(ColumnMoveDirection) {
	ColumnMoveDirection["Left"] = "left";
	ColumnMoveDirection["Right"] = "right";
})(ColumnMoveDirection || (ColumnMoveDirection = {}));
var DatagridColumnsOrderDirective = class DatagridColumnsOrderDirective {
	constructor(elementRef, cdkDropList, columnOrderingService) {
		this.elementRef = elementRef;
		this.cdkDropList = cdkDropList;
		this.columnOrderingService = columnOrderingService;
		this.dgColumnsVirtualScrolling = false;
		this.dgColumnsOrderChange = new EventEmitter();
		this.subs = new Subscription();
		cdkDropList.orientation = "horizontal";
	}
	ngOnInit() {
		this.subs.add(this.cdkDropList.dropped.pipe(filter((droppedData) => !!droppedData?.item?.data?.displayName), map((droppedData) => {
			return this.findColumnIndices(droppedData.item.data, droppedData.currentIndex);
		}), filter((columnIndices) => columnIndices.currentIndex !== columnIndices.previousIndex), filter((columnIndices) => this.isReorderAllowed(columnIndices))).subscribe((columnIndices) => {
			this.reorderColumn(columnIndices);
		}));
		this.subs.add(this.columnOrderingService.moveVisibleColumn.subscribe((visibleColumnIndices) => {
			if (this.moveColumnTo(visibleColumnIndices.visibleColumnIndex, visibleColumnIndices.moveLeft ? ColumnMoveDirection.Left : ColumnMoveDirection.Right)) this.columnOrderingService.focusGrabbedColumn.next();
		}));
	}
	canMoveColumn(visibleColumnIndex, direction) {
		return !!this.computeTargetIndices(visibleColumnIndex, direction);
	}
	moveColumnTo(visibleColumnIndex, direction) {
		const indices = this.computeTargetIndices(visibleColumnIndex, direction);
		if (!indices) return false;
		this.reorderColumn(indices);
		return true;
	}
	setDgColumnsContainer() {
		let selector = "div.datagrid";
		if (this.dgColumnsVirtualScrolling) selector += " div.datagrid-header";
		const scrollableContainer = this.elementRef.nativeElement.querySelector(selector);
		if (scrollableContainer) {
			this.cdkDropList._dropListRef._container = scrollableContainer;
			this.cdkDropList._dropListRef.element = scrollableContainer;
			this.cdkDropList.element = new ElementRef(scrollableContainer);
		}
	}
	ngOnChanges(changes) {
		if (changes["dgColumnsVirtualScrolling"]) this.setDgColumnsContainer();
	}
	ngOnDestroy() {
		this.subs.unsubscribe();
	}
	isReorderAllowed(indices) {
		if (indices.previousIndex < 0 || indices.currentIndex < 0) return false;
		const from = Math.min(indices.previousIndex, indices.currentIndex);
		const to = Math.max(indices.previousIndex, indices.currentIndex);
		return !this.dgColumnsOrderColumns.slice(from, to + 1).some((column) => column.pinned && !column.hidden);
	}
	reorderColumn(indices) {
		const value = [...this.dgColumnsOrderColumns];
		moveItemInArray(value, indices.previousIndex, indices.currentIndex);
		this.dgColumnsOrderColumns = value;
		this.dgColumnsOrderChange.emit({
			...indices,
			columns: this.dgColumnsOrderColumns
		});
	}
	computeTargetIndices(visibleColumnIndex, direction) {
		const column = this.dgColumnsOrderColumns.filter((other) => !other.hidden)[visibleColumnIndex];
		const scrollableColumns = this.dgColumnsOrderColumns.filter((other) => !other.hidden && !other.pinned);
		const index = scrollableColumns.indexOf(column);
		const target = scrollableColumns[index + (direction === ColumnMoveDirection.Left ? -1 : 1)];
		if (index < 0 || !target) return null;
		return this.createColumnIndices(column, target);
	}
	findColumnIndices(previousColumn, currentDroppedItemIndex) {
		const currentColumn = this.cdkDropList.getSortedItems().map((item) => item.data).find((column, index) => {
			return index >= currentDroppedItemIndex - 1 && !!column;
		});
		return this.createColumnIndices(previousColumn, currentColumn);
	}
	createColumnIndices(previousColumn, currentColumn) {
		return {
			previousIndex: this.findColumnIndex(previousColumn),
			currentIndex: this.findColumnIndex(currentColumn)
		};
	}
	findColumnIndex(column) {
		return this.dgColumnsOrderColumns.findIndex((other) => {
			return isEqualColumns(column, other);
		});
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridColumnsOrderDirective,
			deps: [
				{ token: i0.ElementRef },
				{ token: i1$1.CdkDropList },
				{ token: DatagridColumnsOrderService }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: DatagridColumnsOrderDirective,
			isStandalone: false,
			selector: "clr-datagrid[appfxDgColumnsOrder]",
			inputs: {
				dgColumnsOrderColumns: "dgColumnsOrderColumns",
				dgColumnsVirtualScrolling: "dgColumnsVirtualScrolling"
			},
			outputs: { dgColumnsOrderChange: "dgColumnsOrderChange" },
			providers: [DatagridColumnsOrderService],
			usesOnChanges: true,
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridColumnsOrderDirective,
	decorators: [{
		type: Directive,
		args: [{
			selector: "clr-datagrid[appfxDgColumnsOrder]",
			providers: [DatagridColumnsOrderService],
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: i0.ElementRef },
		{ type: i1$1.CdkDropList },
		{ type: DatagridColumnsOrderService }
	],
	propDecorators: {
		dgColumnsOrderColumns: [{ type: Input }],
		dgColumnsVirtualScrolling: [{ type: Input }],
		dgColumnsOrderChange: [{ type: Output }]
	}
});
var CsvHelperService = class CsvHelperService {
	getData(rows, columns) {
		let columnCsvData = "", rowsCsvData = "";
		if (columns) {
			columnCsvData = this.getColumnDataFromColumnDef(columns);
			rowsCsvData = this.getRowDataFromColumnDef(rows, columns);
		}
		return columnCsvData + rowsCsvData;
	}
	getColumnDataFromColumnDef(columnDefinitions) {
		const columnNames = [];
		for (const columnDef of columnDefinitions) {
			const columnName = this.toCsvFormat(columnDef.displayName.toString());
			columnNames.push(columnName);
		}
		return columnNames.join(",") + "\n";
	}
	getRowDataFromColumnDef(exportItems, columnDefinitions) {
		let rowsCsvData = "";
		for (const item of exportItems) {
			const rowValues = [];
			for (const columnDef of columnDefinitions) {
				let exportValue = "";
				const itemValue = this.getItemValueFromColumnField(item, columnDef.field);
				if (!itemValue) exportValue = "";
				else exportValue = itemValue.toString();
				exportValue = this.toCsvFormat(exportValue);
				rowValues.push(exportValue);
			}
			rowsCsvData += rowValues.join(",") + "\n";
		}
		return rowsCsvData;
	}
	toCsvFormat(itemValue) {
		if (itemValue.indexOf("\"") > -1) itemValue = itemValue.replace(/"/g, "\"\"");
		itemValue = "\"" + itemValue.toString() + "\"";
		return itemValue;
	}
	getItemValueFromColumnField(item, field) {
		if (field.indexOf(".") > 0) {
			const fieldNames = field.split(".");
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
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: CsvHelperService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: CsvHelperService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: CsvHelperService,
	decorators: [{ type: Injectable }]
});
var ExportType;
(function(ExportType) {
	ExportType["ALL"] = "ALL";
	ExportType["SELECTED_ONLY"] = "SELECTED_ONLY";
	ExportType["MATCHING_FILTERS"] = "MATCHING_FILTERS";
})(ExportType || (ExportType = {}));
const defaultFileExtension = ".csv";
var DatagridStrings = class DatagridStrings {
	constructor() {
		this.noItemsFound = "No items found";
		this.showColumns = "Show Columns";
		this.selectAll = "Select All";
		this.pickColumns = "Manage Columns";
		this.showColumnsMenuDescription = "Show columns menu description";
		this.allColumnsSelected = "Select all columns";
		this.singleItem = "1 item";
		this.multipleItems = "{0} items";
		this.pagedItems = "{1} - {2} of {0} items";
		this.itemsPerPage = "Items per page";
		this.exportLink = "Export";
		this.exportAll = "All Rows";
		this.exportMatchingFilters = "Matching Filters";
		this.exportSelectedRows = "Selected Rows";
		this.exportErrorMessage = "Sorry, the data could not be exported at the moment due to some internal error.";
		this.exportErrorTitle = "Export Data Failure";
		this.closeColumnTogglerText = "Close";
		this.deselectAll = "Deselect All";
		this.expandDetailsPaneLabel = "Expand the details pane for the {0} item";
		this.collapseDetailsPaneLabel = "Collapse the details pane for the {0} item";
		this.filterPlaceholder = "Filter Items";
		this.moveColumnLeft = "Move Left";
		this.moveColumnRight = "Move Right";
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridStrings,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridStrings
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridStrings,
	decorators: [{ type: Injectable }]
});
const appfxDatagridErrorNotifiableToken = new InjectionToken("notifier service that presents errors whenever an unrecoverable event occurs within grid");
var ExportProviderService = class ExportProviderService {
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
			if (exportStatus.exportType === ExportType.SELECTED_ONLY) exportItems = datagridItemSet.selectedItems;
			else if (exportStatus.exportType === ExportType.MATCHING_FILTERS) exportItems = datagridItemSet.filteredDatagridItems;
			if (exportItems.length > 1 && datagridProperties.sort) exportItems = (datagridProperties.sortFunction || this.sortExportedItems)(exportItems, datagridProperties.sortOrder);
			const csvData = this.csvHelperService.getData(exportItems, datagridProperties?.columnDefinitions || []);
			exportStatus.inProgress = false;
			this.downloadFile(csvData, datagridProperties.exportedFileName);
		} catch (exception) {
			exportStatus.inProgress = false;
			this.showExportError();
		}
	}
	downloadFile(csvData, exportedFileName) {
		try {
			const blob = new Blob([csvData], { type: "text/plain" });
			let fileName = "exportedData.csv";
			if (exportedFileName) fileName = exportedFileName + defaultFileExtension;
			const csvDataUrl = URL.createObjectURL(blob);
			const downloadLink = this.renderer.createElement("a");
			downloadLink.setAttribute("href", csvDataUrl);
			downloadLink.setAttribute("download", fileName);
			this.renderer.appendChild(this.elementRef.nativeElement, downloadLink);
			downloadLink.click();
			setTimeout(() => {
				this.renderer.removeChild(this.elementRef.nativeElement, downloadLink);
				URL.revokeObjectURL(csvDataUrl);
				downloadLink.remove();
			}, 100);
		} catch (exception) {
			this.showExportError();
		}
	}
	showExportError() {
		if (this.errorNotifiableService) this.errorNotifiableService.notifyError(this.dgStrings.exportErrorTitle, this.dgStrings.exportErrorMessage);
		else console.error(this.dgStrings.exportErrorTitle, this.dgStrings.exportErrorMessage);
	}
	sortExportedItems(gridItems, sortOrder) {
		if (!sortOrder) return gridItems;
		const forField = sortOrder.column.field;
		const sortedItems = gridItems.sort((a, b) => {
			if (!Object.prototype.hasOwnProperty.call(a, forField) || !Object.prototype.hasOwnProperty.call(b, forField)) return 0;
			const valA = a[forField];
			const valB = b[forField];
			if (valA === null || valA === void 0) {
				if (valB === null || valB === void 0) return 0;
				else return 1;
			}
			if (valB === null || valB === void 0) return -1;
			return valA.localeCompare(valB);
		});
		return sortOrder.sortOrder === ClrDatagridSortOrder.DESC ? sortedItems.reverse() : sortedItems;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ExportProviderService,
			deps: [
				{ token: CsvHelperService },
				{ token: i0.Renderer2 },
				{ token: i0.ElementRef },
				{ token: DatagridStrings },
				{
					token: appfxDatagridErrorNotifiableToken,
					optional: true
				}
			],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ExportProviderService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ExportProviderService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [
		{ type: CsvHelperService },
		{ type: i0.Renderer2 },
		{ type: i0.ElementRef },
		{ type: DatagridStrings },
		{
			type: void 0,
			decorators: [{ type: Optional }, {
				type: Inject,
				args: [appfxDatagridErrorNotifiableToken]
			}]
		}
	]
});
let instancesCount = BigInt(0);
const uniqueIdToken = new InjectionToken("UID generator");
const uniqueIdProvider = {
	provide: uniqueIdToken,
	useFactory: uniqueIdFactory
};
function uniqueIdFactory() {
	return `${instancesCount++}`;
}
function getNestedProperty(item, propertyPath) {
	if (!item || !propertyPath) return { isValid: false };
	let isValid = true;
	const value = propertyPath.split(".").reduce((o, i) => {
		if (o !== null && o !== void 0 && typeof o === "object" && i in o) return o[i];
		isValid = false;
	}, item);
	return isValid ? {
		isValid: true,
		value
	} : { isValid: false };
}
const appfxPreselectableComponentToken = new InjectionToken("PRESELECTABLE_COMPONENT_TOKEN");
var DatagridPreserveSelectionDirective = class DatagridPreserveSelectionDirective {
	constructor(preselectableComponent) {
		this.preselectableComponent = preselectableComponent;
		this.preserveExistingSelection = true;
		this.selectedItemsUpdated = new EventEmitter();
		this.component = preselectableComponent;
	}
	ngAfterViewInit() {
		if (this.preserveExistingSelection) {
			this.selectBy = this.component.trackByGridItemProperty || this.component.trackByFunction;
			if (!this.selectBy) throw Error("The \"preserveSelection\" directive is not initialized correctly. Provide \"trackByFunction\" or  \"trackByGridItemProperty\" of the appfx datagrid.");
			this.gridItemChangeSub = this.component.gridItemsChange.subscribe((items) => {
				if (this.component.selectionType !== SelectionType.None && this.component.selectedItems?.length > 0) this.updateSelectedItems(items);
			});
		}
	}
	ngOnDestroy() {
		if (this.gridItemChangeSub) this.gridItemChangeSub.unsubscribe();
	}
	updateSelectedItems(items) {
		let selectedItems;
		if (this.component.serverDrivenDatagrid) selectedItems = this.findAndUpdateSelectedItems(items);
		else selectedItems = this.findSelectedItems(items);
		if (this.selectedItemsUpdated.observers.length > 0) this.selectedItemsUpdated.emit(selectedItems);
		else this.component.selectedItems = selectedItems;
	}
	findSelectedItems(items) {
		const selectedItemsDic = this.createSelectedItemsDictionary();
		return items.filter((item) => {
			const itemPropertyValue = this.getItemUniquePropertyValue(item);
			return selectedItemsDic.has(itemPropertyValue);
		});
	}
	findAndUpdateSelectedItems(items) {
		const selectedItems = [];
		const selectedItemIndexByRef = /* @__PURE__ */ new Map();
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
		const selectedItemsDic = /* @__PURE__ */ new Map();
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
		if (typeof this.selectBy === "function") return this.selectBy(0, item || {});
		const result = getNestedProperty(item, this.selectBy);
		return result.isValid ? String(result.value) : "";
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridPreserveSelectionDirective,
			deps: [{
				token: appfxPreselectableComponentToken,
				host: true
			}],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: DatagridPreserveSelectionDirective,
			isStandalone: false,
			selector: "[appfxPreserveSelection]",
			inputs: { preserveExistingSelection: "preserveExistingSelection" },
			outputs: { selectedItemsUpdated: "selectedItemsUpdated" },
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridPreserveSelectionDirective,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[appfxPreserveSelection]",
			standalone: false
		}]
	}],
	ctorParameters: () => [{
		type: void 0,
		decorators: [{
			type: Inject,
			args: [appfxPreselectableComponentToken]
		}, { type: Host }]
	}],
	propDecorators: {
		preserveExistingSelection: [{ type: Input }],
		selectedItemsUpdated: [{ type: Output }]
	}
});
var ActionBarLayout;
(function(ActionBarLayout) {
	ActionBarLayout["flatCompact"] = "btn btn-sm btn-link";
	ActionBarLayout["flat"] = "btn btn-link";
	ActionBarLayout["outlined"] = "btn btn-sm btn-secondary";
})(ActionBarLayout || (ActionBarLayout = {}));
var ColumnMoveActionDirective = class ColumnMoveActionDirective {
	constructor(columnsOrderDirective) {
		this.columnsOrderDirective = columnsOrderDirective;
	}
	get disabled() {
		return !this.columnsOrderDirective.canMoveColumn(this.columnIndex, this.direction);
	}
	onClick() {
		if (this.disabled) return;
		this.columnsOrderDirective.moveColumnTo(this.columnIndex, this.direction);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ColumnMoveActionDirective,
			deps: [{ token: DatagridColumnsOrderDirective }],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ColumnMoveActionDirective,
			isStandalone: false,
			selector: "[appfxColumnMoveAction]",
			inputs: {
				direction: ["appfxColumnMoveAction", "direction"],
				columnIndex: "columnIndex"
			},
			host: { listeners: { "click": "onClick()" } },
			exportAs: ["appfxColumnMoveAction"],
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ColumnMoveActionDirective,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[appfxColumnMoveAction]",
			exportAs: "appfxColumnMoveAction",
			standalone: false
		}]
	}],
	ctorParameters: () => [{ type: DatagridColumnsOrderDirective }],
	propDecorators: {
		direction: [{
			type: Input,
			args: ["appfxColumnMoveAction"]
		}],
		columnIndex: [{ type: Input }],
		onClick: [{
			type: HostListener,
			args: ["click"]
		}]
	}
});
var ColumnOrderDirective = class ColumnOrderDirective {
	constructor(datagrid, elementRef, columnOrderingService, changeDetectorRef, cdkDrag) {
		this.datagrid = datagrid;
		this.elementRef = elementRef;
		this.columnOrderingService = columnOrderingService;
		this.changeDetectorRef = changeDetectorRef;
		this.cdkDrag = cdkDrag;
		this.isGrabbed = false;
		this.subs = new Subscription();
		cdkDrag.previewContainer = "parent";
	}
	keydown(event) {
		if (!(event.target?.tagName === "CLR-DG-COLUMN")) return;
		const isSpace = event.code === "Space";
		const isLeft = event.code === "ArrowLeft";
		const isRight = event.code === "ArrowRight";
		const isUp = event.code === "ArrowUp";
		const isDown = event.code === "ArrowDown";
		const isEsc = event.code === "Escape";
		const isCurrentColumnGrabbed = isEqualColumns(this.columnData, this.columnOrderingService.grabbedColumn.value);
		const isReorderable = !this.columnData?.pinned;
		if (isCurrentColumnGrabbed && (isLeft || isRight) && isReorderable) {
			event.stopImmediatePropagation();
			event.preventDefault();
			this.moveColumn(isLeft);
		}
		if (isSpace) {
			event.stopImmediatePropagation();
			event.preventDefault();
		}
		if (isCurrentColumnGrabbed && (isEsc || isDown || isUp || isSpace)) this.columnOrderingService.grabbedColumn.next(null);
		if (!isCurrentColumnGrabbed && isSpace && isReorderable) this.columnOrderingService.grabbedColumn.next(this.columnData);
	}
	ngOnInit() {
		this.subs.add(this.columnOrderingService.grabbedColumn.pipe(filter((other) => {
			return isEqualColumns(this.columnData, other) !== this.isGrabbed;
		})).subscribe(() => {
			this.updateGrabbedState();
		}));
		this.subs.add(this.columnOrderingService.focusGrabbedColumn.pipe(filter(() => this.isGrabbed)).subscribe(() => {
			this.setActiveCell();
		}));
		this.subs.add(this.cdkDrag.started.subscribe(() => {
			this.columnOrderingService.grabbedColumn.next(null);
		}));
	}
	ngOnDestroy() {
		this.subs.unsubscribe();
	}
	moveColumn(isLeft) {
		this.columnOrderingService.moveVisibleColumn.next({
			moveLeft: isLeft,
			visibleColumnIndex: this.columnIndex
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
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ColumnOrderDirective,
			deps: [
				{ token: i1.ClrDatagrid },
				{ token: i0.ElementRef },
				{ token: DatagridColumnsOrderService },
				{ token: i0.ChangeDetectorRef },
				{ token: i1$1.CdkDrag }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ColumnOrderDirective,
			isStandalone: false,
			selector: "clr-dg-column[appfxColumnOrder]",
			inputs: {
				columnData: "columnData",
				columnIndex: "columnIndex"
			},
			host: {
				listeners: { "keydown": "keydown($event)" },
				properties: { "class.grabbed": "this.isGrabbed" }
			},
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ColumnOrderDirective,
	decorators: [{
		type: Directive,
		args: [{
			selector: "clr-dg-column[appfxColumnOrder]",
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: i1.ClrDatagrid },
		{ type: i0.ElementRef },
		{ type: DatagridColumnsOrderService },
		{ type: i0.ChangeDetectorRef },
		{ type: i1$1.CdkDrag }
	],
	propDecorators: {
		isGrabbed: [{
			type: HostBinding,
			args: ["class.grabbed"]
		}],
		columnData: [{ type: Input }],
		columnIndex: [{ type: Input }],
		keydown: [{
			type: HostListener,
			args: ["keydown", ["$event"]]
		}]
	}
});
var DatagridFilterComponent = class DatagridFilterComponent {
	constructor(dgStrings, popoverService) {
		this.dgStrings = dgStrings;
		this.popoverService = popoverService;
		this.filterValueChange = new EventEmitter();
		this.changes = new Subject();
	}
	ngOnInit() {
		this.value = this.filterValue || "";
	}
	ngAfterViewInit() {
		this.popoverService.openChange.pipe(observeOn(asyncScheduler)).subscribe((openChange) => {
			if (openChange) this.input.nativeElement.focus();
		});
	}
	onKey(event) {
		this.value = event.target.value;
		this.changes.next(true);
		if (this.filterValue !== this.value) this.filterValueChange.emit(this.value);
	}
	isActive() {
		return !!this.value;
	}
	accepts(item) {
		const lowerCaseTrimmedValue = this.value.toLowerCase().trim();
		let currentItemFieldValue;
		if (this.stringFilterType) return this.stringFilterType.accepts(item, lowerCaseTrimmedValue);
		else if (this.fieldName) {
			currentItemFieldValue = "" + item[this.fieldName];
			return currentItemFieldValue.toLowerCase().indexOf(lowerCaseTrimmedValue) >= 0;
		}
		return false;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridFilterComponent,
			deps: [{ token: DatagridStrings }, { token: i4$1.ClrPopoverService }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: DatagridFilterComponent,
			isStandalone: false,
			selector: "appfx-datagrid-filter",
			inputs: {
				filterValue: "filterValue",
				stringFilterType: "stringFilterType",
				fieldName: "fieldName"
			},
			outputs: { filterValueChange: "filterValueChange" },
			viewQueries: [{
				propertyName: "input",
				first: true,
				predicate: ["input"],
				descendants: true
			}],
			ngImport: i0,
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
			isInline: true,
			dependencies: [{
				kind: "directive",
				type: i3$2.ClrInput,
				selector: "[clrInput]"
			}, {
				kind: "component",
				type: i3$2.ClrInputContainer,
				selector: "clr-input-container"
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridFilterComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-datagrid-filter",
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
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [{ type: DatagridStrings }, { type: i4$1.ClrPopoverService }],
	propDecorators: {
		filterValue: [{ type: Input }],
		stringFilterType: [{ type: Input }],
		fieldName: [{ type: Input }],
		filterValueChange: [{ type: Output }],
		input: [{
			type: ViewChild,
			args: ["input"]
		}]
	}
});
var DatagridCellContainerComponent = class DatagridCellContainerComponent {
	ngOnChanges() {
		if (this.instance && typeof this.instance.onChange === "function") this.instance.onChange(this.item || {}, this.column);
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
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridCellContainerComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: DatagridCellContainerComponent,
			isStandalone: false,
			selector: "appfx-dg-cell-container",
			inputs: {
				column: "column",
				item: "item"
			},
			viewQueries: [{
				propertyName: "container",
				first: true,
				predicate: ["cellContainer"],
				descendants: true,
				read: ViewContainerRef,
				static: true
			}],
			usesOnChanges: true,
			ngImport: i0,
			template: `
    @if (!column.columnRenderer) {
      <span [title]="item?.[column.field] ?? null">{{ item?.[column.field] }}</span>
    }
    <ng-template #cellContainer></ng-template>
  `,
			isInline: true,
			styles: [":host{width:100%}\n"],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridCellContainerComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-dg-cell-container",
			standalone: false,
			template: `
    @if (!column.columnRenderer) {
      <span [title]="item?.[column.field] ?? null">{{ item?.[column.field] }}</span>
    }
    <ng-template #cellContainer></ng-template>
  `,
			changeDetection: ChangeDetectionStrategy.Eager,
			styles: [":host{width:100%}\n"]
		}]
	}],
	propDecorators: {
		container: [{
			type: ViewChild,
			args: ["cellContainer", {
				read: ViewContainerRef,
				static: true
			}]
		}],
		column: [{ type: Input }],
		item: [{ type: Input }]
	}
});
var DatagridColumnToggleComponent = class DatagridColumnToggleComponent {
	constructor(dgStrings) {
		this.dgStrings = dgStrings;
		this.layoutClass = "column-switch-wrapper";
		this.columnsChange = new EventEmitter();
		this.columnHiddenStateChange = new EventEmitter();
		this.positions = [new ConnectionPositionPair({
			originX: "start",
			originY: "top"
		}, {
			overlayX: "start",
			overlayY: "bottom"
		})];
		this.openState = false;
		this.viewId = signal(void 0, ...ngDevMode ? [{ debugName: "viewId" }] : /* istanbul ignore next */ []);
	}
	get hasOnlyOneVisibleColumn() {
		const hideableColumns = this.hideableColumns();
		return this.columns.length - hideableColumns.length === 0 && hideableColumns.filter((column) => !column.hidden).length === 1;
	}
	ngOnDestroy() {
		this.openState = false;
	}
	onAttach(overlay) {
		this.overlay = overlay;
		this.viewId.set(overlay?.overlayRef?.overlayElement.id);
	}
	onDetach() {
		this.openState = false;
		this.viewId.set(void 0);
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
			column: columnToToggle
		});
	}
	onSelectAll() {
		this.hideableColumns().filter((column) => column.hidden).forEach((column) => this.toggleColumnState(column));
	}
	allColumnsSelected() {
		return this.hideableColumns().filter((column) => column.hidden).length === 0;
	}
	hideableColumns() {
		return this.columns.filter((column) => column.hideable !== false);
	}
	showHideColumn(colUid, hide) {
		const columnToToggle = this.columns.find((col) => col.uid === colUid);
		if (!columnToToggle) return;
		columnToToggle.hidden = hide;
		this.columnsChange.emit([...this.columns]);
		this.columnHiddenStateChange.emit({
			hidden: hide,
			column: columnToToggle
		});
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridColumnToggleComponent,
			deps: [{ token: DatagridStrings }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: DatagridColumnToggleComponent,
			isStandalone: false,
			selector: "appfx-dg-column-toggle",
			inputs: { columns: "columns" },
			outputs: {
				columnsChange: "columnsChange",
				columnHiddenStateChange: "columnHiddenStateChange"
			},
			host: { properties: { "class": "this.layoutClass" } },
			viewQueries: [{
				propertyName: "closeColumnButtonElement",
				first: true,
				predicate: ["closeColumnButton"],
				descendants: true,
				read: ElementRef
			}],
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<button\n  cdkOverlayOrigin\n  #trigger=\"cdkOverlayOrigin\"\n  role=\"button\"\n  type=\"button\"\n  class=\"btn btn-sm btn-link column-toggle-action\"\n  (click)=\"openState = !openState\"\n  [attr.aria-owns]=\"viewId()\"\n  [attr.aria-controls]=\"viewId()\"\n  [attr.aria-expanded]=\"openState\"\n>\n  {{ dgStrings.pickColumns }}\n</button>\n<ng-template\n  cdkConnectedOverlay\n  #overlay=\"cdkConnectedOverlay\"\n  [cdkConnectedOverlayOrigin]=\"trigger\"\n  [cdkConnectedOverlayOpen]=\"openState\"\n  [cdkConnectedOverlayHasBackdrop]=\"true\"\n  [cdkConnectedOverlayPositions]=\"positions\"\n  cdkConnectedOverlayBackdropClass=\"cdk-overlay-transparent-backdrop\"\n  (detach)=\"onDetach()\"\n  (attach)=\"onAttach(overlay)\"\n  (backdropClick)=\"openState = false\"\n>\n  <div\n    class=\"column-switch\"\n    role=\"dialog\"\n    cdkTrapFocus\n    [cdkTrapFocusAutoCapture]=\"true\"\n    [attr.aria-label]=\"dgStrings.showColumnsMenuDescription\"\n    tabindex=\"-1\"\n  >\n    <div class=\"switch-header\">\n      <div class=\"clr-sr-only\">\n        {{ dgStrings.allColumnsSelected }}\n      </div>\n      <span role=\"heading\" aria-level=\"3\">{{ dgStrings.showColumns }}</span>\n      <button\n        class=\"btn btn-sm btn-link\"\n        cdkFocusInitial\n        cdkFocusRegionStart\n        (click)=\"openState = false\"\n        #closeColumnButton\n      >\n        <span class=\"clr-sr-only\">{{ dgStrings.closeColumnTogglerText }}</span>\n        <cds-icon shape=\"window-close\"></cds-icon>\n      </button>\n    </div>\n    <ul class=\"switch-content list-unstyled\" tabindex=\"-1\">\n      @for (column of hideableColumns(); track column) {\n        <li>\n          <clr-checkbox-wrapper>\n            <input\n              type=\"checkbox\"\n              clrCheckbox\n              [disabled]=\"hasOnlyOneVisibleColumn && !column.hidden\"\n              [checked]=\"!column.hidden\"\n              (change)=\"toggleColumnState(column, $event)\"\n            />\n            <label>{{ column.displayName }}</label>\n          </clr-checkbox-wrapper>\n        </li>\n      }\n    </ul>\n    <div class=\"switch-footer\">\n      <button\n        class=\"btn btn-sm btn-link switch-button export-link\"\n        type=\"button\"\n        cdkFocusRegionEnd\n        [disabled]=\"allColumnsSelected()\"\n        (click)=\"onSelectAll()\"\n      >\n        {{ dgStrings.selectAll }}\n      </button>\n    </div>\n  </div>\n</ng-template>\n",
			styles: ["::ng-deep .cdk-overlay-container,::ng-deep .cdk-global-overlay-wrapper{pointer-events:none;top:0;left:0;height:100%;width:100%}::ng-deep .cdk-overlay-container{position:fixed;z-index:1000}::ng-deep .cdk-overlay-container:empty{display:none}::ng-deep .cdk-global-overlay-wrapper{display:flex;position:absolute;z-index:1000}::ng-deep .cdk-overlay-pane{position:absolute;pointer-events:auto;box-sizing:border-box;z-index:1000;display:flex;max-width:100%;max-height:100%}::ng-deep .cdk-overlay-backdrop{position:absolute;inset:0;z-index:1000;pointer-events:auto;-webkit-tap-highlight-color:rgba(0,0,0,0);transition:opacity .4s cubic-bezier(.25,.8,.25,1);opacity:0}::ng-deep .cdk-overlay-backdrop.cdk-overlay-backdrop-showing{opacity:1}::ng-deep .cdk-high-contrast-active .cdk-overlay-backdrop.cdk-overlay-backdrop-showing{opacity:.6}::ng-deep .cdk-overlay-dark-backdrop{background:#00000052}::ng-deep .cdk-overlay-transparent-backdrop{transition:visibility 1ms linear,opacity 1ms linear;visibility:hidden;opacity:1}::ng-deep .cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing{opacity:0;visibility:visible}::ng-deep .cdk-overlay-backdrop-noop-animation{transition:none}::ng-deep .cdk-overlay-connected-position-bounding-box{position:absolute;z-index:1000;display:flex;flex-direction:column;min-width:1px;min-height:1px}::ng-deep .cdk-global-scrollblock{position:fixed;width:100%;overflow-y:scroll}\n"],
			dependencies: [
				{
					kind: "directive",
					type: i2.CdkTrapFocus,
					selector: "[cdkTrapFocus]",
					inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"],
					exportAs: ["cdkTrapFocus"]
				},
				{
					kind: "directive",
					type: i3$1.CdkConnectedOverlay,
					selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]",
					inputs: [
						"cdkConnectedOverlayOrigin",
						"cdkConnectedOverlayPositions",
						"cdkConnectedOverlayPositionStrategy",
						"cdkConnectedOverlayOffsetX",
						"cdkConnectedOverlayOffsetY",
						"cdkConnectedOverlayWidth",
						"cdkConnectedOverlayHeight",
						"cdkConnectedOverlayMinWidth",
						"cdkConnectedOverlayMinHeight",
						"cdkConnectedOverlayBackdropClass",
						"cdkConnectedOverlayPanelClass",
						"cdkConnectedOverlayViewportMargin",
						"cdkConnectedOverlayScrollStrategy",
						"cdkConnectedOverlayOpen",
						"cdkConnectedOverlayDisableClose",
						"cdkConnectedOverlayTransformOriginOn",
						"cdkConnectedOverlayHasBackdrop",
						"cdkConnectedOverlayLockPosition",
						"cdkConnectedOverlayFlexibleDimensions",
						"cdkConnectedOverlayGrowAfterOpen",
						"cdkConnectedOverlayPush",
						"cdkConnectedOverlayDisposeOnNavigation",
						"cdkConnectedOverlayUsePopover",
						"cdkConnectedOverlayMatchWidth",
						"cdkConnectedOverlay"
					],
					outputs: [
						"backdropClick",
						"positionChange",
						"attach",
						"detach",
						"overlayKeydown",
						"overlayOutsideClick"
					],
					exportAs: ["cdkConnectedOverlay"]
				},
				{
					kind: "directive",
					type: i3$1.CdkOverlayOrigin,
					selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]",
					exportAs: ["cdkOverlayOrigin"]
				},
				{
					kind: "directive",
					type: i4.ClrControlLabel,
					selector: "label",
					inputs: ["id", "for"]
				},
				{
					kind: "component",
					type: i2$1.ClrIcon,
					selector: "clr-icon, cds-icon",
					inputs: [
						"shape",
						"size",
						"direction",
						"flip",
						"solid",
						"status",
						"inverse",
						"badge",
						"innerOffset"
					]
				},
				{
					kind: "directive",
					type: i3$2.ClrCheckbox,
					selector: "[clrCheckbox],[clrToggle]"
				},
				{
					kind: "component",
					type: i3$2.ClrCheckboxWrapper,
					selector: "clr-checkbox-wrapper,clr-toggle-wrapper"
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridColumnToggleComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-dg-column-toggle",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<button\n  cdkOverlayOrigin\n  #trigger=\"cdkOverlayOrigin\"\n  role=\"button\"\n  type=\"button\"\n  class=\"btn btn-sm btn-link column-toggle-action\"\n  (click)=\"openState = !openState\"\n  [attr.aria-owns]=\"viewId()\"\n  [attr.aria-controls]=\"viewId()\"\n  [attr.aria-expanded]=\"openState\"\n>\n  {{ dgStrings.pickColumns }}\n</button>\n<ng-template\n  cdkConnectedOverlay\n  #overlay=\"cdkConnectedOverlay\"\n  [cdkConnectedOverlayOrigin]=\"trigger\"\n  [cdkConnectedOverlayOpen]=\"openState\"\n  [cdkConnectedOverlayHasBackdrop]=\"true\"\n  [cdkConnectedOverlayPositions]=\"positions\"\n  cdkConnectedOverlayBackdropClass=\"cdk-overlay-transparent-backdrop\"\n  (detach)=\"onDetach()\"\n  (attach)=\"onAttach(overlay)\"\n  (backdropClick)=\"openState = false\"\n>\n  <div\n    class=\"column-switch\"\n    role=\"dialog\"\n    cdkTrapFocus\n    [cdkTrapFocusAutoCapture]=\"true\"\n    [attr.aria-label]=\"dgStrings.showColumnsMenuDescription\"\n    tabindex=\"-1\"\n  >\n    <div class=\"switch-header\">\n      <div class=\"clr-sr-only\">\n        {{ dgStrings.allColumnsSelected }}\n      </div>\n      <span role=\"heading\" aria-level=\"3\">{{ dgStrings.showColumns }}</span>\n      <button\n        class=\"btn btn-sm btn-link\"\n        cdkFocusInitial\n        cdkFocusRegionStart\n        (click)=\"openState = false\"\n        #closeColumnButton\n      >\n        <span class=\"clr-sr-only\">{{ dgStrings.closeColumnTogglerText }}</span>\n        <cds-icon shape=\"window-close\"></cds-icon>\n      </button>\n    </div>\n    <ul class=\"switch-content list-unstyled\" tabindex=\"-1\">\n      @for (column of hideableColumns(); track column) {\n        <li>\n          <clr-checkbox-wrapper>\n            <input\n              type=\"checkbox\"\n              clrCheckbox\n              [disabled]=\"hasOnlyOneVisibleColumn && !column.hidden\"\n              [checked]=\"!column.hidden\"\n              (change)=\"toggleColumnState(column, $event)\"\n            />\n            <label>{{ column.displayName }}</label>\n          </clr-checkbox-wrapper>\n        </li>\n      }\n    </ul>\n    <div class=\"switch-footer\">\n      <button\n        class=\"btn btn-sm btn-link switch-button export-link\"\n        type=\"button\"\n        cdkFocusRegionEnd\n        [disabled]=\"allColumnsSelected()\"\n        (click)=\"onSelectAll()\"\n      >\n        {{ dgStrings.selectAll }}\n      </button>\n    </div>\n  </div>\n</ng-template>\n",
			styles: ["::ng-deep .cdk-overlay-container,::ng-deep .cdk-global-overlay-wrapper{pointer-events:none;top:0;left:0;height:100%;width:100%}::ng-deep .cdk-overlay-container{position:fixed;z-index:1000}::ng-deep .cdk-overlay-container:empty{display:none}::ng-deep .cdk-global-overlay-wrapper{display:flex;position:absolute;z-index:1000}::ng-deep .cdk-overlay-pane{position:absolute;pointer-events:auto;box-sizing:border-box;z-index:1000;display:flex;max-width:100%;max-height:100%}::ng-deep .cdk-overlay-backdrop{position:absolute;inset:0;z-index:1000;pointer-events:auto;-webkit-tap-highlight-color:rgba(0,0,0,0);transition:opacity .4s cubic-bezier(.25,.8,.25,1);opacity:0}::ng-deep .cdk-overlay-backdrop.cdk-overlay-backdrop-showing{opacity:1}::ng-deep .cdk-high-contrast-active .cdk-overlay-backdrop.cdk-overlay-backdrop-showing{opacity:.6}::ng-deep .cdk-overlay-dark-backdrop{background:#00000052}::ng-deep .cdk-overlay-transparent-backdrop{transition:visibility 1ms linear,opacity 1ms linear;visibility:hidden;opacity:1}::ng-deep .cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing{opacity:0;visibility:visible}::ng-deep .cdk-overlay-backdrop-noop-animation{transition:none}::ng-deep .cdk-overlay-connected-position-bounding-box{position:absolute;z-index:1000;display:flex;flex-direction:column;min-width:1px;min-height:1px}::ng-deep .cdk-global-scrollblock{position:fixed;width:100%;overflow-y:scroll}\n"]
		}]
	}],
	ctorParameters: () => [{ type: DatagridStrings }],
	propDecorators: {
		layoutClass: [{
			type: HostBinding,
			args: ["class"]
		}],
		closeColumnButtonElement: [{
			type: ViewChild,
			args: ["closeColumnButton", { read: ElementRef }]
		}],
		columns: [{ type: Input }],
		columnsChange: [{ type: Output }],
		columnHiddenStateChange: [{ type: Output }]
	}
});
var DatagridFilterContainerComponent = class DatagridFilterContainerComponent {
	constructor(filterContainer) {
		this.filterContainer = filterContainer;
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
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridFilterContainerComponent,
			deps: [{ token: i1.ClrDatagridFilter }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: DatagridFilterContainerComponent,
			isStandalone: false,
			selector: "appfx-dg-filter-container",
			inputs: {
				filterType: "filterType",
				filterValue: "filterValue"
			},
			outputs: { filterValueChange: "filterValueChange" },
			viewQueries: [{
				propertyName: "container",
				first: true,
				predicate: ["filterContainer"],
				descendants: true,
				read: ViewContainerRef,
				static: true
			}],
			ngImport: i0,
			template: ` <ng-template #filterContainer></ng-template>`,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridFilterContainerComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-dg-filter-container",
			standalone: false,
			template: ` <ng-template #filterContainer></ng-template>`,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [{ type: i1.ClrDatagridFilter }],
	propDecorators: {
		container: [{
			type: ViewChild,
			args: ["filterContainer", {
				read: ViewContainerRef,
				static: true
			}]
		}],
		filterType: [{ type: Input }],
		filterValue: [{ type: Input }],
		filterValueChange: [{ type: Output }]
	}
});
var ExportDatagridComponent = class ExportDatagridComponent {
	constructor(dgStrings) {
		this.dgStrings = dgStrings;
		this.allItemsCount = 0;
		this.filteredItemsCount = 0;
		this.selectedItemsCount = 0;
		this.exportEventEmitter = new EventEmitter();
		this.exportStatus = {
			inProgress: false,
			exportType: ExportType.ALL
		};
		this.exportType = ExportType;
	}
	exportAllIfOnlyOption() {
		if (this.selectedItemsCount === 0 && this.filteredItemsCount === 0) {
			this.exportStatus.exportType = this.exportType.ALL;
			this.exportEventEmitter.emit(this.exportStatus);
		} else {
			this.allRowsCount = "";
			this.selectedRowsCount = "";
			this.matchedFilterRowsCount = "";
			if (this.allItemsCount) this.allRowsCount = `(${this.allItemsCount})`;
			else this.allRowsCount = `(0)`;
			if (this.filteredItemsCount) this.matchedFilterRowsCount = `(${this.filteredItemsCount})`;
			else this.matchedFilterRowsCount = `(0)`;
			if (this.selectedItemsCount) this.selectedRowsCount = `(${this.selectedItemsCount})`;
			else this.selectedRowsCount = `(0)`;
		}
	}
	onExportClick(exportType) {
		this.exportStatus.exportType = exportType;
		this.exportEventEmitter.emit(this.exportStatus);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ExportDatagridComponent,
			deps: [{ token: DatagridStrings }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ExportDatagridComponent,
			isStandalone: false,
			selector: "appfx-dg-export",
			inputs: {
				allItemsCount: "allItemsCount",
				filteredItemsCount: "filteredItemsCount",
				selectedItemsCount: "selectedItemsCount"
			},
			outputs: { exportEventEmitter: "exportEventEmitter" },
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n@if (selectedItemsCount > 0 || filteredItemsCount > 0) {\n  <clr-dropdown class=\"column-switch-wrapper\">\n    <button\n      data-test-id=\"export-link\"\n      type=\"button\"\n      class=\"column-toggle-action btn btn-sm btn-link\"\n      [clrLoading]=\"exportStatus.inProgress || false\"\n      [disabled]=\"!(allItemsCount > 0)\"\n      (click)=\"exportAllIfOnlyOption()\"\n      clrDropdownTrigger\n    >\n      {{ dgStrings.exportLink }}\n      @if (selectedItemsCount > 0 || filteredItemsCount > 0) {\n        <cds-icon shape=\"angle\" direction=\"down\"></cds-icon>\n      }\n    </button>\n    <clr-dropdown-menu class=\"export-dropdown\" clrPosition=\"top-left\" *clrIfOpen>\n      @if (selectedItemsCount > 0 || filteredItemsCount > 0) {\n        <button type=\"button\" clrDropdownItem (click)=\"onExportClick(exportType.ALL)\">\n          {{ dgStrings.exportAll }} {{ allRowsCount }}\n        </button>\n      }\n      @if (filteredItemsCount > 0) {\n        <button type=\"button\" clrDropdownItem (click)=\"onExportClick(exportType.MATCHING_FILTERS)\">\n          {{ dgStrings.exportMatchingFilters }}\n          {{ matchedFilterRowsCount }}\n        </button>\n      }\n      @if (selectedItemsCount > 0) {\n        <button type=\"button\" clrDropdownItem (click)=\"onExportClick(exportType.SELECTED_ONLY)\">\n          {{ dgStrings.exportSelectedRows }} {{ selectedRowsCount }}\n        </button>\n      }\n    </clr-dropdown-menu>\n  </clr-dropdown>\n} @else {\n  <div class=\"column-switch-wrapper\">\n    <button\n      data-test-id=\"export-link\"\n      type=\"button\"\n      class=\"column-toggle-action btn btn-sm btn-link\"\n      [clrLoading]=\"exportStatus.inProgress || false\"\n      [disabled]=\"!(allItemsCount > 0)\"\n      (click)=\"exportAllIfOnlyOption()\"\n    >\n      {{ dgStrings.exportLink }}\n    </button>\n  </div>\n}\n",
			styles: [".export-dropdown{max-width:12rem}\n"],
			dependencies: [
				{
					kind: "component",
					type: i2$1.ClrIcon,
					selector: "clr-icon, cds-icon",
					inputs: [
						"shape",
						"size",
						"direction",
						"flip",
						"solid",
						"status",
						"inverse",
						"badge",
						"innerOffset"
					]
				},
				{
					kind: "component",
					type: i3$3.ClrDropdown,
					selector: "clr-dropdown",
					inputs: ["clrCloseMenuOnItemClick"]
				},
				{
					kind: "component",
					type: i3$3.ClrDropdownMenu,
					selector: "clr-dropdown-menu",
					inputs: ["clrPosition"]
				},
				{
					kind: "directive",
					type: i3$3.ClrDropdownTrigger,
					selector: "[clrDropdownTrigger],[clrDropdownToggle]"
				},
				{
					kind: "directive",
					type: i3$3.ClrDropdownItem,
					selector: "[clrDropdownItem]",
					inputs: [
						"role",
						"clrDisabled",
						"id"
					]
				},
				{
					kind: "directive",
					type: i4$1.ClrIfOpen,
					selector: "[clrIfOpen]",
					inputs: ["clrIfOpen"],
					outputs: ["clrIfOpenChange"]
				},
				{
					kind: "directive",
					type: i5$1.ClrLoading,
					selector: "[clrLoading]",
					inputs: ["clrLoading"]
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ExportDatagridComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-dg-export",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n@if (selectedItemsCount > 0 || filteredItemsCount > 0) {\n  <clr-dropdown class=\"column-switch-wrapper\">\n    <button\n      data-test-id=\"export-link\"\n      type=\"button\"\n      class=\"column-toggle-action btn btn-sm btn-link\"\n      [clrLoading]=\"exportStatus.inProgress || false\"\n      [disabled]=\"!(allItemsCount > 0)\"\n      (click)=\"exportAllIfOnlyOption()\"\n      clrDropdownTrigger\n    >\n      {{ dgStrings.exportLink }}\n      @if (selectedItemsCount > 0 || filteredItemsCount > 0) {\n        <cds-icon shape=\"angle\" direction=\"down\"></cds-icon>\n      }\n    </button>\n    <clr-dropdown-menu class=\"export-dropdown\" clrPosition=\"top-left\" *clrIfOpen>\n      @if (selectedItemsCount > 0 || filteredItemsCount > 0) {\n        <button type=\"button\" clrDropdownItem (click)=\"onExportClick(exportType.ALL)\">\n          {{ dgStrings.exportAll }} {{ allRowsCount }}\n        </button>\n      }\n      @if (filteredItemsCount > 0) {\n        <button type=\"button\" clrDropdownItem (click)=\"onExportClick(exportType.MATCHING_FILTERS)\">\n          {{ dgStrings.exportMatchingFilters }}\n          {{ matchedFilterRowsCount }}\n        </button>\n      }\n      @if (selectedItemsCount > 0) {\n        <button type=\"button\" clrDropdownItem (click)=\"onExportClick(exportType.SELECTED_ONLY)\">\n          {{ dgStrings.exportSelectedRows }} {{ selectedRowsCount }}\n        </button>\n      }\n    </clr-dropdown-menu>\n  </clr-dropdown>\n} @else {\n  <div class=\"column-switch-wrapper\">\n    <button\n      data-test-id=\"export-link\"\n      type=\"button\"\n      class=\"column-toggle-action btn btn-sm btn-link\"\n      [clrLoading]=\"exportStatus.inProgress || false\"\n      [disabled]=\"!(allItemsCount > 0)\"\n      (click)=\"exportAllIfOnlyOption()\"\n    >\n      {{ dgStrings.exportLink }}\n    </button>\n  </div>\n}\n",
			styles: [".export-dropdown{max-width:12rem}\n"]
		}]
	}],
	ctorParameters: () => [{ type: DatagridStrings }],
	propDecorators: {
		allItemsCount: [{ type: Input }],
		filteredItemsCount: [{ type: Input }],
		selectedItemsCount: [{ type: Input }],
		exportEventEmitter: [{ type: Output }]
	}
});
var IsRowSelectablePipe = class IsRowSelectablePipe {
	transform(rowItem, isLocked, disabled) {
		if (disabled) return false;
		if (isLocked) return !isLocked(rowItem);
		return true;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: IsRowSelectablePipe,
			deps: [],
			target: i0.ɵɵFactoryTarget.Pipe
		});
	}
	static {
		this.ɵpipe = i0.ɵɵngDeclarePipe({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: IsRowSelectablePipe,
			isStandalone: false,
			name: "isRowSelectable"
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: IsRowSelectablePipe,
	decorators: [{
		type: Pipe,
		args: [{
			name: "isRowSelectable",
			standalone: false
		}]
	}]
});
var DatagridComponent = class DatagridComponent {
	#defaultActionButtonClass;
	#interpolationExpression;
	#unsubscribeSubject;
	#zoomLevelSubscription;
	#pendingRowNotifications;
	#dgColumns;
	#firstColumn;
	#selectionType;
	#selectedItems;
	#rowSelectionMode;
	#actionBarActions;
	#areRowsDisabled;
	#pageSize;
	#hasAdvancedFilters;
	#wrapCellText;
	constructor(datagridStrings, uid, cdr, exportProviderService, groupService, zoomLevelService) {
		this.uid = uid;
		this.cdr = cdr;
		this.exportProviderService = exportProviderService;
		this.groupService = groupService;
		this.zoomLevelService = zoomLevelService;
		this.searchTerm = "";
		this.draggedItems = [];
		this.loading = false;
		this.loadingMoreItems = false;
		this.preSelectFirstItem = false;
		this.totalItems = 0;
		this.showCustomPagination = false;
		this.serverDrivenDatagrid = false;
		this.listItemsCount = 0;
		this.rowsExpandedByDefault = false;
		this.detailState = null;
		this.detailStateChange = new EventEmitter(true);
		this.filterableProperties = [];
		this.virtualScrolling = false;
		this.disableUnsort = true;
		this.enableColumnActions = false;
		this.dataRange = {
			total: 100,
			skip: 0,
			data: []
		};
		this.pageSizeChange = new EventEmitter();
		this.gridItemsChange = new EventEmitter();
		this.advancedFilterChange = new EventEmitter();
		this.columnDefsChange = new EventEmitter();
		this.selectedItemsChange = new EventEmitter();
		this.exportDataEvent = new EventEmitter();
		this.searchTermChange = new EventEmitter();
		this.columnResize = new EventEmitter();
		this.columnSortOrderChange = new EventEmitter();
		this.columnHiddenStateChange = new EventEmitter();
		this.columnPinnedChange = new EventEmitter();
		this.columnFilterChange = new EventEmitter();
		this.refreshGridData = new EventEmitter();
		this.refreshVirtualGridData = new EventEmitter();
		this.actionClick = new EventEmitter();
		this.rowActionMenuOpenChange = new EventEmitter();
		this.openContextMenu = new EventEmitter();
		this.columnOrderChange = new EventEmitter();
		this.treeExpandedChange = new EventEmitter();
		this.applyFlexLayout = true;
		this.zoomLevel = ZoomLevel.none;
		this.gridLayoutModel = {
			compact: true,
			disabled: false,
			stretchToParentHeight: true
		};
		this.gridFooterModel = {
			showFooter: true,
			hideColumnToggle: false,
			enableCustomExport: false
		};
		this.ColumnMoveDirection = ColumnMoveDirection;
		this.defaultUnsetValue = void 0;
		this.defaultUnsortedOrder = ClrDatagridSortOrder.UNSORTED;
		this.enableSingleRowActions = false;
		this.#defaultActionButtonClass = ActionBarLayout.flatCompact;
		this.#interpolationExpression = /\{(\d+)\}/g;
		this.#unsubscribeSubject = new Subject();
		this.#zoomLevelSubscription = new Subscription();
		this.#pendingRowNotifications = /* @__PURE__ */ new Set();
		this.#selectionType = SelectionType.Single;
		this.#selectedItems = [];
		this.#rowSelectionMode = true;
		this.#actionBarActions = [];
		this.#areRowsDisabled = false;
		this.#pageSize = 0;
		this.#hasAdvancedFilters = false;
		this.#wrapCellText = true;
		this.trackByGridItemFn = (item) => this.trackByFn(0, item || {});
		this.dgStrings = { ...datagridStrings };
	}
	get layoutModel() {
		return { ...this.gridLayoutModel };
	}
	set layoutModel(config) {
		this.gridLayoutModel = {
			...config,
			compact: config?.compact ?? true,
			stretchToParentHeight: config?.stretchToParentHeight ?? true
		};
		this.applyFlexLayout = !!this.gridLayoutModel.stretchToParentHeight;
	}
	get footerModel() {
		return { ...this.gridFooterModel };
	}
	set footerModel(config) {
		this.gridFooterModel = {
			...config,
			showFooter: config?.showFooter ?? true
		};
	}
	get columns() {
		return this.#dgColumns;
	}
	set columns(columns) {
		this.#dgColumns = columns;
		if (columns) {
			if (!this.#firstColumn || !columns.includes(this.#firstColumn)) this.#firstColumn = columns[0];
			const visibleColumns = columns.filter((column) => !column.hidden);
			if (this.needsColumnViewsRebuild(visibleColumns)) this.rebuildColumnViews(visibleColumns);
			else this.visibleColumns = visibleColumns;
			this.columnDefsChange.emit(this.#dgColumns);
		}
		if (this.clrDatagrid.columns) this.clrDatagrid.dataChanged();
	}
	get selectionType() {
		return this.#selectionType;
	}
	set selectionType(type) {
		if (type !== void 0) {
			this.#selectionType = selectionTypeAttribute(type);
			if (this.clrDatagrid) this.initGridSelection();
		}
	}
	get selectedItems() {
		return this.#selectedItems;
	}
	set selectedItems(items) {
		this.#selectedItems = Array.isArray(items) ? items.filter((item) => item !== void 0) : [];
		this.cdr.detectChanges();
	}
	get rowSelectionMode() {
		return this.#selectionType === SelectionType.None ? false : this.#rowSelectionMode;
	}
	set rowSelectionMode(value) {
		this.#rowSelectionMode = value;
	}
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
	get pageSize() {
		return this.#pageSize;
	}
	set pageSize(value) {
		this.#pageSize = value;
		if (value > 0) this.pageSizeChange.emit(this.#pageSize);
	}
	set datagridLabels(overriddenStrings) {
		if (overriddenStrings) for (const key of Object.keys(overriddenStrings)) this.dgStrings[key] = overriddenStrings[key] || "";
	}
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
		return !!this.actionBarActions?.length || this.filterMode !== null && this.filterMode !== void 0;
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
		if (this.searchTerm?.length > 0 || this.#hasAdvancedFilters) filteredItemsCount = this.totalItems;
		return filteredItemsCount;
	}
	ngOnInit() {
		this.initGridSelection();
		this.initTotalItemsCount();
		if (this.zoomLevelService) this.zoomLevelService.onChange.subscribe((v) => this.zoomLevel = v);
	}
	ngAfterViewInit() {
		this.#areRowsDisabled = !!this.gridLayoutModel.disabled;
	}
	ngOnDestroy() {
		this.#pendingRowNotifications.forEach((handle) => clearTimeout(handle));
		this.#pendingRowNotifications.clear();
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
		if (this.#selectionType !== SelectionType.None && !this.isItemSelected(item) && (!this.isRowLocked || !this.isRowLocked(item))) {
			this.#selectedItems = [];
			this.updateSelectedItems(item);
		}
		const targets = this.#selectionType === SelectionType.Multi ? this.#selectedItems : [item];
		$event.preventDefault();
		this.openContextMenu.emit({
			event: $event,
			context: targets
		});
	}
	onColumnOrderChange(data) {
		this.columns = data.columns;
		this.visibleColumns = this.columns.filter((column) => !column.hidden);
		this.cdr.detectChanges();
		this.resize();
		this.columnOrderChange.emit(data);
	}
	renderedRangeChange($event) {
		const currentPageState = { page: {
			size: $event.end - $event.start,
			from: $event.start
		} };
		if ($event.start === 0 && $event.end === 0) return;
		this.refreshVirtualGridData.emit(currentPageState);
		this.cdr.detectChanges();
	}
	reloadTreeChildren(item) {
		this.clrDatagrid.reloadTreeChildren(item);
	}
	expandAllTreeRows() {
		this.clrDatagrid.expandAllTreeRows();
	}
	collapseAllTreeRows() {
		this.clrDatagrid.collapseAllTreeRows();
	}
	scrollToIndex(index, behavior) {
		if (this.virtualScrolling) this.clrDatagrid.virtualScroll.scrollToIndex(index, behavior);
	}
	ngOnChanges(changes) {
		if (changes["gridItems"] && changes["gridItems"].currentValue) {
			this.gridItemsChange.emit(this.gridItems);
			this.preselectDetail();
			if (!this.serverDrivenDatagrid) {
				this.totalItems = this.gridItems.length;
				this.listItemsCount = this.gridItems.length;
			} else if (!changes["gridItems"].isFirstChange() && this.selectionType === SelectionType.Multi) this.notifyOnChanges();
		}
		if (changes["columns"] && Array.isArray(changes["columns"].currentValue) && changes["columns"].currentValue.length) this.cdr.detectChanges();
		if (changes.layoutModel?.currentValue && !changes.layoutModel.isFirstChange()) this.#areRowsDisabled = !!this.gridLayoutModel?.disabled;
		if (changes["singleRowActions"]) this.initActionTypes();
		if ((changes["treeConfig"] || changes["serverDrivenDatagrid"]) && this.treeConfig && !this.serverDrivenDatagrid && isDevMode()) console.warn("appfx-datagrid: treeConfig needs serverDrivenDatagrid; rendering flat rows.");
	}
	trackByColumnId(index, column) {
		return column.uid || column.displayName;
	}
	buildRowDetailContentId(index) {
		return `datagrid-${this.uid}-row-detail-${index}`;
	}
	onAdvancedFilterCriteriaChange(filterCriteria) {
		this.#hasAdvancedFilters = filterCriteria ? filterCriteria.length > 0 : false;
		this.advancedFilterChange.emit(filterCriteria);
	}
	onSelectedItemsChange(selected) {
		this.#selectedItems = selected;
		this.selectedItemsChange.emit(selected);
	}
	getFooterMessage(totalItems, pageSize, firstItem, lastItem) {
		let footer = this.dgStrings.footer;
		if (footer) return this.interpolateMessage(footer, [
			totalItems,
			firstItem,
			lastItem
		]);
		const showRange = pageSize !== void 0 && pageSize > 0 && totalItems > pageSize || lastItem !== void 0 && firstItem !== void 0 && this.virtualScrolling && totalItems > 0 && totalItems > lastItem - firstItem + 1;
		if (totalItems === 1) footer = this.dgStrings.singleItem;
		else if (showRange) footer = this.interpolateMessage(this.dgStrings.pagedItems, [
			totalItems,
			firstItem,
			lastItem
		]);
		else footer = this.interpolateMessage(this.dgStrings.multipleItems, [totalItems]);
		return footer;
	}
	toggleAll() {
		if (this.clrDatagrid) this.clrDatagrid.allSelected = !this.clrDatagrid.allSelected;
	}
	hasTreeToggle(column) {
		const marked = this.columns.some((definition) => definition.treeToggle) ? (definition) => !!definition.treeToggle : (definition) => definition === this.#firstColumn;
		return marked(column) || !this.visibleColumns.some(marked) && column === this.visibleColumns[0];
	}
	getExpandDetailsLabel(item) {
		if (!this.hasExpandableRows(item)) return "";
		const itemName = item[this.visibleColumns?.[0]?.field || ""] || "";
		return this.interpolateMessage(this.dgStrings.expandDetailsPaneLabel, [itemName]);
	}
	getCollapseDetailsLabel(item) {
		if (!this.hasExpandableRows(item)) return "";
		const itemName = item[this.visibleColumns?.[0]?.field || ""] || "";
		return this.interpolateMessage(this.dgStrings.collapseDetailsPaneLabel, [itemName]);
	}
	onColumnResize(columnSize, column) {
		column.width = `${columnSize}px`;
		this.columnResize.emit({
			columnSize,
			column
		});
	}
	onPinnedChange(pinned, column) {
		column.pinned = pinned;
		this.columnPinnedChange.emit({
			pinned,
			column
		});
	}
	onSortOrderChange(sortOrder, column) {
		const columnSortOrder = {
			sortOrder,
			column
		};
		if (this.gridFooterModel?.clientSideExportConfig?.sort) this.gridFooterModel.clientSideExportConfig.sortOrder = columnSortOrder;
		this.columnSortOrderChange.emit(columnSortOrder);
		this.columns.forEach((col) => col.defaultSortOrder = this.defaultUnsortedOrder);
		column.defaultSortOrder = sortOrder;
	}
	onDeselectAllClick() {
		this.#selectedItems = [];
		this.selectedItemsChange.emit(this.#selectedItems);
	}
	onSelectAllInVirtualGrid(isSelect) {
		if (isSelect) {
			const newSelection = [...this.#selectedItems];
			this.dataRange.data.forEach((item) => {
				if (!this.#selectedItems.some((selected) => this.trackByGridItemFn(selected) === this.trackByGridItemFn(item))) newSelection.push(item);
			});
			this.#selectedItems = newSelection;
			this.selectedItemsChange.emit(newSelection);
		} else this.onDeselectAllClick();
	}
	onDragStart(row) {
		this.setDraggedItems(row);
	}
	onDragMove() {
		this.cdr.markForCheck();
	}
	onFilterChange(filterValue, column) {
		column.defaultFilterValue = filterValue;
		this.columnFilterChange.emit({
			filterValue,
			column
		});
	}
	onColumnHiddenStateChange(value) {
		this.columnHiddenStateChange.emit(value);
		if (this.gridItems && this.gridItems.length === 0 && value.hidden === false) {
			this.cdr.detectChanges();
			this.resize();
		}
	}
	refreshGrid(state) {
		if (this.virtualScrolling) return;
		if (state.page && state.page.from === -1) state.page.from = 0;
		if (state.page && state.page.to === -1) state.page.to = 0;
		this.refreshGridData.emit(state);
		if (this.detailState) this.cdr.detectChanges();
	}
	onExportEvent(exportStatus) {
		if (this.footerModel.enableCustomExport || this.footerModel.clientSideExportConfig?.customExport) {
			this.exportDataEvent.emit(exportStatus);
			return;
		}
		if (this.footerModel.clientSideExportConfig) {
			const datagridItemSet = {
				totalDatagridItems: this.gridItems,
				selectedItems: this.selectedItems,
				filteredDatagridItems: []
			};
			this.exportProviderService.exportUIOnlyData(this.footerModel.clientSideExportConfig, exportStatus, datagridItemSet);
		}
	}
	getColumnActions(column) {
		const actions = [...this.columnActions ?? []];
		if (column.actions?.length) actions.push(...column.actions);
		return actions;
	}
	onColumnActionClick(action, column) {
		if (!action.enabled) return;
		this.actionClick.emit({
			action,
			context: column
		});
	}
	onActionClick(action, context) {
		if (!context) context = this.#selectedItems;
		this.actionClick.emit({
			action,
			context
		});
	}
	onRowActionOverflowOpen(open, actions, item) {
		this.rowActionMenuOpenChange.emit({
			open,
			actions,
			context: item
		});
	}
	onAdvancedSearchTermChange(searchTerm) {
		this.searchTerm = searchTerm;
		this.searchTermChange.emit(searchTerm);
	}
	onDetailStateChange(state) {
		if (state !== this.detailState) {
			this.detailState = state;
			this.detailStateChange.emit(state);
		}
	}
	trackByFn(index, gridItem) {
		if (this.trackByGridItemProperty) {
			const result = getNestedProperty(gridItem, this.trackByGridItemProperty);
			if (result.isValid) return result.value;
		}
		if (this.trackByFunction) return this.trackByFunction(index, gridItem);
		return gridItem;
	}
	isItemSelected(item) {
		for (const selectedItem of this.#selectedItems) if (selectedItem === item) return true;
		return false;
	}
	dropGroup(group) {
		return this.groupService?.getGroupItems(group) ?? [];
	}
	needsColumnViewsRebuild(visibleColumns) {
		const rendered = this.visibleColumns || [];
		return !!this.clrDatagrid?.columns && rendered.some((column) => column.pinned) && visibleColumns.some((column) => !rendered.includes(column));
	}
	rebuildColumnViews(visibleColumns) {
		this.visibleColumns = [];
		this.cdr.detectChanges();
		this.visibleColumns = visibleColumns;
		this.cdr.detectChanges();
		this.resize();
	}
	hasExpandableRows(item) {
		return !!this.detailHeader || !!this.detailBody || !!item?.rowDetailRenderer || !!this.rowDetailContent;
	}
	preselectDetail() {
		if ((!!this.detailHeader || !!this.detailBody) && this.detailState && (this.trackByGridItemProperty || this.trackByFunction)) {
			const matchingItems = (this.gridItems || []).filter((item) => {
				return this.trackByGridItemFn(item) === this.trackByGridItemFn(this.detailState);
			});
			if (matchingItems.length === 0) {
				if (!this.treeConfig) this.detailState = null;
			} else {
				this.detailState = matchingItems[0];
				this.cdr.detectChanges();
			}
			this.cdr.markForCheck();
		}
	}
	setDraggedItems(row) {
		this.draggedItems = [];
		if (this.isItemSelected(row)) this.draggedItems.push(...this.#selectedItems);
		else this.draggedItems.push(row);
	}
	notifyOnChanges() {
		if (this.trackByGridItemProperty || this.trackByFunction) {
			const handle = setTimeout(() => {
				this.#pendingRowNotifications.delete(handle);
				this.clrDatagrid?.rows?.notifyOnChanges();
			});
			this.#pendingRowNotifications.add(handle);
		}
	}
	initActionTypes() {
		if (this.singleRowActions) {
			this.enableSingleRowActions = true;
			this.cdr.markForCheck();
		}
	}
	initGridSelection() {
		if (this.clrDatagrid) this.clrDatagrid.identityFn = this.trackByGridItemFn;
		if (this.preSelectFirstItem && this.gridItems && this.gridItems.length > 0) this.#selectedItems = [this.gridItems[0]];
	}
	updateSelectedItems(item) {
		if (this.#selectionType === SelectionType.Single) this.#selectedItems = [item];
		else this.#selectedItems.push(item);
		this.selectedItemsChange.emit(this.#selectedItems);
	}
	initTotalItemsCount() {
		if (!this.footerModel.showFooter || this.serverDrivenDatagrid) return;
		if (this.gridItems && this.gridItems.length > 0) {
			this.totalItems = this.gridItems.length;
			this.cdr.markForCheck();
		}
		this.clrDatagrid.items.change.pipe(filter(() => this.pageSize <= 0), takeUntil(this.#unsubscribeSubject)).subscribe((value) => {
			this.totalItems = value.length;
		});
	}
	interpolateMessage(message, parameters) {
		return message.replace(this.#interpolationExpression, (match, index) => {
			if (index >= parameters.length) return match;
			return String(parameters[index]);
		});
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridComponent,
			deps: [
				{ token: DatagridStrings },
				{ token: uniqueIdToken },
				{ token: i0.ChangeDetectorRef },
				{ token: ExportProviderService },
				{
					token: i3.DragAndDropGroupService,
					optional: true
				},
				{
					token: i1$2.ZoomLevelService,
					optional: true
				}
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: DatagridComponent,
			isStandalone: false,
			selector: "appfx-datagrid",
			inputs: {
				loading: "loading",
				loadingMoreItems: "loadingMoreItems",
				preSelectFirstItem: "preSelectFirstItem",
				pageSizeOptions: "pageSizeOptions",
				totalItems: "totalItems",
				showCustomPagination: "showCustomPagination",
				serverDrivenDatagrid: "serverDrivenDatagrid",
				listItemsCount: "listItemsCount",
				rowDetailContent: "rowDetailContent",
				rowsExpandedByDefault: "rowsExpandedByDefault",
				trackByFunction: "trackByFunction",
				trackByGridItemProperty: "trackByGridItemProperty",
				detailHeader: "detailHeader",
				detailBody: "detailBody",
				detailState: "detailState",
				isRowLocked: "isRowLocked",
				dragConfig: "dragConfig",
				filterableProperties: "filterableProperties",
				filterMode: "filterMode",
				singleRowActions: "singleRowActions",
				preserveExistingSelectionOnFilter: "preserveExistingSelectionOnFilter",
				virtualScrolling: "virtualScrolling",
				disableUnsort: "disableUnsort",
				enableColumnActions: "enableColumnActions",
				columnActions: "columnActions",
				dataRange: "dataRange",
				gridItems: "gridItems",
				treeConfig: "treeConfig",
				layoutModel: "layoutModel",
				footerModel: "footerModel",
				columns: "columns",
				selectionType: "selectionType",
				selectedItems: "selectedItems",
				rowSelectionMode: "rowSelectionMode",
				actionBarActions: "actionBarActions",
				pageSize: "pageSize",
				datagridLabels: "datagridLabels"
			},
			outputs: {
				detailStateChange: "detailStateChange",
				pageSizeChange: "pageSizeChange",
				gridItemsChange: "gridItemsChange",
				advancedFilterChange: "advancedFilterChange",
				columnDefsChange: "columnDefsChange",
				selectedItemsChange: "selectedItemsChange",
				exportDataEvent: "exportDataEvent",
				searchTermChange: "searchTermChange",
				columnResize: "columnResize",
				columnSortOrderChange: "columnSortOrderChange",
				columnHiddenStateChange: "columnHiddenStateChange",
				columnPinnedChange: "columnPinnedChange",
				columnFilterChange: "columnFilterChange",
				refreshGridData: "refreshGridData",
				refreshVirtualGridData: "refreshVirtualGridData",
				actionClick: "actionClick",
				rowActionMenuOpenChange: "rowActionMenuOpenChange",
				openContextMenu: "openContextMenu",
				columnOrderChange: "columnOrderChange",
				treeExpandedChange: "treeExpandedChange"
			},
			host: { properties: {
				"class.embedded-flex-component": "this.applyFlexLayout",
				"class": "this.zoomLevel"
			} },
			providers: [
				ExportProviderService,
				uniqueIdProvider,
				{
					provide: appfxPreselectableComponentToken,
					useExisting: forwardRef(() => DatagridComponent)
				}
			],
			viewQueries: [{
				propertyName: "clrDatagridPagination",
				first: true,
				predicate: ClrDatagridPagination,
				descendants: true
			}, {
				propertyName: "clrDatagrid",
				first: true,
				predicate: ClrDatagrid,
				descendants: true,
				static: true
			}],
			usesOnChanges: true,
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-datagrid\n  zoomLevelIndicator\n  [clrDgDisablePageFocus]=\"true\"\n  [clrDgPreserveSelection]=\"preserveExistingSelectionOnFilter\"\n  [clrDgSelectionType]=\"selectionType\"\n  [clrDgSelected]=\"selectedItems\"\n  [clrDgItemsIdentityFn]=\"trackByGridItemFn\"\n  (clrDgRefresh)=\"refreshGrid($event)\"\n  [clrDgLoading]=\"loading\"\n  [clrLoadingMoreItems]=\"loadingMoreItems\"\n  [clrDgRowSelection]=\"rowSelectionMode\"\n  [ngClass]=\"{\n    'disabled-grid': gridLayoutModel.disabled,\n    'datagrid-compact': gridLayoutModel.compact,\n    'flex-clr-datagrid': gridLayoutModel.stretchToParentHeight,\n    'datagrid-overflow-ellipsis': virtualScrolling || !wrapText,\n  }\"\n  cdkDropList\n  [cdkDropListAutoScrollStep]=\"5\"\n  appfxDgColumnsOrder\n  [clrDgCustomSelectAllEnabled]=\"virtualScrolling\"\n  (clrDgCustomSelectAll)=\"onSelectAllInVirtualGrid($event)\"\n  [dgColumnsOrderColumns]=\"columns\"\n  [dgColumnsVirtualScrolling]=\"virtualScrolling\"\n  (dgColumnsOrderChange)=\"onColumnOrderChange($event)\"\n  (clrDgSelectedChange)=\"onSelectedItemsChange($event)\"\n>\n  <clr-dg-action-bar *ngIf=\"enableToolBar\">\n    @if (!!actionBarActions.length) {\n      <div class=\"appfx-datagrid-actions-container\">\n        <appfx-datagrid-action-bar\n          class=\"action-bar\"\n          (invokeAction)=\"onActionClick($event)\"\n          [actions]=\"actionBarActions\"\n        >\n        </appfx-datagrid-action-bar>\n      </div>\n    }\n    @if (filterMode !== undefined && filterMode !== null) {\n      <appfx-datagrid-filters\n        [filterMode]=\"filterMode\"\n        [filterableProperties]=\"filterableProperties\"\n        (searchTermChange)=\"onAdvancedSearchTermChange($event)\"\n        (propertyFiltersChange)=\"onAdvancedFilterCriteriaChange($event)\"\n      >\n      </appfx-datagrid-filters>\n    }\n  </clr-dg-action-bar>\n  @if (dragConfig) {\n    <clr-dg-column class=\"draggableCell\" [style.width.px]=\"20\"></clr-dg-column>\n  }\n  @for (column of visibleColumns; track trackByColumnId(index, column); let index = $index) {\n    <clr-dg-column\n      cdkDrag\n      [cdkDragLockAxis]=\"'x'\"\n      [cdkDragData]=\"column\"\n      [cdkDragDisabled]=\"!!column.pinned\"\n      appfxColumnOrder\n      [columnData]=\"column\"\n      [columnIndex]=\"index\"\n      [style]=\"column.width ? { width: column.width } : null\"\n      (clrDgColumnResize)=\"onColumnResize($event, column)\"\n      [clrDgField]=\"column.sortAndFilterByField || defaultUnsetValue\"\n      [clrDgSortBy]=\"column.sortComparator || defaultUnsetValue\"\n      [clrDgSortOrder]=\"column.defaultSortOrder || defaultUnsortedOrder\"\n      (clrDgSortOrderChange)=\"onSortOrderChange($event, column)\"\n      [clrDgDisableUnsort]=\"column.disableUnsort ?? disableUnsort\"\n      [clrDgPinnable]=\"!!column.pinnable\"\n      [clrDgPinned]=\"!!column.pinned\"\n      [clrDgTreeToggle]=\"!!treeConfig && hasTreeToggle(column)\"\n      (clrDgPinnedChange)=\"onPinnedChange($event, column)\"\n    >\n      <clr-dg-filter\n        *ngIf=\"column.stringFilter || column.sortAndFilterByField\"\n        [clrDgFilter]=\"appfxDatagridStringFilter\"\n      >\n        <appfx-datagrid-filter\n          #appfxDatagridStringFilter\n          [stringFilterType]=\"column.stringFilter\"\n          [filterValue]=\"column.defaultFilterValue\"\n          [fieldName]=\"column.sortAndFilterByField\"\n          (filterValueChange)=\"onFilterChange($event, column)\"\n        ></appfx-datagrid-filter>\n      </clr-dg-filter>\n      <clr-dg-filter *ngIf=\"column.filter\">\n        <appfx-dg-filter-container\n          [filterType]=\"column.filter\"\n          [filterValue]=\"column.defaultFilterValue\"\n          (filterValueChange)=\"onFilterChange($event, column)\"\n        ></appfx-dg-filter-container>\n      </clr-dg-filter>\n      {{ column.displayName }}\n      @if (enableColumnActions) {\n        <!--\n          clrDgKeepFilterInHeader keeps the existing filter toggle in the header rather than moving\n          it into this menu - appfx-datagrid already shipped that toggle, and existing consumers and\n          tests expect it to stay there. The menu gives up its own filter action in exchange, so a\n          column offers one way to reach its filter rather than two.\n        -->\n        <clr-dg-column-actions [clrDgKeepFilterInHeader]=\"true\">\n          @if (column.sortComparator || column.sortAndFilterByField || column.pinnable) {\n            <div class=\"dropdown-divider\" role=\"separator\"></div>\n          }\n          <button\n            type=\"button\"\n            clrDgColumnAction\n            [clrCanClosePopover]=\"false\"\n            [appfxColumnMoveAction]=\"ColumnMoveDirection.Left\"\n            #moveLeft=\"appfxColumnMoveAction\"\n            [columnIndex]=\"index\"\n            [clrDisabled]=\"moveLeft.disabled\"\n          >\n            <cds-icon shape=\"angle\" direction=\"left\" aria-hidden=\"true\"></cds-icon>\n            {{ dgStrings.moveColumnLeft }}\n          </button>\n          <button\n            type=\"button\"\n            clrDgColumnAction\n            [clrCanClosePopover]=\"false\"\n            [appfxColumnMoveAction]=\"ColumnMoveDirection.Right\"\n            #moveRight=\"appfxColumnMoveAction\"\n            [columnIndex]=\"index\"\n            [clrDisabled]=\"moveRight.disabled\"\n          >\n            <cds-icon shape=\"angle\" direction=\"right\" aria-hidden=\"true\"></cds-icon>\n            {{ dgStrings.moveColumnRight }}\n          </button>\n          @let customColumnActions = getColumnActions(column);\n          @if (customColumnActions.length) {\n            <div class=\"dropdown-divider\" role=\"separator\"></div>\n            <!--\n              Application actions come last, so the built-in ones keep the same place in every menu\n              whatever a column adds. clrCanClosePopover is left at its default, so these close the\n              menu on click - unlike the move actions, they are not expected to be repeated.\n            -->\n            @for (action of customColumnActions; track action) {\n              <!-- An action with children opens them as a nested menu, the same as in the action bar. -->\n              @if (action.children) {\n                <clr-dropdown>\n                  <button\n                    type=\"button\"\n                    clrDropdownTrigger\n                    [disabled]=\"!action.enabled\"\n                    [attr.aria-label]=\"action.ariaLabel\"\n                    [attr.title]=\"action.tooltip\"\n                  >\n                    @if (action.icon) {\n                      <cds-icon [shape]=\"action.icon\" aria-hidden=\"true\"></cds-icon>\n                    }\n                    {{ action.label }}\n                  </button>\n                  <clr-dropdown-menu *clrIfOpen>\n                    @for (childAction of action.children; track childAction) {\n                      <button\n                        type=\"button\"\n                        clrDropdownItem\n                        [clrDisabled]=\"!childAction.enabled\"\n                        [attr.aria-label]=\"childAction.ariaLabel\"\n                        [attr.title]=\"childAction.tooltip\"\n                        (click)=\"onColumnActionClick(childAction, column)\"\n                      >\n                        @if (childAction.icon) {\n                          <cds-icon [shape]=\"childAction.icon\" aria-hidden=\"true\"></cds-icon>\n                        }\n                        {{ childAction.label }}\n                      </button>\n                    }\n                  </clr-dropdown-menu>\n                </clr-dropdown>\n              } @else {\n                <button\n                  type=\"button\"\n                  clrDgColumnAction\n                  [clrDisabled]=\"!action.enabled\"\n                  [attr.aria-label]=\"action.ariaLabel\"\n                  [attr.title]=\"action.tooltip\"\n                  (click)=\"onColumnActionClick(action, column)\"\n                >\n                  @if (action.icon) {\n                    <cds-icon [shape]=\"action.icon\" aria-hidden=\"true\"></cds-icon>\n                  }\n                  {{ action.label }}\n                </button>\n              }\n            }\n          }\n        </clr-dg-column-actions>\n      }\n    </clr-dg-column>\n  }\n  <clr-dg-placeholder>\n    {{ dgStrings.noItemsFound }}\n    <ng-content select=\".custom-placeholder-content\"></ng-content>\n  </clr-dg-placeholder>\n\n  <!-- Server driven tree datagrid with virtual scrolling. The data range is a range of roots. -->\n  @if (serverDrivenDatagrid && virtualScrolling && treeConfig) {\n    <ng-template\n      ClrVirtualScroll\n      let-item\n      [clrVirtualTreeDataRange]=\"dataRange\"\n      [clrVirtualTreeGetChildren]=\"treeConfig.getChildren\"\n      [clrVirtualTreeCascadeSelection]=\"!!treeConfig.cascadeSelection\"\n      [clrVirtualRowsItemSize]=\"25\"\n      [clrVirtualRowsMinBufferPx]=\"400\"\n      [clrVirtualRowsMaxBufferPx]=\"800\"\n      [clrVirtualRowsTemplateCacheSize]=\"400\"\n      [clrVirtualRowsTrackBy]=\"trackByFunction\"\n      (clrVirtualTreeRenderedRootsChange)=\"renderedRangeChange($event)\"\n    >\n      <clr-dg-row\n        [clrDgItem]=\"item\"\n        [clrDgTreeExpandable]=\"!!item && (!treeConfig.hasChildren || treeConfig.hasChildren(item))\"\n        (clrDgExpandedChange)=\"treeExpandedChange.emit({ item: item, expanded: $event })\"\n        [clrDgSelectable]=\"item | isRowSelectable: isRowLocked : rowsDisabled\"\n        [clrDgRowSelectionLabel]=\"\n          $any(item)?.[visibleColumns && visibleColumns.length ? visibleColumns[0].field : -1] ?? null\n        \"\n        (contextmenu)=\"onContextMenu($event, item)\"\n        [clrDgSkeletonLoading]=\"!item\"\n      >\n        @if (dragConfig) {\n          <clr-dg-cell class=\"draggableCell\" [style.width.px]=\"20\">\n            <ng-container *ngTemplateOutlet=\"draggableCell; context: { $implicit: item }\"> </ng-container>\n          </clr-dg-cell>\n        }\n        @for (column of visibleColumns; track column) {\n          <clr-dg-cell class=\"fixed-cell-height\">\n            <appfx-dg-cell-container [column]=\"column\" [item]=\"item\"></appfx-dg-cell-container>\n          </clr-dg-cell>\n        }\n      </clr-dg-row>\n    </ng-template>\n  }\n\n  <!-- Server driven datagrid with virtual scrolling -->\n  @if (serverDrivenDatagrid && virtualScrolling && !treeConfig) {\n    <ng-template\n      ClrVirtualScroll\n      let-item\n      let-i=\"index\"\n      [clrVirtualDataRange]=\"dataRange\"\n      [clrVirtualRowsItemSize]=\"25\"\n      [clrVirtualRowsMinBufferPx]=\"400\"\n      [clrVirtualRowsMaxBufferPx]=\"800\"\n      [clrVirtualRowsTemplateCacheSize]=\"400\"\n      [clrVirtualPersistItems]=\"false\"\n      [clrVirtualRowsTrackBy]=\"trackByFunction\"\n      (renderedRangeChange)=\"renderedRangeChange($event)\"\n    >\n      <clr-dg-row\n        [clrDgItem]=\"item\"\n        [clrDgSelectable]=\"item | isRowSelectable: isRowLocked : rowsDisabled\"\n        [clrDgRowSelectionLabel]=\"\n          $any(item)?.[visibleColumns && visibleColumns.length ? visibleColumns[0].field : -1] ?? null\n        \"\n        (contextmenu)=\"onContextMenu($event, item)\"\n        [clrDgSkeletonLoading]=\"!item\"\n      >\n        @if (dragConfig) {\n          <clr-dg-cell class=\"draggableCell\" [style.width.px]=\"20\">\n            <ng-container *ngTemplateOutlet=\"draggableCell; context: { $implicit: item }\"> </ng-container>\n          </clr-dg-cell>\n        }\n        @for (column of visibleColumns; track column) {\n          <clr-dg-cell class=\"fixed-cell-height\">\n            <appfx-dg-cell-container [column]=\"column\" [item]=\"item\"></appfx-dg-cell-container>\n          </clr-dg-cell>\n        }\n      </clr-dg-row>\n    </ng-template>\n  }\n\n  <!-- Server driven tree datagrid with paging. A tree has no expandable rows. -->\n  @if (serverDrivenDatagrid && !virtualScrolling && treeConfig) {\n    <clr-dg-row\n      *clrDgTreeItems=\"\n        let item of gridItems;\n        getChildren: treeConfig.getChildren;\n        cascadeSelection: !!treeConfig.cascadeSelection\n      \"\n      [clrDgItem]=\"item\"\n      [clrDgDetailOpenLabel]=\"getExpandDetailsLabel(item)\"\n      [clrDgDetailCloseLabel]=\"getCollapseDetailsLabel(item)\"\n      [clrDgTreeExpandable]=\"!treeConfig.hasChildren || treeConfig.hasChildren(item)\"\n      (clrDgExpandedChange)=\"treeExpandedChange.emit({ item: item, expanded: $event })\"\n      [clrDgSelectable]=\"item | isRowSelectable: isRowLocked : rowsDisabled\"\n      [clrDgRowSelectionLabel]=\"$any(item)?.[visibleColumns && visibleColumns.length ? visibleColumns[0].field : -1]\"\n      (contextmenu)=\"onContextMenu($event, item)\"\n    >\n      <clr-dg-action-overflow\n        *ngIf=\"enableSingleRowActions\"\n        (clrDgActionOverflowOpenChange)=\"onRowActionOverflowOpen($event, singleRowActions, item)\"\n      >\n        @for (action of singleRowActions; track action) {\n          <button\n            type=\"button\"\n            class=\"action-item\"\n            (click)=\"onActionClick(action, item)\"\n            [title]=\"action.tooltip\"\n            [disabled]=\"!action.enabled\"\n          >\n            {{ action.label }}\n          </button>\n        }\n      </clr-dg-action-overflow>\n      @if (dragConfig) {\n        <clr-dg-cell class=\"draggableCell\" [style.width.px]=\"20\">\n          <ng-container *ngTemplateOutlet=\"draggableCell; context: { $implicit: item }\"> </ng-container>\n        </clr-dg-cell>\n      }\n      @for (column of visibleColumns; track column) {\n        <clr-dg-cell>\n          <appfx-dg-cell-container [column]=\"column\" [item]=\"item\"></appfx-dg-cell-container>\n        </clr-dg-cell>\n      }\n    </clr-dg-row>\n  }\n\n  <!--  Server driven datagrid with paging -->\n  @if (serverDrivenDatagrid && !virtualScrolling && !treeConfig) {\n    @for (item of gridItems; track trackByFn.bind(this)(i, item); let i = $index) {\n      <clr-dg-row\n        [clrDgItem]=\"item\"\n        [clrDgDetailOpenLabel]=\"getExpandDetailsLabel(item)\"\n        [clrDgDetailCloseLabel]=\"getCollapseDetailsLabel(item)\"\n        [clrDgSelectable]=\"item | isRowSelectable: isRowLocked : rowsDisabled\"\n        [clrDgRowSelectionLabel]=\"\n          $any(item)?.[visibleColumns && visibleColumns.length ? visibleColumns[0].field : -1] ?? null\n        \"\n        (contextmenu)=\"onContextMenu($event, item)\"\n      >\n        <clr-dg-action-overflow\n          *ngIf=\"enableSingleRowActions\"\n          (clrDgActionOverflowOpenChange)=\"onRowActionOverflowOpen($event, singleRowActions, item)\"\n        >\n          @for (action of singleRowActions; track action) {\n            <button\n              class=\"action-item\"\n              (click)=\"onActionClick(action, item)\"\n              [title]=\"action.tooltip\"\n              [disabled]=\"!action.enabled\"\n            >\n              {{ action.label }}\n            </button>\n          }\n        </clr-dg-action-overflow>\n\n        @if (dragConfig) {\n          <clr-dg-cell class=\"draggableCell\" [style.width.px]=\"20\">\n            <ng-container *ngTemplateOutlet=\"draggableCell; context: { $implicit: item }\"> </ng-container>\n          </clr-dg-cell>\n        }\n        @for (column of visibleColumns; track column) {\n          <clr-dg-cell>\n            <appfx-dg-cell-container [column]=\"column\" [item]=\"item\"></appfx-dg-cell-container>\n          </clr-dg-cell>\n        }\n\n        <ng-container *ngIf=\"rowDetailContent\" ngProjectAs=\"clr-dg-row-detail\">\n          @if ({ id: buildRowDetailContentId(i) }; as detailData) {\n            <clr-dg-row-detail\n              *clrIfExpanded=\"rowsExpandedByDefault\"\n              tabindex=\"0\"\n              [attr.aria-describedby]=\"detailData.id\"\n            >\n              <div [id]=\"detailData.id\" class=\"datagrid-row-flex\">\n                <ng-container *ngTemplateOutlet=\"rowDetailContent; context: { item: item }\"> </ng-container>\n              </div>\n            </clr-dg-row-detail>\n          }\n        </ng-container>\n      </clr-dg-row>\n    }\n  }\n\n  <!-- Client side datagrid with paging -->\n  @if (!serverDrivenDatagrid) {\n    <clr-dg-row\n      *clrDgItems=\"let item of gridItems; trackBy: trackByFn.bind(this); index as i\"\n      [clrDgItem]=\"item\"\n      [clrDgDetailOpenLabel]=\"getExpandDetailsLabel(item)\"\n      [clrDgDetailCloseLabel]=\"getCollapseDetailsLabel(item)\"\n      [clrDgSelectable]=\"item | isRowSelectable: isRowLocked : rowsDisabled\"\n      [clrDgRowSelectionLabel]=\"\n        $any(item)?.[visibleColumns && visibleColumns.length ? visibleColumns[0].field : -1] ?? null\n      \"\n      (contextmenu)=\"onContextMenu($event, item)\"\n    >\n      <clr-dg-action-overflow\n        *ngIf=\"enableSingleRowActions\"\n        (clrDgActionOverflowOpenChange)=\"onRowActionOverflowOpen($event, singleRowActions, item)\"\n      >\n        @for (action of singleRowActions; track action) {\n          <button\n            class=\"action-item\"\n            (click)=\"onActionClick(action, item)\"\n            [title]=\"action.tooltip\"\n            [disabled]=\"!action.enabled\"\n          >\n            {{ action.label }}\n          </button>\n        }\n      </clr-dg-action-overflow>\n\n      @if (dragConfig) {\n        <clr-dg-cell class=\"draggableCell\">\n          <ng-container *ngTemplateOutlet=\"draggableCell; context: { $implicit: item }\"> </ng-container>\n        </clr-dg-cell>\n      }\n      @for (column of visibleColumns; track column) {\n        <clr-dg-cell>\n          <appfx-dg-cell-container [column]=\"column\" [item]=\"item\"></appfx-dg-cell-container>\n        </clr-dg-cell>\n      }\n\n      <ng-container *ngIf=\"$any(item).rowDetailRenderer\" ngProjectAs=\"clr-dg-row-detail\">\n        @if ({ id: buildRowDetailContentId(i) }; as detailData) {\n          <clr-dg-row-detail *clrIfExpanded tabindex=\"0\" [attr.aria-describedby]=\"detailData.id\">\n            <appfx-dg-cell-container\n              [id]=\"detailData.id\"\n              [column]=\"{\n                displayName: '',\n                field: '',\n                columnRenderer: $any(item).rowDetailRenderer,\n              }\"\n              [item]=\"item\"\n            ></appfx-dg-cell-container>\n          </clr-dg-row-detail>\n        }\n      </ng-container>\n\n      <ng-container *ngIf=\"rowDetailContent\" ngProjectAs=\"clr-dg-row-detail\">\n        @if ({ id: buildRowDetailContentId(i) }; as detailData) {\n          <clr-dg-row-detail\n            *clrIfExpanded=\"rowsExpandedByDefault\"\n            tabindex=\"0\"\n            [attr.aria-describedby]=\"detailData.id\"\n          >\n            <div [id]=\"detailData.id\" class=\"datagrid-row-flex\">\n              <ng-container *ngTemplateOutlet=\"rowDetailContent; context: { item: item }\"> </ng-container>\n            </div>\n          </clr-dg-row-detail>\n        }\n      </ng-container>\n    </clr-dg-row>\n  }\n\n  <ng-container *ngIf=\"detailHeader || detailBody\" ngProjectAs=\"clr-dg-detail\">\n    <ng-template [clrIfDetail]=\"detailState\" (clrIfDetailChange)=\"onDetailStateChange($event)\" let-detail>\n      <clr-dg-detail>\n        @if (detailHeader) {\n          <clr-dg-detail-header>\n            <ng-container *ngTemplateOutlet=\"detailHeader; context: { $implicit: detail }\"></ng-container>\n          </clr-dg-detail-header>\n        }\n        @if (detailBody) {\n          <clr-dg-detail-body>\n            <ng-container *ngTemplateOutlet=\"detailBody; context: { $implicit: detail }\"></ng-container>\n          </clr-dg-detail-body>\n        }\n      </clr-dg-detail>\n    </ng-template>\n  </ng-container>\n\n  <clr-dg-footer *ngIf=\"gridFooterModel.showFooter\">\n    @if (!gridFooterModel.hideColumnToggle) {\n      <appfx-dg-column-toggle [(columns)]=\"columns\" (columnHiddenStateChange)=\"onColumnHiddenStateChange($event)\">\n      </appfx-dg-column-toggle>\n    }\n\n    @if (enableExportButton) {\n      <appfx-dg-export\n        [allItemsCount]=\"gridFooterModel.clientSideExportConfig?.allItemsCount || listItemsCount\"\n        [selectedItemsCount]=\"selectedItemsCount\"\n        [filteredItemsCount]=\"filteredItemsCount\"\n        (exportEventEmitter)=\"onExportEvent($event)\"\n        class=\"footer-actions\"\n      >\n      </appfx-dg-export>\n    }\n\n    @if (showDeselectAll) {\n      <div class=\"column-switch-wrapper footer-actions\">\n        <button class=\"btn btn-sm column-toggle-action\" [disabled]=\"deselectAllDisabled\" (click)=\"onDeselectAllClick()\">\n          {{ dgStrings.deselectAll }}\n        </button>\n      </div>\n    }\n    <!-- Custom footer actions -->\n    @if (gridFooterModel?.footerActions) {\n      @for (action of gridFooterModel.footerActions; track action) {\n        <div class=\"footer-actions column-switch-wrapper\">\n          @if (action.children) {\n            <clr-dropdown>\n              <button\n                class=\"btn btn-sm column-toggle-action\"\n                clrDropdownTrigger\n                [disabled]=\"!action.enabled\"\n                [attr.aria-label]=\"action.ariaLabel\"\n              >\n                {{ action.label }}\n                <cds-icon shape=\"angle\" direction=\"up\"></cds-icon>\n              </button>\n              <clr-dropdown-menu clrPosition=\"top-left\" *clrIfOpen>\n                @for (childAction of action.children; track childAction) {\n                  <button\n                    type=\"button\"\n                    [disabled]=\"!childAction.enabled\"\n                    [attr.aria-label]=\"childAction.ariaLabel\"\n                    clrDropdownItem\n                    (click)=\"onActionClick(childAction)\"\n                  >\n                    {{ childAction.label }}\n                  </button>\n                }\n              </clr-dropdown-menu>\n            </clr-dropdown>\n          } @else {\n            <button\n              type=\"button\"\n              class=\"column-toggle-action btn btn-sm\"\n              [attr.aria-label]=\"action.ariaLabel\"\n              [disabled]=\"!action.enabled\"\n              (click)=\"onActionClick(action)\"\n            >\n              {{ action.label }}\n            </button>\n          }\n        </div>\n      }\n    }\n    <ng-content select=\".custom-footer-content\"></ng-content>\n\n    <ng-container *ngIf=\"pageSize > 0; else missingPageConfig\" ngProjectAs=\"clr-dg-pagination\">\n      <clr-dg-pagination #pagination [clrDgPageSize]=\"pageSize\" [clrDgTotalItems]=\"totalItems\">\n        @if (pageSizeOptions?.length) {\n          <clr-dg-page-size #clrDgPageSize [clrPageSizeOptions]=\"pageSizeOptions\">\n            <label [for]=\"clrDgPageSize.pageSizeOptionsId\"> {{ dgStrings.itemsPerPage }} </label>\n          </clr-dg-page-size>\n        }\n        {{\n          getFooterMessage(\n            pagination.totalItems,\n            pagination.pageSize,\n            pagination.firstItem + 1,\n            pagination.lastItem + 1\n          )\n        }}\n      </clr-dg-pagination>\n    </ng-container>\n\n    <ng-template #missingPageConfig>\n      @if (!showCustomPagination) {\n        <span class=\"pagination\">\n          {{ getFooterMessage(totalItems, undefined, dataRange.skip + 1, dataRange.skip + dataRange.data.length) }}\n        </span>\n      }\n      @if (showCustomPagination) {\n        <div>\n          <ng-container *ngTemplateOutlet=\"customPagination\"></ng-container>\n        </div>\n      }\n      <ng-template #customPagination>\n        <ng-content></ng-content>\n      </ng-template>\n    </ng-template>\n  </clr-dg-footer>\n</clr-datagrid>\n\n<ng-template #draggableCell let-item>\n  <div cdkDropList [cdkDropListAutoScrollStep]=\"0\" [cdkDropListConnectedTo]=\"dropGroup(dragConfig.dragGroup || '')\">\n    <div\n      cdkDrag\n      cdkDragPreviewContainer=\"parent\"\n      [cdkDragData]=\"draggedItems\"\n      (cdkDragStarted)=\"onDragStart(item)\"\n      (cdkDragMoved)=\"onDragMove()\"\n    >\n      <cds-icon shape=\"drag-handle\" size=\"22\" cdkDragHandle> </cds-icon>\n      <div class=\"custom-placeholder\" *cdkDragPlaceholder></div>\n      <div class=\"custom-preview\" *cdkDragPreview>\n        @if (draggedItems.length === 1) {\n          <div class=\"grid-ghost single-ghost\" [ngClass]=\"{ 'selection-ghost': isItemSelected(item) }\">\n            <ng-container *ngTemplateOutlet=\"draggableGhostContent; context: { $implicit: item }\"> </ng-container>\n          </div>\n        } @else {\n          <div class=\"grid-ghost multiple-ghost selection-ghost\">\n            <ng-container *ngTemplateOutlet=\"draggableGhostContent; context: { $implicit: item }\"> </ng-container>\n          </div>\n          <span class=\"badge badge-purple ghost-badge\">\n            {{ draggedItems.length }}\n          </span>\n        }\n      </div>\n    </div>\n  </div>\n</ng-template>\n\n<ng-template #draggableGhostContent let-item>\n  <cds-icon class=\"drop-status drop-status-valid\" shape=\"plus\" size=\"18\"></cds-icon>\n  <cds-icon class=\"drop-status drop-status-invalid\" shape=\"ban\" size=\"18\"></cds-icon>\n  <i class=\"{{ item.primaryIconId }}\"></i>\n  <span>{{ item[dragConfig.fieldName] }}</span>\n</ng-template>\n",
			styles: ["clr-datagrid .draggableCell{min-width:20px;width:20px;padding-left:0!important;order:-1;flex:0}:host{min-height:3.6rem}:host ::ng-deep clr-datagrid{min-height:0}:host(.zoom2x) ::ng-deep clr-datagrid.flex-clr-datagrid,:host(.zoom4x) ::ng-deep clr-datagrid.flex-clr-datagrid{height:auto!important;flex:1 0 auto!important}:host(.zoom4x){min-height:7.2rem}clr-datagrid.flex-clr-datagrid{flex-basis:auto;height:100%}clr-datagrid .custom-preview{width:250px;overflow:hidden;font-size:var(--cds-alias-typography-secondary-font-size);line-height:var(--cds-alias-typography-secondary-line-height)}clr-datagrid .custom-preview .grid-ghost{border:1px solid var(--clr-table-border-color);border-left:2px solid var(--cds-alias-object-interaction-background-highlight);border-radius:3px 0 0 3px;background-color:var(--cds-global-color-white);padding:5px;max-height:60px;white-space:normal;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3}clr-datagrid .custom-preview .grid-ghost .drop-status{margin-top:-4px}clr-datagrid.datagrid-compact .custom-preview .grid-ghost .drop-status{margin-top:-8px}clr-datagrid clr-dg-cell.fixed-cell-height{height:16px}clr-datagrid .single-ghost{box-shadow:0 3px 4px #7474744d}clr-datagrid .multiple-ghost{box-shadow:8px 7px var(--clr-table-bgcolor),8px 7px var(--clr-table-border-color),8px 8px 4px #7474744d}clr-datagrid .selection-ghost{color:var(--cds-global-color-gray-400);background-color:var(--clr-table-bgcolor)}clr-datagrid .ghost-badge{float:right}clr-datagrid.disabled-grid{pointer-events:none;cursor:not-allowed;opacity:.5}clr-datagrid .draggableCell .draggableIcon{transform:unset}clr-datagrid clr-dg-footer ::ng-deep .footer-actions{margin-left:10px;display:flex;align-items:center}clr-datagrid clr-dg-footer ::ng-deep .footer-actions:not(:disabled):hover,clr-datagrid clr-dg-footer ::ng-deep .footer-actions:not(:disabled):active{cursor:pointer;text-decoration:none}clr-datagrid clr-dg-footer ::ng-deep .datagrid-footer-description{display:flex;text-align:left}clr-datagrid clr-dg-footer ::ng-deep li{white-space:normal}clr-datagrid clr-dg-footer clr-dg-pagination{display:inline-flex;align-items:center}clr-datagrid clr-dg-footer clr-dg-pagination ::ng-deep>ul{height:auto}clr-datagrid clr-dg-column ::ng-deep .datagrid-column-flex{width:100%}clr-datagrid clr-dg-column.grabbed:not(.cdk-drag-placeholder,.cdk-drag-preview)::ng-deep .datagrid-column-title{background-color:var(--clr-datagrid-row-selected-background-color);color:var(--clr-datagrid-row-selected)}clr-datagrid clr-dg-column.grabbed:not(.cdk-drag-placeholder,.cdk-drag-preview){background-color:var(--clr-datagrid-row-selected-background-color);color:var(--clr-datagrid-row-selected)}clr-datagrid clr-dg-column.cdk-drag-placeholder{outline:var(--cds-alias-object-interaction-outline);outline-color:-webkit-focus-ring-color;outline-offset:var(--clr-datagrid-cell-outline-offset);z-index:100}clr-datagrid clr-dg-column.cdk-drag-preview{opacity:.75}clr-datagrid clr-dg-action-bar .appfx-datagrid-actions-container{display:flex;justify-content:space-between}clr-datagrid clr-dg-action-bar .appfx-datagrid-actions-container .filter-input{display:flex;flex-direction:row;align-items:center}clr-datagrid clr-dg-action-bar .appfx-datagrid-actions-container .filter-input cds-icon{cursor:pointer}clr-datagrid clr-dg-action-bar .appfx-datagrid-actions-container .action-bar{flex:1 0 auto;width:.05rem}clr-datagrid clr-dg-row-detail appfx-dg-cell-container{width:100%}clr-datagrid clr-dg-row-detail::ng-deep appfx-datagrid div.datagrid-header{z-index:500}clr-datagrid.zoom4x{min-height:7.2rem}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container{flex-direction:column}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .action-bar{flex:1 0 auto;width:100%;max-width:100%;min-width:1px}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .action-bar ::ng-deep .btn-group button:first-child{padding-left:10px}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input{padding-left:10px;width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input cds-icon{flex:0 1 auto}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input clr-input-container{flex:1 0 auto}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input clr-input-container ::ng-deep .clr-control-container{width:100%}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input clr-input-container ::ng-deep .clr-control-container input{width:100%}clr-datagrid.zoom4x ::ng-deep .column-switch-wrapper clr-dropdown-menu{position:fixed!important;transform:none!important;width:100%;min-width:100%;height:100%}clr-datagrid .custom-placeholder{height:0;width:0}clr-datagrid cds-icon[shape=drag-handle]{cursor:grab}.drop-status{display:none;margin-left:4px;color:var(--cds-global-color-black)}:host-context(body.drag-valid-target) .drop-status-valid{display:inline-block}:host-context(body.drag-invalid-target) .drop-status-invalid{display:inline-block}:host-context([data-theme=dark]) clr-datagrid .custom-preview .grid-ghost{background-color:var(--clr-table-bgcolor)}:host-context([data-theme=dark]) clr-datagrid .custom-preview .grid-ghost .drop-status{color:var(--cds-global-color-white)}\n"],
			dependencies: [
				{
					kind: "directive",
					type: i1$2.ZoomLevelIndicatorDirective,
					selector: "[zoomLevelIndicator]"
				},
				{
					kind: "component",
					type: i5.DataGridFiltersComponent,
					selector: "appfx-datagrid-filters",
					inputs: [
						"filterableProperties",
						"presetFilters",
						"filterMode"
					],
					outputs: ["searchTermChange", "propertyFiltersChange"]
				},
				{
					kind: "directive",
					type: i1$1.CdkDropList,
					selector: "[cdkDropList], cdk-drop-list",
					inputs: [
						"cdkDropListConnectedTo",
						"cdkDropListData",
						"cdkDropListOrientation",
						"id",
						"cdkDropListLockAxis",
						"cdkDropListDisabled",
						"cdkDropListSortingDisabled",
						"cdkDropListEnterPredicate",
						"cdkDropListSortPredicate",
						"cdkDropListAutoScrollDisabled",
						"cdkDropListAutoScrollStep",
						"cdkDropListElementContainer",
						"cdkDropListHasAnchor"
					],
					outputs: [
						"cdkDropListDropped",
						"cdkDropListEntered",
						"cdkDropListExited",
						"cdkDropListSorted"
					],
					exportAs: ["cdkDropList"]
				},
				{
					kind: "directive",
					type: i1$1.CdkDrag,
					selector: "[cdkDrag]",
					inputs: [
						"cdkDragData",
						"cdkDragLockAxis",
						"cdkDragRootElement",
						"cdkDragBoundary",
						"cdkDragStartDelay",
						"cdkDragFreeDragPosition",
						"cdkDragDisabled",
						"cdkDragConstrainPosition",
						"cdkDragPreviewClass",
						"cdkDragPreviewContainer",
						"cdkDragScale"
					],
					outputs: [
						"cdkDragStarted",
						"cdkDragReleased",
						"cdkDragEnded",
						"cdkDragEntered",
						"cdkDragExited",
						"cdkDragDropped",
						"cdkDragMoved"
					],
					exportAs: ["cdkDrag"]
				},
				{
					kind: "directive",
					type: i1$1.CdkDragHandle,
					selector: "[cdkDragHandle]",
					inputs: ["cdkDragHandleDisabled"]
				},
				{
					kind: "directive",
					type: i1$1.CdkDragPreview,
					selector: "ng-template[cdkDragPreview]",
					inputs: ["data", "matchSize"]
				},
				{
					kind: "directive",
					type: i1$1.CdkDragPlaceholder,
					selector: "ng-template[cdkDragPlaceholder]",
					inputs: ["data"]
				},
				{
					kind: "directive",
					type: i4.ClrControlLabel,
					selector: "label",
					inputs: ["id", "for"]
				},
				{
					kind: "component",
					type: i2$1.ClrIcon,
					selector: "clr-icon, cds-icon",
					inputs: [
						"shape",
						"size",
						"direction",
						"flip",
						"solid",
						"status",
						"inverse",
						"badge",
						"innerOffset"
					]
				},
				{
					kind: "component",
					type: i1.ClrDatagrid,
					selector: "clr-datagrid",
					inputs: [
						"clrLoadingMoreItems",
						"clrDgSingleSelectionAriaLabel",
						"clrDgSingleActionableAriaLabel",
						"clrDetailExpandableAriaLabel",
						"clrDgDisablePageFocus",
						"clrDgCustomSelectAllEnabled",
						"clrDgSelectAllDisabled",
						"clrDgLoading",
						"clrDgSelectionType",
						"clrDgSelected",
						"clrDgPreserveSelection",
						"clrDgRowSelection",
						"clrDgItemsIdentityFn"
					],
					outputs: [
						"clrDgSelectedChange",
						"clrDgRefresh",
						"clrDgCustomSelectAll"
					]
				},
				{
					kind: "component",
					type: i1.ClrDatagridActionBar,
					selector: "clr-dg-action-bar"
				},
				{
					kind: "component",
					type: i1.ClrDatagridActionOverflow,
					selector: "clr-dg-action-overflow",
					inputs: ["clrDgActionOverflowButtonLabel", "clrDgActionOverflowOpen"],
					outputs: ["clrDgActionOverflowOpenChange"]
				},
				{
					kind: "component",
					type: i1.ClrDatagridCell,
					selector: "clr-dg-cell"
				},
				{
					kind: "component",
					type: i1.ClrDatagridColumn,
					selector: "clr-dg-column",
					inputs: [
						"clrFilterStringPlaceholder",
						"clrFilterNumberMaxPlaceholder",
						"clrFilterNumberMinPlaceholder",
						"clrDgDisableUnsort",
						"clrDgPinnable",
						"clrDgPinned",
						"clrDgTreeToggle",
						"clrDgColType",
						"clrDgField",
						"clrDgSortBy",
						"clrDgSortOrder",
						"clrFilterValue"
					],
					outputs: [
						"clrDgSortOrderChange",
						"clrDgPinnedChange",
						"clrFilterValueChange"
					]
				},
				{
					kind: "directive",
					type: i1.ClrDatagridColumnAction,
					selector: "[clrDgColumnAction]",
					inputs: ["clrCanClosePopover"]
				},
				{
					kind: "component",
					type: i1.ClrDatagridColumnActions,
					selector: "clr-dg-column-actions",
					inputs: ["clrDgKeepFilterInHeader"]
				},
				{
					kind: "component",
					type: i1.ClrDatagridDetail,
					selector: "clr-dg-detail",
					inputs: [
						"clrDetailAriaLabelledBy",
						"clrDetailAriaLabel",
						"clrDetailWidth"
					]
				},
				{
					kind: "component",
					type: i1.ClrDatagridDetailBody,
					selector: "clr-dg-detail-body"
				},
				{
					kind: "component",
					type: i1.ClrDatagridDetailHeader,
					selector: "clr-dg-detail-header"
				},
				{
					kind: "component",
					type: i1.ClrDatagridFilter,
					selector: "clr-dg-filter",
					inputs: ["clrDgFilterOpen", "clrDgFilter"],
					outputs: ["clrDgFilterOpenChange"]
				},
				{
					kind: "component",
					type: i1.ClrDatagridFooter,
					selector: "clr-dg-footer"
				},
				{
					kind: "directive",
					type: i1.ClrDatagridItems,
					selector: "[clrDgItems][clrDgItemsOf]",
					inputs: ["clrDgItemsOf", "clrDgItemsTrackBy"]
				},
				{
					kind: "directive",
					type: i1.ClrDatagridTreeItems,
					selector: "[clrDgTreeItems][clrDgTreeItemsOf]",
					inputs: [
						"clrDgTreeItemsOf",
						"clrDgTreeItemsGetChildren",
						"clrDgTreeItemsCascadeSelection"
					]
				},
				{
					kind: "directive",
					type: i1.ClrDatagridVirtualTree,
					selector: "[ClrVirtualScroll][clrVirtualTreeOf],[clrVirtualScroll][clrVirtualTreeOf],[ClrVirtualScroll][clrVirtualTreeDataRange],[clrVirtualScroll][clrVirtualTreeDataRange]",
					inputs: [
						"clrVirtualTreeOf",
						"clrVirtualTreeGetChildren",
						"clrVirtualTreeCascadeSelection",
						"clrVirtualTreeDataRange"
					],
					outputs: ["clrVirtualTreeRenderedRootsChange"]
				},
				{
					kind: "component",
					type: i1.ClrDatagridPageSize,
					selector: "clr-dg-page-size",
					inputs: ["clrPageSizeOptions", "clrPageSizeOptionsId"]
				},
				{
					kind: "component",
					type: i1.ClrDatagridPagination,
					selector: "clr-dg-pagination",
					inputs: [
						"clrDgPageInputDisabled",
						"clrDgPageSize",
						"clrDgTotalItems",
						"clrDgLastPage",
						"clrDgPage"
					],
					outputs: ["clrDgPageChange"]
				},
				{
					kind: "component",
					type: i1.ClrDatagridPlaceholder,
					selector: "clr-dg-placeholder"
				},
				{
					kind: "component",
					type: i1.ClrDatagridRow,
					selector: "clr-dg-row",
					inputs: [
						"clrDgDetailDisabled",
						"clrDgDetailHidden",
						"clrDgSkeletonLoading",
						"clrDgTreeExpandable",
						"clrDgItem",
						"clrDgSelectable",
						"clrDgSelected",
						"clrDgExpanded",
						"clrDgDetailOpenLabel",
						"clrDgDetailCloseLabel",
						"clrDgRowSelectionLabel"
					],
					outputs: ["clrDgSelectedChange", "clrDgExpandedChange"]
				},
				{
					kind: "component",
					type: i1.ClrDatagridRowDetail,
					selector: "clr-dg-row-detail",
					inputs: [
						"clrRowDetailBeginningAriaText",
						"clrRowDetailEndAriaText",
						"clrDgReplace"
					]
				},
				{
					kind: "directive",
					type: i1.ClrDatagridVirtualScrollDirective,
					selector: "[clrVirtualScroll],[ClrVirtualScroll]",
					inputs: [
						"clrVirtualPersistItems",
						"clrVirtualRowsOf",
						"clrVirtualRowsTrackBy",
						"clrVirtualRowsTemplate",
						"clrVirtualRowsTemplateCacheSize",
						"clrVirtualRowsItemSize",
						"clrVirtualRowsMinBufferPx",
						"clrVirtualRowsMaxBufferPx",
						"clrVirtualDataRange"
					],
					outputs: ["renderedRangeChange"]
				},
				{
					kind: "directive",
					type: i1.ClrIfDetail,
					selector: "[clrIfDetail]",
					inputs: ["clrIfDetail"],
					outputs: ["clrIfDetailChange"]
				},
				{
					kind: "directive",
					type: i1.DatagridDetailRegisterer,
					selector: "[clrIfExpanded]"
				},
				{
					kind: "directive",
					type: i1.DatagridCellRenderer,
					selector: "clr-dg-cell"
				},
				{
					kind: "directive",
					type: i1.DatagridHeaderRenderer,
					selector: "clr-dg-column",
					outputs: ["clrDgColumnResize"]
				},
				{
					kind: "directive",
					type: i1.DatagridMainRenderer,
					selector: "clr-datagrid"
				},
				{
					kind: "directive",
					type: i1.DatagridRowDetailRenderer,
					selector: "clr-dg-row-detail"
				},
				{
					kind: "directive",
					type: i1.DatagridRowRenderer,
					selector: "clr-dg-row"
				},
				{
					kind: "directive",
					type: i10.ClrIfExpanded,
					selector: "[clrIfExpanded]",
					inputs: ["clrIfExpanded"],
					outputs: ["clrIfExpandedChange"]
				},
				{
					kind: "component",
					type: i3$3.ClrDropdown,
					selector: "clr-dropdown",
					inputs: ["clrCloseMenuOnItemClick"]
				},
				{
					kind: "component",
					type: i3$3.ClrDropdownMenu,
					selector: "clr-dropdown-menu",
					inputs: ["clrPosition"]
				},
				{
					kind: "directive",
					type: i3$3.ClrDropdownTrigger,
					selector: "[clrDropdownTrigger],[clrDropdownToggle]"
				},
				{
					kind: "directive",
					type: i3$3.ClrDropdownItem,
					selector: "[clrDropdownItem]",
					inputs: [
						"role",
						"clrDisabled",
						"id"
					]
				},
				{
					kind: "directive",
					type: i4$1.ClrIfOpen,
					selector: "[clrIfOpen]",
					inputs: ["clrIfOpen"],
					outputs: ["clrIfOpenChange"]
				},
				{
					kind: "directive",
					type: i5$2.NgClass,
					selector: "[ngClass]",
					inputs: ["class", "ngClass"]
				},
				{
					kind: "directive",
					type: i5$2.NgIf,
					selector: "[ngIf]",
					inputs: [
						"ngIf",
						"ngIfThen",
						"ngIfElse"
					]
				},
				{
					kind: "directive",
					type: i5$2.NgTemplateOutlet,
					selector: "[ngTemplateOutlet]",
					inputs: [
						"ngTemplateOutletContext",
						"ngTemplateOutlet",
						"ngTemplateOutletInjector"
					]
				},
				{
					kind: "directive",
					type: ColumnMoveActionDirective,
					selector: "[appfxColumnMoveAction]",
					inputs: ["appfxColumnMoveAction", "columnIndex"],
					exportAs: ["appfxColumnMoveAction"]
				},
				{
					kind: "directive",
					type: ColumnOrderDirective,
					selector: "clr-dg-column[appfxColumnOrder]",
					inputs: ["columnData", "columnIndex"]
				},
				{
					kind: "directive",
					type: DatagridColumnsOrderDirective,
					selector: "clr-datagrid[appfxDgColumnsOrder]",
					inputs: ["dgColumnsOrderColumns", "dgColumnsVirtualScrolling"],
					outputs: ["dgColumnsOrderChange"]
				},
				{
					kind: "component",
					type: DatagridActionBarComponent,
					selector: "appfx-datagrid-action-bar",
					inputs: [
						"actions",
						"btnLayout",
						"dropdownOrientation"
					],
					outputs: ["invokeAction"]
				},
				{
					kind: "component",
					type: DatagridFilterComponent,
					selector: "appfx-datagrid-filter",
					inputs: [
						"filterValue",
						"stringFilterType",
						"fieldName"
					],
					outputs: ["filterValueChange"]
				},
				{
					kind: "component",
					type: DatagridCellContainerComponent,
					selector: "appfx-dg-cell-container",
					inputs: ["column", "item"]
				},
				{
					kind: "component",
					type: DatagridColumnToggleComponent,
					selector: "appfx-dg-column-toggle",
					inputs: ["columns"],
					outputs: ["columnsChange", "columnHiddenStateChange"]
				},
				{
					kind: "component",
					type: DatagridFilterContainerComponent,
					selector: "appfx-dg-filter-container",
					inputs: ["filterType", "filterValue"],
					outputs: ["filterValueChange"]
				},
				{
					kind: "component",
					type: ExportDatagridComponent,
					selector: "appfx-dg-export",
					inputs: [
						"allItemsCount",
						"filteredItemsCount",
						"selectedItemsCount"
					],
					outputs: ["exportEventEmitter"]
				},
				{
					kind: "pipe",
					type: IsRowSelectablePipe,
					name: "isRowSelectable"
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.OnPush
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-datagrid",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.OnPush,
			providers: [
				ExportProviderService,
				uniqueIdProvider,
				{
					provide: appfxPreselectableComponentToken,
					useExisting: forwardRef(() => DatagridComponent)
				}
			],
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-datagrid\n  zoomLevelIndicator\n  [clrDgDisablePageFocus]=\"true\"\n  [clrDgPreserveSelection]=\"preserveExistingSelectionOnFilter\"\n  [clrDgSelectionType]=\"selectionType\"\n  [clrDgSelected]=\"selectedItems\"\n  [clrDgItemsIdentityFn]=\"trackByGridItemFn\"\n  (clrDgRefresh)=\"refreshGrid($event)\"\n  [clrDgLoading]=\"loading\"\n  [clrLoadingMoreItems]=\"loadingMoreItems\"\n  [clrDgRowSelection]=\"rowSelectionMode\"\n  [ngClass]=\"{\n    'disabled-grid': gridLayoutModel.disabled,\n    'datagrid-compact': gridLayoutModel.compact,\n    'flex-clr-datagrid': gridLayoutModel.stretchToParentHeight,\n    'datagrid-overflow-ellipsis': virtualScrolling || !wrapText,\n  }\"\n  cdkDropList\n  [cdkDropListAutoScrollStep]=\"5\"\n  appfxDgColumnsOrder\n  [clrDgCustomSelectAllEnabled]=\"virtualScrolling\"\n  (clrDgCustomSelectAll)=\"onSelectAllInVirtualGrid($event)\"\n  [dgColumnsOrderColumns]=\"columns\"\n  [dgColumnsVirtualScrolling]=\"virtualScrolling\"\n  (dgColumnsOrderChange)=\"onColumnOrderChange($event)\"\n  (clrDgSelectedChange)=\"onSelectedItemsChange($event)\"\n>\n  <clr-dg-action-bar *ngIf=\"enableToolBar\">\n    @if (!!actionBarActions.length) {\n      <div class=\"appfx-datagrid-actions-container\">\n        <appfx-datagrid-action-bar\n          class=\"action-bar\"\n          (invokeAction)=\"onActionClick($event)\"\n          [actions]=\"actionBarActions\"\n        >\n        </appfx-datagrid-action-bar>\n      </div>\n    }\n    @if (filterMode !== undefined && filterMode !== null) {\n      <appfx-datagrid-filters\n        [filterMode]=\"filterMode\"\n        [filterableProperties]=\"filterableProperties\"\n        (searchTermChange)=\"onAdvancedSearchTermChange($event)\"\n        (propertyFiltersChange)=\"onAdvancedFilterCriteriaChange($event)\"\n      >\n      </appfx-datagrid-filters>\n    }\n  </clr-dg-action-bar>\n  @if (dragConfig) {\n    <clr-dg-column class=\"draggableCell\" [style.width.px]=\"20\"></clr-dg-column>\n  }\n  @for (column of visibleColumns; track trackByColumnId(index, column); let index = $index) {\n    <clr-dg-column\n      cdkDrag\n      [cdkDragLockAxis]=\"'x'\"\n      [cdkDragData]=\"column\"\n      [cdkDragDisabled]=\"!!column.pinned\"\n      appfxColumnOrder\n      [columnData]=\"column\"\n      [columnIndex]=\"index\"\n      [style]=\"column.width ? { width: column.width } : null\"\n      (clrDgColumnResize)=\"onColumnResize($event, column)\"\n      [clrDgField]=\"column.sortAndFilterByField || defaultUnsetValue\"\n      [clrDgSortBy]=\"column.sortComparator || defaultUnsetValue\"\n      [clrDgSortOrder]=\"column.defaultSortOrder || defaultUnsortedOrder\"\n      (clrDgSortOrderChange)=\"onSortOrderChange($event, column)\"\n      [clrDgDisableUnsort]=\"column.disableUnsort ?? disableUnsort\"\n      [clrDgPinnable]=\"!!column.pinnable\"\n      [clrDgPinned]=\"!!column.pinned\"\n      [clrDgTreeToggle]=\"!!treeConfig && hasTreeToggle(column)\"\n      (clrDgPinnedChange)=\"onPinnedChange($event, column)\"\n    >\n      <clr-dg-filter\n        *ngIf=\"column.stringFilter || column.sortAndFilterByField\"\n        [clrDgFilter]=\"appfxDatagridStringFilter\"\n      >\n        <appfx-datagrid-filter\n          #appfxDatagridStringFilter\n          [stringFilterType]=\"column.stringFilter\"\n          [filterValue]=\"column.defaultFilterValue\"\n          [fieldName]=\"column.sortAndFilterByField\"\n          (filterValueChange)=\"onFilterChange($event, column)\"\n        ></appfx-datagrid-filter>\n      </clr-dg-filter>\n      <clr-dg-filter *ngIf=\"column.filter\">\n        <appfx-dg-filter-container\n          [filterType]=\"column.filter\"\n          [filterValue]=\"column.defaultFilterValue\"\n          (filterValueChange)=\"onFilterChange($event, column)\"\n        ></appfx-dg-filter-container>\n      </clr-dg-filter>\n      {{ column.displayName }}\n      @if (enableColumnActions) {\n        <!--\n          clrDgKeepFilterInHeader keeps the existing filter toggle in the header rather than moving\n          it into this menu - appfx-datagrid already shipped that toggle, and existing consumers and\n          tests expect it to stay there. The menu gives up its own filter action in exchange, so a\n          column offers one way to reach its filter rather than two.\n        -->\n        <clr-dg-column-actions [clrDgKeepFilterInHeader]=\"true\">\n          @if (column.sortComparator || column.sortAndFilterByField || column.pinnable) {\n            <div class=\"dropdown-divider\" role=\"separator\"></div>\n          }\n          <button\n            type=\"button\"\n            clrDgColumnAction\n            [clrCanClosePopover]=\"false\"\n            [appfxColumnMoveAction]=\"ColumnMoveDirection.Left\"\n            #moveLeft=\"appfxColumnMoveAction\"\n            [columnIndex]=\"index\"\n            [clrDisabled]=\"moveLeft.disabled\"\n          >\n            <cds-icon shape=\"angle\" direction=\"left\" aria-hidden=\"true\"></cds-icon>\n            {{ dgStrings.moveColumnLeft }}\n          </button>\n          <button\n            type=\"button\"\n            clrDgColumnAction\n            [clrCanClosePopover]=\"false\"\n            [appfxColumnMoveAction]=\"ColumnMoveDirection.Right\"\n            #moveRight=\"appfxColumnMoveAction\"\n            [columnIndex]=\"index\"\n            [clrDisabled]=\"moveRight.disabled\"\n          >\n            <cds-icon shape=\"angle\" direction=\"right\" aria-hidden=\"true\"></cds-icon>\n            {{ dgStrings.moveColumnRight }}\n          </button>\n          @let customColumnActions = getColumnActions(column);\n          @if (customColumnActions.length) {\n            <div class=\"dropdown-divider\" role=\"separator\"></div>\n            <!--\n              Application actions come last, so the built-in ones keep the same place in every menu\n              whatever a column adds. clrCanClosePopover is left at its default, so these close the\n              menu on click - unlike the move actions, they are not expected to be repeated.\n            -->\n            @for (action of customColumnActions; track action) {\n              <!-- An action with children opens them as a nested menu, the same as in the action bar. -->\n              @if (action.children) {\n                <clr-dropdown>\n                  <button\n                    type=\"button\"\n                    clrDropdownTrigger\n                    [disabled]=\"!action.enabled\"\n                    [attr.aria-label]=\"action.ariaLabel\"\n                    [attr.title]=\"action.tooltip\"\n                  >\n                    @if (action.icon) {\n                      <cds-icon [shape]=\"action.icon\" aria-hidden=\"true\"></cds-icon>\n                    }\n                    {{ action.label }}\n                  </button>\n                  <clr-dropdown-menu *clrIfOpen>\n                    @for (childAction of action.children; track childAction) {\n                      <button\n                        type=\"button\"\n                        clrDropdownItem\n                        [clrDisabled]=\"!childAction.enabled\"\n                        [attr.aria-label]=\"childAction.ariaLabel\"\n                        [attr.title]=\"childAction.tooltip\"\n                        (click)=\"onColumnActionClick(childAction, column)\"\n                      >\n                        @if (childAction.icon) {\n                          <cds-icon [shape]=\"childAction.icon\" aria-hidden=\"true\"></cds-icon>\n                        }\n                        {{ childAction.label }}\n                      </button>\n                    }\n                  </clr-dropdown-menu>\n                </clr-dropdown>\n              } @else {\n                <button\n                  type=\"button\"\n                  clrDgColumnAction\n                  [clrDisabled]=\"!action.enabled\"\n                  [attr.aria-label]=\"action.ariaLabel\"\n                  [attr.title]=\"action.tooltip\"\n                  (click)=\"onColumnActionClick(action, column)\"\n                >\n                  @if (action.icon) {\n                    <cds-icon [shape]=\"action.icon\" aria-hidden=\"true\"></cds-icon>\n                  }\n                  {{ action.label }}\n                </button>\n              }\n            }\n          }\n        </clr-dg-column-actions>\n      }\n    </clr-dg-column>\n  }\n  <clr-dg-placeholder>\n    {{ dgStrings.noItemsFound }}\n    <ng-content select=\".custom-placeholder-content\"></ng-content>\n  </clr-dg-placeholder>\n\n  <!-- Server driven tree datagrid with virtual scrolling. The data range is a range of roots. -->\n  @if (serverDrivenDatagrid && virtualScrolling && treeConfig) {\n    <ng-template\n      ClrVirtualScroll\n      let-item\n      [clrVirtualTreeDataRange]=\"dataRange\"\n      [clrVirtualTreeGetChildren]=\"treeConfig.getChildren\"\n      [clrVirtualTreeCascadeSelection]=\"!!treeConfig.cascadeSelection\"\n      [clrVirtualRowsItemSize]=\"25\"\n      [clrVirtualRowsMinBufferPx]=\"400\"\n      [clrVirtualRowsMaxBufferPx]=\"800\"\n      [clrVirtualRowsTemplateCacheSize]=\"400\"\n      [clrVirtualRowsTrackBy]=\"trackByFunction\"\n      (clrVirtualTreeRenderedRootsChange)=\"renderedRangeChange($event)\"\n    >\n      <clr-dg-row\n        [clrDgItem]=\"item\"\n        [clrDgTreeExpandable]=\"!!item && (!treeConfig.hasChildren || treeConfig.hasChildren(item))\"\n        (clrDgExpandedChange)=\"treeExpandedChange.emit({ item: item, expanded: $event })\"\n        [clrDgSelectable]=\"item | isRowSelectable: isRowLocked : rowsDisabled\"\n        [clrDgRowSelectionLabel]=\"\n          $any(item)?.[visibleColumns && visibleColumns.length ? visibleColumns[0].field : -1] ?? null\n        \"\n        (contextmenu)=\"onContextMenu($event, item)\"\n        [clrDgSkeletonLoading]=\"!item\"\n      >\n        @if (dragConfig) {\n          <clr-dg-cell class=\"draggableCell\" [style.width.px]=\"20\">\n            <ng-container *ngTemplateOutlet=\"draggableCell; context: { $implicit: item }\"> </ng-container>\n          </clr-dg-cell>\n        }\n        @for (column of visibleColumns; track column) {\n          <clr-dg-cell class=\"fixed-cell-height\">\n            <appfx-dg-cell-container [column]=\"column\" [item]=\"item\"></appfx-dg-cell-container>\n          </clr-dg-cell>\n        }\n      </clr-dg-row>\n    </ng-template>\n  }\n\n  <!-- Server driven datagrid with virtual scrolling -->\n  @if (serverDrivenDatagrid && virtualScrolling && !treeConfig) {\n    <ng-template\n      ClrVirtualScroll\n      let-item\n      let-i=\"index\"\n      [clrVirtualDataRange]=\"dataRange\"\n      [clrVirtualRowsItemSize]=\"25\"\n      [clrVirtualRowsMinBufferPx]=\"400\"\n      [clrVirtualRowsMaxBufferPx]=\"800\"\n      [clrVirtualRowsTemplateCacheSize]=\"400\"\n      [clrVirtualPersistItems]=\"false\"\n      [clrVirtualRowsTrackBy]=\"trackByFunction\"\n      (renderedRangeChange)=\"renderedRangeChange($event)\"\n    >\n      <clr-dg-row\n        [clrDgItem]=\"item\"\n        [clrDgSelectable]=\"item | isRowSelectable: isRowLocked : rowsDisabled\"\n        [clrDgRowSelectionLabel]=\"\n          $any(item)?.[visibleColumns && visibleColumns.length ? visibleColumns[0].field : -1] ?? null\n        \"\n        (contextmenu)=\"onContextMenu($event, item)\"\n        [clrDgSkeletonLoading]=\"!item\"\n      >\n        @if (dragConfig) {\n          <clr-dg-cell class=\"draggableCell\" [style.width.px]=\"20\">\n            <ng-container *ngTemplateOutlet=\"draggableCell; context: { $implicit: item }\"> </ng-container>\n          </clr-dg-cell>\n        }\n        @for (column of visibleColumns; track column) {\n          <clr-dg-cell class=\"fixed-cell-height\">\n            <appfx-dg-cell-container [column]=\"column\" [item]=\"item\"></appfx-dg-cell-container>\n          </clr-dg-cell>\n        }\n      </clr-dg-row>\n    </ng-template>\n  }\n\n  <!-- Server driven tree datagrid with paging. A tree has no expandable rows. -->\n  @if (serverDrivenDatagrid && !virtualScrolling && treeConfig) {\n    <clr-dg-row\n      *clrDgTreeItems=\"\n        let item of gridItems;\n        getChildren: treeConfig.getChildren;\n        cascadeSelection: !!treeConfig.cascadeSelection\n      \"\n      [clrDgItem]=\"item\"\n      [clrDgDetailOpenLabel]=\"getExpandDetailsLabel(item)\"\n      [clrDgDetailCloseLabel]=\"getCollapseDetailsLabel(item)\"\n      [clrDgTreeExpandable]=\"!treeConfig.hasChildren || treeConfig.hasChildren(item)\"\n      (clrDgExpandedChange)=\"treeExpandedChange.emit({ item: item, expanded: $event })\"\n      [clrDgSelectable]=\"item | isRowSelectable: isRowLocked : rowsDisabled\"\n      [clrDgRowSelectionLabel]=\"$any(item)?.[visibleColumns && visibleColumns.length ? visibleColumns[0].field : -1]\"\n      (contextmenu)=\"onContextMenu($event, item)\"\n    >\n      <clr-dg-action-overflow\n        *ngIf=\"enableSingleRowActions\"\n        (clrDgActionOverflowOpenChange)=\"onRowActionOverflowOpen($event, singleRowActions, item)\"\n      >\n        @for (action of singleRowActions; track action) {\n          <button\n            type=\"button\"\n            class=\"action-item\"\n            (click)=\"onActionClick(action, item)\"\n            [title]=\"action.tooltip\"\n            [disabled]=\"!action.enabled\"\n          >\n            {{ action.label }}\n          </button>\n        }\n      </clr-dg-action-overflow>\n      @if (dragConfig) {\n        <clr-dg-cell class=\"draggableCell\" [style.width.px]=\"20\">\n          <ng-container *ngTemplateOutlet=\"draggableCell; context: { $implicit: item }\"> </ng-container>\n        </clr-dg-cell>\n      }\n      @for (column of visibleColumns; track column) {\n        <clr-dg-cell>\n          <appfx-dg-cell-container [column]=\"column\" [item]=\"item\"></appfx-dg-cell-container>\n        </clr-dg-cell>\n      }\n    </clr-dg-row>\n  }\n\n  <!--  Server driven datagrid with paging -->\n  @if (serverDrivenDatagrid && !virtualScrolling && !treeConfig) {\n    @for (item of gridItems; track trackByFn.bind(this)(i, item); let i = $index) {\n      <clr-dg-row\n        [clrDgItem]=\"item\"\n        [clrDgDetailOpenLabel]=\"getExpandDetailsLabel(item)\"\n        [clrDgDetailCloseLabel]=\"getCollapseDetailsLabel(item)\"\n        [clrDgSelectable]=\"item | isRowSelectable: isRowLocked : rowsDisabled\"\n        [clrDgRowSelectionLabel]=\"\n          $any(item)?.[visibleColumns && visibleColumns.length ? visibleColumns[0].field : -1] ?? null\n        \"\n        (contextmenu)=\"onContextMenu($event, item)\"\n      >\n        <clr-dg-action-overflow\n          *ngIf=\"enableSingleRowActions\"\n          (clrDgActionOverflowOpenChange)=\"onRowActionOverflowOpen($event, singleRowActions, item)\"\n        >\n          @for (action of singleRowActions; track action) {\n            <button\n              class=\"action-item\"\n              (click)=\"onActionClick(action, item)\"\n              [title]=\"action.tooltip\"\n              [disabled]=\"!action.enabled\"\n            >\n              {{ action.label }}\n            </button>\n          }\n        </clr-dg-action-overflow>\n\n        @if (dragConfig) {\n          <clr-dg-cell class=\"draggableCell\" [style.width.px]=\"20\">\n            <ng-container *ngTemplateOutlet=\"draggableCell; context: { $implicit: item }\"> </ng-container>\n          </clr-dg-cell>\n        }\n        @for (column of visibleColumns; track column) {\n          <clr-dg-cell>\n            <appfx-dg-cell-container [column]=\"column\" [item]=\"item\"></appfx-dg-cell-container>\n          </clr-dg-cell>\n        }\n\n        <ng-container *ngIf=\"rowDetailContent\" ngProjectAs=\"clr-dg-row-detail\">\n          @if ({ id: buildRowDetailContentId(i) }; as detailData) {\n            <clr-dg-row-detail\n              *clrIfExpanded=\"rowsExpandedByDefault\"\n              tabindex=\"0\"\n              [attr.aria-describedby]=\"detailData.id\"\n            >\n              <div [id]=\"detailData.id\" class=\"datagrid-row-flex\">\n                <ng-container *ngTemplateOutlet=\"rowDetailContent; context: { item: item }\"> </ng-container>\n              </div>\n            </clr-dg-row-detail>\n          }\n        </ng-container>\n      </clr-dg-row>\n    }\n  }\n\n  <!-- Client side datagrid with paging -->\n  @if (!serverDrivenDatagrid) {\n    <clr-dg-row\n      *clrDgItems=\"let item of gridItems; trackBy: trackByFn.bind(this); index as i\"\n      [clrDgItem]=\"item\"\n      [clrDgDetailOpenLabel]=\"getExpandDetailsLabel(item)\"\n      [clrDgDetailCloseLabel]=\"getCollapseDetailsLabel(item)\"\n      [clrDgSelectable]=\"item | isRowSelectable: isRowLocked : rowsDisabled\"\n      [clrDgRowSelectionLabel]=\"\n        $any(item)?.[visibleColumns && visibleColumns.length ? visibleColumns[0].field : -1] ?? null\n      \"\n      (contextmenu)=\"onContextMenu($event, item)\"\n    >\n      <clr-dg-action-overflow\n        *ngIf=\"enableSingleRowActions\"\n        (clrDgActionOverflowOpenChange)=\"onRowActionOverflowOpen($event, singleRowActions, item)\"\n      >\n        @for (action of singleRowActions; track action) {\n          <button\n            class=\"action-item\"\n            (click)=\"onActionClick(action, item)\"\n            [title]=\"action.tooltip\"\n            [disabled]=\"!action.enabled\"\n          >\n            {{ action.label }}\n          </button>\n        }\n      </clr-dg-action-overflow>\n\n      @if (dragConfig) {\n        <clr-dg-cell class=\"draggableCell\">\n          <ng-container *ngTemplateOutlet=\"draggableCell; context: { $implicit: item }\"> </ng-container>\n        </clr-dg-cell>\n      }\n      @for (column of visibleColumns; track column) {\n        <clr-dg-cell>\n          <appfx-dg-cell-container [column]=\"column\" [item]=\"item\"></appfx-dg-cell-container>\n        </clr-dg-cell>\n      }\n\n      <ng-container *ngIf=\"$any(item).rowDetailRenderer\" ngProjectAs=\"clr-dg-row-detail\">\n        @if ({ id: buildRowDetailContentId(i) }; as detailData) {\n          <clr-dg-row-detail *clrIfExpanded tabindex=\"0\" [attr.aria-describedby]=\"detailData.id\">\n            <appfx-dg-cell-container\n              [id]=\"detailData.id\"\n              [column]=\"{\n                displayName: '',\n                field: '',\n                columnRenderer: $any(item).rowDetailRenderer,\n              }\"\n              [item]=\"item\"\n            ></appfx-dg-cell-container>\n          </clr-dg-row-detail>\n        }\n      </ng-container>\n\n      <ng-container *ngIf=\"rowDetailContent\" ngProjectAs=\"clr-dg-row-detail\">\n        @if ({ id: buildRowDetailContentId(i) }; as detailData) {\n          <clr-dg-row-detail\n            *clrIfExpanded=\"rowsExpandedByDefault\"\n            tabindex=\"0\"\n            [attr.aria-describedby]=\"detailData.id\"\n          >\n            <div [id]=\"detailData.id\" class=\"datagrid-row-flex\">\n              <ng-container *ngTemplateOutlet=\"rowDetailContent; context: { item: item }\"> </ng-container>\n            </div>\n          </clr-dg-row-detail>\n        }\n      </ng-container>\n    </clr-dg-row>\n  }\n\n  <ng-container *ngIf=\"detailHeader || detailBody\" ngProjectAs=\"clr-dg-detail\">\n    <ng-template [clrIfDetail]=\"detailState\" (clrIfDetailChange)=\"onDetailStateChange($event)\" let-detail>\n      <clr-dg-detail>\n        @if (detailHeader) {\n          <clr-dg-detail-header>\n            <ng-container *ngTemplateOutlet=\"detailHeader; context: { $implicit: detail }\"></ng-container>\n          </clr-dg-detail-header>\n        }\n        @if (detailBody) {\n          <clr-dg-detail-body>\n            <ng-container *ngTemplateOutlet=\"detailBody; context: { $implicit: detail }\"></ng-container>\n          </clr-dg-detail-body>\n        }\n      </clr-dg-detail>\n    </ng-template>\n  </ng-container>\n\n  <clr-dg-footer *ngIf=\"gridFooterModel.showFooter\">\n    @if (!gridFooterModel.hideColumnToggle) {\n      <appfx-dg-column-toggle [(columns)]=\"columns\" (columnHiddenStateChange)=\"onColumnHiddenStateChange($event)\">\n      </appfx-dg-column-toggle>\n    }\n\n    @if (enableExportButton) {\n      <appfx-dg-export\n        [allItemsCount]=\"gridFooterModel.clientSideExportConfig?.allItemsCount || listItemsCount\"\n        [selectedItemsCount]=\"selectedItemsCount\"\n        [filteredItemsCount]=\"filteredItemsCount\"\n        (exportEventEmitter)=\"onExportEvent($event)\"\n        class=\"footer-actions\"\n      >\n      </appfx-dg-export>\n    }\n\n    @if (showDeselectAll) {\n      <div class=\"column-switch-wrapper footer-actions\">\n        <button class=\"btn btn-sm column-toggle-action\" [disabled]=\"deselectAllDisabled\" (click)=\"onDeselectAllClick()\">\n          {{ dgStrings.deselectAll }}\n        </button>\n      </div>\n    }\n    <!-- Custom footer actions -->\n    @if (gridFooterModel?.footerActions) {\n      @for (action of gridFooterModel.footerActions; track action) {\n        <div class=\"footer-actions column-switch-wrapper\">\n          @if (action.children) {\n            <clr-dropdown>\n              <button\n                class=\"btn btn-sm column-toggle-action\"\n                clrDropdownTrigger\n                [disabled]=\"!action.enabled\"\n                [attr.aria-label]=\"action.ariaLabel\"\n              >\n                {{ action.label }}\n                <cds-icon shape=\"angle\" direction=\"up\"></cds-icon>\n              </button>\n              <clr-dropdown-menu clrPosition=\"top-left\" *clrIfOpen>\n                @for (childAction of action.children; track childAction) {\n                  <button\n                    type=\"button\"\n                    [disabled]=\"!childAction.enabled\"\n                    [attr.aria-label]=\"childAction.ariaLabel\"\n                    clrDropdownItem\n                    (click)=\"onActionClick(childAction)\"\n                  >\n                    {{ childAction.label }}\n                  </button>\n                }\n              </clr-dropdown-menu>\n            </clr-dropdown>\n          } @else {\n            <button\n              type=\"button\"\n              class=\"column-toggle-action btn btn-sm\"\n              [attr.aria-label]=\"action.ariaLabel\"\n              [disabled]=\"!action.enabled\"\n              (click)=\"onActionClick(action)\"\n            >\n              {{ action.label }}\n            </button>\n          }\n        </div>\n      }\n    }\n    <ng-content select=\".custom-footer-content\"></ng-content>\n\n    <ng-container *ngIf=\"pageSize > 0; else missingPageConfig\" ngProjectAs=\"clr-dg-pagination\">\n      <clr-dg-pagination #pagination [clrDgPageSize]=\"pageSize\" [clrDgTotalItems]=\"totalItems\">\n        @if (pageSizeOptions?.length) {\n          <clr-dg-page-size #clrDgPageSize [clrPageSizeOptions]=\"pageSizeOptions\">\n            <label [for]=\"clrDgPageSize.pageSizeOptionsId\"> {{ dgStrings.itemsPerPage }} </label>\n          </clr-dg-page-size>\n        }\n        {{\n          getFooterMessage(\n            pagination.totalItems,\n            pagination.pageSize,\n            pagination.firstItem + 1,\n            pagination.lastItem + 1\n          )\n        }}\n      </clr-dg-pagination>\n    </ng-container>\n\n    <ng-template #missingPageConfig>\n      @if (!showCustomPagination) {\n        <span class=\"pagination\">\n          {{ getFooterMessage(totalItems, undefined, dataRange.skip + 1, dataRange.skip + dataRange.data.length) }}\n        </span>\n      }\n      @if (showCustomPagination) {\n        <div>\n          <ng-container *ngTemplateOutlet=\"customPagination\"></ng-container>\n        </div>\n      }\n      <ng-template #customPagination>\n        <ng-content></ng-content>\n      </ng-template>\n    </ng-template>\n  </clr-dg-footer>\n</clr-datagrid>\n\n<ng-template #draggableCell let-item>\n  <div cdkDropList [cdkDropListAutoScrollStep]=\"0\" [cdkDropListConnectedTo]=\"dropGroup(dragConfig.dragGroup || '')\">\n    <div\n      cdkDrag\n      cdkDragPreviewContainer=\"parent\"\n      [cdkDragData]=\"draggedItems\"\n      (cdkDragStarted)=\"onDragStart(item)\"\n      (cdkDragMoved)=\"onDragMove()\"\n    >\n      <cds-icon shape=\"drag-handle\" size=\"22\" cdkDragHandle> </cds-icon>\n      <div class=\"custom-placeholder\" *cdkDragPlaceholder></div>\n      <div class=\"custom-preview\" *cdkDragPreview>\n        @if (draggedItems.length === 1) {\n          <div class=\"grid-ghost single-ghost\" [ngClass]=\"{ 'selection-ghost': isItemSelected(item) }\">\n            <ng-container *ngTemplateOutlet=\"draggableGhostContent; context: { $implicit: item }\"> </ng-container>\n          </div>\n        } @else {\n          <div class=\"grid-ghost multiple-ghost selection-ghost\">\n            <ng-container *ngTemplateOutlet=\"draggableGhostContent; context: { $implicit: item }\"> </ng-container>\n          </div>\n          <span class=\"badge badge-purple ghost-badge\">\n            {{ draggedItems.length }}\n          </span>\n        }\n      </div>\n    </div>\n  </div>\n</ng-template>\n\n<ng-template #draggableGhostContent let-item>\n  <cds-icon class=\"drop-status drop-status-valid\" shape=\"plus\" size=\"18\"></cds-icon>\n  <cds-icon class=\"drop-status drop-status-invalid\" shape=\"ban\" size=\"18\"></cds-icon>\n  <i class=\"{{ item.primaryIconId }}\"></i>\n  <span>{{ item[dragConfig.fieldName] }}</span>\n</ng-template>\n",
			styles: ["clr-datagrid .draggableCell{min-width:20px;width:20px;padding-left:0!important;order:-1;flex:0}:host{min-height:3.6rem}:host ::ng-deep clr-datagrid{min-height:0}:host(.zoom2x) ::ng-deep clr-datagrid.flex-clr-datagrid,:host(.zoom4x) ::ng-deep clr-datagrid.flex-clr-datagrid{height:auto!important;flex:1 0 auto!important}:host(.zoom4x){min-height:7.2rem}clr-datagrid.flex-clr-datagrid{flex-basis:auto;height:100%}clr-datagrid .custom-preview{width:250px;overflow:hidden;font-size:var(--cds-alias-typography-secondary-font-size);line-height:var(--cds-alias-typography-secondary-line-height)}clr-datagrid .custom-preview .grid-ghost{border:1px solid var(--clr-table-border-color);border-left:2px solid var(--cds-alias-object-interaction-background-highlight);border-radius:3px 0 0 3px;background-color:var(--cds-global-color-white);padding:5px;max-height:60px;white-space:normal;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3}clr-datagrid .custom-preview .grid-ghost .drop-status{margin-top:-4px}clr-datagrid.datagrid-compact .custom-preview .grid-ghost .drop-status{margin-top:-8px}clr-datagrid clr-dg-cell.fixed-cell-height{height:16px}clr-datagrid .single-ghost{box-shadow:0 3px 4px #7474744d}clr-datagrid .multiple-ghost{box-shadow:8px 7px var(--clr-table-bgcolor),8px 7px var(--clr-table-border-color),8px 8px 4px #7474744d}clr-datagrid .selection-ghost{color:var(--cds-global-color-gray-400);background-color:var(--clr-table-bgcolor)}clr-datagrid .ghost-badge{float:right}clr-datagrid.disabled-grid{pointer-events:none;cursor:not-allowed;opacity:.5}clr-datagrid .draggableCell .draggableIcon{transform:unset}clr-datagrid clr-dg-footer ::ng-deep .footer-actions{margin-left:10px;display:flex;align-items:center}clr-datagrid clr-dg-footer ::ng-deep .footer-actions:not(:disabled):hover,clr-datagrid clr-dg-footer ::ng-deep .footer-actions:not(:disabled):active{cursor:pointer;text-decoration:none}clr-datagrid clr-dg-footer ::ng-deep .datagrid-footer-description{display:flex;text-align:left}clr-datagrid clr-dg-footer ::ng-deep li{white-space:normal}clr-datagrid clr-dg-footer clr-dg-pagination{display:inline-flex;align-items:center}clr-datagrid clr-dg-footer clr-dg-pagination ::ng-deep>ul{height:auto}clr-datagrid clr-dg-column ::ng-deep .datagrid-column-flex{width:100%}clr-datagrid clr-dg-column.grabbed:not(.cdk-drag-placeholder,.cdk-drag-preview)::ng-deep .datagrid-column-title{background-color:var(--clr-datagrid-row-selected-background-color);color:var(--clr-datagrid-row-selected)}clr-datagrid clr-dg-column.grabbed:not(.cdk-drag-placeholder,.cdk-drag-preview){background-color:var(--clr-datagrid-row-selected-background-color);color:var(--clr-datagrid-row-selected)}clr-datagrid clr-dg-column.cdk-drag-placeholder{outline:var(--cds-alias-object-interaction-outline);outline-color:-webkit-focus-ring-color;outline-offset:var(--clr-datagrid-cell-outline-offset);z-index:100}clr-datagrid clr-dg-column.cdk-drag-preview{opacity:.75}clr-datagrid clr-dg-action-bar .appfx-datagrid-actions-container{display:flex;justify-content:space-between}clr-datagrid clr-dg-action-bar .appfx-datagrid-actions-container .filter-input{display:flex;flex-direction:row;align-items:center}clr-datagrid clr-dg-action-bar .appfx-datagrid-actions-container .filter-input cds-icon{cursor:pointer}clr-datagrid clr-dg-action-bar .appfx-datagrid-actions-container .action-bar{flex:1 0 auto;width:.05rem}clr-datagrid clr-dg-row-detail appfx-dg-cell-container{width:100%}clr-datagrid clr-dg-row-detail::ng-deep appfx-datagrid div.datagrid-header{z-index:500}clr-datagrid.zoom4x{min-height:7.2rem}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container{flex-direction:column}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .action-bar{flex:1 0 auto;width:100%;max-width:100%;min-width:1px}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .action-bar ::ng-deep .btn-group button:first-child{padding-left:10px}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input{padding-left:10px;width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input cds-icon{flex:0 1 auto}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input clr-input-container{flex:1 0 auto}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input clr-input-container ::ng-deep .clr-control-container{width:100%}clr-datagrid.zoom4x clr-dg-action-bar .appfx-datagrid-actions-container .filter-input clr-input-container ::ng-deep .clr-control-container input{width:100%}clr-datagrid.zoom4x ::ng-deep .column-switch-wrapper clr-dropdown-menu{position:fixed!important;transform:none!important;width:100%;min-width:100%;height:100%}clr-datagrid .custom-placeholder{height:0;width:0}clr-datagrid cds-icon[shape=drag-handle]{cursor:grab}.drop-status{display:none;margin-left:4px;color:var(--cds-global-color-black)}:host-context(body.drag-valid-target) .drop-status-valid{display:inline-block}:host-context(body.drag-invalid-target) .drop-status-invalid{display:inline-block}:host-context([data-theme=dark]) clr-datagrid .custom-preview .grid-ghost{background-color:var(--clr-table-bgcolor)}:host-context([data-theme=dark]) clr-datagrid .custom-preview .grid-ghost .drop-status{color:var(--cds-global-color-white)}\n"]
		}]
	}],
	ctorParameters: () => [
		{ type: DatagridStrings },
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [uniqueIdToken]
			}]
		},
		{ type: i0.ChangeDetectorRef },
		{ type: ExportProviderService },
		{
			type: i3.DragAndDropGroupService,
			decorators: [{ type: Optional }]
		},
		{
			type: i1$2.ZoomLevelService,
			decorators: [{ type: Optional }]
		}
	],
	propDecorators: {
		clrDatagridPagination: [{
			type: ViewChild,
			args: [ClrDatagridPagination]
		}],
		loading: [{ type: Input }],
		loadingMoreItems: [{ type: Input }],
		preSelectFirstItem: [{ type: Input }],
		pageSizeOptions: [{ type: Input }],
		totalItems: [{ type: Input }],
		showCustomPagination: [{ type: Input }],
		serverDrivenDatagrid: [{ type: Input }],
		listItemsCount: [{ type: Input }],
		rowDetailContent: [{ type: Input }],
		rowsExpandedByDefault: [{ type: Input }],
		trackByFunction: [{ type: Input }],
		trackByGridItemProperty: [{ type: Input }],
		detailHeader: [{ type: Input }],
		detailBody: [{ type: Input }],
		detailState: [{ type: Input }],
		detailStateChange: [{ type: Output }],
		isRowLocked: [{ type: Input }],
		dragConfig: [{ type: Input }],
		filterableProperties: [{ type: Input }],
		filterMode: [{ type: Input }],
		singleRowActions: [{ type: Input }],
		preserveExistingSelectionOnFilter: [{ type: Input }],
		virtualScrolling: [{ type: Input }],
		disableUnsort: [{ type: Input }],
		enableColumnActions: [{ type: Input }],
		columnActions: [{ type: Input }],
		dataRange: [{ type: Input }],
		gridItems: [{ type: Input }],
		treeConfig: [{ type: Input }],
		pageSizeChange: [{ type: Output }],
		gridItemsChange: [{ type: Output }],
		advancedFilterChange: [{ type: Output }],
		columnDefsChange: [{ type: Output }],
		selectedItemsChange: [{ type: Output }],
		exportDataEvent: [{ type: Output }],
		searchTermChange: [{ type: Output }],
		columnResize: [{ type: Output }],
		columnSortOrderChange: [{ type: Output }],
		columnHiddenStateChange: [{ type: Output }],
		columnPinnedChange: [{ type: Output }],
		columnFilterChange: [{ type: Output }],
		refreshGridData: [{ type: Output }],
		refreshVirtualGridData: [{ type: Output }],
		actionClick: [{ type: Output }],
		rowActionMenuOpenChange: [{ type: Output }],
		openContextMenu: [{ type: Output }],
		columnOrderChange: [{ type: Output }],
		treeExpandedChange: [{ type: Output }],
		applyFlexLayout: [{
			type: HostBinding,
			args: ["class.embedded-flex-component"]
		}],
		zoomLevel: [{
			type: HostBinding,
			args: ["class"]
		}],
		clrDatagrid: [{
			type: ViewChild,
			args: [ClrDatagrid, { static: true }]
		}],
		layoutModel: [{ type: Input }],
		footerModel: [{ type: Input }],
		columns: [{ type: Input }],
		selectionType: [{ type: Input }],
		selectedItems: [{ type: Input }],
		rowSelectionMode: [{ type: Input }],
		actionBarActions: [{ type: Input }],
		pageSize: [{ type: Input }],
		datagridLabels: [{ type: Input }]
	}
});
var DatagridPageDirective = class DatagridPageDirective {
	constructor(datagrid) {
		this.datagridPageChange = new EventEmitter(false);
		this.initCompleted = false;
		this.component = datagrid;
	}
	set datagridPage(value) {
		if (this.initCompleted) this.component.clrDatagridPagination.currentPage = value;
		else this.initialPage = value;
	}
	ngAfterViewInit() {
		this.subscription = this.component.clrDatagridPagination.currentChanged.subscribe((page) => this.datagridPageChange.emit(page));
		if (this.initialPage > 1) {
			if (this.component.serverDrivenDatagrid) this.component.clrDatagridPagination.currentPage = this.initialPage;
			else setTimeout(() => {
				this.component.clrDatagridPagination.currentPage = this.initialPage;
			}, 0);
		}
		this.initCompleted = true;
	}
	ngOnDestroy() {
		if (this.subscription) this.subscription.unsubscribe();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridPageDirective,
			deps: [{
				token: DatagridComponent,
				host: true
			}],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: DatagridPageDirective,
			isStandalone: false,
			selector: "[datagridPage]",
			inputs: { datagridPage: "datagridPage" },
			outputs: { datagridPageChange: "datagridPageChange" },
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridPageDirective,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[datagridPage]",
			standalone: false
		}]
	}],
	ctorParameters: () => [{
		type: DatagridComponent,
		decorators: [{ type: Host }]
	}],
	propDecorators: {
		datagridPageChange: [{ type: Output }],
		datagridPage: [{ type: Input }]
	}
});
const appfxDatagridPersistSettingsToken = new InjectionToken("service that store and read data from local browser storage");
var DatagridPersistSettingsDirective = class DatagridPersistSettingsDirective {
	constructor(grid, persistDatagridSettingsService) {
		this.grid = grid;
		this.persistDatagridSettingsService = persistDatagridSettingsService;
		this.subs = new Subscription();
		this.datagridKeyChange$ = new Subject();
		this.storePageSize = true;
		this.storeSortOrder = true;
		this.initialiseDatagridWithPersistedSettings();
	}
	set appfxPersistDatagridSettings(key) {
		this.datagridKey = key;
		this.datagridKeyChange$.next(key);
	}
	set persistPageSize(value) {
		this.storePageSize = value;
	}
	set persistSortOrder(value) {
		this.storeSortOrder = value;
	}
	ngAfterViewInit() {
		if (!this.datagridKey) return;
		this.subs.add(this.grid.columnResize.subscribe((data) => {
			data.column.width = data.columnSize + "px";
			this.saveColumnStates();
		}));
		this.subs.add(this.grid.columnOrderChange.subscribe(() => {
			this.saveColumnStates();
		}));
		this.subs.add(this.grid.columnHiddenStateChange.subscribe((data) => {
			data.column.hidden = data.hidden;
			this.saveColumnStates();
		}));
		if (this.storeSortOrder) this.subs.add(this.grid.columnSortOrderChange.subscribe((data) => {
			this.saveColumnSortOrder(data);
		}));
		if (this.storePageSize) this.subs.add(this.grid.refreshGridData.subscribe((clrDatagridState) => {
			const clrPageSize = clrDatagridState?.page?.size || 0;
			if (clrPageSize > 0 && clrPageSize !== this.grid.pageSize) {
				this.grid.pageSize = clrPageSize;
				this.savePageSize(clrPageSize);
			}
		}));
	}
	ngOnDestroy() {
		this.subs.unsubscribe();
	}
	saveColumnStates() {
		if (this.saveColumnsStateTimerId) clearTimeout(this.saveColumnsStateTimerId);
		this.saveColumnsStateTimerId = setTimeout(() => {
			this.saveColumnsData();
		}, 100);
	}
	saveColumnsData() {
		const persistedData = this.getPersistedData();
		persistedData.columns = this.grid.columns.map((column) => this.createPersistedColumnState(column));
		if (persistedData.sorting) {
			const columnDef = persistedData.columns.find((column) => {
				return column.uid === persistedData.sorting?.column.uid;
			});
			if (columnDef) persistedData.sorting.column = columnDef;
		}
		this.setPersistedData(persistedData);
	}
	saveColumnSortOrder(columnSortOrder) {
		const persistedData = this.getPersistedData();
		const column = this.createPersistedColumnState(columnSortOrder.column);
		persistedData.sorting = {
			sortOrder: columnSortOrder?.sortOrder,
			column
		};
		this.setPersistedData(persistedData);
	}
	savePageSize(pageSize) {
		const data = this.getPersistedData();
		data.pageSize = pageSize;
		this.setPersistedData(data);
	}
	createPersistedColumnState(column) {
		const width = column.width ? parseInt(column.width, 10) : void 0;
		return {
			headerText: column.displayName,
			visible: column.hidden !== true,
			width,
			uid: this.getColumnUid(column)
		};
	}
	setPersistedData(data) {
		if (!this.datagridKey) return;
		if (!this.persistDatagridSettingsService) {
			console.error("Persist datagrid service is not provided.");
			return;
		}
		this.persistDatagridSettingsService.setUserData(this.getListViewColumnDefKey(this.datagridKey), data);
	}
	getPersistedData() {
		if (!this.datagridKey || !this.persistDatagridSettingsService) return {};
		return this.persistDatagridSettingsService.getUserDataSync(this.getListViewColumnDefKey(this.datagridKey)) || {};
	}
	getListViewColumnDefKey(datagridId) {
		return datagridId + "_AppfxDatagridSettingsDef";
	}
	initialiseDatagridWithPersistedSettings() {
		this.subs.add(combineLatest([this.datagridKeyChange$.asObservable(), this.grid.columnDefsChange.pipe(first())]).subscribe(() => {
			this.updateDatagridColumnDefinitions();
		}));
		this.subs.add(combineLatest([this.datagridKeyChange$.asObservable(), this.grid.pageSizeChange.pipe(first())]).subscribe(() => {
			this.updateDatagridPageSize();
		}));
	}
	updateDatagridPageSize() {
		const persistedPageSize = this.getPersistedData()?.pageSize || 0;
		if (persistedPageSize > 0 && this.grid.pageSize !== persistedPageSize) this.grid.pageSize = persistedPageSize;
	}
	updateDatagridColumnDefinitions() {
		const data = this.getPersistedData();
		if (!data.columns && !data.sorting) return;
		const columnsMap = /* @__PURE__ */ new Map();
		this.grid.columns.forEach((column) => {
			const uid = this.getColumnUid(column);
			this.applySorting(uid, column, data.sorting);
			columnsMap.set(uid, { ...column });
		});
		if (data.columns && columnsMap.size === data.columns.length) this.applyPersistedColumnSettings(data.columns, columnsMap);
	}
	applyPersistedColumnSettings(columns, columnsDefinitionsMap) {
		const columnsOrder = [];
		columns.forEach((columnPersistedState) => {
			const column = columnsDefinitionsMap.get(columnPersistedState.uid);
			if (column) {
				column.width = columnPersistedState.width ? columnPersistedState.width + "px" : void 0;
				column.hidden = !columnPersistedState.visible;
				columnsOrder.push(column);
				columnsDefinitionsMap.delete(columnPersistedState.uid);
			}
		});
		if (columnsOrder && columnsOrder.length === this.grid.columns.length && columnsDefinitionsMap.size === 0) {
			this.grid.columns = columnsOrder;
			this.grid.visibleColumns = this.grid.columns.filter((column) => !column.hidden);
		}
	}
	applySorting(columnUid, column, sorting) {
		if (!sorting?.column.visible) return;
		if (columnUid === sorting?.column?.uid) column.defaultSortOrder = sorting.sortOrder;
		if (column.defaultSortOrder && columnUid !== sorting?.column?.uid) column.defaultSortOrder = void 0;
	}
	getColumnUid(column) {
		return column.uid || column.field || column.displayName;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridPersistSettingsDirective,
			deps: [{
				token: DatagridComponent,
				host: true
			}, {
				token: appfxDatagridPersistSettingsToken,
				optional: true
			}],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: DatagridPersistSettingsDirective,
			isStandalone: false,
			selector: "appfx-datagrid[appfxPersistDatagridSettings]",
			inputs: {
				appfxPersistDatagridSettings: "appfxPersistDatagridSettings",
				persistPageSize: "persistPageSize",
				persistSortOrder: "persistSortOrder"
			},
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridPersistSettingsDirective,
	decorators: [{
		type: Directive,
		args: [{
			selector: "appfx-datagrid[appfxPersistDatagridSettings]",
			standalone: false
		}]
	}],
	ctorParameters: () => [{
		type: DatagridComponent,
		decorators: [{ type: Host }]
	}, {
		type: void 0,
		decorators: [{ type: Optional }, {
			type: Inject,
			args: [appfxDatagridPersistSettingsToken]
		}]
	}],
	propDecorators: {
		appfxPersistDatagridSettings: [{ type: Input }],
		persistPageSize: [{ type: Input }],
		persistSortOrder: [{ type: Input }]
	}
});
const appfxDatagridUserPreferencesToken = new InjectionToken("Service that stores and reads user preferences related to the datagrid.");
var DatagridContentNoWrapDirective = class DatagridContentNoWrapDirective {
	constructor(grid, userPreferencesService) {
		this.grid = grid;
		this.userPreferencesService = userPreferencesService;
		this.subs = new Subscription();
		if (userPreferencesService) this.subs.add(userPreferencesService.getWrapGridCellTextPreference$().subscribe((data) => {
			grid.wrapText = data;
		}));
	}
	ngOnDestroy() {
		this.subs.unsubscribe();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridContentNoWrapDirective,
			deps: [{
				token: DatagridComponent,
				host: true
			}, {
				token: appfxDatagridUserPreferencesToken,
				optional: true
			}],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: DatagridContentNoWrapDirective,
			isStandalone: false,
			selector: "appfx-datagrid",
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridContentNoWrapDirective,
	decorators: [{
		type: Directive,
		args: [{
			selector: "appfx-datagrid",
			standalone: false
		}]
	}],
	ctorParameters: () => [{
		type: DatagridComponent,
		decorators: [{ type: Host }]
	}, {
		type: void 0,
		decorators: [{ type: Optional }, {
			type: Inject,
			args: [appfxDatagridUserPreferencesToken]
		}]
	}]
});
var FieldComparator = class {
	constructor(compareField) {
		this.field = compareField;
	}
	compare(a, b) {
		if (!a[this.field] && !b[this.field]) return 0;
		else if (!a[this.field] && b[this.field]) return 1;
		else if (a[this.field] && !b[this.field]) return -1;
		else if (a[this.field] > b[this.field]) return 1;
		else if (a[this.field] < b[this.field]) return -1;
		else return 0;
	}
};
var ListComparator = class {
	constructor(compareField) {
		this.field = compareField;
	}
	compare(a, b) {
		if (!a[this.field] && !b[this.field]) return 0;
		else if (!a[this.field] && b[this.field]) return 1;
		else if (a[this.field] && !b[this.field]) return -1;
		else return a[this.field].length > b[this.field].length ? -1 : 1;
	}
};
function compareNumericValues(itemA, itemB, fieldName) {
	const firstValue = Number(itemA[fieldName]);
	const secondValue = Number(itemB[fieldName]);
	if (isNaN(firstValue) && isNaN(secondValue)) return 0;
	if (isNaN(firstValue)) return -1;
	if (isNaN(secondValue)) return 1;
	return firstValue - secondValue;
}
var SimpleNumericComparator = class {
	constructor(fieldName) {
		this.fieldName = fieldName;
	}
	compare(first, second) {
		return compareNumericValues(first, second, this.fieldName);
	}
};
var DatagridColumnsOrderModule = class DatagridColumnsOrderModule {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridColumnsOrderModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridColumnsOrderModule,
			declarations: [
				ColumnMoveActionDirective,
				ColumnOrderDirective,
				DatagridColumnsOrderDirective
			],
			imports: [
				ClrDatagridModule,
				CommonModule,
				DragDropModule
			],
			exports: [
				ColumnMoveActionDirective,
				ColumnOrderDirective,
				DatagridColumnsOrderDirective
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridColumnsOrderModule,
			imports: [
				ClrDatagridModule,
				CommonModule,
				DragDropModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridColumnsOrderModule,
	decorators: [{
		type: NgModule,
		args: [{
			declarations: [
				ColumnMoveActionDirective,
				ColumnOrderDirective,
				DatagridColumnsOrderDirective
			],
			imports: [
				ClrDatagridModule,
				CommonModule,
				DragDropModule
			],
			exports: [
				ColumnMoveActionDirective,
				ColumnOrderDirective,
				DatagridColumnsOrderDirective
			]
		}]
	}]
});
function datagridStringsServiceFactory(existing) {
	return existing || new DatagridStrings();
}
const exportedComponents = [
	DatagridComponent,
	DatagridActionBarComponent,
	DatagridFilterComponent
];
const exportedDirectives = [
	DatagridPageDirective,
	DatagridPersistSettingsDirective,
	DatagridPreserveSelectionDirective,
	DatagridContentNoWrapDirective
];
var AppfxDatagridModule = class AppfxDatagridModule {
	constructor() {
		ClarityIcons.addIcons(angleDoubleIcon, angleIcon, banIcon, dragHandleIcon, plusIcon);
	}
	static forRoot(errorNotifiableService) {
		return {
			ngModule: AppfxDatagridModule,
			providers: [{
				provide: appfxDatagridErrorNotifiableToken,
				useClass: errorNotifiableService
			}]
		};
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxDatagridModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxDatagridModule,
			declarations: [
				DatagridComponent,
				DatagridActionBarComponent,
				DatagridFilterComponent,
				DatagridPageDirective,
				DatagridPersistSettingsDirective,
				DatagridPreserveSelectionDirective,
				DatagridContentNoWrapDirective,
				DatagridCellContainerComponent,
				DatagridColumnToggleComponent,
				DatagridFilterContainerComponent,
				ExportDatagridComponent,
				IsRowSelectablePipe
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
				FormsModule
			],
			exports: [
				DatagridComponent,
				DatagridActionBarComponent,
				DatagridFilterComponent,
				DatagridPageDirective,
				DatagridPersistSettingsDirective,
				DatagridPreserveSelectionDirective,
				DatagridContentNoWrapDirective
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxDatagridModule,
			providers: [
				CsvHelperService,
				ExportProviderService,
				{
					provide: DatagridStrings,
					useFactory: datagridStringsServiceFactory,
					deps: [[
						new Optional(),
						new SkipSelf(),
						DatagridStrings
					]]
				}
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
				FormsModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: AppfxDatagridModule,
	decorators: [{
		type: NgModule,
		args: [{
			declarations: [
				...exportedComponents,
				...exportedDirectives,
				DatagridCellContainerComponent,
				DatagridColumnToggleComponent,
				DatagridFilterContainerComponent,
				ExportDatagridComponent,
				IsRowSelectablePipe
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
				FormsModule
			],
			exports: [...exportedComponents, ...exportedDirectives],
			providers: [
				CsvHelperService,
				ExportProviderService,
				{
					provide: DatagridStrings,
					useFactory: datagridStringsServiceFactory,
					deps: [[
						new Optional(),
						new SkipSelf(),
						DatagridStrings
					]]
				}
			]
		}]
	}],
	ctorParameters: () => []
});
var DatagridFeatureStates = class DatagridFeatureStates {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridFeatureStates,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridFeatureStates
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridFeatureStates,
	decorators: [{ type: Injectable }]
});
var CaseInsensitiveContainsStringFilter = class {
	constructor(fieldName) {
		this.fieldName = fieldName;
	}
	accepts(item, search) {
		const currentItem = "" + item[this.fieldName];
		return currentItem === search || currentItem.toLowerCase().indexOf(search) >= 0;
	}
};
export { ActionBarLayout, AppfxDatagridModule, CaseInsensitiveContainsStringFilter, CsvHelperService, DatagridActionBarComponent, DatagridComponent, DatagridContentNoWrapDirective, DatagridFeatureStates, DatagridFilterComponent, DatagridPageDirective, DatagridPersistSettingsDirective, DatagridPreserveSelectionDirective, DatagridStrings, ExportProviderService, ExportType, FieldComparator, ListComparator, SimpleNumericComparator, appfxDatagridErrorNotifiableToken, appfxDatagridPersistSettingsToken, appfxDatagridUserPreferencesToken, appfxPreselectableComponentToken };

//# sourceMappingURL=clr-addons-datagrid.mjs.map
import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, Component, Directive, ElementRef, EventEmitter, Injectable, Input, NgModule, Output, Pipe, ViewChild, ViewContainerRef } from "@angular/core";
import { ReplaySubject, of } from "rxjs";
import { By } from "@angular/platform-browser";
import { ClrDatagrid } from "@clr/angular/data/datagrid";
import { FilterMode } from "@clr/addons/datagrid-filters";
import { StepValidationState } from "@clr/addons/var";
import { PropertyViewModelType, PropertyViewStrings } from "@clr/addons/property-view";
import { ClrTabs } from "@clr/angular/layout/tabs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { tap } from "rxjs/operators";
var MockRequiredFieldLegendComponent = class MockRequiredFieldLegendComponent {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockRequiredFieldLegendComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockRequiredFieldLegendComponent,
			isStandalone: false,
			selector: "appfx-required-field-legend",
			ngImport: i0,
			template: ``,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockRequiredFieldLegendComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-required-field-legend",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: ``
		}]
	}]
});
var MockRequiredFieldLegendStandaloneComponent = class MockRequiredFieldLegendStandaloneComponent extends MockRequiredFieldLegendComponent {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockRequiredFieldLegendStandaloneComponent,
			deps: null,
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockRequiredFieldLegendStandaloneComponent,
			isStandalone: true,
			selector: "appfx-required-field-legend",
			usesInheritance: true,
			ngImport: i0,
			template: ``,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockRequiredFieldLegendStandaloneComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-required-field-legend",
			standalone: true,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: ``
		}]
	}]
});
var ZoomLevelServiceMock = class {
	constructor() {
		this.resizeSubject = new ReplaySubject(1);
		this.onChange = this.resizeSubject.asObservable();
	}
};
var MockAppfxCardContainerComponent = class MockAppfxCardContainerComponent {
	constructor() {
		this.cards = [];
		this.showCardContainerSettings = true;
		this.dragDropEnabled = true;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockAppfxCardContainerComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockAppfxCardContainerComponent,
			isStandalone: false,
			selector: "appfx-card-container",
			inputs: {
				containerId: "containerId",
				cards: "cards",
				persistenceStore: "persistenceStore",
				showCardContainerSettings: "showCardContainerSettings",
				dragDropEnabled: "dragDropEnabled"
			},
			ngImport: i0,
			template: "",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockAppfxCardContainerComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-card-container",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: ""
		}]
	}],
	propDecorators: {
		containerId: [{ type: Input }],
		cards: [{ type: Input }],
		persistenceStore: [{ type: Input }],
		showCardContainerSettings: [{ type: Input }],
		dragDropEnabled: [{ type: Input }]
	}
});
var MockAppfxCardContainerStandaloneComponent = class MockAppfxCardContainerStandaloneComponent extends MockAppfxCardContainerComponent {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockAppfxCardContainerStandaloneComponent,
			deps: null,
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockAppfxCardContainerStandaloneComponent,
			isStandalone: true,
			selector: "appfx-card-container",
			usesInheritance: true,
			ngImport: i0,
			template: "",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockAppfxCardContainerStandaloneComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-card-container",
			standalone: true,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: ""
		}]
	}]
});
var MockContainerService = class {
	getCardOrder() {}
	moveCard() {}
	getVisibleCardsCount() {}
};
var MockA11yService = class {
	isSelected() {}
	isDraggableOver() {}
	selectCard() {}
	moveDropPosition() {}
};
var MockDragDropService = class {
	onDragStart() {}
	onDragDrop() {}
};
var MockLayoutService = class {
	updateCardSize() {}
};
var MockRenderer2 = class {
	setStyle(el, name, style) {
		el[name] = style;
	}
	removeStyle(el, name) {
		el[name] = null;
	}
};
var MockCardContainerComponent = class MockCardContainerComponent {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockCardContainerComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockCardContainerComponent,
			isStandalone: false,
			selector: "ng-component",
			viewQueries: [{
				propertyName: "cardContainer",
				first: true,
				predicate: ["cardContainer"],
				descendants: true,
				read: ViewContainerRef,
				static: true
			}],
			ngImport: i0,
			template: `
    <div class="scrollable">
      <div>
        <ng-template #cardContainer></ng-template>
      </div>
    </div>
  `,
			isInline: true,
			styles: [".scrollable{overflow:auto;position:absolute;inset:0;max-height:20px}\n"],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockCardContainerComponent,
	decorators: [{
		type: Component,
		args: [{
			standalone: false,
			template: `
    <div class="scrollable">
      <div>
        <ng-template #cardContainer></ng-template>
      </div>
    </div>
  `,
			changeDetection: ChangeDetectionStrategy.Eager,
			styles: [".scrollable{overflow:auto;position:absolute;inset:0;max-height:20px}\n"]
		}]
	}],
	propDecorators: { cardContainer: [{
		type: ViewChild,
		args: ["cardContainer", {
			read: ViewContainerRef,
			static: true
		}]
	}] }
});
var SampleCardComponent = class SampleCardComponent {
	constructor(el) {
		this.eleRef = el;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: SampleCardComponent,
			deps: [{ token: i0.ElementRef }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: SampleCardComponent,
			isStandalone: false,
			selector: "ng-component",
			ngImport: i0,
			template: `
    <div class="card">
      <div class="card-header">
        <div class="card-title">Sample Card</div>
      </div>
      <div class="card-block"></div>
      <div class="card-footer"></div>
    </div>
  `,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: SampleCardComponent,
	decorators: [{
		type: Component,
		args: [{
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: `
    <div class="card">
      <div class="card-header">
        <div class="card-title">Sample Card</div>
      </div>
      <div class="card-block"></div>
      <div class="card-footer"></div>
    </div>
  `
		}]
	}],
	ctorParameters: () => [{ type: i0.ElementRef }]
});
var SampleCardWithoutFooterComponent = class SampleCardWithoutFooterComponent {
	constructor(el) {
		this.eleRef = el;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: SampleCardWithoutFooterComponent,
			deps: [{ token: i0.ElementRef }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: SampleCardWithoutFooterComponent,
			isStandalone: false,
			selector: "ng-component",
			ngImport: i0,
			template: `
    <div class="card">
      <div class="card-header">
        <div class="card-title">Sample Card</div>
      </div>
      <div class="card-block"></div>
    </div>
  `,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: SampleCardWithoutFooterComponent,
	decorators: [{
		type: Component,
		args: [{
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: `
    <div class="card">
      <div class="card-header">
        <div class="card-title">Sample Card</div>
      </div>
      <div class="card-block"></div>
    </div>
  `
		}]
	}],
	ctorParameters: () => [{ type: i0.ElementRef }]
});
var SampleCardWithoutHeaderComponent = class SampleCardWithoutHeaderComponent {
	constructor(el) {
		this.eleRef = el;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: SampleCardWithoutHeaderComponent,
			deps: [{ token: i0.ElementRef }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: SampleCardWithoutHeaderComponent,
			isStandalone: false,
			selector: "ng-component",
			ngImport: i0,
			template: `
    <div class="card">
      <div class="card-block">
        <div class="card-title">Sample Card</div>
      </div>
      <div class="card-footer"></div>
    </div>
  `,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: SampleCardWithoutHeaderComponent,
	decorators: [{
		type: Component,
		args: [{
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: `
    <div class="card">
      <div class="card-block">
        <div class="card-title">Sample Card</div>
      </div>
      <div class="card-footer"></div>
    </div>
  `
		}]
	}],
	ctorParameters: () => [{ type: i0.ElementRef }]
});
var MockElementRef = class extends ElementRef {
	constructor() {
		super(...arguments);
		this.nativeElement = { querySelector: () => {} };
	}
};
const sortCardsFn = (a, b) => {
	if (a.title && b.title) return a.title.localeCompare(b.title);
	return 0;
};
const sampleCards = [
	{
		id: "sample-card-1",
		title: "Sample Card 1",
		componentClass: SampleCardComponent,
		hidden: false,
		order: 0,
		view: void 0
	},
	{
		id: "sample-card-2",
		title: "Sample Card 2",
		componentClass: SampleCardComponent,
		hidden: false,
		canHide: false,
		order: 1,
		view: void 0
	},
	{
		id: "sample-card-3",
		title: "Sample Card 3",
		componentClass: SampleCardComponent,
		hidden: false,
		canHide: false,
		order: 5,
		view: void 0
	}
];
const sampleCardsSettings = [
	{
		id: "sample-card-1",
		hidden: false,
		order: 0
	},
	{
		id: "sample-card-2",
		hidden: true,
		order: 2
	},
	{
		id: "sample-card-3",
		hidden: false,
		order: 5
	}
];
const cardIdToOrder = {
	cardWithDefaultOrder: Infinity,
	[sampleCards[0].id]: 0,
	[sampleCards[1].id]: 1,
	[sampleCards[2].id]: 2
};
var MockAppfxDatagridComponent = class MockAppfxDatagridComponent {
	constructor() {
		this.detailState = null;
		this.selectedItemsChange = new EventEmitter();
		this.gridItemsChange = new EventEmitter();
		this.selectionChange = new EventEmitter();
		this.searchTermChange = new EventEmitter();
		this.refreshGridData = new EventEmitter();
		this.refreshVirtualGridData = new EventEmitter();
		this.actionClick = new EventEmitter();
		this.rowActionMenuOpenChange = new EventEmitter();
		this.exportDataEvent = new EventEmitter();
		this.detailStateChange = new EventEmitter(true);
	}
	onModelChange() {}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockAppfxDatagridComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockAppfxDatagridComponent,
			isStandalone: false,
			selector: "appfx-datagrid",
			inputs: {
				gridItems: "gridItems",
				columns: "columns",
				layoutModel: "layoutModel",
				footerModel: "footerModel",
				pageSize: "pageSize",
				pageSizeOptions: "pageSizeOptions",
				totalItems: "totalItems",
				selectionType: "selectionType",
				selectedItems: "selectedItems",
				datagridLabels: "datagridLabels",
				preSelectFirstItem: "preSelectFirstItem",
				rowSelectionMode: "rowSelectionMode",
				actionBarActions: "actionBarActions",
				showFooter: "showFooter",
				singleRowActions: "singleRowActions",
				noItemsFoundPlaceholder: "noItemsFoundPlaceholder",
				loading: "loading",
				serverDrivenDatagrid: "serverDrivenDatagrid",
				filterMode: "filterMode",
				listItemsCount: "listItemsCount",
				trackByGridItemProperty: "trackByGridItemProperty",
				isRowLocked: "isRowLocked",
				detailHeader: "detailHeader",
				detailBody: "detailBody",
				rowDetailContent: "rowDetailContent",
				rowsExpandedByDefault: "rowsExpandedByDefault",
				vscPersistDatagridSettings: "vscPersistDatagridSettings",
				detailState: "detailState",
				trackByFunction: "trackByFunction",
				virtualScrolling: "virtualScrolling",
				dataRange: "dataRange"
			},
			outputs: {
				selectedItemsChange: "selectedItemsChange",
				gridItemsChange: "gridItemsChange",
				selectionChange: "selectionChange",
				searchTermChange: "searchTermChange",
				refreshGridData: "refreshGridData",
				refreshVirtualGridData: "refreshVirtualGridData",
				actionClick: "actionClick",
				rowActionMenuOpenChange: "rowActionMenuOpenChange",
				exportDataEvent: "exportDataEvent",
				detailStateChange: "detailStateChange"
			},
			ngImport: i0,
			template: ``,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockAppfxDatagridComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-datagrid",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: ``
		}]
	}],
	propDecorators: {
		gridItems: [{ type: Input }],
		columns: [{ type: Input }],
		layoutModel: [{ type: Input }],
		footerModel: [{ type: Input }],
		pageSize: [{ type: Input }],
		pageSizeOptions: [{ type: Input }],
		totalItems: [{ type: Input }],
		selectionType: [{ type: Input }],
		selectedItems: [{ type: Input }],
		datagridLabels: [{ type: Input }],
		preSelectFirstItem: [{ type: Input }],
		rowSelectionMode: [{ type: Input }],
		actionBarActions: [{ type: Input }],
		showFooter: [{ type: Input }],
		singleRowActions: [{ type: Input }],
		noItemsFoundPlaceholder: [{ type: Input }],
		loading: [{ type: Input }],
		serverDrivenDatagrid: [{ type: Input }],
		filterMode: [{ type: Input }],
		listItemsCount: [{ type: Input }],
		trackByGridItemProperty: [{ type: Input }],
		isRowLocked: [{ type: Input }],
		detailHeader: [{ type: Input }],
		detailBody: [{ type: Input }],
		rowDetailContent: [{ type: Input }],
		rowsExpandedByDefault: [{ type: Input }],
		vscPersistDatagridSettings: [{ type: Input }],
		detailState: [{ type: Input }],
		trackByFunction: [{ type: Input }],
		virtualScrolling: [{ type: Input }],
		dataRange: [{ type: Input }],
		selectedItemsChange: [{ type: Output }],
		gridItemsChange: [{ type: Output }],
		selectionChange: [{ type: Output }],
		searchTermChange: [{ type: Output }],
		refreshGridData: [{ type: Output }],
		refreshVirtualGridData: [{ type: Output }],
		actionClick: [{ type: Output }],
		rowActionMenuOpenChange: [{ type: Output }],
		exportDataEvent: [{ type: Output }],
		detailStateChange: [{ type: Output }]
	}
});
var MockStandaloneDatagridComponent = class MockStandaloneDatagridComponent extends MockAppfxDatagridComponent {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockStandaloneDatagridComponent,
			deps: null,
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockStandaloneDatagridComponent,
			isStandalone: true,
			selector: "appfx-datagrid",
			usesInheritance: true,
			ngImport: i0,
			template: ``,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockStandaloneDatagridComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-datagrid",
			standalone: true,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: ``
		}]
	}]
});
var MockDatagridActionBarComponent = class MockDatagridActionBarComponent {
	constructor() {
		this.invokeAction = new EventEmitter();
	}
	onActionClick(action) {
		this.invokeAction.emit(action);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockDatagridActionBarComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: MockDatagridActionBarComponent,
			isStandalone: false,
			selector: "appfx-datagrid-action-bar",
			inputs: { actions: "actions" },
			outputs: { invokeAction: "invokeAction" },
			ngImport: i0,
			template: `
    @for (action of actions; track action) {
      <button
        (click)="onActionClick(action)"
        [title]="action.tooltip"
        [attr.data-test-id]="action.id"
        [disabled]="!action.enabled"
      >
        {{ action.label }}
      </button>
    }
  `,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockDatagridActionBarComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-datagrid-action-bar",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: `
    @for (action of actions; track action) {
      <button
        (click)="onActionClick(action)"
        [title]="action.tooltip"
        [attr.data-test-id]="action.id"
        [disabled]="!action.enabled"
      >
        {{ action.label }}
      </button>
    }
  `
		}]
	}],
	propDecorators: {
		actions: [{ type: Input }],
		invokeAction: [{ type: Output }]
	}
});
var MockDatagridCellContainerComponent = class MockDatagridCellContainerComponent {
	ngOnInit() {
		if (this.column.columnRenderer) {
			this.componentRef = this.container.createComponent(this.column.columnRenderer);
			this.instance = this.componentRef?.instance;
			this.instance.item = this.item;
			this.instance.column = this.column;
		}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockDatagridCellContainerComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: MockDatagridCellContainerComponent,
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
			ngImport: i0,
			template: `
    @if (!column.columnRenderer) {
      {{ item?.[column.field] }}
    }
    <ng-template #cellContainer></ng-template>
  `,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockDatagridCellContainerComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-dg-cell-container",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: `
    @if (!column.columnRenderer) {
      {{ item?.[column.field] }}
    }
    <ng-template #cellContainer></ng-template>
  `
		}]
	}],
	propDecorators: {
		column: [{ type: Input }],
		item: [{ type: Input }],
		container: [{
			type: ViewChild,
			args: ["cellContainer", {
				read: ViewContainerRef,
				static: true
			}]
		}]
	}
});
var MockDatagridColumnToggleComponent = class MockDatagridColumnToggleComponent {
	showColumn() {}
	hideColumn() {}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockDatagridColumnToggleComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockDatagridColumnToggleComponent,
			isStandalone: false,
			selector: "appfx-dg-column-toggle",
			inputs: { columns: "columns" },
			ngImport: i0,
			template: ``,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockDatagridColumnToggleComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-dg-column-toggle",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: ``
		}]
	}],
	propDecorators: { columns: [{ type: Input }] }
});
var MockDatagridPersistSettingsDirective = class MockDatagridPersistSettingsDirective {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockDatagridPersistSettingsDirective,
			deps: [],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockDatagridPersistSettingsDirective,
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
	type: MockDatagridPersistSettingsDirective,
	decorators: [{
		type: Directive,
		args: [{
			selector: "appfx-datagrid[appfxPersistDatagridSettings]",
			standalone: false
		}]
	}],
	propDecorators: {
		appfxPersistDatagridSettings: [{ type: Input }],
		persistPageSize: [{ type: Input }],
		persistSortOrder: [{ type: Input }]
	}
});
var MockDatagridPreserveSelectionDirective = class MockDatagridPreserveSelectionDirective {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockDatagridPreserveSelectionDirective,
			deps: [],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockDatagridPreserveSelectionDirective,
			isStandalone: false,
			selector: "[appfxPreserveSelection]",
			inputs: { preserveExistingSelection: "preserveExistingSelection" },
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockDatagridPreserveSelectionDirective,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[appfxPreserveSelection]",
			standalone: false
		}]
	}],
	propDecorators: { preserveExistingSelection: [{ type: Input }] }
});
var GridHelper = class {
	constructor(contextDebugElement, indexedEntry) {
		this.indexedEntry = indexedEntry;
		this.isExpandable = false;
		const gridMatches = contextDebugElement.queryAll(By.directive(ClrDatagrid));
		if (!gridMatches.length) throw Error("No grid found by scoped context");
		else if (gridMatches.length > 1 && indexedEntry === void 0) throw Error(`${gridMatches.length} multiple grids under the passed context`);
		else {
			this.componentDebugElement = gridMatches[indexedEntry || 0];
			this.component = this.componentDebugElement.injector.get(ClrDatagrid);
			this.gridElement = this.componentDebugElement.nativeElement;
			this.isExpandable = this.isRowDetailConfigured();
		}
	}
	static assertEmpty(gridParentDebugElement) {
		const matchedGrid = gridParentDebugElement.query(By.directive(ClrDatagrid));
		if (!matchedGrid) {
			expect(matchedGrid).toBeNull();
			return;
		}
		const clrGrid = matchedGrid.injector.get(ClrDatagrid);
		if (clrGrid) expect(clrGrid.items.all.length).toBeFalsy();
	}
	detectChanges(fixture) {
		fixture.detectChanges();
		this.component.resize();
		fixture.detectChanges();
	}
	getGridElement() {
		return this.gridElement;
	}
	getGridInternalInstance() {
		return this.component;
	}
	getTestId() {
		return this.getGridElement().dataset["testId"] || void 0;
	}
	getHeaders() {
		return Array.from(this.gridElement.querySelectorAll(".datagrid-table .datagrid-header clr-dg-column .datagrid-column-title")).map((element) => element.textContent ? element.textContent.trim() : "");
	}
	getHiddenHeaders() {
		return Array.from(this.gridElement.querySelectorAll(".datagrid-table .datagrid-header clr-dg-column.datagrid-hidden-column .datagrid-column-title")).map((element) => element.textContent ? element.textContent.trim() : "");
	}
	assertHeaderLabels(includeLabelList, excludeLabelList) {
		const gridHeaderLabelList = this.getHeaders();
		if (Array.isArray(includeLabelList)) gridHeaderLabelList.forEach((headerLabel, index) => {
			expect(headerLabel).toEqual(includeLabelList[index], `Cannot find "${headerLabel}" column.`);
		});
		if (Array.isArray(excludeLabelList)) excludeLabelList.forEach((undefinedLabel) => {
			expect(gridHeaderLabelList.indexOf(undefinedLabel)).toBeLessThan(0, `There is a "${undefinedLabel}" column.`);
		});
	}
	isRowDetailConfigured() {
		return !!this.gridElement.querySelector(".datagrid-table .datagrid-header .datagrid-column.datagrid-expandable-caret");
	}
	getHeaderElements() {
		return Array.from(this.gridElement.querySelectorAll("clr-dg-column")).map((element) => element);
	}
	getHeaderElementAt(headerIndex) {
		return this.getHeaderElements()[headerIndex] || void 0;
	}
	getSelectAllElement() {
		return this.gridElement.querySelector(".datagrid-table .datagrid-header .datagrid-column.datagrid-select input[type='checkbox']");
	}
	isColumnSortable(header) {
		return Array.from(this.gridElement.querySelectorAll(".datagrid-table .datagrid-header button.datagrid-column-title")).map((element) => element.textContent ? element.textContent.trim() : "").indexOf(header) !== -1;
	}
	sortByColumn(header) {
		const headerElements = Array.from(this.gridElement.querySelectorAll(".datagrid-table .datagrid-header button.datagrid-column-title")).filter((element) => {
			return element.textContent && header === element.textContent.trim();
		});
		if (!headerElements || headerElements.length === 0) return false;
		headerElements[0].click();
		return true;
	}
	sortByColumnIndex(colIndex) {
		const headerElement = this.getHeaderElementAt(colIndex);
		if (!headerElement) throw Error(`The grid does not have column with index ${colIndex}`);
		const columnSortButton = headerElement.querySelector("button.datagrid-column-title");
		if (!columnSortButton) throw Error(`The column is not sortable at ${colIndex}`);
		columnSortButton.click();
		return true;
	}
	openFilter(header) {
		const headerElement = this.getHeaderElements().find((element) => {
			const columnTitle = element.querySelector(".datagrid-column-title");
			return !!(columnTitle && columnTitle.textContent && columnTitle.textContent.trim() === header);
		});
		if (headerElement) {
			const filterButton = headerElement.querySelector("clr-dg-filter .datagrid-filter-toggle");
			if (filterButton) filterButton.click();
		}
	}
	closeFilter() {
		const closeButton = document.body.querySelector(".datagrid-filter button.close");
		if (closeButton) closeButton.click();
	}
	openFilterByColumnIndex(colIndex) {
		const headerElements = this.getHeaderElements();
		if (!headerElements || headerElements.length - 1 < colIndex) throw Error(`The grid does not have column with index ${colIndex}`);
		headerElements[colIndex].querySelector("clr-dg-filter > .datagrid-filter-toggle").click();
	}
	getFilterInput() {
		return new FilterInputTestHelper(document.body.querySelector(".datagrid-filter input"));
	}
	getRows() {
		const rowElements = this.gridElement.querySelectorAll("clr-dg-row");
		return Array.from(rowElements).map((element) => new GridRowTestHelper(this, element));
	}
	getFooter() {
		return new GridFooterTestHelper(this.gridElement.querySelector("clr-dg-footer"));
	}
	getPlaceholder() {
		const placeholderElement = this.gridElement.querySelector("clr-dg-placeholder");
		if (!placeholderElement) throw Error("No placeholder located in grid");
		return new GridPlaceholder(placeholderElement);
	}
	getSelectedRows() {
		const rowElements = this.gridElement.querySelectorAll("clr-dg-row.datagrid-selected");
		return Array.from(rowElements).map((element) => new GridRowTestHelper(this, element));
	}
	selectAllRows() {
		const canPerform = this.component.selection.rowSelectionMode;
		if (canPerform) this.component.selection.toggleAll();
		return canPerform;
	}
	unselectAllRows() {
		const canPerform = this.component.selection.rowSelectionMode;
		if (canPerform) this.component.selection.clearSelection();
		return canPerform;
	}
	clickActionBarButton(label) {
		const btn = this.findActionBarButton(this.getButtonIdentifier(label));
		if (btn) btn.click();
		else throw Error("The action button '" + label + "' does not exist");
	}
	isActionBarButtonDisabled(label) {
		const btn = this.findActionBarButton(this.getButtonIdentifier(label));
		if (btn) return btn.disabled;
		else throw Error("The action button '" + label + "' does not exist");
	}
	getActionBarActionLabels(hasSpan) {
		const buttonElements = this.gridElement.querySelectorAll("clr-dg-action-bar button" + (hasSpan ? " > span" : ""));
		return Array.from(buttonElements).map((element) => {
			return element && element.innerText ? element.innerText.trim() : "";
		});
	}
	isDataLoading() {
		return this.component.loading;
	}
	findActionBarButton(label) {
		const menuItems = this.gridElement.querySelectorAll("clr-dg-action-bar button");
		const matched = Array.from(menuItems).map((e) => e.textContent ? e.textContent.trim() : "").indexOf(label);
		return matched >= 0 ? menuItems[matched] : void 0;
	}
	findFooterButton(label) {
		const buttons = this.gridElement.querySelectorAll("clr-dg-footer button");
		const matched = Array.from(buttons).map((e) => e.textContent ? e.textContent.trim() : "").indexOf(label);
		return matched >= 0 ? buttons[matched] : void 0;
	}
	findFooterDropdownChildButton(label) {
		const buttons = document.querySelectorAll("clr-dropdown-menu button");
		const matched = Array.from(buttons).map((e) => e.textContent ? e.textContent.trim() : "").indexOf(label);
		return matched >= 0 ? buttons[matched] : void 0;
	}
	getButtonIdentifier(label) {
		if (typeof label === "string") return label;
		else throw Error("invalid i18n tuple argument");
	}
};
var FilterInputTestHelper = class {
	constructor(inputElement) {
		this.inputElement = inputElement;
	}
	assert(validFlag) {
		if (validFlag) {
			expect(this.inputElement).not.toBeNull();
			expect(this.inputElement.disabled).toEqual(false);
		} else expect(this.inputElement).toBeNull();
	}
	inputText(text, triggerEvent) {
		let eventName = "input";
		if (triggerEvent) eventName = triggerEvent;
		this.inputElement.value = text;
		this.inputElement.dispatchEvent(this.newEvent(eventName));
	}
	newEvent(eventName, bubbles = false, cancelable = false) {
		const evt = document.createEvent("CustomEvent");
		evt.initCustomEvent(eventName, bubbles, cancelable, null);
		return evt;
	}
};
var GridFooterTestHelper = class {
	constructor(footerElement) {
		this.footerElement = footerElement;
	}
	getElement() {
		return this.footerElement;
	}
	getFooterText() {
		return this.footerElement && this.footerElement.textContent ? this.footerElement.textContent.trim() : "";
	}
	openShowHideColumnsMenu() {
		if (!this.footerElement) return;
		this.footerElement.querySelector("button[cdkOverlayOrigin]").click();
	}
	clickShowHideColumnsItem(name) {
		this.getShowHideColumnsItems();
		const showHideColumnsItem = this.findShowHideColumnsItemByName(name);
		if (showHideColumnsItem) showHideColumnsItem.click();
	}
	findShowHideColumnsItemByName(name) {
		const checkBoxLabels = this.getShowHideColumnsItems();
		const labelIndex = checkBoxLabels.map((element) => element.textContent ? element.textContent.trim() : "").indexOf(name);
		return labelIndex !== -1 ? checkBoxLabels[labelIndex] : null;
	}
	getShowHideColumnsItems() {
		if (!this.footerElement) return [];
		const checkBoxLabels = document.body.querySelectorAll(".column-switch  clr-checkbox-wrapper > label");
		return Array.from(checkBoxLabels);
	}
	clickPreviousPaginationButton() {
		if (!this.footerElement) return;
		const button = this.footerElement.querySelector("clr-dg-pagination  button.pagination-previous");
		if (button && !button.disabled) button.click();
	}
	clickNextPaginationButton() {
		if (!this.footerElement) return;
		const button = this.footerElement.querySelector("clr-dg-pagination  button.pagination-next");
		if (button && !button.disabled) button.click();
	}
	clickPaginationButton(label) {
		if (!this.footerElement) return;
		const paginationButtons = this.footerElement.querySelectorAll("clr-dg-pagination li button");
		const paginationButtonIndex = Array.from(paginationButtons).map((element) => element.textContent ? element.textContent.trim() : "").indexOf(label);
		if (paginationButtonIndex !== -1) paginationButtons[paginationButtonIndex].click();
	}
};
var GridRowTestHelper = class {
	constructor(grid, rowElement) {
		this.grid = grid;
		this.rowElement = rowElement;
	}
	getCell(header) {
		const columnIndex = this.grid.getHeaders().indexOf(header);
		return this.getCellAt(columnIndex);
	}
	getCellAt(index) {
		return new GridCellTestHelper(this.rowElement.querySelectorAll("clr-dg-cell").item(index));
	}
	getCellTextAt(index) {
		const cellText = this.rowElement.querySelectorAll("clr-dg-cell > span").item(index).textContent;
		return cellText ? cellText.trim() : "";
	}
	getElement() {
		return this.rowElement;
	}
	isSelected() {
		return this.rowElement.classList.contains("datagrid-selected");
	}
	assertCellValues(includeValueList, excludeValueList) {
		if (Array.isArray(includeValueList)) includeValueList.forEach((cellValue, index) => {
			const gridCell = this.getCellAt(index);
			if (cellValue !== void 0) {
				if (Array.isArray(cellValue)) expect(cellValue.reduce((matched, phrase) => matched && gridCell.getText().includes(phrase), true)).toBe(true);
				else expect(gridCell.getText()).toEqual(String(cellValue));
			} else if (Array.isArray(cellValue)) expect(cellValue.reduce((matched, phrase) => matched && gridCell.getText().includes(phrase), true)).toBe(false);
			else expect(gridCell.getElement()).toBeNull(`There is no cell at position index ${index}.`);
		});
		if (Array.isArray(excludeValueList)) excludeValueList.forEach((cellValue, index) => {
			const gridCell = this.getCellAt(index);
			if (cellValue !== void 0) expect(gridCell.getText()).not.toEqual(String(cellValue));
			else expect(gridCell.getElement()).not.toBeNull(`There is a no cell at position index ${index}.`);
		});
	}
	select() {
		const selectionElement = this.rowElement.querySelector(".datagrid-cell.datagrid-select .clr-control-label");
		if (!selectionElement) throw Error("The row is not selectable.");
		selectionElement.click();
	}
	selectMultiWithRowSelectionEnabled() {
		const selectionElement = this.rowElement.querySelector(".datagrid-select.datagrid-cell > .clr-checkbox-wrapper");
		if (!selectionElement) throw Error("The row is not selectable.");
		selectionElement.click();
	}
	click() {
		const selectionElement = this.rowElement.querySelector("div.datagrid-row-clickable");
		if (!selectionElement) throw Error("The row is not clickable.");
		selectionElement.click();
	}
	isRowClickable() {
		return !!this.rowElement.querySelector("div.datagrid-row-clickable");
	}
	isSelectionAvailable() {
		return this.rowElement.querySelector("input") ? true : false;
	}
	isSelectionDisabled() {
		return this.rowElement.querySelector("input[aria-disabled]") ? true : false;
	}
	expand() {
		const expandElement = this.rowElement.querySelector(".datagrid-expandable-caret > button.datagrid-expandable-caret-button");
		if (!expandElement) throw Error("The row is not expandable.");
		expandElement.click();
	}
	isExpanded() {
		return !!this.rowElement.querySelector("clr-dg-row-detail");
	}
	isRowExpandable() {
		return this.rowElement.querySelectorAll(".datagrid-expandable-caret > button.datagrid-expandable-caret-button").length > 0;
	}
	getSingleRowActionMenuButton() {
		return this.rowElement.querySelector(".datagrid-action-toggle > cds-icon");
	}
	openSingleRowActionMenu() {
		const menuItems = this.rowElement.querySelectorAll("clr-dg-action-overflow  button.datagrid-action-toggle");
		if (menuItems && menuItems.length > 0) {
			menuItems.item(0).click();
			return true;
		}
		return false;
	}
	getSingleRowActionMenuItem(menuItemName) {
		const menuItems = document.querySelectorAll("div.datagrid-action-overflow button");
		const menuItemIndex = Array.from(menuItems).map((element) => element.textContent ? element.textContent.trim() : "").indexOf(menuItemName);
		if (menuItemIndex !== -1) return menuItems[menuItemIndex];
	}
	clickOnSingleRowActionMenuItem(menuItemName) {
		const menuItem = this.getSingleRowActionMenuItem(menuItemName);
		if (menuItem) menuItem.click();
	}
	isRowSingleSelectable() {
		return !!this.rowElement.querySelector(".datagrid-select.datagrid-cell > .clr-radio-wrapper") && !!this.grid.getGridElement().querySelector(".datagrid-table .datagrid-header > .datagrid-row .datagrid-select.datagrid-column > .datagrid-column-separator");
	}
};
var GridCellTestHelper = class {
	constructor(cellElement) {
		this.cellElement = cellElement;
	}
	getElement() {
		return this.cellElement;
	}
	getText() {
		const cellElement = this.cellElement;
		return cellElement.innerText ? cellElement.innerText.trim() : "";
	}
	getChildElementText(selector) {
		const childElement = this.cellElement.querySelector(selector);
		if (childElement) return childElement.innerText ? childElement.innerText.trim() : "";
		return "";
	}
	getCellWrapperElement(selector) {
		const matchedElement = this.cellElement.querySelector("appfx-dg-cell-container");
		if (!matchedElement) return null;
		return selector ? matchedElement.querySelector(selector) : matchedElement;
	}
	getObjectIconElement() {
		return this.getElement().querySelector("span.object > i") || void 0;
	}
	clickChildLink() {
		const selectionElement = this.cellElement.querySelector("A");
		if (!selectionElement) throw Error("The cell is not clickable.");
		else selectionElement.click();
	}
};
var GridPlaceholder = class {
	constructor(placeholderComponentElement) {
		this.placeholderComponentElement = placeholderComponentElement;
	}
	getElement() {
		return this.placeholderComponentElement;
	}
	getText() {
		return this.placeholderComponentElement ? this.placeholderComponentElement.textContent.trim() : void 0;
	}
};
var MockIsRowSelectablePipe = class MockIsRowSelectablePipe {
	transform(rowItem, isLocked, disabled) {
		return !isLocked?.(rowItem) || !!disabled;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockIsRowSelectablePipe,
			deps: [],
			target: i0.ɵɵFactoryTarget.Pipe
		});
	}
	static {
		this.ɵpipe = i0.ɵɵngDeclarePipe({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockIsRowSelectablePipe,
			isStandalone: false,
			name: "isRowSelectable"
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockIsRowSelectablePipe,
	decorators: [{
		type: Pipe,
		args: [{
			name: "isRowSelectable",
			standalone: false
		}]
	}]
});
var MockDatagridFiltersComponent = class MockDatagridFiltersComponent {
	constructor() {
		this.filterMode = FilterMode.Quick;
		this.searchTermChange = new EventEmitter();
		this.propertyFiltersChange = new EventEmitter();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockDatagridFiltersComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockDatagridFiltersComponent,
			isStandalone: false,
			selector: "appfx-datagrid-filters",
			inputs: {
				filterMode: "filterMode",
				filterableProperties: "filterableProperties"
			},
			outputs: {
				searchTermChange: "searchTermChange",
				propertyFiltersChange: "propertyFiltersChange"
			},
			ngImport: i0,
			template: "",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockDatagridFiltersComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-datagrid-filters",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: ""
		}]
	}],
	propDecorators: {
		filterMode: [{ type: Input }],
		filterableProperties: [{ type: Input }],
		searchTermChange: [{ type: Output }],
		propertyFiltersChange: [{ type: Output }]
	}
});
var MockDatagridFiltersStandaloneComponent = class MockDatagridFiltersStandaloneComponent extends MockDatagridFiltersComponent {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockDatagridFiltersStandaloneComponent,
			deps: null,
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockDatagridFiltersStandaloneComponent,
			isStandalone: true,
			selector: "appfx-datagrid-filters",
			usesInheritance: true,
			ngImport: i0,
			template: "",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockDatagridFiltersStandaloneComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-datagrid-filters",
			standalone: true,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: ""
		}]
	}]
});
var MockAppfxDialogComponent = class MockAppfxDialogComponent {
	constructor() {
		this.onModelChange = new EventEmitter();
		this.onClose = new EventEmitter();
		this.openedChange = new EventEmitter();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockAppfxDialogComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockAppfxDialogComponent,
			isStandalone: false,
			selector: "appfx-dialog",
			inputs: {
				title: "title",
				subTitle: "subTitle",
				size: "size",
				height: "height",
				defaultButton: "defaultButton",
				cancelButtonLabel: "cancelButtonLabel",
				okButtonLabel: "okButtonLabel",
				tabLayout: "tabLayout",
				disableTabsContent: "disableTabsContent",
				loading: "loading",
				steps: "steps",
				model: "model",
				closeHandler: "closeHandler",
				showTabLinks: "showTabLinks",
				opened: "opened"
			},
			outputs: {
				onModelChange: "onModelChange",
				onClose: "onClose",
				openedChange: "openedChange"
			},
			ngImport: i0,
			template: "",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockAppfxDialogComponent,
	decorators: [{
		type: Component,
		args: [{
			changeDetection: ChangeDetectionStrategy.Eager,
			selector: "appfx-dialog",
			standalone: false,
			template: ""
		}]
	}],
	propDecorators: {
		title: [{ type: Input }],
		subTitle: [{ type: Input }],
		size: [{ type: Input }],
		height: [{ type: Input }],
		defaultButton: [{ type: Input }],
		cancelButtonLabel: [{ type: Input }],
		okButtonLabel: [{ type: Input }],
		tabLayout: [{ type: Input }],
		disableTabsContent: [{ type: Input }],
		loading: [{ type: Input }],
		steps: [{ type: Input }],
		model: [{ type: Input }],
		closeHandler: [{ type: Input }],
		showTabLinks: [{ type: Input }],
		opened: [{ type: Input }],
		onModelChange: [{ type: Output }],
		onClose: [{ type: Output }],
		openedChange: [{ type: Output }]
	}
});
var MockAppfxDialogStandaloneComponent = class MockAppfxDialogStandaloneComponent extends MockAppfxDialogComponent {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockAppfxDialogStandaloneComponent,
			deps: null,
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockAppfxDialogStandaloneComponent,
			isStandalone: true,
			selector: "appfx-dialog",
			usesInheritance: true,
			ngImport: i0,
			template: "",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockAppfxDialogStandaloneComponent,
	decorators: [{
		type: Component,
		args: [{
			changeDetection: ChangeDetectionStrategy.Eager,
			selector: "appfx-dialog",
			standalone: true,
			template: ""
		}]
	}]
});
var MockAppfxDialogHeaderComponent = class MockAppfxDialogHeaderComponent {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockAppfxDialogHeaderComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockAppfxDialogHeaderComponent,
			isStandalone: false,
			selector: "appfx-dialog-header",
			ngImport: i0,
			template: `<ng-content></ng-content>`,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockAppfxDialogHeaderComponent,
	decorators: [{
		type: Component,
		args: [{
			changeDetection: ChangeDetectionStrategy.Eager,
			selector: "appfx-dialog-header",
			standalone: false,
			template: `<ng-content></ng-content>`
		}]
	}]
});
var MockAppfxDialogHeaderStandaloneComponent = class MockAppfxDialogHeaderStandaloneComponent extends MockAppfxDialogHeaderComponent {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockAppfxDialogHeaderStandaloneComponent,
			deps: null,
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockAppfxDialogHeaderStandaloneComponent,
			isStandalone: true,
			selector: "appfx-dialog-header",
			usesInheritance: true,
			ngImport: i0,
			template: `<ng-content></ng-content>`,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockAppfxDialogHeaderStandaloneComponent,
	decorators: [{
		type: Component,
		args: [{
			changeDetection: ChangeDetectionStrategy.Eager,
			selector: "appfx-dialog-header",
			standalone: true,
			template: `<ng-content></ng-content>`
		}]
	}]
});
var MockAppfxMenuActionComponent = class MockAppfxMenuActionComponent {
	constructor() {
		this.enabled = true;
		this.handle = new EventEmitter(true);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockAppfxMenuActionComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockAppfxMenuActionComponent,
			isStandalone: false,
			selector: "appfx-menu-action",
			inputs: {
				actionId: "actionId",
				iconClass: "iconClass",
				text: "text",
				shortcut: "shortcut",
				enabled: "enabled"
			},
			outputs: { handle: "handle" },
			ngImport: i0,
			template: "<ng-content></ng-content>",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockAppfxMenuActionComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-menu-action",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<ng-content></ng-content>"
		}]
	}],
	propDecorators: {
		actionId: [{ type: Input }],
		iconClass: [{ type: Input }],
		text: [{ type: Input }],
		shortcut: [{ type: Input }],
		enabled: [{ type: Input }],
		handle: [{ type: Output }]
	}
});
var MockAppfxMenuActionStandaloneComponent = class MockAppfxMenuActionStandaloneComponent extends MockAppfxMenuActionComponent {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockAppfxMenuActionStandaloneComponent,
			deps: null,
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockAppfxMenuActionStandaloneComponent,
			isStandalone: true,
			selector: "appfx-menu-action",
			usesInheritance: true,
			ngImport: i0,
			template: "<ng-content></ng-content>",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockAppfxMenuActionStandaloneComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-menu-action",
			standalone: true,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<ng-content></ng-content>"
		}]
	}]
});
var MockAppfxMenuComponent = class MockAppfxMenuComponent {
	constructor() {
		this.opened = new EventEmitter();
		this.closed = new EventEmitter();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockAppfxMenuComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockAppfxMenuComponent,
			isStandalone: false,
			selector: "appfx-menu",
			inputs: { text: "text" },
			outputs: {
				opened: "opened",
				closed: "closed"
			},
			ngImport: i0,
			template: "<ng-content></ng-content>",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockAppfxMenuComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-menu",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<ng-content></ng-content>"
		}]
	}],
	propDecorators: {
		text: [{ type: Input }],
		opened: [{ type: Output }],
		closed: [{ type: Output }]
	}
});
var MockAppfxMenuStandaloneComponent = class MockAppfxMenuStandaloneComponent extends MockAppfxMenuComponent {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockAppfxMenuStandaloneComponent,
			deps: null,
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockAppfxMenuStandaloneComponent,
			isStandalone: true,
			selector: "appfx-menu",
			usesInheritance: true,
			ngImport: i0,
			template: "<ng-content></ng-content>",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockAppfxMenuStandaloneComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-menu",
			standalone: true,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<ng-content></ng-content>"
		}]
	}]
});
var MockPropertyViewComponent = class MockPropertyViewComponent {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockPropertyViewComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockPropertyViewComponent,
			isStandalone: false,
			selector: "appfx-property-view",
			inputs: {
				data: "data",
				config: "config"
			},
			ngImport: i0,
			template: "",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockPropertyViewComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-property-view",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: ""
		}]
	}],
	propDecorators: {
		data: [{ type: Input }],
		config: [{ type: Input }]
	}
});
var MockPropertyViewStandaloneComponent = class MockPropertyViewStandaloneComponent extends MockPropertyViewComponent {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockPropertyViewStandaloneComponent,
			deps: null,
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockPropertyViewStandaloneComponent,
			isStandalone: true,
			selector: "appfx-property-view",
			usesInheritance: true,
			ngImport: i0,
			template: "",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockPropertyViewStandaloneComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-property-view",
			standalone: true,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: ""
		}]
	}]
});
var MockPropertyViewStrings = class MockPropertyViewStrings extends PropertyViewStrings {
	constructor() {
		super(...arguments);
		this.toggle = "Toggle {0} section";
		this.actions = "Actions";
		this.categoryListItemsAreaLabel = "{0} items grouped in {1} sections.";
		this.categoryListItemAreaLabel = "{0} items grouped in 1 section.";
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockPropertyViewStrings,
			deps: null,
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockPropertyViewStrings
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockPropertyViewStrings,
	decorators: [{ type: Injectable }]
});
function verifyPropertyViewProperty(key, value, propertyModel) {
	expect(propertyModel.type).toEqual(PropertyViewModelType.Property);
	expect(propertyModel.key.text).toEqual(key);
	for (let i = 0; i < value.length; i++) expect(propertyModel.content[i].text).toEqual(value[i]);
}
function verifyPropertyViewMessage(textValue, icon, messageModel) {
	expect(messageModel.type).toEqual(PropertyViewModelType.Message);
	expect(messageModel.text).toEqual(textValue);
	expect(messageModel.icon).toEqual(icon);
}
var MockStepperComponent = class MockStepperComponent {
	constructor() {
		this.onModelChange = new EventEmitter();
		this.onFinish = new EventEmitter();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockStepperComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockStepperComponent,
			isStandalone: false,
			selector: "appfx-stepper",
			inputs: {
				steps: "steps",
				wizardModel: "wizardModel",
				loading: "loading"
			},
			outputs: {
				onModelChange: "onModelChange",
				onFinish: "onFinish"
			},
			ngImport: i0,
			template: "<ng-content></ng-content>",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockStepperComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-stepper",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<ng-content></ng-content>"
		}]
	}],
	propDecorators: {
		steps: [{ type: Input }],
		wizardModel: [{ type: Input }],
		loading: [{ type: Input }],
		onModelChange: [{ type: Output }],
		onFinish: [{ type: Output }]
	}
});
var MockStepperStandaloneComponent = class MockStepperStandaloneComponent extends MockStepperComponent {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockStepperStandaloneComponent,
			deps: null,
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockStepperStandaloneComponent,
			isStandalone: true,
			selector: "appfx-stepper",
			usesInheritance: true,
			ngImport: i0,
			template: "<ng-content></ng-content>",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockStepperStandaloneComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-stepper",
			standalone: true,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<ng-content></ng-content>"
		}]
	}]
});
var TabsHelper = class {
	constructor(contextDebugElement) {
		const tabsElementMatches = contextDebugElement.queryAll(By.directive(ClrTabs));
		if (!tabsElementMatches.length) throw Error("No tabs found under passed context element");
		else if (tabsElementMatches.length > 1) throw Error("Unable to isolate targeted instance of tabs widget");
		else {
			this.tabs = tabsElementMatches[0];
			this.component = this.tabs.injector.get(ClrTabs);
		}
	}
	getLinkList() {
		return this.tabs.queryAll(By.css(`[role="tablist"] > [role="presentation"] > [clrTabLink]`));
	}
	findLink(linkIndex) {
		return this.getLinkList()[linkIndex];
	}
	getActiveTab() {
		return this.component.tabsService.activeTab;
	}
	getActiveTabIndex() {
		return this.component.tabLinkDirectives.findIndex((tabLink) => tabLink.tabLinkId === this.component.tabsService.activeTab.tabLink.tabLinkId);
	}
	getActiveTabContentElement() {
		const evr = this.getActiveTab().tabContent["viewRef"];
		return evr ? evr.rootNodes[0].firstElementChild || void 0 : void 0;
	}
	clickLink(linkIndex) {
		const tabLink = this.component.tabLinkDirectives[linkIndex];
		try {
			tabLink.activate();
		} catch {
			throw Error("No tab link found at index " + linkIndex);
		}
	}
	findLinkText(linkIndex) {
		const tabLinkElement = this.findLink(linkIndex);
		return tabLinkElement ? tabLinkElement.nativeElement.textContent.trim() : void 0;
	}
	findLinkIcon(linkIndex) {
		const tabLinkElement = this.findLink(linkIndex);
		return tabLinkElement && tabLinkElement.query(By.css("cds-icon")) || void 0;
	}
	findContentView(childTabContentQuery) {
		const panel = this.tabs.query(By.css(`section.active`));
		return panel && childTabContentQuery ? panel.query(childTabContentQuery) || void 0 : panel || void 0;
	}
	areTabsVisible() {
		const tabsPanel = this.tabs.query(By.css(`.nav`));
		return getComputedStyle(tabsPanel.nativeElement)["display"] !== "none";
	}
};
var MockStepComponent = class MockStepComponent {
	activate() {
		this.model.isActivated = true;
	}
	validate() {
		return of(true).pipe(tap(() => {
			this.model.isValidated = true;
		}));
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockStepComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockStepComponent,
			isStandalone: false,
			selector: "appfx-mock-page-page",
			ngImport: i0,
			template: "<div>{{ model.mockPropertyValue }}</div>",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockStepComponent,
	decorators: [{
		type: Component,
		args: [{
			changeDetection: ChangeDetectionStrategy.Eager,
			selector: "appfx-mock-page-page",
			standalone: false,
			template: "<div>{{ model.mockPropertyValue }}</div>"
		}]
	}]
});
var InvalidMockComponent = class InvalidMockComponent extends MockStepComponent {
	validate() {
		return of(false).pipe(tap(() => {
			this.model.isValidated = true;
		}));
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: InvalidMockComponent,
			deps: null,
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: InvalidMockComponent,
			isStandalone: false,
			selector: "appfx-invalid-mock-page-page",
			usesInheritance: true,
			ngImport: i0,
			template: "<div></div>",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: InvalidMockComponent,
	decorators: [{
		type: Component,
		args: [{
			changeDetection: ChangeDetectionStrategy.Eager,
			selector: "appfx-invalid-mock-page-page",
			standalone: false,
			template: "<div></div>"
		}]
	}]
});
var MockStepModel = class {
	constructor(mockPropertyValue) {
		this.mockPropertyValue = mockPropertyValue;
		this.isActivated = false;
		this.isValidated = false;
		this.validationState = new StepValidationState();
	}
};
var MockWorkflowConfigurationService = class {
	constructor() {
		this.debugValue = false;
	}
	get debug() {
		return this.debugValue;
	}
	set debug(newValue) {
		this.debugValue = newValue;
	}
};
var MockWorkflowTestModule = class MockWorkflowTestModule {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockWorkflowTestModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockWorkflowTestModule,
			declarations: [InvalidMockComponent, MockStepComponent],
			imports: [NoopAnimationsModule]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockWorkflowTestModule,
			imports: [NoopAnimationsModule]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockWorkflowTestModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [NoopAnimationsModule],
			declarations: [InvalidMockComponent, MockStepComponent]
		}]
	}]
});
var MockAppfxWizardComponent = class MockAppfxWizardComponent {
	constructor() {
		this.openedChange = new EventEmitter();
		this.onModelChange = new EventEmitter();
		this.onFinish = new EventEmitter();
		this.onClose = new EventEmitter();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockAppfxWizardComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockAppfxWizardComponent,
			isStandalone: false,
			selector: "appfx-wizard",
			inputs: {
				title: "title",
				pages: "pages",
				wizardModel: "wizardModel",
				loading: "loading",
				size: "size",
				opened: "opened"
			},
			outputs: {
				openedChange: "openedChange",
				onModelChange: "onModelChange",
				onFinish: "onFinish",
				onClose: "onClose"
			},
			ngImport: i0,
			template: "",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockAppfxWizardComponent,
	decorators: [{
		type: Component,
		args: [{
			changeDetection: ChangeDetectionStrategy.Eager,
			selector: "appfx-wizard",
			standalone: false,
			template: ""
		}]
	}],
	propDecorators: {
		title: [{ type: Input }],
		pages: [{ type: Input }],
		wizardModel: [{ type: Input }],
		loading: [{ type: Input }],
		size: [{ type: Input }],
		opened: [{ type: Input }],
		openedChange: [{ type: Output }],
		onModelChange: [{ type: Output }],
		onFinish: [{ type: Output }],
		onClose: [{ type: Output }]
	}
});
var MockWizardStandaloneComponent = class MockWizardStandaloneComponent extends MockAppfxWizardComponent {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: MockWizardStandaloneComponent,
			deps: null,
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: MockWizardStandaloneComponent,
			isStandalone: true,
			selector: "appfx-wizard",
			usesInheritance: true,
			ngImport: i0,
			template: "",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: MockWizardStandaloneComponent,
	decorators: [{
		type: Component,
		args: [{
			changeDetection: ChangeDetectionStrategy.Eager,
			selector: "appfx-wizard",
			standalone: true,
			template: ""
		}]
	}]
});
var WizardHelper = class {
	#navPanelSelector = ".clr-wizard-stepnav-wrapper";
	#navitemSelector = "clr-wizard-stepnav .clr-wizard-stepnav-item";
	#showStepNavBinSelector = ".btn-show-stepnav";
	#closeStepNavBinSelector = ".btn-close-stepnav";
	constructor(wizard) {
		this.wizard = wizard;
	}
	get pageNavTitles() {
		return this.wizard.queryAll(By.css(this.#navitemSelector + " .clr-wizard-stepnav-link-title")).map((v) => this.getLastTextNode(v));
	}
	get isVisible() {
		return getComputedStyle(this.wizard.nativeElement)["visibility"] === "visible";
	}
	get activePageNavTitle() {
		const activeNavItem = this.wizard.query(By.css(this.#navitemSelector + ".active .clr-wizard-stepnav-link-title"));
		if (!activeNavItem) return "";
		return this.getLastTextNode(activeNavItem);
	}
	get activePageTitle() {
		return this.wizard.query(By.css(".clr-wizard-page-title")).nativeElement.innerText.trim();
	}
	get size() {
		return Array.from(this.wizard.nativeElement.classList).map((value) => {
			return (value.match(/^wizard-(sm|md|lg|xl)$/) || [])[1];
		}).filter((v) => !!v).pop();
	}
	get buttons() {
		return this.wizard.queryAll(By.css("clr-wizard-button button"));
	}
	get visibleButtons() {
		return this.buttons.filter((value) => {
			return value.nativeElement.parentElement.getAttribute("aria-hidden") === "false";
		});
	}
	get cancelButton() {
		return this.buttons[0];
	}
	get cancelButtonText() {
		return this.cancelButton.nativeElement.innerText.trim();
	}
	get backButton() {
		return this.buttons[1];
	}
	get backButtonText() {
		return this.backButton.nativeElement.innerText.trim();
	}
	get nextButton() {
		return this.buttons[2];
	}
	get nextButtonText() {
		return this.nextButton.nativeElement.innerText.trim();
	}
	get finishButton() {
		return this.buttons[3];
	}
	get finishButtonText() {
		return this.finishButton.nativeElement.innerText.trim();
	}
	get stepNavPanel() {
		return this.wizard.query(By.css(this.#navPanelSelector));
	}
	get stepNavs() {
		return this.wizard.queryAll(By.css(this.#navitemSelector + " .clr-wizard-stepnav-link"));
	}
	get showStepNavBtn() {
		return this.wizard.query(By.css(this.#showStepNavBinSelector));
	}
	get closeStepNavBtn() {
		return this.wizard.query(By.css(this.#closeStepNavBinSelector));
	}
	navigateToStep(stepIndex) {
		this.click(this.stepNavs[stepIndex]);
	}
	isNavVisible() {
		return getComputedStyle(this.stepNavPanel.nativeElement)["display"] !== "none";
	}
	isStepNavEnabled(stepIndex) {
		return this.stepNavs[stepIndex].attributes["disabled"] === void 0;
	}
	isShowNavIconVisible() {
		return getComputedStyle(this.showStepNavBtn.nativeElement)["display"] !== "none";
	}
	showNavigator() {
		this.click(this.showStepNavBtn);
	}
	closeNavigator() {
		this.click(this.closeStepNavBtn);
	}
	cancel() {
		this.click(this.cancelButton);
	}
	back() {
		this.click(this.backButton);
	}
	next() {
		this.click(this.nextButton);
	}
	finish() {
		this.click(this.finishButton);
	}
	click(el) {
		el.triggerEventHandler("click", null);
	}
	getLastTextNode(debugElement) {
		const childNodes = debugElement.nativeElement.childNodes;
		let result = "";
		childNodes.forEach((node) => {
			if (node.nodeType === 3) {
				const text = node.textContent?.trim() || "";
				if (text !== "") result = text;
			}
		});
		return result;
	}
};
export { FilterInputTestHelper, GridCellTestHelper, GridFooterTestHelper, GridHelper, GridPlaceholder, GridRowTestHelper, InvalidMockComponent, MockA11yService, MockAppfxCardContainerComponent, MockAppfxCardContainerStandaloneComponent, MockAppfxDatagridComponent, MockAppfxDialogComponent, MockAppfxDialogHeaderComponent, MockAppfxDialogHeaderStandaloneComponent, MockAppfxDialogStandaloneComponent, MockAppfxMenuActionComponent, MockAppfxMenuActionStandaloneComponent, MockAppfxMenuComponent, MockAppfxMenuStandaloneComponent, MockAppfxWizardComponent, MockCardContainerComponent, MockContainerService, MockDatagridActionBarComponent, MockDatagridCellContainerComponent, MockDatagridColumnToggleComponent, MockDatagridFiltersComponent, MockDatagridFiltersStandaloneComponent, MockDatagridPersistSettingsDirective, MockDatagridPreserveSelectionDirective, MockDragDropService, MockElementRef, MockIsRowSelectablePipe, MockLayoutService, MockPropertyViewComponent, MockPropertyViewStandaloneComponent, MockPropertyViewStrings, MockRenderer2, MockRequiredFieldLegendComponent, MockRequiredFieldLegendStandaloneComponent, MockStandaloneDatagridComponent, MockStepComponent, MockStepModel, MockStepperComponent, MockStepperStandaloneComponent, MockWizardStandaloneComponent, MockWorkflowConfigurationService, MockWorkflowTestModule, SampleCardComponent, SampleCardWithoutFooterComponent, SampleCardWithoutHeaderComponent, TabsHelper, WizardHelper, ZoomLevelServiceMock, cardIdToOrder, sampleCards, sampleCardsSettings, sortCardsFn, verifyPropertyViewMessage, verifyPropertyViewProperty };

//# sourceMappingURL=clr-addons-testing.mjs.map
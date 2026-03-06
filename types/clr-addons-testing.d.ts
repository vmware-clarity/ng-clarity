import * as i0 from '@angular/core';
import { TemplateRef, EventEmitter, OnInit, ViewContainerRef, ComponentFactoryResolver, DebugElement, PipeTransform } from '@angular/core';
import * as rxjs from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { ZoomLevel } from '@clr/addons/a11y';
import { ClrDatagridVirtualScrollRangeInterface, ClrDatagrid } from '@clr/angular/data/datagrid';
import { ActionDefinition } from '@clr/addons/datagrid';
import { ComponentFixture } from '@angular/core/testing';
import { FilterMode, FilterablePropertyDefinition, PropertyFilter } from '@clr/addons/datagrid-filters';

declare class MockRequiredFieldLegendComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<MockRequiredFieldLegendComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockRequiredFieldLegendComponent, "appfx-required-field-legend", never, {}, {}, never, never, false, never>;
}
declare class MockRequiredFieldLegendStandaloneComponent extends MockRequiredFieldLegendComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<MockRequiredFieldLegendStandaloneComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockRequiredFieldLegendStandaloneComponent, "appfx-required-field-legend", never, {}, {}, never, never, true, never>;
}

declare class ZoomLevelServiceMock {
    resizeSubject: ReplaySubject<ZoomLevel>;
    onChange: rxjs.Observable<ZoomLevel>;
}

declare class MockAppfxDatagridComponent {
    gridItems: any;
    columns: any;
    layoutModel: any;
    footerModel: any;
    pageSize: number;
    pageSizeOptions: number[];
    totalItems: number;
    selectionType: any;
    selectedItems: any;
    datagridLabels: any;
    preSelectFirstItem: boolean;
    rowSelectionMode: boolean;
    actionBarActions: any[];
    showFooter: boolean;
    singleRowActions: any[];
    noItemsFoundPlaceholder: string;
    loading: boolean;
    serverDrivenDatagrid: boolean;
    filterMode: any;
    listItemsCount: number;
    trackByGridItemProperty: string;
    isRowLocked: (rowItem: any) => boolean;
    detailHeader: any;
    detailBody: any;
    rowDetailContent: TemplateRef<any>;
    rowsExpandedByDefault: boolean;
    vscPersistDatagridSettings: boolean;
    detailState: any;
    trackByFunction: any;
    virtualScrolling: boolean;
    dataRange: ClrDatagridVirtualScrollRangeInterface<any>;
    selectedItemsChange: EventEmitter<any>;
    gridItemsChange: EventEmitter<any[]>;
    selectionChange: EventEmitter<any[]>;
    searchTermChange: EventEmitter<string>;
    refreshGridData: EventEmitter<any>;
    refreshVirtualGridData: EventEmitter<any>;
    actionClick: EventEmitter<any>;
    rowActionMenuOpenChange: EventEmitter<any>;
    exportDataEvent: EventEmitter<any>;
    detailStateChange: EventEmitter<any>;
    clrDatagridPagination: any;
    onModelChange(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockAppfxDatagridComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockAppfxDatagridComponent, "appfx-datagrid", never, { "gridItems": { "alias": "gridItems"; "required": false; }; "columns": { "alias": "columns"; "required": false; }; "layoutModel": { "alias": "layoutModel"; "required": false; }; "footerModel": { "alias": "footerModel"; "required": false; }; "pageSize": { "alias": "pageSize"; "required": false; }; "pageSizeOptions": { "alias": "pageSizeOptions"; "required": false; }; "totalItems": { "alias": "totalItems"; "required": false; }; "selectionType": { "alias": "selectionType"; "required": false; }; "selectedItems": { "alias": "selectedItems"; "required": false; }; "datagridLabels": { "alias": "datagridLabels"; "required": false; }; "preSelectFirstItem": { "alias": "preSelectFirstItem"; "required": false; }; "rowSelectionMode": { "alias": "rowSelectionMode"; "required": false; }; "actionBarActions": { "alias": "actionBarActions"; "required": false; }; "showFooter": { "alias": "showFooter"; "required": false; }; "singleRowActions": { "alias": "singleRowActions"; "required": false; }; "noItemsFoundPlaceholder": { "alias": "noItemsFoundPlaceholder"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; "serverDrivenDatagrid": { "alias": "serverDrivenDatagrid"; "required": false; }; "filterMode": { "alias": "filterMode"; "required": false; }; "listItemsCount": { "alias": "listItemsCount"; "required": false; }; "trackByGridItemProperty": { "alias": "trackByGridItemProperty"; "required": false; }; "isRowLocked": { "alias": "isRowLocked"; "required": false; }; "detailHeader": { "alias": "detailHeader"; "required": false; }; "detailBody": { "alias": "detailBody"; "required": false; }; "rowDetailContent": { "alias": "rowDetailContent"; "required": false; }; "rowsExpandedByDefault": { "alias": "rowsExpandedByDefault"; "required": false; }; "vscPersistDatagridSettings": { "alias": "vscPersistDatagridSettings"; "required": false; }; "detailState": { "alias": "detailState"; "required": false; }; "trackByFunction": { "alias": "trackByFunction"; "required": false; }; "virtualScrolling": { "alias": "virtualScrolling"; "required": false; }; "dataRange": { "alias": "dataRange"; "required": false; }; }, { "selectedItemsChange": "selectedItemsChange"; "gridItemsChange": "gridItemsChange"; "selectionChange": "selectionChange"; "searchTermChange": "searchTermChange"; "refreshGridData": "refreshGridData"; "refreshVirtualGridData": "refreshVirtualGridData"; "actionClick": "actionClick"; "rowActionMenuOpenChange": "rowActionMenuOpenChange"; "exportDataEvent": "exportDataEvent"; "detailStateChange": "detailStateChange"; }, never, never, false, never>;
}
declare class MockStandaloneDatagridComponent extends MockAppfxDatagridComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<MockStandaloneDatagridComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockStandaloneDatagridComponent, "appfx-datagrid", never, {}, {}, never, never, true, never>;
}

declare class MockDatagridActionBarComponent {
    actions: ActionDefinition[];
    invokeAction: EventEmitter<ActionDefinition>;
    onActionClick(action: ActionDefinition): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockDatagridActionBarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockDatagridActionBarComponent, "appfx-datagrid-action-bar", never, { "actions": { "alias": "actions"; "required": false; }; }, { "invokeAction": "invokeAction"; }, never, never, false, never>;
}

/**
 * Component for unit testing purposes to provide a template for rendering datagrid cell content.
 */
declare class MockDatagridCellContainerComponent implements OnInit {
    private componentFactoryResolver;
    column: any;
    item: any;
    protected container: ViewContainerRef;
    private componentRef;
    private instance;
    constructor(componentFactoryResolver: ComponentFactoryResolver);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockDatagridCellContainerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockDatagridCellContainerComponent, "appfx-dg-cell-container", never, { "column": { "alias": "column"; "required": false; }; "item": { "alias": "item"; "required": false; }; }, {}, never, never, false, never>;
}

declare class MockDatagridColumnToggleComponent {
    columns: unknown[];
    showColumn(): void;
    hideColumn(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockDatagridColumnToggleComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockDatagridColumnToggleComponent, "appfx-dg-column-toggle", never, { "columns": { "alias": "columns"; "required": false; }; }, {}, never, never, false, never>;
}

declare class MockDatagridPersistSettingsDirective {
    appfxPersistDatagridSettings: string;
    persistPageSize: boolean;
    persistSortOrder: boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockDatagridPersistSettingsDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MockDatagridPersistSettingsDirective, "appfx-datagrid[appfxPersistDatagridSettings]", never, { "appfxPersistDatagridSettings": { "alias": "appfxPersistDatagridSettings"; "required": false; }; "persistPageSize": { "alias": "persistPageSize"; "required": false; }; "persistSortOrder": { "alias": "persistSortOrder"; "required": false; }; }, {}, never, never, false, never>;
}

declare class MockDatagridPreserveSelectionDirective {
    preserveExistingSelection: boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockDatagridPreserveSelectionDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MockDatagridPreserveSelectionDirective, "[appfxPreserveSelection]", never, { "preserveExistingSelection": { "alias": "preserveExistingSelection"; "required": false; }; }, {}, never, never, false, never>;
}

declare class GridHelper {
    indexedEntry?: number;
    isExpandable: boolean;
    private gridElement;
    private component;
    private componentDebugElement;
    constructor(contextDebugElement: DebugElement, indexedEntry?: number);
    /**
     * validate grid component that is undefined. If it is defined, its data items collection must be empty
     * @param gridParentDebugElement
     */
    static assertEmpty(gridParentDebugElement: DebugElement): void;
    detectChanges(fixture: ComponentFixture<any>): void;
    getGridElement(): HTMLElement;
    getGridInternalInstance(): ClrDatagrid;
    getTestId(): string | undefined;
    getHeaders(): string[];
    getHiddenHeaders(): string[];
    assertHeaderLabels(includeLabelList: Array<string>, excludeLabelList?: Array<string>): void;
    isRowDetailConfigured(): boolean;
    getHeaderElements(): HTMLElement[];
    getHeaderElementAt(headerIndex: number): HTMLElement | undefined;
    getSelectAllElement(): HTMLElement | null;
    isColumnSortable(header: string): boolean;
    sortByColumn(header: string): boolean;
    sortByColumnIndex(colIndex: number): boolean;
    openFilter(header: string): void;
    closeFilter(): void;
    openFilterByColumnIndex(colIndex: number): void;
    getFilterInput(): FilterInputTestHelper;
    getRows(): GridRowTestHelper[];
    getFooter(): GridFooterTestHelper;
    getPlaceholder(): GridPlaceholder;
    getSelectedRows(): GridRowTestHelper[];
    selectAllRows(): boolean;
    unselectAllRows(): boolean;
    clickActionBarButton(label: string): void;
    isActionBarButtonDisabled(label: string): boolean;
    getActionBarActionLabels(hasSpan?: boolean): Array<string>;
    isDataLoading(): boolean;
    findActionBarButton(label: string): HTMLButtonElement | undefined;
    findFooterButton(label: string): HTMLButtonElement | undefined;
    findFooterDropdownChildButton(label: string): HTMLButtonElement | undefined;
    /**
     * handle string and array-based i18n bundle-key structures
     */
    private getButtonIdentifier;
}
declare class FilterInputTestHelper {
    private inputElement;
    constructor(inputElement: HTMLInputElement);
    assert(validFlag: boolean): void;
    inputText(text: string, triggerEvent?: string): void;
    private newEvent;
}
declare class GridFooterTestHelper {
    private footerElement;
    constructor(footerElement: HTMLElement | null);
    getElement(): HTMLElement;
    getFooterText(): string;
    openShowHideColumnsMenu(): void;
    clickShowHideColumnsItem(name: string): void;
    findShowHideColumnsItemByName(name: string): any;
    getShowHideColumnsItems(): any[];
    clickPreviousPaginationButton(): void;
    clickNextPaginationButton(): void;
    clickPaginationButton(label: string): void;
}
declare class GridRowTestHelper {
    private grid;
    private rowElement;
    constructor(grid: GridHelper, rowElement: HTMLElement);
    getCell(header: string): GridCellTestHelper;
    getCellAt(index: number): GridCellTestHelper;
    getCellTextAt(index: number): string;
    getElement(): HTMLElement;
    isSelected(): boolean;
    assertCellValues(includeValueList: Array<string | number | Array<string> | undefined>, excludeValueList?: Array<string | number | Array<string> | undefined>): void;
    select(): void;
    /**
     * In case the row selection in the Clarity grid is enabled for multiple selection,
     * ex. [clrDgRowSelection]="true" clicking on the checkbox's input causes both the
     * events for the row selection and the checkbox to be triggered causing the select
     * and deselect of the element immediately one after the other
     */
    selectMultiWithRowSelectionEnabled(): void;
    click(): void;
    isRowClickable(): boolean;
    isSelectionAvailable(): boolean;
    isSelectionDisabled(): boolean;
    expand(): void;
    isRowExpandable(): boolean;
    getSingleRowActionMenuButton(): HTMLElement;
    openSingleRowActionMenu(): boolean;
    getSingleRowActionMenuItem(menuItemName: string): HTMLButtonElement | undefined;
    clickOnSingleRowActionMenuItem(menuItemName: string): void;
    isRowSingleSelectable(): boolean;
}
declare class GridCellTestHelper {
    private cellElement;
    constructor(cellElement: HTMLElement);
    getElement(): HTMLElement;
    getText(): string;
    getChildElementText(selector: string): string;
    getCellWrapperElement(selector?: string): HTMLElement | null;
    getObjectIconElement(): HTMLElement | undefined;
    clickChildLink(): void;
}
declare class GridPlaceholder {
    private placeholderComponentElement;
    constructor(placeholderComponentElement: HTMLElement);
    getElement(): HTMLElement;
    getText(): string | undefined;
}

declare class MockIsRowSelectablePipe implements PipeTransform {
    transform(rowItem: any, isLocked?: (rowItem: any) => boolean, disabled?: boolean): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockIsRowSelectablePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<MockIsRowSelectablePipe, "isRowSelectable", false>;
}

declare class MockDatagridFiltersComponent {
    filterMode: FilterMode;
    filterableProperties: FilterablePropertyDefinition[];
    searchTermChange: EventEmitter<string>;
    propertyFiltersChange: EventEmitter<PropertyFilter[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockDatagridFiltersComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockDatagridFiltersComponent, "appfx-datagrid-filters", never, { "filterMode": { "alias": "filterMode"; "required": false; }; "filterableProperties": { "alias": "filterableProperties"; "required": false; }; }, { "searchTermChange": "searchTermChange"; "propertyFiltersChange": "propertyFiltersChange"; }, never, never, false, never>;
}
declare class MockDatagridFiltersStandaloneComponent extends MockDatagridFiltersComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<MockDatagridFiltersStandaloneComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockDatagridFiltersStandaloneComponent, "appfx-datagrid-filters", never, {}, {}, never, never, true, never>;
}

export { FilterInputTestHelper, GridCellTestHelper, GridFooterTestHelper, GridHelper, GridPlaceholder, GridRowTestHelper, MockAppfxDatagridComponent, MockDatagridActionBarComponent, MockDatagridCellContainerComponent, MockDatagridColumnToggleComponent, MockDatagridFiltersComponent, MockDatagridFiltersStandaloneComponent, MockDatagridPersistSettingsDirective, MockDatagridPreserveSelectionDirective, MockIsRowSelectablePipe, MockRequiredFieldLegendComponent, MockRequiredFieldLegendStandaloneComponent, MockStandaloneDatagridComponent, ZoomLevelServiceMock };

import * as i0 from '@angular/core';
import { ViewContainerRef, ElementRef, EmbeddedViewRef, TemplateRef, EventEmitter, OnInit, ComponentFactoryResolver, DebugElement, PipeTransform, Predicate } from '@angular/core';
import * as rxjs from 'rxjs';
import { ReplaySubject, Observable } from 'rxjs';
import { ZoomLevel } from '@clr/addons/a11y';
import { AppfxCard } from '@clr/addons/card-container';
import { ClrDatagridVirtualScrollRangeInterface, ClrDatagrid } from '@clr/angular/data/datagrid';
import { ActionDefinition } from '@clr/addons/datagrid';
import { ComponentFixture } from '@angular/core/testing';
import { FilterMode, FilterablePropertyDefinition, PropertyFilter } from '@clr/addons/datagrid-filters';
import { DefaultButton } from '@clr/addons/dialog';
import { TabLayout, Step, WorkflowModel, CloseHandler, ModelChange, OnStepValidate, OnStepActivate, StepModel, StepValidationState } from '@clr/addons/var';
import { PropertyViewStrings, PropertyViewMessageModel, PropertyViewPropertyModel } from '@clr/addons/property-view';
import { ClrTab } from '@clr/angular/layout/tabs';
import * as i1 from '@angular/platform-browser/animations';
import { Reason } from '@clr/addons/wizard';

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

declare class MockAppfxCardContainerComponent {
    containerId: string;
    cards: unknown[];
    persistenceStore?: unknown;
    showCardContainerSettings: boolean;
    dragDropEnabled: boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockAppfxCardContainerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockAppfxCardContainerComponent, "appfx-card-container", never, { "containerId": { "alias": "containerId"; "required": false; }; "cards": { "alias": "cards"; "required": false; }; "persistenceStore": { "alias": "persistenceStore"; "required": false; }; "showCardContainerSettings": { "alias": "showCardContainerSettings"; "required": false; }; "dragDropEnabled": { "alias": "dragDropEnabled"; "required": false; }; }, {}, never, never, false, never>;
}
declare class MockAppfxCardContainerStandaloneComponent extends MockAppfxCardContainerComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<MockAppfxCardContainerStandaloneComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockAppfxCardContainerStandaloneComponent, "appfx-card-container", never, {}, {}, never, never, true, never>;
}

declare class MockContainerService {
    getCardOrder(): void;
    moveCard(): void;
    getVisibleCardsCount(): void;
}
declare class MockA11yService {
    isSelected(): void;
    isDraggableOver(): void;
    selectCard(): void;
    moveDropPosition(): void;
}
declare class MockDragDropService {
    onDragStart(): void;
    onDragDrop(): void;
}
declare class MockLayoutService {
    updateCardSize(): void;
}
declare class MockRenderer2 {
    setStyle(el: any, name: string, style: string): void;
    removeStyle(el: any, name: string): void;
}
declare class MockCardContainerComponent {
    cardContainer: ViewContainerRef;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockCardContainerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockCardContainerComponent, "ng-component", never, {}, {}, never, never, false, never>;
}
declare class SampleCardComponent {
    eleRef: ElementRef;
    constructor(el: ElementRef);
    static ɵfac: i0.ɵɵFactoryDeclaration<SampleCardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SampleCardComponent, "ng-component", never, {}, {}, never, never, false, never>;
}
declare class SampleCardWithoutFooterComponent {
    eleRef: ElementRef;
    constructor(el: ElementRef);
    static ɵfac: i0.ɵɵFactoryDeclaration<SampleCardWithoutFooterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SampleCardWithoutFooterComponent, "ng-component", never, {}, {}, never, never, false, never>;
}
declare class SampleCardWithoutHeaderComponent {
    eleRef: ElementRef;
    constructor(el: ElementRef);
    static ɵfac: i0.ɵɵFactoryDeclaration<SampleCardWithoutHeaderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SampleCardWithoutHeaderComponent, "ng-component", never, {}, {}, never, never, false, never>;
}
declare class MockElementRef extends ElementRef {
    nativeElement: {
        querySelector: () => void;
    };
}
declare const sortCardsFn: (a: AppfxCard, b: AppfxCard) => number;
declare const sampleCards: ({
    id: string;
    title: string;
    componentClass: typeof SampleCardComponent;
    hidden: boolean;
    order: number;
    view: EmbeddedViewRef<void>;
    canHide?: undefined;
} | {
    id: string;
    title: string;
    componentClass: typeof SampleCardComponent;
    hidden: boolean;
    canHide: boolean;
    order: number;
    view: EmbeddedViewRef<void>;
})[];
declare const sampleCardsSettings: {
    id: string;
    hidden: boolean;
    order: number;
}[];
declare const cardIdToOrder: {
    [x: string]: number;
    cardWithDefaultOrder: number;
};

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
    isExpanded(): boolean;
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

declare class MockAppfxDialogComponent {
    title: string;
    subTitle: string;
    size: string;
    height: string;
    defaultButton: DefaultButton;
    cancelButtonLabel: string;
    okButtonLabel: string;
    tabLayout: TabLayout;
    disableTabsContent: boolean;
    loading: boolean;
    steps: Step[];
    model: WorkflowModel;
    closeHandler: CloseHandler;
    showTabLinks: boolean;
    opened: boolean;
    readonly onModelChange: EventEmitter<ModelChange[]>;
    onClose: EventEmitter<void>;
    openedChange: EventEmitter<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockAppfxDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockAppfxDialogComponent, "appfx-dialog", never, { "title": { "alias": "title"; "required": false; }; "subTitle": { "alias": "subTitle"; "required": false; }; "size": { "alias": "size"; "required": false; }; "height": { "alias": "height"; "required": false; }; "defaultButton": { "alias": "defaultButton"; "required": false; }; "cancelButtonLabel": { "alias": "cancelButtonLabel"; "required": false; }; "okButtonLabel": { "alias": "okButtonLabel"; "required": false; }; "tabLayout": { "alias": "tabLayout"; "required": false; }; "disableTabsContent": { "alias": "disableTabsContent"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; "steps": { "alias": "steps"; "required": false; }; "model": { "alias": "model"; "required": false; }; "closeHandler": { "alias": "closeHandler"; "required": false; }; "showTabLinks": { "alias": "showTabLinks"; "required": false; }; "opened": { "alias": "opened"; "required": false; }; }, { "onModelChange": "onModelChange"; "onClose": "onClose"; "openedChange": "openedChange"; }, never, never, false, never>;
}
declare class MockAppfxDialogStandaloneComponent extends MockAppfxDialogComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<MockAppfxDialogStandaloneComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockAppfxDialogStandaloneComponent, "appfx-dialog", never, {}, {}, never, never, true, never>;
}

declare class MockAppfxDialogHeaderComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<MockAppfxDialogHeaderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockAppfxDialogHeaderComponent, "appfx-dialog-header", never, {}, {}, never, ["*"], false, never>;
}
declare class MockAppfxDialogHeaderStandaloneComponent extends MockAppfxDialogHeaderComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<MockAppfxDialogHeaderStandaloneComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockAppfxDialogHeaderStandaloneComponent, "appfx-dialog-header", never, {}, {}, never, ["*"], true, never>;
}

declare class MockAppfxMenuActionComponent {
    actionId: string;
    iconClass?: string;
    text?: string;
    shortcut?: string;
    enabled?: boolean;
    handle: EventEmitter<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockAppfxMenuActionComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockAppfxMenuActionComponent, "appfx-menu-action", never, { "actionId": { "alias": "actionId"; "required": false; }; "iconClass": { "alias": "iconClass"; "required": false; }; "text": { "alias": "text"; "required": false; }; "shortcut": { "alias": "shortcut"; "required": false; }; "enabled": { "alias": "enabled"; "required": false; }; }, { "handle": "handle"; }, never, ["*"], false, never>;
}
declare class MockAppfxMenuActionStandaloneComponent extends MockAppfxMenuActionComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<MockAppfxMenuActionStandaloneComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockAppfxMenuActionStandaloneComponent, "appfx-menu-action", never, {}, {}, never, ["*"], true, never>;
}

declare class MockAppfxMenuComponent {
    text: string;
    opened: EventEmitter<void>;
    closed: EventEmitter<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockAppfxMenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockAppfxMenuComponent, "appfx-menu", never, { "text": { "alias": "text"; "required": false; }; }, { "opened": "opened"; "closed": "closed"; }, never, ["*"], false, never>;
}
declare class MockAppfxMenuStandaloneComponent extends MockAppfxMenuComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<MockAppfxMenuStandaloneComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockAppfxMenuStandaloneComponent, "appfx-menu", never, {}, {}, never, ["*"], true, never>;
}

declare class MockPropertyViewComponent {
    data: any;
    config: any;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockPropertyViewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockPropertyViewComponent, "appfx-property-view", never, { "data": { "alias": "data"; "required": false; }; "config": { "alias": "config"; "required": false; }; }, {}, never, never, false, never>;
}
declare class MockPropertyViewStandaloneComponent extends MockPropertyViewComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<MockPropertyViewStandaloneComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockPropertyViewStandaloneComponent, "appfx-property-view", never, {}, {}, never, never, true, never>;
}

/**
 * Mock user-visible strings used in the 'appfx-property-view' library.
 */
declare class MockPropertyViewStrings extends PropertyViewStrings {
    toggle: string;
    actions: string;
    categoryListItemsAreaLabel: string;
    categoryListItemAreaLabel: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockPropertyViewStrings, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MockPropertyViewStrings>;
}

declare function verifyPropertyViewProperty(key: string, value: string[], propertyModel: PropertyViewPropertyModel): void;
declare function verifyPropertyViewMessage(textValue: string, icon: string, messageModel: PropertyViewMessageModel): void;

declare class MockStepperComponent {
    steps: Step[];
    wizardModel: WorkflowModel;
    loading: boolean;
    onModelChange: EventEmitter<ModelChange[]>;
    onFinish: EventEmitter<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockStepperComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockStepperComponent, "appfx-stepper", never, { "steps": { "alias": "steps"; "required": false; }; "wizardModel": { "alias": "wizardModel"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; }, { "onModelChange": "onModelChange"; "onFinish": "onFinish"; }, never, ["*"], false, never>;
}
declare class MockStepperStandaloneComponent extends MockStepperComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<MockStepperStandaloneComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockStepperStandaloneComponent, "appfx-stepper", never, {}, {}, never, ["*"], true, never>;
}

declare class TabsHelper {
    private tabs;
    private component;
    constructor(contextDebugElement: DebugElement);
    /**
     * Discover clarity tab links of (zero or more) items within the tabs.
     */
    getLinkList(): Array<DebugElement>;
    /**
     * A DOM pointer to a tab link, as afforded by supplied index into collection.
     */
    findLink(linkIndex: number): DebugElement | undefined;
    /**
     * Retrieves the active Clarity Tab instance.
     */
    getActiveTab(): ClrTab;
    /**
     * Determines the active shown tab using relative sequences that map directly to DOM source order.
     */
    getActiveTabIndex(): number;
    /**
     * Extract located projected content as provided for the active tab.
     */
    getActiveTabContentElement(): HTMLElement | undefined;
    /**
     * Clicks a tab link given the tab index.
     */
    clickLink(linkIndex: number): void;
    /**
     * Searches for tab link text, as applied to a tab button.
     */
    findLinkText(linkIndex: number): string | undefined;
    /**
     * Debug element for the icon found inside the tab link.
     */
    findLinkIcon(linkIndex: number): DebugElement | undefined;
    /**
     * Optionally find the custom component or desired HTML element within the active panel.
     */
    findContentView(childTabContentQuery?: Predicate<DebugElement>): DebugElement | undefined;
    areTabsVisible(): boolean;
}

declare class MockStepComponent implements OnStepValidate, OnStepActivate {
    model: MockStepModel;
    activate(): void;
    validate(): Observable<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockStepComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockStepComponent, "appfx-mock-page-page", never, {}, {}, never, never, false, never>;
}
declare class InvalidMockComponent extends MockStepComponent {
    validate(): Observable<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<InvalidMockComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InvalidMockComponent, "appfx-invalid-mock-page-page", never, {}, {}, never, never, false, never>;
}
declare class MockStepModel implements StepModel {
    mockPropertyValue: string;
    isActivated: boolean;
    isValidated: boolean;
    readyToComplete: boolean;
    validationState: StepValidationState;
    constructor(mockPropertyValue: string);
}
/** Simple mock of {@link WorkflowConfigurationService} used by workflow-dependent tests. */
declare class MockWorkflowConfigurationService {
    private debugValue;
    get debug(): boolean;
    set debug(newValue: boolean);
}
declare class MockWorkflowTestModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MockWorkflowTestModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MockWorkflowTestModule, [typeof InvalidMockComponent, typeof MockStepComponent], [typeof i1.NoopAnimationsModule], never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MockWorkflowTestModule>;
}

declare class MockAppfxWizardComponent {
    title: string;
    pages: Step[];
    wizardModel: WorkflowModel;
    loading: boolean;
    size: string;
    opened: boolean;
    openedChange: EventEmitter<boolean>;
    onModelChange: EventEmitter<ModelChange[]>;
    onFinish: EventEmitter<void>;
    onClose: EventEmitter<Reason>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockAppfxWizardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockAppfxWizardComponent, "appfx-wizard", never, { "title": { "alias": "title"; "required": false; }; "pages": { "alias": "pages"; "required": false; }; "wizardModel": { "alias": "wizardModel"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; "size": { "alias": "size"; "required": false; }; "opened": { "alias": "opened"; "required": false; }; }, { "openedChange": "openedChange"; "onModelChange": "onModelChange"; "onFinish": "onFinish"; "onClose": "onClose"; }, never, never, false, never>;
}
declare class MockWizardStandaloneComponent extends MockAppfxWizardComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<MockWizardStandaloneComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MockWizardStandaloneComponent, "appfx-wizard", never, {}, {}, never, never, true, never>;
}

declare class WizardHelper {
    #private;
    private wizard;
    constructor(wizard: DebugElement);
    get pageNavTitles(): Array<string | undefined>;
    get isVisible(): boolean;
    get activePageNavTitle(): string | undefined;
    get activePageTitle(): string;
    get size(): string | undefined;
    get buttons(): DebugElement[];
    get visibleButtons(): DebugElement[];
    get cancelButton(): DebugElement;
    get cancelButtonText(): string;
    get backButton(): DebugElement;
    get backButtonText(): string;
    get nextButton(): DebugElement;
    get nextButtonText(): string;
    get finishButton(): DebugElement;
    get finishButtonText(): string;
    private get stepNavPanel();
    private get stepNavs();
    private get showStepNavBtn();
    private get closeStepNavBtn();
    navigateToStep(stepIndex: number): void;
    isNavVisible(): boolean;
    isStepNavEnabled(stepIndex: number): boolean;
    isShowNavIconVisible(): boolean;
    showNavigator(): void;
    closeNavigator(): void;
    cancel(): void;
    back(): void;
    next(): void;
    finish(): void;
    private click;
    private getLastTextNode;
}

export { FilterInputTestHelper, GridCellTestHelper, GridFooterTestHelper, GridHelper, GridPlaceholder, GridRowTestHelper, InvalidMockComponent, MockA11yService, MockAppfxCardContainerComponent, MockAppfxCardContainerStandaloneComponent, MockAppfxDatagridComponent, MockAppfxDialogComponent, MockAppfxDialogHeaderComponent, MockAppfxDialogHeaderStandaloneComponent, MockAppfxDialogStandaloneComponent, MockAppfxMenuActionComponent, MockAppfxMenuActionStandaloneComponent, MockAppfxMenuComponent, MockAppfxMenuStandaloneComponent, MockAppfxWizardComponent, MockCardContainerComponent, MockContainerService, MockDatagridActionBarComponent, MockDatagridCellContainerComponent, MockDatagridColumnToggleComponent, MockDatagridFiltersComponent, MockDatagridFiltersStandaloneComponent, MockDatagridPersistSettingsDirective, MockDatagridPreserveSelectionDirective, MockDragDropService, MockElementRef, MockIsRowSelectablePipe, MockLayoutService, MockPropertyViewComponent, MockPropertyViewStandaloneComponent, MockPropertyViewStrings, MockRenderer2, MockRequiredFieldLegendComponent, MockRequiredFieldLegendStandaloneComponent, MockStandaloneDatagridComponent, MockStepComponent, MockStepModel, MockStepperComponent, MockStepperStandaloneComponent, MockWizardStandaloneComponent, MockWorkflowConfigurationService, MockWorkflowTestModule, SampleCardComponent, SampleCardWithoutFooterComponent, SampleCardWithoutHeaderComponent, TabsHelper, WizardHelper, ZoomLevelServiceMock, cardIdToOrder, sampleCards, sampleCardsSettings, sortCardsFn, verifyPropertyViewMessage, verifyPropertyViewProperty };

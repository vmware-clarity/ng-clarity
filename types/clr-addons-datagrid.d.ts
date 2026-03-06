import * as rxjs from 'rxjs';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as i0 from '@angular/core';
import { OnInit, OnChanges, AfterViewInit, OnDestroy, QueryList, ElementRef, EventEmitter, ChangeDetectorRef, SimpleChanges, Type, InjectionToken, Renderer2, TrackByFunction, TemplateRef, ViewContainerRef, PipeTransform, ModuleWithProviders } from '@angular/core';
import * as i14 from '@clr/addons/a11y';
import { ElementResizeService, ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import { ListRange } from '@angular/cdk/collections';
import * as i5 from '@angular/cdk/drag-drop';
import { CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import * as i15 from '@clr/addons/datagrid-filters';
import { FilterablePropertyDefinition, FilterMode, PropertyFilter } from '@clr/addons/datagrid-filters';
import { DragAndDropGroupService } from '@clr/addons/drag-and-drop';
import * as i3 from '@clr/angular/data/datagrid';
import { ClrDatagridFilterInterface, ClrDatagridStringFilterInterface, ClrDatagridComparatorInterface, ClrDatagridSortOrder, SelectionType, ClrDatagridPagination, ClrDatagridVirtualScrollRangeInterface, ClrDatagridStateInterface, ClrDatagridFilter, ClrDatagrid } from '@clr/angular/data/datagrid';
import { ClrPopoverService } from '@clr/angular/popover/common';
import * as i18 from '@angular/cdk/overlay';
import { ConnectionPositionPair, CdkConnectedOverlay } from '@angular/cdk/overlay';
import * as i16 from '@angular/cdk/a11y';
import * as i19 from '@clr/angular/forms';
import * as i21 from '@clr/angular/popover/dropdown';
import * as i22 from '@clr/angular/icon';
import * as i23 from '@clr/angular/utils/loading';
import * as i4 from '@angular/common';
import * as i26 from '@angular/forms';

/**
 * Expose most common datagrid actionbar layout styles.
 */
declare enum ActionBarLayout {
    flatCompact = "btn btn-sm btn-link",
    flat = "btn btn-link",
    outlined = "btn btn-sm btn-secondary"
}
/**
 * Configuration for actions.
 */
interface ActionDefinition<T = string> {
    id: string;
    label: T;
    ariaLabel?: string;
    enabled: boolean;
    tooltip?: T;
    /**
     * Specify style class to be applied. Default style is flatCompact - 'btn btn-sm btn-link'.
     * {@see ActionBarLayout}
     */
    class?: string;
    /**
     * True if the action button is visible above the grid, otherwise the button
     * is placed within a dropdown.
     */
    isVisible?: boolean;
    /**
     * When an action has children, it is displayed like a dropdown and
     * the children are the dropdown items.
     */
    children?: ActionDefinition[];
}

declare class DatagridActionBarComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    #private;
    private cdr;
    private el;
    private elementResizeService;
    queryActionBtnElementList: QueryList<ElementRef<HTMLButtonElement>>;
    actions: ActionDefinition[];
    btnLayout: string;
    dropdownOrientation: string;
    invokeAction: EventEmitter<ActionDefinition>;
    readonly actionsSubject: BehaviorSubject<ActionDefinition<string>[]>;
    readonly actions$: rxjs.Observable<ActionDefinition<string>[]>;
    isDropdownOpened: boolean;
    private listOfWidths;
    constructor(cdr: ChangeDetectorRef, el: ElementRef<HTMLElement>, elementResizeService: ElementResizeService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
    getDropdownActions(): ActionDefinition[];
    hasDropdownActions(): boolean;
    onActionClick(action: ActionDefinition): void;
    /**
     * Derives the base root element size (REM) in pixels.
     */
    deriveBaseRootElementSize(): number;
    private isActionsIdsEqual;
    private initActionsVisibility;
    private restoreVisible;
    private updateListOfWidths;
    private updateLayout;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridActionBarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DatagridActionBarComponent, "appfx-datagrid-action-bar", never, { "actions": { "alias": "actions"; "required": false; }; "btnLayout": { "alias": "btnLayout"; "required": false; }; "dropdownOrientation": { "alias": "dropdownOrientation"; "required": false; }; }, { "invokeAction": "invokeAction"; }, never, never, false, never>;
}

/**
 * Defining the three export types, selected export option is passed to Datagrid Export Component
 * @type {{ALL: string; SELECTED_ONLY: string; MATCHING_FILTERS: string}}
 */
declare enum ExportType {
    ALL = "ALL",
    SELECTED_ONLY = "SELECTED_ONLY",
    MATCHING_FILTERS = "MATCHING_FILTERS"
}

interface ColumnFilter<T> extends ClrDatagridFilterInterface<T> {
    /**
     * Initial filter value provided from defaultFilterValue
     * property of column definition @see #SelectionType
     */
    filterValue: any;
}

/**
 * Defines a column in the Datagrid.
 */
interface ColumnDefinition<T> {
    /**
     * Unique identifier for the column, used for persistence.
     */
    uid?: string;
    /**
     * The text displayed as the column header.
     */
    displayName: string;
    /**
     * The name of the property in the Datagrid data that this column represents.
     */
    field: string;
    /**
     * Determines whether the column can be hidden using the column toggle in the footer.
     * If set to `false`, the column will always remain visible.
     *
     * @default true - Columns are hideable by default.
     */
    hideable?: boolean;
    /**
     * Specifies whether the column is initially hidden when the Datagrid is rendered.
     * A value of `true` hides the column by default, while `false` ensures it is visible.
     *
     * @default false - Columns are visible by default.
     */
    hidden?: boolean;
    /**
     * Defines string filter for data in this column.
     */
    stringFilter?: ClrDatagridStringFilterInterface<T>;
    /**
     * Defines filter component for data in this column.
     */
    filter?: Type<ColumnFilter<T>>;
    /**
     * Default filter value for the column's filter.
     */
    defaultFilterValue?: any;
    /**
     * A custom component to render/display data in this column.
     */
    columnRenderer?: Type<ColumnRenderer<T>>;
    /**
     * Additional key/value pair configuration options for the `columnRenderer`.
     */
    columnRendererConfig?: any;
    /**
     * Comparator that to be used when sorting data in this column.
     */
    sortComparator?: ClrDatagridComparatorInterface<T> | string;
    /**
     * Specifies the default sort order for the column.
     */
    defaultSortOrder?: ClrDatagridSortOrder;
    /**
     * Column width in pixels (e.g., '100px'). Auto-calculated if not set.
     */
    width?: string;
    /**
     * The field by which the column will be filtered and sorted.
     */
    sortAndFilterByField?: string;
}
/**
 * Represents a custom renderer for a Datagrid column, responsible for displaying data
 * and responding to changes in the associated item or column configuration.
 */
interface ColumnRenderer<T> {
    /**
     * The data item representing a row in the Datagrid.
     */
    item: T;
    /**
     * The definition of the column being rendered.
     */
    column?: ColumnDefinition<T>;
    /**
     * Called when the item or the column objects have changed.
     * The DatagridCellContainer has ngOnChanges lifecycle hook and call
     * this function if it is implemented.
     *
     * In most cases this method is good to be implemented.
     * The renderer should not implement this method only if they don't expect
     * their data to be updated or if they directly bind properties of the item
     * object in their html template.
     */
    onChange?(item: T, column?: ColumnDefinition<T>): void;
}

interface ColumnState {
    column: ColumnDefinition<any>;
}
interface ColumnResize extends ColumnState {
    columnSize: number;
}
interface ColumnSortOrder extends ColumnState {
    sortOrder: ClrDatagridSortOrder;
}
interface ColumnHiddenState extends ColumnState {
    hidden: boolean;
}
interface ColumnFilterChange extends ColumnState {
    filterValue: any;
}
interface ColumnOrderChanged {
    previousIndex: number;
    currentIndex: number;
    columns: ColumnDefinition<any>[];
}

interface DatagridItemSet {
    totalDatagridItems: any[];
    selectedItems: any[];
    filteredDatagridItems: any[];
}
interface ExportValueCallbackParams {
    item: any;
    field: string;
    itemValue: any;
}
type SortFunction = (items: any[], sortOrder?: ColumnSortOrder) => any[];
/**
 * Configuration for client-side data export.
 * Defines export settings such as file name and columns to be exported,
 * whether the export is custom (will be made by host component), count of all items (valuable for client-side grids in which data are filtered)
 * and how to sort the exported items.
 */
interface ClientSideExportConfig {
    exportedFileName: string;
    columnDefinitions: ExportColumnDefinition[];
    customExport?: boolean;
    allItemsCount?: number;
    /**
     * If true, the export service will sort the items before exporting them
     * using the sortOrder field and the provided sortFunction. If the sort function
     * is not provided, we will use the internal sortExportedItems function.
     */
    sort?: boolean;
    /**
     * Column sort order is set by the grid when the user clicks on a column or when
     * ClientSideExportConfig is created. It is provided to SortFunction.
     *
     */
    sortOrder?: ColumnSortOrder;
    /**
     * Custom sort function, which can be used for sorting the items before exporting them.
     */
    sortFunction?: SortFunction;
}
/**
 * Represents the status of an export operation.
 */
interface ExportStatus {
    /**
     * Specifies the type of export operation being performed.
     * @See ExportType {{ALL: string; SELECTED_ONLY: string; MATCHING_FILTERS: string}}
     */
    exportType: ExportType;
    /**
     * Indicates whether the export operation is currently in progress.
     */
    inProgress?: boolean;
}
/**
 * Defines a column structure for Export
 */
interface ExportColumnDefinition {
    /**
     * The text for the column header
     */
    displayName: string;
    /**
     *  field: The name of the property that this column represents.
     *  Note: Make sure that the field property in Column Definitions are the same as used in rows for grid values.
     *
     *  See Example:->
     *  Columns: [ { 'field': 'name', 'displayName': 'Name', 'exportProperty': true },
     *             { 'field': 'id', 'displayName': 'id', 'exportProperty': false },
     *             { 'field': 'version', 'displayName': 'Version No.', 'exportProperty': true } ]
     *  Rows:    [ { 'name': 'Item A', 'id': 'item1', 'version': '1.0.1' },
     *             { 'name': 'Item B', 'id': 'item2', 'version': '1.0.2' } ]
     */
    field: string;
    /**
     * Whether to export this property or not
     */
    getExportValue?: any;
}

/**
 * Helper functions to convert data into CSV format
 */
declare class CsvHelperService {
    getData(rows: any[], columns: ExportColumnDefinition[]): string;
    getColumnDataFromColumnDef(columnDefinitions: ExportColumnDefinition[]): string;
    getRowDataFromColumnDef(exportItems: any[], columnDefinitions: ExportColumnDefinition[]): string;
    toCsvFormat(itemValue: string): string;
    /** To extract value from nested JSON objects."
     * Example =>
     * JSON object to extract value from => { product: {cost: {limit: 100, lowestValue: 0 }}}
     * Field format => "product.cost.limit'
     * Value returned => 100
     */
    private getItemValueFromColumnField;
    static ɵfac: i0.ɵɵFactoryDeclaration<CsvHelperService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CsvHelperService>;
}

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
declare class DatagridStrings {
    /**
     * Text displayed inside the grid when the grid is empty.
     */
    noItemsFound: string;
    /**
     * Label of the column toggle buttons.
     */
    showColumns: string;
    /**
     * Label of the button (inside column toggle) that selects all columns.
     */
    selectAll: string;
    /**
     * Tooltip for Show Columns toggle button
     */
    pickColumns: string;
    /**
     * Datagrid Show columns menu description
     */
    showColumnsMenuDescription: string;
    /**
     * Datagrid Show columns / All columns selected confirmation
     */
    allColumnsSelected: string;
    /**
     * Footer label to display.
     * Can contain up to 3 placeholders:
     * {0} - total items count
     * {1} - index of first item of the current page (if paging is used)
     * {2} - index of last item of the current page (if paging is used)
     *
     * @example
     *    footer = "Apples and bananas";
     *    footer = "{0} apples";
     *    footer = "{1} - {2} of {0} apples"
     *
     * If not set, the grid will automatically show one of the following strings:
     * @see singleItem: if there is only 1 item in the grid<br/>
     * @see multipleItems: if there are many items and data is not paged<br/>
     * @see pagedItems: if there is paging enabled
     */
    footer?: string;
    /**
     * Footer label displayed when there is a single item.
     * @example "1 item"
     */
    singleItem: string;
    /**
     * Footer label to display total items count.
     * @example "{0} items"
     */
    multipleItems: string;
    /**
     * Footer label when using pagination.
     * @example "{1} - {2} of {0} items"
     */
    pagedItems: string;
    /**
     * Label for page size selector.
     */
    itemsPerPage: string;
    /**
     * Title of the export button.
     */
    exportLink: string;
    /**
     * Title of 'Export > Export All' option.
     */
    exportAll: string;
    /**
     * Title of 'Export > Matching Filters' option.
     */
    exportMatchingFilters: string;
    /**
     * Title of 'Export > Selected Rows' option.
     */
    exportSelectedRows: string;
    /**
     * Error message displayed in case of error during data export.
     */
    exportErrorMessage: string;
    /**
     * Title of the error dialog displayed in case of error during data export.
     */
    exportErrorTitle: string;
    /**
     * Text for close button of column toggler on 4x zoom
     */
    closeColumnTogglerText: string;
    /**
     * Label of the button for deselecting all rows.
     */
    deselectAll: string;
    /**
     * Details pane label for the collapsed button.
     * @example "Expand the details pane for the {0} item"
     */
    expandDetailsPaneLabel: string;
    /**
     * Details pane label for the expanded button.
     * @example "Collapse the details pane for the {0} item"
     */
    collapseDetailsPaneLabel: string;
    /**
     * Placeholder text for the filter input in each filterable column.
     * @example "Filter items"
     */
    filterPlaceholder: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridStrings, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DatagridStrings>;
}

declare const appfxDatagridErrorNotifiableToken: InjectionToken<ErrorNotifiable>;
interface ErrorNotifiable {
    notifyError(title: string, message: string): void;
}

declare class ExportProviderService {
    private csvHelperService;
    private renderer;
    private elementRef;
    private dgStrings;
    private errorNotifiableService;
    constructor(csvHelperService: CsvHelperService, renderer: Renderer2, elementRef: ElementRef, dgStrings: DatagridStrings, errorNotifiableService: ErrorNotifiable);
    exportUIOnlyData(datagridProperties: ClientSideExportConfig, exportStatus: ExportStatus, datagridItemSet: DatagridItemSet): void;
    /**
     * Function to create a CSV file from CsvData and download it
     */
    downloadFile(csvData: string, exportedFileName?: string): void;
    private showExportError;
    /**
     * Sort function used internally from ExportProviderService to sort exported items.
     */
    private sortExportedItems;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExportProviderService, [null, null, null, null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ExportProviderService>;
}

/**
 * Represents the context of a right-click event on a grid row.
 */
interface ContextMenuEvent {
    event: MouseEvent;
    /**
     * An array of selected grid items.
     * This property represents the context in which the right-click event occurred.
     */
    context: any[];
}

/**
 * Interface defining the configuration required to enable drag-and-drop functionality within a datagrid.
 * This configuration specifies which field should be displayed while dragging and optionally groups the draggable items.
 */
interface DatagridDragConfig {
    /**
     * The name of the field whose value will be displayed as a ghost element while dragging.
     * The ghost element is the visual representation of the dragged item that follows the cursor during
     * a drag-and-drop operation.
     */
    fieldName: string;
    /**
     * An optional identifier for grouping draggable elements.
     */
    dragGroup?: string;
}

interface PreselectableComponent {
    trackByGridItemProperty: string;
    trackByFunction: TrackByFunction<any>;
    selectionType: SelectionType;
    selectedItems: any[];
    serverDrivenDatagrid: boolean;
    gridItemsChange: EventEmitter<any[]>;
    /**
     * Handles datagrid selected items changes.
     */
    onSelectedItemsChange: (selectedItems: any[]) => void;
}
/**
 * The problem we want to solve with the common interface and the token below:
 * We don't want this directive to enumerate all its host components by type
 * because we don't want to import and thus depend on components which might
 * use the directive. To reverse the dependency, we use the token. Each
 * component which might host this directive should provide itself as the token.
 */
declare const appfxPreselectableComponentToken: InjectionToken<PreselectableComponent>;
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
declare class DatagridPreserveSelectionDirective implements AfterViewInit, OnDestroy {
    preselectableComponent: PreselectableComponent;
    /**
     * preserveSelection - needed mainly because of list-view component and
     * indicates whether grid should preserve the selection based on 'trackByFunction' or
     * 'trackByGridItemProperty'.
     */
    preserveExistingSelection: boolean;
    selectedItemsUpdated: EventEmitter<any[]>;
    private component;
    private selectBy;
    private gridItemChangeSub;
    constructor(preselectableComponent: PreselectableComponent);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    updateSelectedItems(items: any[]): void;
    private findSelectedItems;
    private findAndUpdateSelectedItems;
    private createSelectedItemsDictionary;
    private getItemUniquePropertyValue;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridPreserveSelectionDirective, [{ host: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridPreserveSelectionDirective, "[appfxPreserveSelection]", never, { "preserveExistingSelection": { "alias": "preserveExistingSelection"; "required": false; }; }, { "selectedItemsUpdated": "selectedItemsUpdated"; }, never, never, false, never>;
}

interface ActionClickEvent<T = any> {
    action: ActionDefinition;
    /**
     * Represent action context.
     * Array of selected data grid items in case of action bar action
     * or the data grid item associated with the datagrid row which single row
     * action is clicked.
     */
    context: T;
}
interface SingleRowActionOpen<T = any> {
    /**
     * Menu state open/close
     */
    open: boolean;
    /**
     * Actions of the single row datagrid menu.
     */
    actions: ActionDefinition[] | null;
    /**
     * The data grid item associated with the Datagrid row which single row
     * menu is opened/closed.
     */
    context: T;
}

/**
 * The GridLayoutModel interface defines configurable options for customizing
 * the visual appearance and behavior of the datagrid layout.
 */
interface GridLayoutModel {
    /**
     * Enables compact mode for the datagrid, reducing row height to create a denser layout.
     * This mode is particularly useful when you need to display more rows within the same viewport.
     * - `true`: Enables compact mode.
     * - `false`: Uses the default Clarity layout with standard row and column height.
     *
     * Defaults to `true` if not specified.
     */
    compact?: boolean;
    /**
     * Disables the datagrid, preventing all user interactions.
     * - `true`: Disables the grid and makes it non-interactive.
     * - `false`: Allows full user interactions.
     *
     * Defaults to `false` if not specified.
     */
    disabled?: boolean;
    /**
     * Adjusts the datagrid layout to stretch and fill 100% of the height of the parent container.
     * - `true`: The datagrid stretches to fill the parent container's height.
     * - `false`: The datagrid height adjusts based on its content.
     *
     * Defaults to `true` if not specified.
     */
    stretchToParentHeight?: boolean;
}
/**
 * The GridFooterModel interface configures the behavior and appearance of the datagrid footer.
 */
interface GridFooterModel {
    /**
     * Controls the visibility of the datagrid footer.
     * - `true`: The footer is displayed.
     * - `false`: The footer is hidden.
     *
     * Defaults to `true` if not specified.
     */
    showFooter?: boolean;
    /**
     * Controls the visibility of the column toggle in the datagrid footer.
     * - `true`: The column toggle is hidden.
     * - `false`: The column toggle is visible, allowing users to show or hide columns.
     *
     * Defaults to `false` if not specified.
     */
    hideColumnToggle?: boolean;
    /**
     * Configuration for client-side data export behavior.
     * This option allows to define settings such as the file name, export columns.
     *
     * Note: To implement custom export logic, use the `enableCustomExport` property.
     * The `onExportData` event can be handled manually for custom export behavior.
     *
     * @see ClientSideExportConfig
     */
    clientSideExportConfig?: ClientSideExportConfig;
    /**
     * Specifies whether the export button should be displayed in the datagrid.
     * Enabling this option causes the component to emit the `onExportData` event, which can be used for implementing custom export logic.
     *
     * If `clientSideExportConfig` is provided, the export button will automatically be shown.
     *
     * Values:
     * - `true`: Displays the export button and triggers the `onExportData` event when clicked.
     * - `false`: Hides the export button.
     *
     * Defaults to `false` if not specified.
     */
    enableCustomExport?: boolean;
}
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
declare class DatagridComponent<T> implements OnInit, OnDestroy, AfterViewInit, OnChanges, PreselectableComponent {
    #private;
    private readonly uid;
    private cdr;
    private readonly exportProviderService;
    private readonly groupService;
    private readonly zoomLevelService;
    searchTerm: string;
    visibleColumns: ColumnDefinition<T>[];
    draggedItems: T[];
    clrDatagridPagination: ClrDatagridPagination;
    /**
     * Shows loading indicator inside the datagrid to prevent user interactions while data is loading.
     * Set to `true` to display loading; set to `false` to hide the loading indicator.
     * Defaults to `false`.
     */
    loading: boolean;
    /**
     * When set to `true`, automatically selects the first item in the datagrid upon initialization.
     * Defaults to `false`.
     */
    preSelectFirstItem: boolean;
    /**
     * Defines the selectable page size options displayed in the grid footer.
     * Users can choose from these options to control the number of items shown per page.
     */
    pageSizeOptions: number[];
    /**
     * The totalItems should be provided when the grid is server driven datagrid
     * (serverDrivenDatagrid = true), otherwise the totalItems is calculated
     * internally and shouldn't be set.
     */
    totalItems: number;
    /**
     * Shows the projected custom pagination component from the host component.
     * Used for infinite pagination scenarios.
     * Default: false
     */
    showCustomPagination: boolean;
    /**
     * Enables or disables server-driven mode for the datagrid.
     * When set to `true`, pagination and filtering should be managed externally.
     * Defaults to `false`.
     */
    serverDrivenDatagrid: boolean;
    /**
     * All grid items count when no filter is added.
     * Used for Export functionality when showExport is true.
     * Should be provided only when the grid is server driven datagrid
     * (serverDrivenDatagrid = true), otherwise the listItemsCount is calculated
     * internally and shouldn't be set.
     *
     * @deprecated To be removed with VSUIP-4776
     */
    listItemsCount: number;
    /**
     * Template for the content displayed when a row expands. Enables expandable row functionality.
     */
    rowDetailContent: TemplateRef<unknown>;
    rowsExpandedByDefault: boolean;
    /**
     * A function that defines how to be tracked the changes for items in the grid.
     */
    trackByFunction: TrackByFunction<T>;
    /**
     * property expression which defines the item property which to be
     * used for tracking changes of items in in the grid. May be deep with "a.b.c" notation.
     */
    trackByGridItemProperty: string;
    /**
     * Reference to the template containing the content for the header
     * displayed on top of the detail content.
     */
    detailHeader?: TemplateRef<unknown>;
    /**
     * Reference to the template containing the detail content.
     */
    detailBody?: TemplateRef<unknown>;
    /**
     * The state passed to the detail pane. Contains the gridItem for which
     * detail is shown or null in case detail pane is hidden.
     */
    detailState: T | null;
    /**
     * Used to notify the hosting view that the detailState value has changed
     * ( to enable two way data binding )
     */
    detailStateChange: EventEmitter<T>;
    /**
     * A function that determines if a specific row is locked (disabled).
     *
     * This function receives a row item as an argument and returns a boolean indicating
     * whether the row should be locked (`true`) or enabled (`false`).
     */
    isRowLocked: (rowItem: T) => boolean;
    /**
     * Configuration for enabling drag-and-drop functionality within the datagrid.
     * By default, drag and drop is disabled. To enable it, provide a valid configuration object
     * implementing the @see DatagridDragConfig interface.
     */
    dragConfig: DatagridDragConfig;
    /**
     * An array of properties used for advanced filtering in FilterMode.Advanced
     */
    filterableProperties: FilterablePropertyDefinition[];
    /**
     * Specifies the type of global filter to enable.
     * - `FilterMode.Quick`: Enables the quick filter.
     * - `FilterMode.Advanced`: Enables the advanced filter.
     * - `FilterMode.AdvancedOnly`: Enables only the advanced filter.
     *
     * When the filter is enabled, the component will emit the `searchTermChange`/`advancedFilterChange` event whenever the filter changes.
     * If not set, no filter will be displayed.
     */
    filterMode?: FilterMode;
    /**
     * Action definitions for the single row actions.
     */
    singleRowActions: ActionDefinition[] | null;
    /**
     * Controls whether the datagrid selection should be preserved on filtering.
     */
    preserveExistingSelectionOnFilter: boolean;
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
    virtualScrolling: boolean;
    /**
     * Input for providing data when virtual scrolling is enabled.
     * <code>gridItems</code> should not be used in this case.
     */
    dataRange: ClrDatagridVirtualScrollRangeInterface<T>;
    /**
     * Data source for the Datagrid, represented as an array of row objects.
     *
     * Each object in this array corresponds to a row in the Datagrid, where
     * individual fields map to columns based on each column's `field` property
     * as defined in {@link ColumnDefinition}.
     */
    gridItems: T[];
    /**
     * Emits the updated page size {@link pageSize} to the parent component when changed.
     */
    pageSizeChange: EventEmitter<number>;
    /**
     * Emits the updated gridItems to the parent component when changed.
     */
    gridItemsChange: EventEmitter<T[]>;
    /**
     * Emits when advanced filter criteria changes.
     */
    advancedFilterChange: EventEmitter<PropertyFilter[]>;
    /**
     * Emits the updated column definitions {@link columns} to the parent component when changed.
     */
    columnDefsChange: EventEmitter<ColumnDefinition<T>[]>;
    /**
     * Emits the updated selected items {@link selectedItems} when changed.
     */
    selectedItemsChange: EventEmitter<T[]>;
    /**
     * Event emitter to tell the hosting view that user has requested to export list data
     */
    exportDataEvent: EventEmitter<ExportStatus>;
    /**
     * Event emitter to tell hosting view that search term, used for filtering has changed.
     */
    searchTermChange: EventEmitter<string>;
    /**
     * Event emitter to tell hosting view that size of column has changed.
     */
    columnResize: EventEmitter<ColumnResize>;
    /**
     * Event emitter to tell hosting view that sort order of column has changed.
     */
    columnSortOrderChange: EventEmitter<ColumnSortOrder>;
    /**
     * Event emitter to tell hosting view that hidden state of column has changed.
     */
    columnHiddenStateChange: EventEmitter<ColumnHiddenState>;
    /**
     * Event emitter to tell hosting view that column filtering has changed.
     */
    columnFilterChange: EventEmitter<ColumnFilterChange>;
    /**
     * Event emitter emitted when the data needs to be refreshed,
     * based on user action or external ones.
     */
    refreshGridData: EventEmitter<ClrDatagridStateInterface>;
    /**
     * Event emitter emits when data in the grid with virtual scrolling needs to be refreshed.
     */
    refreshVirtualGridData: EventEmitter<ClrDatagridStateInterface>;
    /**
     * Event emitter triggered when a single-row action or actionbar action is clicked.
     * The emitted event contains information about the action that was clicked. {@link ActionClickEvent}
     */
    actionClick: EventEmitter<ActionClickEvent<any>>;
    /**
     * Event emitter triggered when the single-row action menu is opened.
     * The emitted event contains information about the open state and the actions associated with the menu. {@link SingleRowActionOpen}
     */
    rowActionMenuOpenChange: EventEmitter<SingleRowActionOpen<any>>;
    /**
     * Event emitter triggered when a right-click event is performed on a grid row.
     */
    openContextMenu: EventEmitter<ContextMenuEvent>;
    /**
     * Event emitter to tell hosting view that column order has changed.
     */
    columnOrderChange: EventEmitter<ColumnOrderChanged>;
    protected applyFlexLayout: boolean;
    protected zoomLevel: ZoomLevel;
    protected gridLayoutModel: GridLayoutModel;
    protected gridFooterModel: GridFooterModel;
    protected readonly defaultUnsetValue: string;
    protected readonly defaultUnsortedOrder: ClrDatagridSortOrder;
    protected readonly dgStrings: DatagridStrings;
    protected enableSingleRowActions: boolean;
    private clrDatagrid;
    constructor(datagridStrings: DatagridStrings, uid: string, cdr: ChangeDetectorRef, exportProviderService: ExportProviderService, groupService: DragAndDropGroupService, zoomLevelService: ZoomLevelService);
    /**
     * Input property for the grid layout configuration.
     * Allows the consumer of the component to provide configuration values.
     *
     * @See GridLayoutModel
     */
    get layoutModel(): GridLayoutModel;
    set layoutModel(config: GridLayoutModel);
    /**
     * Input property for the footer configuration.
     * Allows the consumer of the component to provide configuration values.
     *
     * @See GridFooterModel
     */
    get footerModel(): GridFooterModel;
    set footerModel(config: GridFooterModel);
    /**
     * Array of column definitions that configure the appearance and behavior of each column in the Datagrid.
     *
     * Each object in this array represents a column {@link ColumnDefinition}.
     * The required ColumnDefinition properties are:
     * - `displayName`: The text for the column header.
     * - `field`: The name of the property in the data source to be shown in the column.
     */
    get columns(): ColumnDefinition<T>[];
    set columns(columns: ColumnDefinition<T>[]);
    /**
     * Defines the grid selection type.
     * Accepts a value from `SelectionType` enum {@link SelectionType}, which specifies the row selection behavior:
     * - `SelectionType.NONE`: No rows are selectable.
     * - `SelectionType.SINGLE_SELECT` (default): Only one row can be selected at a time.
     * - `SelectionType.MULTI_SELECT`: Multiple rows can be selected.
     *
     * Defaults to `SelectionType.SINGLE_SELECT`.
     */
    get selectionType(): SelectionType;
    set selectionType(type: SelectionType | string);
    /**
     * Array of grid items {@link gridItems} which to be selected.
     */
    get selectedItems(): T[];
    set selectedItems(items: T[]);
    /**
     * Enables or disables selection/deselection of rows when a row is clicked.
     * If `SelectionType` is set to `NONE`, row selection is automatically disabled, regardless of this setting.
     * Defaults to `true`.
     */
    get rowSelectionMode(): boolean;
    set rowSelectionMode(value: boolean);
    /**
     * Action definitions for the action bar.
     */
    get actionBarActions(): ActionDefinition[];
    set actionBarActions(actions: ActionDefinition[] | null);
    /**
     * Sets the number of items displayed per page in the datagrid.
     * By default, no page size is set.
     */
    get pageSize(): number;
    set pageSize(value: number);
    set datagridLabels(overriddenStrings: Partial<DatagridStrings>);
    /**
     * Defines whether the content in the cells of the datagrid should be wrapped
     * {@see DatagridContentNoWrapDirective}.
     */
    get wrapText(): boolean;
    set wrapText(value: boolean);
    protected get rowsDisabled(): boolean;
    protected get enableToolBar(): boolean;
    protected get enableExportButton(): boolean;
    protected get selectedItemsCount(): number;
    protected get showDeselectAll(): boolean;
    protected get deselectAllDisabled(): boolean;
    protected get filteredItemsCount(): number;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    resize(): void;
    onModelChange(): void;
    onContextMenu($event: MouseEvent, item: T): void;
    onColumnOrderChange(data: ColumnOrderChanged): void;
    /**
     * Virtual scroll event handler. Called when visible data range has changed
     */
    renderedRangeChange($event: ListRange): void;
    /**
     * Scrolls to a specified index when virtual scrolling is enabled.
     */
    scrollToIndex(index: number, behavior?: ScrollBehavior): void;
    ngOnChanges(changes: SimpleChanges): void;
    trackByGridItemFn: (item: T) => T;
    trackByColumnId(index: number, column: ColumnDefinition<T>): string;
    buildRowDetailContentId(index: number): string;
    onAdvancedFilterCriteriaChange(filterCriteria: PropertyFilter[]): void;
    /**
     * Handles datagrid selected items changes.
     * It is public because is use from directives to emit selection
     * change events (see DatagridPreserveSelection directive).
     */
    onSelectedItemsChange(selected: T[]): void;
    /**
     * Return DataGrid footer label.
     * - Return "datagridLabels.footer" property, if defined.
     * - If there is one item -> 1 item
     * - If there is no paging -> {0} items
     * - Else -> {1} - {2} of {0} items
     */
    getFooterMessage(totalItems: number, pageSize?: number, firstItem?: number, lastItem?: number): string;
    protected getExpandDetailsLabel(item: T): string;
    protected getCollapseDetailsLabel(item: T): string;
    protected onColumnResize(columnSize: number, column: ColumnDefinition<T>): void;
    protected onSortOrderChange(sortOrder: ClrDatagridSortOrder, column: ColumnDefinition<T>): void;
    protected onDeselectAllClick(): void;
    protected onSelectAllInVirtualGrid(isSelect: boolean): void;
    protected onDragStart(row: T): void;
    protected onDragMove(): void;
    protected onFilterChange(filterValue: unknown, column: ColumnDefinition<T>): void;
    protected onColumnHiddenStateChange(value: ColumnHiddenState): void;
    protected refreshGrid(state: ClrDatagridStateInterface): void;
    protected onExportEvent(exportStatus: ExportStatus): void;
    protected onActionClick(action: ActionDefinition, context?: T | T[]): void;
    protected onRowActionOverflowOpen(open: boolean, actions: ActionDefinition[] | null, item: T): void;
    protected onAdvancedSearchTermChange(searchTerm: string): void;
    /**
     * Update "detailState" with the latest value
     * @param state
     */
    protected onDetailStateChange(state: T): void;
    /**
     * Angular ngFor optimization:
     * By allowing client to specify a given function or property key lookup expression
     * the looping and binding over large datasets can now offer performance.
     * The default Angular differ offered is slower since it does a complete object comparison.
     */
    protected trackByFn(index: number, gridItem: T): T;
    protected isItemSelected(item: T): boolean;
    protected dropGroup(group: string): CdkDropList[];
    private hasExpandableRows;
    private preselectDetail;
    private setDraggedItems;
    /**
     * Notifies clarity datagrid about data changes.
     * When <code>trackByFunction</code> or <code>trackByGridItemProperty</code>
     * is provided clarity datagrid is not able to pick up data changes in the
     * <code>rows</<code> collection and selection is messed up. Angular just
     * does not emit <code>QueryList<T>.changes</code> in this case.
     */
    private notifyOnChanges;
    private initActionTypes;
    private initGridSelection;
    private updateSelectedItems;
    private initTotalItemsCount;
    private interpolateMessage;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridComponent<any>, [null, null, null, null, { optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DatagridComponent<any>, "appfx-datagrid", never, { "loading": { "alias": "loading"; "required": false; }; "preSelectFirstItem": { "alias": "preSelectFirstItem"; "required": false; }; "pageSizeOptions": { "alias": "pageSizeOptions"; "required": false; }; "totalItems": { "alias": "totalItems"; "required": false; }; "showCustomPagination": { "alias": "showCustomPagination"; "required": false; }; "serverDrivenDatagrid": { "alias": "serverDrivenDatagrid"; "required": false; }; "listItemsCount": { "alias": "listItemsCount"; "required": false; }; "rowDetailContent": { "alias": "rowDetailContent"; "required": false; }; "rowsExpandedByDefault": { "alias": "rowsExpandedByDefault"; "required": false; }; "trackByFunction": { "alias": "trackByFunction"; "required": false; }; "trackByGridItemProperty": { "alias": "trackByGridItemProperty"; "required": false; }; "detailHeader": { "alias": "detailHeader"; "required": false; }; "detailBody": { "alias": "detailBody"; "required": false; }; "detailState": { "alias": "detailState"; "required": false; }; "isRowLocked": { "alias": "isRowLocked"; "required": false; }; "dragConfig": { "alias": "dragConfig"; "required": false; }; "filterableProperties": { "alias": "filterableProperties"; "required": false; }; "filterMode": { "alias": "filterMode"; "required": false; }; "singleRowActions": { "alias": "singleRowActions"; "required": false; }; "preserveExistingSelectionOnFilter": { "alias": "preserveExistingSelectionOnFilter"; "required": false; }; "virtualScrolling": { "alias": "virtualScrolling"; "required": false; }; "dataRange": { "alias": "dataRange"; "required": false; }; "gridItems": { "alias": "gridItems"; "required": false; }; "layoutModel": { "alias": "layoutModel"; "required": false; }; "footerModel": { "alias": "footerModel"; "required": false; }; "columns": { "alias": "columns"; "required": false; }; "selectionType": { "alias": "selectionType"; "required": false; }; "selectedItems": { "alias": "selectedItems"; "required": false; }; "rowSelectionMode": { "alias": "rowSelectionMode"; "required": false; }; "actionBarActions": { "alias": "actionBarActions"; "required": false; }; "pageSize": { "alias": "pageSize"; "required": false; }; "datagridLabels": { "alias": "datagridLabels"; "required": false; }; }, { "detailStateChange": "detailStateChange"; "pageSizeChange": "pageSizeChange"; "gridItemsChange": "gridItemsChange"; "advancedFilterChange": "advancedFilterChange"; "columnDefsChange": "columnDefsChange"; "selectedItemsChange": "selectedItemsChange"; "exportDataEvent": "exportDataEvent"; "searchTermChange": "searchTermChange"; "columnResize": "columnResize"; "columnSortOrderChange": "columnSortOrderChange"; "columnHiddenStateChange": "columnHiddenStateChange"; "columnFilterChange": "columnFilterChange"; "refreshGridData": "refreshGridData"; "refreshVirtualGridData": "refreshVirtualGridData"; "actionClick": "actionClick"; "rowActionMenuOpenChange": "rowActionMenuOpenChange"; "openContextMenu": "openContextMenu"; "columnOrderChange": "columnOrderChange"; }, never, [".custom-placeholder-content", ".custom-footer-content", "*"], false, never>;
}

/**
 * Datagrid page directive which set the page which to be shown when the appfx datagrid is display.
 * Supports  setting of arbitrary grid page as current page and emits the new page
 * number when the page is change.
 * Supports this functionality for server side and client side grids.
 */
declare class DatagridPageDirective implements AfterViewInit, OnDestroy {
    datagridPageChange: EventEmitter<number>;
    private component;
    private initCompleted;
    private initialPage;
    private subscription;
    constructor(datagrid: DatagridComponent<unknown>);
    set datagridPage(value: number);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridPageDirective, [{ host: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridPageDirective, "[datagridPage]", never, { "datagridPage": { "alias": "datagridPage"; "required": false; }; }, { "datagridPageChange": "datagridPageChange"; }, never, never, false, never>;
}

interface PersistDatagridSettingsService {
    getUserDataSync: (key: string) => any;
    setUserData: (key: string, data: any) => void;
}

declare const appfxDatagridPersistSettingsToken: InjectionToken<PersistDatagridSettingsService>;

/**
 * Sets the grid up with page size, column visibility and width from user-defined storage that is provided
 * Reacts to user changes in the Clarity datagrid to notify the injected storage to persist the grid properties
 * So reloading the application in automatically restore these preferences as a convenience
 */
declare class DatagridPersistSettingsDirective implements OnDestroy, AfterViewInit {
    private grid;
    private persistDatagridSettingsService;
    private subs;
    private datagridKeyChange$;
    private saveColumnsStateTimerId;
    private datagridKey;
    private storePageSize;
    private storeSortOrder;
    constructor(grid: DatagridComponent<unknown>, persistDatagridSettingsService: PersistDatagridSettingsService);
    /**
     * Directive takes unique identifier input to describe the grid
     */
    set appfxPersistDatagridSettings(key: string);
    /**
     * Flag indicates whether to be persisted the grid page size.
     */
    set persistPageSize(value: boolean);
    /**
     * Flag indicates whether to be persisted the grid page size.
     */
    set persistSortOrder(value: boolean);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private saveColumnStates;
    private saveColumnsData;
    private saveColumnSortOrder;
    private savePageSize;
    private createPersistedColumnState;
    /**
     * Preserve data in the persistence storage.
     * @param data the data that is going to be persisted.
     */
    private setPersistedData;
    /**
     * Retrieves the data from the persistence storage.
     * @returns a promise which when resolved will contain the ListView columns data.
     */
    private getPersistedData;
    private getListViewColumnDefKey;
    private initialiseDatagridWithPersistedSettings;
    /**
     * Set initial page size read from the local storage on the datagrid.
     */
    private updateDatagridPageSize;
    /**
     * Set width of datagrid columns, its visible and sort states.
     */
    private updateDatagridColumnDefinitions;
    private applyPersistedColumnSettings;
    /**
     * Set column default sort order read from the local storage on the datagrid
     */
    private applySorting;
    private getColumnUid;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridPersistSettingsDirective, [{ host: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridPersistSettingsDirective, "appfx-datagrid[appfxPersistDatagridSettings]", never, { "appfxPersistDatagridSettings": { "alias": "appfxPersistDatagridSettings"; "required": false; }; "persistPageSize": { "alias": "persistPageSize"; "required": false; }; "persistSortOrder": { "alias": "persistSortOrder"; "required": false; }; }, {}, never, never, false, never>;
}

interface DatagridUserPreferencesService {
    getWrapGridCellTextPreference$: () => Observable<boolean>;
}

declare const appfxDatagridUserPreferencesToken: InjectionToken<DatagridUserPreferencesService>;

declare class DatagridContentNoWrapDirective implements OnDestroy {
    private grid;
    private userPreferencesService;
    private subs;
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
    constructor(grid: DatagridComponent<unknown>, userPreferencesService: DatagridUserPreferencesService);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridContentNoWrapDirective, [{ host: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridContentNoWrapDirective, "appfx-datagrid", never, {}, {}, never, never, false, never>;
}

declare class FieldComparator<T> implements ClrDatagridComparatorInterface<T> {
    field: string;
    constructor(compareField: string);
    compare(a: any, b: any): number;
}
declare class ListComparator<T> implements ClrDatagridComparatorInterface<T> {
    field: string;
    constructor(compareField: string);
    compare(a: any, b: any): number;
}

declare class SimpleNumericComparator<T> implements ClrDatagridComparatorInterface<T> {
    private readonly fieldName;
    constructor(fieldName: string);
    compare(first: T, second: T): number;
}

declare class DatagridFilterComponent implements ClrDatagridFilterInterface<any>, OnInit, AfterViewInit {
    dgStrings: DatagridStrings;
    private popoverService;
    filterValue: any;
    stringFilterType?: ClrDatagridStringFilterInterface<any>;
    fieldName?: string;
    filterValueChange: EventEmitter<any>;
    input: ElementRef;
    value: string;
    changes: Subject<any>;
    constructor(dgStrings: DatagridStrings, popoverService: ClrPopoverService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    onKey(event: any): void;
    isActive(): boolean;
    accepts(item: any): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DatagridFilterComponent, "appfx-datagrid-filter", never, { "filterValue": { "alias": "filterValue"; "required": false; }; "stringFilterType": { "alias": "stringFilterType"; "required": false; }; "fieldName": { "alias": "fieldName"; "required": false; }; }, { "filterValueChange": "filterValueChange"; }, never, never, false, never>;
}

declare class DatagridActionBarDropdownRepositionDirective implements AfterViewInit {
    private elementRef;
    private readonly menuMinTranslateX;
    constructor(elementRef: ElementRef);
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridActionBarDropdownRepositionDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridActionBarDropdownRepositionDirective, "[dropdownMenuReposition]", never, {}, {}, never, never, false, never>;
}

declare class DatagridCellContainerComponent implements OnInit, OnDestroy, OnChanges {
    container: ViewContainerRef;
    column: ColumnDefinition<any>;
    item: any;
    private componentRef;
    private instance;
    ngOnChanges(): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridCellContainerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DatagridCellContainerComponent, "appfx-dg-cell-container", never, { "column": { "alias": "column"; "required": false; }; "item": { "alias": "item"; "required": false; }; }, {}, never, never, false, never>;
}

declare class DatagridColumnToggleComponent implements OnDestroy {
    dgStrings: DatagridStrings;
    layoutClass: string;
    closeColumnButtonElement: ElementRef;
    columns: ColumnDefinition<any>[];
    columnsChange: EventEmitter<ColumnDefinition<any>[]>;
    columnHiddenStateChange: EventEmitter<ColumnHiddenState>;
    positions: ConnectionPositionPair[];
    openState: boolean;
    viewId: string | undefined;
    overlay: CdkConnectedOverlay;
    constructor(dgStrings: DatagridStrings);
    get hasOnlyOneVisibleColumn(): boolean;
    ngOnDestroy(): void;
    onAttach(overlay: CdkConnectedOverlay): void;
    onDetach(): void;
    showColumn(colUid: string): void;
    hideColumn(colUid: string): void;
    toggleColumnState(columnToToggle: ColumnDefinition<any>, event?: Event): void;
    onSelectAll(): void;
    allColumnsSelected(): boolean;
    hideableColumns(): ColumnDefinition<any>[];
    private showHideColumn;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridColumnToggleComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DatagridColumnToggleComponent, "appfx-dg-column-toggle", never, { "columns": { "alias": "columns"; "required": false; }; }, { "columnsChange": "columnsChange"; "columnHiddenStateChange": "columnHiddenStateChange"; }, never, never, false, never>;
}

/**
 * A component that acts as a container for custom column filters.
 * It creates an instance of the specified filter component and manages its lifecycle.
 */
declare class DatagridFilterContainerComponent implements AfterViewInit, OnDestroy {
    private filterContainer;
    container: ViewContainerRef;
    /**
     * The filter component to be created.
     */
    filterType: Type<any>;
    /**
     * The initial value for the filter.
     */
    filterValue: any;
    /**
     * Event emitter to notify the hosting view about changes in the filter value.
     */
    filterValueChange: EventEmitter<any>;
    private componentRef;
    private filter;
    private filterChangeSub;
    constructor(filterContainer: ClrDatagridFilter);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridFilterContainerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DatagridFilterContainerComponent, "appfx-dg-filter-container", never, { "filterType": { "alias": "filterType"; "required": false; }; "filterValue": { "alias": "filterValue"; "required": false; }; }, { "filterValueChange": "filterValueChange"; }, never, never, false, never>;
}

declare class ExportDatagridComponent {
    dgStrings: DatagridStrings;
    /**
     * All grid items count
     */
    allItemsCount: any;
    /**
     * All filtered items count
     */
    filteredItemsCount: any;
    /**
     * Selected items in the datagrid
     */
    selectedItemsCount: any;
    /**
     * Event emitter to tell the hosting view that user has requested to export list data
     */
    exportEventEmitter: EventEmitter<ExportStatus>;
    allRowsCount: string;
    selectedRowsCount: string;
    matchedFilterRowsCount: string;
    exportType: any;
    exportStatus: ExportStatus;
    constructor(dgStrings: DatagridStrings);
    /**
     * Export event is emitted on Export button click and no dropdown options are available
     * All Items are Exported.
     */
    exportAllIfOnlyOption(): void;
    /**
     * Handler function called when one of the export options is clicked
     */
    onExportClick(exportType: ExportType): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExportDatagridComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ExportDatagridComponent, "appfx-dg-export", never, { "allItemsCount": { "alias": "allItemsCount"; "required": false; }; "filteredItemsCount": { "alias": "filteredItemsCount"; "required": false; }; "selectedItemsCount": { "alias": "selectedItemsCount"; "required": false; }; }, { "exportEventEmitter": "exportEventEmitter"; }, never, never, false, never>;
}

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
declare class IsRowSelectablePipe implements PipeTransform {
    transform(rowItem: any, isLocked?: (rowItem: any) => boolean, disabled?: boolean): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<IsRowSelectablePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IsRowSelectablePipe, "isRowSelectable", false>;
}

/**
 * Provides subjects for communication between appfxDgColumnsOrder and appfxColumnOrder
 * directives.
 */
declare class DatagridColumnsOrderService {
    /**
     * Emits the column which should be marked as grabbed. If the column is null all columns are
     * marked as not grabbed
     */
    readonly grabbedColumn: BehaviorSubject<ColumnDefinition<any>>;
    /**
     * Emits when the column should be moved as result of left or right arrow key press.
     */
    readonly moveVisibleColumn: Subject<{
        visibleColumnIndex: number;
        moveLeft: boolean;
    }>;
    /**
     * Event emitter to tell the dragged column to set focus
     */
    readonly focusGrabbedColumn: Subject<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridColumnsOrderService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DatagridColumnsOrderService>;
}

declare class ColumnOrderDirective implements OnDestroy, OnInit {
    private readonly datagrid;
    readonly elementRef: ElementRef<HTMLElement>;
    private readonly columnOrderingService;
    private readonly changeDetectorRef;
    private readonly cdkDrag;
    isGrabbed: boolean;
    columnData: ColumnDefinition<any>;
    columnIndex: number;
    private subs;
    constructor(datagrid: ClrDatagrid, elementRef: ElementRef<HTMLElement>, columnOrderingService: DatagridColumnsOrderService, changeDetectorRef: ChangeDetectorRef, cdkDrag: CdkDrag);
    keydown(event: KeyboardEvent): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    private moveColumn;
    private updateGrabbedState;
    private setActiveCell;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColumnOrderDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ColumnOrderDirective, "clr-dg-column[appfxColumnOrder]", never, { "columnData": { "alias": "columnData"; "required": false; }; "columnIndex": { "alias": "columnIndex"; "required": false; }; }, {}, never, never, false, never>;
}

declare class DatagridColumnsOrderDirective implements OnInit, OnDestroy, OnChanges {
    private readonly elementRef;
    private readonly cdkDropList;
    private readonly columnOrderingService;
    dgColumnsOrderColumns: ColumnDefinition<any>[];
    dgColumnsVirtualScrolling: boolean;
    dgColumnsOrderChange: EventEmitter<ColumnOrderChanged>;
    private subs;
    constructor(elementRef: ElementRef<HTMLElement>, cdkDropList: CdkDropList, columnOrderingService: DatagridColumnsOrderService);
    ngOnInit(): void;
    setDgColumnsContainer(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    private reorderColumn;
    private getColumnIndices;
    private findColumnIndices;
    private createColumnIndices;
    private findColumnIndex;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridColumnsOrderDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridColumnsOrderDirective, "clr-datagrid[appfxDgColumnsOrder]", never, { "dgColumnsOrderColumns": { "alias": "dgColumnsOrderColumns"; "required": false; }; "dgColumnsVirtualScrolling": { "alias": "dgColumnsVirtualScrolling"; "required": false; }; }, { "dgColumnsOrderChange": "dgColumnsOrderChange"; }, never, never, false, never>;
}

declare class DatagridColumnsOrderModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridColumnsOrderModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<DatagridColumnsOrderModule, [typeof ColumnOrderDirective, typeof DatagridColumnsOrderDirective], [typeof i3.ClrDatagridModule, typeof i4.CommonModule, typeof i5.DragDropModule], [typeof ColumnOrderDirective, typeof DatagridColumnsOrderDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<DatagridColumnsOrderModule>;
}

declare class AppfxDatagridModule {
    constructor();
    static forRoot(errorNotifiableService: Type<ErrorNotifiable>): ModuleWithProviders<AppfxDatagridModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AppfxDatagridModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<AppfxDatagridModule, [typeof DatagridComponent, typeof DatagridActionBarComponent, typeof DatagridFilterComponent, typeof DatagridPageDirective, typeof DatagridPersistSettingsDirective, typeof DatagridPreserveSelectionDirective, typeof DatagridContentNoWrapDirective, typeof DatagridActionBarDropdownRepositionDirective, typeof DatagridCellContainerComponent, typeof DatagridColumnToggleComponent, typeof DatagridFilterContainerComponent, typeof ExportDatagridComponent, typeof IsRowSelectablePipe], [typeof i14.AppfxA11yModule, typeof i15.AppfxDatagridFiltersModule, typeof i16.A11yModule, typeof i5.DragDropModule, typeof i18.OverlayModule, typeof i19.ClrCheckboxModule, typeof i3.ClrDatagridModule, typeof i21.ClrDropdownModule, typeof i22.ClrIcon, typeof i19.ClrInputModule, typeof i23.ClrLoadingModule, typeof i4.CommonModule, typeof DatagridColumnsOrderModule, typeof i26.FormsModule], [typeof DatagridComponent, typeof DatagridActionBarComponent, typeof DatagridFilterComponent, typeof DatagridPageDirective, typeof DatagridPersistSettingsDirective, typeof DatagridPreserveSelectionDirective, typeof DatagridContentNoWrapDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<AppfxDatagridModule>;
}

/**
 * Feature states populated on application level during app initialization.
 * This is needed, because datagrid module does not have direct access to feature-state-service.
 */
declare class DatagridFeatureStates {
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridFeatureStates, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DatagridFeatureStates>;
}

declare class CaseInsensitiveContainsStringFilter implements ClrDatagridStringFilterInterface<any> {
    private fieldName;
    constructor(fieldName: string);
    accepts(item: any, search: string): boolean;
}

export { ActionBarLayout, AppfxDatagridModule, CaseInsensitiveContainsStringFilter, CsvHelperService, DatagridActionBarComponent, DatagridComponent, DatagridContentNoWrapDirective, DatagridFeatureStates, DatagridFilterComponent, DatagridPageDirective, DatagridPersistSettingsDirective, DatagridPreserveSelectionDirective, DatagridStrings, ExportProviderService, ExportType, FieldComparator, ListComparator, SimpleNumericComparator, appfxDatagridErrorNotifiableToken, appfxDatagridPersistSettingsToken, appfxDatagridUserPreferencesToken, appfxPreselectableComponentToken };
export type { ActionClickEvent, ActionDefinition, ClientSideExportConfig, ColumnDefinition, ColumnFilter, ColumnFilterChange, ColumnHiddenState, ColumnOrderChanged, ColumnRenderer, ColumnResize, ColumnSortOrder, ContextMenuEvent, DatagridDragConfig, DatagridItemSet, DatagridUserPreferencesService, ErrorNotifiable, ExportColumnDefinition, ExportStatus, ExportValueCallbackParams, GridFooterModel, GridLayoutModel, PreselectableComponent, SingleRowActionOpen };

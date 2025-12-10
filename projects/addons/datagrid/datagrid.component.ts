/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ListRange } from '@angular/cdk/collections';
import { CdkDropList } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import { FilterablePropertyDefinition, FilterMode, PropertyFilter } from '@clr/addons/datagrid-filters';
import { DragAndDropGroupService } from '@clr/addons/drag-and-drop';
import {
  ClrDatagrid,
  ClrDatagridPagination,
  ClrDatagridSortOrder,
  ClrDatagridStateInterface,
  ClrDatagridVirtualScrollRangeInterface,
} from '@clr/angular';
import { Selection } from '@clr/angular/data/datagrid/providers/selection';
import { Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ExportProviderService } from './addons/export/export-provider.service';
import { ClientSideExportConfig, DatagridItemSet, ExportStatus } from './addons/export/export.interface';
import { DatagridStrings } from './i18n/datagrid-strings.service';
import { uniqueIdProvider, uniqueIdToken } from './id-generator/id-generator';
import {
  ColumnFilterChange,
  ColumnHiddenState,
  ColumnOrderChanged,
  ColumnResize,
  ColumnSortOrder,
} from './interfaces/column-state';
import { ContextMenuEvent } from './interfaces/context-menu-event';
import { DatagridDragConfig } from './interfaces/datagrid-drag-config';
import { SelectionType } from './interfaces/selection-type';
import {
  appfxPreselectableComponentToken,
  PreselectableComponent,
} from './preserve-selection/datagrid-preserve-selection.directive';
import { ActionBarLayout, ActionDefinition } from './shared/action/action-definition';
import { ActionClickEvent, SingleRowActionOpen } from './shared/action/actions-event-types';
import { ColumnDefinition } from './shared/column/column-definitions';

const resources = {
  selection: {
    singleDefaultEntity: {},
  },
};

/**
 * The GridLayoutModel interface defines configurable options for customizing
 * the visual appearance and behavior of the datagrid layout.
 */
export interface GridLayoutModel {
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
export interface GridFooterModel {
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
@Component({
  selector: 'appfx-datagrid',
  standalone: false,
  templateUrl: 'datagrid.component.html',
  styleUrls: ['datagrid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ExportProviderService,
    uniqueIdProvider,
    {
      provide: appfxPreselectableComponentToken,
      useExisting: forwardRef(() => DatagridComponent),
    },
  ],
})
export class DatagridComponent<T> implements OnInit, OnDestroy, AfterViewInit, OnChanges, PreselectableComponent {
  searchTerm = '';
  visibleColumns: ColumnDefinition<T>[];
  draggedItems: T[] = [];

  @ViewChild(ClrDatagridPagination) clrDatagridPagination: ClrDatagridPagination;

  /**
   * Shows loading indicator inside the datagrid to prevent user interactions while data is loading.
   * Set to `true` to display loading; set to `false` to hide the loading indicator.
   * Defaults to `false`.
   */
  @Input() loading = false;

  /**
   * When set to `true`, automatically selects the first item in the datagrid upon initialization.
   * Defaults to `false`.
   */
  @Input() preSelectFirstItem = false;

  /**
   * Defines the selectable page size options displayed in the grid footer.
   * Users can choose from these options to control the number of items shown per page.
   */
  @Input() pageSizeOptions: number[];

  /**
   * The totalItems should be provided when the grid is server driven datagrid
   * (serverDrivenDatagrid = true), otherwise the totalItems is calculated
   * internally and shouldn't be set.
   */
  @Input() totalItems = 0;

  /**
   * Shows the projected custom pagination component from the host component.
   * Used for infinite pagination scenarios.
   * Default: false
   */
  @Input() showCustomPagination = false;

  /**
   * Enables or disables server-driven mode for the datagrid.
   * When set to `true`, pagination and filtering should be managed externally.
   * Defaults to `false`.
   */
  @Input() serverDrivenDatagrid = false;

  /**
   * All grid items count when no filter is added.
   * Used for Export functionality when showExport is true.
   * Should be provided only when the grid is server driven datagrid
   * (serverDrivenDatagrid = true), otherwise the listItemsCount is calculated
   * internally and shouldn't be set.
   *
   * @deprecated To be removed with VSUIP-4776
   */
  @Input() listItemsCount = 0;

  /**
   * Template for the content displayed when a row expands. Enables expandable row functionality.
   */
  @Input() rowDetailContent: TemplateRef<unknown>;

  @Input() rowsExpandedByDefault = false;

  /**
   * A function that defines how to be tracked the changes for items in the grid.
   */
  @Input() trackByFunction: TrackByFunction<T>;

  /**
   * property expression which defines the item property which to be
   * used for tracking changes of items in in the grid. May be deep with "a.b.c" notation.
   */
  @Input() trackByGridItemProperty: string;

  /**
   * Reference to the template containing the content for the header
   * displayed on top of the detail content.
   */
  @Input() detailHeader?: TemplateRef<unknown>;

  /**
   * Reference to the template containing the detail content.
   */
  @Input() detailBody?: TemplateRef<unknown>;

  /**
   * The state passed to the detail pane. Contains the gridItem for which
   * detail is shown or null in case detail pane is hidden.
   */
  @Input() detailState: T | null = null;

  /**
   * Used to notify the hosting view that the detailState value has changed
   * ( to enable two way data binding )
   */
  @Output() detailStateChange: EventEmitter<T> = new EventEmitter<T>(true);

  /**
   * A function that determines if a specific row is locked (disabled).
   *
   * This function receives a row item as an argument and returns a boolean indicating
   * whether the row should be locked (`true`) or enabled (`false`).
   */
  @Input() isRowLocked: (rowItem: T) => boolean;

  /**
   * Configuration for enabling drag-and-drop functionality within the datagrid.
   * By default, drag and drop is disabled. To enable it, provide a valid configuration object
   * implementing the @see DatagridDragConfig interface.
   */
  @Input() dragConfig: DatagridDragConfig;

  /**
   * An array of properties used for advanced filtering in FilterMode.Advanced
   */
  @Input() filterableProperties: FilterablePropertyDefinition[] = [];

  /**
   * Specifies the type of global filter to enable.
   * - `FilterMode.Quick`: Enables the quick filter.
   * - `FilterMode.Advanced`: Enables the advanced filter.
   * - `FilterMode.AdvancedOnly`: Enables only the advanced filter.
   *
   * When the filter is enabled, the component will emit the `searchTermChange`/`advancedFilterChange` event whenever the filter changes.
   * If not set, no filter will be displayed.
   */
  @Input() filterMode?: FilterMode;

  /**
   * Action definitions for the single row actions.
   */
  @Input() singleRowActions: ActionDefinition[] | null;

  /**
   * Controls whether the datagrid selection should be preserved on filtering.
   */
  @Input() preserveExistingSelectionOnFilter: boolean;

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
  @Input() virtualScrolling = false;

  /**
   * Input for providing data when virtual scrolling is enabled.
   * <code>gridItems</code> should not be used in this case.
   */
  @Input() dataRange: ClrDatagridVirtualScrollRangeInterface<T> = {
    total: 100,
    skip: 0,
    data: [],
  };

  /**
   * Data source for the Datagrid, represented as an array of row objects.
   *
   * Each object in this array corresponds to a row in the Datagrid, where
   * individual fields map to columns based on each column's `field` property
   * as defined in {@link ColumnDefinition}.
   */
  @Input() gridItems: T[];

  /**
   * Emits the updated page size {@link pageSize} to the parent component when changed.
   */
  @Output() pageSizeChange = new EventEmitter<number>();

  /**
   * Emits the updated gridItems to the parent component when changed.
   */
  @Output() gridItemsChange: EventEmitter<T[]> = new EventEmitter<T[]>();

  /**
   * Emits when advanced filter criteria changes.
   */
  @Output() advancedFilterChange: EventEmitter<PropertyFilter[]> = new EventEmitter<PropertyFilter[]>();

  /**
   * Emits the updated column definitions {@link columns} to the parent component when changed.
   */
  @Output() columnDefsChange: EventEmitter<ColumnDefinition<T>[]> = new EventEmitter<ColumnDefinition<T>[]>();

  /**
   * Emits the updated selected items {@link selectedItems} when changed.
   */
  @Output() selectedItemsChange: EventEmitter<T[]> = new EventEmitter<T[]>();

  /**
   * Event emitter to tell the hosting view that user has requested to export list data
   */
  @Output() exportDataEvent: EventEmitter<ExportStatus> = new EventEmitter<ExportStatus>();

  /**
   * Event emitter to tell hosting view that search term, used for filtering has changed.
   */
  @Output() searchTermChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Event emitter to tell hosting view that size of column has changed.
   */
  @Output() columnResize: EventEmitter<ColumnResize> = new EventEmitter<ColumnResize>();

  /**
   * Event emitter to tell hosting view that sort order of column has changed.
   */
  @Output() columnSortOrderChange: EventEmitter<ColumnSortOrder> = new EventEmitter<ColumnSortOrder>();

  /**
   * Event emitter to tell hosting view that hidden state of column has changed.
   */
  @Output() columnHiddenStateChange: EventEmitter<ColumnHiddenState> = new EventEmitter<ColumnHiddenState>();

  /**
   * Event emitter to tell hosting view that column filtering has changed.
   */
  @Output() columnFilterChange: EventEmitter<ColumnFilterChange> = new EventEmitter<ColumnFilterChange>();

  /**
   * Event emitter emitted when the data needs to be refreshed,
   * based on user action or external ones.
   */
  @Output() refreshGridData: EventEmitter<ClrDatagridStateInterface> = new EventEmitter<ClrDatagridStateInterface>();

  /**
   * Event emitter emits when data in the grid with virtual scrolling needs to be refreshed.
   */
  @Output() refreshVirtualGridData: EventEmitter<ClrDatagridStateInterface> =
    new EventEmitter<ClrDatagridStateInterface>();

  /**
   * Event emitter triggered when a single-row action or actionbar action is clicked.
   * The emitted event contains information about the action that was clicked. {@link ActionClickEvent}
   */
  @Output() actionClick = new EventEmitter<ActionClickEvent>();

  /**
   * Event emitter triggered when the single-row action menu is opened.
   * The emitted event contains information about the open state and the actions associated with the menu. {@link SingleRowActionOpen}
   */
  @Output() rowActionMenuOpenChange = new EventEmitter<SingleRowActionOpen>();

  /**
   * Event emitter triggered when a right-click event is performed on a grid row.
   */
  @Output() openContextMenu: EventEmitter<ContextMenuEvent> = new EventEmitter<ContextMenuEvent>();

  /**
   * Event emitter to tell hosting view that column order has changed.
   */
  @Output() columnOrderChange: EventEmitter<ColumnOrderChanged> = new EventEmitter<ColumnOrderChanged>();

  @HostBinding('class.embedded-flex-component') protected applyFlexLayout = true;
  @HostBinding('class') protected zoomLevel: ZoomLevel = ZoomLevel.none;

  protected gridLayoutModel: GridLayoutModel = {
    compact: true,
    disabled: false,
    stretchToParentHeight: true,
  };
  protected gridFooterModel: GridFooterModel = {
    showFooter: true,
    hideColumnToggle: false,
    enableCustomExport: false,
  };
  protected readonly defaultUnsetValue: string = undefined as unknown as string;
  protected readonly defaultUnsortedOrder: ClrDatagridSortOrder = ClrDatagridSortOrder.UNSORTED;
  protected readonly dgStrings: DatagridStrings;
  protected enableSingleRowActions = false;

  @ViewChild(ClrDatagrid, { static: true }) private clrDatagrid: ClrDatagrid;

  readonly #defaultActionButtonClass: string = ActionBarLayout.flatCompact;
  readonly #interpolationExpression: RegExp = /\{(\d+)\}/g;
  readonly #unsubscribeSubject: Subject<void> = new Subject<void>();
  readonly #zoomLevelSubscription: Subscription = new Subscription();

  /**
   * Array of objects defining the properties of each column in the Datagrid.
   *
   * @type ColumnDefinition
   */
  #dgColumns: ColumnDefinition<T>[];
  #selectionType: SelectionType = SelectionType.Single;
  #selectedItems: T[] = [];
  #rowSelectionMode = true;
  #actionBarActions: ActionDefinition[] = [];
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
  #areRowsDisabled = false;
  #pageSize = 0;
  /**
   * Whether there are applied advanced filters
   */
  #hasAdvancedFilters = false;
  #wrapCellText = true;
  #gridSelectionChangedSub: Subscription;

  constructor(
    datagridStrings: DatagridStrings,
    @Inject(uniqueIdToken) private readonly uid: string,
    private cdr: ChangeDetectorRef,
    private readonly exportProviderService: ExportProviderService,
    @Optional() private readonly groupService: DragAndDropGroupService,
    @Optional() private readonly zoomLevelService: ZoomLevelService
  ) {
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
  @Input()
  get layoutModel(): GridLayoutModel {
    return { ...this.gridLayoutModel };
  }

  set layoutModel(config: GridLayoutModel) {
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
  @Input()
  get footerModel(): GridFooterModel {
    return { ...this.gridFooterModel };
  }

  set footerModel(config: GridFooterModel) {
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
  @Input()
  get columns(): ColumnDefinition<T>[] {
    return this.#dgColumns;
  }

  set columns(columns: ColumnDefinition<T>[]) {
    this.#dgColumns = columns;
    if (columns) {
      this.visibleColumns = columns.filter((column: ColumnDefinition<T>) => !column.hidden);
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
  @Input()
  get selectionType(): SelectionType {
    return this.#selectionType;
  }

  set selectionType(type: SelectionType) {
    // guard against malformed component bindings to unset variables
    if (type !== undefined) {
      this.#selectionType = type;

      // likely that the embedded Clarity grid doesn't yet exist, will manually set the `selectionType` later
      if (this.clrDatagrid && this.#gridSelectionChangedSub) {
        this.#gridSelectionChangedSub.unsubscribe();
        this.initGridSelection(type);
      }
    }
  }
  /**
   * Array of grid items {@link gridItems} which to be selected.
   */
  @Input()
  get selectedItems(): T[] {
    return this.#selectedItems;
  }

  set selectedItems(items: T[]) {
    this.#selectedItems = Array.isArray(items) ? items.filter((item: T) => item !== undefined) : [];

    if (this.clrDatagrid && items) {
      this.selectGridItems(this.#selectedItems, false);
    }
  }

  /**
   * Enables or disables selection/deselection of rows when a row is clicked.
   * If `SelectionType` is set to `NONE`, row selection is automatically disabled, regardless of this setting.
   * Defaults to `true`.
   */
  @Input()
  get rowSelectionMode(): boolean {
    // Clarity 15 allows row selection even though the selection mode is none.
    // Ensure that row selection mode is false when selection mode is none.
    return this.#selectionType === SelectionType.None ? false : this.#rowSelectionMode;
  }

  set rowSelectionMode(value: boolean) {
    this.#rowSelectionMode = value;
  }

  /**
   * Action definitions for the action bar.
   */
  @Input()
  get actionBarActions(): ActionDefinition[] {
    return this.#actionBarActions;
  }

  set actionBarActions(actions: ActionDefinition[] | null) {
    if (actions) {
      actions.forEach((action: ActionDefinition) => {
        action.class = action.class || this.#defaultActionButtonClass;
      });
      this.#actionBarActions = actions;
    }
  }

  /**
   * Sets the number of items displayed per page in the datagrid.
   * By default, no page size is set.
   */
  @Input()
  get pageSize(): number {
    return this.#pageSize;
  }

  set pageSize(value: number) {
    this.#pageSize = value;
    if (value > 0) {
      this.pageSizeChange.emit(this.#pageSize);
    }
  }

  @Input()
  set datagridLabels(overriddenStrings: Partial<DatagridStrings>) {
    if (overriddenStrings) {
      for (const key of Object.keys(overriddenStrings) as Array<keyof DatagridStrings>) {
        this.dgStrings[key] = overriddenStrings[key] || '';
      }
    }
  }

  /**
   * Defines whether the content in the cells of the datagrid should be wrapped
   * {@see DatagridContentNoWrapDirective}.
   */
  get wrapText(): boolean {
    return this.#wrapCellText;
  }

  set wrapText(value: boolean) {
    if (value !== this.#wrapCellText) {
      this.#wrapCellText = value;
      this.cdr.markForCheck();
    }
  }

  protected get rowsDisabled(): boolean {
    return this.#areRowsDisabled;
  }

  protected get enableToolBar(): boolean {
    return !!this.actionBarActions?.length || (this.filterMode !== null && this.filterMode !== undefined);
  }

  protected get enableExportButton(): boolean {
    return !!this.gridFooterModel.enableCustomExport || !!this.gridFooterModel.clientSideExportConfig;
  }

  protected get selectedItemsCount() {
    return this.#selectedItems ? this.#selectedItems.length : 0;
  }

  protected get showDeselectAll(): boolean {
    return this.#selectionType === SelectionType.Multi;
  }

  protected get deselectAllDisabled(): boolean {
    return this.selectedItemsCount === 0;
  }

  protected get filteredItemsCount(): number {
    let filteredItemsCount = 0;
    if (this.searchTerm?.length > 0 || this.#hasAdvancedFilters) {
      filteredItemsCount = this.totalItems;
    }
    return filteredItemsCount;
  }

  ngOnInit(): void {
    this.initGridSelection();
    this.initTotalItemsCount();
    if (this.zoomLevelService) {
      this.zoomLevelService.onChange.subscribe((v: ZoomLevel) => (this.zoomLevel = v));
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

  resize(): void {
    this.clrDatagrid.resize();
  }

  onModelChange(): void {
    this.cdr.markForCheck();
  }

  onContextMenu($event: MouseEvent, item: T): void {
    if (
      this.#selectionType !== SelectionType.None &&
      !this.isItemSelected(item) &&
      (!this.isRowLocked || !this.isRowLocked(item))
    ) {
      this.#selectedItems = [];
      this.updateSelectedItems(item);
    }
    const targets: T[] = this.#selectionType === SelectionType.Multi ? this.#selectedItems : [item];
    $event.preventDefault();
    this.openContextMenu.emit({ event: $event, context: targets });
  }

  onColumnOrderChange(data: ColumnOrderChanged) {
    this.columns = data.columns;
    this.visibleColumns = this.columns.filter((column: ColumnDefinition<T>) => !column.hidden);
    this.cdr.detectChanges();
    //Without resize when the grid is empty and column is moved
    //the columns are not displayed correctly
    this.resize();
    this.columnOrderChange.emit(data);
  }

  /**
   * Virtual scroll event handler. Called when visible data range has changed
   */
  renderedRangeChange($event: ListRange) {
    const currentPageState: ClrDatagridStateInterface = {
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
  scrollToIndex(index: number, behavior?: ScrollBehavior): void {
    if (this.virtualScrolling) {
      this.clrDatagrid.virtualScroll.scrollToIndex(index, behavior);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gridItems'] && changes['gridItems'].currentValue) {
      this.gridItemsChange.emit(this.gridItems);
      this.preselectDetail();

      if (!this.serverDrivenDatagrid) {
        this.totalItems = this.gridItems.length;
        this.listItemsCount = this.gridItems.length;
      } else if (!changes['gridItems'].isFirstChange() && this.selectionType === SelectionType.Multi) {
        this.notifyOnChanges();
      }
    }
    // inform Clarity datagrid component for building headers
    if (
      changes['columns'] &&
      Array.isArray(changes['columns'].currentValue) &&
      changes['columns'].currentValue.length
    ) {
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

  trackByGridItemFn = (item: T) => this.trackByFn(0, <T>(item || {}));

  trackByColumnId(index: number, column: ColumnDefinition<T>): string {
    return column.uid || column.displayName;
  }

  buildRowDetailContentId(index: number): string {
    return `datagrid-${this.uid}-row-detail-${index}`;
  }

  onAdvancedFilterCriteriaChange(filterCriteria: PropertyFilter[]): void {
    // We need to know if there are filters, because of filteredItemsCount
    this.#hasAdvancedFilters = filterCriteria ? filterCriteria.length > 0 : false;
    this.advancedFilterChange.emit(filterCriteria);
  }

  /**
   * Handles datagrid selected items changes.
   * It is public because is use from directives to emit selection
   * change events (see DatagridPreserveSelection directive).
   */
  onSelectedItemsChange(selected: T[]): void {
    this.#selectedItems = selected;
    this.selectedItemsChange.emit(selected);
  }

  setSelectedItems(items: T[]) {
    this.selectGridItems(items, false);
    this.selectedItemsChange.emit(items);
  }

  /**
   * Return DataGrid footer label.
   * - Return "datagridLabels.footer" property, if defined.
   * - If there is one item -> 1 item
   * - If there is no paging -> {0} items
   * - Else -> {1} - {2} of {0} items
   */
  getFooterMessage(totalItems: number, pageSize?: number, firstItem?: number, lastItem?: number): string {
    let footer: string | undefined = this.dgStrings.footer;
    if (footer) {
      // Footer is overridden.
      return this.interpolateMessage(footer, [totalItems, firstItem, lastItem]);
    }

    // Flag indicating when to show current range of loaded items (e.g. {1} - {2} of {0} items)
    const showRange =
      (pageSize !== undefined && pageSize > 0 && totalItems > pageSize) ||
      (lastItem !== undefined &&
        firstItem !== undefined &&
        this.virtualScrolling &&
        totalItems > 0 &&
        totalItems > lastItem - firstItem + 1);

    if (totalItems === 1) {
      footer = this.dgStrings.singleItem;
    } else if (showRange) {
      footer = this.interpolateMessage(this.dgStrings.pagedItems, [totalItems, firstItem, lastItem]);
    } else {
      footer = this.interpolateMessage(this.dgStrings.multipleItems, [totalItems]);
    }
    return footer;
  }

  protected getExpandDetailsLabel(item: T): string {
    if (!this.hasExpandableRows(item)) {
      return '';
    }
    const itemName: string = (item as any)[this.visibleColumns?.[0]?.field || ''] || '';
    return this.interpolateMessage(this.dgStrings.expandDetailsPaneLabel, [itemName]);
  }

  protected getCollapseDetailsLabel(item: T): string {
    if (!this.hasExpandableRows(item)) {
      return '';
    }
    const itemName: string = (item as any)[this.visibleColumns?.[0]?.field || ''] || '';
    return this.interpolateMessage(this.dgStrings.collapseDetailsPaneLabel, [itemName]);
  }

  protected onColumnResize(columnSize: number, column: ColumnDefinition<T>): void {
    this.columnResize.emit({ columnSize: columnSize, column: column });
  }

  protected onSortOrderChange(sortOrder: ClrDatagridSortOrder, column: ColumnDefinition<T>): void {
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

  protected onDeselectAllClick(): void {
    this.#selectedItems = [];
    this.selectGridItems(this.#selectedItems, false);
    this.selectedItemsChange.emit(this.#selectedItems);
  }

  protected onSelectAllInVirtualGrid(isSelect: boolean) {
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
      this.setSelectedItems(this.#selectedItems);
    } else {
      // Deselect all
      this.onDeselectAllClick();
    }
  }

  protected onDragStart(row: T): void {
    this.setDraggedItems(row);
  }

  protected onDragMove(): void {
    // note mibryamov: since the default strategy for change detection is
    // OnPush, if we don't mark the view changed on every drag move, when
    // you stop the dragging without triggering OnDrop on the target area,
    // the dragging ghost element is not positioned as expected when
    // disappearing, it goes to the top-left corner of the page instead of
    // going to the drop handle icon from where the drag is triggered. To
    // prevent this we should mark the view changed on every move.
    this.cdr.markForCheck();
  }

  protected onFilterChange(filterValue: unknown, column: ColumnDefinition<T>): void {
    this.columnFilterChange.emit({
      filterValue: filterValue,
      column: column,
    });
  }

  protected onColumnHiddenStateChange(value: ColumnHiddenState): void {
    this.columnHiddenStateChange.emit(value);
    if (this.gridItems && this.gridItems.length === 0 && value.hidden === false) {
      // Force change detection otherwise column is not shown when grid is empty
      this.cdr.detectChanges();
      this.resize();
    }
  }

  protected refreshGrid(state: ClrDatagridStateInterface): void {
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

  protected onExportEvent(exportStatus: ExportStatus): void {
    if (this.footerModel.enableCustomExport || this.footerModel.clientSideExportConfig?.customExport) {
      // If custom export is enabled, emit the export event and return.
      this.exportDataEvent.emit(exportStatus);
      return;
    }
    if (this.footerModel.clientSideExportConfig) {
      // If client-side export configuration is available, process with the export.
      const datagridItemSet: DatagridItemSet = {
        totalDatagridItems: this.gridItems,
        selectedItems: this.selectedItems,
        filteredDatagridItems: [],
      };
      this.exportProviderService.exportUIOnlyData(
        this.footerModel.clientSideExportConfig,
        exportStatus,
        datagridItemSet
      );
    }
  }

  protected onActionClick(action: ActionDefinition, context?: T | T[]): void {
    // We have context when is clicked row action
    // when the action bar action is clicked the context is the selected items
    if (!context) {
      context = this.#selectedItems;
    }
    this.actionClick.emit({ action: action, context: context });
  }

  protected onRowActionOverflowOpen(open: boolean, actions: ActionDefinition[] | null, item: T): void {
    this.rowActionMenuOpenChange.emit({
      open: open,
      actions: actions,
      context: item,
    });
  }

  protected onAdvancedSearchTermChange(searchTerm: string): void {
    // We need the search term, because of filteredItemsCount
    this.searchTerm = searchTerm;
    this.searchTermChange.emit(searchTerm);
  }

  /**
   * Update "detailState" with the latest value
   * @param state
   */
  protected onDetailStateChange(state: T): void {
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
  protected trackByFn(index: number, gridItem: T): T {
    const trackByGridItemPropertySeparator = '.'; // rethink constant when properties have "."
    if (this.trackByGridItemProperty) {
      let parseValid = false;
      const observedPropertyValue = this.trackByGridItemProperty
        .split(trackByGridItemPropertySeparator)

        .reduce(
          (o, i) => (parseValid = Object.prototype.hasOwnProperty.call(o as object, i)) && (o as any)[i],
          gridItem
        );

      if (parseValid) {
        return observedPropertyValue;
      }
    }

    if (this.trackByFunction) {
      return this.trackByFunction(index, gridItem);
    }

    return gridItem;
  }

  protected isItemSelected(item: T): boolean {
    for (const selectedItem of this.#selectedItems) {
      if (selectedItem === item) {
        return true;
      }
    }
    return false;
  }
  protected dropGroup(group: string): CdkDropList[] {
    return (this.groupService?.getGroupItems(group) || []) as CdkDropList[];
  }

  private hasExpandableRows(item: T): boolean {
    return !!this.detailHeader || !!this.detailBody || !!(item as any)?.rowDetailRenderer || !!this.rowDetailContent;
  }

  private preselectDetail(): void {
    const isDetailEnabled: boolean = !!this.detailHeader || !!this.detailBody;
    if (isDetailEnabled && this.detailState && this.trackByGridItemProperty) {
      const gridItems: T[] = this.gridItems || [];

      const matchingItems: T[] = gridItems.filter((item: T): boolean => {
        return (
          (item as any)[this.trackByGridItemProperty] === (this.detailState as any)?.[this.trackByGridItemProperty]
        );
      });
      if (matchingItems.length === 0) {
        // Hide detail pane when item is no longer present in the dataset
        this.detailState = null;
      } else {
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

  private setDraggedItems(row: T): void {
    this.draggedItems = [];
    if (this.isItemSelected(row)) {
      this.draggedItems.push(...this.#selectedItems);
    } else {
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
  private notifyOnChanges() {
    // Disable check for this.trackByFunction since the compiler thinks it's always assigned but that's not the case.
    // In the PreselectComponent interface, trackByFunction is required but in the datagrid it's optional.

    // @ts-ignore
    if (this.trackByGridItemProperty || this.trackByFunction) {
      setTimeout(() => {
        this.clrDatagrid?.rows?.notifyOnChanges();
      }, 0);
    }
  }

  private preserveSelectionWhenThereIsFilterDefine() {
    const selection: Selection = this.clrDatagrid.selection;
    const filterSub: Subscription = (selection as any)['_filtersSub'];
    if (filterSub) {
      filterSub.unsubscribe();
    }
  }

  private initActionTypes(): void {
    if (this.singleRowActions) {
      this.enableSingleRowActions = true;
      this.cdr.markForCheck();
    }
  }

  private initGridSelection(changedGridSelectionType?: SelectionType): void {
    if (this.clrDatagrid) {
      this.clrDatagrid.identityFn = this.trackByGridItemFn;
    }

    type ClrSelectionType = typeof this.clrDatagrid.selection.selectionType;
    // Change detection is sensitive to `ClrDatagrid`. The view will update with `this.selectGridItems(this._selectedItems, true);`

    // 1. `selectionType` setter assigned selection via input binding
    if (changedGridSelectionType) {
      this.clrDatagrid.selection.selectionType = changedGridSelectionType as unknown as ClrSelectionType;
    }
    // 2. Alternate case supported when initially changing the default `selectionType` and when the nested datagrid component is ready
    // was pre-initialized with an empty array set
    else if (
      !this.clrDatagrid.selection.selectionType &&
      Array.isArray(this.gridItems) &&
      this.gridItems.length === 0
    ) {
      this.clrDatagrid.selection.selectionType = this.#selectionType as unknown as ClrSelectionType; // cast to Clarity enum
    }

    if (this.preSelectFirstItem && this.gridItems && this.gridItems.length > 0) {
      // TODO: Find better solution, This will not work if we
      // have some default sorting
      this.#selectedItems = [this.gridItems[0]];
    }

    if (this.#selectionType === SelectionType.Multi) {
      // Remove the hack below when Clarity grid manages to preserve selection
      // when filter is define.
      // See issue: https://github.com/vmware/clarity/issues/484
      // Currently the single selection works without this hack
      this.preserveSelectionWhenThereIsFilterDefine();
    }

    if (this.#selectionType !== SelectionType.None) {
      this.clrDatagrid.selection.selectionType = this.#selectionType as unknown as ClrSelectionType; // cast to Clarity enum

      this.selectGridItems(this.#selectedItems, true);
      this.subscribeToSelectionChange();
    } else {
      // Set selection of the grid to none.
      // Hacky but if once the selection type is set to single or multi there is no
      // other way the grid selection to be set to NONE
      // Remove this when the https://github.com/vmware/clarity/issues/1720
      // is fixed.
      this.clrDatagrid.selected = null as unknown as undefined;
    }
  }

  private subscribeToSelectionChange(): void {
    //Skip first selected item as it is the one used during initial initialization
    if (this.#selectionType === SelectionType.Single && this.clrDatagrid.singleSelectedChanged) {
      this.#gridSelectionChangedSub = this.clrDatagrid.singleSelectedChanged
        .pipe(takeUntil(this.#unsubscribeSubject))
        // if no item is selected, an empty object is returned
        .subscribe((selected: T) =>
          this.onSelectedItemsChange(this.isNotObjectOrEmptyObject(selected) ? [] : [selected])
        );
    } else if (this.#selectionType === SelectionType.Multi && this.clrDatagrid.selectedChanged) {
      this.#gridSelectionChangedSub = this.clrDatagrid.selectedChanged
        .pipe(takeUntil(this.#unsubscribeSubject))
        .subscribe((selected: T[]) => this.onSelectedItemsChange(selected));
    }
  }

  private isNotObjectOrEmptyObject(obj: unknown): boolean {
    return !obj || (Object.keys(obj).length === 0 && obj.constructor === Object);
  }

  private selectGridItems(items: T[], isGridSelectionTypeChanged: boolean) {
    if (this.#selectionType === SelectionType.Single) {
      if (items.length > 1) {
        items = items.slice(0, 1);
      }
      //We need to init single selection mode so when selected item is not
      //provided we set empty object
      this.clrDatagrid.singleSelected = items.length === 0 ? resources.selection.singleDefaultEntity : items[0];
    } else if (this.#selectionType === SelectionType.Multi) {
      this.clrDatagrid.singleSelected = undefined;
      // special flow with conditionals that correctly deal with the nested Clarity datagrid
      // and only change the Clarity datagrid's current selection when it is safe from the `ExpressionChangedAfterIsHasBeenCheckedError`
      // and would not result in extra property assignments outside of the normal change detection cycles

      if (!Array.isArray(this.clrDatagrid.selection.current) && isGridSelectionTypeChanged) {
        // do not desire to influence the selectionType in this cycle as it will affect the DOM and have side effects
        // assign Clarity current selection and do own CD to be safe
        this.clrDatagrid.selection.current = items;
        this.cdr.detectChanges();
        return;
      }

      // two acceptable checks before directly assigning the items to the Clarity datagrid
      // 1. when current selection array is undefined and a assignment would result in a non-empty list
      // 2. the current selection has already been set with with a list
      if (
        (!Array.isArray(this.clrDatagrid.selection.current) && items.length) ||
        Array.isArray(this.clrDatagrid.selection.current)
      ) {
        this.clrDatagrid.selected = items;
        this.cdr.detectChanges();
      }
    }
  }

  private updateSelectedItems(item: T) {
    if (this.#selectionType === SelectionType.Single) {
      this.#selectedItems = [item];
    } else {
      this.#selectedItems.push(item);
    }

    this.selectGridItems(this.#selectedItems, false);
    this.selectedItemsChange.emit(this.#selectedItems);
  }

  private initTotalItemsCount() {
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
      .pipe(
        filter(() => this.pageSize <= 0),
        takeUntil(this.#unsubscribeSubject)
      )
      .subscribe((value: T[]) => {
        this.totalItems = value.length;
      });
  }

  private interpolateMessage(message: string, parameters: unknown[]): string {
    return message.replace(this.#interpolationExpression, (match: string, index: number) => {
      if (index >= parameters.length) {
        // There are less parameters than there are placeholders,
        // return the placeholder value.
        return match;
      }
      return String(parameters[index]);
    });
  }
}

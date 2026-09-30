/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  DOCUMENT,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  RendererStyleFlags2,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import {
  CLR_CONTEXT_DEFAULT_MAX_ITEMS,
  CLR_CONTEXT_WITHHELD_SELECTOR,
  ClrCommonStringsService,
  ClrContextSnapshotOptions,
  clrContextText,
  ClrElementMutation,
  clrNormalizeContextText,
  clrPublishElementContext,
  clrPublishElementMutator,
  clrUsableSelectors,
  uniqueIdFactory,
} from '@clr/angular/utils';
import { combineLatest, fromEvent, merge, of, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

import { ClrDatagridColumn } from './datagrid-column';
import { ClrDatagridItems } from './datagrid-items';
import { ClrDatagridPlaceholder } from './datagrid-placeholder';
import { ClrDatagridRow } from './datagrid-row';
import { ClrDatagridVirtualScrollDirective } from './datagrid-virtual-scroll.directive';
import { DatagridDisplayMode } from './enums/display-mode.enum';
import { SelectionType, selectionTypeAttribute } from './enums/selection-type';
import { ClrDatagridStateInterface } from './interfaces/state.interface';
import { ColumnsService } from './providers/columns.service';
import { DetailService, MAX_DETAIL_WIDTH } from './providers/detail.service';
import { DisplayModeService } from './providers/display-mode.service';
import { FiltersProvider } from './providers/filters';
import { ExpandableRowsCount } from './providers/global-expandable-rows';
import { ClrDatagridItemsIdentityFunction, Items } from './providers/items';
import { Page } from './providers/page';
import { RowActionService } from './providers/row-action-service';
import { Selection } from './providers/selection';
import { Sort } from './providers/sort';
import { StateDebouncer } from './providers/state-debouncer.provider';
import { StateProvider } from './providers/state.provider';
import { TableSizeService } from './providers/table-size.service';
import { HIDDEN_COLUMN_CLASS } from './render/constants';
import { DatagridRenderOrganizer } from './render/render-organizer';
import { CellCoordinates, KeyNavigationGridController } from './utils/key-navigation-grid.controller';

@Component({
  selector: 'clr-datagrid',
  templateUrl: './datagrid.html',
  providers: [
    Selection,
    Sort,
    FiltersProvider,
    Page,
    Items,
    DatagridRenderOrganizer,
    RowActionService,
    ExpandableRowsCount,
    StateDebouncer,
    DetailService,
    StateProvider,
    TableSizeService,
    ColumnsService,
    DisplayModeService,
    KeyNavigationGridController,
  ],
  host: {
    '[class.datagrid-host]': 'true',
    '[class.datagrid-detail-open]': 'detailService.isOpen',
    '[class.datagrid-detail-overlay]': 'isDetailOverlay',
    '[class.datagrid-virtual-scroll]': '!!virtualScroll',
  },
  standalone: false,
})
export class ClrDatagrid<T = any> implements AfterContentInit, AfterViewInit, OnDestroy, DoCheck {
  @Input('clrLoadingMoreItems') loadingMoreItems: boolean;

  @Input() clrDgSingleSelectionAriaLabel: string = this.commonStrings.keys.singleSelectionAriaLabel;
  @Input() clrDgSingleActionableAriaLabel: string = this.commonStrings.keys.singleActionableAriaLabel;
  @Input() clrDetailExpandableAriaLabel: string = this.commonStrings.keys.detailExpandableAriaLabel;

  // Allows disabling of the auto focus on page/state changes (excludes focus management inside of popups)
  @Input() clrDgDisablePageFocus = false;

  @Output('clrDgSelectedChange') selectedChanged = new EventEmitter<T[]>(false);

  /**
   * Output emitted whenever the data needs to be refreshed, based on user action or external ones
   */
  @Output('clrDgRefresh') refresh = new EventEmitter<ClrDatagridStateInterface<T>>(false);

  /**
   * The application can provide custom select all logic.
   */
  @Input('clrDgCustomSelectAllEnabled') customSelectAllEnabled = false;
  @Input('clrDgSelectAllDisabled') selectAllDisabled = false;
  @Output('clrDgCustomSelectAll') customSelectAll = new EventEmitter<boolean>();

  /**
   * Expose virtual scroll directive for applications to access its public methods
   */
  @ContentChildren(forwardRef(() => ClrDatagridVirtualScrollDirective)) _virtualScroll: QueryList<
    ClrDatagridVirtualScrollDirective<any>
  >;
  /**
   * We grab the smart iterator from projected content
   */
  @ContentChild(ClrDatagridItems) iterator: ClrDatagridItems<T>;

  /**
   * Custom placeholder detection
   */
  @ContentChild(ClrDatagridPlaceholder) placeholder: ClrDatagridPlaceholder<T>;

  /**
   * Hideable Column data source / detection.
   */
  @ContentChildren(ClrDatagridColumn) columns: QueryList<ClrDatagridColumn<T>>;

  /**
   * When the datagrid is user-managed without the smart iterator, we get the items displayed
   * by querying the projected content. This is needed to keep track of the models currently
   * displayed, typically for selection.
   */
  @ContentChildren(ClrDatagridRow, { emitDistinctChangesOnly: false }) rows: QueryList<ClrDatagridRow<T>>;

  @ViewChild('datagrid', { read: ElementRef }) datagrid: ElementRef<HTMLElement>;
  @ViewChild('datagridTable', { read: ElementRef }) datagridTable: ElementRef<HTMLElement>;
  @ViewChild('datagridHeader', { read: ElementRef }) datagridHeader: ElementRef<HTMLElement>;
  @ViewChild('contentWrapper', { read: ElementRef, static: true }) contentWrapper: ElementRef<HTMLElement>;
  @ViewChild('rowsWrapper', { read: ElementRef, static: true }) rowsWrapper: ElementRef<HTMLElement>;
  @ViewChild('scrollableColumns', { read: ViewContainerRef }) scrollableColumns: ViewContainerRef;
  @ViewChild('projectedDisplayColumns', { read: ViewContainerRef }) _projectedDisplayColumns: ViewContainerRef;
  @ViewChild('projectedStickyColumns', { read: ViewContainerRef }) _projectedStickyColumns: ViewContainerRef;
  @ViewChild('projectedCalculationColumns', { read: ViewContainerRef }) _projectedCalculationColumns: ViewContainerRef;
  @ViewChild('displayedRows', { read: ViewContainerRef }) _displayedRows: ViewContainerRef;
  @ViewChild('calculationRows', { read: ViewContainerRef }) _calculationRows: ViewContainerRef;
  @ViewChild('fixedColumnTemplate') _fixedColumnTemplate: TemplateRef<any>;
  @ViewChildren('stickyHeader', { emitDistinctChangesOnly: true }) stickyHeaders: QueryList<ElementRef>;

  selectAllId: string;
  activeCellCoords: CellCoordinates;

  /* reference to the enum so that template can access */
  SELECTION_TYPE = SelectionType;

  private teardownElementContext?: () => void;
  private teardownElementMutator?: () => void;
  /** Each row's cells while a read or write is under way; see `withRowCells`. */
  private rowCellsCache: Map<ClrDatagridRow<T>, { excluded: string; cells: string[] }> | null = null;
  private contentInitialized = false;

  @ViewChild('selectAllCheckbox') private selectAllCheckbox: ElementRef<HTMLInputElement>;
  @ViewChild('rowControls', { read: ElementRef }) private rowControls: ElementRef<HTMLElement>;

  /**
   * Subscriptions to all the services and queries changes
   */
  private _subscriptions: Subscription[] = [];
  private _virtualScrollSubscriptions: Subscription[] = [];

  /**
   * The placeholder columns we create from `fixedColumnTemplate` for the calculate pass. Unlike
   * the column views, which belong to their `WrappedColumn`, these are created here on every
   * pass, so they are ours to destroy. Detaching them from the container only unlinks them - the
   * views themselves would stay alive and keep the whole datagrid in memory.
   */
  private fixedColumnViews: EmbeddedViewRef<void>[] = [];

  private cachedRowsHeight = 0;
  private cachedContentHeight = 0;
  private resizeObserver: ResizeObserver = new ResizeObserver(entries => {
    requestAnimationFrame(() => {
      this.handleResizeChanges(entries);
    });
  });

  /**
   * Watches the row controls for anything that changes their width without going through a render
   * cycle - a density change, or an application restyling them.
   */
  private rowControlsObserver: ResizeObserver = new ResizeObserver(() => this.updateRowControlsWidth());

  constructor(
    private organizer: DatagridRenderOrganizer,
    public items: Items<T>,
    public expandableRows: ExpandableRowsCount,
    public selection: Selection<T>,
    public rowActionService: RowActionService,
    private stateProvider: StateProvider<T>,
    private displayMode: DisplayModeService,
    private renderer: Renderer2,
    public detailService: DetailService,
    @Inject(DOCUMENT) private document: any,
    public el: ElementRef<HTMLElement>,
    private page: Page,
    public commonStrings: ClrCommonStringsService,
    public keyNavigation: KeyNavigationGridController,
    private zone: NgZone,
    private columnsService: ColumnsService
  ) {
    const datagridId = uniqueIdFactory();

    this.selectAllId = 'clr-dg-select-all-' + datagridId;
    detailService.id = datagridId;
  }

  /**
   * Freezes the datagrid while data is loading
   */
  @Input('clrDgLoading')
  get loading(): boolean {
    return this.items.loading;
  }
  set loading(value: boolean) {
    this.items.loading = value;
  }

  /**
   * Selection type
   * - `None`: No rows are selectable.
   * - `Single`: Only one row can be selected at a time.
   * - `Multi`: Multiple rows can be selected.
   *
   * Defaults to `None`.
   */
  @Input({ alias: 'clrDgSelectionType', transform: selectionTypeAttribute })
  get selectionType(): SelectionType {
    return this.selection.selectionType;
  }
  set selectionType(value: SelectionType) {
    this.selection.selectionType = value;
    if (this.contentInitialized) {
      this.updateMutator();
    }
  }

  /**
   * Array of all selected items
   */
  @Input('clrDgSelected')
  set selected(value: T[]) {
    value = value || [];

    if (value === this.selection.current) {
      return;
    }

    this.selection.updateCurrent(value, false);
  }

  @Input()
  set clrDgPreserveSelection(state: boolean) {
    this.selection.preserveSelection = state;
  }

  /**
   * @deprecated since 2.0, remove in 3.0
   *
   * Selection/Deselection on row click mode
   */
  @Input('clrDgRowSelection')
  set rowSelectionMode(value: boolean) {
    this.selection.rowSelectionMode = value;
  }

  @Input('clrDgItemsIdentityFn')
  set identityFn(value: ClrDatagridItemsIdentityFunction<T>) {
    this.items.identifyBy = value;
  }

  /**
   * Indicates if all currently displayed items are selected
   */
  get allSelected() {
    return this.selection.isAllSelected();
  }
  set allSelected(value: boolean) {
    if (this.customSelectAllEnabled) {
      this.customSelectAll.emit(value);
    } else {
      /**
       * This is a setter but we ignore the value.
       * It's strange, but it lets us have an indeterminate state where only
       * some of the items are selected.
       */
      this.selection.toggleAll();
    }
  }

  get virtualScroll(): ClrDatagridVirtualScrollDirective<any> {
    return this._virtualScroll?.get(0);
  }

  protected get isDetailOverlay(): boolean {
    return this.detailService.detailWidth === MAX_DETAIL_WIDTH;
  }

  ngAfterContentInit() {
    // A paginated or server-driven grid holds only the current page, so the total is
    // something only the component knows. `aria-rowcount` and `aria-rowindex` are set only
    // in virtual-scroll mode (see the virtual-scroll directive); a paginated grid has
    // neither, so the total is published here rather than as half-implemented ARIA.
    this.teardownElementContext = clrPublishElementContext(this.el.nativeElement, snapshotOptions =>
      this.withRowCells(() => this.describeForContext(snapshotOptions))
    );

    this.contentInitialized = true;
    this.updateMutator();

    if (!this.items.smart) {
      this.items.all = this.rows.map((row: ClrDatagridRow<T>) => row.item);
    }

    const rowItemsChanges = this.rows.changes.pipe(
      switchMap((rows: ClrDatagridRow<T>[]) =>
        merge(
          // immediate update
          of(rows.map(row => row.item)),
          // subsequent updates once per tick
          combineLatest(rows.map(row => row.itemChanges)).pipe(debounceTime(0))
        )
      )
    );

    this._subscriptions.push(
      rowItemsChanges.subscribe(all => {
        if (!this.items.smart) {
          this.items.all = all;
        }
      }),
      this._virtualScroll.changes.subscribe(() => {
        this.toggleVirtualScrollSubscriptions();
      }),
      this.rows.changes.subscribe(() => {
        // Remove any projected rows from the displayedRows container
        // Necessary with Ivy off. See https://github.com/vmware/clarity/issues/4692
        for (let i = this._displayedRows.length - 1; i >= 0; i--) {
          if (this._displayedRows.get(i).destroyed) {
            this._displayedRows.remove(i);
          }
        }
        this.rows.forEach(row => {
          this._displayedRows.insert(row._view);
        });
        this.updateDetailState();

        // retain active cell when navigating with Up/Down Arrows, PageUp and PageDown buttons in virtual scroller
        if (this.virtualScroll && this.activeCellCoords) {
          this.zone.runOutsideAngular(() => {
            const row = Array.from(this.rows).find(row => {
              return row.el.nativeElement.children[0].ariaRowIndex === this.activeCellCoords.ariaRowIndex;
            });

            if (!row) {
              return;
            }

            const activeCell = row.el.nativeElement.querySelectorAll(this.keyNavigation.config.keyGridCells)[
              this.activeCellCoords.x
            ] as HTMLElement;

            this.keyNavigation.setActiveCell(activeCell);
            this.keyNavigation.focusElement(activeCell, { preventScroll: true });
          });
        }
      })
    );
  }

  /**
   * Our setup happens in the view of some of our components, so we wait for it to be done before starting
   */
  ngAfterViewInit() {
    this.keyNavigation.initializeKeyGrid(this.el.nativeElement);

    this.updateDetailState();
    this.zone.runOutsideAngular(() => this.rowControlsObserver.observe(this.rowControls.nativeElement));

    // Emit the state only if it is not an empty object.
    // Default state of `ClrDatagridStateInterface` is an empty object.
    // The refresh emit is needed in Server-driven datagrid when pagination is set, but the data is still not requested.
    // The refresh emit should trigger the data request based on the state provided.
    // Alternately because pagination might not be set on initialization emit an empty state will trigger a refresh.
    if (Object.keys(this.stateProvider.state).length > 0) {
      this.refresh.emit(this.stateProvider.state);
    }

    this._subscriptions.push(
      this.stickyHeaders.changes.subscribe(() => this.resize()),
      this.stateProvider.change.subscribe(state => this.refresh.emit(state)),
      this.selection.change.subscribe(selection => {
        if (this.selection.selectable) {
          this.selectedChanged.emit(selection);
        }
      }),
      // Reinitialize arrow key navigation on page changes
      this.page.change.subscribe(() => {
        this.keyNavigation.resetKeyGrid();
        if (!this.clrDgDisablePageFocus) {
          this.datagridTable.nativeElement.focus();
        }
      }),
      // A subscription that listens for displayMode changes on the datagrid
      this.displayMode.view.subscribe(viewChange => {
        // Remove any projected columns from the projectedDisplayColumns container
        for (let i = this._projectedDisplayColumns.length; i > 0; i--) {
          this._projectedDisplayColumns.detach();
        }
        // Remove any projected columns from the projectedStickyColumns container
        for (let i = this._projectedStickyColumns.length; i > 0; i--) {
          this._projectedStickyColumns.detach();
        }
        // Remove any projected columns from the projectedCalculationColumns container
        this.destroyFixedColumnViews();
        for (let i = this._projectedCalculationColumns.length; i > 0; i--) {
          this._projectedCalculationColumns.detach();
        }
        // Remove any projected rows from the calculationRows container
        for (let i = this._calculationRows.length; i > 0; i--) {
          this._calculationRows.detach();
        }
        // Remove any projected rows from the displayedRows container
        for (let i = this._displayedRows.length; i > 0; i--) {
          this._displayedRows.detach();
        }
        if (viewChange === DatagridDisplayMode.DISPLAY) {
          // Set state, style for the datagrid to DISPLAY and insert row & columns into containers
          this.renderer.removeClass(this.el.nativeElement, 'datagrid-calculate-mode');
          // Pinned columns go into the pinned container so they stay visible during horizontal
          // scroll. Iterating in declaration order keeps both groups in their original order,
          // which is what matches them with the cells of every row.
          this.columns.forEach((column, index) => {
            const container = this.columnsService.isPinned(index)
              ? this._projectedStickyColumns
              : this._projectedDisplayColumns;
            container.insert(column._view);
          });
          this.rows.forEach(row => {
            this._displayedRows.insert(row._view);
          });
          // The row controls are only laid out in this mode, and this is also the point where
          // their number can have changed.
          this.updateRowControlsWidth();
        } else {
          // Set state, style for the datagrid to CALCULATE and insert row & columns into containers
          this.renderer.addClass(this.el.nativeElement, 'datagrid-calculate-mode');
          // Inserts a fixed column if any of these conditions are true.
          const fixedColumnConditions = [
            this.rowActionService.hasActionableRow,
            this.selection.selectionType !== this.SELECTION_TYPE.None,
            this.expandableRows.hasExpandableRow || this.detailService.enabled,
          ];
          fixedColumnConditions.filter(Boolean).forEach(() => {
            const fixedColumnView = this._fixedColumnTemplate.createEmbeddedView(null);
            this.fixedColumnViews.push(fixedColumnView);
            this._projectedCalculationColumns.insert(fixedColumnView);
          });
          this.columns.forEach(column => {
            this._projectedCalculationColumns.insert(column._view);
          });
          this.rows.forEach(row => {
            this._calculationRows.insert(row._view);
          });
        }
      })
    );

    if (this.virtualScroll) {
      this.toggleVirtualScrollSubscriptions();
    }

    // We need to preserve shift state, so it can be used on selection change, regardless of the input event
    // that triggered the change. This helps us to easily resolve the k/b only case together with the mouse selection case.
    this.zone.runOutsideAngular(() => {
      this._subscriptions.push(
        fromEvent(this.document.body, 'keydown').subscribe((event: KeyboardEvent) => {
          if (event.key === 'Shift') {
            this.selection.shiftPressed = true;
          }
        }),
        fromEvent(this.document.body, 'keyup').subscribe((event: KeyboardEvent) => {
          if (event.key === 'Shift') {
            this.selection.shiftPressed = false;
          }
        })
      );
    });
  }

  ngDoCheck() {
    // we track for changes on selection.current because it can happen with pushing items
    // instead of overriding the variable
    this.selection.checkForChanges();
  }

  ngOnDestroy() {
    this.teardownElementContext?.();
    this.teardownElementMutator?.();
    this.destroyFixedColumnViews();
    this._subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
    this._virtualScrollSubscriptions.forEach((sub: Subscription) => sub.unsubscribe());
    this.resizeObserver.disconnect();
    this.rowControlsObserver.disconnect();
    // If the detail pane is left open, close it so the DetailService unregisters itself from the
    // root ModalStackService instead of staying referenced there after this datagrid is gone.
    if (this.detailService.isOpen) {
      this.detailService.close();
    }
  }

  toggleAllSelected($event: any) {
    $event.preventDefault();
    this.selectAllCheckbox?.nativeElement.click();
  }

  resize(): void {
    this.organizer.resize();
  }

  /**
   * Checks the state of detail panel and if it's opened then
   * find the matching row and trigger the detail panel
   */
  updateDetailState() {
    // Try to update only when there is something cached and its open.
    if (this.detailService.state && this.detailService.isOpen) {
      const row = this.rows.find(
        row => this.items.identifyBy(row.item) === this.items.identifyBy(this.detailService.state)
      );

      /**
       * Reopen updated row or close it
       */
      if (row) {
        this.detailService.open(row.item, row.detailButton.nativeElement);
        // always keep open when virtual scroll is available otherwise close it
      } else if (!this.virtualScroll) {
        // Using setTimeout to make sure the inner cycles in rows are done
        setTimeout(() => {
          this.detailService.close();
        });
      }
    }
  }

  /**
   * Public method to re-trigger the computation of displayed items manually
   */
  dataChanged() {
    this.items.refresh();
  }

  private destroyFixedColumnViews() {
    // On teardown Angular has already destroyed the views in our container by the time it runs our
    // `ngOnDestroy`, so only the calculate/display transition has live ones to release here.
    this.fixedColumnViews.forEach(view => {
      if (!view.destroyed) {
        view.destroy();
      }
    });
    this.fixedColumnViews = [];
  }

  private toggleVirtualScrollSubscriptions() {
    const hasVirtualScroll = !!this.virtualScroll;

    // the virtual scroll will handle the scrolling
    this.keyNavigation.preventScrollOnFocus = hasVirtualScroll;

    if (hasVirtualScroll && this._virtualScrollSubscriptions.length === 0) {
      // TODO: use `resizeObserver` for all datagrid variants
      this.resizeObserver.observe(this.contentWrapper.nativeElement);
      this.resizeObserver.observe(this.rowsWrapper.nativeElement);

      this._virtualScrollSubscriptions.push(
        fromEvent(this.contentWrapper.nativeElement, 'scroll').subscribe(() => {
          if (this.datagridHeader.nativeElement.scrollLeft !== this.contentWrapper.nativeElement.scrollLeft) {
            this.datagridHeader.nativeElement.scrollLeft = this.contentWrapper.nativeElement.scrollLeft;
          }
        }),
        fromEvent(this.datagridHeader.nativeElement, 'scroll').subscribe(() => {
          if (this.datagridHeader.nativeElement.scrollLeft !== this.contentWrapper.nativeElement.scrollLeft) {
            this.contentWrapper.nativeElement.scrollLeft = this.datagridHeader.nativeElement.scrollLeft;
          }
        }),
        this.keyNavigation.nextCellCoordsEmitter.subscribe(cellCoords => {
          if (!cellCoords?.ariaRowIndex) {
            this.activeCellCoords = null;
            return;
          }

          if (cellCoords.ariaRowIndex === this.activeCellCoords?.ariaRowIndex) {
            this.activeCellCoords = cellCoords;
            return;
          }

          this.activeCellCoords = cellCoords;

          // aria-rowindex is always + 1. Check virtual scroller updateAriaRowIndexes method.
          const rowIndex = Number(cellCoords.ariaRowIndex) - 1;

          this.virtualScroll.scrollToIndex(rowIndex);
        })
      );
    } else if (!hasVirtualScroll) {
      this.resizeObserver.disconnect();
      this._virtualScrollSubscriptions.forEach((sub: Subscription) => sub.unsubscribe());
      this._virtualScrollSubscriptions = [];
    }
  }

  /**
   * Publishes the width of the row controls - the static container holding the select, action and
   * caret cells - as a custom property, which is where the pinned columns read the offset they
   * became static at. They are static right after the controls rather than at the edge of the datagrid,
   * and `position: sticky` always measures its offsets from that edge, so the distance between the
   * two has to be measured and handed to the stylesheet.
   *
   * The header and the rows get their own value: the header renders one caret column for both
   * kinds of caret where a row renders one cell per caret, so the two containers are not
   * necessarily the same width.
   *
   * Nothing reads this property unless a column is pinned - `.datagrid-pinned-cells` is the only
   * consumer, and it is `display: none` while empty - so the measurement is skipped entirely
   * otherwise. It matters on a datagrid with many rows: `getBoundingClientRect()` forces the
   * browser to resolve any pending layout first, and on a large datagrid that resolution is not
   * cheap. Both boxes are read before either write for the same reason - writing the custom
   * property is itself layout-affecting (`.datagrid-pinned-cells` reads it back for its own
   * position and width), so reading again in between would force that resolution twice.
   */
  private updateRowControlsWidth() {
    const headerControls = this.rowControls?.nativeElement;
    if (!headerControls || !this.datagridHeader || !this.columnsService.hasPinnedColumns) {
      return;
    }
    const rowControls: HTMLElement = this.rowsWrapper.nativeElement.querySelector(
      '.datagrid-row-master > .datagrid-row-sticky:not(.datagrid-row-sticky-scroll)'
    );

    // Measured from the box rather than from offsetWidth, which is rounded to whole pixels and
    // would leave the pinned columns off by up to a pixel.
    const headerWidth = headerControls.getBoundingClientRect().width;
    // Without a row there is nothing to line up with, so the header is a good enough stand-in.
    const rowWidth = (rowControls || headerControls).getBoundingClientRect().width;

    this.setRowControlsWidth(this.datagridHeader.nativeElement, headerWidth);
    this.setRowControlsWidth(this.rowsWrapper.nativeElement, rowWidth);
  }

  private setRowControlsWidth(target: HTMLElement, width: number) {
    this.renderer.setStyle(target, '--clr-datagrid-row-controls-width', `${width}px`, RendererStyleFlags2.DashCase);
  }

  private handleResizeChanges(entries: ResizeObserverEntry[]) {
    const rowsWrapper = this.rowsWrapper.nativeElement;

    for (const entry of entries) {
      if (entry.target === this.contentWrapper.nativeElement) {
        this.cachedContentHeight = entry.contentRect.height;
      }
      if (entry.target === rowsWrapper) {
        this.cachedRowsHeight = entry.contentRect.height;
      }
    }

    const scrollClass = 'datagrid-scrollbar-visible';

    if (this.cachedRowsHeight > this.cachedContentHeight) {
      this.renderer.addClass(rowsWrapper, scrollClass);
    } else {
      this.renderer.removeClass(rowsWrapper, scrollClass);
    }
  }

  /**
   * Says how the selection is written to, through the element mutator contract in
   * `@clr/angular/utils` — while there is a selection to write, and only then, so a grid
   * without selection is not offered to an agent as something it can change. Row
   * selection is not a form control, so the mutation engine cannot reach it through one;
   * it is written here instead, by naming rows the way the published context lists them,
   * and read back the same way. The selection of the rows on this page becomes exactly
   * the rows named, so repeating a write changes nothing; locked rows, and rows selected
   * on other pages, keep their state.
   */
  private updateMutator() {
    if (!this.selection.selectable) {
      this.teardownElementMutator?.();
      this.teardownElementMutator = undefined;
      return;
    }
    if (this.teardownElementMutator) {
      return;
    }
    this.teardownElementMutator = clrPublishElementMutator(this.el.nativeElement, {
      // Rows are named as the snapshot the write is judged against names them.
      write: (proposed, options): ClrElementMutation =>
        this.withRowCells(() => this.writeSelection(proposed, this.excludedBy(options), this.budgetOf(options))),
      read: options => this.withRowCells(() => this.readSelection(this.excludedBy(options), this.budgetOf(options))),
    });
  }

  private writeSelection(proposed: unknown, excluded: string, limit: number): ClrElementMutation {
    if (!this.selection.selectable) {
      return { refused: 'The datagrid does not offer row selection.' };
    }
    const wanted =
      proposed === null || proposed === undefined || proposed === ''
        ? []
        : Array.isArray(proposed)
          ? proposed
          : [proposed];
    const single = this.selection.selectionType === SelectionType.Single;
    if (single && wanted.length > 1) {
      return { refused: 'The datagrid selects one row at a time.' };
    }
    const rows: ClrDatagridRow<T>[] = [];
    for (const label of wanted) {
      const found = this.findRow(label, excluded);
      if ('refused' in found) {
        return { refused: found.refused };
      }
      // Naming a locked row that is already selected changes nothing, so writing back the
      // value a write returned is not refused.
      if (this.selection.isLocked(found.row.item) && !this.selection.isSelected(found.row.item)) {
        return {
          refused: `The row "${this.rowLabel(found.row, excluded)}" is locked and cannot be selected or deselected.`,
        };
      }
      rows.push(found.row);
    }
    const identify = (item: T) => this.items.identifyBy(item);
    if (single) {
      const current = this.selection.currentSingle;
      const replacing =
        current !== undefined && current !== null && (!rows.length || identify(rows[0].item) !== identify(current));
      if (replacing && this.selection.isLocked(current)) {
        return { refused: 'The selected row is locked and cannot be deselected.' };
      }
      if (replacing && this.isWithheldRow(current, excluded)) {
        return { refused: 'The selected row is kept from agents, and cannot be deselected by one.' };
      }
      const unchanged = rows.length
        ? current !== undefined && current !== null && !replacing
        : current === undefined || current === null;
      // Repeating a write changes nothing, so it does not tell the application it did.
      if (unchanged) {
        return { value: this.readSelection(excluded, limit) };
      }
      if (rows.length) {
        this.selection.setSelected(rows[0].item, true);
      } else {
        this.selection.clearSelection();
      }
    } else {
      const onPage = new Set(this.rows.map(row => identify(row.item)));
      // What the agent cannot see or change stays as it is: selections on other pages,
      // rows kept from agents, and locked rows, which the user cannot deselect either.
      const kept = (this.selection.current ?? []).filter(
        item => !onPage.has(identify(item)) || this.selection.isLocked(item) || this.isWithheldRow(item, excluded)
      );
      const next = [...kept];
      for (const row of rows) {
        if (!next.some(item => identify(item) === identify(row.item))) {
          next.push(row.item);
        }
      }
      // Repeating a write changes nothing, so it does not tell the application it did.
      const current = this.selection.current ?? [];
      const selected = new Set(current.map(identify));
      if (next.length !== current.length || next.some(item => !selected.has(identify(item)))) {
        this.selection.current = next;
      }
    }
    return { value: this.readSelection(excluded, limit) };
  }

  /** What the grid publishes: see `ngAfterContentInit`. */
  private describeForContext(snapshotOptions?: ClrContextSnapshotOptions): { state: Record<string, unknown> } | null {
    const state: Record<string, unknown> = {};
    const excluded = this.excludedBy(snapshotOptions);

    // Named apart from the `rowCount` the engine reads off the grid (the rows on this
    // page, or `aria-rowcount`), which is a different number for a paginated grid.
    const total = this.page.size > 0 ? this.page.totalItems : 0;
    if (total > 0) {
      state.totalRows = total;
    }

    // Which rows can be selected, and which are: the rows by their content, so an
    // agent can name one to select, and the selection in the same terms. A grid's
    // rows are otherwise only counted, since listing every cell of every row would
    // bury the page; here it is bounded by the collection budget and left out of a
    // summary snapshot like every other item list.
    if (this.selection.selectable) {
      state.selectionMode = this.selection.selectionType === SelectionType.Single ? 'single' : 'multi';
      const maxItems = snapshotOptions?.maxItemsPerCollection ?? CLR_CONTEXT_DEFAULT_MAX_ITEMS;
      if (snapshotOptions?.collectionItems !== 'summary') {
        // A row whose every cell is withheld or excluded is not listed at all: an empty
        // name would still say it is there.
        state.rows = this.shownRowLabels(this.rows.toArray(), excluded, maxItems);
      }
      const selected = this.selectedRowLabels(excluded, maxItems);
      if (selected.length) {
        state.selection = selected;
      }
    }

    // A filter's state is a CSS class on its toggle, and the value it holds lives
    // inside a popover that is absent from the DOM while closed.
    const filtered = this.columns
      .toArray()
      .filter(column => column.filter?.isActive?.())
      .map(column => this.columnName(column, excluded))
      .filter((name): name is string => !!name);
    if (filtered.length) {
      state.filteredColumns = filtered;
    }

    // A hidden column is not rendered at all, so nothing in the DOM says it exists or
    // that it could be shown again. Each column knows its own state, so nothing has
    // to be paired up by position.
    const hidden = this.columns
      .toArray()
      .filter(column => column.isHidden)
      .map(column => this.columnName(column, excluded))
      .filter((name): name is string => !!name);
    if (hidden.length) {
      state.hiddenColumns = hidden;
    }

    return Object.keys(state).length ? { state } : null;
  }

  /**
   * A column as the grid's summary names it — by its header text, without screen-reader
   * additions or withheld text — so that an agent can pair it with the columns it lists;
   * by its field when the header says nothing. A hidden column's header is not rendered,
   * so its markup is read as markup, without judging style.
   */
  private columnName(column: ClrDatagridColumn<T>, excluded: string): string | null {
    const title = column.titleContainer?.nativeElement;
    const skip = (element: Element) =>
      element.classList.contains('clr-sr-only') || (!!excluded && element.matches(excluded));
    const text = title ? clrNormalizeContextText(clrContextText(title.cloneNode(true) as Element, skip), false) : '';
    return text || column.field || null;
  }

  /** The collection budget of the snapshot options a write or read is judged against. */
  private budgetOf(options: { maxItemsPerCollection?: number } | null | undefined): number {
    return options?.maxItemsPerCollection ?? CLR_CONTEXT_DEFAULT_MAX_ITEMS;
  }

  /** Whether a row on this page is one whose every cell is withheld or excluded. */
  private isWithheldRow(item: T, excluded: string): boolean {
    const identify = (candidate: T) => this.items.identifyBy(candidate);
    const row = this.rows.find(candidate => identify(candidate.item) === identify(item));
    return !!row && !this.rowLabel(row, excluded);
  }

  /** The labels of the first `limit` rows that have one. */
  private shownRowLabels(rows: ClrDatagridRow<T>[], excluded: string, limit: number): string[] {
    const labels: string[] = [];
    for (const row of rows) {
      if (labels.length >= limit) {
        break;
      }
      const label = this.rowLabel(row, excluded);
      if (label) {
        labels.push(label);
      }
    }
    return labels;
  }

  /**
   * The row an agent named: by its whole label, else by any one cell of it — refused
   * when the words fit more than one row, rather than taking the first that fits.
   */
  private findRow(label: unknown, excluded: string): { row: ClrDatagridRow<T> } | { refused: string } {
    // Only rows the snapshot shows can be named, or quoted.
    const rows = this.rows.toArray().filter(row => !!this.rowLabel(row, excluded));
    const wanted = typeof label === 'string' ? clrNormalizeContextText(label) : '';
    if (!wanted) {
      return { refused: 'A row is named by its content, as the published rows list it.' };
    }
    const byLabel = rows.filter(row => clrNormalizeContextText(this.rowLabel(row, excluded)) === wanted);
    const matches = byLabel.length
      ? byLabel
      : rows.filter(row => this.rowCells(row, excluded).some(cell => clrNormalizeContextText(cell) === wanted));
    if (matches.length === 1) {
      return { row: matches[0] };
    }
    const quote = (candidates: ClrDatagridRow<T>[]) =>
      candidates
        .slice(0, CLR_CONTEXT_DEFAULT_MAX_ITEMS)
        .map(row => `"${this.rowLabel(row, excluded)}"`)
        .join(', ');
    if (matches.length > 1) {
      return {
        refused: `"${String(label)}" fits ${matches.length} rows: ${quote(matches)}. Name the row by more of its content.`,
      };
    }
    return { refused: `No such row on this page. The rows are: ${quote(rows)}.` };
  }

  private readSelection(excluded: string, limit = CLR_CONTEXT_DEFAULT_MAX_ITEMS): string | string[] | null {
    const selected = this.selectedRowLabels(excluded, limit);
    return this.selection.selectionType === SelectionType.Single ? (selected[0] ?? null) : selected;
  }

  /** The selected rows by content, stopping at `limit`: labelling a row costs a DOM query. */
  private selectedRowLabels(excluded: string, limit = Infinity): string[] {
    const labels: string[] = [];
    for (const row of this.rows.toArray()) {
      if (labels.length >= limit) {
        break;
      }
      if (this.selection.isSelected(row.item)) {
        const label = this.rowLabel(row, excluded);
        if (label) {
          labels.push(label);
        }
      }
    }
    return labels;
  }

  /** A row by its content: the text of its cells, in order. */
  private rowLabel(row: ClrDatagridRow<T>, excluded: string): string {
    return this.rowCells(row, excluded).join(' | ');
  }

  /** The elements a snapshot with these options leaves out, as one selector, or `''`. */
  private excludedBy(options: { excludeSelectors?: readonly string[] } | null | undefined): string {
    return clrUsableSelectors(this.el.nativeElement, options?.excludeSelectors ?? []);
  }

  /**
   * The row's content cells, as the user sees them: not the selection or action cells the
   * grid adds, not hidden columns, not the cells of its expanded detail, and not a cell the
   * application keeps from agents or the snapshot left out. Only what lies between a cell and its row counts: the grid itself is
   * hidden from assistive technology while a detail pane is open, and its rows still have
   * the same content.
   */
  private rowCells(row: ClrDatagridRow<T>, excluded: string): string[] {
    const cached = this.rowCellsCache?.get(row);
    if (cached && cached.excluded === excluded) {
      return cached.cells;
    }
    const cells = this.readRowCells(row, excluded);
    this.rowCellsCache?.set(row, { excluded, cells });
    return cells;
  }

  /**
   * Runs `read` with each row's cells read from the page at most once: labelling a row
   * reads the style of everything in it, and a write names, matches and reports rows
   * several times over.
   */
  private withRowCells<R>(read: () => R): R {
    if (this.rowCellsCache) {
      return read();
    }
    this.rowCellsCache = new Map();
    try {
      return read();
    } finally {
      this.rowCellsCache = null;
    }
  }

  private readRowCells(row: ClrDatagridRow<T>, excluded: string): string[] {
    const host: HTMLElement = row.el.nativeElement;
    const withheld = (element: Element) =>
      element.matches(CLR_CONTEXT_WITHHELD_SELECTOR) || (!!excluded && element.matches(excluded));
    const leftOut = (element: Element) => element.tagName.toLowerCase() === 'clr-dg-row-detail' || withheld(element);
    return Array.from(host.querySelectorAll('clr-dg-cell'))
      .filter(
        cell =>
          cell.closest('clr-dg-row') === host &&
          !cell.classList.contains(HIDDEN_COLUMN_CLASS) &&
          !withinRow(cell, host).some(leftOut)
      )
      .map(cell => clrNormalizeContextText(clrContextText(cell, withheld), false))
      .filter(Boolean);
  }
}

/** The element and its ancestors up to and including `row`. */
function withinRow(element: Element, row: Element): Element[] {
  const path: Element[] = [];
  for (let current: Element | null = element; current; current = current.parentElement) {
    path.push(current);
    if (current === row) {
      break;
    }
  }
  return path;
}

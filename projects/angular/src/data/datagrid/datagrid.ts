/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { combineLatest, fromEvent, merge, of, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

import { ClrDatagridColumn } from './datagrid-column';
import { ClrDatagridItems } from './datagrid-items';
import { ClrDatagridPlaceholder } from './datagrid-placeholder';
import { ClrDatagridRow } from './datagrid-row';
import { ClrDatagridVirtualScrollDirective } from './datagrid-virtual-scroll.directive';
import { DatagridDisplayMode } from './enums/display-mode.enum';
import { SelectionType } from './enums/selection-type';
import { ClrDatagridStateInterface } from './interfaces/state.interface';
import { ColumnsService } from './providers/columns.service';
import { DetailService } from './providers/detail.service';
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
import { DatagridRenderOrganizer } from './render/render-organizer';
import { CellCoordinates, KeyNavigationGridController } from './utils/key-navigation-grid.controller';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';

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
  @Output('clrDgSingleSelectedChange') singleSelectedChanged = new EventEmitter<T>(false);

  /**
   * Output emitted whenever the data needs to be refreshed, based on user action or external ones
   */
  @Output('clrDgRefresh') refresh = new EventEmitter<ClrDatagridStateInterface<T>>(false);

  /**
   * The application can provide custom select all logic.
   */
  @Input('clrDgCustomSelectAllEnabled') customSelectAllEnabled = false;
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
  @ViewChild('contentWrapper', { read: ElementRef }) contentWrapper: ElementRef<HTMLElement>;
  @ViewChild('scrollableColumns', { read: ViewContainerRef }) scrollableColumns: ViewContainerRef;
  @ViewChild('projectedDisplayColumns', { read: ViewContainerRef }) _projectedDisplayColumns: ViewContainerRef;
  @ViewChild('projectedCalculationColumns', { read: ViewContainerRef }) _projectedCalculationColumns: ViewContainerRef;
  @ViewChild('displayedRows', { read: ViewContainerRef }) _displayedRows: ViewContainerRef;
  @ViewChild('calculationRows', { read: ViewContainerRef }) _calculationRows: ViewContainerRef;
  @ViewChild('fixedColumnTemplate') _fixedColumnTemplate: TemplateRef<any>;
  @ViewChildren('stickyHeader', { emitDistinctChangesOnly: true }) stickyHeaders: QueryList<ElementRef>;

  selectAllId: string;
  activeCellCoords: CellCoordinates;

  /* reference to the enum so that template can access */
  SELECTION_TYPE = SelectionType;

  @ViewChild('selectAllCheckbox') private selectAllCheckbox: ElementRef<HTMLInputElement>;

  /**
   * Subscriptions to all the services and queries changes
   */
  private _subscriptions: Subscription[] = [];
  private _virtualScrollSubscriptions: Subscription[] = [];

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
    private zone: NgZone
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
   * Array of all selected items
   */
  @Input('clrDgSelected')
  set selected(value: T[] | undefined) {
    if (value) {
      this.selection.selectionType = SelectionType.Multi;
    } else {
      this.selection.selectionType = SelectionType.None;
    }
    this.selection.updateCurrent(value, false);
  }

  /**
   * Selected item in single-select mode
   */
  @Input('clrDgSingleSelected')
  set singleSelected(value: T) {
    this.selection.selectionType = SelectionType.Single;
    // the clrDgSingleSelected is updated in one of two cases:
    // 1. an explicit value is passed
    // 2. is being set to null or undefined, where previously it had a value
    if (value) {
      this.selection.currentSingle = value;
    } else if (this.selection.currentSingle) {
      this.selection.currentSingle = null;
    }
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
    return this._virtualScroll.get(0);
  }

  ngAfterContentInit() {
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
    // TODO: determine if we can get rid of provider wiring in view init so that subscriptions can be done earlier
    this.refresh.emit(this.stateProvider.state);
    this._subscriptions.push(
      this.stickyHeaders.changes.subscribe(() => this.resize()),
      this.stateProvider.change.subscribe(state => this.refresh.emit(state)),
      this.selection.change.subscribe(s => {
        if (this.selection.selectionType === SelectionType.Single) {
          this.singleSelectedChanged.emit(s as T);
        } else if (this.selection.selectionType === SelectionType.Multi) {
          this.selectedChanged.emit(s as T[]);
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
        // Remove any projected columns from the projectedCalculationColumns container
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
          this.columns.forEach(column => {
            this._projectedDisplayColumns.insert(column._view);
          });
          this.rows.forEach(row => {
            this._displayedRows.insert(row._view);
          });
        } else {
          // Set state, style for the datagrid to CALCULATE and insert row & columns into containers
          this.renderer.addClass(this.el.nativeElement, 'datagrid-calculate-mode');
          // Inserts a fixed column if any of these conditions are true.
          const fixedColumnConditions = [
            this.rowActionService.hasActionableRow,
            this.selection.selectionType !== this.SELECTION_TYPE.None,
            this.expandableRows.hasExpandableRow || this.detailService.enabled,
          ];
          fixedColumnConditions
            .filter(Boolean)
            .forEach(() =>
              this._projectedCalculationColumns.insert(this._fixedColumnTemplate.createEmbeddedView(null))
            );
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
    this._subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
    this._virtualScrollSubscriptions.forEach((sub: Subscription) => sub.unsubscribe());
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

  private toggleVirtualScrollSubscriptions() {
    const hasVirtualScroll = !!this.virtualScroll;

    // the virtual scroll will handle the scrolling
    this.keyNavigation.preventScrollOnFocus = hasVirtualScroll;

    if (hasVirtualScroll && this._virtualScrollSubscriptions.length === 0) {
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
      this._virtualScrollSubscriptions.forEach((sub: Subscription) => sub.unsubscribe());
      this._virtualScrollSubscriptions = [];
    }
  }
}

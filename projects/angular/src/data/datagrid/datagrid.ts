/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { combineLatest, fromEvent, Subscription } from 'rxjs';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrDatagridColumn } from './datagrid-column';
import { ClrDatagridItems } from './datagrid-items';
import { ClrDatagridPlaceholder } from './datagrid-placeholder';
import { ClrDatagridRow } from './datagrid-row';
import { DatagridDisplayMode } from './enums/display-mode.enum';
import { SelectionType } from './enums/selection-type';
import { ClrDatagridStateInterface } from './interfaces/state.interface';
import { ColumnsService } from './providers/columns.service';
import { DetailService } from './providers/detail.service';
import { DisplayModeService } from './providers/display-mode.service';
import { FiltersProvider } from './providers/filters';
import { ExpandableRowsCount } from './providers/global-expandable-rows';
import { ClrDatagridItemsTrackByFunction, Items } from './providers/items';
import { Page } from './providers/page';
import { RowActionService } from './providers/row-action-service';
import { Selection } from './providers/selection';
import { Sort } from './providers/sort';
import { StateDebouncer } from './providers/state-debouncer.provider';
import { StateProvider } from './providers/state.provider';
import { TableSizeService } from './providers/table-size.service';
import { DatagridRenderOrganizer } from './render/render-organizer';
import { KeyNavigationGridController } from './utils/key-navigation-grid.controller';

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
  },
})
export class ClrDatagrid<T = any> implements AfterContentInit, AfterViewInit, OnDestroy {
  selectAllId: string;
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
    private el: ElementRef,
    private page: Page,
    public commonStrings: ClrCommonStringsService,
    private columnsService: ColumnsService,
    private keyNavigation: KeyNavigationGridController,
    private zone: NgZone
  ) {
    const datagridId = uniqueIdFactory();

    this.selectAllId = 'clr-dg-select-all-' + datagridId;
    this.detailService.id = datagridId;
  }

  /* reference to the enum so that template can access */
  SELECTION_TYPE = SelectionType;

  /**
   * Freezes the datagrid while data is loading
   */
  get loading(): boolean {
    return this.items.loading;
  }

  @Input('clrDgLoading')
  set loading(value: boolean) {
    this.items.loading = value;
  }

  /**
   * Output emitted whenever the data needs to be refreshed, based on user action or external ones
   */
  @Output('clrDgRefresh') refresh = new EventEmitter<ClrDatagridStateInterface<T>>(false);

  /**
   * Public method to re-trigger the computation of displayed items manually
   */
  dataChanged() {
    this.items.refresh();
  }

  /**
   * We grab the smart iterator from projected content
   */
  @ContentChild(ClrDatagridItems) iterator: ClrDatagridItems<T>;

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

  @Output('clrDgSelectedChange') selectedChanged = new EventEmitter<T[]>(false);

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

  @Output('clrDgSingleSelectedChange') singleSelectedChanged = new EventEmitter<T>(false);

  @Input() clrDgSingleSelectionAriaLabel: string = this.commonStrings.keys.singleSelectionAriaLabel;
  @Input() clrDgSingleActionableAriaLabel: string = this.commonStrings.keys.singleActionableAriaLabel;
  @Input() clrDetailExpandableAriaLabel: string = this.commonStrings.keys.detailExpandableAriaLabel;
  // Allows disabling of the auto focus on page/state changes (excludes focus management inside of popups)
  @Input() clrDgDisablePageFocus = false;

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

  @Input('clrDgItemsTrackBy')
  set trackBy(value: ClrDatagridItemsTrackByFunction<T>) {
    this.items.datagridTrackBy = value;
  }

  /**
   * Indicates if all currently displayed items are selected
   */
  get allSelected() {
    return this.selection.isAllSelected();
  }

  /**
   * Selects/deselects all currently displayed items
   * @param value
   */
  set allSelected(_value: boolean) {
    /**
     * This is a setter but we ignore the value.
     * It's strange, but it lets us have an indeterminate state where only
     * some of the items are selected.
     */
    this.selection.toggleAll();
  }

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

  @ContentChildren(ClrDatagridRow) rows: QueryList<ClrDatagridRow<T>>;
  @ViewChild('scrollableColumns', { read: ViewContainerRef })
  scrollableColumns: ViewContainerRef;

  @ViewChild('datagridTable', { read: ElementRef })
  datagridTable: ElementRef;

  ngAfterContentInit() {
    if (!this.items.smart) {
      this.items.all = this.rows.map((row: ClrDatagridRow<T>) => row.item);
    }

    this._subscriptions.push(
      this.rows.changes.subscribe(() => {
        if (!this.items.smart) {
          this.items.all = this.rows.map((row: ClrDatagridRow<T>) => row.item);
        }
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

        // Try to update only when there is something cached and its open.
        if (this.detailService.state && this.detailService.isOpen) {
          const row = this.items.canTrackBy()
            ? this.rows.find(row => this.items.trackBy(row.item) === this.items.trackBy(this.detailService.state))
            : undefined;

          /**
           * Reopen updated row or close it
           */
          row ? this.detailService.open(row.item, row.detailButton.nativeElement) : this.detailService.close();
        }
      })
    );
  }

  /**
   * Our setup happens in the view of some of our components, so we wait for it to be done before starting
   */
  ngAfterViewInit() {
    this.keyNavigation.initializeKeyGrid(this.el.nativeElement);

    // TODO: determine if we can get rid of provider wiring in view init so that subscriptions can be done earlier
    this.refresh.emit(this.stateProvider.state);
    this._subscriptions.push(
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
      // Reinitialize arrow key navigation on hide/unhide columns
      combineLatest(this.columnsService.columns).subscribe(() => this.keyNavigation?.resetKeyGrid()),
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
          this.columns.forEach(column => {
            this._projectedCalculationColumns.insert(column._view);
          });
          this.rows.forEach(row => {
            this._calculationRows.insert(row._view);
          });
        }
      })
    );

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

  /**
   * Subscriptions to all the services and queries changes
   */
  private _subscriptions: Subscription[] = [];

  ngOnDestroy() {
    this._subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  resize(): void {
    this.organizer.resize();
  }

  @ViewChild('projectedDisplayColumns', { read: ViewContainerRef })
  _projectedDisplayColumns: ViewContainerRef;
  @ViewChild('projectedCalculationColumns', { read: ViewContainerRef })
  _projectedCalculationColumns: ViewContainerRef;
  @ViewChild('displayedRows', { read: ViewContainerRef })
  _displayedRows: ViewContainerRef;
  @ViewChild('calculationRows', { read: ViewContainerRef })
  _calculationRows: ViewContainerRef;
}

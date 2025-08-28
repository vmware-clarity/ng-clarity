/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  ContentChildren,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  Renderer2,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';
import { ClrDatagrid } from '../datagrid';
import { DatagridColumnChanges } from '../enums/column-changes.enum';
import { DatagridRenderStep } from '../enums/render-step.enum';
import { ColumnState, ColumnStateDiff } from '../interfaces/column-state.interface';
import { ColumnsService } from '../providers/columns.service';
import { DetailService } from '../providers/detail.service';
import { Items } from '../providers/items';
import { Page } from '../providers/page';
import { TableSizeService } from '../providers/table-size.service';
import { KeyNavigationGridController } from '../utils/key-navigation-grid.controller';
import { DatagridHeaderRenderer } from './header-renderer';
import { NoopDomAdapter } from './noop-dom-adapter';
import { DatagridRenderOrganizer } from './render-organizer';
import { DatagridRowRenderer } from './row-renderer';

// Fixes build error
// @dynamic (https://github.com/angular/angular/issues/19698#issuecomment-338340211)
export const domAdapterFactory = (platformId: any) => {
  if (isPlatformBrowser(platformId)) {
    return new DomAdapter();
  } else {
    return new NoopDomAdapter();
  }
};

// Fixes build error
// @dynamic (https://github.com/angular/angular/issues/19698#issuecomment-338340211)
@Directive({
  selector: 'clr-datagrid',
  providers: [{ provide: DomAdapter, useFactory: domAdapterFactory, deps: [PLATFORM_ID] }],
  standalone: false,
})
export class DatagridMainRenderer implements AfterContentInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @ContentChildren(DatagridHeaderRenderer) private headers: QueryList<DatagridHeaderRenderer>;
  @ContentChildren(DatagridRowRenderer) private rows: QueryList<DatagridRowRenderer>;

  private _heightSet = false;
  private shouldStabilizeColumns = true;
  private subscriptions: Subscription[] = [];
  private intersectionObserver: IntersectionObserver = null;

  /**
   * Indicates if we want to re-compute columns width. This should only happen:
   * 1) When headers change, with columns being added or removed
   * 2) When rows are lazily loaded for the first time
   */
  private columnsSizesStable = false;

  constructor(
    private datagrid: ClrDatagrid,
    private organizer: DatagridRenderOrganizer,
    private items: Items,
    private page: Page,
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    detailService: DetailService,
    private tableSizeService: TableSizeService,
    private columnsService: ColumnsService,
    private ngZone: NgZone,
    private keyNavigation: KeyNavigationGridController,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.subscriptions.push(
      organizer.filterRenderSteps(DatagridRenderStep.COMPUTE_COLUMN_WIDTHS).subscribe(() => this.computeHeadersWidth())
    );

    this.subscriptions.push(
      page.sizeChange.subscribe(() => {
        if (this._heightSet) {
          this.resetDatagridHeight();
        }
      })
    );
    this.subscriptions.push(detailService.stateChange.subscribe(state => this.toggleDetailPane(state)));
    this.subscriptions.push(items.change.subscribe(() => (this.shouldStabilizeColumns = true)));
  }

  ngOnInit() {
    this.columnsService.columnsStateChange.subscribe(change => this.columnStateChanged(change));
    // Datagrid used in other components like Accordion, Tabs or wrapped in onPush component which have their content
    // hidden by default gets initialised without being visible and breakes rendering cycle.
    // Should run only the first time if the datagrid is not visible on first initialization.
    if (this.el.nativeElement.offsetParent === null) {
      this.intersectionObserver = new IntersectionObserver(([entry]) => {
        if ((this.el.nativeElement.offsetParent || entry.isIntersecting) && this.columnsSizesStable) {
          this.columnsSizesStable = false;
          this.changeDetectorRef.markForCheck();
          this.intersectionObserver.disconnect();
        }
      });
      this.intersectionObserver.observe(this.el.nativeElement);
    }
  }

  ngAfterContentInit() {
    this.setupColumns();

    this.subscriptions.push(
      this.headers.changes.subscribe(() => {
        // TODO: only re-stabilize if a column was added or removed. Reordering is fine.
        // Need to setup columns before stabalizing them
        this.setupColumns();
        this.columnsSizesStable = false;
        this.stabilizeColumns();
      })
    );
  }

  // Initialize and set Table width for horizontal scrolling here.
  ngAfterViewInit() {
    this.tableSizeService.table = this.el;
  }

  ngAfterViewChecked() {
    if (this.shouldStabilizeColumns) {
      this.stabilizeColumns();
    }

    if (this.shouldComputeHeight()) {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.computeDatagridHeight();
        });
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.intersectionObserver?.disconnect();
  }

  toggleDetailPane(state: boolean) {
    if (this.headers) {
      if (state && !this.columnsService.hasCache()) {
        this.columnsService.cache();
        this.columnsService.visibleColumns.forEach((header, index) => {
          if (index > 0) {
            this.columnsService.emitStateChangeAt(header.columnIndex, {
              changes: [DatagridColumnChanges.HIDDEN],
              hidden: state,
            });
          }
        });
      } else if (!state) {
        this.columnsService.resetToLastCache();
      }
    }
  }

  private setupColumns() {
    this.headers.forEach((header, index) => header.setColumnState(index));
    this.columnsService.columns.splice(this.headers.length); // Trim any old columns
    // Sets columnIndex for each column
    this.columnsService.columns.forEach((column, index) => {
      this.columnsService.emitStateChange(column, { changes: [DatagridColumnChanges.INITIALIZE], columnIndex: index });
    });
  }

  private shouldComputeHeight(): boolean {
    if (!this._heightSet && this.page.size > 0) {
      if (this.items.displayed.length === this.page.size) {
        return true;
      }
    }
    return false;
  }

  /**
   * Computes the height of the datagrid.
   *
   * NOTE: We had to choose to set the height instead of the min-height because
   * IE 11 requires the height on the parent for the children flex grow/shrink properties to work.
   * When we used min-height, 1 1 auto doesn't used to work in IE11 :-(
   * But this doesn't affect the fix. It works in both fixed & variable height datagrids.
   *
   * Refer: http://stackoverflow.com/questions/24396205/flex-grow-not-working-in-internet-explorer-11-0
   */
  private computeDatagridHeight() {
    const height = window.getComputedStyle(this.el.nativeElement).height;
    this.renderer.setStyle(this.el.nativeElement, 'height', height);
    this._heightSet = true;
  }

  private resetDatagridHeight() {
    this.renderer.setStyle(this.el.nativeElement, 'height', '');
    this._heightSet = false;
  }

  /**
   * Makes each header compute its width.
   */
  private computeHeadersWidth() {
    const nbColumns: number = this.headers.length;
    const headerWidths = this.headers.map(header => {
      return header.getColumnWidthState();
    });
    let allStrict = true;
    this.headers.forEach((header, index) => {
      // On the last header column check whether all columns have strict widths.
      // If all columns have strict widths, remove the strict width from the last column and make it the column's
      // minimum width so that when all previous columns shrink, it will get a flexible width and cover the empty
      // gap in the Datagrid.
      const state: ColumnStateDiff = {
        changes: [DatagridColumnChanges.WIDTH],
        ...headerWidths[index],
      };

      if (!state.strictWidth) {
        allStrict = false;
      }

      if (nbColumns === index + 1 && allStrict) {
        state.strictWidth = 0;
      }

      this.columnsService.emitStateChangeAt(index, state);
    });
  }

  private columnStateChanged(state: ColumnState) {
    // eslint-disable-next-line eqeqeq
    if (!this.headers || state.columnIndex == null) {
      return;
    }
    const columnIndex = state.columnIndex;
    if (state.changes && state.changes.length) {
      state.changes.forEach(change => {
        switch (change) {
          case DatagridColumnChanges.WIDTH:
            this.headers.get(columnIndex).setWidth(state);
            this.rows.forEach(row => {
              if (row?.cells.length === this.columnsService.columns.length) {
                row.cells.get(columnIndex).setWidth(state);
                row.expandableRows.forEach(expandableRow => {
                  expandableRow.cells.get(columnIndex)?.setWidth(state);
                });
              }
            });
            break;
          case DatagridColumnChanges.HIDDEN:
            this.headers.get(columnIndex).setHidden(state);
            this.rows.forEach(row => {
              if (row.cells && row.cells.length) {
                row.cells.get(columnIndex).setHidden(state);

                row.expandableRows.forEach(expandableRow => {
                  expandableRow.cells.get(columnIndex)?.setHidden(state);
                });
              }
            });
            this.updateColumnSeparatorsVisibility();
            this.keyNavigation.resetKeyGrid();
            break;
          case DatagridColumnChanges.INITIALIZE:
            if (state.hideable && state.hidden) {
              this.headers.get(columnIndex).setHidden(state);
              this.rows.forEach(row => {
                row.setCellsState();
                row.expandableRows.forEach(expandableRow => {
                  expandableRow.setCellsState();
                });
              });
            }
            break;
          default:
            break;
        }
      });
    }
  }

  /**
   * Triggers a whole re-rendring cycle to set column sizes, if needed.
   */
  private stabilizeColumns() {
    if (this.columnsSizesStable) {
      // Nothing to do.
      return;
    }
    // Resize when the rows are loaded.
    if (this.items.displayed.length > 0) {
      this.organizer.resize();
      this.columnsSizesStable = true;
    }
  }

  private updateColumnSeparatorsVisibility() {
    const visibleColumns = this.datagrid.columns.filter(column => !column.isHidden);
    visibleColumns.forEach((column, index) => {
      if (index === visibleColumns.length - 1) {
        column.showSeparator = false;
      } else if (!column.showSeparator) {
        column.showSeparator = true;
      }
    });
  }
}

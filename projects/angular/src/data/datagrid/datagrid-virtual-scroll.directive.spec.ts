/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, Observable } from 'rxjs';

import { ClrDatagridVirtualScrollDirective } from './datagrid-virtual-scroll.directive';
import { DATAGRID_SPEC_PROVIDERS } from './helpers.spec';
import { ClarityModule } from '../../clr-angular.module';
import { ClrDatagridVirtualScrollRangeInterface } from './interfaces/virtual-scroll-data-range.interface';
import { Keys } from '../../utils/enums/keys.enum';
import { delay, expectActiveElementToBe } from '../../utils/testing/helpers.spec';

export interface Column {
  index: number;
  name: string;
}

export interface Row {
  index: number;
  cells: Cells;
}

export interface Cells {
  [key: string]: string;
}

@Component({
  template: `
    @if ({ rows: rows | async }; as data) {
      <clr-datagrid [(clrDgSelected)]="selectedRows" style="height: 32rem" class="datagrid-compact">
        @for (col of cols; track colByIndex($index, col)) {
          <clr-dg-column>
            <ng-container>{{ col.name }}</ng-container>
          </clr-dg-column>
        }
        @if (data.rows; as row) {
          <ng-template
            clrVirtualScroll
            let-row
            [clrVirtualRowsOf]="data.rows"
            [clrVirtualDataRange]="dataRange"
            [clrVirtualPersistItems]="persistItems"
            [clrVirtualRowsItemSize]="24"
            [clrVirtualRowsMinBufferPx]="200"
            [clrVirtualRowsMaxBufferPx]="400"
            [clrVirtualRowsTemplateCacheSize]="4000"
            [clrVirtualRowsTrackBy]="rowByIndex"
          >
            <clr-dg-row [clrDgItem]="row">
              @for (col of cols; track colByIndex($index, col)) {
                <clr-dg-cell>{{ row?.cells[col.name] }}</clr-dg-cell>
              }
              <ng-container ngProjectAs="clr-dg-row-detail">
                <clr-dg-row-detail *clrIfExpanded>
                  {{ row | json }}
                </clr-dg-row-detail>
              </ng-container>
            </clr-dg-row>
          </ng-template>
        }
        <clr-dg-footer> {{ data.rows.length }} </clr-dg-footer>
      </clr-datagrid>
    }
  `,
  standalone: false,
})
class FullTest implements OnInit {
  @ViewChild(ClrDatagridVirtualScrollDirective) virtualScroll: ClrDatagridVirtualScrollDirective<any>;
  _totalRows = 1000;
  dataRange: ClrDatagridVirtualScrollRangeInterface<Row> | undefined;

  persistItems = true;
  rows: Observable<Row[]>;
  cols: Column[] = [];
  selectedRows: Row[] = [];

  private allRows = new BehaviorSubject<Row[]>([]);

  constructor(private cdr: ChangeDetectorRef) {
    this.rows = this.allRows.asObservable();
    this.cols = this.createColumns();
  }

  get totalRows(): number {
    return this._totalRows;
  }
  set totalRows(value: number) {
    this._totalRows = value;

    this.dataRange = {
      total: this.totalRows,
      skip: 0,
      data: [],
    };

    this.cdr.detectChanges();
  }

  updateDataRange(value: { total: number; skip: number; data: Row[] }) {
    this.dataRange = value;
  }

  ngOnInit(): void {
    this.allRows.next(this.createRows(this.cols, this.totalRows));

    this.rows.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  createColumns(count = 10) {
    const columns: Column[] = [];
    for (let i = 0; i < count; i++) {
      columns.push({
        index: i,
        name: `col${i + 1}`,
      });
    }

    return columns;
  }

  createRows(columns: Column[], rowCount: number) {
    const rows: Row[] = [];
    for (let i = 0; i < rowCount; i++) {
      const newRow: Row = {
        index: i,
        cells: {} as Cells,
      };
      for (let j = 0; j < columns.length; j++) {
        newRow.cells[columns[j].name] = `${columns[j].name} row-${i + 1}`;
      }
      rows.push(newRow);
    }

    return rows;
  }

  colByIndex(index: number, col: Column) {
    return col.index;
  }

  rowByIndex(index: number, row: Row) {
    return row?.index;
  }
}

export default function (): void {
  describe('ClrDatagrid virtual scroller', function () {
    async function finishInit(fixture: ComponentFixture<any>) {
      // On the first cycle we render and measure the viewport.
      fixture.detectChanges();
      await delay();

      // On the second cycle we render the items.
      fixture.detectChanges();
      await delay();

      // Flush the initial fake scroll event.
      // animationFrameScheduler.flush();
      await delay();
      fixture.detectChanges();
    }
    async function waitRequiredCycles(fixture: ComponentFixture<any>) {
      await delay();
      await fixture.whenStable();
      await fixture.whenRenderingDone();
      fixture.detectChanges();
    }

    describe('Typescript API', function () {
      let fixture: ComponentFixture<any>;
      let compiled: any;
      let instance: any;

      beforeEach(async function () {
        await TestBed.configureTestingModule({
          imports: [ClarityModule, NoopAnimationsModule],
          declarations: [FullTest, ClrDatagridVirtualScrollDirective],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: DATAGRID_SPEC_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(FullTest);

        compiled = fixture.nativeElement;
        instance = fixture.componentInstance;
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('allows to manually force a refresh of displayed items when data mutates', function () {
        fixture.detectChanges();

        expect(instance.virtualScroll.items.all.length).toBe(1000);

        expect(instance.virtualScroll.maxBufferPx).toBe(400);
        instance.virtualScroll.maxBufferPx = 600;
        expect(instance.virtualScroll.maxBufferPx).toBe(600);

        expect(instance.virtualScroll.minBufferPx).toBe(200);
        instance.virtualScroll.minBufferPx = 300;
        expect(instance.virtualScroll.minBufferPx).toBe(300);

        expect(instance.virtualScroll.itemSize).toBe(24);
        instance.virtualScroll.itemSize = 20;
        expect(instance.virtualScroll.itemSize).toBe(20);

        expect(instance.virtualScroll.cdkVirtualForTemplateCacheSize).toBe(4000);
        instance.virtualScroll.cdkVirtualForTemplateCacheSize = 5000;
        expect(instance.virtualScroll.cdkVirtualForTemplateCacheSize).toBe(5000);

        expect(instance.virtualScroll.totalItems).toBeUndefined();
        instance.totalRows = 5000;
        fixture.detectChanges();
        expect(instance.virtualScroll.totalItems).toBe(5000);

        expect(instance.virtualScroll.persistItems).toBe(true);
        instance.persistItems = false;
        fixture.detectChanges();
        expect(instance.virtualScroll.persistItems).toBe(false);

        fixture.destroy();
      });

      it('Spy on Scroll to index', async () => {
        fixture.detectChanges();
        const spyVirtualScroll = spyOn(instance.virtualScroll, 'scrollToIndex');

        instance.virtualScroll.scrollToIndex(300);
        fixture.detectChanges();
        expect(spyVirtualScroll).toHaveBeenCalledWith(300);

        instance.virtualScroll.scrollToIndex(0);
        fixture.detectChanges();
        expect(spyVirtualScroll).toHaveBeenCalledWith(0);

        fixture.destroy();
      });

      it('Spy on update data range', async () => {
        fixture.detectChanges();
        const spyVirtualScroll = spyOn(instance.virtualScroll, 'updateDataRange');

        let dataRange = {
          total: 500,
          skip: 100,
          data: Array(100),
        };

        instance.updateDataRange(dataRange);
        fixture.detectChanges();
        expect(spyVirtualScroll).toHaveBeenCalledWith(dataRange.skip, dataRange.data);

        dataRange = {
          total: 1000,
          skip: 500,
          data: Array(200),
        };

        instance.updateDataRange(dataRange);
        fixture.detectChanges();
        expect(spyVirtualScroll).toHaveBeenCalledWith(dataRange.skip, dataRange.data);

        fixture.destroy();
      });

      it('Moves focus on PageDown and PageUp', async () => {
        await finishInit(fixture);
        fixture.autoDetectChanges();
        await waitRequiredCycles(fixture);
        const grid = compiled.querySelector('[role=grid]');
        // need to start with this cell exactly, because it has tabindex=0
        const headerCheckboxCell = grid.querySelector('[role=columnheader].datagrid-select');
        headerCheckboxCell.focus();
        await waitRequiredCycles(fixture);
        expectActiveElementToBe(headerCheckboxCell);
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        await waitRequiredCycles(fixture);
        // Row 15
        expectActiveElementToBe(grid.querySelectorAll('[type=checkbox]')[9], 'PageDown, cells[9]');
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        await waitRequiredCycles(fixture);

        // Row 29
        expectActiveElementToBe(grid.querySelectorAll('[type=checkbox]')[9], 'PageDown, cells[9]');
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        await waitRequiredCycles(fixture);

        // Row 20
        expectActiveElementToBe(grid.querySelectorAll('[type=checkbox]')[17], 'PageUp, cells[17]');
        fixture.changeDetectorRef.detach();
      });
    });
  });
}

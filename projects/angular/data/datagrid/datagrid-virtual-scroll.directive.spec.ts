/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directionality } from '@angular/cdk/bidi';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { delay, expectActiveElementToBe } from '@clr/angular/testing';
import { Keys } from '@clr/angular/utils';
import { renderFixture } from '@clr/angular/utils/testing';
import { BehaviorSubject, Observable } from 'rxjs';

import { ClrDatagridVirtualScrollDirective } from './datagrid-virtual-scroll.directive';
import { DATAGRID_SPEC_PROVIDERS } from './helpers.mock';
import { ClarityModule } from '../../clr-angular.module';
import { ClrDatagridVirtualScrollRangeInterface } from './interfaces/virtual-scroll-data-range.interface';

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
      <clr-datagrid
        [(clrDgSelected)]="selectedRows"
        [clrDgSelectionType]="'multi'"
        style="height: 32rem"
        clr-density="compact"
      >
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
            [clrVirtualRowsItemSize]="25"
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
  changeDetection: ChangeDetectionStrategy.Eager,
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

@Component({
  template: `
    <div [attr.clr-density]="wrapperDensity">
      <clr-datagrid [attr.clr-density]="gridDensity" style="height: 20rem">
        <clr-dg-column>Index</clr-dg-column>
        <ng-template clrVirtualScroll let-row [clrVirtualRowsOf]="rows">
          <clr-dg-row [clrDgItem]="row">
            <clr-dg-cell>{{ row }}</clr-dg-cell>
          </clr-dg-row>
        </ng-template>
      </clr-datagrid>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class DensityTest {
  @ViewChild(ClrDatagridVirtualScrollDirective) virtualScroll: ClrDatagridVirtualScrollDirective<number>;
  wrapperDensity: string | null = null;
  gridDensity: string | null = null;
  rows = Array.from({ length: 100 }, (_, index) => index);
}

@Component({
  template: `
    <clr-datagrid clr-density="compact" style="height: 20rem">
      <clr-dg-column>Index</clr-dg-column>
      <ng-template clrVirtualScroll let-row [clrVirtualRowsOf]="rows" [clrVirtualRowsItemSize]="40">
        <clr-dg-row [clrDgItem]="row">
          <clr-dg-cell>{{ row }}</clr-dg-cell>
        </clr-dg-row>
      </ng-template>
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class DensityWithItemSizeTest {
  @ViewChild(ClrDatagridVirtualScrollDirective) virtualScroll: ClrDatagridVirtualScrollDirective<number>;
  rows = Array.from({ length: 100 }, (_, index) => index);
}

// Row height = `--clr-table-cell-height` + `--clr-table-borderwidth` of the density, in px.
const DEFAULT_ROW_HEIGHT = 33;
const COMPACT_ROW_HEIGHT = 25;

describe('Datagrid', () => {
  describe('Components', () => {
    describe('ClrDatagrid virtual scroller', function () {
      async function finishInit(fixture: ComponentFixture<any>) {
        // On the first cycle we render and measure the viewport.
        renderFixture(fixture);
        await delay();

        // On the second cycle we render the items.
        renderFixture(fixture);
        await delay();

        // Flush the initial fake scroll event.
        // animationFrameScheduler.flush();
        await delay();
        renderFixture(fixture);
      }
      async function waitRequiredCycles(fixture: ComponentFixture<any>) {
        await delay(500);
        await fixture.whenStable();
        await fixture.whenRenderingDone();
        renderFixture(fixture);
      }

      describe('Row height from density', function () {
        function create<C>(component: new (...args: any[]) => C, setup?: (instance: C) => void) {
          TestBed.configureTestingModule({
            imports: [ClarityModule],
            declarations: [component, ClrDatagridVirtualScrollDirective],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: DATAGRID_SPEC_PROVIDERS,
          });
          const fixture = TestBed.createComponent(component);
          setup?.(fixture.componentInstance);
          renderFixture(fixture);
          return fixture;
        }

        it('uses the default row height when no clr-density is set', () => {
          const fixture = create(DensityTest);
          expect(fixture.componentInstance.virtualScroll.itemSize).toBe(DEFAULT_ROW_HEIGHT);
          fixture.destroy();
        });

        it('uses the compact row height when clr-density is set on the datagrid', () => {
          const fixture = create(DensityTest, instance => (instance.gridDensity = 'compact'));
          expect(fixture.componentInstance.virtualScroll.itemSize).toBe(COMPACT_ROW_HEIGHT);
          fixture.destroy();
        });

        it('uses the compact row height when clr-density is set on an ancestor', () => {
          const fixture = create(DensityTest, instance => (instance.wrapperDensity = 'compact'));
          expect(fixture.componentInstance.virtualScroll.itemSize).toBe(COMPACT_ROW_HEIGHT);
          fixture.destroy();
        });

        it('keeps a provided clrVirtualRowsItemSize', () => {
          const fixture = create(DensityWithItemSizeTest);
          expect(fixture.componentInstance.virtualScroll.itemSize).toBe(40);
          fixture.destroy();
        });
      });

      describe('Typescript API', function () {
        let fixture: ComponentFixture<any>;
        let compiled: any;
        let instance: any;

        beforeEach(async function () {
          await TestBed.configureTestingModule({
            imports: [ClarityModule],
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

        it('leaves the application-wide CDK services alone when the datagrid is destroyed', async function () {
          // The viewport is built from a hand-made injector. Anything that injector hands out and
          // that has an `ngOnDestroy` is destroyed with it, so the application's own ScrollDispatcher
          // and ViewportRuler must not be reachable through it - completing them would stop scroll
          // and resize notification for every CDK overlay in the application, and completing
          // Directionality would stop text-direction changes from reaching them.
          const scrollDispatcher = TestBed.inject(ScrollDispatcher);
          const viewportRuler = TestBed.inject(ViewportRuler);
          const directionality = TestBed.inject(Directionality);
          let scrolledCompleted = false;
          let viewportChangeCompleted = false;
          let directionChangeCompleted = false;
          scrollDispatcher.scrolled(0).subscribe({ complete: () => (scrolledCompleted = true) });
          viewportRuler.change(0).subscribe({ complete: () => (viewportChangeCompleted = true) });
          directionality.change.subscribe({ complete: () => (directionChangeCompleted = true) });

          await finishInit(fixture);
          fixture.destroy();

          expect(scrolledCompleted, 'ScrollDispatcher.scrolled() completed').toBe(false);
          expect(viewportChangeCompleted, 'ViewportRuler.change() completed').toBe(false);
          expect(directionChangeCompleted, 'Directionality.change completed').toBe(false);
        });

        it('tears the virtual-for down before the viewport it reads from', async function () {
          await finishInit(fixture);

          const cdk = instance.virtualScroll as unknown as {
            cdkVirtualFor: {
              ngOnDestroy(): void;
            };
            virtualScrollViewport: {
              ngOnDestroy(): void;
            };
          };
          const teardownOrder: string[] = [];
          // Record the order but still run the real teardown, so the instances are really torn down.
          const recordTeardown = (
            name: string,
            instance: {
              ngOnDestroy(): void;
            }
          ) => {
            const ngOnDestroy = instance.ngOnDestroy.bind(instance);
            vi.spyOn(instance, 'ngOnDestroy').mockImplementation(() => {
              teardownOrder.push(name);
              ngOnDestroy();
            });
          };
          recordTeardown('cdkVirtualFor', cdk.cdkVirtualFor);
          recordTeardown('viewport', cdk.virtualScrollViewport);

          fixture.destroy();

          expect(teardownOrder).toEqual(['cdkVirtualFor', 'viewport']);
        });

        it('releases the effect the viewport keeps on the application injector when destroyed', async function () {
          // `CdkVirtualScrollViewport` creates an effect on the application injector and only destroys
          // it through the `DestroyRef` of the injector it was created from. While that effect lives it
          // retains the viewport and, through it, the whole datagrid view tree.
          await finishInit(fixture);

          const viewport = (
            instance.virtualScroll as unknown as {
              virtualScrollViewport: {
                _changeDetectionNeeded: {
                  set(value: boolean): void;
                };
                _doChangeDetection(): void;
              };
            }
          ).virtualScrollViewport;
          const doChangeDetection = vi.spyOn(viewport, '_doChangeDetection');
          const triggerViewportEffect = () => {
            viewport._changeDetectionNeeded.set(false);
            TestBed.tick();
            doChangeDetection.mockClear();
            viewport._changeDetectionNeeded.set(true);
            TestBed.tick();
          };

          triggerViewportEffect();
          expect(doChangeDetection, 'effect runs while the datagrid is alive').toHaveBeenCalled();

          fixture.destroy();

          triggerViewportEffect();
          expect(doChangeDetection, 'effect runs after the datagrid is destroyed').not.toHaveBeenCalled();
        });

        it('allows to manually force a refresh of displayed items when data mutates', function () {
          renderFixture(fixture);

          expect(instance.virtualScroll.items.all.length).toBe(1000);

          expect(instance.virtualScroll.maxBufferPx).toBe(400);
          instance.virtualScroll.maxBufferPx = 600;
          expect(instance.virtualScroll.maxBufferPx).toBe(600);

          expect(instance.virtualScroll.minBufferPx).toBe(200);
          instance.virtualScroll.minBufferPx = 300;
          expect(instance.virtualScroll.minBufferPx).toBe(300);

          expect(instance.virtualScroll.itemSize).toBe(25);
          instance.virtualScroll.itemSize = 20;
          expect(instance.virtualScroll.itemSize).toBe(20);

          expect(instance.virtualScroll.cdkVirtualForTemplateCacheSize).toBe(4000);
          instance.virtualScroll.cdkVirtualForTemplateCacheSize = 5000;
          expect(instance.virtualScroll.cdkVirtualForTemplateCacheSize).toBe(5000);

          expect(instance.virtualScroll.totalItems).toBeUndefined();
          instance.totalRows = 5000;
          renderFixture(fixture);
          expect(instance.virtualScroll.totalItems).toBe(5000);

          expect(instance.virtualScroll.persistItems).toBe(true);
          instance.persistItems = false;
          renderFixture(fixture);
          expect(instance.virtualScroll.persistItems).toBe(false);

          fixture.destroy();
        });

        it('Spy on Scroll to index', async () => {
          renderFixture(fixture);
          const spyVirtualScroll = vi
            .spyOn(instance.virtualScroll, 'scrollToIndex')
            .mockImplementation(() => undefined);

          instance.virtualScroll.scrollToIndex(300);
          renderFixture(fixture);
          expect(spyVirtualScroll).toHaveBeenCalledWith(300);

          instance.virtualScroll.scrollToIndex(0);
          renderFixture(fixture);
          expect(spyVirtualScroll).toHaveBeenCalledWith(0);

          fixture.destroy();
        });

        it('Spy on update data range', async () => {
          renderFixture(fixture);
          const spyVirtualScroll = vi
            .spyOn(instance.virtualScroll, 'updateDataRange')
            .mockImplementation(() => undefined);

          let dataRange = {
            total: 500,
            skip: 100,
            data: Array(100),
          };

          instance.updateDataRange(dataRange);
          renderFixture(fixture);
          expect(spyVirtualScroll).toHaveBeenCalledWith(dataRange.skip, dataRange.data);

          dataRange = {
            total: 1000,
            skip: 500,
            data: Array(200),
          };

          instance.updateDataRange(dataRange);
          renderFixture(fixture);
          expect(spyVirtualScroll).toHaveBeenCalledWith(dataRange.skip, dataRange.data);

          fixture.destroy();
        });

        it('accepts a data range too large to spread into function arguments', () => {
          renderFixture(fixture);
          const data = Array.from({ length: 200_000 }, (_, index) => ({ index }));

          expect(() => instance.updateDataRange({ total: data.length, skip: 0, data })).not.toThrow();
          expect(() => renderFixture(fixture)).not.toThrow();
          expect(instance.virtualScroll.cdkVirtualForOf.length).toBe(data.length);
          expect(instance.virtualScroll.cdkVirtualForOf[199_999]).toBe(data[199_999]);
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
          // Row 14
          expectActiveElementToBe(grid.querySelectorAll('[type=checkbox]')[8], 'PageDown, cells[8], Row 14');
          grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
          await waitRequiredCycles(fixture);

          // Row 28
          expectActiveElementToBe(grid.querySelectorAll('[type=checkbox]')[8], 'PageDown, cells[8], Row 28');
          grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
          await waitRequiredCycles(fixture);

          // Row 19
          expectActiveElementToBe(grid.querySelectorAll('[type=checkbox]')[16], 'PageUp, cells[16], Row 19');
          fixture.changeDetectorRef.detach();
        });
      });
    });
  });
});

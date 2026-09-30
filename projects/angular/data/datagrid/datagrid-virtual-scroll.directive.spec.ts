/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directionality } from '@angular/cdk/bidi';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { delay, expectActiveElementToBe } from '@clr/angular/testing';
import { Keys } from '@clr/angular/utils';
import { BehaviorSubject, Observable } from 'rxjs';

import { ClrDatagridVirtualScrollDirective } from './datagrid-virtual-scroll.directive';
import { DATAGRID_SPEC_PROVIDERS } from './helpers.spec';
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
        class="datagrid-compact"
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
      await delay(500);
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

        expect(scrolledCompleted).withContext('ScrollDispatcher.scrolled() completed').toBe(false);
        expect(viewportChangeCompleted).withContext('ViewportRuler.change() completed').toBe(false);
        expect(directionChangeCompleted).withContext('Directionality.change completed').toBe(false);
      });

      it('tears the virtual-for down before the viewport it reads from', async function () {
        await finishInit(fixture);

        const cdk = instance.virtualScroll as unknown as {
          cdkVirtualFor: { ngOnDestroy(): void };
          virtualScrollViewport: { ngOnDestroy(): void };
        };
        const teardownOrder: string[] = [];
        // Record the order but still run the real teardown, so the instances are really torn down.
        const recordTeardown = (name: string, instance: { ngOnDestroy(): void }) => {
          const ngOnDestroy = instance.ngOnDestroy.bind(instance);
          spyOn(instance, 'ngOnDestroy').and.callFake(() => {
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
              _changeDetectionNeeded: { set(value: boolean): void };
              _doChangeDetection(): void;
            };
          }
        ).virtualScrollViewport;
        const doChangeDetection = spyOn(viewport, '_doChangeDetection').and.callThrough();
        const triggerViewportEffect = () => {
          viewport._changeDetectionNeeded.set(false);
          TestBed.tick();
          doChangeDetection.calls.reset();
          viewport._changeDetectionNeeded.set(true);
          TestBed.tick();
        };

        triggerViewportEffect();
        expect(doChangeDetection).withContext('effect runs while the datagrid is alive').toHaveBeenCalled();

        fixture.destroy();

        triggerViewportEffect();
        expect(doChangeDetection).withContext('effect runs after the datagrid is destroyed').not.toHaveBeenCalled();
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

        expect(instance.virtualScroll.itemSize).toBe(25);
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
}

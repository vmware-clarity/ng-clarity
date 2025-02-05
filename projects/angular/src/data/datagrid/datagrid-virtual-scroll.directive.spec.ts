/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { animationFrameScheduler, BehaviorSubject, Observable } from 'rxjs';

import { ClarityModule } from '../../clr-angular.module';
import { Keys } from '../../utils/enums/keys.enum';
import { ClrDatagridVirtualScrollDirective } from './datagrid-virtual-scroll.directive';
import { DATAGRID_SPEC_PROVIDERS } from './helpers.spec';

export interface Column {
  index: number;
  name: string;
}

export interface Row {
  index: number;
  expanded: boolean;
  cells: Cells;
}

export interface Cells {
  [key: string]: string;
}

@Component({
  template: `
    <clr-datagrid
      [(clrDgSelected)]="selectedRows"
      *ngIf="{ rows: rows | async }; let data"
      style="height: 32rem"
      class="datagrid-compact"
    >
      <clr-dg-column *ngFor="let col of cols; trackBy: colByIndex">
        <ng-container>{{ col.name }}</ng-container>
      </clr-dg-column>

      <ng-template
        *ngIf="data.rows"
        clrVirtualScroll
        let-row
        [clrVirtualRowsOf]="data.rows"
        [clrVirtualRowsItemSize]="24"
        [clrVirtualRowsMinBufferPx]="200"
        [clrVirtualRowsMaxBufferPx]="400"
        [clrVirtualRowsTemplateCacheSize]="4000"
        [clrVirtualRowsTrackBy]="rowByIndex"
      >
        <clr-dg-row [clrDgItem]="row">
          <clr-dg-cell *ngFor="let col of cols; trackBy: colByIndex">{{ row.cells[col.name] }}</clr-dg-cell>
          <ng-container ngProjectAs="clr-dg-row-detail">
            <clr-dg-row-detail [clrIfExpanded]="row.expanded" (clrIfExpandedChange)="setExpanded($event, row)">
              {{ row | json }}
            </clr-dg-row-detail>
          </ng-container>
        </clr-dg-row>
      </ng-template>

      <clr-dg-footer> {{ data.rows.length }} </clr-dg-footer>
    </clr-datagrid>
  `,
})
class FullTest implements OnInit {
  @ViewChild(ClrDatagridVirtualScrollDirective) virtualScroll: ClrDatagridVirtualScrollDirective<any>;
  rows: Observable<Row[]>;
  cols: Column[] = [];
  selectedRows: Row[] = [];

  private allRows = new BehaviorSubject<Row[]>([]);

  constructor(private cdr: ChangeDetectorRef) {
    this.rows = this.allRows.asObservable();
    this.cols = this.createColumns();
  }

  ngOnInit(): void {
    this.allRows.next(this.createRows(this.cols));

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

  createRows(columns: Column[], rowCount = 1000) {
    const rows: Row[] = [];
    for (let i = 0; i < rowCount; i++) {
      const newRow: Row = {
        index: i,
        cells: {} as Cells,
        expanded: false,
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
    return row.index;
  }

  setExpanded($event: boolean, item: Row) {
    item.expanded = $event;
  }
}

export default function (): void {
  describe('ClrDatagrid virtual scroller', function () {
    function sleep(millisecondsToWait = 100) {
      return new Promise(resolve => setTimeout(resolve, millisecondsToWait));
    }

    function finishInit(fixture: ComponentFixture<any>) {
      // On the first cycle we render and measure the viewport.
      fixture.detectChanges();
      flush();

      // On the second cycle we render the items.
      fixture.detectChanges();
      flush();

      // Flush the initial fake scroll event.
      animationFrameScheduler.flush();
      flush();
      fixture.detectChanges();
      discardPeriodicTasks();
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

        fixture.destroy();
      });

      it('Moves focus on PageDown and PageUp', fakeAsync(() => {
        finishInit(fixture);
        fixture.autoDetectChanges();
        fixture.whenStable();
        fixture.whenRenderingDone();

        const grid = compiled.querySelector('[role=grid]');

        // need to start with this cell exactly, because it has tabindex=0
        const headerCheckboxCell = grid.querySelector('[role=columnheader].datagrid-select');
        headerCheckboxCell.focus();
        sleep(10);
        fixture.detectChanges();

        expect(document.activeElement).toBe(headerCheckboxCell);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        // active checkbox input with ID clr-dg-row-cb364
        expect(document.activeElement).toBe(grid.querySelectorAll('[type=checkbox]')[22]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        sleep();
        fixture.whenStable();
        fixture.whenRenderingDone();
        // active checkbox input with ID clr-dg-row-cb383
        expect(document.activeElement).toBe(grid.querySelectorAll('[type=checkbox]')[41]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        sleep();
        fixture.whenStable();
        fixture.whenRenderingDone();
        // active checkbox input with ID clr-dg-row-cb360
        expect(document.activeElement).toBe(grid.querySelectorAll('[type=checkbox]')[19]);

        flush();
        flushMicrotasks();
        discardPeriodicTasks();

        fixture.autoDetectChanges(false);
        fixture.destroy();
      }));

      // it('allows to manually resize the datagrid', function () {
      //   const organizer: DatagridRenderOrganizer = context.getClarityProvider(DatagridRenderOrganizer);
      //   let resizeSteps = 0;
      //   organizer.renderStep.subscribe(() => {
      //     resizeSteps++;
      //   });
      //   expect(resizeSteps).toBe(0);
      //   context.clarityDirective.resize();
      //   expect(resizeSteps).toBe(5);
      // });
    });
  });
}

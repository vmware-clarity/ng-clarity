/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { animationFrameScheduler, BehaviorSubject, Observable } from 'rxjs';

import { ClarityModule } from '../../clr-angular.module';
import { CustomClrVirtualRowsDirective } from './datagrid-virtual-scroll.direcive';
import { DATAGRID_SPEC_PROVIDERS } from './helpers.spec';

export interface Column {
  index: number;
  name: string;
}

export interface Row {
  index: number;
  expanded: boolean;
  cells: any[];
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
        customClrVirtualRows
        let-row
        [customClrVirtualRowsOf]="data.rows"
        [customClrVirtualRowsItemSize]="24"
        [customClrVirtualRowsMinBufferPx]="200"
        [customClrVirtualRowsMaxBufferPx]="400"
        [customClrVirtualRowsTemplateCacheSize]="4000"
        [customClrVirtualRowsTrackBy]="rowByIndex"
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
  @ViewChild(CustomClrVirtualRowsDirective) virtualScroll: CustomClrVirtualRowsDirective<any>;
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
        cells: [],
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
      // tick();
    }

    describe('Typescript API', function () {
      let fixture: ComponentFixture<any>;
      let compiled: any;
      let instance: any;

      beforeEach(async function () {
        await TestBed.configureTestingModule({
          imports: [ClarityModule, NoopAnimationsModule],
          declarations: [FullTest, CustomClrVirtualRowsDirective],
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
      });

      it('Moves focus on PageDown and PageUp', fakeAsync(function () {
        fixture.autoDetectChanges();
        finishInit(fixture);
        fixture.whenStable();
        fixture.detectChanges();
        tick();

        const grid = compiled.querySelector('[role=grid]');
        const cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();
        fixture.detectChanges();
        expect(document.activeElement).toEqual(cells[0]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { code: 'PageDown' }));
        fixture.detectChanges();
        console.log(1, document.activeElement);
        console.log(1, grid.querySelectorAll('[type=checkbox]')[22]);
        expect(document.activeElement).toEqual(grid.querySelectorAll('[type=checkbox]')[22]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { code: 'PageDown' }));
        fixture.detectChanges();
        console.log(2, document.activeElement);
        console.log(2, grid.querySelectorAll('[type=checkbox]')[41]);
        expect(document.activeElement).toEqual(grid.querySelectorAll('[type=checkbox]')[41]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { code: 'PageUp' }));
        fixture.detectChanges();
        console.log(3, document.activeElement);
        console.log(3, grid.querySelectorAll('[type=checkbox]')[19]);
        expect(document.activeElement).toEqual(grid.querySelectorAll('[type=checkbox]')[19]);

        // tick();
        // instance.virtualScroll.virtualScrollViewport.setRenderedRange({ start: 22, end: 74 } as ListRange);
        // fixture.detectChanges();
        // tick();
        // instance.virtualScroll.datagrid.dataChanged();
        // tick();
        // fixture.detectChanges();
        // tick();

        // grid.dispatchEvent(new KeyboardEvent('keydown', { code: 'PageDown' }));
        // fixture.detectChanges();
        // // tick()
        // expect(document.activeElement).toEqual(grid.querySelectorAll('[type=checkbox]')[23]);

        // grid.dispatchEvent(new KeyboardEvent('keydown', { code: 'PageUp' }));
        // fixture.detectChanges();
        // tick();
        // // console.log(4, document.activeElement);
        // // console.log(4, grid.querySelectorAll('[type=checkbox]')[1]);
        // expect(document.activeElement).toEqual(grid.querySelectorAll('[type=checkbox]')[1]);

        // console.log(5, grid.querySelectorAll('[type=checkbox]')[1]);
        // instance.virtualScroll.virtualScrollViewport.setRenderedRange({ start: 0, end: 42 } as ListRange);
        // console.log(5, grid.querySelectorAll('[type=checkbox]')[1]);
        // instance.virtualScroll.datagrid.dataChanged();
        // console.log(5, grid.querySelectorAll('[type=checkbox]')[1]);
        // fixture.detectChanges();
        // // console.log(5, grid.querySelectorAll('[type=checkbox]')[1]);
        // // tick();
        //
        // console.log(5, grid.querySelectorAll('[type=checkbox]')[1]);
        // grid.dispatchEvent(new KeyboardEvent('keydown', { code: 'PageUp' }));
        // console.log(5, grid.querySelectorAll('[type=checkbox]')[1]);
        // fixture.detectChanges();
        // console.log(5, grid.querySelectorAll('[type=checkbox]')[1]);
        // // tick();
        // console.log(5, document.activeElement);
        // console.log(5, grid.querySelectorAll('[type=checkbox]')[1]);
        // expect(document.activeElement).toEqual(grid.querySelectorAll('[type=checkbox]')[1]);

        fixture.autoDetectChanges(false);
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

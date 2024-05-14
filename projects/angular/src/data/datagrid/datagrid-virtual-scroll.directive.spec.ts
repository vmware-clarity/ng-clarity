/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ListRange } from '@angular/cdk/collections';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, Observable } from 'rxjs';

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
        (renderedRangeChange)="renderRangeChange($event)"
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
class FullTest implements AfterViewInit, OnInit {
  @ViewChild(CustomClrVirtualRowsDirective) virtualScroll: CustomClrVirtualRowsDirective<any>;
  rows: Observable<Row[]>;
  cols: Column[] = [];
  selectedRows: Row[] = [];

  private allRows = new BehaviorSubject<Row[]>([]);

  constructor() {
    this.rows = this.allRows.asObservable();
    this.cols = this.createColumns();
  }

  ngOnInit(): void {
    console.log('ngOnInit FullTest');
    this.allRows.next(this.createRows(this.cols));
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit FullTest');
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

  renderRangeChange($event: ListRange) {
    console.log($event);
  }

  setExpanded($event: boolean, item: Row) {
    item.expanded = $event;
  }
}

export default function (): void {
  describe('ClrDatagrid virtual scroller', function () {
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
        fixture.autoDetectChanges(true);
      });

      // afterEach(() => {
      //   fixture.destroy();
      // });

      it('allows to manually force a refresh of displayed items when data mutates', function () {
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

      it('Moves focus on PageDown and PageUp', function () {
        fixture.detectChanges();
        const grid = compiled.querySelector('[role=grid]');
        const cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        const checkboxes = grid.querySelectorAll('[type=checkbox]');

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();
        expect(document.activeElement).toEqual(cells[0]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { code: 'PageDown' }));
        expect(document.activeElement).toEqual(checkboxes[23]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { code: 'PageUp' }));
        expect(document.activeElement).toEqual(checkboxes[0]);
      });

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

/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { CustomClrVirtualRowsDirective } from './datagrid-virtual-scroll.direcive';
import { ClrDatagridModule } from './datagrid.module';

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
    <clr-datagrid [(clrDgSelected)]="selected" style="height: 32rem" class="datagrid-compact">
      <clr-dg-column *ngFor="let col of cols; trackBy: colByIndex">
        <ng-container>{{ col.name }}</ng-container>
      </clr-dg-column>
      s
      <ng-template
        customClrVirtualRows
        let-item
        [customClrVirtualRowsOf]="items"
        [customClrVirtualRowsItemSize]="24"
        [customClrVirtualRowsMinBufferPx]="200"
        [customClrVirtualRowsMaxBufferPx]="400"
        [customClrVirtualRowsTemplateCacheSize]="4000"
        [customClrVirtualRowsTrackBy]="rowByIndex"
      >
        <clr-dg-row [clrDgItem]="item">
          <clr-dg-cell *ngFor="let col of cols; trackBy: colByIndex">{{ item.cells[col.name] }}</clr-dg-cell>
          <ng-container ngProjectAs="clr-dg-row-detail">
            <clr-dg-row-detail [clrIfExpanded]="item.expanded" (clrIfExpandedChange)="setExpanded($event, item)">
              {{ item | json }}
            </clr-dg-row-detail>
          </ng-container>
        </clr-dg-row>
      </ng-template>

      <clr-dg-footer> {{ items.length }} </clr-dg-footer>
    </clr-datagrid>
  `,
})
class FullTest implements OnInit {
  @ViewChild(CustomClrVirtualRowsDirective) virtualScroll: CustomClrVirtualRowsDirective<any>;
  items: Row[] = [];
  cols: Column[] = [];
  selected: number[];

  ngOnInit(): void {
    this.cols = this.createColumns();
    this.items = this.createRows(this.cols);
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

describe('ClrDatagrid virtual scroller', function () {
  describe('Typescript API', function () {
    let fixture: ComponentFixture<any>;
    let compiled: any;
    let instance: any;

    beforeEach(function () {
      TestBed.configureTestingModule({
        imports: [ClrDatagridModule],
        declarations: [FullTest],
        providers: [CustomClrVirtualRowsDirective],
      });

      fixture = TestBed.createComponent(FullTest);
      fixture.detectChanges();
      compiled = fixture.nativeElement;
      instance = fixture.componentInstance;
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('allows to manually force a refresh of displayed items when data mutates', function () {
      expect(instance.items.length).toBe(1000);

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

    it('Moves focus on PageDown and PageUp', () => {
      tick(100);
      const grid = compiled.querySelector('[role=grid]');
      const cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
      cells[0].focus();
      fixture.detectChanges();
      console.log(grid);
      console.log(cells.length);
      expect(document.activeElement).toEqual(cells[0]);
      // console.log(document.activeElement)
      // grid.dispatchEvent(new KeyboardEvent('keydown', { code: 'PageDown' }));
      //
      // expect(document.activeElement).toEqual(cells[9].querySelector('[type=checkbox]'));
      // grid.dispatchEvent(new KeyboardEvent('keydown', { code: 'PageUp' }));
      // expect(document.activeElement).toEqual(cells[3].querySelector('[type=checkbox]'));

      // done();
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

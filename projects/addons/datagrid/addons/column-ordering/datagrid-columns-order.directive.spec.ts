/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GridHelper } from '@clr/addons/testing';
import { ClrDatagridModule } from '@clr/angular';

import { ColumnOrderChanged } from '../../interfaces/column-state';
import { ColumnDefinition } from '../../shared/column/column-definitions';
import { DatagridColumnsOrderDirective } from './datagrid-columns-order.directive';
import { DatagridColumnsOrderModule } from './datagrid-columns-order.module';
import { DatagridColumnsOrderService } from './datagrid-columns-order.service';

const firstName = 'First Name';

const columnDefsMock = [
  {
    displayName: 'Name',
    field: 'name',
    hidden: false,
  },
  {
    displayName: firstName,
    field: 'firstName',
    hidden: true,
  },
  {
    displayName: 'State',
    field: 'powerState',
    hidden: false,
  },
  {
    displayName: 'Options',
    field: 'option',
    hidden: true,
  },
  {
    displayName: 'Status',
    field: 'status',
    hidden: false,
  },
];

describe('DatagridColumnsOrderDirective', () => {
  let service: DatagridColumnsOrderService;
  let columns: ColumnDefinition<any>[];

  beforeEach(function (this: any) {
    TestBed.configureTestingModule({
      imports: [CommonModule, ClrDatagridModule, DragDropModule, NoopAnimationsModule, TestClrDatagridHostComponent],
    });
    columns = [];
    columnDefsMock.forEach(val => columns.push(Object.assign({}, val)));
    this.fixture = TestBed.createComponent(TestClrDatagridHostComponent);
    service = this.fixture.debugElement
      .query(By.directive(DatagridColumnsOrderDirective))
      .injector.get(DatagridColumnsOrderService);
    this.datagridHostComponent = this.fixture.componentInstance;
    this.datagridHostComponent.columns = columns;
  });

  describe('when moveVisibleColumn event is received for a column', () => {
    beforeEach(function (this: any) {
      this.fixture.detectChanges();
      service.grabbedColumn.next(this.datagridHostComponent.columns[1]);
    });

    it('it moves with one position left', function (this: any) {
      let gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getHeaders()[0]).toEqual('Name');
      expect(gridHelper.getHeaders()[1]).toEqual('State');

      service.moveVisibleColumn.next({ visibleColumnIndex: 1, moveLeft: true });
      this.fixture.detectChanges();
      gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getHeaders()[0]).toEqual('State');
      expect(gridHelper.getHeaders()[1]).toEqual('Name');
    });

    it('it moves with one position right', function (this: any) {
      let gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getHeaders()[1]).toEqual('State');
      expect(gridHelper.getHeaders()[2]).toEqual('Status');

      service.moveVisibleColumn.next({ visibleColumnIndex: 1, moveLeft: false });
      this.fixture.detectChanges();
      gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getHeaders()[1]).toEqual('Status');
      expect(gridHelper.getHeaders()[2]).toEqual('State');
    });

    it('it does not move left if the column is the first column in the column order', function (this: any) {
      service.grabbedColumn.next(this.datagridHostComponent.columns[0]);
      let gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getHeaders()[0]).toEqual('Name');

      service.moveVisibleColumn.next({ visibleColumnIndex: 0, moveLeft: true });
      this.fixture.detectChanges();
      gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getHeaders().length).toEqual(3);
      expect(gridHelper.getHeaders()[0]).toEqual('Name');
    });

    it('it does not move right if the column is the last column in the column order', function (this: any) {
      service.grabbedColumn.next(this.datagridHostComponent.columns[2]);
      let gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getHeaders()[2]).toEqual('Status');

      service.moveVisibleColumn.next({ visibleColumnIndex: 2, moveLeft: false });
      this.fixture.detectChanges();
      gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getHeaders().length).toEqual(3);
      expect(gridHelper.getHeaders()[2]).toEqual('Status');
    });

    it('which can be moved the focusGrabbedColumn event is emitted', function (this: any) {
      let receivedFocusGrabbed = false;
      service.focusGrabbedColumn.subscribe(() => {
        receivedFocusGrabbed = true;
      });
      service.moveVisibleColumn.next({ visibleColumnIndex: 1, moveLeft: true });
      this.fixture.detectChanges();
      expect(receivedFocusGrabbed).toEqual(true);

      receivedFocusGrabbed = false;
      service.moveVisibleColumn.next({ visibleColumnIndex: 0, moveLeft: true });

      this.fixture.detectChanges();
      expect(receivedFocusGrabbed).toEqual(false);
    });

    it('which can be moved the ColumnOrderChanged event is emitted', function (this: any) {
      let receivedData: ColumnOrderChanged = {} as ColumnOrderChanged;
      this.datagridHostComponent.dgColumnsOrderDirective.dgColumnsOrderChange.subscribe((data: ColumnOrderChanged) => {
        receivedData = data;
      });
      //Provided column index is the
      service.moveVisibleColumn.next({ visibleColumnIndex: 1, moveLeft: false });
      this.fixture.detectChanges();
      expect(receivedData.previousIndex).toEqual(2);
      expect(receivedData.currentIndex).toEqual(4);
      expect(receivedData.columns).toEqual(this.datagridHostComponent.columns);
    });
  });

  describe('when dropped event is received', () => {
    beforeEach(function (this: any) {
      this.fixture.detectChanges();
    });

    it('column is moved', function (this: any) {
      let gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getHeaders()[0]).toEqual('Name');
      expect(gridHelper.getHeaders()[1]).toEqual('State');
      expect(gridHelper.getHeaders()[2]).toEqual('Status');

      //Move first column after the next one
      let newColumnIndex = this.datagridHostComponent.cdkDropListDirective.getSortedItems().findIndex((item: any) => {
        return item.data === this.datagridHostComponent.visibleColumns[1];
      });
      let droppedData = {
        item: {
          data: this.datagridHostComponent.visibleColumns[0],
        },
        currentIndex: newColumnIndex,
      };
      this.datagridHostComponent.cdkDropListDirective.dropped.next(droppedData);
      this.fixture.detectChanges();

      gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getHeaders()[0]).toEqual('State');
      expect(gridHelper.getHeaders()[1]).toEqual('Name');
      expect(gridHelper.getHeaders()[2]).toEqual('Status');
      expect(this.datagridHostComponent.columns[0].displayName).toEqual(firstName);
      expect(this.datagridHostComponent.columns[0].hidden).toEqual(true);
      expect(this.datagridHostComponent.columns[1].displayName).toEqual('State');
      expect(this.datagridHostComponent.columns[1].hidden).toEqual(false);

      //Move first column after the last on
      newColumnIndex = this.datagridHostComponent.cdkDropListDirective.getSortedItems().findIndex((item: any) => {
        return item.data === this.datagridHostComponent.visibleColumns[2];
      });
      droppedData = {
        item: {
          data: this.datagridHostComponent.visibleColumns[0],
        },
        currentIndex: newColumnIndex,
      };
      this.datagridHostComponent.cdkDropListDirective.dropped.next(droppedData);
      this.fixture.detectChanges();

      gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getHeaders()[0]).toEqual('Name');
      expect(gridHelper.getHeaders()[1]).toEqual('Status');
      expect(gridHelper.getHeaders()[2]).toEqual('State');

      expect(this.datagridHostComponent.columns[0].displayName).toEqual(firstName);
      expect(this.datagridHostComponent.columns[0].hidden).toEqual(true);
      expect(this.datagridHostComponent.columns[1].displayName).toEqual('Name');
      expect(this.datagridHostComponent.columns[1].hidden).toEqual(false);
      expect(this.datagridHostComponent.columns[4].displayName).toEqual('State');
      expect(this.datagridHostComponent.columns[4].hidden).toEqual(false);

      //Move last column before the first one
      newColumnIndex = this.datagridHostComponent.cdkDropListDirective.getSortedItems().findIndex((item: any) => {
        return item.data === this.datagridHostComponent.visibleColumns[0];
      });
      droppedData = {
        item: {
          data: this.datagridHostComponent.visibleColumns[2],
        },
        currentIndex: newColumnIndex,
      };
      this.datagridHostComponent.cdkDropListDirective.dropped.next(droppedData);
      this.fixture.detectChanges();

      gridHelper = new GridHelper(this.fixture.debugElement);
      expect(gridHelper.getHeaders()[0]).toEqual('State');
      expect(gridHelper.getHeaders()[1]).toEqual('Name');
      expect(gridHelper.getHeaders()[2]).toEqual('Status');
    });

    it('the ColumnOrderChanged event is emitted', function (this: any) {
      let receivedData: ColumnOrderChanged = {} as ColumnOrderChanged;
      this.datagridHostComponent.dgColumnsOrderDirective.dgColumnsOrderChange.subscribe((data: ColumnOrderChanged) => {
        receivedData = data;
      });
      const newColumnIndex = this.datagridHostComponent.cdkDropListDirective.getSortedItems().findIndex((item: any) => {
        return item.data === this.datagridHostComponent.visibleColumns[2];
      });
      const droppedData = {
        item: {
          data: this.datagridHostComponent.visibleColumns[1],
        },
        currentIndex: newColumnIndex,
      };
      this.datagridHostComponent.cdkDropListDirective.dropped.next(droppedData);
      this.fixture.detectChanges();
      expect(receivedData.previousIndex).toEqual(2);
      expect(receivedData.currentIndex).toEqual(4);
      expect(receivedData.columns).toEqual(this.datagridHostComponent.columns);
    });
  });

  afterEach(function (this: any) {
    this.fixture.destroy();
  });
});

@Component({
  selector: 'clr-datagrid-host-component',
  imports: [ClrDatagridModule, CommonModule, DatagridColumnsOrderModule, DragDropModule],
  template: `
    <clr-datagrid
      cdkDropList
      appfxDgColumnsOrder
      [dgColumnsOrderColumns]="columns"
      (dgColumnsOrderChange)="onColumnOrderChange($event)"
    >
      <clr-dg-column
        *ngFor="let column of visibleColumns; trackBy: trackByColumnId; let index = index"
        cdkDrag
        [cdkDragLockAxis]="'x'"
        [cdkDragData]="column"
        appfxColumnOrder
        [columnData]="column"
        [columnIndex]="index"
      >
        <span>{{ column.displayName }} </span>
      </clr-dg-column>
      <clr-dg-row *clrDgItems="let item of data" [clrDgItem]="data">
        <clr-dg-cell *ngFor="let column of columns">{{ data[column.field] }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: true,
})
class TestClrDatagridHostComponent {
  @ViewChild(DatagridColumnsOrderDirective) dgColumnsOrderDirective: DatagridColumnsOrderDirective;

  @ViewChild(CdkDropList) cdkDropListDirective: CdkDropList;

  data: any[] = [
    {
      status: 'unknown',
      name: 'vm0',
      powerState: 'Powered Off',
      host: '10.23.45.68',
    },
  ];
  visibleColumns: ColumnDefinition<any>[];

  #columns: ColumnDefinition<any>[];

  get columns() {
    return this.#columns;
  }

  set columns(values: ColumnDefinition<any>[]) {
    this.#columns = values;
    this.visibleColumns = this.columns.filter((column: ColumnDefinition<any>) => !column.hidden);
  }

  trackByColumnId(index: number, column: ColumnDefinition<any>) {
    return column.uid || column.displayName;
  }

  onColumnOrderChange(data: ColumnOrderChanged) {
    this.columns = data.columns;
    this.visibleColumns = this.columns.filter((column: ColumnDefinition<any>) => !column.hidden);
  }
}

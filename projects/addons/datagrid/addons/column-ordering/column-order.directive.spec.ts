/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, ContentChildren, Directive, ElementRef, QueryList, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClrDatagridModule } from '@clr/angular';

import { ColumnOrderDirective } from './column-order.directive';
import { DatagridColumnsOrderDirective } from './datagrid-columns-order.directive';
import { DatagridColumnsOrderModule } from './datagrid-columns-order.module';
import { DatagridColumnsOrderService } from './datagrid-columns-order.service';
import { ColumnDefinition } from '../../shared/column/column-definitions';

describe('ColumnOrderDirective', () => {
  let service: DatagridColumnsOrderService;
  beforeEach(function (this: any) {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, CommonModule, ClrDatagridModule, DragDropModule, TestClrDatagridHostComponent],
    });

    this.fixture = TestBed.createComponent(TestClrDatagridHostComponent);
    service = this.fixture.debugElement
      .query(By.directive(DatagridColumnsOrderDirective))
      .injector.get(DatagridColumnsOrderService);
    this.datagridHostComponent = this.fixture.componentInstance;
  });

  describe('emits null as grabbed column event', () => {
    let receivedDraggedColumnData: any[] = [];
    beforeEach(function (this: any) {
      receivedDraggedColumnData = [];
      this.fixture.detectChanges();
      service.grabbedColumn.next(this.datagridHostComponent.columns[0]);
      service.grabbedColumn.subscribe(data => {
        receivedDraggedColumnData.push(data);
      });
    });

    it('when on a grabbed column an up arrow key is pressed', function (this: any) {
      expect(receivedDraggedColumnData.length).toEqual(1);
      const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: 'ArrowUp',
      });
      this.datagridHostComponent.content.elementRefs.first.nativeElement.dispatchEvent(keyDownEvent);
      //The initial value is gabbed column, then we expect null
      //as result of key down event
      expect(receivedDraggedColumnData.length).toEqual(2);
      expect(receivedDraggedColumnData[1]).toBeNull();
    });

    it('when on a grabbed column a down arrow key is pressed', function (this: any) {
      expect(receivedDraggedColumnData.length).toEqual(1);
      const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: 'ArrowDown',
      });
      this.datagridHostComponent.content.elementRefs.first.nativeElement.dispatchEvent(keyDownEvent);

      expect(receivedDraggedColumnData.length).toEqual(2);
      expect(receivedDraggedColumnData[1]).toBeNull();
    });

    it('when on a grabbed column an escape key is pressed', function (this: any) {
      expect(receivedDraggedColumnData.length).toEqual(1);
      const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: 'Escape',
      });
      this.datagridHostComponent.content.elementRefs.first.nativeElement.dispatchEvent(keyDownEvent);

      expect(receivedDraggedColumnData.length).toEqual(2);
      expect(receivedDraggedColumnData[1]).toBeNull();
    });

    it('when on a grabbed column a space key is pressed', function (this: any) {
      expect(receivedDraggedColumnData.length).toEqual(1);
      const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: 'Space',
      });
      this.datagridHostComponent.content.elementRefs.first.nativeElement.dispatchEvent(keyDownEvent);

      expect(receivedDraggedColumnData.length).toEqual(2);
      expect(receivedDraggedColumnData[1]).toBeNull();
    });

    it('when a cdkDrag started event is emitted', function (this: any) {
      expect(receivedDraggedColumnData.length).toEqual(1);
      const cdkDrag = this.datagridHostComponent.content.cdkDragDirectives.first;
      cdkDrag.started.next({});

      expect(receivedDraggedColumnData.length).toEqual(2);
      expect(receivedDraggedColumnData[1]).toBeNull();
    });
  });

  it('emits column as aa grabbed column event when on a not grabbed column a space key is pressed', function (this: any) {
    const receivedDraggedColumnData: any[] = [];
    this.fixture.detectChanges();
    service.grabbedColumn.subscribe(data => {
      receivedDraggedColumnData.push(data);
    });

    const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
      code: 'Space',
    });
    this.datagridHostComponent.content.elementRefs.first.nativeElement.dispatchEvent(keyDownEvent);
    expect(receivedDraggedColumnData.length).toEqual(2);
    expect(receivedDraggedColumnData[0]).toEqual(null);
    expect(receivedDraggedColumnData[1]).toEqual(this.datagridHostComponent.columns[0]);
  });

  describe('emits moveVisibleColumn event when on a grabbed column', () => {
    let receivedData: any[] = [];
    beforeEach(function (this: any) {
      receivedData = [];
      this.fixture.detectChanges();
      service.grabbedColumn.next(this.datagridHostComponent.columns[1]);
      service.moveVisibleColumn.subscribe(data => {
        receivedData.push(data);
      });
    });

    it('a left arrow key is pressed', function (this: any) {
      const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: 'ArrowLeft',
      });
      this.datagridHostComponent.content.elementRefs.get(1).nativeElement.dispatchEvent(keyDownEvent);
      expect(receivedData.length).toEqual(1);
      expect(receivedData[0].visibleColumnIndex).toEqual(1);
      expect(receivedData[0].moveLeft).toEqual(true);
    });

    it('a right arrow key is pressed', function (this: any) {
      const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: 'ArrowRight',
      });
      this.datagridHostComponent.content.elementRefs.get(1).nativeElement.dispatchEvent(keyDownEvent);
      expect(receivedData.length).toEqual(1);
      expect(receivedData[0].visibleColumnIndex).toEqual(1);
      expect(receivedData[0].moveLeft).toEqual(false);
    });
  });

  it('switch isGrabbed state when grabbed column event is received', function (this: any) {
    this.fixture.detectChanges();
    service.grabbedColumn.next(this.datagridHostComponent.columns[1]);

    expect(this.datagridHostComponent.content.columnOrderDirectives.get(0).isGrabbed).toEqual(false);
    expect(this.datagridHostComponent.content.columnOrderDirectives.get(1).isGrabbed).toEqual(true);
    expect(this.datagridHostComponent.content.columnOrderDirectives.get(2).isGrabbed).toEqual(false);
    service.grabbedColumn.next(this.datagridHostComponent.columns[2]);

    expect(this.datagridHostComponent.content.columnOrderDirectives.get(0).isGrabbed).toEqual(false);
    expect(this.datagridHostComponent.content.columnOrderDirectives.get(1).isGrabbed).toEqual(false);
    expect(this.datagridHostComponent.content.columnOrderDirectives.get(2).isGrabbed).toEqual(true);

    service.grabbedColumn.next(null);

    expect(this.datagridHostComponent.content.columnOrderDirectives.get(0).isGrabbed).toEqual(false);
    expect(this.datagridHostComponent.content.columnOrderDirectives.get(1).isGrabbed).toEqual(false);
    expect(this.datagridHostComponent.content.columnOrderDirectives.get(2).isGrabbed).toEqual(false);
  });

  it('focus grabbed column when focus grabbed column event is received', function (this: any) {
    this.fixture.detectChanges();
    const firstColumnElement = this.datagridHostComponent.content.elementRefs.get(0).nativeElement;
    const secondColumnElement = this.datagridHostComponent.content.elementRefs.get(1).nativeElement;
    spyOn(firstColumnElement, 'focus');
    spyOn(secondColumnElement, 'focus');
    service.grabbedColumn.next(this.datagridHostComponent.columns[1]);
    service.focusGrabbedColumn.next();

    expect(firstColumnElement.focus).not.toHaveBeenCalled();
    expect(secondColumnElement.focus).toHaveBeenCalled();
    service.grabbedColumn.next(this.datagridHostComponent.columns[0]);

    expect(firstColumnElement.focus).not.toHaveBeenCalled();
    service.focusGrabbedColumn.next();
    expect(firstColumnElement.focus).toHaveBeenCalled();
  });

  afterEach(function (this: any) {
    this.fixture.destroy();
  });
});

@Directive({
  selector: 'clr-datagrid[testDirectives]',
  standalone: true,
})
class TestDirective {
  @ContentChildren(ColumnOrderDirective) columnOrderDirectives: QueryList<ColumnOrderDirective>;

  @ContentChildren(CdkDrag) cdkDragDirectives: QueryList<CdkDrag>;

  @ContentChildren(ColumnOrderDirective, { read: ElementRef }) elementRefs: QueryList<ElementRef>;
}

@Component({
  selector: 'clr-datagrid-host-component',
  imports: [ClrDatagridModule, CommonModule, DatagridColumnsOrderModule, DragDropModule, TestDirective],
  template: `
    <clr-datagrid cdkDropList appfxDgColumnsOrder [dgColumnsOrderColumns]="columns" testDirectives>
      <clr-dg-column
        *ngFor="let column of columns; trackBy: trackByColumnId; let index = index"
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
  @ViewChild(TestDirective) content: TestDirective;

  data: any[] = [
    {
      status: 'unknown',
      name: 'vm0',
      powerState: 'Powered Off',
      host: '10.23.45.68',
    },
  ];

  columns: ColumnDefinition<any>[] = [
    {
      displayName: 'Name',
      field: 'name',
      defaultSortOrder: -1,
    },
    {
      displayName: 'State',
      field: 'powerState',
    },
    {
      displayName: 'Status',
      field: 'status',
    },
  ];

  trackByColumnId(index: number, column: ColumnDefinition<any>) {
    return column.uid || column.displayName;
  }
}

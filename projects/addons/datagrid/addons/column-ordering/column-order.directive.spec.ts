/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
import { ClrDatagridModule } from '@clr/angular/data/datagrid';

import { ColumnOrderDirective } from './column-order.directive';
import { DatagridColumnsOrderDirective } from './datagrid-columns-order.directive';
import { DatagridColumnsOrderModule } from './datagrid-columns-order.module';
import { DatagridColumnsOrderService } from './datagrid-columns-order.service';
import { ColumnDefinition } from '../../shared/column/column-definitions';

describe('ColumnOrderDirective', () => {
  let testContext: any;
  beforeEach(() => {
    testContext = {};
  });

  let service: DatagridColumnsOrderService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, CommonModule, ClrDatagridModule, DragDropModule, TestClrDatagridHostComponent],
    });

    testContext.fixture = TestBed.createComponent(TestClrDatagridHostComponent);
    service = testContext.fixture.debugElement
      .query(By.directive(DatagridColumnsOrderDirective))
      .injector.get(DatagridColumnsOrderService);
    testContext.datagridHostComponent = testContext.fixture.componentInstance;
  });

  describe('emits null as grabbed column event', () => {
    let receivedDraggedColumnData: any[] = [];
    beforeEach(() => {
      receivedDraggedColumnData = [];
      testContext.fixture.detectChanges();
      service.grabbedColumn.next(testContext.datagridHostComponent.columns[0]);
      service.grabbedColumn.subscribe(data => {
        receivedDraggedColumnData.push(data);
      });
    });

    it('when on a grabbed column an up arrow key is pressed', () => {
      expect(receivedDraggedColumnData.length).toEqual(1);
      const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: 'ArrowUp',
      });
      testContext.datagridHostComponent.content.elementRefs.first.nativeElement.dispatchEvent(keyDownEvent);
      //The initial value is gabbed column, then we expect null
      //as result of key down event
      expect(receivedDraggedColumnData.length).toEqual(2);
      expect(receivedDraggedColumnData[1]).toBeNull();
    });

    it('when on a grabbed column a down arrow key is pressed', () => {
      expect(receivedDraggedColumnData.length).toEqual(1);
      const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: 'ArrowDown',
      });
      testContext.datagridHostComponent.content.elementRefs.first.nativeElement.dispatchEvent(keyDownEvent);

      expect(receivedDraggedColumnData.length).toEqual(2);
      expect(receivedDraggedColumnData[1]).toBeNull();
    });

    it('when on a grabbed column an escape key is pressed', () => {
      expect(receivedDraggedColumnData.length).toEqual(1);
      const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: 'Escape',
      });
      testContext.datagridHostComponent.content.elementRefs.first.nativeElement.dispatchEvent(keyDownEvent);

      expect(receivedDraggedColumnData.length).toEqual(2);
      expect(receivedDraggedColumnData[1]).toBeNull();
    });

    it('when on a grabbed column a space key is pressed', () => {
      expect(receivedDraggedColumnData.length).toEqual(1);
      const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: 'Space',
      });
      testContext.datagridHostComponent.content.elementRefs.first.nativeElement.dispatchEvent(keyDownEvent);

      expect(receivedDraggedColumnData.length).toEqual(2);
      expect(receivedDraggedColumnData[1]).toBeNull();
    });

    it('when a cdkDrag started event is emitted', () => {
      expect(receivedDraggedColumnData.length).toEqual(1);
      const cdkDrag = testContext.datagridHostComponent.content.cdkDragDirectives.first;
      cdkDrag.started.next({});

      expect(receivedDraggedColumnData.length).toEqual(2);
      expect(receivedDraggedColumnData[1]).toBeNull();
    });
  });

  it('emits column as aa grabbed column event when on a not grabbed column a space key is pressed', () => {
    const receivedDraggedColumnData: any[] = [];
    testContext.fixture.detectChanges();
    service.grabbedColumn.subscribe(data => {
      receivedDraggedColumnData.push(data);
    });

    const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
      code: 'Space',
    });
    testContext.datagridHostComponent.content.elementRefs.first.nativeElement.dispatchEvent(keyDownEvent);
    expect(receivedDraggedColumnData.length).toEqual(2);
    expect(receivedDraggedColumnData[0]).toEqual(null);
    expect(receivedDraggedColumnData[1]).toEqual(testContext.datagridHostComponent.columns[0]);
  });

  describe('emits moveVisibleColumn event when on a grabbed column', () => {
    let receivedData: any[] = [];
    beforeEach(() => {
      receivedData = [];
      testContext.fixture.detectChanges();
      service.grabbedColumn.next(testContext.datagridHostComponent.columns[1]);
      service.moveVisibleColumn.subscribe(data => {
        receivedData.push(data);
      });
    });

    it('a left arrow key is pressed', () => {
      const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: 'ArrowLeft',
      });
      testContext.datagridHostComponent.content.elementRefs.get(1).nativeElement.dispatchEvent(keyDownEvent);
      expect(receivedData.length).toEqual(1);
      expect(receivedData[0].visibleColumnIndex).toEqual(1);
      expect(receivedData[0].moveLeft).toEqual(true);
    });

    it('a right arrow key is pressed', () => {
      const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        code: 'ArrowRight',
      });
      testContext.datagridHostComponent.content.elementRefs.get(1).nativeElement.dispatchEvent(keyDownEvent);
      expect(receivedData.length).toEqual(1);
      expect(receivedData[0].visibleColumnIndex).toEqual(1);
      expect(receivedData[0].moveLeft).toEqual(false);
    });
  });

  it('switch isGrabbed state when grabbed column event is received', () => {
    testContext.fixture.detectChanges();
    service.grabbedColumn.next(testContext.datagridHostComponent.columns[1]);

    expect(testContext.datagridHostComponent.content.columnOrderDirectives.get(0).isGrabbed).toEqual(false);
    expect(testContext.datagridHostComponent.content.columnOrderDirectives.get(1).isGrabbed).toEqual(true);
    expect(testContext.datagridHostComponent.content.columnOrderDirectives.get(2).isGrabbed).toEqual(false);
    service.grabbedColumn.next(testContext.datagridHostComponent.columns[2]);

    expect(testContext.datagridHostComponent.content.columnOrderDirectives.get(0).isGrabbed).toEqual(false);
    expect(testContext.datagridHostComponent.content.columnOrderDirectives.get(1).isGrabbed).toEqual(false);
    expect(testContext.datagridHostComponent.content.columnOrderDirectives.get(2).isGrabbed).toEqual(true);

    service.grabbedColumn.next(null);

    expect(testContext.datagridHostComponent.content.columnOrderDirectives.get(0).isGrabbed).toEqual(false);
    expect(testContext.datagridHostComponent.content.columnOrderDirectives.get(1).isGrabbed).toEqual(false);
    expect(testContext.datagridHostComponent.content.columnOrderDirectives.get(2).isGrabbed).toEqual(false);
  });

  describe('pinned columns', () => {
    function keydown(context: any, index: number, code: string) {
      context.datagridHostComponent.content.elementRefs
        .get(index)
        .nativeElement.dispatchEvent(new KeyboardEvent('keydown', { code: code }));
    }

    beforeEach(() => {
      // A pinned column is rendered in the sticky container, outside the reorderable group.
      testContext.datagridHostComponent.columns[1].pinned = true;
      testContext.fixture.detectChanges();
    });

    it('cannot be grabbed with the keyboard', () => {
      const grabbed: any[] = [];
      service.grabbedColumn.subscribe(data => grabbed.push(data));

      keydown(testContext, 1, 'Space');

      // Only the initial null of the BehaviorSubject, no grab.
      expect(grabbed).toEqual([null]);
    });

    it('cannot be moved with the arrow keys', () => {
      const moves: any[] = [];
      service.grabbedColumn.next(testContext.datagridHostComponent.columns[1]);
      service.moveVisibleColumn.subscribe(data => moves.push(data));

      keydown(testContext, 1, 'ArrowLeft');
      keydown(testContext, 1, 'ArrowRight');

      expect(moves).toEqual([]);
    });

    it('can still be released when it gets pinned while grabbed', () => {
      const grabbed: any[] = [];
      service.grabbedColumn.next(testContext.datagridHostComponent.columns[1]);
      service.grabbedColumn.subscribe(data => grabbed.push(data));

      keydown(testContext, 1, 'Escape');

      expect(grabbed.length).toEqual(2);
      expect(grabbed[1]).toBeNull();
    });

    it('leaves the columns that are not pinned reorderable', () => {
      const moves: any[] = [];
      service.grabbedColumn.next(testContext.datagridHostComponent.columns[2]);
      service.moveVisibleColumn.subscribe(data => moves.push(data));

      keydown(testContext, 2, 'ArrowLeft');

      expect(moves.length).toEqual(1);
      expect(moves[0].visibleColumnIndex).toEqual(2);
      expect(moves[0].moveLeft).toEqual(true);
    });
  });

  it('focus grabbed column when focus grabbed column event is received', () => {
    testContext.fixture.detectChanges();
    const firstColumnElement = testContext.datagridHostComponent.content.elementRefs.get(0).nativeElement;
    const secondColumnElement = testContext.datagridHostComponent.content.elementRefs.get(1).nativeElement;
    spyOn(firstColumnElement, 'focus');
    spyOn(secondColumnElement, 'focus');
    service.grabbedColumn.next(testContext.datagridHostComponent.columns[1]);
    service.focusGrabbedColumn.next();

    expect(firstColumnElement.focus).not.toHaveBeenCalled();
    expect(secondColumnElement.focus).toHaveBeenCalled();
    service.grabbedColumn.next(testContext.datagridHostComponent.columns[0]);

    expect(firstColumnElement.focus).not.toHaveBeenCalled();
    service.focusGrabbedColumn.next();
    expect(firstColumnElement.focus).toHaveBeenCalled();
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });
});

@Directive({
  selector: 'clr-datagrid[testDirectives]',
})
class TestDirective {
  @ContentChildren(ColumnOrderDirective) columnOrderDirectives: QueryList<ColumnOrderDirective>;

  @ContentChildren(CdkDrag) cdkDragDirectives: QueryList<CdkDrag>;

  @ContentChildren(ColumnOrderDirective, { read: ElementRef }) elementRefs: QueryList<ElementRef>;
}

@Component({
  selector: 'clr-datagrid-host-component',
  imports: [ClrDatagridModule, DatagridColumnsOrderModule, DragDropModule, TestDirective],
  template: `
    <clr-datagrid cdkDropList appfxDgColumnsOrder [dgColumnsOrderColumns]="columns" testDirectives>
      @for (column of columns; track trackByColumnId(index, column); let index = $index) {
        <clr-dg-column
          cdkDrag
          [cdkDragLockAxis]="'x'"
          [cdkDragData]="column"
          appfxColumnOrder
          [columnData]="column"
          [columnIndex]="index"
        >
          <span>{{ column.displayName }} </span>
        </clr-dg-column>
      }
      <clr-dg-row *clrDgItems="let item of data" [clrDgItem]="data">
        @for (column of columns; track column) {
          <clr-dg-cell>{{ data[column.field] }}</clr-dg-cell>
        }
      </clr-dg-row>
    </clr-datagrid>
  `,
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

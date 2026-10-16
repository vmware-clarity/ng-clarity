/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
import { ClrDatagridModule } from '@clr/angular/data/datagrid';

import { ColumnMoveDirection, DatagridColumnsOrderDirective } from './datagrid-columns-order.directive';
import { DatagridColumnsOrderModule } from './datagrid-columns-order.module';
import { DatagridColumnsOrderService } from './datagrid-columns-order.service';
import { ColumnOrderChanged } from '../../interfaces/column-state';
import { ColumnDefinition } from '../../shared/column/column-definitions';

const firstName = 'First Name';

// A pinned column is projected into the datagrid's sticky container, so reading it back is how these
// tests tell a real pinned column from one that only has `pinned` set on its definition.
function pinnedHeaders(context: any): string[] {
  return Array.from(
    (context.fixture.nativeElement as HTMLElement).querySelectorAll('.datagrid-pinned-cells clr-dg-column')
  ).map((column: HTMLElement) => column.querySelector('.datagrid-column-title')?.textContent.trim());
}

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
  let testContext: any;
  beforeEach(() => {
    testContext = {};
  });

  let service: DatagridColumnsOrderService;
  let columns: ColumnDefinition<any>[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ClrDatagridModule, DragDropModule, NoopAnimationsModule, TestClrDatagridHostComponent],
    });
    columns = [];
    columnDefsMock.forEach(val => columns.push(Object.assign({}, val)));
    testContext.fixture = TestBed.createComponent(TestClrDatagridHostComponent);
    service = testContext.fixture.debugElement
      .query(By.directive(DatagridColumnsOrderDirective))
      .injector.get(DatagridColumnsOrderService);
    testContext.datagridHostComponent = testContext.fixture.componentInstance;
    testContext.datagridHostComponent.columns = columns;
  });

  describe('when moveVisibleColumn event is received for a column', () => {
    beforeEach(() => {
      testContext.fixture.detectChanges();
      service.grabbedColumn.next(testContext.datagridHostComponent.columns[1]);
    });

    it('it moves with one position left', () => {
      let gridHelper = new GridHelper(testContext.fixture.debugElement);
      expect(gridHelper.getHeaders()[0]).toEqual('Name');
      expect(gridHelper.getHeaders()[1]).toEqual('State');

      service.moveVisibleColumn.next({ visibleColumnIndex: 1, moveLeft: true });
      testContext.fixture.detectChanges();
      gridHelper = new GridHelper(testContext.fixture.debugElement);
      expect(gridHelper.getHeaders()[0]).toEqual('State');
      expect(gridHelper.getHeaders()[1]).toEqual('Name');
    });

    it('it moves with one position right', () => {
      let gridHelper = new GridHelper(testContext.fixture.debugElement);
      expect(gridHelper.getHeaders()[1]).toEqual('State');
      expect(gridHelper.getHeaders()[2]).toEqual('Status');

      service.moveVisibleColumn.next({ visibleColumnIndex: 1, moveLeft: false });
      testContext.fixture.detectChanges();
      gridHelper = new GridHelper(testContext.fixture.debugElement);
      expect(gridHelper.getHeaders()[1]).toEqual('Status');
      expect(gridHelper.getHeaders()[2]).toEqual('State');
    });

    it('it does not move left if the column is the first column in the column order', () => {
      service.grabbedColumn.next(testContext.datagridHostComponent.columns[0]);
      let gridHelper = new GridHelper(testContext.fixture.debugElement);
      expect(gridHelper.getHeaders()[0]).toEqual('Name');

      service.moveVisibleColumn.next({ visibleColumnIndex: 0, moveLeft: true });
      testContext.fixture.detectChanges();
      gridHelper = new GridHelper(testContext.fixture.debugElement);
      expect(gridHelper.getHeaders().length).toEqual(3);
      expect(gridHelper.getHeaders()[0]).toEqual('Name');
    });

    it('it does not move right if the column is the last column in the column order', () => {
      service.grabbedColumn.next(testContext.datagridHostComponent.columns[2]);
      let gridHelper = new GridHelper(testContext.fixture.debugElement);
      expect(gridHelper.getHeaders()[2]).toEqual('Status');

      service.moveVisibleColumn.next({ visibleColumnIndex: 2, moveLeft: false });
      testContext.fixture.detectChanges();
      gridHelper = new GridHelper(testContext.fixture.debugElement);
      expect(gridHelper.getHeaders().length).toEqual(3);
      expect(gridHelper.getHeaders()[2]).toEqual('Status');
    });

    it('which can be moved the focusGrabbedColumn event is emitted', () => {
      let receivedFocusGrabbed = false;
      service.focusGrabbedColumn.subscribe(() => {
        receivedFocusGrabbed = true;
      });
      service.moveVisibleColumn.next({ visibleColumnIndex: 1, moveLeft: true });
      testContext.fixture.detectChanges();
      expect(receivedFocusGrabbed).toEqual(true);

      receivedFocusGrabbed = false;
      service.moveVisibleColumn.next({ visibleColumnIndex: 0, moveLeft: true });

      testContext.fixture.detectChanges();
      expect(receivedFocusGrabbed).toEqual(false);
    });

    it('which can be moved the ColumnOrderChanged event is emitted', () => {
      let receivedData: ColumnOrderChanged = {} as ColumnOrderChanged;
      testContext.datagridHostComponent.dgColumnsOrderDirective.dgColumnsOrderChange.subscribe(
        (data: ColumnOrderChanged) => {
          receivedData = data;
        }
      );
      //Provided column index is the
      service.moveVisibleColumn.next({ visibleColumnIndex: 1, moveLeft: false });
      testContext.fixture.detectChanges();
      expect(receivedData.previousIndex).toEqual(2);
      expect(receivedData.currentIndex).toEqual(4);
      expect(receivedData.columns).toEqual(testContext.datagridHostComponent.columns);
    });
  });

  // A drop can target any column, unlike a move from the actions menu, which stays inside the moved
  // column's own group. Dropping a column across a pinned one would not change which container it is
  // rendered in, so it would land somewhere the user did not aim for, and is refused.
  describe('when a column is pinned', () => {
    function dropOnto(context: any, draggedIndex: number, targetIndex: number) {
      const sortedItems = context.datagridHostComponent.cdkDropListDirective.getSortedItems();
      const currentIndex = sortedItems.findIndex(
        (item: any) => item.data === context.datagridHostComponent.visibleColumns[targetIndex]
      );

      context.datagridHostComponent.cdkDropListDirective.dropped.next({
        item: { data: context.datagridHostComponent.visibleColumns[draggedIndex] },
        currentIndex: currentIndex,
      });
      context.fixture.detectChanges();
    }

    beforeEach(() => {
      // The visible columns are Name, State and Status. Name is the pinned one.
      testContext.datagridHostComponent.columns[0].pinned = true;
      testContext.fixture.detectChanges();
    });

    it('refuses a drop that would move a column across it', () => {
      expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['Name', 'State', 'Status']);

      // 'Status' dropped onto the pinned 'Name'.
      dropOnto(testContext, 2, 0);

      expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['Name', 'State', 'Status']);
    });

    it('refuses a keyboard move that would cross it', () => {
      service.grabbedColumn.next(testContext.datagridHostComponent.visibleColumns[1]);

      // 'State' moved left would put it in front of the pinned 'Name'.
      service.moveVisibleColumn.next({ visibleColumnIndex: 1, moveLeft: true });
      testContext.fixture.detectChanges();

      expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['Name', 'State', 'Status']);
    });

    it('does not emit dgColumnsOrderChange for a refused reorder', () => {
      let emitted = false;
      testContext.datagridHostComponent.dgColumnsOrderDirective.dgColumnsOrderChange.subscribe(() => (emitted = true));

      dropOnto(testContext, 2, 0);

      expect(emitted).toBeFalse();
    });

    it('still reorders the columns that stay on the same side of it', () => {
      // 'State' and 'Status' are both after the pinned column, so they can still swap.
      service.grabbedColumn.next(testContext.datagridHostComponent.visibleColumns[2]);

      service.moveVisibleColumn.next({ visibleColumnIndex: 2, moveLeft: true });
      testContext.fixture.detectChanges();

      expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['Name', 'Status', 'State']);
    });
  });

  // canMoveColumn/moveColumnTo back the menu's Move Left and Move Right actions, and mirror the
  // moveVisibleColumn suite above.
  describe('canMoveColumn / moveColumnTo', () => {
    beforeEach(() => {
      testContext.fixture.detectChanges();
    });

    it('moves left and right by one step, the same as the keyboard path', () => {
      const directive = testContext.datagridHostComponent.dgColumnsOrderDirective;

      expect(directive.canMoveColumn(1, ColumnMoveDirection.Left)).toBeTrue();
      directive.moveColumnTo(1, ColumnMoveDirection.Left);
      testContext.fixture.detectChanges();
      expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['State', 'Name', 'Status']);

      expect(directive.canMoveColumn(0, ColumnMoveDirection.Right)).toBeTrue();
      directive.moveColumnTo(0, ColumnMoveDirection.Right);
      testContext.fixture.detectChanges();
      expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['Name', 'State', 'Status']);
    });

    it('cannot move left from the start, or right from the end', () => {
      const directive = testContext.datagridHostComponent.dgColumnsOrderDirective;

      expect(directive.canMoveColumn(0, ColumnMoveDirection.Left)).toBeFalse();
      expect(directive.canMoveColumn(2, ColumnMoveDirection.Right)).toBeFalse();
      // A refused move must not silently reorder anything.
      directive.moveColumnTo(0, ColumnMoveDirection.Left);
      directive.moveColumnTo(2, ColumnMoveDirection.Right);
      testContext.fixture.detectChanges();
      expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['Name', 'State', 'Status']);
    });

    it('emits dgColumnsOrderChange for a move', () => {
      let receivedData: ColumnOrderChanged = {} as ColumnOrderChanged;
      testContext.datagridHostComponent.dgColumnsOrderDirective.dgColumnsOrderChange.subscribe(
        (data: ColumnOrderChanged) => {
          receivedData = data;
        }
      );

      testContext.datagridHostComponent.dgColumnsOrderDirective.moveColumnTo(1, ColumnMoveDirection.Right);
      testContext.fixture.detectChanges();

      // 'State' (absolute index 2) steps past the hidden 'Options' and lands on 'Status' (absolute index 4).
      expect(receivedData.previousIndex).toEqual(2);
      expect(receivedData.currentIndex).toEqual(4);
      expect(receivedData.columns).toEqual(testContext.datagridHostComponent.columns);
    });

    describe('when a column is pinned', () => {
      beforeEach(() => {
        // The visible columns are Name, State and Status. Name is the pinned one.
        testContext.datagridHostComponent.columns[0].pinned = true;
        testContext.fixture.detectChanges();
      });

      // A pinned column used to wall off its array neighbours: the neighbour was read off the full
      // column list, so the column next to a pinned one had the pinned column as its target and the
      // move was refused - even though the neighbour the user actually sees is on its own side.
      it('steps past a pinned column that sits between two loose ones in the array', () => {
        const directive = testContext.datagridHostComponent.dgColumnsOrderDirective;

        // Name is pinned and rendered first, so the rendered order is Name | State Status. State's
        // own neighbour to the right is Status, and that step has to be offered.
        expect(directive.canMoveColumn(1, ColumnMoveDirection.Right)).toBeTrue();
        directive.moveColumnTo(1, ColumnMoveDirection.Right);
        testContext.fixture.detectChanges();

        expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['Name', 'Status', 'State']);
      });

      it('never offers a step that would cross out of the pinned group', () => {
        const directive = testContext.datagridHostComponent.dgColumnsOrderDirective;

        // State is the first loose column, so there is nothing to its left on its own side.
        expect(directive.canMoveColumn(1, ColumnMoveDirection.Left)).toBeFalse();
        // Name is pinned, so it has no move to make.
        expect(directive.canMoveColumn(0, ColumnMoveDirection.Left)).toBeFalse();
        expect(directive.canMoveColumn(0, ColumnMoveDirection.Right)).toBeFalse();
      });

      // A pinned column cannot be moved at all, not even inside the sticky container next to another
      // pinned one - the only way to change where it sits is to unpin it.
      it('never moves a pinned column, even next to another pinned one', () => {
        testContext.datagridHostComponent.columns[2].pinned = true;
        testContext.fixture.detectChanges();
        expect(pinnedHeaders(testContext)).toEqual(['Name', 'State']);

        const directive = testContext.datagridHostComponent.dgColumnsOrderDirective;
        [ColumnMoveDirection.Left, ColumnMoveDirection.Right].forEach(direction => {
          expect(directive.canMoveColumn(0, direction)).withContext(`Name ${direction}`).toBeFalse();
          expect(directive.canMoveColumn(1, direction)).withContext(`State ${direction}`).toBeFalse();
        });

        expect(directive.moveColumnTo(1, ColumnMoveDirection.Left)).toBeFalse();
        testContext.fixture.detectChanges();

        expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['Name', 'State', 'Status']);
        expect(pinnedHeaders(testContext)).toEqual(['Name', 'State']);
      });

      // Status is the only column left in the scrollable container, so it has nothing to step past
      // even though the array has columns on both sides of it.
      it('refuses both steps for the only column in its group', () => {
        testContext.datagridHostComponent.columns[2].pinned = true;
        testContext.fixture.detectChanges();

        const directive = testContext.datagridHostComponent.dgColumnsOrderDirective;
        expect(directive.canMoveColumn(2, ColumnMoveDirection.Left)).toBeFalse();
        expect(directive.canMoveColumn(2, ColumnMoveDirection.Right)).toBeFalse();
      });
    });
  });

  describe('when dropped event is received', () => {
    beforeEach(() => {
      testContext.fixture.detectChanges();
    });

    it('column is moved', () => {
      let gridHelper = new GridHelper(testContext.fixture.debugElement);
      expect(gridHelper.getHeaders()[0]).toEqual('Name');
      expect(gridHelper.getHeaders()[1]).toEqual('State');
      expect(gridHelper.getHeaders()[2]).toEqual('Status');

      //Move first column after the next one
      let newColumnIndex = testContext.datagridHostComponent.cdkDropListDirective
        .getSortedItems()
        .findIndex((item: any) => {
          return item.data === testContext.datagridHostComponent.visibleColumns[1];
        });
      let droppedData = {
        item: {
          data: testContext.datagridHostComponent.visibleColumns[0],
        },
        currentIndex: newColumnIndex,
      };
      testContext.datagridHostComponent.cdkDropListDirective.dropped.next(droppedData);
      testContext.fixture.detectChanges();

      gridHelper = new GridHelper(testContext.fixture.debugElement);
      expect(gridHelper.getHeaders()[0]).toEqual('State');
      expect(gridHelper.getHeaders()[1]).toEqual('Name');
      expect(gridHelper.getHeaders()[2]).toEqual('Status');
      expect(testContext.datagridHostComponent.columns[0].displayName).toEqual(firstName);
      expect(testContext.datagridHostComponent.columns[0].hidden).toEqual(true);
      expect(testContext.datagridHostComponent.columns[1].displayName).toEqual('State');
      expect(testContext.datagridHostComponent.columns[1].hidden).toEqual(false);

      //Move first column after the last on
      newColumnIndex = testContext.datagridHostComponent.cdkDropListDirective
        .getSortedItems()
        .findIndex((item: any) => {
          return item.data === testContext.datagridHostComponent.visibleColumns[2];
        });
      droppedData = {
        item: {
          data: testContext.datagridHostComponent.visibleColumns[0],
        },
        currentIndex: newColumnIndex,
      };
      testContext.datagridHostComponent.cdkDropListDirective.dropped.next(droppedData);
      testContext.fixture.detectChanges();

      gridHelper = new GridHelper(testContext.fixture.debugElement);
      expect(gridHelper.getHeaders()[0]).toEqual('Name');
      expect(gridHelper.getHeaders()[1]).toEqual('Status');
      expect(gridHelper.getHeaders()[2]).toEqual('State');

      expect(testContext.datagridHostComponent.columns[0].displayName).toEqual(firstName);
      expect(testContext.datagridHostComponent.columns[0].hidden).toEqual(true);
      expect(testContext.datagridHostComponent.columns[1].displayName).toEqual('Name');
      expect(testContext.datagridHostComponent.columns[1].hidden).toEqual(false);
      expect(testContext.datagridHostComponent.columns[4].displayName).toEqual('State');
      expect(testContext.datagridHostComponent.columns[4].hidden).toEqual(false);

      //Move last column before the first one
      newColumnIndex = testContext.datagridHostComponent.cdkDropListDirective
        .getSortedItems()
        .findIndex((item: any) => {
          return item.data === testContext.datagridHostComponent.visibleColumns[0];
        });
      droppedData = {
        item: {
          data: testContext.datagridHostComponent.visibleColumns[2],
        },
        currentIndex: newColumnIndex,
      };
      testContext.datagridHostComponent.cdkDropListDirective.dropped.next(droppedData);
      testContext.fixture.detectChanges();

      gridHelper = new GridHelper(testContext.fixture.debugElement);
      expect(gridHelper.getHeaders()[0]).toEqual('State');
      expect(gridHelper.getHeaders()[1]).toEqual('Name');
      expect(gridHelper.getHeaders()[2]).toEqual('Status');
    });

    it('the ColumnOrderChanged event is emitted', () => {
      let receivedData: ColumnOrderChanged = {} as ColumnOrderChanged;
      testContext.datagridHostComponent.dgColumnsOrderDirective.dgColumnsOrderChange.subscribe(
        (data: ColumnOrderChanged) => {
          receivedData = data;
        }
      );
      const newColumnIndex = testContext.datagridHostComponent.cdkDropListDirective
        .getSortedItems()
        .findIndex((item: any) => {
          return item.data === testContext.datagridHostComponent.visibleColumns[2];
        });
      const droppedData = {
        item: {
          data: testContext.datagridHostComponent.visibleColumns[1],
        },
        currentIndex: newColumnIndex,
      };
      testContext.datagridHostComponent.cdkDropListDirective.dropped.next(droppedData);
      testContext.fixture.detectChanges();
      expect(receivedData.previousIndex).toEqual(2);
      expect(receivedData.currentIndex).toEqual(4);
      expect(receivedData.columns).toEqual(testContext.datagridHostComponent.columns);
    });
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });
});

@Component({
  selector: 'clr-datagrid-host-component',
  imports: [ClrDatagridModule, DatagridColumnsOrderModule, DragDropModule],
  template: `
    <clr-datagrid
      cdkDropList
      appfxDgColumnsOrder
      [dgColumnsOrderColumns]="columns"
      (dgColumnsOrderChange)="onColumnOrderChange($event)"
    >
      @for (column of visibleColumns; track trackByColumnId(index, column); let index = $index) {
        <clr-dg-column
          cdkDrag
          [cdkDragLockAxis]="'x'"
          [cdkDragData]="column"
          [cdkDragDisabled]="!!column.pinned"
          appfxColumnOrder
          [columnData]="column"
          [columnIndex]="index"
          [clrDgPinnable]="!!column.pinnable"
          [clrDgPinned]="!!column.pinned"
        >
          <span>{{ column.displayName }} </span>
        </clr-dg-column>
      }
      <clr-dg-row *clrDgItems="let item of data" [clrDgItem]="data">
        @for (column of visibleColumns; track column) {
          <clr-dg-cell>{{ data[column.field] }}</clr-dg-cell>
        }
      </clr-dg-row>
    </clr-datagrid>
  `,
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
    this.#columns = data.columns;
    this.visibleColumns = this.#columns.filter((column: ColumnDefinition<any>) => !column.hidden);
  }
}

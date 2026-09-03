/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GridHelper } from '@clr/addons/testing';
import { ClrDatagrid, ClrDatagridModule } from '@clr/angular/data/datagrid';

import { DatagridColumnsOrderDirective } from './datagrid-columns-order.directive';
import { DatagridColumnsOrderModule } from './datagrid-columns-order.module';
import { DatagridColumnsOrderService } from './datagrid-columns-order.service';
import { ColumnOrderChanged } from '../../interfaces/column-state';
import { ColumnDefinition } from '../../shared/column/column-definitions';

const firstName = 'First Name';

// A pinned column is projected into the datagrid's sticky container, so reading it back is how these
// tests tell a real pinned column from one that only has `pinned` set on its definition.
function pinnedHeaders(this: any): string[] {
  return Array.from(
    (this.fixture.nativeElement as HTMLElement).querySelectorAll('.datagrid-pinned-cells clr-dg-column')
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

  // A drop can target any column, unlike a move from the actions menu, which stays inside the moved
  // column's own group. Dropping a column across a pinned one would not change which container it is
  // rendered in, so it would land somewhere the user did not aim for, and is refused.
  describe('when a column is pinned', () => {
    function dropOnto(this: any, draggedIndex: number, targetIndex: number) {
      const sortedItems = this.datagridHostComponent.cdkDropListDirective.getSortedItems();
      const currentIndex = sortedItems.findIndex(
        (item: any) => item.data === this.datagridHostComponent.visibleColumns[targetIndex]
      );

      this.datagridHostComponent.cdkDropListDirective.dropped.next({
        item: { data: this.datagridHostComponent.visibleColumns[draggedIndex] },
        currentIndex: currentIndex,
      });
      this.fixture.detectChanges();
    }

    beforeEach(function (this: any) {
      // The visible columns are Name, State and Status. Name is the pinned one.
      this.datagridHostComponent.columns[0].pinned = true;
      this.fixture.detectChanges();
    });

    it('refuses a drop that would move a column across it', function (this: any) {
      expect(new GridHelper(this.fixture.debugElement).getHeaders()).toEqual(['Name', 'State', 'Status']);

      // 'Status' dropped onto the pinned 'Name'.
      dropOnto.call(this, 2, 0);

      expect(new GridHelper(this.fixture.debugElement).getHeaders()).toEqual(['Name', 'State', 'Status']);
    });

    it('refuses a keyboard move that would cross it', function (this: any) {
      service.grabbedColumn.next(this.datagridHostComponent.visibleColumns[1]);

      // 'State' moved left would put it in front of the pinned 'Name'.
      service.moveVisibleColumn.next({ visibleColumnIndex: 1, moveLeft: true });
      this.fixture.detectChanges();

      expect(new GridHelper(this.fixture.debugElement).getHeaders()).toEqual(['Name', 'State', 'Status']);
    });

    it('does not emit dgColumnsOrderChange for a refused reorder', function (this: any) {
      let emitted = false;
      this.datagridHostComponent.dgColumnsOrderDirective.dgColumnsOrderChange.subscribe(() => (emitted = true));

      dropOnto.call(this, 2, 0);

      expect(emitted).toBeFalse();
    });

    it('still reorders the columns that stay on the same side of it', function (this: any) {
      // 'State' and 'Status' are both after the pinned column, so they can still swap.
      service.grabbedColumn.next(this.datagridHostComponent.visibleColumns[2]);

      service.moveVisibleColumn.next({ visibleColumnIndex: 2, moveLeft: true });
      this.fixture.detectChanges();

      expect(new GridHelper(this.fixture.debugElement).getHeaders()).toEqual(['Name', 'Status', 'State']);
    });
  });

  // canMoveColumn/moveColumnTo back the menu's move-left/right/start/end actions. left/right mirror
  // the moveVisibleColumn suite above; start/end are new here.
  describe('canMoveColumn / moveColumnTo', () => {
    beforeEach(function (this: any) {
      this.fixture.detectChanges();
    });

    it('moves left and right by one step, the same as the keyboard path', function (this: any) {
      const directive = this.datagridHostComponent.dgColumnsOrderDirective;

      expect(directive.canMoveColumn(1, 'left')).toBeTrue();
      directive.moveColumnTo(1, 'left');
      this.fixture.detectChanges();
      expect(new GridHelper(this.fixture.debugElement).getHeaders()).toEqual(['State', 'Name', 'Status']);

      expect(directive.canMoveColumn(0, 'right')).toBeTrue();
      directive.moveColumnTo(0, 'right');
      this.fixture.detectChanges();
      expect(new GridHelper(this.fixture.debugElement).getHeaders()).toEqual(['Name', 'State', 'Status']);
    });

    it('moves straight to the start or the end', function (this: any) {
      const directive = this.datagridHostComponent.dgColumnsOrderDirective;

      expect(directive.canMoveColumn(2, 'start')).toBeTrue();
      directive.moveColumnTo(2, 'start');
      this.fixture.detectChanges();
      expect(new GridHelper(this.fixture.debugElement).getHeaders()).toEqual(['Status', 'Name', 'State']);

      expect(directive.canMoveColumn(0, 'end')).toBeTrue();
      directive.moveColumnTo(0, 'end');
      this.fixture.detectChanges();
      expect(new GridHelper(this.fixture.debugElement).getHeaders()).toEqual(['Name', 'State', 'Status']);
    });

    it('cannot move left from the start, or right from the end', function (this: any) {
      const directive = this.datagridHostComponent.dgColumnsOrderDirective;

      expect(directive.canMoveColumn(0, 'left')).toBeFalse();
      expect(directive.canMoveColumn(2, 'right')).toBeFalse();
      // A refused move must not silently reorder anything.
      directive.moveColumnTo(0, 'left');
      directive.moveColumnTo(2, 'right');
      this.fixture.detectChanges();
      expect(new GridHelper(this.fixture.debugElement).getHeaders()).toEqual(['Name', 'State', 'Status']);
    });

    it('cannot move to the start or end it is already at', function (this: any) {
      const directive = this.datagridHostComponent.dgColumnsOrderDirective;

      expect(directive.canMoveColumn(0, 'start')).toBeFalse();
      expect(directive.canMoveColumn(2, 'end')).toBeFalse();
    });

    it('emits dgColumnsOrderChange for a jump to start or end', function (this: any) {
      let receivedData: ColumnOrderChanged = {} as ColumnOrderChanged;
      this.datagridHostComponent.dgColumnsOrderDirective.dgColumnsOrderChange.subscribe((data: ColumnOrderChanged) => {
        receivedData = data;
      });

      this.datagridHostComponent.dgColumnsOrderDirective.moveColumnTo(2, 'start');
      this.fixture.detectChanges();

      // 'Status' (absolute index 4) becomes the new first column (absolute index 0).
      expect(receivedData.previousIndex).toEqual(4);
      expect(receivedData.currentIndex).toEqual(0);
      expect(receivedData.columns).toEqual(this.datagridHostComponent.columns);
    });

    describe('when a column is pinned', () => {
      beforeEach(function (this: any) {
        // The visible columns are Name, State and Status. Name is the pinned one.
        this.datagridHostComponent.columns[0].pinned = true;
        this.fixture.detectChanges();
      });

      // "Start" means the start of the column's own group, so Status lands in front of State rather
      // than in front of the pinned Name - it never leaves the scrollable container.
      it('jumps to the start of its own group, not past the pinned column', function (this: any) {
        const directive = this.datagridHostComponent.dgColumnsOrderDirective;

        expect(directive.canMoveColumn(2, 'start')).toBeTrue();
        directive.moveColumnTo(2, 'start');
        this.fixture.detectChanges();
        expect(new GridHelper(this.fixture.debugElement).getHeaders()).toEqual(['Name', 'Status', 'State']);
      });

      // A pinned column used to wall off its array neighbours: the neighbour was read off the full
      // column list, so the column next to a pinned one had the pinned column as its target and the
      // move was refused - even though the neighbour the user actually sees is on its own side.
      it('steps past a pinned column that sits between two loose ones in the array', function (this: any) {
        const directive = this.datagridHostComponent.dgColumnsOrderDirective;

        // Name is pinned and rendered first, so the rendered order is Name | State Status. State's
        // own neighbour to the right is Status, and that step has to be offered.
        expect(directive.canMoveColumn(1, 'right')).toBeTrue();
        directive.moveColumnTo(1, 'right');
        this.fixture.detectChanges();

        expect(new GridHelper(this.fixture.debugElement).getHeaders()).toEqual(['Name', 'Status', 'State']);
      });

      it('never offers a step that would cross out of the pinned group', function (this: any) {
        const directive = this.datagridHostComponent.dgColumnsOrderDirective;

        // State is the first loose column, so there is nothing to its left on its own side.
        expect(directive.canMoveColumn(1, 'left')).toBeFalse();
        // Name is the only pinned column, so it has no neighbour inside the sticky container.
        expect(directive.canMoveColumn(0, 'left')).toBeFalse();
        expect(directive.canMoveColumn(0, 'right')).toBeFalse();
      });

      // Both pinned columns are rendered in the sticky container, so they are each other's
      // neighbours there and can change places. That only renders because the host rebuilds the
      // column views - relocating them inside the sticky container throws.
      it('reorders two pinned columns with each other', function (this: any) {
        this.datagridHostComponent.columns[2].pinned = true;
        this.fixture.detectChanges();
        expect(new GridHelper(this.fixture.debugElement).getHeaders()).toEqual(['Name', 'State', 'Status']);
        // Both really are in the sticky container, which is what makes this a reorder inside it
        // rather than an ordinary one.
        expect(pinnedHeaders.call(this)).toEqual(['Name', 'State']);

        const directive = this.datagridHostComponent.dgColumnsOrderDirective;
        expect(directive.canMoveColumn(1, 'left')).toBeTrue();
        expect(directive.canMoveColumn(0, 'right')).toBeTrue();

        directive.moveColumnTo(1, 'left');
        this.fixture.detectChanges();

        expect(new GridHelper(this.fixture.debugElement).getHeaders()).toEqual(['State', 'Name', 'Status']);
        expect(pinnedHeaders.call(this)).toEqual(['State', 'Name']);
      });

      // Status is the only column left in the scrollable container, so it has nothing to step past
      // even though the array has columns on both sides of it.
      it('refuses both steps for the only column in its group', function (this: any) {
        this.datagridHostComponent.columns[2].pinned = true;
        this.fixture.detectChanges();

        const directive = this.datagridHostComponent.dgColumnsOrderDirective;
        expect(directive.canMoveColumn(2, 'left')).toBeFalse();
        expect(directive.canMoveColumn(2, 'right')).toBeFalse();
      });

      it('still allows a jump to end that stays on the same side of it', function (this: any) {
        const directive = this.datagridHostComponent.dgColumnsOrderDirective;

        expect(directive.canMoveColumn(1, 'end')).toBeTrue();
        directive.moveColumnTo(1, 'end');
        this.fixture.detectChanges();
        expect(new GridHelper(this.fixture.debugElement).getHeaders()).toEqual(['Name', 'Status', 'State']);
      });
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

  @ViewChild(ClrDatagrid, { static: true }) clrDatagrid: ClrDatagrid<any>;

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

  constructor(private readonly cdr: ChangeDetectorRef) {}

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

  // Mirrors DatagridComponent.onColumnOrderChange, including the rebuild it does once a column is
  // pinned. Without it the pinned columns here would never be re-rendered in their new order, and
  // these tests would only be checking the directive's index arithmetic.
  onColumnOrderChange(data: ColumnOrderChanged) {
    this.#columns = data.columns;

    if (this.#columns.some((column: ColumnDefinition<any>) => column.pinned)) {
      this.visibleColumns = [];
      this.cdr.detectChanges();
      this.visibleColumns = this.#columns.filter((column: ColumnDefinition<any>) => !column.hidden);
      this.cdr.detectChanges();
      this.clrDatagrid.resize();
    } else {
      this.visibleColumns = this.#columns.filter((column: ColumnDefinition<any>) => !column.hidden);
    }
  }
}

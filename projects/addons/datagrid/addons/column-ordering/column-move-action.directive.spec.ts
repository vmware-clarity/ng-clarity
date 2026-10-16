/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GridHelper } from '@clr/addons/testing';
import { ClrDatagrid, ClrDatagridModule } from '@clr/angular/data/datagrid';

import { ColumnMoveDirection } from './datagrid-columns-order.directive';
import { DatagridColumnsOrderModule } from './datagrid-columns-order.module';
import { ColumnOrderChanged } from '../../interfaces/column-state';
import { ColumnDefinition } from '../../shared/column/column-definitions';

// The menu is rendered into a CDK overlay attached to document.body, outside the fixture's own DOM
// subtree, so it has to be read through plain document queries rather than fixture.debugElement -
// the same reason the core clr-dg-column-actions spec does the same thing.
describe('ColumnMoveActionDirective', () => {
  let testContext: any;
  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrDatagridModule, CommonModule, DragDropModule, NoopAnimationsModule, TestClrDatagridHostComponent],
    });

    testContext.fixture = TestBed.createComponent(TestClrDatagridHostComponent);
    testContext.fixture.detectChanges();
  });

  function toggleMenu(context: any, columnIndex: number) {
    context.fixture.debugElement.queryAll(By.css('.datagrid-column-actions-toggle'))[columnIndex].nativeElement.click();
    context.fixture.detectChanges();
  }

  function moveButton(label: string): HTMLElement {
    return Array.from(document.querySelectorAll<HTMLElement>('.dropdown-menu .dropdown-item')).find(
      item => item.textContent.trim() === label
    );
  }

  it('is enabled in the middle and disabled at both edges', () => {
    toggleMenu(testContext, 0);
    expect(moveButton('Move Left').getAttribute('aria-disabled')).toBe('true');
    expect(moveButton('Move Right').getAttribute('aria-disabled')).toBe('false');
    toggleMenu(testContext, 0);

    toggleMenu(testContext, 1);
    expect(moveButton('Move Left').getAttribute('aria-disabled')).toBe('false');
    expect(moveButton('Move Right').getAttribute('aria-disabled')).toBe('false');
    toggleMenu(testContext, 1);

    toggleMenu(testContext, 2);
    expect(moveButton('Move Left').getAttribute('aria-disabled')).toBe('false');
    expect(moveButton('Move Right').getAttribute('aria-disabled')).toBe('true');
    toggleMenu(testContext, 2);
  });

  it('moves the column when clicked', () => {
    expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['Name', 'State', 'Status']);

    toggleMenu(testContext, 0);
    moveButton('Move Right').click();
    testContext.fixture.detectChanges();

    expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['State', 'Name', 'Status']);
  });

  it('does nothing when a disabled action is clicked', () => {
    toggleMenu(testContext, 0);
    moveButton('Move Left').click();
    testContext.fixture.detectChanges();

    expect(new GridHelper(testContext.fixture.debugElement).getHeaders()).toEqual(['Name', 'State', 'Status']);
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
      @for (column of columns; track trackByColumnId(index, column); let index = $index) {
        <clr-dg-column
          cdkDrag
          [cdkDragData]="column"
          [cdkDragDisabled]="!!column.pinned"
          appfxColumnOrder
          [columnData]="column"
          [columnIndex]="index"
          [clrDgPinnable]="!!column.pinnable"
          [clrDgPinned]="!!column.pinned"
        >
          {{ column.displayName }}
          <clr-dg-column-actions>
            @for (action of moveActions; track action.direction) {
              <button
                type="button"
                clrDgColumnAction
                [appfxColumnMoveAction]="action.direction"
                #moveAction="appfxColumnMoveAction"
                [columnIndex]="index"
                [clrDisabled]="moveAction.disabled"
              >
                {{ action.label }}
              </button>
            }
          </clr-dg-column-actions>
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
  @ViewChild(ClrDatagrid, { static: true }) clrDatagrid: ClrDatagrid<any>;

  moveActions = [
    { direction: ColumnMoveDirection.Left, label: 'Move Left' },
    { direction: ColumnMoveDirection.Right, label: 'Move Right' },
  ];

  data: any[] = [
    {
      status: 'unknown',
      name: 'vm0',
      powerState: 'Powered Off',
      host: '10.23.45.68',
    },
  ];

  columns: ColumnDefinition<any>[] = [
    { displayName: 'Name', field: 'name' },
    { displayName: 'State', field: 'powerState' },
    { displayName: 'Status', field: 'status' },
  ];

  constructor(private readonly cdr: ChangeDetectorRef) {}

  trackByColumnId(index: number, column: ColumnDefinition<any>) {
    return column.uid || column.displayName;
  }

  // Mirrors DatagridComponent.onColumnOrderChange.
  onColumnOrderChange(data: ColumnOrderChanged) {
    this.columns = data.columns;
    this.cdr.detectChanges();
    this.clrDatagrid.resize();
  }
}

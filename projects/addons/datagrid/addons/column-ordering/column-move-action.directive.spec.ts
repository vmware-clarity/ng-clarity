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

import { DatagridColumnsOrderModule } from './datagrid-columns-order.module';
import { ColumnOrderChanged } from '../../interfaces/column-state';
import { ColumnDefinition } from '../../shared/column/column-definitions';

// The menu is rendered into a CDK overlay attached to document.body, outside the fixture's own DOM
// subtree, so it has to be read through plain document queries rather than fixture.debugElement -
// the same reason the core clr-dg-column-actions spec does the same thing.
describe('ColumnMoveActionDirective', () => {
  beforeEach(function (this: any) {
    TestBed.configureTestingModule({
      imports: [ClrDatagridModule, CommonModule, DragDropModule, NoopAnimationsModule, TestClrDatagridHostComponent],
    });

    this.fixture = TestBed.createComponent(TestClrDatagridHostComponent);
    this.fixture.detectChanges();
  });

  function toggleMenu(this: any, columnIndex: number) {
    this.fixture.debugElement.queryAll(By.css('.datagrid-column-actions-toggle'))[columnIndex].nativeElement.click();
    this.fixture.detectChanges();
  }

  function moveButton(label: string): HTMLElement {
    return Array.from(document.querySelectorAll<HTMLElement>('.dropdown-menu .dropdown-item')).find(
      item => item.textContent.trim() === label
    );
  }

  it('is enabled in the middle and disabled at both edges', function (this: any) {
    toggleMenu.call(this, 0);
    expect(moveButton('Move to Start').getAttribute('aria-disabled')).toBe('true');
    expect(moveButton('Move Left').getAttribute('aria-disabled')).toBe('true');
    expect(moveButton('Move Right').getAttribute('aria-disabled')).toBe('false');
    expect(moveButton('Move to End').getAttribute('aria-disabled')).toBe('false');
    toggleMenu.call(this, 0);

    toggleMenu.call(this, 1);
    expect(moveButton('Move to Start').getAttribute('aria-disabled')).toBe('false');
    expect(moveButton('Move Left').getAttribute('aria-disabled')).toBe('false');
    expect(moveButton('Move Right').getAttribute('aria-disabled')).toBe('false');
    expect(moveButton('Move to End').getAttribute('aria-disabled')).toBe('false');
    toggleMenu.call(this, 1);

    toggleMenu.call(this, 2);
    expect(moveButton('Move to Start').getAttribute('aria-disabled')).toBe('false');
    expect(moveButton('Move Left').getAttribute('aria-disabled')).toBe('false');
    expect(moveButton('Move Right').getAttribute('aria-disabled')).toBe('true');
    expect(moveButton('Move to End').getAttribute('aria-disabled')).toBe('true');
    toggleMenu.call(this, 2);
  });

  it('moves the column when clicked', function (this: any) {
    expect(new GridHelper(this.fixture.debugElement).getHeaders()).toEqual(['Name', 'State', 'Status']);

    toggleMenu.call(this, 0);
    moveButton('Move Right').click();
    this.fixture.detectChanges();

    expect(new GridHelper(this.fixture.debugElement).getHeaders()).toEqual(['State', 'Name', 'Status']);
  });

  it('jumps to the end when clicked', function (this: any) {
    toggleMenu.call(this, 0);
    moveButton('Move to End').click();
    this.fixture.detectChanges();

    expect(new GridHelper(this.fixture.debugElement).getHeaders()).toEqual(['State', 'Status', 'Name']);
  });

  it('does nothing when a disabled action is clicked', function (this: any) {
    toggleMenu.call(this, 0);
    moveButton('Move Left').click();
    this.fixture.detectChanges();

    expect(new GridHelper(this.fixture.debugElement).getHeaders()).toEqual(['Name', 'State', 'Status']);
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
    { direction: 'start', label: 'Move to Start' },
    { direction: 'left', label: 'Move Left' },
    { direction: 'right', label: 'Move Right' },
    { direction: 'end', label: 'Move to End' },
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

  // Mirrors DatagridComponent.onColumnOrderChange, which rebuilds the column views on every move so
  // that the order renders and the actions menu does not outlive the trigger it is anchored to.
  onColumnOrderChange(data: ColumnOrderChanged) {
    const reordered = data.columns;
    this.columns = [];
    this.cdr.detectChanges();
    this.columns = reordered;
    this.cdr.detectChanges();
    this.clrDatagrid.resize();
  }
}

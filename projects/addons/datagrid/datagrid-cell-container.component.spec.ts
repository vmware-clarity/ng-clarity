/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DatagridCellContainerComponent } from './datagrid-cell-container.component';
import { ColumnDefinition } from './shared/column/column-definitions';

const testColumnName = 'test-column';
const testItemName = 'test-item';

@Component({
  selector: 'test-mock-column-renderer',
  standalone: false,
  template: ` <span>{{ $any(item)[column.field] }}</span> `,
})
export class MockColumnRendererComponent {
  @Input() column: ColumnDefinition<unknown> = {
    field: testColumnName,
    displayName: 'display-name',
  };

  @Input() item: unknown = { [testColumnName]: testItemName };
}

describe('DatagridCellContainerComponent', () => {
  let component: DatagridCellContainerComponent;
  let fixture: ComponentFixture<DatagridCellContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatagridCellContainerComponent],
    });

    fixture = TestBed.createComponent(DatagridCellContainerComponent);
    component = fixture.componentInstance;
  });

  it('should render the item field value if no columnRenderer is provided', () => {
    const fieldName = 'testField';
    const fieldValue = 'testValue';
    component.column = {
      field: fieldName,
    } as ColumnDefinition<unknown>;
    component.item = {
      [fieldName]: fieldValue,
    };
    fixture.detectChanges();

    const cellContainerElement = fixture.nativeElement.querySelector('span');
    expect(cellContainerElement.textContent).toContain(fieldValue);

    expect(fixture.nativeElement.querySelector('test-mock-column-renderer')).toBeNull();
  });

  it('should create and render the columnRenderer if provided', () => {
    component.column = {
      field: testColumnName,
      columnRenderer: MockColumnRendererComponent,
    } as ColumnDefinition<unknown>;

    component.item = { [testColumnName]: testItemName };
    fixture.detectChanges();

    const mockRenderer = fixture.debugElement.query(By.directive(MockColumnRendererComponent));

    expect(mockRenderer).toBeDefined();
    expect(mockRenderer.query(By.css('span')).nativeElement.textContent).toContain(testItemName);
    expect(mockRenderer.componentInstance.item).toEqual(component.item);
    expect(mockRenderer.componentInstance.column).toEqual(component.column);
  });
});

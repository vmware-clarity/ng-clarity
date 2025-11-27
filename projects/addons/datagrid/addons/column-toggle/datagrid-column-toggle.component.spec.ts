/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkConnectedOverlay, OverlayModule } from '@angular/cdk/overlay';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { DatagridStrings } from '../../i18n/datagrid-strings.service';
import { ColumnHiddenState } from '../../interfaces/column-state';
import { ColumnDefinition } from '../../shared/column/column-definitions';
import { DatagridColumnToggleComponent } from './datagrid-column-toggle.component';

describe('DatagridColumnToggleComponent', () => {
  let fixture: ComponentFixture<DatagridColumnToggleComponent>;
  let component: DatagridColumnToggleComponent;
  let columnsDefs: Array<ColumnDefinition<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, OverlayModule],
      providers: [{ provide: DatagridStrings, useClass: DatagridStrings }],
      declarations: [DatagridColumnToggleComponent],
    });

    fixture = TestBed.createComponent<DatagridColumnToggleComponent>(DatagridColumnToggleComponent);
    component = fixture.componentInstance;
    columnsDefs = [
      { uid: 'name', displayName: 'Name', field: 'name', width: '10px' },
      {
        uid: 'powerState',
        displayName: 'State',
        field: 'powerState',
        hidden: true,
        width: '100px',
      },
      { uid: 'status', displayName: 'Status', field: 'status', hideable: false, width: '100px' },
    ] as Array<ColumnDefinition<any>>;
    component.columnHiddenStateChange = new EventEmitter<ColumnHiddenState>();
    component.columns = [...columnsDefs];
  });

  it('does not show non-hideable columns', () => {
    const hideableColumns = component.hideableColumns();
    expect(hideableColumns.length).toEqual(2);
    expect(hideableColumns[0].displayName).toEqual('Name');
    expect(hideableColumns[1].displayName).toEqual('State');
  });

  it('emits notification and shows all columns on select all', () => {
    spyOn(component.columnHiddenStateChange, 'emit');
    component.onSelectAll();
    expect(component.columns[1].hidden).toBeFalsy();
    expect(component.columnHiddenStateChange.emit).toHaveBeenCalledWith({
      hidden: false,
      column: component.columns[1],
    });
  });

  it('SELECT ALL option is disabled if all columns are already visible', () => {
    expect(component.allColumnsSelected()).toEqual(false);
    component.onSelectAll();
    expect(component.allColumnsSelected()).toEqual(true);
  });

  it('should hide and show a column using showColumn and hideColumn methods', () => {
    spyOn(component.columnsChange, 'emit');
    spyOn(component.columnHiddenStateChange, 'emit');

    // Hide column
    component.hideColumn(component.columns[0].field);
    expect(component.columns[0].hidden).toBe(true);

    // Show column
    component.showColumn(component.columns[0].field);
    expect(component.columns[0].hidden).toBe(false);
  });

  it('should have only one visible column when conditions apply', () => {
    component.columns = [
      { displayName: 'Name', field: 'name', hidden: false },
      { displayName: 'State', field: 'state', hidden: true },
      { displayName: 'Status', field: 'status', hidden: true },
    ];
    expect(component.hasOnlyOneVisibleColumn).toBe(true);

    // If more than one column is visible, it should return false
    component.columns[1].hidden = false;
    expect(component.hasOnlyOneVisibleColumn).toBe(false);
  });

  it('should set the viewId and overlay on onAttach', () => {
    const overlayMock = {
      overlayRef: {
        overlayElement: {
          id: 'test-id',
        },
      },
    } as unknown as CdkConnectedOverlay;

    component.onAttach(overlayMock);
    expect(component.viewId).toEqual('test-id');
    expect(component.overlay).toEqual(overlayMock);
  });

  it('should reset viewId and openState on onDetach', () => {
    component.viewId = 'test-id';
    component.openState = true;

    component.onDetach();
    expect(component.viewId).toBeUndefined();
    expect(component.openState).toBe(false);
  });

  it('should reset openState to false on ngOnDestroy', () => {
    component.openState = true;
    component.ngOnDestroy();
    expect(component.openState).toBe(false);
  });

  afterEach(() => {
    fixture.destroy();
  });
});

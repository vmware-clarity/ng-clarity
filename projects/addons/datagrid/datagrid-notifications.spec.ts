/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, QueryList, SimpleChange } from '@angular/core';
import { fakeAsync, flush } from '@angular/core/testing';
import { ClrDatagrid, SelectionType } from '@clr/angular/data/datagrid';

import { ExportProviderService } from './addons/export/export-provider.service';
import { DatagridComponent } from './datagrid.component';
import { DatagridStrings } from './i18n/datagrid-strings.service';

describe('Datagrid deferred row notifications', () => {
  let component: DatagridComponent<unknown>;
  let notify: jasmine.Spy;

  beforeEach(() => {
    component = new DatagridComponent(
      {} as DatagridStrings,
      'test',
      {} as ChangeDetectorRef,
      {} as ExportProviderService,
      null,
      null
    );
    component.serverDrivenDatagrid = true;
    component.selectionType = SelectionType.Multi;
    component.trackByGridItemProperty = 'id';
    component.gridItems = [];
    const rows = new QueryList<unknown>();
    notify = spyOn(rows, 'notifyOnChanges');
    component['clrDatagrid'] = { rows } as unknown as ClrDatagrid;
  });

  afterEach(() => component.ngOnDestroy());

  function updateItems() {
    component.ngOnChanges({ gridItems: new SimpleChange([], [], false) });
  }

  it('notifies rows after server data changes have rendered', async () => {
    updateItems();
    expect(notify).not.toHaveBeenCalled();
    await new Promise<void>(resolve => setTimeout(resolve));
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it('preserves fakeAsync flush compatibility for queued row notifications', fakeAsync(() => {
    updateItems();
    expect(notify).not.toHaveBeenCalled();
    flush();
    expect(notify).toHaveBeenCalledTimes(1);
  }));

  it('cancels every pending row notification when destroyed', async () => {
    updateItems();
    updateItems();
    component.ngOnDestroy();
    await new Promise<void>(resolve => setTimeout(resolve));
    expect(notify).not.toHaveBeenCalled();
  });
});

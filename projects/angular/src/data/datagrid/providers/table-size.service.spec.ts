/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';
import { ClrDatagridModule } from '../datagrid.module';
import { DatagridRenderOrganizer } from '../render/render-organizer';
import { ColumnsService } from './columns.service';
import { DetailService } from './detail.service';
import { FiltersProvider } from './filters';
import { Page } from './page';
import { Sort } from './sort';
import { StateDebouncer } from './state-debouncer.provider';
import { TableSizeService } from './table-size.service';

@Component({
  template: `
    <div [style.height.px]="height">
      <clr-dg-column [style.width.px]="202">Col 1</clr-dg-column>
      <clr-dg-column [style.width.px]="122">Col 2</clr-dg-column>
      <clr-dg-column [style.width.px]="302">Col 3</clr-dg-column>
      <clr-dg-column [style.width.px]="42">Col 4</clr-dg-column>
    </div>
  `,
  providers: [TableSizeService],
})
class TestComponent {
  height = 300;

  constructor(public elementRef: ElementRef<HTMLElement>) {}
}

interface TestContext {
  fixture: ComponentFixture<TestComponent>;
  sizeService: TableSizeService;
  table: HTMLElement;
}

const PROVIDERS_NEEDED = [
  Sort,
  FiltersProvider,
  DatagridRenderOrganizer,
  DomAdapter,
  DetailService,
  Page,
  StateDebouncer,
  ColumnsService,
];

export default function (): void {
  describe('TableSizeService', function () {
    beforeEach(function (this: TestContext) {
      TestBed.configureTestingModule({
        imports: [ClrDatagridModule],
        declarations: [TestComponent],
        providers: [PROVIDERS_NEEDED],
      });
      this.fixture = TestBed.createComponent(TestComponent);
      this.sizeService = this.fixture.debugElement.injector.get(TableSizeService);
      this.fixture.detectChanges();
      this.table = this.fixture.elementRef.nativeElement.children[0]; // reference to the TestComponnt table
      this.sizeService.tableRef = this.table; // setting service up with the component table for testing
    });

    it('sets a tableRef property with an elementReference', function () {
      // sizeService.tableRef is set in beforeEach
      expect(this.sizeService.tableRef).toBeDefined();
    });

    it('calculates the correct column drag height', function (this: TestContext) {
      expect(this.sizeService.getColumnDragHeight()).toEqual('300px');
      this.fixture.componentInstance.height = 422;
      this.fixture.detectChanges();
      expect(this.sizeService.getColumnDragHeight()).toEqual('422px');
    });
  });
}

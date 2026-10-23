/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomAdapter } from '@clr/angular/utils';

import { ClrDatagridModule } from '../datagrid.module';
import { ColumnsService } from './columns.service';
import { DetailService } from './detail.service';
import { FiltersProvider } from './filters';
import { Page } from './page';
import { Sort } from './sort';
import { StateDebouncer } from './state-debouncer.provider';
import { TableSizeService } from './table-size.service';
import { DatagridRenderOrganizer } from '../render/render-organizer';

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
  standalone: false,
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

describe('Datagrid', () => {
  describe('Providers', () => {
    describe('TableSizeService', () => {
      let testContext: TestContext;
      beforeEach(() => {
        testContext = {} as TestContext;
      });

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrDatagridModule],
          declarations: [TestComponent],
          providers: [PROVIDERS_NEEDED],
        });
        testContext.fixture = TestBed.createComponent(TestComponent);
        testContext.sizeService = testContext.fixture.debugElement.injector.get(TableSizeService);
        testContext.fixture.detectChanges();
        testContext.table = testContext.fixture.elementRef.nativeElement.children[0]; // reference to the TestComponnt table
        testContext.sizeService.tableRef = testContext.table; // setting service up with the component table for testing
      });

      it('sets a tableRef property with an elementReference', () => {
        const untypedContext: any = testContext;

        // sizeService.tableRef is set in beforeEach
        expect(untypedContext.sizeService.tableRef).toBeDefined();
      });

      it('calculates the correct column drag height', () => {
        expect(testContext.sizeService.getColumnDragHeight()).toEqual('300px');
        testContext.fixture.componentInstance.height = 422;
        testContext.fixture.detectChanges();
        expect(testContext.sizeService.getColumnDragHeight()).toEqual('422px');
      });
    });
  });
});

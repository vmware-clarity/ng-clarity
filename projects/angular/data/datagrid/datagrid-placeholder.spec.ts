/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createTestHelpers, TestContext } from '@clr/angular/testing';

import { ClrDatagridPlaceholder } from './datagrid-placeholder';
import { FiltersProvider } from './providers/filters';
import { Items } from './providers/items';
import { Page } from './providers/page';
import { Sort } from './providers/sort';
import { StateDebouncer } from './providers/state-debouncer.provider';

describe('Datagrid', () => {
  describe('Components', () => {
    describe('ClrDatagridPlaceholder component', () => {
      const helpers = createTestHelpers();

      let testContext: any;
      beforeEach(() => {
        testContext = {};
      });

      describe('Typescript API', () => {
        beforeEach(() => {
          testContext.pageProvider = new Page(new StateDebouncer());
          testContext.itemsProvider = new Items(null, null, testContext.pageProvider);
          testContext.component = new ClrDatagridPlaceholder(testContext.itemsProvider);
        });

        it('detects if the Datagrid is empty', () => {
          expect(testContext.component.emptyDatagrid).toBe(true);
          testContext.itemsProvider.all = new Array(1);
          expect(testContext.component.emptyDatagrid).toBe(false);
          testContext.itemsProvider.all = [];
          expect(testContext.component.emptyDatagrid).toBe(true);
        });
      });

      describe('View', () => {
        let context: TestContext<ClrDatagridPlaceholder<void>, SimpleTest>;
        let itemsProvider: Items<void>;

        beforeEach(() => {
          context = helpers.create<ClrDatagridPlaceholder<void>, SimpleTest>(ClrDatagridPlaceholder, SimpleTest, [
            Items,
            Page,
            Sort,
            FiltersProvider,
            StateDebouncer,
          ]);
          itemsProvider = TestBed.inject(Items);
        });

        it('is empty when there are items', () => {
          itemsProvider.all = new Array(1);
          context.detectChanges();
          expect(context.clarityElement.textContent.trim()).toMatch('');
        });

        it('is empty when the data is loading', () => {
          itemsProvider.loading = true;
          context.detectChanges();
          expect(context.clarityElement.textContent.trim()).toMatch('');
        });

        it('projects content when there are no items', () => {
          expect(context.clarityElement.textContent.trim()).toMatch('Hello world');
        });
      });
    });
  });
});

@Component({
  template: `<clr-dg-placeholder>Hello world</clr-dg-placeholder>`,
  standalone: false,
})
class SimpleTest {}

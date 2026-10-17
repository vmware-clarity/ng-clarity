/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { createTestHelpers, TestContext } from '@clr/angular/testing';

import { ClrDatagridActionBar } from './datagrid-action-bar';
import { FiltersProvider } from './providers/filters';
import { Items } from './providers/items';
import { Page } from './providers/page';
import { Selection } from './providers/selection';
import { Sort } from './providers/sort';

describe('Datagrid', () => {
  describe('Components', () => {
    describe('DatagridActionBar component', () => {
      const helpers = createTestHelpers();

      let context: TestContext<ClrDatagridActionBar, SimpleTest>;

      beforeEach(() => {
        context = helpers.create(ClrDatagridActionBar, SimpleTest, [Selection, Items, FiltersProvider, Sort, Page]);
      });

      afterEach(() => {
        context.fixture.destroy();
        const popoverContent = document.querySelectorAll('.clr-popover-content');
        popoverContent.forEach(content => document.body.removeChild(content));
      });

      it('projects content', () => {
        expect(context.clarityElement.textContent.trim()).toMatch('Hello world');
      });
    });
  });
});

@Component({
  template: `<clr-dg-action-bar>Hello world</clr-dg-action-bar>`,
  standalone: false,
})
class SimpleTest {}

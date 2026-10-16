/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Directive } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { spec, TestContext } from '@clr/angular/testing';

import { ClrDatagridPagination } from './datagrid-pagination';
import { ClrDatagridModule } from './datagrid.module';
import { Page } from './providers/page';

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column>Column</clr-dg-column>

      <clr-dg-row *clrDgItems="let item of items" instantiationCounter>
        <clr-dg-cell>{{ item }}</clr-dg-cell>
      </clr-dg-row>

      <clr-dg-footer>
        <clr-dg-pagination [clrDgPageSize]="20"></clr-dg-pagination>
      </clr-dg-footer>
    </clr-datagrid>
  `,
  standalone: false,
})
class IntegrationTest {
  items = Array(100).fill(0);
}

/**
 * We cannot spy on constructors in Typescript, so this tricks allows us to count the number
 * of rows instantiated during a test.
 */
@Directive({
  selector: '[instantiationCounter]',
  standalone: false,
})
class InstantiationCounter {
  static total = 0;

  constructor() {
    InstantiationCounter.total++;
  }
}

export default function (): void {
  describe('ClrDatagridPagination component integration', () => {
    let testContext: Context;

    type Context = TestContext<ClrDatagridPagination, IntegrationTest>;

    const getContext = spec(
      ClrDatagridPagination,
      IntegrationTest,
      ClrDatagridModule,
      { declarations: [InstantiationCounter], imports: [NoopAnimationsModule] },
      false
    );
    beforeEach(() => {
      testContext = getContext() as Context;
    });

    it('sets the page size a single time on initialization', () => {
      const spy = spyOnProperty(Page.prototype, 'size', 'set').and.callThrough();
      testContext.init();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(20);
    });

    it('only instantiates rows that need to be displayed', () => {
      InstantiationCounter.total = 0;
      testContext.init();
      expect(InstantiationCounter.total).toBe(20);
    });
  });
}

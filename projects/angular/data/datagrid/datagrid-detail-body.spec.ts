/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrDatagridDetailBody } from './datagrid-detail-body';
import { TestContext } from './helpers.spec';

const content = 'Detail Pane';

export default function (): void {
  describe('ClrDatagridDetailBody component', function () {
    describe('View', function () {
      let context: TestContext<ClrDatagridDetailBody, FullTest>;

      beforeEach(function () {
        context = this.create(ClrDatagridDetailBody, FullTest);
        context.detectChanges();
      });

      it('should wire up host bindings', () => {
        expect(context.clarityElement.className).toContain('datagrid-detail-body');
      });

      it('projects content into the detail pane ', () => {
        expect(context.clarityElement.innerHTML).toContain(content);
      });
    });
  });
}

@Component({
  template: `<clr-dg-detail-body>${content}</clr-dg-detail-body>`,
  standalone: false,
})
class FullTest {}

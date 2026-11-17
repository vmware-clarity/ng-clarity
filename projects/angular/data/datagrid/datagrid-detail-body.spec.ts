/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createTestHelpers, TestContext } from '@clr/angular/testing';

import { ClrDatagridDetailBody } from './datagrid-detail-body';

const content = 'Detail Pane';

describe('ClrDatagridDetailBody component', () => {
  const helpers = createTestHelpers();

  describe('View', () => {
    let context: TestContext<ClrDatagridDetailBody, FullTest>;

    beforeEach(() => {
      context = helpers.create(ClrDatagridDetailBody, FullTest);
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

@Component({
  template: `<clr-dg-detail-body>${content}</clr-dg-detail-body>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class FullTest {}

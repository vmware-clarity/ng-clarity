/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { DatagridIfExpandService } from './datagrid-if-expanded.service';
import { ClrDatagridRowDetail } from './datagrid-row-detail';
import { DATAGRID_SPEC_PROVIDERS, TestContext } from './helpers.spec';

export default function (): void {
  describe('ClrDatagridRowDetail component', function () {
    let context: TestContext<ClrDatagridRowDetail, FullTest>;

    beforeEach(function () {
      context = this.create(ClrDatagridRowDetail, FullTest, DATAGRID_SPEC_PROVIDERS);
    });

    it('projects content', function () {
      expect(context.clarityElement.textContent.trim()).toMatch('Hello world');
    });

    it('adds the .datagrid-row-flex class to the host', function () {
      expect(context.clarityElement.classList.contains('datagrid-row-flex')).toBe(true);
    });

    it('adds the .datagrid-row-detail class to the host', function () {
      expect(context.clarityElement.classList.contains('datagrid-row-detail')).toBe(true);
    });

    it("adds the .datagrid-container class to the host if it doesn't contain cells", function () {
      expect(context.clarityElement.classList.contains('datagrid-container')).toBe(true);
      context.testComponent.cell = true;
      context.detectChanges();
      expect(context.clarityElement.classList.contains('datagrid-container')).toBe(false);
    });

    it('updates the Expand provider with the [clrDgReplace] input', function () {
      const expand: DatagridIfExpandService = context.getClarityProvider(DatagridIfExpandService);
      let expandState = false;
      expand.replace.subscribe(state => {
        expandState = state;
      });
      expect(expandState).toBe(false);
      context.testComponent.replace = true;
      context.detectChanges();
      expect(expandState).toBe(true);
    });

    it('should add helper text', function () {
      const rows: HTMLElement[] = context.clarityElement.querySelectorAll('.clr-sr-only');

      expect(rows[0].innerText.trim()).toBe(
        "Beginning of Expandable row content Screen reader table commands may not work for viewing expanded content, please use your screen reader's browse mode to read the content exposed by this button"
      );
      expect(rows[1].innerText.trim()).toBe('End of Expandable row content');
    });

    it('should add id to the root element', function () {
      expect(context.clarityElement.getAttribute('id')).not.toBeNull();
    });

    it('should have role=gridcell', function () {
      expect(context.clarityElement.getAttribute('role')).toBe('gridcell');
    });
  });
}

@Component({
  template: `
    <clr-dg-row-detail [clrDgReplace]="replace">
      <ng-container *ngIf="!cell">Hello world</ng-container>
      <clr-dg-cell *ngIf="cell">This is a cell</clr-dg-cell>
    </clr-dg-row-detail>
  `,
})
class FullTest {
  replace = false;
  cell = false;
}

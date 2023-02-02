/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ClrDatagridFooter } from './datagrid-footer';
import { SelectionType } from './enums/selection-type';
import { DATAGRID_SPEC_PROVIDERS, TestContext } from './helpers.spec';
import { ColumnsService } from './providers/columns.service';
import { MOCK_COLUMN_SERVICE_PROVIDER, MockColumnsService } from './providers/columns.service.mock';
import { DetailService } from './providers/detail.service';

export default function (): void {
  describe('ClrDatagridFooter component', function () {
    describe('View', function () {
      let context: TestContext<ClrDatagridFooter<number>, SimpleTest>;

      beforeEach(function () {
        context = this.create(ClrDatagridFooter, SimpleTest, DATAGRID_SPEC_PROVIDERS);
      });

      afterEach(function () {
        context.fixture.destroy();
        const popoverContent = document.querySelectorAll('.clr-popover-content');
        popoverContent.forEach(content => document.body.removeChild(content));
      });

      it('projects content', function () {
        expect(context.clarityElement.textContent.trim()).toMatch('Hello world');
      });

      it('adds the .datagrid-cell class to the host', function () {
        expect(context.clarityElement.classList.contains('datagrid-footer')).toBeTruthy();
      });

      it('does not show the selection details when selection type is None', function () {
        const clarityDirectiveSelection = context.clarityDirective.selection;
        clarityDirectiveSelection.selectionType = SelectionType.None;

        context.detectChanges();

        expect(context.clarityElement.querySelector('.datagrid-footer-select')).toBeNull();
      });

      it('does not show the selection details when selection type is single', function () {
        const clarityDirectiveSelection = context.clarityDirective.selection;
        clarityDirectiveSelection.selectionType = SelectionType.Single;
        clarityDirectiveSelection.current.push(1);

        context.detectChanges();

        expect(context.clarityElement.querySelector('.datagrid-footer-select')).toBeNull();
      });

      it('shows the selection details when more than one item is selected', function () {
        const clarityDirectiveSelection = context.clarityDirective.selection;
        clarityDirectiveSelection.selectionType = SelectionType.Multi;
        clarityDirectiveSelection.current.push(1);

        context.detectChanges();

        expect(context.clarityElement.querySelector('.datagrid-footer-select')).not.toBeNull();
        expect(context.clarityElement.querySelector('.datagrid-footer-select').textContent).toMatch('1');

        clarityDirectiveSelection.current.push(1);
        context.detectChanges();

        expect(context.clarityElement.querySelector('.datagrid-footer-select')).not.toBeNull();
        expect(context.clarityElement.querySelector('.datagrid-footer-select').textContent).toMatch('2');

        clarityDirectiveSelection.current = [];
        context.detectChanges();

        expect(context.clarityElement.querySelector('.datagrid-footer-select')).toBeNull();
      });
    });

    describe('View with Detail Pane open', function () {
      let context: TestContext<ClrDatagridFooter<void>, SimpleTest>;

      beforeEach(function () {
        context = this.create(ClrDatagridFooter, SimpleTest, [
          ...DATAGRID_SPEC_PROVIDERS,
          MOCK_COLUMN_SERVICE_PROVIDER,
        ]);

        // mock a hideable column
        const columnsService = context.getClarityProvider(ColumnsService) as MockColumnsService;
        columnsService.columns.push(new BehaviorSubject({} as any));
        columnsService.mockAllHideable();

        context.detectChanges();
      });

      it('shows condensed footer with detail pane', function () {
        expect(context.clarityElement.querySelector('clr-dg-column-toggle')).toBeTruthy();
        context.getClarityProvider(DetailService).open({});
        context.detectChanges();
        expect(context.clarityElement.querySelector('clr-dg-column-toggle')).toBeFalsy();
      });
    });
  });
}

@Component({
  template: `<clr-dg-footer>Hello world</clr-dg-footer>`,
})
class SimpleTest {}

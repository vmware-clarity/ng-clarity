/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createTestHelpers, TestContext } from '@clr/angular/testing';

import { ClrDatagridCell } from './datagrid-cell';
import { DatagridRenderOrganizer } from './render/render-organizer';

describe('Datagrid', () => {
  describe('Components', () => {
    describe('ClrDatagridCell component', () => {
      const helpers = createTestHelpers();

      let testContext: any;
      beforeEach(() => {
        testContext = {};
      });

      let context: TestContext<ClrDatagridCell, SimpleTest>;

      beforeEach(() => {
        context = helpers.create(ClrDatagridCell, SimpleTest, [DatagridRenderOrganizer]);
      });

      afterEach(() => {
        context.fixture.destroy();
        const popoverContent = document.querySelectorAll('.clr-popover-content');
        popoverContent.forEach(content => document.body.removeChild(content));
      });

      it('provides a wrapped view for the content', () => {
        testContext.directive = context.clarityDirective;
        expect(testContext.directive._view).toBeDefined();
      });

      it('projects content', () => {
        expect(context.clarityElement.textContent.trim()).toMatch('Hello world');
      });

      it('adds the .datagrid-cell class to the host', () => {
        expect(context.clarityElement.classList.contains('datagrid-cell')).toBeTruthy();
      });

      it('does only adds .datagrid-signpost-trigger class when there is a signpost', () => {
        expect(context.clarityElement.classList.contains('datagrid-signpost-trigger')).toBeFalsy();
        context.testComponent.signpostTest = true;
        context.detectChanges();
        expect(context.clarityElement.classList.contains('datagrid-signpost-trigger')).toBeTruthy();
      });

      it('adds a11y roles to the cell', () => {
        expect(context.clarityElement.attributes.role.value).toBe('gridcell');
      });
    });
  });
});

@Component({
  template: `
    <clr-dg-cell>
      Hello world
      @if (signpostTest) {
        <clr-signpost>
          <clr-signpost-content *clrIfOpen>The user is strong.</clr-signpost-content>
        </clr-signpost>
      }
    </clr-dg-cell>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class SimpleTest {
  signpostTest = false;
}

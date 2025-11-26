/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestContext } from '@clr/angular/testing';

import { ClrDatagridDetail } from './datagrid-detail';
import { DetailService } from './providers/detail.service';

const content = 'Detail Pane';

export default function (): void {
  describe('ClrDatagridDetail component', function () {
    describe('Typescript API', function () {
      let context: TestContext<ClrDatagridDetail, FullTest>;

      beforeEach(function () {
        context = this.create(ClrDatagridDetail, FullTest, [DetailService]);
        context.detectChanges();
      });

      afterEach(function () {
        context.fixture.destroy();
      });

      it('should wire up host bindings', () => {
        expect(context.clarityElement.className).toContain('datagrid-detail-pane');
      });
    });

    describe('View', function () {
      let context: TestContext<ClrDatagridDetail, FullTest>;
      let detailService: DetailService;

      beforeEach(function () {
        context = this.create(ClrDatagridDetail, FullTest, [DetailService]);
        detailService = context.getClarityProvider(DetailService);
        detailService.id = 'clr-id-1';
        context.detectChanges();
      });

      it('projects content into the detail pane when open', () => {
        expect(context.clarityElement.innerHTML).not.toContain(content);
        detailService.open({});
        context.detectChanges();
        expect(context.clarityElement.innerHTML).toContain(content);
        detailService.close();
        context.detectChanges();
        expect(context.clarityElement.innerHTML).not.toContain(content);
      });

      it('hides content with the esc key', async () => {
        spyOn(detailService, 'close');
        detailService.open({});
        context.detectChanges();
        expect(context.clarityElement.innerHTML).toContain(content);
        const event = new KeyboardEvent('keyup', { key: 'Escape' });
        document.body.dispatchEvent(event);
        context.detectChanges();
        expect(detailService.close).toHaveBeenCalled();
      });

      it('conditionally enables focus trap when opened', () => {
        expect(context.clarityElement.innerHTML).not.toContain('cdktrapfocus');
        detailService.open({});
        context.detectChanges();
        expect(context.clarityElement.innerHTML).toContain('cdktrapfocus');
        detailService.close();
        context.detectChanges();
        expect(context.clarityElement.innerHTML).not.toContain('cdktrapfocus');
      });

      it('should have text based boundaries for screen readers', () => {
        detailService.open({});
        context.detectChanges();
        const messages = context.testElement.querySelectorAll('.clr-sr-only');
        expect(messages[0].innerText).toBe('Start of row details');
        expect(messages[1].innerText).toBe('End of row details');
      });

      it('should have aria-labelledby attribute by default', function () {
        detailService.open({});
        context.detectChanges();
        const detailDialog = context.clarityElement.querySelector('[role="dialog"]');
        const headerTitle = detailDialog.querySelector('.datagrid-detail-header-title');
        expect(detailDialog.hasAttribute('aria-labelledby')).toEqual(true);
        expect(detailDialog.getAttribute('aria-labelledby')).toBe(headerTitle.getAttribute('id'));
      });

      it('should allow a custom id value for aria-labelledby along with the default id', function () {
        context.testComponent.ariaLabelledBy = 'customId';
        detailService.open({});
        context.detectChanges();
        const detailDialog = context.clarityElement.querySelector('[role="dialog"]');
        const headerTitle = detailDialog.querySelector('.datagrid-detail-header-title');
        expect(detailDialog.getAttribute('aria-labelledby')).toBe(headerTitle.getAttribute('id') + ' customId');
      });

      it('should add only aria-label attribute if clrDetailAriaLabel input is available', () => {
        context.testComponent.ariaLabel = 'customLabel';
        detailService.open({});
        context.detectChanges();
        const detailDialog = context.clarityElement.querySelector('[role="dialog"]');
        expect(detailDialog.hasAttribute('aria-labelledby')).toEqual(false);
        expect(detailDialog.hasAttribute('aria-label')).toEqual(true);
        expect(detailDialog.getAttribute('aria-label')).toEqual('customLabel');
      });

      it('should add only aria-labelledby attribute if both clrDetailAriaLabelledBy and clrDetailAriaLabel inputs are available', () => {
        context.testComponent.ariaLabelledBy = 'customId';
        context.testComponent.ariaLabel = 'customLabel';
        detailService.open({});
        context.detectChanges();
        const detailDialog = context.clarityElement.querySelector('[role="dialog"]');
        expect(detailDialog.hasAttribute('aria-labelledby')).toEqual(true);
        expect(detailDialog.hasAttribute('aria-label')).toEqual(false);
      });
    });
  });
}

@Component({
  template: `
    <clr-dg-detail [clrDetailAriaLabelledBy]="ariaLabelledBy" [clrDetailAriaLabel]="ariaLabel">
      <clr-dg-detail-header>Title</clr-dg-detail-header>
      <clr-dg-detail-body>${content}</clr-dg-detail-body>
    </clr-dg-detail>
  `,
  standalone: false,
})
class FullTest {
  ariaLabelledBy: string;
  ariaLabel: string;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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

      describe('clrDetailWidth', () => {
        it('should have a default width of 66', () => {
          expect(context.clarityDirective.detailWidth).toBe(66);
          expect(context.clarityElement.style.width).toBe('66%');
          expect(context.clarityElement.classList).not.toContain('datagrid-detail-custom-width');
        });

        it('should accept a valid percentage value', () => {
          context.testComponent.detailWidth = 50;
          context.detectChanges();

          expect(context.clarityDirective.detailWidth).toBe(50);
          expect(context.clarityElement.style.width).toBe('50%');
          expect(context.clarityElement.classList).toContain('datagrid-detail-custom-width');
        });

        it('should clamp values below 0 to 0', () => {
          context.testComponent.detailWidth = -10;
          context.detectChanges();

          expect(context.clarityDirective.detailWidth).toBe(0);
          expect(context.clarityElement.style.width).toBe('0%');
          expect(context.clarityElement.classList).toContain('datagrid-detail-custom-width');
        });

        it('should clamp values above 100 to 100', () => {
          context.testComponent.detailWidth = 150;
          context.detectChanges();

          expect(context.clarityDirective.detailWidth).toBe(100);
          // At 100% the inline style is intentionally absent so the CSS overlay rule takes over.
          expect(context.clarityElement.style.width).toBe('');
          expect(context.clarityElement.classList).toContain('datagrid-detail-custom-width');
        });

        it('should accept the boundary value 0', () => {
          context.testComponent.detailWidth = 0;
          context.detectChanges();

          expect(context.clarityDirective.detailWidth).toBe(0);
          expect(context.clarityElement.style.width).toBe('0%');
          expect(context.clarityElement.classList).toContain('datagrid-detail-custom-width');
        });

        it('should accept the boundary value 100 without setting an inline style', () => {
          context.testComponent.detailWidth = 100;
          context.detectChanges();

          expect(context.clarityDirective.detailWidth).toBe(100);
          // At 100% the inline style is intentionally absent so the CSS overlay rule takes over.
          expect(context.clarityElement.style.width).toBe('');
          expect(context.clarityElement.classList).toContain('datagrid-detail-custom-width');
        });

        it('should reset to the default (66) when set to null', () => {
          context.testComponent.detailWidth = 40;
          context.detectChanges();
          context.testComponent.detailWidth = null;
          context.detectChanges();

          expect(context.clarityDirective.detailWidth).toBe(66);
          expect(context.clarityElement.style.width).toBe('66%');
          expect(context.clarityElement.classList).not.toContain('datagrid-detail-custom-width');
        });

        it('should reset to the default (66) when set to undefined', () => {
          context.testComponent.detailWidth = 40;
          context.detectChanges();
          context.testComponent.detailWidth = undefined;
          context.detectChanges();

          expect(context.clarityDirective.detailWidth).toBe(66);
          expect(context.clarityElement.style.width).toBe('66%');
          expect(context.clarityElement.classList).not.toContain('datagrid-detail-custom-width');
        });

        it('should update the inline style when the input value changes', () => {
          context.testComponent.detailWidth = 30;
          context.detectChanges();

          expect(context.clarityElement.style.width).toBe('30%');
          expect(context.clarityElement.classList).toContain('datagrid-detail-custom-width');

          context.testComponent.detailWidth = 80;
          context.detectChanges();

          expect(context.clarityElement.style.width).toBe('80%');
          expect(context.clarityElement.classList).toContain('datagrid-detail-custom-width');
        });
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
    <clr-dg-detail
      [clrDetailAriaLabelledBy]="ariaLabelledBy"
      [clrDetailAriaLabel]="ariaLabel"
      [clrDetailWidth]="detailWidth"
    >
      <clr-dg-detail-header>Title</clr-dg-detail-header>
      <clr-dg-detail-body>${content}</clr-dg-detail-body>
    </clr-dg-detail>
  `,
  standalone: false,
})
class FullTest {
  ariaLabelledBy: string;
  ariaLabel: string;
  detailWidth: number | null | undefined;
}

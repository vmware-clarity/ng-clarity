/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { delay, enableCssAnimations, finishAnimations, TestContext } from '@clr/angular/testing';

import { DatagridIfExpandService } from './datagrid-if-expanded.service';
import { ClrDatagridRowDetail } from './datagrid-row-detail';
import { ClrDatagridModule } from './datagrid.module';
import { DATAGRID_SPEC_PROVIDERS } from './helpers.spec';

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

    it('should have role=row', function () {
      expect(context.clarityElement.getAttribute('role')).toBe('row');
    });
  });

  describe('ClrDatagridRowDetail animations', function () {
    let fixture: ComponentFixture<AnimatedDetailTest>;
    let restoreAnimations: () => void;

    beforeEach(function () {
      restoreAnimations = enableCssAnimations();
      TestBed.configureTestingModule({
        imports: [ClrDatagridModule],
        declarations: [AnimatedDetailTest],
        animationsEnabled: true,
      });
      fixture = TestBed.createComponent(AnimatedDetailTest);
    });

    afterEach(function () {
      fixture.destroy();
      restoreAnimations();
    });

    function detail(): HTMLElement {
      return fixture.nativeElement.querySelector('clr-dg-row-detail');
    }

    async function render(expanded: boolean) {
      fixture.componentInstance.expanded = expanded;
      fixture.detectChanges();
      await delay();
    }

    it('does not animate a detail rendered expanded with its row', async function () {
      await render(true);
      expect(detail().classList).not.toContain('clr-expand-enter');
    });

    it('expands the detail when the row is expanded', async function () {
      await render(false);
      await render(true);
      expect(detail().classList).toContain('clr-expand-enter');
    });

    it('does not animate a detail replacing its row', async function () {
      fixture.componentInstance.replace = true;
      await render(false);
      await render(true);
      expect(detail().classList).not.toContain('clr-expand-enter');
    });

    it('collapses the detail before removing it', async function () {
      await render(true);
      await render(false);
      expect(detail().classList).toContain('clr-collapse-leave');

      finishAnimations(fixture.nativeElement);
      // Angular removes the element on the `animationend` event, dispatched with the next frame.
      await new Promise(resolve => requestAnimationFrame(resolve));
      await delay();
      expect(detail()).toBeNull();
    });
  });
}

@Component({
  template: `
    <clr-dg-row-detail [clrDgReplace]="replace">
      @if (!cell) {
        Hello world
      }
      @if (cell) {
        <clr-dg-cell>This is a cell</clr-dg-cell>
      }
    </clr-dg-row-detail>
  `,
  standalone: false,
})
class FullTest {
  replace = false;
  cell = false;
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-row [clrDgExpanded]="expanded">
        <clr-dg-cell>Row</clr-dg-cell>
        <clr-dg-row-detail *clrIfExpanded [clrDgReplace]="replace">Detail</clr-dg-row-detail>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class AnimatedDetailTest {
  expanded = false;
  replace = false;
}

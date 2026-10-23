/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  Component,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
  signal,
  Type,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrDatagridModule } from './datagrid.module';

/*
 * Row content shared by both hosts. Every feature is toggled by a signal after the first render, so the datagrid
 * only shows or hides its fixed columns because the row action / expandable row / detail state is signal-backed.
 */
const ROW_CONTENT = `
  @if (actions()) {
    <clr-dg-action-overflow>
      <button class="action-item">Edit</button>
    </clr-dg-action-overflow>
  }
  <clr-dg-cell>{{ item }}</clr-dg-cell>
  @if (details()) {
    <clr-dg-row-detail *clrIfExpanded>Detail {{ item }}</clr-dg-row-detail>
  }
`;

const DETAIL_PANE = `
  @if (replacementPane()) {
    <ng-template [clrIfDetail]="null" let-detail>
      <clr-dg-detail><clr-dg-detail-body>Replacement for {{ detail }}</clr-dg-detail-body></clr-dg-detail>
    </ng-template>
  }
  @if (detailPane()) {
    <ng-template [(clrIfDetail)]="detailState" let-detail>
      <clr-dg-detail>
        <clr-dg-detail-header>{{ detail }}</clr-dg-detail-header>
        <clr-dg-detail-body>Pane for {{ detail }}</clr-dg-detail-body>
      </clr-dg-detail>
    </ng-template>
  }
`;

abstract class ZonelessDatagridHost {
  readonly items = signal([1, 2, 3]);
  readonly actions = signal(false);
  readonly details = signal(false);
  readonly detailPane = signal(false);
  readonly replacementPane = signal(false);
  detailState: number = null;
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column>Value</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items()" [clrDgItem]="item">${ROW_CONTENT}</clr-dg-row>
      ${DETAIL_PANE}
      <clr-dg-footer>{{ items().length }} items</clr-dg-footer>
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class SmartIteratorHost extends ZonelessDatagridHost {}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column>Value</clr-dg-column>
      @for (item of items(); track item) {
        <clr-dg-row [clrDgItem]="item">${ROW_CONTENT}</clr-dg-row>
      }
      ${DETAIL_PANE}
      <clr-dg-footer>{{ items().length }} items</clr-dg-footer>
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class ForLoopHost extends ZonelessDatagridHost {}

const hosts: [string, Type<ZonelessDatagridHost>][] = [
  ['*clrDgItems', SmartIteratorHost],
  ['@for', ForLoopHost],
];

hosts.forEach(([iterator, hostType]) => {
  describe(`ClrDatagrid (zoneless, OnPush host, ${iterator} rows)`, () => {
    let fixture: ComponentFixture<ZonelessDatagridHost>;
    let host: ZonelessDatagridHost;

    function headerHas(cssClass: string): boolean {
      return !!fixture.nativeElement.querySelector(`.datagrid-header [role=columnheader].${cssClass}`);
    }

    function rows(): HTMLElement[] {
      return Array.from(fixture.nativeElement.querySelectorAll('.datagrid-rows .datagrid-row-master'));
    }

    /** Number of rows that render a fixed cell with the given class. */
    function rowsWith(cssClass: string): number {
      return rows().filter(row => !!row.querySelector(`.datagrid-row-sticky .${cssClass}`)).length;
    }

    beforeEach(async () => {
      TestBed.configureTestingModule({
        declarations: [hostType],
        imports: [ClrDatagridModule],
        providers: [provideZonelessChangeDetection(), provideCheckNoChangesConfig({ exhaustive: true })],
      });

      fixture = TestBed.createComponent(hostType);
      host = fixture.componentInstance;
      await fixture.whenStable();
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('renders no fixed columns initially', () => {
      expect(rows().length).toBe(3);
      expect(headerHas('datagrid-row-actions')).toBeFalse();
      expect(headerHas('datagrid-expandable-caret')).toBeFalse();
      expect(rowsWith('datagrid-row-actions')).toBe(0);
      expect(rowsWith('datagrid-expandable-caret')).toBe(0);
      expect(rowsWith('datagrid-detail-caret')).toBe(0);
    });

    it('shows and hides the action column when action overflows are added and removed late', async () => {
      host.actions.set(true);
      await fixture.whenStable();

      expect(headerHas('datagrid-row-actions')).toBeTrue();
      expect(rowsWith('datagrid-row-actions')).toBe(3);
      expect(fixture.nativeElement.querySelectorAll('clr-dg-action-overflow').length).toBe(3);

      host.actions.set(false);
      await fixture.whenStable();

      expect(headerHas('datagrid-row-actions')).toBeFalse();
      expect(rowsWith('datagrid-row-actions')).toBe(0);
    });

    it('shows the action column for rows that are added late with an action overflow', async () => {
      host.items.set([]);
      host.actions.set(true);
      await fixture.whenStable();

      expect(rows().length).toBe(0);
      expect(headerHas('datagrid-row-actions')).toBeFalse();

      host.items.set([4, 5]);
      await fixture.whenStable();

      expect(rows().length).toBe(2);
      expect(headerHas('datagrid-row-actions')).toBeTrue();
      expect(rowsWith('datagrid-row-actions')).toBe(2);
    });

    it('shows and hides the expand column when row details are added and removed late', async () => {
      host.details.set(true);
      await fixture.whenStable();

      expect(headerHas('datagrid-expandable-caret')).toBeTrue();
      expect(rowsWith('datagrid-expandable-caret')).toBe(3);
      expect(fixture.nativeElement.querySelectorAll('.datagrid-expandable-caret-button').length).toBe(3);

      host.details.set(false);
      await fixture.whenStable();

      expect(headerHas('datagrid-expandable-caret')).toBeFalse();
      expect(rowsWith('datagrid-expandable-caret')).toBe(0);
    });

    it('shows both fixed columns when actions and row details are added together', async () => {
      host.actions.set(true);
      host.details.set(true);
      await fixture.whenStable();

      expect(headerHas('datagrid-row-actions')).toBeTrue();
      expect(headerHas('datagrid-expandable-caret')).toBeTrue();
      expect(rowsWith('datagrid-row-actions')).toBe(3);
      expect(rowsWith('datagrid-expandable-caret')).toBe(3);
    });

    it('shows the detail column instead of the expand carets while a detail pane is present', async () => {
      host.details.set(true);
      await fixture.whenStable();
      expect(rowsWith('datagrid-expandable-caret')).toBe(3);

      // Enabling the detail pane disables expandable rows (ExpandableRowsCount.hasExpandableRow).
      host.detailPane.set(true);
      await fixture.whenStable();

      expect(headerHas('datagrid-expandable-caret')).toBeTrue();
      expect(rowsWith('datagrid-expandable-caret')).toBe(0);
      expect(rowsWith('datagrid-detail-caret')).toBe(3);

      // Removing the detail pane brings the expandable rows back.
      host.detailPane.set(false);
      await fixture.whenStable();

      expect(headerHas('datagrid-expandable-caret')).toBeTrue();
      expect(rowsWith('datagrid-expandable-caret')).toBe(3);
      expect(rowsWith('datagrid-detail-caret')).toBe(0);

      host.details.set(false);
      await fixture.whenStable();

      expect(headerHas('datagrid-expandable-caret')).toBeFalse();
      expect(rowsWith('datagrid-expandable-caret')).toBe(0);
    });

    it('keeps a replacement pane enabled when it is created before the original is destroyed', async () => {
      host.detailPane.set(true);
      await fixture.whenStable();
      host.replacementPane.set(true);
      host.detailPane.set(false);
      await fixture.whenStable();
      expect(rowsWith('datagrid-detail-caret')).toBe(3);

      rows()[1].querySelector<HTMLButtonElement>('.datagrid-detail-caret-button').click();
      await fixture.whenStable();
      expect(fixture.nativeElement.querySelector('clr-dg-detail-body').textContent).toContain('Replacement for 2');
      expect(fixture.nativeElement.querySelector('.datagrid').getAttribute('aria-hidden')).toBe('true');

      host.replacementPane.set(false);
      await fixture.whenStable();
      expect(rowsWith('datagrid-detail-caret')).toBe(0);
      expect(fixture.nativeElement.querySelector('.datagrid').hasAttribute('aria-hidden')).toBeFalse();
    });

    it('restores the grid when an open detail pane is removed', async () => {
      host.detailPane.set(true);
      host.details.set(true);
      await fixture.whenStable();
      rows()[0].querySelector<HTMLButtonElement>('.datagrid-detail-caret-button').click();
      await fixture.whenStable();
      expect(fixture.nativeElement.querySelector('.datagrid').getAttribute('aria-hidden')).toBe('true');

      host.detailPane.set(false);
      await fixture.whenStable();
      expect(fixture.nativeElement.querySelector('clr-dg-detail')).toBeNull();
      expect(fixture.nativeElement.querySelector('.datagrid').hasAttribute('aria-hidden')).toBeFalse();
      expect(
        fixture.nativeElement.querySelector('clr-datagrid').classList.contains('datagrid-detail-open')
      ).toBeFalse();
      expect(rowsWith('datagrid-expandable-caret')).toBe(3);
    });

    it('shows and hides the detail column when a detail pane is added and removed late', async () => {
      host.detailPane.set(true);
      await fixture.whenStable();

      expect(headerHas('datagrid-expandable-caret')).toBeTrue();
      expect(rowsWith('datagrid-detail-caret')).toBe(3);

      rows()[1].querySelector<HTMLButtonElement>('.datagrid-detail-caret-button').click();
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('clr-dg-detail-body').textContent).toContain('Pane for 2');

      (fixture.nativeElement as HTMLElement)
        .querySelector<HTMLButtonElement>('.datagrid-detail-pane-close button')
        .click();
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('clr-dg-detail')).toBeNull();

      host.detailPane.set(false);
      await fixture.whenStable();

      expect(headerHas('datagrid-expandable-caret')).toBeFalse();
      expect(rowsWith('datagrid-detail-caret')).toBe(0);
    });
  });
});

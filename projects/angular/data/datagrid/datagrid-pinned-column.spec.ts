/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestContext } from '@clr/angular/testing';

import { ClrDatagrid } from './datagrid';
import { ColumnsService } from './providers/columns.service';
import { DetailService } from './providers/detail.service';
import { PINNED_COLUMN_CLASS } from './render/constants';

const HEADER_STICKY = '.datagrid-header .datagrid-row-sticky';
const HEADER_SCROLLABLE = '.datagrid-header .datagrid-row-scrollable';

function queryAll(root: HTMLElement, selector: string): HTMLElement[] {
  return Array.from<HTMLElement>(root.querySelectorAll(selector));
}

// The title is read from .datagrid-column-title so the screen reader text of the column separator
// does not end up in the comparison.
function columnTitles(root: HTMLElement, container: string): string[] {
  return queryAll(root, `${container} clr-dg-column .datagrid-column-title`).map(title => title.textContent.trim());
}

function cellsIn(root: HTMLElement, container: string): HTMLElement[][] {
  return queryAll(root, '.datagrid-rows .datagrid-row').map(row => queryAll(row, `${container} clr-dg-cell`));
}

function cellTextsIn(root: HTMLElement, container: string): string[][] {
  return cellsIn(root, container).map(cells => cells.map(cell => cell.textContent.trim()));
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column [clrDgPinnable]="pinFirst">First</clr-dg-column>
      <clr-dg-column [clrDgPinnable]="pinSecond">Second</clr-dg-column>
      <clr-dg-column>Third</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items">
        <clr-dg-cell>{{ item }}</clr-dg-cell>
        <clr-dg-cell>{{ item * 2 }}</clr-dg-cell>
        <clr-dg-cell>{{ item * 3 }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class PinnableTest {
  items = [1, 2, 3];
  pinFirst = false;
  pinSecond = false;
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column clrDgPinnable>First</clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item }}</clr-dg-cell>
        <clr-dg-cell>{{ item * 2 }}</clr-dg-cell>
      </clr-dg-row>
      <clr-dg-detail *clrIfDetail="let item">
        <clr-dg-detail-header>{{ item }}</clr-dg-detail-header>
        <clr-dg-detail-body>Detail of {{ item }}</clr-dg-detail-body>
      </clr-dg-detail>
    </clr-datagrid>
  `,
  standalone: false,
})
class PinnableWithDetailTest {
  items = [1, 2, 3];
}

export default function (): void {
  describe('Pinnable columns', function () {
    describe('Projection', function () {
      let context: TestContext<ClrDatagrid, PinnableTest>;
      let element: HTMLElement;

      beforeEach(function () {
        context = this.create(ClrDatagrid, PinnableTest);
        element = context.clarityElement;
      });

      it('keeps every column scrollable by default', function () {
        expect(columnTitles(element, HEADER_SCROLLABLE)).toEqual(['First', 'Second', 'Third']);
        expect(columnTitles(element, HEADER_STICKY)).toEqual([]);
        expect(element.querySelector(`.${PINNED_COLUMN_CLASS}`)).toBeNull();
      });

      it('defaults `pinnable` to false on the column', function () {
        expect(context.clarityDirective.columns.map(column => column.pinnable)).toEqual([false, false, false]);
      });

      it('projects a pinned column header into the sticky container of the header', function () {
        context.testComponent.pinFirst = true;
        context.detectChanges();

        expect(columnTitles(element, HEADER_STICKY)).toEqual(['First']);
        expect(columnTitles(element, HEADER_SCROLLABLE)).toEqual(['Second', 'Third']);
      });

      it('projects the cells of a pinned column into the sticky container of every row', function () {
        context.testComponent.pinFirst = true;
        context.detectChanges();

        expect(cellTextsIn(element, '.datagrid-row-sticky')).toEqual([['1'], ['2'], ['3']]);
        expect(cellTextsIn(element, '.datagrid-scrolling-cells')).toEqual([
          ['2', '3'],
          ['4', '6'],
          ['6', '9'],
        ]);
      });

      it('marks the pinned column and its cells with the pinned class', function () {
        context.testComponent.pinFirst = true;
        context.detectChanges();

        const pinnedHeader: HTMLElement = element.querySelector(`${HEADER_STICKY} clr-dg-column`);
        expect(pinnedHeader.classList).toContain(PINNED_COLUMN_CLASS);
        expect(context.clarityDirective.columns.first.isPinned).toBeTrue();

        cellsIn(element, '.datagrid-row-sticky').forEach(cells => {
          expect(cells.length).toBe(1);
          expect(cells[0].classList).toContain(PINNED_COLUMN_CLASS);
        });
      });

      it('keeps the declaration order of multiple pinned columns', function () {
        context.testComponent.pinFirst = true;
        context.testComponent.pinSecond = true;
        context.detectChanges();

        expect(columnTitles(element, HEADER_STICKY)).toEqual(['First', 'Second']);
        expect(columnTitles(element, HEADER_SCROLLABLE)).toEqual(['Third']);
        expect(cellTextsIn(element, '.datagrid-row-sticky')).toEqual([
          ['1', '2'],
          ['2', '4'],
          ['3', '6'],
        ]);
      });

      it('pins a column that is not the first one without reordering the others', function () {
        context.testComponent.pinSecond = true;
        context.detectChanges();

        expect(columnTitles(element, HEADER_STICKY)).toEqual(['Second']);
        expect(columnTitles(element, HEADER_SCROLLABLE)).toEqual(['First', 'Third']);
        expect(cellTextsIn(element, '.datagrid-row-sticky')).toEqual([['2'], ['4'], ['6']]);
        expect(cellTextsIn(element, '.datagrid-scrolling-cells')).toEqual([
          ['1', '3'],
          ['2', '6'],
          ['3', '9'],
        ]);
      });

      it('moves the column and its cells back when it gets unpinned', function () {
        context.testComponent.pinFirst = true;
        context.detectChanges();
        expect(columnTitles(element, HEADER_STICKY)).toEqual(['First']);

        context.testComponent.pinFirst = false;
        context.detectChanges();

        expect(columnTitles(element, HEADER_STICKY)).toEqual([]);
        expect(columnTitles(element, HEADER_SCROLLABLE)).toEqual(['First', 'Second', 'Third']);
        expect(cellTextsIn(element, '.datagrid-row-sticky')).toEqual([[], [], []]);
        expect(element.querySelector(`.${PINNED_COLUMN_CLASS}`)).toBeNull();
      });

      it('stores the pinned state on the column state', function () {
        const columnsService: ColumnsService = context.getClarityProvider(ColumnsService);

        context.testComponent.pinFirst = true;
        context.detectChanges();

        expect(columnsService.columns[0].value.pinned).toBeTrue();
        expect(columnsService.isPinned(0)).toBeTrue();
        expect(columnsService.isPinned(1)).toBeFalse();
        expect(columnsService.hasPinnedColumns).toBeTrue();
      });

      it('hides the separator of the last scrollable column, not of the pinned one', function () {
        context.testComponent.pinSecond = true;
        context.detectChanges();

        const [first, second, third] = context.clarityDirective.columns.toArray();
        expect(second.showSeparator).toBeTrue();
        expect(first.showSeparator).toBeTrue();
        expect(third.showSeparator).toBeFalse();
      });
    });

    describe('With a detail pane', function () {
      let context: TestContext<ClrDatagrid, PinnableWithDetailTest>;
      let detailService: DetailService;
      let element: HTMLElement;

      beforeEach(function () {
        context = this.create(ClrDatagrid, PinnableWithDetailTest);
        detailService = context.getClarityProvider(DetailService);
        element = context.clarityElement;
      });

      it('pins the column through the attribute form of the input', function () {
        expect(columnTitles(element, HEADER_STICKY)).toEqual(['First']);
        expect(context.clarityDirective.columns.first.pinnable).toBeTrue();
      });

      it('suspends pinning while the detail pane is open', function () {
        detailService.open(context.testComponent.items[0]);
        context.detectChanges();

        // Both columns are back in the scrollable container. The detail pane keeps only the first
        // one visible, the second one stays in the DOM but hidden - that behaviour is unchanged.
        expect(columnTitles(element, HEADER_STICKY)).toEqual([]);
        expect(columnTitles(element, HEADER_SCROLLABLE)).toEqual(['First', 'Second']);
        expect(context.clarityDirective.columns.first.isPinned).toBeFalse();
        expect(context.clarityDirective.columns.last.isHidden).toBeTrue();
        // The input is untouched, only the rendered state is suspended.
        expect(context.clarityDirective.columns.first.pinnable).toBeTrue();
      });

      it('restores pinning when the detail pane closes', function () {
        detailService.open(context.testComponent.items[0]);
        context.detectChanges();
        expect(columnTitles(element, HEADER_STICKY)).toEqual([]);

        detailService.close();
        context.detectChanges();

        expect(columnTitles(element, HEADER_STICKY)).toEqual(['First']);
        expect(columnTitles(element, HEADER_SCROLLABLE)).toEqual(['Second']);
        expect(context.clarityDirective.columns.first.isPinned).toBeTrue();
      });
    });
  });
}

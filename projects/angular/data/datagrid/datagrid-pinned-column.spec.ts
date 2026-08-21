/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { delay, TestContext } from '@clr/angular/testing';
import { ClrLoading, ClrLoadingState } from '@clr/angular/utils';
// import { ClrCommonStringsService } from '@clr/angular/utils'; // used by the disabled pin toggle suite

import { ClrDatagrid } from './datagrid';
// import { ClrDatagridSortOrder } from './enums/sort-order.enum'; // used by the disabled pin toggle suite
import { ColumnsService } from './providers/columns.service';
import { DetailService } from './providers/detail.service';
import { PINNED_COLUMN_CLASS } from './render/constants';

const PINNED = '.datagrid-pinned-cells';
const HEADER_PINNED = `.datagrid-header ${PINNED}`;
const HEADER_SCROLLABLE = '.datagrid-header .datagrid-row-scrollable';

function queryAll(root: HTMLElement, selector: string): HTMLElement[] {
  return Array.from<HTMLElement>(root.querySelectorAll(selector));
}

// The columns and cells are matched as direct children throughout: the container holding the pinned
// ones lives inside .datagrid-row-scrollable, so a descendant query for the scrollable ones would
// pick up the pinned ones as well.
//
// The title is read from .datagrid-column-title so the screen reader text of the column separator
// does not end up in the comparison.
function columnTitles(root: HTMLElement, container: string): string[] {
  return queryAll(root, `${container} > clr-dg-column .datagrid-column-title`).map(title => title.textContent.trim());
}

function cellsIn(root: HTMLElement, container: string): HTMLElement[][] {
  return queryAll(root, '.datagrid-rows .datagrid-row').map(row => queryAll(row, `${container} > clr-dg-cell`));
}

function cellTextsIn(root: HTMLElement, container: string): string[][] {
  return cellsIn(root, container).map(cells => cells.map(cell => cell.textContent.trim()));
}

function detailPinnedCells(root: HTMLElement): string[] {
  return queryAll(root, `.datagrid-row-detail ${PINNED} > clr-dg-cell`).map(cell => cell.textContent.trim());
}

// Everything the detail did not move into the static container, whether it was moved into the
// scrollable one or left where it was authored.
function detailPlainCells(root: HTMLElement): string[] {
  return queryAll(root, '.datagrid-row-detail > clr-dg-cell').map(cell => cell.textContent.trim());
}

function boxOf(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return { left: Math.round(rect.left), width: Math.round(rect.width) };
}

function cellBoxes(root: HTMLElement, ...texts: string[]) {
  const cells = queryAll(root, 'clr-dg-cell');
  return texts.map(text => boxOf(cells.find(cell => cell.textContent.trim() === text)));
}

// The box of the column itself, not of the title inside it, which is inset by the padding of the
// column.
function columnBoxes(root: HTMLElement, ...titles: string[]) {
  const columns = queryAll(root, 'clr-dg-column');
  return titles.map(title =>
    boxOf(columns.find(column => column.querySelector('.datagrid-column-title').textContent.trim() === title))
  );
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column [clrDgPinned]="pinFirst">First</clr-dg-column>
      <clr-dg-column [clrDgPinned]="pinSecond">Second</clr-dg-column>
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
      <clr-dg-column clrDgPinned>First</clr-dg-column>
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

// Fixture for the 'Header pin toggle' suite below, disabled along with clrDgPinnable.
// @Component({
//   template: `
//     <clr-datagrid>
//       <clr-dg-column [clrDgPinnable]="pinnable" [(clrDgPinned)]="firstPinned" [clrDgSortBy]="'x'">First</clr-dg-column>
//       <clr-dg-column>Second</clr-dg-column>
//       <clr-dg-row *clrDgItems="let item of items">
//         <clr-dg-cell>{{ item }}</clr-dg-cell>
//         <clr-dg-cell>{{ item * 2 }}</clr-dg-cell>
//       </clr-dg-row>
//     </clr-datagrid>
//   `,
//   standalone: false,
// })
// class PinToggleTest {
//   items = [1, 2, 3];
//   pinnable = true;
//   firstPinned = false;
// }

@Component({
  template: `
    <clr-datagrid>
      @for (column of columns; track column.field) {
        <clr-dg-column [clrDgPinned]="column.pinned">{{ column.field }}</clr-dg-column>
      }
      <clr-dg-row *clrDgItems="let item of items">
        @for (column of columns; track column.field) {
          <clr-dg-cell>{{ item }}</clr-dg-cell>
        }
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class ReorderableColumnsTest {
  items = [1, 2, 3];
  columns = [
    { field: 'First', pinned: true },
    { field: 'Second', pinned: false },
    { field: 'Third', pinned: false },
  ];
}

@Component({
  template: `
    <div [style.width.px]="hostWidth">
      <clr-datagrid [style.height.px]="200">
        <clr-dg-column clrDgPinned [style.width.px]="pinnedWidth">Pinned A</clr-dg-column>
        <clr-dg-column clrDgPinned [style.width.px]="pinnedWidth">Pinned B</clr-dg-column>
        <clr-dg-column [style.width.px]="400">Scroll C</clr-dg-column>
        <clr-dg-row *clrDgItems="let item of items">
          <clr-dg-cell>{{ item }}</clr-dg-cell>
          <clr-dg-cell>{{ item }}</clr-dg-cell>
          <clr-dg-cell>{{ item }}</clr-dg-cell>
        </clr-dg-row>
      </clr-datagrid>
    </div>
  `,
  standalone: false,
})
class PinnedWidthCapTest {
  items = [1, 2, 3];
  hostWidth = 400;
  pinnedWidth = 200;
}

@Component({
  template: `
    <div [style.width.px]="hostWidth">
      <clr-datagrid [style.height.px]="200">
        <clr-dg-column clrDgPinned [style.width.px]="pinnedWidth">Pinned A</clr-dg-column>
        <clr-dg-column clrDgPinned [style.width.px]="pinnedWidth">Pinned B</clr-dg-column>
        <clr-dg-column [style.width.px]="400">Scroll C</clr-dg-column>
        <ng-template clrVirtualScroll let-item [clrVirtualRowsOf]="items">
          <clr-dg-row [clrDgItem]="item">
            <clr-dg-cell>{{ item }}</clr-dg-cell>
            <clr-dg-cell>{{ item }}</clr-dg-cell>
            <clr-dg-cell>{{ item }}</clr-dg-cell>
          </clr-dg-row>
        </ng-template>
      </clr-datagrid>
    </div>
  `,
  standalone: false,
})
class PinnedWidthCapVirtualScrollTest {
  items = [1, 2, 3, 4, 5];
  hostWidth = 400;
  pinnedWidth = 200;
}

@Component({
  template: `
    <clr-datagrid clrDgSelectionType="multi">
      <clr-dg-column clrDgPinned>First</clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item }}</clr-dg-cell>
        <clr-dg-cell>{{ item * 2 }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class PinnedWithRowControlsTest {
  items = [1, 2, 3];
}

@Component({
  template: `
    <div [style.width.px]="500">
      <clr-datagrid [style.height.px]="300">
        <clr-dg-column [clrDgPinned]="pinFirst" [style.width.px]="150">A</clr-dg-column>
        <clr-dg-column [style.width.px]="150">B</clr-dg-column>
        <clr-dg-column [style.width.px]="300">C</clr-dg-column>
        <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
          <clr-dg-cell>A{{ item }}</clr-dg-cell>
          <clr-dg-cell>B{{ item }}</clr-dg-cell>
          <clr-dg-cell>C{{ item }}</clr-dg-cell>
          <clr-dg-row-detail *clrIfExpanded="true" [clrDgReplace]="replace">
            @if (matchingCells) {
              <clr-dg-cell>dA{{ item }}</clr-dg-cell>
              <clr-dg-cell>dB{{ item }}</clr-dg-cell>
              <clr-dg-cell>dC{{ item }}</clr-dg-cell>
            } @else {
              <clr-dg-cell>detail of {{ item }}</clr-dg-cell>
            }
          </clr-dg-row-detail>
        </clr-dg-row>
      </clr-datagrid>
    </div>
  `,
  standalone: false,
})
class RowDetailTest {
  items = [1];
  pinFirst = true;
  matchingCells = true;
  replace = false;
}

/**
 * Stands in for the clrFakeLoader of the demo application: it reports the row detail as loading and
 * only creates its content once that is over, so the cells of the detail turn up well after the
 * columns have been sized. The latency is a task rather than the demo's two seconds.
 */
@Directive({
  selector: '[testFakeLoader]',
  standalone: false,
})
class TestFakeLoader implements OnInit {
  @Input('testFakeLoader') slow = false;

  constructor(
    private template: TemplateRef<any>,
    private container: ViewContainerRef,
    private loading: ClrLoading
  ) {}

  ngOnInit() {
    if (this.slow) {
      this.loading.loadingState = ClrLoadingState.LOADING;
      setTimeout(() => {
        this.container.createEmbeddedView(this.template);
        this.loading.loadingState = ClrLoadingState.DEFAULT;
      });
    } else {
      this.container.createEmbeddedView(this.template);
    }
  }
}

@Component({
  template: `
    <div [style.width.px]="500">
      <clr-datagrid [style.height.px]="300">
        <clr-dg-column clrDgPinned [style.width.px]="150">A</clr-dg-column>
        <clr-dg-column [style.width.px]="150">B</clr-dg-column>
        <clr-dg-column [style.width.px]="300">C</clr-dg-column>
        <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
          <clr-dg-cell>A{{ item }}</clr-dg-cell>
          <clr-dg-cell>B{{ item }}</clr-dg-cell>
          <clr-dg-cell>C{{ item }}</clr-dg-cell>
          <clr-dg-row-detail *clrIfExpanded="true" [clrDgReplace]="replace">
            <ng-template [testFakeLoader]="slow" clrLoading>
              <clr-dg-cell>dA{{ item }}</clr-dg-cell>
              <clr-dg-cell>dB{{ item }}</clr-dg-cell>
              <clr-dg-cell>dC{{ item }}</clr-dg-cell>
            </ng-template>
          </clr-dg-row-detail>
        </clr-dg-row>
      </clr-datagrid>
    </div>
  `,
  standalone: false,
})
class LoadingRowDetailTest {
  items = [1];
  slow = true;
  replace = false;
}

@Component({
  template: `
    <div [style.width.px]="500">
      <clr-datagrid [style.height.px]="300">
        <clr-dg-column clrDgPinned [style.width.px]="150">A</clr-dg-column>
        <clr-dg-column [style.width.px]="150">B</clr-dg-column>
        <clr-dg-column [style.width.px]="300">C</clr-dg-column>
        <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
          <clr-dg-cell>A{{ item }}</clr-dg-cell>
          <clr-dg-cell>B{{ item }}</clr-dg-cell>
          <clr-dg-cell>C{{ item }}</clr-dg-cell>
          <clr-dg-row-detail *clrIfExpanded="true">
            <clr-dg-cell>dA{{ item }}</clr-dg-cell>
            <clr-dg-cell>dB{{ item }}</clr-dg-cell>
            <clr-dg-cell>dC{{ item }}</clr-dg-cell>
            <span [clrLoading]="loading"></span>
          </clr-dg-row-detail>
        </clr-dg-row>
      </clr-datagrid>
    </div>
  `,
  standalone: false,
})
class LoadingCellsRowDetailTest {
  items = [1];
  loading = true;
}

export default function (): void {
  describe('Pinnable columns', function () {
    describe('Reordering', function () {
      let context: TestContext<ClrDatagrid, ReorderableColumnsTest>;

      beforeEach(function () {
        context = this.create(ClrDatagrid, ReorderableColumnsTest);
      });

      it('reorders two scrollable columns while another one is pinned', function () {
        const [first, second, third] = context.testComponent.columns;

        // Both moved columns are scrollable, the pinned one keeps its place.
        context.testComponent.columns = [first, third, second];

        expect(() => context.detectChanges()).not.toThrow();
      });
    });

    describe('Maximum total width', function () {
      // Kept in sync with $clr-datagrid-pinned-columns-max-width in _variables.datagrid.scss.
      const MAX_SHARE = 0.85;

      function widthOf(root: HTMLElement, selector: string): number {
        return root.querySelector(selector).getBoundingClientRect().width;
      }

      // The cap is a share of the visible width of the datagrid, which is what the static container
      // resolves its `cqi` unit against - not the rows, which stretch to the scrollable content.
      function budget(root: HTMLElement): number {
        return widthOf(root, '.datagrid-table-wrapper') * MAX_SHARE;
      }

      function pinnedWidths(root: HTMLElement, container: string): number[] {
        return queryAll(root, `${container} ${PINNED} .${PINNED_COLUMN_CLASS}`).map(column =>
          Math.round(column.getBoundingClientRect().width)
        );
      }

      describe('with normal scrolling', function () {
        let context: TestContext<ClrDatagrid, PinnedWidthCapTest>;
        let element: HTMLElement;

        beforeEach(function () {
          context = this.create(ClrDatagrid, PinnedWidthCapTest);
          element = context.clarityElement;
        });

        it('caps the pinned columns at their share of the datagrid width', function () {
          // 2 x 200px of pinned columns asked for all 400px of a 400px wide datagrid.
          expect(widthOf(element, HEADER_PINNED)).toBeCloseTo(budget(element), 0);
        });

        it('shrinks the pinned columns so they fit the cap instead of overflowing it', function () {
          const widths = pinnedWidths(element, '.datagrid-header');

          expect(widths.length).toBe(2);
          expect(widths.every(width => width < 200)).toBeTrue();
          expect(widths[0] + widths[1]).toBeLessThanOrEqual(Math.ceil(budget(element)));
        });

        it('keeps the pinned cells the same width as the pinned headers', function () {
          // The shrinking is resolved separately for the header and for every row, so it has to
          // land on the same widths on both sides or the pinned column stops lining up.
          expect(pinnedWidths(element, '.datagrid-rows .datagrid-row:first-child')).toEqual(
            pinnedWidths(element, '.datagrid-header')
          );
        });

        it('leaves the scrollable columns reachable', function () {
          // The static container now sits inside .datagrid-row-scrollable, so the scrollable column
          // is measured on its own rather than through the width of that container.
          const scrollable = queryAll(element, `${HEADER_SCROLLABLE} > clr-dg-column`);

          expect(scrollable.length).toBe(1);
          expect(scrollable[0].getBoundingClientRect().width).toBeGreaterThan(0);
          expect(widthOf(element, HEADER_PINNED)).toBeLessThan(widthOf(element, '.datagrid-table-wrapper'));
        });

        it('does not shrink pinned columns that already fit', function () {
          context.testComponent.hostWidth = 900;
          context.detectChanges();

          expect(pinnedWidths(element, '.datagrid-header')).toEqual([200, 200]);
          expect(widthOf(element, HEADER_PINNED)).toBeLessThan(budget(element));
        });
      });

      describe('with virtual scrolling', function () {
        let context: TestContext<ClrDatagrid, PinnedWidthCapVirtualScrollTest>;
        let element: HTMLElement;

        beforeEach(function () {
          context = this.create(ClrDatagrid, PinnedWidthCapVirtualScrollTest);
          element = context.clarityElement;
        });

        it('caps the pinned columns at their share of the datagrid width', function () {
          expect(widthOf(element, HEADER_PINNED)).toBeCloseTo(budget(element), 0);
        });

        it('shrinks the pinned columns so they fit the cap instead of overflowing it', function () {
          const widths = pinnedWidths(element, '.datagrid-header');

          expect(widths.length).toBe(2);
          expect(widths[0] + widths[1]).toBeLessThanOrEqual(Math.ceil(budget(element)));
        });

        it('does not shrink pinned columns that already fit', function () {
          context.testComponent.hostWidth = 900;
          context.detectChanges();

          expect(pinnedWidths(element, '.datagrid-header')).toEqual([200, 200]);
        });
      });
    });

    describe('Projection', function () {
      let context: TestContext<ClrDatagrid, PinnableTest>;
      let element: HTMLElement;

      beforeEach(function () {
        context = this.create(ClrDatagrid, PinnableTest);
        element = context.clarityElement;
      });

      it('keeps every column scrollable by default', function () {
        expect(columnTitles(element, HEADER_SCROLLABLE)).toEqual(['First', 'Second', 'Third']);
        expect(columnTitles(element, HEADER_PINNED)).toEqual([]);
        expect(element.querySelector(`.${PINNED_COLUMN_CLASS}`)).toBeNull();
      });

      it('defaults `pinned` to false on the column', function () {
        expect(context.clarityDirective.columns.map(column => column.pinned)).toEqual([false, false, false]);
      });

      it('moves a pinned column header into the static container of the header', function () {
        context.testComponent.pinFirst = true;
        context.detectChanges();

        expect(columnTitles(element, HEADER_PINNED)).toEqual(['First']);
        expect(columnTitles(element, HEADER_SCROLLABLE)).toEqual(['Second', 'Third']);
      });

      it('moves the cells of a pinned column into the static container of every row', function () {
        context.testComponent.pinFirst = true;
        context.detectChanges();

        expect(cellTextsIn(element, PINNED)).toEqual([['1'], ['2'], ['3']]);
        expect(cellTextsIn(element, '.datagrid-scrolling-cells')).toEqual([
          ['2', '3'],
          ['4', '6'],
          ['6', '9'],
        ]);
      });

      it('marks the pinned column and its cells with the pinned class', function () {
        context.testComponent.pinFirst = true;
        context.detectChanges();

        const pinnedHeader: HTMLElement = element.querySelector(`${HEADER_PINNED} clr-dg-column`);
        expect(pinnedHeader.classList).toContain(PINNED_COLUMN_CLASS);
        expect(context.clarityDirective.columns.first.isPinned).toBeTrue();

        cellsIn(element, PINNED).forEach(cells => {
          expect(cells.length).toBe(1);
          expect(cells[0].classList).toContain(PINNED_COLUMN_CLASS);
        });
      });

      it('keeps the declaration order of multiple pinned columns', function () {
        context.testComponent.pinFirst = true;
        context.testComponent.pinSecond = true;
        context.detectChanges();

        expect(columnTitles(element, HEADER_PINNED)).toEqual(['First', 'Second']);
        expect(columnTitles(element, HEADER_SCROLLABLE)).toEqual(['Third']);
        expect(cellTextsIn(element, PINNED)).toEqual([
          ['1', '2'],
          ['2', '4'],
          ['3', '6'],
        ]);
      });

      it('pins a column that is not the first one without reordering the others', function () {
        context.testComponent.pinSecond = true;
        context.detectChanges();

        expect(columnTitles(element, HEADER_PINNED)).toEqual(['Second']);
        expect(columnTitles(element, HEADER_SCROLLABLE)).toEqual(['First', 'Third']);
        expect(cellTextsIn(element, PINNED)).toEqual([['2'], ['4'], ['6']]);
        expect(cellTextsIn(element, '.datagrid-scrolling-cells')).toEqual([
          ['1', '3'],
          ['2', '6'],
          ['3', '9'],
        ]);
      });

      it('moves the column and its cells back when it gets unpinned', function () {
        context.testComponent.pinFirst = true;
        context.detectChanges();
        expect(columnTitles(element, HEADER_PINNED)).toEqual(['First']);

        context.testComponent.pinFirst = false;
        context.detectChanges();

        expect(columnTitles(element, HEADER_PINNED)).toEqual([]);
        expect(columnTitles(element, HEADER_SCROLLABLE)).toEqual(['First', 'Second', 'Third']);
        expect(cellTextsIn(element, PINNED)).toEqual([[], [], []]);
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

    // Disabled along with clrDgPinnable. Restoring it also needs the PinToggleTest fixture above
    // and the ClrCommonStringsService / ClrDatagridSortOrder imports at the top of the file.
    // describe('Header pin toggle', function () {
    //   let context: TestContext<ClrDatagrid, PinToggleTest>;
    //   let element: HTMLElement;
    //
    //   function pinToggle(): HTMLButtonElement {
    //     return element.querySelector('.datagrid-header .datagrid-column-pin');
    //   }
    //
    //   function pinIconShape(): string {
    //     return pinToggle().querySelector('cds-icon').getAttribute('shape');
    //   }
    //
    //   beforeEach(function () {
    //     context = this.create(ClrDatagrid, PinToggleTest);
    //     element = context.clarityElement;
    //   });
    //
    //   it('only renders the toggle on columns that are pinnable', function () {
    //     expect(queryAll(element, '.datagrid-header .datagrid-column-pin').length).toBe(1);
    //
    //     context.testComponent.pinnable = false;
    //     context.detectChanges();
    //
    //     expect(pinToggle()).toBeNull();
    //   });
    //
    //   it('renders the toggle in front of the column title', function () {
    //     const headerCell = element.querySelector('.datagrid-header clr-dg-column .datagrid-column-flex');
    //     const children = Array.from(headerCell.children);
    //
    //     expect(children[0].classList).toContain('datagrid-column-pin');
    //     expect(children[1].classList).toContain('datagrid-column-title');
    //   });
    //
    //   it('shows the pin shape while unpinned and the unpin shape once pinned', function () {
    //     expect(pinIconShape()).toBe('pin');
    //
    //     pinToggle().click();
    //     context.detectChanges();
    //
    //     expect(pinIconShape()).toBe('unpin');
    //   });
    //
    //   it('pins and unpins the column when the toggle is clicked', function () {
    //     expect(columnTitles(element, HEADER_PINNED)).toEqual([]);
    //
    //     pinToggle().click();
    //     context.detectChanges();
    //     expect(columnTitles(element, HEADER_PINNED)).toEqual(['First']);
    //
    //     pinToggle().click();
    //     context.detectChanges();
    //     expect(columnTitles(element, HEADER_PINNED)).toEqual([]);
    //     expect(columnTitles(element, HEADER_SCROLLABLE)).toEqual(['First', 'Second']);
    //   });
    //
    //   it('writes the new state back through the two-way binding', function () {
    //     pinToggle().click();
    //     context.detectChanges();
    //     expect(context.testComponent.firstPinned).toBeTrue();
    //
    //     pinToggle().click();
    //     context.detectChanges();
    //     expect(context.testComponent.firstPinned).toBeFalse();
    //   });
    //
    //   it('follows the binding when the application pins the column itself', function () {
    //     context.testComponent.firstPinned = true;
    //     context.detectChanges();
    //
    //     expect(pinIconShape()).toBe('unpin');
    //     expect(columnTitles(element, HEADER_PINNED)).toEqual(['First']);
    //   });
    //
    //   it('does not sort the column when the toggle is clicked', function () {
    //     const column = context.clarityDirective.columns.first;
    //     expect(column.sortable).toBeTrue();
    //
    //     pinToggle().click();
    //     context.detectChanges();
    //
    //     expect(column.sortOrder).toBe(ClrDatagridSortOrder.UNSORTED);
    //   });
    //
    //   it('labels the toggle with the action it performs', function () {
    //     const commonStrings = new ClrCommonStringsService();
    //
    //     expect(pinToggle().getAttribute('aria-label')).toBe(commonStrings.keys.pinColumn);
    //
    //     pinToggle().click();
    //     context.detectChanges();
    //
    //     expect(pinToggle().getAttribute('aria-label')).toBe(commonStrings.keys.unpinColumn);
    //   });
    // });

    describe('Offset of the static container', function () {
      let context: TestContext<ClrDatagrid, PinnedWithRowControlsTest>;
      let element: HTMLElement;

      // The container holding the pinned columns comes after the one holding the row controls,
      // which does not scroll either, so it has to freeze where the controls end. The offsets of a
      // sticky element are measured from the edge of the datagrid, so that distance is measured and
      // published as a custom property instead.
      function publishedWidth(scope: string): number {
        return parseFloat(
          getComputedStyle(element.querySelector(scope)).getPropertyValue('--clr-datagrid-row-controls-width')
        );
      }

      function controlsWidth(scope: string): number {
        return element.querySelector(`${scope} .datagrid-row-master > .datagrid-row-sticky`).getBoundingClientRect()
          .width;
      }

      beforeEach(function () {
        context = this.create(ClrDatagrid, PinnedWithRowControlsTest);
        element = context.clarityElement;
      });

      it('freezes the pinned columns where the row controls end', function () {
        const pinned: HTMLElement = element.querySelector(HEADER_PINNED);

        // The select column is what makes this more than a no-op.
        expect(controlsWidth('.datagrid-header')).toBeGreaterThan(0);
        expect(getComputedStyle(pinned).position).toBe('sticky');
        expect(parseFloat(getComputedStyle(pinned).insetInlineStart)).toBeCloseTo(controlsWidth('.datagrid-header'), 1);
      });

      it('keeps the static container anchored while the expand animation runs', function () {
        // CDE-3127: the animation clips its host for as long as it runs. Clipping with
        // `overflow: hidden` would turn that host into a scroll container, and the static container
        // - which sits inside it - anchors itself to the nearest one, so the pinned columns would
        // come loose and scroll away for the length of the animation.
        const scrollingOverflows = ['hidden', 'scroll', 'auto'];
        const pinned: HTMLElement = element.querySelector(`.datagrid-rows ${PINNED}`);
        const row = context.clarityDirective.rows.first;

        row.expandAnimation.initAnimationEffects();

        let ancestor = pinned.parentElement;
        while (ancestor && ancestor !== element) {
          expect(scrollingOverflows).not.toContain(ancestor.style.overflow);
          ancestor = ancestor.parentElement;
        }

        row.expandAnimation.cleanupAnimationEffects();
      });

      it('measures the row controls separately from the ones in the header', function () {
        // The header renders a single column for both kinds of caret where a row renders one cell
        // per caret, so the two containers are not necessarily the same width.
        expect(publishedWidth('.datagrid-header')).toBeCloseTo(controlsWidth('.datagrid-header'), 1);
        expect(publishedWidth('.datagrid-rows')).toBeCloseTo(controlsWidth('.datagrid-rows'), 1);
      });
    });

    describe('Row detail laid out in columns', function () {
      let context: TestContext<ClrDatagrid, RowDetailTest>;
      let element: HTMLElement;

      beforeEach(function () {
        context = this.create(ClrDatagrid, RowDetailTest);
        element = context.clarityElement;
      });

      it('moves the cell of a pinned column into the static container of the detail', function () {
        expect(detailPinnedCells(element)).toEqual(['dA1']);
        expect(detailPlainCells(element)).toEqual(['dB1', 'dC1']);
      });

      it('lines the detail cells up with the cells of the row', function () {
        expect(cellBoxes(element, 'dA1', 'dB1', 'dC1')).toEqual(cellBoxes(element, 'A1', 'B1', 'C1'));
      });

      it('freezes the pinned detail cell alongside the pinned cell of the row', function () {
        const rowPinned: HTMLElement = element.querySelector(`.datagrid-rows .datagrid-row-master ${PINNED}`);
        const detailPinned: HTMLElement = element.querySelector(`.datagrid-row-detail ${PINNED}`);

        expect(getComputedStyle(detailPinned).position).toBe('sticky');
        expect(getComputedStyle(detailPinned).insetInlineStart).toBe(getComputedStyle(rowPinned).insetInlineStart);
      });

      it('holds the pinned cells of the row and of the detail in place while scrolling sideways', function () {
        const scroller = queryAll(element, '.datagrid, .datagrid-table-wrapper, .datagrid-table').find(
          candidate => candidate.scrollWidth > candidate.clientWidth
        );
        const before = cellBoxes(element, 'A1', 'dA1', 'C1', 'dC1');

        scroller.scrollLeft = 80;

        const after = cellBoxes(element, 'A1', 'dA1', 'C1', 'dC1');
        // The pinned cells stay where they were, in the row and in the detail alike, while the
        // scrollable ones move with the scroll.
        expect([after[0].left, after[1].left]).toEqual([before[0].left, before[1].left]);
        expect([after[2].left, after[3].left]).toEqual([before[2].left - 80, before[3].left - 80]);
      });

      it('leaves the detail alone when it does not hold one cell per column', function () {
        context.testComponent.matchingCells = false;
        context.detectChanges();

        expect(detailPinnedCells(element)).toEqual([]);
        expect(detailPlainCells(element)).toEqual(['detail of 1']);
      });

      it('leaves the detail alone when no column is pinned', function () {
        context.testComponent.pinFirst = false;
        context.detectChanges();

        expect(detailPinnedCells(element)).toEqual([]);
        expect(detailPlainCells(element)).toEqual(['dA1', 'dB1', 'dC1']);
      });

      it('moves the detail cells back when the column stops being pinned', function () {
        expect(detailPinnedCells(element)).toEqual(['dA1']);

        context.testComponent.pinFirst = false;
        context.detectChanges();

        expect(detailPinnedCells(element)).toEqual([]);
        expect(detailPlainCells(element)).toEqual(['dA1', 'dB1', 'dC1']);
      });

      describe('while it replaces the row', function () {
        beforeEach(function () {
          context.testComponent.replace = true;
          context.detectChanges();
        });

        it('moves the cell of a pinned column into the static container of the detail', function () {
          expect(detailPinnedCells(element)).toEqual(['dA1']);
          expect(detailPlainCells(element)).toEqual(['dB1', 'dC1']);
        });

        it('lines the detail cells up with the columns', function () {
          // The cells of the row are hidden in this mode, so the header is what is left to line up
          // with.
          expect(cellBoxes(element, 'dA1', 'dB1', 'dC1')).toEqual(columnBoxes(element, 'A', 'B', 'C'));
        });
      });
    });

    // The detail turns up with no cells and receives them once it has loaded, which is the shape the
    // clrLoading / clrFakeLoader combination of the demo application produces. The template holds
    // the content of a detail without cells somewhere else than the content of one with cells, and
    // creating either place projects the content into it - which takes the cells straight back out
    // of the containers they were moved into.
    describe('Row detail that loads its cells', function () {
      let context: TestContext<ClrDatagrid, LoadingRowDetailTest>;
      let element: HTMLElement;

      async function load() {
        context.detectChanges();
        await delay();
        context.detectChanges();
      }

      beforeEach(function () {
        context = this.create(ClrDatagrid, LoadingRowDetailTest, [], [TestFakeLoader]);
        element = context.clarityElement;
      });

      it('holds no cells of its own while it is still loading', async function () {
        context.detectChanges();

        expect(detailPinnedCells(element)).toEqual([]);
        expect(detailPlainCells(element)).toEqual([]);
      });

      it('moves the cell of a pinned column into the static container once it has loaded', async function () {
        await load();

        expect(detailPinnedCells(element)).toEqual(['dA1']);
        expect(detailPlainCells(element)).toEqual(['dB1', 'dC1']);
      });

      it('lines the loaded detail cells up with the cells of the row', async function () {
        await load();

        expect(cellBoxes(element, 'dA1', 'dB1', 'dC1')).toEqual(cellBoxes(element, 'A1', 'B1', 'C1'));
      });

      it('lines the loaded detail cells up with the columns while it replaces the row', async function () {
        context.testComponent.replace = true;
        await load();

        expect(detailPinnedCells(element)).toEqual(['dA1']);
        expect(cellBoxes(element, 'dA1', 'dB1', 'dC1')).toEqual(columnBoxes(element, 'A', 'B', 'C'));
      });
    });

    describe('Row detail that loads around its cells', function () {
      let context: TestContext<ClrDatagrid, LoadingCellsRowDetailTest>;
      let element: HTMLElement;

      beforeEach(function () {
        context = this.create(ClrDatagrid, LoadingCellsRowDetailTest);
        element = context.clarityElement;
      });

      it('lines the detail cells up once the row stops loading', function () {
        // The cells are there from the start here, only the row withholds the detail while it
        // reports itself as loading.
        expect(element.querySelector('.datagrid-row-detail')).toBeNull();

        context.testComponent.loading = false;
        context.detectChanges();

        expect(detailPinnedCells(element)).toEqual(['dA1']);
        expect(cellBoxes(element, 'dA1', 'dB1', 'dC1')).toEqual(cellBoxes(element, 'A1', 'B1', 'C1'));
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
        expect(columnTitles(element, HEADER_PINNED)).toEqual(['First']);
        expect(context.clarityDirective.columns.first.pinned).toBeTrue();
      });

      it('suspends pinning while the detail pane is open', function () {
        detailService.open(context.testComponent.items[0]);
        context.detectChanges();

        // Both columns are back in the scrollable container. The detail pane keeps only the first
        // one visible, the second one stays in the DOM but hidden - that behaviour is unchanged.
        expect(columnTitles(element, HEADER_PINNED)).toEqual([]);
        expect(columnTitles(element, HEADER_SCROLLABLE)).toEqual(['First', 'Second']);
        expect(context.clarityDirective.columns.first.isPinned).toBeFalse();
        expect(context.clarityDirective.columns.last.isHidden).toBeTrue();
        // The input is untouched, only the rendered state is suspended.
        expect(context.clarityDirective.columns.first.pinned).toBeTrue();
      });

      it('restores pinning when the detail pane closes', function () {
        detailService.open(context.testComponent.items[0]);
        context.detectChanges();
        expect(columnTitles(element, HEADER_PINNED)).toEqual([]);

        detailService.close();
        context.detectChanges();

        expect(columnTitles(element, HEADER_PINNED)).toEqual(['First']);
        expect(columnTitles(element, HEADER_SCROLLABLE)).toEqual(['Second']);
        expect(context.clarityDirective.columns.first.isPinned).toBeTrue();
      });
    });
  });
}

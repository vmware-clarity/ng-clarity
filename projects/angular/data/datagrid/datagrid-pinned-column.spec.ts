/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestContext } from '@clr/angular/testing';
// import { ClrCommonStringsService } from '@clr/angular/utils'; // used by the disabled pin toggle suite

import { ClrDatagrid } from './datagrid';
// import { ClrDatagridSortOrder } from './enums/sort-order.enum'; // used by the disabled pin toggle suite
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

      // The cap is a share of the visible width of the datagrid, which is what the sticky container
      // resolves its `cqi` unit against - not the rows, which stretch to the scrollable content.
      function budget(root: HTMLElement): number {
        return widthOf(root, '.datagrid-table-wrapper') * MAX_SHARE;
      }

      function pinnedWidths(root: HTMLElement, container: string): number[] {
        return queryAll(root, `${container} .datagrid-row-sticky .${PINNED_COLUMN_CLASS}`).map(column =>
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
          expect(widthOf(element, HEADER_STICKY)).toBeCloseTo(budget(element), 0);
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
          expect(widthOf(element, HEADER_SCROLLABLE)).toBeGreaterThan(0);
          expect(widthOf(element, HEADER_STICKY)).toBeLessThan(widthOf(element, '.datagrid-table-wrapper'));
        });

        it('does not shrink pinned columns that already fit', function () {
          context.testComponent.hostWidth = 900;
          context.detectChanges();

          expect(pinnedWidths(element, '.datagrid-header')).toEqual([200, 200]);
          expect(widthOf(element, HEADER_STICKY)).toBeLessThan(budget(element));
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
          expect(widthOf(element, HEADER_STICKY)).toBeCloseTo(budget(element), 0);
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
        expect(columnTitles(element, HEADER_STICKY)).toEqual([]);
        expect(element.querySelector(`.${PINNED_COLUMN_CLASS}`)).toBeNull();
      });

      it('defaults `pinned` to false on the column', function () {
        expect(context.clarityDirective.columns.map(column => column.pinned)).toEqual([false, false, false]);
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
    //     expect(columnTitles(element, HEADER_STICKY)).toEqual([]);
    //
    //     pinToggle().click();
    //     context.detectChanges();
    //     expect(columnTitles(element, HEADER_STICKY)).toEqual(['First']);
    //
    //     pinToggle().click();
    //     context.detectChanges();
    //     expect(columnTitles(element, HEADER_STICKY)).toEqual([]);
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
    //     expect(columnTitles(element, HEADER_STICKY)).toEqual(['First']);
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
        expect(context.clarityDirective.columns.first.pinned).toBeTrue();
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
        expect(context.clarityDirective.columns.first.pinned).toBeTrue();
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

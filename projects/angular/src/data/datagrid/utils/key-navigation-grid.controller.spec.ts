/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { Keys } from '../../../utils/enums/keys.enum';
import { ClrDatagrid } from '../datagrid';
import { TestContext } from '../helpers.spec';
import { Selection } from '../providers/selection';

@Component({
  template: `
    <clr-datagrid class="datagrid-compact" [style.height.px]="185" [(clrDgSelected)]="selected">
      <clr-dg-column>First</clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>
      <clr-dg-column>Third</clr-dg-column>

      <clr-dg-row *ngFor="let item of items; index as i" [clrDgItem]="item">
        <clr-dg-cell>{{ i * 3 }}</clr-dg-cell>
        <clr-dg-cell>{{ i * 3 + 1 }}</clr-dg-cell>
        <clr-dg-cell>{{ i * 3 + 2 }}</clr-dg-cell>

        <ng-container ngProjectAs="clr-dg-row-detail" *ngIf="showRowDetail">
          <clr-dg-row-detail *clrIfExpanded="expandedRowIndexes.includes(i)" [clrDgReplace]="replaceCells">
            <ng-template [ngIf]="columns">
              <clr-dg-cell>{{ i * 3 }} replaced</clr-dg-cell>
              <clr-dg-cell>{{ i * 3 + 1 }} replaced</clr-dg-cell>
              <clr-dg-cell>{{ i * 3 + 2 }} replaced</clr-dg-cell>
            </ng-template>

            <ng-template [ngIf]="!columns"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. </ng-template>
          </clr-dg-row-detail>
        </ng-container>
      </clr-dg-row>
    </clr-datagrid>
  `,
})
class TestComponent {
  showRowDetail = false;
  columns = true;
  replaceCells = false;
  selected: any[];

  expandedRowIndexes: number[] = [];

  items = Array(4);
}

export default function (): void {
  describe('Key navigation controller', function () {
    function compareToActiveElement(element: HTMLElement): void {
      expect(document.activeElement).toBe(element);
    }

    describe('Basic datagrid', function () {
      let context: TestContext<ClrDatagrid<number>, TestComponent>;
      let grid: HTMLElement;
      let cells: NodeListOf<HTMLElement>;

      beforeEach(function () {
        context = this.create(ClrDatagrid, TestComponent);

        grid = context.clarityElement.querySelector('[role=grid]');
        expect(grid).toBeDefined();
        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(15);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();
      });

      // Legend: 0h -> Index: 0, Type: header/data
      // data matrix 4*3 data, 3 headers.
      // | 0h| 1h| 2h|
      // | 3d| 4d| 5d|
      // | 6d| 7d| 8d|
      // | 9d|10d|11d|
      // |12d|13d|14d|

      it('Moves focus across cells no action cells', function () {
        // cell flow: start at index 0 -> 3 -> 4 -> 5 -> 8 -> 7 -> 4 end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[3]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[4]);

        // second time, to avoid cycling over cells with radios
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[5]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[8]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[4]);
      });

      it('Moves focus with PageDown and PageUp no action cells', function () {
        // cell flow: start at index 0 -> 12 -> 3 end

        // focus at bottom datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[12]);

        // focus at top datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[3]);
      });

      it('Moves focus on Home and End no action cells', function () {
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[3]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        compareToActiveElement(cells[5]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        compareToActiveElement(cells[3]);
      });

      it('Moves focus on Ctrl-Home and Ctrl-End no action cells', function () {
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        compareToActiveElement(cells[14]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        compareToActiveElement(cells[0]);
      });

      it('Moves focus to a clicked element', function () {
        const testCell = 7;
        expect(document.activeElement.textContent).not.toBe(cells[testCell].textContent);

        cells[testCell].dispatchEvent(new MouseEvent('mousedown', { buttons: 1, bubbles: true }));
        expect(document.activeElement.textContent).toBe(cells[testCell].textContent);
      });
    });

    describe('Basic datagrid with actions', function () {
      let context: TestContext<ClrDatagrid<number>, TestComponent>;
      let grid: HTMLElement;
      let cells: NodeListOf<HTMLElement>;

      beforeEach(function () {
        context = this.create(ClrDatagrid, TestComponent, [Selection]);
        context.testComponent.selected = [];
        context.detectChanges();

        grid = context.clarityElement.querySelector('[role=grid]');
        expect(grid).toBeDefined();
        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(20);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();
      });

      // Legend: 0h -> Index: 0, Type: header/check/data
      // data matrix 4*3 data, 4 checkbox, 4 headers.
      // | 0h| 1h| 2h| 3h|
      // | 4c| 5d| 6d| 7d|
      // | 8c| 9d|10d|11d|
      // |12c|13d|14d|15d|
      // |16c|17d|18d|19d|

      it('Moves focus across cells with action cells', function () {
        // check cell flow: start at index 0 -> 5 -> 6 -> 7 -> 8 -> 13 -> 12 -> 7 -> 6 -> 5 end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[4].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[5]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[11]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[10]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[6]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[5]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[4].querySelector('[type=checkbox]'));
      });

      it('Moves focus with PageDown and PageUp with action cells', function () {
        // cell flow: start at index 0 (check) -> 16 (check) -> 4 (check)  end

        // focus at bottom datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[16].querySelector('[type=checkbox]'));

        // focus at top datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[4].querySelector('[type=checkbox]'));
      });

      it('Moves focus on Home and End with action cells', function () {
        // cell flow: start at index 0 (check) -> 4 (check) -> 7 (check) -> 4 (check) end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[4].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        compareToActiveElement(cells[4].querySelector('[type=checkbox]'));
      });

      it('Moves focus on Ctrl-Home and Ctrl-End with action cells', function () {
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        compareToActiveElement(cells[19]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        compareToActiveElement(cells[0]);
      });
    });

    describe('Expandable datagrid', function () {
      let context: TestContext<ClrDatagrid<number>, TestComponent>;
      let grid: HTMLElement;
      let cells: NodeListOf<HTMLElement>;

      beforeEach(function () {
        context = this.create(ClrDatagrid, TestComponent);
        context.testComponent.showRowDetail = true;
        context.detectChanges();

        grid = context.clarityElement.querySelector('[role=grid]');
        expect(grid).toBeDefined();
        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(20);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();
      });

      // Legend: 0h -> Index: 0, Type: header/expand/data
      // data matrix 4*3 data, 4 headers, 4 expand.
      // | 0h| 1h| 2h| 3h|
      // | 4e| 5d| 6d| 7d|
      // | 8e| 9d|10d|11d|
      // |12e|13d|14d|15d|
      // |16e|17d|18d|19d|

      it('Moves focus across cells with expand no action cells', function () {
        // check cell flow: start at index 0 -> 4 -> 5 -> 6 -> 10 -> 9 -> 5 -> 4 end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[4].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[5]);

        // second time, to avoid cycling over cells with radios
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[10]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[9]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[5]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[4].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus with PageDown and PageUp with expand no action cells', function () {
        // cell flow: start at index 0 (check) -> 1 (check) -> 17 (check) -> 5 (check)  end

        // focus at bottom datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[16].querySelector('button.datagrid-expandable-caret-button'));

        // focus at top datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[4].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus on Home and End with expand no action cells', function () {
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[4].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        compareToActiveElement(cells[4].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus on Ctrl-Home and Ctrl-End with expand no action cells', function () {
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        compareToActiveElement(cells[19]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        compareToActiveElement(cells[0]);
      });
    });

    describe('Expandable datagrid with actions', function () {
      let context: TestContext<ClrDatagrid<number>, TestComponent>;
      let grid: HTMLElement;
      let cells: NodeListOf<HTMLElement>;

      beforeEach(function () {
        context = this.create(ClrDatagrid, TestComponent, [Selection]);
        context.testComponent.selected = [];
        context.testComponent.showRowDetail = true;
        context.detectChanges();

        grid = context.clarityElement.querySelector('[role=grid]');
        expect(grid).toBeDefined();
        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(25);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();
      });

      //  Legend: 0h -> Index: 0, Type: header/check/expand/data
      //  data matrix 4*3 data, 5 headers, 4 check, 4 expand.
      // | 0h| 1h| 2h| 3h| 4h|
      // | 5c| 6e| 7d| 8d| 9d|
      // |10c|11e|12d|13d|14d|
      // |15c|16e|17d|18d|19d|
      // |20c|21e|22d|23d|24d|

      it('Moves focus across cells with action and expand cells', function () {
        // check cell flow: start at index 0 -> 5 -> 6 -> 7 -> 8 -> 13 -> 12 -> 7 -> 6 -> 5 end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[8]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[13]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[12]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));
      });

      it('Moves focus across sticky cells with actions and expand cells', function () {
        // check cell flow: start at index
        // 0 -> 5 -> 10 -> 15 -> 16 -> 11
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[15].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[16].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus with PageDown and PageUp with action and expand cells', function () {
        // cell flow: start at index 0 (check) -> 20 (check) -> 5 (check)  end

        // focus at bottom datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[20].querySelector('[type=checkbox]'));

        // focus at top datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));
      });

      it('Moves focus on Home and End with action and expand cells', function () {
        // cell flow: start at index 0 (check) -> 4 (check) -> 7 (check) -> 4 (check) end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        compareToActiveElement(cells[9]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));
      });

      it('Moves focus on Ctrl-Home and Ctrl-End with and expand action cells', function () {
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        compareToActiveElement(cells[24]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        compareToActiveElement(cells[0]);
      });
    });

    describe('Expandable datagrid with expanded column row and actions', function () {
      let context: TestContext<ClrDatagrid<number>, TestComponent>;
      let grid: HTMLElement;
      let cells: NodeListOf<HTMLElement>;

      beforeEach(function () {
        context = this.create(ClrDatagrid, TestComponent, [Selection]);
        context.testComponent.selected = [];
        context.testComponent.expandedRowIndexes = [1, 2];
        context.testComponent.showRowDetail = true;
        context.detectChanges();

        grid = context.clarityElement.querySelector('[role=grid]');
        expect(grid).toBeDefined();
        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(31);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();
      });

      // Legend: 0h -> Index: 0, Type: header/check/expand/data
      // data matrix 4*3 data, 5 headers, 4 check, 4 expand.
      // 2 extra expanded rows with columns 2*3 data
      // | 0h| 1h| 2h| 3h| 4h|
      // | 5c| 6e| 7d| 8d| 9d|
      // |10c|11e|12d|13d|14d|
      // |       |15d|16d|17d|
      // |18c|19e|20d|21d|22d|
      // |       |23d|24d|25d|
      // |26c|27e|28d|29d|30d|

      it('Moves focus across data cells with action and expanded rows', function () {
        // check cell flow: start at index
        // 0 -> 5 -> 6 -> 7 -> 8 -> 13 -> 16 -> 21 -> 24 -> 29 -> 24 -> 23 -> 20 -> 15 -> 12 -> 7
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[12]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[13]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[16]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[21]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[24]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[29]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[24]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[23]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[20]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[12]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[7]);
      });

      it('Moves focus across sticky cells with actions and expanded rows', function () {
        // check cell flow: start at index
        // 0 -> 5 -> 10 -> 11 -> 19 -> 18 -> 26 -> 27 -> 19 -> 18 -> 10 -> 11 -> 6
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[19].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[18].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[26].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[27].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[19].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[18].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus between sticky and data cells with actions and expanded rows', function () {
        // check cell flow: start at index
        // 0 -> 5 -> 10 -> 11 -> 12 -> 11 -> 12 -> 15 -> 11
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[12]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[12]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus on Home and End with action and expand cells', function () {
        // cell flow: start at index
        // 0 -> 5 -> 10 -> 14 -> 10 -> 14 -> 17 -> 10
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        compareToActiveElement(cells[14]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        compareToActiveElement(cells[14]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[17]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));
      });

      it('Moves focus on Ctrl-Home and Ctrl-End between expanded rows', function () {
        context.testComponent.expandedRowIndexes = [0, 3];
        context.detectChanges();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');

        // Default
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        compareToActiveElement(cells[30]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        compareToActiveElement(cells[0]);

        // from expanded main row to expanded last row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        compareToActiveElement(cells[30]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        compareToActiveElement(cells[0]);

        // from expanded sub row to expanded last row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[10]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        compareToActiveElement(cells[30]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        compareToActiveElement(cells[0]);
      });
    });

    describe('Expandable datagrid with expanded replace column row and actions', function () {
      let context: TestContext<ClrDatagrid<number>, TestComponent>;
      let grid: HTMLElement;
      let cells: NodeListOf<HTMLElement>;

      beforeEach(function () {
        context = this.create(ClrDatagrid, TestComponent, [Selection]);
        context.testComponent.selected = [];
        context.testComponent.expandedRowIndexes = [1, 2];
        context.testComponent.showRowDetail = true;
        context.testComponent.replaceCells = true;
        context.detectChanges();

        grid = context.clarityElement.querySelector('[role=grid]');
        expect(grid).toBeDefined();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(31);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();
      });

      //  Legend: 0h -> Index: 0, Type: header/check/expand/data
      //  the matrix looks very close to regular not expanded expandable grid, but the underlying algorithm is different
      //  data matrix 4*3 data, 5 headers, 4 check, 4 expand.
      //  2 extra expanded rows with columns 2*3 data
      // | 0h| 1h| 2h| 3h| 4h|
      // | 5c| 6e| 7d| 8d| 9d|
      // |10c|11e|12d|13d|14d| -> 12, 13 and 14 are replaced and hidden
      // |       |15d|16d|17d|
      // |18c|19e|20d|21d|22d| -> 20, 21 and 22 are replaced and hidden
      // |       |23d|24d|25d|
      // |26c|27e|28d|29d|30d|

      it('Moves focus across data cells with action and expanded rows', function () {
        // check cell flow: start at index
        // 0 -> 5 -> 6 -> 7 -> 15 -> 16 -> 24 -> 29 -> 28 -> 23 -> 15 -> 16 -> 8
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        // single Arrow Down will skip the replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[16]);

        // single Arrow Down will skip the replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[24]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[29]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[28]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[23]);

        // single Arrow Up will skip the replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[16]);

        // single Arrow Up will skip the replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[8]);
      });

      it('Moves focus between sticky and data cells with actions and expanded replaced rows', function () {
        // check cell flow: start at index
        // 0 -> 5 -> 10 -> 11 -> 15 -> 11
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus across sticky cells with actions and expanded replaced rows', function () {
        // check cell flow: start at index
        // 0 -> 5 -> 10 -> 11 -> 19 -> 18 -> 26 -> 27 -> 19 -> 18 -> 10 -> 11 -> 6
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[19].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[18].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[26].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[27].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[19].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[18].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus on Home and End with action and expand replaced cells', function () {
        // cell flow: start at index
        // 0 -> 5 -> 10 -> 17 -> 10
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        compareToActiveElement(cells[17]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));
      });

      it('Moves focus on Ctrl-Home and Ctrl-End between expanded replaced column rows', function () {
        context.testComponent.expandedRowIndexes = [0, 3];
        context.detectChanges();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');

        // Default
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        compareToActiveElement(cells[30]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        compareToActiveElement(cells[0]);

        // from expanded replaced row to expanded last row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[10]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        compareToActiveElement(cells[30]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        compareToActiveElement(cells[0]);
      });
    });

    describe('Expandable datagrid with expanded detail row and actions', function () {
      let context: TestContext<ClrDatagrid<number>, TestComponent>;
      let grid: HTMLElement;
      let cells: NodeListOf<HTMLElement>;

      beforeEach(function () {
        context = this.create(ClrDatagrid, TestComponent, [Selection]);
        context.testComponent.selected = [];
        context.testComponent.expandedRowIndexes = [1, 2];
        context.testComponent.showRowDetail = true;
        context.testComponent.columns = false;
        context.detectChanges();

        grid = context.clarityElement.querySelector('[role=grid]');
        expect(grid).toBeDefined();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(27);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();
      });

      //  Legend: 0h -> Index: 0, Type: header/check/expand/data
      //  the matrix looks very close to regular not expanded expandable grid, but the underlying algorithm is different
      //  data matrix 4*3 data, 5 headers, 4 check, 4 expand.
      //  2 extra expanded rows with columns 2*3 data
      // | 0h| 1h| 2h| 3h| 4h|
      // | 5c| 6e| 7d| 8d| 9d|
      // |10c|11e|12d|13d|14d|
      // |       |----15d----|
      // |16c|17e|18d|19d|20d|
      // |       |----21d----|
      // |22c|23e|24d|25d|26d|

      it('Moves focus across data cells with action and expanded detail rows', function () {
        // check cell flow: start at index
        // 0 -> 5 -> 6 -> 11 -> 12 -> 13 -> 8 -> 3 -> 8 -> 13 -> 15 -> 18 -> 21 -> 24 -> 25 -> 21 -> 18 -> 19 -> 15
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[12]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[13]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[8]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[3]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[8]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[13]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[18]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[21]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[24]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[25]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[21]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[18]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[19]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[15]);
      });

      it('Moves focus between sticky and data cells with actions and expanded detail rows', function () {
        // check cell flow: start at index
        // 0 -> 5 -> 10 -> 11 -> 12 -> 15 -> 11
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[12]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus across sticky cells with actions and expanded detail rows', function () {
        // check cell flow: start at index
        // 0 -> 5 -> 10 -> 11 -> 17 -> 16 -> 22 -> 23 -> 17 -> 16 -> 10 -> 11 -> 6
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[17].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[16].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[22].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[23].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[17].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[16].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus on Home and End with action and expanded detail row', function () {
        // cell flow: start at index
        // 0 -> 5 -> 10 -> 14 -> 15 -> 10
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        compareToActiveElement(cells[14]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));
      });

      it('Moves focus on Ctrl-Home and Ctrl-End between expanded detail rows', function () {
        context.testComponent.expandedRowIndexes = [0, 3];
        context.detectChanges();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');

        // Default
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        compareToActiveElement(cells[26]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        compareToActiveElement(cells[0]);

        // from expanded main row to expanded last row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        compareToActiveElement(cells[26]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        compareToActiveElement(cells[0]);

        // from expanded sub row to expanded last row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[10]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        compareToActiveElement(cells[26]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        compareToActiveElement(cells[0]);
      });
    });

    describe('Expandable datagrid with expanded replaced detail row and actions', function () {
      let context: TestContext<ClrDatagrid<number>, TestComponent>;
      let grid: HTMLElement;
      let cells: NodeListOf<HTMLElement>;

      beforeEach(function () {
        context = this.create(ClrDatagrid, TestComponent, [Selection]);
        context.testComponent.selected = [];
        context.testComponent.columns = false;
        context.testComponent.expandedRowIndexes = [1, 2];
        context.testComponent.replaceCells = true;
        context.testComponent.showRowDetail = true;
        context.detectChanges();

        grid = context.clarityElement.querySelector('[role=grid]');
        expect(grid).toBeDefined();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(27);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();
      });

      //  Legend: 0h -> Index: 0, Type: header/check/expand/data
      //  the matrix looks very close to regular not expanded expandable grid, but the underlying algorithm is different
      //  data matrix 4*3 data, 5 headers, 4 check, 4 expand.
      //  2 extra expanded rows with columns 2*1 data
      // | 0h| 1h| 2h| 3h| 4h|
      // | 5c| 6e| 7d| 8d| 9d|
      // |10c|11e|12d|13d|14d| -> 12, 13 and 14 are replaced and hidden
      // |       |----15d----|
      // |16c|17e|18d|19d|20d| -> 18, 19 and 20 are replaced and hidden
      // |       |----21d----|
      // |22c|23e|24d|25d|26d|

      it('Moves focus across data cells with action and expanded replaced detail rows', function () {
        // check cell flow: start at index
        // 0 -> 5 -> 6 -> 7 -> 8 -> 15 -> 21 -> 24 -> 25 -> 21 -> 15 -> 7
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[8]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[21]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[24]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[25]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[21]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[7]);
      });

      it('Moves focus between sticky and data cells with actions and expanded replaced detail rows', function () {
        // check cell flow: start at index
        // 0 -> 5 -> 10 -> 11 -> 15 -> 11
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus across sticky cells with actions and expanded replaced detail rows', function () {
        // check cell flow: start at index
        // 0 -> 5 -> 10 -> 11 -> 17 -> 16 -> 22 -> 23 -> 17 -> 16 -> 10 -> 11 -> 6
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[17].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[16].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[22].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[23].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[17].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        compareToActiveElement(cells[16].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus on Home and End with action and expanded replaced detail row', function () {
        // cell flow: start at index
        // 0 -> 5 -> 10 -> 15 -> 10
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        compareToActiveElement(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));
      });

      it('Moves focus on Ctrl-Home and Ctrl-End between expanded replaced detail rows', function () {
        context.testComponent.expandedRowIndexes = [0, 3];
        context.detectChanges();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');

        // Default
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        compareToActiveElement(cells[26]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        compareToActiveElement(cells[0]);

        // from expanded replaced row to expanded last row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[10]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        compareToActiveElement(cells[26]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        compareToActiveElement(cells[0]);
      });
    });

    describe('Extended PageUp and PageDown key navigation datagrid with expanded rows and actions', function () {
      let context: TestContext<ClrDatagrid<number>, TestComponent>;
      let grid: HTMLElement;
      let cells: NodeListOf<HTMLElement>;

      beforeEach(function () {
        context = this.create(ClrDatagrid, TestComponent, [Selection]);
        context.testComponent.items = Array(10);
        context.testComponent.selected = [];
        context.testComponent.showRowDetail = true;
        context.detectChanges();

        grid = context.clarityElement.querySelector('[role=grid]');
        expect(grid).toBeDefined();
      });

      //  Legend: 0h -> Index: 0, Type: header/check/expand/data
      //  the matrix looks very close to regular not expanded expandable grid, but the underlying algorithm is different
      //  data matrix 10*3 data, 5 headers, 10 check, 10 expand.

      // | 0h| 1h| 2h| 3h| 4h| -> row header
      // | 5c| 6e| 7d| 8d| 9d| -> row 0
      // |10c|11e|12d|13d|14d| -> row 1
      // |15c|16e|17d|18d|19d| -> row 2
      // |20c|21e|22d|23d|24d| -> row 3
      // |25c|26e|27d|28d|29d| -> row 4
      // |       |30d|31d|32d|
      // |33c|34e|35d|36d|37d| -> row 5
      // |       |38d|39d|40d|
      // |41c|42e|43d|44d|45d| -> row 6
      //      .........
      // |59c|60e|61d|62d|63d| -> row 9

      // Covers key navigation over data cells
      // PageUp and PageDown from NOT expanded row to expanded column row
      // PageUp and PageDown from expanded column row to NOT expanded row
      it('Moves focus across data cells with actions and expanded column rows', function () {
        context.testComponent.expandedRowIndexes = [4, 5, 6];
        context.detectChanges();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(64);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();

        // check cell flow: start at index
        // 0 -> 5 -> 6 -> 7 -> 8 -> 36 -> 13 -> 39 -> 62 -> 39 -> 36 -> 62 -> 39 -> 18
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[8]);

        // PageDown: from not expanded row to expanded main row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[36]);

        // PageUp: from expanded main row to not expanded row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[13]);

        // PageDown: from not expanded row to expanded sub row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[39]);

        // PageDown: from expanded sub row to not expanded row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[62]);

        // PageUp: from not expanded row to expanded sub row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[39]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[36]);

        // PageDown: from expanded main row to not expanded row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[62]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[39]);

        // PageUp: from expanded sub row to not expanded row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[18]);
      });

      // Covers key navigation over action cells
      // PageUp and PageDown from NOT expanded row to expanded column row
      // PageUp and PageDown from expanded column row to NOT expanded row
      it('Moves focus across action cells with actions and expanded column rows', function () {
        context.testComponent.expandedRowIndexes = [4, 5, 6];
        context.detectChanges();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(64);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();

        // check cell flow: start at index
        // 0 -> 5 -> 33 -> 10 -> 33 -> 59 -> 33 -> 59 -> 54 -> 33
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        // PageDown: from not expanded row to expanded main row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[33].querySelector('[type=checkbox]'));

        // PageUp: from expanded main row to not expanded row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        // PageDown: from not expanded row to expanded sub row (goes to main row)
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[33].querySelector('[type=checkbox]'));

        // PageDown: from expanded main row to not expanded row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[59].querySelector('[type=checkbox]'));

        // PageUp: from not expanded row to expanded sub row (goes to main row)
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[33].querySelector('[type=checkbox]'));

        // PageDown: from expanded main row to not expanded row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[59].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[54].querySelector('[type=checkbox]'));

        // PageUp: from not expanded row to expanded main row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[33].querySelector('[type=checkbox]'));
      });

      // | 0h| 1h| 2h| 3h| 4h| -> row header
      // | 5c| 6e| 7d| 8d| 9d| -> row 0
      // |       |10d|11d|12d|
      // |13c|14e|15d|16d|17d| -> row 1
      //      .........
      // |28c|29e|30d|31d|32d| -> row 4
      // |       |33d|34d|35d|
      // |37c|37e|38d|39d|40d| -> row 5
      // |       |41d|42d|43d|
      //      .........
      // |59c|60e|61d|62d|63d| -> row 9
      // |       |64d|65d|66d|

      // Covers key navigation over data cells
      // PageDown from expanded main to sub column row
      // PageUp from expanded sub to sub column row
      // PageDown from expanded sub to main column row
      // PageUp from expanded main to main column row
      it('Moves focus across data cells with actions between expanded column rows', function () {
        context.testComponent.expandedRowIndexes = [0, 4, 5, 9];
        context.detectChanges();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(67);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();

        // check cell flow: start at index
        // 0 -> 5 -> 6 -> 7 -> 8 -> 34 -> 11 -> 39 -> 65 -> 62 -> 39
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[8]);

        // PageDown: from expanded main row to expanded sub row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[34]);

        // PageUp: from expanded sub row to expanded sub row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[11]);

        // PageDown: from expanded sub row to expanded main row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[39]);

        // PageDown: from expanded sub row to expanded sub row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[65]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[62]);

        // PageUp: from expanded main row to expanded main row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[39]);
      });

      // | 0h| 1h| 2h| 3h| 4h| -> row header
      // | 5c| 6e| 7d| 8d| 9d| -> row 0
      // |       |10d|11d|12d|
      // |13c|14e|15d|16d|17d| -> row 1
      // |       |18d|19d|20d|
      // |21c|22e|23d|24d|25d| -> row 2
      // |       |26d|27d|28d|
      //      .........
      // |39c|40e|41d|42d|43d| -> row 5
      // |       |44d|45d|45d|
      //      .........

      // Covers key navigation over data cells
      // PageDown from expanded main to main column row
      // PageUp from expanded main to sub column row
      // PageDown from expanded sub to sub column row
      // PageUp from expanded sub to main column row
      it('Moves focus across data cells with actions between expanded column rows for Page up', function () {
        context.testComponent.expandedRowIndexes = [0, 1, 2, 5];
        context.detectChanges();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(67);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();

        // check cell flow: start at index
        // 0 -> 5 -> 6 -> 7 -> 8 -> 11 -> 16 -> 42 -> 19 -> 45 -> 24
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[8]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[11]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[16]);

        // PageDown: from expanded main row to expanded main row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[42]);

        // PageUp: from expanded main row to expanded sub row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[19]);

        // PageDown: from expanded sub row to expanded sub row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[45]);

        // PageUp: from expanded sub row to expanded main row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[24]);
      });

      // | 0h| 1h| 2h| 3h| 4h| -> row header
      // | 5c| 6e| 7d| 8d| 9d| -> row 0
      // |10c|11e|12d|13d|14d| -> row 1
      //      .........
      // |25c|26e|27d|28d|29d| -> row 4 (data cells are replaced and hidden)
      // |       |30d|31d|32d|
      // |33c|34e|35d|36d|37d| -> row 5 (data cells are replaced and hidden)
      // |       |38d|39d|40d|
      //      .........
      // |51c|52e|53d|54d|55d| -> row 8
      // |56c|67e|58d|59d|60d| -> row 9

      // Covers key navigation over data cells
      // PageDown from NOT expanded to replaced column row (x2 because replaced row can be targeted)
      // PageUp from NOT expanded to replaced column row (x2 because replaced row can be targeted)
      // PageDown from replaced column row to NOT expanded row
      // PageUp from replaced column row to NOT expanded row
      it('Moves focus across data cells with actions between NOT expanded and replaced column rows', function () {
        context.testComponent.replaceCells = true;
        context.testComponent.expandedRowIndexes = [4, 5];
        context.detectChanges();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(61);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();

        // check cell flow: start at index
        // 0 -> 5 -> 6 -> 7 -> 8 -> 39 -> 18 -> 13 -> 39 -> 59 -> 54 -> 49 -> 39 -> 59 -> 54 -> 31
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[8]);

        // PageDown: from NOT expanded row to replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[39]);

        // PageUp: from replaced row to NOT expanded row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[18]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[13]);

        // PageDown: from NOT expanded row to replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[39]);

        // PageDown: from replaced row to NOT expanded row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[59]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[54]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[49]);

        // PageUp: from NOT expanded row to replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[31]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[59]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[54]);

        // PageUp: from NOT expanded row to replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[31]);
      });

      // | 0h| 1h| 2h| 3h| 4h| -> row header
      // | 5c| 6e| 7d| 8d| 9d| -> row 0
      // |10c|11e|12d|13d|14d| -> row 1 (data cells are replaced and hidden)
      // |       |15d|16d|17d|
      // |18c|19e|20d|21d|22d| -> row 2 (data cells are replaced and hidden)
      // |       |23d|24d|25d|
      //      .........
      // |36c|37e|38d|39d|40d| -> row 5 (data cells are replaced and hidden)
      // |       |41d|42d|43d|
      // |44c|45e|46d|47d|48d| -> row 6 (data cells are replaced and hidden)
      // |       |49d|50d|51d|
      //      .........

      // PageDown from replaced column row to replaced column row
      // PageUp from replaced column row to replaced column row
      it('Moves focus across data cells with actions between replaced and replaced column rows', function () {
        context.testComponent.replaceCells = true;
        context.testComponent.expandedRowIndexes = [1, 2, 5, 6];
        context.detectChanges();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(67);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();

        // check cell flow: start at index
        // 0 -> 5 -> 6 -> 7 -> 8 -> 16 -> 42 -> 24 -> 50
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[8]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[16]);

        // PageDown: from replaced row to replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[42]);

        // PageUp: from replaced row to replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[24]);

        // PageDown: from replaced row to replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[50]);
      });

      // | 0h| 1h| 2h| 3h| 4h| -> row header
      // | 5c| 6e| 7d| 8d| 9d| -> row 0
      // |10c|11e|12d|13d|14d| -> row 1
      // |15c|16e|17d|18d|19d| -> row 2
      // |20c|21e|22d|23d|24d| -> row 3
      // |25c|26e|27d|28d|29d| -> row 4
      // |       |----30d----|
      // |31c|32e|33d|34d|35d| -> row 5
      // |       |----36d----|
      // |37c|38e|39d|40d|41d| -> row 6
      // |       |----42d----|
      //      .........
      // |53c|54e|55d|56d|57d| -> row 9

      // Covers key navigation over data cells
      // PageUp and PageDown from NOT expanded row to expanded detail row
      // PageUp and PageDown from expanded detail row to NOT expanded row
      it('Moves focus across data cells with actions and expanded detail rows', function () {
        context.testComponent.columns = false;
        context.testComponent.expandedRowIndexes = [4, 5, 6];
        context.detectChanges();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(58);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();

        // check cell flow: start at index
        // 0 -> 5 -> 6 -> 7 -> 8 -> 34 -> 13 -> 36 -> 56 -> 36 -> 34 -> 56 -> 36 -> 18
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[8]);

        // PageDown: from not expanded row to expanded main row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[34]);

        // PageUp: from expanded main row to not expanded row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[13]);

        // PageDown: from not expanded row to expanded sub row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[36]);

        // PageDown: from expanded sub row to not expanded row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[55]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[56]);

        // PageUp: from not expanded row to expanded sub row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[36]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[33]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[34]);

        // PageDown: from expanded main row to not expanded row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[56]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[36]);

        // PageUp: from expanded sub row to not expanded row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[17]);
      });

      // Covers key navigation over action cells
      // PageUp and PageDown from NOT expanded row to expanded detail row
      // PageUp and PageDown from expanded detail row to NOT expanded row
      it('Moves focus across action cells with actions and expanded detail rows', function () {
        context.testComponent.columns = false;
        context.testComponent.expandedRowIndexes = [4, 5, 6];
        context.detectChanges();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(58);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();

        // check cell flow: start at index
        // 0 -> 5 -> 31 -> 10 -> 31 -> 53 -> 31 -> 53 -> 48 -> 31
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        // PageDown: from not expanded row to expanded main row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[31].querySelector('[type=checkbox]'));

        // PageUp: from expanded main row to not expanded row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[10].querySelector('[type=checkbox]'));

        // PageDown: from not expanded row to expanded sub row (goes to main row)
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[31].querySelector('[type=checkbox]'));

        // PageDown: from expanded main row to not expanded row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[53].querySelector('[type=checkbox]'));

        // PageUp: from not expanded row to expanded sub row (goes to main row)
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[31].querySelector('[type=checkbox]'));

        // PageDown: from expanded main row to not expanded row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[53].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[48].querySelector('[type=checkbox]'));

        // PageUp: from not expanded row to expanded main row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[31].querySelector('[type=checkbox]'));
      });

      // | 0h| 1h| 2h| 3h| 4h| -> row header
      // | 5c| 6e| 7d| 8d| 9d| -> row 0
      // |       |----10d----|
      // |11c|12e|13d|14d|15d| -> row 1
      //      .........
      // |26c|27e|28d|29d|30d| -> row 4
      // |       |----31d----|
      // |32c|33e|34d|35d|36d| -> row 5
      // |       |----37d----|
      //      .........
      // |53c|54e|55d|56d|57d| -> row 9
      // |       |----58d----|

      // Covers key navigation over data cells
      // PageDown from expanded main to expanded detail row
      // PageUp from expanded detail to expanded detail row
      // PageDown from expanded detail to expanded main row
      // PageUp from expanded main to expanded main row
      it('Moves focus across data cells with actions between expanded details and main rows', function () {
        context.testComponent.columns = false;
        context.testComponent.expandedRowIndexes = [0, 4, 5, 9];
        context.detectChanges();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(59);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();

        // check cell flow: start at index
        // 0 -> 5 -> 6 -> 7 -> 8 -> 31 -> 10 -> 34 -> 58 -> 55 -> 56 -> 35
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[8]);

        // PageDown: from expanded main row to expanded detail row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[31]);

        // PageUp: from expanded detail row to expanded detail row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[10]);

        // PageDown: from expanded detail row to expanded main row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[34]);

        // PageDown: from expanded main row to expanded detail row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[58]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[55]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[56]);

        // PageUp: from expanded main row to expanded main row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[35]);
      });

      // | 0h| 1h| 2h| 3h| 4h| -> row header
      // | 5c| 6e| 7d| 8d| 9d| -> row 0
      // |       |----10d----|
      // |11c|12e|13d|14d|15d| -> row 1
      // |       |----16d----|
      // |17c|18e|19d|20d|21d| -> row 2
      // |       |----22d----|
      //      .........
      // |33c|34e|35d|36d|37d| -> row 5
      // |       |----38d----|
      //      .........

      // Covers key navigation over data cells
      // PageDown from expanded main to main column row
      // PageUp from expanded main to sub column row
      // PageDown from expanded sub to sub column row
      // PageUp from expanded sub to main column row
      it('Moves focus across data cells with actions between expanded details and details rows', function () {
        context.testComponent.columns = false;
        context.testComponent.expandedRowIndexes = [0, 1, 2, 5];
        context.detectChanges();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(59);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();

        // check cell flow: start at index
        // 0 -> 5 -> 6 -> 7 -> 8 -> 10 -> 13 -> 14 -> 36 -> 16 -> 38 -> 19
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[8]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[10]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[13]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[14]);

        // PageDown: from expanded main row to expanded main row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[36]);

        // PageUp: from expanded main row to expanded details row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[16]);

        // PageDown: from expanded details row to expanded details row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[38]);

        // PageUp: from expanded details row to expanded main row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[19]);
      });

      // | 0h| 1h| 2h| 3h| 4h| -> row header
      // | 5c| 6e| 7d| 8d| 9d| -> row 0
      // |10c|11e|12d|13d|14d| -> row 1
      //      .........
      // |25c|26e|27d|28d|29d| -> row 4 (data cells are replaced and hidden)
      // |       |----30d----|
      // |31c|32e|33d|34d|35d| -> row 5 (data cells are replaced and hidden)
      // |       |----36d----|
      //      .........
      // |47c|48e|49d|50d|51d| -> row 8
      // |52c|53e|54d|55d|56d| -> row 9

      // Covers key navigation over data cells
      // PageDown from NOT expanded to replaced column row (x2 because replaced row can be targeted)
      // PageUp from NOT expanded to replaced column row (x2 because replaced row can be targeted)
      // PageDown from replaced column row to NOT expanded row
      // PageUp from replaced column row to NOT expanded row
      it('Moves focus across data cells with actions between NOT expanded and replaced details rows', function () {
        context.testComponent.replaceCells = true;
        context.testComponent.columns = false;
        context.testComponent.expandedRowIndexes = [4, 5];
        context.detectChanges();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(57);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();

        // check cell flow: start at index
        // 0 -> 5 -> 6 -> 7 -> 8 -> 36 -> 17 -> 12 -> 13 -> 36 -> 54 -> 55 -> 50 -> 45 -> 36 -> 54 -> 55 -> 50 -> 30
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[8]);

        // PageDown: from NOT expanded row to replaced details row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[36]);

        // PageUp: from replaced details row to NOT expanded row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[17]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[12]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[13]);

        // PageDown: from NOT expanded row to replaced details row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[36]);

        // PageDown: from replaced details row to NOT expanded row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[54]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[55]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[50]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[45]);

        // PageUp: from NOT expanded row to replaced details row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[30]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[54]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[55]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        compareToActiveElement(cells[50]);

        // PageUp: from NOT expanded row to replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[30]);
      });

      // | 0h| 1h| 2h| 3h| 4h| -> row header
      // | 5c| 6e| 7d| 8d| 9d| -> row 0
      // |10c|11e|12d|13d|14d| -> row 1 (data cells are replaced and hidden)
      // |       |----15d----|
      // |16c|17e|18d|19d|20d| -> row 2 (data cells are replaced and hidden)
      // |       |----21d----|
      //      .........
      // |32c|33e|34d|35d|36d| -> row 5 (data cells are replaced and hidden)
      // |       |----37d----|
      // |38c|39e|40d|41d|42d| -> row 6 (data cells are replaced and hidden)
      // |       |----43d----|
      //      .........

      // PageDown from replaced column row to replaced column row
      // PageUp from replaced column row to replaced column row
      it('Moves focus across data cells with actions between replaced details and replaced details rows', function () {
        context.testComponent.replaceCells = true;
        context.testComponent.columns = false;
        context.testComponent.expandedRowIndexes = [1, 2, 5, 6];
        context.detectChanges();

        cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(59);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();

        // check cell flow: start at index
        // 0 -> 5 -> 6 -> 7 -> 8 -> 15 -> 37 -> 21 -> 43
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        compareToActiveElement(cells[8]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        compareToActiveElement(cells[15]);

        // PageDown: from replaced row to replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[37]);

        // PageUp: from replaced row to replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        compareToActiveElement(cells[21]);

        // PageDown: from replaced row to replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        compareToActiveElement(cells[43]);
      });
    });
  });
}

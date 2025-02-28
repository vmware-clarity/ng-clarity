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
    <clr-datagrid [(clrDgSelected)]="selected">
      <clr-dg-column>First</clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>
      <clr-dg-column>Third</clr-dg-column>

      <clr-dg-row *ngFor="let item of items; index as i" [clrDgItem]="item">
        <clr-dg-cell>{{ item.col1 }}</clr-dg-cell>
        <clr-dg-cell>{{ item.col2 }}</clr-dg-cell>
        <clr-dg-cell>{{ item.col3 }}</clr-dg-cell>

        <ng-container ngProjectAs="clr-dg-row-detail" *ngIf="showRowDetail">
          <clr-dg-row-detail *clrIfExpanded="autoExpand && (i === 1 || i === 2)" [clrDgReplace]="replaceCells">
            <ng-template [ngIf]="columns">
              <clr-dg-cell>{{ item.col1 }} replaced</clr-dg-cell>
              <clr-dg-cell>{{ item.col2 }} replaced</clr-dg-cell>
              <clr-dg-cell>{{ item.col3 }} replaced</clr-dg-cell>
            </ng-template>

            <ng-template [ngIf]="!columns">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis id sed
              quam. Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit eget,
              pellentesque sed arcu. Vivamus in dui lectus. Suspendisse cursus est ac nisl imperdiet viverra. Aenean
              sagittis nibh lacus, in eleifend urna ultrices et. Mauris porttitor nisi nec velit pharetra porttitor.
              Vestibulum vulputate sollicitudin dolor ut tincidunt. Phasellus vitae blandit felis. Nullam posuere ipsum
              tincidunt velit pellentesque rhoncus. Morbi faucibus ut ipsum at malesuada. Nam vestibulum felis sit amet
              metus finibus hendrerit. Fusce faucibus odio eget ex vulputate rhoncus. Fusce nec aliquam leo, at suscipit
              diam.
            </ng-template>
          </clr-dg-row-detail>
        </ng-container>
      </clr-dg-row>
    </clr-datagrid>
  `,
})
class TestComponent {
  showRowDetail = false;
  autoExpand = false;
  columns = true;
  replaceCells = false;
  selected: any[];

  items = [
    {
      col1: 'row1-col1',
      col2: 'row1-col2',
      col3: 'row1-col3',
    },
    {
      col1: 'row2-col1',
      col2: 'row2-col2',
      col3: 'row2-col3',
    },
    {
      col1: 'row3-col1',
      col2: 'row3-col2',
      col3: 'row3-col3',
    },
    {
      col1: 'row4-col1',
      col2: 'row4-col2',
      col3: 'row4-col3',
    },
  ];
}

export default function (): void {
  describe('Key navigation controller', function () {
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
        expect(document.activeElement).toBe(cells[3]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[4]);

        // second time, to avoid cycling over cells with radios
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[5]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[8]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(document.activeElement).toBe(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[4]);
      });

      it('Moves focus with PageDown and PageUp no action cells', function () {
        // cell flow: start at index 0 -> 12 -> 3 end

        // focus at bottom datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        expect(document.activeElement).toBe(cells[12]);

        // focus at top datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        expect(document.activeElement).toBe(cells[3]);
      });

      it('Moves focus on Home and End no action cells', function () {
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[3]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        expect(document.activeElement).toBe(cells[5]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        expect(document.activeElement).toBe(cells[3]);
      });

      it('Moves focus on Ctrl-Home and Ctrl-End no action cells', function () {
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        expect(document.activeElement).toBe(cells[14]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        expect(document.activeElement).toBe(cells[0]);
      });

      it('Moves focus to a clicked element', function () {
        const testCell = 7;
        expect(document.activeElement).not.toBe(cells[testCell]);

        cells[testCell].dispatchEvent(new MouseEvent('mousedown', { buttons: 1, bubbles: true }));
        expect(document.activeElement).toBe(cells[testCell]);
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
        expect(document.activeElement).toBe(cells[4].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[5]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[6]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[11]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(document.activeElement).toBe(cells[10]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[6]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(document.activeElement).toBe(cells[5]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(document.activeElement).toBe(cells[4].querySelector('[type=checkbox]'));
      });

      it('Moves focus with PageDown and PageUp with action cells', function () {
        // cell flow: start at index 0 (check) -> 16 (check) -> 4 (check)  end

        // focus at bottom datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        expect(document.activeElement).toBe(cells[16].querySelector('[type=checkbox]'));

        // focus at top datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        expect(document.activeElement).toBe(cells[4].querySelector('[type=checkbox]'));
      });

      it('Moves focus on Home and End with action cells', function () {
        // cell flow: start at index 0 (check) -> 4 (check) -> 7 (check) -> 4 (check) end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[4].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        expect(document.activeElement).toBe(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        expect(document.activeElement).toBe(cells[4].querySelector('[type=checkbox]'));
      });

      it('Moves focus on Ctrl-Home and Ctrl-End with action cells', function () {
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        expect(document.activeElement).toBe(cells[19]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        expect(document.activeElement).toBe(cells[0]);
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
        expect(document.activeElement).toBe(cells[4].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[5]);

        // second time, to avoid cycling over cells with radios
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[6]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[10]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(document.activeElement).toBe(cells[9]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[5]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(document.activeElement).toBe(cells[4].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus with PageDown and PageUp with expand no action cells', function () {
        // cell flow: start at index 0 (check) -> 1 (check) -> 17 (check) -> 5 (check)  end

        // focus at bottom datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        expect(document.activeElement).toBe(cells[16].querySelector('button.datagrid-expandable-caret-button'));

        // focus at top datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        expect(document.activeElement).toBe(cells[4].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus on Home and End with expand no action cells', function () {
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[4].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        expect(document.activeElement).toBe(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        expect(document.activeElement).toBe(cells[4].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus on Ctrl-Home and Ctrl-End with expand no action cells', function () {
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        expect(document.activeElement).toBe(cells[19]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        expect(document.activeElement).toBe(cells[0]);
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
        expect(document.activeElement).toBe(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[8]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[13]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(document.activeElement).toBe(cells[12]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(document.activeElement).toBe(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(document.activeElement).toBe(cells[5].querySelector('[type=checkbox]'));
      });

      it('Moves focus with PageDown and PageUp with action and expand cells', function () {
        // cell flow: start at index 0 (check) -> 20 (check) -> 5 (check)  end

        // focus at bottom datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        expect(document.activeElement).toBe(cells[20].querySelector('[type=checkbox]'));

        // focus at top datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        expect(document.activeElement).toBe(cells[5].querySelector('[type=checkbox]'));
      });

      it('Moves focus on Home and End with action and expand cells', function () {
        // cell flow: start at index 0 (check) -> 4 (check) -> 7 (check) -> 4 (check) end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        expect(document.activeElement).toBe(cells[9]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        expect(document.activeElement).toBe(cells[5].querySelector('[type=checkbox]'));
      });

      it('Moves focus on Ctrl-Home and Ctrl-End with and expand action cells', function () {
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        expect(document.activeElement).toBe(cells[24]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        expect(document.activeElement).toBe(cells[0]);
      });
    });

    describe('Expandable datagrid with expanded column row and actions', function () {
      let context: TestContext<ClrDatagrid<number>, TestComponent>;
      let grid: HTMLElement;
      let cells: NodeListOf<HTMLElement>;

      beforeEach(function () {
        context = this.create(ClrDatagrid, TestComponent, [Selection]);
        context.testComponent.selected = [];
        context.testComponent.autoExpand = true;
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
        expect(document.activeElement).toBe(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[12]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[13]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[16]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[21]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[24]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[29]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[24]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(document.activeElement).toBe(cells[23]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[20]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[12]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[7]);
      });

      it('Moves focus across sticky cells with actions and expanded rows', function () {
        // check cell flow: start at index
        // 0 -> 5 -> 10 -> 11 -> 19 -> 18 -> 26 -> 27 -> 19 -> 18 -> 10 -> 11 -> 6
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[19].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(document.activeElement).toBe(cells[18].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[26].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[27].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[19].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(document.activeElement).toBe(cells[18].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[6].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus between sticky and data cells with actions and expanded rows', function () {
        // check cell flow: start at index
        // 0 -> 5 -> 10 -> 11 -> 12 -> 11 -> 12 -> 15 -> 11
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[12]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(document.activeElement).toBe(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[12]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(document.activeElement).toBe(cells[11].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus on Home and End with action and expand cells', function () {
        // cell flow: start at index
        // 0 -> 5 -> 10 -> 14 -> 10 -> 14 -> 17 -> 10
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        expect(document.activeElement).toBe(cells[14]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        expect(document.activeElement).toBe(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        expect(document.activeElement).toBe(cells[14]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[17]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        expect(document.activeElement).toBe(cells[10].querySelector('[type=checkbox]'));
      });
    });

    describe('Expandable datagrid with expanded replace column row and actions', function () {
      let context: TestContext<ClrDatagrid<number>, TestComponent>;
      let grid: HTMLElement;
      let cells: NodeListOf<HTMLElement>;

      beforeEach(function () {
        context = this.create(ClrDatagrid, TestComponent, [Selection]);
        context.testComponent.selected = [];
        context.testComponent.autoExpand = true;
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
        expect(document.activeElement).toBe(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[7]);

        // single Arrow Down will skip the replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[16]);

        // single Arrow Down will skip the replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[24]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[29]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(document.activeElement).toBe(cells[28]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[23]);

        // single Arrow Up will skip the replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[16]);

        // single Arrow Up will skip the replaced row
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[8]);
      });

      it('Moves focus between sticky and data cells with actions and expanded replaced rows', function () {
        // check cell flow: start at index
        // 0 -> 5 -> 10 -> 11 -> 15 -> 11
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(document.activeElement).toBe(cells[11].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus on Home and End with action and expand replaced cells', function () {
        // cell flow: start at index
        // 0 -> 5 -> 10 -> 17 -> 10
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        expect(document.activeElement).toBe(cells[17]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        expect(document.activeElement).toBe(cells[10].querySelector('[type=checkbox]'));
      });
    });

    describe('Expandable datagrid with expanded detail row and actions', function () {
      let context: TestContext<ClrDatagrid<number>, TestComponent>;
      let grid: HTMLElement;
      let cells: NodeListOf<HTMLElement>;

      beforeEach(function () {
        context = this.create(ClrDatagrid, TestComponent, [Selection]);
        context.testComponent.selected = [];
        context.testComponent.autoExpand = true;
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
        expect(document.activeElement).toBe(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[12]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[13]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[8]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[3]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[8]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[13]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[18]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[21]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[24]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[25]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[21]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[18]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[19]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[15]);
      });

      it('Moves focus between sticky and data cells with actions and expanded detail rows', function () {
        // check cell flow: start at index
        // 0 -> 5 -> 10 -> 11 -> 12 -> 15 -> 11
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[12]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(document.activeElement).toBe(cells[11].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus on Home and End with action and expanded detail row', function () {
        // cell flow: start at index
        // 0 -> 5 -> 10 -> 14 -> 15 -> 10
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        expect(document.activeElement).toBe(cells[14]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        expect(document.activeElement).toBe(cells[10].querySelector('[type=checkbox]'));
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
        context.testComponent.autoExpand = true;
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
        expect(document.activeElement).toBe(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[6].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[8]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[21]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[24]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[25]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[21]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowUp }));
        expect(document.activeElement).toBe(cells[7]);
      });

      it('Moves focus between sticky and data cells with actions and expanded replaced detail rows', function () {
        // check cell flow: start at index
        // 0 -> 5 -> 10 -> 11 -> 15 -> 11
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[11].querySelector('button.datagrid-expandable-caret-button'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        expect(document.activeElement).toBe(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
        expect(document.activeElement).toBe(cells[11].querySelector('button.datagrid-expandable-caret-button'));
      });

      it('Moves focus on Home and End with action and expanded replaced detail row', function () {
        // cell flow: start at index
        // 0 -> 5 -> 10 -> 15 -> 10
        // end

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[5].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[10].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        expect(document.activeElement).toBe(cells[15]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        expect(document.activeElement).toBe(cells[10].querySelector('[type=checkbox]'));
      });
    });
  });
}

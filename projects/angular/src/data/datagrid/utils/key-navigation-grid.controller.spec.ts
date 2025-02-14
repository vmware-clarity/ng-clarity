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

      <clr-dg-row *ngFor="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item.col1 }}</clr-dg-cell>
        <clr-dg-cell>{{ item.col2 }}</clr-dg-cell>
        <clr-dg-cell>{{ item.col3 }}</clr-dg-cell>

        <ng-container ngProjectAs="clr-dg-row-detail" *ngIf="!noRowDetail">
          <clr-dg-row-detail *clrIfExpanded [clrDgReplace]="replaceCells">
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

  noRowDetail = true;
  columns = true;
  replaceCells = false;
}

export default function (): void {
  describe('Key navigation controller', function () {
    describe('Basic datagrid', function () {
      let context: TestContext<ClrDatagrid<number>, TestComponent>;

      beforeEach(function () {
        context = this.create(ClrDatagrid, TestComponent);
      });

      //  data matrix 4*3 data, 3 headers. Legend: 0h -> Index: 0, Type: header/data
      // | 0h| 1h| 2h|
      // | 3d| 4d| 5h|
      // | 6d| 7c| 8d|
      // | 9d|10d|11d|
      // |12d|13d|14d|

      it('Moves focus across cells no action cells', function () {
        // cell flow: start at index 0 -> 3 -> 4 (check) -> 5 (check) -> 8 (check)-> 7 (check)-> 4 (check) end
        const grid = context.clarityElement.querySelector('[role=grid]');
        expect(grid).toBeDefined();
        const cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(15);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
        console.log(document.activeElement);
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
        // cell flow: start at index 0 (check) -> 12 (check) -> 3 (check)  end
        const grid = context.clarityElement.querySelector('[role=grid]');
        const cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');

        // focus at most left header cell
        cells[0].focus();

        // focus at bottom datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        expect(document.activeElement).toBe(cells[12]);

        // focus at top datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        expect(document.activeElement).toBe(cells[3]);
      });

      it('Moves focus on Home and End no action cells', function () {
        const grid = context.clarityElement.querySelector('[role=grid]');
        const cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        cells[0].focus();

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[3]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        expect(document.activeElement).toBe(cells[5]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        expect(document.activeElement).toBe(cells[3]);
      });

      it('Moves focus on Ctrl-Home and Ctrl-End no action cells', function () {
        const grid = context.clarityElement.querySelector('[role=grid]');
        const cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        cells[0].focus();

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        expect(document.activeElement).toBe(cells[14]);
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        expect(document.activeElement).toBe(cells[0]);
      });
    });

    describe('Basic datagrid with actions', function () {
      let context: TestContext<ClrDatagrid<number>, TestComponent>;

      beforeEach(function () {
        context = this.create(ClrDatagrid, TestComponent, [Selection]);
        context.testComponent.selected = [];
        context.detectChanges();
      });

      // Legend: 0h -> Index: 0, Type: header/check/action/data
      // data matrix 4*3 data, 4 checkbox, 4 headers.
      // | 0h| 1h| 2h| 3h|
      // | 4c| 5d| 6d| 7d|
      // | 8c| 9d|10d|11d|
      // |12c|13d|14d|15d|
      // |16c|17d|18d|19d|

      it('Moves focus across cells with action cells', function () {
        // check cell flow: start at index 0 -> 5 -> 6 -> 7 -> 8 -> 13 -> 12 -> 7 -> 6 -> 5 end
        const grid = context.clarityElement.querySelector('[role=grid]');
        expect(grid).toBeDefined();
        const cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        expect(cells.length).toBe(20);

        // need to start with this cell exactly, because it has tabindex=0
        cells[0].focus();

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
        const grid = context.clarityElement.querySelector('[role=grid]');
        const cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');

        // focus at most left header cell
        cells[0].focus();

        // focus at bottom datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageDown }));
        expect(document.activeElement).toBe(cells[16].querySelector('[type=checkbox]'));

        // focus at top datagrid cell
        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.PageUp }));
        expect(document.activeElement).toBe(cells[4].querySelector('[type=checkbox]'));
      });

      it('Moves focus on Home and End with action cells', function () {
        // cell flow: start at index 0 (check) -> 4 (check) -> 7 (check) -> 4 (check) end
        const grid = context.clarityElement.querySelector('[role=grid]');
        const cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');

        cells[0].focus();

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        expect(document.activeElement).toBe(cells[4].querySelector('[type=checkbox]'));

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End }));
        expect(document.activeElement).toBe(cells[7]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home }));
        expect(document.activeElement).toBe(cells[4].querySelector('[type=checkbox]'));
      });

      it('Moves focus on Ctrl-Home and Ctrl-End with action cells', function () {
        const grid = context.clarityElement.querySelector('[role=grid]');
        const cells = grid.querySelectorAll('[role=gridcell], [role=columnheader]');
        cells[0].focus();

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.End, ctrlKey: true }));
        expect(document.activeElement).toBe(cells[19]);

        grid.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.Home, ctrlKey: true }));
        expect(document.activeElement).toBe(cells[0]);
      });
    });
  });
}

/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrDatagrid } from './datagrid';
import { DATAGRID_SPEC_PROVIDERS, TestContext } from './helpers.spec';

export default function (): void {
  let context: TestContext<ClrDatagrid, any>;
  let datagrid: ClrDatagrid;
  let element: HTMLElement;

  describe('clrDgCtrlClickRowSelection', () => {
    beforeEach(function () {
      context = this.create(ClrDatagrid, TestComponent, DATAGRID_SPEC_PROVIDERS);

      datagrid = context.clarityDirective;
      element = context.fixture.nativeElement;
    });

    afterEach(() => {
      context.fixture.destroy();
    });

    it('deselects other rows when a modifier key is not pressed', () => {
      datagrid.selected = [1, 2, 3];
      context.detectChanges();

      element.querySelector<HTMLElement>('.row-4 clr-dg-cell')?.click();

      expect(datagrid.selection.current).toEqual([4]);
    });

    it('does not deselect other rows when the selection cell is clicked', () => {
      datagrid.selected = [1, 2, 3];
      context.detectChanges();

      element.querySelector<HTMLElement>('.row-4 .datagrid-select')?.click();

      expect(datagrid.selection.current).toEqual([1, 2, 3, 4]);
    });

    ['shift', 'ctrl', 'meta'].forEach(key => {
      it(`does not deselect other rows when ${key} key is pressed`, () => {
        datagrid.selected = [1, 2, 3];
        context.detectChanges();

        const clickEvent = new MouseEvent('click', { bubbles: true, [`${key}Key`]: true });
        element.querySelector<HTMLElement>('.row-4 clr-dg-cell')?.dispatchEvent(clickEvent);

        expect(datagrid.selection.current).toEqual([1, 2, 3, 4]);
      });
    });
  });
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column>First</clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>

      <clr-dg-row *ngFor="let item of items" class="row-{{ item }}" [clrDgItem]="item">
        <clr-dg-cell>{{ item }}</clr-dg-cell>
        <clr-dg-cell>{{ item * item }}</clr-dg-cell>
      </clr-dg-row>

      <clr-dg-footer>{{ items.length }} items</clr-dg-footer>
    </clr-datagrid>
  `,
})
class TestComponent {
  readonly items = [1, 2, 3, 4, 5];
}

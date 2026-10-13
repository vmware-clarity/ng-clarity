/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';

import { ClrDatagrid } from './datagrid';
import { ClrDatagridModule } from './datagrid.module';
import { SelectionType } from './enums/selection-type';
import { ClrDatagridTreeChildren } from './providers/tree.service';

interface Folder {
  id: string;
  children?: number;
}

@Component({
  template: `
    <clr-datagrid [clrDgSelectionType]="selectionType" [(clrDgSelected)]="selected" [clrDgItemsIdentityFn]="identity">
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-column>Size</clr-dg-column>
      <clr-dg-row
        *clrDgTreeItems="let folder of roots; children: getChildren; expandable: expandable; selects: selects"
        [clrDgItem]="folder"
      >
        <clr-dg-action-overflow>
          <button class="action-item">Rename</button>
        </clr-dg-action-overflow>
        <clr-dg-cell>{{ folder.id }}</clr-dg-cell>
        <clr-dg-cell>{{ folder.children || 0 }}</clr-dg-cell>
        <clr-dg-row-detail *clrIfExpanded>Never shown in a tree</clr-dg-row-detail>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class TreeTest {
  @ViewChild(ClrDatagrid) datagrid: ClrDatagrid<Folder>;

  selectionType = SelectionType.Multi;
  selected: Folder[] = [];
  roots: Folder[] = [{ id: 'a', children: 2 }, { id: 'b', children: 5 }, { id: 'c' }];
  requests: string[] = [];
  responses = new Subject<ClrDatagridTreeChildren<Folder>>();
  selects: 'self' | 'descendants' = 'descendants';

  identity = (folder: Folder) => folder.id;
  expandable = (folder: Folder) => !!folder.children;
  getChildren = (folder: Folder) => {
    this.requests.push(folder.id);
    return this.responses;
  };

  respond(parent: string, count: number) {
    this.responses.next(Array.from({ length: count }, (_, i) => ({ id: `${parent}${i + 1}` })));
  }
}

export default function (): void {
  describe('ClrDatagridTreeItems', function () {
    let fixture: ComponentFixture<TreeTest>;
    let context: TreeTest;
    let element: HTMLElement;

    function rowNames() {
      return rows().map(row => row.querySelector('clr-dg-cell').textContent.trim());
    }

    // The rows themselves, whichever container the datagrid's render cycle has put them in at this point.
    function rows(): HTMLElement[] {
      return Array.from(element.querySelectorAll('clr-dg-row:not(.datagrid-row-loading)'));
    }

    function toggle(index: number) {
      rows()[index].querySelector<HTMLButtonElement>('.datagrid-tree-toggle').click();
      fixture.detectChanges();
    }

    beforeEach(function () {
      TestBed.configureTestingModule({ imports: [ClrDatagridModule, NoopAnimationsModule], declarations: [TreeTest] });
      fixture = TestBed.createComponent(TreeTest);
      context = fixture.componentInstance;
      element = fixture.nativeElement;
      fixture.detectChanges();
    });

    afterEach(() => fixture.destroy());

    it('renders the roots as a treegrid with their level', function () {
      expect(rowNames()).toEqual(['a', 'b', 'c']);
      expect(element.querySelector('[role=treegrid]')).not.toBeNull();
      const row = rows()[0].querySelector('[role=row]');
      expect(row.getAttribute('aria-level')).toBe('1');
      expect(row.getAttribute('aria-expanded')).toBe('false');
    });

    it('puts the toggle in the indented first cell and leaves no room for expandable rows', function () {
      expect(element.querySelector('.datagrid-header .datagrid-expandable-caret')).toBeNull();
      rows().forEach(row => {
        expect(row.querySelector('.datagrid-row-master .datagrid-expandable-caret')).toBeNull();
      });
      expect(rows()[0].querySelector('.datagrid-tree-cell .datagrid-tree-toggle')).not.toBeNull();
    });

    it('only offers the toggle on expandable rows', function () {
      const toggles = rows().map(row => !!row.querySelector('.datagrid-tree-toggle'));
      expect(toggles).toEqual([true, true, false]);
    });

    it('fetches the children on expand and shows them below their parent', function () {
      toggle(0);
      expect(context.requests).toEqual(['a']);
      expect(rowNames()).toEqual(['a', 'b', 'c']);
      expect(rows()[0].querySelector('.datagrid-tree-toggle')).not.toBeNull();

      context.respond('a', 2);
      fixture.detectChanges();
      expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
      const child = rows()[1].querySelector('[role=row]');
      expect(child.getAttribute('aria-level')).toBe('2');
      expect(child.getAttribute('aria-posinset')).toBe('1');
      expect(child.getAttribute('aria-setsize')).toBe('2');
    });

    it('collapses without fetching again, and keeps the selection of hidden rows', async function () {
      toggle(0);
      context.respond('a', 2);
      fixture.detectChanges();

      context.datagrid.selection.setSelected({ id: 'a1' }, true);
      await fixture.whenStable();
      fixture.detectChanges();
      toggle(0);
      await fixture.whenStable();
      expect(rowNames()).toEqual(['a', 'b', 'c']);
      expect(context.selected.map(f => f.id)).toEqual(['a1']);

      toggle(0);
      expect(context.requests.length).toBe(1);
      expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
    });

    it('keeps rows expanded when the roots are replaced', function () {
      toggle(0);
      context.respond('a', 2);
      fixture.detectChanges();

      context.roots = context.roots.map(folder => ({ ...folder }));
      fixture.detectChanges();
      expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
      expect(context.requests.length).toBe(1);
    });

    it('gives child rows their own actions and selection', function () {
      toggle(0);
      context.respond('a', 2);
      fixture.detectChanges();
      expect(rows()[1].querySelector('clr-dg-action-overflow')).not.toBeNull();
      expect(rows()[1].querySelector('input[type=checkbox]')).not.toBeNull();
    });

    it('selects only the row itself by default', async function () {
      context.selects = undefined;
      fixture.detectChanges();
      toggle(0);
      context.respond('a', 2);
      fixture.detectChanges();
      await fixture.whenStable();
      rows()[0].querySelector<HTMLLabelElement>('.datagrid-select label').click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(context.datagrid.selection.current.map(folder => folder.id)).toEqual(['a']);
      expect(rows()[0].querySelector<HTMLInputElement>('.datagrid-select input').indeterminate).toBe(false);
    });

    describe('multi-selection of descendants', function () {
      function checkbox(index: number) {
        return rows()[index].querySelector<HTMLInputElement>('.datagrid-select input');
      }

      function selectedIds() {
        return context.datagrid.selection.current.map(folder => folder.id).sort();
      }

      // Through the label, like a user: it is what covers the checkbox.
      async function click(index: number) {
        rows()[index].querySelector<HTMLLabelElement>('.datagrid-select label').click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
      }

      beforeEach(async function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();
        // Lets the checkboxes take their initial value before the tests click them.
        await fixture.whenStable();
        // a, a1, a2, b, c
      });

      it('selects and deselects a parent with its loaded descendants', async function () {
        await click(0);
        expect(selectedIds()).toEqual(['a', 'a1', 'a2']);
        expect(context.selected.map(folder => folder.id).sort()).toEqual(['a', 'a1', 'a2']);

        await click(0);
        expect(selectedIds()).toEqual([]);
      });

      it('makes a parent indeterminate when only some children are selected', async function () {
        await click(1);
        expect(selectedIds()).toEqual(['a1']);
        expect(checkbox(0).indeterminate).toBe(true);
        expect(checkbox(0).checked).toBe(false);

        await click(2);
        expect(selectedIds()).toEqual(['a', 'a1', 'a2']);
        expect(checkbox(0).indeterminate).toBe(false);
        expect(checkbox(0).checked).toBe(true);
      });

      it('deselects the parent when one of its children is deselected', async function () {
        await click(0);
        await click(2);
        expect(selectedIds()).toEqual(['a1']);
        expect(checkbox(0).indeterminate).toBe(true);
      });

      it('selects children that load after their parent was selected', async function () {
        await click(3); // b, not loaded yet
        toggle(3);
        context.respond('b', 2);
        fixture.detectChanges();
        await fixture.whenStable();
        // Lets the two-way [(clrDgSelected)] binding catch up, as the application would.
        fixture.detectChanges();
        expect(selectedIds()).toEqual(['b', 'b1', 'b2']);
      });

      it('selects everything loaded from the header checkbox', async function () {
        element.querySelector<HTMLLabelElement>('.datagrid-header .datagrid-select label').click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(selectedIds()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
      });
    });
  });
}

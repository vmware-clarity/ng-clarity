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
        *clrDgTreeItems="let folder of roots; children: getChildren; expandable: expandable"
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
  requests: { id: string; skip: number }[] = [];
  responses = new Subject<ClrDatagridTreeChildren<Folder>>();
  chunked = false;

  identity = (folder: Folder) => folder.id;
  expandable = (folder: Folder) => !!folder.children;
  getChildren = (folder: Folder, skip: number) => {
    this.requests.push({ id: folder.id, skip });
    return this.responses;
  };

  respond(parent: string, count: number, skip = 0, total = count) {
    const items = Array.from({ length: count }, (_, i) => ({ id: `${parent}${skip + i + 1}` }));
    this.responses.next(this.chunked ? { items, total } : items);
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
      rows()[index].querySelector<HTMLButtonElement>('.datagrid-expandable-caret-button').click();
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

    it('puts the toggle in the expand column and leaves no room for expandable rows', function () {
      expect(element.querySelectorAll('.datagrid-header .datagrid-expandable-caret').length).toBe(1);
      rows().forEach(row => {
        expect(row.querySelectorAll('.datagrid-row-master .datagrid-expandable-caret').length).toBe(1);
      });
      expect(rows()[0].querySelector('.datagrid-tree-cell').textContent.trim()).toBe('a');
    });

    it('only offers the toggle on expandable rows', function () {
      const toggles = rows().map(row => !!row.querySelector('.datagrid-expandable-caret-button'));
      expect(toggles).toEqual([true, true, false]);
    });

    it('fetches the children on expand and shows them below their parent', function () {
      toggle(0);
      expect(context.requests).toEqual([{ id: 'a', skip: 0 }]);
      expect(rows()[0].querySelector('clr-spinner')).not.toBeNull();

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

    it('loads children in chunks', function () {
      context.chunked = true;
      toggle(1);
      context.respond('b', 2, 0, 5);
      fixture.detectChanges();
      expect(rowNames()).toEqual(['a', 'b', 'b1', 'b2', 'c']);

      const loadMore = element.querySelector<HTMLButtonElement>('.datagrid-tree-load-more-button');
      expect(loadMore.textContent).toContain('2 / 5');
      loadMore.click();
      expect(context.requests).toEqual([
        { id: 'b', skip: 0 },
        { id: 'b', skip: 2 },
      ]);
      context.respond('b', 3, 2, 5);
      fixture.detectChanges();
      expect(rowNames()).toEqual(['a', 'b', 'b1', 'b2', 'b3', 'b4', 'b5', 'c']);
      expect(element.querySelector('.datagrid-tree-load-more-button')).toBeNull();
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

    describe('multi-selection', function () {
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
        context.chunked = true;
        toggle(0);
        context.respond('a', 2, 0, 2);
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
        context.respond('b', 2, 0, 5);
        fixture.detectChanges();
        await fixture.whenStable();
        // Lets the two-way [(clrDgSelected)] binding catch up, as the application would.
        fixture.detectChanges();
        expect(selectedIds()).toEqual(['b', 'b1', 'b2']);

        rows()[5].querySelector<HTMLButtonElement>('.datagrid-tree-load-more-button').click();
        context.respond('b', 3, 2, 5);
        fixture.detectChanges();
        expect(selectedIds()).toEqual(['b', 'b1', 'b2', 'b3', 'b4', 'b5']);
      });

      it('keeps a parent with children left to load out of the selection until it is selected itself', async function () {
        toggle(3);
        context.respond('b', 2, 0, 5);
        fixture.detectChanges();
        await click(4);
        await click(5);
        expect(selectedIds()).toEqual(['b1', 'b2']);
        expect(checkbox(3).indeterminate).toBe(true);
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

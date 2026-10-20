/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { delay } from '@clr/angular/testing';
import { Subject } from 'rxjs';

import { ClrDatagrid } from './datagrid';
import { ClrDatagridCell } from './datagrid-cell';
import { ClrDatagridModule } from './datagrid.module';
import { SelectionType } from './enums/selection-type';
import { Page } from './providers/page';
import {
  ClrDatagridTreeChildren,
  ClrDatagridTreeExpandedChange,
  ClrDatagridTreeLoadError,
} from './providers/tree.service';

interface Folder {
  id: string;
  children?: number;
}

type LoaderKind = 'observable' | 'promise' | 'sync';

@Component({
  template: `
    <clr-datagrid
      [clrDgSelectionType]="selectionType"
      [(clrDgSelected)]="selected"
      [clrDgItemsIdentityFn]="identity"
      (clrDgTreeExpandedChange)="expandedChanges.push($event)"
      (clrDgTreeLoadError)="errors.push($event)"
    >
      <clr-dg-column [clrDgTreeColumn]="treeOnName">Name</clr-dg-column>
      <clr-dg-column [clrDgPinned]="pinSize" [clrDgTreeColumn]="treeOnSize">Size</clr-dg-column>
      <clr-dg-row
        *clrDgTreeItems="let folder of roots; children: getChildren; expandable: expandable; selects: selects"
        [clrDgItem]="folder"
      >
        <clr-dg-action-overflow>
          <button type="button" class="action-item">Rename</button>
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
  selects: 'self' | 'descendants' = 'descendants';
  pinSize = false;
  treeOnName = false;
  treeOnSize = false;
  loader: LoaderKind = 'observable';
  expandedChanges: ClrDatagridTreeExpandedChange<Folder>[] = [];
  errors: ClrDatagridTreeLoadError<Folder>[] = [];
  // One answer channel per parent, like separate requests to a server.
  private observables = new Map<string, Subject<ClrDatagridTreeChildren<Folder>>>();
  private promises = new Map<string, (children: Folder[]) => void>();

  identity = (folder: Folder) => folder.id;
  expandable = (folder: Folder) => !!folder.children;
  getChildren = (folder: Folder) => {
    this.requests.push(folder.id);
    switch (this.loader) {
      case 'sync':
        return this.childrenOf(folder.id, folder.children);
      case 'promise':
        return new Promise<Folder[]>(resolve => this.promises.set(folder.id, resolve));
      default: {
        const answer = new Subject<ClrDatagridTreeChildren<Folder>>();
        this.observables.set(folder.id, answer);
        return answer;
      }
    }
  };

  respond(parent: string, count: number) {
    const children = this.childrenOf(parent, count);
    if (this.loader === 'promise') {
      this.promises.get(parent)(children);
    } else {
      this.observables.get(parent).next(children);
    }
  }

  fail(parent: string) {
    this.observables.get(parent).error(new Error('offline'));
  }

  private childrenOf(parent: string, count: number): Folder[] {
    return Array.from({ length: count }, (_, i) => ({ id: `${parent}${i + 1}` }));
  }
}

@Component({
  template: `
    <clr-datagrid [clrDgItemsIdentityFn]="identity" style="height: 20rem">
      <clr-dg-column>Name</clr-dg-column>
      <ng-template
        ClrVirtualScroll
        let-folder
        [clrVirtualTreeOf]="roots"
        [clrVirtualTreeChildren]="getChildren"
        [clrVirtualTreeExpandable]="expandable"
        [clrVirtualRowsItemSize]="25"
      >
        <clr-dg-row [clrDgItem]="folder">
          <clr-dg-cell>{{ folder.id }}</clr-dg-cell>
        </clr-dg-row>
      </ng-template>
    </clr-datagrid>
  `,
  standalone: false,
})
class VirtualTreeTest {
  roots: Folder[] = [{ id: 'a', children: 2 }, { id: 'b' }];

  identity = (folder: Folder) => folder.id;
  expandable = (folder: Folder) => !!folder.children;
  getChildren = (folder: Folder) => Array.from({ length: folder.children }, (_, i) => ({ id: `${folder.id}${i + 1}` }));
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-row *ngFor="let folder of roots" [clrDgItem]="folder">
        <clr-dg-cell>{{ folder.id }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class FlatTest {
  roots: Folder[] = [{ id: 'a' }, { id: 'b' }];
}

export default function (): void {
  describe('ClrDatagridTreeItems', function () {
    let fixture: ComponentFixture<TreeTest>;
    let context: TreeTest;
    let element: HTMLElement;

    // The rows themselves, whichever container the datagrid's render cycle has put them in at this point.
    function rows(): HTMLElement[] {
      return Array.from(element.querySelectorAll('clr-dg-row:not(.datagrid-row-loading)'));
    }

    // The visible text of the first cell, without the hidden label of the toggle.
    function rowNames() {
      return rows().map(row => row.querySelector<HTMLElement>('clr-dg-cell').innerText.trim());
    }

    function masterRow(index: number) {
      return rows()[index].querySelector('[role=row]');
    }

    function toggleButton(index: number) {
      return rows()[index].querySelector<HTMLButtonElement>('.datagrid-tree-toggle');
    }

    function toggle(index: number) {
      toggleButton(index).click();
      fixture.detectChanges();
    }

    function press(index: number, key: string) {
      toggleButton(index).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      fixture.detectChanges();
    }

    beforeEach(function () {
      TestBed.configureTestingModule({
        imports: [ClrDatagridModule, NoopAnimationsModule],
        declarations: [TreeTest, VirtualTreeTest, FlatTest],
      });
      fixture = TestBed.createComponent(TreeTest);
      context = fixture.componentInstance;
      element = fixture.nativeElement;
      fixture.detectChanges();
    });

    afterEach(() => fixture.destroy());

    describe('View', function () {
      it('renders the roots as a treegrid with their level', function () {
        expect(rowNames()).toEqual(['a', 'b', 'c']);
        expect(element.querySelector('[role=treegrid]')).not.toBeNull();
        expect(masterRow(0).getAttribute('aria-level')).toBe('1');
        expect(masterRow(0).getAttribute('aria-expanded')).toBe('false');
        expect(masterRow(0).getAttribute('aria-setsize')).toBe('3');
      });

      it('puts the toggle in the indented first cell and leaves no room for expandable rows', function () {
        expect(element.querySelector('.datagrid-header .datagrid-expandable-caret')).toBeNull();
        rows().forEach(row => {
          expect(row.querySelector('.datagrid-row-master .datagrid-expandable-caret')).toBeNull();
        });
        expect(rows()[0].querySelector('.datagrid-tree-cell .datagrid-tree-toggle')).not.toBeNull();
      });

      // The cell of a column, wherever the column is on screen.
      function cellOf(row: number, text: RegExp) {
        return Array.from(rows()[row].querySelectorAll<HTMLElement>('clr-dg-cell')).find(cell =>
          text.test(cell.innerText.trim())
        );
      }

      it('keeps the toggle in its column when another column is pinned', async function () {
        context.pinSize = true;
        fixture.detectChanges();
        await fixture.whenStable();
        expect(cellOf(0, /^a$/).querySelector('.datagrid-tree-toggle')).not.toBeNull();
        expect(cellOf(0, /^2$/).querySelector('.datagrid-tree-toggle')).toBeNull();
      });

      it('puts the toggle in the columns marked as tree columns', function () {
        context.treeOnSize = true;
        fixture.detectChanges();
        expect(cellOf(0, /^a$/).querySelector('.datagrid-tree-toggle')).toBeNull();
        expect(cellOf(0, /^2$/).querySelector('.datagrid-tree-toggle')).not.toBeNull();
        expect(cellOf(0, /^2$/).classList).toContain('datagrid-tree-cell');

        context.treeOnName = true;
        fixture.detectChanges();
        expect(rows()[0].querySelectorAll('.datagrid-tree-toggle').length).toBe(2);
      });

      it('counts the roots across pages once the total comes in', function () {
        fixture.debugElement.query(By.directive(ClrDatagrid)).injector.get(Page).totalItems = 23;
        fixture.detectChanges();
        expect(masterRow(0).getAttribute('aria-posinset')).toBe('1');
        expect(masterRow(0).getAttribute('aria-setsize')).toBe('23');
      });

      it('only offers the toggle on expandable rows', function () {
        expect(rows().map(row => !!row.querySelector('.datagrid-tree-toggle'))).toEqual([true, true, false]);
      });

      it('names the toggle with the action and the leading cell of its row', function () {
        const button = toggleButton(0);
        const [action, cell] = button.getAttribute('aria-labelledby').split(' ');
        expect(document.getElementById(action).textContent.trim()).toBe('Expand');
        expect(document.getElementById(cell)).toBe(rows()[0].querySelector<HTMLElement>('clr-dg-cell'));
      });

      it('names the toggle of another column after the leading cell too, a pinned one first', async function () {
        context.treeOnSize = true;
        fixture.detectChanges();
        const labelCell = () => document.getElementById(toggleButton(0).getAttribute('aria-labelledby').split(' ')[1]);
        expect(labelCell()).toBe(cellOf(0, /^a$/));

        context.pinSize = true;
        fixture.detectChanges();
        await fixture.whenStable();
        expect(labelCell()).toBe(cellOf(0, /^2$/));
      });

      it('indents the content inside the cell, which keeps the padding of its header', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();
        const content = (index: number) => rows()[index].querySelector<HTMLElement>('.datagrid-tree-cell-content');
        const indent = (index: number) => content(index).getBoundingClientRect().left;
        expect(indent(1) - indent(0)).toBeGreaterThan(0);
        expect(getComputedStyle(cellOf(0, /^a$/)).paddingLeft).toBe(getComputedStyle(cellOf(1, /^a1$/)).paddingLeft);
        // The toggle sits in the indentation, before the content.
        expect(toggleButton(0).getBoundingClientRect().right).toBeLessThanOrEqual(indent(0) + 0.5);
      });

      it('leaves the cells of other datagrids alone', function () {
        const flat = TestBed.createComponent(FlatTest);
        flat.detectChanges();
        const cells = flat.debugElement.queryAll(By.directive(ClrDatagridCell));
        expect(cells.length).toBe(2);
        cells.forEach(cell => expect(cell.componentInstance._treeRow).toBeNull());
        expect(flat.nativeElement.querySelector('.datagrid-tree-cell')).toBeNull();
        flat.destroy();
      });
    });

    describe('Loading children', function () {
      it('fetches the children on expand and shows them below their parent', function () {
        toggle(0);
        expect(context.requests).toEqual(['a']);
        expect(rowNames()).toEqual(['a', 'b', 'c']);
        expect(masterRow(0).getAttribute('aria-busy')).toBe('true');
        expect(toggleButton(0)).not.toBeNull();

        context.respond('a', 2);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
        expect(masterRow(0).getAttribute('aria-busy')).toBeNull();
        expect(masterRow(1).getAttribute('aria-level')).toBe('2');
        expect(masterRow(1).getAttribute('aria-posinset')).toBe('1');
        expect(masterRow(1).getAttribute('aria-setsize')).toBe('2');
      });

      it('is no longer busy when the row is collapsed before its children come in', function () {
        toggle(0);
        expect(masterRow(0).getAttribute('aria-busy')).toBe('true');
        toggle(0);
        expect(masterRow(0).getAttribute('aria-busy')).toBeNull();
        context.respond('a', 2);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'b', 'c']);
      });

      it('uses the first answer of a loader only', function () {
        toggle(0);
        context.respond('a', 2);
        context.respond('a', 4);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
      });

      it('accepts a Promise', async function () {
        context.loader = 'promise';
        toggle(0);
        context.respond('a', 1);
        await fixture.whenStable();
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'b', 'c']);
      });

      it('accepts children returned directly', function () {
        context.loader = 'sync';
        toggle(0);
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
        expect(masterRow(0).getAttribute('aria-busy')).toBeNull();
      });

      it('closes the row again and reports the error when loading fails', function () {
        toggle(0);
        context.fail('a');
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'b', 'c']);
        expect(masterRow(0).getAttribute('aria-expanded')).toBe('false');
        expect(masterRow(0).getAttribute('aria-busy')).toBeNull();
        expect(context.errors.length).toBe(1);
        expect(context.errors[0].item.id).toBe('a');

        toggle(0);
        expect(context.requests).toEqual(['a', 'a']);
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

      it('keeps the children of a row that goes away, e.g. to another page, for when it comes back', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();

        const page = context.roots;
        context.roots = [{ id: 'd' }];
        fixture.detectChanges();
        context.roots = page.map(folder => ({ ...folder }));
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
        expect(context.requests).toEqual(['a']);
      });

      it('fetches the children of rows on other pages again after a reload of the whole tree', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();
        const page = context.roots;
        context.roots = [{ id: 'd' }];
        fixture.detectChanges();

        context.datagrid.reloadChildren();
        context.roots = page;
        fixture.detectChanges();
        expect(context.requests).toEqual(['a', 'a']);
      });

      it('keeps the rows when the roots are replaced by copies', function () {
        const before = rows();
        context.roots = context.roots.map(folder => ({ ...folder }));
        fixture.detectChanges();
        expect(rows()).toEqual(before);
      });

      it('drops the toggle of a row whose children are empty, also after the roots are replaced', function () {
        toggle(1);
        context.respond('b', 0);
        fixture.detectChanges();
        expect(toggleButton(1)).toBeNull();
        expect(masterRow(1).getAttribute('aria-expanded')).toBeNull();

        context.roots = context.roots.map(folder => ({ ...folder }));
        fixture.detectChanges();
        expect(toggleButton(1)).toBeNull();
      });

      it('gives the focus to the cell when the focused toggle goes away', function () {
        toggleButton(1).focus();
        toggle(1);
        context.respond('b', 0);
        fixture.detectChanges();
        expect(document.activeElement).toBe(rows()[1].querySelector('clr-dg-cell'));
      });

      it('fetches the children of one row again', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();

        context.datagrid.reloadChildren(context.roots[0]);
        fixture.detectChanges();
        expect(context.requests).toEqual(['a', 'a']);
        context.respond('a', 3);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'a3', 'b', 'c']);
      });

      it('fetches the open rows again, and the closed ones when they open', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();
        toggle(3); // b
        context.respond('b', 1);
        fixture.detectChanges();
        toggle(3); // b, closed again
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
        expect(context.requests).toEqual(['a', 'b']);

        context.datagrid.reloadChildren();
        fixture.detectChanges();
        expect(context.requests).toEqual(['a', 'b', 'a']);

        toggle(1); // b, now that a's children are not loaded yet
        expect(context.requests).toEqual(['a', 'b', 'a', 'b']);
      });
    });

    describe('Focus', function () {
      it('goes to the collapsed row when the row that had it is hidden', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();
        const cell = rows()[1].querySelector<HTMLElement>('clr-dg-cell');
        cell.setAttribute('tabindex', '-1');
        cell.focus();

        context.datagrid.setTreeItemExpanded(context.roots[0], false);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'b', 'c']);
        expect(document.activeElement).toBe(toggleButton(0));
      });
    });

    describe('TypeScript API', function () {
      it('expands and collapses rows from code and reports it', function () {
        context.datagrid.setTreeItemExpanded(context.roots[0], true);
        fixture.detectChanges();
        expect(context.requests).toEqual(['a']);
        context.datagrid.setTreeItemExpanded(context.roots[0], false);
        fixture.detectChanges();
        expect(context.expandedChanges.map(change => [change.item.id, change.expanded])).toEqual([
          ['a', true],
          ['a', false],
        ]);
      });
    });

    describe('Keyboard', function () {
      it('expands with Right and collapses with Left on the toggle', function () {
        press(0, 'ArrowRight');
        expect(context.requests).toEqual(['a']);
        context.respond('a', 2);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);

        press(0, 'ArrowLeft');
        expect(rowNames()).toEqual(['a', 'b', 'c']);
      });

      it('does not mirror the keys in right-to-left, like the navigation between cells', function () {
        element.setAttribute('dir', 'rtl');
        press(0, 'ArrowRight');
        expect(context.requests).toEqual(['a']);
        press(0, 'ArrowLeft');
        expect(masterRow(0).getAttribute('aria-expanded')).toBe('false');
      });

      it('keeps the focus on the toggle when the children come in', function () {
        toggleButton(0).focus();
        press(0, 'ArrowRight');
        context.respond('a', 2);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
        expect(document.activeElement).toBe(toggleButton(0));
      });
    });

    describe('Selection', function () {
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

      describe('of descendants', function () {
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
          expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'b1', 'b2', 'c']);
          expect(selectedIds()).toEqual(['b', 'b1', 'b2']);
        });

        it('takes the loaded descendants of rows selected on their own when the mode changes', async function () {
          context.selects = 'self';
          fixture.detectChanges();
          await click(0);
          expect(selectedIds()).toEqual(['a']);

          context.selects = 'descendants';
          fixture.detectChanges();
          await fixture.whenStable();
          expect(selectedIds()).toEqual(['a', 'a1', 'a2']);
        });

        it('selects everything loaded from the header checkbox', async function () {
          element.querySelector<HTMLLabelElement>('.datagrid-header .datagrid-select label').click();
          fixture.detectChanges();
          await fixture.whenStable();
          expect(selectedIds()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
        });
      });
    });

    describe('Virtual scroll', function () {
      it('renders the expanded tree as one list', async function () {
        const virtual = TestBed.createComponent(VirtualTreeTest);
        virtual.detectChanges();
        await delay();
        virtual.detectChanges();
        const names = () =>
          Array.from(virtual.nativeElement.querySelectorAll('.datagrid-rows clr-dg-row')).map((row: HTMLElement) =>
            row.querySelector<HTMLElement>('clr-dg-cell').innerText.trim()
          );
        expect(names()).toEqual(['a', 'b']);
        expect(virtual.nativeElement.querySelector('[role=treegrid]').getAttribute('aria-rowcount')).toBe('2');

        virtual.nativeElement.querySelector('.datagrid-tree-toggle').click();
        virtual.detectChanges();
        await delay();
        virtual.detectChanges();
        expect(names()).toEqual(['a', 'a1', 'a2', 'b']);
        expect(virtual.nativeElement.querySelector('[role=treegrid]').getAttribute('aria-rowcount')).toBe('4');
        virtual.destroy();
      });

      it('keeps the focus on its item when rows are inserted above it', async function () {
        const virtual = TestBed.createComponent(VirtualTreeTest);
        virtual.detectChanges();
        await delay();
        virtual.detectChanges();
        const rowsOf = () =>
          Array.from<HTMLElement>(virtual.nativeElement.querySelectorAll('.datagrid-rows clr-dg-row'));
        const cell = rowsOf()[1].querySelector<HTMLElement>('clr-dg-cell');
        cell.setAttribute('tabindex', '-1');
        cell.focus();

        rowsOf()[0].querySelector<HTMLButtonElement>('.datagrid-tree-toggle').click();
        virtual.detectChanges();
        await delay();
        virtual.detectChanges();
        await delay();
        expect(
          document.activeElement.closest('clr-dg-row').querySelector<HTMLElement>('clr-dg-cell').innerText.trim()
        ).toBe('b');
        virtual.destroy();
      });
    });
  });
}
